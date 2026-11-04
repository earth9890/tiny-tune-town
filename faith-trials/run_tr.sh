cd ~/videos/tiny-tune-town/faith-trials
while pgrep -f run_g.sh >/dev/null; do sleep 30; done
PY="$HOME/Library/Application Support/VoiceStudio/runtime/project/.venv/bin/python"
for w in islam/*/takes/take-*-1.wav ganesha/*/takes/take-*-1.wav; do
  b=${w%.wav}; ffmpeg -y -loglevel error -i $w -ar 16000 -ac 1 $b.16k.wav
  langs=(en); [[ $w == *-ar/* ]] && langs=(ar en); [[ $w == islam/* ]] && langs+=(ar); [[ $w == ganesha* ]] && langs+=(hi)
  for l in $(printf "%s\n" "${langs[@]}" | sort -u); do lockf -t 3600 ~/videos/black-hole-life/.heavy.lock "$PY" -I transcribe_ft.py $b.16k.wav $l > $b.$l.json; done
done
echo trdone
