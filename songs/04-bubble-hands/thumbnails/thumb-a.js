// look: still
// Thumbnail A (helpers copied from scenes.js)
const BEAT = 60 / 112;
const K = (v) => +v.toFixed(1);
const cap = (x1, y1, x2, y2, r) => { const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * r, ny = Math.cos(a) * r; return `M${K(x1 + nx)} ${K(y1 + ny)} L${K(x2 + nx)} ${K(y2 + ny)} A${r} ${r} 0 0 0 ${K(x2 - nx)} ${K(y2 - ny)} L${K(x1 - nx)} ${K(y1 - ny)} A${r} ${r} 0 0 0 ${K(x1 + nx)} ${K(y1 + ny)} Z`; };
const star = (cx, cy, r) => poly(Array.from({ length: 11 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, k = i % 2 ? 0.45 : 1; return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]; }), 0);
const ROOM = { wall: "glass", floor: "sand", window: false };
// gentle on-the-beat sway / rub (yoyo, ends where it started)
const swing = (S, e, t0, t1, props, per = BEAT) => { const n = Math.floor((t1 - t0) / per); if (n >= 2) S.move(e, t0, per, Object.assign({ yoyo: true, repeat: 2 * Math.floor(n / 2) - 1 }, props), "sine.inOut"); };
// pops in calmly (0.92 -> 1) on its word; outer group free for drifting
const popIn = (S, t, x, y, parent) => { const o = S.grp(parent), g = S.grp(o); if (t > S.start + 0.05) popAt(g, t, x, y); return [o, g]; };

// ---------- props ----------
const bubble = (S, x, y, r, t, o = {}) => {
  const [g, in_] = popIn(S, t, x, y, o.parent);
  S.draw(circ(x, y, r), S.start, 0, { fill: DS.c("glass", 1), c: DS.c("sky", 2), w: DS.w.detail, parent: in_, op: 0.92 });
  S.draw(arc(x, y, r * 0.72, 20, 80), S.start, 0, { c: DS.c(o.tint || "pink", 1), w: DS.w.near, parent: in_ });
  S.fill(circ(x - r * 0.38, y - r * 0.4, r * 0.2, r * 0.13), S.start, 0, DS.P.white[0], 1, in_);
  if (o.face) { [-1, 1].forEach((s) => S.fill(circ(x + s * r * 0.24, y - r * 0.02, r * 0.07, r * 0.1), S.start, 0, DS.c("ink"), 1, in_));
    S.draw(arc(x, y + r * 0.12, r * 0.2, 20, 160), S.start, 0, { c: DS.c("ink"), w: DS.w.detail, parent: in_ }); }
  if (o.drift !== false) S.move(g, t + 0.4, Math.max(0.5, S.end - t - 0.4), { y: -(o.rise || 40) }, "sine.inOut");
  return g;
};
const foam = (S, x, y, n, t, parent) => { const [, g] = popIn(S, t, x, y, parent);
  for (let i = 0; i < n; i++) { const a = i * 2.4, d = 14 + (i % 4) * 12; S.draw(circ(x + Math.cos(a) * d * 1.6, y + Math.sin(a) * d, 16 + (i % 3) * 7), S.start, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.hair, parent: g }); }
  return g; };
const drop = (S, x, y, t) => { const [, g] = popIn(S, t, x, y); S.draw(smooth([[x, y - 22], [x - 12, y + 2], [x, y + 14], [x + 12, y + 2], [x, y - 22]]) + " Z", S.start, 0, { fill: DS.c("sky", 0), c: DS.c("blue", 2), w: DS.w.detail, parent: g }); return g; };
const sparkle = (S, x, y, r, t) => { const [, g] = popIn(S, t, x, y); S.draw(star(x, y, r), S.start, 0, { fill: DS.vol("gold"), c: DS.c("gold", 2), w: DS.w.detail, parent: g }); return g; };

