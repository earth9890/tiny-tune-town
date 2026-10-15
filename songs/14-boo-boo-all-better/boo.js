// 14 Boo-Boo All Better: the playground set, sitting Bibi with legs, sad faces, boo-boo marks and star bandages.
// Included by scenes.js and both thumbnails (after cast.js). Song-only: cast.js stays untouched.

// ---------- playground ----------
const starD = (x, y, r) => poly(Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r * 0.45 : r; return [x + Math.cos(a) * q, y + Math.sin(a) * q]; }), 0) + " Z";
const tree = (S, x, gy, k, layer = "far") => {
  DS.shadow(S, x, gy, 220 * k);
  DS.shape(S, rrect(x - 18 * k, gy - 170 * k, 36 * k, 170 * k, DS.r.sm), "wood", { layer });
  DS.shape(S, smooth([[x - 120 * k, gy - 170 * k], [x - 150 * k, gy - 260 * k], [x - 90 * k, gy - 350 * k], [x, gy - 380 * k], [x + 90 * k, gy - 350 * k], [x + 150 * k, gy - 260 * k], [x + 120 * k, gy - 170 * k], [x, gy - 150 * k], [x - 120 * k, gy - 170 * k]]) + " Z", "grass", { layer });
};
const bush = (S, x, gy, k, layer = "mid") => { DS.shadow(S, x, gy, 260 * k); DS.shape(S, smooth([[x - 130 * k, gy], [x - 120 * k, gy - 70 * k], [x - 50 * k, gy - 110 * k], [x + 30 * k, gy - 100 * k], [x + 110 * k, gy - 80 * k], [x + 130 * k, gy]]) + " Z", "green", { layer }); };
const cloud = (S, x, y, k) => S.fill(smooth([[x - 120 * k, y], [x - 90 * k, y - 46 * k], [x - 20 * k, y - 70 * k], [x + 50 * k, y - 56 * k], [x + 110 * k, y - 30 * k], [x + 120 * k, y], [x - 120 * k, y]]) + " Z", S.start, 0, DS.P.white[0], 0.85);
const flowers = (S) => [[150, 960, "yellow"], [260, 1000, "pink"], [1700, 975, "yellow"], [1820, 1010, "purple"], [1560, 1020, "pink"]].forEach(([x, y, c]) => {
  S.draw(`M${x} ${y} V${y + 60}`, S.start, 0, { c: DS.c("green", 2), w: DS.w.mid });
  [0, 1, 2, 3, 4].forEach((i) => DS.shape(S, circ(x + Math.cos(i * 1.257) * 18, y + Math.sin(i * 1.257) * 18, 13), c, { w: "detail" }));
  DS.shape(S, circ(x, y, 10), "orange", { w: "detail" });
});
// slide on the left: ladder, platform, orange chute ending at (430, 880)
const slide = (S) => {
  DS.shadow(S, 300, 890, 520);
  [60, 150].forEach((x) => DS.shape(S, rrect(x - 11, 400, 22, 490, DS.r.xs), "gray", { layer: "mid", w: "mid" }));
  for (let y = 470; y < 880; y += 80) DS.shape(S, rrect(60, y, 90, 14, DS.r.xs), "gray", { layer: "mid", w: "detail" });
  DS.shape(S, rrect(40, 380, 210, 30, DS.r.sm), "wood", { layer: "mid", w: "mid" });
  DS.shape(S, "M230 388 C330 390 340 760 470 838 L470 890 C300 850 280 450 230 440 Z", "orange", { layer: "mid", w: "mid" });
  S.draw("M232 390 C330 392 342 760 470 840", S.start, 0, { c: DS.c("orange", 2, "mid"), w: DS.w.mid });
};
// swing set on the right; swings sway gently (seat colours)
const swings = (S) => {
  [[1450, 1540], [1860, 1770]].forEach(([a, b]) => { DS.shape(S, cap(a, 820, b, 350, 13), "sky", { layer: "mid", w: "mid" }); DS.shadow(S, a, 820, 60); });
  DS.shape(S, cap(1500, 350, 1810, 350, 14), "sky", { layer: "mid", w: "mid" });
  [[1600, "red"], [1720, "purple"]].forEach(([x, c], i) => {
    const g = G(S, null, `rotate(0 ${x} 356)`);
    S.draw(`M${x - 34} 356 V680 M${x + 34} 356 V680`, S.start, 0, { c: DS.c("gray", 2, "mid"), w: DS.w.detail, parent: g });
    DS.shape(S, rrect(x - 50, 676, 100, 22, DS.r.xs), c, { layer: "mid", w: "mid", parent: g });
    tw(g, S.start, S.len, `rotate(0 ${x} 356)`, `rotate(${i ? -5 : 5} ${x} 356)`, wave(cyc(S.len, 4.4)));
  });
};
const park = (S, o = {}) => {
  DS.outdoor(S, { hy: 560, sky: "sky", sun: [1640, 140], hills: "grass", ground: "grass" });
  cloud(S, 470, 170, 1); cloud(S, 1120, 120, 0.8); cloud(S, 1880, 250, 0.7);
  tree(S, 700, 600, 0.55); tree(S, 1300, 590, 0.6); tree(S, 1960, 610, 0.7);
  bush(S, 900, 640, 0.6); bush(S, 1240, 650, 0.5);
  slide(S); if (o.swings !== false) swings(S);
};

