// look: still
// @include ../../tools/cast.js
// 25 Colours Song (original). Pink Ollie meets a coloured friend each pass (red crab, blue whale, yellow sun, green turtle,
// purple shell); on "What colour can he be?" the kids shout it, and on the spoken answer Ollie spins and turns that colour
// (octopus magic). Chorus: all friends gather on the beach, each hops on its colour word, Ollie turns pink again.
// Camera per pass: wide -> friend -> face close-up on the hook -> mid on the question -> wide for the wait -> mid for the change.
// ---- take remap (planned line -> sung clip number, or {t: seconds} for a break the singer dropped) ----
const PLAN = [null, {"t": 3.353}, 1, 2, 3, 4, {"t": 20.453}, 5, 6, 7, 8, 9, 10, 11, 12, 13, {"t": 64.503}, 14, 15, 16, 17, {"t": 84.123}, 19, 20, 21, 22, {"t": 110.403}, 23, 24, 25, 26, 27, 28, 29, 30, 31];
const PWN = (c) => TIMING.words.filter((x) => x[0] === PLAN[c]).length;
const PW = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + i * 0.3 : W(PLAN[c], Math.min(i, PWN(c) - 1)));
const PCLIP = (c) => (typeof PLAN[c] === "object" ? [PLAN[c].t, PLAN[c].t + 1.2] : CLIP(PLAN[c]));
const PWE = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + 0.4 + i * 0.3 : WE(PLAN[c], Math.min(i, PWN(c) - 1)));

BEAT = 60 / 118;
const OX = 800, OY = 905, OK = 1.15, FACE = [OX, OY - 330 * OK];
const wide = (S, t) => S.zoom(...FACE, 1, t, 1.3), mid = (S, t, k = 1.2) => S.zoom(1000, 700, k, t, 1.3), close = (S, t) => S.zoom(...FACE, 1.5, t, 1.3);
const toward = (S, x, y, k, t) => S.zoom(x, y, k, t, 1.3);

// ---- recolour: draw a cast character with one palette name swapped for another (cast.js stays untouched) ----
const pal = (map, f) => {
  const s = DS.shape, c = DS.c;
  DS.shape = (S_, d, n, o) => s(S_, d, map[n] || n, o); DS.c = (n, ...r) => c(map[n] || n, ...r);
  try { return f(); } finally { DS.shape = s; DS.c = c; }
};
// Ollie in colour `from`; if `to` is given, a second Ollie in `to` fades in over him at tc, so `each` drives both identically
const duo = (S, from, to, tc, o = {}) => {
  const A = pal({ pink: from }, () => ollie(S, OX, OY, OK, o)), B = to ? pal({ pink: to }, () => ollie(S, OX, OY, OK, { ...o, t: tc })) : null;
  const all = B ? [A, B] : [A];
  return { A, B, all, each: (f) => all.forEach(f) };
};
const armOf = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const P = (S, d, fill, op) => el("path", op === undefined ? { d, fill } : { d, fill, opacity: op }, S.g);

// the colour change: Ollie spins, a ring of the new colour pops, confetti + sparkles; the new colour fades in mid-spin
const change = (S, D, col, t) => {
  D.each((O) => { O.spin(t - 0.1, 1.3); O.grin(t); });
  const [fx, fy] = D.A.at([0, -330]), g = G(S, null, `translate(${fx} ${fy}) scale(0.4)`);
  S.draw(circ(0, 0, 190), S.start, 0, { c: DS.c(col, 0), w: DS.w.near, parent: g });
  tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t);
  tw(g, t, 0.9, `translate(${fx} ${fy}) scale(0.4)`, `translate(${fx} ${fy}) scale(1.5)`, "power2.out"); S.fadeOut(g, t + 0.5, 0.5);
  [[-250, -150, 18], [240, -160, 14], [-290, 30, 12], [280, 40, 18], [-120, -330, 14], [140, -340, 16], [0, -420, 12]].forEach(([dx, dy, r], i) => {
    const [x, y] = D.A.at([dx, dy]), c = S.fill(circ(x, y, r), t + 0.15 + i * 0.07, 0.3, DS.c(col, 0), 1); S.fadeOut(c, t + 1.7, 0.5);
  });
  [[-170, -470, 0.9], [190, -450, 1], [-60, -560, 0.7], [90, -250, 0.7]].forEach(([dx, dy, r], i) => sparkle(S, ...D.A.at([dx, dy]), t + 0.3 + i * 0.22, r));
};
const kidsAsk = (S, t, t1) => S.fadeOut(DS.card(S, "?", 1160, 290, { size: DS.type.display, t, fill: "yellow" }).g, t1, 0.4);

