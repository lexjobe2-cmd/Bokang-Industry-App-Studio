"use client";
import {TaskWorkspace,useDesktopWorkspace} from "./TaskWorkspace";
import {focusedFieldPage} from "@bokang/domain-data/workspace-layout";
import {OperationalTextAssist} from "./OperationalTextAssist";
import {QuickChoice,SmartMultiSelect,SearchableAssetPicker} from "./SmartFormInputs";
import {RepeatableRowActions} from "./RepeatableRowActions";
import {moveRegisterRow,duplicateRegisterRow} from "@bokang/domain-data/repeatable-register";


import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ClipboardCheck, FileText, ShieldAlert, ChevronRight, ChevronLeft, Plus, Trash2, CheckCircle2, CloudOff } from "lucide-react";
import { defaultRiskMatrix, scoreRisk, type RiskAnswer } from "@bokang/domain-data/risk-matrix";
import { usePersistentState } from "@bokang/persistence";
import {MultiImageEvidence} from "./MultiImageEvidence";
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
import {fieldQuickChoices,personRegisterRow,reusableCrewAnswers} from "@bokang/domain-data/form-assist";
import {ACTIVE_PERSON_KEY} from "./UserParticipationAnalytics";
import {DocumentDownloadActions} from "./DocumentDownloadActions";
import {OrganizationPeopleComboBox} from "./OrganizationPeopleComboBox";
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

