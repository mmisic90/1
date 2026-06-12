# Modul za duboko razumevanje i povezivanje činjenica: Propis ↔ Praksa

**Arhitekturni dodatak za autonomnog pravnog istraživačkog agenta**

-----

## Zašto je ovo kritično

Osnovni RAG sistem radi ovo: korisnik pita → agent traži slične čankove → vraća citate. To je pravni Google — korisno, ali ne i inteligentno. Agent koji **razume** pravo mora da:

1. **Parsira strukturu pravnog argumenta** — razlikuje ratio decidendi od obiter dicta, normativnu odredbu od definicije, obavezu od ovlašćenja
1. **Povezuje činjenice kroz više dokumenata** — prati lanac: zakon → podzakonski akt → sudska odluka → izmena → nova praksa
1. **Premošćuje jaz između propisa i prakse** — detektuje kada sud tumači odredbu drugačije od zakonodavne namere

Ovo zahteva **tri nova sloja** u postojećoj arhitekturi, bez kompromisa na prethodne module.

-----

## SLOJ 1: Duboko razumevanje pojedinačnih dokumenata

### 1.1 Višenivosko parsiranje pravnih tekstova

Srpski zakoni imaju strogu hijerarhiju: **Zakon → Deo → Glava → Odeljak → Član → Stav → Tačka → Podtačka**. Sudske odluke imaju drugu: **Izreka → Obrazloženje → Činjenično stanje → Pravna ocena → Odluka o troškovima**.

Agent mora da parsira oba formata u **strukturirane objekte**, ne u ravne tekstualne čankove:

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
    
    # Struktura obrazloženja
    facts: str                    # Utvrđeno činjenično stanje
    procedural_history: str       # Tok postupka
    legal_issues: list[str]       # Sporna pravna pitanja
    ratio_decidendi: str          # KLJUČNO — obavezujuće pravno pravilo
    obiter_dicta: list[str]       # Usputna zapažanja (neobavezujuća)
    applied_provisions: list[str] # Primenjeni propisi
    cited_precedents: list[str]   # Citirane ranija praksa
    disposition: str              # Izreka (usvajanje/odbijanje)
    
    # Analitički metapodaci
    interpretation_method: str    # "gramatičko", "teleološko", "sistematsko"
    novelty_score: float          # Koliko odstupa od ranije prakse
