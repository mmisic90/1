#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_rok.py — Deterministički proračun pravnih rokova.

SVRHA:
    Kada Milan spomene "rok" — ovaj skript se pokreće pre bilo kakve
    dalje analize i vraća konkretan datum isteka + upozorenje ako je
    rok blizu ili istekao.

PRINCIP:
    Rokovi su čisto matematika. AI NE SME da računa rokove "u glavi" —
    mora da ih računa skriptom. Skript drži hardkodovanu tabelu rokova
    po tipu postupka (P1, ažurirana sa važećim tekstovima zakona).

UPOTREBA:
    python3 check_rok.py --tip zalba-pr-presudu --datum 2026-03-25
    python3 check_rok.py --tip zzz --datum 2026-01-15 --today 2026-04-07

IZLAZ:
    exit 0 = rok nije istekao (ali može imati upozorenje)
    exit 1 = rok je istekao
    exit 2 = greška u parametrima

TIPOVI ROKOVA (osnovni, iz važećih zakona):
    zalba-na-presudu            15 dana ZKP čl. 432 / ZPP čl. 367
    zalba-skraceni              8 dana  ZKP čl. 433 st. 2
    zzz                         30 dana ZKP čl. 485
    zalba-pritvor               3 dana  ZKP čl. 214 st. 5
    odgovor-na-optuznicu        8 dana  ZKP čl. 338 st. 1
    predlog-za-izvrsenje        brez roka (ali zastara — videti zastara.py)
    zalba-resenje-izvrsenje     5 dana  ZIO čl. 79
    prigovor-protiv-resenja     8 dana  ZIO čl. 81
    tuzba-upravni-spor          30 dana ZUS čl. 18
    ustavna-zalba               30 dana ZUS čl. 85
    revizija                    30 dana ZPP čl. 404
    ponavljanje-postupka        30 dana ZPP čl. 422 (relativni)
    odgovor-na-tuzbu            30 dana ZPP čl. 297
    zalba-prekrsaj              8 dana  ZOP čl. 264
