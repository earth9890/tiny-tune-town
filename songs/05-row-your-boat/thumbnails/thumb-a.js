// look: still
// Row, Row, Row Your Boat (Tiny Tune Town). Traditional verse (1852) + our verses: Pip rows a red boat down a sunny river;
// a duck, a frog and a fish hop in one by one (2, 3, 4 friends), then everyone rows home: HOORAY!
const INKC = DS.P.ink[0];
const SWING = (2 * 60) / 108; // one rowing swing = 2 beats at 108 bpm (slow, kids can copy it)
const rad = (a) => (a * Math.PI) / 180;
const grp = (S, p, tf) => { const g = S.grp(p); if (tf) g.setAttribute("transform", tf); return g; };
// gentle, seek-safe back-and-forth on one attribute (>= 0.5 s per swing: no flashing)
const loop = (S, e, attr, A, B, per, t0 = S.start) => tl.fromTo(e, { attr: { [attr]: A } }, { attr: { [attr]: B }, duration: per, ease: "sine.inOut", yoyo: true, repeat: Math.max(0, Math.floor((S.end - t0) / per)) }, t0);
const rot = (a, x, y) => `rotate(${a} ${x} ${y})`;
const about = (x, y, k) => `translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`;
// chunky limb = ink outline stroke + colour stroke on top
const limb = (S, d, name, wd, p) => [S.draw(d, S.start, 0, { c: DS.line(), w: wd + 2 * DS.w.mid, parent: p }), S.draw(d, S.start, 0, { c: DS.c(name), w: wd, parent: p })];
const sh = (S, d, name, p, o = {}) => DS.shape(S, d, name, Object.assign({ parent: p }, o));
const face = (S, p, x, y, R, mood = "happy", look = 0, t) => face3(S, S.grp(p), x, y, R, t ?? S.start, mood, look, INKC);
const star = (x, y, r) => `M${Array.from({ length: 10 }, (_, i) => { const a = rad(-90 + i * 36), k = i % 2 ? r * 0.45 : r; return `${(x + Math.cos(a) * k).toFixed(1)} ${(y + Math.sin(a) * k).toFixed(1)}`; }).join(" L")} Z`;
// hop along an arc on the outer group (GSAP x/y in the parent's units)
const hop = (g, from, to, t, dur = 0.9, h = 220) => {
  const mid = [(from[0] + to[0]) / 2, Math.min(from[1], to[1]) - h];
  tl.fromTo(g, { x: from[0], y: from[1] }, { x: mid[0], y: mid[1], duration: dur / 2, ease: "sine.out", immediateRender: false }, t); // start pose comes from at()
  tl.fromTo(g, { x: mid[0], y: mid[1] }, { x: to[0], y: to[1], duration: dur / 2, ease: "sine.in", immediateRender: false }, t + dur / 2);
};
const at = (g, x, y) => gsap.set(g, { x, y });

