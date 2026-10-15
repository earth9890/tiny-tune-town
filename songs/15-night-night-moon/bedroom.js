// 15 Night-Night, Moon: Ollie's bedroom at night + the sleepy friends. Included by scenes.js and both thumbnails
// (cast.js must be included first). Everything here belongs to this song only.
// Layout: big window centre-back (moon top-left, star top-right) above Ollie's bed; Bibi in a basket bed on the left;
// nightstand right with the fish bowl and a mushroom night-light. A navy wash dims the set; characters are drawn after it, so faces stay bright.
const FACE = [960, 495], BIBI_P = [400, 600], FISH_P = [1490, 640], STAR_P = [1232, 190], MOON_P = [760, 240];
const op = (e, t, a, b, d = 0.6) => tl.fromTo(e, { opacity: a }, { opacity: b, duration: d, ease: "sine.inOut", immediateRender: false }, t);
const hid = (e) => { e.setAttribute("opacity", 0); return e; };
const starPts = (x, y, r1, r2) => Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? r2 : r1; return [x + Math.cos(a) * r, y + Math.sin(a) * r]; });

// a sleepy face for the moon and the star: eyes open | shut, mouth smile | yawn | grin
const sleepyFace = (S, x, y, s, g) => {
  const eo = S.grp(g), es = hid(S.grp(g)), ms = S.grp(g), my = hid(S.grp(g)), mg = hid(S.grp(g));
  [-1, 1].forEach((d) => {
    const ex = x + d * 26 * s;
    S.fill(circ(ex, y, 11 * s, 14 * s), S.start, 0, DS.P.ink[0], 1, eo);
    S.fill(circ(ex - 3 * s, y - 5 * s, 4.5 * s), S.start, 0, DS.P.white[0], 1, eo);
    S.draw(`M${K(ex - 12 * s)} ${K(y)} Q${K(ex)} ${K(y + 11 * s)} ${K(ex + 12 * s)} ${K(y)}`, S.start, 0, { c: DS.line(), w: DS.w.mid, parent: es });
    S.fill(circ(x + d * 46 * s, y + 18 * s, 10 * s, 6 * s), S.start, 0, DS.c("red", 1), 0.55, g);
  });
  S.draw(`M${K(x - 14 * s)} ${K(y + 24 * s)} Q${K(x)} ${K(y + 36 * s)} ${K(x + 14 * s)} ${K(y + 24 * s)}`, S.start, 0, { c: DS.line(), w: DS.w.mid, parent: ms });
  S.draw(circ(x, y + 32 * s, 9 * s, 12 * s), S.start, 0, { fill: DS.c("red", 2), c: DS.line(), w: DS.w.detail, parent: my });
  S.draw(`M${K(x - 24 * s)} ${K(y + 20 * s)} Q${K(x)} ${K(y + 58 * s)} ${K(x + 24 * s)} ${K(y + 20 * s)} Z`, S.start, 0, { fill: DS.c("red", 2), c: DS.line(), w: DS.w.mid, parent: mg });
  return {
    shut: () => { eo.setAttribute("opacity", 0); es.setAttribute("opacity", 1); },
    sleep: (t) => { op(eo, t, 1, 0); op(es, t, 0, 1); },
    wake: (t) => { op(es, t, 1, 0); op(eo, t, 0, 1); },
    yawn: (t, d) => { op(ms, t, 1, 0, 0.3); op(my, t, 0, 1, 0.3); op(my, t + d, 1, 0, 0.3); op(ms, t + d, 0, 1, 0.3); },
    grin: (t) => { op(ms, t, 1, 0, 0.4); op(mg, t, 0, 1, 0.4); },
  };
};

