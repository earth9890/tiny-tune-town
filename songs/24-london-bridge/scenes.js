// look: still
// @include ../../tools/cast.js
// 24 London Bridge (traditional, 1916 text). A cut-away of Ollie's bay: the sea on the left, a sandy beach bank on the right, a
// reef at the left end. The old plank bridge between reef and beach has broken down into the water. Friends come to help and
// each pass drops three pieces into place on the three slot words: sticks (three posts, a wobble, then steady), bricks (three
// red deck blocks), shells (three shells with a rope rail), sand (three sand heaps that make a ramp up the bank, Bibi pats them).
// Finale: Ollie, Crab, Turtle and Star walk across from the underwater reef to the beach, Bibi waves them in; everybody waves bye.
// Camera per pass: wide -> the bridge (line 1-2) -> wide (line 3) -> Ollie's face on the tag (line 4). No hard cuts, nothing under 4 s.
// Clips (script.json, 1-based): 1 intro, 2-5 opening verse, 6 "Let's build!", 7-10 sticks, 11, 12-15 bricks, 16, 17-20 shells,
// 21, 22-25 sand, 26 "Hooray!", 27-30 chorus 1, 31-34 chorus 2, 35 "Bye-bye!".
// ---- take remap (planned line -> sung clip number, or {t: seconds} for a break the singer dropped) ----
const PLAN = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, {"t": 62.583}, 16, 17, 18, 19, 20, 21, 22, 23, 24, {"t": 111.703}, 25, 26, 27, 28, {"t": 147.653}, {"t": 147.653}, 29, 31, 32];
const PWN = (c) => TIMING.words.filter((x) => x[0] === PLAN[c]).length;
const PW = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + i * 0.3 : W(PLAN[c], Math.min(i, PWN(c) - 1)));
const PCLIP = (c) => (typeof PLAN[c] === "object" ? [PLAN[c].t, PLAN[c].t + 1.2] : CLIP(PLAN[c]));
const PWE = (c, i) => (typeof PLAN[c] === "object" ? PLAN[c].t + 0.4 + i * 0.3 : WE(PLAN[c], Math.min(i, PWN(c) - 1)));

BEAT = 60 / 120;
const WATER = 520, DECK = 700, FLOOR = 905, FY = 945;
const OX = 420, OK = 1.0, FACE = [OX, FY - 330 * OK];
const DK = [[640, 850], [850, 1060], [1060, 1275]], POST = [745, 955, 1167], SHELLX = [700, 955, 1210];
const SAND = [[1370, 672], [1452, 616], [1540, 566]];
const BIB = [1700, 516], CRAB = [1000, FY, 0.5], TURT = [1215, FY, 0.55], STAR = [1470, FY - 5, 0.42];
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);                                                    // keep the camera inside the drawn world (vignette spans -200..2120)
const view = (S, x, y, k, t, dur = 1.3) => (x = clamp(x, 960 / k - 190, 2110 - 960 / k), y = clamp(y, 540 / k - 190, 1270 - 540 / k), k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const wide = (S, t) => view(S, 960, 540, 1, t);
const arm = (O, ai, side) => O.arms.find((A) => A.ai === ai && A.side === side);
const sing = (A, c) => TIMING.words.filter((w) => w[0] === PLAN[c]).forEach((w) => A(w[3], w[3] + 0.6 * (w[4] - w[3])));   // mouth opens on each sung word
const card = (S, s, x, y, t, out, size = DS.type.title) => S.fadeOut(DS.card(S, s, x, y, { size, t }).g, out, 0.4);
const last = (c) => PWE(c, 4);                                                                                          // "Over the bridge we go!" is 5 words

const TOP = [[1230, FLOOR], [1290, 780], [1330, DECK], [1420, 628], [1530, 566], [1640, 526], [1760, 506], [2000, 496]];
const surf = (x) => { const i = TOP.findIndex((p) => p[0] >= x); if (i < 1) return TOP[0][1]; const [a, b] = [TOP[i - 1], TOP[i]]; return a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]); };
// ---------- helpers ----------
const place = (S, make, x, gy, k, o) => { const n = S.g.children.length, A = make(S, x, gy, k, o); A.sd = S.g.children[n]; Object.assign(A, { x, gy, k, x0: x, gy0: gy }); return A; };
// walk / slide A to (x1, y1) at scale k1 (the shadow, the first thing each figure draws, slides along)
const moveTo = (S, A, t, dur, x1, y1, k1 = A.k, ease = "sine.inOut") => {
  tw(A.pos, t, dur, `translate(${A.x} ${A.gy}) scale(${A.k})`, `translate(${x1} ${y1}) scale(${k1})`, ease);
  if (A.sd) tw(A.sd, t, dur, `translate(${A.x - A.x0} ${A.gy - A.gy0})`, `translate(${x1 - A.x0} ${y1 - A.gy0})`, ease);
  Object.assign(A, { x: x1, gy: y1, k: k1 });
};
const hop = (A, t, h = 40) => (A.hop ? A.hop(t, h) : tw(A.bob, t, 0.5, "translate(0 0)", `translate(0 ${-h})`, hump(1)));
const dropIn = (S, g, t, h = 150) => { if (t > S.start + 0.05) { fadeIn(S, g, t); tw(g, t, 0.6, `translate(0 ${-h})`, "translate(0 0)", "power2.out"); } };
const stack = (O, t0, t1) => { const L = [1, 2, 7, 8]; L.forEach((n) => O.raise(O.arms[n - 1], 75, t0 - 0.3, 0.4)); O.wiggle(L, t0, t1, 20, BEAT / 2); L.forEach((n) => O.raise(O.arms[n - 1], 0, t1, 0.5)); };
const wave2 = (O, t0, t1) => { [arm(O, 0, 1), arm(O, 0, -1)].forEach((A) => O.raise(A, 120, t0 - 0.5, 0.6)); O.wiggle([1, 2], t0, t1, 14, BEAT); };
const spark3 = (S, xs, y, t) => xs.forEach((x, i) => sparkle(S, x, y, t + i * 0.2, 0.9));