// ---- sets ----
const beach = (S) => {
  DS.setHaze("sky");
  P(S, "M-200 -200 H2120 V1280 H-200 Z", DS.vgrad(DS.P.sky[2], DS.P.sky[1]));
  [[330, 230, 1], [1010, 150, 0.8], [1700, 250, 0.9]].forEach(([x, y, k]) => [[0, 0, 90, 40], [75, -22, 70, 40], [-75, -10, 60, 32], [135, 6, 60, 30]].forEach(([dx, dy, rx, ry]) => P(S, circ(x + dx * k, y + dy * k, rx * k, ry * k), DS.P.white[0], 0.92)));
  P(S, "M-200 560 H2120 V720 H-200 Z", DS.vgrad(DS.c("blue", 1, "far"), DS.c("blue", 0, "mid")));
  ["M120 600 q40 -16 80 0 t80 0", "M760 640 q40 -16 80 0 t80 0", "M1320 590 q40 -16 80 0 t80 0", "M1640 660 q40 -16 80 0 t80 0"].forEach((d) => S.draw(d, S.start, 0, { c: DS.P.white[0], w: DS.w.detail, op: 0.7 }));
  P(S, "M-200 700 Q300 662 800 690 T1500 676 T2120 690 V1280 H-200 Z", DS.vgrad(DS.c("sand", 1), DS.c("sand", 0)));
  P(S, "M-200 704 Q300 666 800 694 T1500 680 T2120 694 L2120 716 Q1500 704 800 720 T-200 724 Z", DS.P.white[0], 0.75);
  [[260, 800, 14], [1650, 830, 12], [1180, 770, 10], [520, 1010, 16]].forEach(([x, y, r]) => DS.shape(S, circ(x, y, r, r * 0.6), "gray", { layer: "mid", flat: true, w: "detail" }));
  rock(S, 120, 840, 90, 60, "mid");
};
const sunny = (S, x, y, r) => {   // returns { g: whole sun (move to rise), rays, face }; sun is a friend, smiling
  const g = G(S, null, "translate(0 0)");
  S.fill(circ(x, y, r * 3), S.start, 0, DS.glow(DS.P.yellow[1], 0.7), 1, g);
  const rg = G(S, g, `rotate(0 ${x} ${y})`);
  S.draw(rays(x, y, r * 1.2, r * 1.75, 14), S.start, 0, { c: DS.c("gold", 0), w: DS.w.near, parent: rg });
  DS.shape(S, circ(x, y, r), "yellow", { parent: g });
  [-1, 1].forEach((s) => { DS.shape(S, circ(x + s * r * 0.36, y - r * 0.12, r * 0.17), "white", { parent: g, flat: true, w: "detail" }); S.fill(circ(x + s * r * 0.38, y - r * 0.1, r * 0.09), S.start, 0, DS.P.ink[0], 1, g); S.fill(circ(x + s * r * 0.62, y + r * 0.22, r * 0.14, r * 0.08), S.start, 0, DS.c("orange", 1), 0.6, g); });
  S.draw(`M${x - r * 0.3} ${y + r * 0.28} Q${x} ${y + r * 0.58} ${x + r * 0.3} ${y + r * 0.28}`, S.start, 0, { c: DS.line(), w: DS.w.near, parent: g });
  return { g, rg, shine: (t0, t1) => tw(rg, t0, t1 - t0, `rotate(0 ${x} ${y})`, `rotate(40 ${x} ${y})`, "none") };
};
const scallop = (S, parent, cx, cy, k, name) => {   // a fan shell standing on the point (cx, cy)
  DS.shape(S, `M${cx - 34 * k} ${cy - 6 * k} Q${cx - 50 * k} ${cy - 62 * k} ${cx} ${cy - 66 * k} Q${cx + 50 * k} ${cy - 62 * k} ${cx + 34 * k} ${cy - 6 * k} Q${cx} ${cy + 6 * k} ${cx - 34 * k} ${cy - 6 * k} Z`, name, { parent, w: "mid" });
  [-30, -15, 0, 15, 30].forEach((a) => S.draw(`M${cx} ${cy - 2 * k} L${cx + a * 1.5 * k} ${cy - 58 * k + Math.abs(a) * 0.5 * k}`, S.start, 0, { c: DS.c(name, 2), w: DS.w.detail, parent }));
  DS.shape(S, rrect(cx - 16 * k, cy - 4 * k, 32 * k, 12 * k, DS.r.xs), name, { parent, flat: true, w: "detail", tone: 2 });
};
const whale = (S, x, y, k, x0 = x) => {   // blue whale facing left; own build (not in cast.js)
  const pos = G(S, null, `translate(${x0} ${y}) scale(${k})`), bob = G(S, pos, "translate(0 0)"), sh = (d, n, o = {}) => DS.shape(S, d, n, { parent: bob, ...o });
  sh("M270 -50 C320 -60 350 -110 345 -165 C380 -140 420 -150 450 -190 C455 -120 420 -60 360 -20 C420 -10 455 20 470 70 C410 50 350 40 290 30 Z", "blue");
  sh(smooth([[-310, 20], [-262, -92], [-120, -150], [60, -130], [200, -72], [300, -20], [260, 52], [120, 110], [-60, 140], [-220, 110], [-300, 62]]) + " Z", "blue");
  sh(smooth([[-285, 52], [-200, 88], [-50, 108], [100, 82], [215, 30], [200, 52], [90, 104], [-60, 126], [-215, 100]]) + " Z", "sky", { flat: true, w: "detail" });
  sh("M-30 70 C-10 150 60 160 100 130 C70 100 30 80 -30 70 Z", "blue", { tone: 2 });
  sh(circ(-212, -26, 26), "white", { flat: true, w: "detail" });
  S.fill(circ(-206, -22, 14), S.start, 0, DS.P.ink[0], 1, bob); S.fill(circ(-212, -30, 5), S.start, 0, DS.P.white[0], 1, bob);
  S.fill(circ(-170, 32, 20, 12), S.start, 0, DS.c("red", 1), 0.5, bob);
  const smile = S.draw("M-296 56 Q-232 102 -168 62", S.start, 0, { c: DS.line(), w: DS.w.near, parent: bob });
  const open = G(S, bob); open.setAttribute("opacity", 0);
  S.draw("M-300 52 Q-240 120 -170 62 Z", S.start, 0, { c: DS.line(), w: DS.w.near, fill: DS.c("red", 2), parent: open });
  return { pos, bob, sing: (t0, t1) => { tl.set(open, { opacity: 1 }, t0); tl.set(smile, { opacity: 0 }, t0); tl.set(open, { opacity: 0 }, t1); tl.set(smile, { opacity: 1 }, t1); },
    sway: (t0, t1) => tw(bob, t0, t1 - t0, "translate(0 0)", "translate(0 -16)", hump(cyc(t1 - t0, 2 * BEAT))),
    glide: (xa, ya, xb, yb, t0, dur) => tw(pos, t0, dur, `translate(${xa} ${ya}) scale(${k})`, `translate(${xb} ${yb}) scale(${k})`, "sine.out") };
};
const hopUp = (S, e, x, y, k, t, h = 40, dir = 1) => tw(e, t, 0.5, `translate(${x} ${y}) scale(${k * dir} ${k})`, `translate(${x} ${y - h}) scale(${k * dir} ${k})`, hump(1));   // quick hop of a friend's pos group
const sandShell = (S, x, y, k, t, name = "purple") => { const [o, g] = popIn(S, t, x, y); scallop(S, g, x, y, k, name); DS.shadow(S, x, y, 66 * k, { parent: o }); return { o, g }; };

