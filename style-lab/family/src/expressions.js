// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// Hero A face library (happy, oh, giggle, sleepy, sing) with matching arm poses (wave, arms out, clap, rest, arms up).
TOON = 2;
const S = scene(0, 1, { cam: "none" });
S.fill("M-200 -200 H2120 V1280 H-200 Z", 0, 0, DS.vgrad(DS.P.sky[1], DS.P.paper[0]), 1);
S.fill(circ(960, 1010, 1100, 170), 0, 0, DS.c("grass", 1), 0.55);
[["happy", 200, [[1, 120]]], ["oh", 580, [[-1, 60], [1, 60]]], ["giggle", 960, "clap"], ["sleepy", 1340, []], ["sing", 1720, [[-1, 120], [1, 120]]]].forEach(([m, x, pose]) => {
  const F = toddler(S, x, 900, 1.12, { v: "A", mood: m });
  if (pose === "clap") [-1, 1].forEach((s) => F.arm(s, -Math.asin((86 - 30 * 0.85) / 128) * 180 / Math.PI, 0, 0.01)); else pose.forEach(([s, d]) => F.arm(s, d, 0, 0.01));
  DS.card(S, m, x, 1010, { size: DS.type.small });
});
DS.vignette(S, 0.08);
