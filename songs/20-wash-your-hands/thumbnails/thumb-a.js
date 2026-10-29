// CRITIQUE r1 (focal/emotion/curiosity/contrast/text/composition/polish/honesty/brand) 4/4/4/4/5/4/4/5/5; r2: face kept clear of foam, pump clear of the badge zone, text top-left only -> final.
// look: still
// @include ../../../tools/cast.js
// A (claim + face): Ollie's huge grin on the right, all eight arm tips up in big foam mitts (the gag), a giant soap pump on the left, "WASH!" top-left. Badge bottom-left.
const S = scene(0, 1, { cam: "none" }); DS.room(S, BATH_ROOM);
tiles(S, -200, -200, 2120, 700, 120);
const O = ollie(S, 1240, 1250, 2.0, { mouth: "grin", look: -4 });
O.arms.forEach((A) => {
  if (A.ai === 3) { const [x, y] = O.holdAt(A, -250); foam(S, x, y, 5, 0, O.body); return; }
  O.raise(A, [125, 98, 72][A.ai], 0, 0.01);
  const [x, y] = O.tipNow(A, 40); foam(S, x, y, 5, 0, O.body);
});
[[-190, -520, 1.1], [200, -540, 0.9], [-260, -430, 0.7], [250, -420, 0.8]].forEach(([x, y, r]) => sparkle(S, ...O.at([x, y]), 0, r));
// giant soap pump
const P = S.grp();
DS.shape(S, rrect(360, 520, 260, 340, DS.r.lg), "sky", { parent: P, w: "mid" });
DS.shape(S, rrect(445, 450, 90, 80, DS.r.xs), "gray", { parent: P, w: "detail" });
DS.shape(S, rrect(445, 420, 230, 44, DS.r.sm), "gray", { parent: P, w: "detail" });
DS.shape(S, rrect(395, 580, 190, 140, DS.r.md), "white", { parent: P, w: "detail" });
S.draw(circ(490, 650, 44, 36), S.start, 0, { fill: DS.c("sky", 1), c: DS.c("sky", 2), w: DS.w.detail, parent: P });
[[690, 520, 54], [760, 640, 36], [250, 600, 40], [610, 360, 30], [330, 400, 24]].forEach(([x, y, r]) => { S.draw(circ(x, y, r), 0, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.mid }); S.fill(circ(x - r * 0.35, y - r * 0.35, r * 0.22), 0, 0, DS.c("sky", 1), 0.9); });
S.text("WASH!", 440, 250, { size: 220, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
