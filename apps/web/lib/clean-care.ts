export type CleanCareQuote = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  facilityType: string;
  rooms: string;
  area: string;
  frequency: string;
  preferredDate: string;
  instructions: string;
  photoNames: string[];
  status: "New enquiry" | "Quoted" | "Accepted" | "Scheduled" | "Team assigned" | "In progress" | "Quality check" | "Completed";
};

// Same-browser preview only; no cross-device syncing or backend.
export function cleanCareQuoteKey(client: string) {
  const slug = client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "your-business";
  return "bokang-studio.clean-care.quotes.v1:" + slug;
}

// Isolate operator demo records between different prospect companies.
// Preserve the legacy default key so pre-existing owner demo jobs remain visible.
export function cleanCareWorkspaceKey(client: string, collection: "jobs" | "teams" | "supplies") {
  const base = "bokang-studio.clean-care." + collection + ".v1";
  const label = client.trim().toLowerCase();
  if (!label || label === "your business") return base;
  const clientSlug = label.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return base + ":" + (clientSlug || "your-business");
}
