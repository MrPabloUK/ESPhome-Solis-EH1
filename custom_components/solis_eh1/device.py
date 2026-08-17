"""Resolve the ESPHome node name from any of the stick's HA devices."""

from __future__ import annotations

import re
from typing import Any

from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.device_registry import DeviceInfo

from .const import DOMAIN, MANUFACTURER, MODEL, SCHEDULE_STATUS_RE
from .names import identifier_domain, identifier_value, usable_esphome_name

STATUS_PATTERN = re.compile(SCHEDULE_STATUS_RE)


def root_esphome_device(registry: dr.DeviceRegistry, device: dr.DeviceEntry) -> dr.DeviceEntry:
    seen: set[str] = set()
    current = device
    while current.via_device_id and current.id not in seen:
        seen.add(current.id)
        parent = registry.async_get(current.via_device_id)
        if parent is None:
            break
        current = parent
    return current


def related_device_ids(registry: dr.DeviceRegistry, device: dr.DeviceEntry) -> set[str]:
    root = root_esphome_device(registry, device)
    ids = {root.id, device.id}
    for candidate in registry.devices.values():
        if candidate.via_device_id in ids or candidate.id == root.id:
            ids.add(candidate.id)
    return ids


def esphome_name_from_device(hass: Any, device: dr.DeviceEntry) -> str | None:
    """Return the ESPHome node hostname, never a MAC or subdevice id."""
    registry = dr.async_get(hass)
    root = root_esphome_device(registry, device)

    for entry_id in root.config_entries | device.config_entries:
        entry = hass.config_entries.async_get_entry(entry_id)
        if entry is None or entry.domain != "esphome":
            continue
        for candidate in (
            entry.data.get("device_name"),
            entry.title,
        ):
            name = usable_esphome_name(str(candidate) if candidate else None)
            if name:
                return name

    for source in (root, device):
        for ident in source.identifiers or ():
            if identifier_domain(ident) != "esphome":
                continue
            name = usable_esphome_name(identifier_value(ident))
            if name:
                return name

    return None


def _device_with_schedule_status(hass: Any, device_ids: set[str]) -> dr.DeviceEntry | None:
    registry = dr.async_get(hass)
    entity_reg = er.async_get(hass)
    for related_id in device_ids:
        for entry in er.async_entries_for_device(entity_reg, related_id, include_disabled_entities=True):
            object_id = entry.entity_id.split(".", 1)[-1]
            for candidate in (entry.unique_id or "", entry.entity_id, object_id):
                if STATUS_PATTERN.search(candidate):
                    found = registry.async_get(related_id)
                    if found:
                        return found
    return None


def _any_solis_device(hass: Any) -> dr.DeviceEntry | None:
    registry = dr.async_get(hass)
    for device in registry.devices.values():
        if device.manufacturer == MANUFACTURER and device.model == MODEL:
            return device
    return None


def inverter_device_for_schedule(hass: Any, device_id: str) -> dr.DeviceEntry | None:
    """Prefer the inverter subdevice so the entity sits on Solis EH1."""
    registry = dr.async_get(hass)
    start = registry.async_get(device_id) or _any_solis_device(hass)
    if start is None:
        return _device_with_schedule_status(hass, {device.id for device in registry.devices.values()})
    found = _device_with_schedule_status(hass, related_device_ids(registry, start))
    return found or start


def schedule_device_info(device: dr.DeviceEntry | None, entry_id: str) -> DeviceInfo:
    """Join the existing inverter device, or create a named Solis EH1 fallback."""
    if device and device.identifiers:
        info: dict[str, Any] = {
            "identifiers": set(device.identifiers),
            "manufacturer": device.manufacturer or MANUFACTURER,
            "model": device.model or MODEL,
        }
        if device.connections:
            info["connections"] = set(device.connections)
        if not (device.name_by_user or device.name):
            info["name"] = "Solis EH1"
        return DeviceInfo(**info)
    return DeviceInfo(
        identifiers={(DOMAIN, entry_id)},
        name="Solis EH1",
        manufacturer=MANUFACTURER,
        model=MODEL,
    )


def inverter_id_for_device(hass: Any, device_id: str) -> int:
    registry = dr.async_get(hass)
    device = registry.async_get(device_id)
    entity_reg = er.async_get(hass)
    search_ids = related_device_ids(registry, device) if device else {device_id}
    for related_id in search_ids:
        for entry in er.async_entries_for_device(entity_reg, related_id, include_disabled_entities=True):
            object_id = entry.entity_id.split(".", 1)[-1]
            for candidate in (entry.unique_id or "", entry.entity_id, object_id):
                match = STATUS_PATTERN.search(candidate)
                if match:
                    return int(match.group(1))
    return 1
