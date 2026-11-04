cd ~/videos/tiny-tune-town
SD=songs/70-a-for-apple
for s in "$@"; do
 ACESTEP_GENERATION_TIMEOUT=3600 lockf -t 7200 ~/videos/black-hole-life/.heavy.lock ~/tools/ACE-Step-1.5/.venv/bin/python tools/sing.py $SD/song.md --seed $s > $SD/sing-$s.log 2>&1
 ffmpeg -y -loglevel error -i $SD/takes/take-$s-1.wav -ar 16000 -ac 1 $SD/takes/v16-$s.wav
 lockf -t 7200 ~/videos/black-hole-life/.heavy.lock "$HOME/Library/Application Support/VoiceStudio/runtime/project/.venv/bin/python" -I tools/transcribe.py $SD/takes/v16-$s.wav > $SD/takes/transcript-$s.json 2>$SD/takes/tr-$s.err
 echo "seed $s sung+transcribed $(date)" >> $SD/PROGRESS.md
done
echo ALLDONE > $SD/takes/DONE
