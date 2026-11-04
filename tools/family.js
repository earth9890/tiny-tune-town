// Tiny Tune Town family = THE CAST since 2026-11 (the Hummingtons): Nomi the toddler hero (about 2, variant A: two hair puffs, yellow
// flower clip on the right puff, sunflower romper), Kofi her big brother (about 5), Mum, Dad, Nana (Mum's mum) and Mango the cat.
// Builders keep role names (toddler, sibling, mum, dad, gran, kitty). Ollie + friends stay in cast.js for the 76 published songs.
// Same soft toon look and API style as cast.js; include it AFTER cast.js (it uses toon, toyFx, blinks, cap, tw, G):
//   // @include ../../tools/cast.js
//   // @include ../../tools/family.js
// Builders (origin = ground centre under the feet, k scales the whole figure, o: { mood, t (fade in), bare (no clothes: bath), pj (light-blue star nightshirt, bare feet), barefoot, sleeves (0.4 = pushed up) }):
//   toddler(S, x, gy, k, { v: "A" | "B" | "C" })   hero; A = two hair puffs + sunflower romper (recommended), B = bobble hat, C = sprout topknot
//   sibling(S, x, gy, k, o)   mum(...)   dad(...)   gran(...)                    each returns F (below)
//   kitty(S, x, gy, k, o)  ->  { pos, bob, wag(t0, t1), hop(t0, h) }            the family cat
// F: .expr(name, t)  happy | oh | giggle | sleepy | sing      .sing(t0, t1)  open mouth for a word, then back to the mood
//    .arm(side, deg, t0, dur)   side -1 = screen left, 1 = screen right; deg from hanging down, + = out and up (120 = wave, 160 = up high)
//    .wave(t0, t1, side)  .clap(t0, t1, per)  .groove(t0, t1, amp, deg)  .bob(t0, t1, amp)  .hop(t0, h)  .walk(x1, t0, t1)
//    .hand(side) = [x, y] screen point of that hand (for props)   .face = [x, y] face centre for close-ups (S.zoom(...F.face, 2.2, t))   .at([x, y]) local -> screen
// Blinks come from TOON = 2 (like the rest of the cast). Toddler size: k = 1 is about 600 px tall; adults are drawn to scale at the same k.
DS.P.famSk1 = ["#c98d5e", "#deaa7e", "#9e6640"]; DS.P.famSk2 = ["#8f5a36", "#ab7550", "#683f24"]; DS.P.famSk3 = ["#f2c4a2", "#fbdcc6", "#d79c78"];
DS.P.famSk4 = ["#e3b48a", "#f0cda9", "#c18a5f"]; DS.P.famSk5 = ["#6e4229", "#8a5a3c", "#4d2c1a"];
DS.P.famHr = ["#3a2620", "#5e4035", "#21140f"]; DS.P.famGin = ["#d9733a", "#ee9a62", "#a8501f"]; DS.P.famSil = ["#dcd8e2", "#f4f2f7", "#aca7b8"];
DS.P.famTeal = ["#2bb3a6", "#72d6cb", "#1d847a"]; DS.P.famCoral = ["#ff7f6e", "#ffab9f", "#d9574c"];

// closed rounded torso / dress from [[y, half width], ...] top -> bottom (the top centre hides under the head)
const famRing = (rows, bulge = 0) => smooth([[0, rows[0][0]], ...rows.map(([y, w]) => [w, y]), [0, rows[rows.length - 1][0] + bulge], ...rows.slice().reverse().map(([y, w]) => [-w, y]), [0, rows[0][0]]]) + " Z";
// hair / hat over the top of the head: the outer arc (a0..a1 degrees, 270 = top) then a hairline back, right -> left, in head radii
const famCap = (R, hy, line, o = {}) => {
  const out = o.out || 1.05, a0 = o.a0 ?? 188, a1 = o.a1 ?? 352, n = o.bump ? 28 : 12, P = [];
  for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180, r = out * (1 + (o.bump || 0) * (i % 2 ? 1 : -0.4)); P.push([Math.cos(a) * R * r, hy + Math.sin(a) * R * 0.96 * r]); }
  return smooth([...P, ...line.map(([x, y]) => [x * R, hy + y * R]), P[0]]) + " Z";
};
const famShine = (S, g, x, y, rx, ry, op = 0.35) => S.fill(circ(x, y, rx, ry), S.start, 0, DS.P.white[0], op, g);
const famStar = (cx, cy, r) => smooth(Array.from({ length: 11 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r * 0.48 : r; return [cx + Math.cos(a) * q, cy + Math.sin(a) * q]; })) + " Z";