```

### 1.2 Klasifikacija normativnih iskaza pomoću Claude-a

Umesto NLP modela za klasifikaciju (koji ne razume srpski pravni registar), koristiti Claude Haiku sa strukturiranim izlazom:

```python
NORM_CLASSIFICATION_PROMPT = """Analiziraj sledeću pravnu odredbu iz srpskog zakona.

<provision>
{article_text}
</provision>

Klasifikuj:
1. Tip norme (obaveza/zabrana/ovlašćenje/definicija/uslov/izuzetak/sankcija/vremenska/procesna)
2. Adresat norme (ko je obavezan/ovlašćen)  
3. Objekt regulisanja (šta se reguliše)
4. Uslovi za primenu (ako postoje)
5. Izuzeci (ako postoje)
6. Upućivanja na druge odredbe (identifikuj sve "član X", "zakon o Y" reference)

Odgovori ISKLJUČIVO na osnovu teksta odredbe. Ne dodaj ništa što ne piše."""
```

**Kost**: ~$0.001 po odredbi sa Haiku-om. Celokupan Krivični zakonik (~400 članova) = ~$0.40.

### 1.3 Ekstrakcija ratio decidendi iz sudskih odluka

Ovo je najteži zadatak. Ratio decidendi (obavezujuće pravno pravilo iz presude) često nije eksplicitno naveden — mora se izvesti iz činjenica + primenjenih pravila + zaključka. Istraživanje iz avgusta 2025. (Hisano et al., “Capturing Legal Reasoning Paths from Facts to Law”) demonstrira tehniku: **knowledge graph koji povezuje činjenice → pravne norme → primenu** iz stvarnih sudskih odluka, čineći implicitno rezonovanje eksplicitnim i mašinski čitljivim.

```python
RATIO_EXTRACTION_PROMPT = """Analiziraj sledeću sudsku odluku.

<decision>
{full_decision_text}
</decision>

Izvuci:
1. RATIO DECIDENDI — obavezujuće pravno pravilo koje je sud primenio na konkretne činjenice.
   Formuliši kao: "Kada [činjenični uslov], tada [pravna posledica], na osnovu [pravni osnov]."
   
2. OBITER DICTA — usputna zapažanja suda koja NISU direktno vezana za odluku.

3. METOD TUMAČENJA — Kako je sud tumačio spornu odredbu?
   - Gramatičko (jezičko značenje teksta)
   - Sistematsko (mesto odredbe u sistemu zakona)
   - Teleološko (cilj i svrha norme)
   - Istorijsko (namera zakonodavca)
   
4. LANAC REZONOVANJA: Činjenice → Primenjena pravila → Zaključak
   Formuliši kao silogizam:
   - Premisa 1 (pravno pravilo): ...
   - Premisa 2 (utvrđene činjenice): ...
   - Zaključak: ...

KRITIČNO: Ako ne možeš sa sigurnošću da izvučeš ratio decidendi, napiši 
"Ratio nije moguće pouzdano utvrditi iz dostupnog teksta" i objasni zašto."""
```

### 1.4 Hijerarhijsko čankovanje sa kontekstom (Context-Aware Hierarchical Chunking)

Standardno čankovanje (500 tokena) uništava pravnu logiku. Rešenje: **dvostruko čankovanje** — primarni nivo za retrival + dokument-nivo za razumevanje:

```python
class HierarchicalLegalChunk:
    """Dvostruki čank: detaljan za retrival + kontekstualni za razumevanje"""
    
    def __init__(self, article_text, law_context):
        self.primary_text = article_text           # Za embeddings (član)
        self.parent_context = law_context.chapter   # Glava u kojoj se nalazi
        self.law_summary = law_context.preamble     # Cilj zakona
        self.cross_ref_texts = []                   # Tekstovi referenciranih članova
        
    def to_retrieval_text(self) -> str:
        """Za embedding — kratak, precizan"""
        return f"{self.law_context.title}, {self.primary_text}"
    
    def to_understanding_text(self) -> str:
        """Za Claude — bogat kontekstom"""
        parts = [
            f"ZAKON: {self.law_context.title} ({self.law_context.sl_glasnik})",
            f"GLAVA: {self.parent_context}",
            f"ODREDBA: {self.primary_text}",
        ]
        if self.cross_ref_texts:
            parts.append(f"POVEZANE ODREDBE:\n" + "\n".join(self.cross_ref_texts))
        return "\n\n".join(parts)
