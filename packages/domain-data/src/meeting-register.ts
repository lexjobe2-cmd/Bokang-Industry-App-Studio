import type {FormTemplate,FormSection,FormAnswers} from "./assurance-forms.ts";
import {isSignatureEvidence} from "./signature-evidence.ts";
import type {OrganizationProfile} from "./custom-assurance.ts";

export const apologyStatusOptions=["Apology received","Absent (no apology)","Attendance unconfirmed"] as const;
export const apologyReasonOptions=["Not specified","Leave","Different work site","Training","Operational duty","Travel","Unavailable","Other"] as const;

const asPeople=(value:unknown)=>Array.isArray(value)?[...new Set(value.filter((id):id is string=>typeof id==="string"&&id.trim().length>0))]:[];
const asRows=(value:unknown):Record<string,unknown>[]=>Array.isArray(value)?value.filter((v):v is Record<string,unknown>=>v!==null&&typeof v==="object"&&!Array.isArray(v)):[];
export function meetingAttendanceCounts(answers:FormAnswers){
 const present=asPeople(answers.participants);
 const apologies=asPeople(answers.apology_person_ids);
 const manualPresent=asRows(answers.attendees).filter(row=>String(row.attendee_name??"").trim()).length;
 const manualAbsent=asRows(answers.apology_entries).filter(row=>String(row.apology_name??"").trim()).length;
 return {present:present.length+manualPresent,absent:apologies.length+manualAbsent,
  apologyReceived:asRows(answers.apology_details).filter(row=>apologies.includes(String(row.person_id??""))&&row.absence_status==="Apology received").length+
   asRows(answers.apology_entries).filter(row=>String(row.apology_name??"").trim()&&row.apology_status==="Apology received").length};
}
/** Exclusive sets: a person cannot be both recorded present and absent.
 * New snapshots keep stable person IDs and do not silently change existing submitted records. */
