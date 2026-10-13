import type {FormTemplate,FormSection,FormAnswers} from "./assurance-forms.ts";
import {isSignatureEvidence} from "./signature-evidence.ts";
import type {OrganizationProfile,PersonRecord} from "./custom-assurance.ts";

export const presenceStatusOptions=["Present","Late arrival","Left early"] as const;
export const notificationStatusOptions=["Not recorded","Received by chair","Received by minute taker","Pending acknowledgement"] as const;
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
export function updateMeetingAttendance(answers:FormAnswers,group:"present"|"absent",ids:readonly string[],names:Readonly<Record<string,string>>={},people:readonly PersonRecord[]=[]):FormAnswers{
 const desired=asPeople([...ids]);
 const previousPresent=asPeople(answers.participants);
 const previousAbsent=asPeople(answers.apology_person_ids);
 const present=group==="present"?desired:previousPresent.filter(id=>!desired.includes(id));
 const absent=group==="absent"?desired:previousAbsent.filter(id=>!desired.includes(id));
 const current=asRows(answers.apology_details);
 const apologyDetails=absent.map(id=>{
  const old=current.find(row=>row.person_id===id);
  const person=people.find(p=>p.id===id);
  return {person_id:id,person_name:names[id]??String(old?.person_name??id),
   department:person?.department??String(old?.department??""),job_title:person?.jobTitle??String(old?.job_title??""),
   notification_status:String(old?.notification_status??"Not recorded"),
   absence_status:String(old?.absence_status??"Apology received"),
   absence_reason:String(old?.absence_reason??"Not specified"),
   absence_note:String(old?.absence_note??"")};
 });
 const prior=asRows(answers.attendance_details);
 const attendanceDetails=present.map(id=>{const old=prior.find(r=>r.person_id===id),person=people.find(p=>p.id===id);
  return {person_id:id,person_name:names[id]??String(old?.person_name??id),department:person?.department??String(old?.department??""),job_title:person?.jobTitle??String(old?.job_title??""),attendance_status:String(old?.attendance_status??"Present"),arrival_time:String(old?.arrival_time??""),departure_time:String(old?.departure_time??"")};});
 return {participants:present,attendance_details:attendanceDetails,apology_person_ids:absent,apology_details:apologyDetails};
}
export const meetingTypes=["Departmental meeting","SHE committee meeting","Toolbox safety talk","Pre-shift briefing","Contractor coordination","Incident learning review","Management SHE review","JSA / JRA team briefing","Emergency readiness meeting"] as const;
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
   fld("meeting_recorder","Minute taker (legacy name / external)","text"),
   fld("meeting_recorder_id","Company minute taker","person"),
   fld("meeting_ref","Company meeting reference","text"),
   fld("meeting_series_id","Meeting series ID","text"),fld("meeting_series_name","Meeting series","text"),
   fld("meeting_department","Department","text"),{...fld("meeting_cadence","Recurrence","select"),options:["Monthly","Weekly","Quarterly"]},
   fld("previous_meeting_id","Previous meeting record","text"),fld("previous_meeting_title","Previous meeting title","text"),
   fld("previous_meeting_date","Previous meeting date","date"),
   {...fld("minutes_adoption","Previous minutes adoption","select"),options:["Pending review","Adopted","Adopted with amendments","Deferred"]},
   fld("minutes_amendments","Previous minutes amendments / adoption notes","multiline"),
   fld("minutes_adopted_by","Adoption recorded by (unverified)","person"),fld("minutes_adopted_date","Adoption recorded date","date"),
   fld("invited_person_ids","Invited crew — attendance not confirmed","people")
  ]},
  {id:"meeting-attendance",title:"Attendance and apologies",fields:[
   {...fld("participants","Company staff present","people"),helperText:"Use the directory to attribute meeting participation to individual profiles"},
   {id:"attendance_details",label:"Staff attendance details",type:"repeat",children:[
    fld("person_id","Employee ID","text"),fld("person_name","Employee name","text"),fld("department","Department","text"),fld("job_title","Job title","text"),
    {...fld("attendance_status","Attendance status","select"),options:presenceStatusOptions},fld("arrival_time","Arrival time","text"),fld("departure_time","Departure time","text")
   ]},
   {id:"attendees",label:"Manual attendees / external visitors",type:"repeat",required:false,children:[
    fld("attendee_name","Full name","text",true),
    fld("attendee_company","Company / department","text"),
    fld("attendee_role","Role","text"),
    {...fld("attendee_status","Attendance status","select"),options:presenceStatusOptions},
    fld("attendee_ack","Attendance acknowledged (demo)","text")
   ]},
   {...fld("apology_person_ids","Staff who sent apologies or were absent","people"),
     helperText:"People recorded absent are not counted as attendees or participants."},
   {id:"apology_details",label:"Staff apology details",type:"repeat",required:false,children:[
    fld("person_id","Person ID","text",true),
    fld("person_name","Employee name","text",true),
    fld("department","Department","text"),fld("job_title","Job title","text"),
    {...fld("notification_status","Notification status","select"),options:notificationStatusOptions},
    {...fld("absence_status","Attendance status","select"),options:apologyStatusOptions},
    {...fld("absence_reason","Reason category","select"),options:apologyReasonOptions},
    fld("absence_note","Comment","text")
   ]},
   {id:"apology_entries",label:"External people absent / apologies",type:"repeat",required:false,children:[
    fld("apology_name","Person name","text",true),
    fld("apology_company","Company / department","text"),
    {...fld("apology_status","Attendance status","select"),options:apologyStatusOptions},
    {...fld("apology_reason","Reason category","select"),options:apologyReasonOptions},
    {...fld("notification_status","Notification status","select"),options:notificationStatusOptions},fld("notes","Notes","text")
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
    fld("state","Status (Open / In progress / Closed)","text"),fld("action_id","Action lineage ID","text"),
    fld("origin_meeting_id","Original meeting record","text"),fld("previous_due","Previous due date","date"),fld("carried_from","Carried from meeting","text"),fld("nlp_source","Text suggestion source","multiline"),{id:"nlp_reviewed",label:"Text action reviewed by operator",type:"checkbox"}
   ]},
   fld("outstanding","Outstanding issues / matters arising","multiline"),
   fld("prepared_by","Prepared by","text"),
   {id:"chair_signature",label:"Chairperson drawn acknowledgement",type:"signature",required:true},
   {id:"minute_taker_signature",label:"Minute taker drawn acknowledgement",type:"signature",required:false}
  ]}
 ];
 return {id:meetingTemplateId(org.id),version:5,title:"Meeting register & minutes",category:"Meetings",
  status:"PUBLISHED",effectiveDate:"2026-10-09",siteIds:[],assetClasses:[],
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
 if(a.meeting_series_id && (!String(a.meeting_series_name??"").trim()||!String(a.meeting_department??"").trim()))throw Error("Provide the series name and department.");
 if(a.previous_meeting_id){
  if(!["Adopted","Adopted with amendments","Deferred"].includes(String(a.minutes_adoption)))throw Error("Record the previous minutes adoption decision.");
  if(a.minutes_adoption==="Adopted with amendments"&&!String(a.minutes_amendments??"").trim())throw Error("Record the amendments to previous minutes.");
 }
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
 if(details.some(r=>!apologyStatusOptions.includes(r.absence_status as typeof apologyStatusOptions[number])))throw Error("Choose a valid apology attendance status.");
 if(new Set(details.map(r=>r.person_id)).size!==details.length)throw Error("Duplicate employee in apologies register.");
 const attendance=asRows(a.attendance_details);
 if(attendance.some(r=>!present.includes(String(r.person_id))||!presenceStatusOptions.includes(r.attendance_status as typeof presenceStatusOptions[number])))throw Error("Check staff attendance details and statuses.");
 if(new Set(attendance.map(r=>r.person_id)).size!==attendance.length)throw Error("Duplicate employee in attendance register.");
 const manual=asRows(a.apology_entries);
 if(manual.some(row=>!String(row.apology_name??"").trim()))throw Error("Each external apology needs a person's name.");
 const guests=[...asRows(a.attendees).map(r=>r.attendee_name),...manual.map(r=>r.apology_name)].map(n=>String(n??"").trim().toLowerCase()).filter(Boolean);
 if(new Set(guests).size!==guests.length)throw Error("Duplicate guest in attendance or apologies. Keep each guest in one category.");
 const rows=Array.isArray(a.actions)?a.actions:[];
 for(const row of rows){if(!row||Array.isArray(row)||typeof row!=="object"||!String((row as Record<string,unknown>).action??"").trim()||!String((row as Record<string,unknown>).owner??"").trim())throw Error("Each action needs a description and accountable owner.");}
 for(const row of asRows(a.actions)){
  if(row.nlp_source&&row.nlp_reviewed!==true)throw Error("Review every text-suggested action and confirm its owner and due date.");
  if((row.carried_from||row.nlp_source) && !/^\d{4}-\d{2}-\d{2}$/.test(String(row.due??"")))
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

/** Recorded attendance only, scoped to one browser/company. Apologies never count as attending. */
export function buildMeetingAnalytics({forms,people,orgId,personId,site,month,today=new Date().toISOString().slice(0,10)}:{forms:readonly import("./assurance-forms.ts").FormSubmission[];people:readonly PersonRecord[];orgId:string;personId?:string;site?:string;month?:string;today?:string}){
 const records=forms.filter(f=>f.templateSnapshot.category==="Meetings"&&
  ((f.templateSnapshot as import("./assurance-forms.ts").FormTemplate&{organizationId?:string}).organizationId===orgId)&&
  (!site||f.siteId===site)&&(!month||String(f.answers.meeting_date??f.submittedAt).startsWith(month)));
 let present=0,absent=0,apologies=0,attended=0,open=0,overdue=0;
 const departments=new Map<string,number>(),top=new Map<string,number>(),months=new Map<string,number>();
 for(const f of records){
  const a=f.answers,counts=meetingAttendanceCounts(a),ids=asPeople(a.participants),absentIds=asPeople(a.apology_person_ids);
  const details=asRows(a.apology_details),attendance=asRows(a.attendance_details);
  if(personId){
   if(ids.includes(personId)){present++;attended++;}
   if(absentIds.includes(personId))absent++;
   if(details.some(r=>r.person_id===personId&&r.absence_status==="Apology received"))apologies++;
  }else{present+=counts.present;absent+=counts.absent;apologies+=counts.apologyReceived;attended++;}
  for(const id of ids){
   if(personId&&id!==personId)continue;
   const person=people.find(p=>p.id===id&&p.orgId===orgId);
   const department=String(attendance.find(r=>r.person_id===id)?.department??person?.department??"Unspecified")||"Unspecified";
   departments.set(department,(departments.get(department)??0)+1);top.set(id,(top.get(id)??0)+1);
  }
  const m=String(a.meeting_date??f.submittedAt).slice(0,7);
  if(!personId||ids.includes(personId))months.set(m,(months.get(m)??0)+1);
  }
 for(const row of currentMeetingActions(records)){
   if(personId&&row.owner_person_id!==personId)continue;
   if(String(row.state??"").toLowerCase()==="closed")continue;
   open++;if(/^\d{4}-\d{2}-\d{2}$/.test(String(row.due??""))&&String(row.due)<today)overdue++;
  }
 return {meetings:records.length,attended,present,absent,apologies,open,overdue,
  attendanceRate:present+absent?Math.round(100*present/(present+absent)):null,
  departments:[...departments].map(([name,count])=>({name,count})),
  months:[...months].sort().map(([name,count])=>({name,count})),
  topPeople:[...top].sort((a,b)=>b[1]-a[1]).map(([id,count])=>({id,name:people.find(p=>p.id===id)?.displayName??id,count}))};
}

/** Calendar recurrence clamps month ends; no timer or real invitations are issued. */
export function nextMeetingDate(date:string,cadence:string):string{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return "";
 const d=new Date(date+"T12:00:00Z");if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==date)return "";
 if(cadence==="Weekly")d.setUTCDate(d.getUTCDate()+7);
 else {const day=d.getUTCDate();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+(cadence==="Quarterly"?3:1));const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));}
 return d.toISOString().slice(0,10);
}
export function meetingSeriesRecords(forms:readonly import("./assurance-forms.ts").FormSubmission[],orgId:string,seriesId:string){
 return forms.filter(f=>f.templateSnapshot.category==="Meetings"&&(f.templateSnapshot as FormTemplate&{organizationId?:string}).organizationId===orgId&&f.answers.meeting_series_id===seriesId)
  .sort((a,b)=>String(b.answers.meeting_date??b.submittedAt).localeCompare(String(a.answers.meeting_date??a.submittedAt))||b.submittedAt.localeCompare(a.submittedAt));
}
/** New occurrence copies context, never attendance, apologies, minutes or acknowledgements. */
export function continueMeetingSeries(previous:import("./assurance-forms.ts").FormSubmission,orgId:string,people:readonly PersonRecord[]):FormAnswers{
 const a=previous.answers;
 if((previous.templateSnapshot as FormTemplate&{organizationId?:string}).organizationId!==orgId||!a.meeting_series_id)throw Error("Select a meeting series from the active company.");
 const ids=new Set(people.filter(p=>p.orgId===orgId&&p.active).map(p=>p.id));
 const crew=Array.isArray(a.invited_person_ids)?asPeople(a.invited_person_ids):asPeople(a.participants);
 const carried=carryForwardMeetingActions({},a,people.filter(p=>p.orgId===orgId&&p.active)).rows.map(row=>{const source=asRows(a.actions).find(r=>String(r.action).trim().toLowerCase()===String(row.action).trim().toLowerCase());const index=asRows(a.actions).indexOf(source!);return {...row,action_id:String(source?.action_id??previous.id+":action:"+index),origin_meeting_id:String(source?.origin_meeting_id??previous.id),previous_due:String(source?.due??""),carried_from:previous.id};});
 return {meeting_title:String(a.meeting_series_name),meeting_type:String(a.meeting_type??""),meeting_series_id:String(a.meeting_series_id??""),meeting_series_name:String(a.meeting_series_name??""),
  meeting_department:String(a.meeting_department??""),meeting_cadence:a.meeting_cadence??"Monthly",meeting_site:String(a.meeting_site??""),
  meeting_date:String(a.next_meeting||nextMeetingDate(String(a.meeting_date),String(a.meeting_cadence??"Monthly"))),meeting_time:a.meeting_time??"",
  meeting_chair:ids.has(String(a.meeting_chair))?String(a.meeting_chair):"",meeting_recorder_id:ids.has(String(a.meeting_recorder_id))?String(a.meeting_recorder_id):"",
  invited_person_ids:crew.filter(id=>ids.has(id)),participants:[],attendance_details:[],attendees:[],apology_person_ids:[],apology_details:[],apology_entries:[],
  previous_meeting_id:previous.id,previous_meeting_title:String(a.meeting_title??""),previous_meeting_date:String(a.meeting_date??""),minutes_adoption:"Pending review",minutes_amendments:"",
  agenda:a.agenda??"",minutes:"",decisions:"",safety_highlights:"",outstanding:"",actions:carried};
}
/** Latest occurrence of a linked action wins, preserving all historic snapshots. */
export function currentMeetingActions(records:readonly import("./assurance-forms.ts").FormSubmission[]){
 const seen=new Set<string>(),result:Record<string,unknown>[]=[];
 for(const f of [...records].sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt))){for(const [i,row] of asRows(f.answers.actions).entries()){
  const key=String(row.action_id||f.id+":action:"+i);if(seen.has(key))continue;seen.add(key);result.push(row);
 }}return result;
}
