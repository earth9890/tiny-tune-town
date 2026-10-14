// look: still
// Old MacDonald Had a Farm (traditional, public domain) — Tiny Tune Town. Hero: Farmer Mac (round, straw hat, blue overalls),
// the same build in every scene. One animal joins per verse (cow, pig, duck, sheep) and stays: the line-up grows 1 → 4,
// then everyone sings their sound in turn, claps and cheers. Sound words pop up in bubbles on the sung word.
// ---------- CHARS (shared with thumbnails) ----------
const G = (S, parent, tf) => { const g = S.grp(parent); if (tf) g.setAttribute("transform", tf); return g; };
const fadeIn = (S, e, t) => { if (t > S.start + 0.05) tl.fromTo(e, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.out" }, t); };
const sh = (S, d, name, g, o = {}) => DS.shape(S, d, name, Object.assign({ t: S.start, parent: g }, o));
const dot = (S, d, color, g, op = 1) => S.fill(d, S.start, 0, color, op, g);
// seek-safe back-and-forth: attr transform a -> b -> a, n times inside [t, t + dur]
const swing = (e, t, dur, a, b, n) => tl.fromTo(e, { attr: { transform: a } }, { attr: { transform: b }, duration: dur / (2 * n), ease: "sine.inOut", yoyo: true, repeat: 2 * n - 1, immediateRender: false }, t);
const hop = (A, t, dur, h, n) => swing(A.bob, t, dur, "translate(0 0)", `translate(0 ${-h})`, n);
const wig = (A, t, dur, deg, n) => swing(A.rock, t, dur, `rotate(${-deg} 0 0)`, `rotate(${deg} 0 0)`, n);

// kawaii face: shiny black eyes, pink cheeks, smile or open singing mouth
const eyes = (S, g, dx, y, r, look = 0) => [-1, 1].forEach((s) => {
  dot(S, circ(s * dx + look, y, r * 0.82, r), DS.P.ink[0], g);
  dot(S, circ(s * dx + look - r * 0.28, y - r * 0.38, r * 0.34), DS.P.white[0], g);
  dot(S, circ(s * dx + look + r * 0.26, y + r * 0.4, r * 0.15), DS.P.white[0], g);
});
const cheeks = (S, g, dx, y, r) => [-1, 1].forEach((s) => dot(S, circ(s * dx, y, r, r * 0.62), DS.c("pink"), g, 0.65));
const mouth = (S, g, y, w, open) => open
  ? (S.draw(`M${-w} ${y} Q0 ${y + w * 2} ${w} ${y} Z`, S.start, 0, { c: DS.line(), w: DS.w.mid, fill: DS.c("red", 2), parent: g }), dot(S, circ(0, y + w * 0.75, w * 0.45, w * 0.22), DS.c("pink", 1), g))
  : S.draw(`M${-w} ${y} Q0 ${y + w} ${w} ${y}`, S.start, 0, { c: DS.line(), w: DS.w.mid, parent: g });

// every character: pos (place + scale) > bob (hops) > rock (wiggles about the feet) > parts. Origin = ground centre.
const rig = (S, x, gy, k, wShadow, o) => {
  const sd = DS.shadow(S, x, gy, wShadow * k);
  const pos = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, pos, "translate(0 0)"), rock = G(S, bob, "rotate(0 0 0)");
  if (o.t !== undefined) { fadeIn(S, pos, o.t); tl.fromTo(sd, { opacity: 0 }, { opacity: 0.22, duration: 0.35 }, o.t); } // shadow keeps its 0.22
  return { pos, bob, rock, g: rock, k, x, gy };
};

// Farmer Mac: the hero. Straw hat, moustache, blue overalls, red shirt. ~660 tall at k = 1.
const mac = (S, x, gy, k = 1, o = {}) => {
  const A = rig(S, x, gy, k, 300, o), g = A.g;
  [-1, 1].forEach((s) => { sh(S, rrect(s * 45 - 32, -150, 64, 130, DS.r.md), "blue", g); sh(S, circ(s * 50, -22, 58, 30), "brown", g); });
  sh(S, circ(0, -300, 128, 92), "red", g);                                               // shirt
  A.arms = [-1, 1].map((s) => {                                                         // arm groups pivot at the shoulder
    const arm = G(S, g, `rotate(${(o.armA || [0, 0])[(s + 1) / 2]} ${s * 112} -330)`);
    sh(S, rrect(s * 112 - 30, -350, 60, 175, DS.r.lg), "red", arm); sh(S, circ(s * 112, -170, 36), "dusk", arm);
    return arm;
  });
  sh(S, circ(0, -175, 132, 130), "blue", g);                                            // overalls
  sh(S, rrect(-78, -340, 156, 140, DS.r.md), "blue", g);                                // bib
  [-1, 1].forEach((s) => sh(S, circ(s * 50, -315, 13), "yellow", g, { w: "detail" }));  // buttons
  sh(S, rrect(-40, -270, 80, 50, DS.r.sm), "blue", g, { w: "detail", flat: true });     // pocket
  [-1, 1].forEach((s) => sh(S, circ(s * 102, -468, 24, 30), "dusk", g));                // ears
  sh(S, circ(0, -470, 105, 100), "dusk", g);                                            // head
  cheeks(S, g, 62, -440, 22);
  eyes(S, g, 40, -492, 18, o.look || 0);
  mouth(S, g, -408, 26, o.open);
  [-1, 1].forEach((s) => sh(S, `M0 -440 Q${s * 30} -462 ${s * 62} -440 Q${s * 70} -416 ${s * 50} -420 Q${s * 26} -428 0 -432 Z`, "wood", g, { w: "mid" })); // moustache
  sh(S, circ(0, -455, 22, 18), "dusk", g, { tone: 2, flat: true, w: "mid" });                       // nose
  sh(S, rrect(-92, -650, 184, 112, DS.r.lg), "yellow", g);                              // hat crown
  sh(S, rect(-92, -578, 184, 26), "red", g, { w: "detail", flat: true });               // band
  sh(S, circ(0, -548, 178, 34), "yellow", g);                                           // brim
  [-120, -60, 60, 120].forEach((dx) => S.draw(`M${dx} -560 L${dx * 1.08} -530`, S.start, 0, { c: DS.c("yellow", 2), w: DS.w.hair, parent: g }));
  return A;
};

// Cow: white with brown patches, pink snout, little horns. ~490 tall at k = 1.
const cow = (S, x, gy, k = 1, o = {}) => {
  const A = rig(S, x, gy, k, 420, o), g = A.g;
  [-125, -45, 45, 125].forEach((lx) => { sh(S, rrect(lx - 30, -120, 60, 120, DS.r.md), "white", g); sh(S, rrect(lx - 30, -36, 60, 36, DS.r.sm), "brown", g, { flat: true }); });
  sh(S, circ(0, -205, 190, 140), "white", g);
  dot(S, circ(-105, -235, 48, 38), DS.c("brown", 1), g); dot(S, circ(110, -170, 40, 32), DS.c("brown", 1), g); dot(S, circ(30, -120, 30, 22), DS.c("brown", 1), g);
  [-1, 1].forEach((s) => sh(S, `M${s * 50} -425 Q${s * 62} -495 ${s * 110} -490 Q${s * 88} -462 ${s * 85} -418 Z`, "sand", g, { w: "mid" })); // horns
  [-1, 1].forEach((s) => { sh(S, circ(s * 140, -385, 58, 26), "white", g); dot(S, circ(s * 148, -385, 34, 13), DS.c("pink"), g, 0.8); });
  sh(S, circ(0, -365, 118, 102), "white", g);
  dot(S, circ(-58, -418, 34, 26), DS.c("brown", 1), g);
  eyes(S, g, 46, -388, 19, o.look || 0);
  sh(S, circ(0, -298, 88, 54), "pink", g);
  [-1, 1].forEach((s) => dot(S, circ(s * 30, -308, 10, 13), DS.c("pink", 2), g));
  mouth(S, g, -282, 22, o.open);
  sh(S, circ(0, -238, 24), "yellow", g, { w: "mid" });                                   // bell
  return A;
};

// Pig: round and pink, big snout, flop ears, curly tail. ~450 tall at k = 1.
const pig = (S, x, gy, k = 1, o = {}) => {
  const A = rig(S, x, gy, k, 380, o), g = A.g;
  S.draw("M150 -220 C 215 -230 230 -290 195 -300 C 165 -310 165 -265 200 -262 C 235 -258 250 -300 240 -320", S.start, 0, { c: DS.c("pink", 2), w: DS.w.near, parent: g }); // tail
  [-115, -40, 40, 115].forEach((lx) => { sh(S, rrect(lx - 30, -100, 60, 100, DS.r.md), "pink", g); sh(S, rrect(lx - 30, -28, 60, 28, DS.r.sm), "pink", g, { tone: 2, flat: true }); });
  sh(S, circ(0, -185, 178, 140), "pink", g);
  [-1, 1].forEach((s) => sh(S, `M${s * 45} -425 L${s * 140} -460 L${s * 125} -365 Z`, "pink", g, { tone: 2, flat: true })); // ears
  sh(S, circ(0, -340, 122, 108), "pink", g);
  eyes(S, g, 55, -372, 19, o.look || 0);
  cheeks(S, g, 85, -318, 20);
  A.snout = G(S, g, "translate(0 0)");
  sh(S, circ(0, -315, 56, 40), "pink", A.snout, { tone: 1, flat: true });
  [-1, 1].forEach((s) => dot(S, circ(s * 20, -315, 9, 14), DS.c("pink", 2), A.snout));
  mouth(S, g, -262, 22, o.open);
  return A;
};

// Duck: yellow, orange bill and feet, wings that flap. ~400 tall at k = 1.
const duck = (S, x, gy, k = 1, o = {}) => {
  const A = rig(S, x, gy, k, 300, o), g = A.g;
  [-1, 1].forEach((s) => sh(S, `M${s * 20} -10 L${s * 105} -30 Q${s * 110} 0 ${s * 95} 6 L${s * 25} 6 Z`, "orange", g)); // feet
  A.wings = [-1, 1].map((s) => {
    const w = G(S, g, `rotate(0 ${s * 110} -200)`);
    sh(S, `M${s * 100} -215 Q${s * 205} -205 ${s * 195} -110 Q${s * 150} -95 ${s * 100} -130 Z`, "yellow", w, { tone: 0 });
    return w;
  });
  sh(S, circ(0, -140, 145, 125), "yellow", g);
  dot(S, circ(-50, -175, 45, 30), DS.c("yellow", 1), g, 0.7);
  S.draw("M-10 -390 Q-30 -440 5 -445 M10 -390 Q25 -430 45 -420", S.start, 0, { c: DS.line(), w: DS.w.mid, parent: g }); // tuft
  sh(S, circ(0, -305, 100, 92), "yellow", g);
  eyes(S, g, 40, -328, 18, o.look || 0);
  cheeks(S, g, 70, -280, 18);
  if (o.open) { sh(S, circ(0, -282, 66, 22), "orange", g); sh(S, circ(0, -238, 50, 18), "orange", g, { tone: 2 }); }
  else { sh(S, circ(0, -262, 70, 26), "orange", g); S.draw("M-55 -262 Q0 -248 55 -262", S.start, 0, { c: DS.c("orange", 2), w: DS.w.detail, parent: g }); }
  return A;
};

// Sheep: fluffy white wool, tan face, dark legs. ~460 tall at k = 1.
const sheep = (S, x, gy, k = 1, o = {}) => {
  const A = rig(S, x, gy, k, 380, o), g = A.g;
  [-110, -40, 40, 110].forEach((lx) => sh(S, rrect(lx - 22, -110, 44, 110, DS.r.md), "brown", g, { tone: 1 }));
  const fluff = (cx, cy, rx, ry, n, r) => {
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; sh(S, circ(cx + rx * Math.cos(a), cy + ry * Math.sin(a), r), "white", g, { flat: true }); }
    dot(S, circ(cx, cy, rx + r * 0.55, ry + r * 0.55), DS.c("white"), g);
  };
  fluff(0, -215, 160, 105, 14, 55);
  dot(S, circ(-60, -255, 70, 40), DS.P.white[0], g, 0.8);
  [-1, 1].forEach((s) => sh(S, circ(s * 100, -350, 50, 22), "earth", g));
  sh(S, circ(0, -340, 82, 96), "earth", g);
  fluff(0, -425, 45, 14, 6, 30);
  eyes(S, g, 32, -348, 17, o.look || 0);
  cheeks(S, g, 52, -305, 15);
  mouth(S, g, -282, 18, o.open);
  return A;
};

