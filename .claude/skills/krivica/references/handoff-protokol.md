# Handoff protokol — `pravna-analiza` → `krivica`

## Svrha

Ovaj fajl opisuje **tačan format** i **obavezne elemente** handoff paketa koji `pravna-analiza` predaje `krivica` skill-u. Bez ovoga, dve stack komponente gube kontekst i rade dupli posao.

## Obavezan format paketa

```yaml
handoff:
  source: "pravna-analiza v3"
  target: "krivica v2"
  timestamp: ISO-8601
  predmet:
    broj: "K. 63/2026"
    stranka: "Bogunović Viktor"
    sud: "Osnovni sud Bečej, Odeljenje Novi Bečej"
    sudija: "Ivana Avramov"
  
  # ① TEORIJA SLUČAJA (F0)
  teorija_slucaja:
    jedna_recenica: "..."
    hipoteza: "..."
    verovatnoca: "[0-100]%"
  
  # ② ČINJENIČNA MAPA (F1-2)
  cinjenicna_mapa:
    - cinjenica: "..."
      klasa: "P1/P2/P3"
      izvor: "str. X, pasus Y"
      status: "potvrđeno / sporno / osporeno"
    # ...
    kontradikcije: []
  
  # ③ ARGUMENTI (F3)
  argumenti:
    jaki:
      - tekst: "..."
        osnov: "čl. X ZKP/KZ"
        snaga: 9
        nezavisnost: true
    srednji: []
    slabi: []
    graf_zavisnosti:
      nezavisnih: 3
      ukupnih: 7
  
  # ④ ADVERSARIAL (F4)
  adversarial:
    sudija_prezivelo: 5
    sudija_odbacilo: 2
    protivnik_prezivelo: 4
    protivnik_odbacilo: 3
  
  # ⑤ „JEDNA STVAR" (F5) — IDE PRVA
  jedna_stvar:
    argument: "..."
    zasto: "..."
    dokaz: "str. X + Y ← ✅P1"
    neodbrativo: "..."
  
  # ⑥ VERIFIKOVANA PRAKSA (iz istrazivanje-prakse)
  praksa:
    - sud: "VS"
      broj: "Kzz 498/2022"
      datum: "..."
      link: "https://..."
      ratio: "..."
      verifikovano: true
    # ...
  
  # ⑦ STRATEŠKA PROCENA
  strateska_procena:
    najbolji_ishod: "..."
    realan_ishod: "..."
    najgori_ishod: "..."
    rizik_1_10: 4
    preporuka: "..."
```

## Validaciona pravila

Pre nego što `krivica` prihvati handoff, mora da proveri:

1. **Svi 7 elemenata** (teorija_slucaja, cinjenicna_mapa, argumenti, adversarial, jedna_stvar, praksa, strateska_procena) su prisutni.
2. `jedna_stvar.argument` nije prazan.
3. `praksa` sadrži minimum 1 odluku sa `verifikovano: true` I `link`/`tekst`.
4. `cinjenicna_mapa` ne sadrži nijedan P4.
5. `strateska_procena.rizik_1_10` je čislo 1–10.

**Ako bilo šta od ovoga nedostaje → STOP. Javi korisniku.**

## Šta `krivica` radi sa paketom

1. Čita `jedna_stvar` → postavlja u prvih 3 pasusa dokumenta
2. Čita `cinjenicna_mapa` → svaku činjenicu ugrađuje sa odgovarajućom klasom i izvorom
3. Čita `argumenti.jaki` → ugrađuje kao glavne tačke argumentacije
4. Čita `praksa` → ugrađuje parafrazirano sa „vid. [sud] [broj]" internim referencama
5. Čita `strateska_procena.preporuka` → oblikuje predlog sudu

## Šta `krivica` NE radi

- Ne dodaje argumente koji nisu u paketu.
- Ne menja klasifikaciju tvrdnji.
- Ne pretražuje dodatnu praksu (to je posao `istrazivanje-prakse`).
- Ne prava sopstvenu teoriju slučaja.

## Fallback: kad nema handoff-a

Ako `krivica` prima zahtev bez handoff-a (npr. korisnik traži blanko akt), radi u **fallback režimu**:

1. Obavesti korisnika: „Nema pravna-analiza handoff-a. Kvalitet će biti niži nego u punom režimu."
2. Traži minimum: tip akta, stranke, osnov, ključne činjenice.
3. I dalje delegira pretragu prakse u `istrazivanje-prakse`.
4. Compliance izveštaj eksplicitno navodi: „K0: ⛔ handoff nije primljen, fallback režim."