export function updateMeetingAttendance(answers:FormAnswers,group:"present"|"absent",ids:readonly string[],names:Readonly<Record<string,string>>={}):FormAnswers{
 const desired=asPeople([...ids]);
 const previousPresent=asPeople(answers.participants);
 const previousAbsent=asPeople(answers.apology_person_ids);
 const present=group==="present"?desired:previousPresent.filter(id=>!desired.includes(id));
 const absent=group==="absent"?desired:previousAbsent.filter(id=>!desired.includes(id));
 const current=asRows(answers.apology_details);
 const apologyDetails=absent.map(id=>{
  const old=current.find(row=>row.person_id===id);
  return {person_id:id,person_name:names[id]??String(old?.person_name??id),
   absence_status:String(old?.absence_status??"Apology received"),
   absence_reason:String(old?.absence_reason??"Not specified"),
   absence_note:String(old?.absence_note??"")};
 });
 return {participants:present,apology_person_ids:absent,apology_details:apologyDetails};
}
export const meetingTypes=["SHE committee meeting","Toolbox safety talk","Pre-shift briefing","Contractor coordination","Incident learning review","Management SHE review","JSA / JRA team briefing","Emergency readiness meeting"] as const;
export type MeetingType=typeof meetingTypes[number];
export const meetingTemplateId=(orgId:string)=>"company-meeting-register-"+orgId;
const fld=(id:string,label:string,type:"text"|"date"|"multiline"|"person"|"people"|"select",required=false)=>({id,label,type,required});
export function meetingTemplate(org:OrganizationProfile):FormTemplate&{organizationId:string;companyNameSnapshot:string;logoSnapshot?:string;accent:string;referencePrefix:string}{
 const sections:FormSection[]=[
  {id:"meeting-details",title:"Meeting details",fields:[
   fld("meeting_title","Meeting title","text",true),
   {...fld("meeting_type","Meeting type","select",true),options:meetingTypes},
   fld("meeting_date","Meeting date","date",true),
   fld("meeting_time","Start time","text"),
   fld("meeting_site","Work area / room / location","text",true),
   fld("meeting_chair","Chairperson / facilitator","person"),
   fld("meeting_chair_manual","Chair name (if external or not in directory)","text"),
   fld("meeting_recorder","Minute taker","text"),
   fld("meeting_ref","Company meeting reference","text")
  ]},
  {id:"meeting-attendance",title:"Attendance and apologies",fields:[
   {...fld("participants","Company staff present","people"),helperText:"Use the directory to attribute meeting participation to individual profiles"},
   {id:"attendees",label:"Manual attendees / external visitors",type:"repeat",required:false,children:[
    fld("attendee_name","Full name","text",true),
    fld("attendee_company","Company / department","text"),
    fld("attendee_role","Role","text"),
    fld("attendee_ack","Attendance acknowledged (demo)","text")
   ]},
   {...fld("apology_person_ids","Staff who sent apologies or were absent","people"),
     helperText:"People recorded absent are not counted as attendees or participants."},
   {id:"apology_details",label:"Staff apology details",type:"repeat",required:false,children:[
    fld("person_id","Person ID","text",true),
    fld("person_name","Employee name","text",true),
    {...fld("absence_status","Attendance status","select"),options:apologyStatusOptions},
    {...fld("absence_reason","Reason category","select"),options:apologyReasonOptions},
    fld("absence_note","Comment","text")
   ]},
   {id:"apology_entries",label:"External people absent / apologies",type:"repeat",required:false,children:[
    fld("apology_name","Person name","text",true),
    fld("apology_company","Company / department","text"),
    {...fld("apology_status","Attendance status","select"),options:apologyStatusOptions},
    {...fld("apology_reason","Reason category","select"),options:apologyReasonOptions}
   ]},
   fld("apologies","Additional apology notes (legacy free text)","multiline")
  ]},
  {id:"meeting-content",title:"Agenda, discussions and decisions",fields:[
   fld("agenda","Agenda / planned discussion topics","multiline",true),
   fld("safety_highlights","Safety moment and key hazards","multiline"),
   fld("minutes","Meeting minutes / observations","multiline",true),
   fld("decisions","Decisions / resolutions","multiline"),
   fld("next_meeting","Next meeting / review date","date")
  ]},
  {id:"action-closeout",title:"Corrective actions and closeout",fields:[
   {id:"actions",label:"Action register — owner, due date and status",type:"repeat",required:false,children:[
    fld("action","Action or follow-up","text",true),
    fld("owner","Owner / responsible person","text",true),
    fld("due","Due date","date"),
    fld("state","Status (Open / In progress / Closed)","text")
   ]},
   fld("outstanding","Outstanding issues / matters arising","multiline"),
   fld("prepared_by","Prepared by","text"),
   {id:"chair_signature",label:"Chairperson drawn acknowledgement",type:"signature",required:true},
   {id:"minute_taker_signature",label:"Minute taker drawn acknowledgement",type:"signature",required:false}
  ]}
 ];
 return {id:meetingTemplateId(org.id),version:3,title:"Meeting register & minutes",category:"Meetings",
  status:"PUBLISHED",effectiveDate:"2026-10-08",siteIds:[],assetClasses:[],
  sections,organizationId:org.id,companyNameSnapshot:org.name,logoSnapshot:org.logoDataUrl,
  accent:org.accent,referencePrefix:org.documentPrefix};
}
export function validateMeetingInput(a:FormAnswers){
 const title=String(a.meeting_title??"").trim(),date=String(a.meeting_date??"").trim(),
  agenda=String(a.agenda??"").trim(),minutes=String(a.minutes??"").trim();
 if(title.length<3)throw Error("Enter a meeting title (at least 3 characters).");
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error("Choose a valid meeting date.");
 if(!String(a.meeting_type??"").trim())throw Error("Select a meeting type.");
 if(!String(a.meeting_site??"").trim())throw Error("Provide the work site / meeting location.");
 if(!agenda)throw Error("Provide the meeting agenda.");
 if(!minutes)throw Error("Add meeting minutes or a summary before saving the completed record.");
 const sig=a.chair_signature;
 if(!isSignatureEvidence(sig)||sig.intent!=="attendance"||sig.role!=="Meeting chairperson")
  throw Error("The meeting chairperson must capture a local drawn acknowledgement before finalizing minutes.");
 const chairId=typeof a.meeting_chair==="string"?a.meeting_chair.trim():"";
 const chairManual=typeof a.meeting_chair_manual==="string"?a.meeting_chair_manual.trim():"";
 if(chairId){
  if(sig.signerPersonId!==chairId)throw Error("Chairperson signature must match the selected meeting chair.");
 }else if(!chairManual||sig.signerName.trim().toLowerCase()!==chairManual.toLowerCase()){
  throw Error("Choose the meeting chair or provide and match an external chairperson name.");
 }
 const present=asPeople(a.participants),absent=asPeople(a.apology_person_ids);
 if(present.some(id=>absent.includes(id)))throw Error("The same person cannot be marked both present and absent. Update their attendance selection.");
 const details=asRows(a.apology_details);
 if(absent.some(id=>!details.some(row=>row.person_id===id)))throw Error("Choose the attendance status for each person in the apologies register.");
 if(details.some(row=>!absent.includes(String(row.person_id??""))))throw Error("Remove outdated apology details before submitting.");
 const manual=asRows(a.apology_entries);
 if(manual.some(row=>!String(row.apology_name??"").trim()))throw Error("Each external apology needs a person's name.");
 const rows=Array.isArray(a.actions)?a.actions:[];
 for(const row of rows){if(!row||Array.isArray(row)||typeof row!=="object"||!String((row as Record<string,unknown>).action??"").trim()||!String((row as Record<string,unknown>).owner??"").trim())throw Error("Each action needs a description and accountable owner.");}
 for(const row of asRows(a.actions)){
  if(row.carried_from && !/^\d{4}-\d{2}-\d{2}$/.test(String(row.due??"")))
   throw Error("Confirm a new due date for every carried-forward action before submitting this meeting.");
 }
 return true;
}

/** Opt-in carry-forward of unresolved meeting actions, modelled after an editable
 * Power Apps gallery. Never copy previous sign-off or treat previous attendance
 * as current. Due dates are cleared for the new meeting and must be reviewed.
 */
export function carryForwardMeetingActions(current:FormAnswers,previous:FormAnswers,knownPeople:readonly {id:string;displayName:string}[]=[]){
 const existing=asRows(current.actions).map(row=>({...row}));
 const source=asRows(previous.actions);
 const normalize=(s:unknown)=>String(s??"").trim().toLowerCase().replace(/\s+/g," ");
 const seen=new Set(existing.map(row=>normalize(row.action)).filter(Boolean));
 let added=0;
 for(const item of source){
  const action=String(item.action??"").trim();
  if(!action||normalize(item.state)==="closed"||seen.has(normalize(action)))continue;
  const oldOwnerId=String(item.owner_person_id??"");
  const ownerName=String(item.owner??"").trim();
  const byId=knownPeople.find(p=>p.id===oldOwnerId);
  // Do not auto-link an ambiguous legacy free-text name to an employee.
  const byName=knownPeople.filter(p=>normalize(p.displayName)===normalize(ownerName));
  const person=byId??(byName.length===1?byName[0]:undefined);
  existing.push({action,owner:person?.displayName??ownerName,
   owner_person_id:person?.id??"",due:"",state:"Open",
   carried_from:"Previous meeting - verify owner, due date and action status"});
  seen.add(normalize(action));added++;
 }
 return {rows:existing,added};
}