// ---------- faces: one library in toddler face units (head centre = 0 0, head radius 150), scaled per person ----------
const FAMX = { happy: ["open", "smile", "norm"], oh: ["wide", "O", "up"], giggle: ["joy", "grin", "norm"], sleepy: ["sleepy", "small", "norm"], sing: ["open", "open", "norm"] };
const famFace = (S, F, g, P) => {
  const f = P.face || {}, ex = f.ex ?? 56, ey = f.ey ?? 22, es = f.es ?? 1, ms = f.ms ?? 1, skin = P.skin, s0 = S.start;
  const dark = DS.c("famHr", 2), white = DS.P.white[0], parts = { eyes: {}, mouth: {}, brow: {} };
  const part = (cat, name) => { const p = G(S, g); p.setAttribute("opacity", 0); parts[cat][name] = p; return p; };
  [-1, 1].forEach((s) => S.fill(circ(s * (f.cx ?? 98), f.cy ?? 62, 24, 14), s0, 0, DS.c("red", 1), 0.4, g));
  S.fill(circ(0, f.ny ?? 58, 9, 6), s0, 0, DS.c(skin, 2), 0.9, g);
  (f.freckles ? [[-86, 42], [-104, 52], [-76, 56], [86, 42], [104, 52], [76, 56]] : []).forEach(([x, y]) => S.fill(circ(x, y, 4), s0, 0, DS.c(skin, 2), 0.8, g));
  const eye = (p, fn) => [-1, 1].forEach((s) => fn(G(S, p, `translate(${s * ex} ${ey}) scale(${es})`), s));
  const lash = (e, s, y) => f.lash && S.draw(`M${s * 18} ${y} L${s * 34} ${y - 12}`, s0, 0, { c: dark, w: 6, parent: e });
  eye(part("eyes", "open"), (e, s) => { S.fill(circ(0, 0, 26, 33), s0, 0, dark, 1, e); S.fill(circ(9, -12, 10), s0, 0, white, 1, e); S.fill(circ(-8, 13, 4.5), s0, 0, white, 0.85, e); lash(e, s, -24); });
  eye(part("eyes", "wide"), (e, s) => { S.fill(circ(0, 0, 30, 38), s0, 0, dark, 1, e); S.fill(circ(10, -14, 12), s0, 0, white, 1, e); S.fill(circ(-9, 15, 5), s0, 0, white, 0.85, e); lash(e, s, -28); });
  eye(part("eyes", "joy"), (e) => S.draw("M-24 8 Q0 -24 24 8", s0, 0, { c: dark, w: 9, parent: e }));
  eye(part("eyes", "sleepy"), (e) => { S.fill("M-25 2 A25 28 0 0 0 25 2 Z", s0, 0, dark, 1, e); S.draw("M-30 2 Q0 -4 30 2", s0, 0, { c: LN(skin), w: 7, parent: e }); });
  eye(part("brow", "norm"), (e) => S.draw("M-18 -44 Q0 -53 18 -44", s0, 0, { c: DS.c(P.hair || "famHr", 2), w: 6, parent: e }));
  eye(part("brow", "up"), (e) => S.draw("M-18 -58 Q0 -70 18 -58", s0, 0, { c: DS.c(P.hair || "famHr", 2), w: 6, parent: e }));
  const m = (name, fn) => fn(G(S, part("mouth", name), `translate(0 ${f.my ?? 84}) scale(${ms})`));
  const lip = { c: LN("red"), w: 7 }, hole = (d, e) => S.draw(d, s0, 0, { fill: DS.c("red", 2), c: LN("red"), w: 5, parent: e });
  m("smile", (e) => S.draw("M-24 -6 Q0 18 24 -6", s0, 0, Object.assign({ parent: e }, lip)));
  m("small", (e) => S.draw("M-13 -2 Q0 8 13 -2", s0, 0, Object.assign({ parent: e }, lip)));
  m("open", (e) => { hole("M-27 -8 Q0 50 27 -8 Z", e); S.fill(circ(0, 20, 13, 7), s0, 0, DS.c("pink", 1), 1, e); });
  m("O", (e) => { hole(circ(0, 8, 13, 17), e); S.fill(circ(0, 17, 8, 5), s0, 0, DS.c("pink", 1), 1, e); });
  m("grin", (e) => { hole("M-38 -10 Q0 58 38 -10 Z", e); S.fill(circ(0, 26, 18, 9), s0, 0, DS.c("pink", 1), 1, e); });
  blinks(S, g, [[-ex, ey, 26 * es, 33 * es], [ex, ey, 26 * es, 33 * es]], skin, F.x + F.k * 7, 6);
  return (name, t) => FAMX[name].forEach((n, i) => Object.entries(parts[["eyes", "mouth", "brow"][i]]).forEach(([key, p]) => {
    const v = key === n ? 1 : 0; if (t <= s0 + 0.01) p.setAttribute("opacity", v); else tl.set(p, { opacity: v }, t); }));
};

