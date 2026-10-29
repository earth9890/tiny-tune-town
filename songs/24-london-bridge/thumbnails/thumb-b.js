// look: still
// @include ../../../tools/cast.js
// B (the payoff, no text): the finished bridge over the water on the left, Bibi waving from it, Ollie's smile right with bricks in two arms. Badge bottom-left.
const brick = (S, parent, x, y, k, col) => { const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`); DS.shape(S, rrect(-46, -24, 92, 48, 8), col, { parent: g, w: "mid" }); S.draw("M-46 0 H46 M-8 -24 V0 M20 0 V24", S.start, 0, { c: DS.c(col, 2), w: DS.w.detail, parent: g }); return g; };
const bay = (S) => { DS.outdoor(S, { hy: 560, sun: [1750, 150] }); S.fill("M-200 700 H2120 V1280 H-200 Z", 0, 0, DS.c("blue", 1, "mid"), 0.85); };
const plank = (S, x, y, rot, k = 1) => { const g = G(S, null, `translate(${x} ${y}) rotate(${rot}) scale(${k})`); DS.shape(S, rrect(-130, -22, 260, 44, 8), "wood", { parent: g, w: "mid" }); S.draw("M-100 -6 H100", S.start, 0, { c: DS.c("wood", 2), w: DS.w.detail, parent: g }); return g; };
const S = scene(0, 1, { cam: "none" }); bay(S);
S.draw("M120 760 Q420 520 720 760", 0, 0, { c: DS.c("wood", 2), w: 60 });
[[200, 700, -28], [330, 640, -14], [470, 612, 0], [610, 640, 14], [740, 700, 28]].forEach(([x, y, r]) => plank(S, x, y, r, 0.8));
bibi(S, 470, 330, { k: 0.7, mood: "joy", paws: [[400, 470], [540, 470]] });
const O = ollie(S, 1300, 1250, 2.0, { mouth: "open", look: -10 });
O.arms.forEach((A, i) => { if (A.ai === 3) { const [x, y] = O.holdAt(A, -260); brick(S, O.body, x, y, 1.2, i % 2 ? "red" : "orange"); } });
DS.vignette(S, 0.1);
