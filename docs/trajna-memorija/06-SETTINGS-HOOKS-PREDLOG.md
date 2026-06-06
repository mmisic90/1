# 06 — `.claude/settings.json` hooks: prinudna trajna aktivacija

CLAUDE.md savetuje. Skills se zovu. MCP postoji ako je konfigurisan. **Hooks prinuđavaju.**

Ovo je konkretan predlog `.claude/settings.json` koji pretvara meke smernice iz prethodnih dokumenata u tvrdu prinudu. Hookovi se izvršavaju kao shell skripte koje sistem (ne Claude) pokreće na specifične događaje. Claude ne može da ih „preskoci".

---

## A. Mehanizam ukratko

Claude Code podržava sledeće hook tipove:

| Hook | Okidač | Može da blokira? |
|------|--------|------------------|
| `SessionStart` | Početak svake sesije | Ne (samo informativno) |
| `UserPromptSubmit` | Svaki upit korisnika pre obrade | Da (može da modifikuje ili odbije) |
| `PreToolUse` | Pre svakog poziva alata | Da (može da blokira poziv) |
| `PostToolUse` | Posle svakog poziva alata | Ne (samo log/side-effect) |
| `Stop` | Kraj Claude-ovog odgovora | Ne |
| `Notification` | Kad Claude pošalje notifikaciju | Ne |

Konfiguracija ide u `.claude/settings.json` (project) ili `~/.claude/settings.json` (global). Project nadjača global.

---

## B. Predlog `.claude/settings.json` za mmisic90/1

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test:*)",
      "Bash(npm install:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git branch:*)",
      "Bash(git checkout:*)",
      "Bash(ls:*)",
      "Bash(file:*)",
      "Bash(which:*)",
      "mcp__github__get_file_contents",
      "mcp__github__list_branches",
      "mcp__github__list_pull_requests",
      "mcp__github__pull_request_read",
      "mcp__github__search_code"
    ],
    "deny": [
      "Bash(rm -rf /:*)",
      "Bash(rm -rf ~:*)",
      "Bash(rm -rf *:*)",
      "Bash(git push --force:*)",
      "Bash(git push -f:*)",
      "Bash(git reset --hard:*)",
      "Bash(git config --global:*)"
    ]
  },
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "test -f docs/trajna-memorija/00-PREGLED.md && cat docs/trajna-memorija/00-PREGLED.md"
          },
          {
            "type": "command",
            "command": "test -f docs/trajna-memorija/02-GUARDRAILS.md && head -50 docs/trajna-memorija/02-GUARDRAILS.md"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "echo '<reminder>Odgovor isključivo na srpskom (latinica). Anti-halucinacije: dozvoljeno reći Ne znam. Pre destruktivnih radnji — potvrda.</reminder>'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/check-bash-safety.sh"
          }
        ]
      },
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/check-secrets.sh"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "git diff --stat HEAD 2>/dev/null | tail -20 || true"
          }
        ]
      }
    ]
  },
  "env": {
    "CLAUDE_PROJECT_LANG": "sr_RS@latin"
  }
}
```

---

## C. Pomoćne hook skripte

### `.claude/hooks/check-bash-safety.sh`

Blokira komande koje izgledaju opasno na osnovu pattern matchinga (kao backup za `deny` listu iz `permissions`).

```bash
#!/usr/bin/env bash
# Ulaz: stdin sadrži JSON sa pozivom alata
# Izlaz: exit code 0 = dozvoli; ne-nula = blokiraj
# Stdout: poruka korisniku ako se blokira

input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command // empty')

if [ -z "$cmd" ]; then
  exit 0
fi

# Lista opasnih obrazaca
patterns=(
  'rm[[:space:]]+-rf[[:space:]]+(/|~|\$HOME)'
  'git[[:space:]]+push[[:space:]]+.*--force.*main'
  'git[[:space:]]+push[[:space:]]+.*-f.*main'
  '>[[:space:]]*/dev/sda'
  'mkfs\.'
  'dd[[:space:]]+if=.*of=/dev/'
  ':\(\)\{[[:space:]]*:\|:&[[:space:]]*\}'
)

for pat in "${patterns[@]}"; do
  if echo "$cmd" | grep -qE "$pat"; then
    echo "BLOKIRANO: komanda matchuje opasan obrazac: $pat"
    echo "Komanda: $cmd"
    echo "Ako je ovo namera, eksplicitno potvrdi sa korisnikom pre rerun-a."
    exit 1
  fi
done

exit 0
```

### `.claude/hooks/check-secrets.sh`

Proverava da li se piše fajl koji liči na secret.

```bash
#!/usr/bin/env bash
input=$(cat)
path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

if [ -z "$path" ]; then
  exit 0
fi

