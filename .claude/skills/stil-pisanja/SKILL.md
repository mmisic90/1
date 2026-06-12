---
name: stil-pisanja
description: "Vizuelni stil za pravne dokumente advokata Milana Misica — obican Claude skill koji radi u Claude.ai web, Claude mobile, i Claude Projects preko Customize → Skills. Aktiviraj pre generisanja bilo kog pravnog akta (tuzba, zalba, prigovor, ugovor, krivicna prijava, predlog za izvrsenje, revizija, odgovor na optuznicu, podnesak, dopis, izjasnjenje, ZZZ, pisana odbrana, predstavka ESLJP, ustavna zalba) ili kada korisnik kaze 'stil pisanja', 'moj stil', 'u mom stilu', 'sredi vizuelno', 'formatiraj kao moj akt', 'primeni stil', 'kao ostali moji akti'. Definise font Times New Roman, velicine 10-18pt, bold/italic/underline pravila, nabrajanje dokaza, indente, petit stampu, potpis adv. Milan Misic, naming pattern 'Klijent i Protivnik TIP PODNESKA.docx' bez dijakritika sa pravilima iz milan-legal-style v2. Poziva se iz skill-ova pravna-analiza, krivica, tuzba-parnica, istrazivanje-prakse pre predaje verifikatoru. U lancu — pretposlednji (verifikator je poslednji)."
---

# Stil pisanja — vizuelni DNA advokatske kancelarije adv. Milan Mišić

Ovaj skill je **vizuelni filter** koji se primenjuje na SVAKI pravni dokument pre nego što se isporuči korisniku.
On ne bira šta se piše (to rade `krivica`, `tuzba-parnica`, `pravna-analiza`) — on bira **kako to izgleda**.

**Verzija:** 3.0.0 (Opcija 6 — kompozicioni šabloni — apgrejd iz Sesija 2+3 korpusa 2022-2026)
**Autor pravila:** adv. Milan Mišić, Novi Sad, ul. Maksima Gorkog br. 6

---

## Šta je novo u v3.0.0 (od v2.0.0)

Apgrejd baziran na dubinskoj analizi 15+ stvarnih akata iz kancelarije (Kalentić/Flexopack, Stepanović/Grabovac, Vuković 1967/Republika Srbija, Armex/VRB, Galens, AB PRO ING, Juškić). Promene:

1. **Proširen `reference_naming.md`** — dodato ~30 novih tipova akta iz korpusa
2. **Proširen `reference_potpis.md`** — dodata **matrica potpisnih blokova** (ko potpisuje šta) + **realne tarife** iz korpusa 2022-2026
3. **Proširen `reference_vizuelno.md`** — dodato:
   - Sekcija 20: Mini-naslovi unutar obrazloženja
   - Sekcija 21: A/B/C/D struktura za složena obrazloženja (Stepanović model)
   - Sekcija 22: Citiranje zakona u kurzivu sa navodnicima
   - Sekcija 23: РЕЗИМЕ sekcija pre petita
   - Sekcija 24: Citiranje iskaza svedoka
   - Sekcija 25: Procentualno izražavanje uspeha za troškove
   - Sekcija 26: Slojevite kamate u izvršnom petitu
4. **NOVO: `reference_retorika_jezik.md`** — kompletan DNK jezika (latinski maksimi, kontrafaktual, retoričko pitanje, CAPS pravila, registri po tipu akta)
5. **NOVO u `pravna-analiza/references/reference_terminologija.md`** — matrica terminologije stranaka po tipu postupka (parnica/krivica/izvršenje/vansudski/ugovor) + kompletna lista sudova + brojevi predmeta

**Kompozicioni šabloni** (Opcija 6 arhitektura) biće dodati u narednim sesijama u skill-ove `krivica/references/sabloni/` i `tuzba-parnica/references/sabloni/`.

---

## Kako ovaj skill radi u Claude.ai

Ovaj skill je **obični Claude skill** (ne Cowork plugin, ne generiše .docx fajlove direktno). Primarni output je:

1. **MARKDOWN blok** — čist tekst akta sa jasnim markerima za bold/italic/underline
2. **HTML blok** — spreman za copy-paste u Word, sa inline stilovima koji čuvaju font/veličinu/margine
3. **Predložen naziv fajla** po pravilima iz `references/reference_naming.md`

Korisnik zatim:
- Kopira HTML blok u Word / Google Docs (formatiranje se automatski primeni)
- Sačuva fajl pod predloženim imenom
- Čuva markdown kao backup

