// look: still
// @include ../../tools/cast.js
// @include bakery.js
// 11 The Muffin Man (traditional c. 1820). Ollie and Bibi visit the bakery on Drury Lane. Every pass a new treat pops out of the
// oven on its word and lands on one more of Ollie's arms: 2 muffins, 2 buns, 2 pies, 2 loaves = 8 arms juggling. Bibi helps with
// a tray, then a treat party says thank you to the kind Muffin Man. Camera: wide at each pass, medium on line 3, Ollie's face close-up
// on every "Who lives on Drury Lane" (S.zoom around the face; Ollie stays centred). No hard cuts, nothing under 4 s.
BEAT = 60 / 116;
const FACE = [960, 567];                     // Ollie at 960, gy 930, k 1.1 -> face centre 930 - 330 * 1.1
const wide = (S, t) => S.zoom(...FACE, 1, t, 1.3), mid = (S, t) => S.zoom(...FACE, 1.3, t, 1.3), close = (S, t) => S.zoom(...FACE, 1.6, t, 1.3);
// clip numbers in script.json (the lines actually sung, seed 21)
const Q1 = 5, R1 = 9, YUM = 12, BU = 13, MMM = 17, PIE = 19, WHOA = 20, BR = 21, F1 = 25, F2 = 29, TY = 32, DL = 36, BYE = 37;
const pass = (c) => [W(c, 0), W(c + 1, 0), W(c + 2, 0), W(c + 3, 0), WE(c + 3, 4)];   // starts of the 4 lines + end of the tag
const slotCard = (S, str, t, tOut) => S.fadeOut(DS.card(S, str, 600, 220, { size: DS.type.title, t }).g, tOut, 0.4);
const singTag = (O, c) => O.sing(W(c, 0), WE(c, 4));
const M_ = ["muffin", "muffin"], B_ = ["bun", "bun"], P_ = ["pie", "pie"];

