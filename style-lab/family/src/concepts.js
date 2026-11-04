// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// Hero concepts A / B / C, same pose and mood, with a thumbnail-size copy under each (silhouette test).
TOON = 2;
const S = scene(0, 1, { cam: "none" });
S.fill("M-200 -200 H2120 V1280 H-200 Z", 0, 0, DS.vgrad(DS.P.sky[1], DS.P.paper[0]), 1);
S.fill(circ(960, 1010, 1100, 170), 0, 0, DS.c("grass", 1), 0.55);
[["A", "Puffs", 340], ["B", "Bobble hat", 960], ["C", "Sprout", 1580]].forEach(([v, name, x]) => {
  S.fill(circ(x, 470, 330, 380), 0, 0, DS.glow(DS.P.yellow[1], 0.6), 1);
  const F = toddler(S, x, 850, 1.18, { v }); F.arm(1, 120, 0, 0.01);
  const f = toddler(S, x + 250, 1010, 0.2, { v });
  DS.card(S, v, x - 230, 140, { size: DS.type.display, fill: "yellow" });
  S.text(name, x, 1000, { size: DS.type.body, c: DS.P.ink[0] });
});
DS.vignette(S, 0.08);
