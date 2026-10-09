"use client";
import {useMemo,useRef,useState} from "react";
import {Search,ArrowUpRight,ClipboardCheck,Truck,Users,AlertTriangle,HardHat,MapPin,X,BriefcaseBusiness} from "lucide-react";
import {usePersistentState} from "@bokang/persistence";
import {buildWorkspaceIndex,type SearchHit,type SearchGroup,type SearchView} from "../../lib/workspace-search";
import {searchDocuments,type SearchDocument} from "@bokang/domain-data/workspace-search";
import {MOVE_TRACK_KEYS,starterFleet,starterDrivers,starterPolicies,
 type FleetVehicle,type FleetDriver,type FleetIncident,type FleetAssignment,type PrestartRecord,type FleetSitePolicy} from "../../lib/move-track";
import {ASSURANCE_STORAGE,demoOrganization,demoPeople,
 type OrganizationProfile,type PersonRecord,type JobRiskAssessment,type CustomTemplate} from "@bokang/domain-data/custom-assurance";
import type {FormSubmission} from "@bokang/domain-data/assurance-forms";
import type {FleetReleaseRecord,RepairEvidence,ReinspectionEvidence} from "../../lib/fleet-release";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {ACTIVE_WORKFLOW_KEY,ACTIVE_FORMS_TAB_KEY} from "./OperationalGraphPanel";

type Job={id:string;client:string;type:string;from:string;to:string;driver:string;state:string};
const sampleJobs:Job[]=[
 {id:"MT-601",client:"Kgetsi Furnishers",type:"Furniture move",from:"Gaborone",to:"Molepolole",driver:"Unassigned",state:"Scheduled"},
 {id:"MT-602",client:"Northside Pharmacy",type:"Local delivery",from:"Gaborone",to:"Tlokweng",driver:"Unassigned",state:"Scheduled"}
];
const icons:Record<SearchGroup,typeof Search>={
 Forms:ClipboardCheck,Risk:HardHat,Meetings:Users,Fleet:Truck,People:Users,
 Incidents:AlertTriangle,Jobs:BriefcaseBusiness,Locations:MapPin,Organizations:Users
};

const input:React.CSSProperties={width:"100%",minHeight:48,padding:"12px 40px 12px 40px",border:"1px solid #b6cae1",
 borderRadius:12,background:"#fff",font:"inherit",fontSize:14,color:"#122742"};
