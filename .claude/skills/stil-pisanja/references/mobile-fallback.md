# Mobile / Chat fallback — SPECIFICATION mode

Ovaj fajl definise kako `stil-pisanja` radi u okruzenjima gde **nema pristupa file sistemu** — Claude.ai web, mobilna aplikacija, chat interfejsi, i sve varijante bez Cowork desktop-a.

---

## 1. Kada se aktivira SPECIFICATION mode

Automatska detekcija na pocetku rada:

| Test | Rezultat | Mode |
|---|---|---|
| Dostupan `Write` + `Bash` + Python sandbox? | DA | **EXECUTION** (generise .docx direktno) |
| Dostupan `Artifacts` tool, nema `Write`? | DA | **SPEC+ARTIFACT** (HTML artifact + markdown fallback) |
| Samo tekst output? | DA | **SPECIFICATION** (cist markdown + HTML blok) |

**Vazno:** Pravila stila su **identicna** u svim modovima. Razlikuje se samo *nacin isporuke*.

---

## 2. SPECIFICATION mode — sta korisnik dobija

### 2.1 Dva paralelna outputa

**Output A — MARKDOWN** (za brzo cupanje teksta):

```markdown
# Т У Ж Б А

## ОСНОВНОМ СУДУ У НОВОМ САДУ

**1. ТУЖИЛАЦ:** КАЛЕНТИЋ Никола, ЈМБГ 1234567890123,
из Новог Сада, ул. Змај Јовина бр. 5,
кога заступа пуномоћник адв. Милан Мишић

**2. ТУЖЕНИ:** ФЛЕКСОПАК 1980 д.о.о., МБ 12345678,
из Београда, ул. Булевар ослобођења бр. 100

### Образложење

Дана 12.03.2024. године, између тужиоца и туженог закључен је
уговор о закупу непокретности...

**ДОКАЗ:**
- *фотокопија уговора о закупу од 12.03.2024. године*
- *извод из катастра непокретности РГЗ од 15.04.2024. године*
- *изјава сведока Петра Петровића од 20.05.2024. године*

### ПРЕДЛОГ СУДУ

**ОБАВЕЗУЈЕ СЕ** тужени да тужиоцу исплати...

---

Нови Сад, дана 17.04.2026. године

                                                  адв. Милан Мишић
```

**Output B — HTML** (za copy-paste u Word sa ocuvanim formatiranjem):

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: "Times New Roman", serif; font-size: 12pt;
         text-align: justify; line-height: 1.15; margin: 1in; }
  h1.naslov-glavni { font-size: 18pt; font-weight: bold;
                     text-align: center; letter-spacing: 0.3em;
                     margin: 24pt 0; }
  h2.dispozicija { font-size: 16pt; font-weight: bold;
                   text-align: center; margin: 16pt 0; }
  .adresat { text-align: right; font-size: 12pt; }
  .stranka { padding-left: 1.5in; text-indent: -1.5in;
             font-weight: bold; }
  .dokaz-blok { padding-left: 1in; text-indent: -1in; }
  .dokaz-label { font-weight: bold; }
  .dokaz-item { font-style: italic; }
  .petit { font-size: 10pt; }
  .potpis { text-align: right; margin-top: 36pt; }
  .datum { text-align: left; margin-top: 24pt; }
  .separator { text-align: center; letter-spacing: -0.5pt; }
  em, i { font-style: italic; }
  strong, b { font-weight: bold; }
  u { text-decoration: underline; }
</style>
</head>
<body>

<div class="adresat">ОСНОВНОМ СУДУ У НОВОМ САДУ</div>

<h1 class="naslov-glavni">Т У Ж Б А</h1>

<p class="stranka">1. ТУЖИЛАЦ: КАЛЕНТИЋ Никола, ЈМБГ 1234567890123,
из Новог Сада...</p>

<p class="stranka">2. ТУЖЕНИ: ФЛЕКСОПАК 1980 д.о.о., МБ 12345678,
из Београда...</p>

<p><strong>Образложење</strong></p>

<p>Дана 12.03.2024. године, између тужиоца и туженог
закључен је уговор о закупу непокретности...</p>

