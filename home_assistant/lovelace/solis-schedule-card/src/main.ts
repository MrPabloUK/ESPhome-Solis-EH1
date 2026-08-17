import { SolisScheduleCard } from "./card";
import "./editor";

window.customCards = window.customCards || [];
window.customCards.push({
  type: "solis-schedule-card",
  name: "Solis Schedule",
  description: "List and edit Solis inverter schedule slots",
  preview: true,
});

export { SolisScheduleCard };