// ---------- Bibi (same look everywhere) ----------
const face = (S, x, y, k, mood, g) => {
  [-1, 1].forEach((s) => {
    if (mood === "joy") S.draw(arc(x + s * 46 * k, y + 2 * k, 20 * k, 200, 340), S.start, 0, { c: DS.c("ink"), w: DS.w.near, parent: g });
    else { S.fill(circ(x + s * 46 * k, y - 6 * k, 20 * k, 26 * k), S.start, 0, DS.c("ink"), 1, g); S.fill(circ(x + s * 46 * k + 7 * k, y - 15 * k, 7 * k), S.start, 0, DS.P.white[0], 1, g); }
    S.fill(circ(x + s * 82 * k, y + 30 * k, 22 * k, 14 * k), S.start, 0, DS.c("red", 1), 0.45, g);
  });
  S.fill(circ(x, y + 24 * k, 12 * k, 9 * k), S.start, 0, DS.c("pink", 2), 1, g);
  S.draw(`M${K(x - 30 * k)} ${K(y + 46 * k)} Q${K(x)} ${K(y + 104 * k)} ${K(x + 30 * k)} ${K(y + 46 * k)} Z`, S.start, 0, { fill: DS.c("red", 2), c: DS.c("ink"), w: DS.w.detail, parent: g });
  S.fill(circ(x, y + 64 * k, 13 * k, 7 * k), S.start, 0, DS.c("pink", 1), 1, g);
};
// an arm + paw from the shoulder to (px, py); returns its group (rotate it about the shoulder to wave)
const arm = (S, B, side, px, py, t) => { const [g, in_] = popIn(S, t ?? S.start, px, py, B.g), k = B.k, sx = B.x + side * 82 * k, sy = B.hy + 150 * k;
  DS.shape(S, cap(sx, sy, px, py, 30 * k), "pink", { parent: in_ });
  DS.shape(S, circ(px, py, 46 * k, 42 * k), "pink", { parent: in_ });
  [-1, 1].forEach((s) => S.draw(`M${K(px + s * 16 * k)} ${K(py + 18 * k)} V${K(py + 38 * k)}`, S.start, 0, { c: DS.c("ink"), w: DS.w.detail, parent: in_ }));
  g.sh = `${K(sx)} ${K(sy)}`; return g; };
const bibi = (S, x, hy, o = {}) => {
  const k = o.k || 1, g = S.grp(), B = { g, k, x, hy };
  [[-1, -12], [1, 10]].forEach(([s, rot]) => { const eg = S.grp(g), ex = x + s * 56 * k, ey = hy - 150 * k; eg.setAttribute("transform", `rotate(${rot} ${K(ex)} ${K(ey + 90 * k)})`);
    DS.shape(S, circ(ex, ey, 36 * k, 98 * k), "pink", { parent: eg }); S.fill(circ(ex, ey + 10 * k, 16 * k, 66 * k), S.start, 0, DS.c("pink", 2), 0.7, eg); });
  DS.shape(S, circ(x, hy + 200 * k, 130 * k, 125 * k), "pink", { parent: g });
  S.fill(circ(x, hy + 222 * k, 80 * k, 84 * k), S.start, 0, DS.P.white[0], 0.8, g);
  DS.shape(S, circ(x, hy, 128 * k, 114 * k), "pink", { parent: g });
  face(S, x, hy, k, o.mood, g);
  const bx = x + 70 * k, by = hy - 104 * k; // yellow bow = Bibi's signature
  [-1, 1].forEach((s) => DS.shape(S, `M${K(bx)} ${K(by)} L${K(bx + s * 46 * k)} ${K(by - 26 * k)} Q${K(bx + s * 58 * k)} ${K(by)} ${K(bx + s * 46 * k)} ${K(by + 26 * k)} Z`, "yellow", { parent: g, w: "mid" }));
  DS.shape(S, circ(bx, by, 13 * k), "yellow", { parent: g, w: "mid" });
  const [l, r] = o.paws || [[x - 110 * k, hy + 290 * k], [x + 110 * k, hy + 290 * k]];
  if (l) B.L = arm(S, B, -1, l[0], l[1]);
  if (r) B.R = arm(S, B, 1, r[0], r[1]);
  return B;
};

