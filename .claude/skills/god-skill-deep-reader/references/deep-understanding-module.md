# Модул за дубоко разумевање и повезивање чињеница: Пропис ↔ Пракса

**Архитектурни додатак за аутономног правног истраживачког агента**

-----

## Зашто је ово критично

Основни RAG систем ради ово: корисник пита → агент тражи сличне чанкове → враћа цитате. То је правни Google — корисно, али не и интелигентно. Агент који **разуме** право мора да:

1. **Парсира структуру правног аргумента** — разликује ratio decidendi од obiter dicta, нормативну одредбу од дефиниције, обавезу од овлашћења
1. **Повезује чињенице кроз више докумената** — прати ланац: закон → подзаконски акт → судска одлука → измена → нова пракса
1. **Премошћује јаз између прописа и праксе** — детектује када суд тумачи одредбу другачије од законодавне намере

Ово захтева **три нова слоја** у постојећој архитектури, без компромиса на претходне модуле.

-----

## СЛОЈ 1: Дубоко разумевање појединачних докумената

### 1.1 Вишенивоско парсирање правних текстова

Српски закони имају строгу хијерархију: **Закон → Део → Глава → Одељак → Члан → Став → Тачка → Подтачка**. Судске одлуке имају другу: **Изрека → Образложење → Чињенично стање → Правна оцена → Одлука о трошковима**.

Агент мора да парсира оба формата у **структуриране објекте**, не у равне текстуалне чанкове:

```python
from pydantic import BaseModel
from enum import Enum

class NormType(Enum):
    OBLIGATION = "obaveza"        # "dužan je", "mora", "obavezan je"
    PROHIBITION = "zabrana"       # "zabranjeno je", "ne sme", "ne može"
    PERMISSION = "ovlašćenje"     # "može", "ima pravo", "ovlašćen je"
    DEFINITION = "definicija"     # "smatra se", "jeste", "pod X se podrazumeva"
    CONDITION = "uslov"           # "ako", "ukoliko", "pod uslovom da"
    EXCEPTION = "izuzetak"        # "izuzetno", "osim ako", "ne primenjuje se na"
    SANCTION = "sankcija"         # "kazniće se", "novčana kazna"
    TEMPORAL = "temporalna"       # "stupa na snagu", "primenjuje se od"
    PROCEDURAL = "procesna"       # "podnosi se", "rok za", "nadležan je"

class LegalProvision(BaseModel):
    eli_uri: str                  # ELI identifikator
    law_name: str
    article_number: str
    paragraph: str | None
    point: str | None
    text: str                     # Pun tekst odredbe
    norm_type: NormType           # Klasifikacija tipa norme
    subjects: list[str]           # Ko je adresat norme
    objects: list[str]            # Na šta se norma odnosi
    conditions: list[str]         # Uslovi za primenu
    exceptions: list[str]         # Izuzeci
    cross_references: list[str]   # Reference na druge članove/zakone
    temporal_scope: dict          # {"from": date, "to": date | None}
    sl_glasnik: str               # "Sl. glasnik RS, br. XX/YYYY"

class CourtDecisionStructure(BaseModel):
    court: str                    # "Vrhovni kasacioni sud"
    case_number: str              # "Rev. 1234/2023"
    date: str
    panel: list[str]              # Sudsko veće
    
    # Структура образложења
    facts: str                    # Утврђено чињенично стање
    procedural_history: str       # Ток поступка
    legal_issues: list[str]       # Спорна правна питања
    ratio_decidendi: str          # КЉУЧНО — обавезујуће правно правило
    obiter_dicta: list[str]       # Успутна запажања (необавезујућа)
    applied_provisions: list[str] # Примењени прописи
    cited_precedents: list[str]   # Цитиране ранија пракса
    disposition: str              # Изрека (усвајање/одбијање)
    
    # Аналитички метаподаци
    interpretation_method: str    # "gramatičko", "teleološko", "sistematsko"
    novelty_score: float          # Колико одступа од ранијe праксе
```

### 1.2 Класификација нормативних исказа помоћу Claude-а

Уместо NLP модела за класификацију (који не разуме српски правни регистар), користити Claude Haiku са структурираним излазом:

