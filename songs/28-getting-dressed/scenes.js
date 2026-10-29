// look: still
// @include ../../tools/cast.js
// 28 Ready to Go! (original). Ollie gets dressed in his bedroom with all 8 arms: pants (8 legs!), shirt over the head (peek-a-boo), 8 socks,
// 8 shoes, coat (zip + Bibi's hug), hat (Bibi brings it, pat pat pat), then out of the door. Clothes come off the bed on their words.
// Camera: wide at each pass, mid on the item, face close-up on every "Ready, ready, ready to go!". No hard cuts, nothing under 4 s.
// Scene edges follow the sung lines (cu(c) = just before line c), so the real take re-times everything by itself.
// ---- take remap (planned line -> sung clip number, or {t: seconds} for a break the singer dropped) ----
const PLAN = [null, 1, {"t": 9.903}, 2, 3, 4, {"t": 26.383}, 5, 6, 7, 8, 9, {"t": 49.403}, 10, {"t": 52.953}, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 26, 27, 28, 30];
const PWN = (c) => TIMING.words.filter((x) => x[0] === PLAN[c]).length;
const PW = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + i * 0.3 : W(PLAN[c], Math.min(i, PWN(c) - 1)));
const PCLIP = (c) => (typeof PLAN[c] === "object" ? [PLAN[c].t, PLAN[c].t + 1.2] : CLIP(PLAN[c]));
const PWE = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + 0.4 + i * 0.3 : WE(PLAN[c], Math.min(i, PWN(c) - 1)));

BEAT = 60 / 100;
const FACE = [930, 500];
const wide = (S, t) => S.zoom(...FACE, 1, t, 1.3), mid = (S, t) => S.zoom(...FACE, 1.2, t, 1.3), close = (S, t) => S.zoom(...FACE, 1.45, t, 1.3);
const low = (S, t, k = 1.35) => S.zoom(930, 740, k, t, 1.3);
const cu = (c) => PCLIP(c)[0] - 0.3;
const pg = (pts) => "M" + pts.map((p) => p.join(" ")).join(" L") + " Z";
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const ALL = [1, 2, 3, 4, 5, 6, 7, 8];
const BEDPOS = { pants: [150, 560], shirt: [212, 560], socks: [275, 566], shoes: [338, 566], coat: [398, 560], hat: [91, 566] };

// ---------- clothes as little icons (on the bed, in Bibi's paws, as the "over the head" shirt) ----------
const icon = (S, name, x, y, s, parent, w = "mid") => {
  const g = S.grp(parent); g.setAttribute("transform", `translate(${x} ${y}) scale(${s})`);
  const sh = (d, c, o = {}) => DS.shape(S, d, c, Object.assign({ parent: g, w }, o));
  const ln = (d, c) => S.draw(d, S.start, 0, { c: DS.c(c, 2), w: DS.w.detail, parent: g });
  if (name === "pants") { sh("M-42 -44 H42 L48 52 H14 L0 -2 L-14 52 H-48 Z", "blue"); ln("M-42 -28 H42", "blue"); sh(circ(0, -36, 6), "gold", { w: "hair" }); }
  if (name === "shirt") { sh("M-24 -46 Q0 -30 24 -46 L54 -30 L42 -4 L30 -14 V46 H-30 V-14 L-42 -4 L-54 -30 Z", "yellow"); ["M-30 4 H30", "M-30 24 H30"].forEach((d) => ln(d, "orange")); }
  if (name === "socks") [-24, 24].forEach((dx) => { sh(`M${dx - 12} -44 H${dx + 12} V4 L${dx + 32} 20 Q${dx + 40} 40 ${dx + 20} 42 H${dx - 14} Q${dx - 26} 38 ${dx - 12} 22 Z`, "white"); ln(`M${dx - 12} -30 H${dx + 12}`, "red"); });
  if (name === "shoes") [-22, 22].forEach((dx) => { sh(`M${dx - 22} -20 H${dx - 2} Q${dx + 8} -4 ${dx + 26} -2 Q${dx + 40} 6 ${dx + 38} 22 H${dx - 22} Z`, "orange"); sh(rrect(dx - 24, 18, 64, 10, DS.r.xs), "white", { w: "detail" }); });
  if (name === "coat") { sh("M-26 -50 L26 -50 L58 -34 L52 12 L36 6 V54 H-36 V6 L-52 12 L-58 -34 Z", "grass"); ln("M0 -50 V54", "grass"); sh(circ(0, -30, 5), "gold", { w: "hair" }); }
  if (name === "hat") { sh("M-42 16 Q-46 -36 0 -42 Q46 -36 42 16 Z", "red"); sh(rrect(-46, 6, 92, 22, DS.r.xs), "white"); sh(circ(0, -46, 14), "white"); }
  return g;
};

