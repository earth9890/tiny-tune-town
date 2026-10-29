// Tiny Tune Town cast + sets: shared by every song. Use in scenes.js / thumb-*.js right under `// look: still`:
//   // @include ../../tools/cast.js        (from songs/<slug>/; from thumbnails/ use ../../../tools/cast.js)
// Ollie = channel hero (pink octopus, logo; .grin() toothy smile, .face = close-up centre). Friends: bibi() bunny, fish(), crab(), star(), turtle().
// Sets: sea(), coral(), weed(), rock(), shell(), bubbles(); home: DS.room(S, BATH_ROOM), bathWall(), bathSink(), tapWater(), foam(). Helpers: popIn, swing, cap.
let BEAT = 60 / 110; // songs set their own tempo after the include: BEAT = 60 / 96;
const cut = (c, i = 0) => W(c, i) - 0.35;
const wave = (n) => (p) => Math.sin(p * Math.PI * 2 * n);          // rest → +1 → -1 → rest, n times
const hump = (n) => (p) => (1 - Math.cos(p * Math.PI * 2 * n)) / 2; // rest → 1 → rest, n times
const cyc = (dur, per) => Math.max(1, Math.round(dur / per));
const tw = (e, t, dur, a, b, ease = "power2.inOut") => tl.fromTo(e, { attr: { transform: a } }, { attr: { transform: b }, duration: dur, ease, immediateRender: false }, t);
const G = (S, parent, tf) => { const g = S.grp(parent); if (tf) g.setAttribute("transform", tf); return g; };
const fadeIn = (S, e, t) => { if (t > S.start + 0.05) tl.fromTo(e, { opacity: 0 }, { opacity: +(e.getAttribute("opacity") ?? 1), duration: 0.35, ease: "power1.out" }, t); }; // keeps a shadow's own opacity

