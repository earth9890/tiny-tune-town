// look: still
// @include ../../tools/cast.js
// 20 Wash, Wash, Wash Your Hands (original). Ollie at the bathroom sink: tap on, one pump of soap, then a bigger foam mitt on more arm tips each
// pass (palms 2, backs 2, fingers 4 + Bibi peeks in, thumbs 6, "eight hands" 8). A hand icon + label shows which part is being scrubbed.
// Rinse under the tap, shake, pat dry on a towel, eight clean sparkly hands. Camera: wide at each pass, mid on line 2, face close-up on the tag
// (S.zoom centred on the face). No hard cuts, nothing under 4 s, no flashing. Scene edges come from W() cues, so the real take re-times it all.
BEAT = 60 / 100;
const OX = 904, OGY = 900, OKK = 1.3, FACE = [OX, 500];      // Ollie stands left of centre so his right arm can reach under the tap
// centre (x, y) on screen at zoom k (S.zoom pins a point; pick the pin that lands (x, y) at the centre)
const view = (S, x, y, k, t, dur = 1.3) => (k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const wide = (S, t) => view(S, ...FACE, 1, t), mid = (S, t) => view(S, ...FACE, 1.2, t), close = (S, t) => view(S, ...FACE, 1.5, t);
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const arms8 = (O) => [arm(O, 3, 1), arm(O, 3, -1), arm(O, 2, 1), arm(O, 2, -1), arm(O, 1, 1), arm(O, 1, -1), arm(O, 0, 1), arm(O, 0, -1)];
const HOLD = [-240, -240, -290, -290, -340, -340, -390, -390];   // body-unit height each arm's tip is held at (inner pair first)
const pass4 = (c) => [W(c, 0), W(c + 1, 0), W(c + 2, 0), W(c + 3, 0), WE(c + 3, 4)];   // starts of the 4 lines + end of the tag
const card = (S, s, x, y, t, out, size = DS.type.body) => S.fadeOut(DS.card(S, s, x, y, { size, t }).g, out, 0.4);
const twinkle = (S, p, t, k = 1) => [[-60, -70, 0.8], [70, -90, 1], [10, -150, 0.6]].forEach(([x, y, r], i) => sparkle(S, p[0] + x * k, p[1] + y * k, t + i * 0.25, r));

// the bathroom with Ollie behind the sink. draw(O, B) adds things in front of Ollie, behind the counter; returns { O, B, pump }
const bath = (S, o = {}, draw) => {
  DS.room(S, BATH_ROOM); bathWall(S);
  const B = o.bibi ? bibi(S, 1600, 520, { k: 0.72, mood: o.bibiMood, paws: [[1500, 650], [1700, 630]] }) : null;
  const O = ollie(S, OX, OGY, OKK, { mouth: o.mouth || "smile", look: o.look || 0 });
  if (draw) draw(O, B);
  bathSink(S);
  const pump = S.grp(); DS.shape(S, rrect(1380, 626, 76, 86, DS.r.sm), "sky", { parent: pump, w: "mid" });    // soap bottle on the counter
  DS.shape(S, rrect(1406, 600, 24, 28, DS.r.xs), "gray", { parent: pump, w: "detail" });
  const head = S.grp(pump); DS.shape(S, rrect(1382, 586, 72, 16, DS.r.xs), "gray", { parent: head, w: "detail" }); DS.shape(S, rrect(1382, 586, 14, 28, DS.r.xs), "gray", { parent: head, w: "detail" });
  S.draw("M1390 650 H1446 M1390 666 H1430", S.start, 0, { c: DS.P.white[0], w: DS.w.detail, parent: pump });
  if (o.towel) { DS.shape(S, rrect(330, 676, 230, 38, DS.r.sm), "grass", { w: "mid" }); S.draw("M342 690 H548 M342 702 H548", S.start, 0, { c: DS.P.white[0], w: DS.w.detail }); }   // folded towel
  return { O, B, head };
};
// foam mitt on an arm tip: lives inside the arm's group, so it follows every raise and wiggle
const MITT = [[0, 0, 34], [-26, -8, 22], [24, -12, 23], [-4, -34, 20], [-16, 22, 18], [18, 24, 19], [34, 20, 13]];
const mitt = (S, A, t, k = 1) => {
  const [g, in_] = popIn(S, t, A.tip[0], A.tip[1], A.wig);
  MITT.forEach(([dx, dy, r]) => S.draw(circ(A.tip[0] + dx * k, A.tip[1] + dy * k, r * k), S.start, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.detail, parent: in_ }));
  return g;
};
const tipAt = (O, A) => O.at(O.tipNow(A));
// one hand icon: mode "palms" | "backs" | "fingers" | "thumbs" | "all"; foam shows what is being scrubbed. Returns the group.
const handIcon = (S, cx, cy, mode, t, out) => {
  const g = S.grp(), P = (d, c, o = {}) => DS.shape(S, d, c, Object.assign({ parent: g, w: "detail" }, o));
  DS.shape(S, rrect(cx - 130, cy - 170, 260, 340, DS.r.lg), "white", { parent: g, flat: true, w: "mid" });
  const back = mode === "backs", FX = [-52, -18, 17, 50], FY = [-86, -106, -110, -90], fg = [];
  FX.forEach((dx, i) => { const f = S.grp(g); P(cap(cx + dx * 0.9, cy - 10, cx + dx, cy + FY[i], 19), "pink", { parent: f }); fg.push([f, cx + dx * 0.9, cy - 10]);
    if (back) S.fill(circ(cx + dx, cy + FY[i] + 14, 9, 12), S.start, 0, DS.P.white[0], 0.9, f); });
  const th = S.grp(g); P(cap(cx - 58, cy + 52, cx - 116, cy - 6, 21), "pink", { parent: th });
  P(circ(cx, cy + 40, 74, 78), "pink");
  const foamAt = (pts, parent) => pts.forEach(([x, y, r]) => S.draw(circ(cx + x, cy + y, r), S.start, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.hair, parent: parent || g }));
  if (mode === "palms" || mode === "backs" || mode === "all") { foamAt([[-20, 20, 24], [22, 14, 26], [0, 54, 26], [-34, 62, 18], [34, 56, 18]]); if (mode === "palms") S.draw(arc(cx, cy + 40, 30, 20, 300), S.start, 0, { c: DS.c("sky", 2), w: DS.w.detail, parent: g }); }
  if (mode === "fingers" || mode === "all") fg.forEach(([f], i) => foamAt([[FX[i], FY[i] + 12, 14], [FX[i] * 0.95, FY[i] * 0.5 - 8, 14]], f));
  if (mode === "thumbs" || mode === "all") foamAt([[-116, -6, 17], [-90, 24, 16], [-70, 48, 14]], th);
  if (mode === "thumbs") S.draw(arc(cx - 116, cy - 6, 34, 200, 340), S.start, 0, { c: DS.c("yellow", 2), w: DS.w.mid, parent: g });
  if (mode === "fingers") fg.forEach(([f, x0, y0], i) => swing(S, f, t + 0.6, out, { rotation: i % 2 ? 7 : -7, svgOrigin: `${x0} ${y0}` }, BEAT));
  if (mode === "thumbs") swing(S, th, t + 0.6, out, { rotation: -9, svgOrigin: `${cx - 58} ${cy + 52}` }, BEAT);
  tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.35 }, t); S.fadeOut(g, out, 0.4);
  return g;
};
// a handful of bubbles rising from the mitts
const rise = (S, O, A, t, n = 3) => { const [x, y] = tipAt(O, A); for (let i = 0; i < n; i++) bubble(S, x + (i - 1) * 34, y - 40 - i * 18, 14 + (i % 2) * 8, 360 + i * 60, { t: t + i * 0.5 }); };

