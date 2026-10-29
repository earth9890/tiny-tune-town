// look: still
// @include ../../tools/cast.js
// 26 Buckle My Shoe (traditional counting rhyme, 1916; new tag + music). Ollie gets ready for a day out in the hallway: two more shoes
// buckled every pass on his 8 arm-tips (1-2, 3-4, 5-6, 7-8), knock-knock: Bibi at the door, she lays sticks straight, a fat hen with two tiny
// shoes makes ten. Camera: wide at each pass, medium on the count line, face close-up on "Click, click, click / Buckle up quick!".
// No hard cuts, nothing under 4 s, no flashing.
// ---- take remap (planned line -> sung clip number, or {t: seconds} for a break the singer dropped) ----
const PLAN = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, {"t": 47.353}, 11, 12, 13, 14, {"t": 61.033}, 15, 16, 17, 18, {"t": 86.083}, {"t": 91.203}, 19, 20, 21, 22, 23, 24, 27, 28, {"t": 165.35299999999998}];
const PWN = (c) => TIMING.words.filter((x) => x[0] === PLAN[c]).length;
const PW = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + i * 0.3 : W(PLAN[c], Math.min(i, PWN(c) - 1)));
const PCLIP = (c) => (typeof PLAN[c] === "object" ? [PLAN[c].t, PLAN[c].t + 1.2] : CLIP(PLAN[c]));
const PWE = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + 0.4 + i * 0.3 : WE(PLAN[c], Math.min(i, PWN(c) - 1)));

BEAT = 60 / 118;
const OX = 1100, OGY = 830, FACE = [OX, 570];     // Ollie stands right of the door; zoom anchor = his face
const wide = (S, t) => S.zoom(...FACE, 1, t, 1.3), mid = (S, t) => S.zoom(...FACE, 1.15, t, 1.3), close = (S, t) => S.zoom(...FACE, 1.35, t, 1.3);
const PAIR = { 3: "red", 2: "sky", 1: "purple", 0: "orange" };   // arm index (inner = 3) -> shoe colour; pair n = passes 1..4
const sc = (a, b) => scene(a, b, { cam: "none" });
const pass = (c) => [PW(c, 0), PW(c + 1, 0), PW(c + 2, 0), PW(c + 3, 0), PWE(c + 3, 2)];   // starts of the 4 lines + end of the tag

// ---------- the hallway: back wall with a front door (left), pictures, rug ----------
const hall = (S, o = {}) => {   // o.open: false | true | time the door swings open
  DS.room(S, { window: false });
  DS.frame(S, 800, 150, 200, 160, "sky"); DS.frame(S, 1360, 190, 150, 190, "grass");
  DS.shape(S, rrect(418, 214, 284, 560, DS.r.sm), "wood", { layer: "mid" });
  S.draw(rect(446, 242, 228, 518), S.start, 0, { fill: DS.vgrad(DS.P.sky[1], DS.P.sky[0]), c: DS.line("mid"), w: DS.w.mid });
  S.fill(rect(446, 650, 228, 110), S.start, 0, DS.c("grass", 0), 1); S.fill(circ(610, 330, 34), S.start, 0, DS.c("yellow", 1), 1);
  const leaf = S.grp(), sliver = S.grp();
  DS.shape(S, rect(446, 242, 228, 518), "blue", { parent: leaf, layer: "mid" });
  S.draw("M470 270 H650 V480 H470 Z M470 520 H650 V740 H470 Z", S.start, 0, { c: DS.c("blue", 2), w: DS.w.detail, parent: leaf });
  DS.shape(S, circ(650, 520, 12), "gold", { parent: leaf, w: "detail" });
  DS.shape(S, "M446 242 L494 262 L494 742 L446 760 Z", "blue", { parent: sliver, layer: "mid" });
  const rug = DS.rug(S, OX, 880, 980, "sky");
  if (o.open === true) leaf.setAttribute("opacity", 0);
  else sliver.setAttribute("opacity", 0);
  if (typeof o.open === "number") { S.fadeOut(leaf, o.open, 0.5); S.fadeIn(sliver, o.open, 0.5); }
  return { leaf };
};

