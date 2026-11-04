// look: still
// @include ../../tools/cast.js
// @include ../../tools/family.js
// 80 Good Morning Song (original). Nomi wakes up and says good morning to the Hummingtons, one each pass: Mummy opens the curtains
// (bedroom), Daddy makes pancakes and Nana brings toast (kitchen), Kofi and Mango in the sunny garden. Every pass: "Good morning, X,
// hello!" = X waves (medium on X), "Wake up, here we go" = Nomi hops, "Stretch up high" = everyone stretches, "A brand new day of
// fun!" = Nomi's face close-up. Chorus x3 = "Good morning" close-up, then the sun. Sections come from the SUNG lines (TIMING.words).
TOON = 2;
BEAT = 60 / 98;
const NL = Math.max(...TIMING.words.map((w) => w[0]));
const TXT = Array.from({ length: NL + 1 }, (_, c) => TIMING.words.filter((w) => w[0] === c).map((w) => w[2]).join(" ").toLowerCase());
const CS = (c) => CLIP(c)[0], CE = (c) => CLIP(c)[1];
const find = (re, from = 1) => { for (let c = from; c <= NL; c++) if (re.test(TXT[c])) return c; return 0; };
const wi = (c, re) => Math.max(0, TXT[c].split(" ").findIndex((w) => re.test(w)));
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const view = (S, x, y, k, t, dur = 1.4) => (x = clamp(x, 960 / k - 150, 2070 - 960 / k), y = clamp(y, 540 / k - 150, 1230 - 540 / k), k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const sing = (F, c) => TIMING.words.filter((w) => w[0] === c).forEach((w) => F.sing(Math.max(w[3] - 0.05, 0), w[3] + 0.6 * (w[4] - w[3])));
const done = (S, sun = [1500, 120]) => { DS.vignette(S, 0.1); grade(S, sun, 0.9); };

// ---------- sections from the sung lines ----------
const WHO = { mummy: "mum", mum: "mum", daddy: "dad", dad: "dad", nana: "nana", kofi: "kofi", mango: "mango" };
const SEC = []; // [kind, first clip, n lines]
for (let c = 1; c <= NL; c++) {
  const t = TXT[c], m = t.match(/good morning,? (mummy|mum|daddy|dad|nana|kofi|mango)/), kind = m ? WHO[m[1]] : /^good morning,? hello/.test(t) ? "mum" : /good morning,? good morning|morning to you/.test(t) ? "chorus" : null;
  if (kind && (!SEC.length || SEC[SEC.length - 1][0] !== kind || c - SEC[SEC.length - 1][1] >= 4)) SEC.push([kind, c, 0]);
}
SEC.forEach((s, i) => (s[2] = (i + 1 < SEC.length ? SEC[i + 1][1] : find(/bye/, s[1]) || NL + 1) - s[1]));

// ---------- sets ----------
const FLOOR = 1040;
const bedroom = (S, o = {}) => { const R = DS.room(S, { wall: "pink", floor: "wood", window: false }), g = R.g;
  toon(S, rrect(1080, 150, 420, 380, DS.r.sm), "white", { parent: g, w: "mid" }); const sky = S.fill(rect(1100, 170, 380, 340), S.start, 0, DS.vgrad(DS.P.sky[0], DS.P.sky[1]), 1, g);
  const sun = G(S, g, "translate(0 0)"); S.fill(circ(1300, 340, 120), S.start, 0, DS.glow(DS.P.yellow[1], 0.8), 1, sun); toon(S, circ(1300, 340, 56), "yellow", { parent: sun, flat: true, tone: 1 });
  if (o.rise) tw(sun, S.start, o.rise, "translate(0 140)", "translate(0 0)", "power1.out");
  S.draw("M1290 170 V510 M1100 340 H1480", S.start, 0, { c: DS.P.white[0], w: DS.w.near * 1.5, parent: g });
  S.fill("M1080 600 L1500 600 L1760 1080 L900 1080 Z", S.start, 0, DS.P.yellow[1], 0.18, g); // morning light patch
  toon(S, rrect(420, 200, 220, 160, DS.r.sm), "yellow", { parent: g, flat: true, tone: 1, w: "mid" }); twinkle(S, 530, 280, 30, g);
  return g; };
const curtains = (S, open) => { const g = S.grp(); [-1, 1].forEach((s) => { const c = G(S, g, "translate(0 0)"); toon(S, rrect(s < 0 ? 1050 : 1290, 130, 240, 440, DS.r.md), "purple", { parent: c, dir: "v" });
  [0, 1, 2].forEach((j) => S.draw(`M${(s < 0 ? 1100 : 1340) + j * 60} 160 V540`, S.start, 0, { c: DS.c("purple", 2), w: DS.w.mid, parent: c, op: 0.6 }));
  if (open === true) c.setAttribute("transform", `translate(${s * 230} 0)`); else if (open) tw(c, open, 1.6, "translate(0 0)", `translate(${s * 230} 0)`, "power2.inOut"); }); return g; };
const bed = (S, x) => { const g = S.grp(); toon(S, rrect(x - 380, 520, 760, 380, DS.r.lg), "wood", { parent: g }); return g; };
const duvet = (S, x, top) => { const g = G(S, null, "translate(0 0)"); toon(S, rrect(x - 420, top, 840, 1200 - top, DS.r.lg), "sky", { parent: g, dir: "v" }); [0, 1, 2, 3, 4, 5].forEach((i) => toon(S, circ(x - 300 + i * 120, top + 120 + (i % 2) * 70, 26), "yellow", { parent: g, flat: true, tone: 1, w: "detail" })); return g; };
const kitchen = (S) => { const R = DS.room(S, { wall: "wall", floor: "floor", window: [520, 170, 300, 280] }), g = R.g;
  for (let x = 360; x < 1560; x += 60) S.fill(rect(x, 520, 30, 240), S.start, 0, DS.c("wall", 2), 0.25, g);
  [[880, 130, 300], [1210, 130, 300]].forEach(([x, y, w]) => { toon(S, rrect(x, y, w, 190, DS.r.md), "sky", { parent: g, flat: true, tone: 1, w: "mid" }); toon(S, circ(x + w / 2, y + 150, 12), "white", { parent: g, flat: true, w: "detail" }); });
  [[1620, 300], [1720, 250], [1820, 320]].forEach(([x, y]) => { S.draw(`M${x} 90 V${y - 40}`, S.start, 0, { c: DS.c("wood", 2), w: DS.w.mid, parent: g }); toon(S, circ(x, y, 46), "red", { parent: g, w: "mid" }); }); return g; };
const TOP = 770;
const counter = (S) => { const g = S.grp(); toon(S, rrect(-80, TOP + 20, 2080, 420, DS.r.md), "wood", { parent: g, dir: "v" }); toon(S, rrect(-80, TOP - 6, 2080, 46, DS.r.md), "white", { parent: g });
  [260, 760, 1260, 1760].forEach((x) => toon(S, rrect(x - 150, TOP + 90, 300, 230, DS.r.md), "wood", { parent: g, flat: true, tone: 1, w: "mid" })); return g; };
const garden = (S) => { const W0 = DS.outdoor(S, { hy: 640, sun: [1560, 160], sky: "sky", ground: "grass", hills: "green", path: [700, 1220] }), g = W0.g;
  toon(S, rrect(80, 330, 420, 330, DS.r.sm), "wall", { parent: g, flat: true, layer: "mid", w: "mid" }); toon(S, "M40 340 L290 160 L540 340 Z", "red", { parent: g, flat: true, layer: "mid", w: "mid" });
  toon(S, rrect(250, 480, 90, 180, DS.r.xs), "wood", { parent: g, flat: true, layer: "mid", w: "detail" });
  for (let x = 1250; x < 1960; x += 70) toon(S, rrect(x, 520, 46, 150, DS.r.sm), "white", { parent: g, flat: true, layer: "mid", w: "detail" });
  [[140, "pink"], [700, "yellow"], [1220, "red"], [1820, "purple"]].forEach(([x, c]) => { S.draw(`M${x} 1000 V952`, S.start, 0, { c: DS.c("green", 2, "mid"), w: DS.w.mid, parent: g }); S.fill(circ(x, 940, 22), S.start, 0, DS.c(c, 0, "mid"), 1, g); });
  return g; };
// props
const pan = (S, x, y, t0, t1) => { const g = S.grp(); toon(S, cap(x + 120, y, x + 300, y + 10, 16), "brown", { parent: g, w: "mid" }); toon(S, circ(x, y, 130, 34), "gray", { parent: g });
  const pc = G(S, g, "translate(0 0)"); toon(S, circ(x, y - 20, 90, 24), "gold", { parent: pc, lw: DS.w.mid * 2 }); tw(pc, t0, t1 - t0, "translate(0 0)", "translate(0 -150)", hump(cyc(t1 - t0, 4 * BEAT))); return g; };
const toast = (S, x, y, parent) => { const g = G(S, parent); toon(S, "M-60 60 V-20 Q-80 -60 -40 -70 Q0 -90 40 -70 Q80 -60 60 -20 V60 Z", "gold", { parent: g, lw: DS.w.mid * 2 }); S.fill(rrect(-40, -40, 80, 86, DS.r.sm), S.start, 0, DS.c("sand", 1), 1, g); g.setAttribute("transform", `translate(${x} ${y})`); return g; };
const plate = (S, x, y) => { const g = S.grp(); toon(S, circ(x, y, 170, 34), "white", { parent: g }); return g; };

// ---------- cast ----------
const PJ = { pj: true }, idle = (F, S, amp = 7, deg = 2) => F.groove(S.start + 0.3, S.end - 0.2, amp, deg);
const stretch = (Fs, t0, t1) => Fs.forEach((F) => { F.arm(-1, 155, t0, 0.6); F.arm(1, 155, t0, 0.6); F.arm(-1, 16, t1, 0.6); F.arm(1, 16, t1, 0.6); });

// ---------- timeline ----------
const B0 = SEC.map((s) => CS(s[1]) - 0.5), BYE = find(/bye/, SEC.length ? SEC[SEC.length - 1][1] : 1);
const lastEnd = SEC.length ? CE(SEC[SEC.length - 1][1] + SEC[SEC.length - 1][2] - 1) + 0.6 : TOTAL - 6;
const ENDCARD = Math.min(TOTAL - 4.5, Math.max(lastEnd, TOTAL - 8));
// intro: sunrise through the window, Nomi asleep in bed wakes up and stretches
{ const S = scene(0, B0[0] ?? ENDCARD, {}), bg = bedroom(S, { rise: Math.min(4, S.len - 1) }); curtains(S, 0.5); bed(S, 760);
  const N = toddler(S, 760, 1000, 0.9, Object.assign({ mood: "sleepy" }, PJ)); duvet(S, 760, 700); N.expr("oh", Math.min(3, S.end - 2)); N.expr("happy", Math.min(4.2, S.end - 1));
  N.arm(-1, 150, Math.min(4.4, S.end - 1.2), 0.6); N.arm(1, 150, Math.min(4.4, S.end - 1.2), 0.6);
  view(S, 960, 540, 1.1, 0.3, Math.max(2, S.len - 1)); done(S, [1300, 340]); }
SEC.forEach(([kind, c, n], i) => {
  const a = B0[i], b = i + 1 < SEC.length ? B0[i + 1] : ENDCARD, S = scene(a, b, {}), L = (j) => Math.min(c + j, c + n - 1);
  const mid = CS(L(2)) - 0.5, tag = CS(L(3)) - 0.6, back = CE(L(3)) + 0.4, brk = b - back > 4.6;
  let bg, N, X, all = [], sun = [1500, 140], focus;
  if (kind === "chorus") { const k = SEC.filter((s, j) => s[0] === "chorus" && j < i).length;
    if (k === 0) { bg = bedroom(S); curtains(S, true); const M = mum(S, 420, FLOOR, 0.66); idle(M, S, 4, 1); N = toddler(S, 1000, FLOOR + 10, 0.85, Object.assign({ mood: "happy" }, PJ)); sun = [1300, 340]; }
    else if (k === 1) { bg = kitchen(S); const D = dad(S, 520, 1080, 0.8, { sleeves: 0.45 }), M = mum(S, 1500, 1080, 0.8); [D, M].forEach((F) => idle(F, S, 5, 1.5)); N = toddler(S, 1020, 900, 0.8); counter(S);
      [700, 1020, 1340].forEach((x) => { toon(S, circ(x, TOP - 30, 100, 26), "white", {}); toon(S, circ(x, TOP - 52, 70, 20), "gold", { lw: DS.w.mid * 2 }); }); }
    else { bg = garden(S); const k2 = 0.62, gy = 1050; [[gran, 220], [dad, 520], [sibling, 1380], [mum, 1700]].forEach(([fn, x]) => { const F = fn(S, x, gy, k2); idle(F, S, 6, 2); all.push(F); });
      N = toddler(S, 960, gy + 10, 0.8); const C = kitty(S, 1140, gy + 20, 0.5); C.wag(S.start + 0.3, S.end - 0.2); all.forEach((F, j) => j && F.wave(CS(L(2)), CE(L(3)), j === 1 ? 1 : -1)); sun = [1560, 160]; }
    idle(N, S); for (let j = 0; j < n; j++) sing(N, c + j); N.wave(CS(L(2)), CE(L(2)), 1); N.expr("giggle", CS(L(3)));
    if (k === 2) hearts(S, CS(L(3)), [[700, 380, 1], [1260, 360, 1]]);
    view(S, ...N.face, 2.1, a + 0.2, 1.4); dof(S, bg, a + 0.2, 9, 1.4);              // hook: "Good morning, good morning" on Nomi's face
    view(S, 960, 500, k === 2 ? 1 : 1.2, mid, 1.4); dof(S, bg, mid, k === 2 ? 0 : 4, 1.4);
    if (brk) { view(S, 960, 540, 1, back, 1.4); dof(S, bg, back, 0, 1.4); }
    if (k === 2 && b - back > 2) S.text("Good morning!", 960, 250, { size: DS.type.display, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: back + 0.3 });
    done(S, sun); return;
  }
  if (kind === "mum") { bg = bedroom(S); curtains(S, W(c, 0) + 0.3); sun = [1300, 340]; X = mum(S, 1660, FLOOR, 0.66); N = toddler(S, 900, FLOOR + 10, 0.85, Object.assign({ mood: "happy" }, PJ)); focus = [1350, 420]; }
  if (kind === "dad") { bg = kitchen(S); X = dad(S, 640, 1080, 0.8, { sleeves: 0.45 }); N = toddler(S, 1200, 900, 0.8); counter(S); pan(S, 760, TOP - 40, CS(c), CE(L(1))); focus = [760, 400]; }
  if (kind === "nana") { bg = kitchen(S); X = gran(S, 1500, 1080, 0.8); N = toddler(S, 1000, 900, 0.8); counter(S); plate(S, 1260, TOP - 30);
    const tg = G(S, null, "translate(0 0)"); toast(S, 1220, TOP - 110, tg); toast(S, 1310, TOP - 100, tg); tw(tg, CS(c), 1.4, "translate(200 -60)", "translate(0 0)"); focus = [1350, 420]; }
  if (kind === "kofi") { bg = garden(S); X = sibling(S, 1450, 1050, 0.74); N = toddler(S, 1000, 1060, 0.8); const ball = G(S, null, "translate(0 0)"); toon(S, circ(1240, 990, 50), "red", { parent: ball }); S.draw("M1192 990 H1288 M1240 942 V1038", S.start, 0, { c: DS.P.white[0], w: DS.w.near, parent: ball });
    tw(ball, CS(L(1)), CE(L(1)) - CS(L(1)), "translate(0 0)", "translate(-160 0)", "sine.inOut"); focus = [1400, 520]; }
  if (kind === "mango") { bg = garden(S); X = kitty(S, 1320, 1000, 0.8); X.wag(S.start + 0.3, S.end - 0.2); N = toddler(S, 860, 1060, 0.8); const K2 = sibling(S, 420, 1040, 0.66); idle(K2, S, 6, 2); all.push(K2);
    tw(X.bob, W(c, 0) + 0.2, 2.4, "translate(0 0) scale(1 1)", "translate(0 30) scale(1.18 0.86)", hump(1)); focus = [1150, 680]; } // Mango's big morning stretch
  if (X && X.groove) idle(X, S, 5, 1.5); idle(N, S); for (let j = 0; j < n; j++) sing(N, c + j);
  if (X && X.wave) X.wave(W(c, wi(c, /hello/)) - 0.2, CE(c) + 0.6, kind === "mum" || kind === "nana" ? -1 : 1);
  N.wave(W(c, 0), CE(c), 1); N.hop(W(L(1), 0), 36); N.hop(W(L(1), 2), 36);
  stretch([N, ...(X && X.arm ? [X] : []), ...all], CS(L(2)), CE(L(2)) + 0.2); if (kind === "mango") X.hop(CS(L(2)) + 0.4, 40);
  N.expr("giggle", CS(L(3)));
  view(S, ...focus, kind === "mango" ? 1.15 : 1.35, a + 0.2, 1.4); dof(S, bg, a + 0.2, 5, 1.4);       // "Good morning, X": on X
  view(S, 960, 520, 1.05, mid, 1.4); dof(S, bg, mid, 0, 1.4);               // stretch: everyone
  if (CE(L(3)) - tag > 3.2 && tag - mid > 3.9) { view(S, ...N.face, 2.1, tag, 1.2); dof(S, bg, tag, 9, 1.2); } // "A brand new day of fun!" face
  if (brk) { view(S, 960, 540, 1, back, 1.4); dof(S, bg, back, 0, 1.4); if (i % 3 === 1) fgFrame(S, 60, 1180, 0.6, { flower: "pink" }); }
  done(S, sun);
});
{ const S = scene(ENDCARD, TOTAL, {}), bg = garden(S); [[gran, 220], [dad, 520], [sibling, 1380], [mum, 1700]].forEach(([fn, x], j) => { const F = fn(S, x, 1050, 0.62); idle(F, S, 5, 1.5); if (j) F.wave(S.start + 0.6, TOTAL - 0.6, j === 1 ? 1 : -1); });
  const N = toddler(S, 960, 1060, 0.8, { mood: "giggle" }); idle(N, S); N.wave(S.start + 0.4, TOTAL - 0.6, 1); if (BYE) sing(N, BYE); const C = kitty(S, 1140, 1070, 0.5); C.wag(S.start, TOTAL);
  S.text("Tiny Tune Town", 960, 250, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.start + 0.6 }); done(S, [1560, 160]); }
