# AIdvokat — Politika pisma (latinica vs ćirilica)

> Kanon token-ekonomije za skill stack. Izvor: AIdvokat Politika pisma v1.0.

Tokeni, D/O ekonomika i pravila za pisanje skillova. Verzija 1.0.

Napomena o pismu ovog dokumenta: pisan je srpskom latinicom bez dijakritike (ekavica), isto kao arhitektura kesiranja v2 — radi token-efikasnosti i doslednosti.

1. Sazetak (TL;DR)

Tri pravila, jedan broj:

PRAVILO 1 (podaci): izvorne propise i predmete normalizuj na latinicu za index i dinamicki ulaz D. Original cuvaj za citat i prikaz.

PRAVILO 2 (skillovi): instrukcioni tekst SVAKOG skilla pisi latinicom. Jedini izuzetak su doslovni output-sabloni i primeri u skillu za stil pisanja.

PRAVILO 3 (izlaz): pismo izlaza prema sudu/stranci je pravna/produktna odluka — ostaje u trazenom pismu (cesto cirilica). Ne diraj ga zbog cene; poluga je sazetost sablona.

Glavni broj: cirilica dize cenu poziva za ~13% (Opus 4.8), i to ceo iznos pada na deo koji kes NE pokriva (dinamicki ulaz D + izlaz O). Skill tekst u cirilici je ~+15% tokena bez ikakve funkcije.

2. Zasto pismo utice na tokene

LLM i embedding tokenizatori su byte-level BPE, trenirani pretezno na engleskom/latinici:

ASCII latinica (a–z): 1 bajt po znaku, cesti spojevi -> ~4 znaka po tokenu.

Cirilica: 2 bajta po znaku u UTF-8 i retko u BPE spojevima -> cesto ~1 token po znaku.

Srpska latinica sa dijakritikom (s c z dj): 2 bajta, skuplja od ASCII ali jeftinija od cirilice.

Izmereno na stvarnim predmetima (tokenizator o200k_base, najblizi danasnjem Claudeu): cirilica kosta +12–18% vs ista latinica. Na starijem tokenizatoru (cl100k) penal je veci (do +41%); realan danasnji penal je blizi donjoj granici, ~10–18%.

3. Gde kes pomaze a gde ne

Poziv ima tri dela tokena:

P = staticki prefiks (system + skill/GUARDRAILS + alati) — KESIRAN; pri hitu se cita po 0.1x cene.

D = dinamicki ulaz (izvuceni propisi + kontekst predmeta + poruka) — pun trosak u SVAKOM pozivu.

O = izlaz (generisani podnesak/odgovor) — pun trosak, i NAJSKUPLJA klasa (Opus 25 USD/M = 5x ulaz).

Posledica: kes snizava samo P. Cirilicni penal na D i O se NE moze kesirati — placa se svaki put. Zato pismo D-sadrzaja i O-izlaza direktno i trajno utice na racun.

4. Mereni penal na stvarnim predmetima

Mereno o200k_base; "cir-penal" = koliko vise tokena nego ista latinica.

Zakljucak: penal je realan i konzistentan (~12–18%) na pravim podnescima; latinski tekst ga nema.

5. Ekonomika D/O po pozivu (Opus 4.8)

Pretpostavke iz arhitekture v2 (odeljak 9): D = 6.000 tok, O = 1.500 tok. Cene Opus 4.8: ulaz 5.00, izlaz 25.00 USD/M. Srednji cirilicni penal 15%.

Zbir ~ $0,0101 po pozivu = +13% na efektivnu cenu poziva (0,0767), i ceo iznos je na delu koji kes NE pokriva. Izlaz nosi veci deo (56%) jer je token izlaza 5x skuplji — isti procenat penala kosta vise na O nego na D. Po floti i broju poziva ovo se mnozi.

6. Politika pisanja skillova

PRAVILO: instrukcioni tekst svakog skilla pisi latinicom. Jedini izuzetak su doslovni output-sabloni i few-shot primeri u skillu za stil pisanja.

Obrazlozenje:

Skill tekst je instrukcija modelu (masini), ne tekst za stranku. Model cita srpsku latinicu savrseno — cirilica tu ne donosi nista osim ~+15% tokena.

Ne treba cirilica u instrukcijama da bi izlaz bio cirilica. Pismo izlaza je runtime odluka koju model proizvodi i iz latinicnih instrukcija (transliterise bez greske).

Skill je deo prefiksa P (kesiran), pa je per-poziv jeftin, ALI: kes-upis placa pun +25% na svaku izmenu alata/prompta (cesto u dev-u) — manji P = jeftiniji upisi i vise TPM headroom-a.

Cirilica u prefiksu rizikuje mesanje pisma u retrieval-kljucevima i normalizaciji.

U skillu za stil pisanja jasno razdvoj dva sloja:

Instrukcije skilla (kako da pise, koji ton, koja struktura) — LATINICA.

Doslovni sabloni i primeri izlaza (uvodne formule, primeri podnesaka) — CIRILICA, jer se bukvalno preslikavaju u draft. Drzi ih na minimumu.

Granica (gde NE preterati): few-shot primeri pravnog izlaza u bilo kom skillu legitimno ostaju cirilica, ali svedeni na minimum; pravni citati (brojevi clanova, skracenice zakona) su ionako latinica/neutralni.

7. Sta se NE dira zbog cene

Izlaz prema sudu ili stranci ostaje u trazenom pismu — sudovi i stranke cesto traze cirilicu (sluzbeno pismo). Pravni/produktni zahtev pobedjuje cenu. Ne prebacuj izlaz na latinicu tiho zbog tokena.

Jedina legitimna poluga na izlazu je sazetost sablona: ukloni mrtve uvodne formule i ponavljanja — to smanjuje O bez gubitka pisma. Ako sud/klijent prihvata latinicu, ponudi je kao default.

8. Akcije (checklist)

Normalizuj izvorne propise i predmete na latinicu za index i D. (export_bilteni_pas.py vec ima funkciju to_latin().)

Audit skillova: sav instrukcioni tekst -> latinica; izdvoj output-sablone u zaseban, jasno oznacen blok.

Draft-skillovi (tuzba/zalba/podnesak): ukloni mrtve uvodne formule — smanjuje O bez gubitka pisma.

Default izlaza: cirilica gde sud/klijent trazi; latinica gde je prihvatljivo.

Original dokumenata uvek cuvaj za citat i prikaz — normalizacija je samo za masinski sloj (index/D).