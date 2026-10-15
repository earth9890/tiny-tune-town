"""Remix a sung take so the singer sits clearly on top of the music.

usage (from the repo root, under the heavy lock):
  lockf -t 3000 ~/videos/black-hole-life/.heavy.lock ~/.venvs/demucs/bin/python tools/remix.py songs/<slug> [--in assets/voice.wav] [--out assets/voice.wav] [--over 8]
  ~/.venvs/demucs/bin/python tools/remix.py --selftest
1. demucs (htdemucs, two stems) splits the take into vocals + music -> <slug>/assets/stems/ (cached; re-runs are fast)
2. vocals: high-pass 90 Hz, -2 dB mud at 300 Hz, +3 dB presence at 3 kHz, +2 dB air above 8 kHz
3. the music is turned down until the vocals sit --over dB (default 8) above it while she sings
4. mix, then two-pass loudnorm to -14 LUFS, true peak -1.5 dB
--in and --out default to assets/voice.wav: the raw take is copied to takes/voice-premix.wav first, so nothing is lost.
Measured on our first 17 songs: vocals sat -2.5 to +2 dB vs the music (buried); singer pitch was fine (G4, ~390 Hz).
venv: ~/.local/bin/uv venv --python python3.12 ~/.venvs/demucs && ~/.local/bin/uv pip install --python ~/.venvs/demucs/bin/python demucs soundfile pyloudnorm
"""
import json, os, re, shutil, subprocess, sys
import numpy as np, soundfile as sf

VOCAL_EQ = "highpass=f=90,equalizer=f=300:t=q:w=1:g=-2,equalizer=f=3000:t=q:w=1:g=3,highshelf=f=8000:g=2"


def vocal_over(v, m, sr):
    """Median dB of vocals over music in the 0.4 s frames where the singer is singing (within 20 dB of her peak)."""
    n = int(sr * 0.4)
    rms = lambda x: np.sqrt(np.mean(x[:len(x) // n * n].reshape(-1, n) ** 2, axis=1)) + 1e-9
    vr, mr = rms(v.mean(1) if v.ndim > 1 else v), rms(m.mean(1) if m.ndim > 1 else m)
    sung = vr > vr.max() / 10
    return float(np.median(20 * np.log10(vr[sung] / mr[sung])))


def ff(*a):
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-y", *a], capture_output=True, text=True, check=True).stderr


def main(a):
    song = os.path.abspath(a[0])
    opt = lambda k, d: type(d)(a[a.index(k) + 1]) if k in a else d
    src, dst, over = (os.path.join(song, opt("--in", "assets/voice.wav")), os.path.join(song, opt("--out", "assets/voice.wav")),
                      opt("--over", 8.0))
    stems = os.path.join(song, "assets", "stems")
    sv, sm = (os.path.join(stems, "htdemucs", f) for f in ("vocals.wav", "no_vocals.wav"))
    if src == dst:
        keep = os.path.join(song, "takes", "voice-premix.wav")
        os.makedirs(os.path.dirname(keep), exist_ok=True)
        src = keep if os.path.exists(keep) else shutil.copy(src, keep)  # always remix from the raw take, never twice
    tag, made = os.path.join(stems, "source.txt"), f"{src} {os.path.getmtime(src)}"
    if not (os.path.exists(sv) and os.path.exists(tag) and open(tag).read() == made):  # stems of another take: split again
        subprocess.run([sys.executable, "-m", "demucs", "--two-stems=vocals", "-n", "htdemucs", "-d", "mps",
                        "-o", stems, "--filename", "{stem}.{ext}", src], check=True)
        open(tag, "w").write(made)
    eq = os.path.join(stems, "vocals-eq.wav")
    ff("-i", sv, "-af", VOCAL_EQ, eq)
    v, sr = sf.read(eq)
    m, _ = sf.read(sm)
    before = vocal_over(sf.read(sv)[0], m, sr)
    music_db = min(0.0, vocal_over(v, m, sr) - over)
    mix = v + m * 10 ** (music_db / 20)
    tmp = os.path.join(stems, "mix-raw.wav")
    sf.write(tmp, mix / max(1.0, np.abs(mix).max()), sr, subtype="FLOAT")
    ln = "loudnorm=I=-14:TP=-1.5:LRA=11"
    st = json.loads(re.search(r"\{[^{}]*\}", ff("-i", tmp, "-af", ln + ":print_format=json", "-f", "null", "-")).group())
    ff("-i", tmp, "-af", f"{ln}:linear=true:measured_I={st['input_i']}:measured_TP={st['input_tp']}:measured_LRA={st['input_lra']}"
       f":measured_thresh={st['input_thresh']}:offset={st['target_offset']}", "-ar", "48000", dst)
    lufs = re.findall(r"I:\s+(-?[\d.]+) LUFS", ff("-i", dst, "-af", "ebur128", "-f", "null", "-"))[-1]  # last = summary
    print(f"vocals over music {before:+.1f} dB -> {vocal_over(v, m * 10 ** (music_db / 20), sr):+.1f} dB "
          f"(music {music_db:+.1f} dB, vocal EQ), {lufs} LUFS -> {dst}")


if __name__ == "__main__":
    if sys.argv[1:] == ["--selftest"]:
        sr, t = 1000, np.arange(4000) / 1000
        v = np.sin(2 * np.pi * 50 * t) * (t < 2)  # sings for 2 s, then silence
        assert abs(vocal_over(v, v * 0.1, sr) - 20) < 0.1
        print("selftest ok")
    else:
        main(sys.argv[1:])
