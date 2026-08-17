"""Config flow for Solis EH1."""

from __future__ import annotations

import re
from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.selector import DeviceSelector, DeviceSelectorConfig
import voluptuous as vol

from .const import (
    CONF_DEVICE_ID,
    CONF_DEVICE_PREFIX,
    CONF_ESPHOME_NAME,
    CONF_EVENT_TYPE,
    CONF_INVERTER_ID,
    DOMAIN,
    MANUFACTURER,
    MODEL,
    SCHEDULE_STATUS_RE,
)

STATUS_PATTERN = re.compile(SCHEDULE_STATUS_RE)


def _looks_like_mac(value: str) -> bool:
    cleaned = value.replace(":", "").replace("-", "").lower()
    return len(cleaned) == 12 and all(char in "0123456789abcdef" for char in cleaned)


def esphome_name_from_device(device: dr.DeviceEntry) -> str | None:
    names: list[str] = []
    for domain, ident in device.identifiers:
        if domain == "esphome" and ident:
            names.append(ident)
    for name in names:
        if not _looks_like_mac(name):
            return name
    return names[0] if names else None


def inverter_id_for_device(hass, device_id: str) -> int:
    entity_reg = er.async_get(hass)
    for entry in er.async_entries_for_device(entity_reg, device_id, include_disabled_entities=True):
        object_id = entry.entity_id.split(".", 1)[-1]
        for candidate in (entry.unique_id or "", entry.entity_id, object_id):
            match = STATUS_PATTERN.search(candidate)
            if match:
                return int(match.group(1))
    return 1


def used_device_ids(hass) -> set[str]:
    return {
        entry.data[CONF_DEVICE_ID]
        for entry in hass.config_entries.async_entries(DOMAIN)
        if CONF_DEVICE_ID in entry.data
    }


def compatible_device(device: dr.DeviceEntry) -> bool:
    if device.manufacturer == MANUFACTURER and device.model == MODEL:
        return True
    return any(domain == "esphome" for domain, _ident in device.identifiers)


class SolisEH1ConfigFlow(ConfigFlow, domain=DOMAIN):
    """Pick an adopted Solis EH1 ESPHome device."""

    VERSION = 1

    def __init__(self) -> None:
        self._device_id: str | None = None

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        registry = dr.async_get(self.hass)
        taken = used_device_ids(self.hass)
        candidates = [
            device
            for device in registry.devices.values()
            if device.id not in taken
            and any(domain == "esphome" for domain, _ident in device.identifiers)
            and compatible_device(device)
        ]
        if not candidates:
            return self.async_abort(reason="no_devices")

        if user_input is not None:
            device_id = user_input[CONF_DEVICE_ID]
            device = registry.async_get(device_id)
            if device is None or device_id in taken:
                errors["base"] = "already_configured"
            elif not compatible_device(device):
                errors["base"] = "not_solis"
            else:
                esphome_name = esphome_name_from_device(device)
                if not esphome_name:
                    self._device_id = device_id
                    return await self.async_step_manual()
                return await self._create_entry(device_id, esphome_name, inverter_id_for_device(self.hass, device_id))

        schema = vol.Schema(
            {
                vol.Required(CONF_DEVICE_ID): DeviceSelector(
                    DeviceSelectorConfig(
                        integration="esphome",
                        manufacturer=MANUFACTURER,
                        model=MODEL,
                    )
                )
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    async def async_step_manual(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None and self._device_id:
            name = str(user_input[CONF_ESPHOME_NAME]).strip()
            inverter_id = int(user_input.get(CONF_INVERTER_ID, 1))
            if not name:
                errors["base"] = "not_solis"
            else:
                return await self._create_entry(self._device_id, name, inverter_id)

        schema = vol.Schema(
            {
                vol.Required(CONF_ESPHOME_NAME): str,
                vol.Required(CONF_INVERTER_ID, default=1): vol.All(vol.Coerce(int), vol.Range(min=1, max=8)),
            }
        )
        return self.async_show_form(step_id="manual", data_schema=schema, errors=errors)

    async def _create_entry(self, device_id: str, esphome_name: str, inverter_id: int) -> ConfigFlowResult:
        await self.async_set_unique_id(device_id)
        self._abort_if_unique_id_configured()
        prefix = f"{esphome_name}_inverter{inverter_id}"
        return self.async_create_entry(
            title=f"Solis EH1 ({esphome_name})",
            data={
                CONF_DEVICE_ID: device_id,
                CONF_ESPHOME_NAME: esphome_name,
                CONF_INVERTER_ID: inverter_id,
                CONF_DEVICE_PREFIX: prefix,
                CONF_EVENT_TYPE: f"esphome.{prefix}_schedule_update",
            },
        )
