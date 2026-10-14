// look: still
// Little Octopus Wiggle — original Tiny Tune Town song. Hero: Ollie, a little pink octopus (same build in every scene).
// Counting builds 1-2, 3-4, 5-6, 7-8 (big numbers on DS.card); each chorus adds a sea friend; ends in a big eight-arm hug.
const BEAT = 60 / 110;
const cut = (c, i = 0) => W(c, i) - 0.35;
const wave = (n) => (p) => Math.sin(p * Math.PI * 2 * n);          // rest → +1 → -1 → rest, n times
const hump = (n) => (p) => (1 - Math.cos(p * Math.PI * 2 * n)) / 2; // rest → 1 → rest, n times
const cyc = (dur, per) => Math.max(1, Math.round(dur / per));
const tw = (e, t, dur, a, b, ease = "power2.inOut") => tl.fromTo(e, { attr: { transform: a } }, { attr: { transform: b }, duration: dur, ease, immediateRender: false }, t);
const G = (S, parent, tf) => { const g = S.grp(parent); if (tf) g.setAttribute("transform", tf); return g; };
const fadeIn = (S, e, t) => { if (t > S.start + 0.05) tl.fromTo(e, { opacity: 0 }, { opacity: +(e.getAttribute("opacity") ?? 1), duration: 0.35, ease: "power1.out" }, t); }; // keeps a shadow's own opacity

