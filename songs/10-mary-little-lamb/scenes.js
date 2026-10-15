// look: still
// @include ../../tools/cast.js
// @include lamb.js
// 10 Mary Had a Little Lamb (Hale 1830, public domain; new verses + music by Tiny Tune Town). Ollie reads a storybook on a sunny hill;
// the lamb hops out of the page on "snow" and follows him everywhere: down the park slide ("Wheee!"), into the shopping cart while
// Ollie fills all eight arms ("Yum!"), to a school desk beside Bibi. Back on the hill: a big hug, best friends; Bibi joins for bye-bye.
// Camera per pass: wide (the lamb pops up on "baa"), face close-up on every tag line, wide or mid for the gag in the break. Shots >= 4 s.
// Clip numbers = script.json lines (the take as sung: the shop pass is sung twice, the school pass has no "school, school" line).
BEAT = 60 / 98;
const camF = (S, F) => ({ wide: (t) => S.zoom(...F, 1, t, 1.3), close: (t) => S.zoom(...F, 1.45, t, 1.3) });
const card = (S, s, t, out) => S.fadeOut(DS.card(S, s, 960, 150, { size: DS.type.title, t }).g, out, 0.4);
const baas = (S, L, ts) => ts.forEach((t) => L.baa(t, t + 0.3));
const sings = (O, list) => list.forEach((c) => O.sing(W(c, 0), CLIP(c)[1]));
// Ollie holds a thing up in arm A (raised to angle a): returns the group to draw it in, at the tip
const holdUp = (S, O, A, a, t, ext = 40) => { O.raise(A, a, t - 0.4, 0.5); A.cur = a * A.side; const [x, y] = O.tipNow(A, ext); const [, g] = popIn(S, t, x, y, O.body); return [g, x, y]; };

// 0  hill: wordless intro (Ollie finds a storybook), the classic verse, the lamb hops out of the page on "snow" (0-31)
{ const S = scene(0, 31.0, { cam: "none" }), F = [1010, 471], C = camF(S, F);
  hill(S); const [px, py] = storybook(S, 420, 900);
  const pic = S.grp(); lamb(S, px, py - 30, 0.55, { dir: -1, parent: pic });
  const O = ollie(S, 1010, 900, 1.3, { look: -14 });
  O.bob(S.start + 0.4, 25, 6); O.hop(9.6, 40); O.hop(10.6, 40);
  sings(O, [1, 2, 3, 4]);
  const L = lamb(S, 660, 905, 1.0, { dir: 1 });
  popAt(L.g, W(4, 5), 660, 760, 0.35); L.hop(W(4, 5) + 0.3, 60); S.fadeOut(pic, W(4, 5), 0.35);
  L.move(740, 905, 27.0, 0.8, 2, 30); baas(S, L, [27.9, 29.0]); L.bob(28.2, S.end, 8);
  O.grin(26.5);
  card(S, "MARY HAD A LITTLE LAMB", 1.0, 6.4);
  S.zoom(640, 700, 1.25, 7.0, 2);              // look at the storybook
  S.zoom(500, 740, 1.7, 12.4, 1.3);            // insert: the lamb in the book
  C.close(W(3, 0) - 0.6);                      // Ollie sings to us
  C.wide(22.0);                                // ...the lamb hops out on "snow"
  S.zoom(860, 640, 1.3, 26.8, 1.3);            // hello, little lamb!
  DS.vignette(S); }

