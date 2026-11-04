// look: still
// @include ../../../tools/cast.js
// @include ../props.js
// A (claim + face): Johny's huge grin right, tiny Papa peeking left with glasses and bow tie, giant "YES PAPA!" top-left. Badge bottom-left.
// Critique r1: focal = Johny's grin (5), text (4: add tilt), depth (3: add glow) -> r2: sun glow + tilt + papa smaller.
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 600, sun: [1000, 150], sky: "sky" });
S.fill(smooth([[-200, 860], [600, 840], [1300, 870], [2120, 850]]) + " L2120 1280 L-200 1280 Z", 0, 0, DS.c("grass", 0, "mid"), 1);
S.fill(circ(1450, 520, 520, 460), 0, 0, DS.glow(DS.P.yellow[1], 0.55), 1);
const PP = ollie(S, 700, 1000, 0.95, { mouth: "smile", look: 14 }); papaGear(S, PP);
const JO = ollie(S, 1450, 1290, 2.0, { mouth: "grin", look: -8 });
[[1, 80], [8, 80]].forEach(([n, a]) => JO.raise(JO.arms[n - 1], a, 0, 0.01));
const t = S.text("YES", 470, 250, { size: 300, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
const t2 = S.text("PAPA!", 520, 530, { size: 300, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