// ---------- the bathroom ----------
const tiles = (S, x0, y0, x1, y1, step = 80) => { let d = ""; for (let x = x0 + step; x < x1; x += step) d += `M${x} ${y0} V${y1} `; for (let y = y0 + step; y < y1; y += step) d += `M${x0} ${y} H${x1} `; S.draw(d, S.start, 0, { c: DS.c("sky", 0, "mid"), w: DS.w.hair, op: 0.7 }); };
const wall = (S, o = {}) => {
  tiles(S, 360, 90, 1560, 760);
  DS.shape(S, rrect(400, 340, 260, 22, DS.r.xs), "white", { layer: "mid", w: "mid" });                                     // shelf
  DS.shape(S, circ(470, 304, 42, 32), "yellow", { layer: "mid", w: "mid" }); DS.shape(S, circ(500, 262, 25), "yellow", { layer: "mid", w: "mid" }); // duck
  DS.shape(S, `M520 258 L552 266 L520 276 Z`, "orange", { layer: "mid", w: "detail" }); S.fill(circ(506, 255, 5), S.start, 0, DS.c("ink"), 1);
  DS.shape(S, rrect(580, 270, 56, 70, DS.r.sm), "sky", { layer: "mid", w: "mid" });                                         // cup
  [[596, "red"], [620, "grass"]].forEach(([x, c]) => DS.shape(S, rrect(x - 6, 220, 12, 60, DS.r.xs), c, { layer: "mid", w: "detail" }));
  if (o.towel === false) return;
  S.draw(circ(1380, 280, 40), S.start, 0, { c: DS.c("gray", 0, "mid"), w: DS.w.mid });                                     // towel ring + towel
  DS.shape(S, rrect(1310, 310, 140, 210, DS.r.sm), "grass", { layer: "mid", w: "mid" });
  S.draw("M1310 470 H1450 M1310 486 H1450", S.start, 0, { c: DS.P.white[0], w: DS.w.detail });
};
const sink = (S, o = {}) => {
  DS.shape(S, rect(330, 772, 1260, 420), "wood", { dir: "v" });
  S.draw("M960 790 V1100", S.start, 0, { c: DS.c("wood", 2), w: DS.w.mid });
  [920, 1000].forEach((x) => DS.shape(S, circ(x, 860, 13), "gold", { w: "detail" }));
  DS.shape(S, rrect(280, 712, 1360, 66, DS.r.sm), "white");
  S.draw(circ(960, 740, 290, 22), S.start, 0, { fill: DS.c("glass", 2), c: DS.line(), w: DS.w.detail });
  DS.shape(S, rrect(1270, 590, 44, 132, DS.r.sm), "gray");                                                                   // faucet
  DS.shape(S, cap(1292, 612, 1180, 612, 18), "gray"); DS.shape(S, rrect(1160, 600, 38, 46, DS.r.xs), "gray", { w: "mid" });
  DS.shape(S, rrect(1258, 562, 68, 30, DS.r.sm), "sky", { w: "mid" });
  if (o.soap !== false) { DS.shadow(S, 600, 716, 150); const sg = S.grp();                                                   // soap pump
    DS.shape(S, rrect(540, 560, 120, 160, DS.r.md), "purple", { parent: sg }); DS.shape(S, rect(586, 528, 28, 34), "white", { parent: sg, w: "mid" });
    DS.shape(S, rrect(560, 508, 80, 24, DS.r.xs), "white", { parent: sg, w: "mid" }); DS.shape(S, rrect(632, 512, 46, 14, DS.r.xs), "white", { parent: sg, w: "detail" });
    S.draw(heartPath(600, 638, 0.9), S.start, 0, { fill: DS.c("pink", 1), c: DS.c("purple", 2), w: DS.w.detail, parent: sg }); return sg; }
};
const water = (S, t, x = 1179, y0 = 646, y1 = 744) => { const [, g] = popIn(S, t, x, y0); S.fill(rrect(x - 15, y0, 30, y1 - y0, DS.r.sm), S.start, 0, DS.c("sky", 0), 0.85, g); S.fill(rrect(x - 5, y0 + 6, 8, y1 - y0 - 16, DS.r.xs), S.start, 0, DS.P.white[0], 0.8, g); return g; };

