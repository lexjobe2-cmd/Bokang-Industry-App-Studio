export type SalonMode = "hair" | "barber";
export type SalonAppointment = {
  id: string;
  createdAt: string;
  clientName: string;
  phone: string;
  email: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  notes: string;
  status: "Requested" | "Contacted" | "Confirmed" | "In service" | "Completed" | "Cancelled";
};
export const hairServices = [
  { name: "Braids & protective styles", detail: "Consult on braids, twists and protective styling", duration: "Timing on enquiry" },
  { name: "Wash & blow-dry", detail: "Wash-day care, drying and styling", duration: "Timing on enquiry" },
  { name: "Haircut & styling", detail: "Shape, trim and finish", duration: "Timing on enquiry" },
  { name: "Wig / weave styling", detail: "Installation or finishing by arrangement", duration: "Timing on enquiry" },
  { name: "Natural hair care", detail: "Conditioning, treatment and protective care", duration: "Timing on enquiry" },
];
export const barberServices = [
  { name: "Classic haircut", detail: "A tidy, sharp and personalised cut", duration: "Timing on enquiry" },
  { name: "Fade & taper", detail: "Detail-focused fade or taper styling", duration: "Timing on enquiry" },
  { name: "Line-up & shape-up", detail: "Defined edges and clean finish", duration: "Timing on enquiry" },
  { name: "Beard grooming", detail: "Beard shaping and finishing", duration: "Timing on enquiry" },
  { name: "Kids haircut", detail: "Haircuts for younger clients", duration: "Timing on enquiry" },
];
// Use barber-specific words in the actual business name, not an inferred
// service offering, before giving a prospect the barbershop concept.
export function salonModeFromName(name: string): SalonMode {
  return /barber|barbing|fade|gentlem[ae]n|boyz|boys|men.s groom/i.test(name) ? "barber" : "hair";
}
export function salonBookingKey(client: string) {
  return "bokang-studio.salon-book.requests.v1:" + (client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "your-business");
}
export function salonTeamKey(client: string) {
  return "bokang-studio.salon-book.team.v1:" + (client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "your-business");
}
