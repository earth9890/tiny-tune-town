// look: still
// @include ../../../tools/cast.js
// @include ../chars.js
// B (friends, no text): Ollie's smile right, Jill and Jack tucked under his arms (hug time), hearts above, hill behind. Badge bottom-left.
const S = scene(0, 1, { cam: "none" }); hill(S); cloud(S, 760, 150, 1.1);
const Jl = kid(S, 560, 1060, 1.2, { jill: true, look: 5 }), Jk = kid(S, 280, 1090, 1.15, { bandage: true, look: 5 });
const O = ollie(S, 1250, 1250, 2.0, { mouth: "open", look: -10 });
[[820, 300, 1.2], [960, 220, 1.0], [700, 220, 0.8]].forEach(([x, y, k]) => S.fill(circ(x, y, 34 * k), 0, 0, DS.c("red"), 1));
DS.vignette(S, 0.1);