// ---------- shapes ----------
const cr = (P, n = 6) => { const o = []; for (let i = 0; i < P.length - 1; i++) { const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2; for (let j = 0; j < n; j++) { const t = j / n; o.push([0, 1].map((a) => 0.5 * (2 * p1[a] + (p2[a] - p0[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t * t + (3 * p1[a] - p0[a] - 3 * p2[a] + p3[a]) * t * t * t))); } } o.push(P[P.length - 1]); return o; };
// tapered tube along a curve (tentacles, seaweed): width w0 at the root → w1 at the round tip
const tube = (P, w0, w1) => {
  const C = cr(P), n = C.length, L = [], R = [];
  C.forEach((p, i) => { const a = C[Math.max(0, i - 1)], b = C[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, w = w0 + ((w1 - w0) * i) / (n - 1); L.push([p[0] - (dy / m) * w, p[1] + (dx / m) * w]); R.push([p[0] + (dy / m) * w, p[1] - (dx / m) * w]); });
  const a = C[n - 2], b = C[n - 1], m = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return { d: smooth([...L, [b[0] + ((b[0] - a[0]) / m) * w1, b[1] + ((b[1] - a[1]) / m) * w1], ...R.reverse()]) + " Z", C };
};

// ---------- Ollie (local origin = ground centre; k scales the whole octopus) ----------
const ARMS = [ // left side outer → inner: [root x, curve from the root]; the right side mirrors
  [-112, [[0, 0], [-70, 70], [-160, 135], [-245, 145], [-275, 105]]],
  [-82, [[0, 0], [-45, 90], [-110, 165], [-180, 190], [-208, 165]]],
  [-50, [[0, 0], [-20, 100], [-55, 180], [-100, 200], [-128, 182]]],
  [-18, [[0, 0], [-5, 105], [-15, 185], [-42, 202], [-66, 188]]],
];
const COUNT = [[0, -1], [0, 1], [1, -1], [1, 1], [2, -1], [2, 1], [3, -1], [3, 1]]; // arm 1..8: outer pair first
const ollie = (S, cx, gy, k = 1, o = {}) => {
  const t = o.t ?? S.start, s0 = S.start, look = o.look || 0;
  const sh = DS.shadow(S, cx, gy, 600 * k);
  const pos = G(S, null, `translate(${cx} ${gy}) scale(${k})`), lift = G(S, pos, "translate(0 0)"), bob = G(S, lift, "translate(0 0)"), size = G(S, bob, "scale(1)"), body = G(S, size, "rotate(0 0 -250)");
  const arms = {};
  [0, 1, 2, 3].forEach((ai) => [-1, 1].forEach((side) => {
    const [rx, P] = ARMS[ai], x = rx * side, y = -200;
    const pose = G(S, body, `rotate(0 ${x} ${y})`), wig = G(S, pose, `rotate(0 ${x} ${y})`);
    const { d, C } = tube(P.map(([px, py]) => [x + px * side, y + py]), 34, 11);
    DS.shape(S, d, "pink", { t: s0, parent: wig });
    C.forEach((p, i) => { if (i > 5 && i < C.length - 3 && i % 3 === 0) S.fill(circ(p[0], p[1], 6 + 5 * (1 - i / C.length)), s0, 0, DS.c("pink", 1), 0.95, wig); });
    arms[ai + "," + side] = { pose, wig, x, y, side, ai, tip: C[C.length - 1], cur: 0 };
  }));
  DS.shape(S, circ(0, -335, 150, 165), "pink", { t: s0, parent: body });
  S.fill(circ(-66, -428, 36, 20), s0, 0, DS.P.white[0], 0.5, body);
  [[78, -440, 15], [108, -392, 10], [-112, -372, 9]].forEach(([x, y, r]) => S.fill(circ(x, y, r), s0, 0, DS.c("pink", 2), 0.45, body));
  [-1, 1].forEach((s) => {
    DS.shape(S, circ(58 * s, -330, 40, 48), "white", { t: s0, parent: body, flat: true, w: "mid" });
    S.fill(circ(58 * s + look, -318, 25), s0, 0, DS.P.ink[0], 1, body);
    S.fill(circ(58 * s + look - 9, -329, 9), s0, 0, DS.P.white[0], 1, body);
    S.fill(circ(58 * s + look + 8, -309, 4), s0, 0, DS.P.white[0], 1, body);
    S.fill(circ(104 * s, -258, 26, 15), s0, 0, DS.c("red", 1), 0.55, body);
  });
  const smile = S.draw("M-34 -262 Q0 -226 34 -262", s0, 0, { c: DS.line(), w: DS.w.near, parent: body });
  const open = G(S, body); open.setAttribute("opacity", 0);
  S.draw("M-36 -266 Q0 -196 36 -266 Z", s0, 0, { c: DS.line(), w: DS.w.near, fill: DS.c("red", 2), parent: open });
  S.fill(circ(0, -228, 15, 8), s0, 0, DS.c("pink", 1), 1, open);
  if (o.mouth === "open") { open.setAttribute("opacity", 1); smile.setAttribute("opacity", 0); }
  if (t > s0 + 0.05) { fadeIn(S, pos, t); fadeIn(S, sh, t); }
  const all = COUNT.map(([ai, s]) => arms[ai + "," + s]);
  const O = { pos, lift, bob, size, body, arms: all, k, cx, gy, liftY: 0, sz: 1,
    row: [0, 1, 2, 3].map((ai) => arms[ai + ",1"]).concat([3, 2, 1, 0].map((ai) => arms[ai + ",-1"])), // left → right (side 1 = left)
    at: ([x, y]) => [cx + x * k, gy + y * k] };
  // wiggle arms (1-based counting order) between t0 and t1, neighbours in counter-phase
  O.wiggle = (list, t0, t1, amp = 13, per = BEAT) => list.forEach((n, i) => { const A = all[n - 1]; tw(A.wig, t0, t1 - t0, `rotate(0 ${A.x} ${A.y})`, `rotate(${(i % 2 ? amp : -amp) * A.side} ${A.x} ${A.y})`, wave(cyc(t1 - t0, per))); });
  O.raise = (A, a, t0, dur = 0.6) => { tw(A.pose, t0, dur, `rotate(${A.cur} ${A.x} ${A.y})`, `rotate(${a * A.side} ${A.x} ${A.y})`); A.cur = a * A.side; };
  O.bob = (t0, t1, amp = 10) => tw(bob, t0, t1 - t0, "translate(0 0)", `translate(0 ${-amp})`, hump(cyc(t1 - t0, 2 * BEAT)));
  O.lift = (dy, t0, dur = 0.8) => { tw(lift, t0, dur, `translate(0 ${O.liftY})`, `translate(0 ${dy})`); O.liftY = dy; };
  O.hop = (t0, h = 60, dur = 0.5) => tw(lift, t0, dur, `translate(0 ${O.liftY})`, `translate(0 ${O.liftY - h})`, hump(1));
  O.spin = (t0, dur = 1.3, turns = 1) => tw(body, t0, dur, "rotate(0 0 -250)", `rotate(${360 * turns} 0 -250)`, "power1.inOut");
  O.scale = (z, t0, dur = 0.5) => { tw(size, t0, dur, `scale(${O.sz})`, `scale(${z})`, "back.out(1.4)"); O.sz = z; };
  O.sing = (t0, t1) => { tl.set(open, { opacity: 1 }, t0); tl.set(smile, { opacity: 0 }, t0); tl.set(open, { opacity: 0 }, t1); tl.set(smile, { opacity: 1 }, t1); };
  return O;
};

// ---------- sea friends ----------
const fish = (S, x, y, k = 1, name = "yellow", dir = 1, o = {}) => {
  const s0 = S.start, pos = G(S, null, `translate(${x} ${y}) scale(${k * dir} ${k})`), bob = G(S, pos, "translate(0 0)");
  DS.shape(S, "M-55 0 C-80 -20 -100 -45 -122 -48 C-108 -16 -108 16 -122 48 C-100 45 -80 20 -55 0 Z", name, { t: s0, parent: bob, w: "mid" });
  DS.shape(S, "M-24 -42 C-10 -86 40 -80 46 -38 Z", name, { t: s0, parent: bob, w: "mid" });
  DS.shape(S, circ(0, 0, 74, 52), name, { t: s0, parent: bob, w: "mid" });
  S.draw(smooth([[-22, -48], [-30, 0], [-22, 48]]), s0, 0, { c: DS.c(name, 2), w: DS.w.mid, parent: bob });
  DS.shape(S, circ(36, -12, 17), "white", { t: s0, parent: bob, flat: true, w: "detail" });
  S.fill(circ(40, -10, 9), s0, 0, DS.P.ink[0], 1, bob); S.fill(circ(37, -14, 3.5), s0, 0, DS.P.white[0], 1, bob);
  S.draw("M34 20 Q46 30 58 16", s0, 0, { c: DS.line(), w: DS.w.mid, parent: bob });
  fadeIn(S, pos, o.t ?? s0);
  const F = { pos, bob, x, y };
  F.swim = (t0, t1, amp = 14) => tw(bob, t0, t1 - t0, "translate(0 0)", `translate(0 ${-amp})`, hump(cyc(t1 - t0, 2 * BEAT)));
  F.move = (x1, y1, t0, dur = 1.6) => { tw(pos, t0, dur, `translate(${F.x} ${F.y}) scale(${k * dir} ${k})`, `translate(${x1} ${y1}) scale(${k * dir} ${k})`, "sine.inOut"); F.x = x1; F.y = y1; };
  return F;
};
const crab = (S, x, gy, k = 1, o = {}) => {
  const s0 = S.start, sh = DS.shadow(S, x, gy, 300 * k), pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, pos, "translate(0 0)"), claws = [];
  [-1, 1].forEach((s) => {
    [0, 1, 2].forEach((i) => S.draw(smooth([[s * 50, -52 + i * 12], [s * (92 + i * 10), -44 + i * 14], [s * (108 + i * 12), -2]]), s0, 0, { c: DS.c("orange", 2), w: DS.w.near, parent: bob }));
    S.draw(`M${s * 24} -112 L${s * 32} -152`, s0, 0, { c: DS.c("orange", 2), w: DS.w.near, parent: bob });
    S.draw(smooth([[s * 66, -96], [s * 96, -124], [s * 106, -150]]), s0, 0, { c: DS.c("orange", 2), w: DS.w.near, parent: bob });
    const cg = G(S, bob, `rotate(0 ${s * 106} -150)`);
    DS.shape(S, circ(s * 112, -176, 34, 30), "orange", { t: s0, parent: cg });
    S.draw(`M${s * 112} -176 L${s * 146} -190`, s0, 0, { c: DS.line(), w: DS.w.mid, parent: cg });
    claws.push([cg, s]);
  });
  DS.shape(S, circ(0, -76, 90, 58), "orange", { t: s0, parent: bob });
  [-1, 1].forEach((s) => { DS.shape(S, circ(s * 32, -160, 18), "white", { t: s0, parent: bob, flat: true, w: "detail" }); S.fill(circ(s * 32 + 3, -157, 9), s0, 0, DS.P.ink[0], 1, bob); });
  S.draw("M-24 -72 Q0 -50 24 -72", s0, 0, { c: DS.line(), w: DS.w.mid, parent: bob });
  S.fill(circ(-48, -64, 14, 8), s0, 0, DS.c("red", 1), 0.6, bob); S.fill(circ(48, -64, 14, 8), s0, 0, DS.c("red", 1), 0.6, bob);
  if ((o.t ?? s0) > s0 + 0.05) { fadeIn(S, pos, o.t); fadeIn(S, sh, o.t); }
  return { pos, bob, clap: (t0) => claws.forEach(([cg, s]) => tw(cg, t0, 0.32, `rotate(0 ${s * 106} -150)`, `rotate(${-28 * s} ${s * 106} -150)`, hump(1))),
    dance: (t0, t1) => tw(bob, t0, t1 - t0, "translate(0 0)", "translate(0 -12)", hump(cyc(t1 - t0, BEAT))) };
};
const star = (S, x, gy, k = 1, o = {}) => {
  const s0 = S.start, sh = DS.shadow(S, x, gy, 200 * k), pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, pos, "rotate(0 0 -80)");
  const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 44 : 92; return [Math.cos(a) * r, -84 + Math.sin(a) * r]; });
  DS.shape(S, smooth([...pts, pts[0], pts[1]]) + " Z", "yellow", { t: s0, parent: bob });
  [-1, 1].forEach((s) => { DS.shape(S, circ(s * 18, -92, 12, 14), "white", { t: s0, parent: bob, flat: true, w: "detail" }); S.fill(circ(s * 18 + 2, -89, 7), s0, 0, DS.P.ink[0], 1, bob); });
  S.draw("M-14 -66 Q0 -54 14 -66", s0, 0, { c: DS.line(), w: DS.w.mid, parent: bob });
  [[0, -150], [64, -104], [40, -30], [-40, -30], [-64, -104]].forEach(([dx, dy]) => S.fill(circ(dx, dy, 6), s0, 0, DS.c("orange", 1), 0.9, bob));
  if ((o.t ?? s0) > s0 + 0.05) { fadeIn(S, pos, o.t); fadeIn(S, sh, o.t); }
  return { pos, bob, dance: (t0, t1) => tw(bob, t0, t1 - t0, "rotate(0 0 -80)", "rotate(10 0 -80)", wave(cyc(t1 - t0, 2 * BEAT))) };
};
const turtle = (S, x, gy, k = 1, o = {}) => {
  const s0 = S.start, sh = DS.shadow(S, x, gy, 320 * k), pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, pos, "translate(0 0)");
  DS.shape(S, circ(-86, -16, 38, 17), "grass", { t: s0, parent: bob }); DS.shape(S, circ(80, -16, 38, 17), "grass", { t: s0, parent: bob });
  DS.shape(S, circ(128, -84, 44, 40), "grass", { t: s0, parent: bob });
  DS.shape(S, circ(142, -94, 12), "white", { t: s0, parent: bob, flat: true, w: "detail" }); S.fill(circ(145, -92, 7), s0, 0, DS.P.ink[0], 1, bob);
  S.draw("M124 -66 Q138 -56 154 -68", s0, 0, { c: DS.line(), w: DS.w.mid, parent: bob });
  DS.shape(S, "M-128 -34 C-128 -166 128 -166 128 -34 Z", "green", { t: s0, parent: bob });
  S.draw(poly(Array.from({ length: 7 }, (_, i) => [Math.cos((i * Math.PI) / 3) * 34, -92 + Math.sin((i * Math.PI) / 3) * 30])), s0, 0, { c: DS.c("green", 2), w: DS.w.mid, parent: bob });
  DS.shape(S, rrect(-136, -42, 272, 24, DS.r.sm), "sand", { t: s0, parent: bob, w: "mid" });
  if ((o.t ?? s0) > s0 + 0.05) { fadeIn(S, pos, o.t); fadeIn(S, sh, o.t); }
  return { pos, bob, dance: (t0, t1) => tw(bob, t0, t1 - t0, "translate(0 0)", "translate(0 -10)", hump(cyc(t1 - t0, 2 * BEAT))) };
};

