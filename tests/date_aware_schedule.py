"""Date-aware schedule rules mirrored by inverter_solis_eh1_smart_schedule.yaml.

ESPHome ESPTime.day_of_week is Sunday=1 .. Saturday=7.
Selected-days bitmask is Monday=bit0 .. Sunday=bit6.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta

MODE_DAILY = 0
MODE_SELECTED_DAYS = 1
MODE_ONCE = 2
MODE_RANGE = 3


def days_in_month(month: int, year: int) -> int:
    dim = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if month == 2 and ((year % 4 == 0 and year % 100 != 0) or year % 400 == 0):
        return 29
    return dim[month]


def valid_ymd(ymd: int) -> bool:
    if ymd <= 0:
        return False
    year = ymd // 10000
    month = (ymd // 100) % 100
    day = ymd % 100
    if year < 2020 or year > 2100 or month < 1 or month > 12 or day < 1:
        return False
    return day <= days_in_month(month, year)


def to_ymd(d: date) -> int:
    return d.year * 10000 + d.month * 100 + d.day


def from_ymd(ymd: int) -> date:
    return date(ymd // 10000, (ymd // 100) % 100, ymd % 100)


def esphome_dow(d: date) -> int:
    """Sunday=1 .. Saturday=7."""
    return d.isoweekday() % 7 + 1


def monday0_from_esphome_dow(dow: int) -> int:
    """Map ESPHome Sunday=1 to Monday=0 .. Sunday=6."""
    return (dow + 5) % 7


def yesterday_fields(year: int, month: int, day: int, dow: int) -> tuple[int, int, int, int]:
    ydow = 7 if dow == 1 else dow - 1
    if day > 1:
        return year, month, day - 1, ydow
    if month > 1:
        month -= 1
        return year, month, days_in_month(month, year), ydow
    return year - 1, 12, 31, ydow


def in_time_window(now_mins: int, start_mins: int, end_mins: int) -> bool:
    if start_mins > end_mins:
        return now_mins >= start_mins or now_mins < end_mins
    return now_mins >= start_mins and now_mins < end_mins


def wrap_leftover(now_mins: int, start_mins: int, end_mins: int) -> bool:
    return start_mins > end_mins and now_mins < end_mins


def slot_date_matches(
    mode: int,
    selected_days: int,
    date_start: int,
    date_end: int,
    anchor_ymd: int,
    anchor_dow: int,
) -> bool:
    if mode == MODE_DAILY:
        return True
    if mode == MODE_SELECTED_DAYS:
        return (selected_days & (1 << monday0_from_esphome_dow(anchor_dow))) != 0
    if mode == MODE_ONCE:
        return anchor_ymd == date_start
    if mode == MODE_RANGE:
        return date_start <= anchor_ymd <= date_end
    return False


def keeps_after_window(mode: int) -> bool:
    return mode in (MODE_DAILY, MODE_SELECTED_DAYS, MODE_RANGE)


def should_wipe_expired(
    mode: int,
    date_start: int,
    date_end: int,
    today_ymd: int,
    yesterday_ymd: int,
    now_mins: int,
    start_mins: int,
    end_mins: int,
) -> bool:
    leftover = wrap_leftover(now_mins, start_mins, end_mins) and yesterday_ymd == (
        date_start if mode == MODE_ONCE else date_end
    )
    if leftover:
        return False
    if mode == MODE_ONCE:
        return today_ymd > date_start
    if mode == MODE_RANGE:
        return today_ymd > date_end
    return False


def resolve_upsert(
    repeat_mode: int,
    selected_days: int,
    date_start: int,
    date_end: int,
    repeat_daily: bool,
    today_ymd: int,
) -> tuple[int, int, int, int] | str:
    """Return (mode, selected_days, start, end) or an error string."""
    using_legacy = repeat_mode == 0 and selected_days == 0 and date_start == 0 and date_end == 0
    if using_legacy:
        if repeat_daily:
            return MODE_DAILY, 0, 0, 0
        return MODE_ONCE, 0, today_ymd, 0

    if repeat_mode not in (MODE_DAILY, MODE_SELECTED_DAYS, MODE_ONCE, MODE_RANGE):
        return "invalid mode"
    if repeat_mode == MODE_SELECTED_DAYS and not (1 <= selected_days <= 127):
        return "selected days required"
    if repeat_mode == MODE_ONCE and not valid_ymd(date_start):
        return "once date required"
    if repeat_mode == MODE_RANGE:
        if not valid_ymd(date_start) or not valid_ymd(date_end) or date_start > date_end:
            return "invalid date range"
    return repeat_mode, selected_days, date_start, date_end


@dataclass
class Slot:
    active: bool = False
    start_mins: int = 0
    end_mins: int = 0
    mode: int = MODE_DAILY
    selected_days: int = 0
    date_start: int = 0
    date_end: int = 0
    was_active: bool = False
    paused_by_target: bool = False
    wiped: bool = False

    def wipe(self) -> None:
        self.active = False
        self.start_mins = 0
        self.end_mins = 0
        self.mode = MODE_DAILY
        self.selected_days = 0
        self.date_start = 0
        self.date_end = 0
        self.was_active = False
        self.paused_by_target = False
        self.wiped = True


def evaluate(slots: list[Slot], when: datetime) -> int | None:
    """Return first eligible slot index, applying cleanup. None if idle."""
    today = when.date()
    today_ymd = to_ymd(today)
    now_mins = when.hour * 60 + when.minute
    dow = esphome_dow(today)
    yy, ym, yd, ydow = yesterday_fields(today.year, today.month, today.day, dow)
    y_ymd = yy * 10000 + ym * 100 + yd

    for slot in slots:
        if slot.wiped:
            continue
        if should_wipe_expired(
            slot.mode,
            slot.date_start,
            slot.date_end,
            today_ymd,
            y_ymd,
            now_mins,
            slot.start_mins,
            slot.end_mins,
        ) and not in_time_window(now_mins, slot.start_mins, slot.end_mins):
            # Only wipe expired once/range when not still inside a leftover window.
            if slot.mode in (MODE_ONCE, MODE_RANGE):
                slot.wipe()

    for slot in slots:
        if slot.wiped or not slot.paused_by_target:
            continue
        in_win = in_time_window(now_mins, slot.start_mins, slot.end_mins)
        if in_win:
            continue
        if keeps_after_window(slot.mode) and not should_wipe_expired(
            slot.mode,
            slot.date_start,
            slot.date_end,
            today_ymd,
            y_ymd,
            now_mins,
            slot.start_mins,
            slot.end_mins,
        ):
            slot.active = True
            slot.paused_by_target = False
            slot.was_active = False
        else:
            slot.wipe()

    chosen = None
    for i, slot in enumerate(slots):
        if slot.wiped or not slot.active:
            continue
        in_win = in_time_window(now_mins, slot.start_mins, slot.end_mins)
        if wrap_leftover(now_mins, slot.start_mins, slot.end_mins):
            anchor_ymd, anchor_dow = y_ymd, ydow
        else:
            anchor_ymd, anchor_dow = today_ymd, dow
        date_ok = slot_date_matches(
            slot.mode, slot.selected_days, slot.date_start, slot.date_end, anchor_ymd, anchor_dow
        )
        if date_ok and in_win:
            slot.was_active = True
            if chosen is None:
                chosen = i
        elif slot.was_active and slot.mode == MODE_ONCE:
            slot.wipe()
    return chosen
