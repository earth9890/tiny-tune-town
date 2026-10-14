# Song engineer: how a Tiny Tune Town song is built

Numbers come from `research/cocomelon.md` §6–7: tempo and key measured on 9 top singles, repetition and words per minute from transcripts. Our 5 launch songs failed almost every one of these (see the end of this file).

## 1. The formula: "one melody, one slot"
- **The verse is the chorus.** One short melody (4 lines, 8–16 bars) repeats **4–6 times**. Each pass swaps **one word or phrase** (the slot): colour, animal, body part, food, weather, vehicle part.
- **Every pass ends on the same tag line.** That line is the hook, and it lands every 15–20 s.
- **Public-domain classics** can repeat the classic verse **word for word 4–5 times** while the *picture story* changes each time (lose → look → find → hug). Repetition is a feature: kids predict, sing and shout along.
- **Bookend.** The last pass returns to pass 1's slot, adds the warm payoff line ("I love you", "all clean!", "four friends home") and the kids' choir joins.
- **Teaching layer** (pick one): counting 1–5 or 1–10, colours, animal sounds, body parts, opposites, a daily routine.

## 2. Lines and words
- Lines of **4–8 words**, each sung over 2 bars (about 4–5 s).
- Inside a line, things repeat in **threes**: "scrub, scrub, scrub", "round and round, round and round".
- Built-in **sound words** kids can shout: beep, splash, quack, pop, swish, yum. The picture shows the sound on the same beat.
- Simple vocabulary, present tense, "we" and "you" ("let's", "can you?").
- **Targets** (checked by `tools/song_lint.py`):
  - ≤ **75 sung words a minute** over the whole video (CoComelon: 53–77; our launch songs: 64–122);
  - ≥ **50 % repeated lines** (CoComelon: 40–80 %; ours: 19–45 %);
  - ≤ 20 % of lines outside 3–8 words.

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

## 5. Voice
- **Lead:** one warm, bright, clear young **female** kids-show singer, close and clean, little vibrato, friendly rather than shouty. The energy comes from sound effects and giggles, not from the singer.
- A **small kids' choir** on the final pass only.
- **Spoken one-word reactions** in the breaks ("Wow!", "Yay!", "Uh-oh!", "Mmm!").

## 6. `song.md` template (ACE-Step 1.5)
```
# NN: <Song Name> (<traditional, public domain (year, source) — new verses and music by Tiny Tune Town | original song by Tiny Tune Town>)
# Cast: Ollie + <friend>. Slot each pass: <colour / animal / body part / food>.
# Story (visual only): <lose → look → find → hug>. Teaching: <count 1-5 / colours / sounds>. Actions: <one per pass>.
caption: <cheerful children's nursery sing-along | bouncy action song for kids | gentle bedtime lullaby>, warm clear young female kids-show lead singer, very clear diction, little vibrato, small happy kids choir on the last chorus, <2-4 instruments from §4>, simple repetitive sing-along melody, short instrumental breaks between verses, major key, <happy, sunny, playful | sweet, cozy, dreamy>, clean bright mix
type: <action | routine | story | bedtime>
bpm: <in the band>
key: <C|D|F|G|A> Major
time: 4
duration: 170
## Lyrics
[intro]
(Ooh!)

[verse]
<line 1: slot word + sound x3>
<line 2: sound x3, sound x3>
<line 3: repeat line 1>
<line 4: TAG LINE, identical every pass>

[instrumental break]
(Wow!)

[verse]
...slot 2... (then break, slot 3, break, slot 4)

[chorus]
<slot 1 again + the warm payoff line>

[outro]
(Bye-bye!)
```
`sing.py` reads `caption bpm key time duration` (it ignores `type`); the caption may be up to 512 characters.

## 7. Singing with ACE-Step (what we learned)
- It runs **DiT-only** (turbo model, 8 steps, `shift 3.0`); the 1.7B planner LM runs the 16 GB Mac out of memory. Expect about 4–6 min per 110 s, and more for 170 s.
- `--seed N` is honoured. Try **up to 3 seeds** (for example 7, 21, 42) and keep the best one.
- **It drops, merges or repeats lines,** especially long or wordy lines, and on any song longer than its pattern. Short, repetitive lines get sung reliably; this is one more reason for the one-slot formula.
- **Listen check:**
  1. Make a 16 kHz mono copy and run whisper with `-oj`.
  2. Compare it with the lyrics. Fewer than about 80 % of lines sung in order, or a long instrumental gap in the middle, means trying another seed.
  3. Listen yourself before calling a song done. Whisper can't hear melody, timing or a weird voice.
- Copy the chosen take to `assets/voice.wav`.
- **Timing:**
  1. Write `script.json` with one entry per **sung** line, in order: `[["line", 0.2], ...]`.
  2. Write `assets/clipt.json`: `{"clips":[[s,e],...],"total":<song length>}`, taken from whisper's segment times.
  3. Fix merged or split lines by hand; every clip needs start ≤ end, in order.
  4. Then `build.py` gives karaoke captions plus `W(line, word)` cues for the pictures.
- **Loudness:** `finish.sh` masters to about −14 LUFS.

## 8. Hooks that work for kids *and* parents
- **Kids:** a slot they can predict ("what colour next?"), a sound to shout, an action to copy, peek-a-boo surprises, big faces, animals, vehicles, giggles.
- **Parents:** a real daily-routine payoff (bath, teeth, food, sleep), lyrics they can sing off-screen (full lyrics in the description), warm family moments, gentle pacing they can tolerate on repeat, a light joke in the visuals (Ollie uses all 8 arms at once).

## 9. Launch songs vs the formula (lint, 2026-10-14)
All 5 failed: no `type`, 110 s, 64–122 words a minute, 27–45 % repetition, and no breaks. Before making a v2 of any of them, rewrite it to the one-slot template. Old MacDonald and Row Your Boat are the closest; Octopus and Bubble Hands are the furthest.