// ---------- underwater set ----------
const weed = (S, x, gy, h, layer = "mid", name = "green") => {
  const g = G(S, null, `rotate(0 ${x} ${gy})`), w0 = { far: 12, mid: 18, near: 30 }[layer];
  DS.shape(S, tube([[x, gy], [x + 24, gy - h * 0.25], [x - 20, gy - h * 0.5], [x + 22, gy - h * 0.75], [x, gy - h]], w0, w0 * 0.4).d, name, { layer, parent: g, dir: "h" });
  tw(g, S.start, S.len, `rotate(0 ${x} ${gy})`, `rotate(5 ${x} ${gy})`, wave(cyc(S.len, 3.3)));
  return g;
};
const coral = (S, x, gy, k, name = "pink", layer = "mid") => {
  DS.shadow(S, x, gy, 170 * k);
  [[0, -55, 50], [-58, -40, 38], [56, -44, 40], [-26, -112, 38], [32, -108, 34], [2, -160, 30]].forEach(([dx, dy, r]) => DS.shape(S, circ(x + dx * k, gy + dy * k, r * k), name, { layer }));
  [[-20, -120], [40, -60], [-60, -46], [8, -164]].forEach(([dx, dy]) => S.fill(circ(x + dx * k, gy + dy * k, 6 * k), S.start, 0, DS.c(name, 2, layer), 0.7));
};
const rock = (S, x, gy, rx, ry, layer = "mid") => { DS.shadow(S, x, gy, rx * 2.1); return DS.shape(S, smooth([[x - rx, gy], [x - rx * 0.92, gy - ry * 0.6], [x - rx * 0.5, gy - ry], [x + rx * 0.3, gy - ry * 0.96], [x + rx * 0.9, gy - ry * 0.55], [x + rx, gy]]) + " Z", "gray", { layer }); };
const shell = (S, x, gy, k = 1, name = "pink") => { DS.shape(S, `M${x - 30 * k} ${gy} Q${x - 36 * k} ${gy - 44 * k} ${x} ${gy - 48 * k} Q${x + 36 * k} ${gy - 44 * k} ${x + 30 * k} ${gy} Z`, name, { w: "mid" }); [-14, 0, 14].forEach((dx) => S.draw(`M${x} ${gy - 4 * k} L${x + dx * 1.8 * k} ${gy - 42 * k}`, S.start, 0, { c: DS.c(name, 2), w: DS.w.hair })); };
const bubble = (S, x, y, r, rise, o = {}) => {
  const g = G(S, null, "translate(0 0)"), t = o.t ?? S.start;
  S.draw(circ(x, y, r), S.start, 0, { c: DS.P.white[0], w: r > 24 ? DS.w.mid : DS.w.detail, fill: DS.c("glass", 1), parent: g, op: 0.8 });
  S.fill(circ(x - r * 0.35, y - r * 0.35, r * 0.25), S.start, 0, DS.P.white[0], 0.95, g);
  fadeIn(S, g, t);
  tw(g, S.start, S.len, "translate(0 0)", `translate(${rise * 0.08} ${-rise})`, "none");
  return g;
};
const bubbles = (S, n = 10, seedX = 0) => { for (let i = 0; i < n; i++) bubble(S, 140 + ((i * 397 + seedX) % 1640), 260 + ((i * 211 + seedX) % 560), 9 + ((i * 7) % 16), 45 * S.len); };
const sea = (S, o = {}) => {
  const O = DS.outdoor(S, { hy: o.hy || 690, sky: "sky", sun: [o.sx || 960, -90], hills: o.hills || "blue", ground: "sand" });
  const water = el("path", { d: "M-200 -200 H2120 V1280 H-200 Z", fill: DS.vgrad(DS.P.sky[1], DS.c("blue", 0, "far")) }, O.g);
  O.g.insertBefore(water, O.g.children[1]);
  [[560, 110], [860, 150], [1180, 110], [1480, 140]].forEach(([x, w]) => O.g.insertBefore(el("path", { d: `M${x - w / 2} -60 H${x + w / 2} L${x + w * 1.3 + 220} ${O.hy + 30} H${x - w * 0.3 + 220} Z`, fill: DS.P.white[0], opacity: 0.15 }, O.g), O.g.children[4]));
  (o.weeds || [[150, 0.9], [290, 0.65], [1640, 0.75], [1790, 1]]).forEach(([x, h]) => weed(S, x, O.hy + 150, 330 * h, "mid"));
  if (o.coral !== false) { coral(S, 420, O.hy + 160, 0.75, "pink"); coral(S, 1520, O.hy + 165, 0.7, "orange"); }
  return O;
};
const finish = (S, o = {}) => { if (o.weed !== false) weed(S, o.wx || 40, 1140, 640, "near"); DS.vignette(S, 0.1); };
const num = (S, n, x, y, t) => DS.card(S, String(n), x, y, { size: DS.type.display, t, fill: "yellow" });
const sparkle = (S, x, y, t, r = 1) => { const p = S.draw(rays(x, y, 34 * r, 70 * r, 8), t, 0, { c: DS.c("yellow", 2), w: DS.w.mid }); S.fadeOut(p, t + 0.4, 0.3); };
const drop = (S, x, y, t, k = 1) => { const p = DS.shape(S, `M${x} ${y - 26 * k} C${x + 18 * k} ${y - 4 * k} ${x + 16 * k} ${y + 15 * k} ${x} ${y + 15 * k} C${x - 16 * k} ${y + 15 * k} ${x - 18 * k} ${y - 4 * k} ${x} ${y - 26 * k} Z`, "glass", { t, w: "detail" }); S.fadeOut(p, t + 0.7, 0.4); };
const hearts = (S, t, list) => list.forEach(([x, y, s], i) => { const g = G(S, null, "translate(0 0)"); S.draw(heartPath(x, y, s), t + i * 0.2, 0, { fill: DS.c("red", 1), c: DS.c("red", 2), w: DS.w.detail, parent: g }); tw(g, t + i * 0.2, Math.max(1, S.end - t - i * 0.2), "translate(0 0)", "translate(0 -150)", "power1.out"); });
const glow = (S, t) => S.fill(circ(960, -40, 620, 420), t, 0.35, DS.glow(DS.P.yellow[1], 0.75), 1);

