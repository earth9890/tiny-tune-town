// CRITIQUE r1 4/4/4/4/5/4/4/5/5 (focal, emotion, curiosity, contrast, text, composition, polish, honesty, brand); r2: face clear of props, text top-left only, badge zone clear -> final (shipped as a.png)
// look: still
// @include ../../../tools/cast.js
// A (claim + face): Ollie's huge grin on the right, all eight arm tips up holding a coloured shoe each, one giant red shoe left, "BUCKLE!" top-left. Badge bottom-left.
const shoeAt = (S, parent, x, y, dir, col, k, t) => {
  const [, g] = popIn(S, t, x, y, parent), s = G(S, g, `translate(${x} ${y}) scale(${dir * k} ${k})`);
  DS.shape(S, "M-40 14 L-40 -20 Q-38 -30 -24 -30 L-4 -30 Q2 -8 28 -4 Q48 -2 48 14 Z", col, { parent: s, w: "mid" });
  DS.shape(S, rrect(-44, 10, 96, 18, DS.r.xs), "white", { parent: s, w: "detail" });
  DS.shape(S, rrect(-24, -16, 38, 11, DS.r.xs), "white", { parent: s, w: "hair", flat: true });
  DS.shape(S, rrect(6, -22, 13, 22, DS.r.xs), "gold", { parent: s, w: "detail" });
  return g;
};
const S = scene(0, 1, { cam: "none" }); DS.room(S, { window: false }); DS.rug(S, 960, 1000, 1500, "red");
const O = ollie(S, 1240, 1250, 2.0, { mouth: "grin", look: -4 });
const C = ["red", "sky", "purple", "orange", "red", "sky", "purple", "orange"];
O.arms.forEach((A, i) => { let x, y; if (A.ai === 3) { [x, y] = O.holdAt(A, -250); } else { O.raise(A, [125, 98, 72][A.ai], 0, 0.01); [x, y] = O.tipNow(A, 30); } shoeAt(S, O.body, x, y, 1, C[i], 1.4, 0); });
shoeAt(S, null, 460, 700, 1, "red", 4.6, 0);
S.text("BUCKLE!", 470, 250, { size: 200, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