// ---------- close-ups: big hands over the basin ----------
const closeSet = (S) => { tiles(S, -200, -200, 2120, 860, 120);
  DS.shape(S, rect(-200, 840, 2320, 400), "white", { dir: "v" });
  S.draw(circ(960, 930, 700, 60), S.start, 0, { fill: DS.c("glass", 2), c: DS.line(), w: DS.w.detail });
  DS.shadow(S, 1700, 846, 160); DS.shape(S, rrect(1640, 660, 120, 186, DS.r.md), "purple", { layer: "far", w: "far" }); };
// a hand pointing up from the wrist; back: shows nails (back of the hand), else a heart pad (palm). Returns [outer, mid]
const hand = (S, cx, cy, k, rot, o = {}) => {
  const [g, in_] = popIn(S, o.t ?? S.start, cx, cy), h = S.grp(in_); h.setAttribute("transform", `translate(${cx} ${cy}) rotate(${rot}) scale(${o.flip ? -k : k} ${k})`);
  DS.shape(S, cap(0, 120, 0, 900, 70), "pink", { parent: h });   // the arm runs off the frame
  const F = [[-66, -150], [-22, -182], [22, -176], [66, -142]];
  F.forEach(([x, y]) => DS.shape(S, cap(x, -20, x, y, 25), "pink", { parent: h }));
  DS.shape(S, cap(-70, 30, -150, -50, 27), "pink", { parent: h });
  DS.shape(S, circ(0, 30, 108, 104), "pink", { parent: h });
  if (o.back) { F.forEach(([x, y]) => S.fill(rrect(x - 13, y - 14, 26, 30, DS.r.sm), S.start, 0, DS.P.white[0], 0.85, h)); S.draw("M-60 -40 Q-40 -52 -20 -40 M20 -40 Q40 -52 60 -40", S.start, 0, { c: DS.c("pink", 2), w: DS.w.near, parent: h }); }
  else S.draw(heartPath(0, 36, 1.4), S.start, 0, { fill: DS.c("pink", 2), c: DS.c("pink", 2), w: DS.w.hair, parent: h });
  return [g, in_];
};
const cardAt = (S, str, t, o = {}) => DS.card(S, str, o.x || 1560, o.y || 150, Object.assign({ size: DS.type.title, t }, o));
// A: Bibi big on the left with soapy paws, one giant smiling bubble, "BUBBLE BUBBLE!"
const S = scene(0, 1, { cam: "none" }); DS.setHaze("sky");
S.fill(rect(-20, -20, 1960, 1120), 0, 0, DS.c("sky", 0)); tiles(S, -20, -20, 1940, 860, 120);
const B = bibi(S, 600, 470, { k: 2.1, paws: [null, null] });
DS.shape(S, rect(-20, 870, 1960, 240), "white", { dir: "v" });
arm(S, B, -1, 400, 860); arm(S, B, 1, 820, 860);
foam(S, 400, 820, 9, 0); foam(S, 820, 820, 9, 0); foam(S, 610, 870, 7, 0);
bubble(S, 1440, 770, 210, 0, { face: true, tint: "pink", drift: false });
bubble(S, 1800, 560, 80, 0, { tint: "yellow", drift: false });
S.text("BUBBLE", 1400, 230, { size: 190, c: DS.c("yellow"), halo: DS.c("ink"), haloW: 0.1 });
S.text("BUBBLE!", 1400, 440, { size: 190, c: DS.c("yellow"), halo: DS.c("ink"), haloW: 0.1 });
