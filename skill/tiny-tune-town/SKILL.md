---
name: tiny-tune-town
description: End-to-end workflow for the Tiny Tune Town kids' channel (@TinyTuneTownSings): picking nursery-rhyme / routine-song topics, writing and engineering catchy sing-along songs (one-slot repetition, tempo bands, hooks, spoken breaks), singing them locally with ACE-Step 1.5, building calm illustrated sing-along videos with the recurring cast (Ollie the octopus and friends), thumbnails with the brand badge, Made-for-Kids packaging and YouTube upload. Use whenever the user wants a kids' song, nursery rhyme, jingle, toddler video, "Baby Shark"-style song, or anything for Tiny Tune Town.
---

# Tiny Tune Town

Repo: `~/videos/tiny-tune-town` (T). Video engine: the still look from `~/.claude/skills/whiteboard-video-studio` (S): `build.py`, `engine2.js`, `kit.js`, `scene_lint.py`, `finish.sh`.
Evidence: `T/research/cocomelon.md`, a study of the world's biggest kids' channel (1,348 videos measured, 2026-10-14). **We learn the formula, never copy the content.**

**Pipeline:** Topic → `song.md` (passes `song_lint`, rhymes included) → Sing (ACE-Step) → Listen and check → **Remix (vocals +8 dB on top)** → Timing → Scenes (cast + camera plan) → QA → Thumbnails (badge) → Package → Render 4K → Upload (owner OK).

## Reference map
| Step | Read |
|---|---|
| What to make next (routine songs, public-domain classics, versions, compilations, what to avoid) | `references/topics.md` |
| **Writing and engineering the song** (one-slot formula, **simple perfect rhymes (the 5-year-old test)**, tempo bands, repetition, breaks, voice pitch and mix, ACE-Step caption recipe, seeds, remix) | `references/song-engineer.md` |
| **Nursery-rhyme library**: 683 public-domain rhymes (Mother Goose 1833–1916, Halliwell 1842) with schemes, rhyme pairs, tags, actions; search with `tools/rhymes.py` | `T/research/rhymes/README.md` |
| **Visuals** (cast, camera plan every 6–8 s, face close-ups on hooks, wordless story, captions, calm-pacing rules, QA) | `references/visuals.md` |
| Thumbnails (giant face, prop, badge, ≤ 1 word) | `references/thumbnails.md` |
| Title, description, tags, upload settings, cadence, compilations | `references/package-upload.md` |
| Raw numbers and sources | `T/research/cocomelon.md`, thumbs in `T/research/cocomelon/thumbs/` |

## Hard rules
1. **Original or public domain only.** Public-domain lyrics must be verified pre-1929 (write the year in `song.md`). Melodies and arrangements are always new (ACE-Step). Never use another channel's lyrics, tunes, characters, naming ("Yes Yes"), look or thumbnails. Never Baby Shark (in copyright) or Wheels on the Bus (status unverified).
2. **Made for Kids, always.** No scary, violent or adult themes. Kind, present parents and friends.
3. **Calm visuals are our edge.** No hard cuts, no flashing, no shot under 4 s; 0.6 s crossfades. Parents' main complaint about the big channels is overstimulation, and preschoolers learn less from fast cuts.
4. **Every song passes `python3 T/tools/song_lint.py songs/<slug>/song.md`** before singing. It checks the tempo band for the song type, major key, 150–180 s, ≤ 75 sung words/min, ≥ 50 % repeated lines, 3–8 words per line, ≥ 2 breaks with spoken words, **every verse rhymes (AABB or ABCB, perfect rhymes)** and lines of ≤ 8 syllables. Lyrics a 5-year-old could make up: simple words, short lines, no wordplay.
5. **One cast.** Ollie the pink octopus (logo, hero) plus friends from `T/tools/cast.js`, included in every `scenes.js` and thumbnail with `// @include ../../tools/cast.js`. Don't invent a new hero per song. Never reuse a name for a different character (the old "Pip" problem).
6. **Lyrics on YouTube = what was actually sung.** ACE-Step drops or repeats lines. Write the description lyrics from the final `script.json` (the sung lines), not from `song.md`, and proof-read them.
7. **Heavy commands one at a time** on the 16 GB Mac (ACE-Step, whisper, Chrome builds, renders). In batches, wrap each in `lockf -t 540 ~/videos/black-hole-life/.heavy.lock <cmd>`.
8. **Publishing needs the owner's explicit OK in chat** (the permission classifier blocks it otherwise; ask with AskUserQuestion). Pinned comments are n/a (comments are off on Made-for-Kids videos).
9. Use `trash`, never `rm`. Don't commit or push without approval.

## Per-song folder (`T/songs/NN-slug/`)
`song.md` · `takes/` (ACE-Step wavs) · `assets/voice.wav` (chosen take) · `script.json` (sung lines) · `assets/clipt.json` (line times) · `scenes.js` · `thumbnails/thumb-a.js`, `thumb-b.js` · `package.md` · `renders/NN-slug-4k.mp4`.
Scaffold by copying `hyperframes.json`, `meta.json` and `package.json` from an existing song.

## Commands
```
cd ~/videos/tiny-tune-town
python3 tools/song_lint.py songs/<slug>/song.md                                  # must PASS
~/.local/bin/uv run --frozen --project ~/tools/ACE-Step-1.5 python tools/sing.py songs/<slug>/song.md --seed 7   # ~5-8 min for 170 s
# listen check: 16 kHz mono copy -> whisper-cli -m ~/.cache/hyperframes/whisper/models/ggml-small.en.bin -oj
lockf -t 3000 ~/videos/black-hole-life/.heavy.lock ~/.venvs/demucs/bin/python tools/remix.py songs/<slug>   # vocals 8 dB over the music, -14 LUFS (keeps takes/voice-premix.wav)
python3 tools/rhymes.py tag animals --safe                                      # PD rhyme library: also show <title>, word <w>, pairs [tag]
python3 tools/rhymes.py rhyme moon spoon                                         # perfect rhyme? (same check as the lint)
python3 S/scripts/scene_lint.py songs/<slug>/scenes.js && python3 S/scripts/build.py songs/<slug> && (cd songs/<slug> && npx hyperframes check)
python3 S/scripts/build.py songs/<slug> --thumb thumbnails/thumb-a.js thumbnails/a.png && tools/badge.sh songs/<slug>/thumbnails/a.png
S/scripts/finish.sh songs/<slug> none ~/videos/tiny-tune-town/songs/<slug>/renders/<slug>-4k.mp4   # 4K render; the OUT path must be absolute (a relative one lands inside the song folder)
```
Brand files: `T/brand/` (`avatar.png` 800², `banner.jpg` 2560×1440, `badge.png`, sources `avatar.js`, `banner.js`).
Channel: Tiny Tune Town, `UCXhTeJrWZsvgJioIpbaKg0A`, https://www.youtube.com/@TinyTuneTownSings.