// the moon: a round pale-yellow face with a soft glow
const moonie = (S, x, y, r, o = {}) => {
  const glow = S.fill(circ(x, y, r * 2.1), S.start, 0, DS.glow(DS.P.yellow[1], 0.65), 1), g = S.grp();
  DS.shape(S, circ(x, y, r), "yellow", { parent: g, flat: true, tone: 1 });
  [[-0.45, -0.5, 0.16], [0.5, -0.38, 0.11], [0.55, 0.42, 0.13]].forEach(([dx, dy, rr]) => S.fill(circ(x + dx * r, y + dy * r, rr * r), S.start, 0, DS.c("yellow", 0), 0.55, g));
  const F = sleepyFace(S, x, y + 4, r / 62, g);
  if (o.asleep) F.shut();
  return Object.assign({ g, glow, x, y }, F);
};
// the star friend (same five-point yellow star as the sea star, up in the sky, no ground shadow)
const skyStar = (S, x, y, k, o = {}) => {
  const glow = S.fill(circ(x, y, 150 * k), S.start, 0, DS.glow(DS.P.yellow[1], 0.6), 1), g = G(S, null, `rotate(0 ${x} ${y})`);
  const P = starPts(x, y, 92 * k, 46 * k);
  DS.shape(S, smooth([...P, P[0], P[1]]) + " Z", "yellow", { parent: g });
  const F = sleepyFace(S, x, y - 2 * k, 0.62 * k, g);
  if (o.asleep) { F.shut(); glow.setAttribute("opacity", 0.45); }
  return Object.assign({ g, glow, x, y, k }, F);
};
// Ollie in bed: nightcap, sleepy lids (0 open, 1 shut) and a yawn mouth, all inside his body group
const ollieBed = (S, lids = 0, x = 960, gy = 880, k = 1.15, mouth = "smile") => {
  const O = ollie(S, x, gy, k, { mouth }), b = O.body;
  // lid colours follow the head's light (top-left light, so the left eye sits in a lighter part of the gradient)
  const lidC = { "-1": DS.mix(DS.c("pink", 1), DS.c("pink", 0), 0.62), "1": DS.mix(DS.c("pink", 0), DS.c("pink", 2), 0.1) };
  const lid = () => { const g = hid(S.grp(b));
    [-1, 1].forEach((s) => { const cx = 58 * s, cy = -330;
      S.fill(circ(cx, cy, 50, 58), S.start, 0, lidC[s], 1, g);
      S.draw(`M${cx - 30} ${cy + 4} Q${cx} ${cy + 26} ${cx + 30} ${cy + 4}`, S.start, 0, { c: DS.line(), w: DS.w.near, parent: g }); });
    return g; };
  const shut = lid(), yawn = hid(S.grp(b));
  S.draw(circ(0, -240, 38, 44), S.start, 0, { fill: DS.c("red", 2), c: DS.line(), w: DS.w.near, parent: yawn });
  S.fill(circ(0, -214, 18, 9), S.start, 0, DS.c("pink", 1), 1, yawn);
  // nightcap: light blue with white dots, floppy tip and pompom to the right (clear of the star)
  DS.shape(S, "M-140 -425 C-130 -585 150 -610 232 -490 Q252 -448 240 -402 Q214 -464 140 -430 Z", "sky", { parent: b });
  [[-60, -515], [30, -545], [110, -525], [-100, -460], [170, -480], [10, -470]].forEach(([x, y]) => S.fill(circ(x, y, 9), S.start, 0, DS.P.white[0], 0.9, b));
  DS.shape(S, "M-150 -392 Q0 -520 150 -392 L146 -428 Q0 -556 -146 -428 Z", "white", { parent: b, w: "mid" });
  DS.shape(S, circ(242, -398, 30), "white", { parent: b, w: "mid" });
  if (lids >= 1) shut.setAttribute("opacity", 1);
  O.sleep = (t) => op(shut, t, 0, 1, 0.8);
  O.yawn = (t, d = 2) => { op(yawn, t, 0, 1, 0.4); op(yawn, t + d, 1, 0, 0.4); };
  O.sway = (t0, t1, a = 3) => tw(b, t0, t1 - t0, "rotate(0 0 -250)", `rotate(${a} 0 -250)`, wave(cyc(t1 - t0, 4 * BEAT)));
  return O;
};
// Bibi in her basket: awake and asleep builds; asleep() crossfades
const bibiBed = (S, asleep = false) => {
  const mk = (mood) => { const w = S.grp(); const B = bibi(S, 400, 560, { k: 0.72, mood, paws: [[322, 726], [478, 726]] }); w.appendChild(B.g); B.w = w; return B; };
  const A = mk(), Z = mk("joy");
  Z.w.setAttribute("transform", "rotate(-7 400 720)");
  const yawn = hid(S.grp(A.g));
  S.draw(circ(400, 610, 24, 28), S.start, 0, { fill: DS.c("red", 2), c: DS.line(), w: DS.w.mid, parent: yawn });
  (asleep ? A : Z).w.setAttribute("opacity", 0);
  return { A, Z, yawn: (t, d = 2) => { op(yawn, t, 0, 1, 0.4); op(yawn, t + d, 1, 0, 0.4); }, sleep: (t) => { op(A.w, t, 1, 0, 0.9); op(Z.w, t, 0, 1, 0.9); } };
};
// the fish in her bowl: eye overlay for sleep, small yawn
const bowlFish = (S, asleep = false) => {
  const F = fish(S, 1490, asleep ? 668 : 650, 0.42, "orange", -1), shut = hid(S.grp(F.bob)), yawn = hid(S.grp(F.bob));
  S.fill(circ(36, -12, 20), S.start, 0, DS.c("orange", 0), 1, shut);
  S.draw("M20 -12 Q36 2 52 -12", S.start, 0, { c: DS.line(), w: DS.w.near, parent: shut });
  S.draw(circ(50, 22, 12, 14), S.start, 0, { fill: DS.c("red", 2), c: DS.line(), w: DS.w.mid, parent: yawn });
  if (asleep) shut.setAttribute("opacity", 1);
  F.sleep = (t) => { op(shut, t, 0, 1, 0.8); F.move(1490, 668, t, 2.4); };
  F.yawn = (t, d = 2) => { op(yawn, t, 0, 1, 0.4); op(yawn, t + d, 1, 0, 0.4); };
  return F;
};
// floating Zs above a sleeper from t0 to t1 (soft, slow, one every 1.8 s)
const zz = (S, x, y, t0, t1, k = 1) => {
  for (let t = t0, i = 0; t < t1 - 1.2; t += 1.8, i++) {
    const s = (16 + (i % 3) * 7) * k, g = G(S, null, `translate(${x} ${y})`), d = `M${K(-s / 2)} ${K(-s / 2)} H${K(s / 2)} L${K(-s / 2)} ${K(s / 2)} H${K(s / 2)}`;
    S.draw(d, S.start, 0, { c: DS.c("navy", 0), w: DS.w.near + DS.w.mid, parent: g });
    S.draw(d, S.start, 0, { c: DS.P.white[0], w: DS.w.mid, parent: g });
    g.setAttribute("opacity", 0);
    tw(g, t, 2.6, `translate(${x} ${y})`, `translate(${K(x + (24 + (i % 2) * 22) * k)} ${K(y - 90 * k)})`, "sine.out");
    op(g, t, 0, 1, 0.5); op(g, t + 1.9, 1, 0, 0.7);
  }
};

