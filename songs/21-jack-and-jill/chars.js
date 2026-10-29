// look: still
// Song 21 characters, props and the sunny hill, shared by scenes.js (pasted in by `// @include chars.js`).
// Jack (boy, orange shirt) and Jill (girl, purple dress), the well, pails, a bandage, a pebble, trees. Origin of every figure = ground centre.
const SKIN = "dusk";
// ---------- small face bits ----------
const dot = (S, d, color, g, op = 1) => S.fill(d, S.start, 0, color, op, g);
const sh = (S, d, name, g, o = {}) => DS.shape(S, d, name, Object.assign({ t: S.start, parent: g }, o));
const eyes = (S, g, dx, y, r, look = 0) => [-1, 1].forEach((s) => {
  dot(S, circ(s * dx + look, y, r * 0.82, r), DS.P.ink[0], g);
  dot(S, circ(s * dx + look - r * 0.28, y - r * 0.38, r * 0.34), DS.P.white[0], g);
  dot(S, circ(s * dx + look + r * 0.26, y + r * 0.4, r * 0.15), DS.P.white[0], g);
});
const cheeks = (S, g, dx, y, r) => [-1, 1].forEach((s) => dot(S, circ(s * dx, y, r, r * 0.62), DS.c("pink"), g, 0.65));
// three mouths on one face: "smile", "open" (singing / laughing), "oh" (a little surprised); K.mouth(t, name) swaps them
const mouths3 = (S, g, y, w) => {
  const m = { smile: S.draw(`M${-w} ${y} Q0 ${y + w} ${w} ${y}`, S.start, 0, { c: DS.line(), w: DS.w.mid, parent: g }), open: G(S, g), oh: G(S, g) };
  S.draw(`M${-w} ${y} Q0 ${y + w * 2} ${w} ${y} Z`, S.start, 0, { c: DS.line(), w: DS.w.mid, fill: DS.c("red", 2), parent: m.open });
  dot(S, circ(0, y + w * 0.75, w * 0.45, w * 0.22), DS.c("pink", 1), m.open);
  S.draw(circ(0, y + w * 0.5, w * 0.42, w * 0.55), S.start, 0, { c: DS.line(), w: DS.w.mid, fill: DS.c("red", 2), parent: m.oh });
  m.open.setAttribute("opacity", 0); m.oh.setAttribute("opacity", 0);
  let cur = "smile";
  return (t, name) => { if (name === cur) return; tl.set(m[cur], { opacity: 0 }, t); tl.set(m[name], { opacity: 1 }, t); cur = name; };
};

// ---------- a pail (origin = bottom centre, ~110 tall with its handle). water fades in on K.fill(t) ----------
const pail = (S, parent, x, y, k, name) => {
  const g = G(S, parent, `translate(${x} ${y}) scale(${k})`), back = G(S, g);
  S.draw("M-44 -74 Q0 -160 44 -74", S.start, 0, { c: DS.c("gray", 2), w: DS.w.near, parent: back });                    // handle
  sh(S, "M-50 -76 L50 -76 L38 0 L-38 0 Z", name, g, { w: "mid" });
  sh(S, rrect(-54, -88, 108, 18, DS.r.xs), name, g, { w: "detail", tone: 1, flat: true });
  S.draw("M-20 -62 L-14 -12 M20 -62 L14 -12", S.start, 0, { c: DS.c(name, 2), w: DS.w.hair, parent: g });
  const water = G(S, g); water.setAttribute("opacity", 0);
  S.fill(circ(0, -80, 44, 8), S.start, 0, DS.c("blue", 1), 1, water);
  return { g, water, fill: (t) => tl.fromTo(water, { opacity: 0 }, { opacity: 1, duration: 0.5, immediateRender: false }, t), hide: (t) => tl.set(g, { opacity: 0 }, t) };
};

