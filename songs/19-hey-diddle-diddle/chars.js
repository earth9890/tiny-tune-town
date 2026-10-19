// look: still
// Song 19 characters, props and the moonlit hill, shared by scenes.js and the thumbnails (pasted in by `// @include chars.js`).
// The classic's cast: the moon (friendly face), the cat with her fiddle, the cow, the little dog, the dish and the spoon.
// ---------- kawaii face bits ----------
const dot = (S, d, color, g, op = 1) => S.fill(d, S.start, 0, color, op, g);
const sh = (S, d, name, g, o = {}) => DS.shape(S, d, name, Object.assign({ t: S.start, parent: g }, o));
const eyes = (S, g, dx, y, r, look = 0) => [-1, 1].forEach((s) => {
  dot(S, circ(s * dx + look, y, r * 0.82, r), DS.P.ink[0], g);
  dot(S, circ(s * dx + look - r * 0.28, y - r * 0.38, r * 0.34), DS.P.white[0], g);
  dot(S, circ(s * dx + look + r * 0.26, y + r * 0.4, r * 0.15), DS.P.white[0], g);
});
const cheeks = (S, g, dx, y, r) => [-1, 1].forEach((s) => dot(S, circ(s * dx, y, r, r * 0.62), DS.c("pink"), g, 0.65));
// a smile and an open "sing / laugh" mouth; returns { open(t0, t1) }
const mouths = (S, g, y, w, isOpen) => {
  const smile = S.draw(`M${-w} ${y} Q0 ${y + w} ${w} ${y}`, S.start, 0, { c: DS.line(), w: DS.w.mid, parent: g });
  const open = G(S, g); open.setAttribute("opacity", 0);
  S.draw(`M${-w} ${y} Q0 ${y + w * 2} ${w} ${y} Z`, S.start, 0, { c: DS.line(), w: DS.w.mid, fill: DS.c("red", 2), parent: open });
  dot(S, circ(0, y + w * 0.75, w * 0.45, w * 0.22), DS.c("pink", 1), open);
  if (isOpen) { open.setAttribute("opacity", 1); smile.setAttribute("opacity", 0); }
  return { open: (t0, t1) => { tl.set(open, { opacity: 1 }, t0); tl.set(smile, { opacity: 0 }, t0); tl.set(open, { opacity: 0 }, t1); tl.set(smile, { opacity: 1 }, t1); } };
};

// every animal: pos (place + scale) > bob (hops) > rock (wiggles about the feet) > parts. Origin = ground centre.
const rig = (S, x, gy, k, wShadow, o = {}) => {
  const sd = o.shadow === false ? null : DS.shadow(S, x, gy, wShadow * k);
  const pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, pos, "translate(0 0)"), rock = G(S, bob, "rotate(0 0 0)");
  if (o.t !== undefined && o.t > S.start + 0.05) { fadeIn(S, pos, o.t); if (sd) fadeIn(S, sd, o.t); }
  const A = { pos, bob, rock, g: rock, k, x, gy, sd };
  A.hop = (t0, h = 40, dur = 0.5) => tw(bob, t0, dur, "translate(0 0)", `translate(0 ${-h})`, hump(1));
  A.bounce = (t0, t1, h = 10) => tw(bob, t0, t1 - t0, "translate(0 0)", `translate(0 ${-h})`, hump(cyc(t1 - t0, 2 * BEAT)));
  A.sway = (t0, t1, deg = 5) => tw(rock, t0, t1 - t0, "rotate(0 0 0)", `rotate(${deg} 0 0)`, wave(cyc(t1 - t0, 2 * BEAT)));
  return A;
};
// a big arc from where A stands to (x1, gy1), passing over (overX, apexY) (feet height at the top). The shadow fades out and
// a new one fades in where it lands. ponytail: x eases as p^a so the top of the arc lands right over the moon.
const jump = (S, A, t, dur, x1, gy1, overX, apexY) => {
  const f = Math.min(0.9, Math.max(0.1, (overX - A.x) / (x1 - A.x))), a = Math.log(f) / Math.log(0.5);
  tl.fromTo(A.pos, { attr: { transform: `translate(${A.x} ${A.gy}) scale(${A.k})` } },
    { attr: { transform: `translate(${x1} ${gy1}) scale(${A.k})` }, duration: dur, ease: (p) => p ** a, immediateRender: false }, t);
  const H = (A.gy + f * (gy1 - A.gy) - apexY) / A.k;
  tw(A.bob, t, dur, "translate(0 0)", `translate(0 ${-H})`, hump(1));
  tw(A.rock, t, dur, "rotate(0 0 0)", `rotate(${x1 > A.x ? 14 : -14} 0 -150)`, hump(1));
  if (A.sd) S.fadeOut(A.sd, t, 0.3);
  const nsd = DS.shadow(S, x1, gy1, 300 * A.k); nsd.setAttribute("opacity", 0);
  tl.fromTo(nsd, { opacity: 0 }, { opacity: 0.22, duration: 0.3, immediateRender: false }, t + dur - 0.3);
  A.x = x1; A.gy = gy1; A.sd = nsd;
};

