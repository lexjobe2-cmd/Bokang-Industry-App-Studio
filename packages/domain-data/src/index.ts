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