export function GlobalWorkspaceSearch({onNavigate,compact=false}:{
 onNavigate:(view:SearchView)=>void;compact?:boolean;
}){
 const [orgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [companies]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [directory]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [forms]=usePersistentState<FormSubmission[]>("bokang-studio.move-track.assurance-submissions.v1",[]);
 const [jras]=usePersistentState<JobRiskAssessment[]>(ASSURANCE_STORAGE.jras,[]);
 const [templates]=usePersistentState<CustomTemplate[]>(ASSURANCE_STORAGE.templates,[]);
 const [fleet]=usePersistentState<FleetVehicle[]>(MOVE_TRACK_KEYS.fleet,starterFleet);
 const [drivers]=usePersistentState<FleetDriver[]>(MOVE_TRACK_KEYS.drivers,starterDrivers);
 const [incidents]=usePersistentState<FleetIncident[]>(MOVE_TRACK_KEYS.incidents,[]);
 const [assignments]=usePersistentState<FleetAssignment[]>(MOVE_TRACK_KEYS.assignments,[]);
 const [prestarts]=usePersistentState<PrestartRecord[]>(MOVE_TRACK_KEYS.prestarts,[]);
 const [sites]=usePersistentState<FleetSitePolicy[]>(MOVE_TRACK_KEYS.policies,starterPolicies);
 const [jobs]=usePersistentState<Job[]>("bokang-studio.move-track.jobs.v1",sampleJobs);
 const [repairs]=usePersistentState<RepairEvidence[]>("bokang-studio.move-track.repairs.v1",[]);
 const [reinspections]=usePersistentState<ReinspectionEvidence[]>("bokang-studio.move-track.reinspections.v1",[]);
 const [releases]=usePersistentState<FleetReleaseRecord[]>("bokang-studio.move-track.releases.v1",[]);
 const [,setTemplate]=usePersistentState<string|null>(ACTIVE_WORKFLOW_KEY,null);
 const [,setFormTab]=usePersistentState<"library"|"records"|"designer"|"jra">(ACTIVE_FORMS_TAB_KEY,"library");
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState<"All"|SearchGroup>("All");
 const [cursor,setCursor]=useState(0);
 const [limit,setLimit]=useState(15);
 const inputRef=useRef<HTMLInputElement|null>(null);
 const index=useMemo(()=>buildWorkspaceIndex({orgId,organizations:companies,people:directory,forms,jras,templates,
   fleet,drivers,incidents,assignments,prestarts,sites,jobs,repairs,reinspections,releases}),
  [orgId,companies,directory,forms,jras,templates,fleet,drivers,incidents,assignments,prestarts,sites,jobs,repairs,reinspections,releases]);
 const documents=useMemo<SearchDocument[]>(()=>index.map(item=>({
  id:item.key,source:item.kind,category:item.group,title:item.title,description:item.subtitle,
  fields:[item.searchText,item.tag??""],target:item.view,priority:item.kind==="Safety workflow"?6:0
 })),[index]);
 const categories=useMemo(()=>["All",...new Set(index.map(i=>i.group))] as Array<"All"|SearchGroup>,[index]);
 const matches=useMemo(()=>searchDocuments(documents,query,{category,limit:300}),[documents,query,category]);
 const hits=useMemo(()=>matches.slice(0,limit).map(hit=>index.find(i=>i.key===hit.id)).filter((item):item is SearchHit=>!!item),[matches,index,limit]);
 const noQuery=query.trim().length===0;
 function open(result:SearchHit){
  if(result.templateId){setTemplate(result.templateId);setFormTab("library");}
  else if(result.key.startsWith("submission:")){setTemplate(null);setFormTab("records");}
  else if(result.key.startsWith("jra:")){setTemplate(null);setFormTab("jra");}
  setQuery("");setCursor(0);
  onNavigate(result.view);
  document.getElementById("movetrack-workspaces")?.scrollIntoView({behavior:"smooth",block:"start"});
 }
 const site=companies.find(x=>x.id===orgId)?.name??"selected company";
 return <section id="movetrack-global-search" aria-label="Search all MoveTrack data" style={{display:"grid",gap:10,padding:compact?14:19,
   border:"1px solid #c6d7ec",borderRadius:17,background:"#fff"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:12,flexWrap:"wrap"}}>
   <div><p style={{fontSize:10,letterSpacing:1.2,color:"#2563eb",fontWeight:900,margin:"0 0 5px"}}>UNIFIED WORKSPACE SEARCH</p>
    <h2 style={{fontSize:compact?17:22,margin:"0 0 5px"}}>Find forms, people, incidents and equipment</h2>
    <p style={{fontSize:11,color:"#64748b",margin:0}}>Search real records on this browser, company checklists and all safety workflows. No paid search API or sign-in required.</p>
   </div>
   <span style={{fontSize:11,color:"#64748b"}}>{index.length} indexed items · {site}</span>
  </div>
  <div style={{position:"relative",display:"flex",alignItems:"center"}}>
   <Search size={19} color="#64748b" style={{position:"absolute",left:13,pointerEvents:"none"}}/>
   <input ref={inputRef} aria-label="Search MoveTrack records" value={query}
    onChange={e=>{setQuery(e.target.value);setCursor(0);setLimit(15);}}
    onKeyDown={e=>{
     if(e.key==="ArrowDown"){e.preventDefault();setCursor(x=>Math.min(hits.length-1,x+1));}
     if(e.key==="ArrowUp"){e.preventDefault();setCursor(x=>Math.max(0,x-1));}
     if(e.key==="Enter"&&hits[cursor]){e.preventDefault();open(hits[cursor]);}
     if(e.key==="Escape"){setQuery("");setCursor(0);}
    }} placeholder="Search 'working at height', a fleet number, employee, job or hazard..." style={input}/>
   {query?<button aria-label="Clear search" type="button" onClick={()=>{setQuery("");setCursor(0);inputRef.current?.focus();}}
    style={{position:"absolute",right:7,border:0,background:"#f1f5f9",color:"#334155",width:33,height:33,borderRadius:8,cursor:"pointer"}}><X size={16}/></button>:null}
  </div>
  <div role="group" aria-label="Search result categories" style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:3}}>
   {categories.map(item=><button key={item} type="button" aria-pressed={category===item} onClick={()=>{setCategory(item);setCursor(0);setLimit(15);}}
    style={{whiteSpace:"nowrap",border:"1px solid "+(category===item?"#1d4ed8":"#cad8e8"),borderRadius:999,
     minHeight:35,padding:"7px 10px",background:category===item?"#173764":"#fff",color:category===item?"#fff":"#475569",
     fontSize:11,fontWeight:850,cursor:"pointer"}}>{item}</button>)}
  </div>
  {noQuery?<div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center",fontSize:11,color:"#64748b"}}>
   Try:
   {["Working at Heights","Brakes","Permit","Jwaneng","Supervisor","NO-GO"].map(term=><button key={term}
    onClick={()=>{setCategory("All");setQuery(term);setLimit(15);inputRef.current?.focus();}} type="button"
    style={{padding:"5px 9px",border:"1px solid #c7d7e8",borderRadius:999,background:"#f8fafc",color:"#2563eb",cursor:"pointer"}}>{term}</button>)}
  </div>:
  <div role="status" aria-live="polite" style={{display:"grid",gap:7,maxHeight:compact?300:410,overflowY:"auto"}}>
   <span style={{fontSize:11,color:"#64748b"}}>{hits.length} of {matches.length}{matches.length===300?"+":""} matching result{matches.length===1?"":"s"}</span>
   {!hits.length?<div style={{fontSize:12,padding:14,color:"#64748b",background:"#f8fafc",borderRadius:10}}>No records match these terms. Try another keyword or switch to All categories.</div>:hits.map((item,i)=>{
    const Icon=icons[item.group];
    return <button type="button" key={item.key} onClick={()=>open(item)} aria-label={"Open "+item.kind+": "+item.title}
      style={{border:i===cursor?"1px solid #8bbaf6":"1px solid #e1e9f3",borderRadius:11,
      display:"flex",gap:11,padding:"11px 12px",alignItems:"center",background:i===cursor?"#eff6ff":"#fff",
      color:"#173764",cursor:"pointer",textAlign:"left",width:"100%"}}>
     <Icon size={18} color="#2563eb"/>
     <span style={{minWidth:0,flex:1}}><strong style={{display:"block",fontSize:12,overflowWrap:"anywhere"}}>{item.title}</strong>
      <span style={{display:"block",fontSize:11,color:"#64748b",overflowWrap:"anywhere",marginTop:3}}>{item.group} · {item.subtitle}</span>
     </span>
     <ArrowUpRight size={17} color="#64748b"/>
    </button>;
   })}
   {hits.length<matches.length?<button type="button" onClick={()=>setLimit(x=>x+20)}
    style={{minHeight:43,border:"1px solid #bfdbfe",background:"#eff6ff",color:"#1d4ed8",fontWeight:850,borderRadius:10,cursor:"pointer"}}>
    Show more matches ({matches.length-hits.length} remaining)
   </button>:null}
  </div>}
  <small style={{fontSize:10,color:"#64748b",lineHeight:1.5}}>Search indexes local/demo records and published templates. Results are limited to the selected company's SHE/person records, but fleet demo records remain device-wide. This is not an access-control boundary.</small>
 </section>;
}
