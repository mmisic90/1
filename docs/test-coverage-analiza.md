# Analiza test pokrivenosti — PR #22

## Šta PR #22 predlaže za merge

Jedna jedina izmena: dodavanje `@vitest/coverage-v8` u `devDependencies`
(`package.json` + lockfile). Nema promena u izvornom kodu ni u testovima.
Cilj je omogućiti `vitest run --coverage` kao alat za buduća merenja.
Sadržajni deo PR-a je **analiza** (u opisu PR-a i u ovom dokumentu), ne
implementacija.

## Izmereno stanje (90 testova, sve prolaze)

| Fajl | Statements | Branch | Funcs |
|---|---|---|---|
| `carousel.js` | 99% | 82% | 95% |
| `remote.js` | 100% | 84% | 100% |
| `voting.js` | 100% | 88% | 100% |
| **Ukupno** | **99.6%** | **84%** | **97.6%** |

Pokrivenost linija je odlična. Praznine nisu „neotestirani fajlovi" nego
**neotestirana ponašanja i spojnice** (HTML ↔ moduli, defanzivne grane).

## Predložene oblasti (prioritet, najvažnije prvo)

1. **HTML wiring je netestiran (najveći rizik).** Moduli su čisti i
   testirani, ali lepak nije: `remote.html` radi `Object.assign(window, remote)`
   i koristi inline `onclick="fn()"`. Ako se metoda preimenuje, svih 90
   testova ostaje zeleno, a stranica je mrtva. `setupDOM()` u testovima je
   ručno duplirana skica pravog HTML-a — drift ID-eva je nevidljiv.
2. **Integritet glasova u `voting.js` (L30/35/46).** `Math.max(0, …)`
   klampovi i `(n || 0)` u `getTotal` (zaštita od negativnih brojeva) nikad
   nisu izvršeni testom.
3. **Interakcija carousel + voting**, posebno fallback bez `localStorage`
   (`carousel.js:15` i `:113`) i pitanje da li `voted` klase preživljavaju
   `updateUI()` re-render posle navigacije.
4. **Ugovor podataka u `ideas.js`** — polja `image`/`imageAlt` nisu
   testirana iako `carousel.js:56-62` grananje zavisi od njih.
5. **Niži prioritet:** defanzivni `if (element)` u `remote.js` čine
   najveći deo nedostajućih 16% grana, ali su čista zaštita.

## Uticaj na već urađeno na `mmisic90/1`

Pregledao sam PR istoriju — **dva otvorena PR-a se preklapaju** sa mojim
predlozima i menjaju preporuku:

- **PR #31 „close coverage gaps in wiring, remote, and landing page"**:
  direktno pokriva predlog #1 (wiring) i delom #5. Ako se #31 mergeuje,
  predlog #1 iz #22 postaje suvišan.
- **PR #24 „page smoke tests, CI workflow, and fix BCS pluralization"**:
  pokriva drugu polovinu #1 (HTML smoke testovi) i moj usputni predlog za
  CI workflow. Trenutno (potvrđeno u `CLAUDE.md`) ništa automatski ne
  pokreće `npm test`.
- **PR #25 „fix teen/compound vote count pluralization"**: dotiče
  `voteCountLabel` u `carousel.js` — srodno oblasti #2, ali za
  pluralizaciju, ne za negativne brojeve.

Istorijski: PR #17 je izvukao `remote.js` u modul i dodao XSS zaštitu;
PR #10 je dodao voting; PR #7 je uveo Vitest. Postojećih 90 testova je
rezultat tih PR-ova — osnova je dobra, rupe su konkretne.

## Preporučeni redosled

1. Mergeovati **PR #22** kao alat (coverage tooling) — bez konflikta sa
   ostalim.
2. Pre nego što se napišu novi testovi za #1 ili #5, mergeovati ili
   zatvoriti **PR #31** i **PR #24** da se izbegne dupliranje.
3. Ostaju kao nezavisni: #2 (voting integritet), #3 (carousel+voting
   interakcija), #4 (`ideas.js` slike).