// ---------- Jack and Jill: round heads, big eyes, ~460 tall at k = 1. K.arms[side] rotate about K.sh[side] ----------
const kid = (S, x, gy, k, o = {}) => {
  const jill = !!o.jill, shirt = jill ? "purple" : "orange", pants = jill ? "purple" : "blue", hairC = jill ? "gold" : "brown";
  const sd = DS.shadow(S, x, gy, 270 * k);
  const pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, pos, "translate(0 0)"), rock = G(S, bob, "rotate(0 0 0)"), squash = G(S, rock, "scale(1 1)");
  const K = { pos, bob, rock, squash, sd, k, x, gy, jill, arms: {}, sh: {} };
  [-1, 1].forEach((s) => { sh(S, cap(s * 34, -120, s * 38, -30, 24), pants, squash); sh(S, circ(s * 42, -16, 38, 20), "red", squash); });   // legs + shoes
  if (jill) sh(S, "M-70 -290 L70 -290 L112 -100 Q0 -78 -112 -100 Z", shirt, squash); else sh(S, rrect(-80, -295, 160, 190, DS.r.lg), shirt, squash);     // dress / shirt
  if (!jill) sh(S, rrect(-82, -156, 164, 56, DS.r.md), pants, squash);
  const head = G(S, squash, "translate(0 0)"); K.head = head;
  if (jill) [-1, 1].forEach((s) => { sh(S, circ(s * 104, -330, 36, 50), hairC, head); sh(S, circ(s * 104, -392, 20), "red", head, { w: "mid" }); });                // pigtails + bows
  sh(S, circ(0, -372, 100, 96), SKIN, head);
  sh(S, jill ? "M-98 -376 Q-96 -478 0 -476 Q96 -478 98 -376 Q60 -430 0 -420 Q-60 -430 -98 -376 Z" : "M-98 -380 Q-92 -474 0 -476 Q92 -474 98 -380 Q56 -428 0 -420 Q-56 -428 -98 -380 Z", hairC, head, { w: "mid" });
  if (!jill) sh(S, "M-6 -472 Q18 -520 34 -490 Q14 -486 12 -470 Z", hairC, head, { w: "detail" });                                             // a little tuft
  eyes(S, head, 40, -366, 15, o.look || 0);
  cheeks(S, head, 66, -334, 17);
  K.mouth = mouths3(S, head, -330, 17);
  const bandage = G(S, head, "rotate(-14 0 -466)"); bandage.setAttribute("opacity", 0);                                                           // Jack's bandage, on his crown
  sh(S, rrect(-52, -486, 104, 34, DS.r.sm), "sand", bandage, { w: "mid", tone: 1, flat: true });
  S.draw("M-18 -482 V-456 M18 -482 V-456", S.start, 0, { c: DS.c("sand", 2), w: DS.w.detail, parent: bandage });
  K.bandage = (t) => tl.fromTo(bandage, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, svgOrigin: "0 -466", duration: 0.4, ease: "back.out(2)", immediateRender: false }, t);
  if (o.bandage) bandage.setAttribute("opacity", 1);
  [-1, 1].forEach((s) => {
    const a = G(S, squash, `rotate(0 ${s * 74} -262)`);
    sh(S, cap(s * 74, -262, s * 108, -150, 20), shirt, a, { w: "mid" });
    sh(S, circ(s * 110, -138, 24), SKIN, a, { w: "mid" });
    K.arms[s] = a; K.sh[s] = `${s * 74} -262`;
  });
  if (o.pail) { K.pail = pail(S, squash, jill ? 118 : -118, -26, 0.9, jill ? "yellow" : "red"); K.pail.show = (t) => tl.fromTo(K.pail.g, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, t); if (o.pail === "hidden") K.pail.g.setAttribute("opacity", 0); }
  if (o.sit) squash.setAttribute("transform", "scale(1 0.8)");
  K.sit = (t, dur = 0.5) => tw(squash, t, dur, "scale(1 1)", "scale(1 0.8)");
  K.stand = (t, dur = 0.5) => tw(squash, t, dur, "scale(1 0.8)", "scale(1 1)", "back.out(1.5)");
  K.hop = (t0, h = 40, dur = 0.5) => tw(bob, t0, dur, "translate(0 0)", `translate(0 ${-h})`, hump(1));
  K.bounce = (t0, t1, h = 10) => tw(bob, t0, t1 - t0, "translate(0 0)", `translate(0 ${-h})`, hump(cyc(t1 - t0, BEAT)));
  K.sway = (t0, t1, deg = 4) => tw(rock, t0, t1 - t0, "rotate(0 0 0)", `rotate(${deg} 0 0)`, wave(cyc(t1 - t0, 2 * BEAT)));
  K.raise = (side, deg, t, dur = 0.5) => tw(K.arms[side], t, dur, `rotate(0 ${K.sh[side]})`, `rotate(${-deg * side} ${K.sh[side]})`);
  K.wave = (side, t0, t1, deg = 150) => { K.raise(side, deg, t0 - 0.5); tw(K.arms[side], t0, t1 - t0, `rotate(${-deg * side} ${K.sh[side]})`, `rotate(${-(deg - 24) * side} ${K.sh[side]})`, wave(cyc(t1 - t0, BEAT))); };
  return K;
};

// ---------- movers: one group that holds a character and its shadow, so both can walk (x, y = ground centre, s = scale about it) ----------
const mover = (S, cx, gy, parts) => {
  const g = S.grp(), M = { g, cx, gy, x: cx, y: gy, s: 1 };
  parts.forEach((p) => g.appendChild(p));
  const tf = (x, y, s) => `translate(${x} ${y}) scale(${s}) translate(${-cx} ${-gy})`;
  g.setAttribute("transform", tf(cx, gy, 1));
  M.go = (x, y, s, t, dur, ease = "sine.inOut") => { tw(g, t, dur, tf(M.x, M.y, M.s), tf(x, y, s), ease); M.x = x; M.y = y; M.s = s; return M; };
  return M;
};