// ---------- the moon: a big round friendly face with a soft glow ----------
const moon = (S, x, y, r, o = {}) => {
  const glow = S.fill(circ(x, y, r * 2.2), S.start, 0, DS.glow(DS.P.yellow[1], 0.55), 1), g = G(S, null, `translate(${x} ${y})`);
  sh(S, circ(0, 0, r), "yellow", g, { tone: 1 });
  [[-0.45, -0.45, 0.17], [0.5, -0.35, 0.11], [0.5, 0.45, 0.13], [-0.55, 0.35, 0.09]].forEach(([dx, dy, rr]) => dot(S, circ(dx * r, dy * r, rr * r), DS.c("yellow", 0), g, 0.6));
  const s = r / 100;
  [-1, 1].forEach((d) => { dot(S, circ(d * 32 * s, -12 * s, 11 * s, 14 * s), DS.P.ink[0], g); dot(S, circ(d * 32 * s - 3 * s, -17 * s, 4.5 * s), DS.P.white[0], g); });
  cheeks(S, g, 56 * s, 16 * s, 13 * s);
  const M = mouths(S, g, 20 * s, 22 * s, o.open);
  if (o.t !== undefined && o.t > S.start + 0.05) { fadeIn(S, g, o.t); fadeIn(S, glow, o.t); }
  return { g, glow, x, y, r, open: M.open };
};
const skyStars = (S, list) => list.forEach(([x, y, r], i) => {
  const P = Array.from({ length: 10 }, (_, j) => { const a = -Math.PI / 2 + (j * Math.PI) / 5, rr = j % 2 ? r * 0.45 : r; return [x + Math.cos(a) * rr, y + Math.sin(a) * rr]; });
  const p = S.fill(poly(P) + " Z", S.start, 0, DS.c("yellow", 1), 0.95);
  if (i % 3 === 0) tl.fromTo(p, { opacity: 0.95 }, { opacity: 0.55, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: Math.max(1, 2 * Math.floor(S.len / 4.8) - 1), immediateRender: false }, S.start + (i % 5) * 0.5);
});

