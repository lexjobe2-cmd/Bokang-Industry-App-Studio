"use client";
import {useMemo,useState} from "react";
import {CalendarDays,UsersRound,ClipboardList,Plus,Trash2,CheckCircle2,FileText} from "lucide-react";
import {usePersistentState} from "@bokang/persistence";
import {ASSURANCE_STORAGE,demoOrganization,demoPeople,type PersonRecord,type OrganizationProfile} from "@bokang/domain-data/custom-assurance";
import {meetingTypes,meetingTemplate,validateMeetingInput,type MeetingType} from "@bokang/domain-data/meeting-register";
import {makeSubmission,type FormAnswers,type FormSubmission,type PrimitiveAnswer} from "@bokang/domain-data/assurance-forms";
import {buildFormDocument} from "../../lib/form-exports";
import {DocumentDownloadActions} from "./DocumentDownloadActions";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {SignatureCapture} from "./SignatureCapture";
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
 meeting_site:site,participants:[],attendees:[],agenda:"",minutes:"",decisions:"",actions:[]
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
 const attendees=rowValues(answers.attendees),actions=rowValues(answers.actions);
 const records=forms.filter(f=>f.templateSnapshot.category==="Meetings"&&
  ((f.templateSnapshot as typeof f.templateSnapshot & {organizationId?:string}).organizationId===org.id||
   (!(f.templateSnapshot as typeof f.templateSnapshot&{organizationId?:string}).organizationId&&org.id===demoOrganization.id)));
 const allActions=records.flatMap(f=>rowValues(f.answers.actions));
 const openActions=allActions.filter(a=>String(a.state??"").toLowerCase()!=="closed");
 function listPatch(key:"attendees"|"actions",idx:number,part:Partial<Row>){
  const rows=rowValues(answers[key]);
  patch({[key]:rows.map((r,i)=>i===idx?{...r,...(Object.fromEntries(Object.entries(part).filter(([,v])=>v!==undefined)) as Row)}:r)});
 }
 function addRow(key:"attendees"|"actions"){patch({[key]:[...rowValues(answers[key]),key==="attendees"?{attendee_name:"",attendee_company:"",attendee_role:"",attendee_ack:"No"}:{action:"",owner:"",due:"",state:"Open"}]});}
 function removeRow(key:"attendees"|"actions",index:number){patch({[key]:rowValues(answers[key]).filter((_,i)=>i!==index)});}
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
   {[["Meeting registers",records.length],["People on company directory",members.length],["Registered attendees",records.reduce((a,r)=>a+(Array.isArray(r.answers.participants)?r.answers.participants.length:0)+rowValues(r.answers.attendees).length,0)],["Open action items",openActions.length]].map(([name,n])=><div key={String(name)} style={box}><strong style={{fontSize:26,color:"#174b87"}}>{n}</strong><p style={{margin:"6px 0 0",fontWeight:800,color:"#64748b",fontSize:11}}>{name}</p></div>)}
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
    <label style={label}>Work site / meeting room *<input style={input} value={textValue(answers.meeting_site)} onChange={e=>text("meeting_site",e.target.value)}/></label>
    <label style={label}>Reference<input style={input} value={textValue(answers.meeting_ref)} placeholder="SHE-MIN-2026-01" onChange={e=>text("meeting_ref",e.target.value)}/></label>
    <label style={label}>Chairperson<select style={input} value={textValue(answers.meeting_chair)} onChange={e=>text("meeting_chair",e.target.value)}><option value="">Select a person</option>{members.map(p=><option key={p.id} value={p.id}>{p.displayName} · {p.jobTitle}</option>)}</select></label>
    <label style={label}>Minute taker<input style={input} value={textValue(answers.meeting_recorder)} onChange={e=>text("meeting_recorder",e.target.value)}/></label>
    <label style={label}>Local author / submitted by<select style={input} value={actor} onChange={e=>setActor(e.target.value)}><option value="">Anonymous demo facilitator</option>{members.map(p=><option key={p.id} value={p.id}>{p.displayName}</option>)}</select></label>
   </div>
   <div style={{borderTop:"1px solid #e2e8f0",paddingTop:14,display:"grid",gap:10}}>
    <h3 style={{fontSize:17,margin:0}}><UsersRound size={18} style={{display:"inline",verticalAlign:"middle"}}/> Attendance register</h3>
    <p style={{fontSize:12,color:"#64748b",margin:0}}>Select staff from your company's directory; add external visitors and contractors separately. Selected employees appear in their personal participation analytics.</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:7}}>
     {members.map(p=><button key={p.id} aria-pressed={selected.includes(p.id)}
      style={{...btn,textAlign:"left",background:selected.includes(p.id)?"#eff6ff":"#fff",borderColor:selected.includes(p.id)?"#93c5fd":"#cbd5e1"}}
      onClick={()=>patch({participants:selected.includes(p.id)?selected.filter(x=>x!==p.id):[...selected,p.id]})}>
      {selected.includes(p.id)?"✓ ":"○ "}{p.displayName}<span style={{display:"block",fontSize:10,color:"#64748b"}}>{p.jobTitle} · {p.department}</span></button>)}
    </div>
    <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}><strong style={{fontSize:13}}>External/manual attendees ({attendees.length})</strong><button style={btn} onClick={()=>addRow("attendees")}><Plus size={14} style={{display:"inline"}}/> Add person</button></div>
    {attendees.map((r,i)=><div key={i} style={{...grid,background:"#f8fafc",padding:10,borderRadius:12}}>
     {([["attendee_name","Full name"],["attendee_company","Company / department"],["attendee_role","Role"]] as const).map(([key,title])=><label key={key} style={label}>{title}<input style={input} value={textValue(r[key])} onChange={e=>listPatch("attendees",i,{[key]:e.target.value})}/></label>)}
     <label style={label}>Attendance acknowledged (demo)<select style={input} value={textValue(r.attendee_ack)||"No"} onChange={e=>listPatch("attendees",i,{attendee_ack:e.target.value})}><option>No</option><option>Yes (unverified)</option></select></label>
     <button aria-label={"Remove attendee "+(i+1)} style={btn} onClick={()=>removeRow("attendees",i)}><Trash2 size={15} style={{display:"inline"}}/> Remove</button>
    </div>)}
    <label style={label}>Apologies and absentees<textarea style={{...input,minHeight:65}} value={textValue(answers.apologies)} onChange={e=>text("apologies",e.target.value)}/></label>
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
     <label style={label}>Accountable owner *<input style={input} value={textValue(r.owner)} onChange={e=>listPatch("actions",i,{owner:e.target.value})}/></label>
     <label style={label}>Due date<input type="date" style={input} value={textValue(r.due)} onChange={e=>listPatch("actions",i,{due:e.target.value})}/></label>
     <label style={label}>Status<select style={input} value={textValue(r.state)||"Open"} onChange={e=>listPatch("actions",i,{state:e.target.value})}><option>Open</option><option>In progress</option><option>Closed</option></select></label>
     <button style={btn} onClick={()=>removeRow("actions",i)}><Trash2 size={15} style={{display:"inline"}}/> Remove</button>
    </div>)}
    <div style={grid}><label style={label}>Next review / meeting<input type="date" style={input} value={textValue(answers.next_meeting)} onChange={e=>text("next_meeting",e.target.value)}/></label><label style={label}>Prepared by<input style={input} value={textValue(answers.prepared_by)} onChange={e=>text("prepared_by",e.target.value)}/></label></div>
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
    <SignatureCapture compact value={isSignatureEvidence(answers.chair_signature)?answers.chair_signature:null}
     scope={textValue(answers.meeting_title)||"Meeting register"} role="Meeting chairperson" intent="attendance"
     defaultSignerName={members.find(p=>p.id===answers.meeting_chair)?.displayName||textValue(answers.meeting_chair_manual)}
     signerPersonId={typeof answers.meeting_chair==="string"?answers.meeting_chair:undefined}
     onChange={signature=>patch({chair_signature:signature??null})}/>
    <SignatureCapture compact value={isSignatureEvidence(answers.minute_taker_signature)?answers.minute_taker_signature:null}
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
     <span style={{fontSize:11,color:"#2563eb"}}>{(Array.isArray(r.answers.participants)?r.answers.participants.length:0)+rowValues(r.answers.attendees).length} attendee(s) · {rowValues(r.answers.actions).length} action(s)</span>
    </div>
    <DocumentDownloadActions document={buildFormDocument({template:r.templateSnapshot,mode:"filled",submission:r,company:org,people:members})} compact/>
   </div>)}
  </div>
  <p style={{fontSize:11,color:"#64748b",margin:0}}>Registers are simulations with unverified acknowledgements. For legally controlled attendance registers, identity, signatures, retention, privacy and supervisor approval must be implemented server-side.</p>
 </section>;
}
