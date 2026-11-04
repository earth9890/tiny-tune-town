// look: still
// @include ../../../tools/cast.js
const S = scene(0, 1, { cam: "none" });
DS.outdoor(S, { hy: 760, sun: [1560, 120] });
kidKufi(S, 200, 250, { k: 0.78 }); kidHijab(S, 500, 250, { k: 0.78, mood: "joy" });
kidTilak(S, 800, 250, { k: 0.78 }); kidBindi(S, 1100, 250, { k: 0.78, mood: "joy" });
ganesha(S, 1580, 900, 0.9);
DS.vignette(S, 0.1);