// ---------- characters (local coords; y = where they sit) ----------
// Pip: round little kid in a yellow rain hat and raincoat (the hero, same in every picture)
const pip = (S, p, x, o = {}) => {
  const g = S.grp(p), R = 76, hy = -335;
  sh(S, circ(x, -165, 98, 118), "yellow", g);
  S.draw(`M${x} -262 V-110`, S.start, 0, { c: DS.c("yellow", 2), w: DS.w.mid, parent: g });
  [-225, -185, -145].forEach((y) => sh(S, circ(x + 20, y, 9), "white", g, { w: "detail" }));
  sh(S, circ(x, hy, R), "dusk", g);
  face(S, g, x, hy + 0.14 * R, R, o.mood || "happy", o.look || 0);
  sh(S, `M${x - R * 0.98} ${hy - R * 0.42} C${x - R * 0.98} ${hy - R * 1.55} ${x + R * 0.98} ${hy - R * 1.55} ${x + R * 0.98} ${hy - R * 0.42} Z`, "yellow", g);
  sh(S, circ(x, hy - R * 0.5, R * 1.45, R * 0.24), "yellow", g);
  return g;
};
// Pip's two oars + arms, in front of the hull. o.row: start rowing at t | o.wave: wave the right hand | o.upAt: arms up (hooray)
const oars = (S, p, x, o = {}) => {
  const g = S.grp(p), HL = 125, D = 16, shY = -215;
  [[-1, [x - 122, -94], 128], [1, [x + 122, -100], 52]].forEach(([s, O, a]) => {
    const og = grp(S, g, rot(0, O[0], O[1]));
    const ba = rad(a), ha = rad(a + 180), E = [O[0] + Math.cos(ba) * 310, O[1] + Math.sin(ba) * 310], H = [O[0] + Math.cos(ha) * HL, O[1] + Math.sin(ha) * HL];
    limb(S, `M${H[0]} ${H[1]} L${E[0]} ${E[1]}`, "wood", DS.w.near * 2, og);
    sh(S, circ(E[0] + Math.cos(ba) * 50, E[1] + Math.sin(ba) * 50, 70, 26), "wood", grp(S, og, rot(a, E[0] + Math.cos(ba) * 50, E[1] + Math.sin(ba) * 50)));
    sh(S, circ(O[0], O[1], 11), "gray", g, { w: "detail" });
    const hand = (th) => { const c = Math.cos(rad(th)), si = Math.sin(rad(th)), v = [H[0] - O[0], H[1] - O[1]]; return [O[0] + v[0] * c - v[1] * si, O[1] + v[0] * si + v[1] * c]; };
    const S0 = [x + s * 58, shY];
    const arm = (h) => `M${S0[0]} ${S0[1]} Q${(S0[0] + h[0]) / 2 + s * 30} ${(S0[1] + h[1]) / 2 + 34} ${h[0]} ${h[1]}`;
    const waving = o.wave && s === 1;
    const up = [x + s * 135, -445], up2 = [x + s * 175, -410];
    const h0 = waving ? up : hand(0);
    const A = limb(S, arm(h0), "yellow", 34, g), Hd = sh(S, circ(h0[0], h0[1], 20), "dusk", g);
    if (waving) { [...A].forEach((e) => loop(S, e, "d", arm(up), arm(up2), 0.7)); loop(S, Hd, "d", circ(up[0], up[1], 20), circ(up2[0], up2[1], 20), 0.7); }
    if (o.row !== undefined) {
      const hA = hand(s * D), hB = hand(-s * D);
      loop(S, og, "transform", rot(s * D, O[0], O[1]), rot(-s * D, O[0], O[1]), SWING, o.row);
      A.forEach((e) => loop(S, e, "d", arm(hA), arm(hB), SWING, o.row));
      loop(S, Hd, "d", circ(hA[0], hA[1], 20), circ(hB[0], hB[1], 20), SWING, o.row);
    }
    if (o.upAt !== undefined) {
      A.forEach((e) => tl.to(e, { attr: { d: arm(up) }, duration: 0.4, ease: "power2.out" }, o.upAt));
      tl.to(Hd, { attr: { d: circ(up[0], up[1], 20) }, duration: 0.4, ease: "power2.out" }, o.upAt);
    }
  });
  return g;
};
// duck: white, round, orange bill. g = outer (swim / hop), wing flaps when o.flap
const duck = (S, p, x, y, o = {}) => {
  const g = S.grp(p), gi = S.grp(g);
  sh(S, `M${x - 62} ${y - 56} L${x - 116} ${y - 100} L${x - 54} ${y - 90} Z`, "white", gi);
  sh(S, circ(x, y - 50, 82, 54), "white", gi);
  const wing = sh(S, `M${x - 52} ${y - 62} Q${x - 5} ${y - 100} ${x + 38} ${y - 58} Q${x - 5} ${y - 28} ${x - 52} ${y - 62} Z`, "white", gi, { flat: true, tone: 2 });
  sh(S, circ(x + 50, y - 132, 48), "white", gi);
  face(S, gi, x + 50, y - 130, 48, o.mood || "happy", o.look || 0);
  sh(S, circ(x + 50, y - 112, 26, 11), "orange", gi);
  if (o.flap !== undefined) loop(S, wing, "transform", rot(0, x - 52, y - 62), rot(-28, x - 52, y - 62), SWING / 2, o.flap);
  if (o.upAt !== undefined) tl.to(wing, { attr: { transform: rot(-60, x - 52, y - 62) }, duration: 0.4 }, o.upAt);
  return { g, gi, wing };
};
// frog: green, round, eyes on top
const frog = (S, p, x, y, o = {}) => {
  const g = S.grp(p), gi = S.grp(g);
  [-1, 1].forEach((s) => sh(S, circ(x + s * 62, y - 8, 38, 16), "green", gi));
  sh(S, circ(x, y - 60, 86, 62), "grass", gi);
  sh(S, circ(x, y - 42, 52, 30), "grass", gi, { flat: true, tone: 1, w: "detail" });
  [-1, 1].forEach((s) => sh(S, circ(x + s * 34, y - 124, 33), "grass", gi));
  face(S, gi, x, y - 116, 100, o.mood || "happy", o.look || 0);
  if (o.sway !== undefined) loop(S, gi, "transform", rot(-4, x, y), rot(4, x, y), SWING, o.sway);
  return { g, gi };
};
// fish: orange, round, big smile. k = size (inner scale around its centre)
const fish = (S, p, x, y, k = 1, o = {}) => {
  const g = S.grp(p), gi = grp(S, g, about(x, y, k));
  sh(S, `M${x - 66} ${y} L${x - 124} ${y - 48} L${x - 114} ${y + 48} Z`, "orange", gi);
  sh(S, `M${x - 30} ${y - 50} Q${x} ${y - 96} ${x + 34} ${y - 48} Z`, "orange", gi, { flat: true, tone: 2 });
  sh(S, circ(x, y, 84, 58), "orange", gi);
  face(S, gi, x + 22, y - 4, 52, o.mood || "happy", o.look || 0);
  return { g, gi };
};
const bowl = (S, p, x, y, t) => { const g = S.grp(p); sh(S, circ(x, y, 66), "glass", g, { op: 0.9 }); S.draw(arc(x, y, 50, 200, 250), S.start, 0, { c: DS.c("white"), w: DS.w.mid, parent: g }); if (t !== undefined) S.fadeIn(g, t, 0.35); return g; };

