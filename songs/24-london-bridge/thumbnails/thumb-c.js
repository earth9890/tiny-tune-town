// CRITIQUE r1 4/4/5/4/5/4/4/5/5 (absurd moment, honest gag); r2: text off the face, props trimmed -> final (shipped as b.png, Test & Compare slot)
// look: still
// @include ../../../tools/cast.js
// C (curiosity): "OH NO!" the bridge snapped in the middle, planks tipping into the water, Ollie's wide-eyed "oh!" face. Badge bottom-left.
const brick = (S, parent, x, y, k, col) => { const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`); DS.shape(S, rrect(-46, -24, 92, 48, 8), col, { parent: g, w: "mid" }); S.draw("M-46 0 H46 M-8 -24 V0 M20 0 V24", S.start, 0, { c: DS.c(col, 2), w: DS.w.detail, parent: g }); return g; };
const bay = (S) => { DS.outdoor(S, { hy: 560, sun: [1750, 150] }); S.fill("M-200 700 H2120 V1280 H-200 Z", 0, 0, DS.c("blue", 1, "mid"), 0.85); };
const plank = (S, x, y, rot, k = 1) => { const g = G(S, null, `translate(${x} ${y}) rotate(${rot}) scale(${k})`); DS.shape(S, rrect(-130, -22, 260, 44, 8), "wood", { parent: g, w: "mid" }); S.draw("M-100 -6 H100", S.start, 0, { c: DS.c("wood", 2), w: DS.w.detail, parent: g }); return g; };
const S = scene(0, 1, { cam: "none" }); bay(S);
plank(S, 220, 640, -24, 0.9); plank(S, 440, 760, 40, 0.9); plank(S, 640, 880, 70, 0.8); plank(S, 120, 800, 8, 0.8);
const O = ollie(S, 1250, 1250, 2.0, { mouth: "open", look: -8 });
S.text("OH NO!", 470, 250, { size: 220, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
