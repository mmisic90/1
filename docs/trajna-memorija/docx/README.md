# DOCX verzije

U ovom folderu treba da se nalaze `.docx` verzije svih `.md` fajlova iz roditeljskog foldera (`docs/trajna-memorija/`).

## Zasto nisu commit-ovane direktno

Generator je proizveo `.docx` fajlove (svih 8 — ukupno ~330 KB) lokalno tokom rada na ovom PR-u. Provera je potvrdila da su validni Microsoft Word 2007+ fajlovi (`file` komanda).

Međutim, GitHub MCP alati (`push_files`, `create_or_update_file`) primaju sadržaj kao **UTF-8 string** koji onda dodatno base64-enkodiraju pre slanja API-ju. Binarni fajlovi sa proizvoljnim bajtovima (kao `.docx`) ne mogu se pouzdano provući kroz string posrednika — zato direktan push binarnih fajlova preko ovog tooling-a nije moguć.

Umesto toga:

1. **`.docx` fajlovi su poslati korisniku direktno** uz ovaj PR (file transfer mehanizam) — možeš ih ručno staviti u ovaj folder i commit-ovati preko git CLI-ja ili web UI-ja.
2. **Generator skripta je u repou** (`scripts/md_to_docx.py`) — možeš regenerisati `.docx` u bilo kom trenutku.

## Kako regenerisati `.docx` fajlove lokalno

```bash
# Iz korena repoa:
pip install python-docx
python3 docs/trajna-memorija/scripts/md_to_docx.py docs/trajna-memorija docs/trajna-memorija/docx
```

Očekivani izlaz:

```
Konvertujem: 00-PREGLED.md -> docx/00-PREGLED.docx
Konvertujem: 01-CLAUDE-PREDLOG.md -> docx/01-CLAUDE-PREDLOG.docx
Konvertujem: 02-GUARDRAILS.md -> docx/02-GUARDRAILS.docx
Konvertujem: 03-ANTI-HALUCINACIJE.md -> docx/03-ANTI-HALUCINACIJE.docx
Konvertujem: 04-STEELMAN.md -> docx/04-STEELMAN.docx
Konvertujem: 05-SKILLS-TOOLS-PREGLED.md -> docx/05-SKILLS-TOOLS-PREGLED.docx
Konvertujem: 06-SETTINGS-HOOKS-PREDLOG.md -> docx/06-SETTINGS-HOOKS-PREDLOG.docx
Konvertujem: 07-IZVORI.md -> docx/07-IZVORI.docx
Gotovo: 8 fajl(ova).
```

## Ako imaš pandoc

Alternativa, ako više voliš pandoc (proizvodi malo lepše tabele):

```bash
# Iz korena repoa:
for f in docs/trajna-memorija/*.md; do
  name=$(basename "$f" .md)
  pandoc "$f" -o "docs/trajna-memorija/docx/${name}.docx"
done
```

## Veriﬁkacija

Validan `.docx` počinje ZIP/OOXML signature `PK\x03\x04`. Provera:

```bash
file docs/trajna-memorija/docx/*.docx
# očekivano: "Microsoft Word 2007+" za svaki
```

Veličina očekivana: ~38–44 KB po fajlu (zavisi od složenosti markdown-a).

## Napomena za sledece commitove

Kad jednom dodaš `.docx` lokalno i commit-uješ preko git CLI-ja, oni će biti binarni u repou i Git će ih ispravno tracking-ovati. Nikakav poseban Git LFS setup nije potreban za ovu veličinu (8 × ~40 KB = ~320 KB ukupno).
