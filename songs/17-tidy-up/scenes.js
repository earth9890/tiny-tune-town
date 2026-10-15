// look: still
// @include ../../tools/cast.js
// 17 Tidy Up Time (original). A happily messy playroom: each pass one kind of toy hops home on its sound words
// (blocks -> toy box, books -> shelf, cars -> garage, teddy -> bed), Bibi arrives to help on pass 2, then Ollie's eight arms
// grab the last eight toys at once and send them home. Payoff: a sparkly tidy room and high fives.
// Camera per pass: break insert -> wide (toys hop) -> mid (pick it up) -> insert on the home -> face close-up on the tag.
BEAT = 60 / 100;
// clip numbers in script.json (the sung take, seed 21): the 4 lines of each pass, then the finale's first line
const PS = [[4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], [17, 18, 19, 20]], FIN = 21;
const tagEnd = (L) => CLIP(L[3])[1];
const COL = ["red", "sky", "yellow", "grass", "orange", "purple", "blue", "pink"];

// ---------- camera: centre (x, y) at zoom k (clamped to the drawn room, so edges never show) ----------
const look = (S, x, y, k, t, dur = 1.3) => {
  if (k <= 1.001) return S.zoom(960, 540, 1, t, dur);
  const hw = 960 / k, hh = 540 / k;
  x = Math.min(Math.max(x, -200 + hw), 2120 - hw); y = Math.min(Math.max(y, -200 + hh), 1280 - hh);
  S.zoom((x * k - 960) / (k - 1), (y * k - 540) / (k - 1), k, t, dur);
};
const wide = (S, t, dur) => look(S, 960, 540, 1, t, dur);
const close = (S, t) => look(S, 960, 520, 1.55, t);

