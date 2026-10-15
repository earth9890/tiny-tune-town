// look: still
// @include ../../tools/cast.js
// @include food.js
// 13 One Little Bite (original). Ollie at the kitchen table with Bibi. Each pass a new food with a cute face lands on his plate;
// he isn't sure (leans back, wobbly mouth, "?"), lifts one little bite on a fork, "Mmm!", grin + happy wiggle,
// Bibi cheers. He leans back less each pass (braver). Finale: a rainbow plate, then eight forks, one in every arm.
// Sung order (seed 7): pass 2 starts on "not so sure" and sings the peas + tag twice; the rainbow chorus repeats lines.
// Camera per pass: wide (food lands on its word) -> mid (unsure) -> insert on the plate (the sound words) -> face close-up on
// the tag "Will you try it? One little bite! Mmm!" -> wide for Bibi's cheer in the break. No hard cuts, nothing under 4 s.
BEAT = 60 / 96;
const FACE = [960, 500];                          // zoom anchor: Ollie's face (ollie at 960, gy 900, k 1.3 -> face centre ~471)
const wide = (S, t) => S.zoom(...FACE, 1, t, 1.3), mid = (S, t) => S.zoom(...FACE, 1.25, t, 1.3), close = (S, t) => S.zoom(...FACE, 1.5, t, 1.3);
const onPlate = (S, t) => S.zoom(960, 700, 1.45, t, 1.3);
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const hop = (S, g, t, h = 26) => tw(g, t, 0.34, "translate(0 0)", `translate(0 ${-h})`, hump(1));
const tilt = (O, t, dur, a, b, ease) => tw(O.body, t, dur, `rotate(${a} 0 -250)`, `rotate(${b} 0 -250)`, ease);

// arm swings up over 0.7 s from t0; the forkful pops in at the mouth corner as it arrives (drawn over the face, like 06's brushes)
const forkUp = (S, O, kind, t0, side = -1) => {
  const A = arm(O, 3, side), [tx, ty] = O.holdAt(A, -258, t0, 0.7), [g, in_] = popIn(S, t0 + 0.5, (tx - 40 * side) / 2, -258, O.body);
  const [, pg] = fork(S, tx, ty, -40 * side, -258, kind, in_);
  return { A, g, pg };
};
// the wobbly "not so sure" mouth (covers the smile) between t0 and t1
const unsure = (S, O, t0, t1) => { const g = S.grp(O.body); g.setAttribute("opacity", 0);
  S.fill(circ(0, -246, 52, 30), S.start, 0, DS.mix(DS.c("pink"), DS.c("pink", 2), 0.2), 1, g);
  S.draw("M-32 -248 Q-16 -262 0 -248 Q16 -234 32 -248", S.start, 0, { c: DS.line(), w: DS.w.near, parent: g });
  tl.set(g, { opacity: 1 }, t0); tl.set(g, { opacity: 0 }, t1); };
// Bibi throws both paws up and waves them on the beat between t0 and t1
const cheer = (S, B, t0, t1) => [[B.L, 1], [B.R, -1]].forEach(([g, s]) => { const R = (a) => `rotate(${a * s} ${g.sh})`, n = t1 - t0 - 1.1;
  tw(g, t0, 0.5, R(0), R(118)); if (n > 1) tw(g, t0 + 0.5, n, R(118), R(98), wave(cyc(n, 2 * BEAT))); tw(g, t1 - 0.6, 0.5, R(118), R(0)); });   // paws beside the head, never over the face
const yum = (S, O, t) => { hearts(S, t, [[700, 330, 1.3], [1220, 300, 1.5], [1300, 470, 1.1]]);
  [[-200, -520, 0.9], [210, -540, 1], [-250, -400, 0.7], [250, -380, 0.8]].forEach(([x, y, r], i) => sparkle(S, ...O.at([x, y]), t + i * 0.25, r)); };