// the whole room; st = { bibi, fish, star, moon: true = asleep, lids: 0 | 1 }. Returns the characters.
const bedroom = (S, st = {}) => {
  DS.room(S, { wall: "dusk", window: false });
  // window onto the night sky, with curtains and a sill
  DS.shape(S, rrect(604, 94, 712, 438, DS.r.xs), "white", { layer: "mid", w: "mid" });
  S.fill(rect(624, 114, 672, 398), S.start, 0, DS.vgrad(DS.P.navy[1], DS.P.night[0]), 1);
  S.fill(`M624 512 L624 470 Q760 430 900 466 Q1060 500 1180 452 Q1250 430 1296 448 L1296 512 Z`, S.start, 0, DS.c("night", 2), 0.8); // far hills
  DS.shape(S, rrect(586, 512, 748, 30, DS.r.xs), "wood", { layer: "mid", w: "mid" });
  [[540, 1], [1380, -1]].forEach(([x, s]) => DS.shape(S, `M${x - 40 * s} 70 L${x + 130 * s} 70 Q${x + 92 * s} 300 ${x + 60 * s} 380 Q${x + 120 * s} 520 ${x + 110 * s} 640 L${x - 40 * s} 640 Z`, "purple", { layer: "mid", dir: "h" }));
  [[620, 380], [1300, 380]].forEach(([x, y]) => DS.shape(S, rrect(x - 26, y - 12, 52, 24, DS.r.sm), "gold", { layer: "mid", w: "detail" }));
  S.draw("M400 70 H1520", S.start, 0, { c: DS.c("wood", 2, "mid"), w: DS.w.mid });                                          // curtain rail
  DS.frame(S, 384, 168, 132, 160, "sky"); DS.frame(S, 1424, 190, 104, 120, "grass");
  // bed: headboard + pillow behind Ollie
  DS.shape(S, `M650 780 L650 600 Q650 552 700 552 L1220 552 Q1270 552 1270 600 L1270 780 Z`, "wood", { layer: "mid" });
  [760, 860, 960, 1060, 1160].forEach((x) => S.draw(`M${x} 580 V760`, S.start, 0, { c: DS.c("wood", 2, "mid"), w: DS.w.detail }));
  DS.shape(S, circ(960, 700, 250, 74), "white", { w: "mid" });
  // Bibi's corner: rug, basket back
  DS.rug(S, 400, 905, 560, "purple"); DS.shadow(S, 400, 880, 430);
  DS.shape(S, circ(400, 742, 196, 46), "wood", { tone: 2, flat: true, w: "mid" });
  // nightstand
  DS.shadow(S, 1525, 905, 300);
  DS.shape(S, rrect(1412, 744, 226, 160, DS.r.sm), "wood"); DS.shape(S, rrect(1396, 724, 258, 26, DS.r.xs), "wood", { w: "mid" });
  S.draw("M1424 820 H1626", S.start, 0, { c: DS.c("wood", 2), w: DS.w.mid }); DS.shape(S, circ(1525, 792, 10), "gold", { w: "detail" });
  // night-time wash over the set (characters come after it and stay bright)
  S.fill(rect(-200, -200, 2320, 1480), S.start, 0, DS.P.night[0], 0.3);
  S.fill(circ(1600, 650, 520, 440), S.start, 0, DS.glow(DS.P.yellow[1], 0.55), 1);                                         // night-light glow
  S.fill(circ(960, 600, 760, 520), S.start, 0, DS.glow(DS.P.dusk[1], 0.35), 1);                                             // warm room light on the bed
  // little stars in the window, breathing slowly
  [[690, 150, 5], [860, 170, 4], [980, 140, 6], [1090, 330, 4], [700, 380, 4], [1250, 400, 5], [1010, 250, 3], [880, 300, 4], [1260, 140, 4]].forEach(([x, y, r], i) => {
    const p = S.fill(poly(starPts(x, y, r * 2.2, r)), S.start, 0, DS.P.yellow[1], 0.95);
    swing(S, p, S.start + (i % 4) * 0.4, S.end, { opacity: 0.45 }, 4 * BEAT); });
  // fairy lights along the curtain rail
  for (let i = 0; i < 12; i++) { const x = 440 + i * 96, y = 84 + Math.sin((i / 11) * Math.PI) * 30;
    S.fill(circ(x, y + 14, 26), S.start, 0, DS.glow(DS.P.yellow[1], 0.7), 1);
    DS.shape(S, circ(x, y + 14, 9, 12), ["yellow", "pink", "sky", "grass"][i % 4], { w: "detail" }); }
  // the moon and the star (window), Bibi (basket), Ollie (bed), the fish (bowl)
  const M = moonie(S, MOON_P[0], MOON_P[1], 74, { asleep: st.moon }), St = skyStar(S, STAR_P[0], STAR_P[1], 0.72, { asleep: st.star });
  const B = bibiBed(S, st.bibi);
  DS.shape(S, "M206 742 Q400 812 594 742 L566 884 Q400 914 234 884 Z", "wood");                                            // basket front + weave
  [250, 330, 410, 490].forEach((x) => S.draw(`M${x} 800 Q${x + 40} 840 ${x + 76} 886`, S.start, 0, { c: DS.c("wood", 2), w: DS.w.detail }));
  DS.shape(S, "M200 732 Q400 806 600 732 L592 786 Q400 852 208 786 Z", "yellow");                                            // Bibi's blanket
  const O = ollieBed(S, st.lids || 0);
  DS.shape(S, "M480 1120 L520 760 Q530 724 570 724 L1350 724 Q1390 724 1400 760 L1440 1120 Z", "blue");                    // Ollie's blanket
  S.fill("M530 728 L1390 728 L1394 770 Q960 802 526 770 Z", S.start, 0, DS.P.white[0], 1);                                  // folded sheet
  S.draw("M526 770 Q960 802 1394 770", S.start, 0, { c: DS.line(), w: DS.w.mid });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const x = 600 + c * 132 + (r % 2) * 60, y = 850 + r * 90; S.fill(poly(starPts(x, y, 20, 9)), S.start, 0, DS.c("yellow", 1), 0.9); }
  // fish bowl: water, gravel, the fish, then the glass in front; mushroom night-light
  S.fill(`M1424 606 A84 84 0 1 0 1556 606 Z`, S.start, 0, DS.c("sky", 0), 0.75);
  S.fill(circ(1490, 714, 62, 14), S.start, 0, DS.c("sand", 0), 1);
  const F = bowlFish(S, st.fish);
  S.draw(circ(1490, 650, 86), S.start, 0, { c: DS.c("sky", 2), w: DS.w.mid, fill: DS.c("glass", 1), op: 0.95 }).setAttribute("fill-opacity", 0.18);
  S.draw("M1442 600 Q1450 580 1468 572", S.start, 0, { c: DS.P.white[0], w: DS.w.mid });
  DS.shape(S, rrect(1590, 662, 22, 64, DS.r.xs), "white", { w: "mid" });
  DS.shape(S, "M1548 670 Q1556 610 1601 606 Q1646 610 1654 670 Z", "yellow", { w: "mid" });
  [[1580, 646], [1618, 640], [1600, 626]].forEach(([x, y]) => S.fill(circ(x, y, 6), S.start, 0, DS.P.white[0], 0.9));
  return { O, B, F, St, M };
};
