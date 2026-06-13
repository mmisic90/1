---
name: tuzba-parnica
version: 2.0
description: >
  Parničnoprocesni akti — tužbe, protivtužbe, odgovori na tužbu, prigovori na platni
  nalog, žalbe na presudu/rešenje u parnici, predlozi za privremenu meru, revizija,
  predlozi za ponavljanje postupka, ustavne žalbe u parničnoj materiji. Trigeri: tužba,
  tužbeni zahtev, parnični postupak, tužilac, tuženi, predlažem sudu, PRESUDU,
  inicijalni akt u parnici, protivtužba, odgovor na tužbu, prigovor na platni nalog,
  revizija, žalba na presudu parnica, tuzba za naknadu štete, tuzba za utvrdjenje,
  tuzba za proboj pravne ličnosti, tuzba za razvod, tuzba za ispunjenje ugovora,
  privremena mera parnica. Generiše .docx u stilu adv. Milana Mišića, sa perspektive
  TUŽIOCA ili TUŽENOG zavisno od akta. Lanac: pravna-analiza → ovaj skill → stil-pisanja → verifikator (istrazivanje-prakse se poziva kao servis u Koraku 3). NE aktivirati za: krivične postupke,
  izvršni postupak, prekršajne postupke, upravne sporove, knjižice, Instagram,
  tehnički debugging.
metadata:
  author: "Milan Mišić, advokat"
  version: "2.0.0"
  depends-on: ["pravna-analiza"]
  composes-with: ["istrazivanje-prakse", "verifikator"]
  category: "legal-civil"
  last-updated: "2026-04-08"
---

# Parnični postupak — Skill v2

> **Pismo:** instrukcije ovog skila su latinica (token-ekonomija, vidi `_policy/politika-pisma.md`); izlazni pravni akt je uvek ćirilica — kontroliše `stil-pisanja`.

## ⚠️ NEGATIVE TRIGGERS — NE AKTIVIRAJ ZA:

| Kontekst | Pravilan skill |
|---|---|
| Krivični postupak (žalba, optužnica, ZZZ, krivična prijava) | `krivica` |
| Izvršni postupak (predlog za izvršenje, protivizvršenje, blokada računa, opomena pred izvršenje) | `izvrsenje` |
| Privremena mera **bez parnične tužbe** (samostalno obezbeđenje u izvršnom postupku) | `izvrsenje` |
| Prekršajni postupak | `pravna-analiza` (ZOP, ne ZPP) |
| Upravni spor pred Upravnim sudom | `pravna-analiza` (ZUS, ne ZPP) |
| Ustavna žalba bez parnične podloge | `pravna-analiza` |
| Predstavka ESLJP bez parnične podloge | `pravna-analiza` |
| Knjižice za Relju, Instagram, Cowork debugging, kreativni rad | NIJEDAN pravni skill |

**Kompozabilnost:** Skill se aktivira **posle** `pravna-analiza` (prima handoff), poziva `istrazivanje-prakse` za sudsku praksu i iznose, i predaje finalni dokument `verifikator`-u pre isporuke. NIKADA ne aktivira samostalno ako postoji dokument za analizu.

---

## Svrha

Automatski izrađuje potpune i sudu podnošene akte u parničnom postupku, u stilu i retoričkom maniru advokatske kancelarije Milana Mišića, prema Zakonu o parničnom postupku (ZPP), Zakonu o obligacionim odnosima (ZOO), Zakonu o privrednim društvima (ZPD) i ostalim materijalnim propisima, sa integracijom verifikovane sudske prakse.

**OSNOVNO PRAVILO:** Akt se piše sa perspektive STRANKE koju Milan zastupa.

---

## MESTO U STACK-U

