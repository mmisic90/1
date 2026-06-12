#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verify_clanovi.py — Deterministička validacija citata članova zakona.

SVRHA:
    Hard gate između pravna-analiza Fazе 3 i Faze 4. Sprečava da se generiše
    dokument (tužba, žalba, predlog za izvršenje) sa članovima zakona koji
    nisu eksplicitno verifikovani na PropisSoft ili drugom primarnom izvoru.

PRINCIP (iz Anthropic Skills Guide, str. 26):
    "Advanced technique: For critical validations, consider bundling a script
    that performs the checks programmatically rather than relying on language
    instructions. Code is deterministic; language interpretation isn't."

UPOTREBA:
    python3 verify_clanovi.py input.json

INPUT FORMAT (JSON):
    {
      "predmet": "Stojšin v. Gutić",
      "clanovi": [
        {
          "zakon": "ZIO",
          "clan": "28",
          "stav": "1",
          "tacka": null,
          "citat": "Rok za podnošenje predloga je 30 dana",
          "verification_status": "verified" | "unverified" | "failed",
          "source_url": "https://propissoft.profisistem.rs/..." | null,
          "source_date": "2026-04-07" | null
        }
      ]
    }

IZLAZ:
    exit code 0 = PASS, sve verifikovano
    exit code 1 = FAIL, postoje neproverene stavke (STOP, ne generiši dokument)
    exit code 2 = STRUCTURE ERROR, input je neispravan

    Izveštaj na stdout kao JSON + ljudski čitljiva sekcija.

GUARDRAILS:
    - Član zakona SME biti samo "verified" ili "failed" — NIKAD "partial",
      "probably", ili "žuto". Binarni status.
    - Ako nema source_url za "verified" status → automatski FAIL.
    - Poznati zakoni (ZKP, KZ, ZPP, ZOO, ZIO, ZPD, ZUP, ZUS, ZOS, KRF)
      imaju dodatnu proveru — njihovi članovi moraju biti u raspone koje
      važeći tekst zakona poznaje.