// ---------- the bay: sky, sun, sea with light shafts, the foreground sand ridge (everything stands on it) ----------
const world = (S) => {
  const g = S.grp(); S.g.insertBefore(g, S.g.firstChild);
  DS.setHaze("sky");
  const sh = (d, fill, op) => { const p = el("path", { d, fill }, g); if (op !== undefined) p.setAttribute("opacity", op); return p; };
  sh(rect(-800, -400, 3600, WATER + 460), DS.vgrad(DS.P.sky[2], DS.P.sky[1]));
  sh(circ(1040, 140, 300), DS.glow(DS.P.yellow[1], 0.7)); sh(circ(1040, 140, 70), DS.P.yellow[1]);
  [[260, 190, 1], [1560, 120, 0.8], [700, 300, 0.7]].forEach(([x, y, k]) => { sh(circ(x, y, 90 * k, 36 * k), DS.P.white[0], 0.9); sh(circ(x + 70 * k, y - 18 * k, 64 * k, 34 * k), DS.P.white[0], 0.9); sh(circ(x - 70 * k, y + 6 * k, 56 * k, 28 * k), DS.P.white[0], 0.9); });
  sh(smooth(Array.from({ length: 19 }, (_, i) => [-800 + i * 190, WATER + (i % 2 ? 9 : -9)])) + " L2700 1500 L-800 1500 Z", DS.vgrad(DS.P.sky[0], DS.c("blue", 0, "mid")));
  [[560, 110], [860, 150], [1180, 110], [1480, 140]].forEach(([x, w]) => sh(`M${x - w / 2} ${WATER} H${x + w / 2} L${x + w * 1.3 + 120} ${FLOOR} H${x - w * 0.3 + 120} Z`, DS.P.white[0], 0.14));
  const line = S.draw(smooth(Array.from({ length: 19 }, (_, i) => [-800 + i * 190, WATER + (i % 2 ? 9 : -9)])), S.start, 0, { c: DS.P.white[0], w: DS.w.mid, op: 0.8 });   // water surface
  tw(line, S.start, S.len, "translate(0 0)", "translate(-60 0)", wave(cyc(S.len, 5)));
};
const floorRidge = (S) => DS.shape(S, smooth([[-800, 925], [600, 915], [1300, 930], [2700, 918]]) + " L2700 1500 L-800 1500 Z", "sand", { layer: "mid", dir: "v", w: "detail" });
const reef = (S) => {
  DS.shape(S, rrect(-700, DECK, 1340, 260, DS.r.md), "gray", { layer: "mid" });
  coral(S, 90, DECK + 4, 0.75, "pink"); coral(S, 520, DECK + 4, 0.55, "orange"); weed(S, 330, DECK + 6, 200, "mid");
};
// the old bridge, broken down: a plank hanging off each end and planks on the sea floor
const rubble = (S) => {
  const g = S.grp(), p = (x, y, w, rot, ox, oy) => DS.shape(S, rrect(x, y, w, 24, DS.r.xs), "wood", { layer: "mid", w: "mid", dir: "v", parent: G(S, g, `rotate(${rot} ${ox ?? x} ${oy ?? y + 12})`) });
  p(640, DECK + 2, 100, 32, 640, DECK + 14); p(1180, DECK + 2, 100, -30, 1280, DECK + 14);
  p(820, FLOOR - 22, 160, 5); p(1010, FLOOR - 4, 130, -9); p(1190, FLOOR - 26, 90, 14); p(1300, FLOOR - 10, 60, -22);
  return g;
};
const stickPost = (S, i) => {
  const x = POST[i], g = S.grp(), w = G(S, g, `rotate(0 ${x} ${FLOOR})`);
  [[-26, 0], [0, -14], [26, 0]].forEach(([dx, dy]) => DS.shape(S, rrect(x + dx - 11, DECK + 44 + dy, 22, FLOOR + 40 - DECK - 44 - dy, DS.r.xs), "wood", { layer: "mid", w: "mid", dir: "v", parent: w }));
  DS.shape(S, rrect(x - 44, 810, 88, 16, DS.r.xs), "gold", { layer: "mid", w: "detail", parent: w });
  return { g, w };
};
const slab = (S, i) => {
  const [x0, x1] = DK[i], g = S.grp();
  DS.shape(S, rrect(x0 + 2, DECK, x1 - x0 - 4, 56, DS.r.xs), "red", { layer: "mid", w: "mid", parent: g });
  let d = `M${x0 + 2} ${DECK + 28} H${x1 - 2}`;
  for (let x = x0 + 46; x < x1 - 20; x += 50) d += ` M${x} ${DECK} V${DECK + 28}`;
  for (let x = x0 + 22; x < x1 - 20; x += 50) d += ` M${x} ${DECK + 28} V${DECK + 56}`;
  S.draw(d, S.start, 0, { c: DS.c("red", 2, "mid"), w: DS.w.hair, parent: g });
  return g;
};
const shellP = (S, i) => {
  const x = SHELLX[i], b = DECK, g = S.grp(), nm = i % 2 ? "yellow" : "pink";
  DS.shape(S, `M${x - 44} ${b} Q${x - 58} ${b - 72} ${x} ${b - 76} Q${x + 58} ${b - 72} ${x + 44} ${b} Z`, nm, { layer: "mid", w: "mid", parent: g });
  [-26, -9, 9, 26].forEach((dx) => S.draw(`M${x} ${b - 6} L${x + dx * 1.5} ${b - 66}`, S.start, 0, { c: DS.c(nm, 2, "mid"), w: DS.w.hair, parent: g }));
  if (i) S.draw(smooth([[SHELLX[i - 1], b - 60], [(SHELLX[i - 1] + x) / 2, b - 34], [x, b - 60]]), S.start, 0, { c: DS.c("gold", 2), w: DS.w.mid, parent: g });
  return g;
};
const heap = (S, i) => {
  const [x, y] = SAND[i], g = S.grp();
  DS.shape(S, `M${x - 74} ${y + 34} Q${x - 52} ${y - 52} ${x} ${y - 58} Q${x + 52} ${y - 52} ${x + 74} ${y + 34} Z`, "sand", { w: "mid", parent: g });
  [[-26, -6], [18, -22], [30, 6], [-6, 12]].forEach(([dx, dy]) => S.fill(circ(x + dx, y + dy, 5), S.start, 0, DS.c("sand", 2), 0.7, g));
  return g;
};
// the beach bank (drawn over the bridge ends), its sand top and a palm
const bank = (S) => {
  const top = TOP;
  DS.shape(S, smooth(top) + " L2700 1500 L1230 1500 Z", "earth", { layer: "mid" });
  const cap = top.slice(5);
  DS.shape(S, smooth(cap) + " L" + cap.map(([x, y]) => [x, y + 44]).reverse().map((q) => q.join(" ")).join(" L") + " L2700 520 L2700 496 Z", "sand", { layer: "mid", w: "mid" });
  const P = tube([[1862, 500], [1850, 420], [1866, 330]], 24, 13).d; DS.shape(S, P, "wood", { w: "mid", dir: "v" });
  [[-150, -20], [-100, -90], [0, -130], [100, -90], [150, -20]].forEach(([dx, dy]) => DS.shape(S, `M1866 330 Q${1866 + dx / 2} ${330 + dy - 70} ${1866 + dx} ${330 + dy} Q${1866 + dx / 2} ${330 + dy + 10} 1866 330 Z`, "green", { w: "detail" }));
};
// what is built, in order behind the bank. o.<kind> = false (not yet), true (already there) or [t0, t1, t2] (drops in on those times)
const bridgeSet = (S, o = {}) => {
  const R = { posts: [], slabs: [], shells: [], heaps: [] };
  const put = (k, make, i) => { const v = o[k]; if (!v) return; const p = make(S, i); if (Array.isArray(v)) dropIn(S, p.g || p, v[i]); R[k].push(p); };
  world(S); reef(S);
  if (o.rubble) R.rubble = rubble(S);
  [0, 1, 2].forEach((i) => put("posts", stickPost, i)); [0, 1, 2].forEach((i) => put("slabs", slab, i)); [0, 1, 2].forEach((i) => put("shells", shellP, i));
  bank(S);
  [0, 1, 2].forEach((i) => put("heaps", heap, i));
  floorRidge(S);
  return R;
};
// the friends. o.crab / o.turtle / o.star = [x, gy, k] or false; o.t = when they fade in; Ollie is always there
const friends = (S, o = {}) => {
  const F = {}, t = o.t;
  if (o.crab !== false) F.crab = place(S, crab, ...(o.crab || CRAB), { t: o.tc ?? t });
  if (o.turtle !== false) F.turtle = place(S, turtle, ...(o.turtle || TURT), { t: o.tt ?? t });
  if (o.star !== false) F.star = place(S, star, ...(o.star || STAR), { t: o.ts ?? t });
  F.fish = [fish(S, 1010, 610, 0.42, "yellow", 1, { t: o.tf ?? t }), fish(S, 1330, 640, 0.36, "orange", -1, { t: o.tf ?? t })];
  F.fish[0].swim(S.start, S.end, 16); F.fish[1].swim(S.start + 0.6, S.end, 12);
  return F;
};
const hero = (S, o = {}) => { const O = place(S, ollie, o.x ?? OX, o.gy ?? FY, o.k ?? OK, { mouth: o.mouth || "smile", look: o.look ?? 8, t: o.t }); return O; };
const wBibi = (S, t, o = {}) => {
  const [x, y] = o.at || BIB, k = o.k || 0.55, w = S.grp(); DS.shadow(S, x, y, 260 * k, { parent: w });
  const B = bibi(S, x, y - 325 * k, { k, mood: o.mood || "joy" }); w.appendChild(B.g);
  if (t > S.start + 0.05) popAt(w, t, x, y - 150, 0.5);
  if (o.wave !== false) swing(S, B.R, t + 0.6, S.end - 0.4, { rotation: -14, svgOrigin: B.R.sh }, BEAT);
  B.w = w; return B;
};
const done = (S) => { bubbleRow(S); weed(S, 30, 1140, 560, "near"); DS.vignette(S); };
const bubbleRow = (S) => [[860, 840, 14, 220], [1120, 880, 20, 260], [1330, 800, 12, 200], [1560, 860, 18, 280], [1000, 790, 10, 190]].forEach(([x, y, r, rise], i) => bubble(S, x, y, r, rise, { t: S.start + 0.3 + i * 0.9 }));

