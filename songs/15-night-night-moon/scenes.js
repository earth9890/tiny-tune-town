// look: still
// @include ../../tools/cast.js
// @include bedroom.js
// 15 Night-Night, Moon (original lullaby, 76 BPM). One continuous picture: Ollie's bedroom at night, no scene cuts at all.
// Each pass one friend yawns and falls asleep (Bibi, the fish, the star, the moon), then Ollie; at the end the moon opens
// its eyes and smiles over everyone. Camera: very slow (every move 2 s), one framing change every 4.5-13 s: the friend on its
// slot line, back to the room, Ollie's face on every "Sleep tight" tag. Name cards sit beside each friend so zooms never crop them.
BEAT = 60 / 76;
const MOVE = 2, TWO = [1230, 560], LOOKUP = [960, 300];
const S = scene(0, TOTAL, { cam: "none" });
const R = bedroom(S, {}), O = R.O, B = R.B, F = R.F, St = R.St, M = R.M;
const cam = (P, k, t) => S.zoom(...P, k, t, MOVE);
// zoom so that point P lands on screen point Q (S.zoom scales about its anchor A: P -> A + k(P - A))
const look = (P, k, Q, t) => cam([(k * P[0] - Q[0]) / (k - 1), (k * P[1] - Q[1]) / (k - 1)], k, t);
const card = (s, x, y, t, t1, size = DS.type.body) => S.fadeOut(DS.card(S, s, x, y, { size, t }).g, t1, 0.5);
const sing = (c, n) => { for (let i = 0; i < n; i++) O.sing(W(c, i), WE(c, i)); };
const ZZ = { bibi: [480, 420, 1], fish: [1540, 580, 0.6], star: [1300, 120, 0.7], moon: [840, 160, 0.8], ollie: [1110, 330, 1.1] };
const Zs = (who, t) => zz(S, ZZ[who][0], ZZ[who][1], t, TOTAL, ZZ[who][2]);

// gentle life all song: Ollie rocks to the lullaby, the star and moon sway
O.sway(0.3, 140);
tw(St.g, 0.3, 74, `rotate(0 ${St.x} ${St.y})`, `rotate(8 ${St.x} ${St.y})`, wave(cyc(74, 8 * BEAT)));

// intro (0-13): wide room, "BEDTIME!", then a look up at the moon and the star
card("BEDTIME!", 960, 140, 1.2, 4.6);
cam(LOOKUP, 1.4, 5.5);
sparkle(S, MOON_P[0] + 60, MOON_P[1] - 70, 7.2, 0.8); sparkle(S, STAR_P[0] - 60, STAR_P[1] + 50, 8.4, 0.7);
M.yawn(8.2, 1.4);
cam(FACE, 1, 10);

// pass 1 BIBI (13-38): waves on her name, yawns, eyes close on "close"; Ollie yawns along, close-up on the tag
card("BIBI", 640, 500, W(1, 1), W(1, 1) + 4, DS.type.small);
swing(S, B.A.R, W(1, 1), W(1, 1) + 4 * BEAT, { rotation: -18, svgOrigin: B.A.R.sh }, BEAT);
look(BIBI_P, 2.2, [960, 560], W(1, 1) + 0.6);   // friend centred, Ollie's eyes off frame
B.yawn(W(1, 2), WE(1, 4) - W(1, 2));
B.sleep(W(2, 3)); Zs("bibi", WE(2, 5));
cam(FACE, 1, 24.3);
O.yawn(W(3, 2), 2.2);
cam(FACE, 1.6, 30.6); sing(4, 8);

// pass 2 FISHY (38-65): two-shot fish + Ollie; the fish yawns, then sleeps and sinks on the second "fishy"
cam(TWO, 1.35, 38.2);
card("FISHY", 1490, 500, W(5, 1), W(5, 1) + 4, DS.type.small);
F.swim(38, W(7, 3), 10);
F.yawn(W(5, 2), WE(5, 3) - W(5, 2)); sing(6, 8);
cam(FACE, 1, 45.6);
look(FISH_P, 2.3, [960, 560], 50);
F.yawn(W(7, 2), WE(7, 3) - W(7, 2)); F.sleep(WE(7, 3)); Zs("fish", WE(7, 3) + 0.6);
cam(FACE, 1.6, 55); sing(8, 8);
cam(FACE, 1, 60.5);
cam(FACE, 1.25, 64.6); O.yawn(W(10, 0), 1.4); O.yawn(W(10, 1), 1.2);   // "Yawn… yawn…"

