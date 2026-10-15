// 09 art, shared by scenes.js and the thumbnails (@include): the grandfather clock and the four friends.
const CX = 470, CGY = 880, DY = 375, PIV = [CX, DY - 40];     // clock centre x, floor, dial centre y, hands pivot

// ---------- the grandfather clock (big, friendly, smiling) ----------
const grandClock = (S, o = {}) => {
  DS.shadow(S, CX, CGY, 400, { parent: o.parent });
  const g = S.grp(o.parent), sway = G(S, g, `rotate(0 ${CX} ${CGY})`), sh = (d, c, op = {}) => DS.shape(S, d, c, Object.assign({ parent: sway }, op));
  sh(rrect(CX - 110, 480, 220, 360, DS.r.xs), "wood", { dir: "v" });                                       // trunk
  sh(rrect(CX - 80, 515, 160, 290, DS.r.lg), "glass", { dir: "v", w: "mid" });                               // pendulum window
  const pend = G(S, sway, `rotate(0 ${CX} 520)`);
  DS.shape(S, rrect(CX - 5, 520, 10, 225, DS.r.xs), "gold", { parent: pend, w: "detail" });
  DS.shape(S, circ(CX, 760, 32), "gold", { parent: pend, w: "mid" });
  S.fill(circ(CX - 10, 750, 9), S.start, 0, DS.P.white[0], 0.7, pend);
  sh(rrect(CX - 150, CGY - 62, 300, 62, DS.r.xs), "wood", { dir: "v" });                                    // plinth
  sh(`M${CX + 46} ${CGY} V${CGY - 26} Q${CX + 70} ${CGY - 52} ${CX + 94} ${CGY - 26} V${CGY} Z`, "brown", { flat: true, w: "detail" }); // the mouse's little door
  sh(`M${CX - 160} 270 Q${CX} 150 ${CX + 160} 270 Z`, "wood");                                              // crown
  sh(rrect(CX - 150, 250, 300, 250, DS.r.sm), "wood", { dir: "v" });                                         // hood
  [-1, 1].forEach((s) => sh(circ(CX + s * 160, 262, 16), "gold", { w: "detail" }));
  sh(circ(CX, DY, 112), "gold");                                                                             // dial
  sh(circ(CX, DY, 96), "paper", { flat: true, w: "detail" });
  for (let h = 0; h < 12; h++) { const a = (h * Math.PI) / 6; S.fill(circ(CX + Math.sin(a) * 84, DY - Math.cos(a) * 84, h % 3 ? 4 : 7), S.start, 0, DS.c("brown"), 1, sway); }
  [-1, 1].forEach((s) => {                                                                                     // the clock's face
    DS.shape(S, circ(CX + s * 40, DY + 14, 19, 23), "white", { parent: sway, flat: true, w: "detail" });
    S.fill(circ(CX + s * 66, DY + 46, 13, 8), S.start, 0, DS.c("red", 1), 0.55, sway);
  });
  const pup = G(S, sway, "translate(0 0)");
  [-1, 1].forEach((s) => { S.fill(circ(CX + s * 40, DY + 18, 11), S.start, 0, DS.P.ink[0], 1, pup); S.fill(circ(CX + s * 40 - 4, DY + 13, 4), S.start, 0, DS.P.white[0], 1, pup); });
  const smile = S.draw(`M${CX - 30} ${DY + 50} Q${CX} ${DY + 78} ${CX + 30} ${DY + 50}`, S.start, 0, { c: DS.line(), w: DS.w.mid, parent: sway });
  const grin = G(S, sway); grin.setAttribute("opacity", 0);
  S.draw(`M${CX - 34} ${DY + 46} Q${CX} ${DY + 96} ${CX + 34} ${DY + 46} Z`, S.start, 0, { c: DS.line(), w: DS.w.mid, fill: DS.c("red", 2), parent: grin });
  DS.shape(S, rrect(CX - 4, PIV[1] - 48, 8, 52, DS.r.xs), "ink", { parent: sway, flat: true, w: "hair" });  // minute hand at 12
  const hr = G(S, sway, `rotate(${(o.hour || 0) * 30} ${PIV[0]} ${PIV[1]})`);
  DS.shape(S, cap(PIV[0], PIV[1], PIV[0], PIV[1] - 34, 5), "ink", { parent: hr, flat: true, w: "hair" });
  DS.shape(S, circ(...PIV, 8), "gold", { parent: sway, w: "detail" });
  const C = { g, sway, pend, hr, hour: o.hour || 0 };
  tw(pend, S.start, S.len, `rotate(0 ${CX} 520)`, `rotate(8 ${CX} 520)`, wave(cyc(S.len, 2 * BEAT)));          // tick tock
  tw(pup, S.start, S.len, "translate(0 0)", "translate(5 0)", wave(cyc(S.len, 2 * BEAT)));                   // eyes follow the pendulum
  C.strike = (n, t) => {                                                                                       // hour hand to n, n gentle bongs
    tw(hr, t, 0.6, `rotate(${C.hour * 30} ${PIV[0]} ${PIV[1]})`, `rotate(${n * 30} ${PIV[0]} ${PIV[1]})`); C.hour = n;
    for (let i = 0; i < n; i++) { const p = S.draw(rays(CX, DY, 124, 158, 12), t + i * 2 * BEAT, 0, { c: DS.c("gold", 2), w: DS.w.mid }); S.fadeOut(p, t + i * 2 * BEAT + 0.45, 0.3); }
  };
  C.grin = (t) => { tl.set(grin, { opacity: 1 }, t); tl.set(smile, { opacity: 0 }, t); };
  C.dance = (t0, t1) => tw(sway, t0, t1 - t0, `rotate(0 ${CX} ${CGY})`, `rotate(2.5 ${CX} ${CGY})`, wave(cyc(t1 - t0, 4 * BEAT)));
  return C;
};