// ---------- scenes ----------
const B = [0, PW(4, 0) - 0.4, PWE(5, 6) + 0.5, PW(7, 0) - 0.6, last(10) + 1, PW(12, 0) - 0.6, last(15) + 1, PW(17, 0) - 0.6, last(20) + 1, PW(22, 0) - 0.6, last(25) + 1, PW(27, 0) - 0.6, PW(31, 0) - 0.6, last(34) + 0.5, TOTAL];

// 0  intro: the old bridge has broken down. Ollie looks at the gap; "Oh no!" arms up; face close-up on the frown
{ const S = scene(B[0], B[1], { cam: "none" });
  bridgeSet(S, { rubble: true }); const F = friends(S, { crab: [1020, FY, 0.5], turtle: false, star: false, tf: 2 }); const O = hero(S, { look: 14 });
  sing(O.sing, 1); sing(O.sing, 2); sing(O.sing, 3);
  O.bob(S.start + 0.4, B[1] - 0.2, 7);
  [arm(O, 0, 1), arm(O, 0, -1)].forEach((A) => O.raise(A, 65, PW(1, 0) - 0.3, 0.5)); [arm(O, 0, 1), arm(O, 0, -1)].forEach((A) => O.raise(A, 0, PWE(1, 2) + 0.4, 0.7));
  F.crab.dance(PW(2, 0), B[1] - 0.4);
  card(S, "LONDON BRIDGE", 960, 150, 0.4, PW(1, 0) + 1.2);
  view(S, 960, 700, 1.2, 0.3, 3.4); view(S, FACE[0] + 120, FACE[1] + 20, 1.5, PW(3, 0) - 0.6);
  done(S); }

