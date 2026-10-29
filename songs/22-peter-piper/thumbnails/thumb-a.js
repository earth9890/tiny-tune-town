// CRITIQUE r1 4/4/4/4/5/4/4/5/5 (focal, emotion, curiosity, contrast, text, composition, polish, honesty, brand); r2: face clear of props, text top-left only, badge zone clear -> final (shipped as a.png)
// look: still
// @include ../../../tools/cast.js
// A (claim + face): Ollie's huge grin on the right, all eight arms up holding a pepper each (the gag), one giant red pepper left, "PICK!" top-left. Badge bottom-left.
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
const O = ollie(S, 1240, 1250, 2.0, { mouth: "grin", look: -4 });
const PC = ["red", "yellow", "orange", "red", "yellow", "orange", "red", "yellow"];
O.arms.forEach((A, i) => { if (A.ai === 3) { const [x, y] = O.holdAt(A, -250); pepper(S, O.body, x, y, 1.4, PC[i]); return; }
  O.raise(A, [125, 98, 72][A.ai], 0, 0.01); const [x, y] = O.tipNow(A, 30); pepper(S, O.body, x, y, 1.4, PC[i]); });
pepper(S, null, 470, 640, 5.2, "red");
S.text("PICK!", 440, 250, { size: 220, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
