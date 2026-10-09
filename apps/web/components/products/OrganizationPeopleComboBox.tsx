"use client";
import {useEffect,useId,useMemo,useRef,useState} from "react";
import {Check,ChevronDown,Search,Users,UserRound,X,Building2,MapPin,Mail,LoaderCircle} from "lucide-react";
import type {PersonRecord} from "@bokang/domain-data/custom-assurance";
import {searchOrganizationPeople,type DirectoryProvider,type DirectorySearchPage} from "@bokang/domain-data/organization-directory";

const input:React.CSSProperties={font:"inherit",background:"#fff",border:"1px solid #cbd5e1",borderRadius:10,color:"#153553",minHeight:43,padding:"9px 11px",width:"100%"};
type Props={
 people:readonly PersonRecord[];orgId:string;value:string[];onChange:(peopleIds:string[])=>void;
 label:string;multiple?:boolean;required?:boolean;placeholder?:string;provider?:DirectoryProvider;
};
export function OrganizationPeopleComboBox({people,orgId,value,onChange,label,multiple=false,required=false,placeholder,provider}:Props){
 const uid=useId().replace(/:/g,"");
 const [opened,setOpened]=useState(false);
 const [query,setQuery]=useState("");
 const [department,setDepartment]=useState("");
 const [city,setCity]=useState("");
 const [cursor,setCursor]=useState<string|undefined>();
 const [remote,setRemote]=useState<DirectorySearchPage|null>(null);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [highlight,setHighlight]=useState(0);
 const wrap=useRef<HTMLDivElement>(null);
 const triggerRef=useRef<HTMLButtonElement>(null);
 const searchRef=useRef<HTMLInputElement>(null);
 const selected=useMemo(()=>new Set(value),[value]);
 const scoped=useMemo(()=>people.filter(p=>p.orgId===orgId),[people,orgId]);
 const local=useMemo(()=>searchOrganizationPeople(scoped,{orgId,search:query,department,city,limit:40,cursor}),[scoped,orgId,query,department,city,cursor]);
 const facets=useMemo(()=>searchOrganizationPeople(scoped,{orgId,limit:1}),[scoped,orgId]);
 const result=provider?.mode==="CONNECTED"?(remote??{items:[],total:0,source:"CONNECTED" as const,departments:facets.departments,cities:facets.cities}):local;
 const options=result.items;
 const choices=useMemo(()=>[...new Map([...scoped,...(remote?.items??[])].map(p=>[p.id,p])).values()], [scoped,remote]);
 const departments=[...new Set([...facets.departments,...result.departments])].sort();
 const cities=[...new Set([...facets.cities,...result.cities])].sort();
 useEffect(()=>{setCursor(undefined);setRemote(null);setHighlight(0);},[orgId,query,department,city,provider]);
 useEffect(()=>{
  if(!opened||provider?.mode!=="CONNECTED")return;
  let current=true;
  setBusy(true);setError("");
  const timer=window.setTimeout(()=>{
   void provider.search({orgId,search:query,department,city,limit:40,cursor}).then(page=>{
    if(current)setRemote(prev=>cursor&&prev?{...page,items:[...prev.items,...page.items]}:page);
   }).catch(err=>{if(current)setError(err instanceof Error?err.message:"Unable to search directory");})
    .finally(()=>{if(current)setBusy(false);});
  },220);
  return ()=>{current=false;clearTimeout(timer);};
 },[opened,provider,orgId,query,department,city,cursor]);
 useEffect(()=>{
  if(!opened)return;
  const old=document.body.style.overflow;
  const mobile=window.matchMedia("(max-width: 700px)").matches;
  if(mobile)document.body.style.overflow="hidden";
  const onKey=(e:KeyboardEvent)=>{
   if(e.key==="Escape"){e.preventDefault();setOpened(false);triggerRef.current?.focus();}
   if(e.key==="Tab"&&mobile){const nodes=Array.from(wrap.current?.querySelectorAll<HTMLElement>(".movetrack-people-panel button:not([disabled]),.movetrack-people-panel input,.movetrack-people-panel select")??[]);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}
  };
  document.addEventListener("keydown",onKey);
  const handler=(e:PointerEvent)=>{if(wrap.current&&!wrap.current.contains(e.target as Node))setOpened(false);};
  document.addEventListener("pointerdown",handler);
  return ()=>{document.body.style.overflow=old;document.removeEventListener("pointerdown",handler);document.removeEventListener("keydown",onKey);triggerRef.current?.focus();};
 },[opened]);
 const chosen=selected.size>0?value.map(id=>choices.find(p=>p.id===id)).filter((p):p is PersonRecord=>!!p):[];
 const missing=value.filter(id=>!choices.some(p=>p.id===id));
 function pick(person:PersonRecord){
  if(!person.active)return;
  const next=multiple?(selected.has(person.id)?value.filter(id=>id!==person.id):[...value,person.id]):[person.id];
  onChange(next);
  setQuery("");setCursor(undefined);setRemote(null);setHighlight(0);
  if(!multiple)setOpened(false);
 }
 function clear(){onChange([]);setQuery("");setCursor(undefined);setRemote(null);}
 function keyboard(e:React.KeyboardEvent<HTMLInputElement>){
  if(e.key==="Escape"){setOpened(false);e.stopPropagation();}
  else if(e.key==="ArrowDown"){e.preventDefault();setOpened(true);setHighlight(v=>Math.min(Math.max(0,options.length-1),v+1));}
  else if(e.key==="ArrowUp"){e.preventDefault();setHighlight(v=>Math.max(0,v-1));}
  else if(e.key==="Enter"&&opened&&options[highlight]){e.preventDefault();pick(options[highlight]);}
 }
 function open(){setOpened(true);setHighlight(0);window.requestAnimationFrame(()=>searchRef.current?.focus());}
 return <div className="movetrack-personpicker" ref={wrap} style={{display:"grid",gap:7,minWidth:0,width:"100%"}}>
  <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"space-between"}}>
   <label htmlFor={uid+"-trigger"} style={{fontSize:12,fontWeight:850,color:"#344054"}}>{label}{required?<span style={{color:"#b42318"}}> *</span>:null}</label>
   <span style={{fontSize:11,fontWeight:800,color:"#64748b"}}>{multiple?value.length+" selected":value.length?"Selected":""}</span>
  </div>
  {chosen.length>0?<div className="movetrack-person-chips" aria-label="Selected people" style={{display:"flex",gap:6,flexWrap:"wrap"}}>
   {chosen.map(person=><span key={person.id} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 7px 5px 10px",border:"1px solid #bdd5ef",borderRadius:999,background:"#eaf3ff",color:"#173d68",fontSize:11,fontWeight:800,maxWidth:"100%"}}>
    <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{person.displayName}</span>
    <button type="button" aria-label={"Remove "+person.displayName} onClick={()=>onChange(value.filter(id=>id!==person.id))}
     style={{border:0,borderRadius:999,display:"grid",placeItems:"center",background:"transparent",minWidth:44,minHeight:44,color:"#245387",cursor:"pointer"}}><X size={14}/></button>
   </span>)}
   {missing.length?<span style={{fontSize:10,color:"#b45309",padding:5}}>{missing.length} selected IDs not found in current directory</span>:null}
  </div>:null}
  <button id={uid+"-trigger"} type="button" aria-expanded={opened} aria-controls={uid+"-options"} aria-haspopup="listbox"
    ref={triggerRef} onClick={()=>opened?setOpened(false):open()} style={{...input,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",fontSize:13,fontWeight:750,minHeight:48,minWidth:0,width:"100%"}}>
   <span style={{display:"flex",gap:8,alignItems:"center",minWidth:0,flex:1,overflow:"hidden"}}><Search size={16} color="#64748b" style={{flexShrink:0}}/><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{placeholder??(multiple?"Search and select employees":"Find a person by name or email")}</span></span>
   <ChevronDown size={17} color="#64748b" style={{flexShrink:0}}/>
  </button>
  {opened?<div className="movetrack-people-panel" id={uid+"-options"} role="group" aria-label={label+" search options"}>
   <div className="movetrack-people-panel-head">
    <strong style={{fontSize:14}}>Find organization people</strong>
    <button type="button" aria-label="Close people picker" onClick={()=>setOpened(false)} style={{border:0,background:"#edf2f8",color:"#24415e",borderRadius:10,width:44,height:44,display:"grid",placeItems:"center"}}><X size={20}/></button>
   </div>
   <div className="movetrack-people-search">
    <div style={{display:"flex",alignItems:"center",gap:7,border:"1px solid #c6d6e8",borderRadius:12,background:"#fff",padding:"0 10px"}}>
     <Search size={18} color="#64748b"/><input ref={searchRef} role="combobox" aria-label="Search people by name, UPN, email, department or city" aria-autocomplete="list"
       aria-expanded={opened} aria-controls={uid+"-list"} aria-activedescendant={options[highlight]?uid+"-option-"+highlight:undefined} type="search" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={keyboard}
       placeholder="Name, department, email, city..." autoComplete="off"
       style={{border:0,outline:"none",width:"100%",minHeight:49,font:"inherit",fontSize:13,color:"#153553",background:"transparent"}}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8,marginTop:9}}>
     <label style={{fontSize:10,color:"#64748b",fontWeight:850}}>DEPARTMENT
      <select aria-label="Filter people by department" value={department} onChange={e=>setDepartment(e.target.value)} style={{...input,fontSize:12,marginTop:5}}><option value="">All departments</option>{departments.map(x=><option key={x}>{x}</option>)}</select>
     </label>
     <label style={{fontSize:10,color:"#64748b",fontWeight:850}}>CITY / SITE
      <select aria-label="Filter people by city" value={city} onChange={e=>setCity(e.target.value)} style={{...input,fontSize:12,marginTop:5}}><option value="">All cities</option>{cities.map(x=><option key={x}>{x}</option>)}</select>
     </label>
    </div>
   </div>
   <div aria-live="polite" style={{fontSize:10,color:"#64748b",padding:"8px 13px 6px"}}>{busy?"Searching directory…":result.total+" matching people"} · {provider?.mode==="CONNECTED"?"Connected directory":"Local organization directory"}</div>
   {error?<div role="alert" style={{fontSize:11,color:"#b42318",padding:12}}>{error}</div>:null}
   <div className="movetrack-people-options" id={uid+"-list"} role="listbox" aria-label={"People matching "+label} aria-multiselectable={multiple}>
    {options.map((p,i)=><button type="button" role="option" id={uid+"-option-"+i} key={p.id} aria-selected={selected.has(p.id)} aria-disabled={!p.active} disabled={!p.active}
      onMouseEnter={()=>setHighlight(i)} onClick={()=>pick(p)} className={selected.has(p.id)?"movetrack-person-option selected":"movetrack-person-option"}>
     <span className="movetrack-person-avatar"><UserRound size={18}/></span>
     <span style={{flex:1,minWidth:0,display:"grid",gap:3}}>
      <strong style={{fontSize:12,color:"#16355a"}}>{p.displayName}</strong>
      <span style={{fontSize:10,color:"#526987"}}>{[p.jobTitle,p.department].filter(Boolean).join(" · ")||"Role not specified"}</span>
      <span style={{fontSize:10,color:"#64748b",overflowWrap:"anywhere"}}><Mail size={10} style={{display:"inline",verticalAlign:"middle"}}/> {p.email||p.userPrincipalName||"No email"}{p.userPrincipalName&&p.userPrincipalName!==p.email?" · UPN "+p.userPrincipalName:""}</span>
      <span style={{fontSize:10,color:"#64748b"}}><MapPin size={10} style={{display:"inline",verticalAlign:"middle"}}/> {p.city||p.location||p.officeLocation||"City not specified"}{p.employeeNumber?" · "+p.employeeNumber:""}</span>
     </span><span className="movetrack-person-check">{selected.has(p.id)?<Check size={19}/>:null}</span>
    </button>)}
    {!options.length&&!busy?<div style={{padding:"19px 12px",textAlign:"center",fontSize:12,color:"#64748b"}}>No matching people. Change the filters or import your company's directory CSV.</div>:null}
    {result.nextCursor?<button type="button" onClick={()=>setCursor(result.nextCursor)} style={{...input,cursor:"pointer",fontSize:12,fontWeight:850}}>Show more results</button>:null}
   </div>
   <div className="movetrack-people-footer">
    <small style={{fontSize:10,color:"#64748b"}}>{value.length} {multiple?"people":"person"} selected · matched by stable directory ID</small>
    <div style={{display:"flex",gap:7}}>
     {multiple?<button type="button" style={{minHeight:44,padding:"9px 11px",borderRadius:10,border:"1px solid #d3dfec",background:"#fff",fontSize:11,fontWeight:850}} onClick={()=>onChange([...new Set([...value,...options.filter(p=>p.active).map(p=>p.id)])])}>Select visible</button>:null}
     {value.length?<button type="button" onClick={clear} style={{minHeight:44,padding:"9px 11px",borderRadius:10,border:"1px solid #d3dfec",background:"#fff",fontSize:11,fontWeight:850}}>Clear</button>:null}
     <button type="button" onClick={()=>setOpened(false)} style={{minHeight:44,padding:"9px 13px",borderRadius:10,border:0,background:"#174fa8",color:"#fff",fontSize:11,fontWeight:850}}>Done</button>
    </div>
   </div>
  </div>:null}
  <style>{`
  .movetrack-personpicker {position:relative;min-width:0;width:100%;}
  .movetrack-personpicker > div:first-child {flex-wrap:wrap;}
  .movetrack-personpicker input,.movetrack-personpicker select {min-width:0;}
  .movetrack-people-panel {position:absolute;top:100%;left:0;z-index:64;width:min(485px,100%);margin-top:5px;border:1px solid #cbd9e8;border-radius:15px;background:#fff;box-shadow:0 20px 45px rgba(15,35,63,.2);color:#1c3553;overflow:hidden;}
  .movetrack-people-panel-head,.movetrack-people-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 13px;background:#f5f8fd;border-bottom:1px solid #dfe8f2;}
  .movetrack-people-search{padding:12px 13px 3px;}
  .movetrack-people-options{display:grid;gap:3px;max-height:315px;overflow-y:auto;overscroll-behavior:contain;padding:5px 9px;}
  .movetrack-person-option{display:flex;align-items:center;gap:10px;text-align:left;width:100%;min-height:68px;padding:9px;border:1px solid transparent;border-radius:11px;background:#fff;cursor:pointer;}
  .movetrack-person-option:hover,.movetrack-person-option:focus-visible{background:#f0f6fd;}
  .movetrack-person-option.selected{background:#eaf3ff;border-color:#bad5f8;}
  .movetrack-person-avatar{flex:none;width:38px;height:38px;border-radius:11px;background:#e5edf8;display:grid;place-items:center;color:#2563eb;}
  .movetrack-person-check{color:#0b7a54;display:grid;place-items:center;width:22px;}
  .movetrack-people-footer{flex-wrap:wrap;border-top:1px solid #dfe8f2;border-bottom:0;}
  @media(max-width:700px){
    .movetrack-people-panel{position:fixed;inset:0;width:100vw;height:100dvh;max-height:100dvh;margin:0;border:0;border-radius:0;
     display:flex;flex-direction:column;z-index:130;padding-top:env(safe-area-inset-top);}
    .movetrack-people-options{flex:1;min-height:0;max-height:none;}
    .movetrack-people-footer > div{flex-wrap:wrap;}
    .movetrack-person-option strong{font-size:14px !important;}
    .movetrack-person-option span{font-size:12px !important;}
    .movetrack-people-search label,.movetrack-people-footer small{font-size:12px !important;}
    .movetrack-people-footer{padding-bottom:calc(13px + env(safe-area-inset-bottom));}
  }
  .movetrack-root[data-theme="dark"] .movetrack-personpicker .movetrack-people-panel{background:#152b46;color:#eff6ff;border-color:#3c5877;}
  .movetrack-root[data-theme="dark"] :is(.movetrack-people-panel-head,.movetrack-people-footer){background:#193552;border-color:#395575;}
  .movetrack-root[data-theme="dark"] .movetrack-person-option{background:#17324e;}
  .movetrack-root[data-theme="dark"] .movetrack-person-option.selected{background:#254c73;}
  .movetrack-root[data-theme="dark"] .movetrack-person-option strong{color:#fff !important;}
  .movetrack-root[data-theme="dark"] .movetrack-person-option span{color:#c4d4e8 !important;}
  `}</style>
 </div>;
}
