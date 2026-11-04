// look: still
// @include ../../tools/cast.js
// @include ../../tools/family.js
// 79 This Little Piggy (PD "Five Toes", The Real Mother Goose 1916; c. 1760). After bath time Dad plays the toe game with Nomi on
// the sofa. Each pass: A = the five toes (a big foot in the foreground, a little picture pops over each toe: basket, house, dinner,
// empty plate) -> B = "cried wee wee wee, all the way home" (the piggy runs home, Dad tickles, Nomi giggles) -> chorus on the rug
// (wiggle, count 1-5 with cards, tickle on the nose). Pass 1 = Nomi's toes, pass 2 = Daddy's big toes, pass 3 = Kofi's toes + Mango.
// Sections come from the SUNG lines (TIMING.words). Shots >= 4 s, 0.6 s crossfades, nothing flashes.
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
const done = (S, sun = [1500, 120]) => { DS.vignette(S, 0.1); grade(S, sun, 0.8); };

// ---------- sections from the sung lines ----------
const SEC = []; // [kind, first clip, n lines, pass]
let pass = -1;
for (let c = 1; c <= NL; c++) {
  const t = TXT[c], kind = /market/.test(t) ? "toes" : /cried|wee/.test(t) && !/market/.test(t) ? "home" : /wiggle|tickle/.test(t) ? "chorus" : null;
  if (kind && (!SEC.length || SEC[SEC.length - 1][0] !== kind || c - SEC[SEC.length - 1][1] >= 4)) { if (kind === "toes") pass++; SEC.push([kind, c, 0, Math.min(3, Math.max(0, pass))]); }
}
SEC.forEach((s, i) => (s[2] = (i + 1 < SEC.length ? SEC[i + 1][1] : find(/bye/, s[1]) || NL + 1) - s[1]));

// ---------- the living room ----------
const lounge = (S) => { const R = DS.room(S, { wall: "sky", floor: "wood", window: [1260, 150, 300, 300] }), g = R.g;
  toon(S, rrect(520, 180, 240, 180, DS.r.xs), "wood", { parent: g, flat: true, w: "mid" }); toon(S, rrect(540, 200, 200, 140, DS.r.xs), "yellow", { parent: g, flat: true, tone: 1, w: "detail" });
  toon(S, rrect(840, 230, 160, 130, DS.r.sm), "pink", { parent: g, flat: true, tone: 1, w: "mid" });
  S.fill(circ(960, 1010, 760, 120), S.start, 0, DS.c("red", 1, "mid"), 0.9, g); S.draw(circ(960, 1010, 640, 96), S.start, 0, { c: DS.c("yellow", 1), w: DS.w.near, parent: g }); // round rug
  return g; };
const SOFA = 760;
const sofaBack = (S) => { const g = S.grp(); toon(S, rrect(300, 420, 1320, 420, DS.r.lg), "purple", { parent: g, dir: "v" }); return g; };
const sofaFront = (S) => { const g = S.grp(); toon(S, rrect(260, SOFA, 1400, 250, DS.r.lg), "purple", { parent: g, tone: 1 }); [260, 1540].forEach((x) => toon(S, rrect(x - 40, 560, 160, 460, DS.r.lg), "purple", { parent: g }));
  S.fill(rrect(330, SOFA + 20, 1260, 30, DS.r.sm), S.start, 0, DS.P.white[0], 0.25, g); return g; };

// ---------- the big foot (foreground insert): 5 toes, big toe first; toes wiggle on their line ----------
const TOES = [[-150, -300, 66], [-40, -352, 52], [52, -350, 46], [132, -322, 42], [196, -276, 36]];
const foot = (S, x, y, k, skin) => { const g = G(S, null, `translate(${x} ${y}) scale(${k}) rotate(-8)`), toes = [];
  toon(S, "M-220 -250 Q-240 -360 -120 -380 Q60 -400 200 -330 Q290 -260 240 -40 Q210 160 60 320 L-180 320 Q-260 60 -220 -250 Z", skin, { parent: g });
  TOES.forEach(([tx, ty, r]) => { const t = G(S, g, `rotate(0 ${tx} ${ty + r})`); toon(S, circ(tx, ty, r, r * 1.12), skin, { parent: t, lw: DS.w.mid * 2.6 }); S.fill(circ(tx, ty - r * 0.45, r * 0.5, r * 0.32), S.start, 0, DS.P.white[0], 0.5, t); toes.push(t); });
  toyFx(g, 8); return { g, toes, at: (i) => { const [tx, ty, r] = TOES[i], a = -8 * Math.PI / 180, X = tx * k, Y = (ty - r * 1.4) * k; return [x + X * Math.cos(a) - Y * Math.sin(a), y + X * Math.sin(a) + Y * Math.cos(a)]; } }; };
