# Graf zavisnosti argumenata + Protokol „Jedna stvar"

## ZAŠTO GRAF ZAVISNOSTI

Advokat koji ima 5 argumenata misli da je jak. Ali ako svi
zavise od jedne činjenice — i ta činjenica padne — nema ništa.

Graf zavisnosti pokazuje:
- Koji argumenti su NEZAVISNI (stoje sami)
- Koji ZAVISE od drugih (ako X padne, Y takođe pada)
- Koja činjenica je TEMELj za najviše argumenata (kritična tačka)

## KAKO NAPRAVITI GRAF

### Korak 1: Listaj argumente
```
ARG #1: Bitna povreda — neocenjen dokaz (čl. 438)
ARG #2: In dubio pro reo (čl. 16 ZKP)
ARG #3: Pogrešna kvalifikacija (čl. 439)
ARG #4: Nerazumljiva izreka (čl. 438 st. 1 tač. 11)
ARG #5: Prekoračenje kazne
```

### Korak 2: Za svaki par — pitaj „Ako X padne, da li Y pada?"
```
#1 pada → #2 pada? NE (različit osnov) → NEZAVISNI
#1 pada → #3 pada? NE → NEZAVISNI
#1 pada → #4 pada? DELIMIČNO (oba o obrazloženju) → SLABA VEZA
#2 pada → #5 pada? NE → NEZAVISNI
#3 pada → #5 pada? DA (ako je kvalifikacija tačna, kazna je u okviru) → ZAVISAN
```

### Korak 3: Nacrtaj graf
```
    ARG #1 (5/5) ──slabo──→ ARG #4 (3/5)
    [NEZAVISAN]              [POLUZAVISAN]

    ARG #2 (4/5)
    [NEZAVISAN]

    ARG #3 (4/5) ──jako──→ ARG #5 (3/5)
    [NEZAVISAN]              [ZAVISAN]
```

### Korak 4: Analiziraj graf
- **3 nezavisna argumenta** (#1, #2, #3) → DOBRO. Čak i ako 2 padnu,
  1 stoji.
- **Kritična tačka:** Nijedna. Nema činjenice od koje zavisi SVE. DOBRO.
- **Slabost:** Ako #3 padne, #5 automatski pada → ne oslanjaj se na #5
  kao samostalan argument.

### LOŠA SITUACIJA (primer):
```
    ČINJENICA: „Svedok K. video okrivljenog"
        ↓ ↓ ↓ ↓
    #1  #2  #3  #4  (svi zavise od ovog svedoka)
    #5 ← (zavisi od #2)
```
Ako svedok K. promeni iskaz ili bude diskreditovan →
sva 4 argumenta + #5 padaju. Ovo je KATASTROFALNO.
**Rešenje:** MORAŠ pronaći barem 1 argument koji NE ZAVISI
od svedoka K.

---

## PROTOKOL „JEDNA STVAR"

U svakom predmetu postoji JEDNA činjenica ili JEDAN pravni
institut koji teži više od svega ostalog. Nađi ga.

### Četiri pitanja za identifikaciju:

**1. FILTER JEDNE REČENICE:**
„Ako bih imao samo 10 sekundi pred sudijom — šta bih rekao?"
Odgovor na ovo = verovatno „Jedna stvar".

**2. FILTER ELIMINACIJE:**
„Ako izbrišem sve argumente osim jednog — koji zadržavam?"
Onaj koji zadržavaš = „Jedna stvar".

**3. FILTER NEODBRANJIVOSTI:**
„Na šta protivna strana NE MOŽE da odgovori?"
Ako postoji takav argument — to je „Jedna stvar".

**4. FILTER PROMENE KONTEKSTA:**
„Koja činjenica, ako se istakne, MENJA CELU SLIKU?"
Npr.: Veštak dao alternativno objašnjenje povreda.
Ovo menja kontekst od „da li je okrivljeni udario"
u „da li UOPŠTE znamo šta se desilo".

### Gde „Jedna stvar" ide u dokumentu:

**PRVA.** Ne čuvaj je za kraj. Ne zakopavaj je na strani 8.

Sudije čitaju hiljade podnesaka. Ako „Jedna stvar" nije u
prvih 2-3 pasusa obrazloženja — možda je sudija neće videti.

Struktura dokumenta:
```
1. Uvodna formulacija (standardna)
2. „JEDNA STVAR" — najjači argument, ODMAH
3. Ostali argumenti (rangirani po snazi)
4. Predlog sudu
```

---

## ARHITEKTURA ARGUMENTACIJE

### Piramidalna struktura (za jake slučajeve)
```
         „JEDNA STVAR"
        /      |       \
   ARG #2   ARG #3   ARG #4
      |        |
   pod-arg   pod-arg
```
Najjači na vrhu. Svaki sledeći DOPUNJUJE prethodni.
Ako sudija pročita samo prva 2 pasusa — dobio je suštinu.

### Shotgun struktura (za slabe slučajeve)
```
ARG #1 (nezavisan)
ARG #2 (nezavisan)
ARG #3 (nezavisan)
ARG #4 (nezavisan)
```
Kad nijedan argument nije dovoljno jak sam — štiti se količinom
NEZAVISNIH argumenata. Ako sudija odbije 3 od 4 — još uvek
imaš 1.

### Cascade struktura (za procesne predmete)
```
ARG #1: Bitna povreda (čl. 438)
  → Ako sud ovo ne usvoji:
ARG #2: Povreda kriv. zakona (čl. 439)
  → Ako ni ovo:
ARG #3: Činjenično stanje (čl. 440)
  → Ako ni ovo:
ARG #4: Odluka o sankciji
```
Svaka sledeća linija je „plan B" za prethodnu. Pokrivaš
SVE osnove za žalbu sistematski.

---

## TESTIRANJE SNAGE ARGUMENTA

Za svaki argument, odgovori na 5 pitanja:

| Pitanje | Odgovor | Bodovi |
|---|---|---|
| Da li je činjenična osnova ✅P1? | da/ne | +2/0 |
| Da li pravna norma direktno pokriva? | da/delimično/ne | +2/+1/0 |
| Da li ima sudsku praksu? | da/ne | +1/0 |
| Da li je nezavisan? | da/delimično/ne | +2/+1/0 |
| Da li protivnik može odgovoriti? | ne/delimično/da | +2/+1/0 |

**Skala:** 8-10 = ■■■■■ (5/5), 6-7 = ■■■■□ (4/5),
4-5 = ■■■□□ (3/5), 2-3 = ■■□□□ (2/5), 0-1 = ■□□□□ (1/5)