// 1  friends come to help (c4) and count 1-2-3 (c5): they fade in one by one, Bibi waves from the beach, Ollie hops on each count
{ const S = scene(B[1], B[2], { cam: "none" });
  bridgeSet(S, { rubble: true }); const F = friends(S, { tc: PW(4, 1), tt: PW(4, 3), ts: PW(4, 4), tf: S.start });
  const O = hero(S, { look: 6 }), Bi = wBibi(S, PW(4, 5));
  sing(O.sing, 4); sing(O.sing, 5);
  O.bob(S.start + 0.3, B[2] - 0.2, 7);
  hop(F.crab, PW(4, 1) + 0.3, 30); hop(F.turtle, PW(4, 3) + 0.3, 24); hop(F.star, PW(4, 4) + 0.3, 30);
  [4, 5, 6].forEach((wi, i) => { O.hop(PW(5, wi), 55, 0.5); card(S, String(i + 1), 520 + i * 360, 220, PW(5, wi), PWE(5, 6) + 0.1, DS.type.display); });
  view(S, 1010, 660, 1.2, PW(4, 0) - 0.4); view(S, 800, 600, 1.15, PW(5, 0) - 0.6);
  done(S); }

// 2  "Let's build!": the friends tidy the old planks away (they slide off and fade), Ollie waves all four top arms
{ const S = scene(B[2], B[3], { cam: "none" });
  const R = bridgeSet(S, { rubble: true }), F = friends(S), O = hero(S, { look: 8 }), Bi = wBibi(S, S.start);
  O.bob(S.start + 0.3, B[3] - 0.2, 7);
  tw(R.rubble, S.start + 1.5, 4, "translate(0 0)", "translate(420 40)", "power1.in"); S.fadeOut(R.rubble, S.start + 3.6, 1.6);
  F.crab.clap(S.start + 1.6); F.crab.clap(S.start + 2.6); F.turtle.dance(S.start + 1, S.start + 5);
  sing(O.sing, 6); stack(O, PW(6, 0), PWE(6, 1) + 0.3); O.hop(PW(6, 1), 60);
  view(S, 1010, 660, 1.2, S.start + 1.2, 1.6); wide(S, PW(6, 0) - 1.0);
  done(S); }