// ---------- worn clothes: tubes over Ollie's arms, pieces on his body (drawn behind his face), hat on top ----------
const dense = (A) => cr(ARMS[A.ai][1].map(([px, py]) => [A.x + px * A.side, A.y + py]));   // 25 points along arm A, root to tip
const part = (S, A, a, b, w0, w1, col, t) => { const g = S.grp(A.wig); DS.shape(S, tube(dense(A).slice(a, b), w0, w1).d, col, { parent: g, w: "mid" }); fadeIn(S, g, t); return g; };
const torso = (S, O) => { if (O.tor) return O.tor; const g = S.grp(O.body); O.body.insertBefore(g, O.body.children[9]);   // right after the mantle, under the face
  return (O.tor = { shirt: S.grp(g), band: S.grp(g), coat: S.grp(g) }); };
const shoe = (S, A, t) => { const [tx, ty] = dense(A)[24], d = -A.side, X = (v) => tx + v * d, g = S.grp(A.wig);
  DS.shape(S, `M${X(-20)} ${ty - 24} H${X(6)} Q${X(36)} ${ty - 20} ${X(40)} ${ty + 10} V${ty + 24} H${X(-20)} Z`, "orange", { parent: g, w: "mid" });
  DS.shape(S, pg([[X(-22), ty + 16], [X(42), ty + 16], [X(42), ty + 28], [X(-22), ty + 28]]), "white", { parent: g, w: "detail" });
  DS.shape(S, pg([[X(-6), ty - 24], [X(10), ty - 24], [X(10), ty - 6], [X(-6), ty - 6]]), "white", { parent: g, w: "hair" }); fadeIn(S, g, t); };
