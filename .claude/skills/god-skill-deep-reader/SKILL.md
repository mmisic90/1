---
name: god-skill-deep-reader
description: >
  Duboko čitanje i povezivanje činjenica za pravni rad adv. Milana Mišića — uvek u
  pozadini pravnog steka. Aktiviraj ČIM postoji dokument za analizu (presuda,
  rešenje, optužnica, ugovor, zapisnik, nalaz veštaka, spis, izvod, zaključak
  izvršitelja) — PRE pravna-analiza F0. Trigeri: učitan dokument, „pročitaj
  detaljno", „šta piše u spisu", „poveži činjenice", „rentgen dokumenta", „duboko
  čitanje". Izlaz: strukturalni rentgen dokumenta, kontrolisano čitanje (svaka
  stranica), mreža veza propis ↔ praksa, HIT LISTA ključnih veza i Bajes ulaz za
  pravna-analiza. NE aktivirati za: blanko zadatke bez dokumenta, kreativni rad,
  Instagram, tehnički debugging.
metadata:
  author: "Milan Mišić, advokat"
  version: "1.0.0 (omotač — sastavljen iz deep_understanding_module)"
  composes-with: ["pravna-analiza", "istrazivanje-prakse", "verifikator"]
  required-by: ["pravna-analiza"]
  category: "legal-analysis"
  last-updated: "2026-06-12"
---

# God-skill Deep Reader — duboko razumevanje dokumenata

> **Pismo:** instrukcije ovog skila su latinica (token-ekonomija, vidi `_policy/politika-pisma.md`); izlazni pravni akt je uvek ćirilica — kontroliše `stil-pisanja`.

> **Napomena o poreklu:** Ovaj SKILL.md je omotač sastavljen od strane Claude Code-a
> oko korisnikovog modula `references/deep-understanding-module.md` (Modul za duboko
> razumevanje i povezivanje činjenica: Propis ↔ Praksa), da bi lanac skilova
> (pravna-analiza → … → verifikator) imao radni `god-skill-deep-reader`. Ako postoji
> originalni SKILL.md ovog skila — zameniti ovaj fajl njime.

## Svrha

Osnovni RAG pristup („nađi sličan čank, vrati citat") nije razumevanje. Ovaj skill
nameće način čitanja koji:

1. **Parsira strukturu pravnog teksta** — razlikuje ratio decidendi od obiter dicta,
   obavezu od ovlašćenja, definiciju od uslova i izuzetka;
2. **Povezuje činjenice kroz više dokumenata** — zakon → podzakonski akt → odluka →
   izmena → nova praksa;
3. **Premošćuje jaz propis ↔ praksa** — detektuje kad sud tumači odredbu drugačije
   od teksta (tihe izmene, proširenja, sužavanja, izuzeci stvoreni u praksi).

## Protokol (obavezan redosled)

1. **Strukturalni rentgen** — pre čitanja: tip dokumenta, hijerarhija (izreka /
   obrazloženje / činjenično stanje / pravna ocena), obim, stranke, datumi.
2. **Kontrolisano čitanje** — SVAKA stranica; klasa pouzdanosti za svaku informaciju
   (✅P1 doslovno │ 🟡P2 izvedeno │ 🔴P3 rekonstrukcija │ ⛔P4 ne postoji);
   verifikacija sredine (3 nasumične strane ponovo); test gorile.
3. **Mreža veza** — poveži činjenice kroz dokumente: kontradikcije, tišine, potvrde,
   dopune, vremenske rupe; klasifikuj norme (obaveza/zabrana/ovlašćenje/definicija/
   uslov/izuzetak/sankcija); za odluke izvuci ratio decidendi kao: „Kada [činjenični
   uslov], tada [pravna posledica], na osnovu [pravni osnov]" — ako ratio nije
   pouzdan, napiši to eksplicitno.
4. **HIT LISTA** — top 3 veze koje nose predmet (prioritet: ono što ŠTETI klijentu).
5. **Bajes ulaz** — početna procena verovatnoće uspeha sa obrazloženjem, predaje se
   u pravna-analiza F0.

**Detaljna metodologija, šeme i obrasci:** OBAVEZNO učitaj
`references/deep-understanding-module.md` pri prvoj aktivaciji u sesiji.

## Zabranjeno

1. Tvrdnja bez stranice/izvora (nema izvora = ne znaš).
2. Izvođenje ratio decidendi „po sećanju" — samo iz teksta odluke.
3. Preskakanje verifikacije sredine kod dokumenata 20+ strana.
4. Završetak bez HIT LISTE i Bajes ulaza kad sledi pravna-analiza.

## Lanac

```
DOKUMENT → god-skill-deep-reader → pravna-analiza (F0–F6) → [krivica |
tuzba-parnica | izvrsenje] → istrazivanje-prakse → stil-pisanja → verifikator
```
