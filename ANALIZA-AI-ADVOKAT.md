# Konkurentska analiza: AI Advokat (ai-advokat.co)

Datum istraživanja: 11. jun 2026.
Metod: 5 paralelnih istraživačkih pravaca (proizvod, firma/cene, tehnologija/privatnost, marketing/reputacija, konkurentski pejzaž). Sajt blokira AI botove (403 preko robots.txt), ali je živi sadržaj čitan direktno, uključujući dokumentaciju (/docs) i javni backend API sa cenovnikom. Tvrdnje su razdvojene na potvrđene činjenice i pretpostavke.

---

## Rezime

AI Advokat je **veoma mlad beogradski startap (2025)** koji jedini u Srbiji spaja
practice-management (predmeti, klijenti, rokovi, fakturisanje) sa agentic AI
asistentom za advokate. Proizvod je tehnički ozbiljnije postavljen nego što bi
se očekivalo za fazu u kojoj je (native mobilne aplikacije, RAG, PII maskiranje,
uredan cenovnik), ali **nema gotovo nikakvu tržišnu trakciju** (10+ instalacija
na Google Play, 0 recenzija bilo gde, bez medijskog pokrivanja) i nosi nekoliko
ozbiljnih protivrečnosti između marketinga i stvarnosti koje konkurent može
direktno iskoristiti.

---

## 1. Proizvod i funkcije

Pozicioniranje: *„Pravni AI je prozor za chat. AI Advokat vodi celu kancelariju."*

**AI asistent (agentic):**
- „Tool router" sa 40+ akcija: kreira zadatke, menja status predmeta, sastavlja
  nacrte podnesaka/dopisa, čita podatke predmeta, pretražuje pravne izvore,
  analizira PDF i izvlači rokove; prilozi (PDF/Word/slika), streaming odgovori
- Dva moda: globalni asistent i „Case Space" (kontekst jednog predmeta)
- RAG nad internom bibliotekom pravnih izvora sa citiranjem (tehnički potvrđeno
  kroz admin API endpointe za re-embedding)

**Practice-management:**
- Case Space: dual-pane (levo AI, desno 11 panela — strane, dokumenti, ročišta,
  zadaci, fakture, troškovi, sud, aktivnost)
- Klijenti: baza fizičkih (JMBG) i pravnih lica (PIB/MB)
- Kalendar i rokovi: automatsko izvlačenje rokova iz primljenih dokumenata
- Evidencija vremena i fakturisanje (status faktura, proračun tarife)
- 14 izveštaja (finansijski, operativni, timski)
- 6 fiksnih uloga; AI dostupan samo Admin/Partner/Advokat/Pripravnik
- Obaveštenja: 3 kanala × 9 tipova okidača

**Mobilne aplikacije:** native iOS (App Store, v2.0.0) i Android
(`com.lawyerai.mobile`, izdavač INFOGRAM); biometrija, push, AI razgovor, 6 jezika.

**Integracije:** Portal pravosuđa RS (automatsko povlačenje ročišta i odluka po
broju predmeta), Službeni glasnik RS, Paddle (naplata), Sentry.

**Ključno ograničenje:** integracije Službeni glasnik i Portal pravosuđa rade
**samo za Srbiju** — za ostale jurisdikcije opcija je sakrivena „po dizajnu".

## 2. Tržišta i jezici

- Sajt na 6 jezika: sr (podrazumevani), en, hr, bs, sl, mk (potvrđeno hreflang-om)
- Tvrde „7 jurisdikcija": RS, HR, BA, ME, SI, MK, EU — AI „treniran na lokalnim
  propisima i sudskoj praksi regiona"
- **Realna dubina van Srbije je upitna**: sve što je proverljivo vezano za
  konkretnu državu (glasnik, sudski portal) postoji samo za RS; pokrivenost
  ostalih tržišta je verovatno znatno plića nego što marketing sugeriše

## 3. Cene (potvrđeno iz javnog API-ja `rest.ai-advokat.co/api/v1/subscription-plans`)

Sve u EUR bez PDV-a, naplata preko Paddle-a (kartica, PayPal, transfer):

