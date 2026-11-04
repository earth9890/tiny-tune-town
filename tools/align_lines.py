"""Line timings from a whisper transcript of the FINAL song + the list of lines that were actually sung.

usage: python3 tools/align_lines.py songs/<slug> lines.txt takes/final-transcript.json
lines.txt: one sung line per row, in order (spoken bits like "Bye-bye!" too, if they are audible). Optional "@ t0 t1" rows
restrict the lines after them to whisper words in [t0, t1) s (use one per spliced part when the song repeats itself).
Aligns the transcript's words to the lines' words (difflib, so whisper typos like "Mommy"/"Minnie" are tolerated), then writes
script.json ([[line, 0.2], ...]) and assets/clipt.json ({"clips": [[start, end], ...], "total": song length}).
Prints each line with its time and how many of its words whisper matched; a line with 0 matches is flagged (check it by ear)."""
import difflib, json, pathlib, re, subprocess, sys

d, rows, tr = pathlib.Path(sys.argv[1]), [l.strip() for l in open(sys.argv[2]) if l.strip()], json.load(open(sys.argv[3]))
ALIAS = {"willy": "willie", "winkey": "winkie", "winky": "winkie", "naomi": "nomi", "mommy": "mummy", "run": "up"}  # whisper spellings
norm = lambda w: ALIAS.get(re.sub(r"[^a-z0-9]", "", w.lower()), re.sub(r"[^a-z0-9]", "", w.lower()))
WALL = [(norm(w["word"]), w["start"], w["end"]) for s in tr["segments"] for w in s["words"] if norm(w["word"])]
lines, groups, win = [], [], (0, 1e9)
for r in rows:
    if r.startswith("@"): win = tuple(map(float, r[1:].split())); continue
    lines.append(r); groups.append(win)
W, hit = WALL, {}  # line-word index -> whisper word index (into WALL)
L = [(i, norm(w)) for i, l in enumerate(lines) for w in l.split() if norm(w)]
for g in dict.fromkeys(groups):
    li = [j for j, (i, _) in enumerate(L) if groups[i] == g]; wi = [k for k, w in enumerate(WALL) if g[0] <= w[1] < g[1]]
    sm = difflib.SequenceMatcher(None, [L[j][1] for j in li], [WALL[k][0] for k in wi], autojunk=False)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): hit[li[a + k]] = wi[b + k]
    for tag, a0, a1, b0, b1 in sm.get_opcodes():  # replaced words (typos) map 1:1 where the lengths agree
        if tag == "replace" and a1 - a0 == b1 - b0:
            for k in range(a1 - a0): hit[li[a0 + k]] = wi[b0 + k]
clips, bad = [], 0
for i, l in enumerate(lines):
    idx = [hit[j] for j, (li, _) in enumerate(L) if li == i and j in hit]
    if idx: s, e = W[min(idx)][1], W[max(idx)][2]
    else: s = e = clips[-1][1] if clips else 0; bad += 1
    clips.append([round(s, 2), round(max(e, s + 0.3), 2)])
    print(f"{s:6.1f}-{e:6.1f} {len(idx)}/{len(l.split())} {'!!' if not idx else '  '} {l}")
for i in range(1, len(clips)):  # keep order: no overlaps
    clips[i][0] = max(clips[i][0], clips[i - 1][1]); clips[i][1] = max(clips[i][1], clips[i][0] + 0.3)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(d / "assets/voice.wav")], capture_output=True, text=True).stdout)
json.dump([[l, 0.2] for l in lines], open(d / "script.json", "w"), indent=0)
json.dump({"clips": clips, "total": round(dur, 2)}, open(d / "assets/clipt.json", "w"))
print(f"{len(lines)} lines, {bad} unmatched, total {dur:.2f} s")
