// look: still
// @include ../../tools/cast.js
// 75 Bingo (traditional, PD). Farmer Ollie (straw hat) and Bingo the puppy at the farm gate. The sign B-I-N-G-O: each verse one more letter turns into a clap (a yellow burst). Last verse: all letters back, Bingo gets a bone.
// Lines in script.json: six verses as VL (line 1 farmer, 2 name-oh, then letter/clap lines, last = name-oh); "Bye-bye!" = 34.
BEAT = 60 / 116;
const CS = (c) => CLIP(c)[0], CE = (c) => CLIP(c)[1];
const VL = [[1, 5], [6, 10], [11, 15], [16, 21], [22, 27], [28, 33]]; // first / last script line of each verse; 34 = Bye-bye
const LET = ["B", "I", "N", "G", "O"];
const FY = 935, FX = 480, FK = 1.15, BX = 1380;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const view = (S, x, y, k, t, dur = 1.3) => (x = clamp(x, 960 / k - 190, 2110 - 960 / k), y = clamp(y, 540 / k - 190, 1270 - 540 / k), k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const sing = (A, c) => TIMING.words.filter((w) => w[0] === c).forEach((w) => A(w[3], w[3] + 0.6 * (w[4] - w[3])));
const place = (S, make, x, gy, k, o) => { const n = S.g.children.length, A = make(S, x, gy, k, o); A.sd = S.g.children[n]; return A; };
const done = (S) => DS.vignette(S, 0.1);
const world = (S, i) => {
  const { g } = DS.outdoor(S, { hy: 600, sun: [i % 2 ? 330 : 1560, 170], sky: i === 3 ? "dusk" : "sky", ground: "grass", hills: i % 2 ? "green" : "grass" });
  [[300 + 700 * (i % 2), 190, 1], [1100 - 500 * (i % 2), 130, 0.8]].forEach(([x, y, k]) => { const c = S.grp(g); [[0, 0, 90 * k, 36 * k], [70 * k, -18 * k, 64 * k, 34 * k], [-70 * k, 6 * k, 56 * k, 28 * k]].forEach(([dx, dy, rx, ry]) => S.fill(circ(x + dx, y + dy, rx, ry), S.start, 0, DS.P.white[0], 0.9, c)); tw(c, S.start, S.len, "translate(0 0)", "translate(70 0)", "none"); });
  // farm fence
  for (let x = 700; x < 1260; x += 80) S.fill(rrect(x, 800, 36, 150, 8), S.start, 0, DS.c("wood", 0), 1, g);
  S.fill(rrect(690, 830, 600, 26, 8), S.start, 0, DS.c("wood", 1), 1, g); S.fill(rrect(690, 900, 600, 26, 8), S.start, 0, DS.c("wood", 1), 1, g);
};
const farmer = (S, t) => { const O = place(S, ollie, FX, FY, FK, { mouth: "smile", look: 12 });
  const b = O.body; toon(S, "M-190 -462 Q0 -432 190 -462 Q120 -486 0 -486 Q-120 -486 -190 -462 Z", "yellow", { parent: b, lw: DS.w.mid * 2.4 });
  toon(S, "M-98 -476 Q-90 -590 0 -596 Q90 -590 98 -476 Q0 -450 -98 -476 Z", "yellow", { parent: b, lw: DS.w.mid * 2.4 });
  S.fill("M-96 -486 Q0 -462 96 -486 L96 -498 Q0 -474 -96 -498 Z", S.start, 0, DS.c("red", 1), 1, b);
  O.bob(S.start + 0.3, S.end - 0.3, 8); return O; };
const sign = (S, v, t0) => LET.map((c, i) => { const x = 860 + 190 * i, clap = i < v;
  if (clap) { const p = S.draw(rays(x, 215, 40, 78, 8), S.start, 0, { c: DS.c("yellow", 2), w: DS.w.mid }); S.fill(circ(x, 215, 34), S.start, 0, DS.c("yellow", 0), 1); return p; }
  return DS.card(S, c, x, 215, { size: DS.type.display * 0.95, t: S.start + 0.1, fill: "yellow" }).g; });
const bounds = [0];
VL.forEach(([a, z]) => bounds.push(CS(a) - 0.3, CS(a + 2) - 0.3, CS(z) - 0.3));
bounds.push(TOTAL);
const mk = (a, b, v, who, bg) => { const S = scene(a, b, { cam: "none" }); world(S, bg); const O = farmer(S), P = place(S, puppy, BX, FY, 1.5, {}); sign(S, v === 5 ? 0 : v);
  P.wag(S.start, S.end - 0.2); who.forEach((l) => { sing(O.sing, l); }); return { S, O, P }; };
{ const S = scene(bounds[0], bounds[1], { cam: "none" }); world(S, 0); const O = farmer(S), P = place(S, puppy, BX, FY, 1.5, {}); sign(S, 0); P.wag(S.start, S.end);
  O.wiggle([1, 2, 7, 8], S.start + 0.5, S.end - 0.3, 14, BEAT); view(S, 960, 700, 1.12, 1.5, 2.5); done(S); }
VL.forEach(([f, z], v) => {
  const rng = (x, y) => Array.from({ length: y - x + 1 }, (_, n) => x + n);
  { const a = bounds[1 + 3 * v], b = bounds[2 + 3 * v], { S, O, P } = mk(a, b, v, [f, f + 1], v);
    view(S, FX + 200, 640, 1.2, CS(f) - 0.4); view(S, BX - 100, 700, 1.4, CS(f + 1) - 0.4); view(S, 960, 600, 1, b - 1.6); done(S); }
  { const a = bounds[2 + 3 * v], b = bounds[3 + 3 * v], mid = rng(f + 2, z - 1), { S, O, P } = mk(a, b, v, mid, v);
    mid.forEach((l) => { O.hop(CS(l), 40, 0.5); P.hop(CS(l) + 0.2, 36); });
    O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], a + 0.3, b - 0.3, 14, BEAT / 2); view(S, 960, 420, 1.15, a + 0.3, 2); view(S, 960, 620, 1, b - 1.8); done(S); }
  { const a = bounds[3 + 3 * v], b = bounds[4 + 3 * v], { S, O, P } = mk(a, b, v, [z], v);
    O.grin(CS(z), b - 0.4); hearts(S, CS(z) + 0.4, [[900, 420, 1]]); P.hop(CS(z), 50);
    if (v === 5) { const g = G(S, null, `translate(${BX - 190} ${FY - 24})`); bone(S, g, 1.2); sing(O.sing, 34); S.text("Tiny Tune Town", 960, 520, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.start + 2 }); }
    view(S, 960, 640, 1.25, a + 0.2, 2.5); view(S, 960, 600, 1, b - 1.6); done(S); }
});
