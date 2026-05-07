# Higgsfield CLI — Prompts za "Business Ideas" carousel

Skup promptova za Higgsfield CLI da generišeš slike i kratke video klipove
za 4 ideje iz `src/ideas.js`. Stil je usklađen: navy + gold paleta, poslovno,
moderno, foto-realistično.

## Globalni stil (paste u svaki prompt na kraju)

```
Style: cinematic, photorealistic, navy blue and gold color palette,
moody studio lighting, shallow depth of field, professional editorial,
16:9 aspect, high detail, no text overlays, no logos.
```

## 1. AI-Powered Contract Review

**Image (Higgsfield Soul):**
```
A close-up of a sleek modern laptop screen displaying a legal contract
document with subtle holographic AI highlights and risk markers glowing
in gold over key clauses. A lawyer's hand hovers near the trackpad. Dark
navy desk, warm desk lamp, blurred bookshelves in background.
{Globalni stil}
```

**Video (Higgsfield DoP, 5s):**
```
Slow dolly-in toward laptop screen, the contract auto-scrolls and gold
highlight markers appear one-by-one over risky clauses. Subtle particle
effect.
Camera: dolly-in, 30mm, f/1.8.
{Globalni stil}
```

## 2. Online Dispute Resolution

**Image:**
```
Split-screen video call composition: two professionals in different
modern offices, a third tile shows a calm certified mediator. All on a
clean dashboard interface with gold accent color. Soft natural light.
{Globalni stil}
```

**Video (Higgsfield DoP, 5s):**
```
Crane shot rising above a glass conference table with a tablet showing
a mediation dashboard, then transitions to two people shaking hands
virtually across a split screen.
Camera: crane up + tilt down, 35mm.
{Globalni stil}
```

## 3. Legal Document Automation

**Image:**
```
A guided questionnaire UI floats in 3D above a wooden desk, generating
a clean PDF document below it. Documents fold into themselves like an
elegant origami. Gold UI accents, navy background.
{Globalni stil}
```

**Video (Higgsfield DoP, 5s):**
```
Top-down shot of blank paper on desk; UI form fields fill in
automatically with typewriter effect; finished document slides into a
folder.
Camera: locked-off top-down, 50mm.
{Globalni stil}
```

## 4. Lawyer Marketplace

**Image:**
```
A grid of 6 professional lawyer profile cards with star ratings and
practice-area badges, floating over a softly blurred cityscape at dusk.
Gold rating stars, navy cards.
{Globalni stil}
```

**Video (Higgsfield DoP, 5s):**
```
Camera trucks horizontally past floating profile cards; one card lights
up gold and zooms forward as if selected.
Camera: lateral truck + push-in, 35mm.
{Globalni stil}
```

## CLI workflow (sa Claude Code)

Pretpostavka: `higgsfield` CLI je instaliran i autentifikovan
(`higgsfield login`).

```bash
# Generiši sve 4 slike u batch-u
for i in 1 2 3 4; do
  higgsfield image generate \
    --prompt-file prompts/idea-$i.txt \
    --aspect 16:9 \
    --output public/ideas/idea-$i.jpg
done

# Generiši kratki video (DoP preset)
higgsfield video generate \
  --prompt-file prompts/idea-1-video.txt \
  --duration 5 \
  --camera dolly-in \
  --output public/ideas/idea-1.mp4
```

Kada slike budu generisane, zamijeni Unsplash URL-ove u `src/ideas.js`
sa lokalnim putanjama (`./public/ideas/idea-1.jpg` itd.).

## Napomena

- Higgsfield naplaćuje po generaciji (kredit sistem) — testiraj jedan
  prompt prije batch-a.
- Pravi CLI zastavice (`--prompt-file`, `--camera`) provjeri u
  `higgsfield --help` jer se sintaksa mijenja kako alat raste.
- Za kvalitet portreta lawyer-a (ako ti zatreba) koristi **Soul** model;
  za kamera-driven kratke klipove **DoP**.
