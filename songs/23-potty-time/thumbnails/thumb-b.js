// look: still
// @include ../../../tools/cast.js
// B (friend, no text): Ollie's happy face right, Bibi cheering with both arms up on the left, a little potty with its lid shut between them, stars. Badge bottom-left.
const pottyBack = (S, x, gy, k, parent) => DS.shape(S, rrect(x - 96 * k, gy - 250 * k, 192 * k, 190 * k, 44 * k), "grass", { parent });
const pottyFront = (S, x, gy, k, o = {}) => {
  const p = o.parent;
  DS.shape(S, `M${K(x - 138 * k)} ${K(gy - 128 * k)} H${K(x + 138 * k)} Q${K(x + 142 * k)} ${K(gy - 18 * k)} ${K(x + 84 * k)} ${K(gy - 2 * k)} H${K(x - 84 * k)} Q${K(x - 142 * k)} ${K(gy - 18 * k)} ${K(x - 138 * k)} ${K(gy - 128 * k)} Z`, "grass", { parent: p });
  DS.shape(S, circ(x, gy - 128 * k, 150 * k, 32 * k), "white", { parent: p, w: "mid" });
  S.fill(circ(x, gy - 128 * k, 104 * k, 17 * k), S.start, 0, DS.c("gray", 2), 1, p);                      // the seat opening (clean and shallow)
  if (o.open) return null;
  const lid = S.grp(p);
  DS.shape(S, circ(x, gy - 134 * k, 142 * k, 27 * k), "white", { parent: lid, w: "mid" });
  S.fill(circ(x - 40 * k, gy - 140 * k, 50 * k, 7 * k), S.start, 0, DS.P.white[0], 0.9, lid);
  return lid;
};
const gstar = (S, x, y, r, t) => { const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r * 0.48 : r; return [K(x + Math.cos(a) * q), K(y + Math.sin(a) * q)]; });
  const [g, in_] = popIn(S, t, x, y); DS.shape(S, poly(pts) + " Z", "yellow", { parent: in_, w: "mid" }); return g; };
const chart = (S, stars) => { DS.shape(S, rrect(1510, 150, 250 + 40, 230, DS.r.md), "white", { layer: "mid", w: "mid" });
  CH_Y.forEach((y) => CH_X.forEach((x) => S.draw(circ(x, y, 28), S.start, 0, { c: DS.c("gray", 0, "mid"), w: DS.w.detail })));
  stars.forEach(([i, t]) => gstar(S, CH_X[i % 3], CH_Y[Math.floor(i / 3)], 34, t)); };
const CH_X = [1560, 1640, 1720], CH_Y = [230, 316];
const S = scene(0, 1, { cam: "none" }); DS.room(S, { wall: "sky", floor: "floor", window: [1500, 150, 250, 290] }); DS.rug(S, 760, 1000, 1180, "red");
bibi(S, 330, 470, { k: 1.2, mood: "joy", paws: [[210, 330], [450, 330]] });
pottyBack(S, 760, 1000, 1.2); const O = ollie(S, 1250, 1250, 2.0, { mouth: "open", look: -8 }); pottyFront(S, 760, 1000, 1.2, {});
[[620, 420, 0.8], [900, 380, 1]].forEach(([x, y, r]) => sparkle(S, x, y, 0, r));
DS.vignette(S, 0.1);
