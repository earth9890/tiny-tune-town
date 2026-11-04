// Papa = a bigger Ollie-style octopus with round glasses and a blue bow tie: papaGear(S, O) draws them on the octopus body group (call right after ollie()).
const papaGear = (S, O) => {
  const s0 = S.start, b = O.body;
  [-1, 1].forEach((s) => S.draw(circ(58 * s, -330, 54, 58), s0, 0, { c: DS.P.ink[0], w: DS.w.mid * 1.6, parent: b }));
  S.draw("M-6 -334 Q0 -346 6 -334", s0, 0, { c: DS.P.ink[0], w: DS.w.mid * 1.6, parent: b });
  [-1, 1].forEach((s) => toon(S, `M0 -184 L${s * 62} -210 Q${s * 78} -184 ${s * 62} -158 Z`, "blue", { parent: b, lw: DS.w.mid * 2.2 }));
  toon(S, circ(0, -184, 15), "blue", { parent: b, lw: DS.w.mid * 2.2 });
};
