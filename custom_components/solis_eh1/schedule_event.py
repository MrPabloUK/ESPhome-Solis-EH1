"""Parse schedule payloads from Home Assistant events."""

from __future__ import annotations

import json
from typing import Any


def _is_slot(item: Any) -> bool:
    return isinstance(item, dict) and ("Slot" in item or "slot" in item)


def _as_slots(raw: Any) -> list[dict[str, Any]] | None:
    if isinstance(raw, str):
        text = raw.strip()
        if not text.startswith("["):
            return None
        try:
            raw = json.loads(text)
        except json.JSONDecodeError:
            return None
    if not isinstance(raw, list):
        return None
    if raw and not all(_is_slot(item) for item in raw):
        return None
    return raw


def extract_slots(data: dict[str, Any] | None) -> list[dict[str, Any]] | None:
    if not data:
        return None
    parsed = _as_slots(data.get("schedules"))
    if parsed is not None:
        return parsed
    nested = data.get("data")
    if isinstance(nested, dict):
        return _as_slots(nested.get("schedules"))
    return None
