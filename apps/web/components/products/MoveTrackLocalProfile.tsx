"use client";
import {usePersistentState} from "@bokang/persistence";
import {ASSURANCE_STORAGE,demoOrganization,demoPeople,type OrganizationProfile,type PersonRecord} from "@bokang/domain-data/custom-assurance";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {OrganizationPeopleComboBox} from "./OrganizationPeopleComboBox";
import {ACTIVE_PERSON_KEY,UserParticipationAnalytics} from "./UserParticipationAnalytics";
export function MoveTrackLocalProfile(){
 const [organizations]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [orgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [people]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [personId,setPersonId]=usePersistentState(ACTIVE_PERSON_KEY,"");
 const org=organizations.find(p=>p.id===orgId)??organizations[0]??demoOrganization;
 const members=people.filter(p=>p.orgId===org.id),person=members.find(p=>p.id===personId);
 return <section aria-label="Local worker profile" style={{display:"grid",gap:16}}>
  <div style={{padding:20,border:"1px solid #dbe4ee",borderRadius:16,background:"#fff",display:"grid",gap:12}}>
   <h2 style={{margin:0}}>My profile & participation</h2><p style={{margin:0,fontSize:12,color:"#64748b"}}>{org.name} · Choose a directory person to view their locally recorded work. This selection does not authenticate you.</p>
   <OrganizationPeopleComboBox people={members} orgId={org.id} label="Local worker profile" value={person?[person.id]:[]} onChange={ids=>setPersonId(ids[0]??"")}/>
   {person?<dl style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14,margin:0}}>{[["Name",person.displayName],["Department",person.department],["Role",person.jobTitle],["Employee number",person.employeeNumber]].map(([label,value])=><div key={label}><dt style={{fontSize:11,color:"#64748b"}}>{label}</dt><dd style={{fontSize:14,fontWeight:800,margin:"5px 0 0"}}>{value||"Not recorded"}</dd></div>)}</dl>:null}
  </div>
  {person?<UserParticipationAnalytics/>:<p>Select a worker to see forms, meetings, apologies and assigned meeting actions.</p>}
 </section>;
}
