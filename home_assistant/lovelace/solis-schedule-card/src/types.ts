export const MODE_DAILY = 0;
export const MODE_SELECTED_DAYS = 1;
export const MODE_ONCE = 2;
export const MODE_RANGE = 3;

export const SLOT_COUNT = 12;
export const MAX_POWER = 6000;

export type RepeatMode = 0 | 1 | 2 | 3;
export type OperationMode = 1 | 2;
export type SlotStatus = "active" | "paused" | "auto-paused" | "empty";

export interface ScheduleSlot {
  Slot: number;
  Active: boolean;
  Mode: string;
  "Start Time": string;
  "End Time": string;
  "Target SOC": number;
  Power: number;
  Repeat: boolean;
  "Repeat Mode": number;
  "Selected Days": number;
  "Date Start": number;
  "Date End": number;
  "Auto Pause": boolean;
  "Paused By Target": boolean;
}

export interface CardConfig {
  type?: string;
  entity: string;
  show_empty?: boolean;
}

export interface SlotDraft {
  slot: number;
  operationMode: OperationMode;
  start: string;
  end: string;
  targetSoc: number;
  power: number;
  repeatMode: RepeatMode;
  selectedDays: number[];
  dateStart: string;
  dateEnd: string;
  autoPause: boolean;
}

export interface HassEntity {
  state: string;
  attributes: {
    data?: ScheduleSlot[];
    [key: string]: unknown;
  };
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  callService: (domain: string, service: string, data?: Record<string, unknown>) => Promise<unknown>;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}
