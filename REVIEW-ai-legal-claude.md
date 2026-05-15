# Pregled koda: zubair-trabzada/ai-legal-claude

**Predmet:** https://github.com/zubair-trabzada/ai-legal-claude (grana `main`, commit `19ece98`)
**Tip projekta:** Kolekcija Claude Code skill-ova i agenata za pregled ugovora i generisanje pravnih dokumenata (Markdown promptovi + dve Python skripte + bash instaler).
**Metod:** Čitanje svih fajlova u repozitorijumu + empirijska provera dve sumnjive greške pokretanjem `scripts/generate_legal_pdf.py` sa ReportLab-om.

> Napomena: ovo je tehnički pregled koda, ne pravni savet. Ocene kvaliteta pravnog sadržaja skill-ova su izvan opsega.

---

## Sažetak ocene

Domenski sadržaj (pravni promptovi, okviri za skorovanje rizika, lista usklađenosti) je kvalitetan, konkretan i odgovorno napisan — disclaimer je dosledan kroz ceo projekat. Međutim, **isporučni mehanizam je pokvaren**: zbog nedostajućeg frontmatera većina skill-ova, uključujući flagship komandu, neće biti registrovana u Claude Code-u, a dokumentovani način pozivanja PDF skripte ne radi (empirijski potvrđeno). U trenutnom stanju projekat ne radi onako kako README tvrdi.

Prioritet popravki: nalazi 1, 2 i 3 su blokirajući.

---

## Kritični nalazi

### 1. Nedostaje YAML frontmatter u 9 od 14 SKILL.md fajlova (uključujući flagship)

Claude Code prepoznaje skill samo ako `SKILL.md` ima frontmatter sa `name` i `description`. Provereno čitanjem prvih linija svakog fajla:

- **Bez frontmatera (9):** `legal/SKILL.md` (orkestrator), `skills/legal-review/SKILL.md` (**flagship**), `skills/legal-risks`, `skills/legal-agreement`, `skills/legal-compliance`, `skills/legal-freelancer`, `skills/legal-privacy`, `skills/legal-report-pdf`, `skills/legal-terms`
- **Sa frontmaterom (5):** `legal-compare`, `legal-missing`, `legal-nda`, `legal-negotiate`, `legal-plain`

