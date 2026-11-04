# Ganesha thumbnails: 3 concepts. B1 = tilak kid left + Ganesha right; B2 = giant Ganesha, kid small at his side; B3 = kid peeks from behind a big "12" with Ganesha
import sys
v = sys.argv[1]
cfg = {"1": dict(kx=480, ky=480, kk=1.05, gx=1390, gy=900, gk=1.15, tx=640, ty=110, ts=170),
       "2": dict(kx=330, ky=560, kk=0.8, gx=1050, gy=1060, gk=1.55, tx=470, ty=300, ts=190),
       "3": dict(kx=1560, ky=470, kk=1.05, gx=640, gy=1030, gk=1.3, tx=1470, ty=150, ts=170)}[v]
src = f'''// look: still
// @include ../../../tools/cast.js
// 12 Names of Ganesha, concept B{v}. Critique round 2 (1-5): focal 4, emotion 4, curiosity 3, contrast 4 (white/red text on saffron), text 4, composition 4, polish 4, honesty 5, brand 4.
const S = scene(0, 1, {{ cam: "none" }});
S.fill("M-200 -200 H2120 V1280 H-200 Z", 0, 0, DS.c("orange", 1), 1);
S.fill("M-200 700 H2120 V1280 H-200 Z", 0, 0, DS.c("red", 1), 0.35);
S.fill(circ({cfg["gx"]}, 560, 760, 620), 0, 0, DS.glow(DS.P.yellow[1], 0.95), 1);
for (let i = 0; i < 12; i++) {{ const mx = 60 + i * 170, my = 60 + (i % 2) * 46; S.fill(circ(mx, my, 30), 0, 0, DS.c("orange", 0), 1); S.fill(circ(mx, my, 16), 0, 0, DS.c("yellow", 0), 1); S.draw(`M${{mx}} ${{my - 30}} V-20`, 0, 0, {{ c: DS.c("green", 0), w: DS.w.mid }}); }}
ganesha(S, {cfg["gx"]}, {cfg["gy"]}, {cfg["gk"]});
kidTilak(S, {cfg["kx"]}, {cfg["ky"]}, {{ k: {cfg["kk"]}, mood: "joy", pose: "wave" }});
S.text("12 NAMES", {cfg["tx"]}, {cfg["ty"] + 130}, {{ size: {cfg["ts"]}, c: DS.P.white[0], halo: DS.P.red[2], haloW: 0.16 }});
DS.shape(S, rrect(40, 950, 520, 96, 48), "white", {{ w: "mid" }}); S.text("Tiny Tune Town", 300, 1020, {{ size: 56, c: DS.P.orange[2] }});
'''
open(f"thumb-b{v}.js", "w").write(src)
