// look: still
// @include ../../../tools/cast.js
// B (friend, no text): a crate heaped with peppers bottom centre, Bibi cheering on the left, Ollie's surprised "oh!" face right with three peppers in his arms. Badge bottom-left.
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
bibi(S, 470, 470, { k: 1.15, mood: "joy", paws: [[360, 700], [580, 700]] });
const O = ollie(S, 1330, 1250, 2.0, { mouth: "open", look: -10 });
O.arms.forEach((A, i) => { if (A.ai === 3) { const [x, y] = O.holdAt(A, -260); pepper(S, O.body, x, y, 1.4, ["red", "yellow"][i % 2]); return; }
  if (A.ai === 2) { O.raise(A, 100, 0, 0.01); const [x, y] = O.tipNow(A, 30); pepper(S, O.body, x, y, 1.4, "orange"); } });
[[760, 760, "red"], [850, 800, "yellow"], [930, 740, "orange"], [740, 880, "orange"], [840, 900, "red"], [940, 880, "yellow"], [1020, 800, "red"]].forEach(([x, y, c]) => pepper(S, null, x, y, 1.9, c));
DS.vignette(S, 0.1);
