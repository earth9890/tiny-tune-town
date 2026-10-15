// 10 Mary Had a Little Lamb: song-only cast + sets (included by scenes.js and the thumbnails; tools/cast.js stays untouched).
// lamb(): round white cloud of fleece, peach face, pink ears. Sets: hill + storybook, park + slide, shop + cart, beach, school.

// a puffy union of circles: outlines first, fills on top, so only the outer edge shows (fleece, clouds, tree tops)
const puffs = (S, list, name, parent, o = {}) => {
  const layer = o.layer || "near", w = DS.w[o.w || DS.depth[layer].w];
  list.forEach(([x, y, r, ry]) => S.draw(circ(x, y, r, ry || r), S.start, 0, { c: DS.line(layer), w: w * 2, parent }));
  list.forEach(([x, y, r, ry]) => S.fill(circ(x, y, r, ry || r), S.start, 0, DS.c(name, o.shade ?? 2, layer), 1, parent));
  list.forEach(([x, y, r, ry]) => { if (r >= 40) S.fill(circ(x - r * 0.12, y - (ry || r) * 0.14, r * 0.8, (ry || r) * 0.78), S.start, 0, DS.c(name, o.lit ?? 0, layer), 1, parent); });
};

// ---------- the little lamb (local origin = ground centre; dir 1 faces right) ----------
const FLEECE = [[0, -150, 96, 72], [-78, -128, 58, 52], [78, -130, 58, 52], [-46, -196, 54, 46], [44, -198, 54, 46], [-2, -214, 50, 40], [-108, -170, 40, 38], [100, -168, 40, 38], [-40, -100, 56, 38], [40, -100, 56, 38]];
const lamb = (S, x, gy, k = 1, o = {}) => {
  const s0 = S.start, dir = o.dir || 1, t = o.t ?? s0;
  const g = G(S, o.parent), pos = G(S, g, `translate(${x} ${gy}) scale(${k * dir} ${k})`);
  const sh = DS.shadow(S, 0, 0, 290, { parent: pos });
  const lift = G(S, pos, "translate(0 0)"), tilt = G(S, lift, "rotate(0 0 -60)"), bob = G(S, tilt, "translate(0 0)");
  [[-70, 1], [-26, 0], [30, 1], [72, 0]].forEach(([lx, back]) => DS.shape(S, rrect(lx - 15, -96, 30, 96, DS.r.sm), "brown", { parent: bob, flat: !!back, tone: 2, w: "mid" }));
  const fleece = G(S, bob, "translate(0 -150) scale(1) translate(0 150)");
  puffs(S, [[-138, -176, 24]], "white", fleece);                                      // tail
  puffs(S, FLEECE, "white", fleece);
  [[-40, -150], [10, -122], [-70, -196], [30, -176], [-10, -186]].forEach(([cx, cy]) => S.draw(arc(cx, cy, 14, 200, 360), s0, 0, { c: DS.c("gray", 1), w: DS.w.detail, parent: fleece }));
  const head = G(S, bob, "rotate(0 104 -205)"), hx = 104, hy = -205;
  [-1, 1].forEach((s) => { const eg = G(S, head, `rotate(${s * 28} ${hx + s * 56} ${hy - 18})`); DS.shape(S, circ(hx + s * 64, hy - 14, 36, 17), "pink", { parent: eg, w: "mid" }); S.fill(circ(hx + s * 66, hy - 13, 22, 8), s0, 0, DS.c("pink", 2), 0.6, eg); });
  DS.shape(S, circ(hx, hy, 60, 56), "dusk", { parent: head });
  puffs(S, [[hx - 26, hy - 50, 24], [hx + 24, hy - 52, 24], [hx, hy - 64, 26]], "white", head);   // forelock tuft
  const eyes = G(S, head), joy = G(S, head); joy.setAttribute("opacity", 0);
  [-1, 1].forEach((s) => {
    S.fill(circ(hx + s * 23, hy - 2, 12, 15), s0, 0, DS.P.ink[0], 1, eyes);
    S.fill(circ(hx + s * 23 - 4, hy - 8, 5), s0, 0, DS.P.white[0], 1, eyes);
    S.fill(circ(hx + s * 23 + 4, hy + 4, 2.4), s0, 0, DS.P.white[0], 1, eyes);
    S.draw(arc(hx + s * 23, hy + 4, 12, 200, 340), s0, 0, { c: DS.c("ink"), w: DS.w.mid, parent: joy });
    S.fill(circ(hx + s * 40, hy + 20, 12, 7), s0, 0, DS.c("red", 1), 0.55, head);
  });
  S.fill(circ(hx, hy + 18, 9, 6), s0, 0, DS.c("pink", 2), 1, head);
  const smile = S.draw(`M${hx - 12} ${hy + 28} Q${hx} ${hy + 40} ${hx + 12} ${hy + 28}`, s0, 0, { c: DS.line(), w: DS.w.mid, parent: head });
  const open = G(S, head); open.setAttribute("opacity", 0);                            // "baa!" mouth
  S.draw(`M${hx - 13} ${hy + 27} Q${hx} ${hy + 52} ${hx + 13} ${hy + 27} Z`, s0, 0, { c: DS.line(), w: DS.w.mid, fill: DS.c("red", 2), parent: open });
  if (t > s0 + 0.05) fadeIn(S, g, t);
  const L = { g, pos, lift, tilt, bob, fleece, head, x, y: gy, k, dir, sz: 1, liftY: 0, tf: () => `translate(${L.x} ${L.y}) scale(${k * L.dir} ${k})`,
    at: ([px, py]) => [L.x + px * k * L.dir, L.y + py * k], face: () => [L.x + hx * k * L.dir, L.y + hy * k] };
  L.bob = (t0, t1, amp = 8) => tw(bob, t0, t1 - t0, "translate(0 0)", `translate(0 ${-amp})`, hump(cyc(t1 - t0, BEAT)));
  L.hop = (t0, h = 50, dur = 0.45) => tw(lift, t0, dur, `translate(0 ${L.liftY})`, `translate(0 ${L.liftY - h})`, hump(1));
  // trot to (x1, y1) with n little hops on the way
  L.move = (x1, y1, t0, dur = 1.4, n = 3, h = 34) => { const a = L.tf(); L.x = x1; L.y = y1; tw(pos, t0, dur, a, L.tf(), "sine.inOut"); if (n) tw(lift, t0, dur, "translate(0 0)", `translate(0 ${-h})`, hump(n)); };
  L.slide = (x1, y1, t0, dur = 1, ease = "power2.in") => { const a = L.tf(); L.x = x1; L.y = y1; tw(pos, t0, dur, a, L.tf(), ease); };
  L.turn = (t0) => { const a = L.tf(); L.dir = -L.dir; tw(pos, t0, 0.4, a, L.tf(), "power1.inOut"); };
  L.lean = (deg, t0, dur = 0.4) => tw(tilt, t0, dur, `rotate(${L.ang || 0} 0 -60)`, `rotate(${(L.ang = deg)} 0 -60)`);
  L.puff = (z, t0, dur = 0.6) => { tw(fleece, t0, dur, `translate(0 -150) scale(${L.sz}) translate(0 150)`, `translate(0 -150) scale(${z}) translate(0 150)`, "back.out(1.6)"); L.sz = z; };
  L.nod = (t0, t1) => tw(head, t0, t1 - t0, `rotate(0 ${hx} ${hy})`, `rotate(8 ${hx} ${hy})`, wave(cyc(t1 - t0, 2 * BEAT)));
  L.baa = (t0, t1) => { tl.set(open, { opacity: 1 }, t0); tl.set(smile, { opacity: 0 }, t0); tl.set(open, { opacity: 0 }, t1); tl.set(smile, { opacity: 1 }, t1); };
  L.joy = (t0, t1 = 1e9) => { tl.set(joy, { opacity: 1 }, t0); tl.set(eyes, { opacity: 0 }, t0); if (t1 < 1e9) { tl.set(joy, { opacity: 0 }, t1); tl.set(eyes, { opacity: 1 }, t1); } };
  if (o.mood === "joy") { joy.setAttribute("opacity", 1); eyes.setAttribute("opacity", 0); }
  return L;
};

