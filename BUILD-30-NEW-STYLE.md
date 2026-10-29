# Build song 30 "This Old Man" in the NEW soft style (2026-10-29)

Owner picked style "A + D" (style-lab/index.html): it is already live in `tools/cast.js` (toon(), toonBack/toonFill,
toyFx(), LN()). Every new drawing in this song must follow it:
- One closed outline per creature/prop in a darker shade of ITS OWN colour (`toon(S, d, name, o)`), never black ink lines
  for characters; no stick/straight-line limbs (use `tube(...)` or `cap(...)` shapes through `toon`).
- Limbs that join a body: `toonBack` the body first, draw limbs with `toon`, then `toonFill` the body on top.
- `toyFx(group)` on every character group (white sticker edge + soft shadow). Gloss highlights on round bodies.
- Reuse the cast (Ollie, Bibi, fish, crab, star, turtle). New characters/props get the same treatment.
Reference frames: style-lab/ad-frame-54s.png. Old style = black outlines: never reintroduce.

Pipeline: follow BATCH-20-29-SING.md (tools, sing command, VoiceStudio transcription, remix, lockf heavy lock, one song)
plus the tiny-tune-town skill for scenes (references/visuals.md: camera plan every 6–8 s, close-ups on hooks, calm,
no hard cuts, 0.6 s crossfades, counting numbers on screen 1..10). This song has NO scenes.js yet: write it from scratch,
cues as W(line, word) against the real take. Snapshot every shot at start+0.35 s and end−0.8 s; READ every sheet.
Thumbnails a/b in the new style (pro pass, badge). package.md (sung lyrics, never mention AI/tools).
Render 4K: `S/scripts/finish.sh songs/30-this-old-man none /Users/harish/videos/tiny-tune-town/songs/30-this-old-man/renders/30-this-old-man-4k.mp4`
(ABSOLUTE output path), blank_scan 0, touch RENDERED. No upload, no git. `trash` never `rm`.
Report: seed + coverage, length, weak points to listen to, thumbnail pick, path.
