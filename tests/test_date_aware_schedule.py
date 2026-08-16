import unittest
from datetime import datetime

from date_aware_schedule import (
    MODE_DAILY,
    MODE_ONCE,
    MODE_RANGE,
    MODE_SELECTED_DAYS,
    Slot,
    esphome_dow,
    evaluate,
    monday0_from_esphome_dow,
    resolve_upsert,
    to_ymd,
    valid_ymd,
    yesterday_fields,
)

MON_FRI = 0b0011111  # bits 0-4
FRI_ONLY = 1 << 4
ALL_WEEK = 0b1111111


def slot(**kwargs) -> Slot:
    defaults = dict(active=True, start_mins=60, end_mins=300, mode=MODE_DAILY)
    defaults.update(kwargs)
    return Slot(**defaults)


class MappingTests(unittest.TestCase):
    def test_esphome_dow_sunday_is_1(self):
        self.assertEqual(esphome_dow(datetime(2026, 8, 16).date()), 1)  # Sunday
        self.assertEqual(esphome_dow(datetime(2026, 8, 17).date()), 2)  # Monday
        self.assertEqual(esphome_dow(datetime(2026, 8, 22).date()), 7)  # Saturday

    def test_monday0_mapping(self):
        self.assertEqual(monday0_from_esphome_dow(1), 6)  # Sun
        self.assertEqual(monday0_from_esphome_dow(2), 0)  # Mon
        self.assertEqual(monday0_from_esphome_dow(7), 5)  # Sat

    def test_yesterday_across_month(self):
        y, m, d, dow = yesterday_fields(2026, 3, 1, 1)  # Sunday 1 Mar
        self.assertEqual((y, m, d), (2026, 2, 28))
        self.assertEqual(dow, 7)

    def test_yesterday_across_year(self):
        y, m, d, dow = yesterday_fields(2026, 1, 1, 5)  # Thursday
        self.assertEqual((y, m, d), (2025, 12, 31))
        self.assertEqual(dow, 4)

    def test_valid_ymd(self):
        self.assertTrue(valid_ymd(20260816))
        self.assertFalse(valid_ymd(20260229))
        self.assertTrue(valid_ymd(20280229))
        self.assertFalse(valid_ymd(0))


class UpsertTests(unittest.TestCase):
    def test_legacy_repeat_daily_true(self):
        self.assertEqual(resolve_upsert(0, 0, 0, 0, True, 20260816), (MODE_DAILY, 0, 0, 0))

    def test_legacy_repeat_daily_false_becomes_once_today(self):
        self.assertEqual(resolve_upsert(0, 0, 0, 0, False, 20260816), (MODE_ONCE, 0, 20260816, 0))

    def test_explicit_daily(self):
        self.assertEqual(resolve_upsert(MODE_DAILY, 0, 0, 0, True, 20260816), (MODE_DAILY, 0, 0, 0))

    def test_selected_days_requires_mask(self):
        self.assertEqual(resolve_upsert(MODE_SELECTED_DAYS, 0, 0, 0, True, 20260816), "selected days required")
        self.assertEqual(resolve_upsert(MODE_SELECTED_DAYS, MON_FRI, 0, 0, True, 20260816), (MODE_SELECTED_DAYS, MON_FRI, 0, 0))

    def test_once_and_range_validation(self):
        self.assertEqual(resolve_upsert(MODE_ONCE, 0, 0, 0, False, 20260816), "once date required")
        self.assertEqual(resolve_upsert(MODE_RANGE, 0, 20260820, 20260810, False, 20260816), "invalid date range")
        self.assertEqual(
            resolve_upsert(MODE_RANGE, 0, 20260810, 20260820, False, 20260816),
            (MODE_RANGE, 0, 20260810, 20260820),
        )


