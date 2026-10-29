// CRITIQUE r1 4/4/5/4/5/4/4/5/5 (absurd moment, honest gag); r2: text off the face, props trimmed -> final (shipped as b.png, Test & Compare slot)
// look: still
// @include ../../../tools/cast.js
// C (absurd moment): Ollie in a floppy purple nightcap, wide-eyed grin, "WAKE UP!" top-left. Badge bottom-left.
const bellK = (S, x, y, k) => { const g = G(S, null, `translate(${K(x)} ${K(y)}) scale(${k})`); S.draw("M0 -170 V-100", S.start, 0, { c: DS.line(), w: DS.w.mid, parent: g }); DS.shape(S, "M-110 80 Q-100 -90 0 -110 Q100 -90 110 80 Z", "gold", { parent: g, w: "mid" }); DS.shape(S, rrect(-130, 70, 260, 34, 14), "gold", { parent: g, w: "mid", tone: 1 }); DS.shape(S, circ(0, 128, 28), "gold", { parent: g, w: "detail" }); return g; };
const dawnSky = (S) => { DS.outdoor(S, { hy: 640, sun: [1000, 600], sky: "sky" }); S.fill(circ(960, 650, 260), 0, 0, DS.c("yellow", 0, "far"), 0.9); };
const nightcap = (S, parent, x, y, k) => { const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`); DS.shape(S, "M-130 0 Q-100 -170 120 -190 Q60 -90 130 0 Z", "purple", { parent: g, w: "mid" }); DS.shape(S, rrect(-150, -6, 300, 34, 16), "white", { parent: g, w: "mid" }); S.fill(circ(124, -196, 32), S.start, 0, DS.P.white[0], 1, g); return g; };
const S = scene(0, 1, { cam: "none" }); dawnSky(S);
const O = ollie(S, 1250, 1250, 2.0, { mouth: "grin", look: 0 });
nightcap(S, O.body, 0, -470, 1.1);
[[250, 780, 1], [880, 420, 0.8]].forEach(([x, y, r]) => sparkle(S, x, y, 0, r));
S.text("WAKE UP!", 470, 250, { size: 200, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
