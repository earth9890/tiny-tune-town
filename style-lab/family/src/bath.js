// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// Test frame: bath-time close-up. Nomi giggles in the tub (face ~47 % of the frame height, right 40 %); Dad kneels BESIDE the
// tub (grown-up always nearby), sleeves pushed up, sponge on the rim; rubber duck; a foam band along the water line.
TOON = 2;
const S = scene(0, 1, { cam: "none" });
DS.room(S, { wall: "glass", floor: "sand", window: false }); tiles(S, 360, 90, 1560, 760); bathWall(S, { towel: false });
const bg = S.grp(); [...S.g.children].filter((c) => c !== bg).forEach((c) => bg.appendChild(c)); S.blur(bg, 7);
const RIM = 830;
const N = toddler(S, 1240, 1200, 1.75, { mood: "giggle", bare: true });
const tub = G(S, null); toon(S, rrect(470, RIM, 1700, 520, 110), "sky", { parent: tub, dir: "v" });
S.fill(rrect(470, RIM + 150, 1700, 40, 0), 0, 0, DS.P.white[0], 0.75, tub); S.fill(rrect(470, RIM + 210, 1700, 14, 0), 0, 0, DS.P.white[0], 0.55, tub);
toon(S, rrect(450, RIM - 24, 1740, 52, 26), "white", { parent: tub }); S.fill(circ(760, RIM - 8, 220, 10), 0, 0, DS.P.white[0], 0.9, tub);
toyFx(tub, 6);
for (let x = 560; x < 1960; x += 70) foam(S, x + ((x * 37) % 40), RIM - 22 - ((x * 13) % 26), 7 + ((x / 70) % 3), 0);
[[1600, 330, 26], [1690, 230, 16], [1540, 170, 12], [900, 420, 20], [960, 330, 12]].forEach(([x, y, r]) => bubble(S, x, y, r, 0));
const duck = G(S, null, `translate(1660 ${RIM - 40}) scale(1.25)`);
toon(S, circ(0, 0, 70, 46), "yellow", { parent: duck }); toon(S, circ(-40, -56, 40), "yellow", { parent: duck });
toon(S, "M-78 -56 Q-110 -50 -104 -38 Q-90 -34 -74 -44 Z", "orange", { parent: duck, lw: DS.w.mid * 2 });
S.fill(circ(-48, -66, 7), 0, 0, DS.c("famHr", 2), 1, duck); S.fill(circ(-46, -69, 2.5), 0, 0, DS.P.white[0], 1, duck);
toyFx(duck, 6);
const D = dad(S, 250, 1600, 1.1, { mood: "happy", sleeves: 0.42 }); D.arm(1, 62, 0, 0.01);
const [hx, hy] = D.hand(1), sp = G(S, null, `translate(${K(hx)} ${K(hy - 10)}) rotate(-8)`);
toon(S, rrect(-62, -40, 124, 80, 22), "yellow", { parent: sp, lw: DS.w.mid * 2.4 }); [[-30, -12], [10, 8], [32, -18], [-8, 22]].forEach(([x, y]) => S.fill(circ(x, y, 7), 0, 0, DS.c("yellow", 2), 0.6, sp));
foam(S, hx + 50, hy - 50, 6, 0); toyFx(sp, 6);
DS.vignette(S, 0.1); grade(S, [1500, 100], 0.7);