// ---------- feelings ----------
// worried brows + a tear (a group: fade it out when it's all better). brows: [[x0, y0, x1, y1], ...]; tear: [x, y, k]
const sad = (S, parent, brows, tear, t) => {
  const g = S.grp(parent);
  brows.forEach(([x0, y0, x1, y1]) => S.draw(`M${K(x0)} ${K(y0)} L${K(x1)} ${K(y1)}`, S.start, 0, { c: DS.line(), w: DS.w.near, parent: g }));
  const [x, y, k] = tear;
  DS.shape(S, `M${K(x)} ${K(y - 20 * k)} C${K(x + 14 * k)} ${K(y - 2 * k)} ${K(x + 13 * k)} ${K(y + 12 * k)} ${K(x)} ${K(y + 12 * k)} C${K(x - 13 * k)} ${K(y + 12 * k)} ${K(x - 14 * k)} ${K(y - 2 * k)} ${K(x)} ${K(y - 20 * k)} Z`, "sky", { parent: g, w: "detail" });
  if (t > S.start + 0.05) fadeIn(S, g, t);
  return g;
};
const better = (S, g, t) => S.fadeOut(g, t, 0.4);
// the tiny pink boo-boo mark; it pops in on t
const mark = (S, x, y, r, t, parent) => { const [, g] = popIn(S, t, x, y, parent); S.fill(circ(x, y, r * 1.5, r * 1.2), S.start, 0, DS.c("red", 1), 0.45, g); S.fill(circ(x, y, r, r * 0.8), S.start, 0, DS.c("red", 0), 0.7, g); return g; };
// star bandage centred at (x, y), rotated rot deg, pops in on t
const plaster = (S, x, y, rot, k, t, parent) => {
  const o = G(S, parent, `rotate(${rot} ${K(x)} ${K(y)})`), [, g] = popIn(S, t, x, y, o);
  DS.shape(S, rrect(x - 52 * k, y - 19 * k, 104 * k, 38 * k, DS.r.sm), "dusk", { parent: g, w: "detail" });
  [-36, -26, 26, 36].forEach((dx) => S.fill(circ(x + dx * k, y, 2.5 * k), S.start, 0, DS.c("dusk", 2), 1, g));
  DS.shape(S, rrect(x - 19 * k, y - 15 * k, 38 * k, 30 * k, DS.r.xs), "white", { parent: g, w: "hair", flat: true });
  DS.shape(S, starD(x, y, 14 * k), "yellow", { parent: g, w: "hair" });
  return o;
};
// wash it (drops), kiss it (a heart), all better (sparkles) at a point
const washAt = (S, x, y, t) => [[-24, -60], [10, -76], [30, -50]].forEach(([dx, dy], i) => drop(S, x + dx, y + dy + i * 8, t + i * 0.18, 0.9));
const kissAt = (S, x, y, t) => { const g = G(S, null, "translate(0 0)"); S.draw(heartPath(x, y - 50, 0.9), t, 0, { fill: DS.c("red", 1), c: DS.c("red", 2), w: DS.w.detail, parent: g }); tw(g, t, 1.6, "translate(0 0)", "translate(0 -90)", "power1.out"); S.fadeOut(g, t + 1.2, 0.4); };
const shine = (S, x, y, t) => [[-60, -40, 0.6], [60, -50, 0.7], [0, -90, 0.5]].forEach(([dx, dy, r], i) => sparkle(S, x + dx, y + dy, t + i * 0.2, r));

