# Arhiviranje krivičnih odluka (vrh.sud.rs → Google Drive)

`download-krivicne.mjs` preuzima **sve krivične odluke** iz baze sudske prakse
Vrhovnog suda i priprema ih za upload u Google Drive folder
`1glA0SJaE2ZvfKHA8eC9d8-KD_nwmMxwA`. Odluke su javne.

## Kako radi

Pretraga je Drupal/Solr na `vrh.sud.rs/sr-lat/solr-search-page/results`.
Krivična materija = parametar `matter=33`. Paginacija `?page=N`, do
`results=1000` po strani. Na dan izrade baza prijavljuje **11.069** odluka.

Svaki rezultat nosi metapodatke u redu (`result-summary`: upisnik, broj
predmeta, datum). Stranica odluke (npr. `/sr-lat/kzz-1182013`) ima zvanični
**PDF** (link „Preuzmite dokument u PDF formatu" →
`/vks-search-download-file/NNNN`) — to je autentičan dokument koji skripta
preuzima. Ako PDF ne postoji, kao rezerva snima se HTML tekst odluke
(`field-name-body`).

Za svaku odluku snima se i **`.txt`** (čist tekst odluke + zaglavlje sa
oznakom predmeta, datumom i izvornim linkovima) — ekonomičan format za
pretragu i pravnu analizu. Na kraju punog preuzimanja pravi se i jedan
**indeks** `_INDEKS-presuda.html` sa klikabilnim linkovima ka svakoj presudi
(„Presuda Kzz 118/2013" → otvara odluku; uz „PDF" za zvanični dokument).

## Komande

```bash
node scripts/download-krivicne.mjs popis                 # skupi sve linkove -> out/manifest.json
node scripts/download-krivicne.mjs download              # preuzmi PDF + .txt, pa napravi indeks
node scripts/download-krivicne.mjs download --limit 50   # probni batch
node scripts/download-krivicne.mjs index                 # (ponovo) napravi _INDEKS-presuda.html
node scripts/download-krivicne.mjs status                # pregled napretka
```

Sve je **resume-safe**: `out/manifest.json` pamti status svake odluke
(`found → downloaded → uploaded`), pa ponovno pokretanje nastavlja gde je stalo.
Ima rate-limit (~1 req/s) i retry s eksponencijalnim backoff-om.

`out/` je u `.gitignore` — preuzeti fajlovi i manifest se ne komituju.

## Upload u Google Drive

Ciljni folder „VRHOVNI SUD": `1glA0SJaE2ZvfKHA8eC9d8-KD_nwmMxwA`.
Svih ~11.069 PDF-ova je oko **1,5–1,8 GB**.

**Preporučeno (masovni upload, lokalno) — `rclone`:**

```bash
rclone config                 # jednokratno: dodaj remote „gdrive" (Google Drive OAuth)
node scripts/download-krivicne.mjs popis
node scripts/download-krivicne.mjs download
rclone copy out/krivicne "gdrive:" \
  --drive-root-folder-id 1glA0SJaE2ZvfKHA8eC9d8-KD_nwmMxwA \
  --transfers 8 --checkers 16 -P
```

`rclone copy` je idempotentan (preskače već postojeće), pa je i ovaj korak
resume-safe. Alternativa: Google Drive desktop (sync foldera) ili
service-account skripta.

**Manji batch-evi (preko ovog asistenta) — Drive MCP `create_file`:**
prima `parentId` = ID foldera, `title` = ime fajla, `base64Content` (PDF) /
`textContent` (HTML rezerva) i `contentMimeType`. Praktično za stotine, ali ne
i za desetine hiljada fajlova (svaki PDF base64-om optereti kontekst), zato je
za pun set bolji `rclone`.

## Provera ispravnosti

1. `popis` → broj u manifestu treba da bude **== 11.069** (brojač na sajtu). ✓ provereno
2. `download --limit N` → uz svaki PDF (`%PDF`, 2–4 strane) i `.txt` sa čistim tekstom. ✓ provereno
3. `index` → `_INDEKS-presuda.html` sa svih 11.069 klikabilnih linkova. ✓ provereno
4. Na kraju: broj fajlova u Drive folderu == broj u `out/krivicne/`.
