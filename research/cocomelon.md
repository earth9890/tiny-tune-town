# CoComelon playbook for Tiny Tune Town

Channel `UCbCmjCuTUZos6Inko4u57UQ` is **CoComelon - Nursery Rhymes (@CoComelon)**.
Research date: 2026-10-14.

**Method.** I pulled metadata for 1,348 of the 1,357 public videos with yt-dlp. I then took a closer look at 9 top singles:
- downloaded them at 360p;
- counted scene cuts with ffmpeg (`scene>0.3`);
- estimated tempo and key with librosa (the same estimator read our own mixes within ±3 BPM, though keys can be off by a fifth);
- transcribed them with whisper.cpp (transcripts kept in scratch only and not reproduced here).

I also looked at the thumbnails of the top 20 and the 8 best recent videos (`research/cocomelon/thumbs/`), and read press coverage (sources at the bottom).

> **Rule:** we learn the *formula* only. No CoComelon lyrics, melodies, characters (JJ, Cody, Cece…), the "Yes Yes" naming, the watermelon look, or the thumbnails. Everything we make stays original or public domain.

---

## 1. Channel overview

| Metric | Value |
|---|---|
| Subscribers | **203 M** (3rd largest on YouTube) |
| Public videos | 1,357 |
| Total views of fetched videos | **214.5 B** |
| Owner | Founded 2006 by Jay Jeon as "checkgate" → ABCkidTV (2013) → CoComelon (2018). Treasure Studio (~20 staff) sold to Moonbug 2020; Moonbug sold to Candle Media 2021 (~$3 B). |
| Cadence (last 12 months) | **159 uploads ≈ 3 per week**, almost always **Tue / Thu / Sat** (53 / 52 / 50) |
| Category | Education 908, Entertainment 434 |
| Audience | Ages 2–5 (Moonbug). Nielsen: kids watched each episode about 3x per quarter. |

**Top 20 by views**

| # | Title (brand suffix removed) | Views | Length | Uploaded |
|---|---|---|---|---|
| 1 | Wheels on the Bus | 9.58 B | 3:49 | 2018-05-24 |
| 2 | Bath Song | 7.67 B | 2:52 | 2018-05-02 |
| 3 | Baa Baa Black Sheep | 4.99 B | 2:45 | 2018-06-25 |
| 4 | Baby Shark | 4.71 B | 2:24 | 2017-11-21 |
| 5 | Yes Yes Vegetables Song | 3.48 B | 4:07 | 2018-08-10 |
| 6 | Yes Yes Playground Song | 3.39 B | 4:07 | 2018-10-23 |
| 7 | Peek A Boo | 3.15 B | 2:05 | 2018-01-10 |
| 8 | Old MacDonald | 2.48 B | 2:49 | 2018-04-18 |
| 9 | Sick Song | 2.11 B | 2:35 | 2018-07-20 |
| 10 | Twinkle Twinkle Little Star | 2.00 B | 3:16 | 2017-12-06 |
| 11 | Wheels on the Bus (Play Version) | 1.95 B | 3:48 | 2018-11-20 |
| 12 | Deck the Halls | 1.92 B | 2:53 | 2018-12-11 |
| 13 | Wheels on the Bus + More (compilation) | 1.87 B | 32:56 | 2018-06-28 |
| 14 | Yes Yes Bedtime Song | 1.86 B | 4:03 | 2018-09-18 |
| 15 | Beach Song + More (compilation) | 1.83 B | 34:08 | 2019-08-02 |
| 16 | "No No" Bedtime Song | 1.83 B | 7:45 | 2017-07-12 |
| 17 | Balloon Boat Race | 1.82 B | 3:29 | 2018-03-13 |
| 18 | The Tortoise and the Hare | 1.75 B | 3:58 | 2018-07-13 |
| 19 | Bingo | 1.73 B | 3:01 | 2018-02-21 |
| 20 | ABC Song (13 songs, old ABCkidTV) | 1.72 B | 50:51 | 2014-05-01 |

**What this shows**
- The top 20 fall into two groups:
  - **11 are routine or "life moment" songs**: bath, vegetables, playground, peek-a-boo, sick, bedtime, swimming.
  - **9 are public-domain classics.**
