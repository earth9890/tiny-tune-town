// CRITIQUE r1 4/4/5/4/5/4/4/5/5 (bubble crown = absurd moment; eight hands = honest gag); r2: text off the face, crown trimmed -> final (shipped as b.png, Test & Compare slot).
// look: still
// @include ../../../tools/cast.js
// C (absurd moment): a mountain of bubbles piled on Ollie's head, eyes wide, "8 HANDS!" top-left. Badge bottom-left.
const S = scene(0, 1, { cam: "none" }); DS.room(S, BATH_ROOM);
tiles(S, -200, -200, 2120, 700, 120);
const O = ollie(S, 1240, 1280, 2.0, { mouth: "open", look: 0 });
foam(S, 0, -520, 8, 0, O.body); foam(S, -90, -500, 6, 0, O.body); foam(S, 90, -500, 6, 0, O.body); foam(S, 0, -640, 5, 0, O.body);
O.arms.forEach((A, i) => { const [x, y] = A.ai === 3 ? O.holdAt(A, -250) : (O.raise(A, [125, 98, 72][A.ai], 0, 0.01), O.tipNow(A, 40)); foam(S, x, y, 4, 0, O.body); });
[[-190, -520, 1.1], [200, -540, 0.9]].forEach(([x, y, r]) => sparkle(S, ...O.at([x, y]), 0, r));
S.text("8 HANDS!", 470, 250, { size: 190, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
