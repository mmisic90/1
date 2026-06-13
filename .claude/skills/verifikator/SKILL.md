---
name: verifikator
description: >
  Nezavisni verifikacioni sloj — aktiviraj AUTOMATSKI čim se završi analiza u
  kojoj su korišćeni god-skill-deep-reader I/ILI pravna-analiza. NIKAD se ne
  aktivira samostalno — UVEK posle završetka drugog skill-a, pre dostavljanja
  finalnog odgovora korisniku. Ovaj skill ne analizira dokument — on analizira
  TVOJ ODGOVOR i proverava da li je tačan. Aktiviraj i ako korisnik kaže:
  "proveri", "da li si siguran", "verifikuj", "tačno li je ovo", "nešto mi ne
  štima", "proveri ponovo", ili izrazi sumnju u tačnost. Takođe aktiviraj kad
  god Compliance izveštaj pokazuje 🔴P3 tvrdnje ili ⛔ neproverene stavke.
  NE aktivirati za: odgovore bez pravnih/činjeničnih tvrdnji, casual ćaskanje,
  kreativni rad, knjižice, Instagram, debugging.
metadata:
  author: "Milan Mišić, advokat"
  version: "2.1.0"
  depends-on: []
  triggered-by: ["god-skill-deep-reader", "pravna-analiza", "krivica", "tuzba-parnica", "istrazivanje-prakse"]
  category: "verification"
  last-updated: "2026-04-08"
---

# Verifikator — Mehanička nezavisna provera

> **Pismo:** instrukcije ovog skila su latinica (token-ekonomija, vidi `_policy/politika-pisma.md`); izlazni pravni akt je uvek ćirilica — kontroliše `stil-pisanja`.

## ⚠️ NEGATIVE TRIGGERS — NE AKTIVIRAJ ZA:

| Kontekst | Zašto ne |
|---|---|
| Casual ćaskanje bez činjeničnih tvrdnji | Nema šta da verifikuje |
| Kreativni rad (knjižice, postovi, priče) | Kreativno nema „tačno/netačno" |
| Pitanja tipa „šta misliš o H" gde je H subjektivno | Mišljenje nije činjenica |
| Tehnički debugging bez pravnog dokumenta | Nema izvora za DIFF |
| Prevod teksta (bez analitičkog elementa) | Prevod ne citira izvore |
| Korisnik izričito kaže „bez verifikacije" | Poštuj nameru — ali upozori na rizik |

**Ključna razlika:** Verifikator se aktivira **automatski** kao post-proces posle pravnih/analitičkih skill-ova. Ne aktivira se samostalno od korisničkog inputa (osim eksplicitne sumnje).

## 🛑 ANTI-LOOP THRESHOLD (know when to stop)

```
MAKSIMALNO 3 PROLAZA verifikacije po odgovoru.

Prolaz 1: Inicijalna provera + automatske ispravke
Prolaz 2 (samo ako Prolaz 1 našao greške): Ponovna provera posle ispravki
Prolaz 3 (samo ako Prolaz 2 još našao): Finalna provera + ESCALATION

POSLE PROLAZA 3 — BEZ IZUZETAKA:
  → STOP. Ne pokreni Prolaz 4.
  → Saopšti korisniku:
    „⚠️ Dostignut limit verifikacije (3 prolaza).
     Još uvek postoje nerešene stavke: [lista].
     Potrebna je ručna intervencija — otvori nov čat
     i nalepi odgovor + ove stavke."
  → Skill se AKTIVNO POVLAČI. Ne petlja dalje.
```

**Zašto threshold:** Anthropic Skills Guide Pattern 3 (Iterative refinement) izričito zahteva: *„Know when to stop iterating."*

---

## FILOZOFIJA

Problem: Isti AI koji analizira — proverava sebe. To je kao da
sudija proverava sopstvenu presudu. Kognitivna samoprovera
("da li sam u pravu?") NE RADI — isti bias koji je stvorio
grešku sprečava i njenu detekciju.

Rešenje: Ne kognitivna, nego **MEHANIČKA** verifikacija.
Ne "razmisli da li si u pravu" — nego "VRATI SE na tačnu
stranicu, PREPIŠI doslovno šta piše, UPOREDI reč po reč."

