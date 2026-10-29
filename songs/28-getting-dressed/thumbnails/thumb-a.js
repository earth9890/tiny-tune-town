// CRITIQUE r1 4/4/4/4/5/4/4/5/5 (focal, emotion, curiosity, contrast, text, composition, polish, honesty, brand); r2: face clear of props, text top-left only, badge zone clear -> final (shipped as a.png)
// look: still
// @include ../../../tools/cast.js
// A (claim + face): Ollie's huge grin right in a big red hat, a coloured sock on every arm tip, "READY!" top-left. Badge bottom-left.
const hat = (S, parent, x, y, k, col) => { const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`); DS.shape(S, "M-120 0 Q-110 -150 0 -160 Q110 -150 120 0 Z", col, { parent: g, w: "mid" }); DS.shape(S, rrect(-150, -6, 300, 36, 18), col, { parent: g, w: "mid", tone: 1 }); S.fill(circ(0, -176, 30), S.start, 0, DS.P.white[0], 1, g); return g; };
const sock = (S, parent, x, y, k, col) => { const g = G(S, parent, `translate(${K(x)} ${K(y)}) scale(${k})`); DS.shape(S, "M-26 -60 H26 V10 Q60 24 56 52 Q50 74 10 70 H-26 Z", col, { parent: g, w: "mid" }); DS.shape(S, rrect(-30, -74, 60, 26, 8), "white", { parent: g, w: "detail" }); return g; };
const bedroom = (S) => { DS.room(S, { wall: "sky", floor: "floor", window: [1500, 150, 250, 290] }); DS.rug(S, 960, 1000, 1400, "yellow"); };
const S = scene(0, 1, { cam: "none" }); bedroom(S);
const O = ollie(S, 1250, 1250, 2.0, { mouth: "grin", look: -4 });
hat(S, O.body, 0, -450, 0.95, "red");
const C = ["red", "sky", "purple", "orange", "grass", "yellow", "red", "sky"];
O.arms.forEach((A, i) => { let x, y; if (A.ai >= 2) { return; } else { O.raise(A, [125, 98, 72][A.ai], 0, 0.01); [x, y] = O.tipNow(A, 30); } sock(S, O.body, x, y + 30, 1.2, C[i]); });
S.text("READY!", 470, 250, { size: 220, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
