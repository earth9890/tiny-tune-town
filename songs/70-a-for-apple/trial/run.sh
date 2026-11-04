cd ~/videos/tiny-tune-town
for s in 7 21; do
 ACESTEP_GENERATION_TIMEOUT=3600 lockf -t 3600 ~/videos/black-hole-life/.heavy.lock ~/tools/ACE-Step-1.5/.venv/bin/python tools/sing.py songs/70-a-for-apple/trial/song.md --seed $s > songs/70-a-for-apple/trial/sing-$s.log 2>&1
 ffmpeg -y -loglevel error -i songs/70-a-for-apple/trial/takes/take-$s-1.wav -ar 16000 -ac 1 songs/70-a-for-apple/trial/v16-$s.wav
 lockf -t 3600 ~/videos/black-hole-life/.heavy.lock "$HOME/Library/Application Support/VoiceStudio/runtime/project/.venv/bin/python" -I tools/transcribe.py songs/70-a-for-apple/trial/v16-$s.wav > songs/70-a-for-apple/trial/tr-$s.json 2>songs/70-a-for-apple/trial/tr-$s.err
done
echo ALLDONE > songs/70-a-for-apple/trial/DONE
