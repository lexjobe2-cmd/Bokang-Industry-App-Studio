"use client";
import {useState} from "react";
import {usePersistentState} from "@bokang/persistence";
import {ASSURANCE_STORAGE,demoOrganization,demoPeople,type OrganizationProfile,type PersonRecord} from "@bokang/domain-data/custom-assurance";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {CompanyDirectoryImport} from "./CompanyDirectoryImport";
import {DesktopModal} from "./DesktopModal";
import {createLocalWorker,editableWorkerDetails,updateWorkerDetails,type WorkerDetails} from "../../lib/workforce-profiles";

const input:React.CSSProperties={width:"100%",minHeight:44,padding:11,border:"1px solid #cbd5e1",borderRadius:10,font:"inherit",background:"#fff",boxSizing:"border-box"};
const btn:React.CSSProperties={minHeight:44,padding:"9px 13px",borderRadius:10,border:"1px solid #bed2eb",background:"#fff",fontSize:12,fontWeight:800,cursor:"pointer"};
const emptyDraft:WorkerDetails={displayName:"",email:"",department:"",jobTitle:"",location:"",employeeNumber:"",active:true};

export function WorkforceDirectoryWorkspace({adminMode=false}:{adminMode?:boolean}={}){
 const [orgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [orgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [people,setPeople]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [query,setQuery]=useState("");
 const [editingId,setEditingId]=useState<string|null>(null);
 const [draft,setDraft]=useState<WorkerDetails>(emptyDraft);
 const [error,setError]=useState("");
 const [message,setMessage]=useState("");
 const org=orgs.find(o=>o.id===orgId)??orgs[0]??demoOrganization;
 const matches=people.filter(p=>p.orgId===org.id&&[p.displayName,p.department,p.jobTitle,p.employeeNumber,p.email].join(" ").toLowerCase().includes(query.toLowerCase()));
 const open=editingId!==null;
 function startEdit(person:PersonRecord){
  setEditingId(person.id);setDraft(editableWorkerDetails(person));setError("");setMessage("");
 }
 function startCreate(){setEditingId("new");setDraft({...emptyDraft});setError("");setMessage("");}
 function close(){setEditingId(null);setError("");}
 function save(){
  if(!adminMode||!editingId)return;
  try{
   const updated=editingId==="new"?createLocalWorker(people,org.id,"PERSON-"+crypto.randomUUID(),draft):updateWorkerDetails(people,org.id,editingId,draft);
   setPeople(updated);
   setMessage((editingId==="new"?"Employee added":"Employee updated")+" in this browser. Original directory source and record IDs are retained.");
   close();
  }catch(e){setError(e instanceof Error?e.message:"Cannot save employee profile.");}
 }
 return <section aria-label="Workforce directory" style={{display:"grid",gap:14}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
   <div><h2 style={{margin:0}}>Workforce directory</h2><p style={{margin:"6px 0 0",fontSize:13}}>{org.name} · Stable person identities for forms, meetings and job teams.</p></div>
   {adminMode?<button type="button" style={{...btn,background:"#1d4ed8",color:"#fff"}} onClick={startCreate}>Add employee</button>:null}
  </div>
  {adminMode?<CompanyDirectoryImport org={org} people={people} setPeople={setPeople}/>:<p style={{fontSize:12,color:"#475569",margin:0}}>Directory changes are managed in Admin → Workforce. This is a searchable, local read-only roster.</p>}
  {adminMode?<p style={{fontSize:12,color:"#92400e",margin:0}}>Manual edits to imported directory profiles are local overlays. No Microsoft 365 connection or synchronization is performed. Do not enter sensitive personnel records in this public demonstration.</p>:null}
  <label style={{display:"grid",gap:6,fontSize:13,fontWeight:800}}>Find a worker<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Name, department or employee number" style={input}/></label>
  {message?<p role="status" style={{fontSize:12,color:"#047857",margin:0}}>{message}</p>:null}
  <p role="status" style={{fontSize:12,margin:0}}>{matches.length} matching people</p>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,240px),1fr))",gap:10}}>
   {matches.map(person=><article key={person.id} style={{padding:15,background:"#fff",border:"1px solid #dbe5ef",borderRadius:12,minWidth:0}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"flex-start",flexWrap:"wrap"}}>
     <strong>{person.displayName}</strong><span style={{fontSize:11,fontWeight:800,color:person.active?"#027a48":"#b42318"}}>{person.active?"Active":"Inactive"}</span>
    </div>
    <p style={{fontSize:12,margin:"6px 0"}}>{person.jobTitle} · {person.department}</p>
    <small>{person.employeeNumber||"No employee number"} · {person.location||"No work location"}</small>
    <p style={{fontSize:12,margin:"6px 0 0",overflowWrap:"anywhere"}}>{person.email||person.userPrincipalName||"No email"}</p>
    {adminMode?<button type="button" onClick={()=>startEdit(person)} style={{...btn,marginTop:12,width:"100%"}}>Edit employee profile</button>:null}
   </article>)}
  </div>
  {adminMode?<DesktopModal title={editingId==="new"?"Add employee":"Edit employee profile"} open={open} onClose={close}>
   <div style={{display:"grid",gap:12}}>
    <p style={{fontSize:12,color:"#64748b",margin:0}}>Changes stay on this browser. Editing a person's details does not overwrite their identity or prior meeting, JRA or form references.</p>
    {error?<p role="alert" style={{fontSize:12,color:"#b42318",margin:0}}>{error}</p>:null}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,200px),1fr))",gap:11}}>
     {([
      ["displayName","Full name"],["employeeNumber","Employee number"],["jobTitle","Job title"],
      ["department","Department"],["location","Work location"],["email","Work email"]
     ] as const).map(([key,label])=><label key={key} style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>{label}
      <input aria-label={label} type={key==="email"?"email":"text"} value={draft[key]??""} style={input} onChange={event=>setDraft(current=>({...current,[key]:event.target.value}))}/>
     </label>)}
    </div>
    <label style={{display:"flex",gap:10,alignItems:"center",fontSize:12,fontWeight:800}}><input type="checkbox" checked={draft.active} onChange={event=>setDraft(current=>({...current,active:event.target.checked}))}/>Active employee</label>
    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
     <button type="button" style={{...btn,background:"#1d4ed8",color:"#fff"}} onClick={save}>Save employee profile</button>
     <button type="button" style={btn} onClick={close}>Cancel</button>
    </div>
   </div>
  </DesktopModal>:null}
 </section>;
}