| Plan | Mesečno | Godišnje | Trial | Korisnici | Aktivni predmeti | Dok./predmet | Nedeljni AI tokeni |
|---|---|---|---|---|---|---|---|
| LITE | 14,99 € | 149,99 € | 30 dana | 2 | 15 | 3 | 1,5M |
| PRO | 39,99 € | 399,99 € | 30 dana | 5 | 60 | 50 | 3,8M |
| MAX | 99,99 € | 999,99 € | — | 15 | 100 | ∞ | 9,5M |
| ENTERPRISE | 299,99 € | 2.999,99 € | — | 30 | ∞ | ∞ | 28,5M |

- Godišnje ≈ 10× mesečne cene (~17% popusta); 30-dnevna garancija povraćaja
  novca na prvu uplatu; trial bez kartice — ali **samo za LITE/PRO**
- AI kapacitet = nedeljni token limit **zajednički za celu kancelariju**; kad se
  potroši, AI ne radi do reseta
- Enterprise dodaje API, SSO, SLA 99,9%, account managera
- Nedoslednosti: /docs negde kaže „dnevni" limit (API kaže nedeljni); marketing
  stranice još koriste stare nazive planova (Starter/Professional/Enterprise)

## 4. Firma

- **Operater: „E-Software"**, Repiška 45/2, Čukarica, Beograd; MB 66861996,
  PIB 113489998; merodavno pravo Srbije, sud u Beogradu (iz /terms i /gdpr)
- Izdavač mobilnih aplikacija: **INFOGRAM DOO Beograd** (reg. 2011, delatnost
  6201, direktor Zoran Stevović — CompanyWall)
- Proizvod nastao 2025; pobeda na **DigiCon Youth** (studentsko takmičenje FON
  Digital-a) — samoproklamovana, bez nezavisne potvrde
- **Osnivači i tim anonimni** — nigde nijedno ime; `sameAs: []` u schema.org;
  nema podataka o finansiranju → najverovatnije bootstrapped, vrlo mali tim
  (otvoreni oglasi za Frontend/Backend/AI-ML developere)

## 5. Tehnologija

- **Nema sopstveni foundation model**: GDPR stranica odaje eksternog provajdera
  — *„Provajder: AI (Francuska, EU)"* sa namerno izostavljenim imenom; gotovo
  sigurno **Mistral AI**. Marketinška tvrdnja „AI Advokat JESTE AI model,
  treniran na propisima" realno znači RAG + eventualno fine-tuning
- Stack: Cloudflare ispred svega; marketing sajt Next.js; aplikacija React/Vite
  SPA (`app.ai-advokat.co`); odvojeni servisi `rest.` (API) i `ai.`
- Stvarni cloud iza Cloudflare-a neutvrdiv spolja; tvrdnja „EU data centri sa
  ISO 27001" neverifikovana

## 6. Sigurnost i privatnost (tvrdnje sa sajta)

**Dobro postavljeno na papiru:**
- AES-256-GCM at rest, searchable encryption, TLS 1.3, rotacija ključeva, 2FA,
  pen testing, DPIA, prijava povrede u 72h
- **PII maskiranje pre svakog AI poziva** (JMBG, imena, kontakti →
  placeholderi); „AI model nikada ne vidi originalne lične podatke"
- Obrada „isključivo u EU, bez transfera van EEA"; GDPR + ZZPL; DPO kontakt;
  brisanje podataka 30 dana po gašenju naloga

