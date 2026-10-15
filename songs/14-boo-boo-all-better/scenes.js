// look: still
// @include ../../tools/cast.js
// @include boo.js
// 14 Boo-Boo All Better (original). A sunny playground: Bibi slides down and bumps her knee; Ollie helps (a star bandage held up on
// "a star for you", then wash - kiss - hug - all better on the hook). Then Crab's elbow, Ollie's own finger
// (Bibi helps HIM), Turtle's nose; healed friends cheer by the swings. Finale: everyone in star bandages, slot recap, a dance, bye-bye.
// Camera per pass: wide -> mid on Ollie + star -> low insert on the boo-boo -> two-shot face close-up on every hook -> wide.
// No hard cuts, nothing under 4 s. Times come from the sung take (script.json): WD(clip, /word/) finds a word in a sung line.
BEAT = 60 / 92;
const OX = 1080, OGY = 905, OK = 1.15, FX = 520, FGY = 900;
const WD = (c, re) => (TIMING.words.find((w) => w[0] === c && re.test(w[2])) || TIMING.words.find((w) => w[0] === c))[3];
const wide = (S, t) => S.zoom(960, 540, 1, t, 1.3), mid = (S, t) => S.zoom(900, 560, 1.3, t, 1.3);
const insert = (S, t, p = [640, 760]) => S.zoom(...p, 1.75, t, 1.3), close = (S, t) => S.zoom(800, 575, 1.55, t, 1.3);
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const hero = (S, o = {}) => { const O = ollie(S, o.x || OX, OGY, OK, { mouth: o.mouth || "smile", look: o.look ?? -10 }); O.bob(S.start + 0.4, S.end, 6); return O; };
// Ollie lifts his inner left arm beside his face, nods on each "there" and shows a star bandage (on "star", if it was sung)
const offer = (S, O, c, cs) => { const A = arm(O, 2, 1), [tx, ty] = O.holdAt(A, -300, CLIP(c)[0] - 0.6, 0.5);
  TIMING.words.filter((w) => w[0] === c && /^there/i.test(w[2])).forEach((w) => O.hop(w[3], 16, 0.4));
  return { A, g: plaster(S, tx - 6, ty - 34, -20, 1.2, cs ? WD(cs, /star/) : CLIP(c)[1] - 0.4, O.body) }; };
// the hook (clip c = "Wash it, kiss it,", c + 1 = "hug it, all better!"): wash (drops), kiss (heart), hug (both lean in),
// all better (the held star fades, sparkles, grin); returns the "all better" time
const hook = (S, O, c, bp, lean, held) => {
  const [w, k, h, b] = [WD(c, /wash/i), WD(c, /kiss/), WD(c + 1, /hug/), WD(c + 1, /all/)];
  O.sing(w - 0.1, b); O.grin(b);
  washAt(S, ...bp, w); kissAt(S, ...bp, k);
  tw(O.body, h, b - h + 0.8, "rotate(0 0 -250)", "rotate(-6 0 -250)", hump(1));
  if (lean) tw(lean[0], h, b - h + 0.8, `rotate(0 ${lean[1]})`, `rotate(6 ${lean[1]})`, hump(1));
  if (held) { S.fadeOut(held.g, b - 0.1, 0.3); O.raise(held.A, 0, b + 0.3, 0.8); }
  shine(S, ...bp, b + 0.1);
  return b;
};
const card = (S, str, t, tOut) => S.fadeOut(DS.card(S, str, 960, 150, { size: DS.type.title, t }).g, tOut, 0.4);
const fingerTip = (O) => { const A = arm(O, 0, 1); return [A, A.tip[0] + 6, A.tip[1] - 4]; };   // Ollie's "finger": outer left arm tip
// healed friends cheering by the swings (mid plane)
const fans = (S, list) => list.forEach((f) => {
  if (f === "bibi") { const B = bibiSit(S, 1650, 830, 0.5, { mood: "joy" }); plaster(S, ...B.knee, -30, 0.6, S.start, B.w);
    tw(B.w, S.start + 0.5, S.len - 0.8, "translate(0 0)", "translate(0 -14)", hump(cyc(S.len - 0.8, 2 * BEAT))); }
  if (f === "crab") { const C = crab(S, 1460, 845, 0.75); plaster(S, 96, -124, -50, 0.8, S.start, C.bob); C.dance(S.start + 0.5, S.end - 0.3); }
});