// one pass. kind 0 sticks, 1 bricks, 2 shells, 3 sand; c = the first of its 4 clips; a..b = scene
const KINDS = ["posts", "slabs", "shells", "heaps"], WORDS = ["STICKS", "BRICKS", "SHELLS", "SAND"];
const pass = (kind, c, a, b) => {
  const S = scene(a, b, { cam: "none" }), T = [4, 5, 6].map((i) => PW(c, i)), o = { rubble: false };
  for (let k = 0; k < kind; k++) o[KINDS[k]] = true;
  o[KINDS[kind]] = T;
  const R = bridgeSet(S, o), F = friends(S, { tt: S.start }), O = hero(S, { look: 10 }), Bi = wBibi(S, S.start, { wave: kind !== 3 });
  O.bob(a + 0.3, b - 0.3, 7);
  [0, 1, 2, 3].forEach((l) => sing(O.sing, c + l));
  // L1 the three pieces drop in on their words; L3 (the same words again) they each hop; L2 Ollie stacks with four arms
  const items = R[KINDS[kind]].map((p) => p.g || p);
  T.forEach((t, i) => { if (kind === 0) { const w = R.posts[i].w; tw(w, t + 0.6, 1.3, `rotate(0 ${POST[i]} ${FLOOR})`, `rotate(${i % 2 ? -5 : 5} ${POST[i]} ${FLOOR})`, wave(2)); } });
  [4, 5, 6].forEach((wi, i) => tw(items[i], PW(c + 2, wi), 0.45, "translate(0 0)", "translate(0 -22)", hump(1)));
  stack(O, PW(c + 1, 0), PWE(c + 1, 5));
  // friends: crab claps with each word, star and turtle sway on L2
  T.forEach((t) => F.crab.clap(t + 0.4)); F.turtle.dance(PW(c + 1, 0), PWE(c + 1, 5)); F.star.dance(PW(c + 2, 0), PWE(c + 2, 6));
  if (kind === 3) { swing(S, Bi.R, PW(c, 4), PWE(c + 1, 5), { rotation: -26, svgOrigin: Bi.R.sh }, BEAT / 2); }      // Bibi pats the heaps
  spark3(S, SAND.map((s) => s[0]).filter(() => kind === 3), 540, PWE(c, 6) + 0.2);
  if (kind === 2) spark3(S, SHELLX, DECK - 120, PWE(c, 6) + 0.2);
  if (kind === 1) spark3(S, POST, DECK - 60, PWE(c, 6) + 0.2);
  card(S, WORDS[kind], 1330, 330, T[0], PW(c + 3, 0) - 0.9);
  view(S, 1010, 660, 1.2, PW(c, 0) - 0.5); wide(S, PW(c + 2, 0) - 0.5); view(S, ...FACE, 1.5, PW(c + 3, 0) - 0.6);
  done(S);
};
// a reaction break: the new piece is done, everyone cheers, camera drifts in on the bridge
const cheer = (kind, a, b, c, tHop) => {
  const S = scene(a, b, { cam: "none" }), o = { rubble: false };
  for (let k = 0; k <= kind; k++) o[KINDS[k]] = true;
  bridgeSet(S, o); const F = friends(S), O = hero(S, { look: 12 }), Bi = wBibi(S, S.start);
  O.bob(a + 0.3, b - 0.3, 8); sing(O.sing, c);
  [F.crab, F.turtle, F.star].forEach((A, i) => hop(A, tHop + i * 0.25, 34));
  O.hop(tHop, 70); wave2(O, a + 1.0, b - 0.4);
  const xs = [[POST, DECK + 20], [DK.map((d) => (d[0] + d[1]) / 2), DECK - 30], [SHELLX, DECK - 80], [SAND.map((s) => s[0]), 560]][kind];
  spark3(S, xs[0], xs[1], a + 1.2);
  view(S, 1010, 650, 1.2, a + 2.6, 2.0);
  done(S);
};