```

**Ključna razlika**: `to_retrieval_text()` ide u Embedić/ColBERT indeks (kratko, precizno). `to_understanding_text()` ide u Claude-ov kontekst prozor (bogato, kontekstualizovano). Ovo rešava problem “lost context after chunking” bez povećanja retrival šuma.

-----

## SLOJ 2: Povezivanje činjenica kroz više dokumenata

### 2.1 Multi-Hop pravno rezonovanje

Najvažnija pravna pitanja zahtevaju povezivanje 3+ izvora. Primer: “Da li zakupac može da raskine ugovor ako zakupodavac ne održava stan?”

Lanac izvora:

1. Zakon o obligacionim odnosima, čl. 567–599 (zakup)
1. Poseban zakon o stanovanju (ako postoji)
1. Sudska praksa VKS o raskidu zakupa
1. Opšti pravila o raskidu ugovora (ZOO čl. 124–132)

Standardni RAG nalazi **1 od 4** izvora. Agentski RAG sa iterativnim produbljivanjem nalazi **sve 4**:

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class MultiHopState(TypedDict):
    original_query: str
    sub_questions: list[str]
    retrieved_evidence: list[dict]
    reasoning_chain: list[dict]   # [{premise, evidence, conclusion}]
    knowledge_gaps: list[str]     # Identifikovane praznine
    iteration: int
    max_iterations: int           # Default: 5

def decompose_legal_query(state: MultiHopState) -> MultiHopState:
    """Razloži složeno pravno pitanje na podpitanja"""
    response = claude.messages.create(
        model="claude-sonnet-4-5",
        system="""Razloži ovo pravno pitanje na podpitanja koja treba istražiti.
        Za svako podpitanje navedi:
        1. Pitanje
        2. Tip izvora (zakon/sudska praksa/pravna teorija)
        3. Ključne reči za pretragu
        
        Razmisli o: materijalnom pravu, procesnim pitanjima, vremenskom važenju,
        komparativnoj praksi.""",
        messages=[{"role": "user", "content": state["original_query"]}],
        thinking={"type": "enabled", "budget_tokens": 4096}
    )
    state["sub_questions"] = parse_sub_questions(response)
    return state

def iterative_retrieve_and_reason(state: MultiHopState) -> MultiHopState:
    """Iterativno pretražuj i rezonuj — svaka iteracija produbljuje znanje"""
    
    for sq in state["sub_questions"]:
        # 1. Pretraga u pravnim bazama
        results = await multi_source_search(sq, sources=[
            "paragraf_lex", "profisistem", "lightrag_kg", "vector_store"
        ])
        state["retrieved_evidence"].extend(results)
        
        # 2. Provera da li postoje praznine
        gap_check = claude.messages.create(
            model="claude-haiku-4-5",
            messages=[{"role": "user", "content": f"""
            Pitanje: {sq}
            Pronađeni izvori: {summarize(results)}
            
            Da li postoje pravne praznine — informacije koje NEDOSTAJU za potpun odgovor?
            Ako da, formuliši nova podpitanja za popunjavanje praznina.
            Ako ne, odgovori "DOVOLJNO"."""}]
        )
        
        if "DOVOLJNO" not in gap_check.content[0].text:
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

# LangGraph graf
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

### 2.2 Citacioni graf: Lanci sudske prakse

Pravna argumentacija je **mrežna**, ne linearna. Sud A citira sud B, koji tumači zakon V, koji je izmenjen zakonom G. Agent mora da prati ove lance.

```cypher
// Neo4j šema za citacioni graf
// Čvorovi
CREATE CONSTRAINT FOR (l:Law) REQUIRE l.eli_uri IS UNIQUE;
CREATE CONSTRAINT FOR (a:Article) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT FOR (d:Decision) REQUIRE d.case_number IS UNIQUE;
CREATE CONSTRAINT FOR (c:LegalConcept) REQUIRE c.name IS UNIQUE;

// Odnosi između propisa
CREATE (z1:Law)-[:AMENDS {gazette: "52/2021", date: "2021-05-15"}]->(z2:Law)
CREATE (z1:Law)-[:REPEALS]->(z2:Law)
CREATE (z1:Law)-[:IMPLEMENTS]->(d:Directive)  // EU direktive
CREATE (a1:Article)-[:CROSS_REFERENCES]->(a2:Article)
CREATE (a:Article)-[:DEFINES]->(c:LegalConcept)

// Odnosi između sudskih odluka
CREATE (d1:Decision)-[:CITES_PRECEDENT]->(d2:Decision)
CREATE (d1:Decision)-[:OVERRULES]->(d2:Decision)    // KRITIČNO: promena prakse
CREATE (d1:Decision)-[:DISTINGUISHES]->(d2:Decision) // Razlikuje činjenice
CREATE (d1:Decision)-[:FOLLOWS]->(d2:Decision)       // Sledi ranije tumačenje
CREATE (d1:Decision)-[:INTERPRETS {method: "teleological"}]->(a:Article)

