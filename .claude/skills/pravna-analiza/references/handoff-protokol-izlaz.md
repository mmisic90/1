# Kanonski HANDOFF protokol — izlaz `pravna-analiza` v4

Ovaj fajl definiše **tačan** format paketa koji `pravna-analiza` Faza 6.1 isporučuje izvršnim skilovima (`krivica`, `tuzba-parnica`, `izvrsenje`). Cilj: handoff između mozga steka i izvršnih skilova bude mašinski pouzdan, bez gubitka informacija.

---

## Zašto kanonski format

Pre v4, `pravna-analiza` je predavala neformalan ASCII crtež. Izvršni skilovi (krivica Korak 0, tuzba-parnica Korak 0) očekivali su strukturiran sadržaj sa tačno 7 polja. Rezultat: gubitak informacija na najkritičnijem prelazu — mozak govori prozom, izvršioci čekaju format.

v4 zatvara taj procep: F6.1 isporučuje **jedan kanonski paket** koji oba stila (krivica opisni ⓵–⓻ + tuzba-parnica strogi YAML) razumeju.

---

## Mapiranje polja → šta koji skil čita

| Polje | krivica Korak 0 | tuzba-parnica Korak 0 | izvrsenje |
|---|---|---|---|
| `predmet.perspektiva` | „odbrana" uvek | „tuzilac"/„tuzeni" | „poverilac"/„duznik"/„predlagac" |
| `teorija_slucaja` | ① | teorija_slucaja | teorija |
| `cinjenicna_mapa` | ② | cinjenicna_mapa | činjenice |
| `argumenti` | ③ | argumenti | osnov |
| `adversarial` | ④ | adversarial | stres |
| `jedna_stvar` | ⑤ → prvi pasus | jedna_stvar → prvi pasus | ključ |
| `praksa` | ⑥ | praksa | praksa ZIO |
| `strateska_procena` | ⑦ | strateska_procena | procena rizika |

---

## Primer popunjenog paketa (krivični predmet)

```yaml
handoff:
  source: "pravna-analiza v4"
  target: "krivica"
  timestamp: "2026-05-29T10:30:00+02:00"

  predmet:
    tip_postupka: "krivicni"
    stranka: "[ime okrivljenog]"
    perspektiva: "odbrana"
    sud: "Osnovni sud u Novom Sadu"
    broj_predmeta: "K 123/26"

  teorija_slucaja:
    jedna_recenica: >
      Optužba za delo klevete ne stoji jer je iskaz okrivljenog
      vrednosni sud o pitanju od javnog interesa, zaštićen čl. 10 EKLJP.
    hipoteza: >
      Ako dokažemo da je izjava vrednosni sud (ne činjenička tvrdnja),
      nema dela — Lingens protiv Austrije.
    verovatnoca_uspeha: "70%"

  cinjenicna_mapa:
    - cinjenica: "Okrivljeni je izjavu dao na javnoj tribini"
      klasa: "P1"
      izvor: "str. 3, pasus 2 optužnice"
      status: "potvrđeno"
    - cinjenica: "Tema tribine bila javna nabavka opštine"
      klasa: "P1"
      izvor: "str. 3, pasus 4"
      status: "potvrđeno"
    kontradikcije:
      - >
        Privatni tužilac u tač. 2 priznaje da je tema bila javna
        nabavka, što sam potvrđuje javni interes — potkopava sopstvenu
        tezu o privatnom napadu.

  argumenti:
    jaki:
      - "Vrednosni sud, ne činjenička tvrdnja (čl. 10 EKLJP + Lingens)"
      - "Pitanje od javnog interesa (Castells, Feldek)"
    srednji:
      - "Nedostatak umišljaja (čl. 18 KZ)"
    slabi:
      - "Istinitost izjave (teško dokaziva, rizično)"
    graf_zavisnosti:
      nezavisnih: 2
      ukupnih: 3
    pravni_slojevi:
      - "KZ čl. 170 (kleveta), čl. 18 (umišljaj)"
      - "Ustav čl. 46 (sloboda izražavanja)"
      - "EKLJP čl. 10 + praksa (Lingens, Castells, Feldek, Bodrožić)"

  adversarial:
    sudija_prezivelo: 2
    protivnik_prezivelo: 2
    odbaceno:
      - "Istinitost izjave — sudija bi tražio dokaz koji nemamo"

  jedna_stvar:
    argument: >
      Izjava je vrednosni sud o pitanju od javnog interesa — a vrednosni
      sud po prirodi ne podleže dokazu istinitosti (Lingens, par. 46).
    zasto: >
      Ako sud prihvati da je reč o vrednosnom sudu, celo delo pada —
      nema šta da se dokazuje kao neistinito.
    dokaz: "str. 3 optužnice (tema = javna nabavka) ← ✅P1"
    neodbrativo: >
      Privatni tužilac sam priznaje javni karakter teme (tač. 2),
      pa ne može tvrditi da je napad bio privatan.

  praksa:
    - sud: "ESLJP"
      broj: "Lingens protiv Austrije, 9815/82"
      datum: "08.07.1986"
      link: "priložen pun tekst (.docx u steku)"
      ratio: >
        Razlika između činjenica (podložne dokazu) i vrednosnih sudova
        (nepodložni dokazu istinitosti) — ključna za čl. 10.
      verifikovano: true
      poverenje: "P1"

  strateska_procena:
    najbolji_ishod: "Oslobađajuća presuda — nema dela"
    realan_ishod: "Oslobađajuća ili odbačaj privatne tužbe"
    najgori_ishod: "Osuda uz uslovnu — ako sud odbije EKLJP argument"
    rizik_1_10: 3
    preporuka: >
      Težište na vrednosni sud + javni interes. Istinitost NE isticati
      kao glavni argument (rizično). ESLJP praksa je odlučujuća.
```