```python
NORM_CLASSIFICATION_PROMPT = """Анализирај следећу правну одредбу из српског закона.

<provision>
{article_text}
</provision>

Класификуј:
1. Тип норме (обавеза/забрана/овлашћење/дефиниција/услов/изузетак/санкција/временска/процесна)
2. Адресат норме (ко је обавезан/овлашћен)  
3. Објект регулисања (шта се регулише)
4. Услови за примену (ако постоје)
5. Изузеци (ако постоје)
6. Упућивања на друге одредбе (идентификуј све "члан X", "закон о Y" референце)

Одговори ИСКЉУЧИВО на основу текста одредбе. Не додај ништа што не пише."""
```

**Кост**: ~$0.001 по одредби са Haiku-ом. Целокупан Кривични законик (~400 чланова) = ~$0.40.

### 1.3 Екстракција ratio decidendi из судских одлука

Ово је најтежи задатак. Ratio decidendi (обавезујуће правно правило из пресуде) често није експлицитно наведен — мора се извести из чињеница + примењених правила + закључка. Истраживање из августа 2025. (Hisano et al., “Capturing Legal Reasoning Paths from Facts to Law”) демонстрира технику: **knowledge graph који повезује чињенице → правне норме → примену** из стварних судских одлука, чинећи имплицитно резоновање експлицитним и машински читљивим.

```python
RATIO_EXTRACTION_PROMPT = """Анализирај следећу судску одлуку.

<decision>
{full_decision_text}
</decision>

Извуци:
1. RATIO DECIDENDI — обавезујуће правно правило које је суд применио на конкретне чињенице.
   Формулиши као: "Када [чињенични услов], тада [правна последица], на основу [правни основ]."
   
2. OBITER DICTA — успутна запажања суда која НИСУ директно везана за одлуку.

3. МЕТОД ТУМАЧЕЊА — Како је суд тумачио спорну одредбу?
   - Граматичко (језичко значење текста)
   - Систематско (место одредбе у систему закона)
   - Телеолошко (циљ и сврха норме)
   - Историјско (намера законодавца)
   
4. ЛАНАЦ РЕЗОНОВАЊА: Чињенице → Примењена правила → Закључак
   Формулиши као силогизам:
   - Премиса 1 (правно правило): ...
   - Премиса 2 (утврђене чињенице): ...
   - Закључак: ...

КРИТИЧНО: Ако не можеш са сигурношћу да извучеш ratio decidendi, напиши 
"Ratio nije moguće pouzdano utvrditi iz dostupnog teksta" и објасни зашто."""
```

### 1.4 Хијерархијско чанковање са контекстом (Context-Aware Hierarchical Chunking)

Стандардно чанковање (500 токена) уништава правну логику. Решење: **двоструко чанковање** — примарни ниво за ретривал + документ-ниво за разумевање:

```python
class HierarchicalLegalChunk:
    """Двоструки чанк: детаљан за ретривал + контекстуални за разумевање"""
    
    def __init__(self, article_text, law_context):
        self.primary_text = article_text           # За embeddings (члан)
        self.parent_context = law_context.chapter   # Глава у којој се налази
        self.law_summary = law_context.preamble     # Циљ закона
        self.cross_ref_texts = []                   # Текстови референцираних чланова
        
    def to_retrieval_text(self) -> str:
        """За embedding — кратак, прецизан"""
        return f"{self.law_context.title}, {self.primary_text}"
    
    def to_understanding_text(self) -> str:
        """За Claude — богат контекстом"""
        parts = [
            f"ЗАКОН: {self.law_context.title} ({self.law_context.sl_glasnik})",
            f"ГЛАВА: {self.parent_context}",
            f"ОДРЕДБА: {self.primary_text}",
        ]
        if self.cross_ref_texts:
            parts.append(f"ПОВЕЗАНЕ ОДРЕДБЕ:\n" + "\n".join(self.cross_ref_texts))
        return "\n\n".join(parts)
```

**Кључна разлика**: `to_retrieval_text()` иде у Embedić/ColBERT индекс (кратко, прецизно). `to_understanding_text()` иде у Claude-ов контекст прозор (богато, контекстуализовано). Ово решава проблем “lost context after chunking” без повећања ретривал шума.

-----

## СЛОЈ 2: Повезивање чињеница кроз више докумената

### 2.1 Multi-Hop правно резоновање

Најважнија правна питања захтевају повезивање 3+ извора. Пример: “Да ли закупац може да раскине уговор ако закуподавац не одржава стан?”

