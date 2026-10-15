// look: still
// @include ../../../tools/cast.js
// @include ../garden.js
// B: same as A with no text (Test & Compare partner).
const S = scene(0, 1, { cam: "none" });
garden(S, { wall: false });
WALL.x0 = 300; WALL.x1 = 1000; WALL.top = 800; wall(S);
const O = ollie(S, 1440, 1120, 1.65, { mouth: "open", look: -14 });
[O.arms.find((A) => A.ai === 0 && A.side === 1), O.arms.find((A) => A.ai === 1 && A.side === 1)].forEach((A, i) => O.holdAt(A, [-200, -330][i]));   // arms out: "I've got you!"
const H = humpty(S, 680, 804, { k: 1.45, mouth: "oops", look: 8 });
H.rock.setAttribute("transform", "rotate(-14)");
H.arms.forEach((g) => g.setAttribute("transform", `rotate(${-60 * g.s} ${g.sh})`));
[[430, 520], [470, 420], [900, 400], [940, 500]].forEach(([x, y], i) => S.draw(arc(x, y, 40, i < 2 ? 120 : -60, i < 2 ? 240 : 60), 0, 0, { c: DS.c("ink"), w: DS.w.near }));   // wobble lines
DS.vignette(S, 0.1);