**Ne pokušavaj da generišeš .docx direktno** — u običnom Claude skill-u to nije dostupno. Ako korisnik eksplicitno traži .docx fajl i ako postoji `docx` skill u environmentu (Cowork desktop), možeš ga pozvati kao opcionalnu dodatnu fazu, ali primarni output je uvek markdown+HTML.

---

## Kada se aktivira

- Uvek pre generisanja pravnog dokumenta kao finalnog akta
- Kada korisnik eksplicitno kaže: **"stil pisanja", "moj stil", "u mom stilu", "kao moja pisanja", "formatiraj pravilno", "sredi vizuelno", "primeni stil", "podnesak", "dopis", "izjašnjenje", "kao ostali moji akti"**
- Kada drugi pravni skill (`pravna-analiza`, `krivica`, `tuzba-parnica`, `istrazivanje-prakse`) predaje tekst za finalni izlaz
- **Pozicija u lancu:** PRETPOSLEDNJI (verifikator je poslednji)

## Kada se NE aktivira

- Za .md draftove i radne verzije (ne isporučuju se kao pravni akt)
- Za analizu postojećeg dokumenta (tamo ide `god-skill-deep-reader` + `pravna-analiza`)
- Za ne-pravne tekstove (Instagram, blog, email, knjižice, "Uz Rame Sa Studentima" postovi)
- Za casual ćaskanje i tehnički debugging

---

## CHAIN POZICIJA — gde stil-pisanja stoji u pravnom lancu

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   pravna-analiza  →  [domenski skill]  →  istrazivanje-      │
│      (Ф0–Ф6)          krivica ili            prakse          │
│                       tuzba-parnica                          │
│                                                              │
│                              ↓                               │
│                                                              │
│                    ┌────────────────────┐                    │
│                    │    stil-pisanja    │   ← OVDE           │
│                    │  (vizuelni filter) │                    │
│                    └──────────┬─────────┘                    │
│                               ↓                              │
│                    ┌────────────────────┐                    │
│                    │    verifikator     │   ← POSLEDNJI      │
│                    │  (mehanička QA)    │                    │
│                    └──────────┬─────────┘                    │
│                               ↓                              │
│                         ISPORUKA KORISNIKU                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Pravila:**
1. `stil-pisanja` se **NIKADA** ne aktivira pre `pravne-analize` + domenskog skilla (za formalne akte)
2. `stil-pisanja` se **UVEK** aktivira pre `verifikatora`
3. Ako `stil-pisanja` otkrije konflikt (nedostajaći podatak, kontradikcija u nazivu fajla) — **STANI, pitaj korisnika**, ne rešavaj tiho
4. `verifikator` NIKADA ne prethodi `stil-pisanja` — ako verifikator vrati greške, vraćamo se na domenski skill ili `stil-pisanja`, ne preskačemo
5. Posle `stil-pisanja` NE DIRA SE vizuelni stil — verifikator proverava sadržaj, ne formu

Detaljno: `references/handoff-protokol.md`

---

## Red operacija

1. **Primi handoff** od prethodnog pravnog skilla (tekst + naming instrukcije) ILI direktno od korisnika
2. **Učitaj `references/reference_vizuelno.md`** — kompletna tipografija
3. **Učitaj `references/reference_retorika_jezik.md`** — DNK jezika (NOVO v3)
4. **Učitaj `pravna-analiza/references/reference_terminologija.md`** — matrica terminologije (NOVO v3)
5. **Učitaj `references/reference_naming.md`** — pattern imenovanja fajla
6. **Učitaj `references/reference_potpis.md`** — matrica potpisnih blokova + troškovnik + tarife
7. **Učitaj `references/checklist_qa.md`** — QA pre isporuke
8. **Učitaj `references/mobile-fallback.md`** — specifikacija output formata (markdown + HTML)
9. **Ako postoji domenski šablon** (planirano za Sesiju 5) — učitaj npr. `krivica/references/sabloni/06_zzz.md`
10. **Primeni vizuelna + jezička pravila** — generiši oba outputa paralelno
11. **Nazovi fajl** po pravilima iz `reference_naming.md`
12. **Daj korisniku uputstvo** — kako da kopira HTML u Word i sačuva pod predloženim imenom
13. **Predaj `verifikatoru`** na proveru
14. **Ispiši post-flight compliance izveštaj**

---

## Brza pravila (hitni sažetak — uvek pročitaj references!)

### Tipografija (obavezno)

