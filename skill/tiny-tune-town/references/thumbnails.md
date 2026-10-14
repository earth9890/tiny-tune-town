# Thumbnails

From the CoComelon study (28 thumbnails, `T/research/cocomelon/thumbs/`) plus the whiteboard studio's thumbnail laws (S/`references/thumbnail-designer.md`: readable at 160 px, one idea, a big character).

## Formula
- **1280×720**, a sunny saturated background, simple and slightly soft so the face pops. Never dark.
- **Ollie's face fills 40–50 % of the height,** placed on the **right ~40 %** of the frame. Huge eyes with catch-lights, looking at the viewer; an open smile or a surprised "oh!".
- **The song's prop or guest sits beside the face**, left-centre: the star, the cow, the toothbrush, the boat, the egg.
- **Text: none or one word.** Toddlers can't read and parents read the title. If used, 1 word (or `1-2-3!`), big yellow with a dark outline, top-left, never over the face.
- **The brand badge sits bottom-left** on every thumbnail, the same size and place: `tools/badge.sh thumbnails/a.png` (it keeps `a.nobadge.png`). Keep the bottom-left 380×170 px clear of faces and props.
- **Compilations:** a round "30 min" badge top-right.
- **A/B (Test & Compare):** A = one word + prop; B = the same scene with **no text**, or a parent or friend added.

## Build
```
python3 S/scripts/build.py songs/<slug> --thumb thumbnails/thumb-a.js thumbnails/a.png
tools/badge.sh songs/<slug>/thumbnails/a.png
python3 S/scripts/thumb_check.py songs/<slug>/thumbnails/a.png      # then READ the *_grid.jpg feed test
```
- `thumb-a.js` starts with `// look: still` and then `// @include ../../../tools/cast.js` (one folder deeper than scenes).
- Scale Ollie with k ≈ 2.0–2.4 so the head is huge (see `songs/01-little-octopus/thumbnails/thumb-a.js`).

## Checklist
- [ ] Face 40–50 % of the height, eyes to camera, readable at 160 px (grid test).
- [ ] Exactly one prop that *is* the song.
- [ ] ≤ 1 word; nothing over the face; the badge isn't covering anything.
- [ ] The same cast build as the video.
- [ ] Under 2 MB PNG.
