// look: still
// @include ../../tools/cast.js
// 23 Potty Time (original). A gentle routine, one step per pass, nothing gross ever shown: playroom (Ollie wiggles, a thought bubble
// shows the potty, he tells a grown-up) -> bathroom: pants (little blue shorts) come off and onto the stool, a grown-up's hand lifts the
// potty lid -> Ollie sits and taps his feet -> a paper sheet pats, shorts back up -> toilet: he presses the flush lever, a water swirl
// in a round window, wave bye-bye, a gold star on the sticker chart -> sink: soap, splash, towel -> happy dance with Bibi, last star.
// Camera per pass: wide (slot word) -> mid (rhyme line) -> insert on the prop ("step by step") -> face close-up on the tag "Potty time, hooray!".
// ---- take remap (planned line -> sung clip number, or {t: seconds} for a break the singer dropped) ----
const PLAN = [null, 1, 3, 4, 5, 6, 7, 8, 9, 10, {"t": 47.253}, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 34, 35, 36];
const PWN = (c) => TIMING.words.filter((x) => x[0] === PLAN[c]).length;
const PW = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + i * 0.3 : W(PLAN[c], Math.min(i, PWN(c) - 1)));
const PCLIP = (c) => (typeof PLAN[c] === "object" ? [PLAN[c].t, PLAN[c].t + 1.2] : CLIP(PLAN[c]));
const PWE = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + 0.4 + i * 0.3 : WE(PLAN[c], Math.min(i, PWN(c) - 1)));

BEAT = 60 / 94;
// clip numbers in script.json: 1 intro, 2-5 tell, 6-9 pants, 10 break, 11-14 sit, 15-18 wipe, 19 break, 20-23 flush, 24-27 wash, 28-33 dance, 34 outro
const PS = [[2, 3, 4, 5], [6, 7, 8, 9], [11, 12, 13, 14], [15, 16, 17, 18], [20, 21, 22, 23], [24, 25, 26, 27]], CH = [28, 29, 30, 31, 32, 33];
const tagEnd = (L) => PCLIP(L[3])[1];
// a pass scene starts 0.6 s after the previous tag, unless a spoken break sits between: then the break stays with the previous scene
const T0 = PS.map((L, p) => p === 0 ? PW(L[0], 0) - 0.6 : (PW(L[0], 0) - tagEnd(PS[p - 1]) > 6 ? PW(L[0], 0) - 0.6 : Math.min(tagEnd(PS[p - 1]) + 0.6, PW(L[0], 0) - 0.6)));
const T_CH = tagEnd(PS[5]) + 0.6, T_OUT = PW(34, 0) - 0.6;

// ---------- camera: centre (x, y) at zoom k (clamped to the drawn room, so edges never show) ----------
const look = (S, x, y, k, t, dur = 1.3) => {
  if (k <= 1.001) return S.zoom(960, 540, 1, t, dur);
  const hw = 960 / k, hh = 540 / k;
  x = Math.min(Math.max(x, -200 + hw), 2120 - hw); y = Math.min(Math.max(y, -200 + hh), 1280 - hh);
  S.zoom((x * k - 960) / (k - 1), (y * k - 540) / (k - 1), k, t, dur);
};
const wide = (S, t, dur) => look(S, 960, 540, 1, t, dur);
const mid = (S, t, x = 960) => look(S, x, 560, 1.3, t);
const close = (S, t, x = 960, y = 484) => look(S, x, y, 1.6, t);
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const singLine = (O, c) => { const n = TIMING.words.filter((w) => w[0] === PLAN[c]).length; for (let i = 0; i < n; i++) O.sing(PW(c, i), Math.min(PWE(c, i), i + 1 < n ? PW(c, i + 1) - 0.05 : PWE(c, i))); };
const card = (S, str, t, t1, x = 960, y = 170, size = DS.type.title) => { const C = DS.card(S, str, x, y, { size, t }); S.fadeOut(C.g, t1, 0.4); return C; };
const twinkle = (S, O, t) => [[-190, -150], [190, -170], [-170, 140], [170, 130]].forEach(([dx, dy], i) => sparkle(S, O.face[0] + dx, O.face[1] + dy, t + i * 0.15, 0.9));
// three numbered bubbles float up on "one, two, three" (clip c, first = index of "one")
const count3 = (S, c, first, x0 = 1300) => [[x0, 480], [x0 + 160, 400], [x0 + 320, 480]].forEach(([x, y], i) => {
  const t = PW(c, first + i) - 0.1, g = G(S, null, "translate(0 0)");
  S.draw(circ(x, y, 66), S.start, 0, { c: DS.c("blue", 1), w: DS.w.mid, fill: DS.c("sky", 1), parent: g, op: 0.95 });
  S.fill(circ(x - 24, y - 24, 15), S.start, 0, DS.P.white[0], 0.95, g);
  S.text(String(i + 1), x, y + 36, { size: DS.type.display, t: S.start, c: DS.c("blue", 2), parent: g });
  fadeIn(S, g, t); tw(g, t, 3, "translate(0 0)", "translate(0 -40)", "sine.inOut");
  S.fadeOut(g, PCLIP(c)[1] + 0.3, 0.4);
});

