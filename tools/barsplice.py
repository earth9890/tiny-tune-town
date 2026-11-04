"""Splice sung chunks on the song's own beat grid (no rhythm hiccup at the joins).

usage: ~/.venvs/demucs/bin/python tools/barsplice.py OUT.wav BPM FADEOUT_S file:start:end [file:start:end ...]
Each start/end (s) is snapped to the nearest beat of THAT file's grid (onset-energy phase fit, like sfx.py), and every part but
the last keeps 0.25 s past its end beat for the crossfade, so the next part's first beat lands exactly on the previous end beat.
Prints the snapped cuts and where each part starts in OUT (use these to shift whisper times into the final song)."""
import subprocess, sys
import numpy as np

SR, XF = 44100, 0.25
out, bpm, fo, parts = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4:]
beat = 60 / bpm


def phase(fn, hop=441):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", fn, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    m = np.frombuffer(raw, np.float32); e = np.sqrt(np.mean(m[: len(m) // hop * hop].reshape(-1, hop) ** 2, axis=1))
    env, fr = np.maximum(0, np.diff(e, prepend=e[0])), SR / hop
    ph = np.arange(0, beat, 0.005)
    score = [env[np.round((p + np.arange(0, len(env) / fr - beat, beat)) * fr).astype(int)].sum() for p in ph]
    return float(ph[int(np.argmax(score))]), len(m) / SR


cuts, cmd, f, t = [], ["ffmpeg", "-y", "-loglevel", "error"], [], 0.0
for i, p in enumerate(parts):
    fn, s, e = p.rsplit(":", 2); ph, dur = phase(fn)
    snap = lambda x: max(0.0, ph + round((float(x) - ph) / beat) * beat)
    s, e = snap(s), min(dur, snap(e) + (XF if i < len(parts) - 1 else 0))
    cuts.append((fn, s, e)); cmd += ["-i", fn]
    f.append(f"[{i}:a]atrim={s:.4f}:{e:.4f},asetpts=PTS-STARTPTS,aresample={SR},aformat=channel_layouts=stereo[a{i}]")
    print(f"part {i}: {fn.split('/')[-3]}/{fn.split('/')[-1]} {s:.2f}-{e:.2f} (phase {ph:.3f}) -> starts at {t:.2f} in OUT")
    t += (e - s) - (XF if i < len(parts) - 1 else 0)
last = "a0"
for i in range(1, len(parts)):
    f.append(f"[{last}][a{i}]acrossfade=d={XF}:c1=tri:c2=tri[x{i}]"); last = f"x{i}"
if fo: f.append(f"[{last}]afade=t=out:st={t - fo:.2f}:d={fo}[o]"); last = "o"
subprocess.run(cmd + ["-filter_complex", ";".join(f), "-map", f"[{last}]", out], check=True)
print(out, round(t, 2), "s")