// 0  intro: tap on, Ollie wets his arm tip, the soap pumps, two foam mitts pop up
{ const S = scene(0, W(2, 0) - 0.4, { cam: "none" });
  const { O, head } = bath(S, { look: -8 }, (O) => {
    O.bob(S.start + 0.4, S.end, 6); O.sing(W(1, 0), WE(1, 0));
    const R = arm(O, 3, -1), Lh = arm(O, 3, 1);
    O.holdAt(R, -154, W(1, 1), 0.6);                                   // right arm under the tap on "Tap"
    O.holdAt(R, HOLD[1], W(1, 3) - 0.3, 0.6); O.holdAt(Lh, HOLD[0], W(1, 3) - 0.3, 0.6);
    mitt(S, Lh, W(1, 5)); mitt(S, R, W(1, 5));
    twinkle(S, O.at([-200, -330]), W(1, 5) + 0.3);
  });
  const tap = tapWater(S, W(1, 1)); S.fadeOut(tap, W(1, 3) - 0.3, 0.4);
  S.move(head, W(1, 4), 0.25, { y: 14, yoyo: true, repeat: 1 }, "sine.inOut");
  card(S, "WASH TIME!", 1440, 200, W(1, 0), W(2, 0) - 0.9);
  wide(S, S.start); mid(S, W(1, 3) - 0.8); wide(S, WE(1, 5) + 1.5);
  DS.vignette(S); }

