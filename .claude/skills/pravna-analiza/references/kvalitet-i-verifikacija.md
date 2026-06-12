# Kvalitet i verifikacija — Kompletan sistem kontrole

## SISTEM POUZDANOSTI ✅P1/🟡P2/🔴P3/⛔P4

### Definicije

**✅P1 — POTVRĐENO:** Doslovno pročitano na konkretnoj stranici dokumenta,
ili verifikovano pretragom (PropisSoft, VKS sajt).
- Primer: „Okrivljeni osuđen na 2 godine" (str. 24) ← ✅P1
- Primer: „Čl. 438 st. 1 tač. 11 ZKP" ← ✅P1 (proveren na PropisSoft)

**🟡P2 — VISOKO VEROVATNO:** Proizilazi iz dokumenta ali nije doslovno.
- Primer: „Rok za žalbu ističe 15.04.2023." (izračunato: presuda dostavljena
  31.03. + 15 dana) ← 🟡P2
- Primer: „Ukupno potraživanje: 500.000 din." (zbir 3 fakture) ← 🟡P2

**🔴P3 — REKONSTRUKCIJA:** Logički zaključak koji NE PROIZILAZI direktno.
- Primer: „Sud verovatno nije razmotrio olakšavajuće" (zato što ih
  detaljno ne pominje) ← 🔴P3
- Primer: „Okrivljeni je verovatno delovao u afektu" (na osnovu opisa
  događaja, ali sud to ne kaže) ← 🔴P3

**⛔P4 — NEPOZNATO/IZMIŠLJENO:** Informacija NE POSTOJI u dokumentu.
- Primer: „VKS Kzz 742/2023 — pravni stav" (nije nađeno pretragom) ← ⛔P4
- Primer: „Sud nije otvorio pretres" (a zapravo 7 pretresa navedeno) ← ⛔P4
- **⛔P4 informacije se NIKAD ne unose u dokument.**

### Pravila klasifikacije

1. U sumnji → klasifikuj NIŽE (🟡 umesto ✅, 🔴 umesto 🟡)
2. Ako tvrdnja može biti i ✅P1 i 🟡P2 — proveri ponovo i odluči
3. 🔴P3 tvrdnje MORAJU biti označene za korisnika
4. ⛔P4 ZABRANJENO u dokumentu — čak i sa oznakom

---

## VERIFIKACIONI IZVEŠTAJ

Posle SVAKOG generisanog dokumenta:

```
╔══════════════════════════════════════════════════╗
║ VERIFIKACIONI IZVEŠTAJ                            ║
║ Dokument: [naziv]                                 ║
║ Datum: [današnji]                                  ║
╠══════════════════════════════════════════════════╣
║ UKUPNO TVRDNJI: [N]                               ║
║                                                    ║
║ ✅P1 POTVRĐENO:       [n] tvrdnji ([X]%)          ║
║ 🟡P2 VISOKO VEROV.:   [n] tvrdnji ([X]%)          ║
║ 🔴P3 REKONSTRUKCIJA:  [n] tvrdnji ([X]%)          ║
║ ⛔P4 NEPOZNATO:       [n] tvrdnji ([X]%)          ║
╠══════════════════════════════════════════════════╣
║ UKUPNA OCENA:                                     ║
║  >85% ✅ → 🟢 VISOK KVALITET                      ║
║  70-85% ✅ → 🟡 SREDNJI (preporuka provere)        ║
║  <70% ✅ → 🔴 NIZAK (obavezna provera)             ║
╠══════════════════════════════════════════════════╣
║ „JEDNA STVAR": [da li je u dokumentu? na kojoj    ║
║  poziciji?]                                        ║
║ GRAF: [nezavisnih argumenata: X od Y ukupno]      ║
║ KRITIČNA TAČKA: [činjenica od koje zavisi najviše  ║
║  argumenata, ako postoji]                          ║
╠══════════════════════════════════════════════════╣
║ MATRICA RIZIKA (iz F3.6):                         ║
║  Pravni: [X/10] Činjenični: [Y/10] Procesni: [Z/10]║
║  UKUPNO: [W/10] → [NIZAK/SREDNJI/VISOK]            ║
║  ROI: [vrednost/troškovi] → [vredi/uslovno/ne]     ║
╠══════════════════════════════════════════════════╣
║ ⚠️ TVRDNJE ZA PROVERU:                            ║
║  1. [tvrdnja] → proveriti [izvor]                   ║
║  2. [tvrdnja] → proveriti [izvor]                   ║
║  ...                                               ║
╠══════════════════════════════════════════════════╣
║ PROVERA OBRAZACA:                                  ║
║  G-[XX] prepoznat? [da/ne]                         ║
║  Z-[XX] izbegnut? [da/ne]                          ║
║  Rok proveren? [da/ne]                             ║
║  Nadležnost proverena? [da/ne]                     ║
║  Zastarelost proverena? [da/ne]                    ║
╚══════════════════════════════════════════════════╝
```

