export type ProductSlug =
  | "lex-intake"
  | "ledger-desk"
  | "tax-flow"
  | "clinic-flow"
  | "pharma-desk"
  | "build-quote"
  | "explore-bw"
  | "move-track";

export type ProductExperienceProfile = {
  mood: string;
  accent: string;
  surface: string;
  hero: string;
  onboarding: readonly string[];
  signatureFeatures: readonly string[];
  compliance: readonly string[];
};

export type ProductConfig = {
  slug: ProductSlug;
  name: string;
  sector: string;
  description: string;
  tabs: readonly [string, string, string, string, string];
  modules: readonly string[];
  dashboardMetrics: readonly string[];
  experience: ProductExperienceProfile;
};

export const products: Record<ProductSlug, ProductConfig> = {
  "lex-intake": {
    slug: "lex-intake",
    name: "LexIntake AI",
    sector: "Legal",
    description: "Client intake, consultation booking, matters, documents and law-firm operations.",
    tabs: ["Home", "Clients", "Matters", "Documents", "More"],
    modules: ["Intake", "Consultations", "Clients", "Matters", "Documents", "Tasks", "Billing milestones", "Analytics"],
    dashboardMetrics: ["New enquiries", "Open matters", "Documents awaiting review", "Upcoming consultations"],
    experience: {
      mood: "Quiet authority",
      accent: "#7c3aed",
      surface: "#faf7ff",
      hero: "Confidential client intake and matter clarity.",
      onboarding: ["Firm profile", "Practice areas", "Conflict-check preferences", "Client intake rules", "Document categories"],
      signatureFeatures: ["Conflict-check queue", "KYC/identity review", "Matter timeline", "Engagement-letter checklist", "Secure document index"],
      compliance: ["Client identity review", "Consent and instruction record", "Conflict-check evidence", "Audit trail"]
    }
  },
  "ledger-desk": {
    slug: "ledger-desk",
    name: "LedgerDesk AI",
    sector: "Accounting",
    description: "Client onboarding, document collection, recurring work and accounting practice operations.",
    tabs: ["Home", "Clients", "Work", "Documents", "More"],
    modules: ["Onboarding", "Clients", "Engagements", "Documents", "Recurring work", "Deadlines", "Analytics"],
    dashboardMetrics: ["Active clients", "Open engagements", "Missing documents", "Deadlines this week"],
    experience: {
      mood: "Precision and calm",
      accent: "#0f766e",
      surface: "#f0fdfa",
      hero: "A clean operating desk for recurring finance work.",
      onboarding: ["Practice profile", "Service catalogue", "Client types", "Recurring work templates", "Document request packs"],
      signatureFeatures: ["Month-end cockpit", "Document chase board", "Recurring work calendar", "Client completeness score", "Large ledger views"],
      compliance: ["Client due diligence", "Engagement approval", "Document retention checklist", "Reviewer audit trail"]
    }
  },
  "tax-flow": {
    slug: "tax-flow",
    name: "TaxFlow AI",
    sector: "Tax",
    description: "Tax questionnaires, document collection, review states, submissions and deadline tracking.",
    tabs: ["Home", "Clients", "Returns", "Documents", "More"],
    modules: ["Questionnaires", "Tax returns", "Documents", "Review", "Submission tracker", "Deadlines", "Analytics"],
    dashboardMetrics: ["Returns in progress", "Ready for review", "Missing documents", "Upcoming deadlines"],
    experience: {
      mood: "Deadline confidence",
      accent: "#b45309",
      surface: "#fffbeb",
      hero: "Turn tax obligations into visible, trackable flows.",
      onboarding: ["Tax practice profile", "Return types", "Tax periods", "Deadline rules", "Document packs"],
      signatureFeatures: ["Deadline heatmap", "Questionnaire builder", "Readiness score", "Reviewer queue", "Submission evidence"],
      compliance: ["Taxpayer identity review", "Authority/mandate checklist", "Return sign-off", "Submission audit record"]
    }
  },
  "clinic-flow": {
    slug: "clinic-flow",
    name: "ClinicFlow AI",
    sector: "Healthcare",
    description: "Appointments, practitioners, patient intake, clinic documents, reminders and clinic dashboards.",
    tabs: ["Home", "Patients", "Appointments", "Documents", "More"],
    modules: ["Patients", "Practitioners", "Appointments", "Intake", "Documents", "Reminders", "Clinic analytics"],
    dashboardMetrics: ["Appointments today", "Waiting patients", "Practitioners available", "Follow-ups due"],
    experience: {
      mood: "Human and reassuring",
      accent: "#0284c7",
      surface: "#f0f9ff",
      hero: "A patient-first clinic flow from booking to follow-up.",
      onboarding: ["Clinic profile", "Practitioners", "Services", "Opening hours", "Appointment rules"],
      signatureFeatures: ["Touch-friendly schedule", "Patient intake", "Waiting-room status", "Follow-up reminders", "Clinical document index"],
      compliance: ["Patient consent", "Identity confirmation", "Privacy acknowledgement", "Access audit"]
    }
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
    dashboardMetrics: ["Medicines in stock", "Low-stock items", "Expiring batches", "Dispensing today"],
    experience: {
      mood: "Operational clarity",
      accent: "#059669",
      surface: "#ecfdf5",
      hero: "Fast medicine operations with traceable stock.",
      onboarding: ["Pharmacy profile", "Branches", "Medicine catalogue", "Suppliers", "Stock and expiry rules"],
      signatureFeatures: ["Barcode/QR scanning", "Virtualized inventory", "Batch and expiry control", "Reorder signals", "Dispensing queue"],
      compliance: ["Prescription review", "Batch traceability", "Recall/quarantine workflow", "Dispensing audit"]
    }
  },
  "build-quote": {
    slug: "build-quote",
    name: "BuildQuote AI",
    sector: "Construction",
    description: "Contractor leads, quotation workflows, projects, milestones, materials and client updates.",
    tabs: ["Home", "Leads", "Quotes", "Projects", "More"],
    modules: ["Leads", "Site visits", "Quotes", "Projects", "Milestones", "Materials", "Photos", "Client updates", "Analytics"],
    dashboardMetrics: ["Open leads", "Quotes awaiting approval", "Active projects", "Milestones due"],
    experience: {
      mood: "Industrial and decisive",
      accent: "#ea580c",
      surface: "#fff7ed",
      hero: "Move from site lead to approved quote and visible project.",
      onboarding: ["Contractor profile", "Trades", "Rate cards", "Service areas", "Quote templates"],
      signatureFeatures: ["Site-photo intake", "Quote builder", "Material lists", "Milestone board", "Approval signatures"],
      compliance: ["Client approval", "Site safety checklist", "Variation approval", "Completion evidence"]
    }
  },
  "explore-bw": {
    slug: "explore-bw",
    name: "ExploreBW AI",
    sector: "Tourism",
    description: "Tourism experiences, itineraries, enquiries, bookings, travellers and operator dashboards.",
    tabs: ["Explore", "Trips", "Bookings", "Saved", "More"],
    modules: ["Experiences", "Packages", "Itineraries", "Enquiries", "Bookings", "Travellers", "Maps", "Operator analytics"],
    dashboardMetrics: ["New enquiries", "Upcoming trips", "Active bookings", "Popular experiences"],
    experience: {
      mood: "Editorial and adventurous",
      accent: "#0f766e",
      surface: "#f0fdfa",
      hero: "Discover, compose and sell Botswana experiences beautifully.",
      onboarding: ["Operator profile", "Destinations", "Experiences", "Capacity rules", "Booking policies"],
      signatureFeatures: ["Visual itinerary builder", "Map-first discovery", "Traveller profiles", "Saved experiences", "Booking enquiry board"],
      compliance: ["Traveller consent", "Terms acknowledgement", "Emergency-contact capture", "Supplier confirmation"]
    }
  },
  "move-track": {
    slug: "move-track",
    name: "MoveTrack AI",
    sector: "Logistics",
    description: "Quotes, jobs, fleet, drivers, delivery status, proof of delivery and logistics analytics.",
    tabs: ["Home", "Jobs", "Fleet", "Track", "More"],
    modules: ["Quote requests", "Jobs", "Fleet onboarding", "Driver onboarding", "Driver assignments", "Driver mobile app", "Pre-start compliance", "Automatic grounding", "Corrective release", "Proof of delivery", "Maintenance", "Incidents", "Analytics"],
    dashboardMetrics: ["Active jobs", "Vehicles available", "Deliveries today", "Maintenance due"],
    experience: {
      mood: "Live operations",
      accent: "#1d4ed8",
      surface: "#eff6ff",
      hero: "A control tower for quotes, vehicles and deliveries.",
      onboarding: ["Operator profile", "Operating sites", "Fleet onboarding", "Driver onboarding", "Site authorisations", "Pre-start policy", "Dispatch rules"],
      signatureFeatures: ["Fleet onboarding", "Driver mobile app", "GO / NO-GO pre-starts", "Automatic vehicle grounding", "Dispatch board", "QR proof-of-delivery", "Maintenance alerts"],
      compliance: ["Driver/site authorisation", "Vehicle roadworthiness record", "Fire-extinguisher service record", "Mandatory pre-start checklist", "POD audit", "Incident/corrective-action record"]
    }
  }
};

export const productList = Object.values(products);

export function getProductConfig(slug: string | undefined): ProductConfig {
  if (slug && slug in products) return products[slug as ProductSlug];
  return products["lex-intake"];
}
