# 05 — Pregled skills i MCP alata: kada, kako, smetnice

Ovaj dokument je inventar **svih skills i MCP alata** koji su dostupni u Claude Code sesiji, sa preporukama kada ih koristiti, koja je preporuka za „trajnu" aktivaciju, i koje smetnice postoje (jer mnogo toga ne radi kako se na prvi pogled čini).

---

## A. Skills — šta su, kako se zovu

**Skill** je predefinisan paket uputstava (i ponekad podataka) koji se može pozvati iz sesije. Skills se pozivaju na dva načina:

1. Korisnik ukuca `/<naziv-skilla>` u poruci.
2. Claude pozove `Skill` tool sa imenom skilla (ako je dostupno).

**Ključna smetnja**: skills se **ne pokreću automatski**. Ne postoji „uvek pokreni X pre svake poruke" za skills. Ako želiš tu vrstu prinude, mehanizam je **hooks u settings.json**, ne skills.

### Pregled dostupnih skills u ovoj sesiji

| Skill | Namena | Kada se koristi | Preporuka za „trajnu" aktivaciju |
|-------|--------|-----------------|----------------------------------|
| `session-start-hook` | Pomoć pri postavljanju SessionStart hooka za Claude Code on the web | Inicijalizacija novog repoa za web sesije | Ne — to je setup skill, ne radi se često |
| `update-config` | Konfiguracija `.claude/settings.json` (hookovi, dozvole, env varijable) | Kad korisnik traži „uvek X" / „nikad Y" | Ne — pozvati po potrebi |
| `keybindings-help` | Customizacija `~/.claude/keybindings.json` | Rebind tastatura, chord shortcut | Ne — retka radnja |
| `simplify` | Pregled izmena za reuse, kvalitet, efikasnost | Posle značajne izmene koda | Da — kroz hook posle commit-a (vidi 06) |
| `fewer-permission-prompts` | Skenira transkript za česte read-only komande, dodaje allowlist | Kad permission prompts smetaju | Ne — jednokratna optimizacija |
| `loop` | Periodično pokretanje promptova ili slash komandi | „Pokreni X svakih 5 minuta" | Ne — situacijski alat |
| `claude-api` | Razvoj, debug, optimizacija aplikacija sa Anthropic SDK | Kad fajl importuje `anthropic` ili `@anthropic-ai/sdk` | Da — auto-trigger kroz hook ili pravilo |
| `init` | Inicijalizacija novog `CLAUDE.md` sa codebase dokumentacijom | Nov repo bez CLAUDE.md | Ne — jednokratno |
| `review` | Pregled pull request-a | Pre merge-a | Da — kroz hook ili dokumentaciju |
| `security-review` | Bezbednosni pregled pending izmena na grani | Pre merge-a, posebno za promene autentifikacije, krypto, secrets | Da — kroz hook pre push-a na main |

### Smetnice za skills

1. **Skills nisu garancija**: čak i kad su pozvani, model može da skrene s teme. Skill je uputstvo, ne tvrd kod.
2. **Skills troše token budžet**: svako pozivanje učitava dodatni kontekst. Ne pozivati ih za trivijalne zadatke.
3. **Skills se ne lančaju automatski**: ako želiš `init` → `security-review` → `simplify`, moraš to da nacrtaš ručno (ili kroz Stop hook).
4. **Skills ne menjaju permission**: pozivanje `security-review` ne daje Claude-u nove dozvole za bash; te dozvole moraju biti odvojeno odobrene.

---

## B. MCP alati — šta postoji, kada se koriste

**MCP (Model Context Protocol)** server izlaže paket alata Claude-u. Konfiguriše se kroz `.mcp.json` u repou ili user-level config. **Ako MCP server nije konfigurisan, alati ne postoje** — ne mogu se „aktivirati memorijom".

### Dostupni MCP serveri u ovoj sesiji (pregled)

