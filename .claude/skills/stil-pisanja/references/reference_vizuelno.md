# Reference: Vizuelni stil detaljno

Ovaj fajl sadrzi kompletne tipografske specifikacije izvucene iz analize uzorka **"Kalentic Nikola i Bojic Bojan, Flexopack 1980 TUZBA SA PREDLOGOM SA PRIVREMENOM MEROM.docx"** (OOXML analiza, 197 pasusa).

## 1. Stranica i margine

```xml
<w:pgSz w:w="12240" w:h="15840"/>           <!-- Letter format -->
<w:pgMar w:top="1440" w:right="1440"
         w:bottom="1440" w:left="1440"/>    <!-- 1 inch = 1440 twips, sve cetiri strane -->
```

**Prakticno:** Letter format, 1" margine svuda. Ne koristi A4 osim ako klijent ne trazi.

## 2. Font i pismo

- **Font:** Times New Roman (jedini dozvoljeni)
- **Pismo:** Cirilica (primarno)
- **Izuzeci za latinicu:**
  - Imena stranih firmi u izvornom obliku (BASF SE, Siemens AG)
  - Akronimi zakona (ZKP, KZ, ZOO, ZOSP, LOO, D.O.O., A.D.)
  - Latinski pravni termini (*in rem*, *de lege lata*, *ex tunc*)
  - Chapter/paragraph oznake u citatima

```xml
<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"
          w:cs="Times New Roman"/>
```

## 3. Hijerarhija velicina

| Velicina (pt) | Half-points (w:sz) | Upotreba |
|---------------|---------------------|----------|
| 10pt | 20 | Petit (fusnote, napomene, citiranje prakse ispod teksta) |
| 12pt | 24 | Osnovni tekst (default svuda) |
| 14pt | 28 | Kljucne recenice, naslovi sekcija (obavezno bold) |
| 16pt | 32 | Dispozicija — ПОНИШТАВА СЕ, ОБАВЕЗУЈЕ СЕ (obavezno bold, centrirano) |
| 18pt | 36 | Glavni naslov akta — Т У Ж Б А (obavezno bold, centrirano, razmaknut) |

```xml
<!-- Telo teksta 12pt -->
<w:rPr><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>

<!-- Petit 10pt -->
<w:rPr><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>

<!-- Glavni naslov 18pt bold -->
<w:rPr><w:b/><w:sz w:val="36"/><w:szCs w:val="36"/></w:rPr>
```

## 4. Poravnanje (w:jc)

| Situacija | Vrednost | Komentar |
|-----------|----------|----------|
| Telo teksta | `both` (justify) | Default svuda |
| Glavni naslov | `center` | Т У Ж Б А |
| Dispozicija | `center` | ПОНИШТАВА СЕ |
| Meta podaci (Sudija, predmet) | `right` | Gore desno |
| Potpis (desna strana) | `right` | Ime advokata dole desno |
| Datum i mesto | `left` | Dole levo, pre potpisa |

## 5. Prored (spacing)

```xml
<w:pPr>
  <w:spacing w:after="160" w:line="259" w:lineRule="auto"/>
</w:pPr>
```

