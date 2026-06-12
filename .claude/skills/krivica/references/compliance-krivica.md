# Compliance izveštaj — `krivica` v2

> Ovaj fajl opisuje detaljan format mini compliance izveštaja koji `krivica` generiše posle svakog krivičnog akta. Izveštaj se dodaje **ISPOD** izveštaja od `pravna-analiza`, ne umesto njega.

## ZAŠTO POSTOJI POSEBAN KRIVICA COMPLIANCE

- `pravna-analiza` izveštaj pokriva **analitičke faze** (F0–F5).
- `krivica` izveštaj pokriva **specifične korake pisanja krivičnog akta** (K0–K11 iz SKILL.md).
- Bez oba, korisnik ne vidi kompletnu sliku kvaliteta.

## FORMAT

```
╔═══════════════════════════════════════════════════════════════╗
║ ⚖️ COMPLIANCE IZVEŠTAJ — KRIVICA v2                          ║
╠═══════════════════════════════════════════════════════════════╣
║ PREDMET: [naziv/broj]                                        ║
║ OKRIVLJENI: [ime]                                              ║
║ TIP AKTA: [#N — naziv]                                        ║
║ SUD/TUŽILAŠTVO: [naziv]                                      ║
║ GENERISANO: [datum i vreme]                                  ║
╠═══════════════════════════════════════════════════════════════╣
║ KORAK │ STATUS  │ KLJUČNI IZLAZ                              ║
║───────┼─────────┼───────────────────────────────────────────║
║ K0    │ ✅/⛔   │ Handoff od pravna-analiza:                ║
║       │         │  - primljen / nepotpun / nema              ║
║       │         │  - ako nepotpun → šta nedostaje           ║
║───────┼─────────┼───────────────────────────────────────────║
║ K0.1  │ ✅      │ Klasifikacija: tip #[N]                    ║
║       │         │  - izvor klasifikacije (handoff/upit)     ║
║───────┼─────────┼───────────────────────────────────────────║
║ K1    │ ✅/⏭️   │ Prikupljanje inputa:                         ║
║       │         │  - stranke: ✅                            ║
║       │         │  - sud: ✅                                ║
║       │         │  - specifični podaci po tipu: ✅         ║
║───────┼─────────┼───────────────────────────────────────────║
║ K1.2  │ ✅      │ Rok: [N] dana (čl. [zakon])               ║
║───────┼─────────┼───────────────────────────────────────────║
║ K1.3  │ ✅      │ Rok-alarm: 🟢/🟡/🔴/⛔                    ║
║       │         │  - dostavljeno: [datum]                    ║
║       │         │  - krajnji rok: [datum] do [vreme]         ║
║       │         │  - preostalo: [N] dana                    ║
║───────┼─────────┼───────────────────────────────────────────║
║ K2    │ ✅/⏭️   │ Reverse-engineering presude:              ║
║       │         │  - diskrepancija izreka/obrazloženje: [N] ║
║       │         │  - matrica greška → osnov: mapirano       ║
║       │         │  - „Jedna stvar" identifikovana: [da/ne]  ║
║───────┼─────────┼───────────────────────────────────────────║
║ K3    │ ✅/⛔   │ Delegacija u istrazivanje-prakse:        ║
║       │         │  - aktiviran: [da/ne]                     ║
║       │         │  - predate ključne reči: [lista]           ║
║       │         │  - primljeno odluka: [N]                   ║
║       │         │  - verifikovano: [M]                      ║
║       │         │  - odbačeno bez linka: [K]                ║
║───────┼─────────┼───────────────────────────────────────────║
║ K4    │ ✅      │ Šablon korišćen: [4.X — naziv]            ║
║ K4a   │ ✅      │ „Jedna stvar" u prvih 3 pasusa: [da/ne]   ║
║───────┼─────────┼───────────────────────────────────────────║
║ K5    │ ✅/⏭️   │ IPZ izjašnjenje: [urađeno/nije potrebno]    ║
║───────┼─────────┼───────────────────────────────────────────║
║ K6    │ ✅/⏭️   │ Troškovnik:                                ║
║       │         │  - tarifa verifikovana: [da/ne]           ║
║       │         │  - ukupno: [iznos] din.                   ║
║       │         │  - preskočeno jer: [razlog]              ║
║───────┼─────────┼───────────────────────────────────────────║
║ K7    │ ✅      │ Stil Mišić/Nedeljkov primenljen             ║
║───────┼─────────┼───────────────────────────────────────────║
║ K8    │ ✅      │ P1/P2/P3/P4 klasifikacija tvrdnji:         ║
║       │         │  ✅ P1: [N] ([%]%)                        ║
║       │         │  🟡 P2: [N] ([%]%)                        ║
║       │         │  🔴 P3: [N] ([%]%) — svi markirani        ║
║       │         │  ⛔ P4: [N] — MORA BITI 0                 ║
║───────┼─────────┼───────────────────────────────────────────║
║ K9    │ ✅      │ .docx generisan:                           ║
║       │         │  - putanja: [/mnt/user-data/outputs/...]   ║
║       │         │  - validate.py: [✅/❌]                  ║
║       │         │  - ime fajla: [stranka.... .docx]         ║
║───────┼─────────┼───────────────────────────────────────────║
║ K11   │ ✅/⛔   │ Predaja u verifikator: [izvršeno/čeka]   ║
╠═══════════════════════════════════════════════════════════════╣
║ ✅ ČEKLISTA (mora biti sva ✅ pre dostavljanja):              ║
║  [✓] Tip akta pravilno određen                              ║
║  [✓] istrazivanje-prakse delegacija izvršena                ║
║  [✓] Svaka citirana odluka ima link/pasted tekst           ║
║  [✓] Pravni osnov tačno naveden                              ║
║  [✓] Rok ispoštovan                                          ║
║  [✓] Svaki činjenični navod ima DOKAZ:                       ║
║  [✓] Nijedan P4 u dokumentu                                 ║
║  [✓] Svi P3 eksplicitno markirani kao tvrdnja odbrane       ║
║  [✓] „Jedna stvar" u prvih 3 pasusa                         ║
║  [✓] Predlog sudu jasan i konkretan                          ║
║  [✓] Ćirilica kroz ceo akt                                  ║
║  [✓] Potpis, mesto, datum                                    ║
║  [✓] Akt napisan sa strane odbrane                          ║
║  [✓] .docx validiran                                         ║
║  [✓] verifikator aktiviran za DIFF                           ║
╠═══════════════════════════════════════════════════════════════╣
║ ⚠️ ZA RUČNU PROVERU (Milan, 2 minuta):                      ║
║  ① [tvrdnja/broj/citat] → [stranica izvora]                  ║
║  ② [tvrdnja/broj/citat] → [stranica izvora]                  ║
║  ③ [tvrdnja/broj/citat] → [stranica izvora]                  ║
╠═══════════════════════════════════════════════════════════════╣
║ 📊 FINALNA OCENA KRIVICA: [%]                               ║
║ 📊 STATUS: [GOTOVO / NA PROVERI / BLOKIRANO]               ║
║                                                               ║
║ AKO JE BLOKIRANO → RAZLOG:                                   ║
║ [šta treba da se uradi da se deblokira]                     ║
╚═══════════════════════════════════════════════════════════════╝
```

