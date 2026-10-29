// look: still
// @include ../../tools/cast.js
// 30 This Old Man (traditional, public domain). A sunny beach: sea behind, sand in front, a palm. The old turtle ("this old man", with
// round glasses) taps a beat with Ollie; each pass a new thing gets tapped: the SUN (1), a SHOE (2), Ollie's KNEE (3), a shell DOOR (4),
// a DIVE into a pool (5), a drum "AGAIN" (10). Bibi pats the puppy on the tag line. Chorus: the puppy gets its bone, everybody rolls home to the hut.
// Camera per pass: wide (the number + the word) -> medium on the tapped thing -> Ollie's face on "Pat the dog upon his back". No hard cuts.
// Clips (script.json, 1-based): 1 intro, 2-5 pass 1, 6 "Wow!", 7 "Two!", 8-9 pass 2 (the take dropped its first two lines), 10-13 pass 3, 14-17 pass 4,
// 18-21 pass 5, 22 "Ten! Again!", 23-27 pass 10, 28-32 chorus 1, 33-34 chorus 2a, 35-37 chorus 2b, 38-39 last chorus lines, 40 "Bye-bye!".
BEAT = 60 / 116;
const CS = (c) => CLIP(c)[0], CE = (c) => CLIP(c)[1];
const FY = 935, OX = 450, OK = 1.08, FACE = [OX, FY - 330 * OK];
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const view = (S, x, y, k, t, dur = 1.3) => (x = clamp(x, 960 / k - 190, 2110 - 960 / k), y = clamp(y, 540 / k - 190, 1270 - 540 / k), k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const wide = (S, t) => view(S, 960, 540, 1, t);
const sing = (A, c) => TIMING.words.filter((w) => w[0] === c).forEach((w) => A(w[3], w[3] + 0.6 * (w[4] - w[3])));
const card = (S, s, x, y, t, out, size = DS.type.title, fill) => S.fadeOut(DS.card(S, s, x, y, { size, t, fill }).g, out, 0.4);
const place = (S, make, x, gy, k, o) => { const n = S.g.children.length, A = make(S, x, gy, k, o); A.sd = S.g.children[n]; Object.assign(A, { x, gy, k, x0: x, gy0: gy }); return A; };
const moveTo = (S, A, t, dur, x1, y1 = A.gy, k1 = A.k, ease = "sine.inOut") => {
  tw(A.pos, t, dur, `translate(${A.x} ${A.gy}) scale(${A.k})`, `translate(${x1} ${y1}) scale(${k1})`, ease);
  if (A.sd) tw(A.sd, t, dur, `translate(${A.x - A.x0} ${A.gy - A.gy0})`, `translate(${x1 - A.x0} ${y1 - A.gy0})`, ease);
  Object.assign(A, { x: x1, gy: y1, k: k1 });
};
const pat = (S, Bi, t0, t1, tag) => { if (!Bi || !Bi.R) throw new Error('pat noR ' + tag); swing(S, Bi.R, t0, t1, { rotation: -26, svgOrigin: Bi.R.sh }, BEAT / 2); };
const slide = (S, g, t, dur, dx, dy = 0) => tw(g, t, dur, "translate(0 0)", `translate(${dx} ${dy})`, "sine.inOut");
const spark3 = (S, xs, y, t) => xs.forEach((x, i) => sparkle(S, x, y, t + i * 0.2, 0.9));

// ---------- the beach ----------
const world = (S, o = {}) => {
  const g = S.grp(); S.g.insertBefore(g, S.g.firstChild);
  DS.setHaze("sky");
  const sh = (d, fill, op) => { const p = el("path", { d, fill }, g); if (op !== undefined) p.setAttribute("opacity", op); return p; };
  sh(rect(-800, -400, 3600, 1000), DS.vgrad(DS.P.sky[2], DS.P.sky[1]));
  sh(circ(1250, 150, 300), DS.glow(DS.P.yellow[1], 0.7)); sh(circ(1250, 150, 72), DS.P.yellow[1]);
  const clouds = [[260, 190, 1], [980, 120, 0.8], [700, 330, 0.6]].map(([x, y, k]) => {
    const c = S.grp(g);
    [[0, 0, 90 * k, 36 * k], [70 * k, -18 * k, 64 * k, 34 * k], [-70 * k, 6 * k, 56 * k, 28 * k]].forEach(([dx, dy, rx, ry]) => { const p = el("path", { d: circ(x + dx, y + dy, rx, ry), fill: DS.P.white[0] }, c); p.setAttribute("opacity", 0.9); });
    tw(c, S.start, S.len, "translate(0 0)", "translate(70 0)", "none"); return c;
  });
  const SEA = 560;
  sh(smooth(Array.from({ length: 19 }, (_, i) => [-800 + i * 190, SEA + (i % 2 ? 8 : -8)])) + " L2700 900 L-800 900 Z", DS.vgrad(DS.P.sky[0], DS.c("blue", 0, "mid")));
  const line = S.draw(smooth(Array.from({ length: 19 }, (_, i) => [-800 + i * 190, SEA + (i % 2 ? 8 : -8)])), S.start, 0, { c: DS.P.white[0], w: DS.w.mid, op: 0.85 });
  tw(line, S.start, S.len, "translate(0 0)", "translate(-60 0)", wave(cyc(S.len, 5)));
  // sand: a soft ridge, everything stands on it
  DS.shape(S, smooth([[-800, 700], [500, 690], [1300, 704], [2700, 692]]) + " L2700 1500 L-800 1500 Z", "sand", { layer: "mid", dir: "v", w: "detail" });
  // palm at the right edge
  const P = tube([[1860, 700], [1850, 600], [1872, 470]], 24, 13).d; DS.shape(S, P, "wood", { layer: "mid", w: "mid", dir: "v" });
  [[-150, -20], [-100, -90], [0, -130], [100, -90], [150, -20]].forEach(([dx, dy]) => DS.shape(S, `M1872 470 Q${1872 + dx / 2} ${470 + dy - 70} ${1872 + dx} ${470 + dy} Q${1872 + dx / 2} ${470 + dy + 10} 1872 470 Z`, "green", { layer: "mid", w: "detail" }));
  return g;
};
const hut = (S, x, gy, t) => {                                                                        // home: round-roofed beach hut, door open
  const [o, g] = popIn(S, t ?? S.start, x, gy - 160, S.g);
  DS.shape(S, rrect(x - 160, gy - 210, 320, 210, DS.r.md), "yellow", { parent: g, w: "mid" });
  DS.shape(S, `M${x - 205} ${gy - 200} L${x} ${gy - 360} L${x + 205} ${gy - 200} Z`, "red", { parent: g, w: "mid" });
  DS.shape(S, `M${x - 56} ${gy} V${gy - 120} Q${x - 56} ${gy - 170} ${x} ${gy - 170} Q${x + 56} ${gy - 170} ${x + 56} ${gy - 120} V${gy} Z`, "wood", { parent: g, w: "mid" });
  S.fill(`M${x - 38} ${gy} V${gy - 112} Q${x - 38} ${gy - 150} ${x} ${gy - 150} Q${x + 38} ${gy - 150} ${x + 38} ${gy - 112} V${gy} Z`, S.start, 0, DS.c("wood", 2), 0.9, g);
  [-1, 1].forEach((s) => DS.shape(S, circ(x + s * 108, gy - 130, 24), "glass", { parent: g, w: "detail" }));
  S.fill(circ(x, gy - 292, 20), S.start, 0, DS.P.yellow[1], 1, g);
  return o;
};

// ---------- the cast on the beach ----------
const hero = (S, o = {}) => place(S, ollie, o.x ?? OX, o.gy ?? FY, o.k ?? OK, { mouth: o.mouth || "smile", look: o.look ?? 8, t: o.t });
const oldTurtle = (S, x, gy, k, o = {}) => {                                                           // "this old man": the turtle with round glasses and a white brow
  const T = place(S, turtle, x, gy, k, o), p = { parent: T.bob };
  [[142, -94, 20], [96, -92, 20]].forEach(([cx, cy, r]) => { S.fill(circ(cx, cy, r), S.start, 0, DS.c("glass", 1), 0.45, T.bob); S.draw(circ(cx, cy, r), S.start, 0, { c: LN("gray"), w: DS.w.mid, ...p }); });
  S.draw("M116 -94 H122", S.start, 0, { c: LN("gray"), w: DS.w.mid, ...p });
  S.draw("M128 -120 Q142 -134 158 -122", S.start, 0, { c: DS.P.white[0], w: DS.w.near, ...p });
  return T;
};
const wBibi = (S, t, o = {}) => {
  const [x, y] = o.at || [1730, FY], k = o.k || 0.66, w = S.grp(); DS.shadow(S, x, y, 260 * k, { parent: w });
  const B = bibi(S, x, y - 325 * k, { k, mood: o.mood || "joy" }); w.appendChild(B.g);
  if (t > S.start + 0.05) popAt(w, t, x, y - 150, 0.5);
  if (o.wave !== false) swing(S, B.R, t + 0.6, S.end - 0.4, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  B.w = w; return B;
};
const pup = (S, o = {}) => place(S, puppy, o.x ?? 1480, o.gy ?? FY, o.k ?? 0.9, { t: o.t });
const done = (S) => DS.vignette(S, 0.1);

// ---------- the things that get tapped (each returns [outer (jiggle it), inner]) ----------
const sunProp = (S, t) => { const o = S.grp(), g = S.grp(o);                                       // the sun grows a bright glow and rays on its word
  S.fill(circ(1250, 150, 150), S.start, 0, DS.glow(DS.P.yellow[1], 0.9), 1, g);
  S.draw(rays(1250, 150, 100, 150, 14), S.start, 0, { c: DS.c("yellow", 2), w: DS.w.mid, parent: g });
  tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.6 }, t); return [o, g]; };
