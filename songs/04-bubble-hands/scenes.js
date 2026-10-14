// look: still
// Bubble Bubble Wash Your Hands (original). Hero: Bibi, a round pink bunny with a yellow bow, at a bright bathroom sink.
// One set (sink, tiles, duck shelf, towel) for the wide pictures; big-hand close-ups for the steps; choruses build bubbles.
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

// ---------- chorus pictures (they build: more bubbles every time) ----------
const BIG = [[250, 200, 90], [1420, 160, 84], [1640, 560, 78], [330, 560, 74]];
const MORE = [[720, 150, 42], [1220, 120, 46], [1720, 330, 50], [300, 420, 46], [1240, 520, 36], [680, 560, 34], [1560, 380, 40], [400, 140, 38], [1780, 140, 36], [820, 100, 30], [140, 700, 40], [1800, 720, 44]];
const chorusA = (S, c, n) => {
  wall(S);
  const B = bibi(S, 960, 400, { paws: [[860, 600], [1060, 600]], mood: n === 4 ? "joy" : "" });
  foam(S, 860, 585, 6, S.start, B.L); foam(S, 1060, 585, 6, S.start, B.R);
  sink(S);
  swing(S, B.g, S.start + 0.3, S.end - 0.3, { rotation: 3, svgOrigin: "960 720" }, BEAT * 2);
  [[c, 0], [c, 1], [c + 1, 0], [c + 1, 1]].forEach(([l, i], j) => bubble(S, ...BIG[j], W(l, i), { face: true, tint: ["pink", "yellow", "sky", "grass"][j] }));
  MORE.slice(0, n * 3).forEach(([x, y, r], j) => bubble(S, x, y, r, W(c + (j % 2), 2 + (j % 3)) + 0.1 * j, { tint: ["sky", "pink", "yellow"][j % 3] }));
};
const COUNT = [[650, 560, 48], [520, 430, 54], [470, 270, 60], [600, 150, 52], [780, 120, 42], [1170, 120, 46], [1300, 230, 42], [1290, 560, 50], [1450, 640, 56], [1640, 600, 48]];
// cues: [[line, word, number], ...] - the big number on a card swaps on each sung number; a bubble pops up the first time
const countB = (S, cues, n) => {
  wall(S, { towel: false });
  const B = bibi(S, 960, 400, { paws: [[920, 615], [1000, 615]], mood: n === 4 ? "joy" : "" });
  foam(S, 960, 600, 8 + 2 * n, S.start, B.g);
  sink(S);
  swing(S, B.L, S.start + 0.2, S.end - 0.2, { x: 16 }, BEAT / 2); swing(S, B.R, S.start + 0.2, S.end - 0.2, { x: -16 }, BEAT / 2);
  const ts = cues.map(([l, w]) => W(l, w)), seen = {}, [, card] = popIn(S, ts[0] - 0.2, 1540, 400);
  DS.drop(S, rrect(1390 + 6, 290 + 8, 300, 220, DS.r.lg), { parent: card }); DS.shape(S, rrect(1390, 290, 300, 220, DS.r.lg), "white", { flat: true, w: "mid", parent: card });
  cues.forEach(([, , num], i) => { const N = S.text(String(num), 1540, 440, { size: DS.type.display, t: ts[i], c: num === 10 ? DS.c("red", 2) : DS.c("ink"), parent: card });
    if (i < cues.length - 1) S.hide(N, ts[i + 1]);
    if (!seen[num]) { seen[num] = 1; bubble(S, ...COUNT[num - 1], ts[i], { face: n >= 2 && num % 3 === 1, tint: ["pink", "yellow", "sky", "grass"][(num + n) % 4] }); } });
  cardAt(S, "SCRUB!", S.start, { x: 1540, y: 180, size: DS.type.title });
};
const seq = (l, a, b, from) => Array.from({ length: b - a + 1 }, (_, i) => [l, a + i, from + i]);
// rainbow band behind the finale (filled annulus, no thick strokes)
const band = (cx, cy, r0, r1) => `M${cx - r1} ${cy} A${r1} ${r1} 0 0 1 ${cx + r1} ${cy} L${cx + r0} ${cy} A${r0} ${r0} 0 0 0 ${cx - r0} ${cy} Z`;

const CUES = [[1, 0], [3, 0], [5, 0], [7, 0], [10, 0], [12, 0], [14, 0], [16, 0], [18, 0], [20, 0], [22, 0], [24, 0], [26, 0], [27, 0]];
const WIN = sceneWindows(CUES, 0.6);
WIN.splice(12, 0, [+(CLIP(25)[1] + 1.0).toFixed(3), WIN[12][0]]); WIN[11][1] = WIN[12][0];   // instrumental clap break after "how about that"
const sc = (k, o) => scene(WIN[k][0], WIN[k][1], o);

