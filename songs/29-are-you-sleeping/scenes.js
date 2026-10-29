// look: still
// @include ../../tools/cast.js
// 29 Are You Sleeping? (original words; tune idea from the public-domain round). A sleepy bedroom at dawn: Ollie, Bibi, the fish in
// its bowl and the sun are all still asleep (closed eyes, drifting Z's). A bell swings on "ding, dang, dong" (sound cards), and each
// pass wakes the next friend: Ollie, Bibi, the fish, the sun (it kicks off its nightcap on "Peek-a-boo!"). Finale: everyone awake.
// Camera: wide at each pass, medium two-shot or insert on the slot friend, Ollie's face on every bell line (the hook).
// No hard cuts, nothing under 4 s. Cues are PW(line, word); scene boundaries use pcut(line) so a real take re-times everything.
// ---- take remap (planned line -> sung clip number, or {t: seconds} for a break the singer dropped) ----
const PLAN = [null, 1, 2, 3, 4, 5, 6, 7, 8, 11, 12, {"t": 68.073}, 13, 14, 15, 16, {"t": 85.053}, {"t": 90.803}, 17, 18, 19, 20, 21, 22, 23, 24, 25];
const PWN = (c) => TIMING.words.filter((x) => x[0] === PLAN[c]).length;
const PW = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + i * 0.3 : W(PLAN[c], Math.min(i, PWN(c) - 1)));
const PCLIP = (c) => (typeof PLAN[c] === "object" ? [PLAN[c].t, PLAN[c].t + 1.2] : CLIP(PLAN[c]));
const pcut = (c, i = 0) => PW(c, i) - 0.35;
const PWE = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + 0.4 + i * 0.3 : WE(PLAN[c], Math.min(i, PWN(c) - 1)));

BEAT = 60 / 96;
// script.json clips (1-based): 1 intro | 2-5 Ollie (6 "Zzz! Snore!") | 7-10 Bibi (11 "Shh! Dreaming!") | 12-15 fish (16 "Blub! Yawn!")
//   | 17-20 sun (21 "Peek-a-boo!") | 22-25 chorus | 26 outro
const OX = 860, OGY = 940, OK = 1.2, FACE = [860, 538];     // Ollie in bed (head centre ~538)
const BX = 1500, BHY = 600, BK = 0.7, BFACE = [1380, 610];  // Bibi in her bed
const WIN = [1110, 150, 320, 360], SX = 1270;               // window and the sun's x
const FB = [320, 690], BELL = [640, 100];                   // fish bowl centre; the bell hangs from the ceiling here
// put target T on the screen centre at zoom k (S.zoom keeps its own point fixed, so solve for that point)
const look = (S, T, k, t, dur = 1.3) => {                  // clamp so the view never runs past the room (-200..2120 x -200..1280)
  if (k === 1) return S.zoom(960, 540, 1, t, dur);
  const x = Math.min(Math.max(T[0], -200 + 960 / k), 2120 - 960 / k), y = Math.min(Math.max(T[1], -200 + 540 / k), 1280 - 540 / k);
  return S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur);
};
const wide = (S, t) => look(S, FACE, 1, t), two = (S, t) => look(S, [1180, 580], 1.3, t), close = (S, t) => look(S, FACE, 1.4, t);
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
let CPN = 0;