// ---- one pass: friend arrives, hook close-up, the question, the spoken answer, the change ----
const passes = [
  { c: 2, from: "pink", to: "red", name: "RED", card: [1420, 230], set: (S) => { sea(S, { coral: false }); bubbles(S, 6, 29); },
    friend: (S, D, c, T) => {   // red crab (cast crab, orange swapped for red)
      const cb = pal({ orange: "red" }, () => crab(S, 2300, 935, 1.3)), a = PW(c, 4), b = PW(c + 1, 4);
      tw(cb.pos, T + 2.6, PW(c, 1) - T - 2.6, "translate(2300 935) scale(1.3)", "translate(1420 935) scale(1.3)", "sine.out");
      [4, 5, 6].forEach((i) => { cb.clap(PW(c, i)); cb.clap(PW(c + 1, i)); });
      cb.dance(PW(c, 1) + 0.2, PW(c + 3, 0)); cb.dance(PW(c + 4, 0) - 4, PW(c + 4, 0) - 0.2);
      cb.clap(PW(c + 4, 0)); cb.clap(PW(c + 4, 0) + 0.5);
      return [1420, 800]; } },
  { c: 7, from: "red", to: "blue", name: "BLUE", card: [1420, 200], set: (S) => { sea(S, { hills: "purple", coral: false }); bubbles(S, 6, 71); },
    friend: (S, D, c, T) => {   // blue whale glides in, sings "whoo" with bubbles
      const wh = whale(S, 1330, 480, 0.82, 2400);
      wh.glide(2400, 480, 1330, 480, T - 0.4, PW(c, 2) - T + 1.2);
      wh.sway(PW(c, 2) + 0.8, PW(c + 3, 0) + 8);
      [1, 2, 3].forEach((i) => { const t = PW(c + 1, i); wh.sing(t, t + 0.4); bubble(S, 1150, 520, 22 + i * 4, 220, { t }); });
      return [1330, 560]; } },
  { c: 12, from: "blue", to: "yellow", name: "YELLOW", card: [900, 150], set: (S) => beach(S),
    friend: (S, D, c, T) => {   // the yellow sun rises "up so high" and shines
      const sn = sunny(S, 1470, 380, 120);
      tw(sn.g, T - 0.5, PW(c + 1, 0) - T + 0.5, "translate(0 420)", "translate(0 0)", "sine.out");
      sn.shine(T, T + 40);
      return [1470, 420]; } },
  { c: 17, from: "yellow", to: "green", name: "GREEN", card: [1420, 200], set: (S) => { sea(S, { coral: false, weeds: [[150, 0.9], [290, 0.65], [1640, 0.75], [1790, 1]] }); bubbles(S, 6, 97); },
    friend: (S, D, c, T) => {   // green turtle: slow, slow, slow ... then hops "go, go, go"
      const tt = turtle(S, 1760, 930, 1.25);
      tt.pos.setAttribute("transform", "translate(1760 930) scale(-1.25 1.25)");
      tw(tt.pos, T, PW(c + 1, 0) - T, "translate(1760 930) scale(-1.25 1.25)", "translate(1480 930) scale(-1.25 1.25)", "sine.out");
      tt.dance(PW(c, 4), PW(c + 1, 0));
      [1, 2, 3, 4].forEach((i) => hopUp(S, tt.pos, 1480, 930, 1.25, PW(c + 1, i + 1) - 0.1, 36, -1));
      return [1480, 800]; } },
  { c: 22, from: "green", to: "purple", name: "PURPLE", card: [1420, 200], set: (S) => { sea(S, { hills: "purple", coral: false }); bubbles(S, 6, 131); },
    friend: (S, D, c, T) => {   // purple shell on the sand; on "Hold it in your hand" Ollie lifts it up
      const sh = sandShell(S, 1400, 940, 3.0, PW(c, 0));
      sparkle(S, 1400, 830, PW(c, 2), 1); sparkle(S, 1480, 880, PW(c, 3) + 0.2, 0.7);
      S.fadeOut(sh.o, PW(c + 1, 0) + 0.1, 0.35);
      const t = PW(c + 1, 0) - 0.3, tips = D.all.map((O) => O.holdAt(armOf(O, 1, -1), -330, t, 0.7)), [tx, ty] = tips[0];
      const [, g] = popIn(S, PW(c + 1, 1), tx, ty - 20, D.A.body);
      scallop(S, g, tx + 8, ty + 28, 1.5, "purple");
      return [1400, 800]; } },
];