"""

import argparse
import sys
from datetime import date, timedelta, datetime
from typing import Optional

ROKOVI = {
    # naziv:                     (dani, pravni osnov,                  opis)
    "zalba-na-presudu":          (15, "ZKP čl. 432 / ZPP čl. 367",     "Žalba na presudu (redovni postupak)"),
    "zalba-skraceni":            ( 8, "ZKP čl. 433 st. 2",             "Žalba u skraćenom krivičnom postupku"),
    "zzz":                       (30, "ZKP čl. 485",                   "Zahtev za zaštitu zakonitosti"),
    "zalba-pritvor":             ( 3, "ZKP čl. 214 st. 5",             "Žalba na rešenje o pritvoru"),
    "odgovor-na-optuznicu":      ( 8, "ZKP čl. 338 st. 1",             "Odgovor na optužnicu"),
    "zalba-resenje-izvrsenje":   ( 5, "ZIO čl. 79",                    "Žalba na rešenje o izvršenju"),
    "prigovor-protiv-resenja":   ( 8, "ZIO čl. 81",                    "Prigovor protiv rešenja o izvršenju"),
    "tuzba-upravni-spor":        (30, "ZUS čl. 18",                    "Tužba u upravnom sporu"),
    "ustavna-zalba":             (30, "ZUS čl. 85",                    "Ustavna žalba"),
    "revizija":                  (30, "ZPP čl. 404",                   "Revizija"),
    "odgovor-na-tuzbu":          (30, "ZPP čl. 297",                   "Odgovor na tužbu u parnici"),
    "zalba-prekrsaj":            ( 8, "ZOP čl. 264",                   "Žalba u prekršajnom postupku"),
    "vracanje-u-predjasnje-stanje": (8, "ZIO čl. 28 / ZPP čl. 110",    "Vraćanje u pređašnje stanje"),
}


def parse_date(s: str) -> date:
    """Parse datuma u formatu YYYY-MM-DD."""
    try:
        return datetime.strptime(s, "%Y-%m-%d").date()
    except ValueError:
        raise argparse.ArgumentTypeError(
            f"Datum '{s}' nije u formatu YYYY-MM-DD"
        )


def proracun(tip: str, datum: date, today: date) -> dict:
    """Izračunava rok i vraća dict sa rezultatom."""
    if tip not in ROKOVI:
        return {
            "error": (
                f"Tip roka '{tip}' nije u bazi. Dostupni tipovi:\n  "
                + "\n  ".join(f"- {k}" for k in sorted(ROKOVI.keys()))
            )
        }

    dani, osnov, opis = ROKOVI[tip]
    rok_istice = datum + timedelta(days=dani)
    preostalo = (rok_istice - today).days

    # Serbia — rokovi ne teku praznicima/nedeljom za neke kategorije, ali
    # ovo je prosto kalendarsko računanje. Claude mora da proveri poseban
    # režim ako se primeni procesni rok koji preskače praznike.

    status = "ok"
    upozorenje = None
    if preostalo < 0:
        status = "istekao"
        upozorenje = f"⛔ ROK JE ISTEKAO pre {abs(preostalo)} dana!"
    elif preostalo == 0:
        status = "poslednji-dan"
        upozorenje = "🚨 POSLEDNJI DAN ROKA! Mora se podneti danas."
    elif preostalo <= 3:
        status = "hitno"
        upozorenje = f"🔴 HITNO: ostalo samo {preostalo} dana"
    elif preostalo <= 5:
        status = "blizu"
        upozorenje = f"⚠️ Blizu isteka: ostalo {preostalo} dana"

    return {
        "tip": tip,
        "opis": opis,
        "pravni_osnov": osnov,
        "pocetak_roka": datum.strftime("%d.%m.%Y."),
        "trajanje_dana": dani,
        "istice": rok_istice.strftime("%d.%m.%Y."),
        "danas": today.strftime("%d.%m.%Y."),
        "preostalo_dana": preostalo,
        "status": status,
        "upozorenje": upozorenje,
        "napomena_procesna": (
            "ВАЖНО: Ovaj proračun je kalendarski (prosto dodavanje dana). "
            "Za procesne rokove koji preskaču praznike/nedelje (npr. u ZKP "
            "za neke podneske) — proveri ručno da li subota/nedelja/praznik "
            "pada na poslednji dan roka. Ako da, rok se produžava na prvi "
            "radni dan (ZPP čl. 104 st. 3, ZKP čl. 225 st. 3)."
        ),
    }


def format_report(r: dict) -> str:
    """Formatiranje izveštaja."""
    if "error" in r:
        return f"GREŠKA: {r['error']}"

    lines = []
    lines.append("=" * 64)
    lines.append(f" check_rok.py — {r['opis']}")
    lines.append("=" * 64)
    lines.append(f" Pravni osnov:   {r['pravni_osnov']}")
    lines.append(f" Početak roka:   {r['pocetak_roka']}")
    lines.append(f" Trajanje:       {r['trajanje_dana']} dana")
    lines.append(f" Ističe:         {r['istice']}")
    lines.append(f" Danas:          {r['danas']}")
    lines.append(f" Preostalo:      {r['preostalo_dana']} dana")
    lines.append("")
    if r.get("upozorenje"):
        lines.append(f" {r['upozorenje']}")
        lines.append("")
    lines.append(" PROCESNA NAPOMENA:")
    lines.append(f"   {r['napomena_procesna']}")
    lines.append("=" * 64)
    return "\n".join(lines)


def main():
    p = argparse.ArgumentParser(
        description="Deterministički proračun pravnih rokova",
        epilog="Primer: python3 check_rok.py --tip zzz --datum 2026-03-01"
    )
    p.add_argument("--tip", required=True, help="Tip roka (videti --list)")
    p.add_argument("--datum", type=parse_date, help="Datum dostavljanja (YYYY-MM-DD)")
    p.add_argument("--today", type=parse_date, default=date.today(),
                   help="Današnji datum (default: stvarni današnji)")
    p.add_argument("--list", action="store_true", help="Prikaži sve dostupne tipove")

    args = p.parse_args()

    if args.list:
        print("Dostupni tipovi rokova:")
        for k, (dani, osnov, opis) in sorted(ROKOVI.items()):
            print(f"  {k:<35} {dani:>3} dana   [{osnov}]")
            print(f"      → {opis}")
        sys.exit(0)

    if not args.datum:
        print("Greška: --datum je obavezan (osim sa --list)", file=sys.stderr)
        sys.exit(2)

    r = proracun(args.tip, args.datum, args.today)

    if "error" in r:
        print(r["error"], file=sys.stderr)
        sys.exit(2)

    print(format_report(r))

    import json as j
    print("\n--- JSON ---")
    print(j.dumps(r, indent=2, ensure_ascii=False))

    sys.exit(1 if r["status"] == "istekao" else 0)


if __name__ == "__main__":
    main()