// ---------- set pieces ----------
const dawn = (S, off) => {                                  // a soft lilac dawn tint over the room; lifts when the sun wakes
  const r = S.fill(rect(-200, -200, 2320, 1480), S.start, 0, DS.c("purple", 1), 0.2);
  if (off !== undefined) tl.fromTo(r, { opacity: 0.2 }, { opacity: 0, duration: 3, ease: "power1.inOut", immediateRender: false }, off);
};
const quilt = (S, x0, x1, y0, name, patch) => {
  DS.shape(S, rrect(x0, y0, x1 - x0, 420, DS.r.lg), name);
  DS.shape(S, rrect(x0 - 8, y0 - 6, x1 - x0 + 16, 46, DS.r.md), "white", { w: "mid" });                     // folded sheet
  [0.25, 0.5, 0.75].forEach((f) => S.draw(`M${x0 + (x1 - x0) * f} ${y0 + 50} V${y0 + 400}`, S.start, 0, { c: DS.c(name, 2), w: DS.w.detail }));
  [[0.1, 90], [0.6, 170]].forEach(([f, dy]) => DS.shape(S, rrect(x0 + (x1 - x0) * f, y0 + dy, 96, 80, DS.r.sm), patch, { flat: true, w: "detail" }));
};
const bed = (S, x0, x1, top) => DS.shape(S, rrect(x0, top, x1 - x0, 420, DS.r.lg), "wood");             // headboard
const bell = (S) => {
  const [px, py] = BELL, g = G(S, null, `rotate(0 ${px} ${py})`);
  S.draw(`M${px} ${py} V${py + 128}`, S.start, 0, { c: DS.c("brown", 1), w: DS.w.mid, parent: g });
  DS.shape(S, `M584 318 Q588 232 640 226 Q692 232 696 318 L716 336 H564 Z`, "gold", { parent: g });
  DS.shape(S, circ(640, 224, 12), "gold", { parent: g, w: "detail" });
  DS.shape(S, circ(640, 344, 14), "brown", { parent: g, w: "detail" });
  return { ring: (t) => tw(g, t, 0.9, `rotate(0 ${px} ${py})`, `rotate(11 ${px} ${py})`, wave(1.5)) };
};
// "DING" "DANG" "DONG" cards on the three bell words (line c, words 2-4)
const dings = (S, c, i0 = 2) => [["DING", 830], ["DANG", 1050], ["DONG", 1270]].forEach(([w, x], i) => {
  const t = PW(c, i0 + i); S.fadeOut(DS.card(S, w, x, 235, { size: DS.type.body, t, fill: "yellow" }).g, t + 0.9, 0.3);
});
const zzz = (S, x, y, t0, t1) => [40, 52, 64].forEach((size, i) => {                                      // three Z's drift up and fade, on a loop
  const g = G(S, null, "translate(0 0)"); g.setAttribute("opacity", 0);
  S.text("Z", x + i * 30, y - i * 50, { size, c: DS.P.white[0], halo: DS.c("blue", 2), haloW: 0.16, t: S.start, dur: 0.01, parent: g });
  for (let t = t0 + i * 0.6; t < t1 - 1.9; t += 2.6) {
    tl.fromTo(g, { opacity: 0, attr: { transform: "translate(0 16)" } }, { opacity: 1, attr: { transform: "translate(10 -8)" }, duration: 0.9, ease: "sine.out", immediateRender: false }, t);
    tl.fromTo(g, { opacity: 1, attr: { transform: "translate(10 -8)" } }, { opacity: 0, attr: { transform: "translate(24 -36)" }, duration: 0.9, ease: "sine.in", immediateRender: false }, t + 1.0);
  }
});
// closed eyelids on a pink body: a pink ellipse over each eye plus a sleepy curve; lifts at the wake time
const lidsOllie = (S, O) => {
  const g = G(S, O.body);
  [-1, 1].forEach((s) => { S.fill(circ(58 * s, -330, 44, 53), S.start, 0, DS.c("pink", 0), 1, g); S.draw(`M${58 * s - 34} -322 Q${58 * s} -294 ${58 * s + 34} -322`, S.start, 0, { c: DS.line(), w: DS.w.near, parent: g }); });
  return g;
};
const lidsBibi = (S, B) => {
  const g = G(S, B.g), k = BK;
  [-1, 1].forEach((s) => { const x = BX + s * 46 * k; S.fill(circ(x, BHY - 6 * k, 25 * k, 32 * k), S.start, 0, DS.c("pink", 0), 1, g); S.draw(`M${x - 20 * k} ${BHY} Q${x} ${BHY + 20 * k} ${x + 20 * k} ${BHY}`, S.start, 0, { c: DS.line(), w: DS.w.near, parent: g }); });
  return g;
};
const lift = (g, t) => tl.fromTo(g, { opacity: 1 }, { opacity: 0, duration: 0.5, ease: "power1.inOut", immediateRender: false }, t);

