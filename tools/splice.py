"""python3 tools/splice.py OUT.wav FADEOUT_S file:start:end file:start:end ...   (0.25 s crossfades, 44.1k stereo)"""
import subprocess, sys
out, fo, parts = sys.argv[1], float(sys.argv[2]), sys.argv[3:]
cmd = ["ffmpeg", "-y", "-loglevel", "error"]; f = []; tot = 0
for i, p in enumerate(parts):
    fn, s, e = p.rsplit(":", 2); cmd += ["-i", fn]; f.append(f"[{i}:a]atrim={s}:{e},asetpts=PTS-STARTPTS,aresample=44100[a{i}]")
last = "a0"
for i in range(1, len(parts)):
    f.append(f"[{last}][a{i}]acrossfade=d=0.25:c1=tri:c2=tri[x{i}]"); last = f"x{i}"
tot = sum(float(p.rsplit(":", 2)[2]) - float(p.rsplit(":", 2)[1]) for p in parts) - 0.25 * (len(parts) - 1)
if fo: f.append(f"[{last}]afade=t=out:st={tot - fo:.2f}:d={fo}[o]"); last = "o"
subprocess.run(cmd + ["-filter_complex", ";".join(f), "-map", f"[{last}]", out], check=True); print(out, round(tot, 2))