Mehanički koraci se ne mogu preskočiti "zato što sam siguran."
Mehanički koraci hvataju greške koje uveren mozak preskače.

---

## KADA SE AKTIVIRA

```
AUTOMATSKI posle:
  ├── god-skill FULL/ADVERSARIAL analize → UVEK
  ├── pravna-analiza F6 (generisan dokument) → UVEK
  ├── Batch režim → za SVAKI dokument
  └── Korisnik pita "da li si siguran?" → UVEK

USLOVNO posle:
  ├── god-skill FOCUSED → samo ako ima 🔴P3 tvrdnji
  ├── pravna-analiza skraćena → samo ako F3.6 rizik > 5/10
  └── Bilo koji odgovor gde se citira zakon/praksa → UVEK
```

---

## TRI PROTOKOLA VERIFIKACIJE

### PROTOKOL A — MEHANIČKA VERIFIKACIJA ČINJENICA

Za SVAKU činjeničnu tvrdnju u odgovoru/dokumentu:

```
KORAK 1: IDENTIFIKUJ — nabraj sve činjenične tvrdnje u odgovoru
  [tvrdnja 1]: „..."
  [tvrdnja 2]: „..."
  ...

KORAK 2: ZA SVAKU TVRDNJU — VRATI SE NA IZVOR + DIFF
  ┌─────────────────────────────────────────────────┐
  │ TVRDNJA: [šta sam napisao]                       │
  │ IZVOR: str. [X] dokumenta                       │
  │ DOSLOVNO NA TOJ STRANICI: „[prepiši doslovno]" │
  │                                                 │
  │ DIFF (reč po reč):                              │
  │  MOJ TEKST:  „Okrivljeni je dana 03.01. udario" │
  │  ORIGINAL:   „Okrivljeni je dana 03.02. udario" │
  │  RAZLIKA:    ^^^^^^^^^ 01 ≠ 02 ← GREŠKA        │
  │                                                 │
  │ POKLAPANJE: [da/ne/delimično]                    │
  │ AKO NE: Šta sam pogrešio? [opis]               │
  │ → ISPRAVI ODMAH ako je greška                   │
  └─────────────────────────────────────────────────┘

  **DIFF JE OBAVEZAN** za: datume, iznose, imena stranaka,
  brojeve predmeta, citate iz obrazloženja suda. Za ove stavke
  UVEK prikazati MOJ TEKST vs ORIGINAL — da korisnik VIDI.

KORAK 3: BROJEVI — TROSTRUKO
  Za SVAKI broj (iznos, datum, član zakona, broj predmeta):
  ┌─────────────────────────────────────────────────┐
  │ BROJ U MOM ODGOVORU: [X]                        │
  │ BROJ NA IZVORU (str. Y): [Z]                   │
  │ X = Z? [da/ne]                                  │
  │ AKO NE: ISPRAVI ODMAH                          │
  └─────────────────────────────────────────────────┘

KORAK 4: USER SPOT-CHECK LISTA (novo)
  Od svih proverenih tvrdnji, izaberi TRI koje su:
  - Najvažnije za ishod predmeta
  - Ili najmanje sigurne (🟡/🔴)
  - Ili sadrže brojeve/datume

  ┌─────────────────────────────────────────────────┐
  │ 👁️ SPOT-CHECK ZA KORISNIKA (2 minuta):         │
  │                                                 │
  │ ① Otvori str. [X], pasus [Y] — proveri da li   │
  │   piše „[kratak citat]". Ako se slaže →         │
  │   ostatak analize je VEROVATNO tačan.            │
  │                                                 │
  │ ② Proveri iznos [X din] na str. [Y].            │
  │   Moj odgovor kaže [Z din].                     │
  │                                                 │
  │ ③ Proveri datum [X] na str. [Y].                │
  │   Moj odgovor kaže [Z].                         │
  │                                                 │
  │ AKO BILO KOJA NE ŠTIMA → reci mi, ponovo       │
  │ ću proveriti CEO odgovor.                       │
  └─────────────────────────────────────────────────┘

  **SVRHA:** Korisnik ne može da proveri 12 tvrdnji.
  Ali MOŽE da proveri 3 stvari za 2 minuta. Ako se
  TOP 3 slažu — poverenje u ostatak raste. Ako se
  bar 1 ne slaže — ALARM za ceo odgovor.
```

