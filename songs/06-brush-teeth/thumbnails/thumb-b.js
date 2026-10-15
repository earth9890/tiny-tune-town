// look: still
// @include ../../../tools/cast.js
// B: same as A with no text (Test & Compare partner).
const S = scene(0, 1, { cam: "none" }); DS.room(S, BATH_ROOM);
tiles(S, -200, -200, 2120, 700, 120);
const O = ollie(S, 1240, 1250, 2.0, { mouth: "grin", look: -4 });
const C = ["sky", "grass", "yellow", "orange", "purple", "red", "blue", "gold"];
O.arms.forEach((A, i) => {
  if (A.ai === 3) { const [tx, ty] = O.holdAt(A, -250); toothbrush(S, tx, ty, A.side === 1 ? -92 : 92, -262, { c: C[i], parent: O.body }); return; }
  O.raise(A, [125, 98, 72][A.ai], 0, 0.01);
  const [x0, y0] = O.tipNow(A), [x1, y1] = O.tipNow(A, 150);
  toothbrush(S, x0, y0, x1, y1, { c: C[i], parent: O.body, foam: false });
});
[[-190, -520, 1.1], [200, -540, 0.9], [-260, -430, 0.7], [250, -420, 0.8]].forEach(([x, y, r]) => sparkle(S, ...O.at([x, y]), 0, r));
[[230, 560, 46], [520, 640, 34], [360, 740, 28], [640, 470, 24]].forEach(([x, y, r]) => S.draw(circ(x, y, r), 0, 0, { fill: DS.c("glass", 1), c: DS.c("sky", 2), w: DS.w.detail }));
DS.vignette(S, 0.1);
