"use client";
import {useId,useState} from "react";
import type {FleetVehicle} from "../../lib/move-track";
const control:React.CSSProperties={width:"100%",minHeight:44,border:"1px solid #cbd5e1",borderRadius:10,padding:"10px 12px",background:"#fff",color:"#153553",font:"inherit"};
export function QuickChoice({options,value,onChange}:{options:readonly string[];value:string;onChange:(v:string)=>void}){
 return <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{options.map(v=><button type="button" key={v} aria-pressed={value===v} onClick={()=>onChange(v)} style={{...control,width:"auto",flex:"1 1 70px",background:value===v?(v==="FAIL"||v==="NO"?"#fee2e2":"#dbeafe"):"#fff",borderColor:value===v?"#2563eb":"#cbd5e1",fontWeight:800}}>{v==="NA"?"N/A":v}</button>)}</div>;
}
export function SmartMultiSelect({options,value,onChange,label}:{options:readonly string[];value:readonly string[];onChange:(v:string[])=>void;label:string}){
 const [search,setSearch]=useState("");const filtered=options.filter(v=>v.toLowerCase().includes(search.trim().toLowerCase()));
 return <div style={{display:"grid",gap:8}}>{options.length>8?<input type="search" style={control} aria-label={"Search "+label} placeholder="Filter choices" value={search} onChange={e=>setSearch(e.target.value)}/>:null}
  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{filtered.map(v=><button key={v} type="button" aria-pressed={value.includes(v)} style={{...control,width:"auto",background:value.includes(v)?"#dbeafe":"#fff"}} onClick={()=>onChange(value.includes(v)?value.filter(x=>x!==v):[...value,v])}>{v}</button>)}</div>
  {filtered.length===0?<small>No matching choices. Change the search.</small>:null}
 </div>;
}
export function SearchableAssetPicker({assets,value,onChange}:{assets:readonly FleetVehicle[];value:string;onChange:(v:string)=>void}){
 const [search,setSearch]=useState("");const id=useId();const filtered=assets.filter(a=>a.id===value||`${a.fleetNo} ${a.makeModel} ${a.id}`.toLowerCase().includes(search.toLowerCase()));
 return <div style={{display:"grid",gap:6}}><label htmlFor={id}>Link to asset *</label><input style={control} type="search" aria-label="Search fleet assets" placeholder="Fleet number, model or asset ID" value={search} onChange={e=>setSearch(e.target.value)}/>
  <select id={id} style={control} value={value} onChange={e=>onChange(e.target.value)}><option value="">Choose asset</option>{filtered.map(a=><option key={a.id} value={a.id}>{a.fleetNo} · {a.makeModel}</option>)}</select>
 </div>;
}
