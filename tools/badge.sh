#!/bin/zsh
# Stamp the Tiny Tune Town badge bottom-left on a 1280x720 thumbnail (same size and place on every thumbnail).
# usage: tools/badge.sh thumbnails/a.png   (overwrites; keeps a.nobadge.png)
set -e
B=${0:A:h}/../brand/badge.png
for f in "$@"; do
  cp "$f" "${f:r}.nobadge.png"
  magick "$f" \( "$B" -resize x150 \) -gravity southwest -geometry +22+22 -composite "$f"
done