- `w:after="160"` — 160 twips posle pasusa (~0.11")
- `w:line="259"` — 259 twips-ekvivalenata za line height = 1.15
- `w:lineRule="auto"` — automatsko skaliranje

**Izuzetak:** Dispozicija i glavni naslov mogu imati veci after-spacing (npr. 240-320).

## 6. Indenti

### 6.1. Hanging indent za stranke (pocetak akta)

```xml
<w:pPr>
  <w:ind w:left="2160" w:hanging="2160"/>
</w:pPr>
```

Pattern:
```
1. ТУЖИЛАЦ:    КАЛЕНТИЋ Никола, ЈМБГ 1234567890123,
               из Новог Сада, ул. Змај Јовина бр. 5
               кога заступа пуномоћник адв. Милан Мишић

2. ТУЖЕНИ:     ФЛЕКСОПАК 1980 д.о.о., МБ 12345678,
               из Београда, ул. Булевар ослобођења бр. 100
```

### 6.2. Hanging indent za dokaze

```xml
<w:pPr>
  <w:ind w:left="1440" w:hanging="1440"/>
</w:pPr>
```

Pattern:
```
ДОКАЗ:       фотокопија уговора о закупу од 12.03.2024. године
             извод из катастра РГЗ бр. 952-04/2024 од 15.04.2024.
             изјава сведока Петра Петровића од 20.05.2024. године
```

### 6.3. First-line indent (nabrajanje unutar pasusa)

```xml
<w:pPr>
  <w:ind w:firstLine="720"/>
</w:pPr>
```

Pola inca = 720 twips. Koristi za numerisane tacke unutar obrazlozenja kada ne ides sa hanging.

## 7. Bold — kompletna lista scenarija

Bold se koristi **iskljucivo** u ovim situacijama:

1. **Stranke u zaglavlju:** numeracija i rec "ТУЖИЛАЦ:", "ТУЖЕНИ:", "ОКРИВЉЕНИ:"
2. **Glavni naslov:** Т У Ж Б А, Ж А Л Б А, П Р И Г О В О Р
3. **Dispozitivni glagoli:**
   - ПОНИШТАВА СЕ (ponistenje)
   - ОБАВЕЗУЈЕ СЕ (obavezivanje)
   - ЗАБРАЊУЈЕ СЕ (zabrana)
   - ДОЗВОЉАВА СЕ (dozvola)
   - ОДБАЦУЈЕ СЕ (odbacuje)
   - УСВАЈА СЕ (usvaja)
   - ОДБИЈА СЕ (odbija)
   - УКИДА СЕ (ukida)
   - ПОТВРЂУЈЕ СЕ (potvrdjuje)
4. **Punch-recenice** — 1-2 recenice po dokumentu koje nose celu argumentaciju
5. **Section markeri:** РЕЗИМЕ, ПРЕДЛОГ СУДУ, ТРОШКОВНИК, УМЕСТО ДИСПОЗИЦИЈЕ
6. **"ДОКАЗ:"** — rec pre nabrajanja dokaza (samo ta rec, ne i dokazi)
7. **"Образложење"** — uvodna rec sekcije obrazlozenja

**Nikad bold:**
- Cele pasuse (samo pojedinacne recenice)
- Datume
- Brojevе predmeta u zaglavlju
- Fusnotе

```xml
<w:r>
  <w:rPr><w:b/><w:bCs/></w:rPr>
  <w:t>ПОНИШТАВА СЕ</w:t>
</w:r>
```

## 8. Italic — kompletna lista scenarija

Italic se koristi **iskljucivo** za:

1. **Imena dokaza** posle "ДОКАЗ:" — *уговор о закупу*, *извод из катастра*, *изјава сведока*
2. **Latinski pravni termini:** *in concreto*, *prima facie*, *de lege ferenda*, *ex tunc*, *erga omnes*
3. **Naslovi sudskih odluka** u citatu: *Пресуда Врх. кас. суда Прев 312/2021 од 15.05.2021*
4. **Section markeri pre sadrzaja:** *РЕЗИМЕ СПОРА*, *ПРЕДЛОГ СУДУ* (uz bold)
5. **Naslovi knjiga/clanaka** kada se referenciraju: *Грађанско процесно право* Т. Познића

**Nikad italic:**
- Cele pasuse
- Imena stranaka u zaglavlju
- Datume
- Clanke zakona (oni idu sa underline ili bold)

```xml
<w:r>
  <w:rPr><w:i/><w:iCs/></w:rPr>
  <w:t>fotokopija ugovora o zakupu</w:t>
</w:r>
```

## 9. Underline — kompletna lista scenarija

Underline (podvlacenje) se koristi **iskljucivo** za:

1. **Citiranje clanova zakona** kada se podvlaci zakonska norma: _чл. 130 ЗОО_
2. **Najjace isticanje** (kombinacija bold+underline) — za 1-2 kljucne recenice u celom dokumentu
3. **Reference na priloge:** _прилог бр. 3_

**Nikad underline:**
- Cele recenice
- Linkove (u .docx nemaju smisla)
- Naslove (oni idu bold)

```xml
<w:r>
  <w:rPr><w:u w:val="single"/></w:rPr>
  <w:t>чл. 130 ЗОО</w:t>
</w:r>

<!-- Bold + underline za maksimalno isticanje -->
<w:r>
  <w:rPr><w:b/><w:u w:val="single"/></w:rPr>
  <w:t>тужба је поднета благовремено</w:t>
</w:r>
```

## 10. Razmaknuta slova (spaced letters)

Samo za glavne naslove. Izmedju svakog slova — jedan razmak.

```
Т У Ж Б А
Ж А Л Б А
П Р И Г О В О Р
П Р Е С У Д У   (u dispoziciji)
Р Е Ш Е Њ Е
О П Т У Ж Н И   П Р Е Д Л О Г
П Р Е Д Л О Г   З А   И З В Р Ш Е Њ Е
```

Izmedju reci — **tri razmaka**. Ceo naslov centriran, 18pt bold.

## 11. Petit (10pt) — kada i kako

Petit stampa se koristi za:
- Fusnote (na dnu strane ili posle paragrafa)
- Citiranje sudske prakse ispod glavnog obrazlozenja (sa *Пресуда... од...*)
- Napomene: "видети у прилогу бр. X"
- Reference na strucnu literaturu

Pattern:
```
Глав­ни текст 12pt...

______________________________________________________________________________
⁽¹⁾ Видети: Т. Познић, Грађанско процесно право, Нови Сад 2015, стр. 245.
⁽²⁾ Упор.: Пресуда Врх. кас. суда Прев 312/2021 од 15.05.2021.
```

Fusnota ide 10pt, moze italic (ako je citat iz prakse/literature).

## 12. Separatori sekcija

Linija od 78 donjih crta na posebnom pasusu, bez bold-a:

```
______________________________________________________________________________
```

Koristi pre velikih sekcija: pre "ДОКАЗА", pre "ПРЕДЛОГА СУДУ", pre troskovnika, pre potpisa.

## 13. Tabela troskova (troskovnik)

Dot leader (tackice do desne ivice):

```
Састав тужбе ....................................................... 30.000,00 RSD
Такса на тужбу .................................................... 100.000,00 RSD
Превођење документа ................................................ 15.000,00 RSD
Поступање на рочишту .............................................. 15.000,00 RSD
__________________________________________________________________________
У К У П Н О ...................................................... 160.000,00 RSD
```

- Naslov stavke levo
- Tackice (.) do pozicije ~70 znakova
- Iznos desno
- UKUPNO: 2 razmaka izmedju slova, bold, sa linijom separatora pre

## 14. Numeracija

### 14.1. Numeracija u zaglavlju stranaka
- Arapski brojevi sa tackom: 1., 2., 3.
- Hanging indent (videti 6.1)
- Rec "ТУЖИЛАЦ" bold, dvotacka, tab

### 14.2. Numeracija tacaka u obrazlozenju
- Arapski brojevi sa tackom na novom redu
- Prvi red indent 720 twips
- Ne koristi automatsku numeraciju (w:numPr) — rucno pisi 1., 2., 3.

### 14.3. Numeracija alineja
- a), b), c) — mala slova sa zatvorenom zagradom
- Hanging indent 1440
- Ne koristi automatsku numeraciju