// sound bubble: big rounded white bubble, word in ink, tail pointing at the singer
const bubble = (S, str, x, y, t, tail = [0, 1]) => {
  const g = S.grp(), size = DS.type.title, w = str.length * size * 0.62 + DS.sp(6), h = size * 1.15 + DS.sp(3);
  const [tx, ty] = [x + tail[0] * w * 0.3, y + h / 2 + 50 * tail[1]];
  S.fill(rrect(x - w / 2 + 6, y - h / 2 + 10, w, h, DS.r.lg), S.start, 0, DS.P.ink[0], 0.14, g);
  S.draw(`M${x - 34} ${y + h / 2 - 8} L${tx} ${ty} L${x + 34} ${y + h / 2 - 8} Z`, S.start, 0, { c: DS.P.ink[0], w: DS.w.detail, fill: DS.P.white[0], parent: g });
  S.draw(rrect(x - w / 2, y - h / 2, w, h, DS.r.lg), S.start, 0, { c: DS.P.ink[0], w: DS.w.detail, fill: DS.P.white[0], parent: g });
  S.fill(rect(x - 30, y + h / 2 - 12, 60, 10), S.start, 0, DS.P.white[0], 1, g);
  S.text(str, x, y + size * 0.36, { size, t: S.start, c: DS.P.ink[0], parent: g });
  if (t > S.start + 0.05) tl.fromTo(g, { opacity: 0, attr: { transform: `translate(${x * 0.08} ${y * 0.08}) scale(0.92)` } }, { opacity: 1, attr: { transform: "translate(0 0) scale(1)" }, duration: 0.35, ease: "power1.out" }, t);
  return g;
};

