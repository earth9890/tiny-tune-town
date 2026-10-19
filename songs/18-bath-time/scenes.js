// look: still
// @include ../../tools/cast.js
// 18 Bath Time Fun (original). Ollie in a big bubble bath: a grown-up's hand pours the bubbles, Ollie pops up out of the suds,
// then one body part per pass (hands -> toes -> tummy -> face, a bubble beard), a rubber duck floats in, Bibi splashes in,
// all eight arms scrub at once, the grown-up rinses him from a cup, the towel dries hands, toes, tummy, nose, then a cosy bed.
// Camera per pass: wide (slot word) -> mid (splash) -> insert on the 1-2-3 bubbles -> face close-up on the tag "Bath time, fun for me!".
BEAT = 60 / 96;
// clip numbers in script.json (the sung take, seed 42): 4 lines per pass, then the finale, the drying verses, the night-night outro
const PS = [[3, 4, 5, 6], [7, 8, 9, 10], [12, 13, 14, 15], [16, 17, 18, 19]], FIN = [20, 21, 22, 23];
const tagEnd = (L) => CLIP(L[3])[1];
// scene starts: 0.6 s after the last tag, or 0.6 s before the next first line when the take runs straight on
const T0 = PS.map((L, p) => p === 0 ? W(L[0], 0) - 0.6 : Math.min(tagEnd(PS[p - 1]) + 0.6, W(L[0], 0) - 0.6));
T0.push(tagEnd(PS[3]) + 0.6);   // finale
const T_DRY = W(24, 0) - 0.6, T_DRY2 = W(27, 0) - 0.6, T_BED = W(34, 0) - 0.6;

// ---------- camera: centre (x, y) at zoom k (clamped to the drawn room, so edges never show) ----------
const look = (S, x, y, k, t, dur = 1.3) => {
  if (k <= 1.001) return S.zoom(960, 540, 1, t, dur);
  const hw = 960 / k, hh = 540 / k;
  x = Math.min(Math.max(x, -200 + hw), 2120 - hw); y = Math.min(Math.max(y, -200 + hh), 1280 - hh);
  S.zoom((x * k - 960) / (k - 1), (y * k - 540) / (k - 1), k, t, dur);
};
const wide = (S, t, dur) => look(S, 960, 540, 1, t, dur);
const mid = (S, t) => look(S, 960, 560, 1.3, t);
const close = (S, t, y = 484) => look(S, 960, y, 1.6, t);

