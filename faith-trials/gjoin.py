import json, subprocess, os, sys
NM = json.load(open("gnames.json"))
PICK = json.load(open("gpick.json"))    # e.g. ["k1b","k2","k3","k4","k5b","k6"]
def dur(p): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]))
chunks = []
for k in PICK:
    w = f"gan/{k}/takes/take-7-1.wav"; d = json.load(open(f"gan/{k}/takes/take-7-1.en.json")); seg = d["segments"]
    st = [s["start"] for s in seg]
    n1, n2, rf = (st[0], st[1], st[2]) if len(st) == 3 else (st[0], 5.0, 10.3)
    D = dur(w); end = min(D, seg[-1]["end"] + 0.8)
    chunks.append((w, 0.0, end, [n1, n2], rf, seg[-1]["end"]))
rounds = 2; seq = chunks * rounds
CH = []; t = 6.0; inputs = []; filt = []
for i, (w, s0, s1, ns, rf, re_) in enumerate(seq):
    c = i % len(chunks); r = i // len(chunks)
    CH.append(dict(a=round(t, 2), b=round(t + (s1 - s0) - (0.4 if i < len(seq) - 1 else 0), 2), names=[[2 * c + j, round(t + ns[j], 2)] for j in range(2)], ref=[round(t + rf, 2), round(t + re_, 2)], theme=c % 3, r2=(r == 1)))
    inputs += ["-ss", f"{s0:.3f}", "-t", f"{s1 - s0:.3f}", "-i", w]
    t += (s1 - s0) - 0.4
tot = t + 0.4 + 6.0
CH[-1]["b"] = round(t + 0.4, 2)
for i in range(len(seq)):
    lbl = f"[{i}:a]"
    if i == 0: cur = lbl
    else: filt.append(f"{cur}{lbl}acrossfade=d=0.4[x{i}]"); cur = f"[x{i}]"
filt.append(f"{cur}adelay=6000|6000,apad=whole_dur={tot:.3f}[o]")
P = "../songs/72-ganesha-12-names"
if not os.environ.get("NOAUDIO"): subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(filt), "-map", "[o]", "-ar", "44100", "-ac", "2", f"{P}/takes/voice-premix.wav"], check=True)
open(f"{P}/scenes.js", "w").write(open("scenes_g_tpl.js").read().replace("__NM__", json.dumps(NM, ensure_ascii=False)).replace("__CH__", json.dumps(CH)).replace("__TOTAL__", f"{tot:.2f}"))
json.dump([["Ganpati Bappa Morya", 0.2]], open(f"{P}/script.json", "w")); json.dump({"clips": [[6, 8]], "total": round(tot, 2)}, open(f"{P}/assets/clipt.json", "w"))
print("total", round(tot, 1), CH[0], CH[6])