// ---------- soft toy look (2026-10-29 style lab "A + D") ----------
// One closed outline per creature, in a darker shade of its OWN colour (no black ink), painted UNDER the fill so limbs
// merge into the body; glossy highlights; white sticker edge + soft shadow come from one filter on the whole character.
const LN = (name, layer = "near") => DS.mix(DS.c(name, 2, layer), DS.P.ink[0], 0.28);
const LW = DS.w.near * 3; // stroke width; only the outer half shows (paint-order: stroke)
const toon = (S, d, name, o = {}) => {
  const e = S.draw(d, o.t ?? S.start, 0, { c: o.c || LN(name, o.layer), w: o.lw || (o.w ? DS.w[o.w] * 2.5 : LW), fill: o.flat ? DS.c(name, o.tone || 0, o.layer) : DS.vol(name, o.layer || "near", o.dir), parent: o.parent, op: o.op });
  e.setAttribute("paint-order", "stroke"); return e;
};
const toonBack = (S, d, name, parent, lw = LW) => S.draw(d, S.start, 0, { c: LN(name), w: lw, fill: LN(name), parent }); // outline-only layer, under the limbs
const toonFill = (S, d, name, parent) => S.fill(d, S.start, 0, DS.vol(name), 1, parent);                                // fill-only layer, over the limb roots
const toyFx = (g, r = 9) => {
  const id = "ttt-toy" + Math.round(r * 10);
  if (!document.getElementById(id)) {
    const f = el("filter", { id, x: "-25%", y: "-25%", width: "150%", height: "150%" }, dsDefs());
    el("feMorphology", { in: "SourceAlpha", operator: "dilate", radius: r, result: "fat" }, f);
    el("feFlood", { "flood-color": DS.P.white[0], result: "w" }, f);
    el("feComposite", { in: "w", in2: "fat", operator: "in", result: "edge" }, f);
    el("feGaussianBlur", { in: "fat", stdDeviation: r * 1.1, result: "b" }, f);
    el("feOffset", { in: "b", dy: r * 1.4, result: "bo" }, f);
    el("feFlood", { "flood-color": DS.P.pink[2], "flood-opacity": 0.3, result: "sc" }, f);
    el("feComposite", { in: "sc", in2: "bo", operator: "in", result: "sh" }, f);
    const m = el("feMerge", {}, f); ["sh", "edge", "SourceGraphic"].forEach((n) => el("feMergeNode", { in: n }, m));
  }
  g.setAttribute("filter", `url(#${id})`); return g;
};
const twinkle = (S, x, y, r, parent) => S.fill(`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`, S.start, 0, DS.c("yellow", 1), 0.95, parent);

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
  const arms = {}, BODY = circ(0, -335, 150, 165); // head; its fill covers the arm roots, so arms grow out of one silhouette
  toonBack(S, BODY, "pink", body);
  [0, 1, 2, 3].forEach((ai) => [-1, 1].forEach((side) => {
    const [rx, P] = ARMS[ai], x = rx * side, y = -200;
    const pose = G(S, body, `rotate(0 ${x} ${y})`), wig = G(S, pose, `rotate(0 ${x} ${y})`);
    const { d, C } = tube(P.map(([px, py]) => [x + px * side, y + py]), 40, 21);
    toon(S, d, "pink", { parent: wig });
    C.forEach((p, i) => { if (i > 7 && i < C.length - 2 && i % 3 === 0) S.fill(circ(p[0], p[1], 6 + 4 * (1 - i / C.length)), s0, 0, DS.P.white[0], 0.55, wig); });
    arms[ai + "," + side] = { pose, wig, x, y, side, ai, tip: C[C.length - 1], cur: 0 };
  }));
  toonFill(S, BODY, "pink", body);
  S.fill(circ(-66, -428, 40, 22), s0, 0, DS.P.white[0], 0.7, body);
  S.fill(circ(-10, -462, 9), s0, 0, DS.P.white[0], 0.8, body);
  twinkle(S, 128, -478, 20, body);
  [[78, -440, 15], [108, -392, 10], [-112, -372, 9]].forEach(([x, y, r]) => S.fill(circ(x, y, r), s0, 0, DS.c("pink", 2), 0.45, body));
  [-1, 1].forEach((s) => {
    toon(S, circ(58 * s, -330, 40, 48), "white", { parent: body, flat: true, c: LN("pink"), lw: DS.w.mid * 2 });
    S.fill(circ(58 * s + look, -318, 25), s0, 0, DS.P.ink[0], 1, body);
    S.fill(circ(58 * s + look - 9, -329, 9), s0, 0, DS.P.white[0], 1, body);
    S.fill(circ(58 * s + look + 8, -309, 4), s0, 0, DS.P.white[0], 1, body);
    S.fill(circ(104 * s, -258, 26, 15), s0, 0, DS.c("red", 1), 0.55, body);
  });
  const smile = S.draw("M-34 -262 Q0 -226 34 -262", s0, 0, { c: LN("red"), w: DS.w.near, parent: body });
  const open = G(S, body); open.setAttribute("opacity", 0);
  S.draw("M-36 -266 Q0 -196 36 -266 Z", s0, 0, { c: LN("red"), w: DS.w.near, fill: DS.c("red", 2), parent: open });
  S.fill(circ(0, -228, 15, 8), s0, 0, DS.c("pink", 1), 1, open);
  const grin = G(S, body); grin.setAttribute("opacity", 0); // big toothy smile (teeth songs, finales)
  S.draw("M-82 -282 Q0 -150 82 -282 Z", s0, 0, { c: LN("red"), w: DS.w.near, fill: DS.c("red", 2), parent: grin });
  S.fill(circ(0, -214, 26, 12), s0, 0, DS.c("pink", 1), 1, grin);
  S.draw("M-74 -279 Q0 -236 74 -279 L68 -262 Q0 -218 -68 -262 Z", s0, 0, { c: DS.c("gray", 1), w: DS.w.hair, fill: DS.P.white[0], parent: grin });
  [-48, -24, 0, 24, 48].forEach((x) => S.draw(`M${x} ${-268 + Math.abs(x) * 0.1} V${-238 + Math.abs(x) * 0.33}`, s0, 0, { c: DS.c("gray", 1), w: DS.w.hair, parent: grin }));
  if (o.mouth === "open") { open.setAttribute("opacity", 1); smile.setAttribute("opacity", 0); }
  if (o.mouth === "grin") { grin.setAttribute("opacity", 1); smile.setAttribute("opacity", 0); }
  toyFx(pos);
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
  O.grin = (t0, t1 = 1e9) => { tl.set(grin, { opacity: 1 }, t0); tl.set(smile, { opacity: 0 }, t0); if (t1 < 1e9) { tl.set(grin, { opacity: 0 }, t1); tl.set(smile, { opacity: 1 }, t1); } };
  O.face = [cx, gy - 330 * k]; // centre of the face, for camera close-ups: S.zoom(...O.face, 2.4, t)
  // aim arm A so its tip lands at height ty (body units, e.g. -262 = mouth) beside the face; returns the tip [x, y] in body units.
  // The tip sweeps a circle around the arm's root, so it lands outside the face. Pass t0 to swing it there over dur.
  O.holdAt = (A, ty, t0 = s0, dur = 0.01) => {
    const tx0 = A.tip[0] - A.x, ty0 = A.tip[1] - A.y, L = Math.hypot(tx0, ty0), dy = ty - A.y;
    const dx = Math.sqrt(Math.max(0, L * L - dy * dy)) * (A.side === 1 ? -1 : 1);
    let r = (Math.atan2(dy, dx) - Math.atan2(ty0, tx0)) * 180 / Math.PI; r = ((r + 540) % 360) - 180;
    O.raise(A, r * A.side, t0, dur); return [A.x + dx, ty];
  };
  // where arm A's tip is now (after raise/holdAt), in body units; o = how far past the tip to extend (for props held up in the air)
  O.tipNow = (A, ext = 0) => { const r = A.cur * Math.PI / 180, dx = A.tip[0] - A.x, dy = A.tip[1] - A.y, m = Math.hypot(dx, dy), f = (m + ext) / m;
    return [A.x + (dx * Math.cos(r) - dy * Math.sin(r)) * f, A.y + (dx * Math.sin(r) + dy * Math.cos(r)) * f]; };
  O.sing = (t0, t1) => { tl.set(open, { opacity: 1 }, t0); tl.set(smile, { opacity: 0 }, t0); tl.set(open, { opacity: 0 }, t1); tl.set(smile, { opacity: 1 }, t1); };
  return O;
};

