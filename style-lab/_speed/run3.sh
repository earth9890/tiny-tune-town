#!/bin/sh
HF=$(command ls -d ~/.npm/_npx/*/node_modules/.bin/hyperframes | head -1)
for v in t1 t2nograde t2; do s=$(date +%s); env HF_CAPTURE_PARALLEL_STREAM=true PRODUCER_EXPERIMENTAL_FAST_CAPTURE=false $HF render --quality delivery --experimental-fast-capture=false --start 28 --end 30 --output $PWD/$v/out.mp4 $v >/dev/null 2>&1; echo "$v $(( $(date +%s) - s )) s load $(uptime | sed 's/.*averages: //')"; done