// ---------- the grown-up's helping hand: sleeve + hand reaching in from the right edge ----------
const OFF = "translate(900 260)";
const helper = (S, hx, hy) => {
  const g = G(S, null, OFF), hand = G(S, G(S, g, `translate(${hx} ${hy})`), "rotate(0)");
  DS.shape(S, cap(2700, hy + 360, hx + 70, hy + 20, 58), "orange", { parent: g });
  DS.shape(S, rrect(hx + 40, hy - 40, 50, 120, DS.r.sm), "orange", { parent: g, tone: 1, w: "mid" });     // cuff
  DS.shape(S, circ(0, 20, 62, 54), "dusk", { parent: hand });
  DS.shape(S, cap(-40, -6, -78, -30, 18), "dusk", { parent: hand, w: "mid" });                            // thumb
  return { g, hand, hx, hy, at: OFF };
};
const tilt = (H, t, a0, a1, dur = 0.5) => tw(H.hand, t, dur, `rotate(${a0})`, `rotate(${a1})`);
const handTo = (H, t, xy, dur = 0.8) => { const to = xy ? `translate(${K(xy[0] - H.hx)} ${K(xy[1] - H.hy)})` : OFF; tw(H.g, t, dur, H.at, to); H.at = to; };

// ---------- props ----------
// the potty (grass green, white rim): back rest goes behind Ollie, front bowl in front; lid hides the seat hole unless open
const pottyBack = (S, x, gy, k, parent) => DS.shape(S, rrect(x - 96 * k, gy - 250 * k, 192 * k, 190 * k, 44 * k), "grass", { parent });
const pottyFront = (S, x, gy, k, o = {}) => {
  const p = o.parent;
  DS.shape(S, `M${K(x - 138 * k)} ${K(gy - 128 * k)} H${K(x + 138 * k)} Q${K(x + 142 * k)} ${K(gy - 18 * k)} ${K(x + 84 * k)} ${K(gy - 2 * k)} H${K(x - 84 * k)} Q${K(x - 142 * k)} ${K(gy - 18 * k)} ${K(x - 138 * k)} ${K(gy - 128 * k)} Z`, "grass", { parent: p });
  DS.shape(S, circ(x, gy - 128 * k, 150 * k, 32 * k), "white", { parent: p, w: "mid" });
  S.fill(circ(x, gy - 128 * k, 104 * k, 17 * k), S.start, 0, DS.c("gray", 2), 1, p);                      // the seat opening (clean and shallow)
  if (o.open) return null;
  const lid = S.grp(p);
  DS.shape(S, circ(x, gy - 134 * k, 142 * k, 27 * k), "white", { parent: lid, w: "mid" });
  S.fill(circ(x - 40 * k, gy - 140 * k, 50 * k, 7 * k), S.start, 0, DS.P.white[0], 0.9, lid);
  return lid;
};
const stool = (S, x, gy) => { DS.shadow(S, x, gy, 220); DS.shape(S, rrect(x - 96, gy - 170, 192, 30, DS.r.sm), "wood", { w: "mid" });
  [-1, 1].forEach((s) => DS.shape(S, cap(x + s * 74, gy - 144, x + s * 90, gy - 4, 10), "wood", { w: "detail" })); return [x, gy - 170]; };
