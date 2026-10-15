# Song engineer: how a Tiny Tune Town song is built

Numbers come from `research/cocomelon.md` §6–7: tempo and key measured on 9 top singles, repetition and words per minute from transcripts. Our 5 launch songs failed almost every one of these (see the end of this file).

## 1. The formula: "one melody, one slot"
- **The verse is the chorus.** One short melody (4 lines, 8–16 bars) repeats **4–6 times**. Each pass swaps **one word or phrase** (the slot): colour, animal, body part, food, weather, vehicle part.
- **Every pass ends on the same tag line.** That line is the hook, and it lands every 15–20 s.
- **Public-domain classics** can repeat the classic verse **word for word 4–5 times** while the *picture story* changes each time (lose → look → find → hug). Repetition is a feature: kids predict, sing and shout along.
- **Bookend.** The last pass returns to pass 1's slot, adds the warm payoff line ("I love you", "all clean!", "four friends home") and the kids' choir joins.
- **Teaching layer** (pick one): counting 1–5 or 1–10, colours, animal sounds, body parts, opposites, a daily routine.

## 2. Words and rhymes: the 5-year-old test
Owner feedback (2026-10-15): our songs "do not rhyme at all" and are "over complicated". Lint of songs 01–17: **95 of 122 verses (78 %) fail a rhyme check**, and every song has at least one (e.g. scrub / round / scrub / shine). Real nursery rhymes almost always rhyme: of the 683 in `T/research/rhymes/`, the most common 4-line shapes are ABCB and AABB, at 4–7 syllables per line. **If a 5-year-old couldn't make it up, it's too clever.**

