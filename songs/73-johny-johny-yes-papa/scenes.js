// look: still
// @include ../../tools/cast.js
// @include props.js
// 73 Johny Johny Yes Papa (original). Papa (big, glasses, blue bow tie) asks, Johny (Ollie) answers "Yes, Papa!". Four passes (couplet, couplet, chorus), then a final chorus with Bibi.
// Lines in script.json: pass i = lines 8i+1..8i+8 (1-4 verse, 5-8 chorus), final chorus = 33..36, then "Bye-bye!" (37). Camera per scene: medium on the speaker -> faces. 0.6 s crossfades.
BEAT = 60 / 116;
const CS = (c) => CLIP(c)[0], CE = (c) => CLIP(c)[1];
const P = (i, l) => 8 * i + l;
const WORDS = [["Wake up!", "Shoes"], ["Toast", "Outside"], ["Share", "Friend"], ["Bedtime", "Hug"]];
const FY = 935, PX = 470, PK_ = 1.15, JX = 1430, JK = 0.9;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const view = (S, x, y, k, t, dur = 1.3) => (x = clamp(x, 960 / k - 190, 2110 - 960 / k), y = clamp(y, 540 / k - 190, 1270 - 540 / k), k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const sing = (A, c) => TIMING.words.filter((w) => w[0] === c).forEach((w) => A(w[3], w[3] + 0.6 * (w[4] - w[3])));
const place = (S, make, x, gy, k, o) => { const n = S.g.children.length, A = make(S, x, gy, k, o); A.sd = S.g.children[n]; return A; };
const done = (S) => DS.vignette(S, 0.1);
const flowers = (S, g, xs, y) => xs.forEach(([x, c]) => { const f = S.grp(g); S.draw(`M${x} ${y} V${y - 46}`, S.start, 0, { c: DS.c("green", 2, "mid"), w: DS.w.mid, parent: f }); [0, 1, 2, 3, 4].forEach((j) => S.fill(circ(x + Math.cos(j * 1.256) * 14, y - 54 + Math.sin(j * 1.256) * 14, 11), S.start, 0, DS.c(c, 0, "mid"), 1, f)); S.fill(circ(x, y - 54, 8), S.start, 0, DS.c("yellow", 0, "mid"), 1, f); tw(f, S.start, S.len, "rotate(-3 " + x + " " + y + ")", "rotate(3 " + x + " " + y + ")", wave(cyc(S.len, 3))); });
const BG = [{ sky: "sky", ground: "grass", hills: "grass" }, { sky: "sky", ground: "grass", hills: "green" }, { sky: "sky", ground: "sand", hills: "sand" }, { sky: "dusk", ground: "grass", hills: "green" }];
const world = (S, i) => {
  const { g } = DS.outdoor(S, { hy: 600, sun: [i % 2 ? 330 : 1560, 170], ...BG[i % BG.length] });
  [[300 + 700 * (i % 2), 190, 1], [1100 - 500 * (i % 2), 130, 0.8]].forEach(([x, y, k]) => { const c = S.grp(g); [[0, 0, 90 * k, 36 * k], [70 * k, -18 * k, 64 * k, 34 * k], [-70 * k, 6 * k, 56 * k, 28 * k]].forEach(([dx, dy, rx, ry]) => S.fill(circ(x + dx, y + dy, rx, ry), S.start, 0, DS.P.white[0], 0.9, c)); tw(c, S.start, S.len, "translate(0 0)", "translate(70 0)", "none"); });
  flowers(S, g, [[70, "pink"], [210, "yellow"], [1850, "red"], [1700, "purple"], [880, "yellow"]], 1020);
};
const cast = (S, o = {}) => {
  const Pa = place(S, ollie, PX, FY, PK_, { mouth: "smile", look: 10 }); papaGear(S, Pa);
  const J = place(S, ollie, JX, FY, JK, { mouth: "smile", look: -10 });
  Pa.bob(S.start + 0.3, S.end - 0.3, 6); J.bob(S.start + 0.5, S.end - 0.3, 9);
  return [Pa, J];
};
const bounds = [0];
for (let i = 0; i < 4; i++) bounds.push(CS(P(i, 1)) - 0.3, CS(P(i, 3)) - 0.3, CS(P(i, 5)) - 0.3);
bounds.push(CS(33) - 0.3, CE(36) + 0.3, TOTAL);
// intro
{ const S = scene(bounds[0], bounds[1], { cam: "none" }); world(S, 0); const [Pa, J] = cast(S);
  Pa.wiggle([1, 2, 7, 8], S.start + 0.5, S.end - 0.3, 12, BEAT); J.wiggle([3, 4, 5, 6], S.start + 0.5, S.end - 0.3, 14, BEAT / 2);
  S.fadeOut(DS.card(S, "Johny Johny", 960, 250, { size: DS.type.display * 1.1, t: 0.6, fill: "yellow" }).g, S.end - 0.3, 0.3);
  view(S, 960, 700, 1.12, 1.5, 2.5); done(S); }
// passes
for (let i = 0; i < 4; i++) {
  [[1, 2, 0], [3, 4, 1]].forEach(([l1, l2, w], n) => {
    const a = bounds[1 + 3 * i + n], b = bounds[2 + 3 * i + n], S = scene(a, b, { cam: "none" }); world(S, i); const [Pa, J] = cast(S);
    sing(Pa.sing, P(i, l1)); sing(J.sing, P(i, l2));
    const tq = CS(P(i, l1)), ta = CS(P(i, l2));
    Pa.hop(tq, 30, 0.5); J.hop(ta, 50, 0.5); J.wiggle([1, 2, 7, 8], ta, Math.min(b - 0.2, ta + 2.5), 16, BEAT / 2);
    S.fadeOut(DS.card(S, WORDS[i][w], 960, 230, { size: DS.type.display, t: Math.max(tq - 0.05, a + 0.1), fill: "yellow" }).g, b - 0.1, 0.3);
    view(S, PX + 250, 580, 1.1, tq - 0.4); view(S, JX - 250, 580, 1.1, ta - 0.4); view(S, 960, 600, 1, b - 1.6);
    done(S);
  });
  { const a = bounds[3 + 3 * i], b = bounds[4 + 3 * i], S = scene(a, b, { cam: "none" }); world(S, i + 2); const [Pa, J] = cast(S);
    [5, 6, 7, 8].forEach((l) => { sing(Pa.sing, P(i, l)); sing(J.sing, P(i, l)); });
    Pa.wiggle([1, 2, 3, 4, 5, 6, 7, 8], a + 0.4, b - 0.3, 12, BEAT); J.wiggle([1, 2, 3, 4, 5, 6, 7, 8], a + 0.4, b - 0.3, 18, BEAT / 2);
    J.hop(CS(P(i, 5)), 60, 0.5); J.grin(CS(P(i, 7)), b - 0.5);
    hearts(S, CS(P(i, 7)) + 0.5, [[960, 360, 1.1], [1250, 420, 1]]);
    view(S, 960, 580, 1.12, CS(P(i, 5)) - 0.5, 2.5); view(S, JX, 600, 1.6, CS(P(i, 7)) - 0.4); view(S, 960, 600, 1, b - 1.6);
    done(S); }
}
// finale
{ const a = bounds[13], b = bounds[14], S = scene(a, b, { cam: "none" }); world(S, 3); const [Pa, J] = cast(S);
  [33, 34, 35, 36].forEach((l) => { sing(Pa.sing, l); sing(J.sing, l); });
  Pa.wiggle([1, 2, 3, 4, 5, 6, 7, 8], a + 0.4, b - 0.3, 12, BEAT); J.wiggle([1, 2, 3, 4, 5, 6, 7, 8], a + 0.4, b - 0.3, 18, BEAT / 2); J.grin(CS(35), b);
  const Bi = bibi(S, 960, FY - 325 * 0.7, { k: 0.7, mood: "joy" }); DS.shadow(S, 960, FY, 180);
  hearts(S, a + 1.0, [[700, 330, 1], [960, 280, 1.1], [1220, 330, 1]]);
  view(S, 960, 640, 1.12, a + 1, 3); done(S); }
// outro
{ const a = bounds[14], S = scene(a, TOTAL, { cam: "none" }); world(S, 3); const [Pa, J] = cast(S); J.grin(S.start);
  S.text("Tiny Tune Town", 960, 330, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.start + 0.5 }); done(S); }