// ---------- the boat (local: 0,0 = boat centre on the waterline) ----------
// crew: { duck: "seat" | [dx, dy] (in the water), frog: ..., fish: "seat" }, row / wave / upAt for Pip
const boat = (S, bx, wy, k, o = {}) => {
  const P = grp(S, null, `translate(${bx} ${wy}) scale(${k})`), B = S.grp(P);
  loop(S, B, "transform", "translate(0 0) rotate(-0.8)", "translate(0 7) rotate(0.8)", 1.6);
  const C = {};
  if (o.pads) o.pads.forEach(([x, y]) => { sh(S, `M${x} ${y} L${x + 92} ${y - 9.6} A98 28 0 1 0 ${x + 92} ${y + 9.6} Z`, "grass", B, { w: "mid" }); });
  if (o.frog) { C.frog = frog(S, B, -300, -85, o.frogO); if (o.frog !== "seat") at(C.frog.g, ...o.frog); }
  C.pip = pip(S, B, -60, o);
  if (o.fish) { C.bowl = bowl(S, B, 150, -158, o.fishAt); C.fish = fish(S, B, 150, -160, 0.48, o.fishO); if (o.fish !== "seat") at(C.fish.g, ...o.fish); bowlFront(S, B, 150, -158, o.fishAt); }
  if (o.duck) { C.duck = duck(S, B, 275, -80, o.duckO); if (o.duck !== "seat") at(C.duck.g, ...o.duck); }
  if (o.fishSwim) C.swim = fish(S, B, 0, 0, 0.8, { look: -0.6 });
  sh(S, "M-412 -92 L432 -110 Q362 70 212 70 L-232 70 Q-372 62 -412 -92 Z", "red", B);
  S.draw("M-384 -66 L404 -82", S.start, 0, { c: DS.c("white"), w: DS.w.near * 2, parent: B });
  C.oars = oars(S, B, -60, o);
  return Object.assign(C, { P, B });
};
const bowlFront = (S, p, x, y, t) => { const g = S.grp(p); S.draw(circ(x, y, 66), S.start, 0, { c: DS.line(), w: DS.w.near, parent: g }); if (t !== undefined) S.fadeIn(g, t, 0.35); };