```
                    ┌───────────────────────────┐
                    │  god-skill-deep-reader    │ (uvek u pozadini)
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      pravna-analiza       │ F0–F5 → handoff
                    └─────────────┬─────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  │                               │
      ┌───────────▼───────────┐       ┌──────────▼──────────┐
      │  istrazivanje-prakse  │◄──────┤   TUZBA-PARNICA     │
      │     v6 (delegat)      │       │       v2            │
      └───────────┬───────────┘       └──────────┬──────────┘
                  │                              │
                  └──────────────┬───────────────┘
                                 │
                     ┌───────────▼───────────┐
                     │      verifikator       │
                     └───────────┬───────────┘
                                 │
                                 ▼
                          KORISNIK (Milan)
```

**Pravila integracije:**
1. Tuzba-parnica se **NIKADA ne aktivira samostalno** ako postoji dokument za analizu — prvo se čeka handoff od `pravna-analiza`.
2. Pretraga prakse se **AGRESIVNO delegira** u `istrazivanje-prakse`. Ako taj skill nije aktivan — `tuzba-parnica` **STAJE** i javlja korisniku.
3. Pre dostavljanja korisniku, dokument **OBAVEZNO** prolazi kroz `verifikator`.
4. `tuzba-parnica` šalje sopstveni mini compliance izveštaj ISPOD izveštaja od `pravna-analiza`.

---

## Korak 0 — Prijem handoff-a od `pravna-analiza`

### 0.1 Provera handoff paketa

`pravna-analiza` F6.1 mora da isporuči YAML paket sa 7 obaveznih elemenata: teorija_slucaja, cinjenicna_mapa, argumenti, adversarial, jedna_stvar, praksa, strateska_procena + predmet.perspektiva = "tuzilac"/"tuzeni"/"predlagac".

### 0.2 Šta raditi ako handoff NE postoji

Ako korisnik direktno kaže „napiši tužbu za X":
- **Jednostavan zadatak (STANDARD):** šablonska tužba + upozorenje o nedostatku adversarial provere
- **Složen zadatak:** STOP → preporuči `pravna-analiza` prvo, čekaj potvrdu

### 0.3 Šta raditi ako handoff je NEPOTPUN

Validaciona pravila (isto kao krivica v2):
1. Svi 7 elemenata prisutni
2. `jedna_stvar.argument` ne prazan
3. `praksa` sa min. 1 verifikovanom odlukom
4. Nijedan ⛔P4 u `cinjenicna_mapa`
5. `rizik_1_10` je broj

**Fali nešto → STOP, javi tačno šta.**

---

## Korak 0.1 — Klasifikacija akta

Iz `predmet.perspektiva` + konteksta:

| Perspektiva | Kontekst | Tip akta |
|---|---|---|
| tuzilac | nov predmet | Tužba (4.1) |
| tuzeni | primio tužbu | Odgovor na tužbu (4.2) |
| tuzeni | protivtužbeni osnov | Protivtužba (4.3) |
| tuzeni | primio platni nalog | Prigovor na platni nalog (4.4) |
| predlagac | hitno, pre presude | Predlog za privremenu meru (4.5) |
| tuzilac/tuzeni | nepovoljna presuda | Žalba na presudu (4.6) |
| tuzilac/tuzeni | pravnosnažna + VSP ≥ 40k EUR | Revizija (4.7) |
| tuzilac/tuzeni | nove okolnosti | Predlog za ponavljanje (4.8) |

### Tipovi parničnih akata (12 u v2)

| # | Tip | Pravni osnov | Rok |
|---|---|---|---|
| 1 | Tužba | čl. 98 ZPP | — |
| 2 | Odgovor na tužbu | čl. 297 ZPP | 30 dana |
| 3 | Protivtužba | čl. 191 ZPP | uz odgovor |
| 4 | Prigovor na platni nalog | čl. 459 ZPP | 8 dana |
| 5 | Predlog za privremenu meru | čl. 382 ZIO | hitno |
| 6 | Žalba na presudu | čl. 367 ZPP | 15 dana (8 u skraćenom) |
| 7 | Žalba na rešenje | čl. 400 ZPP | 8 dana |
| 8 | Revizija | čl. 403 ZPP | 30 dana |
| 9 | Predlog za ponavljanje postupka | čl. 426 ZPP | 30 dana / 5 godina |
| 10 | Zahtev za zaštitu zakonitosti | čl. 417 ZPP | — |
| 11 | Ustavna žalba u parnici | čl. 170 Ustava | 30 dana |
| 12 | Predstavka ESLJP | čl. 34 EKLJP | 4 meseca |

