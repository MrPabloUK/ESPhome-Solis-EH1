import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  DAY_NAMES,
  draftToUpsert,
  emptyDraft,
  firstEmptySlot,
  occupiedSlotNumbers,
  formatPower,
  isEmptySlot,
  isOvernight,
  normalizeSlots,
  slotFingerprint,
  slotStatus,
  slotToDraft,
  statusLabel,
  validateDraft,
  whenLabel,
} from "./format";
import { cardStyles } from "./styles";
import {
  MODE_DAILY,
  MODE_ONCE,
  MODE_RANGE,
  MODE_SELECTED_DAYS,
  SLOT_COUNT,
  type CardConfig,
  type HomeAssistant,
  type RepeatMode,
  type ScheduleSlot,
  type SlotDraft,
} from "./types";

@customElement("solis-schedule-card")
export class SolisScheduleCard extends LitElement {
  static styles = cardStyles;

  @state() private _hass?: HomeAssistant;
  @state() private _config?: CardConfig;
  @state() private _draft: SlotDraft | null = null;
  @state() private _draftWasOccupied = false;
  @state() private _openedFingerprint = "";
  @state() private _stale = false;
  @state() private _busy = false;
  @state() private _error = "";
  @state() private _confirmDeleteAll = false;
  @state() private _menuSlot: number | null = null;
  @state() private _slotPickerOpen = false;

  static getStubConfig(): CardConfig {
    return {
      entity: "sensor.solis_master_schedule",
      device_prefix: "solisinverter_inverter1",
    };
  }

  static getConfigElement() {
    return document.createElement("solis-schedule-card-editor");
  }

  setConfig(config: CardConfig) {
    if (!config?.entity) throw new Error("entity is required");
    if (!config.device_prefix) throw new Error("device_prefix is required");
    this._config = config;
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (this._draft) {
      const live = this._slotByNumber(this._draft.slot);
      const next = live ? slotFingerprint(live) : "";
      this._stale = next !== this._openedFingerprint;
    }
  }

  getCardSize(): number {
    return 6;
  }

  private get _slots(): ScheduleSlot[] {
    const entity = this._hass?.states[this._config?.entity ?? ""];
    return normalizeSlots(entity?.attributes.data);
  }

  private get _occupied(): ScheduleSlot[] {
    const slots = this._slots;
    if (this._config?.show_empty) return slots;
    return slots.filter((slot) => !isEmptySlot(slot));
  }

  private _slotByNumber(slotNumber: number): ScheduleSlot | undefined {
    return this._slots.find((slot) => slot.Slot === slotNumber);
  }

  private _service(name: "upsert_schedule" | "manage_slot_status" | "delete_all_schedules") {
    return `${this._config!.device_prefix}_${name}`;
  }

  private async _call(service: string, data?: Record<string, unknown>) {
    if (!this._hass) return;
    this._busy = true;
    this._error = "";
    try {
      await this._hass.callService("esphome", service, data);
    } catch (err) {
      this._error = err instanceof Error ? err.message : "Home Assistant action failed.";
    } finally {
      this._busy = false;
    }
  }

  private _openEditor(slotNumber: number) {
    const live = this._slotByNumber(slotNumber);
    this._draftWasOccupied = Boolean(live && !isEmptySlot(live));
    this._draft = live && !isEmptySlot(live) ? slotToDraft(live) : emptyDraft(slotNumber);
    this._openedFingerprint = live ? slotFingerprint(live) : "";
    this._stale = false;
    this._error = "";
    this._menuSlot = null;
    this._slotPickerOpen = false;
  }

  private _closeEditor() {
    this._draft = null;
    this._stale = false;
    this._error = "";
    this._slotPickerOpen = false;
  }

  private _reloadDraft() {
    if (!this._draft) return;
    this._openEditor(this._draft.slot);
  }

  private _addSlot() {
    const next = firstEmptySlot(this._slots);
    if (next == null) {
      this._error = "All 12 slots are in use.";
      return;
    }
    this._openEditor(next);
  }

