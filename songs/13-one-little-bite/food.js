// 13 One Little Bite: food props with cute faces, shared by scenes.js and the thumbnails (needs cast.js first).
// ---------- food with cute faces (x, y = where it sits on the plate; k scales) ----------
const cute = (S, x, y, k, g) => {
  [-1, 1].forEach((s) => {
    S.fill(circ(x + s * 15 * k, y, 7 * k, 8.5 * k), S.start, 0, DS.c("ink"), 1, g);
    S.fill(circ(x + s * 15 * k - 2 * k, y - 3.5 * k, 2.6 * k), S.start, 0, DS.P.white[0], 1, g);
    S.fill(circ(x + s * 27 * k, y + 10 * k, 6 * k, 4 * k), S.start, 0, DS.c("red", 1), 0.55, g);
  });
  S.draw(`M${K(x - 8 * k)} ${K(y + 9 * k)} Q${K(x)} ${K(y + 18 * k)} ${K(x + 8 * k)} ${K(y + 9 * k)}`, S.start, 0, { c: DS.line(), w: DS.w.detail, parent: g });
};
const leaf = (S, x0, y0, x1, y1, w, name, g) => { const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, a = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
  DS.shape(S, `M${K(x0)} ${K(y0)} Q${K(mx + nx)} ${K(my + ny)} ${K(x1)} ${K(y1)} Q${K(mx - nx)} ${K(my - ny)} ${K(x0)} ${K(y0)} Z`, name, { parent: g, w: "detail" }); };
