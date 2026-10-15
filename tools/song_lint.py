"""Lint a song.md against the Tiny Tune Town song formula (research/cocomelon.md §6, §10).

usage: python3 tools/song_lint.py songs/<slug>/song.md      (python3 tools/song_lint.py --selftest)
Checks: type + tempo band, major key, duration 150-180 s, sung words per minute <= 75,
repeated lines >= 50 %, line length 3-8 words, >= 2 breaks with a spoken interjection,
every verse rhymes (AABB or ABCB, perfect rhymes), <= 20 % of lines over 8 syllables.
A public-domain original's own near rhymes can be allowed in the header: "rhyme-ok: dame/lane".
Lines in (parentheses) are spoken/stage notes and don't count as sung words.
Rhymes and syllables come from the CMU Pronouncing Dictionary (cmu-rhymes.tsv.gz next to this file:
word, syllables, rhyming part = the sounds from the last stressed vowel to the end).
"""
import gzip, os, re, sys

BANDS = {"action": (115, 124), "routine": (92, 100), "story": (92, 100), "bedtime": (70, 80)}
CMU = None
EXTRA = {"baa": (1, "AA"), "mmm": (1, "AH M"), "oink": (1, "OY NG K")}  # sound words CMU lacks or gets wrong


def pron(word):
    """(syllables, rhyming part) for one word; spelling guess for words not in the CMU dictionary."""
    global CMU
    if CMU is None:
        with gzip.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "cmu-rhymes.tsv.gz"), "rt") as f:
            CMU = {w: (int(n), r) for w, n, r in (row.rstrip("\n").split("\t") for row in f)}
    w = re.sub(r"[^a-z']", "", word.lower()).strip("'")
    if w in EXTRA or w in CMU:
        return EXTRA.get(w) or CMU[w]
    groups = re.findall(r"[aeiouy]+", w) or [w]
    return len(groups), w[w.rfind(groups[-1]):]  # ponytail: spelling rime, fine for made-up names


ALLOW = set()  # near-rhyme pairs a public-domain original really uses, from a song.md header line "rhyme-ok: dame/lane, ..."


def rhymes(a, b):
    """Perfect rhyme: same sounds from the last stressed vowel on (cat/hat, bed/head). The same word twice is not a rhyme."""
    a, b = (re.sub(r"[^a-z']", "", x.lower()) for x in (a, b))
    return a != b and (pron(a)[1] == pron(b)[1] or {a, b} in [set(p) for p in ALLOW])


def syllables(line):
    return sum(pron(w)[0] for w in re.findall(r"[A-Za-z']+", line))


def end_word(line):
    return (re.findall(r"[A-Za-z']+", line) or [""])[-1]


def verse_ok(v):
    """4 lines: AABB or ABCB (so ABAB and AAAA pass too). 2 or 3 lines: the last two rhyme."""
    e = [end_word(l) for l in v]
    if len(e) == 4:
        return (rhymes(e[0], e[1]) and rhymes(e[2], e[3])) or rhymes(e[1], e[3])
    return len(e) < 2 or rhymes(e[-2], e[-1])


def verses(lyr):
    """Sung lines of every lyric section, in groups of 4."""
    out = []
    for sec in re.split(r"^\[.*\]\s*$", lyr, flags=re.M):
        sung = [l.strip() for l in sec.splitlines() if l.strip() and not l.strip().startswith("(")]
        out += [sung[i:i + 4] for i in range(0, len(sung), 4)]
    return out


def lint(text):
    head, _, lyr = text.partition("## Lyrics")
    meta = dict(re.findall(r"^\s*(type|bpm|key|duration|rhyme-ok)\s*:\s*(.+?)\s*$", head, re.M))
    ALLOW.clear()
    ALLOW.update(tuple(p.strip().lower().split("/")) for p in meta.get("rhyme-ok", "").split(",") if "/" in p)
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
    bad = [v for v in verses(lyr) if not verse_ok(v)]
    out.append((not bad, f"{len(bad)} verses don't rhyme (AABB or ABCB, perfect rhymes)"
                + "".join(f"\n     ends: {' / '.join(end_word(l) for l in v)}" for v in bad)))
    over = [l for l in sung if syllables(l) > 8]
    avg = sum(map(syllables, sung)) / max(1, len(sung))
    out.append((len(over) <= len(sung) // 5, f"{len(over)} lines over 8 syllables (<= 20 %), {avg:.1f} per line on average (aim 4-6)"
                + "".join(f"\n     {syllables(l)}: {l}" for l in dict.fromkeys(over))))
    return out


def main():
    if "--selftest" in sys.argv:
        assert all(rhymes(a, b) for a, b in [("cat", "hat"), ("bed", "head"), ("star", "far"), ("wool", "full"),
                                              ("go", "toe"), ("you", "blue"), ("Ollie", "jolly"), ("baa", "ma")])
        assert not any(rhymes(a, b) for a, b in [("sheep", "wool"), ("round", "round"), ("scrub", "shine"),
                                                  ("round", "down"), ("bite", "mmm"), ("full", "baa")])
        assert syllables("Twinkle, twinkle, little star") == 7 and syllables("Baa baa black sheep") == 4
        assert verse_ok(["Up and down", "Brush the top", "Round and round", "Then we stop"])  # ABCB
        assert verse_ok(["The cat sat", "on a hat", "the dog ran", "to the van"])  # AABB
        assert not verse_ok(["Brush the top teeth, scrub scrub scrub", "Swish swish swish, round and round",
                             "Brush the top teeth, scrub scrub scrub", "Brush brush, sparkle and shine!"])
        good = "type: routine\nbpm: 96\nkey: D Major\nduration: 170\n## Lyrics\n[intro]\n(Ooh!)\n" + (
            "[verse]\nBrush, brush, brush your teeth\nUp and down we go\nBrush, brush, brush your teeth\n"
            "Clean from top to toe\n[instrumental break]\n(Wow!)\n") * 3
        assert all(ok for ok, _ in lint(good)), lint(good)
        dame = "## Lyrics\n[verse]\nOne for the master\nOne for the dame\nOne for the little boy\nWho lives down the lane\n"
        assert not lint(dame)[-2][0] and lint("rhyme-ok: dame/lane\n" + dame)[-2][0]
        bad = "type: bedtime\nbpm: 108\nkey: A minor\nduration: 110\n## Lyrics\n" + "\n".join(
            f"line {'ab'[i % 2] * (i + 1)} has quite a lot of different words in it" for i in range(40))
        assert [ok for ok, _ in lint(bad)] == [True] + [False] * 9, lint(bad)  # only the type line passes
        print("selftest ok")
        return
    res = lint(open(sys.argv[1]).read())
    for ok, msg in res:
        print("PASS" if ok else "FAIL", msg)
    sys.exit(0 if all(ok for ok, _ in res) else 1)


if __name__ == "__main__":
    main()
