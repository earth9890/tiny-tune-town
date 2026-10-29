// look: still
// @include ../../tools/cast.js
// @include octo.js
// 27 Rain, Rain, Go Away (public domain rhyme). A grey rainy day in Ollie's living room: each pass one family member or friend
// wants to play (Daddy builds a blanket fort, Mummy dances, Bibi drums on pots, Baby plays peek-a-boo), then everyone gathers at
// the window, the rain stops, the sun and a rainbow come out, and the chorus runs outside: boots on, splash splash splash.
// Camera per pass: face close-up on line A (hook) -> window insert on B (rain) -> the partner on C -> face close-up on D (hook).
// Breaks: wide, the story beat by scene fraction (the spoken word's time is not known before the take).
// ---- take remap (planned line -> sung clip number, or {t: seconds} for a break the singer dropped) ----
const PLAN = [null, {"t": 6.333}, 1, 2, 3, 4, 5, 6, 7, 8, 9, {"t": 62.503}, 13, 14, 15, 16, {"t": 86.083}, 17, 18, 19, 21, 23, 24, 25, 26, 27, 28];
const PWN = (c) => TIMING.words.filter((x) => x[0] === PLAN[c]).length;
const PW = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + i * 0.3 : W(PLAN[c], Math.min(i, PWN(c) - 1)));
const PCLIP = (c) => (typeof PLAN[c] === "object" ? [PLAN[c].t, PLAN[c].t + 1.2] : CLIP(PLAN[c]));
const PWE = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + 0.4 + i * 0.3 : WE(PLAN[c], Math.min(i, PWN(c) - 1)));

BEAT = 60 / 98;
const OX = 1000, FLOOR = 905, KO = 0.85, PX = 560;
const FACE = [OX, FLOOR - 330 * KO], WIN = [1090, 150, 400, 340], WINP = [1290, 320];
const wide = (S, t) => S.zoom(960, 540, 1, t, 1.3);
const face = (S, t, k = 1.6) => S.zoom(...FACE, k, t, 1.3);
// zoom so that point P lands on screen point Q (S.zoom scales about its anchor: P -> A + k(P - A))
const lookAt = (S, P, k, Q, t) => S.zoom((k * P[0] - Q[0]) / (k - 1), (k * P[1] - Q[1]) / (k - 1), k, t, 1.3);
const PS = (c) => PW(c, 0) - 0.3, PE = (c) => PWE(c + 3, 3) + 0.4;      // pass c..c+3: start / end of its scene
const sing = (O, c, n) => { for (let i = 0; i < n; i++) O.sing(PW(c, i), PWE(c, i)); };
const say = (S, str, t, t1) => S.fadeOut(DS.card(S, str, 760, 120, { size: DS.type.body, t }).g, t1, 0.4);
const ALL = [1, 2, 3, 4, 5, 6, 7, 8];
let RC = 0;

