// look: still
// @include ../../tools/cast.js
// 08 Itsy Bitsy Spider (traditional). Garden by a little house with a water spout. Itsy (a round purple spider) climbs;
// each pass the weather knocks her down (rain: washed into the puddle, wind: blown onto Ollie's head, snow: slides into a drift),
// the sun comes out and she climbs again. Ollie + Bibi cheer with umbrellas, scarves, then sunglasses. Finale: Ollie shields
// her with his umbrella, a rainbow comes up and she climbs to the very top of the roof. Camera: wide at each pass, a push to
// the spout on the climb, wide for the weather, mid on the sun, Ollie's face close-up on every tag line. No hard cuts.
BEAT = 60 / 96;
// @include spider.js
const wide = (S, t) => S.zoom(...FACE, 1, t, 1.3), mid = (S, t) => S.zoom(...FACE, 1.2, t, 1.3), close = (S, t) => S.zoom(...FACE, 1.45, t, 1.3);
const spoutShot = (S, t) => S.zoom(1100, 600, 1.3, t, 1.3);
const UMB = [-30, -560, 250];                       // Ollie's umbrella canopy (body units)
const BPAW = [[BX - 110 * BK, BHY + 290 * BK], [BX + 150 * BK, BHY + 60 * BK]];   // Bibi: right paw up (umbrella / waving)
// the cast in the garden, in depth order. o: { bibiPaws, look, mood, scarves: t, shades: t }
const cast = (S, o = {}) => {
  const B = gBibi(S, { paws: o.bibiPaws || BPAW, mood: o.mood });
  const O = gOllie(S, { look: o.look });
  if (o.bob !== false) O.bob(S.start + 0.4, S.end - 0.2, 8);
  const sc = {};
  if (o.scarves !== undefined) {
    sc.b = scarf(S, BX, BHY + 108 * BK, 112 * BK, "red", null, BK); fadeIn(S, sc.b.g, o.scarves);
    sc.o = scarf(S, 0, -196, 150, "sky", O.body); fadeIn(S, sc.o.g, o.scarves + 0.8);
  }
  if (o.shades !== undefined) {
    fadeIn(S, shades(S, BX, BHY - 78 * BK, 46 * BK, 30 * BK, "yellow"), o.shades);
    fadeIn(S, shades(S, 0, -448, 58, 40, "yellow", O.body), o.shades + 0.4);
  }
  return { O, B, sc };
};
const ollieUmbrella = (S, O, t0, t1) => {        // the yellow umbrella in arm 1 (left), opens at t0, closes at t1
  const A = arm(O, 1, 1); O.raise(A, 98, t0 - 0.6, 0.6); const [hx, hy] = O.tipNow(A);
  const g = umbrella(S, hx, hy, ...UMB, "yellow", O.body); fadeIn(S, g, t0);
  if (t1) { S.fadeOut(g, t1, 0.5); O.raise(A, 0, t1 + 0.3, 0.6); }
  return g;
};
const bibiUmbrella = (S, t0, t1) => { const g = umbrella(S, ...BPAW[1], BX + 60, BHY - 250 * BK, 140, "red"); fadeIn(S, g, t0); if (t1) S.fadeOut(g, t1, 0.5); return g; };
const sunUp = (S, t) => sunFace(S, 600, 130, 70, t);
const tagLines = (S, O, B, I, t0, t1, y1 = 640) => {   // the hook: Itsy climbs again, Ollie sings it to camera, hands climb
  close(S, t0 - 0.5); O.sing(t0, t1); climbHands(O, t0, t1); bibiClimb(S, B, t0, t1); I.climb(y1, t0, t1 - 0.3);
};

