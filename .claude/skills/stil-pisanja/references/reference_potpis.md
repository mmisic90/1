# Reference: Potpis, separatori, troskovnik

Ovaj fajl definise **sve sto ide posle glavnog teksta** pravnog dokumenta.

## 1. Potpis — default (adv. Milan Misic)

**Pattern:**

```
Нови Сад, дана 17.04.2026. године


                                                            адв. Милан Мишић
```

**Pravila:**
- Datum i mesto levo, format: "Град, дана DD.MM.GGGG. године"
- Jedan ili dva prazna reda izmedju datuma i potpisa
- Potpis desno: "адв. Милан Мишић" (tacno ovaj format, cirilica)
- **"адв."** malim slovom sa tackom
- **"Милан Мишић"** Title Case
- Font 12pt, regular (ne bold)

**XML:**
```xml
<!-- Datum -->
<w:p>
  <w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr>
  <w:r><w:rPr><w:sz w:val="24"/></w:rPr>
    <w:t>Нови Сад, дана 17.04.2026. године</w:t>
  </w:r>
</w:p>

<!-- Prazan red -->
<w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>

<!-- Potpis desno -->
<w:p>
  <w:pPr><w:jc w:val="right"/></w:pPr>
  <w:r><w:rPr><w:sz w:val="24"/></w:rPr>
    <w:t>адв. Милан Мишић</w:t>
  </w:r>
</w:p>
```

## 1b. MATRICA POTPISNIH BLOKOVA — kada koji potpis (iz analize korpusa 2021-2026)

**Ovo je najvaznije pravilo za potpis.** Iz analize 30+ akata iz kancelarije, potpis **NIJE uvek "samo Milan default"**. Raspored je sledeci:

### Po tipu akta i instance

| Tip akta | Instanca / okolnost | Potpis default |
|---|---|---|
| **Krivica — niza instanca** | Istrazni, prvostepeni | **Milan + Djordje** (oba advokata) |
| **Krivica — visa instanca** | Zalba, ZZZ, Vrhovni sud | **Milan + Djordje** (oba) |
| **Krivica — tuzilastvo (molbe, zahtevi)** | Molba za odlaganje, podnesak braniocu | **Djordje** (samo) |
| **Krivica — misljenje / savet klijentu** | Interni memo | **Djordje** (samo — konsultativni register) |
| **Krivica — zalba na resenje priv. mere** | Drugostepeni | **Djordje** (iz korpusa, Kalentic model) |
| **Parnica — tuzba velikog spora** | Privredni/visi sud, spor >10M RSD | **Milan + Djordje** (oba) |
| **Parnica — tuzba malog spora** | Osnovni sud | **Milan** (samo) |
| **Parnica — odgovor na tuzbu** | Svi nivoi | **Milan** (samo) |
| **Parnica — podnesak** | Tekuci postupak | **Milan** (samo) |
| **Parnica — zalba na presudu (velika parnica)** | Apelacioni sud, spor >30M RSD | **Milan + Milan Nedeljkov + Djordje** (sva tri!) |
| **Parnica — revizija** | Vrhovni sud | **Milan + Djordje** (oba) |
| **Parnica — ustavna zalba** | Ustavni sud | **Milan + Djordje** (oba) |
| **Izvrsenje — predlog, podnesak izvrsitelju** | Svi | **Milan** (samo) |
| **Opomena pred tuzbu / izvrsenje** | Vansudski | **Milan** (samo) |
| **Pritizba na rad suda** | Predsedniku suda | **Djordje** (iz korpusa — formalno kancelarijsko pismo) |
| **Urgencija** | Sudu | Ko i glavni akt |
| **Vansudsko poravnanje** | Ugovor — bez advokata! | **Direktor firme** (Letic za Armex, ne advokat) |
| **Ugovor (kupoprodaja, zakup)** | Strane ugovora | **Strane ugovora** (potpis advokata nije deo ugovora) |
| **Odgovor na tuzbu gde klijent sam odgovara** | Firma direktno | **Direktor firme** (Galens/Kostovski model) |
| **Misljenje klijentu (interni memo)** | Consultativno | **Djordje** (samo) |

### Sto NIKAD:
- **Milan Nedeljkov SAM** — nije potpisnik, samo kao treci uz Milana Misica i Djordja
- **Oba Milana** (Misic + Nedeljkov) bez Djordja — nije konfiguracija koja postoji u korpusu
- **Pecat + potpis** — pecat je samo u papirnoj verziji, NE u .docx
- **Inicijali umesto punog imena** (M.M. ili D.N.) — osim u gornjem desnom kodu (видети sekciju 8)

### Primeri tacnih potpisnih blokova

**A) Samo Milan (parnica, izvrsenje, opomena):**
```
Нови Сад, дана 24.09.2025. године


                                                            адв. Милан Мишић
```

