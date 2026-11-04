// duckling / mama duck in the soft toon look. duck(S, x, gy, k, { t, dir, mama }) -> { pos, bob, hop(t0,h), bobAll(t0,t1), move(x1,gy1,t0,dur) }
const duck = (S, x, gy, k = 1, o = {}) => {
  const s0 = S.start, dir = o.dir || 1, nm = o.mama ? "white" : "yellow", sh = DS.shadow(S, x, gy, 150 * k);
  const pos = G(S, null, `translate(${x} ${gy}) scale(${k * dir} ${k})`), bob = G(S, pos, "translate(0 0)");
  toon(S, "M-52 -70 Q-96 -80 -104 -112 Q-70 -108 -50 -92 Z", nm, { t: s0, parent: bob, w: "mid" });
  toon(S, circ(0, -52, 72, 52), nm, { t: s0, parent: bob });
  S.fill(circ(-18, -76, 34, 14), s0, 0, DS.P.white[0], 0.5, bob);
  toon(S, "M-28 -52 Q-6 -92 38 -52 Q10 -26 -28 -52 Z", nm, { t: s0, parent: bob, flat: true, tone: 1, w: "mid" });
  toon(S, circ(40, -118, 42, 40), nm, { t: s0, parent: bob });
  toon(S, "M70 -118 Q104 -122 108 -110 Q104 -98 70 -102 Z", "orange", { t: s0, parent: bob, w: "mid" });
  S.fill(circ(48, -128, 8), s0, 0, DS.P.ink[0], 1, bob); S.fill(circ(46, -131, 3), s0, 0, DS.P.white[0], 1, bob);
  S.fill(circ(30, -104, 9, 5), s0, 0, DS.c("pink", 0), 0.55, bob);
  [-18, 18].forEach((fx) => toon(S, "M" + fx + " -6 L" + (fx + 14) + " 6 L" + (fx - 10) + " 6 Z", "orange", { t: s0, parent: bob, w: "mid" }));
  if (o.mama) { toon(S, "M0 -156 Q20 -190 44 -160 Q22 -150 0 -156 Z", "pink", { t: s0, parent: bob, w: "mid" }); }
  toyFx(pos, 7); if ((o.t ?? s0) > s0 + 0.05) { fadeIn(S, pos, o.t); fadeIn(S, sh, o.t); }
  const D = { pos, bob, sh, x, gy };
  D.hop = (t0, h = 40) => tw(bob, t0, 0.5, "translate(0 0)", `translate(0 ${-h})`, hump(1));
  D.bobAll = (t0, t1, amp = 8) => tw(bob, t0, t1 - t0, "translate(0 0)", `translate(0 ${-amp})`, hump(cyc(t1 - t0, 2 * BEAT)));
  D.move = (x1, gy1, t0, dur = 1.2) => { tw(pos, t0, dur, `translate(${D.x} ${D.gy}) scale(${k * dir} ${k})`, `translate(${x1} ${gy1}) scale(${k * dir} ${k})`, "sine.inOut"); D.x = x1; D.gy = gy1; };
  return D;
};
