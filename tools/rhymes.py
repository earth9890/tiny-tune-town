"""Public-domain nursery-rhyme library (research/rhymes/rhymes.jsonl): build it, search it, print a rhyme.

usage (from the repo root):
  python3 tools/rhymes.py tag animals [--safe]         rhymes with a theme tag (--safe: hide kid_safe=false)
  python3 tools/rhymes.py word star                    rhymes whose text contains a word
  python3 tools/rhymes.py show twinkle                 print rhymes whose title matches
  python3 tools/rhymes.py pairs [tag]                  most-used perfect rhyme pairs (cat/hat ...), optionally in one tag
  python3 tools/rhymes.py rhyme cat hat                do two words rhyme? + CMU rhyming part
  python3 tools/rhymes.py tags                         tag counts
  python3 tools/rhymes.py build                        re-parse research/rhymes/raw/*.txt (Project Gutenberg)
  python3 tools/rhymes.py --selftest
"""
import collections, json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from song_lint import end_word, rhymes, syllables  # noqa: E402

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "research", "rhymes")
DB = os.path.normpath(os.path.join(ROOT, "rhymes.jsonl"))
# Gutenberg ebook -> (book, year of this edition, url). All published before 1929, public domain.
SOURCES = {
    "pg10607": ("The Real Mother Goose, ill. Blanche Fisher Wright (Rand McNally)", 1916, "https://www.gutenberg.org/ebooks/10607"),
    "pg23794": ("Mother Goose or the Old Nursery Rhymes, ill. Kate Greenaway (Warne)", 1881, "https://www.gutenberg.org/ebooks/23794"),
    "pg24623": ("Mother Goose, ill. Frederick Richardson (Volland)", 1915, "https://www.gutenberg.org/ebooks/24623"),
    "pg4901": ("The Only True Mother Goose Melodies (Munroe & Francis, Boston)", 1833, "https://www.gutenberg.org/ebooks/4901"),
    "pg32415": ("The Nursery Rhymes of England, J. O. Halliwell (1842; Warne edition)", 1886, "https://www.gutenberg.org/ebooks/32415"),
}
TAGS = {
    "animals": r"cat|kitten|pussy|dog|puppy|pig|cow|sheep|lamb|horse|pony|mouse|mice|hen|chick|duck|goose|bird|robin|wren|crow|"
               r"owl|cock|rooster|bee|spider|fish|frog|rabbit|bunny|bear|fox|goat|donkey|calf|lark|sparrow|swan|snail|squirrel|ladybird",
    "counting": r"one|two|three|four|five|six|seven|eight|nine|ten|twenty|score|dozen|count",
    "bedtime": r"sleep|bed|night|moon|star|lullaby|bye|dream|rock|cradle|hush|candle|o'clock",
    "weather": r"rain|sun|snow|wind|blow|shower|cloud|frost|cold|storm|rainbow|weather|winter|summer|spring",
    "food": r"pie|cake|bun|bread|plum|pudding|porridge|milk|cheese|egg|apple|pear|cherry|tart|honey|butter|jam|soup|sugar|candy|tea|muffin|corn",
    "play": r"play|dance|ball|jump|hop|skip|game|ring|round|swing|hide|seek|run|ride|clap|merry|fun|sing|whistle|fiddle|drum",
    "body": r"head|nose|toe|toes|finger|hand|hands|eye|eyes|ear|ears|feet|foot|knee|chin|cheek|mouth|teeth|hair|thumb|tummy|arm",
    "family": r"mother|father|mammy|mamma|mama|papa|daddy|baby|sister|brother|grandma|granny|dame|son|daughter|wife",
    "clothes": r"shoe|shoes|hat|coat|gown|stocking|sock|mitten|bonnet|shirt|boots|petticoat|cap|dress",
    "travel": r"market|town|horse|ship|boat|sail|sea|road|london|cross|went|going|coach|cart",
    "nature": r"tree|flower|rose|garden|grass|hill|wood|field|meadow|river|brook|well|leaf|leaves|green",
    "music": r"sing|song|fiddle|piper|pipe|drum|bell|bells|music|tune|play",
}
ACTIONS = r"clap|pat|jump|hop|skip|dance|roll|stamp|tap|nod|bow|curtsey|march|row|swim|spin|turn|tickle|rock|fall down|all fall|bake|knock|ring|stir|shake|wave"
DARK = r"\bdie[sd]?\b|\bdead\b|\bkill|\bhang|\bwhip|\bbeat\b|\bbeat her|\bcut off|\bdevil|\bgun\b|\bshot\b|\bdrown|\bblood|\bgrave\b|\bbury|\bburied|\bthief|\brobbers?\b|\bwhipped|\bthrash"
CLASS_TAG = {"LULLABIES": "bedtime", "GAMES": "play", "RIDDLES": "riddle", "JINGLES": "jingle", "NATURAL HISTORY": "animals",
             "ACCUMULATIVE": "cumulative", "PROVERBS": "proverb", "SCHOLASTIC": "school", "CHARMS": "charm"}


