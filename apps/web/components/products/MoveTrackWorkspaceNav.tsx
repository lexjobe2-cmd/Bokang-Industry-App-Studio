"use client";
import {LayoutDashboard,Activity,ClipboardCheck,UsersRound,FileScan,Truck,HardHat,MapPinned,CalendarCheck,BriefcaseBusiness,ShieldCheck,Database,Settings2,UserRound} from "lucide-react";

export type MoveTrackView="control"|"fleet"|"drivers"|"sites"|"assign"|"jobs"|"analytics"|"forms"|"meetings"|"paper"|"release"|"local-data"|"settings"|"profile";
export const navigationGroups=[
 {id:"overview",label:"Overview",items:[
  {view:"control",label:"Control center",description:"What needs attention",icon:LayoutDashboard},
  {view:"analytics",label:"Analytics",description:"Workforce and SHE insights",icon:Activity},
  {view:"profile",label:"My profile & participation",description:"Local worker activity and actions",icon:UserRound}]},
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

export function MoveTrackWorkspaceNav({view,onChange}:{view:MoveTrackView;onChange:(view:MoveTrackView)=>void}){
 const current=navigationGroups.flatMap(group=>group.items.map(item=>({view:item.view,label:item.label,description:item.description}))).find(item=>item.view===view);
 const group=navigationGroups.find(group=>group.items.some(item=>item.view===view));
 return <nav aria-label="MoveTrack workspace navigation" className="movetrack-workspace-switcher">
  <div className="movetrack-workspace-heading">
   <span className="movetrack-workspace-eyebrow">CURRENT WORKSPACE</span>
   <strong>{current?.label??"Control center"}</strong>
   <small>{current?.description??"Find your operational records"}</small>
  </div>
  <div className="movetrack-workspace-shortcuts" aria-label="Related workspaces">
   {group?.items.filter(item=>item.view!==view).map(item=><button type="button" key={item.view} onClick={()=>onChange(item.view)} title={item.description}>
    <item.icon size={17}/><span>{item.label}</span>
   </button>)}
  </div>
  <small className="movetrack-workspace-hint">Use the <b>☰ Menu</b> above for every workspace.</small>
 </nav>;
}