// 1  PARK (31-45.9): the lamb pops up on top of the slide, tag close-up, then "Wheee!" down the slide to Ollie
{ const S = scene(31.0, 45.9, { cam: "none" }), F = [800, 471], C = camF(S, F);
  park(S);
  const O = ollie(S, 800, 900, 1.3, { look: 10 });
  O.hop(W(5, 1), 50); O.hop(W(5, 5), 50); O.bob(W(6, 0), S.end, 8); sings(O, [5, 7, 8]);
  const L = lamb(S, 1500, 528, 0.8, { dir: -1 });
  popAt(L.g, W(6, 2), 1500, 400); baas(S, L, [W(6, 2), W(6, 3), W(6, 4)]); L.nod(W(7, 0), WE(8, 5));
  const t0 = WE(8, 5) + 0.2;                   // Wheee!
  L.move(1396, 540, t0, 0.5, 1, 20); L.lean(-34, t0 + 0.4, 0.3); L.slide(1150, 884, t0 + 0.6, 1.1); L.lean(0, t0 + 1.7, 0.3);
  L.joy(t0 + 0.5, t0 + 2.6); O.grin(t0 + 1.7);
  card(S, "PARK", W(5, 5), W(7, 0) - 1.0);
  S.zoom(1000, 471, 1.45, W(7, 0) - 0.4, 1.3); S.zoom(1000, 471, 1, WE(8, 5) + 0.1, 1.3);
  DS.vignette(S); }

// 2  SHOP (45.9-78.9), sung twice: the lamb rides in the cart; Ollie fills all eight arms with food; "Yum!" the lamb munches a lettuce
{ const S = scene(45.9, 78.9, { cam: "none" }), F = [760, 471], C = camF(S, F);
  shop(S); const Ca = cart(S, 1360, 900); Ca.back();
  const L = lamb(S, 1350, 700, 0.85, { dir: -1 });
  popAt(L.g, W(11, 1), 1350, 560); baas(S, L, [W(11, 1), W(11, 2), W(11, 3), W(16, 0), W(16, 1), W(16, 2)]);
  L.nod(W(12, 0), WE(13, 5)); L.nod(W(17, 0), WE(18, 5));
  const [, lg] = popIn(S, 58.0, 1170, 596);
  DS.shape(S, circ(1170, 596, 34, 30), "green", { parent: lg, w: "mid" }); S.draw("M1150 586 Q1170 606 1190 586 M1156 608 Q1170 622 1184 608", S.start, 0, { c: DS.c("green", 2), w: DS.w.detail, parent: lg });
  Ca.front();
  const O = ollie(S, 760, 900, 1.3, { look: 12 });
  O.bob(S.start + 0.5, S.end, 8); sings(O, [10, 12, 13, 14, 17, 18]); O.hop(58.6, 40); O.hop(60.0, 40);
  const T = [W(14, 5), W(15, 0), W(15, 1), W(15, 2), W(15, 3), W(16, 0), W(16, 1), W(16, 2)], ANG = [128, 100, 72, 44];
  O.arms.forEach((A, i) => {
    const [g, x, y] = holdUp(S, O, A, ANG[A.ai], T[i]);
    [() => DS.shape(S, circ(x, y, 30), "red", { parent: g }),
     () => DS.shape(S, circ(x, y, 30), "red", { parent: g }),
     () => DS.shape(S, `M${x - 34} ${y + 24} Q${x - 30} ${y - 34} ${x + 30} ${y - 36} Q${x - 10} ${y - 8} ${x + 4} ${y + 30} Z`, "yellow", { parent: g }),
     () => DS.shape(S, `M${x - 20} ${y - 22} L${x + 20} ${y - 22} L${x} ${y + 40} Z`, "orange", { parent: g }),
     () => DS.shape(S, rrect(x - 30, y - 40, 60, 90, DS.r.xs), "white", { parent: g }),
     () => DS.shape(S, rrect(x - 36, y - 26, 72, 54, DS.r.md), "earth", { parent: g }),
     () => DS.shape(S, circ(x, y, 30), "orange", { parent: g }),
     () => DS.shape(S, circ(x, y, 26), "purple", { parent: g })][i]();
  });
  [0, 1, 2].forEach((j) => { const t = W(19, j), a = 1 - j * 0.3, b = a - 0.3; L.baa(t, t + 0.3);   // three bites on "yum, yum, yum"
    tw(lg, t + 0.15, 0.3, `translate(${(1 - a) * 1170} ${(1 - a) * 596}) scale(${a})`, `translate(${(1 - b) * 1170} ${(1 - b) * 596}) scale(${b})`); });
  L.joy(WE(19, 2)); O.grin(W(19, 0));
  card(S, "SHOP", W(10, 5), W(12, 0) - 1.0);
  C.close(W(12, 0) - 0.4); C.wide(WE(13, 5) + 0.1);
  S.zoom(760, 420, 1.15, 61.6, 1.3);           // the eight-arm shop: watch the arms fill up
  C.close(W(17, 0) - 0.4); S.zoom(1180, 620, 1.35, WE(18, 5) + 0.2, 1.3);   // "Yum!" at the cart
  DS.vignette(S); }

