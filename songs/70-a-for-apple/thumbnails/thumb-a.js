// look: still
// @include ../../../tools/cast.js
// @include ../props.js
// A (claim + props): Ollie's huge grin right, a giant red apple and a blue ball left, "A B C" top-left. Badge bottom-left.
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 600, sun: [1000, 150], sky: "sky" });
S.fill(smooth([[-200, 860], [600, 840], [1300, 870], [2120, 850]]) + " L2120 1280 L-200 1280 Z", 0, 0, DS.c("grass", 0, "mid"), 1);
const g1 = G(S, null, "translate(560 1010) scale(1.75)"); DS.shadow(S, 0, 0, 280, { parent: g1 }); PROP.apple(S, g1);
const g2 = G(S, null, "translate(930 1050) scale(1.1)"); DS.shadow(S, 0, 0, 280, { parent: g2 }); PROP.ball(S, g2);
const O = ollie(S, 1530, 1260, 1.85, { mouth: "grin", look: -6 });
[[1, 80], [8, 80]].forEach(([n, a]) => O.raise(O.arms[n - 1], a, 0, 0.01));
S.text("ABC", 520, 300, { size: 330, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
