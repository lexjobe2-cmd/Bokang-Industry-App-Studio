import type { ProductSlug } from "@bokang/app-config";

export type RegistryProspectSeed = {
  id: string;
  name: string;
  industry: string;
  subIndustry: string;
  sector: string;
  location: string;
  city: string;
  phone?: string;
  email?: string;
  websiteStatus: "unclear";
  verificationState: "needs-recheck";
  sourceUrl: string;
  sourceLabel: string;
  recommendedProduct: ProductSlug;
  newTemplateOpportunity?: string;
  fitHypothesis: string;
  evidence: string;
  checkedAt: string;
  cipaVerificationState: "search-pending";
  cipaEvidence: string;
  operatingEvidenceState: "current-operating-evidence" | "directory-active";
  operatingEvidence: string;
};

type Group = {
  industry: string;
  subIndustry: string;
  sector: string;
  product: ProductSlug;
  source: string;
  template?: string;
  operatingState?: RegistryProspectSeed["operatingEvidenceState"];
  rows: string;
};

const CHECKED_AT = "2026-10-13";
const CIPA_NOTE = "CIPA registration/status must be re-checked in the official CIPA Online Business Registration System before outreach. Automated access to the public CIPA search was not available during this sourcing pass, so no active-registration claim is made here.";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function expand(group: Group): RegistryProspectSeed[] {
  return group.rows
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((row) => {
      const [name = "", city = "Gaborone", phone = "", email = ""] = row.split("|");
      const operatingEvidenceState = group.operatingState ?? "directory-active";
      return {
        id: slugify(name),
        name,
        industry: group.industry,
        subIndustry: group.subIndustry,
        sector: group.sector,
        location: city + ", Botswana",
        city,
        ...(phone ? { phone } : {}),
        ...(email ? { email } : {}),
        websiteStatus: "unclear" as const,
        verificationState: "needs-recheck" as const,
        sourceUrl: group.source,
        sourceLabel: "Current Botswana operating/business evidence; CIPA status queued for official re-check · checked 13 Oct 2026",
        recommendedProduct: group.product,
        ...(group.template ? { newTemplateOpportunity: group.template } : {}),
        fitHypothesis: group.template
          ? group.template + " is a strong Studio opportunity for this operating business."
          : "This operating business maps directly to the existing " + group.product + " public-site and internal-workflow template.",
        evidence:
          "The current public source surfaces the business and contact/operating evidence. First-party website status and CIPA register status must be re-checked immediately before outreach.",
        checkedAt: CHECKED_AT,
        cipaVerificationState: "search-pending" as const,
        cipaEvidence: CIPA_NOTE,
        operatingEvidenceState,
        operatingEvidence:
          operatingEvidenceState === "current-operating-evidence"
            ? "Recent public activity, booking availability, opening hours or current business information was surfaced in the sourcing pass."
            : "A current Botswana business-directory or professional listing was surfaced in the sourcing pass.",
      };
    });
}