// ---------- farm scenery ----------
const cloud = (S, x, y, k) => [[0, 0, 70], [-70, 18, 50], [70, 15, 55], [30, -35, 50]].forEach(([dx, dy, r]) => S.fill(circ(x + dx * k, y + dy * k, r * k), S.start, 0, DS.P.white[0], 0.92));
const barn = (S, x, gy, k, layer = "far") => {
  const g = G(S, null, `translate(${x} ${gy}) scale(${k})`);
  sh(S, "M-190 -250 L-130 -360 L0 -420 L130 -360 L190 -250 Z", "brown", g, { layer });
  sh(S, rect(-165, -260, 330, 260), "red", g, { layer });
  sh(S, rect(-70, -150, 140, 150), "red", g, { layer, tone: 2, flat: true });
  S.draw("M-70 -150 L70 0 M70 -150 L-70 0", S.start, 0, { c: DS.c("white", 0, layer), w: DS.w.mid, parent: g });
  sh(S, rect(-35, -320, 70, 60), "white", g, { layer, w: "far" });
  return g;
};
const tree = (S, x, gy, k, layer = "mid") => {
  DS.shadow(S, x, gy, 200 * k);
  sh(S, rrect(x - 26 * k, gy - 220 * k, 52 * k, 220 * k, DS.r.sm), "wood", null, { layer });
  [[0, -330, 120], [-90, -260, 85], [90, -260, 90], [0, -220, 95]].forEach(([dx, dy, r]) => sh(S, circ(x + dx * k, gy + dy * k, r * k), "grass", null, { layer, tone: 2 }));
};
const fence = (S, x0, x1, gy, layer = "mid") => {
  sh(S, rect(x0, gy - 110, x1 - x0, 20), "wood", null, { layer, w: "far" });
  sh(S, rect(x0, gy - 60, x1 - x0, 20), "wood", null, { layer, w: "far" });
  for (let x = x0 + 30; x < x1; x += 150) sh(S, rrect(x - 14, gy - 140, 28, 140, DS.r.xs), "wood", null, { layer, w: "far" });
};
const flowers = (S, pts) => pts.forEach(([x, y, c]) => { S.draw(`M${x} ${y} L${x} ${y + 40}`, S.start, 0, { c: DS.c("green", 2), w: DS.w.mid }); [0, 1, 2, 3, 4].forEach((i) => S.fill(circ(x + 16 * Math.cos(i * 1.257), y + 16 * Math.sin(i * 1.257), 12), S.start, 0, DS.c(c), 1)); S.fill(circ(x, y, 9), S.start, 0, DS.c("yellow"), 1); });
// the farm: sky, sun, clouds, far hills, red barn, fence. o.barn [x, gy, k] or false
const farm = (S, o = {}) => {
  const O = DS.outdoor(S, { hy: o.hy || 600, sun: o.sun || [1640, 170] });
  if (o.rainbow !== undefined) { const g = S.grp(); ["red", "orange", "yellow", "green", "blue", "purple"].forEach((c, i) => S.draw(arc(960, O.hy + 40, 600 - i * 22, 180, 360), S.start, 0, { c: DS.c(c, 0, "far"), w: DS.w.near * 3, parent: g })); fadeIn(S, g, o.rainbow); }
  cloud(S, 380, 150, 1); cloud(S, 1100, 110, 0.8);
  if (o.barn !== false) barn(S, ...(o.barn || [1450, O.hy + 30, 0.9]));
  if (o.tree) tree(S, ...o.tree);
  if (o.fence !== false) fence(S, -60, 1980, (o.hy || 600) + 150, "mid");
  return O;
};
const hay = (S, x, gy, k = 1) => {
  DS.shadow(S, x, gy, 300 * k);
  sh(S, rrect(x - 140 * k, gy - 150 * k, 280 * k, 150 * k, DS.r.md), "sand", null);
  [-70, 0, 70].forEach((dx) => S.draw(`M${x + (dx - 40) * k} ${gy - 120 * k} L${x + (dx + 30) * k} ${gy - 30 * k}`, S.start, 0, { c: DS.c("sand", 2), w: DS.w.hair }));
  [-80, 80].forEach((dx) => sh(S, rect(x + (dx - 8) * k, gy - 150 * k, 16 * k, 150 * k), "wood", null, { w: "hair", flat: true }));
};
const pond = (S, x, gy, rx) => { sh(S, circ(x, gy, rx, rx * 0.22), "sky", null, { layer: "mid", w: "mid" }); S.draw(`M${x - rx * 0.5} ${gy - 8} Q${x - rx * 0.3} ${gy - 18} ${x - rx * 0.1} ${gy - 8}`, S.start, 0, { c: DS.P.white[0], w: DS.w.detail }); };
const bush = (S, x, gy, k = 1, layer = "mid") => [[-90, -70, 80], [90, -70, 80], [-40, -130, 85], [50, -125, 80], [0, -60, 95]].forEach(([dx, dy, r]) => sh(S, circ(x + dx * k, gy + dy * k, r * k), "green", null, { layer }));
// ---------- /CHARS ----------

