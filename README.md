# ESPhome-Solis-EH1

ESPHome firmware for the Solis EH1 hybrid inverter, plus a Home Assistant integration that shows and edits the 12 schedule slots.

The stick owns the schedule clock. Home Assistant stores a live copy, offers readable actions, and loads the Lovelace card.

---

## 1. Flash the firmware

| File | Description |
|------|-------------|
| `solis_eh1_RP.yaml` | Remote packages — compiles without a local `packages/` folder |
| `solis_eh1_LP.yaml` | Local packages |

1. Put Wi‑Fi and API credentials in `secrets.yaml`.
2. Uncomment the matching board package in the YAML.
3. Compile and flash with ESPHome (dashboard or CLI). Minimum ESPHome **2026.7.0**.
4. In Home Assistant, adopt the device in the built-in **ESPHome** integration.

The firmware advertises project `MrPabloUK.Solis-EH1-Controller` so the Solis EH1 integration can find it.

---

## 2. Install the Home Assistant integration

1. In [HACS](https://hacs.xyz/), add this repository as a custom **Integration**: `https://github.com/MrPabloUK/ESPhome-Solis-EH1`.
2. Download **Solis EH1**, then restart Home Assistant.
3. **Settings → Devices & services → Add integration → Solis EH1**.
4. Pick the adopted stick.

Alternatively, symlink or copy [`custom_components/solis_eh1/`](custom_components/solis_eh1/) into your HA `custom_components` folder.

This creates a **Schedule** sensor on the same device. It listens for `esphome.{hostname}_inverter{N}_schedule_update` and stores the 12-slot JSON in `attributes.data`.

---

## 3. Add the card

The integration registers **Solis Schedule** as a Lovelace card. Add it from the card picker, or in YAML:

```yaml
type: custom:solis-schedule-card
entity: sensor.solis_eh1_schedule
```

Use the entity id shown on the Solis EH1 device page if it differs.

---

## Actions

Use these from Developer Tools, automations, or the card. Do not call the raw `esphome.*` schedule actions unless you need the numeric payload.

| Action | Purpose |
|--------|---------|
| `solis_eh1.upsert_schedule` | Create or replace one slot (Charge/Discharge, times, repeat, days, dates) |
| `solis_eh1.manage_slot` | Delete, pause, or resume one slot |
| `solis_eh1.delete_all_schedules` | Wipe every slot on that stick |

Target the schedule sensor with `entity_id`.

---

## Lovelace card source

The card is built from [`home_assistant/lovelace/solis-schedule-card/`](home_assistant/lovelace/solis-schedule-card/). After changing it:

```bash
cd home_assistant/lovelace/solis-schedule-card
npm install
npm test
npm run vendor
```

That rebuilds `dist/solis-schedule-card.js` and copies it to `custom_components/solis_eh1/www/`.