// ---------- the cast, sitting on the playground ----------
// Bibi sitting with her legs out (right knee up toward Ollie); B.knee = the knee, B.w = wrapper (lean it; put marks and bandages in it).
// o: { mood, paws, sad: t (worried brows + tear from t), joyAt: t (crossfades to her happy closed-eye face) }
const bibiSit = (S, x, gy, k, o = {}) => {
  const hy = gy - 325 * k, paws = o.paws || [[x - 128 * k, hy + 250 * k], [x + 92 * k, hy + 172 * k]];
  const one = (mood) => {
    const B = bibi(S, x, hy, { k, mood, paws });
    const leg = (p) => DS.shape(S, p, "pink", { parent: B.g });
    leg(cap(x - 50 * k, hy + 300 * k, x - 150 * k, hy + 318 * k, 30 * k)); DS.shape(S, circ(x - 172 * k, hy + 300 * k, 30 * k, 44 * k), "pink", { parent: B.g });
    leg(cap(x + 40 * k, hy + 296 * k, x + 128 * k, hy + 222 * k, 32 * k)); leg(cap(x + 128 * k, hy + 222 * k, x + 176 * k, hy + 310 * k, 30 * k));
    DS.shape(S, circ(x + 196 * k, hy + 300 * k, 30 * k, 44 * k), "pink", { parent: B.g });
    [[-172, 300], [196, 300]].forEach(([dx, dy]) => S.fill(circ(x + dx * k, hy + (dy + 6) * k, 13 * k, 20 * k), S.start, 0, DS.c("pink", 2), 0.8, B.g));
    return B;
  };
  const w = S.grp(), B = one(o.mood); w.appendChild(B.g); B.w = w; B.knee = [x + 130 * k, hy + 214 * k]; B.hy = hy; B.face = [x, hy];
  if (o.sad !== undefined && o.sad !== false) B.sadG = sad(S, B.g, [[x - 72 * k, hy - 46 * k, x - 28 * k, hy - 60 * k], [x + 72 * k, hy - 46 * k, x + 28 * k, hy - 60 * k]], [x - 52 * k, hy + 44 * k, k * 1.1], o.sad);
  if (o.joyAt) { const J = one("joy"); w.appendChild(J.g); J.g.setAttribute("opacity", 0); tl.to(J.g, { opacity: 1, duration: 0.4 }, o.joyAt); tl.set(B.g, { opacity: 0 }, o.joyAt + 0.45); B.joy = J; }
  return B;
};
// sad overlays for the sea friends (in their local units, parent = their bob group)
const crabSad = (S, C, t) => sad(S, C.bob, [[-50, -192, -18, -200], [50, -192, 18, -200]], [-42, -122, 0.9], t);
const turtleSad = (S, T, t) => sad(S, T.bob, [[126, -118, 156, -126]], [146, -64, 0.9], t);
const ollieSad = (S, O, t) => sad(S, O.body, [[-92, -392, -40, -408], [92, -392, 40, -408]], [-74, -270, 1.2], t);
