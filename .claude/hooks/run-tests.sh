#!/usr/bin/env bash
# Stop hook: gate the end of a turn on a green test suite.
# Only runs when JS under src/ or tests/ changed since HEAD, so plain
# Q&A turns are not slowed down. Exit 2 blocks the stop and feeds the
# failure back to Claude; exit 0 lets the turn end.

set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

# Nothing to verify if no JS changed in the working tree.
if git rev-parse --git-dir >/dev/null 2>&1; then
  if git diff --quiet -- 'src/*.js' 'tests/*.js' \
     && git diff --cached --quiet -- 'src/*.js' 'tests/*.js'; then
    exit 0
  fi
fi

if ! OUTPUT=$(npm test 2>&1); then
  echo "Tests fail — fix them before ending the turn:" >&2
  echo "$OUTPUT" | tail -25 >&2
  exit 2
fi

exit 0