// Odnosi propis-praksa
CREATE (d:Decision)-[:APPLIES]->(a:Article)
CREATE (d:Decision)-[:EXTENDS_SCOPE]->(a:Article)    // Širi primenu
CREATE (d:Decision)-[:RESTRICTS_SCOPE]->(a:Article)  // Sužava primenu
CREATE (d:Decision)-[:CREATES_EXCEPTION]->(a:Article) // Stvara izuzetak u praksi
```

**Analitički upiti** za povezivanje propisa i prakse:

```cypher
// 1. Najcitiranije odredbe — koje odredbe sud najčešće primenjuje?
MATCH (d:Decision)-[:APPLIES]->(a:Article)
RETURN a.law_name, a.number, count(d) as citation_count
ORDER BY citation_count DESC LIMIT 20

// 2. Evolucija tumačenja — kako se menjalo tumačenje čl. 154 ZOO?
MATCH (d:Decision)-[r:INTERPRETS]->(a:Article {number: "154", law: "ZOO"})
RETURN d.case_number, d.date, d.ratio_decidendi, r.method
ORDER BY d.date

// 3. Lanac presedana — ko citira koga?
MATCH path = (d1:Decision)-[:CITES_PRECEDENT*1..5]->(d2:Decision)
WHERE d1.case_number = "Rev. 1234/2023"
RETURN path

// 4. Detekcija konflikta — odluke koje različito tumače istu odredbu
MATCH (d1:Decision)-[:INTERPRETS]->(a:Article)<-[:INTERPRETS]-(d2:Decision)
WHERE d1.ratio_decidendi <> d2.ratio_decidendi
  AND d1.court = d2.court
RETURN d1, d2, a, 
  "KONFLIKT: Isti sud, različito tumačenje" as alert

// 5. "Tihe izmene" — gde praksa de fakto menja zakon
MATCH (d:Decision)-[:EXTENDS_SCOPE|RESTRICTS_SCOPE|CREATES_EXCEPTION]->(a:Article)
RETURN a.law_name, a.number, type(r) as modification_type, 
  count(d) as frequency, collect(d.case_number) as decisions
ORDER BY frequency DESC
```

### 2.3 Detekcija kontradikcija

Agent mora automatski da detektuje konflikte:

```python
class ContradictionDetector:
    """Detektuje konflikte između pravnih izvora"""
    
    CONFLICT_TYPES = {
        "lex_posterior": "Noviji zakon vs stariji zakon",
        "lex_specialis": "Poseban zakon vs opšti zakon",
        "lex_superior": "Ustav vs zakon",
        "practice_vs_text": "Sudska praksa vs tekst odredbe",
        "inter_court": "Različiti sudovi, različita tumačenja",
        "intra_court": "Isti sud, promena prakse"
    }
    
    async def detect(self, provisions: list, decisions: list) -> list:
        # 1. Temporalna provera: važi li odredba?
        for p in provisions:
            if await self.is_repealed_or_amended(p):
                yield Contradiction(
                    type="temporal",
                    message=f"Odredba {p.article} izmenjena/ukinuta",
                    newer_source=await self.get_current_version(p)
                )
        
        # 2. NLI provera: da li se izvori slažu?
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
        
        # 3. Graf provera: konfliktna tumačenja
        conflicts = await self.kg.query("""
            MATCH (d1:Decision)-[:INTERPRETS]->(a:Article)<-[:INTERPRETS]-(d2:Decision)
            WHERE d1 <> d2 AND d1.date > d2.date
            RETURN d1, d2, a
        """)
        for c in conflicts:
            yield Contradiction(type="inter_court", **c)