// ---------- toys (drawn around their centre; a toy = one group moved by translate/rotate/scale) ----------
const TF = (p) => `translate(${K(p[0])} ${K(p[1])}) rotate(${K(p[2] || 0)}) scale(${p[3] ?? 1})`;
const star5 = (r1, r2, cx = 0, cy = 0) => "M" + Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? r2 : r1; return `${K(cx + Math.cos(a) * r)} ${K(cy + Math.sin(a) * r)}`; }).join(" L") + " Z";
let CUR;   // the toy group DRAW is filling
const sh = (S, d, c, o = {}) => DS.shape(S, d, c, Object.assign({ parent: CUR, w: "mid" }, o));
const draw = (S, kind, g, c) => { CUR = g; DRAW[kind](S, g, c); };
const DRAW = {
  block: (S, g, c) => { sh(S, rrect(-28, -28, 56, 56, DS.r.xs), c); S.fill(rrect(-15, -15, 30, 30, DS.r.xs), S.start, 0, DS.c(c, 1), 0.9, g); },
  book: (S, g, c) => { sh(S, rrect(-17, -55, 34, 110, DS.r.xs), c); S.draw("M-17 -40 H17 M-17 40 H17", S.start, 0, { c: DS.P.white[0], w: DS.w.detail, parent: g }); S.fill(rrect(-8, -22, 16, 32, DS.r.xs), S.start, 0, DS.P.white[0], 0.85, g); },
  car: (S, g, c) => {
    sh(S, rrect(-30, -32, 58, 30, DS.r.sm), c, { tone: 1 }); S.fill(rrect(-22, -27, 42, 18, DS.r.xs), S.start, 0, DS.c("glass", 2), 1, g);
    sh(S, rrect(-54, -8, 108, 30, DS.r.sm), c);
    [-30, 30].forEach((x) => { S.draw(circ(x, 24, 15), S.start, 0, { fill: DS.c("ink"), c: DS.line(), w: DS.w.detail, parent: g }); S.fill(circ(x, 24, 6), S.start, 0, DS.c("gray", 1), 1, g); });
  },
  teddy: (S, g) => {
    [[-26, -60], [26, -60]].forEach(([x, y]) => { sh(S, circ(x, y, 14), "earth"); S.fill(circ(x, y, 7), S.start, 0, DS.c("sand", 1), 1, g); });
    [[-34, 22], [34, 22], [-20, 64], [20, 64]].forEach(([x, y], i) => sh(S, circ(x, y, i < 2 ? 13 : 15, i < 2 ? 17 : 11), "earth"));
    sh(S, circ(0, 28, 34, 40), "earth"); S.fill(circ(0, 34, 19, 22), S.start, 0, DS.c("sand", 1), 1, g);
    sh(S, circ(0, -32, 36, 33), "earth"); S.fill(circ(0, -22, 15, 11), S.start, 0, DS.c("sand", 1), 1, g);
    [-13, 13].forEach((x) => S.fill(circ(x, -40, 5), S.start, 0, DS.c("ink"), 1, g));
    S.fill(circ(0, -27, 6, 4), S.start, 0, DS.c("ink"), 1, g);
    S.draw("M-7 -18 Q0 -13 7 -18", S.start, 0, { c: DS.line(), w: DS.w.detail, parent: g });
  },
  ball: (S, g) => { sh(S, circ(0, 0, 30), "red"); S.draw("M-29 -6 Q0 10 29 -6", S.start, 0, { c: DS.P.white[0], w: DS.w.near, parent: g }); S.fill(circ(-11, -14, 7, 5), S.start, 0, DS.P.white[0], 0.7, g); },
  duck: (S, g) => { sh(S, circ(-4, 10, 34, 22), "yellow"); sh(S, circ(14, -18, 19), "yellow"); sh(S, "M30 -22 L48 -15 L30 -9 Z", "orange", { w: "detail" }); S.fill(circ(18, -23, 4), S.start, 0, DS.c("ink"), 1, g); S.draw("M-22 6 Q-6 18 8 6", S.start, 0, { c: DS.c("yellow", 2), w: DS.w.detail, parent: g }); },
  drum: (S, g) => { sh(S, rrect(-30, -20, 60, 46, DS.r.xs), "red"); S.draw("M-30 -6 L-15 16 L0 -6 L15 16 L30 -6", S.start, 0, { c: DS.c("yellow"), w: DS.w.detail, parent: g }); sh(S, circ(0, -20, 30, 9), "white", { flat: true, w: "detail" }); },
  top: (S, g) => { sh(S, "M0 34 L-38 -2 Q0 -28 38 -2 Z", "purple"); S.draw("M-26 4 Q0 -12 26 4", S.start, 0, { c: DS.c("yellow"), w: DS.w.detail, parent: g }); sh(S, rrect(-6, -36, 12, 22, DS.r.xs), "gold", { w: "detail" }); },
  rings: (S, g) => {
    sh(S, rrect(-5, -42, 10, 70, DS.r.xs), "wood", { w: "detail" });
    [[14, 30, "red"], [0, 25, "orange"], [-13, 20, "yellow"], [-25, 15, "grass"]].forEach(([y, r, c]) => sh(S, circ(0, y, r, r * 0.36), c, { w: "detail" }));
    sh(S, rrect(-34, 24, 68, 12, DS.r.xs), "wood", { w: "detail" });
  },
  crayon: (S, g) => { sh(S, rrect(-44, -11, 74, 22, DS.r.xs), "blue"); sh(S, "M30 -11 L50 0 L30 11 Z", "blue", { tone: 1, w: "detail" }); S.draw("M-30 -11 V11 M18 -11 V11", S.start, 0, { c: DS.P.white[0], w: DS.w.detail, parent: g }); },
  boat: (S, g) => { sh(S, rrect(-3, -40, 6, 44, DS.r.xs), "wood", { w: "detail" }); sh(S, "M6 -36 L6 0 L36 0 Z", "white", { w: "detail" }); sh(S, "M-6 -30 L-6 0 L-28 0 Z", "yellow", { w: "detail" }); sh(S, "M-46 2 L46 2 L32 28 L-32 28 Z", "sky"); },
  star: (S, g) => { sh(S, star5(36, 17), "yellow"); [-7, 7].forEach((x) => S.fill(circ(x, -3, 3.5), S.start, 0, DS.c("ink"), 1, g)); S.draw("M-6 7 Q0 11 6 7", S.start, 0, { c: DS.line(), w: DS.w.detail, parent: g }); },
};
const SIZE = { block: 56, book: 34, car: 104, teddy: 76, ball: 60, duck: 80, drum: 60, top: 76, rings: 68, crayon: 96, boat: 92, star: 72 };
const HALF = { block: 28, book: 55, car: 39, teddy: 75, ball: 30, duck: 33, drum: 29, top: 34, rings: 36, crayon: 11, boat: 28, star: 33 };
// floor spot [x, y, rot, scale] and home spot for every toy; the floor band runs in front of Ollie, homes sit around the room
const TOYS = {
  blocks: [["block", "red", [440, 912, -6], [178, 790, 0, 0.9]], ["block", "blue", [502, 914, 9], [246, 788, 4, 0.9]], ["block", "yellow", [468, 859, 4], [314, 792, -5, 0.9]]],
  books: [["book", "purple", [688, 926, 90], [1322, 424, 0, 0.8]], ["book", "red", [700, 895, 83], [1352, 424, 0, 0.8]], ["book", "grass", [683, 866, 96], [1384, 426, 8, 0.8]]],
  cars: [["car", "red", [1455, 905, 0, 0.8], [1607, 902, 0, 0.6]], ["car", "blue", [1530, 932, -7, 0.8], [1687, 902, 0, 0.6]], ["car", "yellow", [1245, 935, 6, 0.8], [1767, 902, 0, 0.6]]],
  teddy: [["teddy", "earth", [1330, 880, -72, 0.9], [1478, 752, 0, 0.72]]],
  rest: [["ball", "red", [590, 910, 0], [200, 772, 0, 0.8]], ["duck", "yellow", [800, 912, -6], [262, 768, 8, 0.8]], ["crayon", "blue", [890, 935, 14], [330, 780, -20, 0.8]], ["rings", "red", [990, 906, 0], [150, 770, -6, 0.8]],
    ["drum", "red", [1090, 914, 4], [1330, 560, 0, 0.75]], ["boat", "sky", [1180, 912, -5], [1395, 566, 0, 0.75]], ["top", "purple", [1395, 912, 10], [1460, 560, 0, 0.75]], ["star", "yellow", [1520, 870, -14], [1500, 410, 6, 0.7]]],
};
const BEHIND = new Set(["books", "teddy"]);  // homes behind Ollie (shelf, bed): drawn before him once they're home

