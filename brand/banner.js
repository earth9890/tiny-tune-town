// look: still
// @include ../tools/cast.js
// @include ../tools/family.js
// BANNER (2026-11 family brand): desktop band y 382–698 full width; safe (all devices) x 497–1423, y 413–667. Old Ollie version: banner-ollie.js
TOON = 2;
const S = scene(0, 1, { cam: "none" });
const W0 = DS.outdoor(S, { hy: 640, sun: [960, 300], sky: "sky", ground: "grass", hills: "green" });
[[600, 610, "pink"], [700, 640, "yellow"], [1240, 620, "red"], [1330, 650, "purple"]].forEach(([x, y, c]) => S.fill(circ(x, y, 16), 0, 0, DS.c(c, 0, "mid"), 1, W0.g));
const B = sibling(S, 140, 935, 0.6, { mood: "giggle" }); B.arm(1, 115, 0, 0.01);
const N = toddler(S, 370, 935, 0.86, { mood: "happy" }); N.arm(1, 118, 0, 0.01);
kitty(S, 560, 955, 0.5);
const Gm = gran(S, 1500, 935, 0.44), M = mum(S, 1665, 935, 0.44), D = dad(S, 1835, 935, 0.44);
D.arm(-1, 26, 0, 0.01);
S.text("Tiny Tune Town", 960, 560, { size: 112, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14 });
S.text("Sing  •  Dance  •  Count  •  Smile", 960, 650, { size: 46, c: DS.P.white[0], halo: DS.P.ink[0], haloW: 0.16 });
DS.vignette(S, 0.08); grade(S, [960, 300], 0.6);