// little blue shorts hanging from (x, y) (the held waist), drawn in absolute coords so popIn/tw work on the returned group
const shorts = (S, x, y, parent, k = 1) => { const g = S.grp(parent);
  DS.shape(S, `M${K(x - 62 * k)} ${K(y)} H${K(x + 62 * k)} L${K(x + 70 * k)} ${K(y + 112 * k)} H${K(x + 8 * k)} L${K(x)} ${K(y + 54 * k)} L${K(x - 8 * k)} ${K(y + 112 * k)} H${K(x - 70 * k)} Z`, "blue", { parent: g, w: "mid" });
  DS.shape(S, rrect(x - 66 * k, y - 4 * k, 132 * k, 26 * k, 8 * k), "yellow", { parent: g, w: "detail" }); return g; };
const paper = (S, x, y, parent) => { const g = S.grp(parent); DS.shape(S, rrect(x - 40, y - 50, 80, 100, DS.r.xs), "white", { parent: g, w: "detail" });
  S.draw(`M${x - 24} ${y - 22} H${x + 24} M${x - 24} ${y} H${x + 24} M${x - 24} ${y + 22} H${x + 24}`, S.start, 0, { c: DS.c("gray", 1), w: DS.w.hair, parent: g }); return g; };
const roll = (S, parent) => { DS.shape(S, rrect(-52, -50, 104, 100, DS.r.sm), "white", { parent, w: "mid" }); S.draw("M-52 -20 H52 M-52 20 H52", S.start, 0, { c: DS.c("gray", 1), w: DS.w.hair, parent }); DS.shape(S, circ(0, 0, 18), "dusk", { parent, flat: true, w: "detail" }); };
// a gold star (sticker): poly of 10 points around (x, y)
const gstar = (S, x, y, r, t) => { const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r * 0.48 : r; return [K(x + Math.cos(a) * q), K(y + Math.sin(a) * q)]; });
  const [g, in_] = popIn(S, t, x, y); DS.shape(S, poly(pts) + " Z", "yellow", { parent: in_, w: "mid" }); return g; };
// the sticker chart on the wall: 6 empty rings, the first n stars given as [x, t] pops
const CH_X = [1560, 1640, 1720], CH_Y = [230, 316];
const chart = (S, stars) => { DS.shape(S, rrect(1510, 150, 250 + 40, 230, DS.r.md), "white", { layer: "mid", w: "mid" });
  CH_Y.forEach((y) => CH_X.forEach((x) => S.draw(circ(x, y, 28), S.start, 0, { c: DS.c("gray", 0, "mid"), w: DS.w.detail })));
  stars.forEach(([i, t]) => gstar(S, CH_X[i % 3], CH_Y[Math.floor(i / 3)], 34, t)); };
// the playroom: pale blue walls, rug, a window, a toy tower
const playroom = (S) => { DS.room(S, { wall: "sky", floor: "floor", window: [1300, 150, 250, 290] });
  DS.frame(S, 470, 230, 170, 130, "grass"); DS.rug(S, 960, 905, 1180, "red");
  [["red", 540, 840], ["yellow", 640, 840], ["grass", 590, 750]].forEach(([c, x, y]) => DS.shape(S, rrect(x - 50, y - 50, 100, 100, DS.r.xs), c, { w: "mid" }));
  DS.shape(S, circ(1400, 850, 46), "orange", { w: "mid" }); S.draw("M1360 836 Q1400 880 1440 836", S.start, 0, { c: DS.P.white[0], w: DS.w.detail }); };
// thought bubble above (x, y) with a potty inside
const thought = (S, x, y, t, t1) => { const g = G(S, null, "translate(0 0)");
  [[x - 120, y + 120, 12], [x - 90, y + 80, 18]].forEach(([cx, cy, r]) => S.draw(circ(cx, cy, r), S.start, 0, { fill: DS.P.white[0], c: DS.c("gray", 0), w: DS.w.detail, parent: g }));
  S.draw(circ(x, y, 150, 120), S.start, 0, { fill: DS.P.white[0], c: DS.c("gray", 0), w: DS.w.mid, parent: g });
  const ic = S.grp(g); pottyBack(S, x, y + 80, 0.7, ic); pottyFront(S, x, y + 80, 0.7, { parent: ic, open: true });
  fadeIn(S, g, t); S.fadeOut(g, t1, 0.4); tw(g, t, t1 - t, "translate(0 0)", "translate(0 -14)", hump(2)); return g; };

