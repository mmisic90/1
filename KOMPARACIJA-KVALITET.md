# Komparacija kvaliteta: naši pravni alati (Courtroom5) vs AI Advokat

Datum: 11. jun 2026.
Metod: naši pravni alati testirani UŽIVO (stvarni pozivi, realni outputi prikazani
ispod). AI Advokat ocenjen iz dokumentovanih sposobnosti i tvrdnji (živi AI output
iza prijave/paywalla — nije direktno testiran). Ova asimetrija je eksplicitno
naznačena u ocenama.

---

## 1. Šta su naši alati (Courtroom5 LAW Accelerator) zaista dali

### case_intake_assessment — stanar, neisplaćen depozit $1.500, NC
- `viable: true`; obrazloženje: NC zahteva povraćaj depozita u 30 dana ili pisanu
  specifikaciju odbitaka — rok probijen ~60 dana
- 2 tužbene osnove sa `strength_basis` (npr. UDTP: „plausible but depends on facts
  you would need to prove")
- 4 konkretna prva koraka: preporučeno pismo (povratnica) → dokazi → small claims
  (do $10.000) → dokumentovanje hronologije
- urgency, jurisdiction (NC Small Claims/District), disclaimer, CTA

### deadline_calculator — uručena tužba, NC, general_civil
- Rok „File Answer": 2026-07-02, preostalo 21 dan; posledica = default judgment
- Citat: N.C.R. Civ. P. 12 (30 dana) + opcija produženja
- DETERMINISTIČKA lookup tabela, ne LLM → rok se ne izmišlja

### next_step_guidance — naplata duga, faza discovery, NC, defendant
- 3 prioritizovana koraka: interrogatories/zahtev za dokumentima → ispitivanje
  aktivne legitimacije i lanca vlasništva duga → očuvanje dokaza
- `jurisdiction_note`: NC zastarelost 3 godine — tražiti u discovery-ju
- case_posture, moduli, disclaimer, CTA

Zaključak testa: output je na nivou solidne pravne trijaže za laika, sa pravim
citatima i kalibrisanom iskrenošću.

---

## 2. Suštinska razlika (pre svakog poređenja)

Ovo su DVA RAZLIČITA PROIZVODA, ne dve verzije istog:

| | Naši alati (Courtroom5) | AI Advokat |
|---|---|---|
| Tržište | SAD | ex-YU (pretežno Srbija) |
| Korisnik | Građani / pro se (B2C) | Advokati / kancelarije (B2B) |
| Obim | 3 savetodavne funkcije | Pun practice-mgmt + AI + drafting |
| Suština | Trijaža + procesno vođenje | „Vodi celu kancelariju" |
| Mehanizam tačnosti | Deterministička tabela (rokovi) | RAG + LLM (Mistral) |
| Šta radi | Samo savetuje | Stvarno proizvodi (dokumenti, predmeti, fakture) |
| Stanje | Stateless | Puna baza, istorija |
| Jezik | Engleski | 6 jezika |

## 3. Matrica kvaliteta (1–5)

| Dimenzija | Courtroom5 | AI Advokat |
|---|:--:|:--:|
| Pouzdanost rokova (najkritičnije) | 5 | 2–3 |
| Pravna dubina / citati | 4 | 3 |
| Širina funkcija | 1 | 5 |
| Workflow / akcije (radi vs savetuje) | 1 | 5 |
| Lokalizacija za ex-YU | 0 | 4 |
| Bezbednost / kalibracija outputa | 5 | 2–3 |
| Privatnost (infrastruktura) | 2 | 4 |
| Trajno stanje / memorija | 1 | 5 |
| Fit za advokate (B2B) | 1 | 5 |

Obrazac je skoro ogledalski — svaki je jak tačno tamo gde je drugi slab.

### Gde su naši alati kvalitetniji
- Pouzdanost rokova: deterministička verifikovana tabela vs AI ekstrakcija rokova
  iz dokumenta (rizik halucinacije). Arhitektonska prednost.
- Iskrenost/kalibracija: `strength_basis`, „proveri kod lokalnog suda". AI Advokat
  na sajtu tvrdi „ne izmišlja citate", a u uslovima ne garantuje tačnost.
- Jasni guardrails: odbija van-domena (krivično, imigraciono, van SAD).

### Gde je AI Advokat kvalitetniji
- Stvarno obavlja posao (podnesci, predmeti, fakture, sudski portal); naši alati
  samo savetuju, ništa ne proizvode — za advokata to je cela vrednost.
- Lokalizacija za stvarno tržište; naši alati su za ex-YU neupotrebljivi.
- Trajno stanje, mobilne aplikacije, privatnosna infrastruktura (PII, AES-256, EU).

### Ograda metoda
Courtroom5 testiran uživo; AI Advokatov AI output nije direktno testiran (iza
prijave). Njegove ocene su iz dokumentacije/tvrdnji, ne iz živog testa.

## 4. Pouka za „aidvokat"

Najviši standard = širina i workflow AI Advokata + disciplina Courtroom5:
1. Determinističke tabele za rokove (nikad LLM za rok) — AI Advokat to ne radi;
   diferencijator: „rokovi se ne haluciniraju, garantovano".
2. Kalibrisani output (`strength_basis`, „proveri ovo") umesto preobećavanja.
3. Eksplicitni guardrails za domen.
4. Pun workflow (drafting + case-mgmt) lokalizovan za ceo ex-YU.
