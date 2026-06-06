# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Komunikacija / Communication

- **Uvek komuniciraj sa korisnikom na srpskom jeziku.**
- Engleski je opcioni i koristi se samo kada je prirodno: tehnički termini, nazivi alata/komandi i kod.

## Project Overview

A vanilla JavaScript web app with two pages:

1. **Law Firm Site** (`index.html`) — the landing page for the "Advokat Misić" law firm. Opens with a full-screen cinematic intro video (`public/reels/reel-03-lineage-animatic.mp4`) that ends on the founder's portrait and routes the visitor into the "O meni" (about) section. Sections: hero, about, areas of law (oblasti), contact (kontakt), footer. Language: Bosnian (`lang="bs"`).
2. **TV Remote Control** (`remote.html`) — an interactive media remote UI with power toggle, volume/channel controls, d-pad, media playback, number pad, and input source selection. Links back to `index.html`.

No build step. No bundler. Open HTML files directly in a browser.

## Development Commands

```bash
npm install          # Install dev dependencies (vitest, jsdom)
npm test             # Run all tests (vitest run)
```

No linter or formatter is configured. Follow existing code style.

## Architecture

```
.
├── src/
│   ├── carousel.js          # createCarousel() — builds dots, cards, handles navigation
│   └── ideas.js             # Default export: array of 4 idea objects {title, tag, body}
├── tests/
│   ├── carousel.test.js     # 36 tests across 8 describe blocks
│   └── ideas.test.js        # 4 tests: data shape validation
├── index.html               # Carousel + law firm landing page (ES module imports)
├── remote.html              # TV remote control (inline script, no modules)
├── vitest.config.js         # Vitest config: jsdom environment
├── .github/workflows/
│   └── claude.yml           # GitHub Action: Claude Code on @claude mentions
└── .gitignore               # Ignores node_modules/
```

## Module Details

### `src/carousel.js`

Single named export: `createCarousel(ideas, document)`.

Expects these DOM elements to already exist: `#stepsIndicator`, `#cardContainer`, `#btnPrev`, `#btnNext`, `#counter`.

On init, builds step dots (with connecting lines between them), builds cards from idea data, and sets the UI to step 0. Returns:

| Method | Behavior |
|---|---|
| `goTo(index)` | Clamps index to `[0, total-1]`, updates active card, dot classes (`active`/`done`), line classes, prev button disabled state, next button text (`"Next →"` / `"Done ✓"`), counter text |
| `changeStep(dir)` | `+1` forward, `-1` backward. No-op if at boundary and stepping forward (but `goTo` clamping handles backward at 0) |
| `updateUI()` | Re-renders all UI based on current index |
| `getCurrent()` | Returns current step index (0-based) |

DOM structure created per card:
```html
<div class="card" id="card-{i}">
  <div class="card-header">
    <div class="card-number">{i+1}</div>
    <div>
      <div class="card-label">Step {i+1} of {total}</div>
      <div class="card-title">{idea.title}</div>
    </div>
  </div>
  <div class="card-divider"></div>
  <div class="card-body">{idea.body}</div>
  <div class="card-tag">{idea.tag}</div>
</div>
```

Step dots: `<div class="step-dot" id="dot-{i}">` with `<div class="step-line" id="line-{i}">` between them. Dots have `onclick` handlers that call `goTo(i)`.

### `src/ideas.js`

Default export: array of 4 objects. Each has `title` (string), `tag` (string), `body` (string). All values are non-empty and titles are unique. The test suite enforces this shape.

### `remote.html`

Self-contained — all JS is inline using global functions (no ES modules). Key state variables:

| Variable | Type | Default | Range |
|---|---|---|---|
| `power` | boolean | `true` | — |
| `volume` | number | `50` | 0–100, step 5 |
| `channel` | number | `1` | 1–999, wraps around |
| `muted` | boolean | `false` | — |
| `playing` | boolean | `false` | — |
| `currentSource` | string | `'HDMI 1'` | HDMI 1, HDMI 2, USB, AV |

All functions check `if (!power) return` — no action when powered off. Number pad input has a 2-second timeout before auto-submitting the channel. No tests exist for this page.