const wear = {
  pants: (S, O, ts) => { O.arms.forEach((A) => A.ai > 0 && part(S, A, 0, 13, 38, 26, "blue", ts[(A.side === 1 ? 0 : 1) % ts.length]));
    const g = torso(S, O).band; DS.shape(S, rrect(-126, -204, 252, 36, DS.r.xs), "blue", { parent: g, w: "mid" }); DS.shape(S, rrect(-15, -201, 30, 30, DS.r.xs), "gold", { parent: g, w: "detail" }); fadeIn(S, g, ts[2 % ts.length]); },
  shirt: (S, O, ts) => { const g = torso(S, O).shirt; DS.shape(S, "M-121 -238 Q0 -214 121 -238 L84 -196 Q0 -184 -84 -196 Z", "yellow", { parent: g, w: "mid" });
    ["M-104 -222 Q0 -200 104 -222", "M-92 -208 Q0 -187 92 -208"].forEach((d) => S.draw(d, S.start, 0, { c: DS.c("orange", 0), w: DS.w.mid, parent: g })); fadeIn(S, g, ts[0]);
    O.arms.forEach((A) => A.ai === 0 && part(S, A, 0, 7, 38, 31, "yellow", ts[(A.side === 1 ? 1 : 2) % ts.length])); },
  socks: (S, O, ts) => O.arms.forEach((A, i) => { const t = ts[i % ts.length]; part(S, A, 15, 25, 23, 14, "white", t); part(S, A, 15, 18, 25, 21, "red", t); }),
  shoes: (S, O, ts) => O.arms.forEach((A, i) => shoe(S, A, ts[i % ts.length])),
  coat: (S, O, ts) => { const g = torso(S, O).coat; DS.shape(S, "M-130 -248 Q0 -224 130 -248 L112 -186 Q0 -176 -112 -186 Z", "grass", { parent: g, w: "mid" });
    DS.shape(S, pg([[-30, -238], [0, -188], [30, -238]]), "yellow", { parent: g, w: "detail", flat: true });
    O.arms.forEach((A) => A.ai < 2 && part(S, A, 0, 18, 40, 26, "grass", ts[1 % ts.length])); fadeIn(S, g, ts[0]);
    const z = S.grp(g), p = S.grp(g);                                                   // zip cover grows up from the hem, the pull rides up with it
    DS.shape(S, pg([[-30, -238], [0, -188], [30, -238]]), "grass", { parent: z, w: "mid" }); S.draw("M0 -190 V-238", S.start, 0, { c: DS.c("gray", 2), w: DS.w.detail, parent: z });
    DS.shape(S, circ(0, -192, 9), "gold", { parent: p, w: "detail" });
    const t = ts[2 % ts.length], T = "translate(0 -188) scale(1 ", back = ") translate(0 188)";
    if (t > S.start + 0.05) { tl.set([z, p], { opacity: 0 }, S.start); tl.set([z, p], { opacity: 1 }, t); tw(z, t, 1.3, T + "0.02" + back, T + "1" + back); tw(p, t, 1.3, "translate(0 0)", "translate(0 -46)"); }
    else { z.setAttribute("transform", T + "1" + back); p.setAttribute("transform", "translate(0 -46)"); } },
  hat: (S, O, ts) => { const [o, g] = popIn(S, ts[0], 0, -500, O.body);
    DS.shape(S, "M-118 -442 Q-126 -560 0 -566 Q126 -560 118 -442 Q0 -470 -118 -442 Z", "red", { parent: g, w: "mid" });
    DS.shape(S, rrect(-124, -462, 248, 40, DS.r.sm), "white", { parent: g, w: "mid" });
    [-84, -42, 0, 42, 84].forEach((x) => S.draw(`M${x} -456 V-428`, S.start, 0, { c: DS.c("gray", 1), w: DS.w.detail, parent: g }));
    DS.shape(S, circ(0, -578, 30), "white", { parent: g, w: "mid" }); O.hat = o; },
};
// aim arm A's tip at body point (tx, ty), swinging over dur from t
const reach = (O, A, tx, ty, t, dur = 0.6) => { const x0 = A.tip[0] - A.x, y0 = A.tip[1] - A.y; let r = (Math.atan2(ty - A.y, tx - A.x) - Math.atan2(y0, x0)) * 180 / Math.PI; r = ((r + 540) % 360) - 180; O.raise(A, r * A.side, t, dur); };

// ---------- the bedroom ----------
const snow = (S, t0) => Array.from({ length: 8 }, (_, i) => { const g = S.grp(), d = 2.6 + (i % 3) * 0.4, n = Math.ceil((S.end - t0) / d) + 1, t = t0 + i * 0.4;   // flakes drift down inside the window
  S.draw(circ(548 + i * 28 + (i % 2) * 10, 215 + (i % 3) * 30, 7), S.start, 0, { c: DS.c("sky", 2), w: DS.w.hair, fill: DS.P.white[0], parent: g }); tl.set(g, { opacity: 0 }, S.start);
  tl.fromTo(g, { y: 0 }, { y: 140, duration: d, ease: "none", repeat: n - 1, immediateRender: false }, t);
  tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: d / 2, ease: "none", yoyo: true, repeat: 2 * n - 1, immediateRender: false }, t); });
