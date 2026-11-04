// look: still
// @include /Users/harish/videos/tiny-tune-town/tools/cast.js
// 76 Head, Shoulders, Knees and Toes (original words). Ollie leads Bibi and a puppy in a meadow. Each verse: A = the body part (card + action), B = "Up and down, one, two, three / Dancing with me" (hops); chorus = dance circle with a spin.
// Lines in script.json: hook "Head, shoulders, knees and toes" = lines 1-2 and 24-25 (cards point at each body part); verses start at 3, 7, 16, 20, 26 (4 lines each); choruses at 11 (5 lines) and 30 (4 lines); "Bye-bye!" = 34.
BEAT = 60 / 116;
const CS = (c) => CLIP(c)[0], CE = (c) => CLIP(c)[1];
const VERSES = [[3, "Head"], [7, "Shoulders"], [16, "Knees"], [20, "Toes"], [26, "Head & toes"]], CHORUS = [11, 30], CN = { 11: 5, 30: 4 }, HOOKS = [1, 24];
const FY = 935, OX = 960, OK = 1.15;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const view = (S, x, y, k, t, dur = 1.3) => (x = clamp(x, 960 / k - 190, 2110 - 960 / k), y = clamp(y, 540 / k - 190, 1270 - 540 / k), k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const sing = (A, c) => TIMING.words.filter((w) => w[0] === c).forEach((w) => A(w[3], w[3] + 0.6 * (w[4] - w[3])));
const place = (S, make, x, gy, k, o) => { const n = S.g.children.length, A = make(S, x, gy, k, o); A.sd = S.g.children[n]; return A; };
const done = (S) => DS.vignette(S, 0.1);
const world = (S, i) => {
  const { g } = DS.outdoor(S, { hy: 600, sun: [i % 2 ? 330 : 1560, 170], sky: "sky", ground: "grass", hills: i % 2 ? "green" : "grass" });
  [[300 + 700 * (i % 2), 190, 1], [1100 - 500 * (i % 2), 130, 0.8]].forEach(([x, y, k]) => { const c = S.grp(g); [[0, 0, 90 * k, 36 * k], [70 * k, -18 * k, 64 * k, 34 * k], [-70 * k, 6 * k, 56 * k, 28 * k]].forEach(([dx, dy, rx, ry]) => S.fill(circ(x + dx, y + dy, rx, ry), S.start, 0, DS.P.white[0], 0.9, c)); tw(c, S.start, S.len, "translate(0 0)", "translate(70 0)", "none"); });
  [[70, "pink"], [210, "yellow"], [1850, "red"], [1700, "purple"]].forEach(([x, c]) => { S.draw(`M${x} 1020 V974`, S.start, 0, { c: DS.c("green", 2, "mid"), w: DS.w.mid, parent: g }); S.fill(circ(x, 962, 22), S.start, 0, DS.c(c, 0, "mid"), 1, g); });
};
const cast = (S) => {
  const O = place(S, ollie, OX, FY, OK, { mouth: "smile", look: 0 });
  const Bi = (() => { const w = S.grp(); DS.shadow(S, 400, FY, 190, { parent: w }); const B = bibi(S, 400, FY - 325 * 0.62, { k: 0.62, mood: "joy" }); w.appendChild(B.g); tw(w, S.start + 0.3, S.end - 0.3, "translate(0 0)", "translate(0 -16)", hump(cyc(S.end - S.start, 2 * BEAT))); return B; })();
  const P = place(S, puppy, 1560, FY, 1.3, {}); P.wag(S.start, S.end - 0.2);
  O.bob(S.start + 0.3, S.end - 0.3, 9); return [O, P];
};
// chorus scenes begin 0.3 s before their first line, and verse 2's B scene runs up to it
const T = [];
VERSES.forEach(([l]) => T.push(["A", l], ["B", l + 2]));
CHORUS.forEach((l) => T.push(["C", l]));
HOOKS.forEach((l) => T.push(["H", l]));
T.sort((p, q) => CS(p[1]) - CS(q[1]));
const B = [0, ...T.map(([, l]) => CS(l) - 0.3), CE(33) + 0.3, TOTAL];
{ const S = scene(B[0], B[1], { cam: "none" }); world(S, 0); const [O] = cast(S); O.wiggle([1, 2, 7, 8], S.start + 0.5, S.end - 0.3, 14, BEAT); view(S, 960, 700, 1.1, 1.5, 2.5); done(S); }
T.forEach(([kind, l], n) => {
  const a = B[1 + n], b = B[2 + n], S = scene(a, b, { cam: "none" }); world(S, n); const [O, P] = cast(S), v = VERSES.findIndex(([x]) => x === l || x + 2 === l);
  Array.from({ length: kind === "C" ? CN[l] : kind === "H" ? 2 : 4 }, (_, j) => j).forEach((j) => sing(O.sing, l + j));
  if (kind === "H") {
    [[0, "Head", 300], [1, "Shoulders", 760], [2, "Knees", 1240], [4, "Toes", 1660]].forEach(([w, txt, x]) => { const t = W(l, w)[3]; DS.card(S, txt, x, 200, { size: DS.type.display * 0.8, t: Math.max(t - 0.05, a + 0.1), fill: "yellow" }); O.hop(t, 36, 0.5); });
    O.raise(O.arms[0], 120, CS(l), 0.5); O.raise(O.arms[1], 120, CS(l), 0.5); O.wiggle([3, 4, 5, 6], CS(l), b - 0.3, 16, BEAT / 2); view(S, 960, 600, 1.1, a + 0.3, 2.5); view(S, 960, 600, 1, b - 1.6);
  } else if (kind === "A") {
    const w = VERSES[v][1], ra = [1, 2], t0 = CS(l);
    S.fadeOut(DS.card(S, w, 960, 190, { size: DS.type.display * 0.9, t: Math.max(t0 - 0.05, a + 0.1), fill: "yellow" }).g, b - 0.1, 0.3);
    if (v === 0 || v === 4) { O.raise(O.arms[0], 140, t0, 0.5); O.raise(O.arms[1], 140, t0, 0.5); }
    if (v === 1) { O.hop(t0 + 0.2, 30); O.hop(t0 + 0.9, 30); O.hop(t0 + 1.6, 30); }
    if (v === 2) { O.scale(0.9, t0, 0.5); O.scale(1, t0 + 1.2, 0.5); O.scale(0.9, t0 + 2, 0.5); O.scale(1, t0 + 3, 0.5); }
    if (v === 3) O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], t0, b - 0.3, 20, BEAT / 2);
    view(S, OX, 450, 1.3, t0 - 0.4, 1.6); view(S, 960, 620, 1, b - 1.6);
  } else if (kind === "B") {
    O.hop(CS(l), 50, 0.5); O.hop(CS(l + 1), 50, 0.5); O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], a + 0.3, b - 0.3, 16, BEAT / 2); P.hop(CS(l) + 0.3, 40); view(S, 960, 640, 1.2, a + 0.3, 2.5);
  } else {
    O.spin(CS(l + 1), 1.5); O.grin(CS(l + 2), b - 0.5); O.wiggle([1, 2, 3, 4, 5, 6, 7, 8], a + 0.3, b - 0.3, 18, BEAT / 2); P.hop(CS(l + 2), 50);
    hearts(S, CS(l + 2) + 0.4, [[700, 400, 1], [1250, 380, 1]]); view(S, 960, 640, 1.2, a + 0.3, 2.5); view(S, 960, 600, 1, b - 1.6);
  }
  done(S);
});
{ const S = scene(B[B.length - 2], TOTAL, { cam: "none" }); world(S, 3); const [O] = cast(S); O.grin(S.start);
  S.text("Tiny Tune Town", 960, 330, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.start + 0.5 }); done(S); }
