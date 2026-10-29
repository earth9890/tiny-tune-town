// CRITIQUE r1 4/4/5/4/5/4/4/5/5 (absurd moment, honest gag); r2: text off the face, props trimmed -> final (shipped as b.png, Test & Compare slot)
// look: still
// @include ../../../tools/cast.js
// B (magic, no text): Ollie has turned BLUE, surprised "oh!", a rainbow behind him and a pink Ollie tail-end waving left? (just blue Ollie + question marks as symbols). Badge bottom-left.
const sky = (S) => { DS.outdoor(S, { hy: 640, sun: [1700, 150] }); };
const rb = (S, cx, cy, r0) => [["red", 0], ["orange", 1], ["yellow", 2], ["grass", 3], ["blue", 4], ["purple", 5]].forEach(([n, i]) => {
  const r1 = r0 - i * 40, r2 = r1 - 38; S.fill(`M${cx - r1} ${cy} A${r1} ${r1} 0 0 1 ${cx + r1} ${cy} L${cx + r2} ${cy} A${r2} ${r2} 0 0 0 ${cx - r2} ${cy} Z`, 0, 0, DS.c(n, 0, "mid"), 0.95); });
const pal = (map, f) => { const s = DS.shape, c = DS.c; DS.shape = (S_, d, n, o) => s(S_, d, map[n] || n, o); DS.c = (n, ...r) => c(map[n] || n, ...r); try { return f(); } finally { DS.shape = s; DS.c = c; } };
const S = scene(0, 1, { cam: "none" }); sky(S); rb(S, 1130, 760, 700);
const O = pal({ pink: "blue" }, () => ollie(S, 1240, 1250, 2.0, { mouth: "open", look: 0 }));
S.text("?", 560, 520, { size: 520, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.1 });
DS.vignette(S, 0.1);
