---
name: izvrsenje
version: 1.0
description: >
  Izvršni postupak i svi akti u njemu — predlog za izvršenje (na osnovu izvršne isprave
  ili verodostojne isprave), prigovor na rešenje o izvršenju, žalba na zaključak izvršitelja,
  protivizvršenje, podnesak javnom izvršitelju, obustava izvršenja. Trigeri: izvršni
  postupak, izvršni poverilac, izvršni dužnik, predlog za izvršenje, verodostojna
  isprava, II-, IIv-, PI-, javni izvršitelj, blokada računa, zaplena, popis, procena,
  prodaja nepokretnosti, zabrana raspolaganja, poriz na dodatnu vrednost dodeljena
  imovina, namirenje. Generiše .docx u stilu adv. Milana Mišića, sa perspektive
  IZVRŠNOG POVERIOCA ili IZVRŠNOG DUŽNIKA zavisno od akta. Lanac: pravna-analiza → ovaj skill → stil-pisanja → verifikator (istrazivanje-prakse se poziva kao servis u Koraku 3). NE aktivirati
  za: parnične sporove (tuzba-parnica), krivične postupke (krivica), prekršajne
  postupanje, upravne sporove, knjižice, Instagram, tehnički debugging.
metadata:
  author: "Milan Mišić, advokat"
  version: "1.0.0 (komplet 7 šablona — završen u Sesiji 5b)"
  status: "operational"
  depends-on: ["pravna-analiza"]
  composes-with: ["istrazivanje-prakse", "verifikator", "stil-pisanja"]
  category: "legal-enforcement"
  last-updated: "2026-04-22"
---

# Izvršni postupak — Skill v1.0

> **Pismo:** instrukcije ovog skila su latinica (token-ekonomija, vidi `_policy/politika-pisma.md`); izlazni pravni akt je uvek ćirilica — kontroliše `stil-pisanja`.

> ✅ **SKIL JE OPERATIVAN.** Završen u Sesiji 5b (22.04.2026). Sadrži **7 kompletnih kompozicionih šablona** — predlog za izvršenje, prigovor na rešenje, žalba na zaključak izvršitelja, protivizvršenje, podnesak izvršitelju, opomena pred izvršenje, vansudsko poravnanje. Svi šabloni imaju mock-up, matricu terminologije, tarifu, i checklist. 
>
> Do tada — za akte koji nisu pokriveni ovim skill-om, korisniku se preporučuje da:
> 1. Otvori `tuzba-parnica` za pripremne akte (opomena pred tužbu)
> 2. Otvori `pravna-analiza` za analizu izvršne materije
> 3. Ručno adaptira postojeće šablone uz konsultaciju sa `stil-pisanja` 

## ⚠️ NEGATIVE TRIGGERS — NE AKTIVIRAJ ZA:

| Kontekst | Pravilan skill |
|---|---|
| Parnični postupak (tužba, odgovor, žalba na presudu) | `tuzba-parnica` |
| Krivični postupak | `krivica` |
| Pripremne faze pre parnice (opomena pred tužbu) | `tuzba-parnica/sabloni/08` |
| Upravni spor, prekršajnom, ustavna žalba | `pravna-analiza` |

---

## Svrha

Automatski izrađuje potpune i sudu/izvršitelju podnošene akte u izvršnom postupku, u stilu i retoričkom maniru advokatske kancelarije Milana Mišića, prema Zakonu o izvršenju i obezbeđenju (ZIO), sa integracijom verifikovane sudske prakse i referentnih tarifa iz korpusa.

**OSNOVNO PRAVILO:** Akt se piše sa perspektive STRANKE koju Milan zastupa — **IZVRŠNI POVERILAC** (pokreće izvršenje) ili **IZVRŠNI DUŽNIK** (brani se od izvršenja).

**KRITIČNO za terminologiju:** U izvršnom postupku **NIKAD** se ne piše "tužilac/tuženi" — uvek **IZVRŠNI POVERILAC / IZVRŠNI DUŽNIK**. To je prva provera koju treba uraditi pre pisanja bilo kog izvršnog akta.