// ---------- the cow: white with brown patches, pink snout, little horns, a bell. ~490 tall at k = 1 ----------
const cow = (S, x, gy, k = 1, o = {}) => {
  const A = rig(S, x, gy, k, 420, o), g = A.g;
  [-125, -45, 45, 125].forEach((lx) => { sh(S, rrect(lx - 30, -120, 60, 120, DS.r.md), "white", g); sh(S, rrect(lx - 30, -36, 60, 36, DS.r.sm), "brown", g, { flat: true }); });
  S.draw("M175 -210 Q235 -190 228 -120", S.start, 0, { c: DS.line(), w: DS.w.near, parent: g });
  sh(S, circ(228, -112, 16, 22), "brown", g, { w: "mid" });
  sh(S, circ(0, -205, 190, 140), "white", g);
  dot(S, circ(-105, -235, 48, 38), DS.c("brown", 1), g); dot(S, circ(110, -170, 40, 32), DS.c("brown", 1), g); dot(S, circ(30, -120, 30, 22), DS.c("brown", 1), g);
  [-1, 1].forEach((s) => sh(S, `M${s * 50} -425 Q${s * 62} -495 ${s * 110} -490 Q${s * 88} -462 ${s * 85} -418 Z`, "sand", g, { w: "mid" })); // horns
  [-1, 1].forEach((s) => { sh(S, circ(s * 140, -385, 58, 26), "white", g); dot(S, circ(s * 148, -385, 34, 13), DS.c("pink"), g, 0.8); });
  sh(S, circ(0, -365, 118, 102), "white", g);
  dot(S, circ(-58, -418, 34, 26), DS.c("brown", 1), g);
  eyes(S, g, 46, -388, 19, o.look || 0);
  sh(S, circ(0, -298, 88, 54), "pink", g);
  [-1, 1].forEach((s) => dot(S, circ(s * 30, -308, 10, 13), DS.c("pink", 2), g));
  A.say = mouths(S, g, -282, 22, o.open).open;
  sh(S, circ(0, -238, 24), "yellow", g, { w: "mid" });                                   // bell
  return A;
};

// ---------- the cat: orange, round, stands on two feet, fiddle under the chin, bow in the right paw. ~400 tall at k = 1 ----------
const cat = (S, x, gy, k = 1, o = {}) => {
  const A = rig(S, x, gy, k, 280, o), g = A.g;
  S.draw("M70 -60 C150 -70 170 -150 130 -200 C110 -225 150 -250 165 -230", S.start, 0, { c: DS.c("orange", 2), w: DS.w.near * 2.4, parent: g }); // tail
  [-1, 1].forEach((s) => sh(S, circ(s * 42, -14, 40, 18), "orange", g));
  sh(S, circ(0, -110, 92, 98), "orange", g);
  dot(S, circ(0, -96, 52, 62), DS.c("white"), g, 0.85);
  [-1, 1].forEach((s) => sh(S, `M${s * 30} -318 L${s * 80} -392 L${s * 100} -300 Z`, "orange", g));                         // ears
  [-1, 1].forEach((s) => dot(S, `M${s * 50} -326 L${s * 78} -370 L${s * 88} -318 Z`, DS.c("pink", 1), g));
  sh(S, circ(0, -258, 112, 92), "orange", g);
  [[-40, -330], [0, -338], [40, -330]].forEach(([sx, sy]) => S.draw(`M${sx} ${sy} L${sx * 0.8} ${sy + 34}`, S.start, 0, { c: DS.c("orange", 2), w: DS.w.mid, parent: g }));
  eyes(S, g, 42, -270, 18, o.look || 0);
  cheeks(S, g, 72, -226, 16);
  dot(S, `M-10 -240 L10 -240 L0 -228 Z`, DS.c("pink", 2), g);
  [-1, 1].forEach((s) => S.draw(`M${s * 60} -232 L${s * 128} -244 M${s * 60} -222 L${s * 128} -216`, S.start, 0, { c: DS.line(), w: DS.w.hair, parent: g }));
  A.say = mouths(S, g, -214, 18, o.open).open;
  if (o.fiddle !== false) {
    // fiddle held across the chest, scroll to the left, body under the chin on the right
    const f = G(S, g, "rotate(-18 0 -150)");
    sh(S, rrect(-150, -162, 150, 18, DS.r.xs), "brown", f, { w: "mid" });                                              // neck
    sh(S, circ(-158, -153, 16), "brown", f, { w: "mid" });                                                             // scroll
    sh(S, "M0 -200 C30 -210 50 -190 46 -170 C60 -160 60 -140 46 -132 C50 -112 30 -96 0 -106 C-30 -96 -28 -120 -20 -132 C-30 -140 -30 -164 -20 -172 C-28 -190 -30 -210 0 -200 Z", "orange", f, { tone: 2 }); // body
    S.draw("M14 -178 Q22 -170 14 -160 M14 -146 Q22 -136 14 -128", S.start, 0, { c: DS.line(), w: DS.w.detail, parent: f });
    S.draw("M-150 -153 L40 -153", S.start, 0, { c: DS.c("yellow", 1), w: DS.w.hair, parent: f });
    [-1, 1].forEach((s) => sh(S, circ(s === -1 ? -96 : 10, -150, 24), "orange", f, { w: "mid" }));                 // paws
    A.bow = G(S, g, "rotate(0 80 -110)");
    sh(S, cap(80, -110, -40, -230, 6), "wood", A.bow, { w: "detail" });
    sh(S, circ(80, -110, 22), "orange", A.bow, { w: "mid" });
  }
  A.play = (t0, t1) => { if (A.bow) tw(A.bow, t0, t1 - t0, "rotate(0 80 -110)", "rotate(22 80 -110)", wave(cyc(t1 - t0, BEAT))); A.sway(t0, t1, 4); };
  return A;
};

