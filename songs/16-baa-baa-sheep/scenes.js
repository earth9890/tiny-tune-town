// look: still
// @include ../../tools/cast.js
// @include chars.js
// 16 Baa Baa Black Sheep (traditional, c. 1744). A sunny meadow by a little red barn. Ollie asks each sheep for wool; a black, a white,
// a pink and then a rainbow sheep trot in on their colour word and give 3 bags (count 1-2-3 on cards). In every break Bibi carries the
// bags to the red wagon, whose wool heap grows colour by colour, and the sheep that gave wool graze behind the fence. Finale: Ollie knits
// a rainbow scarf with all 8 arms, then one long scarf wraps every friend. Camera per pass: wide (sheep arrives) -> mid on the sheep
// ("yes sir") -> wide (count) -> Ollie face close-up on the tag "Thank you, little sheep!". No hard cuts, nothing under 4 s.
BEAT = 60 / 99;
const GND = 905, OX = 880, OK = 1.15, FACE = [OX, GND - 330 * OK];
const SX = 1660, SK = 0.95, BAGX = [1440, 1590, 1740], BX = 420, BK = 0.72, CART = [150, 935];
const wide = (S, t) => S.zoom(...FACE, 1, t, 1.3), close = (S, t) => S.zoom(...FACE, 1.6, t, 1.3), mid = (S, t) => S.zoom(1400, 640, 1.3, t, 1.3);
// a close-up that frames a point (x, y) at screen (sx, sy): S.zoom scales about a fixed point, so solve for that point
const frame = (S, x, y, k, t, sx = 960, sy = 540) => S.zoom((sx - k * x) / (1 - k), (sy - k * y) / (1 - k), k, t, 1.3);

// the red wagon; its wool heap holds 3 puffs per sheep: n0 already there, then 3 more fade in at each time in ts
const HEAP = [[-96, 0], [-48, 4], [0, 6], [48, 4], [96, 0], [-72, -38], [-24, -42], [24, -42], [72, -38], [-36, -76], [36, -76], [0, -108]];
const wagon = (S, n0, ts = []) => {
  const [x, gy] = CART;
  DS.shadow(S, x, gy, 320);
  DS.shape(S, cap(x - 112, gy - 96, x - 210, gy - 150, 9), "wood", { w: "mid" });
  HEAP.forEach(([dx, dy], i) => {
    const j = Math.floor((i - n0) / 3);
    if (i >= n0 + 3 * ts.length) return;
    const W_ = WOOL[COLS[Math.floor(i / 3)]], p = puff(S, x + dx, gy - 150 + dy, 32, W_.ring[(i * 2) % W_.ring.length], null);
    if (i >= n0) fadeIn(S, p, ts[j] + ((i - n0) % 3) * 0.25);
  });
  DS.shape(S, rrect(x - 124, gy - 156, 248, 104, DS.r.sm), "red");
  S.draw(`M${x - 116} ${gy - 106} H${x + 116}`, S.start, 0, { c: DS.c("red", 2), w: DS.w.detail });
  [-72, 72].forEach((dx) => { DS.shape(S, circ(x + dx, gy - 40, 40), "gray"); DS.shape(S, circ(x + dx, gy - 40, 12), "yellow", { w: "detail" }); });
};
const BG = [[620, 700], [1250, 702], [1365, 708]];   // where the sheep that already gave wool graze, behind the fence
// sky, sun, rainbow (o.rainbow = time it appears), clouds, barn, tree, grazing sheep (first n colours), fence
const meadow = (S, o = {}) => {
  DS.outdoor(S, { hy: 640, sun: [300, 140] });
  if (o.rainbow !== undefined) { const g = S.grp(); RAIN.forEach((c, i) => S.draw(arc(960, 700, 640 - i * 24, 180, 360), S.start, 0, { c: DS.c(c, 0, "far"), w: DS.w.near * 3, parent: g })); fadeIn(S, g, o.rainbow); }
  cloud(S, 560, 130, 1); cloud(S, 1200, 96, 0.8);
  barn(S, 1700, 650, 0.7);
  tree(S, 110, 770, 0.95);
  const grazers = COLS.slice(0, o.bg || 0).map((c, i) => { const A = sheep(S, BG[i][0], BG[i][1], 0.34, c, { look: i ? -6 : 6 }); A.graze(S.start + 0.3 + i * 0.4, S.end); return A; });
  fence(S, -60, 1980, 780, "mid");
  return grazers;
};
const front = (S) => flowers(S, [[60, 905, "pink"], [1280, 958, "purple"], [1880, 925, "pink"]]);
// Bibi in a wrapper group (w moves her around); her own contact shadow
const friend = (S, x, k, o = {}) => {
  const w = S.grp(); DS.shadow(S, x, GND, 260 * k, { parent: w });
  const B = bibi(S, x, GND - 325 * k, Object.assign({ k }, o)); w.appendChild(B.g); B.w = w; return B;
};
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const waveArm = (O, t0, t1) => { const A = arm(O, 0, -1); O.raise(A, 125, t0 - 0.5, 0.5); tw(A.wig, t0, t1 - t0, `rotate(0 ${A.x} ${A.y})`, `rotate(-14 ${A.x} ${A.y})`, wave(cyc(t1 - t0, BEAT))); O.raise(A, 0, t1, 0.6); };

