# Nadograđena komparacija: AI Advokat (proizvod) vs aidvokat (skill-stack adv. Mišić)

Datum: 11. jun 2026. · Jezik: srpski, ekavica, latinica
Referenca „aidvokat" = stvarni skill-stack adv. Milana Mišića (ne Courtroom5 alati iz
ranije komparacije). Skilovi čitani direktno iz fajlova (✅П1): pravna-analiza v5,
deep_understanding_module, istrazivanje-prakse v6.2, verifikator v2.1.0, tuzba-parnica
v2.0, stil-pisanja v3.0.0, HANDOFF v7.

---

## 0. Suštinska razlika (drugačija VRSTA, ne drugačija verzija)

- **AI Advokat = proizvod (telo/infrastruktura).** SaaS practice-management + AI
  asistent: hosting, baza, multi-user, mobilne aplikacije, naplata (Paddle),
  integracija sudskog portala i Glasnika (RS), RAG nad lokalnim pravom (eksterni
  provajder „AI, Francuska" → verovatno Mistral, 🟡 nepotvrđeno).
- **aidvokat = motor (metodologija/rezonovanje).** Lanac od 7 skilova koji se
  izvršava UNUTAR Claude-a: god-skill-deep-reader → pravna-analiza (7 faza) →
  istrazivanje-prakse (8 slojeva) → krivica/tuzba-parnica/izvrsenje → stil-pisanja →
  verifikator. Nema proizvodnu infrastrukturu (nema bazu, multi-user, persistence
  van chata/memorije).

Zaključak u jednoj rečenici: **AI Advokat je telo bez vrhunskog motora; aidvokat je
vrhunski motor bez tela.** Komplementarni su, ne zamene.

## 1. Matrica kvaliteta (1–5)

| Dimenzija | AI Advokat | aidvokat (stack) |
|---|:--:|:--:|
| Dubina pravnog rezonovanja | 2–3 | 5 |
| Anti-halucinacija / verifikacija | 2 | 5 |
| Istraživanje sudske prakse | 3 | 4–5 |
| Izrada akata (drafting) | 4 | 4 |
| Workflow / infrastruktura (predmeti, kalendar, fakture) | 5 | 1 |
| Lokalizacija na srpsko pravo | 4 | 5 |
| Persistencija / stanje | 5 | 1 |
| Multi-user / kancelarija | 5 | 1 |
| Distribucija / dostupnost | 4 | 2 |
| Privatnost — infrastruktura (PII maskiranje, EU) | 4 | 3 |

### Gde aidvokat ubedljivo dobija (kvalitet mišljenja)
- **Dubina rezonovanja**: 7 faza (forenzičko čitanje, cross-reference, adversarial
  4 perspektive — sudija/protivnik/apelacija/ustavni+ESLJP, „jedna stvar", graf
  zavisnosti nezavisnih argumenata, kvantifikacija rizika 1–10, defeasible
  rezonovanje, practice maps, detekcija „tihih izmena"). AI Advokat: RAG + LLM koji
  „citira izvor" — nema adversarial sloj ni graf.
- **Verifikacija**: verifikator je NEZAVISAN sloj sa 5 protokola — mehanički DIFF
  reč-po-reč za datume/iznose/imena, OBAVEZAN web-search svakog citata, provera
  interpretacije (anti-misgrounding: „član kaže ‚može' a ja napisao ‚mora'"),
  honeypot test (namerno pitanje o nepostojećem detalju radi hvatanja sistemske
  halucinacije), cross-skill konzistentnost. AI Advokat: jedina zaštita je „citira
  izvor" + disclaimer u uslovima koji ne garantuje tačnost.
- **Klase pouzdanosti P1–P4** na svaku informaciju (⛔П4 = ne postoji → nikad se ne
  unosi). AI Advokat nema eksplicitnu skalu pouzdanosti izlaza.

### Gde AI Advokat ubedljivo dobija (proizvod)
- **On stvarno vodi kancelariju**: baza predmeta i klijenata, kalendar sa
  automatskim rokovima, fakturisanje, integracija portala pravosuđa RS, 14 izveštaja,
  native iOS/Android. aidvokat ništa od toga nema — generiše akt (markdown+HTML za
  copy-paste u Word), ali ne čuva predmet, ne fakturiše, ne podseća na rok.
- **Multi-user i distribucija**: SaaS koji više advokata koristi odmah; aidvokat je
  bespoke za stil adv. Mišića i traži ručno učitavanje skilova u Claude.
- **Privatnost-infrastruktura**: AI Advokat maskira PII pre AI poziva i drži obradu
  u EU. aidvokat radi na Claude platformi — podaci idu Anthropic-u, **bez
  automatskog PII maskiranja** (regresija na ovoj dimenziji; ublažavaju je rules,
  ali sloj ne postoji).

## 2. Najvažniji nalaz — kvalitetni klin

aidvokat ima jedno što AID Advokat **strukturno nema**: namenski, nezavisan
verifikacioni sloj (verifikator) sa honeypot-om, DIFF-om reč-po-reč i obaveznim
web-searchom svakog citata + anti-misgrounding. To je tačno odbrana od najopasnije
greške pravnog AI (misgrounding — stvaran izvor pogrešno protumačen, Stanford/JELS
2025). AI Advokat tu ima samo „citira izvor" i ogradu u ToS-u.

→ Marketinški klin za aidvokat: **„svaki citat se mehanički proverava i web-verifikuje;
rok se ne halucinira; honeypot hvata halucinaciju pre isporuke" — što AI Advokat ne
nudi.**

## 3. Strateška preporuka

Pobednički potez nije birati jedno — nego **umotati motor (skill-stack) u telo
(proizvod)**: Kancelarija app (Next.js 15 + Supabase + Vercel iz HANDOFF v7) kao
shell koji daje bazu predmeta/kalendar/fakture i poziva skill-lanac za rezonovanje i
verifikator za QA. Time aidvokat dobija AI Advokatov workflow, a zadržava kvalitet
mišljenja i verifikaciju koje AI Advokat nema.

Iskrene ograde za aidvokat (da se ne sakriju loše vesti, po pravilu skila):
- Nije proizvod — ne može se prodati drugim advokatima bez shell-a; vezan za stil
  jedne kancelarije.
- Zavisi od Claude-a (treća strana), bez kontrole rezidentnosti podataka i bez
  automatskog PII maskiranja.
- Ručni tok (učitavanje skilova, copy-paste u Word), bez baze predmeta.
- Nema trakciju/distribuciju (kao ni AI Advokat — obojica rani stadijum).

---

## 4. 🔎 VERIFIKACIONI NALAZ (verifikator v2.1.0, primenjen na OVU komparaciju)

```
PROTOKOL A (Činjenice — mehanička provera):
  Provereno tvrdnji: 9 ključnih
  ✅ Poklapanje: 7  │ 🟡 Delimično: 2  │ 🔴 Greška: 0
  Brojevi (cene 14,99/39,99/99,99/299,99 €; MB 66861996; PIB 113489998):
    provereni protiv ranijeg API/terms nalaza — slažu se ✅
  🟡 Delimično:
    (1) „Mistral" kao AI provajder — GDPR stranica kaže samo „AI (Francuska, EU)";
        Mistral je IZVEDENO (🟡П2), ne potvrđeno. Označeno u tekstu.
    (2) Skor „dubina rezonovanja AI Advokat 2–3" — procena iz dokumentacije, ne iz
        živog testa AI izlaza (iza paywalla). 🟡 procena, ne merenje.

PROTOKOL B (Eksterno — web/izvori):
  Tvrdnje o AI Advokatu oslonjene na raniji live-site/API nalaz (ovog poteza NISU
  ponovo pretražene) → ⛔ NISAM PONOVO PRETRAŽIO u ovoj sesiji; oznaka rizika.
  Tvrdnje o skil-stacku: čitane direktno iz fajlova ✅П1 (verifikator v2.1.0,
  pravna-analiza v5, istrazivanje-prakse v6.2, tuzba-parnica v2.0, stil-pisanja v3.0.0).

PROTOKOL V (Logika — stres test):
  Kontradikcija unutar dokumenta: NE (matrica interno konzistentna:
    nizak workflow/persistence/multi-user za aidvokat se slažu međusobno).
  Petit ↔ obrazloženje: N/A (nije pravni akt).

PROTOKOL G (Honeypot):
  H1: „Koliko korisnika AI Advokat navodi na sajtu?"
      Odgovor: broj korisnika se NIGDE ne navodi. → ✅ PROŠAO (nisam izmislio broj)
  H2: „Koja je adresa AI Advokat kancelarije u Zagrebu?"
      Odgovor: firma je u Beogradu (Čukarica); zagrebačka kancelarija ne postoji.
      → ✅ PROŠAO
  Sklonost ka halucinaciji: NIJE detektovana.

PROTOKOL D (Cross-skill): N/A — nije pokretan god-skill + pravna-analiza na pravnom
  predmetu; ovo je komparativna analiza, ne pravni akt.

────────────────────────────────────────────────
UKUPNA OCENA: 🟡 USLOVNO
  Razlog: 0 činjeničnih grešaka, ali 2 tvrdnje 🟡 (Mistral=izvedeno; skorovi AI
  Advokata = procena iz dokumentacije, ne iz živog testa) + podaci o AI Advokatu
  nisu re-verifikovani web-searchom ovog poteza.

ISPRAVKE PRE ISPORUKE:
  1. „Mistral" svuda označen kao 🟡 nepotvrđeno (izvedeno iz „AI, Francuska").
  2. Skorovi AI Advokata eksplicitno označeni kao procena, ne merenje živog izlaza.

👁️ SPOT-CHECK (provera za 2 minuta):
  ① Cena u API-ju: LITE 14,99 € / ENTERPRISE 299,99 €/mes — proveri na
     rest.ai-advokat.co/api/v1/subscription-plans.
  ② „AI (Francuska, EU)" na /gdpr stranici AI Advokata — potvrdi da NE imenuju
     provajdera (osnov za 🟡 oko Mistrala).
  ③ verifikator ima 5 protokola (A–D + nalaz) — proveri u SKILL.md koji si poslao.
```
