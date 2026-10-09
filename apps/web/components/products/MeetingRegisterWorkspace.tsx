"use client";
import {DesktopModalDisclosure} from "./DesktopModal";
import {useMemo,useState} from "react";
import {CalendarDays,UsersRound,ClipboardList,Plus,Trash2,CheckCircle2,FileText} from "lucide-react";
import {usePersistentState} from "@bokang/persistence";
import {ASSURANCE_STORAGE,demoOrganization,demoPeople,type PersonRecord,type OrganizationProfile} from "@bokang/domain-data/custom-assurance";
import {meetingTypes,meetingTemplate,validateMeetingInput,updateMeetingAttendance,meetingAttendanceCounts,apologyStatusOptions,apologyReasonOptions,carryForwardMeetingActions,presenceStatusOptions,notificationStatusOptions,buildMeetingAnalytics,continueMeetingSeries,meetingSeriesRecords,currentMeetingActions,type MeetingType} from "@bokang/domain-data/meeting-register";
import {makeSubmission,type FormAnswers,type FormSubmission,type PrimitiveAnswer} from "@bokang/domain-data/assurance-forms";
import {buildFormDocument} from "../../lib/form-exports";
import {DocumentDownloadActions} from "./DocumentDownloadActions";
import {OrganizationPeopleComboBox} from "./OrganizationPeopleComboBox";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {SignatureApprovalTray} from "./SignatureApprovalTray";
import {isSignatureEvidence,type SignatureEvidence} from "@bokang/domain-data/signature-evidence";
import {RepeatableRowActions} from "./RepeatableRowActions";
import {moveRegisterRow,duplicateRegisterRow} from "@bokang/domain-data/repeatable-register";
import {OperationalTextAssist} from "./OperationalTextAssist";
import {TaskWorkspace,useDesktopWorkspace} from "./TaskWorkspace";
import {ACTIVE_PERSON_KEY} from "./UserParticipationAnalytics";