// the bathroom: Ollie centre, optional Bibi cheering on the left; draw(O, B) runs right after Ollie (potty back rest first).
const BATH = (S, o = {}, draw) => {
  DS.room(S, BATH_ROOM); bathWall(S, { towel: false });
  const seat = o.stool === false ? null : stool(S, 1470, 905);
  if (o.potty !== false) pottyBack(S, 960, 905, 1.5);
  const B = o.bibi === false ? null : bibi(S, 560, 640, { k: 0.6, mood: o.mood, paws: [[498, 748], [640, 748]] });
  const O = ollie(S, 960, 880, 1.2, { mouth: o.mouth || "smile", look: o.look || 0 });
  if (o.lift) O.lift(o.lift, S.start, 0.01);
  if (draw) draw(O, B, seat);
  const lid = o.potty === false ? null : pottyFront(S, 960, 905, 1.5, { open: o.open });
  return { O, B, lid, seat };
};
const cheer = (S, B, t0, t1) => swing(S, B.R, t0, t1, { rotation: -14, svgOrigin: B.R.sh }, BEAT);

// 0  intro (playroom): Ollie plays, wiggles on "Ooh!", a thought bubble shows the potty on "need to go"
{ const S = scene(0, T0[0], { cam: "none" });
  playroom(S);
  const B = bibi(S, 560, 530, { k: 0.6, mood: "joy", paws: [[498, 640], [640, 640]] });
  const O = ollie(S, 960, 880, 1.2, { mouth: "smile", look: 8 });
  O.bob(S.start + 0.3, S.end, 8); O.wiggle([1, 2, 7, 8], 2.6, S.end, 12, BEAT / 2);
  singLine(O, 1);
  cheer(S, B, 1, S.end - 0.3);
  wide(S, S.start, 0.01);
  DS.vignette(S); }

// 1  TELL: "Hey, I need to go!" one arm up, the grown-up's hand comes in and meets it; close-up on the tag
{ const L = PS[0], t0 = T0[0], t1 = T0[1], S = scene(t0, t1, { cam: "none" });
  playroom(S);
  const B = bibi(S, 560, 530, { k: 0.6, mood: "joy", paws: [[498, 640], [640, 640]] });
  const O = ollie(S, 960, 880, 1.2, { mouth: "smile" });
  const A = arm(O, 0, -1);
  O.bob(t0 + 0.3, PW(L[2], 0) - 0.2, 8); singLine(O, L[2]); singLine(O, L[3]);
  O.wiggle([1, 2, 7, 8], t0, PW(L[1], 0), 10, BEAT / 2);
  O.raise(A, 58, PW(L[0], 2) - 0.4, 0.6);                                     // "Hey!"
  const tip = O.at(O.tipNow(A));
  O.wiggle([1, 2], PW(L[2], 0), tagEnd(L), 12, BEAT);
  const H = helper(S, 1250, 330);
  handTo(H, PW(L[1], 2), [tip[0] + 60, tip[1] + 30], 1.0);                    // "my grown-up": the hand arrives and holds his
  tilt(H, PW(L[1], 3), 0, -12, 0.6);
  cheer(S, B, PW(L[1], 0), tagEnd(L));
  thought(S, 1180, 250, PW(L[0], 4) - 0.1, PW(L[0], 6) + 1.2);
  card(S, "TELL!", PW(L[0], 3), PW(L[1], 0) - 0.95);
  sparkle(S, tip[0] + 60, tip[1] - 40, PW(L[1], 4), 0.8);
  wide(S, t0, 0.01); mid(S, PW(L[1], 0) - 0.5); look(S, 1160, 420, 1.3, PW(L[2], 0) - 0.6); close(S, PW(L[3], 0) - 0.6);
  twinkle(S, O, PW(L[3], 2));
  DS.vignette(S); }

