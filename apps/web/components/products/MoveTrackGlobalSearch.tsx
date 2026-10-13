"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {Search,ArrowRight,X,Command,Filter} from "lucide-react";
import {searchDocuments, type SearchDocument,type SearchHit} from "@bokang/domain-data/workspace-search";

const surface:React.CSSProperties={border:"1px solid #d5e2f1",background:"var(--mt-surface,#fff)",borderRadius:15,padding:15};
const input:React.CSSProperties={width:"100%",minHeight:48,border:"1px solid #b9cbe0",borderRadius:11,background:"var(--mt-surface,#fff)",padding:"11px 12px",boxSizing:"border-box",font:"inherit",fontSize:14,color:"var(--mt-ink,#153455)"};
export function MoveTrackGlobalSearch({documents,onOpen}:{documents:readonly SearchDocument[];onOpen:(hit:SearchHit)=>void}){
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState("All");
 const [source,setSource]=useState("All");
 const [limit,setLimit]=useState(15);
 const [open,setOpen]=useState(false);
 const [selected,setSelected]=useState(0);
 const inputRef=useRef<HTMLInputElement|null>(null);
 useEffect(()=>{
  const handler=(event:KeyboardEvent)=>{
   if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){
    event.preventDefault();setOpen(true);inputRef.current?.focus();
   }
   if(event.key==="Escape"){setOpen(false);inputRef.current?.blur();}
  };
  document.addEventListener("keydown",handler);
  return ()=>document.removeEventListener("keydown",handler);
 },[]);
 const categories=useMemo(()=>["All",...new Set(documents.map(x=>x.category))].sort((a,b)=>a==="All"?-1:b==="All"?1:a.localeCompare(b)),[documents]);
 const sources=useMemo(()=>["All",...new Set(documents.map(x=>x.source))].sort((a,b)=>a==="All"?-1:b==="All"?1:a.localeCompare(b)),[documents]);
 const matches=useMemo(()=>searchDocuments(documents,query,{category,source:source==="All"?undefined:source,limit:300}),[documents,query,category,source]);
 const results=matches.slice(0,limit);
 const highlight=query.trim().length>0;
 function activate(hit:SearchHit){onOpen(hit);setOpen(false);setQuery("");setSelected(0);}
 return <section aria-label="Search the MoveTrack workspace" style={{...surface,display:"grid",gap:12}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
   <div><p style={{fontSize:10,color:"var(--mt-link,#2563eb)",fontWeight:900,letterSpacing:1.2,margin:"0 0 4px"}}>UNIFIED WORKSPACE SEARCH</p>
    <h2 style={{fontSize:18,margin:0}}>Find a form, worker, job or asset</h2></div>
   <span style={{fontSize:11,color:"var(--mt-muted,#64748b)"}}>{documents.length} live local records · <kbd>⌘ / Ctrl K</kbd></span>
  </div>
  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
   <label style={{flex:"1 1 230px",position:"relative",display:"block"}}>
    <Search size={17} color="#64748b" style={{position:"absolute",left:13,top:15,pointerEvents:"none"}}/>
    <input ref={inputRef} aria-label="Search all MoveTrack records" value={query}
      onFocus={()=>setOpen(true)} onChange={e=>{setQuery(e.target.value);setOpen(true);setSelected(0);setLimit(15);}}
      onKeyDown={e=>{
       if(e.key==="ArrowDown"){e.preventDefault();setSelected(i=>Math.min(i+1,results.length-1));}
       else if(e.key==="ArrowUp"){e.preventDefault();setSelected(i=>Math.max(0,i-1));}
       else if(e.key==="Enter"&&results[selected]){e.preventDefault();activate(results[selected]);}
      }}
      placeholder="Try work at height, Kagiso, Jwaneng, LV-014, corrective action…" style={{...input,paddingLeft:41}}/>
   </label>
   <label style={{display:"flex",gap:5,alignItems:"center",fontSize:11,fontWeight:900,color:"var(--mt-muted,#64748b)"}}>
    <Filter size={15}/> Area
    <select value={category} onChange={e=>{setCategory(e.target.value);setOpen(true);setSelected(0);setLimit(15);}}
      style={{...input,minWidth:140,width:"auto"}} aria-label="Search category">{categories.map(c=><option key={c}>{c}</option>)}</select>
   </label>
   <label style={{display:"flex",gap:5,alignItems:"center",fontSize:11,fontWeight:900,color:"var(--mt-muted,#64748b)"}}>
    Source
    <select value={source} aria-label="Search data source" onChange={e=>{setSource(e.target.value);setLimit(15);setOpen(true);}}
      style={{...input,minWidth:140,width:"auto"}}>{sources.map(c=><option value={c} key={c}>{c}</option>)}</select>
   </label>
   {query?<button aria-label="Clear search" onClick={()=>{setQuery("");setOpen(false);setCategory("All");setSource("All");setLimit(15);}} style={{border:"1px solid #cbd5e1",borderRadius:10,minHeight:46,padding:11,background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#153455)",cursor:"pointer"}}><X size={17}/></button>:null}
  </div>
  {open?<div role="region" aria-label="Search results" aria-live="polite" style={{borderTop:"1px solid #e2e8f0",paddingTop:10,display:"grid",gap:7,maxHeight:380,overflowY:"auto",scrollbarGutter:"stable"}}>
   <div style={{fontSize:11,fontWeight:800,color:"var(--mt-muted,#64748b)"}}>Showing {results.length} of {matches.length}{matches.length===300?"+":""} {highlight?"matching":"available"} records · relevance ranked</div>
   {!results.length?<p style={{fontSize:12,color:"var(--mt-muted,#64748b)",padding:10,margin:0}}>No matches in current local data. Try fewer words or another area. New forms, people and records appear automatically when saved.</p>:null}
   {results.map((r,i)=><button type="button" key={r.source+":"+r.id} onClick={()=>activate(r)}
    aria-selected={selected===i} onMouseEnter={()=>setSelected(i)}
    style={{width:"100%",padding:"12px",textAlign:"left",border:"1px solid "+(i===selected?"#a9c7ef":"#e2e8f0"),background:i===selected?"#eff6ff":"#fff",borderRadius:11,display:"flex",gap:9,alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
    <span style={{display:"grid",gap:4,flex:1,minWidth:0}}>
     <span style={{fontSize:13,fontWeight:850,color:"var(--mt-ink,#173764)",overflowWrap:"anywhere"}}>{r.title}</span>
     <span style={{fontSize:11,color:"var(--mt-muted,#64748b)",overflowWrap:"anywhere"}}>{r.category} · {r.description||"Local workspace item"} {r.status?"· "+r.status:""}</span>
    </span><ArrowRight size={17} color="#2563eb"/>
   </button>)}
  </div>:null}
  <p style={{fontSize:11,color:"var(--mt-muted,#64748b)",margin:0}}>Search runs entirely on current browser data. New form types and connected sources can register adapters without a search API, account or paid dependency.</p>
 </section>;
}
