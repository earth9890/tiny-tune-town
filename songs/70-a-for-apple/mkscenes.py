"""fill the LC block of scenes.js from script.json: python3 mkscenes.py  (letter lines start with '<L> for ')"""
import json,re
s=json.load(open('script.json')); lines=[l[0] for l in s]
LC={}
for i,l in enumerate(lines,1):
    m=re.match(r"^([A-Z]) for ",l)
    if m and m[1] not in LC: LC[m[1]]=i
print(LC, "missing:", [c for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZ" if c not in LC])