**Rupe:**
- **Nema eksplicitne no-training klauzule** (samo „privremena obrada")
- **Advokatska tajna se nigde ne pominje** — sve uokvireno samo kroz GDPR/ZZPL
- Ime AI podobrađivača sakriveno → advokat kao rukovalac ne može da uradi due
  diligence; nema objavljenog DPA ni liste podobrađivača
- Paradoks: firma registrovana u Srbiji (van EU/EEA), a prodaje „obradu
  isključivo u EU"

## 7. Marketing i pozicioniranje

- Slogani: „Automatizuj advokatsku kancelariju. Vrati sebi sate." / „Vi se
  bavite pravom, ne administracijom."
- Argumenti: anti-halucinacije („Kad navede član — taj član postoji"),
  privatnost (PII maskiranje, EU), „80% manje administracije", „10× brže"
- **Sajt je jedini ozbiljan kanal**: SEO-optimizovan, višejezičan; **nema
  bloga** (/blog → 404), **nema društvenih mreža** na sajtu, **nema medijskog
  pokrivanja** (Netokracija, Startit, ITNetwork — ništa)
- Sekcija „Utisci advokata" učitava se dinamički i nije nezavisno proveriva

## 8. Reputacija i trakcija

- **Nezavisna reputacija praktično ne postoji**: nije izlistan na Trustpilot,
  Capterra, G2, Product Hunt; App Store 0 ocena; Google Play 10+ instalacija
  bez ocena; nijedna forumska/Reddit diskusija
- Ocena „4,8 (150 ocena)" postoji **samo u JSON-LD na njihovom sajtu** —
  u direktnoj koliziji sa nultim brojem nezavisnih recenzija
- Broj korisnika se nigde ne navodi; nema poznatih klijenata ni partnerstava
  sa advokatskim komorama

## 9. Protivrečnosti i napadne tačke

1. **Marketing vs. ugovor o tačnosti**: sajt — „ne izmišlja citate"; uslovi
   korišćenja — ne garantuju „tačnost AI analize u svim slučajevima", usluga
   as-is, odgovornost ograničena na 12 meseci uplata, sav rizik halucinacija
   na korisniku
2. **„Sopstveni model" vs. eksterni provajder** (Mistral, skriven pod „AI")
3. **„7 jurisdikcija" vs. integracije samo za Srbiju**
4. **Samodeklarisana ocena 4,8/150 vs. nula stvarnih recenzija**
5. **Anoniman tim** — za profesiju zasnovanu na poverenju, advokat ne zna ni
   ko vodi firmu kojoj poverava spise predmeta
6. **Bez advokatske tajne u pravnim dokumentima**; bez no-training klauzule;
   skriven podobrađivač
7. **Token limit zajednički za kancelariju** — veće kancelarije mogu udariti
   u plafon usred nedelje
8. Operativna nezrelost: nedoslednosti u dokumentaciji (dnevni/nedeljni limit,
   stari nazivi planova), placeholder datumi politika

## 10. Konkurentski pejzaž (ex-YU)

| Alat | Tržište | Tip | Ciljna grupa | Cena | Snaga | Slabost |
|---|---|---|---|---|---|---|
| **AI Advokat** | SR (+5 jezika) | Practice-mgmt + AI | Advokati | 15–300 €/mes | Jedini SR „sve-u-jednom"; privatnost narativ | Mlad, bez trakcije, integracije samo RS |
| Zakon.ai | HR | AI research/Q&A | Pravnici + građani | 30–100 €/mes | Brend Zakon.hr | Nema workflow |
| Yure.ai | HR | AI workspace | Advokati, korporacije | nejavno | 300k+ odluka, INA i top uredi | Samo HR/EU |
| Ulpian AI | HR (→AT/DE) | AI research | Top uredi, banke | nejavno | Anti-halucinacije, EU ambicija | Bez malih kancelarija, bez mgmt-a |
| Factum.law | MK/EU | AI research + dokumenti | Pravnici, firme | 345–980 €/god | 15+ jurisdikcija, jeftin | Plitka lokalizacija |
| Paragraf AI | SR | AI nad pravnom bazom | Pretplatnici Paragrafa | 12.900–46.900 RSD krediti | 500k+ dokumenata, distribucija | Vezan za skupu pretplatu |
| Norma AI / CicaPravnica | SR | Consumer chatbot | Građani | freemium | Pristupačnost | Nisu profesionalni alati |
| UstavAI | BiH | AI Q&A (4 nivoa prava) | Građani | besplatno | Jedini u BiH | Građanski fokus |
| Kruna.ai | CG | AI CRM za kancelarije | Advokati CG | trial | Tarifa CG, lokalna dubina | Samo CG |
| Legora / Harvey | global | Enterprise workspace | Velike firme (Schoenherr) | enterprise | Kapital, kvalitet | Bez lokalnih baza, preskupi |
| ChatGPT | global | Generalni LLM | Svi | 0–20 $/mes | Besplatan, poznat | Halucinacije, bez lokalnih baza |

**Strukturni kontekst:** AKS (Srbija) usvojila UIA/MUA smernice za AI —
oprezno-afirmativan stav, fokus na halucinacije i poverljivost; HOK (HR)
distribuira CCBE/CEPEJ vodiče. HR pod EU AI Act-om; Srbija još bez zakona o AI
(nacrt preslikava EU AI Act). Spremnost na plaćanje dokazana u profi segmentu
(Zakon.ai, Paragraf, Ulpian).

## 11. Praznine koje „aidvokat" može iskoristiti

1. **Transparentnost kao oružje br. 1** — imenovan tim, javne reference,
   imenovan AI provajder, objavljen DPA i lista podobrađivača, eksplicitna
   no-training klauzula i klauzula o advokatskoj tajni. Sve to AI Advokat nema
2. **BiH je prazno tržište** (samo UstavAI za građane) — prvi profesionalni
   alat sa entitetskim pravom (FBiH/RS/Brčko) nema konkurenciju; CG ima samo
   Krunu
3. **Niko ne pokriva ceo ex-YU iz jednog proizvoda** — „jedan workspace, četiri
   jurisdikcije" za kancelarije sa prekograničnim predmetima je nepokrivena niša
4. **Dubina sudske prakse u Srbiji** — niko u SR nema korpus uporediv sa
   Yure/Ulpian (HR); anti-halucinacijski narativ sa proverivim citatima još
   niko u SR ne drži kredibilno
5. **Cenovni vakuum ~20–30 €/mes za solo advokate** između besplatnog
   ChatGPT-a i Paragrafovih kredita
6. **Usklađenost sa AKS/CCBE smernicama kao prodajni argument** — komore su
   same legitimisale kriterijume (poverljivost, provera citata); proizvod koji
   se eksplicitno mapira na smernice dobija „pečat" koji konkurencija nema
7. **Lokalne integracije van RS** — AI Advokat je dokazao model (portal
   pravosuđa + glasnik), ali samo za Srbiju; replicirati za HR/BiH/CG pre njih
8. **Tarifni obračun po lokalnoj advokatskoj tarifi** (kao Kruna za CG) —
   AKS tarifa ugrađena u fakturisanje

---

## Izvori

- https://www.ai-advokat.co/ (+ /about, /terms, /privacy, /gdpr, /refund-policy, /careers, /docs/*)
- https://rest.ai-advokat.co/api/v1/subscription-plans (javni cenovnik)
- https://apps.apple.com/hr/app/ai-advokat/id6757699093
- https://play.google.com/store/apps/details?id=com.lawyerai.mobile
- https://www.companywall.rs/firma/infogram-doo-beograd/MMf5gL9q
- https://www.fondigital.org/digicon2026/
- https://www.netokracija.com/pravna-rjesenja-ai-hrvatska-zakon-yure-ulpian-231057
- https://forbes.dnevnik.hr/tech/razgovarali-smo-s-kreatorom-aplikacije-zakon-ai-koja-olaksava-snalazenje-u-sumi-propisa/
- https://zakon.ai/ · https://yure.ai/ · https://ulpian.eu/ · https://factum.law/
- https://www.paragraf.rs/paragraf-ai/ai-asistent-pravni-konsultant.html
- https://normaai.rs/ · https://cicapravnica.rs/ · https://interlexa.rs/ · https://ustav.ai/ · https://kruna.ai/
- https://aks.org.rs/sr_lat/smernice-za-upotrebu-sistema-vestacke-inteligencije-od-strane-advokata-mua/
- https://www.hok-cba.hr/hok/tehnicki-vodic-ccbe-a-o-primjeni-alata-i-modela-umjetne-inteligencije-u-odvjetnistvu/
- https://likemagicai.com/2025/07/18/how-ulpian-is-eating-legal-research-for-breakfast-and-giving-junior-lawyers-their-lives-back/
- https://legora.com/ · https://techcrunch.com/2026/04/30/legal-ai-startup-legora-hits-5-6-valuation-and-its-battle-with-harvey-just-got-hotter/
