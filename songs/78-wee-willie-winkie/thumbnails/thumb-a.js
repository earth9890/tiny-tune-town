// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// 78 Wee Willie Winkie, thumb A: night sky, a big smiling moon + glowing lantern (left-centre), Nomi's happy face right, word SHH!
// Critique 1: deep blue ground, bright face + yellow moon = max contrast. Calm, cosy (bedtime), no scary dark.
TOON = 2;
const TWORD = "SHH!";
const S = scene(0, 1, { cam: "none" });
const W0 = DS.outdoor(S, { hy: 760, sky: "night", ground: "green", hills: "navy", sun: false }); S.blur(W0.g, 4);
[[200, 420, 22], [380, 600, 16], [880, 160, 18], [1060, 300, 14], [1780, 120, 20], [1820, 420, 14]].forEach(([x, y, r]) => twinkle(S, x, y, r * 1.8));
S.fill(circ(1390, 520, 580, 540), 0, 0, DS.glow(DS.P.yellow[1], 0.45), 1);
const M = G(S, null, "translate(560 520)"); S.fill(circ(0, 0, 330), 0, 0, DS.glow(DS.P.yellow[1], 0.6), 1, M); toon(S, circ(0, 0, 200), "yellow", { parent: M, tone: 1 });
S.fill(circ(-70, -30, 22), 0, 0, DS.c("gold", 2), 1, M); S.fill(circ(70, -30, 22), 0, 0, DS.c("gold", 2), 1, M); S.draw("M-80 50 Q0 110 80 50", 0, 0, { c: DS.c("gold", 2), w: 18, parent: M });
[-1, 1].forEach((s) => S.fill(circ(s * 120, 40, 34, 22), 0, 0, DS.c("pink", 0), 0.6, M)); toyFx(M, 9);
const N = toddler(S, 1390, 1250, 1.7, { mood: "giggle", pj: true }); N.arm(-1, 112, 0, 0.01);
if (TWORD) S.text(TWORD, 430, 200, { size: 210, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.08); grade(S, [560, 520], 0.6);