// ---------- the bathroom: back tiles, a big white tub, suds on top ----------
const suds = (S, x0, x1, y, n, parent, t) => {   // a row of foam puffs along the water line
  const g = S.grp(parent);
  for (let i = 0; i < n; i++) { const x = x0 + ((x1 - x0) * (i + 0.5)) / n, r = 30 + ((i * 37) % 22); S.draw(circ(x, y - ((i * 53) % 26), r, r * 0.8), S.start, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.hair, parent: g }); }
  if (t !== undefined) fadeIn(S, g, t);
  return g;
};
const tubBack = (S) => { DS.shadow(S, 960, 912, 1060); S.draw(circ(960, 636, 470, 34), S.start, 0, { fill: DS.c("glass", 2), c: DS.line(), w: DS.w.detail }); };
const tubFront = (S) => {
  [610, 1310].forEach((x) => DS.shape(S, `M${x - 34} 880 L${x + 34} 880 L${x + 22} 922 L${x - 22} 922 Z`, "gold", { w: "mid" }));   // feet
  DS.shape(S, "M500 640 H1420 Q1424 900 1290 900 H630 Q496 900 500 640 Z", "white");
  DS.shape(S, rrect(470, 616, 980, 44, DS.r.lg), "white", { w: "mid" });
  S.fill(rrect(520, 626, 560, 12, DS.r.xs), S.start, 0, DS.P.white[0], 0.9);
};
const tap = (S) => { DS.shape(S, rrect(1386, 470, 40, 150, DS.r.sm), "gray", { w: "mid" }); DS.shape(S, cap(1406, 492, 1320, 492, 16), "gray", { w: "mid" }); DS.shape(S, rrect(1372, 446, 68, 28, DS.r.sm), "sky", { w: "mid" }); };
// the rubber duck (drawn around its centre)
const duck = (S, x, y, k = 1.5, parent) => {
  const g = G(S, parent, `translate(${x} ${y}) scale(${k})`);
  DS.shape(S, circ(-4, 10, 34, 22), "yellow", { parent: g, w: "mid" }); DS.shape(S, circ(14, -18, 19), "yellow", { parent: g, w: "mid" });
  DS.shape(S, "M30 -22 L48 -15 L30 -9 Z", "orange", { parent: g, w: "detail" }); S.fill(circ(18, -23, 4), S.start, 0, DS.c("ink"), 1, g);
  S.draw("M-22 6 Q-6 18 8 6", S.start, 0, { c: DS.c("yellow", 2), w: DS.w.detail, parent: g });
  return g;
};
// a grown-up's helping hand reaching in from the right edge (sleeve + hand); draw the prop into .hand
const OFF = "translate(900 260)";
const helper = (S, hx, hy) => {
  const g = G(S, null, OFF), hand = G(S, G(S, g, `translate(${hx} ${hy})`), "rotate(0)");
  DS.shape(S, cap(2700, hy + 360, hx + 70, hy + 20, 58), "purple", { parent: g });
  DS.shape(S, rrect(hx + 40, hy - 40, 50, 120, DS.r.sm), "purple", { parent: g, tone: 1, w: "mid" });     // cuff
  DS.shape(S, circ(0, 20, 62, 54), "dusk", { parent: hand });
  DS.shape(S, cap(-40, -6, -78, -30, 18), "dusk", { parent: hand, w: "mid" });                            // thumb
  return { g, hand, hx, hy, at: OFF };
};
const tilt = (H, t, a0, a1, dur = 0.5) => tw(H.hand, t, dur, `rotate(${a0})`, `rotate(${a1})`);
// glide the hand so it sits at world (x, y) by t + dur; null = back out of frame
const handTo = (H, t, xy, dur = 0.8) => { const to = xy ? `translate(${K(xy[0] - H.hx)} ${K(xy[1] - H.hy)})` : OFF; tw(H.g, t, dur, H.at, to); H.at = to; };
const toes = (S, t, x0 = 560) => [0, 50, 100, 150].map((dx, i) => {   // curled arm tips peeking over the tub's rim
  const x = x0 + dx, g = G(S, null, `rotate(0 ${x} 650)`), s = i % 2 ? -1 : 1;
  DS.shape(S, tube([[x, 690], [x, 630], [x - 8 * s, 590], [x + 10 * s, 566]], 18, 10).d, "pink", { parent: g, w: "mid" });
  if (t > S.start + 0.05) tw(g, t + i * 0.12, 0.5, `rotate(0 ${x} 650) translate(0 90)`, `rotate(0 ${x} 650)`, "power2.out");
  g.x = x; return g;
});
const sponge = (S, x, y, parent) => { const g = G(S, parent, `translate(${x} ${y})`); DS.shape(S, rrect(-48, -32, 96, 64, DS.r.sm), "yellow", { parent: g, w: "mid" }); [[-20, -8], [14, 6], [24, -14], [-8, 14]].forEach(([dx, dy]) => S.fill(circ(dx, dy, 6), S.start, 0, DS.c("yellow", 2), 0.8, g)); return g; };
const towel = (S, parent, w, h, c, tf) => { const g = G(S, parent, tf); DS.shape(S, rrect(-w / 2, -h / 2, w, h, DS.r.md), c, { parent: g, w: "mid" }); S.draw(`M${-w / 2 + 6} ${h / 2 - 26} H${w / 2 - 6} M${-w / 2 + 6} ${h / 2 - 14} H${w / 2 - 6}`, S.start, 0, { c: DS.P.white[0], w: DS.w.detail, parent: g }); return g; };
const headTowel = (S, O, t) => {   // the big soft towel over Ollie's head
  const g = G(S, O.body);
  DS.shape(S, "M-178 -380 Q-190 -520 0 -540 Q190 -520 178 -380 Q150 -340 120 -372 Q0 -420 -120 -372 Q-150 -340 -178 -380 Z", "grass", { parent: g });
  S.draw("M-150 -400 Q0 -450 150 -400", S.start, 0, { c: DS.P.white[0], w: DS.w.detail, parent: g });
  if (t > S.start + 0.05) { g.setAttribute("opacity", 0); tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.5 }, t); }
  return g;
};

