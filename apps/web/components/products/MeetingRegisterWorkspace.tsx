"use client";
import {useMemo,useState} from "react";
import {CalendarDays,UsersRound,ClipboardList,Plus,Trash2,CheckCircle2,FileText} from "lucide-react";
import {usePersistentState} from "@bokang/persistence";
import {ASSURANCE_STORAGE,demoOrganization,demoPeople,type PersonRecord,type OrganizationProfile} from "@bokang/domain-data/custom-assurance";
import {meetingTypes,meetingTemplate,validateMeetingInput,updateMeetingAttendance,meetingAttendanceCounts,apologyStatusOptions,apologyReasonOptions,type MeetingType} from "@bokang/domain-data/meeting-register";
import {makeSubmission,type FormAnswers,type FormSubmission,type PrimitiveAnswer} from "@bokang/domain-data/assurance-forms";
import {buildFormDocument} from "../../lib/form-exports";
import {DocumentDownloadActions} from "./DocumentDownloadActions";
import {OrganizationPeopleComboBox} from "./OrganizationPeopleComboBox";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {SignatureApprovalTray} from "./SignatureApprovalTray";
import {isSignatureEvidence,type SignatureEvidence} from "@bokang/domain-data/signature-evidence";
import {ACTIVE_PERSON_KEY} from "./UserParticipationAnalytics";

