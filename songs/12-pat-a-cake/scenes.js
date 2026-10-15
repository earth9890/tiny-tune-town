// look: still
// @include ../../tools/cast.js
// 12 Pat-a-Cake (traditional). Ollie in a chef's hat bakes one cake per friend in a warm kitchen: pat (claps + flour puffs),
// a ball of dough on "cake", the friend's letter iced on it on its word, it slides off to the oven on the tag line, and in the
// break the oven glows and the baked cake lands on the shelf. Friends join one per pass: Bibi, Crab, Turtle (Crab rides on her).
// Bridge: hot cross buns, 1 and 2. Finale: all four cakes on the table, "Happy baking!", everyone claps.
// Camera: wide at each pass, medium on line 2, the slot (letter + friend) on line 3, Ollie's face on every tag line.
BEAT = 60 / 96;
// script.json clips: 1 intro, 2-5 O, 6-9 B, 10-12 + 13-16 C (sung twice), 17 "One more!", 18-21 T, 22 "Mmm! Buns!", 23-25 buns, 26-29 finale, 30-33 bye
const BUNS = 23, FIN = 26, BYE = 30;
const OX = 960, OGY = 840, OKK = 1.25, FACE = [960, 428];      // Ollie stands behind the counter; face centre (960, 428)
const wide = (S, t) => S.zoom(...FACE, 1, t, 1.3), mid = (S, t) => S.zoom(...FACE, 1.2, t, 1.3), close = (S, t) => S.zoom(...FACE, 1.45, t, 1.3);
const FRIENDS = [["O", "pink"], ["B", "yellow"], ["C", "orange"], ["T", "grass"]];   // letter + icing colour per cake
const SHELF = [1505, 1587, 1669, 1751], SHELF_Y = 560, WORK = [1190, 712];

