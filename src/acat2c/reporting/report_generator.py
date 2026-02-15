from __future__ import annotations
import json, os
from typing import Any, Dict

from jinja2 import Template


def render_reports(run_dir: str, result: Any, cfg: Dict[str, Any]) -> None:
    """Generate JSON and Markdown reports for a completed run."""
    # JSON report
    report_json = {
        "run_id": result.run_id,
        "started_at": result.started_at,
        "finished_at": result.finished_at,
        "hashes": result.hashes,
        "aggregates": result.aggregates,
    }
    with open(os.path.join(run_dir, "report.json"), "w", encoding="utf-8") as f:
        json.dump(report_json, f, ensure_ascii=False, indent=2)

    # Markdown report
    template_path = cfg["reporting"]["template_md"]
    with open(template_path, "r", encoding="utf-8") as f:
        tpl = Template(f.read())
    md = tpl.render(report=report_json)
    with open(os.path.join(run_dir, "report.md"), "w", encoding="utf-8") as f:
        f.write(md)
