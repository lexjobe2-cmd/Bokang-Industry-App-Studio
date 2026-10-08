import type { FormCategory, FormField, FormSection, FormTemplate } from "./assurance-forms.ts";
import {defaultRiskMatrix,scoreRisk,type RiskAnswer} from "./risk-matrix.ts";

/** Backend-neutral data dictionary. Field keys are stable for template versioning. */
export const ASSURANCE_STORAGE={
 templates:"bokang-studio.move-track.custom-templates.v1",
 organizations:"bokang-studio.move-track.organizations.v1",
 directory:"bokang-studio.move-track.directory.v1",
 jras:"bokang-studio.move-track.custom-jras.v1",
} as const;
export const dictionary={
 categories:["Fleet","Safety","Meetings","Risk","Handover","Inspections"] as const,
 sources:["MANUAL","MICROSOFT_365","CSV_IMPORT","LOCAL_DEMO"] as const,
 inputTypes:[
 {id:"text",label:"Short text",purpose:"Names, permit numbers, workplace"},
 {id:"multiline",label:"Long text",purpose:"Incident details, action descriptions"},
 {id:"number",label:"Number",purpose:"Engine hours, people count, meter reading"},
 {id:"date",label:"Date",purpose:"Inspection expiry, briefing date"},
 {id:"datetime",label:"Date and time",purpose:"Job start, event timestamp"},
 {id:"select",label:"Single choice",purpose:"Shift, department, severity"},
 {id:"multiselect",label:"Multiple choice",purpose:"Hazards, PPE, controls"},
 {id:"yes_no",label:"Yes / No",purpose:"Confirm permits, attendance, briefings"},
 {id:"pass_fail_na",label:"Pass / Fail / N/A",purpose:"Equipment safety inspection"},
 {id:"risk",label:"5 × 5 risk",purpose:"Likelihood × consequence"},
 {id:"repeat",label:"Repeating register",purpose:"People, task steps, actions"},
 {id:"signature",label:"Signature placeholder",purpose:"Supervisor sign-off (demo only)"},
 {id:"photo",label:"Photo placeholder",purpose:"Inspections (offline demo)"}
 ] as const,
 jobTypes:["Routine operations","Non-routine work","Planned maintenance","Breakdown maintenance","Lifting operation","Working at height","Confined space","Electrical isolation","Excavation","Haulage and trucking","Hot work","Environmental control","Emergency response","Other"] as const,
 hierarchyOfControls:["Eliminate","Substitute","Engineering","Administrative","PPE"] as const,
 hazardCategories:["Vehicle interaction","Fall from height","Dropped objects","Stored energy / LOTO","Electrical exposure","Fire / explosion","Pressure systems","Moving machinery","Confined space / oxygen","Chemical exposure","Dust and silica","Noise and vibration","Heat / fatigue","Manual handling","Slips, trips and falls","Environmental spill","Structural instability","Biological hazard","Other"] as const,
 ppe:["Hard hat","Safety glasses","High-visibility vest","Safety footwear","Gloves","Hearing protection","Respirator","Fall arrest","Face shield","Welding protection","Other"] as const,
 jobRoles:["Supervisor","Job leader","Operator","Maintenance technician","SHE officer","Permit issuer","Fire watch","Spotter","Contractor","Observer","Approver","Participant"] as const,
 reviewStatuses:["DRAFT","IN_REVIEW","REVIEW_REQUIRED","APPROVED_DEMO","CLOSED"] as const
};
export type DirectorySource=(typeof dictionary.sources)[number];
export type OrganizationProfile={
 id:string; name:string; domain:string; businessUnit:string; siteIds:string[];
 accent:string; logoDataUrl?:string; logoName?:string;
 documentPrefix:string; footer:string; ownerIds:string[];
 source:DirectorySource; updatedAt:string;
};
export type PersonRecord={
 id:string; externalId?:string; source:DirectorySource; orgId:string;
 displayName:string; email:string; department:string; jobTitle:string; location:string;
 employeeNumber?:string; active:boolean;
};
export type ParticipantAssignment={
 personId:string; nameSnapshot:string; role:string; acknowledged:boolean; manual:boolean; acknowledgedAt?:string;
};
export type HazardEntry={
 id:string; category:string; hazard:string; consequence:string; exposedPersonIds:string[];
 controls:Array<{id:string;hierarchy:string;description:string;ownerId?:string;verified:boolean}>;
 initial:RiskAnswer; residual:RiskAnswer;
};
export type JraTask={
 id:string; sequence:number; description:string; equipment:string[]; permitRequired:string[];
 hazards:HazardEntry[];
};
export type JraDecision="INCOMPLETE"|"REVIEW_REQUIRED"|"READY_FOR_DEMO_REVIEW";
export type JobRiskAssessment={
 id:string; orgId:string; companyNameSnapshot:string; logoSnapshot?:string;
 reference:string; title:string; jobType:string; jobId:string; siteId:string; location:string;
 startDate:string; endDate:string; supervisorId:string;
 revision:number; createdAt:string; updatedAt:string;
 status:"DRAFT"|"IN_REVIEW"|"REVIEW_REQUIRED"|"APPROVED_DEMO"|"CLOSED";
 participants:ParticipantAssignment[]; tasks:JraTask[];
 scope:string; method:string; ppe:string[]; emergencyPlan:string; permits:string[];
 reviewerId:string; reviewerNote:string; reviewedAt?:string;
};
export type CustomTemplate = FormTemplate & {
 organizationId:string; companyNameSnapshot:string; logoSnapshot?:string; accent?:string;
 referencePrefix:string; description:string; documentType:"GENERAL"|"JRA";
 jobId?:string; createdAt:string; updatedAt:string;
};
export type GraphUser={
 id:string;displayName?:string|null;mail?:string|null;userPrincipalName?:string|null;
 jobTitle?:string|null;department?:string|null;officeLocation?:string|null;employeeId?:string|null;
 accountEnabled?:boolean|null;
};
export type GraphOrganization={id:string;displayName?:string|null;verifiedDomains?:Array<{name?:string;isDefault?:boolean}>};
export const GRAPH_DIRECTORY_ROUTES={
 users:"/v1.0/users?$select=id,displayName,mail,userPrincipalName,jobTitle,department,officeLocation,employeeId,accountEnabled&$top=100",
 organization:"/v1.0/organization?$select=id,displayName,verifiedDomains",
 branding:"/v1.0/organization/{organizationId}/branding",
} as const;
/** No Graph network calls here. A future authenticated server adapter will map each page via this function. */
export function mapGraphUser(user:GraphUser,orgId:string):PersonRecord{
 if(!user.id||!(user.displayName||user.userPrincipalName))throw new Error("Invalid Microsoft directory person");
 return {id:"m365:"+user.id,externalId:user.id,source:"MICROSOFT_365",orgId,
  displayName:(user.displayName||user.userPrincipalName||"Unknown").trim(),
  email:(user.mail||user.userPrincipalName||"").trim(),
  department:user.department||"",jobTitle:user.jobTitle||"",location:user.officeLocation||"",
  employeeNumber:user.employeeId||undefined,active:user.accountEnabled!==false};
}
export function mapGraphOrganization(org:GraphOrganization,now:string):OrganizationProfile{
 if(!org.id||!org.displayName)throw new Error("Invalid Microsoft organization");
 const domain=org.verifiedDomains?.find(d=>d.isDefault)?.name||org.verifiedDomains?.[0]?.name||"";
 return {id:"m365-org:"+org.id,name:org.displayName,domain,businessUnit:"",siteIds:[],accent:"#1849a9",
 documentPrefix:"SHE",footer:"Controlled document. Printed copies are uncontrolled.",
 ownerIds:[],source:"MICROSOFT_365",updatedAt:now};
}
export const demoOrganization:OrganizationProfile={
 id:"demo-mining",name:"Demo Mining Operations",domain:"demo.invalid",businessUnit:"Mining Operations",
 siteIds:["Jwaneng mine · demo profile","Orapa mine · demo profile","Gaborone workshop"],
 accent:"#155eef",documentPrefix:"DMO-SHE",footer:"Demonstration only · not approved for operational use",
 ownerIds:["demo-p01","demo-p02"],source:"LOCAL_DEMO",updatedAt:"2026-10-08T00:00:00Z"
};
const names:[string,string,string,string,string][]=[
 ["Naledi Molefe","SHE Officer","SHE","Jwaneng","001"],
 ["Kagiso Dube","Shift Supervisor","Operations","Jwaneng","002"],
 ["Thabo Motsumi","Dump Truck Operator","Mining","Jwaneng","003"],
 ["Lorato Kgosidintsi","Maintenance Planner","Engineering","Gaborone","004"],
 ["Otsile Mokgosi","Maintenance Technician","Maintenance","Jwaneng","005"],
 ["Amantle Mpho","Electrician","Engineering","Jwaneng","006"],
 ["Tebogo Seretse","Site Manager","Management","Jwaneng","007"],
 ["Boitumelo Kgale","Permit Issuer","Compliance","Jwaneng","008"],
 ["Keabetswe Moyo","Rigger","Plant","Orapa","009"],
 ["Lesego Moremi","Crane Operator","Plant","Orapa","010"],
 ["Neo Pitse","Safety Representative","SHE","Orapa","011"],
 ["Mpho Baitshepi","Driver","Logistics","Gaborone","012"],
 ["Kelebogile Tawana","Mechanical Supervisor","Maintenance","Jwaneng","013"],
 ["Tshepo Phiri","Contractor Coordinator","Contractors","Orapa","014"]
];
export const demoPeople:PersonRecord[]=names.map(([displayName,jobTitle,department,location,employeeNumber],i)=>({
 id:"demo-p"+String(i+1).padStart(2,"0"),source:"LOCAL_DEMO",orgId:demoOrganization.id,
 displayName,email:displayName.toLowerCase().replaceAll(" ",".")+"@demo.invalid",
 department,jobTitle,location,employeeNumber,active:true
}));
export function makeCustomTemplate(input:{
 id:string;organization:OrganizationProfile;title:string;category:FormCategory;description:string;
 sections:FormSection[];documentType?:"GENERAL"|"JRA";jobId?:string;
 now:string;status?:"DRAFT"|"PUBLISHED";version?:number;
}):CustomTemplate{
 const title=input.title.trim();
 if(title.length<4||title.length>140)throw new Error("Form title must be 4–140 characters");
 if(input.sections.length===0)throw new Error("Add at least one section");
 const identifiers=new Set<string>();
 for(const section of input.sections){
  if(!section.title.trim()||section.fields.length===0)throw new Error("Every section needs a title and at least one field");
  for(const f of section.fields){
   if(!f.label.trim()||!f.id.trim()||identifiers.has(f.id))throw new Error("Question labels and unique identifiers are required");
   if((f.type==="select"||f.type==="multiselect")&&!f.options?.length)throw new Error(f.label+" requires options");
   if(f.type==="repeat"&&!f.children?.length)throw new Error(f.label+" needs child fields");
   identifiers.add(f.id);
  }
 }
 return {id:input.id,version:input.version??1,title,category:input.category,
  status:input.status??"DRAFT",effectiveDate:input.now.slice(0,10),sections:structuredClone(input.sections),
  siteIds:[],assetClasses:[],organizationId:input.organization.id,
  companyNameSnapshot:input.organization.name,logoSnapshot:input.organization.logoDataUrl,
  accent:input.organization.accent,referencePrefix:input.organization.documentPrefix,
  description:input.description.trim(),documentType:input.documentType??"GENERAL",
  jobId:input.jobId,createdAt:input.now,updatedAt:input.now};
}
export function nextPublishedVersion(template:CustomTemplate,now:string):CustomTemplate{
 const copy=structuredClone(template);
 return {...copy,version:copy.version+1,status:"PUBLISHED",createdAt:template.createdAt,updatedAt:now,effectiveDate:now.slice(0,10)};
}
export function blankJra(org:OrganizationProfile,now:string):JobRiskAssessment{
 return {id:"JRA-"+crypto.randomUUID(),orgId:org.id,companyNameSnapshot:org.name,
 logoSnapshot:org.logoDataUrl,reference:org.documentPrefix+"-JRA-"+now.slice(0,10).replaceAll("-",""),
 title:"",jobType:dictionary.jobTypes[0],jobId:"",siteId:org.siteIds[0]||"",location:"",
 startDate:now.slice(0,10),endDate:now.slice(0,10),supervisorId:"",revision:1,createdAt:now,updatedAt:now,
 status:"DRAFT",participants:[],tasks:[],scope:"",method:"",ppe:[],emergencyPlan:"",
 permits:[],reviewerId:"",reviewerNote:""};
}
export function blankJraTask(sequence:number):JraTask{
 return {id:"step-"+crypto.randomUUID(),sequence,description:"",equipment:[],permitRequired:[],hazards:[]};
}
export function blankHazard():HazardEntry{
 const emptyRisk:RiskAnswer={matrixId:defaultRiskMatrix.id,matrixVersion:defaultRiskMatrix.version,likelihood:0,consequence:0};
 return {id:"haz-"+crypto.randomUUID(),category:dictionary.hazardCategories[0],
 hazard:"",consequence:"",exposedPersonIds:[],controls:[],initial:{...emptyRisk},residual:{...emptyRisk}};
}
export function assessJra(jra:JobRiskAssessment):{decision:JraDecision;missing:string[];maxResidual:number;highRisks:number}{
 const missing:string[]=[];let maxResidual=0,highRisks=0;
 if(!jra.title.trim())missing.push("Job title");if(!jra.jobId.trim())missing.push("Job reference");
 if(!jra.siteId.trim())missing.push("Site");if(!jra.location.trim())missing.push("Work area");
 if(!jra.supervisorId)missing.push("Supervisor");if(!jra.scope.trim())missing.push("Scope of work");
 if(!jra.emergencyPlan.trim())missing.push("Emergency response");
 if(!jra.participants.length)missing.push("At least one participant");
 if(jra.participants.some(p=>!p.personId||!p.role))missing.push("Participant role or identity");
 if(!jra.tasks.length)missing.push("At least one job step");
 for(const [i,step] of jra.tasks.entries()){
  const prefix="Step "+(i+1);
  if(!step.description.trim())missing.push(prefix+" description");
  if(!step.hazards.length)missing.push(prefix+" hazards");
  for(const [n,hazard] of step.hazards.entries()){
   const path=prefix+" hazard "+(n+1);
   if(!hazard.hazard.trim())missing.push(path+" description");
   if(!hazard.consequence.trim())missing.push(path+" consequence");
   if(!hazard.controls.length || hazard.controls.some(c=>!c.description.trim()||!c.hierarchy))missing.push(path+" mitigation controls");
   if(!hazard.exposedPersonIds.length)missing.push(path+" exposed participants");
   try {
    scoreRisk(defaultRiskMatrix,hazard.initial);
    const risk=scoreRisk(defaultRiskMatrix,hazard.residual);maxResidual=Math.max(maxResidual,risk.score);
    if(risk.requiresApproval)highRisks++;
   }catch{missing.push(path+" valid initial and residual risk scores");}
  }
 }
 return {decision:missing.length?"INCOMPLETE":highRisks?"REVIEW_REQUIRED":"READY_FOR_DEMO_REVIEW",
 missing,maxResidual,highRisks};
}
export function canSimulateApproval(jra:JobRiskAssessment):boolean{
 return assessJra(jra).decision==="READY_FOR_DEMO_REVIEW"&&Boolean(jra.reviewerId)&&
  jra.reviewerId!==jra.supervisorId&&jra.participants.every(p=>p.acknowledged);
}
