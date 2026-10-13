/**
 * Aviation Ground Operations — demonstration-only data dictionary.
 * Context-specific observations are NOT an aircraft pre-flight check,
 * authority to dispatch, airworthiness release, NOTAM or security clearance.
 * Exact procedures must be supplied and approved by a licensed operator.
 */
import {AVIATION_SECTORS,type AviationSectorId,type AviationAirframeKind} from "./aviation-sector-profiles.ts";

export type AviationWorkArea="AERODROME"|"RAMP"|"GSE"|"TURNAROUND"|"AIRCRAFT_RECORDS"|"SECURITY_OVERSIGHT"|"HELIPORT"|"HELICOPTER_GROUND";
export type AviationCheckStatus="NOT_CHECKED"|"OBSERVED_OK"|"ISSUE"|"NOT_APPLICABLE";
export type AviationFindingSeverity="LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
export type AviationWorkflow={
 id:string;title:string;area:AviationWorkArea;description:string;
 standardContext:string[];operatorApprovalRequired:true;
 checks:readonly {id:string;label:string;prompt:string;critical?:boolean}[];
};
export type AviationAction={
 id:string;description:string;owner:string;dueDate:string;state:"OPEN"|"IN_PROGRESS"|"CLOSED";completionReference?:string;
};
export type AviationCheckAnswer={
 checkId:string;status:AviationCheckStatus;detail:string;severity?:AviationFindingSeverity;
};
export type AviationObservationRecord={
 id:string;workflowId:string;airport:string;site:string;
 aircraftRegistration?:string;equipmentId?:string;
 sectorId?:AviationSectorId;airframeKind?:AviationAirframeKind;handoverReference?:string;
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
,
 {id:"heliport-ground-observation",title:"Heliport / remote landing area observation",area:"HELIPORT",
  description:"Non-authoritative helipad, mine landing area or hospital heliport ground-safety observations.",
  standardContext:["ICAO Annex 14 Volume II Heliports","Locally approved heliport/helipad SOP"],operatorApprovalRequired:true,
  checks:[
   c("site-reference","Heliport / landing area identity","Record facility reference and approved ground-inspection scope.",true),
   c("surface","Landing surface condition","Record visible surface discrepancies without determining operational suitability.",true),
   c("objects","Loose objects / debris","Record visible debris and escalation reference.",true),
   c("obstructions","Obstruction observations","Record only visible ground-side obstructions and notify authorized operator.",true),
   c("markings","Markings and lighting","Record observed discrepancies in local technical services.",true),
   c("weather-interface","Weather and ground hazards","Record wet or slippery surfaces, dust, wind-driven debris or other site observations.",true),
   c("report","Authorized notification","Record responsible facility contact and handover reference.",true)
  ]},
 {id:"helicopter-ground-safety",title:"Helicopter ground safety observation",area:"HELICOPTER_GROUND",
  description:"External rotorcraft ground safety reporting. Not a helicopter preflight or maintenance inspection.",
  standardContext:["FAA Helicopter Flying Handbook (general reference)","Aircraft type-specific RFM / POH and operator SOP"],operatorApprovalRequired:true,
  checks:[
   c("aircraft-reference","Aircraft / support context","Reference the aircraft and approved ground safety record (non-sensitive identifier).",true),
   c("rotor-exposure","Rotor and tail-area exposure","Record unsafe personnel or ground-equipment proximity observed; do not prescribe procedures.",true),
   c("landing-support","Landing gear / skid area","Record any visible ground-side damage or support-equipment discrepancy.",true),
   c("visible-condition","External condition","Record observed fluid leak, damage, loose object or concern for authorized maintenance.",true),
   c("equipment-interface","Equipment and servicing interface","Record any ground-service hazard or interface discrepancy.",true),
   c("handover","Defect / safety handover","Capture reporting to authorized maintenance, flight crew or ground supervisor.",true)
  ]},
 {id:"helicopter-mission-support",title:"Helicopter ground-service handover",area:"HELICOPTER_GROUND",
  description:"Non-sensitive support-team handovers for civil, public-service or remote helicopter operations.",
  standardContext:["Operator ground handling SOP","ICAO Annex 19 safety management principles"],operatorApprovalRequired:true,
  checks:[
   c("team","Ground support team assignment","Record the accountable team or supervisor (no sensitive mission details)."),
   c("brief","Shift / SHE briefing reference","Reference general briefing record and outstanding actions."),
   c("support-assets","Ground support asset oversight","Record equipment defects or servicing-handling concerns.",true),
   c("personnel-safety","Personnel safety observations","Record ground interface and environmental concerns.",true),
   c("non-sensitive-handoff","Handover records","Reference approved non-sensitive loading, servicing or handover record only."),
   c("escalation","Discrepancy notification","Record authorized handover owner and escalation reference.",true)
  ]},
 {id:"rotorcraft-defect-handover",title:"Rotorcraft technical observation handover",area:"AIRCRAFT_RECORDS",
  description:"Controlled technical-log cross-reference for observed rotorcraft discrepancy; no dispatch/maintenance authority.",
  standardContext:["Aircraft-specific approved maintenance manuals","Operator technical log and authorized maintenance system"],operatorApprovalRequired:true,
  checks:[
   c("aircraft","Aircraft / asset reference","Record only non-sensitive aircraft identity.",true),
   c("observed","Factual observed discrepancy","Document what was observed without diagnosing or granting airworthiness.",true),
   c("approved-reference","Approved technical record reference","Capture an external log reference, NOT controlled manual contents.",true),
   c("maintenance-notified","Authorized maintenance handover","Record reporting reference to an authorized maintenance organization.",true),
   c("disposition","External disposition reference","If known, reference external disposition; never grant clearance in MoveTrack.",true)
  ]}
] as const;
export const AVIATION_AREA_LABELS:Record<AviationWorkArea,string>={
 AERODROME:"Aerodrome operations",RAMP:"Ramp & SHE",GSE:"Ground support equipment",
 TURNAROUND:"Aircraft turnaround",AIRCRAFT_RECORDS:"Aircraft observations",SECURITY_OVERSIGHT:"Security oversight",
 HELIPORT:"Heliport / landing areas",HELICOPTER_GROUND:"Helicopter ground support"
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
 if(["AIRCRAFT_RECORDS","HELICOPTER_GROUND"].includes(workflow.area)&&!input.aircraftRegistration?.trim())throw Error("Aircraft or non-sensitive asset reference is required");
 if(input.sectorId&&!AVIATION_SECTORS.some(s=>s.id===input.sectorId))throw Error("Unknown organization sector");
 if(workflow.area==="HELICOPTER_GROUND"&&input.airframeKind!=="HELICOPTER")throw Error("Helicopter support requires helicopter airframe selection");
 if(workflow.area==="GSE"&&!input.equipmentId?.trim())throw Error("GSE asset identifier is required");
 const evaluation=evaluateAviationObservation(workflow,input.answers);
 if(evaluation.status==="DRAFT")throw Error("All checklist items must have an observation status before recording");
 if(evaluation.findings.length&&input.answers.some(a=>a.status==="ISSUE"&&!a.detail.trim()))throw Error("Describe each observed safety issue before recording");
 if(evaluation.findings.length&&!input.actions.some(a=>a.description.trim()&&a.owner.trim())){
  throw Error("Record a responsible follow-up owner and action for safety findings");
 }
 return {...input,state:evaluation.status,verification:"DEVICE_LOCAL_UNVERIFIED",jurisdiction:"DEMO_UNSPECIFIED"};
}

/** Demo-only follow-up transitions never change recorded findings or aircraft operation authority. */
export function updateAviationFollowUp(record:AviationObservationRecord,actionId:string,
 state:AviationAction["state"],evidenceReference:string):AviationObservationRecord{
 const current=record.actions.find(action=>action.id===actionId);
 if(!current)throw Error("Unknown aviation corrective action");
 if(state==="CLOSED"&&!evidenceReference.trim())throw Error("Closing a follow-up requires a non-sensitive external evidence reference");
 return {...record,actions:record.actions.map(action=>action.id===actionId
  ?{...action,state,completionReference:state==="CLOSED"?evidenceReference.trim():undefined}:action)};
}
