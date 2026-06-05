# Pilot Reels — Higgsfield prompt files

Spremni prompt fajlovi za pilot batch (REEL 01, 02, 03) iz
`../reels-strategy.md`. Pokrenite direktno sa `higgsfield` CLI prema
postupku iz `../higgsfield-prompts.md`.

## Manifest

| Fajl | Reel | Tip | Higgsfield model |
|---|---|---|---|
| `reel-01-image-corridor.txt` | 01 — Sixty Seconds | Image (wide hodnik) | Soul |
| `reel-01-image-stare.txt` | 01 — Sixty Seconds | Image (Kubrick stare) | Soul |
| `reel-01-video-corridor.txt` | 01 — Sixty Seconds | Video 8s (dolly hodnik) | DoP |
| `reel-02-image-contract.txt` | 02 — Seven Passes | Image (top-down ugovor) | Soul |
| `reel-02-video-passes.txt` | 02 — Seven Passes | Video 6s (ruke + olovke) | DoP |
| `reel-03-image-library.txt` | 03 — The Library | Image (wide biblioteka) | Soul |
| `reel-03-video-dolly.txt` | 03 — The Library | Video 7s (dolly kroz police) | DoP |

## Brza komanda (test jedan prompt prije batch-a)

```bash
# Image — testiraj prvo REEL 02 contract (najjeftiniji vizuelno)
higgsfield image generate \
  --prompt-file prompts/reel-02-image-contract.txt \
  --aspect 9:16 \
  --model soul \
  --output public/reels/reel-02-cover.jpg

# Ako rezultat zadovoljava, batch ostatak
for f in reel-01-image-corridor reel-01-image-stare \
         reel-03-image-library; do
  higgsfield image generate \
    --prompt-file prompts/$f.txt \
    --aspect 9:16 \
    --model soul \
    --output public/reels/$f.jpg
done

# Video — DoP model, redom
for f in reel-01-video-corridor reel-02-video-passes \
         reel-03-video-dolly; do
  higgsfield video generate \
    --prompt-file prompts/$f.txt \
    --aspect 9:16 \
    --duration 8 \
    --model dop \
    --output public/reels/$f.mp4
done
```

## Napomene

- **Aspect 9:16** je obavezan — Reels/TikTok vertical. Ako Higgsfield
  CLI generira 16:9, koristi `--crop` ili passuj `aspect_ratio: "9:16"`
  u prompt JSON-u.
- **Negative prompts** koje treba dodati globalno (ako Higgsfield
  varijanta podržava): `text, watermark, logo, signature, brand name,
  blurry, low quality, distorted hands`.
- **Seed lock**: kad jedan kadar zadovolji, sačuvaj seed
  (`--seed <broj>`) za varijacije iste scene (npr. drugi ugao istog
  hodnika za REEL 01 "part II").
- **Budžet**: 7 image + 3 video generacije pokrivaju pilot. Ostavi
  rezervu od ~30% kredita za retry zbog ruku / lica koja Higgsfield
  zna da promaši na prvi pokušaj.

## Posle generacije

1. Sačuvaj sve fajlove u `public/reels/`
2. Editing redosled prema beat-by-beat scenariju iz
   `../reels-strategy.md` (po Reel-u)
3. Audio: tik-tak sat za REEL 01, ambient room tone + olovka po papiru
   za REEL 02, suptilan reverb i daljinski koraci za REEL 03
4. Chapter card tekst (`01. SIXTY SECONDS.` itd.) dodaj u editoru
   (Premiere/CapCut), ne u Higgsfield promptu — promptovi eksplicitno
   isključuju text overlays
