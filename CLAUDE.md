# CLAUDE.md

Guidance for Claude Code in this repository.

## Komunikacija

- **Uvek komuniciraj sa korisnikom isključivo na srpskom jeziku, ekavski izgovor (ekavica).**
- Ekavica važi svuda: u chatu, u dokumentima koje pišeš (.md, izveštaji), u commit porukama i PR opisima. Ne ijekavica: ne "prije/provjera/dio" → već "pre/provera/deo".
- Engleski samo gde je prirodno: tehnički termini, nazivi alata/komandi i kod.

## Project Overview

Vanilla JavaScript web app, no build step and no bundler — open the HTML files directly in a browser.

1. **Law Firm Site** (`index.html`, `lang="bs"`) — the landing page for the "Advokat Misić" law firm. Opens with a full-screen cinematic intro video (`public/reels/reel-03-lineage-animatic.mp4`) that ends on the founder's portrait and routes the visitor into the "O meni" (about) section. Sections: hero, about, areas of law (oblasti), contact (kontakt), footer.
2. **TV Remote Control** (`remote.html`) — media remote UI (power, volume, channel, d-pad, playback, number pad, input sources). Links back to `index.html`.

## Commands

```bash
npm install   # dev deps (vitest, jsdom)
npm ci        # clean install (used in CI)
npm test      # run all tests (vitest run)
npx vitest    # watch mode (not configured by default)
```

No linter/formatter configured — follow existing style.

## Layout

```
src/
  carousel.js   # createCarousel(ideas, document, storage?) — dots, cards, navigation, wires voting
  ideas.js      # default export: array of idea objects {title, tag, body, image?, imageAlt?}
  remote.js     # createRemote(document, options?) — all remote logic as a testable module
  voting.js     # loadVotes/saveVotes/castVote/getCount — localStorage-backed vote state
tests/          # vitest + jsdom; one *.test.js per src module (~90 tests total)
index.html      # carousel + voting + landing page; <script type="module"> imports from src/
remote.html     # imports createRemote from src/remote.js; wires it onto window
.github/workflows/
  tests.yml         # runs npm ci && npm test on push (default branch) and all PRs
  deploy-pages.yml  # deploys static site to GitHub Pages
  claude.yml        # Claude Code Action on @claude mentions
```

## Module notes

- **carousel.js** expects `#stepsIndicator`, `#cardContainer`, `#btnPrev`, `#btnNext`, `#counter` to exist. `goTo(i)` clamps to `[0, total-1]`; `changeStep(dir)` is a no-op stepping forward past the end. Builds `.card`, `.step-dot`/`.step-line`, and a `.vote-block` per card. Returns `{ goTo, changeStep, updateUI, getCurrent, getVotes, vote }`.
- **remote.js** holds state (`power`, `volume` 0–100 step 5, `channel` 1–999 wrapping, `muted`, `playing`, `currentSource`). Every action returns early when `!power`. Number-pad input auto-submits after `options.inputTimeoutMs` (default 2000ms). Returns the action functions plus `getState()`.
- **voting.js** is pure/storage-injectable — pass a storage object in tests; one vote per visitor, re-voting toggles off.

## Conventions

- ES modules in `src/`; both HTML pages load logic via `<script type="module">`.
- Two-space indent, single quotes, semicolons, `let`/`const` (no `var`).
- No TypeScript, JSX, or runtime frameworks. CSS is inline in `<style>` tags.
- The carousel uses `.carousel-btn` (not `.btn`) to avoid colliding with landing-page styles.
- Branches: `feature/`, `fix/`, `chore/`. Conventional commit messages. Keep commits atomic.
- Never commit `node_modules/`, secrets, or generated artifacts.

## Verification

- A **Stop hook** (`.claude/hooks/run-tests.sh`) runs `npm test` when `src/`/`tests/` JS changed and blocks the turn until it passes.
- `tests.yml` runs the suite on every PR.
- For a fresh-context review of a diff, use the `code-review` subagent.
- Run `npm test` before committing. When you add or remove ideas in `ideas.js`, update the length assertion in `tests/ideas.test.js`.

## Known issues

- None outstanding — the landing page is complete: `#kontakt` section with contact details and a form, footer, and three `.area-card` elements in `#oblasti .areas-grid` (Krivično, Građansko, Privredno i radno pravo).
- The business-ideas carousel was removed from `index.html`. `src/carousel.js` and `src/ideas.js` remain as standalone modules with their own passing unit tests, but are no longer wired into any page.
- On load, `index.html` shows a full-screen intro overlay (`#intro` + `#introVideo`): muted autoplay, "Preskoči" skip → `#hero`, end-of-video CTA → `#about`, shown once per session via `sessionStorage`.
