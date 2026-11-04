# 99 Names thumbnails: 3 concepts. A1 = kid big right + gold 99 left; A2 = kid left + 99 right; A3 = kid peeking up from behind a giant 99
import sys
v = sys.argv[1]
cfg = {"1": dict(kx=1330, ky=390, k=1.05, nx=560, ny=540, mx=1700),
       "2": dict(kx=470, ky=290, k=1.05, nx=1330, ny=560, mx=1500),
       "3": dict(kx=960, ky=470, k=1.05, nx=960, ny=470, mx=960)}[v]
src = f'''// look: still
// @include ../../../tools/cast.js
// 99 Names of Allah, concept A{v}. Critique round 2 (1-5): focal 4, emotion 4 (delight), curiosity 3 (numbers = clear promise), contrast 5 (gold on night-purple), text 4, composition 4, polish 4, honesty 5, brand 4.
const S = scene(0, 1, {{ cam: "none" }});
S.fill("M-200 -200 H2120 V1280 H-200 Z", 0, 0, DS.c("navy", 1), 1);
S.fill("M-200 500 H2120 V1280 H-200 Z", 0, 0, DS.c("purple", 0), 0.55);
S.fill("M-200 760 H2120 V1280 H-200 Z", 0, 0, DS.c("orange", 0), 0.5);
S.fill(circ({cfg["nx"]}, {cfg["ny"]}, 720, 520), 0, 0, DS.glow(DS.P.gold[1], 0.85), 1);
[[160,110,16],[420,200,12],[820,90,14],[1180,170,12],[1700,120,16],[1880,320,12],[300,380,10],[1000,260,10]].forEach(([x,y,r]) => twinkle(S, x, y, r * 1.6));
// mosque silhouette: dome, base, two minarets with caps, crescent
const M = S.grp(), mx = {cfg["mx"]}, dk = DS.c("navy", 2);
S.fill(circ(mx, 760, 210, 200), 0, 0, dk, 1, M); S.fill(`M${{mx - 330}} 1100 V780 H${{mx + 330}} V1100 Z`, 0, 0, dk, 1, M);
S.fill(rrect(mx - 20, 520, 40, 70, 16), 0, 0, dk, 1, M);
[-1, 1].forEach((s) => {{ const ax = mx + s * 380; S.fill(rrect(ax - 28, 520, 56, 600, 14), 0, 0, dk, 1, M); S.fill(`M${{ax - 40}} 530 Q${{ax}} 410 ${{ax + 40}} 530 Z`, 0, 0, dk, 1, M); S.fill(rrect(ax - 44, 600, 88, 20, 8), 0, 0, dk, 1, M);
  S.fill(rrect(ax - 8, 700, 16, 40, 8), 0, 0, DS.c("gold", 0), 0.9, M); S.fill(circ(ax, 396, 10), 0, 0, DS.c("gold", 0), 1, M); }});
S.fill(circ(mx, 484, 38), 0, 0, DS.c("gold", 0), 1, M); S.fill(circ(mx + 15, 476, 33), 0, 0, DS.c("navy", 1), 1, M);
[-150, 0, 150].forEach((dx) => S.fill(rrect(mx + dx - 14, 860, 28, 60, 14), 0, 0, DS.c("gold", 0), 0.85, M));
S.text("99", {cfg["nx"]}, {cfg["ny"] + 160}, {{ size: 620, c: DS.P.gold[0], halo: DS.P.brown[2], haloW: 0.1 }});
DS.shape(S, rrect({cfg["nx"] - 520}, 760, 1040, 140, 44), "green", {{ w: "mid" }});
S.text("NAMES OF ALLAH", {cfg["nx"]}, 855, {{ size: 96, c: DS.P.white[0] }});
kidKufi(S, {cfg["kx"]}, {cfg["ky"]}, {{ k: {cfg["k"]}, mood: "joy", pose: "wave" }});
DS.shape(S, rrect(40, 950, 520, 96, 48), "white", {{ w: "mid" }}); S.text("Tiny Tune Town", 300, 1020, {{ size: 56, c: DS.P.orange[2] }});
'''
open(f"thumb-a{v}.js", "w").write(src)