---

## MESTO U STACK-U

```
                    ┌───────────────────────────┐
                    │  god-skill-deep-reader    │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      pravna-analiza       │ F0–F5 → handoff
                    └─────────────┬─────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  │                               │
      ┌───────────▼───────────┐       ┌──────────▼──────────┐
      │  istrazivanje-prakse  │◄──────┤      IZVRSENJE      │
      │     v6 (delegat)      │       │       v0.1          │
      └───────────┬───────────┘       └──────────┬──────────┘
                  │                              │
                  └──────────────┬───────────────┘
                                 │
                     ┌───────────▼───────────┐
                     │      verifikator      │
                     └───────────┬───────────┘
                                 │
                                 ▼
                          KORISNIK (Milan)
```

---

## Šabloni — KOMPLETNI (v1.0)

| # | Šablon | Status | Izvorni akt iz korpusa / Baza |
|---|---|---|---|
| 01 | `sabloni/01_predlog_izvrsenje.md` | ✅ Gotov | Armex PREDLOG ZA IZVRŠENJE 3 računa |
| 02 | `sabloni/02_prigovor_na_resenje_izvrsenju.md` | ✅ Gotov | Čl. 58-65 ZIO — odbrana ID |
| 03 | `sabloni/03_zalba_na_zakljucak_izvrsitelja.md` | ✅ Gotov | Čl. 81-87 ZIO |
| 04 | `sabloni/04_protivizvrsenje.md` | ✅ Gotov | Čl. 180-190 ZIO — restituciono |
| 05 | `sabloni/05_podnesak_izvrsitelju.md` | ✅ Gotov | Procesni podnesak — sve svrhe |
| 06 | `sabloni/06_opomena_pred_izvrsenje.md` | ✅ Gotov | Vansudski akt — priprema za izvršenje |
| 07 | `sabloni/07_vansudsko_poravnanje.md` ⭐ | ✅ Gotov | **Armex/Duming VANSUDSKO PORAVNANJE (25.09.2024)** |

**Ukupno:** 7 šablona, ~3.000 linija pravnog znanja, baziranih na **stvarnom korpusu** adv. Milana Mišića 2022-2026.

Planirani naredni koraci (**buduće sesije**):
- Sesija 6: validacija kroz realan test (pisanje novog izvršnog akta)
- Sesija 7: dodati pomoćne reference (rokovi, matrica nadležnosti, lista izvršitelja)
- Sesija 8: specifične situacije (izvršenje na zaradu, penziju, nepokretnost)

---

## Vazne reference za pisanje izvršnih akata

### Terminologija stranaka

U izvršnom postupku **obavezno**:
- **IZVRŠNI POVERILAC** — ko traži izvršenje (ranije tužilac u parnici)
- **IZVRŠNI DUŽNIK** — ko duguje (ranije tuženi u parnici)
- **JAVNI IZVRŠITELj** — ko sprovodi izvršenje

### Matrica nadležnosti

| Vrsta izvršne isprave | Nadležni sud |
|---|---|
| Presuda ili rešenje suda | **Osnovni / Viši / Privredni sud** koji je doneo — po nadležnosti stranaka |
| Verodostojna isprava (faktura) u privredi | **Privredni sud** |
| Verodostojna isprava kod fizičkih lica | **Osnovni sud** (mesto prebivališta dužnika) |
| Javno beležnička isprava | **Osnovni sud** |
| Arbitražna odluka | **Viši sud** |

### Nadležni javni izvršitelj

Za područje korisnika **(Zrenjanin, Viši i Privredni sud u Zrenjaninu)**:
- **Željko Kesić** (iz memorije)
  - Sedište: Zrenjanin, Kralja Aleksandra Karađorđevića 15/III (23101)
  - Tel: 023/600-529; 064/141-8719
  - Email: izvrsitelj.kesic@gmail.com
  - Broj rešenja o imenovanju: 740-08-1768/2014-22 od 27.06.2014
  - Područje: Višeg suda u Zrenjaninu i Privrednog suda u Zrenjaninu
  - ⚠️ **Spelovanje: "Kesić" — NIKAD "Kešić"**

