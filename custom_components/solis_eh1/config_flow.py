"""Config flow for Solis EH1."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.helpers import device_registry as dr
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
)
from .device import esphome_name_from_device, inverter_id_for_device
from .names import has_esphome_identifier


def used_device_ids(hass) -> set[str]:
    return {
        entry.data[CONF_DEVICE_ID]
        for entry in hass.config_entries.async_entries(DOMAIN)
        if CONF_DEVICE_ID in entry.data
    }


def used_hostnames(hass) -> set[str]:
    return {
        entry.data[CONF_ESPHOME_NAME]
        for entry in hass.config_entries.async_entries(DOMAIN)
        if CONF_ESPHOME_NAME in entry.data
    }


def compatible_device(device: dr.DeviceEntry) -> bool:
    if device.manufacturer == MANUFACTURER and device.model == MODEL:
        return True
    return has_esphome_identifier(device.identifiers)


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
            and has_esphome_identifier(device.identifiers)
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
                esphome_name = esphome_name_from_device(self.hass, device)
                inverter_id = inverter_id_for_device(self.hass, device_id)
                if esphome_name and esphome_name in used_hostnames(self.hass):
                    errors["base"] = "already_configured"
                elif not esphome_name:
                    self._device_id = device_id
                    return await self.async_step_manual()
                else:
                    return await self._create_entry(device_id, esphome_name, inverter_id)

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
            elif name in used_hostnames(self.hass):
                errors["base"] = "already_configured"
            else:
                return await self._create_entry(self._device_id, name, inverter_id)

        schema = vol.Schema(
            {
                vol.Required(CONF_ESPHOME_NAME, default="solisinverter"): str,
                vol.Required(CONF_INVERTER_ID, default=1): vol.All(vol.Coerce(int), vol.Range(min=1, max=8)),
            }
        )
        return self.async_show_form(step_id="manual", data_schema=schema, errors=errors)

    async def _create_entry(self, device_id: str, esphome_name: str, inverter_id: int) -> ConfigFlowResult:
        await self.async_set_unique_id(f"{esphome_name}_inverter{inverter_id}")
        self._abort_if_unique_id_configured()
        prefix = f"{esphome_name}_inverter{inverter_id}"
        return self.async_create_entry(
            title="Solis EH1",
            data={
                CONF_DEVICE_ID: device_id,
                CONF_ESPHOME_NAME: esphome_name,
                CONF_INVERTER_ID: inverter_id,
                CONF_DEVICE_PREFIX: prefix,
                CONF_EVENT_TYPE: f"esphome.{prefix}_schedule_update",
            },
        )