// 0  intro + pass 1 RAIN (0-32.4): Itsy peeks out of the spout on "Ooh!", climbs; rain washes her into the puddle; sun dries her; she climbs again
{ const S = scene(0, 32.4, { cam: "none" });
  garden(S);
  const gray = puff(S, 1420, 120, 0.9, "gray"); fadeIn(S, gray, W(5, 0) - 0.6);
  tw(gray, W(6, 0), 2.4, "translate(0 0)", "translate(420 -40)", "sine.inOut"); S.fadeOut(gray, W(6, 2), 1.2);
  rainFall(S, W(5, 0) + 0.2, W(6, 3));
  puddle(S, W(5, 3)); gush(S, W(5, 5) + 0.7, W(6, 5));
  const sun = sunUp(S, W(6, 3));
  const { O, B } = cast(S);
  ollieUmbrella(S, O, W(5, 3), W(6, 4)); bibiUmbrella(S, W(5, 3) + 0.3, W(6, 4) + 0.2);
  const I = itsy(S, SPX - 70, 868, 0.9, { t: W(1, 0) });
  I.to(SPX, SPBOT, W(2, 0), 1.0); I.arc(70, W(2, 0), 1.0); I.wave(W(2, 2), W(3, 0));
  I.climb(560, W(4, 0) + 0.2, W(5, 0) - 0.2); climbHands(O, W(4, 0), W(5, 0)); bibiClimb(S, B, W(4, 0), W(5, 0));
  I.to(SPX, SPBOT, W(5, 5), 0.9, "power2.in"); I.scurry(W(5, 5), W(5, 5) + 0.9, 24);
  I.to(SPX - 120, 884, W(5, 5) + 0.9, 0.7); I.arc(70, W(5, 5) + 0.9, 0.7); I.spin(W(5, 5) + 0.9, 0.7);
  O.wiggle([3, 5, 6, 7, 8], W(5, 0), W(5, 5), 10, BEAT / 2);                    // fingers rain down
  sunHands(O, W(6, 0), W(6, 9)); I.scurry(W(6, 5), W(6, 7)); sparkle(S, SPX - 120, 840, W(6, 6), 0.7);
  I.to(SPX, SPBOT, W(6, 7), 0.8); I.arc(80, W(6, 7), 0.8);
  tagLines(S, O, B, I, W(7, 0), WE(7, 9));
  I.wave(WE(7, 9), S.end);
  S.zoom(SPX - 120, 780, 1.6, 4.0, 1.3);           // insert: the little spider peeks out
  wide(S, 8.6); spoutShot(S, W(4, 0) + 0.7); wide(S, W(5, 0) - 0.4); mid(S, W(6, 0) + 0.1);
  S.fadeOut(DS.card(S, "ITSY BITSY SPIDER", 960, 200, { size: DS.type.title, t: 0.8 }).g, 3.4, 0.4);
  S.fadeOut(DS.card(S, "RAIN", 1180, 250, { size: DS.type.title, t: W(5, 3) }).g, W(6, 0) - 0.5, 0.4);
  foreground(S); DS.vignette(S); }