// ---------- the little dog: sandy puppy, brown floppy ears and patch, sits up. ~330 tall at k = 1 ----------
const dog = (S, x, gy, k = 1, o = {}) => {
  const A = rig(S, x, gy, k, 280, o), g = A.g;
  A.tail = G(S, g, "rotate(0 70 -70)");
  sh(S, cap(70, -70, 140, -150, 16), "sand", A.tail, { w: "mid" });
  [-1, 1].forEach((s) => sh(S, circ(s * 46, -16, 42, 20), "sand", g));
  sh(S, circ(0, -100, 86, 90), "sand", g);
  dot(S, circ(0, -86, 46, 52), DS.P.white[0], g, 0.7);
  sh(S, circ(0, -246, 106, 92), "sand", g);
  dot(S, circ(42, -268, 36, 30), DS.c("wood", 1), g, 0.9);                                                               // eye patch
  [-1, 1].forEach((s) => sh(S, `M${s * 76} -320 C${s * 140} -330 ${s * 150} -250 ${s * 118} -196 C${s * 96} -210 ${s * 84} -260 ${s * 76} -320 Z`, "wood", g)); // ears
  eyes(S, g, 40, -262, 17, o.look || 0);
  cheeks(S, g, 66, -214, 15);
  sh(S, circ(0, -222, 22, 15), "ink", g, { w: "detail" });
  A.say = mouths(S, g, -200, 20, o.open).open;
  A.laugh = (t0, t1) => { A.say(t0, t1); tw(A.rock, t0, t1 - t0, "rotate(0 0 0)", "rotate(6 0 0)", wave(cyc(t1 - t0, BEAT))); tw(A.tail, t0, t1 - t0, "rotate(0 70 -70)", "rotate(-24 70 -70)", wave(cyc(t1 - t0, BEAT / 2))); };
  return A;
};

