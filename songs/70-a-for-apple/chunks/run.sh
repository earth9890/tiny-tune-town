cd ~/videos/tiny-tune-town
SD=songs/70-a-for-apple/chunks
seed=$1; shift
for c in "$@"; do
 ACESTEP_GENERATION_TIMEOUT=3600 lockf -t 7200 ~/videos/black-hole-life/.heavy.lock ~/tools/ACE-Step-1.5/.venv/bin/python tools/sing.py $SD/$c/song.md --seed $seed > $SD/$c/sing-$seed.log 2>&1
 ffmpeg -y -loglevel error -i $SD/$c/takes/take-$seed-1.wav -ar 16000 -ac 1 $SD/$c/takes/v16-$seed.wav
 lockf -t 7200 ~/videos/black-hole-life/.heavy.lock "$HOME/Library/Application Support/VoiceStudio/runtime/project/.venv/bin/python" -I tools/transcribe.py $SD/$c/takes/v16-$seed.wav > $SD/$c/takes/tr-$seed.json 2>$SD/$c/takes/tr-$seed.err
 echo "chunk $c seed $seed done $(date)" >> songs/70-a-for-apple/PROGRESS.md
done