```

-----

## SLOJ 3: Premošćavanje jaza propis ↔ praksa

Ovo je **najinovativniji** sloj. Agent ne samo da zna šta zakon kaže — zna i kako se **zaista primenjuje**.

### 3.1 “Karte prakse” (Practice Maps)

Za svaku ključnu odredbu, agent gradi **kartu prakse** — struktuirani pregled kako sud primenjuje tu odredbu:

```python
class PracticeMap(BaseModel):
    """Karta primene konkretne pravne odredbe u praksi"""
    
    provision: LegalProvision      # Odredba
    total_decisions: int           # Ukupno pronađenih odluka
    
    # Statistika primene
    applied_count: int             # Koliko puta primenjena
    distinguished_count: int       # Koliko puta sud razlikovao činjenice
    overruled_count: int           # Promena prakse
    
    # Obrasci tumačenja
    interpretation_patterns: list[dict]  # [{method, frequency, example_case}]
    
    # De fakto modifikacije
    judicial_extensions: list[str]    # Gde je sud proširio primenu
    judicial_restrictions: list[str]  # Gde je sud suzio primenu  
    judicial_exceptions: list[str]    # Izuzeci stvoreni u praksi
    
    # Temporalna evolucija
    evolution: list[dict]  # [{period, dominant_interpretation, key_case}]
    
    # Praktični pokazatelji
    success_rate: float | None     # % usvajajućih za tužioca
    avg_damages: float | None      # Prosečna naknada (ako je relevantno)
    
    # Jaz propis-praksa
    gap_analysis: str              # Tekstualna analiza jaza
    gap_severity: str              # "minimal" | "moderate" | "significant"
```

### 3.2 Izgradnja practice map-a kroz agentski workflow

```python
async def build_practice_map(provision: LegalProvision) -> PracticeMap:
    """Autonomno izgradi kartu prakse za odredbu"""
    
    # 1. Pretraži sve odluke koje primenjuju ovu odredbu
    decisions = await search_all_sources(
        query=f"primena {provision.article_number} {provision.law_name}",
        sources=["paragraf_lex", "profisistem", "kg_graph"],
        min_relevance=0.7
    )
    
    # 2. Klasifikuj svaku odluku
    classified = []
    for d in decisions:
        classification = await claude.messages.create(
            model="claude-haiku-4-5",
            system="Klasifikuj kako sud primenjuje ovu odredbu.",
            messages=[{"role": "user", "content": f"""
            Odredba: {provision.text}
            Odluka: {d.text}
            
            Klasifikuj:
            1. Da li sud PRIMENJUJE odredbu direktno?
            2. Da li PROŠIRUJE primenu izvan teksta?
            3. Da li SUŽAVA primenu?
            4. Da li STVARA IZUZETAK koji ne postoji u tekstu?
            5. Metod tumačenja (gramatičko/sistematsko/teleološko/istorijsko)
            6. Da li MENJA raniju praksu?"""}]
        )
        classified.append(parse_classification(classification))
    
    # 3. Analiziraj temporalnu evoluciju
    evolution = await analyze_temporal_evolution(classified)
    
    # 4. Izračunaj jaz propis-praksa
    gap = await claude.messages.create(
        model="claude-sonnet-4-5",
        thinking={"type": "enabled", "budget_tokens": 8000},
        messages=[{"role": "user", "content": f"""
        Zakon kaže: {provision.text}
        
        Praksa pokazuje:
        - Proširenja: {[c for c in classified if c.type == "extends"]}
        - Sužavanja: {[c for c in classified if c.type == "restricts"]}
        - Izuzeci: {[c for c in classified if c.type == "exception"]}
        
        ANALIZIRAJ: Koliki je jaz između onoga što zakon kaže (de jure) 
        i onoga što sudovi rade (de facto)?
        
        Koristi Jovanovićev empirijski metod:
        1. Šta institucija FORMALNO propisuje?
        2. Šta institucija STVARNO radi?
        3. Zašto postoji razlika?
        4. Kakve su posledice te razlike za pravnu sigurnost?"""}]
    )
    
    return PracticeMap(
        provision=provision,
        gap_analysis=gap.content[0].text,
        # ... ostali podaci
    )
