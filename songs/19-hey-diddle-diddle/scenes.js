// look: still
// @include ../../tools/cast.js
// @include chars.js
// 19 Hey Diddle Diddle (traditional, c. 1765). A starry night on a green hill under a big smiling moon. The cat plays her fiddle on a
// tree stump, the cow waits on the hill, the little dog sits by the dish and the spoon. Each pass Ollie asks who can jump too: the cow
// (moo), the cat (meow), the dog (woof), and at last Ollie himself (flap, flap, all 8 arms). On "the cow jumped over the moon" the cow
// sails over the moon and that pass's friend jumps with her; the dog laughs; the dish and the spoon run away hand in hand.
// Finale: everyone, Bibi too, jumps together (count 1-2-3), the moon grins, and the dish and the spoon wave bye-bye.
// Camera per pass: wide (the ask + the answer) -> the cat and her fiddle -> wide (the jump, the dog laughs) -> Ollie + the dish and
// spoon on the tag (Ollie's face ~45 % of the height). No hard cuts, every shot >= 4 s, 0.6 s crossfades between passes.
BEAT = 60 / 118;
const GND = 905, OX = 760, OK = 1.1, FACE = [OX, GND - 330 * OK];
const MOON = [1320, 250, 100], COW = [1080, 770, 0.42], LAND = [1680, 775], STUMP = [250, 885], CATK = 0.6, DOG = [1450, 935, 0.55];
const DISH = [1130, 945, 0.55], SPOON = [1245, 945, 0.55];
// centre (x, y) on screen at zoom k (S.zoom scales about a fixed point; pick the point that lands (x, y) at the centre)
const view = (S, x, y, k, t, dur = 1.3) => (k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const wide = (S, t) => view(S, 960, 540, 1, t);
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const singLine = (A, c) => TIMING.words.filter((w) => w[0] === c).forEach((w) => A(w[3], w[3] + 0.6 * (w[4] - w[3])));   // mouth opens on each sung word
const card = (S, s, x, y, t, out, size = DS.type.title) => S.fadeOut(DS.card(S, s, x, y, { size, t }).g, out, 0.4);
const front = (S) => flowers(S, [[70, 960, "pink"], [1840, 950, "yellow"]]);

// the set + the classic's cast in their places. o.skip = names left out (the one jumping in from elsewhere)
const set = (S, o = {}) => {
  hill(S);
  const M = moon(S, ...MOON, { t: o.moonT });
  bush(S, 520, 715, 0.8); bush(S, 1840, 725, 0.9);
  const seat = stump(S, ...STUMP, 0.85);
  const C = cow(S, ...COW, { look: -6 });
  const Ct = cat(S, STUMP[0], seat, CATK, { look: 8 });
  const D = dish(S, ...DISH, { look: 6 }), Sp = spoon(S, ...SPOON, { look: -6 });
  const Dg = dog(S, ...(o.dog || DOG), { look: -10 });
  return { M, C, Ct, D, Sp, Dg };
};
// Ollie + his shadow (so the shadow can move when he jumps)
const hero = (S, o = {}) => { const n = S.g.children.length, O = ollie(S, o.x || OX, GND, OK, { mouth: o.mouth || "smile", look: o.look ?? 6 }); O.sd = S.g.children[n]; return O; };

// one pass. c = clip of "<who>, can you jump too?" (c..c+7 = the 8 sung lines), p = 0 cow, 1 cat, 2 dog, 3 Ollie; scene a..b
const SOUND = ["MOO!", "MEOW!", "WOOF!", "FLAP!"];
const pass = (p, c, a, b) => {
  const S = scene(a, b, { cam: "none" }), L = (i) => c + i;
  const F = set(S, { dog: p === 3 ? [1790, 935, 0.55] : DOG });
  const O = hero(S, { look: p === 1 ? -10 : 8 });
  O.bob(a + 0.3, W(L(5), 0) - 0.4, 8);
  singLine(O.sing, L(0));                                                          // Ollie asks
  // the answer: the friend hops and says its sound; a sound card pops up beside it
  const who = [F.C, F.Ct, F.Dg, O][p], whoXY = [[COW[0], COW[1] - 260], [STUMP[0], 520], [DOG[0], 690], [OX, 300]][p];
  if (p < 3) { singLine(who.say, L(1)); who.hop(W(L(1), 0), 40); who.hop(W(L(1), 1), 40); }
  else { singLine(O.sing, L(1)); [1, 2, 3, 4, 5, 6, 7, 8].forEach((n) => O.raise(O.arms[n - 1], 60, W(L(1), 0) - 0.3, 0.4)); O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], W(L(1), 0), WE(L(1), 4), 24, BEAT / 2); O.arms.forEach((A) => O.raise(A, 0, WE(L(1), 4), 0.5)); }
  card(S, SOUND[p], whoXY[0], whoXY[1], W(L(1), 0), WE(L(1), 4) + 0.6);
  // "Play, play the fiddle! Hey diddle diddle, the cat and the fiddle": the cat plays, everyone sways
  F.Ct.play(W(L(2), 0), WE(L(4), 4)); singLine(F.Ct.say, L(4));
  O.wiggle([1, 2, 7, 8], W(L(2), 0), WE(L(4), 4), 12, BEAT);
  F.Dg.sway(W(L(2), 0), WE(L(4), 4), 4); F.D.sway(W(L(3), 0), WE(L(4), 4), 6); F.Sp.sway(W(L(3), 0), WE(L(4), 4), -6);
  // "The cow jumped over the moon": the cow sails over, and this pass's friend jumps right behind her
  const tj = W(L(5), 1), dj = Math.max(1.8, WE(L(5), 5) - tj + 0.2);
  F.C.say(tj, tj + 0.5);
  jump(S, F.C, tj, dj, ...LAND, MOON[0], MOON[1] - MOON[2] - 25);
  if (p === 1) jump(S, F.Ct, tj + 0.5, dj + 0.4, LAND[0] - 190, LAND[1] + 10, MOON[0], MOON[1] - MOON[2] - 30);
  if (p === 2) jump(S, F.Dg, tj + 0.5, dj, COW[0] + 40, COW[1] + 5, MOON[0], MOON[1] - MOON[2] - 30);
  if (p === 3) { // Ollie flaps all 8 arms and flies up over the moon, shrinking into the sky, then lands on the right
    const t0 = tj + 0.4, d = dj + 0.6, x1 = 1500;
    O.arms.forEach((A) => O.raise(A, 70, t0 - 0.4, 0.4)); O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], t0, t0 + d, 26, BEAT / 2); O.arms.forEach((A) => O.raise(A, 0, t0 + d, 0.5));
    const f = (MOON[0] - OX) / (x1 - OX), ea = Math.log(f) / Math.log(0.5);
    tl.fromTo(O.pos, { attr: { transform: `translate(${OX} ${GND}) scale(${OK})` } }, { attr: { transform: `translate(${x1} ${GND}) scale(${OK})` }, duration: d, ease: (q) => q ** ea, immediateRender: false }, t0);
    tw(O.size, t0, d, "translate(0 0) scale(1)", `translate(0 ${-(GND - (MOON[1] - MOON[2] - 30)) / OK}) scale(0.3)`, hump(1)); // up (and smaller, far away) and back down
    S.fadeOut(O.sd, t0, 0.3); DS.shadow(S, x1, GND, 600 * OK, { t: t0 + d - 0.3 });
    O.grin(t0 + d);
  }
  F.M.open(tj + dj * 0.4, tj + dj * 0.7);
  // "The little dog laughed to see such sport": the dog giggles and wags; Ollie laughs too
  F.Dg.laugh(W(L(6), 0), WE(L(6), 7)); O.sing(W(L(6), 1), WE(L(6), 2));
  // "And the dish ran away with the spoon": they wave, then run off hand in hand (left in pass 4: Ollie landed on the right)
  singLine(O.sing, L(7));
  const tr = W(L(7), 2);
  runAway(S, F.D, F.Sp, tr, Math.min(3.2, b - tr - 0.2), p === 3 ? -1400 : 900, 900, 0.32);
  // camera: wide (ask + answer) -> the cat and Ollie (fiddle) -> wide (the jump + the laugh) -> Ollie + the dish and spoon (tag)
  view(S, 560, 600, 1.4, W(L(2), 0) - 0.6);
  wide(S, W(L(5), 0) - 0.6);
  view(S, p === 3 ? 1240 : 950, 640, 1.3, W(L(7), 0) - 0.7);
  front(S);
  DS.vignette(S);
};