// ---------- the kitchen ----------
const plate = (S, x, y, rx) => { DS.shadow(S, x, y + rx * 0.12, rx * 2.1); DS.shape(S, circ(x, y, rx, rx * 0.26), "white", { w: "mid" }); S.draw(circ(x, y - rx * 0.02, rx * 0.74, rx * 0.17), S.start, 0, { c: DS.c("gray", 1), w: DS.w.detail }); };
const kitchenWall = (S) => {
  tiles(S, 360, 320, 1560, 560, 60);                                                                             // backsplash
  [380, 560].forEach((x, i) => { DS.shape(S, rrect(x, 110, 170, 196, DS.r.xs), "grass", { layer: "mid", w: "mid" }); DS.shape(S, circ(x + (i ? 24 : 146), 270, 9), "gold", { layer: "mid", w: "detail" }); });
  DS.shape(S, rect(360, 560, 1200, 22), "white", { layer: "mid", w: "mid" });                                   // back counter
  DS.shape(S, rect(360, 582, 1200, 178), "grass", { layer: "mid", w: "mid", dir: "v" });
  [[520, "red"], [590, "yellow"], [660, "orange"]].forEach(([x, c], i) => { DS.shape(S, rrect(x - 26, 486 + i * 8, 52, 74 - i * 8, DS.r.sm), "glass", { layer: "mid", w: "mid" }); DS.shape(S, rrect(x - 30, 476 + i * 8, 60, 16, DS.r.xs), c, { layer: "mid", w: "detail" }); });
  [[1310, 506, "red"], [1350, 498, "orange"], [1392, 508, "grass"]].forEach(([x, y, c]) => DS.shape(S, circ(x, y, 24), c, { layer: "mid", w: "mid" }));
  DS.shape(S, "M1270 520 Q1350 580 1430 520 Z", "sky", { layer: "mid", w: "mid" });                               // fruit bowl
  [[1188, 1], [1492, -1]].forEach(([x, s]) => DS.shape(S, `M${x} 136 H${x + 58 * s} Q${x + 18 * s} 260 ${x + 30 * s} 420 H${x} Z`, "red", { layer: "mid", w: "mid" }));   // curtains
  S.draw("M960 -20 V64", S.start, 0, { c: DS.line("mid"), w: DS.w.mid });                                            // lamp over the table
  S.fill(circ(960, 160, 220, 120), S.start, 0, DS.glow(DS.P.yellow[1], 0.55), 1);
  DS.shape(S, "M900 120 L926 64 H994 L1020 120 Z", "orange", { layer: "mid", w: "mid" });
};
const table = (S) => {
  DS.shape(S, "M290 688 H1630 L1780 806 H140 Z", "sky", { dir: "v" });                                          // gingham cloth on top
  let d = "M215 747 H1705"; for (let i = 1; i < 14; i++) d += ` M${K(290 + (1340 * i) / 14)} 688 L${K(140 + (1640 * i) / 14)} 806`;
  S.draw(d, S.start, 0, { c: DS.P.white[0], w: DS.w.mid, op: 0.55 });
  DS.shape(S, rect(140, 806, 1640, 320), "sky", { dir: "v" });                                                     // ...hanging down the front
  let e = ""; for (let x = 222; x < 1780; x += 117) e += `M${x} 806 V1130 `; for (let y = 880; y < 1130; y += 80) e += `M140 ${y} H1780 `;
  S.draw(e, S.start, 0, { c: DS.P.white[0], w: DS.w.near, op: 0.45 });
};
// the whole set: back(O, B) draws behind the table (Ollie's things), front(O, B) on top of the table (food, Bibi's paws)
const kitchen = (S, back, front) => {
  DS.room(S, { wall: "wall", floor: "floor", window: [1220, 150, 240, 250] }); kitchenWall(S);
  const B = bibi(S, 400, 520, { k: 0.72, paws: [null, null] });
  const O = ollie(S, 960, 900, 1.3, { mouth: "smile" });
  if (back) back(O, B);
  table(S); plate(S, 960, 752, 200); plate(S, 400, 752, 86);
  const FB = { g: S.grp(), k: B.k, x: B.x, hy: B.hy };                                                            // paws rest on the table
  B.L = bibiArm(S, FB, -1, 282, 742); B.R = bibiArm(S, FB, 1, 518, 742);
  if (front) front(O, B);
  DS.vignette(S);
  return { O, B };
};
// food lands on both plates on its word; returns the parts that hop on the sound words (each pea, or the whole food)
const SIZE = { carrot: 1, peas: 1, broccoli: 0.74, banana: 1.25 };   // broccoli is tall: keep it below Ollie's mouth
const serve = (S, kind, t) => { const [o, g] = popIn(S, t, 960, 700), [, b] = popIn(S, t, 400, 730), k = SIZE[kind]; FOOD[kind](S, 400, 754, 0.42 * k, b); return FOOD[kind](S, 960, 754, k, g) || [o]; };