// ---------- props: a buckle shoe (toe to +x), sticks, a fat hen ----------
const shoeAt = (S, parent, x, y, dir, col, k, t) => {
  const [, g] = popIn(S, t, x, y, parent), s = G(S, g, `translate(${x} ${y}) scale(${dir * k} ${k})`);
  DS.shape(S, "M-40 14 L-40 -20 Q-38 -30 -24 -30 L-4 -30 Q2 -8 28 -4 Q48 -2 48 14 Z", col, { parent: s, w: "mid" });
  DS.shape(S, rrect(-44, 10, 96, 18, DS.r.xs), "white", { parent: s, w: "detail" });
  DS.shape(S, rrect(-24, -16, 38, 11, DS.r.xs), "white", { parent: s, w: "hair", flat: true });
  DS.shape(S, rrect(6, -22, 13, 22, DS.r.xs), "gold", { parent: s, w: "detail" });
  return g;
};
// Ollie: plant every arm tip on the floor; returns each arm's foot [x, y] in body units
const plant = (O) => O.arms.forEach((A) => { A.foot = O.holdAt(A, A.ai === 3 ? -12 : 0); });
// a pair of shoes on arm ai (left foot at tL, right foot at tR); drawn in body units so they bob with Ollie
const pair = (S, O, ai, tL, tR) => O.arms.filter((A) => A.ai === ai).map((A) =>
  shoeAt(S, O.body, A.foot[0] + A.side * -14, A.foot[1] - 12, A.side === 1 ? -1 : 1, PAIR[ai], 0.9, A.side === 1 ? tL : tR));
const stick = (S, i, mode, tPop, tMove) => {   // mode: "tossed" | "row"; tossed sticks lie at angles, "row" lays them straight
  const SC = [[1500, 905, -35], [1640, 935, 20], [1780, 900, -60]][i], R = [1500 + i * 140, 925, 0];
  const tf = (p) => `translate(${p[0]} ${p[1]}) rotate(${p[2]})`, g = S.grp();
  DS.shape(S, cap(-45, 0, 45, 0, 10), "wood", { parent: g, w: "mid" }); DS.shape(S, circ(45, 0, 10), "earth", { parent: g, w: "detail" });
  g.setAttribute("transform", tf(mode === "row" ? R : SC));
  if (tPop > S.start + 0.05) tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.35 }, tPop);
  if (tMove) tw(g, tMove + i * 0.2, 1.1, tf(SC), tf(R));
  return g;
};
const hen = (S, x, gy, k) => {
  const g = G(S, null, `translate(${x} ${gy}) scale(${k})`), P = (d, c, o = {}) => DS.shape(S, d, c, Object.assign({ parent: g }, o));
  DS.shadow(S, 0, 0, 260, { parent: g });
  P("M-80 -100 Q-150 -170 -120 -215 Q-100 -150 -70 -140 Z", "orange", { w: "mid" }); P("M-84 -80 Q-175 -105 -160 -160 Q-120 -120 -76 -116 Z", "gold", { w: "mid" });
  [-20, 30].forEach((lx) => S.draw(`M${lx} -40 V-4`, S.start, 0, { c: DS.c("orange", 2), w: DS.w.near, parent: g }));
  P(circ(0, -100, 100, 82), "white"); P(circ(-18, -96, 56, 38), "gold", { w: "mid" });
  [[56, -246, 17], [80, -254, 20], [104, -244, 15]].forEach(([cx, cy, r]) => P(circ(cx, cy, r), "red", { w: "mid" }));
  P(circ(78, -190, 48), "white"); P("M120 -192 L160 -178 L120 -164 Z", "orange", { w: "mid" }); P(circ(112, -146, 10, 16), "red", { w: "detail" });
  S.fill(circ(96, -200, 9), S.start, 0, DS.P.ink[0], 1, g); S.fill(circ(99, -204, 3), S.start, 0, DS.P.white[0], 1, g);
  S.fill(circ(100, -172, 14, 8), S.start, 0, DS.c("red", 1), 0.45, g);
  g.shoe = (xx, t) => shoeAt(S, g, xx, -8, 1, "pink", 0.75, t);   // a tiny shoe on one foot
  return g;
};
const nums = (S, a, t0, t1) => [a, a + 1].map((n, i) => num(S, n, 1480 + i * 160, 250, i ? t1 : t0));   // two count cards, top right
const twinkle = (S, x, y, t) => [[-70, -50, 0.7], [60, -70, 0.9], [10, 40, 0.6]].forEach(([dx, dy, r], i) => sparkle(S, x + dx, y + dy, t + i * 0.2, r));

// every pass: wide -> medium on the count line -> face close-up on the tag -> wide; the two numerals + shoes enter on their words
// n = pair number 1..4; done = pairs buckled before this pass; extras(S, O, P) adds scene specifics
const buckleScene = (a, b, c, n, o = {}) => {
  const P = pass(c), S = sc(a, b), ai = [3, 2, 1, 0], done = n - 1;
  const { leaf } = hall(S, { open: o.open === undefined ? (n > 1) : o.open });
  const O = ollie(S, OX, OGY, 1.3, { mouth: "smile", look: o.look ?? -8 });
  plant(O);
  for (let i = 0; i < done; i++) pair(S, O, ai[i], S.start, S.start);
  pair(S, O, ai[done], PW(c, 0), PW(c, 1));
  O.sing(P[0], PWE(c + 1, 2)); O.sing(P[2], P[4]); O.bob(S.start + 0.4, S.end, 6);
  [0, 1, 2].forEach((i) => O.arms.filter((A) => A.ai === ai[done]).forEach((A) => sparkle(S, ...O.at([A.foot[0] + A.side * 20, A.foot[1] - 60]), PW(c + 2, i) + 0.1, 0.5)));
  const cards = nums(S, 2 * n - 1, PW(c, 0), PW(c, 1));
  cards.forEach((cd) => S.fadeOut(cd.g, P[2] - 1, 0.4));
  mid(S, P[1]); close(S, P[2] - 0.4); wide(S, P[4] + 0.4);
  if (o.extras) o.extras(S, O, P, leaf);
  DS.vignette(S);
  return { S, O, P };
};