// ---------- the well: stone ring, two posts, a little red roof, a rope. Origin = ground centre, ~380 tall at k = 1 ----------
const well = (S, x, gy, k = 1) => {
  DS.shadow(S, x, gy, 360 * k);
  const g = G(S, null, `translate(${x} ${gy}) scale(${k})`);
  [-1, 1].forEach((s) => sh(S, rrect(s * 118 - 12, -330, 24, 230, DS.r.xs), "wood", g, { w: "mid", dir: "v" }));
  sh(S, rrect(-132, -346, 264, 26, DS.r.xs), "wood", g, { w: "mid" });
  sh(S, "M-170 -338 L0 -430 L170 -338 Z", "red", g, { w: "mid" });
  S.draw("M0 -320 V-210", S.start, 0, { c: DS.c("sand", 2), w: DS.w.mid, parent: g });
  sh(S, "M-140 -120 L140 -120 L130 0 L-130 0 Z", "gray", g);
  S.draw("M-135 -80 H135 M-135 -40 H133 M-60 -120 V-80 M50 -80 V-40 M-30 -40 V0 M80 -40 V0", S.start, 0, { c: DS.c("gray", 2), w: DS.w.detail, parent: g });
  sh(S, circ(0, -120, 140, 34), "gray", g, { tone: 1, flat: true });
  S.fill(circ(0, -118, 108, 22), S.start, 0, DS.c("blue", 2), 1, g);
  S.fill(circ(-30, -122, 40, 6), S.start, 0, DS.c("blue", 1), 0.8, g);
  return { g, x, gy, k };
};

// ---------- set pieces ----------
const tree = (S, x, gy, k = 1, layer = "mid") => { DS.shadow(S, x, gy, 260 * k);
  sh(S, `M${x - 26 * k} ${gy} L${x - 16 * k} ${gy - 220 * k} L${x + 16 * k} ${gy - 220 * k} L${x + 26 * k} ${gy} Z`, "wood", null, { layer });
  [[-70, -250, 90], [70, -250, 90], [0, -330, 100], [-40, -380, 70], [50, -370, 70]].forEach(([dx, dy, r]) => sh(S, circ(x + dx * k, gy + dy * k, r * k), "green", null, { layer })); };
const bush = (S, x, gy, k = 1, layer = "mid") => { DS.shadow(S, x, gy, 260 * k); [[-80, -60, 70], [80, -60, 72], [-30, -115, 78], [44, -110, 70], [0, -50, 80]].forEach(([dx, dy, r]) => sh(S, circ(x + dx * k, gy + dy * k, r * k), "grass", null, { layer, tone: 2 })); };
const flowers = (S, pts) => pts.forEach(([x, y, c]) => { S.draw(`M${x} ${y} L${x} ${y + 40}`, S.start, 0, { c: DS.c("green", 2), w: DS.w.mid }); [0, 1, 2, 3, 4].forEach((i) => S.fill(circ(x + 16 * Math.cos(i * 1.257), y + 16 * Math.sin(i * 1.257), 12), S.start, 0, DS.c(c), 1)); S.fill(circ(x, y, 9), S.start, 0, DS.c("yellow"), 1); });
const cloud = (S, x, y, k = 1) => { const g = G(S, null, "translate(0 0)"); [[0, 0, 70, 44], [-70, 14, 54, 34], [72, 14, 58, 36], [20, -26, 50, 40]].forEach(([dx, dy, rx, ry]) => S.fill(circ(x + dx * k, y + dy * k, rx * k, ry * k), S.start, 0, DS.P.white[0], 0.92, g)); tw(g, S.start, S.len, "translate(0 0)", "translate(40 0)", "none"); return g; };
const rainbow = (S, cx, cy, r, t) => { const g = G(S, null, "translate(0 0)"); ["red", "orange", "yellow", "grass", "sky", "purple"].forEach((c, i) => S.draw(arc(cx, cy, r - i * 26, 180, 360, (r - i * 26) * 0.8), S.start, 0, { c: DS.c(c, 1), w: DS.w.near * 3.2, parent: g, op: 0.75 })); fadeIn(S, g, t); return g; };
const pebble = (S, x, gy, k = 1) => { DS.shadow(S, x, gy, 120 * k); return DS.shape(S, smooth([[x - 46 * k, gy], [x - 36 * k, gy - 30 * k], [x, gy - 42 * k], [x + 36 * k, gy - 26 * k], [x + 48 * k, gy]]) + " Z", "gray", { w: "mid" }); };
// the hill: sky, far hills, a path climbing to the well at the top (the well is drawn by the scene)
const hill = (S) => DS.outdoor(S, { hy: 540, sky: "sky", sun: [1580, 170], hills: "grass", ground: "grass", path: [540, 1380] });
