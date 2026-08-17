import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    padding: 12px 12px 8px;
  }

  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }

  .title {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .updated {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }

  .empty-state,
  .error {
    padding: 16px 4px;
    color: var(--secondary-text-color);
  }

  .error {
    color: var(--error-color, #db4437);
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 10px;
    align-items: center;
    padding: 10px;
    border-radius: 12px;
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
    cursor: pointer;
    border: 1px solid transparent;
  }

  .row:hover,
  .row:focus-visible {
    border-color: var(--divider-color);
    outline: none;
  }

  .badge {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    font-weight: 600;
    font-size: 0.85rem;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  .body {
    min-width: 0;
  }

  .line1 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 8px;
  }

  .mode {
    font-weight: 600;
  }

  .mode.charge {
    color: var(--primary-color);
  }

  .mode.discharge {
    color: var(--accent-color, #ff9800);
  }

  .window {
    color: var(--primary-text-color);
  }

  .overnight {
    font-size: 0.7rem;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .line2 {
    margin-top: 4px;
    font-size: 0.85rem;
    color: var(--secondary-text-color);
    display: flex;
    flex-wrap: wrap;
    gap: 6px 10px;
    align-items: center;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 999px;
    padding: 1px 8px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .chip.active {
    background: rgba(56, 142, 60, 0.2);
    color: #81c784;
  }

  .chip.paused {
    background: rgba(255, 193, 7, 0.15);
    color: #ffcc80;
  }

  .chip.auto-paused {
    background: rgba(33, 150, 243, 0.15);
    color: #90caf9;
  }

  .days {
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.08em;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  button.icon {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--secondary-text-color);
    min-height: 32px;
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
  }

  button.icon:hover,
  button.icon:focus-visible {
    background: rgba(255, 255, 255, 0.08);
    color: var(--primary-text-color);
  }

  .add,
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 10px;
  }

  .hint {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }

  button.link,
  button.primary,
  button.danger,
  button.ghost {
    appearance: none;
    border: 0;
    cursor: pointer;
    border-radius: 8px;
    padding: 8px 12px;
    font: inherit;
  }

  button.link,
  button.ghost {
    background: transparent;
    color: var(--primary-color);
  }

  button.danger {
    background: transparent;
    color: var(--error-color, #db4437);
  }

  button.primary {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  button:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 8;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  @media (min-width: 640px) {
    .overlay {
      align-items: center;
    }
  }

  .dialog {
    width: min(520px, 100%);
    max-height: 100%;
    overflow: auto;
    background: var(--card-background-color, #1c1d22);
    color: var(--primary-text-color);
    border-radius: 16px 16px 0 0;
    padding: 16px;
    box-shadow: var(--ha-card-box-shadow, none);
  }

  @media (min-width: 640px) {
    .dialog {
      border-radius: 16px;
    }
  }

  .dialog h2,
  .dialog-title {
    margin: 0 0 12px;
    font-size: 1.15rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .slot-picker {
    position: relative;
    display: inline-block;
  }

  .slot-badge {
    appearance: none;
    min-width: 36px;
    height: 32px;
    padding: 0 8px;
    border: 0;
    border-radius: 8px;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .slot-popover {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(4, 36px);
    gap: 6px;
    padding: 8px;
    border-radius: 12px;
    background: var(--card-background-color, #1c1d22);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    border: 1px solid var(--divider-color);
  }

  .slot-cell {
    appearance: none;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--divider-color);
    background: transparent;
    color: var(--primary-text-color);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .slot-cell.selected {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  .slot-cell.in-use,
  .slot-cell:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .banner {
    background: rgba(255, 193, 7, 0.12);
    color: var(--primary-text-color);
    border-radius: 8px;
    padding: 8px 10px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
    font-size: 0.85rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
  }

  .field label {
    font-size: 0.8rem;
    color: var(--secondary-text-color);
  }

  .row-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .segmented {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .segmented button {
    appearance: none;
    border: 1px solid var(--divider-color);
    background: transparent;
    color: var(--primary-text-color);
    border-radius: 999px;
    padding: 6px 10px;
    cursor: pointer;
    font: inherit;
  }

  .segmented button[aria-pressed="true"] {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  input[type="time"],
  input[type="date"],
  input[type="number"],
  select {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--divider-color);
    background: var(--input-fill-color, transparent);
    color: var(--primary-text-color);
    border-radius: 8px;
    padding: 8px;
    font: inherit;
  }

  .help {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
  }

  .dialog-error {
    color: var(--error-color, #db4437);
    font-size: 0.85rem;
    margin-bottom: 8px;
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 8px;
  }

  .switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .switch input {
    width: auto;
  }
`;

export const editorStyles = css`
  .form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.85rem;
    color: var(--primary-text-color);
  }

  input {
    border: 1px solid var(--divider-color);
    background: var(--input-fill-color, transparent);
    color: var(--primary-text-color);
    border-radius: 8px;
    padding: 8px;
    font: inherit;
  }
`;
