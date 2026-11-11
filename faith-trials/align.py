# align each chunk's whisper words to the target lines; prints/returns line start/end times. usage: align.py chunk seed
import json, re, sys, difflib
def norm(s): return re.sub(r"[^a-z]", "", s.lower().replace("'", ""))
def align(chunk, seed, lines):
    d = json.load(open(f"{chunk}/takes/take-{seed}-1.en.json"))
    W = [(norm(w["word"]), w["start"], w["end"]) for s in d["segments"] for w in s["words"] if norm(w["word"])]
    T = [(li, norm(t)) for li, l in enumerate(lines) for t in re.split(r"[\s,-]+", l) if norm(t)]
    n, m = len(T), len(W); G = -0.35
    sc = lambda a, b: difflib.SequenceMatcher(None, a, b).ratio() * 2 - 1 if a and b else -1
    F = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1): F[i][0] = i * G
    for j in range(1, m + 1): F[0][j] = 0   # free leading transcript junk
    for i in range(1, n + 1):
        for j in range(1, m + 1): F[i][j] = max(F[i-1][j-1] + sc(T[i-1][1], W[j-1][0]), F[i-1][j] + G, F[i][j-1] + G * 0.2)
    i, j = n, max(range(m + 1), key=lambda j: F[n][j]); pairs = []
    while i > 0 and j > 0:
        if abs(F[i][j] - (F[i-1][j-1] + sc(T[i-1][1], W[j-1][0]))) < 1e-9: 
            if sc(T[i-1][1], W[j-1][0]) > 0.3: pairs.append((T[i-1][0], W[j-1][1], W[j-1][2]))
            i -= 1; j -= 1
        elif abs(F[i][j] - (F[i-1][j] + G)) < 1e-9: i -= 1
        else: j -= 1
    L = {}
    for li, s, e in pairs: a = L.setdefault(li, [s, e]); a[0] = min(a[0], s); a[1] = max(a[1], e)
    return [L.get(k) for k in range(len(lines))]
if __name__ == "__main__":
    c, s = sys.argv[1], sys.argv[2]
    lines = [l for l in open(f"{c}/song.md").read().split("## Lyrics")[1].splitlines() if l.strip() and not l.startswith("[")]
    for l, t in zip(lines, align(c, s, lines)): print(t, l)