// 2  PANTS: little blue shorts in his hand, lowered on "down", numbered bubbles on one-two-three, a helping hand lifts the potty lid; "Good job!"
{ const L = PS[1], t0 = T0[1], t1 = T0[2], S = scene(t0, t1, { cam: "none" });
  let sg;
  const { O, B, lid, seat } = BATH(S, { lift: -30, mood: "joy" }, (O, B, seat) => {
    const a = arm(O, 3, -1); O.holdAt(a, -300, t0, 0.01);
    O.bob(t0 + 0.3, t1 - 0.5, 8); singLine(O, L[2]); singLine(O, L[3]);
    O.wiggle([1, 2, 7, 8], PW(L[2], 0), tagEnd(L), 12, BEAT);
    const tp = O.at(O.tipNow(a));
    sg = shorts(S, tp[0], tp[1] + 6, null);
    tl.fromTo(sg, { opacity: 0 }, { opacity: 1, duration: 0.4 }, PW(L[0], 0) - 0.2);
    tw(sg, PW(L[0], 1), 0.8, "translate(0 0)", "translate(0 90)");                // "down": arm and shorts lower together
    O.holdAt(a, -230, PW(L[0], 1), 0.8);
    tw(sg, PW(L[1], 0) - 0.2, 1.2, "translate(0 90)", `translate(${K(seat[0] - tp[0])} ${K(seat[1] - tp[1] - 50)}) scale(0.9)`, "power2.inOut");   // onto the stool
    O.holdAt(a, 0, PW(L[1], 0) - 0.2, 1.0);
  });
  const H = helper(S, 1250, 420);
  handTo(H, PW(L[1], 0) - 0.6, null); handTo(H, PW(L[1], 2) - 0.4, [1100, 700], 0.9); handTo(H, PW(L[1], 3) + 0.6, null, 0.9);
  tilt(H, PW(L[1], 2) + 0.4, 0, -30, 0.5);
  S.fadeOut(lid, PW(L[1], 2) + 0.3, 0.5);                                         // lid lifted away
  cheer(S, B, t0 + 1, tagEnd(L) + 8);
  count3(S, L[0], 2, 1280);
  card(S, "PANTS", PW(L[0], 1), PW(L[1], 0) - 0.95);
  wide(S, t0, 0.01); mid(S, PW(L[1], 0) - 0.5, 1100); look(S, 1150, 520, 1.3, PW(L[2], 0) - 0.6); close(S, PW(L[3], 0) - 0.6);
  twinkle(S, O, PW(L[3], 2));
  wide(S, tagEnd(L) + 0.6); look(S, 700, 560, 1.3, tagEnd(L) + 5.8);          // "Good job!": Bibi claps
  hearts(S, PW(10, 0), [[640, 520, 0.9], [740, 480, 0.7], [560, 470, 0.7]]);
  DS.vignette(S); }

// 3  SIT: lid off, Ollie settles onto the potty and taps his feet (arm tips on the floor); a star-bright smile on the tag
{ const L = PS[2], t0 = T0[2], t1 = T0[3], S = scene(t0, t1, { cam: "none" });
  const { O, B, seat } = BATH(S, { open: true, lift: -30, mood: "joy" }, (O, B, seat) => {
    O.lift(34, PW(L[0], 0) - 0.3, 0.9);                                              // "sit"
    O.bob(t0 + 0.3, PW(L[0], 0) - 0.5, 8);
    singLine(O, L[2]); singLine(O, L[3]);
    O.wiggle([1, 2, 7, 8], PW(L[1], 0), PW(L[2], 0), 14, BEAT / 2);                    // tap, tap, tap
    O.wiggle([1, 2], PW(L[2], 0), tagEnd(L), 10, BEAT);
    shorts(S, seat[0], seat[1] - 6, null, 0.9);
  });
  cheer(S, B, t0 + 1, tagEnd(L));
  card(S, "SIT", PW(L[0], 1), PW(L[1], 0) - 0.95);
  wide(S, t0, 0.01); mid(S, PW(L[1], 0) - 0.5); look(S, 960, 700, 1.3, PW(L[2], 0) - 0.6); close(S, PW(L[3], 0) - 0.6, 960, 500);
  twinkle(S, O, PW(L[3], 2));
  DS.vignette(S); }