**PRAVILO:** Ako ne mogu da se VRATIM na izvor (npr. dokument
nije u kontekstu) — tvrdnja postaje 🟡P2 maksimum. Ne smem
tvrditi ✅P1 ako ne mogu mehanički da proverim.

---

### PROTOKOL B — EKSTERNA VERIFIKACIJA (WEB SEARCH)

Za SVAKI član zakona, sudsku odluku, ili ESLJP presudu u odgovoru:

```
KORAK 1: LISTA — nabraj sve pravne izvore koje citiram
  čl. [X] st. [Y] [Zakon]
  [Odluka suda: broj]
  [ESLJP: naziv]
  ...

KORAK 2: ZA SVAKI — OBAVEZAN WEB SEARCH
  ┌─────────────────────────────────────────────────┐
  │ IZVOR: čl. 239 st. 1 KZ                        │
  │ PRETRAGA: [tačan query koji sam koristio]       │
  │ REZULTAT: [nađeno/nije]                         │
  │ AKO NAĐENO: Da li se SLAŽE sa mojim citatom?   │
  │   [da/ne/delimično]                             │
  │ AKO NIJE NAĐENO: → ⛔ UKLONI IZ ODGOVORA       │
  └─────────────────────────────────────────────────┘

KORAK 2b: PROVERA INTERPRETACIJE (novo)
  Za svaki izvor koji JE nađen, dodatno proveri:
  ┌─────────────────────────────────────────────────┐
  │ ŠTA IZVOR KAŽE: „[doslovno iz search rezultata]"│
  │ KAKO SAM JA PROTUMAČIO: „[moj parafraz]"       │
  │ DA LI MOJ PARAFRAZ TAČNO PRENOSI SMISAO?      │
  │   [da/ne/delimično]                             │
  │ AKO NE: U čemu je razlika? [opis]              │
  │ DA LI SAM IZOSTAVIO BITAN DEO? [da/ne]        │
  │ DA LI SAM DODAO NEŠTO ŠTO NE PIŠE? [da/ne]    │
  └─────────────────────────────────────────────────┘

  **SVRHA:** Hvata situaciju gde pretražim, nađem, ali
  pogrešno protumačim ili selektivno citiram. Npr. član
  kaže „može" a ja napišem „mora" — KRITIČNA razlika.

KORAK 3: SUSEDNI ČLANOVI
  Za svaki član zakona — proveri i susedne:
  □ Da li čl. [X-1] ili čl. [X+1] menja značenje?
  □ Da li postoji STAV koji nisam video?
  □ Da li je član MENJAN od datuma dokumenta?
```

**PRAVILO:** Ako web search NIJE urađen za neki izvor — taj
izvor MORA biti označen ⛔ u compliance izveštaju. Ne smem
pisati ✅PropisSoft ako nisam stvarno pretražio.

---

### PROTOKOL V — LOGIČKA VERIFIKACIJA (STRES TEST ODGOVORA)

Ovo NIJE "razmisli da li si u pravu" — ovo su MEHANIČKI testovi:

```
TEST 1: KONTRADIKCIJA UNUTAR ODGOVORA
  Pročitaj svoj odgovor od kraja ka početku (OBRNUTIM redom).
  Da li poslednja rečenica kontradiktira prvoj?
  Da li zaključak kontradiktira nečemu iz sredine?
  □ Nađena kontradikcija: [da/ne → ako da, GDE]

TEST 2: PETIT ↔ OBRAZLOŽENJE (za pravne dokumente)
  Prepiši PETIT doslovno: „..."
  Prepiši ZAKLJUČAK obrazloženja doslovno: „..."
  Da li se slažu? [da/ne]
  □ Iznos u petitu = iznos u obrazloženju? [proveri svaki]
  □ Članovi u petitu = članovi u obrazloženju? [proveri svaki]

TEST 3: IMENA I BROJEVI KROZ DOKUMENT
  Prepiši ime stranke sa POČETKA: „..."
  Prepiši ime stranke sa KRAJA: „..."
  Isto? [da/ne]
  □ Broj predmeta na početku = broj predmeta u telu? [da/ne]

TEST 4: "ODAKLE MI OVO?"
  Za SVAKU tvrdnju označenu 🟡P2 ili 🔴P3:
  „Ovu tvrdnju sam izveo iz [konkretno šta]."
  Ako ne mogu da objasnim ODAKLE → UKLONI.

TEST 5: NEGATIVNI TEST
  Zamisli da si protivnički advokat koji čita moj podnesak.
  Nađi TRI stvari koje bi napao.
  1. [...]
  2. [...]
  3. [...]
  → Da li su ovih 3 adresirane u mom odgovoru? [da/ne za svaku]
  → Ako NE → DODAJ ili UPOZORI korisnika.
```