const toy = (S, rec, home) => {
  const [kind, c, fl, hm] = rec, p = home ? hm : fl, T = { kind, g: G(S, null, TF(p)), pos: p, home: hm };
  const lying = Math.abs(p[2] || 0) > 45, s = p[3] ?? 1;   // lying toys: their length is on the floor
  if (!home) T.sh = DS.shadow(S, p[0], p[1] + (lying ? SIZE[kind] / 2 : HALF[kind]) * s, (lying ? HALF[kind] * 2 : SIZE[kind]) * s * 1.1);
  draw(S, kind, G(S, T.g), c);
  return T;
};
// hop home in an arc that lands on t + dur (calm, no bounce); the floor shadow fades as it leaves
const hop = (S, T, t, to = T.home, h = 150, dur = 0.6) => {
  const a = T.pos, m = [(a[0] + to[0]) / 2, Math.min(a[1], to[1]) - h, ((a[2] || 0) + (to[2] || 0)) / 2, ((a[3] ?? 1) + (to[3] ?? 1)) / 2];
  tw(T.g, t, dur / 2, TF(a), TF(m), "power1.out"); tw(T.g, t + dur / 2, dur / 2, TF(m), TF(to), "power1.in");
  if (T.sh) S.fadeOut(T.sh, t, 0.25);
  T.pos = to;
};
const boing = (S, T, t, h = 22) => { const p = T.pos; tw(T.g, t - 0.15, 0.4, TF(p), TF([p[0], p[1] - h, p[2], p[3]]), hump(1)); };
const twinkle = (S, x, y, t, n = 3, r = 0.8) => [[-60, -40], [70, -60], [0, -100], [-80, 40], [80, 30]].slice(0, n).forEach(([dx, dy], i) => sparkle(S, x + dx, y + dy, t + i * 0.2, r));

