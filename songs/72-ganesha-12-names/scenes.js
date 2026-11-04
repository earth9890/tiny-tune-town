// look: still
// captions: off
// @include ../../tools/cast.js
// 72 The 12 Names of Ganesha (Sankatanashana Ganesha Stotra, Narada Purana) for kids. Respectful only: Ganesha stays seated on his lotus, raised, calm; kids (tilak boy, bindi girl) sway and clap gently.
// Per name: Devanagari, transliteration, short English meaning on a soft card. Refrain "Ganpati Bappa Morya" after each four names. Six chunk scenes (two rounds of three), 0.6 s crossfades.
const NM = [["वक्रतुण्ड", "Vakratunda", "curly trunk"], ["एकदन्त", "Ekadanta", "one big tusk"], ["कृष्णपिङ्गाक्ष", "Krishnapingaksha", "kind brown eyes"], ["गजवक्त्र", "Gajavaktra", "elephant face"], ["लम्बोदर", "Lambodara", "round tummy"], ["विकट", "Vikata", "mighty and big"], ["विघ्नराज", "Vighnaraja", "clears the way"], ["धूम्रवर्ण", "Dhumravarna", "smoky gray"], ["भालचन्द्र", "Bhalachandra", "moon on brow"], ["विनायक", "Vinayaka", "wise leader"], ["गणपति", "Ganapati", "leader of friends"], ["गजानन", "Gajanana", "elephant face"]];       // [devanagari, translit, meaning]
const CH = [{"a": 6.0, "b": 22.26, "names": [[0, 6.0], [1, 10.5]], "ref": [15.88, 21.86], "theme": 0, "r2": false}, {"a": 22.26, "b": 38.58, "names": [[2, 22.26], [3, 28.92]], "ref": [32.62, 38.18], "theme": 1, "r2": false}, {"a": 38.58, "b": 54.9, "names": [[4, 38.58], [5, 43.84]], "ref": [49.68, 54.5], "theme": 2, "r2": false}, {"a": 54.9, "b": 70.68, "names": [[6, 54.9], [7, 59.62]], "ref": [64.98, 70.28], "theme": 0, "r2": false}, {"a": 70.68, "b": 87.0, "names": [[8, 70.68], [9, 77.3]], "ref": [81.3, 86.6], "theme": 1, "r2": false}, {"a": 87.0, "b": 103.34, "names": [[10, 87.0], [11, 92.0]], "ref": [97.36, 102.94], "theme": 2, "r2": false}, {"a": 103.34, "b": 119.6, "names": [[0, 103.34], [1, 107.84]], "ref": [113.22, 119.2], "theme": 0, "r2": true}, {"a": 119.6, "b": 135.92, "names": [[2, 119.6], [3, 126.26]], "ref": [129.96, 135.52], "theme": 1, "r2": true}, {"a": 135.92, "b": 152.24, "names": [[4, 135.92], [5, 141.18]], "ref": [147.02, 151.84], "theme": 2, "r2": true}, {"a": 152.24, "b": 168.02, "names": [[6, 152.24], [7, 156.96]], "ref": [162.32, 167.62], "theme": 0, "r2": true}, {"a": 168.02, "b": 184.34, "names": [[8, 168.02], [9, 174.64]], "ref": [178.64, 183.94], "theme": 1, "r2": true}, {"a": 184.34, "b": 201.08, "names": [[10, 184.34], [11, 189.34]], "ref": [194.7, 200.28], "theme": 2, "r2": true}];       // [{a, b, names: [[nameIdx, start], x4], ref: [s, e], theme}]
const TOT = 207.08;
BEAT = 60 / 90;
const sh = (g, d, fill, op) => { const p = el("path", { d, fill }, g); if (op !== undefined) p.setAttribute("opacity", op); return p; };
const hills = (g, y, col, amp = 40, seed = 0) => sh(g, smooth(Array.from({ length: 9 }, (_, i) => [-200 + i * 300, y - amp * Math.sin(i * 1.3 + seed) - (i % 2) * amp * 0.4])) + " L2200 1300 L-200 1300 Z", col);
const marigold = (S, g, x, y, k = 1) => { for (let i = 0; i < 8; i++) { const a = i * 0.785; sh(g, circ(x + Math.cos(a) * 13 * k, y + Math.sin(a) * 13 * k, 11 * k), DS.P.orange[0]); } sh(g, circ(x, y, 10 * k), DS.P.yellow[0]); };
const garland = (S, g, y0) => { for (let i = 0; i < 24; i++) { const x = 20 + i * 82; marigold(S, g, x, y0 + 28 * Math.sin(i * Math.PI / 12) + 40 * Math.abs(Math.sin(i * Math.PI / 24 * 2)), 1.3); } };
const diya = (S, g, x, y, k = 1) => { sh(g, `M${x - 40 * k} ${y} Q${x} ${y + 40 * k} ${x + 40 * k} ${y} Z`, DS.c("orange", 2)); const f = sh(g, `M${x} ${y - 6 * k} Q${x - 14 * k} ${y - 30 * k} ${x} ${y - 52 * k} Q${x + 14 * k} ${y - 30 * k} ${x} ${y - 6 * k} Z`, DS.P.yellow[0]); tl.fromTo(f, { opacity: 0.65 }, { opacity: 1, duration: 0.9, yoyo: true, repeat: 80, ease: "sine.inOut" }, S.start); sh(g, circ(x, y - 30 * k, 50 * k), DS.glow(DS.P.yellow[1], 0.5)); };
const THEMES = [
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(DS.P.orange[1], DS.P.paper[0])); sh(g, circ(960, 520, 560), DS.glow(DS.P.yellow[1], 0.9)); hills(g, 860, DS.c("grass", 1, "mid"), 26); hills(g, 960, DS.c("grass", 0), 26, 2); garland(S, g, 40); },
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(DS.P.sky[0], DS.P.yellow[1])); sh(g, circ(1600, 190, 70), DS.P.yellow[1]); sh(g, circ(1600, 190, 250), DS.glow(DS.P.yellow[1], 0.5)); hills(g, 880, DS.c("grass", 1, "mid"), 30); for (let i = 0; i < 20; i++) marigold(S, g, 60 + i * 96, 960 + (i % 3) * 20, 1.5); garland(S, g, 30); },
  (S, g) => { sh(g, rect(-300, -300, 2600, 1400), DS.vgrad(DS.P.purple[2], DS.P.orange[0])); sh(g, circ(960, 760, 620), DS.glow(DS.P.yellow[1], 0.7)); hills(g, 900, DS.P.purple[2], 28); [[200, 990], [560, 1010], [1360, 1010], [1720, 990]].forEach(([x, y]) => diya(S, g, x, y, 1.3)); garland(S, g, 30); },
];
const done = (S) => DS.vignette(S, 0.1);
const KFY = 1000, hyOf = (k) => KFY - 392 * k;
const cardG = (S, lines, t0, t1) => {
  const g = S.grp();
  sh(g, rrect(100, 120, 800, 450, DS.r.lg), DS.P.ink[0], 0.14); sh(g, rrect(92, 110, 800, 450, DS.r.lg), DS.P.paper[0], 0.95); const bd = sh(g, rrect(92, 110, 800, 450, DS.r.lg), "none"); bd.setAttribute("stroke", DS.c("orange", 0)); bd.setAttribute("stroke-width", 10);
  lines.forEach(([txt, y, size, col, dev]) => { const e = el("text", { x: 492, y, "text-anchor": "middle", "font-family": dev ? "'Kohinoor Devanagari','Devanagari Sangam MN','Noto Sans Devanagari',Arial" : "PH", "font-size": Math.min(size, 740 / (Math.max(txt.length, 1) * (dev ? 0.62 : 0.56))), "font-weight": dev ? 600 : 400, fill: col }, g); e.textContent = txt; });
  if (t0 > S.start + 0.05) tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.out" }, t0 - 0.15); else tl.set(g, { opacity: 1 }, S.start);
  if (t1 < S.end - 0.5) tl.to(g, { opacity: 0, duration: 0.35 }, t1 + 0.1);
};
const scn = (S, ci) => {
  const w = S.grp(); S.g.insertBefore(w, S.g.firstChild); THEMES[ci % 3](S, w);
  const G = ganesha(S, 1390, 910, 1.15); swing(S, G.bob, S.start, S.end - 0.3, { y: -6 }, BEAT * 2);
  const k = 0.75, a = kidTilak(S, 250, hyOf(k), { k, mood: "joy", pose: "wave" }), b = kidBindi(S, 700, hyOf(k), { k, mood: "joy", pose: "wave" });
  [a, b].forEach((c, i) => swing(S, c.g, S.start + 0.2 * i, S.end - 0.3, { y: -12 }, BEAT));
};
// intro
{ const S = scene(0, CH[0].a, { cam: "push" }); scn(S, 0);
  cardG(S, [["श्री गणेश", 300, 150, DS.c("red", 2), 1], ["12 Names of Ganesha", 430, 74, DS.c("orange", 2)], ["a sing-along for kids", 520, DS.type.small, DS.P.ink[1]]], S.start, S.end); done(S); }
