// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// Option check: pj (Nomi, Kofi), barefoot (Nomi, Dad), bare (bath), sleeves pushed up (Dad), wave + clap poses on the kids.
TOON = 2;
const S = scene(0, 1, { cam: "none" });
S.fill("M-200 -200 H2120 V1280 H-200 Z", 0, 0, DS.vgrad(DS.P.sky[1], DS.P.paper[0]), 1);
const a = toddler(S, 200, 920, 0.95, { pj: true, mood: "sleepy" });
const b = sibling(S, 520, 920, 0.8, { pj: true }); b.arm(1, 118, 0, 0.01);
const c = toddler(S, 860, 920, 0.95, { barefoot: true, mood: "giggle" }); [-1, 1].forEach((s) => c.arm(s, -Math.asin((86 - 30 * 0.85) / 128) * 180 / Math.PI, 0, 0.01));
const d = dad(S, 1230, 920, 0.62, { barefoot: true, sleeves: 0.42 }); d.arm(-1, 118, 0, 0.01);
const e = toddler(S, 1650, 920, 0.95, { bare: true, mood: "oh" }); e.arm(-1, 118, 0, 0.01); e.arm(1, 118, 0, 0.01);
[["pj", 200], ["pj", 520], ["barefoot + clap", 860], ["barefoot, sleeves", 1230], ["bare (bath)", 1650]].forEach(([t, x]) => DS.card(S, t, x, 1010, { size: DS.type.caption }));
