"""Constants for the Solis EH1 integration."""

from __future__ import annotations

DOMAIN = "solis_eh1"
MANUFACTURER = "MrPabloUK"
MODEL = "Solis-EH1-Controller"
PROJECT_NAME = "MrPabloUK.Solis-EH1-Controller"
VERSION = "1.2.2"

CONF_DEVICE_ID = "device_id"
CONF_ESPHOME_NAME = "esphome_name"
CONF_INVERTER_ID = "inverter_id"
CONF_DEVICE_PREFIX = "device_prefix"
CONF_EVENT_TYPE = "event_type"

PLATFORMS = ["sensor"]

CARD_FILENAME = "solis-schedule-card.js"
CARD_URL_PATH = f"/{DOMAIN}/{CARD_FILENAME}"

SERVICE_UPSERT = "upsert_schedule"
SERVICE_MANAGE = "manage_slot"
SERVICE_DELETE_ALL = "delete_all_schedules"

ESPHOME_UPSERT = "upsert_schedule"
ESPHOME_MANAGE = "manage_slot_status"
ESPHOME_DELETE_ALL = "delete_all_schedules"

SCHEDULE_STATUS_RE = r"inverter(\d+)_schedule_logic_status"