### `index.html` — page structure

A single-page law firm site. On load, a full-screen intro overlay (`#intro` containing `#introVideo`) plays the lineage video; an inline `<script>` controls it (muted autoplay + playsinline, "Preskoči" skip → `#hero`, end-of-video CTA → `#about`, shown once per session via `sessionStorage`, autoplay-blocked fallback reveals the CTA). Below the overlay: `<nav>`, `<section id="hero">`, `<section id="about">` (portrait + bio), `<section id="oblasti">`, `<section id="kontakt">`, and `<footer>`.

The business-ideas carousel was removed from this page. `src/carousel.js` and `src/ideas.js` remain as standalone modules with their own passing unit tests, but are no longer wired into any page.

## Known Issues / Tech Debt

No known outstanding issues. The landing page is complete.

Previously fixed:
- **Landing page completed** — Added the contact section (`#kontakt`) with contact details and a form, the footer, and three `area-card` elements in `#oblasti .areas-grid` (Krivično, Građansko, Privredno i radno pravo). CSS for `.contact-wrap`, `.contact-form`, and `footer` is now used.
- `:root` CSS custom properties now defined (`--navy`, `--gold`, `--white`, `--gray`, `--border`, `--navy2`, `--gold2`)
- HTML nesting corrected (wrapper, carousel-nav, areas-grid all properly closed)
- Carousel CSS added for all generated elements (`.card`, `.step-dot`, `.step-line`, `.counter`, etc.)
- `.btn` class collision resolved — carousel buttons now use `.carousel-btn`
- Google Fonts loaded via `<link>` for Lato and Playfair Display

## Test Setup

- **Framework**: Vitest 4.x
- **Environment**: jsdom (configured in `vitest.config.js`)
- **Pattern**: Each test file calls `setupDOM()` in `beforeEach` to inject the required HTML skeleton into `document.body.innerHTML`, then calls `createCarousel(ideas, document)` using the real ideas data and the jsdom-provided `document`
- **Test structure**: `carousel.test.js` has 8 `describe` blocks — initialization (6 tests), updateUI (8), goTo (4), changeStep (5), dot click (2), single idea edge case (2), two ideas edge case (1), full navigation flow (1). `ideas.test.js` has 1 `describe` block with 4 tests.
- **Run**: `npm test` (alias for `vitest run`)
- **No watch mode configured** — use `npx vitest` for watch mode during development
- All tests must pass before committing

## Code Style

- Vanilla JavaScript, ES modules (`export`/`import`) in `src/`
- `remote.html` uses inline `<script>` with global functions and `onclick` attributes
- `index.html` uses `<script type="module">` and sets handlers via JS (`el.onclick = ...`)
- CSS is inline in `<style>` tags — no external stylesheets
- Two-space indentation in JS
- Single quotes for strings in JS
- Semicolons at end of statements
- `let`/`const` — no `var`
- No TypeScript, no JSX, no framework dependencies
- Dev dependencies: `vitest` (test runner), `jsdom` (DOM environment for tests)

## Git Workflow

- Branch naming: `feature/<description>`, `fix/<description>`, `chore/<description>`
- Commit messages: conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, etc.)
- Keep commits focused and atomic
- Do not commit `node_modules/`, secrets, credentials, or generated artifacts

## CI

GitHub Actions workflow (`.github/workflows/claude.yml`) triggers on `@claude` mentions in issue comments, PR review comments, PR reviews, and new/assigned issues. Runs `anthropics/claude-code-action@v1`. No other CI pipelines (no automated test runs on push/PR).

## Notes for Claude

- Read existing code before suggesting modifications
- Prefer editing existing files over creating new ones
- Do not add unnecessary comments, docstrings, or abstractions
- Run `npm test` before committing code changes
- `remote.html` has no tests — if adding non-trivial logic there, extract testable functions to `src/`
- `index.html` landing page is complete (hero, about, areas of law, contact, footer)
- The carousel uses `.carousel-btn` (not `.btn`) to avoid collision with landing page styles
- When adding new ideas to `ideas.js`, update the test in `ideas.test.js` that asserts `ideas.length === 4`
