from __future__ import annotations
import time
from typing import Dict, Optional, List

from anthropic import Anthropic  # official SDK


class AnthropicAdapter:
    """
    Uses Anthropic Messages API via anthropic-sdk-python.

    - system prompt is passed via top-level `system` param (not a message role)
    - messages is a list of {"role": "user"|"assistant", "content": "..."}
    """

    def __init__(self, model_id: str, api_key: Optional[str] = None, timeout_s: float = 60.0):
        self.model_id = model_id
        # api_key is optional; SDK reads ANTHROPIC_API_KEY from env by default
        self.client = Anthropic(api_key=api_key, timeout=timeout_s)

    def generate(self, prompt: str, system: str, temperature: float, max_tokens: int) -> Dict:
        t0 = time.time()

        messages: List[Dict[str, str]] = [{"role": "user", "content": prompt}]

        msg = self.client.messages.create(
            model=self.model_id,
            max_tokens=max_tokens,
            system=system or None,
            temperature=temperature,
            messages=messages,
        )

        # SDK returns message.content as content blocks; concatenate text blocks
        text_parts = []
        for block in getattr(msg, "content", []) or []:
            block_type = getattr(block, "type", None) or (
                block.get("type") if isinstance(block, dict) else None
            )
            if block_type == "text":
                text = getattr(block, "text", None) or (
                    block.get("text") if isinstance(block, dict) else ""
                )
                if text:
                    text_parts.append(text)

        out_text = (
            "\n".join(text_parts).strip()
            if text_parts
            else str(getattr(msg, "content", "")).strip()
        )

        latency_ms = int((time.time() - t0) * 1000)
        return {
            "text": out_text,
            "refusal": False,
            "latency_ms": latency_ms,
            "raw": None,
        }
