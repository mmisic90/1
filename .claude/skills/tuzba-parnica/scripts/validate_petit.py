#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
validate_petit.py — Strukturna validacija petita pre .docx generisanja.

SVRHA:
    Hard gate između pravna-analiza Ф6 (generisanje) i .docx kreiranja.
    Proverava da li tekst tužbe ili predloga za izvršenje sadrži OBAVEZNE
    elemente prema stilu advokata Milana Mišića i važećim zakonima (ZPP,
    ZIO). Ako neki element nedostaje — BLOK, ne piši .docx dok se ne ispravi.

PRINCIP:
    Svaka mustra ima fiksne elemente koji moraju biti prisutni. Ti elementi
    se mogu detektovati regex-om — deterministički. Ako Claude zaboravi jedan
    element (npr. "ОБАВЕЗУЈЕ СЕ" formulaciju ili kamatnu stopu), skript to
    hvata pre nego što se fajl pošalje korisniku.

UPOTREBA:
    python3 validate_petit.py --tip tuzba-naplata --tekst tuzba.txt
    python3 validate_petit.py --tip predlog-izvrsenje --tekst predlog.txt
    python3 validate_petit.py --list   (prikazuje dostupne mustre)

TIPOVI:
    tuzba-naplata          Tužba za naplatu novčanog potraživanja
    tuzba-naknada-stete    Tužba za naknadu štete
    tuzba-utvrdjenje       Tužba za utvrđenje
    predlog-izvrsenje      Predlog za izvršenje na osnovu izvršne isprave
    zalba-presuda          Žalba na presudu
