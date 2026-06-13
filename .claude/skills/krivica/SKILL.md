---
name: krivica
version: 2.0
description: >
  Krivičnopravni akti — žalbe, podnesci, završne reči, ZZZ, odgovori na optužnicu,
  prigovor na optužni predlog, sporazumi o priznanju, krivične prijave, žalba na
  odbačaj, ponavljanje postupka, ustavne žalbe, predstavka ESLJP, pritvor.
  Trigeriši čim korisnik pomene: krivica, krivični postupak, okrivljeni, branilac,
  optužnica, optužni predlog, žalba na presudu, ZZZ, pritvor, završna reč, uvodno
  izlaganje, krivična prijava, sporazum o priznanju, ponavljanje postupka,
  ustavna žalba, ESLJP, čl. 438/439/440/441/482–493/211/500/313–319 ZKP, KZ, ZKP,
  privatna tužba krivica, odgovor na optužnicu, prigovor. Generiše .docx u stilu
  adv. Milana Mišića i adv. Đorđa Nedeljkova, sa perspektive ODBRANE okrivljenog.
  Lanac: pravna-analiza → ovaj skill → stil-pisanja → verifikator (istrazivanje-prakse se poziva kao servis u Koraku 3). NE aktivirati za: građanske/parnične sporove, izvršenje,
  prekršaje, upravni postupak, knjižice, Instagram, tehnički debugging.
metadata:
  author: "Milan Mišić, advokat"
  version: "2.1.0"
  depends-on: ["pravna-analiza"]
  composes-with: ["istrazivanje-prakse", "verifikator"]
  category: "legal-criminal"
  last-updated: "2026-04-08"
---

# Krivični postupak — Skill v2

> **Pismo:** instrukcije ovog skila su latinica (token-ekonomija, vidi `_policy/politika-pisma.md`); izlazni pravni akt je uvek ćirilica — kontroliše `stil-pisanja`.

## ⚠️ NEGATIVE TRIGGERS — NE AKTIVIRAJ ZA:

| Kontekst | Pravilan skill |
|---|---|
| Građanske/parnične tužbe, odštetni sporovi, ugovori | `tuzba-parnica` |
| Izvršni postupak, predlog za izvršenje, protivizvršenje | `pravna-analiza` + `validate_petit.py` |
| Prekršajni postupak — žalba/prigovor na prekršajni nalog | `pravna-analiza` (ZOP, ne KZ/ZKP) |
| Upravni postupak, tužba pred Upravnim sudom | `pravna-analiza` |
| Radni spor, disciplinski postupak | `tuzba-parnica` |
| Opšta pravna pitanja bez krivičnopravne komponente | `pravna-analiza` |
| Knjižice za Relju, Instagram, Cowork debugging, kreativni rad | NIJEDAN pravni skill |

**Kompozabilnost:** Ovaj skill se aktivira **posle** `pravna-analiza` (prima handoff), poziva `istrazivanje-prakse` za sudsku praksu, i predaje finalni dokument `verifikator`-u pre isporuke. NIKADA ne aktivira samostalno ako postoji dokument za analizu.

---

## Svrha

Automatski izrađuje potpune i sudu podnošene akte u krivičnom postupku, u stilu i retoričkom maniru advokatske kancelarije Milana Mišića (adv. Milan Mišić i adv. Đorđe Nedeljkov), prema Krivičnom zakoniku (KZ) i Zakoniku o krivičnom postupku (ZKP), sa integracijom verifikovane aktuelne sudske prakse i ESLJP standarda.

**OSNOVNO PRAVILO:** Svaki akt se piše SA STRANE ODBRANE, tj. u cilju zaštite okrivljenog/okrivljenih. Odbrana uvek traži najpovoljnije rešenje za okrivljenog.

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
      │  istrazivanje-prakse  │◄──────┤      KRIVICA        │ (ovaj skill)
      │     v6 (delegat)      │       │       v2            │
      └───────────┬───────────┘       └──────────┬──────────┘
                  │                              │
                  └──────────────┬───────────────┘
                                 │
                     ┌───────────▼───────────┐
                     │      verifikator       │ (pre dostavljanja)
                     └───────────┬───────────┘
                                 │
                                 ▼
                          KORISNIK (Milan)
