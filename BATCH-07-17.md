# Batch: Tiny Tune Town songs 07–17 (2026-10-14)

One agent per song, each in a fresh context. The owner wants every song to be **the best one yet**. **Never stop to ask; you are the only quality gate.**

## Read first, in this order
1. `~/.claude/skills/tiny-tune-town/SKILL.md` and **all** of its `references/`:
   - `song-engineer.md`
   - `visuals.md`
   - `thumbnails.md`
   - `package-upload.md`
   - `topics.md`
2. **The model build to match:** `~/videos/tiny-tune-town/songs/06-brush-teeth/`. Read `song.md`, `scenes.js`, `thumbnails/thumb-a.js`, `package.md`, `script.json` and `assets/clipt.json`.
3. `~/videos/tiny-tune-town/tools/cast.js`: Ollie, Bibi, the sea and bathroom sets, `toothbrush`, `popIn`, `swing`, `foam`, `bubble`, `sparkle`.
4. `~/videos/tiny-tune-town/research/cocomelon.md` §6–§10.

Paths: the repo T = `~/videos/tiny-tune-town`; the engine S = `~/.claude/skills/whiteboard-video-studio`.

## Your folder
Create `T/songs/<NN-slug>/` with `assets/`, `thumbnails/`, `renders/` and `takes/`.
- Copy `hyperframes.json` and `package.json` from song 06 and set the name in `package.json`.
- Write `meta.json` as `{"id":"<NN-slug>","name":"<NN-slug>"}`.
- **Stay inside your own folder.**

## Pipeline (all of it, no gates)
1. **Song** (`song.md`, using the song-engineer template):
   - One melody with one swapped slot, the same tag line on every pass, and a warm payoff ending.
   - Choose `type:` and a BPM in that type's band, `duration: 170`, and `(spoken)` breaks.
   - Public-domain songs: verify the text is pre-1929 on the web and write the year and source in the header. Original songs are ours alone.
   - `python3 T/tools/song_lint.py songs/<slug>/song.md` must PASS.
2. **Sing** with ACE-Step. It is heavy and takes about 10 minutes, so run it **in the background**:
   ```
   cd ~/videos/tiny-tune-town && lockf -t 3000 ~/videos/black-hole-life/.heavy.lock ~/.local/bin/uv run --frozen --project ~/tools/ACE-Step-1.5 python tools/sing.py songs/<slug>/song.md --seed 7 > songs/<slug>/sing-7.log 2>&1
   ```
   - Start it with Bash `run_in_background: true`.
   - While it runs, design your scenes and thumbnail. Then wait with the **Monitor** tool, using an until-loop on `songs/<slug>/takes/take-7-1.wav`.
   - **Never end your turn while waiting**: you'd go idle and stall.
3. **Listen check:**
   - Make a 16 kHz mono copy, then run `whisper-cli -m ~/.cache/hyperframes/whisper/models/ggml-small.en.bin -oj` under the lock: `lockf -t 3000 ~/videos/black-hole-life/.heavy.lock whisper-cli ...`.
   - At least 80 % of the lines must be sung in order, with no gibberish verse and no long dead gap.
   - Otherwise sing again with `--seed 21`, then `--seed 42` (3 seeds at most). Keep the best take and copy it to `assets/voice.wav`.
4. **Timing:** write `script.json` (the lines actually **sung**, in order) and `assets/clipt.json` from the whisper segment times, exactly as song 06 did. Check every start ≤ end and that the clips are in order.
5. **Scenes** (`scenes.js`):
   - Start with `// look: still`, then `// @include ../../tools/cast.js`, then `BEAT = 60 / <bpm>;`.
   - **Ollie is the hero of every video.** Bibi can be the friend. New sets, props or friends go in **your own scenes.js**. **Never edit `tools/cast.js`** or the shared skill scripts: 11 agents run at once.
   - Ollie can be on land: build the set your song needs (park, kitchen, bedroom, garden, farm…) from DS tokens, as rich and cosy as the 06 bathroom.
   - Follow `visuals.md`:
     - a camera framing change every 6–8 s (wide → mid → face close-up, with `S.zoom` around the face; keep Ollie near the centre);
     - a face close-up on every hook line;
     - the slot item appears on its word;
     - a wordless story across the passes;
     - gentle motion on the beat;
     - nothing under 4 s, no flashing, faces clear of foam and props;
     - word cards that fade out before close-ups.
   - Checks: `python3 S/scripts/scene_lint.py scenes.js` must PASS. Then run, **each under the lock**:
     - `python3 S/scripts/build.py songs/<slug>`
     - `npx hyperframes check` (0 errors)
     - `npx hyperframes snapshot --at <about 18 times: each shot's settled moment>`
   - **READ every contact sheet.** Fix eyes covered, cropped cards, floating or overlapping props, characters cut by the frame, and wrong-looking props. Re-snapshot until clean.
6. **Thumbnails:**
   - `thumb-a.js`: Ollie's huge face, 40–50 % of the height, on the right; the song's prop; one word.
   - `thumb-b.js`: the same with no text.
   - `../../../tools/cast.js` is the include path from `thumbnails/`.
   - Build both under the lock, then run `T/tools/badge.sh` on both.
   - Run `~/.venvs/pocket/bin/python S/scripts/thumb_check.py thumbnails/a.png` and READ `a_grid.jpg`.
7. **Package** (`package.md`), in song 06's format:
   - Title options with `← **pick**` (≤ 70 characters, ending ` | Tiny Tune Town Nursery Rhymes & Kids Songs`).
   - The description, with the **sung** lyrics from `script.json`.
   - Tags.
   - `## Audience: Made for Kids`.
   - **Never mention AI, ACE-Step or AI voices anywhere** (owner rule). No `<` or `>`.
8. **Hand-off:** do NOT render, upload or touch git. Write `READY` **last**: one line, `title | thumb a | duration s`. The render queue picks it up.

## Heavy-command lock (16 GB Mac, 11 agents)
Prefix **every** one of these with `lockf -t 3000 ~/videos/black-hole-life/.heavy.lock`:
- `sing.py`
- `whisper-cli`
- `build.py` (with and without `--thumb`)
- `npx hyperframes check`
- `npx hyperframes snapshot`
- `thumb_check.py`

`lockf` exits 75 on timeout; just retry. Commands that wait on the lock for minutes go in the background (Bash `run_in_background`) and you watch with Monitor; foreground Bash dies at 10 minutes. Plain file edits and the lints are fine without the lock. Use `trash`, never `rm`.

## Final report (your last message, ≤ 10 lines)
- Title
- Seed used
- Whisper match %
- Duration
- Lints
- The best moment
- The weakest scene
- Anything unfixed