// ---------- scene windows: one picture per lyric idea, cut 0.35 s before the first sung word ----------
const STARTS = [0, cut(1), cut(3), cut(5), cut(9), cut(11), cut(13), cut(20), cut(22), cut(24), cut(27), cut(29), cut(31), cut(35), cut(37), cut(38)];
const sc = (k, o) => scene(STARTS[k], k + 1 < STARTS.length ? STARTS[k + 1] : TOTAL, o);
const lineEnd = (c) => CLIP(c)[1];

// chorus: "Who can wiggle? Ollie-O!" (hop) / "Wiggle up high and wiggle down low" (float up, sink) / "Wiggle, wiggle, Ollie-O!" (sparkle)
// the arms counted so far wiggle the whole time; each chorus adds one sea friend
const chorus = (k, who, hi, ww, nArms, friends) => {
  const S = sc(k, { cam: "push", focus: "960 600" }); sea(S, { hills: ["blue", "purple", "blue", "purple"][friends - 1] }); bubbles(S, 9, k * 53);
  const F = [];
  if (friends >= 4) F.push(turtle(S, 1660, 905, 0.85));
  if (friends >= 3) F.push(star(S, 330, 925, 0.95));
  if (friends >= 2) F.push(crab(S, 1420, 935, 0.8));
  const O = ollie(S, 900, 905, 1.0);
  const f = fish(S, 1460, 420, 0.9, "yellow", -1); f.swim(S.start, S.end);
  F.forEach((x) => x.dance(S.start, S.end));
  O.bob(S.start, S.end);
  O.wiggle(Array.from({ length: nArms }, (_, i) => i + 1), S.start + 0.2, S.end - 0.3, 14);
  DS.card(S, "WHO CAN WIGGLE?", 900, 140, { size: DS.type.title, t: W(who[0], 0) });
  who.forEach((c) => { O.sing(W(c, 3), W(c, 3) + 0.8); O.hop(W(c, 3)); });
  hi.forEach((c) => { O.lift(-170, W(c, 1), 0.7); O.lift(30, W(c, 5), 0.8); O.lift(0, Math.max(W(c, 5) + 0.85, CLIP(c)[1] - 0.1), 0.4); });
  ww.forEach((c) => { O.sing(W(c, 2), W(c, 2) + 0.9); sparkle(S, 900, 330, W(c, 2), 1.4); });
  finish(S, { wx: k % 2 ? 1880 : 40 });
};