def scheme(lines):
    """Rhyme letters for one stanza: AABB, ABCB ... (a repeated end word counts as the same sound)."""
    ends, out = [end_word(l).lower() for l in lines], ""
    for i, e in enumerate(ends):
        j = next((j for j in range(i) if e == ends[j] or rhymes(e, ends[j])), None)
        out += out[j] if j is not None else chr(65 + len(set(out)))
    return out


def pairs(lines):
    """Perfect rhyme pairs among line ends that sit 1 or 2 lines apart (couplets and alternate rhymes)."""
    ends = [end_word(l).lower() for l in lines]
    return sorted({tuple(sorted((a, b))) for i, a in enumerate(ends) for b in ends[i + 1:i + 3] if rhymes(a, b)})


def blocks(path):
    """Yield (heading, verse lines) blocks from one Gutenberg text; blocks are separated by 2+ blank lines."""
    t = open(path, encoding="utf-8-sig").read().replace("\r\n", "\n")
    t = t.split("*** START OF", 1)[-1].split("\n", 1)[-1].split("*** END OF", 1)[0]
    t = re.sub(r"\[(Illustration|Footnote)[^\]]*\]", "", t, flags=re.S)
    t = re.sub(r"(?m)^[ \t]*\[[^\]\n]*\][ \t]*$", "", t)  # riddle answers like [Isabel.]
    for b in re.split(r"\n[ \t]*\n[ \t]*\n+", t):
        lines = [l.rstrip() for l in b.strip("\n").split("\n")]
        head = ""
        while lines and (not lines[0].strip() or re.fullmatch(r"[IVXLCDM]+\.", lines[0].strip())
                         or (lines[0].strip().upper() == lines[0].strip() and re.search(r"[A-Z]", lines[0]))):
            head = lines.pop(0).strip() or head
        yield head, lines