// a scrubbing pass: clips c..c+3 are the sung lines, scene a..b. o: n mitts, k foam size, mode + label for the icon, bibi, mouth
const pass = (c, a, b, o) => {
  const S = scene(a, b, { cam: "none" }), P = pass4(c);
  const { O, B } = bath(S, { bibi: o.bibi, bibiMood: "joy" }, (O, B) => {
    const A = arms8(O).slice(0, o.n);
    A.forEach((x, i) => O.holdAt(x, HOLD[i]));
    A.forEach((x, i) => mitt(S, x, i < 2 || !o.pop ? S.start : o.pop + i * 0.3, o.k));
    O.wiggle(A.map((x) => O.arms.indexOf(x) + 1), P[0], P[4], 9, BEAT);
    O.sing(P[2], P[4]); O.bob(P[0], P[4], 8);
    A.forEach((x, i) => rise(S, O, x, W(c, 2) + i * 0.25, 2));
    twinkle(S, O.at([-180, -420]), WE(c + 3, 4) - 1.2);
    if (B) { swing(S, B.R, P[0], P[4], { rotation: -14, svgOrigin: B.R.sh }, BEAT); }
  });
  handIcon(S, 300, 430, o.mode, W(c, 2), P[2] - 0.9);
  card(S, o.label, 300, 700, W(c, 2), P[2] - 0.9, DS.type.body);
  wide(S, S.start); mid(S, P[1]); close(S, P[2] - 0.4);
  DS.vignette(S); return S;
};
pass(2, W(2, 0) - 0.4, W(6, 0) - 0.4, { n: 2, k: 1, mode: "palms", label: "PALMS" });
pass(6, W(6, 0) - 0.4, WE(9, 4) + 0.3, { n: 2, k: 1.2, mode: "backs", label: "BACKS" });

