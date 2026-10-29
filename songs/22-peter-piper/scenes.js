// look: still
// @include ../../tools/cast.js
// 22 Peter Piper Picks Peppers (traditional, 1813). A sunny pepper patch: two big leafy bushes full of red, yellow and orange peppers, a wooden crate
// at Ollie's feet, Bibi cheering on the left. Ollie plays Peter Piper: each pass N arms reach up (1,2,3,4,5,8), pick a pepper on the slot word,
// pump "pick, pick, pick" (one more pump each pass = faster), then drop them in the crate on "quick, quick, quick". The crate fills (23 peppers).
// Camera per pass: wide (the count) -> mid (the pumping) -> Ollie face close-up on the tag "Pick it, pick it, quick, quick, quick!".
// Breaks: wide + a word card, mid on Ollie. Finale: the full crate, pile insert, face close-up on "Everybody smile!". No hard cuts, nothing under 4 s.
// ---- take remap (planned line -> sung clip number, or {t: seconds} for a break the singer dropped) ----
const PLAN = [null, 1, 2, {"t": 15.703}, 3, 4, {"t": 22.653}, 5, 6, 8, 9, {"t": 47.833}, 10, 11, 12, 13, 14, 15, {"t": 74.153}, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, {"t": 136.07299999999998}, 29, 30, 31, 33, 34];
const PWN = (c) => TIMING.words.filter((x) => x[0] === PLAN[c]).length;
const PW = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + i * 0.3 : W(PLAN[c], Math.min(i, PWN(c) - 1)));
const PWE = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + 0.4 + i * 0.3 : WE(PLAN[c], Math.min(i, PWN(c) - 1)));

BEAT = 60 / 120;
const GND = 905, OX = 960, OK = 1.15, FACE = [OX, GND - 330 * OK];
const wide = (S, t) => S.zoom(...FACE, 1, t, 1.3), mid = (S, t) => S.zoom(...FACE, 1.2, t, 1.3), close = (S, t) => S.zoom(...FACE, 1.45, t, 1.3);
const N = [1, 2, 3, 4, 5, 8], NP = [3, 4, 5, 6, 7, 8];                        // arms picking / "pick" words in line 2, per pass
const PC = ["red", "yellow", "orange", "red", "yellow", "orange", "red", "yellow"];
const ANG = [45, 95, 80, 70];                                                // reach angle per arm row (outer -> inner)
const L = (p) => 2 + 5 * p;                                                  // first sung line of pass p (line 1 = "Ooh! Peppers!")
const PS = (p) => PW(L(p), 0) - 0.4, PE = (p) => PWE(L(p) + 3, 6) + 0.3;       // pass scene start / end
const CH = 32;                                                               // chorus first line; 31 = "Hooray!", 36 = outro

// arm i (1..8 in COUNT order: outer pair first, right then left) and where its tip is when reaching up
const armAt = (i) => ({ ai: i >> 1, side: i % 2 ? 1 : -1 });
const reachPos = (i) => { const { ai, side } = armAt(i), [rx, P] = ARMS[ai], x = rx * side, y = -200, dx = P[4][0] * side, dy = P[4][1], r = ANG[ai] * side * Math.PI / 180;
  return [OX + (x + dx * Math.cos(r) - dy * Math.sin(r)) * OK, GND + (y + dx * Math.sin(r) + dy * Math.cos(r)) * OK]; };

