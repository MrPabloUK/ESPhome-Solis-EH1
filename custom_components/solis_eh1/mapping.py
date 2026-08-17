"""Map human-readable Solis EH1 service fields to ESPHome action payloads."""

from __future__ import annotations

from datetime import date, datetime, time
from typing import Any

MAX_POWER = 6000
SLOT_MIN = 1
SLOT_MAX = 12

MODE_MAP = {
    "charge": 1,
    "discharge": 2,
    "1": 1,
    "2": 2,
    1: 1,
    2: 2,
}
REPEAT_MAP = {
    "daily": 0,
    "selected_days": 1,
    "once": 2,
    "date_range": 3,
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    0: 0,
    1: 1,
    2: 2,
    3: 3,
}
DAY_MAP = {
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,
    "mon": 0,
    "tue": 1,
    "wed": 2,
    "thu": 3,
    "fri": 4,
    "sat": 5,
    "sun": 6,
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
}
MANAGE_MAP = {
    "delete": 0,
    "pause": 1,
    "resume": 2,
    "0": 0,
    "1": 1,
    "2": 2,
    0: 0,
    1: 1,
    2: 2,
}


class MappingError(ValueError):
    """Invalid user-facing service field."""


def _days_in_month(month: int, year: int) -> int:
    dim = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if month == 2 and ((year % 4 == 0 and year % 100 != 0) or year % 400 == 0):
        return 29
    return dim[month] if 1 <= month <= 12 else 0


def valid_ymd(ymd: int) -> bool:
    if ymd <= 0:
        return False
    year, month, day = ymd // 10000, (ymd // 100) % 100, ymd % 100
    if year < 2020 or year > 2100 or month < 1 or month > 12 or day < 1:
        return False
    return day <= _days_in_month(month, year)


def parse_time_parts(value: Any) -> tuple[int, int]:
    if isinstance(value, datetime):
        return value.hour, value.minute
    if isinstance(value, time):
        return value.hour, value.minute
    text = str(value or "").strip()
    parts = text.split(":")
    if len(parts) < 2:
        raise MappingError("Time must be HH:MM.")
    try:
        hour, minute = int(parts[0]), int(parts[1])
    except ValueError as err:
        raise MappingError("Time must be HH:MM.") from err
    if hour < 0 or hour > 23 or minute < 0 or minute > 59:
        raise MappingError("Time must be a valid 24-hour clock value.")
    return hour, minute


def parse_ymd(value: Any) -> int:
    if value in (None, "", 0):
        return 0
    if isinstance(value, datetime):
        ymd = value.year * 10000 + value.month * 100 + value.day
    elif isinstance(value, date):
        ymd = value.year * 10000 + value.month * 100 + value.day
    else:
        text = str(value).strip().replace("-", "")
        try:
            ymd = int(text)
        except ValueError as err:
            raise MappingError("Date must be YYYY-MM-DD.") from err
    if not valid_ymd(ymd):
        raise MappingError("Date must be a valid YYYY-MM-DD value.")
    return ymd


def days_to_mask(days: Any) -> int:
    if days in (None, "", []):
        return 0
    if isinstance(days, int) and not isinstance(days, bool):
        if days < 0 or days > 127:
            raise MappingError("Selected days are invalid.")
        return days
    if isinstance(days, str):
        days = [part.strip() for part in days.split(",") if part.strip()]
    mask = 0
    for day in days:
        key: Any = day.lower() if isinstance(day, str) else day
        if key not in DAY_MAP:
            raise MappingError(f"Unknown day: {day}")
        mask |= 1 << DAY_MAP[key]
    return mask


def upsert_payload(data: dict[str, Any]) -> dict[str, Any]:
    """Build the numeric ESPHome upsert_schedule payload."""
    try:
        slot = int(data["slot"])
    except (KeyError, TypeError, ValueError) as err:
        raise MappingError("Slot must be 1-12.") from err
    if slot < SLOT_MIN or slot > SLOT_MAX:
        raise MappingError("Slot must be 1-12.")

    mode_key: Any = data.get("mode", "charge")
    if isinstance(mode_key, str):
        mode_key = mode_key.lower()
    if mode_key not in MODE_MAP:
        raise MappingError("Mode must be Charge or Discharge.")

    repeat_key: Any = data.get("repeat", "daily")
    if isinstance(repeat_key, str):
        repeat_key = repeat_key.lower()
    if repeat_key not in REPEAT_MAP:
        raise MappingError("Repeat must be Daily, Selected days, Once, or Date range.")
    repeat_mode = REPEAT_MAP[repeat_key]

    try:
        target_soc = int(data.get("target_soc", 100))
        power = int(data.get("power", 0))
    except (TypeError, ValueError) as err:
        raise MappingError("Target SOC and power must be numbers.") from err
    if target_soc < 0 or target_soc > 100:
        raise MappingError("Target SOC must be 0-100.")
    if power < 0 or power > MAX_POWER:
        raise MappingError(f"Power must be 0-{MAX_POWER}.")

    start_hour, start_minute = parse_time_parts(data.get("start"))
    end_hour, end_minute = parse_time_parts(data.get("end"))
    selected_days = days_to_mask(data.get("days"))
    date_start = parse_ymd(data.get("date_start"))
    date_end = parse_ymd(data.get("date_end"))

    if repeat_mode == 1 and (selected_days < 1 or selected_days > 127):
        raise MappingError("Select at least one day.")
    if repeat_mode == 2 and not valid_ymd(date_start):
        raise MappingError("Once requires a valid date.")
    if repeat_mode == 3:
        if not valid_ymd(date_start) or not valid_ymd(date_end):
            raise MappingError("Date range requires a start and end date.")
        if date_start > date_end:
            raise MappingError("Date range start must be on or before the end date.")
    if repeat_mode in (0, 1):
        date_start = 0
        date_end = 0
        if repeat_mode == 0:
            selected_days = 0
    if repeat_mode == 2:
        date_end = 0
        selected_days = 0
    if repeat_mode == 3:
        selected_days = 0

    return {
        "Slot_Number": slot,
        "Operation_Mode": MODE_MAP[mode_key],
        "Start_Hour": start_hour,
        "Start_Minute": start_minute,
        "End_Hour": end_hour,
        "End_Minute": end_minute,
        "Target_SOC_Percent": target_soc,
        "Power_Limit_Watts": power,
        "Repeat_Daily": repeat_mode != 2,
        "Repeat_Mode": repeat_mode,
        "Selected_Days": selected_days,
        "Date_Start": date_start,
        "Date_End": date_end,
        "Auto_Pause_On_Target": bool(data.get("auto_pause", False)),
    }


def manage_payload(data: dict[str, Any]) -> dict[str, Any]:
    try:
        slot = int(data["slot"])
    except (KeyError, TypeError, ValueError) as err:
        raise MappingError("Slot must be 1-12.") from err
    if slot < SLOT_MIN or slot > SLOT_MAX:
        raise MappingError("Slot must be 1-12.")
    action: Any = data.get("action", "pause")
    if isinstance(action, str):
        action = action.lower()
    if action not in MANAGE_MAP:
        raise MappingError("Action must be Delete, Pause, or Resume.")
    return {"Slot_Number": slot, "Instruction": MANAGE_MAP[action]}
