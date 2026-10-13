export type ContactEnrichment = {
  email?: string;
  phone?: string;
  secondaryPhones?: string[];
  emailSourceUrl?: string;
  phoneSourceUrl?: string;
  emailEvidence?: string;
  phoneEvidence?: string;
};

export const contactEnrichment: Record<string, ContactEnrichment> = {
  "metsiexpress": {
    email: "info@metsiexpress.com",
    emailSourceUrl: "https://www.metsiexpress.com/",
    emailEvidence: "MetsiExpress public website surfaces info@metsiexpress.com."
  },
  "arts-of-laser-beauty-spa": {
    email: "sales@artsoflaser.co.bw",
    phone: "+267 392 7111",
    secondaryPhones: ["+267 72158769", "+267 75651923"],
    emailSourceUrl: "https://artsoflaser.com/",
    phoneSourceUrl: "https://artsoflaser.com/",
    emailEvidence: "Arts of Laser public website surfaces sales@artsoflaser.co.bw.",
    phoneEvidence: "Current public website/contact results surface the Gaborone telephone and mobile/WhatsApp contacts."
  },
  "ms-jay-beauty-care": {
    email: "jayjaybeautysalon@gmail.com",
    emailSourceUrl: "https://www.serviceme.co.bw/",
    emailEvidence: "Current Botswana service listing surfaces the salon Gmail address."
  },
  "essentials-beauty-spa-and-salon": {
    email: "essentialsbspa@gmail.com",
    emailSourceUrl: "https://www.serviceme.co.bw/",
    emailEvidence: "Current Botswana service listing surfaces essentialsbspa@gmail.com."
  },
  "camelot-spa-grand-palm": {
    email: "grandpalm@camelotspa.co.za",
    phone: "+267 363 7787",
    secondaryPhones: ["+267 76880762"],
    emailSourceUrl: "https://www.camelotspa.co.za/",
    phoneSourceUrl: "https://www.camelotspa.co.za/",
    emailEvidence: "Camelot Spa public contact information surfaces the Grand Palm email.",
    phoneEvidence: "Public contact information surfaces the Grand Palm telephone and WhatsApp contact."
  },
  "kalahari-shine": {
    email: "chris@kalaharishine.co.bw",
    emailSourceUrl: "https://www.kalaharishine.co.bw/",
    emailEvidence: "Public Kalahari Shine business information surfaces chris@kalaharishine.co.bw."
  },
  "primeone-pty-ltd": {
    email: "admin@primeonebw.com",
    phone: "+267 315 8414",
    secondaryPhones: ["+267 71353132"],
    emailSourceUrl: "https://primeonebw.com/",
    phoneSourceUrl: "https://primeonebw.com/",
    emailEvidence: "Primeone public business website surfaces admin@primeonebw.com.",
    phoneEvidence: "Primeone public contact information surfaces the office and mobile contacts."
  },
  "polamon-group": {
    email: "polamongroup@gmail.com",
    emailSourceUrl: "https://www.serviceme.co.bw/",
    emailEvidence: "Current Botswana service listing surfaces polamongroup@gmail.com."
  },
  "lam-uya-tech-holdings": {
    email: "lameckmbaakanyi@gmail.com",
    emailSourceUrl: "https://www.bih.co.bw/",
    emailEvidence: "Botswana Digital & Innovation Hub member information surfaces the public contact email."
  },
  "piyush-sharma-attorneys-and-co": {
    email: "sharma@sharma.co.bw",
    phone: "+267 319 1622",
    secondaryPhones: ["+267 72727272"],
    emailSourceUrl: "https://sharma.co.bw/",
    phoneSourceUrl: "https://sharma.co.bw/",
    emailEvidence: "The firm's public website surfaces sharma@sharma.co.bw.",
    phoneEvidence: "The firm's public website/contact information surfaces the office and mobile contacts."
  },
  "lerumo-mogobe-legal-practitioners": {
    email: "partners@lerumomogobe.co.bw",
    emailSourceUrl: "https://lerumomogobe.co.bw/",
    emailEvidence: "The firm's public website surfaces partners@lerumomogobe.co.bw."
  },
  "collins-newman-and-co": {
    email: "partners@collinsnewman.bw",
    emailSourceUrl: "https://collinsnewman.bw/",
    emailEvidence: "The firm's public website surfaces partners@collinsnewman.bw."
  },
  "minchin-and-kelly-attorneys": {
    email: "info@minchinkelly.bw",
    emailSourceUrl: "https://www.aripo.org/",
    emailEvidence: "Public professional directory information surfaces info@minchinkelly.bw."
  },
  "makunyana-legal-practice": {
    email: "admin@mlp.co.bw",
    phone: "+267 318 5726",
    secondaryPhones: ["+267 74136542"],
    emailSourceUrl: "https://mlp.co.bw/",
    phoneSourceUrl: "https://mlp.co.bw/",
    emailEvidence: "The firm's public website surfaces admin@mlp.co.bw.",
    phoneEvidence: "Current public contact information surfaces the firm's office/mobile contacts."
  },
  "nexus-chartered-certified-accountants-pty-ltd": {
    email: "info@nexusca.co.bw",
    emailSourceUrl: "https://nexusca.co.bw/",
    emailEvidence: "Nexus public website/contact information surfaces info@nexusca.co.bw."
  },
  "arc-payroll-services": {
    email: "enquiries@arc.co.bw",
    phone: "+267 316 7906",
    secondaryPhones: ["+267 71823564"],
    emailSourceUrl: "https://arc.co.bw/",
    phoneSourceUrl: "https://arc.co.bw/",
    emailEvidence: "ARC public contact information surfaces enquiries@arc.co.bw.",
    phoneEvidence: "ARC public contact information surfaces the office and mobile numbers."
  },
  "a-b-c-services": {
    email: "abcservices@botsnet.bw",
    emailSourceUrl: "https://www.localbotswana.com/",
    emailEvidence: "Public Botswana business information surfaces abcservices@botsnet.bw."
  },
  "ramani-and-associates": {
    email: "vikasa@rabcs.com",
    emailSourceUrl: "https://www.baoa.org.bw/",
    emailEvidence: "Current BAOA public audit-firm information surfaces vikasa@rabcs.com."
  },
  "bdo-botswana": {
    email: "rlombard@bdo.bw",
    emailSourceUrl: "https://www.bdo.global/",
    emailEvidence: "Public BDO Botswana materials surface rlombard@bdo.bw as a business contact."
  },
  "berry-bliss-guest-house": {
    email: "info@berrybliss.co.bw",
    emailSourceUrl: "https://berrybliss.co.bw/",
    emailEvidence: "Berry Bliss public website/Botswana tourism information surfaces info@berrybliss.co.bw."
  },
  "streets-of-gold-guest-house": {
    email: "streetsofgoldbw@gmail.com",
    emailSourceUrl: "https://www.botswanatourism.co.bw/",
    emailEvidence: "Botswana tourism information surfaces streetsofgoldbw@gmail.com."
  },
  "falcon-crest-suites": {
    email: "falconcrest@falconcrest.co.bw",
    emailSourceUrl: "https://www.botswanatourism.co.bw/",
    emailEvidence: "Botswana tourism information surfaces falconcrest@falconcrest.co.bw."
  },
  "cycad-palm-guesthouse": {
    email: "reservations@cycadpalm.co.bw",
    emailSourceUrl: "https://www.cycadpalm.co.bw/",
    emailEvidence: "Cycad Palm public accommodation information surfaces reservations@cycadpalm.co.bw."
  },
  "babes-event-planner": {
    phone: "+267 78681480",
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana business listing surfaces the public contact number."
  },
  "dolomite-projects-pty-ltd": {
    phone: "+267 3912405",
    secondaryPhones: ["+267 3191504"],
    phoneSourceUrl: "https://dailynews.gov.bw/",
    phoneEvidence: "Recent Botswana Daily News business notice surfaces the public company contact numbers."
  },
  "val-interiors-pty-ltd": {
    phone: "+267 3911929",
    secondaryPhones: ["+267 71630213"],
    phoneSourceUrl: "https://valinteriors.co/",
    phoneEvidence: "Val Interiors public website surfaces the office and mobile contacts."
  },
  "genous-ventures": {
    phone: "+267 3922776",
    phoneSourceUrl: "https://dailynews.gov.bw/",
    phoneEvidence: "Public Botswana business notice surfaces the company telephone."
  },
  "royal-freight-pty-ltd": {
    phone: "+267 71529839",
    secondaryPhones: ["+267 75692495"],
    phoneSourceUrl: "https://www.botswanatradeportal.org.bw/",
    phoneEvidence: "Public Botswana exporter information surfaces current business contact mobiles."
  },
  "third-dimension": {
    phone: "+267 3922687",
    phoneSourceUrl: "https://bidp.bw/",
    phoneEvidence: "Current BIDP professional-practice listing surfaces the public office number."
  }
};
