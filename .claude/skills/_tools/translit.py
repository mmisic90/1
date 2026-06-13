#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Srpska ćirilica -> latinica, bez gubitka. Idempotentno (latinica ostaje latinica).
Po politici pisma: konvertuje SAMO instrukcioni sloj skilova.
NE diraj: stil-pisanja/**, */references/sabloni/**, izvrsenje/.../mustre/**.

Upotreba:
  python3 translit.py <fajl.md> [fajl2.md ...]      # konvertuj tačno date fajlove
  python3 translit.py --check <fajl.md>             # samo prijavi ima li ćirilice
"""
import sys

# Digrafi prvo (Џ pre Д, itd. nije problem jer mapiramo cele kodne tačke)
MAP = {
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ђ': 'Đ', 'Е': 'E',
    'Ж': 'Ž', 'З': 'Z', 'И': 'I', 'Ј': 'J', 'К': 'K', 'Л': 'L', 'Љ': 'Lj',
    'М': 'M', 'Н': 'N', 'Њ': 'Nj', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S',
    'Т': 'T', 'Ћ': 'Ć', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Č',
    'Џ': 'Dž', 'Ш': 'Š',
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'đ', 'е': 'e',
    'ж': 'ž', 'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj',
    'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
    'т': 't', 'ћ': 'ć', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'č',
    'џ': 'dž', 'ш': 'š',
}


def translit(text):
    out = []
    for i, ch in enumerate(text):
        rep = MAP.get(ch)
        if rep is None:
            out.append(ch)
            continue
        # Pametan case za digrafe: Љ/Њ/Џ -> "LJ" ako je sledeći znak takođe veliko ćir.
        if rep in ('Lj', 'Nj', 'Dž'):
            nxt = text[i + 1] if i + 1 < len(text) else ''
            if nxt and nxt.isupper() and nxt in MAP:
                rep = rep.upper()
        out.append(rep)
    return ''.join(out)


def has_cyrillic(text):
    return any(c in MAP for c in text)


if __name__ == '__main__':
    args = sys.argv[1:]
    if args and args[0] == '--check':
        bad = [f for f in args[1:] if has_cyrillic(open(f, encoding='utf-8').read())]
        if bad:
            print('JOŠ IMA ĆIRILICE:', *bad, sep='\n  ')
            sys.exit(1)
        print('OK — nema ćirilice')
    else:
        for f in args:
            s = open(f, encoding='utf-8').read()
            open(f, 'w', encoding='utf-8').write(translit(s))
            print('translit:', f)