const E = [PCLIP(7)[0] - 0.3, PCLIP(12)[0] - 0.3, PCLIP(17)[0] - 0.3, PCLIP(22)[0] - 0.3, PCLIP(27)[0] - 0.3];
passes.forEach((p, i) => {
  const c = p.c, T = i ? E[i - 1] : 0, S = scene(T, E[i], { cam: "none" }), ans = c + 4;
  p.set(S);
  const D = duo(S, p.from, p.to, PW(ans, 0) + 0.3);
  const [fx, fy] = p.friend(S, D, c, T);
  D.each((O) => {
    O.bob(T + 0.3, S.end - 0.3, 8);
    O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], PW(c, 0), PW(c + 2, 0) - 0.4, 10);
    O.sing(PW(c + 2, 0), PWE(c + 2, 4)); O.sing(PW(c + 3, 0), PWE(c + 3, 4));
    O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], PWE(c + 3, 4) + 0.6, PW(ans, 0) - 0.1, 14);
    O.hop(PWE(c + 3, 4) + 0.5, 50); O.hop(PWE(c + 3, 4) + 2.7, 60);
  });
  if (i === 0) {   // wordless intro: Ollie waves hello, "Ooh! Colours!"
    D.each((O) => { [armOf(O, 1, 1), armOf(O, 1, -1)].forEach((A) => O.raise(A, 120, T + 0.6, 0.6)); O.wiggle([3, 4], T + 1.2, PW(2, 0) - 0.3, 20); O.sing(PW(1, 0), PWE(1, 0)); [armOf(O, 1, 1), armOf(O, 1, -1)].forEach((A) => O.raise(A, 0, PW(2, 0) - 0.3, 0.6)); });
    S.fadeOut(DS.card(S, "COLOURS!", 960, 190, { size: DS.type.title, t: PW(1, 1) }).g, PW(2, 0) - 0.9, 0.4);
    mid(S, T + 1.8); wide(S, PW(2, 0) - 0.5);
  } else wide(S, T);
  S.fadeOut(DS.card(S, p.name, ...p.card, { size: DS.type.title, t: PW(c, 0), fill: p.to }).g, PW(c + 1, 0) - 0.55, 0.4);
  toward(S, fx, fy, 1.3, PW(c + 1, 0) - 0.4); close(S, PW(c + 2, 0) - 0.5);
  mid(S, PW(c + 3, 0) - 0.4); wide(S, PWE(c + 3, 4) + 0.6);
  kidsAsk(S, PW(c + 3, 1), PW(ans, 0) - 0.2);
  mid(S, PW(ans, 0) - 3.6, 1.25);
  change(S, D, p.to, PW(ans, 0));
  S.fadeOut(DS.card(S, p.name + "!", p.card[0], p.card[1] + 60, { size: DS.type.title, t: PW(ans, 0) + 0.3, fill: p.to }).g, S.end - 0.3, 0.3);
  DS.vignette(S);
});

