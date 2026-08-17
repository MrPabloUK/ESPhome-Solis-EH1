"""Unit tests for Solis EH1 service field mapping."""

from __future__ import annotations

import sys
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "custom_components" / "solis_eh1"))

from mapping import MappingError, manage_payload, upsert_payload  # noqa: E402


class MappingTests(unittest.TestCase):
    def test_charge_daily(self) -> None:
        payload = upsert_payload(
            {
                "slot": 1,
                "mode": "charge",
                "start": "00:30",
                "end": "04:30",
                "target_soc": 90,
                "power": 3000,
                "repeat": "daily",
                "auto_pause": False,
            }
        )
        self.assertEqual(payload["Operation_Mode"], 1)
        self.assertEqual(payload["Repeat_Mode"], 0)
        self.assertEqual(payload["Start_Hour"], 0)
        self.assertEqual(payload["Start_Minute"], 30)
        self.assertTrue(payload["Repeat_Daily"])
        self.assertEqual(payload["Selected_Days"], 0)
        self.assertEqual(payload["Date_Start"], 0)

    def test_selected_days_mask(self) -> None:
        payload = upsert_payload(
            {
                "slot": 2,
                "mode": "discharge",
                "start": "20:00:00",
                "end": "21:00",
                "target_soc": 20,
                "power": 0,
                "repeat": "selected_days",
                "days": ["monday", "wednesday", "friday"],
            }
        )
        self.assertEqual(payload["Operation_Mode"], 2)
        self.assertEqual(payload["Repeat_Mode"], 1)
        self.assertEqual(payload["Selected_Days"], 0b0010101)

    def test_once_date(self) -> None:
        payload = upsert_payload(
            {
                "slot": 3,
                "mode": "charge",
                "start": "01:00",
                "end": "02:00",
                "target_soc": 100,
                "power": 0,
                "repeat": "once",
                "date_start": "2026-08-17",
            }
        )
        self.assertEqual(payload["Repeat_Mode"], 2)
        self.assertFalse(payload["Repeat_Daily"])
        self.assertEqual(payload["Date_Start"], 20260817)
        self.assertEqual(payload["Date_End"], 0)

    def test_range_order(self) -> None:
        with self.assertRaises(MappingError):
            upsert_payload(
                {
                    "slot": 1,
                    "mode": "charge",
                    "start": "00:00",
                    "end": "01:00",
                    "target_soc": 50,
                    "power": 0,
                    "repeat": "date_range",
                    "date_start": "2026-08-20",
                    "date_end": "2026-08-10",
                }
            )

    def test_manage(self) -> None:
        self.assertEqual(manage_payload({"slot": 4, "action": "delete"})["Instruction"], 0)
        self.assertEqual(manage_payload({"slot": 4, "action": "pause"})["Instruction"], 1)
        self.assertEqual(manage_payload({"slot": 4, "action": "resume"})["Instruction"], 2)


if __name__ == "__main__":
    unittest.main()
