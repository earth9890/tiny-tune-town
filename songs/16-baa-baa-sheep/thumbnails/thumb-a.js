// look: still
// @include ../../../tools/cast.js
// @include ../chars.js
// A: Ollie's huge happy face on the right; a big cute black sheep "baa"-ing beside him; rainbow over the meadow; "BAA!" top-left. Badge bottom-left (tools/badge.sh).
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 700, sun: [1820, 90] });
RAIN.forEach((c, i) => S.draw(arc(900, 760, 700 - i * 26, 180, 360), 0, 0, { c: DS.c(c, 0, "far"), w: DS.w.near * 3 }));
cloud(S, 760, 110, 0.9);
fence(S, -60, 1980, 830, "mid");
const O = ollie(S, 1440, 1210, 1.62, { mouth: "grin", look: -4 });
const Sh = sheep(S, 900, 970, 1.35, "black", { look: 8, open: true });
S.text("BAA!", 400, 250, { size: 220, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