// 0  (intro) Turn on the water, / splish splash splash, splish splash splash!
{ const S = sc(0, { cam: "push", focus: "960 500" }); DS.room(S, ROOM); wall(S);
  const B = bibi(S, 960, 400, { paws: [[860, 690]] }); const wave = arm(S, B, 1, 1190, 330);
  swing(S, wave, S.start + 0.6, W(1, 0) - 0.3, { rotation: 14, svgOrigin: wave.sh });
  S.hide(wave, W(1, 3)); arm(S, B, 1, 1172, 690, W(1, 3)); arm(S, B, -1, 1110, 700, W(2, 0)); S.hide(B.L, W(2, 0) + 0.3);
  sink(S);
  water(S, W(1, 3));
  DS.card(S, "BUBBLE BUBBLE!", 1480, 150, { size: DS.type.body, t: S.start + 1.2 });
  [[1100, 640], [1250, 650], [1080, 580], [1270, 590], [1130, 540], [1230, 530]].forEach(([x, y], i) => drop(S, x, y, W(2, i)));
  DS.vignette(S); }

// 1  Squeeze the soap, a little blob, / Squish squish, good job!
{ const S = sc(1, { cam: "zoom", focus: "760 600" }); DS.room(S, ROOM); wall(S);
  bibi(S, 960, 400, { paws: [[760, 650], [870, 660]] });
  const soap = sink(S); S.move(soap, W(3, 0), 0.25, { y: 8, yoyo: true, repeat: 1 });
  S.draw(circ(770, 622, 30, 18), W(3, 5), 0, { fill: DS.c("purple", 1), c: DS.c("purple", 2), w: DS.w.detail });
  [0, 1, 2].forEach((i) => foam(S, [740, 820, 890][i], [630, 610, 640][i], 5 + i, W(4, i)));
  sparkle(S, 1560, 380, 70, W(4, 2));
  DS.card(S, "SOAP", 1560, 160, { size: DS.type.title, t: W(3, 2) });
  DS.card(S, "GOOD JOB!", 1560, 540, { size: DS.type.body, t: W(4, 2), tc: "green" });
  DS.vignette(S); }

// 2, 3  chorus 1: Bubble bubble, wash your hands! / scrub and count! / 1 2 3 4, 1 2 3 4, 5 6 7 8 9 10
{ const S = sc(2, { cam: "push" }); DS.room(S, ROOM); chorusA(S, 5, 1); DS.vignette(S); }
{ const S = sc(3, { cam: "none" }); DS.room(S, ROOM); countB(S, [...seq(7, 0, 3, 1), ...seq(8, 0, 3, 1), ...seq(9, 0, 5, 5)], 1); DS.vignette(S); }

// 4  Rub your palms, round and round, / Round and round and round!
{ const S = sc(4, { cam: "push" }); DS.room(S, { wall: "glass", window: false, back: [-100, -100, 2020, 860] }); closeSet(S);
  const [L] = hand(S, 860, 470, 1, 14, {}), [R] = hand(S, 1060, 470, 1, -14, { flip: true });
  swing(S, L, W(10, 3), S.end - 0.3, { x: 26, y: -18 }, BEAT); swing(S, R, W(10, 3), S.end - 0.3, { x: -26, y: 18 }, BEAT);
  foam(S, 960, 430, 9, W(10, 2)); foam(S, 900, 250, 5, W(11, 0)); foam(S, 1030, 600, 6, W(11, 3));
  S.arrow(700, 260, 680, 640, W(10, 3), 0.3, { bend: -0.5, c: DS.c("blue", 2), w: DS.w.near });
  S.arrow(1220, 640, 1240, 260, W(11, 0), 0.3, { bend: -0.5, c: DS.c("blue", 2), w: DS.w.near });
  DS.card(S, "PALMS", 1560, 160, { size: DS.type.title, t: W(10, 2) });
  DS.vignette(S); }

// 5  Now the backs, rub rub rub, / Rub rub, scrub a dub!
{ const S = sc(5, { cam: "push" }); DS.room(S, { wall: "glass", window: false, back: [-100, -100, 2020, 860] }); closeSet(S);
  hand(S, 900, 520, 1, -8, { back: true });
  const [T] = hand(S, 1080, 380, 0.9, -70, { flip: true, back: true });
  swing(S, T, W(12, 3), S.end - 0.3, { x: -40, y: 10 }, BEAT);
  [0, 1, 2].forEach((i) => foam(S, [820, 940, 880][i], [430, 470, 600][i], 4 + i, W(12, 3 + i)));
  [0, 1, 2].forEach((i) => bubble(S, [420, 520, 1500][i], [300, 640, 560][i], [60, 44, 56][i], W(13, i), { face: i === 0 }));
  DS.card(S, "BACKS", 1560, 160, { size: DS.type.title, t: W(12, 2) });
  DS.vignette(S); }