pass(0, 7, B[3], B[4]); cheer(0, B[4], B[5], 11, PW(11, 0));
pass(1, 12, B[5], B[6]); cheer(1, B[6], B[7], 16, PW(16, 0));
pass(2, 17, B[7], B[8]); cheer(2, B[8], B[9], 21, PW(21, 0));
pass(3, 22, B[9], B[10]);

// 11  "Hooray!" the bridge is done: everybody jumps, hearts rise
{ const S = scene(B[10], B[11], { cam: "none" });
  bridgeSet(S, { posts: true, slabs: true, shells: true, heaps: true }); const F = friends(S), O = hero(S, { look: 4, mouth: "grin" }), Bi = wBibi(S, S.start);
  O.bob(S.start + 0.3, B[11] - 0.3, 8); sing(O.sing, 26);
  [0, 1, 2].forEach((i) => { const t = PW(26, 0) + i * 0.7; O.hop(t, 80); [F.crab, F.turtle, F.star].forEach((A) => hop(A, t + 0.1, 40)); tw(Bi.w, t, 0.5, "translate(0 0)", "translate(0 -50)", hump(1)); });
  hearts(S, PW(26, 0), [[560, 420, 1], [1000, 400, 1.2], [1500, 360, 0.9]]);
  view(S, 1000, 650, 1.15, S.start + 3.2, 2.0);
  done(S); }

