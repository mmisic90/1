# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

A vanilla JavaScript web app with two pages:

1. **Business Ideas Carousel** (`index.html`) — a step-by-step card carousel presenting LegalTech business ideas. Also embeds an incomplete law firm landing page for "Advokat Misić" (hero, about, areas of law sections). Language: Bosnian (`lang="bs"`).
2. **TV Remote Control** (`remote.html`) — an interactive media remote UI with power toggle, volume/channel controls, d-pad, media playback, number pad, and input source selection. Links back to `index.html`.

No build step. No bundler. Open HTML files directly in a browser.

## Development Commands

```bash
npm install          # Install dev dependencies (vitest, jsdom, coverage-v8)
npm test             # Run all tests (vitest run)
npm run coverage     # Run tests with a v8 coverage report
```

No linter or formatter is configured. Follow existing code style.

## Architecture

```
.
├── src/
│   ├── carousel.js          # createCarousel() — builds dots, cards, voting, navigation
│   ├── ideas.js             # Default export: array of idea objects {title, tag, body, image?}
│   ├── remote.js            # createRemote() — TV remote state machine
│   ├── voting.js            # localStorage-backed vote tally helpers
│   └── wire.js              # DOM glue helpers (wireCarousel, wireRemote)
├── tests/
│   ├── carousel.test.js     # carousel init/nav/voting/XSS
│   ├── ideas.test.js        # data shape validation
│   ├── remote.test.js       # remote state machine
│   ├── voting.test.js       # vote tally helpers
│   ├── wire.test.js         # HTML wiring integration
│   └── landing.test.js      # index.html landing-page structure
├── index.html               # Carousel + law firm landing page (ES module imports)
├── remote.html              # TV remote control (ES module imports + global handlers)
├── vitest.config.js         # Vitest config: jsdom environment + v8 coverage
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

Default export: array of idea objects. Each has `title` (string), `tag` (string), `body` (string), and optionally `image`/`imageAlt`. All values are non-empty and titles are unique. The test suite enforces this shape.

### `remote.html`

Imports `createRemote` from `src/remote.js` via `<script type="module">`, then `wireRemote(window, remote)` (from `src/wire.js`) exposes the returned methods as globals so the inline `onclick="togglePower()"` attributes resolve. Key state variables:

| Variable | Type | Default | Range |
|---|---|---|---|
| `power` | boolean | `true` | — |
| `volume` | number | `50` | 0–100, step 5 |
| `channel` | number | `1` | 1–999, wraps around |
| `muted` | boolean | `false` | — |
| `playing` | boolean | `false` | — |
| `currentSource` | string | `'HDMI 1'` | HDMI 1, HDMI 2, USB, AV |

All functions check `if (!power) return` — no action when powered off. Number pad input has a 2-second timeout before auto-submitting the channel. Logic lives in `src/remote.js` and is covered by `tests/remote.test.js`.

### `index.html` — page structure

The carousel widget (wrapper, step indicators, card container, nav buttons, counter) is wired up via an inline `<script type="module">` that imports from `src/`. Button click handlers are set in the script, not in HTML attributes.

Below the carousel markup, the file also contains a law firm landing page with `<nav>`, `<section id="hero">`, `<section id="about">`, and `<section id="oblasti">`.

## Known Issues / Tech Debt

Remaining issues after recent fixes:

1. **Incomplete landing page** — The contact section (`#kontakt`) is referenced in nav links and hero CTA but doesn't exist in the HTML body. CSS styles for `.contact-wrap`, `.contact-form`, and `footer` are defined but unused. The areas-of-law grid (`#oblasti .areas-grid`) is empty — no `area-card` elements.

Previously fixed:
- `:root` CSS custom properties now defined (`--navy`, `--gold`, `--white`, `--gray`, `--border`, `--navy2`, `--gold2`)
- HTML nesting corrected (wrapper, carousel-nav, areas-grid all properly closed)
- Carousel CSS added for all generated elements (`.card`, `.step-dot`, `.step-line`, `.counter`, etc.)
- `.btn` class collision resolved — carousel buttons now use `.carousel-btn`
- Google Fonts loaded via `<link>` for Lato and Playfair Display

## Test Setup

- **Framework**: Vitest 4.x
- **Environment**: jsdom (configured in `vitest.config.js`)
- **Pattern**: DOM-driven test files define a `setupDOM()` helper that injects the required HTML skeleton into `document.body.innerHTML`, then exercise the module under test. `landing.test.js` instead reads `index.html` from disk and parses it with `DOMParser` (no script execution).
- **Test files**: `carousel.test.js` (init/nav/voting/XSS), `ideas.test.js` (data shape), `remote.test.js` (remote state machine), `voting.test.js` (tally helpers), `wire.test.js` (HTML wiring integration), `landing.test.js` (landing-page structure).
- **Coverage**: `npm run coverage` (v8 provider, scoped to `src/**`). Core modules are at 100% statements/functions/lines.
- **Expected failures**: `landing.test.js` uses `it.fails()` to pin documented landing-page debt (missing `#kontakt` section, empty areas grid). These count as passes until the debt is fixed — when fixed, convert them to normal assertions.
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
- Page glue lives in `src/wire.js` so it can be unit-tested — keep new wiring there rather than inline in HTML
- `index.html` still has an incomplete landing page (see Known Issues) — contact section and area cards are missing; `landing.test.js` pins this debt via `it.fails()`
- The carousel uses `.carousel-btn` (not `.btn`) to avoid collision with landing page styles
- When adding/removing ideas in `ideas.js`, update the count assertion in `ideas.test.js` (`ideas.length`)