// 6  In between your fingers, wiggle wiggle wiggle wiggle, / Bubbles in the middle,
{ const S = sc(6, { cam: "push" }); DS.room(S, { wall: "glass", window: false, back: [-100, -100, 2020, 860] }); closeSet(S);
  const [L] = hand(S, 880, 520, 1, 10, { back: true }), [R] = hand(S, 1040, 500, 1, -10, { flip: true });
  [[L, 4], [R, -4]].forEach(([e, d]) => swing(S, e, W(14, 4), S.end - 0.3, { rotation: d, svgOrigin: "960 700" }, BEAT / 2));
  [[920, 330], [962, 300], [1004, 330], [880, 360]].forEach(([x, y], i) => bubble(S, x, y - 30, 24, W(15, 0) + 0.15 * i, { drift: false }));
  [0, 1, 2].forEach((i) => bubble(S, [420, 1470, 560][i], [280, 600, 620][i], [70, 62, 48][i], W(14, 4 + i), { face: true, tint: ["yellow", "pink", "sky"][i] }));
  DS.card(S, "FINGERS", 1560, 160, { size: DS.type.title, t: W(14, 3) });
  DS.vignette(S); }

// 7  Twist your thumbs, / Twist twist twist!
{ const S = sc(7, { cam: "push" }); DS.room(S, { wall: "glass", window: false, back: [-100, -100, 2020, 860] }); closeSet(S);
  hand(S, 860, 560, 1, 20, {});
  const [F] = popIn(S, W(16, 2), 760, 380); DS.shape(S, cap(760, 400, 420, 1160, 70), "pink", { parent: F }); DS.shape(S, circ(760, 400, 92, 84), "pink", { parent: F });
  [0, 1, 2].forEach((i) => S.draw(`M${712 + i * 34} 340 V380`, S.start, 0, { c: DS.c("pink", 2), w: DS.w.near, parent: F }));
  swing(S, F, W(17, 0), S.end - 0.3, { rotation: 8, svgOrigin: "760 400" }, BEAT);
  S.arrow(620, 250, 900, 250, W(17, 0), 0.3, { bend: -0.35, c: DS.c("blue", 2), w: DS.w.near });
  foam(S, 760, 480, 6, W(17, 1));
  [0, 1].forEach((i) => bubble(S, [1300, 1500][i], [520, 330][i], [62, 52][i], W(17, 1 + i), { face: true, tint: ["grass", "pink"][i] }));
  DS.card(S, "THUMBS", 1560, 160, { size: DS.type.title, t: W(16, 2) });
  DS.vignette(S); }

// 8, 9  chorus 2 (more bubbles): 1-5 / 6-10
{ const S = sc(8, { cam: "push" }); DS.room(S, ROOM); chorusA(S, 18, 2); DS.vignette(S); }
{ const S = sc(9, { cam: "none" }); DS.room(S, ROOM); countB(S, [...seq(20, 0, 4, 1), ...seq(21, 0, 4, 6)], 2); DS.vignette(S); }

// 10  Rinse them off, whoosh whoosh whoosh, / Bubbles go down, whoosh whoosh!
{ const S = sc(10, { cam: "push", focus: "1100 600" }); DS.room(S, ROOM); wall(S);
  bibi(S, 960, 400, { paws: [[1100, 650], [1220, 650]] });
  sink(S, { soap: false }); water(S, S.start + 0.3);
  const ts = [W(22, 3), W(22, 4), W(22, 5), W(23, 2), W(23, 3), W(23, 4)];
  [[1110, 560, 40], [1230, 560, 36], [1060, 620, 30], [1280, 610, 32], [1170, 520, 28], [1150, 640, 26]].forEach(([x, y, r], i) => {
    const b = bubble(S, x, y, r, S.start, { drift: false, tint: "sky" });
    S.move(b, ts[i], 0.5, { y: 760 - y, scale: 0.4, opacity: 0, svgOrigin: `${x} ${y}` }, "power1.in"); });
  [0, 1].forEach((i) => drop(S, [1040, 1300][i], [700, 690][i], W(23, 3 + i)));
  DS.card(S, "RINSE", 1560, 160, { size: DS.type.title, t: W(22, 0) });
  DS.vignette(S); }

