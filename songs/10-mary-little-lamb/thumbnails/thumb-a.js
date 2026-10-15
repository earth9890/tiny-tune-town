// look: still
// @include ../../../tools/cast.js
// @include ../lamb.js
// A: Ollie's huge grinning face on the right, the fluffy lamb (joyful, hopping) beside him on the left-centre, hearts; "FOLLOW ME!" top-left. Badge bottom-left (tools/badge.sh).
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 760, sun: [980, 120], hills: "grass" });
cloud(S, 1700, 140, 0.9); cloud(S, 760, 560, 0.55);
flowers(S, [[700, 1040, "pink"], [820, 1060, "yellow"]]);
const O = ollie(S, 1360, 1290, 2.1, { mouth: "grin", look: -8 });
[arm(O, 1, 1), arm(O, 1, -1)].forEach((A) => O.raise(A, 110, 0, 0.01));
const L = lamb(S, 700, 1000, 1.75, { dir: 1 }); L.puff(1.1, 0, 0.01); L.lift.setAttribute("transform", "translate(0 -150)");   // mid-hop, clear of the badge
hearts(S, 0, [[1030, 430, 1.1]]);
S.text("FOLLOW ME!", 540, 230, { size: 170, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