## 15. Razmak izmedju pasusa u logickim sekcijama

- Izmedju pasusa obrazlozenja: standardni (160 posle)
- Izmedju sekcija (npr. "Образложење" → "Докази"): 240-320 posle + separator linija
- Izmedju stranaka u zaglavlju: 120 posle (manje, jer su deo iste celine)

## 16. Sta NIKAD ne koristi

- **Emoji** ni u jednoj formi
- **Boje** osim crne (bez plavih, crvenih, zutih)
- **Sencenje pasusa** (w:shd)
- **Okvire** (w:pBdr) — osim ako nije tabela
- **Cudne fontove** (Comic Sans, Arial, Calibri — ni slucajno)
- **Hiperlinkove** u pravnim aktima — sud ne cita online
- **Automatsku numeraciju listi** (w:numPr) — uvek rucno za kontrolu
- **Drop cap** (vidno slovo na pocetku)

## 17. XML primer kompletnog akta (skelet)

```xml
<w:document>
  <w:body>

    <!-- Gornji meta (levo/desno po potrebi) -->
    <w:p>
      <w:pPr><w:jc w:val="right"/></w:pPr>
      <w:r><w:rPr><w:sz w:val="24"/></w:rPr>
        <w:t>ОСНОВНОМ СУДУ У НОВОМ САДУ</w:t>
      </w:r>
    </w:p>

    <!-- Glavni naslov 18pt bold razmaknut -->
    <w:p>
      <w:pPr><w:jc w:val="center"/><w:spacing w:after="320"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="36"/></w:rPr>
        <w:t>Т У Ж Б А</w:t>
      </w:r>
    </w:p>

    <!-- Stranke sa hanging indent -->
    <w:p>
      <w:pPr><w:ind w:left="2160" w:hanging="2160"/></w:pPr>
      <w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr>
        <w:t>1. ТУЖИЛАЦ:</w:t>
      </w:r>
      <w:r><w:tab/></w:r>
      <w:r><w:rPr><w:sz w:val="24"/></w:rPr>
        <w:t>КАЛЕНТИЋ Никола, из Новог Сада...</w:t>
      </w:r>
    </w:p>

    <!-- Dokazi -->
    <w:p>
      <w:pPr><w:ind w:left="1440" w:hanging="1440"/></w:pPr>
      <w:r><w:rPr><w:b/></w:rPr><w:t>ДОКАЗ:</w:t></w:r>
      <w:r><w:tab/></w:r>
      <w:r><w:rPr><w:i/></w:rPr>
        <w:t>фотокопија уговора о закупу од 12.03.2024.</w:t>
      </w:r>
    </w:p>

    <!-- Potpis -->
    <w:p>
      <w:pPr><w:jc w:val="right"/></w:pPr>
      <w:r><w:rPr><w:sz w:val="24"/></w:rPr>
        <w:t>адв. Милан Мишић</w:t>
      </w:r>
    </w:p>

  </w:body>
</w:document>
```