- Almost all date from 2017–2018. These are evergreen videos that the algorithm keeps serving.
- New videos earn far less. The median upload got 506 M views in 2018, 16 M in 2023, 5.5 M in 2025 and 3.6 M in 2026. The back catalogue does the earning.

## 2. Durations

Views by length, all 1,348 videos:

| Length | Videos | Median views | Share of all views |
|---|---|---|---|
| < 2 min | 88 | 28 M | 2 % |
| **2–4 min** | **549** | **48 M** | **59 %** |
| 4–8 min | 186 | 10 M | 12 % |
| 8–20 min | 16 | 57 M | 1 % |
| **20–45 min (compilations)** | **327** | **58 M** | **22 %** |
| 45–75 min | 166 | 15 M | 4 % |
| 75 min + | 16 | 4 M | 0 % |

- **Singles:** the sweet spot is **2:30–3:50**. Of the top 100 videos, 61 run 2–4 minutes. The top-10 singles have a median length of about **2:50**.
- **Compilations:** the sweet spot is **30–35 minutes**, about 11–13 songs.
  - YouTube chapters list every song. The median chapter is 2:45.
  - The lead song (the biggest single) goes first and in the title.
  - Very long mixes (45 min and up) do worse.
- **2026 shift:** the channel now mostly uploads **4–8 minute "song + song" doubles**. In the last 12 months these made up 77 of 159 uploads, with a median of 3.3 M views. Examples: "The Tortoise and the Hare + Three Little Pigs!", "Bingo Had a Farm! Bingo + Old MacDonald". The top three recent uploads run 6:18, 6:17 and 2:43. Long compilations nearly stopped (4 in 2026).
- **Anatomy of a single,** from cut and transcript timestamps (repeated on all 9 videos):
  - 0–6 s: logo sting with kids shouting the brand name.
  - About 9 s: the first cut.
  - Singing starts **14–27 s** in, after a short wordless story setup with giggles and "huh?", "wow!".
  - The song ends about 30 s before the video does. The tail is playful music, giggles and the logo end card.

## 3. Titles

- **Form:** `Song Name | CoComelon Nursery Rhymes & Kids Songs`.
  - 653 titles end exactly in "CoComelon Nursery Rhymes & Kids Songs", and most of the others use a variant.
  - Median title length: 69 characters overall, 60 in the top 20.
- **Pipes:** 718 titles have one `|`, 110 have two (`Song | Story hook | Brand`), 524 have none.
  - The second slot holds a story hook, for example "Humpty Dumpty Grocery Store" or "Wheels on the Bus (Recycling Truck Version)".
- **Compilations:** `Lead Song + More Nursery Rhymes & Kids Songs - CoComelon`. 107 of 109 top compilations use "+ More".
- **Most common words** (after the brand words): song, more, JJ (102), dance, little, learn, wheels, ABCs, bus, animal, time, version, party, baby, bath, five, Cody, school, twinkle, Christmas, Halloween.
- **Character names:** used more over time ("…with JJ and Bella!", "Cooking with JJ & Cody"). The top 20 titles have none; the classic song name is the keyword.
- **Emoji:** 166 titles, almost all from 2025–26 (⭐ 😴 🎂 🛁 🐮). Typically 1–2 per title, right after the song name. Older hits have none.
- **Variants:** popular songs get many versions: "(Play Version)", "(Recycling Truck Version)", "Halloween", "2", "Penguin Version". Finger Family alone has about 20.

## 4. Thumbnails (28 viewed)

The formula is very consistent:
- **No title text at all.** The only text is the logo. Toddlers can't read.
- **The logo badge** (watermelon face + wordmark) sits in the **bottom-left, about 30 % of the height**, on every thumbnail.
- **One or two giant faces.** The hero's head fills 35–50 % of the frame height.
  - Recent videos put the baby hero on the **right ~40 %** of the frame, eyes looking at the viewer or at a prop.
  - Eyes are huge with bright catch-lights. The mouth is open in a smile or a surprised "oh".
