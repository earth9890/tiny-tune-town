// 08 Itsy Bitsy Spider: the garden set, Itsy the spider, weather and props. Included by scenes.js and the thumbnails.
// Layout: Ollie centre (820, gy 900, k 1.2), Bibi left (380), the little house right with the water spout at x 1330.
const OX = 800, OGY = 900, OK = 1.2, FACE = [OX, OGY - 330 * OK];   // Ollie's face centre = camera anchor
const BX = 380, BHY = 560, BK = 0.78;                                 // Bibi
const SPX = 1370, SPTOP = 430, SPBOT = 820;                           // the spout: Itsy climbs x = SPX between these
const arcLine = (cx, cy, r, a0, a1, ry = r) => arcPts(cx, cy, r, a0, a1, 60, ry).map((p, i) => `${i ? "L" : "M"}${K(p[0])} ${K(p[1])}`).join(" ");
const saw = (n) => (p) => (p * n) % 1;                                // sawtooth ease: a periodic layer slides n times, seamlessly

// ---------- Itsy: a round, friendly purple spider (front view, she climbs the front of the pipe) ----------
// o: { look, t }. Returns I with .to(x, y, t, dur) .arc(h, t, dur) .spin(t, dur) .scurry(t0, t1) .wave(t0, t1) .x .y
const itsy = (S, x, y, k = 1, o = {}) => {
  const pos = G(S, o.parent, `translate(${x} ${y})`), pop = G(S, pos), hop = G(S, pop, "translate(0 0)"), rot = G(S, hop, "rotate(0)"), body = G(S, rot, `scale(${k})`);
  const ink = DS.c("purple", 2), lk = o.look || 0, legs = [];
  [-1, 1].forEach((s) => [-58, -20, 18, 54].forEach((a, i) => {
    const r = (a * Math.PI) / 180, c = Math.cos(r), sn = Math.sin(r), rx = s * 34 * c, ry = 34 * sn;
    const lg = G(S, body, `rotate(0 ${K(rx)} ${K(ry)})`), lw = G(S, lg, `rotate(0 ${K(rx)} ${K(ry)})`);
    S.draw(smooth([[rx, ry], [s * 66 * c, 64 * sn - 22], [s * 92 * c, 92 * sn + 6]]), S.start, 0, { c: ink, w: DS.w.near, parent: lw });
    S.fill(circ(s * 92 * c, 92 * sn + 8, 8), S.start, 0, DS.c("purple", 1), 1, lw);
    legs.push({ lg, lw, rx, ry, s, i });
  }));
  DS.shape(S, circ(0, 0, 46, 44), "purple", { t: S.start, parent: body });
  S.fill(circ(-17, -22, 14, 8), S.start, 0, DS.P.white[0], 0.45, body);
  S.draw("M-8 -42 Q-14 -60 0 -62 M6 -43 Q8 -58 18 -56", S.start, 0, { c: ink, w: DS.w.mid, parent: body });     // two hair tufts
  [-1, 1].forEach((s) => {
    DS.shape(S, circ(s * 17, -6, 15, 17), "white", { t: S.start, parent: body, flat: true, w: "detail" });
    S.fill(circ(s * 17 + lk, -3, 9), S.start, 0, DS.P.ink[0], 1, body);
    S.fill(circ(s * 17 + lk - 3, -7, 3.5), S.start, 0, DS.P.white[0], 1, body);
    S.draw(`M${s * 26} -19 L${s * 33} -26 M${s * 20} -23 L${s * 23} -31`, S.start, 0, { c: DS.P.ink[0], w: DS.w.detail, parent: body }); // lashes
    S.fill(circ(s * 31, 15, 9, 5), S.start, 0, DS.c("red", 1), 0.6, body);
  });
  S.draw("M-11 17 Q0 28 11 17", S.start, 0, { c: DS.P.ink[0], w: DS.w.detail, parent: body });
  if ((o.t ?? S.start) > S.start + 0.05) popAt(pop, o.t, 0, 0);
  const I = { pos, body, legs, x, y, k };
  I.to = (x1, y1, t0, dur = 1, ease = "sine.inOut") => { tw(pos, t0, dur, `translate(${I.x} ${I.y})`, `translate(${x1} ${y1})`, ease); I.x = x1; I.y = y1; };
  I.arc = (h, t0, dur = 0.8) => tw(hop, t0, dur, "translate(0 0)", `translate(0 ${-h})`, hump(1));
  I.spin = (t0, dur = 1, turns = 1) => tw(rot, t0, dur, "rotate(0)", `rotate(${360 * turns})`, "power1.inOut");
  I.scurry = (t0, t1, amp = 14) => legs.forEach((L, j) => tw(L.lg, t0, t1 - t0, `rotate(0 ${K(L.rx)} ${K(L.ry)})`, `rotate(${(j % 2 ? amp : -amp)} ${K(L.rx)} ${K(L.ry)})`, wave(cyc(t1 - t0, BEAT / 2))));
  I.wave = (t0, t1, s = 1) => { const L = legs.find((l) => l.s === s && l.i === 0); tw(L.lw, t0, t1 - t0, `rotate(0 ${K(L.rx)} ${K(L.ry)})`, `rotate(${-s * 40} ${K(L.rx)} ${K(L.ry)})`, hump(cyc(t1 - t0, BEAT))); };
  I.climb = (y1, t0, t1) => { I.to(SPX, y1, t0, t1 - t0, "sine.inOut"); I.scurry(t0, t1); };   // up the spout, legs going
  return I;
};

