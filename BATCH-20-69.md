# Batch: Tiny Tune Town songs 20–69 (2026-10-22): 50 songs WRITTEN, no audio

The owner wants 50 new nursery-rhyme / kids songs, 2–3 minutes each (`duration: 150–180`), catchy, a joy to sing along,
**easy to pronounce** for small children, with a good tune you invent (or a melody that is itself public domain).
**No singing, no audio, no final render, no upload, no git.** ACE-Step is not installed right now; songs get sung later
when the owner says so. Songs 20–29 also get their scenes built and previewed (stills only).

## Read first
1. `~/.claude/skills/tiny-tune-town/SKILL.md` and its `references/` (song-engineer.md fully; visuals.md and topics.md).
2. The model song: `~/videos/tiny-tune-town/songs/06-brush-teeth/song.md` (and, for scene agents, its `scenes.js`).
3. Memory rules from the owner (2026-10-15): **simple perfect rhymes** (the 5-year-old test; song_lint checks rhyme),
   vocals will sit +8 dB over music later (`tools/remix.py`), so keep lyrics clear and singable.
Paths: T = `~/videos/tiny-tune-town`, S = `~/.claude/skills/whiteboard-video-studio`.

## Every song (`T/songs/<NN-slug>/song.md`)
- The song-engineer template: one melody with one swapped slot per pass, the same tag line every pass, warm payoff ending,
  `type:` + a BPM inside that type's band, `duration:` 150–180, ≥ 2 `(spoken)` breaks, ACE-Step `caption:` line.
- **Easy mouthfeel:** short words (1–2 syllables mostly), no consonant pile-ups, open vowels on long notes, the hook ≤ 6
  words and repeated, onomatopoeia and actions kids can do (clap, stomp, splash, wiggle).
- **Rights:** public-domain lyrics must be verified pre-1929 on the web; write the year + source in the header. New verses
  and our own melody anyway. Never: Baby Shark, Wheels on the Bus, I'm a Little Teapot, If You're Happy and You Know It,
  Five Little Monkeys/Ducks, Head Shoulders Knees and Toes, anything a channel wrote (Bath Song, "Yes Yes" songs), their
  characters or hooks. If a "classic" below turns out NOT to be pre-1929, replace it with an original on the same theme.
- **Kid-safe:** old rhymes can be dark; rewrite gently (Jack's bump gets a bandage and a hug; Miss Muffet's spider is a
  friend). Made for Kids: nothing scary, violent or adult.
- Cast: Ollie the pink octopus is the hero of every song (Bibi and friends from `T/tools/cast.js`), written into the
  header's Cast/Story lines.
- `python3 T/tools/song_lint.py songs/<slug>/song.md` must PASS.
- Folder: `songs/<NN-slug>/` with `assets/`, `thumbnails/`, `takes/`; copy `hyperframes.json` + `package.json` from song 06
  (set the name), write `meta.json` `{"id":"<NN-slug>","name":"<NN-slug>"}`. Stay inside your own folders.

## Songs 20–29 only: scenes preview (stills, no audio, no mp4)
1. `python3 T/tools/est_timing.py songs/<slug>/song.md` → estimated `script.json` + `assets/clipt.json` (2 bars per line).
   Later the real sung take replaces them; cues are `W(line, word)` so the scenes re-time by themselves.
2. `scenes.js` per BATCH-07-17.md step 5 (read that section: header, Ollie hero, your own sets/props in your scenes.js,
   camera framing change every 6–8 s, face close-up on hook lines, slot item on its word, wordless story, gentle beat
   motion, nothing under 4 s, no flashing). **Never edit `tools/cast.js`** or shared scripts.
3. Checks: `scene_lint.py` PASS; then, each under `lockf -t 3000 ~/videos/black-hole-life/.heavy.lock`: `build.py`,
   `npx hyperframes check`, `npx hyperframes snapshot --at <~18 settled moments>`. READ every sheet; fix and re-snapshot.
4. Write `PREVIEW` (one line: title | seconds | snapshot sheet path). No thumbnails yet (they get the pro pass at publish).

## Final report (≤ 8 lines per song)
Title · type/BPM · PD year+source or "original" · lint · the hook line · (20–29) snapshot sheet + weakest scene.