**B) Milan + Djordje (krivica, revizija, velika tuzba):**
```
Нови Сад,
дана 24.10.2024. године


                                         адв. Ђорђе Недељков и адв. Милан Мишић
```

**Napomena:** U korpusu se cesto u istom redu pise "адв. Ђорђе Недељков и адв. Милан Мишић" ili jedan ispod drugog. Preferirano je **u jednom redu** kada staje, inace jedan ispod drugog desno poravnato.

**C) Tri advokata (velika zalba na presudu, vise tuzenih koje zastupaju razliciti advokati):**
```
Нови Сад,
Дана 30.12.2025. године


                                                            Адв. Милан Мишић
                                                            Адв. Милан Недељков
                                                            Адв. Ђорђе Недељков
```

**Napomena:** Ovo je redak slucaj. Iz Stepanovic zalbe (dec 2025) — kada se u istoj parnici zastupaju tri tuzene od strane tri razlicita advokata iz iste kancelarije, sve tri se potpisuju.

**D) Samo Djordje (misljenje, molba tuzilastvu, zalba na priv. meru, prituzba):**
```
Нови Сад, 03.02.2022. године


                                                            Адв. Ђорђе Недељков
```

**E) Direktor firme (vansudsko poravnanje, odgovor na tuzbu kada firma sama):**
```
За Повериоца:                              За Дужника:


_______________________                    _______________________
Директор, Ђорђе Летић                       Директор, Чедо Радетић
```

**F) Potpis sa naznakom zastupanja firme (parnica, pravno lice kao stranka):**
```
За тужиоца ФЛЕКСОПАК 1980 д.о.о.
                                                     пуномоћник
                                                            адв. Милан Мишић
```

### Pitanja pre potpisa — sta proveravas

1. **Tip postupka?** (krivica/parnica/izvrsenje/upravni/vansudski)
2. **Instanca?** (osnovni/visi/apelacioni/vrhovni/ustavni)
3. **Vrednost spora ili znacaj predmeta?** (>10M → dodatno konsultuje Djordja)
4. **Ko je primio punomoc od klijenta?** (Milan, Djordje, oboje) — ovo odlucuje
5. **Da li je akt za tuzilastvo (ne sud)?** → Djordje
6. **Da li je akt "misljenje" / "savet"?** → Djordje
7. **Da li stranka potpisuje sama (firma, direktor)?** → direktor, advokat ne

**Ako si nesiguran — pitaj korisnika.** Nikad pretpostavkom.

## 2. Potpis sa Djordjem Nedeljkovim — samo na eksplicitni zahtev

Kada korisnik eksplicitno kaze "potpisi kao Djordje" ili "stavi Nedeljkova":

```
                                                            адв. Ђорђе Недељков
```

- Isti format, samo drugo ime
- **NIKAD** ne stavljas oba potpisa zajedno
- **NIKAD** Milan Nedeljkov — on nije potpisnik

**Pravilo:** Ne pokrece ovu opciju na pretpostavku. Pita korisnika ako je u pitanju predmet gde treba provera.

## 3. Potpis kao zastupnik firme

Kada je klijent pravno lice, potpis ostaje isti (adv. Milan Misic), ali se **pre potpisa** moze dodati naznaka:

```
За тужиоца ФЛЕКСОПАК 1980 д.о.о.
                                                     пуномоћник
                                                            адв. Милан Мишић
```

## 4. Troskovnik — kompletan pattern

Troskovnik ide **na kraju**, pre potpisa, u posebnoj sekciji:

### 4.1. Naslov sekcije

```
______________________________________________________________________________


                           Т Р О Ш К О В Н И К
```

- Separator linija iznad
- Naslov 14pt bold, razmaknuta slova, centriran
- Dva prazna reda iznad, jedan ispod

### 4.2. Stavke

```
1. Састав тужбе (АТ 20)  ............................................ 30.000,00 RSD
2. Такса на тужбу  .................................................. 100.000,00 RSD
3. Превођење документа  .............................................. 15.000,00 RSD
4. Поступање на рочишту (АТ 12)  .................................... 15.000,00 RSD

______________________________________________________________________________

У К У П Н О  ..................................................... 160.000,00 RSD
```

**Pravila:**
- Redni brojevi 1., 2., 3.
- Naziv stavke u parenthesis moze biti oznaka Advokatske tarife (АТ 20, АТ 12)
- Dot leader (`.`) od kraja naziva do broja iznosa
- Iznos desno, format: "XX.XXX,00 RSD" (srpski format sa tackom kao separatorom hiljada)
- Posle svih stavki — linija separator
- "У К У П Н О" sa tri razmaka izmedju slova, **bold**
- Ukupni iznos bold, poravnat desno

