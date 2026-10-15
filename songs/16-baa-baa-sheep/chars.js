// look: still
// Song 16 characters, props and meadow set, shared by scenes.js and the thumbnails (pasted in by `// @include chars.js`).
const COLS = ["black", "white", "pink", "rainbow"];
const RAIN = ["red", "orange", "yellow", "grass", "sky", "purple"];
// ---------- kawaii face bits ----------
const dot = (S, d, color, g, op = 1) => S.fill(d, S.start, 0, color, op, g);
const eyes = (S, g, dx, y, r, look = 0) => [-1, 1].forEach((s) => {
  dot(S, circ(s * dx + look, y, r * 0.82, r), DS.P.ink[0], g);
  dot(S, circ(s * dx + look - r * 0.28, y - r * 0.38, r * 0.34), DS.P.white[0], g);
  dot(S, circ(s * dx + look + r * 0.26, y + r * 0.4, r * 0.15), DS.P.white[0], g);
});
const cheeks = (S, g, dx, y, r) => [-1, 1].forEach((s) => dot(S, circ(s * dx, y, r, r * 0.62), DS.c("pink"), g, 0.7));

// ---------- the sheep: round fluffy wool body, cream face, big eyes. ~365 tall at k = 1, origin = ground centre ----------
const WOOL = {
  black: { ring: [["ink", 1]], fill: ["ink", 1], fluff: [["gray", 2]], op: 0.45 },
  white: { ring: [["white", 0]], fill: ["white", 0], fluff: [["paper", 2]], op: 0.8 },
  pink: { ring: [["pink", 1]], fill: ["pink", 1], fluff: [["pink", 0]], op: 0.55 },
  rainbow: { ring: RAIN.map((c) => [c, 0]), fill: ["yellow", 1], fluff: RAIN.map((c) => [c, 1]), op: 0.95 },
};
const puff = (S, x, y, r, [n, tn], g, w = "mid") => DS.shape(S, circ(x, y, r), n, { flat: true, tone: tn, parent: g, w });
// o: { look, from (x it trots in from), at (time it arrives), open }
const sheep = (S, x, gy, k, wool, o = {}) => {
  const s0 = S.start, W_ = WOOL[wool], x0 = o.from ?? x;
  const pos = G(S, null, `translate(${x0} ${gy}) scale(${k})`), bob = G(S, pos, "translate(0 0)");
  DS.shadow(S, 0, 0, 400, { parent: pos });
  [-80, -30, 30, 80].forEach((lx) => { DS.shape(S, rrect(lx - 18, -100, 36, 100, DS.r.sm), "brown", { parent: bob, w: "mid" }); dot(S, rrect(lx - 18, -26, 36, 26, DS.r.xs), DS.P.ink[0], bob); });
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; puff(S, 135 * Math.cos(a), -190 + 85 * Math.sin(a), 52, W_.ring[i % W_.ring.length], bob); }
  dot(S, circ(0, -190, 163, 113), DS.c(...W_.fill), bob);
  [[-80, -215, 42], [0, -150, 40], [80, -210, 40], [-40, -260, 36], [52, -250, 34], [-100, -160, 30], [104, -158, 30]].forEach(([px, py, r], i) => {
    const [n, tn] = W_.fluff[i % W_.fluff.length]; dot(S, circ(px, py, r), DS.c(n, tn), bob, W_.op); });
  const head = G(S, bob, "translate(0 0)");
  [-1, 1].forEach((s) => { const e = G(S, head, `rotate(${s * -18} ${s * 66} -262)`); DS.shape(S, circ(s * 98, -262, 44, 19), "sand", { parent: e, w: "mid" }); dot(S, circ(s * 102, -262, 26, 9), DS.c("pink", 1), e); });
  DS.shape(S, circ(0, -246, 74, 80), "sand", { parent: head });
  [[-44, -316, 26], [46, -314, 24], [-16, -334, 30], [20, -332, 30], [0, -312, 26]].forEach(([px, py, r], i) => puff(S, px, py, r, W_.ring[(i + 2) % W_.ring.length], head));
  eyes(S, head, 30, -252, 21, o.look || 0);
  cheeks(S, head, 52, -214, 13);
  dot(S, circ(0, -224, 10, 7), DS.c("pink", 2), head);
  const smile = S.draw("M-15 -205 Q0 -192 15 -205", s0, 0, { c: DS.line(), w: DS.w.mid, parent: head });
  const open = G(S, head); open.setAttribute("opacity", 0);
  S.draw(circ(0, -198, 13, 15), s0, 0, { c: DS.line(), w: DS.w.mid, fill: DS.c("red", 2), parent: open });
  dot(S, circ(0, -191, 7, 5), DS.c("pink", 1), open);
  if (o.open) { open.setAttribute("opacity", 1); smile.setAttribute("opacity", 0); }
  const A = { pos, bob, head, x, gy, k };
  A.baa = (t0, t1) => { tl.set(open, { opacity: 1 }, t0); tl.set(smile, { opacity: 0 }, t0); tl.set(open, { opacity: 0 }, t1); tl.set(smile, { opacity: 1 }, t1); };
  A.nod = (t0, dur = 0.5) => tw(head, t0, dur, "translate(0 0)", "translate(0 14)", hump(1));
  A.hop = (t0, h = 40, dur = 0.5) => tw(bob, t0, dur, "translate(0 0)", `translate(0 ${-h})`, hump(1));
  A.graze = (t0, t1) => tw(bob, t0, t1 - t0, "translate(0 0)", "translate(0 -8)", hump(cyc(t1 - t0, 2 * BEAT)));
  if (o.at !== undefined) { // trots in from x0, three little hops
    tw(pos, o.at, 1.2, `translate(${x0} ${gy}) scale(${k})`, `translate(${x} ${gy}) scale(${k})`, "power1.out");
    tw(bob, o.at, 1.2, "translate(0 0)", "translate(0 -26)", hump(3));
  }
  return A;
};

