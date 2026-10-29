// CRITIQUE r1 4/4/4/4/5/4/4/5/5 (focal, emotion, curiosity, contrast, text, composition, polish, honesty, brand); r2: face clear of props, text top-left only, badge zone clear -> final (shipped as a.png)
// look: still
// @include ../../../tools/cast.js
// A (claim + face): Ollie's huge grin right, a grumpy-cute grey rain cloud with drops on the left, "GO AWAY!" top-left. Badge bottom-left.
const grey = (S) => { DS.outdoor(S, { hy: 620, sun: [1750, 140] }); };
const cloudy = (S, cx, cy, k, col) => [[0, 0, 110], [-110, 30, 80], [110, 30, 85], [50, -60, 80], [-50, -50, 70]].forEach(([dx, dy, r]) => DS.shape(S, circ(cx + dx * k, cy + dy * k, r * k), col, { w: "mid" }));
const drops = (S, pts) => pts.forEach(([x, y]) => DS.shape(S, `M${x} ${y - 30} C${x + 20} ${y - 4} ${x + 18} ${y + 18} ${x} ${y + 18} C${x - 18} ${y + 18} ${x - 20} ${y - 4} ${x} ${y - 30} Z`, "sky", { w: "detail" }));
const rb = (S, cx, cy, r0) => [["red", 0], ["orange", 1], ["yellow", 2], ["grass", 3], ["blue", 4], ["purple", 5]].forEach(([n, i]) => { const r1 = r0 - i * 40, r2 = r1 - 38; S.fill(`M${cx - r1} ${cy} A${r1} ${r1} 0 0 1 ${cx + r1} ${cy} L${cx + r2} ${cy} A${r2} ${r2} 0 0 0 ${cx - r2} ${cy} Z`, 0, 0, DS.c(n, 0, "mid"), 0.95); });
const S = scene(0, 1, { cam: "none" }); grey(S);
cloudy(S, 520, 560, 1.7, "gray"); drops(S, [[380, 800], [520, 860], [660, 790], [450, 960], [600, 980]]);
S.fill(circ(440, 560, 14), 0, 0, DS.P.ink[0], 1); S.fill(circ(600, 560, 14), 0, 0, DS.P.ink[0], 1); S.draw("M450 650 Q520 610 590 650", 0, 0, { c: DS.line(), w: DS.w.mid });
const O = ollie(S, 1250, 1250, 2.0, { mouth: "grin", look: -4 });
S.text("GO AWAY!", 560, 250, { size: 200, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
