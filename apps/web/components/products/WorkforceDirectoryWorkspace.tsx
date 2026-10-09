"use client";
import {useState} from "react";
import {usePersistentState} from "@bokang/persistence";
import {ASSURANCE_STORAGE,demoOrganization,demoPeople,type OrganizationProfile,type PersonRecord} from "@bokang/domain-data/custom-assurance";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {CompanyDirectoryImport} from "./CompanyDirectoryImport";
export function WorkforceDirectoryWorkspace(){
 const [orgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [orgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [people,setPeople]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [query,setQuery]=useState("");const org=orgs.find(o=>o.id===orgId)??orgs[0]??demoOrganization;
 const matches=people.filter(p=>p.orgId===org.id&&[p.displayName,p.department,p.jobTitle,p.employeeNumber,p.email].join(" ").toLowerCase().includes(query.toLowerCase()));
 return <section aria-label="Workforce directory" style={{display:"grid",gap:14}}><h2 style={{margin:0}}>Workforce directory</h2><p style={{margin:0,fontSize:13}}>{org.name} · Stable person identities for forms, meetings and job teams.</p><CompanyDirectoryImport org={org} people={people} setPeople={setPeople}/><label style={{display:"grid",gap:6,fontSize:13,fontWeight:800}}>Find a worker<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Name, department or employee number" style={{width:"100%",minHeight:44,padding:11,border:"1px solid #cbd5e1",borderRadius:10,font:"inherit"}}/></label><p role="status" style={{fontSize:12,margin:0}}>{matches.length} matching people</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,240px),1fr))",gap:10}}>{matches.map(p=><article key={p.id} style={{padding:15,background:"#fff",border:"1px solid #dbe5ef",borderRadius:12}}><strong>{p.displayName}</strong><p style={{fontSize:12,margin:"6px 0"}}>{p.jobTitle} · {p.department}</p><small>{p.employeeNumber||"No employee number"} · {p.active?"Active":"Inactive"}</small><p style={{fontSize:12,margin:"6px 0 0",overflowWrap:"anywhere"}}>{p.email||p.userPrincipalName}</p></article>)}</div></section>;
}