// ---------- small things ----------
const cloud = (S, x, y, k = 1) => puffs(S, [[x, y, 70 * k, 46 * k], [x - 70 * k, y + 12 * k, 46 * k, 34 * k], [x + 72 * k, y + 10 * k, 50 * k, 36 * k], [x - 20 * k, y - 34 * k, 46 * k, 40 * k], [x + 34 * k, y - 26 * k, 40 * k, 34 * k]], "white", null, { layer: "far", w: "far", shade: 1, lit: 0 });
const tree = (S, x, gy, k = 1, layer = "mid") => {
  DS.shadow(S, x, gy, 260 * k);
  DS.shape(S, `M${x - 26 * k} ${gy} L${x - 18 * k} ${gy - 230 * k} L${x + 18 * k} ${gy - 230 * k} L${x + 26 * k} ${gy} Z`, "wood", { layer });
  puffs(S, [[x, gy - 300 * k, 120 * k, 100 * k], [x - 100 * k, gy - 250 * k, 80 * k, 66 * k], [x + 100 * k, gy - 256 * k, 84 * k, 68 * k], [x - 44 * k, gy - 380 * k, 80 * k, 66 * k], [x + 52 * k, gy - 374 * k, 76 * k, 62 * k]], "grass", null, { layer });
  [[-60, -300], [50, -250], [10, -360], [-110, -240]].forEach(([dx, dy]) => S.fill(circ(x + dx * k, gy + dy * k, 11 * k), S.start, 0, DS.c("red", 0, layer), 0.9));
};
const flowers = (S, list) => list.forEach(([x, y, c]) => { S.draw(`M${x} ${y} V${y - 34}`, S.start, 0, { c: DS.c("green", 2), w: DS.w.detail }); [0, 72, 144, 216, 288].forEach((a) => S.fill(circ(x + Math.cos(a * Math.PI / 180) * 11, y - 40 + Math.sin(a * Math.PI / 180) * 11, 9), S.start, 0, DS.c(c, 1), 1)); S.fill(circ(x, y - 40, 7), S.start, 0, DS.c("yellow", 0), 1); });
// a giant open storybook standing on the grass, pages to camera; returns the right page's centre for the picture
const storybook = (S, x, gy, w = 440, h = 300) => {
  DS.shadow(S, x, gy, w * 1.1);
  DS.shape(S, rrect(x - w / 2 - 14, gy - h - 10, w + 28, h + 22, DS.r.sm), "red");
  [-1, 1].forEach((s) => DS.shape(S, `M${x} ${gy - h + 6} Q${x + s * w * 0.25} ${gy - h - 16} ${x + s * w / 2} ${gy - h + 2} V${gy} Q${x + s * w * 0.25} ${gy - 18} ${x} ${gy} Z`, "paper", { w: "mid", dir: "v" }));
  [0, 1, 2, 3, 4].forEach((i) => S.draw(`M${x - w / 2 + 34} ${gy - h + 60 + i * 44} H${x - 34 - (i === 4 ? 70 : 0)}`, S.start, 0, { c: DS.c("gray", 1), w: DS.w.near }));
  return [x + w / 4, gy];
};
// ---------- sets ----------
const hill = (S, o = {}) => {
  const O = DS.outdoor(S, { hy: 620, sun: [1600, 170], hills: "grass" });
  cloud(S, 420, 170, 1); cloud(S, 1180, 120, 0.8); if (o.clouds !== false) cloud(S, 1760, 300, 0.6);
  tree(S, 210, 700, 1.05);
  flowers(S, [[1500, 720, "pink"], [1580, 740, "yellow"], [1680, 724, "purple"], [380, 760, "pink"], [1800, 800, "red"]]);
  return O;
};
const park = (S) => {
  const O = DS.outdoor(S, { hy: 600, sun: [300, 140], hills: "grass", path: [700, 1100] });
  cloud(S, 760, 150, 0.75); cloud(S, 1500, 110, 0.6);
  tree(S, 140, 680, 0.9); tree(S, 1840, 650, 0.7, "far");
  // swings in the far left
  S.draw("M300 360 L250 640 M300 360 L350 640 M560 360 L510 640 M560 360 L610 640 M290 362 H570", S.start, 0, { c: DS.c("blue", 0, "mid"), w: DS.w.near });
  [[380, 360, 380, 560], [480, 360, 480, 580]].forEach(([x0, y0, x1, y1]) => { S.draw(`M${x0 - 18} ${y0} L${x1 - 18} ${y1} M${x0 + 18} ${y0} L${x1 + 18} ${y1}`, S.start, 0, { c: DS.c("gray", 2, "mid"), w: DS.w.hair }); DS.shape(S, rrect(x1 - 30, y1, 60, 14, DS.r.xs), "orange", { layer: "mid", w: "detail" }); });
  DS.shadow(S, 430, 640, 420);
  // slide on the right: ladder at the back, platform, chute down-left to the grass
  S.draw("M1560 900 L1600 540 M1640 900 L1680 540", S.start, 0, { c: DS.c("blue"), w: DS.w.near * 1.6 });
  [600, 680, 760, 840].forEach((y) => S.draw(`M${1560 + (900 - y) / 9} ${y} H${1640 + (900 - y) / 9}`, S.start, 0, { c: DS.c("blue", 2), w: DS.w.near }));
  DS.shape(S, rrect(1380, 528, 330, 30, DS.r.xs), "yellow");
  DS.shape(S, "M1392 552 C1300 640 1260 820 1120 870 L1110 904 C1290 870 1340 690 1440 560 Z", "red");
  S.draw("M1400 556 C1310 646 1270 826 1124 876", S.start, 0, { c: DS.c("red", 1), w: DS.w.mid });
  DS.shadow(S, 1400, 905, 640);
  flowers(S, [[240, 860, "yellow"], [330, 900, "pink"], [1760, 920, "purple"], [1840, 880, "yellow"]]);
  return O;
};
const shop = (S) => {
  const R = DS.room(S, { wall: "wall", floor: "sand", window: false });
  const crate = (x, y) => DS.shape(S, rrect(x, y, 230, 120, DS.r.xs), "wood", { layer: "mid", w: "mid" });
  [250, 470].forEach((y) => DS.shape(S, rrect(370, y, 1180, 22, DS.r.xs), "white", { layer: "mid", w: "mid" }));
  const row = (x0, y, n, fn) => { for (let i = 0; i < n; i++) fn(x0 + i * 52, y); };
  row(400, 220, 5, (x, y) => DS.shape(S, circ(x, y, 26), "red", { layer: "mid", w: "mid" }));                          // apples
  row(690, 220, 5, (x, y) => DS.shape(S, circ(x, y, 26), "orange", { layer: "mid", w: "mid" }));                       // oranges
  row(990, 196, 4, (x, y) => { DS.shape(S, rrect(x - 22, y - 30, 44, 84, DS.r.xs), "white", { layer: "mid", w: "mid" }); S.fill(rrect(x - 22, y + 4, 44, 22, DS.r.xs), S.start, 0, DS.c("sky", 0, "mid"), 1); }); // milk
  row(1240, 214, 5, (x, y) => DS.shape(S, `M${x - 26} ${y + 30} Q${x - 26} ${y - 26} ${x + 26} ${y - 30} Q${x - 8} ${y - 6} ${x + 4} ${y + 30} Z`, "yellow", { layer: "mid", w: "mid" })); // bananas
  row(410, 434, 4, (x, y) => DS.shape(S, `M${x - 16} ${y - 16} L${x + 16} ${y - 16} L${x} ${y + 30} Z`, "orange", { layer: "mid", w: "mid" }));  // carrots
  row(690, 438, 4, (x, y) => DS.shape(S, circ(x, y, 26, 24), "green", { layer: "mid", w: "mid" }));                   // lettuces
  row(980, 430, 4, (x, y) => DS.shape(S, rrect(x - 26, y - 22, 52, 46, DS.r.md), "earth", { layer: "mid", w: "mid" })); // bread
  row(1260, 434, 5, (x, y) => DS.shape(S, circ(x, y, 22), "purple", { layer: "mid", w: "mid" }));                     // plums
  crate(380, 600); crate(1310, 600);
  [[420, 612], [470, 606], [520, 612], [570, 606]].forEach(([x, y]) => DS.shape(S, circ(x, y, 24), "red", { layer: "mid", w: "mid" }));
  [[1350, 612], [1400, 606], [1450, 612], [1500, 606]].forEach(([x, y]) => DS.shape(S, circ(x, y, 24), "grass", { layer: "mid", w: "mid" }));
  return R;
};
// the shopping cart: back + basket inside, call front() after putting things in it
const cart = (S, x, gy) => {
  DS.shadow(S, x + 30, gy, 420);
  const back = () => { S.draw(`M${x - 190} ${gy - 330} L${x + 190} ${gy - 330}`, S.start, 0, { c: DS.c("gray", 2), w: DS.w.near }); };
  const front = () => {
    const d = `M${x - 200} ${gy - 330} L${x + 200} ${gy - 330} L${x + 160} ${gy - 130} L${x - 160} ${gy - 130} Z`;
    S.fill(d, S.start, 0, DS.c("sky", 1), 0.35);
    let m = ""; for (let i = -3; i <= 3; i++) m += `M${x + i * 54} ${gy - 330} L${x + i * 43} ${gy - 130} `; for (let j = 1; j < 4; j++) { const y = gy - 330 + j * 50, w = 200 - j * 10; m += `M${x - w} ${y} H${x + w} `; }
    S.draw(m, S.start, 0, { c: DS.c("gray", 0), w: DS.w.mid });
    S.draw(d, S.start, 0, { c: DS.c("gray", 2), w: DS.w.near });
    S.draw(`M${x + 200} ${gy - 330} L${x + 250} ${gy - 400} H${x + 300}`, S.start, 0, { c: DS.c("gray", 2), w: DS.w.near });   // handle
    DS.shape(S, rrect(x + 270, gy - 414, 70, 28, DS.r.sm), "red", { w: "mid" });
    S.draw(`M${x - 150} ${gy - 130} L${x - 130} ${gy - 30} M${x + 150} ${gy - 130} L${x + 130} ${gy - 30} M${x - 140} ${gy - 30} H${x + 140}`, S.start, 0, { c: DS.c("gray", 2), w: DS.w.near });
    [-130, 130].forEach((dx) => DS.shape(S, circ(x + dx, gy - 18, 20), "ink", { w: "mid" }));
  };
  return { back, front };
};
const school = (S) => {
  const R = DS.room(S, { wall: "wall", floor: "floor", window: false });
  DS.shape(S, rrect(400, 160, 920, 320, DS.r.sm), "wood", { layer: "mid" });
  S.fill(rect(424, 184, 872, 272), S.start, 0, DS.c("green", 2), 1);
  S.text("ABC", 560, 350, { size: DS.type.display, c: DS.P.white[0] });
  S.text("123", 560, 440, { size: DS.type.small, c: DS.P.white[0] });
  DS.shape(S, rrect(560, 480, 600, 16, DS.r.xs), "wood", { layer: "mid", w: "mid" });
  DS.shape(S, circ(1440, 260, 62), "white", { layer: "mid" }); S.draw("M1440 260 V220 M1440 260 L1470 276", S.start, 0, { c: DS.line("mid"), w: DS.w.mid });   // clock
  ["red", "orange", "yellow", "grass", "sky", "purple"].forEach((c, i) => DS.shape(S, `M${400 + i * 200} 104 H${500 + i * 200} L${450 + i * 200} 150 Z`, c, { layer: "mid", w: "detail" })); // bunting
  S.draw("M380 104 H1540", S.start, 0, { c: DS.line("mid"), w: DS.w.hair });
  return R;
};
// a little school desk (drawn after whoever sits behind it)
const desk = (S, x, gy, w = 380, h = 200) => {
  DS.shadow(S, x, gy, w * 1.1);
  DS.shape(S, rrect(x - w / 2 + 20, gy - h, w - 40, h, DS.r.xs), "orange", { dir: "v" });
  DS.shape(S, rrect(x - w / 2, gy - h - 26, w, 30, DS.r.xs), "wood");
};
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
