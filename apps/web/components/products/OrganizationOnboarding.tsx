"use client";
import {useState} from "react";
import {motion,useReducedMotion} from "framer-motion";
import {Building2,ChevronRight,Users,Palette,CheckCircle2,Plus,Trash2,Shield,ArrowRight,Edit3} from "lucide-react";
import {usePersistentState} from "@bokang/persistence";
import {ASSURANCE_STORAGE,demoOrganization,demoPeople,type OrganizationProfile,type PersonRecord} from "@bokang/domain-data/custom-assurance";

export const ACTIVE_ORGANIZATION_KEY="bokang-studio.move-track.active-organization.v1";
const input:React.CSSProperties={width:"100%",minHeight:44,border:"1px solid #cbd5e1",borderRadius:10,padding:"10px 12px",font:"inherit",background:"#fff",color:"#102033"};
const button:React.CSSProperties={border:"1px solid #cbd5e1",background:"#fff",minHeight:44,padding:"10px 15px",borderRadius:10,fontWeight:780,color:"#183454",cursor:"pointer"};
const primary:React.CSSProperties={...button,border:0,color:"#fff",background:"#174fa8"};
const card:React.CSSProperties={background:"#fff",border:"1px solid #dae4f0",borderRadius:16,padding:17};
const label:React.CSSProperties={display:"grid",gap:6,fontSize:12,fontWeight:800,color:"#344054"};
type Draft=OrganizationProfile & {industry:string};
const initial=():Draft=>({...demoOrganization,id:"",name:"",domain:"",businessUnit:"",siteIds:[],ownerIds:[],logoDataUrl:undefined,logoName:undefined,documentPrefix:"SHE",footer:"Uncontrolled when printed · Operational approval required",accent:"#155eef",source:"MANUAL" as const,industry:"Mining & resources",updatedAt:""});
type PersonDraft={name:string;jobTitle:string;email:string;department:string;owner:boolean};
const emptyMember=():PersonDraft=>({name:"",jobTitle:"",department:"",email:"",owner:false});
export function OrganizationOnboarding(){
 const reduceMotion=useReducedMotion();
 const [orgs,setOrgs,loaded]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [people,setPeople]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [activeOrg,setActiveOrg]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [draft,setDraft]=usePersistentState<Draft>("bokang-studio.move-track.onboarding-draft.v1",initial());
 const [members,setMembers]=usePersistentState<PersonDraft[]>("bokang-studio.move-track.onboarding-members.v1",[emptyMember()]);
 const [step,setStep]=usePersistentState("bokang-studio.move-track.onboarding-step.v1",0);
 const [open,setOpen]=useState(false);
 const [editingId,setEditingId]=useState<string|null>(null);
 const [notice,setNotice]=useState("");
 const currentOrg=orgs.find(x=>x.id===activeOrg)??orgs[0]??demoOrganization;
 const customOrgs=orgs.filter(o=>o.id!==demoOrganization.id);
 const isFirst=!customOrgs.length;
 function patch(data:Partial<Draft>){setDraft(d=>({...d,...data}));}
 function resetDraft(){setDraft(initial());setMembers([emptyMember()]);setStep(0);setEditingId(null);setNotice("");setOpen(true);}
 function editCompany(org:OrganizationProfile){
  const related=people.filter(p=>p.orgId===org.id);
  setDraft({...initial(),...org});setMembers(related.map(p=>({name:p.displayName,jobTitle:p.jobTitle,email:p.email,department:p.department,owner:org.ownerIds.includes(p.id)})));
  setStep(0);setEditingId(org.id);setOpen(true);setNotice("");
 }
 function upload(file:File|undefined){
  if(!file)return;
  if(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>200000){setNotice("Logo must be PNG/JPEG/WebP under 200 KB for offline storage.");return;}
  const reader=new FileReader();
  reader.onload=()=>{if(typeof reader.result==="string")patch({logoDataUrl:reader.result,logoName:file.name});};
  reader.onerror=()=>setNotice("The logo could not be read");
  reader.readAsDataURL(file);
 }
 function next(){
  if(step===0&&draft.name.trim().length<3){setNotice("Enter a company name (at least 3 characters).");return;}
  if(step===0&&draft.siteIds.length===0){setNotice("Add at least one site or work location.");return;}
  if(step===2&&members.some(x=>(x.name||x.jobTitle||x.email)&&(!x.name.trim()||!x.jobTitle.trim()))){setNotice("Every listed team member needs a name and job title. Empty rows are fine.");return;}
  setNotice("");setStep(v=>Math.min(3,v+1));
 }
 function save(){
  if(draft.name.trim().length<3||!draft.siteIds.length){setNotice("Company name and site are required.");setStep(0);return;}
  const now=new Date().toISOString();
  const id=editingId??"org-"+crypto.randomUUID();
  const priorOrg=orgs.find(o=>o.id===id);
  const existingMembers=people.filter(p=>p.orgId===id);
  const valid=members.filter(m=>m.name.trim()&&m.jobTitle.trim());
  const roster=valid.map((m,i):PersonRecord=>{
   const old=existingMembers.find(p=>p.displayName===m.name.trim()&&p.jobTitle===m.jobTitle.trim())??existingMembers[i];
   return {id:old?.id??"worker-"+crypto.randomUUID(),orgId:id,source:"MANUAL",displayName:m.name.trim(),
    jobTitle:m.jobTitle.trim(),department:m.department.trim(),location:draft.siteIds[0]||"",email:m.email.trim(),active:true};
  });
  const ownerIds=roster.filter((_,i)=>valid[i]?.owner).map(p=>p.id);
  const org:OrganizationProfile={...draft,id,name:draft.name.trim(),domain:draft.domain.trim().toLowerCase(),
   siteIds:[...new Set(draft.siteIds.map(s=>s.trim()).filter(Boolean))],
   ownerIds,updatedAt:now,source:"MANUAL"};
  setOrgs(xs=>[...xs.filter(o=>o.id!==id),org]);
  setPeople(xs=>[...xs.filter(p=>p.orgId!==id),...roster]);
  setActiveOrg(id);setEditingId(null);setOpen(false);setStep(0);setNotice(priorOrg?"Company updated locally.":"Company created locally. Your operational workspaces now use its branding and personnel.");
 }
 return <section aria-label="Company onboarding" style={{display:"grid",gap:11}}>
  <div style={{...card,background:"linear-gradient(110deg,#fff,#eaf2ff)",borderColor:"#c4d8ff",display:"flex",justifyContent:"space-between",gap:13,alignItems:"center",flexWrap:"wrap"}}>
   <div style={{display:"flex",gap:12,alignItems:"center"}}>
    {currentOrg.logoDataUrl?<img src={currentOrg.logoDataUrl} alt={currentOrg.name+" logo"} style={{width:62,height:58,objectFit:"contain"}}/>:<div style={{width:53,height:53,borderRadius:14,background:"#dbeafe",display:"grid",placeItems:"center"}}><Building2 size={24} color="#174fa8"/></div>}
    <div><p style={{fontSize:10,fontWeight:900,letterSpacing:1.2,color:"#2563eb",margin:"0 0 4px"}}>STEP 01 · YOUR ORGANIZATION</p><h2 style={{fontSize:20,margin:0}}>Set up your company workspace</h2><p style={{fontSize:12,color:"#64748b",margin:"6px 0 0"}}>Company profile, logos, work sites, owners and staff feed into your live SHE checklists.</p></div>
   </div>
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    <button style={primary} onClick={resetDraft}><Plus size={15} style={{display:"inline",verticalAlign:"middle"}}/> Add company</button>
    <button style={button} onClick={()=>editCompany(currentOrg)}><Edit3 size={15} style={{display:"inline",verticalAlign:"middle"}}/> Edit active</button>
   </div>
  </div>
  <div style={{...card,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
   <strong style={{fontSize:12}}>Working as</strong>
   <select aria-label="Active organization" value={activeOrg} onChange={e=>{setActiveOrg(e.target.value);setNotice("Organization switched for future work.");}} style={{...input,flex:"1 1 220px",maxWidth:370}}>{orgs.map(o=><option value={o.id} key={o.id}>{o.name}{o.id===demoOrganization.id?" (demo)":""}</option>)}</select>
   <span style={{fontSize:11,color:"#64748b"}}>{customOrgs.length} locally onboarded · {people.filter(p=>p.orgId===activeOrg).length} people</span>
   {isFirst?<button style={{...button,border:"1px solid #bfdbfe",background:"#eff6ff"}} onClick={resetDraft}>New? Start 4-step onboarding →</button>:null}
  </div>
  {notice?<div role="status" style={{...card,color:"#174fa8",fontSize:12,background:"#eff6ff"}}>{notice}</div>:null}
  {open?<motion.div initial={reduceMotion?false:{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{...card,display:"grid",gap:15,borderTop:"4px solid "+draft.accent}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:9,flexWrap:"wrap"}}>
     <div><strong style={{fontSize:18}}>{editingId?"Edit company":"Company onboarding"}</strong><p style={{fontSize:11,color:"#64748b",margin:"3px 0"}}>Autosaved draft · no login or external network connection</p></div>
     <button style={button} onClick={()=>setOpen(false)}>Close</button>
    </div>
    <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
     {["Company","Branding","People & owners","Review"].map((name,i)=><button key={name} style={{...button,fontSize:11,minHeight:36,padding:"7px 12px",background:step===i?"#174fa8":"#f8fafc",color:step===i?"#fff":"#475569"}} onClick={()=>setStep(i)}>{i+1}. {name}</button>)}
    </div>
    {step===0?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:12}}>
     <label style={label}>Company legal/trading name *<input style={input} value={draft.name} onChange={e=>patch({name:e.target.value})} placeholder="Kalahari Mining Services"/></label>
     <label style={label}>Verified domain (manual demo)<input style={input} value={draft.domain} onChange={e=>patch({domain:e.target.value})} placeholder="company.co.bw"/></label>
     <label style={label}>Industry<select style={input} value={draft.industry} onChange={e=>patch({industry:e.target.value})}>{["Mining & resources","Construction","Logistics & fleet","Manufacturing","Energy & utilities","Agriculture","Healthcare","Facilities","Government","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
     <label style={label}>Business unit<input style={input} value={draft.businessUnit} onChange={e=>patch({businessUnit:e.target.value})} placeholder="Maintenance & operations"/></label>
     <label style={{...label,gridColumn:"1 / -1"}}>Operating sites * (one per line)<textarea style={{...input,minHeight:95}} value={draft.siteIds.join("\n")} onChange={e=>patch({siteIds:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)})} placeholder="Jwaneng Site\nGaborone Workshop"/></label>
    </div>:null}
    {step===1?<div style={{display:"grid",gap:13}}>
     <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(195px,1fr))",gap:12}}>
      <label style={label}>Document prefix<input style={input} value={draft.documentPrefix} onChange={e=>patch({documentPrefix:e.target.value})} placeholder="ORG-SHE"/></label>
      <label style={label}>Brand accent<input type="color" style={{...input,padding:6}} value={draft.accent} onChange={e=>patch({accent:e.target.value})}/></label>
      <label style={label}>Company logo (200 KB limit)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>upload(e.target.files?.[0])}/></label>
      <label style={label}>Controlled-document footer<input style={input} value={draft.footer} onChange={e=>patch({footer:e.target.value})}/></label>
     </div>
     <div style={{...card,borderTop:"5px solid "+draft.accent,display:"flex",alignItems:"center",gap:12}}>
      {draft.logoDataUrl?<img src={draft.logoDataUrl} alt="Company logo preview" style={{width:78,height:62,objectFit:"contain"}}/>:<Building2 size={35} color={draft.accent}/>}
      <div><strong>{draft.name||"Your company"}</strong><p style={{fontSize:11,color:"#64748b",margin:"5px 0"}}>{draft.documentPrefix} · Controlled safety form preview</p></div>
     </div>
    </div>:null}
    {step===2?<div style={{display:"grid",gap:10}}>
     <div><strong style={{fontSize:15}}>People and organization owners</strong><p style={{fontSize:12,color:"#64748b"}}>Add supervisors, operators, contractors and company owners. These demo records are local; Microsoft 365 access comes later.</p></div>
     {members.map((person,i)=><div key={i} style={{...card,background:"#f8fafc",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:9}}>
       <label style={label}>Person name<input style={input} value={person.name} placeholder="Full name" onChange={e=>setMembers(xs=>xs.map((p,j)=>i===j?{...p,name:e.target.value}:p))}/></label>
       <label style={label}>Job title<input style={input} value={person.jobTitle} placeholder="Supervisor" onChange={e=>setMembers(xs=>xs.map((p,j)=>i===j?{...p,jobTitle:e.target.value}:p))}/></label>
       <label style={label}>Department<input style={input} value={person.department} placeholder="Engineering" onChange={e=>setMembers(xs=>xs.map((p,j)=>i===j?{...p,department:e.target.value}:p))}/></label>
       <label style={label}>Email<input style={input} value={person.email} placeholder="person@company.co.bw" onChange={e=>setMembers(xs=>xs.map((p,j)=>i===j?{...p,email:e.target.value}:p))}/></label>
       <label style={{fontSize:12,display:"flex",alignItems:"center",gap:7}}><input type="checkbox" checked={person.owner} onChange={e=>setMembers(xs=>xs.map((p,j)=>i===j?{...p,owner:e.target.checked}:p))}/> Organization owner (demo)</label>
       <button style={{...button,justifySelf:"start",color:"#b42318"}} onClick={()=>setMembers(xs=>xs.filter((_,j)=>i!==j))}><Trash2 size={15} style={{display:"inline"}}/> Remove</button>
      </div>)}
      <button style={{...button,justifySelf:"start"}} onClick={()=>setMembers(xs=>[...xs,emptyMember()])}><Plus size={16} style={{display:"inline"}}/> Add person</button>
    </div>:null}
    {step===3?<div style={{display:"grid",gap:9}}>
     <strong>Review and create your company</strong>
     <div style={{...card,background:"#f8fafc"}}>
      <div style={{display:"flex",gap:10,alignItems:"center"}}><Shield color={draft.accent}/><strong>{draft.name||"Missing company name"}</strong></div>
      <p style={{fontSize:12,color:"#64748b"}}>{draft.industry} · {draft.businessUnit||"Business unit not specified"} · {draft.domain||"No domain"}</p>
      <p style={{fontSize:12}}>Sites: {draft.siteIds.join(", ")||"No site added"}</p>
      <p style={{fontSize:12}}>{members.filter(x=>x.name.trim()&&x.jobTitle.trim()).length} employees · {members.filter(x=>x.owner&&x.name.trim()).length} owners · {draft.logoDataUrl?"Logo ready":"No logo uploaded"}</p>
      <p style={{fontSize:11,color:"#b45309"}}>This local onboarding does not authenticate your organization or verify company ownership.</p>
     </div>
    </div>:null}
    <div style={{display:"flex",justifyContent:"space-between",gap:9,flexWrap:"wrap"}}>
     <button style={button} disabled={step===0} onClick={()=>setStep(v=>Math.max(0,v-1))}>← Back</button>
     {step<3?<button style={primary} onClick={next}>Continue <ChevronRight size={16} style={{display:"inline",verticalAlign:"middle"}}/></button>:
      <button style={primary} onClick={save}><CheckCircle2 size={16} style={{display:"inline",verticalAlign:"middle"}}/> Save company locally</button>}
    </div>
  </motion.div>:null}
  {!open&&isFirst?<p style={{fontSize:11,color:"#b45309",margin:"0 2px"}}>You're using a fictional demo company. Create your own local company above to test branded forms and company-specific workers.</p>:null}
 </section>;
}
