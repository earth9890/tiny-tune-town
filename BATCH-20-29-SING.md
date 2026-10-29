# Batch: sing + finish songs 20–29 (2026-10-29)

The owner wants these 10 written songs made into finished videos, with audio and 4K render. **No upload, no git.**
`trash` never `rm`. Follow the skill `~/.claude/skills/tiny-tune-town` (SKILL.md, `references/song-engineer.md` §7,
`references/visuals.md`, `references/thumbnails.md`, `references/package-upload.md`). The scenes (`scenes.js`) already exist
and were previewed on estimated timings (cues are `W(line, word)`, so they re-time to the real take).
Songs 20 and 21 have scenes.js but no PREVIEW yet: check them with extra care.

## Tools on this Mac now (differs from the skill text)
- **Sing:** `ACESTEP_GENERATION_TIMEOUT=3600 ~/tools/ACE-Step-1.5/.venv/bin/python tools/sing.py songs/<slug>/song.md --seed N`
  (call the venv python directly; `uv run --project` re-syncs and fails on a Windows wheel). DiT-only turbo, ~5–8 min.
- **Listen check / timing (preferred, 2026-10-29):** `"$HOME/Library/Application Support/VoiceStudio/runtime/project/.venv/bin/python" -I tools/transcribe.py <16k mono wav> > transcript.json`
  (faster-whisper large-v3-turbo already on disk, word timings, no app needed). Fallback: VoiceStudio endpoint (app must be running):
  `curl -s -X POST http://127.0.0.1:3900/v1/audio/transcriptions -F file=@<16k mono wav> -F model=whisper-1 -F response_format=verbose_json -F 'timestamp_granularities[]=segment'`
  (if it returns no segments, try `-F 'timestamp_granularities[]=word'` and group words into lines yourself).
  Do this on the demucs vocals stem (`assets/stems/`, after remix): it transcribes much cleaner than the full mix.
- **Remix:** `~/.venvs/demucs/bin/python tools/remix.py songs/<slug>` (vocals +8 dB over music).
- Every heavy command (sing, remix, build, check, snapshot, render) runs in the FOREGROUND under
  `lockf -t 7200 ~/videos/black-hole-life/.heavy.lock <cmd>` (Bash timeout 600000; the lock waits by itself; other jobs
  share it). Never leave a heavy job in the background and go idle.

## Per song, in order 20 → 29 (finish one before starting the next)
1. Sing seed 7. Transcribe. If < ~80 % of lines sung in order, a long instrumental gap mid-song, or garbled words: try
   seed 21, then 42; keep the best (write the scores in `takes/CHOICE.md`).
2. Copy the take to `assets/voice.wav`, remix.
3. Timing: `script.json` = the lines actually SUNG, in order; `assets/clipt.json` from the transcript times (no
   `"estimated"` key). Fix merged/split lines by hand. The est_timing guard refuses to overwrite real timings: good.
4. If the sung line count differs from the estimate, fix the `W(line, word)` cues in scenes.js so each picture still
   lands on its words. scene_lint, build.py, `npx hyperframes check`, snapshot ~18 moments, READ every sheet, fix.
5. Thumbnails a.png + b.png per `references/thumbnails.md` and the pro pass
   (`~/.claude/skills/whiteboard-video-studio/references/thumbnail-pro.md`: 3 concepts, ≥ 2 critique rounds, final with
   `scripts/thumb_hires.py`), then `tools/badge.sh`.
6. `package.md` per package-upload.md. Description lyrics = the SUNG lines from script.json. Never mention AI or any tool.
7. Render: `S/scripts/finish.sh songs/<slug> none songs/<slug>/renders/<slug>-4k.mp4`, then
   `python3 S/scripts/blank_scan.py` on it (0 blank stretches). Touch `RENDERED`.
Write one line per song to `BATCH-20-29-SING.log`: slug | seed | lines sung/planned | seconds | render path | weakest point.

## Final report (≤ 6 lines per song)
Seed chosen + coverage, length, remix dB, sheets reviewed, thumbnail pick, anything the owner should listen to.
