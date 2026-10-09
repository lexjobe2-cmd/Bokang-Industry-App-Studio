"use client";

import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClipboardCheck, FileText, ShieldAlert, ChevronRight, ChevronLeft, Plus, Trash2, CheckCircle2, CloudOff } from "lucide-react";
import { defaultRiskMatrix, scoreRisk, type RiskAnswer } from "@bokang/domain-data/risk-matrix";
import { usePersistentState } from "@bokang/persistence";
import {
  starterAssuranceTemplates, evaluateForm, isVisible, makeSubmission,
  type FormAnswer, type FormAnswers, type FormField, type FormSubmission
} from "@bokang/domain-data/assurance-forms";
import { MOVE_TRACK_KEYS, starterFleet, type FleetVehicle, type FleetIncident, type FleetAssignment } from "../../lib/move-track";
import { CustomFormBuilder } from "./CustomFormBuilder";
import { JraWorkspace } from "./JraWorkspace";
import {SignatureApprovalTray} from "./SignatureApprovalTray";
import {isSignatureEvidence} from "@bokang/domain-data/signature-evidence";
import { ASSURANCE_STORAGE,demoPeople,demoOrganization,makeCustomTemplate,type CustomTemplate,type PersonRecord,type OrganizationProfile } from "@bokang/domain-data/custom-assurance";
import {additionalAssuranceRecipes,workflowLinks} from "@bokang/domain-data/expanded-assurance";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {ACTIVE_WORKFLOW_KEY,ACTIVE_FORMS_TAB_KEY,ACTIVE_JOB_REFERENCE_KEY,recipeTemplateId} from "./OperationalGraphPanel";
import {ACTIVE_PERSON_KEY} from "./UserParticipationAnalytics";
import {DocumentDownloadActions} from "./DocumentDownloadActions";
import {buildFormDocument} from "../../lib/form-exports";


const tile:React.CSSProperties={background:"#fff",border:"1px solid #dce4ee",borderRadius:17,padding:17};
const input:React.CSSProperties={width:"100%",padding:"12px 12px",font:"inherit",background:"#fff",color:"#101828",border:"1px solid #cbd5e1",borderRadius:11};
const button:React.CSSProperties={border:"1px solid #cbd5e1",borderRadius:12,padding:"11px 14px",background:"#fff",color:"#101828",fontWeight:750,cursor:"pointer",minHeight:44};
const categories:{[key:string]:{color:string;label:string}}={
 Fleet:{color:"#1d4ed8",label:"Fleet"},Meetings:{color:"#7c3aed",label:"Meetings"},
 Safety:{color:"#b45309",label:"Safety"},Risk:{color:"#b42318",label:"Risk"},
 Handover:{color:"#087e8b",label:"Handover"},Inspections:{color:"#344054",label:"Inspections"}
};
function answerText(value:FormAnswer|undefined){return typeof value==="string"||typeof value==="number"?String(value):"";}