Ланац извора:

1. Закон о облигационим односима, чл. 567–599 (закуп)
1. Посебан закон о становању (ако постоји)
1. Судска пракса ВКС о раскиду закупа
1. Општи правила о раскиду уговора (ЗОО чл. 124–132)

Стандардни RAG налази **1 од 4** извора. Агентски RAG са итеративним продубљивањем налази **све 4**:

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class MultiHopState(TypedDict):
    original_query: str
    sub_questions: list[str]
    retrieved_evidence: list[dict]
    reasoning_chain: list[dict]   # [{premise, evidence, conclusion}]
    knowledge_gaps: list[str]     # Идентификоване празнине
    iteration: int
    max_iterations: int           # Default: 5

def decompose_legal_query(state: MultiHopState) -> MultiHopState:
    """Разложи сложено правно питање на подпитања"""
    response = claude.messages.create(
        model="claude-sonnet-4-5",
        system="""Разложи ово правно питање на подпитања која треба истражити.
        За свако подпитање наведи:
        1. Питање
        2. Тип извора (закон/судска пракса/правна теорија)
        3. Кључне речи за претрагу
        
        Размисли о: материјалном праву, процесним питањима, временском важењу,
        компаративној пракси.""",
        messages=[{"role": "user", "content": state["original_query"]}],
        thinking={"type": "enabled", "budget_tokens": 4096}
    )
    state["sub_questions"] = parse_sub_questions(response)
    return state

def iterative_retrieve_and_reason(state: MultiHopState) -> MultiHopState:
    """Итеративно претражуј и резонуј — свака итерација продубљује знање"""
    
    for sq in state["sub_questions"]:
        # 1. Претрага у правним базама
        results = await multi_source_search(sq, sources=[
            "paragraf_lex", "profisistem", "lightrag_kg", "vector_store"
        ])
        state["retrieved_evidence"].extend(results)
        
        # 2. Провера да ли постоје празнине
        gap_check = claude.messages.create(
            model="claude-haiku-4-5",
            messages=[{"role": "user", "content": f"""
            Питање: {sq}
            Пронађени извори: {summarize(results)}
            
            Да ли постоје правне празнине — информације које НЕДОСТАЈУ за потпун одговор?
            Ако да, формулиши нова подпитања за попуњавање празнина.
            Ако не, одговори "ДОВОЉНО"."""}]
        )
        
        if "ДОВОЉНО" not in gap_check.content[0].text:
            new_questions = parse_gap_questions(gap_check)
            state["sub_questions"].extend(new_questions)
    
    state["iteration"] += 1
    return state

def should_continue(state: MultiHopState) -> str:
    if state["iteration"] >= state["max_iterations"]:
        return "synthesize"
    if not state["knowledge_gaps"]:
        return "synthesize"
    return "retrieve_more"

# LangGraph граф
graph = StateGraph(MultiHopState)
graph.add_node("decompose", decompose_legal_query)
graph.add_node("retrieve_reason", iterative_retrieve_and_reason)
graph.add_node("synthesize", synthesize_legal_analysis)
graph.set_entry_point("decompose")
graph.add_edge("decompose", "retrieve_reason")
graph.add_conditional_edges("retrieve_reason", should_continue, {
    "retrieve_more": "retrieve_reason",
    "synthesize": "synthesize"
})
graph.add_edge("synthesize", END)
```

### 2.2 Цитациони граф: Ланци судске праксе

Правна аргументација је **мрежна**, не линеарна. Суд А цитира суд Б, који тумачи закон В, који је измењен законом Г. Агент мора да прати ове ланце.

```cypher
// Neo4j шема за цитациони граф
// Чворови
CREATE CONSTRAINT FOR (l:Law) REQUIRE l.eli_uri IS UNIQUE;
CREATE CONSTRAINT FOR (a:Article) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT FOR (d:Decision) REQUIRE d.case_number IS UNIQUE;
CREATE CONSTRAINT FOR (c:LegalConcept) REQUIRE c.name IS UNIQUE;

// Односи између прописа
CREATE (z1:Law)-[:AMENDS {gazette: "52/2021", date: "2021-05-15"}]->(z2:Law)
CREATE (z1:Law)-[:REPEALS]->(z2:Law)
CREATE (z1:Law)-[:IMPLEMENTS]->(d:Directive)  // EU директиве
CREATE (a1:Article)-[:CROSS_REFERENCES]->(a2:Article)
CREATE (a:Article)-[:DEFINES]->(c:LegalConcept)

