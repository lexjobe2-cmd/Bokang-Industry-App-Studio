export type ProductSlug =
  | "lex-intake"
  | "ledger-desk"
  | "tax-flow"
  | "clinic-flow"
  | "pharma-desk"
  | "build-quote"
  | "explore-bw"
  | "move-track";

export type ProductConfig = {
  slug: ProductSlug;
  name: string;
  sector: string;
  description: string;
  tabs: readonly [string, string, string, string, string];
  modules: readonly string[];
  dashboardMetrics: readonly string[];
};

export const products: Record<ProductSlug, ProductConfig> = {
  "lex-intake": {
    slug: "lex-intake",
    name: "LexIntake AI",
    sector: "Legal",
    description: "Client intake, consultation booking, matters, documents and law-firm operations.",
    tabs: ["Home", "Clients", "Matters", "Documents", "More"],
    modules: ["Intake", "Consultations", "Clients", "Matters", "Documents", "Tasks", "Billing milestones", "Analytics"],
    dashboardMetrics: ["New enquiries", "Open matters", "Documents awaiting review", "Upcoming consultations"]
  },
  "ledger-desk": {
    slug: "ledger-desk",
    name: "LedgerDesk AI",
    sector: "Accounting",
    description: "Client onboarding, document collection, recurring work and accounting practice operations.",
    tabs: ["Home", "Clients", "Work", "Documents", "More"],
    modules: ["Onboarding", "Clients", "Engagements", "Documents", "Recurring work", "Deadlines", "Analytics"],
    dashboardMetrics: ["Active clients", "Open engagements", "Missing documents", "Deadlines this week"]
  },
  "tax-flow": {
    slug: "tax-flow",
    name: "TaxFlow AI",
    sector: "Tax",
    description: "Tax questionnaires, document collection, review states, submissions and deadline tracking.",
    tabs: ["Home", "Clients", "Returns", "Documents", "More"],
    modules: ["Questionnaires", "Tax returns", "Documents", "Review", "Submission tracker", "Deadlines", "Analytics"],
    dashboardMetrics: ["Returns in progress", "Ready for review", "Missing documents", "Upcoming deadlines"]
  },
  "clinic-flow": {
    slug: "clinic-flow",
    name: "ClinicFlow AI",
    sector: "Healthcare",
    description: "Appointments, practitioners, patient intake, clinic documents, reminders and clinic dashboards.",
    tabs: ["Home", "Patients", "Appointments", "Documents", "More"],
    modules: ["Patients", "Practitioners", "Appointments", "Intake", "Documents", "Reminders", "Clinic analytics"],
    dashboardMetrics: ["Appointments today", "Waiting patients", "Practitioners available", "Follow-ups due"]
  },
  "pharma-desk": {
    slug: "pharma-desk",
    name: "PharmaDesk AI",
    sector: "Pharmacy",
    description: "Pharmacy medicine management, stock control, dispensing workflows, suppliers and medicine analytics.",
    tabs: ["Home", "Medicines", "Dispense", "Orders", "More"],
    modules: [
      "Medicine catalogue",
      "Batch tracking",
      "Stock quantities",
      "Expiry tracking",
      "Low-stock alerts",
      "Reorder levels",
      "Suppliers",
      "Purchase orders",
      "Prescription intake",
      "Dispensing records",
      "Stock adjustments",
      "Medicine analytics"
    ],
    dashboardMetrics: ["Medicines in stock", "Low-stock items", "Expiring batches", "Dispensing today"]
  },
  "build-quote": {
    slug: "build-quote",
    name: "BuildQuote AI",
    sector: "Construction",
    description: "Contractor leads, quotation workflows, projects, milestones, materials and client updates.",
    tabs: ["Home", "Leads", "Quotes", "Projects", "More"],
    modules: ["Leads", "Site visits", "Quotes", "Projects", "Milestones", "Materials", "Photos", "Client updates", "Analytics"],
    dashboardMetrics: ["Open leads", "Quotes awaiting approval", "Active projects", "Milestones due"]
  },
  "explore-bw": {
    slug: "explore-bw",
    name: "ExploreBW AI",
    sector: "Tourism",
    description: "Tourism experiences, itineraries, enquiries, bookings, travellers and operator dashboards.",
    tabs: ["Explore", "Trips", "Bookings", "Saved", "More"],
    modules: ["Experiences", "Packages", "Itineraries", "Enquiries", "Bookings", "Travellers", "Maps", "Operator analytics"],
    dashboardMetrics: ["New enquiries", "Upcoming trips", "Active bookings", "Popular experiences"]
  },
  "move-track": {
    slug: "move-track",
    name: "MoveTrack AI",
    sector: "Logistics",
    description: "Quotes, jobs, fleet, drivers, delivery status, proof of delivery and logistics analytics.",
    tabs: ["Home", "Jobs", "Fleet", "Track", "More"],
    modules: ["Quote requests", "Jobs", "Fleet", "Drivers", "Delivery states", "Proof of delivery", "Maintenance", "Analytics"],
    dashboardMetrics: ["Active jobs", "Vehicles available", "Deliveries today", "Maintenance due"]
  }
};

export const productList = Object.values(products);

export function getProductConfig(slug: string | undefined): ProductConfig {
  if (slug && slug in products) return products[slug as ProductSlug];
  return products["lex-intake"];
}
