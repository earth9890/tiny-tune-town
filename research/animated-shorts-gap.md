# Gap report: what Tiny Tune Town can learn from the animated-shorts study (2026-11-04)

Source: `~/videos/.ref/claude-animated-shorts/` (a three.js + Remotion "2D characters in a 3D world" story-short skill
and its private reference study: STYLE_BIBLE.md, reports/*.md, templates/bridge/*.ts, templates/audio/*, templates/scripts/*).
**Private study.** We take the METHOD and numbers, never their characters, stories or frames. Nothing from there is published.

Our constraints win over theirs:
- Made for Kids.
- Calm is our edge: no hard cuts, no flashes (their white flash after the hook is out), no shot under 4 s, 0.6 s crossfades.
- One cast: Ollie and friends, same names. Their deadpan adults are not our cast. We keep big eyes, catch-lights and blush; they drop all three.
- The song is the music: ACE-Step vocals, remixed +8 dB. Audio work is about clarity, gentle SFX and loudness, not a score.

Everything adopted is **opt-in**: `TOON = 2;` after the cast include. `TOON = 1` (the default) rebuilds the published songs
pixel-identically: 4 stills of song 76, old vs new `cast.js`, max pixel difference 0.

## 0. Summary

| Area | They do | We did | Adopt? | Status |
|---|---|---|---|---|
| Outline | plum ink, **thick-thin**: 1 + 0.45·cos(θ − θthick), thick side away from the light (≈64°, bottom-right), ratio ~3 | uniform outline, own colour (`LN`), 4× near width | **yes**, softer (ratio ~2) | `TOON 2`: offset copy under each shape, top-left 0.8× width |
| Shading | soft crescent on the far side (flat to 0.6 R, falls to 0.88× by 0.8 R), cool/lavender shadow tint, torso gradient to 0.6× | diagonal linear gradient (`DS.vol`) | **yes** | `TOON 2`: radial gradient, lit top-left, flat middle, cool crescent |
| Head shape | superellipse bean, asymmetry, tilt, per-character seed | circles | no (ours are toys, round reads cuter) | could add a 3° tilt via `sway` |
| Face library | 14 expressions, lidded deadpan default, no blush/catch-lights | smile / open / grin (+ Bibi joy) | partly: keep ours, add blinks | blinks done; more mouths = owner question |
| Blinks | every 0.5–2.3 s, 4 frames, a blink hides every expression swap | none | **yes**, calmer gaps 2–4.5 s, 0.13 s | `TOON 2`: `blinks()` on Ollie, Bibi, puppy, fish, crab, star, turtle, kids |
| Walk / dance | bob 3–7 % of height, lean 1–7° in phase with the bob, planted feet, drawing on ones | `bob` (translate only), `wiggle`, `hop` | **yes** | `O.groove(t0, t1, amp, deg)`: bob + lean over 4 beats |
| Contact shadow | tight blob ~0.5 under feet | `DS.shadow` already | have it | — |
| Depth of field | thin-lens blur on ~1/3 of screen time; 12–16 px on CUs, 10–12 MS, 0 on wides; focus on the eyes | none | **yes**, gentler | `dof(S, bgGroup, t, px, dur)`: eases with the push-in (MS 4–6 px, CU 8–10) |
| Foreground framing | near prop covering 10–25 % of a frame edge in ~1/3 of MS/CU, blurred | none | **yes**, sparingly | `fgFrame(S, x, gy, k, o)`: blurred leaf fan + flower, slow sway |
| Aerial haze | fog = horizon colour, far town pulled 20–40 % to the horizon | `DS.depth` haze (far 45 %, mid 18 %) | have it | — |
| Light / grade | warm key, cool violet shade, lifted coloured blacks, vignette ~0.86 corners, day median luma ~.57 | flat sky light, vignette 0.1 | **yes**, light touch | `grade(S, sun)`: warm soft-light glow from the sun side, faint cool far corner |
| Camera | 80 % holds, every hold creeps (0.15–0.35 %/f), smootherstep glides 18–40 f, kicks, 4° rolls, cuts on big jumps | zooms 1.2–1.6 s `power2.inOut`, scenes often `cam: "none"` | creep **yes**; kicks, rolls, cuts **no** | use `cam: "push"` with `S.zoom` (stacks); no new code |
| Event-timed SFX | cue table on the picture clock, SFX −6 dB under the voice, ambience beds | none | **yes**, gentle | `tools/sfx.py` + per-song `sfx.json` (clap, pop, chime, quack; beat snap) |
| Loudness | own BS.1770 meter, −15 LUFS, TP −1.2 dBTP, LRA 2.6 | remix −14, then `finish.sh` re-norms to −15 | ok as is | `calm_qa.py` reports I / TP / LRA |
| Per-frame QA | every frame: black, white, frozen, pops; per-shot luma/sat; 2 s contact sheets | snapshots at shot ends | **yes**, calm version | `tools/calm_qa.py`: cuts, flashes (WCAG size/step), black/white, still spans, loudness |
| Look-match loop | measure the reference → numbers per topic → sandboxes, one owner per file → merge → blind verifier scores /10 | owner picks from a style lab | **yes** for the next look pass | §7 |

## 1. Characters and outlines

**Theirs** (characters.md, outlines.md, toon.ts `Pen.inkRing`, `shadedFill`):
- Plum ink #241726, not black. The width follows `w(θ) = w0 (1 + 0.45 cos(θ − θthick))`. That makes it about 3× thicker on the bottom/shadow side than on top, which is what makes a flat card feel drawn and weighty.
- Soft crescent shading on heads and torsos, never a hard cel step; the shadow tint is cool (white heads ×(0.92, 0.90, 0.96)).
- Faces stay bright (luma ≥ 0.85) whatever the scene light.

**Ours:** our soft toon look (A + D, 2026-10-29) already uses own-colour outlines, one merged silhouette, a sticker edge, gloss and a twinkle. We were missing weight and roundness: the outline is uniform and the diagonal gradient reads as a flat sticker.

**Adopted** (`cast.js`, `TOON = 2`):
- `thick()`: an offset copy of every toon shape, in the outline colour, under the shape, shifted (0.22 w, 0.36 w) toward the bottom-right. The top-left keeps a thin 0.8× line and the bottom-right gets ~2×. We stay softer than their 3× ratio because toddler art reads better with lighter line weight contrast.
  - Works with `paint-order: stroke` and the merged-silhouette trick, so arms still grow out of the body.
- `VOL()`: radial crescent gradient (cx .36, cy .30, r .80). Stops: light tone at 0, base at .42–.70, then the dark tone mixed 14 % toward violet #5a58c8 at 1. That gives a lit top-left, a flat middle and a cool crescent bottom-right, the study's shading in SVG.
- `blinks()`: lids in the character's own colour with a closed-eye curve, shut 0.13 s (4 frames at 30 fps, their measured length). Gaps are 2–4.5 s, seeded so every build is identical. That is slower than their 0.5–2.3 s: calm, and toddler characters blink less in the big channels. Skipped on already-closed "joy" eyes.
- `O.groove(t0, t1, amp, deg)`: their walk rule (bob + lean in phase) as a dance. It bobs every 2 beats and leans ±deg over 4 beats, using a new `sway` group (identity in `TOON 1`).

**Not adopted:**
- Bean heads, stick limbs, no blush, no catch-lights, deadpan lids. These are their adult-comedy identity; ours is a round toy cast.
- Expression swaps hidden by a blink: worth adding when Ollie gets more expressions (open question 2).

## 2. World depth, lighting, grade, lens blur

**Theirs:**
- DOF on 1/3 of screen time, focused on the eyes, with wides sharp.
- Foreground props frame 10–25 % of an edge in ~1/3 of MS/CU.
- Fog = horizon colour, and bloom only on real emitters.
- Two-tone light: warm key, violet-blue shade (never brown, never grey), lifted coloured blacks, a vignette.

**Ours:** `DS.depth` far/mid/near haze plus a 0.1 vignette. Backgrounds are as sharp as Ollie, so close-ups look flat and busy behind the face.

**Adopted:**
- `dof(S, layer, t, px, dur)`: tweens a Gaussian blur on the background group with the camera move, and back to 0 on the return to wide. Faces and the cast are never inside the blurred group. Values for TTT: medium 4–6 px, face close-up 8–10, wides 0.
- `fgFrame(S, x, gy, k, o)`: a big out-of-focus leaf fan plus one flower at a frame corner, with a 7 px blur and a slow 6 s sway. Use it on wides and hook shots, never over a face or the caption band.
- `grade(S, sun)`: a screen-space warm soft-light glow centred on the scene's sun, plus a 12 % cool tint in the far bottom corner. Call it after `DS.vignette`. It warms the lit side and cools the shade side without darkening faces.
- Not adopted: bloom (no emitters; also a flash risk), golden-hour backlight (an option for lullabies later), film grain (they turned it off too).

## 3. Camera plan (within the calm rules)

**Theirs:**
- 80 % of frames hold, but every hold creeps (0.15–0.35 %/frame push).
- Moves are smootherstep glides of 18–40 frames.
- Impacts get 7-frame flip-sign kicks, with 4–5° rolls on emphasis and hard cuts on big jumps.

**Ours:** a framing change every 6–8 s, moves 1.2–1.6 s with `power2.inOut`, 0.6 s crossfades. Many songs set `cam: "none"`, so holds are dead still.

**Adopt:**
- The creep: use `cam: "push"` (the engine's 1 → 1.03 scene drift) together with `S.zoom`. They stack, and no new code is needed. It is ~0.06 %/frame, a quarter of theirs, which is right for calm.
- Pair every push-in with `dof` and every return to wide with `dof(..., 0)`.
- Foreground framing in ~1/3 of wides.
- **Not adopted:** kicks, rolls, whip pans, hard cuts, their 0.6–1.3 s glides. Ours stay 1.2–2.5 s.

## 4. Audio

**Theirs** (templates/audio):
- An event table on the picture clock (timeline.py mirrors story.ts), with every cue synthesized (sfx_gen.py) and placed with a level relative to the voice (−6 dB).
- The music is ducked by −3 dB under speech, with per-section rides.
- Own BS.1770 meter and limiter: −15 LUFS, TP −1.2 dBTP.
- A cue sheet (cues.md) documents every event.

**Ours:**
- The sung take is the music; `remix.py` lifts the vocals +8 dB over the music stem, normalises to −14 LUFS, TP −1.5.
- `finish.sh none` re-normalises to −15 LUFS into `mix.wav`.
- No SFX.

**Adopted:**
- `tools/sfx.py` + per-song `sfx.json`: soft synthesized claps, pops, chimes and quacks.
  - Events come one at a time or on a beat grid, with `snap` fitting the grid to the song's own beat from onset energy.
  - Default peaks are −20 to −24 dBFS, well under the lead. Per-hit level varies ±0.7 dB and per-hit noise is fresh, so claps don't sound looped.
  - It writes `assets/voice.wav` from a backup (`takes/voice-presfx.wav`), so re-runs never stack, and keeps the peak ≤ −1 dBFS.
- Use it on clap-along breaks, card pop-ins (the pop lands on the same word the card appears on), Five Little Ducks quacks, and a chime on the final sparkle.
- **Not adopted:** ducking and rides (the song is one stem), ambience beds (they muddy the vocal), whooshes on camera moves (overstimulating).

## 5. QA

**Theirs:**
- `short_qa.py` scans every frame for black, white, frozen and pop frames, plus loudness and silences, and writes per-shot luma/sat and 2 s contact sheets.
- Side-by-sides go to a blind verifier who scores each area out of 10.

**Ours:** snapshots at shot ends (−0.8 s), `scene_lint`, `hyperframes check`, one 1× watch.

**Adopted:** `tools/calm_qa.py <video>` checks every frame:
- HARD CUT: a 1-frame jump > 6× the local median.
- FLASH: ≥ 25 % of the frame changes luma ≥ 0.10 within 2 frames (WCAG general-flash size and step). We allow 0.
- BLACK / WHITE frames.
- STILL: spans > 3 s with no motion.
- Loudness: I / TP / LRA.
- Exit 1 on failure; `--selftest` included.

It is the objective check for rule 3, and catches what snapshots can't: dropped frames, a one-frame pop, a crossfade that became a cut.

## 6. What the trial showed (style-lab/upgrade-76, song 76 at 8–33 s)

See `style-lab/index.html` → "TOON 2 trial". Stills are in `style-lab/toon2/`; the clip is `style-lab/upgrade-76/renders/`.

**Render cost.** The full set is measured on 2 s renders of the same range (28–30 s, a close-up with a dof push), all at 1080p.
- Run back to back under one lock hold: TOON 1 158 s, TOON 2 without grade 195 s, TOON 2 full 183 s.
- Run separately: TOON 2 without dof 204 s, with dof 209 s.

So TOON 2 is about 1.2x TOON 1, inside the 1.3x target. Live dof and the soft-light grade are both lost in the noise. The extra time is the doubled outline paths (`thick()`).
- The first 25 s trial render was killed after 17 min, because the machine was overloaded (load average 15–21 from parallel agents). It was not the look.
- A cached-raster blur was considered and dropped. It needs an async render-ready hook, and the moving clouds would freeze in the blurred copy.

## 7. Reports-style references (the method worth copying)

1. **Measure, don't describe.** One topic per agent (characters, outlines, lighting, depth, grade, motion, textures). Each writes numbers from many frames (e.g. "outline thick/thin 2.9–3.5", "blinks every 0.5–2.3 s") to `research/<topic>.md`, with the same measurement on our frames and the gap stated plainly. For us: CoComelon / big-channel frames in `research/cocomelon/` → `research/look/<topic>.md`.
2. **Sandboxes, one owner per file:** `cast.js` (characters), a scene copy (camera), audio. Each owner edits only their file and renders stills, and the lead merges.
3. **Blind verifier.** A fresh agent gets side-by-side sheets (ours vs reference) and scores colour, characters, depth and composition /10, with a numbered fix list mapped to file owners.
4. **Contracts as named exports** (`TOON`, `dof`, `grade`, `BEAT`), so the owners don't collide.
5. **Readability traps list** (their swing that read as a hanging): keep our own list in `references/visuals.md` QA (e.g. "cast at the screen edges got clipped").

## 8. Open questions for the owner

1. TOON 2 is the look for new songs (lead decision 2026-11-04, owner asleep). Does the owner approve, after seeing the trial clip? Published songs stay as rendered (`TOON = 1` default).
2. More expressions for Ollie (sleepy, surprised "oh!", giggle squint) with a blink hiding each swap?
3. SFX taste: are claps and pops welcome on every song, or only clap-along / animal songs?
4. DOF strength: keep it gentle (CU 8–10 px), or closer to the study (12–16 px)?
5. Render cost is about 1.2x TOON 1 (§6). OK for 3-minute 4K songs?

No engine change was needed: everything lives in `T/tools/cast.js`, `calm_qa.py` and `sfx.py`. The shared engine (`S/`) was not touched.
