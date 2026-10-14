// look: still
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


// B: Ollie hugs a little fish, hearts, "BIG HUG!"
const S = scene(0, 1, { cam: "none" }); sea(S, { coral: false, weeds: [[150, 1]] });
const O = ollie(S, 620, 1230, 1.85, { mouth: "open", look: 10 });
const f = fish(S, 1090, 780, 1.5, "yellow", -1);
[[1500, 600, 3.0], [1720, 800, 2.2], [1380, 900, 1.6]].forEach(([x, y, s]) => S.draw(heartPath(x, y, s), 0, 0, { fill: DS.c("red", 1), c: DS.c("red", 2), w: DS.w.near }));
S.text("BIG HUG!", 1380, 300, { size: 190, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
