// look: still
// @include ../../tools/cast.js
// @include art.js
// 09 Hickory Dickory Dock (traditional, 1744). A cosy living room with a big smiling grandfather clock whose pendulum ticks on the beat.
// Each pass a new friend arrives, runs up the clock, the clock strikes the hour (big number + bongs + the hour hand moves), the friend
// runs down and climbs onto Ollie: mouse on his head, bird and frog on raised arms, duck on a curled arm. Finale: everyone dances,
// counts 1-2-3-4 and Ollie hugs his friends by the clock. Camera per pass: wide (entrance) -> clock push (up + strike)
// -> two-shot (down + sound) -> face close-up on the tag. No hard cuts, nothing under 4 s, cards fade before close-ups.
// Clip numbers = the sung lines of take 42 (script.json). The take runs passes together with almost no breaks, so each
// friend enters during the end of the previous pass (the bird peeks in at the window) and the passes are planned one by one.
BEAT = 60 / 116;

const LAST = (c) => CLIP(c)[1];                                // end of a sung line

// ---------- layout ----------
const OX = 1080, OGY = 930, OK = 1.1;                          // Ollie
const FACE = [OX, OGY - 330 * OK];
const TOB = ([x, y]) => [(x - OX) / OK, (y - OGY) / OK];      // scene -> Ollie body units (friends ride on Ollie)
const CLOSE = [940, FACE[1]];                                  // face close-up anchor: Ollie right of centre, the clock's whole face at the left
const wide = (S, t) => S.zoom(...FACE, 1, t, 1.3), close = (S, t) => S.zoom(...CLOSE, 1.55, t, 1.3);
const clockShot = (S, t) => S.zoom(CX + 40, 330, 1.35, t, 1.3), twoShot = (S, t) => S.zoom(900, 600, 1.2, t, 1.3);
const BASE = [CX + 140, CGY - 4], TOP = [CX, 214];             // where friends start their climb / sit on the crown

const SOUND = { mouse: "SQUEAK!", bird: "TWEET!", frog: "RIBBIT!", duck: "QUACK!" };
const FK = 0.95 / OK;                                                                                          // friend scale in Ollie's body units
const tfm = (p, dir = 1, k = FK) => `translate(${K(p[0])} ${K(p[1])}) scale(${K(k * dir * 100) / 100} ${K(k * 100) / 100})`;
const place = (F, p, dir = 1) => { F.p = p; F.dir = dir; F.g.setAttribute("transform", tfm(p, dir)); };
// move through scene points (feet), one even segment each; turns to face the way it goes; hops/flaps on the way
const go = (S, F, pts, t0, dur, hopH = 16) => {
  const seg = dur / pts.length;
  pts.forEach((sp, i) => {
    const q = TOB(sp), t = t0 + i * seg, dir = Math.abs(q[0] - F.p[0]) > 4 ? Math.sign(q[0] - F.p[0]) : F.dir;
    if (dir !== F.dir) tl.set(F.g, { attr: { transform: tfm(F.p, dir) } }, t);
    tw(F.g, t, seg, tfm(F.p, dir), tfm(q, dir), "sine.inOut"); F.p = q; F.dir = dir;
  });
  tw(F.h, t0, dur, "translate(0 0)", `translate(0 ${-hopH})`, hump(cyc(dur, BEAT / 2)));
  if (F.wing) tw(F.wing, t0, dur, F.wing.getAttribute("transform"), F.wing.getAttribute("transform").replace("rotate(0", "rotate(-28"), wave(cyc(dur, BEAT / 3)));
};
const hop = (S, F, t, h = 26) => tw(F.h, t, 0.32, "translate(0 0)", `translate(0 ${-h})`, hump(1));
const bobAll = (S, Fs, t0, t1) => Fs.forEach((F, i) => tw(F.b, t0, t1 - t0, "translate(0 0)", "translate(0 -6)", hump(cyc(t1 - t0, 2 * BEAT))));

// where each friend sits on Ollie (body units); arms raise to hold the bird and the frog
const PERCH = { mouse: { at: [6, -494] }, bird: { arm: [0, 1, 70] }, frog: { arm: [0, -1, 50] }, duck: { arm: [1, -1, 30], dir: -1 } };
const ORDER = ["mouse", "bird", "frog", "duck"];
const perchAt = (O, kind, t, dur = 0.5) => {
  const P = PERCH[kind];
  if (!P.arm) return P.at;
  const A = O.arms.find((A) => A.ai === P.arm[0] && A.side === P.arm[1]);
  if (dur < 0.05) { A.cur = P.arm[2] * A.side; A.pose.setAttribute("transform", `rotate(${A.cur} ${A.x} ${A.y})`); }   // already holding: no tween, right from the crossfade
  else O.raise(A, P.arm[2], t, dur);
  const [x, y] = O.tipNow(A); return [x, y - 8];
};