const groups: Group[] = [
  {
    industry: "Beauty & Personal Care",
    subIndustry: "Nail Tech & Beauty",
    sector: "Nail Tech & Beauty",
    product: "nail-muse",
    source: "https://www.google.com/search?q=Botswana+nail+technician+Gaborone",
    operatingState: "current-operating-evidence",
    rows: `
DM beauty & Nail|Gaborone|+26772727308|
Upper standards- Beauty matters|Gaborone|+26772954589|
Bev's Beauty Bar|Gaborone|+26773597119|
Sorbet Salon - Fields Mall|Gaborone|+26774030626|fieldsmall@sorbet.co.bw
Naildee'it Beauty|Gaborone|+26771326312|naildeeitbeauty@gmail.com
Lala's Nails|Gaborone|+26776055665|bylaronamakgosa@gmail.com
Arts Of Laser Beauty Spa|Gaborone|+26773398463|
Nails By Kelendria|Gaborone|+26776752926|
Nailed_by_Lahme|Gaborone|+26774549027|
LH Hair Studio|Gaborone|+26772580968|
Doll Life|Gaborone|+26772767278|
Essentials Beauty Spa & Salon|Gaborone|+26773328287|
Ms Jay Beauty Care|Gaborone|+26775120892|
Buhle's Hair Lab|Gaborone|+26776714434|
Camelot Spa - Grand Palm|Gaborone|+2673637787|
`
  },
  {
    industry: "Beauty & Personal Care",
    subIndustry: "Hair Salon & Barber",
    sector: "Salon & Barber",
    product: "nail-muse",
    source: "https://www.localbotswana.com/category/Hairdressers/city%3AGaborone",
    template: "Salon/barber variant of beauty booking template",
    rows: `
THR Holdings (Pty) Ltd|Gaborone|+2673914244|
Pearls & Lillies Salon|Gaborone|+2673900646|
Hair Scene Hair Salon|Gaborone|+2673700190|
Optima Hair Salon|Gaborone|+2673908079|
Cj's Hair Salon|Gaborone|+2673910770|
Ebony Hair Salon|Gaborone|+2673971942|
Afrodizzia Salon|Gaborone|+2673903988|
Kentha Dee Hair Salon|Gaborone|+2673165466|
City Hair Boutique (Pty) Ltd|Gaborone|+2673180426|
Clipso Hair Salon|Gaborone|+2673971621|
Fabb Suppliers Of Ladine|Gaborone|+2673500352|
Hairport Salon|Gaborone|+2673925162|
Hair Fantasy|Gaborone|+2673900621|
Perfect Image Unisex Salon|Gaborone|+2673910850|
Perfect Image|Gaborone|+2673910849|
Saxon Hair Salon|Gaborone|+2673959944|
Tsm Hair & Beauty Clinique|Gaborone|+2673500479|
Yarley Cosmetique (Pty) Ltd|Gaborone|+2673956103|
All Generations Hair Salon & Boutique|Gaborone|+2673926358|
Garden Hair Salon|Gaborone|+2673957497|
Heritage Hair Salon & Beauty Clinic|Gaborone|+2673918050|
Roses & Lillies Beauty Salon|Gaborone|+2673185323|
The Hairjob Hair Salon By Dressy|Gaborone|+2673914647|
This And That Hair Salon|Gaborone|+2673902619|
Trends Unisex Hair Salon|Gaborone|+2673170144|
`
  },
  {
    industry: "Consumer Services",
    subIndustry: "Laundry & Dry Cleaning",
    sector: "Laundry & Dry Cleaning",
    product: "fresh-fold",
    source: "https://www.localbotswana.com/category/Dry_Cleaning",
    rows: `
Nick Laundry & Cleaning Services|Palapye|+26776209454|
Phane ya Mengwe Cleaning Services|Maun|+26774082637|
Leeway (Pty) Ltd|Selebi-Phikwe|+2672613547|
L M and P Express Dry Cleaners (Pty) Ltd|Lobatse|+2675330584|
Mother Wash Dry Cleaners & Laundry|Mahalapye|+2674710327|
Rubies Group|Palapye|+2674922227|
Smart Dryclean|Selebi-Phikwe|+2672615322|
Smart Youth Dry Clean|Selebi-Phikwe|+2672615322|
Clean Spot Dry Cleaners|Selebi-Phikwe|+2672614202|
L M & P Dry Cleaners|Gaborone|+2673910729|
Look Smart Dry Cleaners|Francistown|+2672412038|
Maun Dry Cleaning & Laundry Services|Maun|+2676860665|
Modern Drycleaners Molepolole|Molepolole|+2675921884|
Palapye Dry Cleaners (Pty) Ltd|Palapye|+2674920046|
Purple Tie Dry Cleaners|Gaborone|+2673188874|
`
  },
  {
    industry: "Business Services",
    subIndustry: "Cleaning Services",
    sector: "Cleaning Services",
    product: "build-quote",
    source: "https://www.localbotswana.com/category/Cleaning/city%3AGaborone",
    template: "Cleaning-services booking + quote template",
    rows: `
Clugston Group|Gaborone|+2673950067|
CleanTek (Pty) Ltd|Gaborone|+26771300922|
Kalahari Shine|Gaborone|+26771493585|
Everyday Outdoor Designers|Gaborone|+26777636283|
Primeone (Pty) Ltd|Gaborone|+2673158414|
Eximia Sanitary Services|Gaborone|+26774085539|
Vito Hygiene (Pty) Ltd|Gaborone|+2673933303|
Skitters Cleaning Company|Gaborone|+2673165992|
Cleanall Services|Gaborone|+26774681104|info@cleanall.co.bw
iClean Botswana|Gaborone|+26777723377|
Lam Uya Tech Holdings|Gaborone|+26772600300|
Polamon Group|Gaborone|+2673112151|
Deft Cleaners|Gaborone|+26777029886|
Fargreen Pty Ltd|Gaborone|+26772221556|
Natural Profile (Pty) Ltd|Gaborone|+26772816610|
`
  },
  {
    industry: "Food & Beverage",
    subIndustry: "Purified Water & Delivery",
    sector: "Purified Water & Delivery",
    product: "aqua-flow",
    source: "https://www.google.com/search?q=purified+water+Botswana+business",
    operatingState: "current-operating-evidence",
    rows: `
MetsiExpress|Gaborone|||
Savorpak Enterprise|Gaborone|||
AquaBees|Gaborone|||
Pristine Premium Still & Alkaline Water|Gaborone|+26775161560|
VYNA Holdings (Pty) Ltd - Letlodi Purified Water|Kanye|+26773881474|
For Life Pure Still Water|Ramotswa|+26772110046|motsatsi@yahoo.com
Pinacle-aqua|Gaborone|+26775405071|
Acquazzone Pty Ltd|Francistown|+26776518292|
Integrated Business Investments (Pty) Ltd|Gaborone|+26772624792|ibiwatertreatment@gmail.com
Blue Waters|Gaborone|+2677711957|
`
  },
  {
    industry: "Security",
    subIndustry: "Private Security Services",
    sector: "Security Services",
    product: "move-track",
    source: "https://www.localbotswana.com/category/Security_services/city%3AGaborone",
    template: "Security services public site + guard/incident operations template",
    rows: `
Accelron Security Services|Gaborone|+26773001214|
Hawk Eye Risk Solutions|Gaborone|+2673935344|
Floodlight Security (Pty) Ltd|Gaborone|+26774051437|
Canterquip Pty Ltd|Gaborone|+2673117683|
Datadot Products Gaborone|Gaborone|+26772686791|
BIRWA Group Holdings (Pty) Ltd|Gaborone|+2673113016|
Soteria Security Services|Gaborone|+2673114672|
HardPro|Gaborone|+2673909213|
GIDS Botswana (Pty) Ltd|Gaborone|+2673105787|
Security Fencing Botswana (Pty) Ltd|Gaborone|+2673938659|
Piashi Security Services|Gaborone|+26775175509|
Winners Security Services|Gaborone|+26772177834|
Mivani|Gaborone|+26771471315|
Polygraph & Investigation Services Botswana|Gaborone|+26775956725|
Bulat Security Services|Gaborone|+26773304338|
`
  },
  {
    industry: "Retail & Trade",
    subIndustry: "Hardware & Building Supply",
    sector: "Hardware & Building Supply",
    product: "build-quote",
    source: "https://www.localbotswana.com/category/Hardware_Stores",
    template: "Hardware catalogue + stock/quote enquiry template",
    rows: `
Glazing Botswana (Pty) Ltd|Gaborone|+2673922797|
Haskins J & Sons|Gaborone|+2673951001|
Jamal Trading Company|Gaborone|+2673922900|
Nata Timber (Pty) Ltd|Gaborone|+2673924406|
PG Glass (Pty) Ltd|Gaborone|+2673952901|
Builders World Mogoditshane|Mogoditshane|+2673909456|
Sismo (Pty) Ltd|Gaborone|+2673953560|
Steel & Construction (Pty) Ltd|Gaborone|+2673972978|
Lumber City|Gaborone|+2673165772|
Ross Breeders Botswana (Pty) Ltd|Gaborone|+2673161629|
Incredible Solutions (Pty) Ltd|Gaborone|+2673918514|
Micro Peripheral Systems|Gaborone|+2673186504|
Prominent Paints Botswana|Gaborone|+2673953327|
Relihold (Pty) Ltd T/a Hardware House|Gaborone|+2673914044|
Als Holdings|Gaborone|+2673922582|
Aluminium City|Gaborone|+2673938452|
Bush Mills (Pty) Ltd T/a Rachi Enterprises|Gaborone|+2673938583|
Creative House (Pty) Ltd|Gaborone|+2673938388|
Ibs - It|Gaborone|+2673901339|
Kgalagadi Soap Industries (Pty) Ltd|Gaborone|+2673912791|
Marble Holdings (Pty) Ltd T/a Mica City|Gaborone|+2673910827|
Mica Gaborone|Gaborone|+2673910827|
Pilot Project T/a Formula 1 Trader|Gaborone|+2676875098|
Tlokweng Rural Development Centre|Tlokweng|+2673928332|
Unibuild (Pty) Ltd|Gaborone|+2673190175|
Sah (Pty) Ltd|Gaborone|+2673113678|
Seed Co International Limited|Gaborone|+2673911907|
Vmsu Trading (Pty) Ltd T/a MN Hardware & Motor Parts|Gaborone|+26771333046|
P G Industries Botswana (Pty) Ltd|Gaborone|+2673922992|
PG Timbers|Gaborone|+2673922992|
`
  },
  {
    industry: "Printing & Signage",
    subIndustry: "Commercial Printing & Signage",
    sector: "Printing & Signage",
    product: "build-quote",
    source: "https://www.localbotswana.com/category/Specialist_printing",
    template: "Printing/signage catalogue + quote/artwork-upload template",
    rows: `
Label Man|Gaborone|+2673911787|
Zone Land Proprietary Limited|Gaborone|+2673111141|
Associated Printers|Gaborone|+2673182926|
Imprint Botswana|Gaborone|+2673167480|
Boswa Botswana Printers (Pty) Ltd|Gaborone|+2673971368|
Crystal Digital Print|Gaborone|+2673500333|
Express Printers|Gaborone|+2673182418|
Gaborone Printing Works (Pty) Ltd|Gaborone|+2673922984|
Graphiscan & Print|Gaborone|+2673182916|
Impression House|Gaborone|+2673922984|
Keorapetse Investment|Gaborone|+2673167372|
Multitech Consultancy & Business Service|Gaborone|+2673923197|
Petadco Printing House|Gaborone|+2673163808|
Premier Printers & Business Consultants|Gaborone|+2673907346|
Printing & Publishing Company Botswana (Pty) Ltd|Gaborone|+2673166059|
`
  },
  {
    industry: "Transport & Logistics",
    subIndustry: "Transport, Courier & Logistics",
    sector: "Transport & Logistics",
    product: "move-track",
    source: "https://www.localbotswana.com/category/Logistics/city%3AGaborone",
    rows: `
Smart Relocations|Gaborone|+2673931777|
Van & Truck Hire (Pty) Ltd|Gaborone|+2673912280|
Westside Motors|Gaborone|+2673186702|
AB Motor Spares|Jwaneng|+2675880516|
Auto World (Pty) Ltd|Gaborone|+2673933860|
Auto And General Supplies|Gaborone|+2673905979|
Barloworld Motor Francistown|Francistown|+2672412323|
Botswana Couriers|Gaborone|+2673930629|
Botoka Auto Centre|Palapye|+2674921995|
Broadhurst Motors (Pty) Ltd|Gaborone|+2673912579|
One Stop Auto Shop|Gaborone|+2673167234|
Noise Boys (Pty) Ltd|Gaborone|+2673909972|
Federal Express Botswana|Gaborone|+2673973588|
G & I Carriers and Logistics|Gaborone|+26771886306|
Pinnacle Express Couriers|Gaborone|+2673935537|
Postnet Head Office|Gaborone|+2673186505|
Preffered One (Pty) Ltd|Gaborone|+26771276357|
Pelican Moving Company|Gaborone|+2673161342|
Skynet Botswana|Gaborone|+2673953835|
Letsatsi Investments|Gaborone|+2673925202|
Magnum Freight (Pty) Ltd|Gaborone|+2673973708|
Masego Transport (Pty) Ltd|Gaborone|+2673953676|
Modern Road Services (Pty) Ltd|Gaborone|+2673906139|
Omega Couriers|Gaborone|+2673952956|
Adima Hire (Pty) Ltd|Gaborone|+2673953024|
`
  },
  {
    industry: "Tourism & Accommodation",
    subIndustry: "Guest House & Accommodation",
    sector: "Guest House & Accommodation",
    product: "explore-bw",
    source: "https://www.localbotswana.com/category/Guest_houses",
    rows: `
Berry Bliss Guest House|Gaborone|+26773280392|
Streets of Gold Guest House|Gaborone|+26772816135|
Accomodationbotswana.com|Gaborone|+26774776181|
Falcon Crest Suites|Gaborone|+2673935373|
Phomolong Guest House|Gaborone|+2673971579|
Delta Guest House|Gaborone|+2676862858|
Super Guesthouse|Gaborone|+2673182134|
M S A Guest Accommodation|Gaborone|+2673186065|
Tie Du Guest House|Gaborone|+2673105626|
Tlholo Guest House|Gaborone|+2673925865|
Tony Service Apartment|Gaborone|+2673950006|
Debswana Guest House|Gaborone|+2673951563|
Jalunto Enterprises T/a Lollapa Lodge|Gaborone|+2673959363|
Qhwigaba Guest Lodge|Maun|+26771393925|
Cycad Palm Guesthouse|Palapye|+2674921404|
City View Guest House|Mogoditshane|+2673915603|
Calvary Guest House|Ghanzi|+2676597411|
SoSleepy Guest House|Palapye|+26774395050|
Stwalo's Place|Lobatse|+2675331091|
Botshelo Guesthouse|Maun|+2676860548|
`
  },
  {
    industry: "Healthcare",
    subIndustry: "Dental Clinic",
    sector: "Dental Care",
    product: "clinic-flow",
    source: "https://www.localbotswana.com/category/Dentists",
    rows: `
Right Move Dental Clinic|Gaborone|+26772214295|
Dr Tau Dental Spa|Gaborone|+2673133600|
Dr Medical Dental Service Clinic|Gaborone|+2673913553|
Dr Bp Mariri|Gaborone|+2673710111|
Dr Rp Matthews|Gaborone|+2673975212|
Dr Sc Menodent Dental Clinic Mudavanhu-nawa|Francistown|+2672416575|
Naledi Dental Centre|Maun|+2676862666|
Dr A Berg|Gaborone|+2673901226|
Dr H Dental Surgery|Gaborone|+2673951604|
Dr J Horneman|Gaborone|+2673951604|
St John's Dental Clinic|Francistown|+2672412295|
Hasseriis Dr J & Associates|Gaborone|+2673975212|
Jacaranda (Pty) Ltd Dental|Gaborone|+2673951604|
Moampe RL Medical & Dental Services Clinic|Gaborone|+2673903563|
Molepolole Private Dental Clinic|Molepolole|+2675910237|
Poly Health Services|Gaborone|+2673930002|
Prodent Dental Clinic|Gaborone|+2673188028|
Dr Mf Abba|Lobatse|+2675330808|
Kagiso Dental Clinic|Palapye|+2674923856|
Elite Dental Clinic|Palapye|+2674924730|
`
  },
  {
    industry: "Legal",
    subIndustry: "Law Firm",
    sector: "Legal",
    product: "lex-intake",
    source: "https://www.localbotswana.com/category/Lawyers",
    rows: `
Piyush Sharma Attorneys & Co|Gaborone|+2673191622|
Law-on-call|Gaborone|+26774453105|
Ndlovu Moitshepi & Co|Gaborone|+2673911716|
Mhaka Attorneys|Gaborone|+2673936751|
Sikhakhane & Company|Gaborone|+2673908078|
Lekorwe Legal Consultants|Gaborone|+2673167668|
Manyothwane & Partners|Francistown|+2672416745|
Mosele Legal Services|Gaborone|+2673185575|
Toteng Attorneys|Gaborone|+2673956648|
Collins Newman And Co|Gaborone|+2673952702|
Minchin & Kelly Attorneys|Gaborone|+2673908494|
SADC Lawyers Association|Gaborone|+2673162425|
B Maripe And Company|Gaborone|+2673903258|
Lerumo Mogobe Legal Practitioners|Gaborone|+2673974002|
Makunyana Legal Practice|Gaborone|+2673185727|
Matlala Attorneys|Gaborone|+2673937681|
Moses Kadye Attorneys|Gaborone|+2673163174|
M T Garekwe Attorneys|Gaborone|+2673904123|
Sehamela Sckga Attorneys|Gaborone|+2673952073|
Tengo Rubadiri Attorneys|Gaborone|+2673911577|
Armstrongs Attorneys|Gaborone|+2673953481|
Bahuma Mack Attorneys|Gaborone|+2673922862|
Monthe Marumo & Company|Gaborone|+2673951984|
Mosate & Associates|Gaborone|+2673907234|
Motsamai Attorneys|Gaborone|+2673910048|
Motsaathebe Attorneys|Gaborone|+2673903636|
Mugoni Molodi Attorneys|Gaborone|+2673915512|
Oarabile Pitso Attorneys|Gaborone|+2673187529|
Rahim Khan And Company|Gaborone|+2673188988|
Ramokhua Attorneys|Gaborone|+2673908803|
`
  },
  {
    industry: "Professional Services",
    subIndustry: "Accounting, Tax & Payroll",
    sector: "Accounting & Tax",
    product: "ledger-desk",
    source: "https://www.localbotswana.com/category/Audit_and_accounting",
    rows: `
Timo Accounting Practice|Gaborone|+26773741741|
Nexus Chartered Certified Accountants (Pty) Ltd|Gaborone|+26772151779|
Arc Payroll Services|Gaborone|+2673167906|
BDO Botswana|Gaborone|+2673902779|
Ernst & Young Botswana|Gaborone|+2673974078|
A & T Associate|Gaborone|+2673975161|
PricewaterhouseCoopers Botswana|Gaborone|+2673952190|
A B C Services|Gaborone|+2673919210|
Matabi (Pty) Ltd|Gaborone|+2673953567|
Moores Rowland Botswana|Gaborone|+2673957466|
Ramani & Associates|Gaborone|+2673919210|
Kolluri Accounting Services|Gaborone|+2673957579|
R S Tilney & Co|Gaborone|+2673957524|
W K Public Accounting (Pty) Ltd|Gaborone|+2673161233|
M K Mayanja & Associates|Gaborone|+2673914644|
`
  }
];

export const cipaOperatingProspectSeeds: RegistryProspectSeed[] = groups.flatMap(expand);

export const cipaOperatingProspectSeedCount = cipaOperatingProspectSeeds.length;
