// look: still
// @include ../../../tools/cast.js
// A (claim + face): Ollie's huge grin right, the old turtle with glasses drumming on a red drum left, "TAP!" top-left. Badge bottom-left.
const beach = (S) => { DS.outdoor(S, { hy: 560, sun: [1500, 150] }); S.fill("M-200 600 H2120 V1280 H-200 Z", 0, 0, DS.c("blue", 1, "mid"), 0.9); S.fill(smooth([[-200, 820], [600, 800], [1300, 830], [2120, 810]]) + " L2120 1280 L-200 1280 Z", 0, 0, DS.c("sand", 1, "mid"), 1); };
const S = scene(0, 1, { cam: "none" }); beach(S);
const T = turtle(S, 700, 900, 1.55);
[[142, -94, 20], [96, -92, 20]].forEach(([cx, cy, r]) => { S.fill(circ(cx, cy, r), 0, 0, DS.c("glass", 1), 0.45, T.bob); S.draw(circ(cx, cy, r), 0, 0, { c: LN("gray"), w: DS.w.mid, parent: T.bob }); });
S.draw("M116 -94 H122", 0, 0, { c: LN("gray"), w: DS.w.mid, parent: T.bob }); S.draw("M128 -120 Q142 -134 158 -122", 0, 0, { c: DS.P.white[0], w: DS.w.near, parent: T.bob });
const D = S.grp(); DS.shape(S, rrect(590, 900, 300, 160, DS.r.sm), "red", { parent: D, w: "mid" });
S.draw("M590 916 L650 1050 L710 916 L770 1050 L830 916 L890 1050", 0, 0, { c: DS.P.white[0], w: DS.w.near, parent: D });
DS.shape(S, circ(740, 902, 150, 36), "gold", { parent: D, w: "mid" }); DS.shape(S, circ(740, 904, 126, 26), "white", { parent: D, w: "detail" });
const O = ollie(S, 1460, 1250, 1.85, { mouth: "grin", look: -4 });
[[1, 85], [3, 60]].forEach(([n, a]) => O.raise(O.arms[n - 1], a, 0, 0.01));
S.text("TAP!", 400, 250, { size: 260, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
