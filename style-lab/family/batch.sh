#!/bin/bash
# Every family still in one run; call it under the snap lock: lockf -t 3000 ~/videos/black-hole-life/.snap.lock batch.sh NAME...
# usage: batch.sh NAME...  (NAME = src/NAME.js in this lab, or brand:avatar / brand:banner / brand:thumb)
set -e; D="$(cd "$(dirname "$0")" && pwd)"; T="$D/../.."; B=~/.claude/skills/whiteboard-video-studio/scripts/build.py; J=()
for n in "$@"; do case $n in
  brand:thumb) python3 $B "$T/brand/thumb-template" --thumb thumbnails/thumb-a.js _still/thumb.png >/dev/null; J+=("$T/brand/thumb-template/_still/thumb.html|$D/_build/thumb-1920.png");;
  brand:*) m=${n#brand:}; python3 $B "$T/brand" --thumb $m.js _still/$m.png >/dev/null; J+=("$T/brand/_still/$m.html|$D/_build/$m-1920.png");;
  *) python3 $B "$D" --thumb src/$n.js _build/$n.png >/dev/null; J+=("$D/_build/$n.html|$D/$n.png");;
esac; done
bash -c 'for j in "$@"; do h=${j%%|*}; o=${j##*|}; "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080 --virtual-time-budget=5000 --screenshot="$o" "file://$h" 2>/dev/null; echo "$o"; done' _ "${J[@]}"
