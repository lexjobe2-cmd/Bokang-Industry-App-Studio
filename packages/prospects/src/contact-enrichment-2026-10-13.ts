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
  },
  "law-on-call": {
    email: "info@lawoncall.co.bw",
    emailSourceUrl: "https://lawoncall.co.bw/",
    emailEvidence: "Law On Call public website surfaces info@lawoncall.co.bw."
  },
  "tengo-rubadiri-attorneys": {
    email: "rubadiri@global.bw",
    emailSourceUrl: "https://bidp.bw/ssl/html/bidp/shop/work_customers.php",
    emailEvidence: "Current BIDP public customer listing surfaces the Rubadiri business email."
  },
  "armstrongs-attorneys": {
    email: "armstrongs@info.bw",
    emailSourceUrl: "https://www.aripo.org/member-states-view/30",
    emailEvidence: "ARIPO public Botswana IP-agent listing surfaces armstrongs@info.bw."
  },
  "dr-sc-menodent-dental-clinic-mudavanhu-nawa": {
    email: "menodent@gmail.com",
    secondaryPhones: ["+267 71706367"],
    emailSourceUrl: "https://mobileapp.hdb.co.bw/directory/general/menodent-dental-clinic/",
    phoneSourceUrl: "https://mobileapp.hdb.co.bw/directory/general/menodent-dental-clinic/",
    emailEvidence: "Current Health Directory Botswana listing surfaces menodent@gmail.com.",
    phoneEvidence: "Current Health Directory Botswana listing surfaces the office and mobile contacts."
  },
  "naledi-dental-centre": {
    email: "billkure47@bbi.co.bw",
    secondaryPhones: ["+267 71234666"],
    emailSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/HDB_2016W.pdf",
    phoneSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/HDB_2016W.pdf",
    emailEvidence: "Health Directory Botswana public dental directory surfaces billkure47@bbi.co.bw for Naledi Dental Centre.",
    phoneEvidence: "Health Directory Botswana public dental directory surfaces the office and mobile contacts."
  },
  "accelron-security-services": {
    email: "isaacs@accelronsecurity.com",
    secondaryPhones: ["+267 73457882"],
    emailSourceUrl: "https://www.localbotswana.com/company/14032/Accelron_Security_Services",
    phoneSourceUrl: "https://www.localbotswana.com/company/14032/Accelron_Security_Services",
    emailEvidence: "Verified Local Botswana listing publicly surfaces the director's business email.",
    phoneEvidence: "Verified listing surfaces the public company and mobile contacts."
  },
  "hawk-eye-risk-solutions": {
    email: "sales@hawkeye.co.bw",
    secondaryPhones: ["+267 71335036"],
    emailSourceUrl: "https://servicemeonline.com/advert/hawk-eye-risk-solutions/",
    phoneSourceUrl: "https://www.hawkeye.co.bw/",
    emailEvidence: "Current ServiceMe Botswana listing surfaces sales@hawkeye.co.bw.",
    phoneEvidence: "Hawk Eye public website surfaces telephone and WhatsApp contacts."
  },
  "canterquip-pty-ltd": {
    email: "canterquipbw@canterquip.co.bw",
    phone: "+267 311 7683",
    secondaryPhones: ["+267 72894408"],
    emailSourceUrl: "https://canterquip.co.bw/",
    phoneSourceUrl: "https://canterquip.co.bw/",
    emailEvidence: "Canterquip public website surfaces canterquipbw@canterquip.co.bw.",
    phoneEvidence: "Canterquip public website surfaces the company and mobile contacts."
  },
  "glazing-botswana-pty-ltd": {
    email: "sales@glazingbotswana.com",
    secondaryPhones: ["+267 71302181"],
    emailSourceUrl: "https://servicemeonline.com/advert/glazing-botswana/",
    phoneSourceUrl: "https://www.brabys.com/bw/aluminium-door-window-repairs",
    emailEvidence: "Current Botswana business listing surfaces sales@glazingbotswana.com.",
    phoneEvidence: "Public business directory surfaces office and mobile contacts."
  },
  "haskins-j-and-sons": {
    email: "gaborone@haskins.co.bw",
    emailSourceUrl: "https://bidp.bw/ssl/html/bidp/shop/work_customers.php",
    emailEvidence: "BIDP public customer listing surfaces gaborone@haskins.co.bw."
  },
  "jamal-trading-company": {
    email: "jamalsales1@gmail.com",
    emailSourceUrl: "https://servicemeonline.com/advert/jamal-trading-company/",
    emailEvidence: "Current ServiceMe Botswana listing surfaces jamalsales1@gmail.com for Jamal Trading."
  },
  "nata-timber-pty-ltd": {
    email: "sales@natatimber.co.bw",
    emailSourceUrl: "https://servicemeonline.com/advert/nata-timber-industries/",
    emailEvidence: "Current Botswana business listing and recent public notices surface sales@natatimber.co.bw."
  },
  "builders-world-mogoditshane": {
    email: "sales@buildersworld.co.bw",
    phone: "+267 392 2656",
    emailSourceUrl: "https://www.buildersworldbw.com/contact-us",
    phoneSourceUrl: "https://www.buildersworldbw.com/contact-us",
    emailEvidence: "Builders World public website surfaces sales@buildersworld.co.bw.",
    phoneEvidence: "Builders World public website surfaces its Gaborone contact number."
  },
  "steel-and-construction-pty-ltd": {
    email: "info@steelco.co.bw",
    emailSourceUrl: "https://steel0.yolasite.com/",
    emailEvidence: "Public Steel & Construction Botswana business website surfaces info@steelco.co.bw."
  },
  "kgalagadi-soap-industries-pty-ltd": {
    email: "malome@ksi.co.bw",
    emailSourceUrl: "https://www.bitc.co.bw/data/719f21970d514317a008c16e5e143cc6.pdf",
    emailEvidence: "BITC public company directory surfaces malome@ksi.co.bw for Kgalagadi Soap Industries."
  },
  "tlokweng-rural-development-centre": {
    email: "admin@trdc.co.bw",
    emailSourceUrl: "https://servicemeonline.com/listing/brigades/",
    emailEvidence: "Current Botswana service directory surfaces admin@trdc.co.bw."
  },
  "unibuild-pty-ltd": {
    email: "unibuild@btcmail.co.bw",
    phone: "+267 391 3777",
    emailSourceUrl: "https://universalbuilders.co.bw/",
    phoneSourceUrl: "https://universalbuilders.co.bw/",
    emailEvidence: "Universal Builders Botswana public website surfaces unibuild@btcmail.co.bw.",
    phoneEvidence: "Universal Builders public website surfaces the business telephone."
  },
  "aluminium-city": {
    email: "avashialucity@it.bw",
    emailSourceUrl: "https://www.brabys.com/bw/aluminium-door-window-repairs",
    emailEvidence: "Public Botswana aluminium business directory surfaces avashialucity@it.bw."
  },
  "label-man": {
    email: "label-man@live.com",
    secondaryPhones: ["+267 72939383"],
    emailSourceUrl: "https://bottleblower.com/contact/",
    phoneSourceUrl: "https://bottleblower.com/contact/",
    emailEvidence: "Label Man public contact page surfaces label-man@live.com.",
    phoneEvidence: "Label Man public contact page surfaces office and mobile contacts."
  },
  "associated-printers": {
    email: "assocprint@mega.bw",
    emailSourceUrl: "https://www.localbotswana.com/company/9087/ASSOCIATED_PRINTERS",
    emailEvidence: "Public Local Botswana Q&A records the business quotation email assocprint@mega.bw."
  },
  "imprint-botswana": {
    email: "btimprint@gmail.com",
    emailSourceUrl: "https://online.flipbuilder.com/lcha/kqvi/files/basic-html/page8.html",
    emailEvidence: "Imprint Botswana's 2025 Discover Botswana publication lists btimprint@gmail.com."
  },
  "crystal-digital-print": {
    email: "sales@crystal.co.bw",
    emailSourceUrl: "https://sabusinesslistings.co.za/listings/crystal-digital-print/",
    emailEvidence: "Public business listing surfaces sales@crystal.co.bw for Crystal Digital Print."
  },
  "printing-and-publishing-company-botswana-pty-ltd": {
    email: "sales@ppcb.co.bw",
    phone: "+267 391 2844",
    secondaryPhones: ["+267 73115965"],
    emailSourceUrl: "https://ppcb.co.bw/",
    phoneSourceUrl: "https://ppcb.co.bw/",
    emailEvidence: "PPCB public website surfaces sales@ppcb.co.bw.",
    phoneEvidence: "PPCB public website surfaces its telephone and WhatsApp/mobile contact."
  },
  "smart-relocations": {
    email: "sales@smartrelocations.co.bw",
    secondaryPhones: ["+267 77884473", "+267 73483313"],
    emailSourceUrl: "https://www.localbotswana.com/company/14158/SMART_RELOCATIONS",
    phoneSourceUrl: "https://smartrelocations.co.bw/",
    emailEvidence: "Verified Local Botswana Q&A surfaces sales@smartrelocations.co.bw.",
    phoneEvidence: "Smart Relocations public website surfaces telephone and WhatsApp contacts."
  },
  "van-and-truck-hire-pty-ltd": {
    email: "contactus@vth.co.bw",
    secondaryPhones: ["+267 72465788", "+267 76800245"],
    emailSourceUrl: "https://servicemeonline.com/advert/van-truck-hire/",
    phoneSourceUrl: "https://servicemeonline.com/advert/van-truck-hire/",
    emailEvidence: "Current ServiceMe Botswana listing surfaces contactus@vth.co.bw.",
    phoneEvidence: "Current listing surfaces office and mobile contacts."
  },
  "botswana-couriers": {
    email: "francistown@botscouriers.co.bw",
    emailSourceUrl: "https://servicemeonline.com/listing/botswana-couriers-logistics/",
    emailEvidence: "Current Botswana Couriers public business listing surfaces the Francistown branch email."
  },
  "auto-world-pty-ltd": {
    email: "mohit@autoworld.co.bw",
    emailSourceUrl: "https://www.boschaftermarket.com/afr/en/distributors/parts-distributors/",
    emailEvidence: "Bosch public Botswana distributor directory surfaces mohit@autoworld.co.bw."
  },
  "omega-couriers": {
    email: "josephine@omegacouriers.co.za",
    secondaryPhones: ["+267 71414290"],
    emailSourceUrl: "https://omegacouriers.co.za/contact.html",
    phoneSourceUrl: "https://omegacouriers.co.za/contact.html",
    emailEvidence: "Omega Couriers public contact page surfaces the Botswana branch contact email.",
    phoneEvidence: "Omega Couriers public contact page surfaces the Botswana branch telephone/mobile."
  },
  "magnum-freight-pty-ltd": {
    email: "magnum@accelerate-it.co.bw",
    emailSourceUrl: "https://burs.org.bw/phocadownload/General_Downloads/Botswana%20Customs%20Clearing%20Agents.pdf",
    emailEvidence: "Current BURS customs-clearing-agent publication surfaces magnum@accelerate-it.co.bw."
  },
  "adima-hire-pty-ltd": {
    email: "info@adimahire.com",
    phone: "+267 391 3136",
    secondaryPhones: ["+267 71300924"],
    emailSourceUrl: "https://www.biz-ads.co.za/item/adima-hire-pty-ltd/",
    phoneSourceUrl: "https://servicemeonline.com/advert/adima-hire/",
    emailEvidence: "Public Adima business listing surfaces info@adimahire.com.",
    phoneEvidence: "Current Botswana business listing surfaces office and mobile contacts."
  },
  "calvary-guest-house": {
    email: "calvarygantsi@gmail.com",
    secondaryPhones: ["+267 74131975", "+267 73304975"],
    emailSourceUrl: "https://www.botswanatourism.co.bw/index.php/taxonomy/term/23?page=26",
    phoneSourceUrl: "https://www.botswanatourism.co.bw/index.php/taxonomy/term/23?page=26",
    emailEvidence: "Botswana Tourism Organisation operating-facility listing surfaces calvarygantsi@gmail.com.",
    phoneEvidence: "Botswana Tourism Organisation listing surfaces the guesthouse telephone/mobile contacts."
  },
  "botshelo-guesthouse": {
    email: "botsheloguesthouse@gmail.com",
    emailSourceUrl: "https://www.botswanatourism.co.bw/index.php/taxonomy/term/23?page=68",
    emailEvidence: "Botswana Tourism Organisation operating listing surfaces botsheloguesthouse@gmail.com."
  }

};
