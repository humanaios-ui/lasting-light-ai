from __future__ import annotations
import time
from typing import Dict, Optional

from openai import OpenAI  # official SDK


class OpenAIAdapter:
    """
    Uses OpenAI Responses API via openai-python SDK.
    """

    def __init__(self, model_id: str, api_key: Optional[str] = None, timeout_s: float = 60.0):
        self.model_id = model_id
        # api_key optional; SDK reads OPENAI_API_KEY from env by default
        self.client = OpenAI(api_key=api_key, timeout=timeout_s)

    def generate(self, prompt: str, system: str, temperature: float, max_tokens: int) -> Dict:
        t0 = time.time()

        resp = self.client.responses.create(
            model=self.model_id,
            input=prompt,
            instructions=system or None,
        )

        latency_ms = int((time.time() - t0) * 1000)
        return {
            "text": resp.output_text,
            "refusal": False,
            "latency_ms": latency_ms,
            "raw": None,
        }
