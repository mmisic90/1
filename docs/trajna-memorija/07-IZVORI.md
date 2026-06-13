# 07 — Izvori: sve reference iz istraživanja

Sve tvrdnje u prethodnim dokumentima oslanjaju se na sledeće proverljive izvore. Datum pristupa: **2026-06-06**.

## A. Zvanična Anthropic dokumentacija

| Tema | URL |
|------|-----|
| Smanjenje halucinacija (sve tehnike) | https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations |
| Memory tool (za API agente, ne Claude Code) | https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool |
| Claude Code memory (CLAUDE.md sistem) | https://code.claude.com/docs/en/memory |
| Prompting best practices | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices |
| Modeli — pregled | https://platform.claude.com/docs/en/about-claude/models/overview |
| Prompt engineering overview | https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview |

## B. Anthropic kursevi i edukativni materijal

| Tema | URL |
|------|-----|
| Avoiding Hallucinations (lekcija) | https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/Anthropic%201P/08_Avoiding_Hallucinations.ipynb |
| Interactive Prompt Engineering Tutorial | https://github.com/anthropics/prompt-eng-interactive-tutorial |

## C. Treća strana — analize i prakse

| Tema | URL |
|------|-----|
| Writing a good CLAUDE.md (HumanLayer) | https://www.humanlayer.dev/blog/writing-a-good-claude-md |
| Complete Guide to CLAUDE.md (Bijit Ghosh) | https://medium.com/@bijit211987/the-complete-guide-to-claude-md-memory-rules-loading-and-cross-tool-compression-97cc12ed037b |
| Claude Code system prompts (Piebald-AI) | https://github.com/Piebald-AI/claude-code-system-prompts |
| Anti-hallucinate skills (instantX-research) | https://github.com/instantX-research/anthropic-anti-hallucinate-skills |
| Three prompts cut hallucinations | https://www.xda-developers.com/three-system-prompts-cut-claudes-hallucinations-dramatically/ |
| Best practices (Anthropic blog) | https://claude.com/blog/best-practices-for-prompt-engineering |

## D. Konkretne tvrdnje i njihovi izvori

Ovde se nalaze pojedinačne tvrdnje iz prethodnih dokumenata sa pokazivačem na izvor — radi provere bez čitanja celog izvora.

### Sedam tehnika za smanjenje halucinacija

Sve sedam (dozvoli „Ne znam", direktni citati, verifikacija sa citatima, chain-of-thought, best-of-N, iterativna refinement, ograničenje eksterne baze znanja) izvedeno doslovno iz:

> https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations

Tačni primer prompt-ova (M&A izveštaj, GDPR/CCPA policy, AcmeSecurity Pro) takođe potiču odatle.

### „Model pouzdano prati ~150 distinktnih instrukcija"

Tvrdnja iz analize CLAUDE.md najbolje prakse. Izvor (treća strana):

> https://www.humanlayer.dev/blog/writing-a-good-claude-md

> Bijit Ghosh, Complete Guide to CLAUDE.md

Anthropic nema brojku „150" eksplicitno u svojoj zvaničnoj dokumentaciji, ali zvanični guideline o CLAUDE.md veličini i fokusu se slaže sa duhom (https://code.claude.com/docs/en/memory).

### Hijerarhija CLAUDE.md (global → project → directory → local)

Izvor:

> https://code.claude.com/docs/en/memory

### Hooks (SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop, Notification)

Izvor: zvanični Claude Code dokumenti o hookovima. Imena hookova i njihova semantika su preuzeti direktno iz Claude Code sistemske dokumentacije.

### „Knowledge cutoff: januar 2026" za Claude

Izvor: sistem prompt ove sesije (eksplicitno navodi „Assistant knowledge cutoff is January 2026"). Ne preuzimati ovo kao trajno tačnu za nove modele — proveri za svaki novi release.

### „Reverzibilnost × Radijus uticaja = rizik" princip

Izvor: sistem prompt ove sesije („Executing actions with care" sekcija). Princip nije Anthropic-ov javni termin već suština guideline-a.

---

## E. Kako se proverava izvor

1. **URL prvo**: ako URL više ne radi — fallback na archive.org (`web.archive.org/web/<URL>`).
2. **GitHub linkovi**: gledati specifičan commit hash (ne `main`), pošto se sadržaj menja.
3. **Anthropic docs**: domeni `docs.anthropic.com`, `docs.claude.com`, `platform.claude.com` (svi su zvanični; ima preusmeravanja između njih).
4. **Verzionisanje**: Anthropic dokumentacija ne nosi verzioni broj — proveri sadržaj na datum pristupa.

---

## F. Šta NE garantujem

- Da svaki URL i dalje radi u trenutku čitanja (web je živ, stvari se menjaju).
- Da Anthropic nije promenio formulaciju neke tehnike posle datuma pristupa.
- Da treća strana izvori (HumanLayer blog, Medium, XDA) su zvanični Anthropic stav — oni su analize.

Ako bilo koja tvrdnja u prethodnim dokumentima izgleda kao da je „kategorična a treba da bude meka", to je greška ovog autora — ne izvora. Javiti pa će se ispraviti.
