"""Hostname helpers must ignore MAC and subdevice identifiers."""

from __future__ import annotations

import sys
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "custom_components" / "solis_eh1"))

from names import looks_like_mac, looks_like_subdevice_ident, usable_esphome_name  # noqa: E402


class DeviceNameTests(unittest.TestCase):
    def test_mac(self) -> None:
        self.assertTrue(looks_like_mac("aabbccddeeff"))
        self.assertTrue(looks_like_mac("AA:BB:CC:DD:EE:FF"))
        self.assertFalse(looks_like_mac("solisinverter"))

    def test_subdevice_ident(self) -> None:
        self.assertTrue(looks_like_subdevice_ident("aabbccddeeff_board"))
        self.assertTrue(looks_like_subdevice_ident("aabbccddeeff_inverter_1"))
        self.assertFalse(looks_like_subdevice_ident("solisinverter"))

    def test_usable_name(self) -> None:
        self.assertEqual(usable_esphome_name("solisinverter"), "solisinverter")
        self.assertIsNone(usable_esphome_name("aabbccddeeff"))
        self.assertIsNone(usable_esphome_name("aabbccddeeff_inverter_1"))
        self.assertIsNone(usable_esphome_name("Solis Controller"))


if __name__ == "__main__":
    unittest.main()