// the whole set. o: { lift, bibi, duck, mouth, mood, t (Ollie fades in), suds, front(O, B) }. draw(O, B) runs right after Ollie.
const SET = (S, o = {}, draw) => {
  DS.room(S, BATH_ROOM); bathWall(S, { towel: false });
  tap(S); tubBack(S);
  const B = o.bibi ? bibi(S, 620, 520, { k: 0.6, mood: o.mood, paws: [[558, 628], [700, 628]] }) : null;
  const O = ollie(S, 960, 880, 1.2, { mouth: o.mouth || "smile", look: o.look || 0, t: o.t });
  if (o.lift) O.lift(o.lift, S.start, 0.01);
  inTub(S, O.pos);
  if (draw) draw(O, B);
  const F = o.suds === false ? null : suds(S, 530, 1390, 640, 16);
  const D = o.duck ? duck(S, 1290, 600, 1.5, G(S, null, "translate(0 0)")) : null;
  if (o.front) o.front(O, B);
  tubFront(S);
  return { O, B, F, D };
};
// clip Ollie to "above the rim or inside the tub" so hanging arms never poke out of the tub's sides or bottom
let TUBN = 0;
const inTub = (S, e) => {
  const id = "tub-clip-" + ++TUBN, cp = el("clipPath", { id }, defs), w = S.grp();
  el("path", { d: "M-300 -300 H2220 V650 H1420 Q1424 900 1290 900 H630 Q496 900 500 650 H-300 Z" }, cp);
  w.setAttribute("clip-path", `url(#${id})`); e.parentNode.insertBefore(w, e); w.appendChild(e);
};
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const singLine = (O, c) => { const n = TIMING.words.filter((w) => w[0] === c).length; for (let i = 0; i < n; i++) O.sing(W(c, i), Math.min(WE(c, i), i + 1 < n ? W(c, i + 1) - 0.05 : WE(c, i))); };
const card = (S, str, t, t1, x = 1440, y = 190, size = DS.type.title) => { const C = DS.card(S, str, x, y, { size, t }); S.fadeOut(C.g, t1, 0.4); return C; };
const splash = (S, t, xs = [600, 700, 1220, 1320]) => xs.forEach((x, i) => drop(S, x, 596 - (i % 2) * 30, t + i * 0.06, 1.2));
// three bubbles float up on the right, a number on each count (clip c, words 1-3 = "one, two, three"; first = index of "one")
const count3 = (S, c, first = 1) => [[1300, 330], [1460, 250], [1620, 330]].forEach(([x, y], i) => {
  const t = W(c, first + i) - 0.1, g = G(S, null, "translate(0 0)");
  S.draw(circ(x, y, 66), S.start, 0, { c: DS.c("blue", 1), w: DS.w.mid, fill: DS.c("sky", 1), parent: g, op: 0.95 });
  S.fill(circ(x - 24, y - 24, 15), S.start, 0, DS.P.white[0], 0.95, g);
  S.text(String(i + 1), x, y + 36, { size: DS.type.display, t: S.start, c: DS.c("blue", 2), parent: g });
  fadeIn(S, g, t); tw(g, t, 3, "translate(0 0)", "translate(0 -40)", "sine.inOut");
  S.fadeOut(g, CLIP(c)[1] + 0.3, 0.4);
});