**Rules** (the first four are checked by `tools/song_lint.py`):
1. **Every verse rhymes.** Use AABB (couplets) or ABCB (lines 2 and 4 rhyme). The rhyme sits on the **last word of the line**.
2. **Perfect rhymes only**, ideally one syllable: cat/hat, star/far, bed/head, sun/fun, bite/right, peas/please, moon/spoon, tree/three, boat/coat, wall/fall. Near rhymes don't count: round/down, fun/some, time/line, home/alone, bath/laugh. Check a pair with `python3 tools/rhymes.py rhyme moon spoon`. The same word twice is not a rhyme.
3. **Short lines: 4–6 syllables, never more than 8.** "Twinkle, twinkle, little star" is 7; "Brush them clean with me" is 5.
4. **Lots of repetition:** the same tag line every pass, and repeated words ("one, two, three", "splash, splash, splash").
5. **Words a 3-year-old says**: body parts, animals, food, colours, numbers 1–10, mum, dad, bed, bath, ball, sun, moon, up, down, big, little, hot, cold. Present tense; "I", "we" and "you".
6. **No clever stuff.** No wordplay, puns, metaphors, inner rhymes doing the work, or adult jokes in the lyrics (the gags go in the pictures). No words a parent would have to explain ("dental", "nutritious", "adventure").
7. **One idea per line, and the line says what the picture shows** ("Brush the top teeth", not "Morning sparkle time").
8. **Call and response** (structure only, never another channel's words): the singer asks, the kids or Ollie answer: "Where is Ollie?" "Here I am!" "Can you try it?" "Yes, I can!" The answer is short, rhymes and repeats every pass.
9. **Sound words and actions at the end of the line**, where kids join in (Hanen and Wolf Trap advice for toddlers: put the key word last).
10. **Public-domain classics:** keep the original's rhyme words. When adding verses, swap the slot word and keep the rhyme ("Baa, baa, *white* sheep, have you any wool? / Yes sir, yes sir, three bags full!"). A classic's own near rhyme can be allowed in the header: `rhyme-ok: dame/lane`.

**Bad (what we shipped):**
```
Brush the top teeth, scrub scrub scrub      ends: scrub / round / scrub / shine: nothing rhymes
Swish swish swish, round and round
Brush the top teeth, scrub scrub scrub
Brush brush, sparkle and shine!

Here's a little broccoli, munch munch munch     10 syllables, and munch / hmm / munch / mmm don't rhyme
I'm not so sure, hmm hmm hmm

Teeth so bright they light the night,           clever inner rhyme, "dental" is not a toddler word
a dental delight!
```
**Good (same topics, rewritten):**
```
Brush the top teeth, one, two, three     ABCB-style couplets: three/me, go/hello
Brush them clean with me
Up and down and round we go
Sparkly teeth, hello!

Here's a carrot, crunch, crunch, crunch   AABB: crunch/lunch, bite/right
Carrots for my lunch
Will you try it? Just one bite!
Mmm! It tastes just right!

Little duck, little duck                 ABCB: sun/fun
Swimming in the sun
Quack, quack, quack!
Swimming is fun!

The moon is up, the stars are bright     AABB, bedtime: bright/tight, bed/head
Night-night, sleep tight
Time to go to bed
Pillow for my head
```
**Writing order:** pick the slot → pick **two easy rhyme pairs** first (`python3 tools/rhymes.py pairs food`, or think cat/hat) → write the lines backwards from the rhyme words → read it aloud and clap: one clap per syllable, 4–6 claps a line → run the lint.

**Numbers** (also checked by the lint):
- ≤ **75 sung words a minute** over the whole video (CoComelon: 53–77; our launch songs: 64–122);
- ≥ **50 % repeated lines** (CoComelon: 40–80 %; ours: 19–45 %);
- ≤ 20 % of lines outside 3–8 words, and ≤ 20 % of lines over 8 syllables.

## 3. Shape of a 150–180 s song
| Time | Part | In `song.md` |
|---|---|---|
| 0–4 s | Brand sting: a sung "Tiny Tune Town!" plus a whoosh, the same every video | Add in the edit from `brand/sting.wav` once made (from `songs/00-test-jingle`), or `[intro]` |
| 4–14 s | Wordless story set-up: music only, one spoken "Ooh!" or "Huh?" | `[intro]` + `(Ooh!)` |
| ~14 s | First pass | `[verse]` |
| between passes | **2–4 s instrumental break** with one spoken word ("Wow!", "Who's next?", a giggle). The story beat happens here | `[instrumental break]` + `(Wow!)` |
| last pass | Back to slot 1, warm payoff line, kids' choir | `[chorus]` |
| last 15–20 s | Outro: "Bye-bye!", giggle, instrumental tag, end card | `[outro]` + `(Bye-bye!)` |

Lines in `(parentheses)` are spoken or stage notes. The lint doesn't count them as sung words. ACE-Step may or may not voice them; the visuals still play the beat.

## 4. Tempo, key and feel by song type
Put `type:` in the `song.md` header; the lint checks the band.
| `type:` | BPM | Feel and instruments |
|---|---|---|
| `action` (dance, wiggle, vehicles, animals) | **115–124** | bouncy; ukulele, claps, glockenspiel, light bass, small drums |
| `routine` / `story` (bath, teeth, food, tidy-up, boo-boo, classic story rhymes) | **92–100** | warm and steady; marimba, ukulele, soft claps, acoustic bass |
| `bedtime` (lullaby, goodnight, Twinkle) | **70–80** | music box, celesta, soft strings, no claps or drums, dreamy |
Always a **major key** (C, D, F, G, A). Spread the tempos across the catalogue: we launched with everything at 108–120 BPM, which made every song feel alike.

## 5. Voice and mix
- **Lead:** one bright, clear, high young **female** kids-show singer, close and upfront, little vibrato, friendly rather than shouty. The energy comes from sound effects and giggles, not from the singer.
- **Pitch:** the melody should sit where preschoolers sing: about D4–B4 (294–494 Hz), centred on F4–G4. Measured on songs 02, 06, 13 and 16: the singer's median was 372–392 Hz (F♯4–G4), which is already right. Keys D, E or F major keep it there.
- **Mix: the vocals must sit 6–9 dB above the music.** Measured on the launch songs (demucs stems, 2026-10-15): the vocals were −2.5 to +2 dB versus the music. They were buried, which the owner heard as words that were "really really low". ACE-Step mixes its own vocals, and the caption can't fix that: in an A/B test (same lyrics, seed 7, 45 s), the old caption gave −2.3 dB and the new "clear upfront vocals, quiet soft backing" caption gave −4.4 dB, with the pitch the same (363 vs 372 Hz). So **always run `tools/remix.py`** after choosing a take (§7). The new caption stays because it does no harm.
- A **small kids' choir** on the final pass only.
- **Spoken one-word reactions** in the breaks ("Wow!", "Yay!", "Uh-oh!", "Mmm!").

## 6. `song.md` template (ACE-Step 1.5)
```
# NN: <Song Name> (<traditional, public domain (year, source) — new verses and music by Tiny Tune Town | original song by Tiny Tune Town>)
# Cast: Ollie + <friend>. Slot each pass: <colour / animal / body part / food>.
# Story (visual only): <lose → look → find → hug>. Teaching: <count 1-5 / colours / sounds>. Actions: <one per pass>.
# Rhymes: <the rhyme pairs, e.g. three/me, go/hello>.
caption: bright high-pitched cheerful young female children's TV singer, clear upfront lead vocals, very clear diction, little vibrato, small happy kids choir on the last chorus, quiet soft backing of <2-4 instruments from §4>, <cheerful nursery sing-along | bouncy action song | gentle bedtime lullaby>, simple repetitive sing-along melody, short instrumental breaks between verses, major key, <happy, sunny, playful | sweet, cozy, dreamy>, vocals loud and clear on top of the music
type: <action | routine | story | bedtime>
bpm: <in the band>
key: <C|D|F|G|A> Major
time: 4
duration: 170
## Lyrics
[intro]
(Ooh!)

[verse]
<line 1: slot word + count or sound x3, 4-7 syllables>      e.g. Brush the top teeth, one, two, three
<line 2: rhymes with line 1, 4-6 syllables>                  e.g. Brush them clean with me
<line 3: the same every pass>                                e.g. Up and down and round we go
<line 4: TAG LINE, rhymes with line 3, same every pass>      e.g. Sparkly teeth, hello!

[instrumental break]
(Wow!)

[verse]
...slot 2... (then break, slot 3, break, slot 4)

[chorus]
<4 lines, AABB: slot 1 again + the warm payoff line, e.g. Eight arms brushing, one, two, three / Brushing teeth with you and me>

[outro]
(Bye-bye!)
```
`sing.py` reads `caption bpm key time duration` (it ignores `type` and `rhyme-ok`); the caption may be up to 512 characters. For a public-domain classic, add `rhyme-ok: dame/lane` to the header for the original's own near rhymes.

## 7. Singing with ACE-Step (what we learned)
- It runs **DiT-only** (turbo model, 8 steps, `shift 3.0`); the 1.7B planner LM runs the 16 GB Mac out of memory. Expect about 4–6 min per 110 s, and more for 170 s.
- `--seed N` is honoured. Try **up to 3 seeds** (for example 7, 21, 42) and keep the best one.
- **It drops, merges or repeats lines,** especially long or wordy lines, and on any song longer than its pattern. Short, repetitive lines get sung reliably; this is one more reason for the one-slot formula.
- **Listen check:**
  1. Make a 16 kHz mono copy and run whisper with `-oj`.
  2. Compare it with the lyrics. Fewer than about 80 % of lines sung in order, or a long instrumental gap in the middle, means trying another seed.
  3. Listen yourself before calling a song done. Whisper can't hear melody, timing or a weird voice.
- Copy the chosen take to `assets/voice.wav`.
- **Remix (always):** `lockf -t 3000 ~/videos/black-hole-life/.heavy.lock ~/.venvs/demucs/bin/python tools/remix.py songs/<slug>`
  1. demucs splits the take into vocals and music (cached in `assets/stems/`);
  2. the vocals get a presence EQ (cut 300 Hz mud, +3 dB at 3 kHz, air above 8 kHz);
  3. the music is turned down until the vocals sit 8 dB on top (`--over 6..9`);
  4. the mix is normalised to −14 LUFS. It rewrites `assets/voice.wav` and keeps the raw take as `takes/voice-premix.wav`.
  It prints the before/after vocal-over-music in dB. About 1 min per song. Do this before timing (the timing doesn't change).
- **Timing:**
  1. Write `script.json` with one entry per **sung** line, in order: `[["line", 0.2], ...]`.
  2. Write `assets/clipt.json`: `{"clips":[[s,e],...],"total":<song length>}`, taken from whisper's segment times.
  3. Fix merged or split lines by hand; every clip needs start ≤ end, in order.
  4. Then `build.py` gives karaoke captions plus `W(line, word)` cues for the pictures.
- **Loudness:** `remix.py` and `finish.sh` both master to about −14 to −15 LUFS. All 17 launch renders measure −13.8 to −14.9 LUFS, so the overall level was never the problem; the balance inside the mix was.

## 8. Hooks that work for kids *and* parents
- **Kids:** a slot they can predict ("what colour next?"), a sound to shout, an action to copy, peek-a-boo surprises, big faces, animals, vehicles, giggles.
- **Parents:** a real daily-routine payoff (bath, teeth, food, sleep), lyrics they can sing off-screen (full lyrics in the description), warm family moments, gentle pacing they can tolerate on repeat, a light joke in the visuals (Ollie uses all 8 arms at once).

## 9. Launch songs vs the formula (lint, 2026-10-14)
All 5 failed: no `type`, 110 s, 64–122 words a minute, 27–45 % repetition, and no breaks. Before making a v2 of any of them, rewrite it to the one-slot template. Old MacDonald and Row Your Boat are the closest; Octopus and Bubble Hands are the furthest.

## 10. Owner feedback, 2026-10-15
"The music is loud … the words are really really low" and "the jingles … do not rhyme at all; keep it simple and stupid, like a 5-year-old is creating rhymes."
- **Measured:** the vocals were −2.5 to +2 dB versus the music (buried); the singer's pitch was fine (median G4). **Fix:** `tools/remix.py` after every sing (+8 dB). The caption alone did not change the balance (§5).
- **Rhymes:** §2 rewritten; the lint now fails verses that don't rhyme and lines over 8 syllables. Songs 01–17 all fail the rhyme check (95 of 122 verses; Twinkle and Humpty fail only 1 each). Rewrite before any v2.
- Rhyme library for ideas and structure: `T/research/rhymes/README.md` (683 public-domain rhymes, `tools/rhymes.py`).