// 4  WIPE: the hand passes a roll, a paper sheet pats on the beat, then the shorts come back up: "just like that!"
{ const L = PS[3], t0 = T0[3], t1 = T0[4], S = scene(t0, t1, { cam: "none" });
  let pg;
  const { O, B, seat } = BATH(S, { open: true, lift: 4 }, (O, B, seat) => {
    O.bob(t0 + 0.3, PW(L[1], 0) - 0.3, 6);
    const a = arm(O, 2, -1), a2 = arm(O, 3, 1);
    O.holdAt(a, -90, PW(L[0], 0) - 0.6, 0.6);
    const tp = O.at(O.tipNow(a));
    pg = paper(S, tp[0] + 20, tp[1] - 10, null); tl.fromTo(pg, { opacity: 0 }, { opacity: 1, duration: 0.4 }, PW(L[0], 0) - 0.2);
    swing(S, pg, PW(L[0], 2) - 0.1, PW(L[0], 4) + 0.5, { y: 14 }, BEAT / 2);                // pat, pat, pat
    S.fadeOut(pg, PW(L[1], 0) - 0.3, 0.4);
    O.holdAt(a, 0, PW(L[1], 0) - 0.4, 0.7);
    O.lift(-30, PW(L[1], 0) - 0.3, 0.9);                                                // stands up for "pants up"
    O.holdAt(a2, -330, PW(L[1], 0) - 0.5, 0.6);
    const tp2 = O.at(O.tipNow(a2)), sh = shorts(S, tp2[0], tp2[1] + 4, null);
    tl.fromTo(sh, { opacity: 0 }, { opacity: 1, duration: 0.4 }, PW(L[1], 0) - 0.2);
    tw(sh, PW(L[1], 2), 0.7, "translate(0 0)", "translate(0 -40)", "back.out(1.4)");      // "just like that!" held up high
    singLine(O, L[2]); singLine(O, L[3]);
    O.wiggle([1, 2], PW(L[2], 0), tagEnd(L), 12, BEAT);
    O.grin(PW(L[3], 0), tagEnd(L) + 0.2);
    shorts(S, seat[0], seat[1] - 6, null, 0.9).setAttribute("opacity", 0);
  });
  const H = helper(S, 1250, 420); roll(S, H.hand);
  handTo(H, t0 + 0.05, [1140, 640], 0.8); handTo(H, PW(L[0], 1) + 0.3, null, 0.8);
  cheer(S, B, t0 + 1, tagEnd(L));
  card(S, "WIPE", PW(L[0], 1), PW(L[1], 0) - 0.95);
  wide(S, t0, 0.01); mid(S, PW(L[1], 0) - 0.5, 1060); look(S, 940, 520, 1.3, PW(L[2], 0) - 0.6); close(S, PW(L[3], 0) - 0.6, 960, 500);
  twinkle(S, O, PW(L[3], 2));
  wide(S, tagEnd(L) + 0.6); look(S, 700, 560, 1.3, tagEnd(L) + 5.8);               // "You can do it!"
  hearts(S, PW(19, 0), [[640, 520, 0.9], [740, 480, 0.7], [560, 470, 0.7]]);
  DS.vignette(S); }

