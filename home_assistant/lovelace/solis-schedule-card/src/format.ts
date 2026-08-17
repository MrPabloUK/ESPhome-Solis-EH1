import {
  MAX_POWER,
  MODE_DAILY,
  MODE_ONCE,
  MODE_RANGE,
  MODE_SELECTED_DAYS,
  type RepeatMode,
  type ScheduleSlot,
  type SlotDraft,
  type SlotStatus,
} from "./types";

export const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"] as const;
export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function daysInMonth(month: number, year: number): number {
  const dim = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
    return 29;
  }
  return dim[month] ?? 0;
}

export function validYmd(ymd: number): boolean {
  if (ymd <= 0) return false;
  const year = Math.floor(ymd / 10000);
  const month = Math.floor(ymd / 100) % 100;
  const day = ymd % 100;
  if (year < 2020 || year > 2100 || month < 1 || month > 12 || day < 1) return false;
  return day <= daysInMonth(month, year);
}

export function ymdToIso(ymd: number): string {
  if (!validYmd(ymd)) return "";
  const year = Math.floor(ymd / 10000);
  const month = Math.floor(ymd / 100) % 100;
  const day = ymd % 100;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function isoToYmd(iso: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return 0;
  const ymd = Number(match[1]) * 10000 + Number(match[2]) * 100 + Number(match[3]);
  return validYmd(ymd) ? ymd : 0;
}

export function maskToDays(mask: number): number[] {
  const days: number[] = [];
  for (let i = 0; i < 7; i++) {
    if (mask & (1 << i)) days.push(i);
  }
  return days;
}

export function daysToMask(days: number[]): number {
  return days.reduce((mask, day) => {
    if (day >= 0 && day <= 6) return mask | (1 << day);
    return mask;
  }, 0);
}

export function weekdayMaskLabel(mask: number): string {
  return DAY_LETTERS.map((letter, i) => ((mask & (1 << i)) !== 0 ? letter : "·")).join("");
}

export function parseTime(hhmm: string): { hour: number; minute: number } | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec((hhmm || "").trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

export function isOvernight(start: string, end: string): boolean {
  const s = parseTime(start);
  const e = parseTime(end);
  if (!s || !e) return false;
  return s.hour * 60 + s.minute > e.hour * 60 + e.minute;
}

export function formatPower(watts: number): string {
  return watts > 0 ? `${watts} W` : "Unlimited";
}

export function isEmptySlot(slot: ScheduleSlot | undefined): boolean {
  if (!slot) return true;
  return slot.Mode === "Idle" || slot.Mode === "" || !slot.Mode;
}

export function slotStatus(slot: ScheduleSlot): SlotStatus {
  if (isEmptySlot(slot)) return "empty";
  if (slot["Paused By Target"]) return "auto-paused";
  if (slot.Active) return "active";
  return "paused";
}

export function statusLabel(status: SlotStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "paused":
      return "Paused";
    case "auto-paused":
      return "Auto-paused";
    default:
      return "Empty";
  }
}

export function whenLabel(slot: ScheduleSlot): string {
  const mode = (slot["Repeat Mode"] ?? 0) as RepeatMode;
  if (mode === MODE_SELECTED_DAYS) return weekdayMaskLabel(slot["Selected Days"] ?? 0);
  if (mode === MODE_ONCE) return ymdToIso(slot["Date Start"] ?? 0) || String(slot["Date Start"] ?? "");
  if (mode === MODE_RANGE) {
    const start = ymdToIso(slot["Date Start"] ?? 0) || String(slot["Date Start"] ?? "");
    const end = ymdToIso(slot["Date End"] ?? 0) || String(slot["Date End"] ?? "");
    return `${start}–${end}`;
  }
  return "Daily";
}

export function slotFingerprint(slot: ScheduleSlot): string {
  return JSON.stringify(slot);
}

export function slotToDraft(slot: ScheduleSlot): SlotDraft {
  const empty = isEmptySlot(slot);
  return {
    slot: slot.Slot,
    operationMode: slot.Mode === "Discharge" ? 2 : 1,
    start: empty ? "00:00" : slot["Start Time"] || "00:00",
    end: empty ? "00:00" : slot["End Time"] || "00:00",
    targetSoc: empty ? 100 : Number(slot["Target SOC"] ?? 100),
    power: empty ? 0 : Number(slot.Power ?? 0),
    repeatMode: empty ? MODE_DAILY : ((slot["Repeat Mode"] ?? 0) as RepeatMode),
    selectedDays: maskToDays(slot["Selected Days"] ?? 0),
    dateStart: ymdToIso(slot["Date Start"] ?? 0),
    dateEnd: ymdToIso(slot["Date End"] ?? 0),
    autoPause: Boolean(slot["Auto Pause"]),
  };
}

export function emptyDraft(slotNumber: number): SlotDraft {
  return {
    slot: slotNumber,
    operationMode: 1,
    start: "00:00",
    end: "00:00",
    targetSoc: 100,
    power: 0,
    repeatMode: MODE_DAILY,
    selectedDays: [],
    dateStart: "",
    dateEnd: "",
    autoPause: false,
  };
}

export function validateDraft(draft: SlotDraft): string | null {
  if (draft.slot < 1 || draft.slot > 12) return "Slot must be 1-12.";
  if (draft.operationMode !== 1 && draft.operationMode !== 2) return "Choose Charge or Discharge.";
  if (!parseTime(draft.start)) return "Start time must be HH:MM.";
  if (!parseTime(draft.end)) return "End time must be HH:MM.";
  if (draft.targetSoc < 0 || draft.targetSoc > 100) return "Target SOC must be 0-100.";
  if (draft.power < 0 || draft.power > MAX_POWER) return `Power must be 0-${MAX_POWER}.`;
  if (![MODE_DAILY, MODE_SELECTED_DAYS, MODE_ONCE, MODE_RANGE].includes(draft.repeatMode)) {
    return "Invalid repeat mode.";
  }
  if (draft.repeatMode === MODE_SELECTED_DAYS) {
    const mask = daysToMask(draft.selectedDays);
    if (mask < 1 || mask > 127) return "Select at least one day.";
  }
  if (draft.repeatMode === MODE_ONCE) {
    if (!isoToYmd(draft.dateStart)) return "Once requires a valid start date.";
  }
  if (draft.repeatMode === MODE_RANGE) {
    const start = isoToYmd(draft.dateStart);
    const end = isoToYmd(draft.dateEnd);
    if (!start || !end) return "Date range requires a start and end date.";
    if (start > end) return "Date range start must be on or before the end date.";
  }
  return null;
}

export function draftToUpsert(draft: SlotDraft): Record<string, unknown> {
  const start = parseTime(draft.start)!;
  const end = parseTime(draft.end)!;
  const mask = daysToMask(draft.selectedDays);
  return {
    Slot_Number: draft.slot,
    Operation_Mode: draft.operationMode,
    Start_Hour: start.hour,
    Start_Minute: start.minute,
    End_Hour: end.hour,
    End_Minute: end.minute,
    Target_SOC_Percent: draft.targetSoc,
    Power_Limit_Watts: draft.power,
    Repeat_Daily: draft.repeatMode !== MODE_ONCE,
    Repeat_Mode: draft.repeatMode,
    Selected_Days: draft.repeatMode === MODE_SELECTED_DAYS ? mask : 0,
    Date_Start: draft.repeatMode === MODE_DAILY || draft.repeatMode === MODE_SELECTED_DAYS ? 0 : isoToYmd(draft.dateStart),
    Date_End: draft.repeatMode === MODE_RANGE ? isoToYmd(draft.dateEnd) : 0,
    Auto_Pause_On_Target: draft.autoPause,
  };
}

export function occupiedSlotNumbers(slots: ScheduleSlot[]): Set<number> {
  return new Set(slots.filter((s) => !isEmptySlot(s)).map((s) => s.Slot));
}

export function firstEmptySlot(slots: ScheduleSlot[]): number | null {
  const occupied = occupiedSlotNumbers(slots);
  for (let i = 1; i <= 12; i++) {
    if (!occupied.has(i)) return i;
  }
  return null;
}

export function slotSelectLabel(slot: number, occupied: Set<number>, firstFree: number | null): string {
  if (occupied.has(slot)) return `${slot} — In use`;
  if (firstFree === slot) return `${slot} — First free`;
  return String(slot);
}

export function normalizeSlots(data: unknown): ScheduleSlot[] {
  if (!Array.isArray(data)) return [];
  return data.map((raw, index) => {
    const slot = raw as Partial<ScheduleSlot>;
    return {
      Slot: Number(slot.Slot ?? index + 1),
      Active: Boolean(slot.Active),
      Mode: String(slot.Mode ?? "Idle"),
      "Start Time": String(slot["Start Time"] ?? "00:00"),
      "End Time": String(slot["End Time"] ?? "00:00"),
      "Target SOC": Number(slot["Target SOC"] ?? 0),
      Power: Number(slot.Power ?? 0),
      Repeat: Boolean(slot.Repeat),
      "Repeat Mode": Number(slot["Repeat Mode"] ?? 0),
      "Selected Days": Number(slot["Selected Days"] ?? 0),
      "Date Start": Number(slot["Date Start"] ?? 0),
      "Date End": Number(slot["Date End"] ?? 0),
      "Auto Pause": Boolean(slot["Auto Pause"]),
      "Paused By Target": Boolean(slot["Paused By Target"]),
    };
  });
}
