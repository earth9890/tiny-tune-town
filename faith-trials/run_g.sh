cd ~/videos/tiny-tune-town/faith-trials
while pgrep -f run_islam.sh >/dev/null; do sleep 20; done
for s in 7 21; do lockf -t 3600 ~/videos/black-hole-life/.heavy.lock ~/.local/bin/uv run --frozen --project ~/tools/ACE-Step-1.5 python sing_ft.py ganesha/g1/song.md --seed $s --lang en; done
echo gdone
