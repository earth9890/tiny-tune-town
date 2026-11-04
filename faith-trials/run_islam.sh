cd ~/videos/tiny-tune-town/faith-trials
for v in a-lat a-ar b-lat b-ar; do for s in 7 21; do
 L=en; [[ $v == *-ar ]] && L=ar
 mkdir -p islam/$v; cp islam/$v.md islam/$v/song.md
 [ -f islam/$v/takes/take-$s-1.wav ] || lockf -t 3600 ~/videos/black-hole-life/.heavy.lock ~/.local/bin/uv run --frozen --project ~/tools/ACE-Step-1.5 python sing_ft.py islam/$v/song.md --seed $s --lang $L
 echo done $v $s
done; done