// ---------- kitchen set ----------
const KITCHEN = { wall: "wall", floor: "floor", window: [470, 150, 230, 220] };
const rail = (S) => {                                     // utensils hanging on a rail, right of Ollie
  S.draw("M1280 250 H1490", S.start, 0, { c: DS.c("gray", 2, "mid"), w: DS.w.mid });
  DS.shape(S, rrect(1308, 250, 14, 120, DS.r.xs), "wood", { layer: "mid", w: "detail" }); DS.shape(S, circ(1315, 385, 26, 34), "wood", { layer: "mid", w: "detail" });  // spoon
  S.draw("M1380 250 V320", S.start, 0, { c: DS.c("gray", 2, "mid"), w: DS.w.mid });                                                                                     // whisk
  [-1, 0, 1].forEach((s) => S.draw(`M1380 320 Q${1380 + s * 30} 380 1380 420 Q${1380 - s * 6} 380 1380 320`, S.start, 0, { c: DS.c("gray", 2, "mid"), w: DS.w.detail }));
  DS.shape(S, rrect(1444, 250, 12, 90, DS.r.xs), "red", { layer: "mid", w: "detail" }); DS.shape(S, rrect(1426, 336, 48, 56, DS.r.sm), "red", { layer: "mid", w: "detail" }); // spatula
};
const counter = (S) => {
  DS.shape(S, rect(220, 772, 1220, 420), "wood", { dir: "v" });
  [626, 1032].forEach((x) => S.draw(`M${x} 790 V1100`, S.start, 0, { c: DS.c("wood", 2), w: DS.w.mid }));
  [586, 666, 992, 1072].forEach((x) => DS.shape(S, circ(x, 860, 12), "gold", { w: "detail" }));
  DS.shape(S, rrect(200, 712, 1270, 66, DS.r.sm), "white");
};
// retro red oven at the right; returns { glow } (the window light, opacity 0 until baking)
const oven = (S) => {
  DS.shape(S, rrect(1470, 690, 340, 520, DS.r.md), "red");
  [1530, 1600, 1680, 1750].forEach((x) => DS.shape(S, circ(x, 728, 15), "yellow", { w: "detail" }));
  DS.shape(S, rrect(1500, 770, 280, 360, DS.r.md), "red", { tone: 1, flat: true, w: "mid" });
  DS.shape(S, rrect(1530, 786, 220, 18, DS.r.xs), "gray", { w: "mid" });
  S.draw(rrect(1545, 830, 190, 120, DS.r.md), S.start, 0, { fill: DS.c("brown", 1), c: DS.line(), w: DS.w.mid });
  const glow = S.fill(rrect(1553, 838, 174, 104, DS.r.sm), S.start, 0, DS.c("orange", 1), 1); glow.setAttribute("opacity", 0);
  return { glow };
};
const shelf = (S) => { DS.shape(S, rrect(1450, SHELF_Y, 360, 20, DS.r.xs), "wood", { layer: "mid", w: "mid" }); [1480, 1780].forEach((x) => DS.shape(S, `M${x} ${SHELF_Y + 20} L${x} ${SHELF_Y + 60} L${x + 20} ${SHELF_Y + 20} Z`, "wood", { layer: "mid", w: "detail" })); };
const bowl = (S, x = 1330, gy = 712) => {
  DS.shadow(S, x, gy, 220);
  DS.shape(S, `M${x - 26} ${gy - 120} L${x + 34} ${gy - 196}`, "wood", { w: "mid" });                 // wooden spoon handle
  DS.shape(S, `M${x - 110} ${gy - 100} Q${x - 100} ${gy} ${x} ${gy} Q${x + 100} ${gy} ${x + 110} ${gy - 100} Z`, "yellow");
  S.draw(circ(x, gy - 100, 110, 20), S.start, 0, { fill: DS.c("paper", 0), c: DS.line(), w: DS.w.near });
  S.draw(`M${x - 90} ${gy - 66} Q${x} ${gy - 46} ${x + 90} ${gy - 66}`, S.start, 0, { c: DS.c("yellow", 2), w: DS.w.mid });
};
// a soft cloud of flour rising from the bowl (fades in and away, never flashes)
const puff = (S, x, y, t) => {
  const g = G(S, null, "translate(0 0)");
  [[0, 0, 26], [-30, 10, 18], [28, 8, 20], [-8, -24, 16], [16, -20, 14]].forEach(([dx, dy, r]) => S.fill(circ(x + dx, y + dy, r), S.start, 0, DS.P.white[0], 0.9, g));
  tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.3 }, t); tw(g, t, 1.6, "translate(0 0)", "translate(10 -110)", "power1.out"); tl.to(g, { opacity: 0, duration: 0.7 }, t + 0.8);
};
// a cake standing on gy. baked: sponge + coloured icing + iced letter. dough: a pale round dough ball on a tray (letter iced on it later)
const cake = (S, x, gy, k, o = {}) => {
  const [g, in_] = popIn(S, o.t ?? S.start, x, gy - 50 * k, o.parent);
  if (!o.parent) DS.shadow(S, x, gy, 200 * k, { t: o.t ?? S.start, parent: g });
  if (o.dough) {
    DS.shape(S, rrect(x - 92 * k, gy - 16 * k, 184 * k, 16 * k, DS.r.xs), "gray", { parent: in_, w: "mid" });
    DS.shape(S, `M${x - 80 * k} ${gy - 16 * k} Q${x - 82 * k} ${gy - 110 * k} ${x} ${gy - 112 * k} Q${x + 82 * k} ${gy - 110 * k} ${x + 80 * k} ${gy - 16 * k} Z`, "sand", { parent: in_ });
  } else {
    DS.shape(S, circ(x, gy - 8 * k, 96 * k, 15 * k), "white", { parent: in_, w: "mid" });
    DS.shape(S, rrect(x - 76 * k, gy - 104 * k, 152 * k, 96 * k, DS.r.md), "gold", { parent: in_ });
    const d = Array.from({ length: 5 }, (_, i) => { const x0 = x - 76 * k + i * 30.4 * k; return `Q${x0 + 15.2 * k} ${gy - (i % 2 ? 60 : 72) * k} ${x0 + 30.4 * k} ${gy - 84 * k}`; }).join(" ");
    DS.shape(S, `M${x - 78 * k} ${gy - 84 * k} V${gy - 96 * k} Q${x - 78 * k} ${gy - 112 * k} ${x - 60 * k} ${gy - 112 * k} H${x + 60 * k} Q${x + 78 * k} ${gy - 112 * k} ${x + 78 * k} ${gy - 96 * k} V${gy - 84 * k} ` + d.replace(/^Q/, "L" + (x - 76 * k) + " " + (gy - 84 * k) + " Q") + " Z", o.c || "pink", { parent: in_, w: "mid", flat: true });
    DS.shape(S, circ(x, gy - 124 * k, 14 * k), "red", { parent: in_, w: "detail" });
  }
  if (o.letter) S.text(o.letter, x, gy - (o.dough ? 40 : 22) * k, { size: DS.type.display * k * (o.dough ? 0.8 : 0.6), c: DS.P.white[0], halo: DS.c("red", 2), haloW: 0.14, t: o.lt ?? o.t ?? S.start, parent: in_ });
  return g;
};
// Ollie's chef hat (in his body group so it bobs with him)
const hat = (S, O, t) => {
  const [, in_] = popIn(S, t, 0, -520, O.body);
  [[-56, -560, 44], [0, -582, 54], [56, -560, 44]].forEach(([x, y, r]) => DS.shape(S, circ(x, y, r), "white", { parent: in_ }));
  DS.shape(S, rrect(-84, -530, 168, 48, DS.r.sm), "white", { parent: in_ });
  S.draw("M-84 -512 H84", S.start, 0, { c: DS.c("gray", 1), w: DS.w.detail, parent: in_ });
};
// the inner pair of arms becomes a pair of clapping arms in front of Ollie's chin; returns clap(t) (arms meet exactly at t)
const OPEN = 34;
const clapArms = (S, O) => {
  O.arms.filter((A) => A.ai === 3).forEach((A) => A.pose.setAttribute("opacity", 0));
  const gs = [-1, 1].map((s) => {
    const rx = 92 * s, ry = -196, g = G(S, O.body, `rotate(${-OPEN * s} ${rx} ${ry})`);
    const { d, C } = tube([[rx, ry], [rx + 44 * s, -160], [rx + 30 * s, -118], [rx - 30 * s, -100], [14 * s, -126]], 30, 14);
    DS.shape(S, d, "pink", { parent: g });
    C.forEach((p, i) => { if (i > 6 && i < C.length - 3 && i % 3 === 0) S.fill(circ(p[0], p[1] + 8, 6), S.start, 0, DS.c("pink", 1), 0.95, g); });
    return [g, s, rx, ry];
  });
  return (t) => { gs.forEach(([g, s, rx, ry]) => tw(g, t - 0.16, 0.32, `rotate(${-OPEN * s} ${rx} ${ry})`, `rotate(0 ${rx} ${ry})`, hump(1))); };
};
// Bibi's paws meet in front of her tummy; clap(t) brings them together at t
const BX = 430, BHY = 500, BK = 0.72;
const bibiClap = (B) => {
  const P = [[B.L, 38], [B.R, -38]];
  P.forEach(([A, a]) => A.setAttribute("transform", `rotate(${a} ${A.sh})`));
  return (t) => P.forEach(([A, a]) => tw(A, t - 0.16, 0.32, `rotate(${a} ${A.sh})`, `rotate(0 ${A.sh})`, hump(1)));
};
const burst = (S, t) => sparkle(S, OX, OGY - 120 * OKK, t, 0.45);

