// look: still
// @include ../../tools/cast.js
// 06 Brush Brush Teeth (original). Ollie at the bathroom sink: one more toothbrush every pass, foam grows, Bibi joins on pass 3,
// all eight arms brush in the finale, then rinse and a big sparkly grin. Camera plan: wide at each pass, medium on the 2nd line,
// face close-up on every "sparkle and shine" (S.zoom around the face; Ollie stays centred). No hard cuts, nothing under 4 s.
BEAT = 60 / 96;
const FACE = [930, 500];                     // zoom anchor: Ollie's face (ollie at 930, gy 900, k 1.3 -> face centre ~471)
const wide = (S, t) => S.zoom(...FACE, 1, t, 1.3), mid = (S, t) => S.zoom(...FACE, 1.2, t, 1.3), close = (S, t) => S.zoom(...FACE, 1.45, t, 1.3);
const COL = ["sky", "grass", "yellow", "orange", "purple", "red", "blue", "gold"];

// the bathroom with Ollie behind the sink; returns O. draw(O) adds things in front of Ollie but behind the sink counter
const bath = (S, o = {}, draw) => {
  DS.room(S, BATH_ROOM); bathWall(S, { towel: o.towel });
  const B = o.bibi ? bibi(S, 470, 500, { k: 0.72, mood: o.bibiMood, paws: [[380, 640], [636, 600]] }) : null;
  const O = ollie(S, 930, 900, 1.3, { mouth: o.mouth || "grin", look: o.look || 0 });
  if (draw) draw(O, B);
  bathSink(S);
  return { O, B };
};
// arm A brushes at mouth height ty, bristles at (hx, ty) in body units; pops in at t (arm swings up first)
const brushIn = (S, O, A, ty, hx, t, c) => {
  const [tx, tyy] = O.holdAt(A, ty, t > S.start + 0.05 ? t - 0.5 : S.start, t > S.start + 0.05 ? 0.5 : 0.01);
  const [g, in_] = popIn(S, t, (tx + hx) / 2, ty, O.body);
  toothbrush(S, tx, tyy, hx, ty, { c, parent: in_ });
  return g;
};
// scrub: brushes sway on the half beat between t0 and t1
const scrub = (S, gs, t0, t1, dx = 9) => gs.forEach((g, i) => swing(S, g, t0, t1, { x: i % 2 ? -dx : dx }, BEAT / 2));
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const foamAt = (S, O, pts, ts) => pts.forEach(([x, y, n], i) => foam(S, x, y, n, ts[i % ts.length], O.body));
const twinkle = (S, O, t) => [[-150, -420, 0.8], [160, -440, 1], [-60, -500, 0.6], [110, -300, 0.7]].forEach(([x, y, r], i) => sparkle(S, ...O.at([x, y]), t + i * 0.25, r));
const pass = (c) => [W(c, 0), W(c + 1, 0), W(c + 2, 0), W(c + 3, 0), WE(c + 3, 4)];   // starts of the 4 lines + end of the tag

// 0  intro (0-9.5): sleepy Ollie, a yawn on "Ooh!", the red brush hops out of the cup into his arm on "brush"
{ const S = scene(0, 9.5, { cam: "none" });
  const { O } = bath(S, { mouth: "smile", look: -10 }, (O) => {
    O.sing(W(1, 0), WE(1, 0)); O.sing(W(2, 0), WE(2, 0));
    O.bob(S.start + 0.5, S.end, 6);
    brushIn(S, O, arm(O, 3, 1), -262, -40, W(1, 3), "red");
  });
  S.zoom(608, 300, 1.25, 0.2, 2);            // look at the cup of brushes
  mid(S, W(1, 3) - 0.6);                     // ...then at Ollie
  S.fadeOut(DS.card(S, "TIME TO BRUSH!", 1440, 200, { size: DS.type.body, t: W(1, 1) }).g, W(1, 3) - 0.8, 0.4);
  DS.vignette(S); }

// 1  pass 1 TOP teeth (10.1-34): one brush, foam on every scrub, close-up on the tag, "Wow!" pulls back
{ const P = pass(3), S = scene(9.5, 34.0, { cam: "none" });
  bath(S, {}, (O) => {
    const g = brushIn(S, O, arm(O, 3, 1), -262, -40, S.start, "red");
    scrub(S, [g], P[0], P[4]);
    foamAt(S, O, [[-78, -232, 2], [-92, -248, 2], [-66, -214, 2], [-104, -224, 2], [-84, -200, 2], [-110, -244, 2]], [W(3, 4), W(3, 5), W(3, 6), W(5, 4), W(5, 5), W(5, 6)]);
    twinkle(S, O, W(6, 4)); O.hop(W(7, 0), 50);
  });
  mid(S, P[1]); close(S, P[3] - 0.4); wide(S, W(7, 0));
  S.fadeOut(DS.card(S, "TOP", 1440, 200, { size: DS.type.title, t: W(3, 2) }).g, P[3] - 0.9, 0.4);
  DS.vignette(S); }

