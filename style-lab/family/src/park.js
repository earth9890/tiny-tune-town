// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// Test frame: park medium close-up. Hero A says "oh!" at a butterfly (face ~46 % of the frame height, right 40 %), big brother
// waves behind, Mum watches from the path, the cat sits close by. Background blurred, a soft foreground plant on the right.
TOON = 2;
const S = scene(0, 1, { cam: "none" });
const W0 = DS.outdoor(S, { hy: 620, sun: [1600, 150], sky: "sky", ground: "grass", hills: "green", path: [60, 900] });
[[200, 560, 1], [760, 520, 0.8], [1720, 560, 1.1]].forEach(([x, y, k]) => { S.fill(rrect(x - 18 * k, y - 40 * k, 36 * k, 130 * k, DS.r.sm), 0, 0, DS.c("wood", 0, "mid"), 1, W0.g);
  [[0, -110, 120], [-80, -60, 90], [80, -60, 90]].forEach(([dx, dy, r]) => S.fill(circ(x + dx * k, y + dy * k, r * k), 0, 0, DS.c("green", 0, "mid"), 1, W0.g)); });
[[90, "pink"], [420, "yellow"], [1120, "red"], [1540, "purple"]].forEach(([x, c]) => S.fill(circ(x, 760, 20), 0, 0, DS.c(c, 0, "mid"), 1, W0.g));
dof(S, W0.g, 0, 5, 0.01);
const M = mum(S, 250, 800, 0.55);
const B = sibling(S, 640, 960, 0.95, { mood: "giggle" }); B.arm(1, 125, 0, 0.01);
kitty(S, 900, 1030, 0.85);
const T = toddler(S, 1290, 1150, 1.7, { v: "A", mood: "oh" }); T.arm(-1, 116, 0, 0.01); T.arm(1, 30, 0, 0.01);
const bf = G(S, null, "translate(900 250) rotate(-12)");
[-1, 1].forEach((s) => { toon(S, circ(s * 34, -16, 34, 28), "purple", { parent: bf, lw: DS.w.mid * 2 }); toon(S, circ(s * 26, 22, 22, 18), "pink", { parent: bf, lw: DS.w.mid * 2 }); });
toon(S, circ(0, 0, 8, 34), "famHr", { parent: bf, lw: DS.w.mid * 1.6 }); toyFx(bf, 5);
fgFrame(S, 1860, 1160, 0.62, { flip: true, flower: "orange" });
DS.vignette(S, 0.1); grade(S, [1600, 150]);
