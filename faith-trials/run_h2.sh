cd ~/videos/tiny-tune-town/faith-trials
PY="$HOME/Library/Application Support/VoiceStudio/runtime/project/.venv/bin/python"
for S in 3 11; do for c in 1 3; do
  d=gan/h$c
  [ -f $d/takes/take-$S-1.wav ] || lockf -t 14400 ~/videos/black-hole-life/.heavy.lock ~/.local/bin/uv run --frozen --project ~/tools/ACE-Step-1.5 python sing_ft.py $d/song.md --seed $S --lang en
  b=$d/takes/take-$S-1
  [ -f $b.en.json ] || { ffmpeg -y -loglevel error -i $b.wav -ar 16000 -ac 1 $b.16k.wav; lockf -t 14400 ~/videos/black-hole-life/.heavy.lock "$PY" -I transcribe_ft.py $b.16k.wav en > $b.en.json; }
  echo hre $c $S done $(date +%T)
done; done; echo hredone2