// 0  intro: Ollie peeks over a rock; the title
{ const S = sc(0, { cam: "pull", focus: "960 640" }); sea(S); bubbles(S, 8, 11);
  const f = fish(S, 300, 470, 0.8, "yellow", 1); f.move(640, 440, S.start + 0.5, Math.max(1, S.len - 1)); f.swim(S.start, S.end);
  const O = ollie(S, 1000, 985, 0.9);
  O.lift(-28, S.start + 0.8, 1.2); O.lift(0, S.start + Math.max(2.2, S.len - 1.5), 1);
  rock(S, 1000, 975, 440, 250, "near");
  [[860, 820, 14], [900, 760, 10], [1150, 800, 12]].forEach(([x, y, r]) => bubble(S, x, y, r, 60 * S.len));
  DS.card(S, "LITTLE OCTOPUS WIGGLE", 960, 170, { size: DS.type.title });
  finish(S); }

// 1  "Down in the sea where the bubbles go, / Lives a little octopus, Ollie-O!"
{ const S = sc(1, { cam: "push", focus: "860 600" }); sea(S); bubbles(S, 7, 29);
  rock(S, 1470, 915, 230, 150);
  [0, 1, 2, 3, 4, 5].forEach((i) => bubble(S, 1420 + (i % 3) * 40, 740 - i * 70, 12 + (i % 3) * 6, 50 * S.len, { t: W(1, 6) + i * 0.12 }));
  const O = ollie(S, 820, 915, 1.1, { t: W(2, 0) });
  O.bob(W(2, 0), S.end);
  const A = O.arms[0]; O.raise(A, 70, W(2, 4) - 0.2, 0.5); O.wiggle([1], W(2, 4) + 0.3, S.end - 0.2, 16);
  O.sing(W(2, 4), W(2, 4) + 1.0);
  DS.card(S, "OLLIE", 820, 230, { size: DS.type.title, t: W(2, 4) });
  shell(S, 1180, 960, 1.1); finish(S); }