// ---------- one pass: wide on the slot word, mid on "splash", insert on the 1-2-3 bubbles, face close-up on the tag ----------
// o: { word, act(S, O, B, L), beat(S, r, t0), front(S, O, B, L), bibi, duck, lift, closeY, count: [clip, first word], short }
const pass = (p, o) => {
  const L = PS[p], t0 = T0[p], t1 = T0[p + 1], fy = 484 + (o.lift || 0) * 1.2;
  const S = scene(t0, t1, { cam: "none" });
  const r = SET(S, { bibi: o.bibi, duck: o.duck, lift: o.lift, mood: o.mood, front: o.front && ((O, B) => o.front(S, O, B, L)) }, (O, B) => {
    O.bob(t0 + 0.3, W(L[3], 0) - 0.2, 8);
    singLine(O, L[3]); O.wiggle([1, 2, 7, 8], W(L[3], 0), tagEnd(L), 12, BEAT);
    o.act(S, O, B, L);
    if (B) swing(S, B.R, W(L[1], 0), CLIP(L[2])[1], { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  });
  wide(S, t0, 0.01);
  if (o.beat) o.beat(S, r, t0);
  if (r.D) tw(r.D, t0, t1 - t0, "translate(1290 600) scale(1.5)", "translate(1290 588) scale(1.5)", hump(cyc(t1 - t0, 2 * BEAT)));
  card(S, o.word, W(L[0], 1), Math.min(W(L[1], 0), W(L[0], 0) + 3.6) - 0.6);
  splash(S, W(L[1], 0)); splash(S, W(L[1], 1), [650, 1270]);
  [o.count || [L[2], 1]].forEach(([c, i]) => count3(S, c, i));
  if (o.short) {   // a take that rushes the pass: one push-in that holds both the face and the bubbles
    look(S, 1130, 430, 1.3, Math.max(W(L[1], 0) - 0.4, t0 + 4.1));
    close(S, W(L[3], 0) - 0.6, fy);
  } else {
    mid(S, Math.max(W(L[1], 0) - 0.5, t0 + 4.1));
    look(S, 1170, 420 + (o.lift || 0) * 0.6, 1.25, W(L[2], 0) - 0.6);
    close(S, Math.max(W(L[3], 0) - 0.6, W(L[2], 0) + 3.4), fy);
  }
  [[-190, -150], [190, -170], [-170, 140], [170, 130]].forEach(([dx, dy], i) => sparkle(S, 960 + dx, fy + dy, W(L[3], 3) + i * 0.15, 0.9));
  DS.vignette(S);
  return { S, ...r };
};
const puffs = (S, O, pts, ts, n = 2) => pts.map(([x, y], i) => foam(S, x, y, n, ts[i % ts.length], O.body));

// 0  intro: the tap runs, a grown-up's hand pours bubble bath, the suds grow, Ollie pops up out of the bubbles on "bath time!"
{ const S = scene(0, T0[0], { cam: "none" }), tUp = W(1, 3) - 0.2;
  const { O } = SET(S, { suds: false, t: tUp }, (O) => {
    O.lift(70, S.start, 0.01); O.lift(0, tUp, 0.7);
    [[530, 760, 6, 1.6], [1160, 1390, 6, 2.2], [740, 1180, 8, 2.8], [530, 1390, 16, 3.4]].forEach(([a, b, n, t]) => suds(S, a, b, 640, n, null, t));
    O.bob(tUp + 0.8, T0[0], 8); O.wiggle([1, 2, 7, 8], W(2, 0), T0[0], 10, BEAT);
    singLine(O, 1); singLine(O, 2);
  });
  const H = helper(S, 1250, 330);
  DS.shape(S, rrect(-34, -120, 68, 130, DS.r.sm), "pink", { parent: H.hand, w: "mid" }); DS.shape(S, rrect(-16, -150, 32, 34, DS.r.xs), "white", { parent: H.hand, w: "detail" });
  S.fill(circ(0, -60, 18), S.start, 0, DS.P.white[0], 0.8, H.hand);
  tapWater(S, 0.2, 1320, 508, 640);
  handTo(H, 0.3, [1250, 330]); handTo(H, 4.6, null);
  tilt(H, 1.2, 0, -110); tilt(H, 3.6, -110, 0);
  [[1170, 400], [1140, 450], [1110, 500]].forEach(([x, y], i) => drop(S, x, y, 1.7 + i * 0.5, 0.9));
  splash(S, tUp + 0.2);
  [[700, 600, 24], [900, 610, 30], [1100, 600, 26], [1250, 610, 20]].forEach(([x, y, r], i) => bubble(S, x, y, r, 380, { t: 4 + i * 0.6 }));
  card(S, "BATH TIME!", tUp + 0.3, 4.3, 960, 160);
  close(S, 4.6);
  DS.vignette(S); }

// 1  HANDS: two arm tips come up beside his face, a puff of foam on every "scrub", they rub on the half beat
pass(0, { word: "HANDS",
  act: (S, O, B, L) => {
    const As = [arm(O, 0, 1), arm(O, 0, -1)];
    As.forEach((A) => O.holdAt(A, -300, W(L[0], 1) - 0.5, 0.5));
    As.forEach((A) => { const [x, y] = O.tipNow(A); puffs(S, O, [[x, y], [x, y - 24], [x, y + 22]], [W(L[0], 3), W(L[0], 4), W(L[0], 5)]); });
    O.wiggle([1, 2], W(L[0], 3), CLIP(L[1])[1], 16, BEAT / 2);
  },
});

// 2  TOES: four curled tips peek over the tub's left end and wiggle, foam on each scrub; the rubber duck floats in
pass(1, { word: "TOES", duck: true,
  beat: (S, r, t0) => tw(r.D.parentNode, t0 + 0.2, 2.4, "translate(420 0)", "translate(0 0)", "power1.out"),
  front: (S, O, B, L) => {
    const ts = toes(S, W(L[0], 1) - 0.3), t1 = CLIP(L[1])[1];
    [3, 4, 5].forEach((wi, i) => foam(S, 585 + i * 50, 576, 2, W(L[0], wi)));
    ts.forEach((g, i) => tw(g, W(L[0], 3), t1 - W(L[0], 3), `rotate(0 ${g.x} 650)`, `rotate(${i % 2 ? 10 : -10} ${g.x} 650)`, wave(cyc(t1 - W(L[0], 3), BEAT))));
  },
  act: () => {},
});

// 3  "Splash!" Bibi hops into the tub; TUMMY: Ollie stands up out of the suds, a sponge scrubs his tummy
pass(2, { word: "TUMMY", duck: true, bibi: true, lift: -110,
  beat: (S, r) => { popAt(r.B.g, W(11, 0) - 0.2, 620, 560); splash(S, W(11, 0), [520, 600, 680, 740]); look(S, 760, 540, 1.25, W(11, 0) - 0.1); wide(S, W(PS[2][0], 0) - 0.1); },
  act: (S, O, B, L) => {
    const g = sponge(S, 0, -150, O.body); fadeIn(S, g, W(L[0], 2) - 0.2);
    O.raise(arm(O, 2, 1), 40, W(L[0], 2) - 0.6, 0.5);
    swing(S, g, W(L[0], 3), CLIP(L[1])[1], { x: 40 }, BEAT / 2);
    puffs(S, O, [[-70, -150], [64, -160], [-6, -128]], [W(L[0], 3), W(L[0], 4), W(L[0], 5)]);
  },
});

// 4  FACE: Bibi tickles, then a bubble beard grows on every scrub (the take rushes this pass: one slow push-in)
pass(3, { word: "FACE", duck: true, bibi: true, mood: "joy", short: true, lift: -60,
  beat: (S, r, t0) => { r.O.grin(t0 + 0.3, W(PS[3][0], 0) - 0.1); r.O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], t0 + 0.3, W(PS[3][0], 0), 14, BEAT / 2); },
  act: (S, O, B, L) => {
    O.holdAt(arm(O, 0, -1), -320, W(L[0], 1) - 0.5, 0.5);
    puffs(S, O, [[-60, -186], [60, -186], [0, -172], [-104, -212], [104, -212], [-30, -164], [30, -164]], [W(L[0], 3), W(L[0], 3), W(L[0], 4), W(L[0], 4), W(L[0], 4), W(L[1], 0), W(L[1], 1)], 3);
    O.wiggle([1, 2], W(L[0], 3), CLIP(L[0])[1] + 0.4, 14, BEAT / 2);
  },
});

