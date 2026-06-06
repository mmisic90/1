# Pilot storyboards — REEL 01, 02, 03

Vizualne reference 9:16 (1080×1920 PNG), generisane preko Canva za
pilot batch iz `../../../reels-strategy.md`.

**Ovo NISU finalni Reels.** Ovo su **storyboard frame-ovi** — služe
kao look-and-feel referenca za kompoziciju, paletu, položaj chapter
card-a, i registar kadrova prije snimanja ili Higgsfield generacije.

## Manifest

| Fajl | Reel | Šta prikazuje |
|---|---|---|
| `reel-01-storyboard.png` | 01 — Sixty Seconds | Hodnik suda, jednotačkasta perspektiva, lone figure prema vratima, gold vanishing point |
| `reel-02-storyboard.png` | 02 — Seven Passes | Almost-overhead still life: tungsten lampa, prazan dokument, Mont Blanc, navy stol |
| `reel-03-storyboard.png` | 03 — The Library | Simetričan biblioteka prolaz sa toplom lampom na stočiću u dnu (v1 — bez portreta) |
| `reel-03-storyboard-v2.png` | 03 — The Library | Ista kompozicija + dva ukrašena okvira sa portretima na bočnim zidovima (placeholder za Bogišića i Jovanovića — v2) |
| `reel-03-storyboard-v3.png` | 03 — The Library | Photoreal kabinetski hodnik: navy zidovi, herringbone parket, kožni tomovi levo, galerija portreta u baroknim ramovima desno, mesingane lampe sa zelenim staklom, portret kroz vrata na kraju hodnika (3/4 ugao) |
| `reel-03-storyboard-v4.png` | 03 — The Library | Strikna frontalna Kubrick simetrija: **tri velika portreta u nizu** na centralnom zidu, mesingana lampa sa zelenim staklom u prvom planu, knjige levo-desno simetrično (bez imena) |
| `reel-03-storyboard-v5.png` | 03 — The Library | **= v4 + ugravirana zlatna imena ispod portreta** (Valtazar Bogišić / Svetozar Miletić / Slobodan Jovanović) — **finalni gallery keyframe** za video |
| `reel-03b-misic-portrait.png` | 03 — reveal | Četvrti portret (savremeni advokat) sam pod picture light-om, mesingana pločica **"Adv. Milan Misić"** — **reveal keyframe** za video |

## Video / animatik

| Fajl | Šta je |
|---|---|
| `../reel-03-lineage-animatic.mp4` | Previz animatik (12s, 9:16): hodnik → push-in na tri portreta sa imenima → skretanje desno → reveal Misić. **Previz tajminga/montaže, NIJE finalni foto-kvalitet.** |

Finalni video se renderuje u image-to-video modelu (Higgsfield / Kling /
Runway) iz tri keyframe-a (v3 → v5 → reel-03b) + prompta u
`../../../prompts/reel-03-video-lineage.txt`. Imena (v5) i pločica
(reel-03b) su postavljeni Pillow overlay-om — čitljivi i tačni.

## Šta uzeti iz ovih frame-ova

- **Paleta** je tačna: deep navy + warm gold, jedna tačka svetla po
  kadru, sve ostalo u hladnoj senci
- **Kompozicija** je tačna: dead-center vanishing point, simetrija u
  vertikalnoj osi
- **Chapter card** pozicija dole-centar/levo, gold serif tipografija
  na crnoj/transparentnoj podlozi

## Šta NE uzeti

- Tekst "SEVENPASSES" u storyboard 02 treba biti "SEVEN PASSES." (Canva
  render quirk — popraviti u finalnom editu)
- Chapter card u v3 piše "1. THE LIBRARY / Dignified Law Firm" — treba
  biti "03. THE LIBRARY." bez podnaslova (Canva quirk — chapter card
  je u finalnom Reel-u svakako overlay u editu, ne pečeni tekst)
- Knjige u storyboard 03 nemaju zlatne hrbatove kakvi su u promptu —
  u snimanju koristiti prave kožno povezane tomove (npr. Sl. list,
  ZOO komentari) sa gold-embossed naslovima
- Portreti u `reel-03-storyboard-v2.png` i `reel-03-storyboard-v4.png`
  su **generički bradati pravnici 19. veka**, NE prepoznatljivi likovi
  Bogišića, Miletića i Jovanovića. AI generatori ne daju pouzdane
  likove istorijskih osoba. Za finalnu realizaciju (snimanje ili
  Higgsfield image-to-video) treba:
  1. Nabaviti **javno-dostupne fotografije** sva tri lica:
     - Valtazar Bogišić (1834–1908) — pravnik, autor Opšteg
       imovinskog zakonika za Crnu Goru, fotografije 1880–90-ih
     - Svetozar Miletić (1826–1901) — pravnik, političar, gradonačelnik
       Novog Sada, fotografije 1860–90-ih
     - Slobodan Jovanović (1869–1958) — pravnik, autor ustavnog prava
       i istoričar, fotografije 1920–30-ih
     Sva tri su PD u BiH/RS/CG zbog isteka 70+ godina od smrti.
  2. Uramiti ih u stilske zlatne barokne okvire (digital overlay
     ili fizički štampati i okačiti u prostoru za snimanje)
  3. Postaviti na centralni zid biblioteke u nizu (po v4/v5 kompoziciji),
     kamera frontalno na zid
- Četvrti portret (`reel-03b-misic-portrait.png`) je takođe AI
  placeholder — pre objave zameniti **stvarnom profesionalnom
  fotografijom adv. Milana Misića** u tamnom odelu (ista poza,
  isto osvetljenje). Pločica "Adv. Milan Misić" je već tačna.

## Kako ovo koristiti

1. **Snimanje telefonom**: koristi storyboarde kao framing referencu.
   Pokušaj da reprodukuješ položaj kamere i izvor svetla.
2. **Higgsfield generacija**: koristi `../../../prompts/*.txt` fajlove.
   Storyboardi su tu samo da vidiš ka čemu idemo.
3. **Klijent/saradnik preview**: ako trebaš da nekome pokažeš "evo
   ovako će izgledati" pre nego što potrošiš dan na snimanje — ovi
   PNG-ovi su to.

## Izvor

Generisano preko Canva MCP (your_story = 9:16). Kandidati su
selektovani kroz 2 prolaza zbog Canva tendencije da ubaci marketing
overlay (lažne notifikacije, "free consultation" CTA-eve, poster
headline-ove) koji ne pripadaju Kubrick registru.