// 3  SCHOOL (78.9-93.5): Ollie at his desk, the lamb pops up at the next desk, Bibi giggles, a chalk lamb appears on the board
{ const S = scene(78.9, 93.5, { cam: "none" }), F = [900, 471], C = camF(S, F);
  school(S);
  const B = bibi(S, 330, 520, { k: 0.62, mood: "joy", paws: [[268, 700], [392, 700]] }); desk(S, 330, 900, 360, 190);
  const O = ollie(S, 900, 900, 1.3, { look: 10 });
  O.bob(S.start + 0.5, S.end, 8); sings(O, [20, 21, 22, 23]);
  desk(S, 900, 940, 520, 220);
  const tl0 = WE(20, 4) + 0.6;                 // the lamb pops up where "school, school, school" would be
  const L = lamb(S, 1480, 745, 0.85, { dir: -1 });
  popAt(L.g, tl0, 1480, 600); baas(S, L, [tl0, tl0 + BEAT, tl0 + 2 * BEAT]); L.nod(W(21, 0), WE(23, 5)); L.hop(W(24, 0) - 0.3, 50);
  desk(S, 1480, 900, 360, 190);
  swing(S, B.g, tl0, 92.5, { y: -10 }, BEAT);
  const ch = S.grp(), cw = (cx, cy, rx, ry, n) => { let d = ""; for (let q = 0; q < n; q++) { const a0 = (q / n) * 2 * Math.PI, a1 = ((q + 1) / n) * 2 * Math.PI, am = (a0 + a1) / 2;
    const p = (a, f) => `${(cx + Math.cos(a) * rx * f).toFixed(1)} ${(cy + Math.sin(a) * ry * f).toFixed(1)}`; d += (q ? " Q" : "M" + p(a0, 1) + " Q") + p(am, 1.32) + " " + p(a1, 1); } return d + " Z"; };
  S.draw(cw(1190, 320, 80, 52, 9), S.start, 0, { c: DS.P.white[0], w: DS.w.mid, parent: ch });                       // a chalk lamb on the board
  S.draw(circ(1090, 300, 30) + " M1068 286 Q1050 280 1046 298 M1150 384 V420 M1180 388 V424 M1210 388 V424 M1240 384 V420", S.start, 0, { c: DS.P.white[0], w: DS.w.mid, parent: ch });
  S.fill(circ(1084, 296, 5), S.start, 0, DS.P.white[0], 1, ch); fadeIn(S, ch, W(21, 3));
  card(S, "SCHOOL", W(20, 4), 82.0);
  S.zoom(1180, 560, 1.25, 82.6, 1.3);          // the lamb, the board and Bibi
  S.zoom(...F, 1.35, W(22, 0) - 0.5, 1.3);
  DS.vignette(S); }