// ---------- the river set ----------
const tree = (S, p, x, gy, k, layer = "far") => { sh(S, rect(x - 12 * k, gy - 90 * k, 24 * k, 90 * k), "wood", p, { layer, w: DS.depth[layer].w }); [[-40, -120, 52], [40, -125, 50], [0, -170, 62]].forEach(([dx, dy, r]) => sh(S, circ(x + dx * k, gy + dy * k, r * k), "green", p, { layer, w: DS.depth[layer].w })); };
const cloud = (S, p, x, y, k) => { const g = S.grp(p); [[-60, 10, 48], [0, -12, 62], [62, 8, 46], [0, 22, 50]].forEach(([dx, dy, r]) => S.fill(circ(x + dx * k, y + dy * k, r * k), S.start, 0, DS.c("white"), 0.95, g)); tl.fromTo(g, { x: 0 }, { x: -50, duration: S.len, ease: "none" }, S.start); };
const house = (S, p, x, gy, k) => {
  sh(S, rect(x - 110 * k, gy - 150 * k, 220 * k, 150 * k), "wall", p, { layer: "mid", w: "mid" });
  sh(S, `M${x - 140 * k} ${gy - 140 * k} L${x} ${gy - 250 * k} L${x + 140 * k} ${gy - 140 * k} Z`, "orange", p, { layer: "mid", w: "mid" });
  sh(S, rrect(x - 30 * k, gy - 90 * k, 60 * k, 90 * k, DS.r.sm), "wood", p, { layer: "mid", w: "mid" });
  [-1, 1].forEach((s) => sh(S, rrect(x + s * 70 * k - 22 * k, gy - 120 * k, 44 * k, 40 * k, DS.r.xs), "sky", p, { layer: "mid", w: "detail" }));
};
const flower = (S, p, x, y, name = "pink") => { S.draw(`M${x} ${y} V${y + 40}`, S.start, 0, { c: DS.c("green", 2), w: DS.w.mid, parent: p }); [0, 72, 144, 216, 288].forEach((a) => sh(S, circ(x + Math.cos(rad(a)) * 14, y + Math.sin(rad(a)) * 14, 11), name, p, { w: "detail", flat: true })); sh(S, circ(x, y, 9), "yellow", p, { w: "detail", flat: true }); };
// o: { trees, drift, rainbow: t, house: [x, k], flowers: [t, [[x, y], ...]] }
const river = (S, o = {}) => {
  DS.outdoor(S, { hy: 470, sun: false });
  const g = S.grp(), [sx, sy] = o.sun || [1640, 150];
  S.fill(circ(sx, sy, 190), S.start, 0, DS.glow(DS.c("yellow", 1), 0.7), 1, g);
  sh(S, circ(sx, sy, 72), "yellow", g);
  face(S, g, sx, sy + 6, 72, "smile", 0);
  [[420, 140, 1], [1060, 95, 0.75]].forEach(([x, y, k]) => cloud(S, g, x, y, k));
  if (o.rainbow !== undefined) { const rb = S.grp(g); ["red", "orange", "yellow", "green", "blue"].forEach((n, i) => S.draw(arc(820, 610, 520 - i * 30, 180, 360), S.start, 0, { c: DS.c(n, 1), w: DS.w.near * 4.4, parent: rb, op: 0.8 })); S.fadeIn(rb, o.rainbow, 1.2); }
  const far = S.grp();
  (o.trees || [[150, 1], [420, 0.85], [760, 1.1], [1180, 0.9], [1480, 1.05], [1840, 0.9], [2150, 1]]).forEach(([x, k]) => tree(S, far, x, 590, k));
  if (o.house) { const hg = S.grp(far); house(S, hg, o.house[0], 596, o.house[1]); if (o.house[2]) S.fadeIn(hg, o.house[2], 0.8); }
  if (o.flowers) { const fg = S.grp(far); o.flowers[1].forEach(([x, y], i) => flower(S, fg, x, y, i % 2 ? "pink" : "white")); S.fadeIn(fg, o.flowers[0], 0.5); }
  if (o.drift !== 0) tl.fromTo(far, { x: 0 }, { x: -(o.drift || 70), duration: S.len, ease: "none" }, S.start);
  S.fill("M-200 596 H2120 V1280 H-200 Z", S.start, 0, DS.vgrad(DS.c("sky", 2, "mid"), DS.c("blue", 1)), 1);
  S.draw(smooth(Array.from({ length: 12 }, (_, i) => [-200 + i * 210, 598 + (i % 2 ? 5 : -4)])), S.start, 0, { c: DS.c("grass", 2, "mid"), w: DS.w.mid });
  const sp = S.grp(); [[300, 660, 140], [820, 700, 200], [1400, 650, 160], [1700, 730, 120], [520, 760, 180]].forEach(([x, y, w]) => S.draw(`M${x} ${y} H${x + w}`, S.start, 0, { c: DS.c("white"), w: DS.w.detail, parent: sp, op: 0.55 }));
  loop(S, sp, "transform", "translate(0 0)", "translate(-60 0)", 3.2);
};
// near water in front of the boat: covers the hull bottom (overlap = depth); ripples drift
const frontWater = (S, y) => {
  const w = S.grp(), pts = Array.from({ length: 26 }, (_, i) => [-400 + i * 120, y + (i % 2 ? 9 : -9)]);
  S.fill(smooth(pts) + " L2600 1280 L-400 1280 Z", S.start, 0, DS.vgrad(DS.c("blue", 1), DS.c("blue", 0)), 0.94, w);
  S.draw(smooth(pts), S.start, 0, { c: DS.c("white"), w: DS.w.mid, parent: w, op: 0.85 });
  loop(S, w, "transform", "translate(0 0)", "translate(-120 0)", 3.2);
};
const dock = (S, x, wy) => { const g = S.grp(); [x + 60, x + 300, x + 540].forEach((px) => sh(S, rect(px, wy - 70, 30, 140), "wood", g, { w: "mid" })); sh(S, rrect(x, wy - 100, 900, 40, DS.r.xs), "wood", g); return g; };

