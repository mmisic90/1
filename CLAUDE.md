# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

A JavaScript web app featuring a step-by-step idea carousel UI and a TV/media remote control interface. Built with vanilla JS and tested with Vitest.

## Development Commands

### Install

```bash
npm install
```

### Run

Open `index.html` or `remote.html` directly in a browser — no build step required.

### Test

```bash
npm test
```

### Lint / Format

No linter configured yet. Follow existing code style.

## Architecture

```
.
├── src/            # Carousel and ideas logic (ES modules)
├── tests/          # Vitest test suites
├── index.html      # Main carousel UI
├── remote.html     # TV/media remote control UI
└── vitest.config.js
```

## Code Style

- Vanilla JavaScript, ES modules (`export`/`import`)
- No build step — browser-native code
- Keep functions small and focused
- Write tests for non-trivial logic

## Git Workflow

- Branch naming: `feature/<description>`, `fix/<description>`, `chore/<description>`
- Commit messages: use conventional commits format (`feat:`, `fix:`, `docs:`, `chore:`, etc.)
- Keep commits focused and atomic
- Do not commit secrets, credentials, or generated build artifacts

## Notes for Claude

- Read existing code before suggesting modifications.
- Prefer editing existing files over creating new ones.
- Do not add unnecessary comments, docstrings, or abstractions.
- Run `npm test` before committing code changes.