const wiggleToe = (F, i, t) => { const [tx, ty, r] = TOES[i]; tw(F.toes[i], t, 1.2, `rotate(0 ${tx} ${ty + r})`, `rotate(10 ${tx} ${ty + r})`, wave(2)); };
// little pictures over the toes
const pic = (S, i, x, y, t) => { const [o, g] = popIn(S, t, x, y);
  toon(S, circ(x, y, 92), "white", { parent: g });
  if (i === 0) { toon(S, `M${x - 56} ${y - 10} H${x + 56} L${x + 40} ${y + 50} H${x - 40} Z`, "wood", { parent: g, lw: DS.w.mid * 2 }); S.draw(`M${x - 40} ${y - 10} Q${x} ${y - 80} ${x + 40} ${y - 10}`, S.start, 0, { c: DS.c("wood", 2), w: DS.w.near, parent: g });
    toon(S, circ(x - 18, y - 22, 20), "red", { parent: g, lw: DS.w.mid * 1.6 }); toon(S, circ(x + 20, y - 20, 18), "green", { parent: g, lw: DS.w.mid * 1.6 }); }                       // market basket
  if (i === 1) { toon(S, rrect(x - 46, y - 20, 92, 70, DS.r.xs), "yellow", { parent: g, lw: DS.w.mid * 2 }); toon(S, `M${x - 62} ${y - 16} L${x} ${y - 70} L${x + 62} ${y - 16} Z`, "red", { parent: g, lw: DS.w.mid * 2 });
    toon(S, rrect(x - 12, y + 10, 24, 40, DS.r.xs), "wood", { parent: g, flat: true, lw: DS.w.mid * 1.4 }); }                                                                      // home
  if (i === 2 || i === 3) { toon(S, circ(x, y + 18, 66, 26), "white", { parent: g, lw: DS.w.mid * 2 }); S.draw(circ(x, y + 18, 46, 16), S.start, 0, { c: DS.c("gray", 1), w: DS.w.detail, parent: g });
    if (i === 2) { toon(S, circ(x, y - 4, 40, 28), "brown", { parent: g, lw: DS.w.mid * 1.6 }); toon(S, circ(x + 40, y + 8, 14), "green", { parent: g, lw: DS.w.mid * 1.2 }); toon(S, circ(x - 42, y + 10, 12), "orange", { parent: g, lw: DS.w.mid * 1.2 }); } } // dinner / none
  return o; };
const piggy = (S, x, y, k, parent) => { const g = G(S, parent, `translate(${x} ${y}) scale(${k})`); toon(S, circ(0, 0, 70, 60), "pink", { parent: g }); [-1, 1].forEach((s) => toon(S, `M${s * 30} -50 L${s * 60} -86 L${s * 66} -40 Z`, "pink", { parent: g, lw: DS.w.mid * 1.6 }));
  toon(S, circ(0, 14, 28, 20), "pink", { parent: g, tone: 1, lw: DS.w.mid * 1.6 }); [-1, 1].forEach((s) => { S.fill(circ(s * 10, 14, 5, 7), S.start, 0, DS.c("pink", 2), 1, g); S.fill(circ(s * 26, -16, 8, 10), S.start, 0, DS.c("famHr", 2), 1, g); S.fill(circ(s * 26 + 3, -19, 3), S.start, 0, DS.P.white[0], 1, g); });
  toyFx(g, 6); return g; };
const toucher = (S, skin, from, t0, pts, dur) => { const g = G(S, null, `translate(${from[0]} ${from[1]})`); toon(S, circ(0, 0, 46, 58), skin, { parent: g }); toon(S, circ(-40, 10, 18, 26), skin, { parent: g, lw: DS.w.mid * 2 }); toyFx(g, 7);
  let p = from; pts.forEach(([x, y, t]) => { tw(g, t - 0.35, 0.5, `translate(${K(p[0])} ${K(p[1])})`, `translate(${K(x)} ${K(y)})`); p = [x, y]; }); return g; };

