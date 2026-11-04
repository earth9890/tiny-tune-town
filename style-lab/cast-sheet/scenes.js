// look: still
// @include ../../tools/cast.js
// Style-lab cast sheet (2026-11): the same three frames with TOON = 1 (published look) and TOON = 2 (upgrade). Build with TOON set on the next line.
TOON = 2;
BEAT = 60 / 116;
const up = TOON > 1;
{ const S = scene(0, 20, { cam: "none" }); const W0 = DS.outdoor(S, { hy: 600, sun: [1560, 170], sky: "sky", ground: "grass", hills: "green" });
  const O = ollie(S, 960, 935, 1.05, { mouth: "smile" }); O.raise(O.arms[0], 60, S.start, 0.01);
  const w = S.grp(); DS.shadow(S, 420, 935, 190, { parent: w }); const B = bibi(S, 420, 935 - 325 * 0.62, { k: 0.62 }); w.appendChild(B.g);
  puppy(S, 1520, 935, 1.3);
  DS.vignette(S, 0.1); if (up) grade(S, [1560, 170]); }
{ const S = scene(20, 40, { cam: "none" }); sea(S);
  ollie(S, 960, 960, 0.95, { mouth: "open" }); fish(S, 420, 360, 1.1, "yellow", 1); crab(S, 380, 980, 1.1); star(S, 1500, 980, 1.2); turtle(S, 1540, 640, 0.9);
  finish(S); if (up) grade(S, [960, -90], 0.8); }
{ const S = scene(40, 60, { cam: "none" }); const W0 = DS.outdoor(S, { hy: 600, sun: [330, 170], sky: "sky", ground: "grass", hills: "grass" });
  [[70, "pink"], [210, "yellow"], [1850, "red"], [1700, "purple"]].forEach(([x, c]) => { S.draw(`M${x} 1020 V974`, S.start, 0, { c: DS.c("green", 2, "mid"), w: DS.w.mid, parent: W0.g }); S.fill(circ(x, 962, 22), S.start, 0, DS.c(c, 0, "mid"), 1, W0.g); });
  const O = ollie(S, 960, 935, 1.15, { mouth: "grin" });
  if (up) { fgFrame(S, 1400, 900, 0.6, { flip: true, flower: "orange" }); dof(S, W0.g, S.start, 9, 0.01); }
  S.zoom(...O.face, 1.9, S.start, 0.01);
  DS.vignette(S, 0.1); if (up) grade(S, [330, 170]); }