<p class="dokaz-blok">
<span class="dokaz-label">ДОКАЗ:</span>
<span class="dokaz-item">фотокопија уговора о закупу од 12.03.2024. године</span>
</p>

<h2 class="dispozicija">П Р Е Д Л О Г   С У Д У</h2>

<p><strong>ОБАВЕЗУЈЕ СЕ</strong> тужени...</p>

<div class="separator">_____________________________________________________</div>

<p class="datum">Нови Сад, дана 17.04.2026. године</p>

<p class="potpis">адв. Милан Мишић</p>

</body>
</html>
```

### 2.2 Uputstvo korisniku (obavezan dodatak)

Posle dva outputa, ispisi:

```
📱 UPUTSTVO ZA KORISNIKA (SPECIFICATION mode)

1. KOPIRANJE U WORD NA TELEFONU:
   → Drzi prst na HTML bloku dok ne krene selekcija
   → Kopiraj sve (Select All + Copy)
   → Otvori Word na telefonu, novi dokument
   → Dugacak pritisak → Paste
   → Formatiranje se automatski primeni

2. KOPIRANJE U GOOGLE DOCS:
   → Isto kao Word — paste ce ocuvati stil

3. NAZIV FAJLA (snimi rucno):
   [PREDLOZENI NAZIV PO PATTERN-U]

4. POTPIS:
   Sacuvaj kao .docx sa tim nazivom i posalji sudu.
```

---

## 3. HTML stil-template — kompletna mapa

### 3.1 Osnovni template (copy-paste u Word ocuva font + margine + prored)

```css
body {
  font-family: "Times New Roman", serif;
  font-size: 12pt;
  line-height: 1.15;
  text-align: justify;
  margin: 1in;
}
```

### 3.2 Velicine po ulozi

```css
.petit        { font-size: 10pt; }       /* fusnote, napomene */
.telo         { font-size: 12pt; }       /* default */
.isticanje    { font-size: 14pt; font-weight: bold; }
.dispozicija  { font-size: 16pt; font-weight: bold; text-align: center; }
.naslov-glavni { font-size: 18pt; font-weight: bold;
                 text-align: center; letter-spacing: 0.3em; }
```

### 3.3 Razmaknuta slova — trik za HTML

HTML nema direktno "svako slovo ima razmak". Umesto toga:
- Koristi `letter-spacing: 0.3em` u CSS-u (opciono)
- ILI u tekstu direktno unesi razmake: `Т У Ж Б А` (kao u plugin-u)

**Preporuka:** Direktno razmaci u tekstu (`Т У Ж Б А`) — Word ce to zadrzati tacno kako je.

### 3.4 Hanging indent u HTML-u

```css
.stranka {
  padding-left: 1.5in;      /* 2160 twips u .docx */
  text-indent: -1.5in;
}

.dokaz-blok {
  padding-left: 1in;         /* 1440 twips u .docx */
  text-indent: -1in;
}
```

### 3.5 Potpis i datum

```css
.datum   { text-align: left; margin-top: 24pt; }
.potpis  { text-align: right; margin-top: 36pt; font-size: 12pt; }
```

### 3.6 Separator (78 donjih crta)

```html
<p style="text-align: center; letter-spacing: -0.5pt;">
______________________________________________________________________________
</p>
```

---

## 4. Markdown-only fallback (kada HTML ne prolazi)

Ako je okruzenje jos restriktivnije i HTML nije podrzan (npr. samo plain chat), koristi **markdown konvencije sa eksplicitnim uputstvima**:

```
# Т У Ж Б А
*[PRIMENI U WORD-U: 18pt, bold, centrirano, razmaknuta slova]*