// 0  intro: Ollie yawns in the hall, door closed, "Time to go out!"
{ const S = sc(0, PW(2, 0) - 0.4);
  hall(S, { open: false });
  const O = ollie(S, OX, OGY, 1.3, { mouth: "smile", look: -10 }); plant(O);
  O.sing(PW(1, 0), PWE(1, 0)); O.sing(PW(1, 1), PWE(1, 4)); O.bob(S.start + 0.3, S.end, 6);
  S.fadeOut(DS.card(S, "GO OUT!", OX, 112, { size: DS.type.body, t: S.start + 1.5 }).g, S.end - 0.3, 0.3);
  mid(S, PW(1, 1) - 0.6);
  DS.vignette(S); }

// 1  pass 1 (1-2, red shoes) + "Knock, knock!": the door rattles
{ const { S } = buckleScene(PW(2, 0) - 0.4, PW(7, 0) - 0.4, 2, 1, { open: false, extras: (S, O, P, leaf) => {
    const k1 = DS.card(S, "KNOCK! KNOCK!", 560, 165, { size: DS.type.body, t: P[4] + 0.8 });
    S.fadeOut(k1.g, S.end - 0.9, 0.4); S.move(leaf, P[4] + 1.2, 0.15, { x: 3, yoyo: true, repeat: 3 }, "sine.inOut");
    S.zoom(560, 420, 1.25, P[4] + 0.8, 1.4); } }); }