// one try: a forkful comes up for tTry, the bite on tBite, then "Mmm!": grin (until o.grinTo), happy wiggle, hearts. Returns the fork
const bite = (S, O, kind, tTry, tBite, o = {}) => {
  const F = forkUp(S, O, kind, tTry - 0.7, o.side), m = tBite + 0.7;
  chomp(S, O, F.pg, tBite, o.grinTo);
  if (o.lower !== false) { tl.to(F.g, { opacity: 0, duration: 0.2 }, m + 4 * BEAT); O.raise(F.A, 0, m + 4 * BEAT + 0.15, 0.7); }
  return F;
};
const chomp = (S, O, pg, tBite, grinTo) => { const m = tBite + 0.7;
  O.sing(tBite - 0.1, tBite + 0.45); tl.to(pg, { opacity: 0, duration: 0.15 }, tBite + 0.2);
  O.grin(m, grinTo); tilt(O, m, 4 * BEAT, 0, 7, wave(2)); yum(S, O, m); };
// "hmm": wobbly mouth from t0 until the next try; leans back (less each pass) until tOff
const hmm = (S, O, t0, tOff, tTry, lean) => { unsure(S, O, t0, tTry - 0.6); tilt(O, t0, 0.8, 0, lean); tilt(O, tOff - 0.2, 0.8, lean, 0); };
// all eight arms hold a fork, outer pairs first, one every `step` s from t0; returns the two mouth forks by side
const eightForks = (S, O, t0, step) => { const PIECE = ["red", "carrot", "banana", "broccoli", "peas", "blue", "purple", "carrot"], M = {};
  O.arms.forEach((A, i) => { const t = t0 + i * step;
    if (A.ai === 3) { M[A.side] = forkUp(S, O, PIECE[i], t - 0.4, A.side); return; }
    const [x0, y0] = A.tip, rx = x0 - A.x, ry = y0 - A.y, m = Math.hypot(rx, ry), [g] = fork(S, x0, y0, x0 + (rx / m) * 120, y0 + (ry / m) * 120, PIECE[i], A.wig);
    tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.3 }, t - 0.2); O.raise(A, [125, 100, 95][A.ai], t - 0.4, 0.5); });   // arm 2 up at 95 so its fork clears Bibi
  return M; };
const rainbow = (S, x, y, t0, t1) => { // seven foods pop in left to right between t0 and t1; returns their groups
  const R = [["red", -150], ["carrot", -100], ["banana", -50], ["broccoli", 0], ["peas", 50], ["blue", 100], ["purple", 150]];
  return R.map(([kind, dx], i) => { const [o, g] = popIn(S, t0 + ((t1 - t0) * i) / (R.length - 1), x + dx, y - 20);
    [[-14, 0], [14, 0], [0, -20]].forEach(([ox, oy]) => piece(S, kind, x + dx + ox, y - 18 + oy, g));
    if (i % 2 === 0) cute(S, x + dx, y - 26, 0.75, g); return o; });
};
const card = (S, str, t, tOut, o = {}) => { const C = DS.card(S, str, o.x ?? 1440, o.y ?? 210, { size: o.size || DS.type.title, t }); if (tOut) S.fadeOut(C.g, tOut, 0.4); };

