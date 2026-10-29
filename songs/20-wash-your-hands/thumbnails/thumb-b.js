// look: still
// @include ../../../tools/cast.js
// B (friend, no text): Ollie's surprised "oh!" face right, mitts of foam on four arms; Bibi peeks in on the left holding her paws out for a turn at the sink. Badge bottom-left.
const S = scene(0, 1, { cam: "none" }); DS.room(S, BATH_ROOM);
tiles(S, -200, -200, 2120, 700, 120);
bibi(S, 420, 520, { k: 1.25, mood: "joy", paws: [[300, 760], [540, 760]] });
const O = ollie(S, 1300, 1250, 2.0, { mouth: "open", look: -10 });
O.arms.forEach((A) => {
  if (A.ai === 3) { const [x, y] = O.holdAt(A, -260); foam(S, x, y, 5, 0, O.body); return; }
  if (A.ai === 2) { O.raise(A, 110, 0, 0.01); const [x, y] = O.tipNow(A, 40); foam(S, x, y, 5, 0, O.body); }
});
[[-200, -520, 1.1], [220, -540, 0.9]].forEach(([x, y, r]) => sparkle(S, ...O.at([x, y]), 0, r));
[[760, 330, 50], [860, 470, 34], [700, 600, 28], [1010, 250, 26]].forEach(([x, y, r]) => { S.draw(circ(x, y, r), 0, 0, { fill: DS.P.white[0], c: DS.c("sky", 2), w: DS.w.mid }); S.fill(circ(x - r * 0.35, y - r * 0.35, r * 0.22), 0, 0, DS.c("sky", 1), 0.9); });
DS.vignette(S, 0.1);