// ---------- song ----------
const T = (s) => s - 0.15;            // sung-word time (whisper, take seed 21) → picture cue; the picture leads the voice a hair
const NG = 925;                        // near-plane ground
const CAST = [cow, pig, duck, sheep], LX = [700, 1040, 1350, 1650], LK = [0.66, 0.68, 0.64, 0.64];
// Mac + the first n animals in a row in front of the barn. o.open: everyone sings; o.mac: Mac's options; o.skip: index that arrives later
const lineup = (S, n, o = {}) => {
  const M = mac(S, 330, NG, 0.74, Object.assign({ open: true, look: 4 }, o.mac));
  const A = CAST.slice(0, n).map((f, i) => f(S, LX[i], NG, LK[i], { open: o.open, t: i === o.arrive ? o.at : undefined, look: -3 }));
  return { M, A };
};
const waveArm = (M, t, dur, n) => swing(M.arms[1], t, dur, "rotate(-130 112 -330)", "rotate(-165 112 -330)", n);
const flapArms = (M, t, dur, n) => { swing(M.arms[0], t, dur, "rotate(0 -112 -330)", "rotate(75 -112 -330)", n); swing(M.arms[1], t, dur, "rotate(0 112 -330)", "rotate(-75 112 -330)", n); };
const bloom = (S) => flowers(S, [[150, 880, "pink"], [230, 925, "yellow"], [1780, 900, "pink"], [1850, 940, "purple"]]);