// the sun behind the window: a clipped sky, the sun on a hill in a nightcap; asleep it sits low, awake it rises with rays and a glow
const sunK = (S, up) => {
  const id = "c29-" + ++CPN, cp = el("clipPath", { id }, dsDefs()); el("rect", { x: WIN[0], y: WIN[1], width: WIN[2], height: WIN[3] }, cp);
  const cg = G(S, null); cg.setAttribute("clip-path", `url(#${id})`);
  const y0 = up ? 385 : 440, sg = G(S, cg, "translate(0 0)");
  const glow = S.fill(circ(SX, y0, 230), S.start, 0, DS.glow(DS.P.yellow[1], 0.8), 1, sg); glow.setAttribute("opacity", up ? 1 : 0);
  const rays_ = S.draw(rays(SX, y0, 88, 122, 12), S.start, 0, { c: DS.c("yellow", 2), w: DS.w.mid, parent: sg }); rays_.setAttribute("opacity", up ? 1 : 0);
  DS.shape(S, circ(SX, y0, 72), "yellow", { parent: sg });
  [-1, 1].forEach((s) => S.fill(circ(SX + s * 46, y0 + 20, 14, 9), S.start, 0, DS.c("orange", 1), 0.55, sg));
  const shut = G(S, sg), open = G(S, sg); open.setAttribute("opacity", up ? 1 : 0); shut.setAttribute("opacity", up ? 0 : 1);
  [-1, 1].forEach((s) => {
    S.draw(`M${SX + s * 22 - 14} ${y0 - 4} Q${SX + s * 22} ${y0 + 10} ${SX + s * 22 + 14} ${y0 - 4}`, S.start, 0, { c: DS.line(), w: DS.w.near, parent: shut });
    S.fill(circ(SX + s * 22, y0 - 4, 9, 12), S.start, 0, DS.P.ink[0], 1, open); S.fill(circ(SX + s * 22 - 3, y0 - 8, 3.5), S.start, 0, DS.P.white[0], 1, open);
  });
  S.draw(`M${SX - 16} ${y0 + 26} Q${SX} ${y0 + 42} ${SX + 16} ${y0 + 26}`, S.start, 0, { c: DS.line(), w: DS.w.near, parent: open });
  const cap = G(S, sg, "translate(0 0)");
  if (!up) {
    DS.shape(S, `M${SX - 66} ${y0 - 40} Q${SX - 30} ${y0 - 150} ${SX + 70} ${y0 - 124} Q${SX + 10} ${y0 - 100} ${SX + 68} ${y0 - 40} Z`, "blue", { parent: cap });
    DS.shape(S, circ(SX + 72, y0 - 124, 18), "white", { parent: cap, w: "detail" });
    DS.shape(S, rrect(SX - 76, y0 - 52, 152, 26, DS.r.sm), "white", { parent: cap, w: "mid" });
  }
  DS.shape(S, circ(SX - 10, y0 + 150, 250, 118), "grass", { parent: cg });                                // the hill (in front of the sun)
  DS.shape(S, circ(SX - 130, y0 + 150, 120, 90), "grass", { parent: cg, tone: 1 });
  return {
    wake: (t) => {                                                                                       // "Peek-a-boo!": cap off, eyes open, up she rises
      tl.fromTo(sg, { attr: { transform: "translate(0 0)" } }, { attr: { transform: "translate(0 -55)" }, duration: 1.8, ease: "power2.out", immediateRender: false }, t);
      tl.fromTo(cap, { opacity: 1, attr: { transform: "translate(0 0)" } }, { opacity: 0, attr: { transform: "translate(90 -90)" }, duration: 1.4, ease: "power1.in", immediateRender: false }, t);
      tl.set(open, { opacity: 1 }, t + 0.3); tl.set(shut, { opacity: 0 }, t + 0.3);
      tl.fromTo([glow, rays_], { opacity: 0 }, { opacity: 1, duration: 1.8, ease: "power1.out", immediateRender: false }, t + 0.4);
    },
  };
};
// the fish bowl on a bedside table; the fish sleeps with closed eyes until it wakes
const fishK = (S, up) => {
  const [bx, by] = FB, r = 110;
  DS.shape(S, rrect(bx - 150, by + 112, 300, 22, DS.r.sm), "wood", { w: "mid" });
  [-110, 110].forEach((dx) => DS.shape(S, rrect(bx + dx - 14, by + 134, 28, 250, DS.r.xs), "wood", { w: "detail" }));
  S.draw(circ(bx, by, r), S.start, 0, { fill: DS.c("sky", 1), c: DS.line(), w: DS.w.mid, op: 0.7 });
  S.fill(`M${bx - 96} ${by + 56} Q${bx} ${by + 40} ${bx + 96} ${by + 56} A${r} ${r} 0 0 1 ${bx - 96} ${by + 56} Z`, S.start, 0, DS.c("sand", 0), 1);
  const F = fish(S, bx, by - 4, 0.5, "orange", 1);
  const lid = G(S, F.bob);
  S.fill(circ(36, -12, 20), S.start, 0, DS.c("orange", 0), 1, lid); S.draw("M24 -8 Q36 6 48 -8", S.start, 0, { c: DS.line(), w: DS.w.mid, parent: lid });
  if (up) lid.setAttribute("opacity", 0);
  S.draw(`M${bx - 70} ${by - 80} Q${bx} ${by - 112} ${bx + 70} ${by - 80}`, S.start, 0, { c: DS.P.white[0], w: DS.w.mid, op: 0.8 });   // glass shine
  return { F, lid, wake: (t) => { lift(lid, t); [0, 1, 2].forEach((i) => bubble(S, bx - 30 + i * 18, by - 60, 10 + i * 4, 120, { t: t + i * 0.5 })); F.swim(t + 1, S.end, 14); } };
};

