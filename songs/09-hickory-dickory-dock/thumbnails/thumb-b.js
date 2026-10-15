// look: still
// @include ../../../tools/cast.js
// @include ../art.js
// B: thumb A with no text (Test & Compare partner).
BEAT = 60 / 116;
const S = scene(0, 1, { cam: "none" }); DS.room(S, { window: false });
for (let x = 400; x < 1560; x += 60) S.draw(`M${x} 90 V738`, 0, 0, { c: DS.c("wall", 2, "mid"), w: DS.w.hair, op: 0.35 });
const CL = G(S, null, `translate(${840 - CX * 0.95} ${330 - DY * 0.95}) scale(0.95)`);
grandClock(S, { parent: CL, hour: 1 });
S.draw(rays(CX, DY, 126, 166, 12), 0, 0, { c: DS.c("gold", 2), w: DS.w.mid, parent: CL });
const M = buddy(S, "mouse", CL); M.g.setAttribute("transform", `translate(${CX} 212) scale(1.15)`);
const O = ollie(S, 1450, 1120, 1.6, { mouth: "open", look: 0 });
[[-260, -560, 1]].forEach(([x, y, r]) => S.draw(rays(...O.at([x, y]), 34 * r, 70 * r, 8), 0, 0, { c: DS.c("yellow", 2), w: DS.w.mid }));
DS.vignette(S, 0.1);
