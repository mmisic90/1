# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

A vanilla JavaScript web app with two pages:

1. **Business Ideas Carousel** (`index.html`) — a step-by-step card carousel that presents LegalTech business ideas with navigation dots, prev/next buttons, and a counter. Also contains a law firm landing page (hero, about, areas of law, contact form).
2. **TV Remote Control** (`remote.html`) — an interactive media remote UI with power toggle, volume/channel controls, d-pad navigation, media playback, number pad, and source selection.

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
│   └── ideas.js             # Default export: array of idea objects {title, tag, body}
├── tests/
│   ├── carousel.test.js     # 36 tests: init, updateUI, goTo, changeStep, dot clicks, edge cases
│   └── ideas.test.js        # Data shape validation (required fields, uniqueness)
├── index.html               # Carousel page — imports src/ as ES modules
├── remote.html              # Remote control page — inline <script>, no modules
├── vitest.config.js         # Vitest config (jsdom environment)
├── .github/workflows/
│   └── claude.yml           # GitHub Action: Claude Code triggered by @claude mentions
└── .gitignore               # Ignores node_modules/
```

### Key module: `src/carousel.js`

`createCarousel(ideas, document)` — accepts an array of idea objects and a document reference. Builds step indicator dots, cards, and wires up navigation. Returns `{ goTo, changeStep, updateUI, getCurrent }`.

- `goTo(index)` — clamps to valid range, updates active card/dot/line/button states
- `changeStep(dir)` — moves forward (+1) or backward (-1), no-op at boundaries
- `getCurrent()` — returns current step index

### Key module: `src/ideas.js`

Default export: array of objects, each with `title` (string), `tag` (string), `body` (string).

### `remote.html`

Self-contained page with all JS inline (global functions, not ES modules). State: `power`, `volume`, `channel`, `muted`, `playing`, `currentSource`. No tests — logic is UI-only.

## Test Setup

- **Framework**: Vitest 4.x with jsdom environment
- **Pattern**: Tests set up DOM via `document.body.innerHTML`, then call `createCarousel()` with the real `document`
- **Run**: `npm test` (maps to `vitest run`)
- All tests must pass before committing code changes

## Code Style

- Vanilla JavaScript, ES modules (`export`/`import`) in `src/`
- Inline scripts in HTML files use global functions (no modules)
- CSS is inline within `<style>` tags in each HTML file — no external stylesheets
- Two-space indentation in JS files
- Single quotes for strings in JS
- No semicolons are inconsistently used — match the surrounding code
- Keep functions small and focused
- No TypeScript, no JSX, no framework dependencies

## Git Workflow

- Branch naming: `feature/<description>`, `fix/<description>`, `chore/<description>`
- Commit messages: conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, etc.)
- Keep commits focused and atomic
- Do not commit `node_modules/`, secrets, credentials, or generated artifacts

## CI

GitHub Actions workflow (`.github/workflows/claude.yml`) runs the Claude Code Action on `@claude` mentions in issues, PRs, and comments. No other CI pipelines.

## Notes for Claude

- Read existing code before suggesting modifications
- Prefer editing existing files over creating new ones
- Do not add unnecessary comments, docstrings, or abstractions
- Run `npm test` before committing code changes
- `remote.html` has no tests — if adding logic there, consider extracting testable functions to `src/`
- `index.html` contains mixed content (carousel wrapper + law firm landing page) — be careful with structural edits
