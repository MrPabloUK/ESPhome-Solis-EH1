"""Human-readable schedule actions that call ESPHome."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.exceptions import HomeAssistantError, ServiceNotFound
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
import voluptuous as vol

from .const import (
    CONF_DEVICE_ID,
    CONF_DEVICE_PREFIX,
    DOMAIN,
    ESPHOME_DELETE_ALL,
    ESPHOME_MANAGE,
    ESPHOME_UPSERT,
    SERVICE_DELETE_ALL,
    SERVICE_MANAGE,
    SERVICE_UPSERT,
)
from .mapping import MappingError, manage_payload, upsert_payload

_LOGGER = logging.getLogger(__name__)

DATA_SERVICES = "services_registered"

UPSERT_SCHEMA = vol.Schema(
    {
        vol.Optional("entity_id"): cv.entity_id,
        vol.Optional("device_id"): cv.string,
        vol.Required("slot"): vol.Coerce(int),
        vol.Required("mode"): vol.Any(str, int),
        vol.Required("start"): vol.Any(str, cv.time),
        vol.Required("end"): vol.Any(str, cv.time),
        vol.Required("target_soc"): vol.Coerce(int),
        vol.Required("power"): vol.Coerce(int),
        vol.Required("repeat"): vol.Any(str, int),
        vol.Optional("days"): vol.Any(list, str, int),
        vol.Optional("date_start"): vol.Any(str, None),
        vol.Optional("date_end"): vol.Any(str, None),
        vol.Optional("auto_pause", default=False): cv.boolean,
    }
)

MANAGE_SCHEMA = vol.Schema(
    {
        vol.Optional("entity_id"): cv.entity_id,
        vol.Optional("device_id"): cv.string,
        vol.Required("slot"): vol.Coerce(int),
        vol.Required("action"): vol.Any(str, int),
    }
)

DELETE_SCHEMA = vol.Schema(
    {
        vol.Optional("entity_id"): cv.entity_id,
        vol.Optional("device_id"): cv.string,
    }
)


def _entry_for_call(hass: HomeAssistant, call: ServiceCall):
    entity_id = call.data.get("entity_id")
    if isinstance(entity_id, list):
        entity_id = entity_id[0] if entity_id else None
    device_id = call.data.get("device_id")
    if isinstance(device_id, list):
        device_id = device_id[0] if device_id else None
    if entity_id:
        entity = er.async_get(hass).async_get(entity_id)
        if entity is None or entity.platform != DOMAIN:
            raise HomeAssistantError(f"{entity_id} is not a Solis EH1 schedule sensor.")
        entry = hass.config_entries.async_get_entry(entity.config_entry_id)
        if entry is None:
            raise HomeAssistantError(f"No Solis EH1 entry for {entity_id}.")
        return entry
    if device_id:
        for entry in hass.config_entries.async_entries(DOMAIN):
            if entry.data.get(CONF_DEVICE_ID) == device_id:
                return entry
        device = dr.async_get(hass).async_get(device_id)
        if device:
            for ident_domain, ident in device.identifiers:
                if ident_domain != "esphome":
                    continue
                for entry in hass.config_entries.async_entries(DOMAIN):
                    if entry.data.get("esphome_name") == ident:
                        return entry
        raise HomeAssistantError("No Solis EH1 integration for that device.")
    raise HomeAssistantError("Provide entity_id or device_id.")


async def _call_esphome(hass: HomeAssistant, prefix: str, action: str, data: dict[str, Any] | None = None) -> None:
    service = f"{prefix}_{action}"
    try:
        await hass.services.async_call("esphome", service, data or {}, blocking=True)
    except ServiceNotFound as err:
        raise HomeAssistantError(
            f"ESPHome action esphome.{service} is not available. Is the stick adopted and online?"
        ) from err


@callback
def async_register_services(hass: HomeAssistant) -> None:
    store = hass.data.setdefault(DOMAIN, {})
    if store.get(DATA_SERVICES):
        return

    async def handle_upsert(call: ServiceCall) -> None:
        entry = _entry_for_call(hass, call)
        try:
            payload = upsert_payload(dict(call.data))
        except MappingError as err:
            raise HomeAssistantError(str(err)) from err
        await _call_esphome(hass, entry.data[CONF_DEVICE_PREFIX], ESPHOME_UPSERT, payload)

    async def handle_manage(call: ServiceCall) -> None:
        entry = _entry_for_call(hass, call)
        try:
            payload = manage_payload(dict(call.data))
        except MappingError as err:
            raise HomeAssistantError(str(err)) from err
        await _call_esphome(hass, entry.data[CONF_DEVICE_PREFIX], ESPHOME_MANAGE, payload)

    async def handle_delete_all(call: ServiceCall) -> None:
        entry = _entry_for_call(hass, call)
        await _call_esphome(hass, entry.data[CONF_DEVICE_PREFIX], ESPHOME_DELETE_ALL)

    hass.services.async_register(DOMAIN, SERVICE_UPSERT, handle_upsert, schema=UPSERT_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_MANAGE, handle_manage, schema=MANAGE_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_DELETE_ALL, handle_delete_all, schema=DELETE_SCHEMA)
    store[DATA_SERVICES] = True
    _LOGGER.debug("Registered Solis EH1 wrapper actions")
