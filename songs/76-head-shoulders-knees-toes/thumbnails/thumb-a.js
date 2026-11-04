// look: still
// @include ../../../tools/cast.js
// A (claim + face): Ollie's huge grin, arms up on his head, giant "HEAD & TOES" top-left, badge bottom-left.
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 600, sun: [1000, 150], sky: "sky" });
S.fill(smooth([[-200, 860], [600, 840], [1300, 870], [2120, 850]]) + " L2120 1280 L-200 1280 Z", 0, 0, DS.c("grass", 0, "mid"), 1);
S.fill(circ(1450, 520, 520, 460), 0, 0, DS.glow(DS.P.yellow[1], 0.55), 1);
const OL = ollie(S, 1450, 1300, 2.0, { mouth: "grin", look: -8 });
[[1, 150], [8, 150]].forEach(([n, a]) => OL.raise(OL.arms[n - 1], a, 0, 0.01));
S.text("HEAD", 450, 250, { size: 300, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
S.text("& TOES", 500, 540, { size: 270, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
