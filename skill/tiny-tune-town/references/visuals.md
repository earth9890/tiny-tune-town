# Visuals: calm, rich, alive

**Look:** the still look from the whiteboard studio (`// look: still`, `kit.js` DS tokens, `scene_lint.py`). Read S/`references/style-guide.md` first; this file adds the kids-channel rules.

**Why our launch videos looked weak** next to the big channels (contact sheets, 2026-10-14):
- Each song was **one static wide shot for 110 s**.
- Characters filled only about 25 % of the frame height, so faces were tiny.
- There was no story, and every song had a different hero.

The big channels feel rich because the camera keeps changing *size*: a wide set-up, a reaction close-up, then an insert of the prop. Their faces are huge, and a little story plays out. We take all of that **without** their 2.5 s hard cuts.

## 1. The cast (`T/tools/cast.js`)
| Character | Role | Status |
|---|---|---|
| **Ollie**, a pink octopus with big eyes and 8 arms | Hero of every video, logo, thumbnails. The running visual joke: he uses all 8 arms at once (brushing 8 teeth, holding 8 snacks, waving 8 hellos) | in `cast.js`: `ollie(S, cx, groundY, k, {mouth: "open"|"grin", look})` with `.wiggle .raise .bob .hop .spin .scale .sing .grin`, `.holdAt(A, y)` (aims an arm so its tip sits beside the face at height y, for holding things to the mouth), `.tipNow(A, ext)` (where a raised arm's tip is), `.at([x,y])`, `.face` |
| fish, crab, star, turtle | Sea friends, guests | in `cast.js` |
| **Bibi** (pink bunny, yellow bow) | Best friend for land, home and routine songs | in `cast.js`: `bibi(S, x, headY, {k, mood: "joy", paws: [[lx,ly],[rx,ry]]})` with `.g .L .R` (arm groups, rotate about `.sh` to wave) |
| Bathroom set | sink scenes (teeth, hands, bath) | `DS.room(S, BATH_ROOM)`, `bathWall`, `bathSink` (draw it **after** Ollie so he stands behind the counter), `tapWater`, `foam` |
| Props | | `toothbrush(S, x0, y0, x1, y1, {c, parent})` |
| Grown-ups | Kind, present parent figure (for routine songs) | to design once, then add to `cast.js` |
Rules:
- New characters are added to `cast.js` (never redefined per song), with the same build in every scene and thumbnail.
- **Never give two characters the same name.** "Pip" was a bunny in 02 and a kid in 05.
- Ollie can live on land too: a fish-bowl helmet, a bathtub, a puddle, or just waddling. Keep him in every song.

## 2. Camera plan: a framing change every 6–8 s, never a hard cut
Write a **shot list** before any code: one row per 6–8 s, with the framing and what changes.
| Shot | Framing | How |
|---|---|---|
| **Wide** | the whole set; start of each pass | new scene, 0.6 s crossfade |
| **Medium** | hero plus prop or friend, about 60 % height | `S.zoom(x, y, 1.4–1.6, t, 1.2)` |
| **Close-up** | **hero's face fills 40–60 % of the height** | `S.zoom(...O.at([0, -330]), 2.2–2.6, t, 1.2)` |
| **Insert** | the prop, the number or the sound word | zoom on the prop, or a `DS.card` number |
| Back | return to wide | `S.zoom(960, 540, 1, t, 1.2)` |

- **Push in to Ollie's face on every tag line (the hook).** He sings it (`O.sing`), eyes to camera. That's the moment kids sing back.
- **Go back to wide** at the start of each new pass; the slot item enters (fade or pop) on its word.
- **Rhythm:** 8–10 framing changes a minute. **No shot under 4 s.** Moves take 1–1.5 s with `power2.inOut`, never snaps. Scene changes use the engine's 0.6 s crossfade.
- **Gentle life during holds:** `O.bob`, `.wiggle` on the beat (`BEAT = 60 / bpm` after the include), bubbles rising, blinking, the slot item bouncing on its sound word. Something always moves softly; nothing flashes.

## 3. The wordless story (the hook for repeat viewing)
- The lyric stays the same; **the picture story moves**: problem → try → try → fix → hug or celebrate.
- Tell it through the passes and the instrumental breaks.
- Examples:
  - Humpty: friends bandage, glue and hug him "together again".
  - Teeth: Ollie scrubs 8 teeth with 8 brushes, then one sparkly smile.
  - Lullaby: each friend falls asleep one by one, then the moon.
- The set-up happens in the 8–10 s wordless intro; the payoff lands on the final pass.

## 4. Composition and drawing
- Characters **big**: 50–70 % of the frame height in medium shots. Big round heads, huge eyes with catch-lights, open smiling or "oh!" mouths, blush.
- Sunny, saturated, never dark. Night scenes have bright faces on deep blue.
- Use DS depth planes (far, mid, near), soft shadows, light from one side, and a vignette (S/style-guide).
- The slot item gets one bright accent colour and enters **on its word**.
- **Numbers and counting:** big numerals on a `DS.card`, one per count, on the beat.
- **Captions** (from `build.py`, sing-along karaoke): one line, bottom band, never over faces. Keep faces above y 940; the caption band (y > 980) holds only floor or foreground.

## 5. Safety and calm (non-negotiable)
- No hard cuts, no shot under 4 s, no flashing or strobing, no rapid zoom pumps, no scary faces, no dangerous acts (kids copy what they see).
- Bath and water scenes always include a grown-up nearby.

## 6. QA before render
- [ ] `scene_lint.py` passes; `build.py` and `npx hyperframes check` report 0 errors.
- [ ] The shot list covers every 6–8 s; every tag line has a face close-up.
- [ ] Snapshots at each shot's end −0.8 s (`npx hyperframes snapshot`, as in S/SKILL.md). READ every frame: nothing floating, faces never cut by the frame edge in close-ups, no labels over faces, the right cast build, readable numbers.
- [ ] Mid-crossfade frames: no half-built characters (the engine's still fix shows bodies 0.65 s early).
- [ ] Watch the full render once at 1× with sound; picture changes land on their words.

## 7. Engine notes
- `S.zoom(x, y, k, t, dur, ease)` pushes the content layer onto (x, y); `k = 1` returns. It is seek-safe and stacks with the scene's slow drift (`cam: "push"`; use `cam: "none"` when you drive zooms yourself).
- `// @include ../../tools/cast.js` must come **right after** `// look: still` (the look line has to be in the first 300 characters). Thumbnails live one folder deeper: `../../../tools/cast.js`.
- Reference builds:
  - **`songs/06-brush-teeth/scenes.js` is the model for new songs**: shared cast, one scene per pass with wide → mid → face close-up zooms, the prop count growing each pass, cards that fade before close-ups.
  - `songs/01-little-octopus/scenes.js` (counting cards).
- **`S.zoom` scales around the point and does not centre it.** Keep the hero near screen centre and zoom around the face. Cards and props near the frame edge get cropped in close-ups, so fade them out first.
