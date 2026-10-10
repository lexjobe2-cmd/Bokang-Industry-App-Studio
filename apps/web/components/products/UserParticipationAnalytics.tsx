"use client";
import {useMemo,useState} from "react";
import {BarChart3,Users,ClipboardCheck,ShieldAlert,Download,UserRound,Search,Clock3,FileCheck2} from "lucide-react";
import {usePersistentState} from "@bokang/persistence";
import {buildMeetingAnalytics} from "@bokang/domain-data/meeting-register";
import {buildAssuranceAnalytics,type ParticipationItem} from "@bokang/domain-data/participation-analytics";
import {ASSURANCE_STORAGE,demoPeople,demoOrganization,type JobRiskAssessment,type PersonRecord,type OrganizationProfile} from "@bokang/domain-data/custom-assurance";
import type {FormSubmission} from "@bokang/domain-data/assurance-forms";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {buildFormDocument,buildJraDocument} from "../../lib/form-exports";
import {DocumentDownloadActions} from "./DocumentDownloadActions";
export const ACTIVE_PERSON_KEY="bokang-studio.move-track.active-person.v1";
const card:React.CSSProperties={background:"var(--mt-surface,#fff)",border:"1px solid #d8e3ef",borderRadius:16,padding:16};
const small:React.CSSProperties={fontSize:11,color:"var(--mt-muted,#64748b)"};
const input:React.CSSProperties={padding:"10px 12px",borderRadius:10,border:"1px solid #cbd5e1",background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#153452)",minHeight:44,font:"inherit",width:"100%"};
const label:React.CSSProperties={fontSize:12,fontWeight:800,display:"grid",gap:5};
const statusColor=(status:string)=>status==="NO_GO"?"#b42318":status==="REVIEW"||status==="REVIEW_REQUIRED"||status==="IN_REVIEW"?"#b45309":status==="DRAFT"?"#64748b":"#047857";
function CountTile({name,value,detail}:{name:string;value:string|number;detail?:string}){return <div style={card}><p style={{...small,margin:"0 0 8px",fontWeight:850}}>{name}</p><strong style={{fontSize:27}}>{value}</strong>{detail?<p style={{...small,margin:"5px 0 0"}}>{detail}</p>:null}</div>}
function Breakdown({title,items}:{title:string;items:{name:string;count:number}[]}){
 const max=Math.max(1,...items.map(x=>x.count));
 return <div style={card}><strong style={{fontSize:15}}>{title}</strong>
  {!items.length?<p style={{...small}}>No recorded activity.</p>:<div style={{display:"grid",gap:10,marginTop:14}}>
   {items.slice(0,12).map(item=><div key={item.name} style={{display:"grid",gridTemplateColumns:"minmax(min(100%,100px),1fr) 2fr 20px",gap:9,alignItems:"center",fontSize:11}}>
    <span style={{overflowWrap:"anywhere",color:"var(--mt-muted,#475569)"}}>{item.name}</span>
    <div style={{height:9,borderRadius:8,overflow:"hidden",background:"var(--mt-surface-soft,#edf2f8)"}}><div style={{width:(item.count/max*100)+"%",height:"100%",borderRadius:8,background:"#2563eb"}}/></div>
    <strong>{item.count}</strong>
   </div>)}
  </div>}
 </div>;
}
export function UserParticipationAnalytics(){
 const [orgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [activeOrg]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [people]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [forms]=usePersistentState<FormSubmission[]>("bokang-studio.move-track.assurance-submissions.v1",[]);
 const [jras]=usePersistentState<JobRiskAssessment[]>(ASSURANCE_STORAGE.jras,[]);
 const [person,setPerson]=usePersistentState(ACTIVE_PERSON_KEY,"");
 const [pane,setPane]=useState<"overview"|"meetings"|"records">("overview");
 const [view,setView]=useState<"mine"|"company">("mine");
 const [meetingSite,setMeetingSite]=useState("");
 const [meetingMonth,setMeetingMonth]=useState("");
 const [status,setStatus]=useState("All statuses");
 const [search,setSearch]=useState("");
 const [category,setCategory]=useState("All categories");
 const org=orgs.find(o=>o.id===activeOrg)??orgs[0]??demoOrganization;
 const workers=people.filter(p=>p.orgId===org.id&&p.active);
 const user=workers.find(p=>p.id===person);
 const scope=view==="mine"&&user?user.id:undefined;
 const a=useMemo(()=>buildAssuranceAnalytics({orgId:org.id,people,forms,jras,personId:scope}),[org.id,people,forms,jras,scope]);
 const meetings=useMemo(()=>buildMeetingAnalytics({forms,people,orgId:org.id,personId:scope,site:meetingSite,month:meetingMonth}),[forms,people,org.id,scope,meetingSite,meetingMonth]);
 const filtered=a.items.filter(item=>(status==="All statuses"||item.status===status)&&(category==="All categories"||item.category===category)&&
  (item.title+" "+item.site+" "+item.jobId).toLowerCase().includes(search.trim().toLowerCase()));
 const recentMonths=a.months.slice(-8);
 function exportSummary(){
  const rows=[["Item","Type","Category","Site","Job","Status","Date","Participants"],...filtered.map(item=>[item.title,item.kind,item.category,item.site,item.jobId,item.status,item.date,item.personIds.map(id=>people.find(p=>p.id===id)?.displayName??id).join("; ")])];
  const content="\uFEFF"+rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""').replace(/^([=+@-])/,"'$1")+'"').join(",")).join("\r\n");
  const blob=new Blob([content],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="movetrack-participation-"+org.id+".csv";document.body.appendChild(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function documentFor(item:ParticipationItem){
  if(item.kind==="JRA"){
   const j=jras.find(r=>r.id===item.id);return j?buildJraDocument(j,people):null;
  }
  const f=forms.find(r=>r.id===item.id);
  return f?buildFormDocument({template:f.templateSnapshot,mode:"filled",submission:f,company:org,people}):null;
 }
 return <section aria-label="Forms participation analytics" style={{display:"grid",gap:13}}>
  <div style={{...card,background:"#102541",color:"#fff",border:0,padding:21}}>
   <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap",alignItems:"start"}}>
    <div><div style={{fontSize:11,color:"var(--mt-link,#9ac5ff)",fontWeight:900,letterSpacing:1.2}}>WORKFORCE · SAFETY PARTICIPATION INTELLIGENCE</div>
     <h2 style={{fontSize:25,margin:"6px 0"}}>Forms you joined. Risks your team recorded.</h2>
     <p style={{color:"#cbd5e1",fontSize:12,margin:0,lineHeight:1.6}}>Personal participation histories and company patterns on this browser, using actual locally saved forms and JRA team rosters. No invented activity.</p>
    </div><BarChart3 size={29} color="#bfdbfe"/></div>
  </div>
  <div style={{...card,display:"grid",gap:10}}>
   <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
    <strong>{org.name}</strong><span style={{...small}}>· {workers.length} active local directory people</span>
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,200px),1fr))",gap:10}}>
    <label style={label}>View activity<select style={input} value={view} onChange={e=>setView(e.target.value as "mine"|"company")}>
      <option value="mine">My participation</option><option value="company">Company overview</option>
    </select></label>
    <label style={label}>My identity (local demo; not verified)
      <select style={input} value={workers.some(p=>p.id===person)?person:""} onChange={e=>setPerson(e.target.value)}>
       <option value="">Choose your person record</option>{workers.map(p=><option key={p.id} value={p.id}>{p.displayName} · {p.jobTitle}</option>)}
      </select>
    </label>
   </div>
   {view==="mine"&&!user?<p style={{fontSize:12,color:"var(--mt-warning,#b45309)",margin:0}}>Choose an employee above to see exactly which forms and JRAs include them. Until then, the company overview is shown.</p>:null}
   {view==="mine"&&user?<p style={{fontSize:12,color:"var(--mt-success,#047857)",margin:0}}><UserRound size={15} style={{display:"inline",verticalAlign:"middle"}}/> Viewing participation for {user.displayName}. Attribution is based on stable person IDs, not fabricated completion claims.</p>:null}
  </div>
  <nav className="movetrack-step-nav" aria-label="Analytics pages">{(["overview","meetings","records"] as const).map(key=><button type="button" key={key} aria-current={pane===key?"step":undefined} onClick={()=>setPane(key)}>{key==="overview"?"Overview":key==="meetings"?"Meeting attendance":"Records & exports"}</button>)}</nav>
  <div hidden={pane!=="meetings"} style={{...card,display:"grid",gap:12}}>
   <strong>Meeting attendance & follow-ups</strong>
   <p style={small}>This browser's recorded invitations: present ÷ (present + absent). Late arrivals and early departures count as attending. Apologies are separate. Missing invitations cannot be inferred.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,190px),1fr))",gap:9}}>
    <label style={label}>Meeting site<select style={input} value={meetingSite} onChange={e=>setMeetingSite(e.target.value)}><option value="">All sites</option>{[...new Set(forms.filter(f=>(f.templateSnapshot as {organizationId?:string}).organizationId===org.id&&f.templateSnapshot.category==="Meetings").map(f=>f.siteId))].map(v=><option key={v}>{v}</option>)}</select></label>
    <label style={label}>Meeting month<input type="month" style={input} value={meetingMonth} onChange={e=>setMeetingMonth(e.target.value)}/></label>
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,145px),1fr))",gap:9}}>
    <CountTile name={scope?"Meetings attended":"Meetings held"} value={meetings.attended}/>
    <CountTile name="Attendance rate" value={meetings.attendanceRate===null?"—":meetings.attendanceRate+"%"}/>
    <CountTile name="Apologies received" value={meetings.apologies}/>
    <CountTile name="Outstanding actions" value={meetings.open}/>
    <CountTile name="Overdue actions" value={meetings.overdue}/>
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,220px),1fr))",gap:10}}>
    <Breakdown title="Attendance by department" items={meetings.departments}/>
    <Breakdown title="Meeting completion by month" items={meetings.months}/>
    <Breakdown title="Frequent attendees" items={meetings.topPeople.map(p=>({name:p.name,count:p.count}))}/>
   </div>
  </div>
  <div hidden={pane!=="overview"} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,145px),1fr))",gap:10}}>
   <CountTile name={scope?"My recorded involvement":"Company records"} value={a.total} detail="Distinct forms and JRAs"/>
   <CountTile name="Checklist submissions" value={a.forms} detail="Submitted records"/>
   <CountTile name="Risk assessments" value={a.jras} detail="Locally saved JRAs"/>
   <CountTile name="Complete / demo reviewed" value={a.completed}/>
   <CountTile name="Review required" value={a.reviewNeeded}/>
   <CountTile name="NO-GO reports" value={a.noGo} detail="Critical failure checks"/>
   <CountTile name="Saved JRA drafts" value={a.drafts}/>
   <CountTile name="People involved" value={a.peopleInvolved}/>
  </div>
  <div hidden={pane!=="overview"} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,260px),1fr))",gap:11}}>
   <Breakdown title="Activity by form category" items={a.categories}/>
   <Breakdown title="Activity by operating site" items={a.sites}/>
   <Breakdown title={scope?"My involvement roles":"Recorded team roles"} items={a.roles.map(r=>({name:r.role,count:r.count}))}/>
   <Breakdown title="Monthly participation trend" items={recentMonths}/>
   {!scope?<Breakdown title="Most frequently involved workers" items={a.topPeople.map(x=>({name:x.name,count:x.count}))}/>:null}
  </div>
  <div hidden={pane!=="records"} style={card}>
   <div style={{display:"flex",justifyContent:"space-between",gap:9,flexWrap:"wrap",alignItems:"center"}}>
    <div><h3 style={{margin:0,fontSize:18}}>Participation and forms register</h3><p style={{...small}}>Filter your records, export a register, or download any completed document.</p></div>
    <button style={{border:0,borderRadius:9,padding:"10px 13px",background:"#173764",color:"#fff",fontWeight:800,cursor:"pointer",display:"flex",gap:6,alignItems:"center"}} onClick={exportSummary}><Download size={16}/> Export register CSV</button>
   </div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,175px),1fr))",gap:9,margin:"12px 0"}}>
    <label style={label}>Find forms<input style={input} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search job, document or site"/></label>
    <label style={label}>Status<select style={input} value={status} onChange={e=>setStatus(e.target.value)}><option>All statuses</option>{[...new Set(a.items.map(x=>x.status))].map(x=><option key={x}>{x}</option>)}</select></label>
    <label style={label}>Category<select style={input} value={category} onChange={e=>setCategory(e.target.value)}><option>All categories</option>{[...new Set(a.items.map(x=>x.category))].map(x=><option key={x}>{x}</option>)}</select></label>
   </div>
   <div style={{display:"grid",gap:9}}>
    {!filtered.length?<div style={{padding:16,background:"var(--mt-surface-soft,#f8fafc)",borderRadius:12,color:"var(--mt-muted,#64748b)",fontSize:13}}>No records match these filters. Create a checklist or join a JRA to populate this view.</div>:filtered.map(item=>{
      const doc=documentFor(item);
      return <article key={item.kind+":"+item.id} style={{border:"1px solid #e2e8f0",borderRadius:12,padding:12,display:"grid",gap:8}}>
       <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:9,flexWrap:"wrap"}}>
        <div><strong>{item.title}</strong><p style={{...small,margin:"5px 0"}}>{item.kind} · {item.jobId||"No job reference"} · {item.site||"No site"} · {item.date?new Date(item.date).toLocaleDateString():"Undated"}</p>
         <p style={{fontSize:11,color:"var(--mt-muted,#64748b)",margin:0}}>{item.personIds.length} linked person(s){scope?" · Your involvement recorded":""}</p>
        </div>
        <strong style={{color:statusColor(item.status),fontSize:11}}>{item.status.replaceAll("_"," ")}</strong>
       </div>
       {doc?<DocumentDownloadActions document={doc} compact/>:null}
      </article>;
    })}
   </div>
  </div>
  <p style={{...small,margin:0}}>Analytics describe records stored on this browser only. Person selection is not authentication; viewer-specific dashboards are demonstrations, not confidential per-user access control. Empty datasets remain zero until forms are submitted.</p>
 </section>;
}