// the kitchen with Ollie behind the counter. o: { bibi, crab, turtle, cakes: n baked on the shelf, hat: t, mouth, look }
// draw(O, B) runs before the counter (things held in front of Ollie). Returns { O, B, clap, oven, crab, turtle }
const kitchen = (S, o = {}, draw) => {
  DS.room(S, KITCHEN); rail(S); shelf(S);
  for (let i = 0; i < (o.cakes || 0); i++) cake(S, SHELF[i], SHELF_Y, 0.48, { letter: FRIENDS[i][0], c: FRIENDS[i][1] });
  const B = o.bibi ? bibi(S, BX, BHY, { k: BK, mood: o.bibiMood, paws: [[BX - 24, 650], [BX + 24, 650]] }) : null;
  const O = ollie(S, OX, OGY, OKK, { mouth: o.mouth || "smile", look: o.look || 0 });
  const oc = clapArms(S, O), bc = B ? bibiClap(B) : null;
  if (o.hat !== false) hat(S, O, o.hat ?? S.start);
  if (draw) draw(O, B);
  counter(S); const OV = oven(S);
  if (o.bowl !== false) bowl(S);
  const T = o.turtle ? turtle(S, 690, 712, 0.6, { t: o.turtle }) : null;
  const Cr = o.crab ? crab(S, o.turtle ? 690 : 650, o.turtle ? 634 : 712, o.turtle ? 0.45 : 0.6, { t: o.crab }) : null;
  const clap = (t) => { oc(t); if (bc) bc(t); if (Cr) Cr.clap(t - 0.16); burst(S, t); };
  return { O, B, clap, OV, Cr, T };
};
const claps = (K, c, idx = [5, 6, 7]) => idx.forEach((i) => K.clap(W(c, i)));     // "clap, clap, clap!"
const pats = (S, K, c) => { [0, 1].forEach((i) => { K.clap(W(c, i)); puff(S, 1330, 600, W(c, i)); }); K.clap(W(c, 3)); };   // pat-a-cake, pat-a-cake, baker's man
const sings = (O, list) => list.forEach((c) => O.sing(CLIP(c)[0], CLIP(c)[1]));
// friend i's dough: appears on "cake", the letter is iced on its word
const dough = (S, i, t, lt) => cake(S, WORK[0], WORK[1], 0.8, { dough: true, letter: FRIENDS[i][0], t, lt });
const toOven = (d, t) => { tw(d, t, 1.0, "translate(0 0)", "translate(420 150)", "power2.in"); tl.to(d, { opacity: 0, duration: 0.4 }, t + 0.6); };
// the oven glows softly, steam puffs, then the baked cake lands on the shelf with its letter card above (card fades at tOut)
const bake = (S, K, i, tb, tOut) => {
  tl.fromTo(K.OV.glow, { opacity: 0 }, { opacity: 0.85, duration: 0.8 }, tb); tl.to(K.OV.glow, { opacity: 0, duration: 0.8 }, tb + 1.8);
  puff(S, 1560, 680, tb + 0.3); puff(S, 1700, 680, tb + 0.9);
  cake(S, SHELF[i], SHELF_Y, 0.48, { letter: FRIENDS[i][0], c: FRIENDS[i][1], t: tb + 1.6 });
  sparkle(S, SHELF[i], SHELF_Y - 90, tb + 1.8, 0.6);
  S.fadeOut(DS.card(S, FRIENDS[i][0], 1640, 400, { size: DS.type.display, t: tb + 1.6, fill: FRIENDS[i][1] }).g, tOut, 0.4);
};

