// look: still
// @include ../../tools/cast.js
// @include ../../tools/family.js
// 78 Wee Willie Winkie (PD, William Miller 1841, new verses). Kofi plays Willie Winkie in his nightgown with a lantern; Nomi tags
// along as he checks who is asleep: Mango in the basket, Nana in her armchair, then Nomi in her own bed; Mum and Dad tuck Kofi in.
// Sections come from the SUNG lines (TIMING.words): town -> window (eight o'clock) -> Mango -> chorus -> Nana -> Nomi -> chorus -> town.
// Bedtime calm: slow 1.8-2.2 s moves, deep blue night with bright faces, soft lamp glows, no flashing (stars breathe over 3 s).
TOON = 2;
BEAT = 60 / 76;
const NL = Math.max(...TIMING.words.map((w) => w[0]));
const TXT = Array.from({ length: NL + 1 }, (_, c) => TIMING.words.filter((w) => w[0] === c).map((w) => w[2]).join(" ").toLowerCase());
const CS = (c) => CLIP(c)[0], CE = (c) => CLIP(c)[1];
const find = (re, from = 1) => { for (let c = from; c <= NL; c++) if (re.test(TXT[c])) return c; return 0; };
const wi = (c, re) => Math.max(0, TXT[c].split(" ").findIndex((w) => re.test(w)));
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const view = (S, x, y, k, t, dur = 2) => (x = clamp(x, 960 / k - 150, 2070 - 960 / k), y = clamp(y, 540 / k - 150, 1230 - 540 / k), k === 1 ? S.zoom(960, 540, 1, t, dur) : S.zoom((960 - k * x) / (1 - k), (540 - k * y) / (1 - k), k, t, dur));
const sing = (F, c) => TIMING.words.filter((w) => w[0] === c).forEach((w) => F.sing(Math.max(w[3] - 0.05, 0), w[3] + 0.6 * (w[4] - w[3])));
const done = (S, sun = [1500, 140], k = 0.6) => { DS.vignette(S, 0.12); grade(S, sun, k); };

// ---------- sections from the sung lines ----------
const SEC = [];
for (let c = 1; c <= NL; c++) {
  const t = TXT[c], nx = TXT[c + 1] || "";
  const kind = /night.?night|sleep tight/.test(t) ? "chorus" : /tapping|rapping|window/.test(t) ? "window" : /nomi.s in|cosy bed/.test(t) ? "nomi" : /winkie/.test(t) ? (/tiptoe|hall/.test(nx) ? "mango" : /peek|door/.test(nx) ? "nana" : /sleepy tune|sings/.test(nx) ? "nomi" : "town") : null;
  if (kind && (!SEC.length || SEC[SEC.length - 1][0] !== kind || c - SEC[SEC.length - 1][1] >= 4)) SEC.push([kind, c, 0]);
}
SEC.forEach((s, i) => (s[2] = (i + 1 < SEC.length ? SEC[i + 1][1] : find(/night!|goodnight|bye/, s[1] + 3) || NL + 1) - s[1]));

// ---------- night sets ----------
const sky = (S, o = {}) => { const W0 = DS.outdoor(S, { hy: o.hy || 700, sky: "night", ground: "green", hills: "navy", sun: false }), g = W0.g;
  toon(S, circ(1560, 190, 92), "yellow", { parent: g, flat: true, tone: 1 }); S.fill(circ(1560, 190, 260), S.start, 0, DS.glow(DS.P.yellow[1], 0.35), 1, g);
  S.fill(circ(1530, 175, 12), S.start, 0, DS.c("gold", 2), 0.8, g); S.fill(circ(1590, 175, 12), S.start, 0, DS.c("gold", 2), 0.8, g); S.draw("M1525 215 Q1560 245 1595 215", S.start, 0, { c: DS.c("gold", 2), w: DS.w.near, parent: g }); // smiling moon
  [[200, 130, 16], [420, 230, 11], [640, 110, 14], [880, 200, 10], [1120, 90, 15], [1300, 260, 10], [1780, 120, 13], [1860, 330, 9], [320, 360, 9], [1000, 330, 8]].forEach(([x, y, r], i) => {
    const s = G(S, g); twinkle(S, x, y, r * 1.6, s); s.setAttribute("opacity", 0.7); tl.fromTo(s, { opacity: 0.55 }, { opacity: 1, duration: 3 + (i % 3), ease: "sine.inOut", yoyo: true, repeat: Math.max(1, Math.floor(S.len / 3.5)) }, S.start + (i % 4) * 0.4); });
  return W0; };
