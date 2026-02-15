from __future__ import annotations
import json, os, uuid, time, hashlib
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

import yaml

from acat2c.prompt_engine import load_battery
from acat2c.adapters.base import BaseAdapter
from acat2c.adapters.local_adapter import LocalStubAdapter
from acat2c.scoring.behavioral_engine import score_behavioral_response
from acat2c.scoring.cel_engine import score_cel_response
from acat2c.scoring.aggregation import aggregate_scores
from acat2c.reporting.report_generator import render_reports


@dataclass
class RunResult:
    run_id: str
    started_at: float
    finished_at: float
    prompts_used: List[Dict[str, Any]]
    responses: List[Dict[str, Any]]
    behavioral_scores: List[Dict[str, Any]]
    cel_scores: List[Dict[str, Any]]
    aggregates: Dict[str, Any]
    hashes: Dict[str, str]


def _sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def _get_adapter(cfg: Dict[str, Any]) -> BaseAdapter:
    adapter_name = cfg["model"]["adapter"]
    model_id = cfg["model"]["model_id"]
    timeout_s = float(cfg.get("model", {}).get("timeout_s", 60))

    if adapter_name == "local_stub":
        return LocalStubAdapter(model_id=model_id)

    if adapter_name == "anthropic":
        from acat2c.adapters.anthropic_adapter import AnthropicAdapter
        return AnthropicAdapter(model_id=model_id, timeout_s=timeout_s)

    if adapter_name == "openai":
        from acat2c.adapters.openai_adapter import OpenAIAdapter
        return OpenAIAdapter(model_id=model_id, timeout_s=timeout_s)

    raise ValueError(f"Unsupported adapter: {adapter_name}")


def run_from_config(config_path: str) -> RunResult:
    with open(config_path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    os.makedirs(cfg["run"]["output_dir"], exist_ok=True)
    run_id = f"{int(time.time())}-{uuid.uuid4().hex[:8]}"
    run_dir = os.path.join(cfg["run"]["output_dir"], run_id)
    os.makedirs(run_dir, exist_ok=True)

    battery_path = cfg["battery"]["path"]
    battery_hash = _sha256_file(battery_path)

    if cfg["battery"].get("require_hash_match") and cfg["battery"].get("expected_sha256"):
        if battery_hash != cfg["battery"]["expected_sha256"]:
            raise RuntimeError("Battery hash mismatch; refusing to run in certification mode.")

    prompts = load_battery(battery_path, max_prompts=cfg["run"].get("max_prompts"))
    adapter = _get_adapter(cfg)

    responses: List[Dict[str, Any]] = []
    behavioral_scores: List[Dict[str, Any]] = []
    cel_scores: List[Dict[str, Any]] = []

    started_at = time.time()

    for p in prompts:
        resp = adapter.generate(
            prompt=p["prompt"],
            system=cfg["model"]["system_prompt"],
            temperature=float(cfg["model"]["temperature"]),
            max_tokens=int(cfg["model"]["max_tokens"]),
        )
        responses.append({
            "id": p["id"],
            "text": resp["text"],
            "refusal": resp.get("refusal", False),
            "latency_ms": resp.get("latency_ms"),
        })

        if p["domain"] == "CEL":
            cel_scores.append(score_cel_response(p, resp["text"], cfg))
        else:
            behavioral_scores.append(score_behavioral_response(p, resp["text"], cfg))

    aggregates = aggregate_scores(prompts, behavioral_scores, cel_scores, cfg)

    finished_at = time.time()

    hashes = {
        "battery_sha256": battery_hash,
        "config_sha256": _sha256_file(config_path),
    }

    result = RunResult(
        run_id=run_id,
        started_at=started_at,
        finished_at=finished_at,
        prompts_used=prompts,
        responses=responses,
        behavioral_scores=behavioral_scores,
        cel_scores=cel_scores,
        aggregates=aggregates,
        hashes=hashes,
    )

    # Persist artifacts
    with open(os.path.join(run_dir, "prompts_used.jsonl"), "w", encoding="utf-8") as f:
        for p in prompts:
            f.write(json.dumps(p, ensure_ascii=False) + "\n")

    with open(os.path.join(run_dir, "responses.jsonl"), "w", encoding="utf-8") as f:
        for r in responses:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    with open(os.path.join(run_dir, "behavioral_scores.jsonl"), "w", encoding="utf-8") as f:
        for s in behavioral_scores:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")

    with open(os.path.join(run_dir, "cel_scores.jsonl"), "w", encoding="utf-8") as f:
        for s in cel_scores:
            f.write(json.dumps(s, ensure_ascii=False) + "\n")

    # Expanded CEL data for threshold tuning (includes per-item band + mean ordinal)
    if "cel_profile" in aggregates and aggregates["cel_profile"].get("mean_ordinal_summary"):
        expanded = []
        for s in cel_scores:
            m = sum([s.get("F1_motivation", 0), s.get("F2_care_stability", 0),
                     s.get("F3_unity", 0), s.get("F4_power_signature", 0)]) / 4.0
            # Find the corresponding per_item entry for gate info
            gate_info = next((p for p in result.aggregates.get("_per_item_detail", [])
                              if p.get("id") == s["id"]), None)
            expanded.append({
                "id": s["id"],
                "mean_ordinal": round(m, 4),
                "stress_condition": s.get("stress_condition", False),
                "F1": s.get("F1_motivation"),
                "F2": s.get("F2_care_stability"),
                "F3": s.get("F3_unity"),
                "F4": s.get("F4_power_signature"),
            })
        with open(os.path.join(run_dir, "cel_scores_expanded.jsonl"), "w", encoding="utf-8") as f:
            for e in expanded:
                f.write(json.dumps(e, ensure_ascii=False) + "\n")

    with open(os.path.join(run_dir, "aggregates.json"), "w", encoding="utf-8") as f:
        json.dump(aggregates, f, ensure_ascii=False, indent=2)

    with open(os.path.join(run_dir, "hashes.json"), "w", encoding="utf-8") as f:
        json.dump(hashes, f, ensure_ascii=False, indent=2)

    render_reports(run_dir, result, cfg)
    print(f"Run complete: {run_id} -> {run_dir}")
    return result
