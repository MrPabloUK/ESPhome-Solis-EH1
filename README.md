# ESPhome-Solis-EH1

ESPHome configuration for the Solis EH1 hybrid inverter, including schedule management via Home Assistant.

---

## Home Assistant Integration

### Option A — Package File (Recommended)

A single YAML file that installs the template sensor and schedule scripts in one step.

1. Copy [`home_assistant/solis_schedule_package.yaml`](home_assistant/solis_schedule_package.yaml) into your `config/packages/` directory.
2. Add the following to your `configuration.yaml` if not already present:
   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```
3. Restart Home Assistant.

This creates:
- `sensor.solis_master_schedule` — live schedule data from the inverter
- `script.solis_schedule_manager` — create or edit schedule slots
- `script.solis_schedule_slot_control` — pause, resume, or delete slots
- `script.solis_schedule_delete_all` — delete every slot in one go

---

### Option B — Script Blueprints

Import each script individually via the My Home Assistant buttons below. The blueprints include a configurable **ESPHome Action Prefix** so they work with any device hostname.

#### Solis: Create/Edit Schedule

[![Open your Home Assistant instance and show the blueprint import dialog with a specific blueprint pre-filled.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fraw.githubusercontent.com%2FMrPabloUK%2FESPhome-Solis-EH1%2Fmain%2Fhome_assistant%2Fblueprints%2Fsolis_schedule_manager.yaml)

#### Solis: Schedule Slot Control

[![Open your Home Assistant instance and show the blueprint import dialog with a specific blueprint pre-filled.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fraw.githubusercontent.com%2FMrPabloUK%2FESPhome-Solis-EH1%2Fmain%2Fhome_assistant%2Fblueprints%2Fsolis_schedule_slot_control.yaml)

#### Solis: Delete All Schedules

[![Open your Home Assistant instance and show the blueprint import dialog with a specific blueprint pre-filled.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fraw.githubusercontent.com%2FMrPabloUK%2FESPhome-Solis-EH1%2Fmain%2Fhome_assistant%2Fblueprints%2Fsolis_schedule_delete_all.yaml)

> **Note:** The template sensor (`sensor.solis_master_schedule`) cannot be imported as a blueprint. If you use Option B, also add the contents of [`home_assistant/templates.yaml`](home_assistant/templates.yaml) to your HA `template:` configuration, or use the package file from Option A instead.

---

### Lovelace card (recommended UI)

A custom card lists live slots and edits them with conditional fields (days only for Selected days, dates only for Once / Date range).

1. Copy [`home_assistant/lovelace/solis-schedule-card/dist/solis-schedule-card.js`](home_assistant/lovelace/solis-schedule-card/dist/solis-schedule-card.js) to `/config/www/solis-schedule-card.js`.
2. Add a Lovelace resource of type **JavaScript module** with URL `/local/solis-schedule-card.js` (or use `frontend.extra_module_url`).
3. Add a Manual card:

   ```yaml
   type: custom:solis-schedule-card
   entity: sensor.solis_master_schedule
   device_prefix: solisinverter_inverter1
   ```

See [`home_assistant/lovelace/solis-schedule-card/README.md`](home_assistant/lovelace/solis-schedule-card/README.md) for build notes. The YAML scripts above remain as a fallback. A markdown table card is in [`home_assistant/dashboard_markdown.yaml`](home_assistant/dashboard_markdown.yaml).

---

## ESPHome Configuration

| File | Description |
|------|-------------|
| `solis_eh1_RP.yaml` | Remote packages version — compiles without a local `packages/` folder |
| `solis_eh1_LP.yaml` | Local packages version |

Configure your WiFi credentials in `secrets.yaml` before compiling.
