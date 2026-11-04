// 26 alphabet objects, soft toon look (toon() + LN, no ink outlines). Each: PROP[key](S, g) draws around local (0,0) = ground contact; ~300 px tall max.
// Animals that already exist in cast.js are used directly in scenes.js (dog = puppy, fish = fish, rabbit = bibi).
const PW = DS.w.mid * 2.4;
const PK = (S, g) => ({
  t: (d, n, o = {}) => toon(S, d, n, { parent: g, lw: PW, ...o }),
  f: (d, c, op = 1) => S.fill(d, S.start, 0, c, op, g),
  l: (d, c, w = DS.w.mid) => S.draw(d, S.start, 0, { c, w, parent: g }),
  r: (a, x, y) => G(S, g, `rotate(${a} ${x} ${y})`),
});
const eyes = (p, x, y, gap, r = 11) => [-1, 1].forEach((s) => { p.f(circ(x + s * gap, y, r), DS.P.ink[0]); p.f(circ(x + s * gap - r * 0.3, y - r * 0.35, r * 0.35), DS.P.white[0]); });
const blush = (p, x, y, gap, r = 14) => [-1, 1].forEach((s) => p.f(circ(x + s * gap, y, r, r * 0.6), DS.c("pink", 0), 0.55));
const smile = (p, x, y, w = 18) => p.l(`M${x - w} ${y} Q${x} ${y + w * 0.9} ${x + w} ${y}`, LN("red"), DS.w.near);
const leaf = (p, x, y, s = 1, a = 0) => p.t(`M${x} ${y} Q${x + 50 * s} ${y - 40 * s} ${x + 100 * s} ${y} Q${x + 50 * s} ${y + 34 * s} ${x} ${y} Z`, "green", { parent: a ? p.r(a, x, y) : undefined });
const gloss = (p, x, y, rx, ry) => p.f(circ(x, y, rx, ry), DS.P.white[0], 0.6);