```

**Pravila integracije:**
1. Krivica se **NIKADA ne aktivira samostalno** ako postoji dokument za analizu — prvo se čeka handoff od `pravna-analiza`.
2. Pretraga prakse se **AGRESIVNO delegira** u `istrazivanje-prakse`. Ako taj skill nije aktivan — `krivica` **STAJE** i javlja korisniku.
3. Pre dostavljanja korisniku, dokument **OBAVEZNO** prolazi kroz `verifikator`.
4. `krivica` šalje sopstveni mini compliance izveštaj ISPOD izveštaja od `pravna-analiza`.

---

## Korak 0 — Prijem handoff-a od `pravna-analiza`

### 0.1 Provera handoff paketa

`pravna-analiza` F6.1 mora da isporuči sledeći paket pre nego što `krivica` krene u pisanje:

```
┌─────────────────────────────────────────────────────────┐
│ HANDOFF PAKET (obavezan)                                │
├─────────────────────────────────────────────────────────┤
│ ① TEORIJA SLUČAJA (F0)                                 │
│    — 1 rečenica: „O čemu se ovde radi?"                │
│    — Hipoteza + procena verovatnoće                     │
│                                                         │
│ ② ČINJENIČNA MAPA (F1–2 sažeto)                         │
│    — Ključne činjenice sa ✅P1 / 🟡P2 / 🔴P3 oznakama   │
│    — Izvor svake (stranica, pasus)                      │
│    — Kontradikcije ako ih ima                          │
│                                                         │
│ ③ ARGUMENTI rangirani + graf zavisnosti (F3)           │
│    — Jaki / srednji / slabi                              │
│    — Nezavisnih od zavisnih                             │
│    — ZKP/KZ/Ustav/EKLJP slojevi                         │
│                                                         │
│ ④ ADVERSARIAL rezultati (F4)                           │
│    — Koji argumenti su preživeli simulaciju sudije     │
│    — Koji su odbačeni i zašto                          │
│                                                         │
│ ⑤ „JEDNA STVAR" (F5)                                   │
│    — Najjači argument u 1 rečenici                     │
│    — OVO IDE PRVO U DOKUMENTU                          │
│                                                         │
│ ⑥ VERIFIKOVANA SUDSKA PRAKSA                           │
│    — Od istrazivanje-prakse v6                         │
│    — Samo odluke sa direktnim linkom ili pasted full   │
│                                                         │
│ ⑦ STRATEŠKA PROCENA                                    │
│    — Najbolji / realan / najgori ishod                  │
│    — Rizik 1–10                                        │
└─────────────────────────────────────────────────────────┘
```

### 0.2 Šta raditi ako handoff NE postoji

**Slučajevi u kojima handoff ne postoji:**
- Korisnik traži blanko akt bez dokumenta (npr. „napisi krivičnu prijavu protiv X zbog uvrede")
- Standardni akt bez novih spisa (npr. „napiši uvodno izlaganje po postojećim podacima")
- Korisnik eksplicitno kaže „nemoj da analiziraš, samo napiši po mom diktatu"

**U takvim slučajevima `krivica` prelazi na Korak 1 (prikupljanje inputa direktno od korisnika).** Ali **uvek obavesti korisnika:**

> *„Nema pravna-analiza handoff-a. Radim direktno sa tvojim inputom. Ako imaš dokument (presudu, optužnicu, rešenje) učitaj ga da aktiviram pravna-analiza pre pisanja akta — kvalitet će biti značajno veći."*

### 0.3 Šta raditi ako handoff postoji ali je NEPOTPUN

Ako handoff paket nedostaje nešto od ⓵–⓻:
1. **STOP. Ne piši akt.**
2. Javi korisniku šta nedostaje.
3. Traži od `pravna-analiza` da dopuni, ili traži od korisnika zeleno svetlo za delimičan rad.
4. Nikad tiho ne popunjavaj praznine iz memorije — to je halucinacija.

---

## Korak 0.1 — Klasifikacija akta

### A) Ako je handoff primljen

Tip akta se čita direktno iz ⑦ STRATEŠKA PROCENA ili ⑤ „Jedna stvar". Pravna-analiza već zna u kojoj fazi postupka se nalazimo.

### B) Ako handoff-a nema

Tip akta se određuje kroz listu trigera. Ako korisnik nije precizirao — pitaj ga.

### Tipovi krivičnih akata (18 tipova u v2)

**ISTRAŽNA FAZA:**

| # | Tip akta | Trigeri | Pravni osnov |
|---|---|---|---|
| 1 | Krivična prijava | „krivična prijava", „prijaviti" | čl. 280–284 ZKP |
| 2 | Žalba na odbačaj krivične prijave (VJT) | „odbačaj", „prigovor VJT", „žalba na odbačaj" | čl. 51, 284 ZKP |
| 3 | Prigovor na odbačaj (ne VJT) | „prigovor odbačaj" | čl. 284 ZKP |
| 4 | Molba za odlaganje kriv. gonjenja | „odlaganje krivičnog gonjenja", „oportunitet" | čl. 283 ZKP |
| 5 | Žalba na pritvor | „žalba na pritvor", „ukidanje pritvora" | čl. 211–222 ZKP |
| 6 | Podnosak u istrazi | „podnosak istrazi", „predlog dokazi" | čl. 78, 301 ZKP |

**FAZA OPTUŽENJA:**

| # | Tip akta | Trigeri | Pravni osnov |
|---|---|---|---|
| 7 | Odgovor na optužnicu (opšti postupak) | „odgovor na optužnicu", „izjašnjenje" | čl. 336–344 ZKP |
| 8 | Prigovor na optužni predlog (skraćeni postupak) | „prigovor na optužni predlog", „prigovor OP" | čl. 500 ZKP |
| 9 | Žalba na rešenje o potvrđivanju optužnice | „žalba na potvrđivanje" | čl. 345 ZKP |

**GLAVNI PRETRES:**

| # | Tip akta | Trigeri | Pravni osnov |
|---|---|---|---|
| 10 | Uvodno izlaganje | „uvodno izlaganje", „početak pretresa" | čl. 396 ZKP |
| 11 | Završna reč | „završna reč", „zaključna reč" | čl. 412 ZKP |
| 12 | Sporazum o priznanju krivičnog dela | „sporazum o priznanju", „nagodba" | čl. 313–319 ZKP |
| 13 | Privatna tužba | „privatna tužba krivica" (za uvredu/klevetu) | čl. 65 ZKP + čl. 170–173 KZ |

**REDOVNI I VANREDNI PRAVNI LEKOVI:**

| # | Tip akta | Trigeri | Pravni osnov |
|---|---|---|---|
| 14 | Žalba na presudu | „žalba na presudu", „žalba" | čl. 430–467 ZKP |
| 15 | Zahtev za zaštitu zakonitosti (ZZZ) | „ZZZ", „zaštita zakonitosti" | čl. 482–493 ZKP |
| 16 | Predlog za ponavljanje postupka | „ponavljanje postupka", „novi dokazi" | čl. 470–479 ZKP |

**USTAVNI I MEĐUNARODNI NIVO:**

| # | Tip akta | Trigeri | Pravni osnov |
|---|---|---|---|
| 17 | Ustavna žalba (krivična) | „ustavna žalba", „Ustav krivica" | čl. 170 Ustava + čl. 82 ZUS |
| 18 | Predstavka ESLJP | „ESLJP predstavka", „Strazbur" | čl. 34 EKLJP |

---

## Korak 1 — Prikupljanje inputa (fallback kad nema handoff-a)

Ako Korak 0 nije primio handoff, prikupi direktno od korisnika.

### 1.1 Osnovni podaci

**Okrivljeni:**
- Ime i prezime
- Adresa prebivališta / boravišta
- JMBG
- Branilac (default: „adv. Milan Mišić iz Novog Sada, ul. Maksima Gorkog br. 6")

**Sud:**
- Naziv suda (npr. Osnovni sud u Novom Sadu, Viši sud u Novom Sadu)
- Broj predmeta (npr. K-123/24, KV-456/23, K. 63/2026)

**Tužilaštvo (ako je relevantno):**
- Naziv (OJT, VJT)
- Broj optužnice / krivične prijave

### 1.2 Tabela rokova — JEDINSTVENA REFERENCA

> ⚠️ **KRITIČNO:** Svaki rok se broji od dana dostavljanja akta okrivljenom ILI njegovom braniocu (prvi od dva). Za detalje videti `references/rokovi-tabela.md`.

| Akt | Rok | Izvor |
|---|---|---|
| Žalba na presudu (opšti postupak) | **15 dana** | čl. 432 ZKP |
| Žalba na presudu (skraćeni postupak) | **8 dana** | čl. 506 ZKP |
| Žalba na presudu u postupku prema maloletnicima | **8 dana** | čl. 81 ZMP |
| Zahtev za zaštitu zakonitosti | **30 dana** od pravnosnažnosti | čl. 485 st. 4 ZKP |
| Žalba na rešenje o pritvoru | **3 dana** od dostavljanja | čl. 214 st. 4 ZKP |
| Žalba na rešenje o zadržavanju | **4 sata** od usmenog saopštenja | čl. 294 st. 3 ZKP |
| Odgovor na optužnicu | **8 dana** od dostavljanja | čl. 336 st. 3 ZKP |
| Prigovor na optužni predlog | **8 dana** od dostavljanja | čl. 500 st. 3 ZKP |
| Žalba na rešenje o odbačaju kriv. prijave (VJT) | **8 dana** | čl. 51 ZKP |
| Prigovor oštećenog na odbačaj | **8 dana** od obaveštenja | čl. 51 ZKP |
| Privatna tužba (rok podnošenja) | **3 meseca** od saznanja | čl. 65 st. 2 ZKP |
| Predlog za ponavljanje postupka | **nema rok** (do zastarelosti izvršenja) | čl. 470 ZKP |
| Ustavna žalba | **30 dana** od prijema pravnosnažne odluke | čl. 84 ZUS |
| Predstavka ESLJP | **6 meseci** (za stare slučajeve) / **4 meseca** (od 1.2.2022) od finalne odluke | čl. 35 EKLJP |
| Žalba na rešenje u istrazi (KV) | **3 dana** | čl. 467 st. 1 ZKP |

### 1.3 Rok-alarm protokol

**OBAVEZNO:** Kada korisnik navede datum dostavljanja akta, `krivica` AUTOMATSKI računa rok i isporučuje alarm.

```
╔════════════════════════════════════════════════╗
║ ⏰ ROK-ALARM                                    ║
╠════════════════════════════════════════════════╣
║ Tip akta: [X]                                  ║
║ Dostavljeno: [datum]                            ║
║ Rok: [N] dana / sati                           ║
║ KRAJNJI DATUM: [datum] do [vreme]              ║
║ Danas: [današnji datum]                         ║
║ OSTALO: [N] dana                               ║
╠════════════════════════════════════════════════╣
║ STATUS:                                        ║
║  🟢 > 7 dana — normalno                        ║
║  🟡 3–7 dana — prioritet                       ║
║  🔴 1–2 dana — HITNO                           ║
║  ⛔ < 24 sata — KRITIČNO                       ║
╚════════════════════════════════════════════════╝
```

**Pravila računanja:**
- Rok teče od dana POSLE dostavljanja (čl. 225 st. 1 ZKP)
- Ako zadnji dan pada u neradni dan → produžava se na prvi radni dan (čl. 225 st. 2 ZKP)
- Podnošenje pre 24:00 zadnjeg dana je blagovremeno
- Podnošenje preporučenom poštom — relevantan datum na žigu, ne datum prijema u sudu (čl. 228 st. 1 ZKP)


### 1.4 Specifični podaci po tipu akta

**Za žalbu na presudu / ZZZ:**
- Broj i datum pobijane presude (prvostepene i drugostepene)
- Krivično delo za koje je osuđen (član KZ)
- Izrečena sankcija
- Razlozi žalbe (čl. 437 ZKP):
  1. Bitna povreda odredaba krivičnog postupka (čl. 438)
  2. Povreda krivičnog zakona (čl. 439)
  3. Pogrešno i nepotpuno utvrđeno činjenično stanje (čl. 440–441)
  4. Odluka o krivičnoj sankciji i drugim odlukama

**Za žalbu na pritvor:**
- Broj i datum rešenja o pritvoru
- Pritvorski osnov (čl. 211 ZKP)
- Trenutna situacija okrivljenog (adresa, zaposlenje, porodica)

**Za krivičnu prijavu:**
- Osumnjičeni: podaci
- Oštećeni: podaci + punomoćnik
- Krivično delo: član KZ i opis „ŠTO JE"
- Dokazni predlozi

**Za odgovor na optužnicu:**
- Optužnica: broj, datum, tužilaštvo
- Krivično delo iz optužnice
- Stav odbrane: poricanje, priznanje, delimično priznanje
- Dokazni predlozi odbrane

**Za prigovor na optužni predlog (skraćeni postupak):**
- Optužni predlog: broj, datum, tužilaštvo
- Krivično delo (po pravilu do 8 godina zatvora)
- Razlozi prigovora: nema mesta opt. predlogu, nedovoljni dokazi, pogrešna kvalifikacija
- Predlog: odbacivanje opt. predloga ili dopuna istražnih radnji

**Za sporazum o priznanju krivičnog dela:**
- Optužnica/optužni predlog: broj, datum
- Krivično delo i zaprećena kazna
- Šta se nudi tužiocu (priznanje, naknada štete, saradnja)
- Šta traži odbrana (kazna u donjoj granici, uslov, ukidanje mere bezbednosti)
- Ograničenja: čl. 313 st. 2 ZKP (do 12 godina samo za određena dela)

**Za predlog za ponavljanje postupka:**
- Pravnosnažna presuda: broj, datum
- Osnov za ponavljanje (čl. 473 ZKP):
  - novi dokazi / nove činjenice
  - lažan iskaz svedoka/veštaka
  - falsifikovana isprava
  - nepostojeće krivično delo utvrđeno kasnije
- Dokazi novih činjenica

**Za ustavnu žalbu:**
- Pravnosnažna odluka: broj, datum (uključujući odluku o svim pravnim lekovima)
- Povređeno ustavno pravo (čl. Ustava)
- Odgovarajući član EKLJP
- Datum prijema finalne odluke (za rok od 30 dana)

**Za predstavku ESLJP:**
- Pravnosnažna odluka Ustavnog suda: broj, datum, datum prijema
- Povređeni član EKLJP (6, 7, 8, 10, 13...)
- Činjenice — kratak hronološki prikaz
- Iscrpljivanje domaćih lekova (obavezno)

---

## Korak 2 — Reverse-engineering presude (za žalbe, ZZZ, ponavljanje)

**Ovo je strateški korak koji se radi PRE pisanja — nezavisno od handoff-a.**

Cil je: pronaći gde presuda „curi" — gde obrazloženje ne podupire izreku, gde su dokazi pogrešno procenjeni, gde je zakon pogrešno primenjen.

### 2.1 Trostruko čitanje

**Prvo čitanje — izreka:**
- Šta je sud izrekao? (osuda / oslobađanje / odbijanje / obustava)
- Kom krivičnom delu je utvrđena krivica?
- Kakva sankcija?
- Koji stavovi izreke su kontradiktorni?

**Drugo čitanje — razlozi presude:**
- Koji dokazi su prihvaćeni?
- Koji su odbačeni i zašto?
- Šta sud kaže o odbrani okrivljenog?
- Gde obrazloženje „skače" preko logičkih koraka?

**Treće čitanje — sravnivanje:**
```
┌─────────────────────────────────────────────────┐
│ TABLICA DISKREPANCIJA                           │
├─────────────────────────────────────────────────┤
│ Tvrdnja u izreci │ Podrška u razlozima │ Ocena  │
│─────────────────┼─────────────────────┼────────│
│ [šta]           │ [gde i kako]        │ ✅/❌ │
│ ...             │ ...                 │ ...    │
└─────────────────────────────────────────────────┘
```

**Gde god je ❌ → to je tačka napada za žalbu.**

### 2.2 Matrica „greška u presudi → osnov žalbe"

Ovo je jedinstvena referentna matrica koju `krivica` koristi za automatsko mapiranje činjeničnih grešaka u pravno relevantne osnove žalbe.

| Tip greške u presudi | Osnov žalbe | Član ZKP |
|---|---|---|
| Nerazumljiva izreka | Bitna povreda postupka | čl. 438 st. 1 tač. 11 |
| Protivrečnost između izreke i obrazloženja | Bitna povreda postupka | čl. 438 st. 2 tač. 2 |
| Presuda zasnovana na nedozvoljenom dokazu | Bitna povreda postupka | čl. 438 st. 2 tač. 1 |
| Presuda bez održavanja glavnog pretresa u zakonskom sastavu | Bitna povreda postupka | čl. 438 st. 1 tač. 1 |
| Izuzeta sudija učestvovala u presudi | Bitna povreda postupka | čl. 438 st. 1 tač. 4 |
| Odbrana nije imala reč na glavnom pretresu | Bitna povreda postupka | čl. 438 st. 1 tač. 7 |
| Presuda prekoračuje optužbu (neproporcionalno) | Bitna povreda postupka | čl. 438 st. 1 tač. 9 |
| Sud nije utvrdio bitna obeležja krivičnog dela | Povreda krivičnog zakona | čl. 439 tač. 1 |
| Pogrešna pravna kvalifikacija dela | Povreda krivičnog zakona | čl. 439 tač. 2 |
| Pogrešna odluka o krivičnoj sankciji | Povreda krivičnog zakona | čl. 439 tač. 3 |
| Zastarelost krivičnog gonjenja / izvršenja | Povreda krivičnog zakona | čl. 439 tač. 4 |
| Nepotpuno utvrđeno činjenično stanje | Pogrešno/nepotpuno UČS | čl. 441 |
| Pogrešno utvrđeno činjenično stanje | Pogrešno/nepotpuno UČS | čl. 440 |
| Odbijeni dokazni predlozi odbrane | Bitna povreda + pogrešno UČS | čl. 395 st. 4 + čl. 440 |
| Presuda bez obrazlaganja odlučnih činjenica | Bitna povreda postupka | čl. 438 st. 2 tač. 2 |

Detaljno: `references/tipovi-greshaka-presude.md`

### 2.3 „Jedna stvar" provera

Iz handoff-a ili sopstvene analize — identifikuj **ODMAH** „jednu stvar" koja menja sve. U žalbi ona ide u prvih 3 pasusa, pre bilo čega drugog.

**Test za „jednu stvar":**
1. Ako bih mogao da napišem SAMO JEDAN pasus drugostepenom sudu — koji bi to bio?
2. Šta drugostepeni sud NE MOŽE da odbije bez kontradikcije sa svojom presudom?
3. Gde je prvostepeni sud NAJVIŠE pogrešio — toliko da dalje čitanje postaje suvišno?

---

## Korak 3 — Pretraga sudske prakse (DELEGACIJA u `istrazivanje-prakse`)

### 3.1 Protokol delegacije

**`krivica` NIKADA sama ne pretražuje praksu.** Umesto toga:

```
① PROVERA: Da li je istrazivanje-prakse skill aktivan?
   NE → STOP. Poruka korisniku:
       „Aktiviraj istrazivanje-prakse pre nego što nastavim.
        Ne pišem krivični akt bez verifikovane prakse.
        Rizik halucinacije je neprihvatljiv."
   DA → nastavi na ②

