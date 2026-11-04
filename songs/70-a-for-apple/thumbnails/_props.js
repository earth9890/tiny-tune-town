// look: still
// @include ../../../tools/cast.js
// @include ../props.js
const S = scene(0, 1, { cam: "none" });
S.fill("M-200 -200 H2200 V1400 H-200 Z", 0, 0, DS.P.sky[1], 1);
const names = ["apple", "ball", "cat", "dog", "elephant", "fish", "goat", "hat", "icecream", "jug", "kite", "lion", "mango", "nest", "orange", "parrot", "queen", "rabbit", "sun", "tiger", "umbrella", "van", "watch", "xylophone", "yak", "zebra"];
names.forEach((n, i) => {
  const x = 150 + (i % 7) * 270, y = 290 + Math.floor(i / 7) * 265, k = 0.72;
  const g = G(S, null, `translate(${x} ${y}) scale(${k})`);
  if (n === "dog") puppy(S, x, y, 1.0);
  else if (n === "fish") fish(S, x, y - 100, 1.2, "yellow", 1);
  else if (n === "rabbit") bibi(S, x, y - 215, { k: 0.65, mood: "joy" });
  else PROP[n](S, g);
  S.text(n, x, y + 40, { size: 30, c: DS.P.ink[0] });
});
