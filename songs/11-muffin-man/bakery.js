// look: still   (bakery set for 11 The Muffin Man; included by scenes.js and the thumbnails after cast.js)
// The Muffin Man = a kind round baker (chef hat, apron, moustache). Treats: muffin, bun, pie, bread. Set: the bakery on Drury Lane.
const BAKERY_ROOM = { wall: "wall", floor: "floor", window: false };
const OVEN = [1330, 772];                      // oven base centre (mid plane, against the back wall)
const MOUTH = [1330, 610];                     // where treats pop out

// one treat centred on (x, y); k scales it. kinds: muffin bun pie bread. Returns its group.
const treat = (S, kind, x, y, k = 1, parent, c = "sky") => {
  const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`), o = { parent: g, w: "mid" };
  if (kind === "muffin") {
    DS.shape(S, "M-38 0 L-29 42 H29 L38 0 Z", c, o);
    [-18, 0, 18].forEach((dx) => S.draw(`M${dx} 4 L${dx * 0.8} 38`, S.start, 0, { c: DS.c(c, 2), w: DS.w.hair, parent: g }));
    DS.shape(S, "M-47 6 C-56 -30 -28 -50 0 -48 C28 -50 56 -30 47 6 Z", "earth", o);
    [[-18, -22], [12, -30], [22, -8], [-4, -6]].forEach(([dx, dy]) => S.fill(circ(dx, dy, 7), S.start, 0, DS.c("purple", 2), 1, g));
    S.fill(circ(-22, -34, 10, 5), S.start, 0, DS.P.white[0], 0.5, g);
  } else if (kind === "bun") {
    DS.shape(S, circ(0, 0, 50, 40), "gold", o);
    S.draw("M-30 -18 Q0 -26 30 -18 M-4 -36 Q-6 0 -2 32", S.start, 0, { c: DS.P.white[0], w: DS.w.near, parent: g });
    S.fill(circ(-26, -16, 12, 6), S.start, 0, DS.P.white[0], 0.45, g);
  } else if (kind === "pie") {
    DS.shape(S, "M-62 0 H62 L50 26 H-50 Z", "sky", o);
    DS.shape(S, "M-60 2 C-54 -40 54 -40 60 2 Z", "gold", o);
    S.draw("M-36 -2 L-14 -30 M-8 -2 L14 -34 M20 -2 L38 -24 M-40 -16 H40", S.start, 0, { c: DS.c("gold", 2), w: DS.w.detail, parent: g });
    [[-24, -12], [4, -16], [28, -10]].forEach(([dx, dy]) => S.fill(circ(dx, dy, 6), S.start, 0, DS.c("red", 0), 0.9, g));
  } else {
    DS.shape(S, "M-66 14 C-70 -30 -30 -40 0 -40 C30 -40 70 -30 66 14 C40 24 -40 24 -66 14 Z", "earth", o);
    S.draw("M-36 -26 L-22 2 M-6 -32 L8 -4 M24 -28 L38 -2", S.start, 0, { c: DS.c("sand", 1), w: DS.w.mid, parent: g });
    S.fill(circ(-30, -24, 14, 6), S.start, 0, DS.P.white[0], 0.4, g);
  }
  return g;
};

// the brick oven on the back wall, with a warm glow in its mouth
const oven = (S) => {
  const [x, gy] = OVEN;
  DS.shape(S, rect(x - 40, 90, 80, 230), "gray", { layer: "mid", w: "mid" });                                                     // chimney
  DS.shape(S, `M${x - 200} ${gy} V${gy - 120} C${x - 200} ${gy - 470} ${x + 200} ${gy - 470} ${x + 200} ${gy - 120} V${gy} Z`, "orange", { layer: "mid", tone: 0 });
  let d = ""; for (let y = gy - 150; y > gy - 400; y -= 50) { const hw = 200 * Math.sqrt(Math.max(0, 1 - ((gy - 120 - y) / 340) ** 2)); d += `M${K(x - hw + 10)} ${y} H${K(x + hw - 10)} `; for (let bx = x - hw + 40 + ((y / 50) % 2) * 30; bx < x + hw - 20; bx += 70) d += `M${K(bx)} ${y} V${y - 50} `; }
  S.draw(d, S.start, 0, { c: DS.c("orange", 2, "mid"), w: DS.w.hair, op: 0.8 });
  DS.shape(S, rrect(x - 220, gy - 30, 440, 50, DS.r.xs), "gray", { layer: "mid", w: "mid" });                                     // hearth stone
  const m = `M${x - 96} ${gy - 34} V${gy - 150} C${x - 96} ${gy - 270} ${x + 96} ${gy - 270} ${x + 96} ${gy - 150} V${gy - 34} Z`;
  S.draw(m, S.start, 0, { fill: DS.c("brown", 2), c: DS.line("mid"), w: DS.w.mid });
  S.fill(circ(x, gy - 110, 120, 110), S.start, 0, DS.glow(DS.P.orange[1], 0.95), 1);
  [[-40, 0], [0, -14], [40, 0]].forEach(([dx, dy]) => S.fill(`M${x + dx - 26} ${gy - 36} Q${x + dx} ${gy - 120 + dy} ${x + dx + 26} ${gy - 36} Z`, S.start, 0, DS.c("yellow", 0), 0.9));
};

// wall shelves full of treats on the left of the back wall
const shelves = (S) => {
  [310, 480, 650].forEach((y) => { DS.shape(S, rrect(390, y, 400, 20, DS.r.xs), "wood", { layer: "mid", w: "mid" }); [430, 750].forEach((bx) => DS.shape(S, `M${bx} ${y + 20} L${bx + 10} ${y + 46} H${bx - 10} Z`, "wood", { layer: "mid", w: "detail" })); });
  [["bread", 470, 286], ["bread", 600, 286], ["bread", 720, 286]].forEach(([k, x, y]) => treat(S, k, x, y, 0.75));
  [440, 520, 600, 680, 750].forEach((x, i) => treat(S, "muffin", x, 446, 0.6, null, ["red", "sky", "yellow", "grass", "purple"][i]));
  [["pie", 480, 630], ["bun", 600, 628], ["bun", 690, 628], ["pie", 740, 630]].forEach(([k, x, y]) => treat(S, k, x, y, 0.62));
};

// the hanging shop sign with a big muffin, on the back wall above Ollie
const wallSign = (S) => {
  S.draw("M880 90 L900 150 M1040 90 L1020 150", S.start, 0, { c: DS.c("brown", 0, "mid"), w: DS.w.detail });
  DS.shape(S, rrect(860, 150, 200, 130, DS.r.sm), "wood", { layer: "mid", w: "mid" });
  treat(S, "muffin", 960, 218, 0.85, null, "red");
};

// bunting across the back wall (party decoration); fades in at t
const bunting = (S, t) => { const g = S.grp(); fadeIn(S, g, t);
  S.draw("M370 110 Q960 190 1550 110", S.start, 0, { c: DS.c("brown", 0, "mid"), w: DS.w.detail, parent: g });
  for (let i = 0; i < 13; i++) { const x = 400 + i * 90, y = 112 + 74 * (1 - ((x - 960) / 590) ** 2) * 0.95; DS.shape(S, `M${K(x - 30)} ${K(y)} L${K(x + 30)} ${K(y)} L${K(x)} ${K(y + 56)} Z`, ["red", "yellow", "sky", "grass", "orange"][i % 5], { layer: "mid", w: "detail", parent: g }); }
  return g; };

// the Muffin Man: a kind, round baker. x = centre, gy = feet, k = scale. Returns { g, bob, R, L (arm groups; rotate about .sh), face }
const baker = (S, x, gy, k = 0.75, o = {}) => {
  DS.shadow(S, x, gy, 330 * k);
  const g = G(S, null, `translate(${x} ${gy}) scale(${k})`), bob = G(S, g, "translate(0 0)"), p = { parent: bob };
  [-1, 1].forEach((s) => { DS.shape(S, rrect(s * 52 - 26, -130, 52, 120, DS.r.sm), "navy", p); DS.shape(S, circ(s * 64, -12, 48, 24), "brown", p); });
  const arm = (s) => { const ag = G(S, bob, "rotate(0)"); ag.sh = `${K(x + s * 140 * k)} ${K(gy - 400 * k)}`;
    DS.shape(S, cap(s * 140, -400, s * 210, -250, 38), "blue", { parent: ag });
    DS.shape(S, circ(s * 214, -232, 40), "dusk", { parent: ag }); return ag; };
  const L = arm(-1), R = arm(1);
  DS.shape(S, circ(0, -290, 175, 180), "blue", p);                                                                          // round body
  DS.shape(S, "M-118 -380 H118 V-200 C118 -110 -118 -110 -118 -200 Z", "white", p);                                     // apron
  S.draw("M-118 -380 L-160 -430 M118 -380 L160 -430", S.start, 0, { c: DS.c("white", 2), w: DS.w.mid, parent: bob });
  DS.shape(S, rrect(-48, -250, 96, 64, DS.r.sm), "white", { parent: bob, w: "detail" });                                   // pocket
  S.fill(circ(-48, -330, 14), S.start, 0, DS.c("red", 0), 0.9, bob);                                                       // little heart-red button
  DS.shape(S, circ(0, -560, 112, 106), "dusk", p);                                                                           // head
  [-1, 1].forEach((s) => DS.shape(S, circ(s * 110, -560, 22, 30), "dusk", { parent: bob, w: "mid" }));
                                                                                                                           // chef hat
  [[-62, -722, 56], [0, -760, 68], [62, -722, 56]].forEach(([dx, dy, r]) => DS.shape(S, circ(dx, dy, r), "white", p));
  DS.shape(S, rrect(-96, -690, 192, 52, DS.r.sm), "white", p);
  [-1, 1].forEach((s) => {
    S.fill(circ(s * 40, -580, 17, 21), S.start, 0, DS.P.ink[0], 1, bob);
    S.fill(circ(s * 40 - 6, -588, 7), S.start, 0, DS.P.white[0], 1, bob);
    S.fill(circ(s * 70, -526, 20, 12), S.start, 0, DS.c("red", 1), 0.55, bob);
    S.draw(`M${s * 22} -620 Q${s * 40} -634 ${s * 58} -620`, S.start, 0, { c: DS.c("brown"), w: DS.w.mid, parent: bob });   // eyebrows
    DS.shape(S, `M0 -536 C${s * 20} -556 ${s * 56} -552 ${s * 66} -526 C${s * 50} -530 ${s * 24} -524 0 -520 Z`, "brown", { parent: bob, w: "detail" }); // moustache
  });
  S.fill(circ(0, -548, 16, 13), S.start, 0, DS.c("red", 1), 0.9, bob);                                                     // round nose
  S.draw("M-30 -506 Q0 -480 30 -506", S.start, 0, { c: DS.line(), w: DS.w.mid, parent: bob });
  const M = { g, bob, L, R, k, x, gy, face: [x, gy - 560 * k] };
  // wave hello with one arm (s = 1 right, -1 left) between t0 and t1
  M.wave = (t0, t1, s = 1) => { const A = s === 1 ? R : L, o = `${s * 140} -400`, up = -125 * s, n = cyc(t1 - t0 - 1, 2 * BEAT);
    tw(A, t0, 0.5, `rotate(0 ${o})`, `rotate(${up} ${o})`); tw(A, t0 + 0.5, t1 - t0 - 1, `rotate(${up} ${o})`, `rotate(${up - 22 * s} ${o})`, wave(n)); tw(A, t1 - 0.5, 0.5, `rotate(${up} ${o})`, `rotate(0 ${o})`); };
  M.bounce = (t0, t1, amp = 10) => tw(bob, t0, t1 - t0, "translate(0 0)", `translate(0 ${-amp})`, hump(cyc(t1 - t0, 2 * BEAT)));
  M.bow = (t0) => tw(bob, t0, 1.2, "rotate(0 0 0)", "rotate(-8 0 0)", hump(1));
  return M;
};

// Bibi standing on the floor at (x, gy): wraps cast bibi() with a contact shadow
const bibiAt = (S, x, gy, k = 0.8, o = {}) => { DS.shadow(S, x, gy, 280 * k); return bibi(S, x, gy - 325 * k, Object.assign({ k }, o)); };

// ---------- Ollie's juggling gag: one treat balanced on each raised arm ----------
const HOLD = [245, 210, 180, 145];                                                    // raised direction per arm pair (left side, SVG degrees; right mirrors)
const ORDER = [[0, -1], [0, 1], [1, -1], [1, 1], [2, -1], [2, 1], [3, -1], [3, 1]];  // catch order: outer pair first, oven side first
const armOf = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const aim = (O, A, t0, dur) => { const phi = A.side === 1 ? HOLD[A.ai] : 180 - HOLD[A.ai];
  let r = phi - Math.atan2(A.tip[1] - A.y, A.tip[0] - A.x) * 180 / Math.PI; r = ((r + 540) % 360) - 180; O.raise(A, r * A.side, t0, dur); };
const slotPos = (O, n) => { const [x, y] = O.tipNow(armOf(O, ...ORDER[n]), 8); return [x, y - 40]; };
const TC = ["red", "sky", "yellow", "grass", "orange", "purple", "pink", "blue"];
// Ollie already holds these treats at the scene start; returns the juggle groups
const holdTreats = (S, O, kinds) => kinds.map((kd, n) => { aim(O, armOf(O, ...ORDER[n]), S.start, 0.01); const [x, y] = slotPos(O, n), j = G(S, O.body, "translate(0 0)"); treat(S, kd, x, y, 1, j, TC[n]); return j; });
// treat n pops out of the oven on its word (t), flies in an arc and lands on Ollie's arm n; returns its juggle group
const catchTreat = (S, O, n, kind, t, fly = 1.0) => {
  aim(O, armOf(O, ...ORDER[n]), t, 0.8);
  const [x, y] = slotPos(O, n), [sx, sy] = O.at([x, y]), [mx, my] = MOUTH, land = t + 0.4 + fly;
  const outer = G(S, null, "translate(0 0)"), arcG = G(S, outer, "translate(0 0)"), pop = S.grp(arcG);
  treat(S, kind, mx, my, O.k, pop, TC[n]); popAt(pop, t, mx, my);
  tw(outer, t + 0.4, fly, "translate(0 0)", `translate(${K(sx - mx)} ${K(sy - my)})`, "power1.inOut");
  tw(arcG, t + 0.4, fly, "translate(0 0)", "translate(0 -170)", hump(1));
  tl.set(outer, { opacity: 0 }, land);
  const j = G(S, O.body, "translate(0 0)"); treat(S, kind, x, y, 1, j, TC[n]);
  tl.fromTo(j, { opacity: 0 }, { opacity: 1, duration: 0.05 }, land);
  return j;
};
// toss the held treats up and down on the beat, neighbours in counter-phase
const juggle = (S, js, t0, t1, h = 44) => js.forEach((j, i) => { const s = t0 + (i % 2) * BEAT, n = Math.floor((t1 - s) / (2 * BEAT)); if (n >= 1) tw(j, s, n * 2 * BEAT, "translate(0 0)", `translate(0 ${-h})`, hump(n)); });
// the whole bakery with Ollie in the middle; o: { bibi, baker, mouth, look, held: [kinds], party }. draw(O) runs before the front props.
const bakery = (S, o = {}, draw) => {
  DS.room(S, BAKERY_ROOM); shelves(S); oven(S); wallSign(S);
  const B = o.bibi === false ? null : bibiAt(S, 420, 930, 0.8, { mood: o.bibiMood, paws: o.paws });
  const M = o.baker === false ? null : baker(S, 1640, 950, 0.74);
  const O = ollie(S, 960, 930, 1.1, { mouth: o.mouth || "smile", look: o.look || 0 });
  const J = holdTreats(S, O, o.held || []);
  if (draw) draw(O, B, M, J);
  return { O, B, M, J };
};

// ---------- outside: the bakery shopfront on Drury Lane (intro, outro) ----------
const shopfront = (S) => {
  DS.outdoor(S, { hy: 720, hills: "grass", ground: "sand", sun: [1700, 120] });
  [[-60, 300, 330, "pink"], [1650, 260, 360, "sky"]].forEach(([x, y, w, c]) => { DS.shape(S, rect(x, y, w, 760 - y), c, { layer: "far" });
    [0, 1].forEach((r) => [0, 1].forEach((q) => DS.shape(S, rrect(x + 60 + q * 140, y + 70 + r * 170, 90, 110, DS.r.xs), "glass", { layer: "far", w: "far" }))); });
  DS.shape(S, rect(290, 150, 1340, 610), "dusk", { layer: "mid", dir: "v" });                                                   // facade
  DS.shape(S, rect(270, 116, 1380, 48), "brown", { layer: "mid" });
  DS.shape(S, rrect(640, 182, 640, 104, DS.r.sm), "yellow", { layer: "mid", tone: 1 });                                        // sign
  S.text("DRURY LANE", 960, 262, { size: DS.type.title, c: DS.P.ink[0] });
  for (let i = 0; i < 12; i++) { const x = 300 + i * 110;                                                                         // striped awning
    DS.shape(S, `M${x} 320 H${x + 110} V392 Q${x + 55} 432 ${x} 392 Z`, i % 2 ? "white" : "red", { layer: "mid", w: "mid" }); }
  DS.shape(S, rrect(370, 450, 460, 270, DS.r.sm), "wood", { layer: "mid" });                                                     // shop window
  S.draw(rect(392, 472, 416, 226), S.start, 0, { fill: DS.c("glass", 0, "mid"), c: DS.line("mid"), w: DS.w.detail });
  DS.shape(S, rect(392, 640, 416, 14), "wood", { layer: "mid", w: "detail" });
  [["bread", 470, 610], ["pie", 600, 616], ["muffin", 720, 606]].forEach(([k, x, y]) => treat(S, k, x, y, 0.8, null, "red"));
  [["bun", 480, 520], ["muffin", 590, 516], ["bun", 700, 520]].forEach(([k, x, y]) => treat(S, k, x, y, 0.55, null, "sky"));
  S.fill(`M410 480 L470 480 L420 560 Z`, S.start, 0, DS.P.white[0], 0.45);
  DS.shape(S, rrect(1170, 440, 240, 320, DS.r.sm), "grass", { layer: "mid" });                                                 // door
  DS.shape(S, circ(1290, 530, 52), "glass", { layer: "mid", w: "mid" }); DS.shape(S, circ(1380, 620, 14), "gold", { layer: "mid", w: "detail" });
  DS.shape(S, `M1268 410 Q1290 372 1312 410 Z`, "gold", { layer: "mid", w: "mid" }); S.draw("M1290 380 V350", S.start, 0, { c: DS.line("mid"), w: DS.w.detail }); // shop bell
  [[1110, "red"], [1480, "pink"]].forEach(([x, c]) => { DS.shape(S, `M${x - 44} 690 H${x + 44} L${x + 34} 760 H${x - 34} Z`, "orange", { layer: "mid", w: "mid" });
    [[-26, 670], [0, 652], [26, 670]].forEach(([dx, y]) => DS.shape(S, circ(x + dx, y, 22), c, { layer: "mid", w: "detail" })); });
  DS.shape(S, rect(-200, 760, 2320, 20), "gray", { layer: "mid", w: "detail" });                                              // kerb line of the pavement
};
// a warm smell wisp curling up from (x, y) at t, drifting dx sideways
const wisp = (S, x, y, t, dx = -120) => { const g = G(S, null, "translate(0 0)"); fadeIn(S, g, t);
  S.draw(smooth([[x, y], [x - 20, y - 40], [x + 16, y - 80], [x - 14, y - 120], [x + 10, y - 160]]), S.start, 0, { c: DS.c("orange", 1), w: DS.w.near, parent: g, op: 0.85 });
  tw(g, t, Math.max(1, S.end - t), "translate(0 0)", `translate(${dx} -90)`, "sine.inOut"); S.fadeOut(g, Math.min(S.end - 0.5, t + 3.2), 0.6); return g; };

// Bibi holding a wooden tray in front of her (paws under it); put treats in .tray at y .ty
const bibiTray = (S, x, gy, k = 0.8, o = {}) => { const hy = gy - 325 * k;
  const B = bibiAt(S, x, gy, k, Object.assign({ paws: [[x - 100 * k, hy + 180 * k], [x + 100 * k, hy + 180 * k]] }, o)), tray = S.grp(B.g);
  DS.shape(S, rrect(x - 160 * k, hy + 136 * k, 320 * k, 28 * k, DS.r.sm), "wood", { parent: tray, w: "mid" });
  return Object.assign(B, { tray, ty: hy + 136 * k }); };
// the party table in front of everyone, with plates of treats; fades in at t
const partyTable = (S, t) => { const g = S.grp(); fadeIn(S, g, t ?? S.start);
  DS.shape(S, rect(430, 800, 1060, 300), "yellow", { parent: g, tone: 1 });
  DS.shape(S, "M430 800 H1490 V872 Q1446 910 1402 872 Q1358 910 1314 872 Q1270 910 1226 872 Q1182 910 1138 872 Q1094 910 1050 872 Q1006 910 962 872 Q918 910 874 872 Q830 910 786 872 Q742 910 698 872 Q654 910 610 872 Q566 910 522 872 Q478 910 430 872 Z", "white", { parent: g });
  [["muffin", 530, "red"], ["bun", 690], ["pie", 850], ["bread", 1070], ["bun", 1240], ["muffin", 1390, "sky"]].forEach(([kd, x, c]) => {
    S.draw(circ(x, 812, 74, 16), S.start, 0, { fill: DS.P.white[0], c: DS.c("gray", 1), w: DS.w.detail, parent: g }); treat(S, kd, x, 780, 0.95, g, c); });
  return g; };