- **A prop that is the song** sits next to the face: bus, black sheep, star, thermometer, carrot on a fork, toothbrush, a banana phone.
- **Family:** a parent face often sits behind or beside the hero (Bath, Vegetables, Peek-a-boo, Sick).
- **Colour:** saturated primaries and pastels, sunny-day blue skies, warm skin tones, never dark. Night scenes (Twinkle) still use bright faces against deep blue.
- **Compilation badge:** a red circle reading "33 min" / "34 min" in the top-right.
- **Framing:** extreme close-ups and over-the-shoulder shots, a toddler's eye-level.

## 5. Descriptions and tags

**Description order:**
1. A one- or two-sentence story hook ("Nina goes on an epic chase after losing her plastic toy egg…").
2. Recent videos add 4–6 hashtags (`#cocomelon #nurseryrhymes #kidsvideos #kidssongs #banana`).
3. "Subscribe for new videos every week!" plus a `?sub_confirmation=1` link.
4. **"Lyrics:"** with the full lyrics, including spoken bits.
5. Compilations put **chapter timestamps** first (467 videos have chapters).
6. Music-streaming links and a newsletter link.
7. "Watch our playlists:" with 3–5 playlist links.
8. Website and socials, then apps and the shop.
9. An "About CoComelon" paragraph aimed at parents ("happy and smart", "learn letters, numbers, animal sounds, colors… prosocial life lessons… teach and play with your children as they watch").
10. A copyright line.

**Tags:** median 20 per video. The same base set appears on about 98 % of videos, plus 2–5 song-specific tags:
- Base set: `nursery rhymes, children songs, kids videos, baby songs, kid songs, toddler, preschool, kids education, sing-along, sing-along songs, kids animation, kids entertainment, kindergarten` plus brand tags (`cocomelon, abckidtv, jj, coco melon`).
- Voice-assistant tags: `alexa play cocomelon`, `play cocomelon on youtube`.

## 6. Songs: the musical formula

**Tempo and key** (librosa, 9 top singles):

| Song | Estimated BPM | Key |
|---|---|---|
| Wheels on the Bus | 123 | A major |
| Wheels (Recycling Truck) | 123 | A major |
| Humpty Dumpty Grocery | 117 | F major |
| Baa Baa Black Sheep | 99 | G major |
| Bath Song | 96 | D major |
| Itsy Bitsy Spider | 96 | D major |
| Bananaphone (licensed, not theirs) | 92 | — |
| Yes Yes Vegetables | 152 read as double time, so about 76 | G major |
| Twinkle Twinkle | 161 read as double time, so about 80 | C major |

- **Everything is in a major key.** The bands are: action and vehicle songs **115–125 BPM**, routine and story songs **92–100**, lullaby-feel songs **~76–80**.
- **Our 5 songs** run 108–120 BPM, consistently fast. We have nothing slower than 108.

**Structure: "one melody, one slot".**
- The verse *is* the chorus. One short melody, 4 lines and 8–16 bars, repeats **4–10 times** with **a single word or phrase swapped**:
  - Wheels: the part of the bus and its sound (10 verses);
  - Baa Baa: the sheep's colour (4 verses);
  - Vegetables: the vegetable (5 verses);
  - Recycling truck: the truck part and its sound (8 verses).
- **The top public-domain videos repeat the same verse word for word.** Humpty Dumpty Grocery (1.5 B) and Itsy Bitsy Spider (259 M) each sing their 4-line verse **5 times unchanged**. The *visual story* changes instead: an egg-toy chase through a shop, a spider at a lemonade stand.
- **Repetition, measured** (share of lyric lines that repeat):
  - Humpty and Itsy: about 80 %. Baa Baa: 71 %. Yes Yes Vegetables: 40 %.
  - **Ours: 19–35 %.**
- **Lyric density** (sung words per minute):
  - CoComelon: Wheels 77, Baa Baa 73, Vegetables 72, Humpty about 53.
  - **Ours: Octopus 112, Old MacDonald 122, Bubble Hands 88, Row 80, Twinkle 64.** We sing 1.2–1.7 times more words, in shorter videos.
