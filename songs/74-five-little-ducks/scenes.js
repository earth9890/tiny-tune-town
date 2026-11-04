// look: still
// @include ../../tools/cast.js
// @include props.js
// 74 Five Little Ducks (original words). Five passes: scene A (N ducks swim), scene B (one duck hides at a tree / the sea / a bee-flower, Ollie calls it back); hidden ducks keep peeking out. Final chorus: Mama calls, all five hurry back.
// Lines in script.json: pass i (0..4) = lines 4i+1..4i+4; chorus = 21..24; then "Bye-bye!" (25).
BEAT = 60 / 116;
const CS = (c) => CLIP(c)[0], CE = (c) => CLIP(c)[1];
const L = (i, l) => 4 * i + l;
const SPOT = ["tree", "sea", "bee", "tree", "sea"], SX = { sea: 1260, bee: 1490, tree: 1740 };
const FY = 935, DY = 905, RX = (n) => 480 + 150 * n;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const view = (S, x, y, k, t, dur = 1.3) => (x = clamp(x, 960 / k - 190, 2110 - 960 / k), y = clamp(y, 540 / k - 190, 1270 - 540 / k), k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const sing = (A, c) => TIMING.words.filter((w) => w[0] === c).forEach((w) => A(w[3], w[3] + 0.6 * (w[4] - w[3])));
const place = (S, make, x, gy, k, o) => { const n = S.g.children.length, A = make(S, x, gy, k, o); A.sd = S.g.children[n]; return A; };
const done = (S) => DS.vignette(S, 0.1);
const pond = (S, g) => { S.fill(circ(900, 960, 1100, 120), S.start, 0, DS.c("sky", 0), 0.75, g); [[300, 950], [760, 985], [1180, 950]].forEach(([x, y]) => S.draw(`M${x} ${y} q30 -18 60 0 t60 0 t60 0`, S.start, 0, { c: DS.P.white[0], w: DS.w.mid, parent: g })); };
const world = (S, i) => {
  const { g } = DS.outdoor(S, { hy: 600, sun: [i % 2 ? 330 : 1560, 170], sky: "sky", ground: "grass", hills: i % 2 ? "green" : "grass" });
  [[300 + 700 * (i % 2), 190, 1], [1100 - 500 * (i % 2), 130, 0.8]].forEach(([x, y, k]) => { const c = S.grp(g); [[0, 0, 90 * k, 36 * k], [70 * k, -18 * k, 64 * k, 34 * k], [-70 * k, 6 * k, 56 * k, 28 * k]].forEach(([dx, dy, rx, ry]) => S.fill(circ(x + dx, y + dy, rx, ry), S.start, 0, DS.P.white[0], 0.9, c)); tw(c, S.start, S.len, "translate(0 0)", "translate(70 0)", "none"); });
};
// the three hiding places, drawn AFTER the ducks so they cover their bodies
const spots = (S) => {
  const bush = (x, w, h, name) => { S.fill(circ(x, DY + 20, w, h), S.start, 0, DS.c(name, 1), 1); S.fill(circ(x - w * 0.35, DY - h * 0.5, w * 0.35, h * 0.3), S.start, 0, DS.P.white[0], 0.25); };
  bush(SX.tree, 150, 130, "green");
  S.fill(circ(SX.tree, 640, 170, 190), S.start, 0, DS.c("green", 0), 1); S.fill(rrect(SX.tree - 22, 640, 44, 220, 8), S.start, 0, DS.c("wood", 1), 1);
  S.fill(circ(SX.sea, DY + 30, 170, 70), S.start, 0, DS.c("sky", 1), 1);
  [0, 1].forEach((j) => S.draw(`M${SX.sea - 110 + j * 20} ${DY - 6 + j * 22} q28 -22 56 0 t56 0 t56 0`, S.start, 0, { c: DS.P.white[0], w: DS.w.mid }));
  bush(SX.bee, 130, 110, "leaf" in DS.P ? "green" : "green");
  [-1, 1].forEach((s) => S.fill(circ(SX.bee + s * 70, DY - 120, 38, 20), S.start, 0, DS.c("pink", 0), 1));
  const bee = G(S, null, "translate(0 0)"); S.fill(circ(SX.bee + 150, 640, 34, 24), S.start, 0, DS.c("yellow", 0), 1, bee); S.fill(circ(SX.bee + 150, 640, 6, 24), S.start, 0, DS.P.ink[0], 0.8, bee);
  [-1, 1].forEach((s) => S.fill(circ(SX.bee + 150 + s * 14, 610, 14, 22), S.start, 0, DS.P.white[0], 0.8, bee));
  tw(bee, S.start, S.len, "translate(0 0)", "translate(-40 -30)", wave(cyc(S.len, 2)));
};
// pass i: ducks in the row (5 - i of them), earlier hiders peek from their spots, Ollie on the left
const scene2 = (a, b, i, hide, dPeek = true) => {
  const S = scene(a, b, { cam: "none" }); world(S, i); pond(S, null);
  const N = 5 - i, ducks = Array.from({ length: N }, (_, n) => place(S, duck, RX(n), DY, 1.0, {}));
  const peek = []; for (let j = 0; j < i; j++) peek.push(place(S, duck, SX[SPOT[j]] + (SPOT.slice(0, j).filter((s) => s === SPOT[j]).length) * 70 - 30, DY - 40, 0.9, {}));
  spots(S);
  const O = place(S, ollie, 170, FY, 0.7, { mouth: "smile", look: 12 }); O.bob(S.start + 0.3, S.end - 0.3, 8);
  ducks.forEach((d, n) => d.bobAll(S.start + 0.2 * n, S.end - 0.2, 9));
  peek.forEach((d, n) => d.bobAll(S.start + 0.3, S.end - 0.2, 5));
  return { S, O, ducks };
};
const bounds = [0];
for (let i = 0; i < 5; i++) bounds.push(CS(L(i, 1)) - 0.3, CS(L(i, 3)) - 0.3);
bounds.push(CS(21) - 0.3, CS(25) - 0.3, CS(29) - 0.3, CE(32) + 0.3, TOTAL);
{ const S = scene(bounds[0], bounds[1], { cam: "none" }); world(S, 0); pond(S, null);
  const ducks = [0, 1, 2, 3, 4].map((n) => place(S, duck, RX(n), DY, 1.0, {})); ducks.forEach((d, n) => d.bobAll(S.start + 0.2 * n, S.end - 0.2, 9));
  const O = place(S, ollie, 170, FY, 0.7, { mouth: "smile", look: 12 }); O.bob(S.start + 0.3, S.end - 0.3, 8);
  S.fadeOut(DS.card(S, "5 little ducks", 960, 300, { size: DS.type.display, t: 0.6, fill: "yellow" }).g, S.end - 0.3, 0.3); view(S, 800, 600, 1.1, 1.5, 2.5); done(S); }
for (let i = 0; i < 5; i++) {
  { const a = bounds[1 + 2 * i], b = bounds[2 + 2 * i], { S, O, ducks } = scene2(a, b, i);
    sing(O.sing, L(i, 1)); sing(O.sing, L(i, 2)); const t1 = CS(L(i, 1)), t2 = CS(L(i, 2));
    ducks.forEach((d, n) => d.hop(t1 + 0.25 * n, 36));
    S.fadeOut(DS.card(S, String(5 - i), 960, 220, { size: DS.type.display * 1.2, t: Math.max(t1 - 0.05, a + 0.1), fill: "yellow" }).g, b - 0.1, 0.3);
    ducks.forEach((d, n) => d.hop(t2 + 0.25 * n, 36));
    view(S, RX(2), 580, 1.2, t1 - 0.4); view(S, 960, 600, 1, b - 1.6); done(S); }
  { const a = bounds[2 + 2 * i], b = bounds[3 + 2 * i], { S, O, ducks } = scene2(a, b, i);
    sing(O.sing, L(i, 3)); sing(O.sing, L(i, 4)); const t3 = CS(L(i, 3)), t4 = CS(L(i, 4)), sp = SPOT[i], same = SPOT.slice(0, i).filter((s) => s === sp).length;
    const h = ducks[ducks.length - 1]; h.move(SX[sp] + same * 70 - 30, DY - 40, t3 + 0.6, 1.6);
    O.raise(O.arms[0], 70, t4, 0.5); O.raise(O.arms[1], 70, t4, 0.5); O.hop(t4 + 0.6, 40, 0.5);
    view(S, 1100, 580, 1.2, t3 - 0.4); view(S, 700, 640, 1.2, t4 - 0.4); view(S, 960, 600, 1, b - 1.6); done(S); }
}
const chorus = (a, b, l0, bg) => { const S = scene(a, b, { cam: "none" }); world(S, bg); pond(S, null);
  const ducks = [0, 1, 2, 3, 4].map((n) => place(S, duck, 700 + 150 * n, DY, 1.0, {})); ducks.forEach((d, n) => d.bobAll(S.start + 0.2 * n, S.end - 0.2, 9));
  const M = place(S, duck, 1650, DY + 10, 1.7, { mama: true, dir: -1 }); M.bobAll(S.start, S.end - 0.2, 8);
  const O = place(S, ollie, 170, FY, 0.7, { mouth: "grin", look: 12 }); O.bob(S.start + 0.3, S.end - 0.3, 8); O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], a + 0.4, b - 0.3, 14, BEAT / 2);
  [0, 1, 2, 3].forEach((j) => sing(O.sing, l0 + j));
  ducks.forEach((d, n) => d.hop(CS(l0 + 2) + 0.2 * n, 40));
  hearts(S, CS(l0 + 2), [[700, 420, 1], [980, 340, 1.1], [1260, 420, 1]]);
  view(S, 960, 600, 1.12, a + 1, 3); done(S); };