CH.forEach((c, ci) => {
  const S = scene(c.a, c.b, { cam: "push" }); scn(S, c.theme);
  c.names.forEach(([ni, st], j) => { const nx = c.names[j + 1] ? c.names[j + 1][1] : c.ref[0]; const [dv, tr, en] = NM[ni]; cardG(S, [[dv, 300, 130, DS.c("red", 2), 1], [tr, 430, 84, DS.c("orange", 2)], [c.r2 ? "Sing with me!" : en, 530, DS.type.body, c.r2 ? DS.c("red", 2) : DS.P.ink[1]]], j === 0 ? S.start : st, nx); });
  cardG(S, [["गणपति बप्पा मोरया", 300, 110, DS.c("red", 2), 1], ["Ganpati Bappa Morya!", 430, 76, DS.c("orange", 2)], [c.r2 ? "Sing with me!" : "Hail Ganpati!", 530, DS.type.body, c.r2 ? DS.c("red", 2) : DS.P.ink[1]]], c.ref[0], S.end);
  done(S);
});
{ const S = scene(CH[CH.length - 1].b, TOT, { cam: "push" }); scn(S, 1);
  cardG(S, [["धन्यवाद", 300, 150, DS.c("red", 2), 1], ["Thank you for singing!", 430, 76, DS.c("orange", 2)], ["Tiny Tune Town", 530, DS.type.body, DS.P.ink[1]]], S.start + 0.3, S.end); done(S); }