const shoeProp = (S, x, y, t) => { const [o, g] = popIn(S, t, x, y - 60), sg = G(S, g, `translate(${x} ${y})`);
  DS.shape(S, "M-70 -2 L-70 -92 Q-70 -108 -52 -108 L-14 -108 Q-4 -62 42 -54 Q96 -46 96 -2 Z", "red", { parent: sg, w: "mid" });
  DS.shape(S, rrect(-82, -12, 190, 26, DS.r.sm), "white", { parent: sg, w: "mid" });
  S.draw("M-52 -88 L-12 -80 M-48 -66 L-6 -56 M-46 -44 L10 -36", S.start, 0, { c: DS.P.white[0], w: DS.w.near, parent: sg });
  return [o, g]; };
const doorProp = (S, x, y, t) => { const [o, g] = popIn(S, t, x, y - 170);
  DS.shape(S, `M${x - 125} ${y} V${y - 230} Q${x - 125} ${y - 370} ${x} ${y - 370} Q${x + 125} ${y - 370} ${x + 125} ${y - 230} V${y} Z`, "pink", { parent: g, w: "mid" });
  for (let i = -3; i <= 3; i++) S.draw(`M${x} ${y - 330} L${x + i * 40} ${y - 230}`, S.start, 0, { c: DS.c("pink", 2), w: DS.w.hair, parent: g });
  DS.shape(S, `M${x - 74} ${y} V${y - 200} Q${x - 74} ${y - 290} ${x} ${y - 290} Q${x + 74} ${y - 290} ${x + 74} ${y - 200} V${y} Z`, "wood", { parent: g, w: "mid", dir: "v" });
  S.draw(`M${x} ${y - 290} V${y}`, S.start, 0, { c: DS.c("wood", 2), w: DS.w.mid, parent: g });
  DS.shape(S, circ(x + 40, y - 130, 11), "gold", { parent: g, w: "detail" });
  return [o, g]; };
