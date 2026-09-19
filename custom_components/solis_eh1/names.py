"""Hostname string checks that do not depend on Home Assistant."""

from __future__ import annotations

import re
from typing import Any

SUBDEVICE_IDENT_RE = re.compile(
    r"^(?:[0-9a-f]{12}|[0-9a-f]{2}(?::[0-9a-f]{2}){5})[_-](board|inverter[_-]?\d+)$",
    re.IGNORECASE,
)
_HOSTNAME_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]*$")


def looks_like_mac(value: str) -> bool:
    cleaned = value.replace(":", "").replace("-", "").lower()
    return len(cleaned) == 12 and all(char in "0123456789abcdef" for char in cleaned)


def looks_like_subdevice_ident(value: str) -> bool:
    return bool(SUBDEVICE_IDENT_RE.match(value.replace(":", ""))) or bool(SUBDEVICE_IDENT_RE.match(value))


def identifier_domain(ident: Any) -> str | None:
    if isinstance(ident, (tuple, list)) and ident:
        return str(ident[0])
    return None


def identifier_value(ident: Any) -> str | None:
    if isinstance(ident, (tuple, list)) and len(ident) >= 2:
        return str(ident[1])
    return None


def has_esphome_identifier(identifiers: Any) -> bool:
    return any(identifier_domain(ident) == "esphome" for ident in (identifiers or ()))


def usable_esphome_name(value: str | None) -> str | None:
    if not value:
        return None
    name = value.strip()
    if not name or looks_like_mac(name) or looks_like_subdevice_ident(name):
        return None
    if not _HOSTNAME_RE.match(name):
        return None
    return name


def esphome_action_service(prefix: str, action: str) -> str:
    """HA registers ESPHome user actions with '-' in the node name replaced by '_'."""
    return f"{prefix.replace('-', '_')}_{action}"


def resolve_esphome_action_name(prefix: str, action: str, available: set[str]) -> str | None:
    """Pick the registered ESPHome user action, even if the stored hostname is stale."""
    preferred = esphome_action_service(prefix, action)
    raw = f"{prefix}_{action}"
    for candidate in (preferred, raw):
        if candidate in available:
            return candidate

    suffix = f"_{action}"
    matches = sorted(name for name in available if name.endswith(suffix))
    if not matches:
        return None

    host = prefix.replace("-", "_")
    inverter = ""
    if "_inverter" in host:
        host, inverter = host.rsplit("_inverter", 1)
        inverter = f"_inverter{inverter}"
    prefixed = [name for name in matches if name.startswith(f"{host}_") or name.startswith(f"{host}{inverter}_")]
    if len(prefixed) == 1:
        return prefixed[0]
    if len(matches) == 1:
        return matches[0]
    if inverter:
        keyed = [name for name in matches if inverter in f"_{name}_" or name.endswith(f"{inverter}{suffix}")]
        if len(keyed) == 1:
            return keyed[0]
    return None