### 4.3. Valuta

- Uvek "RSD" (tri slova, bez tacke na kraju)
- **Ne** koristi "дин", "RSD.", "дин.", "₽"
- Ne koristi "EUR" osim ako je klijent strani i ugovor u evrima

### 4.4. Tarifa

- Kada se referenca na Advokatsku tarifu: "АТ 20" znaci tac. 20 tarife
- Uvek proveri aktuelni iznos na propissoft.profisistem.rs
- Moze se dodati fusnota sa izracunom

### 4.5. REALNE TARIFE IZ KORPUSA (kalibracija — 2022-2026)

Ove cifre su **STVARNE** iz korpusa adv. Mišić/Nedeljkov i služe kao benchmark. Obavezno proveri na propissoft.profisistem.rs za trenutni iznos AT, ali ovaj raspored pokazuje **koliko se za sta napisalo**.

**Parnica (po vrednosti spora):**

| Vrednost spora | Sastav tuzbe | Odgovor na tuzbu | Zalba na presudu | Revizija |
|---|---|---|---|---|
| do 10M RSD | 40.000–56.000 | 50.000–90.000 | 300.000–600.000 | 500.000 |
| 10M–30M RSD | 56.250 (tarifa 13) | 112.500 (tarifa 13) | **3.600.000** (Stepanovic) | 700.000 (Vukovic) |
| preko 30M | po konkretnom izracunu AT | po konkretnom izracunu AT | preko 3.000.000 | 700.000–1.000.000 |

**Krivica:**
| Akt | Tarifa |
|---|---|
| Krivicna prijava | 40.000–70.000 |
| Prigovor na odbacaj KP | 50.000–75.000 |
| Zalba (krivica, nize/vise instance) | 67.500 (Kalentic) |
| ZZZ (Vrhovni sud) | 700.000–1.000.000 |
| Predstavka ESLJP | 1.000.000+ |

**Izvrsenje:**
| Akt | Tarifa |
|---|---|
| Predlog za izvrsenje (1 faktura) | 13.500 |
| Predlog za izvrsenje (vise faktura, uvecanje) | 27.000 (Armex, 3 fakture: 13.500 + 50% + 50%) |
| Podnesak izvrsitelju | 13.500–20.000 |
| Prigovor na resenje o izvrsenju | 20.000–40.000 |

**Vansudski:**
| Akt | Tarifa |
|---|---|
| Opomena pred tuzbu | 13.500 |
| Opomena pred izvrsenje | 13.500 |
| Vansudsko poravnanje (sastav) | 45.000 (Armex/Duming) |
| Urgencija | 6.750–13.500 |

**Formula za uvecanje kod vise zahteva/faktura u istom predlogu za izvrsenje:**
```
1. faktura: osnovna tarifa 13.500
2. faktura: 50% od osnovne = 6.750
3. faktura: 50% od osnovne = 6.750
Ukupno: 13.500 + 6.750 + 6.750 = 27.000
```

**Napomena:** Kada pises troskovnik, **ne stavljaj** sve stavke sa tacnim iznosima po AT — stavi samo sto je realno naplativo u datom postupku (sastav, taksa, postupanje na rocistu).

## 5. Separatori sekcija — kompletna upotreba

### 5.1. Primarni separator
78 donjih crta u posebnom pasusu:
```
______________________________________________________________________________
```

**Gde se koristi:**
- Pre troskovnika
- Izmedju "Образложења" i "Предлога суду"
- Izmedju "Предлога суду" i potpisa
- Izmedju glavnog teksta i pratecih dokumenata (prilozi)

### 5.2. Sekundarni separator (tanja linija)
Nije obavezan, ali se moze koristiti za manje podsekcije:
```
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

### 5.3. Ne koristi
- Emoji separatore (✦ ◆ ★)
- Linije crta-crta sa jednim dugim crtama (—————)

## 6. Zaglavlje dokumenta (gornji blok)

Pre glavnog naslova, gore-desno, ide adresat:

```
                                                   ОСНОВНОМ СУДУ У НОВОМ САДУ
                                                   Сутјеска бр. 3, Нови Сад

                                                   Предмет: П 1234/2024
                                                            КАЛЕНТИЋ против
                                                            ФЛЕКСОПАК 1980
```

- Desno poravnato
- 12pt regular
- Izmedju "Суду" i "Предмет" — jedan prazan red
- "Предмет:" bold, ostalo regular
- Hanging indent 2160 za "Предмет:" blok (da se "КАЛЕНТИЋ против" lepo poravnava ispod)

## 7. Prilozi (attachments)

Na kraju dokumenta, posle potpisa:

```
______________________________________________________________________________


Прилог:  1. фотокопија пуномоћја
         2. фотокопија уговора о закупу
         3. извод из катастра
         4. потврда о уплати таксе
