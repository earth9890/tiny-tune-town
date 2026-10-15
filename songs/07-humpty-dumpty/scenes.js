// look: still
// @include ../../tools/cast.js
// @include garden.js
// 07 Humpty Dumpty (traditional). A sunny garden: Humpty, a friendly egg, sits on a low wall. Pass 1 he wobbles and tumbles softly
// onto the grass ("oops!", a tiny crack); pass 2 Bibi brings the first-aid tin; the break puts a bandage on; pass 3 he tries the wall
// and plops down again; pass 4 hugs; the chorus "lift him up": Ollie's arms put him back on the wall and everyone cheers.
// Camera: wide at each pass, Humpty or the two-shot on lines 2-3, Ollie's face close-up on every tag line. No hard cuts, nothing under 4 s.
BEAT = 60 / 98;
const OX = 1100, OK = 1.05, FACE = [OX, GY7 - 330 * OK], SEAT = [560, WALL.top + 2], GRASS = [660, GY7 - 58];
// centre (x, y) on screen at zoom k (S.zoom scales about a fixed point; pick the point that lands (x, y) at the centre)
const view = (S, x, y, k, t, dur = 1.3) => (k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const wide = (S, t) => view(S, 960, 540, 1, t);
const close = (S, t, f = FACE) => view(S, f[0] - 60, f[1] + 30, 1.6, t);      // Ollie's face fills ~half the height, Humpty peeks in on the left
const two = (S, t, x = 860) => view(S, x, 600, 1.3, t);
const onH = (S, H, t, k = 1.6) => view(S, H.x + 40, H.y - 110 * H.k, k, t);
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const singLine = (O, c) => TIMING.words.filter((w) => w[0] === c).forEach((w) => O.sing(w[3], w[3] + 0.6 * (w[4] - w[3])));   // mouth opens on each sung word
const twinkle = (S, x, y, t) => [[-110, -60, 0.8], [120, -80, 1], [-40, -150, 0.6], [90, 20, 0.7]].forEach(([dx, dy, r], i) => sparkle(S, x + dx, y + dy, t + i * 0.25, r));
const set = (S, o = {}) => { garden(S); return ollie(S, o.ox || OX, GY7, OK, { mouth: o.mouth || "smile", look: o.look ?? -8 }); };
const hShadow = (S, x, y, t) => DS.shadow(S, x, y, 200, { t });
const pass = (c) => [W(c, 0), W(c + 1, 0), W(c + 2, 0), W(c + 3, 0), WE(c + 3, 4)];
// script.json lines: 1 intro, 2-5 pass 1, 6 "Oops!", 7-10 pass 2, 11 the tag again (bandage break), 12-15 pass 3, 16 "Let's help!",
// 17-20 pass 4, 21 "Big hug!", 22-27 chorus (hug/lift x3), 28-29 outro
const P = [2, 7, 12, 17].map(pass), CH = 22;
const T = [0, P[0][0] - 1.2, P[1][0] - 1.2, P[2][0] - 1.2, P[3][0] + 0.2, W(CH, 0) - 1.2, W(28, 0) - 1.2, TOTAL];
const BIBI = (S, x, o = {}) => { const wrap = S.grp(), B = bibi(S, x, GY7 - 330 * 0.7, Object.assign({ k: 0.7 }, o)); wrap.appendChild(B.g); B.wrap = wrap; return B; };
const OX2 = 1000, FACE2 = [OX2, FACE[1]], TOP = [700, WALL.top + 2];

// 0  intro (0-6.3): Humpty sits on the garden wall and waves hello; Ollie waves back. Title card, then a push in on Humpty
{ const S = scene(T[0], T[1], { cam: "none" });
  const O = set(S, { look: -14 });
  hShadow(S, ...SEAT);
  const H = humpty(S, ...SEAT, { look: 6 });
  H.wave(1, 0.8, WE(1, 2)); H.bob(0.3, T[1], 6); O.bob(0.3, T[1], 8);
  O.raise(arm(O, 0, -1), 110, 1.2, 0.6); O.wiggle([2], 1.8, T[1] - 0.2, 14, BEAT);
  S.fadeOut(DS.card(S, "HUMPTY DUMPTY", 960, 150, { size: DS.type.title, t: 0.2 }).g, 1.9, 0.4);
  view(S, H.x + 40, H.y - 110, 1.45, 2.0, 3.6);   // one slow push in (a single 6 s shot)
  DS.vignette(S); }

// 1  pass 1 (6.3-26.9): sits, wobbles, a soft tumble onto the grass on "great fall" (oops face, tiny crack); Ollie gasps;
//    close-up on the tag, held through "Oops! Oops!" while Humpty giggles on the grass
{ const p = P[0], c = 2, S = scene(T[1], T[2], { cam: "none" });
  const O = set(S, { look: -14 });
  const sh = hShadow(S, ...SEAT), fall = W(c + 1, 4);
  hShadow(S, GRASS[0], GY7 + 8, fall + 0.9);
  const H = humpty(S, ...SEAT, { look: 6 });
  H.bob(p[0], p[1] - 0.3, 8);
  H.wobble(p[1], fall, 10); H.face("oops", W(c + 1, 3));
  S.fadeOut(sh, fall, 0.3); H.tumble(...GRASS, fall); H.crack(fall + 1.0);
  O.sing(p[2], p[2] + 1.4); O.hop(p[2] + 0.2, 40);
  H.face("smile", p[3] - 1); H.face("grin", W(6, 0)); H.wobble(W(6, 0), T[2] - 0.2, 7, 2 * BEAT);
  singLine(O, c + 3);
  onH(S, H, p[1] - 0.6, 1.4); two(S, p[2] - 0.4); close(S, p[3] - 0.5);
  DS.vignette(S); }

// 2  pass 2 + bandage break (26.3-63.3): Bibi hops in with the first-aid tin; a bandage pops out; the bandage goes on the crack
//    (sparkles, a big grin); Ollie sings the tag once more; everybody bounces
{ const p = P[1], c = 7, S = scene(T[2], T[3], { cam: "none" });
  const O = set(S, { look: -14 });
  const B = BIBI(S, 380, { paws: [[300, 760], [460, 760]] });
  aidKit(S, 380, 790, B.g);
  popAt(B.wrap, p[0] + 0.4, 380, 760);
  hShadow(S, GRASS[0], GY7 + 8);
  const H = humpty(S, ...GRASS, { look: -6, crack: true, mouth: "oops" });
  const fix = p[4] + 1.0, [bg, bi] = popIn(S, p[2] + 1.0, 520, 610);       // the bandage pops out of the tin, between Bibi and Humpty
  DS.shape(S, rrect(476, 592, 88, 36, DS.r.sm), "sand", { parent: bi, w: "detail" }); DS.shape(S, rrect(506, 598, 28, 24, DS.r.xs), "earth", { parent: bi, w: "hair", flat: true });
  S.fadeOut(bg, fix, 0.3); H.band(fix + 0.2); H.face("grin", fix + 0.6);
  twinkle(S, H.x + 30, H.y - 230, fix + 0.5);
  H.bob(p[0], p[1], 6);
  singLine(O, c + 3); singLine(O, 11);
  const party = W(11, 0) + 4.6;
  H.armsUp(party); H.bob(party + 0.3, T[3], 10); O.bob(party + 0.3, T[3], 10); swing(S, B.g, party + 0.3, T[3] - 0.3, { y: -10 }, BEAT);
  onH(S, H, p[1] - 0.6, 1.5); two(S, p[2] - 0.4, 600); close(S, p[3] - 0.5); onH(S, H, p[4] + 0.3, 1.8); close(S, W(11, 0) - 0.5); wide(S, party);
  DS.vignette(S); }

// 3  pass 3 (63.3-83.2): bandaged Humpty hops toward the wall... wobble, plop! (a giggle); Bibi cheers; Ollie reaches out an arm
{ const p = P[2], c = 12, S = scene(T[3], T[4], { cam: "none" });
  const O = set(S, { look: -14 });
  const B = BIBI(S, 360, { mood: "joy", paws: [[280, 820], [450, 700]] });
  aidKit(S, 500, 880);
  hShadow(S, GRASS[0], GY7 + 8);
  const H = humpty(S, ...GRASS, { look: -10, band: true, mouth: "grin" }), plop = W(c + 1, 5);
  H.armsUp(p[0] + 0.3); H.hop(p[0] + 0.6, p[1] - 0.2, 4);   // hop, hop, hop, hop
  H.face("oops", W(c + 1, 3)); H.wobble(W(c + 1, 3), plop, 12); tw(H.rock, plop, 0.4, "scale(1 1)", "scale(1.08 0.9)", hump(1));
  H.face("grin", p[2] + 0.4);
  swing(S, B.R, p[2], T[4] - 0.3, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  O.holdAt(arm(O, 0, 1), -140, p[2] + 0.6, 1.0);
  singLine(O, c + 3); O.sing(W(16, 0), WE(16, 1));
  onH(S, H, p[1] - 0.6, 1.4); two(S, p[2] - 0.4, 640); close(S, p[3] - 0.5);
  DS.vignette(S); }

// 4  pass 4 (83.2-T5): hugs. Bibi hugs Humpty (hearts), Ollie wraps an arm round him; "Big hug!": everyone squeezes in
{ const p = P[3], c = 17, S = scene(T[4], T[5], { cam: "none" });
  const O = set(S, { ox: OX2, look: -12 });
  const B = BIBI(S, 470, { mood: "joy", paws: [[390, 820], [560, 760]] });
  hShadow(S, GRASS[0], GY7 + 8);
  const H = humpty(S, ...GRASS, { look: 0, band: true, mouth: "grin" });
  H.bob(T[4] + 0.3, p[1], 6); O.bob(T[4] + 0.3, p[1], 8);
  hearts(S, W(c + 1, 4), [[520, 560, 1.4], [600, 500, 1.1], [460, 480, 1]]);
  O.holdAt(arm(O, 0, 1), -250, p[2], 1.0);
  hearts(S, W(21, 0), [[760, 520, 1.5], [880, 460, 1.2], [640, 440, 1.1], [980, 380, 1]]);
  singLine(O, c + 3);
  two(S, p[1] - 0.6, 640); view(S, 760, 620, 1.35, p[2] - 0.4); close(S, p[3] - 0.5, FACE2); two(S, p[4] + 0.2, 760);
  DS.card(S, "BIG HUG!", 760, 250, { size: DS.type.title, t: W(21, 0) });
  DS.vignette(S); }

// 5  chorus (T5-T6): hug, hug, hug (a heart each), "lift him up": Ollie's arms lift Humpty back onto the wall; everyone cheers
{ const S = scene(T[5], T[6], { cam: "none" });
  const O = set(S, { ox: OX2, look: -12, mouth: "grin" });
  const B = BIBI(S, 420, { mood: "joy", paws: [[330, 820], [520, 640]] });
  const up = W(CH, 4), sh = hShadow(S, GRASS[0], GY7 + 8);
  hShadow(S, ...TOP, up + 1.3);
  const H = humpty(S, ...GRASS, { look: 0, band: true, mouth: "grin" });
  const HUGS = [[330, 430], [1300, 380], [470, 380]];                    // hearts rise clear of the faces
  [0, 1, 2].forEach((i) => hearts(S, W(CH, i), [[...HUGS[i], 1.2]]));
  O.holdAt(arm(O, 0, 1), -170, up - 0.6, 0.6); O.holdAt(arm(O, 1, 1), -120, up - 0.6, 0.6);
  S.fadeOut(sh, up, 0.3); H.move(...TOP, up, 1.4); H.armsUp(up + 1.2);
  O.holdAt(arm(O, 0, 1), -262, up + 1.4, 0.6); O.holdAt(arm(O, 1, 1), -10, up + 1.4, 0.6);
  twinkle(S, TOP[0], TOP[1] - 230, W(CH + 1, 4)); twinkle(S, 960, 300, WE(CH + 1, 4));
  [CH + 2, CH + 4].forEach((c) => [0, 1, 2].forEach((i) => hearts(S, W(c, i), [[...HUGS[i], 1.2]])));
  swing(S, B.R, W(CH + 1, 0), T[6] - 0.3, { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  O.wiggle([2, 4], W(CH + 1, 0), T[6] - 0.3, 12, BEAT); H.bob(W(CH + 1, 0), T[6], 8);
  singLine(O, CH + 3); singLine(O, CH + 5);
  const end = WE(CH + 5, 7) + 0.3;
  twinkle(S, 700, 380, end + 0.6); twinkle(S, 1200, 260, end + 1.4); hearts(S, end + 0.8, [[560, 520, 1.3], [860, 420, 1.2], [1260, 380, 1.1]]);
  view(S, 760, 600, 1.3, S.start, 0.01); view(S, 740, 580, 1.4, up - 0.3, 1.6); view(S, 820, 560, 1.45, W(CH + 1, 0) - 0.4); wide(S, W(CH + 2, 0) - 0.4); close(S, W(CH + 3, 3), FACE2);
  two(S, W(CH + 4, 0) - 0.4, 760); close(S, W(CH + 5, 0) - 0.3, FACE2); wide(S, end); view(S, 860, 600, 1.2, end + 4.5, 2);
  S.fadeOut(DS.card(S, "HOORAY!", 960, 150, { size: DS.type.title, t: end + 0.4 }).g, end + 4.0, 0.4);
  DS.vignette(S); }

// 6  outro (T6-170): Hooray! bye-bye from the wall; Ollie's arm round Humpty, everyone waves; end title
{ const S = scene(T[6], T[7], { cam: "none" });
  const O = set(S, { ox: OX2, look: 0, mouth: "grin" });
  const B = BIBI(S, 420, { mood: "joy", paws: [[330, 820], [520, 640]] });
  hShadow(S, ...TOP);
  const H = humpty(S, ...TOP, { band: true, mouth: "grin" });
  O.holdAt(arm(O, 0, 1), -262);
  [arm(O, 1, -1), arm(O, 0, -1)].forEach((A, i) => O.raise(A, [120, 100][i], S.start + 0.6, 0.6));
  O.wiggle([1, 3], S.start + 1.2, TOTAL - 1, 14, BEAT); O.bob(S.start + 0.5, TOTAL, 8);
  swing(S, B.R, S.start + 0.8, TOTAL - 1, { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  H.wave(1, S.start + 1, TOTAL - 1); H.bob(S.start + 0.5, TOTAL, 6);
  view(S, 760, 600, 1.3, S.start, 0.01); wide(S, S.start + 6); close(S, S.start + 12.5, FACE2); wide(S, S.start + 18.5);
  S.fadeOut(DS.card(S, "BYE-BYE!", 760, 250, { size: DS.type.title, t: W(28, 1) }).g, S.start + 11.8, 0.4);
  S.text("Tiny Tune Town", 960, 130, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: TOTAL - 4.5 });
  DS.vignette(S); }
