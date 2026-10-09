import {isSignatureEvidence,type SignatureEvidence} from "./signature-evidence.ts";
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
 {id:"person",label:"Person (directory)",purpose:"Pick a responsible employee"},
 {id:"people",label:"Participants (directory)",purpose:"Select multiple employees or contractors"},
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
 id:string; name:string; domain:string; businessUnit:string; industry?:string; siteIds:string[];
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
 personId:string; nameSnapshot:string; role:string; acknowledged:boolean; manual:boolean; acknowledgedAt?:string;signature?:SignatureEvidence;
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
 reviewerId:string; reviewerNote:string; reviewedAt?:string;reviewSignature?:SignatureEvidence;
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
 directoryRoleAssignments:"/v1.0/roleManagement/directory/roleAssignments",
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
export type GraphRoleAssignment={principalId:string;roleDefinitionId:string;directoryScopeId?:string};
export const MICROSOFT_GLOBAL_ADMIN_ROLE="62e90394-69f5-4237-9190-012177145e10";
/** Tenant admin candidates are not automatically owners of a MoveTrack organization. */
export function mapDirectoryAdminCandidates(assignments:readonly GraphRoleAssignment[],members:readonly PersonRecord[]):string[]{
 const memberByExternal=new Map(members.filter(p=>p.externalId).map(p=>[p.externalId,p.id]));
 return [...new Set(assignments.filter(r=>r.roleDefinitionId.toLowerCase()===MICROSOFT_GLOBAL_ADMIN_ROLE&&(!r.directoryScopeId||r.directoryScopeId==="/"))
  .map(r=>memberByExternal.get(r.principalId)).filter((value):value is string=>Boolean(value)))];
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
 const fields=input.sections.flatMap(section=>section.fields);
 const byId=new Map(fields.map(field=>[field.id,field]));
 for(const field of fields){
  const dependency=field.visibleWhen?.fieldId;
  if(!dependency)continue;
  if(!byId.has(dependency)||dependency===field.id)throw new Error(field.label+" references a missing or self-dependent question");
  let parent:FormField|undefined=byId.get(dependency);
  const checked=new Set([field.id]);
  while(parent?.visibleWhen){
   const next=parent.visibleWhen.fieldId;
   if(checked.has(next))throw new Error("Conditional question dependency cycle detected");
   checked.add(next);
   parent=byId.get(next);
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
export function assessJra(jra:JobRiskAssessment):{decision:JraDecision;missing:string[];maxResidual:number;highRisks:number;unverifiedControls:number}{
 const missing:string[]=[];let maxResidual=0,highRisks=0,unverifiedControls=0;
 if(!jra.title.trim())missing.push("Job title");if(!jra.jobId.trim())missing.push("Job reference");
 if(!jra.siteId.trim())missing.push("Site");
 if(jra.startDate&&jra.endDate&&jra.endDate<jra.startDate)missing.push("End date must follow the start date");if(!jra.location.trim())missing.push("Work area");
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
   unverifiedControls+=hazard.controls.filter(c=>!c.verified).length;
   if(!hazard.exposedPersonIds.length)missing.push(path+" exposed participants");
   try {
    const before=scoreRisk(defaultRiskMatrix,hazard.initial);
    const risk=scoreRisk(defaultRiskMatrix,hazard.residual);maxResidual=Math.max(maxResidual,risk.score);
    if(risk.score>before.score)missing.push(path+" residual risk exceeds initial risk");
    if(risk.requiresApproval)highRisks++;
   }catch{missing.push(path+" valid initial and residual risk scores");}
  }
 }
 return {decision:missing.length?"INCOMPLETE":(highRisks||unverifiedControls)?"REVIEW_REQUIRED":"READY_FOR_DEMO_REVIEW",
 missing,maxResidual,highRisks,unverifiedControls};
}
export function canSimulateApproval(jra:JobRiskAssessment):boolean{
 return assessJra(jra).decision==="READY_FOR_DEMO_REVIEW"&&Boolean(jra.reviewerId)&&
  jra.reviewerId!==jra.supervisorId&&jra.participants.every(p=>p.acknowledged&&isSignatureEvidence(p.signature)&&
   p.signature.signerPersonId===p.personId&&p.signature.intent==="acknowledgement"&&
   p.signature.scope===(jra.reference||jra.title||"JRA task review"));
}

export type TemplateRecipe={id:string;title:string;description:string;category:FormCategory;sections:FormSection[]};
const q=(id:string,label:string,type:FormField["type"]="text",required=true):FormField=>({id,label,type,required});
const check=(id:string,label:string,critical=false):FormField=>({...q(id,label,"pass_fail_na"),critical});
const repeat=(id:string,label:string,columns:Array<[string,string]>):FormField=>({...q(id,label,"repeat"),children:columns.map(([key,name])=>q(key,name))});
const templateRecipeBase:readonly TemplateRecipe[]=[
 {id:"permit-to-work",title:"Permit to Work — Work Authorization",category:"Safety",description:"Scope, permits, isolation, preconditions, duty holder and handback",sections:[
  {id:"work",title:"Work authorization",fields:[q("job_ref","Work order / task ID"),q("area","Work area / location"),q("activity","Scope of permitted work","multiline"),q("start","Start date","datetime"),q("finish","Expiry date","datetime")]},
  {id:"permits",title:"Critical permit controls",fields:[check("isolation","Energy sources isolated",true),check("barricade","Barricade and exclusion zone",true),check("induction","Workforce inducted and competent",true),q("authoriser","Permit issuer"),q("receivers","Responsible job holder")]}]},
 {id:"lifting",title:"Lifting Operations Plan",category:"Risk",description:"Crane and rigging suitability, load, radius, exclusions and spotters",sections:[
  {id:"lift",title:"Lift parameters",fields:[q("workorder","Work order"),q("load","Load description"),q("mass","Gross load mass (kg)","number"),q("crane","Crane / lifting device"),q("radius","Lift radius (m)","number")]},
  {id:"hazards",title:"Lift safety",fields:[check("inspect","Lifting gear inspected",true),check("certified","Crane certification and operator license",true),check("exclusion","Exclusion zone confirmed",true),q("wind","Weather / wind speed"),repeat("riggers","Riggers / spotters",[["name","Name"],["role","Assignment"]])]}]},
 {id:"loto",title:"Lockout Tagout Verification",category:"Safety",description:"Hazardous energy, isolation and zero-energy verification",sections:[
  {id:"isolation",title:"Isolation register",fields:[q("equipment","Equipment ID"),q("permit","Isolation permit ID"),repeat("energy","Energy sources",[["source","Energy source"],["device","Isolator ID"],["lock","Lock/tag number"]])]},
  {id:"prove",title:"Verify safe state",fields:[check("verify","Zero energy proved",true),check("stored","Stored energy dissipated",true),check("tags","Each person holds personal lock",true),q("isolator","Authorized isolator")]}]},
 {id:"meeting",title:"Safety Committee Meeting & Attendance",category:"Meetings",description:"Agenda, attendance, decisions and action tracker",sections:[
  {id:"details",title:"Meeting details",fields:[q("topic","Title"),q("date","Meeting date","date"),q("location","Location"),q("agenda","Agenda","multiline")]},
  {id:"register",title:"Registers",fields:[repeat("attendees","Attendees",[["name","Name"],["department","Department"],["role","Role"]]),repeat("actions","Corrective actions",[["item","Action"],["owner","Owner"],["due","Due date"]])]}]},
 {id:"machine",title:"Mobile Equipment Pre-Start",category:"Fleet",description:"Heavy and light equipment start-of-shift safety controls",sections:[
  {id:"identity",title:"Asset and operator",fields:[q("asset","Equipment number"),q("operator","Operator"),q("hours","Engine hours","number")]},
  {id:"critical",title:"Critical controls",fields:[check("brakes","Service, park and emergency brakes",true),check("steering","Steering and hydraulics",true),check("lights","Beacon and headlights",true),check("tyres","Tyres, tracks and undercarriage",true),check("reverse","Reverse alarm / cameras",true),check("fire","Fire suppression / extinguisher",true),q("defects","Defects and follow-up actions","multiline",false)]}]},
 {id:"fatigue",title:"Fit for Work and Fatigue Declaration",category:"Safety",description:"Worker fatigue and fitness attestation for critical operations",sections:[
  {id:"worker",title:"Worker declaration",fields:[q("person","Employee name"),q("shift","Shift"),q("rest","Rest hours in past 24h","number"),q("meds","Medication or fitness concerns","multiline",false)]},
  {id:"check",title:"Fit for duty controls",fields:[{...q("fit","Employee fit for assigned task","yes_no"),critical:true},q("actions","Supervisor mitigation / reassignment","multiline",false)]}]},
 {id:"incident",title:"Incident / Near Miss Investigation",category:"Inspections",description:"Event classification, circumstances, root causes and corrective actions",sections:[
  {id:"event",title:"Event summary",fields:[q("time","Event date/time","datetime"),q("area","Location"),q("nature","Event description","multiline"),{...q("severity","Severity","select"),options:["Low","Medium","High","Critical"]},q("persons","People affected","multiline")]},
  {id:"analysis",title:"Investigation",fields:[q("immediate","Immediate actions taken","multiline"),q("causes","Contributing / root causes","multiline"),repeat("corrective","Corrective action register",[["action","Action"],["owner","Owner"],["deadline","Due"]])]}]},
 {id:"handover",title:"Shift Handover and Open Defects",category:"Handover",description:"Transfer plant status, critical risks, defects and unfinished permits",sections:[
  {id:"shift",title:"Shift information",fields:[q("date","Handover time","datetime"),q("outgoing","Outgoing shift lead"),q("incoming","Incoming shift lead")]},
  {id:"outstanding",title:"Items carried over",fields:[repeat("tasks","Incomplete work",[["ref","Job / asset"],["action","Outstanding work"],["owner","Owner"]]),q("grounded","Grounded assets","multiline"),q("hazards","Unresolved hazards","multiline"),check("accepted","Incoming shift understands the open risks",true)]}]}
];
/** Independent local review is attached to specialist editable recipes that imply
 * a supervisor verification/approval action. Vehicle pre-start is operator-owned. */
const recipeReviewIds=new Set(["permit-to-work","lifting","loto","meeting","fatigue","incident","handover"]);
export const templateRecipes:readonly TemplateRecipe[]=templateRecipeBase.map(recipe=>!recipeReviewIds.has(recipe.id)?recipe:{
 ...recipe,sections:[...recipe.sections,{
  id:"review-signature",title:"Independent reviewer acknowledgement",fields:[
   {id:"recipe_reviewer",label:"Responsible reviewing supervisor",type:"person",required:true},
   {id:"recipe_review_signature",label:"Supervisor review and acknowledgement",type:"signature",required:true,signerFieldId:"recipe_reviewer"}
  ]
 }]
});


/** Rich fictional example suitable for testing risk, crew acknowledgements and mitigation UI. */
export function sampleBrakeMaintenanceJra(org:OrganizationProfile,people:readonly PersonRecord[],now:string):JobRiskAssessment{
 const jra=blankJra(org,now);
 const supervisor=people.find(p=>p.jobTitle.toLowerCase().includes("supervisor"))??people[0];
 const crew=people.filter(p=>p.id!==supervisor?.id).slice(0,4);
 jra.title="Haul truck brake repair and function test";
 jra.reference=org.documentPrefix+"-JRA-DEMO";
 jra.jobId="WO-DEMO-204";jra.jobType="Breakdown maintenance";
 jra.location="Haulage maintenance bay 4";
 jra.scope="Isolate haul truck, inspect brake system, replace defective hose, prove zero energy and functional test under controlled conditions.";
 jra.method="Inspect → isolate → lock out → replace → inspect → remove isolation under permit → functional test.";
 jra.emergencyPlan="Stop work, notify control room and follow site emergency plan. Muster at designated workshop muster point.";
 jra.ppe=["Hard hat","Safety glasses","Safety footwear","Gloves","High-visibility vest"];
 jra.supervisorId=supervisor?.id??"";
 jra.participants=crew.map(p=>({personId:p.id,nameSnapshot:p.displayName,role:p.jobTitle,acknowledged:false,manual:p.source==="MANUAL"}));
 const examples=[
  {step:"Secure and isolate haul truck",category:"Stored energy / LOTO",hazard:"Unexpected vehicle movement and residual hydraulic pressure",consequence:"Crush injury or injection injury",control:"Park on level ground, apply wheel chocks and isolation locks; verify zero energy.",lh:4,sev:5,rlh:2,rsev:4},
  {step:"Remove defective brake hose",category:"Pressure systems",hazard:"Residual pressure or line rupture",consequence:"Fluid injection, laceration or eye injury",control:"Depressurise, wear face shield and use appropriate rated tools.",lh:4,sev:4,rlh:2,rsev:3},
  {step:"Perform controlled brake function test",category:"Vehicle interaction",hazard:"Vehicle moves into people during function test",consequence:"Fatal collision or equipment damage",control:"Barricade testing zone; appoint banksman; test with spotter at safe distance.",lh:5,sev:5,rlh:2,rsev:4}
 ];
 jra.tasks=examples.map((item,index)=>{
  const task=blankJraTask(index+1);task.description=item.step;
  task.equipment=index===0?["LOTO kit","wheel chocks"]:index===1?["hydraulic fittings","torque wrench"]:["spotter radio","test bay"];
  const h=blankHazard();h.category=item.category;h.hazard=item.hazard;h.consequence=item.consequence;
  h.exposedPersonIds=crew.map(p=>p.id);
  h.controls=[{id:"ctl-"+index,hierarchy:"Engineering",description:item.control,ownerId:crew[index%crew.length]?.id,verified:false}];
  h.initial={...h.initial,likelihood:item.lh,consequence:item.sev};
  h.residual={...h.residual,likelihood:item.rlh,consequence:item.rsev};
  task.hazards=[h];
  return task;
 });
 return jra;
}
