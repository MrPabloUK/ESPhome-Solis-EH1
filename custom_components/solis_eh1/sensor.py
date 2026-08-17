"""Schedule sensor that receives ESPHome schedule events."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    CONF_DEVICE_ID,
    CONF_DEVICE_PREFIX,
    CONF_ESPHOME_NAME,
    CONF_EVENT_TYPE,
    CONF_INVERTER_ID,
)
from .device import inverter_device_for_schedule, schedule_device_info
from .schedule_event import extract_slots
from .services import async_request_snapshot

_LOGGER = logging.getLogger(__name__)
DESIRED_ENTITY_ID = "sensor.solis_eh1_schedule"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    device = inverter_device_for_schedule(hass, entry.data[CONF_DEVICE_ID])
    async_add_entities([SolisScheduleSensor(entry, schedule_device_info(device, entry.entry_id))])


class SolisScheduleSensor(SensorEntity):
    """Last schedule push from the stick."""

    _attr_has_entity_name = True
    _attr_name = "Schedule"
    _attr_suggested_object_id = "solis_eh1_schedule"
    _attr_icon = "mdi:calendar-clock"
    _attr_should_poll = False
    _attr_translation_key = "schedule"

    def __init__(self, entry: ConfigEntry, device_info: DeviceInfo) -> None:
        self._entry = entry
        self._esphome_name: str = entry.data[CONF_ESPHOME_NAME]
        self._prefix: str = entry.data[CONF_DEVICE_PREFIX]
        self._event_type: str = entry.data[CONF_EVENT_TYPE]
        self._inverter_id: int = int(entry.data[CONF_INVERTER_ID])
        self._attr_unique_id = f"{self._esphome_name}_inverter{self._inverter_id}_schedule"
        self._attr_available = True
        self._slots: list[dict[str, Any]] = []
        self._attr_native_value = "waiting"
        self._heard_event: str | None = None
        self._attr_device_info = device_info

    def _event_types(self) -> set[str]:
        return {
            self._event_type,
            f"esphome.{self._prefix}_schedule_update",
            f"esphome.solis_inverter{self._inverter_id}_schedule_update",
        }

    def _migrate_entity_id(self) -> None:
        if self.entity_id != "sensor.schedule":
            return
        registry = er.async_get(self.hass)
        if registry.async_get(DESIRED_ENTITY_ID) is not None:
            return
        registry.async_update_entity(self.entity_id, new_entity_id=DESIRED_ENTITY_ID)

    async def _request_snapshot(self) -> None:
        try:
            await async_request_snapshot(self.hass, self._prefix)
        except HomeAssistantError as err:
            _LOGGER.info("Schedule snapshot not requested: %s", err)

    async def async_added_to_hass(self) -> None:
        self._migrate_entity_id()
        for event_type in self._event_types():
            self.async_on_remove(self.hass.bus.async_listen(event_type, self._handle_event))
        _LOGGER.info(
            "Solis schedule sensor listening for %s",
            ", ".join(sorted(self._event_types())),
        )
        self.hass.async_create_task(self._request_snapshot())

    @callback
    def _handle_event(self, event: Event) -> None:
        slots = extract_slots(event.data)
        if slots is None:
            _LOGGER.warning(
                "Ignoring invalid schedule event %s keys=%s",
                event.event_type,
                list(event.data),
            )
            return
        self._slots = slots
        self._heard_event = event.event_type
        self._attr_native_value = dt_util.now().strftime("%Y-%m-%d %H:%M:%S")
        _LOGGER.info("Schedule update from %s (%s slots)", event.event_type, len(slots))
        self.async_write_ha_state()

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            "data": self._slots,
            "device_prefix": self._prefix,
            "inverter_id": self._inverter_id,
            "event_type": self._event_type,
            "last_event": self._heard_event,
        }
