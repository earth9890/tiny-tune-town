// 07 Humpty Dumpty: the garden set and Humpty (a friendly round egg). Included after cast.js by scenes.js and the thumbnails.
// Layout (1920x1080): low stone wall from the left edge to x 820 (top 704), Humpty sits on it at x 560; grass ground y 920; Ollie stands at x 1080.
const GY7 = 920, WALL = { x0: -60, x1: 820, top: 704 };

const cloud7 = (S, x, y, k) => [[-70, 10, 60, 42], [0, -14, 74, 56], [74, 8, 58, 40], [10, 22, 110, 34]].forEach(([dx, dy, rx, ry]) =>
  S.fill(circ(x + dx * k, y + dy * k, rx * k, ry * k), S.start, 0, DS.P.white[0], 0.92));
const flower = (S, x, y, name = "pink", k = 1, layer = "near") => {
  S.draw(`M${x} ${y} Q${x - 6 * k} ${y + 30 * k} ${x} ${y + 60 * k}`, S.start, 0, { c: DS.c("green", 0, layer), w: DS.w.mid });
  [0, 72, 144, 216, 288].forEach((a) => { const r = (a * Math.PI) / 180; DS.shape(S, circ(x + Math.cos(r) * 15 * k, y + Math.sin(r) * 15 * k, 12 * k), name, { layer, w: "detail" }); });
  DS.shape(S, circ(x, y, 9 * k), "yellow", { layer, w: "detail" });
};
const bush = (S, x, gy, k = 1, layer = "mid") => {
  DS.shadow(S, x, gy, 260 * k);
  [[-80, -50, 70], [80, -46, 66], [0, -90, 90], [-40, -40, 60], [44, -36, 62]].forEach(([dx, dy, r]) => DS.shape(S, circ(x + dx * k, gy + dy * k, r * k), "grass", { layer }));
};
const tree = (S, x, gy) => {
  DS.shadow(S, x, gy, 300);
  DS.shape(S, `M${x - 34} ${gy} Q${x - 24} ${gy - 200} ${x - 16} ${gy - 330} H${x + 16} Q${x + 24} ${gy - 200} ${x + 34} ${gy} Z`, "wood", { layer: "mid" });
  [[-110, -380, 120], [110, -390, 116], [0, -480, 140], [-40, -340, 100], [60, -330, 96]].forEach(([dx, dy, r]) => DS.shape(S, circ(x + dx, gy + dy, r), "grass", { layer: "mid" }));
  [[-60, -420], [70, -460], [10, -370], [-120, -350], [120, -360]].forEach(([dx, dy]) => DS.shape(S, circ(x + dx, gy + dy, 16), "red", { layer: "mid", w: "detail" }));   // apples
};
const butterfly = (S, x, y, name, t0) => {
  const g = G(S, null, `translate(${x} ${y})`), w = G(S, g, "scale(1 1)");
  [-1, 1].forEach((s) => { DS.shape(S, circ(s * 22, -10, 22, 18), name, { parent: w, w: "detail" }); DS.shape(S, circ(s * 16, 14, 14, 11), name, { parent: w, w: "detail" }); });
  S.fill(rrect(-4, -22, 8, 44, DS.r.xs), S.start, 0, DS.P.ink[0], 1, w);
  tw(w, t0, S.end - t0, "scale(1 1)", "scale(0.4 1)", wave(cyc(S.end - t0, 0.6)));
  tw(g, t0, S.end - t0, `translate(${x} ${y})`, `translate(${x + 160} ${y - 60})`, "sine.inOut");
};
// low stone garden wall: front face + coping stone, stones in staggered rows, a little ivy
const wall = (S) => {
  const { x0, x1, top } = WALL;
  DS.shadow(S, (x0 + x1) / 2, GY7 - 10, x1 - x0 + 80);
  DS.shape(S, rect(x0, top + 18, x1 - x0, GY7 - 10 - top - 18), "earth", { dir: "v" });
  let d = "";
  for (let r = 0, y = top + 18; y < GY7 - 20; r++, y += 46) { if (y > top + 18) d += `M${x0} ${y} H${x1} `; for (let x = x0 + (r % 2 ? 50 : 100); x < x1; x += 100) d += `M${x} ${y} V${Math.min(y + 46, GY7 - 10)} `; }
  S.draw(d, S.start, 0, { c: DS.c("earth", 2), w: DS.w.detail });
  DS.shape(S, rrect(x0 - 24, top, x1 - x0 + 48, 30, DS.r.sm), "sand");
  [[Math.max(x0, 200) + 30, top + 30], [Math.max(x0, 200) + 70, top + 70], [Math.max(x0, 200) + 40, top + 110], [x1 - 50, top + 34], [x1 - 30, top + 80]].forEach(([x, y]) => DS.shape(S, circ(x, y, 18, 14), "green", { w: "detail" }));
};
// the whole garden; o.wall === false leaves the wall out (thumbnails)
const garden = (S, o = {}) => {
  const O = DS.outdoor(S, { hy: 650, sky: "sky", sun: [1560, 160], hills: "grass" });
  cloud7(S, 420, 170, 1); cloud7(S, 1160, 120, 0.8);
  let p = ""; for (let x = -40; x < 1980; x += 56) p += `M${x} 708 V636 L${x + 16} 620 L${x + 32} 636 V708 Z `;   // far picket fence
  S.draw(p, S.start, 0, { fill: DS.c("white", 0, "mid"), c: DS.line("mid"), w: DS.w.far });
  S.draw("M-40 652 H1980 M-40 690 H1980", S.start, 0, { c: DS.line("mid"), w: DS.w.far });
  bush(S, 1360, 770, 0.8); tree(S, 1660, 820);
  if (o.wall !== false) wall(S);
  [[160, 900, "pink"], [120, 960, "yellow"], [900, 930, "purple"], [1440, 910, "orange"], [1560, 960, "pink"], [1780, 920, "purple"]].forEach(([x, y, c]) => flower(S, x, y, c));
  return O;
};

