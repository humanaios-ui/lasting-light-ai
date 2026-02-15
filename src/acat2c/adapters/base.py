from __future__ import annotations
from typing import Dict


class BaseAdapter:
    def generate(self, prompt: str, system: str, temperature: float, max_tokens: int) -> Dict:
        raise NotImplementedError
