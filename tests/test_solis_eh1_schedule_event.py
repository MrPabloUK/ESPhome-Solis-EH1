"""Schedule event payload parsing."""

from __future__ import annotations

import sys
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "custom_components" / "solis_eh1"))

from schedule_event import extract_slots  # noqa: E402


class ScheduleEventTests(unittest.TestCase):
    def test_json_string(self) -> None:
        slots = extract_slots({"schedules": '[{"Slot":1,"Active":false}]'})
        self.assertEqual(slots, [{"Slot": 1, "Active": False}])

    def test_already_parsed_list(self) -> None:
        slots = extract_slots({"schedules": [{"Slot": 2}]})
        self.assertEqual(slots, [{"Slot": 2}])

    def test_nested_data(self) -> None:
        slots = extract_slots({"data": {"schedules": "[]"}})
        self.assertEqual(slots, [])

    def test_rejects_unrelated_list(self) -> None:
        self.assertIsNone(extract_slots({"schedules": [{"id": 1}]}))
        self.assertIsNone(extract_slots({"other": '[{"Slot":1}]'}))


if __name__ == "__main__":
    unittest.main()