// ---------- one body builder for every family member (front view, soft toon, one sticker edge) ----------
// P: { R, hy (head radius + centre y), skin, hair, shw (shadow width), leg: { y0, y1, gap, r, c }, shoe: [rx, ry, colour],
//      body: { rows, c, bulge }, arm: { x, y, len, r, hr, sleeve (0-1), c, rest }, face, under / back / front / top / over hooks (S, g, F) }
const person = (S, x, gy, k, P, o = {}) => {
  const s0 = S.start, lw = P.lw ?? DS.w.mid * 3, { R, hy, skin } = P, bare = o.bare, pj = !bare && o.pj, feet = bare || pj || o.barefoot; // bare: no clothes (bath); pj: star nightshirt; feet: no shoes
  const sh = DS.shadow(S, x, gy, P.shw * k);
  const pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), lift = G(S, pos, "translate(0 0)"), bob = G(S, lift, "translate(0 0)"), sway = G(S, bob, "rotate(0 0 0)");
  const F = { pos, sh, k, x, gy, R, hy, arms: {}, legs: [], mood: o.mood || "happy", at: ([px, py]) => [F.x + px * k, gy + py * k] };
  const L = P.leg, my = (L.y0 + L.y1) / 2;
  [-1, 1].forEach((s) => { const g = G(S, sway, "translate(0 0)"), lx = s * L.gap; // tapered: wider at the hip, rounded both ends
    toon(S, tube([[lx, L.y0], [lx + s * L.r * 0.1, my], [lx, L.y1]], L.r * 1.2, L.r * 0.85).d + " " + circ(lx, L.y0, L.r * 1.2), (!bare && !pj && L.c) || skin, { parent: g, lw });
    if (feet) { toon(S, circ(s * (L.gap + 4), -P.shoe[1] * 0.9, P.shoe[0] * 0.8, P.shoe[1] * 0.9), skin, { parent: g, lw });
      [0, 1, 2].forEach((i) => S.fill(circ(s * (L.gap + 4) + (i - 1) * P.shoe[0] * 0.32, -P.shoe[1] * 1.45, P.shoe[0] * 0.13), s0, 0, DS.c(skin, 1), 0.9, g)); }
    else toon(S, circ(s * (L.gap + 6), -P.shoe[1], P.shoe[0], P.shoe[1]), P.shoe[2], { parent: g, lw }); F.legs.push(g); });
  const rows = P.body.rows, last = rows[rows.length - 1], ny = L.y1 - (L.y1 - L.y0) * 0.3; // pj: the shirt runs on down to above the ankles
  const wAt = (y) => { for (let i = 1; i < rows.length; i++) if (y <= rows[i][0]) return rows[i - 1][1] + (rows[i][1] - rows[i - 1][1]) * (y - rows[i - 1][0]) / (rows[i][0] - rows[i - 1][0]); return last[1]; };
  !bare && !pj && P.under && P.under(S, sway, F);
  toon(S, famRing(pj ? [...rows, [ny, last[1] * 1.1]] : rows, P.body.bulge ?? 10), bare ? skin : pj ? "sky" : P.body.c, { parent: sway, lw });
  !bare && !pj && P.over && P.over(S, sway, F);
  if (pj) [[0.25, -0.5], [0.4, 0.45], [0.6, -0.2], [0.75, 0.55], [0.9, -0.55], [0.55, 0.05]].forEach(([fy, fx]) => { const y = rows[0][0] + 40 + (ny - rows[0][0] - 60) * fy;
    toon(S, famStar(fx * Math.min(wAt(y), last[1]), y, 16), "yellow", { parent: sway, flat: true, lw: DS.w.detail * 1.6 }); });
  const A = P.arm, sl = pj ? 0.92 : o.sleeves ?? A.sleeve; // o.sleeves: override the sleeve length (0.4 = pushed up)
  [-1, 1].forEach((s) => {
    const sx = s * A.x, sy = A.y, rest = A.rest ?? 14, hx = sy + A.len, pose = G(S, sway, `rotate(${-s * rest} ${sx} ${sy})`), wig = G(S, pose, `rotate(0 ${sx} ${sy})`);
    // soft elbow: the arm bows outward at the middle and the hand comes back under the shoulder; tapered shoulder -> wrist
    const P3 = [[sx, sy], [sx + s * A.len * 0.09, sy + A.len * 0.5], [sx, hx]], lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    toon(S, tube(P3, A.r * 1.2, A.r * 0.82).d + " " + circ(sx, sy, A.r * 1.2), skin, { parent: wig, lw });
    if (sl && !bare) { const sp = sl <= 0.5 ? [P3[0], lerp(P3[0], P3[1], sl * 2)] : [P3[0], P3[1], lerp(P3[1], P3[2], sl * 2 - 1)], e = sp[sp.length - 1];
      toon(S, tube(sp, A.r * 1.35, A.r * 1.12).d + " " + circ(sx, sy, A.r * 1.35), pj ? "sky" : A.c || P.body.c, { parent: wig, lw });
      if (o.sleeves != null && !pj) S.draw(`M${K(e[0] - A.r * 1.05)} ${K(e[1] - A.r * 0.25)} H${K(e[0] + A.r * 1.05)}`, s0, 0, { c: DS.c(A.c || P.body.c, 2), w: DS.w.mid, parent: wig }); }
    // mitten hand: a tall rounded palm, a thumb on the body side, one finger crease
    const hr = A.hr, hy0 = hx + hr * 0.3;
    toon(S, circ(sx - s * hr * 0.78, hx + hr * 0.05, hr * 0.36, hr * 0.52), skin, { parent: wig, lw: lw * 0.8 });
    toon(S, circ(sx, hy0, hr * 0.84, hr * 1.1), skin, { parent: wig, lw });
    S.draw(`M${K(sx + s * hr * 0.12)} ${K(hy0 + hr * 0.25)} V${K(hy0 + hr * 0.95)}`, s0, 0, { c: LN(skin), w: DS.w.detail * 1.4, parent: wig });
    F.arms[s] = { pose, wig, sx, sy, s, cur: rest, len: A.len, hr };
  });
  [-1, 1].forEach((s) => toon(S, circ(s * R * 0.95, hy + R * 0.14, R * 0.16, R * 0.21), skin, { parent: sway, lw }));
  P.back && P.back(S, sway, F);
  toon(S, circ(0, hy, R, R * 0.96), skin, { parent: sway, lw: lw * 1.15 });
  P.front && P.front(S, sway, F);
  F.show = famFace(S, F, G(S, sway, `translate(0 ${hy}) scale(${K(R / 150)})`), P);
  P.top && P.top(S, sway, F);
  toyFx(pos, 9);
  F.show(F.mood, s0); if ((o.t ?? s0) > s0 + 0.05) { fadeIn(S, pos, o.t); fadeIn(S, sh, o.t); }
  F.face = [x, gy + (hy + R * 0.15) * k];
  F.expr = (name, t = s0) => { F.mood = name; F.show(name, t); };
  F.sing = (t0, t1) => { F.show("sing", t0); F.show(F.mood, t1); };
  F.arm = (s, deg, t0 = s0, dur = 0.5) => { const a = F.arms[s]; tw(a.pose, t0, dur, `rotate(${-s * a.cur} ${a.sx} ${a.sy})`, `rotate(${-s * deg} ${a.sx} ${a.sy})`); a.cur = deg; };
  // where hand s is now (screen px, at its pose angle; ignores bob/sway): hold props there, e.g. a sponge or a spoon
  F.hand = (s) => { const a = F.arms[s], r = -s * a.cur * Math.PI / 180, dy = a.len + a.hr * 0.3; return F.at([a.sx - Math.sin(r) * dy, a.sy + Math.cos(r) * dy]); };
  F.wave = (t0, t1, s = 1) => { const a = F.arms[s], r0 = a.cur, d = t1 - t0 - 1;
    F.arm(s, 120, t0, 0.5); tw(a.wig, t0 + 0.5, d, `rotate(0 ${a.sx} ${a.sy})`, `rotate(${18 * s} ${a.sx} ${a.sy})`, wave(cyc(d, BEAT))); F.arm(s, r0, t1 - 0.5, 0.5); };
  // hands meet in front of the tummy on every beat (per), then rest
  F.clap = (t0, t1, per = BEAT) => [-1, 1].forEach((s) => { const a = F.arms[s], th = -Math.asin(Math.min(1, (A.x - a.hr * 0.85) / a.len)) * 180 / Math.PI;
    tw(a.pose, t0, t1 - t0, `rotate(${-s * a.cur} ${a.sx} ${a.sy})`, `rotate(${-s * th} ${a.sx} ${a.sy})`, hump(cyc(t1 - t0, per))); });
  F.bob = (t0, t1, amp = 10) => tw(bob, t0, t1 - t0, "translate(0 0)", `translate(0 ${-amp})`, hump(cyc(t1 - t0, 2 * BEAT)));
  F.groove = (t0, t1, amp = 10, deg = 3) => { F.bob(t0, t1, amp); tw(sway, t0, t1 - t0, "rotate(0 0 0)", `rotate(${deg} 0 0)`, wave(cyc(t1 - t0, 4 * BEAT))); };
  F.hop = (t0, h = 40, dur = 0.5) => tw(lift, t0, dur, "translate(0 0)", `translate(0 ${-h})`, hump(1));
  // calm front-view walk to x1: feet lift in turn (one step per beat), a small bounce per step, eased start and stop
  F.walk = (x1, t0, t1, h = 16) => { const d = t1 - t0, n = 2 * cyc(d, 2 * BEAT);
    tw(pos, t0, d, `translate(${F.x} ${gy}) scale(${k})`, `translate(${x1} ${gy}) scale(${k})`, "sine.inOut");
    tw(sh, t0, d, `translate(${F.x - x} 0)`, `translate(${x1 - x} 0)`, "sine.inOut");
    F.legs.forEach((g, i) => tw(g, t0, d, "translate(0 0)", `translate(0 ${-h})`, (p) => Math.max(0, (i ? -1 : 1) * Math.sin(Math.PI * n * p))));
    tw(bob, t0, d, "translate(0 0)", `translate(0 ${-h * 0.6})`, hump(n)); F.x = x1; F.face = [x1, F.face[1]]; };
  return F;
};

