const pepper = (S, parent, x, y, k, col) => {
  const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`);
  DS.shape(S, "M0 -26 C28 -36 40 -8 34 16 C28 40 10 46 0 40 C-10 46 -28 40 -34 16 C-40 -8 -28 -36 0 -26 Z", col, { parent: g, w: "mid" });
  S.fill(circ(-14, -2, 6, 13), S.start, 0, DS.c(col, 1), 0.8, g);
  DS.shape(S, "M-3 -26 Q-4 -42 10 -48 L14 -41 Q5 -35 7 -26 Z", "green", { parent: g, w: "detail" });
  return g;
};
const bush = (S, cx, cy, k) => [[0, 0, 130], [-110, 40, 100], [110, 40, 105], [-60, -90, 95], [70, -100, 100], [0, -160, 80], [-150, -40, 70], [150, -60, 75], [0, 120, 100], [-100, 130, 80], [100, 130, 80]]
  .forEach(([dx, dy, r], i) => DS.shape(S, circ(cx + dx * k, cy + dy * k, r * k), "green", { layer: "mid", flat: true, tone: [0, 1, 2][i % 3] }));
