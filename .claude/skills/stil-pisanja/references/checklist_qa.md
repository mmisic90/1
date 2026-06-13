# QA Checklist — pre isporuke .docx dokumenta

Pre nego sto se finalni .docx preda korisniku (ili preda verifikatoru), **OBAVEZNO** proveri sve stavke ispod.
Ako ijedna nije zadovoljena — **ne isporucuj**. Ispravi, pa ponovo proveri.

## 1. Pretflight — pre generisanja

### 1.1. Ulazni podaci

- [ ] Znam ko je **klijent** (moja strana)
- [ ] Znam ko je **protivna strana**
- [ ] Znam **tip postupka** (parnica/krivica/izvrsenje/upravni/prekrsaj/ugovor)
- [ ] Znam **tip podneska** (tuzba/odgovor/zalba/prigovor/podnesak)
- [ ] Znam **mesto i datum** (ili imam placeholder sa napomenom)
- [ ] Znam **tko potpisuje** (default: adv. Milan Misic)

Ako bilo sta od ovoga **nedostaje** — stani, pitaj korisnika.

### 1.2. Sadrzaj

- [ ] `pravna-analiza` skill je vec pokrenut i dao glavne argumente
- [ ] `krivica` ili `tuzba-parnica` skill je dao sam tekst
- [ ] `istrazivanje-prakse` je dodalo sudsku praksu (ako je potrebno)
- [ ] Imam jasno definisanu dispoziciju (sta trazim od suda)

## 2. Imenovanje fajla

- [ ] Klijent je **PRVI** u nazivu
- [ ] Format: `[Klijent] i [Protivnik] TIP_PODNESKA [opis].docx`
- [ ] Max 2 osobe na mojoj strani (razdvojene zapetom)
- [ ] Max 2 osobe na protivnoj strani (razdvojene zapetom)
- [ ] TIP_PODNESKA je **UPPERCASE**
- [ ] Kratak opis je **lowercase**
- [ ] **Nema dijakritika** (C/S/Z/DJ umesto Ć/Š/Ž/Đ)
- [ ] **Nema podvlaka** — samo razmaci
- [ ] Ekstenzija **.docx** lowercase

**Test:** Uporedi naziv sa primerima iz `reference_naming.md` sekcije 6.

## 3. Tipografija

### 3.1. Font i pismo

- [ ] **Times New Roman** svuda (jedini font)
- [ ] Primarno **cirilica** (latinica samo za firme/akronime/latinske termine)
- [ ] **Nema Calibri, Arial, Comic Sans** ni na jednom mestu

### 3.2. Velicine

- [ ] Telo teksta: **12pt** (w:sz="24")
- [ ] Petit: **10pt** (w:sz="20")
- [ ] Isticanje: **14pt bold** (w:sz="28" + w:b)
- [ ] Dispozicija: **16pt bold centrirano** (w:sz="32" + w:b + jc=center)
- [ ] Glavni naslov: **18pt bold razmaknut centriran** (w:sz="36" + w:b + jc=center + spaced letters)

### 3.3. Poravnanje

- [ ] Telo teksta: **obostrano** (justify, w:jc="both")
- [ ] Glavni naslov + dispozicija: **centrirano**
- [ ] Potpis: **desno**
- [ ] Datum pre potpisa: **levo**

### 3.4. Prored

- [ ] 1.15 (w:line="259")
- [ ] Razmak posle pasusa: 160 twips (w:after="160")

## 4. Bold — proveri

- [ ] Numeracije stranaka boldovane (1., 2., 3., "ТУЖИЛАЦ:", "ТУЖЕНИ:")
- [ ] Glavni naslov boldovan (Т У Ж Б А)
- [ ] Dispozitivni glagoli boldovani (ПОНИШТАВА СЕ, ОБАВЕЗУЈЕ СЕ)
- [ ] Punch-recenice boldovane (max 2-3 po dokumentu)
- [ ] "ДОКАЗ:" boldovano
- [ ] Section markeri boldovani (РЕЗИМЕ, ПРЕДЛОГ СУДУ, ТРОШКОВНИК)
- [ ] **Nisu boldovani**: cele pasuse, datumi, brojevi predmeta

## 5. Italic — proveri

- [ ] Imena dokaza posle "ДОКАЗ:" su u italic-u
- [ ] Latinski termini u italic-u (*in concreto*, *prima facie*)
- [ ] Naslovi citiranih odluka u italic-u
- [ ] **Nisu italic**: cele pasuse, imena stranaka, datumi

## 6. Underline — proveri

- [ ] Clanovi zakona (kada je potrebno) pod underline
- [ ] Maksimalno 1-2 recenice u celom dokumentu sa bold+underline
- [ ] **Nisu underline**: cele pasuse, naslovi (oni idu bold)