// ---------- the toddler hero (about 2: head = 49 % of the height) ----------
const famTotBody = (c, shoe, o = {}) => ({ R: 150, hy: -440, shw: 300, leg: { y0: -150, y1: -40, gap: 40, r: 28, c: o.legs }, shoe: [44, 26, shoe],
  body: { rows: [[-300, 70], [-262, 96], [-190, 118], [-140, 122], [-116, 106]], c, bulge: 12 }, arm: { x: 86, y: -276, len: 128, r: 24, hr: 30, sleeve: 0.35, c: o.sleeve || c, rest: 16 } });
// dungarees over a tee: lower body + bib + straps + buttons (B, C)
const famDungarees = (c, btn, star) => (S, g) => {
  toon(S, famRing([[-232, 106], [-190, 118], [-140, 122], [-116, 106]], 12), c, { parent: g, flat: true, lw: DS.w.mid * 2.4 });
  toon(S, rrect(-58, -272, 116, 70, 18), c, { parent: g, flat: true, lw: DS.w.mid * 2.4 });
  [-1, 1].forEach((s) => { S.draw(`M${s * 50} -266 L${s * 74} -300`, S.start, 0, { c: DS.c(c, 0), w: 18, parent: g }); toon(S, circ(s * 42, -258, 9), btn, { parent: g, flat: true, lw: DS.w.detail * 2 }); });
  if (star) toon(S, famStar(0, -232, 24), star, { parent: g, flat: true, lw: DS.w.detail * 2 });
};
const FAM_TOT = {
  // A: two round hair puffs with yellow bobbles + sunflower-yellow romper with a white collar
  A: Object.assign(famTotBody("yellow", "famCoral"), { skin: "famSk1", hair: "famHr",
    back: (S, g, F) => [-1, 1].forEach((s) => { const px = s * 0.66 * F.R, py = F.hy - 0.74 * F.R, r = 0.4 * F.R;
      toon(S, circ(px, py, r, r * 0.95), "famHr", { parent: g, lw: DS.w.mid * 3 });
      [[-0.35, -0.3], [0.25, -0.1], [-0.1, 0.3]].forEach(([dx, dy]) => S.draw(arc(px + dx * r, py + dy * r, r * 0.22, 200, 340), S.start, 0, { c: DS.c("famHr", 1), w: DS.w.mid, parent: g }));
      famShine(S, g, px - r * 0.35, py - r * 0.45, r * 0.3, r * 0.14); }),
    front: (S, g, F) => { toon(S, famCap(F.R, F.hy, [[0.97, -0.12], [0.84, -0.4], [0.62, -0.5], [0.42, -0.42], [0.2, -0.54], [0, -0.48], [-0.2, -0.54], [-0.42, -0.42], [-0.62, -0.5], [-0.84, -0.4], [-0.97, -0.12]]), "famHr", { parent: g, lw: DS.w.mid * 3 });
      famShine(S, g, -0.42 * F.R, F.hy - 0.74 * F.R, 0.22 * F.R, 0.07 * F.R); },
    top: (S, g, F) => { const fx = 0.78 * F.R, fy = F.hy - 0.98 * F.R, r = 0.075 * F.R; // one yellow flower clip, on the right puff only
      [0, 1, 2, 3, 4].forEach((i) => { const a = (i * 72 - 90) * Math.PI / 180; toon(S, circ(fx + Math.cos(a) * r * 1.3, fy + Math.sin(a) * r * 1.3, r), "yellow", { parent: g, flat: true, lw: DS.w.mid * 1.6 }); });
      toon(S, circ(fx, fy, r * 0.8), "famCoral", { parent: g, flat: true, lw: DS.w.mid * 1.6 }); },
    over: (S, g) => { [-1, 1].forEach((s) => toon(S, circ(s * 32, -284, 40, 20), "white", { parent: g, flat: true, lw: DS.w.mid * 2 }));
      [-232, -184].forEach((y) => toon(S, circ(0, y, 9), "famCoral", { parent: g, flat: true, lw: DS.w.detail * 2 })); } }),
  // B: teal bobble hat with a coral pom-pom (always on), ginger fringe, freckles, red tee + blue dungarees
  B: Object.assign(famTotBody("red", "yellow", { legs: "blue" }), { skin: "famSk3", hair: "famGin", face: { freckles: true },
    back: (S, g, F) => [-1, 1].forEach((s) => toon(S, circ(s * 0.86 * F.R, F.hy - 0.02 * F.R, 0.2 * F.R, 0.24 * F.R), "famGin", { parent: g, lw: DS.w.mid * 2.4 })),
    front: (S, g, F) => { const R = F.R, hy = F.hy, line = [[1.0, -0.24], [0.5, -0.34], [0, -0.36], [-0.5, -0.34], [-1.0, -0.24]];
      [-0.3, -0.1, 0.12, 0.32].forEach((x) => toon(S, circ(x * R, hy - 0.26 * R, 0.13 * R, 0.1 * R), "famGin", { parent: g, flat: true, lw: DS.w.mid * 2 }));
      toon(S, circ(0, hy - 1.1 * R, 0.3 * R), "famCoral", { parent: g, lw: DS.w.mid * 3 });
      [[-0.1, -1.2], [0.12, -1.02], [-0.14, -0.98]].forEach(([dx, dy]) => S.draw(arc(dx * R, hy + dy * R, 0.07 * R, 200, 340), S.start, 0, { c: DS.c("famCoral", 2), w: DS.w.mid, parent: g }));
      toon(S, famCap(R, hy, line, { out: 1.07, a0: 182, a1: 358 }), "famTeal", { parent: g, lw: DS.w.mid * 3 });
      [-0.6, -0.3, 0, 0.3, 0.6].forEach((x) => S.draw(`M${x * R} ${hy - 0.4 * R} Q${x * R * 1.1} ${hy - 0.75 * R} ${x * R * 0.7} ${hy - 0.98 * R}`, S.start, 0, { c: DS.c("famTeal", 2), w: DS.w.mid, parent: g }));
      S.draw(smooth(line.map(([x, y]) => [x * R * 1.02, hy + y * R])), S.start, 0, { c: DS.c("famTeal", 2), w: 0.17 * R, parent: g });
      S.draw(smooth(line.map(([x, y]) => [x * R * 1.0, hy + (y - 0.03) * R])), S.start, 0, { c: DS.c("famTeal", 1), w: 0.05 * R, parent: g });
      famShine(S, g, -0.4 * R, hy - 0.78 * R, 0.2 * R, 0.07 * R); },
    over: famDungarees("blue", "yellow") }),
  // C: black bob with a blunt fringe and a "sprout" topknot tied with a red band, orange tee + green dungarees with a star pocket
  C: Object.assign(famTotBody("orange", "red", { legs: "green" }), { skin: "famSk4", hair: "famHr",
    back: (S, g, F) => { const R = F.R, hy = F.hy;
      [-28, 0, 28].forEach((a) => { const r = a * Math.PI / 180, bx = 0, by = hy - 0.92 * R, L = 0.62 * R, tx = bx + Math.sin(r) * L, ty = by - Math.cos(r) * L, w = 0.2 * R, nx = Math.cos(r) * w, ny = Math.sin(r) * w;
        toon(S, `M${K(bx)} ${K(by)} Q${K((bx + tx) / 2 + nx)} ${K((by + ty) / 2 + ny)} ${K(tx)} ${K(ty)} Q${K((bx + tx) / 2 - nx)} ${K((by + ty) / 2 - ny)} ${K(bx)} ${K(by)} Z`, "famHr", { parent: g, lw: DS.w.mid * 2.6 }); });
      toon(S, famCap(R, hy, [[1.06, 0.5], [0.6, 0.62], [0, 0.66], [-0.6, 0.62], [-1.06, 0.5]], { out: 1.12, a0: 165, a1: 375 }), "famHr", { parent: g, lw: DS.w.mid * 3 }); },
    front: (S, g, F) => { toon(S, famCap(F.R, F.hy, [[0.95, -0.18], [0.7, -0.34], [0.35, -0.38], [0, -0.4], [-0.35, -0.38], [-0.7, -0.34], [-0.95, -0.18]], { out: 1.05 }), "famHr", { parent: g, lw: DS.w.mid * 3 });
      famShine(S, g, -0.4 * F.R, F.hy - 0.72 * F.R, 0.24 * F.R, 0.07 * F.R); },
    top: (S, g, F) => toon(S, rrect(-0.16 * F.R, F.hy - 1.04 * F.R, 0.32 * F.R, 0.14 * F.R, 0.06 * F.R), "red", { parent: g, lw: DS.w.mid * 2.4 }),
    over: famDungarees("green", "yellow", "yellow") }),
};
const toddler = (S, x, gy, k = 1, o = {}) => person(S, x, gy, k, FAM_TOT[o.v || "A"], o);