const CUES = [[1, 0], [5, 0], [7, 0], [9, 0], [10, 0], [14, 0], [16, 0], [18, 0], [19, 0], [21, 0], [23, 0], [25, 0], [26, 0], [30, 0], [32, 0], [35, 0], [36, 0], [38, 0], [39, 0]];
const WIN = sceneWindows(CUES, 0.3);
const sc = (k, o) => scene(WIN[k][0], WIN[k][1], o);

// 0  Old MacDonald had a farm, E-I-E-I-O! (x2) — meet Farmer Mac
{ const S = sc(0, { cam: "push", focus: "700 600" }); farm(S, { tree: [230, 700, 0.8, "mid"] });
  const M = mac(S, 700, 930, 0.95, { open: true, armA: [0, -130], look: 4 });
  waveArm(M, T(4.3), 3.4, 4);
  DS.card(S, "OLD MACDONALD", 1180, 150, { size: DS.type.title, t: T(0.3) });
  bloom(S); DS.vignette(S, 0.08); }

// 1  Oh, E-I-E-I-O! — the letters pop up one by one
{ const S = sc(1, { cam: "zoom", focus: "520 500" }); farm(S, { barn: false, hy: 640 });
  mac(S, 470, 960, 1.18, { open: true, look: 8, armA: [0, -150] });
  const g = S.grp(); DS.drop(S, rrect(1006, 342, 800, 250, DS.r.lg), { parent: g });
  S.draw(rrect(1000, 330, 800, 250, DS.r.lg), S.start, 0, { c: DS.P.ink[0], w: DS.w.detail, fill: DS.P.white[0], parent: g });
  [["E", "red", 10.3], ["I", "blue", 10.55], ["E", "green", 10.8], ["I", "purple", 11.1], ["O", "red", 11.4]].forEach(([ch, c, s], i) =>
    S.text(ch, 1110 + i * 145, 495, { size: DS.type.display, t: T(s), c: DS.c(c, 2) }));
  DS.vignette(S, 0.08); }