| Šta | Vrednost |
|-----|----------|
| Font | Times New Roman, jedini |
| Pismo | Ćirilica (primarno); Latinica samo za firme/zakone/članke (d.o.o., ZKP, ZOO) |
| Veličina tela teksta | 12pt |
| Petit (fusnote, napomene) | 10pt |
| Isticanje (ključne rečenice) | 14pt bold |
| Dispozicija (ПОНИШТАВА СЕ, ОБАВЕЗУЈЕ СЕ) | 16pt bold, centrirano |
| Glavni naslov | 18pt bold, centrirano, razmaknuta slova (Т У Ж Б А) |
| Poravnanje tela | Obostrano (justify) |
| Meta + potpis | Desno poravnanje |
| Margine | 1" sve četiri (1440 twips = 2.54 cm) |
| Format stranice | Letter (12240 × 15840 twips) |
| Prored tela | 1.15 |
| Razmak između pasusa | 160 twips posle |

### Bold (kada DA)

- Numeracije stranaka ("1. ТУЖИЛАЦ ...", "2. ТУЖЕНИ ...")
- Glavni naslov akta
- Dispozitivni glagoli (ПОНИШТАВА, ОБАВЕЗУЈЕ, ЗАБРАЊУЈЕ, ДОЗВОЉАВА, ОДБАЦУЈЕ, УСВАЈА, ОДБИЈА, УКИДА, ПОТВРЂУЈЕ)
- Punch-rečenice (najjače argumente koji nose slučaj)
- Section markeri: **РЕЗИМЕ**, **ПРЕДЛОГ СУДУ**, **ТРОШКОВНИК**, **ОБРАЗЛОЖЕЊЕ**
- "ДОКАЗ:" pre nabrajanja dokaza

### Italic (isključivo za)

- Imena dokaza posle "ДОКАЗ:" — npr. *фотокопија уговора о закупу од 12.03.2024. године*
- Latinski termini (*de lege lata*, *in concreto*, *prima facie*, *ex tunc*)
- Naslove sudskih odluka koje se citiraju (*Прес. Врх. кас. суда Прев 312/2021*)

### Underline

- Citiranje članova zakona (ponekad bold+underline za jače isticanje)
- Nikad NE za cele rečenice — samo ključne reči
- Reference na priloge: _прилог бр. 3_

### Razmaknuta slova (spaced letters)

Samo za glavne naslove:
- Т У Ж Б А
- Ж А Л Б А
- П Р И Г О В О Р
- П Р Е С У Д У (dispozitiv)
- Р Е Ш Е Њ Е (dispozitiv)
- О П Т У Ж Н И   П Р Е Д Л О Г
- П Р Е Д Л О Г   З А   И З В Р Ш Е Њ Е

### Nabrajanje dokaza (obavezan pattern)

```
ДОКАЗ:        фотокопија уговора о закупу од 12.03.2024. године
              извод из катастра непокретности РГЗ од 15.04.2024. године
              изјава сведока Петра Петровића од 20.05.2024. године
```

- Hanging indent 1" (1440 twips left, hanging 1440)
- "ДОКАЗ:" **bold**, svaki dokaz u **italic**
- Svaki dokaz u zasebnom pasusu (ne u listi sa bullets!)

### Petit (10pt) — kada

- Fusnote
- Reference na sudsku praksu ispod glavnog teksta
- Napomene tipa "видети у прилогу бр. X"

### Separatori sekcija

Linija od **78 donjih crta** u posebnom pasusu:
```
______________________________________________________________________________
```

### Potpis (obavezno)

```
Нови Сад, дана 17.04.2026. године


                                                            адв. Милан Мишић
```

- Datum levo
- Potpis desno
- Samo **адв. Милан Мишић** — osim ako nije eksplicitno rečeno drugačije
- "адв." malim slovom sa tačkom, "Милан Мишић" Title Case, 12pt regular (**ne bold**)

### Imenovanje fajla (obavezno, ključno pravilo iz v2 plugin-a)

**Parnica/izvršenje/upravni/prekršaj/ugovor:**
```
[Moj klijent 1 [, Moj klijent 2]] i [Protivnik 1 [, Protivnik 2]] TIP PODNESKA [kratak opis].docx
```

**Krivica bez privatne protivne strane (kada je JT protivna strana):**
```
[Klijent] TIP PODNESKA [kratak opis].docx
```

**Krivica sa privatnom protivnom stranom (privatni tužilac, oštećeni):**
```
[Klijent] i [Protivnik] TIP PODNESKA.docx
```

