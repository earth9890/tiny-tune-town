// CRITIQUE r1 4/4/5/4/5/4/4/5/5 (absurd moment, honest gag); r2: text off the face, props trimmed -> final (shipped as b.png, Test & Compare slot)
// look: still
// @include ../../../tools/cast.js
// C (absurd moment): a tower of eight shoes balanced on Ollie's head, wide eyes, "8 SHOES!" top-left. Badge bottom-left.
const shoeAt = (S, parent, x, y, dir, col, k, t) => {
  const [, g] = popIn(S, t, x, y, parent), s = G(S, g, `translate(${x} ${y}) scale(${dir * k} ${k})`);
  DS.shape(S, "M-40 14 L-40 -20 Q-38 -30 -24 -30 L-4 -30 Q2 -8 28 -4 Q48 -2 48 14 Z", col, { parent: s, w: "mid" });
  DS.shape(S, rrect(-44, 10, 96, 18, DS.r.xs), "white", { parent: s, w: "detail" });
  DS.shape(S, rrect(-24, -16, 38, 11, DS.r.xs), "white", { parent: s, w: "hair", flat: true });
  DS.shape(S, rrect(6, -22, 13, 22, DS.r.xs), "gold", { parent: s, w: "detail" });
  return g;
};
const S = scene(0, 1, { cam: "none" }); DS.room(S, { window: false }); DS.rug(S, 960, 1000, 1500, "red");
const O = ollie(S, 1240, 1280, 2.0, { mouth: "open", look: 0 });
[[0, -560, "red"], [-80, -560, "sky"], [80, -560, "purple"], [0, -640, "orange"], [-60, -720, "red"], [60, -720, "sky"], [0, -800, "purple"], [0, -880, "orange"]].forEach(([x, y, c]) => shoeAt(S, O.body, x, y, 1, c, 1.5, 0));
const C = ["red", "sky", "purple", "orange", "red", "sky", "purple", "orange"];
O.arms.forEach((A, i) => { let x, y; if (A.ai === 3) { [x, y] = O.holdAt(A, -250); } else { O.raise(A, [125, 98, 72][A.ai], 0, 0.01); [x, y] = O.tipNow(A, 30); } shoeAt(S, O.body, x, y, 1, C[i], 1.3, 0); });
S.text("8 SHOES!", 470, 250, { size: 200, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