// ---------- the garden set ----------
const puff = (S, x, y, k = 1, name = "white", o = {}) => {   // fluffy cloud: outlines first, fills on top = one clean silhouette
  const g = G(S, o.parent, "translate(0 0)"), C = [[-90, 10, 60], [-30, -30, 74], [50, -20, 66], [105, 15, 50], [0, 20, 70]];
  C.forEach(([dx, dy, r]) => S.draw(circ(x + dx * k, y + dy * k, r * k), S.start, 0, { c: DS.line("mid"), w: DS.w.near, parent: g }));
  C.forEach(([dx, dy, r]) => S.fill(circ(x + dx * k, y + dy * k, r * k), S.start, 0, DS.c(name, 0), 1, g));
  S.fill(circ(x - 40 * k, y - 50 * k, 34 * k, 16 * k), S.start, 0, DS.P.white[0], 0.6, g);
  return g;
};
const flower = (S, x, gy, h, name, layer = "near") => {
  S.draw(`M${x} ${gy} Q${x - 10} ${gy - h / 2} ${x} ${gy - h}`, S.start, 0, { c: DS.c("green", 2, layer), w: DS.w.mid });
  DS.shape(S, `M${x} ${gy - h * 0.45} q-34 -6 -42 -30 q30 -2 42 30 Z`, "grass", { layer, w: "detail" });
  [0, 72, 144, 216, 288].forEach((a) => { const r = (a * Math.PI) / 180; DS.shape(S, circ(x + Math.cos(r) * 20, gy - h + Math.sin(r) * 20, 17), name, { layer, w: "detail" }); });
  DS.shape(S, circ(x, gy - h, 13), "yellow", { layer, w: "detail" });
};
const house = (S) => {
  const hg = G(S, null, "translate(40 0)");   // the house sits 40 px right of its drawn coordinates
  DS.shape(S, rect(1690, 210, 70, 140), "red", { layer: "mid", tone: 2, parent: hg });                           // chimney
  DS.shadow(S, 1555, 892, 640, { parent: hg });
  DS.shape(S, rect(1290, 400, 530, 492), "wall", { dir: "h", parent: hg });                                      // front wall
  [470, 540, 610, 680, 750, 820].forEach((y) => S.draw(`M1290 ${y} H1820`, S.start, 0, { c: DS.c("wall", 2), w: DS.w.hair, op: 0.6, parent: hg }));
  DS.shape(S, "M1240 412 L1555 180 L1870 412 Z", "red", { parent: hg });                                             // roof
  [[1400, 330], [1555, 230], [1710, 330], [1480, 380], [1630, 380]].forEach(([x, y]) => S.draw(`M${x - 40} ${y} Q${x} ${y + 22} ${x + 40} ${y}`, S.start, 0, { c: DS.c("red", 2), w: DS.w.detail, parent: hg }));
  DS.shape(S, rrect(1236, 404, 640, 22, DS.r.xs), "gray", { w: "mid", parent: hg });                             // gutter
  DS.shape(S, rect(1440, 490, 170, 150), "white", { w: "mid", parent: hg });                                      // window
  S.fill(rect(1456, 506, 138, 118), S.start, 0, DS.vgrad(DS.P.sky[1], DS.P.sky[0]), 1, hg);
  S.draw("M1525 506 V624 M1456 565 H1594", S.start, 0, { c: DS.P.white[0], w: DS.w.near, parent: hg });
  DS.shape(S, rrect(1426, 640, 198, 34, DS.r.sm), "wood", { w: "mid", parent: hg });                            // flower box
  [[1460, "red"], [1505, "yellow"], [1550, "pink"], [1594, "orange"]].forEach(([x, c]) => { DS.shape(S, circ(x, 628, 18), c, { w: "detail", parent: hg }); S.fill(circ(x, 628, 6), S.start, 0, DS.c("yellow", 1), 1, hg); });
  DS.shape(S, "M1660 892 V700 Q1660 640 1720 640 Q1780 640 1780 700 V892 Z", "blue", { parent: hg });               // door
  DS.shape(S, circ(1758, 780, 10), "gold", { w: "detail", parent: hg });
  DS.shape(S, rrect(1640, 884, 160, 18, DS.r.xs), "gray", { w: "mid", parent: hg });                            // step
};
const spout = (S) => {   // the water spout: down the wall's left edge, elbow out at the bottom
  DS.shape(S, rrect(SPX - 17, 418, 34, 430, DS.r.xs), "gray", { dir: "h" });
  DS.shape(S, `M${SPX - 17} 840 Q${SPX - 17} 880 ${SPX - 62} 884 L${SPX - 70} 852 Q${SPX + 17} 850 ${SPX + 17} 836 Z`, "gray", { w: "near" });
  [520, 680].forEach((y) => DS.shape(S, rrect(SPX - 24, y, 48, 14, DS.r.xs), "gray", { w: "mid", tone: 2 }));
  S.fill(rect(SPX - 10, 430, 6, 400), S.start, 0, DS.P.white[0], 0.45);
};
const fence = (S) => {
  DS.shape(S, rect(-40, 600, 1300, 18), "wood", { layer: "mid", w: "mid" }); DS.shape(S, rect(-40, 660, 1300, 18), "wood", { layer: "mid", w: "mid" });
  for (let x = -20; x < 1250; x += 74) DS.shape(S, `M${x} 720 V586 L${x + 22} 562 L${x + 44} 586 V720 Z`, "white", { layer: "mid", w: "mid" });
};
const tree = (S, x, gy) => {
  DS.shadow(S, x, gy, 220);
  DS.shape(S, `M${x - 26} ${gy} L${x - 18} ${gy - 220} H${x + 18} L${x + 26} ${gy} Z`, "wood", { layer: "mid" });
  [[-80, -260, 90], [70, -270, 95], [0, -350, 110], [-40, -200, 70], [60, -190, 70]].forEach(([dx, dy, r]) => DS.shape(S, circ(x + dx, gy + dy, r), "grass", { layer: "mid" }));
  [[-50, -300], [40, -330], [80, -230]].forEach(([dx, dy]) => DS.shape(S, circ(x + dx, gy + dy, 12), "red", { layer: "mid", w: "detail" }));  // apples
};
// the whole garden (call first). o: { sky, clouds: [[x, y, k, name]] }
const garden = (S, o = {}) => {
  const O = DS.outdoor(S, { hy: 640, sky: o.sky || "sky", sun: false, hills: "grass" });
  (o.clouds || [[300, 150, 0.8, "white"], [1050, 110, 0.6, "white"]]).forEach((c) => puff(S, ...c));
  if (o.rainbow) rainbow(S, o.rainbow);
  tree(S, 150, 700); fence(S); house(S); spout(S);
  return O;
};
const foreground = (S) => {   // near-plane flowers, bottom corners (drawn last, in front of everyone)
  [[70, 940, 150, "red"], [150, 950, 110, "yellow"], [230, 945, 160, "pink"]].forEach((f) => flower(S, ...f));
  DS.shape(S, "M-40 960 Q40 840 150 900 Q230 850 300 960 Z", "green");
};

