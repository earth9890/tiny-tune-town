// look: still
// @include ../../tools/cast.js
// @include props.js
// 70 A for Apple, B for Ball (original). Seven passes of four letters each (Ollie on the left, the object on the right, a big letter card between),
// a face close-up on every "A, B, C! Sing with me!" refrain, then a finale with all friends. Letters are found from script.json by LC (below).
// Camera per pass: wide (letters 1-2) -> medium (letters 3-4, object + Ollie) -> Ollie's face on the refrain. 0.6 s crossfades between passes.
BEAT = 60 / 116;
// LC-BEGIN (generated from script.json by mkscenes.py: letter -> clip number, 1-based)
const LC = {A:2,B:3,C:4,D:5,E:7,F:8,G:9,H:10,I:13,J:14,K:15,L:16,M:18,N:19,O:20,P:21,Q:23,R:24,S:25,T:26,U:29,V:30,W:31,X:32,Y:35,Z:36};
const FINAL = [37, 38];
// LC-END
const CS = (c) => CLIP(c)[0], CE = (c) => CLIP(c)[1];
const LAST = CE(38) + 0.2;
const LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NAME = ["apple", "ball", "cat", "dog", "elephant", "fish", "goat", "hat", "icecream", "jug", "kite", "lion", "mango", "nest", "orange", "parrot", "queen", "rabbit", "sun", "tiger", "umbrella", "van", "watch", "xylophone", "yak", "zebra"];
const SC = { apple: 1.15, ball: 1.1, cat: 1.15, elephant: 1.1, goat: 1.2, hat: 1.5, icecream: 1.0, jug: 1.15, kite: 1.1, lion: 1.1, mango: 1.45, nest: 1.5, orange: 1.35, parrot: 1.0, queen: 0.95, sun: 1.05, tiger: 1.15, umbrella: 1.0, van: 1.05, watch: 1.2, xylophone: 0.9, yak: 1.1, zebra: 1.1 };
const FY = 935, OX = 470, OK = 1.1, FACE = [OX, FY - 330 * OK], PX = 1310, PG = 910;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const view = (S, x, y, k, t, dur = 1.3) => (x = clamp(x, 960 / k - 190, 2110 - 960 / k), y = clamp(y, 540 / k - 190, 1270 - 540 / k), k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const wide = (S, t) => view(S, 960, 540, 1, t);
const sing = (A, c) => TIMING.words.filter((w) => w[0] === c).forEach((w) => A(w[3], w[3] + 0.6 * (w[4] - w[3])));
const place = (S, make, x, gy, k, o) => { const n = S.g.children.length, A = make(S, x, gy, k, o); A.sd = S.g.children[n]; Object.assign(A, { x, gy, k, x0: x, gy0: gy }); return A; };
const hero = (S, o = {}) => place(S, ollie, o.x ?? OX, o.gy ?? FY, o.k ?? OK, { mouth: o.mouth || "smile", look: o.look ?? 8, t: o.t });
const wBibi = (S, t, o = {}) => {
  const [x, y] = o.at || [1610, FY], k = o.k || 0.6, w = S.grp(); DS.shadow(S, x, y, 260 * k, { parent: w });
  const B = bibi(S, x, y - 325 * k, { k, mood: "joy" }); w.appendChild(B.g);
  if (t > S.start + 0.05) popAt(w, t, x, y - 150, 0.5);
  swing(S, B.R, t + 0.6, S.end - 0.4, { rotation: -14, svgOrigin: B.R.sh }, BEAT); B.w = w; return B;
};
const done = (S) => DS.vignette(S, 0.1);
const flowers = (S, g, xs, y) => xs.forEach(([x, c], i) => { const f = S.grp(g); S.draw(`M${x} ${y} V${y - 46}`, S.start, 0, { c: DS.c("green", 2, "mid"), w: DS.w.mid, parent: f }); [0, 1, 2, 3, 4].forEach((j) => S.fill(circ(x + Math.cos(j * 1.256) * 14, y - 54 + Math.sin(j * 1.256) * 14, 11), S.start, 0, DS.c(c, 0, "mid"), 1, f)); S.fill(circ(x, y - 54, 8), S.start, 0, DS.c("yellow", 0, "mid"), 1, f); tw(f, S.start, S.len, "rotate(-3 " + x + " " + y + ")", "rotate(3 " + x + " " + y + ")", wave(cyc(S.len, 3))); });
const BG = [{ sky: "sky", ground: "grass", hills: "grass" }, { sky: "dusk", ground: "grass", hills: "green" }, { sky: "sky", ground: "sand", hills: "sand" }, { sky: "sky", ground: "grass", hills: "green" }, { sky: "dusk", ground: "earth", hills: "grass" }, { sky: "sky", ground: "grass", hills: "grass" }, { sky: "dusk", ground: "grass", hills: "green" }];
const world = (S, i) => {
  const b = BG[i % BG.length], { g } = DS.outdoor(S, { hy: 600, sun: [i % 2 ? 330 : 1560, 170], ...b });
  const cl = [[300 + 700 * (i % 2), 190, 1], [1100 - 500 * (i % 2), 130, 0.8]].map(([x, y, k]) => { const c = S.grp(g); [[0, 0, 90 * k, 36 * k], [70 * k, -18 * k, 64 * k, 34 * k], [-70 * k, 6 * k, 56 * k, 28 * k]].forEach(([dx, dy, rx, ry]) => S.fill(circ(x + dx, y + dy, rx, ry), S.start, 0, DS.P.white[0], 0.9, c)); tw(c, S.start, S.len, "translate(0 0)", "translate(70 0)", "none"); return c; });
  flowers(S, g, [[70, "pink"], [210, "yellow"], [1850, "red"], [1700, "purple"], [880, "yellow"]], 1020);
};
// one object on the right, popping in on its word; returns the outer group (fade it out later)
const objectFor = (S, n, t) => {
  const [o, g] = popIn(S, t, PX, PG - 150, S.g), k = SC[NAME[n]] || 1.15, nm = NAME[n];
  const before = S.g.children.length;
  if (nm === "dog") puppy(S, PX, PG, 1.5, {});
  else if (nm === "fish") fish(S, PX, PG - 190, 2.1, "yellow", 1);
  else if (nm === "rabbit") bibi(S, PX, PG - 325 * 1.15, { k: 1.15, mood: "joy" });
  else { const gp = G(S, g, `translate(${PX} ${PG}) scale(${k})`); DS.shadow(S, 0, 0, 280, { parent: gp }); PROP[nm](S, gp); return o; }
  [...S.g.children].slice(before).forEach((c) => g.appendChild(c));
  return o;
};
const bounce = (S, o, t) => tw(o, t, 0.4, "translate(0 0)", "translate(0 -22)", hump(1));

// ---------- intro ----------
const B = [0];
const GS = Array.from({ length: 7 }, (_, g) => CS(LC[LET[g * 4]]) - 0.8);   // pass starts
GS[0] = Math.max(CS(LC.A) - 0.8, 3);
const RS = Array.from({ length: 7 }, (_, g) => CE(LC[LET[Math.min(g * 4 + 3, 25)]]) + 0.1);   // refrain starts
{ const S = scene(0, GS[0], { cam: "none" });
  world(S, 0); const O = hero(S, { look: 14 }), Bi = wBibi(S, S.start);
  O.bob(S.start + 0.4, S.end - 0.2, 7); O.wiggle([1, 8], 1.5, S.end - 0.3, 16, BEAT / 2);
  S.fadeOut(DS.card(S, "A B C", 1300, 330, { size: DS.type.display * 1.5, t: 0.5, fill: "yellow" }).g, S.end - 0.3, 0.3);
  view(S, 800, 640, 1.15, 2.0, 2.0);
  done(S); }
// ---------- seven passes ----------
const pass = (g) => {
  const L = [0, 1, 2, 3].map((i) => g * 4 + i).filter((n) => n < 26), cl = L.map((n) => LC[LET[n]]);
  const a = GS[g], b = g < 6 ? GS[g + 1] : LAST, rs = RS[g];
  const S = scene(a, b, { cam: "none" });
  world(S, g);
  const O = hero(S, { look: 10 }), Bi = wBibi(S, S.start);
  const sc = g === 6 ? [...cl, ...FINAL] : cl;
  sc.forEach((c) => sing(O.sing, c)); O.bob(a + 0.3, b - 0.3, 7);
  L.forEach((n, i) => {
    const c = cl[i], tw0 = W(c, 2), cs = CS(c), next = i < L.length - 1 ? CS(cl[i + 1]) - 0.15 : (g === 6 ? CE(c) + 1.0 : rs - 0.2);
    const obj = objectFor(S, n, tw0 - 0.05);
    const card = DS.card(S, LET[n] + " " + LET[n].toLowerCase(), 1020, 300, { size: DS.type.display, t: Math.max(cs - 0.05, a + 0.1), fill: "yellow" });
    S.fadeOut(card.g, next, 0.3); S.fadeOut(obj, next, 0.3);
    bounce(S, obj, tw0 + 0.5); O.hop(tw0, 46, 0.5); O.wiggle(i % 2 ? [3, 4, 5, 6] : [1, 2, 7, 8], tw0 - 0.1, Math.min(next, tw0 + 1.8), 16, BEAT / 2);
    if (i === 2) sparkle(S, PX, 380, tw0 + 0.2, 1.1);
  });
  // camera: wide -> medium -> face on the refrain
  if (L.length > 2) view(S, 960, 620, 1.25, CS(cl[2]) - 0.9);
  const rEnd = g === 6 ? CE(FINAL[FINAL.length - 1] || cl[cl.length - 1]) : b - 0.8;
  view(S, FACE[0], FACE[1] + 20, 2.0, rs - 0.5);
  if (g < 6) { O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], rs, b - 0.3, 14, BEAT / 2); hearts(S, rs + 1.0, [[1250, 420, 1], [1500, 360, 1]]); }
  done(S);
};
for (let g = 0; g < 7; g++) pass(g);
// ---------- finale: A-Z all together ----------
{ const S = scene(LAST, TOTAL, { cam: "none" });
  world(S, 3); const O = hero(S, { x: 700, look: 6, k: 1.1 }), Bi = wBibi(S, S.start, { at: [1500, FY], k: 0.7 });
  const lc = Object.values(LC), last = CLIP(lc.length ? Math.max(...lc) : 1)[1];
  O.bob(S.start + 0.3, S.end - 0.3, 8); O.wiggle([1, 2, 7, 8], S.start + 0.5, S.end - 0.5, 20, BEAT);
  hearts(S, S.start + 1.0, [[900, 380, 1], [1250, 330, 1.1], [1500, 380, 0.9]]);
  S.fadeOut(DS.card(S, "A to Z!", 960, 170, { size: DS.type.display * 1.3, t: S.start + 0.6, fill: "yellow" }).g, S.end - 0.1, 0.05);
  S.text("Tiny Tune Town", 960, 420, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.start + 2 });
  done(S); }