// 1  intro + CARROT (0-31.2): Ollie peeks up over the table, "What's for lunch?" (arms up), a carrot lands; hmm; one bite; Mmm!
{ const S = scene(0, 31.2, { cam: "none" });
  const { O, B } = kitchen(S, (O) => {
    O.lift(330, S.start, 0.01); O.lift(0, 1.2, 1.0);
    [arm(O, 0, 1), arm(O, 0, -1)].forEach((A) => { O.raise(A, 125, W(1, 0) - 0.3, 0.6); O.raise(A, 0, W(2, 3) - 0.5, 0.6); });
    O.bob(2.4, W(3, 0), 8);
    hmm(S, O, W(3, 0), W(4, 0), W(5, 2), -10);
    bite(S, O, "carrot", W(5, 2), W(5, 6));
    O.bob(W(5, 6) + 3, S.end, 10);
  }, () => { const p = serve(S, "carrot", W(2, 3)); [W(2, 4), W(2, 5), W(4, 4), W(4, 5)].forEach((t) => hop(S, p[0], t)); });
  cheer(S, B, W(5, 6) + 0.9, S.end + 0.6);
  mid(S, 8.3); onPlate(S, 12.4); close(S, W(5, 2) - 1.4); wide(S, W(5, 6) + 2.0); S.zoom(560, 540, 1.3, 26.4, 1.4);
  card(S, "CARROT", W(2, 3), 11.4); card(S, "?", W(3, 3), 11.4, { x: 690, y: 190, size: DS.type.display }); card(S, "YUM!", W(5, 6) + 2.6, 25.9); }

// 2  PEAS (31.2-63.6): the peas arrive in the break; hmm; a first bite... then a second helping and a big Mmm!
{ const S = scene(31.2, 63.6, { cam: "none" });
  const { O, B } = kitchen(S, (O) => {
    O.bob(S.start, W(7, 0), 8);
    hmm(S, O, W(7, 0), W(8, 0), W(9, 2), -8);
    bite(S, O, "peas", W(9, 2), W(9, 6), { grinTo: W(11, 6) - 0.2 });
    bite(S, O, "peas", W(11, 2), W(11, 6));
    O.bob(W(11, 6) + 3, S.end, 10);
  }, () => { const p = serve(S, "peas", 32.6); [8, 10].forEach((c) => p.forEach((g, n) => hop(S, g, W(c, 3) + n * BEAT / 2))); });
  cheer(S, B, W(11, 6) + 0.9, S.end + 0.6);
  mid(S, 35.0); close(S, W(9, 2) - 1.4); mid(S, W(9, 6) + 1.8); close(S, W(11, 2) - 1.4); wide(S, W(11, 6) + 1.8);
  card(S, "?", W(7, 3), W(9, 2) - 2.3, { x: 690, y: 190, size: DS.type.display }); card(S, "PEAS", 32.6, W(9, 2) - 2.3); card(S, "YUM!", W(11, 6) + 2.4); }

// 3  BROCCOLI (63.6-84.4): braver; hmm; munch munch; one bite, Mmm! (close-up into the next scene)
{ const S = scene(63.6, 84.4, { cam: "none" });
  kitchen(S, (O) => {
    O.bob(S.start, W(14, 0), 8);
    hmm(S, O, W(14, 0), W(15, 0), W(16, 2), -6);
    bite(S, O, "broccoli", W(16, 2), W(16, 6));
  }, () => { const p = serve(S, "broccoli", W(13, 3)); [W(13, 4), W(13, 5), W(15, 4), W(15, 5)].forEach((t) => hop(S, p[0], t)); });
  mid(S, 68.8); onPlate(S, 73.8); close(S, W(16, 2) - 1.4);
  card(S, "BROCCOLI", W(13, 3), 72.9); card(S, "?", W(14, 3), 72.9, { x: 690, y: 190, size: DS.type.display }); }

