"use client";
import {ArrowUp,ArrowDown,Copy,Trash2} from "lucide-react";
/** Shared row controls; duplicate content only, never signatures or approvals. */
export function RepeatableRowActions({index,count,onDuplicate,onMove,onRemove}:{index:number;count:number;onDuplicate:()=>void;onMove:(direction:-1|1)=>void;onRemove:()=>void}){
 const actions=[{name:"Move up",icon:ArrowUp,run:()=>onMove(-1),disabled:index===0},{name:"Move down",icon:ArrowDown,run:()=>onMove(1),disabled:index===count-1},{name:"Duplicate",icon:Copy,run:onDuplicate,disabled:false},{name:"Remove",icon:Trash2,run:onRemove,disabled:false}];
 return <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{actions.map(a=><button type="button" key={a.name} aria-label={`${a.name} entry ${index+1}`} disabled={a.disabled} onClick={a.run} style={{minHeight:44,minWidth:44,padding:9,border:"1px solid #cbd5e1",borderRadius:9,background:"#fff",color:"#17406b",opacity:a.disabled?.45:1,cursor:a.disabled?"default":"pointer"}}><a.icon size={17}/></button>)}</div>;
}