---

## Korak 1 — Prikupljanje inputa (fallback)

### 1.1 Osnovni podaci

Stranke (fizičko lice: ime, JMBG, adresa; pravno: poslovno ime tačno po APR, sedište, MB, PIB, zakonski zastupnik). Sud (naziv + broj predmeta). Advokat: Milan Mišić, Novi Sad, Maksima Gorkog 6 (default).

### 1.2 Tabela rokova

Kompletna u `references/rokovi-parnica.md`. Skraćeno:

| Akt | Rok | Početak |
|---|---|---|
| Odgovor na tužbu | 30 dana (15 za malu vrednost) | prijem tužbe |
| Prigovor na platni nalog | 8 dana | prijem naloga |
| Žalba na presudu | 15 dana (8 skraćeni/mala) | prijem presude |
| Žalba na rešenje | 8 dana (3 hitno) | prijem rešenja |
| Revizija | 30 dana | pravnosnažnost |
| Ponavljanje postupka | 30 dana / 5 god | saznanje / pravnosnažnost |
| Ustavna žalba | 30 dana | pravnosnažnost |
| ESLJP | 4 meseca (Prot. 15) | pravnosnažnost |

### 1.3 Rok-alarm protokol

- < 3 dana → 🚨 KRITIČNO
- 3-7 dana → ⚠️ HITNO
- 8-15 dana → 🟡 PRATITI
- > 15 dana → 🟢 UREDNO

Rezerva 2-3 dana minimum — nikad poslednji dan.

### 1.4 Specifični podaci po tipu

**Tužba:** predmet, VSP (obavezno), činjenice (hronološki), dokazi, tužbeni zahtev.
**Odgovor na tužbu:** primerak tužbe + datum prijema, stav (poricanje/priznanje/kompenzacija), procesni prigovori.
**Žalba:** pobijana presuda, osnovi (čl. 374 ZPP), predlog (preinačenje/ukidanje).
**Revizija:** prvostepena + drugostepena, vrednost pobijanog dela (≥ 40k EUR), ograničeni revizioni razlozi.

---

## Korak 2 — Reverse-engineering presude (za žalbe, reviziju, ponavljanje)

### 2.1 Trostruko čitanje

- **Čitanje 1 — „Šta sud kaže?"**: činjenično stanje, kvalifikacija, obrazloženje, dispozitiv.
- **Čitanje 2 — „Gde su greške?"**: čl. 374 st. 2 tač. 1-12 ZPP (bitne procesne), pogrešno činjenično, pogrešno materijalno, troškovi.
- **Čitanje 3 — „Šta mogu da osporim?"**: najjači osnov, protivrečnosti, neadresirani argumenti, praksa VS.

### 2.2 Matrica „greška → osnov žalbe"

Kompletna u `references/tipovi-greshaka-presude-parnica.md`. Skraćeno:

| Greška | Osnov (ZPP) | Dokaz |
|---|---|---|
| Sud nije obrazložio odbijanje dokaza | 374/2 t. 12 | čl. 359 st. 1 |
| Presuda van tužbenog zahteva | 374/2 t. 9 | petit vs. dispozitiv |
| Pogrešan član ZOO | 374/1 mat. | praksa VS |
| Protivrečna presuda | 374/2 t. 11 | citat kontradikcije |

### 2.3 „Jedna stvar" provera

Redosled: procesna povreda → materijalnopravna → činjenična (poslednje, teška u parnici).

---