class ScheduleMatrixTests(unittest.TestCase):
    def test_1_daily_window(self):
        slots = [slot(start_mins=60, end_mins=300)]
        self.assertEqual(evaluate(slots, datetime(2026, 8, 16, 1, 30)), 0)
        self.assertIsNone(evaluate(slots, datetime(2026, 8, 16, 6, 0)))

    def test_2_selected_days_mon_fri_silent_weekend(self):
        slots = [slot(start_mins=30, end_mins=270, mode=MODE_SELECTED_DAYS, selected_days=MON_FRI)]
        self.assertEqual(evaluate(slots, datetime(2026, 8, 17, 1, 0)), 0)  # Monday
        self.assertEqual(evaluate(slots, datetime(2026, 8, 21, 1, 0)), 0)  # Friday
        self.assertIsNone(evaluate(slots, datetime(2026, 8, 22, 1, 0)))  # Saturday
        self.assertIsNone(evaluate(slots, datetime(2026, 8, 16, 1, 0)))  # Sunday

    def test_3_friday_overnight_selected_days(self):
        slots = [slot(start_mins=22 * 60, end_mins=6 * 60, mode=MODE_SELECTED_DAYS, selected_days=MON_FRI)]
        self.assertEqual(evaluate(slots, datetime(2026, 8, 21, 23, 0)), 0)  # Friday 23:00
        self.assertEqual(evaluate(slots, datetime(2026, 8, 22, 1, 0)), 0)  # Saturday 01:00 leftover
        self.assertIsNone(evaluate(slots, datetime(2026, 8, 22, 22, 0)))  # Saturday night, Sat not set

    def test_4_once_today_then_wiped(self):
        slots = [slot(start_mins=14 * 60, end_mins=16 * 60, mode=MODE_ONCE, date_start=20260816)]
        self.assertEqual(evaluate(slots, datetime(2026, 8, 16, 15, 0)), 0)
        self.assertTrue(slots[0].was_active)
        self.assertIsNone(evaluate(slots, datetime(2026, 8, 16, 16, 0)))
        self.assertTrue(slots[0].wiped)

    def test_5_once_overnight_survives_midnight(self):
        slots = [slot(start_mins=22 * 60, end_mins=6 * 60, mode=MODE_ONCE, date_start=20260816)]
        self.assertEqual(evaluate(slots, datetime(2026, 8, 16, 23, 0)), 0)
        self.assertEqual(evaluate(slots, datetime(2026, 8, 17, 1, 0)), 0)
        self.assertFalse(slots[0].wiped)
        self.assertIsNone(evaluate(slots, datetime(2026, 8, 17, 6, 0)))
        self.assertTrue(slots[0].wiped)

    def test_6_range_last_night_wrap_then_wipe(self):
        slots = [
            slot(
                start_mins=22 * 60,
                end_mins=6 * 60,
                mode=MODE_RANGE,
                date_start=20260810,
                date_end=20260820,
            )
        ]
        self.assertEqual(evaluate(slots, datetime(2026, 8, 20, 23, 0)), 0)
        self.assertEqual(evaluate(slots, datetime(2026, 8, 21, 1, 0)), 0)
        self.assertIsNone(evaluate(slots, datetime(2026, 8, 21, 7, 0)))
        self.assertTrue(slots[0].wiped)

    def test_7_auto_pause_selected_days_resumes_next_matching_day(self):
        slots = [
            slot(
                start_mins=30,
                end_mins=270,
                mode=MODE_SELECTED_DAYS,
                selected_days=MON_FRI,
                active=False,
                paused_by_target=True,
            )
        ]
        self.assertIsNone(evaluate(slots, datetime(2026, 8, 21, 5, 0)))  # Friday after window
        self.assertTrue(slots[0].active)
        self.assertFalse(slots[0].paused_by_target)
        self.assertIsNone(evaluate(slots, datetime(2026, 8, 22, 1, 0)))  # Saturday
        self.assertTrue(slots[0].active)
        self.assertEqual(evaluate(slots, datetime(2026, 8, 24, 1, 0)), 0)  # Monday

    def test_8_slot1_selected_days_beats_slot2_daily_on_matching_days_only(self):
        slots = [
            slot(start_mins=60, end_mins=300, mode=MODE_SELECTED_DAYS, selected_days=MON_FRI),
            slot(start_mins=60, end_mins=300, mode=MODE_DAILY),
        ]
        self.assertEqual(evaluate(slots, datetime(2026, 8, 17, 2, 0)), 0)  # Monday: selected-days slot
        self.assertEqual(evaluate(slots, datetime(2026, 8, 16, 2, 0)), 1)  # Sunday: daily slot

    def test_9_restored_zeroed_slot_is_daily(self):
        slots = [Slot(active=True, start_mins=60, end_mins=300)]
        self.assertEqual(slots[0].mode, MODE_DAILY)
        self.assertEqual(evaluate(slots, datetime(2026, 8, 16, 2, 0)), 0)

    def test_auto_pause_once_wipes_at_window_end(self):
        slots = [
            slot(
                start_mins=14 * 60,
                end_mins=16 * 60,
                mode=MODE_ONCE,
                date_start=20260816,
                active=False,
                paused_by_target=True,
            )
        ]
        self.assertIsNone(evaluate(slots, datetime(2026, 8, 16, 16, 5)))
        self.assertTrue(slots[0].wiped)

    def test_range_inside_dates_but_outside_clock_is_idle_not_wiped(self):
        slots = [slot(start_mins=60, end_mins=120, mode=MODE_RANGE, date_start=20260810, date_end=20260820)]
        self.assertIsNone(evaluate(slots, datetime(2026, 8, 15, 8, 0)))
        self.assertFalse(slots[0].wiped)
        self.assertTrue(slots[0].active)


if __name__ == "__main__":
    unittest.main()
