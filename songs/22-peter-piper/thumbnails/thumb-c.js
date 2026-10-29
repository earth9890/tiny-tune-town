// CRITIQUE r1 4/4/5/4/5/4/4/5/5 (absurd moment, honest gag); r2: text off the face, props trimmed -> final (shipped as b.png, Test & Compare slot)
// look: still
// @include ../../../tools/cast.js
// C (absurd moment): a mountain of peppers heaped on Ollie's head, wide eyes, "8 ARMS!" top-left. Badge bottom-left.
const pepper = (S, parent, x, y, k, col) => {
  const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`);
  DS.shape(S, "M0 -26 C28 -36 40 -8 34 16 C28 40 10 46 0 40 C-10 46 -28 40 -34 16 C-40 -8 -28 -36 0 -26 Z", col, { parent: g, w: "mid" });
  S.fill(circ(-14, -2, 6, 13), S.start, 0, DS.c(col, 1), 0.8, g);
  DS.shape(S, "M-3 -26 Q-4 -42 10 -48 L14 -41 Q5 -35 7 -26 Z", "green", { parent: g, w: "detail" });
  return g;
};
const bush = (S, cx, cy, k) => [[0, 0, 130], [-110, 40, 100], [110, 40, 105], [-60, -90, 95], [70, -100, 100], [0, -160, 80], [-150, -40, 70], [150, -60, 75], [0, 120, 100], [-100, 130, 80], [100, 130, 80]]
  .forEach(([dx, dy, r], i) => DS.shape(S, circ(cx + dx * k, cy + dy * k, r * k), "green", { layer: "mid", flat: true, tone: [0, 1, 2][i % 3] }));
const S = scene(0, 1, { cam: "none" }); DS.outdoor(S, { hy: 600, sun: [1000, 150] });
bush(S, 1250, 560, 1.7);
const O = ollie(S, 1240, 1280, 2.0, { mouth: "open", look: 0 });
[[0, -560, "red"], [-90, -520, "yellow"], [90, -520, "orange"], [0, -650, "yellow"], [-170, -470, "orange"], [170, -470, "red"], [-60, -620, "orange"], [70, -620, "red"]].forEach(([x, y, c]) => pepper(S, O.body, x, y, 1.5, c));
const PC = ["red", "yellow", "orange", "red", "yellow", "orange", "red", "yellow"];
O.arms.forEach((A, i) => { if (A.ai === 3) { const [x, y] = O.holdAt(A, -250); pepper(S, O.body, x, y, 1.3, PC[i]); return; }
  O.raise(A, [125, 98, 72][A.ai], 0, 0.01); const [x, y] = O.tipNow(A, 30); pepper(S, O.body, x, y, 1.3, PC[i]); });
S.text("8 ARMS!", 450, 250, { size: 200, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