// ---------- friends: feet at the origin, facing right, about 130 px tall at k 1. g (place) > h (hop) > b (bob) ----------
const buddy = (S, kind, parent) => {
  const g = G(S, parent), h = G(S, g, "translate(0 0)"), b = G(S, h, "translate(0 0)"), F = { g, h, b, kind };
  const sh = (d, c, o = {}) => DS.shape(S, d, c, Object.assign({ parent: b, w: "mid" }, o));
  const eye = (x, y, r = 8) => { DS.shape(S, circ(x, y, r * 1.5, r * 1.7), "white", { parent: b, flat: true, w: "detail" }); S.fill(circ(x + 2, y + 2, r), S.start, 0, DS.P.ink[0], 1, b); S.fill(circ(x - 1, y - 2, r * 0.4), S.start, 0, DS.P.white[0], 1, b); };
  const blush = (x, y) => S.fill(circ(x, y, 10, 6), S.start, 0, DS.c("red", 1), 0.55, b);
  const line = (d, w = DS.w.mid, c = DS.line()) => S.draw(d, S.start, 0, { c, w, parent: b });
  if (kind === "mouse") {
    line(smooth([[-44, -26], [-82, -30], [-100, -62], [-80, -84]]), DS.w.mid, DS.c("pink", 2));
    sh(circ(-24, -4, 15, 7), "pink", { w: "detail" }); sh(circ(16, -4, 15, 7), "pink", { w: "detail" });
    sh(circ(-6, -40, 50, 40), "gray");
    [[12, -112, 25], [56, -106, 22]].forEach(([x, y, r]) => { sh(circ(x, y, r), "gray"); S.fill(circ(x, y, r * 0.55), S.start, 0, DS.c("pink", 1), 1, b); });
    sh(circ(36, -76, 38, 33), "gray"); eye(48, -84); blush(30, -60);
    sh(circ(76, -70, 8), "pink", { w: "detail" });
    line("M54 -58 Q62 -51 70 -58", DS.w.detail); line("M74 -62 L98 -56 M74 -66 L96 -72", DS.w.hair);
  } else if (kind === "bird") {
    sh("M-40 -54 L-86 -76 L-80 -38 Z", "blue");
    line("M-8 -12 V4 M12 -12 V4", DS.w.detail, DS.c("orange", 2));
    sh(circ(0, -54, 50, 46), "sky"); S.fill(circ(12, -40, 30, 22), S.start, 0, DS.P.white[0], 0.75, b);
    sh("M2 -96 Q8 -122 22 -100 Z", "blue", { w: "detail" });
    F.wing = G(S, b, "rotate(0 -10 -56)"); DS.shape(S, "M-36 -58 Q-8 -88 22 -54 Q-4 -34 -36 -58 Z", "blue", { parent: F.wing, w: "mid" });
    eye(22, -68); blush(30, -48);
    sh("M44 -64 L68 -56 L44 -46 Z", "orange", { w: "detail" });
  } else if (kind === "frog") {
    sh(circ(-40, -14, 28, 16), "grass"); sh(circ(40, -14, 28, 16), "grass");
    sh(circ(0, -42, 58, 42), "grass"); S.fill(circ(0, -30, 34, 22), S.start, 0, DS.c("yellow", 1), 0.6, b);
    sh(circ(-28, -84, 23), "grass"); sh(circ(28, -84, 23), "grass"); eye(-28, -86); eye(28, -86);
    line("M-30 -50 Q0 -28 30 -50"); blush(-42, -50); blush(42, -50);
    sh(circ(-22, -4, 15, 8), "green", { w: "detail" }); sh(circ(22, -4, 15, 8), "green", { w: "detail" });
  } else {                                                                                                     // duck
    sh(circ(-14, -2, 17, 7), "orange", { w: "detail" }); sh(circ(16, -2, 17, 7), "orange", { w: "detail" });
    sh("M-50 -52 L-76 -70 L-62 -38 Z", "yellow");
    sh(circ(-6, -40, 54, 38), "yellow");
    F.wing = G(S, b, "rotate(0 -20 -46)"); DS.shape(S, "M-40 -46 Q-12 -70 16 -42 Q-12 -26 -40 -46 Z", "gold", { parent: F.wing, w: "mid" });
    sh(circ(32, -92, 33), "yellow"); eye(42, -100); blush(36, -78);
    sh("M58 -92 Q86 -92 86 -84 Q86 -74 58 -76 Z", "orange", { w: "detail" });
  }
  return F;
};