// 5  "All eight arms!" every arm pops up with foam and scrubs; "Rinse off": the grown-up's cup pours, the foam slides away
{ const L = FIN, t0 = T0[4], t1 = T_DRY, S = scene(t0, t1, { cam: "none" });
  const tr = W(L[2], 0) - 0.2, foams = [], ta = (i) => t0 + 1.6 + i * BEAT;
  SET(S, { duck: true, bibi: true, mood: "joy", mouth: "grin" }, (O) => {
    O.row.forEach((A, i) => {
      O.raise(A, [112, 92, 70, 44][A.ai], ta(i) - 0.4, 0.5);
      const [x, y] = O.tipNow(A, 10); foams.push(foam(S, x, y, 3, ta(i) + 0.1, O.body));
    });
    O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], W(L[1], 0), CLIP(L[1])[1], 14, BEAT / 2);
    O.bob(t0 + 0.3, tr, 10);
    O.grin(t0, W(L[3], 0) - 0.1); singLine(O, L[3]); O.grin(tagEnd(L));
    O.row.forEach((A) => O.raise(A, 0, tr + 0.9, 0.8));
  });
  const H = helper(S, 1240, 170);
  DS.shape(S, "M-150 -60 L-60 -60 L-70 40 L-140 40 Z", "sky", { parent: H.hand, w: "mid" });     // rinse cup
  foams.forEach((g, i) => S.fadeOut(g, tr + 0.6 + i * 0.08, 0.5));
  handTo(H, tr - 1.1, [1240, 170]); handTo(H, tagEnd(L) - 0.4, null);
  tilt(H, tr, 0, -60); tilt(H, CLIP(L[2])[1] - 0.3, -60, 0, 0.4);
  const water = S.fill(rrect(1050, 210, 34, 150, DS.r.sm), tr + 0.4, 0, DS.c("sky", 0), 0.85); S.fadeOut(water, CLIP(L[2])[1] - 0.3, 0.3);
  [0, 1, 2].forEach((i) => splash(S, W(L[2], 2 + i), [740, 1180]));
  card(S, "8 ARMS!", ta(7) + 0.4, W(L[1], 0) - 0.6, 1480, 190);
  look(S, 960, 430, 1.15, t0 + 4.1);
  look(S, 1000, 430, 1.35, W(L[1], 0) + 1.2);
  [[-190, -150], [190, -170], [-170, 140], [170, 130]].forEach(([dx, dy], i) => sparkle(S, 960 + dx, 484 + dy, W(L[3], 3) + i * 0.15, 0.9));
  DS.vignette(S); }

