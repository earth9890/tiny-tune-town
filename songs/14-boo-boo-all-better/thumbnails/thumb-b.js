// look: still
// @include ../../../tools/cast.js
// @include ../boo.js
// B: thumb A with no text (Test & Compare partner).
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 620, sky: "sky", sun: [1700, 120], hills: "grass", ground: "grass" });
cloud(S, 300, 140, 1.2); cloud(S, 1000, 110, 0.9); tree(S, 160, 700, 0.8); bush(S, 420, 720, 0.8);
const O = ollie(S, 1290, 1240, 2.0, { mouth: "grin", look: -6 });
const A = O.arms.find((a) => a.ai === 1 && a.side === 1); O.raise(A, 112, 0, 0.01);
const [px, py] = O.tipNow(A, 40); plaster(S, px, py, -24, 2.3, 0, O.body);
hearts(S, 0, [[1720, 560, 1.5], [760, 800, 1.3]]);
[[-200, -520, 1.1], [210, -540, 0.9], [260, -420, 0.8]].forEach(([x, y, r]) => sparkle(S, ...O.at([x, y]), 0, r));
DS.vignette(S, 0.1);
