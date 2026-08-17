import { SolisScheduleCard } from "./card";
import { SolisScheduleCardEditor } from "./editor";

function defineOnce(name: string, ctor: CustomElementConstructor) {
  if (!customElements.get(name)) {
    customElements.define(name, ctor);
  }
}

defineOnce("solis-schedule-card", SolisScheduleCard);
defineOnce("solis-schedule-card-editor", SolisScheduleCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "solis-schedule-card")) {
  window.customCards.push({
    type: "solis-schedule-card",
    name: "Solis Schedule",
    description: "List and edit Solis inverter schedule slots",
    preview: true,
  });
}

export { SolisScheduleCard };