// ---------- the playroom ----------
const PLAY = { wall: "sky", floor: "floor", window: [440, 170, 220, 230] };
const bunting = (S) => {
  const y = (x) => 112 + 64 * (1 - ((x - 960) / 600) ** 2);
  S.draw(smooth(Array.from({ length: 13 }, (_, i) => [360 + i * 100, y(360 + i * 100)])), S.start, 0, { c: DS.c("wood", 2, "mid"), w: DS.w.detail });
  for (let i = 0; i < 12; i++) { const x = 410 + i * 100, yy = y(x); DS.shape(S, `M${K(x - 26)} ${K(yy)} L${K(x + 26)} ${K(yy)} L${K(x)} ${K(yy + 50)} Z`, COL[i % 8], { layer: "mid", w: "detail" }); }
};
const shelf = (S) => {
  DS.shadow(S, 1400, 762, 300);
  DS.shape(S, rect(1268, 330, 264, 432), "wood", { layer: "mid" });
  S.fill(rect(1288, 350, 224, 120), S.start, 0, DS.c("wood", 2, "mid"), 1); S.fill(rect(1288, 488, 224, 120), S.start, 0, DS.c("wood", 2, "mid"), 1); S.fill(rect(1288, 626, 224, 118), S.start, 0, DS.c("wood", 2, "mid"), 1);
  DS.shape(S, rrect(1290, 690, 70, 54, DS.r.xs), "orange", { layer: "mid", w: "detail" }); DS.shape(S, rrect(1440, 680, 64, 64, DS.r.xs), "grass", { layer: "mid", w: "detail" }); // toy bins on the bottom shelf
};
const bed = (S) => {
  DS.shadow(S, 1440, 836, 250);
  DS.shape(S, rrect(1520, 664, 26, 172, DS.r.xs), "blue", { layer: "mid" });                 // headboard (right)
  DS.shape(S, rrect(1334, 742, 22, 94, DS.r.xs), "blue", { layer: "mid" });                  // footboard (left)
  DS.shape(S, rrect(1344, 770, 186, 42, DS.r.sm), "white", { layer: "mid", w: "detail" });   // mattress
  DS.shape(S, circ(1484, 762, 36, 16), "white", { layer: "mid", w: "detail" });               // pillow
};
const blanket = (S, t, parent) => {
  const g = S.grp(parent);
  DS.shape(S, rrect(1346, 760, 150, 46, DS.r.sm), "pink", { parent: g, w: "detail" });
  S.draw("M1360 776 H1482", S.start, 0, { c: DS.P.white[0], w: DS.w.detail, parent: g });
  if (t > S.start + 0.05) tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.5 }, t);
  return g;
};
const boxBack = (S) => { DS.shadow(S, 270, 942, 380); DS.shape(S, "M110 800 L150 770 L430 770 L390 800 Z", "brown", { flat: true }); };
const boxFront = (S) => {
  DS.shape(S, "M390 800 L430 770 L430 905 L390 940 Z", "red", { tone: 2, flat: true });
  DS.shape(S, rect(110, 800, 280, 140), "red");
  DS.shape(S, star5(40, 18, 250, 872), "yellow", { w: "mid" });
};
const garage = (S) => {
  DS.shadow(S, 1688, 938, 280);
  DS.shape(S, rect(1572, 800, 232, 136), "yellow");
  DS.shape(S, "M1556 806 L1688 728 L1820 806 Z", "red");
  [1607, 1687, 1767].forEach((x) => S.draw(`M${x - 34} 934 V872 Q${x} 838 ${x + 34} 872 V934 Z`, S.start, 0, { fill: DS.c("navy", 1), c: DS.line(), w: DS.w.detail }));
};

// the whole set. o: { done: passes already tidy (0-4), fin: finale toys home, bibi, mood, mouth, look }. draw(O, B) runs right after Ollie.
const SET = (S, o = {}, draw) => {
  const done = o.done || 0, isHome = (key) => (key === "rest" ? o.fin : ["blocks", "books", "cars", "teddy"].indexOf(key) < done);
  DS.room(S, PLAY); bunting(S);
  DS.frame(S, 760, 230, 150, 110, "grass"); DS.frame(S, 1010, 220, 120, 130, "yellow");
  shelf(S); bed(S);
  const T = {};
  ["books", "teddy"].forEach((key) => { if (isHome(key)) T[key] = TOYS[key].map((r) => toy(S, r, true)); });
  if (isHome("teddy")) blanket(S, S.start);
  DS.rug(S, 960, 910, 900, "purple");
  const B = o.bibi ? bibi(S, 380, 622, { k: 0.7, mood: o.mood }) : null;
  const O = ollie(S, 960, 900, 1.2, { mouth: o.mouth || "smile", look: o.look || 0 });
  if (draw) draw(O, B);
  boxBack(S); garage(S);
  Object.keys(TOYS).forEach((key) => { if (!T[key]) T[key] = TOYS[key].map((r) => toy(S, r, isHome(key))); });
  boxFront(S);
  return { O, B, T };
};
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
// aim arm A so its tip points at world (wx, wy); returns where the tip lands (world)
const aim = (O, A, wx, wy, t, dur = 0.5) => {
  const bx = (wx - O.cx) / O.k, by = (wy - O.gy) / O.k;
  let r = ((Math.atan2(by - A.y, bx - A.x) - Math.atan2(A.tip[1] - A.y, A.tip[0] - A.x)) * 180) / Math.PI; r = ((r + 540) % 360) - 180;
  O.raise(A, r * A.side, t, dur); return O.at(O.tipNow(A));
};
const singLine = (O, c, n) => { for (let i = 0; i < n; i++) O.sing(W(c, i), Math.min(WE(c, i), i + 1 < n ? W(c, i + 1) - 0.05 : WE(c, i))); };
const pickUp = (S, O, c) => [arm(O, 1, 1), arm(O, 1, -1)].forEach((A) => { O.raise(A, 70, W(c, 2) - 0.35, 0.5); O.raise(A, 0, W(c, 6) - 0.35, 0.5); });
const card = (S, str, t, t1, x = 960, y = 210, size = DS.type.title) => { const C = DS.card(S, str, x, y, { size, t }); S.fadeOut(C.g, t1, 0.4); return C; };