// 2  pass 2 BOTTOM teeth (34-54.1): two brushes, more foam
{ const P = pass(8), S = scene(34.0, 54.6, { cam: "none" });
  bath(S, {}, (O) => {
    const a = brushIn(S, O, arm(O, 3, 1), -240, -44, S.start, "red"), b = brushIn(S, O, arm(O, 3, -1), -240, 44, W(8, 2), "sky");
    scrub(S, [a, b], P[0], P[4]);
    foamAt(S, O, [[-88, -218, 2], [88, -218, 2], [-100, -236, 2], [100, -236, 2], [-80, -198, 2], [80, -198, 2]], [W(8, 4), W(8, 5), W(8, 6), W(10, 4), W(10, 5), W(10, 6)]);
    twinkle(S, O, W(11, 4));
  });
  mid(S, P[1]); close(S, P[3] - 0.4);
  S.fadeOut(DS.card(S, "BOTTOM", 1440, 200, { size: DS.type.title, t: W(8, 2) }).g, P[3] - 0.9, 0.4);
  DS.vignette(S); }

// 3  instrumental break (54.6-64.1): bubbles float up from the sink, Ollie bobs to the beat, Bibi peeks in and waves
{ const S = scene(54.6, 64.1, { cam: "none" });
  const { O, B } = bath(S, { bibi: true, look: -12 }, (O) => {
    brushIn(S, O, arm(O, 3, 1), -262, -44, S.start, "red"); brushIn(S, O, arm(O, 3, -1), -262, 44, S.start, "sky");
    O.bob(S.start + 0.3, S.end - 0.2, 10);
  });
  popAt(B.g, S.start + 3.2, 520, 640, 0.6);  // Bibi pops up on the left
  swing(S, B.R, S.start + 4, S.end - 0.3, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  [[760, 700, 28], [880, 690, 36], [1040, 700, 30], [1160, 690, 24], [700, 680, 20], [1220, 700, 32]].forEach(([x, y, r], i) => bubble(S, x, y, r, 520 + i * 40, { t: S.start + 0.6 + i * 0.7 }));
  S.zoom(640, 500, 1.3, S.start + 3.6, 1.4);   // drift toward Bibi as she appears
  DS.vignette(S); }

// 4  pass 3 FRONT teeth (64.1-84.8): Ollie + Bibi brush together; Bibi gets a close look on line 2
{ const P = pass(12), S = scene(64.1, 84.8, { cam: "none" });
  const { B } = bath(S, { bibi: true }, (O, B) => {
    const a = brushIn(S, O, arm(O, 3, 1), -262, -20, S.start, "red"), b = brushIn(S, O, arm(O, 3, -1), -262, 20, S.start, "sky");
    const bb = S.grp(B.g); toothbrush(S, 636, 600, 506, 552, { c: "pink", parent: bb });
    scrub(S, [a, b, bb], P[0], P[4]);
    foamAt(S, O, [[-90, -226, 2], [90, -226, 2], [-100, -244, 2], [100, -244, 2], [-82, -204, 2], [82, -204, 2]], [W(12, 4), W(12, 5), W(12, 6), W(14, 4), W(14, 5), W(14, 6)]);
    twinkle(S, O, W(15, 4));
  });
  S.zoom(560, 500, 1.3, P[1], 1.3); close(S, P[3] - 0.4);
  S.fadeOut(DS.card(S, "FRONT", 1440, 200, { size: DS.type.title, t: W(12, 2) }).g, P[1] - 0.6, 0.4);
  DS.vignette(S); }

// 5  "Now the back!" + pass 4 BACK teeth (84.8-110.5): four brushes, mouth wide
{ const P = pass(17), S = scene(84.8, 110.5, { cam: "none" });
  bath(S, { bibi: true, bibiMood: "joy" }, (O) => {
    const gs = [brushIn(S, O, arm(O, 3, 1), -262, -66, S.start, "red"), brushIn(S, O, arm(O, 3, -1), -262, 66, S.start, "sky"),
      brushIn(S, O, arm(O, 2, 1), -236, -56, W(16, 1), "yellow"), brushIn(S, O, arm(O, 2, -1), -236, 56, W(16, 2), "grass")];
    scrub(S, gs, P[0], P[4]);
    foamAt(S, O, [[-96, -232, 2], [96, -232, 2], [-108, -250, 2], [108, -250, 2], [-90, -210, 2], [90, -210, 2]], [W(17, 4), W(17, 5), W(17, 6), W(19, 4), W(19, 5), W(19, 6)]);
    twinkle(S, O, W(20, 4));
  });
  mid(S, W(16, 0)); wide(S, P[0]); mid(S, P[1]); close(S, P[3] - 0.4);
  S.fadeOut(DS.card(S, "BACK", 1440, 200, { size: DS.type.title, t: W(17, 2) }).g, P[3] - 0.9, 0.4);
  DS.vignette(S); }

// 6  finale part 1 (110.5-123.2): "All eight arms!" - the arms swing up one by one, each with a brush; everyone wiggles
{ const S = scene(110.5, 123.2, { cam: "none" });
  bath(S, { bibi: true, bibiMood: "joy" }, (O) => {
    const T = [W(21, 0), W(21, 1), W(21, 2), W(21, 3), W(21, 4), W(21, 5), W(21, 5) + 0.4, W(21, 5) + 0.8];
    const gs = O.arms.map((A, i) => {
      if (A.ai === 3) return brushIn(S, O, A, -262, A.side === 1 ? -66 : 66, S.start, i % 2 ? "sky" : "red");
      O.raise(A, [125, 98, 72][A.ai], T[i] - 0.4, 0.5);
      const g = S.grp(O.body); popAt(g, T[i], 0, -400, 0.35);
      A.cur = [125, 98, 72][A.ai] * A.side;                       // tipNow reads the final pose
      const [x0, y0] = O.tipNow(A), [x1, y1] = O.tipNow(A, 150);
      toothbrush(S, x0, y0, x1, y1, { c: COL[i], parent: g, foam: false }); return g;
    });
    scrub(S, gs, W(22, 0), S.end - 0.2, 7);
    O.bob(W(22, 0), S.end, 10);
  });
  S.zoom(960, 470, 1.15, W(22, 0), 1.3);
  DS.card(S, "8 BRUSHES!", 1440, 200, { size: DS.type.title, t: W(21, 3) });
  DS.vignette(S); }

// 7  rinse, spit, BIG BRIGHT SMILE (123.2-143): water runs, foam goes, then the grin and sparkles; music bed: pull back, bubbles
{ const S = scene(123.2, 143.0, { cam: "none" });
  bath(S, { bibi: true, bibiMood: "joy", mouth: "smile" }, (O) => {
    O.grin(W(24, 0)); twinkle(S, O, W(24, 2)); twinkle(S, O, W(24, 6));
    O.bob(W(24, 0) + 1, S.end, 8);
  });
  tapWater(S, W(23, 0));
  close(S, W(24, 0) - 0.5); wide(S, WE(24, 6) + 0.5);
  [[700, 680, 26], [900, 690, 34], [1060, 700, 28], [1220, 690, 22], [800, 690, 18]].forEach(([x, y, r], i) => bubble(S, x, y, r, 500, { t: WE(24, 6) + 0.5 + i * 0.8 }));
  DS.card(S, "SPARKLY!", 1440, 200, { size: DS.type.title, t: WE(24, 6) + 1.2 });
  DS.vignette(S); }

// 8  the last smile + bye-bye (143-170): both wave, end card
{ const S = scene(143.0, 170.0, { cam: "none" });
  const { O, B } = bath(S, { bibi: true, bibiMood: "joy", mouth: "grin" }, (O) => {
    [arm(O, 1, 1), arm(O, 1, -1)].forEach((A) => O.raise(A, 120, W(26, 0) - 0.5, 0.6));
    O.wiggle([3, 4], W(26, 0), S.end - 1, 14, BEAT); O.bob(S.start + 0.5, S.end, 8);
  });
  swing(S, B.R, W(26, 0), S.end - 1, { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  twinkle(S, O, W(25, 9));
  mid(S, S.start + 0.5); wide(S, W(26, 0) - 0.5);
  S.fadeOut(DS.card(S, "BYE-BYE!", 1440, 200, { size: DS.type.title, t: W(26, 0) }).g, 165, 0.4);
  S.text("Tiny Tune Town", 960, 130, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: 165.5 });
  DS.vignette(S); }
