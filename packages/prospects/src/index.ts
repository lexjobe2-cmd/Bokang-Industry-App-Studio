import type { ProductSlug } from "@bokang/app-config";

export type WebsiteStatus = "no-first-party-site-found" | "social-only" | "directory-only" | "website-found" | "unclear";
export type ProspectVerificationState = "source-checked" | "needs-recheck" | "verified-website";
export type ProspectConfidence = "high" | "medium" | "low";
export type ProspectOutreachStatus = "new" | "prepared" | "contacted" | "replied" | "converted" | "not-now" | "handled" | "archived" | "previous-outreach";

export type Prospect = {
  id: string;
  company: string;
  name: string;
  industry: string;
  subIndustry: string;
  sector: string;
  location: string;
  city: string;
  country: "Botswana";
  email?: string;
  phone?: string;
  website?: string;
  websiteStatus: WebsiteStatus;
  websiteEvidence: string;
  googleBusinessEvidence: string;
  socialPresence: string[];
  verificationState: ProspectVerificationState;
  sourceUrl: string;
  sourceLinks: string[];
  sourceLabel: string;
  checkedAt: string;
  recommendedProduct: ProductSlug;
  newTemplateOpportunity: string | null;
  proposedDemoPath: string;
  prospectReason: string;
  outreachAngle: string;
  confidence: ProspectConfidence;
  outreachStatus: ProspectOutreachStatus;
  lastChecked: string;
  fitHypothesis: string;
  publicEvidence: string;
};