// ---------- the family: Ollie's octopus Daddy (blue, glasses), Mummy (purple, yellow bow), Baby (small, yellow, one curl) ----------
const glasses = (S, O) => { [-1, 1].forEach((s) => S.draw(circ(58 * s, -330, 54, 60), S.start, 0, { c: DS.line(), w: DS.w.near, parent: O.body })); S.draw("M-6 -338 Q0 -346 6 -338", S.start, 0, { c: DS.line(), w: DS.w.near, parent: O.body }); };
const bow = (S, O) => { [-1, 1].forEach((s) => DS.shape(S, `M-86 -478 L${-86 + s * 60} -506 Q${-86 + s * 74} -478 ${-86 + s * 60} -450 Z`, "yellow", { parent: O.body, w: "mid" })); DS.shape(S, circ(-86, -478, 16), "yellow", { parent: O.body, w: "mid" }); };
const curl = (S, O) => S.draw("M0 -492 Q-34 -548 0 -566 Q30 -578 34 -548", S.start, 0, { c: DS.line(), w: DS.w.near, parent: O.body });
const dad = (S, x, k = 1.1, o = {}) => { const O = octo("blue")(S, x, FLOOR, k, o); glasses(S, O); return O; };
const mum = (S, x, k = 1, o = {}) => { const O = octo("purple")(S, x, FLOOR, k, o); bow(S, O); return O; };
const baby = (S, x, k = 0.6, o = {}) => { const O = octo("yellow")(S, x, FLOOR, k, o); curl(S, O); return O; };
const ollieAt = (S, o = {}) => ollie(S, OX, FLOOR, KO, o);
// rain boots on the four inner arm tips (fade in at t), toes pointing outward
const boots = (S, O, name, t) => O.arms.filter((A) => A.ai > 1).forEach((A) => {
  const [tx, ty] = A.tip, d = A.side === 1 ? -1 : 1, X = (dx) => K(tx + d * dx), g = S.grp(A.wig);
  DS.shape(S, `M${X(-22)} ${ty - 50} L${X(22)} ${ty - 50} L${X(22)} ${ty - 2} L${X(52)} ${ty - 2} Q${X(66)} ${ty + 4} ${X(58)} ${ty + 24} L${X(-22)} ${ty + 24} Z`, name, { parent: g, w: "mid" });
  S.draw(`M${X(-22)} ${ty + 14} L${X(58)} ${ty + 14}`, S.start, 0, { c: DS.P.white[0], w: DS.w.detail, parent: g });
  fadeIn(S, g, t);
});
const bootsB = (S, B, t) => { const g = S.grp(B.g), y = B.hy + 325 * B.k; [-1, 1].forEach((d) => DS.shape(S, rrect(B.x + d * 62 * B.k - 30, y - 34, 60, 52, DS.r.sm), "red", { parent: g, w: "mid" })); fadeIn(S, g, t); };

