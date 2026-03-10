# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

<!-- TODO: Describe what this project does -->

## Development Commands

### Build
```bash
# TODO: Add build command, e.g.:
# npm run build
# make build
# go build ./...
```

### Run
```bash
# TODO: Add run command, e.g.:
# npm start
# python main.py
# ./bin/app
```

### Test
```bash
# TODO: Add test command, e.g.:
# npm test
# pytest
# go test ./...
# make test
```

### Lint / Format
```bash
# TODO: Add lint/format commands, e.g.:
# npm run lint
# ruff check . && ruff format .
# golangci-lint run
```

## Architecture

```
.
├── src/          # Application source code
├── tests/        # Test files
└── docs/         # Documentation
```

<!-- TODO: Update to reflect actual directory structure -->

## Code Style

- Follow the conventions of the language/framework in use.
- Prefer clarity over cleverness.
- Keep functions small and focused.
- Write tests for non-trivial logic.

<!-- TODO: Add specific linter configs, formatter settings, or style guides -->

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