// 2  "One arm wiggles, two arms sway, / Wiggle with Ollie, hip hip hooray!"
{ const S = sc(2, { cam: "push", focus: "960 620" }); sea(S); bubbles(S, 8, 71);
  const O = ollie(S, 960, 910, 1.15);
  num(S, 1, 390, 420, W(3, 0)); O.wiggle([1], W(3, 0), W(3, 3) - 0.05, 16);
  num(S, 2, 1530, 420, W(3, 3)); O.wiggle([2], W(3, 3), W(4, 0) - 0.05, 10, 2 * BEAT);
  O.wiggle([1, 2], W(4, 0), S.end - 0.3, 16);
  O.hop(W(4, 3), 50, 0.45); O.hop(W(4, 4), 50, 0.45); O.hop(W(4, 5), 110, 0.7); O.sing(W(4, 5), S.end);
  [[700, 520], [1220, 520], [960, 300], [560, 760], [1360, 760]].forEach(([x, y], i) => sparkle(S, x, y, W(4, 5) + i * 0.1, 0.8));
  finish(S, { wx: 1880 }); }

// 3  chorus 1: two arms, the yellow fish
chorus(3, [5, 6], [7], [8], 2, 1);

// 4  "Three arms, four arms, clap, clap, clap, / Splishy, splashy, flippy, flap!"
{ const S = sc(4, { cam: "push", focus: "960 560" }); sea(S, { hills: "purple" }); bubbles(S, 8, 97);
  const O = ollie(S, 960, 910, 1.1);
  O.wiggle([1, 2], S.start, W(9, 4) - 0.6, 10, 2 * BEAT);
  num(S, 3, 390, 420, W(9, 0)); num(S, 4, 1530, 420, W(9, 2));
  const [A3, A4] = [O.arms[2], O.arms[3]];
  O.raise(A3, 128, W(9, 0), 0.6); O.raise(A4, 128, W(9, 2), 0.6);
  [W(9, 4), W(9, 5), W(9, 6)].forEach((t) => { tw(A3.wig, t - 0.12, 0.3, `rotate(0 ${A3.x} ${A3.y})`, `rotate(${14 * A3.side} ${A3.x} ${A3.y})`, hump(1)); tw(A4.wig, t - 0.12, 0.3, `rotate(0 ${A4.x} ${A4.y})`, `rotate(${14 * A4.side} ${A4.x} ${A4.y})`, hump(1)); sparkle(S, 960, 370, t, 0.9); });
  [[620, 760], [1300, 760], [760, 560], [1160, 560]].forEach(([x, y], i) => drop(S, x, y, W(10, i), 1.6));
  O.bob(W(10, 0), S.end, 14);
  finish(S); }

