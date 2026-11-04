"""python3 tools/mkpackage.py songs/<slug> spec.json  ->  package.md + renders/upload.json
spec: title, intro, actions[], groups[] (sizes of lyric groups over script.json lines; first_line optional extra sung line), credit, playlist ("classic"|"counting"|"routine"|"bedtime"), tags, hashtags, thumb_note, video"""
import json, sys, pathlib
d = pathlib.Path(sys.argv[1]); s = json.load(open(sys.argv[2])); lines = [l[0] for l in json.load(open(d / "script.json"))]
PL = {"classic": "▶ More Classic Nursery Rhymes: https://www.youtube.com/playlist?list=PLNnT4NOX4EQ0",
      "counting": "▶ More Counting, Colours & Animal songs: https://www.youtube.com/playlist?list=PLZxr7vxMFCu8",
      "routine": "▶ More Good Habits & Routine songs: https://www.youtube.com/playlist?list=PLI5o2ScGwyV4",
      "bedtime": "▶ More Bath Time & Bedtime songs: https://www.youtube.com/playlist?list=PLbjNqaw4s4tE"}
out, i = ([s["first_line"], ""] if s.get("first_line") else []), 0
for g in s["groups"]:
    out += lines[i:i + g] + [""]; i += g
assert i == len(lines), (i, len(lines))
desc = (s["intro"] + "\n\nSing and move along:\n" + "\n".join("- " + a for a in s["actions"]) + "\n\nLyrics:\n" + "\n".join(out).strip() + "\n\n" + s["credit"] + "\n\n" + PL[s["playlist"]] +
        "\n▶ All Tiny Tune Town songs: https://www.youtube.com/playlist?list=PLWVpmoCLJH68\n▶ Subscribe: https://www.youtube.com/@TinyTuneTownSings?sub_confirmation=1\n\nAbout Tiny Tune Town: calm, colourful sing-alongs for toddlers and preschoolers — clear words, gentle pacing, no flashing, and songs that help with everyday routines.\n\n" + s["hashtags"])
assert len(desc) <= 5000 and "<" not in desc and ">" not in desc and len(s["tags"]) <= 500 and len(s["title"]) <= 100, (len(desc), len(s["tags"]), len(s["title"]))
(d / "renders").mkdir(exist_ok=True)
json.dump({"title": s["title"], "desc": desc, "tags": s["tags"]}, open(d / "renders/upload.json", "w"), ensure_ascii=False)
(d / "package.md").write_text(f"# Package: {d.name}\n\n## Title\n{s['title']}  ({len(s['title'])} characters)\n\nVideo file: `renders/{s['video']}`. Duration: {s['dur']}.\n\nThumbnail: `thumbnails/a.png` ({s['thumb_note']}).\n\nPlaylists: All + {s['playlist'].title()}. {s.get('why','')}\n\n## Description\n{desc}\n\n## Tags ({len(s['tags'])} characters)\n{s['tags']}\n")
print("ok", len(desc), len(s["tags"]), len(s["title"]))
