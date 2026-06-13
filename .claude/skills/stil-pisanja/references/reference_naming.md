# Reference: Imenovanje fajlova

Ovaj fajl definise **jedinstveni obavezujuci pattern** imenovanja svih .docx pravnih dokumenata advokatske kancelarije Milan Misic. Pattern je izveden iz analize **stotine** postojecih fajlova u folderu `/PC_Milan/MISIC MILAN/`.

## 1. Osnovna formula

### 1.1. Parnica / Izvrsenje / Upravni postupak / Prekrsaj / Ugovori

```
[MOJI_KLIJENTI] i [PROTIVNICI] TIP_PODNESKA [kratak_opis].docx
```

- `MOJI_KLIJENTI` — stranka koju zastupa adv. Milan Misic (**UVEK PRVA**)
- `i` — separator nase strane od protivne strane
- `PROTIVNICI` — protivna strana
- `TIP_PODNESKA` — UPPERCASE, vrsta akta (TUZBA, ODGOVOR NA TUZBU, ZALBA, itd.)
- `kratak_opis` — opcioni, lowercase, precizira sta je u pitanju

### 1.2. Krivica BEZ privatne protivne strane

```
[KLIJENT] TIP_PODNESKA [kratak_opis].docx
```

U krivicnom postupku kada je protivna strana drzava (JT, javni tuzilac) — **ne pise se**. Samo klijent i tip akta.

### 1.3. Krivica SA privatnom protivnom stranom

```
[KLIJENT] i [PROTIVNIK] TIP_PODNESKA.docx
```

Kada je privatni tuzilac ili osteceni fizicko lice — pise se kao kod parnice.

## 2. Pravila pisanja imena stranaka

| Pravilo | Objasnjenje |
|---------|-------------|
| **Prezime Ime** | Uvek red Prezime → Ime (npr. "Misic Milan", NE "Milan Misic") |
| **Title Case** | Prvo slovo veliko, ostalo malo: "Petrovic Jovan", ne "PETROVIC JOVAN" |
| **Bez dijakritika** | Ć → C, Č → C, Š → S, Ž → Z, **Đ → DJ** (uppercase DJ) |
| **Firme u izvornom obliku** | AD, DOO, d.o.o., a.d. — samo bez tacaka ako ih ne nosi originalan naziv (Flexopack 1980 zadrzava bez tacaka) |
| **Brojevi zadrzani** | Flexopack 1980 → "Flexopack 1980" (broj u nazivu firme se zadrzava) |
| **Max 2 osobe po strani** | Ako je vise klijenata, pise se prva dva (prvi po abecedi ili po znacaju) |
| **Razdvajanje vise osoba** | Zapeta + razmak: "Prvi klijent, Drugi klijent" |

## 3. Transliteracija dijakritika — tabela

| Cirilica | Srpska latinica | U nazivu fajla |
|----------|------------------|----------------|
| ћ | ć | **c** |
| Ћ | Ć | **C** |
| ч | č | **c** |
| Ч | Č | **C** |
| ш | š | **s** |
| Ш | Š | **S** |
| ж | ž | **z** |
| Ж | Ž | **Z** |
| ђ | đ | **dj** |
| **Ђ** | **Đ** | **DJ** |

**Primeri:**
- Ђорђе → Djordje
- Слободан Лукач → Slobodan Lukac
- Жељко Бишкуп → Zeljko Biskup

## 4. Tipovi podnesaka — UPPERCASE sablon

### Parnica
- `TUZBA`
- `TUZBA SA PREDLOGOM ZA PRIVREMENU MERU`
- `TUZBA SA PREDLOGOM SA PRIVREMENOM MEROM`
- `ODGOVOR NA TUZBU`
- `PROTIVTUZBA`
- `PRIGOVOR NA PLATNI NALOG`
- `ZALBA na presudu`
- `ZALBA na resenje`
- `REVIZIJA`
- `USTAVNA ZALBA`
- `PODNESAK`
- `PREDLOG ZA PONAVLJANJE POSTUPKA`
- `PREDLOG ZA PRIVREMENU MERU`

### Krivica
- `ODGOVOR NA OPTUZNICU`
- `PRIGOVOR NA OPTUZNI PREDLOG`
- `ZALBA na presudu`
- `ZZZ` (zahtev za zastitu zakonitosti)
- `ZAVRSNA REC`
- `KRIVICNA PRIJAVA`
- `ZALBA na odbacaj`
- `SPORAZUM O PRIZNANJU`
- `PREDSTAVKA ESLJP`

### Izvrsenje
- `PREDLOG ZA IZVRSENJE`
- `PREDLOG ZA IZVRSENJE NA OSNOVU VERODOSTOJNIH ISPRAVA`
- `PREDLOG ZA IZVRSENJE NA OSNOVU IZVRSNE ISPRAVE`
- `PRIGOVOR NA RESENJE O IZVRSENJU`
- `ZALBA na zakljucak izvrsitelja`
- `PROTIVIZVRSENJE`
- `PODNESAK izvrsitelju` (kratak opis obavezan: "odbijanje rate", "nastavak izvrsenja", "zastoj", itd.)

