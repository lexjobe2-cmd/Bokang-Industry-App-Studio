"use client";
import {usePersistentState} from "@bokang/persistence";
import {ASSURANCE_STORAGE,demoOrganization,demoPeople,type OrganizationProfile,type PersonRecord} from "@bokang/domain-data/custom-assurance";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
export function MoveTrackCompanySummary({onManage,onWorkforce}:{onManage:()=>void;onWorkforce:()=>void}){
 const [orgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [orgId,setOrgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [people]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const org=orgs.find(o=>o.id===orgId)??orgs[0]??demoOrganization;
 return <section aria-label="Active company" className="movetrack-company-summary" style={{background:"#fff",padding:18,border:"1px solid #c4d8ff",borderRadius:17,display:"grid",gap:12}}>
  <div><p style={{fontSize:11,color:"#2563eb",fontWeight:900,margin:"0 0 5px"}}>YOUR COMPANY WORKSPACE</p><h2 style={{margin:0,fontSize:21}}>{org.name}</h2><p style={{fontSize:12,color:"#64748b",margin:"6px 0 0"}}>{org.siteIds.length} sites · {people.filter(p=>p.orgId===org.id&&p.active).length} directory people{org.id===demoOrganization.id?" · Fictional demo company":""}</p></div>
  <label style={{display:"grid",gap:5,fontSize:12,fontWeight:800}}>Active company<select aria-label="Active organization" value={org.id} onChange={e=>setOrgId(e.target.value)} style={{width:"100%",minHeight:44,border:"1px solid #cbd5e1",padding:10,borderRadius:10,font:"inherit"}}>{orgs.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
  <div className="movetrack-step-nav" style={{margin:0}}><button type="button" onClick={onManage}>Set up / manage company</button><button type="button" onClick={onWorkforce}>Workforce directory</button></div>
 </section>;
}