// 2  And on his farm he had a cow — the cow arrives
{ const S = sc(2); farm(S);
  mac(S, 380, NG, 0.74, { open: true, look: 8 });
  const C = cow(S, 1020, NG, 0.85, { t: T(14.3), look: -6 });
  hop(C, T(15.3), 1.4, 24, 2);
  DS.card(S, "COW", 1020, 420, { size: DS.type.title, t: T(14.3) });
  bloom(S); DS.vignette(S, 0.08); }

// 3  Stomp your feet and say moo moo moo!
{ const S = sc(3, { cam: "zoom", focus: "960 600" }); farm(S, { barn: [1620, 650, 0.8] });
  const C = cow(S, 960, 930, 1.15, { open: true });
  hop(C, T(17.3), 1.8, 26, 4);
  bubble(S, "MOO!", 470, 380, T(19.2), [1, 1]);
  bubble(S, "MOO!", 1450, 380, T(19.8), [-1, 1]);
  bubble(S, "MOO!", 960, 150, T(20.3), [0, 0.6]);
  DS.vignette(S, 0.08); }

// 4  Old MacDonald had a farm (x2) — pink ears and a curly tail peek out from behind the hay
{ const S = sc(4); farm(S);
  const ears = S.grp(); [1235, 1325].forEach((x, i) => sh(S, `M${x - 30} 770 L${x + (i ? 22 : -22)} 690 L${x + 30} 770 Z`, "pink", ears, { tone: 2, flat: true }));
  const tail = S.grp(); S.draw("M1160 830 C 1080 825 1070 760 1112 752 C 1150 745 1158 800 1112 800", S.start, 0, { c: DS.c("pink", 2), w: DS.w.near * 1.6, parent: tail });
  hay(S, 1280, 900, 1);                                                     // drawn after: the pig hides behind it
  const L = lineup(S, 1); wig(L.A[0], T(21.3), 1.6, 4, 2);
  fadeIn(S, ears, T(25.3)); swing(ears, T(25.8), 1.2, "translate(0 0)", "translate(0 -12)", 2);
  fadeIn(S, tail, T(26.3)); swing(tail, T(26.6), 2.0, "translate(0 0)", "translate(-14 -6)", 3);
  DS.card(S, "WHO IS THAT?", 1280, 600, { size: DS.type.small, t: T(27.3) });
  bloom(S); DS.vignette(S, 0.08); }

// 5  And on his farm he had a pig — out pops the pig
{ const S = sc(5); farm(S);
  hay(S, 1280, 900, 1);
  const L = lineup(S, 2, { arrive: 1, at: T(31.3) }); hop(L.A[1], T(31.3), 1.2, 40, 2);
  DS.card(S, "PIG", 1040, 400, { size: DS.type.title, t: T(31.3) });
  bloom(S); DS.vignette(S, 0.08); }