// ---------- one pass: hop home on line 1, pick up on line 2, bounce at home on line 3, face close-up on the tag ----------
// key = toy group, at = [x, y, k] insert framing on the home, str = card word.
// o: { hops(S, toys, L), bounce: [[clip, word], ...] on line 3, beat(S, O, B, T, t0, t1) = the break's story beat, mood }
const pass = (p, key, at, str, o = {}) => {
  const L = PS[p], t0 = p === 0 ? W(L[0], 0) - 0.6 : tagEnd(PS[p - 1]) + 0.6, t1 = tagEnd(L) + 0.6;
  const nTag = TIMING.words.filter((w) => w[0] === L[3]).length;
  const S = scene(t0, t1, { cam: "none" });
  const { O, B, T } = SET(S, { done: p, bibi: p > 0, mood: o.mood }, (O, B) => {
    O.bob(t0 + 0.3, W(L[3], 0) - 0.2, 8);
    pickUp(S, O, L[1]);
    singLine(O, L[3], nTag); O.wiggle([1, 2, 7, 8], W(L[3], 0), tagEnd(L), 12, BEAT);
    if (B) swing(S, B.R, W(L[1], 0), CLIP(L[2])[1], { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  });
  const toys = T[key];
  if (o.beat) o.beat(S, O, B, T, t0, W(L[0], 0) - 0.6);
  // line 1: wide; the slot toys bounce on their name, then hop home on the sound words
  wide(S, t0 - 0.6, 0.01);   // every pass opens wide (the breaks are too short for their own shot)
  toys.forEach((Ty) => boing(S, Ty, W(L[0], 0)));
  o.hops(S, toys, L);
  card(S, str, W(L[0], 0), W(L[1], 0) - 1.0);
  // line 2: mid on Ollie (+ Bibi), skipped when the line is too short for a 4 s shot
  if (W(L[2], 0) - W(L[1], 0) > 3.8) look(S, B ? 720 : 960, 600, 1.3, W(L[1], 0) - 0.5);
  // line 3: insert on the home; toys bounce on the sound words
  const ti = W(L[2], 0) - 0.5;
  look(S, at[0], at[1], at[2], ti);
  o.bounce.forEach(([c, i], j) => toys.forEach((Ty, k) => boing(S, Ty, W(c, i) + k * 0.08, o.small ? 8 : 20)));
  twinkle(S, o.home[0], o.home[1], W(...o.bounce[o.bounce.length - 1]) + 0.2, 3);
  // tag: Ollie's face fills the frame
  close(S, Math.max(W(L[3], 0) - 0.6, ti + 4));
  [[-190, -150], [190, -170], [-150, 140], [170, 130]].forEach(([dx, dy], i) => sparkle(S, 960 + dx, 520 + dy, W(L[3], nTag - 1) + i * 0.15, 0.9));
  DS.vignette(S);
  return S;
};
const onBeats = (S, toys, t, gap, h, dur) => toys.forEach((Ty, i) => hop(S, Ty, t + i * gap - 0.45, Ty.home, h, dur));

// 0  intro (0-22.4): the happy mess. "Uh-oh, what a mess!" twice -> a look round the mess -> "Uh-oh! What a mess!" close-up
{ const t1 = W(PS[0][0], 0) - 0.6, S = scene(0, t1, { cam: "none" });
  SET(S, {}, (O) => {
    [1, 2, 3].forEach((c) => singLine(O, c, 4));
    O.bob(8.6, 16.6, 8); O.wiggle([1, 2, 7, 8], 8.6, 16.6, 10, BEAT);
  });
  look(S, 960, 560, 1.1, 0, 0.01);
  close(S, 4.2);
  wide(S, 8.6);
  card(S, "TIDY UP TIME!", 9.2, 12.0);
  look(S, 960, 890, 1.6, 12.6);
  close(S, W(3, 0) - 0.5);
  DS.vignette(S); }

// 1  BLOCKS -> the toy box (pass 1, no Bibi yet): one block per "plop"
pass(0, "blocks", [560, 700, 1.45], "BLOCKS", {
  home: [270, 760],
  hops: (S, toys, L) => toys.forEach((Ty, i) => hop(S, Ty, W(L[0], 4 + i) - 0.45)),
  bounce: [[6, 4]],
});

// 2  Bibi hops in to help; BOOKS -> the shelf, arcing over Ollie's head, one per "slide"
pass(1, "books", [1180, 470, 1.45], "BOOKS", {
  home: [1400, 400],
  beat: (S, O, B, T, t0, t1) => {
    tl.fromTo(B.g, { opacity: 0 }, { opacity: 1, duration: 0.5 }, t0 + 0.4);
    swing(S, B.R, t0 + 1.0, t1 - 0.2, { rotation: -18, svgOrigin: B.R.sh }, BEAT);
  },
  hops: (S, toys, L) => toys.forEach((Ty, i) => hop(S, Ty, W(L[0], 4 + i) - 0.5, Ty.home, 470, 0.7)),
  bounce: [[10, 4], [10, 5], [10, 6]],
});

// 3  the cars beep by the garage; CARS -> the garage in a little convoy on "garage"
pass(2, "cars", [1380, 700, 1.45], "CARS", {
  home: [1690, 840],
  beat: (S, O, B, T, t0, t1) => {
    T.cars.forEach((Ty, i) => boing(S, Ty, t0 + 0.9 + i * 0.3, 14));
    T.cars.forEach((Ty, i) => boing(S, Ty, t0 + 2.1 + i * 0.3, 14));
  },
  hops: (S, toys, L) => onBeats(S, toys, W(L[0], 3), 0.3, 90, 0.6),
  bounce: [[14, 4], [14, 5], [14, 6]],
});

// 4  "Yawn! Sleepy teddy!" teddy nods off on the floor; TEDDY -> into bed on "bed", the blanket comes up on "hush"
pass(3, "teddy", [1250, 640, 1.45], "TEDDY", {
  home: [1440, 700],
  mood: "joy", small: true,
  beat: (S, O, B, T, t0, t1) => {
    boing(S, T.teddy[0], W(16, 0), 10); boing(S, T.teddy[0], W(16, 1) + 0.3, 10);
  },
  hops: (S, toys, L) => { hop(S, toys[0], W(L[0], 3) - 0.5, toys[0].home, 140, 0.7); blanket(S, W(L[0], 4)); },
  bounce: [[19, 4], [19, 5], [19, 6]],
});

// 5  eight arms grab the last eight toys, one per beat, then send them all home at once on "put it away".
// A grabbed toy swaps to a copy riding in Ollie's body (so it bobs with him); the copy swaps back for the flight home.
{ const c = FIN, t0 = tagEnd(PS[3]) + 0.6, t1 = W(c + 2, 0) - 0.6, S = scene(t0, t1, { cam: "none" });
  const tg = (i) => t0 + 1.0 + i * BEAT, tp = W(c + 1, 4) - 0.5;
  const ride = [];
  const { O, T } = SET(S, { done: 4, bibi: true, mood: "joy", mouth: "grin" }, (O) => {
    O.row.forEach((A, i) => {
      O.raise(A, [112, 90, 62, 30][A.ai], tg(i) - 0.5, 0.5);
      const [bx, by] = O.tipNow(A, 34), g = G(S, O.body, TF([bx, by, 0, K(0.8 / O.k)])), rec = TOYS.rest[i];
      g.setAttribute("opacity", 0); draw(S, rec[0], G(S, g), rec[1]); ride.push(g);
    });
    O.bob(tg(7) + 0.4, tp - 0.1, 10);
  });
  T.rest.forEach((Ty, i) => {
    const A = O.row[i], tip = O.at(O.tipNow(A, 34));
    hop(S, Ty, tg(i) - 0.4, [tip[0], tip[1], 0, 0.8], 60, 0.45);
    tl.set(Ty.g, { opacity: 0 }, tg(i) + 0.05); tl.set(ride[i], { opacity: 1 }, tg(i) + 0.05);
    tl.set(ride[i], { opacity: 0 }, tp + i * 0.07); tl.set(Ty.g, { opacity: 1 }, tp + i * 0.07);
    hop(S, Ty, tp + i * 0.07, Ty.home, 130, 0.75);
  });
  twinkle(S, 270, 760, W(c + 1, 6), 3); twinkle(S, 1420, 520, W(c + 1, 6) + 0.2, 3);
  card(S, "8 ARMS!", t0 + 0.8, t0 + 3.4);
  look(S, 960, 470, 1.25, t0 + 4.0);
  look(S, 960, 560, 1.08, W(c + 1, 0) + 0.2);
  DS.vignette(S); }

// 6  the sparkly tidy room -> tag close-up -> high fives with Bibi -> bye-bye + end card
{ const c = FIN + 2, t0 = W(c, 0) - 0.6, S = scene(t0, TOTAL, { cam: "none" }), tb = CLIP(30)[1] + 0.6;
  const { O, B } = SET(S, { done: 4, fin: true, bibi: true, mood: "joy", mouth: "grin" }, (O, B) => {
    O.bob(t0 + 0.3, W(c + 1, 0) - 0.2, 8);
    O.grin(t0, W(c + 1, 0) - 0.3); singLine(O, c + 1, 7); O.grin(CLIP(c + 1)[1] + 0.1, W(30, 0) - 0.2);
    singLine(O, 30, 4); O.grin(CLIP(30)[1] + 0.1);
    O.wiggle([1, 2, 7, 8], W(c + 1, 0), CLIP(c + 1)[1], 12, BEAT);
  });
  // "Look at our room, all clean and bright": sparkles where the mess was
  [[480, 880], [700, 900], [1240, 900], [1480, 880], [270, 720], [1400, 380], [1440, 700], [1690, 760]].forEach(([x, y], i) => sparkle(S, x, y, W(c, 3) + i * 0.3, 0.9));
  glow(S, W(c, 6));
  card(S, "ALL TIDY!", W(c, 2), W(c + 1, 0) - 1.0);
  close(S, W(c + 1, 0) - 0.6);
  // high five! Ollie's arm meets Bibi's raised paw on every "high five"
  const A = arm(O, 1, 1);
  [W(25, 0), W(26, 0), W(27, 0), W(27, 2), W(29, 0), W(29, 2)].forEach((t) => {
    S.move(B.R, t - 0.45, 0.4, { rotation: -120, svgOrigin: B.R.sh }, "power2.out");
    const tip = aim(O, A, 512, 661, t - 0.45, 0.4);
    sparkle(S, (tip[0] + 512) / 2, (tip[1] + 661) / 2, t, 1);
    S.move(B.R, t + 0.3, 0.35, { rotation: 0, svgOrigin: B.R.sh });
    O.raise(A, 0, t + 0.3, 0.35);
  });
  look(S, 720, 610, 1.3, W(25, 0) - 0.7);
  look(S, 560, 640, 1.7, W(27, 0) - 1.0);
  wide(S, W(28, 0) + 1.2);
  close(S, W(30, 0) - 0.5);
  // outro: wide, everyone waves bye-bye, end card
  wide(S, tb);
  [arm(O, 0, 1), arm(O, 0, -1)].forEach((Aw) => O.raise(Aw, 62, tb + 0.6, 0.6));
  O.wiggle([1, 2], tb + 1.2, 164, 14, BEAT); O.bob(tb + 0.4, 168, 8);
  swing(S, B.R, tb + 1.2, 164, { rotation: -20, svgOrigin: B.R.sh }, BEAT);
  look(S, 720, 600, 1.3, W(32, 0) - 0.5);
  wide(S, 161);
  [[700, 300], [1220, 300], [480, 520], [1440, 520]].forEach(([x, y], i) => sparkle(S, x, y, tb + 2 + i * 0.4, 0.9));
  card(S, "BYE-BYE!", W(31, 0), W(32, 0) - 1.0);
  S.text("Tiny Tune Town", 960, 140, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: 165.5 });
  DS.vignette(S); }