function googleSearchUrl(name: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(name + " Botswana")}`;
}

type Seed = {
  id: string;
  name: string;
  industry: string;
  subIndustry: string;
  sector: string;
  location: string;
  city: string;
  phone?: string;
  email?: string;
  websiteStatus?: WebsiteStatus;
  verificationState?: ProspectVerificationState;
  sourceUrl: string;
  sourceLabel: string;
  recommendedProduct: ProductSlug;
  newTemplateOpportunity?: string;
  fitHypothesis: string;
  evidence: string;
};

const checkedAt = "2026-10-10";

const seeds: Seed[] = [
  {
    "id": "ever-dry-cleaners",
    "name": "Ever Dry Cleaners & Laundry",
    "industry": "Consumer Services",
    "subIndustry": "Laundry & Dry Cleaning",
    "sector": "Laundry & Dry Cleaning",
    "location": "Botswelelo Ext 5, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 686 5036",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Dry_Cleaning/city%3AGaborone",
    "sourceLabel": "Local Botswana dry-cleaning directory — checked 2026-10-10",
    "recommendedProduct": "move-track",
    "newTemplateOpportunity": "Laundry booking + pickup/delivery template",
    "fitHypothesis": "A mobile-first laundry site could present services, turnaround times and pickup/delivery requests instead of relying on directory discovery.",
    "evidence": "Current Local Botswana dry-cleaning listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "space-age-dry-cleaners",
    "name": "Space Age Dry Cleaners (Pty) Ltd",
    "industry": "Consumer Services",
    "subIndustry": "Laundry & Dry Cleaning",
    "sector": "Laundry & Dry Cleaning",
    "location": "African Mall, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 391 3915",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Dry_Cleaning/city%3AGaborone",
    "sourceLabel": "Local Botswana dry-cleaning directory — checked 2026-10-10",
    "recommendedProduct": "move-track",
    "newTemplateOpportunity": "Laundry booking + pickup/delivery template",
    "fitHypothesis": "A mobile-first laundry site could present services, turnaround times and pickup/delivery requests instead of relying on directory discovery.",
    "evidence": "Current Local Botswana dry-cleaning listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "lm-dry-cleaners",
    "name": "L M Dry Cleaners",
    "industry": "Consumer Services",
    "subIndustry": "Laundry & Dry Cleaning",
    "sector": "Laundry & Dry Cleaning",
    "location": "Broadhurst Industrial, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 390 1188",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Dry_Cleaning/city%3AGaborone",
    "sourceLabel": "Local Botswana dry-cleaning directory — checked 2026-10-10",
    "recommendedProduct": "move-track",
    "newTemplateOpportunity": "Laundry booking + pickup/delivery template",
    "fitHypothesis": "A mobile-first laundry site could present services, turnaround times and pickup/delivery requests instead of relying on directory discovery.",
    "evidence": "Current Local Botswana dry-cleaning listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "modern-dry-cleaners",
    "name": "Modern Dry Cleaners",
    "industry": "Consumer Services",
    "subIndustry": "Laundry & Dry Cleaning",
    "sector": "Laundry & Dry Cleaning",
    "location": "Molepolole Highway, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 390 1579",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Dry_Cleaning/city%3AGaborone",
    "sourceLabel": "Local Botswana dry-cleaning directory — checked 2026-10-10",
    "recommendedProduct": "move-track",
    "newTemplateOpportunity": "Laundry booking + pickup/delivery template",
    "fitHypothesis": "A mobile-first laundry site could present services, turnaround times and pickup/delivery requests instead of relying on directory discovery.",
    "evidence": "Current Local Botswana dry-cleaning listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "perfect-wash",
    "name": "Perfect Wash",
    "industry": "Consumer Services",
    "subIndustry": "Laundry & Dry Cleaning",
    "sector": "Laundry & Dry Cleaning",
    "location": "Tlokweng, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 313 3000",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Dry_Cleaning/city%3AGaborone",
    "sourceLabel": "Local Botswana dry-cleaning directory — checked 2026-10-10",
    "recommendedProduct": "move-track",
    "newTemplateOpportunity": "Laundry booking + pickup/delivery template",
    "fitHypothesis": "A mobile-first laundry site could present services, turnaround times and pickup/delivery requests instead of relying on directory discovery.",
    "evidence": "Current Local Botswana dry-cleaning listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "pearl-drycleaning",
    "name": "The Pearl Drycleaning & Laundry Services",
    "industry": "Consumer Services",
    "subIndustry": "Laundry & Dry Cleaning",
    "sector": "Laundry & Dry Cleaning",
    "location": "Broadhurst, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 397 3295",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Dry_Cleaning/city%3AGaborone",
    "sourceLabel": "Local Botswana dry-cleaning directory — checked 2026-10-10",
    "recommendedProduct": "move-track",
    "newTemplateOpportunity": "Laundry booking + pickup/delivery template",
    "fitHypothesis": "A mobile-first laundry site could present services, turnaround times and pickup/delivery requests instead of relying on directory discovery.",
    "evidence": "Current Local Botswana dry-cleaning listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "boyz-saloon",
    "name": "Boyz Saloon",
    "industry": "Beauty & Personal Care",
    "subIndustry": "Barber & Hair Salon",
    "sector": "Salon & Barber",
    "location": "Grand Palm, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 391 2999",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Hairdressers/city%3AGaborone",
    "sourceLabel": "Local Botswana hairdresser directory — checked 2026-10-10",
    "recommendedProduct": "clinic-flow",
    "newTemplateOpportunity": "Salon/barber booking + services + WhatsApp template",
    "fitHypothesis": "A dedicated salon site could present services, pricing guidance, opening hours and booking/WhatsApp access.",
    "evidence": "Current Local Botswana hairdresser listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "timeless-beauty-salon",
    "name": "Timeless Beauty Salon",
    "industry": "Beauty & Personal Care",
    "subIndustry": "Hair Salon",
    "sector": "Salon & Barber",
    "location": "The Village, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 390 1082",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Hairdressers/city%3AGaborone",
    "sourceLabel": "Local Botswana hairdresser directory — checked 2026-10-10",
    "recommendedProduct": "clinic-flow",
    "newTemplateOpportunity": "Salon/barber booking + services + WhatsApp template",
    "fitHypothesis": "A dedicated salon site could present services, pricing guidance, opening hours and booking/WhatsApp access.",
    "evidence": "Current Local Botswana hairdresser listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "lady-vanessa",
    "name": "Lady Vanessa",
    "industry": "Beauty & Personal Care",
    "subIndustry": "Hair Salon",
    "sector": "Salon & Barber",
    "location": "Station Mall, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 318 0141",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Hairdressers/2/city%3AGaborone",
    "sourceLabel": "Local Botswana hairdresser directory — checked 2026-10-10",
    "recommendedProduct": "clinic-flow",
    "newTemplateOpportunity": "Salon/barber booking + services + WhatsApp template",
    "fitHypothesis": "A dedicated salon site could present services, pricing guidance, opening hours and booking/WhatsApp access.",
    "evidence": "Current Local Botswana hairdresser listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "passionate-styles",
    "name": "Passionate Styles",
    "industry": "Beauty & Personal Care",
    "subIndustry": "Hair Salon",
    "sector": "Salon & Barber",
    "location": "Extension 4, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 395 6067",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Hairdressers/2/city%3AGaborone",
    "sourceLabel": "Local Botswana hairdresser directory — checked 2026-10-10",
    "recommendedProduct": "clinic-flow",
    "newTemplateOpportunity": "Salon/barber booking + services + WhatsApp template",
    "fitHypothesis": "A dedicated salon site could present services, pricing guidance, opening hours and booking/WhatsApp access.",
    "evidence": "Current Local Botswana hairdresser listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "royal-hair-salon",
    "name": "Royal Hair Salon",
    "industry": "Beauty & Personal Care",
    "subIndustry": "Hair Salon",
    "sector": "Salon & Barber",
    "location": "Molapo Crossing, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 392 3900",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Hairdressers/2/city%3AGaborone",
    "sourceLabel": "Local Botswana hairdresser directory — checked 2026-10-10",
    "recommendedProduct": "clinic-flow",
    "newTemplateOpportunity": "Salon/barber booking + services + WhatsApp template",
    "fitHypothesis": "A dedicated salon site could present services, pricing guidance, opening hours and booking/WhatsApp access.",
    "evidence": "Current Local Botswana hairdresser listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "idols-hair-studio",
    "name": "Idols Hair Studio",
    "industry": "Beauty & Personal Care",
    "subIndustry": "Hair Salon",
    "sector": "Salon & Barber",
    "location": "Carbo Centre, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 390 7522",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Hairdressers/2/city%3AGaborone",
    "sourceLabel": "Local Botswana hairdresser directory — checked 2026-10-10",
    "recommendedProduct": "clinic-flow",
    "newTemplateOpportunity": "Salon/barber booking + services + WhatsApp template",
    "fitHypothesis": "A dedicated salon site could present services, pricing guidance, opening hours and booking/WhatsApp access.",
    "evidence": "Current Local Botswana hairdresser listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "solomonic-ventures",
    "name": "Solomonic Ventures",
    "industry": "Business Services",
    "subIndustry": "Cleaning Services",
    "sector": "Cleaning Services",
    "location": "Phase 2, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 74 173 860",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Cleaning/city%3AGaborone",
    "sourceLabel": "Local Botswana cleaning directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Cleaning-services booking + quote template",
    "fitHypothesis": "A service website could package cleaning options, coverage areas and quote requests while keeping job operations private.",
    "evidence": "Current Local Botswana cleaning listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "mmagabo-cleaning-services",
    "name": "MmaGABO Cleaning Services",
    "industry": "Business Services",
    "subIndustry": "Cleaning Services",
    "sector": "Cleaning Services",
    "location": "Phase 1, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 318 7789",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Cleaning/city%3AGaborone",
    "sourceLabel": "Local Botswana cleaning directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Cleaning-services booking + quote template",
    "fitHypothesis": "A service website could package cleaning options, coverage areas and quote requests while keeping job operations private.",
    "evidence": "Current Local Botswana cleaning listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "ranjit-creations",
    "name": "Ranjit Creations (Pty) Ltd",
    "industry": "Business Services",
    "subIndustry": "Cleaning & Hygiene",
    "sector": "Cleaning Services",
    "location": "Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 311 7212",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Cleaning/city%3AGaborone",
    "sourceLabel": "Local Botswana cleaning directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Cleaning-services booking + quote template",
    "fitHypothesis": "A service website could package cleaning options, coverage areas and quote requests while keeping job operations private.",
    "evidence": "Current Local Botswana cleaning listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "leinad-holdings",
    "name": "Leinad Holdings Investment (Pty) Ltd",
    "industry": "Business Services",
    "subIndustry": "Cleaning Services",
    "sector": "Cleaning Services",
    "location": "Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 76 188 600",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Cleaning/city%3AGaborone",
    "sourceLabel": "Local Botswana cleaning directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Cleaning-services booking + quote template",
    "fitHypothesis": "A service website could package cleaning options, coverage areas and quote requests while keeping job operations private.",
    "evidence": "Current Local Botswana cleaning listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "major-league-security",
    "name": "Major League Security",
    "industry": "Security",
    "subIndustry": "Private Security Services",
    "sector": "Security Services",
    "location": "Nosop Crescent, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 73 126 196",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Security_services/2/city%3AGaborone",
    "sourceLabel": "Local Botswana security directory — checked 2026-10-10",
    "recommendedProduct": "move-track",
    "newTemplateOpportunity": "Security-services website + quote/incident operations template",
    "fitHypothesis": "A professional security-services site could present guarding, response and systems services with structured quote enquiries.",
    "evidence": "Current Local Botswana security listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "ae-group",
    "name": "Ae Group (Pty) Ltd",
    "industry": "Food & Events",
    "subIndustry": "Catering",
    "sector": "Catering & Events",
    "location": "Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 76 700 604",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Catering/city%3AGaborone",
    "sourceLabel": "Local Botswana catering directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Catering/event menu + quote/order template",
    "fitHypothesis": "A food and catering website could present menus, event packages and quote/order enquiries with a stronger owned digital front door.",
    "evidence": "Current Local Botswana catering listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "babes-event-planner",
    "name": "Babes Event Planner",
    "industry": "Food & Events",
    "subIndustry": "Catering & Event Planning",
    "sector": "Catering & Events",
    "location": "Gaborone, Botswana",
    "city": "Gaborone",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Catering/city%3AGaborone",
    "sourceLabel": "Local Botswana catering directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Catering/event menu + quote/order template",
    "fitHypothesis": "A food and catering website could present menus, event packages and quote/order enquiries with a stronger owned digital front door.",
    "evidence": "Current Local Botswana catering listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "burgie-bags",
    "name": "Burgie Bags",
    "industry": "Food & Events",
    "subIndustry": "Catering",
    "sector": "Catering & Events",
    "location": "Broadhurst, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 72 383 657",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Catering",
    "sourceLabel": "Local Botswana catering directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Catering/event menu + quote/order template",
    "fitHypothesis": "A food and catering website could present menus, event packages and quote/order enquiries with a stronger owned digital front door.",
    "evidence": "Current Local Botswana catering listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "exigency-grills",
    "name": "Exigency Grills Proprietary Limited",
    "industry": "Food & Events",
    "subIndustry": "Catering & Grills",
    "sector": "Catering & Events",
    "location": "Mmopane, Botswana",
    "city": "Mmopane",
    "phone": "+267 393 1777",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Catering",
    "sourceLabel": "Local Botswana catering directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Catering/event menu + quote/order template",
    "fitHypothesis": "A food and catering website could present menus, event packages and quote/order enquiries with a stronger owned digital front door.",
    "evidence": "Current Local Botswana catering listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "tlk-catering",
    "name": "TLK Botswana Catering Services",
    "industry": "Food & Events",
    "subIndustry": "Catering & Event Management",
    "sector": "Catering & Events",
    "location": "Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 73 414 856",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Catering",
    "sourceLabel": "Local Botswana catering directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Catering/event menu + quote/order template",
    "fitHypothesis": "A food and catering website could present menus, event packages and quote/order enquiries with a stronger owned digital front door.",
    "evidence": "Current Local Botswana catering listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "city-caterers-mnanaka",
    "name": "City Caterers - Mnanaka",
    "industry": "Food & Events",
    "subIndustry": "Catering",
    "sector": "Catering & Events",
    "location": "Mnanaka, Francistown, Botswana",
    "city": "Francistown",
    "phone": "+267 244 0908",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Catering/city%3AFrancistown",
    "sourceLabel": "Local Botswana Francistown catering directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Catering/event menu + quote/order template",
    "fitHypothesis": "A food and catering website could present menus, event packages and quote/order enquiries with a stronger owned digital front door.",
    "evidence": "Current Local Botswana catering listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "rakis-catering-services",
    "name": "Rakis Catering Services",
    "industry": "Food & Events",
    "subIndustry": "Catering",
    "sector": "Catering & Events",
    "location": "Light Industrial, Francistown, Botswana",
    "city": "Francistown",
    "phone": "+267 242 1850",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Catering/city%3AFrancistown",
    "sourceLabel": "Local Botswana Francistown catering directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Catering/event menu + quote/order template",
    "fitHypothesis": "A food and catering website could present menus, event packages and quote/order enquiries with a stronger owned digital front door.",
    "evidence": "Current Local Botswana catering listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "its-a-knockout-butchery",
    "name": "It's A Knockout Butchery",
    "industry": "Food Retail",
    "subIndustry": "Butchery",
    "sector": "Butchery & Fresh Food",
    "location": "Molepolole Road, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 318 2259",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Butchers/city%3AGaborone",
    "sourceLabel": "Local Botswana butchers directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Butchery catalog + order/collection template",
    "fitHypothesis": "A product-led butchery site could show meat categories, specials and collection/order enquiries without forcing full e-commerce on day one.",
    "evidence": "Current Local Botswana butchery listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "princess-holdings",
    "name": "Princess Holdings (Pty) Ltd",
    "industry": "Food Retail",
    "subIndustry": "Butchery",
    "sector": "Butchery & Fresh Food",
    "location": "Dilalelo Ext 4, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 395 2220",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Butchers/city%3AGaborone",
    "sourceLabel": "Local Botswana butchers directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Butchery catalog + order/collection template",
    "fitHypothesis": "A product-led butchery site could show meat categories, specials and collection/order enquiries without forcing full e-commerce on day one.",
    "evidence": "Current Local Botswana butchery listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "quality-meat-score",
    "name": "Quality Meat Score",
    "industry": "Food Retail",
    "subIndustry": "Butchery",
    "sector": "Butchery & Fresh Food",
    "location": "Station Mall, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 390 2781",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Butchers/city%3AGaborone",
    "sourceLabel": "Local Botswana butchers directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Butchery catalog + order/collection template",
    "fitHypothesis": "A product-led butchery site could show meat categories, specials and collection/order enquiries without forcing full e-commerce on day one.",
    "evidence": "Current Local Botswana butchery listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "score-butchery-south-ring",
    "name": "Score Butchery - South Ring",
    "industry": "Food Retail",
    "subIndustry": "Butchery",
    "sector": "Butchery & Fresh Food",
    "location": "South Ring, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 318 4575",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Butchers/city%3AGaborone",
    "sourceLabel": "Local Botswana butchers directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Butchery catalog + order/collection template",
    "fitHypothesis": "A product-led butchery site could show meat categories, specials and collection/order enquiries without forcing full e-commerce on day one.",
    "evidence": "Current Local Botswana butchery listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "boset-meat-pool",
    "name": "Boset Meat Pool (Pty) Ltd",
    "industry": "Food Retail",
    "subIndustry": "Butchery",
    "sector": "Butchery & Fresh Food",
    "location": "BBS Mall, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 397 1352",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Butchers/city%3AGaborone",
    "sourceLabel": "Local Botswana butchers directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Butchery catalog + order/collection template",
    "fitHypothesis": "A product-led butchery site could show meat categories, specials and collection/order enquiries without forcing full e-commerce on day one.",
    "evidence": "Current Local Botswana butchery listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "dam-site-view-butchery",
    "name": "Dam Site View Butchery & Fresh Produce",
    "industry": "Food Retail",
    "subIndustry": "Butchery & Fresh Produce",
    "sector": "Butchery & Fresh Food",
    "location": "Mogoditshane, Botswana",
    "city": "Mogoditshane",
    "phone": "+267 397 2549",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Butchers/city%3AGaborone",
    "sourceLabel": "Local Botswana butchers directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Butchery catalog + order/collection template",
    "fitHypothesis": "A product-led butchery site could show meat categories, specials and collection/order enquiries without forcing full e-commerce on day one.",
    "evidence": "Current Local Botswana butchery listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "doves-funeral-parlour",
    "name": "Doves Funeral Parlour",
    "industry": "Funeral Services",
    "subIndustry": "Funeral Parlour",
    "sector": "Funeral Services",
    "location": "Broadhurst Industrial, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 390 2822",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Funeral_directors/city%3AGaborone",
    "sourceLabel": "Local Botswana funeral-directors directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Funeral services + arrangements/quote template",
    "fitHypothesis": "A respectful funeral-services website could explain arrangements, products and contact options clearly while private case operations remain internal.",
    "evidence": "Current Local Botswana funeral-director listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "fsg-mn-coffin",
    "name": "F S G / M & N Coffin & Casket Manufacturers",
    "industry": "Funeral Services",
    "subIndustry": "Coffins & Caskets",
    "sector": "Funeral Services",
    "location": "Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 390 4446",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Funeral_directors/city%3AGaborone",
    "sourceLabel": "Local Botswana funeral-directors directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Funeral services + arrangements/quote template",
    "fitHypothesis": "A respectful funeral-services website could explain arrangements, products and contact options clearly while private case operations remain internal.",
    "evidence": "Current Local Botswana funeral-director listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "rodwin-undertakers",
    "name": "Rodwin Undertakers & Cremation Services",
    "industry": "Funeral Services",
    "subIndustry": "Undertaking & Cremation",
    "sector": "Funeral Services",
    "location": "Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 397 3302",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Funeral_directors/city%3AGaborone",
    "sourceLabel": "Local Botswana funeral-directors directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Funeral services + arrangements/quote template",
    "fitHypothesis": "A respectful funeral-services website could explain arrangements, products and contact options clearly while private case operations remain internal.",
    "evidence": "Current Local Botswana funeral-director listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "olithas-funeral",
    "name": "Olitha's Funeral (Pty) Ltd",
    "industry": "Funeral Services",
    "subIndustry": "Funeral Services",
    "sector": "Funeral Services",
    "location": "Gaborone, Botswana",
    "city": "Gaborone",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Funeral_directors/city%3AGaborone",
    "sourceLabel": "Local Botswana funeral-directors directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Funeral services + arrangements/quote template",
    "fitHypothesis": "A respectful funeral-services website could explain arrangements, products and contact options clearly while private case operations remain internal.",
    "evidence": "Current Local Botswana funeral-director listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "print-elite",
    "name": "Print Elite (Pty) Ltd",
    "industry": "Printing & Signage",
    "subIndustry": "Commercial Printing",
    "sector": "Printing & Signage",
    "location": "Plot 1248, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 71 733 727",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Print_and_Reprographics/city%3AGaborone",
    "sourceLabel": "Local Botswana print/reprographics directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Printing/signage catalog + quote/artwork-upload template",
    "fitHypothesis": "A visual printing site could show products, turnaround options and quote requests with artwork-upload capability later.",
    "evidence": "Current Local Botswana printing listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "print-source-francistown",
    "name": "Print Source",
    "industry": "Printing & Signage",
    "subIndustry": "Commercial Printing",
    "sector": "Printing & Signage",
    "location": "Grand Lodge, Francistown, Botswana",
    "city": "Francistown",
    "phone": "+267 241 2113",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Printing/3/city%3AFrancistown",
    "sourceLabel": "Local Botswana Francistown printing directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Printing/signage catalog + quote/artwork-upload template",
    "fitHypothesis": "A visual printing site could show products, turnaround options and quote requests with artwork-upload capability later.",
    "evidence": "Current Local Botswana printing listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "dectech-engineers",
    "name": "Thornycraft Holdings P/L t/a DECTECH ENGINEERS",
    "industry": "Automotive",
    "subIndustry": "Vehicle Repair & Engineering",
    "sector": "Auto Repair & Workshop",
    "location": "Broadhurst Industrial, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 73 871 769",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Auto_Repair/city%3AGaborone",
    "sourceLabel": "Local Botswana auto-repair directory — checked 2026-10-10",
    "recommendedProduct": "move-track",
    "newTemplateOpportunity": "Workshop booking + estimate + service-history template",
    "fitHypothesis": "A workshop site could present services, vehicle intake and booking/estimate requests before the internal service workflow.",
    "evidence": "Current Local Botswana auto-repair listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "champs-motors",
    "name": "Champs Motors",
    "industry": "Automotive",
    "subIndustry": "Vehicle Repair & Electrical",
    "sector": "Auto Repair & Workshop",
    "location": "Broadhurst Industrial, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 318 2315",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Auto_Repair/city%3AGaborone",
    "sourceLabel": "Local Botswana auto-repair directory — checked 2026-10-10",
    "recommendedProduct": "move-track",
    "newTemplateOpportunity": "Workshop booking + estimate + service-history template",
    "fitHypothesis": "A workshop site could present services, vehicle intake and booking/estimate requests before the internal service workflow.",
    "evidence": "Current Local Botswana auto-repair listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "uniseal-construction-chemicals",
    "name": "Uniseal Construction Chemicals",
    "industry": "Retail & Trade",
    "subIndustry": "Hardware & Construction Chemicals",
    "sector": "Hardware & Building Supply",
    "location": "Commerce Park, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 311 0957",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Hardware_Stores/city%3AGaborone",
    "sourceLabel": "Local Botswana hardware directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Hardware catalog + quote/stock-enquiry template",
    "fitHypothesis": "A catalog-style hardware site could show product categories, brands and quote/stock enquiries without exposing internal inventory controls.",
    "evidence": "Current Local Botswana hardware listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "maxi-save-hardware",
    "name": "Maxi Save Hardware Corporation",
    "industry": "Retail & Trade",
    "subIndustry": "Hardware",
    "sector": "Hardware & Building Supply",
    "location": "Gaborone West, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 316 3335",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Hardware_Stores/3/city%3AGaborone",
    "sourceLabel": "Local Botswana hardware directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Hardware catalog + quote/stock-enquiry template",
    "fitHypothesis": "A catalog-style hardware site could show product categories, brands and quote/stock enquiries without exposing internal inventory controls.",
    "evidence": "Current Local Botswana hardware listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "gaborone-hardware",
    "name": "Gaborone Hardware",
    "industry": "Retail & Trade",
    "subIndustry": "Hardware",
    "sector": "Hardware & Building Supply",
    "location": "Main Mall, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 395 2611",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Hardware_Stores/4/city%3AGaborone",
    "sourceLabel": "Local Botswana hardware directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Hardware catalog + quote/stock-enquiry template",
    "fitHypothesis": "A catalog-style hardware site could show product categories, brands and quote/stock enquiries without exposing internal inventory controls.",
    "evidence": "Current Local Botswana hardware listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "hardware-glass-centre",
    "name": "Hardware And Glass Centre",
    "industry": "Retail & Trade",
    "subIndustry": "Hardware & Glass",
    "sector": "Hardware & Building Supply",
    "location": "Broadhurst Industrial, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 393 5753",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Hardware_Stores/4/city%3AGaborone",
    "sourceLabel": "Local Botswana hardware directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Hardware catalog + quote/stock-enquiry template",
    "fitHypothesis": "A catalog-style hardware site could show product categories, brands and quote/stock enquiries without exposing internal inventory controls.",
    "evidence": "Current Local Botswana hardware listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "hardware-emporium-bk",
    "name": "Hardware Emporium - B K Wholesalers",
    "industry": "Retail & Trade",
    "subIndustry": "Hardware & Wholesale",
    "sector": "Hardware & Building Supply",
    "location": "Broadhurst, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 391 3299",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Hardware_Stores/4/city%3AGaborone",
    "sourceLabel": "Local Botswana hardware directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Hardware catalog + quote/stock-enquiry template",
    "fitHypothesis": "A catalog-style hardware site could show product categories, brands and quote/stock enquiries without exposing internal inventory controls.",
    "evidence": "Current Local Botswana hardware listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "hall-dr-dental-surgery",
    "name": "Hall Dr Dental Surgery",
    "industry": "Healthcare",
    "subIndustry": "Dental Clinic",
    "sector": "Dental Care",
    "location": "Maruapula Complex, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 318 4262",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Dentists/city%3AGaborone",
    "sourceLabel": "Local Botswana dentists directory — checked 2026-10-10",
    "recommendedProduct": "clinic-flow",
    "fitHypothesis": "ClinicFlow could give the practice a patient-first public website for services, practitioners, contact details and appointment requests.",
    "evidence": "Current Local Botswana dentist listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "mbere-dental-surgery",
    "name": "Mbere Dental Surgery",
    "industry": "Healthcare",
    "subIndustry": "Dental Clinic",
    "sector": "Dental Care",
    "location": "Partial Ext 17, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 393 1425",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Dentists/city%3AGaborone",
    "sourceLabel": "Local Botswana dentists directory — checked 2026-10-10",
    "recommendedProduct": "clinic-flow",
    "fitHypothesis": "ClinicFlow could give the practice a patient-first public website for services, practitioners, contact details and appointment requests.",
    "evidence": "Current Local Botswana dentist listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "pula-dental-clinic",
    "name": "Pula Dental Clinic",
    "industry": "Healthcare",
    "subIndustry": "Dental Clinic",
    "sector": "Dental Care",
    "location": "BBS Mall, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 317 0630",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Dentists/city%3AGaborone",
    "sourceLabel": "Local Botswana dentists directory — checked 2026-10-10",
    "recommendedProduct": "clinic-flow",
    "fitHypothesis": "ClinicFlow could give the practice a patient-first public website for services, practitioners, contact details and appointment requests.",
    "evidence": "Current Local Botswana dentist listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "rehoboth-guest-house",
    "name": "Rehoboth Guest House",
    "industry": "Tourism & Accommodation",
    "subIndustry": "Guest House",
    "sector": "Guest House & Accommodation",
    "location": "Extension 2, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 395 3780",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Guest_houses/city%3AGaborone",
    "sourceLabel": "Local Botswana guest-house directory — checked 2026-10-10",
    "recommendedProduct": "explore-bw",
    "fitHypothesis": "ExploreBW could give the property an owned accommodation website with rooms, location, amenities and booking enquiries.",
    "evidence": "Current Local Botswana guest-house listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "luxury-inn",
    "name": "Luxury Inn",
    "industry": "Tourism & Accommodation",
    "subIndustry": "Guest House",
    "sector": "Guest House & Accommodation",
    "location": "Tlokweng, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 392 8500",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Guest_houses/city%3AGaborone",
    "sourceLabel": "Local Botswana guest-house directory — checked 2026-10-10",
    "recommendedProduct": "explore-bw",
    "fitHypothesis": "ExploreBW could give the property an owned accommodation website with rooms, location, amenities and booking enquiries.",
    "evidence": "Current Local Botswana guest-house listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "primehaven",
    "name": "Primehaven (Pty) Ltd",
    "industry": "Agriculture",
    "subIndustry": "Animal Feed Manufacturing",
    "sector": "Agricultural Supply & Feed",
    "location": "Block 6, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 76 679 922",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/category/Animal_feed",
    "sourceLabel": "Local Botswana animal-feed directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Agricultural supplies catalog + stock/quote/advice template",
    "fitHypothesis": "An agricultural-supplies site could present products, feed/input categories and stock/quote enquiries for farmers.",
    "evidence": "Current Local Botswana animal-feed listing surfaces the business and contact details without a first-party Website label on the checked entry."
  },
  {
    "id": "agrisave-supplies",
    "name": "Agrisave Supplies",
    "industry": "Agriculture",
    "subIndustry": "Agricultural & Veterinary Supplies",
    "sector": "Agricultural Supply & Feed",
    "location": "Gaborone West Industrial, Gaborone, Botswana",
    "city": "Gaborone",
    "phone": "+267 72 276 363",
    "websiteStatus": "directory-only",
    "sourceUrl": "https://www.localbotswana.com/companies/Veterinary",
    "sourceLabel": "Local Botswana veterinary-supplies directory — checked 2026-10-10",
    "recommendedProduct": "build-quote",
    "newTemplateOpportunity": "Agricultural supplies catalog + stock/quote/advice template",
    "fitHypothesis": "An agricultural-supplies site could present products, feed/input categories and stock/quote enquiries for farmers.",
    "evidence": "Current Local Botswana veterinary-supplies listing surfaces the business and contact details without a first-party Website label on the checked entry."
  }
];

export const prospects: Prospect[] = seeds.map((seed) => {
  const websiteStatus = seed.websiteStatus ?? "no-first-party-site-found";
  const newTemplateOpportunity = seed.newTemplateOpportunity ?? null;
  const confidence: ProspectConfidence = websiteStatus === "unclear"
    ? "low"
    : websiteStatus === "website-found"
      ? "high"
      : websiteStatus === "no-first-party-site-found"
        ? "high"
        : "medium";
  const socialPresence = websiteStatus === "social-only"
    ? ["Social page surfaced in current search"]
    : [];

  return {
    id: seed.id,
    company: seed.name,
    name: seed.name,
    industry: seed.industry,
    subIndustry: seed.subIndustry,
    sector: seed.sector,
    location: seed.location,
    city: seed.city,
    country: "Botswana",
    email: seed.email,
    phone: seed.phone,
    websiteStatus,
    websiteEvidence: seed.evidence,
    googleBusinessEvidence: googleSearchUrl(seed.name),
    socialPresence,
    verificationState: seed.verificationState ?? "source-checked",
    sourceUrl: seed.sourceUrl,
    sourceLinks: Array.from(new Set([seed.sourceUrl, googleSearchUrl(seed.name)])),
    sourceLabel: seed.sourceLabel,
    checkedAt,
    recommendedProduct: seed.recommendedProduct,
    newTemplateOpportunity,
    proposedDemoPath: `/demo/${seed.recommendedProduct}`,
    prospectReason: seed.fitHypothesis,
    outreachAngle: newTemplateOpportunity
      ? "Lead with an owned mobile ordering experience, repeat-order convenience and delivery visibility instead of a generic brochure website."
      : `Lead with a working ${seed.recommendedProduct} public demo tailored to ${seed.name}, then connect the public front door to the relevant internal workflow.`,
    confidence,
    outreachStatus: "new",
    lastChecked: checkedAt,
    fitHypothesis: seed.fitHypothesis,
    publicEvidence: seed.evidence,
  };
});

export const prospectCount = prospects.length;