"""

import json
import re
import sys
from typing import List, Dict, Tuple

# Poznati zakoni i njihovi validni rasponi članova (P1 — iz važećih tekstova,
# ažurirati kada nastane izmena zakona)
ZAKON_RANGES: Dict[str, Tuple[int, int]] = {
    "ZKP": (1, 604),       # Zakonik o krivičnom postupku
    "KZ": (1, 432),        # Krivični zakonik
    "ZPP": (1, 510),       # Zakon o parničnom postupku
    "ZOO": (1, 1109),      # Zakon o obligacionim odnosima
    "ZIO": (1, 562),       # Zakon o izvršenju i obezbeđenju
    "ZPD": (1, 603),       # Zakon o privrednim društvima
    "ZUP": (1, 218),       # Zakon o opštem upravnom postupku
    "ZUS": (1, 76),        # Zakon o upravnim sporovima
    "ZOS": (1, 218),       # Zakon o osnovama svojinskopravnih odnosa
    "ZR": (1, 291),        # Zakon o radu
    "PZ": (1, 367),        # Porodični zakon
    "KRF": (1, 206),       # Zakon o katastru nepokretnosti (proveriti)
    "ZJB": (1, 220),       # Zakon o javnom beležništvu
}

# Aliases — različiti nazivi istog zakona (normalizacija)
ZAKON_ALIASES: Dict[str, str] = {
    "ZAKONIK O KRIVIČNOM POSTUPKU": "ZKP",
    "KRIVIČNI ZAKONIK": "KZ",
    "ZAKON O PARNIČNOM POSTUPKU": "ZPP",
    "ZAKON O OBLIGACIONIM ODNOSIMA": "ZOO",
    "ZAKON O IZVRŠENJU I OBEZBEĐENJU": "ZIO",
    "ZAKON O IZVRSENJU": "ZIO",
    "ZAKON O PRIVREDNIM DRUŠTVIMA": "ZPD",
}

PROPISSOFT_DOMAIN = "propissoft.profisistem.rs"
APPROVED_DOMAINS = [
    "propissoft.profisistem.rs",
    "paragraf.rs",
    "vrh.sud.rs",
    "pravno-informacioni-sistem.rs",
    "ustavni.sud.rs",
]


def normalize_zakon(name: str) -> str:
    """Normalizuje naziv zakona u standardni skraćenicu."""
    n = name.strip().upper().replace(".", "")
    if n in ZAKON_RANGES:
        return n
    return ZAKON_ALIASES.get(n, n)


def validate_structure(clan_obj: dict, idx: int) -> List[str]:
    """Proveri da li objekat ima obaveznu strukturu."""
    errors = []
    required = ["zakon", "clan", "verification_status"]
    for field in required:
        if field not in clan_obj:
            errors.append(f"član #{idx}: nedostaje obavezno polje '{field}'")

    if "verification_status" in clan_obj:
        status = clan_obj["verification_status"]
        if status not in ("verified", "unverified", "failed"):
            errors.append(
                f"član #{idx}: verification_status mora biti "
                f"'verified'/'unverified'/'failed', a ne '{status}'"
            )
    return errors


def validate_clan_broj(zakon: str, clan: str, idx: int) -> List[str]:
    """Proveri da li je broj člana u validnom rasponu za poznati zakon."""
    errors = []
    z = normalize_zakon(zakon)
    if z not in ZAKON_RANGES:
        # Nepoznat zakon — ne možemo da tvrdimo, samo upozorenje
        return [f"član #{idx}: zakon '{zakon}' nije u bazi poznatih — "
                f"dodatna ručna provera obavezna"]

    # Parse broj člana — može biti "28", "28a", "354"
    m = re.match(r"^(\d+)([a-zšđčćž]?)$", str(clan).strip().lower())
    if not m:
        errors.append(f"član #{idx}: format broja člana '{clan}' neispravan "
                      f"(očekujem: broj ili broj+slovo, npr. '28', '354a')")
        return errors

    broj = int(m.group(1))
    min_br, max_br = ZAKON_RANGES[z]
    if broj < min_br or broj > max_br:
        errors.append(
            f"član #{idx}: {z} čl. {broj} VAN RASPONA "
            f"(važeći: {min_br}-{max_br}) → verovatno greška/halucinacija"
        )
    return errors


def validate_source(clan_obj: dict, idx: int) -> List[str]:
    """Proveri da li 'verified' status ima validan source_url."""
    errors = []
    status = clan_obj.get("verification_status")
    source = clan_obj.get("source_url")

    if status == "verified":
        if not source:
            errors.append(
                f"član #{idx}: status='verified' ali source_url=None → "
                f"HARD FAIL (verifikacija bez izvora = halucinacija)"
            )
        else:
            # Proveri da li je iz odobrenog domena
            is_approved = any(domain in source for domain in APPROVED_DOMAINS)
            if not is_approved:
                errors.append(
                    f"član #{idx}: source_url '{source}' nije iz odobrenog "
                    f"izvora (dozvoljeni: {', '.join(APPROVED_DOMAINS)})"
                )
    return errors


def run_validation(data: dict) -> Tuple[int, dict]:
    """Glavna validacija. Vraća (exit_code, report)."""
    predmet = data.get("predmet", "nepoznat")
    clanovi = data.get("clanovi", [])

    if not isinstance(clanovi, list):
        return 2, {"error": "'clanovi' mora biti lista"}

    report = {
        "predmet": predmet,
        "ukupno": len(clanovi),
        "verified": 0,
        "unverified": 0,
        "failed": 0,
        "structure_errors": 0,
        "errors": [],
        "warnings": [],
        "must_verify_before_docx": [],
    }

    for idx, c in enumerate(clanovi, start=1):
        if not isinstance(c, dict):
            report["errors"].append(f"stavka #{idx} nije objekat")
            report["structure_errors"] += 1
            continue

        struct_errs = validate_structure(c, idx)
        if struct_errs:
            report["errors"].extend(struct_errs)
            report["structure_errors"] += 1
            continue

        broj_errs = validate_clan_broj(c["zakon"], c["clan"], idx)
        source_errs = validate_source(c, idx)

        if any("VAN RASPONA" in e or "HARD FAIL" in e for e in broj_errs + source_errs):
            report["errors"].extend(broj_errs + source_errs)
        else:
            if broj_errs:
                report["warnings"].extend(broj_errs)
            if source_errs:
                report["warnings"].extend(source_errs)

        status = c["verification_status"]
        report[status] = report.get(status, 0) + 1

        if status in ("unverified", "failed"):
            report["must_verify_before_docx"].append({
                "zakon": c["zakon"],
                "clan": c["clan"],
                "stav": c.get("stav"),
                "action_required": (
                    f"Otvoriti https://{PROPISSOFT_DOMAIN} → pretražiti "
                    f"{normalize_zakon(c['zakon'])} čl. {c['clan']} → "
                    f"potvrditi tekst → popuniti source_url + status='verified' "
                    f"→ ponoviti verify_clanovi.py"
                )
            })

    # Exit code logika
    if report["structure_errors"] > 0:
        return 2, report
    if report["errors"]:
        return 1, report
    if report["unverified"] > 0 or report["failed"] > 0:
        return 1, report
    return 0, report


def format_report(exit_code: int, report: dict) -> str:
    """Formatira izveštaj za terminal."""
    lines = []
    lines.append("=" * 64)
    lines.append(f" verify_clanovi.py — {report.get('predmet', '?')}")
    lines.append("=" * 64)
    lines.append(f" Ukupno citiranih članova: {report.get('ukupno', 0)}")
    lines.append(f"   ✅ verified:    {report.get('verified', 0)}")
    lines.append(f"   ⚠️  unverified:  {report.get('unverified', 0)}")
    lines.append(f"   ⛔ failed:      {report.get('failed', 0)}")
    lines.append(f"   🔴 struct err:  {report.get('structure_errors', 0)}")
    lines.append("")

    if report.get("errors"):
        lines.append(" HARD ERRORS (blokiraju generisanje dokumenta):")
        for e in report["errors"]:
            lines.append(f"   • {e}")
        lines.append("")

    if report.get("warnings"):
        lines.append(" WARNINGS (ne blokiraju, ali proveri):")
        for w in report["warnings"]:
            lines.append(f"   • {w}")
        lines.append("")

    if report.get("must_verify_before_docx"):
        lines.append(" MORA SE VERIFIKOVATI PRE GENERISANJA .docx:")
        for item in report["must_verify_before_docx"]:
            lines.append(
                f"   → {item['zakon']} čl. {item['clan']}"
                + (f" st. {item['stav']}" if item.get('stav') else "")
            )
            lines.append(f"     {item['action_required']}")
        lines.append("")

    lines.append("=" * 64)
    if exit_code == 0:
        lines.append(" REZULTAT: ✅ PASS — sve verifikovano, gate Ф3→Ф4 OTVOREN")
    elif exit_code == 1:
        lines.append(" REZULTAT: ⛔ FAIL — STOP, ne generiši .docx")
        lines.append(" Sledeći korak: verifikuj preostale članove na PropisSoft")
    else:
        lines.append(" REZULTAT: 🔴 STRUCTURE ERROR — input neispravan")
    lines.append("=" * 64)
    return "\n".join(lines)


def main():
    if len(sys.argv) != 2:
        print("Upotreba: python3 verify_clanovi.py <input.json>", file=sys.stderr)
        print("Za format input.json vidi docstring ovog fajla.", file=sys.stderr)
        sys.exit(2)

    try:
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Fajl nije pronađen: {sys.argv[1]}", file=sys.stderr)
        sys.exit(2)
    except json.JSONDecodeError as e:
        print(f"Neispravan JSON: {e}", file=sys.stderr)
        sys.exit(2)

    exit_code, report = run_validation(data)

    print(format_report(exit_code, report))
    print("\n--- JSON REPORT ---")
    print(json.dumps(report, indent=2, ensure_ascii=False))

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