// ---------- cast ----------
const BARE = { barefoot: true };
const SK = ["famSk1", "famSk3", "famSk1", "famSk1"]; // whose foot: Nomi, Dad, Kofi, Nomi again (bookend)
const idle = (F, S, amp = 7, deg = 2) => F.groove(S.start + 0.3, S.end - 0.2, amp, deg);

// ---------- timeline ----------
const B0 = SEC.map((s) => CS(s[1]) - 0.5), BYE = find(/bye/, SEC.length ? SEC[SEC.length - 1][1] : 1);
const lastEnd = SEC.length ? CE(SEC[SEC.length - 1][1] + SEC[SEC.length - 1][2] - 1) + 0.6 : TOTAL - 6;
const ENDCARD = Math.min(TOTAL - 4.5, Math.max(lastEnd, TOTAL - 8));
const sofaCast = (S, p, o = {}) => { // Dad (or Kofi on pass 3) and Nomi sitting on the sofa; the others watch from behind it
  const bg = lounge(S), W = [];
  if (p === 1) { W.push(mum(S, 1720, 1000, 0.6)); }
  if (p === 2) { W.push(gran(S, 200, 1000, 0.6)); W.push(mum(S, 1720, 1000, 0.6)); }
  W.forEach((F) => idle(F, S, 4, 1)); sofaBack(S);
  const D = p === 2 ? sibling(S, 640, 1040, 0.74, Object.assign({ mood: "happy" }, BARE)) : dad(S, 640, 1240, 0.7, Object.assign({ mood: "happy", sleeves: 0.45 }, BARE));
  const N = toddler(S, 1160, 900, 0.78, Object.assign({ mood: "happy" }, BARE)); idle(D, S, 5, 1.5); idle(N, S, 7, 2.5);
  sofaFront(S); if (p === 2) { const C = kitty(S, 1700, 1060, 0.55); C.wag(S.start + 0.3, S.end - 0.2); }
  return { bg, D, N }; };
// intro: Dad and Nomi on the sofa after bath time, Nomi wiggles her toes
{ const S = scene(0, B0[0] ?? ENDCARD, {}), { bg, D, N } = sofaCast(S, 0); N.expr("giggle", 1.2); N.wave(1.2, Math.min(4.6, S.end - 0.8), 1); D.wave(1.6, Math.min(4.6, S.end - 0.8), -1);
  view(S, 960, 560, 1.12, 0.3, Math.max(2, S.len - 1)); done(S); }
