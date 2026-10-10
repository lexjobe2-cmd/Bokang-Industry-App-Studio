export const botswanaPlaces = [
  "Gaborone",
  "Francistown",
  "Maun",
  "Kasane",
  "Palapye",
  "Lobatse",
  "Mahalapye",
  "Molepolole",
  "Jwaneng",
  "Kanye",
  "Tlokweng",
  "Ramotswa",
  "Mogoditshane",
  "Mochudi",
  "Serowe",
  "Selebi-Phikwe",
  "Ghanzi",
  "Letlhakane",
  "Tsabong"
] as const;

export const commonPriority = ["Low", "Normal", "High", "Urgent"] as const;
export const commonRecordStatus = ["Draft", "Active", "Pending", "Completed", "Archived"] as const;

export const pharmacyMedicineForms = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Suspension",
  "Cream",
  "Ointment",
  "Gel",
  "Drops",
  "Injection",
  "Inhaler",
  "Suppository",
  "Powder",
  "Solution",
  "Other"
] as const;

export const pharmacyStockStates = [
  "In stock",
  "Low stock",
  "Out of stock",
  "Near expiry",
  "Expired",
  "Quarantined",
  "Recalled"
] as const;

export const pharmacyPurchaseStatuses = [
  "Draft",
  "Requested",
  "Approved",
  "Ordered",
  "Partially received",
  "Received",
  "Cancelled"
] as const;

export const pharmacyDispenseStatuses = [
  "Pending prescription review",
  "Approved",
  "Prepared",
  "Dispensed",
  "Collected",
  "Cancelled"
] as const;

export const paymentMethods = [
  "Cash",
  "Card",
  "Bank transfer",
  "Mobile money",
  "Insurance",
  "Account"
] as const;


export const legalMatterTypes = [
  "Corporate & Commercial",
  "Civil Litigation",
  "Criminal Defence",
  "Employment & Labour",
  "Family Law",
  "Property & Conveyancing",
  "Debt Recovery",
  "Estate & Succession",
  "Regulatory & Compliance",
  "Immigration",
  "Other"
] as const;

export const legalConsultationModes = [
  "In person",
  "Phone",
  "Video call",
  "Email review"
] as const;

export const legalMatterStages = [
  "New intake",
  "Conflict check",
  "Consultation booked",
  "Engagement pending",
  "Active matter",
  "Awaiting client",
  "Awaiting third party",
  "Ready to close",
  "Closed"
] as const;

export const legalDocumentTypes = [
  "Identification",
  "Engagement letter",
  "Client instruction",
  "Contract",
  "Court filing",
  "Correspondence",
  "Evidence",
  "Invoice",
  "Other"
] as const;


export const accountingEngagementTypes = [
  "Monthly bookkeeping",
  "Management accounts",
  "Payroll",
  "Annual financial statements",
  "Audit support",
  "Company secretarial",
  "Advisory",
  "Other"
] as const;

export const accountingDocumentTypes = [
  "Bank statement",
  "Invoice",
  "Receipt",
  "Payroll schedule",
  "Tax document",
  "Financial statement",
  "Company registration",
  "Other"
] as const;

export const taxReturnTypes = [
  "Individual income tax",
  "Company income tax",
  "VAT",
  "PAYE",
  "Withholding tax",
  "Capital gains",
  "Other"
] as const;

export const taxWorkflowStages = [
  "Questionnaire sent",
  "Awaiting documents",
  "Preparation",
  "Review",
  "Ready to submit",
  "Submitted",
  "Completed"
] as const;

export const clinicAppointmentTypes = [
  "General consultation",
  "Follow-up",
  "Chronic care",
  "Vaccination",
  "Minor procedure",
  "Medical certificate",
  "Screening",
  "Other"
] as const;

export const clinicAppointmentStates = [
  "Requested",
  "Confirmed",
  "Checked in",
  "With practitioner",
  "Completed",
  "No show",
  "Cancelled"
] as const;

export const constructionTradeTypes = [
  "General building",
  "Electrical",
  "Plumbing",
  "Carpentry",
  "Roofing",
  "Painting",
  "Tiling",
  "Welding",
  "Civil works",
  "Renovation"
] as const;

export const quoteStages = [
  "New lead",
  "Site visit required",
  "Estimating",
  "Quote sent",
  "Negotiation",
  "Approved",
  "Declined"
] as const;

export const tourismExperienceTypes = [
  "Safari",
  "Cultural experience",
  "City tour",
  "Accommodation",
  "Transfers",
  "Camping",
  "Adventure",
  "Birding",
  "Photography",
  "Custom itinerary"
] as const;

export const logisticsJobTypes = [
  "Local delivery",
  "Long-haul delivery",
  "Courier",
  "Furniture move",
  "Office relocation",
  "Freight",
  "Warehouse transfer",
  "Custom job"
] as const;

export const logisticsJobStates = [
  "Quote requested",
  "Scheduled",
  "Driver assigned",
  "Collected",
  "In transit",
  "Delivered",
  "Proof of delivery received",
  "Closed"
] as const;


export const miningVehicleTypes = [
  "Light vehicle / SUV",
  "Pickup / LDV",
  "Minibus",
  "Service truck",
  "Water bowser",
  "Fuel bowser",
  "Maintenance vehicle",
  "Other"
] as const;

export const fleetVehicleStates = [
  "Available",
  "On job",
  "Inspection due",
  "Maintenance",
  "No-go",
  "Out of service"
] as const;

export const miningPrestartChecks = [
  "Driver authorised for site",
  "Roadworthiness valid",
  "Seat belts functional for all occupants",
  "Brakes and handbrake functional",
  "Headlights, brake lights and indicators functional",
  "Reverse alarm functional",
  "Horn functional",
  "Mirrors and windscreen serviceable",
  "Tyres and wheel nuts serviceable",
  "Fire extinguisher present, accessible and in service",
  "First aid kit present and stocked",
  "Emergency triangles / beacons present",
  "Reflective strips / vehicle identification visible",
  "Daily vehicle logbook completed",
  "No critical fluid leaks",
  "Two-way radio / site communication available",
  "Beacon / strobe functional where site requires",
  "Whip flag fitted where site requires",
  "Cargo secured",
  "Cabin clear and safe"
] as const;

export const miningCriticalChecks = [
  "Driver authorised for site",
  "Roadworthiness valid",
  "Seat belts functional for all occupants",
  "Brakes and handbrake functional",
  "Headlights, brake lights and indicators functional",
  "Reverse alarm functional",
  "Fire extinguisher present, accessible and in service"
] as const;
