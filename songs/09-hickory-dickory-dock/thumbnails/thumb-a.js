// look: still
// @include ../../../tools/cast.js
// @include ../art.js
// A: Ollie's big singing face on the right; the smiling grandfather clock left-centre ringing, the mouse on top; "TICK TOCK!" top-left. Badge bottom-left (tools/badge.sh).
BEAT = 60 / 116;
const S = scene(0, 1, { cam: "none" }); DS.room(S, { window: false });
for (let x = 400; x < 1560; x += 60) S.draw(`M${x} 90 V738`, 0, 0, { c: DS.c("wall", 2, "mid"), w: DS.w.hair, op: 0.35 });
const CL = G(S, null, `translate(${840 - CX * 0.95} ${330 - DY * 0.95}) scale(0.95)`);
grandClock(S, { parent: CL, hour: 1 });
S.draw(rays(CX, DY, 126, 166, 12), 0, 0, { c: DS.c("gold", 2), w: DS.w.mid, parent: CL });
const M = buddy(S, "mouse", CL); M.g.setAttribute("transform", `translate(${CX} 212) scale(1.15)`);
const O = ollie(S, 1450, 1120, 1.6, { mouth: "open", look: 0 });
[[-260, -560, 1]].forEach(([x, y, r]) => S.draw(rays(...O.at([x, y]), 34 * r, 70 * r, 8), 0, 0, { c: DS.c("yellow", 2), w: DS.w.mid }));
S.text("TICK", 270, 230, { size: 180, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
S.text("TOCK!", 290, 420, { size: 180, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.12 });
DS.vignette(S, 0.1);