// 6  With an oink oink here, and an oink oink there, here an oink, there an oink, everywhere an oink oink!
{ const S = sc(6, { cam: "zoom", focus: "960 600" }); farm(S, { barn: [1620, 650, 0.8] });
  const P = pig(S, 960, 930, 1.15, { open: true });
  bubble(S, "OINK!", 450, 430, T(33.7), [1, 1]);
  bubble(S, "OINK!", 1470, 430, T(35.3), [-1, 1]);
  bubble(S, "OINK!", 640, 170, T(36.4), [1, 1]);
  bubble(S, "OINK!", 1280, 170, T(36.8), [-1, 1]);
  wig(P, T(37.1), 1.0, 5, 2);
  DS.vignette(S, 0.08); }

// 7  Wiggle your nose and say oink oink! — the snout wiggles (big close-up)
{ const S = sc(7, { cam: "push", focus: "960 520" }); farm(S, { barn: false, hy: 700 });
  const P = pig(S, 900, 1190, 1.9, { open: true });
  swing(P.snout, T(38.3), 2.4, "translate(-14 0)", "translate(14 0)", 6);
  DS.card(S, "WIGGLE!", 330, 220, { size: DS.type.title, t: T(38.3) });
  bubble(S, "OINK OINK!", 1490, 260, T(40.7), [-1, 1]);
  DS.vignette(S, 0.08); }

// 8  Old MacDonald had a farm — a pond appears; Mac waves
{ const S = sc(8); farm(S);
  pond(S, 1500, 820, 260);
  const L = lineup(S, 2, { mac: { armA: [0, -130] } }); waveArm(L.M, T(42.3), 2.4, 3);
  bloom(S); DS.vignette(S, 0.08); }

// 9  And on his farm he had a duck — the duck waddles out by the pond
{ const S = sc(9); farm(S);
  pond(S, 1500, 820, 260);
  const L = lineup(S, 3, { arrive: 2, at: T(47.2) }); hop(L.A[2], T(47.2), 1.2, 30, 2);
  DS.card(S, "DUCK", 1350, 430, { size: DS.type.title, t: T(47.2) });
  bloom(S); DS.vignette(S, 0.08); }

// 10  With a quack quack here, and a quack quack there, here a quack, there a quack!
{ const S = sc(10, { cam: "zoom", focus: "960 600" }); farm(S, { barn: false });
  pond(S, 1420, 760, 380);
  const D = duck(S, 960, 930, 1.25, { open: true });
  bubble(S, "QUACK!", 430, 440, T(49.5), [1, 1]);
  bubble(S, "QUACK!", 1490, 440, T(50.7), [-1, 1]);
  bubble(S, "QUACK!", 600, 180, T(52.6), [1, 1]);
  bubble(S, "QUACK!", 1320, 180, T(53.4), [-1, 1]);
  hop(D, T(52.6), 1.2, 20, 2);
  DS.vignette(S, 0.08); }

// 11  Flap your wings and say quack quack! — the duck flaps, and so does Mac
{ const S = sc(11); farm(S, { barn: false });
  pond(S, 1420, 760, 380);
  const M = mac(S, 420, NG, 0.8, { open: true, look: 8 });
  const D = duck(S, 1150, 930, 1.15, { open: true, look: -6 });
  D.wings.forEach((w, i) => { const s = i ? 1 : -1; swing(w, T(54.3), 3.2, `rotate(0 ${s * 110} -200)`, `rotate(${-s * 38} ${s * 110} -200)`, 7); });
  flapArms(M, T(54.3), 3.2, 4);
  DS.card(S, "FLAP!", 780, 200, { size: DS.type.title, t: T(54.3) });
  bubble(S, "QUACK QUACK!", 1400, 210, T(56.5), [-0.6, 1]);
  DS.vignette(S, 0.08); }

// 12  Old MacDonald had a farm (x2) — something fluffy peeks over the fence
{ const S = sc(12); farm(S);
  pond(S, 1500, 820, 260);
  const L = lineup(S, 3); L.A.forEach((A, i) => hop(A, T(58.3) + i * 0.25, 1.6, 16, 2));
  const P = sheep(S, 1720, 790, 0.5, { t: T(62.3), look: -4 });
  hop(P, T(63.2), 2.4, 12, 3);
  bush(S, 1720, 860, 0.95);                                                // the sheep peeks over the bush
  DS.card(S, "WHO IS THAT?", 1560, 330, { size: DS.type.small, t: T(64.3) });
  bloom(S); DS.vignette(S, 0.08); }