  private async _save() {
    if (!this._draft) return;
    const problem = validateDraft(this._draft);
    if (problem) {
      this._error = problem;
      return;
    }
    await this._call(this._service("upsert_schedule"), draftToUpsert(this._draft));
    if (!this._error) this._closeEditor();
  }

  private async _manage(slotNumber: number, instruction: 0 | 1 | 2) {
    this._menuSlot = null;
    await this._call(this._service("manage_slot_status"), {
      Slot_Number: slotNumber,
      Instruction: instruction,
    });
    if (instruction === 0 && this._draft?.slot === slotNumber) this._closeEditor();
  }

  private async _deleteAll() {
    await this._call(this._service("delete_all_schedules"));
    this._confirmDeleteAll = false;
    this._closeEditor();
  }

  private _patchDraft(patch: Partial<SlotDraft>) {
    if (!this._draft) return;
    this._draft = { ...this._draft, ...patch };
  }

  private _toggleDay(day: number) {
    if (!this._draft) return;
    const selected = new Set(this._draft.selectedDays);
    if (selected.has(day)) selected.delete(day);
    else selected.add(day);
    this._patchDraft({ selectedDays: [...selected].sort((a, b) => a - b) });
  }

  private _autoPauseHelp(mode: RepeatMode): string {
    if (mode === MODE_ONCE) return "Once slots are deleted after the time window ends.";
    return "Slot resumes after the time window ends.";
  }

  private _renderWhen(slot: ScheduleSlot) {
    const label = whenLabel(slot);
    if ((slot["Repeat Mode"] ?? 0) === MODE_SELECTED_DAYS) {
      return html`<span class="days" title="Selected days">${label}</span>`;
    }
    return html`<span>${label}</span>`;
  }

  private _renderRow(slot: ScheduleSlot) {
    const status = slotStatus(slot);
    const overnight = isOvernight(slot["Start Time"], slot["End Time"]);
    return html`
      <div
        class="row"
        role="button"
        tabindex="0"
        @click=${() => this._openEditor(slot.Slot)}
        @keydown=${(ev: KeyboardEvent) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            this._openEditor(slot.Slot);
          }
        }}
      >
        <div class="badge">${slot.Slot}</div>
        <div class="body">
          <div class="line1">
            <span class="chip ${status}">${statusLabel(status)}</span>
            <span class="mode ${slot.Mode.toLowerCase()}">${slot.Mode}</span>
            <span class="window">${slot["Start Time"]} – ${slot["End Time"]}</span>
            ${overnight ? html`<span class="overnight">Overnight</span>` : nothing}
          </div>
          <div class="line2">
            ${this._renderWhen(slot)}
            <span>SOC ${slot["Target SOC"]}%</span>
            <span>${formatPower(slot.Power)}</span>
            ${slot["Auto Pause"] ? html`<span>Auto-pause</span>` : nothing}
          </div>
        </div>
        <div class="actions" @click=${(ev: Event) => ev.stopPropagation()}>
          ${status === "active"
            ? html`<button class="icon" title="Pause" @click=${() => this._manage(slot.Slot, 1)}>Pause</button>`
            : html`<button class="icon" title="Resume" @click=${() => this._manage(slot.Slot, 2)}>Go</button>`}
          <button
            class="icon"
            title="More"
            @click=${() => (this._menuSlot = this._menuSlot === slot.Slot ? null : slot.Slot)}
          >
            More
          </button>
        </div>
      </div>
      ${this._menuSlot === slot.Slot
        ? html`
            <div class="actions" style="justify-content: flex-end">
              <button class="ghost" @click=${() => this._openEditor(slot.Slot)}>Edit</button>
              <button class="ghost" @click=${() => this._manage(slot.Slot, status === "active" ? 1 : 2)}>
                ${status === "active" ? "Pause" : "Resume"}
              </button>
              <button class="danger" @click=${() => this._manage(slot.Slot, 0)}>Delete</button>
            </div>
          `
        : nothing}
    `;
  }

  private _chooseSlot(slotNumber: number) {
    const occupied = occupiedSlotNumbers(this._slots);
    if (occupied.has(slotNumber)) return;
    this._patchDraft({ slot: slotNumber });
    this._slotPickerOpen = false;
  }

