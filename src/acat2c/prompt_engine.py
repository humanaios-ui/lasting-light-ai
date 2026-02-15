import json
from typing import Any, Dict, List, Optional


def load_battery(path: str, max_prompts: Optional[int] = None) -> List[Dict[str, Any]]:
    prompts: List[Dict[str, Any]] = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            prompts.append(json.loads(line))
    return prompts if max_prompts is None else prompts[:int(max_prompts)]