const PROP = {
  apple: (S, g) => { const p = PK(S, g);
    p.t(tube([[0, -178], [4, -208], [16, -232]], 8, 6).d, "wood");
    leaf(p, 14, -200, 0.9, -12);
    p.t("M0 -184 C-34 -212 -128 -190 -128 -100 C-128 -34 -76 8 -36 4 C-16 0 -10 -2 0 -2 C10 -2 16 0 36 4 C76 8 128 -34 128 -100 C128 -190 34 -212 0 -184 Z", "red");
    gloss(p, -72, -132, 16, 34); return p; },
  ball: (S, g) => { const p = PK(S, g);
    p.t(circ(0, -125, 125), "blue");
    p.f(circ(0, -125, 48, 122), DS.c("yellow", 0), 1); p.f(circ(0, -125, 20, 122), DS.c("red", 0), 1);
    p.f(circ(-70, -190, 24, 38), DS.P.white[0], 0.65);
    p.l("M-122 -110 Q0 -80 122 -110", DS.P.white[0], DS.w.near); return p; },
  cat: (S, g) => { const p = PK(S, g);
    p.t(tube([[90, -30], [150, -50], [165, -120], [140, -170]], 14, 9).d, "orange");
    p.t(circ(0, -80, 92, 80), "orange"); p.t(circ(-50, -12, 34, 20), "orange"); p.t(circ(50, -12, 34, 20), "orange");
    [-1, 1].forEach((s) => p.t(`M${s * 36} -196 L${s * 84} -262 L${s * 96} -176 Z`, "orange", { lw: PW * 0.8 }));
    p.t(circ(0, -170, 86, 76), "orange");
    p.f(circ(0, -150, 40, 28), DS.P.white[0], 0.85); p.f(circ(0, -96, 50, 52), DS.P.white[0], 0.8);
    [-1, 1].forEach((s) => p.f(`M${s * 48} -236 L${s * 78} -172 L${s * 52} -192 Z`, DS.c("pink", 0), 0.7));
    eyes(p, 0, -184, 34, 12); p.f("M-9 -158 L9 -158 L0 -146 Z", DS.c("pink", 2)); smile(p, 0, -140, 14);
    p.l("M-52 -150 L-100 -158 M-52 -140 L-100 -136 M52 -150 L100 -158 M52 -140 L100 -136", DS.P.white[2], DS.w.detail);
    blush(p, 0, -150, 60, 12); return p; },
  elephant: (S, g) => { const p = PK(S, g);
    [-1, 1].forEach((s) => p.t(circ(s * 70, -34, 34, 30), "gray"));
    p.t(circ(0, -120, 120, 90), "gray");
    [-1, 1].forEach((s) => p.t(circ(s * 128, -210, 76, 84), "gray", { tone: 1 }));
    p.f(circ(-128, -210, 46, 56), DS.c("pink", 1), 0.55); p.f(circ(128, -210, 46, 56), DS.c("pink", 1), 0.55);
    p.t(circ(0, -200, 86, 84), "gray");
    p.t(tube([[0, -170], [6, -110], [-20, -50], [-70, -50]], 28, 15).d, "gray");
    [-1, 1].forEach((s) => p.t(`M${s * 54} -150 Q${s * 92} -118 ${s * 70} -92 Q${s * 60} -120 ${s * 44} -140 Z`, "white", { lw: PW * 0.6, flat: true }));
    eyes(p, 0, -222, 38, 11); blush(p, 0, -192, 66, 12); gloss(p, -44, -250, 20, 12); return p; },
  fish: null,
  goat: (S, g) => { const p = PK(S, g);
    [[-70, -46], [-30, -46], [30, -46], [70, -46]].forEach(([x]) => p.t(circ(x, -34, 16, 36), "white", { tone: 1 }));
    p.t(circ(0, -110, 112, 66), "white");
    p.t(circ(100, -200, 62, 58), "white");
    [-1, 1].forEach((s) => p.t(tube([[100 + s * 24, -240], [100 + s * 38, -290], [100 + s * 70, -300]], 11, 5).d, "wood", { lw: PW * 0.6 }));
    p.t(circ(150, -166, 34, 28), "white"); p.t("M104 -172 Q96 -120 120 -112 Q122 -144 130 -160 Z", "white", { lw: PW * 0.6 });
    p.t(`M60 -232 L24 -212 L64 -208 Z`, "white", { lw: PW * 0.6 });
    p.f(circ(146, -176, 8), DS.P.ink[0]); eyes(p, 100, -214, 24, 9); p.l("M132 -142 Q150 -134 166 -146", LN("red"), DS.w.near); blush(p, 100, -184, 34, 10);
    p.t(tube([[-106, -130], [-134, -150]], 14, 10).d, "white", { lw: PW * 0.6 }); return p; },
  hat: (S, g) => { const p = PK(S, g);
    p.t(circ(0, -34, 170, 36), "blue"); p.t("M-102 -40 Q-104 -210 0 -214 Q104 -210 102 -40 Z", "blue");
    p.f("M-104 -78 Q0 -50 104 -78 L100 -108 Q0 -80 -100 -108 Z", DS.c("red", 0), 1);
    p.f(circ(0, -76, 16), DS.c("yellow", 0)); gloss(p, -52, -170, 20, 34); return p; },
  icecream: (S, g) => { const p = PK(S, g);
    p.t("M-70 -168 L0 0 L70 -168 Z", "orange", { lw: PW * 0.8 });
    p.l("M-52 -138 L26 -36 M-24 -152 L40 -66 M10 -158 L52 -102 M-60 -112 L-26 -60", DS.c("orange", 2), DS.w.detail);
    p.t(circ(0, -196, 86, 66), "pink"); p.t(circ(0, -262, 62, 52), "yellow", { tone: 0 });
    p.t(circ(0, -308, 22), "red"); gloss(p, -40, -276, 12, 20);
    p.f(circ(-30, -200, 7), DS.P.white[0]); p.f(circ(34, -212, 7), DS.P.white[0]); p.f(circ(8, -178, 7), DS.P.white[0]); return p; },
  jug: (S, g) => { const p = PK(S, g);
    p.t("M30 -190 Q130 -200 124 -120 Q118 -56 30 -52", "yellow", { lw: PW * 0.9, flat: true });
    p.f("M40 -166 Q96 -170 94 -122 Q92 -84 40 -80 Z", DS.hazeTo, 1);
    p.t("M-96 0 Q-130 -120 -86 -208 Q-110 -216 -90 -246 L40 -246 Q56 -216 30 -208 Q74 -120 40 0 Z", "sky");
    p.f("M-90 -118 Q-24 -138 50 -118 L40 -4 L-96 -4 Z", DS.c("blue", 1), 0.55);
    p.f(circ(-70, -170, 10, 40), DS.P.white[0], 0.6); return p; },
  kite: (S, g) => { const p = PK(S, g);
    p.l("M0 -150 Q-30 -60 20 -10 Q50 20 0 40", DS.c("pink", 2), DS.w.mid);
    [[-8, -30, -1], [14, 0, 1]].forEach(([x, y, s], i) => p.t(`M${x} ${y + 40 + i * 6} l${-18 * s} -14 l${6 * s} 20 l${-20 * s} 4 Z`, "yellow", { lw: PW * 0.5 }));
    p.t("M0 -290 L110 -170 L0 -50 L-110 -170 Z", "red", { lw: PW * 0.9 });
    p.f("M0 -290 L110 -170 L0 -170 Z", DS.c("yellow", 0), 1); p.f("M0 -50 L-110 -170 L0 -170 Z", DS.c("yellow", 0), 1);
    p.l("M0 -290 V-50 M-110 -170 H110", DS.P.white[0], DS.w.near); return p; },
  lion: (S, g) => { const p = PK(S, g);
    [-1, 1].forEach((s) => p.t(circ(s * 56, -26, 32, 22), "yellow"));
    p.t(circ(0, -100, 82, 84), "yellow");
    const mane = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return circ(Math.cos(a) * 92, -218 + Math.sin(a) * 92, 54); }).join(" ");
    p.t(mane, "orange"); p.t(circ(0, -218, 100), "orange");
    [-1, 1].forEach((s) => p.t(circ(s * 76, -300, 26), "yellow", { lw: PW * 0.7 }));
    p.t(circ(0, -214, 86, 80), "yellow");
    p.f(circ(0, -190, 40, 30), DS.P.white[0], 0.85);
    eyes(p, 0, -234, 34, 12); p.f("M-12 -208 L12 -208 L0 -194 Z", DS.c("brown", 0)); p.l("M0 -194 V-182 M-22 -176 Q0 -164 22 -176", LN("red"), DS.w.near); blush(p, 0, -200, 62, 12); return p; },
  mango: (S, g) => { const p = PK(S, g);
    p.t(tube([[40, -214], [48, -240], [62, -252]], 8, 6).d, "wood");
    leaf(p, 60, -246, 1, -28);
    p.t("M-122 -90 C-116 -190 -20 -214 52 -200 C124 -186 140 -90 90 -30 C46 18 -112 14 -122 -90 Z", "orange");
    p.f("M-110 -70 C-90 -150 -20 -180 40 -176 C0 -150 -50 -80 -62 -14 C-92 -20 -108 -40 -110 -70 Z", DS.c("yellow", 0), 0.6);
    gloss(p, -60, -150, 14, 32); return p; },
  nest: (S, g) => { const p = PK(S, g);
    p.t("M-150 -90 Q-160 0 0 0 Q160 0 150 -90 Q0 -60 -150 -90 Z", "wood", { lw: PW });
    [[-60, -150], [0, -165], [60, -150]].forEach(([x, y], i) => p.t(circ(x, y + 30, 36, 46), "white", { lw: PW * 0.7, tone: 0 }));
    p.f(circ(-60, -126, 6), DS.c("sky", 1), 0.9); p.f(circ(0, -140, 6), DS.c("sky", 1), 0.9);
    p.t("M-168 -100 Q0 -50 168 -100 Q172 -70 150 -42 Q0 12 -150 -42 Q-172 -70 -168 -100 Z", "wood", { lw: PW });
    p.l("M-130 -76 Q-50 -52 40 -66 M-60 -30 Q40 -14 130 -50 M-100 -50 L-60 -30", DS.c("wood", 2), DS.w.mid); return p; },
  orange: (S, g) => { const p = PK(S, g);
    p.t(circ(0, -115, 118, 112), "orange"); leaf(p, 6, -226, 0.9, -20);
    p.f(circ(0, -226, 10), DS.c("green", 2)); gloss(p, -62, -160, 18, 34);
    [[-30, -90], [40, -60], [-10, -150], [60, -130], [-70, -50]].forEach(([x, y]) => p.f(circ(x, y, 4), DS.c("orange", 2), 0.6)); return p; },
  parrot: (S, g) => { const p = PK(S, g);
    p.t(tube([[0, -90], [-20, -30], [-40, 14], [-20, 30]], 16, 10).d, "red", { lw: PW * 0.8 });
    p.t(tube([[10, -90], [10, -30], [30, 14]], 14, 8).d, "blue", { lw: PW * 0.8 });
    p.l("M-120 -90 H120", DS.c("wood", 0), DS.w.near * 2.4);
    p.t(circ(0, -150, 62, 90), "red");
    p.t(circ(46, -138, 30, 56), "green", { lw: PW * 0.8 }); p.t(circ(-40, -120, 30, 62), "blue", { lw: PW * 0.8 });
    p.t(circ(12, -262, 48, 44), "red");
    p.t("M44 -270 Q96 -268 90 -222 Q80 -240 56 -240 Z", "yellow", { lw: PW * 0.7 });
    p.f(circ(22, -272, 14), DS.P.white[0]); p.f(circ(24, -270, 8), DS.P.ink[0]); p.f(circ(21, -273, 3), DS.P.white[0]);
    p.f(circ(-14, -246, 12, 7), DS.c("pink", 0), 0.6);
    p.t(`M-8 -300 q-14 -30 12 -34 q-6 14 6 22 Z`, "red", { lw: PW * 0.5 }); return p; },
  queen: (S, g) => { const p = PK(S, g);
    p.t("M-60 -190 L-140 0 L140 0 L60 -190 Z", "purple", { lw: PW });
    p.l("M-110 -40 Q0 -8 110 -40", DS.c("gold", 1), DS.w.near);
    p.f("M-12 -190 L-70 -20 L70 -20 L12 -190 Z", DS.c("purple", 1), 0.35);
    p.t(tube([[-58, -176], [-96, -130]], 14, 11).d, "dusk", { lw: PW * 0.7 }); p.t(tube([[58, -176], [96, -130]], 14, 11).d, "dusk", { lw: PW * 0.7 });
    p.t(circ(0, -200, 40, 22), "dusk", { lw: PW * 0.7 });
    p.t(circ(0, -266, 62, 64), "dusk");
    p.t("M-48 -306 Q0 -350 48 -306 Q48 -270 40 -250 Q0 -300 -40 -250 Q-48 -270 -48 -306 Z", "brown", { lw: PW * 0.5 });
    p.t("M-50 -318 L-50 -366 L-26 -340 L0 -378 L26 -340 L50 -366 L50 -318 Z", "gold", { lw: PW * 0.8 });
    p.f(circ(0, -350, 6), DS.c("red", 0)); p.f(circ(-30, -340, 5), DS.c("sky", 0)); p.f(circ(30, -340, 5), DS.c("sky", 0));
    eyes(p, 0, -266, 24, 8); smile(p, 0, -240, 14); blush(p, 0, -250, 40, 9); return p; },
  sun: (S, g) => { const p = PK(S, g);
    p.l(rays(0, -150, 120, 190, 16), DS.c("yellow", 2), DS.w.near * 2);
    p.t(circ(0, -150, 100), "yellow"); gloss(p, -40, -190, 20, 30);
    eyes(p, 0, -160, 34, 11); smile(p, 0, -126, 22); blush(p, 0, -136, 62, 14); return p; },
  tiger: (S, g) => { const p = PK(S, g);
    p.t(tube([[80, -40], [150, -60], [160, -130]], 14, 9).d, "orange");
    [-1, 1].forEach((s) => p.t(circ(s * 56, -26, 32, 22), "orange"));
    p.t(circ(0, -100, 86, 84), "orange"); p.f(circ(0, -80, 46, 54), DS.P.white[0], 0.85);
    [-1, 1].forEach((s) => p.t(circ(s * 82, -276, 30), "orange", { lw: PW * 0.7 }));
    p.t(circ(0, -206, 94, 84), "orange");
    [-1, 1].forEach((s) => { p.f(circ(s * 82, -272, 14), DS.c("pink", 0), 0.7); p.f(`M${s * 94} -240 l${-s * 26} 6 l${s * 4} 12 Z M${s * 94} -210 l${-s * 24} 2 l${s * 4} 12 Z M${s * 22} -280 l${s * 8} 24 l${-s * 14} -6 Z`, DS.P.navy[0], 0.85); });
    p.f("M-80 -140 l22 -8 l-6 16 Z M0 -296 l10 24 l-20 0 Z M-80 -112 l24 -2 l-8 14 Z M62 -112 l24 -2 l-8 14 Z", DS.P.navy[0], 0.85);
    p.f(circ(0, -178, 52, 36), DS.P.white[0], 0.9);
    eyes(p, 0, -224, 36, 12); p.f("M-12 -190 L12 -190 L0 -176 Z", DS.c("pink", 2)); p.l("M0 -176 V-166 M-20 -158 Q0 -146 20 -158", LN("red"), DS.w.near); blush(p, 0, -182, 70, 12); return p; },
  umbrella: (S, g) => { const p = PK(S, g);
    p.t(tube([[0, -150], [0, -20], [26, 8], [50, -14]], 8, 8).d, "gray", { lw: PW * 0.8 });
    p.t("M-190 -150 Q-170 -320 0 -330 Q170 -320 190 -150 Q146 -176 96 -150 Q48 -178 0 -150 Q-48 -178 -96 -150 Q-146 -176 -190 -150 Z", "red");
    p.f("M0 -330 Q-40 -280 -48 -166 Q-48 -178 0 -150 Q48 -178 48 -166 Q40 -280 0 -330 Z", DS.c("yellow", 0), 1);
    p.f("M-180 -170 Q-150 -300 -60 -322 Q-110 -260 -96 -152 Q-146 -176 -180 -170 Z", DS.P.white[0], 0.18); return p; },
  van: (S, g) => { const p = PK(S, g);
    p.t("M-190 -40 L-190 -190 Q-190 -220 -160 -220 L60 -220 Q100 -220 120 -180 L186 -120 Q200 -108 200 -90 L200 -40 Z", "sky", { lw: PW });
    p.f("M-170 -60 H200 V-40 H-190 Z", DS.c("sky", 2), 0.7);
    p.t("M-150 -194 H-30 V-120 H-150 Z", "glass", { flat: true, lw: PW * 0.6 }); p.t("M0 -194 H66 Q86 -194 96 -170 L116 -128 V-120 H0 Z", "glass", { flat: true, lw: PW * 0.6 });
    p.f("M-190 -96 H200 V-82 H-190 Z", DS.c("yellow", 0), 1);
    p.f(circ(190, -66, 12), DS.c("yellow", 1), 1);
    [-110, 110].forEach((x) => { p.t(circ(x, -30, 44), "navy", { lw: PW * 0.8 }); p.f(circ(x, -30, 18), DS.c("gray", 1)); p.f(circ(x - 12, -42, 8), DS.P.white[0], 0.6); }); return p; },
  watch: (S, g) => { const p = PK(S, g);
    p.t("M-44 -170 L-36 -270 L36 -270 L44 -170 Z", "red", { lw: PW * 0.8 }); p.t("M-44 -90 L-36 10 L36 10 L44 -90 Z", "red", { lw: PW * 0.8 });
    p.f(circ(0, -240, 7), DS.c("red", 2), 0.8); p.f(circ(0, -30, 7), DS.c("red", 2), 0.8);
    p.t(circ(0, -130, 106), "gold"); p.t(circ(0, -130, 84), "white", { flat: true, c: LN("gold"), lw: PW * 0.6 });
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; p.l(`M${Math.sin(a) * 66} ${-130 - Math.cos(a) * 66} L${Math.sin(a) * 76} ${-130 - Math.cos(a) * 76}`, DS.P.ink[1], DS.w.near); }
    p.l("M0 -130 L0 -190", DS.P.ink[0], DS.w.near * 1.6); p.l("M0 -130 L40 -112", DS.c("red", 0), DS.w.near * 1.6); p.f(circ(0, -130, 9), DS.P.ink[0]);
    p.t(circ(0, -246, 14), "gold", { lw: PW * 0.6 }); gloss(p, -48, -180, 12, 22); return p; },
  xylophone: (S, g) => { const p = PK(S, g);
    p.t("M-170 -20 L-140 -230 L-110 -230 L-120 -20 Z", "wood", { lw: PW * 0.8 }); p.t("M170 -20 L140 -230 L110 -230 L120 -20 Z", "wood", { lw: PW * 0.8 });
    ["red", "orange", "yellow", "green", "sky", "blue", "purple"].forEach((c, i) => { const h = 200 - i * 14, x = -128 + i * 38, w = 33; p.t(rrect(x - w / 2, -h - 20, w, h * 0.78, 12), c, { lw: PW * 0.7 }); p.f(circ(x, -h - 6, 5), DS.P.white[0], 0.8); });
    p.t(tube([[200, -220], [236, -300]], 7, 6).d, "wood", { lw: PW * 0.5 }); p.t(circ(240, -306, 20), "red", { lw: PW * 0.6 }); return p; },
  yak: (S, g) => { const p = PK(S, g);
    [-1, 1].forEach((s) => p.t(circ(s * 80, -50, 30, 46), "brown", { tone: 0 }));
    p.t(circ(0, -120, 126, 90), "brown"); p.t("M-126 -100 Q-130 -20 -96 -14 Q-80 -50 -60 -14 Q-30 -10 -10 -14 Q10 -50 30 -14 Q60 -10 80 -14 Q100 -50 126 -14 Q132 -80 126 -100 Z", "brown", { tone: 2, lw: PW * 0.6 });
    p.t(tube([[-122, -150], [-152, -190], [-148, -226]], 12, 6).d, "white", { lw: PW * 0.6, flat: true });
    p.t(tube([[122, -150], [152, -190], [148, -226]], 12, 6).d, "white", { lw: PW * 0.6, flat: true });
    p.t(circ(0, -214, 84, 90), "brown"); p.t(circ(0, -180, 54, 44), "wood", { tone: 1 });
    [-1, 1].forEach((s) => p.t(circ(s * 80, -270, 22, 14), "brown", { lw: PW * 0.6 }));
    p.f("M-60 -300 Q0 -250 60 -300 Q60 -262 40 -258 Q0 -280 -40 -258 Q-60 -262 -60 -300 Z", DS.c("brown", 2), 0.9);
    eyes(p, 0, -226, 38, 11); p.f(circ(-16, -186, 7, 5), DS.P.ink[0]); p.f(circ(16, -186, 7, 5), DS.P.ink[0]); smile(p, 0, -168, 14); return p; },
  zebra: (S, g) => { const p = PK(S, g);
    [[-70], [-34], [34], [70]].forEach(([x]) => p.t(circ(x, -40, 15, 40), "white", { tone: 1 }));
    p.t(circ(0, -116, 116, 64), "white");
    [-80, -48, -16, 16, 48, 80].forEach((x, i) => p.f(`M${x - 8} ${-176 + Math.abs(x) * 0.1} Q${x + 8} ${-120} ${x - 4} ${-62 - Math.abs(x) * 0.1} L${x + 10} ${-64 - Math.abs(x) * 0.1} Q${x + 24} ${-120} ${x + 8} ${-178 + Math.abs(x) * 0.1} Z`, DS.P.navy[0], 0.9));
    p.t(tube([[100, -180], [120, -240], [100, -290]], 38, 30).d, "white", { lw: PW * 0.8 });
    p.t(circ(126, -300, 58, 52), "white");
    p.t(circ(168, -278, 40, 32), "white", { lw: PW * 0.8 });
    [-1, 1].forEach((s) => p.t(circ(106 + s * 28, -350, 15, 26), "white", { lw: PW * 0.6 }));
    p.f("M92 -330 Q70 -280 90 -224 L104 -230 Q88 -280 108 -326 Z", DS.P.navy[0], 0.9);
    [[-4, -30], [6, 8]].forEach(([a, b]) => p.f(`M${112 + a * 4} -352 l${14} ${-b} l-6 28 Z`, DS.P.navy[0], 0.9));
    p.f(circ(112, -310, 10), DS.P.ink[0]); p.f(circ(109, -313, 3), DS.P.white[0]); p.f(circ(176, -276, 5), DS.P.ink[0]); blush(p, 138, -286, 0, 10);
    p.t(tube([[-114, -130], [-150, -100], [-146, -64]], 12, 8).d, "navy", { lw: PW * 0.5 });
    p.f(`M60 -300 l30 -2 l0 12 l-30 4 Z M64 -330 l30 4 l-4 12 l-26 -6 Z`, DS.P.navy[0], 0.9); return p; },
};
