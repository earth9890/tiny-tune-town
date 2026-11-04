"""Calm-rules QA for a rendered Tiny Tune Town video: every frame is checked, not just snapshots.

usage:  ~/.venvs/demucs/bin/python tools/calm_qa.py <video.mp4> [--json out.json]
        ~/.venvs/demucs/bin/python tools/calm_qa.py --selftest
Adapted from the animated-shorts study's short_qa.py (per-frame black / white / frozen / pop scan), with our rules:
- HARD CUT  a one-frame picture jump (frame diff > 6x the local median and > 12 grey levels). Our crossfades spread a
            change over 18 frames, so any cut is a bug (rule 3: no hard cuts).
- FLASH     >= 25 % of the frame changes luma by >= 0.10 within 2 frames (WCAG "general flash" size and step).
            We allow none; WCAG's hard limit is 3 per second.
- BLACK / WHITE frames (mean luma < 0.04 / > 0.93): dropped picture or a white flash.
- STILL     a span > 3 s where nothing moves (rule: something always moves softly).
- LOUDNESS  integrated LUFS, true peak, LRA (target -14 to -15 LUFS, TP <= -1 dBTP).
Exit code 1 when anything fails, so batch scripts can stop.
"""
import json, subprocess, sys
import numpy as np

W, H, CELLS = 192, 108, 4


def frames(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", path], capture_output=True, text=True, check=True)
    a, b = r.stdout.strip().split("/")
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", f"scale={W}:{H}:flags=area", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3), float(a) / float(b)


def loudness(path):
    e = subprocess.run(["ffmpeg", "-nostats", "-i", path, "-map", "0:a:0", "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    tail = e[e.rfind("Summary:"):]
    val = lambda k: next((float(l.split()[1]) for l in tail.splitlines() if l.strip().startswith(k)), None)
    return {"I": val("I:"), "LRA": val("LRA:"), "TP": val("Peak:")} if "Summary:" in e else None


def scan(F, fps):
    n = len(F)
    f = F.astype(np.float32) / 255
    luma = f @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    mean = luma.mean((1, 2))
    diff = np.abs(np.diff(F.astype(np.int16), axis=0)).mean((1, 2, 3))
    med = np.array([np.median(diff[max(0, i - 8):i + 9]) for i in range(len(diff))])
    cuts = [i + 1 for i in range(len(diff)) if diff[i] > 12 and diff[i] > 6 * med[i]]
    cell = luma.reshape(n, CELLS, H // CELLS, CELLS, W // CELLS).mean((2, 4)).reshape(n, -1)
    step = np.abs(cell[2:] - cell[:-2])                       # luma change over 2 frames, per cell
    flash = [i + 2 for i in range(len(step)) if (step[i] >= 0.10).mean() >= 0.25]
    flash = [t for j, t in enumerate(flash) if j == 0 or t - flash[j - 1] > 2]  # one event per flash
    black = [i for i in range(n) if mean[i] < 0.04]
    white = [i for i in range(n) if mean[i] > 0.93]
    still, s0 = [], None
    for i, d in enumerate(list(diff) + [99]):
        if d < 0.05:
            s0 = i if s0 is None else s0
        else:
            if s0 is not None and (i - s0) / fps > 3: still.append((round(s0 / fps, 2), round(i / fps, 2)))
            s0 = None
    t = lambda L: [round(x / fps, 2) for x in L[:30]]
    return {"frames": n, "fps": fps, "cuts": t(cuts), "flashes": t(flash), "black": t(black), "white": t(white), "still": still[:30],
            "held_pct": round(float((diff < 0.3).mean() * 100), 1)}


def main(a):
    R = scan(*frames(a[0]))
    R["loudness"] = loudness(a[0])
    bad = [k for k in ("cuts", "flashes", "black", "white") if R[k]]
    L = R["loudness"]
    if L and (L["I"] is None or not -16 <= L["I"] <= -13 or L["TP"] > -1.0): bad.append("loudness")
    for k in ("cuts", "flashes", "black", "white", "still"): print(f"{k:8} {len(R[k]):3}  {R[k]}")
    print(f"held    {R['held_pct']} % of frames barely move (< 0.3 grey levels)")
    print(f"loud    {L}")
    print("FAIL: " + ", ".join(bad) if bad else "PASS: no cuts, no flashes, no black/white frames, loudness in range")
    if "--json" in a: json.dump(R, open(a[a.index("--json") + 1], "w"), indent=1)
    return 1 if bad else 0


def selftest():
    # 3 s: a slow crossfade (allowed) + one hard cut + one white flash frame + a 3.5 s still tail
    fps, n = 30, 200
    F = np.zeros((n, H, W, 3), np.uint8)
    a, b = np.array([120, 180, 230]), np.array([110, 200, 120])
    for i in range(n):
        k = np.clip((i - 10) / 18, 0, 1)                    # crossfade frames 10-28
        F[i] = (a * (1 - k) + b * k).astype(np.uint8)
        F[i, :, : W // 2 + (i % 40)] += 10                  # soft motion
    F[60:] = (a * 0.5).astype(np.uint8); F[60:, :, :(W // 2)] += 20  # hard cut at 60
    F[90] = 250                                             # 1-frame white flash
    F[95:] = 80                                             # still from frame 95 (3.5 s)
    R = scan(F, fps)
    assert R["cuts"][:1] == [2.0], R["cuts"]
    assert any(abs(t - 3.0) < 0.1 for t in R["flashes"]), R["flashes"]
    assert R["white"] == [3.0], R["white"]
    assert not any(t < 1.0 for t in R["cuts"] + R["flashes"]), "crossfade flagged"
    assert R["still"] and R["still"][0][0] > 3.1, R["still"]
    print("selftest ok", R)


if __name__ == "__main__":
    sys.exit(selftest() if sys.argv[1:] == ["--selftest"] else main(sys.argv[1:]))