// ---- chorus: everyone on the beach; each friend hops on its colour word; Ollie turns pink on "pink"; rainbow; bye ----
const rainbow = (S, t) => [["red", 0], ["yellow", 1], ["green", 2], ["blue", 3], ["purple", 4], ["pink", 5]].forEach(([n, i]) => {
  const r1 = 560 - i * 34, r2 = r1 - 30, cx = 960, cy = 700;
  S.fill(`M${cx - r1} ${cy} A${r1} ${r1} 0 0 1 ${cx + r1} ${cy} L${cx + r2} ${cy} A${r2} ${r2} 0 0 0 ${cx - r2} ${cy} Z`, t + i * 0.3, 0.5, DS.c(n, 0, "mid"), 0.9);
});
const gather = (S, T, o = {}) => {
  beach(S);
  if (o.rb !== undefined) rainbow(S, o.rb);
  const sn = sunny(S, 1500, 330, 105); sn.shine(T, T + 40);
  const wh = whale(S, 1560, 618, 0.3); wh.sway(T, S.end - 0.3);
  sandShell(S, 330, 950, 2.4, S.start);
  const D = duo(S, o.from, o.to, o.tc);
  const cb = pal({ orange: "red" }, () => crab(S, 1310, 925, 0.95)), tt = turtle(S, 1670, 935, 0.95);
  tt.pos.setAttribute("transform", "translate(1670 935) scale(-0.95 0.95)");
  return { D, sn, wh, cb, tt };
};