// ---------- the living room ----------
const room = (S) => {
  DS.room(S, { window: [1320, 160, 210, 240] });
  for (let x = 400; x < 1560; x += 60) S.draw(`M${x} 90 V738`, S.start, 0, { c: DS.c("wall", 2, "mid"), w: DS.w.hair, op: 0.35 });   // soft wallpaper stripes
  [1290, 1538].forEach((x) => DS.shape(S, rrect(x, 140, 34, 300, DS.r.sm), "green", { layer: "mid", w: "mid" })); // curtains
  DS.frame(S, 690, 190, 160, 120, "sky");
  DS.shadow(S, 1700, 900, 380);                                                                                 // armchair
  DS.shape(S, rrect(1590, 560, 270, 280, DS.r.lg), "purple", { layer: "mid" });
  DS.shape(S, rrect(1560, 730, 330, 170, DS.r.lg), "purple", { layer: "mid" });
  DS.shape(S, rrect(1570, 690, 64, 140, DS.r.md), "purple", { layer: "mid", tone: 1 });
  DS.rug(S, OX, OGY, 860, "sky");
};
// set + clock + Ollie + friends already perched (ORDER up to `have`). draw(O, C) runs before the foreground plant.
const living = (S, o = {}, draw) => {
  room(S);
  const C = grandClock(S, { hour: o.hour || 0 });
  const O = ollie(S, OX, OGY, OK, { mouth: o.mouth || "smile", look: o.look || 0 });
  const Fs = ORDER.slice(0, o.have || 0).map((kind) => { const F = buddy(S, kind, O.body); place(F, perchAt(O, kind, S.start, 0.01), PERCH[kind].dir || 1); return F; });
  if (draw) draw(O, C, Fs);
  DS.plant(S, 40, 1130, 0.95, 1);
  DS.vignette(S);
  return { O, C, Fs };
};

// ---------- one pass: o = { n hour, kind, t0, t1, enter [t0, t1], up [t0, t1], strike t, down [t0, t1], hops [[clip, nWords]], cards [[clip, fadeAt]], sing [[t0, t1]], cam(S) } ----------
const ENTER = {
  bird: [[1020, 150], [760, 160], TOP],                                              // from the window sill, over Ollie's head, straight up onto the clock
  frog: [[180, 950], BASE],                                                          // hops in from the left
  duck: [[180, 950], BASE],                                                          // waddles in from the left
};
const START = { mouse: BASE, bird: [1425, 412], frog: [-80, 950], duck: [-80, 950] };
const UP = [[CX + 128, 700], [CX + 170, 480], [CX + 96, 236], TOP];
const DOWN = { mouse: [[CX + 170, 480], BASE, [790, 905], [880, 650], [950, 420]], bird: [[640, 330]], frog: [[CX + 170, 480], BASE, [1000, 958], [1320, 958], [1430, 760]], duck: [[CX + 170, 480], BASE, [900, 958], [1300, 958]] };
let S0;                                                                              // the pass being built (for extra())
const pass = (o) => {
  const S = scene(o.t0, o.t1, { cam: "none" }), kind = o.kind; S0 = S;
  living(S, { have: o.n - 1, hour: o.n - 1 }, (O, C, Fs) => {
    const F = buddy(S, kind, O.body);
    place(F, TOB(START[kind]), START[kind][0] > OX ? -1 : 1);
    if (o.enter) { if (kind !== "bird") fadeIn(S, F.g, o.enter[0] - 0.3); go(S, F, ENTER[kind], o.enter[0], o.enter[1] - o.enter[0], kind === "bird" ? 6 : 18); }
    if (o.up) go(S, F, UP, o.up[0], o.up[1] - o.up[0], 10);                          // runs up the clock
    C.strike(o.n, o.strike);
    for (let i = 0; i < o.n; i++) hop(S, F, o.strike + i * 2 * BEAT, 18);             // hops with each bong
    S.fadeOut(num(S, o.n, CX + 300, 226, o.strike).g, o.numOut, 0.4);
    const end = perchAt(O, kind, o.down[1] - 0.5, 0.5);
    go(S, F, DOWN[kind].concat([[OX + end[0] * OK, OGY + end[1] * OK]]), o.down[0], o.down[1] - o.down[0], kind === "bird" ? 6 : 14);
    if (PERCH[kind].dir) tl.set(F.g, { attr: { transform: tfm(end, PERCH[kind].dir) } }, o.down[1] + 0.05);   // turn to face Ollie
    o.hops.forEach(([c, n]) => { for (let i = 0; i < n; i++) hop(S, F, W(c, i), 30); });     // bounces on every sound word
    o.cards.forEach(([c, out]) => S.fadeOut(DS.card(S, SOUND[kind], OX, 170, { size: DS.type.title, t: W(c, 0) }).g, out, 0.4));
    let g0 = W(o.hops[0][0], 0) - 0.1;
    o.sing.forEach(([a, b]) => {
      if (a - 0.1 > g0) O.grin(g0, a - 0.1);
      O.sing(a, b); g0 = b + 0.1;
      tw(O.body, a, b - a, "rotate(0 0 -250)", "rotate(5 0 -250)", wave(cyc(b - a, 2 * BEAT)));   // tick tock sway
    });
    bobAll(S, Fs, S.start, S.end);
    if (o.extra) o.extra(O, C, Fs);
  });
  o.cam(S);
  return S;
};