// three wool bags of one colour in the grass beside the sheep; ts = pop-in times (on the count) or none (already there)
const bagRow = (S, col, ts) => {
  const g = S.grp(); g.setAttribute("transform", "translate(0 0) scale(1)");
  BAGX.forEach((x, i) => { const [, gi] = popIn(S, ts ? ts[i] : S.start, x, GND - 60, g); bag(S, x, GND + 55, 0.78, col, gi); });
  return g;
};
// Bibi walks over, picks the bags up, carries them to the wagon and they tip in (4.5 s from t)
const BAGC = [BAGX[1], GND - 60], PICK = BAGX[0] - 170;
const carry = (S, B, bags, t) => {
  const tf = (dx, dy, s) => `translate(${BAGC[0] + dx} ${BAGC[1] + dy}) scale(${s}) translate(${-BAGC[0]} ${-BAGC[1]})`, back = 0;   // Bibi walks home beside the wagon and the bags hop in
  tw(B.w, t, 1.6, "translate(0 0)", `translate(${PICK - BX} 30)`, "sine.inOut"); tw(B.g, t, 1.6, "translate(0 0)", "translate(0 -18)", hump(4));
  tw(bags, t + 1.7, 0.5, tf(0, 0, 1), tf(PICK - BAGC[0], -20, 0.5));
  tw(B.w, t + 2.3, 1.8, `translate(${PICK - BX} 30)`, `translate(${back} 0)`, "sine.inOut"); tw(B.g, t + 2.3, 1.8, "translate(0 0)", "translate(0 -18)", hump(4));
  tw(bags, t + 2.3, 1.8, tf(PICK - BAGC[0], -20, 0.5), tf(CART[0] - BAGC[0], -74, 0.4), "sine.inOut");
  S.fadeOut(bags, t + 4.1, 0.4);
};
// one pass, p = 0..3 (black, white, pink, rainbow). L: clips { l1: [one or two "Baa baa <colour> sheep"], yes, count, tag }, scene a..b.
// o.prev = time Bibi carries the last sheep's bags (they wait in the grass when the scene opens); o.own = time she carries this sheep's bags
const pass = (p, L, a, b, o = {}) => {
  const col = COLS[p], S = scene(a, b, { cam: "none" }), c1 = L.l1[0], cl = L.l1[L.l1.length - 1];
  meadow(S, { bg: p, rainbow: p === 3 ? W(c1, 2) : undefined });
  wagon(S, 3 * p - (o.prev !== undefined ? 3 : 0), [o.prev, o.own].filter((t) => t !== undefined).map((t) => t + 4.2));
  const O = ollie(S, OX, GND, OK, { mouth: "smile", look: 8 });
  O.bob(a + 0.3, b - 0.2, 8);
  L.l1.forEach((c) => O.sing(...CLIP(c))); O.sing(W(L.tag, 0), WE(L.tag, 6));
  O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], W(L.count, 0), WE(L.count, 7), 9, BEAT);
  waveArm(O, W(L.tag, 0), WE(L.tag, 6));
  (L.more || []).forEach((c) => O.sing(W(c, 0), WE(c, 3)));
  const B = friend(S, BX, BK, { mood: p > 1 ? "joy" : undefined, paws: [[BX - 70, GND - 325 * BK + 190 * BK], [BX + 70, GND - 325 * BK + 190 * BK]] });
  const Sh = sheep(S, SX, GND, SK, col, { look: -8, from: 2200, at: W(c1, 2) - 0.9 });
  Sh.nod(W(L.yes, 0)); Sh.nod(W(L.yes, 2)); Sh.baa(W(L.yes, 0), WE(L.yes, 6));
  Sh.hop(WE(L.tag, 6) - 1.2); Sh.baa(WE(L.tag, 4), WE(L.tag, 6));
  if (o.prev !== undefined) carry(S, B, bagRow(S, COLS[p - 1]), o.prev);
  const own = bagRow(S, col, [0, 2, 4].map((wi) => W(L.count, wi)));
  if (o.own !== undefined) carry(S, B, own, o.own);
  front(S);
  // cards: the colour on its word, then 1 2 3 above the bags; all gone before the close-up
  S.fadeOut(DS.card(S, col.toUpperCase(), 960, 150, { size: DS.type.title, t: W(c1, 2) }).g, (L.l1.length > 1 ? W(cl, 0) : W(L.yes, 0)) - 1.0, 0.4);
  [0, 2, 4].forEach((wi, i) => S.fadeOut(num(S, i + 1, BAGX[i], 200, W(L.count, wi)).g, W(L.tag, 0) - 1.3, 0.4));
  // camera: wide as the sheep trots in -> mid (2nd "baa baa") -> the sheep's face on "yes sir" -> wide for the count -> Ollie's face on the tag
  if (L.l1.length > 1) mid(S, W(cl, 0) - 0.6);
  frame(S, SX - 40, GND - 200 * SK, 2, W(L.yes, 0) - 0.7, 1100, 560);
  wide(S, W(L.count, 0) - 0.7); close(S, W(L.tag, 0) - 0.6);
  if (o.own !== undefined) wide(S, o.own - 0.3);
  DS.vignette(S);
};