## 18. Footer sa brojem strane

Footer sadrzi broj strane desno poravnat (PAGE field):

```xml
<w:sdtContent>
  <w:p>
    <w:pPr><w:pStyle w:val="Footer"/><w:jc w:val="right"/></w:pPr>
    <w:r><w:fldChar w:fldCharType="begin"/></w:r>
    <w:r><w:instrText xml:space="preserve"> PAGE   \* MERGEFORMAT </w:instrText></w:r>
    <w:r><w:fldChar w:fldCharType="separate"/></w:r>
    <w:r><w:rPr><w:noProof/></w:rPr><w:t>1</w:t></w:r>
    <w:r><w:fldChar w:fldCharType="end"/></w:r>
  </w:p>
</w:sdtContent>
```

## 19. Statistika iz uzornog dokumenta

Iz analize "Kalentic Nikola i Bojic Bojan, Flexopack 1980 TUZBA..." izvuceni su sledeci podaci:
- 197 pasusa ukupno
- 584 font-run-a sa Times New Roman
- 442 run-a na osnovnoj velicini (12pt)
- 121 bold run (~14% ukupnog teksta)
- 101 italic run (~11% ukupnog teksta)
- 79 underline run-ova (~9% ukupnog teksta)

Ovi odnosi (14/11/9) predstavljaju **zdravu distribuciju isticanja** — dokument je prepoznatljiv kao profesionalan, nije preopterecen.

---

## 20. MINI-NASLOVI unutar obrazlozenja (iz Sesija 2+3)

U slozenim aktima (zalba sa vise razloga, tuzba sa vise osnova, prigovor sa vise argumenata), obrazlozenje se podeli na **pravne podcele**. Svaka podcela ima svoj mini-naslov.

**Pravila mini-naslova:**
- **NIJE CAPS** (CAPS se koristi za emfaze unutar obrazlozenja, ne za naslove)
- **NIJE bold** (iako je centriran)
- **12pt regular, centriran**
- Nalazi se **izmedju dve horizontalne linije** (78 donjih crta, kao separatori)
- Opisuje pravnu podcelu koja sledi

**Primer iz Kalentić ZALBA:**
```
______________________________________________________________________________

Погрешна примена члана 257 става 1 ЗКП

______________________________________________________________________________

[pasus argumentacije sa CAPS emfazom]
Први од многих је тај што је Решењем већа Основног суда...
```

