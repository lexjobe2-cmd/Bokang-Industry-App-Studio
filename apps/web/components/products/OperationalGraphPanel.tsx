"use client";
import {useMemo,useState} from "react";
import {motion,useReducedMotion} from "framer-motion";
import {ArrowRight,Network,Search,ShieldAlert,CheckCircle2,ClipboardCheck,Link2,AlertTriangle} from "lucide-react";
import {usePersistentState} from "@bokang/persistence";
import {additionalAssuranceRecipes,workflowLinks} from "@bokang/domain-data/expanded-assurance";
import {ASSURANCE_STORAGE,demoOrganization,type OrganizationProfile} from "@bokang/domain-data/custom-assurance";
import type {FormSubmission} from "@bokang/domain-data/assurance-forms";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
export const ACTIVE_WORKFLOW_KEY="bokang-studio.move-track.assurance.active-template.v1";
export const ACTIVE_FORMS_TAB_KEY="bokang-studio.move-track.assurance.active-tab.v1";
export const ACTIVE_JOB_REFERENCE_KEY="bokang-studio.move-track.active-job.v1";
export const recipeTemplateId=(orgId:string,workflowId:string)=>"op-"+orgId+"-"+workflowId;
const card:React.CSSProperties={border:"1px solid #dbe5f2",borderRadius:15,background:"#fff",padding:15};
const btn:React.CSSProperties={border:"1px solid #cbd5e1",borderRadius:10,padding:"9px 12px",background:"#fff",cursor:"pointer",fontWeight:800,color:"#193756",minHeight:43};
export function OperationalGraphPanel({onOpenWorkflow}:{onOpenWorkflow?:()=>void}={}){
 const reduced=useReducedMotion();
 const [orgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [orgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const org=orgs.find(o=>o.id===orgId)??orgs[0]??demoOrganization;
 const [job,setJob]=usePersistentState(ACTIVE_JOB_REFERENCE_KEY,"WO-DEMO-001");
 const [,setActive]=usePersistentState<string|null>(ACTIVE_WORKFLOW_KEY,null);
 const [,setTab]=usePersistentState<"library"|"records"|"designer"|"jra">(ACTIVE_FORMS_TAB_KEY,"library");
 const [submitted]=usePersistentState<FormSubmission[]>("bokang-studio.move-track.assurance-submissions.v1",[]);
 const [search,setSearch]=useState("");
 const [area,setArea]=useState("All areas");
 const [expanded,setExpanded]=useState<string|null>("working-at-height");
 const statusFor=(id:string)=>{
  const relevant=submitted.filter(s=>s.templateId===recipeTemplateId(org.id,id)&&s.taskId===job.trim());
  const latest=relevant.sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt))[0];
  return latest?.decision??"NOT_STARTED";
 };
 const grouped=useMemo(()=>additionalAssuranceRecipes.filter(r=>(area==="All areas"||r.area===area)&&
  (r.title+" "+r.trigger+" "+r.criticalControls.join(" ")).toLowerCase().includes(search.toLowerCase())),[area,search]);
 const completed=additionalAssuranceRecipes.filter(w=>statusFor(w.id)==="COMPLETE").length;
 function openWorkflow(id:string){
  setActive(recipeTemplateId(org.id,id));setTab("library");onOpenWorkflow?.();
  document.querySelector('[aria-label="Operational forms"]')?.scrollIntoView({behavior:"smooth",block:"start"});
 }
 return <section aria-label="Operational workflow graph" style={{display:"grid",gap:12}}>
  <div style={{...card,background:"#0c2445",color:"#fff",border:0,padding:20}}>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
    <div><p style={{fontSize:11,letterSpacing:1.5,color:"#9ecbff",fontWeight:900,margin:0}}>STEP 02 · OPERATIONAL WORKFLOW GRAPH</p>
     <h2 style={{fontSize:24,margin:"6px 0"}}>21 connected safety workflows</h2>
     <p style={{fontSize:12,color:"#cbd5e1",margin:0,lineHeight:1.6,maxWidth:790}}>Working at heights plus 20 new operational controls. Each opens a functional branded checklist, saves a job-linked record and shows related workflows. This is a local demonstration, not a permit or workplace authorization.</p>
    </div>
    <div style={{textAlign:"right"}}><strong style={{fontSize:26,display:"block"}}>{completed}/21</strong><span style={{fontSize:11,color:"#a3c9f5"}}>Checklists COMPLETE for this job</span></div>
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10,marginTop:15}}>
    <label style={{fontSize:12,color:"#dbeafe",fontWeight:700,display:"grid",gap:5}}>Active job / work order reference<input value={job} onChange={e=>setJob(e.target.value)} placeholder="WO-DEMO-001" style={{padding:"11px",border:"1px solid #8096b3",borderRadius:10,minHeight:43,font:"inherit",color:"#102033"}}/></label>
    <label style={{fontSize:12,color:"#dbeafe",fontWeight:700,display:"grid",gap:5}}>Search the connected workflows<div style={{display:"flex",gap:7,alignItems:"center",background:"#fff",borderRadius:10,padding:"0 10px"}}><Search size={16} color="#64748b"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="height, rescue, gas test, silica..." style={{minWidth:0,flex:1,border:0,padding:"12px 3px",font:"inherit",color:"#102033"}}/></div></label>
    <label style={{fontSize:12,color:"#dbeafe",fontWeight:700,display:"grid",gap:5}}>Area<select style={{padding:11,borderRadius:10,minHeight:43,color:"#102033"}} value={area} onChange={e=>setArea(e.target.value)}><option>All areas</option>{[...new Set(additionalAssuranceRecipes.map(r=>r.area))].map(name=><option key={name}>{name}</option>)}</select></label>
   </div>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:10}}>
   {grouped.map(workflow=>{
    const status=statusFor(workflow.id),active=expanded===workflow.id,related=workflowLinks(workflow.id);
    return <motion.article key={workflow.id} whileHover={reduced?undefined:{y:-2}} style={{...card,borderColor:active?"#93c5fd":"#dbe5f2",display:"grid",gap:10,alignContent:"start"}}>
     <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"start"}}>
      <span style={{fontSize:10,fontWeight:900,letterSpacing:0.7,color:"#1d4ed8"}}>{workflow.area.toUpperCase()}</span>
      <span style={{fontSize:10,color:status==="COMPLETE"?"#047857":status==="NO_GO"?"#b42318":status==="REVIEW"?"#b45309":"#64748b",fontWeight:900}}>{status==="NOT_STARTED"?"NOT STARTED":status==="COMPLETE"?"SAVED · COMPLETE":status==="NO_GO"?"NO-GO FLAG":status==="REVIEW"?"REVIEW REQUIRED":status}</span>
     </div>
     <h3 style={{fontSize:16,margin:0,lineHeight:1.3}}>{workflow.title}</h3>
     <p style={{fontSize:12,margin:0,lineHeight:1.55,color:"#64748b"}}>{workflow.trigger}</p>
     <div style={{display:"flex",gap:9,alignItems:"center",fontSize:11,color:"#51627b"}}>
      <ClipboardCheck size={14}/>{workflow.criticalControls.length} critical control checks
      <Link2 size={14}/>{related.length} linked workflows
     </div>
     {active?<div style={{borderTop:"1px solid #e2e8f0",paddingTop:9,display:"grid",gap:7}}>
      <strong style={{fontSize:12}}>Critical assurance checklist</strong>
      {workflow.criticalControls.map((c,i)=><span style={{display:"flex",gap:7,color:"#475569",fontSize:11}} key={i}><ShieldAlert size={13} color="#c2781b"/>{c}</span>)}
      {related.length?<><strong style={{fontSize:12,marginTop:8}}>Connected workflows</strong><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{related.map(id=><button key={id} style={{...btn,fontSize:10,padding:"6px 8px",minHeight:30}} onClick={()=>{setSearch("");setArea("All areas");setExpanded(id);}}>{additionalAssuranceRecipes.find(w=>w.id===id)?.title??id} <span style={{color:"#2563eb"}}>· {statusFor(id)==="COMPLETE"?"done":"open"}</span></button>)}</div></>:null}
     </div>:null}
     <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:"auto"}}>
      <button style={{...btn,flex:"1 1 auto",background:"#174fa8",color:"#fff",borderColor:"#174fa8"}} onClick={()=>openWorkflow(workflow.id)}>Open checklist <ArrowRight size={14} style={{display:"inline",verticalAlign:"middle"}}/></button>
      <button style={btn} aria-expanded={active} onClick={()=>setExpanded(active?null:workflow.id)}>{active?"Less":"Controls"}</button>
     </div>
    </motion.article>;
   })}
   {!grouped.length?<div style={{...card,gridColumn:"1 / -1"}}>No matching workflow. Change your search or area.</div>:null}
  </div>
  <p style={{fontSize:11,color:"#64748b",margin:0}}>The connections represent related work packages to review, not automated proof of compliance. For high-risk tasks, a competent human must approve the actual plan and site controls.</p>
 </section>;
}