| Server | Glavni alati | Kada se koristi | Smetnice |
|--------|-------------|------------------|----------|
| `github` | `create_pull_request`, `get_file_contents`, `list_branches`, `pull_request_read`, `search_code`, ... | Sve GitHub operacije | **Restriktovan na 2 repoa**: `mmisic90/1`, `mmisic90/web-sajt-adv` |
| `context7` (resolve-library-id, query-docs) | Sveža dokumentacija biblioteka/SDK-ova | Uvek kad se pita za biblioteku, čak i poznatu (React, Next.js, Tailwind) | Tačan ID biblioteke se mora prvo razrešiti |
| `figma` | get_design_context, get_screenshot, generate_diagram | Korisnik šeruje figma.com URL ili pita za dizajn | Trebati identifikovati fileKey i nodeId iz URL-a |
| `vercel` | deploy_to_vercel, get_deployment_build_logs, list_projects | Vercel deploy, debug | Vidljiv efekat na deploy — uvek potvrditi |
| `notion` | notion-search, notion-create-pages, notion-update-page | Korisnik traži rad sa Notion bazom | Uticaj na deljeni Notion workspace |
| `gmail` | create_draft, search_threads, label_thread | Korisnik traži mejl operacije | **Slanje mejla je vidljivo van sistema** — uvek potvrditi |
| `calendar` | create_event, list_events, suggest_time | Kalendar operacije | Vidljivo drugima u kalendaru |
| `canva`, `adobe` | dizajn, asset operacije | Korisnik traži dizajn rad | Brendovan output, treba pažljivo |
| `lunarcrush` | crypto, stocks, social posts | Korisnik traži tržišne podatke | **Tržišni podaci stare brzo** — uvek dodati timestamp |
| `google-drive` | search_files, read_file_content, copy_file | Korisnik traži drive operacije | Vidljivost deljenih fajlova |
| `autodesk` | get_available_products, search_help_content | Autodesk dokumentacija | Specifično za Autodesk proizvode |

### Pravilo poziva MCP alata

1. **Specifični alat za specifičan posao**: ne koristi `Bash` ako postoji namenski alat.
2. **MCP iznad WebFetch za autentifikovane URL-ove**: GitHub MCP umesto fetch-a github.com URL-a, slično za sve ostale.
3. **Citiraj rezultate**: ako MCP vraća podatke, prenosi ih citiranjem, ne parafraziraj kao svoje znanje.

---

## C. Built-in alati Claude Code-a

Ovi su uvek dostupni (ne treba konfiguracija):

| Alat | Kada | Smetnica |
|------|------|----------|
| `Read` | Čitanje fajla po apsolutnoj putanji | Ne za direktorijume; za to `Glob` ili `Bash ls` |
| `Write` | Pisanje fajla (nov ili overwrite) | Mora `Read` prvi za postojeće — anti-katastrofa |
| `Edit` | Tačna zamena stringa u fajlu | `old_string` mora biti jedinstven |
| `Glob` | File pattern matching (`**/*.tsx`) | Za pronalaženje fajlova po imenu |
| `Grep` | Pretraga sadržaja fajlova (ripgrep) | Bolji od `Bash grep`, ima dozvole |
| `Bash` | Shell komande | Ne za zadatke koje pokriva namenski alat |
| `Agent` | Pokretanje subagent-a (Explore, Plan, ...) | Za open-ended istraživanje ili paralelizaciju |
| `SendUserFile` | Slanje fajla korisniku (npr. generisani PDF, screenshot) | Samo kad je fajl deliverable |
| `AskUserQuestion` | Pitanje korisniku za nejasnoće | Ne za „da nastavim?" — to ide ExitPlanMode |
| `WebFetch`, `WebSearch` | Web podaci | WebFetch ne za autentifikovane URL-ove |
| `Skill` | Pozivanje skilla | Samo skills sa liste |
| `ToolSearch` | Učitavanje schema za deferred alate | Pre nego što se zove deferred tool |

### Smetnica za built-in alate

- **`Bash` ima sandbox mode** koji blokira određene komande. Ako komanda padne sa neočekivanim restrictom — proveri sandbox status, ne zaobilazi.
- **`Edit` ne dozvoljava editovanje fajla koji nije `Read`-ovan** u sesiji. To je anti-overwrite zaštita.
- **`Write` overwrite-uje postojeći fajl bez pitanja** ako je `Read`-ovan. Anti-katastrofa zaštita — uvek pročitati pre Write-a postojećeg fajla.

---

## D. Hooks (PRINUDNI sloj)

Detalji u `06-SETTINGS-HOOKS-PREDLOG.md`. Ovde samo lista postojećih tipova:

| Hook | Kad se okida | Tipičan use case |
|------|--------------|-------------------|
| `SessionStart` | Početak sesije | Učitati dodatni kontekst, pokazati TODO listu |
| `UserPromptSubmit` | Pre nego što Claude odgovori | Validacija upita, dodavanje konteksta |
| `PreToolUse` | Pre svakog poziva alata | Blokirati opasne komande, traziti potvrdu |
| `PostToolUse` | Posle poziva alata | Log-ovanje, automatske akcije |
| `Stop` | Kraj Claude-ovog odgovora | Summary, automatski test run |
| `Notification` | Kad Claude pošalje notifikaciju | Custom notifikacioni kanali |