Posledica: glavni orkestrator i najvažnija komanda (`/legal review`) se ne registruju kao skill-ovi. README („One command installs all 14 skills") ne odgovara stvarnom ponašanju.

**Popravka:** dodati frontmatter (`name`, `description`, po potrebi `command`) u svih 9 fajlova, po uzoru na `skills/legal-nda/SKILL.md:1-5`.

### 2. Dokumentovani poziv PDF skripte ne radi — pogrešno ime i pogrešan interfejs

`skills/legal-report-pdf/SKILL.md` instruktira pozivanje:

- linija 56-61: traži skriptu po imenu **`generate_pdf_report.py`**
- linija 67-68 i 362: `python3 [script] --input [md] --output CONTRACT-REVIEW-REPORT.pdf`

Stvarnost u `scripts/generate_legal_pdf.py`:

- ime fajla je **`generate_legal_pdf.py`** (ne `generate_pdf_report.py`)
- `generate_legal_pdf.py:432-446` prima **pozicione** argumente `<json_data_file> [output_path]` i radi `json.load` — očekuje **JSON**, ne Markdown, i ne podržava `--input/--output`

Empirijska provera dokumentovanog poziva:

```
$ python3 scripts/generate_legal_pdf.py --input a.md --output o.pdf
FileNotFoundError: [Errno 2] No such file or directory: '--input'   (rc=1)
```

Skill nigde ne opisuje korak „izvuci podatke iz Markdown-a u JSON", pa čak i sa ispravnim imenom i pozicionim argumentom skripta dobija Markdown tamo gde očekuje JSON. Lanac je prekinut na dva mesta.

**Popravka:** uskladiti ime skripte i interfejs — ili dodati `argparse` sa `--input/--output` + Markdown parser u skriptu, ili promeniti SKILL.md da generiše JSON i poziva `generate_legal_pdf.py <data.json> <out.pdf>`.

### 3. Instaler postavlja skripte na lokaciju koju skill nikad ne pretražuje

`install.sh:75, 155-161` kopira skripte u `$HOME/.claude/skills/legal/scripts/`.
`skills/legal-report-pdf/SKILL.md:56-61` traži skriptu na: `ai-legal-claude/scripts/`, `scripts/`, `../scripts/`, glob `**/generate_pdf_report.py`, i (linija 362) `/tmp/generate_legal_pdf.py`.

Nijedna od pretraživanih putanja ne odgovara stvarnoj instalacionoj lokaciji. Posle uspešne instalacije skill ne može da nađe sopstvenu skriptu i pada na inline generisanje.

**Popravka:** dodati `$HOME/.claude/skills/legal/scripts/generate_legal_pdf.py` kao prvu pretraživanu putanju u SKILL.md (i ispraviti ime fajla — videti nalaz 2).

---

## Srednji nalazi

### 4. ReportLab markup injection — tekst ugovora ruši generisanje PDF-a

`generate_legal_pdf.py:357-373` ubacuje neproveren tekst klauzula u `Paragraph(...)` preko f-stringova; linija 358 dodatno gradi `<font color=...>` markup. ReportLab `Paragraph` parsira XML-ολики markup. Empirijski:

- goli `<`, `&`, `AT&T`, `< 30` — tolerisano (rc=0) u testiranoj verziji ReportLab-a
- tekst koji sadrži ReportLab inline tagove (`</font>`, `<b>`, …) — **pad**: `rc=1, Parse error: saw </font> instead of expected </para>`

Oslanjanje na trenutnu toleranciju ReportLab-a je krhko; ugovori realno sadrže `<`, `>`, `&`. Ispravno rešenje je escape korisničkog teksta sa `xml.sax.saxutils.escape` (ili `reportlab.lib.utils` ekvivalent) pre interpolacije.

### 5. install.sh maskira neuspeh kloniranja → lažno „Installation Complete"

`install.sh:45` izvršava `git clone … 2>/dev/null`. Ako klon ne uspe (mreža, rate-limit), greška se guta. Svi naknadni `cp` su iza `if [ -f … ]` straža, pa ih `set -e` ne hvata. Rezultat: skripta ispiše „Installation Complete!" iako je instalirano 0 fajlova.

**Popravka:** proveriti izlazni kod `git clone` i prekinuti uz jasnu poruku ako klon ne uspe.

### 6. Arhitektura UX-a ne odgovara modelu skill-ova u Claude Code-u

Ceo README i instaler reklamiraju `/legal review <file>`, `/legal nda <opis>` itd. kao slash-komande sa podkomandama i argumentima. Claude Code skill-ovi se aktiviraju po `name`/`description` (model-invoked) ili kao `/<skill-name>` — ne postoji nativni mehanizam pod-komandi `/legal <subcommand> <args>`. Uz nalaz 1 (orkestrator bez frontmatera), `/legal` se ni ne registruje. Dizajn rutiranja kroz `legal/SKILL.md` je razuman kao koncept, ali dokumentacija stvara očekivanje koje platforma ne ispunjava.

---

## Manji nalazi

- **7.** Brojanje „14 Skills": tačno po broju SKILL.md fajlova (1 orkestrator + 13), ali „skills" uključuje i orkestrator — formulacija može da zavara.
- **8.** `generate_sample_contract.py` (~22 KB) i `sample-contract.pdf` stoje u root-u; pripadaju u `scripts/` ili `examples/`. Nedostaju `LICENSE`, testovi i CI — za projekat koji se instalira preko `curl | bash` to je primetan propust higijene.
- **9.** `curl -fsSL … | bash` (README:32) je standardna ali rizična praksa; vredi bar ponuditi „pregledaj pa pokreni" alternativu (preuzmi → pregledaj → `./install.sh`), pošto je već dokumentovana lokalna varijanta.

---

## Pozitivno

- **Pravna higijena:** disclaimer je dosledan i jasan — `legal/SKILL.md:5,74-80`, svaki izlazni šablon, i poseban pravni disclaimer u `agents/legal-risks.md:279-291`. Odgovoran pristup za alat ovog tipa.
- **Kvalitet domenskog sadržaja:** okvir za skorovanje rizika (`agents/legal-risks.md:89-138`), poison-pill heuristike (139-167) i framework-po-framework lista usklađenosti (`skills/legal-compliance/SKILL.md:52-159`) su konkretni i upotrebljivi kao prompt biblioteka.
- **Konzistentan format izveštaja** kroz skill-ove (`skills/legal-review/SKILL.md:109-184`).
- **PDF skripta radi za ispravan (JSON) ulaz** — empirijski potvrđeno (`generate_legal_pdf.py <data.json> <out.pdf>` → rc=0, validan PDF).

---

## Prioritizovana lista popravki

1. [ ] Dodati YAML frontmatter u 9 SKILL.md fajlova bez njega (nalaz 1) — blokira sve.
2. [ ] Uskladiti ime i pozivni interfejs PDF skripte između `legal-report-pdf/SKILL.md` i `generate_legal_pdf.py` (nalaz 2).
3. [ ] Dodati stvarnu instalacionu putanju u pretragu skripte u SKILL.md (nalaz 3).
4. [ ] Escape-ovati korisnički tekst pre `Paragraph` interpolacije (nalaz 4).
5. [ ] Proveriti izlazni kod `git clone` u `install.sh` (nalaz 5).
6. [ ] Uskladiti README/UX dokumentaciju sa stvarnim modelom skill-ova (nalaz 6).
7. [ ] Higijena repo-a: `LICENSE`, premestiti sample fajlove, dodati osnovne testove (nalazi 7–9).