const stage = (S, o = {}) => {
  const on = o.on || [], t0 = S.start, bx = o.bx || 0;
  DS.room(S, { wall: "dusk", floor: "floor", window: [520, 170, 250, 290] });
  if (o.snow) snow(S, o.snow);
  DS.frame(S, 150, 300, 150, 110, "grass");
  // door (closed, or open onto a sunny morning)
  DS.shape(S, rrect(1378, 288, 194, 480, DS.r.xs), "white", { layer: "mid" });
  if (o.open) { DS.shape(S, rect(1390, 300, 170, 460), "sky", { layer: "mid", flat: true, tone: 1 }); DS.shape(S, rect(1390, 680, 170, 80), "grass", { layer: "mid", flat: true }); DS.shape(S, pg([[1390, 300], [1318, 330], [1318, 736], [1390, 760]]), "wood", { layer: "mid", dir: "v" }); }
  else { DS.shape(S, rrect(1390, 300, 170, 460, DS.r.xs), "wood", { layer: "mid", dir: "v" }); [[330, 140], [510, 220]].forEach(([y, h]) => DS.shape(S, rrect(1415, y, 120, h, DS.r.xs), "wood", { layer: "mid", flat: true, tone: 1, w: "detail" })); DS.shape(S, circ(1425, 560, 12), "gold", { w: "detail" }); }
  // bed with the clothes laid out
  DS.shadow(S, 220, 776, 420);
  DS.shape(S, rrect(20, 540, 28, 230, DS.r.xs), "wood", { layer: "mid" });
  DS.shape(S, rrect(20, 690, 400, 56, DS.r.sm), "wood", { layer: "mid" }); [50, 380].forEach((x) => DS.shape(S, rect(x, 742, 22, 34), "wood", { layer: "mid", w: "detail" }));
  DS.shape(S, rrect(40, 610, 380, 90, DS.r.md), "white", { layer: "mid" });
  DS.shape(S, rrect(116, 600, 304, 76, DS.r.sm), "sky", { layer: "mid" });
  DS.shape(S, rrect(46, 584, 86, 48, DS.r.md), "paper", { layer: "mid" });
  const bed = {}; Object.keys(BEDPOS).forEach((n) => { if (!on.includes(n)) bed[n] = icon(S, n, ...BEDPOS[n], 0.6); });
  DS.rug(S, 930, 905, 900, "sky");
  const bsh = DS.shadow(S, 1640 + bx, 800, 230), B = bibi(S, 1640 + bx, 560, { k: 0.72, mood: o.mood });
  if (bx) [B.g, bsh].forEach((e) => S.move(e, t0, 0.01, { x: bx }));
  const O = ollie(S, 930, 900, 1.3, { mouth: o.mouth || "smile", look: o.look || 0 });
  ["pants", "shirt", "socks", "shoes", "coat", "hat"].forEach((n) => on.includes(n) && wear[n](S, O, [t0]));
  return { O, B, bed, bsh };
};
const bibiTo = (S, B, bsh, dx, t, dur = 2) => [B.g, bsh].forEach((e) => S.move(e, t, dur, { x: dx }, "sine.inOut"));
const waveB = (S, B, t0, t1) => swing(S, B.R, t0, t1, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
const bounce = (S, e, t0, t1, h = 22) => swing(S, e, t0, t1, { y: -h }, BEAT);
const sing = (O, c, w = 4) => O.sing(PW(c, 0), PWE(c, w));
const dance = (S, O, t0, t1, amp = 8) => { O.bob(t0, t1, 8); O.wiggle(ALL, t0, t1, amp, BEAT * 2); };
const lineEnd = (c) => PCLIP(c)[1];

// 0  intro + pants (0-16.5): sleepy Ollie, clothes on the bed, Bibi waves from the door; "one, two, three" = pant legs on, "pull them up" = a hop
{ const S = scene(0, cu(4), { cam: "none" });
  const { O, B, bed } = stage(S, { mouth: "smile", look: 12 });
  O.sing(S.start + 0.9, S.start + 2.3); sing(O, 1, 4); dance(S, O, S.start + 0.4, S.end - 0.3, 6);   // a morning yawn, then "Ooh!"
  waveB(S, B, S.start + 1, PW(2, 0));
  S.fadeOut(bed.pants, PW(2, 0), 0.4);
  wear.pants(S, O, [PW(2, 3), PW(2, 4), PW(2, 5)]);
  sparkle(S, ...O.at([0, -190]), PW(2, 5), 0.8); O.hop(PW(3, 2), 60);
  const c = DS.card(S, "TIME TO GET DRESSED!", 960, 150, { size: DS.type.body, t: S.start + 0.8 }); S.fadeOut(c.g, PW(2, 0) - 0.6, 0.4);
  DS.card(S, "PANTS", 1440, 200, { size: DS.type.title, t: PW(2, 0) });
  S.zoom(930, 640, 1.25, PW(2, 0) - 0.8, 1.3); S.zoom(...FACE, 1.3, PW(3, 0) - 0.2, 1.3); wide(S, PW(3, 4) + 0.3);
  DS.vignette(S); }

// 1  tag 1 + break (16.5-38): mid, then face close-up on "Ready to go!"; in the break the shirt floats off the bed and lands over Ollie's head
{ const S = scene(cu(4), cu(7), { cam: "none" });
  const { O, B, bed } = stage(S, { on: ["pants"], mouth: "smile" });
  sing(O, 5); O.sing(PW(4, 0), PWE(4, 6)); dance(S, O, S.start + 0.3, lineEnd(5), 9);
  O.hop(PWE(5, 4) - 0.2, 40);
  const tf = (x, y, s) => `translate(${x} ${y}) scale(${s})`, fly = PCLIP(5)[1] + 2.5;
  const cov = icon(S, "shirt", 0, 0, 1, O.body, "hair"); cov.setAttribute("transform", tf(-535, -254, 0.477)); tl.set(cov, { opacity: 0 }, S.start);
  tl.set(cov, { opacity: 1 }, fly); tw(cov, fly, 2.4, tf(-535, -254, 0.477), tf(0, -340, 3));
  S.fadeOut(bed.shirt, fly, 0.3);
  O.bob(PCLIP(5)[1] + 0.4, S.end - 0.2, 6);
  bounce(S, B.g, PCLIP(5)[1] + 0.6, fly + 2, 16); bounce(S, B.g, PW(6, 0) - 0.2, S.end - 0.2, 22);
  mid(S, S.start + 0.1); close(S, PW(5, 0) - 0.7); wide(S, lineEnd(5) + 0.6); S.zoom(560, 580, 1.35, fly - 1.2, 1.5); close(S, fly + 2.4);
  DS.vignette(S); }

// 2  shirt (38-47.7): the shirt covers his face, "peek-a-boo!" it is pulled down and his eyes pop out, then his arms pop through the sleeves
{ const S = scene(cu(7), cu(9), { cam: "none" });
  const { O, B } = stage(S, { on: ["pants"], mouth: "smile" });
  const tf = (x, y, s) => `translate(${x} ${y}) scale(${s})`;
  const cov = icon(S, "shirt", 0, 0, 1, O.body, "hair"); cov.setAttribute("transform", tf(0, -340, 3));
  const tp = PW(7, 3), pull = tp + 0.1;
  tw(cov, pull, 0.9, tf(0, -340, 3), tf(0, -217, 2.25)); S.fadeOut(cov, pull + 0.7, 0.3);
  wear.shirt(S, O, [pull + 0.8, PW(8, 2), PW(8, 4)]);
  O.sing(tp, PWE(7, 3)); O.grin(PW(8, 4) + 0.4, PW(8, 4) + 1.8);
  [[arm(O, 0, 1), PW(8, 2)], [arm(O, 0, -1), PW(8, 4)]].forEach(([A, t]) => { O.raise(A, 55, t - 0.3, 0.4); O.raise(A, 0, t + 0.7, 0.6); });
  bounce(S, B.g, S.start + 0.5, PW(7, 3), 14); waveB(S, B, tp, S.end - 0.3);
  const c = DS.card(S, "SHIRT", 1440, 200, { size: DS.type.title, t: PW(7, 0) }); S.fadeOut(c.g, tp - 1.6, 0.4);
  mid(S, S.start + 0.1); close(S, tp - 0.9); mid(S, PW(8, 0) + 0.2); low(S, PW(8, 3) + 0.4, 1.25);
  DS.vignette(S); }

// 3  tag 2 + break (47.7-69.3): show off the new shirt, face close-up, then Ollie looks down at his bare tips for "Wiggle toes!"
{ const S = scene(cu(9), cu(12), { cam: "none" });
  const { O, B, bed } = stage(S, { on: ["pants", "shirt"], mouth: "smile" });
  O.sing(PW(9, 0), PWE(9, 6)); sing(O, 10); dance(S, O, S.start + 0.3, lineEnd(10), 9);
  O.hop(PWE(10, 4) - 0.2, 40);
  O.bob(lineEnd(10) + 0.4, S.end - 0.3, 6); bounce(S, B.g, lineEnd(10) + 1, S.end - 0.4, 18);
  const tw0 = PW(11, 0) - 0.3; O.wiggle(ALL, tw0, S.end - 0.3, 14, BEAT);
  mid(S, S.start + 0.1); close(S, PW(10, 0) - 0.7); wide(S, lineEnd(10) + 0.6); low(S, PW(11, 0) - 1.6, 1.5);
  DS.vignette(S); }

// 4  socks (69.3-79): eight socks pop onto the eight tips, then everyone wiggles toes
{ const S = scene(cu(12), cu(14), { cam: "none" });
  const { O, B, bed } = stage(S, { on: ["pants", "shirt"], mouth: "smile", look: -8 });
  const t = [PW(12, 0), PW(12, 0) + 0.1, PW(12, 1), PW(12, 1) + 0.1, PW(12, 2), PW(12, 3), PW(12, 3) + 0.15, PW(12, 4)];
  S.fadeOut(bed.socks, PW(12, 0), 0.4); wear.socks(S, O, t);
  O.bob(S.start + 0.3, S.end - 0.3, 7); O.wiggle(ALL, PW(13, 0), S.end - 0.4, 15, BEAT / 2);
  t.forEach((tt, i) => i % 2 === 0 && sparkle(S, ...O.at(O.tipNow(O.arms[i])), tt + 0.1, 0.45));
  waveB(S, B, PW(13, 0), S.end - 0.3);
  low(S, S.start + 0.2, 1.4); mid(S, PW(13, 2) - 0.3);
  DS.vignette(S); }

// 5  shoes (78.7-88.5): eight shoes, tap tap tap, strap them up, snap snap
{ const S = scene(cu(14), cu(16), { cam: "none" });
  const { O, B, bed } = stage(S, { on: ["pants", "shirt", "socks"], mouth: "smile", look: -8 });
  const t = [PW(14, 0), PW(14, 0) + 0.1, PW(14, 1), PW(14, 1) + 0.1, PW(14, 2), PW(14, 2) + 0.1, PW(14, 2) + 0.2, PW(14, 2) + 0.3];
  S.fadeOut(bed.shoes, PW(14, 0), 0.4); wear.shoes(S, O, t);
  O.bob(S.start + 0.3, S.end - 0.3, 7); O.wiggle(ALL, PW(14, 3), PWE(14, 5), 11, BEAT / 2); O.hop(PW(14, 3), 24, 0.3); O.hop(PW(14, 4), 24, 0.3); O.hop(PW(14, 5), 24, 0.3);
  [[PW(15, 3), 0], [PW(15, 3), 1], [PW(15, 4), 6], [PW(15, 4), 7]].forEach(([tt, i]) => sparkle(S, ...O.at(O.tipNow(O.arms[i])), tt, 0.5));
  bounce(S, B.g, PW(15, 3), S.end - 0.3, 16);
  low(S, S.start + 0.2, 1.4); mid(S, PW(15, 0) - 0.3);
  DS.vignette(S); }

// 6  tag 3 + break (88.5-110): face close-up, then it starts to snow outside and the coat on the bed gets a sparkle for "Zip!"
{ const S = scene(cu(16), cu(19), { cam: "none" });
  const { O, B, bed } = stage(S, { on: ["pants", "shirt", "socks", "shoes"], mouth: "smile", snow: lineEnd(17) + 0.8 });
  O.sing(PW(16, 0), PWE(16, 6)); sing(O, 17); dance(S, O, S.start + 0.3, lineEnd(17), 9);
  O.hop(PWE(17, 4) - 0.2, 40);
  O.bob(lineEnd(17) + 0.4, S.end - 0.3, 6); bounce(S, B.g, lineEnd(17) + 1.6, S.end - 0.4, 18);
  sparkle(S, ...BEDPOS.coat, PW(18, 0) - 0.4, 0.9);
  mid(S, S.start + 0.1); close(S, PW(17, 0) - 0.7); wide(S, lineEnd(17) + 0.6); S.zoom(600, 480, 1.3, lineEnd(17) + 4, 1.5); wide(S, PW(18, 0) + 0.4);
  DS.vignette(S); }

// 7  coat (109.7-119.7): the coat goes on, the zip runs up, Bibi steps in for the big hug
{ const S = scene(cu(19), cu(21), { cam: "none" });
  const { O, B, bsh, bed } = stage(S, { on: ["pants", "shirt", "socks", "shoes"], mouth: "smile", snow: S.start });
  S.fadeOut(bed.coat, PW(19, 0), 0.4); wear.coat(S, O, [PW(19, 0), PW(19, 2), PW(20, 0)]);
  sparkle(S, ...O.at([0, -200]), PW(19, 0) + 0.3, 0.8); O.bob(S.start + 0.3, S.end - 0.3, 7);
  bibiTo(S, B, bsh, -330, PW(20, 1), 1.8); bounce(S, B.g, PW(20, 3), S.end - 0.3, 14);
  hearts(S, PW(20, 5), [[1150, 560, 0.7], [1240, 520, 0.9], [1100, 500, 0.6]]);
  [arm(O, 0, -1), arm(O, 1, -1)].forEach((A) => { O.raise(A, 45, PW(20, 5) - 0.2, 0.5); });
  const c = DS.card(S, "COAT", 1440, 200, { size: DS.type.title, t: PW(19, 0) }); S.fadeOut(c.g, PW(20, 0) - 0.3, 0.4);
  mid(S, S.start + 0.1); S.zoom(1000, 560, 1.3, PW(20, 1), 1.4);
  DS.vignette(S); }

// 8  tag 4 + break (119.7-141): both dressed up so far; in the break Bibi fetches the hat from the pillow and walks it over
{ const S = scene(cu(21), cu(24), { cam: "none" });
  const { O, B, bsh, bed } = stage(S, { on: ["pants", "shirt", "socks", "shoes", "coat"], mouth: "smile", snow: S.start });
  O.sing(PW(21, 0), PWE(21, 6)); sing(O, 22); dance(S, O, S.start + 0.3, lineEnd(22), 9);
  O.hop(PWE(22, 4) - 0.2, 40);
  O.bob(lineEnd(22) + 0.4, S.end - 0.3, 6);
  const go = lineEnd(22) + 1.6, hat = S.grp(); icon(S, "hat", 1590, 640, 0.9, hat);   // Bibi's hat: it rides along with her (own group: GSAP x is absolute)
  tl.set(hat, { opacity: 0 }, S.start); tl.set(hat, { opacity: 1 }, go - 0.4); S.fadeOut(bed.hat, go - 0.4, 0.3);
  bibiTo(S, B, bsh, -310, go, 3); S.move(hat, go, 3, { x: -310 }, "sine.inOut");
  mid(S, S.start + 0.1); close(S, PW(22, 0) - 0.7); wide(S, lineEnd(22) + 0.6); S.zoom(1200, 560, 1.25, go - 0.4, 1.6);
  DS.vignette(S); }

// 9  hat (141-150.9): Bibi puts the red hat on, pat pat pat, "what a nice red hat!" - close on his face and hat
{ const S = scene(cu(24), cu(26), { cam: "none" });
  const { O, B, bsh } = stage(S, { on: ["pants", "shirt", "socks", "shoes", "coat"], mouth: "smile", snow: S.start, bx: -310 });
  const hat = S.grp(); icon(S, "hat", 1280, 640, 0.9, hat); S.fadeOut(hat, PW(24, 0), 0.3);
  wear.hat(S, O, [PW(24, 0)]); sparkle(S, ...O.at([0, -560]), PW(24, 0) + 0.4, 0.9);
  const A = arm(O, 1, 1); reach(O, A, -135, -480, PW(24, 3) - 0.4, 0.5); O.wiggle([4], PW(24, 4) - 0.1, PWE(24, 6), 8, BEAT / 2); O.raise(A, 0, PW(25, 0), 0.6);
  swing(S, O.hat, PW(24, 4), PWE(24, 6), { rotation: 3, svgOrigin: "0 -450" }, BEAT / 2);
  sing(O, 25); O.bob(S.start + 0.3, S.end - 0.3, 7); bounce(S, B.g, PW(24, 4), S.end - 0.3, 14);
  const c = DS.card(S, "HAT", 1440, 200, { size: DS.type.title, t: PW(24, 0) }); S.fadeOut(c.g, PW(25, 0) - 0.6, 0.4);
  mid(S, S.start + 0.1); close(S, PW(25, 0) - 0.5);
  DS.vignette(S); }

// 10 final hook x2 (150.9-170): all dressed, eight arms swing up one by one, Bibi dances, hearts, a close-up for the last "ready to go!"
{ const S = scene(cu(26), cu(30), { cam: "none" });
  const { O, B } = stage(S, { on: ["pants", "shirt", "socks", "shoes", "coat", "hat"], mouth: "smile", snow: S.start, bx: -310 });
  O.sing(PW(26, 0), PWE(26, 6)); sing(O, 27); O.sing(PW(28, 0), PWE(28, 6)); sing(O, 29);
  dance(S, O, S.start + 0.3, S.end - 0.3, 9);
  const T = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => PW(28, i < 7 ? Math.min(i, 6) : 6) + (i > 6 ? 0.3 : 0));
  O.arms.forEach((A, i) => { const a = [125, 98, 72][Math.min(A.ai, 2)] * (A.ai === 3 ? 0.55 : 1); O.raise(A, a, T[i] - 0.3, 0.6); });
  O.hop(PW(29, 4) - 0.1, 70, 0.6); hearts(S, PW(28, 0) + 0.5, [[1290, 620, 0.8], [1370, 580, 0.9], [560, 600, 0.7]]);
  hearts(S, PW(29, 0), [[1260, 640, 0.9], [1330, 600, 0.7], [600, 640, 0.8]]);
  bounce(S, B.g, S.start + 0.4, S.end - 0.3, 20); waveB(S, B, PW(28, 0), S.end - 0.3);
  mid(S, S.start + 0.1); close(S, PW(27, 0) - 0.7); wide(S, PW(28, 0) - 0.4); close(S, PW(29, 0) - 0.6);
  DS.vignette(S); }

