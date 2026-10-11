/**
 * Aviation Ground Operations — demonstration-only data dictionary.
 * Context-specific observations are NOT an aircraft pre-flight check,
 * authority to dispatch, airworthiness release, NOTAM or security clearance.
 * Exact procedures must be supplied and approved by a licensed operator.
 */
export type AviationWorkArea="AERODROME"|"RAMP"|"GSE"|"TURNAROUND"|"AIRCRAFT_RECORDS"|"SECURITY_OVERSIGHT";
export type AviationCheckStatus="NOT_CHECKED"|"OBSERVED_OK"|"ISSUE"|"NOT_APPLICABLE";
export type AviationFindingSeverity="LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
export type AviationWorkflow={
 id:string;title:string;area:AviationWorkArea;description:string;
 standardContext:string[];operatorApprovalRequired:true;
 checks:readonly {id:string;label:string;prompt:string;critical?:boolean}[];
};
export type AviationAction={
 id:string;description:string;owner:string;dueDate:string;state:"OPEN"|"IN_PROGRESS"|"CLOSED";
};
export type AviationCheckAnswer={
 checkId:string;status:AviationCheckStatus;detail:string;severity?:AviationFindingSeverity;
};
export type AviationObservationRecord={
 id:string;workflowId:string;airport:string;site:string;
 aircraftRegistration?:string;equipmentId?:string;
 flightReference?:string;observer:string;procedureReference:string;procedureRevision:string;
 performedAt:string;notes:string;answers:AviationCheckAnswer[];actions:AviationAction[];
 state:"DRAFT"|"OBSERVATIONS_RECORDED"|"FOLLOW_UP_REQUIRED";
 jurisdiction:"DEMO_UNSPECIFIED";verification:"DEVICE_LOCAL_UNVERIFIED";
};
const c=(id:string,label:string,prompt:string,critical=false)=>({id,label,prompt,critical});
export const AVIATION_WORKFLOWS:readonly AviationWorkflow[]=[
 {id:"airfield-self-inspection",title:"Airfield safety inspection",area:"AERODROME",
  description:"Runway, taxiway and apron observational safety reporting; never issues a NOTAM or opening clearance.",
  standardContext:["ICAO Annex 14","FAA 14 CFR 139.327 (US example)","FAA AC 150/5200-18D (US guidance)"],operatorApprovalRequired:true,
  checks:[
   c("pavement","Pavement and surface observations","Record any surface damage or contamination and the location.",true),
   c("visual-aids","Markings, signs and lighting","Observe visibility and any discrepancy in the operator's inspection scope.",true),
   c("fod","Foreign-object debris","Record debris observations and the approved reporting or removal reference.",true),
   c("wildlife","Wildlife activity","Record wildlife hazards observed and the appropriate notification reference.",true),
   c("worksites","Works and obstructions","Record airside works, construction or obstruction discrepancies.",true),
   c("coordination","Information handover","Reference communication to authorized airport operations personnel.",true)
  ]},
 {id:"gse-pre-use",title:"Ground support equipment pre-use",area:"GSE",
  description:"Observe condition of tugs, belt loaders, stairs, GPUs, catering trucks, baggage tractors and other GSE.",
  standardContext:["IATA AHM","IATA IGOM","IATA Enhanced GSE"],operatorApprovalRequired:true,
  checks:[
   c("identity","Equipment identity and inspection context","Identify asset, station and relevant locally approved checklist.",true),
   c("qualification","Operator competency","Reference the operator's qualification and permitted equipment type.",true),
   c("condition","Visible damage and leaks","Record observed damage, leaks, guards or defects.",true),
   c("controls","Operating controls and safety equipment","Record the result of the operator-approved pre-use checks.",true),
   c("proximity","Aircraft interface controls","Reference proximity safeguards, equipment condition and any defects.",true),
   c("report","Defect reporting","Escalate anomalies to the responsible ground handling / maintenance team.",true)
  ]},
 {id:"aircraft-turnaround",title:"Aircraft turnaround oversight",area:"TURNAROUND",
  description:"Track the coordination and handover of ground tasks, without replacing aircraft dispatch or load-control release.",
  standardContext:["IATA IGOM Chapters 3–6","IATA AHM","ISAGO Ramp/Load disciplines"],operatorApprovalRequired:true,
  checks:[
   c("stand","Stand and flight reference","Identify operator, flight reference and stand."),
   c("briefing","Ground team coordination","Record accountable team and shift briefing."),
   c("gse","GSE and apron readiness","Reference equipment condition and apron observations.",true),
   c("handling","Ground handling handoffs","Track servicing, baggage and cargo oversight against locally approved procedures."),
   c("hazards","Turnaround hazards","Record discrepancies and notify the responsible supervisor.",true),
   c("closeout","Operations handover","Document handover; does not issue off-block, departure or airworthiness clearance.",true)
  ]},
 {id:"ramp-safety",title:"Apron / ramp safety walk",area:"RAMP",
  description:"Observational ramp safety checks and corrective-action tracking.",
  standardContext:["IATA IGOM Chapter 3","ICAO Annex 14","ACI APEX Safety"],operatorApprovalRequired:true,
  checks:[
   c("stand-condition","Stand condition and FOD","Note obstructions and debris observed.",true),
   c("vehicle-interface","Vehicle and pedestrian interactions","Record unsafe movement and segregation issues.",true),
   c("weather","Weather-related hazards","Document adverse conditions against approved local procedures.",true),
   c("servicing","Servicing oversight","Note deviations requiring action by qualified providers.",true),
   c("handover","Shift handover","Record outstanding safety issues and contact details.")
  ]},
 {id:"aviation-occurrence",title:"Safety occurrence / near miss",area:"RAMP",
  description:"Record aviation hazards, events and corrective actions for subsequent authorized SMS review.",
  standardContext:["ICAO Annex 19","ICAO Doc 9859","EASA aerodrome occurrence reporting (EU example)"],operatorApprovalRequired:true,
  checks:[
   c("event","Event observed","Record occurrence category, date and circumstances.",true),
   c("people","People and assets affected","Reference relevant operational context without unnecessary personal data."),
   c("immediate-action","Immediate notification and protective action","Record actions already taken by authorized personnel.",true),
   c("evidence","Evidence references","Reference available non-sensitive photographs and records."),
   c("follow-up","SMS follow-up","Assign investigation ownership and corrective-action reference.",true)
  ]},
 {id:"aviation-security-oversight",title:"Security quality oversight (restricted)",area:"SECURITY_OVERSIGHT",
  description:"Metadata-only audit planning and finding tracking. Restricted security procedures must not be stored in the demo.",
  standardContext:["ICAO Annex 17","State National Civil Aviation Security Programme","ACI APEX Security"],operatorApprovalRequired:true,
  checks:[
   c("scope","Audit scope reference","Enter only an approved, non-sensitive control reference."),
   c("authorization","Auditor authorization","Record a non-sensitive role/authorization reference.",true),
   c("training","Current training evidence","Record high-level competency status without revealing screening procedures."),
   c("finding","General finding status","Keep details in the organization's authorized secured system.",true),
   c("escalation","Secure escalation reference","Record the secure case ID rather than restricted measures.",true)
  ]},
 {id:"aircraft-defect-report",title:"Aircraft defect observation (non-authoritative)",area:"AIRCRAFT_RECORDS",
  description:"Capture an observed concern and a reference to the operator's controlled technical records. No MEL, deferral or release-to-service.",
  standardContext:["EASA Regulation 1321/2014 Part-CAMO / Part-145 (EU example)","Operator approved technical log"],operatorApprovalRequired:true,
  checks:[
   c("identity","Aircraft registration and operator","Record aircraft identity and applicable operator."),
   c("observation","Observed discrepancy","Record the factual observation without diagnosing airworthiness.",true),
   c("manual","Approved procedure / tech-log reference","Reference the controlled technical log or maintenance system.",true),
   c("notification","Authorized maintenance notification","Record to whom the observation was handed over.",true),
   c("outcome","External disposition reference","Record an externally issued outcome reference only; MoveTrack cannot grant release.",true)
  ]}
] as const;
export const AVIATION_AREA_LABELS:Record<AviationWorkArea,string>={
 AERODROME:"Aerodrome operations",RAMP:"Ramp & SHE",GSE:"Ground support equipment",
 TURNAROUND:"Aircraft turnaround",AIRCRAFT_RECORDS:"Aircraft observations",SECURITY_OVERSIGHT:"Security oversight"
};
export function evaluateAviationObservation(workflow:AviationWorkflow,answers:readonly AviationCheckAnswer[]){
 const selected=new Map(answers.map(a=>[a.checkId,a]));
 const missing=workflow.checks.filter(check=>!selected.get(check.id)||selected.get(check.id)?.status==="NOT_CHECKED");
 const findings=workflow.checks.filter(check=>selected.get(check.id)?.status==="ISSUE");
 const criticalFindings=findings.filter(check=>check.critical);
 const status:AviationObservationRecord["state"]=missing.length?"DRAFT":findings.length?"FOLLOW_UP_REQUIRED":"OBSERVATIONS_RECORDED";
 return {status,missing:missing.map(c=>c.id),findings:findings.map(c=>c.id),criticalFindings:criticalFindings.map(c=>c.id),
  // These observations NEVER authorize aircraft or airport operation.
  canReleaseAircraft:false,canDispatchAircraft:false,canReopenMovementArea:false,formalSecurityClearance:false};
}
export function makeAviationObservation(input:Omit<AviationObservationRecord,"state"|"jurisdiction"|"verification">):AviationObservationRecord{
 const workflow=AVIATION_WORKFLOWS.find(x=>x.id===input.workflowId);
 if(!workflow)throw Error("Unknown aviation inspection workflow");
 if(!input.airport.trim()||!input.observer.trim())throw Error("Airport and observer are required");
 if(workflow.area==="AIRCRAFT_RECORDS"&&!input.aircraftRegistration?.trim())throw Error("Aircraft registration is required");
 if(workflow.area==="GSE"&&!input.equipmentId?.trim())throw Error("GSE asset identifier is required");
 const evaluation=evaluateAviationObservation(workflow,input.answers);
 if(evaluation.status==="DRAFT")throw Error("All checklist items must have an observation status before recording");
 if(evaluation.findings.length&&input.answers.some(a=>a.status==="ISSUE"&&!a.detail.trim()))throw Error("Describe each observed safety issue before recording");
 if(evaluation.findings.length&&!input.actions.some(a=>a.description.trim()&&a.owner.trim())){
  throw Error("Record a responsible follow-up owner and action for safety findings");
 }
 return {...input,state:evaluation.status,verification:"DEVICE_LOCAL_UNVERIFIED",jurisdiction:"DEMO_UNSPECIFIED"};
}
