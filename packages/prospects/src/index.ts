import type { ProductSlug } from "@bokang/app-config";

export type Prospect = {
  id: string;
  name: string;
  sector: string;
  location: string;
  email: string;
  phone?: string;
  website?: string;
  sourceUrl: string;
  sourceLabel: string;
  checkedAt: string;
  recommendedProduct: ProductSlug;
  fitHypothesis: string;
  publicEvidence: string;
};

export const prospects: Prospect[] = [
  {
    id: "ndadi-law-firm",
    name: "Ndadi Law Firm",
    sector: "Legal",
    location: "Gaborone",
    email: "info@ndadilawfirm.com",
    phone: "+267 390 7492",
    website: "https://ndadilawfirm.com/",
    sourceUrl: "https://ndadilawfirm.com/",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "lex-intake",
    fitHypothesis: "A client-intake and matter-workflow demo could complement a multi-service law practice by showing structured enquiries, consultation booking, documents and matter status.",
    publicEvidence: "The firm publicly lists services including conveyancing, debt recovery, labour law, corporate governance, litigation, negotiations and agreements."
  },
  {
    id: "at-muza-attorneys",
    name: "AT Muza Attorneys",
    sector: "Legal",
    location: "Gaborone",
    email: "alec@atmuza.com",
    phone: "+267 74136542",
    website: "https://www.atmuza.com/",
    sourceUrl: "https://www.cipa.co.bw/wp-content/uploads/2025/03/Volume-24-Issue-11-28-February-2025.pdf",
    sourceLabel: "CIPA public publication",
    checkedAt: "2026-10-02",
    recommendedProduct: "lex-intake",
    fitHypothesis: "LexIntake is a relevant proposal because a legal practice can demonstrate enquiry capture, consultation scheduling and matter/document tracking without changing the firm's existing systems.",
    publicEvidence: "CIPA's public publication lists AT Muza Attorneys in Gaborone with business contact details and website."
  },
  {
    id: "addmath",
    name: "Addmath",
    sector: "Accounting",
    location: "Gaborone",
    email: "info@addmath.net",
    phone: "+267 391 3848",
    website: "https://www.addmath.net/",
    sourceUrl: "https://www.addmath.net/",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "ledger-desk",
    fitHypothesis: "LedgerDesk can showcase structured client onboarding, document collection, recurring accounting work and engagement dashboards for an SME-focused accounting/advisory practice.",
    publicEvidence: "Addmath publicly describes accounting, taxation, corporate finance, governance, HR and advisory services for SMEs."
  },
  {
    id: "greengrowth-partners",
    name: "GreenGrowth Partners",
    sector: "Accounting",
    location: "Gaborone",
    email: "info@greengrowth.co.bw",
    phone: "+267 312 1296",
    website: "https://greengrowth.co.bw/",
    sourceUrl: "https://greengrowth.co.bw/",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "ledger-desk",
    fitHypothesis: "LedgerDesk could demonstrate a lightweight client and engagement workspace for accounting, audit, finance, taxation and secretarial services.",
    publicEvidence: "The firm publicly describes itself as a Gaborone accountancy practice providing auditing, accounting, finance, taxation and secretarial services."
  },
  {
    id: "alliant-cpa",
    name: "Alliant CPA",
    sector: "Tax & Accounting",
    location: "Gaborone",
    email: "evansm@alliantcpa.co.bw",
    phone: "+267 390 3555",
    website: "https://alliantcpa.co.bw/",
    sourceUrl: "https://alliantcpa.co.bw/taxation-services/",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "tax-flow",
    fitHypothesis: "TaxFlow can demonstrate questionnaire intake, return preparation stages, document readiness and deadline tracking around an existing professional tax service.",
    publicEvidence: "Alliant CPA publicly lists company and personal tax returns, BURS support, tax audits, PAYE, VAT and advisory services."
  },
  {
    id: "evolve-alliance",
    name: "Evolve Alliance",
    sector: "Tax & Accounting",
    location: "Gaborone",
    email: "info@evolvealliance.co.bw",
    phone: "+267 76 057 951",
    website: "https://evolvealliance.co.bw/",
    sourceUrl: "https://evolvealliance.co.bw/",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "tax-flow",
    fitHypothesis: "TaxFlow is a plausible fit for demonstrating tax-registration, compliance, planning, returns and client workflow visibility.",
    publicEvidence: "Evolve Alliance publicly lists tax registration, tax compliance, tax planning and timely submission of returns."
  },
  {
    id: "bongaka-health-care",
    name: "Bongaka Health Care",
    sector: "Healthcare",
    location: "Gaborone",
    email: "info@bongakahealth.co.bw",
    phone: "+267 391 9900",
    website: "https://bongakahealth.co.bw/",
    sourceUrl: "https://bongakahealth.co.bw/",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "clinic-flow",
    fitHypothesis: "ClinicFlow can demonstrate patient intake, appointments, practitioner schedules, reminders and follow-up workflows across a multi-service clinic.",
    publicEvidence: "Bongaka publicly lists general practice, employee wellness, travel clinic, imaging and laboratory services."
  },
  {
    id: "hamilton-medical-center",
    name: "Hamilton Medical Center",
    sector: "Healthcare",
    location: "Gaborone",
    email: "hamiltonmedcentre@gmail.com",
    website: "https://www.hamiltonmedcentre.com/",
    sourceUrl: "https://www.hamiltonmedcentre.com/",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "clinic-flow",
    fitHypothesis: "ClinicFlow could provide an interactive proposal around appointment intake, practitioner workflows, follow-ups and patient-facing administration.",
    publicEvidence: "Hamilton Medical Center publicly describes itself as a private multispeciality clinic/hospital in Gaborone."
  },
  {
    id: "chidzanani-pharmacy",
    name: "Chidzanani Pharmacy",
    sector: "Pharmacy",
    location: "Francistown / Gaborone / Nata / Masunga",
    email: "chidzananipharmacy@gmail.com",
    phone: "+267 240 8835",
    website: "https://chidzananipharmacy.com/",
    sourceUrl: "https://chidzananipharmacy.com/contact",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "pharma-desk",
    fitHypothesis: "PharmaDesk can demonstrate branch-aware medicine inventory, stock levels, expiry/batch tracking, supplier ordering and dispensing workflow.",
    publicEvidence: "Chidzanani publicly lists multiple Botswana branches, prescriptions, pricing enquiries and delivery."
  },
  {
    id: "reld-med-pharmacy",
    name: "Reld Med Pharmacy",
    sector: "Pharmacy",
    location: "Francistown",
    email: "reydubbs@gmail.com",
    phone: "+267 242 1332",
    website: "https://www.reldmed.com/",
    sourceUrl: "https://www.reldmed.com/",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "pharma-desk",
    fitHypothesis: "PharmaDesk could demonstrate stock visibility, refill/dispensing queues, medicine batches and pharmacy operations while leaving clinical judgment with pharmacists.",
    publicEvidence: "Reld Med publicly describes prescription/refill support, medicine availability, pharmacist consultation and a registered dispensary."
  },
  {
    id: "upr-group",
    name: "UPR Group",
    sector: "Construction",
    location: "Gaborone",
    email: "info@uprgroup.co.bw",
    phone: "+267 310 4484",
    website: "https://uprgroup.co.bw/",
    sourceUrl: "https://uprgroup.co.bw/",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "build-quote",
    fitHypothesis: "BuildQuote can demonstrate enquiry qualification, site-visit capture, estimate/quote stages, project milestones and client updates.",
    publicEvidence: "UPR Group publicly lists architecture, maintenance, refurbishment, project management, engineering and building-construction services."
  },
  {
    id: "time-to-build-bots",
    name: "Time To Build Bots",
    sector: "Construction",
    location: "Gaborone",
    email: "info@time2build.co.bw",
    phone: "+267 75 572 642",
    website: "https://time2build.co.bw/",
    sourceUrl: "https://time2build.co.bw/",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "build-quote",
    fitHypothesis: "BuildQuote can showcase lead capture, project scoping, quotation workflow and progress visibility for a multi-trade contractor.",
    publicEvidence: "Time To Build Bots publicly lists building/civil works, renovation, plumbing, maintenance, electrical and mechanical work."
  },
  {
    id: "wild-aria-travels",
    name: "Wild Aria Travels",
    sector: "Tourism",
    location: "Maun",
    email: "kea@wildariatravel.com",
    phone: "+267 72887540",
    sourceUrl: "https://hatab.bw/directory-members_list/locations/maun/",
    sourceLabel: "HATAB member directory",
    checkedAt: "2026-10-02",
    recommendedProduct: "explore-bw",
    fitHypothesis: "ExploreBW can demonstrate packages, itinerary enquiries, traveller details, bookings and saved experiences for a tour operator.",
    publicEvidence: "HATAB's current Maun member directory lists Wild Aria Travels in the tour-operator sector with public contact details."
  },
  {
    id: "mwende-mokoro-tours",
    name: "Mwende Mokoro Tours",
    sector: "Tourism",
    location: "Maun",
    email: "mwendemokorotours@gmail.com",
    phone: "+267 73347071",
    sourceUrl: "https://hatab.bw/directory-members_list/locations/maun/",
    sourceLabel: "HATAB member directory",
    checkedAt: "2026-10-02",
    recommendedProduct: "explore-bw",
    fitHypothesis: "ExploreBW could showcase an itinerary and booking-enquiry experience for mobile safari and mokoro-tour customers.",
    publicEvidence: "HATAB's current Maun directory lists Mwende Mokoro Tours in its tourism membership with public contact details."
  },
  {
    id: "tfl-logistics",
    name: "TFL Logistics",
    sector: "Logistics",
    location: "Gaborone / Selebi-Phikwe",
    email: "info@tfl.co.bw",
    phone: "+267 75 624 347",
    website: "https://www.tfl.co.bw/",
    sourceUrl: "https://www.tfl.co.bw/",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "move-track",
    fitHypothesis: "MoveTrack can demonstrate quote requests, jobs, fleet/driver assignment, delivery states and proof-of-delivery workflows.",
    publicEvidence: "TFL publicly lists freight forwarding, cross-border haulage, warehousing, customs clearing and project logistics."
  },
  {
    id: "air-fast-logistics",
    name: "Air Fast Logistics",
    sector: "Logistics",
    location: "Gaborone / Maun",
    email: "info@airfast.co.bw",
    phone: "+267 7189 4925",
    website: "https://www.airfast.co.bw/",
    sourceUrl: "https://www.airfast.co.bw/contact.php",
    sourceLabel: "Official website",
    checkedAt: "2026-10-02",
    recommendedProduct: "move-track",
    fitHypothesis: "MoveTrack is a relevant showcase for transport jobs, fleet visibility, delivery milestones and proof-of-delivery around an established logistics operation.",
    publicEvidence: "Air Fast publicly lists transportation, warehousing, mining support, fleet operations and nationwide/cross-border logistics."
  }
];

export const prospectCount = prospects.length;
