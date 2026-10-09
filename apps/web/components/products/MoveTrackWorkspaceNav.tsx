"use client";
import {useState} from "react";
import {LayoutDashboard,Activity,ClipboardCheck,UsersRound,BookOpen,FileScan,Truck,HardHat,MapPinned,CalendarCheck,BriefcaseBusiness,ShieldCheck,Database,Settings2,ChevronDown,FolderOpen} from "lucide-react";

export type MoveTrackView="control"|"fleet"|"drivers"|"sites"|"assign"|"jobs"|"analytics"|"forms"|"meetings"|"paper"|"release"|"local-data"|"settings";
export const navigationGroups=[
 {id:"overview",label:"Overview",items:[
  {view:"control",label:"Control center",description:"What needs attention",icon:LayoutDashboard},
  {view:"analytics",label:"Analytics",description:"Workforce and SHE insights",icon:Activity}]},
 {id:"safety",label:"Safety & people",items:[
  {view:"forms",label:"SHE forms & JRA",description:"Checklists, risk and signatures",icon:ClipboardCheck},
  {view:"meetings",label:"Meetings & registers",description:"Attendance and minutes",icon:UsersRound},
  {view:"paper",label:"Paper to digital",description:"Scan and improve templates",icon:FileScan}]},
 {id:"operations",label:"Fleet operations",items:[
  {view:"fleet",label:"Assets & vehicles",description:"Fleet and pre-starts",icon:Truck},
  {view:"drivers",label:"Drivers",description:"Operators and authorization",icon:HardHat},
  {view:"sites",label:"Sites & policies",description:"Workplace rules",icon:MapPinned},
  {view:"assign",label:"Assignments",description:"Allocate and dispatch",icon:CalendarCheck},
  {view:"jobs",label:"Jobs & work orders",description:"Logistics pipeline",icon:BriefcaseBusiness},
  {view:"release",label:"Repair & release",description:"Grounded-asset controls",icon:ShieldCheck}]},
 {id:"administration",label:"Documents & settings",items:[
  {view:"local-data",label:"Local data & backup",description:"Import and export workspace",icon:Database},
  {view:"settings",label:"Settings & help",description:"Appearance, support and legal",icon:Settings2}]}
] as const;
const all=navigationGroups.flatMap(g=>g.items);
export function MoveTrackWorkspaceNav({view,onChange}:{view:MoveTrackView;onChange:(view:MoveTrackView)=>void}){
 const group=navigationGroups.find(g=>g.items.some(i=>i.view===view))??navigationGroups[0];
 const [expanded,setExpanded]=useState<string|null>(null);
 const current=all.find(x=>x.view===view);
 return <nav aria-label="MoveTrack workspace navigation" style={{display:"grid",gap:12,padding:14,borderRadius:16,background:"#f8fafc",border:"1px solid #dce7f2"}}>
  <div style={{display:"flex",alignItems:"center",gap:9,justifyContent:"space-between",flexWrap:"wrap"}}>
   <div><p style={{fontSize:10,letterSpacing:1.2,color:"#2563eb",fontWeight:900,margin:0}}>WORKSPACE NAVIGATION</p>
   <strong style={{fontSize:16,display:"block",marginTop:4}}>{current?.label??"MoveTrack"}</strong></div>
   <small style={{fontSize:11,color:"#64748b"}}>{current?.description}</small>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:7}}>
   {navigationGroups.map(g=><button type="button" key={g.id} aria-expanded={g.id===(expanded??group.id)}
    onClick={()=>setExpanded(g.id===expanded?null:g.id)}
    style={{minHeight:45,borderRadius:10,border:"1px solid #bfd0e6",background:g.id===(expanded??group.id)?"#173764":"#fff",color:g.id===(expanded??group.id)?"#fff":"#344054",fontWeight:900,cursor:"pointer",padding:"10px 12px",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",gap:7}}>
    {g.label}<ChevronDown size={15}/></button>)}
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
   {(navigationGroups.find(g=>g.id===(expanded??group.id))??group).items.map(item=>{
     const selected=view===item.view;
     return <button type="button" key={item.view} onClick={()=>{onChange(item.view);setExpanded(null);}}
      aria-current={selected?"page":undefined}
      style={{display:"flex",gap:9,alignItems:"center",textAlign:"left",padding:"12px 11px",minHeight:65,cursor:"pointer",borderRadius:11,border:selected?"1px solid #2563eb":"1px solid #d5e0ec",background:selected?"#eaf2ff":"#fff",color:"#173764"}}>
       <item.icon size={19} color={selected?"#1d4ed8":"#64748b"}/>
       <span><strong style={{fontSize:12,display:"block"}}>{item.label}</strong><small style={{fontSize:10,color:"#64748b"}}>{item.description}</small></span>
      </button>;
    })}
  </div>
  <small style={{color:"#64748b",fontSize:10}}>Use these workspaces to find a task. Navigation does not change or delete existing records.</small>
 </nav>;
}