// ---------- sea friends ----------
const fish = (S, x, y, k = 1, name = "yellow", dir = 1, o = {}) => {
  const s0 = S.start, pos = G(S, null, `translate(${x} ${y}) scale(${k * dir} ${k})`), bob = G(S, pos, "translate(0 0)");
  toon(S, "M-55 0 C-80 -20 -100 -45 -122 -48 C-108 -16 -108 16 -122 48 C-100 45 -80 20 -55 0 Z", name, { t: s0, parent: bob, w: "mid" });
  toon(S, "M-24 -42 C-10 -86 40 -80 46 -38 Z", name, { t: s0, parent: bob, w: "mid" });
  toon(S, circ(0, 0, 74, 52), name, { t: s0, parent: bob, w: "mid" });
  S.draw(smooth([[-22, -48], [-30, 0], [-22, 48]]), s0, 0, { c: DS.c(name, 2), w: DS.w.mid, parent: bob });
  toon(S, circ(36, -12, 17), "white", { t: s0, parent: bob, flat: true, w: "detail" });
  S.fill(circ(40, -10, 9), s0, 0, DS.P.ink[0], 1, bob); S.fill(circ(37, -14, 3.5), s0, 0, DS.P.white[0], 1, bob);
  S.draw("M34 20 Q46 30 58 16", s0, 0, { c: LN("red"), w: DS.w.mid, parent: bob });
  toyFx(pos, 7); fadeIn(S, pos, o.t ?? s0);
  const F = { pos, bob, x, y };
  F.swim = (t0, t1, amp = 14) => tw(bob, t0, t1 - t0, "translate(0 0)", `translate(0 ${-amp})`, hump(cyc(t1 - t0, 2 * BEAT)));
  F.move = (x1, y1, t0, dur = 1.6) => { tw(pos, t0, dur, `translate(${F.x} ${F.y}) scale(${k * dir} ${k})`, `translate(${x1} ${y1}) scale(${k * dir} ${k})`, "sine.inOut"); F.x = x1; F.y = y1; };
  return F;
};
const crab = (S, x, gy, k = 1, o = {}) => {
  const s0 = S.start, sh = DS.shadow(S, x, gy, 300 * k), pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, pos, "translate(0 0)"), claws = [];
  [-1, 1].forEach((s) => {
    [0, 1, 2].forEach((i) => toon(S, tube([[s * 50, -52 + i * 12], [s * (92 + i * 10), -44 + i * 14], [s * (108 + i * 12), -6]], 11, 9).d, "orange", { parent: bob, lw: DS.w.mid * 2.5, tone: 2, flat: true }));
    toon(S, tube([[s * 24, -112], [s * 30, -134], [s * 32, -152]], 9, 8).d, "orange", { parent: bob, lw: DS.w.mid * 2.5 });
    toon(S, tube([[s * 66, -96], [s * 96, -124], [s * 106, -150]], 12, 10).d, "orange", { parent: bob, lw: DS.w.mid * 2.5 });
    const cg = G(S, bob, `rotate(0 ${s * 106} -150)`);
    toon(S, circ(s * 112, -176, 34, 30), "orange", { t: s0, parent: cg });
    S.draw(`M${s * 112} -176 L${s * 146} -190`, s0, 0, { c: LN("orange"), w: DS.w.mid, parent: cg });
    claws.push([cg, s]);
  });
  toon(S, circ(0, -76, 90, 58), "orange", { t: s0, parent: bob });
  [-1, 1].forEach((s) => { toon(S, circ(s * 32, -160, 18), "white", { t: s0, parent: bob, flat: true, w: "detail" }); S.fill(circ(s * 32 + 3, -157, 9), s0, 0, DS.P.ink[0], 1, bob); });
  S.draw("M-24 -72 Q0 -50 24 -72", s0, 0, { c: LN("red"), w: DS.w.mid, parent: bob });
  S.fill(circ(-48, -64, 14, 8), s0, 0, DS.c("red", 1), 0.6, bob); S.fill(circ(48, -64, 14, 8), s0, 0, DS.c("red", 1), 0.6, bob);
  toyFx(pos, 7); if ((o.t ?? s0) > s0 + 0.05) { fadeIn(S, pos, o.t); fadeIn(S, sh, o.t); }
  return { pos, bob, clap: (t0) => claws.forEach(([cg, s]) => tw(cg, t0, 0.32, `rotate(0 ${s * 106} -150)`, `rotate(${-28 * s} ${s * 106} -150)`, hump(1))),
    dance: (t0, t1) => tw(bob, t0, t1 - t0, "translate(0 0)", "translate(0 -12)", hump(cyc(t1 - t0, BEAT))) };
};
const star = (S, x, gy, k = 1, o = {}) => {
  const s0 = S.start, sh = DS.shadow(S, x, gy, 200 * k), pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, pos, "rotate(0 0 -80)");
  const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 44 : 92; return [Math.cos(a) * r, -84 + Math.sin(a) * r]; });
  toon(S, smooth([...pts, pts[0], pts[1]]) + " Z", "yellow", { t: s0, parent: bob });
  [-1, 1].forEach((s) => { toon(S, circ(s * 18, -92, 12, 14), "white", { t: s0, parent: bob, flat: true, w: "detail" }); S.fill(circ(s * 18 + 2, -89, 7), s0, 0, DS.P.ink[0], 1, bob); });
  S.draw("M-14 -66 Q0 -54 14 -66", s0, 0, { c: LN("red"), w: DS.w.mid, parent: bob });
  [[0, -150], [64, -104], [40, -30], [-40, -30], [-64, -104]].forEach(([dx, dy]) => S.fill(circ(dx, dy, 6), s0, 0, DS.c("orange", 1), 0.9, bob));
  toyFx(pos, 7); if ((o.t ?? s0) > s0 + 0.05) { fadeIn(S, pos, o.t); fadeIn(S, sh, o.t); }
  return { pos, bob, dance: (t0, t1) => tw(bob, t0, t1 - t0, "rotate(0 0 -80)", "rotate(10 0 -80)", wave(cyc(t1 - t0, 2 * BEAT))) };
};
const turtle = (S, x, gy, k = 1, o = {}) => {
  const s0 = S.start, sh = DS.shadow(S, x, gy, 320 * k), pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, pos, "translate(0 0)");
  toon(S, circ(-86, -16, 38, 17), "grass", { t: s0, parent: bob }); toon(S, circ(80, -16, 38, 17), "grass", { t: s0, parent: bob });
  toon(S, circ(128, -84, 44, 40), "grass", { t: s0, parent: bob });
  toon(S, circ(142, -94, 12), "white", { t: s0, parent: bob, flat: true, w: "detail" }); S.fill(circ(145, -92, 7), s0, 0, DS.P.ink[0], 1, bob);
  S.draw("M124 -66 Q138 -56 154 -68", s0, 0, { c: LN("red"), w: DS.w.mid, parent: bob });
  toon(S, "M-128 -34 C-128 -166 128 -166 128 -34 Z", "green", { t: s0, parent: bob });
  S.draw(poly(Array.from({ length: 7 }, (_, i) => [Math.cos((i * Math.PI) / 3) * 34, -92 + Math.sin((i * Math.PI) / 3) * 30])), s0, 0, { c: DS.c("green", 2), w: DS.w.mid, parent: bob });
  toon(S, rrect(-136, -42, 272, 24, DS.r.sm), "sand", { t: s0, parent: bob, w: "mid" });
  toyFx(pos, 7); if ((o.t ?? s0) > s0 + 0.05) { fadeIn(S, pos, o.t); fadeIn(S, sh, o.t); }
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




