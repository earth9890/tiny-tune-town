// look: still
// @include ../../../tools/cast.js
// @include ../../../tools/family.js
// THUMBNAIL TEMPLATE (family cast, 2026-11). Copy to songs/<slug>/thumbnails/thumb-a.js (same folder depth), then swap the prop and LABEL.
// Nomi's face = ~46 % of the height on the right 40 %, eyes to the viewer; the prop (the song) sits left-centre, above y 560;
// bottom-left 380×170 px (1280 frame) stays clear for tools/badge.sh; LABEL = "" for the no-text B version.
TOON = 2;
const LABEL = "SING!";
const S = scene(0, 1, { cam: "none" });
const W0 = DS.outdoor(S, { hy: 640, sun: [1500, 150], sky: "sky", ground: "grass", hills: "green" });
S.blur(W0.g, 5);
S.fill(circ(1390, 520, 560, 520), 0, 0, DS.glow(DS.P.yellow[1], 0.6), 1);
const N = toddler(S, 1390, 1250, 1.7, { mood: "sing" }); N.arm(-1, 112, 0, 0.01);
// prop: replace with the song's object (keep it big, one bright accent colour)
const P = G(S, null, "translate(640 470) rotate(-8)"); toon(S, famStar(0, 0, 190), "yellow", { parent: P }); twinkle(S, 70, -70, 36, P); toyFx(P, 9);
if (LABEL) S.text(LABEL, 470, 230, { size: 210, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.08); grade(S, [1500, 150], 0.7);
