#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
cite_diff.py — Mehanički DIFF citata protiv originala.

SVRHA:
    Kada verifikator Protokol A treba da proveri da li je Claude tačno
    citirao (ili parafrazirao sa tvrdnjom da citira), ovaj skript radi
    word-by-word poređenje i detektuje halucinacije.

PRINCIP:
    Ne oslanjamo se na to da Claude "oseti" razliku između citata i
    parafraza. Difflib radi determinističko poređenje i vraća tačan
    match score + listu razlika. Kod je detrministički; jezik nije.

UPOTREBA:
    python3 cite_diff.py --claim "tekst citat" --source "original tekst"
    python3 cite_diff.py --claim-file a.txt --source-file b.txt
    python3 cite_diff.py --strict --claim "..." --source "..."
      (strict = zahteva 100% match, ne 95%)

IZLAZ:
    exit 0 = PASS (match ≥ 95% ili 100% u strict režimu)
    exit 1 = FAIL (halucinacija ili izmišljena reč)
    exit 2 = WARNING (match 70-94%, parafraza označena kao citat)

PRAVILO:
    Ako je Claude napisao tekst u navodnicima ("...") i tvrdi da je
    direktan citat iz dokumenta, cite_diff.py MORA vratiti exit 0.
    Ako Claude označi kao parafraz (bez navodnika), cite_diff.py se
    ne pokreće — parafraza se proverava semantički, ne mehanički.