// ---------- the living room ----------
const rainFx = (S, x, y, w, h, t0, t1, per = 0.55) => {
  const id = "rc" + ++RC, cp = el("clipPath", { id }, dsDefs()); el("rect", { x, y, width: w, height: h }, cp);
  const g = S.grp(); g.setAttribute("clip-path", `url(#${id})`);
  const inner = S.grp(g);
  let d = ""; for (let gx = x - 10, i = 0; gx < x + w + 40; gx += 34, i++) for (let gy = y - 100 + ((i * 37) % 70); gy < y + h; gy += 100) d += `M${gx} ${gy} l-5 30 `;
  S.draw(d, S.start, 0, { c: DS.P.white[0], w: DS.w.mid, parent: inner, op: 0.75 });
  tl.fromTo(inner, { attr: { transform: "translate(0 0)" } }, { attr: { transform: "translate(0 100)" }, duration: per, ease: "none", repeat: Math.max(0, Math.ceil((t1 - t0) / per) - 1), immediateRender: false }, t0);
  return g;
};
// the window: grey sky + rain; H.sky2 / H.sun / H.rbow are hidden until the caller fades them in; H.rain fades out
const windowSet = (S, o) => {
  const [wx, wy, ww, wh] = WIN, H = {}, id = "wc" + ++RC, cp = el("clipPath", { id }, dsDefs()); el("rect", { x: wx, y: wy, width: ww, height: wh }, cp);
  DS.shape(S, rrect(wx - 18, wy - 18, ww + 36, wh + 36, DS.r.sm), "white", { layer: "mid", w: "mid" });
  const g = S.grp(); g.setAttribute("clip-path", `url(#${id})`);
  S.fill(rect(wx, wy, ww, wh), S.start, 0, DS.vgrad(DS.mix(DS.P.sky[2], DS.P.gray[0], 0.55), DS.mix(DS.P.sky[1], DS.P.gray[1], 0.6)), 1, g);
  H.clouds = S.grp(g); [[1170, 230, 90, 44], [1300, 200, 110, 54], [1410, 250, 90, 42], [1230, 300, 80, 36], [1360, 320, 90, 36]].forEach(([x, y, rx, ry]) => S.fill(circ(x, y, rx, ry), S.start, 0, DS.c("gray", 1), 0.9, H.clouds));
  H.sky2 = S.grp(g); H.sky2.setAttribute("opacity", 0);
  S.fill(rect(wx, wy, ww, wh), S.start, 0, DS.vgrad(DS.P.sky[2], DS.P.sky[1]), 1, H.sky2);
  S.fill(circ(1290, 520, 330, 80), S.start, 0, DS.c("grass", 0), 1, H.sky2);
  H.sun = S.grp(g); H.sun.setAttribute("opacity", 0);
  S.fill(circ(1420, 230, 110), S.start, 0, DS.glow(DS.P.yellow[1], 0.8), 1, H.sun); S.fill(circ(1420, 230, 38), S.start, 0, DS.c("yellow", 1), 1, H.sun);
  H.rbow = S.grp(g); H.rbow.setAttribute("opacity", 0);
  ["red", "orange", "yellow", "green", "blue", "purple"].forEach((n, i) => S.draw(arc(1290, 485, 172 - i * 14, 180, 360), S.start, 0, { c: DS.c(n, 0), w: DS.w.near * 2, parent: H.rbow }));
  H.rain = rainFx(S, wx, wy, ww, wh, S.start, o.rainEnd ?? S.end);
  S.draw(`M${wx + ww / 2} ${wy} V${wy + wh} M${wx} ${wy + wh / 2} H${wx + ww}`, S.start, 0, { c: DS.c("white", 0), w: DS.w.near });
  DS.shape(S, rrect(wx - 36, wy + wh + 18, ww + 72, 26, DS.r.xs), "white", { layer: "mid", w: "mid" });                       // sill
  [[wx - 100, 1], [wx + ww + 28, -1]].forEach(([x, s]) => {                                                                // curtains
    DS.shape(S, rrect(x, wy - 40, 72, wh + 110, DS.r.sm), "purple", { layer: "mid", w: "mid" });
    S.draw(`M${x + 24} ${wy - 30} V${wy + wh + 60} M${x + 48} ${wy - 30} V${wy + wh + 60}`, S.start, 0, { c: DS.c("purple", 2, "mid"), w: DS.w.detail, op: 0.6 });
    S.draw(`M${x - 6} ${wy + 220} H${x + 78}`, S.start, 0, { c: DS.c("yellow"), w: DS.w.near });
  });
  return H;
};
const sofa = (S) => {
  DS.shape(S, rrect(1040, 560, 540, 250, DS.r.md), "green", { layer: "mid" });
  [1020, 1520].forEach((x) => DS.shape(S, rrect(x, 650, 80, 190, DS.r.md), "green", { layer: "mid" }));
  DS.shape(S, rrect(1090, 710, 440, 120, DS.r.sm), "green", { layer: "mid", tone: 1, dir: "v" });
  [[1120, 598, "yellow"], [1400, 604, "pink"]].forEach(([x, y, c]) => DS.shape(S, rrect(x, y, 130, 116, DS.r.md), c, { layer: "mid" }));
  [1060, 1540].forEach((x) => DS.shape(S, rrect(x, 836, 26, 24, DS.r.xs), "wood", { layer: "mid", w: "detail" }));
};
// blanket fort at the back left; hidden until t (pops in then)
const fort = (S, t) => {
  const [, g] = popIn(S, t, 330, 800);
  DS.shadow(S, 330, 838, 560, { parent: g });
  DS.shape(S, "M130 838 L330 530 L530 838 Z", "orange", { layer: "mid", parent: g });
  [[210, 270], [390, 450]].forEach(([a, b]) => DS.shape(S, `M330 530 L${a} 838 L${b} 838 Z`, "yellow", { layer: "mid", parent: g, flat: true, w: "detail" }));
  S.draw("M255 838 V760 Q330 690 405 760 V838 Z", S.start, 0, { fill: DS.c("brown", 0), c: DS.line(), w: DS.w.mid, parent: g });
  S.fill(circ(330, 800, 52, 40), S.start, 0, DS.c("yellow", 1), 0.45, g);
  S.draw("M330 530 V462", S.start, 0, { c: DS.line(), w: DS.w.mid, parent: g }); DS.shape(S, "M330 462 L396 484 L330 506 Z", "red", { parent: g, w: "detail" });
  DS.shape(S, rrect(84, 796, 120, 60, DS.r.md), "pink", { layer: "mid", parent: g }); DS.shape(S, rrect(470, 806, 100, 52, DS.r.md), "sky", { layer: "mid", parent: g });
  return g;
};
// o: { fort: time the fort appears (omit = no fort), rainEnd, rain: false }
const living = (S, o = {}) => {
  DS.room(S, { window: false, wall: "dusk" });
  DS.frame(S, 520, 200, 200, 160, "sky"); DS.frame(S, 790, 250, 150, 150, "grass");
  const H = windowSet(S, o);
  DS.rug(S, 900, 960, 1200, "red");
  sofa(S);
  if (o.fort !== undefined) fort(S, o.fort);
  return H;
};