// 5  FLUSH: Ollie presses the lever, a round window shows a water swirl, he waves bye-bye and twirls; gold star #1 on the chart
{ const L = PS[4], t0 = T0[4], t1 = T0[5], S = scene(t0, t1, { cam: "none" });
  DS.room(S, BATH_ROOM); bathWall(S, { towel: false });
  const B = bibi(S, 560, 640, { k: 0.6, mood: "joy", paws: [[498, 748], [640, 748]] });
  const O = ollie(S, 880, 880, 1.2, { mouth: "smile" });
  const A = arm(O, 0, -1);
  O.raise(A, 61, t0 + 0.2, 0.01);
  const lev = O.at(O.tipNow(A));                                                    // the lever sits at his fingertip
  O.bob(t0 + 0.3, PW(L[1], 0) - 0.4, 6);
  O.raise(A, 70, PW(L[0], 0) - 0.2, 0.25); O.raise(A, 61, PW(L[0], 0) + 0.15, 0.3);   // press, release
  O.raise(A, 61, PW(L[0], 3) - 0.1, 0.01);
  [arm(O, 0, 1), arm(O, 1, 1)].forEach((a, i) => { O.raise(a, 95 + i * 10, PW(L[1], 0) - 0.2, 0.5); });
  O.wiggle([1, 3], PW(L[1], 0), PW(L[1], 3), 20, BEAT / 2);                           // wave bye-bye
  O.spin(PW(L[1], 3) - 0.1, 1.3);                                                   // twirl
  singLine(O, L[2]); singLine(O, L[3]);
  // the toilet: tank behind, lever at the fingertip, closed lid
  const tx = lev[0] - 30;
  DS.shadow(S, tx + 160, 905, 360);
  DS.shape(S, rrect(tx, lev[1] - 40, 250, 260, DS.r.md), "white");
  DS.shape(S, rrect(tx - 12, lev[1] - 64, 274, 34, DS.r.sm), "white", { w: "mid" });
  DS.shape(S, rrect(tx + 4, lev[1] - 14, 66, 20, DS.r.xs), "gray", { w: "detail" });
  DS.shape(S, `M${tx} ${lev[1] + 220} H${tx + 330} Q${tx + 340} ${lev[1] + 410} ${tx + 250} ${lev[1] + 470} L${tx + 270} 905 H${tx + 60} L${tx + 80} ${lev[1] + 470} Q${tx - 10} ${lev[1] + 410} ${tx} ${lev[1] + 220} Z`, "white");
  DS.shape(S, rrect(tx - 24, lev[1] + 196, 372, 44, DS.r.lg), "white", { w: "mid" });
  // the round window: water swirling (calm, slow)
  const win = G(S, null, "translate(0 0)");
  S.draw(circ(500, 330, 170), S.start, 0, { fill: DS.P.white[0], c: DS.c("blue", 1), w: DS.w.near, parent: win });
  S.draw(circ(500, 330, 140), S.start, 0, { fill: DS.c("sky", 1), c: DS.c("blue", 1), w: DS.w.detail, parent: win });
  const sw = S.grp(win);
  [0, Math.PI].forEach((o) => S.draw(smooth(Array.from({ length: 28 }, (_, i) => { const r = 132 - i * 4.4, a = o + i * 0.34; return [K(500 + Math.cos(a) * r), K(330 + Math.sin(a) * r)]; })), S.start, 0, { c: DS.c("blue", 1), w: DS.w.near, parent: sw }));
  tw(sw, PW(L[0], 0), 3.4, "rotate(0 500 330)", "rotate(-540 500 330)", "power2.out");
  fadeIn(S, win, PW(L[0], 0) - 0.1); S.fadeOut(win, PW(L[1], 0) + 1.0, 0.5);
  chart(S, [[0, PW(L[1], 3) + 1.0]]);
  cheer(S, B, t0 + 1, tagEnd(L) + 8);
  card(S, "FLUSH!", PW(L[0], 1), PW(L[1], 0) - 0.95);
  wide(S, t0, 0.01); mid(S, PW(L[1], 0) - 0.5, 900); look(S, 780, 470, 1.3, PW(L[2], 0) - 0.6); close(S, PW(L[3], 0) - 0.6, 880);
  twinkle(S, O, PW(L[3], 2));
  DS.vignette(S); }

// 6  WASH: soap foam on his hands, splashes under the tap, a hand passes a towel; dry in a flash
{ const L = PS[5], t0 = T0[5], t1 = T_CH, S = scene(t0, t1, { cam: "none" });
  DS.room(S, BATH_ROOM); bathWall(S, { towel: false });
  chart(S, [[0, S.start], [1, tagEnd(L) - 1.0]]);
  const B = bibi(S, 560, 500, { k: 0.72, mood: "joy", paws: [[470, 640], [636, 600]] });
  const O = ollie(S, 880, 900, 1.3, { mouth: "smile" });
  const a1 = arm(O, 3, 1), a2 = arm(O, 3, -1);
  O.holdAt(a1, -220, t0, 0.01); O.holdAt(a2, -220, t0, 0.01);
  O.bob(t0 + 0.3, t1, 6); singLine(O, L[2]); singLine(O, L[3]);
  O.wiggle([1, 2], PW(L[0], 0), tagEnd(L), 10, BEAT / 2);
  const tp = O.at(O.tipNow(a2));
  tapWater(S, PW(L[0], 0) - 0.1, tp[0] + 20, 646, 744);
  [PW(L[0], 3), PW(L[0], 4), PW(L[0], 5)].forEach((t, i) => { foam(S, tp[0] - 10 + i * 20, tp[1] - 20, 3, t); });
  [PW(L[1], 0), PW(L[1], 1), PW(L[1], 2)].forEach((t, i) => drop(S, tp[0] - 20 + i * 36, tp[1] + 40, t, 1.1));
  bathSink(S);
  const H = helper(S, 1250, 420); towel(S, H.hand, 150, 90, "sky");
  handTo(H, PW(L[1], 2) - 0.4, [tp[0] + 90, tp[1] - 20], 0.9); handTo(H, PW(L[2], 0) - 0.3, null, 0.9);
  cheer(S, B, t0 + 1, tagEnd(L));
  card(S, "WASH", PW(L[0], 1), PW(L[1], 0) - 0.95);
  wide(S, t0, 0.01); mid(S, PW(L[1], 0) - 0.5, 1040); look(S, 1050, 500, 1.3, PW(L[2], 0) - 0.6); close(S, PW(L[3], 0) - 0.6, 900, 470);
  twinkle(S, O, PW(L[3], 2));
  DS.vignette(S); }
