// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// The whole family in hero variant A, all at the same scale (k), with role labels.
TOON = 2;
const S = scene(0, 1, { cam: "none" });
const W0 = DS.outdoor(S, { hy: 640, sun: [1640, 160], sky: "sky", ground: "grass", hills: "green" });
const k = 0.68, gy = 930;
const G1 = gran(S, 250, gy, k, { mood: "happy" }), D = dad(S, 590, gy, k), B = sibling(S, 920, gy, k), T = toddler(S, 1185, gy, k, { v: "A", mood: "giggle" }), M = mum(S, 1480, gy, k), C = kitty(S, 1765, gy, k * 1.1);
D.arm(1, 30, 0, 0.01); B.arm(1, 120, 0, 0.01); T.arm(-1, 120, 0, 0.01); T.arm(1, 120, 0, 0.01); M.arm(-1, 30, 0, 0.01);
[["Grandma", 250], ["Dad", 590], ["Brother", 920], ["Hero", 1185], ["Mum", 1480], ["Cat", 1765]].forEach(([t, x]) => DS.card(S, t, x, 1010, { size: DS.type.caption }));
DS.vignette(S, 0.1); grade(S, [1640, 160]);