// 0  intro (0-20.9): "Wheee!" Bibi zooms down the slide, lands with an "Ooh!" and a sad face; Ollie waddles over from the swings
{ const S = scene(0, 20.9, { cam: "none" });
  park(S); const O = hero(S, { look: -14 });
  const sh = O.pos.previousSibling;                                          // Ollie's contact shadow travels with him
  tl.set(O.pos, { attr: { transform: `translate(1560 ${OGY}) scale(${OK})` } }, 0); tl.set(sh, { attr: { transform: "translate(480 0)" } }, 0);
  tw(O.pos, 12.0, 3.4, `translate(1560 ${OGY}) scale(${OK})`, `translate(${OX} ${OGY}) scale(${OK})`, "sine.inOut"); tw(sh, 12.0, 3.4, "translate(480 0)", "translate(0 0)", "sine.inOut");
  [12.1, 13.2, 14.3].forEach((t) => O.hop(t, 34, 0.5));
  const B = bibiSit(S, FX, FGY, 0.85, { sad: CLIP(2)[0] + 0.2 });
  const at = (x, y, s) => `translate(${x} ${y}) scale(${s}) translate(${-FX} ${-FGY})`;
  B.w.setAttribute("transform", at(150, 384, 0.5));
  tw(B.w, 1.6, 0.6, at(150, 384, 0.5), at(255, 392, 0.52));
  tw(B.w, 3.0, 1.0, at(255, 392, 0.52), at(345, 590, 0.66), "power1.in");
  tw(B.w, 4.0, 0.8, at(345, 590, 0.66), at(FX, FGY, 0.85), "power2.out");
  mark(S, ...B.knee, 13, CLIP(2)[0] + 0.4, B.w);
  S.zoom(420, 560, 1.25, 0.3, 2.5);                 // look at the slide
  S.zoom(600, 720, 1.6, CLIP(2)[0], 1.3);           // "Ooh!": close on Bibi's sad face and knee
  wide(S, 11.6);                                    // Ollie hurries over
  S.zoom(800, 575, 1.3, 16.2, 1.3);                 // the two of them
  DS.vignette(S); }

// 1  pass 1 KNEE (20.9-43.2): Bibi's knee; Ollie shows the star, washes, kisses, hugs; the bandage goes on; all better
{ const S = scene(20.9, 43.2, { cam: "none" });
  park(S); const O = hero(S), held = offer(S, O, 5, 6);
  const B = bibiSit(S, FX, FGY, 0.85, { sad: S.start, joyAt: WD(10, /all/) });
  mark(S, ...B.knee, 13, S.start, B.w);
  const b = hook(S, O, 9, B.knee, [B.w, `${FX} ${FGY}`], held);
  plaster(S, ...B.knee, -30, 1.0, b, B.joy.g);
  wide(S, S.start + 0.1); mid(S, CLIP(5)[0] - 0.4); insert(S, CLIP(7)[0] - 0.3); close(S, CLIP(9)[0] - 0.4);
  card(S, "KNEE", WD(4, /knee/), CLIP(5)[0] - 0.9);
  DS.vignette(S); }

// 2  pass 2 ELBOW (43.2-59): Crab bumped an elbow on the swing; Ollie's "there, there", the star, wash-kiss-hug, all better; a happy clap
{ const S = scene(43.2, 59.0, { cam: "none" });
  park(S); fans(S, ["bibi"]); const O = hero(S), held = offer(S, O, 13);
  const cx = FX + 40, C = crab(S, cx, FGY, 1.5), sg = crabSad(S, C, S.start);
  mark(S, 96, -124, 9, WD(12, /elbow/), C.bob);
  const b = hook(S, O, 16, [cx + 96 * 1.5, FGY - 124 * 1.5], [C.bob, "0 -80"], held);
  plaster(S, 96, -124, -50, 0.8, b, C.bob); better(S, sg, b); C.clap(b + 0.5);
  wide(S, S.start + 0.1); S.zoom(900, 560, 1.2, CLIP(13)[0] - 0.4, 1.3); close(S, CLIP(16)[0] - 0.4);
  card(S, "ELBOW", WD(12, /elbow/), CLIP(13)[0] - 0.9);
  DS.vignette(S); }

