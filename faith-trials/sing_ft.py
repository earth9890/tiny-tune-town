"""Sing a song sheet with ACE-Step 1.5 (MIT; runs locally on Apple Silicon).

usage (from anywhere):
  ~/.local/bin/uv run --project ~/tools/ACE-Step-1.5 python ~/videos/tiny-tune-town/tools/sing.py songs/<slug>/song.md [--takes 1] [--seed 7] [--lm]
writes songs/<slug>/takes/take-<seed>-<n>.wav (+ .json with the settings and the key the model used)

song.md format:
  caption: <style tags: genre, voice, instruments, mood>     (max 512 chars)
  bpm: 110          key: C Major      time: 4       duration: 25
  ## Lyrics
  [verse]
  ...
  [chorus]
  ...
"""
import json, os, re, sys

ACE = os.path.expanduser("~/tools/ACE-Step-1.5")
sys.path.insert(0, ACE)
from acestep.handler import AceStepHandler                     # noqa: E402
from acestep.llm_inference import LLMHandler                   # noqa: E402
from acestep.inference import GenerationParams, GenerationConfig, generate_music  # noqa: E402

args = sys.argv[1:]
sheet = os.path.abspath(args[0])
opt = lambda k, d: type(d)(args[args.index(k) + 1]) if k in args else d
takes, seed = opt("--takes", 1), opt("--seed", 7)
use_lm = "--lm" in args
opt = lambda k, d: type(d)(args[args.index(k) + 1]) if k in args else d   # ponytail: 16 GB Mac runs out of memory with the 1.7B planner LM; DiT-only by default

text = open(sheet).read()
head, _, lyrics = text.partition("## Lyrics")
meta = dict(re.findall(r"^\s*(caption|bpm|key|time|duration)\s*:\s*(.+?)\s*$", head, re.M))
out = os.path.join(os.path.dirname(sheet), "takes")
os.makedirs(out, exist_ok=True)

dit, lm = AceStepHandler(), LLMHandler()
print(dit.initialize_service(project_root=ACE, config_path="acestep-v15-turbo", device="mps", offload_to_cpu=True))
if use_lm:
    print(lm.initialize(checkpoint_dir=os.path.join(ACE, "checkpoints"), lm_model_path="acestep-5Hz-lm-1.7B", backend="mlx", device="mps"))

params = GenerationParams(
    caption=meta.get("caption", ""), lyrics=lyrics.strip(), vocal_language=opt("--lang","en"),
    bpm=int(meta["bpm"]) if "bpm" in meta else None, keyscale=meta.get("key", ""),
    timesignature=meta.get("time", ""), duration=float(meta.get("duration", -1)),
    shift=3.0, seed=seed, thinking=use_lm,  # turbo model: shift 3.0 (docs), 8 steps default
)
res = generate_music(dit, lm, params, GenerationConfig(batch_size=takes, audio_format="wav", use_random_seed=False), save_dir=out)
if not res.success:
    sys.exit(f"failed: {res.error}")
for i, a in enumerate(res.audios, 1):
    dst = os.path.join(out, f"take-{seed}-{i}.wav")
    os.replace(a["path"], dst)
    json.dump({"meta": meta, "seed": a.get("params", {}).get("seed"), "key": a.get("key")}, open(dst[:-4] + ".json", "w"), indent=1)
    print("wrote", dst)
