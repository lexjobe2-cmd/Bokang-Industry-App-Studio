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
  fitHypothesis: string;
  evidence: string;
};

const checkedAt = "2026-10-05";

const seeds: Seed[] = [
  {
    id:"begane-associates", name:"Begane & Associates", sector:"Legal", location:"Gaborone, Botswana", city:"Gaborone",
    phone:"+267 319 1078", websiteStatus:"directory-only", sourceUrl:"https://legaldialog.com/law-firm-directory-botswana-find-legal-services-near-you/",
    sourceLabel:"Botswana legal directory + current search check", recommendedProduct:"lex-intake",
    fitHypothesis:"A dedicated law-firm website and LexIntake enquiry path could replace directory-only discovery with a professional owned digital front door.",
    evidence:"Current legal-directory/search results surface the firm and phone contact, but no first-party domain was surfaced in the checked result."
  },
  {
    id:"bernard-bolele-attorneys", name:"Bernard Bolele Attorneys", sector:"Legal", location:"Gaborone, Botswana", city:"Gaborone",
    phone:"+267 395 9111", websiteStatus:"directory-only", sourceUrl:"https://legaldialog.com/law-firm-directory-botswana-find-legal-services-near-you/",
    sourceLabel:"Botswana legal directory + current search check", recommendedProduct:"lex-intake",
    fitHypothesis:"LexIntake could provide an owned public site for practice areas, lawyers and confidential first contact before matter intake.",
    evidence:"The checked directory/search result lists the practice and phone number without surfacing a first-party website."
  },
  {
    id:"kedikilwe-attorneys", name:"Kedikilwe Attorneys", sector:"Legal", location:"Palapye, Botswana", city:"Palapye",
    websiteStatus:"directory-only", sourceUrl:"https://lsb.korwe.co.bw/registered-firms",
    sourceLabel:"Law Society registry + current search check", recommendedProduct:"lex-intake",
    fitHypothesis:"An owned law-firm site could make the Palapye practice easier to discover and route prospects into a structured enquiry workflow.",
    evidence:"The Law Society registry lists the firm as active in Palapye; the checked search did not surface a clear first-party domain."
  },
  {
    id:"lecha-attorneys", name:"Lecha Attorneys", sector:"Legal", location:"Lobatse, Botswana", city:"Lobatse",
    websiteStatus:"directory-only", sourceUrl:"https://lsb.korwe.co.bw/registered-firms",
    sourceLabel:"Law Society registry + current search check", recommendedProduct:"lex-intake",
    fitHypothesis:"LexIntake could give the firm a client-facing legal website while keeping conflict checks and matter operations private.",
    evidence:"The Law Society registry lists the firm as active in Lobatse; no first-party website was surfaced in the checked search result."
  },
  {
    id:"moribame-attorneys", name:"Moribame Attorneys", sector:"Legal", location:"Gaborone, Botswana", city:"Gaborone",
    websiteStatus:"directory-only", sourceUrl:"https://lsb.korwe.co.bw/registered-firms",
    sourceLabel:"Law Society registry + current search check", recommendedProduct:"lex-intake",
    fitHypothesis:"A modern legal website could improve public trust, service discovery and first-contact routing for the practice.",
    evidence:"The Law Society registry lists the firm as active in Gaborone; the checked search did not surface a clear first-party site."
  },
  {
    id:"rankoro-attorneys", name:"Rankoro Attorneys", sector:"Legal", location:"Serowe, Botswana", city:"Serowe",
    websiteStatus:"directory-only", sourceUrl:"https://lsb.korwe.co.bw/registered-firms",
    sourceLabel:"Law Society registry + current search check", recommendedProduct:"lex-intake",
    fitHypothesis:"An owned site could help a Serowe practice present expertise, practitioners and a safe initial-enquiry process.",
    evidence:"The Law Society registry lists the firm as active in Serowe; no first-party website was surfaced in the checked result."
  },
  {
    id:"tenane-attorneys", name:"Tenane Attorneys", sector:"Legal", location:"Selebi-Phikwe, Botswana", city:"Selebi-Phikwe",
    websiteStatus:"directory-only", sourceUrl:"https://lsb.korwe.co.bw/registered-firms",
    sourceLabel:"Law Society registry + current search check", recommendedProduct:"lex-intake",
    fitHypothesis:"LexIntake could create a professional owned digital presence for the practice and structure first enquiries before engagement.",
    evidence:"The Law Society registry lists the firm as active in Selebi-Phikwe; no first-party domain was surfaced in the checked search."
  },
  {
    id:"tlhalefo-legal-consultants", name:"Tlhalefo Legal Consultants", sector:"Legal", location:"Francistown, Botswana", city:"Francistown",
    websiteStatus:"directory-only", sourceUrl:"https://lsb.korwe.co.bw/registered-firms",
    sourceLabel:"Law Society registry + current search check", recommendedProduct:"lex-intake",
    fitHypothesis:"A dedicated legal site could improve Francistown discovery and add structured consultation requests.",
    evidence:"The Law Society registry lists the firm as active in Francistown; the checked search did not surface a clear first-party website."
  },

  {
    id:"aventurine-accounting-consultancy", name:"Aventurine Accounting Consultancy", sector:"Accounting & Tax", location:"Phase 2, Gaborone, Botswana", city:"Gaborone",
    phone:"+267 75 398 372", websiteStatus:"no-first-party-site-found", sourceUrl:"https://www.localbotswana.com/company/15193/Aventurine_Accounting_Consultancy",
    sourceLabel:"Local Botswana verified directory + current search check", recommendedProduct:"ledger-desk",
    fitHypothesis:"LedgerDesk could turn a directory-led presence into an owned accounting website with a clear monthly-finance front door.",
    evidence:"The current directory profile has a blank website field while listing active accounting, bookkeeping and tax services."
  },
  {
    id:"neema-certified-accountants", name:"Neema Certified Accountants & Business Advisors", sector:"Accounting & Tax", location:"Gaborone International Finance Park, Gaborone", city:"Gaborone",
    phone:"+267 75 454 575", websiteStatus:"social-only", sourceUrl:"https://www.localbotswana.com/company/13516/Neema_Certified_Accountants_Business_Advisors_Pty_Ltd",
    sourceLabel:"Local Botswana verified directory", recommendedProduct:"ledger-desk",
    fitHypothesis:"LedgerDesk could give the firm a first-party site while keeping the existing social presence and recurring client work behind the scenes.",
    evidence:"The checked directory profile points its website field to a Facebook page rather than a dedicated first-party website."
  },
  {
    id:"aa-professional-services-north", name:"AA Professional Services North (Pty) Ltd", sector:"Accounting", location:"393/2 Baines Ave, Francistown, Botswana", city:"Francistown",
    phone:"+267 241 5358", websiteStatus:"no-first-party-site-found", sourceUrl:googleSearchUrl("AA Professional Services North Francistown"),
    sourceLabel:"Google business/search result", recommendedProduct:"ledger-desk",
    fitHypothesis:"A professional accounting website could help the Francistown firm present services, trust signals and enquiry paths outside directory discovery.",
    evidence:"The current business result surfaces address and phone details but no first-party website field."
  },
  {
    id:"aupracon", name:"Aupracon (Pty) Ltd", sector:"Tax", location:"Gaborone, Botswana", city:"Gaborone",
    phone:"+267 393 9435", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Tax_consultants/city%3AGaborone",
    sourceLabel:"Local Botswana tax-consultant directory", recommendedProduct:"tax-flow",
    fitHypothesis:"TaxFlow could give the tax practice a dedicated public advisory and readiness experience while return work stays private.",
    evidence:"The current tax-consultant directory lists Aupracon with phone, email and map but no website link in the listing."
  },
  {
    id:"beryl-beryl", name:"Beryl & Beryl (Pty) Ltd", sector:"Tax & Business Services", location:"Technology Park, Gaborone, Botswana", city:"Gaborone",
    phone:"+267 391 4804", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Tax_consultants/5/city%3AGaborone",
    sourceLabel:"Local Botswana tax-consultant directory", recommendedProduct:"tax-flow",
    fitHypothesis:"A TaxFlow public site could turn directory discovery into a structured tax-advisory and enquiry channel.",
    evidence:"The checked directory result lists the business with phone/email but no website link."
  },
  {
    id:"business-towers-consultants", name:"Business Towers Consultants", sector:"Tax & Business Services", location:"Tswana House, Main Mall, Gaborone", city:"Gaborone",
    phone:"+267 397 3570", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Tax_consultants/5/city%3AGaborone",
    sourceLabel:"Local Botswana tax-consultant directory", recommendedProduct:"tax-flow",
    fitHypothesis:"TaxFlow could give the consultancy a stronger owned public presence for compliance, advisory and tax enquiries.",
    evidence:"The current directory listing provides phone/email contact without surfacing a website."
  },
  {
    id:"acme-services-tax", name:"Acme Services", sector:"Tax & Business Services", location:"Commerce Park, Gaborone, Botswana", city:"Gaborone",
    phone:"+267 395 7466", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Tax_consultants/7/city%3AGaborone",
    sourceLabel:"Local Botswana tax-consultant directory", recommendedProduct:"tax-flow",
    fitHypothesis:"A focused tax-advisory site could give prospects a clearer way to understand services and start a tax enquiry.",
    evidence:"The checked directory result lists the company and phone contact but no website."
  },

  {
    id:"neovision-eye-clinic", name:"Neovision Eye Clinic", sector:"Healthcare", location:"Lobengula Ave, Francistown, Botswana", city:"Francistown",
    phone:"+267 71 897 405", websiteStatus:"no-first-party-site-found", sourceUrl:googleSearchUrl("Neovision Eye Clinic Francistown"),
    sourceLabel:"Google business/search result", recommendedProduct:"clinic-flow",
    fitHypothesis:"ClinicFlow could give the eye clinic an owned patient-access site with clinician, service and appointment information.",
    evidence:"The current business result surfaces location, hours and phone but no first-party website field."
  },
  {
    id:"broadvision-eye-clinic", name:"Broadvision Eye Clinic", sector:"Healthcare", location:"Sunshine Plaza, Francistown, Botswana", city:"Francistown",
    phone:"+267 240 6540", websiteStatus:"no-first-party-site-found", sourceUrl:googleSearchUrl("Broadvision Eye Clinic Francistown"),
    sourceLabel:"Google business/search result", recommendedProduct:"clinic-flow",
    fitHypothesis:"A patient-facing clinic website could make eye-care services and appointment access easier to understand.",
    evidence:"The current business result surfaces an optometry/eye-care listing and phone number but no website field."
  },
  {
    id:"botlhe-medical-centre-pharmacy", name:"Botlhe Medical Centre and Pharmacy", sector:"Healthcare", location:"Magokotswane, Molepolole, Botswana", city:"Molepolole",
    phone:"+267 75 441 044", websiteStatus:"no-first-party-site-found", sourceUrl:googleSearchUrl("Botlhe Medical Centre and Pharmacy Molepolole"),
    sourceLabel:"Google business/search result", recommendedProduct:"clinic-flow",
    fitHypothesis:"ClinicFlow could provide one public digital front door for the centre's clinic and pharmacy access while operations remain separate.",
    evidence:"The current business result lists the centre, hours and phone without a first-party website field."
  },
  {
    id:"botlhe-medical-centre", name:"Botlhe Medical Centre", sector:"Healthcare", location:"Magokotswane, Molepolole, Botswana", city:"Molepolole",
    phone:"+267 76 950 398", websiteStatus:"no-first-party-site-found", sourceUrl:googleSearchUrl("Botlhe Medical Centre Molepolole"),
    sourceLabel:"Google business/search result", recommendedProduct:"clinic-flow",
    fitHypothesis:"A dedicated clinic site could improve service discovery, contact and appointment requests for Molepolole patients.",
    evidence:"The current business result provides phone/hours information but no first-party website field."
  },
  {
    id:"psychmatters", name:"PsychMatters", sector:"Healthcare", location:"Village Medical Centre, Gaborone, Botswana", city:"Gaborone",
    phone:"+267 311 7851", websiteStatus:"no-first-party-site-found", sourceUrl:googleSearchUrl("PsychMatters Botswana"),
    sourceLabel:"Google business/search result", recommendedProduct:"clinic-flow",
    fitHypothesis:"ClinicFlow could provide a calm patient-facing information and appointment site appropriate to a mental-health service.",
    evidence:"The current business result surfaces address, hours and phone but no first-party website field."
  },
  {
    id:"madigele-clinics-new-batch", name:"Madigele Clinics", sector:"Healthcare", location:"Phase 4, Gaborone, Botswana", city:"Gaborone",
    phone:"+267 318 2415", websiteStatus:"no-first-party-site-found", sourceUrl:googleSearchUrl("Madigele Clinics Gaborone"),
    sourceLabel:"Google business/search result", recommendedProduct:"clinic-flow",
    fitHypothesis:"A dedicated public clinic site could simplify patient access to services, hours and appointment requests.",
    evidence:"The checked business result lists the clinic, opening hours and phone but no first-party website field."
  },
  {
    id:"karong-clinics", name:"Karong Clinics", sector:"Healthcare", location:"Moemi, Gaborone, Botswana", city:"Gaborone",
    phone:"+267 391 1529", websiteStatus:"no-first-party-site-found", sourceUrl:googleSearchUrl("Karong Clinics Gaborone"),
    sourceLabel:"Google business/search result", recommendedProduct:"clinic-flow",
    fitHypothesis:"ClinicFlow could provide an owned patient-access experience for services, clinicians, appointments and location.",
    evidence:"The current business result surfaces clinic contact/location data but no first-party website field."
  },

  {
    id:"chidzanani-pharmacy", name:"Chidzanani Pharmacy Francistown", sector:"Pharmacy", location:"Blue Jacket Street / Cresta Thapama, Francistown", city:"Francistown",
    phone:"+267 240 8835", websiteStatus:"no-first-party-site-found", sourceUrl:googleSearchUrl("Chidzanani Pharmacy Francistown"),
    sourceLabel:"Google business/search result", recommendedProduct:"pharma-desk",
    fitHypothesis:"PharmaDesk could give the pharmacy a public prescription/refill, services and branch-information experience.",
    evidence:"The current business result lists branches, hours and phone but no first-party website field."
  },
  {
    id:"pinecrest-pharmacy", name:"Pinecrest Pharmacy - Village Mall", sector:"Pharmacy", location:"Village Mall, Francistown, Botswana", city:"Francistown",
    phone:"+267 72 913 448", websiteStatus:"no-first-party-site-found", sourceUrl:googleSearchUrl("Pinecrest Pharmacy Francistown"),
    sourceLabel:"Google business/search result", recommendedProduct:"pharma-desk",
    fitHypothesis:"A PharmaDesk public site could support prescription requests, pharmacy services and branch information.",
    evidence:"The current business result surfaces the pharmacy, opening hours and phone but no website field."
  },
  {
    id:"living-water-pharmacy", name:"Living Water Pharmacy", sector:"Pharmacy", location:"Grand Lodge, Haskins St, Francistown", city:"Francistown",
    phone:"+267 241 9444", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Pharmacies/city%3AFrancistown",
    sourceLabel:"Local Botswana pharmacy directory", recommendedProduct:"pharma-desk",
    fitHypothesis:"An owned pharmacy site could add prescription/refill access, services and branch information beyond directory discovery.",
    evidence:"The current Francistown pharmacy directory lists email/map contact but no website link for this pharmacy."
  },
  {
    id:"mowana-pharmacy", name:"Mowana Pharmacy", sector:"Pharmacy", location:"Blue Jacket St, Francistown, Botswana", city:"Francistown",
    phone:"+267 241 7073", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Pharmacies/city%3AFrancistown",
    sourceLabel:"Local Botswana pharmacy directory", recommendedProduct:"pharma-desk",
    fitHypothesis:"PharmaDesk could provide a professional owned branch, refill and pharmacist-support website.",
    evidence:"The checked pharmacy directory lists the business and phone but no website."
  },
  {
    id:"francistown-pharmacy", name:"Francistown Pharmacy (Pty) Ltd", sector:"Pharmacy", location:"Blue Jacket St, Francistown, Botswana", city:"Francistown",
    phone:"+267 241 3437", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Pharmacies/city%3AFrancistown",
    sourceLabel:"Local Botswana pharmacy directory", recommendedProduct:"pharma-desk",
    fitHypothesis:"A community-pharmacy site could improve prescription access, branch discovery and customer communication.",
    evidence:"The current directory lists the pharmacy and phone number without a website link."
  },
  {
    id:"phodisong-pharmacy", name:"Phodisong Pharmacy", sector:"Pharmacy", location:"Francistown Mall, Francistown, Botswana", city:"Francistown",
    phone:"+267 241 3943", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Pharmacies/city%3AFrancistown",
    sourceLabel:"Local Botswana pharmacy directory", recommendedProduct:"pharma-desk",
    fitHypothesis:"PharmaDesk could add a mobile-friendly refill and pharmacist-contact experience for the pharmacy.",
    evidence:"The current directory listing provides phone/location information but no website."
  },
  {
    id:"sunnyside-pharmacy", name:"Sunnyside Pharmacy (Pty) Ltd", sector:"Pharmacy", location:"Swap Complex, Francistown, Botswana", city:"Francistown",
    phone:"+267 241 3661", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Pharmacies/city%3AFrancistown",
    sourceLabel:"Local Botswana pharmacy directory", recommendedProduct:"pharma-desk",
    fitHypothesis:"An owned pharmacy site could reduce reliance on directory search and support prescription/refill enquiries.",
    evidence:"The checked directory lists the pharmacy and public phone with no website link."
  },
  {
    id:"tati-river-pharmacy", name:"Tati River Pharmacy", sector:"Pharmacy", location:"St Patrick St, Francistown, Botswana", city:"Francistown",
    phone:"+267 241 2688", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Pharmacies/city%3AFrancistown",
    sourceLabel:"Local Botswana pharmacy directory", recommendedProduct:"pharma-desk",
    fitHypothesis:"PharmaDesk could provide prescription access, pharmacist support and verified branch information on an owned site.",
    evidence:"The current pharmacy directory lists the business and phone number but no website link."
  },

  {
    id:"sijo-construction", name:"Sijo Construction", sector:"Construction", location:"Francistown, Botswana", city:"Francistown",
    phone:"+267 242 1651", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Construction_services/2/city%3AFrancistown",
    sourceLabel:"Local Botswana construction directory", recommendedProduct:"build-quote",
    fitHypothesis:"BuildQuote could give the contractor a credible project/services website and structured enquiry path.",
    evidence:"The current construction directory lists Sijo Construction with phone/email but no website."
  },
  {
    id:"weaver-projects", name:"Weaver Projects (Pty) Ltd", sector:"Construction", location:"Blue Jacket St, Francistown, Botswana", city:"Francistown",
    phone:"+267 241 6900", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Construction_services/2/city%3AFrancistown",
    sourceLabel:"Local Botswana construction directory", recommendedProduct:"build-quote",
    fitHypothesis:"A BuildQuote public site could showcase projects, capabilities and contact while quotation/project operations stay private.",
    evidence:"The checked directory listing provides contact details without a website link."
  },
  {
    id:"craig-construction", name:"Craig Construction", sector:"Construction", location:"Dumela Industrial, Francistown, Botswana", city:"Francistown",
    websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Construction_services/2/city%3AFrancistown",
    sourceLabel:"Local Botswana construction directory", recommendedProduct:"build-quote",
    fitHypothesis:"A modern contractor website could make the company easier to evaluate for projects and capture qualified enquiries.",
    evidence:"The company appears in the current construction directory without a website surfaced in the checked listing."
  },
  {
    id:"ip-investments", name:"I P Investments", sector:"Construction", location:"Blue Jacket St, Francistown, Botswana", city:"Francistown",
    phone:"+267 240 2484", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Construction/2/city%3AFrancistown",
    sourceLabel:"Local Botswana construction directory", recommendedProduct:"build-quote",
    fitHypothesis:"BuildQuote could provide an owned construction company site with project proof, services and enquiry capture.",
    evidence:"The current construction directory lists phone/email contact but no website."
  },
  {
    id:"lm-super-builders", name:"L M Super Builders Co (Pty) Ltd", sector:"Construction", location:"Somerset Ext, Francistown, Botswana", city:"Francistown",
    phone:"+267 241 4450", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Construction/2/city%3AFrancistown",
    sourceLabel:"Local Botswana construction directory", recommendedProduct:"build-quote",
    fitHypothesis:"A project-led website could help the builder present capabilities and collect qualified construction enquiries.",
    evidence:"The checked directory entry lists the company and phone/email but no website."
  },
  {
    id:"micro-truck-crane-hire", name:"Micro Truck & Crane Hire (Pty) Ltd", sector:"Construction & Equipment", location:"Dumela Industrial, Francistown, Botswana", city:"Francistown",
    phone:"+267 241 5115", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Construction/2/city%3AFrancistown",
    sourceLabel:"Local Botswana construction directory", recommendedProduct:"build-quote",
    fitHypothesis:"BuildQuote could present equipment/services, past work and quote enquiries in an owned client-facing site.",
    evidence:"The current directory listing has phone/email contact but no website link."
  },
  {
    id:"jhaskins-sons", name:"J Haskins & Sons (Pty) Ltd", sector:"Construction & Building Supply", location:"Central Industrial Area, Francistown", city:"Francistown",
    phone:"+267 241 2301", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Construction_services/2/city%3AFrancistown",
    sourceLabel:"Local Botswana construction-services directory", recommendedProduct:"build-quote",
    fitHypothesis:"A project/service website could support commercial enquiries and make the company's capabilities easier to assess online.",
    evidence:"The checked directory result lists phone/email contact with no website link."
  },

  {
    id:"okavango-explorations", name:"Okavango Explorations (Pty) Ltd", sector:"Tourism", location:"The Mall, Maun, Botswana", city:"Maun",
    phone:"+267 686 0528", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Tour_operators/3/city%3AMaun",
    sourceLabel:"Local Botswana Maun tour-operator directory", recommendedProduct:"explore-bw",
    fitHypothesis:"ExploreBW could turn directory discovery into a Botswana-first safari site with itineraries, maps and trip enquiries.",
    evidence:"The current tour-operator directory lists the business and phone but no website."
  },
  {
    id:"soren-lindstrom-safaris", name:"Soren Lindstrom Safaris (Pty) Ltd", sector:"Tourism", location:"Maun, Botswana", city:"Maun",
    phone:"+267 686 0994", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Tour_operators/3/city%3AMaun",
    sourceLabel:"Local Botswana Maun tour-operator directory", recommendedProduct:"explore-bw",
    fitHypothesis:"A destination-led safari site could give the operator an owned discovery and planning channel.",
    evidence:"The checked directory page lists the operator and phone number without a website."
  },
  {
    id:"african-secrets-safari", name:"The African Secrets Safari Co", sector:"Tourism", location:"Maun, Botswana", city:"Maun",
    phone:"+267 686 0300", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Tour_operators/3/city%3AMaun",
    sourceLabel:"Local Botswana Maun tour-operator directory", recommendedProduct:"explore-bw",
    fitHypothesis:"ExploreBW could provide an owned safari discovery site with trip concepts, route information and enquiry planning.",
    evidence:"The current directory lists the operator with phone contact and no website."
  },
  {
    id:"trans-okavango-safaris", name:"Trans Okavango Safaris", sector:"Tourism", location:"Airport Rd, Maun, Botswana", city:"Maun",
    phone:"+267 686 0023", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Tour_operators/3/city%3AMaun",
    sourceLabel:"Local Botswana Maun tour-operator directory", recommendedProduct:"explore-bw",
    fitHypothesis:"A modern safari site could present routes, destinations and planning enquiries directly to travellers.",
    evidence:"The checked directory listing provides phone/location information but no website."
  },
  {
    id:"adventure-africa-maun", name:"Adventure Africa", sector:"Tourism", location:"Maun, Botswana", city:"Maun",
    phone:"+267 686 1827", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Tour_operators/3/city%3AMaun",
    sourceLabel:"Local Botswana Maun tour-operator directory", recommendedProduct:"explore-bw",
    fitHypothesis:"ExploreBW could give the operator a visual public safari website and structured itinerary-enquiry workflow.",
    evidence:"The current directory result lists the operator and phone but no website."
  },
  {
    id:"koro-safaris", name:"Koro Safaris (Pty) Ltd", sector:"Tourism", location:"Maun, Botswana", city:"Maun",
    phone:"+267 686 0205", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Tour_operators/3/city%3AMaun",
    sourceLabel:"Local Botswana Maun tour-operator directory", recommendedProduct:"explore-bw",
    fitHypothesis:"A dedicated safari site could improve international discovery and help qualify trip enquiries before operator follow-up.",
    evidence:"The checked directory lists Koro Safaris with phone contact and no website."
  },
  {
    id:"no-name-africa-adventures", name:"No Name Africa Adventures", sector:"Tourism", location:"Maun, Botswana", city:"Maun",
    phone:"+267 686 1600", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Tour_operators/3/city%3AMaun",
    sourceLabel:"Local Botswana Maun tour-operator directory", recommendedProduct:"explore-bw",
    fitHypothesis:"ExploreBW could create an owned safari discovery experience with itinerary ideas, Botswana maps and trip planning.",
    evidence:"The current tour-operator directory lists the company and phone but no website."
  },

  {
    id:"cheetah-wildcat", name:"Cheetah-Wildcat", sector:"Transport & Logistics", location:"Gaborone, Botswana", city:"Gaborone",
    phone:"+267 72 420 486", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Transport/2/city%3AGaborone",
    sourceLabel:"Local Botswana transport directory", recommendedProduct:"move-track",
    fitHypothesis:"MoveTrack could give the operator an owned logistics website for services, coverage and quote requests while fleet operations stay private.",
    evidence:"The current transport directory lists phone/email/map contact but no website."
  },
  {
    id:"jng-express", name:"JNG Express (Pty) Ltd", sector:"Transport", location:"Mogoditshane, Botswana", city:"Mogoditshane",
    phone:"+267 391 6629", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Transport/2/city%3AGaborone",
    sourceLabel:"Local Botswana transport directory", recommendedProduct:"move-track",
    fitHypothesis:"MoveTrack could package routes, transport services and customer enquiries into a professional owned web presence.",
    evidence:"The current transport directory lists the company and phone/email but no website."
  },
  {
    id:"bmr-agents", name:"BMR Agents", sector:"Transport & Logistics", location:"Tlokweng Bordergate, Botswana", city:"Tlokweng",
    phone:"+267 310 2217", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Transport/2/city%3AGaborone",
    sourceLabel:"Local Botswana transport directory", recommendedProduct:"move-track",
    fitHypothesis:"A MoveTrack public site could present transport/clearance capability, coverage and structured quote requests.",
    evidence:"The current directory listing provides phone/email contact but no website."
  },

  {
    id:"letlodi-purified-water", name:"VYNA Holdings (Pty) Ltd - Letlodi Purified Water", sector:"Purified Water & Delivery", location:"Mmathethe / Kanye, Botswana", city:"Kanye",
    phone:"+267 74 379 126", websiteStatus:"directory-only", sourceUrl:"https://www.localbotswana.com/category/Water_treatment",
    sourceLabel:"Local Botswana water-treatment directory", recommendedProduct:"move-track",
    fitHypothesis:"For a purified-water supplier, the strongest adaptation is a branded ordering/delivery front end paired with MoveTrack-style delivery and route operations.",
    evidence:"The current directory lists Letlodi Purified Water with phone/email and no website link in the checked listing."
  },
  {
    id:"pristine-premium-water", name:"Pristine Premium Still & Alkaline Water", sector:"Purified Water & Delivery", location:"MiddleStar Complex, Gaborone, Botswana", city:"Gaborone",
    phone:"+267 75 161 560", websiteStatus:"social-only", sourceUrl:"https://www.beautynailhairsalons.com/BW/Gaborone/102139462846181/Pristine-Premium-Still-%26-Alkaline-Water",
    sourceLabel:"Current social-page mirror / search result", recommendedProduct:"move-track",
    fitHypothesis:"A simple water-ordering website plus delivery-routing workflow could turn the business's social/WhatsApp presence into an owned ordering channel.",
    evidence:"Current search results surface social-page style contact and WhatsApp ordering information; no first-party website was surfaced in the checked result."
  },
  {
    id:"splash2o-water", name:"SplasH2O Water", sector:"Purified Water & Delivery", location:"Commerce Park, Gaborone, Botswana", city:"Gaborone",
    phone:"+267 391 1399", websiteStatus:"social-only", sourceUrl:"https://www.foodbevg.com/BW/Gaborone/2304950903162142/SplasH2O-Water",
    sourceLabel:"Current social-page mirror / search result", recommendedProduct:"move-track",
    fitHypothesis:"A branded water-ordering and delivery site could showcase bottle sizes, branded-water orders and local delivery while MoveTrack handles fulfilment operations.",
    evidence:"Current search results surface a social-page mirror with products and phone contacts but no first-party business website."
  }
];

export const prospects: Prospect[] = seeds.map((seed) => {
  const websiteStatus = seed.websiteStatus ?? "no-first-party-site-found";
  const newTemplateOpportunity = seed.sector === "Purified Water & Delivery"
    ? "SME commerce + recurring delivery template"
    : null;
  const confidence: ProspectConfidence = websiteStatus === "unclear"
    ? "low"
    : websiteStatus === "social-only"
      ? "medium"
      : "high";
  const socialPresence = websiteStatus === "social-only"
    ? ["Social page surfaced in current search"]
    : [];

  return {
    id: seed.id,
    company: seed.name,
    name: seed.name,
    industry: seed.sector,
    subIndustry: seed.sector,
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