// ---------- big brother (about 5: head = 35 %): short curly high-top, green star tee, blue shorts, red sneakers ----------
const FAM_SIB = { R: 140, hy: -640, skin: "famSk1", hair: "famHr", shw: 320, face: { es: 0.86, ey: 18, my: 80 },
  leg: { y0: -320, y1: -40, gap: 42, r: 24 }, shoe: [44, 24, "red"],
  body: { rows: [[-500, 72], [-472, 98], [-400, 104], [-340, 102], [-318, 96]], c: "grass", bulge: 6 },
  arm: { x: 92, y: -468, len: 190, r: 22, hr: 27, sleeve: 0.34, rest: 12 },
  under: (S, g) => toon(S, famRing([[-350, 98], [-300, 108], [-262, 104]], 4), "blue", { parent: g, lw: DS.w.mid * 3 }),
  over: (S, g) => toon(S, famStar(0, -420, 40), "yellow", { parent: g, flat: true, lw: DS.w.detail * 2 }),
  back: (S, g, F) => [-1, 1].forEach((s) => toon(S, circ(s * 0.9 * F.R, F.hy - 0.3 * F.R, 0.2 * F.R), "famHr", { parent: g, lw: DS.w.mid * 2.4 })),
  front: (S, g, F) => { toon(S, famCap(F.R, F.hy, [[0.96, -0.2], [0.7, -0.48], [0.35, -0.56], [0, -0.5], [-0.35, -0.56], [-0.7, -0.48], [-0.96, -0.2]], { out: 1.12, bump: 0.05 }), "famHr", { parent: g, lw: DS.w.mid * 3 });
    famShine(S, g, -0.36 * F.R, F.hy - 0.82 * F.R, 0.22 * F.R, 0.07 * F.R); } };