// ---------- weather ----------
const layerOf = (S, t0, t1) => { const g = G(S, null); if (t0 > S.start + 0.05) tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.8 }, t0); if (t1 < S.end) tl.to(g, { opacity: 0, duration: 0.8 }, t1); return g; };
const rainFall = (S, t0, t1) => {          // gentle slanted rain, a seamless loop (period 0.7 s)
  const g = layerOf(S, t0, t1), fall = G(S, g, "translate(0 0)"), D = 360;
  for (let i = 0; i < 46; i++) { const x = -160 + ((i * 397) % 2240), y0 = (i * 151) % D;
    for (let j = -1; j < 3; j++) S.fill(cap(x, y0 + j * D, x - 8, y0 + j * D + 38, 5), S.start, 0, DS.c("blue", 1), 0.7, fall); }
  tw(fall, S.start, S.len, "translate(0 0)", `translate(-24 ${D})`, saw(Math.round(S.len / 0.7)));
  return g;
};
const snowFall = (S, t0, t1) => {          // slow snowflakes drifting down (period 4 s)
  const g = layerOf(S, t0, t1), fall = G(S, g, "translate(0 0)"), D = 540;
  for (let i = 0; i < 40; i++) { const x = -160 + ((i * 397) % 2240), y0 = (i * 173) % D, r = 7 + (i % 3) * 4;
    for (let j = -1; j < 2; j++) S.draw(circ(x, y0 + j * D, r), S.start, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.hair, parent: fall }); }
  tw(fall, S.start, S.len, "translate(0 0)", `translate(40 ${D})`, saw(Math.round(S.len / 4)));
  return g;
};
const windBlow = (S, t0, t1) => {          // curly gusts and leaves sliding left -> right (period 1.8 s)
  const g = layerOf(S, t0, t1), blow = G(S, g, "translate(0 0)"), D = 960;
  for (let j = -1; j < 3; j++) {
    [[80, 260], [420, 520], [700, 330], [260, 720]].forEach(([x, y]) => S.draw(`M${x + j * D} ${y} q90 -40 180 0 t180 0 q50 -50 0 -70 q-40 0 -30 40`, S.start, 0, { c: DS.P.white[0], w: DS.w.near, op: 0.85, parent: blow }));
    [[200, 420, "orange"], [560, 250, "grass"], [820, 600, "yellow"], [380, 820, "orange"]].forEach(([x, y, c]) => DS.shape(S, `M${x + j * D} ${y} q24 -26 50 0 q-24 26 -50 0 Z`, c, { parent: blow, w: "detail" }));
  }
  tw(blow, S.start, S.len, "translate(0 0)", `translate(${D} 0)`, saw(Math.round(S.len / 1.8)));
  return g;
};
const sunFace = (S, x, y, r, t) => {       // a smiling sun; rays turn slowly
  const g = G(S, null, "translate(0 0)"), spin = G(S, g, `rotate(0 ${x} ${y})`);
  S.fill(circ(x, y, r * 2.6), S.start, 0, DS.glow(DS.P.yellow[1], 0.7), 1, g);
  S.draw(rays(x, y, r * 1.25, r * 1.7, 12), S.start, 0, { c: DS.c("orange", 0), w: DS.w.near, parent: spin });
  DS.shape(S, circ(x, y, r), "yellow", { parent: g });
  [-1, 1].forEach((s) => { S.draw(arc(x + s * r * 0.36, y - r * 0.08, r * 0.16, 200, 340), S.start, 0, { c: DS.P.ink[0], w: DS.w.mid, parent: g }); S.fill(circ(x + s * r * 0.6, y + r * 0.22, r * 0.16, r * 0.1), S.start, 0, DS.c("red", 1), 0.6, g); });
  S.draw(`M${x - r * 0.3} ${y + r * 0.2} Q${x} ${y + r * 0.55} ${x + r * 0.3} ${y + r * 0.2}`, S.start, 0, { c: DS.P.ink[0], w: DS.w.mid, parent: g });
  tw(spin, S.start, S.len, `rotate(0 ${x} ${y})`, `rotate(40 ${x} ${y})`, "none");
  if (t > S.start + 0.05) popAt(g, t, x, y);
  return g;
};
const RAINBOW = ["red", "orange", "yellow", "grass", "sky", "purple"];
const rainbow = (S, t) => {                 // six bands over the garden; each fades in a beat after the last
  const g = G(S, null), cx = 1000, cy = 700;
  RAINBOW.forEach((c, i) => { const r0 = 760 - i * 38, r1 = r0 - 38;
    const p = S.fill(arcLine(cx, cy, r0, 180, 360) + " " + arcLine(cx, cy, r1, 360, 180).replace("M", "L") + " Z", S.start, 0, DS.c(c, 0, "far"), 0.9, g);
    if (t > S.start + 0.05) tl.fromTo(p, { opacity: 0 }, { opacity: 0.9, duration: 0.6 }, t + i * BEAT / 2); });
  return g;
};
const puddle = (S, t) => { const g = G(S, null); S.draw(circ(SPX - 90, 914, 110, 18), S.start, 0, { fill: DS.c("glass", 2), c: DS.c("sky", 2), w: DS.w.detail, parent: g, op: 0.9 }); if (t > S.start + 0.05) S.fadeIn(g, t, 0.6); return g; };
const gush = (S, t0, t1) => { const g = G(S, null);   // water pouring out of the spout
  S.fill(`M${SPX - 66} 852 Q${SPX - 110} 870 ${SPX - 118} 910 L${SPX - 86} 910 Q${SPX - 84} 880 ${SPX - 60} 880 Z`, S.start, 0, DS.c("sky", 0), 0.9, g);
  tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.3 }, t0); tl.to(g, { opacity: 0, duration: 0.5 }, t1); return g; };
