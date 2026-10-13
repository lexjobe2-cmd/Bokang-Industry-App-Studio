"use client";
import {useMemo,useState} from "react";
import {usePersistentState} from "@bokang/persistence";
import {Plane,ClipboardCheck,TriangleAlert,CheckCircle2,ShieldAlert,ArrowRight,History,Building2} from "lucide-react";
import {AVIATION_WORKFLOWS,AVIATION_AREA_LABELS,evaluateAviationObservation,makeAviationObservation,updateAviationFollowUp,
 type AviationCheckAnswer,type AviationCheckStatus,type AviationAction,type AviationObservationRecord} from "../../lib/aviation-operations";
import {AVIATION_SECTORS,AVIATION_SAFETY_REFERENCES,HELICOPTER_CHECKLIST_BOUNDARIES,
 type AviationSectorId,type AviationAirframeKind} from "../../lib/aviation-sector-profiles";

const storageKey="bokang-studio.move-track.aviation.observations.v1";
const panel:React.CSSProperties={border:"1px solid var(--mt-border,#cbd5e1)",borderRadius:15,padding:15,background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#172b46)",minWidth:0};
const field:React.CSSProperties={border:"1px solid var(--mt-border,#cbd5e1)",borderRadius:9,padding:"10px 12px",minHeight:44,width:"100%",color:"var(--mt-ink,#172b46)",background:"var(--mt-surface,#fff)",font:"inherit",fontSize:14};
const stack:React.CSSProperties={display:"grid",gap:6,fontSize:12,fontWeight:750};
const muted:React.CSSProperties={color:"var(--mt-muted,#63758d)",fontSize:12,lineHeight:1.65};
const btn:React.CSSProperties={padding:"10px 14px",minHeight:44,borderRadius:10,font:"inherit",cursor:"pointer",fontWeight:800};
const statuses:readonly {value:AviationCheckStatus;label:string}[]=[
 {value:"NOT_CHECKED",label:"Not checked"},
 {value:"OBSERVED_OK",label:"No issue observed"},
 {value:"ISSUE",label:"Issue observed"},
 {value:"NOT_APPLICABLE",label:"Not applicable"}
];
export function AviationGroundOperationsWorkspace({onOpenMeeting,adminMode=false}:{
 onOpenMeeting?:()=>void;adminMode?:boolean;
}){
 const [records,setRecords]=usePersistentState<AviationObservationRecord[]>(storageKey,[]);
 const [workflowId,setWorkflowId]=useState(AVIATION_WORKFLOWS[0]!.id);
 const [sectorId,setSectorId]=useState<AviationSectorId>("COMMERCIAL");
 const [airframeKind,setAirframeKind]=useState<AviationAirframeKind>("NOT_APPLICABLE");
 const [followUpReferences,setFollowUpReferences]=useState<Record<string,string>>({});
 const sector=AVIATION_SECTORS.find(x=>x.id===sectorId)!;
 const helicopterWorkflowIds=HELICOPTER_CHECKLIST_BOUNDARIES.map(x=>x.id);
 const [airport,setAirport]=useState("");
 const [site,setSite]=useState("");
 const [aircraftRegistration,setAircraftRegistration]=useState("");
 const [equipmentId,setEquipmentId]=useState("");
 const [flightReference,setFlightReference]=useState("");
 const [observer,setObserver]=useState("");
 const [procedureReference,setProcedureReference]=useState("");
 const [procedureRevision,setProcedureRevision]=useState("");
 const [notes,setNotes]=useState("");
 const [answers,setAnswers]=useState<AviationCheckAnswer[]>([]);
 const [actionDescription,setActionDescription]=useState("");
 const [actionOwner,setActionOwner]=useState("");
 const [actionDueDate,setActionDueDate]=useState("");
 const [error,setError]=useState("");
 const [notice,setNotice]=useState("");
 const [page,setPage]=useState<"inspect"|"records">("inspect");
 const workflow=AVIATION_WORKFLOWS.find(x=>x.id===workflowId)!;
 const evaluation=useMemo(()=>evaluateAviationObservation(workflow,answers),[workflow,answers]);
 const findings=records.filter(r=>r.actions.some(a=>a.state!=="CLOSED"));
 function changeWorkflow(id:string){
  setWorkflowId(id);setAnswers([]);setError("");setNotice("");
  const area=AVIATION_WORKFLOWS.find(x=>x.id===id)?.area;
  if(area==="HELICOPTER_GROUND"||id==="rotorcraft-defect-handover")setAirframeKind("HELICOPTER");
 }
 function changeSector(id:AviationSectorId){
  setSectorId(id);
  const suggested=AVIATION_SECTORS.find(s=>s.id===id)?.priorityWorkflowIds[0];
  if(suggested)changeWorkflow(suggested);
 }
 function changeAction(recordId:string,actionId:string,state:AviationAction["state"]){
  setError("");setNotice("");
  try{
   const record=records.find(r=>r.id===recordId);
   if(!record)throw Error("Aviation record not found");
   const updated=updateAviationFollowUp(record,actionId,state,followUpReferences[actionId]??"");
   setRecords(prev=>prev.map(r=>r.id===recordId?updated:r));
   setNotice("Follow-up status recorded locally. No operating clearance is granted.");
  }catch(e){setError(e instanceof Error?e.message:"Could not update follow-up");}
 }
 function changeAnswer(checkId:string,status:AviationCheckStatus){
  setAnswers(current=>[...current.filter(x=>x.checkId!==checkId),{checkId,status,detail:current.find(x=>x.checkId===checkId)?.detail??"",severity:status==="ISSUE"?"HIGH":undefined}]);
  setError("");
 }
 function changeDetail(checkId:string,detail:string){
  setAnswers(current=>[...current.filter(x=>x.checkId!==checkId),{checkId,status:current.find(x=>x.checkId===checkId)?.status??"NOT_CHECKED",detail}]);
 }
 function save(){
  setError("");setNotice("");
  try{
   if(!procedureReference.trim()||!procedureRevision.trim())throw Error("Enter the locally approved procedure identifier and revision, or mark the reference as DEMO only.");
   const actions:AviationAction[]=actionDescription.trim()?[{id:"ACTION-"+crypto.randomUUID(),description:actionDescription.trim(),owner:actionOwner.trim(),dueDate:actionDueDate,state:"OPEN"}]:[];
   const record=makeAviationObservation({
    id:"AV-"+crypto.randomUUID(),workflowId,airport:airport.trim(),site:site.trim(),
    aircraftRegistration:aircraftRegistration.trim()||undefined,equipmentId:equipmentId.trim()||undefined,
    flightReference:flightReference.trim()||undefined,observer:observer.trim(),
    sectorId,airframeKind,
    procedureReference:procedureReference.trim(),procedureRevision:procedureRevision.trim(),
    performedAt:new Date().toISOString(),notes:notes.trim(),answers,actions
   });
   setRecords(current=>[record,...current]);setPage("records");setAnswers([]);setActionDescription("");
   setActionOwner("");setActionDueDate("");setNotes("");
   setNotice("Observation recorded locally. This does not approve an aircraft, airfield, equipment release or security clearance.");
  }catch(err){setError(err instanceof Error?err.message:"Could not record inspection.");}
 }
 return <section aria-label="Aviation ground operations" style={{display:"grid",gap:15,minWidth:0}}>
  <div style={{...panel,background:"linear-gradient(120deg,#0b2544,#165a91)",color:"#fff",border:0,padding:19}}>
   <div style={{display:"flex",alignItems:"center",gap:10}}><Plane size={26}/><strong style={{fontSize:12,letterSpacing:1.2}}>MOVE TRACK AI · AVIATION GROUND OPERATIONS</strong></div>
   <h2 style={{fontSize:"clamp(22px,4vw,30px)",margin:"12px 0 6px"}}>Airport, helicopter and ground safety assurance</h2>
   <p style={{fontSize:13,lineHeight:1.65,color:"#dcecff",margin:0}}>Airfield and heliport observations, helicopter support, ground equipment, contractor oversight, occurrence follow-up and SHE meetings for government, defence support, mining and civil aviation.</p>
   <p style={{fontSize:12,margin:"12px 0 0",fontWeight:800,color:"#fce0a5"}}><ShieldAlert size={15} style={{verticalAlign:"middle"}}/> DEVICE-LOCAL DEMO · Not a certified aviation system, preflight check, airworthiness release, airport clearance or AVSEC approval.</p>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,150px),1fr))",gap:9}}>
   {[
    ["Available workflows",AVIATION_WORKFLOWS.length],
    ["Recorded observations",records.length],
    ["Findings needing follow-up",findings.length],
    ["Open actions",records.flatMap(r=>r.actions).filter(a=>a.state!=="CLOSED").length]
   ].map(([name,value])=><article key={String(name)} style={panel}><strong style={{fontSize:23,display:"block"}}>{value}</strong><span style={muted}>{name}</span></article>)}
  </div>
  <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:9}}>
   <button type="button" className="movetrack-ui-button" data-mt-variant={page==="inspect"?"selected":"secondary"} onClick={()=>setPage("inspect")} style={btn}><ClipboardCheck size={16} style={{verticalAlign:"middle"}}/> New observation</button>
   <button type="button" className="movetrack-ui-button" data-mt-variant={page==="records"?"selected":"secondary"} onClick={()=>setPage("records")} style={btn}><History size={16} style={{verticalAlign:"middle"}}/> Records ({records.length})</button>
   {onOpenMeeting?<button type="button" className="movetrack-ui-button" data-mt-variant="secondary" style={btn} onClick={onOpenMeeting}>SHE meeting, minutes and actions <ArrowRight size={15} style={{verticalAlign:"middle"}}/></button>:null}
  </div>
  <section style={{...panel,display:"grid",gap:11}} aria-label="Aviation operating sectors">
     <div style={{display:"flex",alignItems:"center",gap:8}}><Building2 size={19}/><h3 style={{fontSize:17,margin:0}}>Organization sector</h3></div>
     <label style={stack}>Sector profile
      <select aria-label="Aviation sector profile" value={sectorId} onChange={e=>changeSector(e.target.value as AviationSectorId)} style={field}>
       {AVIATION_SECTORS.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}
      </select>
     </label>
     <p style={{...muted,margin:0}}>{sector.description}</p>
     <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{sector.contexts.map(x=><span key={x} style={{border:"1px solid var(--mt-border,#cbd5e1)",borderRadius:20,padding:"5px 9px",fontSize:11}}>{x}</span>)}</div>
     <p style={{margin:0,color:"var(--mt-warning,#ad6619)",fontWeight:800,fontSize:12}}>{sector.handlingNotice}</p>
   </section>
   {page==="inspect"?<>
   <div style={{...panel,display:"grid",gap:10}}>
    <h3 style={{margin:0,fontSize:18}}>Choose an aviation workflow</h3>
    <label style={stack}>Inspection / oversight category
     <select value={workflowId} onChange={e=>changeWorkflow(e.target.value)} style={field}>
      {AVIATION_WORKFLOWS.map(x=><option key={x.id} value={x.id}>{x.title}{sector.priorityWorkflowIds.includes(x.id)?" · recommended":""}</option>)}
     </select>
    </label>
    <div style={{display:"grid",gap:5}}><strong>{AVIATION_AREA_LABELS[workflow.area]}</strong><p style={{...muted,margin:0}}>{workflow.description}</p>
     <small style={muted}>Research references: {workflow.standardContext.join(" · ")}. The operator must supply and approve the actual procedures.</small>
    </div>
   </div>
   <div style={{...panel,display:"grid",gap:11}}>
    <h3 style={{margin:0}}>Observation context</h3>
     <label style={stack}>Airframe / operating asset
      <select aria-label="Aviation airframe category" value={airframeKind} onChange={e=>setAirframeKind(e.target.value as AviationAirframeKind)} style={field}
       disabled={workflow.area==="HELICOPTER_GROUND"}>
       <option value="NOT_APPLICABLE">Ground equipment / infrastructure only</option>
       <option value="FIXED_WING">Fixed-wing aircraft (observation only)</option>
       <option value="HELICOPTER">Helicopter / rotorcraft (observation only)</option>
      </select>
     </label>
     {helicopterWorkflowIds.includes(workflow.id)?<p style={{...muted,margin:0}}>For approved helicopter preflight and maintenance procedures, consult the operator's specific RFM/POH and maintenance instructions. These prompts do not replace them.</p>:null}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,220px),1fr))",gap:11}}>
     <label style={stack}>Airport / heliport / facility *<input style={field} value={airport} onChange={e=>setAirport(e.target.value)} placeholder="Airport name or station"/></label>
     <label style={stack}>Stand / zone / work area<input style={field} value={site} onChange={e=>setSite(e.target.value)} placeholder="Non-sensitive location reference"/></label>
     <label style={stack}>Observer *<input style={field} value={observer} onChange={e=>setObserver(e.target.value)} placeholder="Inspector or supervisor"/></label>
     {(["AIRCRAFT_RECORDS","HELICOPTER_GROUND"].includes(workflow.area))?<label style={stack}>Aircraft / non-sensitive asset reference *<input style={field} value={aircraftRegistration} onChange={e=>setAircraftRegistration(e.target.value)} placeholder="Aircraft ID or unclassified asset reference"/></label>:null}
     {workflow.area==="GSE"?<label style={stack}>Ground equipment asset ID *<input style={field} value={equipmentId} onChange={e=>setEquipmentId(e.target.value)} placeholder="GSE asset number"/></label>:null}
     {workflow.area==="TURNAROUND"?<label style={stack}>Flight reference<input style={field} value={flightReference} onChange={e=>setFlightReference(e.target.value)} placeholder="Non-sensitive flight reference"/></label>:null}
     <label style={stack}>Approved procedure reference *<input style={field} value={procedureReference} onChange={e=>setProcedureReference(e.target.value)} placeholder="DEMO or locally approved SOP ID"/></label>
     <label style={stack}>Procedure revision *<input style={field} value={procedureRevision} onChange={e=>setProcedureRevision(e.target.value)} placeholder="DEMO or revision/date"/></label>
    </div>
   </div>
   <section aria-label="Aviation checklist observations" style={{...panel,display:"grid",gap:12}}>
    <h3 style={{margin:0}}>Checklist observations</h3>
    <p style={{...muted,margin:0}}>Choose a status for every prompt. “No issue observed” records only your observation; it does not certify safety or readiness.</p>
    {workflow.checks.map((check,index)=>{
     const answer=answers.find(a=>a.checkId===check.id);
     return <div key={check.id} style={{padding:"12px 0",borderBottom:index===workflow.checks.length-1?0:"1px solid var(--mt-border,#dce5f1)",display:"grid",gap:9}}>
      <strong style={{fontSize:13}}>{index+1}. {check.label}{check.critical?<span style={{marginLeft:7,color:"var(--mt-warning,#a65b12)",fontSize:11}}>Safety-relevant</span>:null}</strong>
      <span style={muted}>{check.prompt}</span>
      <label style={stack}>Observation status<select aria-label={check.label+" status"} style={field} value={answer?.status??"NOT_CHECKED"} onChange={e=>changeAnswer(check.id,e.target.value as AviationCheckStatus)}>
       {statuses.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}
      </select></label>
      {answer?.status==="ISSUE"?<label style={stack}>Describe the discrepancy for follow-up<textarea rows={2} style={field} value={answer.detail} onChange={e=>changeDetail(check.id,e.target.value)} placeholder="Factual safety observation; no sensitive security procedures"/></label>:null}
     </div>;
    })}
   </section>
   {evaluation.findings.length?<section style={{...panel,display:"grid",gap:11,borderColor:"#cf805f"}}>
    <strong style={{display:"flex",gap:7,alignItems:"center"}}><TriangleAlert size={18} color="#b45309"/> {evaluation.findings.length} issue(s) require follow-up</strong>
    <p style={{...muted,margin:0}}>Record an accountable corrective action. Do not issue operational clearance from this record.</p>
    <label style={stack}>Action / reporting requirement *<textarea rows={2} style={field} value={actionDescription} onChange={e=>setActionDescription(e.target.value)} placeholder="Document escalation and follow-up"/></label>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,210px),1fr))",gap:9}}>
     <label style={stack}>Responsible action owner *<input style={field} value={actionOwner} onChange={e=>setActionOwner(e.target.value)} placeholder="Authorized team or responsible person"/></label>
     <label style={stack}>Target date<input type="date" style={field} value={actionDueDate} onChange={e=>setActionDueDate(e.target.value)}/></label>
    </div>
   </section>:null}
   <label style={{...stack,...panel}}>Additional handover notes<textarea rows={3} style={field} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Non-sensitive handover notes and reporting reference"/></label>
   <div style={{...panel,display:"grid",gap:8}}>
    <p style={{margin:0,fontSize:12}}>Checklist: <strong>{workflow.checks.length-evaluation.missing.length}/{workflow.checks.length}</strong> items addressed · <strong>{evaluation.findings.length}</strong> findings.</p>
    <strong style={{fontSize:12,color:"var(--mt-warning,#a65b12)"}}>Recording does not grant aircraft dispatch, airworthiness approval, movement area reopening, or AVSEC clearance.</strong>
    {error?<p role="alert" style={{margin:0,color:"var(--mt-danger,#c24129)",fontWeight:750,fontSize:12}}>{error}</p>:null}
    <button type="button" className="movetrack-ui-button" data-mt-variant="primary" style={{...btn,justifySelf:"start"}} onClick={save}>Record observations locally</button>
   </div>
  </>:<section aria-label="Recorded aviation observations" style={{...panel,display:"grid",gap:11}}>
    <h3 style={{margin:0}}>Aviation observation records</h3>
    {notice?<p role="status" style={{margin:0,color:"var(--mt-success,#087f5b)",fontWeight:800,fontSize:12}}>{notice}</p>:null}
    {error?<p role="alert" style={{margin:0,color:"var(--mt-danger,#b42318)",fontSize:12}}>{error}</p>:null}
     {!records.length?<p style={muted}>No records yet. Select New observation to create your first device-local record.</p>:null}
    {records.map(record=><article key={record.id} style={{...panel,display:"grid",gap:7}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
       <strong>{AVIATION_WORKFLOWS.find(x=>x.id===record.workflowId)?.title??record.workflowId}</strong>
       <span style={{fontSize:11,color:record.state==="FOLLOW_UP_REQUIRED"?"var(--mt-warning,#a65b12)":"var(--mt-muted,#63758d)",fontWeight:800}}>{record.state.replaceAll("_"," ")}</span>
      </div>
      <small style={muted}>{record.airport} · {record.site||"Unspecified zone"} · {new Date(record.performedAt).toLocaleString()} · {record.observer}</small>
      <small style={muted}>Sector: {AVIATION_SECTORS.find(s=>s.id===record.sectorId)?.name??"Legacy aviation demo"} · Airframe: {record.airframeKind??"unspecified"}</small>
      <small style={muted}>Reference: {record.procedureReference} / {record.procedureRevision} · {record.answers.filter(a=>a.status==="ISSUE").length} finding(s)</small>
      {record.actions.map(action=><div key={action.id} style={{padding:9,border:"1px solid var(--mt-border,#dce5f1)",borderRadius:8,display:"grid",gap:3}}>
       <strong style={{fontSize:12}}>Action: {action.description}</strong><small style={muted}>Owner: {action.owner} · Due: {action.dueDate||"Not set"} · {action.state}</small>
        <label style={stack}>Local corrective-action status
         <select aria-label={"Aviation corrective action "+action.id} style={field} value={action.state} onChange={e=>changeAction(record.id,action.id,e.target.value as AviationAction["state"])}>
          <option value="OPEN">Open</option><option value="IN_PROGRESS">In progress</option><option value="CLOSED">Closed with evidence reference</option>
         </select>
        </label>
        {action.state!=="CLOSED"?<label style={stack}>External action / closure evidence reference
         <input aria-label={"Aviation action reference "+action.id} style={field} value={followUpReferences[action.id]??""}
          onChange={e=>setFollowUpReferences(x=>({...x,[action.id]:e.target.value}))}
          placeholder="Non-sensitive evidence or SHE meeting reference"/>
        </label>:<small style={muted}>Closure reference: {action.completionReference??"Legacy record · no evidence attached"}</small>}
        {onOpenMeeting?<button type="button" className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,justifySelf:"start"}}
         onClick={()=>{void navigator.clipboard?.writeText(action.id+" · "+action.description).catch(()=>{});onOpenMeeting();}}>Open SHE meeting for action follow-up <ArrowRight size={15} style={{verticalAlign:"middle"}}/></button>:null}
      </div>)}
      <small style={{...muted,fontWeight:700}}>Device-local · unverified · no regulatory release authority</small>
    </article>)}
   </section>}
  <details style={panel}>
   <summary style={{fontWeight:800,cursor:"pointer",fontSize:13,minHeight:44}}>Helicopter checklists and approved-manual references</summary>
   <p style={muted}>Use these headings only to document general ground-side observations. Actual rotorcraft preflight, postflight, maintenance or airworthiness decisions require approved type-specific manuals.</p>
   {HELICOPTER_CHECKLIST_BOUNDARIES.map(t=><div key={t.id} style={{padding:"9px 0",borderTop:"1px solid var(--mt-border,#cbd5e1)"}}>
    <strong style={{fontSize:13}}>{t.title}</strong><p style={{...muted,margin:"3px 0"}}>{t.purpose}</p>
    <small style={muted}>Approved source needed: {t.manualRequired}</small>
   </div>)}
   <h4 style={{fontSize:13}}>Global reference framework</h4>
   {AVIATION_SAFETY_REFERENCES.map(ref=><p key={ref.url} style={{...muted,margin:"6px 0"}}>
    <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.title}</a> — {ref.purpose}</p>)}
  </details>
  <small style={{...muted,display:"block"}}><CheckCircle2 size={14} style={{verticalAlign:"middle"}}/> Research-aligned starter workflows are illustrative. Operators must review, replace and approve each procedure, frequency, competency requirement and escalation route before production use.</small>
 </section>;
}
