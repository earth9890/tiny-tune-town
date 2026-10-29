// look: still
// @include ../../../tools/cast.js
// C (absurd moment): Ollie in a tiny yellow umbrella, rain drops everywhere, wide-eyed grin, "SPLASH!" top-left. Badge bottom-left.
const grey = (S) => { DS.outdoor(S, { hy: 620, sun: [1750, 140] }); };
const cloudy = (S, cx, cy, k, col) => [[0, 0, 110], [-110, 30, 80], [110, 30, 85], [50, -60, 80], [-50, -50, 70]].forEach(([dx, dy, r]) => DS.shape(S, circ(cx + dx * k, cy + dy * k, r * k), col, { w: "mid" }));
const drops = (S, pts) => pts.forEach(([x, y]) => DS.shape(S, `M${x} ${y - 30} C${x + 20} ${y - 4} ${x + 18} ${y + 18} ${x} ${y + 18} C${x - 18} ${y + 18} ${x - 20} ${y - 4} ${x} ${y - 30} Z`, "sky", { w: "detail" }));
const rb = (S, cx, cy, r0) => [["red", 0], ["orange", 1], ["yellow", 2], ["grass", 3], ["blue", 4], ["purple", 5]].forEach(([n, i]) => { const r1 = r0 - i * 40, r2 = r1 - 38; S.fill(`M${cx - r1} ${cy} A${r1} ${r1} 0 0 1 ${cx + r1} ${cy} L${cx + r2} ${cy} A${r2} ${r2} 0 0 0 ${cx - r2} ${cy} Z`, 0, 0, DS.c(n, 0, "mid"), 0.95); });
const S = scene(0, 1, { cam: "none" }); grey(S);
const O = ollie(S, 1250, 1250, 2.0, { mouth: "grin", look: 0 });
DS.shape(S, "M890 300 Q1250 20 1610 300 Z", "yellow", { w: "mid" }); S.draw("M1250 120 V300", 0, 0, { c: DS.line(), w: DS.w.mid });
drops(S, [[400, 700], [560, 800], [700, 640], [820, 850], [300, 880], [1730, 640], [1800, 840], [1660, 960], [980, 960], [480, 980]]);
S.text("SPLASH!", 470, 250, { size: 200, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
