export type ContactEnrichment = {
  email?: string;
  phone?: string;
  secondaryPhones?: string[];
  secondaryEmails?: string[];
  website?: string;
  websiteSourceUrl?: string;
  websiteEvidence?: string;
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
  "cleantek-pty-ltd": {
    secondaryPhones: ["+267 311 0139", "+267 311 1064", "+267 72535673"],
    website: "https://www.cleantek.co.bw/",
    websiteSourceUrl: "https://www.cleantek.co.bw/",
    websiteEvidence: "First-party CleanTek cleaning and hygiene website surfaced during the 13 Oct 2026 re-check.",
    phoneSourceUrl: "https://www.cleantek.co.bw/",
    phoneEvidence: "CleanTek first-party website lists +267 311 0139, 311 1064, +267 71300922 and +267 72535673."
  },
  "cleanall-services": {
    email: "info@cleanall.co.bw",
    secondaryEmails: ["sales@cleanall.co.bw", "palapye@cleanall.co.bw", "receptionft@cleanall.co.bw", "kasane@cleanall.co.bw"],
    secondaryPhones: ["+267 3912557", "+267 3186975", "+267 4920709", "+267 71926120", "+267 2402128", "+267 71300297"],
    website: "https://cleanall.co.bw/",
    websiteSourceUrl: "https://cleanall.co.bw/contact-us/",
    websiteEvidence: "First-party CleanAll website with current contact, quotation and cleaning service pages checked 13 Oct 2026.",
    emailSourceUrl: "https://cleanall.co.bw/contact-us/",
    phoneSourceUrl: "https://cleanall.co.bw/contact-us/",
    emailEvidence: "Official CleanAll contact page publishes branch emails; its contract-cleaning service page also explicitly publishes sales@cleanall.co.bw.",
    phoneEvidence: "Official CleanAll contact page lists Gaborone, Palapye and Francistown office/mobile numbers; original seed mobile retained."
  },
  "skitters-cleaning-company": {
    secondaryPhones: ["+267 71239170"],
    phoneSourceUrl: "https://www.localbotswana.com/company/14089/Skitters_Cleaning_Company",
    phoneEvidence: "The Skitters company listing publishes landline +267 3165992 and mobile +267 71239170. Listed site not yet verified live."
  },
  "clugston-group": {
    email: "info.clugston@gmail.com",
    secondaryPhones: ["+267 73870282", "+267 75024775"],
    emailSourceUrl: "https://www.localbotswana.com/company/14394/Clugston_Group",
    phoneSourceUrl: "https://www.localbotswana.com/company/14394/Clugston_Group",
    emailEvidence: "Current checked company directory listing visibly publishes info.clugston@gmail.com for the project manager and marketing executive.",
    phoneEvidence: "Published Clugston Group profile lists +267 3950067 and +267 73870282; its marketing executive contact visibly lists +267 75024775. Confirm preferred number before outreach."
  },
  "kalahari-shine": {
    email: "chris@kalaharishine.co.bw",
    secondaryPhones: ["+267 74016447"],
    emailSourceUrl: "https://www.africabizinfo.com/BW/kalahari-shine-71-493-585",
    phoneSourceUrl: "https://www.localbotswana.com/company/14002/Kalahari_Shine",
    emailEvidence: "Public company contact listing explicitly surfaces chris@kalaharishine.co.bw.",
    phoneEvidence: "Kalahari Shine business profile lists +267 71493585 and +267 74016447; earlier website entries should be rechecked before outreach."
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
    website: "https://haskinshardware.co.bw/",
    websiteSourceUrl: "https://haskinshardware.co.bw/",
    websiteEvidence: "First-party Haskins Hardware website currently publishes its Gaborone store at Plot 1216 and +267 395 1001, matching the Haskins J & Sons prospect.",
    emailSourceUrl: "https://haskinshardware.co.bw/",
    emailEvidence: "Current first-party Haskins Hardware website publishes gaborone@haskins.co.bw."
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
  },
  "major-league-security": {
    email: "admin@majorleaguesecurity.co.bw",
    secondaryPhones: ["+267 72126777"],
    emailSourceUrl: "https://jobsbotswana.info/jobs/security-guards-major-league-security/",
    phoneSourceUrl: "https://jobsbotswana.info/jobs/security-guards-major-league-security/",
    emailEvidence: "A current 2026 Major League Security recruitment notice publishes admin@majorleaguesecurity.co.bw.",
    phoneEvidence: "The same current notice publishes WhatsApp +267 72126777."
  },
  "tlk-catering": {
    email: "tlkfoodbw@gmail.com",
    secondaryPhones: ["+267 71311511", "+267 74064563", "+267 73414853"],
    emailSourceUrl: "https://www.localbotswana.com/company/14438/TLK_Botswana_Catering_Services",
    phoneSourceUrl: "https://www.localbotswana.com/company/14438/TLK_Botswana_Catering_Services",
    emailEvidence: "Verified Local Botswana employee/contact data publicly surfaces tlkfoodbw@gmail.com.",
    phoneEvidence: "Verified listing publishes the business and staff mobile contacts."
  },
  "champs-motors": {
    email: "champsautos@hotmail.com",
    phone: "+267 318 2314",
    emailSourceUrl: "https://servicemeonline.com/advert/champs-motors/",
    phoneSourceUrl: "https://servicemeonline.com/advert/champs-motors/",
    emailEvidence: "Current 2026 ServiceMe Botswana listing publishes champsautos@hotmail.com.",
    phoneEvidence: "Current ServiceMe listing publishes the workshop telephone."
  },
  "sosleepy-guest-house": {
    email: "SoSleepyBnB@outlook.com",
    phone: "+267 71429040",
    secondaryPhones: ["+267 72725620"],
    emailSourceUrl: "https://www.sesoa.co.bw/init/default/business_profile/513",
    phoneSourceUrl: "https://www.sesoa.co.bw/init/default/business_profile/513",
    emailEvidence: "Current Sesoa Botswana business profile publishes SoSleepyBnB@outlook.com.",
    phoneEvidence: "Current profile publishes telephone/cell contacts for the guest house."
  },
  "prodent-dental-clinic": {
    email: "chandfahim@gmail.com",
    phone: "+267 3904219",
    secondaryPhones: ["+267 3188028", "+267 71313000"],
    emailSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2013.pdf",
    phoneSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2013.pdf",
    emailEvidence: "Health Directory Botswana's public dental directory publishes chandfahim@gmail.com for Prodent Dental Clinic; re-check before outreach because this directory entry is older.",
    phoneEvidence: "Health Directory Botswana publishes the clinic telephone and mobile contacts."
  },
  "hall-dr-dental-surgery": {
    email: "dentalcare@gmail.com",
    phone: "+267 3184262",
    emailSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2013.pdf",
    phoneSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2013.pdf",
    emailEvidence: "Health Directory Botswana lists Dr Hall's Dental Care Clinic at the same public telephone and publishes dentalcare@gmail.com; re-check before outreach because the directory entry is older.",
    phoneEvidence: "The public Health Directory entry matches the prospect telephone."
  },
  "sikhakhane-and-company": {
    email: "hmsikhakhane@gmail.com",
    secondaryPhones: ["+267 73384246"],
    emailSourceUrl: "https://transportsite.co.za/company/674588",
    phoneSourceUrl: "https://www.localbotswana.com/company/8810/Sikhakhane_Company",
    emailEvidence: "Public Botswana business directory information publishes hmsikhakhane@gmail.com for Sikhakhane & Co.",
    phoneEvidence: "Local Botswana publishes the office and mobile contacts."
  },
  "monthe-marumo-and-company": {
    email: "partners@monthemarumo.co.bw",
    emailSourceUrl: "https://ulwazisa.com/listings/monthe-marumo-company-incorporating-molatlhegi-and-associates/",
    emailEvidence: "Current public professional listing publishes partners@monthemarumo.co.bw."
  },
  "mosele-legal-services": {
    email: "sales@mosele.co.bw",
    emailSourceUrl: "https://www.botswanayouth.com/messenger-wanted-at/",
    emailEvidence: "A public Mosele Legal Services vacancy notice publishes sales@mosele.co.bw; re-check before outreach because the notice itself is older."
  },
  "pg-glass-pty-ltd": {
    email: "richard@pgglass.co.bw",
    phone: "+267 3952901",
    secondaryPhones: ["+267 3905331", "+267 3971351", "+267 74608992"],
    emailSourceUrl: "https://servicemeonline.com/advert/pg-glass/",
    phoneSourceUrl: "https://www.pgglassafrica.com/gaborone/",
    emailEvidence: "Current 2025/2026 Botswana PG Glass listing publishes richard@pgglass.co.bw for Gaborone.",
    phoneEvidence: "PG Glass Africa's current Gaborone page publishes branch telephone contacts."
  },
  "seed-co-international-limited": {
    email: "samson.ruwisi@seedcogroup.com",
    phone: "+267 3190743",
    secondaryPhones: ["+267 3911906", "+267 3911907", "+267 72189977"],
    emailSourceUrl: "https://www.seedcogroup.com/zw/fieldcrops/wp-content/uploads/2025/08/zw-seed-2025-ar.pdf",
    phoneSourceUrl: "https://www.seedcogroup.com/zw/fieldcrops/wp-content/uploads/2025/08/zw-seed-2025-ar.pdf",
    emailEvidence: "Seed Co's 2025 annual-report contact directory publishes samson.ruwisi@seedcogroup.com for Botswana.",
    phoneEvidence: "The same company report publishes Botswana office and mobile contacts."
  },
  "prominent-paints-botswana": {
    email: "customercare@prominentpaints.co.za",
    emailSourceUrl: "https://www.prominentpaints.co.za/about-prominent-paints/",
    emailEvidence: "Prominent Paints' current public corporate site publishes customercare@prominentpaints.co.za; this is a regional brand contact rather than a Botswana-only mailbox."
  },
  "right-move-dental-clinic": {
    phone: "+267 72214295",
    secondaryPhones: ["+267 76495025", "+267 75210777"],
    phoneSourceUrl: "https://www.dentists10.com/BW/Gaborone/621216284694192/Right-Move-Dental-Clinic",
    phoneEvidence: "Current September 2026 posts publish WhatsApp/mobile numbers for bookings; no explicit public email surfaced in the same current evidence."
  },
  "doll-life": {
    phone: "+267 72767278",
    phoneSourceUrl: "https://molapocrossing.co.bw/shops",
    phoneEvidence: "Current Molapo Crossing store directory publishes the Doll Life mobile. The email is Cloudflare-obfuscated in the public page and is not stored until it can be read explicitly."
  },
  "nails-by-kelendria": {
    phone: "+267 76752926",
    phoneSourceUrl: "https://book.heygoldie.com/Nails-By-Kelendria",
    phoneEvidence: "Current booking page publishes WhatsApp +267 76752926 and says clients may also email, but the email itself is hidden behind the booking platform."
  },
  "dr-bp-mariri": {
    email: "bmariri@yahoo.com",
    emailSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2014.pdf",
    emailEvidence: "Health Directory Botswana publishes bmariri@yahoo.com for Dr B. P. Mariri; re-check before outreach because the directory record is older."
  },
  "dr-rp-matthews": {
    email: "rebamats@vbn.co.bw",
    secondaryPhones: ["+267 71313065"],
    emailSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2013.pdf",
    phoneSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2013.pdf",
    emailEvidence: "Health Directory Botswana publishes rebamats@vbn.co.bw for Dr Reba Matthews / Denmed; re-check before outreach because the directory record is older.",
    phoneEvidence: "The same directory record matches the public Denmed telephone and lists a mobile."
  },
  "maxi-save-hardware": {
    email: "maxi@maxisave.bw",
    secondaryPhones: [],
    emailSourceUrl: "https://pricemate.info/shops/%40maxisave",
    phoneSourceUrl: "https://www.africabizinfo.com/BW/maxi-save-hardware-store_1K-392-4539",
    emailEvidence: "Current public MAXI SAVE shop listing publishes maxi@maxisave.bw.",
    phoneEvidence: "Current public business listing publishes the Gaborone store telephone numbers."
  },
  "ae-group": {
    email: "aegroupbotswana@gmail.com",
    secondaryPhones: ["+267 72415736"],
    emailSourceUrl: "https://www.foodyas.com/BW/Unknown/168621073240136/AE-Group",
    phoneSourceUrl: "https://www.localbotswana.com/company/14097/AE_GROUP_PTY_LTD",
    emailEvidence: "A current 2026 AE Group public recruitment post publishes aegroupbotswana@gmail.com.",
    phoneEvidence: "Current public business listing publishes the main and secondary mobile numbers."
  },
  "rehoboth-guest-house": {
    email: "rehoboth@it.bw",
    secondaryPhones: ["+267 71667171"],
    emailSourceUrl: "https://governmentdirectree.com/business-directory/6396/rehoboth-guest-house/",
    phoneSourceUrl: "https://governmentdirectree.com/business-directory/6396/rehoboth-guest-house/",
    emailEvidence: "Botswana business directory information publishes rehoboth@it.bw for the Gaborone guest house.",
    phoneEvidence: "The same Botswana listing publishes the landline and mobile contact."
  },
  "luxury-inn": {
    email: "info@luxuryinn.co.bw",
    emailSourceUrl: "https://www.botswanatourism.co.bw/sites/default/files/2025-08/Accomodation%20Directory%202024%20-%202025.pdf",
    phoneSourceUrl: "https://www.botswanatourism.co.bw/sites/default/files/2025-08/Accomodation%20Directory%202024%20-%202025.pdf",
    emailEvidence: "Botswana Tourism Organisation's 2024-2025 accommodation directory publishes info@luxuryinn.co.bw.",
    phoneEvidence: "The same Botswana Tourism listing publishes +267 3928500."
  },
  "floodlight-security-pty-ltd": {
    email: "Floodlightsec.bw@gmail.com",
    emailSourceUrl: "https://www.callupcontact.com/b/businessprofile/Floodlight_Security/6888014",
    phoneSourceUrl: "https://www.localbotswana.com/company/14168/FLOODLIGHT_SECURITY_PTY_LTD",
    emailEvidence: "Public Floodlight Security business information publishes Floodlightsec.bw@gmail.com.",
    phoneEvidence: "Current verified Botswana directory listing publishes +267 74 051 437."
  },
  "pelican-moving-company": {
    email: "enquiries@pelican.co.bw",
    secondaryEmails: ["humanresources@pelican.co.bw"],
    phone: "+267 3161342",
    secondaryPhones: ["+267 76497618"],
    emailSourceUrl: "https://pelican.co.bw/contact/",
    phoneSourceUrl: "https://pelican.co.bw/contact/",
    emailEvidence: "Pelican Moving Company's current public website publishes enquiries@pelican.co.bw; its current LinkedIn recruitment posts also publish humanresources@pelican.co.bw.",
    phoneEvidence: "Pelican's current website publishes its head-office telephone and WhatsApp contact."
  },
  "pula-dental-clinic": {
    email: "rkgwaneng@yahoo.com",
    secondaryEmails: ["rmokubung@brobemail.co.bw"],
    secondaryPhones: ["+267 71704624", "+267 72338223"],
    emailSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2014.pdf",
    phoneSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2014.pdf",
    emailEvidence: "Health Directory Botswana's public Pula Dental entries publish rkgwaneng@yahoo.com and rmokubung@brobemail.co.bw; re-check before outreach because the directory contact is older.",
    phoneEvidence: "The public Health Directory lists the clinic landline and practitioner mobile contacts."
  },
  "kagiso-dental-clinic": {
    email: "brightonbk@hotmail.com",
    secondaryPhones: ["+267 71200994"],
    emailSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2018W.pdf",
    phoneSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2018W.pdf",
    emailEvidence: "Health Directory Botswana publishes brightonbk@hotmail.com for Kagiso Dental Clinic.",
    phoneEvidence: "The same public directory publishes the Palapye landline and mobile contact."
  },
  "elite-dental-clinic": {
    email: "edcsurgeon@gmail.com",
    secondaryPhones: ["+267 76815797"],
    emailSourceUrl: "https://www.sesoa.co.bw/init/default/business_profile/528",
    phoneSourceUrl: "https://www.sesoa.co.bw/init/default/business_profile/528",
    emailEvidence: "Current Sesoa Botswana business profile publishes edcsurgeon@gmail.com.",
    phoneEvidence: "Current Sesoa Botswana profile publishes the clinic landline and mobile."
  },
  "bdo-botswana": {
    email: "plombard@bdo.bw",
    secondaryEmails: ["rlombard@bdo.bw"],
    emailSourceUrl: "https://www.bdo.bw/en-gb/our-people/philip-lombard",
    phoneSourceUrl: "https://www.bdo.bw/en-gb/our-people/philip-lombard",
    emailEvidence: "BDO Botswana's current public leadership page publishes CEO Philip Lombard's business email.",
    phoneEvidence: "BDO Botswana's current public leadership page publishes +267 390 2779."
  },
  "ernst-and-young-botswana": {
    email: "Laura.Alfred@za.ey.com",
    secondaryEmails: ["ebotswana@za.ey.com"],
    emailSourceUrl: "https://jobsbotswana.info/jobs/senior-tax-consultants-transfer-pricing-tax-advisory-ernst-young-ey-botswana/",
    emailEvidence: "A current 2026 EY Botswana public recruitment notice publishes Laura.Alfred@za.ey.com; an older Botswana Gazette EY notice publishes ebotswana@za.ey.com. These are recruitment/public contacts, not necessarily general sales mailboxes."
  },
  "postnet-head-office": {
    email: "carbocentre@postnet.co.bw",
    phone: "+267 77561327",
    emailSourceUrl: "https://www.postnet.co.za/stores/carbocentre",
    phoneSourceUrl: "https://www.postnet.co.za/stores/carbocentre",
    emailEvidence: "PostNet's current public Botswana store page publishes carbocentre@postnet.co.bw. This is a Gaborone branch mailbox rather than a confirmed national head-office email.",
    phoneEvidence: "The same current store page publishes +267 77 561 327."
  },
  "pinnacle-express-couriers": {
    email: "delia@trans-kalahari.com",
    emailSourceUrl: "https://businesspages.co.za/company/76720236",
    phoneSourceUrl: "https://trans-kalahari.com/",
    emailEvidence: "A public business directory for the same Trans-Kalahari/Pinnacle Express company domain publishes delia@trans-kalahari.com; re-check before outreach.",
    phoneEvidence: "The company's public website surfaces the Gaborone branch telephone."
  },
  "print-elite": {
    phone: "+267 71733727",
    secondaryPhones: ["+267 74617779"],
    phoneSourceUrl: "https://www.localbotswana.com/company/13873/PRINT_ELITE_PTY_LTD",
    phoneEvidence: "Current verified Local Botswana listing publishes the office/mobile contacts."
  },
  "piashi-security-services": {
    secondaryPhones: ["+267 72265321", "+267 77067648"],
    phoneSourceUrl: "https://www.localbotswana.com/company/14301/Piashi_Security_Services",
    phoneEvidence: "Current verified Local Botswana listing publishes two public mobile contacts."
  },
  "winners-security-services": {
    secondaryPhones: ["+267 71621873"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana business listing surfaces an additional public mobile contact."
  },
  "primehaven": {
    secondaryPhones: ["+267 76088823"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana animal-feed/business listing surfaces an additional public mobile."
  },
  "acquazzone-pty-ltd": {
    secondaryPhones: ["+267 75894848"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana water-business listing surfaces an additional public mobile."
  },
  "vyna-holdings-pty-ltd-letlodi-purified-water": {
    secondaryPhones: ["+267 74379126"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana water-business listing surfaces an additional public mobile contact."
  },
  "rahim-khan-and-company": {
    email: "arkhan@rahimkhan.co.bw",
    secondaryEmails: ["info@rahimkhan.co.bw"],
    phone: "+267 3188988",
    secondaryPhones: ["+267 3188989", "+267 71300270"],
    emailSourceUrl: "https://dailynews.gov.bw/common_up/dailynews/dailynews_pdf/28-11-2025_11-12-20_1764321140_dailynews_pdf.pdf",
    phoneSourceUrl: "https://dailynews.gov.bw/common_up/dailynews/dailynews_pdf/28-11-2025_11-12-20_1764321140_dailynews_pdf.pdf",
    emailEvidence: "A 2025 Botswana Daily News legal notice publishes arkhan@rahimkhan.co.bw; a public 2023 recruitment notice also publishes info@rahimkhan.co.bw.",
    phoneEvidence: "The 2025 legal notice publishes the firm's Gaborone telephone contacts."
  },
  "hardpro": {
    email: "info@hardpro.biz",
    secondaryEmails: ["sales@hardpro.biz", "bchilisa@hardpro.biz"],
    phone: "+267 3909213",
    emailSourceUrl: "https://hardpro.biz/index.php/en/about",
    phoneSourceUrl: "https://hardpro.biz/index.php/en/about",
    emailEvidence: "HardPro's current public site and current 2026 business posts publish info@hardpro.biz and sales@hardpro.biz; a 2026 recruitment notice publishes bchilisa@hardpro.biz.",
    phoneEvidence: "HardPro's current public site publishes +267 390 9213."
  },
  "mivani": {
    email: "sales@mivani.co.bw",
    secondaryPhones: ["+267 76370995"],
    emailSourceUrl: "https://servicemeonline.com/advert/mivani/",
    phoneSourceUrl: "https://servicemeonline.com/advert/mivani/",
    emailEvidence: "A current 2026 Botswana ServiceMe listing publishes sales@mivani.co.bw.",
    phoneEvidence: "The current listing publishes +267 76 370 995 as a business contact."
  },
  "barloworld-motor-francistown": {
    email: "terryp@barloworld.co.bw",
    emailSourceUrl: "https://www.callupcontact.com/b/business/Barloworld_Motor/79201",
    phoneSourceUrl: "https://www.localbotswana.com/company/2196/Barloworld_Motor",
    emailEvidence: "A public Botswana Barloworld Motor business listing publishes terryp@barloworld.co.bw. Treat this as a Botswana brand contact rather than a Francistown-only mailbox and re-check before outreach.",
    phoneEvidence: "The verified Francistown listing publishes +267 241 2323 and +267 241 2324."
  },
  "olithas-funeral": {
    phone: "+267 71625639",
    phoneSourceUrl: "https://bobstandards.bw/wp-content/uploads/2022/05/Supplier-Directory-Consolidated.pdf",
    phoneEvidence: "A public Botswana supplier directory lists Olitha's Funeral Parlour with mobile +267 71625639. The source is older, so re-check before outreach."
  },
  "auto-and-general-supplies": {
    email: "partssales@autoandgeneral.co.bw",
    phone: "+267 3909399",
    secondaryPhones: ["+267 3905979", "+267 3190151", "+267 76128894"],
    emailSourceUrl: "https://www.autoandgeneral.co.bw/",
    phoneSourceUrl: "https://www.autoandgeneral.co.bw/",
    emailEvidence: "Auto & General Supplies' current public website publishes partssales@autoandgeneral.co.bw.",
    phoneEvidence: "The current website publishes parts, windscreens and WhatsApp contact numbers."
  },
  "sadc-lawyers-association": {
    email: "info@sadcla.org",
    secondaryEmails: ["sadclawyers@gmail.com", "sadclawyers@info.bw"],
    emailSourceUrl: "https://sadcla.org/resources/SADCLA-Report-ACDEG-24.pdf",
    phoneSourceUrl: "https://achpr.au.int/en/ngos/southern-african-development-community-sadc-lawyers-association",
    emailEvidence: "SADC Lawyers Association public materials publish info@sadcla.org; AU/ACPHR records also publish sadclawyers@info.bw, and a public association event contact publishes sadclawyers@gmail.com.",
    phoneEvidence: "Public regional and Botswana association records publish organisation contact numbers."
  },
  "lady-vanessa": {
    phone: "+267 74155000",
    secondaryPhones: ["+267 3911721", "+267 3180141"],
    phoneSourceUrl: "https://www.beautynailhairsalons.com/BW/Gaborone/168849013313285/Lady-Vanessa-Hair-Studio",
    phoneEvidence: "Current 2026 Lady Vanessa business posts and Airport Junction directory information publish +267 74 155 000 and +267 391 1721."
  },
  "mmagabo-cleaning-services": {
    website: "https://mmagabocleaning.weebly.com/",
    websiteSourceUrl: "https://mmagabocleaning.weebly.com/",
    websiteEvidence: "Company-branded MmaGABO Cleaning Services site located on Weebly, describing domestic, industrial and commercial cleaning; website presence confirmed but publication date and current trading activity unverified.",
    phone: "+267 3187789",
    secondaryPhones: ["+267 71334955", "+267 72654293", "+267 72540202"],
    phoneSourceUrl: "https://www.localbotswana.com/company/8912/MmaGABO_Cleaning_Services",
    phoneEvidence: "Current Botswana business directory information publishes the landline plus three business mobile contacts."
  },
  "nick-laundry-and-cleaning-services": {
    phone: "+267 76209454",
    secondaryPhones: ["+267 71615327", "+267 71481583", "+267 75300712"],
    phoneSourceUrl: "https://www.localbotswana.com/companies/services",
    phoneEvidence: "Current verified Botswana business listing publishes multiple public mobile contacts for Nick Laundry & Cleaning Services."
  },
  "fargreen-pty-ltd": {
    phone: "+267 72221556",
    secondaryPhones: ["+267 76853932"],
    phoneSourceUrl: "https://www.localbotswana.com/company/15184/FARGREEN_PTY_LTD",
    phoneEvidence: "Current Botswana business listing publishes both public mobile contacts."
  },
  "hardware-emporium-bk": {
    phone: "+267 3913299",
    secondaryPhones: ["+267 3916461"],
    phoneSourceUrl: "https://www.equipment10.com/BW/Gaborone/108026601674947/Hardware-Emporium",
    phoneEvidence: "Current 2026 Hardware Emporium business posts publish its Broadhurst and Old Lobatse Road contacts."
  },
  "gaborone-hardware": {
    phone: "+267 3952611",
    secondaryPhones: ["+267 3914474"],
    phoneSourceUrl: "https://www.localbotswana.com/company/4991/Gaborone_Hardware",
    phoneEvidence: "Public Botswana directory information publishes both Gaborone Hardware telephone numbers."
  },
  "micro-peripheral-systems": {
    phone: "+267 3186504",
    secondaryPhones: ["+267 3956677", "+267 72105083"],
    phoneSourceUrl: "https://www.localbotswana.com/company/4331/Micro_Peripheral_Systems",
    phoneEvidence: "Public Botswana directory information publishes two office numbers and a mobile contact."
  },
  "westside-motors": {
    phone: "+267 3186702",
    secondaryPhones: ["+267 3956515", "+267 72881016"],
    phoneSourceUrl: "https://www.localbotswana.com/company/2223/Westside_Motors",
    phoneEvidence: "Current verified Botswana business listing publishes two telephone contacts and a mobile number."
  },
  "phomolong-guest-house": {
    phone: "+267 3971579",
    secondaryPhones: ["+267 71312782", "+267 73095757"],
    phoneSourceUrl: "https://dailynews.gov.bw/common_up/dailynews/dailynews_pdf/19-09-2022_07-47-20_1663566440_dailynews_pdf.pdf",
    phoneEvidence: "Botswana Daily News accommodation advertising publishes the business telephone plus two mobile booking contacts; re-check before outreach because this advertisement is older."
  },
  "dr-tau-dental-spa": {
    phone: "+267 3133600",
    secondaryPhones: ["+267 71241370"],
    phoneSourceUrl: "https://www.localbotswana.com/company/13983/Dr_Tau_Dental_Spa",
    phoneEvidence: "Public Botswana dental listing publishes the clinic telephone and mobile."
  },
  "st-john-s-dental-clinic": {
    secondaryPhones: ["+267 71621554"],
    phoneSourceUrl: "https://www.localbotswana.com/category/Dentists",
    phoneEvidence: "Current Botswana dental directory results surface an additional mobile contact for St John's Dental Clinic."
  },
  "uniseal-construction-chemicals": {
    secondaryPhones: ["+267 76522252"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current verified Botswana business listing surfaces an additional mobile contact."
  },
  "afrodizzia-salon": {
    secondaryPhones: ["+267 72110888"],
    phoneSourceUrl: "https://www.localbotswana.com/category/Hairdressers/city%3AGaborone",
    phoneEvidence: "Current Botswana salon directory/search information surfaces an additional mobile contact."
  },
  "thr-holdings-pty-ltd": {
    secondaryPhones: ["+267 77704414"],
    phoneSourceUrl: "https://www.localbotswana.com/category/Hairdressers/city%3AGaborone",
    phoneEvidence: "Current Botswana directory information surfaces an additional public mobile contact."
  },
  "ross-breeders-botswana-pty-ltd": {
    email: "hr@rossafrica.com",
    phone: "+267 3161629",
    emailSourceUrl: "https://www.rossafrica.com/",
    phoneSourceUrl: "https://www.localbotswana.com/",
    emailEvidence: "Current 2026 Ross/Nutri Feeds Botswana recruitment notices publish hr@rossafrica.com. This is a public recruitment contact, so re-check suitability before sales outreach.",
    phoneEvidence: "Current Botswana business listings publish +267 316 1629."
  },
  "exigency-grills": {
    phone: "+267 3931777",
    secondaryPhones: ["+267 74576543"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana business listing publishes the business telephone and mobile."
  },
  "ranjit-creations": {
    phone: "+267 3117212",
    secondaryPhones: ["+267 74704319"],
    phoneSourceUrl: "https://government.co.bw/company/7100887",
    phoneEvidence: "Public Botswana business directory lists office +267 3117212 and mobile +267 74704319; the firm advertises cleaning, catering and detergent manufacturing."
  },
  "leinad-holdings": {
    phone: "+267 76188600",
    secondaryPhones: ["+267 76687137"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana business listing publishes two public mobile contacts."
  },
  "ndlovu-moitshepi-and-co": {
    phone: "+267 3911716",
    secondaryPhones: ["+267 76610460"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana legal directory listing publishes the office telephone and a mobile."
  },
  "matlala-attorneys": {
    phone: "+267 3937681",
    secondaryPhones: ["+267 71243189"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana legal directory listing publishes the office telephone and mobile."
  },
  "manyothwane-and-partners": {
    phone: "+267 2416745",
    secondaryPhones: ["+267 71846378"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana legal directory listing publishes the Francistown telephone and mobile."
  },
  "oarabile-pitso-attorneys": {
    phone: "+267 3187529",
    secondaryPhones: ["+267 73509878"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana legal directory information publishes the office telephone and mobile."
  },
  "mosate-and-associates": {
    phone: "+267 3907234",
    secondaryPhones: ["+267 3181081", "+267 3913888", "+267 74979374"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana legal-directory sources surface multiple public office/mobile contacts; re-check which line is preferred before outreach."
  },
  "zone-land-proprietary-limited": {
    phone: "+267 3111141",
    secondaryPhones: ["+267 73026055"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana printing-business listing publishes the office telephone and mobile."
  },
  "bush-mills-pty-ltd-t-a-rachi-enterprises": {
    phone: "+267 3938583",
    secondaryPhones: ["+267 3161707", "+267 3182987"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana hardware/business directory information publishes multiple office contacts."
  },
  "security-fencing-botswana-pty-ltd": {
    phone: "+267 3938659",
    secondaryPhones: ["+267 72330779"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana security directory listing publishes the office telephone and mobile."
  },
  "datadot-products-gaborone": {
    phone: "+267 72686791",
    secondaryPhones: ["+267 74037620"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current Botswana security/business listing publishes two public mobile contacts."
  },
  "preffered-one-pty-ltd": {
    phone: "+267 71882717",
    secondaryPhones: ["+267 71775580", "+267 71276357"],
    phoneSourceUrl: "https://www.localbotswana.com/",
    phoneEvidence: "Current verified Botswana logistics listing publishes +267 71882717 and +267 71775580; the older seed number is retained as an alternate."
  }
};
