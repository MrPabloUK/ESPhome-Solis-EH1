# Solis Schedule Card

Lovelace card source for listing and editing Solis EH1 schedule slots.

Home Assistant users get this card from the **Solis EH1** integration. Do not copy the JS to `/config/www` unless you are developing without the integration.

The card reads the integration schedule sensor and writes through `solis_eh1.upsert_schedule`, `solis_eh1.manage_slot`, and `solis_eh1.delete_all_schedules`.

```yaml
type: custom:solis-schedule-card
entity: sensor.solis_eh1_schedule
```

Optional: `show_empty: true` lists all 12 slots, including empty ones.

## Develop

```bash
npm install
npm test
npm run vendor
```

`vendor` builds `dist/solis-schedule-card.js` and copies it to `custom_components/solis_eh1/www/`.