### Upravni / pritužbeni
- `ZALBA na resenje`
- `TUZBA UPRAVNOM SUDU`
- `PREDLOG ZA PONAVLJANJE`
- `PRIMEDBE NA RAD SUDA`
- `PRITUZBA NA RAD SUDA`
- `URGENCIJA`

### Prekrsaj
- `ZALBA na prekrsajnu odluku`
- `ZAHTEV ZA SUDIJSKO ODLUCIVANJE`
- `PISANA ODBRANA`

### Ugovori / vansudski akti
- `UGOVOR O KUPOPRODAJI NEPOKRETNOSTI`
- `UGOVOR O ZAKUPU`
- `UGOVOR O POZAJMICI`
- `ANEKS UGOVORA`
- `SPORAZUM O RASKIDU UGOVORA`
- `VANSUDSKO PORAVNANJE`
- `SPORAZUM` (kratak opis obavezan)
- `IZJAVA` (kratak opis obavezan: "za parnicu", "overena", itd.)
- `PRIZNANICA`
- `OPOMENA PRED TUZBU`
- `OPOMENA PRED IZVRSENJE`
- `POZIV NA VRACANJE NA RADNO MESTO`
- `PISMO O NAMERAMA`

### Krivica — prosireno
- `ODGOVOR NA OPTUZNICU`
- `PRIGOVOR NA OPTUZNI PREDLOG`
- `ZALBA na presudu`
- `ZALBA NA RESENJE` (o odbacaju priv. mere, o pritvoru, itd.)
- `ZZZ` (zahtev za zastitu zakonitosti — vrhovnom sudu)
- `ZAVRSNA REC`
- `KRIVICNA PRIJAVA`
- `KRIVICNA PRIJAVA SA PREDLOGOM ZA PRIVREMENU MERU`
- `ZALBA na odbacaj`
- `PRIGOVOR NA ODBACAJ KRIVICNE PRIJAVE`
- `DOPUNA KRIVICNE PRIJAVE`
- `SPORAZUM O PRIZNANJU`
- `PREDSTAVKA ESLJP`
- `USTAVNA ZALBA` (i parnica i krivica)
- `MOLBA ZA ODLAGANJE KRIVICNOG GONJENJA`
- `PODNESAK BRANIOCA` (kratak opis obavezan)
- `MISLJENJE` (pravno misljenje — interni akt)

### Stecaj
- `PREDLOG ZA STECAJ`
- `PRIJAVA POTRAZIVANJA`
- `DOPUNA PRIJAVE POTRAZIVANJA`
- `PRIGOVOR U STECAJU`

## 5. Kratak opis — kada da, kada ne

**DA** — kada TIP_PODNESKA ostavlja prostor za dvosmislenost:
- `Irmovo AD i Vode Vojvodine TUZBA steta, izgubljena dobit.docx` (specifikuje osnov tuzbe)
- `Anisic Marija ZALBA na presudu.docx` (razlikuje od zalbe na resenje)
- `Petrovic Milan PODNESAK dopuna dokaza.docx` (specifikuje svrhu podneska)

**NE** — kada je TIP_PODNESKA samodovoljan:
- `Kalentic Nikola i Flexopack 1980 TUZBA.docx` (nije potrebno "sa osnovama tuzbe" — vec je jasno)
- `Jovanovic Zoran UGOVOR O ZAKUPU.docx` (tip ugovora je samodovoljan)

**Pravila kratkog opisa:**
- Lowercase
- Bez tackе na kraju
- Bez dijakritika (ista transliteracija)
- Zapete dozvoljene za razdvajanje termina: "steta, izgubljena dobit"
- Maksimalno 4-5 reci

## 6. Primeri iz stvarnog foldera

Sledece primere sam potvrdio pregledom `/PC_Milan/MISIC MILAN/`:

### Parnica
- `Kalentic Nikola i Bojic Bojan, Flexopack 1980 TUZBA SA PREDLOGOM SA PRIVREMENOM MEROM.docx`
- `Irmovo AD i Vode Vojvodine TUZBA steta, izgubljena dobit.docx`
- `Arezina Nikola i AMS Osiguranje ODGOVOR NA TUZBU.docx`
- `Agriplast i Argina Plus P.A. PODNESAK.docx`
- `Anisic Marija ZALBA na presudu.docx`

### Ugovori
- `Balamanac Dijana, Cavic Marijana i Lazarevic Marko i Slavica UGOVOR O KUPOPRODAJI NEPOKRETNOSTI.docx`