// 1  pass 2 WIND (32.4-61.6): she climbs; scarves on for "Whoosh!"; the gust blows her off onto Ollie's head; the sun chases the wind away
{ const S = scene(32.4, 61.6, { cam: "none" });
  garden(S);
  windBlow(S, W(9, 0), W(13, 5));
  sunUp(S, W(13, 3));
  const { O, B, sc } = cast(S, { scarves: W(9, 0) + 0.3, bob: false });
  O.bob(S.start + 0.4, W(12, 0), 8); O.bob(W(14, 0), S.end - 0.2, 8);
  const I = itsy(S, SPX, 640, 0.9);
  I.climb(540, S.start + 0.2, WE(8, 8));
  sc.b.flap(W(9, 2), W(13, 6), 14); sc.o.flap(W(9, 2) + 0.3, W(13, 6), 14);
  O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], W(10, 0), W(12, 0), 16, BEAT); swing(S, B.L, W(10, 0), W(12, 0), { rotation: 20, svgOrigin: B.L.sh }, BEAT);  // arms sway in the wind
  I.scurry(W(11, 0), W(12, 0), 20); I.to(SPX + 10, 540, W(11, 0), 0.8); I.to(SPX - 10, 540, W(11, 0) + 0.8, 0.8); I.to(SPX, 540, W(11, 0) + 1.6, 0.8);  // holding on
  const land = W(12, 1) + 1.6;
  I.to(OX, OGY - 500 * OK - 34, W(12, 1), 1.6, "power1.inOut"); I.arc(180, W(12, 1), 1.6); I.spin(W(12, 1), 1.6);   // blown onto Ollie's head
  O.grin(land, W(13, 4)); I.wave(land + 0.3, W(13, 5));
  I.to(SPX, SPBOT, W(13, 6), 1.3); I.arc(220, W(13, 6), 1.3);                    // hops back to the spout
  sunHands(O, W(13, 0), W(13, 6));
  tagLines(S, O, B, I, W(14, 0), WE(14, 9));
  spoutShot(S, S.start + 0.6); S.zoom(560, 560, 1.3, W(9, 0) - 1.1, 1.3);       // the climb; then Bibi + Ollie put scarves on
  wide(S, W(10, 0) - 0.2); spoutShot(S, W(11, 0) + 2.0); mid(S, land - 0.4);
  S.fadeOut(DS.card(S, "WIND", 960, 200, { size: DS.type.title, t: W(10, 0) }).g, W(11, 0) + 1.0, 0.4);
  foreground(S); DS.vignette(S); }

// 2  pass 3 SNOW (61.6-81.6): "Brrr!" snow falls, everyone shivers in scarves; she slips down the icy spout into a drift; the sun melts the snow
{ const S = scene(61.6, 81.6, { cam: "none" });
  garden(S, { clouds: [[300, 150, 0.8, "glass"], [1050, 110, 0.6, "glass"], [1500, 120, 0.8, "glass"]] });
  snowFall(S, S.start + 0.6, W(18, 3)); snowCover(S, W(15, 2), W(18, 5));
  sunUp(S, W(18, 3));
  const { O, B } = cast(S, { scarves: S.start });
  O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], W(15, 0), WE(16, 1), 5, BEAT / 2);                   // shiver, brrr
  swing(S, B.g, W(15, 0), WE(16, 1), { x: 5 }, BEAT / 2);
  const I = itsy(S, SPX, 640, 0.9), drift = SPX - 110;
  const cap_ = S.draw(circ(0, -46, 34, 18), S.start, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.detail, parent: I.body }); cap_.setAttribute("opacity", 0);
  I.climb(530, W(17, 0), W(17, 6));
  I.to(SPX, SPBOT, W(17, 6) + 0.1, 1.0, "power2.in"); I.to(drift, 884, W(17, 6) + 1.1, 0.6); I.arc(50, W(17, 6) + 1.1, 0.6);   // wheee: the icy slide
  const pile = layerOf(S, W(15, 2), W(18, 5)); S.draw(circ(drift, 900, 110, 44), S.start, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.detail, parent: pile });
  tl.set(cap_, { opacity: 1 }, W(17, 6) + 1.7); S.fadeOut(cap_, W(18, 5), 0.6);
  I.scurry(W(18, 5), W(18, 7)); sparkle(S, drift, 840, W(18, 6), 0.7);
  I.to(SPX, SPBOT, W(18, 7), 0.8); I.arc(90, W(18, 7), 0.8);
  sunHands(O, W(18, 0), W(18, 8));
  tagLines(S, O, B, I, W(19, 0), WE(19, 9));
  mid(S, W(16, 0) + 1.4); spoutShot(S, W(17, 0) + 2.8);
  S.fadeOut(DS.card(S, "SNOW", 960, 200, { size: DS.type.title, t: W(16, 1) }).g, W(16, 1) + 2.4, 0.4);
  foreground(S); DS.vignette(S); }

