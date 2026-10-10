export const pharmacyPublicServices = [
  {
    slug:"prescriptions",
    title:"Prescription Care",
    summary:"A clear route to request a refill, ask about a prescription and choose pickup or delivery.",
    items:["Prescription refill requests","Prescription transfer enquiries","Pickup / delivery preferences","Pharmacist verification before dispensing"]
  },
  {
    slug:"pharmacist-support",
    title:"Ask a Pharmacist",
    summary:"Give customers a direct route to medication-use questions and pharmacy support without pretending the website is a diagnostic service.",
    items:["Medication-use questions","General pharmacy advice","Referral to clinician where appropriate","Confidential pharmacy support"]
  },
  {
    slug:"health-services",
    title:"Health Services",
    summary:"Present verified pharmacy-based services clearly, with appointment or walk-in information where applicable.",
    items:["Blood-pressure checks","Vaccination services where licensed","Wellness support","Chronic-care support"]
  },
  {
    slug:"delivery",
    title:"Pickup & Delivery",
    summary:"Make collection windows, delivery zones and order status understandable before a customer calls.",
    items:["Branch pickup","Local delivery","Delivery-zone guidance","Order-ready notifications"]
  }
];

export const pharmacyHealthCategories = [
  {title:"Everyday wellness",text:"OTC and wellness categories can be browsed without turning the public site into a prescription-drug marketplace."},
  {title:"Family health",text:"Simple family-health categories, baby/child essentials and routine pharmacy support."},
  {title:"Travel & prevention",text:"Verified travel-health and vaccination services where the pharmacy is licensed to provide them."},
  {title:"Chronic-care support",text:"Refill reminders, pharmacist counselling and continuity support for patients already under appropriate clinical care."}
];

export const pharmacyBranches = [
  {name:"Gaborone Central",address:"Concept branch · Gaborone",lat:-24.6282,lng:25.9231,hours:"Mon–Fri 08:00–18:30 · Sat 08:00–15:00"},
  {name:"Mogoditshane",address:"Concept branch · Mogoditshane",lat:-24.6269,lng:25.8654,hours:"Mon–Fri 09:00–18:00 · Sat 09:00–14:00"}
];

export const pharmacyResources = [
  {
    title:"BoMRA",
    text:"Official Botswana medicines-regulatory information and current medicine/device regulations.",
    href:"https://www.bomra.co.bw/"
  },
  {
    title:"Find current medicine regulations",
    text:"Use BoMRA's current publications for medicine and pharmacy regulatory requirements rather than relying on static website copy.",
    href:"https://www.bomra.co.bw/home-bomra-3/"
  }
];

export function pharmaClientQuery(clientName:string){
  return "?client="+encodeURIComponent(clientName);
}
