"use client";
import {useEffect,useRef,useState} from "react";
import {createPortal} from "react-dom";
import {PenLine,CheckCircle2,ShieldAlert,X} from "lucide-react";
import {SignatureCapture} from "./SignatureCapture";
import {isSignatureEvidence,type SignatureEvidence} from "@bokang/domain-data/signature-evidence";

type Intent="acknowledgement"|"review"|"attendance";
export function SignatureApprovalTray({value,onChange,scope,role="Supervisor",intent="review",defaultSignerName="",signerPersonId,label="Review & sign",description="",disabled=false,compact=false}:{
 value:SignatureEvidence|null|undefined;onChange:(sig:SignatureEvidence|null)=>void;scope:string;
 role?:string;intent?:Intent;defaultSignerName?:string;signerPersonId?:string;label?:string;description?:string;disabled?:boolean;compact?:boolean;
}){
 const [open,setOpen]=useState(false);
 const closeRef=useRef<HTMLButtonElement|null>(null);
 const triggerRef=useRef<HTMLButtonElement|null>(null);
 const signed=isSignatureEvidence(value);
 useEffect(()=>{
  if(!open)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  closeRef.current?.focus();
  const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape"){e.preventDefault();setOpen(false);}if(e.key==="Tab"){
   const root=document.getElementById("movetrack-signing-tray");
   const targets=Array.from(root?.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')??[]);
   if(!targets.length)return;
   const first=targets[0]!,last=targets[targets.length-1]!;
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }};
  document.addEventListener("keydown",onKey);
  return ()=>{document.body.style.overflow=previous;document.removeEventListener("keydown",onKey);triggerRef.current?.focus();};
 },[open]);
 const recordValid=signed&&(!signerPersonId||value.signerPersonId===signerPersonId)&&value.scope===scope;
 const buttonStyle:React.CSSProperties={border:"1px solid #a8bfdd",borderRadius:10,padding:"10px 12px",minHeight:44,display:"inline-flex",gap:8,alignItems:"center",justifyContent:"center",background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#153a62)",fontWeight:850,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.55:1};
 const tray=open?createPortal(<div id="movetrack-signing-tray" role="presentation" style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"end",justifyContent:"flex-end"}}>
  <div onClick={()=>setOpen(false)} style={{position:"absolute",inset:0,background:"rgba(4,12,27,.68)"}} aria-hidden="true"/>
  <section role="dialog" aria-modal="true" aria-label={label} style={{position:"relative",width:"min(100%,540px)",minWidth:0,maxHeight:"min(92dvh,930px)",overflowY:"auto",overscrollBehavior:"contain",overflowWrap:"anywhere",boxSizing:"border-box",background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#162b45)",borderRadius:"18px 18px 0 0",padding:"18px 18px calc(18px + env(safe-area-inset-bottom))",boxShadow:"0 -10px 45px #07172c55"}}>
   <div style={{display:"flex",justifyContent:"space-between",gap:14,alignItems:"start",marginBottom:14}}>
    <div><div style={{fontSize:10,color:"var(--mt-link,#1d4ed8)",letterSpacing:1.1,fontWeight:900}}>SIGNING REVIEW · DEVICE-LOCAL DEMO</div>
     <h3 style={{fontSize:20,margin:"5px 0"}}>{label}</h3>
     <p style={{fontSize:12,color:"var(--mt-muted,#64748b)",margin:0,lineHeight:1.6}}>{description||"Confirm the exact work record before capturing this person's acknowledgement."}</p>
    </div>
    <button ref={closeRef} onClick={()=>setOpen(false)} aria-label="Close signature tray" type="button" style={{border:"1px solid #cbd5e1",borderRadius:10,background:"var(--mt-surface-soft,#f8fafc)",width:44,height:44,flexShrink:0,color:"var(--mt-ink,#16385f)",cursor:"pointer"}}><X size={20}/></button>
   </div>
   <div style={{padding:12,background:"var(--mt-surface-soft,#eff6ff)",border:"1px solid #bfdbfe",borderRadius:12,fontSize:12,display:"grid",gap:5,marginBottom:13}}>
    <strong>Reviewing: {scope}</strong><span>Required role: {role} · Intent: {intent}</span>
    <span style={{color:"var(--mt-danger,#9a3412)",display:"flex",gap:5,alignItems:"center"}}><ShieldAlert size={15}/> This drawing is not verified identity or a work permit.</span>
   </div>
   <SignatureCapture value={recordValid?value:null} role={role} intent={intent} scope={scope} signerPersonId={signerPersonId}
    defaultSignerName={defaultSignerName} compact
    onChange={sig=>{onChange(sig);if(sig)setOpen(false);}}/>
   <button type="button" onClick={()=>setOpen(false)} style={{...buttonStyle,width:"100%",marginTop:12}}>Close without further changes</button>
  </section>
 </div>,document.body):null;
 return <>
  <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:8}}>
   <button ref={triggerRef} type="button" disabled={disabled} onClick={()=>setOpen(true)} style={{...buttonStyle,background:recordValid?"#e7f8ec":"#fff",borderColor:recordValid?"#b0dbbf":"#a8bfdd"}}>
    {recordValid?<CheckCircle2 size={16} color="#087f5b"/>:<PenLine size={16}/>}
    {recordValid?"View / replace signature":label}
   </button>
   {recordValid?<span style={{color:"var(--mt-success,#087f5b)",fontSize:11,fontWeight:800}}>{value.signerName} · drawn locally · unverified</span>:<span style={{color:"var(--mt-warning,#99671b)",fontSize:11}}>Awaiting drawn acknowledgement</span>}
  </div>
  {tray}
 </>;
}