const snowCover = (S, t0, t1) => {          // snow on the roof, fence, grass and spout top; melts away at t1
  const g = layerOf(S, t0, t1), wh = { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.detail, parent: g };
  S.draw("M1272 418 L1595 170 L1878 418 Q1860 440 1830 418 Q1790 440 1750 410 L1555 222 L1360 410 Q1320 440 1280 418 Q1250 440 1232 418 Z", S.start, 0, wh);
  S.draw("M-40 598 H1262 Q1250 616 1230 604 Q1150 616 1080 604 Q900 618 700 604 Q500 618 300 604 Q120 616 -40 606 Z", S.start, 0, wh);
  [[300, 760, 260, 40], [1100, 800, 220, 34], [620, 960, 300, 30], [1500, 950, 260, 28], [80, 880, 160, 26]].forEach(([x, y, rx, ry]) => S.draw(circ(x, y, rx, ry), S.start, 0, wh));
  return g;
};

// ---------- props ----------
// umbrella: canopy rim centred at (cx, cy), radius r, held at (hx, hy) (shaft from the hold point to the canopy top)
const umbrella = (S, hx, hy, cx, cy, r, name, parent) => {
  const g = G(S, parent), h = r * 0.62, n = 4;
  S.draw(`M${K(hx)} ${K(hy)} L${K(cx)} ${K(cy - h)}`, S.start, 0, { c: DS.c("brown", 0), w: DS.w.near, parent: g });
  S.draw(`M${K(hx)} ${K(hy)} q0 ${K(r * 0.16)} ${K(-r * 0.12)} ${K(r * 0.14)}`, S.start, 0, { c: DS.c("brown", 0), w: DS.w.near, parent: g });
  let d = arc(cx, cy, r, 180, 360, h);
  for (let i = n - 1; i >= 0; i--) { const x0 = cx - r + ((i + 1) * 2 * r) / n, x1 = cx - r + (i * 2 * r) / n; d += ` Q${K((x0 + x1) / 2)} ${K(cy - h * 0.2)} ${K(x1)} ${K(cy)}`; }
  DS.shape(S, d + " Z", name, { parent: g });
  for (let i = 1; i < n; i++) S.draw(`M${K(cx)} ${K(cy - h)} Q${K(cx - r + (i * 2 * r) / n)} ${K(cy - h * 0.6)} ${K(cx - r + (i * 2 * r) / n)} ${K(cy)}`, S.start, 0, { c: DS.c(name, 2), w: DS.w.mid, parent: g });
  DS.shape(S, circ(cx, cy - h - 8, 10), name, { parent: g, w: "mid", tone: 2 });
  return g;
};
// scarf: a band across (x, y) half-width rx, with a tail that flaps (returns { g, tail, ox, oy })
const scarf = (S, x, y, rx, name, parent, k = 1) => {
  const g = G(S, parent), ox = x + rx * 0.45, oy = y + 6 * k, tail = G(S, g, `rotate(0 ${K(ox)} ${K(oy)})`);
  DS.shape(S, `M${K(ox - 16 * k)} ${K(oy)} L${K(ox + 30 * k)} ${K(oy + 100 * k)} L${K(ox + 70 * k)} ${K(oy + 86 * k)} L${K(ox + 22 * k)} ${K(oy - 6 * k)} Z`, name, { parent: tail, w: "mid" });
  S.draw(`M${K(ox + 30 * k)} ${K(oy + 100 * k)} l-4 ${K(14 * k)} M${K(ox + 50 * k)} ${K(oy + 93 * k)} l0 ${K(14 * k)} M${K(ox + 70 * k)} ${K(oy + 86 * k)} l4 ${K(14 * k)}`, S.start, 0, { c: DS.c(name, 2), w: DS.w.mid, parent: tail });
  DS.shape(S, `M${K(x - rx)} ${K(y - 10 * k)} Q${K(x)} ${K(y + 22 * k)} ${K(x + rx)} ${K(y - 10 * k)} L${K(x + rx)} ${K(y + 18 * k)} Q${K(x)} ${K(y + 52 * k)} ${K(x - rx)} ${K(y + 18 * k)} Z`, name, { parent: g, w: "mid" });
  S.draw(`M${K(x - rx * 0.5)} ${K(y + 2 * k)} l0 ${K(30 * k)} M${K(x)} ${K(y + 7 * k)} l0 ${K(30 * k)} M${K(x + rx * 0.5)} ${K(y + 2 * k)} l0 ${K(30 * k)}`, S.start, 0, { c: DS.P.white[0], w: DS.w.mid, parent: g });
  return { g, tail, ox, oy, flap: (t0, t1, amp = 18) => tw(tail, t0, t1 - t0, `rotate(0 ${K(ox)} ${K(oy)})`, `rotate(${-amp} ${K(ox)} ${K(oy)})`, wave(cyc(t1 - t0, BEAT))) };
};
// sunglasses pushed up on the forehead (eyes stay clear): lenses centred at (cx ± gap, cy), radius r
const shades = (S, cx, cy, gap, r, name, parent) => {
  const g = G(S, parent);
  S.draw(`M${K(cx - gap + r)} ${K(cy)} Q${K(cx)} ${K(cy - r * 0.5)} ${K(cx + gap - r)} ${K(cy)}`, S.start, 0, { c: DS.c(name, 2), w: DS.w.near, parent: g });
  [-1, 1].forEach((s) => { S.draw(circ(cx + s * gap, cy, r, r * 0.86), S.start, 0, { fill: DS.c("navy", 0), c: DS.c(name, 0), w: DS.w.near, parent: g });
    S.fill(circ(cx + s * gap - r * 0.35, cy - r * 0.32, r * 0.22, r * 0.14), S.start, 0, DS.P.white[0], 0.85, g); });
  return g;
};

