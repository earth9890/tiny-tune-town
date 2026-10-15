// look: still
// @include ../../../tools/cast.js
// @include ../bedroom.js
// B: same as A with no text (Test & Compare partner).
const S = scene(0, 1, { cam: "none" });
S.fill(rect(-200, -200, 2320, 1480), 0, 0, DS.vgrad(DS.P.navy[1], DS.P.night[1]), 1);
[[140, 420, 7], [300, 640, 5], [900, 130, 6], [1020, 420, 5], [1760, 130, 7], [1840, 420, 5], [820, 760, 6], [200, 120, 5], [1100, 620, 4], [980, 900, 5]].forEach(([x, y, r]) => S.fill(poly(starPts(x, y, r * 2.4, r)), 0, 0, DS.P.yellow[1], 1));
S.fill(circ(1340, 560, 640, 560), 0, 0, DS.glow(DS.P.dusk[1], 0.45), 1);
const M = moonie(S, 600, 540, 215); M.grin(0);
const O = ollieBed(S, 0, 1360, 1150, 1.7, "open");
DS.shape(S, "M600 1300 L640 900 Q1000 850 1360 878 Q1720 850 1980 900 L2000 1300 Z", "blue");
S.fill("M640 900 Q1000 850 1360 878 Q1720 850 1980 900 L1984 950 Q1360 930 636 950 Z", 0, 0, DS.P.white[0], 1);
S.draw("M636 950 Q1360 930 1984 950", 0, 0, { c: DS.line(), w: DS.w.mid });
[[760, 1020], [960, 1040], [1160, 1010], [1560, 1030], [1760, 1010], [1360, 1050]].forEach(([x, y]) => S.fill(poly(starPts(x, y, 30, 13)), 0, 0, DS.c("yellow", 1), 0.95));
DS.vignette(S, 0.1);
