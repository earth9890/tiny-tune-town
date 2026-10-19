// look: still
// @include ../../../tools/cast.js
// @include ../chars.js
// B: same as A with no text, plus the dish and the spoon running off hand in hand (Test & Compare partner).
const S = scene(0, 1, { cam: "none" });
hill(S, { hy: 820, stars: [[120, 90, 18], [560, 60, 14], [1080, 110, 20], [1250, 60, 12], [1820, 90, 16], [1100, 330, 10], [180, 420, 12]] });
const M = moon(S, 800, 600, 165, { open: true });
const C = cow(S, 830, 372, 0.72, { look: 6, open: true, shadow: false });
C.rock.setAttribute("transform", "rotate(-8 0 -150)");
const O = ollie(S, 1460, 1210, 1.62, { mouth: "grin", look: -10 });
dish(S, 930, 1040, 0.75, { look: 8, open: true }); spoon(S, 1110, 1040, 0.75, { look: 8, open: true });
DS.vignette(S, 0.1);
