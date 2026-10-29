// look: still
// @include ../../../tools/cast.js
// C (absurd moment): Ollie turned yellow-orange beside a smiling sun, wide eyes, "WHAT COLOUR?" top-left. Badge bottom-left.
const sky = (S) => { DS.outdoor(S, { hy: 640, sun: [1700, 150] }); };
const rb = (S, cx, cy, r0) => [["red", 0], ["orange", 1], ["yellow", 2], ["grass", 3], ["blue", 4], ["purple", 5]].forEach(([n, i]) => {
  const r1 = r0 - i * 40, r2 = r1 - 38; S.fill(`M${cx - r1} ${cy} A${r1} ${r1} 0 0 1 ${cx + r1} ${cy} L${cx + r2} ${cy} A${r2} ${r2} 0 0 0 ${cx - r2} ${cy} Z`, 0, 0, DS.c(n, 0, "mid"), 0.95); });
const pal = (map, f) => { const s = DS.shape, c = DS.c; DS.shape = (S_, d, n, o) => s(S_, d, map[n] || n, o); DS.c = (n, ...r) => c(map[n] || n, ...r); try { return f(); } finally { DS.shape = s; DS.c = c; } };
const S = scene(0, 1, { cam: "none" }); sky(S);
const O = pal({ pink: "yellow" }, () => ollie(S, 1240, 1250, 2.0, { mouth: "open", look: -6 }));
S.fill(circ(560, 620, 200), 0, 0, DS.c("yellow", 0, "mid"), 1); S.draw(circ(560, 620, 200), 0, 0, { c: DS.line(), w: DS.w.mid });
S.fill(circ(500, 590, 20), 0, 0, DS.P.ink[0], 1); S.fill(circ(620, 590, 20), 0, 0, DS.P.ink[0], 1); S.draw("M480 670 Q560 740 640 670", 0, 0, { c: DS.line(), w: DS.w.mid });
S.text("WHAT COLOUR?", 640, 250, { size: 170, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
