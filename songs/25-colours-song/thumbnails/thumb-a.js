// CRITIQUE r1 4/4/4/4/5/4/4/5/5 (focal, emotion, curiosity, contrast, text, composition, polish, honesty, brand); r2: face clear of props, text top-left only, badge zone clear -> final (shipped as a.png)
// look: still
// @include ../../../tools/cast.js
// A (claim + face): Ollie's huge grin on the right under a big rainbow, paint dots in six colours floating left, "COLOURS!" top-left. Badge bottom-left.
const sky = (S) => { DS.outdoor(S, { hy: 640, sun: [1700, 150] }); };
const rb = (S, cx, cy, r0) => [["red", 0], ["orange", 1], ["yellow", 2], ["grass", 3], ["blue", 4], ["purple", 5]].forEach(([n, i]) => {
  const r1 = r0 - i * 40, r2 = r1 - 38; S.fill(`M${cx - r1} ${cy} A${r1} ${r1} 0 0 1 ${cx + r1} ${cy} L${cx + r2} ${cy} A${r2} ${r2} 0 0 0 ${cx - r2} ${cy} Z`, 0, 0, DS.c(n, 0, "mid"), 0.95); });
const pal = (map, f) => { const s = DS.shape, c = DS.c; DS.shape = (S_, d, n, o) => s(S_, d, map[n] || n, o); DS.c = (n, ...r) => c(map[n] || n, ...r); try { return f(); } finally { DS.shape = s; DS.c = c; } };
const S = scene(0, 1, { cam: "none" }); sky(S); rb(S, 1130, 760, 700);
const O = ollie(S, 1240, 1250, 2.0, { mouth: "grin", look: -4 });
[["red", 330, 520, 70], ["yellow", 560, 640, 56], ["blue", 230, 720, 52], ["grass", 470, 460, 44], ["purple", 700, 520, 40], ["orange", 380, 880, 48]].forEach(([c, x, y, r]) => { S.fill(circ(x, y, r), 0, 0, DS.c(c, 0, "mid"), 1); S.fill(circ(x - r * 0.3, y - r * 0.3, r * 0.25), 0, 0, DS.P.white[0], 0.7); });
S.text("COLOURS!", 520, 250, { size: 190, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