## Korak 3 — Pretraga sudske prakse (DELEGACIJA u `istrazivanje-prakse`)

### 3.1 Protokol delegacije

Nikad samostala. Uvek:
```
INSTRUKCIJA ZA istrazivanje-prakse:
  Tip postupka: parnicni
  Pravno pitanje: [konkretan problem]
  Član zakona: čl. [X] ZPP / čl. [Y] ZOO / čl. [Z] ZPD
  Hierarchy: VS Rev → Apelacioni Gž → niže sudove
  ESLJP: čl. 6 EKLJP (sudjenje), čl. 1 Prot. 1 (imovina)
  Kontra-pretraga: DA
  Fallback: K1 → K2 → K3
```

### 3.2 Ključne reči (po tipu akta)

| Tip | Ključne reči |
|---|---|
| Naplata | „ispunjenje obaveze", „dospelost", „zakonska zatezna kamata" |
| Šteta | „naknada štete", „umanjenje životne aktivnosti", „duševni bolovi" |
| Utvrđenje | „pravni interes", „deklaratorna tužba" |
| Poništaj | „mana volje", „prevara", „ništavost", „rušljivost" |
| Proboj | „proboj pravne ličnosti", „čl. 18 ZPD" |
| Odgovor | „prigovor zastarelosti", „kompenzacija", „pasivna legitimacija" |
| Žalba | „bitna povreda", „pogrešno materijalno pravo" |
| Revizija | „revizijski razlog", „VSP prag revizije" |

### 3.3 Šta se radi sa rezultatom

`istrazivanje-prakse` vraća: ✅P1 VS odluke (ugradnja), 🟡P2 sentence (parafraz principa), ESLJP (samo ako čl. 6 EKLJP ili čl. 1 Prot. 1 diraju predmet).

### 3.4 Protokol ugradnje ESLJP prakse

- **Uslov:** direktno dira čl. 6 EKLJP ili čl. 1 Prot. 1 + verifikovan link/tekst
- **Format:** „ESLJP u predmetu [naziv] protiv [drzava], predstavka br. [X], presuda od [datum], stao na stanovište da [parafraza ratio-a] (par. [Y])."
- **Mesto:** u obrazloženju, posle domaće prakse — nikad u petitu, nikad kao jedini oslonac
- **Paragraf reference:** obavezna ako je pun tekst dostupan

---

## Korak 4 — Struktura dokumenta po tipu akta

### 4.1 TUŽBA (čl. 98 ZPP)

**Obavezni elementi (čl. 192):** naziv suda, podaci o strankama (po JMBG/MB/PIB), tužbeni zahtev, činjenice, dokazi, VSP, advokat + potpis + datum.

**Standardne formulacije petita:**
- Novčana: „OBAVEZUJE SE tuženi da tužiocu isplati iznos od _____ dinara sa zakonskom zateznom kamatom počev od _____ do konačne isplate, u roku od 15 dana od pravnosnažnosti presude, pod pretnjom prinudnog izvršenja."
- Činjenje: „OBAVEZUJE SE tuženi da _____ u roku od 15 dana..."
- Utvrđenje: „UTVRĐUJE SE da je _____"
- Poništaj: „PONIŠTAVA SE ugovor _____ zaključen između _____ i _____."

### 4.2 ODGOVOR NA TUŽBU (čl. 297 ZPP)

**Obavezni elementi:** oznaka, odnos prema tužbi (poricanje/delimično priznanje/priznanje u celini), činjenične tvrdnje, dokazi, procesni prigovori (zastarelost, pasivna legitimacija, kompenzacija, nenadležnost), advokat + potpis.

**Šablon:**
```
Tuženi, putem svog punomoćnika adv. Milana Mišića,
odgovara na tužbu tužioca i to:

I.  PORIČEMO tužbu u celini.

II. ISTIČEMO sledeće prigovore:
    1. Prigovor zastarelosti (čl. 371 ZOO) — ...
    2. Prigovor pasivne legitimacije — ...
```