const house = (S, x, gy, w, h, parent, lit = [1, 1, 1]) => { const g = G(S, parent); toon(S, rrect(x - w / 2, gy - h, w, h, DS.r.sm), "wall", { parent: g, flat: true, layer: "mid", w: "mid" });
  toon(S, `M${x - w / 2 - 40} ${gy - h + 10} L${x} ${gy - h - w * 0.45} L${x + w / 2 + 40} ${gy - h + 10} Z`, "red", { parent: g, flat: true, layer: "mid", w: "mid" });
  const win = [[x - w * 0.25, gy - h * 0.68], [x + w * 0.25, gy - h * 0.68], [x + w * 0.25, gy - h * 0.3]];
  win.forEach(([wx, wy], i) => toon(S, rrect(wx - w * 0.12, wy - w * 0.12, w * 0.24, w * 0.24, DS.r.xs), lit[i] ? "yellow" : "navy", { parent: g, flat: true, tone: 1, w: "detail" }));
  toon(S, rrect(x - w * 0.34, gy - h * 0.42, w * 0.18, h * 0.42, DS.r.xs), "wood", { parent: g, flat: true, layer: "mid", w: "detail" }); return { g, win }; };
const room = (S, o = {}) => { const R = DS.room(S, { wall: o.wall || "night", floor: "wood", window: o.window ?? [1240, 170, 300, 300] }), g = R.g;
  S.fill(rect(-200, -200, 2320, 1480), S.start, 0, DS.P.night[2], 0.25, g); // lights low for bedtime
  if (o.window !== false) { const [wx, wy, ww] = o.window || [1240, 170, 300]; S.fill(circ(wx + ww * 0.7, wy + 80, 40), S.start, 0, DS.c("yellow", 1), 1, g); twinkle(S, wx + 60, wy + 60, 16, g); twinkle(S, wx + 120, wy + 200, 12, g); }
  if (o.lamp) { const [lx, ly] = o.lamp; S.fill(circ(lx, ly, 320), S.start, 0, DS.glow(DS.P.yellow[1], 0.55), 1, g); toon(S, `M${lx - 70} ${ly + 30} L${lx - 40} ${ly - 60} L${lx + 40} ${ly - 60} L${lx + 70} ${ly + 30} Z`, "yellow", { parent: g, flat: true, tone: 1, w: "mid" });
    toon(S, rrect(lx - 10, ly + 30, 20, 220, DS.r.xs), "wood", { parent: g, flat: true, w: "detail" }); }
  return g; };
const bed = (S, x, gy, w, c = "sky") => { const g = S.grp(); toon(S, rrect(x - w / 2 - 30, gy - 560, w + 60, 380, DS.r.lg), "wood", { parent: g }); return g; };       // headboard: draw BEFORE the sleeper
const duvet = (S, x, top, w, c = "sky") => { const g = S.grp(); toon(S, rrect(x - w / 2, top, w, 1200 - top, DS.r.lg), c, { parent: g, dir: "v" });                   // duvet: draw AFTER the sleeper
  for (let i = 0; i < 9; i++) twinkle(S, x - w / 2 + 70 + ((i * 173) % (w - 140)), top + 70 + ((i * 97) % 220), 14, g); S.draw(`M${x - w / 2 + 20} ${top + 40} H${x + w / 2 - 20}`, S.start, 0, { c: DS.P.white[0], w: DS.w.near * 2, parent: g, op: 0.7 }); return g; };
const zzz = (S, x, y, t0, t1) => { for (let t = t0, i = 0; t < t1 - 1.2; t += 2.4, i++) { const g = G(S, null, "translate(0 0)"); S.text("z", x + (i % 2) * 20, y, { size: DS.type.title * (0.7 + 0.15 * (i % 3)), c: DS.P.white[0], halo: DS.P.navy[0], haloW: 0.1, parent: g });
  g.setAttribute("opacity", 0); tl.to(g, { opacity: 1, duration: 0.6 }, t); tw(g, t, 2.2, "translate(0 0)", "translate(40 -120)", "sine.out"); tl.to(g, { opacity: 0, duration: 0.6 }, t + 1.6); } };
const notes = (S, x, y, t0, t1) => { for (let t = t0, i = 0; t < t1 - 1.5; t += 2, i++) { const g = G(S, null, "translate(0 0)"), nx = x + (i % 3) * 30;
  S.fill(circ(nx, y, 18, 14), S.start, 0, DS.c("yellow", 1), 1, g); S.draw(`M${nx + 16} ${y} V${y - 60} q20 10 26 30`, S.start, 0, { c: DS.c("yellow", 1), w: DS.w.mid, parent: g });
  g.setAttribute("opacity", 0); tl.to(g, { opacity: 1, duration: 0.5 }, t); tw(g, t, 2.4, "translate(0 0)", `translate(${(i % 2 ? -1 : 1) * 60} -140)`, "sine.out"); tl.to(g, { opacity: 0, duration: 0.6 }, t + 1.8); } };
