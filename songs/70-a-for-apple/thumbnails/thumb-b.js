// look: still
// @include ../../../tools/cast.js
// @include ../props.js
// B (no text): Ollie's surprised "oh!" face peeking over a huge apple, Bibi the bunny waving, a ball and a kite. Badge bottom-left.
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 600, sun: [1700, 150], sky: "sky" });
S.fill(smooth([[-200, 860], [600, 840], [1300, 870], [2120, 850]]) + " L2120 1280 L-200 1280 Z", 0, 0, DS.c("grass", 0, "mid"), 1);
const O = ollie(S, 1450, 1260, 1.9, { mouth: "open", look: -6 });
[[1, 80], [8, 80]].forEach(([n, a]) => O.raise(O.arms[n - 1], a, 0, 0.01));
const g1 = G(S, null, "translate(520 1030) scale(2.0)"); DS.shadow(S, 0, 0, 280, { parent: g1 }); PROP.apple(S, g1);
const g2 = G(S, null, "translate(1030 1060) scale(1.0)"); DS.shadow(S, 0, 0, 280, { parent: g2 }); PROP.ball(S, g2);
DS.vignette(S, 0.1);
