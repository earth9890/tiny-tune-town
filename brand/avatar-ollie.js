// look: still
// @include ../tools/cast.js
// AVATAR: square crop x 420–1500, circle-safe; Ollie's face fills it
const S = scene(0, 1, { cam: "none" }); sea(S, { coral: false, weeds: [] });
[[620, 330, 26], [1330, 260, 20], [1380, 420, 14]].forEach(([x, y, r]) => bubble(S, x, y, r, 0));
const O = ollie(S, 960, 1350, 2.3, { mouth: "open", look: 0 });
[70, 55, 40, 25].forEach((a, ai) => O.arms.filter((A) => A.ai === ai).forEach((A) => O.raise(A, a, 0, 0.01)));