**Pravila:**
- **Prezime Ime** (redom!) — "Vukovic Jovan", NE "Jovan Vukovic"
- **Title Case** za imena osoba/firmi
- **UPPERCASE** za TIP PODNESKA (TUZBA, ODGOVOR NA TUZBU, ZALBA, PODNESAK, PRIGOVOR, REVIZIJA, KRIVICNA PRIJAVA, ZZZ, ZAVRSNA REC, USTAVNA ZALBA, PREDLOG ZA IZVRSENJE, PREDSTAVKA ESLJP)
- **Mixed case dozvoljen** u TIP PODNESKA samo za standardne forme: "ZALBA na presudu", "ZALBA na resenje", "ZALBA na prekrsajnu odluku" — "na" malim (to je standardni pattern iz kancelarije)
- **Lowercase** za kratak opis (steta, izgubljena dobit, privremena mera, zloupotreba)
- **Bez dijakritika**: Č/Ć → C, Š → S, Ž → Z, **Đ → DJ** (uppercase DJ, NE "dj")
- **Bez podvlaka** — samo razmaci
- Max 2 klijenta na mojoj strani, odvojeni zapetom: "Prvi klijent, Drugi klijent"
- Max 2 protivnika, odvojeni zapetom
- " i " (razmak+i+razmak) razdvaja našu stranu od protivne strane
- .docx ekstenzija lowercase

**Primeri iz stvarne prakse (iz foldera `/PC_Milan/MISIC MILAN/`):**
- `Kalentic Nikola i Bojic Bojan, Flexopack 1980 TUZBA SA PREDLOGOM SA PRIVREMENOM MEROM.docx`
- `Irmovo AD i Vode Vojvodine TUZBA steta, izgubljena dobit.docx`
- `Lalusic Mladen ZALBA na presudu.docx`
- `Vukovic 2015 i Braca Drinic ODGOVOR NA ZALBU.docx`
- `Kalentic Nikola KRIVICNA PRIJAVA SA PREDLOGOM ZA PRIVREMENU MERU.docx`
- `Nas Market PREKRSAJ pr-8704-23 PISANA ODBRANA.docx`
- `Vukovic 2015 i Dundjer Uniwerk PREDLOG ZA IZVRSENJE izvrsna isprava.docx`
- `Balamanac Dijana, Cavic Marijana i Lazarevic Marko i Slavica UGOVOR O KUPOPRODAJI NEPOKRETNOSTI.docx`
- `Anisic Marija ZALBA na presudu.docx`
- `Agriplast i Argina Plus P.A. PODNESAK.docx`

---

## Integracija sa ostalim skill-ovima

| Skill | Kada | Uloga |
|-------|------|-------|
| `pravna-analiza` | pre ovog | Određuje sadržaj (šta se piše) |
| `krivica` | pre ovog | Tekst krivičnih akata |
| `tuzba-parnica` | pre ovog | Tekst parničnih akata |
| `istrazivanje-prakse` | pre ovog | Inject sudske prakse |
| `stil-pisanja` | **pretposlednji** | Vizuelni filter |
| `verifikator` | **posle ovog** | Proverava finalni izlaz |

---

## Guardrails

- **NIKAD** ne generiši finalni akt bez eksplicitnog zelenog signala ("idi", "generiši", "kreni")
- **NIKAD** ne postavljaj ime fajla izmišljajući stranku — pitaj korisnika ako je nejasno
- **NIKAD** ne stavljaj **Milan Nedeljkov** u blok potpisa (nije potpisnik)
- **Đorđe Nedeljkov** se dodaje isključivo na izričit zahtev korisnika
- **Arhivska pisanja sa Nedeljkov potpisom:** stil = Milanov (sva pisanja iz kancelarije su Milanova, samo potpisana kao kolege iz istog kancelarijskog prostora)
- **NIKAD** ne rešavaj kontradikcije tiho — STANI i pitaj korisnika
- **NIKAD** ne preskačaj `verifikatora` posle ovog skilla

---

## Compliance izveštaj (post-flight — obavezan)

Posle generisanja, ispiši:

