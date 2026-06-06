# 01 — Predlog za CLAUDE.md (globalno i po projektu)

Ovaj dokument sadrži dva nivoa predloga:

1. **Globalni nivo** — ide u `~/.claude/CLAUDE.md`. Važi za sve repozitorijume na mašini korisnika.
2. **Projektni nivo** — ide u `<repo>/CLAUDE.md`. Specifičan za projekat.

Granica korisnosti je važna: istraživanje pokazuje da model pouzdano prati oko 150 distinktnih instrukcija. Sistem prompt Claude Code-a već zauzima ~50, pa ostaje ~100 slotova za korisnikova pravila. Ne prepunjavati.

---

## A. Globalni CLAUDE.md (predlog)

```markdown
# Globalna pravila za Claude (sve sesije)

## Jezik

- Komunikacija sa korisnikom ide **isključivo na srpskom jeziku, latinica**.
- Ne koristiti hrvatski, bosanski ili crnogorski varijetet.
- Tehnički termini (commit, push, pull request, branch, hook, prompt, tool, skill)
  ostaju na engleskom — ne prevoditi ih nasilno.
- Imena fajlova, naredbe, kod — na engleskom, nepromenjeno.

## Anti-halucinacije

- Dozvoljeno reći „Ne znam" — bolje od izmišljanja.
- Nikad ne izmišljati URL-ove, citate, brojeve verzija, statistiku, imena fajlova.
- Za sveže biblioteke i SDK-ove, koristiti `context7` MCP server
  (`resolve-library-id` + `query-docs`) pre nego što se odgovori iz pamćenja.
- Datume i činjenice koje brzo zastare uvek označiti sa „proveriti".
- Detalji: videti `03-ANTI-HALUCINACIJE.md` u repou koji ima ovu strukturu.

## Modeli (default izbor)

- Složeni zadaci (arhitektura, debugging, refaktor više fajlova): Claude Opus 4.7+
- Rutinski razvoj, code review, manje izmene: Claude Sonnet 4.6+
- Brze provere, kratki upiti, formatiranje: Claude Haiku 4.5+
- Kad korisnik traži „brzo", ne snižavati model — koristiti Fast Mode (Opus + brži output).

## Guardrails (sažeto, detalji u 02-GUARDRAILS.md)

- Sve destruktivne radnje traže eksplicitnu potvrdu pre izvršenja.
- Nikad `git push --force` na main/master.
- Nikad `--no-verify` osim ako korisnik eksplicitno traži.
- Nikad menjati `git config` bez dozvole.
- Nikad commit-ovati `.env`, kredencijale, ključeve, sertifikate.
- GitHub MCP: samo unutar dozvoljenih repozitorijuma.

## Stil komunikacije

- Sažeto. Bez nepotrebnih uvoda („Naravno, evo...", „Dobro pitanje").
- Bez emodžija (osim ako korisnik traži).
- Bez nepotrebnih komentara u kodu — kod treba da bude samodokumentujući.
- Plan ide pre koda, ali samo ako zadatak ima više od trivijalnog obima.

## Steelman protokol

- Kad se ne slažem sa korisnikom ili kad postoji više pristupa:
  prvo parafraziram njegov stav u najjačoj verziji,
  pa onda iznosim analizu i preporuku.
- Detalji: `04-STEELMAN.md`.

## Reference

Kad postoji folder `docs/trajna-memorija/` u repou — to je proširenje
ovih pravila. Konsultovati ga za detalje, smetnice, primere.
```

**Veličina globalnog CLAUDE.md**: ~50 linija. Ostavlja prostor za projektna pravila.

---

## B. Projektni CLAUDE.md (predlog za mmisic90/1)

Ne prepisivati postojeći `CLAUDE.md` u korenu repoa. Umesto toga, **dopuniti ga** sledećim blokom (ili napraviti odluku da se postojeći zameni — to je korisnikova odluka).

