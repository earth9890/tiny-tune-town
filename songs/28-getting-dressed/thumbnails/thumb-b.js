// look: still
// @include ../../../tools/cast.js
// B (friend, no text): Bibi holds a big red hat out to Ollie, his surprised "oh!" face right. Badge bottom-left.
const hat = (S, parent, x, y, k, col) => { const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`); DS.shape(S, "M-120 0 Q-110 -150 0 -160 Q110 -150 120 0 Z", col, { parent: g, w: "mid" }); DS.shape(S, rrect(-150, -6, 300, 36, 18), col, { parent: g, w: "mid", tone: 1 }); S.fill(circ(0, -176, 30), S.start, 0, DS.P.white[0], 1, g); return g; };
const sock = (S, parent, x, y, k, col) => { const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`); DS.shape(S, "M-26 -60 H26 V10 Q60 24 56 52 Q50 74 10 70 H-26 Z", col, { parent: g, w: "mid" }); DS.shape(S, rrect(-30, -74, 60, 26, 8), "white", { parent: g, w: "detail" }); return g; };
const bedroom = (S) => { DS.room(S, { wall: "sky", floor: "floor", window: [1500, 150, 250, 290] }); DS.rug(S, 960, 1000, 1400, "yellow"); };
const S = scene(0, 1, { cam: "none" }); bedroom(S);
bibi(S, 400, 520, { k: 1.25, mood: "joy", paws: [[300, 700], [520, 700]] });
hat(S, null, 410, 330, 1.2, "red");
const O = ollie(S, 1300, 1250, 2.0, { mouth: "open", look: -10 });
DS.vignette(S, 0.1);
