#!/bin/bash
# usage: still.sh PROJECT_DIR JS(relative to project) OUT.png  -> 1920x1080 PNG (Chrome 1x), heavy lock shared with the other agents
set -e; P="$(cd "$1" && pwd)"; J="$2"; O="$3"; B="$P/_still"; mkdir -p "$B"
lockf -t 3000 ~/videos/black-hole-life/.heavy.lock bash -c "
python3 ~/.claude/skills/whiteboard-video-studio/scripts/build.py '$P' --thumb '$J' '_still/x.png' >/dev/null &&
'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080 --virtual-time-budget=5000 --screenshot='$O' 'file://$B/x.html' 2>/dev/null"
trash "$B"; echo "$O"