```

- Separator linija iznad
- "Прилог:" bold
- Hanging indent 1440 za sve priloge
- Redni brojevi 1., 2., 3.
- Regular font, 12pt

## 8. Gornji desni kod (za interno evidentiranje)

U nekim slucajevima stavlja se interni kod u gornji desni ugao:

```
                                                                    М.М./24-001
```

- Inicijali advokata (М.М.) kosa crta godina-broj
- Mala slova, 10pt (petit)
- Desno poravnato

Koristi se samo kada korisnik eksplicitno trazi.

## 9. Pecat (kada se koristi)

U elektronskim verzijama **ne** umece se pecat kao slika.
Samo papirna verzija ima rucni pecat.
U .docx ostavi samo tekst potpisa.

Izuzetak: ako korisnik trazi eksport koji ima scanned/embedded pecat — to nije posao ovog skill-a, on se ne bavi slikama.

## 10. Kombinovani primer — kraj dokumenta

Kompletan prikaz od obrazlozenja do potpisa:

```
...тужени је у обавези да накнади штету у износу
од 500.000,00 RSD увећану за законску затезну камату.

______________________________________________________________________________


                        П Р Е Д Л О Г  С У Д У


Тужилац предлаже суду да након спроведеног поступка донесе:

                        П Р Е С У Д У


ОБАВЕЗУЈЕ СЕ тужени ФЛЕКСОПАК 1980 д.о.о. да тужиоцу
КАЛЕНТИЋУ Николи исплати износ од 500.000,00 RSD
са законском затезном каматом почев од 12.03.2024.
године до исплате, као и трошкове поступка у износу
одређеном у троскоvnikу, све у року од 15 дана од
пријема пресуде, под претњом извршења.

______________________________________________________________________________


                        Т Р О Ш К О В Н И К

1. Састав тужбе (АТ 20)  ............................................ 30.000,00 RSD
2. Такса на тужбу  .................................................. 100.000,00 RSD
3. Превођење документа  .............................................. 15.000,00 RSD
4. Поступање на рочишту (АТ 12)  .................................... 15.000,00 RSD

______________________________________________________________________________

У К У П Н О  ..................................................... 160.000,00 RSD


Нови Сад, дана 17.04.2026. године


                                                            адв. Милан Мишић


______________________________________________________________________________


Прилог:  1. фотокопија пуномоћја
         2. фотокопија уговора о закупу од 12.03.2024. године
         3. извод из катастра РГЗ бр. 952-04/2024
         4. потврда о уплати таксе
```

## 11. Anti-pattern u potpisu

| LOSE | ISPRAVNO |
|------|----------|
| `Advokat Milan Misic` | `адв. Милан Мишић` |
| `Adv. M. Misic` | `адв. Милан Мишић` |
| `ADV. MILAN MISIC` | `адв. Милан Мишић` |
| `Milan Misic, adv.` | `адв. Милан Мишић` |
| `Adv. Milan Misic & Adv. Djordje Nedeljkov` | samo jedan potpis |
| `Kancelarija adv. Misic` | samo ime advokata |

## 12. Kontradikcije i edge cases

### 12.1. Klijent trazi da se potpise Djordje Nedeljkov
- **Pitaj korisnika** eksplicitno da li da potpisem kolegu
- Nikad pretpostavkom

### 12.2. Klijent trazi oba imena (kancelarija zajednicki)
- **Nije standard** — samo jedan potpis u pravnom aktu
- Pitaj da potvrdi, ne radi tiho

### 12.3. Nema datuma i mesta
- Ubaci placeholder: "Нови Сад, дана XX.XX.XXXX. године"
- Obavesti korisnika da treba popuniti

### 12.4. Mesto nije Novi Sad
- Pitaj korisnika (Zrenjanin, Beograd, druga opcija)
- Ne pretpostavljaj

### 12.5. Stari dokument u arhivi potpisan kao Nedeljkov
- **Ne menjaj retroaktivno** postojece fajlove
- Novi dokumenti — default Milan Misic osim ako drugacije

## 13. Checklist pre finalizacije potpisa

1. ✅ Datum i mesto prisutni?
2. ✅ Potpis desno poravnat?
3. ✅ "адв." malim slovom sa tackom?
4. ✅ "Милан Мишић" tacno tako (ili Djordje ako je trazeno)?
5. ✅ Font 12pt, regular (ne bold)?
6. ✅ Prazan prostor izmedju datuma i potpisa?
7. ✅ Nije slucajno dodat Milan Nedeljkov?
8. ✅ Prilozi prisutni ako ih dokument referencira?
9. ✅ Troskovnik ako je u pitanju tuzba/zalba sa zahtevom za troskove?
