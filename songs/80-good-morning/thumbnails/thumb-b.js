// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// 80 Good Morning Song, thumb B (no text): Mum waves beside Nomi; a big smiling morning sun rising (left-centre), Nomi singing right, word HELLO!
// Critique 1: warm sunrise yellow against sky blue; open "sing" mouth = morning greeting. Badge corner clear.
TOON = 2;
const TWORD = "";
const S = scene(0, 1, { cam: "none" });
const W0 = DS.outdoor(S, { hy: 700, sun: false, sky: "sky", ground: "grass", hills: "green" }); S.blur(W0.g, 5);
S.fill(circ(1390, 520, 560, 520), 0, 0, DS.glow(DS.P.yellow[1], 0.6), 1);
const U = G(S, null, "translate(560 470)"); S.fill(circ(0, 0, 360), 0, 0, DS.glow(DS.P.yellow[1], 0.85), 1, U);
for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; toon(S, cap(Math.cos(a) * 230, Math.sin(a) * 230, Math.cos(a) * 300, Math.sin(a) * 300, 22), "orange", { parent: U, flat: true, tone: 1, lw: DS.w.mid * 2 }); }
toon(S, circ(0, 0, 190), "yellow", { parent: U }); S.fill(circ(-66, -30, 20, 26), 0, 0, DS.c("brown", 0), 1, U); S.fill(circ(66, -30, 20, 26), 0, 0, DS.c("brown", 0), 1, U);
S.draw("M-80 40 Q0 120 80 40", 0, 0, { c: DS.c("brown", 0), w: 18, parent: U }); [-1, 1].forEach((s) => S.fill(circ(s * 120, 40, 34, 22), 0, 0, DS.c("orange", 0), 0.6, U)); toyFx(U, 9);
const M = mum(S, 1740, 1500, 1.05, { mood: "happy" }); M.arm(1, 118, 0, 0.01);
const N = toddler(S, 1390, 1250, 1.7, { mood: "sing" }); N.arm(-1, 112, 0, 0.01);
if (TWORD) S.text(TWORD, 520, 950 - 790, { size: 190, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.08); grade(S, [560, 470], 0.7);
