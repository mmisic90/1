# 00 — Pregled: Trajna memorija i guardrails za Claude

## Šta je u ovom folderu

Ovo je predlog **trajnih, modularnih smernica** za sve verzije i oblike Claude-a koje će se koristiti u ovom projektu (i prenosivo za bilo koji drugi). Cilj je jednom zabetonirati ponašanje, smanjiti halucinacije, postaviti jasne guardrails-e i propisati kako da se koriste skills i alati.

Sav sadržaj je na **srpskom jeziku, latinica**. Ne hrvatski, ne bosanski varijetet — samo standardni srpski.

## Mapa dokumenata

| Fajl | Šta rešava |
|------|-----------|
| `00-PREGLED.md` (ovaj) | Mapa, redosled čitanja, kako koristiti |
| `01-CLAUDE-PREDLOG.md` | Konkretan predlog za `CLAUDE.md` (global i project nivo) |
| `02-GUARDRAILS.md` | Sigurnosna pravila i operativna ograničenja |
| `03-ANTI-HALUCINACIJE.md` | Sedam zvaničnih Anthropic tehnika + proširenja |
| `04-STEELMAN.md` | Protokol za fer prikaz protivnog argumenta i strukturisano neslaganje |
| `05-SKILLS-TOOLS-PREGLED.md` | Pregled svih skills i MCP alata, kada koji, smetnice |
| `06-SETTINGS-HOOKS-PREDLOG.md` | `.claude/settings.json` hookovi — jedini mehanizam prinude |
| `07-IZVORI.md` | URL reference iz istraživanja, sve proverljivo |

## Redosled čitanja

1. Prvi prolaz — pročitaj `00` (ovo) i `01-CLAUDE-PREDLOG.md` da razumeš predlog.
2. Drugi prolaz — `02-GUARDRAILS.md` + `03-ANTI-HALUCINACIJE.md`. Tu je suština „bezbedno i bez izmišljanja".
3. Treći prolaz — `04-STEELMAN.md` da znaš format odgovora, pa `05-SKILLS-TOOLS-PREGLED.md` da znaš šta je dostupno.
4. Četvrti — `06-SETTINGS-HOOKS-PREDLOG.md` ako želiš da pretvoriš preporuke u prinudu (jedini način).
5. Po potrebi — `07-IZVORI.md` za verifikaciju činjenica.

## Kako ovo koristiti (3 koraka)

### Korak 1 — Postavi globalna pravila

Otvori (ili kreiraj) fajl `~/.claude/CLAUDE.md` i prenesi sekciju **„Global"** iz `01-CLAUDE-PREDLOG.md`. To važi za sve repozitorijume na tvojoj mašini.

### Korak 2 — Postavi projektna pravila

U korenu repoa (`mmisic90/1/CLAUDE.md`) dodaj sekciju **„Projekat"** iz `01-CLAUDE-PREDLOG.md` (ili je spoji sa postojećim CLAUDE.md). Reference na ovaj folder već su tu — Claude će ih učitati po potrebi.

### Korak 3 — Aktiviraj prinudu (opciono ali preporučeno)

Ako želiš da pravila budu **prinudna**, a ne samo preferenca, dodaj `.claude/settings.json` hookove iz `06-SETTINGS-HOOKS-PREDLOG.md`. Bez hookova, CLAUDE.md je samo savet — model može da ga ignoriše ako je dugačak ili kontradiktoran sa upitom.

## Suština u jednoj rečenici

> **CLAUDE.md savetuje, hooks prinuđavaju, skills se zovu, MCP alati postoje samo ako su konfigurisani.** Trajna memorija je kombinacija sva četiri sloja — ne jedan od njih sam.

## Granice predloga

- Ne menja postojeći `CLAUDE.md` u korenu repoa — ostaje kao referenca, korisnik bira da li i kako da ga ažurira
- Ne instalira ništa na sistemu korisnika — sve je dokumentacija + opcioni `.claude/settings.json`
- Ne pretenduje na izmenu ponašanja modela na nivou trening-a — to je van obima

## Verzija i revizija

- Verzija: 1.0
- Datum: 2026-06-06
- Granu: `claude/permanent-memory-guidelines-sAhWI`
- Sledeća revizija: po potrebi, ali ciljano kvartalno (preporuka iz Anthropic guideline-a)