// one long rainbow scarf through pts (neck points, left -> right), knitted outward from the point nearest x0, one stripe every 0.22 s from t0
const scarf = (S, pts, x0, t0) => {
  const C = cr(pts, 10), n = 22, step = (C.length - 1) / n, under = S.grp(), over = S.grp();
  const segs = Array.from({ length: n }, (_, s) => C.slice(Math.round(s * step), Math.round((s + 1) * step) + 1));
  const mid0 = segs.reduce((b, sg, s) => (Math.abs(sg[0][0] - x0) < Math.abs(segs[b][0][0] - x0) ? s : b), 0);
  segs.forEach((sg, s) => {
    const d = "M" + sg.map(([x, y]) => `${K(x)} ${K(y)}`).join(" L"), t = t0 + Math.abs(s - mid0) * 0.22;
    S.draw(d, t, 0, { c: DS.P.ink[0], w: DS.w.near * 7, parent: under });
    S.draw(d, t, 0, { c: DS.c(RAIN[s % 6]), w: DS.w.near * 6, parent: over });
  });
};
// a ball of rainbow yarn
const yarn = (S, x, y, r, parent) => { DS.shape(S, circ(x, y, r), "purple", { parent }); [["yellow", -0.5], ["sky", 0], ["red", 0.5]].forEach(([c, o]) => S.draw(arc(x + o * r * 0.6, y, r * 0.75, 200, 340), S.start, 0, { c: DS.c(c), w: DS.w.near, parent })); };