## KRITERIJUMI ZA FINALNU OCENU

| Ocena | Uslov |
|---|---|
| 95–100% | Svi koraci ✅, 0 P4, 0 P3 neotkrivenih, verifikator ✅ |
| 85–94% | Svi koraci ✅, 0 P4, 1–2 stavke u „za ručnu proveru" |
| 70–84% | 1 korak ⏭️ sa opravdanjem, 0 P4 |
| 50–69% | 2 koraka ⏭️, potencijalna praznina |
| < 50% | BLOKIRANO — ne šalje se korisniku bez korekcije |

## AKCIONE PORUKE

### Ako K0 = ⛔ (nema handoff-a)
```
⚠️ RADIM U FALLBACK REŽIMU. Quality će biti niži nego sa 
pravna-analiza handoff-om. Ako imaš dokument za analizu, 
učitaj ga pa ću restartovati pun stack.
```

### Ako K3 = ⛔ (istrazivanje-prakse nije aktivan)
```
⛔ STAJEM. Ne pišem krivični akt bez verifikovane prakse.
Aktiviraj istrazivanje-prakse pa nastavljam.
```

### Ako K8 pokazuje P4 > 0
```
⛔ KRITIČNO. U dokumentu ima [N] tvrdnji klase P4 
(neproverene / potencijalne halucinacije). Dokument se 
NE ŠALJE korisniku dok se ne očisti. Vraćam se na:
- [lista P4 tvrdnji]
```

### Ako verifikator vrati DIFF ❌
```
⚠️ verifikator je našao [N] neslaganja između mog 
dokumenta i izvora. Ispravljam:
- [lista neslaganja]
```

## PRAVILA

1. Izveštaj je **obavezan** — nema kraja bez njega.
2. Izveštaj se prikazuje u čatu **odmah ispod** odgovora sa generisanim dokumentom.
3. Ako korisnik kaže „samo mi daj dokument bez izveštaja" → i dalje se prikazuje izveštaj. Ovo je defanzivni mehanizam protiv halucinacija.
4. „Za ručnu proveru" mora imati **minimum 3** stavke.
5. Ako nema nijedne stavke za ručnu proveru — to znači da nije razmišljano dovoljno, i cela operacija se vraća na `verifikator`.