# Putanje koje su sumnjive
case "$(basename "$path")" in
  .env|.env.*|credentials.json|secrets.json|*.pem|*.key|*.p12|*.pfx)
    echo "UPOZORENJE: pišeš fajl koji liči na secret ($path)."
    echo "Proveri da li je commit-ovanje namera."
    # Ne blokira, samo upozorava
    ;;
esac

# Provera sadržaja za očigledne secrete (samo za Write, ne za Edit)
new_content=$(echo "$input" | jq -r '.tool_input.content // empty')
if [ -n "$new_content" ]; then
  if echo "$new_content" | grep -qE '(BEGIN (RSA |DSA |EC |OPENSSH )?PRIVATE KEY|api[_-]?key.*[a-zA-Z0-9]{20,}|password.*=.*[a-zA-Z0-9]{12,})'; then
    echo "UPOZORENJE: sadržaj liči na secret. Provera pre pisanja."
  fi
fi

exit 0
```

---

## D. Setup koraci (kako instalirati)

1. U korenu repoa kreiraj `.claude/settings.json` sa sadržajem iz sekcije B.
2. Kreiraj folder `.claude/hooks/`.
3. Kopiraj `check-bash-safety.sh` i `check-secrets.sh` u taj folder.
4. `chmod +x .claude/hooks/*.sh`
5. Commit u Git (`.claude/settings.json` i hookovi idu u git; `~/.claude/settings.local.json` ne ide).
6. Restartuj Claude Code sesiju (hookovi se učitavaju na startup).

---

## E. Test hookova

Pre commit-a, ručno testirati:

```bash
# Test bash safety
echo '{"tool_input":{"command":"rm -rf /"}}' | .claude/hooks/check-bash-safety.sh; echo "exit: $?"
# Očekivano: BLOKIRANO, exit 1

echo '{"tool_input":{"command":"ls -la"}}' | .claude/hooks/check-bash-safety.sh; echo "exit: $?"
# Očekivano: exit 0

# Test secrets
echo '{"tool_input":{"file_path":".env"}}' | .claude/hooks/check-secrets.sh
# Očekivano: UPOZORENJE
```

---

## F. Global vs project settings

| Sloj | Putanja | Šta tu staviti |
|------|---------|----------------|
| Project (git) | `.claude/settings.json` | Pravila specifična za projekat. Hookovi koji se odnose na ovaj kod. |
| Personal project | `.claude/settings.local.json` | Lokalne dozvole koje ne idu u git. Ide u `.gitignore`. |
| Global user | `~/.claude/settings.json` | Pravila za sve projekte. Jezik, default model, opšti guardrails. |

**Specifičnije nadjača opštije** — projekat može da uskogrlnije pravilo, ne može da ga razlabavi (osim u permissions allowlist-i).

---

## G. Šta se NE postavlja kroz hookove

- **Stil koda** — to je posao linter-a/formater-a, pre-commit hook-a u Git-u, ne Claude hooka.
- **Test execution** — bolji su Git pre-commit / pre-push hookovi, ili CI. Claude Stop hook se ne pokreće kao deo CI.
- **Validacija sintakse** — `npm run typecheck` u CI je pouzdaniji.

Pravilo: **Claude hook = ponašanje Claude-a; Git hook = ponašanje commit-a; CI = ponašanje deploya.** Ne mešati.

---

## H. Rizici hookova

- **Hook koji uvek padne = sesija ne radi.** Testiraj hook izolovano pre commit-a.
- **Hook koji odštampa MB konteksta = potroši token budžet.** Drži output kratak (head -50, tail -20).
- **Hook sa side-effects** (writes, network) = vidljiv van sesije. Samo read-only operacije u hookovima, osim ako eksplicitno znaš šta radiš.
- **Hookovi mogu biti malicious vector**: ako commit-uješ hook iz untrusted PR-a, on će se izvršiti pri sledećoj sesiji. Pregled hook diff-a pre merge-a je obavezan.

---

## I. Inkrementalni rollout

Ne instalirati sve hookove odjednom. Predloženi redosled:

1. **Nedelja 1**: samo `SessionStart` (cat preglednog dokumenta) — najmanji rizik.
2. **Nedelja 2**: dodati `permissions.deny` (statičke zabrane) — zaštita od nesreće.
3. **Nedelja 3**: dodati `PreToolUse: Bash` (safety skripta) — aktivna zaštita.
4. **Nedelja 4**: dodati `UserPromptSubmit` reminder.
5. **Nedelja 5+**: prilagoditi prema iskustvu — šta upada u oči, popraviti.

Ako bilo koji korak smanji produktivnost — vratiti i razmisliti zašto.

---

## J. Sažetak

> **Settings + hooks = jedini sloj koji prinuđava.** Sve ostalo su preporuke.
> Bez ovog fajla, „trajna i obavezna aktivacija" je samo želja.
> Sa ovim fajlom — ponašanje je instalirano na nivou sistema, ne pamćenja modela.