- **Lines** are 4–8 words. Each line takes 2 bars, about 4–5 seconds.
- **Inside a line** the words repeat in threes: "swish, swish, swish", "round and round, round and round".
- **Sound words** are built in: beep, vroom, wah, shh, quack. The sound effect plays on the same beat.
- **Between verses** there is a 2–10 s instrumental gap with a **spoken interjection**: "Wow!", "You see?", "Ooh!", giggles, gasps. The story beat happens in that gap.
- **Bookend:** the last verse goes back to the first ("the wheels on the bus…" again), sometimes as a key-change lift.
- **Hook:** about every 15–20 s, because every verse ends on the same tag line ("all through the town").
- **Teaching layer:** colours (Baa Baa), counting ("one, two, three, he ate them up"), vehicle parts and animal sounds.
  - The emotional payoff is love and family: "the daddies on the bus go 'I love you'".
- **Brand sting:** 2–6 s at the top, with a cartoon whoosh and kids shouting the name. The same sting plays every time.

## 7. Voice

I did not measure pitch (estimating it from the mixed audio was unreliable). From transcripts and descriptions:
- **Lead:** one clear, bright, young-sounding **female** vocal, close-miked, with very clean diction and little vibrato. The singing is warm rather than hyped.
- **Character voices:** the baby or toddler hero speaks in single words ("Huh?", "Yay!", "Mmm"). Parents get their own verse lines ("the daddies…" in a male voice). The finale has a group of **kid voices**.
- **Spoken parts:** short story dialogue in the gaps ("Teddy likes them too!", "You see?", "Thank you"), plus lots of laughing and gasping.
- **Energy:** steady and friendly rather than shouty. The energy comes from the sound effects and giggles, not from the singer.

## 8. Visuals

- **Style:** 3D, with big heads and very big eyes (child psychologists cite big faces and eyes as the main draw for babies). The cast is a family plus friends and animals in everyday places: home, bath, kitchen, grocery store, playground, school.
- **Pacing (measured on 9 top singles):**
  - **18–23 cuts per minute**;
  - median shot length **2.1–3.4 s**;
  - shortest shots about 1 s;
  - one longer hold of 12–17 s per video.
  - Even the slow Twinkle runs at 3.0 s per shot.
  - **For us: do not copy this.** Our rule is no rapid hard cuts, and a UCLA review commissioned by Moonbug found that preschoolers *learn less* from content with frequent cuts.
- **Camera:** a child's eye-level and low angles (adults shown as legs). The camera changes size from shot to shot: wide set-up, then a close-up of a face reacting, then an insert of the prop. There are many reaction close-ups.
- **On-screen lyrics:** one line, **small, bottom-centre**, with a multicoloured karaoke fill (pink and teal words). It never covers faces.
- **Palette:** high-saturation primaries, sunny greens and blues, warm interiors, a white logo card at both ends.
- **Story:** each video is a mini-plot told with no words: lose the toy egg, chase it, find it, hug. The lyric stays fixed while the story moves.

## 9. Parent appeal

**What parents get from it:**
- **Routine songs are tools.** The bath (7.7 B), vegetables (3.5 B), sick (2.1 B), bedtime (1.9 B + 1.8 B) and boo-boo (1.5 B) songs help with real daily battles. Parents search for them by name.
- **Familiar rhymes** let parents sing along off-screen. The full lyrics in every description make that easy.
- **Warm family modelling:** parents shown kind and present ("I love you" verses). This is the stated "prosocial" pitch in the About text.
- **Predictability:** the same sting, the same structure, the same faces every time.

**Where parents push back:**
- The main criticism is **overstimulation** (fast cuts, saturated colour).
- Adults find the repetition grating.
- Moonbug now publicly answers "addictive" claims with UCLA research.
- **This gap is our opportunity:** calm, slower-cut, still-look visuals sold as "toddler-friendly calm sing-along".

**What kids respond to:** big faces and eyes, a baby hero, family, animals, vehicles, peek-a-boo surprises, sound-effect words they can shout, a slot they can predict ("what colour sheep next?"), giggles, and the same song again.

---

## 10. Tiny Tune Town recipe

### 10a. What our 5 songs do now, and the fix for each

