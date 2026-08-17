import { describe, expect, it } from "vitest";
import {
  daysToMask,
  draftToUpsert,
  firstEmptySlot,
  occupiedSlotNumbers,
  slotSelectLabel,
  formatPower,
  isOvernight,
  isoToYmd,
  maskToDays,
  parseTime,
  slotStatus,
  slotToDraft,
  validYmd,
  validateDraft,
  weekdayMaskLabel,
  whenLabel,
  ymdToIso,
} from "./format";
import { MODE_DAILY, MODE_ONCE, MODE_RANGE, MODE_SELECTED_DAYS, type ScheduleSlot } from "./types";

const MON_FRI = 0b0011111;

function slot(overrides: Partial<ScheduleSlot> = {}): ScheduleSlot {
  return {
    Slot: 1,
    Active: true,
    Mode: "Charge",
    "Start Time": "00:30",
    "End Time": "04:30",
    "Target SOC": 90,
    Power: 3000,
    Repeat: true,
    "Repeat Mode": MODE_DAILY,
    "Selected Days": 0,
    "Date Start": 0,
    "Date End": 0,
    "Auto Pause": false,
    "Paused By Target": false,
    ...overrides,
  };
}

describe("ymd", () => {
  it("accepts valid dates and rejects impossible ones", () => {
    expect(validYmd(20260816)).toBe(true);
    expect(validYmd(20260229)).toBe(false);
    expect(validYmd(20280229)).toBe(true);
    expect(validYmd(0)).toBe(false);
  });

  it("converts YYYYMMDD to yyyy-mm-dd and back", () => {
    expect(ymdToIso(20260816)).toBe("2026-08-16");
    expect(isoToYmd("2026-08-16")).toBe(20260816);
    expect(isoToYmd("bad")).toBe(0);
    expect(ymdToIso(0)).toBe("");
  });
});

describe("selected days mask", () => {
  it("maps Monday=bit0 through Sunday=bit6", () => {
    expect(daysToMask([0, 1, 2, 3, 4])).toBe(MON_FRI);
    expect(maskToDays(MON_FRI)).toEqual([0, 1, 2, 3, 4]);
    expect(weekdayMaskLabel(MON_FRI)).toBe("MTWTF··");
    expect(weekdayMaskLabel(0b1111111)).toBe("MTWTFSS");
  });
});

describe("time helpers", () => {
  it("parses HH:MM and detects overnight wrap", () => {
    expect(parseTime("22:00")).toEqual({ hour: 22, minute: 0 });
    expect(parseTime("25:00")).toBeNull();
    expect(isOvernight("22:00", "06:00")).toBe(true);
    expect(isOvernight("00:30", "04:30")).toBe(false);
  });

  it("formats unlimited power", () => {
    expect(formatPower(0)).toBe("Unlimited");
    expect(formatPower(3000)).toBe("3000 W");
  });
});

describe("when labels and status", () => {
  it("labels daily, selected days, once, and range", () => {
    expect(whenLabel(slot())).toBe("Daily");
    expect(whenLabel(slot({ "Repeat Mode": MODE_SELECTED_DAYS, "Selected Days": MON_FRI }))).toBe("MTWTF··");
    expect(whenLabel(slot({ "Repeat Mode": MODE_ONCE, "Date Start": 20260816 }))).toBe("2026-08-16");
    expect(
      whenLabel(slot({ "Repeat Mode": MODE_RANGE, "Date Start": 20260810, "Date End": 20260820 })),
    ).toBe("2026-08-10–2026-08-20");
  });

  it("maps active, paused, and auto-paused", () => {
    expect(slotStatus(slot())).toBe("active");
    expect(slotStatus(slot({ Active: false }))).toBe("paused");
    expect(slotStatus(slot({ Active: false, "Paused By Target": true }))).toBe("auto-paused");
    expect(slotStatus(slot({ Mode: "Idle" }))).toBe("empty");
  });
});

describe("draft validation and upsert payload", () => {
  it("requires a day mask for selected days", () => {
    const draft = slotToDraft(slot({ "Repeat Mode": MODE_SELECTED_DAYS, "Selected Days": 0 }));
    expect(validateDraft(draft)).toBe("Select at least one day.");
    draft.selectedDays = [0, 1, 2, 3, 4];
    expect(validateDraft(draft)).toBeNull();
  });

  it("requires dates for once and range", () => {
    const once = slotToDraft(slot({ "Repeat Mode": MODE_ONCE, "Date Start": 0 }));
    expect(validateDraft(once)).toBe("Once requires a valid start date.");
    once.dateStart = "2026-08-16";
    expect(validateDraft(once)).toBeNull();

    const range = slotToDraft(slot({ "Repeat Mode": MODE_RANGE, "Date Start": 20260820, "Date End": 20260810 }));
    expect(validateDraft(range)).toBe("Date range start must be on or before the end date.");
  });

  it("builds the ESPHome upsert payload", () => {
    const payload = draftToUpsert(
      slotToDraft(
        slot({
          Mode: "Discharge",
          "Repeat Mode": MODE_ONCE,
          "Date Start": 20260816,
          Repeat: false,
        }),
      ),
    );
    expect(payload.Slot_Number).toBe(1);
    expect(payload.Operation_Mode).toBe(2);
    expect(payload.Start_Hour).toBe(0);
    expect(payload.Start_Minute).toBe(30);
    expect(payload.Repeat_Mode).toBe(MODE_ONCE);
    expect(payload.Repeat_Daily).toBe(false);
    expect(payload.Date_Start).toBe(20260816);
    expect(payload.Date_End).toBe(0);
  });

  it("finds the first empty slot", () => {
    expect(firstEmptySlot([slot({ Slot: 1 }), slot({ Slot: 3, Mode: "Idle" })])).toBe(2);
    expect(firstEmptySlot(Array.from({ length: 12 }, (_, i) => slot({ Slot: i + 1 })))).toBeNull();
  });

  it("labels the slot dropdown", () => {
    const occupied = occupiedSlotNumbers([slot({ Slot: 2 })]);
    expect(slotSelectLabel(1, occupied, 1)).toBe("1 — First free");
    expect(slotSelectLabel(2, occupied, 1)).toBe("2 — In use");
    expect(slotSelectLabel(3, occupied, 1)).toBe("3");
  });
});
