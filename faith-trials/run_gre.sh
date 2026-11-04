cd ~/videos/tiny-tune-town/faith-trials
PY="$HOME/Library/Application Support/VoiceStudio/runtime/project/.venv/bin/python"
for S in 21 42; do for c in 1 2 3 4; do
  d=gan/g$c
  [ -f $d/takes/take-$S-1.wav ] || lockf -t 14400 ~/videos/black-hole-life/.heavy.lock ~/.local/bin/uv run --frozen --project ~/tools/ACE-Step-1.5 python sing_ft.py $d/song.md --seed $S --lang en
  b=$d/takes/take-$S-1
  [ -f $b.en.json ] || { ffmpeg -y -loglevel error -i $b.wav -ar 16000 -ac 1 $b.16k.wav; lockf -t 14400 ~/videos/black-hole-life/.heavy.lock "$PY" -I transcribe_ft.py $b.16k.wav en > $b.en.json; }
  echo gre $c $S done $(date +%T)
done; done; echo gredone