// ---------- the dish and the spoon: a round blue-rimmed plate and a silver spoon, little legs, holding hands ----------
const legs = (S, g, x, y, c) => [-1, 1].forEach((s) => { S.draw(`M${x + s * 16} ${y} L${x + s * 22} ${y + 54}`, S.start, 0, { c: DS.line(), w: DS.w.near, parent: g }); sh(S, circ(x + s * 28, y + 58, 18, 10), c, g, { w: "mid" }); });
const dish = (S, x, gy, k = 1, o = {}) => {
  const A = rig(S, x, gy, k, 220, o), g = A.g;
  legs(S, g, 0, -62, "sky");
  S.draw("M70 -160 Q110 -150 128 -120", S.start, 0, { c: DS.line(), w: DS.w.near, parent: g });                     // arm to the spoon
  sh(S, circ(0, -170, 112), "white", g);
  S.draw(circ(0, -170, 96), S.start, 0, { c: DS.c("blue", 1), w: DS.w.near * 1.6, parent: g });
  S.draw(circ(0, -170, 78), S.start, 0, { c: DS.c("blue", 1), w: DS.w.hair, parent: g });
  eyes(S, g, 28, -186, 14, o.look || 0);
  cheeks(S, g, 50, -150, 11);
  A.say = mouths(S, g, -146, 16, o.open).open;
  return A;
};
const spoon = (S, x, gy, k = 1, o = {}) => {
  const A = rig(S, x, gy, k, 160, o), g = A.g;
  legs(S, g, 0, -62, "gray");
  S.draw("M-50 -150 Q-90 -140 -112 -118", S.start, 0, { c: DS.line(), w: DS.w.near, parent: g });
  sh(S, rrect(-14, -150, 28, 100, DS.r.sm), "gray", g, { w: "mid" });                                                  // handle (short; the bowl is the face)
  sh(S, circ(0, -230, 62, 84), "gray", g);
  dot(S, circ(-20, -262, 18, 30), DS.P.white[0], g, 0.55);
  eyes(S, g, 22, -240, 12, o.look || 0);
  cheeks(S, g, 38, -208, 9);
  A.say = mouths(S, g, -204, 13, o.open).open;
  return A;
};
// the pair runs off together: little steps (bob) while they move to (x1, gy1) and shrink to k1
const runAway = (S, D, Sp, t, dur, dx, gy1, k1) => [D, Sp].forEach((A) => {
  tw(A.pos, t, dur, `translate(${A.x} ${A.gy}) scale(${A.k})`, `translate(${A.x + dx} ${gy1}) scale(${k1})`, "power1.in");
  tw(A.bob, t, dur, "translate(0 0)", "translate(0 -22)", hump(cyc(dur, BEAT / 2)));
  if (A.sd) S.fadeOut(A.sd, t, 0.4);
});

// ---------- the moonlit hill ----------
const stump = (S, x, gy, k = 1) => {
  DS.shadow(S, x, gy, 260 * k);
  sh(S, `M${x - 110 * k} ${gy} L${x - 92 * k} ${gy - 120 * k} L${x + 92 * k} ${gy - 120 * k} L${x + 110 * k} ${gy} Z`, "wood", null);
  sh(S, circ(x, gy - 120 * k, 92 * k, 26 * k), "earth", null, { tone: 1 });
  S.draw(circ(x, gy - 120 * k, 50 * k, 13 * k), S.start, 0, { c: DS.c("wood", 2), w: DS.w.hair });
  return gy - 120 * k;                                                                                                   // seat height
};
const bush = (S, x, gy, k = 1, layer = "mid") => { DS.shadow(S, x, gy, 260 * k); [[-80, -60, 70], [80, -60, 72], [-30, -115, 78], [44, -110, 70], [0, -50, 80]].forEach(([dx, dy, r]) => sh(S, circ(x + dx * k, gy + dy * k, r * k), "grass", null, { layer, tone: 2 })); };
const flowers = (S, pts) => pts.forEach(([x, y, c]) => { S.draw(`M${x} ${y} L${x} ${y + 40}`, S.start, 0, { c: DS.c("green", 2), w: DS.w.mid }); [0, 1, 2, 3, 4].forEach((i) => S.fill(circ(x + 16 * Math.cos(i * 1.257), y + 16 * Math.sin(i * 1.257), 12), S.start, 0, DS.c(c), 1)); S.fill(circ(x, y, 9), S.start, 0, DS.c("yellow"), 1); });
const STARS = [[120, 110, 14], [330, 210, 10], [520, 90, 16], [760, 170, 11], [930, 70, 13], [1460, 90, 12], [1640, 200, 16], [1820, 100, 11], [1720, 360, 9], [250, 380, 9], [640, 330, 8], [1530, 300, 8]];
// deep-blue night sky, stars, soft green hills; faces stay bright (characters are drawn after the set)
const hill = (S, o = {}) => {
  const O = DS.outdoor(S, { hy: o.hy || 690, sky: "night", sun: false, hills: "grass", ground: "grass" });
  skyStars(S, o.stars || STARS);
  return O;
};