// 6  drying: the hand's little towel pats hands and toes on their words, then the big soft towel lands on his head; "Cosy, cosy"
{ const S = scene(T_DRY, T_DRY2, { cam: "none" });
  const { O } = SET(S, { bibi: true, mood: "joy", lift: -110, front: () => toes(S, S.start, 1210) }, (O) => {
    O.holdAt(arm(O, 0, -1), -300, S.start, 0.01);
    O.bob(S.start + 0.3, S.end, 6);
    headTowel(S, O, W(25, 2));
    O.grin(W(26, 0), S.end);
  });
  const H = helper(S, 1250, 420); towel(S, H.hand, 150, 90, "sky");
  const hand = O.at(O.tipNow(arm(O, 0, -1)));
  handTo(H, S.start + 0.1, [1500, 380]); handTo(H, W(24, 2) - 0.6, [hand[0] + 40, hand[1]], 0.6); handTo(H, W(24, 5) - 0.6, [1300, 530], 0.6); handTo(H, W(25, 0), null);
  [W(24, 2), W(24, 5)].forEach((t) => sparkle(S, ...(t === W(24, 2) ? hand : [1290, 520]), t + 0.2, 0.7));
  look(S, 1080, 470, 1.25, S.start + 0.2, 0.01);
  close(S, W(25, 2) + 0.5, 352);
  card(S, "DRY!", W(24, 0), W(24, 0) + 3.2, 700, 170);
  DS.vignette(S); }

