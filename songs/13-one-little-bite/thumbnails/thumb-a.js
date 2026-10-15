// look: still
// @include ../../../tools/cast.js
// @include ../food.js
// A: Ollie's huge grinning face on the right, a forkful of carrot at his mouth ("Mmm!"); a big smiling broccoli left-centre on the
// gingham table. "MMM!" top-left. Badge bottom-left (tools/badge.sh). B = the same with no text.
const S = scene(0, 1, { cam: "none" });
DS.room(S, { wall: "wall", floor: "floor", window: false });
tiles(S, -200, -200, 2120, 760, 120);
const O = ollie(S, 1290, 1130, 2.0, { mouth: "grin", look: -4 });
const A = O.arms.find((a) => a.ai === 3 && a.side === 1), [tx, ty] = O.holdAt(A, -250);
fork(S, tx, ty, -100, -250, "carrot", O.body);
DS.shape(S, "M-200 750 H2120 V870 H-200 Z", "sky", { tone: 1, flat: true });               // gingham table: top surface...
DS.shape(S, "M-200 870 H2120 V1280 H-200 Z", "sky", { dir: "v" });                          // ...and the cloth hanging down
S.draw("M-200 810 H2120 M-200 960 H2120 M-200 1050 H2120 M60 750 V1280 M260 750 V1280 M460 750 V1280 M660 750 V1280 M860 750 V1280 M1060 750 V1280 M1260 750 V1280 M1460 750 V1280 M1660 750 V1280 M1860 750 V1280", 0, 0, { c: DS.P.white[0], w: DS.w.near, op: 0.5 });
DS.shadow(S, 700, 812, 420);
broccoli(S, 700, 812, 2.5, S.grp());
[[1720, 260, 1.6], [900, 330, 1.2], [1780, 520, 1.1]].forEach(([x, y, s]) => S.draw(heartPath(x, y, s), 0, 0, { fill: DS.c("red", 1), c: DS.c("red", 2), w: DS.w.detail }));
[[-250, -480, 1], [230, -480, 0.9]].forEach(([x, y, r]) => S.draw(rays(...O.at([x, y]), 34 * r, 70 * r, 8), 0, 0, { c: DS.c("yellow", 2), w: DS.w.mid }));
S.text("MMM!", 440, 250, { size: 220, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