// ---------- Humpty: a friendly round egg with a blue bow tie and red shoes ----------
// origin = the seat (bottom of the egg). Groups: pos (place) > bob > roll (tumble) > rock (wobble) > body.
// o: { k, look, mouth: "smile"|"oops"|"grin", crack: bool, band: bool, t }
const EGG = [[0, 0], [72, -14], [98, -80], [92, -164], [60, -228], [0, -254], [-60, -228], [-92, -164], [-98, -80], [-72, -14]];
const humpty = (S, x, y, o = {}) => {
  const k = o.k || 1, s0 = S.start, look = o.look || 0;
  const pos = G(S, null, `translate(${x} ${y}) scale(${k})`), bobg = G(S, pos, "translate(0 0)"), roll = G(S, bobg, "rotate(0)"), rock = G(S, roll, "rotate(0)"), body = rock;
  const H = { pos, roll, rock, k, x, y };
  [-1, 1].forEach((s) => {                                                       // legs + shoes hang over the seat
    DS.shape(S, cap(s * 34, -16, s * 42, 40, 12), "wall", { parent: body, w: "mid" });
    DS.shape(S, circ(s * 50, 48, 28, 16), "red", { parent: body, w: "mid" });
  });
  H.arms = [-1, 1].map((s) => {                                                  // little arms; rotate about the shoulder to wave
    const g = G(S, body, `rotate(0 ${s * 84} -118)`);
    DS.shape(S, cap(s * 84, -118, s * 128, -76, 13), "wall", { parent: g, w: "mid" });
    DS.shape(S, circ(s * 134, -70, 19), "wall", { parent: g, w: "mid" });
    g.sh = `${s * 84} -118`; g.s = s; return g;
  });
  DS.shape(S, smooth([...EGG, EGG[0], EGG[1]]) + " Z", "wall", { parent: body });
  S.fill(circ(-44, -196, 26, 16), s0, 0, DS.P.white[0], 0.7, body);             // shine
  [-1, 1].forEach((s) => {
    DS.shape(S, circ(s * 34, -142, 24, 29), "white", { parent: body, flat: true, w: "mid" });
    S.fill(circ(s * 34 + look, -136, 15), s0, 0, DS.P.ink[0], 1, body);
    S.fill(circ(s * 34 + look - 5, -143, 5.5), s0, 0, DS.P.white[0], 1, body);
    S.fill(circ(s * 34 + look + 5, -130, 2.5), s0, 0, DS.P.white[0], 1, body);
    S.draw(arc(s * 34, -186, 18, 220, 320), s0, 0, { c: DS.line(), w: DS.w.detail, parent: body });   // brows
    S.fill(circ(s * 66, -100, 17, 10), s0, 0, DS.c("red", 1), 0.55, body);
  });
  const smile = S.draw("M-26 -98 Q0 -70 26 -98", s0, 0, { c: DS.line(), w: DS.w.mid, parent: body });
  const oops = G(S, body); oops.setAttribute("opacity", 0);
  S.draw(circ(0, -88, 13, 15), s0, 0, { c: DS.line(), w: DS.w.mid, fill: DS.c("red", 2), parent: oops });
  const grin = G(S, body); grin.setAttribute("opacity", 0);
  S.draw("M-40 -104 Q0 -48 40 -104 Z", s0, 0, { c: DS.line(), w: DS.w.mid, fill: DS.c("red", 2), parent: grin });
  S.fill(circ(0, -72, 14, 7), s0, 0, DS.c("pink", 1), 1, grin);
  [-1, 1].forEach((s) => DS.shape(S, `M0 -46 L${s * 40} -66 L${s * 40} -26 Z`, "blue", { parent: body, w: "mid" }));   // bow tie
  DS.shape(S, circ(0, -46, 11), "blue", { parent: body, w: "detail" });
  const crack = S.draw("M22 -244 L34 -224 L22 -212 L38 -196 L30 -184", s0, 0, { c: DS.c("earth", 2), w: DS.w.mid, parent: body });
  crack.setAttribute("opacity", o.crack ? 1 : 0);
  const band = G(S, body, "rotate(-28 30 -214)"); band.setAttribute("opacity", o.band ? 1 : 0);   // the bandage covers the crack
  DS.shape(S, rrect(-14, -232, 88, 36, DS.r.sm), "sand", { parent: band, w: "detail" });
  DS.shape(S, rrect(16, -226, 28, 24, DS.r.xs), "earth", { parent: band, w: "hair", flat: true });
  [[2, -222], [2, -206], [60, -222], [60, -206]].forEach(([a, b]) => S.fill(circ(a, b, 2.5), s0, 0, DS.c("earth", 2), 1, band));
  const mouth = (m) => [[smile, m === "smile"], [oops, m === "oops"], [grin, m === "grin"]];
  mouth(o.mouth || "smile").forEach(([e, on]) => e.setAttribute("opacity", on ? 1 : 0));
  if ((o.t ?? s0) > s0 + 0.05) fadeIn(S, pos, o.t);
  H.face = (m, t) => mouth(m).forEach(([e, on]) => tl.set(e, { opacity: on ? 1 : 0 }, t));
  H.crack = (t) => tl.fromTo(crack, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t);
  H.band = (t) => popAt(band, t, 30, -214);
  H.wobble = (t0, t1, amp = 9, per = BEAT) => tw(rock, t0, t1 - t0, "rotate(0)", `rotate(${amp})`, wave(cyc(t1 - t0, per)));
  H.hop = (t0, t1, n, h = 50) => tw(bobg, t0, t1 - t0, "translate(0 0)", `translate(0 ${-h})`, hump(n));
  H.bob = (t0, t1, amp = 8) => tw(bobg, t0, t1 - t0, "translate(0 0)", `translate(0 ${-amp})`, hump(cyc(t1 - t0, 2 * BEAT)));
  H.wave = (side, t0, t1) => { const g = H.arms[side === 1 ? 1 : 0]; tw(g, t0, t1 - t0, `rotate(0 ${g.sh})`, `rotate(${-50 * g.s} ${g.sh})`, hump(cyc(t1 - t0, BEAT))); };
  H.armsUp = (t0, dur = 0.5) => H.arms.forEach((g) => tw(g, t0, dur, `rotate(0 ${g.sh})`, `rotate(${-70 * g.s} ${g.sh})`));
  // move the seat to (x1, y1) with a roll of r degrees on the way (lands upright)
  H.move = (x1, y1, t0, dur = 0.9, ease = "power2.inOut") => { tw(pos, t0, dur, `translate(${H.x} ${H.y}) scale(${k})`, `translate(${x1} ${y1}) scale(${k})`, ease); H.x = x1; H.y = y1; };
  H.tumble = (x1, y1, t0) => {          // soft tumble: tip back, a little hop forward, roll once, plop on the grass with a squash
    const mx = (H.x + x1) / 2, my = H.y - 60;
    tw(pos, t0, 0.45, `translate(${H.x} ${H.y}) scale(${k})`, `translate(${mx} ${my}) scale(${k})`, "power2.out");
    tw(pos, t0 + 0.45, 0.55, `translate(${mx} ${my}) scale(${k})`, `translate(${x1} ${y1}) scale(${k})`, "power2.in");
    tw(roll, t0, 1.0, "rotate(0)", "rotate(360)", "power1.inOut");
    tw(rock, t0 + 1.0, 0.4, "scale(1 1)", "scale(1.08 0.9)", hump(1));
    H.x = x1; H.y = y1;
  };
  return H;
};
// a little first-aid tin with a heart on the lid
const aidKit = (S, x, y, parent) => {
  const g = S.grp(parent);
  DS.shape(S, rrect(x - 70, y - 50, 140, 100, DS.r.sm), "white", { parent: g });
  DS.shape(S, rrect(x - 26, y - 70, 52, 24, DS.r.xs), "gray", { parent: g, w: "mid" });
  S.draw(heartPath(x, y - 4, 1.1), S.start, 0, { fill: DS.c("red"), c: DS.c("red", 2), w: DS.w.detail, parent: g });
  return g;
};
