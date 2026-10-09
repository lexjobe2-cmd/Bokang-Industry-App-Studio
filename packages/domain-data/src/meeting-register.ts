import type {FormTemplate,FormSection,FormAnswers} from "./assurance-forms.ts";
import {isSignatureEvidence} from "./signature-evidence.ts";
import type {OrganizationProfile} from "./custom-assurance.ts";

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
   fld("apologies","Apologies / people absent","multiline")
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
 return {id:meetingTemplateId(org.id),version:2,title:"Meeting register & minutes",category:"Meetings",
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
 const rows=Array.isArray(a.actions)?a.actions:[];
 for(const row of rows){if(!row||Array.isArray(row)||typeof row!=="object"||!String((row as Record<string,unknown>).action??"").trim()||!String((row as Record<string,unknown>).owner??"").trim())throw Error("Each action needs a description and accountable owner.");}
 return true;
}
