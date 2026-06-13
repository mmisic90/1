# Rokovi u krivičnom postupku — kompletna tabela

> ⚠️ **Zakon o krivičnom postupku** („Sl. glasnik RS", br. 72/2011 i izmene). Uvek verifikovati aktuelni tekst na `propissoft.profisistem.rs` pre primene u konkretnom predmetu.

## 1. ROKOVI ZA REDOVNE PRAVNE LEKOVE

| Akt | Rok | Početak roka | Izvor |
|---|---|---|---|
| Žalba na presudu (opšti postupak) | **15 dana** | Od dostavljanja presude | čl. 432 ZKP |
| Žalba na presudu (skraćeni postupak) | **8 dana** | Od dostavljanja presude | čl. 506 st. 1 ZKP |
| Žalba na presudu — maloletnici | **8 dana** | Od dostavljanja | čl. 81 ZMP |
| Odgovor na žalbu protivnika | **8 dana** | Od dostavljanja žalbe | čl. 449 st. 1 ZKP |
| Žalba na rešenje (u istrazi/KV) | **3 dana** | Od dostavljanja | čl. 467 st. 1 ZKP |
| Žalba na rešenje (van istrage) | **8 dana** | Od dostavljanja | čl. 467 st. 2 ZKP |

## 2. ROKOVI ZA VANREDNE PRAVNE LEKOVE

| Akt | Rok | Početak roka | Izvor |
|---|---|---|---|
| Zahtev za zaštitu zakonitosti | **30 dana** | Od pravnosnažnosti | čl. 485 st. 4 ZKP |
| Zahtev za ponavljanje postupka | **Nema rok** | Do nastupanja zastarelosti izvršenja | čl. 470 st. 3 ZKP |
| Molba za vanredno ublažavanje kazne | **Nema rok** | — | čl. 555 ZKP |

## 3. ROKOVI ZA PRITVOR I MERE

| Akt | Rok | Početak roka | Izvor |
|---|---|---|---|
| Žalba na rešenje o pritvoru | **3 dana** | Od dostavljanja | čl. 214 st. 4 ZKP |
| Žalba na rešenje o zadržavanju | **4 sata** | Od usmenog saopštenja | čl. 294 st. 3 ZKP |
| Žalba na rešenje o merama | **3 dana** | Od dostavljanja | čl. 214 ZKP |

## 4. ROKOVI ZA ODGOVORE I PRIGOVORE

| Akt | Rok | Početak roka | Izvor |
|---|---|---|---|
| Odgovor na optužnicu | **8 dana** | Od dostavljanja | čl. 336 st. 3 ZKP |
| Prigovor na optužni predlog (skraćeni post.) | **8 dana** | Od dostavljanja | čl. 500 st. 3 ZKP |
| Prigovor na odbačaj kriv. prijave (OJT) | **8 dana** | Od obaveštenja | čl. 51 st. 2 ZKP |
| Prigovor na odbačaj (VJT) | **8 dana** | Od obaveštenja | čl. 51 st. 2 ZKP |
| Zahtev oštećenog za preuzimanje gonjenja | **8 dana** | Od obaveštenja | čl. 52 ZKP |

## 5. ROKOVI ZA PRIVATNI TUŽILAC

| Akt | Rok | Početak roka | Izvor |
|---|---|---|---|
| Privatna tužba (podnošenje) | **3 meseca** | Od saznanja za delo i učinioca | čl. 65 st. 2 ZKP |
| Odustanak od privatne tužbe | — | Do završetka glavnog pretresa | čl. 66 ZKP |

## 6. ROKOVI ZA USTAVNI I MEĐUNARODNI NIVO

| Akt | Rok | Početak roka | Izvor |
|---|---|---|---|
| Ustavna žalba | **30 dana** | Od prijema pravnosnažne odluke | čl. 84 ZUS |
| Predstavka ESLJP (novi slučajevi) | **4 meseca** | Od finalne odluke | čl. 35 § 1 EKLJP (od 1.2.2022) |
| Predstavka ESLJP (slučajevi pre 1.2.2022) | **6 meseci** | Od finalne odluke | čl. 35 § 1 EKLJP (stara verzija) |

## 7. PRAVILA RAČUNANJA ROKOVA (čl. 225 ZKP)

### Opšta pravila

1. **Rok teče od dana POSLE dostavljanja.** Dan dostavljanja se ne računa.
2. Ako poslednji dan roka pada na neradni dan (subota, nedelja, državni praznik) → rok se **produžava na prvi radni dan**.
3. Podnošenje **do 24:00** zadnjeg dana roka je blagovremeno.
4. Podnošenje preporučenom poštom — relevantan je **datum žiga na pošti**, ne datum prijema u sudu (čl. 228 st. 1 ZKP).
5. Podnošenje elektronski (gde je dozvoljeno) — trenutak prijema u elektronskom sistemu suda.

### Posebna pravila za pritvor

- Rok za žalbu na pritvor (3 dana) **teče i preko neradnih dana** — zbog hitnosti.
- Rok za žalbu na zadržavanje (4 sata) teče u minutima od usmenog saopštenja. Krajnji momenat se obavezno upisuje u zapisnik.

### Kompjutacija primera

**Primer 1:** Presuda dostavljena braniocu u petak, 10. aprila 2026.
- Rok 15 dana za žalbu: počinje teći u subotu 11.4.2026.
- Zadnji dan: petak, 24.4.2026. do 24:00.

**Primer 2:** Rešenje o pritvoru dostavljeno u četvrtak u 14:00.
- Rok 3 dana.
- Zadnji dan: nedelja — ali ne pomera se jer teče preko neradnih dana.
- Krajnji momenat: nedelja do 24:00.

**Primer 3:** Presuda Ustavnog suda primljena 1.3.2026.
- Rok 4 meseca za ESLJP.
- Zadnji dan: 1.7.2026. do 24:00 (po lokalnom vremenu podnosioca).

## 8. Rok-alarm format

Za Compliance izveštaj u `krivica` SKILL.md Korak 10:

```
╔════════════════════════════════════════════════╗
║ ⏰ ROK-ALARM                                    ║
╠════════════════════════════════════════════════╣
║ Tip akta: Žalba na presudu                     ║
║ Dostavljeno: 10.04.2026.                        ║
║ Rok: 15 dana                                   ║
║ KRAJNJI DATUM: 25.04.2026. do 24:00            ║
║ Danas: 11.04.2026.                             ║
║ OSTALO: 14 dana                                ║
║ STATUS: 🟢 normalno                            ║
╚════════════════════════════════════════════════╝
```

**Prag alarma:**
- 🟢 > 7 dana
- 🟡 3–7 dana (prioritet)
- 🔴 1–2 dana (HITNO)
- ⛔ < 24 sata (KRITIČNO — obavestiti Milana odmah, pre bilo čega drugog)

## 9. ČESTE GREŠKE

- ❌ Računanje roka od dana donošenja odluke umesto od dana dostavljanja
- ❌ Ignorisanje pravila da neradni dan pomera zadnji dan napred (osim kod pritvora)
- ❌ Mešanje rokova za opšti i skraćeni postupak (15 vs 8 dana)
- ❌ Propuštanje roka za prigovor oštećenog (8 dana) u slučaju odbačaja prijave
- ❌ Računanje 6 meseci umesto 4 meseca za nove ESLJP predstavke (posle 1.2.2022)
