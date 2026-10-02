export const clinicCareAreas = [
  {
    slug:"general-care",
    title:"General & Family Care",
    summary:"Everyday primary-care consultations, follow-up visits and continuity of care.",
    reasons:["General consultation","Routine follow-up","Preventive care discussion","Referral / care coordination"]
  },
  {
    slug:"womens-health",
    title:"Women's Health",
    summary:"A clear starting point for routine women's-health consultations and follow-up care.",
    reasons:["Women's health consultation","Routine review","Follow-up visit","Referral / care coordination"]
  },
  {
    slug:"child-family",
    title:"Child & Family",
    summary:"Family-oriented care pathways that make booking and visit preparation straightforward.",
    reasons:["Child consultation","Routine review","Follow-up","Family health discussion"]
  },
  {
    slug:"chronic-followup",
    title:"Chronic-care Follow-up",
    summary:"Structured follow-up for patients already under care who need review and continuity.",
    reasons:["Scheduled review","Medication review with clinician","Results follow-up","Care-plan discussion"]
  }
];

export const clinicTeam = [
  {
    name:"Dr Naledi Kgosidintsi",
    role:"Concept General Practitioner",
    focus:"Family medicine · primary care · continuity",
    bio:"A sample clinician profile showing how qualifications, areas of care, languages and availability can be presented clearly.",
    image:"https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&dpr=1&h=900&w=900",
    source:"https://www.pexels.com/photo/portrait-of-a-doctor-5452201/"
  },
  {
    name:"Dr Kabelo Moagi",
    role:"Concept Medical Practitioner",
    focus:"General medicine · follow-up care",
    bio:"A second demonstration profile. A production site should publish only verified registration, qualifications and practice scope.",
    image:"https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&dpr=1&h=900&w=900",
    source:"https://www.pexels.com/photo/man-wearing-a-white-coat-5327585/"
  }
];

export const patientResources = [
  {title:"Preparing for your first visit",summary:"What to bring, how early to arrive and what information can help the clinician prepare."},
  {title:"Understanding appointment types",summary:"A simple explanation of consultation, follow-up and review appointments."},
  {title:"After your visit",summary:"How follow-up instructions, referrals, results and future appointments can be handled."}
];

export function clinicClientQuery(clientName:string){
  return "?client="+encodeURIComponent(clientName);
}
