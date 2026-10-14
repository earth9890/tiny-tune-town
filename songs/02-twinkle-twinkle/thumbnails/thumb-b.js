// look: still
// generated: helpers copied from ../scenes.js (build.py --thumb takes one file)
// ---------- helpers ----------
let GID = 0;
const grad3 = (a, b, c) => { const id = "tt-g" + ++GID, g = el("linearGradient", { id, x1: 0, y1: 0, x2: 0, y2: 1 }, dsDefs()); [[0, a], [0.6, b], [1, c]].forEach(([o, col]) => el("stop", { offset: o, "stop-color": col }, g)); return `url(#${id})`; };
const appear = (S, g, t) => { if (t > S.start + 0.05) tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.out" }, t); return g; };
const rot = (a, x, y) => `rotate(${f1(a)} ${f1(x)} ${f1(y)})`;
const sclT = (k, x, y) => `translate(${f1(x)} ${f1(y)}) scale(${k}) translate(${f1(-x)} ${f1(-y)})`;
const plays = (len, per) => { const n = Math.floor(len / per); return n < 1 ? -1 : n % 2 ? n : n - 1; }; // odd repeat count: a yoyo ends where it started
const yoyo = (e, t0, t1, from, to, per) => { const r = plays(t1 - t0, per); if (r > 0) tl.fromTo(e, { attr: { transform: from } }, { attr: { transform: to }, duration: per, ease: "sine.inOut", yoyo: true, repeat: r, immediateRender: false }, t0); };
const glint = (e, t0, t1, lo = 0.4, per = 1.8) => { const r = plays(t1 - t0, per); if (r > 0) tl.fromTo(e, { opacity: 1 }, { opacity: lo, duration: per, ease: "sine.inOut", yoyo: true, repeat: r, immediateRender: false }, t0); };
const blink = (S, eg, ey) => { for (let tb = S.start + 1.5 + rnd() * 2; tb < S.end - 0.4; tb += 3 + rnd() * 2) tl.fromTo(eg, { attr: { transform: sclT(1, 0, ey).replace("scale(1)", "scale(1 1)") } }, { attr: { transform: `translate(0 ${f1(ey)}) scale(1 0.1) translate(0 ${f1(-ey)})` }, duration: 0.08, ease: "none", yoyo: true, repeat: 1, immediateRender: false }, tb); };
// rounded 5-point star (chunky, soft corners) and a 4-point sparkle
const starD = (cx, cy, R, ri = 0.56) => {
  const P = []; for (let i = 0; i < 10; i++) { const a = ((-90 + i * 36) * Math.PI) / 180, r = i % 2 ? R * ri : R; P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  const m = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  return P.map((p, i) => { const a = m(p, P[(i + 9) % 10], 0.24), b = m(p, P[(i + 1) % 10], 0.24); return `${i ? "L" : "M"}${f1(a[0])} ${f1(a[1])} Q${f1(p[0])} ${f1(p[1])} ${f1(b[0])} ${f1(b[1])}`; }).join(" ") + " Z";
};
const sparkD = (cx, cy, r) => `M${f1(cx)} ${f1(cy - r)} Q${f1(cx)} ${f1(cy)} ${f1(cx + r)} ${f1(cy)} Q${f1(cx)} ${f1(cy)} ${f1(cx)} ${f1(cy + r)} Q${f1(cx)} ${f1(cy)} ${f1(cx - r)} ${f1(cy)} Q${f1(cx)} ${f1(cy)} ${f1(cx)} ${f1(cy - r)} Z`;
const spark = (S, x, y, r, t, parent, op = 0.95) => { const g = el("g", {}, parent || S.g); const p = S.fill(sparkD(x, y, r), S.start, 0, DS.P.yellow[1], op, g); appear(S, g, t); glint(p, Math.max(t, S.start) + rnd(), S.end, 0.45, 1.6 + rnd()); return g; };

// ---------- sets ----------
const NIGHT = (hy) => ({ hy, sky: "night", sun: false, hills: "green", ground: "grass" });
// soft night sky over DS.outdoor's hills, plus a field of tiny stars (a third of them twinkle slowly)
const night = (S, O, o = {}) => {
  O.g.firstChild.setAttribute("fill", grad3(o.top || DS.P.night[1], o.mid || DS.P.purple[1], o.low || DS.P.pink[1]));
  const sg = el("g", {}, O.g); O.g.insertBefore(sg, O.g.childNodes[1]); // stars sit behind the hills
  for (let i = 0; i < (o.n ?? 24); i++) { const x = 110 + rnd() * 1700, y = 70 + rnd() * (Math.min(O.hy, 1000) - 300), r = 6 + rnd() * 8, p = S.fill(sparkD(x, y, r), S.start, 0, DS.P.yellow[1], 0.85, sg); if (i % 3 === 0) glint(p, S.start + rnd() * 1.5, S.end, 0.35, 1.8 + rnd()); }
  return O;
};
const behind = (O) => { const g = el("g", {}, O.g); O.g.insertBefore(g, O.g.childNodes[2]); return g; }; // between the sky and the hills
const bush = (S, x, y, r) => { const g = S.grp(); [[-0.75, 0.2, 0.75], [0, -0.2, 1], [0.8, 0.15, 0.8]].forEach(([dx, dy, k]) => DS.shape(S, circ(x + dx * r, y + dy * r, r * k), "green", { parent: g })); return g; };
const tree = (S, x, y, k, a, layer = "mid") => { const g = el("g", { transform: rot(a, x, y) }, S.g); DS.shape(S, rrect(x - 12 * k, y - 120 * k, 24 * k, 124 * k, DS.r.xs), "wood", { parent: g, layer }); DS.shape(S, circ(x, y - 160 * k, 70 * k, 64 * k), "green", { parent: g, layer }); return g; };
const house = (S, x, gy, k = 1, layer = "near") => {
  const g = S.grp(); DS.shadow(S, x, gy, 360 * k, { parent: g });
  DS.shape(S, rrect(x - 150 * k, gy - 240 * k, 300 * k, 240 * k, DS.r.sm), "wall", { parent: g, layer });
  DS.shape(S, `M${f1(x - 190 * k)} ${f1(gy - 220 * k)} L${f1(x)} ${f1(gy - 390 * k)} L${f1(x + 190 * k)} ${f1(gy - 220 * k)} Z`, "pink", { parent: g, layer });
  S.fill(circ(x - 65 * k, gy - 140 * k, 90 * k), S.start, 0, DS.glow(DS.P.yellow[1], 0.6), 1, g);
  DS.shape(S, rrect(x - 110 * k, gy - 180 * k, 90 * k, 80 * k, DS.r.xs), "yellow", { parent: g, layer, w: "detail" });
  DS.shape(S, rrect(x + 30 * k, gy - 150 * k, 80 * k, 150 * k, DS.r.sm), "wood", { parent: g, layer, w: "detail" });
  return g;
};
// puffy cloud: outlined puffs, then fill-only puffs on top hide the inner outlines
const cloud = (S, cx, cy, w) => { const g = S.grp(), P = [[-0.36, 0.05, 0.2], [-0.15, -0.12, 0.26], [0.12, -0.15, 0.28], [0.34, 0.02, 0.21], [0, 0.08, 0.3]];
  P.forEach(([dx, dy, r]) => DS.shape(S, circ(cx + dx * w, cy + dy * w, r * w, r * w * 0.8), "white", { parent: g, flat: true }));
  P.forEach(([dx, dy, r]) => S.fill(circ(cx + dx * w, cy + dy * w, r * w - 6, r * w * 0.8 - 6), S.start, 0, DS.c("white"), 1, g)); return g; };
// thought bubble with a big "?" (wonder)
const wonder = (S, x, y, t, [tx, ty]) => { const g = S.grp(); [[0.45, 16], [0.75, 11]].forEach(([f, r]) => DS.shape(S, circ(x + (tx - x) * f, y + (ty - y) * f, r), "white", { parent: g, w: "detail", flat: true }));
  DS.shape(S, circ(x, y, 80, 72), "white", { parent: g, w: "detail", flat: true }); S.text("?", x, y + 30, { size: DS.type.title, c: DS.c("purple", 2), parent: g }); appear(S, g, t); return g; };

// ---------- faces (shared by stars and the sun): units of R ----------
const kidFace = (S, fg, cx, cy, R, m, look) => {
  const ink = DS.c("ink"), eg = el("g", {}, fg), ey = cy - 0.06 * R, my = cy + 0.24 * R;
  [-1, 1].forEach((s) => {
    const x = cx + s * 0.3 * R;
    if (m === "sleep" || (m === "wink" && s < 0)) return S.draw(arc(x, ey - 0.04 * R, 0.12 * R, 20, 160), S.start, 0, { parent: fg, c: ink, w: DS.w.mid });
    if (m === "happy") return S.draw(arc(x, ey + 0.07 * R, 0.12 * R, 200, 340), S.start, 0, { parent: fg, c: ink, w: DS.w.mid });
    const wr = m === "wow" ? 1.15 : 1;
    S.draw(circ(x, ey, 0.13 * R * wr, 0.16 * R * wr), S.start, 0, { parent: eg, c: ink, w: DS.w.detail, fill: DS.P.white[0] });
    const px = x + look[0] * 0.045 * R, py = ey + look[1] * 0.06 * R;
    S.fill(circ(px, py, 0.08 * R, 0.095 * R), S.start, 0, ink, 1, eg);
    S.fill(circ(px - 0.03 * R, py - 0.035 * R, 0.028 * R), S.start, 0, DS.P.white[0], 1, eg);
  });
  [-1, 1].forEach((s) => S.fill(circ(cx + s * 0.42 * R, cy + 0.13 * R, 0.1 * R, 0.065 * R), S.start, 0, DS.c("pink"), 0.85, fg));
  if (m === "wow") S.draw(circ(cx, my + 0.04 * R, 0.07 * R, 0.09 * R), S.start, 0, { parent: fg, c: ink, w: DS.w.detail, fill: DS.c("red", 2) });
  else if (m === "happy" || m === "wink") S.draw(`M${f1(cx - 0.17 * R)} ${f1(my - 0.03 * R)} Q${f1(cx)} ${f1(my + 0.26 * R)} ${f1(cx + 0.17 * R)} ${f1(my - 0.03 * R)} Z`, S.start, 0, { parent: fg, c: ink, w: DS.w.detail, fill: DS.c("red", 2) });
  else S.draw(smooth([[cx - 0.15 * R, my], [cx, my + 0.1 * R], [cx + 0.15 * R, my]]), S.start, 0, { parent: fg, c: ink, w: DS.w.mid });
  return { eg, ey };
};
// mood switcher: one face group per mood, crossfaded (0.25 s) on its word
const moods = (S, host, m0, draw) => { const faces = {}; let cur = m0;
  const mk = (m) => { if (!faces[m]) { const fg = el("g", {}, host), f = draw(fg, m); if (f.eg) blink(S, f.eg, f.ey); if (m !== m0) gsap.set(fg, { opacity: 0 }); faces[m] = fg; } return faces[m]; };
  mk(m0); return (t, m) => { if (m === cur) return; const a = faces[cur], b = mk(m); tl.to(a, { opacity: 0, duration: 0.25 }, t); tl.to(b, { opacity: 1, duration: 0.25 }, t); cur = m; }; };

// ---------- characters ----------
// Twinkle (and friends): round star with a face, slow breathing pulse + soft glow. g: appear, mv: moves, wg: wiggle, gi: pulse
function star(S, cx, cy, R, o = {}) {
  const g = S.grp(o.parent), mv = el("g", {}, g), wg = el("g", {}, mv), gi = el("g", {}, wg);
  const glow = S.fill(circ(cx, cy, R * 2.1), S.start, 0, DS.glow(DS.P.yellow[1], 0.6), 1, gi);
  DS.shape(S, starD(cx, cy, R), o.name || "yellow", { parent: gi, layer: o.layer || "near" });
  const mood = moods(S, el("g", {}, gi), o.mood || "smile", (fg, m) => kidFace(S, fg, cx, cy, R, m, o.look || [0, 0]));
  yoyo(gi, S.start, S.end, sclT(1, cx, cy), sclT(1.05, cx, cy), 1.3);
  if (o.dim) { gsap.set(gi, { opacity: 0.45 }); gsap.set(glow, { opacity: 0 }); tl.to(gi, { opacity: 1, duration: 0.8 }, o.dim); tl.to(glow, { opacity: 1, duration: 0.8 }, o.dim); }
  appear(S, g, o.t ?? S.start);
  const hello = (t0, t1) => yoyo(wg, t0, t1, rot(-9, cx, cy + R), rot(9, cx, cy + R), 0.45);
  return { g, mv, gi, glow, mood, hello, cx, cy, R };
}
// six sparkles pop around a star, one after another (on "sky")
const burst = (S, T, t, n = 6) => { for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 - 0.3; spark(S, T.cx + Math.cos(a) * T.R * 1.75, T.cy + Math.sin(a) * T.R * 1.6, 16 + (i % 2) * 8, t + i * 0.09); } };
// the sun: yellow disc, chunky orange ray dots, the same friendly face
const sunC = (S, cx, cy, R, o = {}) => {
  const g = S.grp(o.parent); S.fill(circ(cx, cy, R * 2), S.start, 0, DS.glow(DS.P.orange[1], 0.55), 1, g);
  for (let i = 0; i < 10; i++) { const a = (i * 36 * Math.PI) / 180; DS.shape(S, circ(cx + Math.cos(a) * R * 1.35, cy + Math.sin(a) * R * 1.35, R * 0.15), "orange", { parent: g, w: "detail" }); }
  DS.shape(S, circ(cx, cy, R), "yellow", { parent: g });
  return { g, mood: moods(S, el("g", {}, g), o.mood || "smile", (fg, m) => kidFace(S, fg, cx, cy + 0.05 * R, R * 1.15, m, [0, 0])) };
};

// Pip: chunky round bunny, ~520 px tall at k = 1, feet on gy. Arms are angles A in degrees: 0 hangs down, 90 out, 160 up high,
// 195 paws over the eyes, negative = inwards (clap). o: { k, mood, look:[dx,dy], arms:[A,A], layer, shadow }
const pipFace = (S, fg, x, fy, k, m, look) => {
  const ink = DS.c("ink"), eg = el("g", {}, fg), my = fy + 50 * k;
  [-1, 1].forEach((s) => {
    const ex = x + s * 42 * k;
    if (m === "sleep" || m === "yawn") return S.draw(arc(ex, fy - 4 * k, 20 * k, 20, 160), S.start, 0, { parent: fg, c: ink, w: DS.w.mid });
    if (m === "happy") return S.draw(arc(ex, fy + 10 * k, 20 * k, 200, 340), S.start, 0, { parent: fg, c: ink, w: DS.w.mid });
    S.draw(circ(ex, fy, 25 * k, 30 * k), S.start, 0, { parent: eg, c: ink, w: DS.w.detail, fill: DS.P.white[0] });
    const px = ex + look[0] * 8 * k, py = fy + look[1] * 11 * k + (m === "sleepy" ? 9 * k : 0);
    S.fill(circ(px, py, 15 * k, 17 * k), S.start, 0, ink, 1, eg);
    S.fill(circ(px - 5 * k, py - 6 * k, 5 * k), S.start, 0, DS.P.white[0], 1, eg);
    if (m === "sleepy") S.draw(`M${f1(ex - 26 * k)} ${f1(fy + 2 * k)} A${f1(26 * k)} ${f1(31 * k)} 0 0 1 ${f1(ex + 26 * k)} ${f1(fy + 2 * k)} Z`, S.start, 0, { parent: eg, c: ink, w: DS.w.detail, fill: DS.P.paper[0] }); // heavy lids
  });
  [-1, 1].forEach((s) => S.fill(circ(x + s * 74 * k, fy + 34 * k, 17 * k, 11 * k), S.start, 0, DS.c("pink"), 0.8, fg));
  S.fill(circ(x, my - 14 * k, 11 * k, 8 * k), S.start, 0, DS.c("pink", 2), 1, fg); // nose
  if (m === "yawn") S.draw(circ(x, my + 16 * k, 16 * k, 23 * k), S.start, 0, { parent: fg, c: ink, w: DS.w.detail, fill: DS.c("red", 2) });
  else if (m === "wow") S.draw(circ(x, my + 8 * k, 9 * k, 11 * k), S.start, 0, { parent: fg, c: ink, w: DS.w.detail, fill: DS.c("red", 2) });
  else if (m === "happy") S.draw(`M${f1(x - 24 * k)} ${f1(my - 2 * k)} Q${f1(x)} ${f1(my + 36 * k)} ${f1(x + 24 * k)} ${f1(my - 2 * k)} Z`, S.start, 0, { parent: fg, c: ink, w: DS.w.detail, fill: DS.c("red", 2) });
  else S.draw(smooth([[x - 22 * k, my - 2 * k], [x - 11 * k, my + 8 * k], [x, my - 1 * k]]) + " " + smooth([[x, my - 1 * k], [x + 11 * k, my + 8 * k], [x + 22 * k, my - 2 * k]]), S.start, 0, { parent: fg, c: ink, w: DS.w.mid });
  return m === "sleep" || m === "yawn" || m === "happy" ? {} : { eg, ey: fy };
};
function pip(S, x, gy, o = {}) {
  const k = o.k || 1, L = o.layer || "near", g = S.grp(o.parent), X = (v) => x + v * k, Y = (v) => gy - v * k;
  const sh = (d, name, p = g, oo = {}) => DS.shape(S, d, name, Object.assign({ layer: L, parent: p }, oo));
  if (o.shadow !== false) DS.shadow(S, x, gy, 210 * k, { parent: g });
  [[-46, -8], [46, 52]].forEach(([dx, a]) => { const eg = el("g", { transform: rot(a, X(dx), Y(345)) }, g); sh(circ(X(dx), Y(430), 32 * k, 92 * k), "paper", eg); sh(circ(X(dx), Y(425), 15 * k, 62 * k), "pink", eg, { flat: true, w: "hair" }); }); // one ear up, one floppy (sleepy)
  [-1, 1].forEach((s) => sh(circ(X(s * 42), Y(18), 44 * k, 24 * k), "paper"));                                           // feet
  sh(circ(X(0), Y(105), 88 * k, 94 * k), "sky");                                                                          // star pyjamas
  [[-34, 128, 14], [34, 92, 12], [-10, 50, 10]].forEach(([dx, v, r]) => DS.shape(S, starD(X(dx), Y(v), r * k), "yellow", { parent: g, layer: L, w: "hair", flat: true }));
  sh(circ(X(0), Y(265), 112 * k, 102 * k), "paper");                                                                     // head
  const mood = moods(S, el("g", {}, g), o.mood || "smile", (fg, m) => pipFace(S, fg, X(0), Y(272), k, m, o.look || [0, 0]));
  const A0 = o.arms || [16, 16];
  const arms = [-1, 1].map((s, i) => { const sx = X(s * 70), sy = Y(172), ag = el("g", { transform: rot(-s * A0[i], sx, sy) }, g);
    sh(circ(sx, sy + 46 * k, 21 * k, 52 * k), "sky", ag); sh(circ(sx, sy + 100 * k, 23 * k), "paper", ag);
    return { ag, s, sx, sy, py: sy + 100 * k }; });
  const R = (a, A) => rot(-a.s * A, a.sx, a.sy), pick = (side) => (side === 0 ? arms : [arms[side < 0 ? 0 : 1]]);
  const F = { g, k, mood, top: Y(520), head: [X(0), Y(265)] };
  F.arm = (t, side, A, dur = 0.4) => { pick(side).forEach((a) => tl.to(a.ag, { attr: { transform: R(a, A) }, duration: dur, ease: "sine.inOut" }, t)); return F; };
  F.wave = (t0, t1, side = 1) => { F.arm(t0, side, 150, 0.35); pick(side).forEach((a) => yoyo(a.ag, t0 + 0.35, t1 - 0.4, R(a, 150), R(a, 118), 0.42)); return F.arm(t1 - 0.4, side, A0[side < 0 ? 0 : 1], 0.4); };
  // twinkle fingers up high: both arms up, paws wiggle, sparkles at the paws
  F.twinkle = (t0, t1) => { F.arm(t0, 0, 158, 0.4); arms.forEach((a) => { yoyo(a.ag, t0 + 0.4, t1, R(a, 158), R(a, 146), 0.3); const sg = el("g", {}, a.ag); [[-30, -18, 13], [26, -26, 11], [4, 34, 9]].forEach(([dx, dy, r]) => spark(S, a.sx + dx * k, a.py + dy * k, r * Math.max(k, 0.8) * 1.4, t0 + 0.3, sg)); }); return F; };
  // claps / taps land on their words: paws in fast, out slower
  const hits = (ts, Ain, Aout) => { F.arm(ts[0] - 0.45, 0, Aout, 0.3); ts.forEach((t, i) => { const gap = i + 1 < ts.length ? ts[i + 1] - t : 0.5, d = Math.min(0.13, gap * 0.35); F.arm(t - d, 0, Ain, d); F.arm(t + 0.02, 0, Aout, Math.min(0.2, gap * 0.5)); }); };
  F.clap = (ts) => (hits(ts, -42, 22), F);
  F.tap = (ts) => (hits(ts, -26, 6), F);
  F.peek = (t0, t1) => (F.arm(t0, 0, 196, 0.45), F.arm(t1 - 0.15, 0, A0[0], 0.4));
  return F;
};
// bed in the near plane (x0 left, gy floor): headboard, pillow, mattress; blanket() is drawn after Pip so it tucks him in
const bed = (S, x0, gy, w) => { DS.shadow(S, x0 + w / 2, gy, w + 80); [x0 + 10, x0 + w - 40].forEach((x) => DS.shape(S, rect(x, gy - 60, 30, 60), "wood"));
  DS.shape(S, rrect(x0, gy - 430, w, 320, DS.r.lg), "wood"); DS.shape(S, rrect(x0 + w * 0.18, gy - 360, w * 0.64, 110, DS.r.lg), "white"); DS.shape(S, rrect(x0 - 20, gy - 170, w + 40, 130, DS.r.md), "white"); };
const blanket = (S, x0, gy, w) => { DS.shape(S, rrect(x0 - 30, gy - 238, w + 60, 180, DS.r.lg), "pink"); [[0.2, 150, 16], [0.5, 110, 20], [0.8, 160, 15]].forEach(([f, dy, r]) => DS.shape(S, starD(x0 + w * f, gy - dy, r), "yellow", { w: "hair", flat: true })); };
// bedroom: warm peach wall, a night window on the back wall; Twinkle goes in .inside (clipped to the glass), then curtains() on top
const bedroom = (S, R) => {
  const [wx, wy, ww, wh] = [1040, 170, 420, 380];
  DS.shape(S, rrect(wx - 20, wy - 20, ww + 40, wh + 40, DS.r.xs), "white", { layer: "mid", w: "detail" });
  S.fill(rect(wx, wy, ww, wh), S.start, 0, grad3(DS.P.night[1], DS.P.purple[1], DS.P.pink[1]));
  const cid = "tt-c" + ++GID, cp = el("clipPath", { id: cid }, dsDefs()); el("path", { d: rect(wx, wy, ww, wh) }, cp);
  const inside = S.grp(); inside.setAttribute("clip-path", `url(#${cid})`);
  [[1090, 230], [1180, 470], [1420, 250], [1100, 380], [1400, 480]].forEach(([x, y], i) => spark(S, x, y, 10 + (i % 2) * 5, S.start, inside));
  DS.frame(S, 520, 200, 200, 150, "sky");
  return { R, wx, wy, ww, wh, inside };
};
const curtains = (S, B) => { const { wx, wy, ww, wh } = B;
  DS.shape(S, rrect(wx - 70, wy - 44, ww + 140, 22, DS.r.xs), "wood", { layer: "mid", w: "detail" });
  [wx - 60, wx + ww - 70].forEach((x) => { DS.shape(S, rrect(x, wy - 34, 130, wh + 74, DS.r.sm), "pink", { layer: "mid" }); [x + 43, x + 87].forEach((fx) => S.draw(line([fx, wy - 20], [fx, wy + wh + 30], 0), S.start, 0, { c: DS.c("pink", 2, "mid"), w: DS.w.hair })); DS.shape(S, rrect(x - 6, wy + wh * 0.55, 142, 26, DS.r.xs), "yellow", { layer: "mid", w: "detail" }); }); // two curtain panels with folds and a tie-back
};

// B (lottery): Pip asleep on a cloud under a big happy Twinkle with a heart of sparkles; two words.
const S = scene(0, 1, { cam: "none" });
night(S, DS.outdoor(S, NIGHT(1000)), { n: 10 });
const T = star(S, 1440, 600, 230, { mood: "happy" });
for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, hx = 16 * Math.sin(a) ** 3, hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)); spark(S, 1440 + hx * 24, 560 + hy * 22, 26, 0); }
cloud(S, 600, 1180, 1000);
pip(S, 600, 1090, { k: 1.45, mood: "sleep" });
S.text("SWEET DREAMS", 960, 230, { size: 190, c: "#FEFE06", halo: "#1d1b1f", haloW: 0.1 });
