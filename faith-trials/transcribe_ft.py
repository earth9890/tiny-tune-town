# Word-timed transcript of a sung take, without the VoiceStudio app running.
# Uses the faster-whisper large-v3-turbo model VoiceStudio already downloaded (~/.cache/huggingface), run from VoiceStudio's venv:
#   "$HOME/Library/Application Support/VoiceStudio/runtime/project/.venv/bin/python" -I tools/transcribe.py <16k mono wav> > out.json
# Output matches the VoiceStudio /v1/audio/transcriptions verbose_json shape: {"text", "segments": [{start, end, text, words: [{word, start, end}]}]}
import json, sys
from faster_whisper import WhisperModel

m = WhisperModel("deepdml/faster-whisper-large-v3-turbo-ct2", device="cpu", compute_type="int8")
segs, _ = m.transcribe(sys.argv[1], language=(sys.argv[2] if len(sys.argv)>2 else "en"), word_timestamps=True, vad_filter=False)
out = [{"start": round(s.start, 2), "end": round(s.end, 2), "text": s.text.strip(),
        "words": [{"word": w.word.strip(), "start": round(w.start, 2), "end": round(w.end, 2)} for w in s.words]} for s in segs]
json.dump({"text": " ".join(s["text"] for s in out), "segments": out}, sys.stdout, indent=1)