{ const T = E[4], S = scene(T, PCLIP(31)[0] - 0.3, { cam: "none" }), c = 27;   // red, blue, yellow, green (x2)
  const { D, sn, wh, cb, tt } = gather(S, T, { from: "purple" });
  D.each((O) => { O.bob(T + 0.3, S.end - 0.3, 8); O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], T, S.end - 0.4, 12); });
  [27, 29].forEach((cc) => {
    cb.clap(PW(cc, 0)); cb.clap(PW(cc, 0) + 0.4);
    wh.sing(PW(cc, 1), PW(cc, 1) + 0.5);
    tw(sn.g, PW(cc, 2), 0.7, "translate(0 0)", "translate(0 -22)", hump(1));
    hopUp(S, tt.pos, 1670, 935, 0.95, PW(cc, 3), 40, -1);
    [28, 30].includes(cc + 1) && [1, 2].forEach((i) => sparkle(S, 700 + i * 220, 330 + i * 40, PW(cc + 1, 1) + i * 0.4, 0.8));
  });
  S.fadeOut(DS.card(S, "RED  BLUE  YELLOW  GREEN", 960, 150, { size: DS.type.title, t: PW(27, 0) - 0.1 }).g, PW(28, 0) - 0.2, 0.4);
  wide(S, T); mid(S, PW(28, 0) - 0.4); wide(S, PW(29, 0) - 0.4); mid(S, PW(30, 0) - 0.4, 1.15);
  DS.vignette(S); }

{ const T = PCLIP(31)[0] - 0.3, S = scene(T, PCLIP(33)[0] - 0.3, { cam: "none" });   // purple, pink, hooray / colours every day
  const { D, sn, wh, cb, tt } = gather(S, T, { from: "purple", to: "pink", tc: PW(31, 1) + 0.3, rb: PW(32, 0) });
  D.each((O) => { O.bob(T + 0.3, S.end - 0.3, 8); O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], T, S.end - 0.4, 14); });
  sparkle(S, 330, 820, PW(31, 0), 1);
  change(S, D, "pink", PW(31, 1));
  [PW(31, 2), PW(32, 2)].forEach((t) => { cb.clap(t); hopUp(S, tt.pos, 1670, 935, 0.95, t, 40, -1); tw(sn.g, t, 0.7, "translate(0 0)", "translate(0 -22)", hump(1)); });
  mid(S, T + 0.2, 1.15); wide(S, PW(32, 0) - 0.6);
  DS.vignette(S); }

{ const T = PCLIP(33)[0] - 0.3, S = scene(T, TOTAL, { cam: "none" });   // hook close-up, "Pink as pink can be!", bye-bye
  const { D, sn, wh, cb, tt } = gather(S, T, { from: "pink", rb: S.start - 5 });
  D.each((O) => {
    O.bob(T + 0.3, S.end - 0.3, 8);
    O.sing(PW(33, 0), PWE(33, 4)); O.sing(PW(34, 0), PWE(34, 4)); O.grin(PW(35, 0));
    O.wiggle([1, 2, 5, 6, 7, 8], T, S.end - 0.4, 12);
    [armOf(O, 1, 1), armOf(O, 1, -1)].forEach((A) => O.raise(A, 120, PW(35, 0) - 0.5, 0.6)); O.wiggle([3, 4], PW(35, 0), S.end - 1, 20);
  });
  cb.clap(PW(35, 0)); cb.clap(PW(35, 0) + 0.6); hopUp(S, tt.pos, 1670, 935, 0.95, PW(35, 1), 40, -1);
  close(S, T); mid(S, PW(34, 0) - 0.4, 1.25); wide(S, PW(35, 0) - 0.6);
  S.fadeOut(DS.card(S, "BYE-BYE!", 960, 150, { size: DS.type.title, t: PW(35, 0) }).g, PW(35, 0) + 2.2, 0.4);
  S.text("Tiny Tune Town", 960, 130, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: PW(35, 0) + 2.6 });
  DS.vignette(S); }