const drumProp = (S, x, y, t) => { const [o, g] = popIn(S, t, x, y - 60);
  DS.shape(S, rrect(x - 100, y - 120, 200, 120, DS.r.sm), "red", { parent: g, w: "mid" });
  S.draw(`M${x - 100} ${y - 108} L${x - 60} ${y - 10} L${x - 20} ${y - 108} L${x + 20} ${y - 10} L${x + 60} ${y - 108} L${x + 100} ${y - 10}`, S.start, 0, { c: DS.P.white[0], w: DS.w.near, parent: g });
  DS.shape(S, circ(x, y - 122, 100, 24), "gold", { parent: g, w: "mid" });
  DS.shape(S, circ(x, y - 124, 84, 17), "white", { parent: g, w: "detail" });
  return [o, g]; };
const splash = (S, x, y, t) => { const [o, g] = popIn(S, t, x, y);                                                // a crown of water drops
  [[-120, -70, 22], [-70, -130, 26], [0, -160, 30], [70, -130, 26], [120, -70, 22], [-150, -20, 14], [150, -20, 14]].forEach(([dx, dy, r]) => DS.shape(S, circ(x + dx, y + dy, r, r * 1.25), "sky", { parent: g, w: "detail" }));
  S.fadeOut(o, t + 1.2, 0.7); return o; };
