cd ~/videos/tiny-tune-town/faith-trials
PY="$HOME/Library/Application Support/VoiceStudio/runtime/project/.venv/bin/python"
for sc in "${@}"; do c=${sc%:*}; S=${sc#*:}
  d=chunks/c$c
  [ -f $d/takes/take-$S-1.wav ] || lockf -t 7200 ~/videos/black-hole-life/.heavy.lock ~/.local/bin/uv run --frozen --project ~/tools/ACE-Step-1.5 python sing_ft.py $d/song.md --seed $S --lang en
  b=$d/takes/take-$S-1
  [ -f $b.en.json ] || { ffmpeg -y -loglevel error -i $b.wav -ar 16000 -ac 1 $b.16k.wav; lockf -t 7200 ~/videos/black-hole-life/.heavy.lock "$PY" -I transcribe_ft.py $b.16k.wav en > $b.en.json; }
  echo re $c $S done $(date +%T)
done; echo redone
