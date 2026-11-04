import json, re, subprocess, sys, os
sys.path.insert(0, ".")
from align import align
F = json.load(open("names_final.json"))     # [n, arabic, translit, meaning, syllables]
PICK = {"00": "21", "01": "7", "02": "7", "03": "7", "04": "7", "05": "7", "06": "7", "07": "splice", "08": "7", "09": "7"}
def dur(p): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]))
chunks = []
for c in range(10):
    cc = f"{c:02d}"; sd = PICK[cc]
    lines = [l for l in open(f"chunks/c{cc}/song.md").read().split("## Lyrics")[1].splitlines() if l.strip() and not l.startswith("[")]
    if sd == "splice":
        al = align(f"chunks/c{cc}", "7", lines); a21 = align(f"chunks/c{cc}", "21", lines)
        al[9] = [41.4 - 0.25 + (a21[9][0] - 42.6), 41.4 - 0.25 + (a21[9][1] - 42.6)]
    else: al = align(f"chunks/c{cc}", sd, lines)
    chunks.append((cc, sd, lines, al))
OFF, t0 = [], 5.0; segs = []
names = []
for ci, (cc, sd, lines, al) in enumerate(chunks):
    w = f"chunks/c{cc}/takes/take-{sd}-1.wav"; D = dur(w)
    # fill gaps by interpolation
    for k, a in enumerate(al):
        if a is None:
            p = next((al[j] for j in range(k - 1, -1, -1) if al[j]), None); n = next((al[j] for j in range(k + 1, len(al)) if al[j]), None)
            al[k] = [p[1] + 0.2, p[1] + 2.5] if p else [max(0, n[0] - 2.5), n[0] - 0.2]
    s0 = max(0, al[0][0] - 0.6); s1 = min(D, al[-1][1] + 1.0)
    segs.append((w, s0, s1)); OFF.append(t0)
    for li, (l, a) in enumerate(zip(lines, al)):
        gi = ci * 10 + li - (1 if ci == 0 else 0) + (0 if ci else 0)
        if ci == 0 and li == 0: row = [0, "اللَّهُ", "Allah", "the One God"]
        else: row = F[(ci * 10 + li - (1 if ci == 0 else 0)) if ci == 0 else ci * 10 + li][:4] if False else None
        names.append((ci, li, a[0] - s0 + t0, a[1] - s0 + t0))
    t0 += (s1 - s0) - 0.4
tot = t0 + 0.4 + 6.0
# global names rows
rows = []; k = 0
for ci, li, s, e in names:
    if ci == 0 and li == 0: r = [0, "اللَّهُ", "Allah", "the One God"]
    else: r = F[k][:4]; k += 1
    rows.append(r + [round(max(s - 0.25, 0), 2), round(e, 2)])
assert k == 99 and len(rows) == 100
# audio: crossfade chain
inputs, filt, last = [], [], None
for i, (w, a, b) in enumerate(segs):
    inputs += ["-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", w]
for i in range(len(segs)):
    last_lbl = f"[{i}:a]"
    if i == 0: cur = last_lbl
    else: filt.append(f"{cur}{last_lbl}acrossfade=d=0.4[x{i}]"); cur = f"[x{i}]"
filt.append(f"{cur}adelay=5000|5000,apad=whole_dur={tot:.3f}[o]")
if not os.environ.get("NOAUDIO"): subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(filt), "-map", "[o]", "-ar", "44100", "-ac", "2", "../songs/71-99-names-of-allah/assets/voice.wav"], check=True)
# scene windows: chunk i spans [OFF_i (start of its first fade), OFF_{i+1}); chunk0 starts at 0 with intro 0..OFF0
bounds = OFF + [OFF[-1] + (segs[-1][2] - segs[-1][1])]
CHs = []; ni = 0
for ci in range(10):
    n = len(chunks[ci][2]); CHs.append([round(OFF[ci], 2), round(OFF[ci + 1] if ci < 9 else bounds[-1], 2), ni, ni + n - 1]); ni += n
open("../songs/71-99-names-of-allah/scenes.js", "w").write(open("scenes_tpl.js").read().replace("__NAMES__", json.dumps(rows, ensure_ascii=False)).replace("__CHUNKS__", json.dumps(CHs)).replace("__TOTAL__", f"{tot:.2f}"))
json.dump({"rows": rows, "chunks": CHs, "total": tot, "picks": PICK}, open("timeline.json", "w"), ensure_ascii=False, indent=0)
print("total", round(tot, 1), CHs[:2], rows[:3])