const box:React.CSSProperties={background:"#fff",border:"1px solid #dbe4ee",padding:17,borderRadius:15};
const label:React.CSSProperties={display:"grid",gap:6,fontSize:12,color:"#364152",fontWeight:800};
const input:React.CSSProperties={width:"100%",border:"1px solid #cbd5e1",padding:"11px 12px",minHeight:44,borderRadius:10,font:"inherit",background:"#fff",color:"#182b49"};
const btn:React.CSSProperties={border:"1px solid #cbd5e1",borderRadius:11,padding:"10px 13px",fontWeight:850,background:"#fff",color:"#17406b",minHeight:44,cursor:"pointer"};
const primary:React.CSSProperties={...btn,background:"#1d4ed8",borderColor:"#1d4ed8",color:"#fff"};
type Row=Record<string,PrimitiveAnswer>;
const rowValues=(v:unknown):Row[]=>Array.isArray(v)?v.filter(r=>r&&typeof r==="object"&&!Array.isArray(r)) as Row[]:[];
const textValue=(v:unknown)=>typeof v==="string"?v:"";
const newDraft=(site:string,type:MeetingType="SHE committee meeting"):FormAnswers=>({
 meeting_title:"",meeting_type:type,meeting_date:new Date().toISOString().slice(0,10),
 meeting_site:site,participants:[],attendees:[],apology_person_ids:[],apology_details:[],apology_entries:[],apologies:"",agenda:"",minutes:"",decisions:"",actions:[]
});
export function MeetingRegisterWorkspace(){
 const [orgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [orgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [people]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [actor,setActor]=usePersistentState(ACTIVE_PERSON_KEY,"");
 const [forms,setForms]=usePersistentState<FormSubmission[]>("bokang-studio.move-track.assurance-submissions.v1",[]);
 const [drafts,setDrafts]=usePersistentState<Record<string,FormAnswers>>("bokang-studio.move-track.meeting.drafts.v1",{});
 const [editing,setEditing]=useState(true);
 const [message,setMessage]=useState("");
 const org=orgs.find(o=>o.id===orgId)??orgs[0]??demoOrganization;
 const members=people.filter(p=>p.orgId===org.id&&p.active);
 const template=useMemo(()=>meetingTemplate(org),[org]);
 const answers=drafts[org.id]??newDraft(org.siteIds[0]??"");
 const patch=(changes:Partial<FormAnswers>)=>setDrafts(old=>{
  const safe=Object.fromEntries(Object.entries(changes).filter(([,v])=>v!==undefined)) as FormAnswers;
  const current=old[org.id]??newDraft(org.siteIds[0]??"");
  const modified=Object.entries(safe).some(([key,value])=>!["chair_signature","minute_taker_signature"].includes(key)&&JSON.stringify(current[key])!==JSON.stringify(value));
  const next={...current,...safe};
  if(modified){delete next.chair_signature;delete next.minute_taker_signature;}
  return {...old,[org.id]:next};
 });
 const text=(key:string,value:string)=>patch({[key]:value});
 const selected=Array.isArray(answers.participants)?answers.participants as string[]:[];
 const apologyIds=Array.isArray(answers.apology_person_ids)?answers.apology_person_ids as string[]:[];
 const apologyDetails=rowValues(answers.apology_details),externalApologies=rowValues(answers.apology_entries);
 const attendance=meetingAttendanceCounts(answers);
 const attendees=rowValues(answers.attendees),actions=rowValues(answers.actions);
 const previousMeeting=useMemo(()=>forms.filter(f=>f.templateId===template.id&&
   ((f.templateSnapshot as typeof f.templateSnapshot&{organizationId?:string}).organizationId===org.id))
   .sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt))[0],[forms,template.id,org.id]);
 const records=forms.filter(f=>f.templateSnapshot.category==="Meetings"&&
  ((f.templateSnapshot as typeof f.templateSnapshot & {organizationId?:string}).organizationId===org.id||
   (!(f.templateSnapshot as typeof f.templateSnapshot&{organizationId?:string}).organizationId&&org.id===demoOrganization.id)));
 const allActions=records.flatMap(f=>rowValues(f.answers.actions));
 const openActions=allActions.filter(a=>String(a.state??"").toLowerCase()!=="closed");
 function listPatch(key:"attendees"|"actions"|"apology_entries"|"apology_details",idx:number,part:Partial<Row>){
  const rows=rowValues(answers[key]);
  patch({[key]:rows.map((r,i)=>i===idx?{...r,...(Object.fromEntries(Object.entries(part).filter(([,v])=>v!==undefined)) as Row)}:r)});
 }
 function addRow(key:"attendees"|"actions"|"apology_entries"){patch({[key]:[...rowValues(answers[key]),key==="attendees"?
   {attendee_name:"",attendee_company:"",attendee_role:"",attendee_ack:"No"}:key==="apology_entries"?
   {apology_name:"",apology_company:"",apology_status:"Apology received",apology_reason:"Not specified"}:
   {action:"",owner:"",due:"",state:"Open"}]});}
 function removeRow(key:"attendees"|"actions"|"apology_entries",index:number){patch({[key]:rowValues(answers[key]).filter((_,i)=>i!==index)});}
 function choosePresence(group:"present"|"absent",ids:string[]){
  const names=Object.fromEntries(members.map(p=>[p.id,p.displayName]));
  patch(updateMeetingAttendance(answers,group,ids,names));
 }
 function reuseMeetingPeople(){
  if(!previousMeeting)return;
  const prior=previousMeeting.answers;
  const scoped=new Set(members.map(p=>p.id));
  const ids=(Array.isArray(prior.participants)?prior.participants:[]).filter((id):id is string=>typeof id==="string"&&scoped.has(id));
  // Attendance is never automatically confirmed: operator explicitly chooses to reuse this list.
  choosePresence("present",ids);
  setMessage("Previous crew copied into this editable draft. Verify today's attendance before saving.");
 }
 function submit(){
  setMessage("");
  try{
   validateMeetingInput(answers);
   const full=makeSubmission({id:"MEETING-"+crypto.randomUUID(),template,answers,siteId:textValue(answers.meeting_site)||org.siteIds[0]||"Meeting location",
    taskId:textValue(answers.meeting_ref)||undefined,actorUid:"LOCAL-MEETING-OPERATOR",actorPersonId:actor||undefined,now:new Date().toISOString()});
   setForms(rs=>[full,...rs]);
   setMessage("Meeting register saved. It is now included in company/person analytics and can be exported as a filled PDF or Word file.");
   setEditing(false);
  }catch(e){setMessage(e instanceof Error?e.message:"Unable to save meeting register.");}
 }
 const kind=answers.meeting_type as string||meetingTypes[0];
 const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(215px,1fr))",gap:10} as React.CSSProperties;
 return <section aria-label="Meeting registers" style={{display:"grid",gap:14}}>
  <div style={{...box,background:"linear-gradient(110deg,#102642,#19568b)",color:"#fff",border:0,padding:22}}>
   <p style={{fontSize:11,fontWeight:900,letterSpacing:1.4,color:"#bfdbfe",margin:"0 0 7px"}}>COMPANY SHE · MEETING REGISTERS</p>
   <h2 style={{fontSize:25,margin:"0 0 9px"}}>Attendance, minutes and accountable actions.</h2>
   <p style={{fontSize:12,color:"#dbeafe",lineHeight:1.7,margin:0}}>Create toolbox talks, shift briefings, SHE committee registers and contractor meetings for {org.name}. Every record saves locally, contributes to participation analytics and exports in PDF, Word, CSV and JSON.</p>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:9}}>
   {[["Meeting registers",records.length],["People on company directory",members.length],["Registered attendees",records.reduce((a,r)=>a+(Array.isArray(r.answers.participants)?r.answers.participants.length:0)+rowValues(r.answers.attendees).length,0)],["Apologies / absent",records.reduce((sum,r)=>sum+meetingAttendanceCounts(r.answers).absent,0)],["Open action items",openActions.length]].map(([name,n])=><div key={String(name)} style={box}><strong style={{fontSize:26,color:"#174b87"}}>{n}</strong><p style={{margin:"6px 0 0",fontWeight:800,color:"#64748b",fontSize:11}}>{name}</p></div>)}
  </div>
  <div style={{...box,display:"flex",gap:9,alignItems:"center",flexWrap:"wrap",justifyContent:"space-between"}}>
   <div><strong>Start from a meeting type</strong><p style={{fontSize:11,color:"#64748b",margin:"4px 0"}}>Prepared company format · not a verified attendance signature</p></div>
   <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
    {(["SHE committee meeting","Toolbox safety talk","Pre-shift briefing","Contractor coordination"] as const).map(type=>
     <button key={type} style={{...btn,background:kind===type?"#dbeafe":"#fff",borderColor:kind===type?"#93c5fd":"#cbd5e1"}} onClick={()=>{patch({meeting_type:type});setEditing(true);}}>{type}</button>)}
   </div>
   <DocumentDownloadActions document={buildFormDocument({template,mode:"blank",company:org,people:members})} compact/>
  </div>
  {editing?<div style={{...box,display:"grid",gap:16}}>
   <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:9,flexWrap:"wrap"}}>
    <h3 style={{fontSize:19,margin:0}}>Create meeting register</h3>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><DocumentDownloadActions document={buildFormDocument({template,mode:"draft",answers,company:org,people:members})} compact/><button style={btn} onClick={()=>patch(newDraft(org.siteIds[0]??""))}>Clear draft</button></div>
   </div>
   <div style={grid}>
    <label style={label}>Meeting title *<input style={input} value={textValue(answers.meeting_title)} placeholder="Weekly SHE committee" onChange={e=>text("meeting_title",e.target.value)}/></label>
    <label style={label}>Meeting type *<select style={input} value={kind} onChange={e=>text("meeting_type",e.target.value)}>{meetingTypes.map(k=><option key={k}>{k}</option>)}</select></label>
    <label style={label}>Date *<input type="date" style={input} value={textValue(answers.meeting_date)} onChange={e=>text("meeting_date",e.target.value)}/></label>
    <label style={label}>Time<input type="time" style={input} value={textValue(answers.meeting_time)} onChange={e=>text("meeting_time",e.target.value)}/></label>
    <label style={label}>Work site / meeting room *<input list="movetrack-meeting-sites" style={input} value={textValue(answers.meeting_site)} onChange={e=>text("meeting_site",e.target.value)}/><datalist id="movetrack-meeting-sites">{org.siteIds.map(site=><option key={site} value={site}/>)}</datalist></label>
    <label style={label}>Reference<input style={input} value={textValue(answers.meeting_ref)} placeholder="SHE-MIN-2026-01" onChange={e=>text("meeting_ref",e.target.value)}/></label>
    <OrganizationPeopleComboBox people={members} orgId={org.id} label="Chairperson" value={textValue(answers.meeting_chair)?[textValue(answers.meeting_chair)]:[]} onChange={ids=>text("meeting_chair",ids[0]??"")}/>
    <label style={label}>Minute taker<input style={input} list="movetrack-meeting-members" value={textValue(answers.meeting_recorder)} onChange={e=>text("meeting_recorder",e.target.value)}/><datalist id="movetrack-meeting-members">{members.map(p=><option key={p.id} value={p.displayName}/>)}</datalist></label>
    <OrganizationPeopleComboBox people={members} orgId={org.id} label="Facilitator / submitted by" value={actor?[actor]:[]} onChange={ids=>setActor(ids[0]??"")}/>

   </div>
   <div style={{borderTop:"1px solid #e2e8f0",paddingTop:14,display:"grid",gap:10}}>
    <h3 style={{fontSize:17,margin:0}}><UsersRound size={18} style={{display:"inline",verticalAlign:"middle"}}/> Attendance register</h3>
    <p style={{fontSize:12,color:"#64748b",margin:0}}>Select staff from your company's directory; add external visitors and contractors separately. Selected employees appear in their personal participation analytics.</p>
    <OrganizationPeopleComboBox people={members} orgId={org.id} label="Organization meeting participants" multiple
     value={selected} onChange={ids=>choosePresence("present",ids)}
     placeholder="Search employees, UPN, department, city or email"/>
    <div style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
     <p style={{fontSize:11,color:"#64748b",margin:"0 0 4px"}}>{selected.length} present from {members.length} active people in {org.name}.</p>
     {previousMeeting?<button type="button" style={{...btn,padding:"7px 10px",minHeight:36,fontSize:11}} onClick={reuseMeetingPeople}>Reuse previous meeting crew</button>:null}
    </div>
    <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}><strong style={{fontSize:13}}>External/manual attendees ({attendees.length})</strong><button style={btn} onClick={()=>addRow("attendees")}><Plus size={14} style={{display:"inline"}}/> Add person</button></div>
    {attendees.map((r,i)=><div key={i} style={{...grid,background:"#f8fafc",padding:10,borderRadius:12}}>
     {([["attendee_name","Full name"],["attendee_company","Company / department"],["attendee_role","Role"]] as const).map(([key,title])=><label key={key} style={label}>{title}<input style={input} value={textValue(r[key])} onChange={e=>listPatch("attendees",i,{[key]:e.target.value})}/></label>)}
     <label style={label}>Attendance acknowledged (demo)<select style={input} value={textValue(r.attendee_ack)||"No"} onChange={e=>listPatch("attendees",i,{attendee_ack:e.target.value})}><option>No</option><option>Yes (unverified)</option></select></label>
     <button aria-label={"Remove attendee "+(i+1)} style={btn} onClick={()=>removeRow("attendees",i)}><Trash2 size={15} style={{display:"inline"}}/> Remove</button>
    </div>)}
    <div style={{border:"1px solid #bfdbfe",borderRadius:14,background:"#f0f6ff",padding:15,display:"grid",gap:12}}>
     <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"start",flexWrap:"wrap"}}>
      <div><strong style={{fontSize:15,color:"#143b66"}}>Apologies & absent persons</strong>
       <p style={{fontSize:12,color:"#53647e",margin:"5px 0 0"}}>Use the searchable company people picker, like Power Apps. Select several people at once; no need to retype names, job titles or departments.</p>
      </div>
      <span style={{background:"#dbeafe",color:"#1e40af",borderRadius:999,padding:"6px 10px",fontSize:11,fontWeight:850}}>{attendance.absent} absent / {attendance.present} present</span>
     </div>
     <OrganizationPeopleComboBox people={members} orgId={org.id} multiple
       label="Select staff who apologized or are absent"
       placeholder="Find absent colleagues by name, department or email"
       value={apologyIds} onChange={ids=>choosePresence("absent",ids)}/>
     {apologyDetails.map((r,i)=><div key={String(r.person_id??i)} style={{...box,display:"grid",gap:9,background:"#fff",padding:12}}>
       <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:9}}>
        <strong style={{fontSize:12}}>{members.find(p=>p.id===r.person_id)?.displayName??textValue(r.person_name)}</strong>
        <button type="button" aria-label={"Remove absent person "+(i+1)} style={{...btn,minHeight:33,padding:"5px 9px"}} onClick={()=>choosePresence("absent",apologyIds.filter(id=>id!==r.person_id))}><Trash2 size={15}/></button>
       </div>
       <div style={{...grid,gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))"}}>
        <label style={label}>Attendance status<select style={input} value={textValue(r.absence_status)||"Apology received"} onChange={e=>listPatch("apology_details",i,{absence_status:e.target.value})}>{apologyStatusOptions.map(option=><option key={option}>{option}</option>)}</select></label>
        <label style={label}>Reason (optional category)<select style={input} value={textValue(r.absence_reason)||"Not specified"} onChange={e=>listPatch("apology_details",i,{absence_reason:e.target.value})}>{apologyReasonOptions.map(option=><option key={option}>{option}</option>)}</select></label>
       </div>
       <label style={label}>Notes (optional)<input style={input} value={textValue(r.absence_note)} onChange={e=>listPatch("apology_details",i,{absence_note:e.target.value})} placeholder="Additional context only if needed"/></label>
      </div>)}
     <div style={{display:"flex",justifyContent:"space-between",gap:9,alignItems:"center",flexWrap:"wrap"}}>
      <strong style={{fontSize:12}}>External / contractor apologies ({externalApologies.length})</strong>
      <button type="button" style={btn} onClick={()=>addRow("apology_entries")}><Plus size={15} style={{display:"inline",verticalAlign:"middle"}}/> Add person</button>
     </div>
     {externalApologies.map((r,i)=><div key={i} style={{...box,display:"grid",gap:9,background:"#fff",padding:12}}>
       <div style={{...grid}}>
        <label style={label}>Person name *<input style={input} value={textValue(r.apology_name)} onChange={e=>listPatch("apology_entries",i,{apology_name:e.target.value})} placeholder="External visitor / contractor"/></label>
        <label style={label}>Company / department<input style={input} value={textValue(r.apology_company)} onChange={e=>listPatch("apology_entries",i,{apology_company:e.target.value})}/></label>
        <label style={label}>Attendance status<select style={input} value={textValue(r.apology_status)||"Apology received"} onChange={e=>listPatch("apology_entries",i,{apology_status:e.target.value})}>{apologyStatusOptions.map(option=><option key={option}>{option}</option>)}</select></label>
        <label style={label}>Reason<select style={input} value={textValue(r.apology_reason)||"Not specified"} onChange={e=>listPatch("apology_entries",i,{apology_reason:e.target.value})}>{apologyReasonOptions.map(option=><option key={option}>{option}</option>)}</select></label>
       </div>
       <button type="button" style={{...btn,justifySelf:"start",minHeight:35}} onClick={()=>removeRow("apology_entries",i)}><Trash2 size={14} style={{display:"inline"}}/> Remove</button>
      </div>)}
     <label style={label}>Additional apology notes (optional)<textarea style={{...input,minHeight:60}} value={textValue(answers.apologies)} onChange={e=>text("apologies",e.target.value)} placeholder="Only if information is not covered above"/></label>
     <p style={{fontSize:11,color:"#53647e",margin:0}}>An absent person is not counted as present or marked as having participated in the meeting. You can switch someone between Present and Absent using the two pickers.</p>
    </div>
   </div>
   <div style={{borderTop:"1px solid #e2e8f0",paddingTop:14,display:"grid",gap:10}}>
    <h3 style={{fontSize:17,margin:0}}><FileText size={18} style={{display:"inline",verticalAlign:"middle"}}/> Agenda and minutes</h3>
    {([["agenda","Agenda / planned topics *"],["safety_highlights","Safety moment / hazards"],["minutes","Meeting discussions and minutes *"],["decisions","Decisions / resolutions"],["outstanding","Outstanding matters / closeout"]] as const).map(([key,title])=>
      <label key={key} style={label}>{title}<textarea style={{...input,minHeight:85}} value={textValue(answers[key])} onChange={e=>text(key,e.target.value)}/></label>)}
   </div>
   <div style={{borderTop:"1px solid #e2e8f0",paddingTop:14,display:"grid",gap:10}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:8,flexWrap:"wrap",alignItems:"center"}}><h3 style={{fontSize:17,margin:0}}><ClipboardList size={18} style={{display:"inline",verticalAlign:"middle"}}/> Corrective actions</h3><button style={btn} onClick={()=>addRow("actions")}><Plus size={15} style={{display:"inline"}}/> Add action</button></div>
    {actions.length===0?<p style={{fontSize:12,color:"#64748b",margin:0}}>No actions recorded yet. Add an action with its responsible owner, due date and status when necessary.</p>:null}
    {actions.map((r,i)=><div key={i} style={{...grid,background:"#f8fafc",padding:10,borderRadius:12}}>
     <label style={label}>Action description *<input style={input} value={textValue(r.action)} onChange={e=>listPatch("actions",i,{action:e.target.value})}/></label>
     <label style={label}>Accountable owner *
      <input list={"movetrack-action-owners-"+i} style={input} value={textValue(r.owner)} onChange={e=>listPatch("actions",i,{owner:e.target.value})} placeholder="Pick from employees or type an external person"/>
      <datalist id={"movetrack-action-owners-"+i}>{members.map(p=><option key={p.id} value={p.displayName}/>)}</datalist>
     </label>
     <label style={label}>Due date<input type="date" style={input} value={textValue(r.due)} onChange={e=>listPatch("actions",i,{due:e.target.value})}/></label>
     <label style={label}>Status<select style={input} value={textValue(r.state)||"Open"} onChange={e=>listPatch("actions",i,{state:e.target.value})}><option>Open</option><option>In progress</option><option>Closed</option></select></label>
     <button style={btn} onClick={()=>removeRow("actions",i)}><Trash2 size={15} style={{display:"inline"}}/> Remove</button>
    </div>)}
    <div style={grid}><label style={label}>Next review / meeting<input type="date" style={input} value={textValue(answers.next_meeting)} onChange={e=>text("next_meeting",e.target.value)}/></label><label style={label}>Prepared by<input style={input} value={textValue(answers.prepared_by)} onChange={e=>text("prepared_by",e.target.value)}/></label></div>
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
    <SignatureApprovalTray compact label="Chairperson signature" value={isSignatureEvidence(answers.chair_signature)?answers.chair_signature:null}
     scope={textValue(answers.meeting_title)||"Meeting register"} role="Meeting chairperson" intent="attendance"
     defaultSignerName={members.find(p=>p.id===answers.meeting_chair)?.displayName||textValue(answers.meeting_chair_manual)}
     signerPersonId={typeof answers.meeting_chair==="string"?answers.meeting_chair:undefined}
     onChange={signature=>patch({chair_signature:signature??null})}/>
    <SignatureApprovalTray compact label="Minute taker signature" value={isSignatureEvidence(answers.minute_taker_signature)?answers.minute_taker_signature:null}
     scope={textValue(answers.meeting_title)||"Meeting register"} role="Minute taker" intent="attendance"
     defaultSignerName={textValue(answers.meeting_recorder)}
     onChange={signature=>patch({minute_taker_signature:signature??null})}/>
   </div>
   <div style={{display:"flex",gap:9,alignItems:"center",flexWrap:"wrap",justifyContent:"space-between"}}>
    <span style={{fontSize:11,color:"#64748b"}}>Signature marks and drafts save locally; identity and authorization are not verified.</span>
    <button style={primary} onClick={submit}><CheckCircle2 size={16} style={{display:"inline",verticalAlign:"middle"}}/> Save meeting register & minutes</button>
   </div>
  </div>:<div style={{...box,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
    <p style={{fontSize:12,color:"#475569",margin:0}}>Meeting saved. Start a new register or reopen the unsent draft.</p>
    <button style={primary} onClick={()=>{patch(newDraft(org.siteIds[0]??""));setEditing(true);setMessage("");}}><Plus size={15} style={{display:"inline"}}/> New meeting</button>
   </div>}
  {message?<p role="status" style={{...box,background:"#eff6ff",borderColor:"#bfdbfe",color:"#1e40af",fontSize:12}}>{message}</p>:null}
  <div style={{...box,display:"grid",gap:11}}>
   <div style={{display:"flex",justifyContent:"space-between",gap:9,alignItems:"center",flexWrap:"wrap"}}><h3 style={{fontSize:18,margin:0}}>Saved meeting registers & briefings</h3><button style={btn} onClick={()=>setEditing(true)}>Open draft</button></div>
   {!records.length?<p style={{fontSize:12,color:"#64748b"}}>No completed meeting records yet. Your first register will appear here and in participation analytics.</p>:null}
   {records.map(r=><div key={r.id} style={{display:"flex",gap:10,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",border:"1px solid #e2e8f0",padding:13,borderRadius:12}}>
    <div><strong>{textValue(r.answers.meeting_title)||r.templateSnapshot.title}</strong>
     <p style={{fontSize:11,color:"#64748b",margin:"5px 0"}}>{textValue(r.answers.meeting_type)||"SHE meeting"} · {textValue(r.answers.meeting_date)||new Date(r.submittedAt).toLocaleDateString()} · {r.siteId}</p>
     <span style={{fontSize:11,color:"#2563eb"}}>{meetingAttendanceCounts(r.answers).present} attendee(s) · {meetingAttendanceCounts(r.answers).absent} apologies/absent · {rowValues(r.answers.actions).length} action(s)</span>
    </div>
    <DocumentDownloadActions document={buildFormDocument({template:r.templateSnapshot,mode:"filled",submission:r,company:org,people:members})} compact/>
   </div>)}
  </div>
  <p style={{fontSize:11,color:"#64748b",margin:0}}>Registers are simulations with unverified acknowledgements. For legally controlled attendance registers, identity, signatures, retention, privacy and supervisor approval must be implemented server-side.</p>
 </section>;
}