// 11 outro (170-177.6): the door swings open on a sunny morning; "Eight arms dressed!" - all eight arms wave bye-bye
{ const S = scene(cu(30), TOTAL, { cam: "none" });
  const { O, B } = stage(S, { on: ["pants", "shirt", "socks", "shoes", "coat", "hat"], mouth: "grin", open: true, bx: -150 });
  O.arms.forEach((A, i) => O.raise(A, [125, 98, 72, 40][A.ai], PW(30, 0) - 0.2 + i * 0.12, 0.5));
  O.wiggle(ALL, PW(30, 3), S.end - 0.4, 10, BEAT); O.bob(S.start + 0.3, S.end - 0.3, 8); waveB(S, B, S.start + 0.4, S.end - 0.3);
  hearts(S, PW(30, 0) + 0.3, [[1290, 620, 0.9], [1360, 580, 0.7], [560, 600, 0.7]]);
  const c = DS.card(S, "EIGHT ARMS DRESSED!", 450, 140, { size: DS.type.small, t: PW(30, 0) }); S.fadeOut(c.g, PW(30, 3) - 0.2, 0.4);
  const b = DS.card(S, "BYE-BYE!", 330, 150, { size: DS.type.title, t: PW(30, 3) });
  S.text("Tiny Tune Town", 1470, 170, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: Math.max(PW(30, 3) + 1, S.end - 2.5) });
  DS.vignette(S); }
