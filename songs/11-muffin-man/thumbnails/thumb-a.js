// look: still
// @include ../../../tools/cast.js
// @include ../bakery.js
// A: Ollie's huge grinning face on the right, a treat balanced on each raised arm (the juggling gag); a giant muffin beside him; "YUM!" top-left. Badge bottom-left (tools/badge.sh).
BEAT = 60 / 116;
const S = scene(0, 1, { cam: "none" }); DS.room(S, BAKERY_ROOM); shelves(S);
S.fill(circ(1260, 560, 760, 620), 0, 0, DS.glow(DS.P.yellow[1], 0.7), 1);
const O = ollie(S, 1260, 1190, 1.65, { mouth: "grin", look: -4 });
holdTreats(S, O, ["bun", "pie", "bread", "muffin"]);
DS.shadow(S, 450, 790, 360); treat(S, "muffin", 450, 640, 3.4, null, "red");
[[250, 470, 1.1], [660, 440, 0.9]].forEach(([x, y, r]) => sparkle(S, x, y, 0, r));
S.text("YUM!", 420, 250, { size: 220, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
