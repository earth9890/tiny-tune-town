// CRITIQUE r1 4/4/4/4/5/4/4/5/5 (focal, emotion, curiosity, contrast, text, composition, polish, honesty, brand); r2: face clear of props, text top-left only, badge zone clear -> final (shipped as a.png)
// look: still
// @include ../../../tools/cast.js
// A (claim + face): Ollie's huge grin right, a brick in every arm, a half-built brick arch left, "BUILD!" top-left. Badge bottom-left.
const brick = (S, parent, x, y, k, col) => { const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`); DS.shape(S, rrect(-46, -24, 92, 48, 8), col, { parent: g, w: "mid" }); S.draw("M-46 0 H46 M-8 -24 V0 M20 0 V24", S.start, 0, { c: DS.c(col, 2), w: DS.w.detail, parent: g }); return g; };
const bay = (S) => { DS.outdoor(S, { hy: 560, sun: [1750, 150] }); S.fill("M-200 700 H2120 V1280 H-200 Z", 0, 0, DS.c("blue", 1, "mid"), 0.85); };
const plank = (S, x, y, rot, k = 1) => { const g = G(S, null, `translate(${x} ${y}) rotate(${rot}) scale(${k})`); DS.shape(S, rrect(-130, -22, 260, 44, 8), "wood", { parent: g, w: "mid" }); S.draw("M-100 -6 H100", S.start, 0, { c: DS.c("wood", 2), w: DS.w.detail, parent: g }); return g; };
const S = scene(0, 1, { cam: "none" }); bay(S);
[[330, 850], [330, 800], [330, 750], [330, 700], [560, 850], [560, 800], [560, 750], [560, 700], [445, 640], [445, 592], [445, 544]].forEach(([x, y], i) => brick(S, null, x, y, 1.3, i % 3 ? "red" : "orange"));
const O = ollie(S, 1250, 1250, 2.0, { mouth: "grin", look: -4 });
const C = ["red", "orange", "red", "orange", "red", "orange", "red", "orange"];
O.arms.forEach((A, i) => { let x, y; if (A.ai === 3) { [x, y] = O.holdAt(A, -250); } else { O.raise(A, [125, 98, 72][A.ai], 0, 0.01); [x, y] = O.tipNow(A, 30); } brick(S, O.body, x, y, 1.1, C[i]); });
S.text("BUILD!", 470, 250, { size: 220, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