// ---------- props ----------
// a burlap wool bag with a puff of wool on top (the sheep's colour) and a colour tag
const bag = (S, x, gy, k, wool, parent) => {
  const W_ = WOOL[wool], g = G(S, parent, `translate(${x} ${gy}) scale(${k})`);
  DS.shadow(S, 0, 0, 170, { parent: g });
  DS.shape(S, "M-58 0 C-94 0 -88 -76 -46 -106 L46 -106 C88 -76 94 0 58 0 Z", "sand", { parent: g });
  S.draw("M-50 -30 Q0 -20 50 -30", S.start, 0, { c: DS.c("sand", 2), w: DS.w.detail, parent: g });
  if (wool === "rainbow") RAIN.forEach((c, i) => dot(S, circ(-30 + i * 12, -56, 9), DS.c(c), g));
  else DS.shape(S, circ(0, -58, 22), W_.ring[0][0], { flat: true, tone: W_.ring[0][1], parent: g, w: "detail" });
  [[-28, -124, 26], [30, -122, 24], [2, -140, 30]].forEach(([px, py, r], i) => puff(S, px, py, r, W_.ring[(i * 2) % W_.ring.length], g));
  DS.shape(S, rrect(-46, -114, 92, 18, DS.r.xs), "wood", { parent: g, w: "mid" });
  return g;
};
// knitting needle from (x0, y0) to its point (x1, y1), knob at x0
const needle = (S, x0, y0, x1, y1, parent) => { const g = S.grp(parent); DS.shape(S, cap(x0, y0, x1, y1, 7), "gold", { parent: g, w: "mid" }); DS.shape(S, circ(x0, y0, 14), "red", { parent: g, w: "mid" }); return g; };

// ---------- the meadow ----------
const cloud = (S, x, y, k) => [[0, 0, 70], [-70, 18, 50], [70, 15, 55], [30, -35, 50]].forEach(([dx, dy, r]) => S.fill(circ(x + dx * k, y + dy * k, r * k), S.start, 0, DS.P.white[0], 0.92));
const barn = (S, x, gy, k, layer = "far") => {
  const g = G(S, null, `translate(${x} ${gy}) scale(${k})`), o = { parent: g, layer };
  DS.shape(S, "M-190 -250 L-130 -360 L0 -420 L130 -360 L190 -250 Z", "brown", o);
  DS.shape(S, rect(-165, -260, 330, 260), "red", o);
  DS.shape(S, rect(-70, -150, 140, 150), "red", Object.assign({ tone: 2, flat: true }, o));
  S.draw("M-70 -150 L70 0 M70 -150 L-70 0", S.start, 0, { c: DS.c("white", 0, layer), w: DS.w.mid, parent: g });
  DS.shape(S, rect(-35, -320, 70, 60), "white", Object.assign({ w: "far" }, o));
};
const tree = (S, x, gy, k, layer = "mid") => {
  DS.shadow(S, x, gy, 200 * k);
  DS.shape(S, rrect(x - 26 * k, gy - 220 * k, 52 * k, 220 * k, DS.r.sm), "wood", { layer });
  [[0, -330, 120], [-90, -260, 85], [90, -260, 90], [0, -220, 95]].forEach(([dx, dy, r]) => DS.shape(S, circ(x + dx * k, gy + dy * k, r * k), "grass", { layer, tone: 2 }));
};
const fence = (S, x0, x1, gy, layer = "mid") => {
  DS.shape(S, rect(x0, gy - 110, x1 - x0, 20), "wood", { layer, w: "far" });
  DS.shape(S, rect(x0, gy - 60, x1 - x0, 20), "wood", { layer, w: "far" });
  for (let x = x0 + 30; x < x1; x += 150) DS.shape(S, rrect(x - 14, gy - 140, 28, 140, DS.r.xs), "wood", { layer, w: "far" });
};
const flowers = (S, pts) => pts.forEach(([x, y, c]) => { S.draw(`M${x} ${y} L${x} ${y + 40}`, S.start, 0, { c: DS.c("green", 2), w: DS.w.mid }); [0, 1, 2, 3, 4].forEach((i) => S.fill(circ(x + 16 * Math.cos(i * 1.257), y + 16 * Math.sin(i * 1.257), 12), S.start, 0, DS.c(c), 1)); S.fill(circ(x, y, 9), S.start, 0, DS.c("yellow"), 1); });