// 13  And on his farm he had a sheep — the sheep joins the row
{ const S = sc(13); farm(S);
  pond(S, 1500, 820, 260);
  const L = lineup(S, 4, { arrive: 3, at: T(67.4) }); hop(L.A[3], T(67.4), 1.2, 34, 2);
  DS.card(S, "SHEEP", 1650, 470, { size: DS.type.title, t: T(67.4) });
  bloom(S); DS.vignette(S, 0.08); }

// 14  With a baa baa here, and a baa baa there, here a baa, there a baa, everywhere a baa baa!
{ const S = sc(14, { cam: "zoom", focus: "960 600" }); farm(S, { barn: [1620, 650, 0.8] });
  const P = sheep(S, 960, 930, 1.2, { open: true });
  bubble(S, "BAA!", 470, 430, T(71.0), [1, 1]);
  bubble(S, "BAA!", 1450, 430, T(72.5), [-1, 1]);
  bubble(S, "BAA!", 640, 170, T(74.7), [1, 1]);
  bubble(S, "BAA!", 1280, 170, T(75.6), [-1, 1]);
  wig(P, T(76.5), 2.2, 6, 3);
  DS.vignette(S, 0.08); }

// 15  Jump up high and say baa baa! — sheep and Mac jump
{ const S = sc(15); farm(S, { barn: [1600, 640, 0.75] });
  const M = mac(S, 520, NG, 0.8, { open: true, armA: [150, -150], look: 8 });
  const P = sheep(S, 1180, 930, 1.05, { open: true, look: -6 });
  hop(P, T(79.6), 2.0, 150, 2); hop(M, T(79.6), 2.0, 90, 2);
  DS.card(S, "JUMP!", 860, 180, { size: DS.type.title, t: T(79.5) });
  bubble(S, "BAA BAA!", 1500, 210, T(81.9), [-0.6, 1]);
  bloom(S); DS.vignette(S, 0.08); }

// 16  Old MacDonald had a farm, E-I-E-I-O! — the whole farm sings together
{ const S = sc(16, { cam: "pull" }); farm(S);
  const L = lineup(S, 4, { open: true, mac: { armA: [0, -130] } });
  waveArm(L.M, T(83.3), 3.4, 4);
  L.A.forEach((A, i) => hop(A, T(83.3) + i * 0.3, 3.0, 14, 3));
  bloom(S); DS.vignette(S, 0.08); }

// 17  Moo moo, oink oink, quack quack, baa! — each friend sings in turn
{ const S = sc(17); farm(S);
  const L = lineup(S, 4, { open: true });
  [["MOO!", 87.4, 440], ["OINK!", 88.1, 330], ["QUACK!", 89.1, 440], ["BAA!", 90.3, 330]].forEach(([w, s, y], i) => {
    bubble(S, w, LX[i], y, T(s), [0, 1]); hop(L.A[i], T(s), 0.8, 36, 1); });
  bloom(S); DS.vignette(S, 0.08); }

// 18  Clap your hands, hooray, hooray! / Old MacDonald had a farm, E-I-E-I-O! — claps, cheers and a rainbow
{ const S = sc(18, { cam: "pull" }); farm(S, { rainbow: T(95.3) });
  const L = lineup(S, 4, { open: true, mac: { armA: [-40, 40] } });
  swing(L.M.arms[0], T(91.3), 1.8, "rotate(-40 -112 -330)", "rotate(-62 -112 -330)", 4);
  swing(L.M.arms[1], T(91.3), 1.8, "rotate(40 112 -330)", "rotate(62 112 -330)", 4);
  tl.to(L.M.arms[0], { attr: { transform: "rotate(150 -112 -330)" }, duration: 0.4, ease: "power2.out" }, T(93.3));
  tl.to(L.M.arms[1], { attr: { transform: "rotate(-150 112 -330)" }, duration: 0.4, ease: "power2.out" }, T(93.3));
  [L.M, ...L.A].forEach((A, i) => { hop(A, T(93.3) + i * 0.12, 1.8, 40, 2); wig(A, T(95.3) + i * 0.1, 6.0, 4, 6); });
  DS.card(S, "HOORAY!", 960, 150, { size: DS.type.title, t: T(93.3) });
  bloom(S); DS.vignette(S, 0.08); }