---

### PROTOKOL G — HONEYPOT TEST (Zamka za halucinaciju)

Ovo je NAJINOVATIVNIJA zaštita. Princip: namerno se pitam za
detalj koji ZNAM da ne postoji — i proveravam da li "odgovorim."

```
KORAK 1: GENERIŠI 2 HONEYPOT PITANJA
  Pitanje mora biti o dokumentu koji sam analizirao, ALI
  o detalju koji SIGURNO NE POSTOJI.

  Primeri:
  - „Šta piše u fusnoti na str. 18?" (ako dokument NEMA fusnote)
  - „Koliki je iznos iz tabele 3?" (ako dokument NEMA tabelu 3)
  - „Šta je svedok Rakić izjavio?" (ako NEMA svedoka Rakić)

KORAK 2: ODGOVORI NA HONEYPOT — ISKRENO
  ┌─────────────────────────────────────────────────┐
  │ HONEYPOT 1: „Šta piše u fusnoti na str. 18?"  │
  │ MOJ ODGOVOR: [šta god odgovorim]                │
  │ STVARNOST: Dokument NEMA fusnote.               │
  │                                                 │
  │ REZULTAT:                                       │
  │  „Ne znam / nema fusnote" → ✅ PROŠAO           │
  │  „U fusnoti piše..." → 🔴 HALUCINIRAM           │
  └─────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────┐
  │ HONEYPOT 2: „Koliki je iznos iz tabele 3?"      │
  │ MOJ ODGOVOR: [šta god odgovorim]                │
  │ STVARNOST: Dokument NEMA tabelu 3.              │
  │                                                 │
  │ REZULTAT:                                       │
  │  „Ne postoji tabela 3" → ✅ PROŠAO               │
  │  „Iznos je 150.000 din" → 🔴 HALUCINIRAM        │
  └─────────────────────────────────────────────────┘

KORAK 3: AKO PADNE HONEYPOT
  → 🔴🔴🔴 KRITIČAN ALARM
  → Ako sam „odgovorio" na nepostojeći detalj =
    DOKAZ da haluciniram u ovoj sesiji
  → OBAVEZNO SAOPŠTITI KORISNIKU:
    „⚠️ Honeypot test pokazao sklonost ka halucinaciji.
    Preporučujem NEZAVISNU PROVERU celog odgovora
    u novom čatu."
  → Sve ✅P1 u odgovoru → degradiraj na 🟡P2
  → Pouzdanost celog odgovora: NISKA
```

**ZAŠTO OVO RADI:** Ako model halucinira, on to radi
SISTEMSKI — ne za jednu tvrdnju, nego za celu sesiju.
Honeypot hvata sistemsku sklonost. Ako prolazi honeypot
= odgovor je VEROVATNO tačan. Ako pada = SVE je sumnjivo.

---

### PROTOKOL D — CROSS-SKILL KONZISTENTNOST

Kada su god-skill I pravna-analiza OBA aktivna, proveri
da li se SLAŽU:

```
KORAK 1: IZVUCI KLJUČNE OCENE IZ OBA SKILL-A

  GOD-SKILL:
    Bajesovska ocena (4Z): [X%]
    Stres test (S5): [N]/[N] preživelo
    Kontrafaktualna krhkost (5Đ): [visoka/srednja/niska]

  PRAVNA-ANALIZA:
    Matrica otpornosti (F4.E): [N]/[N] preživelo
    Rizik (F3.6): [W/10]
    „Jedna stvar" (F5): [argument X]
    Graf zavisnosti: [N] nezavisnih od [N]

KORAK 2: PROVERA KONZISTENTNOSTI
  ┌─────────────────────────────────────────────────┐
  │ TEST 1: Bajesovska ocena ↔ Matrica otpornosti │
  │  4Z kaže [X%], F4.E kaže [N/N] preživelo      │
  │  Konzistentno? [da/ne]                          │
  │  Ako 4Z>75% ali F4.E<50% preživelo → 🔴        │
  │  KONTRADIKCIJA — jedna ocena MORA biti pogrešna│
  │                                                 │
  │ TEST 2: „Jedna stvar" ↔ Graf zavisnosti       │
  │  „Jedna stvar" je argument #[X]                 │
  │  U grafu: nezavisan ili zavisan?                │
  │  Ako ZAVISAN → 🟡 RIZIK (ako padne, nema „jednu │
  │  stvar" — a to je naš najjači argument)         │
  │                                                 │
  │ TEST 3: Kontrafaktualna ↔ Stres test           │
  │  5Đ kaže krhkost [X], S5 kaže [N/N] preživelo  │
  │  Ako 5Đ kaže „niska krhkost" ali S5 kaže       │
  │  samo 1/5 preživelo → 🔴 KONTRADIKCIJA          │
  │                                                 │
  │ TEST 4: Rizik (F3.6) ↔ Bajesovska (4Z)        │
  │  F3.6 kaže [W/10], 4Z kaže [X%]                │
  │  Ako F3.6=8/10 (nizak rizik) a 4Z=40% → 🔴     │
  │  Ako F3.6=3/10 (visok rizik) a 4Z=85% → 🔴     │
  │                                                 │
  │ TEST 5: IP nalaz ↔ PA F4 matrica otpornosti    │
  │  IP kaže „ustaljena praksa ✅P1" a F4.E kaže    │
  │  argument pada ❌ kod sudije → 🔴                │
  │  Moguće: praksa postoji ali činjenice se razlikuju│
  │                                                 │
  │ TEST 6: IP adverse findings ↔ dokument          │
  │  IP pronašao adverse findings a dokument ih      │
  │  NE ADRESIRA → 🔴 PROPUST                      │
  │  Protivnik ĆE ih naći — bolje mi prvo            │
  │                                                 │
  │ TEST 7: IP klasifikacija ↔ god-skill FORK       │
  │  IP kaže „✅P1 ratio podržava" a 4D FORK        │
  │  grana B pokazuje jak kontraargument → 🟡        │
  │  Moguće: ratio uslovljen (poison pill) ili       │
  │  distinguishing faktor koji IP nije detektovao   │
  └─────────────────────────────────────────────────┘

KORAK 3: AKO NAĐENA KONTRADIKCIJA
  → STANI. Ne dostavljaj odgovor.
  → Identifikuj: KOJI skill je verovatno pogrešio?
  → Vrati se na konkretan sloj/fazu i proveri PONOVO
  → Ako ne možeš da razrešiš → saopšti korisniku:
    „Dva skill-a daju kontradiktorne ocene:
    god-skill kaže [X], pravna-analiza kaže [Y].
    Razlog: [pokušaj objašnjenja]. Preporučujem: [akcija]."
```

**ZAŠTO OVO RADI:** God-skill i pravna-analiza imaju
RAZLIČITE metodologije. Ako obe daju ISTI zaključak =
visoka pouzdanost. Ako se NE SLAŽU = nešto nije u redu.
Ovo je najbliže NEZAVISNOJ verifikaciji — dva sistema
sa različitim pristupom proveravaju istu stvar.

---

## VERIFIKACIONI NALAZ

Posle svih protokola (A + B + V + G + D), generiši NALAZ:

```
╔═══════════════════════════════════════════════════════════════╗
║ 🔎 VERIFIKACIONI NALAZ                                       ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║ PROTOKOL A (Činjenice):                                       ║
║  Provereno tvrdnji: [N]                                       ║
║  Poklapanje: [N] ✅ │ Delimično: [N] 🟡 │ Greška: [N] 🔴    ║
║  Brojevi provereni: [N] od [N] — grešaka: [N]               ║
║                                                               ║
║ PROTOKOL B (Eksterno):                                       ║
║  Pravnih izvora u odgovoru: [N]                              ║
║  Web search urađen za: [N] od [N]                            ║
║  Potvrđeno: [N] ✅ │ Nije nađeno: [N] ⛔ │ Netačno: [N] 🔴 ║
║  ⛔ NISAM PRETRAŽIO: [lista, ako ima]                       ║
║                                                               ║
║ PROTOKOL V (Logika):                                         ║
║  Kontradikcija u odgovoru: [da/ne]                           ║
║  Petit ↔ obrazloženje: [slaže se/ne]                         ║
║  Imena konzistentna: [da/ne]                                 ║
║  "Odakle mi ovo" — uklonjeno tvrdnji: [N]                    ║
║  Negativni test — neadresiranih slabosti: [N]               ║
║                                                               ║
║ PROTOKOL G (Honeypot):                                       ║
║  Honeypot 1: [pitanje] → [odgovor] → [✅ prošao / 🔴 pao]   ║
║  Honeypot 2: [pitanje] → [odgovor] → [✅ prošao / 🔴 pao]   ║
║  SKLONOST KA HALUCINACIJI: [ne / ⚠️ DETEKTOVANA]            ║
║                                                               ║
║ PROTOKOL D (Cross-skill):                                    ║
║  4Z ↔ F4.E: [konzistentno / 🔴 kontradikcija]              ║
║  „Jedna stvar" ↔ graf: [nezavisna / 🟡 zavisna]            ║
║  5Đ ↔ S5: [konzistentno / 🔴 kontradikcija]                ║
║  F3.6 ↔ 4Z: [konzistentno / 🔴 kontradikcija]              ║
║  IP ✅P1 ↔ F4.E: [konzistentno / 🔴 kontradikcija]         ║
║  IP adverse ↔ dokument: [adresirane / 🔴 propust]          ║
║  IP ratio ↔ 4D FORK: [konzistentno / 🟡 proveri]           ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║ UKUPNA OCENA VERIFIKACIJE:                                   ║
║                                                               ║
║  🟢 ČISTO — 0 grešaka, sve verifikovano                      ║
║  🟡 USLOVNO — manje neusaglašenosti, ispravljeno              ║
║  🔴 PROBLEM — nađene greške, SAOPŠTITI korisniku:           ║
║     [lista grešaka]                                          ║
║                                                               ║
║ ISPRAVKE IZVRŠENE PRE DOSTAVLJANJA:                           ║
║  1. [šta ispravljeno]                                         ║
║  2. [šta ispravljeno]                                         ║
║                                                               ║
║ ⚠️ PREPORUKA ZA KORISNIKA:                                  ║
║  □ Proveri str. [X] — nisam 100% siguran u [tvrdnju]        ║
║  □ [druga preporuka ako ima]                                 ║
║                                                               ║
║ 👁️ SPOT-CHECK (proveri za 2 minuta):                        ║
║  ① str. [X]: [šta da proveri]                                ║
║  ② str. [Y]: [šta da proveri]                                ║
║  ③ str. [Z]: [šta da proveri]                                ║
║  → Ako se slaže = poverenje u ostatak. Ako NE = alarm.       ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## KADA PREPORUČITI NEZAVISNU PROVERU (NOV ČAT)

Verifikator MORA preporučiti korisniku da otvori NOV ČAT i
proveri odgovor ako:

1. **Protokol A našao 2+ greške** → „Preporučujem da ovaj odgovor
   proverite u novom čatu — nalepite odgovor i recite
   'Proveri tačnost ovoga, nađi greške.'"

2. **Protokol B našao ⛔ za ključni izvor** → „Nisam uspeo da
   verifikujem [izvor]. Preporučujem ručnu proveru na PropisSoft."

3. **Protokol V našao kontradikciju** → „Postoji neusaglašenost
   u mom odgovoru. Preporučujem nov čat za nezavisnu proveru."

4. **F3.6 rizik > 7/10 I dokument ide na sud** → „Ovo je
   visokorizičan dokument. Preporučujem kolegijalnu proveru
   (nov čat ili kolega advokat)."

5. **Bajesovska ocena oscilirala >20%** → „Predmet je
   ambivalentan. Preporučujem dodatno mišljenje."

6. **Honeypot test PAO** → „⚠️ KRITIČNO: Detektovana sklonost
   ka halucinaciji u ovoj sesiji. OBAVEZNA nezavisna provera
   celog odgovora u novom čatu. Sve ✅P1 degradirane na 🟡P2."

7. **Cross-skill kontradikcija (Protokol D) nerešena** →
   „Dva analitička sistema daju kontradiktorne ocene.
   Preporučujem nov čat: nalepite odgovor + oba compliance
   izveštaja i recite 'Nađi grešku.'"

---

## INTEGRACIJA SA GOD-SKILL I PRAVNA-ANALIZA

```
REDOSLED IZVRŠENJA:
══════════════════════════════════════════