export function AssuranceFormsWorkspace({adminMode=false}:{adminMode?:boolean}={}){
 const reducedMotion=useReducedMotion();
 const desktop=useDesktopWorkspace();
 const [fieldAnchors,setFieldAnchors]=usePersistentState<Record<string,string>>("bokang-studio.move-track.form-field-anchors.v1",{});
 const [libraryPage,setLibraryPage]=useState(0);
 const [libraryCategory,setLibraryCategory]=useState("All");
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
 const [fastEntryOpen,setFastEntryOpen]=useState(true);
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
 const visibleFields=activeSection?.fields.filter(f=>isVisible(f,answers))??[];
 const anchorKey=(activeId??"")+":"+(activeSection?.id??"");
 const fieldPage=focusedFieldPage(visibleFields,fieldAnchors[anchorKey]??"",desktop);
 function focusField(id:string){setFieldAnchors(old=>({...old,[anchorKey]:id}));}
 const filteredLibrary=library.filter(t=>(libraryCategory==="All"||t.category===libraryCategory)&&(t.title+" "+("description" in t?t.description:"")).toLowerCase().includes(librarySearch.toLowerCase()));
 const pageSize=desktop?8:6,libraryPages=Math.max(1,Math.ceil(filteredLibrary.length/pageSize)),safeLibraryPage=Math.min(libraryPage,libraryPages-1);
 const libraryItems=filteredLibrary.slice(safeLibraryPage*pageSize,(safeLibraryPage+1)*pageSize);
 const records=useMemo(()=>submissions.filter(s=>{
   const snapshot=s.templateSnapshot as typeof s.templateSnapshot & {organizationId?:string};
   return (snapshot.organizationId===org.id||(!snapshot.organizationId&&org.id===demoOrganization.id))&&(!activeId||s.templateId===activeId);
 }),[submissions,activeId,org.id]);
 function openTemplate(id:string){setActiveId(id);setSectionIndex(0);setNotice("");setTab("library");}
 const priorRecords=template?submissions.filter(record=>record.templateId===template.id&&
  ((record.templateSnapshot as typeof record.templateSnapshot&{organizationId?:string}).organizationId===org.id
   ||(!("organizationId" in record.templateSnapshot)&&org.id===demoOrganization.id))):[];
 function reusePreviousCrew(){
  if(!template||!priorRecords.length)return;
  const selected=priorRecords.slice().sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt))[0]!;
  const updates=reusableCrewAnswers(template,selected.answers,new Set(visiblePeople.filter(p=>p.active).map(p=>p.id)));
  if(!Object.keys(updates).length){setNotice("No reusable directory participants were found in the previous record.");return;}
  const sigs=Object.values(answers).some(isSignatureEvidence);
  if(sigs&&!window.confirm("Reusing crew changes this checklist and clears any existing local signatures. Continue?"))return;
  setDrafts(old=>{const updated={...(old[template.id]??{})};for(const [key,v] of Object.entries(updated))if(isSignatureEvidence(v))delete updated[key];return {...old,[template.id]:{...updated,...updates}};});
  setNotice("Previous crew selections inserted. Inspect the current team and re-confirm all safety checks; no hazard ratings or approvals were copied.");
 }
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
  <div hidden={!!template||tab!=="library"} style={{...tile,background:"#0b1930",color:"#fff",border:0}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"start",flexWrap:"wrap"}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:9,fontSize:11,fontWeight:850,letterSpacing:1.5,textTransform:"uppercase",color:"#9cc6ff"}}><ClipboardCheck size={16}/> Operational Assurance / Forms</div>
        <h2 style={{margin:"8px 0 5px",fontSize:26}}>One library. Connected safety workflows.</h2>
        <p style={{margin:0,color:"#cbd5e1",fontSize:13,lineHeight:1.7,maxWidth:670}}>{org.name} · {additionalAssuranceRecipes.length} specialized safety workflows plus built-in and custom forms. Work is stored by company and job on this device.</p>
      </div>
      <span style={{border:"1px solid #5a7194",borderRadius:999,padding:"7px 12px",fontSize:11,fontWeight:900,color:"#fef08a"}}>DEMO · LOCAL ONLY</span>
    </div>
  </div>
  <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
    <button onClick={()=>{setTab("library");setActiveId(null);setNotice("");}} style={{...button,background:tab==="library"?"#172b4d":"#fff",color:tab==="library"?"#fff":"#344054"}}>Template library</button>
    <button onClick={()=>setTab("records")} style={{...button,background:tab==="records"?"#172b4d":"#fff",color:tab==="records"?"#fff":"#344054"}}>Submissions ({hydrated?submissions.length:"…" })</button>
    <button onClick={()=>{setTab("jra");setActiveId(null);}} style={{...button,background:tab==="jra"?"#172b4d":"#fff",color:tab==="jra"?"#fff":"#344054"}}>JRA job studio</button>
    {adminMode?<button onClick={()=>{setTab("designer");setActiveId(null);}} style={{...button,background:tab==="designer"?"#172b4d":"#fff",color:tab==="designer"?"#fff":"#344054"}}>Create custom form</button>:null}
  </div>
  {notice?<div role="status" style={{padding:13,borderRadius:12,background:"#eff6ff",color:"#1e40af",fontSize:13}}>{notice}</div>:null}
  {tab==="designer"?(adminMode?<CustomFormBuilder onPublish={openTemplate}/>:<div style={tile}>Company form templates are managed in Admin → Forms. <button type="button" style={button} onClick={()=>setTab("library")}>Return to the template library</button></div>):null}
  {tab==="jra"?<JraWorkspace/>:null}
  {tab==="library"&&!template?<section style={{display:"grid",gap:12}} aria-label="Template collection">
   <div style={{...tile,display:"flex",gap:10,flexWrap:"wrap",alignItems:"end"}}>
    <label style={{display:"grid",gap:6,flex:"1 1 250px",fontSize:12,fontWeight:800}}>Search company checklists<input aria-label="Search template library" style={input} value={librarySearch} onChange={e=>{setLibrarySearch(e.target.value);setLibraryPage(0);}} placeholder="Find an inspection, permit or briefing"/></label>
    <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Category<select style={input} value={libraryCategory} onChange={e=>{setLibraryCategory(e.target.value);setLibraryPage(0);}}>{["All",...Object.keys(categories)].map(c=><option key={c}>{c}</option>)}</select></label>
   </div>
   {desktop?<table className="movetrack-compact-table" aria-label="Desktop template library"><thead><tr><th>Template</th><th>Category</th><th>Revision</th><th>Structure</th><th>Open</th></tr></thead><tbody>{libraryItems.map(t=><tr key={t.id}><td><strong>{t.title}</strong></td><td>{t.category}</td><td>v{t.version}</td><td>{t.sections.length} sections · {t.sections.reduce((n,sec)=>n+sec.fields.length,0)} fields</td><td><button style={button} onClick={()=>openTemplate(t.id)} aria-label={"Open "+t.title}>Open</button></td></tr>)}</tbody></table>:<div style={{display:"grid",gap:10}}>{libraryItems.map(t=><button key={t.id} style={{...tile,textAlign:"left",display:"grid",gap:7,cursor:"pointer"}} onClick={()=>openTemplate(t.id)}><small>{t.category} · v{t.version}</small><strong>{t.title}</strong><span>{t.sections.length} sections · Start form →</span></button>)}</div>}
   {!libraryItems.length?<p>No matching templates.</p>:null}
   <div className="movetrack-step-footer"><button disabled={safeLibraryPage===0} onClick={()=>setLibraryPage(safeLibraryPage-1)}>Previous templates</button><span>Page {safeLibraryPage+1} of {libraryPages} · {filteredLibrary.length} templates</span><button disabled={safeLibraryPage>=libraryPages-1} onClick={()=>setLibraryPage(safeLibraryPage+1)}>Next templates</button></div>
  </section>:null}
  {tab==="library"&&template&&activeSection&&evaluation?<div style={{display:"grid",gap:13}}>
    <div style={{...tile,display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap",padding:12}}><div><small>{org.name} · v{template.version}</small><h3 style={{margin:"5px 0"}}>{template.title}</h3></div><strong>{evaluation.progress}% complete</strong><button style={button} onClick={()=>setActiveId(null)}>← All forms</button></div>
    <TaskWorkspace title="Complete form" steps={template.sections.map(sec=>sec.title)} current={sectionIndex} onChange={setSectionIndex}
      tools={<p style={{fontSize:11}}>Draft autosaves on this browser.</p>}
      summary={<><strong>Assessment: {evaluation.decision.replaceAll("_","-")}</strong><p>{evaluation.missing.length} required answers / evidence outstanding</p><strong>{org.name}</strong>
       <label>Operating site<select style={input} value={siteId} onChange={e=>setSiteId(e.target.value)}>{org.siteIds.map(site=><option key={site}>{site}</option>)}</select></label>
       <label>Submitted by<select aria-label="Submitted by (local team member)" style={input} value={visiblePeople.some(p=>p.id===actorPersonId)?actorPersonId:""} onChange={e=>setActorPersonId(e.target.value)}><option value="">Anonymous demo operator</option>{visiblePeople.map(p=><option value={p.id} key={p.id}>{p.displayName}</option>)}</select></label>
       <label>Job / work order ID<input style={input} value={jobReference} onChange={e=>setJobReference(e.target.value)}/></label>
       {template.category==="Fleet"?<SearchableAssetPicker assets={fleet} value={assetId} onChange={setAssetId}/>:null}
       <details><summary>Document exports</summary><p>Blank template</p><DocumentDownloadActions document={buildFormDocument({template,mode:"blank",company:org,people:visiblePeople,jobId:jobReference,site:siteId})} compact/><p>Current draft</p><DocumentDownloadActions document={buildFormDocument({template,mode:"draft",answers,company:org,people:visiblePeople,jobId:jobReference,site:siteId})} compact/></details>
       <button style={button} aria-pressed={fastEntryOpen} onClick={()=>setFastEntryOpen(v=>!v)}>{fastEntryOpen?"Hide":"Show"} quick answers</button>
       {priorRecords.length?<button style={button} onClick={reusePreviousCrew}>Reuse previous crew</button>:null}
       {workflow&&workflowLinks(workflow.id).length?<details><summary>Related workflows</summary>{workflowLinks(workflow.id).map(id=><button key={id} style={button} onClick={()=>openTemplate(recipeTemplateId(org.id,id))}>{additionalAssuranceRecipes.find(w=>w.id===id)?.title??id}</button>)}</details>:null}
      </>}>
    <AnimatePresence mode="wait">
      <motion.div key={activeSection.id} initial={reducedMotion?false:{opacity:0,y:7}} animate={{opacity:1,y:0}} exit={reducedMotion?undefined:{opacity:0,y:-7}} transition={easing} style={tile}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{background:"#eff6ff",color:"#1d4ed8",borderRadius:12,padding:10}}><FileText size={20}/></div><div><p style={{fontSize:11,color:"#667085",fontWeight:850,margin:0}}>SECTION {sectionIndex+1}</p><h3 style={{margin:"3px 0"}}>{activeSection.title}</h3></div></div>
        {activeSection.description?<p style={{color:"#667085"}}>{activeSection.description}</p>:null}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}><span style={{fontSize:12}}>{desktop?"Question group":"Question"} {fieldPage.page} of {fieldPage.pages}</span>{desktop?<select aria-label="Jump to question" value={visibleFields[fieldPage.index]?.id??""} onChange={e=>focusField(e.target.value)}>{visibleFields.map((f,i)=><option key={f.id} value={f.id}>{i+1}. {f.label}{evaluation.missing.some(id=>id===f.id||id.startsWith(f.id+":"))?" · Required answer missing":""}</option>)}</select>:null}</div>
        <div className={desktop?"movetrack-desktop-fields":"movetrack-mobile-fields"} style={{marginTop:16}}>
          {fieldPage.items.map(f=><div key={f.id} className={["repeat","multiline","signature","risk","people"].includes(f.type)?"movetrack-field-wide":""}><FieldInput field={f} people={visiblePeople} value={answers[f.id]} onChange={value=>setAnswer(f.id,value)} scope={signatureScopePrefix} fastEntry={fastEntryOpen} reviewerPersonId={f.signerFieldId&&typeof answers[f.signerFieldId]==="string"?answers[f.signerFieldId] as string:undefined}/></div>)}
        </div>
      </motion.div>
    </AnimatePresence>
    <div style={{...tile,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
      <button style={button} disabled={sectionIndex===0&&fieldPage.start===0} onClick={()=>fieldPage.start>0?focusField(fieldPage.previous):setSectionIndex(x=>Math.max(0,x-1))}>Previous</button>
      {fieldPage.next?<button style={button} onClick={()=>focusField(fieldPage.next)}>Next {desktop?"questions":"question"}</button>:sectionIndex<template.sections.length-1?<button style={{...button,background:"#172b4d",color:"#fff"}} onClick={()=>setSectionIndex(x=>Math.min(template.sections.length-1,x+1))}>Next section <ChevronRight size={16} style={{display:"inline"}}/></button>:<button style={{...button,background:"#172b4d",color:"#fff",opacity:evaluation.missing.length?0.65:1}} onClick={submit} disabled={!!evaluation.missing.length}>Submit demo form</button>}
    </div>
    </TaskWorkspace>
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

function FieldInput({field,value,onChange,people,scope,reviewerPersonId,fastEntry}:{field:FormField;value:FormAnswer|undefined;people:readonly PersonRecord[];onChange:(value:FormAnswer)=>void;scope:string;reviewerPersonId?:string;fastEntry:boolean}){
 const label=<span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,fontWeight:800}}>{field.label}{field.required?<span style={{color:"#b42318"}}>*</span>:null}{field.critical?<span style={{fontSize:10,color:"#b42318",background:"#fef2f2",padding:"3px 7px",borderRadius:7}}>CRITICAL</span>:null}</span>;
 const fieldStyle:React.CSSProperties={display:"grid",gap:8};
 const quickChoices=fastEntry&&!field.critical?fieldQuickChoices(field.label,field.type):[];
 const quickButtons=quickChoices.length?<div style={{display:"flex",flexWrap:"wrap",gap:6}} aria-label={"Suggested answers for "+field.label}>{quickChoices.map(choice=><button key={choice.value} type="button" aria-pressed={value===choice.value} style={{...button,minHeight:34,padding:"6px 10px",fontSize:11,borderColor:value===choice.value?"#2563eb":"#cbd5e1",background:value===choice.value?"#dbeafe":"#f8fafc"}} onClick={()=>onChange(choice.value)}>{choice.label}</button>)}</div>:null;
 if(field.type==="person"||field.type==="people"){
   const multiple=field.type==="people";
   const ids=multiple?(Array.isArray(value)?value as string[]:[]):typeof value==="string"&&value?[value]:[];
   return <div style={fieldStyle}><OrganizationPeopleComboBox people={people} orgId={people[0]?.orgId??""} value={ids}
    label={field.label} multiple={multiple} required={field.required} onChange={ids=>onChange(multiple?ids:ids[0]??"")}/>
    {field.critical?<small style={{color:"#b42318"}}>Critical control — site review still required.</small>:null}
   </div>;
 }
 if(field.type==="checkbox")return <label style={{...fieldStyle,display:"flex",alignItems:"center",gap:11,padding:"12px 13px",border:"1px solid #cbd5e1",borderRadius:11,background:value===true?"#eff6ff":"#fff"}}>
   <input type="checkbox" style={{width:21,height:21,accentColor:"#1d4ed8",flexShrink:0}} checked={value===true} onChange={e=>onChange(e.target.checked)} />
   {label}
  </label>;
 if(field.type==="radio")return <fieldset style={{...fieldStyle,border:"1px solid #e2e8f0",borderRadius:12,padding:11}}>
  <legend style={{padding:"0 7px"}}>{label}</legend>
  <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>{(field.options??["Option 1","Option 2"]).map(opt=><label key={opt} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 11px",borderRadius:9,background:value===opt?"#eff6ff":"#f8fafc",cursor:"pointer",fontSize:12}}>
    <input type="radio" name={field.id} checked={value===opt} onChange={()=>onChange(opt)} />{opt}
  </label>)}</div>
 </fieldset>;
 if(field.type==="pass_fail_na"||field.type==="yes_no"){
   const opts=field.type==="yes_no"?(field.options??["YES","NO"]):["PASS","FAIL","NA"];
   return <div style={fieldStyle}>{label}<QuickChoice options={opts} value={typeof value==="string"?value:""} onChange={onChange}/></div>;
 }
 if(field.type==="repeat"){
   const rows=Array.isArray(value)&&value.every(v=>typeof v==="object"&&!Array.isArray(v))?value as Record<string,string|number|boolean|null>[]:[];
   const hasIdentityColumns=field.children?.some(child=>/name|employee|attendee|role|participant|department/i.test(child.label))??false;
   return <div style={{...fieldStyle,background:"#f8fafc",padding:13,borderRadius:13,border:"1px solid #e2e8f0"}}>{label}{rows.map((row,index)=><div key={index} style={{...tile,display:"grid",gap:9}}>
     <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><strong style={{fontSize:12}}>Entry {index+1}</strong><RepeatableRowActions index={index} count={rows.length} onRemove={()=>onChange(rows.filter((_,i)=>i!==index))} onMove={direction=>onChange(moveRegisterRow(rows,index,direction))} onDuplicate={()=>onChange(duplicateRegisterRow(rows,index,(field.children??[]).filter(c=>c.critical||["pass_fail_na","yes_no","risk","signature","checkbox"].includes(c.type)).map(c=>c.id)))}/></div>
     {fastEntry&&hasIdentityColumns&&people.length?<label style={{...fieldStyle,fontSize:11,fontWeight:750,color:"#2563eb"}}>Fill attendee/worker details from directory
       <select aria-label={"Choose directory member for entry "+(index+1)} defaultValue="" style={input}
        onChange={e=>{const person=people.find(p=>p.id===e.target.value);if(!person)return;const data=personRegisterRow(field.children??[],person);onChange(rows.map((r,i)=>i===index?{...r,...data}:r));}}>
        <option value="">Choose a person — optional</option>{people.filter(p=>p.active).map(p=><option value={p.id} key={p.id}>{p.displayName} · {p.jobTitle}</option>)}
       </select>
      </label>:null}
     {field.children?.map(child=>{
      const update=(v:FormAnswer)=>{if(Array.isArray(v)||typeof v==="object"&&v!==null)return;onChange(rows.map((r,i)=>i===index?{...r,[child.id]:v}:r));};
      // Render real choice controls in repeated rows rather than flattening every column to text.
      return <FieldInput key={child.id} field={child} value={row[child.id]} onChange={update} people={people} scope={scope} fastEntry={fastEntry}/>;
     })}
   </div>)}<button type="button" style={{...button,justifySelf:"start"}} onClick={()=>onChange([...rows,{}])}><Plus size={15} style={{display:"inline"}}/> Add {/attend|people|register/i.test(field.label)?"attendee":"row"}</button></div>;
 }
 if(field.type==="multiselect"){
   const selected=Array.isArray(value)?value as string[]:[];
   return <div style={fieldStyle}>{label}<SmartMultiSelect options={field.options??[]} value={selected} onChange={onChange} label={field.label}/></div>;
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
     <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,170px),1fr))",gap:10}}>
      {select("likelihood",defaultRiskMatrix.likelihoodLabels)}
      {select("consequence",defaultRiskMatrix.consequenceLabels)}
     </div>
     <div style={{padding:12,borderRadius:10,background:result?.level==="EXTREME"?"#fef2f2":result?.level==="HIGH"?"#fff7ed":"#f8fafc",fontSize:12}}>
      <strong>{result?result.score+" / 25 · "+result.level:"Choose likelihood and consequence"}</strong>
      <div style={{color:result?.requiresApproval?"#b42318":"#667085"}}>{result?.requiresApproval?"High / extreme risk requires separately verified supervisor approval":"Standard 5 × 5 matrix · version "+defaultRiskMatrix.version}</div>
     </div>
    </div>;
 }
 if(field.type==="select")return <label style={fieldStyle}>{label}<select style={input} value={answerText(value)} onChange={e=>onChange(e.target.value)}><option value="">Select option</option>{(field.options??["Day shift","Night shift"]).map(opt=><option key={opt}>{opt}</option>)}</select>{quickButtons}</label>;
 if(field.type==="multiline")return <div style={{display:"grid",gap:8}}><label style={fieldStyle}>{label}{quickButtons}<textarea style={{...input,minHeight:96}} value={answerText(value)} onChange={e=>onChange(e.target.value)} placeholder="Choose a suggestion above or enter your own details"/></label><OperationalTextAssist value={answerText(value)}/></div>;
 if(field.type==="signature")return <div style={fieldStyle}>{label}
    <SignatureApprovalTray label={field.label.toLowerCase().includes("review")?"Supervisor review & sign":"Open signature tray"} value={isSignatureEvidence(value)?value:null} onChange={e=>onChange(e??"")}
     scope={scope+" / "+field.label} role={field.signerFieldId?"Reviewer":field.label.toLowerCase().includes("review")?"Reviewer":"Participant"}
     disabled={Boolean(field.signerFieldId&&!reviewerPersonId)}
     signerPersonId={field.signerFieldId?reviewerPersonId:undefined}
     defaultSignerName={field.signerFieldId?people.find(p=>p.id===reviewerPersonId)?.displayName??"":""}
     intent={field.signerFieldId?"review":field.label.toLowerCase().includes("review")?"review":"acknowledgement"}/>
     {field.signerFieldId&&!reviewerPersonId?<small style={{color:"#b45309"}}>Select the responsible reviewer before signing.</small>:null}
   </div>;
 if(field.type==="photo"){
   const photos=(Array.isArray(value)?value:typeof value==="string"?[value]:[])
     .filter((entry):entry is string=>typeof entry==="string"&&entry.startsWith("data:image/"));
   return <div style={fieldStyle}>{label}<MultiImageEvidence label={field.label+" photos"}
    images={photos.map((dataUrl,index)=>({id:String(index),name:"Photo "+(index+1),dataUrl,addedAt:""}))}
    onChange={images=>onChange(images.map(image=>image.dataUrl))}/>
   </div>;
 }
 if(field.type==="document")return <div style={fieldStyle}>
   {label}
   <input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" style={{...input,padding:9}} onChange={event=>{
     const file=event.target.files?.[0];
     if(!file)return;
     if(file.size>200000){window.alert("Choose a demo file under 200 KB. Uploaded evidence is local browser data only.");event.target.value="";return;}
     const types=["application/pdf","image/png","image/jpeg","image/webp"];
     if(!types.includes(file.type)){window.alert("Unsupported demo attachment type");return;}
     const reader=new FileReader();
     reader.onload=()=>{if(typeof reader.result==="string")onChange(reader.result);};
     reader.readAsDataURL(file);
   }}/>
   {typeof value==="string"&&value.startsWith("data:image/")?<img src={value} alt={"Local preview for "+field.label} style={{maxHeight:150,maxWidth:200,objectFit:"contain",borderRadius:9}}/>:null}
   {typeof value==="string"&&value.startsWith("data:application/pdf")?<span style={{fontSize:11,color:"#087f5b"}}>PDF attached in local demo</span>:null}
   <span style={{fontSize:11,color:"#b45309"}}>Small local-only sample attachment. Not uploaded, verified or shared.</span>
  </div>;
 return <label style={fieldStyle}>{label}{quickButtons}<input type={field.type==="number"?"number":field.type==="date"?"date":field.type==="datetime"?"datetime-local":"text"} style={input} value={answerText(value)} onChange={e=>onChange(field.type==="number"?(e.target.value?Number(e.target.value):null):e.target.value)}/></label>;
}
