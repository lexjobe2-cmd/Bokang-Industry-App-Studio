"use client";

import {useMemo,useState} from "react";
import {motion,useReducedMotion} from "framer-motion";
import {Plus,Trash2,Users,ShieldAlert,ClipboardList,CheckCircle2,FileText,Search,ChevronRight,AlertTriangle,Copy,HardHat} from "lucide-react";
import {usePersistentState} from "@bokang/persistence";
import {
 ASSURANCE_STORAGE,dictionary,demoPeople,demoOrganization,
 blankJra,blankJraTask,blankHazard,assessJra,canSimulateApproval,sampleBrakeMaintenanceJra,
 type OrganizationProfile,type PersonRecord,type JobRiskAssessment,type JraTask,type HazardEntry
} from "@bokang/domain-data/custom-assurance";
import {defaultRiskMatrix,scoreRisk,type RiskAnswer} from "@bokang/domain-data/risk-matrix";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {DocumentDownloadActions} from "./DocumentDownloadActions";
import {buildJraDocument,buildBlankJraDocument} from "../../lib/form-exports";

const shell:React.CSSProperties={background:"#fff",border:"1px solid #dde5ee",borderRadius:16,padding:17};
const input:React.CSSProperties={width:"100%",border:"1px solid #cbd5e1",borderRadius:10,padding:"11px 12px",background:"#fff",color:"#111827",font:"inherit",minHeight:43};
const btn:React.CSSProperties={border:"1px solid #cbd5e1",borderRadius:10,padding:"10px 12px",background:"#fff",color:"#172b4d",fontWeight:800,minHeight:43,cursor:"pointer"};
const primary:React.CSSProperties={...btn,background:"#163866",color:"#fff",borderColor:"#163866"};
const label:React.CSSProperties={fontSize:12,fontWeight:800,display:"grid",gap:6};
function Badge({children,color="#1d4ed8"}:{children:React.ReactNode;color?:string}){return <span style={{fontSize:10,background:color+"13",color,padding:"5px 8px",borderRadius:7,fontWeight:900}}>{children}</span>;}
function RiskChooser({value,onChange}:{value:RiskAnswer;onChange:(risk:RiskAnswer)=>void}){
 let assessed:ReturnType<typeof scoreRisk>|null=null;
 try{assessed=scoreRisk(defaultRiskMatrix,value);}catch{}
 return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(135px,1fr))",gap:7,alignItems:"end"}}>
  {(["likelihood","consequence"] as const).map((dim)=><label key={dim} style={label}>{dim==="likelihood"?"Likelihood":"Consequence"}
   <select style={input} value={value[dim]||""} onChange={e=>onChange({...value,[dim]:Number(e.target.value)})}><option value="">Select</option>
    {(dim==="likelihood"?defaultRiskMatrix.likelihoodLabels:defaultRiskMatrix.consequenceLabels).map((v,i)=><option key={v} value={i+1}>{i+1} · {v}</option>)}</select>
  </label>)}
  <div style={{...shell,padding:"8px 10px",minHeight:43,background:assessed?.requiresApproval?"#fff1f2":"#eff6ff",borderColor:assessed?.requiresApproval?"#fecdd3":"#bfdbfe"}}>
   <strong style={{fontSize:15,color:assessed?.requiresApproval?"#b42318":"#1d4ed8"}}>{assessed?assessed.score+" / 25":"/ 25"}</strong>
   <div style={{fontSize:10,color:"#64748b"}}>{assessed?.level||"Unrated"}</div>
  </div>
 </div>;
}
function unique(values:readonly string[],value:string,enabled:boolean){return enabled?[...new Set([...values,value])]:values.filter(v=>v!==value);}
export function JraWorkspace(){
 const reduced=useReducedMotion();
 const [orgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [selectedOrg,setSelectedOrg]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [directory]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [records,setRecords]=usePersistentState<JobRiskAssessment[]>(ASSURANCE_STORAGE.jras,[]);
 const [editing,setEditing]=usePersistentState<string|null>("bokang-studio.move-track.jra.editing.v1",null);
 const [current,setCurrent]=usePersistentState<JobRiskAssessment|null>("bokang-studio.move-track.jra.working.v1",null);
 const [page,setPage]=usePersistentState<"job"|"team"|"risks"|"review">("bokang-studio.move-track.jra.tab.v1","job");
 const [peopleSearch,setPeopleSearch]=useState("");
 const [message,setMessage]=useState("");
 const org=orgs.find(o=>o.id===(current?.orgId??selectedOrg))??orgs[0]??demoOrganization;
 const job=current??blankPlaceholder;
 const assessment=current?assessJra(current):null;
 const persons=directory.filter(p=>p.orgId===org.id&&p.active);
 const filtered=persons.filter(p=>[p.displayName,p.jobTitle,p.department,p.employeeNumber,p.email].some(v=>(v??"").toLowerCase().includes(peopleSearch.toLowerCase())));
 function startSample(){const now=new Date().toISOString();setCurrent(sampleBrakeMaintenanceJra(org,persons,now));setEditing(null);setPage("team");setMessage("Example work package loaded. Explore the team roster, task hazards and mitigation measures; replace the fictional details as needed.");}
 function start(){
  const now=new Date().toISOString();setCurrent(blankJra(org,now));setEditing(null);setPage("job");setMessage("JRA draft started. Choose a team, add job steps and evaluate each hazard.");
 }
 function patch(fields:Partial<JobRiskAssessment>){setCurrent(x=>x?{...x,...fields,updatedAt:new Date().toISOString()}:x);}
 function addTask(){patch({tasks:[...job.tasks,blankJraTask(job.tasks.length+1)]});setPage("risks");}
 function updateTask(id:string,fn:(task:JraTask)=>JraTask){patch({tasks:job.tasks.map(s=>s.id===id?fn(s):s)});}
 function changeHazard(stepId:string,hazardId:string,fn:(hazard:HazardEntry)=>HazardEntry){
  updateTask(stepId,step=>({...step,hazards:step.hazards.map(h=>h.id===hazardId?fn(h):h)}));
 }
 function toggleParticipant(person:PersonRecord){
  const exists=job.participants.find(p=>p.personId===person.id);
  patch({participants:exists?job.participants.filter(p=>p.personId!==person.id):[...job.participants,{personId:person.id,nameSnapshot:person.displayName,role:"Participant",acknowledged:false,manual:person.source==="MANUAL"}]});
 }
 function save(status:JobRiskAssessment["status"]="DRAFT"){
  if(!current)return;
  const now=new Date().toISOString();
  const next={...current,status,updatedAt:now,companyNameSnapshot:org.name,logoSnapshot:org.logoDataUrl};
  setRecords(xs=>[next,...xs.filter(r=>r.id!==next.id)]);setCurrent(next);setEditing(next.id);
  setMessage(status==="DRAFT"?"JRA draft saved in this browser.":"JRA saved as "+status.replaceAll("_"," ")+". This is a local simulation only.");
 }
 function submitReview(){
  if(!current)return;
  const a=assessJra(current);
  if(a.missing.length){setMessage("Complete required details: "+a.missing.slice(0,8).join("; "));setPage("review");return;}
  save(a.highRisks?"REVIEW_REQUIRED":"IN_REVIEW");setPage("review");
 }
 function approveDemo(){
  if(!current)return;
  if(!canSimulateApproval(current)){setMessage("Cannot mark ready: complete controls, resolve high residual risks, acknowledge all participants and choose an independent reviewer.");return;}
  patch({status:"APPROVED_DEMO",reviewedAt:new Date().toISOString()});
  const now=new Date().toISOString();
  const next={...current,status:"APPROVED_DEMO" as const,reviewedAt:now,updatedAt:now};
  setRecords(xs=>[next,...xs.filter(r=>r.id!==next.id)]);setCurrent(next);
  setMessage("DEMO approval marker saved locally. It is NOT an authorized permit or workplace approval.");
 }
 const count=records.length;
 return <section aria-label="Job Risk Assessment workspace" style={{display:"grid",gap:13}}>
  <div style={{...shell,background:"#0c1d32",color:"#fff",border:0,display:"flex",gap:13,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
   <div><div style={{color:"#9cc6ff",fontSize:11,letterSpacing:1.4,fontWeight:900}}>JOB RISK ASSESSMENT · FIELD STUDIO</div><h2 style={{fontSize:26,margin:"6px 0"}}>People. Tasks. Hazards. Controls.</h2><p style={{color:"#cbd5e1",fontSize:12,maxWidth:720,lineHeight:1.65}}>Job details, participants, hazards, risk and control edits autosave to this browser. Microsoft 365 is modeled but disconnected in demo mode.</p></div>
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    <button style={{...primary,background:"#fff",color:"#14305b"}} onClick={start}><Plus size={16} style={{display:"inline"}}/> New JRA</button>
    <button style={{...btn,background:"#dbeafe",borderColor:"#dbeafe"}} onClick={startSample}>Load example job</button>
   </div>
  </div>
  <div style={{...shell,display:"grid",gap:8}}>
    <strong style={{fontSize:13}}>Export job risk assessments</strong>
    <p style={{fontSize:11,color:"#64748b",margin:0}}>Generate an editable Word, PDF, CSV or JSON file. Blank templates, in-progress drafts and saved JRAs can be downloaded without a server.</p>
    <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
      <span style={{fontSize:11,fontWeight:800}}>Blank JRA:</span>
      <DocumentDownloadActions document={buildBlankJraDocument(org,persons)} compact/>
      {current?<><span style={{fontSize:11,fontWeight:800}}>Current {current.status==="DRAFT"?"draft":"assessment"}:</span><DocumentDownloadActions document={buildJraDocument(current,persons)} compact/></>:null}
    </div>
  </div>
  {message?<div role="status" style={{...shell,color:"#1e40af",background:"#eff6ff",fontSize:12}}>{message}</div>:null}
  {!current?<div style={{display:"grid",gap:11}}>
   <div style={{...shell,display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap"}}>
     <div><h3 style={{margin:"0 0 4px"}}>Saved job risk assessments</h3><label style={{...label,marginTop:8}}>Organization
       <select style={{...input,minWidth:220}} value={org.id} onChange={e=>setSelectedOrg(e.target.value)}>{orgs.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label><span style={{fontSize:12,color:"#667085"}}>{count} locally saved job records; no sign-in required</span></div><button style={primary} onClick={start}>Create new JRA</button></div>
   {records.filter(r=>r.orgId===org.id).length===0?<div style={{...shell,textAlign:"center",padding:"45px 15px"}}><ClipboardList size={34} color="#94a3b8"/><h3>No JRA saved yet</h3><p style={{color:"#64748b",fontSize:12}}>Start a new assessment, choose workers and build a task-by-task hazard register.</p></div>:records.map(jra=><div key={jra.id} style={{...shell,display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}>
    <div><Badge>{jra.status.replaceAll("_"," ")}</Badge><h3 style={{fontSize:16,margin:"8px 0 5px"}}>{jra.title||"Untitled assessment"}</h3><span style={{fontSize:12,color:"#667085"}}>{jra.reference} · {jra.jobId} · {jra.tasks.length} steps · {jra.participants.length} people</span></div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}><DocumentDownloadActions document={buildJraDocument(jra,persons)} compact/><button style={btn} onClick={()=>{setCurrent(jra);setSelectedOrg(jra.orgId);setEditing(jra.id);setPage("job");setMessage("");}}>Open</button><button style={btn} onClick={()=>{const newId="JRA-"+crypto.randomUUID();const copy={...structuredClone(jra),id:newId,reference:jra.reference+"-COPY",revision:1,status:"DRAFT" as const,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};setCurrent(copy);setEditing(null);setPage("job");}}>Duplicate</button></div>
   </div>)}
  </div>:<div style={{display:"grid",gap:13}}>
    <div style={{...shell,borderTop:"4px solid "+org.accent}}>
     <div style={{display:"flex",gap:13,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
       {job.logoSnapshot?<img src={job.logoSnapshot} alt={job.companyNameSnapshot+" logo"} style={{maxHeight:65,maxWidth:105,objectFit:"contain"}}/>:<div style={{width:55,height:55,borderRadius:10,display:"grid",placeItems:"center",background:"#dbeafe",color:"#1849a9",fontWeight:900}}>LOGO</div>}
       <div><strong style={{fontSize:15}}>{job.companyNameSnapshot}</strong><div style={{fontSize:11,color:"#667085"}}>{job.reference} · v{job.revision} · {job.status.replaceAll("_"," ")}</div></div>
      </div>
      <button style={btn} onClick={()=>{setCurrent(null);setMessage("");}}>← Back to JRA library</button>
     </div>
     <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:17}}>
      {([{key:"job",text:"1 · Job details",icon:FileText},{key:"team",text:"2 · Team & roles",icon:Users},{key:"risks",text:"3 · Tasks & hazards",icon:ShieldAlert},{key:"review",text:"4 · Review",icon:CheckCircle2}] as const).map(t=><button key={t.key} onClick={()=>setPage(t.key)} style={{...btn,background:page===t.key?"#193962":"#fff",color:page===t.key?"#fff":"#344054",display:"flex",gap:6,alignItems:"center"}}><t.icon size={15}/>{t.text}</button>)}
     </div>
    </div>
    {page==="job"?<motion.div initial={reduced?false:{opacity:0,y:6}} animate={{opacity:1,y:0}} style={{...shell,display:"grid",gap:13}}>
     <h3 style={{margin:0}}>Work package / JRA scope</h3>
     <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:11}}>
      <label style={label}>Job / activity title<input style={input} value={job.title} onChange={e=>patch({title:e.target.value})} placeholder="Replace haul truck brake lines"/></label>
      <label style={label}>Job / work order reference<input style={input} value={job.jobId} onChange={e=>patch({jobId:e.target.value})} placeholder="WO-2026-014"/></label>
      <label style={label}>Type of work<select style={input} value={job.jobType} onChange={e=>patch({jobType:e.target.value})}>{dictionary.jobTypes.map(t=><option key={t}>{t}</option>)}</select></label>
      <label style={label}>Site<select style={input} value={job.siteId} onChange={e=>patch({siteId:e.target.value})}>{org.siteIds.map(x=><option key={x}>{x}</option>)}</select></label>
      <label style={label}>Work area / asset<input style={input} value={job.location} onChange={e=>patch({location:e.target.value})} placeholder="Workshop bay 4"/></label>
      <label style={label}>Supervisor<select style={input} value={job.supervisorId} onChange={e=>patch({supervisorId:e.target.value})}><option value="">Choose supervisor</option>{persons.map(p=><option value={p.id} key={p.id}>{p.displayName} · {p.jobTitle}</option>)}</select></label>
      <label style={label}>Start date<input type="date" style={input} value={job.startDate} onChange={e=>patch({startDate:e.target.value})}/></label>
      <label style={label}>End date<input type="date" style={input} value={job.endDate} onChange={e=>patch({endDate:e.target.value})}/></label>
     </div>
     <label style={label}>Scope of work<textarea style={{...input,minHeight:91}} value={job.scope} onChange={e=>patch({scope:e.target.value})} placeholder="Describe task, boundaries, location and expected outcome"/></label>
     <label style={label}>Method / safe sequence<textarea style={{...input,minHeight:73}} value={job.method} onChange={e=>patch({method:e.target.value})} placeholder="Work execution approach"/></label>
     <label style={label}>Emergency and rescue plan<textarea style={{...input,minHeight:72}} value={job.emergencyPlan} onChange={e=>patch({emergencyPlan:e.target.value})} placeholder="Response team, emergency contact, evacuation route"/></label>
     <div><strong style={{fontSize:12}}>PPE required</strong><div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:7}}>{dictionary.ppe.map(p=><button key={p} aria-pressed={job.ppe.includes(p)} style={{...btn,background:job.ppe.includes(p)?"#dbeafe":"white",padding:"8px 11px",fontSize:11}} onClick={()=>patch({ppe:unique(job.ppe,p,!job.ppe.includes(p))})}>{p}</button>)}</div></div>
     <div style={{display:"flex",justifyContent:"flex-end"}}><button style={primary} onClick={()=>setPage("team")}>Next · Team & roles <ChevronRight size={15} style={{display:"inline"}}/></button></div>
    </motion.div>:null}
    {page==="team"?<div style={{display:"grid",gap:12}}>
     <div style={{...shell,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
      <div><h3 style={{margin:"0 0 4px"}}>Personnel involved in this work</h3><p style={{fontSize:12,color:"#667085",margin:0}}>Choose workers, supervisors and contractors from your local organization directory.</p></div>
      <Badge>{job.participants.length} selected</Badge>
     </div>
     <div style={shell}><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:13}}><Search size={17} color="#64748b"/><input style={input} value={peopleSearch} onChange={e=>setPeopleSearch(e.target.value)} placeholder="Search people, employee ID, department or role"/></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(215px,1fr))",gap:9,maxHeight:340,overflowY:"auto"}}>
       {filtered.map(p=><button key={p.id} aria-pressed={job.participants.some(x=>x.personId===p.id)} onClick={()=>toggleParticipant(p)} style={{...shell,textAlign:"left",cursor:"pointer",padding:12,background:job.participants.some(x=>x.personId===p.id)?"#eff6ff":"#fff",borderColor:job.participants.some(x=>x.personId===p.id)?"#60a5fa":"#e2e8f0"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:6}}><strong style={{fontSize:13}}>{p.displayName}</strong>{job.participants.some(x=>x.personId===p.id)?<CheckCircle2 size={17} color="#2563eb"/>:<Plus size={17} color="#64748b"/>}</div>
        <div style={{fontSize:11,color:"#667085",marginTop:5}}>{p.jobTitle} · {p.department}</div><div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>Employee {p.employeeNumber??"Local"} · {p.source==="MICROSOFT_365"?"Microsoft Graph":"Demo"}</div>
       </button>)}
      </div>
     </div>
     {job.participants.length?<div style={shell}><h3 style={{marginTop:0}}>Assigned team · acknowledgement roster</h3>
      <div style={{display:"grid",gap:8}}>{job.participants.map(p=><div key={p.personId} style={{padding:11,border:"1px solid #e2e8f0",borderRadius:11,display:"flex",gap:11,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
       <div><strong style={{fontSize:12}}>{p.nameSnapshot}</strong><div style={{fontSize:10,color:"#667085"}}>Directory ID {p.personId}</div></div>
       <select aria-label={"Role for "+p.nameSnapshot} style={{...input,width:"auto",minWidth:135}} value={p.role} onChange={e=>patch({participants:job.participants.map(x=>x.personId===p.personId?{...x,role:e.target.value}:x)})}>{dictionary.jobRoles.map(role=><option key={role}>{role}</option>)}</select>
       <label style={{fontSize:11,display:"flex",alignItems:"center",gap:5}}><input type="checkbox" checked={p.acknowledged} onChange={e=>patch({participants:job.participants.map(x=>x.personId===p.personId?{...x,acknowledged:e.target.checked,acknowledgedAt:e.target.checked?new Date().toISOString():undefined}:x)})}/> Demo acknowledgement</label>
       <button style={{...btn,padding:8,minHeight:33}} onClick={()=>patch({participants:job.participants.filter(x=>x.personId!==p.personId)})} aria-label={"Remove "+p.nameSnapshot}><Trash2 size={15}/></button>
      </div>)}</div>
     </div>:null}
     <button style={{...primary,justifySelf:"end"}} onClick={()=>setPage("risks")}>Next · Tasks & hazards →</button>
    </div>:null}
    {page==="risks"?<div style={{display:"grid",gap:12}}>
      <div style={{...shell,display:"flex",gap:12,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}><div><h3 style={{margin:"0 0 4px"}}>Job steps · hazard register</h3><p style={{fontSize:12,color:"#667085",margin:0}}>For every activity, identify exposed people, consequences, controls and initial/residual risk.</p></div><button style={primary} onClick={addTask}><Plus size={16} style={{display:"inline"}}/> Add job step</button></div>
      {job.tasks.length===0?<div style={{...shell,textAlign:"center",padding:39}}><HardHat color="#94a3b8" size={34}/><p style={{fontSize:13}}>No steps yet. Add each task performed during this work.</p></div>:null}
      {job.tasks.map((step,index)=><motion.section initial={reduced?false:{opacity:0,y:6}} animate={{opacity:1,y:0}} key={step.id} style={shell}>
        <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap"}}>
         <h3 style={{margin:0,fontSize:16}}>Step {index+1}</h3><button style={{...btn,color:"#b42318"}} onClick={()=>patch({tasks:job.tasks.filter(t=>t.id!==step.id).map((s,i)=>({...s,sequence:i+1}))})}><Trash2 size={14} style={{display:"inline"}}/> Remove</button>
        </div>
        <label style={{...label,marginTop:12}}>Task/activity description<textarea style={{...input,minHeight:66}} value={step.description} onChange={e=>updateTask(step.id,t=>({...t,description:e.target.value}))} placeholder="Isolate, inspect, replace or test a component…"/></label>
        <label style={{...label,marginTop:10}}>Equipment / tools (comma-separated)<input style={input} value={step.equipment.join(", ")} onChange={e=>updateTask(step.id,t=>({...t,equipment:e.target.value.split(",").map(v=>v.trim()).filter(Boolean)}))} placeholder="LOTO kit, spanners, hydraulic jack"/></label>
        <div style={{display:"grid",gap:10,marginTop:14}}>
         {step.hazards.map((hazard,hi)=>{
          let residual:ReturnType<typeof scoreRisk>|null=null;try{residual=scoreRisk(defaultRiskMatrix,hazard.residual);}catch{}
          return <div key={hazard.id} style={{background:"#f8fafc",border:"1px solid #dce4ec",borderRadius:13,padding:13,display:"grid",gap:11}}>
           <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}><strong style={{fontSize:13}}>Hazard {hi+1}</strong><button style={{...btn,padding:7,minHeight:33,color:"#b42318"}} aria-label="Remove hazard" onClick={()=>updateTask(step.id,t=>({...t,hazards:t.hazards.filter(h=>h.id!==hazard.id)}))}><Trash2 size={15}/></button></div>
           <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:9}}>
            <label style={label}>Hazard category<select style={input} value={hazard.category} onChange={e=>changeHazard(step.id,hazard.id,h=>({...h,category:e.target.value}))}>{dictionary.hazardCategories.map(v=><option key={v}>{v}</option>)}</select></label>
            <label style={label}>What can go wrong?<input style={input} value={hazard.hazard} placeholder="Unintended equipment movement" onChange={e=>changeHazard(step.id,hazard.id,h=>({...h,hazard:e.target.value}))}/></label>
            <label style={label}>Potential consequence<input style={input} value={hazard.consequence} placeholder="Crush injury / equipment damage" onChange={e=>changeHazard(step.id,hazard.id,h=>({...h,consequence:e.target.value}))}/></label>
           </div>
           <div><strong style={{fontSize:12}}>People exposed to this hazard</strong>
            {job.participants.length===0?<p style={{color:"#b45309",fontSize:11}}>Add job participants on Team tab first.</p>:<div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:7}}>{job.participants.map(p=><button key={p.personId} aria-pressed={hazard.exposedPersonIds.includes(p.personId)} style={{...btn,fontSize:11,padding:"7px 10px",background:hazard.exposedPersonIds.includes(p.personId)?"#dbeafe":"#fff"}} onClick={()=>changeHazard(step.id,hazard.id,h=>({...h,exposedPersonIds:unique(h.exposedPersonIds,p.personId,!h.exposedPersonIds.includes(p.personId))}))}>{p.nameSnapshot}</button>)}</div>}
           </div>
           <div><strong style={{fontSize:12}}>Initial risk — without additional controls</strong><div style={{marginTop:7}}><RiskChooser value={hazard.initial} onChange={risk=>changeHazard(step.id,hazard.id,h=>({...h,initial:risk}))}/></div></div>
           <div style={{borderTop:"1px solid #e2e8f0",paddingTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}><strong style={{fontSize:12}}>Remedies / preventive controls</strong><button style={{...btn,fontSize:11,padding:"7px 9px",minHeight:33}} onClick={()=>changeHazard(step.id,hazard.id,h=>({...h,controls:[...h.controls,{id:"ctrl-"+crypto.randomUUID(),hierarchy:dictionary.hierarchyOfControls[2],description:"",verified:false}]}))}><Plus size={13} style={{display:"inline"}}/> Add control</button></div>
            {hazard.controls.map(control=><div key={control.id} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:7,marginTop:8}}>
             <select aria-label="Hierarchy of control" style={input} value={control.hierarchy} onChange={e=>changeHazard(step.id,hazard.id,h=>({...h,controls:h.controls.map(c=>c.id===control.id?{...c,hierarchy:e.target.value}:c)}))}>{dictionary.hierarchyOfControls.map(v=><option key={v}>{v}</option>)}</select>
             <input aria-label="Control or remedy" style={input} value={control.description} placeholder="Install physical isolation" onChange={e=>changeHazard(step.id,hazard.id,h=>({...h,controls:h.controls.map(c=>c.id===control.id?{...c,description:e.target.value}:c)}))}/>
             <select aria-label="Responsible person" style={input} value={control.ownerId??""} onChange={e=>changeHazard(step.id,hazard.id,h=>({...h,controls:h.controls.map(c=>c.id===control.id?{...c,ownerId:e.target.value}:c)}))}><option value="">Owner</option>{job.participants.map(p=><option key={p.personId} value={p.personId}>{p.nameSnapshot}</option>)}</select>
             <label style={{fontSize:11,display:"flex",gap:4,alignItems:"center"}}><input type="checkbox" checked={control.verified} onChange={e=>changeHazard(step.id,hazard.id,h=>({...h,controls:h.controls.map(c=>c.id===control.id?{...c,verified:e.target.checked}:c)}))}/> Verified</label>
             <button aria-label="Delete control" style={{...btn,padding:7}} onClick={()=>changeHazard(step.id,hazard.id,h=>({...h,controls:h.controls.filter(c=>c.id!==control.id)}))}><Trash2 size={15}/></button>
            </div>)}
           </div>
           <div><strong style={{fontSize:12}}>Residual risk — after controls</strong><div style={{marginTop:7}}><RiskChooser value={hazard.residual} onChange={risk=>changeHazard(step.id,hazard.id,h=>({...h,residual:risk}))}/></div>
            {residual?.requiresApproval?<p style={{color:"#b42318",fontSize:12,fontWeight:800}}><AlertTriangle size={14} style={{display:"inline"}}/> High or extreme residual risk — supervisor review and additional controls required before any work.</p>:null}
           </div>
          </div>;
         })}
         <button style={{...btn,justifySelf:"start"}} onClick={()=>updateTask(step.id,t=>({...t,hazards:[...t.hazards,blankHazard()]}))}><Plus size={15} style={{display:"inline"}}/> Add hazard to this step</button>
        </div>
      </motion.section>)}
      <button style={{...primary,justifySelf:"end"}} onClick={()=>setPage("review")}>Next · Review risk assessment →</button>
    </div>:null}
    {page==="review"?<div style={{display:"grid",gap:13}}>
      <div style={{...shell,background:assessment?.decision==="READY_FOR_DEMO_REVIEW"?"#ecfdf3":"#fff7ed",borderColor:assessment?.decision==="READY_FOR_DEMO_REVIEW"?"#abefc6":"#fed7aa"}}>
       <div style={{display:"flex",gap:12,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}><div><strong style={{fontSize:18}}>{assessment?.decision.replaceAll("_"," ")}</strong><p style={{fontSize:12,color:"#667085",margin:"4px 0"}}>{job.tasks.length} job steps · {job.tasks.reduce((n,s)=>n+s.hazards.length,0)} hazards · {job.participants.length} participating people</p></div>
       <div style={{display:"flex",gap:7,flexWrap:"wrap"}}><Badge color={assessment?.highRisks?"#b42318":"#087f5b"}>{assessment?.highRisks??0} high residual risks</Badge><Badge color={assessment?.unverifiedControls?"#b45309":"#087f5b"}>{assessment?.unverifiedControls??0} controls awaiting verification</Badge></div></div>
       {assessment?.unverifiedControls?<p style={{fontSize:12,color:"#b45309",margin:"10px 0 0"}}>Confirm each implemented control in Tasks & hazards. An unverified remedy cannot support a demo approval.</p>:null}
       {assessment?.missing.length?<div style={{marginTop:12}}><strong style={{fontSize:12}}>Missing information</strong><ul style={{fontSize:12,color:"#92400e",lineHeight:1.8}}>{assessment.missing.slice(0,24).map((m,i)=><li key={i}>{m}</li>)}</ul></div>:null}
      </div>
      <div style={shell}><h3 style={{marginTop:0}}>Approver / review register</h3>
       <p style={{fontSize:12,color:"#667085"}}>Choose a different person from the job supervisor for independent review. These approvals are simulated; there are no real electronic signatures.</p>
       <label style={label}>Independent reviewer<select style={input} value={job.reviewerId} onChange={e=>patch({reviewerId:e.target.value})}><option value="">Choose reviewer</option>{persons.filter(p=>p.id!==job.supervisorId).map(p=><option key={p.id} value={p.id}>{p.displayName} · {p.jobTitle}</option>)}</select></label>
       <label style={{...label,marginTop:13}}>Review notes<textarea style={{...input,minHeight:90}} value={job.reviewerNote} onChange={e=>patch({reviewerNote:e.target.value})} placeholder="Required amendments, outstanding controls and approval conditions"/></label>
       <div style={{display:"grid",gap:9,marginTop:14}}>
        {job.participants.map(p=><div key={p.personId} style={{padding:9,borderRadius:8,background:"#f8fafc",display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap"}}><span style={{fontSize:12}}>{p.nameSnapshot} · {p.role}</span><Badge color={p.acknowledged?"#087f5b":"#b45309"}>{p.acknowledged?"DEMO ACKNOWLEDGED":"AWAITING ACKNOWLEDGEMENT"}</Badge></div>)}
       </div>
       <p style={{color:"#b42318",fontSize:11,marginTop:12}}>A DEMO APPROVED label does not grant permission to perform work. Formal authorization, site verification and records remain future implementation.</p>
      </div>
      <div style={{...shell,display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
       <button style={btn} onClick={()=>save("DRAFT")}>Save editable draft</button>
       <div style={{display:"flex",gap:8,flexWrap:"wrap"}}><button style={primary} onClick={submitReview}>Save for review</button><button style={{...primary,background:"#087f5b",borderColor:"#087f5b",opacity:canSimulateApproval(job)?1:0.5}} disabled={!canSimulateApproval(job)} onClick={approveDemo}>Mark reviewed (demo)</button></div>
      </div>
    </div>:null}
    {page!=="review"?<div style={{...shell,display:"flex",justifyContent:"flex-end"}}><button style={btn} onClick={()=>save("DRAFT")}>Save draft</button></div>:null}
   </div>}
 </section>;
}
const blankPlaceholder:JobRiskAssessment={
 id:"",orgId:"",companyNameSnapshot:"",reference:"",title:"",jobType:"",jobId:"",siteId:"",location:"",
 startDate:"",endDate:"",supervisorId:"",revision:1,createdAt:"",updatedAt:"",status:"DRAFT",
 participants:[],tasks:[],scope:"",method:"",ppe:[],emergencyPlan:"",permits:[],reviewerId:"",reviewerNote:""
};