const box:React.CSSProperties={background:"var(--mt-surface,#fff)",border:"1px solid var(--mt-border,#d8e3f0)",padding:17,borderRadius:15,color:"var(--mt-ink,#172b46)"};
const label:React.CSSProperties={display:"grid",gap:6,fontSize:12,color:"var(--mt-ink,#364152)",fontWeight:800};
const input:React.CSSProperties={width:"100%",border:"1px solid var(--mt-border,#d8e3f0)",padding:"11px 12px",minHeight:44,borderRadius:10,font:"inherit",background:"var(--mt-surface-soft,#f8fafc)",color:"var(--mt-ink,#172b46)"};
const btn:React.CSSProperties={border:"1px solid var(--mt-border,#d8e3f0)",borderRadius:11,padding:"10px 13px",fontWeight:850,background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#172b46)",minHeight:44,cursor:"pointer"};
const primary:React.CSSProperties={...btn,background:"#1d4ed8",borderColor:"#1d4ed8",color:"#fff"};
type Row=Record<string,PrimitiveAnswer>;
const rowValues=(v:unknown):Row[]=>Array.isArray(v)?v.filter(r=>r&&typeof r==="object"&&!Array.isArray(r)) as Row[]:[];
const textValue=(v:unknown)=>typeof v==="string"?v:"";
const newDraft=(site:string,type:MeetingType="SHE committee meeting"):FormAnswers=>({
 meeting_title:"",meeting_type:type,meeting_date:new Date().toISOString().slice(0,10),
 meeting_site:site,participants:[],attendees:[],apology_person_ids:[],apology_details:[],apology_entries:[],apologies:"",agenda:"",minutes:"",decisions:"",actions:[]
});
export function MeetingRegisterWorkspace(){
 const desktop=useDesktopWorkspace();
 const [personFocus,setPersonFocus]=useState("");
 const [apologyFocus,setApologyFocus]=useState("");
 const [actionFocus,setActionFocus]=useState(0);
 const [orgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [orgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [people]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [actor,setActor]=usePersistentState(ACTIVE_PERSON_KEY,"");
 const [forms,setForms]=usePersistentState<FormSubmission[]>("bokang-studio.move-track.assurance-submissions.v1",[]);
 const [drafts,setDrafts]=usePersistentState<Record<string,FormAnswers>>("bokang-studio.move-track.meeting.drafts.v1",{});
 const [editing,setEditing]=useState(true);
 const [page,setPage]=useState<"draft"|"records">("draft");
 const [steps,setSteps]=usePersistentState<Record<string,number>>("bokang-studio.move-track.meeting.steps.v1",{});
 const [message,setMessage]=useState("");
 const org=orgs.find(o=>o.id===orgId)??orgs[0]??demoOrganization;
 const step=Math.max(0,Math.min(4,steps[org.id]??0));
 function goStep(next:number){setSteps(old=>({...old,[org.id]:next}));window.requestAnimationFrame(()=>document.getElementById("meeting-editor")?.scrollIntoView({block:"start"}));}
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
 const attendanceDetails=rowValues(answers.attendance_details);
 const attendees=rowValues(answers.attendees),actions=rowValues(answers.actions);

 const records=forms.filter(f=>f.templateSnapshot.category==="Meetings"&&
  ((f.templateSnapshot as typeof f.templateSnapshot & {organizationId?:string}).organizationId===org.id||
   (!(f.templateSnapshot as typeof f.templateSnapshot&{organizationId?:string}).organizationId&&org.id===demoOrganization.id)));
 const seriesRecords=answers.meeting_series_id?meetingSeriesRecords(records,org.id,String(answers.meeting_series_id)):[];
 const previousMeeting=answers.previous_meeting_id?seriesRecords.find(r=>r.id===answers.previous_meeting_id):undefined;
 const seriesHeads=[...new Set(records.map(r=>textValue(r.answers.meeting_series_id)).filter(Boolean))].map(id=>meetingSeriesRecords(records,org.id,id)[0]!).filter(Boolean);
 function startOccurrence(record:FormSubmission){
  record=seriesHeads.find(r=>r.answers.meeting_series_id===record.answers.meeting_series_id)??record;
  if(Object.values(answers).some(v=>typeof v==="string"&&v.trim())&&!window.confirm("Start the next series meeting? This replaces the active editable draft; saved meeting records stay intact."))return;
  try{setDrafts(old=>({...old,[org.id]:continueMeetingSeries(record,org.id,members)}));setEditing(true);setPage("draft");goStep(0);setMessage("Next occurrence prepared. Review previous minutes, due dates and invited people; attendance has not been copied.");}catch(e){setMessage(String(e));}
 }
 const meetingMetrics=buildMeetingAnalytics({forms:records,people:members,orgId:org.id});
 const allActions=currentMeetingActions(records);
 const openActions=allActions.filter(a=>String(a.state??"").toLowerCase()!=="closed");
 function listPatch(key:"attendees"|"actions"|"apology_entries"|"apology_details"|"attendance_details",idx:number,part:Partial<Row>){
  const rows=rowValues(answers[key]);
  if(key==="actions"&&rows[idx]?.nlp_source&&!Object.hasOwn(part,"nlp_reviewed"))part={...part,nlp_reviewed:false};
  patch({[key]:rows.map((r,i)=>i===idx?{...r,...(Object.fromEntries(Object.entries(part).filter(([,v])=>v!==undefined)) as Row)}:r)});
 }
 function addRow(key:"attendees"|"actions"|"apology_entries"){patch({[key]:[...rowValues(answers[key]),key==="attendees"?
   {attendee_name:"",attendee_company:"",attendee_role:"",attendee_ack:"No"}:key==="apology_entries"?
   {apology_name:"",apology_company:"",apology_status:"Apology received",apology_reason:"Not specified"}:
   {action:"",owner:"",due:"",state:"Open",action_id:"ACTION-"+crypto.randomUUID()}]});}
 function removeRow(key:"attendees"|"actions"|"apology_entries",index:number){patch({[key]:rowValues(answers[key]).filter((_,i)=>i!==index)});}
 function choosePresence(group:"present"|"absent",ids:string[]){
  const names=Object.fromEntries(members.map(p=>[p.id,p.displayName]));
  patch(updateMeetingAttendance(answers,group,ids,names,members));
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
 function reuseOpenActions(){
  if(!previousMeeting)return;
  const {rows,added}=carryForwardMeetingActions(answers,previousMeeting.answers,members);
  if(!added){setMessage("No new unresolved actions to carry forward. Existing actions were preserved.");return;}
  patch({actions:rows.map(row=>{const index=rowValues(previousMeeting.answers.actions).findIndex(r=>r.action===row.action);const source=rowValues(previousMeeting.answers.actions)[index];return row.carried_from?{...row,action_id:source?.action_id??previousMeeting.id+":action:"+index,origin_meeting_id:source?.origin_meeting_id??previousMeeting.id,previous_due:source?.due??"",carried_from:previousMeeting.id}:row;}) as Row[]});
  setMessage(added+" open action(s) copied. Verify each owner, new due date and status before recording today's minutes.");
 }
 function reuseAgenda(){
  if(!previousMeeting)return;
  if(textValue(answers.agenda).trim()&&!window.confirm("Replace the current agenda with last meeting's topics? Current minutes and signatures will not be copied."))return;
  patch({agenda:textValue(previousMeeting.answers.agenda)});
  setMessage("Agenda topics copied for editing. Meeting minutes, attendance and signatures remain specific to this meeting.");
 }
 function submit(){
  setMessage("");
  try{
   validateMeetingInput(answers);
   const snapshotAnswers={...answers,actions:actions.map(row=>({...row,action_id:row.action_id||"ACTION-"+crypto.randomUUID()})),meeting_people_snapshot:members.map(p=>({person_id:p.id,person_name:p.displayName,department:p.department,job_title:p.jobTitle}))};
   const full=makeSubmission({id:"MEETING-"+crypto.randomUUID(),template,answers:snapshotAnswers,siteId:textValue(answers.meeting_site)||org.siteIds[0]||"Meeting location",
    taskId:textValue(answers.meeting_ref)||undefined,actorUid:"LOCAL-MEETING-OPERATOR",actorPersonId:actor||undefined,now:new Date().toISOString()});
   setForms(rs=>[full,...rs]);
   setMessage("Meeting register saved. It is now included in company/person analytics and can be exported as a filled PDF or Word file.");
   setEditing(false);setPage("records");
  }catch(e){const error=e instanceof Error?e.message:"Unable to save meeting register.";setMessage(error);goStep(/agenda|minutes|discussion/i.test(error)?2:/action|owner|due/i.test(error)?3:/attendance|attendee|apolog|participant/i.test(error)?1:0);}
 }
 const kind=answers.meeting_type as string||meetingTypes[0];
 const quickAgenda=["Safety moment","Previous action follow-up","Incident and near-miss learnings","Job hazards and critical controls","Training and competency","Decisions and responsible owners","Next meeting arrangements"];
 function addAgendaTopic(topic:string){
  const current=textValue(answers.agenda).trim();
  if(current.split("\n").some(line=>line.replace(/^[-• ]+/,"").trim()===topic))return;
  text("agenda",(current?current+"\n":"")+"• "+topic);
 }
 const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,215px),1fr))",gap:10} as React.CSSProperties;
 return <section aria-label="Meeting registers" style={{display:"grid",gap:14}}>
  <div hidden={page==="draft"} style={{...box,background:"linear-gradient(110deg,#102642,#19568b)",color:"#fff",border:0,padding:22}}>
   <p style={{fontSize:11,fontWeight:900,letterSpacing:1.4,color:"#bfdbfe",margin:"0 0 7px"}}>COMPANY SHE · MEETING REGISTERS</p>
   <h2 style={{fontSize:25,margin:"0 0 9px"}}>Attendance, minutes and accountable actions.</h2>
   <p style={{fontSize:12,color:"#dbeafe",lineHeight:1.7,margin:0}}>Create toolbox talks, shift briefings, SHE committee registers and contractor meetings for {org.name}. Every record saves locally, contributes to participation analytics and exports in PDF, Word, CSV and JSON.</p>
  </div>
  <nav className="movetrack-step-nav" aria-label="Meeting workspace pages"><button type="button" aria-current={page==="draft"?"step":undefined} onClick={()=>{setPage("draft");setEditing(true);}}>Edit meeting</button><button type="button" aria-current={page==="records"?"step":undefined} onClick={()=>setPage("records")}>Saved records ({records.length})</button></nav>
  <DesktopModalDisclosure title="Departmental meeting series"><div style={box}>
   <h3 style={{margin:"0 0 8px"}}>Departmental meeting series</h3><p style={{fontSize:12}}>Monthly, weekly or quarterly continuity. Start the next occurrence from a saved series, review previous minutes and track open actions.</p>
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{seriesHeads.map(r=><button type="button" key={String(r.answers.meeting_series_id)} className="movetrack-ui-button" data-mt-variant="secondary" style={btn} onClick={()=>startOccurrence(r)}>Next: {textValue(r.answers.meeting_series_name)} · {textValue(r.answers.meeting_department)}</button>)}</div>
   {!seriesHeads.length?<p style={{fontSize:12}}>Enable a recurring series in Meeting details, then save its first meeting.</p>:null}
  </div></DesktopModalDisclosure>
  <div hidden={page!=="records"} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,155px),1fr))",gap:9}}>
   {[["Meeting registers",records.length],["People on company directory",members.length],["Registered attendees",records.reduce((a,r)=>a+(Array.isArray(r.answers.participants)?r.answers.participants.length:0)+rowValues(r.answers.attendees).length,0)],["Apologies / absent",records.reduce((sum,r)=>sum+meetingAttendanceCounts(r.answers).absent,0)],["Open action items",openActions.length],["Attendance rate",meetingMetrics.attendanceRate===null?"—":meetingMetrics.attendanceRate+"%"],["Apologies received",meetingMetrics.apologies],["Overdue actions",meetingMetrics.overdue]].map(([name,n])=><div key={String(name)} style={box}><strong style={{fontSize:26,color:"var(--mt-link,#174b87)"}}>{n}</strong><p style={{margin:"6px 0 0",fontWeight:800,color:"var(--mt-muted,#64748b)",fontSize:11}}>{name}</p></div>)}
  </div>
  <div hidden={page!=="draft"||step!==0} style={{...box,display:"flex",gap:9,alignItems:"center",flexWrap:"wrap",justifyContent:"space-between"}}>
   <div><strong>Start from a meeting type</strong><p style={{fontSize:11,color:"var(--mt-muted,#64748b)",margin:"4px 0"}}>Prepared company format · not a verified attendance signature</p></div>
   <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
    {(["SHE committee meeting","Toolbox safety talk","Pre-shift briefing","Contractor coordination"] as const).map(type=>
     <button key={type} className="movetrack-ui-button" data-mt-variant={kind===type?"selected":"secondary"} style={{...btn,background:kind===type?"var(--mt-surface-soft,#dbeafe)":"var(--mt-surface,#fff)",borderColor:kind===type?"#93c5fd":"#cbd5e1"}} onClick={()=>{patch({meeting_type:type,...(!textValue(answers.meeting_title).trim()?{meeting_title:type}:{} )});setEditing(true);}}>{type}</button>)}
   </div>
   <DocumentDownloadActions document={buildFormDocument({template,mode:"blank",company:org,people:members})} compact/>
  </div>
  {editing?<div hidden={page!=="draft"}><TaskWorkspace title="Meeting" steps={["Details","Attendance","Minutes","Actions","Review"]} current={step} onChange={goStep}
    summary={<><strong>{textValue(answers.meeting_title)||"New meeting"}</strong><p>{textValue(answers.meeting_date)} · {org.name}</p>{answers.meeting_series_id?<p>{textValue(answers.meeting_series_name)} · {textValue(answers.meeting_department)} · {textValue(answers.meeting_cadence)}</p>:null}<strong>{attendance.present} present · {attendance.absent} absent</strong><p>{actions.length} actions · Draft autosaves locally</p><details><summary>Draft exports</summary><DocumentDownloadActions document={buildFormDocument({template,mode:"draft",answers,company:org,people:members})} compact/></details><p>Attendance and drawn acknowledgements remain unverified.</p></>}>
   <div id="meeting-editor" style={{...box,display:"grid",gap:16,scrollMarginTop:80}}>
   <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:9,flexWrap:"wrap"}}>
    <h3 style={{fontSize:19,margin:0}}>Create meeting register</h3>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button className="movetrack-ui-button" data-mt-variant="secondary" style={btn} onClick={()=>{if(window.confirm("Clear this meeting draft? Saved records will remain.")){patch(newDraft(org.siteIds[0]??""));goStep(0);}}}>Clear draft</button></div>
   </div>
   <div hidden={step!==0} style={grid}>
    <label style={label}>Meeting title *<input style={input} value={textValue(answers.meeting_title)} placeholder="Weekly SHE committee" onChange={e=>text("meeting_title",e.target.value)}/></label>
    <label style={label}>Meeting type *<select style={input} value={kind} onChange={e=>text("meeting_type",e.target.value)}>{meetingTypes.map(k=><option key={k}>{k}</option>)}</select></label>
    <label style={label}>Date *<input type="date" style={input} value={textValue(answers.meeting_date)} onChange={e=>text("meeting_date",e.target.value)}/></label>
    <label style={label}>Time<input type="time" style={input} value={textValue(answers.meeting_time)} onChange={e=>text("meeting_time",e.target.value)}/></label>
    <label style={label}>Work site / meeting room *<input list="movetrack-meeting-sites" style={input} value={textValue(answers.meeting_site)} onChange={e=>text("meeting_site",e.target.value)}/><datalist id="movetrack-meeting-sites">{org.siteIds.map(site=><option key={site} value={site}/>)}</datalist></label>
    <label style={label}>Reference<input style={input} value={textValue(answers.meeting_ref)} placeholder="SHE-MIN-2026-01" onChange={e=>text("meeting_ref",e.target.value)}/></label>
    <label style={label}><span><input type="checkbox" checked={!!answers.meeting_series_id} onChange={e=>patch(e.target.checked?{meeting_series_id:"SERIES-"+crypto.randomUUID(),meeting_series_name:textValue(answers.meeting_title),meeting_cadence:"Monthly",meeting_department:""}:{meeting_series_id:"",meeting_series_name:"",meeting_department:"",meeting_cadence:"",previous_meeting_id:"",previous_meeting_title:"",previous_meeting_date:"",minutes_adoption:"",minutes_amendments:""})}/> Recurring departmental meeting</span></label>
    {answers.meeting_series_id?<>
     <label style={label}>Series name *<input style={input} value={textValue(answers.meeting_series_name)} onChange={e=>text("meeting_series_name",e.target.value)}/></label>
     <label style={label}>Department *<input style={input} list="meeting-departments" value={textValue(answers.meeting_department)} onChange={e=>text("meeting_department",e.target.value)}/><datalist id="meeting-departments">{[...new Set(members.map(p=>p.department).filter(Boolean))].map(d=><option key={d} value={d}/>)}</datalist></label>
     <label style={label}>Recurrence<select style={input} value={textValue(answers.meeting_cadence)||"Monthly"} onChange={e=>text("meeting_cadence",e.target.value)}>{["Monthly","Weekly","Quarterly"].map(v=><option key={v}>{v}</option>)}</select></label>
     <label style={label}>Previous meeting in this series<select style={input} value={textValue(answers.previous_meeting_id)} onChange={e=>{const r=seriesRecords.find(r=>r.id===e.target.value);patch({previous_meeting_id:r?.id??"",previous_meeting_title:r?textValue(r.answers.meeting_title):"",previous_meeting_date:r?textValue(r.answers.meeting_date):"",minutes_adoption:r?"Pending review":"",minutes_amendments:"",minutes_adopted_by:"",minutes_adopted_date:""});}}><option value="">First meeting / no previous record</option>{seriesRecords.map(r=><option key={r.id} value={r.id}>{textValue(r.answers.meeting_date)} · {textValue(r.answers.meeting_title)}</option>)}</select></label>
    </>:null}
    <OrganizationPeopleComboBox people={members} orgId={org.id} label="Chairperson" value={textValue(answers.meeting_chair)?[textValue(answers.meeting_chair)]:[]} onChange={ids=>text("meeting_chair",ids[0]??"")}/>
    <OrganizationPeopleComboBox people={members} orgId={org.id} label="Minute taker" value={textValue(answers.meeting_recorder_id)?[textValue(answers.meeting_recorder_id)]:[]} onChange={ids=>patch({meeting_recorder_id:ids[0]??"",meeting_recorder:members.find(p=>p.id===ids[0])?.displayName??""})}/>
    {!textValue(answers.meeting_recorder_id)?<label style={label}>External / legacy minute taker<input style={input} value={textValue(answers.meeting_recorder)} onChange={e=>text("meeting_recorder",e.target.value)}/></label>:null}
    {!textValue(answers.meeting_chair)?<label style={label}>External chairperson<input style={input} value={textValue(answers.meeting_chair_manual)} onChange={e=>text("meeting_chair_manual",e.target.value)}/></label>:null}
    <OrganizationPeopleComboBox people={members} orgId={org.id} label="Facilitator / submitted by" value={actor?[actor]:[]} onChange={ids=>setActor(ids[0]??"")}/>

   </div>
   <div hidden={step!==1} style={{borderTop:"1px solid #e2e8f0",paddingTop:14,display:"grid",gap:10}}>
    <h3 style={{fontSize:17,margin:0}}><UsersRound size={18} style={{display:"inline",verticalAlign:"middle"}}/> Attendance register</h3>
    <p style={{fontSize:12,color:"var(--mt-muted,#64748b)",margin:0}}>Select staff from your company's directory; add external visitors and contractors separately. Selected employees appear in their personal participation analytics.</p>
    {answers.meeting_series_id?<><OrganizationPeopleComboBox people={members} orgId={org.id} label="Invited series crew (not attendance)" multiple value={Array.isArray(answers.invited_person_ids)?answers.invited_person_ids as string[]:[]} onChange={ids=>patch({invited_person_ids:ids})}/><p style={{fontSize:12}}>Invitations are local planning entries. Select actual attendees below; invited people do not count as present.</p></>:null}
    <OrganizationPeopleComboBox people={members} orgId={org.id} label="Organization meeting participants" multiple
     value={selected} onChange={ids=>choosePresence("present",ids)}
     placeholder="Find meeting participants"/>
    <div style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
     <p style={{fontSize:11,color:"var(--mt-muted,#64748b)",margin:"0 0 4px"}}>{selected.length} present from {members.length} active people in {org.name}.</p>
     {previousMeeting?<button type="button" className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,padding:"7px 10px",minHeight:36,fontSize:11}} onClick={reuseMeetingPeople}>Reuse previous meeting crew</button>:null}
    </div>
    {desktop&&attendanceDetails.length?<label style={label}>Edit attendee details<select style={input} value={attendanceDetails.some(r=>r.person_id===personFocus)?personFocus:String(attendanceDetails[0]?.person_id??"")} onChange={e=>setPersonFocus(e.target.value)}>{attendanceDetails.map(r=><option key={String(r.person_id)} value={String(r.person_id)}>{textValue(r.person_name)} · {textValue(r.attendance_status)}</option>)}</select></label>:null}
    {attendanceDetails.map((r,i)=>(!desktop||r.person_id===(attendanceDetails.some(row=>row.person_id===personFocus)?personFocus:attendanceDetails[0]?.person_id))?<div key={String(r.person_id)} style={{...box,display:"grid",gap:9}}>
     <strong>{textValue(r.person_name)}</strong><small>{[r.department,r.job_title].filter(Boolean).join(" · ")}</small>
     <div style={grid}><label style={label}>Attendance status<select style={input} value={textValue(r.attendance_status)||"Present"} onChange={e=>listPatch("attendance_details",i,{attendance_status:e.target.value})}>{presenceStatusOptions.map(v=><option key={v}>{v}</option>)}</select></label>
      <label style={label}>Arrival time<input type="time" style={input} value={textValue(r.arrival_time)} onChange={e=>listPatch("attendance_details",i,{arrival_time:e.target.value})}/></label>
      <label style={label}>Departure time<input type="time" style={input} value={textValue(r.departure_time)} onChange={e=>listPatch("attendance_details",i,{departure_time:e.target.value})}/></label></div>
    </div>:null)}
    <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}><strong style={{fontSize:13}}>External/manual attendees ({attendees.length})</strong><button className="movetrack-ui-button" data-mt-variant="secondary" style={btn} onClick={()=>addRow("attendees")}><Plus size={14} style={{display:"inline"}}/> Add person</button></div>
    {attendees.map((r,i)=><div key={i} style={{...grid,background:"var(--mt-surface-soft,#f8fafc)",padding:10,borderRadius:12}}>
     {([["attendee_name","Full name"],["attendee_company","Company / department"],["attendee_role","Role"]] as const).map(([key,title])=><label key={key} style={label}>{title}<input style={input} value={textValue(r[key])} onChange={e=>listPatch("attendees",i,{[key]:e.target.value})}/></label>)}
     <label style={label}>Attendance status<select style={input} value={textValue(r.attendee_status)||"Present"} onChange={e=>listPatch("attendees",i,{attendee_status:e.target.value})}>{presenceStatusOptions.map(v=><option key={v}>{v}</option>)}</select></label>
     <label style={label}>Attendance acknowledged (demo)<select style={input} value={textValue(r.attendee_ack)||"No"} onChange={e=>listPatch("attendees",i,{attendee_ack:e.target.value})}><option>No</option><option>Yes (unverified)</option></select></label>
     <button aria-label={"Remove attendee "+(i+1)} className="movetrack-ui-button" data-mt-variant="secondary" style={btn} onClick={()=>removeRow("attendees",i)}><Trash2 size={15} style={{display:"inline"}}/> Remove</button>
    </div>)}
    <div style={{border:"1px solid #bfdbfe",borderRadius:14,background:"var(--mt-surface-soft,#f0f6ff)",padding:15,display:"grid",gap:12}}>
     <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"start",flexWrap:"wrap"}}>
      <div><strong style={{fontSize:15,color:"var(--mt-ink,#143b66)"}}>Apologies & absent persons</strong>
       <p style={{fontSize:12,color:"var(--mt-muted,#53647e)",margin:"5px 0 0"}}>Use the searchable company people picker. Select several people at once; no need to retype names, job titles or departments.</p>
      </div>
      <span style={{background:"var(--mt-surface-soft,#dbeafe)",color:"var(--mt-link,#1e40af)",borderRadius:999,padding:"6px 10px",fontSize:11,fontWeight:850}}>{attendance.absent} absent / {attendance.present} present</span>
     </div>
     <OrganizationPeopleComboBox people={members} orgId={org.id} multiple
       label="Select staff who apologized or are absent"
       placeholder="Find absent colleagues"
       value={apologyIds} onChange={ids=>choosePresence("absent",ids)}/>
     {desktop&&apologyDetails.length?<label style={label}>Edit apology details<select style={input} value={apologyDetails.some(r=>r.person_id===apologyFocus)?apologyFocus:String(apologyDetails[0]?.person_id??"")} onChange={e=>setApologyFocus(e.target.value)}>{apologyDetails.map(r=><option key={String(r.person_id)} value={String(r.person_id)}>{textValue(r.person_name)} · {textValue(r.absence_status)}</option>)}</select></label>:null}
     {apologyDetails.map((r,i)=>(!desktop||r.person_id===(apologyDetails.some(row=>row.person_id===apologyFocus)?apologyFocus:apologyDetails[0]?.person_id))?<div key={String(r.person_id??i)} style={{...box,display:"grid",gap:9,background:"var(--mt-surface,#fff)",padding:12}}>
       <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:9}}>
        <strong style={{fontSize:12}}>{members.find(p=>p.id===r.person_id)?.displayName??textValue(r.person_name)}</strong>
        <button type="button" aria-label={"Remove absent person "+(i+1)} className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,minHeight:33,padding:"5px 9px"}} onClick={()=>choosePresence("absent",apologyIds.filter(id=>id!==r.person_id))}><Trash2 size={15}/></button>
       </div>
       <small>{[r.department,r.job_title].filter(Boolean).join(" · ")}</small>
       <div style={{...grid,gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,185px),1fr))"}}>
        <label style={label}>Notification status<select style={input} value={textValue(r.notification_status)||"Not recorded"} onChange={e=>listPatch("apology_details",i,{notification_status:e.target.value})}>{notificationStatusOptions.map(v=><option key={v}>{v}</option>)}</select></label>
        <label style={label}>Attendance status<select style={input} value={textValue(r.absence_status)||"Apology received"} onChange={e=>listPatch("apology_details",i,{absence_status:e.target.value})}>{apologyStatusOptions.map(option=><option key={option}>{option}</option>)}</select></label>
        <label style={label}>Reason (optional category)<select style={input} value={textValue(r.absence_reason)||"Not specified"} onChange={e=>listPatch("apology_details",i,{absence_reason:e.target.value})}>{apologyReasonOptions.map(option=><option key={option}>{option}</option>)}</select></label>
       </div>
       <label style={label}>Notes (optional)<input style={input} value={textValue(r.absence_note)} onChange={e=>listPatch("apology_details",i,{absence_note:e.target.value})} placeholder="Additional context only if needed"/></label>
      </div>:null)}
     <div style={{display:"flex",justifyContent:"space-between",gap:9,alignItems:"center",flexWrap:"wrap"}}>
      <strong style={{fontSize:12}}>External / contractor apologies ({externalApologies.length})</strong>
      <button type="button" className="movetrack-ui-button" data-mt-variant="secondary" style={btn} onClick={()=>addRow("apology_entries")}><Plus size={15} style={{display:"inline",verticalAlign:"middle"}}/> Add person</button>
     </div>
     {externalApologies.map((r,i)=><div key={i} style={{...box,display:"grid",gap:9,background:"var(--mt-surface,#fff)",padding:12}}>
       <div style={{...grid}}>
        <label style={label}>Person name *<input style={input} value={textValue(r.apology_name)} onChange={e=>listPatch("apology_entries",i,{apology_name:e.target.value})} placeholder="External visitor / contractor"/></label>
        <label style={label}>Company / department<input style={input} value={textValue(r.apology_company)} onChange={e=>listPatch("apology_entries",i,{apology_company:e.target.value})}/></label>
        <label style={label}>Attendance status<select style={input} value={textValue(r.apology_status)||"Apology received"} onChange={e=>listPatch("apology_entries",i,{apology_status:e.target.value})}>{apologyStatusOptions.map(option=><option key={option}>{option}</option>)}</select></label>
        <label style={label}>Reason<select style={input} value={textValue(r.apology_reason)||"Not specified"} onChange={e=>listPatch("apology_entries",i,{apology_reason:e.target.value})}>{apologyReasonOptions.map(option=><option key={option}>{option}</option>)}</select></label>
       </div>
       <button type="button" className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,justifySelf:"start",minHeight:35}} onClick={()=>removeRow("apology_entries",i)}><Trash2 size={14} style={{display:"inline"}}/> Remove</button>
      </div>)}
     <label style={label}>Additional apology notes (optional)<textarea style={{...input,minHeight:60}} value={textValue(answers.apologies)} onChange={e=>text("apologies",e.target.value)} placeholder="Only if information is not covered above"/></label>
     <p style={{fontSize:11,color:"var(--mt-muted,#53647e)",margin:0}}>An absent person is not counted as present or marked as having participated in the meeting. You can switch someone between Present and Absent using the two pickers.</p>
    </div>
   </div>
   <div hidden={step!==2} style={{borderTop:"1px solid #e2e8f0",paddingTop:14,display:"grid",gap:10}}>
    <h3 style={{fontSize:17,margin:0}}><FileText size={18} style={{display:"inline",verticalAlign:"middle"}}/> Agenda and minutes</h3>
    {previousMeeting?<section style={box} aria-label="Adopt previous minutes"><h4 style={{margin:0}}>Previous minutes · {textValue(previousMeeting.answers.meeting_date)}</h4>
     <p>{textValue(previousMeeting.answers.meeting_title)}</p><DesktopModalDisclosure title="Read previous minutes and decisions"><p style={{whiteSpace:"pre-wrap"}}>{textValue(previousMeeting.answers.minutes)}</p><p style={{whiteSpace:"pre-wrap"}}>{textValue(previousMeeting.answers.decisions)}</p></DesktopModalDisclosure>
     <label style={label}>Previous minutes adoption<select style={input} value={textValue(answers.minutes_adoption)||"Pending review"} onChange={e=>text("minutes_adoption",e.target.value)}>{["Pending review","Adopted","Adopted with amendments","Deferred"].map(v=><option key={v}>{v}</option>)}</select></label>
     <label style={label}>Amendments / adoption notes<textarea style={input} value={textValue(answers.minutes_amendments)} onChange={e=>text("minutes_amendments",e.target.value)}/></label>
     <OrganizationPeopleComboBox people={members} orgId={org.id} label="Adoption recorded by (unverified)" value={textValue(answers.minutes_adopted_by)?[textValue(answers.minutes_adopted_by)]:[]} onChange={ids=>patch({minutes_adopted_by:ids[0]??"",minutes_adopted_date:new Date().toISOString().slice(0,10)})}/>
    </section>:null}
    <div style={{display:"grid",gap:7}}>
     <strong style={{fontSize:12}}>Build an agenda with one tap</strong>
     <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{quickAgenda.map(topic=><button key={topic} type="button" className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,minHeight:35,fontSize:11,padding:"7px 10px"}} onClick={()=>addAgendaTopic(topic)}>+ {topic}</button>)}</div>
     <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
      {previousMeeting?<button className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,minHeight:35,fontSize:11}} type="button" onClick={reuseAgenda}>Reuse previous agenda topics</button>:null}
      <span style={{fontSize:11,color:"var(--mt-muted,#64748b)"}}>Suggested headings only. Today's minutes and acknowledgements are never copied.</span>
     </div>
    </div>
    {([["agenda","Agenda / planned topics *"],["safety_highlights","Safety moment / hazards"],["minutes","Meeting discussions and minutes *"],["decisions","Decisions / resolutions"],["outstanding","Outstanding matters / closeout"]] as const).map(([key,title])=>
      <label key={key} style={label}>{title}<textarea style={{...input,minHeight:85}} value={textValue(answers[key])} onChange={e=>text(key,e.target.value)}/></label>)}
    <OperationalTextAssist value={textValue(answers.minutes)} people={members} onAction={candidate=>{
     if(actions.some(r=>textValue(r.action).trim().toLowerCase()===candidate.action.trim().toLowerCase())){setMessage("That action is already in the register.");return;}
     patch({actions:[...actions,{action:candidate.action,owner:candidate.owner,owner_person_id:candidate.owner_person_id,due:candidate.due,state:"Open",action_id:"ACTION-"+crypto.randomUUID(),nlp_source:candidate.source,nlp_reviewed:false}]});setMessage("Text suggestion added as an editable open action. Review owner and due date in Actions.");
    }}/>
   </div>
   <div hidden={step!==3} style={{borderTop:"1px solid #e2e8f0",paddingTop:14,display:"grid",gap:10}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:8,flexWrap:"wrap",alignItems:"center"}}>
     <h3 style={{fontSize:17,margin:0}}><ClipboardList size={18} style={{display:"inline",verticalAlign:"middle"}}/> Corrective actions</h3>
     <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
      {previousMeeting?<button type="button" className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,minHeight:38,fontSize:11}} onClick={reuseOpenActions}>Carry forward open actions</button>:null}
      <button className="movetrack-ui-button" data-mt-variant="secondary" style={btn} onClick={()=>addRow("actions")}><Plus size={15} style={{display:"inline"}}/> Add action</button>
     </div>
    </div>
    <p style={{fontSize:11,color:"var(--mt-muted,#64748b)",margin:0}}>Assign staff by searching the company directory, or enter an external owner. Carried-forward items stay open and require a fresh due date.</p>
    {actions.length===0?<p style={{fontSize:12,color:"var(--mt-muted,#64748b)",margin:0}}>No actions recorded yet. Add an action with its responsible owner, due date and status when necessary.</p>:null}
    {desktop&&actions.length?<table className="movetrack-compact-table" aria-label="Desktop meeting action register"><thead><tr><th>Action</th><th>Status</th><th>Edit</th></tr></thead><tbody>{actions.map((r,i)=><tr key={String(r.action_id??i)}><td>{textValue(r.action)||"New action"}</td><td>{textValue(r.state)||"Open"}</td><td><button type="button" className="movetrack-ui-button" data-mt-variant="secondary" style={btn} onClick={()=>setActionFocus(i)} aria-label={"Edit action "+(i+1)}>Edit</button></td></tr>)}</tbody></table>:null}
    {actions.map((r,i)=>(!desktop||i===Math.min(actionFocus,actions.length-1))?<div key={i} style={{...grid,background:"var(--mt-surface-soft,#f8fafc)",padding:10,borderRadius:12}}>
     <label style={label}>Action description *<input style={input} value={textValue(r.action)} onChange={e=>listPatch("actions",i,{action:e.target.value})}/></label>
     <div style={{display:"grid",gap:7}}>
      <OrganizationPeopleComboBox people={members} orgId={org.id} label="Accountable employee"
       value={members.some(p=>p.id===r.owner_person_id)?[String(r.owner_person_id)]:[]}
       onChange={ids=>{
        const id=ids[0]??"";
        listPatch("actions",i,{owner_person_id:id,owner:members.find(p=>p.id===id)?.displayName??""});
       }} placeholder="Find supervisor, technician or responsible employee"/>
      {(!r.owner_person_id||!members.some(p=>p.id===r.owner_person_id))?
       <label style={label}>Or external / manual action owner *
        <input style={input} value={textValue(r.owner)} onChange={e=>listPatch("actions",i,{owner:e.target.value,owner_person_id:""})} placeholder="External person or contractor name"/>
       </label>:null}
      {r.carried_from?<small style={{fontSize:11,color:"var(--mt-warning,#9a670d)"}}>{textValue(r.carried_from)}</small>:null}
     </div>
     {r.nlp_source?<label style={label}><span><input type="checkbox" checked={r.nlp_reviewed===true} onChange={e=>listPatch("actions",i,{nlp_reviewed:e.target.checked})}/> I reviewed this text suggestion, owner and due date</span><small>Source: {textValue(r.nlp_source)}</small></label>:null}
     <label style={label}>Due date<input type="date" style={input} value={textValue(r.due)} onChange={e=>listPatch("actions",i,{due:e.target.value})}/></label>
     <label style={label}>Status<select style={input} value={textValue(r.state)||"Open"} onChange={e=>listPatch("actions",i,{state:e.target.value})}><option>Open</option><option>In progress</option><option>Closed</option></select></label>
     <RepeatableRowActions index={i} count={actions.length} onRemove={()=>removeRow("actions",i)} onMove={direction=>patch({actions:moveRegisterRow(actions,i,direction)})} onDuplicate={()=>patch({actions:duplicateRegisterRow(actions,i,["action_id","origin_meeting_id","previous_due","carried_from","nlp_reviewed","state"])})}/>
    </div>:null)}
    <div style={grid}><label style={label}>Next review / meeting<input type="date" style={input} value={textValue(answers.next_meeting)} onChange={e=>text("next_meeting",e.target.value)}/></label><label style={label}>Prepared by<input style={input} value={textValue(answers.prepared_by)} onChange={e=>text("prepared_by",e.target.value)}/></label></div>
   </div>
   <section hidden={step!==4} aria-label="Review meeting" style={{display:"grid",gap:12}}>
    <h3 style={{margin:0}}>Review before saving</h3><p style={{margin:0,fontSize:13}}>{textValue(answers.meeting_title)||"Untitled meeting"} · {textValue(answers.meeting_date)} · {attendance.present} present · {attendance.absent} absent/apologies · {actions.length} actions</p>
    <p style={{margin:0,fontSize:12,color:"var(--mt-muted,#64748b)"}}>Check each step. Draft entries are saved automatically; chairperson acknowledgement is required to finalize and remains unverified.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,260px),1fr))",gap:12}}>
    <SignatureApprovalTray compact label="Chairperson signature" value={isSignatureEvidence(answers.chair_signature)?answers.chair_signature:null}
     scope={textValue(answers.meeting_title)||"Meeting register"} role="Meeting chairperson" intent="attendance"
     defaultSignerName={members.find(p=>p.id===answers.meeting_chair)?.displayName||textValue(answers.meeting_chair_manual)}
     signerPersonId={typeof answers.meeting_chair==="string"?answers.meeting_chair:undefined}
     onChange={signature=>patch({chair_signature:signature??null})}/>
    <SignatureApprovalTray compact label="Minute taker signature" value={isSignatureEvidence(answers.minute_taker_signature)?answers.minute_taker_signature:null}
     scope={textValue(answers.meeting_title)||"Meeting register"} role="Minute taker" intent="attendance"
     defaultSignerName={textValue(answers.meeting_recorder)} signerPersonId={textValue(answers.meeting_recorder_id)||undefined}
     onChange={signature=>patch({minute_taker_signature:signature??null})}/>
   </div>
   <div style={{display:"flex",gap:9,alignItems:"center",flexWrap:"wrap",justifyContent:"space-between"}}>
    <span style={{fontSize:11,color:"var(--mt-muted,#64748b)"}}>Signature marks and drafts save locally; identity and authorization are not verified.</span>
    <button className="movetrack-ui-button" data-mt-variant="primary" style={primary} onClick={submit}><CheckCircle2 size={16} style={{display:"inline",verticalAlign:"middle"}}/> Save meeting register & minutes</button>
   </div>
   </section>
   <div className="movetrack-step-footer"><button type="button" disabled={step===0} onClick={()=>goStep(step-1)}>Previous</button><span style={{fontSize:12,alignSelf:"center"}}>Step {step+1} of 5 · Autosaved locally</span>{step<4?<button type="button" onClick={()=>goStep(step+1)}>Next: {["Details","Attendance","Minutes","Actions","Review"][step+1]}</button>:null}</div>
  </div></TaskWorkspace></div>:<div hidden={page!=="draft"} style={{...box,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
    <p style={{fontSize:12,color:"var(--mt-muted,#475569)",margin:0}}>Meeting saved. Start a new register or reopen the unsent draft.</p>
    <button className="movetrack-ui-button" data-mt-variant="primary" style={primary} onClick={()=>{patch(newDraft(org.siteIds[0]??""));setEditing(true);setPage("draft");goStep(0);setMessage("");}}><Plus size={15} style={{display:"inline"}}/> New meeting</button>
   </div>}
  {message?<p role="status" style={{...box,background:"var(--mt-surface-soft,#eff6ff)",borderColor:"#bfdbfe",color:"var(--mt-link,#1e40af)",fontSize:12}}>{message}</p>:null}
  <div hidden={page!=="records"} style={{...box,display:"grid",gap:11}}>
   <div style={{display:"flex",justifyContent:"space-between",gap:9,alignItems:"center",flexWrap:"wrap"}}><h3 style={{fontSize:18,margin:0}}>Saved meeting registers & briefings</h3><button className="movetrack-ui-button" data-mt-variant="secondary" style={btn} onClick={()=>{setEditing(true);setPage("draft");}}>Open draft</button></div>
   {!records.length?<p style={{fontSize:12,color:"var(--mt-muted,#64748b)"}}>No completed meeting records yet. Your first register will appear here and in participation analytics.</p>:null}
   {records.map(r=><div key={r.id} style={{display:"flex",gap:10,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",border:"1px solid #e2e8f0",padding:13,borderRadius:12}}>
    <div><strong>{textValue(r.answers.meeting_title)||r.templateSnapshot.title}</strong>
     <p style={{fontSize:11,color:"var(--mt-muted,#64748b)",margin:"5px 0"}}>{textValue(r.answers.meeting_type)||"SHE meeting"} · {textValue(r.answers.meeting_date)||new Date(r.submittedAt).toLocaleDateString()} · {r.siteId}</p>
     <span style={{fontSize:11,color:"var(--mt-link,#2563eb)"}}>{meetingAttendanceCounts(r.answers).present} attendee(s) · {meetingAttendanceCounts(r.answers).absent} apologies/absent · {rowValues(r.answers.actions).length} action(s)</span>
    </div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{r.answers.meeting_series_id?<button type="button" className="movetrack-ui-button" data-mt-variant="secondary" style={btn} onClick={()=>startOccurrence(r)}>Start next series meeting</button>:null}<DocumentDownloadActions document={buildFormDocument({template:r.templateSnapshot,mode:"filled",submission:r,company:org,people:members})} compact/></div>
   </div>)}
  </div>
  <p style={{fontSize:11,color:"var(--mt-muted,#64748b)",margin:0}}>Registers are simulations with unverified acknowledgements. For legally controlled attendance registers, identity, signatures, retention, privacy and supervisor approval must be implemented server-side.</p>
 </section>;
}