const ring = (S, x, y, t) => { const g = S.grp(); S.draw(circ(x, y, 36), t, 0, { c: DS.c("yellow", 2), w: DS.w.mid, parent: g }); S.fadeOut(g, t + 0.3, 0.3); return g; };

// ---------- scenes ----------
const B = [0, CS(1) - 0.8, CS(5) - 0.5, CS(11) - 0.8, CS(16) - 0.5, CS(22) - 0.5, CS(27) - 0.8, CS(31) - 0.4, CS(36) - 0.5, CS(39) - 0.6, 147.5, CS(42) - 0.8, TOTAL];

// 0 intro: the old turtle taps a beat with Ollie; the title card
{ const S = scene(B[0], B[1], { cam: "none" });
  world(S); const O = hero(S, { look: 14 }), T = oldTurtle(S, 1130, FY, 0.95), P = pup(S), Bi = wBibi(S, S.start);
  O.bob(S.start + 0.4, B[1] - 0.2, 7);
  O.wiggle([1, 8], 2.4, B[1] - 0.4, 16, BEAT / 2); T.dance(S.start + 0.6, B[1] - 0.3); P.wag(S.start + 0.5, B[1] - 0.3);
  card(S, "THIS OLD MAN", 960, 160, 0.4, 3.0);
  view(S, 800, 640, 1.2, 3.4, 2.2);
  done(S); }