// 7  drying again: Bibi gets a towel too; hand pats Ollie's tummy and nose, then Bibi's; cosy, cosy
{ const S = scene(T_DRY2, T_BED, { cam: "none" });
  const { O, B } = SET(S, { bibi: true, mood: "joy", lift: -110, mouth: "grin" }, (O, B) => {
    O.bob(S.start + 0.3, S.end, 6);
    headTowel(S, O, S.start);
    singLine(O, 32); singLine(O, 33);
  });
  const H = helper(S, 1250, 420); towel(S, H.hand, 150, 90, "sky");
  towel(S, B.g, 180, 46, "pink", "translate(620 420) rotate(-6)");   // Bibi's towel between her ears
  const tum = [960, 590], nose = [960, 430];
  handTo(H, S.start + 0.1, [1500, 420]);
  handTo(H, W(27, 2) - 0.6, [tum[0] + 110, tum[1] - 40], 0.6); handTo(H, W(27, 5) - 0.6, [nose[0] + 110, nose[1]], 0.6); handTo(H, W(28, 0) + 0.4, [1500, 420]);
  handTo(H, W(29, 2) - 0.6, [760, 620], 0.6); handTo(H, W(30, 2) - 0.6, [720, 650], 0.6); handTo(H, W(30, 5) - 0.6, [720, 550], 0.6); handTo(H, W(31, 0), null);
  [[W(27, 2), tum], [W(27, 5), nose], [W(29, 2), [700, 620]], [W(30, 2), [640, 650]], [W(30, 5), [620, 545]]].forEach(([t, xy]) => sparkle(S, ...xy, t + 0.2, 0.7));
  swing(S, B.R, W(31, 0), S.end - 0.3, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  look(S, 1000, 520, 1.2, S.start + 0.2, 0.01);
  close(S, W(28, 0) - 0.3, 352);
  look(S, 780, 520, 1.3, W(29, 0) + 0.1);
  close(S, W(31, 0) - 0.3, 352);
  DS.vignette(S); }

// 8  bedtime: Ollie tucked into bed with his towel turban gone, Bibi on the pillow, the moon in the window; night-night, bye-bye
{ const S = scene(T_BED, TOTAL, { cam: "none" });
  DS.room(S, { wall: "night", floor: "floor", window: [1260, 170, 240, 240] });
  S.fill(rect(1260, 170, 240, 240), S.start, 0, DS.c("navy"), 1);
  S.fill(circ(1410, 250, 40), S.start, 0, DS.c("yellow", 1), 1); S.fill(circ(1426, 238, 36), S.start, 0, DS.c("navy"), 1);   // crescent moon
  [[1300, 210], [1340, 330], [1460, 360], [1300, 380]].forEach(([x, y]) => S.fill(circ(x, y, 5), S.start, 0, DS.c("yellow", 1), 1));
  S.draw(`M1260 290 H1500 M1380 170 V410`, S.start, 0, { c: DS.P.white[0], w: DS.w.near });
  DS.frame(S, 470, 230, 160, 120, "sky");
  DS.shadow(S, 960, 912, 1080);
  DS.shape(S, rrect(440, 380, 1040, 300, DS.r.lg), "blue", { layer: "mid" });                                 // headboard
  DS.shape(S, circ(960, 560, 300, 80), "white", { w: "mid" });                                                // pillow
  const B = bibi(S, 620, 560, { k: 0.55, mood: "joy", paws: [[560, 680], [700, 680]] });
  const O = ollie(S, 960, 900, 1.2, { mouth: "smile", look: -6 });
  O.bob(S.start + 0.3, TOTAL - 0.5, 5);
  singLine(O, 34); singLine(O, 35); singLine(O, 36); singLine(O, 37);
  [arm(O, 0, 1), arm(O, 0, -1)].forEach((A) => O.raise(A, 112, W(34, 0) - 0.6, 0.6));
  O.wiggle([1, 2], W(34, 0), CLIP(37)[1], 14, BEAT);
  DS.shape(S, "M420 700 Q960 600 1500 700 L1500 930 H420 Z", "pink");                                        // blanket
  S.draw("M440 760 Q960 670 1480 760", S.start, 0, { c: DS.P.white[0], w: DS.w.mid });
  DS.shape(S, rrect(420, 900, 1080, 36, DS.r.sm), "wood", { w: "mid" });
  swing(S, B.R, W(34, 0), CLIP(37)[1], { rotation: -16, svgOrigin: B.R.sh }, BEAT);
  duck(S, 1300, 680, 1.4);
  glow(S, S.start);
  card(S, "NIGHT-NIGHT!", W(34, 0), W(36, 0) - 0.8, 700, 170);
  look(S, 960, 500, 1.4, W(35, 0) - 0.8);
  look(S, 760, 560, 1.4, W(36, 0) + 2.4);
  wide(S, CLIP(37)[1] + 0.4);
  S.text("Tiny Tune Town", 960, 140, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: TOTAL - 5 });
  DS.vignette(S); }