// 3  pass 4 SUNSHINE (81.6-109.9): sunglasses on, no rain / wind / snow; she climbs nearly to the top while everyone dances
{ const S = scene(81.6, 109.9, { cam: "none" });
  garden(S);
  sunUp(S, W(21, 3));
  const { O, B } = cast(S, { shades: W(22, 0) });
  const I = itsy(S, SPX, 640, 0.9);
  I.climb(580, S.start + 0.4, WE(20, 8)); climbHands(O, W(20, 0), WE(20, 8)); bibiClimb(S, B, W(20, 0), WE(20, 8));
  sunHands(O, W(21, 0), WE(21, 3) + 0.6);
  O.wiggle([3, 4, 5, 6, 7, 8], W(22, 0), WE(24, 4), 14, BEAT); swing(S, B.L, W(22, 0), WE(24, 4), { rotation: 24, svgOrigin: B.L.sh }, BEAT);   // sunny dance
  I.scurry(W(22, 0), WE(24, 4), 10); I.climb(560, W(24, 0), WE(24, 4));
  [[1, "rain"], [3, "wind"], [5, "snow"]].forEach(([wi, kind], i) => {          // the three weathers pop up and float away: not today!
    const x = 760 + i * 200, g = G(S, null, "translate(0 0)"), [, in_] = popIn(S, W(23, wi), x, 170, g);
    DS.shape(S, circ(x, 170, 62), "white", { parent: in_, w: "mid" });
    if (kind === "rain") DS.shape(S, `M${x} 128 C${x + 30} 168 ${x + 30} 200 ${x} 204 C${x - 30} 200 ${x - 30} 168 ${x} 128 Z`, "blue", { parent: in_, w: "mid" });
    if (kind === "wind") S.draw(`M${x - 40} 160 q40 -20 70 0 q20 -30 -6 -40 M${x - 40} 188 h60`, S.start, 0, { c: DS.c("sky", 2), w: DS.w.near, parent: in_ });
    if (kind === "snow") S.draw(rays(x, 170, 0, 38, 6), S.start, 0, { c: DS.c("sky", 2), w: DS.w.near, parent: in_ });
    tw(g, W(24, 0), 1.6, "translate(0 0)", "translate(0 -60)", "sine.in"); S.fadeOut(g, W(24, 0), 1.4);
  });
  tagLines(S, O, B, I, W(25, 0), WE(26, 4), 520);
  mid(S, W(21, 0) + 0.6); wide(S, W(23, 0) - 0.6); spoutShot(S, W(24, 0)); spoutShot(S, W(26, 0) - 0.3);
  S.fadeOut(DS.card(S, "SUNNY!", 960, 200, { size: DS.type.title, t: W(22, 0) }).g, W(23, 0) - 0.8, 0.4);
  foreground(S); DS.vignette(S); }