export function AssuranceFormsWorkspace(){
 const reducedMotion=useReducedMotion();
 const [fleet,setFleet]=usePersistentState<FleetVehicle[]>(MOVE_TRACK_KEYS.fleet,starterFleet);
 const [,setIncidents]=usePersistentState<FleetIncident[]>(MOVE_TRACK_KEYS.incidents,[]);
 const [,setAssignments]=usePersistentState<FleetAssignment[]>(MOVE_TRACK_KEYS.assignments,[]);
 const [submissions,setSubmissions,hydrated]=usePersistentState<FormSubmission[]>("bokang-studio.move-track.assurance-submissions.v1",[]);
 const [drafts,setDrafts]=usePersistentState<Record<string,FormAnswers>>("bokang-studio.move-track.assurance-drafts.v1",{});
 const [tab,setTab]=usePersistentState<"library"|"records"|"designer"|"jra">(ACTIVE_FORMS_TAB_KEY,"library");
 const [customTemplates]=usePersistentState<CustomTemplate[]>(ASSURANCE_STORAGE.templates,[]);
 const [directory]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [actorPersonId,setActorPersonId]=usePersistentState(ACTIVE_PERSON_KEY,"");
 const [activeId,setActiveId]=usePersistentState<string|null>(ACTIVE_WORKFLOW_KEY,null);
 const [orgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [activeOrgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [jobReference,setJobReference]=usePersistentState(ACTIVE_JOB_REFERENCE_KEY,"WO-DEMO-001");
 const org=orgs.find(o=>o.id===activeOrgId)??orgs[0]??demoOrganization;
 const [librarySearch,setLibrarySearch]=useState("");
 const [sectionIndex,setSectionIndex]=useState(0);
 const [siteId,setSiteId]=useState("Jwaneng mine · demo profile");
 const [assetId,setAssetId]=useState("");
 const [notice,setNotice]=useState("");
 const recipeTemplates=useMemo(()=>additionalAssuranceRecipes.map(w=>makeCustomTemplate({
  id:recipeTemplateId(org.id,w.id),organization:org,title:w.title,description:w.trigger,
  category:w.category,sections:w.sections.map(section=>({...section,fields:[...section.fields]})),
  status:"PUBLISHED",now:"2026-10-08T00:00:00.000Z"
 })),[org]);
 const brandedStarters=useMemo(()=>starterAssuranceTemplates.map(t=>({
  ...t,organizationId:org.id,companyNameSnapshot:org.name,logoSnapshot:org.logoDataUrl,
  accent:org.accent,referencePrefix:org.documentPrefix,description:"Core operational form"
 })),[org]);
 const library=[...recipeTemplates,...brandedStarters,...customTemplates.filter(t=>t.status==="PUBLISHED"&&t.organizationId===org.id)];
 const template=library.find(t=>t.id===activeId);
 const brandedTemplate=template&&"organizationId" in template?template:null;
 const visiblePeople=directory.filter(p=>p.active&&p.orgId===org.id);
 const workflow=additionalAssuranceRecipes.find(w=>recipeTemplateId(org.id,w.id)===activeId);
 useEffect(()=>{setSectionIndex(0);},[activeId]);
 useEffect(()=>{setSiteId(org.siteIds[0]??"");},[org.id]);
 const answers=activeId?(drafts[activeId]??{}):{};
 const signatureScopePrefix=template?template.title+" / "+(jobReference.trim()||"no job reference")+" / "+(siteId||org.siteIds[0]||"unknown site")+" / "+org.id:"";
 const evaluation=useMemo(()=>template?evaluateForm(template,answers,[],signatureScopePrefix):null,[template,answers,signatureScopePrefix]);
 const activeSection=template?.sections[sectionIndex];
 const records=useMemo(()=>submissions.filter(s=>{
   const snapshot=s.templateSnapshot as typeof s.templateSnapshot & {organizationId?:string};
   return (snapshot.organizationId===org.id||(!snapshot.organizationId&&org.id===demoOrganization.id))&&(!activeId||s.templateId===activeId);
 }),[submissions,activeId,org.id]);
 function openTemplate(id:string){setActiveId(id);setSectionIndex(0);setNotice("");setTab("library");}
 function setAnswer(id:string,value:FormAnswer){
  if(!activeId)return;
  const previous=drafts[activeId]??{};
  const changed=JSON.stringify(previous[id])!==JSON.stringify(value);
  const hadSignature=changed&&!isSignatureEvidence(value)&&Object.entries(previous).some(([key,answer])=>key!==id&&isSignatureEvidence(answer));
  setDrafts(d=>{
   const next={...(d[activeId]??{}),[id]:value};
   if(hadSignature)for(const [key,answer] of Object.entries(next))if(key!==id&&isSignatureEvidence(answer))delete next[key];
   return {...d,[activeId]:next};
  });
  if(hadSignature)setNotice("Checklist content changed. Earlier local signatures were cleared: collect fresh acknowledgements for the updated answers.");
 }
 function submit(){
  if(!template||!evaluation)return;
  if(template.category==="Fleet"&&!assetId){setNotice("Select an asset so the inspection is linked to the fleet record.");return;}
  if(evaluation.missing.length){setNotice("Complete required questions before submitting. Missing: "+evaluation.missing.join(", "));return;}
  try{
    const record=makeSubmission({
      id:"DEMO-FORM-"+crypto.randomUUID(),template,answers,siteId:siteId||org.siteIds[0]||"Demo site",taskId:jobReference.trim()||undefined,
      assetId:template.category==="Fleet"?assetId||undefined:undefined,
      actorUid:"LOCAL-DEMO-OPERATOR",actorPersonId:actorPersonId||undefined,now:new Date().toISOString(),signatureScopePrefix
    });
    setSubmissions(current=>[record,...current]);
    if(template.category==="Fleet"&&assetId&&record.decision==="NO_GO"){
      // Demo-only cross-module update. Backend must atomically enforce this in production.
      setFleet(current=>current.map(a=>a.id===assetId?{...a,status:"No-go" as const}:a));
      setAssignments(current=>current.map(a=>a.vehicleId===assetId&&!["Returned","Cancelled"].includes(a.status)?{...a,status:"Grounded" as const}:a));
      setIncidents(current=>[{
        id:"DEF-"+record.id,vehicleId:assetId,createdAt:record.submittedAt,
        severity:"Critical",category:"Defect",status:"Open",
        description:"Critical checklist failure: "+evaluation.criticalFailures.join(", ")
      },...current]);
    }
    setDrafts(current=>({...current,[template.id]:{}}));
    setSectionIndex(0);setTab("records");setNotice(record.decision==="NO_GO"&&template.category==="Fleet"?"Demo NO-GO: linked fleet asset and assignment grounded; critical defect opened locally. Not production enforced.":"Demo form submitted. Saved to this browser only; no account or cloud storage needed.");
  }catch(error){setNotice(error instanceof Error?error.message:String(error));}
 }
 const easing={duration:reducedMotion?0:0.18};
 return <section aria-label="Operational forms" style={{display:"grid",gap:16,marginTop:16}}>
  <div style={{...tile,background:"#0b1930",color:"#fff",border:0}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"start",flexWrap:"wrap"}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:9,fontSize:11,fontWeight:850,letterSpacing:1.5,textTransform:"uppercase",color:"#9cc6ff"}}><ClipboardCheck size={16}/> Operational Assurance / Forms</div>
        <h2 style={{margin:"8px 0 5px",fontSize:26}}>One library. Connected safety workflows.</h2>
        <p style={{margin:0,color:"#cbd5e1",fontSize:13,lineHeight:1.7,maxWidth:670}}>{org.name} · {additionalAssuranceRecipes.length} specialized safety workflows plus built-in and custom forms. Work is stored by company and job on this device.</p>
      </div>
      <span style={{border:"1px solid #5a7194",borderRadius:999,padding:"7px 12px",fontSize:11,fontWeight:900,color:"#fef08a"}}>DEMO · LOCAL ONLY</span>
    </div>
  </div>
  <div style={{...tile,display:"flex",gap:10,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",background:"#f0fdf4",borderColor:"#bbf7d0"}}>
    <div><strong style={{color:"#166534"}}>Demo operator · No sign-in required</strong><p style={{color:"#475569",fontSize:12,margin:"4px 0"}}>All forms and drafts save in this browser. Test freely without external accounts.</p></div>
    <span style={{background:"#dcfce7",color:"#166534",padding:"7px 10px",borderRadius:999,fontSize:11,fontWeight:850}}>LOCAL STORAGE</span>
  </div>
  <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
    <button onClick={()=>{setTab("library");setActiveId(null);setNotice("");}} style={{...button,background:tab==="library"?"#172b4d":"#fff",color:tab==="library"?"#fff":"#344054"}}>Template library</button>
    <button onClick={()=>setTab("records")} style={{...button,background:tab==="records"?"#172b4d":"#fff",color:tab==="records"?"#fff":"#344054"}}>Submissions ({hydrated?submissions.length:"…" })</button>
    <button onClick={()=>{setTab("jra");setActiveId(null);}} style={{...button,background:tab==="jra"?"#172b4d":"#fff",color:tab==="jra"?"#fff":"#344054"}}>JRA job studio</button>
    <button onClick={()=>{setTab("designer");setActiveId(null);}} style={{...button,background:tab==="designer"?"#172b4d":"#fff",color:tab==="designer"?"#fff":"#344054"}}>Create custom form</button>
  </div>
  {notice?<div role="status" style={{padding:13,borderRadius:12,background:"#eff6ff",color:"#1e40af",fontSize:13}}>{notice}</div>:null}
  {tab==="designer"?<CustomFormBuilder onPublish={openTemplate}/>:null}
  {tab==="jra"?<JraWorkspace/>:null}
  {tab==="library"&&!template?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(245px,1fr))",gap:12}}>
    <div style={{...tile,background:"#eff6ff",borderColor:"#93c5fd",display:"grid",gap:10}}>
      <strong style={{fontSize:17}}>Create a company-branded custom form</strong>
      <span style={{fontSize:12,color:"#52677d"}}>Build unique checklists for every job, with your own logo, questions and repeatable fields.</span>
      <button style={{...button,background:"#173764",color:"#fff",justifySelf:"start"}} onClick={()=>setTab("designer")}>Open form designer →</button>
    </div>
    <div style={{...tile,background:"#f0fdf4",borderColor:"#86efac",display:"grid",gap:10}}>
      <strong style={{fontSize:17}}>Start a job risk assessment</strong>
      <span style={{fontSize:12,color:"#52677d"}}>Assign participants, list task steps, hazards and controls, and calculate residual risks.</span>
      <button style={{...button,background:"#065f46",color:"#fff",justifySelf:"start"}} onClick={()=>setTab("jra")}>Open JRA studio →</button>
    </div>
    <div style={{...tile,display:"grid",gap:6}}><strong>Search company checklists</strong><input aria-label="Search template library" style={input} value={librarySearch} onChange={e=>setLibrarySearch(e.target.value)} placeholder="Working at heights, confined space, scaffold, hazard..."/></div>
    {library.filter(t=>(t.title+" "+("description" in t?t.description:"")).toLowerCase().includes(librarySearch.toLowerCase())).map(t=><motion.button whileHover={reducedMotion?undefined:{y:-2}} transition={easing} key={t.id} onClick={()=>openTemplate(t.id)}
       style={{...tile,textAlign:"left",minHeight:154,cursor:"pointer",display:"grid",gap:9}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
       <span style={{fontSize:11,fontWeight:900,color:categories[t.category]?.color}}>{t.category.toUpperCase()}</span>
       <span style={{color:"#667085",fontSize:11}}>v{t.version} · {t.status}</span>
      </div>
      <strong style={{fontSize:17}}>{t.title}</strong>
      {"companyNameSnapshot" in t && typeof t.companyNameSnapshot==="string"?<span style={{fontSize:11,color:"#1d4ed8"}}>{t.companyNameSnapshot} · Branded</span>:null}
      <span style={{color:"#667085",fontSize:12}}>{t.sections.length} sections · {t.sections.reduce((sum,s)=>sum+s.fields.length,0)} questions</span>
      <span style={{display:"inline-flex",alignItems:"center",gap:6,color:"#1d4ed8",fontWeight:850,fontSize:12}}>Open form <ChevronRight size={16}/></span>
    </motion.button>)}
  </div>:null}
  {tab==="library"&&template&&activeSection&&evaluation?<div style={{display:"grid",gap:13}}>
    <div style={{...tile,borderTop:brandedTemplate?"4px solid "+(brandedTemplate.accent??"#155eef"):undefined}}>
      {brandedTemplate?<div style={{display:"flex",alignItems:"center",gap:13,marginBottom:14,borderBottom:"1px solid #e2e8f0",paddingBottom:13}}>
        {brandedTemplate.logoSnapshot?<img src={brandedTemplate.logoSnapshot} alt={brandedTemplate.companyNameSnapshot+" logo"} style={{maxHeight:59,maxWidth:104,objectFit:"contain"}}/>:<div style={{width:54,height:54,borderRadius:9,background:"#dbeafe",display:"grid",placeItems:"center",color:"#173764",fontWeight:900,fontSize:11}}>LOGO</div>}
        <div><strong style={{fontSize:15}}>{brandedTemplate.companyNameSnapshot}</strong><div style={{fontSize:11,color:"#64748b"}}>{brandedTemplate.referencePrefix} · {brandedTemplate.description}</div></div>
      </div>:null}
      <button style={{...button,padding:"6px 9px",minHeight:34,fontSize:12}} onClick={()=>setActiveId(null)}><ChevronLeft size={13} style={{display:"inline"}}/> All forms</button>
      <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginTop:12}}>
        <div><p style={{fontSize:11,fontWeight:850,color:categories[template.category]?.color,margin:0}}>{template.category.toUpperCase()} · VERSION {template.version}</p><h3 style={{fontSize:22,margin:"5px 0 2px"}}>{template.title}</h3></div>
        <div style={{textAlign:"right"}}><strong>{evaluation.progress}% complete</strong><p style={{fontSize:12,margin:"4px 0",color:"#667085"}}>Step {sectionIndex+1} of {template.sections.length}</p></div>
      </div>
      <div aria-label="Form completion" style={{height:7,borderRadius:20,background:"#e2e8f0",marginTop:12,overflow:"hidden"}}><motion.div initial={false} animate={{width:evaluation.progress+"%"}} transition={easing} style={{height:"100%",background:"#2563eb",borderRadius:20}}/></div>
      <div style={{display:"grid",gap:10,marginTop:12,padding:12,borderRadius:12,border:"1px solid #bfdbfe",background:"#f8fbff"}}>
       <strong style={{fontSize:12}}>Document download center · blank or current draft</strong>
       <p style={{fontSize:11,color:"#64748b",margin:0}}>Download the original unfilled template, or a copy of your in-progress answers before submitting. PDF, editable Word, CSV and JSON.</p>
       <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
         <DocumentDownloadActions document={buildFormDocument({template,mode:"blank",company:org,people:visiblePeople,jobId:jobReference,site:siteId})} compact/>
         <DocumentDownloadActions document={buildFormDocument({template,mode:"draft",answers,company:org,people:visiblePeople,jobId:jobReference,site:siteId})} compact/>
       </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginTop:15}}>
        <label style={{display:"grid",gap:5,fontSize:11,fontWeight:850}}>Operating site
          <select style={input} value={siteId} onChange={e=>setSiteId(e.target.value)}>{org.siteIds.map(site=><option key={site}>{site}</option>)}</select>
        </label>
        <label style={{display:"grid",gap:5,fontSize:11,fontWeight:850}}>Submitted by (local team member)
          <select style={input} value={visiblePeople.some(p=>p.id===actorPersonId)?actorPersonId:""} onChange={e=>setActorPersonId(e.target.value)}>
             <option value="">Anonymous demo operator</option>{visiblePeople.map(p=><option value={p.id} key={p.id}>{p.displayName} · {p.jobTitle}</option>)}
          </select>
        </label>
        <label style={{display:"grid",gap:5,fontSize:11,fontWeight:850}}>Job / work order ID
          <input style={input} value={jobReference} placeholder="WO-2026-001" onChange={e=>setJobReference(e.target.value)}/>
        </label>
        {template.category==="Fleet"?<label style={{display:"grid",gap:5,fontSize:11,fontWeight:850}}>Link to asset
          <select style={input} value={assetId} onChange={e=>setAssetId(e.target.value)}><option value="">Select asset (required)</option>{fleet.map(a=><option key={a.id} value={a.id}>{a.fleetNo} · {a.makeModel}</option>)}</select>
        </label>:null}
      </div>
    </div>
    {workflow&&workflowLinks(workflow.id).length?<div style={{...tile,display:"grid",gap:8,background:"#f8fafc"}}>
      <strong style={{fontSize:13}}>Connected risk-control workflows</strong>
      <p style={{fontSize:11,color:"#667085",margin:0}}>These are related checklists for the same work package, not proof of authorization.</p>
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
       {workflowLinks(workflow.id).map(id=><button key={id} style={{...button,fontSize:11,padding:"7px 10px",minHeight:34}} onClick={()=>openTemplate(recipeTemplateId(org.id,id))}>{additionalAssuranceRecipes.find(w=>w.id===id)?.title??id}</button>)}
      </div>
     </div>:null}
    <AnimatePresence mode="wait">
      <motion.div key={activeSection.id} initial={reducedMotion?false:{opacity:0,y:7}} animate={{opacity:1,y:0}} exit={reducedMotion?undefined:{opacity:0,y:-7}} transition={easing} style={tile}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{background:"#eff6ff",color:"#1d4ed8",borderRadius:12,padding:10}}><FileText size={20}/></div><div><p style={{fontSize:11,color:"#667085",fontWeight:850,margin:0}}>SECTION {sectionIndex+1}</p><h3 style={{margin:"3px 0"}}>{activeSection.title}</h3></div></div>
        {activeSection.description?<p style={{color:"#667085"}}>{activeSection.description}</p>:null}
        <div style={{display:"grid",gap:17,marginTop:22}}>
          {activeSection.fields.filter(f=>isVisible(f,answers)).map(f=><FieldInput key={f.id} field={f} people={visiblePeople} value={answers[f.id]} onChange={value=>setAnswer(f.id,value)} scope={signatureScopePrefix} reviewerPersonId={f.signerFieldId&&typeof answers[f.signerFieldId]==="string"?answers[f.signerFieldId] as string:undefined}/>)}
        </div>
      </motion.div>
    </AnimatePresence>
    <div style={{...tile,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
      <button style={button} disabled={sectionIndex===0} onClick={()=>setSectionIndex(x=>Math.max(0,x-1))}>Previous</button>
      {sectionIndex<template.sections.length-1?<button style={{...button,background:"#172b4d",color:"#fff"}} onClick={()=>setSectionIndex(x=>Math.min(template.sections.length-1,x+1))}>Next section <ChevronRight size={16} style={{display:"inline"}}/></button>:<button style={{...button,background:"#172b4d",color:"#fff",opacity:evaluation.missing.length?0.65:1}} onClick={submit} disabled={!!evaluation.missing.length}>Submit demo form</button>}
    </div>
    <div style={{...tile,background:evaluation.decision==="NO_GO"?"#fef2f2":evaluation.decision==="INCOMPLETE"?"#f8fafc":"#ecfdf3",display:"flex",alignItems:"start",gap:12}}>
      {evaluation.decision==="NO_GO"?<ShieldAlert size={21} color="#b42318"/>:<CheckCircle2 size={21} color="#157f4e"/>}
      <div><strong>Assessment: {evaluation.decision.replaceAll("_","-")}</strong><p style={{margin:"4px 0",fontSize:12,lineHeight:1.5}}>{evaluation.missing.length?evaluation.missing.length+" required answer(s) / evidence outstanding.":evaluation.criticalFailures.length?"Critical control failed. NO-GO in a controlled workflow.":"Required sections completed; supervisor controls may still apply."}</p></div>
    </div>
    <p style={{fontSize:11,color:"#b42318",margin:0}}>This frontend-only demonstration saves drafts and submissions in this browser, and can simulate equipment grounding. No external service, authenticated approval or actual equipment-control integration is active.</p>
  </div>:null}
  {tab==="records"?<div style={{display:"grid",gap:9}}>
    <div style={{display:"flex",gap:8,alignItems:"center",fontSize:13,color:"#667085"}}><CloudOff size={16}/> Your completed demo forms remain in this browser. They are not official safety approvals.</div>
    {records.length===0?<div style={tile}>No submitted demonstration forms. Choose a template to start.</div>:records.map(r=><div key={r.id} style={{...tile,display:"flex",justifyContent:"space-between",alignItems:"start",gap:10,flexWrap:"wrap"}}>
      <div><strong>{r.templateSnapshot.title}</strong><p style={{fontSize:12,color:"#667085",margin:"5px 0"}}>{new Date(r.submittedAt).toLocaleString()} · {r.templateId} v{r.templateVersion} · {r.siteId}</p></div>
      <div style={{textAlign:"right",display:"grid",gap:7,justifyItems:"end"}}>
       <strong style={{color:r.decision==="NO_GO"?"#b42318":"#047857"}}>{r.decision}</strong>
       <div style={{color:"#2563eb",fontSize:11}}>SAVED LOCALLY</div>
       <DocumentDownloadActions document={buildFormDocument({template:r.templateSnapshot,mode:"filled",submission:r,company:org,people:visiblePeople})} compact/>
     </div>
    </div>)}
  </div>:null}
 </section>;
}