// ---------- home and bathroom set (from 04 Bubble Hands) ----------
const K = (v) => +v.toFixed(1);
const cap = (x1, y1, x2, y2, r) => { const a = Math.atan2(y2 - y1, x2 - x1), nx = -Math.sin(a) * r, ny = Math.cos(a) * r; return `M${K(x1 + nx)} ${K(y1 + ny)} L${K(x2 + nx)} ${K(y2 + ny)} A${r} ${r} 0 0 0 ${K(x2 - nx)} ${K(y2 - ny)} L${K(x1 - nx)} ${K(y1 - ny)} A${r} ${r} 0 0 0 ${K(x1 + nx)} ${K(y1 + ny)} Z`; };
const BATH_ROOM = { wall: "glass", floor: "sand", window: false };   // DS.room(S, BATH_ROOM)
// gentle on-the-beat sway (yoyo, ends where it started)
const swing = (S, e, t0, t1, props, per = BEAT) => { const n = Math.floor((t1 - t0) / per); if (n >= 2) S.move(e, t0, per, Object.assign({ yoyo: true, repeat: 2 * Math.floor(n / 2) - 1 }, props), "sine.inOut"); };
// pops in calmly on its word; returns [outer (free to drift), inner]
const popIn = (S, t, x, y, parent) => { const o = S.grp(parent), g = S.grp(o); if (t > S.start + 0.05) popAt(g, t, x, y); return [o, g]; };
const foam = (S, x, y, n, t, parent) => { const [, g] = popIn(S, t, x, y, parent);
  for (let i = 0; i < n; i++) { const a = i * 2.4, d = 14 + (i % 4) * 12; S.draw(circ(x + Math.cos(a) * d * 1.6, y + Math.sin(a) * d, 16 + (i % 3) * 7), S.start, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.hair, parent: g }); }
  return g; };
