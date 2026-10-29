// CRITIQUE r1 4/4/4/4/5/4/4/5/5 (focal, emotion, curiosity, contrast, text, composition, polish, honesty, brand); r2: face clear of props, text top-left only, badge zone clear -> final (shipped as a.png)
// look: still
// @include ../../../tools/cast.js
// @include ../chars.js
// A (claim + face): Ollie's huge grin right with a pail in two arms, Jack left with a big bandage on his crown giving a wave, hill + well behind, "OOPS!" top-left. Badge bottom-left.
const S = scene(0, 1, { cam: "none" }); hill(S); cloud(S, 760, 150, 1.1); well(S, 960, 620, 0.9);
const Jk = kid(S, 330, 1060, 1.25, { bandage: true, look: 5 }); Jk.wave(1, 0.01, 0.02, 150);
const O = ollie(S, 1330, 1250, 2.0, { mouth: "grin", look: -4 });
[[0, 1, "blue"], [0, -1, "orange"]].forEach(([ai, side, c]) => { const A = O.arms.find((a) => a.ai === ai && a.side === side); const [x, y] = O.holdAt(A, -250); pail(S, O.body, x, y + 40, 1.3, c); });
S.text("OOPS!", 440, 250, { size: 220, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