1. pravna-analiza F0-F6 → generiše odgovor/dokument
2. istraživanje-prakse → pretraga prakse (pozvana iz F3)
3. god-skill Slojevi 1-8 → dopunjuje analizu
4. >>> VERIFIKATOR SE AKTIVIRA <<<
5. Protokol A → proverava činjenice + DIFF + brojeve
6. Protokol A.4 → generiše USER SPOT-CHECK listu
7. Protokol B → web search + PROVERA INTERPRETACIJE
8. Protokol V → logički stres test odgovora
9. Protokol G → HONEYPOT test (zamka za halucinaciju)
10. Protokol D → CROSS-SKILL konzistentnost (PA + GS + IP)
11. Ispravke ako potrebno
12. PA Compliance izveštaj → prikazati
13. IP Compliance izveštaj → prikazati (ako aktiviran)
14. GS Compliance izveštaj → prikazati
15. Verifikacioni nalaz → prikazati
16. TEK SADA → dostavi odgovor korisniku
```

**Verifikator NIKAD ne menja suštinu analize.** On menja samo:
- Pogrešne brojeve/datume/imena (mehaničke greške)
- Uklanja neverifikovane tvrdnje (⛔)
- Označava nesigurne tvrdnje (🟡/🔴)
- Dodaje upozorenja korisniku

Ako verifikator nađe SUŠTINSKU grešku (npr. pogrešna kvalifikacija
dela, pogrešan član zakona) → NE ISPRAVLJA SAM. Saopštava korisniku:
"⚠️ Verifikator našao mogući problem: [opis]. Preporučujem proveru."

---

## ZABRANJENO

1. Preskakanje verifikatora — NIKADA. Ako su god-skill ili pravna-analiza
   aktivirani, verifikator MORA da se pokrene.
2. Lažiranje verifikacije — pisati "provereno" a ne proveriti = NAJGORA
   moguća povreda. Bolje reći "nisam proverio" nego lagati da jesam.
3. Ispravljanje bez obaveštavanja — ako ispraviš grešku, MORAŠ navesti
   u nalazu šta si ispravio. Tiho ispravljanje = skrivanje greške.
4. Preskakanje Protokola B — ako odgovor citira BILO KOJI član zakona
   ili sudsku odluku, web search je OBAVEZAN. Bez izuzetka.
5. Falsifikovanje Honeypot testa — ako ZNAŠ da detalj ne postoji i
   svejedno "odgovoriš" uvereno → ovo je SVESNA PREVARA. Honeypot se
   odgovara ISKRENO — cilj je da uhvati NESVESNU halucinaciju.
6. Ignorisanje Cross-skill kontradikcije — ako Protokol D nađe
   kontradikciju, NE SMEŠ nastaviti bez razrešenja ili obaveštavanja
   korisnika. Kontradikcija = NEŠTO NIJE TAČNO.
7. Preskakanje SPOT-CHECK liste — korisnik MORA dobiti 3 stvari
   za brzu proveru. Ovo je njegovo najjače oružje — ne oduzimaj mu ga.

---

## ⛔ ZAVRŠNA INSTRUKCIJA

**VERIFIKACIONI NALAZ SE PRIKAZUJE UVEK.**
**VERIFIKATOR JE POSLEDNJA LINIJA ODBRANE OD GREŠKE.**
**AKO NE PRIKAŽEŠ NALAZ — ODGOVOR NIJE VERIFIKOVAN.**