// ---------- little extras ----------
const butterfly = (S, x0, y0, x1, y1, t, name = "pink") => {
  const g = S.grp(), w = S.grp(g);
  [-1, 1].forEach((s) => { sh(S, circ(s * 22, -10, 22, 18), name, w, { w: "detail" }); sh(S, circ(s * 16, 14, 14, 12), name, w, { w: "detail" }); });
  S.draw("M0 -22 V24", S.start, 0, { c: INKC, w: DS.w.near, parent: g });
  loop(S, w, "transform", "scale(1 1)", "scale(0.35 1)", 0.45);
  tl.fromTo(g, { x: x0, y: y0, opacity: 0 }, { x: x1, y: y1, opacity: 1, duration: 2.4, ease: "sine.out" }, t);
  tl.to(g, { y: y1 - 30, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: Math.max(0, Math.floor((S.end - t - 2.4) / 1.4)) }, t + 2.4);
};
const note = (S, x, y, t) => {
  const g = S.grp();
  sh(S, circ(x, y, 20, 15), "navy", g, { w: "detail", flat: true });
  S.draw(`M${x + 18} ${y} V${y - 70} Q${x + 40} ${y - 52} ${x + 44} ${y - 34}`, S.start, 0, { c: DS.c("navy"), w: DS.w.near, parent: g });
  tl.fromTo(g, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "sine.out" }, t);
  tl.to(g, { y: -90, duration: 2.6, ease: "none" }, t + 0.5);
  tl.to(g, { opacity: 0, duration: 0.6 }, t + 2.5);
};
const sparkle = (S, x, y, r, t) => { const s = sh(S, star(x, y, r), "gold", S.g, { w: "detail" }); S.fadeIn(s, t, 0.4); loop(S, s, "transform", rot(-8, x, y), rot(8, x, y), 1.2, t); };
const heart = (S, x, y, t) => { const g = S.grp(); sh(S, heartPath(x, y, 1.3), "pink", g, { w: "detail" }); tl.fromTo(g, { opacity: 0, y: 20 }, { opacity: 1, y: -60, duration: 2, ease: "sine.out" }, t); };
const balloon = (S, x, name, t) => { const g = S.grp(); S.draw(`M${x} 1160 Q${x - 20} 1230 ${x + 6} 1300`, S.start, 0, { c: DS.line(), w: DS.w.detail, parent: g }); sh(S, circ(x, 1100, 52, 62), name, g); tl.fromTo(g, { y: 0 }, { y: -900, duration: 6, ease: "sine.out" }, t); return g; };
const num = (S, n, x, y, t) => DS.card(S, n, x, y, { size: DS.type.display, t });

// ---------- scenes ----------
// THUMB A: the full boat (4 friends), big and bright. Words: ROW YOUR BOAT
const S = scene(0, 1, { cam: "none" });
river(S, { drift: 0, sun: [1800, 140], trees: [[120, 1.2], [520, 1], [1000, 1.2], [1400, 1]] });
boat(S, 900, 930, 1.75, { duck: "seat", frog: "seat", fish: "seat", look: 0.2 });
frontWater(S, 930 + 18 * 1.75);
S.text("ROW YOUR BOAT", 940, 185, { size: 172, c: DS.P.yellow[0], halo: INKC, haloW: 0.1 });
