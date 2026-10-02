import type { ProductSlug } from "@bokang/app-config";

export type Prospect = {
  id: string;
  name: string;
  sector: string;
  location: string;
  email?: string;
  phone?: string;
  website?: string;
  websiteStatus: string;
  sourceUrl: string;
  sourceLabel: string;
  checkedAt: string;
  recommendedProduct: ProductSlug;
  fitHypothesis: string;
  publicEvidence: string;
};

function googleSearchUrl(name: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(name + " Botswana")}`;
}

const noWebsiteStatus = "No website link listed in the Google business/search result when checked";

export const prospects: Prospect[] = [
  {
    id: "gape-april-attorneys",
    name: "Gape April Attorneys",
    sector: "Legal",
    location: "Gaborone International Commerce Park, Gaborone",
    phone: "+267 72 333 088",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Gape April Attorneys"),
    sourceLabel: "Google business/search result",
    checkedAt: "2026-10-02",
    recommendedProduct: "lex-intake",
    fitHypothesis: "A dedicated law-firm website plus LexIntake could give the practice a clearer public presence while routing first enquiries into a structured conflict-check and consultation workflow.",
    publicEvidence: "Google's business result identifies Gape April Attorneys as a law firm in Gaborone International Commerce Park and showed a public phone number but no website link when checked."
  },
  {
    id: "tebape-law-group",
    name: "Tebape Law Group",
    sector: "Legal",
    location: "Kwena House, Plot 117 Unit 6A, Gaborone",
    phone: "+267 311 7558",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Tebape Law Group"),
    sourceLabel: "Google business/search result",
    checkedAt: "2026-10-02",
    recommendedProduct: "lex-intake",
    fitHypothesis: "LexIntake can provide a professional public law-firm site and a structured path from initial enquiry to conflict review and consultation without exposing the internal matter workspace.",
    publicEvidence: "Google's business result identifies Tebape Law Group as a Gaborone law firm with a public telephone number and no website link when checked."
  },
  {
    id: "gaborapelwe-attorneys",
    name: "Gaborapelwe Attorneys",
    sector: "Legal",
    location: "Gaborone",
    phone: "+267 376 4878",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Gaborapelwe Attorneys"),
    sourceLabel: "Google/search + Botswana legal directory cross-check",
    checkedAt: "2026-10-02",
    recommendedProduct: "lex-intake",
    fitHypothesis: "A focused law-firm website could make the practice easier to discover and give prospects a safe first-enquiry route before sensitive legal information is collected.",
    publicEvidence: "Botswana legal-directory results list the practice and public phone contacts; the search check did not surface an obvious official website."
  },

  {
    id: "proficient-accountants",
    name: "Anunaki Innerprizes T/A Proficient Accountants",
    sector: "Accounting",
    location: "African Mall, Gaborone",
    phone: "+267 318 7012",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Proficient Accountants Gaborone"),
    sourceLabel: "Google business/search result",
    checkedAt: "2026-10-02",
    recommendedProduct: "ledger-desk",
    fitHypothesis: "LedgerDesk could pair a modern accounting-firm front door with recurring client onboarding, document collection and month-end workflow behind it.",
    publicEvidence: "Google's business result lists Proficient Accountants as an accounting firm at African Mall with a public phone number and no website link when checked."
  },
  {
    id: "galmas-accounting",
    name: "Galmas Accounting Botswana",
    sector: "Accounting & Tax",
    location: "iTowers, Gaborone",
    email: "galmasbw@gmail.com",
    phone: "+267 74 045 306",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Galmas Accounting Botswana"),
    sourceLabel: "Google business/search result",
    checkedAt: "2026-10-02",
    recommendedProduct: "tax-flow",
    fitHypothesis: "TaxFlow could give the practice a tax-specific public presence with readiness, enquiry and BURS-guidance paths while keeping return preparation inside the private workflow.",
    publicEvidence: "Google's business result lists Galmas as an accounting firm at iTowers with a phone number but no website link; a public directory also exposes an email/Facebook contact rather than a dedicated website."
  },
  {
    id: "capital-accounting-consulting",
    name: "Capital Accounting and Consulting",
    sector: "Accounting & Tax",
    location: "Gaborone",
    phone: "+267 368 8881",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Capital Accounting and Consulting Gaborone"),
    sourceLabel: "Google/search cross-check",
    checkedAt: "2026-10-02",
    recommendedProduct: "ledger-desk",
    fitHypothesis: "A dedicated accounting website could make the firm easier to evaluate publicly while LedgerDesk handles recurring engagements and client finance workflows privately.",
    publicEvidence: "The search check surfaced business/social directory presence and a public phone contact but no obvious dedicated official website."
  },

  {
    id: "multicare-medical-centre",
    name: "MultiCare Medical Centre",
    sector: "Healthcare",
    location: "Lenganeng, Plot 8003 Mmaseroka Rd, Gaborone",
    phone: "+267 77 829 279",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("MultiCare Medical Centre Gaborone"),
    sourceLabel: "Google business/search result",
    checkedAt: "2026-10-02",
    recommendedProduct: "clinic-flow",
    fitHypothesis: "ClinicFlow could provide a patient-facing digital front door for care information, clinician profiles and appointment requests while the clinic keeps operations private.",
    publicEvidence: "Google's business result categorises MultiCare as a medical centre/general practitioner in Gaborone and showed a phone number but no website link when checked."
  },
  {
    id: "mafitlhakgosi-clinic",
    name: "Mafitlhakgosi Clinic",
    sector: "Healthcare",
    location: "Tlokweng / Gaborone",
    phone: "+267 392 8563",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Mafitlhakgosi Clinic Botswana"),
    sourceLabel: "Google business/search result + provider directory",
    checkedAt: "2026-10-02",
    recommendedProduct: "clinic-flow",
    fitHypothesis: "ClinicFlow could replace directory-only discovery with a proper patient site for care information, appointments, hours and verified practitioner details.",
    publicEvidence: "Google lists Mafitlhakgosi Clinic as a medical clinic and provider directories publish its contact details; a direct search did not surface an official clinic website."
  },
  {
    id: "sebele-centre-private-clinic",
    name: "Sebele Centre Private Clinic",
    sector: "Healthcare",
    location: "Sebele Centre Mall, Gaborone",
    email: "sebelecenterprivateclinic@gmail.com",
    phone: "+267 390 1774",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Sebele Centre Private Clinic Gaborone"),
    sourceLabel: "Google/search + healthcare directory cross-check",
    checkedAt: "2026-10-02",
    recommendedProduct: "clinic-flow",
    fitHypothesis: "ClinicFlow could give the clinic an owned patient-access surface instead of relying on directory/Facebook discovery, with appointment requests and patient information feeding the private clinic workflow.",
    publicEvidence: "Current provider/directory results expose the clinic's address, phone and Facebook/email contacts; the search check did not surface a dedicated official website."
  },

  {
    id: "kgalagadi-pharmacy-gaborone",
    name: "Kgalagadi Pharmacy - Gaborone",
    sector: "Pharmacy",
    location: "Kubu / Broadhurst Industrial, Gaborone",
    phone: "+267 71 680 306",
    email: "kgalagadipharmacyonline@gmail.com",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Kgalagadi Pharmacy Gaborone"),
    sourceLabel: "Google business/search result",
    checkedAt: "2026-10-02",
    recommendedProduct: "pharma-desk",
    fitHypothesis: "PharmaDesk could add an owned pharmacy website for prescription requests, pharmacist support, branch information and fulfilment while retaining the existing operational/app channels.",
    publicEvidence: "Google's business result lists the pharmacy and delivery/pickup features but no website link when checked. The pharmacy also has a mobile-app presence, which is complementary rather than a public website."
  },
  {
    id: "chemist-plus",
    name: "The Chemist Plus",
    sector: "Pharmacy",
    location: "Kanye / Botswana",
    phone: "+267 544 1341",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("The Chemist Plus Botswana"),
    sourceLabel: "Google/search + stockist directory cross-check",
    checkedAt: "2026-10-02",
    recommendedProduct: "pharma-desk",
    fitHypothesis: "A PharmaDesk public site could give customers a direct prescription/refill, services and branch-information channel while internal pharmacy controls remain separate.",
    publicEvidence: "Current Botswana stockist/business results identify The Chemist Plus and public telephone details; the direct search did not surface an obvious dedicated official website."
  },

  {
    id: "batsho-building-construction",
    name: "Batsho Building Construction Ltd",
    sector: "Construction",
    location: "Gaborone West Phase 4 Industrial, Gaborone",
    phone: "+267 315 8283",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Batsho Building Construction Botswana"),
    sourceLabel: "Google/search + construction directory cross-check",
    checkedAt: "2026-10-02",
    recommendedProduct: "build-quote",
    fitHypothesis: "BuildQuote could give the contractor a credible public portfolio/services/contact website while project and quotation workflows remain private.",
    publicEvidence: "Botswana construction-directory results list Batsho with its Gaborone address and telephone but no website; the search check did not surface an obvious official site."
  },
  {
    id: "denkent-construction",
    name: "Denkent Construction Ltd",
    sector: "Construction",
    location: "Boseja Industrial Sites, Maun",
    phone: "+267 686 0653",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Denkent Construction Maun Botswana"),
    sourceLabel: "Google/search + construction directory cross-check",
    checkedAt: "2026-10-02",
    recommendedProduct: "build-quote",
    fitHypothesis: "A BuildQuote public construction website could make the company easier to assess for projects in Maun while keeping estimates and project operations internal.",
    publicEvidence: "Botswana construction-directory results list Denkent in Maun with a public telephone number and no website link; the search check did not surface an obvious official site."
  },
  {
    id: "pi-building-construction",
    name: "PI Building Construction Ltd",
    sector: "Construction",
    location: "Dumela Rd, Tati Town, Francistown",
    phone: "+267 241 3928",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("PI Building Construction Francistown Botswana"),
    sourceLabel: "Google/search + construction directory cross-check",
    checkedAt: "2026-10-02",
    recommendedProduct: "build-quote",
    fitHypothesis: "BuildQuote could provide an owned project-and-services website for the contractor, with enquiry qualification feeding the private quotation workflow.",
    publicEvidence: "Botswana construction-directory results list PI Building Construction in Francistown with a public telephone number but no website."
  },

  {
    id: "kwatale-safari-company",
    name: "Kwatale Safari Company",
    sector: "Tourism",
    location: "New Mall, Maun",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Kwatale Safari Company Maun"),
    sourceLabel: "Google business/search result",
    checkedAt: "2026-10-02",
    recommendedProduct: "explore-bw",
    fitHypothesis: "ExploreBW could give the operator a Botswana-first safari website with itinerary ideas, destinations, map context and enquiry planning instead of relying only on directory discovery.",
    publicEvidence: "Google's business result identifies Kwatale Safari Company in Maun and did not show a website link when checked."
  },
  {
    id: "tracks-adventure-safaris",
    name: "Tracks Adventure Safaris & Lodges",
    sector: "Tourism",
    location: "Sir Seretse Khama Rd, Maun",
    phone: "+267 680 1327",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Tracks Adventure Safaris and Lodges Maun"),
    sourceLabel: "Google business/search result",
    checkedAt: "2026-10-02",
    recommendedProduct: "explore-bw",
    fitHypothesis: "ExploreBW could turn the operator's safari activities into an owned discovery and itinerary-enquiry site, especially for travellers comparing Botswana experiences online.",
    publicEvidence: "Google's result describes safari camping, national-park/game-reserve viewing, walks, mokoro and boat activities and publishes a phone number, but no website link was shown when checked."
  },

  {
    id: "oc-transport-services",
    name: "O.C Transport Services",
    sector: "Transport & Logistics",
    location: "Gaborone",
    phone: "+267 77 690 202",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("O.C Transport Services Gaborone"),
    sourceLabel: "Google business/search result",
    checkedAt: "2026-10-02",
    recommendedProduct: "move-track",
    fitHypothesis: "MoveTrack could give the operator an owned public transport website for services, coverage and quote requests while fleet/job operations remain private.",
    publicEvidence: "Google's business result categorises O.C Transport Services as a transportation service in Gaborone and shows a public phone number but no website link."
  },
  {
    id: "gifas-transport",
    name: "Gifa's Transport",
    sector: "Transport & Tours",
    location: "Gaborone",
    phone: "+267 74 384 088",
    websiteStatus: noWebsiteStatus,
    sourceUrl: googleSearchUrl("Gifa's Transport Botswana"),
    sourceLabel: "Google business/search result",
    checkedAt: "2026-10-02",
    recommendedProduct: "move-track",
    fitHypothesis: "MoveTrack's public transport surface could help package transfer, shuttle and cross-border services into a professional owned site with structured enquiries.",
    publicEvidence: "Google's result describes taxi, airport shuttle, cross-border connections and transfer services with a public phone number and no website link when checked."
  }
];

export const prospectCount = prospects.length;