```
╔═══════════════════════════════════════════════════════════╗
║ 🎨 COMPLIANCE — STIL-PISANJA v3.0                        ║
╠═══════════════════════════════════════════════════════════╣
║ TIP AKTA: [naziv]                                         ║
║ NAZIV FAJLA: [ime].docx                                   ║
║ HANDOFF PRIMLJEN OD: [pravna-analiza/krivica/tuzba-parnica/direktno]║
║ ŠABLON KORIŠĆEN: [krivica/sabloni/... ili tuzba/sabloni/... ili N/A]║
╠═══════════════════════════════════════════════════════════╣
║ TIPOGRAFIJA:                                              ║
║  TNR 12pt telo: [✅/❌]                                    ║
║  Naslov 18pt razmaknut: [✅/❌]                            ║
║  Dispozicija 16pt centrirana: [✅/❌]                      ║
║  Mini-naslovi izmedu linija (ako primenjivo): [✅/N-A]    ║
║  Margine 1440 twips (2.54 cm): [✅/❌]                     ║
║  Ćirilica primarno: [✅/❌]                                ║
╠═══════════════════════════════════════════════════════════╣
║ TERMINOLOGIJA (iz reference_terminologija.md):            ║
║  Odgovarajuća po tipu postupka: [✅/❌]                    ║
║  Oznaka reda (1, 2, 3. reda): [✅/N-A]                    ║
║  Broj predmeta u formatu: [✅/❌]                          ║
║  Sud tačno imenovan: [✅/❌]                               ║
╠═══════════════════════════════════════════════════════════╣
║ STRUKTURA:                                                ║
║  Zaglavlje sa adresatom: [✅/❌]                           ║
║  Stranke hanging 2160/2160: [✅/❌]                        ║
║  Dokazi hanging 1440/1440: [✅/❌]                         ║
║  A/B/C/D za složeno obrazloženje (ako primenjivo): [✅/N-A]║
║  REZIME pre petita (ako primenjivo): [✅/N-A]             ║
║  Separator (78 underscore) pre predloga: [✅/❌]           ║
║  Troškovnik sa dot leader: [✅/N-A]                        ║
║  Potpis iz matrice (reference_potpis.md §1b): [✅/❌]      ║
╠═══════════════════════════════════════════════════════════╣
║ RETORIKA (iz reference_retorika_jezik.md):                ║
║  Latinski maksimi funkcionalno: [✅/N-A]                  ║
║  Zakonski citati u kurzivu sa ,,...": [✅/N-A]            ║
║  CAPS ispod 15% teksta: [✅/❌]                            ║
║  Sudska praksa sa brojem odluke: [✅/N-A]                 ║
║  Register po tipu akta tačan: [✅/❌]                      ║
╠═══════════════════════════════════════════════════════════╣
║ NAMING PATTERN:                                           ║
║  Klijent prvi: [✅/❌]                                     ║
║  Prezime Ime redosled: [✅/❌]                             ║
║  " i " separator: [✅/❌]                                  ║
║  TIP PODNESKA UPPERCASE: [✅/❌]                           ║
║  Bez dijakritika (Đ→DJ): [✅/❌]                           ║
║  Bez podvlaka: [✅/❌]                                     ║
╠═══════════════════════════════════════════════════════════╣
║ OUTPUT:                                                   ║
║  Markdown blok: [✅/❌]                                    ║
║  HTML blok: [✅/❌]                                        ║
║  Uputstvo korisniku dato: [✅/❌]                          ║
╠═══════════════════════════════════════════════════════════╣
║ PREDAJA VERIFIKATORU: [✅/❌]                              ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Reference files (obavezno pročitaj sve pre generisanja)

| Fajl | Svrha | Status v3 |
|---|---|---|
| `references/reference_vizuelno.md` | Detaljna tipografija sa XML primerima + mini-naslovi + A/B/C/D + citiranje zakona + REZIME + kamate | **AŽURIRAN** |
| `references/reference_naming.md` | Svi scenariji imenovanja sa tabelom i primerima + 30 novih tipova akta | **AŽURIRAN** |
| `references/reference_potpis.md` | Blok potpisa + MATRICA POTPISNIH BLOKOVA + realne tarife 2022-2026 + separatori, troškovnik, adresat, prilozi | **AŽURIRAN** |
| `references/reference_retorika_jezik.md` | Latinski maksimi, prelazi, CAPS pravila, kontrafaktual, retoričko pitanje, citiranje prakse, registri po tipu akta | **NOVO u v3** |
| `references/handoff-protokol.md` | Kako skill prima handoff i predaje verifikatoru | isti |
| `references/checklist_qa.md` | QA checklist 15 tačaka pre isporuke | isti |
| `references/mobile-fallback.md` | Specifikacija output formata (markdown + HTML + instrukcije) | isti |

**VAŽNO:** Claude **takođe konsultuje** `pravna-analiza/references/reference_terminologija.md` pre pisanja — tamo je matrica terminologije stranaka po tipu postupka (TUŽILAC vs IZVRŠNI POVERILAC vs OŠTEĆENI vs PREDLAGAČ), kao i kompletna lista sudova i brojevi predmeta.

**Buduća ekspanzija (planirano za Sesiju 5):** kompozicioni šabloni u `krivica/references/sabloni/*.md` (9 akata) i `tuzba-parnica/references/sabloni/*.md` (10 akata) — svaki šablon pun mock-up akta sa primer-tekstom, primenjenom tipografijom i retorikom, pravnim osnovom, i checklistom. Videti SKILL.md tih skill-ova.
