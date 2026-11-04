// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// 77 Hot Cross Buns, thumb B (no text): Nomi + Mum (face ~46 %, right 40 %) at a giant tray of hot cross buns (left-centre), word YUM!
// Critique 1: buns read at 168 px (gold + white cross, dark tray). Kitchen blurred so the face pops. Badge corner clear.
TOON = 2;
const TWORD = "";
const S = scene(0, 1, { cam: "none" });
const R = DS.room(S, { wall: "wall", floor: "floor", window: [520, 170, 300, 280] }); S.blur(R.g, 6);
S.fill(circ(1390, 520, 560, 520), 0, 0, DS.glow(DS.P.yellow[1], 0.6), 1);
const M = mum(S, 1740, 1500, 1.05, { mood: "happy" });
const N = toddler(S, 1390, 1250, 1.7, { mood: "oh" }); N.arm(-1, 104, 0, 0.01);
const P = G(S, null, "translate(600 520) rotate(-6)"); toon(S, rrect(-330, 40, 660, 60, DS.r.md), "gray", { parent: P });
[[-200, -10], [0, -20], [200, -10], [-100, -130], [100, -130]].forEach(([x, y]) => { const b = G(S, P, `translate(${x} ${y})`); toon(S, circ(0, 0, 110, 88), "gold", { parent: b, lw: DS.w.mid * 3 });
  S.fill(circ(-40, -42, 36, 15), 0, 0, DS.P.white[0], 0.45, b); S.draw("M-62 -8 Q0 -22 62 -8 M-8 -68 Q-4 0 0 66", 0, 0, { c: DS.P.white[0], w: 24, parent: b }); });
[[-300, -200], [280, -230]].forEach(([x, y]) => S.draw(`M${x} ${y + 60} q-20 -34 0 -68 q20 -34 0 -68`, 0, 0, { c: DS.P.white[0], w: 16, parent: P, op: 0.85 }));
toyFx(P, 9);
if (TWORD) S.text(TWORD, 430, 200, { size: 210, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.08); grade(S, [1500, 150], 0.7);