### Matrica tarifa (iz korpusa)

| Akt | Tarifa |
|---|---|
| Predlog za izvršenje (1 faktura) | **13.500 RSD** |
| Predlog za izvršenje (3 fakture) | **27.000 RSD** (13.500 + 50% + 50%) |
| Podnesak izvršitelju | 13.500–20.000 |
| Prigovor na rešenje o izvršenju | 20.000–40.000 |
| Vansudsko poravnanje | **45.000 RSD** (Armex/Duming model) |

### Slojevite kamate u petitu (iz `reference_vizuelno.md` §26)

Kada izvršni dužnik parcijalno uplati kroz vreme, kamata se **razbija po intervalima**:

```
- na iznos X počev od DATUM1, pa do DATUM2
- zatim na iznos Y počev od DATUM2, pa do DATUM3
- i na iznos Z počev od DATUM3, pa do konačne isplate
```

Svi datumi se beleže konkretno — svaka parcijalna uplata pomera interval.

---

## REFERENTNI FAJLOVI

| Fajl | Sadržaj | Status |
|---|---|---|
| `references/sabloni/01_predlog_izvrsenje.md` | Predlog za izvršenje (Armex 3 računa model) | ✅ Gotov |
| `references/sabloni/02_prigovor_na_resenje_izvrsenju.md` | Prigovor na rešenje o izvršenju (čl. 58-65 ZIO) | ✅ Gotov |
| `references/sabloni/03_zalba_na_zakljucak_izvrsitelja.md` | Žalba na zaključak izvršitelja (čl. 81-87 ZIO) | ✅ Gotov |
| `references/sabloni/04_protivizvrsenje.md` | Protivizvršenje — restituciono (čl. 180-190 ZIO) | ✅ Gotov |
| `references/sabloni/05_podnesak_izvrsitelju.md` | Podnesak javnom izvršitelju (sve svrhe) | ✅ Gotov |
| `references/sabloni/06_opomena_pred_izvrsenje.md` | Opomena pred izvršenje (vansudski) | ✅ Gotov |
| `references/sabloni/07_vansudsko_poravnanje.md` ⭐ | **Vansudsko poravnanje (Armex/Duming model)** | ✅ Gotov |
| `references/rokovi-izvrsenje.md` | Tabela rokova | ⏳ TODO v1.2 |
| `references/matrica-nadleznosti-izvrsenje.md` | Nadležnost po vrsti isprave | ⏳ TODO v1.2 |
| `references/javni-izvrsitelji-vojvodina.md` | Lista javnih izvršitelja | ⏳ TODO v1.2 |

---

## PLAN ZA BUDUĆE VERZIJE

**v1.1 (planirano Sesija 6):** Validacija kroz realan akt

**v1.2 (planirano Sesija 7):** Pomoćne reference
- `references/rokovi-izvrsenje.md` — Tabela rokova (3 dana prigovor, 15 dana žalba na zaključak)
- `references/matrica-nadleznosti-izvrsenje.md` — Nadležnost po vrsti isprave
- `references/javni-izvrsitelji-vojvodina.md` — Lista javnih izvršitelja po području

**v2.0 (buduće):** Specifične situacije
- Izvršenje na zaradu dužnika
- Izvršenje na penziju
- Izvršenje na nepokretnost (dizamonoprodaja, dosuđenje)
- Izvršenje na mootorno vozilo
- Specijalne mere — zabrana raspolaganja, policajno osiguravanje

---

## ZABRANJENO (apsolutno)

1. **Pisati izvršni akt sa "tužilac/tuženi"** — uvek "izvršni poverilac / izvršni dužnik"
2. **Zaobilaziti JAVNOG IZVRŠITELJA** — ak se sprovodi preko izvršitelja, obavezno imenovati konkretnog
3. **Paušalne kamate** — uvek slojevito, sa datumima
4. **Pogrešan nadležan sud** — uvek proveriti po vrsti isprave
5. **Kopirati šablone iz `tuzba-parnica`** — izvršni postupak ima drugu terminologiju