```

### 3.3 Detekcija “tihih izmena” (Silent Amendments)

Najsofisticiranija funkcija: agent detektuje kada sudska praksa **de fakto menja zakon** bez formalne izmene:

```python
SILENT_AMENDMENT_INDICATORS = [
    # Sud koristi teleološko tumačenje da proširi/suzi tekst
    "Iako zakonodavac navodi... sud smatra da se pod tim podrazumeva i...",
    "U duhu zakona... primenjuje se i na...",
    "Ratio legis navedene odredbe ukazuje na...",
    
    # Sud dodaje uslove koji ne postoje u tekstu
    "Za primenu ove odredbe potrebno je i da...",
    "Pored uslova iz zakona, sud nalazi da...",
    
    # Sud faktički ne primenjuje odredbu
    "Navedena odredba se u praksi retko primenjuje...",
    # Veliki broj odbijajućih odluka za istu odredbu
]

async def detect_silent_amendments(provision, decisions):
    """Detektuj gde praksa de fakto menja tekst odredbe"""
    
    analysis = await claude.messages.create(
        model="claude-sonnet-4-5",
        thinking={"type": "enabled", "budget_tokens": 10000},
        messages=[{"role": "user", "content": f"""
        ZADATAK: Utvrdi da li sudska praksa de fakto menja ovu odredbu.

        TEKST ODREDBE:
        {provision.text}

        SUDSKE ODLUKE KOJE JE PRIMENJUJU:
        {format_decisions(decisions)}

        ANALIZIRAJ sledeće obrasce:
        
        1. DODAVANJE USLOVA — Da li sud zahteva uslove koji ne postoje u tekstu?
        2. PROŠIRENJE POJMOVA — Da li sud šire tumači ključne pojmove?
        3. STVARANJE IZUZETAKA — Da li sud priznaje izuzetke koje zakon ne predviđa?
        4. PREBACIVANJE TERETA DOKAZIVANJA — Da li sud menja teret dokazivanja?
        5. MRTVO SLOVO NA PAPIRU — Da li postoje odredbe koje sud sistematski ne primenjuje?
        6. KONFLIKT VIŠEG I NIŽEG SUDA — Različita praksa po instancama?
        
        Za svaki pronađeni obrazac:
        - Citiraj konkretnu odluku
        - Objasni odstupanje od teksta
        - Proceni pravne posledice
        
        NE IZMIŠLJAJ odluke. Ako nema dokaza za obrazac, navedi "Nije utvrđeno."
        """}]
    )
    return parse_silent_amendments(analysis)
```

### 3.4 Defizibilno rezonovanje (Defeasible Reasoning)

Pravo je **defizibilno** — svako pravilo može biti poraženo izuzetkom. Agent mora da modelira ovo:

```python
class DefeasibleRule:
    """Pravilo koje može biti poraženo izuzetkom"""
    
    rule: str                     # "Zakupac može raskinuti ugovor ako..."
    source: LegalProvision        # Pravni osnov
    confidence: float             # Snaga pravila (0.0-1.0)
    
    exceptions: list[dict]        # Poznati izuzeci
    # [{condition: "osim ako je...", source: ..., frequency: ...}]
    
    defeaters: list[dict]         # Pravila koja pobijaju ovo pravilo
    # [{rule: "lex specialis odredba...", source: ..., priority: ...}]

async def defeasible_legal_analysis(query: str, facts: dict) -> dict:
    """Analiziraj pravno pitanje uzimajući u obzir izuzetke i pobijanja"""
    
    # 1. Pronađi primenjiva pravila
    applicable_rules = await find_applicable_rules(query, facts)
    
    # 2. Za svako pravilo proveri izuzetke
    for rule in applicable_rules:
        rule.exceptions = await find_exceptions(rule, facts)
        rule.defeaters = await find_defeaters(rule, facts)
        
        # Primeni hijerarhiju:
        # lex superior > lex specialis > lex posterior
        rule.confidence = calculate_rule_strength(rule)
    
    # 3. Sinteza — koje pravilo "preživljava"?
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

## SLOJ 4: Agentsko iterativno produbljivanje (Agentic Iterative Deepening)

### 4.1 Pet-fazni workflow za duboku analizu

Integriše se kao **podgraf** u postojeći LangGraph supervisor:

```
[PITANJE] → DEKOMPOZICIJA → RETRIVAL → REZONOVANJE → VERIFIKACIJA → SINTEZA
                ↑                                        |
                └────────── PRAZNINE DETEKTOVANE ─────────┘
```