// pass 3 STAR (69.5-87.6): twinkles, yawns, eyes close and its glow softens
look(STAR_P, 2.8, [960, 400], 69.3);
card("STAR", 1410, 250, W(11, 1), W(11, 1) + 4, DS.type.caption);
sparkle(S, STAR_P[0] + 60, STAR_P[1] - 60, W(11, 2), 0.7);
St.yawn(W(11, 3), WE(11, 4) - W(11, 3));
St.sleep(W(12, 2)); op(St.glow, W(12, 2), 1, 0.45, 1.2); Zs("star", WE(12, 4));
cam(FACE, 1, 75.8);
O.yawn(W(13, 3), 1.6);
cam(FACE, 1.6, 79.9); sing(15, 8);

// pass 4 MOON (90.7-111): "Shhh…", the moon yawns three times, a cloud tucks it in, its eyes close
look(MOON_P, 2.8, [960, 520], 89);
card("MOON", 610, 330, W(16, 1), W(16, 1) + 4, DS.type.caption);
M.yawn(W(16, 2), WE(16, 4) - W(16, 2));
M.sleep(W(17, 3)); Zs("moon", WE(17, 5));
{ const g = G(S, null, "translate(320 0)"), C = [[-70, 58, 36], [-24, 44, 44], [30, 48, 42], [76, 62, 32], [0, 74, 38]];
  C.forEach(([x, y, r]) => S.draw(circ(MOON_P[0] + x, MOON_P[1] + y, r), S.start, 0, { c: DS.line(), w: DS.w.near * 2, parent: g }));
  C.forEach(([x, y, r]) => S.fill(circ(MOON_P[0] + x, MOON_P[1] + y, r), S.start, 0, DS.P.white[0], 1, g));
  hid(g); op(g, W(17, 0), 0, 1, 1); tw(g, W(17, 0), 3.2, "translate(320 0)", "translate(0 0)", "sine.inOut");
  tw(g, 151.6, 3.4, "translate(0 0)", "translate(-300 30)", "sine.inOut"); op(g, 152.6, 1, 0, 2.2); }   // the cloud drifts off for the last smile
cam(FACE, 1.6, 103.5); O.yawn(W(18, 3), 1.6); sing(19, 8);

// "Now, Ollie" (111-118.5): softer mid shot
cam(FACE, 1.25, 111.3);

// final pass OLLIE (118.5-143): big yawn, eyes close on "close your eyes", the whole sleepy room on "I love you", asleep on the tag
cam(FACE, 1.6, 118.3);
card("OLLIE", 1300, 300, W(21, 1), W(21, 1) + 3.5);
O.yawn(W(21, 2), WE(21, 4) - W(21, 2));
cam(FACE, 1, 129.8);
[[790, 330, 0.9], [1130, 300, 1.1], [960, 230, 0.8]].forEach(([x, y, k], i) => { const t = W(23, 4) + i * 0.3, g = G(S, null, "translate(0 0)");   // hearts rise and fade
  S.draw(heartPath(x, y, k), t, 0, { fill: DS.c("red", 1), c: DS.c("red", 2), w: DS.w.detail, parent: g });
  tw(g, t, 4, "translate(0 0)", "translate(0 -140)", "sine.out"); op(g, t + 3, 1, 0, 1); });
cam(FACE, 1.6, 136);
sing(24, 6); O.sleep(W(24, 6)); O.lift(26, W(24, 6), 1.6); Zs("ollie", WE(24, 7) + 0.4);

// outro (143-170): "Shhh…", pull back; the moon peeks out from its cloud and smiles; NIGHT-NIGHT
cam(FACE, 1, 144.5);
look(MOON_P, 2.8, [960, 520], 151);
M.wake(153.4); M.grin(155); sparkle(S, MOON_P[0] + 70, MOON_P[1] - 70, 155.4, 0.9); sparkle(S, MOON_P[0] - 80, MOON_P[1] - 40, 156.2, 0.7);
cam(FACE, 1, 159.5);
card("NIGHT-NIGHT!", 960, 118, 161.4, 165, DS.type.small);
S.text("Tiny Tune Town", 960, 128, { size: DS.type.body, c: DS.P.yellow[0], halo: DS.P.ink[0], haloW: 0.14, t: 165.6 });
DS.vignette(S);