// the bedroom: o = { O, B, F, sun } each "z" (asleep) or "up" (awake); draw(K) runs before the quilts
const bedroom = (S, o = {}, draw) => {
  DS.room(S, { wall: "wall", floor: "floor", window: WIN });
  dawn(S, o.dawnOff);
  const sn = sunK(S, o.sun === "up"), bl = bell(S), fk = fishK(S, o.F === "up");
  bed(S, 500, 1220, 430); bed(S, 1340, 1690, 470);
  const B = bibi(S, BX, BHY, { k: BK, mood: o.bibiMood, paws: o.B === "up" ? [[BX - 110 * BK, BHY + 150 * BK], [BX + 120 * BK, BHY + 90 * BK]] : [null, null] });
  const O = ollie(S, OX, OGY, OK, { mouth: o.mouth || "smile", look: o.look || 0 });
  const lo = o.O === "z" ? lidsOllie(S, O) : null, lb = o.B === "z" ? lidsBibi(S, B) : null;
  const K = { O, B, F: fk.F, bl, sn, fk, lo, lb };
  if (o.O === "up") armsUp(S, O);
  if (draw) draw(K);
  quilt(S, 440, 1280, 700, "sky", "yellow"); quilt(S, 1330, 1700, 700, "pink", "grass");
  return K;
};
const armsUp = (S, O) => O.arms.filter((A) => A.ai < 3).forEach((A) => O.raise(A, [125, 98, 72][A.ai], S.start + 0.01, 0.01));
const sing = (O, c) => O.sing(PCLIP(c)[0], PCLIP(c)[1]);
// Ollie stretches: the arms swing up and wiggle, a yawn, then he is awake (call with the time his arms start up)
const stretch = (S, O, t, end) => {
  O.arms.filter((A) => A.ai < 3).forEach((A, i) => O.raise(A, [125, 98, 72][A.ai], t + (i % 3) * 0.15, 0.9));
  O.sing(t, t + 1.6); O.wiggle([1, 2, 3, 4], t + 1, end, 14, BEAT);
};
const waveB = (S, B, t0, t1) => swing(S, B.R, t0, t1, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
const happy = (S, O, B, t) => { sparkle(S, ...O.at([-190, -430]), t, 0.8); sparkle(S, BX + 90, BHY - 150, t + 0.3, 0.7); };

// 0  intro (0 to pcut(2)): everyone asleep in the lilac dawn; Z's drift; the camera eases toward Ollie's bed
{ const S = scene(0, pcut(2), { cam: "none" });
  const K = bedroom(S, { O: "z", B: "z", F: "z", sun: "z" });
  zzz(S, 1055, 430, 0.4, S.end); zzz(S, 1610, 520, 1.0, S.end); zzz(S, 430, 560, 1.6, S.end); zzz(S, 1250, 340, 0.8, S.end);
  K.O.bob(S.start + 0.3, S.end, 6); K.fk.F.swim(S.start + 0.3, S.end, 6);
  S.zoom(960, 540, 1.0, 0.01, 0.01); look(S, [900, 560], 1.18, S.end - 3.2, 3);
  DS.vignette(S); }

// 1  pass 1 OLLIE (pcut(2) to pcut(6)): "Is Ollie still in bed?" - bell rings, Ollie opens his eyes on "sing along", stretches and yawns in the break
{ const S = scene(pcut(2), pcut(6), { cam: "none" }), eyes = PCLIP(5)[0], br = PCLIP(5)[1];
  const K = bedroom(S, { O: "z", B: "z", F: "z", sun: "z" });
  zzz(S, 1055, 430, S.start, eyes + 0.2); zzz(S, 1610, 520, S.start + 0.5, S.end); zzz(S, 430, 560, S.start + 1, S.end); zzz(S, 1250, 340, S.start + 0.4, S.end);
  K.O.bob(S.start + 0.3, eyes, 6);
  [2, 3, 4].forEach((i) => K.bl.ring(PW(4, i)));
  dings(S, 4);
  lift(K.lo, eyes + 0.4); sing(K.O, 5); sing(K.O, 4);
  stretch(S, K.O, br + 0.3, S.end - 0.4); K.O.bob(br + 1.2, S.end, 10);
  sparkle(S, ...K.O.at([-190, -430]), br + 1.4, 0.8);
  look(S, FACE, 1.2, PW(3, 0), 1.3); close(S, PW(4, 0) - 0.6); look(S, FACE, 1.7, PW(5, 0) - 0.2, 1.5); wide(S, br + 0.2);
  look(S, [1180, 580], 1.3, S.end - 2.6, 2);                               // glide toward Bibi: the next sleepyhead
  DS.vignette(S); }

// 2  pass 2 BIBI (pcut(6) to pcut(11)): "Zzz! Snore!" on Bibi; Ollie (awake, waving) rings the bell; Bibi wakes on "sing along" and waves
{ const S = scene(pcut(6), pcut(11), { cam: "none" }), wk = PCLIP(10)[0] + 0.3, br = PCLIP(10)[1];
  const K = bedroom(S, { O: "up", B: "z", F: "z", sun: "z", mouth: "smile" });
  zzz(S, 1610, 500, S.start, wk); zzz(S, 430, 560, S.start + 0.5, S.end); zzz(S, 1250, 340, S.start + 0.2, S.end);
  K.O.wiggle([1, 2, 3, 4], S.start + 0.4, S.end - 0.4, 12, BEAT); K.O.bob(S.start + 0.3, S.end, 8);
  [2, 3, 4].forEach((i) => K.bl.ring(PW(9, i))); dings(S, 9); sing(K.O, 9); sing(K.O, 10);
  lift(K.lb, wk); const L = bibiArm(S, K.B, -1, BX - 150 * BK, BHY + 40 * BK, wk + 0.4), R = bibiArm(S, K.B, 1, BX + 150 * BK, BHY + 20 * BK, wk + 0.4);
  swing(S, R, wk + 1.4, S.end - 0.3, { rotation: -14, svgOrigin: `${BX + 82 * BK} ${BHY + 150 * BK}` }, BEAT);
  tw(K.B.g, wk + 0.2, 0.6, "translate(0 0)", "translate(0 -30)", hump(1)); sparkle(S, BX + 90, BHY - 150, wk + 0.8, 0.8);
  look(S, BFACE, 1.5, S.start, 0.01); two(S, PW(7, 0) + 2);
  close(S, PW(9, 0) - 0.6); two(S, wk - 0.3); wide(S, br + 0.3); look(S, [1100, 570], 1.12, S.end - 5, 5);
  DS.vignette(S); }

// 3  pass 3 FISH (pcut(11) to pcut(16)): "Shh! Dreaming!" - the camera sneaks to the bowl; Ollie and Bibi (awake) ring the bell; Ollie's face on the tag
{ const S = scene(pcut(11), pcut(16), { cam: "none" });
  const K = bedroom(S, { O: "up", B: "up", F: "z", sun: "z" });
  zzz(S, 440, 560, S.start, S.end); zzz(S, 1250, 340, S.start + 0.3, S.end);
  K.O.wiggle([1, 2, 3, 4], S.start + 0.4, S.end - 0.4, 12, BEAT); K.O.bob(S.start + 0.3, S.end, 8); waveB(S, K.B, S.start + 0.6, S.end - 0.4);
  K.fk.F.swim(S.start, S.end, 4);
  [2, 3, 4].forEach((i) => K.bl.ring(PW(14, i))); dings(S, 14); sing(K.O, 14); sing(K.O, 15);
  look(S, FB, 1.45, S.start, 0.01); wide(S, PW(12, 0) + 2);
  close(S, PW(14, 0) - 0.6); look(S, FACE, 1.7, PW(15, 0) - 0.2, 1.5); two(S, PCLIP(15)[1] + 0.2); look(S, FB, 1.4, S.end - 4.5, 2.4);                // sneak back to the bowl for "Blub!"
  DS.vignette(S); }

// 4  pass 4 SUN (pcut(16) to pcut(21)): "Blub! Yawn!" - the fish wakes; then "Is the sun still in bed?", the window, bell, tag
{ const S = scene(pcut(16), pcut(21), { cam: "none" }), fw = PW(16, 0) + 0.2;
  const K = bedroom(S, { O: "up", B: "up", F: "z", sun: "z" });
  zzz(S, 440, 560, S.start, fw); zzz(S, 1250, 340, S.start + 0.3, S.end);
  K.O.wiggle([1, 2, 3, 4], S.start + 0.4, S.end - 0.4, 12, BEAT); K.O.bob(S.start + 0.3, S.end, 8); waveB(S, K.B, S.start + 0.6, S.end - 0.4);
  K.fk.wake(fw);
  [2, 3, 4].forEach((i) => K.bl.ring(PW(19, i))); dings(S, 19); sing(K.O, 19); sing(K.O, 20);
  look(S, FB, 1.4, S.start, 0.01); look(S, [1270, 420], 1.5, PW(17, 0) + 2, 1.5); wide(S, PW(18, 0) - 0.2); close(S, PW(19, 0) - 0.6);
  wide(S, PCLIP(20)[1] + 0.3); look(S, [1270, 420], 1.5, S.end - 4.5, 2.4);
  DS.vignette(S); }

// 5  PEEK-A-BOO + chorus (pcut(21) to pcut(26)): the sun kicks off its cap and rises, the lilac tint lifts, everyone cheers; face close-up on the "Hooray" lines
{ const S = scene(pcut(21), pcut(26), { cam: "none" }), pk = PW(21, 0) + 0.1;
  const K = bedroom(S, { O: "up", B: "up", F: "up", sun: "z", dawnOff: pk });
  K.sn.wake(pk);
  zzz(S, 1250, 340, S.start, pk);
  K.O.wiggle([1, 2, 3, 4, 5, 6], S.start + 0.4, S.end - 0.4, 14, BEAT); K.O.bob(S.start + 0.3, S.end, 10); waveB(S, K.B, S.start + 0.6, S.end - 0.4);
  K.fk.F.swim(S.start, S.end, 10);
  sparkle(S, 1210, 300, pk + 1.4, 1); sparkle(S, 1340, 280, pk + 1.8, 0.8);
  [22, 23].forEach((c) => sing(K.O, c)); sing(K.O, 24); sing(K.O, 25);
  hearts(S, PW(24, 0), [[600, 360, 0.7], [1500, 330, 0.8], [1060, 250, 0.6]]);
  look(S, [1270, 420], 1.5, S.start, 0.01); wide(S, pk + 4.4); close(S, PW(24, 0) - 0.5); look(S, FACE, 1.7, PW(25, 0) - 0.2, 1.5);
  DS.vignette(S); }

// 6  outro (pcut(26) to the end): the bell rings one last time, everyone waves bye-bye in the bright morning; brand line at the end
{ const S = scene(pcut(26), TOTAL, { cam: "none" });
  const K = bedroom(S, { O: "up", B: "up", F: "up", sun: "up", mouth: "smile" });
  K.O.wiggle([1, 2, 3, 4, 5, 6], S.start + 0.4, S.end - 1, 14, BEAT); K.O.bob(S.start + 0.3, S.end, 10); waveB(S, K.B, S.start + 0.5, S.end - 1);
  K.fk.F.swim(S.start, S.end, 10);
  K.O.grin(S.start + 0.3);
  [0, 1, 2].forEach((i) => K.bl.ring(PW(26, i)));
  dings(S, 26, 0);
  [[560, 400, 0.7], [1500, 350, 0.8]].forEach(([x, y, k], i) => sparkle(S, x, y, S.start + 1 + i * 0.5, k));
  look(S, FACE, 1.25, S.start, 0.01); wide(S, S.start + 4.5);
  S.fadeOut(DS.card(S, "BYE-BYE!", 1040, 280, { size: DS.type.title, t: Math.max(PW(26, 3), TOTAL - 7) }).g, S.end - 0.8, 0.4);
  S.text("Tiny Tune Town", 960, 130, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.end - 4.5 });
  DS.vignette(S); }
