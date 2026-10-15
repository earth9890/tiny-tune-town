// look: still
// @include ../../../tools/cast.js
// B: same as A with no text (Test & Compare partner).
const COL = ["red", "sky", "yellow", "grass", "orange", "purple", "blue", "pink"];
// ---------- toys (drawn around their centre; a toy = one group moved by translate/rotate/scale) ----------
const TF = (p) => `translate(${K(p[0])} ${K(p[1])}) rotate(${K(p[2] || 0)}) scale(${p[3] ?? 1})`;
const star5 = (r1, r2, cx = 0, cy = 0) => "M" + Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? r2 : r1; return `${K(cx + Math.cos(a) * r)} ${K(cy + Math.sin(a) * r)}`; }).join(" L") + " Z";
let CUR;   // the toy group DRAW is filling
const sh = (S, d, c, o = {}) => DS.shape(S, d, c, Object.assign({ parent: CUR, w: "mid" }, o));
const draw = (S, kind, g, c) => { CUR = g; DRAW[kind](S, g, c); };
const DRAW = {
  block: (S, g, c) => { sh(S, rrect(-28, -28, 56, 56, DS.r.xs), c); S.fill(rrect(-15, -15, 30, 30, DS.r.xs), S.start, 0, DS.c(c, 1), 0.9, g); },
  book: (S, g, c) => { sh(S, rrect(-17, -55, 34, 110, DS.r.xs), c); S.draw("M-17 -40 H17 M-17 40 H17", S.start, 0, { c: DS.P.white[0], w: DS.w.detail, parent: g }); S.fill(rrect(-8, -22, 16, 32, DS.r.xs), S.start, 0, DS.P.white[0], 0.85, g); },
  car: (S, g, c) => {
    sh(S, rrect(-30, -32, 58, 30, DS.r.sm), c, { tone: 1 }); S.fill(rrect(-22, -27, 42, 18, DS.r.xs), S.start, 0, DS.c("glass", 2), 1, g);
    sh(S, rrect(-54, -8, 108, 30, DS.r.sm), c);
    [-30, 30].forEach((x) => { S.draw(circ(x, 24, 15), S.start, 0, { fill: DS.c("ink"), c: DS.line(), w: DS.w.detail, parent: g }); S.fill(circ(x, 24, 6), S.start, 0, DS.c("gray", 1), 1, g); });
  },
  teddy: (S, g) => {
    [[-26, -60], [26, -60]].forEach(([x, y]) => { sh(S, circ(x, y, 14), "earth"); S.fill(circ(x, y, 7), S.start, 0, DS.c("sand", 1), 1, g); });
    [[-34, 22], [34, 22], [-20, 64], [20, 64]].forEach(([x, y], i) => sh(S, circ(x, y, i < 2 ? 13 : 15, i < 2 ? 17 : 11), "earth"));
    sh(S, circ(0, 28, 34, 40), "earth"); S.fill(circ(0, 34, 19, 22), S.start, 0, DS.c("sand", 1), 1, g);
    sh(S, circ(0, -32, 36, 33), "earth"); S.fill(circ(0, -22, 15, 11), S.start, 0, DS.c("sand", 1), 1, g);
    [-13, 13].forEach((x) => S.fill(circ(x, -40, 5), S.start, 0, DS.c("ink"), 1, g));
    S.fill(circ(0, -27, 6, 4), S.start, 0, DS.c("ink"), 1, g);
    S.draw("M-7 -18 Q0 -13 7 -18", S.start, 0, { c: DS.line(), w: DS.w.detail, parent: g });
  },
  ball: (S, g) => { sh(S, circ(0, 0, 30), "red"); S.draw("M-29 -6 Q0 10 29 -6", S.start, 0, { c: DS.P.white[0], w: DS.w.near, parent: g }); S.fill(circ(-11, -14, 7, 5), S.start, 0, DS.P.white[0], 0.7, g); },
  duck: (S, g) => { sh(S, circ(-4, 10, 34, 22), "yellow"); sh(S, circ(14, -18, 19), "yellow"); sh(S, "M30 -22 L48 -15 L30 -9 Z", "orange", { w: "detail" }); S.fill(circ(18, -23, 4), S.start, 0, DS.c("ink"), 1, g); S.draw("M-22 6 Q-6 18 8 6", S.start, 0, { c: DS.c("yellow", 2), w: DS.w.detail, parent: g }); },
  drum: (S, g) => { sh(S, rrect(-30, -20, 60, 46, DS.r.xs), "red"); S.draw("M-30 -6 L-15 16 L0 -6 L15 16 L30 -6", S.start, 0, { c: DS.c("yellow"), w: DS.w.detail, parent: g }); sh(S, circ(0, -20, 30, 9), "white", { flat: true, w: "detail" }); },
  top: (S, g) => { sh(S, "M0 34 L-38 -2 Q0 -28 38 -2 Z", "purple"); S.draw("M-26 4 Q0 -12 26 4", S.start, 0, { c: DS.c("yellow"), w: DS.w.detail, parent: g }); sh(S, rrect(-6, -36, 12, 22, DS.r.xs), "gold", { w: "detail" }); },
  rings: (S, g) => {
    sh(S, rrect(-5, -42, 10, 70, DS.r.xs), "wood", { w: "detail" });
    [[14, 30, "red"], [0, 25, "orange"], [-13, 20, "yellow"], [-25, 15, "grass"]].forEach(([y, r, c]) => sh(S, circ(0, y, r, r * 0.36), c, { w: "detail" }));
    sh(S, rrect(-34, 24, 68, 12, DS.r.xs), "wood", { w: "detail" });
  },
  crayon: (S, g) => { sh(S, rrect(-44, -11, 74, 22, DS.r.xs), "blue"); sh(S, "M30 -11 L50 0 L30 11 Z", "blue", { tone: 1, w: "detail" }); S.draw("M-30 -11 V11 M18 -11 V11", S.start, 0, { c: DS.P.white[0], w: DS.w.detail, parent: g }); },
  boat: (S, g) => { sh(S, rrect(-3, -40, 6, 44, DS.r.xs), "wood", { w: "detail" }); sh(S, "M6 -36 L6 0 L36 0 Z", "white", { w: "detail" }); sh(S, "M-6 -30 L-6 0 L-28 0 Z", "yellow", { w: "detail" }); sh(S, "M-46 2 L46 2 L32 28 L-32 28 Z", "sky"); },
  star: (S, g) => { sh(S, star5(36, 17), "yellow"); [-7, 7].forEach((x) => S.fill(circ(x, -3, 3.5), S.start, 0, DS.c("ink"), 1, g)); S.draw("M-6 7 Q0 11 6 7", S.start, 0, { c: DS.line(), w: DS.w.detail, parent: g }); },
};
const SIZE = { block: 56, book: 34, car: 104, teddy: 76, ball: 60, duck: 80, drum: 60, top: 76, rings: 68, crayon: 96, boat: 92, star: 72 };
const HALF = { block: 28, book: 55, car: 39, teddy: 75, ball: 30, duck: 33, drum: 29, top: 34, rings: 36, crayon: 11, boat: 28, star: 33 };
// ---------- the playroom ----------
const PLAY = { wall: "sky", floor: "floor", window: [440, 170, 220, 230] };
const bunting = (S) => {
  const y = (x) => 112 + 64 * (1 - ((x - 960) / 600) ** 2);
  S.draw(smooth(Array.from({ length: 13 }, (_, i) => [360 + i * 100, y(360 + i * 100)])), S.start, 0, { c: DS.c("wood", 2, "mid"), w: DS.w.detail });
  for (let i = 0; i < 12; i++) { const x = 410 + i * 100, yy = y(x); DS.shape(S, `M${K(x - 26)} ${K(yy)} L${K(x + 26)} ${K(yy)} L${K(x)} ${K(yy + 50)} Z`, COL[i % 8], { layer: "mid", w: "detail" }); }
};
const S = scene(0, 1, { cam: "none" }); DS.room(S, PLAY); bunting(S);
// the toy box, big, left of centre, overflowing (clear of the badge corner)
DS.shadow(S, 520, 762, 560);
DS.shape(S, "M240 550 L300 500 L780 500 L720 550 Z", "brown", { flat: true });
const put = (kind, c, x, y, r, k) => draw(S, kind, G(S, null, TF([x, y, r, k])), c);
put("teddy", "earth", 420, 460, -8, 1.25); put("block", "blue", 300, 516, -8, 1.3); put("ball", "red", 560, 506, 0, 1.3);
put("block", "yellow", 650, 518, 10, 1.3); put("duck", "yellow", 520, 460, 6, 1.3); put("book", "purple", 690, 460, 14, 1.2);
DS.shape(S, "M720 550 L780 500 L780 710 L720 760 Z", "red", { tone: 2, flat: true });
DS.shape(S, rect(240, 550, 480, 210), "red");
DS.shape(S, star5(62, 28, 480, 652), "yellow");
const O = ollie(S, 1240, 1250, 2.0, { mouth: "grin", look: -6 });
const held = [["car", "red"], ["block", "red"], ["star", "yellow"], ["boat", "sky"]];
[[0, 1], [1, 1], [0, -1], [1, -1]].forEach(([ai, side], i) => {
  const A = O.arms.find((a) => a.ai === ai && a.side === side);
  O.raise(A, [112, 90][ai], 0, 0.01);
  const [x, y] = O.tipNow(A, 55); draw(S, held[i][0], G(S, O.body, TF([x, y, 0, 0.85])), held[i][1]);
});
[[-200, -560, 1.1], [210, -580, 0.9], [-280, -300, 0.7]].forEach(([x, y, r]) => sparkle(S, ...O.at([x, y]), 0, r));
DS.vignette(S, 0.1);
