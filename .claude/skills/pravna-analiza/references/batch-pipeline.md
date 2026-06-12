# BATCH pipeline — pun protokol (relocirano iz SKILL.md v4.1 — VERBATIM)

Učitava se OBAVEZNO čim u zadatak uđe 2+ predmeta. Dashboard se ažurira posle
SVAKOG dokumenta; korisnik ga dobija na „status" / „koliko još".

---

## BATCH REŽIM — STRUKTURIRAN PIPELINE

### KORAK 1: PRIJEM I KLASIFIKACIJA
```
╔════════════════════════════════════════════════╗
║ BATCH PRIJEM                                    ║
╠════════════════════════════════════════════════╣
║ Primljeno: [N] predmeta                         ║
║                                                ║
║ KLASIFIKACIJA (automatska):                    ║
║ #1: [stranka] → TIP: [tužba/izvršenje/žalba]   ║
║     OBLAST: [parnica/krivica/izvršenje]          ║
║     HITNOST: [rok za X dana]                   ║
║     VSP: [iznos]                                ║
║ #2: ...                                        ║
║ #N: ...                                        ║
╠════════════════════════════════════════════════╣
║ GRUPE „ISTE PRIRODE":                          ║
║  Grupa A: #1, #3, #7 (tužbe naplata)           ║
║  Grupa B: #2, #5 (izvršenja)                    ║
║  Grupa V: #4, #6 (različiti) → pune faze       ║
╚════════════════════════════════════════════════╝
```

**KRITERIJUMI „ISTE PRIRODE":**
- Isti tip dokumenta (tužba, izvršenje, žalba)
- Ista oblast prava
- Ista struktura potraživanja (npr. sve fakturne naplate)
→ Ako 2 od 3 ispunjena = ista priroda → skraćene faze za 2+
→ Ako 1 ili 0 = različita → pune faze za svaki

### KORAK 2: PRIORITIZACIJA
```
REDOSLED OBRADE:
══════════════════════════════════════════

PRIORITET 1 — HITNI (rok < 5 dana):
  [predmet] → ROK: [datum] → ODMAH

PRIORITET 2 — VISOKI VSP (>500.000 din):
  [predmet] → VSP: [iznos] → pune faze

PRIORITET 3 — SLOŽENI (krivica, upravno):
  [predmet] → pune faze

PRIORITET 4 — STANDARDNI (tužbe naplata, izvršenja):
  [predmeti iz iste grupe] → skraćene faze
```

### KORAK 3: OBRADA
```
ZA SVAKU GRUPU:
  1. PRVI u grupi → PUNE FAZE 0-6
  2. OSTALI iste prirode → SKRAĆENO:
     F0: 10 sekundi (samo stranke i iznos)
     F1: Samo brojeve/datume/imena (POJEDINAČNO, nikad copy-paste)
     F2: Samo ako nešto ODSTUPA od prvog
     F3: Primeni iste argumente, prilagodi činjenice
     F4: PRESKOČI (već urađeno za prvi)
     F5: PRESKOČI (ista „Jedna stvar")
     F6: Generiši + verifikuj brojeve/imena/datume

ZA RAZLIČITE:
  → Pune faze za svaki. Bez prečica.
```

### KORAK 4: ERROR RECOVERY
```
AKO DOKUMENT PADNE ISPOD 80%:
  → IZOLUJ — ne zaustavljaj ceo batch
  → Označi ⚠️ u dashboard-u
  → Nastavi sa ostalima
  → Na kraju: vrati se na problematične
  → Saopšti korisniku: „Predmet #X zahteva dodatnu proveru"

AKO DETEKTUJEŠ PAD KVALITETA KROZ BATCH:
  (npr. #1 = 95%, #2 = 90%, #3 = 82%, #4 = 75%)
  → god-skill 8A detektuje trend pada
  → STOP. Pauziraj. Obavesti korisnika.
  → Mogući uzrok: zamor konteksta, mešanje podataka
  → Rešenje: restartuj F1 za naredne predmete
```

### KORAK 5: DASHBOARD
```
╔═══════════════════════════════════════════════════╗
║ BATCH DASHBOARD — [datum]                         ║
╠═══════════════════════════════════════════════════╣
║ #  │ Tip           │ Stranka        │ Ocena  │ ⏱  ║
║────┼────────────────┼────────────────┼────────┼────║
║ 1  │ Tužba naplata  │ Petrović d.o.o.│ 🟢 92% │ ✅ ║
║ 2  │ Izvršenje       │ Marković       │ 🟢 88% │ ✅ ║
║ 3  │ Žalba krivica  │ Bognić V.      │ 🟡 74% │ ⚠️ ║
║ 4  │ Tužba naplata  │ Jovanović      │ 🟢 95% │ ✅ ║
║ 5  │ Upravno        │ Stevikić       │ ⏳ —   │ 🔄 ║
╠═══════════════════════════════════════════════════╣
║ ZAVRŠENO: [X]/[N] │ PROSEK: [Y%]                 ║
║ ⚠️ ZA PROVERU: #3 (ispod praga)                  ║
║ TREND: [stabilan/pada/raste]                      ║
╚═══════════════════════════════════════════════════╝
```

**PRAVILO:** Dashboard se ažurira posle SVAKOG dokumenta.
Korisnik ga vidi kad god kaže „status" ili „koliko još".

---
