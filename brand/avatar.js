// look: still
// @include ../tools/cast.js
// @include ../tools/family.js
// AVATAR (2026-11 family brand): square crop x 420–1500, circle-safe; Nomi's face fills it (old Ollie version: avatar-ollie.js)
TOON = 2;
const S = scene(0, 1, { cam: "none" });
S.fill("M-200 -200 H2120 V1280 H-200 Z", 0, 0, DS.vgrad(DS.P.sky[1], DS.P.sky[0]), 1);
S.fill(circ(960, 520, 620, 560), 0, 0, DS.glow(DS.P.yellow[1], 0.85), 1);
const note = (x, y, k, c) => { const g = G(S, null, `translate(${x} ${y}) rotate(-12) scale(${k})`);
  toon(S, circ(0, 0, 30, 24) + " " + rrect(18, -110, 14, 112, 7) + " " + "M24 -112 Q70 -96 64 -52 Q52 -80 26 -84 Z", c, { parent: g, lw: DS.w.mid * 2.2 }); toyFx(g, 6); };
note(560, 360, 1.1, "pink"); note(1380, 300, 0.9, "famTeal"); note(1430, 760, 0.8, "orange");
const N = toddler(S, 960, 1400, 2.0, { mood: "sing" });
DS.vignette(S, 0.06);
