// look: still
// @include ../../../tools/cast.js
// B: the same bubble bath with no text; Bibi peeks over the tub on the left. Badge bottom-left.
const suds = (S, x0, x1, y, n, parent) => { for (let i = 0; i < n; i++) { const x = x0 + ((x1 - x0) * (i + 0.5)) / n, r = 44 + ((i * 37) % 30); S.draw(circ(x, y - ((i * 53) % 34), r, r * 0.8), S.start, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.mid, parent }); } };
const duck = (S, x, y, k) => {
  const g = G(S, null, `translate(${x} ${y}) scale(${k})`);
  DS.shape(S, circ(-4, 10, 34, 22), "yellow", { parent: g, w: "detail" }); DS.shape(S, circ(14, -18, 19), "yellow", { parent: g, w: "detail" });
  DS.shape(S, "M30 -22 L48 -15 L30 -9 Z", "orange", { parent: g, w: "detail" }); S.fill(circ(18, -23, 4), S.start, 0, DS.c("ink"), 1, g);
  S.fill(circ(16, -25, 1.4), S.start, 0, DS.P.white[0], 1, g);
  S.draw("M-22 6 Q-6 18 8 6", S.start, 0, { c: DS.c("yellow", 2), w: DS.w.hair, parent: g });
};
const S = scene(0, 1, { cam: "none" });
DS.room(S, { wall: "sky", floor: "sand", window: false }); bathWall(S, { towel: false });
S.draw(circ(1200, 915, 760, 50), S.start, 0, { fill: DS.c("glass", 2), c: DS.line(), w: DS.w.detail });
bibi(S, 330, 690, { k: 1.05, mood: "joy", paws: [null, null] });
const O = ollie(S, 1330, 1090, 1.6, { mouth: "grin", look: -8 });
[[0, 1], [0, -1]].forEach(([ai, side]) => { const A = O.arms.find((a) => a.ai === ai && a.side === side); const [x, y] = O.holdAt(A, -300); foam(S, x, y, 4, 0, O.body); });
foam(S, 0, -500, 7, 0, O.body); foam(S, -60, -480, 4, 0, O.body); foam(S, 70, -485, 4, 0, O.body);   // bubble hat
suds(S, 0, 1960, 935, 18);
DS.shape(S, rrect(-60, 925, 2100, 60, DS.r.lg), "white", { w: "mid" });
DS.shape(S, "M-40 975 H2010 V1100 H-40 Z", "white");
duck(S, 700, 640, 3.4);
[[880, 360, 44], [560, 300, 30], [960, 700, 34]].forEach(([x, y, r]) => { S.draw(circ(x, y, r), S.start, 0, { c: DS.P.white[0], w: DS.w.mid, fill: DS.c("glass", 1), op: 0.85 }); S.fill(circ(x - r * 0.35, y - r * 0.35, r * 0.25), S.start, 0, DS.P.white[0], 0.95); });
DS.vignette(S, 0.1);
