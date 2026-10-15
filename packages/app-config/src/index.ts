export type ProductSlug =
  | "lex-intake"
  | "ledger-desk"
  | "tax-flow"
  | "clinic-flow"
  | "pharma-desk"
  | "build-quote"
  | "explore-bw"
  | "move-track"
  | "fresh-fold"
  | "nail-muse"
  | "salon-book"
  | "aqua-flow"
  | "clean-care"
  | "bake-box"
  | "botswana-cultural-explorer";

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
  "botswana-cultural-explorer": {
    slug: "botswana-cultural-explorer",
    name: "Botswana Cultural Explorer",
    sector: "Cultural Marketplace",
    description: "A Botswana-first marketplace for cultural crafts, traditional clothing, jewellery, artefacts, books, art, venues and cultural experiences. Customer enquiries use WhatsApp or phone; no card checkout.",
    tabs: ["Discover", "Storefronts", "Inventory", "Bookings", "More"],
    modules: ["Public cultural marketplace", "Storefront onboarding", "Maker and venue profiles", "Keyless map preview", "Inventory management", "Product photo uploads", "Venue enquiries", "Offline payment preferences", "WhatsApp item enquiries", "Local demo backup"],
    dashboardMetrics: ["My storefronts", "Published inventory", "Venue enquiries", "Items in stock"],
    experience: {
      mood: "Rooted in Botswana heritage",
      accent: "#264b3d",
      surface: "#f6f2e7",
      hero: "Bring Botswana's culture, makers and places closer to the world.",
      onboarding: ["Storefront identity", "Cultural business type", "Public location and privacy", "Contact and WhatsApp", "Offline payment preferences", "Products or venue details"],
      signatureFeatures: ["Seller storefront and location", "Craft inventory", "Venue booking enquiries", "Grouped WhatsApp order messages", "Offline payment arrangements"],
      compliance: ["Consent-based precise location", "Owner data separation when auth connects", "Accurate product provenance", "No automatic booking confirmation", "No online payment processing"]
    }
  },
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
  "fresh-fold": {
    slug: "fresh-fold",
    name: "FreshFold AI",
    sector: "Dry Cleaning & Laundry",
    description: "Laundry bookings, garment intake, pickup and delivery, commercial accounts, order tracking and repeat-customer operations.",
    tabs: ["Home", "Orders", "Pickups", "Customers", "More"],
    modules: ["Bookings", "Garment intake", "Order care board", "Pickup scheduling", "Delivery scheduling", "Commercial accounts", "Recurring laundry", "Quality check", "Customer history", "Analytics"],
    dashboardMetrics: ["Active orders", "Pickups today", "Ready for collection", "Commercial accounts"],
    experience: {
      mood: "Fresh and service-led",
      accent: "#0f766e",
      surface: "#f0fdfa",
      hero: "From dirty laundry to ready-to-wear with a clear customer and operations flow.",
      onboarding: ["Business profile", "Laundry services", "Turnaround times", "Pickup areas", "Commercial service rules"],
      signatureFeatures: ["Public booking site", "Pickup and delivery workflow", "Garment care board", "Commercial laundry accounts", "Repeat-customer history"],
      compliance: ["Order handover record", "Garment condition notes", "Pickup/delivery evidence", "Quality-check record"]
    }
  },
  "nail-muse": {
    slug: "nail-muse",
    name: "NailMuse AI",
    sector: "Nail Tech & Beauty",
    description: "Public nail portfolio, service menu, appointment requests, availability, client history and repeat-booking operations.",
    tabs: ["Home", "Appointments", "Clients", "Services", "More"],
    modules: ["Public portfolio", "Service menu", "Appointment requests", "Availability", "Client profiles", "Design notes", "Repeat bookings", "Price menu", "Promotions", "Analytics"],
    dashboardMetrics: ["Appointments today", "Pending confirmations", "Returning clients", "Popular service"],
    experience: {
      mood: "Visual, polished and booking-first",
      accent: "#be185d",
      surface: "#fff1f7",
      hero: "Turn social attention into owned bookings, repeat clients and a polished nail portfolio.",
      onboarding: ["Business profile", "Nail services", "Pricing", "Opening hours", "Booking policies"],
      signatureFeatures: ["Visual nail portfolio", "Service and price menu", "Appointment booking", "Availability control", "Repeat-client notes"],
      compliance: ["Booking consent", "Service notes", "Appointment history", "Client communication record"]
    }
  },
  "salon-book": {
    slug: "salon-book",
    name: "SalonBook AI",
    sector: "Hair Salon & Barber",
    description: "Customer-facing hair and barber websites, appointment enquiries, stylist rosters and client follow-up.",
    tabs: ["Home", "Appointments", "Team", "Clients", "More"],
    modules: ["Public hair and barber websites", "Salon service menus", "Barber service menus", "Appointment enquiries", "Booking status", "Stylists", "Client history", "Scheduling", "Promotions"],
    dashboardMetrics: ["Appointment enquiries", "Awaiting confirmation", "Upcoming requests", "Returning clients"],
    experience: {
      mood: "Editorial, warm and style-first",
      accent: "#9e335f",
      surface: "#fff1f5",
      hero: "Turn interest in hair and grooming into an easy appointment journey.",
      onboarding: ["Business profile", "Hair or barber variant", "Service menu", "Stylists", "Opening hours and booking policies"],
      signatureFeatures: ["Hair and barber variant websites", "Appointment requests", "Stylist preferences", "Booking review", "Client follow-ups"],
      compliance: ["Appointment request consent", "Service notes", "Booking policies", "Client history"]
    }
  },
  "aqua-flow": {
    slug: "aqua-flow",
    name: "AquaFlow AI",
    sector: "Purified Water & Delivery",
    description: "Public water catalogue, delivery requests, refill and exchange, recurring supply, branded water, customers and fulfilment operations.",
    tabs: ["Home", "Orders", "Deliveries", "Customers", "More"],
    modules: ["Public water website", "Bottle-size catalogue", "Order requests", "20L refill/exchange", "Recurring delivery", "Corporate supply", "Custom-branded water", "Container tracking", "Delivery planning", "Customer history", "Analytics"],
    dashboardMetrics: ["Open orders", "Deliveries today", "Refill exchanges", "Recurring customers"],
    experience: {
      mood: "Clean, product-led and delivery-first",
      accent: "#0284c7",
      surface: "#f0f9ff",
      hero: "Turn bottled water, refills and delivery into a clear customer experience and organised fulfilment flow.",
      onboarding: ["Business profile", "Water products", "Bottle sizes", "Delivery areas", "Refill and exchange rules"],
      signatureFeatures: ["Bottle-size storefront", "20L refill/exchange", "Recurring home and office delivery", "Custom-labelled water", "Container tracking"],
      compliance: ["Purification-process record", "Quality evidence register", "Batch/production note", "Delivery handover record"]
    }
  },
  "clean-care": {
    slug: "clean-care",
    name: "CleanCare AI",
    sector: "Cleaning Services",
    description: "Public cleaning-services website, quote requests, recurring schedules, job allocation, site notes and quality-check operations.",
    tabs: ["Home", "Jobs", "Schedule", "Customers", "More"],
    modules: ["Public cleaning website", "Quote requests", "Residential cleaning", "Commercial cleaning", "Deep cleaning", "Post-construction cleanup", "Recurring schedules", "Team assignment", "Site notes", "Quality checks", "Customer history", "Analytics"],
    dashboardMetrics: ["Active jobs", "Quotes awaiting response", "Teams assigned", "Quality checks"],
    experience: {
      mood: "Fresh, reliable and service-led",
      accent: "#0f766e",
      surface: "#ecfdf5",
      hero: "Turn cleaning enquiries into scheduled, trackable service work.",
      onboarding: ["Business profile", "Cleaning services", "Service areas", "Schedules", "Quote rules"],
      signatureFeatures: ["Cleaning service catalogue", "Site assessment request", "Recurring schedule", "Team allocation", "Quality-check closeout"],
      compliance: ["Site instructions", "Service checklist", "Completion evidence", "Customer confirmation"]
    }
  },
  "bake-box": {
    slug: "bake-box",
    name: "BakeBox AI",
    sector: "Bakery & Baked Goods",
    description: "Public bakery website, product and box menu, pre-orders, pickup/delivery requests, production queue, customers and repeat-order operations.",
    tabs: ["Home", "Orders", "Bake Queue", "Customers", "More"],
    modules: ["Public bakery website", "Bake menu", "Box sizes", "Pre-orders", "Pickup requests", "Delivery requests", "Flavour drops", "Production queue", "Customer history", "Corporate orders", "Analytics"],
    dashboardMetrics: ["Open orders", "Baking now", "Ready for pickup", "Deliveries"],
    experience: {
      mood: "Warm, visual and order-first",
      accent: "#b45309",
      surface: "#fff7ed",
      hero: "Turn social-media cravings into clear pre-orders, pickup windows and repeat bakery customers.",
      onboarding: ["Business profile", "Bake menu", "Box sizes and prices", "Lead times", "Pickup and delivery rules"],
      signatureFeatures: ["Visual bake menu", "Pre-order flow", "Box-size ordering", "WhatsApp ordering", "Production queue", "Pickup and delivery"],
      compliance: ["Order confirmation", "Customer allergy note", "Pickup/delivery record", "Completion history"]
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