// 4  FINALE on the hill (93.5-125.9): "Ollie had a little lamb", the lamb hops into Ollie's arms: a big hug, best friends
{ const S = scene(93.5, 125.9, { cam: "none" }), F = [900, 471], C = camF(S, F);
  hill(S); storybook(S, 330, 900, 300, 210);
  const O = ollie(S, 900, 900, 1.3, { look: 12 });
  const L = lamb(S, 1300, 905, 1.0, { dir: -1 });
  O.bob(S.start + 0.4, S.end, 8); L.bob(S.start + 0.4, 104.6, 8);
  sings(O, [25, 27, 28]);                // then he grins from the hug on
  baas(S, L, [W(26, 0), W(26, 1), W(26, 2), W(31, 0)]);   // "little, little lamb": the lamb answers
  L.puff(1.15, 104.6, 0.8);
  L.move(1010, 908, 105.0, 0.9, 2, 40); L.joy(W(29, 2)); O.grin(W(29, 0));   // hops into Ollie's arms
  const hug = S.grp(), k = 1.3, cx = 900, gy = 900;
  [[[cx - 70, gy - 250], [cx - 170, gy - 170], [cx - 120, gy - 80], [cx + 20, gy - 70], [cx + 90, gy - 110]], [[cx + 70, gy - 250], [cx + 230, gy - 220], [cx + 280, gy - 130], [cx + 200, gy - 70], [cx + 110, gy - 90]]].forEach((P) => {
    const { d, C: Q } = tube(P, 34 * k * 0.8, 11 * k); DS.shape(S, d, "pink", { parent: hug });
    Q.forEach((p, i) => { if (i > 5 && i < Q.length - 3 && i % 3 === 0) S.fill(circ(p[0], p[1], 9), S.start, 0, DS.c("pink", 1), 0.95, hug); });
  });
  popAt(hug, W(29, 2), 960, 780);
  [arm(O, 3, 1), arm(O, 3, -1)].forEach((A) => tl.set(A.wig, { opacity: 0 }, W(29, 2)));
  hearts(S, W(29, 3), [[560, 560, 1], [1290, 540, 1.2], [600, 380, 0.9], [1250, 350, 0.8], [1380, 450, 0.7]]);
  S.fadeOut(DS.card(S, "BEST FRIENDS!", 960, 150, { size: DS.type.title, t: W(29, 0) }).g, 111.0, 0.4);
  C.wide(S.start + 0.4); C.close(W(27, 0) - 0.4);
  S.zoom(960, 600, 1.15, 104.2, 1.3);          // the hop + the hug
  C.close(111.4); S.zoom(960, 620, 1.5, 115.6, 1.3); C.close(W(34, 0) - 0.4);
  DS.vignette(S); }

// 5  bye-bye (125.9-156): Bibi joins, everyone dances and waves, end card
{ const S = scene(125.9, TOTAL, { cam: "none" }), F = [900, 471], C = camF(S, F);
  hill(S); storybook(S, 330, 900, 300, 210);
  const B = bibi(S, 1520, 560, { k: 0.66, mood: "joy", paws: [[1440, 720], [1660, 640]] });
  const O = ollie(S, 900, 900, 1.3, { look: 6 });
  const L = lamb(S, 1170, 905, 0.95, { dir: -1, mood: "joy" }); L.puff(1.15, S.start, 0.01);
  [arm(O, 1, 1), arm(O, 1, -1)].forEach((A) => O.raise(A, 120, S.start + 0.4, 0.6));
  O.wiggle([3, 4], S.start + 1, S.end - 1, 14, BEAT); O.bob(S.start + 0.5, S.end, 8); sings(O, [35, 37, 38, 39]); O.grin(143.2);
  swing(S, B.R, S.start + 1.2, S.end - 1, { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  [127.2, 128.4, 132.0, 133.2].forEach((t) => L.hop(t, 50)); L.bob(134, S.end, 8);
  popAt(B.g, S.start + 0.6, 1520, 700);
  S.zoom(1100, 600, 1.2, W(36, 0) - 0.4, 1.3); C.close(W(38, 0) - 0.5); C.wide(143.3);
  S.fadeOut(DS.card(S, "BYE-BYE!", 960, 150, { size: DS.type.title, t: 144.0 }).g, 150.0, 0.4);
  S.text("Tiny Tune Town", 960, 160, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: 150.6 });
  DS.vignette(S); }
