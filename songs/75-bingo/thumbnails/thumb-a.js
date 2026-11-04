// look: still
// @include ../../../tools/cast.js
// A (claim + face): Bingo the puppy's huge face right, farmer Ollie (straw hat) left, giant B-I-N-G-O letters across the top, badge bottom-left.
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 600, sun: [1000, 150], sky: "sky" });
S.fill(smooth([[-200, 860], [600, 840], [1300, 870], [2120, 850]]) + " L2120 1280 L-200 1280 Z", 0, 0, DS.c("grass", 0, "mid"), 1);
S.fill(circ(1450, 620, 520, 460), 0, 0, DS.glow(DS.P.yellow[1], 0.55), 1);
const FA = ollie(S, 720, 1080, 1.2, { mouth: "grin", look: 14 });
const b = FA.body; toon(S, "M-190 -462 Q0 -432 190 -462 Q120 -486 0 -486 Q-120 -486 -190 -462 Z", "yellow", { parent: b, lw: DS.w.mid * 2.4 });
toon(S, "M-98 -476 Q-90 -590 0 -596 Q90 -590 98 -476 Q0 -450 -98 -476 Z", "yellow", { parent: b, lw: DS.w.mid * 2.4 });
S.fill("M-96 -486 Q0 -462 96 -486 L96 -498 Q0 -474 -96 -498 Z", 0, 0, DS.c("red", 1), 1, b);
puppy(S, 1560, 1270, 3.5, {});
"BINGO".split("").forEach((c, i) => DS.card(S, c, 190 + 235 * i, 180, { size: 230, t: 0, fill: i % 2 ? "yellow" : "orange" }));
DS.vignette(S, 0.1);
