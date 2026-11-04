"""Gentle sound effects on the song: soft claps, pops, chimes and quacks placed on the beat, under the singer.

usage (from the repo root, AFTER remix.py; opt-in: only songs with a sfx.json get SFX):
  ~/.venvs/demucs/bin/python tools/sfx.py songs/<slug>            # assets/voice.wav (+ backup takes/voice-presfx.wav)
  ~/.venvs/demucs/bin/python tools/sfx.py --selftest
songs/<slug>/sfx.json = a list of events (times in seconds, the same clock as script.json / clipt.json):
  {"t": 21.4, "kind": "clap"}                                     one hit
  {"from": 40.0, "to": 48.0, "every": 0.517, "kind": "clap"}      on every beat (every = 60 / bpm)
  add "snap": true to move the grid onto the song's own beat (onset-energy phase fit; ACE-Step tempo is steady)
  optional "db": peak level in dBFS (defaults below; quiet on purpose: the song IS the music, SFX only decorate)
Kinds: clap (two soft noise transients), pop (rounded 600->300 Hz blip), chime (bell partials, 1.2 s), quack (toy duck).
Everything is synthesized here (no samples), so it is ours to publish. Re-running starts from the backup, so it never stacks.
Mix rule from the study: an event table timed to the picture, SFX ~6 dB under the lead, true peak <= -1 dBTP.
"""
import json, os, shutil, sys
import numpy as np, soundfile as sf

DB = {"clap": -20, "pop": -22, "chime": -24, "quack": -20}


def synth(kind, sr, seed=0):
    r = np.random.default_rng(seed)
    t = lambda d: np.arange(int(sr * d)) / sr
    if kind == "clap":       # two quick filtered-noise bursts, short decay: a little hand clap, not a snare
        x = np.zeros(int(sr * 0.18))
        for o in (0.0, 0.012):
            n = r.standard_normal(int(sr * 0.15)) * np.exp(-t(0.15) / 0.022)
            i = int(o * sr); x[i:i + len(n)] += n[: len(x) - i]
        X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr)
        x = np.fft.irfft(X * np.exp(-((np.log(f + 1) - np.log(1600)) ** 2) / 0.5), len(x))  # band around 1.6 kHz
    elif kind == "pop":
        tt = t(0.09); x = np.sin(2 * np.pi * np.cumsum(600 - 300 * tt / 0.09) / sr) * np.sin(np.pi * tt / 0.09) ** 0.5
    elif kind == "chime":
        tt = t(1.2); x = sum(a * np.sin(2 * np.pi * fr * tt) * np.exp(-tt / d) for fr, a, d in ((1568, 1, 0.5), (2352, 0.5, 0.3), (3136, 0.3, 0.2)))
        x *= np.minimum(1, tt / 0.004)
    elif kind == "quack":    # toy duck: buzzy 480 Hz tone, falling pitch, nasal formant
        tt = t(0.16); ph = 2 * np.pi * np.cumsum(480 - 120 * tt / 0.16) / sr
        x = np.sign(np.sin(ph)) * 0.6 + np.sin(2 * ph) * 0.4
        X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr)
        x = np.fft.irfft(X * (np.exp(-((f - 1100) / 450) ** 2) + 0.3 * np.exp(-((f - 2600) / 600) ** 2)), len(x)) * np.sin(np.pi * tt / 0.16) ** 0.7
    else:
        raise SystemExit(f"unknown sfx kind {kind!r} (clap, pop, chime, quack)")
    return x / (np.abs(x).max() + 1e-12)


def events(spec):
    for e in spec:
        if "t" in e: yield e["t"], e
        else:
            n = int(round((e["to"] - e["from"]) / e["every"]))
            for i in range(n + 1): yield e["from"] + i * e["every"], e


def beat_phase(y, sr, every, hop=441):
    """Phase (s) of the beat grid with the most onset energy: half-wave-rectified frame-energy rise, summed on the grid."""
    m = y.mean(1) if y.ndim > 1 else y
    e = np.sqrt(np.mean(m[: len(m) // hop * hop].reshape(-1, hop) ** 2, axis=1))
    env, fr = np.maximum(0, np.diff(e, prepend=e[0])), sr / hop
    ph = np.arange(0, every, 0.005)
    score = [env[np.round((p + np.arange(0, len(env) / fr - every, every)) * fr).astype(int)].sum() for p in ph]
    return float(ph[int(np.argmax(score))])


def place(y, sr, spec):
    out = y.copy()
    for e in spec:
        if e.get("snap") and "every" in e:
            p = beat_phase(y, sr, e["every"]); k = round((e["from"] - p) / e["every"]); d = p + k * e["every"] - e["from"]
            e["from"] += d; e["to"] += d
    for i, (t, e) in enumerate(events(spec)):
        k = e["kind"]; s = synth(k, sr, seed=i)                     # new noise per hit, so claps don't sound looped
        s = s * 10 ** (e.get("db", DB[k]) / 20) * (1 + 0.08 * np.sin(i * 2.4))   # +-0.7 dB human variation
        a = int(t * sr)
        if a >= len(out): continue
        b = min(len(out), a + len(s))
        out[a:b] += s[: b - a, None] * [1.0, 1.0] if out.ndim > 1 else s[: b - a]
    peak = np.abs(out).max()
    if peak > 0.89: out *= 0.89 / peak                               # keep true peak under -1 dBFS
    return out


def main(song):
    spec = json.load(open(os.path.join(song, "sfx.json")))
    src, bak = os.path.join(song, "assets", "voice.wav"), os.path.join(song, "takes", "voice-presfx.wav")
    if not os.path.exists(bak): os.makedirs(os.path.dirname(bak), exist_ok=True); shutil.copy2(src, bak)
    y, sr = sf.read(bak, always_2d=True)
    out = place(y, sr, spec)
    sf.write(src, out, sr, subtype="PCM_24")
    try:
        import pyloudnorm as pyln
        print(f"wrote {src}: {sum(1 for _ in events(spec))} events, {pyln.Meter(sr).integrated_loudness(out):.1f} LUFS, peak {20 * np.log10(np.abs(out).max()):.1f} dBFS")
    except ImportError:
        print(f"wrote {src}")


def selftest():
    sr = 44100
    y = np.zeros((sr * 3, 2))
    out = place(y, sr, [{"t": 1.0, "kind": "clap"}, {"from": 2.0, "to": 2.5, "every": 0.25, "kind": "pop", "db": -6}])
    on = lambda a, b: np.abs(out[int(a * sr):int(b * sr)]).max()
    assert on(0, 0.99) == 0 and on(1.0, 1.1) > 0.05, "clap misplaced"
    assert abs(20 * np.log10(on(2.0, 2.1)) - (-6)) < 1.5, "level wrong"
    assert on(2.75, 3) == 0 and on(2.5, 2.6) > 0, "beat grid wrong (from..to inclusive)"
    for k in DB: assert np.isfinite(synth(k, sr)).all()
    beats = np.zeros((sr * 6, 2)); [beats.__setitem__(slice(int((0.13 + i * 0.5) * sr), int((0.13 + i * 0.5) * sr) + 400), 0.5) for i in range(12)]
    assert abs(beat_phase(beats, sr, 0.5) - 0.13) < 0.015, beat_phase(beats, sr, 0.5)
    print("selftest ok")


if __name__ == "__main__":
    selftest() if sys.argv[1:] == ["--selftest"] else main(sys.argv[1])
