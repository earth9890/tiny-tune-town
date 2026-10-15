// look: still
// @include ../../../tools/cast.js
// @include ../spider.js
// B: same as A with no text (Test & Compare partner).
BEAT = 60 / 96;
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 760, sky: "sky", sun: false, hills: "grass" });
rainbow(S, 0);
sunFace(S, 1720, 150, 80, 0);
DS.shape(S, rrect(788, -40, 64, 1200, DS.r.xs), "gray", { dir: "h" });                      // the spout, big
[230, 760].forEach((y) => DS.shape(S, rrect(774, y, 92, 24, DS.r.xs), "gray", { w: "mid", tone: 2 }));
S.fill(rect(800, -40, 10, 1200), S.start, 0, DS.P.white[0], 0.45);
const I = itsy(S, 820, 490, 2.3, { look: 6 });
[[600, 330, 0.8], [1060, 380, 0.7], [640, 720, 0.6]].forEach(([x, y, r]) => sparkle(S, x, y, 0, r));
const O = ollie(S, 1440, 1120, 1.7, { mouth: "open", look: -10 });
[arm(O, 0, 1), arm(O, 0, -1)].forEach((A) => O.raise(A, 95, 0, 0.01));
DS.vignette(S, 0.1);
