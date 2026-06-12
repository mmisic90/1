# Handoff protokol — kako stil-pisanja prima i predaje

Ovaj fajl definise **protokol komunikacije** izmedju `stil-pisanja` skilla i ostalih pravnih skill-ova u lancu.

---

## 1. Pozicija u lancu (strogo definisana)

```
pravna-analiza (Ф0–Ф6)
    ↓
[domenski skill: krivica ili tuzba-parnica]  (Korak 0–8)
    ↓
istrazivanje-prakse (ako je pozvan)
    ↓
stil-pisanja  ← OVDE (pretposlednji)
    ↓
verifikator (poslednji)
    ↓
ISPORUKA KORISNIKU
```

**Stroga pravila:**
- `stil-pisanja` se NE aktivira ako `pravna-analiza` nije zavrsena
- `stil-pisanja` se NE aktivira samostalno osim ako korisnik eksplicitno kaze "pali stil" ili "formatiraj"
- `verifikator` UVEK dolazi posle — bez izuzetka
- Ako verifikator vrati greske, vracamo se na domenski skill (krivica/tuzba-parnica) ili na `stil-pisanja`, ALI se verifikator uvek ponavlja do max 3 prolaza

---

## 2. Handoff INBOX — sta stil-pisanja mora primiti

Prethodni skill (`krivica`, `tuzba-parnica`, ili direktno `pravna-analiza` za ne-postupovne akte) mora da preda paket:

### 2.1 Obavezni elementi

| # | Element | Sadrzaj |
|---|---------|---------|
| ⓵ | **TIP AKTA** | tuzba / zalba / odgovor / prigovor / revizija / krivicna prijava / ZZZ / pisana odbrana / predstavka ESLJP / ustavna zalba / predlog za izvrsenje / podnesak / ugovor |
| ⓶ | **PERSPEKTIVA** | tuzilac / tuzeni / okrivljeni / branilac / osteceni / podnosilac / poverilac / duznik |
| ⓷ | **STRANKE** | klijent (ime/naziv, adresa, JMBG/MB); protivna strana (isto) |
| ⓸ | **MESTO I DATUM** | Novi Sad + datum (ili placeholder XX.XX.XXXX ako nije poznat) |
| ⓹ | **TEKST AKTA** | Kompletan sadrzaj: zaglavlje, cinjenice, pravni osnov, obrazlozenje, dokazi, predlog suda, troskovnik (ako ide) |
| ⓺ | **PRAVNI OSNOV** | Clanovi zakona (citati, sa oznakama — chl. 200 ZOO, chl. 438 ZKP, itd.) |
| ⓻ | **POTPIS** | default "адв. Милан Мишић"; ili "адв. Ђорђе Недељков" ako je eksplicitno receno |

### 2.2 Opcioni elementi

| # | Element | Kada |
|---|---------|------|
| ⓼ | PRAKSA (od `istrazivanje-prakse`) | Kad su inject-ovane odluke Vrhovnog suda / ESLJP |
| ⓽ | TROSKOVNIK | Samo za tuzbe, zalbe, predloge — ne za odgovore, prigovore |
| ⓾ | PRILOZI | Lista priloga (1., 2., 3. ...) |
| ⓫ | ZAGLAVLJE ADRESATA | Sud (npr. "ОСНОВНОМ СУДУ У НОВОМ САДУ") + broj predmeta |

### 2.3 Handoff trigger

**Prethodni skill signalizira predaju stil-pisanja-u jednom od ovih nacina:**

1. Eksplicitno: *"→ predaja stil-pisanja"* u svom compliance izvestaju
2. Korak 9/10 u domenskom skillu (npr. `tuzba-parnica` Korak 9 "Генерисање .docx" → poziva `stil-pisanja`)
3. Korisnik direktno: *"pali stil"*, *"formatiraj kao moja pisanja"*, *"u mom stilu"*

---

## 3. Sta stil-pisanja radi ako handoff nedostaje

**Scenario A:** Handoff potpun (⓵–⓻ svi prisutni) → nastavi normalno.

**Scenario B:** Handoff delimicno nedostaje → **STOP**, ne pravi akt, pitaj:

> *"Nedostaje [element X]. Pre generisanja moram da znam: [konkretno pitanje]. Da li da pitam korisnika, ili da vratim skill [Y] da dopuni?"*

**Scenario C:** Handoff-a nema, korisnik direktno zahteva akt bez prethodne analize → **UPOZORI**:

> *"Skill `pravna-analiza` nije pokrenut. Kvalitet ce biti znatno manji. Da li zelis da:
> (1) Nastavim sa onim sto imam + eksplicitnim upozorenjem na compliance izvestaju
> (2) Pokrenem pravna-analizu pre stila
> (3) Odustanem — dopuni input"*

---

## 4. Handoff OUTBOX — sta stil-pisanja predaje verifikatoru

Posle generisanja finalnog akta, `stil-pisanja` predaje `verifikator`-u paket:

| # | Element | Format |
|---|---------|--------|
| ⓵ | **FINALNI AKT** | .docx fajl (EXECUTION mode) ili markdown+HTML blok (SPECIFICATION mode) |
| ⓶ | **NAZIV FAJLA** | Po pravilima iz `reference_naming.md` |
| ⓷ | **SPECIFIKACIJA STILA** | Koja su pravila primenjena (font, bold sheme, itd.) |
| ⓸ | **MODE** | EXECUTION / SPECIFICATION / SPEC+ARTIFACT |
| ⓹ | **OCEKIVANI VERIFICATION SCOPE** | Sta verifikator treba da proveri: tacnost navoda, konzistentnost datuma, pravni osnov, imenovanje |
| ⓺ | **COMPLIANCE IZVESTAJ** | Popunjeni izvestaj iz SKILL.md (sekcija "Compliance izvestaj") |

**Predaja se desava automatski — posle generisanja akta, stil-pisanja u svom ispisu kaze:**

> *"→ predaja verifikator-u na proveru"*

Verifikator tada preuzima kontrolu. Stil-pisanja ceka njegov povratni signal.

---

## 5. Povratna petlja sa verifikatorom (anti-loop)

**Verifikator vraca jedan od 3 rezultata:**

### 5.1 ✅ PROLAZ

Verifikator kaze "zeleno" → akt ide korisniku bez izmena.

### 5.2 ⚠️ PROLAZ SA NAPOMENOM

Verifikator nasao sitne stvari (npr. datum nedostaje, placeholder za broj priloga) → stil-pisanja:
1. Primenjuje ispravke
2. Vraca verifikator-u na jos jednu proveru (Pass 2)
3. Ako Pass 2 vrati novo ⚠️ ili ❌ → Pass 3
4. Posle Pass 3 → STOP, javi korisniku nerezene stavke (per anti-loop pravilo iz verifikator-a)

### 5.3 ❌ BLOKADA

Verifikator nasao ozbiljnu gresku (netacan citat zakona, izmisljen broj odluke, kontradikcija u cinjenicama) → stil-pisanja:
1. **NE** isporucuje akt korisniku
2. Vraca se na domenski skill (`krivica`/`tuzba-parnica`) za ispravke sadrzaja
3. Posle ispravke — ponovo kroz stil-pisanja → ponovo verifikator
4. Ako posle Pass 3 greska opstaje → javi korisniku da je potrebna rucna intervencija

---

## 6. Integracija sa postojecim skill-ovima — tacno gde se zakace

### 6.1 `pravna-analiza`

`pravna-analiza` zavrsava sa **Ф6 ГЕНЕРИСАЊЕ** → handoff u domenski skill ili direktno u `stil-pisanja` (ako je u pitanju ne-postupovni akt kao ugovor).

Dodatak u `pravna-analiza` compliance izvestaj:
```
║ HANDOFF U: [krivica/tuzba-parnica/stil-pisanja direktno] ║
║ STIL-PISANJA REZERVISAN: ✅ (aktivirace se na kraju)     ║
```

### 6.2 `krivica`

`krivica` Korak 9/10 (Генерисање + Compliance):
- Zameni interna pravila "TNR 12pt, A4" sa pozivom `stil-pisanja`
- Dodaj red: *"→ predaja `stil-pisanja` pre `verifikator`-a"*

