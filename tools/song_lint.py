"""Lint a song.md against the Tiny Tune Town song formula (research/cocomelon.md §6, §10).

usage: python3 tools/song_lint.py songs/<slug>/song.md      (python3 tools/song_lint.py --selftest)
Checks: type + tempo band, major key, duration 150-180 s, sung words per minute <= 75,
repeated lines >= 50 %, line length 3-8 words, >= 2 breaks with a spoken interjection.
Lines in (parentheses) are spoken/stage notes and don't count as sung words.
"""
import re, sys

BANDS = {"action": (115, 124), "routine": (92, 100), "story": (92, 100), "bedtime": (70, 80)}


def lint(text):
    head, _, lyr = text.partition("## Lyrics")
    meta = dict(re.findall(r"^\s*(type|bpm|key|duration)\s*:\s*(.+?)\s*$", head, re.M))
    lines = [l.strip() for l in lyr.splitlines() if l.strip()]
    sung = [l for l in lines if not l.startswith("[") and not l.startswith("(")]
    norm = [re.sub(r"[^a-z ]", "", l.lower()).strip() for l in sung]
    words = sum(len(l.split()) for l in norm)
    rep = sum(norm.count(l) > 1 for l in norm) / max(1, len(norm))
    dur = float(meta.get("duration", 0))
    wpm = words / (dur / 60) if dur else 999
    breaks = len(re.findall(r"^\[(instrumental|break|interlude)", lyr, re.M | re.I))
    spoken = sum(l.startswith("(") for l in lines)
    out = []  # (ok, message)
    t = meta.get("type", "?")
    band = BANDS.get(t)
    out.append((band is not None, f"type: {t} (one of {', '.join(BANDS)})"))
    if band:
        bpm = int(meta.get("bpm", 0))
        out.append((band[0] <= bpm <= band[1], f"bpm {bpm} in {t} band {band[0]}-{band[1]}"))
    out.append(("major" in meta.get("key", "").lower(), f"key {meta.get('key', '?')} is major"))
    out.append((150 <= dur <= 180, f"duration {dur:.0f} s in 150-180"))
    out.append((wpm <= 75, f"{words} sung words = {wpm:.0f} words/min (<= 75)"))
    out.append((rep >= 0.5, f"repeated lines {rep:.0%} (>= 50 %)"))
    long_ = [l for l in sung if not 3 <= len(l.split()) <= 8]
    out.append((len(long_) <= len(sung) // 5, f"{len(long_)} lines outside 3-8 words (<= 20 %)"))
    out.append((breaks >= 2 and spoken >= 2, f"{breaks} instrumental breaks, {spoken} spoken lines (>= 2 each)"))
    return out


def main():
    if "--selftest" in sys.argv:
        good = "type: routine\nbpm: 96\nkey: D Major\nduration: 170\n## Lyrics\n[intro]\n(Ooh!)\n" + (
            "[verse]\nScrub the top teeth, scrub scrub scrub\nScrub the top teeth, scrub scrub scrub\n"
            "Round and round and round we go\nSparkly clean from top to toe\n[instrumental break]\n(Wow!)\n") * 3
        assert all(ok for ok, _ in lint(good)), lint(good)
        bad = "type: bedtime\nbpm: 108\nkey: A minor\nduration: 110\n## Lyrics\n" + "\n".join(
            f"line {'ab'[i % 2] * (i + 1)} has quite a lot of different words in it" for i in range(40))
        assert [ok for ok, _ in lint(bad)] == [True] + [False] * 7, lint(bad)  # only the type line passes
        print("selftest ok")
        return
    res = lint(open(sys.argv[1]).read())
    for ok, msg in res:
        print("PASS" if ok else "FAIL", msg)
    sys.exit(0 if all(ok for ok, _ in res) else 1)


if __name__ == "__main__":
    main()
