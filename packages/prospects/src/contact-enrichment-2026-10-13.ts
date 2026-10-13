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
,
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
  }
,
  "elite-dental-clinic": {
    email: "edcsurgeon@gmail.com",
    phone: "+267 4924730",
    secondaryPhones: ["+267 76815797"],
    emailSourceUrl: "https://www.sesoa.co.bw/init/default/business_profile/528",
    phoneSourceUrl: "https://www.sesoa.co.bw/init/default/business_profile/528",
    emailEvidence: "Current Sesoa Botswana business profile publishes edcsurgeon@gmail.com for Elite Dental Clinic.",
    phoneEvidence: "Current Sesoa profile publishes the clinic telephone and mobile."
  },
  "luxury-inn": {
    email: "info@luxuryinn.co.bw",
    phone: "+267 3928500",
    emailSourceUrl: "https://www.botswanatourism.co.bw/sites/default/files/2025-08/Accomodation%20Directory%202024%20-%202025.pdf",
    phoneSourceUrl: "https://www.botswanatourism.co.bw/sites/default/files/2025-08/Accomodation%20Directory%202024%20-%202025.pdf",
    emailEvidence: "Botswana Tourism Organisation accommodation directory publishes info@luxuryinn.co.bw.",
    phoneEvidence: "Botswana Tourism Organisation directory publishes the Luxury Inn booking telephone."
  },
  "rehoboth-guest-house": {
    email: "rehoboth@it.bw",
    phone: "+267 3953780",
    secondaryPhones: ["+267 71667171"],
    emailSourceUrl: "https://governmentdirectree.com/business-directory/6396/rehoboth-guest-house/",
    phoneSourceUrl: "https://governmentdirectree.com/business-directory/6396/rehoboth-guest-house/",
    emailEvidence: "Botswana Government Directree business listing publishes rehoboth@it.bw for the Gaborone Rehoboth Guest House.",
    phoneEvidence: "The same Botswana listing publishes the telephone and mobile."
  },
  "pula-dental-clinic": {
    email: "rkgwaneng@yahoo.com",
    phone: "+267 3170630",
    secondaryPhones: ["+267 71704624"],
    emailSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2014.pdf",
    phoneSourceUrl: "https://hdb.co.bw/wp-content/uploads/2021/04/Health-directory-2014.pdf",
    emailEvidence: "Health Directory Botswana publishes rkgwaneng@yahoo.com for a Pula Dental Clinic practitioner at the same BBS Mall practice; re-check before outreach because the directory record is older.",
    phoneEvidence: "The directory record matches Pula Dental Clinic's public BBS Mall telephone and lists a mobile."
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
  }

};