// 11  Dry your hands, pat pat pat, / Clean clean hands, how about that!
{ const S = sc(11, { cam: "push" }); DS.room(S, ROOM); wall(S);
  const B = bibi(S, 960, 400, { paws: [[880, 610], [1040, 610]] });
  const [T] = popIn(S, W(24, 0), 960, 620); DS.shape(S, rrect(820, 560, 280, 150, DS.r.md), "grass", { parent: T });
  S.draw("M820 670 H1100 M820 686 H1100", S.start, 0, { c: DS.P.white[0], w: DS.w.detail, parent: T });
  [3, 4, 5].forEach((i) => S.move(T, W(24, i), 0.18, { y: 14, yoyo: true, repeat: 1 }, "sine.inOut"));
  S.fadeOut(T, W(25, 0)); S.hide(B.g, W(25, 0) + 0.35);
  const J = bibi(S, 960, 400, { paws: [[820, 520], [1100, 520]], mood: "joy" }); S.fadeIn(J.g, W(25, 0), 0.35);   // towel away, paws up
  sink(S);
  sparkle(S, 760, 440, 40, W(25, 0)); sparkle(S, 1160, 440, 44, W(25, 1)); sparkle(S, 960, 120, 36, W(25, 3));
  DS.card(S, "DRY", 1560, 160, { size: DS.type.title, t: W(24, 0) });
  DS.card(S, "CLEAN!", 1560, 330, { size: DS.type.title, t: W(25, 0), tc: "green" });
  DS.vignette(S); }

// 12  (music break) clap along: paws clap on the beat, a bubble every two beats
{ const S = sc(12, { cam: "push" }); DS.room(S, ROOM); wall(S);
  const B = bibi(S, 960, 400, { paws: [[900, 560], [1020, 560]], mood: "joy" });
  sink(S);
  swing(S, B.L, S.start + 0.4, S.end - 0.2, { x: -30 }, BEAT / 2); swing(S, B.R, S.start + 0.4, S.end - 0.2, { x: 30 }, BEAT / 2);
  [...BIG, ...MORE.slice(0, 6)].forEach(([x, y, r], j) => { const t = S.start + 0.8 + j * BEAT * 1.5; if (t < S.end - 0.8) bubble(S, x, y, r, t, { face: j < 4, tint: ["pink", "yellow", "sky", "grass"][j % 4] }); });
  DS.card(S, "CLAP CLAP!", 1500, 150, { size: DS.type.title, t: S.start + 0.4 });
  DS.vignette(S); }

// 13  Yay, clean hands!  (then music: bubbles keep coming)
{ const S = sc(13, { cam: "pull" }); DS.room(S, ROOM); wall(S);
  const B = bibi(S, 960, 470, { paws: [[730, 300], [1190, 300]], mood: "joy" });
  sink(S);
  swing(S, B.g, S.start + 0.3, S.end - 0.3, { y: -16 }, BEAT);
  [...BIG, ...MORE].forEach(([x, y, r], j) => { const t = W(26, 0) + 0.5 + j * BEAT; if (t < S.end - 0.8) bubble(S, x, y, r, t, { face: j < 6, tint: ["pink", "yellow", "sky", "grass"][j % 4] }); });
  [[730, 300], [1190, 300]].forEach(([x, y], i) => sparkle(S, x, y - 80, 40, W(26, 1) + 0.2 * i));
  DS.card(S, "YAY!", 960, 130, { size: DS.type.title, t: W(26, 0), tc: "red" });
  DS.card(S, "CLEAN HANDS!", 960, 860, { size: DS.type.title, t: W(26, 1), tc: "green" });
  DS.vignette(S); }

// 14  Yay, clean hands! / Clean hands!  (big happy ending: rainbow, every bubble smiling)
{ const S = sc(14, { cam: "zoom", focus: "960 450" }); DS.room(S, ROOM); wall(S);
  ["red", "orange", "yellow", "grass", "sky", "purple"].forEach((c, i) => { const [, g] = popIn(S, W(27, 0) + 0.12 * i, 960, 700); S.fill(band(960, 700, 640 - 34 * (i + 1), 640 - 34 * i), S.start, 0, DS.c(c, 1, "mid"), 0.9, g); });
  const B = bibi(S, 960, 470, { paws: [[730, 300], [1190, 300]], mood: "joy" });
  sink(S);
  swing(S, B.g, S.start + 0.3, S.end - 0.3, { y: -16 }, BEAT);
  [...BIG, ...MORE].forEach(([x, y, r], j) => bubble(S, x, y, r, S.start + 0.1 * j, { face: true, tint: ["pink", "yellow", "sky", "grass"][j % 4] }));
  [[730, 220], [1190, 220], [560, 420], [1360, 420]].forEach(([x, y], i) => sparkle(S, x, y, 40, W(28, 0) + 0.2 * i));
  DS.card(S, "YAY!", 960, 130, { size: DS.type.title, t: W(27, 0), tc: "red" });
  DS.card(S, "CLEAN HANDS!", 960, 860, { size: DS.type.title, t: W(28, 0), tc: "green" });
  DS.vignette(S); }
