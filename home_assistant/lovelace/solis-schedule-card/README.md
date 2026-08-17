# Solis Schedule Card

Custom Lovelace card for listing and editing Solis EH1 schedule slots.

The card reads `sensor.solis_master_schedule` and writes through the existing ESPHome actions. The YAML scripts remain available as a fallback.

## Install

1. Copy `dist/solis-schedule-card.js` to Home Assistant `/config/www/solis-schedule-card.js`.
2. Add a Lovelace resource:
   - **Settings → Dashboards → Resources → Add resource**
   - URL: `/local/solis-schedule-card.js`
   - Type: **JavaScript module**

   Or in `configuration.yaml`:

   ```yaml
   frontend:
     extra_module_url:
       - /local/solis-schedule-card.js
   ```

3. Restart Home Assistant or reload resources, then add a **Manual** card:

   ```yaml
   type: custom:solis-schedule-card
   entity: sensor.solis_master_schedule
   device_prefix: solisinverter_inverter1
   ```

`device_prefix` must match the ESPHome action prefix (Developer Tools → Actions, search `esphome`).

Optional: `show_empty: true` lists all 12 slots, including empty ones.

## Develop

```bash
npm install
npm test
npm run build
```

The built module is written to `dist/solis-schedule-card.js`.