const tiles = (S, x0, y0, x1, y1, step = 80) => { let d = ""; for (let x = x0 + step; x < x1; x += step) d += `M${x} ${y0} V${y1} `; for (let y = y0 + step; y < y1; y += step) d += `M${x0} ${y} H${x1} `; S.draw(d, S.start, 0, { c: DS.c("sky", 0, "mid"), w: DS.w.hair, op: 0.7 }); };
const bathWall = (S, o = {}) => {
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
const bathSink = (S, o = {}) => {
  DS.shape(S, rect(330, 772, 1260, 420), "wood", { dir: "v" });
  S.draw("M960 790 V1100", S.start, 0, { c: DS.c("wood", 2), w: DS.w.mid });
  [920, 1000].forEach((x) => DS.shape(S, circ(x, 860, 13), "gold", { w: "detail" }));
  DS.shape(S, rrect(280, 712, 1360, 66, DS.r.sm), "white");
  S.draw(circ(960, 740, 290, 22), S.start, 0, { fill: DS.c("glass", 2), c: DS.line(), w: DS.w.detail });
  DS.shape(S, rrect(1270, 590, 44, 132, DS.r.sm), "gray");                                                                   // faucet
  DS.shape(S, cap(1292, 612, 1180, 612, 18), "gray"); DS.shape(S, rrect(1160, 600, 38, 46, DS.r.xs), "gray", { w: "mid" });
  DS.shape(S, rrect(1258, 562, 68, 30, DS.r.sm), "sky", { w: "mid" });
};
const tapWater = (S, t, x = 1179, y0 = 646, y1 = 744) => { const [, g] = popIn(S, t, x, y0); S.fill(rrect(x - 15, y0, 30, y1 - y0, DS.r.sm), S.start, 0, DS.c("sky", 0), 0.85, g); S.fill(rrect(x - 5, y0 + 6, 8, y1 - y0 - 16, DS.r.xs), S.start, 0, DS.P.white[0], 0.8, g); return g; };

// ---------- Bibi: Ollie's best friend, a round pink bunny with a yellow bow (from 04 Bubble Hands) ----------
const bibiFace = (S, x, y, k, mood, g) => {
  [-1, 1].forEach((s) => {
    if (mood === "joy") S.draw(arc(x + s * 46 * k, y + 2 * k, 20 * k, 200, 340), S.start, 0, { c: LN("pink"), w: DS.w.near, parent: g });
    else { S.fill(circ(x + s * 46 * k, y - 6 * k, 20 * k, 26 * k), S.start, 0, DS.c("ink"), 1, g); S.fill(circ(x + s * 46 * k + 7 * k, y - 15 * k, 7 * k), S.start, 0, DS.P.white[0], 1, g); }
    S.fill(circ(x + s * 82 * k, y + 30 * k, 22 * k, 14 * k), S.start, 0, DS.c("red", 1), 0.45, g);
  });
  S.fill(circ(x, y + 24 * k, 12 * k, 9 * k), S.start, 0, DS.c("pink", 2), 1, g);
  S.draw(`M${K(x - 30 * k)} ${K(y + 46 * k)} Q${K(x)} ${K(y + 104 * k)} ${K(x + 30 * k)} ${K(y + 46 * k)} Z`, S.start, 0, { fill: DS.c("red", 2), c: LN("red"), w: DS.w.detail, parent: g });
  S.fill(circ(x, y + 64 * k, 13 * k, 7 * k), S.start, 0, DS.c("pink", 1), 1, g);
};
// an arm + paw from Bibi's shoulder to (px, py); returns its group (rotate it about g.sh to wave)
const bibiArm = (S, B, side, px, py, t) => { const [g, in_] = popIn(S, t ?? S.start, px, py, B.g), k = B.k, sx = B.x + side * 82 * k, sy = B.hy + 150 * k;
  toonBack(S, cap(sx, sy, px, py, 30 * k) + " " + circ(px, py, 46 * k, 42 * k), "pink", in_, LW * k);
  toonFill(S, cap(sx, sy, px, py, 30 * k) + " " + circ(px, py, 46 * k, 42 * k), "pink", in_);
  [-1, 1].forEach((s) => S.draw(`M${K(px + s * 16 * k)} ${K(py + 18 * k)} V${K(py + 38 * k)}`, S.start, 0, { c: LN("pink"), w: DS.w.detail, parent: in_ }));
  g.sh = `${K(sx)} ${K(sy)}`; return g; };
// x = centre, hy = head centre y; o: { k, mood: "joy", paws: [[lx, ly], [rx, ry]] (null = no arm) }
const bibi = (S, x, hy, o = {}) => {
  const k = o.k || 1, g = S.grp(), B = { g, k, x, hy };
  const ear = (fn) => [[-1, -12], [1, 10]].forEach(([s, rot]) => { const eg = S.grp(g), ex = x + s * 56 * k, ey = hy - 150 * k; eg.setAttribute("transform", `rotate(${rot} ${K(ex)} ${K(ey + 90 * k)})`); fn(eg, ex, ey); });
  const BODY = circ(x, hy + 200 * k, 130 * k, 125 * k) + " " + circ(x, hy, 128 * k, 114 * k); // body + head = one silhouette with the ears
  ear((eg, ex, ey) => toonBack(S, circ(ex, ey, 36 * k, 98 * k), "pink", eg, LW * k));
  toonBack(S, BODY, "pink", g, LW * k);
  ear((eg, ex, ey) => { toonFill(S, circ(ex, ey, 36 * k, 98 * k), "pink", eg); S.fill(circ(ex, ey + 10 * k, 16 * k, 66 * k), S.start, 0, DS.c("pink", 2), 0.55, eg); });
  toonFill(S, BODY, "pink", g);
  S.fill(circ(x, hy + 222 * k, 80 * k, 84 * k), S.start, 0, DS.P.white[0], 0.8, g);
  S.fill(circ(x - 52 * k, hy - 62 * k, 34 * k, 16 * k), S.start, 0, DS.P.white[0], 0.6, g);
  bibiFace(S, x, hy, k, o.mood, g);
  const bx = x + 70 * k, by = hy - 104 * k; // yellow bow = Bibi's signature
  [-1, 1].forEach((s) => toon(S, `M${K(bx)} ${K(by)} L${K(bx + s * 46 * k)} ${K(by - 26 * k)} Q${K(bx + s * 58 * k)} ${K(by)} ${K(bx + s * 46 * k)} ${K(by + 26 * k)} Z`, "yellow", { parent: g, lw: DS.w.mid * 2.5 * k }));
  toon(S, circ(bx, by, 13 * k), "yellow", { parent: g, lw: DS.w.mid * 2.5 * k });
  toyFx(g, 9 * k);
  const [l, r] = o.paws || [[x - 110 * k, hy + 290 * k], [x + 110 * k, hy + 290 * k]];
  if (l) B.L = bibiArm(S, B, -1, l[0], l[1]);
  if (r) B.R = bibiArm(S, B, 1, r[0], r[1]);
  return B;
};

// ---------- props ----------
// toothbrush: handle from (x0, y0) (where it is held) to the bristle head at (x1, y1); o: { c: colour, foam: true, parent }
const toothbrush = (S, x0, y0, x1, y1, o = {}) => {
  const g = S.grp(o.parent), a = Math.atan2(y1 - y0, x1 - x0), ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
  DS.shape(S, cap(x0, y0, x1 - ux * 34, y1 - uy * 34, 11), o.c || "sky", { parent: g, w: "mid" });
  DS.shape(S, cap(x1 - ux * 40, y1 - uy * 40, x1, y1, 13), "white", { parent: g, w: "detail" });
  const bx = x1 - ux * 20 - nx * 14, by = y1 - uy * 20 - ny * 14;      // bristles stick out on one side
  DS.shape(S, `M${K(x1 - ux * 40 - nx * 10)} ${K(y1 - uy * 40 - ny * 10)} L${K(x1 - nx * 10)} ${K(y1 - ny * 10)} L${K(x1 - nx * 34)} ${K(y1 - ny * 34)} L${K(x1 - ux * 40 - nx * 34)} ${K(y1 - uy * 40 - ny * 34)} Z`, "glass", { parent: g, w: "detail" });
  if (o.foam !== false) [[0, 0, 15], [-16, -8, 11], [14, -10, 10], [4, -22, 9]].forEach(([dx, dy, r]) => S.draw(circ(bx + dx - nx * 18, by + dy - ny * 18, r), S.start, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.hair, parent: g }));
  return g;
};