// 4  "What's next?" + BANANA (84.4-109.6): Bibi still cheering, a banana; only a tiny hmm now; one bite, Mmm!
{ const S = scene(84.4, 109.6, { cam: "none" });
  const { O, B } = kitchen(S, (O) => {
    O.grin(S.start, W(19, 0)); O.bob(S.start, W(19, 0), 10);
    hmm(S, O, W(19, 0), W(20, 0), W(21, 2), -3);
    bite(S, O, "banana", W(21, 2), W(21, 6));
    O.bob(W(21, 6) + 3, S.end, 10);
  }, () => { const p = serve(S, "banana", W(18, 3)); [W(18, 4), W(18, 5), W(18, 6), W(20, 4), W(20, 5)].forEach((t) => hop(S, p[0], t)); });
  cheer(S, B, S.start - 0.4, W(18, 2)); cheer(S, B, W(21, 6) + 0.9, S.end + 0.6);
  mid(S, 88.8); onPlate(S, 93.8); close(S, W(21, 2) - 1.4); wide(S, W(21, 6) + 1.8); S.zoom(760, 560, 1.12, 105.4, 3.0);
  card(S, "BANANA", W(18, 3), 92.9); card(S, "?", W(19, 3), 92.9, { x: 690, y: 190, size: DS.type.display }); card(S, "YUM!", W(21, 6) + 2.4); }

// 5  the RAINBOW PLATE (109.6-131.4): every food at once, then the gag: a fork in every arm, "I tried it and I like it!"
{ const S = scene(109.6, 131.4, { cam: "none" });
  const { O, B } = kitchen(S, (O) => {
    O.grin(W(22, 1)); O.bob(S.start, 123.0, 8);
    eightForks(S, O, 123.4, BEAT / 2); O.bob(126.5, S.end, 10);
  }, () => { const R = rainbow(S, 960, 752, W(22, 1), W(22, 5));
    [[0, 0], [2, 6], [3, 1], [5, 3]].forEach(([w, n]) => hop(S, R[n], W(23, w)));
  });
  cheer(S, B, 123.4, S.end + 0.6);
  onPlate(S, 113.6); S.zoom(...FACE, 1.2, 118.0, 1.3); S.zoom(...FACE, 1, 122.6, 1.3); S.zoom(...FACE, 1.35, 127.0, 1.3);
  card(S, "RAINBOW!", W(22, 1), 112.9); card(S, "8 FORKS!", 125.0, 126.6); }

// 6  eating from the forks (131.4-157.6): the plate sings along, a bite from the left fork... then the right fork. Mmm!
{ const S = scene(131.4, 157.6, { cam: "none" });
  const { O, B } = kitchen(S, (O) => {
    const M = eightForks(S, O, S.start - 2.5, 0);
    O.grin(S.start, W(26, 6) - 0.2); chomp(S, O, M[-1].pg, W(26, 6), W(28, 6) - 0.2); chomp(S, O, M[1].pg, W(28, 6));
    O.bob(S.start, W(26, 0), 8); O.bob(W(26, 6) + 3, W(28, 0), 10);
  }, () => { const R = rainbow(S, 960, 752, S.start, S.start);
    [25, 27].forEach((c) => [[0, 1], [1, 4], [3, 3], [4, 0]].forEach(([w, n]) => hop(S, R[n], W(c, w)))); });
  cheer(S, B, W(26, 6) + 0.9, 145.8);
  onPlate(S, S.start - 0.8); close(S, W(26, 2) - 1.4); wide(S, 141.4); onPlate(S, 145.4); close(S, W(28, 2) - 1.4); }

// 7  "I tried it and I like it!" + bye-bye (157.6-170): forks waving, Bibi waving, end card
{ const S = scene(157.6, TOTAL, { cam: "none" });
  const { O, B } = kitchen(S, (O) => {
    eightForks(S, O, S.start - 2.5, 0); O.grin(S.start);
    O.wiggle([1, 2, 3, 4, 5, 6], W(30, 0), S.end - 1, 12, BEAT); O.bob(S.start, S.end, 10);
  }, () => rainbow(S, 960, 752, S.start, S.start));
  cheer(S, B, S.start - 0.4, S.end);
  hearts(S, W(29, 4), [[680, 360, 1.3], [1240, 320, 1.5], [1320, 480, 1.1]]);
  S.zoom(...FACE, 1.1, 163.4, 3.0);
  card(S, "I LIKE IT!", W(29, 4), W(30, 0) - 0.6); card(S, "BYE-BYE!", W(30, 0), TOTAL - 5);
  S.text("Tiny Tune Town", 960, 890, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: TOTAL - 4.5 }); }
