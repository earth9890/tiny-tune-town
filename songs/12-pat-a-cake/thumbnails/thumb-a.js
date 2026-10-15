// look: still
// @include ../../../tools/cast.js
// A: Ollie's huge grinning face on the right in his chef's hat, clapping under his chin; a big iced "O" cake left-centre. "CLAP!" top-left. Badge bottom-left (tools/badge.sh).
const S = scene(0, 1, { cam: "none" }); DS.room(S, { wall: "sky", floor: "floor", window: [180, 380, 260, 240] });
DS.shape(S, rect(-200, 846, 1260, 400), "wood", { dir: "v" }); DS.shape(S, rrect(-220, 800, 1290, 56, DS.r.sm), "white");   // worktop
const O = ollie(S, 1300, 1200, 1.7, { mouth: "grin", look: -6 });
O.arms.filter((A) => A.ai === 3).forEach((A) => A.pose.setAttribute("opacity", 0));
[-1, 1].forEach((s) => {                                    // clapping pair, paws together under the chin
  const rx = 92 * s, { d } = tube([[rx, -196], [rx + 44 * s, -160], [rx + 30 * s, -118], [rx - 30 * s, -100], [14 * s, -126]], 30, 14);
  DS.shape(S, d, "pink", { parent: O.body });
});
[[-56, -560, 44], [0, -582, 54], [56, -560, 44]].forEach(([x, y, r]) => DS.shape(S, circ(x, y, r), "white", { parent: O.body }));   // chef's hat
DS.shape(S, rrect(-84, -530, 168, 48, DS.r.sm), "white", { parent: O.body });
S.draw("M-84 -512 H84", 0, 0, { c: DS.c("gray", 1), w: DS.w.detail, parent: O.body });
[[0, -126, 0.8], [-170, -150, 0.9], [170, -140, 0.9]].forEach(([x, y, r]) => sparkle(S, ...O.at([x, y]), 0, r));
// the cake: sponge, pink icing, cherry, iced letter O
const x = 700, gy = 820, k = 2.1;
DS.shadow(S, x, gy, 220 * k);
DS.shape(S, circ(x, gy - 8 * k, 96 * k, 15 * k), "white", { w: "mid" });
DS.shape(S, rrect(x - 76 * k, gy - 104 * k, 152 * k, 96 * k, DS.r.lg), "gold");
const drips = Array.from({ length: 5 }, (_, i) => { const x0 = x - 76 * k + i * 30.4 * k; return `Q${x0 + 15.2 * k} ${gy - (i % 2 ? 60 : 72) * k} ${x0 + 30.4 * k} ${gy - 84 * k}`; }).join(" ");
DS.shape(S, `M${x - 78 * k} ${gy - 84 * k} V${gy - 96 * k} Q${x - 78 * k} ${gy - 112 * k} ${x - 60 * k} ${gy - 112 * k} H${x + 60 * k} Q${x + 78 * k} ${gy - 112 * k} ${x + 78 * k} ${gy - 96 * k} V${gy - 84 * k} L${x - 76 * k} ${gy - 84 * k} ` + drips + " Z", "pink", { w: "mid", flat: true });
DS.shape(S, circ(x, gy - 124 * k, 14 * k), "red", { w: "detail" });
S.text("O", x, gy - 22 * k, { size: DS.type.display * k * 0.6, c: DS.P.white[0], halo: DS.c("red", 2), haloW: 0.14 });
[[560, 360, 40], [860, 330, 30], [470, 470, 24]].forEach(([px, py, r]) => S.fill(circ(px, py, r), 0, 0, DS.P.white[0], 0.85));   // flour puffs
S.text("CLAP!", 470, 250, { size: 220, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