// a bell pepper centred at (x, y), parent group optional
const pepper = (S, parent, x, y, k, col) => {
  const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`);
  DS.shape(S, "M0 -26 C28 -36 40 -8 34 16 C28 40 10 46 0 40 C-10 46 -28 40 -34 16 C-40 -8 -28 -36 0 -26 Z", col, { parent: g, w: "mid" });
  S.fill(circ(-14, -2, 6, 13), S.start, 0, DS.c(col, 1), 0.8, g);
  DS.shape(S, "M-3 -26 Q-4 -42 10 -48 L14 -41 Q5 -35 7 -26 Z", "green", { parent: g, w: "detail" });
  return g;
};
// a pepper that pops in on its word; returns the outer group (fade it out later)
const popPepper = (S, t, parent, x, y, k, col) => { const [o, g] = popIn(S, t, x, y, parent); pepper(S, g, x, y, k, col); return o; };

const cloud = (S, x, y, k) => { const g = G(S, null, "translate(0 0)"); [[0, 0, 70], [-70, 18, 50], [70, 15, 55], [30, -35, 50]].forEach(([dx, dy, r]) => S.fill(circ(x + dx * k, y + dy * k, r * k), S.start, 0, DS.P.white[0], 0.92, g));
  tw(g, S.start, S.len, "translate(0 0)", `translate(${70 * k} 0)`, "none"); };   // slow drift keeps the sky alive
// a big leafy pepper bush
const bush = (S, cx, cy, k) => [[0, 0, 130], [-110, 40, 100], [110, 40, 105], [-60, -90, 95], [70, -100, 100], [0, -160, 80], [-150, -40, 70], [150, -60, 75], [0, 120, 100], [-100, 130, 80], [100, 130, 80]]
  .forEach(([dx, dy, r], i) => DS.shape(S, circ(cx + dx * k, cy + dy * k, r * k), "green", { layer: "mid", flat: true, tone: [0, 1, 2][i % 3] }));
// row of small far plants along the horizon, each with a pepper or two
const rowPlants = (S) => [90, 250, 410, 1510, 1670, 1830].forEach((x, i) => {
  DS.shape(S, circ(x, 704, 62, 42), "green", { layer: "far", flat: true, tone: i % 2 ? 2 : 1 });
  [[-18, 4, "red"], [20, -2, "yellow"]].forEach(([dx, dy, c]) => S.fill(circ(x + dx, 704 + dy, 11, 14), S.start, 0, DS.c(c, 0, "far"), 1));
});
const signpost = (S) => {
  DS.shape(S, rect(1685, 570, 30, 335), "wood", { layer: "mid" });
  DS.shape(S, rrect(1560, 470, 280, 108, DS.r.sm), "sand", { layer: "mid" });
  S.text("PEPPERS", 1700, 538, { size: DS.type.caption, c: DS.P.brown[0], t: S.start });
};
// the harvest crate in front of Ollie; its peppers poke over the rim. n0 already inside, then one more pops in at each time in ts
const HEAP = [[960, 772], [900, 772], [1020, 772], [840, 772], [1080, 772], [780, 772], [1140, 772], [720, 772], [1200, 772], [660, 772], [1260, 772], [600, 772], [1320, 772],
  [930, 722], [990, 722], [870, 722], [1050, 722], [810, 722], [1110, 722], [750, 722], [1170, 722], [840, 676], [1080, 676]];
const HC = ["red", "yellow", "orange", "green"];
const crate = (S, n0, ts = []) => {
  HEAP.forEach(([x, y], i) => { if (i < n0) pepper(S, null, x, y, 1, HC[i % 4]); else if (i < n0 + ts.length) popPepper(S, ts[i - n0], null, x, y, 1, HC[i % 4]); });
  DS.shadow(S, 960, 936, 980);
  DS.shape(S, rrect(510, 810, 900, 126, DS.r.sm), "wood");
  S.draw("M514 856 H1406 M514 898 H1406", S.start, 0, { c: DS.c("wood", 2), w: DS.w.detail });
  DS.shape(S, rrect(496, 796, 928, 30, DS.r.xs), "wood", { w: "mid" });
};
// Bibi in a wrapper so she can hop; her shadow stays put
const friend = (S, x, k, o = {}) => { DS.shadow(S, x, GND, 260 * k); return bibi(S, x, GND - 325 * k, Object.assign({ k }, o)); };
const BX = 390, BK = 0.72;
const hop = (S, B, t, h = 36) => tw(B.g, t, 0.5, "translate(0 0)", `translate(0 ${-h})`, hump(1));
const cheer = (S, B, t0, t1) => swing(S, B.R, t0, t1, { rotation: -16, svgOrigin: B.R.sh }, BEAT);

// the patch: sky, bushes full of peppers (pep[i] = the pepper arm i will pick), Bibi, Ollie; draw(O, B, pep) adds things on Ollie; the crate comes last
const patch = (S, o = {}, draw) => {
  DS.outdoor(S, { hy: 600, sun: [300, 150] });
  cloud(S, 560, 130, 1); cloud(S, 1250, 96, 0.8);
  rowPlants(S);
  bush(S, 610, 545, 1.35); bush(S, 1310, 545, 1.35);
  [[470, 470, "orange"], [560, 380, "red"], [780, 560, "yellow"], [440, 690, "red"], [860, 410, "orange"], [1150, 400, "yellow"], [1360, 380, "red"], [1480, 520, "orange"], [1170, 700, "red"], [1440, 660, "yellow"], [1090, 600, "orange"]]
    .forEach(([x, y, c]) => pepper(S, null, x, y, 0.9, c));
  const pep = PC.map((c, i) => pepper(S, null, ...reachPos(i), 1, c));
  signpost(S);
  const B = friend(S, BX, BK, { mood: o.bibiMood, paws: [[BX - 80, GND - 325 * BK + 190 * BK], [BX + 80, GND - 325 * BK + 190 * BK]] });
  const O = ollie(S, OX, GND, OK, { mouth: o.mouth || "smile", look: o.look || 0 });
  if (draw) draw(O, B, pep);
  crate(S, o.n0 || 0, o.ts);
  return { O, B, pep };
};
const arm = (O, i) => { const { ai, side } = armAt(i); return O.arms.find((A) => A.ai === ai && A.side === side); };
const sung = (O, c, last) => O.sing(PW(c, 0), PWE(c, last));
const word = (S, str, t, to) => S.fadeOut(DS.card(S, str, 960, 175, { size: DS.type.title, t }).g, to, 0.4);

// ---- one pass p: N[p] arms reach up and pick on the slot word, pump on "pick, pick", drop into the crate on "quick, quick, quick"
const pass = (p) => {
  const n = N[p], np = NP[p], l1 = L(p), l2 = l1 + 1, l3 = l1 + 2, l4 = l1 + 3, a = PS(p), b = PE(p), n0 = N.slice(0, p).reduce((s, v) => s + v, 0);
  const T = (i) => PW(l1, 1) + (i + 1) * (PWE(l1, 3) - PW(l1, 1)) / n, TP = (i) => PW(l4, 4) + 0.35 + i * Math.min(0.3, 1.5 / n);
  const S = scene(a, b, { cam: "none" });
  const idx = [...Array(n).keys()];
  const { B } = patch(S, { n0, ts: idx.map((i) => TP(i) + 0.05), bibiMood: p > 2 ? "joy" : undefined }, (O, B, pep) => {
    [[l1, 3], [l2, np - 1], [l3, 3], [l4, 6]].forEach(([c, last]) => sung(O, c, last));
    O.bob(a + 0.3, b - 0.2, 8);
    idx.forEach((i) => {
      const A = arm(O, i);
      O.raise(A, ANG[armAt(i).ai], T(i) - 0.5, 0.5);
      S.fadeOut(pep[i], T(i), 0.15);
      const held = popPepper(S, T(i), A.wig, A.tip[0], A.tip[1], 1, PC[i]);
      O.raise(A, 0, TP(i) - 0.45, 0.5);
      S.fadeOut(held, TP(i) + 0.05, 0.2);
    });
    const list = idx.map((i) => i + 1);
    O.wiggle(list, PW(l2, 0), PWE(l2, np - 1), 9, (PWE(l2, np - 1) - PW(l2, 0)) / np);   // one pump per "pick": more pumps every pass
    O.wiggle(list, PW(l3, 0), PW(l4, 4) - 0.6, 7, BEAT);
  });
  hop(S, B, PWE(l4, 6) - 0.4); cheer(S, B, PW(l4, 0), PWE(l4, 6));
  sparkle(S, 960, 740, PWE(l4, 6) - 0.3, 0.8);
  S.fadeOut(num(S, N[p], 960, 175, PW(l1, 3)).g, PW(l3, 0) - 0.3, 0.4);
  mid(S, PW(l2, 0) - 0.5); close(S, PW(l4, 0) - 0.5);
  DS.vignette(S);
};

// ---- breaks between the passes: wide, a word card on the spoken word, mid on Ollie
const brk = (p) => {
  const c = L(p) + 4, a = PE(p), b = PS(p + 1), S = scene(a, b, { cam: "none" });
  const n0 = N.slice(0, p + 1).reduce((s, v) => s + v, 0);
  const { O, B } = patch(S, { n0, bibiMood: "joy" }, (O) => {
    O.bob(a + 0.3, b - 0.2, p === 2 ? 14 : 9);
    const all = [1, 2, 3, 4, 5, 6, 7, 8];
    if (p < 3) O.wiggle(all, a + 0.6, b - 0.5, 8 + 2 * p, p === 2 ? BEAT / 2 : BEAT);                // each break a little livelier ("Faster!")
    if (p === 3) { O.wiggle(all, a + 0.6, PW(c, 0) - 0.2, 10, BEAT); O.spin(PW(c, 0) + 0.1, 1.4); }    // "Wheee!"
    if (p === 4) { for (let i = 0; i < 8; i++) O.raise(arm(O, i), ANG[armAt(i).ai], a + 1.2 + i * 0.5, 0.6); O.wiggle(all, a + 5.4, b - 0.8, 8, BEAT); }   // "All eight arms!"
  });
  hop(S, B, a + 1.4); hop(S, B, PW(c, 0) + 0.1); cheer(S, B, a + 2.4, PW(c, 0) - 0.3);
  sparkle(S, 840, 740, a + 0.8, 0.8); sparkle(S, 1080, 740, a + 1.1, 0.8); sparkle(S, 960, 700, PW(c, 0) + 0.2, 0.9);
  word(S, ["PLOP!", "WOW!", "FASTER!", "WHEEE!", "8 ARMS!"][p], PW(c, 0), b - 0.45);
  mid(S, a + 4.6); wide(S, b - 0.5);
  DS.vignette(S);
};

// 0  intro: "Ooh! Peppers!" - the patch is full, the crate is empty, Bibi hops, slow push in
{ const S = scene(0, PS(0), { cam: "none" });
  const { B } = patch(S, { bibiMood: "joy" }, (O) => { sung(O, 1, 1); O.bob(S.start + 0.4, S.end - 0.2, 8); O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], PW(1, 0), S.end - 0.3, 8, BEAT); });
  hop(S, B, PW(1, 1)); sparkle(S, 560, 470, PW(1, 1) + 0.2, 0.7); sparkle(S, 1360, 470, PW(1, 1) + 0.4, 0.7);
  S.fadeOut(DS.card(S, "PEPPER PATCH!", 960, 175, { size: DS.type.title, t: PW(1, 0) }).g, S.end - 1.0, 0.4);
  S.zoom(...FACE, 1.15, S.start + 0.6, 4.5);
  DS.vignette(S); }

for (let p = 0; p < 6; p++) { pass(p); if (p < 5) brk(p); }

// 7  "Hooray!" + chorus (the full crate): wide -> mid -> pile insert -> face close-up on "Everybody smile!"
{ const a = PE(5), b = PWE(CH + 3, 1) + 0.4, S = scene(a, b, { cam: "none" });
  const { B } = patch(S, { n0: 23, bibiMood: "joy", mouth: "smile" }, (O) => {
    [[CH, 3], [CH + 1, 3], [CH + 2, 3], [CH + 3, 1]].forEach(([c, last]) => sung(O, c, last));
    O.bob(a + 0.3, b - 0.2, 10);
    O.grin(PW(CH + 3, 0));
    [0, 1, 2, 3].forEach((i) => O.raise(arm(O, i), 130 - 25 * (i >> 1), PW(CH, 0) - 0.4, 0.6));
    O.wiggle([1, 2, 3, 4], PW(CH, 0), b - 0.4, 10, BEAT);
  });
  hop(S, B, PW(31, 0) + 0.1, 46); cheer(S, B, PW(CH, 0), b - 0.4);
  word(S, "HOORAY!", PW(31, 0), PW(CH, 0) - 0.6);
  sparkle(S, 760, 740, PW(CH + 2, 0), 0.9); sparkle(S, 1160, 740, PW(CH + 2, 1), 0.9);
  hearts(S, PW(CH + 3, 0), [[OX - 340, 420, 0.9], [OX + 340, 400, 1], [OX + 60, 330, 1.1]]);
  mid(S, PW(CH + 1, 0) - 0.5); S.zoom(960, 700, 1.35, PW(CH + 2, 0) - 0.6, 1.3); close(S, PW(CH + 3, 0) - 0.6);
  DS.vignette(S); }

// 8  outro: both wave bye-bye, brand name
{ const a = PWE(CH + 3, 1) + 0.4, S = scene(a, TOTAL, { cam: "none" }), cb = PW(36, 0);
  const { B } = patch(S, { n0: 23, bibiMood: "joy", mouth: "grin" }, (O) => {
    [1, 2].forEach((i) => O.raise(arm(O, i - 1), 120, a + 0.3, 0.6));
    O.wiggle([1, 2], a + 1, TOTAL - 1, 14, BEAT); O.bob(a + 0.3, TOTAL - 0.3, 8);
  });
  cheer(S, B, a + 1, TOTAL - 1);
  S.fadeOut(DS.card(S, "BYE-BYE!", 960, 175, { size: DS.type.title, t: cb + 0.2 }).g, TOTAL - 2.8, 0.4);
  S.text("Tiny Tune Town", 960, 130, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: TOTAL - 2.5 });
  DS.vignette(S); }