const sibling = (S, x, gy, k = 1, o = {}) => person(S, x, gy, k, FAM_SIB, o);

// ---------- Mum: orange headwrap with a top knot, gold hoops, teal dress ----------
const FAM_MUM = { R: 132, hy: -1010, skin: "famSk2", hair: "famHr", shw: 360, face: { es: 0.62, ex: 50, ey: 16, my: 80, ms: 0.85, lash: true, cx: 92 },
  leg: { y0: -360, y1: -36, gap: 42, r: 26 }, shoe: [42, 24, "famCoral"],
  body: { rows: [[-870, 66], [-846, 98], [-770, 104], [-690, 84], [-590, 102], [-440, 146], [-330, 168]], c: "famTeal", bulge: 10 },
  arm: { x: 98, y: -826, len: 290, r: 23, hr: 28, sleeve: 0.3, rest: 9 },
  under: (S, g) => toon(S, cap(0, -930, 0, -850, 26), "famSk2", { parent: g, lw: DS.w.mid * 3 }),
  over: (S, g) => S.draw("M-46 -860 Q0 -810 46 -860", S.start, 0, { c: DS.c("famTeal", 2), w: DS.w.near, parent: g }),
  back: (S, g, F) => { toon(S, circ(0.12 * F.R, F.hy - 1.02 * F.R, 0.56 * F.R, 0.4 * F.R), "orange", { parent: g, lw: DS.w.mid * 3 });
    S.draw(arc(0.12 * F.R, F.hy - 1.02 * F.R, 0.3 * F.R, 200, 330), S.start, 0, { c: DS.c("orange", 2), w: DS.w.mid, parent: g }); },
  front: (S, g, F) => { const R = F.R, hy = F.hy; toon(S, famCap(R, hy, [[1.0, -0.2], [0.55, -0.46], [0, -0.52], [-0.55, -0.46], [-1.0, -0.2]], { out: 1.08 }), "orange", { parent: g, lw: DS.w.mid * 3 });
    [[-0.5, -0.8], [0.1, -0.86], [0.6, -0.7], [-0.2, -0.62], [0.32, -0.58]].forEach(([dx, dy]) => S.fill(circ(dx * R, hy + dy * R, 0.07 * R), S.start, 0, DS.c("yellow", 1), 1, g));
    S.draw(`M${-0.9 * R} ${hy - 0.34 * R} Q0 ${hy - 0.62 * R} ${0.9 * R} ${hy - 0.34 * R}`, S.start, 0, { c: DS.c("orange", 2), w: DS.w.mid, parent: g }); },
  top: (S, g, F) => [-1, 1].forEach((s) => S.draw(circ(s * 0.96 * F.R, F.hy + 0.46 * F.R, 0.12 * F.R), S.start, 0, { c: DS.c("gold", 0), w: DS.w.near, parent: g })) };