// 0  intro (0-5.2): the kitchen, the bowl puffs flour; "Ooh! Let's bake!" - the chef's hat pops onto Ollie, the camera eases out
{ const S = scene(0, cut(2), { cam: "none" });
  kitchen(S, { hat: W(1, 2), look: 14 }, (O) => { O.sing(W(1, 0), WE(1, 2)); O.bob(S.start + 0.5, S.end, 6); });
  puff(S, 1330, 600, 1.2); puff(S, 1300, 590, 3.4);
  S.zoom(1150, 500, 1.3, 0, 0.01); S.zoom(...FACE, 1, 1.0, 3.6);
  DS.vignette(S); }

// 1  O for Ollie (5.2-27.3): clap and pat, dough, the O iced on it, off to the oven; it bakes; Bibi peeks in and waves
{ const S = scene(cut(2), cut(6), { cam: "none" });
  let B; const K = kitchen(S, {}, () => { B = bibi(S, BX, BHY, { k: BK, paws: [null, [BX + 90, 600]] }); });
  pats(S, K, 2); claps(K, 5); sings(K.O, [5]); K.O.bob(S.start + 0.3, CLIP(5)[1], 8); K.O.hop(W(4, 6), 40);
  toOven(dough(S, 0, W(3, 2), W(4, 3)), W(5, 2));
  bake(S, K, 0, CLIP(5)[1] + 0.3, S.end - 0.6);
  S.zoom(1100, 520, 1.3, W(3, 0) - 0.3, 1.2); close(S, W(5, 0) - 0.4); wide(S, CLIP(5)[1] + 0.2);
  popAt(B.g, CLIP(5)[1] + 2.0, BX, 640, 0.6); swing(S, B.R, CLIP(5)[1] + 2.5, S.end - 0.2, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  DS.vignette(S); }

// 2  B for Bibi (27.3-48.4): Bibi claps along and hops on her name
{ const S = scene(cut(6), cut(10), { cam: "none" });
  const K = kitchen(S, { bibi: true, cakes: 1 });
  pats(S, K, 6); claps(K, 9); sings(K.O, [9]); K.O.bob(S.start + 0.3, S.end, 8);
  toOven(dough(S, 1, W(7, 2), W(8, 3)), W(9, 2));
  tw(K.B.g, W(8, 6), 0.5, "translate(0 0)", "translate(0 -40)", hump(1));
  mid(S, W(7, 0) - 0.3); S.zoom(810, 520, 1.3, W(8, 0) - 0.3, 1.2); close(S, W(9, 0) - 0.4); wide(S, CLIP(9)[1] + 0.2);
  DS.vignette(S); }

// 3  C for Crab, first time (48.4-64.2): the B cake bakes, Crab scuttles onto the counter, dough + the C
{ const S = scene(cut(10), cut(13), { cam: "none" });
  const K = kitchen(S, { bibi: true, cakes: 1, crab: W(10, 2) });
  bake(S, K, 1, S.start + 0.2, W(11, 0) - 1.0);
  pats(S, K, 10); K.O.bob(S.start + 0.3, S.end, 8); K.Cr.dance(W(10, 3), S.end - 0.3);
  dough(S, 2, W(11, 2), W(12, 3));
  mid(S, W(11, 0) - 0.3); S.zoom(650, 600, 1.4, W(12, 0) - 0.3, 1.2);
  DS.vignette(S); }

// 4  C for Crab again (64.2-84.5): Crab claps, the C dough goes in the oven; "One more!" - Turtle arrives, Crab rides on her shell
{ const S = scene(cut(13), cut(18), { cam: "none" });
  const K = kitchen(S, { bibi: true, cakes: 2, crab: S.start });
  pats(S, K, 13); claps(K, 16); sings(K.O, [16]); K.O.bob(S.start + 0.3, S.end, 8);
  toOven(dough(S, 2, S.start, S.start), W(16, 2));
  K.Cr.dance(W(15, 4), WE(15, 6) + 0.8);
  const tm = CLIP(16)[1] + 0.3;
  tl.to(K.Cr.pos, { opacity: 0, duration: 0.35 }, tm); turtle(S, 690, 712, 0.6, { t: tm }).dance(tm + 0.5, S.end - 0.2); crab(S, 690, 634, 0.45, { t: tm + 0.3 }).dance(tm + 0.8, S.end - 0.2);
  mid(S, W(14, 0) - 0.3); S.zoom(650, 600, 1.4, W(15, 0) - 0.3, 1.2); close(S, W(16, 0) - 0.4); wide(S, CLIP(16)[1] + 0.2);
  DS.vignette(S); }

// 5  T for Turtle (84.5-104.9): the C cake bakes; Turtle's dough; "Clap, clap, clap!"; "Mmm! Buns!" - the T cake bakes
{ const S = scene(cut(18), cut(BUNS), { cam: "none" });
  const K = kitchen(S, { bibi: true, cakes: 2, crab: S.start, turtle: S.start });
  bake(S, K, 2, S.start + 0.1, W(19, 0) - 1.0);
  pats(S, K, 18); claps(K, 21, [0, 1, 2]); sings(K.O, [21]); K.O.bob(S.start + 0.3, S.end, 8);
  toOven(dough(S, 3, W(19, 2), W(20, 3)), W(21, 0));
  K.T.dance(W(20, 4), CLIP(20)[1] + 0.6);
  bake(S, K, 3, CLIP(21)[1] + 0.3, S.end - 0.6);
  mid(S, W(19, 0) - 0.3); S.zoom(690, 600, 1.4, W(20, 0) - 0.5, 1.2); close(S, W(21, 0) - 0.4); wide(S, CLIP(21)[1] + 1.3);
  DS.vignette(S); }

// 6  bridge (104.9-117.3): hot cross buns on a tray - one bun, two buns
{ const S = scene(cut(BUNS), cut(FIN), { cam: "none" });
  const K = kitchen(S, { bibi: true, bibiMood: "joy", cakes: 4, crab: S.start, turtle: S.start, bowl: false });
  const tray = G(S, null, "translate(0 0)");
  DS.shape(S, rrect(1100, 694, 300, 18, DS.r.xs), "gray", { parent: tray, w: "mid" });
  fadeIn(S, tray, W(BUNS, 0));
  [[1180, W(BUNS + 1, 0)], [1320, W(BUNS + 1, 3)]].forEach(([x, t], n) => {
    const [, in_] = popIn(S, t, x, 650, tray);
    DS.shape(S, `M${x - 62} 694 Q${x - 66} 610 ${x} 606 Q${x + 66} 610 ${x + 62} 694 Z`, "gold", { parent: in_ });
    S.draw(`M${x - 44} 650 Q${x} 640 ${x + 44} 650 M${x} 612 V690`, S.start, 0, { c: DS.P.white[0], w: DS.w.near, parent: in_ });
    S.fadeOut(DS.card(S, String(n + 1), x, 520, { size: DS.type.display, t, fill: "yellow" }).g, W(BUNS + 2, 0) - 0.3, 0.4);
  });
  K.O.bob(S.start + 0.3, S.end - 0.2, 10); swing(S, K.B.g, S.start + 0.5, S.end - 0.3, { y: -10 }, BEAT);
  K.Cr.dance(S.start + 0.5, S.end - 0.2); K.T.dance(S.start + 0.5, S.end - 0.2);
  sings(K.O, [BUNS, BUNS + 1, BUNS + 2]);
  S.zoom(1250, 640, 1.45, W(BUNS + 1, 0) - 0.6, 1.2); wide(S, W(BUNS + 2, 0) - 0.3);
  DS.vignette(S); }

// 7  finale: all four cakes on the table, the last pass, "Happy baking, clap, clap, clap!"
const party = (S, o = {}) => {
  DS.room(S, KITCHEN); rail(S);
  const B = bibi(S, BX, BHY, { k: BK, mood: "joy", paws: [[BX - 24, 650], [BX + 24, 650]] });
  const O = ollie(S, OX, OGY, OKK, { mouth: o.mouth || "grin" });
  const oc = clapArms(S, O), bc = bibiClap(B); hat(S, O, S.start);
  counter(S); oven(S);
  DS.shape(S, rect(200, 734, 1270, 30), "red", { tone: 1, flat: true, w: "detail" });          // party tablecloth edge
  [[600, 0], [750, 1], [1180, 2], [1330, 3]].forEach(([x, i]) => cake(S, x, 712, 0.85, { letter: FRIENDS[i][0], c: FRIENDS[i][1] }));
  const T = turtle(S, 1620, 690, 0.6), Cr = crab(S, 1620, 612, 0.45);
  const clap = (t) => { oc(t); bc(t); Cr.clap(t - 0.16); burst(S, t); };
  return { O, B, clap, T, Cr };
};
{ const c = FIN, S = scene(cut(FIN), 143.0, { cam: "none" });
  const K = party(S, { mouth: "smile" });
  pats(S, K, c); claps(K, c + 3, [2, 3, 4]); sings(K.O, [c, c + 1, c + 2, c + 3]); K.O.grin(CLIP(c + 3)[1] + 0.2);
  K.O.bob(S.start + 0.3, S.end - 0.2, 10); K.Cr.dance(S.start + 0.5, S.end - 0.2); K.T.dance(S.start + 0.5, S.end - 0.2);
  sparkle(S, 600, 600, W(c + 2, 3), 0.7);
  mid(S, W(c + 1, 0)); S.zoom(960, 640, 1.15, W(c + 2, 0) - 0.2, 1.2); close(S, W(c + 3, 0) - 0.4); wide(S, CLIP(c + 3)[1] + 0.4);
  for (let b = CLIP(c + 3)[1] + 0.8; b < S.end - 0.5; b += 2 * BEAT) K.clap(b);
  DS.card(S, "HAPPY BAKING!", 1470, 150, { size: DS.type.title, t: CLIP(c + 3)[1] + 0.8, fill: "yellow" });
  DS.vignette(S); }

// 8  bye-bye (143-170): everyone waves, the last "Mark it with O" close-up, end card
{ const S = scene(143.0, TOTAL, { cam: "none" });
  const K = party(S);
  K.O.bob(S.start + 0.5, S.end, 8);
  [K.O.arms.find((A) => A.ai === 0 && A.side === 1), K.O.arms.find((A) => A.ai === 0 && A.side === -1)].forEach((A) => K.O.raise(A, 120, W(BYE, 2) - 0.6, 0.6));
  K.O.wiggle([1, 2], W(BYE, 2), S.end - 1, 14, BEAT);
  swing(S, K.B.R, W(BYE, 2), S.end - 1, { rotation: -16, svgOrigin: K.B.R.sh }, BEAT);
  K.Cr.dance(S.start + 0.5, S.end - 0.5); K.T.dance(S.start + 0.5, S.end - 0.5);
  mid(S, W(BYE + 1, 0) - 0.4); close(S, W(BYE + 2, 0) - 0.4); wide(S, W(BYE + 3, 0) - 0.3);
  S.fadeOut(DS.card(S, "BYE-BYE!", 1420, 150, { size: DS.type.title, t: W(BYE, 2) }).g, W(BYE + 1, 0) - 1.0, 0.4);
  S.text("Tiny Tune Town", 1470, 170, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: CLIP(BYE + 3)[1] + 1.0 });
  DS.vignette(S); }
