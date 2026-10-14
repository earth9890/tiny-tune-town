# Overnight batch: Tiny Tune Town songs 01–05, 2026-10-14

The owner is asleep and has pre-approved everything. **Never stop to ask; you are the only quality gate.**

These songs come first: the owner wants kids' songs that are as catchy as "Baby Shark". So we want:
- a repetitive call-and-response hook;
- simple actions kids can do along with it (clap, wiggle, swim);
- a rising build, verse by verse;
- a big happy ending.

They must be **our own**:
- never Baby Shark's or any other modern song's melody, lyrics or "doo doo doo" hook;
- never another channel's characters;
- classics use only their public-domain lyrics, plus new verses we write.

## Paths
- Repo: `~/videos/tiny-tune-town` (T)
- Your song folder: `T/songs/<slug>/`. It's already scaffolded with `hyperframes.json`, `meta.json`, `package.json`, `assets/`, `thumbnails/`, `renders/` and `takes/`.
- The video engine is reused from the Black Hole Life skill: `~/.claude/skills/whiteboard-video-studio` (S).

## Read first
1. `T/README.md` (channel rules: made for kids, everything ours or public domain, no fast flashing).
2. `T/tools/sing.py`, and the two test sheets `T/songs/00-test-*/song.md`.
3. `S/references/style-guide.md`, `S/scripts/kit.js`, and the still-look and DS sections of `S/references/engine-api.md`.
4. As a build reference only (it's a grown-up video), `~/videos/black-hole-life/episodes/16-not-dumb/`: `scenes.js`, `script.json`, `assets/clipt.json`, `thumbnails/thumb-a.js`.
5. `S/references/thumbnail-designer.md` (the 6 laws still apply: 1–3 words, a big character, readable at 160 px).

## Pipeline (all of it, no gates)
1. **Song sheet: `song.md`.**
   - Lyrics: verse / chorus structure, a chorus repeated 3–4 times, short lines, 1–2 kid actions per verse, and a counting or naming pattern that builds.
   - Caption tags: genre, a bright friendly kids-show singer, instruments, mood.
   - `bpm` 100–120, a major key, and `duration: 110` (aim for 100–120 s).
2. **Sing it** (heavy, so it goes under the lock below):
   ```
   cd T && lockf -t 540 ~/videos/black-hole-life/.heavy.lock ~/.local/bin/uv run --frozen --project ~/tools/ACE-Step-1.5 python T/tools/sing.py songs/<slug>/song.md --seed 7
   ```
   It runs DiT-only, about 4–6 min for 110 s. If it runs out of memory or the lock times out, retry, and only then drop `duration` to 90.
   - **Listen with whisper** (`whisper-cli -m ~/.cache/hyperframes/whisper/models/ggml-small.en.bin`, on a 16 kHz mono copy; use `-oj` for segment times).
   - Lyrics must be intelligible and in order, with no gibberish verses and no long instrumental gap in the middle. If they aren't, try another `--seed` (at most 3 seeds) and keep the best.
   - Copy the best take to `assets/voice.wav`.
3. **Lyric timing.** Write `script.json` with one entry per sung lyric line: `[["line text", 0.2], ...]`. Write `assets/clipt.json` = `{"clips": [[start, end], ...], "total": <song length>}`, the same format as ep16's, aligned from the whisper segment times.
   - Then `build.py` gives you sing-along captions and `W(line, word)` cues, so each picture changes on the words.
   - Fix the alignment by hand where whisper merged or split lines. Check that every clip's start ≤ end and that the clips are in order.
4. **Scenes: `scenes.js`.**
   - `// look: still`, about 12–20 bright illustrated pictures that build progressively and match each line. When the lyric says "wiggle", the thing wiggles: gentle GSAP motion via the engine is fine.
   - Kid-friendly and cute:
     - **round, chunky shapes** built from DS tokens;
     - big friendly eyes, simple smiles;
     - a soft bright palette (sky, grass, yellow, pink);
     - one hero character with the same look in every scene.
   - Calm 0.6 s crossfades. **No flashing, no fast strobing, nothing scary.**
   - Counting songs show the numbers big, on a `DS.card`.
   - Checks:
     - `python3 S/scripts/scene_lint.py scenes.js` must PASS.
     - Run these under the lock: `python3 S/scripts/build.py .` and `npx hyperframes check` (0 errors).
     - Snapshot at scene ends −0.8 s and READ every contact sheet. Fix anything that looks wrong, floats, overlaps or is hard to read, then re-snapshot.
5. **Thumbnails.** Two of them: `thumbnails/thumb-a.js` → `a.png` and `thumb-b.js` → `b.png`.
   - The hero character big and bright, with 1–3 words.
   - Build: `python3 S/scripts/build.py . --thumb thumbnails/thumb-a.js thumbnails/a.png`.
   - Check: `thumb_check.py`, then read the grid.
6. **Package: `package.md`.**
   - `## Title options`, with the pick marked `← **pick**` (e.g. "Little Octopus Wiggle Song | Tiny Tune Town Nursery Rhymes"), plus the thumbnail pairing.
   - `## Description`: what kids do along with the song, the lyrics in full, the line "Music and vocals made with ACE-Step 1.5 (open-source AI)", the line "Original song by Tiny Tune Town" or "Traditional public-domain lyrics, new verses and music by Tiny Tune Town", hashtags (#nurseryrhymes #kidssongs #singalong). No `<` or `>`.
   - `## Tags` (8–12, ≤ 450 chars).
   - `## Audience: Made for Kids`.
   - No pinned comment: made-for-kids videos have comments off.
7. **Hand-off.**
   - **Do NOT render, upload or touch git.**
   - Write `READY` last, a one-line file: `title | thumb a or b | duration s`. It triggers the render queue.

## Heavy-command lock (16 GB Mac, several agents)
Prefix every one of these with `lockf -t 540 ~/videos/black-hole-life/.heavy.lock`:
- `sing.py`
- `whisper-cli`
- `build.py`
- `hyperframes check`
- `hyperframes snapshot`
- `thumb_check.py`

`lockf` exits 75 on timeout; just retry. Run nothing heavy outside the lock or in the background.

## Rules
- Use `trash`, never `rm`.
- Stay in your own song folder.
- Don't edit shared skill scripts or `T/tools/sing.py`. If something is broken, work around it locally and report it.

## Final report (≤ 10 lines)
- Title
- Seed used
- Duration
- Lyric intelligibility (whisper match %)
- Lints
- Weakest scene
- Anything unfixed