// 0  intro (0-12.3): the clock ticks in the quiet room, Ollie bobs along; "Ooh!" - a mouse peeks out of the clock's little door; "Tick tock!"
const T0 = W(4, 0) - 0.6;
{ const S = scene(0, T0, { cam: "none" });
  living(S, { mouth: "smile" }, (O, C) => {
    O.bob(S.start + 0.4, S.end, 8);
    O.sing(W(2, 0), LAST(2)); O.sing(W(3, 0), LAST(3));
    const F = buddy(S, "mouse", null);
    F.g.setAttribute("transform", tfm(BASE, 1, 0.95));
    fadeIn(S, F.g, S.start + 1.2); hop(S, F, W(2, 0), 20); hop(S, F, W(2, 1), 20); hop(S, F, W(3, 0), 20); hop(S, F, W(3, 1), 20);
  });
  S.zoom(CX + 60, 640, 1.5, S.start + 0.6, 1.6);                                    // look at the little door
  S.zoom(...FACE, 1, 8.0, 1.6); }

// 1  ONE - the mouse (12.3-30.9): runs up, the clock strikes one, runs down onto Ollie's head; the bird appears at the window on the tag
pass({ n: 1, kind: "mouse", t0: T0, t1: LAST(11) - 0.3, up: [W(5, 1), LAST(5) + 0.4], strike: W(7, 3), numOut: W(9, 0) - 0.3,
  down: [W(8, 1), LAST(8) + 0.9], hops: [[9, 3], [10, 3]], cards: [[9, W(11, 0) - 0.9]], sing: [[W(11, 0), LAST(11)]],
  extra: () => { const B = buddy(S0, "bird", null); B.g.setAttribute("transform", `translate(${START.bird[0]} ${START.bird[1]}) scale(-0.95 0.95)`); fadeIn(S0, B.g, W(11, 2)); }, cam: (S) => { clockShot(S, W(5, 0) - 0.5); S.zoom(CX + 40, 300, 1.55, W(7, 0) - 0.2, 2.2, "sine.inOut"); twoShot(S, W(8, 0) - 0.3); close(S, W(11, 0) - 0.5); } });

// 2  TWO - the bird (36.1-59.3): flies from the window up onto the clock, "tweet tweet" as it strikes two, flies down to Ollie's arm
pass({ n: 2, kind: "bird", t0: LAST(11) - 0.3, t1: LAST(19) - 0.25, enter: [W(12, 0) - 0.4, LAST(13) - 0.2], strike: W(14, 0), numOut: W(15, 0) + 0.6,
  down: [W(15, 0), LAST(15) + 0.6], hops: [[14, 2], [17, 3], [18, 3]], cards: [[17, W(19, 0) - 0.9]], sing: [[W(16, 0), LAST(16)], [W(19, 0), LAST(19)]],
  cam: (S) => { S.zoom(CX + 200, 420, 1.15, W(12, 0) + 0.5, 3, "sine.inOut"); clockShot(S, W(13, 2)); close(S, W(16, 0) - 0.5); twoShot(S, W(17, 0) - 0.5); close(S, W(19, 0) - 0.5); } });