## 7. Struktura dokumenta

- [ ] Gornje desno: adresat (sud, adresa) + predmet
- [ ] Glavni naslov 18pt (Т У Ж Б А itd.)
- [ ] Zaglavlje stranaka sa hanging indent 2160/2160
- [ ] Pravni osnov (citat clanova zakona)
- [ ] Obrazlozenje (chronological, cinjenice + pravna kvalifikacija)
- [ ] Dokazi nabrojani posle "ДОКАЗ:" sa hanging 1440/1440
- [ ] Separator linija pre "Predlog sudu"
- [ ] Dispozicija (predlog sudu) sa centriranim **П Р Е С У Д У** + dispozitivnim glagolima
- [ ] Separator pre troskovnika (ako je potrebno)
- [ ] Troskovnik sa dot leader-om i UKUPNO
- [ ] Datum levo + potpis desno
- [ ] Prilozi na kraju (ako ih dokument referencira)

## 8. Margine i stranica

- [ ] Margine: 1" sve cetiri (1440 twips)
- [ ] Format: Letter (12240 × 15840 twips)
- [ ] Footer sadrzi broj strane desno

## 9. Potpis

- [ ] Default: **адв. Милан Мишић** (osim eksplicitnog drugog)
- [ ] "адв." malim slovom sa tackom
- [ ] "Милан Мишић" Title Case
- [ ] 12pt regular (**ne bold**)
- [ ] Desno poravnato
- [ ] **NIJE** Milan Nedeljkov
- [ ] Djordje Nedeljkov samo na eksplicitni zahtev

## 10. Zabranjeno — proveri da NIJE u dokumentu

- [ ] Nema emoji-ja (ni jednog)
- [ ] Nema boja (sve crno)
- [ ] Nema sencenja pasusa
- [ ] Nema okvira (osim u tabelama)
- [ ] Nema hiperlinkova (sud ne cita online)
- [ ] Nema automatske numeracije listi (w:numPr)
- [ ] Nema drop cap
- [ ] Nema slika/logo-a pecata

## 11. Kontradikcije i praznine

Ako je skill pronasao:
- Praznine u cinjenicnom stanju (nepoznato ime svedoka, nepoznat datum)
- Kontradikcije u instrukcijama korisnika (npr. "potpisi Djordje" ali pre toga "default Milan")
- Nesigurnost u pravnom osnovu

**NE RESAVAJ TIHO.** Stani, pitaj korisnika (per GUARDRAILS pravilo).

## 12. Verifikator handoff

Pre isporuke korisniku, **OBAVEZNO** predaj finalni .docx verifikator skill-u:
- [ ] Verifikator proverava tacnost pravnih navoda
- [ ] Verifikator proverava konzistentnost stranaka i datuma
- [ ] Verifikator proverava da li sudska praksa citirana kroz `istrazivanje-prakse` postoji

Tek kada verifikator vrati ✅ zelenu — fajl ide korisniku.

## 13. Finalni test — otvori fajl u glavi

Pre isporuke, mentalno "otvori" .docx i proveri:
- [ ] Da li prvi pogled na dokument odaje **profesionalnu advokatsku praksu**?
- [ ] Da li je vizuelno **lako citati** (nije zatrpano boldom/italic-om)?
- [ ] Da li **struktura sama vodi** citaoca od zaglavlja do potpisa?
- [ ] Da li **sud moze odmah naci** predlog i dispoziciju?

Ako ijedno od ovoga ne vazi — ispravi, ne salji.

## 14. Progress indikator za korisnika

Tokom rada, korisnik treba da vidi progress u formi:
```
[▓▓▓░░░░░░░] 30% — Faza: Analiza uzorka dokumenta
[▓▓▓▓▓▓░░░░] 60% — Faza: Formatiranje dispozicije
[▓▓▓▓▓▓▓▓▓░] 90% — Faza: QA checklist
[▓▓▓▓▓▓▓▓▓▓] 100% — ✅ Zavrseno, isporuceno
```

## 15. Post-flight verifikacioni izvestaj

Posle isporuke, generisi kratki izvestaj:
```
✅ stil-pisanja primenjen
✅ Naziv fajla: [ime].docx — ispravan pattern
✅ Potpis: adv. Milan Misic
✅ Tipografija: TNR 12pt, 18pt naslov, bold/italic po pravilima
✅ Struktura: zaglavlje → obrazlozenje → dokazi → predlog → troskovnik → potpis
⚠️ Provere koje zahtevaju oko korisnika:
   - Datum i mesto tacni?
   - Iznosi u troskovniku aktuelni?
   - Svi prilozi dostupni za slanje?
```