// 12  chorus 1: "London Bridge is up, hooray!" the friends dance in a row, the tag in Ollie's face
{ const S = scene(B[11], B[12], { cam: "none" });
  bridgeSet(S, { posts: true, slabs: true, shells: true, heaps: true }); const F = friends(S), O = hero(S, { look: 6, mouth: "grin" }), Bi = wBibi(S, S.start);
  O.bob(S.start + 0.3, B[12] - 0.3, 8); [27, 28, 29, 30].forEach((c) => sing(O.sing, c));
  hearts(S, PW(27, 0), [[700, 440, 1], [1300, 400, 1]]);
  wave2(O, PW(28, 0), PWE(28, 4));
  [[O, 2], [F.crab, 3], [F.turtle, 5]].forEach(([A, wi]) => hop(A, PW(29, wi), 60));
  F.star.dance(PW(29, 0), PWE(29, 5)); [PW(27, 0), PW(28, 0)].forEach((t) => F.crab.clap(t + 0.5));
  view(S, 1010, 660, 1.2, PW(27, 0) - 0.4); wide(S, PW(29, 0) - 0.5); view(S, ...FACE, 1.5, PW(30, 0) - 0.6);
  done(S); }

// 13  chorus 2: everybody walks across, underwater reef to the beach. Ollie leads, Crab, Turtle and Star follow, Bibi waves them in
{ const S = scene(B[12], B[13], { cam: "none" });
  bridgeSet(S, { posts: true, slabs: true, shells: true, heaps: true });
  const O = place(S, ollie, 700, DECK, 0.5, { mouth: "smile", look: 14 });
  const F = {
    crab: place(S, crab, 560, DECK, 0.3), turtle: place(S, turtle, 440, DECK, 0.34), star: place(S, star, 330, DECK, 0.26),
  };
  const Bi = wBibi(S, S.start);
  const t0 = S.start + 1.0, tm = PW(34, 0) - 0.3, te = PW(34, 4) + 0.5;                                              // across (to tm), then up the bank (to te)
  [[O, 1300, 1560], [F.crab, 1195, 1440], [F.turtle, 1090, 1380], [F.star, 985, 1320]].forEach(([A, x1, x2], i) => {
    moveTo(S, A, t0 + i * 0.9, tm - t0 - i * 0.9, x1, DECK); moveTo(S, A, tm, te - tm, x2, surf(x2));
  });
  O.bob(t0, te, 8); [F.crab, F.turtle, F.star].forEach((A) => A.dance(t0 + 0.9, te));
  [31, 32, 33, 34].forEach((c) => sing(O.sing, c));
  view(S, 900, 600, 1.3, S.start + 4.2); view(S, 1250, 620, 1.3, S.start + 9.4); view(S, 1500, 560, 1.7, tm - 0.6);
  done(S); }

// 14  outro on the beach: everyone waves bye-bye, hearts, the channel name
{ const S = scene(B[13], B[14], { cam: "none" });
  bridgeSet(S, { posts: true, slabs: true, shells: true, heaps: true });
  const O = place(S, ollie, 1600, 535, 0.62, { mouth: "grin", look: 0 });
  const C = place(S, crab, 1440, 595, 0.36), Bi = wBibi(S, S.start, { at: [1830, 500], k: 0.6 });
  wave2(O, S.start + 0.6, S.end - 0.4); O.bob(S.start + 0.4, S.end - 0.3, 6); C.dance(S.start, S.end);
  sing(O.sing, 35);
  hearts(S, S.start + 0.6, [[1480, 330, 1], [1680, 230, 1.1], [1560, 170, 0.9]]);
  view(S, 1520, 560, 1.4, S.start, 0.01); wide(S, S.end - 2.8);                                                  // tight on the hug, then out for the end card
  S.fadeOut(DS.card(S, "BYE-BYE!", 1250, 330, { size: DS.type.title, t: S.start + 0.8 }).g, S.end - 3.0, 0.4);
  S.text("Tiny Tune Town", 960, 140, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.end - 2.0 });
  done(S); }