// ---------- Puppy (added for 30 This Old Man): a round brown pup with floppy ears and a wagging tail; sits on the ground at (x, gy) ----------
// returns { pos, bob, wag(t0, t1), hop(t0, h) }
const puppy = (S, x, gy, k = 1, o = {}) => {
  const s0 = S.start, sh = DS.shadow(S, x, gy, 250 * k), pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, pos, "translate(0 0)");
  const tail = G(S, bob, "rotate(0 70 -50)");
  toon(S, tube([[62, -44], [96, -70], [112, -112]], 13, 9).d, "wood", { parent: tail, lw: DS.w.mid * 2.5 });
  toon(S, circ(-52, -22, 30, 22), "wood", { t: s0, parent: bob }); toon(S, circ(52, -22, 30, 22), "wood", { t: s0, parent: bob });
  toon(S, circ(0, -84, 78, 74), "wood", { t: s0, parent: bob });
  S.fill(circ(0, -60, 42, 48), s0, 0, DS.P.white[0], 0.85, bob);
  toon(S, circ(-30, -22, 24, 26), "white", { t: s0, parent: bob, flat: true, w: "mid" }); toon(S, circ(30, -22, 24, 26), "white", { t: s0, parent: bob, flat: true, w: "mid" });
  [-1, 1].forEach((s) => toon(S, circ(s * 74, -192, 28, 52), "wood", { t: s0, parent: bob, tone: 2 }));
  toon(S, circ(0, -178, 74, 68), "wood", { t: s0, parent: bob });
  S.fill(circ(-30, -214, 26, 12), s0, 0, DS.P.white[0], 0.55, bob);
  toon(S, circ(0, -150, 40, 30), "white", { t: s0, parent: bob, flat: true, w: "mid" });
  [-1, 1].forEach((s) => { toon(S, circ(s * 30, -190, 17), "white", { t: s0, parent: bob, flat: true, w: "detail" }); S.fill(circ(s * 30 + 2, -187, 9), s0, 0, DS.P.ink[0], 1, bob); S.fill(circ(s * 30 - 2, -192, 3), s0, 0, DS.P.white[0], 1, bob); });
  S.fill(circ(0, -164, 14, 9), s0, 0, DS.P.ink[0], 1, bob);
  S.draw("M-20 -146 Q0 -130 20 -146", s0, 0, { c: LN("red"), w: DS.w.mid, parent: bob });
  S.fill(circ(0, -134, 10, 14), s0, 0, DS.c("red", 1), 1, bob);
  toyFx(pos, 7); if ((o.t ?? s0) > s0 + 0.05) { fadeIn(S, pos, o.t); fadeIn(S, sh, o.t); }
  return { pos, bob, x, gy, k,
    wag: (t0, t1) => tw(tail, t0, t1 - t0, "rotate(-14 70 -50)", "rotate(22 70 -50)", wave(cyc(t1 - t0, BEAT))),
    hop: (t0, h = 40) => tw(bob, t0, 0.5, "translate(0 0)", `translate(0 ${-h})`, hump(1)) };
};
// a cartoon bone centred on (0, 0): put it inside your own group
const bone = (S, parent, k = 1) => toon(S, cap(-50 * k, 0, 50 * k, 0, 16 * k) + " " + [[-62, -14], [-62, 14], [62, -14], [62, 14]].map(([a, b]) => circ(a * k, b * k, 17 * k)).join(" "), "white", { parent, lw: DS.w.mid * 2.5 });
