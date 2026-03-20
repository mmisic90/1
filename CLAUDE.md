# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

Update this section with a description of what this project does, its purpose, and any high-level context useful for a new contributor.

## Development Commands

### Build

Add the build command once the tech stack is decided, e.g. `npm run build`, `make build`, or `go build ./...`.

### Run

Add the run command once the tech stack is decided, e.g. `npm start`, `python main.py`, or `./bin/app`.

### Test

```bash
npm test
npm run test:coverage  # with coverage report
```

### Lint / Format

Add the lint/format command once the tech stack is decided, e.g. `npm run lint`, `ruff check . && ruff format .`, or `golangci-lint run`.

## Architecture

Update this section to reflect the actual directory structure once files are added. Include a brief description of each top-level directory and its purpose.

## Code Style

- Follow the conventions of the language/framework in use.
- Prefer clarity over cleverness.
- Keep functions small and focused.
- Write tests for non-trivial logic.
- Refer to any linter/formatter config files (e.g. `.eslintrc`, `pyproject.toml`, `.golangci.yml`) for language-specific rules.

## Git Workflow

- Branch naming: `feature/<description>`, `fix/<description>`, `chore/<description>`
- Commit messages: use conventional commits format (`feat:`, `fix:`, `docs:`, `chore:`, etc.)
- Keep commits focused and atomic.
- Do not commit secrets, credentials, or generated build artifacts.

## Notes for Claude

- Read existing code before suggesting modifications.
- Prefer editing existing files over creating new ones.
- Do not add unnecessary comments, docstrings, or abstractions.
- Run tests before committing code changes.