// ---------- cast in this set ----------
// Ollie at the garden spot; Bibi beside him (with a contact shadow, she stands on the grass)
const gOllie = (S, o = {}) => ollie(S, OX, OGY, OK, { mouth: o.mouth, look: o.look || 0 });
const gBibi = (S, o = {}) => { DS.shadow(S, BX, BHY + 325 * BK, 280 * BK); return bibi(S, BX, BHY, { k: BK, mood: o.mood, paws: o.paws }); };
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
// aim arm A so its tip points at (x, y) in body units (the tip lands at arm's length along that line)
const aim = (O, A, x, y, t0, dur = 0.6) => {
  const tx0 = A.tip[0] - A.x, ty0 = A.tip[1] - A.y; let r = (Math.atan2(y - A.y, x - A.x) - Math.atan2(ty0, tx0)) * 180 / Math.PI; r = ((r + 540) % 360) - 180;
  O.raise(A, r * A.side, t0, dur); return O.tipNow(A);
};
const toBody = (x, y) => [(x - OX) / OK, (y - OGY) / OK];       // world -> Ollie body units
// hand actions (kids copy them; raise angles > 110 tuck the tip behind the head): climbing = the two outer arms go up hand over hand, one beat each
const climbHands = (O, t0, t1) => { const L = arm(O, 0, 1), R = arm(O, 0, -1); let i = 0;
  for (let t = t0; t < t1 - BEAT * 0.5; t += BEAT, i++) { O.raise(L, i % 2 ? 60 : 100, t, BEAT * 0.8); O.raise(R, i % 2 ? 100 : 60, t, BEAT * 0.8); }
  O.raise(L, 0, t1 - BEAT * 0.5, BEAT * 0.5); O.raise(R, 0, t1 - BEAT * 0.5, BEAT * 0.5); };
const sunHands = (O, t0, t1) => { [arm(O, 0, 1), arm(O, 0, -1)].forEach((A) => { O.raise(A, 105, t0, 0.6); O.raise(A, 0, t1 - 0.5, 0.5); }); };
const bibiClimb = (S, B, t0, t1) => { swing(S, B.L, t0, t1, { rotation: 28, svgOrigin: B.L.sh }, BEAT); swing(S, B.R, t0 + BEAT, t1, { rotation: -28, svgOrigin: B.R.sh }, BEAT); };
