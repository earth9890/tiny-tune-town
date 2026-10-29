// generated from tools/cast.js ollie(): the same octopus in another colour (Daddy blue, Mummy purple, Baby yellow). octo("blue")(S, x, gy, k, opts)
const octo = (name) => (S, cx, gy, k = 1, o = {}) => {
  const t = o.t ?? S.start, s0 = S.start, look = o.look || 0;
  const sh = DS.shadow(S, cx, gy, 600 * k);
  const pos = G(S, null, `translate(${cx} ${gy}) scale(${k})`), lift = G(S, pos, "translate(0 0)"), bob = G(S, lift, "translate(0 0)"), size = G(S, bob, "scale(1)"), body = G(S, size, "rotate(0 0 -250)");
  const arms = {};
  [0, 1, 2, 3].forEach((ai) => [-1, 1].forEach((side) => {
    const [rx, P] = ARMS[ai], x = rx * side, y = -200;
    const pose = G(S, body, `rotate(0 ${x} ${y})`), wig = G(S, pose, `rotate(0 ${x} ${y})`);
    const { d, C } = tube(P.map(([px, py]) => [x + px * side, y + py]), 34, 11);
    DS.shape(S, d, name, { t: s0, parent: wig });
    C.forEach((p, i) => { if (i > 5 && i < C.length - 3 && i % 3 === 0) S.fill(circ(p[0], p[1], 6 + 5 * (1 - i / C.length)), s0, 0, DS.c(name, 1), 0.95, wig); });
    arms[ai + "," + side] = { pose, wig, x, y, side, ai, tip: C[C.length - 1], cur: 0 };
  }));
  DS.shape(S, circ(0, -335, 150, 165), name, { t: s0, parent: body });
  S.fill(circ(-66, -428, 36, 20), s0, 0, DS.P.white[0], 0.5, body);
  [[78, -440, 15], [108, -392, 10], [-112, -372, 9]].forEach(([x, y, r]) => S.fill(circ(x, y, r), s0, 0, DS.c(name, 2), 0.45, body));
  [-1, 1].forEach((s) => {
    DS.shape(S, circ(58 * s, -330, 40, 48), "white", { t: s0, parent: body, flat: true, w: "mid" });
    S.fill(circ(58 * s + look, -318, 25), s0, 0, DS.P.ink[0], 1, body);
    S.fill(circ(58 * s + look - 9, -329, 9), s0, 0, DS.P.white[0], 1, body);
    S.fill(circ(58 * s + look + 8, -309, 4), s0, 0, DS.P.white[0], 1, body);
    S.fill(circ(104 * s, -258, 26, 15), s0, 0, DS.c("red", 1), 0.55, body);
  });
  const smile = S.draw("M-34 -262 Q0 -226 34 -262", s0, 0, { c: DS.line(), w: DS.w.near, parent: body });
  const open = G(S, body); open.setAttribute("opacity", 0);
  S.draw("M-36 -266 Q0 -196 36 -266 Z", s0, 0, { c: DS.line(), w: DS.w.near, fill: DS.c("red", 2), parent: open });
  S.fill(circ(0, -228, 15, 8), s0, 0, DS.c(name, 1), 1, open);
  const grin = G(S, body); grin.setAttribute("opacity", 0); // big toothy smile (teeth songs, finales)
  S.draw("M-82 -282 Q0 -150 82 -282 Z", s0, 0, { c: DS.line(), w: DS.w.near, fill: DS.c("red", 2), parent: grin });
  S.fill(circ(0, -214, 26, 12), s0, 0, DS.c(name, 1), 1, grin);
  S.draw("M-74 -279 Q0 -236 74 -279 L68 -262 Q0 -218 -68 -262 Z", s0, 0, { c: DS.c("gray", 1), w: DS.w.hair, fill: DS.P.white[0], parent: grin });
  [-48, -24, 0, 24, 48].forEach((x) => S.draw(`M${x} ${-268 + Math.abs(x) * 0.1} V${-238 + Math.abs(x) * 0.33}`, s0, 0, { c: DS.c("gray", 1), w: DS.w.hair, parent: grin }));
  if (o.mouth === "open") { open.setAttribute("opacity", 1); smile.setAttribute("opacity", 0); }
  if (o.mouth === "grin") { grin.setAttribute("opacity", 1); smile.setAttribute("opacity", 0); }
  if (t > s0 + 0.05) { fadeIn(S, pos, t); fadeIn(S, sh, t); }
  const all = COUNT.map(([ai, s]) => arms[ai + "," + s]);
  const O = { pos, lift, bob, size, body, arms: all, k, cx, gy, liftY: 0, sz: 1,
    row: [0, 1, 2, 3].map((ai) => arms[ai + ",1"]).concat([3, 2, 1, 0].map((ai) => arms[ai + ",-1"])), // left → right (side 1 = left)
    at: ([x, y]) => [cx + x * k, gy + y * k] };
  // wiggle arms (1-based counting order) between t0 and t1, neighbours in counter-phase
  O.wiggle = (list, t0, t1, amp = 13, per = BEAT) => list.forEach((n, i) => { const A = all[n - 1]; tw(A.wig, t0, t1 - t0, `rotate(0 ${A.x} ${A.y})`, `rotate(${(i % 2 ? amp : -amp) * A.side} ${A.x} ${A.y})`, wave(cyc(t1 - t0, per))); });
  O.raise = (A, a, t0, dur = 0.6) => { tw(A.pose, t0, dur, `rotate(${A.cur} ${A.x} ${A.y})`, `rotate(${a * A.side} ${A.x} ${A.y})`); A.cur = a * A.side; };
  O.bob = (t0, t1, amp = 10) => tw(bob, t0, t1 - t0, "translate(0 0)", `translate(0 ${-amp})`, hump(cyc(t1 - t0, 2 * BEAT)));
  O.lift = (dy, t0, dur = 0.8) => { tw(lift, t0, dur, `translate(0 ${O.liftY})`, `translate(0 ${dy})`); O.liftY = dy; };
  O.hop = (t0, h = 60, dur = 0.5) => tw(lift, t0, dur, `translate(0 ${O.liftY})`, `translate(0 ${O.liftY - h})`, hump(1));
  O.spin = (t0, dur = 1.3, turns = 1) => tw(body, t0, dur, "rotate(0 0 -250)", `rotate(${360 * turns} 0 -250)`, "power1.inOut");
  O.scale = (z, t0, dur = 0.5) => { tw(size, t0, dur, `scale(${O.sz})`, `scale(${z})`, "back.out(1.4)"); O.sz = z; };
  O.grin = (t0, t1 = 1e9) => { tl.set(grin, { opacity: 1 }, t0); tl.set(smile, { opacity: 0 }, t0); if (t1 < 1e9) { tl.set(grin, { opacity: 0 }, t1); tl.set(smile, { opacity: 1 }, t1); } };
  O.face = [cx, gy - 330 * k]; // centre of the face, for camera close-ups: S.zoom(...O.face, 2.4, t)
  // aim arm A so its tip lands at height ty (body units, e.g. -262 = mouth) beside the face; returns the tip [x, y] in body units.
  // The tip sweeps a circle around the arm's root, so it lands outside the face. Pass t0 to swing it there over dur.
  O.holdAt = (A, ty, t0 = s0, dur = 0.01) => {
    const tx0 = A.tip[0] - A.x, ty0 = A.tip[1] - A.y, L = Math.hypot(tx0, ty0), dy = ty - A.y;
    const dx = Math.sqrt(Math.max(0, L * L - dy * dy)) * (A.side === 1 ? -1 : 1);
    let r = (Math.atan2(dy, dx) - Math.atan2(ty0, tx0)) * 180 / Math.PI; r = ((r + 540) % 360) - 180;
    O.raise(A, r * A.side, t0, dur); return [A.x + dx, ty];
  };
  // where arm A's tip is now (after raise/holdAt), in body units; o = how far past the tip to extend (for props held up in the air)
  O.tipNow = (A, ext = 0) => { const r = A.cur * Math.PI / 180, dx = A.tip[0] - A.x, dy = A.tip[1] - A.y, m = Math.hypot(dx, dy), f = (m + ext) / m;
    return [A.x + (dx * Math.cos(r) - dy * Math.sin(r)) * f, A.y + (dx * Math.sin(r) + dy * Math.cos(r)) * f]; };
  O.sing = (t0, t1) => { tl.set(open, { opacity: 1 }, t0); tl.set(smile, { opacity: 0 }, t0); tl.set(open, { opacity: 0 }, t1); tl.set(smile, { opacity: 1 }, t1); };
  return O;
};