**Objasnjenje slozenog primera:**
- Na NASOJ strani: Balamanac Dijana, Cavic Marijana (2 klijenta, razdvojeni zapetom)
- Separator " i " razdvaja nasu stranu od protivne strane
- Na PROTIVNOJ strani: Lazarevic Marko, Slavica (2 lica, razdvojena zapetom — ista porodica, ali jos uvek 2 osobe)

## 7. Tabela odluka — koji scenario biram

| Tip postupka | Protivna strana | Pattern |
|---------------|------------------|---------|
| Parnica | Pravno/fizicko lice | Klijent i Protivnik TIP.docx |
| Izvrsenje | Duznik | Poverilac i Duznik TIP.docx |
| Upravni | Organ uprave | Podnosilac i Organ TIP.docx |
| Prekrsaj | Drzava (JT) | Okrivljeni TIP.docx |
| Krivica | Drzava (JT) | Okrivljeni TIP.docx |
| Krivica | Privatni tuzilac | Okrivljeni i Tuzilac TIP.docx |
| Ugovor (dve strane) | Druga strana | Nasa strana i Druga strana TIP.docx |

## 8. Kontradikcije i edge cases — sta da uradis

### 8.1. Tri ili vise klijenata na nasoj strani
- Pisi samo **prva dva po abecedi** (ili po znacaju ako ih je korisnik redosledno naveo)
- **NE** koristi "i dr." ili "i ostali" — ostavi prazno dalje
- Primer: Petrovic Jovan, Petrovic Milan (3 klijenta, ostavi prva 2)

### 8.2. Tri ili vise protivnika
- **Isto pravilo** — prva 2 po abecedi/redosledu
- NE koristi "i dr."

### 8.3. Klijent je firma i osoba zajedno
- Pisi u redosledu kako su u ugovoru/punomocju: "Flexopack 1980 i Jovanovic Milan TIP.docx"

### 8.4. Protivna strana je nepoznata (npr. "nepoznati napadac" u krivici)
- Pisi samo klijenta: "Misic Milan KRIVICNA PRIJAVA.docx"
- Dodaj kratak opis: "KRIVICNA PRIJAVA laksa telesna povreda"

### 8.5. Ugovor sa vise strana (deoba imovine, porodicni)
- Razdvoji sa " i " sve strane — ali max 4 imena ukupno
- Primer: "Balamanac Dijana, Cavic Marijana i Lazarevic Marko i Slavica UGOVOR..."

### 8.6. Prezime ima "fon", "de", "van"
- Zadrzi u originalnom obliku: "von Hindenburg Peter"
- Transliteracija se ne primenjuje na strane prefikse

### 8.7. Ime sa dva prezimena (udate zene, dvojna)
- Pisi oba prezimena sa razmakom: "Markovic Petrovic Jovana"

## 9. Cheat sheet — sta UVEK proveravas pre imenovanja

1. ✅ Moj klijent je PRVI?
2. ✅ Max 2 osobe na mojoj strani?
3. ✅ Max 2 osobe na protivnoj strani?
4. ✅ "i" razdvaja nasu od protivne strane?
5. ✅ "," razdvaja osobe unutar iste strane?
6. ✅ TIP_PODNESKA je UPPERCASE?
7. ✅ Nema dijakritika (C/S/Z/DJ umesto Ć/Š/Ž/Đ)?
8. ✅ Nema podvlaka — samo razmaci?
9. ✅ Kratak opis lowercase i bez tacke?
10. ✅ Ekstenzija .docx lowercase?

## 10. Anti-pattern — nikad ovako

| LOSE | ISPRAVNO |
|------|----------|
| `tuzba_petrovic_misic.docx` | `Misic Milan i Petrovic Jovan TUZBA.docx` |
| `ZALBA-Anisic-Marija.docx` | `Anisic Marija ZALBA na presudu.docx` |
| `Petrović Marko_OPTUŽBA.docx` | `Petrovic Marko ODGOVOR NA OPTUZNICU.docx` |
| `TuzbaIrmovoVodeVojvodine.docx` | `Irmovo AD i Vode Vojvodine TUZBA steta, izgubljena dobit.docx` |
| `Misic_Milan_krivicna_prijava_v2.docx` | `Misic Milan KRIVICNA PRIJAVA.docx` |
| `TUZBA FINAL - Petrovic.docx` | `Petrovic Jovan i Markovic Milan TUZBA.docx` |

## 11. Verzionisanje fajlova (rad u toku)

Kada se pravi radna verzija pre slanja:
- **NE** koristi v1, v2, final, DRAFT sufikse
- Radi kopiju u posebnom folderu: `PC_Milan/Drafts/[ime originalnog fajla].docx`
- Kada je finalna, prebaci u glavni folder

Izuzetak: ako korisnik eksplicitno trazi verzionisanje, koristi format:
- `[osnovni naziv] v2.docx`
- NE koristi `_final`, `_poslednji`, `_zadnji` — zvuci nepristojno u kancelariji
