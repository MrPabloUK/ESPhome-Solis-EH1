"""Schedule sensor that receives ESPHome schedule events."""

from __future__ import annotations

import json
import logging
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    CONF_DEVICE_PREFIX,
    CONF_ESPHOME_NAME,
    CONF_EVENT_TYPE,
    CONF_INVERTER_ID,
    MANUFACTURER,
    MODEL,
)

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    async_add_entities([SolisScheduleSensor(entry)])


class SolisScheduleSensor(SensorEntity):
    """Last schedule push from the stick."""

    _attr_has_entity_name = True
    _attr_name = "Schedule"
    _attr_icon = "mdi:calendar-clock"
    _attr_should_poll = False
    _attr_translation_key = "schedule"

    def __init__(self, entry: ConfigEntry) -> None:
        self._entry = entry
        self._esphome_name: str = entry.data[CONF_ESPHOME_NAME]
        self._prefix: str = entry.data[CONF_DEVICE_PREFIX]
        self._event_type: str = entry.data[CONF_EVENT_TYPE]
        self._inverter_id: int = int(entry.data[CONF_INVERTER_ID])
        self._attr_unique_id = f"{entry.entry_id}_schedule"
        self._attr_available = False
        self._slots: list[dict[str, Any]] = []
        self._attr_native_value = None
        self._attr_device_info = DeviceInfo(
            identifiers={("esphome", self._esphome_name)},
            manufacturer=MANUFACTURER,
            model=MODEL,
        )

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self.hass.bus.async_listen(self._event_type, self._handle_event))

    @callback
    def _handle_event(self, event: Event) -> None:
        raw = event.data.get("schedules")
        try:
            if isinstance(raw, str):
                parsed = json.loads(raw)
            elif isinstance(raw, list):
                parsed = raw
            else:
                raise ValueError("schedules missing")
            if not isinstance(parsed, list):
                raise ValueError("schedules is not a list")
        except (TypeError, ValueError, json.JSONDecodeError):
            _LOGGER.warning("Ignoring invalid schedule event from %s", self._event_type)
            return
        self._slots = parsed
        self._attr_native_value = dt_util.now().strftime("%Y-%m-%d %H:%M:%S")
        self._attr_available = True
        self.async_write_ha_state()

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            "data": self._slots,
            "device_prefix": self._prefix,
            "inverter_id": self._inverter_id,
        }