**1. ТУЖИЛАЦ:** КАЛЕНТИЋ Никола...
*[hanging indent 1.5", bold "1. ТУЖИЛАЦ:", ostalo regular]*

**ДОКАЗ:**
*[hanging indent 1"]*
*фотокопија уговора о закупу од 12.03.2024. године*
*[italic]*

**ОБАВЕЗУЈЕ СЕ** тужени...
*[bold "ОБАВЕЗУЈЕ СЕ", dispozicija 16pt, centrirano]*

---

Нови Сад, дана 17.04.2026. године
*[levo poravnato]*

                          адв. Милан Мишић
*[desno poravnato]*
```

Korisnik ovo kopira u Word i rucno primenjuje formatiranje po zagradama.

---

## 5. ARTIFACT mode (Claude.ai web Projects)

U Claude.ai Projects okruzenju, stil-pisanja moze koristiti `Artifacts`:

### 5.1 HTML Artifact

Generisi HTML artifact tipa `text/html` sa kompletnim stilom. Korisnik moze:
- Videti renderovan izgled u real-time preview-u
- Kopirati ceo artifact u Word
- Sacuvati artifact kao .html fajl, otvoriti u Word-u

### 5.2 Markdown Artifact

Alternativno, markdown artifact tipa `text/markdown` — lakse za cupanje teksta, bez stila ali sa strukturom.

### 5.3 Oba artifacts paralelno

Preporucen pristup u ARTIFACT mode-u:
1. Prvo HTML artifact (vizuelno verni)
2. Drugo markdown artifact (cist tekst)
3. U chat-u — kratko uputstvo

---

## 6. Compliance izvestaj u SPECIFICATION mode

Dodatak na osnovni compliance izvestaj:

```
║ SPECIFICATION MODE AKTIVAN                               ║
║  Razlog: [nema Write tool / mobile / chat]               ║
║  Output A (markdown): [✅/❌]                             ║
║  Output B (HTML): [✅/❌]                                 ║
║  Uputstvo korisniku dato: [✅/❌]                         ║
║  Predlozeni naziv fajla: [ime].docx                      ║
╠═══════════════════════════════════════════════════════════╣
║ KORISNIK MORA RUCNO:                                      ║
║  1. Kopirati HTML u Word/Docs                            ║
║  2. Sacuvati pod imenom: [ime].docx                      ║
║  3. Verifikovati finalni izgled                          ║
```

---

## 7. Edge cases — specification mode

### 7.1 Dokument previse dug za chat output

Ako akt prelazi ~8000 reci → podeli u blokove i upozori korisnika:
```
⚠️ Akt je predugacak za jedan output. Delim u 3 dela:
   Deo 1/3: zaglavlje + stranke + uvod
   Deo 2/3: obrazlozenje + dokazi
   Deo 3/3: predlog suda + troskovnik + potpis

Spoji ih redom u Word.
```

### 7.2 Korisnik nema Word na telefonu

Predlozi alternative:
- **Google Docs** (besplatan, u browser-u)
- **WPS Office** (besplatno, mobile)
- **Apple Pages** (iOS)
- **LibreOffice** (desktop)

### 7.3 Cirilica se ne prenosi pravilno

Neki chat interfejsi menjaju Ћ → Ć ili slicno. U tom slucaju:
- Koristi UTF-8 escape sekvence u HTML-u
- Ili eksplicitno upozori korisnika da proveri cirilicu pre cuvanja

---

## 8. Test-protokol za SPECIFICATION mode

Pre nego sto output ode korisniku:

1. ✅ Oba outputa generisana (markdown + HTML)?
2. ✅ HTML validno parsiran (zatvoreni tagovi)?
3. ✅ Inline stilovi prisutni (font-family, font-size)?
4. ✅ Razmaknuta slova u naslovu tacna?
5. ✅ Hanging indenti u CSS-u definisani?
6. ✅ Predlozeni naziv fajla ispravan?
7. ✅ Uputstvo korisniku dato?
8. ✅ Compliance izvestaj popunjen sa "SPECIFICATION MODE AKTIVAN"?

Tek tada — predaja verifikator-u.

---

## 9. Prelazak izmedju modova (mid-conversation switch)

Ako korisnik tokom razgovora kaze:
- *"Sada sam na desktopu, mogu da generises .docx"* → prelaz u EXECUTION
- *"Na telefonu sam sada"* → prelaz u SPECIFICATION

Skill reaguje tako sto ponovo detektuje okruzenje i prilagodjava output. Pravila stila ostaju ista — samo format isporuke se menja.