---

## REKURZIVNA VERIFIKACIJA

### Šta znači „rekurzivna"

Posle pisanja dokumenta, pročitaj ga KAO DA GA NIKAD NISI VIDEO.
Zamisli da si kolega advokat koji prvi put čita ovaj podnesak.

**Tri pitanja „svežim očima":**
1. Da li obrazloženje ima smisla bez poznavanja spisa?
2. Da li bih kao sudija znao šta se traži posle prva 2 pasusa?
3. Da li bi me nešto zbunilo ili iznenadilo?

### Provera konzistentnosti
- Da li petit ODGOVARA obrazloženju?
  (Npr. obrazloženje govori o čl. 438 ali petit traži preinačenje
  umesto ukidanje → GREŠKA)
- Da li se iznosi iz petita SLAŽU sa iznosima iz obrazloženja?
- Da li se imena stranaka TAČNO ponavljaju kroz ceo dokument?
  (Česta greška: na početku „Marković" a kasnije „Marinković")
- Da li su brojevi predmeta TAČNI svuda?

---

## BATCH KONTROLA — 10 DOKUMENATA

### Dashboard

```
╔═══════════════════════════════════════════════════╗
║ BATCH KONTROLA — [datum]                          ║
╠═══════════════════════════════════════════════════╣
║ #  │ Tip           │ Stranka        │ Ocena       ║
║────┼────────────────┼────────────────┼─────────────║
║ 1  │ Tužba naplata  │ Petrović d.o.o.│ 🟢 92% ✅  ║
║ 2  │ Tužba naplata  │ Marković d.o.o.│ 🟢 88% ✅  ║
║ 3  │ Predlog izvr.  │ Jovanović N.   │ 🟢 95% ✅  ║
║ 4  │ Žalba krivica  │ Bognić V.      │ 🟡 74% ⚠️  ║
║ 5  │ Ugovor zakup   │ Antika d.o.o.  │ 🟢 90% ✅  ║
║ 6  │ Katastar upis  │ Stevikić       │ 🟢 86% ✅  ║
║ ...│                │                │             ║
╠═══════════════════════════════════════════════════╣
║ PROSEK: [X]%                                       ║
║ ⚠️ Predmet #4 ispod praga → dodatna provera       ║
╚═══════════════════════════════════════════════════╝
```

### Pravila za batch

1. **Prvi predmet:** Pune faze 0-6. Prikazati korisniku.
2. **Iste prirode:** Skraćena F1 + F6. ALI: brojevi, imena,
   datumi → UVEK pojedinačno proveriti. NIKAD copy-paste činjenica.
3. **Različite prirode:** Pune faze za svaki.
4. **Dashboard:** Ažurirati posle svakog dokumenta.
5. **Ispod 80%:** Zaustavi se. Obavesti korisnika. Proveri pre nastavka.

### Tipične batch greške (izbegavati)

- Zamena imena stranaka iz prethodnog predmeta
- Copy-paste iznosa/datuma iz prethodnog predmeta
- Zaboravljen troškovnik (različit za svaki VSP)
- Pogrešan sud (različita nadležnost za različite tužene)
- Pogrešan izvršitelj (ako su u različitim područjima)

---

## PRAVILO „DA LI SI SIGURAN?"

Ako korisnik pita „Da li si siguran?":

**ZABRANJENO:** „Da, siguran sam" / „100%" / „Apsolutno"

**OBAVEZNO:**
```
ŠTA: [konkretna tvrdnja o kojoj se pita]
PROVERENO: [da/ne]
  Ako DA → GDE: [stranica/izvor/link]
  Ako NE → „Nisam proverio. Baziram na [X]. Da pretražim?"
NIVO: [✅P1 / 🟡P2 / 🔴P3]
MOGUĆE GREŠKE: [šta može biti netačno]
```

---

## FINALNA PROVERA — 10 PITANJA

Pre dostavljanja BILO KOG dokumenta korisniku:

```
1. Da li bih mogao da odbranim SVAKU rečenicu pokazujući izvor?
2. Da li sam pročitao CELI dokument (uključujući sredinu)?
3. Da li sam proverio članove zakona na PropisSoft-u?
4. Da li sam povezao UDALJENE činjenice (str. 5 ↔ str. 34)?
5. Da li sam simulirao SUDIJU, PROTIVNIKA i APELACIJU?
6. Da li znam šta je „JEDNA STVAR" i da li je PRVA u dokumentu?
7. Da li sam proverio ROKOVE, NADLEŽNOST i ZASTARELOST?
8. Da li postoji nešto LOŠE za klijenta što NISAM rekao?
9. Da li je graf argumenata zdrav (dovoljno nezavisnih)?
10. Da li bi advokat Mišić stao iza ovog dokumenta?

Ako BILO KOJI odgovor upozorava → ISPRAVI pre dostavljanja.
```
