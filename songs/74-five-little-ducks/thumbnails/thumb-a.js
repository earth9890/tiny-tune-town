// look: still
// @include ../../../tools/cast.js
// @include ../props.js
// A (claim + face): Ollie's huge grin right, five ducklings in a row along the bottom (one peeking from a bush), giant "5 DUCKS" top-left, badge bottom-left.
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 600, sun: [1000, 150], sky: "sky" });
S.fill(smooth([[-200, 860], [600, 840], [1300, 870], [2120, 850]]) + " L2120 1280 L-200 1280 Z", 0, 0, DS.c("grass", 0, "mid"), 1);
S.fill(circ(1450, 520, 520, 460), 0, 0, DS.glow(DS.P.yellow[1], 0.55), 1);
const OL = ollie(S, 1500, 1290, 2.0, { mouth: "grin", look: -8 });
[[1, 80], [8, 80]].forEach(([n, a]) => OL.raise(OL.arms[n - 1], a, 0, 0.01));
[0, 1, 2, 3, 4].forEach((n) => duck(S, 780 + 170 * n, 1040, 1.0, {}));
S.text("5", 250, 330, { size: 420, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
S.text("DUCKS", 520, 620, { size: 280, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