**Kada se koristi:**
- Zalba sa vise razloga (svaki razlog = svoj mini-naslov)
- Odgovor na tuzbu kompleksne strukture (A/B/C/D)
- Prigovor na odbacaj KP gde se dekonstruise vise argumenata tuzilastva
- ZZZ gde se obradjuje vise razloga taxativno

**Razlika od section markera:**
- Section markeri (ОБРАЗЛОЖЕЊЕ, РЕЗИМЕ, ПРЕДЛОГ СУДУ) su 16pt bold, opisni i centrirani
- Mini-naslovi su 12pt regular, centrirani, izmedju linija — sluze kao "pravni podnaslovi"

---

## 21. A/B/C/D STRUKTURA za složena obrazloženja (Stepanović model)

Koristi se u **kompleksnim odgovorima na tuzbu** gde se oprovergavaju vise tvrdnji tuzioca:

```
А) УГОВОР О ДОЖИВОТНОМ ИЗДРЖАВАЊУ НИЈЕ НИШТАВ

   Обавеза издржавања у целости испуњена
   [argumentacija + DOKAZI]
   
   Имовина из Уговора јесте посебна имовина примаоца издржавања
   [argumentacija + DOKAZI]

______________________________________________________________________________

Б) НАСЛЕДНА ПРАВА ТУЖИЉЕ НИСУ ПОВРЕЂЕНА
   [argumentacija]

______________________________________________________________________________

Ц) НАСЛЕДНА ПРАВА ТУЖИЉЕ НИСУ ПОВРЕЂЕНА – поклон од родитеља
   [argumentacija]

______________________________________________________________________________

Д) РЕЗИМЕ И ПРЕДЛОГ СУДУ

   Summa summarum свега изнетог:
   А) [kratka tacka A]
   Б) [kratka tacka B]
   Ц) [kratka tacka C]
   
   [final petit: ОДБАЦИ ТУЖБУ, ОДБИЈЕ, ОБАВЕЖЕ]
```

**Pravila A/B/C/D:**
- Oznaka cirilica u zagradi (А), Б), Ц), Д))
- Naslov CAPS bold 14pt, levo poravnat (ne centriran!)
- Podnaslov unutar (npr. "Обавеза издржавања у целости испуњена") = regular 12pt, levo
- ПРВО, ДРУГО, ТРЕЋЕ numeracija unutar podsekcije (CAPS za snazniju strukturu)
- Horizontalne linije izmedju sekcija A/B/C/D
- Konacna sekcija Д) je uvek **REZIME + PREDLOG SUDU**
- Koristi se **kada ima 3+ glavnih argumenta** koji su logicki razliciti

**Kada NE koristiti:**
- Akti sa 1-2 argumenta (samo pisemo linearno)
- Krivicne zalbe (tamo su mini-naslovi izmedju linija bolji)
- Podnesak, dopis, opomena (prekratko)

---

## 22. CITIRANJE ZAKONA — u kurzivu sa navodnicima (NE parafraza)

**FUNDAMENTALNO PRAVILO MIŠIĆEVOG STILA.**

Zakonski tekstovi se **NIKAD ne parafraziraju** kada se iznosi argument. Uvek se **doslovno citiraju** u kurzivu sa posebnim navodnicima.

**Pattern:**
```
Чланом [broj] ст. [broj] ЗКП одређено је:

    ,,[doslovan tekst zakona u kurzivu]"
```

**Primer iz Kalentic TUZBA:**
```
Чланом 447 ст. 1,2 ЗИО одређено је:

    ,,Суд може одредити привремену меру пре, у току или после 
    судског или управног поступка па док извршење не буде спроведено.

    Поред обезбеђења потраживања која се састоје од давања, 
    чињења, нечињења или трпљења..."
```

**Tipografska pravila:**
- **,,...\"** — srpski navodnici (doublebaseline quote + hungumlaut quote), NIKAD "..." 
- **Citat u italic** (kurziv) — cela pasus zakonskog teksta
- **Indent** — citat je uvucen 720 twips (pola inca) za vizuelno izdvajanje
- **Pre citata** — uvodna recenica ("Чланом X одређено је:" ili "Чл. X ЗКП одређује (цитирам):")
- **Posle citata** — prazan red, pa argumentacija