**Suština**: hooks su jedini pouzdan način da kažeš „uvek X pre Y". CLAUDE.md, skills, MCP — sve to može da se ignoriše. Hook se ne ignoriše.

---

## E. „Pravne skills" — koje treba uvek imati u igri

Iz korisnikovog zahteva: koje skills/tools treba „permanentno" da budu spremni za aktivaciju (a ne nužno auto-pokretani).

### Lista preporučenih „uvek dostupnih" skills:

1. **`init`** — pri kreiranju nove komponente repoa ili velikog refaktora.
2. **`security-review`** — pre svakog PR merge-a koji dira autentifikaciju, autorizaciju, secrets, eksterni input.
3. **`review`** — pri PR review-u.
4. **`simplify`** — posle značajnih izmena koda (>50 linija), pre commit-a.
5. **`claude-api`** — automatski kad se otvori fajl koji importuje `anthropic` SDK.
6. **`update-config`** — kad korisnik kaže „uvek X" / „nikad Y" / „svaki put X".

### Lista preporučenih „uvek dostupnih" MCP alata:

1. **`context7`** (resolve-library-id + query-docs) — pre svakog odgovora o biblioteci/SDK-u.
2. **`github`** — sve GitHub interakcije, samo unutar dozvoljenih repoa.

### Kako ih „aktivirati trajno"

Ne kroz memoriju modela. Kroz **kombinaciju tri sloja**:

1. **Pravilo u CLAUDE.md** (savet) — npr. „Kad korisnik pita o biblioteci, prvo context7."
2. **Hook u settings.json** (prinuda) — npr. SessionStart hook koji proverava `package.json` i ako vidi `anthropic`, automatski učitava `claude-api` skill u kontekst.
3. **Personal habit** (korisnikov) — `/security-review` pre `git push` postaje refleks.

Bez sva tri sloja, „trajno" je samo želja.

---

## F. Šta NE postoji (i nemoj tražiti)

- **Permanent memory** Claude Code modela koji se prenosi između sesija — ne postoji u ovom obliku. CLAUDE.md je najbliže.
- **Skill koji se pokreće na svaku poruku** — ne. To je hook.
- **Globalni MCP server koji važi za sve sesije bez konfiguracije** — ne. MCP zahteva config.
- **„Uvek odgovaraj na srpskom" bez ponavljanja u CLAUDE.md** — ne. Mora biti u CLAUDE.md, i UserPromptSubmit hook za prinudu.

---

## G. Praktična matrica: „šta hoću da uradim" → „šta da koristim"

| Hoću da | Koristim | Smetnica |
|---------|----------|----------|
| Sigurno operisati sa GitHub-om | `mcp__github__*` | Samo dozvoljeni repoi |
| Dobiti svežu dokumentaciju biblioteke | `context7` (resolve + query) | Nekad library ID nije očigledan |
| Da hook validira upit pre odgovora | `.claude/settings.json` UserPromptSubmit | Hook mora biti instaliran |
| Pretraživanje koda u repou | `Grep` (built-in) | Ne `Bash rg` |
| Pronalaženje fajla po imenu | `Glob` | Ne `Bash find` / `ls` |
| Open-ended istraživanje | `Agent` subagent_type=Explore | Brže paralelizovati 2–3 |
| Plan implementacije | `Agent` subagent_type=Plan | Default za netrivijalne taskove |
| Konfiguracija hookova | Skill `update-config` ili ručno settings.json | Hookovi se izvršavaju kao shell — pažljivo |
| Pregled PR-a | Skill `review` | Ne zove sebe automatski |
| Bezbednosni pregled | Skill `security-review` | Pre push-a na main |
| Pokrenuti X periodično | Skill `loop` | Skup token budžet |

---

## H. Zaključak

Trajna aktivacija u Claude Code = sloj 1 (CLAUDE.md) + sloj 2 (hooks) + sloj 3 (MCP config) + sloj 4 (korisnik). Niko od ovih sam ne radi.

Sledeći dokument (`06-SETTINGS-HOOKS-PREDLOG.md`) daje konkretan `.claude/settings.json` koji pretvara preporuke iz ovog fajla u prinudu.