// ---------- props ----------
const spoon = (S, g, x, y) => { DS.shape(S, cap(x, y + 30, x - 26, y - 120, 9), "wood", { parent: g, w: "detail" }); DS.shape(S, circ(x, y + 46, 26, 20), "wood", { parent: g, w: "detail" }); };
const pot = (S, x, y, w, name) => { const g = S.grp(); DS.shape(S, rrect(x - w / 2, y, w, w * 0.6, DS.r.sm), name, { parent: g }); DS.shape(S, rrect(x - w / 2 - 8, y - 8, w + 16, 18, DS.r.xs), "gray", { parent: g, w: "detail" }); S.fill(rrect(x - w / 2 + 12, y + 14, 12, w * 0.3, DS.r.xs), S.start, 0, DS.P.white[0], 0.5, g); return g; };
const ripple = (S, x, y, rx, t) => { const g = S.grp(); S.draw(circ(x, y, rx, rx * 0.15), S.start, 0, { c: DS.P.white[0], w: DS.w.mid, parent: g }); const tf = (k) => `translate(${x} ${y}) scale(${k} ${k}) translate(${-x} ${-y})`;
  tl.fromTo(g, { opacity: 0.9, attr: { transform: tf(0.5) } }, { opacity: 0, attr: { transform: tf(1.5) }, duration: 0.9, ease: "power1.out" }, t); };
const splash = (S, x, y, t, k = 1) => [-3, -2, -1, 1, 2, 3].forEach((s, i) => {
  const g = S.grp(); DS.shape(S, `M${x} ${y - 24 * k} C${x + 16 * k} ${y - 4 * k} ${x + 14 * k} ${y + 12 * k} ${x} ${y + 12 * k} C${x - 14 * k} ${y + 12 * k} ${x - 16 * k} ${y - 4 * k} ${x} ${y - 24 * k} Z`, "glass", { parent: g, w: "detail" });
  tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.05 }, t);
  tw(g, t, 0.35, "translate(0 0)", `translate(${s * 34 * k} ${-(110 + (i % 2) * 40) * k})`, "power2.out");
  tw(g, t + 0.35, 0.35, `translate(${s * 34 * k} ${-(110 + (i % 2) * 40) * k})`, `translate(${s * 60 * k} 0)`, "power2.in");
  tl.to(g, { opacity: 0, duration: 0.15 }, t + 0.6); });

// =============================== scenes ===============================
// 0  intro: grey rainy window, Ollie sighs ("Drip, drop, drip, drop! Ooh!")
{ const S = scene(0, PS(2), { cam: "none" });
  living(S);
  const O = ollieAt(S, { look: 12 });
  O.bob(S.start + 0.4, S.end, 6); O.sing(PW(1, 4), PWE(1, 4));
  [[1190, 300], [1310, 270], [1400, 340], [1250, 390]].forEach(([x, y], i) => drop(S, x, y, PW(1, i), 1.2));
  lookAt(S, WINP, 1.35, [880, 430], 1.8); face(S, 4.6, 1.4);
  say(S, "RAINY DAY", 0.6, 1.6);
  DS.vignette(S); }



// one pass of the verse: Ollie sings the hook on lines A and D, the partner (who) arrives on line C, extra adds the partner's action.
// fortT: 0 = the fort is there from the start, a time = it pops up then, undefined = no fort yet
const pass = (c, fortT, who, pf, extra) => {
  const S = scene(PS(c), PE(c), { cam: "none" });
  living(S, { fort: fortT });
  const P = who(S, PW(c + 2, 0) - 0.2);
  const O = ollieAt(S); O.bob(S.start + 0.3, S.end, 6);
  sing(O, c, 4); sing(O, c + 3, 4);
  O.wiggle(ALL, PW(c, 0), PWE(c, 3), 10); O.wiggle(ALL, PW(c + 3, 0), PWE(c + 3, 3), 10);
  extra(S, O, P);
  face(S, S.start + 0.3); lookAt(S, WINP, 1.35, [880, 430], PW(c + 1, 0) - 0.6); lookAt(S, pf, 1.3, [820, 560], PW(c + 2, 0) - 0.6); face(S, PW(c + 3, 0) - 0.6);
  DS.vignette(S); return S;
};
// a break between passes: wide room, the partner (build) and Ollie play; extra places the story beats and shots by scene fraction
const brk = (c0, c1, fortT, build, extra) => {
  const S = scene(c0, c1, { cam: "none" });
  const H = living(S, { fort: fortT });
  const P = build(S); const O = ollieAt(S); O.bob(S.start + 0.3, S.end - 0.3, 8);
  S.zoom(...FACE, 1.05, S.start + 0.2, S.len * 0.25);   // a slow first push so the break never sits still
  extra(S, O, P, H);
  DS.vignette(S); return S;
};
const HOPS = (S, O, fr, h = 60) => fr.forEach((f) => O.hop(S.at(f), h));