// 0  intro (0-12.5), outside on Drury Lane: warm smells curl out of the bakery, Ollie sniffs "Ooh! Something smells yummy!", the camera drifts to the door
{ const S = scene(0, W(Q1, 0) - 0.5, { cam: "none" });
  shopfront(S);
  const B = bibiAt(S, 1640, 960, 0.72, { mood: "joy" });
  const O = ollie(S, 900, 960, 1.0, { look: 10 });
  O.bob(S.start + 0.4, S.end, 8); O.sing(W(1, 0), WE(1, 0)); O.sing(W(3, 0), WE(3, 0)); O.hop(W(2, 2), 50); O.hop(W(4, 2), 50);
  [[1240, 600, 0.3], [1320, 620, 1.2], [700, 560, 2.4], [1280, 610, 5.6], [740, 560, 6.8]].forEach(([x, y, dt]) => wisp(S, x, y, S.start + dt, x > 960 ? -140 : 120));
  swing(S, B.R, S.start + 1, S.end - 0.3, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  S.zoom(1060, 560, 1.25, W(3, 0) - 0.3, 2.4);   // second "Ooh!": drift toward the door
  DS.vignette(S); }

// 1  pass 1, the question (12.5-29): inside; the 1st muffin pops out of the oven on "muffin", the baker waves
{ const P = pass(Q1), S = scene(W(Q1, 0) - 0.5, W(R1, 0) - 0.4, { cam: "none" });
  const { O, M } = bakery(S, { bibiMood: "joy", look: 8 }, (O) => {
    catchTreat(S, O, 0, "muffin", W(Q1, 5));
    O.bob(S.start + 0.3, S.end, 8); singTag(O, Q1 + 3);
  });
  M.wave(W(Q1 + 1, 0), W(Q1 + 2, 0));
  slotCard(S, "MUFFIN", W(Q1, 5), P[3] - 0.9);
  mid(S, P[1] - 0.4); close(S, P[3] - 0.4);
  DS.vignette(S); }

// 2  pass 1, the answer (29-43.7): "Oh, yes, I know": the baker bows, the 2nd muffin lands, Bibi waves; "Yum!" grin in the close-up
{ const S = scene(W(R1, 0) - 0.4, W(BU, 0) - 0.5, { cam: "none" });
  const { O, M, B } = bakery(S, { bibiMood: "joy", held: ["muffin"] }, (O, B, M, J) => {
    const j = catchTreat(S, O, 1, "muffin", W(R1, 5));
    juggle(S, [...J, j], W(R1 + 1, 0), S.end - 0.2);
    O.bob(S.start + 0.3, S.end, 8); singTag(O, R1 + 2); O.grin(W(YUM, 0));
  });
  M.bow(W(R1, 1)); M.bounce(W(R1 + 1, 0), S.end - 0.2, 8);
  swing(S, B.R, W(R1 + 1, 0), W(R1 + 2, 0), { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  S.zoom(1200, 560, 1.15, S.start + 0.2, 1.3);   // start on Ollie + the baker
  mid(S, W(R1 + 1, 0) - 0.4); close(S, W(R1 + 2, 0) - 0.4);
  DS.vignette(S); }

// 3  pass 2 BUNS (43.7-61): two buns pop out on "buns", 4 treats juggling
{ const P = pass(BU), S = scene(W(BU, 0) - 0.5, W(MMM, 0) - 0.4, { cam: "none" });
  const { O, M } = bakery(S, { held: M_ }, (O, B, M, J) => {
    const a = catchTreat(S, O, 2, "bun", W(BU, 5)), b = catchTreat(S, O, 3, "bun", W(BU + 1, 3));
    juggle(S, [...J, a, b], P[2], S.end - 0.2);
    O.bob(S.start + 0.3, S.end, 8); singTag(O, BU + 3);
  });
  M.wave(W(BU, 0), W(BU, 5), -1);
  slotCard(S, "BUNS", W(BU, 5), P[3] - 0.9);
  mid(S, P[1] - 0.4); close(S, P[3] - 0.4);
  DS.vignette(S); }

// 4  "Mmm! Catch it, Ollie!" + pass 3 APPLE PIE (61-80): Bibi fetches a tray, two pies fly out, 6 treats juggling
{ const S = scene(W(MMM, 0) - 0.4, W(WHOA, 0) - 0.4, { cam: "none" });
  const { O, M } = bakery(S, { bibi: false, held: [...M_, ...B_], look: 10 }, (O, B, M, J) => {
    const a = catchTreat(S, O, 4, "pie", W(PIE, 5)), b = catchTreat(S, O, 5, "pie", W(PIE, 5) + 2.2);
    juggle(S, J, S.start + 0.3, W(PIE, 0) - 0.2); juggle(S, [...J, a, b], WE(PIE, 5) + 2.6, S.end - 0.2);
    O.bob(S.start + 0.3, S.end, 8); O.sing(W(MMM, 0), WE(MMM, 0)); O.grin(WE(PIE, 5) + 3);
  });
  const T = bibiTray(S, 420, 930, 0.8, { mood: "joy" }); fadeIn(S, T.tray, W(MMM + 1, 0));
  M.bounce(S.start + 0.3, W(PIE, 0) - 0.2, 8); M.wave(W(PIE, 0), WE(PIE, 5) + 2.4);
  S.fill(circ(MOUTH[0], MOUTH[1] + 60, 220, 180), W(MMM, 0), 0, DS.glow(DS.P.yellow[1], 0.8), 1);
  wisp(S, MOUTH[0] - 20, MOUTH[1] - 40, W(MMM, 0) + 0.2, -100);
  S.zoom(900, 560, 1.2, S.start + 0.3, 3);          // "Mmm! Catch it, Ollie!": Ollie, the glowing oven and Bibi's tray
  wide(S, W(PIE, 0) - 0.5);
  slotCard(S, "APPLE PIE", W(PIE, 5), WE(PIE, 5) + 1.4);
  close(S, WE(PIE, 5) + 1.9);
  DS.vignette(S); }

// 5  "Whoa, whoa!" + pass 4 BREAD (80-100.6): Ollie wobbles with six treats, then two loaves = all 8 arms juggling; Bibi catches the extras
{ const P = pass(BR), S = scene(W(WHOA, 0) - 0.4, WE(BR + 3, 4) + 0.5, { cam: "none" });
  const { O, M } = bakery(S, { bibi: false, held: [...M_, ...B_, ...P_] }, (O, B, M, J) => {
    tw(O.body, S.start + 0.4, P[0] - S.start - 0.8, "rotate(0 0 -250)", "rotate(6 0 -250)", wave(cyc(P[0] - S.start - 0.8, 2 * BEAT)));
    const a = catchTreat(S, O, 6, "bread", W(BR, 6)), b = catchTreat(S, O, 7, "bread", W(BR + 1, 5));
    juggle(S, J, S.start + 0.3, P[0] - 0.2); juggle(S, [...J, a, b], P[1], S.end - 0.2);
    O.sing(W(WHOA, 0), WE(WHOA, 3)); O.bob(P[0], S.end, 8); singTag(O, BR + 3); O.grin(P[1] + 1, P[3]);
  });
  const T = bibiTray(S, 420, 930, 0.8, { mood: "joy" });
  tw(T.g, S.start + 0.8, 1.6, "translate(0 0)", "translate(40 -30)", hump(2));
  [["muffin", -90, "yellow"], ["bun", 0], ["muffin", 90, "grass"]].forEach(([kd, dx, c], i) => { const [, g] = popIn(S, P[2] + i * 0.6, 420 + dx, T.ty - 34, T.tray); treat(S, kd, 420 + dx, T.ty - 34, 0.75, g, c); });
  M.bounce(S.start + 0.3, P[0], 8); M.wave(P[0], P[1] + 1);
  S.zoom(...FACE, 1.2, S.start + 0.3, 1.5);          // the wobble
  wide(S, P[0] - 0.5);
  slotCard(S, "BREAD", W(BR, 6), P[3] - 0.9);
  mid(S, P[1] - 0.4); close(S, P[3] - 0.4);
  DS.vignette(S); }

// 6  instrumental party set-up + the finale question (100.6-127.8): bunting goes up over the party table, everyone together
{ const P = pass(F1), S = scene(WE(BR + 3, 4) + 0.5, W(F2, 0) - 0.4, { cam: "none" });
  const { O, M } = bakery(S, { bibi: false, held: ["muffin", "bun"], mouth: "grin" }, (O, B, M, J) => {
    juggle(S, J, S.start + 0.4, P[0] - 0.2);
    O.bob(S.start + 0.3, S.end, 8); singTag(O, F1 + 3);
  });
  const B = bibiAt(S, 320, 930, 0.8, { mood: "joy" });
  partyTable(S);
  bunting(S, S.start + 1.5);
  M.wave(S.start + 0.8, S.start + 5); M.bounce(P[0], P[3], 10);
  swing(S, B.R, S.start + 2, P[3], { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  S.zoom(960, 600, 1.15, S.start + 5.2, 2);
  wide(S, P[0] - 0.5); mid(S, P[1] - 0.4); close(S, P[3] - 0.4);
  DS.vignette(S); }

// 7  finale answer + "Yum, yum, yum, yum, thank you, muffin man!" (127.8-158.5): hearts for the baker, he bows and waves
{ const S = scene(W(F2, 0) - 0.4, W(BYE, 0) - 0.5, { cam: "none" });
  const { O, M } = bakery(S, { bibi: false, held: ["muffin", "bun"], mouth: "grin" }, (O, B, M, J) => {
    juggle(S, J, W(F2, 0), W(F2 + 2, 0) - 0.2); juggle(S, J, W(TY + 2, 0), W(DL, 0));
    O.bob(S.start + 0.3, S.end, 8); singTag(O, F2 + 2); O.sing(W(TY + 3, 0), WE(TY + 3, 3));
  });
  const B = bibiAt(S, 320, 930, 0.8, { mood: "joy" });
  partyTable(S); bunting(S);
  M.bounce(W(F2, 0), W(F2 + 2, 0), 10); M.bow(W(TY + 1, 1)); M.wave(W(TY + 2, 0), W(DL, 0) + 1);
  swing(S, B.R, W(F2, 0), W(F2 + 2, 0), { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  hearts(S, W(TY + 1, 0), [[1500, 360, 1.2], [1720, 330, 1], [1610, 270, 0.9]]);
  hearts(S, W(TY + 3, 0), [[760, 300, 1], [1160, 280, 1.1], [960, 220, 0.9]]);
  wide(S, S.start + 0.2); mid(S, W(F2 + 1, 0) - 0.4); close(S, W(F2 + 2, 0) - 0.4);   // the close-up holds through "Yum, yum, yum"
  S.zoom(1640, 540, 1.3, W(TY + 1, 0) - 0.4, 1.3);                                     // "Thank you, muffin man!": the blushing baker
  close(S, W(TY + 3, 0) - 0.4);                                                         // then Ollie's big thank-you
  DS.vignette(S); }

// 8  outro (158.5-170): outside on Drury Lane again, everyone waves bye-bye; end card
{ const S = scene(W(BYE, 0) - 0.5, TOTAL, { cam: "none" });
  shopfront(S);
  const B = bibiAt(S, 380, 960, 0.72, { mood: "joy" });
  const M = baker(S, 1640, 960, 0.7);
  const O = ollie(S, 960, 960, 1.0, { mouth: "grin" });
  O.arms.forEach((A) => O.raise(A, [125, 98, 72, 40][A.ai], S.start + 0.6, 0.7));
  O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], S.start + 1.4, S.end - 3, 14, BEAT); O.bob(S.start + 0.4, S.end, 8);
  M.wave(S.start + 0.6, S.end - 2.5);
  swing(S, B.R, S.start + 0.6, S.end - 1, { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  S.fadeOut(DS.card(S, "BYE-BYE!", 1560, 120, { size: DS.type.title, t: S.start + 0.8 }).g, TOTAL - 5, 0.4);
  S.text("Tiny Tune Town", 1500, 130, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: TOTAL - 4.5 });
  DS.vignette(S); }
