// Public company-service evidence. These are not guaranteed live offerings:
// confirm with the business before sales outreach and before publishing a real site.
// Names must match the service catalogue in CleanCareClientSite.
export type CleaningServiceRecord = {
  services: string[];
  sourceUrl: string;
  evidence: string;
};
export const cleaningServiceMenus: Record<string, CleaningServiceRecord> = {
  "cleantek-pty-ltd": {
    services: ["Office cleaning", "Commercial cleaning", "Deep cleaning", "Post-construction cleaning", "Window cleaning", "Hygiene services", "Contract cleaning", "Industrial / specialised cleaning"],
    sourceUrl: "https://www.cleantek.co.bw/our-services",
    evidence: "Official CleanTek service pages describe contract/commercial, industrial, hygiene, window/high-level and post-construction cleaning."
  },
  "cleanall-services": {
    services: ["Residential cleaning", "Commercial cleaning", "Deep cleaning", "Move-in cleaning", "Move-out cleaning", "Carpet cleaning", "Upholstery cleaning", "Window cleaning", "Contract cleaning", "Hygiene services"],
    sourceUrl: "https://cleanall.co.bw/service/once-off-services/",
    evidence: "CleanAll official services page lists residential, move-in/out, carpet, upholstery, window and renovation cleaning; its other service pages list contracts and hygiene."
  },
  "kalahari-shine": {
    services: ["Window cleaning", "Post-construction cleaning"],
    sourceUrl: "https://maps.prodafrica.com/places/botswana/south-east-district/gaborone/facility-services/kalaharishine/",
    evidence: "Current public service listing describes residential, commercial, storefront, high-rise and post-construction window cleaning; narrow the public demo to window services."
  },
  "skitters-cleaning-company": {
    services: ["Office cleaning", "Commercial cleaning", "Move-out cleaning", "Contract cleaning"],
    sourceUrl: "https://www.localbotswana.com/company/14089/Skitters_Cleaning_Company",
    evidence: "Published Skitters company profile lists office contractual cleaning, end-of-tenancy cleaning and refuse collection."
  },
  "iclean-botswana": {
    services: ["Residential cleaning", "Commercial cleaning", "Post-construction cleaning", "Carpet cleaning", "Window cleaning", "Deep cleaning", "Contract cleaning"],
    sourceUrl: "https://www.localbotswana.com/company/15170/iClean_Botswana",
    evidence: "Directory-listed services; profile last updated in 2020, so re-confirm the menu before outreach."
  },
  "mmagabo-cleaning-services": {
    services: ["Residential cleaning", "Office cleaning", "Carpet cleaning", "Upholstery cleaning", "Contract cleaning"],
    sourceUrl: "https://www.localbotswana.com/company/8912/MmaGABO_Cleaning_Services",
    evidence: "Published directory entry describes sofas, carpets, mattresses, domestic and office contract cleaning; re-confirm older claims."
  },
  "fargreen-pty-ltd": {
    services: ["Office cleaning", "Carpet cleaning", "Window cleaning", "Hygiene services"],
    sourceUrl: "https://www.localbotswana.com/company/15184/FARGREEN_PTY_LTD",
    evidence: "Directory profile lists office, window and carpet cleaning and sanitary-waste services. Business also offers other unrelated services."
  }
};