// one pass. kind picks the tapped thing; o: { a, b (scene), L: [line clips 1..4], num: [clip, word, "label"], prop: [clip, word], taps: [[clip, word]..], sing: [clips] }
const pass = (kind, o) => {
  const S = scene(o.a, o.b, { cam: "none" }), [l2, l3, l4] = o.L, tn = o.num, tp = o.prop;
  world(S);
  const dive = kind === 4;
  if (dive) { S.fill(circ(OX, 925, 430, 90), S.start, 0, DS.c("blue", 1), 1); S.draw(circ(OX, 925, 430, 90), S.start, 0, { c: DS.P.white[0], w: DS.w.mid }); }
  const O = hero(S, { look: 10 }), T = oldTurtle(S, 1130, FY, 0.95), P = pup(S), Bi = wBibi(S, S.start);
  if (dive) { S.fill("M20 925 A430 90 0 0 0 880 925 Z", S.start, 0, DS.c("blue", 1), 0.6); S.draw("M20 925 A430 90 0 0 0 880 925", S.start, 0, { c: DS.P.white[0], w: DS.w.mid }); }
  o.sing.forEach((c) => sing(O.sing, c)); O.bob(o.a + 0.3, o.b - 0.3, 7);
  const tt = W(tp[0], tp[1]), taps = o.taps.map(([c, w]) => W(c, w));
  let J;                                                                                         // the thing that gets tapped
  if (kind === 0) J = sunProp(S, tt);
  if (kind === 1) J = shoeProp(S, 880, FY - 5, tt);
  if (kind === 2) { const [oo, g] = popIn(S, tt, -272, -65, O.body); S.draw(circ(-272, -65, 44), S.start, 0, { c: DS.c("yellow", 2), w: DS.w.mid, parent: g, fill: DS.c("yellow", 0) }); twinkle(S, -272, -65, 26, g); J = [oo, g]; }
  if (kind === 3) J = doorProp(S, 890, FY - 5, tt);
  if (kind === 5) J = drumProp(S, 880, FY - 5, tt);
  if (kind === 4) { const t = W(24, 5); O.hop(t, 320, 1.3); O.spin(t, 1.3); splash(S, OX, 900, t + 1.0); Bi.w && tw(Bi.w, t + 1.4, 0.5, "translate(0 0)", "translate(0 -40)", hump(1)); }
  if (J) taps.forEach((t) => tw(J[0], t, 0.3, "translate(0 0)", "translate(0 -16)", hump(1)));
  O.wiggle(kind === 2 ? [2] : [1, 8], taps[0] - 0.1, CE(l3) + 0.2, 18, BEAT / 2);
  T.dance(CS(l2), CE(l3)); [CS(l3), CS(l4)].forEach((t) => T.dance(t, t + 2));
  // the tag: Bibi pats the puppy on "Pat the dog"
  P.wag(CS(l4) - 0.2, CE(l4) + 0.4); pat(S, Bi, CS(l4), CE(l4), 'pass' + kind);
  // numbers on screen
  const [bx, by, bk] = o.bv, tB = o.tB ?? tt - 1.6, tC = Math.max(CS(o.L[1]) - 0.7, tt + 1.3), tD = CS(o.L[2]) - 0.7;
  card(S, tn[2], 300, 190, W(tn[0], tn[1]), Math.max(tB, W(tn[0], tn[1]) + 1.5) + 0.3, 190, "yellow");                       // the number: in the wide shot, again over Ollie's face shot
  card(S, tn[2], FACE[0] - 330, FACE[1] - 60, tC + 0.5, tD - 0.3, 190, "yellow");
  card(S, o.word, ...o.wp, tt, tt + 1.2);
  view(S, bx, by, bk, tB); view(S, FACE[0], FACE[1] + 20, 2.0, tC); view(S, 1600, 640, 1.5, tD);
  done(S);
};
pass(0, { a: B[1], b: B[2], L: [2, 3, 4], bv: [800, 430, 1.15], num: [1, 5, "1"], prop: [2, 5], word: "SUN", wp: [1000, 110], taps: [[2, 2], [3, 2], [3, 3]], sing: [1, 2, 3, 4] });
pass(1, { a: B[2], b: B[3], L: [7, 8, 9], bv: [700, 700, 1.5], num: [6, 5, "2"], prop: [7, 5], word: "SHOE", wp: [1100, 470], taps: [[7, 2], [8, 2], [8, 3]], sing: [5, 6, 7, 8, 9, 10] });
pass(2, { a: B[3], b: B[4], L: [12, 14, 15], bv: [520, 680, 1.25], num: [11, 5, "3"], prop: [12, 5], word: "KNEE", wp: [770, 560], taps: [[12, 2], [14, 2], [14, 3]], sing: [11, 12, 13, 14, 15] });
pass(3, { a: B[4], b: B[5], L: [18, 19, 20], bv: [760, 700, 1.6], num: [17, 5, "4"], prop: [18, 5], word: "DOOR", wp: [800, 440], taps: [[18, 2], [19, 2], [19, 3]], sing: [16, 17, 18, 19, 20, 21] });
pass(4, { a: B[5], b: B[6], L: [24, 25, 26], bv: [700, 560, 1.1], num: [23, 5, "5"], prop: [24, 5], word: "DIVE", wp: [1000, 330], taps: [[25, 2], [25, 3]], sing: [22, 23, 24, 25, 26] });
pass(5, { a: B[6], b: B[7], L: [28, 29, 30], bv: [760, 700, 1.6], num: [27, 5, "10"], prop: [28, 4], word: "AGAIN", wp: [1100, 470], taps: [[28, 2], [29, 2], [29, 3]], sing: [27, 28, 29, 30] });

