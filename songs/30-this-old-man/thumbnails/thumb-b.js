// look: still
// @include ../../../tools/cast.js
// B (curiosity, no text): a huge puppy proudly sits on a bone, Ollie's wide-eyed smile beside it, the old turtle peeks in. Badge bottom-left.
const beach = (S) => { DS.outdoor(S, { hy: 560, sun: [300, 140] }); S.fill("M-200 600 H2120 V1280 H-200 Z", 0, 0, DS.c("blue", 1, "mid"), 0.9); S.fill(smooth([[-200, 820], [600, 800], [1300, 830], [2120, 810]]) + " L2120 1280 L-200 1280 Z", 0, 0, DS.c("sand", 1, "mid"), 1); };
const S = scene(0, 1, { cam: "none" }); beach(S);
const O = ollie(S, 1430, 1290, 2.0, { mouth: "open", look: -6 });
O.raise(O.arms[1], 95, 0, 0.01);
[[700, 590, 275, 255], [478, 545, 135, 205], [922, 545, 135, 205], [700, 860, 285, 270], [890, 905, 125, 185]].forEach(([x, y, rx, ry]) => S.fill(circ(x, y, rx, ry), 0, 0, DS.P.white[0], 1));
const P = puppy(S, 700, 1100, 2.9); P.pos.removeAttribute("filter");   // the 2x capture hangs on any filter over the puppy: white sticker edge drawn as fat white blobs under it
const bg = G(S, null, "translate(930 1020)"); bone(S, bg, 1.5);
DS.vignette(S, 0.1);