def build():
    seen, out = {}, []
    for src, (book, year, url) in SOURCES.items():
        cls = ""
        for head, lines in blocks(os.path.join(ROOT, "raw", src + ".txt")):
            if "CLASS--" in head:
                cls = head.split("--")[1].rstrip(".")
            sung = [l.strip() for l in lines if l.strip()]
            # ponytail: verse = 2-40 short lines, most ending in punctuation; drops prefaces, tales, TOCs, indexes
            if not 2 <= len(sung) <= 40 or max(map(len, sung)) > 72 or "_" in "".join(sung) \
                    or sum(bool(re.search(r"[,.;:!?'\"\-)]$", l)) for l in sung) < 0.6 * len(sung) \
                    or any(re.search(r"\d{2,}|gutenberg|chapter|preface", l, re.I) for l in sung):
                continue
            key = re.sub(r"[^a-z]", "", " ".join(sung[0].split()[-2:]) + sung[1]).lower()[:30]  # skips spelling variants like Bah/Baa
            if key in seen:
                seen[key]["also_in"].append(f"{book} ({year})")
                continue
            text = "\n".join(l.strip() for l in lines).strip()
            stanza = [l.strip() for l in text.split("\n\n")[0].split("\n") if l.strip()]
            words = text.lower()
            tags = [k for k, rx in TAGS.items() if re.search(rf"\b({rx})\b", words)]
            tags += [CLASS_TAG[c] for c in CLASS_TAG if c in cls]
            pr = pairs(sung)
            if not pr:  # no perfect rhyme anywhere: not useful as a rhyme model
                continue
            title = head.title() if head and not re.fullmatch(r"[IVXLCDM]+\.", head) else re.sub(r"[,;:.!?]+$", "", sung[0])
            r = {"id": f"{src}-{len(out) + 1:04d}", "title": title, "text": text, "source": book, "year": year, "url": url,
                 "lines": len(sung), "syllables_per_line": round(sum(map(syllables, sung)) / len(sung), 1),
                 "scheme": scheme(stanza[:8]), "rhyme_pairs": [list(p) for p in pr], "tags": sorted(set(tags)),
                 "actions": sorted(set(re.findall(rf"\b({ACTIONS})\b", words))),
                 "kid_safe": not re.search(DARK, words), "also_in": []}
            seen[key] = r
            out.append(r)
    with open(DB, "w") as f:
        f.writelines(json.dumps(r, ensure_ascii=False) + "\n" for r in out)
    print(f"wrote {len(out)} rhymes to {DB}")
    print(collections.Counter(r["source"].split(",")[0] for r in out))


def load():
    return [json.loads(l) for l in open(DB)]


def show(r):
    print(f"## {r['title']}  [{r['id']}, {r['source']} {r['year']}]")
    print(f"   scheme {r['scheme']}, {r['lines']} lines, {r['syllables_per_line']} syll/line, tags {','.join(r['tags'])}"
          f"{', actions ' + ','.join(r['actions']) if r['actions'] else ''}{'' if r['kid_safe'] else ', NOT kid-safe'}")
    print("   " + r["text"].replace("\n", "\n   ") + "\n")


def main(a):
    if a[0] == "--selftest":
        assert scheme(["The cat sat", "on a hat", "the dog ran", "to the van"]) == "AABB"
        assert scheme(["Baa baa black sheep", "have you any wool", "yes sir yes sir", "three bags full"]) == "ABCB"
        assert pairs(["Hey diddle diddle", "the cat and the fiddle", "the cow jumped over the moon"]) == [("diddle", "fiddle")]
        heads = [h for h, _ in blocks(os.path.join(ROOT, "raw", "pg10607.txt"))]
        assert "BAA, BAA, BLACK SHEEP" in heads, heads[:20]
        print("selftest ok")
    elif a[0] == "build":
        build()
    elif a[0] == "tags":
        print(collections.Counter(t for r in load() for t in r["tags"]).most_common())
    elif a[0] == "rhyme":
        from song_lint import pron
        print(rhymes(a[1], a[2]), pron(a[1]), pron(a[2]))
    elif a[0] == "pairs":
        rs = [r for r in load() if len(a) < 2 or a[1] in r["tags"]]
        for (x, y), n in collections.Counter(tuple(p) for r in rs for p in r["rhyme_pairs"]).most_common(60):
            print(f"{n:3} {x}/{y}")
    else:
        q = a[1].lower()
        hit = {"tag": lambda r: q in r["tags"], "word": lambda r: re.search(rf"\b{re.escape(q)}\b", r["text"].lower()),
               "show": lambda r: q in r["title"].lower()}[a[0]]
        rs = [r for r in load() if hit(r) and (r["kid_safe"] or "--safe" not in a)]
        for r in rs if a[0] == "show" else []:
            show(r)
        for r in rs if a[0] != "show" else []:
            print(f"{r['id']}  {r['scheme']:<8} {r['title'][:50]}")
        print(f"{len(rs)} rhymes")


if __name__ == "__main__":
    main(sys.argv[1:]) if sys.argv[1:] else print(__doc__)
