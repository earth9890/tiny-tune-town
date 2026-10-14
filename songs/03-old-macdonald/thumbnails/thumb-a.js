// look: still
// Thumb A: Farmer Mac singing big, the cow beside him, "E-I-E-I-O!" in big yellow letters.
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
const S = scene(0, 1, { cam: "none" });
farm(S, { barn: [1640, 640, 0.75], fence: false, hy: 640 });
mac(S, 560, 1290, 1.6, { open: true, look: 10, armA: [0, -150] });
cow(S, 1390, 1080, 1.2, { open: true, look: -8 });
S.text("E-I-E-I-O!", 960, 215, { size: 220, c: DS.c("yellow"), halo: DS.P.ink[0], haloW: 0.1 });
DS.vignette(S, 0.1);
