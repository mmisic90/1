---
name: istrazivanje-prakse
description: >
  Četvrti skill u steku advokatske prakse — operativni protokol za
  istraživanje sudske prakse i pravnih izvora. Aktiviraj čim pravni
  zadatak zahteva pretragu odluka, verifikaciju normi, ili pronalaženje
  ESLJP prakse. Trigeri: „nađi praksu za čl. X", „ima li odluka o…",
  „proveri da li postoji praksa", „verifikuj član", „nađi mi odluku",
  ili kad pravna-analiza F3 / krivica / tuzba-parnica treba pravne
  izvore. Verifikator se aktivira POSLE ovog skill-a ako rezultat
  ulazi u pravni dokument. NE aktivirati za: opšta pravna pitanja gde
  je odgovor direktno u zakonu, akademska pravna teorija, knjižice,
  Instagram, tehnički debugging.
metadata:
  author: "Milan Mišić, advokat"
  version: "6.2.0"
  depends-on: []
  composes-with: ["pravna-analiza", "krivica", "tuzba-parnica", "verifikator"]
  category: "legal-research"
  last-updated: "2026-05-31"
  changelog-v6.2: >
    Ugradnja 3 dodatka iz istraživanja deep-research mehanizama (anti-misgrounding):
    (1) Mehanizam M-D — verifikacija postojanja citata (HARD STOP): postojanje +
    poklapanje (anti-misgrounding) + primenljivost; broj predmeta/člana ne izlazi
    bez potvrde iz otvorene baze, inače 🔴P3/⛔P4. (2) Temporalna važećost
    proširena van OPS-a na svaku normu i odluku (analog Shepard's/KeyCite).
    (3) Anti-sikofantija na ulazu (SLOJ 1): provera premise, neutralizacija
    „nađi praksu koja podržava X", M-B Reverse Claim postaje obavezan.
    Compliance izveštaj proširen redovima S1/S7. Svih 8 slojeva netaknuto.
---

# Istraživanje Prakse — Operativni Protokol v6

> **Pismo:** instrukcije ovog skila su latinica (token-ekonomija, vidi `_policy/politika-pisma.md`); izlazni pravni akt je uvek ćirilica — kontroliše `stil-pisanja`.

## ⚠️ NEGATIVE TRIGGERS — NE AKTIVIRAJ ZA:

| Kontekst | Zašto ne |
|---|---|
| Opšta pravna pitanja gde je odgovor direktno u zakonu (npr. „koji je rok za žalbu na presudu") | `pravna-analiza` dovoljna — zakon je direktan izvor |
| Akademska pravna teorija („istorija instituta uzufrukta") | Skill je operativan, ne teorijski |
| Korisnik direktno citira odluku i traži mišljenje | `pravna-analiza` + `god-skill` za analizu odluke |
| Knjižice za Relju, Instagram, Cowork debugging | Bez pravnog konteksta |
| Prevod stranog pravnog teksta | Prevod nije istraživanje |

**Kompozabilnost:** Skill se aktivira **iz** `pravna-analiza` F3 (ili direktno od korisnika), poziva se za svaku pravnu tvrdnju koja mora biti verifikovana, i predaje nalaze `verifikator`-u koji proverava tačnost citata i validnost izvora.

---

## FILOZOFIJA

Pravno istraživanje nije pretraga — to je **filtriranje**.

Sistem vraća desetine odluka. Upotrebljivih je 1-3. Posao
istraživača nije da pročita sve — nego da zna **šta da odbaci
bez čitanja**, šta da brzo skenira, i šta da duboko analizira.

Pet principa:

1. **Tip postupka određuje hijerarhiju** — Krivični, parnični,
   privredni i prekršajni postupak imaju različite sudske
   hijerarhije. Pre pretrage — utvrdi tip postupka.

2. **Sentenca je karta, ne odredište** — Paragraf i PropisSoft
   daju sentence svih sudova. Puni tekst dostupan samo za
   Vrhovni sud i PrAS. Za sve ostale — sentenca je maksimum.
   Ne citiraš sentencu — citiraš ratio iz pune presude.

3. **HUDOC je krajnja linija, ne startna** — ESLJP praksa postoji
   na Paragrafu, PropisSoft-u, u domaćim odlukama. HUDOC tek kad
   domaći izvori ne daju ničeg upotrebljivog.

4. **Svaka odluka je osumnjičena do dokaza suprotnog** — Dobra
   sentenca ne znači dobra odluka. Povoljan ratio ne znači da
   odluka ne sadrži rečenicu koja flipuje argument. Nađena
   praksa ne znači da nema suprotne prakse koju moraš da
   prijaviš. Istraživač koji skriva nepogodno nanosi štetu
   klijentu.

5. **Praksa bez izvora ne postoji** — Svaka odluka koju citiraš
   mora imati ili direktan link do izvora ili copy-paste
   kompletnog teksta sa navođenjem odakle je. Bez toga — odluka
   se NE citira u dokumentu. Nikad.

---

## IDENTITET NAJVIŠEG SUDA — OBAVEZNO ZNANJE

```
VSS = VKS = VS = isti sud, tri imena:
  Vrhovni sud Srbije (VSS)         → do 1.1.2010.
  Vrhovni kasacioni sud (VKS)      → 1.1.2010 — 2024.
  Vrhovni sud (VS)                 → od 2024.

AKTIVAN SAJT:  https://www.vrh.sud.rs/
Stari domen:   vk.sud.rs (može redirektovati)

POSLEDICE ZA PRETRAGU:
  Query mora da pokrije SVA TRI imena.
  Pretraga samo po „VKS" → promašuješ VSS odluke.
  Pretraga samo po „Vrhovni sud" → promašuješ VKS odluke.

POSLEDICE ZA CITIRANJE:
  Citiraš imenom suda U VREME DONOŠENJA ODLUKE:
    Odluka iz 2008. → „Vrhovni sud Srbije"
    Odluka iz 2018. → „Vrhovni kasacioni sud"
    Odluka iz 2025. → „Vrhovni sud"
  Nikad: „VKS" za odluku iz 2008.
  Nikad: „Vrhovni sud" za odluku iz 2015.

POSLEDICE ZA HIJERARHIJU:
  Sve tri instance = ✅P1 (isti nivo, isti autoritet).
  Lex posterior: ako VSS 2007. kaže H a VKS 2019. kaže Y
  na isto pitanje → VKS 2019. važi (noviji, isti nivo).
```

---

## ARHITEKTURA: 8 SLOJEVA + 4 MEHANIZMA + ISPORUKA

```
SLOJ 1: DEKONSTRUKCIJA        → tip postupka + šta tražimo
SLOJ 2: REŽIM                 → Discovery ili Verification
SLOJ 3: HIJERARHIJA IZVORA    → zavisi od tipa postupka
SLOJ 4: PRETRAGA              → dve metode, dvostruka baza
SLOJ 5: FILTER SENTENCI       → pravni identitet — hard stop
SLOJ 6: ČITANJE                → zavisi od dostupnosti punog teksta
SLOJ 7: SINTEZA NALAZA        → težina + reverse claim + poison pill
SLOJ 8: FALLBACK CHAIN        → samo ako Sloj 7 = G, max 4 koraka

UGRAĐENI MEHANIZMI:
  M-A: Hard Stop čitanje sentence (Sloj 5)
  M-B: Reverse Claim test (Sloj 7 — za ✅P1 I 🟡P2)
  M-V: Poison Pill sken (Sloj 6 Nivo 2)
  M-G: Adverse Findings + Kontra-pretraga (Sloj 7)

ISPORUKA: Link ili copy-paste — bez izvora nema citata
```

---

## SLOJ 1 — DEKONSTRUKCIJA PITANJA

**Prva stvar: utvrdi tip postupka.** To određuje sve ostalo.

```
╔══════════════════════════════════════════════════════════════╗
║  DEKONSTRUKCIJA: [pravno pitanje u jednoj rečenici]          ║
╠══════════════════════════════════════════════════════════════╣
║  TIP POSTUPKA (odaberi JEDAN):                              ║
║    □ Krivični          → hijerarhija A                      ║
║    □ Parnični          → hijerarhija A                      ║
║    □ Izvršni           → hijerarhija A                      ║
║    □ Privredni         → hijerarhija B                      ║
║    □ Prekršajni        → hijerarhija V                      ║
║    □ Upravni           → hijerarhija G                      ║
║  Hijerarhije → videti Sloj 3                                ║
╠══════════════════════════════════════════════════════════════╣
║  V1 — DIREKTNI:   [član + ključni termin iz dispozicije]    ║
║  V2 — ELEMENTI:   [konstitutivni elementi bez broja člana]  ║
║  V3 — ANALOGNI:   [srodna norma / isti pravni princip]      ║
║  V4 — PROCESNI:   [specifičnost postupka]                   ║
║  V5 — USTAVNI:    [ustavno pravo / EKLJP — samo ako važi]   ║
╠══════════════════════════════════════════════════════════════╣
║  PRIORITET: V1 → našao upotrebljivo → STANI                 ║
║             V2 → V1 dao malo → kombinuj V1+V2              ║
║             V3 → tek ako V1+V2 nisu dovoljni                ║
║             V4/V5 → samo za specifična podpitanja           ║
╚══════════════════════════════════════════════════════════════╝
```

### Vektori po tipu postupka

| Vektor | Krivični | Parnični | Privredni | Prekršajni |
|--------|----------|----------|-----------|------------|
| V1 | član KZ + element bića | član ZOO/ZPP + zahtev | član ZTD/ZOO + zahtev | član propisa + element |
| V2 | elementi bića bez člana | pravna činjenica / posledica | tip privrednog spora | element prekršaja bez člana |
| V3 | srodno delo / isti mens rea | srodan građanski zahtev | srodan privredni institut | srodan prekršaj |
| V4 | tip postupka | redovni/hitni/vanparnični | hitni/obezbeđenje/likvidacija | tip prekršajnog postupka |
| V5 | EKLJP čl. 6/7/8/10 | EKLJP čl. 6/čl. 1 Prot. 1 | EKLJP čl. 6/čl. 1 Prot. 1 | EKLJP čl. 6/čl. 7 |

**V5 nije podrazumevan** — samo kad pravno pitanje direktno
dira u zaštićeno konvencijsko pravo.

### Provera premise — ANTI-SIKOFANTIJA (pre pretrage)

> Empirijski je dokazan okidač greške: zahtev formulisan kao
> „nađi praksu koja podržava X\". Tada model sklizne u traženje
> POTVRDE umesto ISTINE i lakše prihvati slab ili nepostojeći izvor.
> Istraživanje služi predmetu tako što utvrđuje šta praksa STVARNO
> kaže — ne što naručuje unapred željeni ishod.

```
1. Da li zahtev sadrži unapred zadat zaključak koji treba „potvrditi\"?
   („nađi da X\", „dokaži da Y\", „potvrdi da sud uvek…\")
   → DA: preformuliši interno u NEUTRALNO pitanje —
     „šta praksa kaže o X?\" → traži I za i PROTIV (M-B Reverse Claim
     postaje obavezan, ne opcioni).

2. Da li premisa zahteva možda netačna? (npr. „praksa o čl. X\"
   a član X ne reguliše tu materiju / ne postoji)
   → Proveri postojanje i sadržinu člana (PropisSoft) PRE pretrage
     prakse. Netačna premisa → obavesti korisnika, ne pretražuj dalje
     po pogrešnoj premisi (pravilo: ne rešavaj tiho).

3. Dozvoljeni izlaz: „Ne postoji praksa u pouzdanom izvoru koja
   potvrđuje X\" ILI „praksa je suprotna\" su VALIDNI nalazi,
   jednako vredni kao potvrdan. Praznina označena > izmišljena potpora.
```

---

## SLOJ 2 — REŽIM


### Režim pretrage (Discovery / Verification)

```
REŽIM A — DISCOVERY              REŽIM B — VERIFICATION
─────────────────────────────    ──────────────────────────────
Ne znam šta postoji              Znam tačan broj odluke
Počinjem sa Slojem 4              Idem direktno na izvor
Prolazim kroz FILTER             Minimalna provera (videti dole)
Sentence → brojevi → čitanje      Čitanje direktno
                                 Ako ne nađem → ODMAH Sloj 8 K1
```

**Režim B — minimalna provera (obavezna):**
Čak i kad znaš tačan broj — pre čitanja potvrdi da odluka
rešava tvoje pravno pitanje. Kriterijum (binaran): Da li naslov
i prva rečenica obrazloženja pominju isti pravni problem?
DA → Nivo 2. NE → ⛔ + Sloj 8 K1.

### Usklađivanje sa pravna-analiza F0.1 (FULL / STANDARD)

```
AKO JE pravna-analiza U REŽIMU FULL:
  → Istraživanje radi KOMPLETNO (Sloj 1-8, svi mehanizmi)
  → Discovery: dvostruka pretraga, Poison Pill, Reverse Claim,
    kontra-pretraga, Fallback do K4
  → God-skill IQ 200 komponente AKTIVNE (abdukcija, emergencija)

AKO JE pravna-analiza U REŽIMU STANDARD:
  → Istraživanje radi SKRAĆENO:
    Sloj 1 → dekonstrukcija (uvek)
    Sloj 2 → Verification ako znaš broj, Discovery ako ne
    Sloj 3-4 → pretraga (jedna baza dovoljna, ne obavezno dvostruka)
    Sloj 5 → filter (isti — ne skraćuj)
    Sloj 6 → Nivo 1 dovoljan (bez Poison Pill i Reverse Claim)
    Sloj 7 → sinteza bez kontra-pretrage
    Sloj 8 → Fallback maksimum K2 (ne K3/K4)
  → God-skill IQ 200 komponente NEAKTIVNE
  → Compliance izveštaj OBAVEZAN i u STANDARD režimu

AKO KORISNIK DIREKTNO TRAŽI PRAKSU (bez pravna-analiza):
  → Podrazumevano FULL. Ako kaže „brzo nađi" → STANDARD.
```

---

## SLOJ 3 — HIJERARHIJA IZVORA

### Tačno stanje dostupnosti punih odluka

```
IZVOR                          SENTENCE    PUN TEKST
──────────────────────────────────────────────────────
Paragraf.rs                    ✅ svi       ❌
PropisSoft                     ✅ svi       ❌
Vrhovni sud (vrh.sud.rs)       ✅           ✅
PrAS (prekrsajni.sud.rs)       ✅           ✅
Svi ostali sudovi              samo preko   ❌
                               Paragraf/
                               PropisSoft
```

**Posledica:** Za sve sudove osim Vrhovnog suda i PrAS —
maksimum klasifikacije je 🟡P2, bez obzira na kvalitet
sentence. Ne zato što je odluka lošija — nego zato što
ratio decidendi nije verifikovan iz punog teksta.

### Hijerarhija A — Krivični, parnični, izvršni

```
Osnovni sud
    ↓
Viši sud
    ↓
Apelacioni sud  ← sentenca samo (🟡P2 maksimum)
    ↓
Vrhovni sud     ← pun tekst dostupan (✅P1 moguće)
(VSS/VKS/VS — videti IDENTITET NAJVIŠEG SUDA)
```

### Hijerarhija B — Privredni

```
Privredni sud   ← sentenca samo (🟡P2 maksimum)
    ↓
PAS             ← sentenca samo (🟡P2 maksimum)
    ↓
Vrhovni sud     ← pun tekst dostupan (✅P1 moguće)
```

### Hijerarhija V — Prekršajni

```
Prekršajni sud  ← sentenca samo (🟡P2 maksimum)
    ↓
PrAS            ← sentence + pun tekst (✅P1 moguće)
    ↓
Vrhovni sud     ← pun tekst dostupan (✅P1 moguće)
(ZZZ)
```

### Redosled pretrage (zajedničko za sve hijerarhije)

```
1. PropisSoft → aktuelan tekst norme + istorijat izmena
2. Proveri OPS na vrh.sud.rs → ako postoji: temp. validnost
3. Paragraf.rs + PropisSoft → sentence (OBAVEZNO OBE BAZE)
4. vrh.sud.rs → pune odluke (za hijerarhiju A, B, V)
5. PrAS sajt → sentence + pune odluke (samo hijerarhija V)
6. HUDOC → SAMO ako domaći izvori ne daju ESLJP
```

---

## SLOJ 4 — PRETRAGA

### Metoda 2 — Navigacija kroz član (PRVA ako znaš član)

```
KORAK 1: Otvori Paragraf.rs ili PropisSoft
KORAK 2: Nađi zakon → nađi član
KORAK 3: Opcija „Sudska praksa" za taj član
KORAK 4: Lista sentenci → Sloj 5
```

### Metoda 1 — Type-in pretraga (ako M2 da malo / ne znaš član)

```
KORAK 1: Polje za pretragu
KORAK 2: Query iz V1
KORAK 3: Veliki rezultat → dodaj V2 ključnu reč
KORAK 4: Mali rezultat → probaj V2 samostalno
KORAK 5: → Sloj 5
```

**Redosled:** Znaš član → M2 prvo → malo → M1.
Ne znaš član → M1 → identifikuj član → M2.

### ⚠️ DVOSTRUKA PRETRAGA — OBAVEZNA

```
Isti query mora da prođe kroz OBE baze:
  1. PropisSoft → rezultati A
  2. Paragraf.rs → rezultati B
  3. UNIJA: A ∪ B → Sloj 5

Baze imaju različite sentence — jedna može imati
odluku koju druga nema. Pretraga samo kroz jednu bazu
= Compliance greška.

Dokumentuj OBA rezultata.
```

### Dokumentacija query-ja — OBAVEZNI FORMAT

```
[Baza] → „[tačan string]" → [N] rezultata → [N] prošlo filter
Primer: PropisSoft → „239 KZ umišljaj" → 18 rez. → 3 prošlo
         Paragraf → „239 KZ umišljaj" → 12 rez. → 2 prošlo (1 nova)
```

Bez ovog formata — pretraga se u Compliance-u označava ⛔.

---

## SLOJ 5 — FILTER SENTENCI

### Mehanizam M-A: Hard Stop čitanje sentence

```
⚠️ HARD STOP PRAVILO — APSOLUTNO:
  Čitaš SAMO ono što fizički piše u sentenci.
  NE dopunjuješ iz memorije.
  NE pretpostavljaš kontekst odluke.
  NE interpretiraš šta bi sud „verovatno rekao".

  Ako sentenca nije dovoljno jasna da odgovoriš
  na pitanje „da li rešava moj problem?" →
  automatska klasifikacija: BOČNO.
  Nikad: DA na osnovu nejasne sentence.
```

### Nivo 0 — Pravni identitet

```
ZA SVAKU SENTENCU (primeni M-A — hard stop):
  → Pravno shvatanje / headnote
  → Prva rečenica obrazloženja sentence
  → STANI — ne čitaj dalje

KRITERIJUM (binaran — nema „možda"):
  DA: sentenca opisuje isti pravni problem, isti element,
      istu pravnu situaciju koju istražujem
  NE: sentenca pominje član ili termin u drugom kontekstu
  NEJASNO: → automatski BOČNO

REZULTAT:
  → DA     → beleži: broj + sud + hijerarhija → Sloj 6
  → BOČNO  → beleži: broj + sud + zašto bočno → posebna lista
  → NE     → odbacuj

DATUM, BROJ PREDMETA — ne čitaš u Nivou 0.
```

### Protokol za „bočno relevantne"

```
Bočno = princip primenljiv analogno, ali ne rešava direktno.

USLOV ZA UPOTREBU: Sloj 7 = Slučaj V ili G
KRITERIJUM (binaran):
  Da li je pravni princip iz sentence primenljiv na moj
  slučaj bez menjanja pravne suštine principa?
  DA → upotrebi sa napomenom (ANALOGNO)
  NE → odbaci
```

### EXIT iz FILTER-a

```
Našao direktno relevantne → Sloj 6
0 direktno relevantnih →
  → proveri bočne
  → promeni vektor (V2/V3) → nova pretraga
  → ako i dalje 0 → Sloj 8
```

### Detekcija emergencije u sentencama (god-skill IQ 200)

**Samo u FULL režimu.** Primeni posle osnovnog filter-a:

```
Ako je Sloj 5 vratio 3+ sentence:
  → Kombinuj ih u PAROVE
  → Za svaki par: „Ove dve ZAJEDNO — da li govore nešto
    što nijedna pojedinačno ne govori?"
  → Ako DA → emergentni uvid → označi i prenesi u
    pravna-analiza F3 kao dodatni argument

Primer:
  Sentenca A: „Sud mora da oceni svaki dokaz"
  Sentenca B: „Izostavljanje dokaza odbrane = bitna povreda"
  Pojedinačno: opšte. Zajedno: sud MORA da se izjasni o
  KONKRETNOM dokazu odbrane — čl. 438 st. 1 tač. 11 ZKP.
```

---

## SLOJ 6 — ČITANJE

### Slučaj A — Pun tekst dostupan (Vrhovni sud ili PrAS)

**Nivo 1 — Brzo čitanje**

```
ŠTA ČITAŠ:
  → Pravno pitanje u obrazloženju (početak)
  → Zaključak suda
  → Članovi koje sud primenjuje

KRITERIJUM (binaran):
  Da li ratio direktno pomaže mom argumentu?
  DA → Nivo 2
  NE → odbacuj

⚠️ AKO PUNA ODLUKA ≠ SENTENCA:
  Zabeleži nesklad. Upotrebi punu odluku.
  U Compliance: „Sentenca≠odluka: DA — [broj]"
```

**Nivo 2 — Duboko čitanje**

```
① PRAVNO PITANJE: [jedna rečenica]

② TEŽINA ODLUKE:
   Hijerarhija A:
     ✅P1 [OPS] → Vrhovni sud obavezno pravno shvatanje
     ✅P1 [PS]  → Vrhovni sud prošireni/opšti sastav
     ✅P1       → Vrhovni sud redovan sastav
   Hijerarhija V:
     ✅P1 [OPS] → Vrhovni sud/PrAS obavezno pravno shvatanje
     ✅P1       → Vrhovni sud redovan / PrAS puna odluka

③ RATIO DECIDENDI:
   [Doslovni citat + strana / paragraf]
   Klasifikacija: po težini iz ②

④ MEHANIZAM M-V: POISON PILL SKEN — OBAVEZAN:
   Pročitaj obrazloženje tražeći:

   NEGATIVNI KVALIFIKATORI:
   → „osim", „izuzev", „pod uslovom da", „u slučaju kad"
   → „međutim", „nasuprot", „s tim da"

   POZITIVNI KVALIFIKATORI (takođe sužavaju ratio):
   → „naročito", „pre svega", „u slučajevima kao što je ovaj"
   → „posebno imajući u vidu", „u okolnostima gde"

   → Svaki uslov, izuzetak ili kvalifikator vezan za ratio

   ZA SVAKI NAĐENI USLOV/KVALIFIKATOR:
     Da li se taj uslov primenjuje na moj slučaj?
     DA → ratio je uslovljen → zabeleži → upozori korisnika
     NE → ratio stoji neuslovljeno

⑤ TEMPORALNA PROVERA — PRAVILNA:

   PITANJE NIJE: „Koliko je stara odluka?"
   PITANJE JESTE: „Da li se u MOJEM predmetu primenjuje
   isti zakon/član koji sud u odluci tumači?"

   KORAK A: Utvrdi merodavni zakon za TVOJ predmet:
     Krivični:    zakon u vreme izvršenja dela
                  (+ lex mitior ako je blaži)
     Ugovorni:    zakon u vreme zaključenja ugovora
     Obligacioni: zakon u vreme nastanka obaveze
     Procesni:    zakon u vreme preduzimanja radnje
     Deliktni:    zakon u vreme štetne radnje

   KORAK B: Proveri da li je član koji sud tumači:
     a) Isti tekst tada i sada → odluka važi bez ograničenja
     b) Izmenjen ali suština ista → odluka važi + napomena
     v) Suštinski izmenjen → odluka važi SAMO ako se na
        tvoj predmet primenjuje stari tekst (po pravilima
        iz Koraka A)
     g) Ukinut / zamenjen novim zakonom → isto kao v)

   KORAK V: Zaključak:
     Važi za moj predmet: DA/NE + obrazloženje zašto

⑥ DISTINGUISHING FACTORS:
   Čime se činjenična osnova razlikuje?
   Suštinska razlika → samo analogno (🟡P2)

⑦ CITATI U ODLUCI:
   Koju drugu praksu / ESLJP sud sam citira?
   → Idi za tim odlukama
```

### Slučaj B — Samo sentenca (svi ostali sudovi)

```
Maksimum: 🟡P2 — bez izuzetka

Iz sentence izvlačiš:
  → Pravni princip (parafraz — ne doslovni citat)
  → Nivo suda
  → Broj odluke

⚠️ POISON PILL ZA SENTENCE:
  Da li sentenca sadrži kondicionalne rečenice?
  Ako da → parafraziraj princip SA uslovom, ne bez njega.

⚠️ CHAIN OF CUSTODY — OBAVEZAN:
  Čuvaj doslovni tekst sentence u radnim beleškama
  pored parafraza:
    SENTENCA [broj]: „[doslovni tekst iz baze]"
    PARAFRAZ: [tvoja formulacija]
    IZVOR: [Paragraf / PropisSoft / oba]
    VALIDACIJA: parafraz verno predstavlja sentencu: DA/NE

Upotreba u dokumentu:
  „[Sud] u predmetu [broj] zauzeo je stanovište
  da [parafraz principa]."
  NE: doslovni citat u navodnicima.
```

---

## SLOJ 7 — SINTEZA NALAZA

### Korak 0 — Provera OPS (PRVO)

```
Postoji li obavezno pravno shvatanje [OPS]?
Gde: vrh.sud.rs → rubrika pravnih shvatanja / PrAS za prekršaje

DA → OBAVEZNA TEMPORALNA PROVERA OPS-A:
  Da li je član koga OPS tumači menjan posle OPS-a?
  → PropisSoft istorijat
  → AKO MENJAN: da li izmena dira u suštinu OPS-a?
    DA → OPS postaje 🟡P2 + upozori korisnika
    NE → OPS ✅P1 ostaje
  → OPS sa važećim članom → Slučaj A direktno

NE → nastavi na procenu skupa odluka
```

### Mehanizam M-D: Verifikacija postojanja citata (HARD STOP)

> Najopasnija greška u pravnom istraživanju NIJE izmišljen predmet —
> nego **stvaran izvor pogrešno protumačen** („misgrounding"): tačan
> broj predmeta, ali sentenca NE kaže ono što mu se pripisuje, ili
> se odluka poziva na neprimenljiv član. Empirijski (Stanford/JELS 2025)
> to se dešava češće i teže se hvata od čiste fabrikacije. Zato svaka
> numerička činjenica prolazi mehaničku proveru PRE ulaska u sintezu.

**Okidač:** bilo koji broj predmeta, broj predstavke ESLJP, ili
broj člana/stava koji ulazi u nalaz.

**Korak po korak (za SVAKI citat):**
```
1. POSTOJANJE — da li tačan broj predmeta/člana STVARNO postoji
   u izvoru koji sam otvorio (vrh.sud.rs / Paragraf / PropisSoft /
   HUDOC)? NE iz pamćenja — iz otvorene baze u ovoj sesiji.
   → NE mogu da potvrdim → citat je 🔴P3, NE ulazi kao nosiv;
     ako sam ga sam „rekonstruisao\" → ⛔P4 = BRISANJE.

2. POKLAPANJE (anti-misgrounding) — da li doslovni tekst koji
   pripisujem tom broju ZAISTA stoji u toj sentenci/presudi?
   → Uporedi verbatim. Ako parafraziram, da li parafraza ostaje
     verna ratio-u, bez dodavanja onoga čega nema?
   → Pripisan tekst se NE nalazi u izvoru → 🔴P3 + ne koristi.

3. PRIMENLJIVOST — da li se odluka poziva na član/institut koji
   je relevantan za naš predmet, ili je samo semantički sličan?
   → Semantička sličnost BEZ pravne primenljivosti = 🟡P2 analogno
     (M-B Reverse Claim), NE ✅P1 direktno.

4. TEMPORALNA VAŽEĆOST (analog Shepard's/KeyCite — za SVAKU normu
   i odluku, ne samo OPS iz Koraka 0):
   → NORMA: da li je član na snazi u važećoj verziji? PropisSoft
     istorijat izmena. Ako je član menjan posle odluke koju citiram →
     proveri da li izmena dira u ratio. Dira → odluka 🟡P2 + upozorenje;
     ne dira → klasa ostaje.
   → ODLUKA: da li je stanovište kasnije napušteno/izmenjeno novijom
     praksom višeg suda ili novim OPS-om? (koliko je vidljivo iz baze)
     → Napušteno → NE koristi kao nosivo, označi kao prevaziđeno.
   → Kada se ne može utvrditi važećost iz dostupnog izvora →
     označi „vremenska važećost nepotvrđena\" (ne glumi sigurnost).

```

**Pravilo fail-stop:** ako citat padne na koraku 1 ili 2 → NE ulazi
u nalaz ni kao 🟡P2. Bolje praznina označena nego misgrounded tvrdnja.
Nijedan broj predmeta/člana ne sme izaći iz ovog skila bez potvrde
iz otvorene baze u tekućoj sesiji.

### Procena skupa odluka

```
✅P1 [OPS]  → najviša težina
✅P1        → Vrhovni sud / PrAS puni tekst, verifikovan ratio
🟡P2        → apelacioni / PAS / niži, samo sentenca
🟡P2⁻       → niži sudovi (viši, osnovni, privredni, prekršajni)
```

### Mehanizam M-B: Reverse Claim test

```
OBAVEZAN za svaku odluku koju planiraš da uvrstiš:

ZA ✅P1 (pun tekst dostupan):
  PITANJE: „Da li bi protivna stranka mogla da upotrebi
  OVU ISTU odluku za SUPROTNI argument?"
  Metoda: Formuliši suprotnu tvrdnju i proveri da li
    obrazloženje suda sadrži rečenice koje je podržavaju.
  REZULTAT:
    NE → ratio je čvrst → ✅P1 ostaje
    DA → odluka ambivalentna → degradiraj na 🟡P2
      + zabeleži u Compliance „Reverse claim: DA — [obrazloženje]"
    DELIMIČNO → ✅P1 ostaje + napomena o ograničenju

ZA 🟡P2 (samo sentenca — SENTENCA REVERSE):
  PITANJE: „Da li formulacija sentence dozvoljava
  tumačenje u korist protivne strane?"
  REZULTAT:
    NE → 🟡P2 ostaje
    DA → degradiraj na 🟡P2⁻ ili odbaci
```

### Četiri slučaja sinteze

**Slučaj A — Konzistentna praksa sa ✅P1**

```
USLOV: Najmanje jedan ✅P1 konzistentno rešava pitanje
I prošao Reverse Claim test.
Proveri: novija odluka menja smer? → novija pobedi.

Formulacija:
  „Ustaljena praksa Vrhovnog [suda/kasacionog suda/suda Srbije]
  je da [ratio], videti odluke [brojevi]."
  Za prekršajne: „Vrhovni sud / PrAS je u postupku
  [ZZZ/drugostepenom] utvrdio da [ratio]."

  ⚠️ Ime suda u formulaciji = ime u vreme donošenja odluke!

Klasifikacija: ✅P1
```

**Slučaj B — Konfliktne odluke**

```
HIJERARHIJA RAZREŠENJA:
  1. Viši sud u hijerarhiji > niži
  2. Novije > starije (unutar istog nivoa)
  3. Konflikt na istom nivou → NE BIRAŠ

KONFLIKT NA ISTOM NIVOU:

  KRIVIČNI:
    → in dubio pro reo
    → „Vrhovni sud nema jedinstveno shvatanje — in dubio
      nalaže [zaključak]"

  PARNIČNI / PRIVREDNI / IZVRŠNI:
    → osnov za reviziju (čl. 403 ZPP)
    → „Nesuglašenost u praksi predstavlja osnov za reviziju"
    → NE koristi in dubio

  PREKRŠAJNI:
    → osnov za ZZZ pred Vrhovnim sudom
    → „PrAS nema ujednačenu praksu — ZZZ bi bio opravdan"

Klasifikacija: 🟡P2 sa napomenom o konfliktu
```

**Slučaj V — Samo 🟡P2 odluke**

```
USLOV: Nema ✅P1. Postoje sentence ili analogne odluke.

Formulacija (prilagodi nivou suda):
  „[Naziv suda] u predmetu [broj] zauzeo je stanovište
  da [parafraz iz sentence]."
  NE: „Ustaljena praksa Vrhovnog suda je..."

Klasifikacija: 🟡P2
```

**Slučaj G — Nijedna upotrebljiva odluka**

```
→ Proveri bočne (Sloj 5)
→ Ako ni bočne → Sloj 8
```

### Mehanizam M-G: Adverse Findings + Kontra-pretraga

```
DEO 1 — KONTRA-PRETRAGA (AKTIVNA, NE PASIVNA):

POSLE svake nađene povoljne odluke (✅P1 ili 🟡P2):
  → Formuliši query IZ PERSPEKTIVE PROTIVNE STRANE
  → Isti članovi, ali invertovan argument
  → Pretraži obe baze

RAZLIKA OD ADVERSE FINDINGS:
  Adverse findings = „ako naiđeš, prijavi" (pasivno)
  Kontra-pretraga = „traži protiv sebe" (aktivno)

  Našao kontra-odluku →
    Zabeleži kao Adverse Finding
    + napravi strategiju distinkcije ili obaranja
  Ne našao →
    Dokumentuj: „Kontra-pretraga: [query] → 0 rezultata"

DEO 2 — PRIJAVLJIVANJE (OBAVEZNO):

PRAVILO: Ako si u pretrazi našao odluke koje idu PROTIV
argumenta klijenta — moraš ih prijaviti.
NE postoji opcija „preskoči nepogodne odluke".

U Compliance izveštaju:
  ADVERSE FINDINGS:
    → [broj + sud + zašto šteti]
    → Nema → „Nisu nađene adverse findings u ovoj pretrazi"
    → Kontra-pretraga: [query → rezultat]

Ako adverse findings postoje → u dokumentu mora biti
strategija za distinkciju ili obaranje tih odluka.
Ne ignorišeš ih — suočavaš se sa njima.
```

---

## SLOJ 8 — FALLBACK CHAIN

**Samo ako Sloj 7 = Slučaj G. Maksimum 4 koraka — bez petlji.**

```
BROJAČ: [K1 → K2 → K3 → K4 → ⛔]
Posle K4 — ako nema ničeg — STANI.
NE vraćaš se na K1 ponovo.
```

### K1 — Promeni vektor

```
Vrati se na Sloj 1. Promeni vektor.
V1→V2→V3, ili M2→M1 sa drugačijim ključnim rečima.
Dokumentuj novi query u obaveznom formatu.
→ Našao → Sloj 5 ponovo
→ Nije → K2
```

### K2 — Analogija + Abduktivno rezonovanje

```
STANDARDNO: Srodna norma sa istim pravnim principom (videti V3 po tipu).
Pretraga: Sloj 4 sa analognom normom.
Upotreba: „Po analogiji sa [norma/sud/broj]..."
Klasifikacija: 🟡P2 — obavezno označi kao analogiju.

ABDUKTIVNO (god-skill IQ 200, samo FULL režim):
  Ako standardna analogija ne daje rezultat —
  probaj abduktivni pristup:

  1. Sakupi sve anomalije iz predmeta (iz pravna-analiza F2)
  2. Pitaj: „Koji PRAVNI PRINCIP bi objasnio sve anomalije?"
  3. Pretraži TAJ princip — možda ima praksu na koju ne bi
     došao klasičnom pretragom po članu
  4. Ako nađeš → Sloj 7 (Slučaj V)

  Primer: Sud ignoriše dokaze + obrazloženje ne odgovara
  izreci + veštak dao alternativu koju sud preskače.
  Abdukcija: „Sud je imao unapred formirano uverenje"
  → pretraži praksu o RIGHT TO REASONED JUDGMENT
  → nađeš ESLJP Taxquet v. Belgium → primenljivo

→ Našao → Sloj 7 (Slučaj V)
→ Nije → K3
```

### K3 — ESLJP principi

```
REDOSLED:
  1. Paragraf / PropisSoft — ESLJP sentence
  2. Domaće odluke koje citiraju ESLJP
  3. HUDOC — samo ako 1 i 2 nisu dali ništa

PRIMENLJIVOST — proveri pre upotrebe:
  Krivični: čl. 6, 7, 8, 10 EKLJP
  Parnični: čl. 6, čl. 1 Prot. 1
  Privredni: čl. 6, čl. 1 Prot. 1
  Prekršajni: čl. 6, 7 (kazneni karakter)
  Čisto imovinski bez konvencijske komponente → preskoči K3

NA HUDOC-U:
  Veliko veće → opšti principi
  Chamber protiv Srbije → konkretna primena
  Kombinacija: princip (VV) + primena (protiv Srbije) = idealno

ESLJP KONFLIKT PROTOKOL:
  Veliko veće > Chamber → uvek
  Novija > starija → na istom nivou
  Protiv Srbije > protiv druge države → za domaću primenu
  Ako ostaje konflikt → citiraj OBE odluke + analizu trenda

Klasifikacija:
  Prevod sa Paragrafa: 🟡P2
  Citat domaćeg suda: ✅P1
  HUDOC pun tekst: ✅P1

→ Našao → Sloj 7 (Slučaj V)
→ Nije → K4
```

### K4 — Doktrina

```
Paragraf komentari uz član + pravna načela.
Klasifikacija: 🟡P2
→ Našao → Sloj 7 (Slučaj V)
```

### ⛔ Posle K4 — ako nema ničeg

```
NE IZMIŠLJAJ ODLUKU.
Dokumentuj: izvore, vektore, hijerarhiju, sve K korake.
Argumentiši iz principa.
Saopšti: „⛔ Nema prakse. Argument iz principa."
```

---

## ISPORUKA PRAKSE — OBAVEZNO

```
SVAKA ODLUKA KOJA SE CITIRA U DOKUMENTU MORA IMATI
JEDNO OD SLEDEĆEG:

A) DIREKTAN LINK do izvora:
   Vrhovni sud:  https://www.vrh.sud.rs/... (link do odluke)
   PrAS:         https://prekrsajni.sud.rs/...
   HUDOC:         https://hudoc.echr.coe.int/...
   Paragraf:      link do sentence (ako je dostupan)
   PropisSoft:    link do sentence (ako je dostupan)

B) AKO LINK NIJE MOGUĆ → COPY-PASTE KOMPLETNOG TEKSTA:
   Za pun tekst (Vrhovni sud/PrAS): copy-paste celog
     obrazloženja odluke
   Za sentencu: copy-paste cele sentence
   + OBAVEZNO: „Izvor: [baza], pristupljeno [datum]"

V) BEZ A) ILI B) → ODLUKA SE NE CITIRA U DOKUMENTU.
   Ne postoji opcija „citiram a nemam izvor".

FORMAT ISPORUKE:
  Svaka korišćena odluka se isporučuje korisniku
  kao zaseban .docx fajl (link ili pun tekst unutra)
  ili zbirno u aneksu glavnog dokumenta.
```

---

## FIKSNI FORMAT CITIRANJA

**Svaka odluka u dokumentu mora imati tačno ovaj format:**

```
✅P1 — pun tekst (Vrhovni sud / PrAS):
  [Naziv suda u vreme odluke], [broj predmeta], od [datum],
  strana/par. [X]:
  „[doslovni citat ratio decidendi]"
  Izvor: [link]

🟡P2 — samo sentenca:
  [Naziv suda] u predmetu [broj predmeta] zauzeo je
  stanovište da [parafraz principa iz sentence].
  Izvor: [link / „Paragraf.rs" / „PropisSoft"]

🟡P2 — analogno:
  Po analogiji sa [naziv suda], [broj], gde sud utvrđuje
  da [parafraz], primenljivo jer [obrazloženje analogije].
  Izvor: [link / baza]

ESLJP — pun tekst (HUDOC):
  ESLJP, [naziv predmeta] protiv [države], predstavka
  br. [X], presuda od [datum], par. [Y]:
  „[ratio na engleskom/francuskom + prevod]"
  Izvor: [HUDOC link]

ESLJP — domaći citat:
  ESLJP u predmetu [naziv] utvrdio je da [parafraz],
  kako citira [domaći sud] u predmetu [broj].
  Izvor: [link domaće odluke]
```

Odstupanje od ovog formata = Compliance greška.

---

## BATCH PROTOKOL

```
Kad pravna-analiza traži praksu za VIŠE pravnih pitanja
u istom predmetu:

  1. Svako pravno pitanje = ZASEBAN prohod Sloj 1-8
  2. Zaseban Compliance za svako pitanje
  3. Zbirni izveštaj na kraju sa cross-reference
     (npr. ista odluka pomaže za dva pitanja)
  4. Adverse findings — zbirno za ceo predmet
```

---

## INTEGRACIJA

```
POZIVANJE:
  pravna-analiza F3 → poziva istraživanje-prakse → vraća ✅/🟡/⛔
  pravna-analiza F3.3b (ESLJP) → poziva IP Sloj 8 K3 (HUDOC)
  krivica / tuzba-parnica → isti mehanizam

REŽIM:
  pravna-analiza F0.1 = FULL → IP radi kompletno
  pravna-analiza F0.1 = STANDARD → IP radi skraćeno (videti Sloj 2)
  Direktan poziv korisnika → podrazumevano FULL

GOD-SKILL IQ 200 KOMPONENTE:
  Emergencija → Sloj 5 (kombinacija sentenci) — samo FULL
  Abdukcija → Sloj 8 K2 (generisanje analogije) — samo FULL
  Rekurzivna mreža → ako Sloj 6 otkrije nešto novo,
    vrati se na Sloj 5 i proveri da li menja filter

VERIFIKATOR (POSLE, ako nalaz ulazi u dokument):
  → Protokol A: DIFF ratio u dokumentu ↔ puna odluka (VS/PrAS)
  → Protokol B: web search verifikacija broja odluke + suda
  → Protokol B.2b: provera interpretacije — da li parafraz
    verno prenosi ratio iz odluke (chain of custody)
  → Za 🟡P2: parafraz odgovara sentenci?
  → Tačnost imena suda (VSS/VKS/VS po datumu odluke)
  → Temporalna provera (merodavni zakon, ne starost)
  → Izvor postoji: link ili copy-paste?
  → Adverse findings adresirane u dokumentu?

CROSS-SKILL KONZISTENTNOST (verifikator Protokol D):
  → IP kaže „ustaljena praksa ✅P1" a pravna-analiza F4.E
    kaže „argument pada ❌ kod sudije" → 🔴 KONTRADIKCIJA
    → Mogući uzrok: praksa postoji ali činjenice predmeta
      se razlikuju → distinguishing
  → IP kaže „✅P1 ratio podržava" a god-skill 4D FORK
    grana B pokazuje jak kontraargument → 🟡 PROVERI
    → Mogući uzrok: ratio je uslovljen (poison pill)
  → IP kaže „⛔ nema prakse" a pravna-analiza F3.3b
    našla ESLJP → 🟡 Možda IP treba K3 (HUDOC)
  → IP adverse findings POSTOJE a pravna-analiza ih
    NE ADRESIRA u dokumentu → 🔴 PROPUST

GRANICA REVERSE CLAIM TESTOVA:
  istraživanje-prakse Reverse Claim → testira KONKRETNU ODLUKU
    (da li protivnik može da koristi istu odluku)
  pravna-analiza Reverse Claim → testira CEO ARGUMENT
    (da li je tvrdnja u dokumentu oboriiva)
  Ovo su RAZLIČITI testovi. Oba su obavezna.

REDOSLED IZVEŠTAJA (kad su sva 4 skill-a aktivna):
  1. PA Compliance → pravna-analiza (glavni tok)
  2. IP Compliance → istraživanje-prakse (izvori)
  3. GS Compliance → god-skill (kognitivna dubina)
  4. VR Nalaz → verifikator (provera svega)
  → Verifikator čita SVA TRI prethodna izveštaja
    i proverava KONZISTENTNOST između njih.
```

---

## ZABRANJENO

1. Doslovni citat iz sentence u navodnicima.
2. ✅P1 bez dostupnog punog teksta.
3. Preskakanje OPS provere — pre sentenci, uvek.
4. HUDOC pre domaćih izvora.
5. ESLJP za predmete bez konvencijske komponente.
6. In dubio za građanske/privredne/prekršajne predmete.
7. „Ustaljena praksa Vrhovnog suda" bez ✅P1 odluke.
8. Izmišljanje odluke — ⛔ bez izuzetka.
9. Citiranje bez broja odluke i nivoa suda.
10. Ignorisanje temporalne provere (merodavni zakon).
11. Režim B bez minimalne provere relevantnosti.
12. Preskakanje Sloja 1.
13. Skrivanje adverse findings — ako postoje, moraju u Compliance.
14. Preskakanje Poison Pill skena u Nivou 2.
15. Preskakanje Reverse Claim testa za ✅P1 kandidate.
16. Query bez obaveznog formata dokumentacije.
17. Ponavljanje Fallback chain posle K4 — maksimum je K4.
18. OPS bez provere temporalne validnosti.
19. Citiranje bez izvora (link ili copy-paste) — bez izvora nema citata.
20. Pretraga samo kroz jednu bazu — obavezna dvostruka (PropisSoft + Paragraf).
21. Pogrešno ime suda — VSS/VKS/VS mora odgovarati datumu odluke.
22. Preskakanje kontra-pretrage za ✅P1 odluke.
23. Preskakanje chain of custody za 🟡P2 sentence.

---

## ⛔ COMPLIANCE IZVEŠTAJ — OBAVEZAN

```
╔══════════════════════════════════════════════════════════════════╗
║  🔍 COMPLIANCE — ISTRAŽIVANJE-PRAKSE v6.2                         ║
╠══════════════════════════════════════════════════════════════════╣
║  PITANJE: [jedna rečenica]                                       ║
║  TIP POSTUPKA: [krivični/parnični/privredni/prekršajni/upravni]║
║  HIJERARHIJA: [A / B / V / G]                                  ║
║  REŽIM: [Discovery / Verification]                              ║
╠══════════════════════════════════════════════════════════════════╣
║  S1 │ ✅/⛔ │ Tip: [X] Vektori: [V1:... V2:...]               ║
║     │       │ Premisa: [neutralna / preformulisana / netačna→stop]║
║  S2 │ ✅/⛔ │ Režim: [A/B] — [obrazloženje]                    ║
║  S3 │ ✅/⛔ │ OPS: [nađeno→temp.važeći/zastareo / nije]       ║
║  S4 │ ✅/⛔ │ PropisSoft→„[query]"→[N]rez.→[N]prošlo          ║
║     │       │ Paragraf→„[query]"→[N]rez.→[N]prošlo (novih:[N])║
║     │       │ Dvostruka: DA/NE                                ║
║  S5 │ ✅/⛔ │ Sken: [N] │ Direktne: [N] │ Bočne: [N]          ║
║     │       │ Hard Stop: primenjen da/ne                        ║
║  S6 │ ✅/⛔ │ Pun tekst: [N] │ Samo sentenca: [N]             ║
║     │       │ Poison Pill sken: [N] odluka, nađeno: [N]        ║
║     │       │ Temp. provera: [N] (merodavni zakon: [X])        ║
║     │       │ Sentenca≠odluka: [da — [broj] / ne]              ║
║     │       │ Chain of custody: [N] sentenci čuvano             ║
║  S7 │ ✅/⛔ │ Slučaj: [A/B/V/G] │ OPS: [da/ne]               ║
║     │       │ M-D provera citata: [N] citata → [N] potvrđeno   ║
║     │       │   postojanje/poklapanje/primenljivost → palo: [N]    ║
║     │       │ Temp. važećost (norma+odluka): [N] prover./[N] OK║
║     │       │ Reverse Claim P1: [N] testirano, palo: [N]       ║
║     │       │ Reverse Claim P2: [N] testirano, palo: [N]       ║
║     │       │ Konflikt: [da → krivični/ostalo / ne]            ║
║  S8 │ ✅/— │ Fallback: [K1/K2/K3/K4/nijedan] [rezultat]       ║
╠══════════════════════════════════════════════════════════════════╣
║  NALAZ:                                                         ║
║  ✅P1: [broj + sud (tačno ime) + težina + ratio + izvor]       ║
║  🟡P2: [broj + sud — parafraz + izvor (baza)]                  ║
║  ⛔:   [šta i zašto]                                           ║
╠══════════════════════════════════════════════════════════════════╣
║  ADVERSE FINDINGS (obavezno polje):                              ║
║    [broj + sud + zašto šteti argumentu]                         ║
║    ili: „Nisu nađene adverse findings u ovoj pretrazi"          ║
║  KONTRA-PRETRAGA:                                               ║
║    [query → rezultat]                                           ║
║    ili: „Kontra-pretraga sprovedena, 0 rezultata"               ║
╠══════════════════════════════════════════════════════════════════╣
║  ISPORUKA:                                                      ║
║    ✅P1: [link / copy-paste — da/ne]                            ║
║    🟡P2: [link / copy-paste — da/ne]                            ║
║    Bez izvora: [N] odluka                                       ║
╠══════════════════════════════════════════════════════════════════╣
║  Sinteza: [A/B/V/G] — [formulacija za dokument]                ║
║  HUDOC: [da — zašto / ne]                                      ║
║  Vektor menjan: [da V?→V? / ne]                                 ║
║  ⚠️ VERIFIKATOR: [potreban da / ne]                            ║
╚══════════════════════════════════════════════════════════════════╝
```

**AKO NE PRIKAŽEŠ OVAJ IZVEŠTAJ — SKILL NIJE PRIMENJEN.**
