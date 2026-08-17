import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";
import { editorStyles } from "./styles";
import type { CardConfig, HomeAssistant } from "./types";

export class SolisScheduleCardEditor extends LitElement {
  static styles = editorStyles;

  @state() private _config?: CardConfig;
  @state() private _hass?: HomeAssistant;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  setConfig(config: CardConfig) {
    this._config = { ...config };
  }

  private _update(patch: Partial<CardConfig>) {
    this._config = { ...this._config!, ...patch };
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  protected render() {
    if (!this._config) return html``;
    return html`
      <div class="form">
        <label>
          Schedule sensor
          <input
            type="text"
            .value=${this._config.entity}
            @change=${(ev: Event) => this._update({ entity: (ev.target as HTMLInputElement).value })}
          />
        </label>
        <label>
          <span>
            <input
              type="checkbox"
              .checked=${Boolean(this._config.show_empty)}
              @change=${(ev: Event) => this._update({ show_empty: (ev.target as HTMLInputElement).checked })}
            />
            Show empty slots
          </span>
        </label>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "solis-schedule-card-editor": SolisScheduleCardEditor;
  }
}