// 4  finale (109.9-157.0): "Look, a rainbow!"; rain again, but Ollie holds his umbrella over Itsy; sun, rainbow, up up up to the very top of the roof
{ const S = scene(109.9, 157.0, { cam: "none" });
  garden(S, { rainbow: W(27, 0) + 0.3, clouds: [[1050, 110, 0.6, "white"]] });
  const gray = puff(S, 1150, 110, 0.8, "gray"); fadeIn(S, gray, W(31, 0) - 0.6); S.fadeOut(gray, W(32, 1), 1.0);
  rainFall(S, W(31, 0), W(32, 3));
  sunFace(S, 260, 110, 70, S.start);
  const { O, B } = cast(S);
  const I = itsy(S, SPX, 520, 0.9);
  I.wave(W(28, 0), WE(29, 3));
  I.climb(480, W(30, 0), WE(30, 4));
  const A = arm(O, 0, -1), [hx, hy] = aim(O, A, ...toBody(1250, 520), W(31, 0) - 0.6, 0.7);   // Ollie reaches out: an umbrella for Itsy
  const ug = umbrella(S, hx, hy, ...toBody(SPX, 405), 75, "sky", O.body); fadeIn(S, ug, W(31, 0)); S.fadeOut(ug, W(32, 3), 0.5); O.raise(A, 0, W(32, 3) + 0.4, 0.7);
  bibiUmbrella(S, W(31, 0) + 0.3, W(32, 3) + 0.2);
  I.wave(W(31, 2), W(32, 3));
  sunHands(O, W(33, 0), WE(33, 3) + 0.4); [[1000, 120], [700, 220], [1300, 200]].forEach(([x, y], i) => sparkle(S, x, y, W(33, 3) + i * 0.3, 0.9));
  I.climb(SPTOP - 10, W(34, 0), WE(34, 4));
  const ry = (x) => 412 - (x - 1280) * (232 / 315) - 34;                        // standing on the roof slope
  I.to(SPX, ry(SPX), W(35, 0), 0.7); I.arc(40, W(35, 0), 0.7);
  I.to(1595, 140, W(35, 0) + 0.7, WE(36, 5) - W(35, 0) - 0.9); I.scurry(W(35, 0) + 0.7, WE(36, 5) - 0.2);
  I.wave(WE(36, 5), S.end, 1); I.wave(WE(36, 5) + BEAT, S.end, -1);
  [[1595, 60, 1], [1500, 110, 0.7], [1690, 110, 0.7]].forEach(([x, y, r], i) => sparkle(S, x, y, W(36, 4) + i * 0.3, r));
  O.hop(WE(36, 5), 60); O.hop(WE(40, 4), 60); hearts(S, WE(36, 5) + 0.3, [[560, 420, 1], [1060, 380, 1.2], [300, 360, 0.8]]);
  swing(S, B.R, WE(36, 5), S.end - 0.3, { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  climbHands(O, W(37, 0), WE(38, 4)); O.sing(W(39, 0), WE(40, 4)); O.grin(WE(40, 4));
  mid(S, W(27, 0) + 4.1); spoutShot(S, W(28, 0)); wide(S, W(31, 0) - 0.5);
  S.zoom(1350, 400, 1.4, W(33, 0), 1.3); wide(S, W(35, 0)); mid(S, WE(36, 5) + 0.6); close(S, W(39, 0) - 0.5);
  S.fadeOut(DS.card(S, "RAINBOW!", 960, 200, { size: DS.type.title, t: W(27, 2) }).g, W(27, 0) + 3.0, 0.4);
  foreground(S); DS.vignette(S); }

// 5  outro (157.0-170): Hooray! Bye-bye, little spider: everyone waves; Itsy waves from the roof top; end card
{ const S = scene(157.0, 170.0, { cam: "none" });
  garden(S, { rainbow: S.start, clouds: [[1050, 110, 0.6, "white"]] });
  sunFace(S, 260, 110, 70, S.start);
  const { O, B } = cast(S);
  O.grin(S.start);
  [arm(O, 0, 1), arm(O, 0, -1)].forEach((A) => O.raise(A, 100, W(41, 0) - 0.4, 0.6));
  O.wiggle([1, 2], W(42, 0), S.end - 1, 14, BEAT);
  swing(S, B.R, W(41, 0), S.end - 1, { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  const I = itsy(S, 1595, 140, 0.9); I.wave(S.start + 0.3, S.end - 0.5, 1); I.scurry(W(41, 0), WE(41, 0) + 1);
  hearts(S, W(42, 0), [[560, 420, 1], [1060, 380, 1.2], [300, 360, 0.8]]);
  mid(S, 161.0); wide(S, 165.4);
  S.fadeOut(DS.card(S, "BYE-BYE!", 960, 200, { size: DS.type.title, t: W(42, 0) }).g, 164.6, 0.4);
  S.text("Tiny Tune Town", 960, 160, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: 165.4 });
  foreground(S); DS.vignette(S); }
