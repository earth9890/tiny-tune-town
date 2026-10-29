// look: still
// @include ../../tools/cast.js
// @include chars.js
// 21 Jack and Jill (traditional, 1765; Mother Goose 1916). A sunny hill with a path up to the well. Ollie (two pails in two arms) and Bibi (one pail)
// follow Jack and Jill up the hill. Jack trips on a pebble (soft grass, a little "oh!"), Jill tumbles after; Ollie dabs a bandage on Jack's crown
// (one, two, three), the hug, hold hands, walk up again with careful steps (Ollie's face on each "Step by step" tag), dip the pails (Ollie carries four),
// and home again, pails full, under a rainbow. Camera: wide -> mid -> face close-up on every tag. No hard cuts, nothing under 4 s, no flashing.
// ---- take remap (planned line -> sung clip number, or {t: seconds} for a break the singer dropped) ----
const PLAN = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30, 33, 34];
const PWN = (c) => TIMING.words.filter((x) => x[0] === PLAN[c]).length;
const PW = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + i * 0.3 : W(PLAN[c], Math.min(i, PWN(c) - 1)));
const PCLIP = (c) => (typeof PLAN[c] === "object" ? [PLAN[c].t, PLAN[c].t + 1.2] : CLIP(PLAN[c]));
const PWE = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + 0.4 + i * 0.3 : WE(PLAN[c], Math.min(i, PWN(c) - 1)));