const mum = (S, x, gy, k = 1, o = {}) => person(S, x, gy, k, FAM_MUM, o);

// ---------- Dad: ginger hair and a short soft beard, blue jumper, navy trousers ----------
const FAM_DAD = { R: 136, hy: -1080, skin: "famSk3", hair: "famGin", shw: 420, face: { es: 0.6, ex: 50, ey: 14, my: 80, ms: 0.85, cx: 80, cy: 48 },
  leg: { y0: -600, y1: -40, gap: 54, r: 32, c: "navy" }, shoe: [52, 26, "brown"],
  body: { rows: [[-930, 90], [-902, 134], [-830, 148], [-730, 130], [-640, 122], [-570, 130]], c: "blue", bulge: 14 },
  arm: { x: 134, y: -876, len: 318, r: 30, hr: 32, sleeve: 0.9, rest: 8 },
  under: (S, g) => toon(S, cap(0, -990, 0, -900, 32), "famSk3", { parent: g, lw: DS.w.mid * 3 }),
  over: (S, g) => { S.draw("M-56 -926 Q0 -880 56 -926", S.start, 0, { c: DS.c("blue", 2), w: DS.w.near * 1.6, parent: g }); S.draw("M-120 -600 H120", S.start, 0, { c: DS.c("blue", 2), w: DS.w.mid, parent: g }); },
  front: (S, g, F) => { const R = F.R, hy = F.hy;
    toon(S, famCap(R, hy, [[1.0, -0.14], [0.82, -0.42], [0.3, -0.56], [-0.12, -0.46], [-0.6, -0.54], [-1.0, -0.14]], { out: 1.08, bump: 0.03 }), "famGin", { parent: g, lw: DS.w.mid * 3 });
    toon(S, smooth([[-0.9, 0.4], [-0.7, 0.8], [-0.36, 1.0], [0, 1.06], [0.36, 1.0], [0.7, 0.8], [0.9, 0.4], [0.62, 0.62], [0.3, 0.74], [0, 0.77], [-0.3, 0.74], [-0.62, 0.62], [-0.9, 0.4]].map(([a, b]) => [a * R, hy + b * R])) + " Z", "famGin", { parent: g, lw: DS.w.mid * 2.6, flat: true });
    famShine(S, g, -0.4 * R, hy - 0.8 * R, 0.22 * R, 0.07 * R); } };
const dad = (S, x, gy, k = 1, o = {}) => person(S, x, gy, k, FAM_DAD, o);

// ---------- Grandma (Mum's mum): silver curls + bun, round glasses, lilac cardigan, pink skirt, pearl necklace ----------
const FAM_GRAN = { R: 128, hy: -950, skin: "famSk5", hair: "famSil", shw: 360, face: { es: 0.6, ex: 50, ey: 16, my: 80, ms: 0.85, cx: 92 },
  leg: { y0: -340, y1: -36, gap: 40, r: 25 }, shoe: [40, 24, "purple"],
  body: { rows: [[-812, 64], [-788, 104], [-720, 114], [-640, 100], [-570, 112], [-540, 110]], c: "purple", bulge: 6 },
  arm: { x: 102, y: -768, len: 282, r: 24, hr: 28, sleeve: 0.86, rest: 10 },
  under: (S, g) => { toon(S, cap(0, -870, 0, -800, 24), "famSk5", { parent: g, lw: DS.w.mid * 3 }); toon(S, famRing([[-600, 104], [-460, 138], [-320, 156]], 8), "pink", { parent: g, lw: DS.w.mid * 3 }); },
  over: (S, g) => { toon(S, "M-40 -800 L0 -700 L40 -800 Z", "pink", { parent: g, flat: true, tone: 1, lw: DS.w.mid * 2 });
    for (let i = 0; i < 9; i++) { const a = Math.PI * (0.15 + 0.7 * i / 8); S.fill(circ(-Math.cos(a) * 62, -812 + Math.sin(a) * 56, 9), S.start, 0, DS.P.white[0], 1, g); }
    [-650, -600].forEach((y) => toon(S, circ(-18, y, 8), "white", { parent: g, flat: true, lw: DS.w.detail * 2 })); },
  back: (S, g, F) => { toon(S, circ(0, F.hy - 1.0 * F.R, 0.36 * F.R, 0.3 * F.R), "famSil", { parent: g, lw: DS.w.mid * 3 });
    [-1, 1].forEach((s) => toon(S, circ(s * 0.92 * F.R, F.hy - 0.2 * F.R, 0.24 * F.R), "famSil", { parent: g, lw: DS.w.mid * 2.4 })); },
  front: (S, g, F) => { toon(S, famCap(F.R, F.hy, [[0.98, -0.06], [0.74, -0.42], [0.3, -0.5], [0, -0.44], [-0.3, -0.5], [-0.74, -0.42], [-0.98, -0.06]], { out: 1.1, bump: 0.04 }), "famSil", { parent: g, lw: DS.w.mid * 3 });
    famShine(S, g, -0.36 * F.R, F.hy - 0.8 * F.R, 0.22 * F.R, 0.07 * F.R, 0.6); },
  top: (S, g, F) => { const R = F.R, u = R / 150, ey = F.hy + 16 * u, rr = 34 * u;
    [-1, 1].forEach((s) => S.draw(circ(s * 50 * u, ey, rr), S.start, 0, { c: DS.c("purple", 2), w: DS.w.mid, parent: g }));
    S.draw(`M${-16 * u} ${ey - 4 * u} Q0 ${ey - 12 * u} ${16 * u} ${ey - 4 * u}`, S.start, 0, { c: DS.c("purple", 2), w: DS.w.mid, parent: g }); } };