// intro (0..b): the empty red wagon, Ollie and Bibi wait in the meadow; on "Baa!" a black sheep peeks out of the barn door
const intro = (b, tBaa) => {
  const S = scene(0, b, { cam: "none" });
  meadow(S, {});
  wagon(S, 0);
  const pk = sheep(S, 1700, 652, 0.3, "black", { look: -6 }); fadeIn(S, pk.pos, tBaa); pk.hop(tBaa + 0.4, 30);
  const O = ollie(S, OX, GND, OK, { mouth: "smile", look: 0 });
  O.bob(0.4, b - 0.2, 8); O.hop(tBaa + 0.5, 40); O.sing(W(1, 0), WE(1, 1)); O.sing(W(1, 2), WE(1, 5));
  const B = friend(S, BX, BK, {}); swing(S, B.R, 1.0, tBaa - 0.3, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  front(S);
  S.fadeOut(DS.card(S, "BAA BAA BLACK SHEEP", 960, 150, { size: DS.type.title, t: 0.6 }).g, tBaa - 0.6, 0.4);
  S.zoom(1500, 560, 1.4, tBaa - 0.4, 1.4);               // look at the barn door: a sheep!
  DS.vignette(S);
};

// knitting (a..b): the arms swing up one by one, each with a needle (from a + 0.4, one per beat); on "knit" (clip ck) the rainbow scarf
// grows stripe by stripe down from Ollie's chin and coils on the grass until the end of clip cr ("eight arms knitting, round and round")
const knit = (ck, cr8, a, b) => {
  const S = scene(a, b, { cam: "none" });
  meadow(S, { bg: 3, rainbow: a });
  wagon(S, 12);
  const O = ollie(S, OX, GND, OK, { mouth: "grin", look: 0 });
  O.arms.forEach((A, i) => {
    const t = a + 0.4 + i * BEAT;
    O.raise(A, [125, 98, 72, 46][A.ai], t - 0.4, 0.5);
    const [tx, ty] = A.tip, m = Math.hypot(tx - A.x, ty - A.y), ux = (tx - A.x) / m, uy = (ty - A.y) / m;
    const [, g] = popIn(S, t, tx, ty, A.wig); needle(S, tx - ux * 20, ty - uy * 20, tx + ux * 130, ty + uy * 130, g);
  });
  O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], W(ck, 0), b - 0.4, 12, BEAT);
  O.bob(a + 0.3, b - 0.2, 6);
  const P = [];                                            // stripes: down from Ollie's chin, then lying on the grass to the right
  for (let i = 0; i < 5; i++) P.push(rrect(-56, -176 + i * 34, 112, 34, DS.r.xs));
  for (let i = 0; i < 7; i++) P.push(rrect(56 + i * 50, -16, 50, 40, DS.r.xs));
  const t0 = W(ck, 0), t1 = W(cr8, 6);
  P.forEach((d, i) => DS.shape(S, d, RAIN[i % 6], { parent: O.body, t: t0 + (i * (t1 - t0)) / P.length, w: "mid" }));
  const B = friend(S, BX, BK, { mood: "joy", paws: [[BX - 70, GND - 325 * BK + 190 * BK], [BX + 70, GND - 325 * BK + 190 * BK]] });
  yarn(S, BX, GND - 325 * BK + 175 * BK, 62, B.g); tw(B.g, a + 0.5, b - a - 1, "translate(0 0)", "translate(0 -10)", hump(cyc(b - a - 1, 2 * BEAT)));
  const Sh = sheep(S, SX, GND, SK, "rainbow", { look: -8 }); Sh.graze(a + 0.4, b - 0.2);
  front(S);
  S.fadeOut(DS.card(S, "8 ARMS!", 1500, 160, { size: DS.type.title, t: W(cr8, 3) }).g, b - 1.2, 0.4);
  S.zoom(OX, 640, 1.35, W(ck, 0) - 0.6, 1.3);             // mid on the knitting
  wide(S, W(cr8, 0) - 0.4);
  DS.vignette(S);
};

