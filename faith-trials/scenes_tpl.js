// look: still
// captions: off
// @include ../../tools/cast.js
// 71 99 Names of Allah for Kids (Asma ul Husna). Names: the commonly recited list (assabile.com/asma-ul-husna). Calm a cappella chant, 10 chunks of 10 names.
// Per name: number, Arabic, transliteration, English meaning on a soft card. Kids (kufi boy, hijab girl) sway gently in front of calm scenery that changes every ten names.
// No Allah / prophet / angel depiction, no Ollie. No hard cuts: 0.6 s crossfade between chunk scenes, 0.35 s fades between name cards.
const NAMES = __NAMES__;     // [n, arabic, translit, meaning, start, end]
const CH = __CHUNKS__;       // [[sceneStart, sceneEnd, firstIdx, lastIdx], ...]
const TOT = __TOTAL__;
BEAT = 60 / 66;
const sh = (g, d, fill, op) => { const p = el("path", { d, fill }, g); if (op !== undefined) p.setAttribute("opacity", op); return p; };
const twk = (S, g, x, y, r, t0) => { const e = twinkle(S, x, y, r, g); tl.fromTo(e, { opacity: 0.35 }, { opacity: 1, duration: 1.6 + (x % 7) * 0.2, yoyo: true, repeat: 40, ease: "sine.inOut" }, S.start + (y % 5) * 0.3); };
const cloud = (S, g, x, y, k, drift) => { const c = S.grp(g); [[0, 0, 90 * k, 36 * k], [70 * k, -18 * k, 64 * k, 34 * k], [-70 * k, 6 * k, 56 * k, 28 * k]].forEach(([dx, dy, rx, ry]) => sh(c, circ(x + dx, y + dy, rx, ry), DS.P.white[0], 0.9)); tw(c, S.start, S.len, "translate(0 0)", `translate(${drift} 0)`, "none"); };
const hills = (g, y, col, amp = 40, seed = 0) => sh(g, smooth(Array.from({ length: 9 }, (_, i) => [-200 + i * 300, y - amp * Math.sin(i * 1.3 + seed) - (i % 2) * amp * 0.4])) + " L2200 1300 L-200 1300 Z", col);
const flower = (S, g, x, y, c, k = 1) => { [0, 1, 2, 3, 4].forEach((i) => { const a = i * 1.2566; sh(g, circ(x + Math.cos(a) * 14 * k, y + Math.sin(a) * 14 * k, 11 * k), c); }); sh(g, circ(x, y, 8 * k), DS.P.yellow[0]); };
const lantern = (S, g, x, y, k, c, delay) => { const lg = S.grp(g); S.draw(`M${x} -50 V${y}`, S.start, 0, { c: DS.P.gray[0], w: DS.w.detail, parent: lg }); sh(lg, circ(x, y + 60 * k, 130 * k), DS.glow(DS.P.yellow[1], 0.55)); toon(S, circ(x, y + 60 * k, 36 * k, 54 * k), c, { parent: lg, lw: DS.w.mid * 2 }); sh(lg, rrect(x - 18 * k, y + 2 * k, 36 * k, 12 * k, DS.r.xs), DS.c("gold", 0)); tw(lg, S.start, S.len, "translate(0 0)", `translate(${6 * delay} 10)`, "sine.inOut"); };
const mosque = (S, g, x, y, k, col) => { sh(g, circ(x, y - 90 * k, 80 * k, 76 * k), col); sh(g, `M${x - 120 * k} ${y} V${y - 90 * k} H${x + 120 * k} V${y} Z`, col); sh(g, rrect(x - 7 * k, y - 190 * k, 14 * k, 40 * k, DS.r.xs), col); sh(g, circ(x, y - 200 * k, 15 * k), DS.c("gold", 0)); sh(g, circ(x + 6 * k, y - 202 * k, 12 * k), col);
  [-1, 1].forEach((s) => { const ax = x + s * 165 * k; sh(g, rrect(ax - 14 * k, y - 250 * k, 28 * k, 250 * k, DS.r.xs), col); sh(g, `M${ax - 20 * k} ${y - 246 * k} Q${ax} ${y - 300 * k} ${ax + 20 * k} ${y - 246 * k} Z`, col); sh(g, rrect(ax - 6 * k, y - 160 * k, 12 * k, 26 * k, DS.r.xs), DS.c("gold", 0), 0.9); }); [-60, 0, 60].forEach((dx) => sh(g, rrect(x + dx * k - 8 * k, y - 60 * k, 16 * k, 34 * k, DS.r.xs), DS.c("gold", 0), 0.9)); };
