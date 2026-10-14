// look: still
// @include ../tools/cast.js
// BANNER: desktop band y 382–698 full width; safe (all devices) x 497–1423, y 413–667
const S = scene(0, 1, { cam: "none" }); sea(S, { coral: false, hy: 700, weeds: [[60, 0.8], [1860, 0.8]] });
coral(S, 330, 860, 0.55, "pink"); coral(S, 1600, 865, 0.5, "orange");
bubbles(S, 14, 37);
const O = ollie(S, 260, 700, 0.62, { mouth: "open", look: 8 });
[70, 55, 40, 25].forEach((a, ai) => O.arms.filter((A) => A.ai === ai).forEach((A) => O.raise(A, a, 0, 0.01)));
fish(S, 1600, 520, 0.85, "yellow", -1);
star(S, 1790, 700, 0.95);
crab(S, 1480, 700, 0.6);
S.text("Tiny Tune Town", 960, 560, { size: 112, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14 });
S.text("Sing  •  Dance  •  Count  •  Smile", 960, 650, { size: 46, c: DS.P.white[0], halo: DS.P.ink[0], haloW: 0.16 });
