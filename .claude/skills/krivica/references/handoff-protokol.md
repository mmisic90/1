# Handoff протокол — `pravna-analiza` → `krivica`

## Сврха

Овај фајл описује **тачан формат** и **обавезне елементе** handoff пакета који `pravna-analiza` предаје `krivica` skill-у. Без овога, две stack компоненте губе контекст и раде дупли посао.

## Обавезан формат пакета

```yaml
handoff:
  source: "pravna-analiza v3"
  target: "krivica v2"
  timestamp: ISO-8601
  predmet:
    broj: "К. 63/2026"
    stranka: "Богуновић Виктор"
    sud: "Основни суд Бечеј, Одељење Нови Бечеј"
    sudija: "Ивана Аврамов"
  
  # ① ТЕОРИЈА СЛУЧАЈА (Ф0)
  teorija_slucaja:
    jedna_recenica: "..."
    hipoteza: "..."
    verovatnoca: "[0-100]%"
  
  # ② ЧИЊЕНИЧНА МАПА (Ф1-2)
  cinjenicna_mapa:
    - cinjenica: "..."
      klasa: "П1/П2/П3"
      izvor: "стр. X, пасус Y"
      status: "потврђено / спорно / оспорено"
    # ...
    kontradikcije: []
  
  # ③ АРГУМЕНТИ (Ф3)
  argumenti:
    jaki:
      - tekst: "..."
        osnov: "чл. X ЗКП/КЗ"
        snaga: 9
        nezavisnost: true
    srednji: []
    slabi: []
    graf_zavisnosti:
      nezavisnih: 3
      ukupnih: 7
  
  # ④ ADVERSARIAL (Ф4)
  adversarial:
    sudija_prezivelo: 5
    sudija_odbacilo: 2
    protivnik_prezivelo: 4
    protivnik_odbacilo: 3
  
  # ⑤ „ЈЕДНА СТВАР" (Ф5) — ИДЕ ПРВА
  jedna_stvar:
    argument: "..."
    zasto: "..."
    dokaz: "стр. X + Y ← ✅П1"
    neodbrativo: "..."
  
  # ⑥ ВЕРИФИКОВАНА ПРАКСА (из istrazivanje-prakse)
  praksa:
    - sud: "ВС"
      broj: "Kzz 498/2022"
      datum: "..."
      link: "https://..."
      ratio: "..."
      verifikovano: true
    # ...
  
  # ⑦ СТРАТЕШКА ПРОЦЕНА
  strateska_procena:
    najbolji_ishod: "..."
    realan_ishod: "..."
    najgori_ishod: "..."
    rizik_1_10: 4
    preporuka: "..."
```

## Валидациона правила

Пре него што `krivica` прихвати handoff, мора да провери:

1. **Сви 7 елемената** (teorija_slucaja, cinjenicna_mapa, argumenti, adversarial, jedna_stvar, praksa, strateska_procena) су присутни.
2. `jedna_stvar.argument` није празан.
3. `praksa` садржи минимум 1 одлуку са `verifikovano: true` И `link`/`tekst`.
4. `cinjenicna_mapa` не садржи ниједан П4.
5. `strateska_procena.rizik_1_10` је число 1–10.

**Ако било шта од овога недостаје → СТОП. Јави кориснику.**

## Шта `krivica` ради са пакетом

1. Чита `jedna_stvar` → поставља у првих 3 пасуса документа
2. Чита `cinjenicna_mapa` → сваку чињеницу уграђује са одговарајућом класом и извором
3. Чита `argumenti.jaki` → уграђује као главне тачке аргументације
4. Чита `praksa` → уграђује парафразирано са „вид. [суд] [број]" интерним референцама
5. Чита `strateska_procena.preporuka` → обликује предлог суду

## Шта `krivica` НЕ ради

- Не додаје аргументе који нису у пакету.
- Не мења класификацију тврдњи.
- Не претражује додатну праксу (то је посао `istrazivanje-prakse`).
- Не правa сопствену теорију случаја.

## Fallback: кад нема handoff-а

Ако `krivica` прима захтев без handoff-а (нпр. корисник тражи бланко акт), ради у **fallback режиму**:

1. Обавести корисника: „Нема pravna-analiza handoff-а. Квалитет ће бити нижи него у пуном режиму."
2. Тражи минимум: тип акта, странке, основ, кључне чињенице.
3. И даље делегира претрагу праксе у `istrazivanje-prakse`.
4. Compliance извештај експлицитно наводи: „К0: ⛔ handoff није примљен, fallback режим."