// Односи између судских одлука
CREATE (d1:Decision)-[:CITES_PRECEDENT]->(d2:Decision)
CREATE (d1:Decision)-[:OVERRULES]->(d2:Decision)    // КРИТИЧНО: промена праксе
CREATE (d1:Decision)-[:DISTINGUISHES]->(d2:Decision) // Разликује чињенице
CREATE (d1:Decision)-[:FOLLOWS]->(d2:Decision)       // Следи раније тумачење
CREATE (d1:Decision)-[:INTERPRETS {method: "teleological"}]->(a:Article)

// Односи пропис-пракса
CREATE (d:Decision)-[:APPLIES]->(a:Article)
CREATE (d:Decision)-[:EXTENDS_SCOPE]->(a:Article)    // Шири примену
CREATE (d:Decision)-[:RESTRICTS_SCOPE]->(a:Article)  // Сужава примену
CREATE (d:Decision)-[:CREATES_EXCEPTION]->(a:Article) // Ствара изузетак у пракси
```

**Аналитички упити** за повезивање прописа и праксе:

```cypher
// 1. Најцитираније одредбе — које одредбе суд најчешће примењује?
MATCH (d:Decision)-[:APPLIES]->(a:Article)
RETURN a.law_name, a.number, count(d) as citation_count
ORDER BY citation_count DESC LIMIT 20

// 2. Еволуција тумачења — како се мењало тумачење чл. 154 ЗОО?
MATCH (d:Decision)-[r:INTERPRETS]->(a:Article {number: "154", law: "ZOO"})
RETURN d.case_number, d.date, d.ratio_decidendi, r.method
ORDER BY d.date

// 3. Ланац преседана — ко цитира кога?
MATCH path = (d1:Decision)-[:CITES_PRECEDENT*1..5]->(d2:Decision)
WHERE d1.case_number = "Rev. 1234/2023"
RETURN path

// 4. Детекција конфликта — одлуке које различито тумаче исту одредбу
MATCH (d1:Decision)-[:INTERPRETS]->(a:Article)<-[:INTERPRETS]-(d2:Decision)
WHERE d1.ratio_decidendi <> d2.ratio_decidendi
  AND d1.court = d2.court
RETURN d1, d2, a, 
  "КОНФЛИКТ: Исти суд, различито тумачење" as alert

// 5. "Тихе измене" — где пракса де факто мења закон
MATCH (d:Decision)-[:EXTENDS_SCOPE|RESTRICTS_SCOPE|CREATES_EXCEPTION]->(a:Article)
RETURN a.law_name, a.number, type(r) as modification_type, 
  count(d) as frequency, collect(d.case_number) as decisions
ORDER BY frequency DESC
```

### 2.3 Детекција контрадикција

Агент мора аутоматски да детектује конфликте:

```python
class ContradictionDetector:
    """Детектује конфликте између правних извора"""
    
    CONFLICT_TYPES = {
        "lex_posterior": "Новији закон vs старији закон",
        "lex_specialis": "Посебан закон vs општи закон",
        "lex_superior": "Устав vs закон",
        "practice_vs_text": "Судска пракса vs текст одредбе",
        "inter_court": "Различити судови, различита тумачења",
        "intra_court": "Исти суд, промена праксе"
    }
    
    async def detect(self, provisions: list, decisions: list) -> list:
        # 1. Темпорална провера: важи ли одредба?
        for p in provisions:
            if await self.is_repealed_or_amended(p):
                yield Contradiction(
                    type="temporal",
                    message=f"Одредба {p.article} измењена/укинута",
                    newer_source=await self.get_current_version(p)
                )
        
        # 2. NLI провера: да ли се извори слажу?
        for d in decisions:
            for p in provisions:
                if d.applies_to(p):
                    entailment = await self.nli_check(
                        premise=p.text,
                        hypothesis=d.ratio_decidendi
                    )
                    if entailment.label == "CONTRADICTION":
                        yield Contradiction(
                            type="practice_vs_text",
                            provision=p,
                            decision=d,
                            confidence=entailment.score,
                            explanation=await self.explain_contradiction(p, d)
                        )
        
        # 3. Граф провера: конфликтна тумачења
        conflicts = await self.kg.query("""
            MATCH (d1:Decision)-[:INTERPRETS]->(a:Article)<-[:INTERPRETS]-(d2:Decision)
            WHERE d1 <> d2 AND d1.date > d2.date
            RETURN d1, d2, a
        """)
        for c in conflicts:
            yield Contradiction(type="inter_court", **c)
