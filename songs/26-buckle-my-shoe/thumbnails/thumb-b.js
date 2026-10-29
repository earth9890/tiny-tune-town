// look: still
// @include ../../../tools/cast.js
// B (friend, no text): Ollie's "oh!" face right with shoes on four arms; Bibi knocking at the open door on the left; no text. Badge bottom-left.
const shoeAt = (S, parent, x, y, dir, col, k, t) => {
  const [, g] = popIn(S, t, x, y, parent), s = G(S, g, `translate(${x} ${y}) scale(${dir * k} ${k})`);
  DS.shape(S, "M-40 14 L-40 -20 Q-38 -30 -24 -30 L-4 -30 Q2 -8 28 -4 Q48 -2 48 14 Z", col, { parent: s, w: "mid" });
  DS.shape(S, rrect(-44, 10, 96, 18, DS.r.xs), "white", { parent: s, w: "detail" });
  DS.shape(S, rrect(-24, -16, 38, 11, DS.r.xs), "white", { parent: s, w: "hair", flat: true });
  DS.shape(S, rrect(6, -22, 13, 22, DS.r.xs), "gold", { parent: s, w: "detail" });
  return g;
};
const S = scene(0, 1, { cam: "none" }); DS.room(S, { window: false }); DS.rug(S, 960, 1000, 1500, "red");
bibi(S, 380, 520, { k: 1.25, mood: "joy", paws: [[270, 760], [490, 760]] });
const O = ollie(S, 1300, 1250, 2.0, { mouth: "open", look: -10 });
const C = ["red", "sky", "purple", "orange"];
O.arms.forEach((A, i) => { if (A.ai === 3) { const [x, y] = O.holdAt(A, -260); shoeAt(S, O.body, x, y, 1, C[i % 4], 1.4, 0); } else if (A.ai === 2) { O.raise(A, 100, 0, 0.01); const [x, y] = O.tipNow(A, 30); shoeAt(S, O.body, x, y, 1, C[2 + (i % 2)], 1.4, 0); } });
DS.vignette(S, 0.1);