// 3  pass 3 FINGER (59-83): uh-oh, Ollie bonks the tip of an arm; now Bibi helps HIM with the star
{ const S = scene(59.0, 83.0, { cam: "none" });
  park(S); fans(S, ["crab"]); const O = hero(S, { look: -6 }), bump = 60.2, so = ollieSad(S, O, bump);
  const [FA, fx, fy] = fingerTip(O), bp = O.at([fx, fy]);
  mark(S, fx, fy, 11, bump, FA.wig);
  O.wiggle([2], S.start + 0.2, bump, 14, BEAT);                              // waving the arm about... bonk
  const bx = 400, B = bibiSit(S, bx, FGY, 0.85, { paws: [[bx - 108, 838], [560, 752]] });
  plaster(S, ...B.knee, -30, 1.0, S.start, B.w);
  const star = plaster(S, 590, 640, -20, 1.2, WD(22, /star/), B.w);
  const b = hook(S, O, 23, bp, [B.w, `${bx} ${FGY}`]);
  S.fadeOut(star, b - 0.1, 0.3); plaster(S, fx, fy, 60, 0.9, b, FA.wig); better(S, so, b);
  wide(S, S.start + 0.1); insert(S, 62.6, [620, 760]); wide(S, CLIP(19)[0] - 0.4);
  S.zoom(560, 640, 1.3, CLIP(21)[0] - 0.3, 1.3); close(S, CLIP(23)[0] - 0.4);
  card(S, "FINGER", WD(20, /finger/), CLIP(21)[0] - 0.9);
  DS.vignette(S); }

// 4  pass 4 NOSE (83-107.3): "Who's next?" Turtle bonked a nose on the slide; the star, wash-kiss-hug, all better, a happy dance
{ const S = scene(83.0, 107.3, { cam: "none" });
  park(S); fans(S, ["bibi", "crab"]); const O = hero(S), held = offer(S, O, 28, 29);
  const [FA, fx, fy] = fingerTip(O); plaster(S, fx, fy, 60, 0.9, S.start, FA.wig);
  const tx = FX - 60, T = turtle(S, tx, FGY + 10, 1.6), sg = turtleSad(S, T, S.start);
  mark(S, 168, -88, 8, WD(27, /nose/), T.bob);
  const b = hook(S, O, 32, [tx + 168 * 1.6, FGY + 10 - 88 * 1.6], [T.bob, "0 -60"], held);
  plaster(S, 166, -88, 80, 0.55, b, T.bob); better(S, sg, b); T.dance(b + 1.2, S.end - 0.2);
  wide(S, S.start + 0.1); S.zoom(900, 560, 1.2, CLIP(28)[0] - 0.4, 1.3); insert(S, CLIP(30)[0] - 0.3, [700, 740]); close(S, CLIP(32)[0] - 0.4); wide(S, CLIP(33)[1] - 0.1);
  card(S, "NOSE", WD(27, /nose/), CLIP(28)[0] - 0.9);
  DS.vignette(S); }

