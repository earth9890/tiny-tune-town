// CRITIQUE r1 4/4/5/4/5/4/4/5/5 (absurd moment, honest gag); r2: text off the face, props trimmed -> final (shipped as b.png, Test & Compare slot)
// look: still
// @include ../../../tools/cast.js
// @include ../chars.js
// C (absurd moment): all eight arms hold a pail each, Ollie's wide-eyed "oh!" face, "8 PAILS!" top-left. Badge bottom-left.
const S = scene(0, 1, { cam: "none" }); hill(S); cloud(S, 760, 150, 1.1); well(S, 640, 640, 0.9);
const O = ollie(S, 1240, 1280, 2.0, { mouth: "open", look: 0 });
const PC = ["blue", "orange", "red", "yellow", "green", "purple", "blue", "orange"];
O.arms.forEach((A, i) => { let x, y; if (A.ai === 3) { [x, y] = O.holdAt(A, -250); } else { O.raise(A, [125, 98, 72][A.ai], 0, 0.01); [x, y] = O.tipNow(A, 30); } pail(S, O.body, x, y + 40, 1.1, PC[i]); });
S.text("8 PAILS!", 450, 250, { size: 200, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
