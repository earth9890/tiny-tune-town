// CRITIQUE r1 4/4/5/4/5/4/4/5/5 (absurd moment, honest gag); r2: text off the face, props trimmed -> final (shipped as b.png, Test & Compare slot)
// look: still
// @include ../../../tools/cast.js
// B (the payoff, no text): a big rainbow, sun out, Ollie's surprised "oh!" face right, one cloud sliding off left. Badge bottom-left.
const grey = (S) => { DS.outdoor(S, { hy: 620, sun: [1750, 140] }); };
const cloudy = (S, cx, cy, k, col) => [[0, 0, 110], [-110, 30, 80], [110, 30, 85], [50, -60, 80], [-50, -50, 70]].forEach(([dx, dy, r]) => DS.shape(S, circ(cx + dx * k, cy + dy * k, r * k), col, { w: "mid" }));
const drops = (S, pts) => pts.forEach(([x, y]) => DS.shape(S, `M${x} ${y - 30} C${x + 20} ${y - 4} ${x + 18} ${y + 18} ${x} ${y + 18} C${x - 18} ${y + 18} ${x - 20} ${y - 4} ${x} ${y - 30} Z`, "sky", { w: "detail" }));
const rb = (S, cx, cy, r0) => [["red", 0], ["orange", 1], ["yellow", 2], ["grass", 3], ["blue", 4], ["purple", 5]].forEach(([n, i]) => { const r1 = r0 - i * 40, r2 = r1 - 38; S.fill(`M${cx - r1} ${cy} A${r1} ${r1} 0 0 1 ${cx + r1} ${cy} L${cx + r2} ${cy} A${r2} ${r2} 0 0 0 ${cx - r2} ${cy} Z`, 0, 0, DS.c(n, 0, "mid"), 0.95); });
const S = scene(0, 1, { cam: "none" }); grey(S); rb(S, 760, 860, 640);
cloudy(S, 220, 250, 0.9, "gray");
const O = ollie(S, 1300, 1250, 2.0, { mouth: "open", look: -10 });
DS.vignette(S, 0.1);
