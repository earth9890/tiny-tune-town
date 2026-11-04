// look: still
// @include ../../tools/cast.js
// @include ../../tools/family.js
// 77 Hot Cross Buns (PD 1916 / 1798 street cry, new verses). Nomi bakes buns with the Hummingtons in a sunny kitchen.
// Sections are found from the SUNG lines (TIMING.words), so a re-sung take re-times everything: chorus x3 ("Hot cross buns"),
// verses mix (Mum) -> roll (Nana) -> cross (Kofi) -> bake (Mum, oven) -> share (Dad, Mango). Every section: wide/medium -> face close-up
// on the tag lines -> back to wide in the break. Shots >= 4 s, 0.6 s crossfades, nothing flashes.
TOON = 2;
BEAT = 60 / 96;
const NL = Math.max(...TIMING.words.map((w) => w[0]));
const TXT = Array.from({ length: NL + 1 }, (_, c) => TIMING.words.filter((w) => w[0] === c).map((w) => w[2]).join(" ").toLowerCase());
const CS = (c) => CLIP(c)[0], CE = (c) => CLIP(c)[1];
const find = (re, from = 1) => { for (let c = from; c <= NL; c++) if (re.test(TXT[c])) return c; return 0; };
const wi = (c, re) => Math.max(0, TXT[c].split(" ").findIndex((w) => re.test(w)));
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const view = (S, x, y, k, t, dur = 1.4) => (x = clamp(x, 960 / k - 150, 2070 - 960 / k), y = clamp(y, 540 / k - 150, 1230 - 540 / k), k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const sing = (F, c) => TIMING.words.filter((w) => w[0] === c).forEach((w) => F.sing(Math.max(w[3] - 0.05, 0), w[3] + 0.6 * (w[4] - w[3])));
const done = (S, sun = [1500, 120]) => { DS.vignette(S, 0.1); grade(S, sun, 0.8); };

// ---------- sections from the sung lines ----------
const SEC = []; // [kind, first clip, n lines]
for (let c = 1; c <= NL; c++) {
  const t = TXT[c], kind = /hot cross/.test(t) ? "chorus" : /^mix/.test(t) ? "mix" : /^roll|rolls a/.test(t) ? "roll" : /cross on|make a/.test(t) ? "cross" : /bakes|warm and hot/.test(t) ? "bake" : /for daddy|one for/.test(t) && !/penny/.test(t) ? "share" : null;
  if (kind && (!SEC.length || SEC[SEC.length - 1][0] !== kind || c - SEC[SEC.length - 1][1] >= 4)) SEC.push([kind, c, 0]);
}
SEC.forEach((s, i) => (s[2] = (i + 1 < SEC.length ? SEC[i + 1][1] : find(/bye/, s[1]) || NL + 1) - s[1]));

// ---------- the kitchen ----------
const FLOOR = 1080, TOP = 770; // the counter top; people stand behind it (Nomi on a step stool)
const kitchen = (S, o = {}) => {
  const R = DS.room(S, { wall: "wall", floor: "floor", window: [520, 170, 300, 280] }), g = R.g;
  for (let x = 360; x < 1560; x += 60) S.fill(rect(x, 520, 30, 240), S.start, 0, DS.c("wall", 2), 0.25, g); // tiled splashback
  [[880, 130, 300], [1210, 130, 300]].forEach(([x, y, w]) => { toon(S, rrect(x, y, w, 190, DS.r.md), "pink", { parent: g, flat: true, tone: 1, w: "mid" }); toon(S, circ(x + w / 2, y + 150, 12), "white", { parent: g, flat: true, w: "detail" }); });
  toon(S, rrect(560, 470, 210, 26, DS.r.sm), "white", { parent: g, flat: true, w: "detail" }); // window sill + a little plant
  toon(S, rrect(620, 410, 70, 64, DS.r.sm), "orange", { parent: g, flat: true, w: "mid" }); [[-30, -40], [0, -60], [30, -38]].forEach(([dx, dy]) => S.fill(circ(655 + dx, 410 + dy, 26, 20), S.start, 0, DS.c("green", 1), 1, g));
  [[1620, 300], [1720, 250], [1820, 320]].forEach(([x, y]) => { S.draw(`M${x} 90 V${y - 40}`, S.start, 0, { c: DS.c("wood", 2), w: DS.w.mid, parent: g }); toon(S, circ(x, y, 46), "red", { parent: g, w: "mid" }); }); // hanging pans
  if (o.oven) { toon(S, rrect(1460, 300, 380, 470, DS.r.lg), "gray", { parent: g, w: "mid" }); toon(S, rrect(1500, 420, 300, 230, DS.r.md), "navy", { parent: g, flat: true, w: "mid" });
    [1540, 1600, 1660].forEach((x) => toon(S, circ(x, 350, 14), "white", { parent: g, flat: true, w: "detail" })); }
  return g;
};
const counter = (S) => { const g = S.grp(); toon(S, rrect(-80, TOP + 20, 2080, 420, DS.r.md), "wood", { parent: g, dir: "v" }); toon(S, rrect(-80, TOP - 6, 2080, 46, DS.r.md), "white", { parent: g });
  [260, 760, 1260, 1760].forEach((x) => toon(S, rrect(x - 150, TOP + 90, 300, 230, DS.r.md), "wood", { parent: g, flat: true, tone: 1, w: "mid" })); return g; };
const table = (S) => { const g = S.grp(); toon(S, rrect(-80, TOP + 10, 2080, 420, DS.r.lg), "red", { parent: g, flat: true, tone: 1 });
  for (let x = -40; x < 2000; x += 80) S.fill(rect(x, TOP + 30, 40, 400), S.start, 0, DS.P.white[0], 0.35, g); toon(S, rrect(-80, TOP - 8, 2080, 40, DS.r.md), "white", { parent: g }); return g; };

// ---------- props ----------
const bun = (S, x, y, r, o = {}) => { const g = G(S, o.parent, `translate(${x} ${y})`);
  toon(S, circ(0, 0, r, r * 0.8), o.raw ? "sand" : "gold", { parent: g, lw: DS.w.mid * 2 }); S.fill(circ(-r * 0.35, -r * 0.4, r * 0.32, r * 0.14), S.start, 0, DS.P.white[0], 0.45, g);
  if (o.cross !== false) { const c = G(S, g); S.draw(`M${-r * 0.55} ${-r * 0.1} Q0 ${-r * 0.22} ${r * 0.55} ${-r * 0.1} M${-r * 0.08} ${-r * 0.62} Q${-r * 0.04} 0 0 ${r * 0.6}`, S.start, 0, { c: DS.P.white[0], w: r * 0.2, parent: c });
    if (o.crossT) { c.setAttribute("opacity", 0); tl.to(c, { opacity: 1, duration: 0.3 }, o.crossT); } }
  if (o.t) fadeIn(S, g, o.t); return g; };
const tray = (S, x, y, w, parent) => toon(S, rrect(x - w / 2, y - 18, w, 36, DS.r.sm), "gray", { parent, w: "mid" });
const bowl = (S, x, y, k = 1) => { const g = G(S, null, `translate(${x} ${y}) scale(${k})`);
  toon(S, circ(0, -60, 150, 34), "sand", { parent: g, flat: true, w: "mid" }); toon(S, "M-160 -60 Q-150 60 0 70 Q150 60 160 -60 Z", "sky", { parent: g, dir: "v" });
  S.draw("M-120 0 Q0 30 120 0", S.start, 0, { c: DS.P.white[0], w: DS.w.near, parent: g, op: 0.6 }); return g; };
const spoon = (S, x, y, t0, t1) => { const g = G(S, null, `rotate(-12 ${x} ${y + 40})`); toon(S, cap(x, y - 190, x, y + 20, 14), "wood", { parent: g, w: "mid" }); toon(S, circ(x, y + 30, 30, 22), "wood", { parent: g, w: "mid" });
  tw(g, t0, t1 - t0, `rotate(-12 ${x} ${y + 40})`, `rotate(12 ${x} ${y + 40})`, wave(cyc(t1 - t0, 2 * BEAT))); return g; };
const puff = (S, x, y, t) => { const g = G(S, null, "translate(0 0)"); [[0, 0, 40], [-46, 16, 28], [44, 12, 30], [0, -34, 26]].forEach(([dx, dy, r]) => S.fill(circ(x + dx, y + dy, r), S.start, 0, DS.P.white[0], 0.85, g));
  g.setAttribute("opacity", 0); tl.to(g, { opacity: 1, duration: 0.3 }, t); tw(g, t, 1.6, "translate(0 0)", "translate(0 -90)", "power1.out"); tl.to(g, { opacity: 0, duration: 0.8 }, t + 0.8); };
const coin = (S, n, x, y, t) => { const [o, g] = popIn(S, t, x, y); toon(S, circ(x, y, 70), "gold", { parent: g }); S.draw(circ(x, y, 52), S.start, 0, { c: DS.c("gold", 2), w: DS.w.mid, parent: g }); S.text(String(n), x, y + 26, { size: DS.type.title, c: DS.c("gold", 2), parent: g }); return o; };
const steam = (S, x, y, t0, t1) => [0, 1, 2].forEach((i) => { const g = G(S, null, "translate(0 0)"); S.draw(`M${x + i * 60} ${y} q-24 -40 0 -80 q24 -40 0 -80`, S.start, 0, { c: DS.P.white[0], w: DS.w.near * 1.6, parent: g, op: 0.7 });
  g.setAttribute("opacity", 0); tl.to(g, { opacity: 1, duration: 0.5 }, t0 + i * 0.3); tw(g, t0 + i * 0.3, t1 - t0, "translate(0 0)", "translate(0 -60)", "sine.inOut"); tl.to(g, { opacity: 0, duration: 0.6 }, t1 - 0.6); });

// ---------- cast (same k for everyone = true scale; Nomi stands on a step stool behind the counter) ----------
const KK = 0.8, NX = 1120, NGY = 900;
const nomi = (S, x = NX, o = {}) => { const N = toddler(S, x, NGY, KK, Object.assign({ mood: "happy" }, o)); N.groove(S.start + 0.3, S.end - 0.2, 8, 2.5); return N; };
const adult = (S, fn, x, o = {}) => { const A = fn(S, x, FLOOR, KK, Object.assign({ mood: "happy", sleeves: 0.45 }, o)); A.groove(S.start + 0.3, S.end - 0.2, 6, 1.5); return A; };
const kofi = (S, x, o = {}) => { const B = sibling(S, x, FLOOR - 20, KK, Object.assign({ mood: "happy" }, o)); B.groove(S.start + 0.3, S.end - 0.2, 8, 2.5); return B; };
const mango = (S, x, gy = 760, k = 0.62) => { const C = kitty(S, x, gy, k); C.wag(S.start + 0.3, S.end - 0.2); return C; };
const cards = (S, c, re, xs, y, list) => list.forEach((n, j) => { const t = W(c, wi(c, re) + j); S.fadeOut(num(S, n, xs[j], y, t).g, Math.min(t + 2.4, S.end - 0.5), 0.4); });

// ---------- timeline ----------
const B0 = SEC.map((s) => CS(s[1]) - 0.5), BYE = find(/bye/, SEC.length ? SEC[SEC.length - 1][1] : 1);
const lastEnd = SEC.length ? CE(SEC[SEC.length - 1][1] + SEC[SEC.length - 1][2] - 1) + 0.6 : TOTAL - 6;
const ENDCARD = Math.min(TOTAL - 4.5, Math.max(lastEnd, TOTAL - 8));
// intro: wide kitchen, Nomi and Mum wave hello, flour on the counter
{ const S = scene(0, B0[0] ?? ENDCARD, {}), bg = kitchen(S); const M = adult(S, mum, 640), N = nomi(S);
  N.wave(1.2, Math.min(4.5, S.end - 1)); M.wave(1.6, Math.min(4.5, S.end - 1), -1); N.expr("giggle", 1.2); N.expr("happy", 4.6);
  counter(S); bowl(S, 860, TOP - 10, 0.9); const fl = G(S); toon(S, rrect(1380, 560, 190, 230, DS.r.lg), "white", { parent: fl }); S.text("FLOUR", 1475, 700, { size: DS.type.caption, c: DS.c("wood", 2), parent: fl });
  puff(S, 1470, 540, Math.max(1, S.end - 4));
  view(S, 900, 520, 1.15, 0.2, Math.max(1.5, S.len - 1)); done(S); }
SEC.forEach(([kind, c, n], i) => {
  const a = B0[i], b = i + 1 < SEC.length ? B0[i + 1] : ENDCARD, S = scene(a, b, {}), L = (j) => Math.min(c + j, c + n - 1);
  const tagAt = CS(L(2)) - 0.6, back = CE(L(3)) + 0.4, brk = b - back > 4.6;
  if (kind === "chorus") {
    const all = i === SEC.length - 1, bg = all ? kitchen(S) : kitchen(S);
    if (all) { adult(S, gran, 260); adult(S, dad, 560); kofi(S, 1500); adult(S, mum, 1760); }
    else { adult(S, mum, 620); if (i > 1) adult(S, gran, 300); }
    const N = nomi(S, all ? 1060 : NX); for (let j = 0; j < n; j++) sing(N, c + j);
    all ? table(S) : counter(S);
    const tr = G(S); tray(S, all ? 1060 : 1500, TOP - 30, 380, tr); [-120, 0, 120].forEach((dx, j) => bun(S, (all ? 1060 : 1500) + dx, TOP - 70, 58, { parent: tr, raw: !all && i === 0, cross: all || i > 0 }));
    if (all) mango(S, 1290, TOP - 20, 0.5);
    if (/penny/.test(TXT[L(1)])) { coin(S, 1, all ? 830 : 1360, all ? 190 : 400, W(L(1), 0)); coin(S, 2, all ? 1000 : 1500, all ? 190 : 400, W(L(1), wi(L(1), /two/))); }
    if (all) { N.expr("giggle", CS(L(3))); hearts(S, CS(L(3)) + 0.3, [[760, 380, 1], [1360, 360, 1]]); }
    view(S, ...N.face, 2.1, a + 0.2, 1.4); dof(S, bg, a + 0.2, 9, 1.4);                 // hook: face close-up on "Hot cross buns!"
    view(S, all ? 960 : 1200, 520, all ? 1 : 1.35, CS(L(2)) - 0.5, 1.4); dof(S, bg, CS(L(2)) - 0.5, all ? 0 : 5, 1.4);
    if (brk) { view(S, 960, 540, 1, back, 1.4); dof(S, bg, back, 0, 1.4); }
    if (all && b - back > 2) S.text("Yum!", 960, 260, { size: DS.type.display, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: back + 0.3 });
    done(S); return;
  }
  const oven = kind === "bake", bg = kind === "share" ? kitchen(S) : kitchen(S, { oven });
  let N, H;
  if (kind === "mix") { H = adult(S, mum, 640); N = nomi(S); }
  if (kind === "roll") { H = adult(S, gran, 640); N = nomi(S); }
  if (kind === "cross") { adult(S, gran, 300); N = nomi(S, 900); H = kofi(S, 1420, { mood: "giggle" }); }
  if (kind === "bake") { N = nomi(S, 760); H = adult(S, mum, 1240); }
  if (kind === "share") { H = adult(S, dad, 1380); N = nomi(S, 820); }
  for (let j = 0; j < n; j++) sing(N, c + j);
  kind === "share" ? table(S) : counter(S);
  if (kind === "mix") { bowl(S, 900, TOP - 10); spoon(S, 900, TOP - 120, CS(c), CE(L(1))); N.arm(-1, 70, CS(c) - 0.4, 0.5); N.arm(-1, 16, CE(L(1)), 0.5); H.arm(1, 40, CS(c), 0.5);
    cards(S, c, /one/, [1380, 1560, 1740], 220, [1, 2, 3]); puff(S, 900, TOP - 160, W(c, 0)); puff(S, 940, TOP - 160, W(L(1), 0)); }
  if (kind === "roll") { const tr = G(S); tray(S, 1480, TOP - 30, 420, tr); [-140, -46, 46, 140].forEach((dx, j) => bun(S, 1480 + dx, TOP - 66, 48, { parent: tr, raw: true, cross: false, t: W(c, Math.min(j, 3)) + 0.1 }));
    toon(S, cap(780, TOP - 40, 1000, TOP - 40, 22), "wood", { w: "mid" }); bun(S, 890, TOP - 92, 52, { raw: true, cross: false }); H.arm(1, 45, CS(c), 0.5); }
  if (kind === "cross") { const tr = G(S); tray(S, 1140, TOP - 30, 520, tr); [-180, -60, 60, 180].forEach((dx, j) => bun(S, 1140 + dx, TOP - 70, 56, { parent: tr, raw: true, crossT: CS(c) + 0.5 + j * 2 * BEAT }));
    H.arm(-1, 60, CS(c), 0.5); H.hop(W(L(1), wi(L(1), /fun/)), 40); H.expr("giggle", CS(L(1))); }
  if (kind === "bake") { const tr = G(S, null, "translate(0 0)"); tray(S, 1050, TOP - 30, 420, tr); [-120, 0, 120].forEach((dx) => bun(S, 1050 + dx, TOP - 70, 54, { parent: tr }));
    tw(tr, CS(c) + 0.2, 1.4, "translate(0 0)", "translate(560 -120)", "power2.inOut"); tl.to(tr, { opacity: 0, duration: 0.5 }, CS(c) + 1.1); // into the oven (Mum does the oven)
    const glowE = S.fill(rrect(1500, 420, 300, 230, DS.r.md), S.start, 0, DS.c("orange", 1), 1, bg); glowE.setAttribute("opacity", 0); tl.to(glowE, { opacity: 0.85, duration: 1.2 }, CS(c) + 1.4);
    steam(S, 1580, 290, W(c, wi(c, /warm/)), b - 0.4); H.arm(1, 60, CS(c), 0.6); H.arm(1, 20, CS(c) + 1.8, 0.6);
    const out = G(S); tray(S, 1050, TOP - 30, 520, out); [-180, -60, 60, 180].forEach((dx) => bun(S, 1050 + dx, TOP - 72, 58, { parent: out })); [-120, 0, 120].forEach((dx) => bun(S, 1050 + dx, TOP - 132, 54, { parent: out }));
    out.setAttribute("opacity", 0); tl.to(out, { opacity: 1, duration: 0.5 }, CS(L(1)) - 0.3); N.expr("oh", CS(L(1))); N.expr("happy", CE(L(1))); }
  if (kind === "share") { const C = mango(S, 1660, TOP - 20, 0.6), plate = G(S); toon(S, circ(1120, TOP - 30, 220, 40), "white", { parent: plate }); [-100, 0, 100].forEach((dx) => bun(S, 1120 + dx, TOP - 70, 50, { parent: plate }));
    const give = (x, y, t) => { const g = G(S, null, "translate(0 0)"); bun(S, 1120, TOP - 120, 50, { parent: g }); g.setAttribute("opacity", 0); tl.to(g, { opacity: 1, duration: 0.3 }, t - 0.3); tw(g, t, 1.1, "translate(0 0)", `translate(${x - 1120} ${y - TOP + 120})`); };
    give(1330, TOP - 70, W(c, wi(c, /daddy/))); give(1000, 640, W(c, wi(c, /you/))); give(1560, TOP - 60, W(L(1), wi(L(1), /mango|kitty/))); C.hop(W(L(1), wi(L(1), /mango|kitty/)) + 1, 30);
    H.expr("giggle", W(c, wi(c, /daddy/)) + 1); N.arm(1, 80, W(c, 0) - 0.3, 0.5); N.arm(1, 16, CE(L(1)), 0.5); }
  view(S, oven ? 1200 : 960, 500, oven ? 1.25 : 1.2, a + 0.2, 1.4); dof(S, bg, a + 0.2, 4, 1.4);             // the action, medium
  view(S, ...N.face, 2.1, tagAt, 1.3); dof(S, bg, tagAt, 9, 1.3);                                          // tag line: face close-up
  if (brk) { view(S, 960, 540, 1, back, 1.4); dof(S, bg, back, 0, 1.4); if (i % 2 === 0) fgFrame(S, 1880, 1180, 0.6, { flip: true, flower: "orange" }); }
  done(S);
});
// end card: the family waves, the brand title
{ const S = scene(ENDCARD, TOTAL, {}), bg = kitchen(S); adult(S, gran, 300); adult(S, dad, 600); const N = nomi(S, 1000); kofi(S, 1380); adult(S, mum, 1700);
  table(S); N.wave(S.start + 0.4, TOTAL - 0.6); N.expr("giggle", S.start + 0.4);
  if (BYE) sing(N, BYE);
  S.text("Tiny Tune Town", 960, 900, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.start + 0.6 }); done(S); }