```python
DEEP_ANALYSIS_PROMPT = """Ti si pravni analitičar specijalizovan za srpsko pravo.
Primenjuj empirijsko-komparativni metod Slobodana Jovanovića.

FAZA 1 — DEKOMPOZICIJA:
Razloži pitanje na komponente: materijalnopravna, procesnopravna, temporalna.

FAZA 2 — INVENTIO (Pronalaženje):
Za svaku komponentu pretraži:
(a) Pozitivnopravnu regulativu (zakoni, podzakonski akti)
(b) Sudsku praksu (VKS, apelacioni sudovi, Ustavni sud)
(v) Pravnu teoriju (komentari zakona, udžbenici)
(g) Komparativno pravo (minimum jedna jurisdikcija)

FAZA 3 — REZONOVANJE:
Primeni IRAC metod:
- Issue (Sporno pitanje): Precizno formuliši
- Rule (Pravilo): Identifikuj primenjivu normu + ratio decidendi iz prakse
- Application (Primena): Primeni pravilo na konkretne činjenice
- Conclusion (Zaključak): Izvedi zaključak

FAZA 4 — VERIFIKACIJA:
- Proveri da li svi citati postoje
- Proveri da li ratio odgovara tekstu odluke
- Proveri temporalno važenje odredbi
- Identifikuj praznine u argumentaciji

FAZA 5 — SINTEZA:
Poveži sve elemente u koherentnu analizu.
Jasno razdvoji: (a) šta zakon kaže, (b) šta sud radi, (v) gde postoji jaz.

PRAVILO: Ako u bilo kojoj fazi otkriješ prazninu — VRATI SE na Fazu 2 i 
pretraži dodatne izvore. Ne nastavljaj sintezu sa nepotpunim informacijama."""
```

### 4.2 Think-on-Graph: Rezonovanje preko znanja grafa

Direktno inspirisano Think-on-Graph 2.0 (ICLR 2025) — agent **razonuje preko grafa znanja** umesto samo tekstualnog retrivala:

```python
async def think_on_graph(query: str, kg) -> dict:
    """Rezonovanje preko pravnog knowledge graph-a"""
    
    # 1. Ekstrahuj entitete iz pitanja
    entities = await extract_legal_entities(query)
    # Primer: ["čl. 154 ZOO", "objektivna odgovornost", "šteta"]
    
    # 2. Pronađi entitete u grafu
    graph_context = []
    for entity in entities:
        neighbors = await kg.query(f"""
            MATCH (n)-[r]-(m) 
            WHERE n.name CONTAINS '{entity}' OR n.eli_uri CONTAINS '{entity}'
            RETURN n, type(r) as rel, m 
            LIMIT 20
        """)
        graph_context.extend(neighbors)
    
    # 3. Formiraj reasoning chain preko grafa
    reasoning = await claude.messages.create(
        model="claude-sonnet-4-5",
        thinking={"type": "enabled", "budget_tokens": 8000},
        messages=[{"role": "user", "content": f"""
        Pitanje: {query}
        
        Znanje iz grafa (entiteti i veze):
        {format_graph_context(graph_context)}
        
        ZADATAK: Prati veze u grafu da odgovoriš na pitanje.
        Za svaki korak navedi: entitet → veza → sledeći entitet.
        
        Primer reasoning chain-a:
        čl. 154 ZOO --[DEFINIŠE]--> objektivna odgovornost
        objektivna odgovornost --[PRIMENJENA_U]--> Rev. 567/2022
        Rev. 567/2022 --[PROŠIRUJE_PRIMENU]--> čl. 154 ZOO (dodaje uslov...)
        
        Ako ti nedostaje veza — navedi koju informaciju treba dodatno pretražiti.
        """}]
    )
    
    # 4. Ako postoje praznine — dodatni retrival
    gaps = extract_knowledge_gaps(reasoning)
    if gaps:
        additional = await multi_source_search(gaps)
        # Ponovi rezonovanje sa dopunjenim kontekstom
    
    return {"reasoning_chain": reasoning, "graph_paths": graph_context}
```