"""

import argparse
import re
import sys
from typing import Dict, Tuple


# Svaka mustra definiše OBAVEZNE elemente kao regex obrasce.
MUSTRE: Dict[str, Dict[str, Tuple[str, str]]] = {
    "tuzba-naplata": {
        "naslov_tuzba": (
            r"Т\s*У\s*Ж\s*Б\s*А",
            "Nedostaje centrirani naslov 'ТУЖБА'"
        ),
        "tuzilac_tuzeni": (
            r"ТУЖИЛАЦ\s*:[\s\S]{0,500}?ТУЖЕНИ\s*:",
            "Nedostaje labela 'ТУЖИЛАЦ:' i 'ТУЖЕНИ:'"
        ),
        "vsp": (
            r"ВСП\s*:|ВРЕДНОСТ\s+СПОРА|вредност\s+спора",
            "Nedostaje oznaka vrednosti spora (ВСП)"
        ),
        "obavezuje_se": (
            r"ОБАВЕЗУЈЕ\s+СЕ",
            "Nedostaje formulacija 'ОБАВЕЗУЈЕ СЕ' u petitu (obavezna po stilu Mišić)"
        ),
        "iznos_dinara": (
            r"\d{1,3}(\.\d{3})*(,\d{2})?\s*динара",
            "Nedostaje iznos u dinarima (npr. '500.000,00 динара')"
        ),
        "zatezna_kamata": (
            r"законск[аиуо].{0,10}затезн[аиуо].{0,10}камат",
            "Nedostaje 'законска затезна камата' u petitu"
        ),
        "rok_15_dana": (
            r"у\s+року\s+од\s+15\s*(\(петнаест\))?\s*дана",
            "Nedostaje 'у року од 15 дана' u petitu"
        ),
        "pod_pretnjom": (
            r"под\s+претњом\s+принудног\s+извршења",
            "Nedostaje klauzula 'под претњом принудног извршења'"
        ),
        "dokaz": (
            r"ДОКАЗ\s*:",
            "Nedostaje oznaka 'ДОКАЗ:' posle činjenica (stil Mišić — kurzivom)"
        ),
        "troskovnik": (
            r"Т\s*р\s*о\s*ш\s*к\s*о\s*в\s*н\s*и\s*к|ТРОШКОВНИК",
            "Nedostaje 'Трошковник' na kraju tužbe"
        ),
        "potpis_adv": (
            r"адв\.?\s*Милан\s*Мишић|Милан\s*Мишић",
            "Nedostaje potpis 'адв. Милан Мишић'"
        ),
    },

    "predlog-izvrsenje": {
        "tacka1_adresat_sud": (
            r"ОСНОВНОМ\s+СУДУ|ВИШЕМ\s+СУДУ|ПРИВРЕДНОМ\s+СУДУ",
            "Tačka 1: Adresat mora biti SUD (ne izvršitelj)"
        ),
        "tacka2_poverilac": (
            r"ИЗВРШНИ\s+ПОВЕРИЛАЦ|извршни\s+поверилац",
            "Tačka 2: Nedostaje 'ИЗВРШНИ ПОВЕРИЛАЦ'"
        ),
        "tacka3_duznik": (
            r"ИЗВРШНИ\s+ДУЖНИК|извршни\s+дужник",
            "Tačka 3: Nedostaje 'ИЗВРШНИ ДУЖНИК' (+ proveri JMBG)"
        ),
        "tacka4_naslov": (
            r"ПРЕДЛОГ\s+ЗА\s+ИЗВРШЕЊЕ",
            "Tačka 4: Nedostaje naslov 'ПРЕДЛОГ ЗА ИЗВРШЕЊЕ'"
        ),
        "tacka5_izvrsna_isprava": (
            r"Пресуд|Решењ|извршн[аеу].{0,5}исправ",
            "Tačka 5: Nedostaje pominjanje izvršne isprave"
        ),
        "tacka5_dokaz": (
            r"ДОКАЗ\s*:",
            "Tačka 5: Nedostaje 'ДОКАЗ:' posle navoda iz izvršne isprave"
        ),
        "tacka6_resenje": (
            r"РЕШЕЊЕ\s+О\s+ИЗВРШЕЊУ",
            "Tačka 6: Nedostaje predlog za donošenje REŠENJA O IZVRŠENJU"
        ),
        "tacka7_celokupna_imovina": (
            r"ЦЕЛОКУПН[АОУ].{0,5}ИМОВИН|целокупн[оу]ј\s+имовин",
            "Tačka 7: Nedostaje 'НА ЦЕЛОКУПНОЈ ИМОВИНИ'"
        ),
        "tacka8_prenos_racun": (
            r"(пренос|уплат).{0,30}(рачун|текући)",
            "Tačka 8: Nedostaje pasus o prenosu na račun poverioca"
        ),
        "tacka9_izvrsitelj": (
            r"Жељко\s+Кешић|извршитељ",
            "Tačka 9: Izvršitelj (Željko Kešić) mora biti SAMO na kraju"
        ),
        "tacka10_troskovnik": (
            r"Трошковник|ТРОШКОВНИК",
            "Tačka 10: Nedostaje numerisan 'Трошковник'"
        ),
        "potpis": (
            r"адв\.?\s*Милан\s*Мишић",
            "Nedostaje potpis 'адв. Милан Мишић'"
        ),
    },

    "zalba-presuda": {
        "naslov_zalba": (
            r"Ж\s*А\s*Л\s*Б\s*А",
            "Nedostaje naslov 'ЖАЛБА'"
        ),
        "putem_suda": (
            r"путем",
            "Nedostaje 'путем [prvostepenog suda]'"
        ),
        "razlozi_zalbe": (
            r"битн[аеи].{0,30}повред|повред[аеи].{0,10}кривичн[оеи].{0,10}закон|погрешн[оеи].{0,5}чињеничн",
            "Nedostaje nabrajanje razloga žalbe"
        ),
        "obrazlozenje": (
            r"ОБРАЗЛОЖЕЊЕ",
            "Nedostaje naslov 'ОБРАЗЛОЖЕЊЕ'"
        ),
        "predlog": (
            r"(преинач|укин).{0,30}(првостепен|пресуд)",
            "Nedostaje predlog drugostepenom sudu"
        ),
        "potpis": (
            r"бранилац\s+окривљеног|адв\.?\s*Милан",
            "Nedostaje potpis 'бранилац окривљеног'"
        ),
    },

    "tuzba-naknada-stete": {
        "naslov_tuzba": (r"Т\s*У\s*Ж\s*Б\s*А", "Nedostaje naslov 'ТУЖБА'"),
        "tuzilac_tuzeni": (
            r"ТУЖИЛАЦ\s*:[\s\S]{0,500}?ТУЖЕНИ\s*:",
            "Nedostaje 'ТУЖИЛАЦ:' i 'ТУЖЕНИ:'"
        ),
        "radi_naknade": (
            r"ради\s+накнаде\s+штете",
            "Nedostaje 'ради накнаде штете' u podnaslovu"
        ),
        "vsp": (r"ВСП\s*:|ВРЕДНОСТ\s+СПОРА", "Nedostaje VSP"),
        "obavezuje_se": (r"ОБАВЕЗУЈЕ\s+СЕ", "Nedostaje 'ОБАВЕЗУЈЕ СЕ'"),
        "zakon_zoo": (
            r"чл(ан)?\.?\s*(154|155|200|201)",
            "Nedostaje pozivanje na čl. ZOO (154, 155, 200, 201)"
        ),
        "dokaz": (r"ДОКАЗ\s*:", "Nedostaje 'ДОКАЗ:'"),
        "troskovnik": (r"Трошковник|ТРОШКОВНИК", "Nedostaje 'Трошковник'"),
    },

    "tuzba-utvrdjenje": {
        "naslov_tuzba": (r"Т\s*У\s*Ж\s*Б\s*А", "Nedostaje naslov 'ТУЖБА'"),
        "radi_utvrdjenja": (r"ради\s+утврђења", "Nedostaje 'ради утврђења'"),
        "utvrdjuje_se": (
            r"УТВРЂУЈЕ\s+СЕ",
            "Nedostaje 'УТВРЂУЈЕ СЕ' u petitu"
        ),
        "pravni_interes": (
            r"правн[ии].{0,5}интерес|чл(ан)?\.?\s*188",
            "Nedostaje pravni interes (čl. 188 ZPP)"
        ),
        "dokaz": (r"ДОКАЗ\s*:", "Nedostaje 'ДОКАЗ:'"),
        "troskovnik": (r"Трошковник|ТРОШКОВНИК", "Nedostaje 'Трошковник'"),
    },
}


def validate(tekst: str, tip: str) -> dict:
    """Validira tekst prema mustri."""
    if tip not in MUSTRE:
        return {
            "error": (
                f"Tip '{tip}' nije u bazi.\n"
                f"Dostupni: {', '.join(sorted(MUSTRE.keys()))}"
            )
        }

    mustra = MUSTRE[tip]
    results = {
        "tip": tip,
        "ukupno_provera": len(mustra),
        "prosao": 0,
        "pao": 0,
        "propusti": [],
        "prosle_provere": [],
    }

    for ime_provere, (regex, opis_greske) in mustra.items():
        match = re.search(regex, tekst, re.IGNORECASE | re.MULTILINE | re.DOTALL)
        if match:
            results["prosao"] += 1
            results["prosle_provere"].append(ime_provere)
        else:
            results["pao"] += 1
            results["propusti"].append({
                "provera": ime_provere,
                "problem": opis_greske,
            })

    results["procenat"] = round(
        100 * results["prosao"] / results["ukupno_provera"], 1
    )
    return results


def format_report(r: dict) -> str:
    if "error" in r:
        return f"GREŠKA: {r['error']}"

    lines = []
    lines.append("=" * 64)
    lines.append(f" validate_petit.py — Tip: {r['tip']}")
    lines.append("=" * 64)
    lines.append(f" Ukupno obaveznih elemenata: {r['ukupno_provera']}")
    lines.append(f"   ✅ Prošlo:  {r['prosao']}")
    lines.append(f"   ⛔ Palo:    {r['pao']}")
    lines.append(f"   Procenat:   {r['procenat']}%")
    lines.append("")

    if r["propusti"]:
        lines.append(" NEDOSTAJUĆI ELEMENTI (moraš ispraviti pre .docx):")
        for p in r["propusti"]:
            lines.append(f"   ⛔ [{p['provera']}]")
            lines.append(f"      {p['problem']}")
        lines.append("")

    lines.append("=" * 64)
    if r["pao"] == 0:
        lines.append(" REZULTAT: ✅ PASS — svi obavezni elementi prisutni")
        lines.append(" Gate Ф6→ISPORUKA: OTVOREN za .docx generisanje")
    else:
        lines.append(" REZULTAT: ⛔ FAIL — STOP, ne generiši .docx")
        lines.append(f" Broj propusta: {r['pao']}")
    lines.append("=" * 64)
    return "\n".join(lines)


def main():
    p = argparse.ArgumentParser(
        description="Strukturna validacija petita pre .docx generisanja"
    )
    p.add_argument("--tip", help="Tip podneska (videti --list)")
    p.add_argument("--tekst", help="Fajl sa tekstom (txt)")
    p.add_argument("--stdin", action="store_true", help="Čita tekst sa stdin")
    p.add_argument("--list", action="store_true", help="Prikaži dostupne tipove")

    args = p.parse_args()

    if args.list:
        print("Dostupni tipovi podneska:\n")
        for tip in sorted(MUSTRE.keys()):
            print(f"  {tip}")
            print(f"    Obaveznih elemenata: {len(MUSTRE[tip])}")
            for ime, (_, opis) in MUSTRE[tip].items():
                print(f"      • {ime}")
            print()
        sys.exit(0)

    if not args.tip:
        print("Greška: --tip je obavezan", file=sys.stderr)
        sys.exit(2)

    if args.stdin:
        tekst = sys.stdin.read()
    elif args.tekst:
        with open(args.tekst, "r", encoding="utf-8") as f:
            tekst = f.read()
    else:
        print("Greška: --tekst ili --stdin je obavezan", file=sys.stderr)
        sys.exit(2)

    r = validate(tekst, args.tip)
    print(format_report(r))

    if "error" in r:
        sys.exit(2)

    import json
    print("\n--- JSON ---")
    print(json.dumps(r, indent=2, ensure_ascii=False))

    # HARD GATE exit code (dodato za G3 failure gates)
    # 0 = 100% prošlo, gate otvoren
    # 1 = nešto nedostaje, gate BLOKIRAN
    procenat = r.get("procenat", 0)
    if procenat >= 100:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