### 4.3 PROTIVTUŽBA (čl. 191 ZPP)

Uslovi: veza sa glavnom tužbom + ne prelazi stvarnu nadležnost. Struktura: kao tužba, samo obrnuti strani.

### 4.4 PRIGOVOR NA PLATNI NALOG (čl. 459 ZPP)

**Rok: 8 dana — KRITIČNO.** Elementi: označenje naloga, razlozi (čl. 459 st. 2), dokazi, eventualno protivtužba.

### 4.5 PREDLOG ZA PRIVREMENU MERU (čl. 382 ZIO)

**Hitno.** Elementi: verovatnost potraživanja, opasnost (onemogućavanje/otežavanje), predlog mere (zabrana otuđenja, zabeležba, izuzimanje), jemstvo (ako sud traži).

### 4.6 ŽALBA NA PRESUDU (čl. 367 ZPP)

**Rok: 15 dana (8 u skraćenom/maloj).** Elementi: označenje presude, osnovi (čl. 374 st. 1 i 2), predlog drugostepenom (preinačenje/ukidanje).

„Jedna stvar" PRVA. Šablon:
```
ŽALBA PROTIV PRESUDE [Sud] P br. _____ od __.__.____. godine

Pobijam navedenu presudu u celosti / delu _____, iz sledećih razloga:

I. BITNA POVREDA ODREDABA PARNIČNOG POSTUPKA
   (čl. 374 st. 2 tač. __ ZPP)
   ...
```

### 4.7 ŽALBA NA REŠENJE (čl. 400 ZPP)

**Rok: 8 dana** (3 dana hitno). Elementi isti kao žalba na presudu.

### 4.8 REVIZIJA (čl. 403 ZPP)

**Rok: 30 dana od pravnosnažne.** Uslov: VSP ≥ 40k EUR ili pravno pitanje od opšteg značaja. **Ograničeni razlozi: bitne procesne + materijalnopravne. NEMA provere činjeničnog stanja.**

### 4.9 PREDLOG ZA PONAVLJANJE (čl. 426 ZPP)

**Rokovi: 30 dana subjektivno / 5 godina objektivno.** Osnovi: nove činjenice/dokazi, presuda na lažnom iskazu, strani sud/isprava sumnjiva.

### 4.10 ZZZ (čl. 417 ZPP)

Vanredni. Podnosi **JAVNI TUŽILAC** — stranka samo inicira.

### 4.11 USTAVNA ŽALBA (čl. 170 Ustava)

**Rok: 30 dana.** Uslov: iscrpljena redovna pravna sredstva (žalba, revizija).

### 4.12 PREDSTAVKA ESLJP (čl. 34 EKLJP)

**Rok: 4 meseca** (Prot. 15, 2022). Uslovi: iscrpljena efektivna sredstva (uklj. ustavna žalba), povreda konvencijskog prava, žrtva (ne actio popularis).

---

## Korak 5 — Petit i tužbeni zahtev

### 5.1 Pravila formulacije petita — Novčana obaveza