---

## Primer (parnični predmet — skraćeno)

```yaml
handoff:
  source: "pravna-analiza v4"
  target: "tuzba-parnica"
  predmet:
    tip_postupka: "parnicni"
    perspektiva: "tuzilac"
    sud: "Osnovni sud u Novom Sadu"
  teorija_slucaja:
    jedna_recenica: "Dužnik nije platio isporučenu robu — naplata + kamata."
    verovatnoca_uspeha: "85%"
  jedna_stvar:
    argument: "Potpisana otpremnica + nesporna faktura = nesporan dug."
    dokaz: "Prilog 1 (otpremnica sa pečatom) ← ✅P1"
  praksa:
    - sud: "VKS"
      broj: "Prev 123/2024"
      verifikovano: true
      poverenje: "P1"
  strateska_procena:
    realan_ishod: "Usvajajuća presuda u celosti"
    rizik_1_10: 2
# (ostala polja popunjena po kanonu)
```

---

## Pravila isporuke

1. **Potpunost:** svih 7 polja + `predmet`. Prazno polje → eksplicitno `[]` ili `null` + napomena, nikad dvosmisleno.
2. **P-klasa:** nijedan ⛔P4 u `cinjenicna_mapa`. Samo P1/P2/P3.
3. **Praksa:** svaka odluka sa `link` ili pasted pun tekst + `verifikovano: true`. Bez toga → ne ulazi u paket.
4. **target:** određuje RUTER na osnovu `tip_postupka`. Jedan paket → jedan target.
5. **Fallback:** ako izvršni skil dobije nepotpun paket → STOP, traži dopunu (ne popunjava iz memorije).

---

## Veza sa Korakom 0 izvršnih skilova

- `krivica` Korak 0.1 čita polja ⓵–⓻ opisno
- `tuzba-parnica` Korak 0.1 čita ista polja kao YAML ključeve
- `izvrsenje` čita `predmet.perspektiva` + činjenice + praksa ZIO

Svi čitaju ISTI paket. To je suština v4 standardizacije.

---

## Target-specific dodatna polja

Kanonskih 7 polja su zajednička. Pojedini skilovi traže **dodatna** polja — kad je `target` taj skil, dopuni paket:

**target: tuzba-parnica** (parnica traži novčane okvire):
```yaml
  praksa:
    - iznos_dosudjen: 250000        # dosuđeni iznos u sličnim predmetima (dinari)
  strateska_procena:
    vsp_preporuka: 250000           # preporučena vrednost spora (dinari)
```

**target: izvrsenje** (izvršenje traži ispravu + sredstvo):
```yaml
  predmet:
    vrsta_isprave: "verodostojna" | "izvrsna"   # određuje Protokol A ili B
    sredstvo_izvrsenja: "racun" | "nepokretnost" | "pokretne" | "zarada"
  iznos_potrazivanja: 250000        # glavnica (dinari)
  kamata_od: "ISO-datum dospelosti"
```

**target: krivica** — nema dodatnih polja preko kanonskih 7 (krivica ne barata novčanim zahtevom na isti način).

Ako `target` skil traži dodatno polje kojeg nema → izvršni skil aktivira svoj Korak 0.3 (nepotpun handoff) i traži dopunu. Nikad ne popunjavaj iz memorije.