| # | Finding in our songs | Fix |
|---|---|---|
| 1 | All renders are **102–110 s**. The best-performing lengths are 2:30–3:50 (median of top singles about 2:50). | Target **150–180 s**: a 4 s sting, an 8–12 s wordless cold-open, the song, one extra repeat of the hook verse, and a 15–20 s outro with giggles, "Bye-bye!" and an end card. ACE-Step can set `duration: 170`. |
| 2 | **Too many words and too much new text.** 80–122 words/min with 19–35 % repeated lines, versus about 72–77 words/min with 40–80 % repetition. Octopus has 206 words. | Use the **one-slot swap template**: one 4-line verse, 4–6 passes, one word changed each time, the same tag line ending every pass. Aim for ≤ 75 words/min and ≥ 50 % repeated lines. Old MacDonald and Row Your Boat are closest; Octopus and Bubble Hands are furthest. |
| 3 | The music has **no breathing gaps**. | Put 2–4 s instrumental gaps between passes with one spoken word ("Wow!", "Who's next?", a giggle) and the story beat on screen. |
| 4 | **Everything runs at 108–120 BPM.** | Spread it out: action songs 115–124, routine and story songs 92–100, bedtime songs 70–80. Twinkle should be about 76, not 108. |
| 5 | **Visuals are one static wide shot for 110 s.** Characters fill about 25 % of the frame height and faces are tiny (see the Row Your Boat contact sheet). | Keep the still look and no hard cuts, but **change the framing every 6–8 s** (8–10 changes a minute) with slow push-ins, pans and 0.5–1 s crossfades. **Push in to a hero face close-up on every hook line.** Go back to a wide shot on every new verse. Nothing shorter than 4 s. |
| 6 | **The cast is inconsistent.** "Pip" is a sleepy bunny in 02 and a kid in a rain hat in 05. Bibi (04) is another bunny. Ollie and Farmer Mac are one-offs. | Choose **one recurring hero (plus 2–3 friends)** and put them in every video and every thumbnail. Rename one of the two Pips. |
| 7 | **Thumbnails** are clean and readable, but have no brand badge, the hero's face fills only about 20–30 % of the height, and each one is styled differently. | Add a **fixed logo badge bottom-left**. Make the **hero's face 40–50 % of the height on the right**, eyes to the viewer, with the song's prop beside the face. Use at most one word (ours are fine for parents). A/B test against a **no-text** version. |
| 8 | **Title suffixes** vary ("Tiny Tune Town Nursery Rhymes", "Tiny Tune Town", "Kids Songs"). | Use one fixed suffix (see the template below) on every title. |
| 9 | **Lyrics in the descriptions don't match the songs.** Row Your Boat says "Quack, quack! A little duck / and row with me!" (missing "Hop in, duck,"). Octopus and Twinkle drop or duplicate lines. | Paste the lyrics from `song.md` or a corrected LRC, and proof-read them before upload. Parents sing from these. |
| 10 | We have no brand sting, compilation plan or upload cadence. | Reuse `songs/00-test-jingle` as a **3–4 s sung "Tiny Tune Town!" sting** at the start of every video. Once there are 8 or more songs, publish a **25–35 min "+ More" compilation** with chapters, then **5–6 min "song + song" doubles**. Upload on fixed days (for example Tue and Sat). |

### 10b. Production checklist (per video)
- [ ] The topic is a **public-domain classic** or a **daily routine** (bath, food, teeth, sleep, boo-boo, getting dressed, potty, tidy-up).
- [ ] One 4-line verse melody plus one slot that changes each pass. The tag line ends every pass.
- [ ] Sound or action words in groups of three, with a sound effect on the beat.
- [ ] A teaching layer: count, colours, animal sounds or body parts.
- [ ] A warm payoff in the last pass (hug, "I love you", "all clean!").
- [ ] Tempo chosen from the band for the song type. Major key.
- [ ] Words per minute ≤ 75 and repeated lines ≥ 50 % (a quick script check).
- [ ] Sting 3–4 s, wordless story set-up 8–12 s, song, outro 15–20 s. **Total 150–180 s.**
- [ ] The recurring hero is in every scene, with a face close-up on every hook.
- [ ] A framing change every 6–8 s, no hard cuts under 4 s, no flashing.
- [ ] Lyrics on screen: one line, bottom-centre, karaoke fill, never over faces.
- [ ] Thumbnail: face 40–50 % of the height, prop, brand badge bottom-left, ≤ 1 word.
- [ ] Title, description and tags from the templates below. Category: Education. Made for Kids.