// 2  pass 2 (3-4, sky shoes): "Knock at the door" - the door opens, Bibi waves from the doorway
{ const { S, O } = buckleScene(PW(7, 0) - 0.4, PW(12, 0) - 0.4, 7, 2, { open: PW(8, 3) - 0.2, extras: (S, O, P) => {
    const B = bibi(S, 560, 540, { k: 0.62, mood: "joy" });
    popAt(B.g, PW(8, 3), 560, 700, 0.5);
    swing(S, B.R, PW(8, 3) + 0.6, S.end - 0.3, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
    S.fadeOut(DS.card(S, "BIBI!", 560, 112, { size: DS.type.body, t: P[4] + 0.8 }).g, S.end - 0.9, 0.4); } }); }

// 3  pass 3 (5-6, purple shoes): Bibi is inside now, sticks pop onto the floor beside her
{ buckleScene(PW(12, 0) - 0.4, PW(17, 0) - 0.4, 12, 3, { extras: (S, O, P) => {
    DS.shadow(S, 1680, 862, 260);
    const B = bibi(S, 1680, 600, { k: 0.8, mood: "joy" });
    swing(S, B.L, P[0], S.end - 0.3, { rotation: 12, svgOrigin: B.L.sh }, BEAT);
    [0, 1, 2].forEach((i) => stick(S, i, "tossed", PW(13, i) + 0.1));
    S.fadeOut(DS.card(S, "STICKS!", 960, 112, { size: DS.type.body, t: PW(13, 0) }).g, PW(14, 0) - 0.4, 0.4); } }); }

// 4  pass 4 (7-8, orange shoes: all 8 on): "Lay them straight" - the sticks line up; the break ends with a "Cluck!" at the door
{ buckleScene(PW(17, 0) - 0.4, PW(22, 0) - 0.4, 17, 4, { extras: (S, O, P) => {
    DS.shadow(S, 1680, 862, 260);
    const B = bibi(S, 1680, 600, { k: 0.8, mood: "joy" });
    swing(S, B.R, P[0], S.end - 0.3, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
    [0, 1, 2].forEach((i) => stick(S, i, "tossed", S.start, PW(18, 0)));
    const H = hen(S, 560, 745, 0.5); popAt(H, P[4] + 0.8, 560, 700, 0.5);
    S.fadeOut(DS.card(S, "CLUCK!", 560, 112, { size: DS.type.body, t: P[4] + 0.8 }).g, S.end - 0.9, 0.4); } }); }

// 5  pass 5 (9-10): the fat hen waddles in and gets two tiny shoes = ten; then "Eight shoes! Yay!"
{ const P = pass(22), S = sc(PW(22, 0) - 0.4, PW(27, 0) - 0.4);
  hall(S, { open: true });
  DS.shadow(S, 1680, 862, 260);
  const O = ollie(S, OX, OGY, 1.3, { mouth: "smile", look: -8 }); plant(O);
  [3, 2, 1, 0].forEach((ai) => pair(S, O, ai, S.start, S.start));
  const B = bibi(S, 1680, 600, { k: 0.8, mood: "joy" }); [0, 1, 2].forEach((i) => stick(S, i, "row", S.start));
  const H = hen(S, 560, 745, 0.5); tw(H, S.start + 0.4, 3.2, "translate(560 745) scale(0.5)", "translate(500 880) scale(0.95)");
  H.shoe(-30, PW(22, 0)); H.shoe(36, PW(22, 1));
  O.sing(P[0], PWE(23, 3)); O.sing(P[2], P[4]); O.bob(S.start + 0.4, S.end, 6);
  const cards = nums(S, 9, PW(22, 0), PW(22, 1)); cards.forEach((cd) => S.fadeOut(cd.g, P[2] - 1, 0.4));
  swing(S, B.R, P[0], S.end - 0.3, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  O.hop(P[4] + 0.8, 50); O.hop(P[4] + 0.8 + 4 * BEAT, 50);
  twinkle(S, ...O.at([-200, -80]), P[4] + 1); twinkle(S, ...O.at([200, -80]), P[4] + 1.6);
  S.fadeOut(DS.card(S, "8 SHOES!", OX, 112, { size: DS.type.body, t: P[4] + 0.8 }).g, S.end - 0.9, 0.4);
  mid(S, P[1]); close(S, P[2] - 0.4); wide(S, P[4] + 0.4);
  DS.vignette(S); }

// 6  chorus: "Eight shoes on, hooray, hooray / Out we go to play today": everyone cheers, the sunny door behind
{ const P = pass(27), S = sc(PW(27, 0) - 0.4, PW(31, 0) - 0.4);
  hall(S, { open: true });
  DS.shadow(S, 1680, 862, 260);
  const O = ollie(S, OX, OGY, 1.3, { mouth: "smile", look: -6 }); plant(O);
  [3, 2, 1, 0].forEach((ai) => pair(S, O, ai, S.start, S.start));
  const B = bibi(S, 1680, 600, { k: 0.8, mood: "joy" }); [0, 1, 2].forEach((i) => stick(S, i, "row", S.start));
  const H = hen(S, 500, 880, 0.95); H.shoe(-30, S.start); H.shoe(36, S.start);
  O.sing(P[0], PWE(28, 5)); O.sing(P[2], P[4]); O.bob(S.start + 0.4, S.end, 8);
  swing(S, B.R, P[0], S.end - 0.3, { rotation: -16, svgOrigin: B.R.sh }, BEAT); swing(S, B.L, P[0], S.end - 0.3, { rotation: 16, svgOrigin: B.L.sh }, BEAT);
  O.hop(PW(27, 3), 50, 0.6); O.hop(PW(27, 4), 50, 0.6);
  twinkle(S, ...O.at([-210, -90]), PW(27, 3)); twinkle(S, ...O.at([210, -90]), PW(28, 0));
  mid(S, P[0]); wide(S, P[1]); close(S, P[2] - 0.4); wide(S, P[4] + 0.4);
  DS.vignette(S); }

// 7  outro: "Bye-bye!" everyone waves, brand line
{ const S = sc(PW(31, 0) - 0.4, TOTAL);
  hall(S, { open: true });
  DS.shadow(S, 1680, 862, 260);
  const O = ollie(S, OX, OGY, 1.3, { mouth: "grin" }); plant(O);
  [3, 2, 1, 0].forEach((ai) => pair(S, O, ai, S.start, S.start));
  const B = bibi(S, 1680, 600, { k: 0.8, mood: "joy" }); [0, 1, 2].forEach((i) => stick(S, i, "row", S.start));
  const H = hen(S, 500, 880, 0.95); H.shoe(-30, S.start); H.shoe(36, S.start);
  O.bob(S.start + 0.4, S.end, 8); O.sing(PW(31, 0), PWE(31, 0));
  swing(S, B.R, PW(31, 0), S.end - 1, { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  twinkle(S, ...O.at([0, -480]), PW(31, 0) + 0.3);
  S.fadeOut(DS.card(S, "BYE-BYE!", OX, 112, { size: DS.type.body, t: PW(31, 0) }).g, TOTAL - 4.5, 0.4);
  S.text("Tiny Tune Town", 960, 130, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: TOTAL - 4 });
  wide(S, S.start + 0.5);
  DS.vignette(S); }