```

-----

## СЛОЈ 3: Премошћавање јаза пропис ↔ пракса

Ово је **најиновативнији** слој. Агент не само да зна шта закон каже — зна и како се **заиста примењује**.

### 3.1 “Карте праксе” (Practice Maps)

За сваку кључну одредбу, агент гради **карту праксе** — структуирани преглед како суд примењује ту одредбу:

```python
class PracticeMap(BaseModel):
    """Карта примене конкретне правне одредбе у пракси"""
    
    provision: LegalProvision      # Одредба
    total_decisions: int           # Укупно пронађених одлука
    
    # Статистика примене
    applied_count: int             # Колико пута примењена
    distinguished_count: int       # Колико пута суд разликовао чињенице
    overruled_count: int           # Промена праксе
    
    # Обрасци тумачења
    interpretation_patterns: list[dict]  # [{method, frequency, example_case}]
    
    # Де факто модификације
    judicial_extensions: list[str]    # Где је суд проширио примену
    judicial_restrictions: list[str]  # Где је суд сузио примену  
    judicial_exceptions: list[str]    # Изузеци створени у пракси
    
    # Темпорална еволуција
    evolution: list[dict]  # [{period, dominant_interpretation, key_case}]
    
    # Практични показатељи
    success_rate: float | None     # % усвајајућих за тужиоца
    avg_damages: float | None      # Просечна накнада (ако је релевантно)
    
    # Јаз пропис-пракса
    gap_analysis: str              # Текстуална анализа јаза
    gap_severity: str              # "minimal" | "moderate" | "significant"
```

### 3.2 Изградња practice map-а кроз агентски workflow

```python
async def build_practice_map(provision: LegalProvision) -> PracticeMap:
    """Аутономно изгради карту праксе за одредбу"""
    
    # 1. Претражи све одлуке које примењују ову одредбу
    decisions = await search_all_sources(
        query=f"primena {provision.article_number} {provision.law_name}",
        sources=["paragraf_lex", "profisistem", "kg_graph"],
        min_relevance=0.7
    )
    
    # 2. Класификуј сваку одлуку
    classified = []
    for d in decisions:
        classification = await claude.messages.create(
            model="claude-haiku-4-5",
            system="Класификуј како суд примењује ову одредбу.",
            messages=[{"role": "user", "content": f"""
            Одредба: {provision.text}
            Одлука: {d.text}
            
            Класификуј:
            1. Да ли суд ПРИМЕЊУЈЕ одредбу директно?
            2. Да ли ПРОШИРУЈЕ примену изван текста?
            3. Да ли СУЖАВА примену?
            4. Да ли СТВАРА ИЗУЗЕТАК који не постоји у тексту?
            5. Метод тумачења (граматичко/систематско/телеолошко/историјско)
            6. Да ли МЕЊА ранију праксу?"""}]
        )
        classified.append(parse_classification(classification))
    
    # 3. Анализирај темпоралну еволуцију
    evolution = await analyze_temporal_evolution(classified)
    
    # 4. Израчунај јаз пропис-пракса
    gap = await claude.messages.create(
        model="claude-sonnet-4-5",
        thinking={"type": "enabled", "budget_tokens": 8000},
        messages=[{"role": "user", "content": f"""
        Закон каже: {provision.text}
        
        Пракса показује:
        - Проширења: {[c for c in classified if c.type == "extends"]}
        - Сужавања: {[c for c in classified if c.type == "restricts"]}
        - Изузеци: {[c for c in classified if c.type == "exception"]}
        
        АНАЛИЗИРАЈ: Колики је јаз између онога што закон каже (de jure) 
        и онога што судови раде (de facto)?
        
        Користи Јовановићев емпиријски метод:
        1. Шта институција ФОРМАЛНО прописује?
        2. Шта институција СТВАРНО ради?
        3. Зашто постоји разлика?
        4. Какве су последице те разлике за правну сигурност?"""}]
    )
    
    return PracticeMap(
        provision=provision,
        gap_analysis=gap.content[0].text,
        # ... остали подаци
    )
