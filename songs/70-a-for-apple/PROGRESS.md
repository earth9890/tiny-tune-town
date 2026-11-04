# Progress 70 (A for Apple, B for Ball)
- song.md written. Lint: all PASS except words/min (26 mandatory "X for word" lines + a 4-line refrain needed for the >=50% repeated-lines rule => ~80 wpm vs 75 limit). Not bending the lyrics; documented here. Next: 1-minute trial A-H, 2 seeds.
- trial A-H (60s) seeds 7,21 running via trial/run.sh
- props.js (26 objects) written; QA grid thumbnails/_props.js queued behind another agent's heavy job. Trial sing queued too.
- OWNER: no trials. Trial killed. Full-song seeds 7,21,42 queued via run.sh (sequential, heavy lock).
seed 7 sung+transcribed Fri Oct 30 12:46:06 IST 2026
seed 21 sung+transcribed Fri Oct 30 13:03:48 IST 2026
seed 42 sung+transcribed Fri Oct 30 13:20:40 IST 2026
- SCORE round 1 (lyrics A): seed 21 best (A-H, I, K, L, M-X ok; J garbled 'bit juice to hold'; Y,Z missing). seed 7 lacks J,M,N,Q-R,Y,Z; seed 42 lacks B?-ok, F,J partly, M/N merged, Y,Z. ALL three drop Y/Z (last 2-line verse). Props grid reviewed: ok except jug handle, zebra head, to fix.
- Lyrics B: last verse now 4 lines (+ 'A to Z, we know them all / Clap your hands and have a ball') so Y/Z are not a short tail. Round 1 takes kept (takes/take-*, lyrics in takesA/songA.md). Singing B seeds 7 21 3 11 via run.sh
- scenes.js drafted (LC block empty until timing), mkscenes.py helper. props jug fixed. waiting on seeds B 7 21 3 11
seed 7 sung+transcribed Fri Oct 30 14:39:29 IST 2026
seed 21 sung+transcribed Fri Oct 30 14:56:33 IST 2026
seed 3 sung+transcribed Fri Oct 30 15:21:09 IST 2026
seed 11 sung+transcribed Fri Oct 30 15:35:29 IST 2026
- Full-song seeds (lyrics B 7,21,3,11): NONE has all 26 (ACE-Step drops/merges lines on the long list; Y/Z still shaky). NEW PLAN: sing in 4 chunks (chunks/c1..c4: A-H, I-P, Q-X, Y-Z+finale), same caption/seed, splice at silence, then remix. Honest note for report.
chunk c1 seed 7 done Fri Oct 30 20:49:32 IST 2026
chunk c2 seed 7 done Fri Oct 30 20:54:47 IST 2026
chunk c3 seed 7 done Fri Oct 30 21:00:06 IST 2026
chunk c4 seed 7 done Fri Oct 30 21:04:39 IST 2026
- chunks seed 7 scored: c1 A-H ok (whisper 'E for apple','T for goat' = mis-hears, verify on stem); c2 MISSING I,J (K..P ok); c3 MISSING V (Q-U,W,X ok); c4 Y,Z + 'A to Z' lines ok. Re-singing c2,c3 on seeds 21 and 3.
chunk c2 seed 21 done Fri Oct 30 21:29:18 IST 2026
chunk c3 seed 21 done Fri Oct 30 21:34:04 IST 2026
chunk c2 seed 3 done Fri Oct 30 21:38:41 IST 2026
chunk c3 seed 3 done Fri Oct 30 21:43:40 IST 2026
- c2: seed21 has I-L (0-23s), seed7 has K-P; seed3 c2 has J-P no I. Splice I-L(seed21)+M-P(seed7). c3 no seed has V -> new chunk c3b (U-X only), seeds 7 21 11 64.
chunk c3b seed 7 done Fri Oct 30 22:00:12 IST 2026
chunk c3b seed 21 done Fri Oct 30 22:05:25 IST 2026
chunk c3b seed 11 done Fri Oct 30 22:09:55 IST 2026
chunk c3b seed 64 done Fri Oct 30 22:14:58 IST 2026
- SPLICED takes/splice.wav (c1 s7 0-56.6 | c2 s21 0-16 | c2 s7 15.8-35.9 | c2 s7 39.9-44.4 | c3 s21 8-32.6 | c3b s7 0-26 | c4 s7 7.5-36), 0.25s crossfades -> assets/voice.wav. c3b s7 has U V W X clean. Next remix + stem transcript
- remix done; transcribing vocal stem
- stem transcript: all 26 letters sung in order (whisper mis-hears: 'E for apple' A, 'hot' H, 'White boy' Y, 'bin' V, 'N for duck' refrain; chunk transcripts agreed). script.json (39 lines) + clipt.json written. Next: scene_lint/build/check/snapshot.
- snapshots queued (bw14ti4q2); thumb-a.js/thumb-b.js written, not yet rendered
- package.md written (description lyrics from script.json; refrain count per clip as detected)
- title fixed per lead (69 chars). waiting snapshots/thumbs
- sheets read: layout good; fixes: Bibi/prop/card shifted so mediums don't clip, finale title overlap, thumb tweaks. rebuild+quick snapshot+thumbs then render
- RENDER launched (nohup, queued on lock) Sat Oct 31 00:51:22 IST 2026; log renders/render.log; thumbs a/b badged
- Bibi/prop nudged again before render starts (render rebuilds from scenes.js). 60.1s snapshot showed blank once: verify via blank_scan