### 4.3 Multi-agent pravna debata

Za kontroverzna pitanja — tri agenta debatuju:

```python
async def legal_debate(question: str, context: dict) -> dict:
    """Tri agenta analiziraju isto pitanje iz različitih uglova"""
    
    # Agent 1: "Zagovornik" — argumenti ZA
    advocate_for = await claude_call(
        system="Ti si advokat koji brani poziciju DA na ovo pitanje. "
               "Pronađi najjače argumente, citiraj praksu, teoriju.",
        query=question, context=context
    )
    
    # Agent 2: "Protivnik" — argumenti PROTIV
    advocate_against = await claude_call(
        system="Ti si advokat koji brani poziciju NE. "
               "Pobij argumente iz prethodne analize. Nađi kontraargumente.",
        query=question, context={**context, "opposing_view": advocate_for}
    )
    
    # Agent 3: "Sudija" — sinteza
    judge = await claude_call(
        system="""Ti si sudija koji ocenjuje oba argumenta.
        Koristi Jovanovićev metod: 
        1. Empirijska osnova — čiji su argumenti bolje potkrepljeni?
        2. Institucionalna realnost — šta sud stvarno radi u praksi?
        3. Komparativna perspektiva — kako druge jurisdikcije rešavaju ovo?
        4. Zaključak — koja pozicija je verovatnija i zašto?""",
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

## Integracija u postojeću arhitekturu

Svi novi slojevi se integrišu kao **podgrafovi** u postojeći LangGraph supervisor — **bez izmene** prethodnih modula:

```python
# Dodaj nove čvorove u postojeći supervisor
builder.add_node("deep_analyzer", deep_analysis_subgraph)
builder.add_node("practice_mapper", practice_map_builder)
builder.add_node("contradiction_detector", contradiction_detection)
builder.add_node("debate_engine", legal_debate_subgraph)

# Supervisor rutira na osnovu složenosti pitanja
def route_by_complexity(state):
    complexity = assess_query_complexity(state["messages"][-1])
    if complexity == "simple":
        return "legal_researcher"       # Postojeći RAG
    elif complexity == "multi_hop":
        return "deep_analyzer"          # Novi sloj
    elif complexity == "practice_gap":
        return "practice_mapper"        # Novi sloj
    elif complexity == "controversial":
        return "debate_engine"          # Novi sloj
```

### Dodatni troškovi

|Komponenta           |Model                     |Kost po analizi|
|---------------------|--------------------------|---------------|
|Klasifikacija odredbi|Haiku 4.5                 |~$0.001        |
|Multi-hop iterativno |Sonnet 4.5 (3-5 iteracija)|~$0.15-0.30    |
|Practice Map         |Haiku + Sonnet            |~$0.50-1.00    |
|Debata (3 agenta)    |Sonnet × 3                |~$0.30-0.60    |
|Think-on-Graph       |Sonnet + Extended Thinking|~$0.10-0.20    |

**Ukupni dodatni mesečni trošak**: ~$50-100 pri 4-8 sati dnevno.

-----

## Zaključak: Šta ovo menja

Bez ovog modula, agent je **pravni pretraživač** — nalazi tekstove, kopira citate.

Sa ovim modulom, agent postaje **pravni analitičar**:

1. **Razume strukturu** — razlikuje ratio od obiter dicta, obavezu od ovlašćenja
1. **Povezuje izvore** — prati lance: zakon → izmena → tumačenje → promena prakse
1. **Detektuje jaz** — vidi gde zakon kaže jedno a sud radi drugo
1. **Rezonuje defizibilno** — uzima u obzir izuzetke i pobijanja
1. **Produbljuje autonomno** — otkriva praznine i sam traži dodatne izvore
1. **Debatuje** — testira argumente iz oba ugla pre sinteze

Ovo je razlika između agenta koji **zna tekst zakona** i agenta koji **razume pravo**.