const clock8 = (S, x, y, r, t) => { const [o, g] = popIn(S, t, x, y); toon(S, circ(x, y, r), "white", { parent: g }); [0, 3, 6, 9].forEach((h) => { const a = h * Math.PI / 6; S.fill(circ(x + Math.sin(a) * r * 0.78, y - Math.cos(a) * r * 0.78, r * 0.06), S.start, 0, DS.c("navy", 0), 1, g); });
  S.draw(`M${x} ${y} L${x} ${y - r * 0.72}`, S.start, 0, { c: DS.c("navy", 0), w: r * 0.07, parent: g }); const a = 8 * Math.PI / 6; S.draw(`M${x} ${y} L${K(x + Math.sin(a) * r * 0.48)} ${K(y - Math.cos(a) * r * 0.48)}`, S.start, 0, { c: DS.c("red", 0), w: r * 0.1, parent: g });
  S.text("8", x, y + r + 80, { size: DS.type.display, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, parent: g }); return o; };
const lantern = (S, parent, x, y) => { const g = G(S, parent, `translate(${x} ${y})`); S.fill(circ(0, 60, 130), S.start, 0, DS.glow(DS.P.yellow[1], 0.6), 1, g); S.draw("M0 -30 V10", S.start, 0, { c: DS.c("gold", 2), w: DS.w.mid, parent: g });
  toon(S, rrect(-34, 10, 68, 96, DS.r.sm), "yellow", { parent: g, tone: 1 }); toon(S, rrect(-44, 0, 88, 20, DS.r.xs), "gold", { parent: g, flat: true, w: "detail" }); return g; };
// Mango asleep: soft lids over the cat's open eyes (cat eyes at local (+-36, -214), 16 x 20)
const mangoSleep = (S, x, gy, k) => { const C = kitty(S, x, gy, k); [-1, 1].forEach((s) => { S.fill(circ(x + s * 36 * k, gy - 214 * k, 19 * k, 23 * k), S.start, 0, DS.c("orange", 0), 1, C.bob); });
  C.bob.querySelectorAll("path"); [-1, 1].forEach((s) => S.draw(`M${K(s * 36 - 16)} -212 Q${s * 36} -198 ${K(s * 36 + 16)} -212`, S.start, 0, { c: LN("orange"), w: DS.w.near, parent: C.bob })); return C; };

// ---------- cast ----------
const NIGHT = { pj: true, barefoot: true };
const kofiW = (S, x, gy, k, o = {}) => { const B = sibling(S, x, gy, k, Object.assign({ mood: "happy" }, NIGHT, o)); B.arm(1, 34, S.start, 0.01); const [hx, hy] = B.hand(1); lantern(S, B.pos, (hx - x) / k + 10, (hy - gy) / k + 10); return B; };
const nomiN = (S, x, gy, k, o = {}) => toddler(S, x, gy, k, Object.assign({ mood: "happy" }, NIGHT, o));
const idle = (F, S, amp = 6, deg = 1.5) => F.groove(S.start + 0.3, S.end - 0.2, amp, deg);

// ---------- timeline ----------
const B0 = SEC.map((s) => CS(s[1]) - 0.6), GN = find(/goodnight|night!|bye/, SEC.length ? SEC[SEC.length - 1][1] + 3 : 1);
const lastEnd = SEC.length ? CE(SEC[SEC.length - 1][1] + SEC[SEC.length - 1][2] - 1) + 0.6 : TOTAL - 7;
const ENDCARD = Math.min(TOTAL - 5, Math.max(lastEnd, TOTAL - 9));
// intro: the town at bedtime, the moon smiles, Nomi at the lit window
{ const S = scene(0, B0[0] ?? ENDCARD, {}), W0 = sky(S); house(S, 360, 760, 360, 300, W0.g); house(S, 1600, 740, 300, 260, W0.g, [1, 0, 1]);
  house(S, 960, 800, 480, 420, W0.g); const B = kofiW(S, 700, 1040, 0.62); idle(B, S, 4, 1); const N = nomiN(S, 1180, 1040, 0.62); idle(N, S, 4, 1.5);
  N.wave(1.4, Math.min(5, S.end - 1), 1); N.expr("giggle", 1.4);
  view(S, 960, 560, 1.12, 0.3, Math.max(2, S.len - 1)); done(S, [1560, 190]); }
