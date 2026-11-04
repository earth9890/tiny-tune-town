#!/bin/bash
# usage: style-lab/family/render.sh NAME   ->  src/NAME.js rendered to NAME.png (1920x1080); heavy lock shared with the other agents
set -e; D="$(cd "$(dirname "$0")" && pwd)"; N="$1"
lockf -t 3000 ~/videos/black-hole-life/.heavy.lock bash -c "
python3 ~/.claude/skills/whiteboard-video-studio/scripts/build.py '$D' --thumb src/$N.js _build/$N.png >/dev/null &&
'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080 --virtual-time-budget=5000 --screenshot='$D/$N.png' 'file://$D/_build/$N.html' 2>/dev/null"
echo "$D/$N.png"