const gran = (S, x, gy, k = 1, o = {}) => person(S, x, gy, k, FAM_GRAN, o);

// ---------- the family cat: a round orange tabby sitting up, white muzzle and paws, curly striped tail ----------
const kitty = (S, x, gy, k = 1, o = {}) => {
  const s0 = S.start, sh = DS.shadow(S, x, gy, 240 * k), pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, pos, "translate(0 0)");
  const tail = G(S, bob, "rotate(0 60 -30)");
  toon(S, tube([[50, -24], [112, -40], [138, -100], [118, -150]], 15, 13).d, "orange", { parent: tail, lw: DS.w.mid * 2.6 });
  [[118, -52], [134, -96]].forEach(([tx, ty]) => S.draw(`M${tx - 12} ${ty - 8} L${tx + 12} ${ty + 6}`, s0, 0, { c: DS.c("orange", 2), w: DS.w.mid, parent: tail }));
  toon(S, circ(0, -96, 82, 94), "orange", { parent: bob });
  S.fill(circ(0, -78, 44, 58), s0, 0, DS.P.white[0], 0.9, bob);
  [-1, 1].forEach((s) => toon(S, circ(s * 34, -16, 30, 18), "white", { parent: bob, flat: true, w: "mid" }));
  [-1, 1].forEach((s) => { toon(S, `M${s * 30} -270 Q${s * 70} -330 ${s * 88} -310 Q${s * 96} -260 ${s * 84} -232 Z`, "orange", { parent: bob, lw: DS.w.mid * 2.6 }); S.fill(`M${s * 44} -262 Q${s * 70} -306 ${s * 80} -296 Q${s * 84} -262 ${s * 78} -244 Z`, s0, 0, DS.c("pink", 1), 0.9, bob); });
  toon(S, circ(0, -206, 94, 78), "orange", { parent: bob });
  [-14, 0, 14].forEach((dx) => S.draw(`M${dx} -280 V${-252 + Math.abs(dx)}`, s0, 0, { c: DS.c("orange", 2), w: DS.w.mid, parent: bob }));
  [-1, 1].forEach((s) => { S.fill(circ(s * 20, -176, 26, 20), s0, 0, DS.P.white[0], 1, bob); S.fill(circ(s * 36, -214, 16, 20), s0, 0, DS.c("famHr", 2), 1, bob); S.fill(circ(s * 36 + 6, -222, 6), s0, 0, DS.P.white[0], 1, bob);
    [-8, 6].forEach((dy) => S.draw(`M${s * 50} ${-178 + dy} L${s * 108} ${-186 + dy * 2}`, s0, 0, { c: DS.c("orange", 2), w: DS.w.hair, parent: bob })); });
  blinks(S, bob, [[-36, -214, 16, 20], [36, -214, 16, 20]], "orange", x, DS.w.mid);
  S.fill("M-10 -192 L10 -192 L0 -180 Z", s0, 0, DS.c("pink", 2), 1, bob);
  S.draw("M-16 -168 Q-8 -160 0 -170 Q8 -160 16 -168", s0, 0, { c: LN("orange"), w: DS.w.mid, parent: bob });
  [-1, 1].forEach((s) => S.fill(circ(s * 62, -184, 16, 10), s0, 0, DS.c("red", 1), 0.35, bob));
  toyFx(pos, 7); if ((o.t ?? s0) > s0 + 0.05) { fadeIn(S, pos, o.t); fadeIn(S, sh, o.t); }
  return { pos, bob, x, gy, k,
    wag: (t0, t1) => tw(tail, t0, t1 - t0, "rotate(-10 60 -30)", "rotate(14 60 -30)", wave(cyc(t1 - t0, 2 * BEAT))),
    hop: (t0, h = 30) => tw(bob, t0, 0.5, "translate(0 0)", `translate(0 ${-h})`, hump(1)) };
};