// 5  "Clap with Ollie, one more time, / Clap, clap, clap, you're doing fine!" — a crab claps along
{ const S = sc(5, { cam: "push", focus: "960 600" }); sea(S, { hills: "purple", coral: false }); bubbles(S, 7, 131);
  coral(S, 360, 870, 0.8, "pink");
  const C = crab(S, 1450, 930, 1.05, { t: W(11, 0) - 0.2 });
  const O = ollie(S, 820, 910, 1.05);
  const [A3, A4] = [O.arms[2], O.arms[3]]; O.raise(A3, 128, S.start + 0.1, 0.5); O.raise(A4, 128, S.start + 0.1, 0.5);
  [W(11, 0), W(12, 0), W(12, 1), W(12, 2)].forEach((t) => { tw(A3.wig, t - 0.12, 0.3, `rotate(0 ${A3.x} ${A3.y})`, `rotate(${14 * A3.side} ${A3.x} ${A3.y})`, hump(1)); tw(A4.wig, t - 0.12, 0.3, `rotate(0 ${A4.x} ${A4.y})`, `rotate(${14 * A4.side} ${A4.x} ${A4.y})`, hump(1)); C.clap(t - 0.12); sparkle(S, 820, 400, t, 0.8); });
  DS.card(S, "CLAP!", 1450, 560, { size: DS.type.title, t: W(11, 0) });
  C.dance(W(12, 3), S.end); O.bob(W(12, 3), S.end);
  O.sing(W(12, 5), S.end);
  DS.card(S, "GOOD JOB!", 820, 160, { size: DS.type.title, t: W(12, 4), fill: "yellow" });
  finish(S); }

// 6  chorus 2: four arms, + crab
chorus(6, [15, 16], [13, 17], [14, 18, 19], 4, 2);

// 7  "Five arms, six arms, spin around, / Bubbles going up and down!"
{ const S = sc(7, { cam: "push", focus: "960 600" }); sea(S); bubbles(S, 6, 173);
  const O = ollie(S, 960, 910, 1.1);
  num(S, 5, 390, 420, W(20, 0)); num(S, 6, 1530, 420, W(20, 2));
  O.wiggle([5], W(20, 0), W(20, 2), 12); O.wiggle([6], W(20, 2), W(20, 4) - 0.1, 12);
  O.spin(W(20, 4), 1.4);
  const bs = [[560, 640, 30], [700, 480, 22], [1240, 520, 26], [1380, 660, 34], [960, 260, 24]].map(([x, y, r]) => { const g = G(S, null, "translate(0 0)"); S.draw(circ(x, y, r), S.start, 0, { c: DS.P.white[0], w: DS.w.mid, fill: DS.c("glass", 1), parent: g, op: 0.85 }); S.fill(circ(x - r * 0.35, y - r * 0.35, r * 0.25), S.start, 0, DS.P.white[0], 1, g); return g; });
  bs.forEach((g) => { tw(g, W(21, 2) - 0.2, 0.9, "translate(0 0)", "translate(0 -110)"); tw(g, W(21, 4) - 0.2, 0.9, "translate(0 -110)", "translate(0 60)"); });
  O.bob(W(21, 0), S.end);
  finish(S, { wx: 1880 }); }

// 8  "Spin with Ollie, round and round, / Pop, pop, pop, what a funny sound!"
{ const S = sc(8, { cam: "push", focus: "960 600" }); sea(S, { hills: "purple" }); bubbles(S, 6, 211);
  const O = ollie(S, 960, 910, 1.1);
  O.spin(W(22, 0), 1.3); O.spin(W(22, 3) - 0.1, 1.3);
  const big = [[560, 520, 52], [960, 230, 48], [1360, 520, 52]].map(([x, y, r]) => { const g = G(S, null); S.draw(circ(x, y, r), S.start, 0, { c: DS.P.white[0], w: DS.w.mid, fill: DS.c("glass", 1), parent: g, op: 0.85 }); S.fill(circ(x - r * 0.35, y - r * 0.35, r * 0.25), S.start, 0, DS.P.white[0], 1, g); return [g, x, y]; });
  big.forEach(([g, x, y], i) => { const t = W(23, i); S.fadeOut(g, t, 0.15); sparkle(S, x, y, t, 1); });
  DS.card(S, "POP!", 960, 140, { size: DS.type.title, t: W(23, 0), fill: "yellow" });
  O.sing(W(23, 3), S.end); O.bob(W(23, 3), S.end, 14);
  finish(S); }

// 9  chorus 3: six arms, + starfish
chorus(9, [24], [25], [26], 6, 3);

// 10  "Seven arms, eight arms, wiggle them all, / Wiggle them big and wiggle them small!"
{ const S = sc(10, { cam: "push", focus: "960 600" }); sea(S); bubbles(S, 8, 257);
  const O = ollie(S, 960, 910, 1.05);
  num(S, 7, 390, 420, W(27, 0)); num(S, 8, 1530, 420, W(27, 2));
  O.wiggle([7], W(27, 0), W(27, 2), 12); O.wiggle([8], W(27, 2), W(27, 4) - 0.1, 12);
  O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], W(27, 4), S.end - 0.3, 14);
  O.scale(1.22, W(28, 2) - 0.1, 0.5); O.scale(0.78, W(28, 6) - 0.1, 0.5); O.scale(1, S.end - 0.8, 0.5);
  O.sing(W(28, 2), W(28, 2) + 0.7);
  finish(S, { wx: 1880 }); }

// 11  "All eight arms go up so high, / Wiggle, wiggle, touch the sky!"
{ const S = sc(11, { cam: "zoom", focus: "960 500" }); sea(S, { hills: "purple" }); bubbles(S, 8, 293);
  const O = ollie(S, 960, 910, 1.05);
  [91, 83, 75, 66].forEach((a, ai) => O.arms.filter((A) => A.ai === ai).forEach((A) => O.raise(A, a, W(29, 4) - 0.2 + ai * 0.08, 0.7)));
  DS.card(S, "8 ARMS UP!", 960, 140, { size: DS.type.title, t: W(29, 1), fill: "yellow" });
  O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], W(30, 0), S.end - 0.3, 10);
  O.lift(-90, W(30, 2), 0.8); glow(S, W(30, 2)); O.sing(W(30, 2), S.end);
  finish(S); }

