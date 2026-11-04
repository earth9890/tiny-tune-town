// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// Motion lab: wave, clap, groove, walk, expressions, sing and blinks on the family (no audio needed).
TOON = 2;
BEAT = 60 / 110;
{ const S = scene(0, 12, { cam: "none" }); DS.outdoor(S, { hy: 620, sun: [1600, 150], sky: "sky", ground: "grass", hills: "green" });
  const T = toddler(S, 420, 930, 0.95), B = sibling(S, 900, 930, 0.7), M = mum(S, 1300, 930, 0.6), D = dad(S, 1650, 930, 0.6), C = kitty(S, 1100, 960, 0.6);
  T.wave(0.5, 4.5); T.expr("oh", 5); T.clap(5.5, 8.5); T.expr("giggle", 6); T.sing(9, 10); T.expr("sleepy", 10.5);
  B.groove(0.5, 11, 12, 4); M.clap(1, 5); M.wave(6, 10, -1); D.walk(1450, 2, 6); D.walk(1650, 7, 11); C.wag(0.5, 11);
  DS.vignette(S, 0.1); grade(S, [1600, 150]); }
{ const S = scene(12, 167.5, { cam: "none" }); DS.outdoor(S, { hy: 620, sky: "sky" }); toddler(S, 960, 930, 1); }
