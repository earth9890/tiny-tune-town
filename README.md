# Tiny Tune Town

A kids' nursery-rhyme channel: about 2-minute sing-along videos with catchy, memorable songs, bright friendly visuals, and lyrics on screen.

## What we make
- **Classics in our own arrangement.** Public-domain rhymes such as Twinkle Twinkle, Old MacDonald and Baa Baa Black Sheep, with new music, new visuals and new verses.
- **Originals.** New songs with our own recurring characters.

## Rules
1. **Everything is ours or free to use.**
   - Lyrics: public domain or written by us.
   - Music: generated locally with ACE-Step 1.5 (code and weights MIT, commercial use OK) or composed by us.
   - No samples, no famous melodies still in copyright, no copying another channel's characters.
2. **Kid-safe.**
   - No scary, violent or adult themes.
   - Slow, clear visuals with no rapid flashing.
   - Upload as **Made for Kids** (COPPA).
3. **Quality over quantity.** YouTube demonetizes mass-produced, repetitive content, so every video gets a real story, original verses and careful visuals.

## Pipeline
**The full workflow is the `tiny-tune-town` skill** (`~/.claude/skills/tiny-tune-town/`): topics, song engineering, visuals, thumbnails, package and upload. It is built on the CoComelon study in `research/cocomelon.md`. Tools: `tools/sing.py`, `tools/song_lint.py`, `tools/cast.js` (the shared cast), `tools/badge.sh`. Brand art: `brand/`.

### Original draft
1. **Song sheet:** `songs/<slug>/song.md` holds the lyrics (verse, chorus, verse), the style tags, the BPM and the characters.
2. **Music + vocals:** ACE-Step 1.5 sings the lyrics. The best take is chosen by ear. The timestamps come back as LRC.
3. **Visuals:** HyperFrames, using the bright kids' look, karaoke lyrics on the beat and one character per verse.
4. **Render:** 4K. The YouTube package is set to Made for Kids.

## Status
- [ ] ACE-Step test song (20 s) approved by the owner
- [ ] First full song: Twinkle Twinkle Little Star (Tiny Tune Town version)