SEC.forEach(([kind, c, n, p], i) => {
  const a = B0[i], b = i + 1 < SEC.length ? B0[i + 1] : ENDCARD, S = scene(a, b, {}), L = (j) => Math.min(c + j, c + n - 1);
  const mid = CS(L(2)) - 0.6, back = CE(L(3)) + 0.4, brk = b - back > 4.6;
  if (kind === "toes") { // the foot fills the left; Nomi watches (and on pass 2-3 is the one who counts the toes)
    const bg = lounge(S); dof(S, bg, S.start, 8, 0.01);
    const N = toddler(S, 1560, 1180, 1.2, Object.assign({ mood: "oh" }, BARE)); idle(N, S, 8, 2); for (let j = 0; j < n; j++) sing(N, c + j);
    const F = foot(S, 760, 1080, p === 1 ? 1.12 : 0.95, SK[p]);
    [0, 1, 2, 3].forEach((j) => { const [x, y] = F.at(j), t = W(L(j), 0) + 0.1; wiggleToe(F, j, t + 0.4); pic(S, j, 400 + j * 240, 250, t + 0.5);
      const fk = p === 1 ? 1.12 : 0.95, ring = S.draw(circ(x, y + TOES[j][2] * 1.4 * fk, TOES[j][2] * 1.35 * fk), S.start, 0, { c: DS.c("yellow", 0), w: DS.w.near * 1.4 }); ring.setAttribute("opacity", 0);
      tl.to(ring, { opacity: 1, duration: 0.3 }, t + 0.2); tl.to(ring, { opacity: 0, duration: 0.4 }, Math.min(t + 3, b - 0.5)); });
    N.expr("giggle", CS(L(1))); N.expr("oh", CS(L(2))); N.expr("giggle", CS(L(3)));
    view(S, 960, 560, 1.05, a + 0.2, 1.4); view(S, 1000, 520, 1.15, mid, 1.4);
    if (brk) view(S, 960, 540, 1, back, 1.4);
    done(S); return;
  }
  if (kind === "home") { const { bg, D, N } = sofaCast(S, Math.min(p, 2)); for (let j = 0; j < n; j++) sing(N, c + j);
    const pg = G(S, null, "translate(0 0)"); piggy(S, 420, 270, 0.9, pg); pic(S, 1, 1400, 270, S.start); // the little piggy runs home
    tw(pg, CS(L(1)), CE(L(3)) - CS(L(1)), "translate(0 0)", "translate(860 0)", "sine.inOut"); tw(pg.firstChild, CS(L(1)), CE(L(3)) - CS(L(1)), "translate(420 270) scale(0.9)", "translate(420 246) scale(0.9)", hump(cyc(CE(L(3)) - CS(L(1)), BEAT)));
    D.arm(1, 70, CS(L(1)), 0.6); tw(D.arms[1].wig, CS(L(1)) + 0.6, 3, "rotate(0 0 0)", "rotate(6 0 0)", wave(6)); D.arm(1, 30, CE(L(2)), 0.6); // tickle tickle
    N.expr("giggle", CS(L(1))); N.hop(W(L(1), 0), 30); N.hop(W(L(1), 2), 30); N.arm(-1, 110, CS(L(3)), 0.5); N.arm(1, 110, CS(L(3)), 0.5);
    hearts(S, CS(L(3)) + 0.6, [[860, 360, 1], [1400, 380, 0.9]]);
    view(S, 900, 560, 1.2, a + 0.2, 1.4); dof(S, bg, a + 0.2, 4, 1.4); view(S, ...N.face, 2.1, mid, 1.3); dof(S, bg, mid, 9, 1.3);
    if (brk) { view(S, 960, 540, 1, back, 1.4); dof(S, bg, back, 0, 1.4); fgFrame(S, 1880, 1180, 0.6, { flip: true, flower: "orange" }); }
    done(S); return;
  }
  // chorus: everyone dances on the rug, counts 1-5, Dad's finger boops Nomi's nose
  const bg = lounge(S), FG = 1040, cast = [];
  const D = dad(S, 520, FG, 0.62, Object.assign({ mood: "happy", sleeves: 0.45 }, BARE)); cast.push(D);
  if (p >= 1) cast.push(mum(S, 1700, FG - 10, 0.62, BARE)); if (p >= 2) { cast.push(gran(S, 230, FG - 20, 0.58, BARE)); cast.push(sibling(S, 1380, FG, 0.62, BARE)); }
  const N = toddler(S, 950, FG + 10, 0.78, Object.assign({ mood: "giggle" }, BARE)); cast.push(N); cast.forEach((F) => idle(F, S));
  if (p >= 2) { const C = kitty(S, 1140, FG + 30, 0.5); C.wag(S.start + 0.3, S.end - 0.2); }
  for (let j = 0; j < n; j++) sing(N, c + j);
  const one = L(2), w0 = wi(one, /one|1/);
  [1, 2, 3, 4, 5].forEach((k, j) => { const t = W(one, Math.min(w0 + j, TXT[one].split(" ").length - 1)); S.fadeOut(num(S, k, 520 + j * 220, 170, t).g, b - 0.6, 0.4); });
  D.arm(1, 95, W(L(3), wi(L(3), /nose/)) - 0.5, 0.5); D.arm(1, 20, CE(L(3)) + 0.3, 0.5); N.expr("oh", W(L(3), wi(L(3), /nose/))); N.expr("giggle", CE(L(3)));
  view(S, ...N.face, 2.0, a + 0.2, 1.4); dof(S, bg, a + 0.2, 9, 1.4);       // hook: "Wiggle, wiggle, little toes" on Nomi's face
  view(S, 960, 500, 1.05, mid, 1.4); dof(S, bg, mid, 0, 1.4);                 // count 1-5 wide enough for all the cards
  if (brk) view(S, 960, 540, 1, back, 1.4);
  done(S);
});
{ const S = scene(ENDCARD, TOTAL, {}), { D, N } = sofaCast(S, 2); N.wave(S.start + 0.4, TOTAL - 0.6, 1); N.expr("giggle", S.start + 0.4); if (BYE) sing(N, BYE);
  S.text("Tiny Tune Town", 960, 120, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: S.start + 0.6 }); done(S); }