```

### 3.3 Детекција “тихих измена” (Silent Amendments)

Најсофистициранија функција: агент детектује када судска пракса **де факто мења закон** без формалне измене:

```python
SILENT_AMENDMENT_INDICATORS = [
    # Суд користи телеолошко тумачење да прошири/сузи текст
    "Иако законодавац наводи... суд сматра да се под тим подразумева и...",
    "У духу закона... примењује се и на...",
    "Ratio legis наведене одредбе указује на...",
    
    # Суд додаје услове који не постоје у тексту
    "За примену ове одредбе потребно је и да...",
    "Поред услова из закона, суд налази да...",
    
    # Суд фактички не примењује одредбу
    "Наведена одредба се у пракси ретко примењује...",
    # Велики број одбијајућих одлука за исту одредбу
]

async def detect_silent_amendments(provision, decisions):
    """Детектуј где пракса де факто мења текст одредбе"""
    
    analysis = await claude.messages.create(
        model="claude-sonnet-4-5",
        thinking={"type": "enabled", "budget_tokens": 10000},
        messages=[{"role": "user", "content": f"""
        ЗАДАТАК: Утврди да ли судска пракса де факто мења ову одредбу.

        ТЕКСТ ОДРЕДБЕ:
        {provision.text}

        СУДСКЕ ОДЛУКЕ КОЈЕ ЈЕ ПРИМЕЊУЈУ:
        {format_decisions(decisions)}

        АНАЛИЗИРАЈ следеће обрасце:
        
        1. ДОДАВАЊЕ УСЛОВА — Да ли суд захтева услове који не постоје у тексту?
        2. ПРОШИРЕЊЕ ПОЈМОВА — Да ли суд шире тумачи кључне појмове?
        3. СТВАРАЊЕ ИЗУЗЕТАКА — Да ли суд признаје изузетке које закон не предвиђа?
        4. ПРЕБАЦИВАЊЕ ТЕРЕТА ДОКАЗИВАЊА — Да ли суд мења терет доказивања?
        5. МРТВО СЛОВО НА ПАПИРУ — Да ли постоје одредбе које суд систематски не примењује?
        6. КОНФЛИКТ ВИШЕГ И НИЖЕГ СУДА — Различита пракса по инстанцама?
        
        За сваки пронађени образац:
        - Цитирај конкретну одлуку
        - Објасни одступање од текста
        - Процени правне последице
        
        НЕ ИЗМИШЉАЈ одлуке. Ако нема доказа за образац, наведи "Није утврђено."
        """}]
    )
    return parse_silent_amendments(analysis)
```

### 3.4 Дефизибилно резоновање (Defeasible Reasoning)

Право је **дефизибилно** — свако правило може бити поражено изузетком. Агент мора да моделира ово:

```python
class DefeasibleRule:
    """Правило које може бити поражено изузетком"""
    
    rule: str                     # "Закупац може раскинути уговор ако..."
    source: LegalProvision        # Правни основ
    confidence: float             # Снага правила (0.0-1.0)
    
    exceptions: list[dict]        # Познати изузеци
    # [{condition: "осим ако је...", source: ..., frequency: ...}]
    
    defeaters: list[dict]         # Правила која побијају ово правило
    # [{rule: "lex specialis одредба...", source: ..., priority: ...}]

async def defeasible_legal_analysis(query: str, facts: dict) -> dict:
    """Анализирај правно питање узимајући у обзир изузетке и побијања"""
    
    # 1. Пронађи примењива правила
    applicable_rules = await find_applicable_rules(query, facts)
    
    # 2. За свако правило провери изузетке
    for rule in applicable_rules:
        rule.exceptions = await find_exceptions(rule, facts)
        rule.defeaters = await find_defeaters(rule, facts)
        
        # Примени хијерархију:
        # lex superior > lex specialis > lex posterior
        rule.confidence = calculate_rule_strength(rule)
    
    # 3. Синтеза — које правило "преживљава"?
    surviving_rules = [r for r in applicable_rules 
                       if r.confidence > 0.5 and not r.is_defeated()]
    
    return {
        "applicable_rules": applicable_rules,
        "surviving_rules": surviving_rules,
        "defeated_rules": [r for r in applicable_rules if r.is_defeated()],
        "confidence": min(r.confidence for r in surviving_rules) if surviving_rules else 0,
        "reasoning_chain": build_defeasible_chain(applicable_rules)
    }