const carrot = (S, x, y, k, g) => {
  const X = (v) => K(x + v * k), Y = (v) => K(y + v * k);
  [[118, -96, 16], [138, -58, 14], [96, -108, 12]].forEach(([bx, by, w]) => leaf(S, X(70), Y(-40), X(bx), Y(by), w * k, "grass", g));
  DS.shape(S, `M${X(-100)} ${Y(-26)} C${X(-60)} ${Y(-62)} ${X(20)} ${Y(-74)} ${X(56)} ${Y(-70)} C${X(92)} ${Y(-66)} ${X(92)} ${Y(-4)} ${X(56)} ${Y(-2)} C${X(20)} ${Y(0)} ${X(-60)} ${Y(-4)} ${X(-100)} ${Y(-26)} Z`, "orange", { parent: g, w: "mid" });
  [[-62, -44, -54, -14], [-34, -56, -26, -8]].forEach(([a, b, c, d]) => S.draw(`M${X(a)} ${Y(b)} Q${X(a + 8)} ${Y((b + d) / 2)} ${X(c)} ${Y(d)}`, S.start, 0, { c: DS.c("orange", 2), w: DS.w.detail, parent: g }));
  cute(S, x + 28 * k, y - 38 * k, k, g);
};
const peas = (S, x, y, k, g) => {
  leaf(S, x - 120 * k, y - 16 * k, x + 120 * k, y - 16 * k, 40 * k, "grass", g);                         // the open pod
  return [-64, 0, 64].map((dx) => { const pg = S.grp(g);
    DS.shape(S, circ(x + dx * k, y - 44 * k, 32 * k), "green", { parent: pg, w: "mid" });
    S.fill(circ(x + (dx - 11) * k, y - 58 * k, 9 * k, 6 * k), S.start, 0, DS.P.white[0], 0.5, pg);
    cute(S, x + dx * k, y - 42 * k, 0.8 * k, pg); return pg; });
};
const broccoli = (S, x, y, k, g) => {
  const X = (v) => K(x + v * k), Y = (v) => K(y + v * k);
  DS.shape(S, `M${X(-24)} ${Y(-4)} L${X(-14)} ${Y(-70)} H${X(14)} L${X(24)} ${Y(-4)} Z`, "grass", { parent: g, w: "mid" });
  [[-46, -86, 32], [46, -86, 32], [-24, -118, 34], [24, -118, 34], [0, -88, 38]].forEach(([dx, dy, r]) => DS.shape(S, circ(X(dx), Y(dy), r * k), "green", { parent: g, w: "mid" }));
  [[-56, -100], [52, -104], [-30, -136], [30, -134], [-8, -146]].forEach(([dx, dy]) => S.fill(circ(X(dx), Y(dy), 5 * k), S.start, 0, DS.c("green", 2), 0.8, g));
  cute(S, x, y - 84 * k, k, g);
};
const banana = (S, x, y, k, g) => {
  const X = (v) => K(x + v * k), Y = (v) => K(y + v * k);
  DS.shape(S, `M${X(-100)} ${Y(-60)} Q${X(0)} ${Y(60)} ${X(100)} ${Y(-60)} Q${X(0)} ${Y(-20)} ${X(-100)} ${Y(-60)} Z`, "yellow", { parent: g, w: "mid" });
  DS.shape(S, `M${X(96)} ${Y(-58)} L${X(112)} ${Y(-78)} L${X(122)} ${Y(-70)} L${X(104)} ${Y(-52)} Z`, "wood", { parent: g, w: "detail" });
  S.fill(circ(X(-98), Y(-60), 7 * k), S.start, 0, DS.c("brown"), 1, g);
  cute(S, x, y - 20 * k, 0.9 * k, g);
};
const FOOD = { carrot, peas, broccoli, banana };
// one forkful (body units of Ollie, ~22 across): carrot coin, pea, broccoli floret, banana slice, or a berry by colour name
const piece = (S, kind, x, y, g) => {
  if (kind === "carrot") { DS.shape(S, circ(x, y, 22, 20), "orange", { parent: g, w: "mid" }); S.draw(circ(x, y, 11, 10), S.start, 0, { c: DS.c("orange", 2), w: DS.w.detail, parent: g }); }
  else if (kind === "banana") { DS.shape(S, circ(x, y, 22, 20), "sand", { parent: g, w: "mid" }); [[-6, -4], [6, -4], [0, 7]].forEach(([dx, dy]) => S.fill(circ(x + dx, y + dy, 2.5), S.start, 0, DS.c("wood", 2), 1, g)); }
  else if (kind === "broccoli") { DS.shape(S, rrect(x - 6, y, 12, 22, DS.r.xs), "grass", { parent: g, w: "detail" }); [[-12, 0, 14], [12, 0, 14], [0, -12, 16]].forEach(([dx, dy, r]) => DS.shape(S, circ(x + dx, y + dy, r), "green", { parent: g, w: "mid" })); }
  else { const c = kind === "peas" ? "green" : kind; DS.shape(S, circ(x, y, 18), c, { parent: g, w: "mid" }); S.fill(circ(x - 6, y - 7, 5, 3.5), S.start, 0, DS.P.white[0], 0.6, g); }
};
// fork: handle held at (x0, y0), tines end at (x1, y1); the bite sits on the tines. Returns [fork group, bite group]
const fork = (S, x0, y0, x1, y1, kind, parent) => {
  const g = S.grp(parent), a = Math.atan2(y1 - y0, x1 - x0), ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, bx = x1 - ux * 44, by = y1 - uy * 44;
  DS.shape(S, cap(x0, y0, bx, by, 8), "gray", { parent: g, w: "detail" });
  let d = `M${K(bx + nx * 14)} ${K(by + ny * 14)} L${K(bx - nx * 14)} ${K(by - ny * 14)}`;
  [-12, 0, 12].forEach((o) => (d += ` M${K(bx + nx * o)} ${K(by + ny * o)} L${K(x1 + nx * o)} ${K(y1 + ny * o)}`));
  S.draw(d, S.start, 0, { c: DS.c("gray", 2), w: DS.w.mid, parent: g });
  const pg = S.grp(g); piece(S, kind, x1 - ux * 20, y1 - uy * 20, pg);
  return [g, pg];
};