② PAKOVANJE UPITA:
   ┌─────────────────────────────────────────────┐
   │ PAKET ZA istrazivanje-prakse               │
   ├─────────────────────────────────────────────┤
   │ • Tip akta: [iz Koraka 0.1]                │
   │ • Pravni problem: [1 rečenica]             │
   │ • Ključne norme: [čl. KZ/ZKP]              │
   │ • Traženi tip izvora:                      │
   │   - VS/VKS/VSS (uvek)                      │
   │   - Apelacioni sudovi (za žalbe)          │
   │   - ESLJP (za ustavne žalbe, predstavke)   │
   │   - Ustavni sud (za ZZZ, ustavne žalbe)   │
   │ • MODE: FULL / STANDARD                    │
   │ • Kontra-pretraga: DA (uvek)              │
   └─────────────────────────────────────────────┘

③ PRIJEM REZULTATA:
   Samo odluke sa:
   - direktnim linkom, ILI
   - pasted full tekstom + atribucijom
   Sve ostalo = ⛔ odbačeno.

④ PREDAJA U verifikator PRE UGRADNJE U AKT
```

### 3.2 Ključne reči za pretragu (po tipu akta)

Za svaki tip akta, `krivica` daje `istrazivanje-prakse` jasan set ključnih reči:

**Žalba na presudu:**
- „bitna povreda čl. 438 ZKP"
- „pogrešno utvrđeno činjenično stanje čl. 440"
- „nedozvoljeni dokaz čl. 84 čl. 438 st. 2 tač. 1"
- „nerazumljiva izreka čl. 438 st. 1 tač. 11"

**ZZZ:**
- „zahtev za zaštitu zakonitosti Kzz [predmet]"
- „čl. 485 ZKP povreda KZ"
- „zastarelost krivičnog gonjenja čl. 103 KZ"

**Ustavna žalba:**
- „Už krivica čl. 32 Ustava"
- „pretpostavka nevinosti čl. 34 Ustava"
- „čl. 6 EKLJP pravično suđenje"

**Predstavka ESLJP:**
- Ključni ESLJP slučajevi po povređenom članu:
  - čl. 6 (fair trial) → Salduz, Ibrahim, Al-Khawaja
  - čl. 7 (nema kazne bez zakona) → Scoppola, Del Río Prada
  - čl. 10 (sloboda izražavanja za uvredu/klevetu) → Lingens, Feldek, Castells
  - **SVE kroz `istrazivanje-prakse` HUDOC pretragu — nikad iz memorije**

Detaljno: `references/esljp-krivica.md`

### 3.3 Sudska praksa — šta se radi sa rezultatom

1. Svaki rezultat ide kroz `verifikator` za DIFF prover izvora.
2. Za svaku korišćenu odluku — zaseban .docx fajl (trenutno pravilo iz tvojih instrukcija).
3. U krivični akt se ugrađuje **parafrazirano** u argumentaciju, sa „vid. VS Kzz [broj]/[god]" kao interna referenca.
4. Nikad doslovni citati duži od 15 reči bez atribucije i linka.


---

## Korak 4 — Struktura dokumenta po tipu akta

Svi šabloni su u ćirilici. Font: Times New Roman 12pt. Format: A4, margine 2,54 cm.

### 4.1 ŽALBA NA PRESUDU (čl. 430–467 ZKP)

```
[VIŠEM/APELACIONOM SUDU U ___]
putem
[Osnovnog/Višeg suda u ___]
Na br. K-___/____

OKRIVLJENI:  [Podaci], koga po punomoći u spisima brani adv. Milan Mišić
             iz Novog Sada, ul. Maksima Gorkog br. 6:

              Ž A L B A
              [N] primeraka, [N] priloga