// intro (0..b): night on the hill; the moon fades in on "moon" and smiles; title card; Ollie looks up and waves; slow push to the moon
const intro = (b, c) => {
  const S = scene(0, b, { cam: "none" });
  const F = set(S, { moonT: c ? W(c, 4) - 0.3 : 1.6 });
  const O = hero(S, { look: 10 });
  O.bob(0.4, b - 0.2, 8);
  if (c) singLine(O.sing, c);
  const A = arm(O, 0, -1); O.raise(A, 120, 2.2, 0.6); tw(A.wig, 2.8, b - 3.6, `rotate(0 ${A.x} ${A.y})`, `rotate(-14 ${A.x} ${A.y})`, wave(cyc(b - 3.6, BEAT * 2))); O.raise(A, 0, b - 0.8, 0.6);
  F.Ct.play(0.6, b - 0.4); F.Dg.sway(0.6, b - 0.4, 3);
  card(S, "HEY DIDDLE DIDDLE", 820, 150, 0.4, Math.min(b - 1, 5.5));
  view(S, 1100, 420, 1.25, 1.2, Math.max(2, b - 2.6));
  front(S);
  DS.vignette(S);
};

// finale (a..TOTAL): everyone on the hill, Bibi too. C: clips { jump, over, moo, now, hey, mid, we, bye }
const finale = (C, a) => {
  const S = scene(a, TOTAL, { cam: "none" });
  hill(S);
  const M = moon(S, 960, 210, 95);
  bush(S, 160, 715, 0.8); bush(S, 1780, 725, 0.9);
  const Cw = cow(S, 1530, 790, 0.5, { look: -6 }), Ct = cat(S, 1270, 800, 0.5, { look: -6, fiddle: false });
  const Dg = dog(S, 1720, 935, 0.55, { look: -8 });
  const D = dish(S, 300, 945, 0.5, { look: 6 }), Sp = spoon(S, 405, 945, 0.5, { look: 6 });
  const wB = S.grp(); DS.shadow(S, 600, GND, 260 * 0.66, { parent: wB });
  const B = bibi(S, 600, GND - 325 * 0.66, { k: 0.66, mood: "joy" }); wB.appendChild(B.g);
  const O = hero(S, { x: 960, look: 0, mouth: "grin" });
  O.bob(a + 0.3, TOTAL - 0.3, 8);
  const hopAll = (t, h = 40) => { [Cw, Ct, Dg, D, Sp].forEach((A, i) => A.hop(t + i * 0.06, h * 0.8)); O.hop(t, h); tw(B.g, t, 0.5, "translate(0 0)", `translate(0 ${-h})`, hump(1)); };
  // "Jump, jump, one, two, three": everyone hops, numbers on the count
  [0, 1].forEach((i) => hopAll(W(C.jump, i)));
  [2, 3, 4].forEach((wi, i) => { hopAll(W(C.jump, wi)); card(S, String(i + 1), 640 + i * 320, 170, W(C.jump, wi), WE(C.over, 4) - 0.2, DS.type.display); });
  singLine(O.sing, C.jump); singLine(O.sing, C.over);
  // "Over the moon with me": Ollie and Bibi do a big hop
  O.hop(W(C.over, 0), 120, 0.9); tw(B.g, W(C.over, 0) + 0.1, 0.9, "translate(0 0)", "translate(0 -110)", hump(1));
  // "Moo, moo, says the cow": the cow sings; "We all jump now!": all hop
  singLine(Cw.say, C.moo); Cw.hop(W(C.moo, 0), 50); Cw.hop(W(C.moo, 1), 50);
  [0, 2].forEach((wi) => hopAll(W(C.now, wi), 50));
  // "Hey diddle diddle, jump in the middle!": Ollie in the middle jumps, all 8 arms up
  singLine(O.sing, C.hey); singLine(O.sing, C.mid);
  O.arms.forEach((A) => O.raise(A, 70, W(C.mid, 0) - 0.4, 0.4)); O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], W(C.mid, 0), WE(C.mid, 3), 24, BEAT / 2); O.arms.forEach((A) => O.raise(A, 0, WE(C.mid, 3), 0.5));
  O.hop(W(C.mid, 0), 90, 0.8); O.hop(W(C.mid, 3), 90, 0.8);
  // "We jumped over the moon": the moon sings along; "Bye-bye, dish and spoon!": everyone waves, the pair runs off
  singLine(M.open, C.we); singLine(O.sing, C.we); singLine(O.sing, C.bye);
  hearts(S, W(C.we, 0), [[620, 420, 1], [1300, 380, 1.2], [1660, 470, 0.9]]);
  const bye = W(C.bye, 0);
  [arm(O, 0, 1), arm(O, 0, -1)].forEach((A) => O.raise(A, 125, bye - 0.6, 0.6));
  O.wiggle([1, 2], bye, TOTAL - 0.5, 14, BEAT);
  D.say(bye, bye + 1); Sp.say(bye, bye + 1);
  runAway(S, D, Sp, WE(C.bye, 3) + 0.6, 3.2, -700, 900, 0.3);
  const end = Math.min(TOTAL - 4.5, WE(C.bye, 3) + 1.2);
  card(S, "BYE-BYE!", 1450, 170, end, TOTAL + 1);
  S.text("Tiny Tune Town", 560, 170, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: end + 0.6 });
  // camera: wide (count) -> the cow (moo) -> wide (all jump) -> Ollie's face (middle) -> wide (the moon, bye-bye)
  view(S, 1500, 640, 1.55, W(C.moo, 0) - 0.6); wide(S, W(C.now, 0) - 0.5);
  view(S, 960, 560, 1.45, W(C.hey, 0) - 0.6); wide(S, W(C.we, 0) - 0.6);
  front(S);
  DS.vignette(S);
};

// ---------- timeline (filled in from the chosen take: clip numbers = script.json lines) ----------