```

-----

## СЛОЈ 4: Агентско итеративно продубљивање (Agentic Iterative Deepening)

### 4.1 Пет-фазни workflow за дубоку анализу

Интегрише се као **подграф** у постојећи LangGraph supervisor:

```
[ПИТАЊЕ] → ДЕКОМПОЗИЦИЈА → РЕТРИВАЛ → РЕЗОНОВАЊЕ → ВЕРИФИКАЦИЈА → СИНТЕЗА
                ↑                                        |
                └────────── ПРАЗНИНЕ ДЕТЕКТОВАНЕ ─────────┘
```

```python
DEEP_ANALYSIS_PROMPT = """Ти си правни аналитичар специјализован за српско право.
Примењуј емпиријско-компаративни метод Слободана Јовановића.

ФАЗА 1 — ДЕКОМПОЗИЦИЈА:
Разложи питање на компоненте: материјалноправна, процесноправна, темпорална.

ФАЗА 2 — ИНВЕНТИО (Проналажење):
За сваку компоненту претражи:
(а) Позитивноправну регулативу (закони, подзаконски акти)
(б) Судску праксу (ВКС, апелациони судови, Уставни суд)
(в) Правну теорију (коментари закона, уџбеници)
(г) Компаративно право (минимум једна јурисдикција)

ФАЗА 3 — РЕЗОНОВАЊЕ:
Примени IRAC метод:
- Issue (Спорно питање): Прецизно формулиши
- Rule (Правило): Идентификуј примењиву норму + ratio decidendi из праксе
- Application (Примена): Примени правило на конкретне чињенице
- Conclusion (Закључак): Изведи закључак

ФАЗА 4 — ВЕРИФИКАЦИЈА:
- Провери да ли сви цитати постоје
- Провери да ли ratio одговара тексту одлуке
- Провери темпорално важење одредби
- Идентификуј празнине у аргументацији

ФАЗА 5 — СИНТЕЗА:
Повежи све елементе у кохерентну анализу.
Јасно раздвоји: (а) шта закон каже, (б) шта суд ради, (в) где постоји јаз.

ПРАВИЛО: Ако у било којој фази откријеш празнину — ВРАТИ СЕ на Фазу 2 и 
претражи додатне изворе. Не настављај синтезу са непотпуним информацијама."""
```

### 4.2 Think-on-Graph: Резоновање преко знања графа

Директно инспирисано Think-on-Graph 2.0 (ICLR 2025) — агент **разонује преко графа знања** уместо само текстуалног ретривала:

```python
async def think_on_graph(query: str, kg) -> dict:
    """Резоновање преко правног knowledge graph-а"""
    
    # 1. Екстрахуј ентитете из питања
    entities = await extract_legal_entities(query)
    # Пример: ["чл. 154 ЗОО", "објективна одговорност", "штета"]
    
    # 2. Пронађи ентитете у графу
    graph_context = []
    for entity in entities:
        neighbors = await kg.query(f"""
            MATCH (n)-[r]-(m) 
            WHERE n.name CONTAINS '{entity}' OR n.eli_uri CONTAINS '{entity}'
            RETURN n, type(r) as rel, m 
            LIMIT 20
        """)
        graph_context.extend(neighbors)
    
    # 3. Формирај reasoning chain преко графа
    reasoning = await claude.messages.create(
        model="claude-sonnet-4-5",
        thinking={"type": "enabled", "budget_tokens": 8000},
        messages=[{"role": "user", "content": f"""
        Питање: {query}
        
        Знање из графа (ентитети и везе):
        {format_graph_context(graph_context)}
        
        ЗАДАТАК: Прати везе у графу да одговориш на питање.
        За сваки корак наведи: ентитет → веза → следећи ентитет.
        
        Пример reasoning chain-а:
        чл. 154 ЗОО --[ДЕФИНИШЕ]--> објективна одговорност
        објективна одговорност --[ПРИМЕЊЕНА_У]--> Rev. 567/2022
        Rev. 567/2022 --[ПРОШИРУЈЕ_ПРИМЕНУ]--> чл. 154 ЗОО (додаје услов...)
        
        Ако ти недостаје веза — наведи коју информацију треба додатно претражити.
        """}]
    )
    
    # 4. Ако постоје празнине — додатни ретривал
    gaps = extract_knowledge_gaps(reasoning)
    if gaps:
        additional = await multi_source_search(gaps)
        # Понови резоновање са допуњеним контекстом
    
    return {"reasoning_chain": reasoning, "graph_paths": graph_context}