function FieldInput({field,value,onChange,people,scope,reviewerPersonId}:{field:FormField;value:FormAnswer|undefined;people:readonly PersonRecord[];onChange:(value:FormAnswer)=>void;scope:string;reviewerPersonId?:string}){
 const label=<span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,fontWeight:800}}>{field.label}{field.required?<span style={{color:"#b42318"}}>*</span>:null}{field.critical?<span style={{fontSize:10,color:"#b42318",background:"#fef2f2",padding:"3px 7px",borderRadius:7}}>CRITICAL</span>:null}</span>;
 const fieldStyle:React.CSSProperties={display:"grid",gap:8};
 if(field.type==="person"){
   return <label style={fieldStyle}>{label}<select style={input} value={answerText(value)} onChange={e=>onChange(e.target.value)}>
    <option value="">Select organization person</option>
    {people.filter(p=>p.active).map(p=><option key={p.id} value={p.id}>{p.displayName} · {p.jobTitle} · {p.department}</option>)}
   </select><span style={{fontSize:11,color:"#64748b"}}>From the local organization directory. Microsoft 365 sync is not active.</span></label>;
 }
 if(field.type==="people"){
   const selected=Array.isArray(value)?value as string[]:[];
   return <div style={fieldStyle}>{label}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:7}}>
      {people.filter(p=>p.active).map(p=><button type="button" key={p.id} aria-pressed={selected.includes(p.id)} onClick={()=>onChange(selected.includes(p.id)?selected.filter(v=>v!==p.id):[...selected,p.id])}
        style={{...button,background:selected.includes(p.id)?"#dbeafe":"white",textAlign:"left",padding:10,fontSize:12}}>
        <strong>{selected.includes(p.id)?"✓ ":""}{p.displayName}</strong><span style={{display:"block",color:"#64748b",fontSize:10,marginTop:4}}>{p.jobTitle} · {p.department}</span>
      </button>)}
    </div><span style={{fontSize:11,color:"#64748b"}}>{selected.length} participant(s) selected. Demo directory only.</span>
   </div>;
 }
 if(field.type==="pass_fail_na"||field.type==="yes_no"){
   const opts=field.type==="yes_no"?["YES","NO"]:["PASS","FAIL","NA"];
   return <div style={fieldStyle}>{label}<div style={{display:"grid",gridTemplateColumns:`repeat(${opts.length},minmax(0,1fr))`,gap:8}}>
     {opts.map(opt=><button key={opt} aria-pressed={value===opt} style={{...button,background:value===opt?(opt==="FAIL"||opt==="NO"?"#fee2e2":"#dbeafe"):"#fff",borderColor:value===opt?"#2563eb":"#cbd5e1",minWidth:0}} onClick={()=>onChange(opt)}>{opt}</button>)}
   </div></div>;
 }
 if(field.type==="repeat"){
   const rows=Array.isArray(value)&&value.every(v=>typeof v==="object"&&!Array.isArray(v))?value as Record<string,string|number|boolean|null>[]:[];
   return <div style={{...fieldStyle,background:"#f8fafc",padding:13,borderRadius:13,border:"1px solid #e2e8f0"}}>{label}{rows.map((row,index)=><div key={index} style={{...tile,display:"grid",gap:9}}>
     <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><strong style={{fontSize:12}}>Entry {index+1}</strong><button type="button" style={{...button,padding:7,minHeight:34}} aria-label={"Remove entry "+(index+1)} onClick={()=>onChange(rows.filter((_,i)=>i!==index))}><Trash2 size={15}/></button></div>
     {field.children?.map(child=><label key={child.id} style={{...fieldStyle,fontSize:12}}>{child.label}<input type={child.type==="number"?"number":child.type==="date"?"date":"text"} value={String(row[child.id]??"")} onChange={e=>onChange(rows.map((r,i)=>i===index?{...r,[child.id]:child.type==="number"?Number(e.target.value):e.target.value}:r))} style={input}/></label>)}
   </div>)}<button type="button" style={{...button,justifySelf:"start"}} onClick={()=>onChange([...rows,{}])}><Plus size={15} style={{display:"inline"}}/> Add attendee / step</button></div>;
 }
 if(field.type==="multiselect"){
   const selected=Array.isArray(value)?value as string[]:[];
   return <div style={fieldStyle}>{label}<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{(field.options??[]).map(opt=><button key={opt} aria-pressed={selected.includes(opt)} style={{...button,background:selected.includes(opt)?"#dbeafe":"#fff"}} onClick={()=>onChange(selected.includes(opt)?selected.filter(v=>v!==opt):[...selected,opt])}>{opt}</button>)}</div></div>;
 }
 if(field.type==="risk"){
   const current:RiskAnswer=(value && typeof value==="object" && !Array.isArray(value) && "likelihood" in value && "consequence" in value) ? value as RiskAnswer : {likelihood:0,consequence:0,matrixId:defaultRiskMatrix.id,matrixVersion:defaultRiskMatrix.version};
   let result:ReturnType<typeof scoreRisk>|null=null;
   try{result=scoreRisk(defaultRiskMatrix,current);}catch{}
   const select=(dimension:"likelihood"|"consequence",labels:readonly string[])=><label style={{...fieldStyle,fontSize:12}}>
      {dimension==="likelihood"?"Likelihood":"Consequence"}
      <select style={input} value={current[dimension]||""} onChange={e=>onChange({...current,[dimension]:Number(e.target.value)})}>
       <option value="">Select</option>{labels.map((name,i)=><option key={name} value={i+1}>{i+1} · {name}</option>)}
      </select>
     </label>;
   return <div style={fieldStyle}>
     {label}
     <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10}}>
      {select("likelihood",defaultRiskMatrix.likelihoodLabels)}
      {select("consequence",defaultRiskMatrix.consequenceLabels)}
     </div>
     <div style={{padding:12,borderRadius:10,background:result?.level==="EXTREME"?"#fef2f2":result?.level==="HIGH"?"#fff7ed":"#f8fafc",fontSize:12}}>
      <strong>{result?result.score+" / 25 · "+result.level:"Choose likelihood and consequence"}</strong>
      <div style={{color:result?.requiresApproval?"#b42318":"#667085"}}>{result?.requiresApproval?"High / extreme risk requires separately verified supervisor approval":"Standard 5 × 5 matrix · version "+defaultRiskMatrix.version}</div>
     </div>
    </div>;
 }
 if(field.type==="select")return <label style={fieldStyle}>{label}<select style={input} value={answerText(value)} onChange={e=>onChange(e.target.value)}><option value="">Select option</option>{(field.options??["Day shift","Night shift"]).map(opt=><option key={opt}>{opt}</option>)}</select></label>;
 if(field.type==="multiline")return <label style={fieldStyle}>{label}<textarea style={{...input,minHeight:96}} value={answerText(value)} onChange={e=>onChange(e.target.value)}/></label>;
 if(field.type==="signature")return <div style={fieldStyle}>{label}
    <SignatureApprovalTray label={field.label.toLowerCase().includes("review")?"Supervisor review & sign":"Open signature tray"} value={isSignatureEvidence(value)?value:null} onChange={e=>onChange(e??"")}
     scope={scope+" / "+field.label} role={field.signerFieldId?"Reviewer":field.label.toLowerCase().includes("review")?"Reviewer":"Participant"}
     disabled={Boolean(field.signerFieldId&&!reviewerPersonId)}
     signerPersonId={field.signerFieldId?reviewerPersonId:undefined}
     defaultSignerName={field.signerFieldId?people.find(p=>p.id===reviewerPersonId)?.displayName??"":""}
     intent={field.signerFieldId?"review":field.label.toLowerCase().includes("review")?"review":"acknowledgement"}/>
     {field.signerFieldId&&!reviewerPersonId?<small style={{color:"#b45309"}}>Select the responsible reviewer before signing.</small>:null}
   </div>;
 if(field.type==="photo"||field.type==="document")return <div style={fieldStyle}>
   {label}
   <input type="file" accept={field.type==="photo"?"image/png,image/jpeg,image/webp":"application/pdf,image/png,image/jpeg,image/webp"} style={{...input,padding:9}} onChange={event=>{
     const file=event.target.files?.[0];
     if(!file)return;
     if(file.size>200000){window.alert("Choose a demo file under 200 KB. Uploaded evidence is local browser data only.");event.target.value="";return;}
     const types=field.type==="photo"?["image/png","image/jpeg","image/webp"]:["application/pdf","image/png","image/jpeg","image/webp"];
     if(!types.includes(file.type)){window.alert("Unsupported demo attachment type");return;}
     const reader=new FileReader();
     reader.onload=()=>{if(typeof reader.result==="string")onChange(reader.result);};
     reader.readAsDataURL(file);
   }}/>
   {typeof value==="string"&&value.startsWith("data:image/")?<img src={value} alt={"Local preview for "+field.label} style={{maxHeight:150,maxWidth:200,objectFit:"contain",borderRadius:9}}/>:null}
   {typeof value==="string"&&value.startsWith("data:application/pdf")?<span style={{fontSize:11,color:"#087f5b"}}>PDF attached in local demo</span>:null}
   <span style={{fontSize:11,color:"#b45309"}}>Small local-only sample attachment. Not uploaded, verified or shared.</span>
  </div>;
 return <label style={fieldStyle}>{label}<input type={field.type==="number"?"number":field.type==="date"?"date":field.type==="datetime"?"datetime-local":"text"} style={input} value={answerText(value)} onChange={e=>onChange(field.type==="number"?(e.target.value?Number(e.target.value):null):e.target.value)}/></label>;
}