SEC.forEach(([kind, c, n], i) => {
  const a = B0[i], b = i + 1 < SEC.length ? B0[i + 1] : ENDCARD, S = scene(a, b, {}), L = (j) => Math.min(c + j, c + n - 1);
  const mid = CS(L(2)) - 0.8, back = CE(L(3)) + 0.4, brk = b - back > 5;
  let N, focus = [960, 540], bg;
  if (kind === "town") { const W0 = sky(S); bg = W0.g; house(S, 300, 740, 320, 280, bg); house(S, 1620, 740, 320, 260, bg, [1, 0, 1]); house(S, 960, 720, 260, 220, bg, [0, 1, 0]);
    const B = kofiW(S, 360, 1000, 0.62); B.walk(1180, CS(c) + 0.2, CE(L(1))); B.hop(CS(L(2)) + 0.3, 30); B.hop(CS(L(2)) + 1.6, 30); B.walk(1500, CS(L(3)), b - 0.6);
    N = nomiN(S, 1560, 1000, 0.62, { mood: "giggle" }); idle(N, S); N.wave(CS(L(1)), CE(L(1)), -1); focus = [900, 620];
    if (i === SEC.length - 1) N.expr("sleepy", CS(L(3))); }
  if (kind === "window") { const W0 = sky(S, { hy: 760 }); bg = W0.g; const H = G(S); toon(S, rrect(260, 120, 1400, 1100, DS.r.lg), "wall", { parent: H, flat: true });
    toon(S, rrect(820, 220, 620, 520, DS.r.md), "white", { parent: H }); S.fill(rrect(850, 250, 560, 460, DS.r.sm), S.start, 0, DS.c("yellow", 1), 1, H);
    N = nomiN(S, 1060, 1020, 0.95); idle(N, S, 5); const C = kitty(S, 1300, 760, 0.5); C.wag(S.start + 0.3, S.end - 0.2);
    const fr = S.grp(); S.fill(rect(780, 730, 700, 520), S.start, 0, DS.c("wall", 0), 1, fr); toon(S, rrect(800, 700, 660, 60, DS.r.sm), "white", { parent: fr }); // wall + sill in front of Nomi
    const B = kofiW(S, 520, 1100, 0.85); idle(B, S, 4, 1); B.arm(-1, 110, CS(c), 0.5); tw(B.arms[-1].wig, CS(c) + 0.5, 2.4, "rotate(0 0 0)", "rotate(-8 0 0)", wave(4));
    clock8(S, 1560, 230, 96, W(L(3), wi(L(3), /eight|8/))); N.expr("oh", W(L(2), 0)); N.expr("giggle", CE(L(3)) - 0.2); focus = [1060, 560]; }
  if (kind === "mango") { bg = room(S, { lamp: [1640, 520], window: [520, 170, 300, 300] }); const C = mangoSleep(S, 1220, 900, 0.75), bk = S.grp();
    toon(S, "M1000 820 Q1000 1000 1220 1010 Q1440 1000 1440 820 Z", "wood", { parent: bk, dir: "v" }); toon(S, rrect(990, 800, 460, 50, DS.r.md), "red", { parent: bk, tone: 1 });
    zzz(S, 1330, 640, CS(c) + 1, b);
    const B = kofiW(S, 300, 1060, 0.72); B.walk(640, CS(c), CE(L(1)) + 0.5, 8); N = nomiN(S, 120, 1060, 0.72); N.walk(420, CS(c) + 0.4, CE(L(1)) + 0.9, 8); N.expr("giggle", CS(L(3)));
    focus = [900, 640]; }
  if (kind === "nana") { bg = room(S, { wall: "purple", lamp: [400, 480], window: false }); DS.frame(S, 900, 200, 220, 160, "sky", "mid");
    toon(S, rrect(980, 420, 560, 520, DS.r.lg), "red", { parent: S.grp(), dir: "v" }); const Gr = gran(S, 1260, 1180, 0.78, { mood: "sleepy" }); const ch = S.grp(); toon(S, rrect(950, 790, 620, 420, DS.r.lg), "red", { parent: ch, tone: 1 }); [950, 1500].forEach((x) => toon(S, rrect(x - 30, 640, 130, 520, DS.r.lg), "red", { parent: ch }));
    zzz(S, 1440, 320, CS(c) + 0.6, b); tw(Gr.pos, S.start + 0.3, S.len - 0.5, "translate(1260 1180) scale(0.78)", "translate(1260 1172) scale(0.78)", hump(cyc(S.len, 3)));
    const B = kofiW(S, 320, 1060, 0.7); idle(B, S, 4, 1); N = nomiN(S, 560, 1060, 0.7, { mood: "giggle" }); idle(N, S); N.arm(1, 70, CS(L(2)), 0.6); focus = [900, 620]; }
  if (kind === "nomi") { bg = room(S, { wall: "pink", window: [1260, 160, 320, 300] }); bed(S, 860, 1080, 760);
    N = nomiN(S, 860, 1000, 0.95, { mood: "sleepy" }); duvet(S, 860, 690, 840, "sky");
    const B = kofiW(S, 1480, 1080, 0.72); idle(B, S, 4, 1); notes(S, 1520, 380, CS(c), b); N.expr("happy", CS(L(3))); N.expr("sleepy", CE(L(3)) + 0.4); focus = [960, 560]; }
  if (kind === "chorus") { const last = i === SEC.length - 1;
    if (!last) { const W0 = sky(S); bg = W0.g; const H = G(S); toon(S, rrect(-100, 360, 2120, 900, DS.r.lg), "wall", { parent: H, flat: true }); toon(S, rrect(560, 420, 800, 560, DS.r.md), "white", { parent: H });
      S.fill(rrect(590, 450, 740, 500, DS.r.sm), S.start, 0, DS.c("night", 1), 1, H); twinkle(S, 700, 520, 20, H); twinkle(S, 1200, 560, 16, H); S.fill(circ(1100, 560, 60), S.start, 0, DS.c("yellow", 1), 1, H);
      const B = kofiW(S, 760, 1180, 0.8); idle(B, S, 4, 1); N = nomiN(S, 1120, 1180, 0.8); idle(N, S, 4, 1.5); N.wave(CS(c), CE(c), 1);
      toon(S, rrect(540, 960, 840, 80, DS.r.sm), "white", { parent: S.grp() }); N.expr("sleepy", CS(L(2))); }
    else { bg = room(S, { wall: "night", window: [1260, 160, 300, 280] }); bed(S, 820, 1080, 760); N = nomiN(S, 1330, 1080, 0.62, { mood: "sleepy" }); idle(N, S, 3, 1);
      const B = sibling(S, 820, 1000, 0.95, Object.assign({ mood: "sleepy" }, NIGHT)); const M = mum(S, 300, 1100, 0.62), D = dad(S, 1640, 1100, 0.62); idle(M, S, 3, 1); idle(D, S, 3, 1);
      duvet(S, 820, 700, 840, "green"); hearts(S, CS(L(1)), [[600, 420, 1], [1120, 400, 1]]); M.arm(1, 60, CS(L(2)), 0.8); }
    for (let j = 0; j < n; j++) sing(N, c + j); }
  if (kind !== "nomi" && kind !== "chorus") for (let j = 0; j < n; j++) sing(N, c + j);
  if (kind === "nomi") for (let j = 0; j < n; j++) sing(N, c + j);
  // camera: settle on the action, push to Nomi's face on lines 3-4 (the tag), back to wide in the break
  view(S, ...focus, 1.18, a + 0.3, 2); if (bg) dof(S, bg, a + 0.3, 3, 2);
  if (kind === "chorus") { const last = i === SEC.length - 1; view(S, last ? 1000 : 940, last ? 520 : 640, last ? 1.4 : 1.6, mid, 2); if (bg) dof(S, bg, mid, 6, 2); }
  else if (kind === "mango" || kind === "nana") { view(S, kind === "mango" ? 860 : 900, 600, 1.45, mid, 2); if (bg) dof(S, bg, mid, 5, 2); }
  else { view(S, ...N.face, 2.0, mid, 2); if (bg) dof(S, bg, mid, 8, 2); }
  if (brk) { view(S, 960, 540, 1, back, 2.2); if (bg) dof(S, bg, back, 0, 2.2); }
  done(S, [1560, 190]);
});
// end card: the house at night, lights out one by one, the moon smiles
{ const S = scene(ENDCARD, TOTAL, {}), W0 = sky(S); const H = house(S, 960, 980, 600, 540, null);
  H.win.forEach(([x, y], j) => { const d = S.fill(rrect(x - 72, y - 72, 144, 144, DS.r.xs), S.start, 0, DS.c("navy", 1), 1); d.setAttribute("opacity", 0); tl.to(d, { opacity: 1, duration: 1.2 }, S.start + 0.8 + j * 1.1); });
  S.text("Tiny Tune Town", 960, 230, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.start + 0.6 }); view(S, 960, 560, 1.06, S.start + 0.2, S.len - 0.4); done(S, [1560, 190]); }