// ---------- the finale: the puppy gets its bone, everybody rolls home ----------
const STAGE = [{ O: 340, T: 740, Bi: 1380, P: 1100 }, { O: 450, T: 820, Bi: 1430, P: 1170 }, { O: 550, T: 900, Bi: 1480, P: 1250 }, { O: 650, T: 1000, Bi: 1570, P: 1340 }];
const finale = (s, a, b, o) => {
  const S = scene(a, b, { cam: "none" }), p0 = STAGE[s], p1 = STAGE[s + 1] || STAGE[3];
  world(S); hut(S, 1730, FY - 25);
  const O = hero(S, { x: p0.O, k: 0.95, look: 8 }), T = oldTurtle(S, p0.T, FY, 0.85), Bi = wBibi(S, S.start, { at: [p0.Bi, FY], k: 0.6 }), P = pup(S, { x: p0.P, k: 0.9 });
  const bn = S.grp(); const bg = G(S, bn, `translate(${p0.P - 130} ${FY - 24})`); bone(S, bg, 0.9);
  if (s === 0) { const t = W(32, 4); tl.fromTo(bn, { opacity: 0 }, { opacity: 1, duration: 0.3 }, t); tw(bn, t, 0.9, "translate(0 -420)", "translate(0 0)", "bounce.out"); P.hop(t + 0.8, 50); }
  const t0 = a + 0.5;
  moveTo(S, O, t0, b - t0 - 0.5, p1.O, FY); moveTo(S, T, t0 + 0.4, b - t0 - 1.0, p1.T, FY); moveTo(S, P, t0 + 0.2, b - t0 - 0.8, p1.P, FY);
  slide(S, bn, t0 + 0.2, b - t0 - 0.8, p1.P - p0.P); slide(S, Bi.w, t0 + 0.3, b - t0 - 0.9, p1.Bi - p0.Bi);
  O.bob(a + 0.3, b - 0.3, 8); T.dance(a + 0.3, b - 0.3); P.wag(a + 0.3, b - 0.3);
  o.sing.forEach((c) => sing(O.sing, c));
  o.go(S, O, T, P, Bi);
  done(S);
};
finale(0, B[7], B[8], { sing: [31, 32, 33, 34, 35], go: (S, O, T, P, Bi) => {
  O.spin(W(33, 4), 1.4); O.spin(W(34, 0), 1.4);
  hearts(S, W(35, 3), [[900, 400, 1], [1200, 340, 1]]);
  view(S, 900, 640, 1.2, CS(33) - 0.6); wide(S, CE(34) - 0.3); view(S, 500, FY - 330 * 0.95 + 40, 1.75, CS(35) - 0.5);
} });
finale(1, B[8], B[9], { sing: [36, 37, 38], go: (S, O, T, P, Bi) => {
  O.spin(CS(37) + 0.5, 1.4); view(S, 800, 640, 1.2, CS(37) - 0.6, 1.6);
} });
finale(2, B[9], B[10], { sing: [39, 40, 41], go: (S, O, T, P, Bi) => {
  pat(S, Bi, CS(41), CE(41), 'f2');
  O.spin(W(40, 2), 1.4); hearts(S, W(40, 2), [[1250, 380, 1], [1500, 340, 1.1]]);
  view(S, 1100, 640, 1.2, CS(40) - 0.6, 1.6); wide(S, CE(41) + 0.3);
} });
finale(3, B[10], B[11], { sing: [], go: (S, O, T, P, Bi) => {                                   // the singer lets the band play: everybody is home, hearts rise, waving
  O.wiggle([1, 2, 7, 8], B[10] + 1.0, B[11] - 1.5, 20, BEAT); hearts(S, B[10] + 2.0, [[900, 380, 1], [1300, 330, 1.1]]);
  O.spin(B[10] + 6.0, 1.4); view(S, 1000, 640, 1.2, B[10] + 3.0, 2.0); wide(S, B[11] - 3.5);
} });

// outro: everybody is home; the last chorus line, then waving bye-bye
{ const S = scene(B[11], B[12], { cam: "none" }), p = STAGE[3];
  world(S); hut(S, 1730, FY - 25);
  const O = hero(S, { x: p.O, k: 0.95, look: 6 }), T = oldTurtle(S, p.T, FY, 0.85), Bi = wBibi(S, S.start, { at: [p.Bi, FY], k: 0.6 }), P = pup(S, { x: p.P, k: 0.9 });
  const bg = G(S, null, `translate(${p.P - 130} ${FY - 24})`); bone(S, bg, 0.9);
  [42, 43].forEach((c) => sing(O.sing, c)); O.bob(S.start + 0.3, S.end - 0.3, 8); T.dance(S.start, S.end - 0.3); P.wag(S.start, S.end - 0.3);
  O.wiggle([1, 2, 7, 8], CS(43) - 0.2, S.end - 0.2, 20, BEAT);
  pat(S, Bi, CS(42), CE(42), 'outro');
  hearts(S, CS(42), [[900, 360, 1], [1250, 300, 1.2], [1500, 360, 0.9]]);
  view(S, 1000, 640, 1.25, CS(42) - 0.5, 1.6); wide(S, CE(42) - 0.2);
  S.fadeOut(DS.card(S, "BYE-BYE!", 960, 160, { size: DS.type.title, t: CS(43) - 1.4 }).g, S.end - 0.1, 0.05);
  S.text("Tiny Tune Town", 960, 330, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: CS(43) - 1.4 });
  done(S); }