BEAT = 60 / 96;
const view = (S, x, y, k, t, dur = 1.3) => (k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const wide = (S, t) => view(S, 960, 540, 1, t);
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const singLine = (A, c) => TIMING.words.filter((w) => w[0] === PLAN[c]).forEach((w) => A(w[3], w[3] + 0.6 * (w[4] - w[3])));
const card = (S, s, x, y, t, out, size = DS.type.title, fill) => S.fadeOut(DS.card(S, s, x, y, { size, t, fill }).g, out, 0.4);
const T = (c) => PW(c, 0);
const BND = [0, T(2) - 0.4, T(4) - 0.4, T(6) - 0.4, T(9) - 0.4, T(11) - 0.4, T(14) - 0.4, T(16) - 0.4, T(19) - 0.4, T(21) - 0.4, T(26) - 0.4, T(30) - 0.4, TOTAL];

// ---------- where everybody stands at the start of each scene: [x, ground y, k] ----------
const KJ = 0.78, KO = 0.8, KB = 0.62;                                  // base sizes at the foot of the hill
const SITE = { J: [880, 780, 0.66], Ji: [975, 800, 0.69] };             // where Jack and Jill land
const LY = {
  a: { J: [930, 880, KJ], Ji: [1100, 880, KJ], O: [470, 950, KO], B: [1500, 940, KB] },            // intro, start of the climb
  b: { J: [880, 780, 0.66], Ji: [1030, 780, 0.66], O: [540, 900, 0.72], B: [1440, 890, 0.58] },     // end of the climb, the pebble
  d: { J: SITE.J, Ji: SITE.Ji, O: [658, 900, 0.72], B: [1190, 850, 0.6] },                            // the bump has happened, friends are here
  g: { J: [888, 780, 0.66], Ji: [1005, 792, 0.69], O: [730, 900, 0.72], B: [1120, 858, 0.6] },       // after the hug
  w: { J: [900, 640, 0.42], Ji: [1010, 640, 0.42], O: [600, 800, 0.62], B: [1330, 790, 0.5] },       // at the well
  h: { J: [880, 800, 0.62], Ji: [1010, 800, 0.62], O: [600, 900, 0.72], B: [1330, 890, 0.58] },     // coming back down
  f: { J: [770, 930, 0.8], Ji: [940, 930, 0.8], O: [370, 960, 0.8], B: [1250, 940, 0.64] },         // home, bye-bye line-up
};
const WELL = [960, 556, 0.5], PEB = [838, 800, 0.9];

// the set: sky, hill, path, well, trees. o.front = flowers in the foreground; o.rainbow = fade time
const setup = (S, o = {}) => {
  hill(S);
  cloud(S, 330, 150, 1.1); cloud(S, 1300, 120, 0.9);
  tree(S, 190, 700, 0.9); tree(S, 1760, 690, 0.8); bush(S, 420, 730, 0.7); bush(S, 1560, 720, 0.75);
  well(S, ...WELL);
  if (o.pebble !== false) pebble(S, ...PEB);
  if (o.rainbow !== undefined) rainbow(S, 960, 590, 560, o.rainbow);
};
const front = (S) => flowers(S, [[80, 985, "pink"], [1850, 980, "yellow"], [210, 1010, "orange"], [1710, 1010, "pink"]]);
// a pail lying on its side on the grass (empty)
const lying = (S, x, y, k, name, rot, t) => { const g = G(S, null, `rotate(${rot} ${x} ${y - 30 * k})`); pail(S, g, x, y, k, name); if (t) fadeIn(S, g, t); return g; };
// a pail that rolls away from where it was dropped: appears at t, lands on its side
const rollPail = (S, x, y, k, name, t, dx, dy, rot) => {
  const o = G(S, null, "translate(0 0)"); o.setAttribute("opacity", 0); pail(S, o, x, y, k, name);
  tl.set(o, { opacity: 1 }, t); S.move(o, t, 1.0, { x: dx, y: dy, rotation: rot, svgOrigin: `${x} ${y - 30 * k}` }, "power2.out"); return o;
};

// all four friends. st: { J, Ji, O, B: [x, y, k], sit, bandage, jpails: "hidden" | false, opails: [[ai, side, colour]], bpail, water }
const people = (S, st) => {
  const P = {};
  const kp = (st.jpails === false) ? false : (st.jpails || true);
  P.J = kid(S, ...st.J, { pail: kp, bandage: st.bandage, sit: st.sit, look: 5 });
  P.Ji = kid(S, ...st.Ji, { jill: true, pail: kp, sit: st.sit, look: -5 });
  P.mJ = mover(S, st.J[0], st.J[1], [P.J.sd, P.J.pos]); P.mJi = mover(S, st.Ji[0], st.Ji[1], [P.Ji.sd, P.Ji.pos]);
  const [ox, oy, ok] = st.O, n = S.g.children.length;
  P.O = ollie(S, ox, oy, ok, { mouth: "smile", look: st.olook ?? 6 });
  P.mO = mover(S, ox, oy, [S.g.children[n], P.O.pos]);
  P.pails = (st.opails || []).map(([ai, side, c]) => { const A = arm(P.O, ai, side); return pail(S, A.wig, A.tip[0] + side * 2, A.tip[1] + 117 * 0.78, 0.78, c); });
  if (st.water) P.pails.forEach((p) => p.water.setAttribute("opacity", 1));
  const [bx, by, bk] = st.B, pk = bk * 1.05, bsd = DS.shadow(S, bx, by, 270 * bk);
  P.B = bibi(S, bx, by - 325 * bk, { k: bk, mood: "joy", paws: [[bx - 110 * bk, by - 325 * bk + 290 * bk], [bx + 112 * bk, by - 117 * pk]] });
  P.bp = pail(S, P.B.g, bx + 112 * bk, by - 4, pk, "green");
  if (st.water) P.bp.water.setAttribute("opacity", 1);
  P.mB = mover(S, bx, by, [bsd, P.B.g]);
  return P;
};
// a steady walk: everyone bounces on the beat while they move
const walkBounce = (P, t0, t1) => { P.J.bounce(t0, t1, 9); P.Ji.bounce(t0 + 0.1, t1, 9); P.O.bob(t0, t1, 10); tw(P.B.g, t0, t1 - t0, "translate(0 0)", "translate(0 -9)", hump(cyc(t1 - t0, BEAT))); };
const faceAt = (P) => [P.mO.x, P.mO.y - 330 * P.O.k * P.mO.s];

// ================= 0  intro: the hill, "Up the hill!" =================
{ const [a, b] = [BND[0], BND[1]], S = scene(a, b, { cam: "none" });
  setup(S);
  const P = people(S, Object.assign({ opails: [[0, 1, "blue"], [0, -1, "orange"]] }, LY.a));
  P.O.bob(a + 0.4, b - 0.2, 8); P.J.bounce(a + 0.4, b - 0.2, 5); P.Ji.bounce(a + 0.5, b - 0.2, 5);
  singLine(P.O.sing, 1);
  swing(S, P.B.L, a + 1, b - 0.3, { rotation: 10, svgOrigin: P.B.L.sh }, BEAT);
  card(S, "UP THE HILL!", 960, 190, a + 0.6, b - 0.9);
  view(S, 960, 640, 1.18, a + 0.5, Math.max(2, b - a - 1.2));
  front(S); DS.vignette(S); }

// ================= 1  "Jack and Jill went up the hill, to fetch a pail of water": the climb =================
{ const [a, b] = [BND[1], BND[2]], S = scene(a, b, { cam: "none" });
  setup(S);
  const P = people(S, Object.assign({ opails: [[0, 1, "blue"], [0, -1, "orange"]] }, LY.a));
  const d = b - a - 0.8, t0 = a + 0.3;
  const kb = LY.b;
  P.mJ.go(kb.J[0], kb.J[1], kb.J[2] / KJ, t0, d); P.mJi.go(kb.Ji[0], kb.Ji[1], kb.Ji[2] / KJ, t0, d);
  P.mO.go(kb.O[0], kb.O[1], kb.O[2] / KO, t0, d); P.mB.go(kb.B[0], kb.B[1], kb.B[2] / KB, t0, d);
  walkBounce(P, t0, t0 + d);
  singLine(P.O.sing, 2); singLine(P.O.sing, 3);
  view(S, 940, 760, 1.35, T(2) + 0.4, 1.6); wide(S, T(3) + 0.8);
  front(S); DS.vignette(S); }

// ================= 2  "Jack fell down and bumped his crown, and Jill came tumbling after": a soft tumble =================
{ const [a, b] = [BND[2], BND[3]], S = scene(a, b, { cam: "none" });
  setup(S);
  const P = people(S, Object.assign({ opails: [[0, 1, "blue"], [0, -1, "orange"]] }, LY.b));
  P.O.bob(a + 0.2, b - 0.2, 6);
  singLine(P.O.sing, 4);
  const tj = PW(4, 1), tb = PW(4, 4), tl2 = PW(5, 2), [jx, jy, jk] = LY.b.J, [ix, iy, ik] = LY.b.Ji;
  // Jack trips on the pebble: tips over to the left, his pail rolls away, a little star on the bump, then he sits up with "oh"
  P.J.mouth(tj, "oh");
  tw(P.J.rock, tj, 0.7, "rotate(0 0 0)", "rotate(-78 0 0)", "power2.in");
  P.J.pail.hide(tj + 0.05); rollPail(S, jx - 118 * jk, jy - 26 * jk, 0.9 * jk, "red", tj + 0.05, -110, 22, -250);
  sparkle(S, jx - 150 * jk, jy - 190 * jk, tj + 0.6, 0.6);
  tw(P.J.rock, tj + 1.0, 0.7, "rotate(-78 0 0)", "rotate(0 0 0)", "back.out(1.4)"); P.J.sit(tj + 1.0, 0.7);
  view(S, 900, 700, 1.5, tj - 0.3, 1.4);
  // Jill tumbles after him: a gentle roll, her pail rolls off to the right, she lands sitting
  P.Ji.mouth(tl2, "oh");
  tw(P.Ji.rock, tl2, 1.4, "rotate(0 0 -190)", "rotate(-360 0 -190)", "power1.inOut");
  P.mJi.go(SITE.Ji[0], SITE.Ji[1], SITE.Ji[2] / ik, tl2, 1.4);
  P.Ji.pail.hide(tl2 + 0.05); rollPail(S, ix + 118 * ik, iy - 26 * ik, 0.9 * ik, "yellow", tl2 + 0.05, 130, 28, 250);
  P.Ji.sit(tl2 + 1.3, 0.5);
  P.Ji.mouth(tl2 + 2.0, "smile");
  // Ollie and Bibi notice and gasp ("oh!"): they look and lean in
  P.O.sing(tl2 + 0.2, tl2 + 1.2);
  wide(S, tl2 + 2.2);
  front(S); DS.vignette(S); }

// ================= 3  "Oh no!" + "Bandage on, one, two, three. There, that's better, see?" =================
{ const [a, b] = [BND[3], BND[4]], S = scene(a, b, { cam: "none" });
  setup(S);
  const st = Object.assign({ sit: true, jpails: false, opails: [[0, 1, "blue"], [0, -1, "orange"]] }, LY.d);
  st.B = LY.b.B; st.O = LY.b.O;
  const P = people(S, st);
  lying(S, 692, 800, 0.5, "red", 78); lying(S, 1240, 806, 0.5, "yellow", -76);
  P.J.mouth(a, "oh"); P.Ji.mouth(a, "oh");
  const [jx, jy, jk] = LY.d.J;
  // Ollie and Bibi hurry over on "Oh no!"
  P.mB.go(LY.d.B[0], LY.d.B[1], LY.d.B[2] / LY.b.B[2], T(6) - 0.2, 3.2); tw(P.B.g, T(6) - 0.2, 3.2, "translate(0 0)", "translate(0 -10)", hump(5));
  P.O.sing(T(6), PWE(6, 1));
  // the bandage: Ollie's long arm reaches to Jack's crown, a plaster appears on "on", numbers 1 2 3 on the count
  const A = arm(P.O, 0, -1), tip = P.O.holdAt(A, -440, T(7) - 0.9, 0.7);
  P.mO.go(jx - tip[0] * LY.d.O[2] - 4, LY.d.O[1], 1, T(6) + 0.4, 2.4);
  P.J.bandage(PW(7, 1));
  P.O.raise(A, 0, PW(8, 0), 0.7);
  P.J.mouth(PW(7, 0), "smile"); P.Ji.mouth(PW(7, 0), "smile");
  [[2, "1"], [3, "2"], [4, "3"]].forEach(([wi, n], i) => card(S, n, jx + 60, 330, PW(7, wi), i < 2 ? PW(7, wi + 1) : PWE(7, 4) + 0.5, DS.type.title, "yellow"));
  sparkle(S, jx - 20, jy - 400 * jk * 0.8, PW(8, 0), 0.7); hearts(S, PW(8, 1), [[jx + 120, 430, 0.7]]);
  singLine(P.O.sing, 7); singLine(P.O.sing, 8);
  view(S, 760, 700, 1.15, T(6) + 0.6); view(S, jx + 20, 600, 1.55, T(7) - 0.6, 1.5); wide(S, PW(8, 3) + 0.5);
  front(S); DS.vignette(S); }

// ================= 4  "Step by step, nice and slow / Up and down we go!": the kids stand up, Ollie's face =================
{ const [a, b] = [BND[4], BND[5]], S = scene(a, b, { cam: "none" });
  setup(S);
  const st = Object.assign({ sit: true, bandage: true, jpails: "hidden", opails: [[0, 1, "blue"], [0, -1, "orange"]] }, LY.d);
  const P = people(S, st);
  const gA = lying(S, 692, 800, 0.5, "red", 78), gB = lying(S, 1240, 806, 0.5, "yellow", -76);
  const tp = T(9) + 0.2;
  S.fadeOut(gA, tp, 0.3); S.fadeOut(gB, tp, 0.3); P.J.pail.show(tp + 0.2); P.Ji.pail.show(tp + 0.2);
  P.J.stand(tp, 0.6); P.Ji.stand(tp + 0.1, 0.6); P.J.hop(tp, 20); P.Ji.hop(tp + 0.1, 20);
  P.mJ.go(LY.d.J[0] + 2, LY.d.J[1], 1, tp, 0.5);
  P.O.bob(a, b - 0.2, 8); singLine(P.O.sing, 9); singLine(P.O.sing, 10);
  view(S, ...faceAt(P), 2.1, T(9) - 0.5, 1.2); wide(S, PW(10, 0) + 0.3);
  swing(S, P.B.R, T(10), b - 0.3, { rotation: -12, svgOrigin: P.B.R.sh }, BEAT);
  front(S); DS.vignette(S); }

// ================= 5  "Hug time!" "A hug for Jack, a hug for Jill / Hold hands, up the hill" =================
{ const [a, b] = [BND[5], BND[6]], S = scene(a, b, { cam: "none" });
  setup(S);
  const P = people(S, Object.assign({ bandage: true, opails: [], jpails: true }, LY.d));
  const [jx, jy] = LY.d.J, [ox] = LY.d.O, ok = LY.d.O[2];
  // Ollie's four right arms wrap round the kids, hearts pop, Bibi hugs Jill; then everybody takes hands
  P.mO.go(LY.g.O[0], LY.g.O[1], 1, T(11) + 0.2, 1.3);
  const hug = [[0, -420], [1, -400], [2, -380], [3, -360]];
  hug.forEach(([ai, ty], i) => { const A = arm(P.O, ai, -1); P.O.holdAt(A, ty, PW(12, 0) - 0.8 + i * 0.12, 0.7); P.O.raise(A, 0, PW(13, 0) - 0.2, 0.6); });
  [[0, 1], [1, 1]].forEach(([ai, side]) => { const A = arm(P.O, ai, side); P.O.raise(A, 70, PW(12, 2), 0.6); P.O.wiggle([ai * 2 + 1], PW(12, 2), PW(13, 0), 14, BEAT / 2); P.O.raise(A, 0, PW(13, 0), 0.6); });
  P.O.sing(T(11), PWE(11, 1)); singLine(P.O.sing, 12); singLine(P.O.sing, 13);
  hearts(S, PW(12, 1), [[jx + 20, 430, 1], [jx + 130, 400, 1.2], [jx + 240, 450, 0.9]]);
  P.mB.go(LY.g.B[0], LY.g.B[1], 1, PW(12, 5), 1.4);
  P.mJ.go(LY.g.J[0], LY.g.J[1], 1, PW(13, 0), 1.2); P.mJi.go(LY.g.Ji[0], LY.g.Ji[1], 1, PW(13, 0), 1.2);
  P.J.bounce(PW(12, 0), b - 0.3, 6); P.Ji.bounce(PW(12, 0) + 0.2, b - 0.3, 6);
  view(S, 860, 640, 1.4, T(11) + 0.4, 1.6); wide(S, PW(13, 1) - 0.3);
  front(S); DS.vignette(S); }

// ================= 6  "Step by step, nice and slow / Up and down we go!": careful steps up the hill, Ollie's face =================
{ const [a, b] = [BND[6], BND[7]], S = scene(a, b, { cam: "none" });
  setup(S, { pebble: true });
  const P = people(S, Object.assign({ bandage: true, opails: [[0, 1, "blue"], [0, -1, "orange"]] }, LY.g));
  const d = b - a - 0.6, w = LY.w;
  P.mJ.go(w.J[0], w.J[1], w.J[2] / LY.g.J[2], a + 0.3, d); P.mJi.go(w.Ji[0], w.Ji[1], w.Ji[2] / LY.g.Ji[2], a + 0.3, d);
  P.mO.go(w.O[0], w.O[1], w.O[2] / LY.g.O[2], a + 0.3, d); P.mB.go(w.B[0], w.B[1], w.B[2] / LY.g.B[2], a + 0.3, d);
  walkBounce(P, a + 0.3, a + 0.3 + d);
  singLine(P.O.sing, 14); singLine(P.O.sing, 15);
  // close-up on Ollie's face (he walks along, so follow him halfway)
  view(S, 700, 560, 2.0, T(14) - 0.2, 1.2); view(S, 800, 640, 1.2, PW(15, 0) - 0.2, 1.6);
  front(S); DS.vignette(S); }

// ================= 7  "Splash!" "Dip the pail, in it goes / Splash, splash, water flows": at the well =================
{ const [a, b] = [BND[7], BND[8]], S = scene(a, b, { cam: "none" });
  setup(S, { pebble: false });
  const P = people(S, Object.assign({ bandage: true, opails: [[0, 1, "blue"], [0, -1, "orange"]] }, LY.w));
  const w = WELL;
  P.O.bob(a, b - 0.2, 6);
  // the second pair of pails pops into Ollie's hands on "Dip the pail": he carries four!
  const extra = [[1, 1, "purple"], [1, -1, "red"]].map(([ai, side, c]) => { const A = arm(P.O, ai, side), p = pail(S, A.wig, A.tip[0] + side * 2, A.tip[1] + 117 * 0.78, 0.78, c); tl.fromTo(p.g, { opacity: 0 }, { opacity: 1, duration: 0.35, immediateRender: false }, PW(17, 0)); return p; });
  const all = [P.J.pail, P.Ji.pail, ...P.pails, P.bp, ...extra];
  all.forEach((p, i) => p.fill(PW(17, 4) + i * 0.15));
  // the kids lean in to the well and splash drops fly
  tw(P.J.rock, PW(17, 1), 0.6, "rotate(0 0 0)", "rotate(7 0 0)"); tw(P.Ji.rock, PW(17, 1), 0.6, "rotate(0 0 0)", "rotate(-7 0 0)");
  [0, 1, 2, 3].forEach((i) => { drop(S, w[0] - 60 + i * 40, w[1] - 70, PW(18, 0) + i * 0.35, 1); drop(S, w[0] + 50 - i * 30, w[1] - 80, PW(18, 1) + i * 0.3, 0.9); });
  [0, 1, 2].forEach((i) => sparkle(S, w[0] - 40 + i * 40, w[1] - 80, PW(18, 2) + i * 0.3, 0.4));
  card(S, "SPLASH!", 960, 420, PW(16, 0), PWE(17, 5) + 0.3, DS.type.title, "sky");
  singLine(P.O.sing, 17); singLine(P.O.sing, 18);
  P.J.mouth(PW(17, 0), "open"); P.J.mouth(PWE(18, 3), "smile"); P.Ji.mouth(PW(17, 0), "open"); P.Ji.mouth(PWE(18, 3), "smile");
  view(S, 940, 620, 1.7, a + 0.6, 1.6); view(S, 880, 680, 1.25, PW(18, 0) + 1.2, 1.6);
  front(S); DS.vignette(S); }

// ================= 8  "Step by step, nice and slow / Up and down we go!": pails full, Ollie's face =================
{ const [a, b] = [BND[8], BND[9]], S = scene(a, b, { cam: "none" });
  setup(S, { pebble: false });
  const P = people(S, Object.assign({ bandage: true, water: true, opails: [[0, 1, "blue"], [0, -1, "orange"], [1, 1, "purple"], [1, -1, "red"]] }, LY.w));
  P.J.pail.water.setAttribute("opacity", 1); P.Ji.pail.water.setAttribute("opacity", 1);
  P.O.bob(a, b - 0.2, 8); P.J.bounce(a, b - 0.2, 6); P.Ji.bounce(a + 0.1, b - 0.2, 6);
  singLine(P.O.sing, 19); singLine(P.O.sing, 20);
  [0, 1, 2].forEach((i) => sparkle(S, 700 + i * 60, 560 + (i % 2) * 40, PW(19, 1) + i * 0.5, 0.5));
  view(S, ...faceAt(P), 2.1, T(19) - 0.5, 1.2); wide(S, PW(20, 0) + 0.3);
  front(S); DS.vignette(S); }

// ================= 9  "Hooray!" + "Jack and Jill went up the hill ... Jack stood tall, no fall at all, and Jill came skipping after" =================
{ const [a, b] = [BND[9], BND[10]], S = scene(a, b, { cam: "none" });
  setup(S, { rainbow: T(21) });
  const P = people(S, Object.assign({ bandage: true, water: true, opails: [[0, 1, "blue"], [0, -1, "orange"], [1, 1, "purple"], [1, -1, "red"]] }, LY.w));
  P.J.pail.water.setAttribute("opacity", 1); P.Ji.pail.water.setAttribute("opacity", 1);
  const h = LY.h, d = Math.max(4, T(26) - 0.5 - a - 2.2);
  P.mJ.go(h.J[0], h.J[1], h.J[2] / LY.w.J[2], a + 2, d); P.mJi.go(h.Ji[0], h.Ji[1], h.Ji[2] / LY.w.Ji[2], a + 2, d);
  P.mO.go(h.O[0], h.O[1], h.O[2] / LY.w.O[2], a + 2, d); P.mB.go(h.B[0], h.B[1], h.B[2] / LY.w.B[2], a + 2, d);
  walkBounce(P, a + 2, a + 2 + d);
  singLine(P.O.sing, 21); P.O.hop(T(21), 40);
  [0, 1, 2].forEach((i) => hearts(S, PW(21, 0) + 0.2 * i, [[820 + i * 160, 380, 0.8]]));
  singLine(P.O.sing, 22); singLine(P.O.sing, 23); singLine(P.O.sing, 24); singLine(P.O.sing, 25);
  P.J.hop(PW(24, 0), 40); P.J.hop(PW(24, 3), 40);                      // Jack stood tall: steps proud
  P.Ji.hop(PW(25, 2), 50); P.Ji.hop(PW(25, 3), 50);                     // Jill skipping
  P.J.mouth(PW(24, 0), "open"); P.J.mouth(PWE(24, 6), "smile");
  view(S, 940, 700, 1.3, T(22) + 0.5, 1.6); wide(S, T(24) - 0.5); view(S, 900, 720, 1.5, PW(25, 0) - 0.3, 1.4);
  front(S); DS.vignette(S); }

// ================= 10  "Pail is full, hip hooray / Home we walk, what a day / Step by step, nice and slow / Up and down we go!" =================
{ const [a, b] = [BND[10], BND[11]], S = scene(a, b, { cam: "none" });
  setup(S, { rainbow: a, pebble: false });
  const P = people(S, Object.assign({ bandage: true, water: true, opails: [[0, 1, "blue"], [0, -1, "orange"], [1, 1, "purple"], [1, -1, "red"]] }, LY.h));
  P.J.pail.water.setAttribute("opacity", 1); P.Ji.pail.water.setAttribute("opacity", 1);
  const f = LY.f, d = b - a - 1.0;
  P.mJ.go(f.J[0], f.J[1], f.J[2] / LY.h.J[2], a + 0.4, d); P.mJi.go(f.Ji[0], f.Ji[1], f.Ji[2] / LY.h.Ji[2], a + 0.4, d);
  P.mO.go(f.O[0], f.O[1], f.O[2] / LY.h.O[2], a + 0.4, d); P.mB.go(f.B[0], f.B[1], f.B[2] / LY.h.B[2], a + 0.4, d);
  walkBounce(P, a + 0.4, a + 0.4 + d);
  [26, 27, 28, 29].forEach((c) => singLine(P.O.sing, c));
  view(S, 940, 720, 1.25, T(26) + 0.3, 1.6); wide(S, T(27) + 1.5);
  view(S, 420, 640, 2.0, T(28) - 0.4, 1.3); wide(S, PW(29, 0) + 0.6);
  front(S); DS.vignette(S); }

// ================= 11  "Bye-bye! Splash!": the whole group waves, a last splash, end card =================
{ const [a, b] = [BND[11], BND[12]], S = scene(a, b, { cam: "none" });
  setup(S, { rainbow: a, pebble: false });
  const P = people(S, Object.assign({ bandage: true, water: true, opails: [[0, 1, "blue"], [0, -1, "orange"], [1, 1, "purple"], [1, -1, "red"]] }, LY.f));
  P.J.pail.water.setAttribute("opacity", 1); P.Ji.pail.water.setAttribute("opacity", 1);
  const t = T(30);
  P.O.bob(a, b - 0.3, 8); P.O.grin(t); [arm(P.O, 3, 1), arm(P.O, 3, -1)].forEach((A) => P.O.raise(A, 120, t - 0.6, 0.6)); P.O.wiggle([7, 8], t, b - 1, 14, BEAT);
  P.J.wave(-1, t, b - 1); P.Ji.wave(1, t, b - 1);
  swing(S, P.B.L, t, b - 1, { rotation: 14, svgOrigin: P.B.L.sh }, BEAT);
  P.J.mouth(t, "open"); P.Ji.mouth(t, "open");
  singLine(P.O.sing, 30);
  hearts(S, t, [[420, 520, 1], [960, 440, 1.2], [1500, 520, 0.9]]);
  const end = Math.min(b - 4.5, PWE(30, 1) + 1.5);
  card(S, "BYE-BYE!", 960, 380, end, b + 1);
  S.text("Tiny Tune Town", 960, 520, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: end + 0.6 });
  view(S, 960, 700, 1.1, a + 0.5, Math.max(2, b - a - 3));
  front(S); DS.vignette(S); }