// 3  break "Wiggle!": Bibi pops up on the right, bubbles float, both mitts wiggle
{ const S = scene(WE(9, 4) + 0.3, W(10, 0) - 0.4, { cam: "none" });
  const { B } = bath(S, { bibi: true, bibiMood: "joy" }, (O) => {
    const A = arms8(O).slice(0, 2); A.forEach((x, i) => O.holdAt(x, HOLD[i])); A.forEach((x) => mitt(S, x, S.start, 1.2));
    O.wiggle([7, 8], S.start + 0.5, S.end - 0.3, 14, BEAT / 2); O.bob(S.start + 0.3, S.end - 0.2, 10);
    A.forEach((x, i) => rise(S, O, x, S.start + 0.6 + i * 0.8, 3));
  });
  popAt(B.g, S.start + 2.4, 1600, 640, 0.6);
  swing(S, B.R, S.start + 3.4, S.end - 0.3, { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  wide(S, S.start); view(S, 1300, 540, 1.25, S.start + 3, 1.6);
  DS.vignette(S); }

pass(10, W(10, 0) - 0.4, WE(13, 4) + 0.3, { n: 4, k: 0.85, mode: "fingers", label: "FINGERS", bibi: true, pop: W(10, 2) });

pass(14, WE(13, 4) + 0.3, WE(17, 4) + 0.3, { n: 6, k: 0.8, mode: "thumbs", label: "THUMBS", bibi: true, pop: W(14, 2) });

// 7  break "All eight hands!": the last two arms swing up with their mitts, one by one
{ const S = scene(WE(17, 4) + 0.3, W(19, 0) - 0.4, { cam: "none" });
  bath(S, { bibi: true, bibiMood: "joy" }, (O, B) => {
    const A = arms8(O); const T = [0, 0, 0, 0, 0, 0, S.start + 1.2, S.start + 2.4];
    A.forEach((x, i) => { if (i < 6) { O.holdAt(x, HOLD[i]); mitt(S, x, S.start, 0.8); } else { O.holdAt(x, HOLD[i], T[i] - 0.4, 0.5); mitt(S, x, T[i], 0.8); } });
    O.wiggle(A.map((x) => O.arms.indexOf(x) + 1), S.start + 3.2, S.end - 0.3, 10, BEAT / 2); O.bob(S.start + 0.3, S.end - 0.2, 10);
    swing(S, B.R, S.start + 0.5, S.end - 0.3, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  });
  card(S, "8 HANDS!", 300, 700, W(18, 0), S.end - 0.5);
  wide(S, S.start); mid(S, S.start + 4.8);
  DS.vignette(S); }

// 8  chorus "Eight hands": all eight mitts scrub, bubbles everywhere
{ const S = pass(19, W(19, 0) - 0.4, W(23, 0) - 0.4, { n: 8, k: 0.8, mode: "all", label: "8 HANDS", bibi: true });
  [[560, 330, 30], [700, 260, 22], [1120, 280, 34], [1260, 340, 26], [1380, 250, 20], [480, 430, 24]].forEach(([x, y, r], i) => bubble(S, x, y, r, 280, { t: W(19, 0) + 0.4 + i * 0.6 })); }

// 9  rinse + shake: the water runs, the foam melts away, droplets fly
{ const S = scene(W(23, 0) - 0.4, W(25, 0) - 0.4, { cam: "none" });
  const ms = [];
  bath(S, { bibi: true, bibiMood: "joy", mouth: "open" }, (O, B) => {
    const A = arms8(O); A.forEach((x, i) => { O.holdAt(x, HOLD[i]); ms.push(mitt(S, x, S.start, 0.8)); });
    O.holdAt(A[1], -154, W(23, 0) - 0.2, 0.6);                                       // right inner arm under the tap
    O.wiggle(A.map((x) => O.arms.indexOf(x) + 1), W(24, 0), WE(24, 5), 12, BEAT / 2); O.bob(S.start + 0.3, S.end - 0.2, 8);
    swing(S, B.R, S.start + 0.5, S.end - 0.3, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
    ms.forEach((m, i) => S.fadeOut(m, W(23, 2 + (i % 4)) + (i >> 2) * 0.5, 0.8));
    A.forEach((x, i) => { const [px, py] = tipAt(O, x); [0, 1].forEach((j) => drop(S, px + (j ? 26 : -26), py + 40, W(24, 1 + j * 2) + i * 0.12, 1)); });
  });
  tapWater(S, W(23, 0));
  card(S, "RINSE!", 300, 700, W(23, 0), W(24, 0) - 0.4); card(S, "SHAKE!", 300, 700, W(24, 0), S.end - 0.5);
  wide(S, S.start); mid(S, W(24, 0) - 0.2);
  DS.vignette(S); }

// 10  pat dry on the towel, eight clean sparkly hands; face close-up on "so bright!" (the take sings the last verse twice, so a second close-up on the reprise)
{ const S = scene(W(25, 0) - 0.4, WE(29, 4) + 0.3, { cam: "none" });
  bath(S, { bibi: true, bibiMood: "joy", mouth: "smile", towel: true }, (O, B) => {
    const A = arms8(O);
    A.forEach((x, i) => O.holdAt(x, HOLD[i]));
    O.holdAt(A[4], -168);                                                             // left long arm over the towel
    const tw8 = O.arms.indexOf(A[4]) + 1;
    O.wiggle([tw8], W(25, 0), WE(25, 5), 10, BEAT / 2);
    O.sing(W(26, 0), WE(26, 4)); O.bob(S.start + 0.3, S.end - 0.2, 8); O.grin(W(26, 0)); O.sing(W(29, 0), WE(29, 4));
    A.forEach((x, i) => twinkle(S, tipAt(O, x), W(26, 2) + i * 0.3, 0.8));
    A.forEach((x, i) => twinkle(S, tipAt(O, x), W(29, 2) + i * 0.3, 0.8));
    swing(S, B.R, S.start + 0.5, S.end - 0.3, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  });
  card(S, "PAT DRY", 300, 700, W(25, 0), W(26, 0) - 0.5, DS.type.body);
  wide(S, S.start); mid(S, W(25, 3)); close(S, W(26, 0) - 0.4); wide(S, WE(26, 4) + 0.6); mid(S, W(28, 0)); close(S, W(29, 0) - 0.4);
  DS.vignette(S); }

// 11  outro: both wave, bye-bye, brand
{ const OUT = WE(29, 4) + 0.3, S = scene(OUT, TOTAL, { cam: "none" });
  const { O, B } = bath(S, { bibi: true, bibiMood: "joy", mouth: "grin" }, (O) => {
    const A = arms8(O); A.forEach((x, i) => O.holdAt(x, HOLD[i]));
    O.wiggle(A.map((x) => O.arms.indexOf(x) + 1), OUT + 0.4, S.end - 1, 12, BEAT); O.bob(S.start + 0.4, S.end, 8);
    A.forEach((x, i) => twinkle(S, tipAt(O, x), S.start + 0.6 + i * 0.4, 0.8));
  });
  swing(S, B.R, OUT + 0.4, S.end - 1, { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  mid(S, S.start + 0.5); wide(S, OUT + 1.5);
  S.fadeOut(DS.card(S, "BYE-BYE!", 300, 700, { size: DS.type.title, t: OUT + 0.4 }).g, S.end - 5, 0.4);
  S.text("Tiny Tune Town", 960, 130, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.end - 4.5 });
  DS.vignette(S); }