// ten calm sceneries, one per chunk
const THEMES = [
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(PS.cffcf9a, DS.P.paper[0])); sh(g, circ(960, 640, 520), DS.glow(DS.P.yellow[1], 0.9)); sh(g, circ(960, 650, 90), PS.cffe27a); hills(g, 760, DS.c("grass", 1, "mid"), 30); cloud(S, g, 420, 220, 1, 60); cloud(S, g, 1500, 160, 0.8, -50); hills(g, 880, DS.c("grass", 0), 36, 2); [[200, 960], [760, 1010], [1250, 985], [1740, 1020]].forEach(([x, y], i) => flower(S, g, x, y, [DS.P.pink[0], DS.P.red[1], DS.P.white[0], DS.P.orange[1]][i], 1.4)); },
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(PS.c17214a, PS.c3f5aa6)); sh(g, circ(1560, 220, 90), DS.P.yellow[1]); sh(g, circ(1595, 200, 78), PS.c2b3c7a); sh(g, circ(1560, 220, 260), DS.glow(DS.P.yellow[1], 0.3)); [[200, 150], [520, 90], [900, 200], [1230, 110], [1760, 410], [360, 360], [1040, 60], [1400, 300]].forEach(([x, y], i) => twk(S, g, x, y, 14 + (i % 3) * 5)); hills(g, 860, PS.c2c4a6e, 40); hills(g, 960, PS.c1f3552, 30, 1); },
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(PS.ca9dcf5, PS.ce8f7ff)); [PS.ce5383b, PS.cff8c1a, PS.cffcf33, PS.c3f9e4a, PS.c2f6fd6, PS.c8e5bb5].forEach((c, i) => S.draw(`M200 800 Q960 ${-120 + i * 26} 1720 800`, S.start, 0, { c, w: DS.w.near * 4, parent: g, op: 0.8 })); cloud(S, g, 300, 740, 1.1, 40); cloud(S, g, 1650, 740, 1.1, -40); cloud(S, g, 1000, 140, 0.8, 50); hills(g, 880, DS.c("grass", 1, "mid"), 34); hills(g, 960, DS.c("grass", 0), 30, 2); },
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(PS.c10183d, PS.c2c3a78)); [[300, 140], [700, 80], [1200, 170], [1650, 100], [1850, 300], [90, 340]].forEach(([x, y], i) => twk(S, g, x, y, 12 + (i % 3) * 4)); [[140, 40, 1.1, "red", 1], [470, 120, 0.9, "orange", -1], [800, 60, 1, "yellow", 1], [1150, 130, 0.95, "pink", -1], [1500, 50, 1.1, "orange", 1], [1800, 120, 0.9, "red", -1]].forEach(([x, y, k, c, d], i) => lantern(S, g, x, y, k, c, d)); hills(g, 900, PS.c25396b, 30); hills(g, 980, PS.c1a2a55, 26, 1); },
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(PS.c8e5bb5, PS.cffc58a)); sh(g, circ(960, 760, 560), DS.glow(DS.P.yellow[1], 0.9)); sh(g, circ(960, 780, 100), DS.P.yellow[1]); mosque(S, g, 1000, 800, 1.5, PS.c4a2f6b); hills(g, 860, PS.c5e3b85, 30); hills(g, 950, PS.c3d2760, 24, 2); },
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(PS.c7ccdf0, PS.cd9f3ff)); sh(g, circ(1500, 190, 70), DS.P.yellow[1]); sh(g, circ(1500, 190, 250), DS.glow(DS.P.yellow[1], 0.5)); sh(g, rect(-300, 640, 2600, 700), DS.vgrad(PS.c2f8fd6, PS.c1f5fb0)); for (let i = 0; i < 12; i++) { const w = sh(g, `M${-100 + i * 190} ${700 + (i % 3) * 90} q40 -26 80 0 t80 0`, "none"); w.setAttribute("stroke", DS.P.white[0]); w.setAttribute("stroke-width", 5); w.setAttribute("opacity", 0.55); tw(w, S.start, S.len, "translate(0 0)", `translate(${30 * (i % 2 ? 1 : -1)} 0)`, "sine.inOut"); } cloud(S, g, 500, 200, 1, 50); cloud(S, g, 1150, 120, 0.7, -40);
    const b = S.grp(g); sh(b, "M1180 760 H1340 L1310 800 H1210 Z", PS.cb0603a); sh(b, "M1260 620 V752 L1340 752 Z", DS.P.white[0]); sh(b, "M1250 640 V752 L1190 752 Z", PS.cffdd88); tw(b, S.start, S.len, "translate(0 0)", "translate(-90 6)", "sine.inOut"); },
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(PS.cbfe3f7, PS.cf4fbff)); sh(g, "M-100 760 L300 330 L560 600 L820 380 L1200 760 Z", PS.c8aa6c9); sh(g, "M900 760 L1300 300 L1600 560 L1900 340 L2200 760 Z", PS.c7893b8); sh(g, "M300 330 L390 430 L330 450 L290 420 L240 440 Z", DS.P.white[0]); sh(g, "M1300 300 L1390 400 L1330 420 L1290 390 L1240 410 Z", DS.P.white[0]); sh(g, rect(-300, 740, 2600, 600), DS.vgrad(PS.c7cc9e8, PS.c4aa0cf)); hills(g, 780, PS.c5aa860, 20); cloud(S, g, 700, 180, 1, 60); cloud(S, g, 1500, 120, 0.9, -50); hills(g, 960, DS.c("grass", 0), 28, 2); },
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(PS.c1b1d4a, PS.c6b4a8a)); sh(g, circ(400, 230, 80), DS.P.yellow[1]); sh(g, circ(432, 212, 70), PS.c2a2a5e); [[800, 100], [1100, 190], [1500, 120], [1750, 300], [200, 420], [1330, 330], [620, 330]].forEach(([x, y], i) => twk(S, g, x, y, 13 + (i % 3) * 4)); sh(g, smooth([[-200, 880], [300, 780], [800, 860], [1300, 760], [1800, 850], [2200, 790]]) + " L2200 1300 L-200 1300 Z", PS.cc98a55); sh(g, smooth([[-200, 980], [500, 900], [1100, 970], [1700, 890], [2200, 960]]) + " L2200 1300 L-200 1300 Z", PS.ca86d3f); },
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(PS.cbdeaff, DS.P.paper[0])); sh(g, circ(300, 200, 80), DS.P.yellow[1]); sh(g, circ(300, 200, 250), DS.glow(DS.P.yellow[1], 0.5)); cloud(S, g, 900, 160, 1, 50); cloud(S, g, 1500, 260, 0.8, -40); hills(g, 800, DS.c("grass", 1, "mid"), 34); hills(g, 900, DS.c("grass", 0), 30, 2); for (let i = 0; i < 22; i++) flower(S, g, 60 + i * 88, 990 + (i % 3) * 18, [DS.P.pink[0], DS.P.yellow[0], DS.P.white[0], DS.P.red[1], DS.P.orange[1]][i % 5], 1.2); [[700, 520], [1250, 440]].forEach(([x, y], i) => { const bf = S.grp(g); sh(bf, circ(x - 14, y, 16, 22), DS.P.orange[0]); sh(bf, circ(x + 14, y, 16, 22), DS.P.pink[0]); tw(bf, S.start, S.len, "translate(0 0)", `translate(${i ? -160 : 180} ${i ? 40 : -50})`, "sine.inOut"); }); },
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(PS.c0f2a3a, PS.c2f6a62)); sh(g, circ(960, 300, 140), DS.P.yellow[1]); sh(g, circ(960, 300, 420), DS.glow(DS.P.yellow[1], 0.45)); hills(g, 860, PS.c1f5a4a, 36); hills(g, 950, PS.c164236, 28, 2); for (let i = 0; i < 16; i++) { const f = sh(g, circ(120 + i * 115, 650 + ((i * 97) % 300), 7), PS.cffe66d); tl.fromTo(f, { opacity: 0.15 }, { opacity: 1, duration: 1.4 + (i % 4) * 0.3, yoyo: true, repeat: 40, ease: "sine.inOut" }, S.start + (i % 6) * 0.4); tw(f, S.start, S.len, "translate(0 0)", `translate(${(i % 2 ? 1 : -1) * 50} ${-30 - (i % 3) * 15})`, "sine.inOut"); } },
];
const done = (S) => DS.vignette(S, 0.1);
const AR = (s) => s.replace(/[ً-ِ]$/u, "");                                     // pausal form: drop the final case vowel, as the name is chanted
const KID_FY = 1000, kidTop = (k) => KID_FY - 392 * k;
// name card: number badge, Arabic, transliteration, English meaning
const nameCard = (S, n, ar, tr, en, t0, t1) => {
  const g = S.grp();
  sh(g, rrect(530, 176, 880, 676, DS.r.lg), DS.P.ink[0], 0.16);
  sh(g, rrect(520, 160, 880, 676, DS.r.lg), DS.P.paper[0], 0.94); const bd = sh(g, rrect(520, 160, 880, 676, DS.r.lg), "none"); bd.setAttribute("stroke", DS.c("gold", 0)); bd.setAttribute("stroke-width", 10);
  sh(g, circ(600, 245, 62), DS.c("gold", 0)); sh(g, circ(600, 245, 52), DS.c("gold", 1));
  el("text", { x: 600, y: 270, "text-anchor": "middle", "font-family": "PH", "font-weight": 700, "font-size": n > 99 ? 40 : 62, fill: PS.c6b3d00 }, g).textContent = String(n);
  const a = el("text", { x: 960, y: 480, "text-anchor": "middle", "font-family": "'Geeza Pro','Noto Naskh Arabic','Al Nile','Arial'", "font-size": ar.length > 18 ? 130 : 200, fill: PS.c1f5a3a, direction: "rtl" }, g); a.textContent = AR(ar);
  el("text", { x: 960, y: 640, "text-anchor": "middle", "font-family": "PH", "font-weight": 700, "font-size": Math.min(96, 1700 / tr.length), fill: DS.P.brown[1] }, g).textContent = tr;
  el("text", { x: 960, y: 760, "text-anchor": "middle", "font-family": "PH", "font-size": Math.min(70, 1500 / en.length), fill: DS.P.ink[1] }, g).textContent = en;
  if (t0 > S.start + 0.05) tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.out" }, t0 - 0.15); else tl.set(g, { opacity: 1 }, S.start);
  if (t1 < S.end - 0.5) tl.to(g, { opacity: 0, duration: 0.35 }, t1 + 0.15);
  return g;
};
const world = (S, i) => { const g = S.grp(); S.g.insertBefore(g, S.g.firstChild); THEMES[i](S, g); return g; };
const kids = (S, mood) => {
  const k = 0.95, a = kidKufi(S, 235, kidTop(k), { k, mood }), b = kidHijab(S, 1690, kidTop(k), { k, mood: "joy" });
  [a, b].forEach((c, i) => swing(S, c.g, S.start + 0.3 * i, S.end - 0.3, { y: -10 }, BEAT * (i ? 1.0 : 1.0)));
};
// intro (scene 0)
{ const S = scene(0, CH[0][0], { cam: "push" }); world(S, 0); kids(S, "joy");
  const g = S.grp(); sh(g, rrect(420, 170, 1080, 620, DS.r.lg), DS.P.paper[0], 0.94);
  el("text", { x: 960, y: 360, "text-anchor": "middle", "font-family": "'Geeza Pro','Noto Naskh Arabic','Arial'", "font-size": 150, fill: PS.c1f5a3a, direction: "rtl" }, g).textContent = "أَسْمَاءُ اللَّهِ الْحُسْنَى";
  S.text("99 Names of Allah", 960, 560, { size: DS.type.display, c: DS.P.brown[1], parent: g, t: S.start + 0.6 }); S.text("Asma ul Husna for kids", 960, 680, { size: DS.type.body, c: DS.P.ink[1], parent: g, t: S.start + 1.0 }); S.text("Sing along, name by name", 960, 760, { size: DS.type.small, c: DS.P.gray[2], parent: g, t: S.start + 1.4 }); done(S); }
// chunk scenes
CH.forEach(([a, b, i0, i1], ci) => {
  const S = scene(a, b, { cam: "push" }); world(S, ci); kids(S);
  for (let i = i0; i <= i1; i++) { const [n, ar, tr, en, s, e] = NAMES[i]; nameCard(S, n, ar, tr, en, i === i0 ? S.start : s, i === i1 ? S.end : (NAMES[i + 1][4])); }
  done(S);
});
// outro
{ const S = scene(CH[CH.length - 1][1], TOT, { cam: "push" }); world(S, 9); kids(S, "joy");
  const g = S.grp(); sh(g, rrect(420, 230, 1080, 520, DS.r.lg), DS.P.paper[0], 0.94);
  S.text("Thank you for singing!", 960, 450, { size: DS.type.title, c: DS.P.brown[1], parent: g, t: S.start + 0.4 }); S.text("Tiny Tune Town", 960, 600, { size: DS.type.title, c: PS.cd06a00, parent: g, t: S.start + 0.9 }); done(S); }