### 6.3 `tuzba-parnica`

`tuzba-parnica` Korak 9 (Генерисање .docx):
- **ISPRAVI** interno pravilo "A4, margine 2.54 cm" (konflikt sa plugin-om)
- Zameni kompletan Korak 9 pozivom `stil-pisanja`
- Naming pattern u koraku 9 **takodje se ispravlja** — UPPERCASE TIP PODNESKA (po plugin pravilu)

### 6.4 `istrazivanje-prakse`

`istrazivanje-prakse` posle svog izlaza (✅П1 odluke + 🟡П2 sentence):
- Dodaj notifikaciju: *"→ prakse spremne za inject u stil-pisanja (ili direktno u domenski skill ako jos nije zavrseno)"*

### 6.5 `verifikator` — NE DIRA SE

Verifikator ostaje netaknut. On vec prima handoff od pravnih skills-ova. Jedina promena je **sto ce sada primati od `stil-pisanja`** umesto direktno od domenskog skilla — ali taj protokol je vec podrzan u verifikator-u (prima od bilo kog prethodnog pravnog skilla).

---

## 7. Multi-skill sinhronizacija — edge cases

### 7.1 Korisnik direktno trazi "samo formatiraj ovo u mom stilu"

Tekst postoji, samo treba vizuelna obrada:
- `pravna-analiza` NE treba (nema sta da se analizira)
- Domenski skill NE treba (tekst je vec napisan)
- `stil-pisanja` se aktivira samostalno
- `verifikator` i dalje radi (provera imena, datuma, citata)

### 7.2 Korisnik trazi "hitno, bez verifikatora"

- Stil-pisanja nastavlja normalno
- **UPOZORI** korisnika: *"Verifikator preskocen na tvoj zahtev. Rizik: netacni citati, izmisljene odluke, greske u imenovanju mogu proci."*
- Zapisi u compliance izvestaj: *"VERIFIKATOR PRESKOCEN — ZAHTEV KORISNIKA"*

### 7.3 Dokument se pravi u vise pasova (nacrt → finalna)

- Prvi pas: `pravna-analiza` + domenski skill → **.md draft** (ne aktivira stil-pisanja)
- Korisnik kaze "ovo je OK, sada formatiraj" → **drugi pas**: stil-pisanja + verifikator
- U prvom pasu — NE pozivaj stil-pisanja (nije isporuka)

### 7.4 Konflikt izmedju handoff instrukcija

Ako `pravna-analiza` kaze "potpisi Milan", a korisnik u medjuvremenu rekao "potpisi Djordje":
- **STANI. Pitaj korisnika koja instrukcija vazi.**
- Ne resavaj tiho — to je P2 problem.

---

## 8. Test-protokol (pre isporuke)

Pre nego sto stil-pisanja preda `verifikator`-u, on mora sam da odgovori sa ✅ na sve:

1. ✅ Primljen handoff sa svim obaveznim elementima ⓵–⓻?
2. ✅ Tip akta prepoznat?
3. ✅ Naming pattern primenjen?
4. ✅ TNR 12pt svuda?
5. ✅ Bold/italic/underline po pravilima iz reference_vizuelno.md?
6. ✅ Potpis "адв. Милан Мишић" (ili eksplicitno drugo)?
7. ✅ Margine 1440 twips?
8. ✅ Format Letter (12240×15840)?
9. ✅ Cirilica primarno?
10. ✅ Mode korektno detektovan (EXECUTION/SPECIFICATION)?

Ako ijedan odgovor nije ✅ — **ne predaj verifikator-u**, vrati se na tacku gde je problem.

---

## 9. Skracenice u compliance izvestajima

| Oznaka | Znacenje |
|---|---|
| ⓵–⓾ | Elementi handoff paketa |
| ✅ | Prosao proveru |
| ⚠️ | Napomena (nije blokada) |
| ❌ | Greska (blokada) |
| N-A | Nije primenljivo |
| 🎨 | stil-pisanja marker |
| ⚖️ | pravna-analiza marker |
| 🔍 | verifikator marker |
