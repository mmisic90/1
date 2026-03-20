# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

Business Ideas Showcase — a mobile-optimized, single-page web application that displays business ideas (legal technology/SaaS) in an interactive carousel with step-based navigation. Built with vanilla HTML5, CSS3, and JavaScript with zero external dependencies.

Features:
- Step indicator with progress dots and click-to-jump navigation
- Card-based UI showing idea title, description, and category tags
- Previous/Next button navigation
- iPhone PWA support with safe-area insets for notched devices
- Purple gradient theme (#7b2ff7 to #a855f7)

## Development Commands

### Build

No build step required. This is a static HTML file with inline CSS and JavaScript.

### Run

Open `index.html` directly in a browser, or serve locally:

```bash
python3 -m http.server 8000
```

### Test

No test framework is configured. Verify changes by opening `index.html` in a browser and testing navigation (dots, prev/next buttons, step counter).

### Lint / Format

No linter or formatter is configured. Follow the existing code style conventions described below.

## Architecture

Single-file architecture — all code lives in `index.html`:

```
/
├── .github/workflows/claude.yml   # GitHub Actions: Claude Code Action integration
├── CLAUDE.md                      # This file
└── index.html                     # Entire application (HTML + CSS + JS)
```

`index.html` is organized into three inline sections:

1. **HTML** — Semantic markup with mobile viewport meta tags, PWA configuration, step indicator container, card container, and navigation buttons.
2. **CSS** (`<style>`) — Mobile-first responsive design using CSS Grid/Flexbox, `slideIn` animation (350ms cubic-bezier), safe-area insets, and state styles (active, done, disabled).
3. **JavaScript** (`<script>`) — Ideas data array, current step tracking, and DOM manipulation functions:
   - `updateUI()` — Refreshes active states, step dots, and card content
   - `goTo(index)` — Navigates to a specific step
   - `changeStep(dir)` — Steps forward or backward by direction (+1/-1)

## Code Style

- Vanilla JavaScript (ES6+), no frameworks or libraries.
- BEM-like CSS class naming (`.card-header`, `.card-body`, `.btn-prev`).
- Mobile-first CSS with progressive enhancement.
- Clear, descriptive variable names (`ideas`, `current`, `total`).
- Direct DOM manipulation via `getElementById`, `querySelectorAll`, `createElement`.

## Git Workflow

- Branch naming: `feature/<description>`, `fix/<description>`, `chore/<description>`
- Commit messages: use conventional commits format (`feat:`, `fix:`, `docs:`, `chore:`, etc.)
- Keep commits focused and atomic.
- Do not commit secrets, credentials, or generated build artifacts.

## CI/CD

GitHub Actions workflow (`.github/workflows/claude.yml`) enables Claude Code Action. It triggers when `@claude` is mentioned in issue comments, PR comments, or PR reviews.

## Notes for Claude

- This is a single-file application — all edits go in `index.html`.
- No build step, no dependencies to install.
- Read the existing HTML/CSS/JS structure before making changes.
- Prefer editing existing files over creating new ones.
- Test by opening `index.html` in a browser and verifying navigation behavior.
- Business idea data is stored as a JavaScript array in the `<script>` block — add/modify ideas there.