// the scarf wraps everyone (a..TOTAL). C: clips { cosy, tag, knit2, cosy2, tag2 }
const wrap = (C, a) => {
  const S = scene(a, TOTAL, { cam: "none" });
  meadow(S, { rainbow: a });
  const row = [["black", 150], ["white", 1380], ["pink", 1600], ["rainbow", 1800]];
  const sh = row.map(([col, x], i) => { const A = sheep(S, x, GND, 0.6, col, { look: x < OX ? 6 : -6 }); A.graze(a + 0.3 + i * 0.3, TOTAL - 0.3); return A; });
  const O = ollie(S, OX, GND, OK, { mouth: "grin", look: 0 });
  O.bob(a + 0.3, TOTAL - 0.3, 8); O.sing(W(C.tag, 0), WE(C.tag, 7)); O.sing(W(C.tag2, 0), WE(C.tag2, 3));
  const B = friend(S, 420, 0.66, { mood: "joy" });
  scarf(S, [[40, 830], [150, 822], [285, 815], [420, 786], [640, 770], [770, 718], [880, 708], [990, 718], [1130, 790], [1380, 822], [1490, 834], [1600, 822], [1700, 834], [1800, 822], [1900, 838]], OX, W(C.cosy, 1));
  // the second chorus: all eight arms dance, the sheep hop, hearts float up; goodbye waves at the end
  O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], W(C.knit2, 0), WE(C.knit2, 8), 14, BEAT);
  sh.forEach((A, i) => [0, 1, 2].forEach((k) => A.hop(W(C.knit2, 0) + i * 0.15 + k * 2 * BEAT, 30, 0.45)));
  sh.forEach((A) => A.baa(W(C.tag2, 4), WE(C.tag2, 5)));
  hearts(S, W(C.cosy2, 0), [[600, 420, 1], [1180, 380, 1.2], [1500, 470, 0.9]]);
  const bye = WE(C.tag2, 7) - 0.4;
  [arm(O, 0, 1), arm(O, 0, -1)].forEach((A) => O.raise(A, 125, bye - 0.6, 0.6));
  O.wiggle([1, 2], bye, TOTAL - 0.5, 14, BEAT);
  swing(S, B.R, bye, TOTAL - 0.5, { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  front(S);
  S.fadeOut(DS.card(S, "THANK YOU!", 960, 150, { size: DS.type.title, t: W(C.cosy, 1) }).g, W(C.tag, 0) - 1.3, 0.4);
  DS.card(S, "BYE-BYE!", 1500, 160, { size: DS.type.title, t: bye });
  S.text("Tiny Tune Town", 760, 160, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: bye + 0.6 });
  // camera: wide (the scarf) -> Ollie's face (tag) -> mid on the dancing row -> the sheep -> wide -> Ollie's face (tag) -> wide goodbye
  close(S, W(C.tag, 0) - 0.6); S.zoom(OX, 640, 1.25, WE(C.tag, 7) + 0.3, 1.3); frame(S, 1590, 800, 1.8, W(C.knit2, 0) + 2.2, 960, 600);
  wide(S, W(C.cosy2, 0) - 0.6); close(S, W(C.tag2, 0) - 0.6); wide(S, bye - 0.5);
  DS.vignette(S);
};

// ---------- timeline (take seed 7; clip numbers = script.json lines) ----------
intro(6.0, 3.2);
pass(0, { l1: [2, 3], yes: 4, count: 5, tag: 6 }, 6.0, 33.05);
pass(1, { l1: [7, 8], yes: 9, count: 10, tag: 11, more: [12] }, 33.05, 59.1, { prev: 33.3 });
pass(2, { l1: [13, 14], yes: 15, count: 16, tag: 17 }, 59.1, 84.4, { prev: 59.3 });
pass(3, { l1: [18], yes: 19, count: 20, tag: 21 }, 84.4, 112.0, { prev: 84.6, own: 107.0 });
knit(22, 23, 112.0, 130.0);
wrap({ cosy: 24, tag: 25, knit2: 26, cosy2: 27, tag2: 28 }, 130.0);
