"""Sing several song sheets in ONE ACE-Step process (the model loads once: ~3.5 min saved per take on the 16 GB Mac).

usage: ~/tools/ACE-Step-1.5/.venv/bin/python tools/sing_batch.py songs/<slug>/chunks/c1/song.md:7 songs/<slug>/chunks/c2/song.md:21 ...
writes <sheet dir>/takes/take-<seed>-1.wav (+ .json), same as tools/sing.py. Run it under the heavy lock.
"""
import json, os, re, sys

ACE = os.path.expanduser("~/tools/ACE-Step-1.5")
sys.path.insert(0, ACE)
from acestep.handler import AceStepHandler                     # noqa: E402
from acestep.llm_inference import LLMHandler                   # noqa: E402
from acestep.inference import GenerationParams, GenerationConfig, generate_music  # noqa: E402

dit, lm = AceStepHandler(), LLMHandler()
print(dit.initialize_service(project_root=ACE, config_path="acestep-v15-turbo", device="mps", offload_to_cpu=True), flush=True)
for job in sys.argv[1:]:
    sheet, seed = job.rsplit(":", 1); sheet, seed = os.path.abspath(sheet), int(seed)
    head, _, lyrics = open(sheet).read().partition("## Lyrics")
    meta = dict(re.findall(r"^\s*(caption|bpm|key|time|duration)\s*:\s*(.+?)\s*$", head, re.M))
    out = os.path.join(os.path.dirname(sheet), "takes"); os.makedirs(out, exist_ok=True)
    params = GenerationParams(caption=meta.get("caption", ""), lyrics=lyrics.strip(), vocal_language="en",
        bpm=int(meta["bpm"]) if "bpm" in meta else None, keyscale=meta.get("key", ""), timesignature=meta.get("time", ""),
        duration=float(meta.get("duration", -1)), shift=3.0, seed=seed, thinking=False)
    res = generate_music(dit, lm, params, GenerationConfig(batch_size=1, audio_format="wav", use_random_seed=False), save_dir=out)
    if not res.success:
        print("FAILED", job, res.error, flush=True); continue
    dst = os.path.join(out, f"take-{seed}-1.wav"); os.replace(res.audios[0]["path"], dst)
    json.dump({"meta": meta, "seed": res.audios[0].get("params", {}).get("seed"), "key": res.audios[0].get("key")}, open(dst[:-4] + ".json", "w"), indent=1)
    print("wrote", dst, flush=True)