Protiv Presude [sud] br. K-___/___ od ___.___._____. godine,
branilac okrivljenog [Ime] u zakonom ostavljenom roku izjavljuje

                Žalbu

Zbog:
1. bitne povrede odredaba krivičnog postupka,
2. povrede krivičnog zakona,
3. pogrešno i nepotpuno utvrđenog činjeničnog stanja,
4. odluke o krivičnoj sankciji i drugim odlukama

i predlaže da se ova Žalba sa spisima predmeta dostavi na odlučivanje
veću [drugostepenog suda], koje molimo da u smislu odredaba člana 447
ZKP-a, o danu i času održavanja sednice obavesti okrivljenog i njegovog
branioca pošto isti žele da prisustvuju javnom delu sednice, te da
nakon toga:

Žalbu uvaži i pobijanu prvostepenu presudu preinači tako što će
okrivljenog osloboditi od odgovornosti ILI da prvostepenu presudu
ukine i vrati predmet na ponovno suđenje.

              OBRAZLOŽENJE

[„JEDNA STVAR" ide ovde, u prvih 2–3 pasusa — ne čekati sredinu]

[Detaljno obrazloženje po osnovima žalbe — odvojeno po tačkama,
 sa DOKAZ: posle svake činjenične tvrdnje]

_______________________________________________________________
PREDLOG DRUGOSTEPENOM SUDU

Shodno svemu napred navedenom, predlažem da [drugostepeni sud]
usvoji ovu Žalbu, te [preinači/ukine] pobijanu Presudu...

[Mesto], [Datum]
                              branilac okrivljenog
                              adv. Milan Mišić
```

**Rok:** 15 dana (opšti) / 8 dana (skraćeni)

### 4.2 ZAHTEV ZA ZAŠTITU ZAKONITOSTI (čl. 482–493 ZKP)

```
VRHOVNOM SUDU

OKRIVLJENI:  [Podaci], koga po punomoći u spisima brani adv. [Ime]

              ZAHTEV
              ZA ZAŠTITU ZAKONITOSTI
              [N] primeraka, [N] priloga + punomoć

Protiv Presude [prvostepeni sud] br. ___ i Presude [drugostepeni sud]
br. ___, u zakonski ostavljenom roku okrivljeni putem branioca izjavljuje

              Zahtev za zaštitu zakonitosti

Iz razloga predviđenih čl. 485 ZKP, odnosno:
- Povrede ZKP,
- Pogrešno primenjen KZ,

pa predlažemo da Vrhovni sud usvoji ovaj Zahtev za zaštitu zakonitosti,
ukine u celosti pobijane presude... te vrati predmet na ponovno suđenje,
kao i da ODLOŽI IZVRŠENJE pravnosnažne presude, DOK ne reši o ovom
Zahtevu za zaštitu zakonitosti, a takođe da od prvostepenog i
drugostepenog suda zatraži kompletne spise predmeta.

              OBRAZLOŽENJE
[„Jedna stvar" → pa detaljno po tačkama, numerisano: 1., 2., 3.]

_______________________________________________________________
Shodno svemu navedenom, predlažemo da Vrhovni sud usvoji ovaj ZZZ...

[Mesto], [Datum]
                              adv. [Ime]
```

**Rok:** 30 dana od pravnosnažnosti
**Podnosi:** Okrivljeni ISKLJUČIVO preko branioca (čl. 483 ZKP)
**Citiranje suda:** za odluke do 2010 — VSS; 2010–2024 — VKS; od 2024 — VS (videti `istrazivanje-prakse`)

### 4.3 ZAVRŠNA REČ (čl. 412 ZKP)

```
[SUDU]
Na br. K-___/____

              ZAVRŠNA REČ
              BRANIOCA OKRIVLJENOG [IME]

Poštovana predsednice i članovi sudskog veća,
[ili: Poštovana sudija,]

[Uvodno — „Jedna stvar" — stav odbrane]

[Analiza dokaza — detaljno, po svakom dokazu]

[Pravna argumentacija]

[Zaključak — predlog sudu]

Shodno svemu navedenom, predlažemo da sud donese OSLOBAĐAJUĆU PRESUDU,
sve prema načelu in dubio pro reo.

[Mesto], [Datum]
                              adv. [Ime]
```

### 4.4 UVODNO IZLAGANJE (čl. 396 ZKP)

```
[SUDU]
Na br. K-___/____

              UVODNO IZLAGANJE
              BRANIOCA OKRIVLJENOG,

Poštovana predsednice i članovi veća,

[Kratak stav odbrane — šta odbrana tvrdi, „Jedna stvar" u jednoj rečenici]

[Dokazni predlozi]

Zadržavamo pravo da u toku postupka predložimo dokaze koji nam
nisu bili poznati.

[Mesto], [Datum]
                              adv. [Ime]
```

### 4.5 KRIVIČNA PRIJAVA (čl. 280–284 ZKP)

```
[JAVNOM TUŽILAŠTVU]

OSUMNJIČENI:  [Podaci]
OŠTEĆENI:    [Podaci], koga po punomoći zastupa adv. [Ime]:

              KRIVIČNA PRIJAVA
              Zbog: krivičnog dela [naziv] iz čl. ___ KZ

ŠTO JE:
[Činjenični opis radnje izvršenja — hronološki, detaljno]

čime je izvršio krivično delo [naziv] iz člana ___ Krivičnog zakonika.

              P R E D L A Ž E M O
[Dokazni predlozi — numerisani]

Napomena: imovinsko-pravni zahtev postavljamo...

[Mesto], [Datum]
                              adv. [Ime]

Troškovnik:
Sastav ove Krivične prijave........[iznos],00 dinara
```

### 4.6 ODGOVOR NA OPTUŽNICU (čl. 336–344 ZKP) — OPŠTI POSTUPAK

```
[SUDU] — veću iz čl. 21 st. 4 ZKP
Na br. KV ___/____

OKRIVLJENI:  [Podaci], koga brani adv. [Ime]:

              ODGOVOR NA OPTUŽNICU
              [N] primeraka

Na osnovu čl. 336 st. 2 ZKP branilac okrivljenog adv. [Ime] dostavlja
Odgovor na Optužnicu br. ___ sa predlogom da veće [suda] iz čl. 21
st. 4 ZKP na osnovu Odgovora na optužnicu i same Optužnice istu
ispita, te donese Rešenje o obustavi postupka na osnovu čl. 338 st. 1
tačka ___ ZKP.

              Obrazloženje

[Detaljno — zašto nema mesta optužbi]

Shodno svemu navedenom, predlažemo da veće [suda] iz čl. 21 st. 4 ZKP
na osnovu ovog Odgovora na optužnicu i same Optužnice iste ispita,
te donese Rešenje o obustavi predmetnog postupka na osnovu čl. 338
st. 1 tačka ___ ZKP.

[Mesto], [Datum]
                              adv. [Ime]
```

**Rok:** 8 dana od dostavljanja optužnice (čl. 336 st. 3 ZKP)

### 4.7 ŽALBA NA PRITVOR (čl. 211–222 ZKP)

```
[APELACIONOM/VIŠEM SUDU]
putem
[Suda koji je odredio pritvor]
Na br. KV-___/____

OKRIVLJENI:  [Podaci], koga brani adv. [Ime]:

              Ž A L B A
              [N] primeraka

Protiv Rešenja [suda] br. ___ od ___.___.____. godine, branilac
okrivljenog [Ime] u ostavljenom roku izjavljuje

              Žalbu

Zbog:
- Pogrešno i nepotpuno utvrđenog činjeničnog stanja,
- Bitnih povreda odredaba krivičnog postupka,
- Pogrešne odluke o drugim merama,

te predlažem da [sud] usvoji ovu Žalbu, te preinači pobijano Rešenje,
tako što će ukinuti pritvor okrivljenom [Ime] ili pritvor zameni
blažom merom zabrana napuštanja boravišta.

              OBRAZLOŽENJE
[Detaljno — zašto nema osnova za pritvor]

_______________________________________________________________
PREDLOG DRUGOSTEPENOM SUDU
[Predlog]

[Mesto], [Datum]
                              adv. [Ime]
```

**Pritvorski osnovi (čl. 211 ZKP):**
- tač. 1 — opasnost od bekstva
- tač. 2 — uticaj na svedoke/dokaze
- tač. 3 — ponavljanje dela
- tač. 4 — težina dela (preko 10 god.)

**Argumentacija odbrane (UVEK):**
- Okrivljeni ima adresu, zaposlenje, porodicu → nema opasnosti od bekstva
- Blaže mere su dovoljne (zabrana napuštanja, javljanje policiji)
- Pritvor je KRAJNJA mera → primenjuje se samo ako blaže nisu dovoljne

**Rokovi — KRITIČNO:**
- **Žalba na rešenje o pritvoru:** 3 dana od dostavljanja rešenja (čl. 214 st. 4 ZKP)
- **Žalba na rešenje o zadržavanju:** 4 sata od usmenog saopštenja rešenja (čl. 294 st. 3 ZKP)

### 4.8 PRIVATNA TUŽBA (čl. 65 ZKP + čl. 170–173 KZ)

```
[SUDU]

PRIVATNI TUŽILAC (OŠTEĆENI): [Podaci]
OKRIVLJENI: [Podaci]

              PRIVATNA TUŽBA
              radi: krivičnog dela [uvreda/kleveta] iz čl. [170/171] KZ

[Činjenični opis]
[Pravna kvalifikacija — obavezno citirati čl. 170 ili 171 KZ]
[Dokazni predlozi]
[Predlog sankcije]

[Mesto], [Datum]
                              adv. [Ime]
```

**Rok podnošenja:** 3 meseca od saznanja za delo i učinioca (čl. 65 st. 2 ZKP)
**Osnov:** čl. 170 KZ (uvreda), čl. 171 KZ (kleveta), čl. 172 KZ (iznošenje ličnih i porodičnih prilika), čl. 173 KZ (povreda ugleda zbog rasne pripadnosti)


### 4.9 PRIGOVOR NA OPTUŽNI PREDLOG (čl. 500 ZKP) — SKRAĆENI POSTUPAK

```
[SUDU]
Na br. K-___/____

OKRIVLJENI:  [Podaci], koga brani adv. [Ime]:

              PRIGOVOR
              NA OPTUŽNI PREDLOG
              [N] primeraka

Na osnovu čl. 500 st. 1 ZKP branilac okrivljenog adv. [Ime] u zakonom
ostavljenom roku od 8 dana izjavljuje

              Prigovor

Protiv Optužnog predloga [OJT] Kt br. ___ od ___.___.____. godine,
te predlažem da sud ovaj Prigovor usvoji i pobijani Optužni predlog
odbaci u celosti na osnovu čl. 500 st. 5 ZKP, ili ga vrati tužiocu
na dopunu.

              Obrazloženje

[„Jedna stvar" → detaljno obrazloženje]

Razlozi za odbacivanje:
1. Nema osnovane sumnje da je okrivljeni učinio krivično delo
2. Krivično delo nije predviđeno zakonom kao krivično delo
3. Nastupila je zastarelost ili druga okolnost koja isključuje gonjenje
4. [drugi razlozi]

Shodno svemu navedenom, predlažemo da sudija odbaci Optužni predlog
na osnovu čl. 500 st. 5 ZKP.

[Mesto], [Datum]
                              adv. [Ime]
```

**Rok:** 8 dana od dostavljanja optužnog predloga (čl. 500 st. 3 ZKP)
**Razlika od odgovora na optužnicu:** Prigovor na optužni predlog postoji SAMO u skraćenom postupku (do 8 godina zatvora kao zaprećena kazna). O njemu odlučuje sudija pojedinac, ne veće.

### 4.10 ŽALBA NA REŠENJE O ODBAČAJU KRIVIČNE PRIJAVE (čl. 51 ZKP)

```
[VIŠEM JAVNOM TUŽILAŠTVU U ___]
putem
[OJT ___]

OŠTEĆENI:  [Podaci], koga po punomoći zastupa adv. [Ime]:

              PRIGOVOR
              NA REŠENJE O ODBAČAJU KRIVIČNE PRIJAVE
              [N] primeraka, [N] priloga

Na osnovu čl. 51 st. 2 ZKP oštećeni preko punomoćnika u zakonom
ostavljenom roku od 8 dana izjavljuje

              Prigovor

Protiv Rešenja [OJT ___] Kt br. ___ od ___.___.____. godine, kojim
je odbačena krivična prijava [broj, datum] podneta protiv osumnjičenog
[Ime] za krivično delo [naziv] iz čl. ___ KZ.

              Obrazloženje

[Detaljno — zašto je odbačaj nepravilan:
 - dokazi koji nisu razmotreni
 - logičke greške u obrazloženju
 - pogrešna pravna kvalifikacija
 - nedovoljno ispitan događaj]

Predlažem Višem javnom tužilaštvu da usvoji ovaj Prigovor, ukine
pobijano Rešenje o odbačaju, i naloži OJT-u da nastavi sa krivičnim
gonjenjem u skladu sa čl. 51 st. 3 ZKP.

[Mesto], [Datum]
                              adv. [Ime]
```

**Rok:** 8 dana od dostavljanja rešenja (čl. 51 st. 2 ZKP)
**Važno:** Ako VJT odbije prigovor, oštećeni može preuzeti krivično gonjenje kao supsidijarni tužilac (čl. 52 ZKP), u roku od 8 dana od obaveštenja.

### 4.11 SPORAZUM O PRIZNANJU KRIVIČNOG DELA (čl. 313–319 ZKP)

```
[OSNOVNOM/VIŠEM JAVNOM TUŽILAŠTVU]
[ili: SUDU, ako je predmet već pred sudom]

OKRIVLJENI:  [Podaci], koga brani adv. [Ime]:

              PREDLOG ZA ZAKLJUČENJE
              SPORAZUMA O PRIZNANJU KRIVIČNOG DELA
              u smislu čl. 313–319 ZKP

Branilac okrivljenog adv. [Ime], na osnovu čl. 314 st. 2 ZKP, predlaže
zaključenje sporazuma o priznanju krivičnog dela pod sledećim uslovima:

              PREDMET SPORAZUMA

1. Okrivljeni priznaje izvršenje krivičnog dela [naziv] iz čl. ___ KZ,
   kako je opisano u [optužnici/optužnom predlogu/krivičnoj prijavi]
   br. ___ od ___.___.____. godine.

2. Za priznato delo, okrivljeni pristaje na:
   - kaznu [vrsta i visina]
   - [eventualno: mera bezbednosti, imovinskopravni zahtev]
   - naknadu troškova postupka

3. Okrivljeni se odriče prava na žalbu u skladu sa čl. 319 st. 3 ZKP.

              OBRAZLOŽENJE

[Zašto je sporazum u interesu okrivljenog:
 - priznavanjem se ostvaruje olakšavajuća okolnost
 - izbegavanje rizika strože kazne nakon glavnog pretresa
 - procesna ekonomija]

              PREDLOG

Predlažemo zaključenje sporazuma po navedenim uslovima, uz predlog
da se izrečena kazna izrekne u donjoj granici zaprećene kazne za
krivično delo iz čl. ___ KZ, imajući u vidu sve olakšavajuće
okolnosti.

[Mesto], [Datum]
                              adv. [Ime]
```

**OGRANIČENJA (čl. 313 st. 2 ZKP):**
- Sporazum se može zaključiti za sva krivična dela
- Sud ispituje zakonitost i valjanost sporazuma
- Nema žalbe (čl. 319 st. 3 ZKP), osim u izuzetnim slučajevima

**STRATEŠKA NAPOMENA:** Sporazum se ne predlaže bez eksplicitne instrukcije klijenta. Odluka o priznanju je krajnje lična i mora biti doneta uz potpuno obaveštavanje o posledicama.

### 4.12 PREDLOG ZA PONAVLJANJE KRIVIČNOG POSTUPKA (čl. 470–479 ZKP)

```
[SUDU KOJI JE DONEO PRAVNOSNAŽNU PRESUDU]
Na br. K-___/____

OKRIVLJENI:  [Podaci], koga po punomoći brani adv. [Ime]:

              PREDLOG
              ZA PONAVLJANJE KRIVIČNOG POSTUPKA
              [N] primeraka, [N] priloga + punomoć

Na osnovu čl. 470 ZKP u vezi sa čl. 473 ZKP, osuđeni preko branioca
podnosi Predlog za ponavljanje krivičnog postupka koji je pravnosnažno
okončan Presudom [sud] br. ___ od ___.___.____. godine.

              RAZLOG ZA PONAVLJANJE

[Izbor jednog ili više razloga iz čl. 473 ZKP:]

1. Nove činjenice i novi dokazi (čl. 473 st. 1 tač. 3 ZKP)
   [Opis novih činjenica i dokaza koji nisu bili poznati u vreme
    ranije odluke]

2. Lažan iskaz svedoka/veštaka (čl. 473 st. 1 tač. 1 ZKP)
   [Opis + pravnosnažna presuda kojom je utvrđen lažan iskaz]

3. Falsifikovana isprava (čl. 473 st. 1 tač. 2 ZKP)
   [Opis + pravnosnažna presuda o falsifikatu]

4. Krivično delo sudije ili tužioca (čl. 473 st. 1 tač. 4 ZKP)

              OBRAZLOŽENJE

[Detaljno obrazloženje novog dokaza / nove činjenice i zašto
 bi dovela do drugačije odluke]

Shodno navedenom, predlažem da sud na osnovu čl. 477 ZKP usvoji ovaj
Predlog i dozvoli ponavljanje krivičnog postupka okončanog Presudom
br. ___ od ___.___.____. godine.

[Mesto], [Datum]
                              adv. [Ime]
```

**Rok:** Nema formalnog roka — može se podneti do nastupanja zastarelosti izvršenja kazne (čl. 470 st. 3 ZKP).
**Posledica usvojenog predloga:** Postupak se vraća u stanje glavnog pretresa.

### 4.13 USTAVNA ŽALBA (čl. 170 Ustava + čl. 82 ZUS)

```
USTAVNOM SUDU REPUBLIKE SRBIJE

PODNOSILAC USTAVNE ŽALBE:
[Podaci okrivljenog], koga po punomoći u spisima zastupa adv. [Ime]:

              USTAVNA ŽALBA
              [N] primeraka, [N] priloga + punomoć

Na osnovu čl. 170 Ustava Republike Srbije i čl. 82 Zakona o Ustavnom
sudu, podnosilac Ustavne žalbe preko punomoćnika u zakonom ostavljenom
roku od 30 dana podnosi

              Ustavnu žalbu

Protiv:
- Presude [prvostepeni sud] K-___/___ od ___.___._____. godine,
- Presude [drugostepeni sud] Kž1-___/___ od ___.___._____. godine,
- [eventualno] Odluke Vrhovnog suda Kzz-___/___ od ___.___._____. godine

Povreda ustavnih prava:
- čl. 32 Ustava — pravo na pravično suđenje
- čl. 33 Ustava — pretpostavka nevinosti
- čl. 34 Ustava — posebna prava okrivljenog
- čl. 46 Ustava — sloboda mišljenja i izražavanja [ako je relevantno]
- [drugi povređeni članovi]

U vezi sa:
- čl. 6 EKLJP — pravo na pravično suđenje
- čl. 7 EKLJP — nema kazne bez zakona
- čl. 10 EKLJP — sloboda izražavanja [ako je relevantno]

              OBRAZLOŽENJE

I  PRETHODNO IZVRŠENJE DOMAĆIH PRAVNIH LEKOVA

[Hronološki pregled svih lekova koji su iscrpljeni — OBAVEZNO
 po čl. 82 st. 1 ZUS]

II  „JEDNA STVAR" — POVREDA USTAVNOG PRAVA

[Ključan argument — 2–3 pasusa]

III  DETALJNO PO POVREĐENIM PRAVIMA

[Numerisano po članovima Ustava i EKLJP]

IV  PRAKSA USTAVNOG SUDA I ESLJP

[Citati relevantnih odluka US i ESLJP — uvek verifikovano kroz
 istrazivanje-prakse, nikad iz memorije]

              PREDLOG

Predlažemo da Ustavni sud usvoji ovu Ustavnu žalbu, utvrdi povredu
[navedenog ustavnog prava], poništi pobijane odluke i vrati predmet
na ponovno odlučivanje.

[Mesto], [Datum]
                              adv. [Ime]
```

**Rok:** 30 dana od prijema pravnosnažne odluke (čl. 84 ZUS)
**USLOV:** Prethodno iscrpljeni svi delotvorni pravni lekovi (čl. 82 st. 1 ZUS)
**VAŽNO:** Ustavna žalba je preduslov za predstavku ESLJP.

### 4.14 PREDSTAVKA EVROPSKOM SUDU ZA LJUDSKA PRAVA (čl. 34 EKLJP)

```
EUROPEAN COURT OF HUMAN RIGHTS
Council of Europe
F-67075 Strasbourg Cedex, France

APPLICATION UNDER ARTICLE 34 OF THE EUROPEAN CONVENTION
ON HUMAN RIGHTS

I. THE PARTIES
   A. THE APPLICANT
      [Full name, date of birth, nationality, address]
      Represented by: adv. [Name], [Address]
      
   B. THE HIGH CONTRACTING PARTY
      Republic of Serbia

II. STATEMENT OF THE FACTS
    [Chronological, factual, neutral tone — max 2 pages]

III. STATEMENT OF ALLEGED VIOLATIONS OF THE CONVENTION
    Article [X] — [right]
    [Brief description of violation]

IV. STATEMENT RELATIVE TO ARTICLE 35 § 1 OF THE CONVENTION
    A. Final decision
       [Decision of the Constitutional Court — number, date, date of receipt]
    B. Other decisions
       [List of all decisions in chronological order]
    C. Other international procedures
       [Whether the matter is before another international body]

V. STATEMENT OF THE OBJECT OF THE APPLICATION
   [What the applicant wants the Court to rule]

VI. ANNEXES
    [List of all documents attached]

Date: [Date]                Signature: [adv. Name]
```

**NAPOMENA:** Predstavka ESLJP se podnosi na engleskom ili francuskom (izuzetno na srpskom za prvu fazu). Sadržaj je prema Rules of Court, Rule 47. **Obavezno koristiti zvanični Application Form sa hudoc.echr.coe.int**.

**Rok:** 4 meseca od finalne domaće odluke (za slučajeve nastale posle 1.2.2022); 6 meseci za ranije (čl. 35 § 1 EKLJP)

**USLOVI (čl. 35 EKLJP):**
- Iscrpljeni svi domaći pravni lekovi (uključujući ustavnu žalbu)
- Predstavka nije anonimna
- Isti predmet nije razmatran pre toga od strane ESLJP
- Predstavka nije očigledno neosnovana

---

## Korak 5 — Imovinskopravni zahtev u krivičnom postupku (čl. 252–260 ZKP)

Odbrana se mora izjasniti o imovinskopravnom zahtevu oštećenog — to nije opciono.

### 5.1 Scenariji

| Situacija | Strategija odbrane |
|---|---|
| Oštećeni podneo IPZ uz krivičnu prijavu | Osporiti postojanje štete ili visinu, predložiti upuštanje na parnicu (čl. 258 st. 3 ZKP) |
| Oštećeni podneo IPZ tek na glavnom pretresu | Insistirati na upuštanju na parnicu — krivični postupak nije mesto za dokazivanje visine štete |
| Nema IPZ-a | Ništa se ne radi, ali se prati da tužilac ne „provuče" kroz obrazloženje |
| Oslobađajuća presuda | Sud MORA uputiti oštećenog na parnicu (čl. 258 st. 3 ZKP) |

### 5.2 Formula za izjašnjenje odbrane

```
O imovinskopravnom zahtevu oštećenog [Ime], koji [opis zahteva]:

Odbrana osporava osnovanost i visinu postavljenog imovinskopravnog
zahteva. Predlažemo da sud, u skladu sa čl. 258 st. 3 ZKP, oštećenog
uputi na parnicu radi ostvarivanja imovinskopravnog zahteva, imajući
u vidu da utvrđivanje svih relevantnih činjenica za osnovanost i
visinu štete prevazilazi okvir krivičnog postupka.
```

### 5.3 Rizik koji se ne sme propustiti

Ako sud odluči o IPZ-u u krivičnom postupku, ta odluka postaje deo presude i podleže istim pravnim lekovima. **Propustiti da se izjasni o IPZ-u = propustiti i osnov žalbe** (čl. 437 st. 1 tač. 4 — odluka o drugim odlukama).

---

## Korak 6 — Troškovnik po Advokatskoj tarifi (krivica)

### 6.1 Obavezna pretraga

Pre svakog generisanja troškovnika — pretraži važeću Advokatsku tarifu kroz `istrazivanje-prakse`:
- `site:aks.org.rs tarifa tarifni broj [tekuća godina]`
- Potvrditi vrednost poena i tarifne brojeve za krivicu

### 6.2 Relevantni tarifni brojevi za krivicu (AT)

| Tar. br. | Opis | Okvir |
|---|---|---|
| Tar. br. 1 | Sastav podneska u kriv. postupku | Po zaprećenoj kazni |
| Tar. br. 2 | Odbrana na glavnom pretresu | Po zaprećenoj kazni |
| Tar. br. 3 | Sastav žalbe / odgovora na žalbu | Dvostruko od Tar. br. 1 |
| Tar. br. 4 | Sastav ZZZ / predstavke / ustavne žalbe | Trostruko od Tar. br. 1 |
| Tar. br. 5 | Pretres, saslušanje, uviđaj | Po satu/radnji |
| Tar. br. 6 | Konsultacije i studiranje spisa | Po satu |
| Tar. br. 7 | Putni troškovi i odsustvo iz kancelarije | Stvarni troškovi + naknada |

> ⚠️ Tarifni brojevi i njihov sadržaj se menjaju. **Uvek proveriti aktuelnu tarifu** pre svake izrade troškovnika. Nikad iz memorije.

### 6.3 Formula troškovnika na kraju akta

```
                      T R O Š K O V N I K

1. Sastav ove [naziv akta] po Tar. br. [X]        ....... [iznos],00 din.
2. [drugi tar. brojevi po potrebi]                ....... [iznos],00 din.
3. [event. putni troškovi]                        ....... [iznos],00 din.
                                                  ──────────────────
UKUPNO:                                                   [iznos],00 din.

Obrazloženje: Obračun je sačinjen primenom Advokatske tarife
             („Sl. glasnik RS", br. [___]).
```

Detaljno: `references/trashkovnik-krivica.md`

---

## Korak 7 — Pravila stila (stil Mišić / Nedeljkov)

> ℹ️ **Ova sekcija je namerno zadržana u krivica skill-u** (na zahtev korisnika). Nije delegirana u zajednički `references/stil-misic.md`.

### 7.1 JEZIK I PISMO
- **Ćirilica** — osnovno pismo za sve akte
- Poslovna imena, strane reči i specifični termini → latinica dozvoljena
- Načela na latinici: „in dubio pro reo", „reformatio in peius"
- Skraćenice: okr. = okrivljeni, mlt. = maloletna, kriv. = krivično

### 7.2 RETORIČKI STIL
- **Direktan, odlučan, borben** — nikad pasivan ili neodlučan
- **Kapslovanje** (VELIKA SLOVA) za ključne tvrdnje odbrane:
  - „VEĆ GOTOVO NIŠTA NIJE POTVRDILA"
  - „NE MOŽE SE ISKLJUČITI MOGUĆNOST DA DOGAĐAJ NIJE REALNO ZASNOVAN"
  - „ŠTETE ZA FOND NE POSTOJI"
- **Doslovno citiranje** zapisnika i nalaza — u navodnicima „..."
- **DOKAZ:** posle svake činjenične tvrdnje, kurzivom, uvučeno tabulatorom
  - Format: `DOKAZ:	[Naziv dokumenta], str. [X], pasus [Y]`
- **Retorička pitanja** za efekat:
  - „Odakle okr. Bosniću takve telesne povrede...?!"
  - „Odakle Tužilaštvu sloboda da...?"
- **„Da pojasnim"** / „Da pojasnimo" — tranziciona fraza
- **„Naime,"** — najčešća uvodna reč za argument
- **„Stoga,"** / „Shodno svemu navedenom," — za zaključke
- **„Štaviše,"** — za pojačavanje argumenta
- **„Potpuno je neshvatljivo"** / „Pravni nonsens" — za apsurdne sudske stavove

### 7.3 STRUKTURA ARGUMENTACIJE
- **„Jedna stvar" ide PRVA** — ne kriti je za kraj
- **Numeracija:** 1., 2., 3. ili _____ linijama razdvajaju
- **Horizontalna linija** `_______________` odvaja celine
- **Rezime na kraju** — ponavljanje ključnih argumenata
- **Predlog sudu** uvek na kraju — jasan, konkretan

### 7.4 FORMALNOSTI
- **Obraćanje:** „Poštovana predsednice i članovi (sudskog) veća,"
- **Potpis:** desno poravnato — „adv. Milan Mišić" ili „adv. Đorđe Nedeljkov"
- **Mesto i datum:** levo — „Novi Sad," / „dana ___.___.____. godine"
- **Broj primeraka:** uvek naveden ispod naslova akta
- **Punomoć:** „koga po punomoći u spisima brani adv. [Ime]"

### 7.5 PRAVNA TEHNIKA
- **Čl. 16 ZKP** — in dubio pro reo: uvek insistirati ako nema dokaza van razumne sumnje
- **Čl. 84 ZKP** — nedozvoljeni dokazi: „plodovi otrovnog drveta"
- **Čl. 438 ZKP** — bitne povrede postupka: nerazumljiva izreka, kontradiktornost
- **Čl. 439 ZKP** — povreda krivičnog zakona: pogrešna pravna kvalifikacija
- **EKLJP čl. 6** — pravično suđenje
- **EKLJP čl. 7** — nema kazne bez zakona
- **Ustavna prava** — čl. 32, 33, 34 Ustava (pretpostavka nevinosti, prava okr.)

### ❌ ZABRANJENO
- Pasivno ili neodlučno izražavanje
- Pisanje u korist tužilaštva
- Izmišljanje sudske prakse ili brojeva odluka
- Izostavljanje DOKAZ: posle činjeničnih tvrdnji
- Latinica u telu teksta (osim za imena i pravne termine)
- Dugi direktni citati (>15 reči) bez atribucije i linka

---

## Korak 8 — P1/P2/P3/P4 klasifikacija tvrdnji u krivičnom aktu

**U svakom krivičnom aktu svaka činjenična tvrdnja mora biti klasifikovana:**

| Klasa | Značenje | Kako pisati |
|---|---|---|
| ✅ **P1** | Direktno dokazano dokumentom (stranica, pasus) | Bez ograda. „Okrivljeni je dana X.Y.Z. ..." + DOKAZ |
| 🟡 **P2** | Razumno izvedeno iz više dokaza | „Iz izvedenih dokaza proizlazi da..." |
| 🔴 **P3** | Tvrdnja odbrane bez direktnog dokaza | „Odbrana tvrdi da..." ili „Predlog odbrane je da..." |
| ⛔ **P4** | Neverifikovano / moguća halucinacija | **NIKAD ne ulazi u dokument** |

### 8.1 Pravilo prelaska

- Nijedan P3 ne sme biti prikriven kao P1. Svaka tvrdnja odbrane mora biti eksplicitno markirana kao tvrdnja odbrane.
- Ako se u toku pisanja ispostavi da je nešto P4 (npr. citat odluke VS koji ne mogu verifikovati) — **STOP, ne ugrađuj**, pošalji u `istrazivanje-prakse` za verifikaciju.

### 8.2 Razlog

Krivični postupak je prostor gde pretpostavka nevinosti (čl. 34 Ustava) znači da odbrana NE MORA da dokazuje — ali takođe znači da se ne sme pretvarati da dokaz postoji ako ne postoji. Prikriven P3 u obliku P1 je rizik za kredibilitet branioca kod suda i rizik od disciplinske odgovornosti.

---

## Korak 9 — Generisanje .docx fajla

Uvek pročitati `docx` skill pre generisanja. Koristiti Node.js sa `docx` bibliotekom i `Packer.toBuffer()`.

```javascript
// Font: Times New Roman, 12pt
// Page: A4 (11906 x 16838 DXA)
// Margins: top/right/bottom/left = 1440 DXA (2,54 cm)
// Encoding: Unicode (UTF-8 — ćirilica)
// Line spacing: 1.15
```

| Element | Formating |
|---|---|
| Naziv suda | Bold, left (ne center) |
| „putem" | Normal, left |
| Na br. | Normal, left |
| OKRIVLJENI labela | Bold, left, tab-aligned |
| Naziv akta (ŽALBA itd.) | Bold, caps, center, razmaknuta slova |
| Primerci/prilozi | Normal, center |
| Uvodna formulacija | Normal, justify |
| „Žalbu" / „Zahtev" | Bold, center |
| „Zbog:" lista | Normal, left, numerisano |
| Predlog sudu | Normal, justify |
| OBRAZLOŽENJE | Bold, caps, center |
| Telo | Normal, justify, 1.15 spacing |
| DOKAZ: | Italic, tab indent (720 DXA) |
| Horizontalna linija | ___ (70 znakova) |
| PREDLOG / REZIME | Bold, left ili center |
| Potpis | Right-aligned |
| Troškovnik | Normal, numerisano |

**Validacija:** Svaki generisani .docx MORA proći kroz `validate.py` pre dostavljanja korisniku (iz projektnih instrukcija).

**Imenovanje fajla:** Po korisničkoj preferenci:
`[stranka] [protivnastranka] [tippodneska] [kratakopis].docx` — bez dijakritika, bez podvlake, malim slovima.

---

## Korak 10 — Compliance izveštaj (krivica mini)

**OBAVEZAN posle svakog generisanog krivičnog akta.** Dodaje se ISPOD pravna-analiza compliance izveštaja.

```
╔═══════════════════════════════════════════════════════════════╗
║ ⚖️ COMPLIANCE IZVEŠTAJ — KRIVICA v2                          ║
╠═══════════════════════════════════════════════════════════════╣
║ PREDMET: [naziv/broj]                                        ║
║ OKRIVLJENI: [ime]                                              ║
║ TIP AKTA: [#N iz Koraka 0.1]                                 ║
║ SUD/TUŽILAŠTVO: [naziv]                                      ║
╠═══════════════════════════════════════════════════════════════╣
║ KORAK │ STATUS  │ KLJUČNI IZLAZ                              ║
║───────┼─────────┼───────────────────────────────────────────║
║ K0    │ ✅/⛔   │ Handoff: [primljen/nema/nepotpun]          ║
║ K0.1  │ ✅      │ Klasifikacija: tip #[N]                    ║
║ K1.2  │ ✅      │ Rok: [N] dana, preostalo [M]              ║
║ K1.3  │ ✅      │ Rok-alarm: 🟢/🟡/🔴/⛔                    ║
║ K2    │ ✅/⏭️   │ Reverse-eng: [N] diskrepancija            ║
║ K3    │ ✅/⛔   │ istrazivanje-prakse: [aktiviran/nije]    ║
║       │         │ Odluke pronađene: [N], verifikovane: [M]   ║
║ K4    │ ✅      │ Šablon: [4.X]                              ║
║ K4a   │ ✅      │ „Jedna stvar" u prvih 3 pasusa: [da/ne]   ║
║ K5    │ ✅/⏭️   │ IPZ izjašnjenje: [urađeno/nije potrebno]    ║
║ K6    │ ✅/⏭️   │ Troškovnik: [iznos] ili [preskočeno]      ║
║ K7    │ ✅      │ Stil Mišić/Nedeljkov: [primenljen]          ║
║ K8    │ ✅      │ P1: [N] / P2: [N] / P3: [N] / P4: [0]    ║
║ K9    │ ✅      │ .docx generisan: [putanja] + validate.py   ║
╠═══════════════════════════════════════════════════════════════╣
║ ✅ ČEKLISTA:                                                 ║
║  [ ] Tip akta pravilno određen                              ║
║  [ ] istrazivanje-prakse delegacija izvršena                ║
║  [ ] Svaka citirana odluka sa linkom/tekstom                 ║
║  [ ] Pravni osnov tačno naveden                              ║
║  [ ] Rok ispoštovan                                          ║
║  [ ] Svaki činjenični navod ima DOKAZ:                       ║
║  [ ] Nijedan P4 u dokumentu                                 ║
║  [ ] Svi P3 eksplicitno markirani kao tvrdnja odbrane       ║
║  [ ] „Jedna stvar" u prvih 3 pasusa                         ║
║  [ ] Predlog sudu jasan i konkretan                          ║
║  [ ] Ćirilica kroz ceo akt                                  ║
║  [ ] Potpis, mesto, datum                                    ║
║  [ ] Akt piše sa strane odbrane                              ║
║  [ ] .docx validiran                                         ║
║  [ ] verifikator aktiviran za DIFF                           ║
╠═══════════════════════════════════════════════════════════════╣
║ ⚠️ ZA RUČNU PROVERU (Milan):                                ║
║  [1] [tvrdnja/broj/citat] → [stranica izvora]                ║
║  [2] ...                                                      ║
║  [3] ...                                                      ║
╚═══════════════════════════════════════════════════════════════╝
```

**Pravila:**
1. Izveštaj je **OBAVEZAN** — bez izuzetka.
2. Ako K3 status = ⛔ — dokument se **NE ŠALJE** korisniku. Prvo se rešava.
3. Ako ima P4 u dokumentu — dokument se **NE ŠALJE**. Vraća se na K8.
4. „Za ručnu proveru" mora da ima minimum 3 stavke — one koje su najrizičnije ili najvažnije.

---

## Korak 11 — Predaja u `verifikator`

Pre nego što dokument ide korisniku, prošao kroz:

```
krivica → verifikator → korisnik

Šta verifikator dobija:
├── Generisan .docx (putanja)
├── Compliance izveštaj krivica
├── Compliance izveštaj pravna-analiza
├── Handoff paket (original)
├── Lista citiranih odluka
└── Lista činjeničnih tvrdnji sa izvorima
```

Verifikator vrši:
1. **PROTOKOL A** — DIFF svake činjenične tvrdnje protiv originalnog dokumenta
2. **PROTOKOL B** — verifikacija svih brojeva (datumi, iznosi, članovi zakona)
3. **Spot-check lista** — 3 stavke koje korisnik ručno proverava

**Ako verifikator vrati ❌ na bilo šta — dokument se popravlja pre dostavljanja.**

---

## REFERENTNI FAJLOVI

| Fajl | Sadržaj |
|---|---|
| `references/handoff-protokol.md` | Detaljan protokol prijema handoff-a od pravna-analiza |
| `references/rokovi-tabela.md` | Kompletna tabela rokova + kalkulacija + izuzeci |
| `references/tipovi-greshaka-presude.md` | Matrica povreda čl. 438/439/440/441 ZKP |
| `references/esljp-krivica.md` | Ključni ESLJP slučajevi (SKELET — puniti kroz istrazivanje-prakse) |
| `references/shabloni-unakrsno.md` | Šabloni pitanja za unakrsno ispitivanje po delima |
| `references/trashkovnik-krivica.md` | Obračun troškova odbrane po AT |
| `references/compliance-krivica.md` | Format mini compliance izveštaja |
| `references/sudska-praksa-vks.md` | POSTOJEĆI — proširuje se kroz istrazivanje-prakse |
| **`references/sabloni/`** | **KOMPOZICIONI ŠABLONI AKATA (NOVO v3.0.0 — iz korpusa 2022-2026)** |
| &nbsp;&nbsp;├─ `01_krivicna_prijava.md` | Krivična prijava (sa/bez privremene mere) |
| &nbsp;&nbsp;├─ `02_prigovor_odbacaj_kp.md` | Prigovor na odbačaj KP (Vuković Benz model) |
| &nbsp;&nbsp;├─ `03_zalba_na_resenje.md` | Žalba na rešenje (Kalentić model) |
| &nbsp;&nbsp;├─ `04_zalba_na_presudu_krivica.md` | Žalba na presudu (čl. 432, 437 ZKP) |
| &nbsp;&nbsp;├─ `05_odgovor_na_optuznicu.md` | Odgovor na optužnicu / prigovor na optužni predlog |
| &nbsp;&nbsp;├─ `06_zzz.md` ⭐ | **Zahtev za zaštitu zakonitosti (Vrhovni sud — Vuković model)** |
| &nbsp;&nbsp;├─ `07_molba_odlaganje.md` | Molba za odlaganje krivičnog gonjenja (Juškić model) |
| &nbsp;&nbsp;├─ `08_predstavka_esljp.md` | Predstavka ESLJP (Strasbur) |
| &nbsp;&nbsp;└─ `09_ustavna_zalba.md` | Ustavna žalba (Ustavni sud RS) |

**⚠️ Kritično pravilo za šablone:** Pre pisanja akta, **OBAVEZNO** otvori odgovarajući šablon. Šablon sadrži:
- Kada se koristi + rok + nadležnost
- Terminologiju (OKRIVLJENI/OSUMNJIČENI/OSUĐENI po fazi)
- Matricu potpisa (Milan / Đorđe / oba)
- Tarifu iz korpusa
- Kompletan mock-up sa primenjenom tipografijom
- Checklist pre isporuke

Šablon **ne zamenjuje** `pravna-analiza` — niti handoff. On je finalna **kompoziciona struktura** posle analize.

---

## ZABRANJENO (apsolutno, bez izuzetka)

1. **Aktivirati se samostalno ako postoji dokument za analizu** — prvo pravna-analiza.
2. **Samostalno pretraživati praksu** — uvek delegacija u istrazivanje-prakse.
3. **Citirati sudsku praksu ili ESLJP iz memorije** — verifikacija kroz istraživanje-prakse.
4. **Pisati akt bez „Jedne stvari"** u prvih 3 pasusa.
5. **Prikrivati P3 kao P1** — svaka tvrdnja odbrane mora biti markirana.
6. **Staviti bilo šta označeno P4** u dokument.
7. **Zaobilaziti verifikator** — pre dostavljanja korisniku.
8. **Zaobilaziti compliance izveštaj** — bez njega skill nije primenjen.
9. **Pisati u korist tužilaštva**.
10. **Izmišljati članove zakona, brojeve odluka, datume, imena.**
11. **Generisati akt bez eksplicitnog zelenog svetla korisnika** („idi" / „generiši" / „kreni").

---

## ⛔ ZAVRŠNA INSTRUKCIJA

**krivica v2 je deo stack-a, ne samostalni alat.**

- Bez `pravna-analiza` → radi, ali na falbek režimu, uz upozorenje.
- Bez `istrazivanje-prakse` → **STAJE**. Nema prakse = nema akta.
- Bez `verifikator` → **STAJE**. Nema DIFF-a = nema dostavljanja.
- Bez `god-skill-deep-reader` u pozadini → smanjen kvalitet čitanja.

**Kvalitet je uvek ispred brzine.** Ako je rok blizak a fallback-ovi ne rade — javi Milanu i čekaj odluku. Nikad tiho rešavati.


### 3.4 Protokol ugradnje verifikovanih ESLJP predmeta u krivični akt

**Ovaj protokol se primenjuje kad god `krivica` ugrađuje ESLJP praksu u akt.**

#### A) Uslov za ugradnju

Samo predmeti iz `esljp-krivica.md` sekcija VII sa statusom ✅ VERIFIKOVANO.
Ako predmet ima status ⛔ → ne ugrađivati, ne citirati, ne pominjati.

#### B) Format citata u aktu

```
ESLJP, [Predmet] protiv [Države], predstavka br. [XXXXX/XX],
presuda od [datum], §[N].
```

Za ZLATNI LANAC (čl. 170/171 KZ — uvreda/kleveta):
1. Prvo Lingens v. Austria (9815/82, §46) — temelj razlikovanja činj./vred.
2. Zatim Feldek v. Slovakia (29032/95, §86) — razvoj: činj. osnova ne mora biti eksplicitna
3. Zakucati Bodrožić v. Serbia (32550/05, §52) — PRESUDA PROTIV SRBIJE
   ⚠️ NIKADA 38435/05 (to je Bodrožić i Vujin — zaseban predmet!)

#### V) Gde u aktu stoji ESLJP praksa

- U žalbi/ZZZ: posle pravne argumentacije, pre predloga sudu
- U odgovoru na optužnicu: u pravnom delu obrazloženja
- U ustavnoj žalbi: posebna sekcija IV (videti šablon 4.13)
- U predstavci ESLJP: sekcija III (Statement of Alleged Violations)

#### G) Pravilo paragrafnog reference

Nikad citirati „ESLJP je rekao da..." bez paragrafa (§N).
Paragraf je verifikovan u odgovarajućem .docx fajlu.
Ako §N nije u .docx-u → NE citirati, vratiti se na istrazivanje-prakse.

Detaljno: `references/bodrozic-lanac.md`