**XML primer:**
```xml
<!-- Uvodna recenica -->
<w:p>
  <w:r><w:rPr><w:sz w:val="24"/></w:rPr>
    <w:t>Чланом 447 ст. 1,2 ЗИО одређено је:</w:t>
  </w:r>
</w:p>

<!-- Citat u italic sa indent -->
<w:p>
  <w:pPr><w:ind w:left="720"/></w:pPr>
  <w:r><w:rPr><w:i/><w:sz w:val="24"/></w:rPr>
    <w:t>,,Суд може одредити превремену меру пре, у току или после..."</w:t>
  </w:r>
</w:p>
```

**Kada se MORA citirati doslovno (ne parafraza):**
- Kada se poziva na konkretan zakonski clan kao **pravni osnov tvrdnje**
- U predlogu za privr. meru (obavezno citat ZIO čl. 447, 449)
- U reviziji, ZZZ, ustavnoj zalbi (Vrhovni sud ne trpi parafraze)
- U zalbama na povredu postupka (citat povredjenog clana ZPP/ZKP)

**Kada se mogu parafrazirati:**
- Opste pozivanje bez tvrdnje ("u skladu sa ZOO", "prema ZPP")
- Kratki reference ("čl. 465-469 ZKP")
- Kada je to opstepoznato pravilo bez doslovnog znacaja teksta

**Anti-pattern (NIKAD):**
```
Član 447 ZIO kaže da sud može odrediti privremenu meru pre postupka. [LOŠE]
```
Uvek kompletan citat ako se iznosi argument.

---

## 23. СЕКЦИЈА РЕЗИМЕ pre petita (Kalentić TUŽBA, Stepanović ODGOVOR)

U kompleksnim aktima (tuzba sa privremenom merom, odgovor na tuzbu sa vise argumenata, zalba sa vise razloga), **PRE PETITA** se uvek pravi rezime.

**Pattern:**
```
______________________________________________________________________________

                              РЕЗИМЕ

Дакле, да резимирамо до сад изнето:

    Књиговодствена вредност укупне имовине туженог 2. реда... 
    [tacka 1 — zavrsi zarezom],
    
    ДРУШТВО ЈЕ ПОСЛОВАЛО ТОКОМ 2023. ГОДИНЕ ,,У МИНУСУ"... 
    [tacka 2 — zavrsi zarezom],
    
    [tacka 3 — zavrsi zarezom],
    
    [tacka 4 — zavrsi zarezom],
    
    па сходно одредбама чланова 470-473 ЗПД, као и одредбама 
    чл. 74 и 75 ЗОО, предметни Споразум мора бити поништен.

______________________________________________________________________________

                        ПРЕДЛОГ СУДУ

[ide petit]
```

**Pravila РЕЗИМЕ sekcije:**
- Naslov "РЕЗИМЕ" ili "Р Е З И М Е" — 14pt bold centriran
- Uvodna recenica: **"Дакле, да резимирамо до сад изнето:"**
- Svaka tacka je **sazeta verzija tacke iz obrazlozenja** — cesto gotovo doslovna copy-paste
- **Tacka zavrsava zarezom** (ne tackom!) — jer lista tece kao jedna duga recenica
- **Poslednja tacka** je zakljucak ("..., па тако [sankcija]") — zavrsava tackom
- Izmedju rezime i petit — linija separator
- Alternativni naslov: **"Summa summarum свега изнетог:"** (Stepanović model, latinski)

**Kada KORISTITI:**
- Tuzba sa vise osnova i DOKAZA (>3)
- Odgovor na tuzbu sa A/B/C/D strukturom (D sekcija je RESIME)
- Zalba sa vise razloga ili kompleksnom argumentacijom
- Revizija (kompleksni predmeti)

**Kada NE koristiti:**
- Prost podnesak, opomena, urgencija (prekratko)
- Jednostavna zalba sa jednim razlogom
- Misljenje (konsultativni register)

---

## 24. CITIRANJE ISKAZA SVEDOKA u podneskama

Kada se u podnesku analizira iskaz svedoka, citira se **doslovno**:

**Pattern:**
```
Тужиља је на главној расправи одржаној 03.06.2022. године 
децидирано потврдила да је давалац издржавања пружао издржавање, 
тако што је изјавила:

    ,,Овај преглед је извршен у КЦВ. Ја знам да је том приликом 
    Драгиша возио оца у КЦВ на преглед",

затим:

    ,,Мој брат је водио оца у лабораторију ДЗ на Лиману ради 
    ових налаза", итд.

ДОКАЗ:    Записник од 03.06.2022. године, стр. 8 (у списима предмета)
```

**Pravila:**
- Citat u italic sa navodnicima ,,...\"
- Indent 720 twips
- Referenca na **Zapisnik sa datumom i stranicom** (obavezno)
- "и тако" / "затим" / "коначно" povezuju vise citata istog svedoka
- DOKAZ blok posle citata

---

## 25. PROCENTUALNO IZRAŽAVANJE USPEHA (za troskove u zalbi)

U zalbama na presudu gde tuzbeni zahtev nije usvojen u celosti — standardni Misicev pattern za trazanje troskova je **procentualno izrazavanje uspeha**:

**Pattern:**
```
Тужиља је својом Тужбом, где је вредност спора ТРИДЕСЕТ МИЛИОНА ДИНАРА, 
поставила 15 тужбених захтева.

Тужиља је својом Тужбом успела да утврди само... [sta je usвoenо]

У делу у ком је тужиља ,,успела у поступку", издражавајући исто 
монетарно, успела је цца у 2.000.000,00 динара, јер ноторна је 
чињеница цца вредност [parametri]...

ДРУГИМ РЕЧИМА, ТУЖИЉА ЈЕ ОД 30.000.000,00 ДИНАРА, КОЛИКО ЈЕ 
ВРЕДНОСТ ОВОГ СПОРА, УСПЕЛА У ЦЦА 2.000.000,00 ДИНАРА, ДАКЛЕ 
ТУЖИЉА ЈЕ ОСТВАРИЛА ,,УСПЕХ" (боље рећи неуспех) од 6,67%.

Vice versa, ово значи да су странке – Тужени 1, 2 и 3. реда 
у овом поступку УСПЕЛИ 93,33% онога што су истицали све 
време током трајања парнице.
```

Zatim citat **čl. 153 st. 2 ZPP** u kurzivu sa navodnicima, zatim pozivanje na **sudsku praksu VKS** sa brojem odluke, pa **ponovni citat istog clana** ("Поново цитирам чл. 153 ст. 2 ЗПП:").

**Gde se koristi:**
- Zalba na presudu gde je deo tuzbenog zahteva odbijen
- Traženje troškova u korist tuzene strane
- Isticanje disproporcije između "uspeha" tuzioca i pravih troskova poravnanja

---

## 26. SLOJEVITE KAMATE U IZVRSNOM PETIT-u

Kada izvrsni dužnik parcijalno uplati kroz vreme, kamata se **razbija po intervalima**:

**Pattern:**
```
- Рачуна број 2024-514 од дана 08.03.2024. године износ од 
  372.368,64 динара са законском затезном каматом и то 
  са законском затезном каматом на износ 1.172.368,64 динара 
  од почев од 09.03.2024. године, па до 14.01.2025. године, 
  затим на износ од 572.368,64 динара почев од 15.01.2025. 
  године, па до 27.01.2025. године и на износ 372.368,64 
  динара почев од 27.01.2025. године, па до коначне исплате,
```

**Pravila:**
- Svaki interval kamate = jedan "sloj"
- Format: "на износ **X** почев од **DATUM1**, па до **DATUM2**"
- Posledni sloj zavrsava sa "**па до коначне исплате**"
- Sve u jednoj tacki (bullet point, odvojeno zapetom)
- Precizni datumi parcijalnih uplata — svaka uplata pomera interval

**Kada se koristi:**
- Predlog za izvrsenje gde je dužnik delimično uplatio
- Prigovor na izvršenje gde se obračun kamate preispituje
- Revizija na odluku o kamati

Bez ovog patterna — izvrsni akt gubi na preciznosti i vodi ka pogresnim obracunima.