chorus(bounds[11], bounds[12], 21, 2);
{ const a = bounds[12], b = bounds[13], S = scene(a, b, { cam: "none" }); world(S, 1); pond(S, null);
  const ducks = [0, 1, 2, 3, 4].map((n) => place(S, duck, 600 + 170 * n, DY, 1.0, {})); ducks.forEach((d, n) => d.bobAll(S.start + 0.2 * n, S.end - 0.2, 9));
  const O = place(S, ollie, 170, FY, 0.7, { mouth: "smile", look: 12 }); O.bob(S.start + 0.3, S.end - 0.3, 8);
  [25, 26, 27, 28].forEach((l) => sing(O.sing, l));
  for (let n = 0; n < 5; n++) { const t = W(25, n)[3], c = DS.card(S, String(n + 1), 600 + 170 * n, 600, { size: DS.type.display * 0.8, t: Math.max(t - 0.05, a + 0.1), fill: "yellow" }); ducks[n].hop(t, 50); S.fadeOut(c.g, CS(27) - 0.1, 0.3); }
  for (let n = 0; n < 5; n++) ducks[4 - n].hop(W(27, n)[3], 50);
  view(S, 960, 560, 1.12, a + 0.5, 3); done(S); }
chorus(bounds[13], bounds[14], 29, 0);
{ const S = scene(bounds[14], TOTAL, { cam: "none" }); world(S, 2); pond(S, null);
  [0, 1, 2, 3, 4].forEach((n) => place(S, duck, 700 + 150 * n, DY, 1.0, {}));
  const O = place(S, ollie, 170, FY, 0.7, { mouth: "grin", look: 12 });
  S.text("Tiny Tune Town", 960, 330, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.start + 0.5 }); done(S); }