```

### 4.3 Мулти-агент правна дебата

За контроверзна питања — три агента дебатују:

```python
async def legal_debate(question: str, context: dict) -> dict:
    """Три агента анализирају исто питање из различитих углова"""
    
    # Агент 1: "Заговорник" — аргументи ЗА
    advocate_for = await claude_call(
        system="Ти си адвокат који брани позицију ДА на ово питање. "
               "Пронађи најјаче аргументе, цитирај праксу, теорију.",
        query=question, context=context
    )
    
    # Агент 2: "Противник" — аргументи ПРОТИВ
    advocate_against = await claude_call(
        system="Ти си адвокат који брани позицију НЕ. "
               "Побиј аргументе из претходне анализе. Нађи контрааргументе.",
        query=question, context={**context, "opposing_view": advocate_for}
    )
    
    # Агент 3: "Судија" — синтеза
    judge = await claude_call(
        system="""Ти си судија који оцењује оба аргумента.
        Користи Јовановићев метод: 
        1. Емпиријска основа — чији су аргументи боље поткрепљени?
        2. Институционална реалност — шта суд стварно ради у пракси?
        3. Компаративна перспектива — како друге јурисдикције решавају ово?
        4. Закључак — која позиција је вероватнија и зашто?""",
        query=question,
        context={**context, "for": advocate_for, "against": advocate_against}
    )
    
    return {
        "arguments_for": advocate_for,
        "arguments_against": advocate_against,
        "judicial_analysis": judge,
        "confidence": extract_confidence(judge)
    }
```

-----

## Интеграција у постојећу архитектуру

Сви нови слојеви се интегришу као **подграфови** у постојећи LangGraph supervisor — **без измене** претходних модула:

```python
# Додај нове чворове у постојећи supervisor
builder.add_node("deep_analyzer", deep_analysis_subgraph)
builder.add_node("practice_mapper", practice_map_builder)
builder.add_node("contradiction_detector", contradiction_detection)
builder.add_node("debate_engine", legal_debate_subgraph)

# Supervisor рутира на основу сложености питања
def route_by_complexity(state):
    complexity = assess_query_complexity(state["messages"][-1])
    if complexity == "simple":
        return "legal_researcher"       # Постојећи RAG
    elif complexity == "multi_hop":
        return "deep_analyzer"          # Нови слој
    elif complexity == "practice_gap":
        return "practice_mapper"        # Нови слој
    elif complexity == "controversial":
        return "debate_engine"          # Нови слој
```

### Додатни трошкови

|Компонента           |Модел                     |Кост по анализи|
|---------------------|--------------------------|---------------|
|Класификација одредби|Haiku 4.5                 |~$0.001        |
|Multi-hop итеративно |Sonnet 4.5 (3-5 итерација)|~$0.15-0.30    |
|Practice Map         |Haiku + Sonnet            |~$0.50-1.00    |
|Дебата (3 агента)    |Sonnet × 3                |~$0.30-0.60    |
|Think-on-Graph       |Sonnet + Extended Thinking|~$0.10-0.20    |

**Укупни додатни месечни трошак**: ~$50-100 при 4-8 сати дневно.

-----

## Закључак: Шта ово мења

Без овог модула, агент је **правни претраживач** — налази текстове, копира цитате.

Са овим модулом, агент постаје **правни аналитичар**:

1. **Разуме структуру** — разликује ratio од obiter dicta, обавезу од овлашћења
1. **Повезује изворе** — прати ланце: закон → измена → тумачење → промена праксе
1. **Детектује јаз** — види где закон каже једно а суд ради друго
1. **Резонује дефизибилно** — узима у обзир изузетке и побијања
1. **Продубљује аутономно** — открива празнине и сам тражи додатне изворе
1. **Дебатује** — тестира аргументе из оба угла пре синтезе

Ово је разлика између агента који **зна текст закона** и агента који **разуме право**.