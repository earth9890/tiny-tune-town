#!/usr/bin/env python3
"""Estimated line timings for a song that hasn't been sung yet, so scenes can be built and previewed before audio exists.

usage: python3 tools/est_timing.py songs/<slug>/song.md
Writes songs/<slug>/script.json and songs/<slug>/assets/clipt.json with "estimated": true. A sung line = 2 bars, a (spoken)
line = 1 bar, an [instrumental ...] section = 4 bars, intro lead = 2 bars, all at the song's bpm/time; stretched to
`duration:` if shorter. When the real take exists, sing.py's timings replace these and the scenes re-time automatically
(cues are W(line, word)), so nothing here is final.
"""
import json, pathlib, re, sys

song = pathlib.Path(sys.argv[1])
real = song.parent / 'assets' / 'clipt.json'
if real.exists() and not json.loads(real.read_text()).get('estimated'):
    sys.exit(f'{real} holds REAL sung timings; refusing to overwrite them with estimates')
text = song.read_text()
head, _, lyr = text.partition('## Lyrics')
meta = dict(re.findall(r'^(\w+):\s*(.+)$', head, re.M))
bpm, beats, dur = float(meta.get('bpm', 100)), int(meta.get('time', 4)), float(meta.get('duration', 170))
bar = beats * 60 / bpm
items, t, section = [], 2 * bar, ''  # (text, start, end)
for raw in lyr.splitlines():
    line = raw.strip()
    if not line:
        continue
    if line.startswith('['):
        section = line.lower()
        if 'instrumental' in section or 'break' in section:
            t += 4 * bar
        continue
    spoken = line.startswith('(')
    words = line.strip('()')
    d = (1 if spoken else 2) * bar
    items.append([words, t, t + d * 0.92])
    t += d
total = max(t + 2 * bar, dur)
k = total / (t + 2 * bar)  # stretch to the planned duration
clips = [[round(s * k, 2), round(e * k, 2)] for _, s, e in items]
(song.parent / 'assets').mkdir(exist_ok=True)
(song.parent / 'script.json').write_text(json.dumps([[w, 0.2] for w, _, _ in items], indent=0))
(song.parent / 'assets' / 'clipt.json').write_text(json.dumps({'clips': clips, 'total': round(total, 2), 'estimated': True}))
print(f'{song.parent.name}: {len(items)} lines, {total:.1f} s (estimated at {bpm:g} bpm)')