### 10c. `song.md` template (ACE-Step 1.5)
```
# NN: <Song Name> (<traditional, public domain (year/source) | original: lyrics & melody by Tiny Tune Town>)
# Hero: <recurring hero> + <guest>. Slot that changes each pass: <colour / animal / body part / food>.
# Story (visual only, told across the passes): <lose → look → find → hug>
# Actions: <one per pass>. Teaching layer: <count 1-5 / colours / sounds>.
caption: <type: cheerful children's nursery sing-along | gentle bedtime lullaby | bouncy action song>, warm clear young female kids-show lead singer, very clear diction, no vibrato, small happy kids choir on the last chorus, <2-4 instruments: ukulele, glockenspiel, marimba, soft hand claps, light acoustic bass | music box, celesta, soft strings>, simple repetitive sing-along melody, short instrumental breaks between verses, major key, <mood: happy, sunny, playful | sweet, cozy, dreamy>, clean bright mix
bpm: <action 115-124 | routine/story 92-100 | bedtime 70-80>
key: <C|D|F|G|A> Major
time: 4
duration: 170
## Lyrics
[intro]
(instrumental 8 bars — visual story set-up, one spoken "Ooh!")

[verse]
<Line 1: slot word + sound x3>
<Line 2: sound x3, sound x3>
<Line 3: repeat line 1>
<Line 4: TAG LINE — identical every pass>

[instrumental break]
(spoken: "Wow!" / "Who's next?")

[verse]  …same 4 lines, slot #2…
[verse]  …slot #3…
[verse]  …slot #4…

[chorus]
<Final pass back to slot #1, plus the warm payoff line, kids choir joins>

[outro]
(spoken: "Bye-bye!" + giggle, instrumental tag)
```

### 10d. Title template (≤ 70 characters, song name first)
- Single: `<Song Name> <optional 1 emoji> | <story or teaching hook> | Tiny Tune Town Nursery Rhymes & Kids Songs`
  - Example: `Humpty Dumpty 🥚 | Friends Help Humpty! | Tiny Tune Town Nursery Rhymes & Kids Songs`
- Double: `<Song A> + <Song B>! | Tiny Tune Town Nursery Rhymes & Kids Songs`
- Compilation: `<Biggest Song> + More Nursery Rhymes & Kids Songs - Tiny Tune Town`
- Version of a hit: `<Song Name> (<Theme> Version) | Tiny Tune Town …`

### 10e. Thumbnail template
- 1280×720, sunny saturated background, slightly blurred so the face pops.
- Hero face on the right 40–50 % of the height, huge eyes looking at the viewer, open-mouth smile or "oh!".
- The song's prop or guest held beside the face on the left-centre.
- Tiny Tune Town badge bottom-left, about 25 % of the height, identical on every thumbnail.
- Text: none or one word. Compilations get a round "30 min" badge top-right.
- Variant B for Test & Compare: the same scene with no text, or a parent figure added.

### 10f. Description template
```
<1–2 sentences: the story + what kids will do.> 

Sing and move along:
- <action 1> … <action 4>

Lyrics:
<exact lyrics from song.md, proof-read>

<Traditional public-domain lyrics (source, year), new verses and music by Tiny Tune Town.> Music and vocals made with ACE-Step 1.5 (open-source AI).

▶ More Tiny Tune Town songs: <playlist link>
▶ Subscribe: https://www.youtube.com/@<handle>?sub_confirmation=1

About Tiny Tune Town: calm, colourful sing-alongs for toddlers and preschoolers — clear words, gentle pacing, no flashing, and songs that help with everyday routines.

#nurseryrhymes #kidssongs #toddlersongs #singalong
```
- **Compilations:** chapter timestamps at the very top (`00:00 Song A`, …).
- **Tags (about 20):** `nursery rhymes, kids songs, children songs, baby songs, toddler songs, preschool, kindergarten, sing along, kids education, kids animation, learning songs, tiny tune town` plus 4–6 song-specific tags.