// hand towel helper (reuse 18's look): a plain folded towel on the hand
function towel(S, parent, w, h, c) { const g = G(S, parent, "translate(0 0)"); DS.shape(S, rrect(-w / 2, -h / 2, w, h, DS.r.md), c, { parent: g, w: "mid" }); S.draw(`M${-w / 2 + 6} ${h / 2 - 26} H${w / 2 - 6} M${-w / 2 + 6} ${h / 2 - 14} H${w / 2 - 6}`, S.start, 0, { c: DS.P.white[0], w: DS.w.detail, parent: g }); return g; }

// 7  DANCE: clap, clap, spin around, stomp, stomp; Bibi joins; the last star on the chart and hearts
{ const S = scene(T_CH, T_OUT, { cam: "none" });
  DS.room(S, BATH_ROOM); bathWall(S, { towel: false });
  chart(S, [[0, S.start], [1, S.start], [2, PW(32, 0) + 0.5]]);
  const B = bibi(S, 560, 640, { k: 0.6, mood: "joy", paws: [[498, 748], [640, 748]] });
  const O = ollie(S, 960, 880, 1.2, { mouth: "grin" });
  O.grin(S.start, S.end); O.bob(S.start + 0.3, S.end, 10);
  [28, 30].forEach((c) => { O.spin(PW(c, 2), 1.4); O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], PW(c, 0), PW(c, 2), 16, BEAT / 2); });
  [29, 31].forEach((c) => { O.hop(PW(c, 0), 60, 0.5); O.hop(PW(c, 1), 60, 0.5); });
  singLine(O, 32); singLine(O, 33);
  O.wiggle([1, 2, 7, 8], PW(32, 0), PCLIP(33)[1], 14, BEAT);
  cheer(S, B, PW(28, 0), PCLIP(33)[1]);
  tw(B.g, PW(29, 0), 0.5, "translate(0 0)", "translate(0 -26)", hump(1)); tw(B.g, PW(29, 1), 0.5, "translate(0 0)", "translate(0 -26)", hump(1));
  card(S, "DANCE!", PW(28, 1), PW(29, 0) - 0.95);
  hearts(S, PW(32, 0), [[700, 540, 1], [1220, 520, 0.9], [800, 480, 0.7], [1120, 470, 0.7]]);
  wide(S, S.start, 0.01); mid(S, PW(29, 0) - 0.5); look(S, 960, 500, 1.2, PW(30, 0) - 0.5); close(S, PW(32, 0) - 0.6);
  twinkle(S, O, PW(33, 2));
  DS.vignette(S); }

// 8  outro: everyone waves bye-bye, "I did it!", the full sticker chart, brand line
{ const S = scene(T_OUT, TOTAL, { cam: "none" });
  DS.room(S, BATH_ROOM); bathWall(S, { towel: false });
  chart(S, [[0, S.start], [1, S.start], [2, S.start]]);
  const B = bibi(S, 560, 640, { k: 0.6, mood: "joy", paws: [[498, 748], [640, 748]] });
  const O = ollie(S, 960, 880, 1.2, { mouth: "grin" });
  O.grin(S.start, TOTAL); O.bob(S.start + 0.3, TOTAL, 8);
  [arm(O, 0, 1), arm(O, 0, -1)].forEach((A) => O.raise(A, 112, S.start + 0.5, 0.6));
  O.wiggle([1, 2], S.start + 1.2, TOTAL, 14, BEAT);
  cheer(S, B, S.start + 1, TOTAL - 0.3);
  hearts(S, S.start + 1.2, [[700, 540, 1], [1220, 520, 0.9], [800, 480, 0.7], [1120, 470, 0.7]]);
  glow(S, S.start);
  close(S, S.start + 0.2); wide(S, TOTAL - 5.5);
  S.text("Tiny Tune Town", 960, 140, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: TOTAL - 4 });
  DS.vignette(S); }