// 12  chorus 4: all eight arms, + turtle — everyone dances
chorus(12, [31, 32], [33], [34], 8, 4);

// 13  "Eight little arms open wide, / Hug your friends on every side!" — friends swim and walk in
{ const S = sc(13, { cam: "pull", focus: "960 640" }); sea(S, { coral: false }); bubbles(S, 7, 331);
  const st = star(S, 330, 925, 0.9), cb = crab(S, 1600, 935, 0.8);
  tw(st.pos, W(36, 0), 1.2, "translate(330 925) scale(0.9)", "translate(470 925) scale(0.9)", "sine.inOut");
  tw(cb.pos, W(36, 0), 1.2, "translate(1600 935) scale(0.8)", "translate(1440 935) scale(0.8)", "sine.inOut");
  const O = ollie(S, 960, 905, 1.0);
  const f2 = fish(S, 1660, 470, 0.7, "orange", -1, { t: W(36, 2) }), f = fish(S, 260, 430, 0.8, "yellow", 1, { t: W(36, 2) });
  f.move(560, 420, W(36, 2), 1.4); f.swim(S.start, S.end); f2.move(1380, 450, W(36, 2), 1.4); f2.swim(S.start, S.end);
  [60, 52].forEach((a, ai) => O.arms.filter((A) => A.ai === ai).forEach((A) => O.raise(A, a, W(35, 3) - 0.1, 0.7)));
  DS.card(S, "OPEN WIDE!", 960, 140, { size: DS.type.title, t: W(35, 3) });
  O.bob(W(36, 0), S.end); O.sing(W(36, 0), W(36, 0) + 0.8);
  finish(S, { wx: 1880 }); }

// 14  "One, two, three, four, five, six, seven, eight," — a number lands on each arm, left to right
{ const S = sc(14, { cam: "push", focus: "960 640" }); sea(S, { coral: false, weeds: [[150, 0.8], [1790, 0.9]] }); bubbles(S, 5, 377);
  const O = ollie(S, 960, 905, 1.1);
  [42, 30, 14, 4].forEach((a, ai) => O.arms.filter((A) => A.ai === ai).forEach((A) => O.raise(A, a, S.start + 0.05, 0.5)));
  DS.card(S, "COUNT TO 8!", 960, 140, { size: DS.type.title, fill: "yellow" });
  O.row.forEach((A, i) => { // a row of numbers above Ollie; the matching arm (left → right) waves on its number
    const t = W(37, i), x = 560 + i * 114, y = 290, g = G(S, null);
    DS.shape(S, circ(x, y, 46), i === 7 ? "yellow" : "white", { t, parent: g, flat: true, w: "detail" });
    S.text(String(i + 1), x, y + 23, { size: DS.type.body, t, c: DS.P.ink[0], parent: g });
    tw(A.wig, t - 0.1, 0.5, `rotate(0 ${A.x} ${A.y})`, `rotate(${12 * A.side} ${A.x} ${A.y})`, hump(1));
  });
  O.sing(W(37, 7), S.end);
  finish(S, { weed: false }); }

// 15  "A great big hug, you're doing great! / Who gives hugs? Ollie-O! / A great big hug from Ollie-O!"
{ const S = sc(15, { cam: "push", focus: "960 620" }); sea(S, { coral: false }); bubbles(S, 7, 419);
  const tu = turtle(S, 1530, 930, 0.75), st = star(S, 580, 940, 0.9), cb = crab(S, 1260, 945, 0.75);
  const f = fish(S, 560, 470, 0.8, "yellow", 1); f.swim(S.start, S.end);
  const O = ollie(S, 920, 905, 1.0);
  [60, 52].forEach((a, ai) => O.arms.filter((A) => A.ai === ai).forEach((A) => O.raise(A, a, S.start + 0.05, 0.4)));
  [-12, -6].forEach((a, ai) => O.arms.filter((A) => A.ai === ai).forEach((A) => O.raise(A, a, W(38, 3) - 0.3, 0.8)));
  DS.card(S, "BIG HUG!", 920, 140, { size: DS.type.display, t: W(38, 1), fill: "pink" });
  hearts(S, W(38, 3), [[700, 620, 1.6], [1160, 600, 1.4], [560, 760, 1.2], [1320, 740, 1.2]]);
  O.sing(W(38, 3), W(38, 3) + 1.0);
  O.hop(W(39, 3)); O.sing(W(39, 3), W(39, 3) + 0.8);
  hearts(S, W(40, 3), [[640, 560, 1.4], [1220, 540, 1.6], [1400, 700, 1.2]]);
  O.sing(W(40, 5), S.end); O.bob(W(40, 0), S.end, 8);
  [st, cb, tu].forEach((x) => x.dance(W(39, 0), S.end));
  finish(S); }