1. Iznos (numerički, u dinarima)
2. Kamata (ZZK po ZOO)
3. Početak kamate (dan dospelosti)
4. Rok (15 dana od pravnosnažnosti)
5. Klauzula prinude („pod pretnjom prinudnog izvršenja")
6. Troškovi (poseban stav)

Primer:
```
I.  OBAVEZUJE SE tuženi _____ da tužiocu _____ isplati iznos
    od 250.000,00 dinara (dvesto pedeset hiljada dinara) sa
    zakonskom zateznom kamatom počev od 15.03.2024. godine pa
    do konačne isplate, u roku od 15 dana od pravnosnažnosti
    presude, pod pretnjom prinudnog izvršenja.

II. OBAVEZUJE SE tuženi da tužiocu naknadi troškove ovog
    parničnog postupka u iznosu od _____ dinara, u istom roku
    i pod istom pretnjom.
```

### 5.2 Petit za činjenje/nečinjenje / utvrđenje / poništaj

- Činjenje: „OBAVEZUJE SE tuženi _____ da [konkretna radnja] u roku od 15 dana..."
- Utvrđenje: „UTVRĐUJE SE da je _____ [činjenica ili pravno stanje]."
- Poništaj: „PONIŠTAVA SE ugovor o [vrsta] br. _____ zaključen dana __.__.____. između _____ i _____."

---

## Korak 6 — Troškovnik po Advokatskoj tarifi

### 6.1 Obavezna pretraga

Pre finalizacije:
```
WebSearch: "advokatska tarifa tarifni broj 13 vrednost poena [tekuća godina]"
```
Vrednost poena se menja — nikad iz memorije.

### 6.2 Relevantni tarifni brojevi

| Tar. br. | Akt | Napomena |
|---|---|---|
| 13 | Sastav tužbe | Procenjivo — po VSP tabeli |
| 13 | Odgovor na tužbu | 75% od tužbe |
| 14 | Žalba | 125% od tužbe |
| 15 | Revizija | 200% od tužbe |
| 1 | Podrška na ročištu | Po ročištu |
| 2 | Glavna rasprava | Po ročištu, duže → uvećano |
| 4 | Prigovor na platni nalog | 50% od tar. 13 |

### 6.3 Formula troškovnika

```
Troškovnik:
1. Sastav ove Tužbe (Tar. br. 13 AT).............._____,00 din.
2. Taksa na tužbu................................ po odluci suda
3. Taksa na presudu.............................. po odluci suda
4. Punomoć.......................................    150,00 din.
5. PDV na advokatske troškove (20%)..............._____,00 din.
─────────────────────────────────────────────────────────────────
UKUPNO:..........................................._____,00 din.
```

---

## Korak 7 — Pravila stila (Mišić)

### 7.1 JEZIK I PISMO
Samo ćirilica (latinica dozvoljena SAMO u APR-registrovanim poslovnim imenima, u navodnicima). Služben, formalan, koncizan. Bez kolokvijalizama. Procesne pasivne konstrukcije („Obavezuje se", „Utvrđuje se") — DA; druge — NE.

### 7.2 STILSKA PRAVILA
- DOKAZ — kurzivom, uvučen, posle svake činjenične tvrdnje
- Petit — velikim: „OBAVEZUJE SE", „UTVRĐUJE SE", „PONIŠTAVA SE"
- Iznosi — brojčano: `250.000,00 dinara` (slovima u pratećem opisu)
- Datumi: `07.04.2026. godine`
- Tužbeni zahtev — uvek na kraju tela, pred potpisom

### 7.3 STRUKTURA ARGUMENTACIJE
- „Jedna stvar" PRVA (prvih 3 pasusa)
- Rimski: I, II, III
- Arapski: 1, 2, 3
- Argument: teza → činjenica → dokaz → pravna kvalifikacija → zaključak

### 7.4 FORMALNOSTI
- Novi Sad (default za Mišića)
- Datum ispod mesta
- Advokat — desno poravnat
- Potpis: „adv. Milan Mišić"

### 7.5 PRAVNA TEHNIKA
- Citiranje: „čl. 354 st. 3 tač. 2 ZPP"
- Prvi pomen: puno ime + skraćenica — „Zakon o parničnom postupku (ZPP)"
- Praksa: „vid. [sud] [broj]" ili parafraz (nikad doslovni citat sentence — chain of custody)
- ESLJP: pun format sa predstavkom + paragraf

### ❌ ZABRANJENO
- Latinična ćirilica (osim APR-registrovana imena)
- Reči umesto brojeva za novčane iznose u petitu
- Petit bez klauzule prinude
- Izostavljanje DOKAZ:
- Direktni citati sentenci u telu — samo parafraz u obrazloženju
- Izmišljeni citati zakona/prakse

---

## Korak 8 — P1/P2/P3/P4 klasifikacija

### 8.1 Pravilo

Svaka činjenica:
- ✅P1 — direktno iz dokumenta (strana)
- 🟡P2 — proizilazi logički
- 🔴P3 — rekonstrukcija/interpretacija
- ⛔P4 — ne može se zaključiti

**⛔P4 tvrdnje NE SMEJU biti u dokumentu.** Ako nešto ne može → pitam ili ispuštam.

### 8.2 Razlog

Protivna strana će napasti svaku tvrdnju. P3/P4 predstavljena kao činjenica = slaba odbrana.

---

## Korak 9 — Generisanje .docx

`docx` skill + standardi: Times New Roman 12pt, A4, margine 2,54 cm, UTF-8 ćirilica, srpski navodnici „ ".

**Imenovanje (po preferencama):** `stranka protivnastrana tippodneska kratakopis.docx` — bez dijakritika, bez podvlaka, malim slovima na kraju.

Primeri:
- `stojsin marjanov tuzba naplata duga.docx`
- `petrovic doo bogunovic odgovor na tuzbu.docx`
- `markovic stamenkovic zalba presuda.docx`

---

## Korak 10 — Compliance izveštaj (tuzba-parnica mini)

Ispod pravna-analiza izveštaja:

```
╔═══════════════════════════════════════════════════════════╗
║ ⚖️ COMPLIANCE — TUZBA-PARNICA v2                         ║
╠═══════════════════════════════════════════════════════════╣
║ PREDMET: [naziv]                                         ║
║ TIP AKTA: [tužba/odgovor/žalba/revizija/...]             ║
║ PERSPEKTIVA: [tuzilac/tuzeni]                            ║
║ HANDOFF: [✅/⚠️ fallback/❌ nepotpun] — [X/7] elemenata  ║
╠═══════════════════════════════════════════════════════════╣
║ PRAKSA DELEGIRANA U istrazivanje-prakse: [✅/❌]          ║
║ ✅P1 odluka: [N]  🟡P2 sentenca: [N]                     ║
║ ESLJP ugrađen: [DA/NE — razlog]                           ║
║ ROK: [✅ X dana / ⚠️ hitno / 🚨 kritično]               ║
║ SCRIPT validate_petit.py: [✅ prošao / ❌ blokirao]       ║
║ Obaveznih elemenata petita: [X/16]                       ║
╠═══════════════════════════════════════════════════════════╣
║ P1/P2/P3/P4:  ✅P1:[N] 🟡P2:[N] 🔴P3:[N] ⛔P4:[0]         ║
║ (⛔P4 mora biti 0 — inače dokument ne izlazi)            ║
╠═══════════════════════════════════════════════════════════╣
║ STIL MIŠIĆ:                                              ║
║  Ćirilica samo: [✅/❌]                                   ║
║  „OBAVEZUJE SE" formulacija: [✅/❌]                      ║
║  Klauzula prinude: [✅/❌]                                ║
║  Troškovnik po AT: [✅/❌]                                ║
║  Novi Sad + datum + potpis: [✅/❌]                      ║
║ VERIFIKATOR POZVAN: [✅/❌]                               ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Korak 11 — Predaja u `verifikator`

OBAVEZNO pre dostavljanja. Verifikator pokreće protokole A (DIFF), B (web search), V (logika), G (HONEYPOT), D (cross-skill). Vraća pouzdanost %.

**< 80% → NE isporučuje se** → ispravke → povratna petlja (maks. 3 prolaza, anti-loop threshold).

---

## REFERENTNI FAJLOVI

| Fajl | Sadržaj |
|---|---|
| `references/mesna-nadleznost.md` | Mesna nadležnost po ZPP (postojeći) |
| `references/petiti-mustre.md` | Mustre petita po tipu zahteva (postojeći) |
| `references/pravna-kvalifikacija.md` | ZOO, ZPD, ZPP kvalifikacije (postojeći) |
| `references/rokovi-parnica.md` | Kompletna tabela rokova + izuzeci |
| `references/tipovi-greshaka-presude-parnica.md` | Matrica čl. 374 ZPP |
| `references/handoff-protokol-parnica.md` | Protokol prijema handoff-a |
| `references/compliance-parnica.md` | Format mini compliance izveštaja |
| `references/triggering-tests.md` | Trigering testovi |
| **`references/sabloni/`** | **KOMPOZICIONI ŠABLONI AKATA (NOVO v3.0.0 — iz korpusa 2022-2026)** |
| &nbsp;&nbsp;├─ `01_tuzba.md` | Tužba (bazna struktura) |
| &nbsp;&nbsp;├─ `02_tuzba_sa_priv_merom.md` ⭐ | **Tužba sa privremenom merom (Kalentić/Flexopack — zlatni standard)** |
| &nbsp;&nbsp;├─ `03_odgovor_na_tuzbu_abcd.md` | Odgovor na tužbu A/B/C/D struktura (Stepanović) |
| &nbsp;&nbsp;├─ `04_podnesak.md` | Podnesak / izjašnjavanje na iskaze (Stepanović) |
| &nbsp;&nbsp;├─ `05_zalba_na_presudu_parnica.md` | Žalba na presudu (Stepanović dec 2025) |
| &nbsp;&nbsp;├─ `06_revizija.md` | Revizija (Vuković 1967 — Vrhovni sud) |
| &nbsp;&nbsp;├─ `07_prituzba_rad_suda.md` | Pritužba na rad suda (AB PRO ING — univerzalna struktura) |
| &nbsp;&nbsp;└─ `08_opomena_pred_tuzbu.md` | Opomena pred tužbu (Armex/Ralević model) |

**⚠️ Kritično pravilo za šablone:** Pre pisanja parničnog akta, **OBAVEZNO** otvori odgovarajući šablon. Šablon sadrži:
- Kada se koristi + rok + stvarna i mesna nadležnost
- Terminologiju (TUŽILAC / TUŽENI / 1, 2, 3. reda)
- Matricu potpisa po vrednosti spora (Milan sam / Milan + Đorđe / tri advokata)
- Tarifu iz korpusa po vrednosti
- Kompletan mock-up sa primenjenom tipografijom (A/B/C/D struktura, REZIME, petit)
- Checklist pre isporuke

**Napomena o izvršnom postupku:** Izvršni akti (predlog za izvršenje, prigovor na rešenje o izvršenju, protizvršene, podnesak izvršitelju, opomena pred izvršenje, vansudsko poravnanje) **ne idu u ovaj skil** — idu u zaseban `izvrsenje/` skil koji je u fazi kreiranja.

---

## ZABRANJENO

1. Aktiviranje samostalno ako postoji dokument → prvo pravna-analiza
2. Samostalna pretraga prakse → uvek delegacija
3. Citati prakse/ESLJP iz memorije → verifikacija kroz istrazivanje-prakse
4. Akt bez „Jedne stvari" u prvih 3 pasusa
5. P3 kao P1 — svaku tvrdnju markirati
6. ⛔P4 u dokumentu
7. Zaobilaženje verifikator-a
8. Zaobilaženje compliance-a
9. Izmišljeni članovi/brojevi odluka/datumi/imena
10. Generisanje bez eksplicitnog „idi"/„generiši"/„kreni"
11. Generisanje bez provere rokova
12. Generisanje bez kalkulisanog troškovnika

---

## ⛔ ZAVRŠNA INSTRUKCIJA

**tuzba-parnica v2 je deo stack-a.**

- Bez `pravna-analiza` → fallback + upozorenje
- Bez `istrazivanje-prakse` → **STAJE**
- Bez `verifikator` → **STAJE**
- Bez `god-skill` u pozadini → smanjen kvalitet

**Kvalitet ispred brzine.** Rok blizak + fallback ne radi → javi Milanu, čekaj odluku. Nikad tiho rešavati.
