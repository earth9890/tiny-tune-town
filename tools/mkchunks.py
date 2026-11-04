"""python3 tools/mkchunks.py <slug> "c1:0-3:45;c2:4-7:40" -> songs/<slug>/chunks/<c>/song.md with sections [a..b] of the full song and a shorter duration"""
import re, sys, os
slug, spec = sys.argv[1], sys.argv[2]
d = f"songs/{slug}"; text = open(f"{d}/song.md").read()
head, _, lyr = text.partition("## Lyrics")
secs = re.findall(r"^\[[^\]]+\]\n(?:.*\n?)*?(?=^\[|\Z)", lyr, flags=re.M)
for item in spec.split(";"):
    name, rng, dur = item.split(":"); a, b = map(int, rng.split("-"))
    h = re.sub(r"duration: *\d+", f"duration: {dur}", head)
    os.makedirs(f"{d}/chunks/{name}", exist_ok=True)
    open(f"{d}/chunks/{name}/song.md", "w").write(h + "## Lyrics\n" + "".join(s.rstrip() + "\n\n" for s in secs[a:b + 1]))
    print(name, [s.split("\n")[0] for s in secs[a:b + 1]])