### 10g. Recommended durations
| Format | Length | When |
|---|---|---|
| Single | **2:30–3:00** (150–180 s) | Every new song |
| Song + song double | 5:00–6:30 | After 6 or more singles; pair two related songs |
| Compilation | **25–35 min**, 10–13 songs, chapters | After 8–10 songs; refresh every 4–6 new songs |
| Avoid | < 2 min (median 28 M vs 48 M for 2–4 min); > 45 min | |

### 10h. Ten songs to make next
Public-domain texts verified pre-1929. All melodies and arrangements are ours (ACE-Step); never use another channel's tune or verses.

1. **Humpty Dumpty** (PD, 1797). Classic verse sung 4x unchanged, **story told visually**: our hero's friends help glue, bandage and hug Humpty "together again". Prosocial ending. ~100 BPM.
2. **Itsy Bitsy Spider** (PD, 1910). Verse 4x with hand actions. Slot is the weather: rain, wind, snow, sunshine. Rainbow finale. ~96 BPM.
3. **Hickory Dickory Dock** (PD, 1744). Slot is the time and the animal: 1 mouse, 2 bird, 3 frog… Counting plus animal sounds. ~110 BPM.
4. **Mary Had a Little Lamb** (PD, 1830). Lamb follows our hero to the park, the shop, the bath. A visual story with a fixed verse. ~100 BPM.
5. **The Muffin Man** (PD, 1820). Slot is the baker's treat: muffin, bun, pie, bread. Pairs with a cooking theme. ~112 BPM.
6. **Hot Cross Buns + Pat-a-Cake** (both PD) as the first **song + song double**: a baking day with clapping game actions. ~104 BPM.
7. **"Brush Brush Teeth"** (original routine). Slot is the teeth: top, bottom, front, back. Sound "scrub-scrub-scrub". Count to 10. ~98 BPM.
8. **"One Little Bite"** (original routine, picky eating). Slot is the food. Hook: "Will you try it? One little bite! Mmm!" Our own wording; no "Yes Yes". ~96 BPM.
9. **"Boo-Boo All Better"** (original comfort song). Slot is where it hurts: knee, elbow, finger. "Wash it, kiss it, hug it — all better!" ~92 BPM.
10. **"Night-Night, Moon"** (original lullaby). Slot is who says goodnight: bunny, duck, fish, moon. Calm and slow, no claps. **~76 BPM**. This fills our missing slow tempo band.

**Version ideas from our existing songs:**
- An "Old MacDonald (Pet Shop Version)", reusing the one-slot format that already works.
- A 3-song "Bath & Bedtime" double or mix once 7, 9 and 10 exist (with 04 Bubble Hands and 02 Twinkle).

**Avoid:**
- "Wheels on the Bus" until its public-domain status is checked (Verna Hills, published 1939).
- "Baby Shark" (in copyright).
- Anything CoComelon wrote themselves: Bath Song, Yes Yes, Sick Song, Bananaphone (Raffi, licensed).

---
### Sources
- yt-dlp metadata for all channel uploads (pulled 2026-10-14). Thumbnails in `research/cocomelon/thumbs/` (top 20) and `thumbs/recent/` (8 best recent videos).
- [Wikipedia: Cocomelon](https://en.wikipedia.org/wiki/Cocomelon): history, Moonbug and Candle Media, 200 M+ subscribers.
- [Romper: why babies love CoComelon](https://www.romper.com/parenting/why-do-babies-love-cocomelon-experts-explain-38055145): faces, colour, repetition, pacing.
- [Netinfluencer: Moonbug × UCLA CSS](https://www.netinfluencer.com/moonbug-taps-ucla-research-partnership-to-counter-cocomelon-overstimulation-claims/): evidence on cuts and "addictive" claims is "fairly inconclusive"; preschoolers learn less from frequent cuts.
- [Conflicted Substack: CoComelon history and controversy](https://conflicted.substack.com/p/cocomelons-history-and-controversy): the "Distractatron" focus-group testing (secondhand, citing NYT 2022).
- [Ypulse on Nielsen viewing](https://www.ypulse.com/newsfeed/2022/02/24/children-love-the-strange-world-of-cocomelon-and-its-popularity-is-only-going-to-continue/).