```markdown
# Pravila ovog projekta (dopuna globalnim)

## Reference na trajnu memoriju

Ovaj projekat ima detaljne smernice u folderu `docs/trajna-memorija/`.
Pre značajnih radnji konsultovati:

- `docs/trajna-memorija/02-GUARDRAILS.md` — pre destruktivnih radnji
- `docs/trajna-memorija/03-ANTI-HALUCINACIJE.md` — pre tvrdnji o spoljnim činjenicama
- `docs/trajna-memorija/05-SKILLS-TOOLS-PREGLED.md` — pre poziva skills/tools
- `docs/trajna-memorija/06-SETTINGS-HOOKS-PREDLOG.md` — ako se traži „uvek X"

## Razvoj i testovi (specifično za mmisic90/1)

- `npm test` mora proći pre svakog commit-a.
- Vitest sa jsdom; nema bundler-a, nema build koraka.
- Karusel: `src/carousel.js`, ideje: `src/ideas.js`. Detalji u glavnom CLAUDE.md.
- Remote (`remote.html`) nema testove — ako se dodaje netrivijalna logika,
  izdvojiti je u `src/` i testirati.

## Git workflow (specifično za ovaj repo)

- Branch naming: `feature/<opis>`, `fix/<opis>`, `chore/<opis>`,
  ili `claude/<opis>-<5char-id>` (za Claude Code on the web sesije).
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`.
- Atomski commit-ovi, fokusirana izmena po commit-u.
- Push uvek sa `git push -u origin <branch>`.
- PR uvek draft prvo (može se kasnije promoviše).

## Šta NE raditi u ovom repou

- Ne commit-ovati `node_modules/`, `coverage/`, `.env`, generisane artefakte.
- Ne dodavati linter/formatter sada — projekat svesno nema build alate.
- Ne uvoditi TypeScript ili JSX — ostaje vanilla JS sa ES modulima u `src/`.
- Ne dodavati framework dependencies — vitest i jsdom su jedine devDependencies.
```

**Veličina projektnog CLAUDE.md (samo ovaj blok)**: ~35 linija. Sa postojećim sadržajem ostaje ispod 200 linija ukupno.

---

## C. Šta NIJE u predlogu (i zašto)

Iz istraživanja najboljih praksi izvedeni su sledeći zaključci o tome šta **NE pripada** u CLAUDE.md:

| Ne dodavati | Razlog |
|-------------|--------|
| Code style guidelines (2 spaces, single quotes, etc.) | Linter/formatter to radi bolje i brže |
| „Budi senior inženjer", „misli step-by-step" | Generičke fraze ne sprečavaju konkretne greške |
| Detalje koje model može sam da otkrije čitanjem koda | Troše budžet instrukcija bez koristi |
| Lista svih biblioteka iz `package.json` | Postoji u `package.json`, model čita to |
| Personality instrukcije („budi prijateljski") | Bez merljivog efekta na ishod |

**Zauzeti slot u CLAUDE.md mora pristajati pravilu, ne navici.**

---

## D. Hijerarhija (kad se konflikt javi)

Claude Code primenjuje sledeću hijerarhiju (od najjače ka najslabijoj):

1. `.claude/settings.json` hookovi (PRINUDA)
2. Projektni `CLAUDE.md`
3. Globalni `~/.claude/CLAUDE.md`
4. Personal/gitignored `CLAUDE.local.md`
5. Sistem prompt Claude Code-a (default ponašanje)

Specifičniji nivo nadjača opštiji nivo u slučaju konflikta. Zato je ovaj predlog razdeljen na global + projekat — projekat tačno menja samo ono što mora.

---

## E. Održavanje i revizija

- **Kvartalni pregled** (preporuka iz Anthropic guideline-a):
  - Da li sve komande iz CLAUDE.md i dalje rade?
  - Da li je neko pravilo postalo nepotrebno jer CI to već radi?
  - Da li su opisi arhitekture i dalje tačni?
  - Da li su sekcije o ukinutim funkcionalnostima obrisane?

- **Test pravila**: napravi 3–5 reprezentativnih upita. Ako Claude konzistentno krši pravilo, ono je ili nejasno, ili na pogrešnom mestu, ili u konfliktu sa drugim pravilom.

- **Verziona kontrola**: svako pravilo dolazi sa kratkim opisom „zašto" u commit poruci. Bez konteksta, kasnije ne znaš da li je pravilo i dalje važno.