// 1  pass 1 DADDY: he arrives on "Daddy", lifts his arms on "to play", and the blanket fort pops up behind him
pass(2, PWE(4, 3) + 0.2, (S, t) => dad(S, PX, 1.1, { t }), [PX, FLOOR - 330 * 1.1], (S, O, D) => {
  const t = PWE(4, 3) + 0.2;
  [D.arms[0], D.arms[1]].forEach((A) => D.raise(A, 105, PW(4, 1), 0.7));
  D.wiggle([1, 2], PW(4, 2), t + 2, 12); D.bob(PW(4, 0), S.end, 6);
  sparkle(S, 330, 520, t + 0.2, 1); sparkle(S, 470, 620, t + 0.5, 0.8);
});
// 2  break 1: "A blanket fort!" Daddy cheers, camera visits the fort, hearts float up
brk(PE(2), PS(7), 0, (S) => dad(S, PX, 1.1), (S, O, D) => {
  [D.arms[0], D.arms[1]].forEach((A) => D.raise(A, 105, S.start + 0.3, 0.7));
  D.wiggle(ALL, S.at(0.2), S.end - 0.5, 10); D.bob(S.start + 0.3, S.end - 0.3, 8);
  O.wiggle(ALL, S.at(0.2), S.end - 0.5, 10);
  lookAt(S, [330, 700], 1.3, [680, 560], S.at(0.3)); wide(S, S.at(0.72));
  say(S, "BLANKET FORT!", S.at(0.06), S.at(0.26));
  hearts(S, S.at(0.35), [[300, 600, 1.2], [420, 570, 0.9], [350, 650, 1]]);
});
// 3  pass 2 MUMMY: she dances in on "Mummy", hops on the beat
pass(7, 0, (S, t) => mum(S, PX, 1, { t }), [PX, FLOOR - 330], (S, O, M) => {
  M.wiggle(ALL, PW(9, 0), S.end - 0.4, 12); M.bob(PW(9, 0), S.end, 8);
  HOPS(S, M, [0.8, 0.86]);
});
// 4  break 2: "Dance, dance, dance!" Mummy and Ollie hop to the beat, hearts float up
brk(PE(7), PS(12), 0, (S) => mum(S, PX, 1), (S, O, M) => {
  M.wiggle(ALL, S.start + 0.3, S.end - 0.5, 14); O.wiggle(ALL, S.start + 0.3, S.end - 0.5, 14);
  [0.2, 0.34, 0.48, 0.62, 0.76].forEach((f, i) => { M.hop(S.at(f), 55); O.hop(S.at(f) + BEAT, 45); });
  lookAt(S, [PX, 560], 1.25, [820, 560], S.at(0.3)); wide(S, S.at(0.72));
  say(S, "DANCE!", S.at(0.06), S.at(0.26));
  hearts(S, S.at(0.3), [[520, 560, 1.2], [640, 520, 0.9], [900, 540, 1.1], [1050, 520, 0.9]]);
});
// 5  pass 3 BIBI: she hops in with a spoon in each paw and a pot to drum on
const drummer = (S, t) => {
  const hy = FLOOR - 325 * 0.85, B = bibi(S, PX, hy, { k: 0.85, mood: "joy", paws: [[PX - 150, 850], [PX + 150, 850]] });
  DS.shadow(S, PX, FLOOR, 280, { t }); popAt(B.g, t, PX, 700);
  B.sp = [B.L, B.R].map((A, i) => { const g = S.grp(A); spoon(S, g, PX + (i ? 150 : -150), 850); return g; });
  B.pots = [pot(S, PX - 150, 884, 130, "orange"), pot(S, PX + 150, 884, 130, "sky")]; B.pots.forEach((p) => fadeIn(S, p, t));
  return B;
};
const drum = (S, B, t0, t1) => {
  swing(S, B.L, t0, t1, { rotation: 14, svgOrigin: B.L.sh }, BEAT / 2); swing(S, B.R, t0, t1, { rotation: -14, svgOrigin: B.R.sh }, BEAT / 2);
  B.pots.forEach((p, i) => tw(p, t0 + (i ? BEAT / 4 : 0), t1 - t0 - BEAT / 4, "translate(0 0)", "translate(0 -9)", hump(cyc(t1 - t0, BEAT / 2))));
};
pass(12, 0, drummer, [PX, 640], (S, O, B) => { drum(S, B, PW(14, 0), S.end - 0.4); });
// 6  break 3: "Boom, boom, boom!" Bibi drums, all of Ollie's eight arms wiggle to the beat
brk(PE(12), PS(17), 0, (S) => { const B = drummer(S, S.start); drum(S, B, S.start + 0.3, S.end - 0.5); return B; }, (S, O, B) => {
  O.wiggle(ALL, S.start + 0.3, S.end - 0.5, 16, BEAT / 2);
  lookAt(S, [PX, 760], 1.3, [820, 600], S.at(0.3)); wide(S, S.at(0.72));
  say(S, "BOOM, BOOM!", S.at(0.06), S.at(0.26));
  sparkle(S, PX - 150, 800, S.at(0.35), 0.7); sparkle(S, PX + 150, 800, S.at(0.45), 0.7);
});
// 7  pass 4 BABY: tiny Baby toddles in on "Baby" and giggles
pass(17, 0, (S, t) => baby(S, PX, 0.6, { t }), [PX, FLOOR - 330 * 0.6], (S, O, Y) => {
  Y.wiggle(ALL, PW(19, 0), S.end - 0.4, 14); Y.bob(PW(19, 0), S.end, 8);
});
// 8  break 4a: "Peek-a-boo!" Baby hides under a cloth and pops out twice; Ollie says Ooh
const MID = (PE(17) + PS(22)) / 2;
brk(PE(17), MID, 0, (S) => baby(S, PX, 0.6), (S, O, Y) => {
  const cg = S.grp(); cg.setAttribute("opacity", 0);
  const pts = [[455, 838], [452, 730], [490, 640], [560, 602], [630, 640], [668, 730], [665, 838], [635, 815], [600, 840], [560, 815], [520, 840], [485, 815]];
  DS.shape(S, smooth([...pts, pts[0]]) + " Z", "orange", { parent: cg }); [[520, 690], [600, 720], [560, 770]].forEach(([x, y]) => S.fill(circ(x, y, 14), S.start, 0, DS.c("yellow", 1), 1, cg));
  [[0.15, 0.4], [0.55, 0.78]].forEach(([a, b]) => {
    tl.fromTo(cg, { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, S.at(a)); tl.fromTo(cg, { opacity: 1 }, { opacity: 0, duration: 0.25, immediateRender: false }, S.at(b));
    Y.sing(S.at(b), S.at(b) + 0.7); O.sing(S.at(b), S.at(b) + 0.5); O.hop(S.at(b), 55); sparkle(S, PX, 640, S.at(b) + 0.1, 0.8);
  });
  Y.wiggle(ALL, S.start + 0.3, S.end - 0.5, 12); O.wiggle(ALL, S.start + 0.3, S.end - 0.5, 10);
  lookAt(S, [PX, 700], 1.4, [820, 580], S.at(0.3));
  say(S, "PEEK-A-BOO!", S.at(0.04), S.at(0.26));
});
// 9  break 4b "Look! The sun!": everyone gathers at the window; the rain stops, the sky clears, the sun and a rainbow come out
{ const S = scene(MID, PS(22), { cam: "none" });
  const H = living(S, { rainEnd: S.at(0.3) });
  S.fadeOut(H.rain, S.at(0.25), 1.4); S.fadeOut(H.clouds, S.at(0.34), 1.5); S.fadeIn(H.sky2, S.at(0.34), 2); S.fadeIn(H.sun, S.at(0.45), 1.5); S.fadeIn(H.rbow, S.at(0.65), 2);
  const D = dad(S, 330, 0.95, { look: 12 }), M = mum(S, 640, 0.85, { look: 12 });
  const B = bibi(S, 1290, FLOOR - 325 * 0.7, { k: 0.7, mood: "joy" }); DS.shadow(S, 1290, FLOOR, 230);
  const Y = baby(S, 1530, 0.5, { look: -12 }), O = ollieAt(S, { look: 12, mouth: "open" });
  [D, M, Y, O].forEach((P, i) => { P.bob(S.start + 0.2 * i, S.end - 0.2, 7); P.wiggle(ALL, S.at(0.3), S.end - 0.4, 9); });
  swing(S, B.R, S.at(0.5), S.end - 0.4, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  HOPS(S, O, [0.5, 0.64, 0.78], 45);
  lookAt(S, WINP, 1.35, [880, 430], S.at(0.24)); say(S, "THE SUN!", S.at(0.03), S.at(0.2));
  sparkle(S, 1420, 230, S.at(0.5), 1); sparkle(S, 1250, 300, S.at(0.72), 0.8);
  DS.vignette(S); }

// ---------- outside: sun, rainbow, puddles ----------
const outdoors = (S, o = {}) => {
  const O = DS.outdoor(S, { hy: 560, sun: [1560, 170] });
  const rb = S.grp(O.g); O.g.insertBefore(rb, O.g.children[3]);
  ["red", "orange", "yellow", "green", "blue", "purple"].forEach((n, i) => S.draw(arc(960, 800, 580 - i * 28, 180, 360), S.start, 0, { c: DS.c(n, 0, "mid"), w: DS.w.near * 4, parent: rb }));
  if (o.rbowT !== undefined) { rb.setAttribute("opacity", 0); S.fadeIn(rb, o.rbowT, 2.2); }
  const cl = S.grp(); [[260, 150], [1300, 110]].forEach(([x, y]) => [[0, 0, 80, 40], [70, -20, 70, 48], [140, 4, 70, 36]].forEach(([dx, dy, rx, ry]) => S.fill(circ(x + dx, y + dy, rx, ry), S.start, 0, DS.P.white[0], 0.95, cl)));
  tw(cl, S.start, S.len, "translate(0 0)", "translate(70 0)", "none");
  return O;
};
const puddle = (S, x, k) => { S.draw(circ(x, FLOOR + 26, 250 * k, 40 * k), S.start, 0, { fill: DS.c("sky", 0), c: DS.c("sky", 2), w: DS.w.detail }); S.fill(circ(x - 60 * k, FLOOR + 22, 90 * k, 10 * k), S.start, 0, DS.P.white[0], 0.6); };
// the whole family outside; returns everyone. in boots from bt (undefined = no boots yet)
const GANG = (S, bt, mouth = "open") => {
  const X = { d: [330, 0.95], m: [640, 0.85], o: [OX, KO], b: [1300, 0.7], y: [1560, 0.5] };
  Object.values(X).forEach(([x, k]) => puddle(S, x, k));
  const D = dad(S, X.d[0], X.d[1], { mouth }), M = mum(S, X.m[0], X.m[1], { mouth });
  const B = bibi(S, X.b[0], FLOOR - 325 * X.b[1], { k: X.b[1], mood: "joy" }); DS.shadow(S, X.b[0], FLOOR, 230);
  const Y = baby(S, X.y[0], X.y[1], { mouth }), O = ollieAt(S, { mouth });
  if (bt !== undefined) { boots(S, D, "red", bt); boots(S, M, "orange", bt); boots(S, Y, "red", bt); boots(S, O, "yellow", bt); bootsB(S, B, bt); }
  return { D, M, B, Y, O, X, all: [D, M, Y, O] };
};

// 10  chorus, lines 1-2: "Rain, rain, went away / Rainbow colours, hooray!" the rainbow fades in, hooray hop, face close-up
{ const S = scene(PS(22), PW(24, 0) - 0.3, { cam: "none" });
  outdoors(S, { rbowT: PW(23, 0) - 0.3 });
  const G = GANG(S);
  G.all.forEach((P, i) => { P.bob(S.start + 0.2 * i, S.end - 0.3, 8); P.wiggle(ALL, S.start + 0.5, S.end - 0.4, 9); });
  sing(G.O, 22, 4); sing(G.O, 23, 3);
  [PW(23, 2), PW(23, 2) + 0.1].forEach((t, i) => (i ? G.D : G.O).hop(t, 70)); G.M.hop(PW(23, 2) + 0.05, 70); G.Y.hop(PW(23, 2) + 0.15, 70);
  swing(S, G.B.R, PW(23, 0), S.end - 0.4, { rotation: -14, svgOrigin: G.B.R.sh }, BEAT);
  sparkle(S, 1560, 170, S.start + 1.5, 1.2);
  face(S, PW(23, 1) - 0.5, 1.5);
  DS.vignette(S); }
// 11  chorus, lines 3-4: "Boots on feet, out we dash / Jump in puddles, splash, splash, splash!" boots pop on, then four hops with splashes
{ const S = scene(PW(24, 0) - 0.3, PW(26, 0) - 0.3, { cam: "none" });
  outdoors(S);
  const G = GANG(S, PW(24, 0) + 0.2);
  G.all.forEach((P, i) => { P.bob(S.start + 0.2 * i, PW(25, 0) - 0.4, 8); });
  G.all.forEach((P) => P.wiggle(ALL, S.start + 0.5, PW(25, 0) - 0.4, 9));
  sing(G.O, 24, 5); sing(G.O, 25, 6);
  const jump = (t, dl) => { [[G.D, G.X.d], [G.M, G.X.m], [G.Y, G.X.y], [G.O, G.X.o]].forEach(([P, [x, k]], i) => { const tt = t + dl * i; P.hop(tt, 60 + 50 * k, 0.5); splash(S, x, FLOOR + 26, tt + 0.4, k); ripple(S, x, FLOOR + 26, 250 * k, tt + 0.4); });
    const [x, k] = G.X.b; tw(G.B.g, t + dl * 4, 0.5, "translate(0 0)", "translate(0 -70)", hump(1)); splash(S, x, FLOOR + 26, t + dl * 4 + 0.4, k); ripple(S, x, FLOOR + 26, 250 * k, t + dl * 4 + 0.4); };
  [PW(25, 0), PW(25, 3), PW(25, 4), PW(25, 5)].forEach((t) => jump(t, 0.07));
  G.all.forEach((P) => P.bob(PW(25, 5) + 0.7, S.end - 0.3, 8));
  G.all.forEach((P) => P.wiggle(ALL, PW(25, 5) + 0.7, S.end - 0.3, 9));
  sparkle(S, 1560, 170, S.start + 1, 1.2);
  lookAt(S, [OX, 700], 1.3, [960, 620], PW(25, 0) - 0.5);
  DS.vignette(S); }
// 12  outro: "Splash! Bye-bye!" everybody waves, a last splash, end card
{ const S = scene(PW(26, 0) - 0.3, TOTAL, { cam: "none" });
  outdoors(S);
  const G = GANG(S, S.start);
  G.all.forEach((P, i) => { P.bob(S.start + 0.2 * i, S.end - 0.3, 8); [P.arms[0], P.arms[1]].forEach((A) => P.raise(A, 115, PW(26, 1) - 0.4, 0.6)); P.wiggle([1, 2], PW(26, 1), S.end - 1, 14); });
  swing(S, G.B.R, PW(26, 1), S.end - 1, { rotation: -16, svgOrigin: G.B.R.sh }, BEAT);
  splash(S, OX, FLOOR + 26, PW(26, 0) + 0.2, KO); ripple(S, OX, FLOOR + 26, 250 * KO, PW(26, 0) + 0.2);
  sparkle(S, 1560, 170, S.start + 1, 1.2);
  face(S, S.start + 0.6, 1.35); wide(S, TOTAL - 6);
  S.fadeOut(DS.card(S, "BYE-BYE!", 960, 330, { size: DS.type.title, t: PW(26, 1) }).g, TOTAL - 5.2, 0.4);
  S.text("Tiny Tune Town", 960, 130, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: TOTAL - 4.5 });
  DS.vignette(S); }