// 3  THREE - the frog (59.3-89.6): hops in, up the clock, strikes three, hops down onto Ollie's right arm; two ribbits, two tags
pass({ n: 3, kind: "frog", t0: LAST(19) - 0.25, t1: LAST(30) - 0.2, enter: [W(20, 0) - 0.4, LAST(20) + 0.1], up: [W(21, 0), LAST(21) + 0.5], strike: W(22, 3), numOut: W(24, 0) - 0.3,
  down: [W(23, 1), LAST(23) + 0.9], hops: [[24, 3], [27, 3]], cards: [[24, W(25, 0) - 0.9], [27, W(28, 0) - 0.9]], sing: [[W(25, 0), LAST(26)], [W(28, 0), LAST(30)]],
  cam: (S) => { S.zoom(CX + 120, 420, 1.3, W(21, 0) - 0.3, 3.4, "sine.inOut"); twoShot(S, W(23, 0) - 0.3); close(S, W(25, 0) - 0.5); twoShot(S, W(27, 0) - 0.5); close(S, W(28, 0) - 0.5); S.zoom(OX, 560, 1.25, W(30, 0), 3, "sine.inOut"); } });

// 4  FOUR - the duck (89.6-115.5): waddles in during the break, up the clock, strikes four, waddles down onto Ollie's curled arm
pass({ n: 4, kind: "duck", t0: LAST(30) - 0.2, t1: W(38, 0) - 0.4, enter: [LAST(30) + 0.8, W(31, 0) + 0.6], up: [W(32, 1), LAST(32) + 0.4], strike: W(33, 3), numOut: W(35, 0),
  down: [W(34, 1), LAST(34) + 0.9], hops: [[35, 4]], cards: [], sing: [[W(36, 0), LAST(37)]],
  cam: (S) => { clockShot(S, W(32, 0) - 0.5); S.zoom(CX + 40, 300, 1.55, W(33, 0) - 0.2, 2, "sine.inOut"); twoShot(S, W(34, 0) - 0.3); close(S, W(36, 0) - 0.5); } });

// 5  finale (115.5-170): "Everybody dance!" - everyone dances by the clock, counts the friends 1-2-3-4 (sung "two, three, four"; card 1 lands on the beat before), sings the tag, hearts; bye-bye
{ const S = scene(W(38, 0) - 0.4, TOTAL, { cam: "none" });
  living(S, { have: 4, hour: 4 }, (O, C, Fs) => {
    C.dance(S.start + 0.4, S.end - 0.5); C.grin(S.start + 0.4);
    O.grin(S.start + 0.4, W(44, 0) - 0.1);
    O.bob(S.start + 0.4, W(44, 0), 10);
    tw(O.body, W(44, 0), LAST(45) - W(44, 0), "rotate(0 0 -250)", "rotate(5 0 -250)", wave(cyc(LAST(45) - W(44, 0), 2 * BEAT)));
    O.sing(W(44, 0), LAST(45)); O.grin(LAST(45) + 0.1, W(46, 0) - 0.1); O.sing(W(46, 0), LAST(46)); O.grin(LAST(46) + 0.1);
    O.bob(LAST(45), S.end - 0.5, 10);
    O.wiggle([5, 6, 7, 8], S.start + 0.6, W(41, 0) - 0.2, 12, BEAT);
    bobAll(S, Fs, S.start, S.end);
    Fs.forEach((F, i) => { const [dx, dy] = F.kind === "duck" ? [180, -70] : [0, -190];          // count the friends
      S.fadeOut(num(S, i + 1, OX + F.p[0] * OK + dx, OGY + F.p[1] * OK + dy, i ? W(41, i - 1) : CLIP(41)[0] - 0.4).g, W(44, 0) - 0.9, 0.4); });
    [42, 43].forEach((c) => Fs.forEach((F, i) => hop(S, F, W(c, i), 32)));
    hearts(S, W(46, 0), [[OX - 260, 300, 0.9], [OX + 250, 280, 1], [OX, 220, 1.1], [CX, 150, 0.8]]);
    O.raise(O.arms.find((A) => A.ai === 2 && A.side === 1), 60, W(47, 0) - 0.6, 0.6);
    O.wiggle([6], W(47, 0), S.end - 1.2, 14, BEAT);                                  // bye-bye wave (the other arms hold friends)
  });
  clockShot(S, 121.0);                                                               // the clock dances and grins in the break
  wide(S, W(39, 0) - 0.6);
  S.zoom(OX, 560, 1.15, W(41, 0) - 0.6, 1.2);                                        // gather on the counting
  close(S, W(44, 0) - 0.5);
  wide(S, LAST(45) + 0.2);
  S.zoom(780, 520, 1.12, W(47, 0) + 0.5, 3, "sine.inOut");                           // drift to frame clock + Ollie for the goodbye
  S.text("Tiny Tune Town", 960, 130, { size: DS.type.title, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: TOTAL - 4.5 }); }
