// look: still
// @include ../../../tools/cast.js
// @include ../chars.js
// B: same as A with no text (Test & Compare partner).
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 700, sun: [1820, 90] });
RAIN.forEach((c, i) => S.draw(arc(900, 760, 700 - i * 26, 180, 360), 0, 0, { c: DS.c(c, 0, "far"), w: DS.w.near * 3 }));
cloud(S, 760, 110, 0.9);
fence(S, -60, 1980, 830, "mid");
const O = ollie(S, 1440, 1210, 1.62, { mouth: "grin", look: -4 });
const Sh = sheep(S, 900, 970, 1.35, "black", { look: 8, open: true });
DS.vignette(S, 0.1);