"""

import argparse
import difflib
import re
import sys


def normalize(text: str) -> str:
    """Normalizuje tekst za poređenje: whitespace, interpunkcija."""
    # Ukloni višestruki whitespace
    text = re.sub(r"\s+", " ", text)
    # Strip
    return text.strip()


def tokenize(text: str) -> list:
    """Razbija tekst u tokene (reči sa interpunkcijom kao odvojenim)."""
    # Svaka reč i svaki znak interpunkcije kao zaseban token
    return re.findall(r"\w+|[^\w\s]", text, re.UNICODE)


def compute_diff(claim: str, source: str) -> dict:
    """Izračunava diff između claim-a i source-a."""
    claim_n = normalize(claim)
    source_n = normalize(source)

    # Character-level ratio (strogo)
    char_ratio = difflib.SequenceMatcher(None, claim_n, source_n).ratio()

    # Word-level ratio (tolerantnije)
    claim_tokens = tokenize(claim_n)
    source_tokens = tokenize(source_n)
    word_ratio = difflib.SequenceMatcher(None, claim_tokens, source_tokens).ratio()

    # Detaljna razlika
    differ = difflib.Differ()
    diff_lines = list(differ.compare(claim_tokens, source_tokens))

    added = [line[2:] for line in diff_lines if line.startswith("+ ")]  # u source, nema u claim
    removed = [line[2:] for line in diff_lines if line.startswith("- ")]  # u claim, nema u source

    return {
        "claim_length": len(claim_n),
        "source_length": len(source_n),
        "char_match_percent": round(char_ratio * 100, 2),
        "word_match_percent": round(word_ratio * 100, 2),
        "claim_tokens": len(claim_tokens),
        "source_tokens": len(source_tokens),
        "words_in_claim_not_in_source": removed,  # halucinacija kandidati
        "words_in_source_not_in_claim": added,    # ispuštene reči
        "claim_normalized": claim_n,
        "source_normalized": source_n,
    }


def classify(diff: dict, strict: bool = False) -> tuple:
    """Klasifikuje diff i vraća (exit_code, status, upozorenje)."""
    word_match = diff["word_match_percent"]
    halucinacija_kandidati = diff["words_in_claim_not_in_source"]

    threshold_pass = 100 if strict else 95
    threshold_warn = 70

    if word_match >= threshold_pass and not halucinacija_kandidati:
        return (0, "PASS", "✅ Citat se slaže sa originalom")

    if word_match >= threshold_pass and halucinacija_kandidati:
        return (1, "FAIL", (
            f"🔴 HALUCINACIJA: match je {word_match}% ali postoje reči u "
            f"citatu koje nema u originalu: {halucinacija_kandidati}"
        ))

    if word_match >= threshold_warn:
        return (2, "WARN", (
            f"⚠️ Parafraza označena kao citat: match samo {word_match}%. "
            f"Ako je u navodnicima — UKLONI navodnike ili ispravi citat."
        ))

    return (1, "FAIL", (
        f"🔴 HALUCINACIJA: match samo {word_match}% — citat ne odgovara "
        f"originalu. Verovatno izmišljeno ili iz pogrešnog izvora."
    ))


def format_report(diff: dict, status: str, upozorenje: str, strict: bool) -> str:
    """Formatira izveštaj."""
    lines = []
    lines.append("=" * 64)
    lines.append(f" cite_diff.py — REŽIM: {'STRICT (100%)' if strict else 'STANDARD (95%)'}")
    lines.append("=" * 64)
    lines.append(f" Claim length:   {diff['claim_length']} karaktera ({diff['claim_tokens']} tokena)")
    lines.append(f" Source length:  {diff['source_length']} karaktera ({diff['source_tokens']} tokena)")
    lines.append("")
    lines.append(f" Match (char):   {diff['char_match_percent']}%")
    lines.append(f" Match (word):   {diff['word_match_percent']}%  ← glavni kriterijum")
    lines.append("")

    if diff["words_in_claim_not_in_source"]:
        lines.append(" REČI U CITATU KOJE NEDOSTAJU U ORIGINALU:")
        lines.append(f"   {', '.join(repr(w) for w in diff['words_in_claim_not_in_source'][:20])}")
        if len(diff["words_in_claim_not_in_source"]) > 20:
            lines.append(f"   ... i još {len(diff['words_in_claim_not_in_source']) - 20}")
        lines.append(" → Ovo su potencijalne halucinacije!")
        lines.append("")

    if diff["words_in_source_not_in_claim"]:
        lines.append(" REČI IZ ORIGINALA KOJE CITAT IZOSTAVLJA:")
        lines.append(f"   {', '.join(repr(w) for w in diff['words_in_source_not_in_claim'][:20])}")
        if len(diff["words_in_source_not_in_claim"]) > 20:
            lines.append(f"   ... i još {len(diff['words_in_source_not_in_claim']) - 20}")
        lines.append(" → Selektivno citiranje (ne mora biti halucinacija, ali proveri).")
        lines.append("")

    lines.append("=" * 64)
    lines.append(f" REZULTAT: {status}")
    lines.append(f" {upozorenje}")
    lines.append("=" * 64)
    return "\n".join(lines)


def main():
    p = argparse.ArgumentParser(
        description="DIFF citata protiv originalnog teksta",
    )
    p.add_argument("--claim", help="Tekst koji tvrdimo da je citat")
    p.add_argument("--claim-file", help="Fajl sa tekstom citata")
    p.add_argument("--source", help="Originalni tekst (iz dokumenta)")
    p.add_argument("--source-file", help="Fajl sa originalnim tekstom")
    p.add_argument("--strict", action="store_true",
                   help="Strict režim: zahteva 100% match umesto 95%")

    args = p.parse_args()

    # Učitaj claim
    if args.claim_file:
        with open(args.claim_file, "r", encoding="utf-8") as f:
            claim = f.read()
    elif args.claim:
        claim = args.claim
    else:
        print("Greška: --claim ili --claim-file je obavezno", file=sys.stderr)
        sys.exit(2)

    # Učitaj source
    if args.source_file:
        with open(args.source_file, "r", encoding="utf-8") as f:
            source = f.read()
    elif args.source:
        source = args.source
    else:
        print("Greška: --source ili --source-file je obavezno", file=sys.stderr)
        sys.exit(2)

    diff = compute_diff(claim, source)
    exit_code, status, upozorenje = classify(diff, strict=args.strict)

    print(format_report(diff, status, upozorenje, args.strict))

    import json
    print("\n--- JSON ---")
    # Ukloni duge nizove iz JSON report-a
    brief = {k: v for k, v in diff.items() if k not in ("claim_normalized", "source_normalized")}
    brief["status"] = status
    print(json.dumps(brief, indent=2, ensure_ascii=False))

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