// everyone in a row with their star bandages; returns the cast and their boo-boo points
const lineup = (S) => {
  park(S, { swings: false });
  const T = turtle(S, 250, 930, 1.2); plaster(S, 166, -88, 80, 0.55, S.start, T.bob);
  const C = crab(S, 1560, 920, 1.25); plaster(S, 96, -124, -50, 0.8, S.start, C.bob);
  const O = hero(S, { x: 1060, mouth: "grin", look: 0 }); const [FA, fx, fy] = fingerTip(O); plaster(S, fx, fy, 60, 0.9, S.start, FA.wig);
  const B = bibiSit(S, 610, 915, 0.75, { mood: "joy" }); plaster(S, ...B.knee, -30, 0.9, S.start, B.w);
  return { T, C, O, B, pts: { knee: B.knee, elbow: [1560 + 120, 920 - 155], finger: O.at([fx, fy]), nose: [250 + 200, 930 - 106] } };
};
const jump = (S, g, ts, h = 26) => ts.forEach((t) => tw(g, t, 0.45, "translate(0 0)", `translate(0 ${-h})`, hump(1)));
// one chorus from clip c ("Hooray!"): every boo-boo sparkles on its word, everyone jumps on "yay", hearts on the hook
const chorus = (S, L, c) => {
  [["knee", c + 1], ["elbow", c + 1], ["finger", c + 2], ["nose", c + 2]].forEach(([k, ci]) => shine(S, ...L.pts[k], WD(ci, new RegExp(k, "i"))));
  const yays = TIMING.words.filter((w) => w[0] === c + 4 && /yay/i.test(w[2])).map((w) => w[3]);
  [L.B.w, L.C.bob, L.T.bob].forEach((g) => jump(S, g, yays)); yays.forEach((t) => L.O.hop(t, 30, 0.45));
  [[480, 260], [960, 180], [1440, 260], [700, 140], [1220, 140]].forEach(([x, y], i) => sparkle(S, x, y, CLIP(c + 3)[0] + i * 0.3, 0.9));
  L.O.sing(CLIP(c + 5)[0] - 0.1, WD(c + 6, /all/)); L.O.grin(WD(c + 6, /all/)); hearts(S, WD(c + 6, /hug/), [[820, 520, 1.3], [1300, 500, 1.1]]);
  L.O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], CLIP(c)[0], CLIP(c)[1], 12, BEAT);
  wide(S, CLIP(c)[0] - 0.4); S.zoom(960, 700, 1.25, CLIP(c + 1)[0] - 0.3, 1.3); wide(S, CLIP(c + 3)[0] - 0.3); S.zoom(1060, 520, 1.9, CLIP(c + 5)[0] - 0.4, 1.3);
  card(S, "STARS FOR EVERYONE!", CLIP(c + 3)[0], CLIP(c + 4)[1] + 0.3);
};

// 5  finale chorus 1 (107.3-128.7)
{ const S = scene(107.3, 128.7, { cam: "none" });
  const L = lineup(S); chorus(S, L, 34); wide(S, CLIP(40)[1] + 0.2);
  DS.vignette(S); }

// 6  chorus 2, big hugs (everyone leans in, hearts), bye-bye waves, end card (128.7-170)
{ const S = scene(128.7, 170.0, { cam: "none" });
  const L = lineup(S), { T, C, O, B } = L; chorus(S, L, 41);
  [[B.w, "610 915", 6], [C.bob, "0 -80", -8], [T.bob, "0 -60", 6]].forEach(([g, p, a]) => [48, 50].forEach((c) => tw(g, CLIP(c)[0], 2.2, `rotate(0 ${p})`, `rotate(${a} ${p})`, hump(1))));
  hearts(S, CLIP(48)[0] + 0.4, [[820, 600, 1.4], [1300, 580, 1.2], [480, 640, 1.1], [1560, 600, 1.1]]);
  [arm(O, 1, 1), arm(O, 1, -1)].forEach((A) => O.raise(A, 120, CLIP(52)[0] - 0.5, 0.6));
  O.wiggle([3, 4], CLIP(52)[0], S.end - 1, 14, BEAT); C.dance(CLIP(52)[0], S.end - 1); T.dance(CLIP(52)[0], S.end - 1);
  wide(S, CLIP(48)[0] - 0.4); S.zoom(960, 640, 1.2, CLIP(50)[0] - 0.3, 1.3); wide(S, CLIP(52)[0] - 0.4);
  S.fadeOut(DS.card(S, "BYE-BYE!", 960, 150, { size: DS.type.title, t: CLIP(52)[0] }).g, 165, 0.4);
  S.text("Tiny Tune Town", 960, 130, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: 165.5 });
  DS.vignette(S); }