  private _renderSlotPicker(draft: SlotDraft) {
    if (this._draftWasOccupied) return nothing;
    const occupied = occupiedSlotNumbers(this._slots);
    return html`
      <div class="slot-picker">
        <button
          class="slot-badge"
          type="button"
          aria-expanded=${this._slotPickerOpen}
          aria-haspopup="listbox"
          title="Change slot"
          @click=${(ev: Event) => {
            ev.stopPropagation();
            this._slotPickerOpen = !this._slotPickerOpen;
          }}
        >
          ${draft.slot}
        </button>
        ${this._slotPickerOpen
          ? html`
              <div class="slot-popover" role="listbox" aria-label="Choose slot" @click=${(ev: Event) => ev.stopPropagation()}>
                ${Array.from({ length: SLOT_COUNT }, (_, i) => i + 1).map((n) => {
                  const inUse = occupied.has(n);
                  const selected = n === draft.slot;
                  return html`
                    <button
                      type="button"
                      role="option"
                      class="slot-cell ${selected ? "selected" : ""} ${inUse ? "in-use" : ""}"
                      aria-selected=${selected}
                      ?disabled=${inUse}
                      @click=${() => this._chooseSlot(n)}
                    >
                      ${n}
                    </button>
                  `;
                })}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderEditor() {
    const draft = this._draft;
    if (!draft) return nothing;
    return html`
      <div class="overlay" @click=${() => this._closeEditor()}>
        <div
          class="dialog"
          @click=${(ev: Event) => {
            ev.stopPropagation();
            this._slotPickerOpen = false;
          }}
        >
          <h2 class="dialog-title">
            ${this._draftWasOccupied ? `Edit slot ${draft.slot}` : html`Add slot ${this._renderSlotPicker(draft)}`}
          </h2>
          ${this._stale
            ? html`
                <div class="banner">
                  <span>Slot changed on device.</span>
                  <button class="link" @click=${() => this._reloadDraft()}>Reload</button>
                </div>
              `
            : nothing}
          ${this._error ? html`<div class="dialog-error">${this._error}</div>` : nothing}

          <div class="field">
            <label>Mode</label>
            <div class="segmented">
              <button
                aria-pressed=${draft.operationMode === 1}
                @click=${() => this._patchDraft({ operationMode: 1 })}
              >
                Charge
              </button>
              <button
                aria-pressed=${draft.operationMode === 2}
                @click=${() => this._patchDraft({ operationMode: 2 })}
              >
                Discharge
              </button>
            </div>
          </div>

          <div class="row-fields">
            <div class="field">
              <label>Start</label>
              <input
                type="time"
                .value=${draft.start}
                @change=${(ev: Event) => this._patchDraft({ start: (ev.target as HTMLInputElement).value })}
              />
            </div>
            <div class="field">
              <label>End</label>
              <input
                type="time"
                .value=${draft.end}
                @change=${(ev: Event) => this._patchDraft({ end: (ev.target as HTMLInputElement).value })}
              />
            </div>
          </div>
          ${isOvernight(draft.start, draft.end)
            ? html`<div class="help" style="margin-top:-8px;margin-bottom:12px">Overnight window: stays on the start day after midnight.</div>`
            : nothing}

          <div class="row-fields">
            <div class="field">
              <label>Target SOC (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                .value=${String(draft.targetSoc)}
                @change=${(ev: Event) => this._patchDraft({ targetSoc: Number((ev.target as HTMLInputElement).value) })}
              />
            </div>
            <div class="field">
              <label>Power (W)</label>
              <input
                type="number"
                min="0"
                max="6000"
                .value=${String(draft.power)}
                @change=${(ev: Event) => this._patchDraft({ power: Number((ev.target as HTMLInputElement).value) })}
              />
              <span class="help">0 = unlimited</span>
            </div>
          </div>

          <div class="field">
            <label>Repeat</label>
            <div class="segmented">
              ${[
                [MODE_DAILY, "Daily"],
                [MODE_SELECTED_DAYS, "Selected days"],
                [MODE_ONCE, "Once"],
                [MODE_RANGE, "Date range"],
              ].map(
                ([mode, label]) => html`
                  <button
                    aria-pressed=${draft.repeatMode === mode}
                    @click=${() => this._patchDraft({ repeatMode: mode as RepeatMode })}
                  >
                    ${label}
                  </button>
                `,
              )}
            </div>
          </div>

          ${draft.repeatMode === MODE_SELECTED_DAYS
            ? html`
                <div class="field">
                  <label>Days</label>
                  <div class="segmented" role="group" aria-label="Days">
                    ${DAY_NAMES.map(
                      (name, day) => html`
                        <button
                          aria-pressed=${draft.selectedDays.includes(day)}
                          @click=${() => this._toggleDay(day)}
                        >
                          ${name}
                        </button>
                      `,
                    )}
                  </div>
                </div>
              `
            : nothing}

          ${draft.repeatMode === MODE_ONCE || draft.repeatMode === MODE_RANGE
            ? html`
                <div class="row-fields">
                  <div class="field">
                    <label>${draft.repeatMode === MODE_RANGE ? "Start date" : "Date"}</label>
                    <input
                      type="date"
                      .value=${draft.dateStart}
                      @change=${(ev: Event) => this._patchDraft({ dateStart: (ev.target as HTMLInputElement).value })}
                    />
                  </div>
                  ${draft.repeatMode === MODE_RANGE
                    ? html`
                        <div class="field">
                          <label>End date</label>
                          <input
                            type="date"
                            .value=${draft.dateEnd}
                            @change=${(ev: Event) => this._patchDraft({ dateEnd: (ev.target as HTMLInputElement).value })}
                          />
                        </div>
                      `
                    : nothing}
                </div>
              `
            : nothing}

          <div class="field switch">
            <div>
              <label>Auto-pause when target reached</label>
              <div class="help">${this._autoPauseHelp(draft.repeatMode)}</div>
            </div>
            <input
              type="checkbox"
              .checked=${draft.autoPause}
              @change=${(ev: Event) => this._patchDraft({ autoPause: (ev.target as HTMLInputElement).checked })}
            />
          </div>

          <div class="dialog-actions">
            <button class="ghost" @click=${() => this._closeEditor()}>Cancel</button>
            ${this._draftWasOccupied
              ? html`<button class="danger" ?disabled=${this._busy} @click=${() => this._manage(draft.slot, 0)}>
                  Delete
                </button>`
              : nothing}
            <button class="primary" ?disabled=${this._busy} @click=${() => this._save()}>Save</button>
          </div>
        </div>
      </div>
    `;
  }

  protected render() {
    if (!this._config) return html``;
    const entity = this._hass?.states[this._config.entity];
    const occupied = this._occupied;

    return html`
      <ha-card>
        <div class="header">
          <div class="title">Inverter Schedules</div>
          <div class="updated">${entity ? `Updated ${entity.state}` : ""}</div>
        </div>
        ${this._error && !this._draft ? html`<div class="error">${this._error}</div>` : nothing}
        ${!entity
          ? html`<div class="empty-state">Sensor ${this._config.entity} is not available.</div>`
          : occupied.length === 0
            ? html`<div class="empty-state">No schedule slots yet.</div>`
            : html`<div class="rows">${occupied.map((slot) => this._renderRow(slot))}</div>`}
        <div class="add">
          <button class="link" ?disabled=${this._busy} @click=${() => this._addSlot()}>Add slot</button>
        </div>
        <div class="footer">
          <span class="hint">Lower slot numbers have higher priority if windows overlap.</span>
          ${this._confirmDeleteAll
            ? html`
                <span>
                  <button class="ghost" @click=${() => (this._confirmDeleteAll = false)}>Cancel</button>
                  <button class="danger" ?disabled=${this._busy} @click=${() => this._deleteAll()}>
                    Confirm delete all
                  </button>
                </span>
              `
            : html`<button class="danger" @click=${() => (this._confirmDeleteAll = true)}>Delete all</button>`}
        </div>
      </ha-card>
      ${this._renderEditor()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "solis-schedule-card": SolisScheduleCard;
  }
}
