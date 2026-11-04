// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// 79 This Little Piggy, thumb B (no text): Dad tickles too; a giant little foot with a pink piggy popping over the big toe (left-centre), Nomi giggling right, word WEE!
// Critique 1: the foot + pink pig read as "toe game" at 168 px; giggle = delight. Living room blurred.
TOON = 2;
const TWORD = "";
const S = scene(0, 1, { cam: "none" });
const R = DS.room(S, { wall: "sky", floor: "wood", window: [1260, 150, 300, 300] }); S.blur(R.g, 6);
S.fill(circ(1390, 520, 560, 520), 0, 0, DS.glow(DS.P.yellow[1], 0.6), 1);
const D = dad(S, 1820, 1700, 1.0, { mood: "giggle", barefoot: true });
const N = toddler(S, 1390, 1250, 1.7, { mood: "giggle", barefoot: true }); N.arm(-1, 104, 0, 0.01);
const F = G(S, null, "translate(600 600) scale(0.82) rotate(-6)");
toon(S, "M-220 -250 Q-240 -360 -120 -380 Q60 -400 200 -330 Q290 -260 240 -40 Q210 160 60 320 L-180 320 Q-260 60 -220 -250 Z", "famSk1", { parent: F });
[[-150, -300, 66], [-40, -352, 52], [52, -350, 46], [132, -322, 42], [196, -276, 36]].forEach(([x, y, r]) => { toon(S, circ(x, y, r, r * 1.12), "famSk1", { parent: F, lw: DS.w.mid * 2.6 }); S.fill(circ(x, y - r * 0.45, r * 0.5, r * 0.32), 0, 0, DS.P.white[0], 0.5, F); });
toyFx(F, 9);
const P = G(S, null, "translate(430 250) scale(1.25)"); toon(S, circ(0, 0, 70, 60), "pink", { parent: P }); [-1, 1].forEach((s) => toon(S, `M${s * 30} -50 L${s * 60} -86 L${s * 66} -40 Z`, "pink", { parent: P, lw: DS.w.mid * 1.6 }));
toon(S, circ(0, 14, 28, 20), "pink", { parent: P, tone: 1, lw: DS.w.mid * 1.6 }); [-1, 1].forEach((s) => { S.fill(circ(s * 10, 14, 5, 7), 0, 0, DS.c("pink", 2), 1, P); S.fill(circ(s * 26, -16, 8, 10), 0, 0, DS.c("famHr", 2), 1, P); S.fill(circ(s * 26 + 3, -19, 3), 0, 0, DS.P.white[0], 1, P); });
toyFx(P, 6);
if (TWORD) S.text(TWORD, 760, 200, { size: 210, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.08); grade(S, [1500, 150], 0.7);
