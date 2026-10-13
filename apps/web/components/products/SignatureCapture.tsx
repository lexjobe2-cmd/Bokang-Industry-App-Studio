"use client";
import {useEffect,useRef,useState} from "react";
import SignaturePad from "signature_pad";
import {createSignatureEvidence,isSignatureEvidence,SIGNATURE_NOTICE,type SignatureEvidence} from "@bokang/domain-data/signature-evidence";
import {PenLine,Trash2,CheckCircle2} from "lucide-react";

const input:React.CSSProperties={minHeight:44,borderRadius:10,padding:"10px 12px",border:"1px solid #cbd5e1",background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#183153)",font:"inherit",width:"100%"};
const btn:React.CSSProperties={padding:"10px 13px",minHeight:44,border:"1px solid #cbd5e1",borderRadius:10,cursor:"pointer",background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#123257)",fontWeight:850};

/** A normalized PNG retains the visible ink without storing an oversized iPhone Retina canvas. */
function portableSignaturePng(canvas:HTMLCanvasElement):string{
 const maxWidth=640;
 const width=Math.min(canvas.width,maxWidth);
 if(width<1)throw new Error("Signature canvas is not ready. Please draw again.");
 const target=document.createElement("canvas");
 target.width=width;
 target.height=Math.max(1,Math.round(canvas.height*(width/canvas.width)));
 const context=target.getContext("2d");
 if(!context)throw new Error("Signature capture is unavailable in this browser.");
 context.fillStyle="#fff";
 context.fillRect(0,0,target.width,target.height);
 context.drawImage(canvas,0,0,target.width,target.height);
 // The domain evidence contract limits PNG size, independently of device pixel ratio.
 for(const max of [640,480,360,280]){
  const factor=Math.min(1,max/target.width);
  if(factor<1){
   const reduced=document.createElement("canvas");
   reduced.width=Math.round(target.width*factor);
   reduced.height=Math.max(1,Math.round(target.height*factor));
   const ctx=reduced.getContext("2d");
   if(!ctx)throw new Error("Signature capture is unavailable in this browser.");
   ctx.fillStyle="#fff";ctx.fillRect(0,0,reduced.width,reduced.height);
   ctx.drawImage(target,0,0,reduced.width,reduced.height);
   target.width=reduced.width;target.height=reduced.height;
   context.clearRect(0,0,target.width,target.height);
   context.drawImage(reduced,0,0);
  }
  const data=target.toDataURL("image/png");
  if(data.length<139000)return data;
 }
 throw new Error("This signature is too detailed to store. Please draw a simpler signature and try again.");
}

export function SignatureCapture({value,onChange,scope,role="Participant",intent="acknowledgement",defaultSignerName="",signerPersonId,compact=false}:{
 value:SignatureEvidence|null|undefined;
 onChange:(signature:SignatureEvidence|null)=>void;
 scope:string;role?:string;intent?:"acknowledgement"|"review"|"attendance";defaultSignerName?:string;signerPersonId?:string;compact?:boolean;
}){
 const canvasRef=useRef<HTMLCanvasElement|null>(null);
 const padRef=useRef<SignaturePad|null>(null);
 const nameRef=useRef<HTMLInputElement|null>(null);
 const consentRef=useRef<HTMLInputElement|null>(null);
 const [name,setName]=useState(defaultSignerName);
 const [consent,setConsent]=useState(false);
 const [hasInk,setHasInk]=useState(false);
 const [error,setError]=useState("");
 const [showPad,setShowPad]=useState(!isSignatureEvidence(value));
 useEffect(()=>{if(!name&&defaultSignerName)setName(defaultSignerName);},[defaultSignerName,name]);
 useEffect(()=>{
  if(!showPad||!canvasRef.current)return;
  const canvas=canvasRef.current;
  const pad=new SignaturePad(canvas,{minWidth:0.8,maxWidth:2.5,penColor:"#16385f",backgroundColor:"rgb(255,255,255)"});
  padRef.current=pad;
  const mark=()=>{setHasInk(!pad.isEmpty());setError("");};
  pad.addEventListener("endStroke",mark);
  const resize=()=>{
   const rect=canvas.getBoundingClientRect();
   if(rect.width<1)return;
   // Preserve ink on layout and orientation changes; avoid clearing on unchanged dimensions.
   const dpr=Math.max(1,Math.min(window.devicePixelRatio||1,2));
   const width=Math.round(rect.width*dpr),height=Math.round((compact?140:172)*dpr);
   if(canvas.width===width&&canvas.height===height)return;
   const strokes=pad.isEmpty()?[]:pad.toData();
   canvas.width=width;
   canvas.height=height;
   canvas.getContext("2d")?.setTransform(dpr,0,0,dpr,0,0);
   pad.clear();
   if(strokes.length)pad.fromData(strokes);
   setHasInk(!pad.isEmpty());
  };
  resize();
  const observer=new ResizeObserver(resize);
  observer.observe(canvas);
  return ()=>{observer.disconnect();pad.removeEventListener("endStroke",mark);pad.off();padRef.current=null;};
 },[showPad,compact]);
 function save(){
  const pad=padRef.current;
  if(!pad||pad.isEmpty()){setError("Draw your signature inside the white box before capturing.");return;}
  if(name.trim().length<2){setError("Enter the signer's full name before capturing.");nameRef.current?.focus();return;}
  if(!consent){
   setError("Tick the acknowledgement checkbox to confirm the signer's consent before capturing.");
   consentRef.current?.focus();
   return;
  }
  try{
   const imageDataUrl=portableSignaturePng(canvasRef.current!);
   const evidence=createSignatureEvidence({imageDataUrl,signerName:name.trim(),signerPersonId,role,intent,
    signedAt:new Date().toISOString(),scope,consent});
   onChange(evidence);
   setShowPad(false);setError("");
  }catch(err){setError(err instanceof Error?err.message:"Could not capture signature.");}
 }
 const valid=isSignatureEvidence(value);
 return <div aria-label="Electronic signature capture" style={{padding:compact?11:16,background:"var(--mt-surface-soft,#f8fafc)",border:"1px solid #d7e2ee",borderRadius:13,display:"grid",gap:11}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
   <strong style={{display:"flex",alignItems:"center",gap:8,fontSize:13}}><PenLine size={16} color="#2563eb"/> Draw an electronic acknowledgement</strong>
   <span style={{fontSize:10,padding:"4px 7px",background:"var(--mt-surface-soft,#fff7ed)",borderRadius:7,color:"var(--mt-danger,#9a3412)",fontWeight:850}}>UNVERIFIED DEMO SIGNATURE</span>
  </div>
  {valid&&!showPad?<div style={{display:"grid",gap:8}}>
   <div style={{padding:10,borderRadius:10,background:"var(--mt-surface,#fff)",border:"1px solid #dbe3ee"}}>
    <img src={value.imageDataUrl} alt={"Drawn signature recorded for "+value.signerName} style={{display:"block",width:"100%",maxWidth:390,height:92,objectFit:"contain",objectPosition:"left center"}}/>
   </div>
   <div role="status" style={{fontSize:12,color:"var(--mt-success,#087f5b)"}}><CheckCircle2 size={15} color="currentColor" style={{display:"inline",verticalAlign:"middle"}}/> Signature captured for <strong>{value.signerName}</strong> · {value.role} · {new Date(value.signedAt).toLocaleString()} · Local device only</div>
   <button type="button" style={{...btn,justifySelf:"start"}} onClick={()=>{onChange(null);setShowPad(true);setConsent(false);setHasInk(false);setError("");}}>Replace / clear this signature</button>
  </div>:<>
   <label style={{fontSize:12,fontWeight:800,display:"grid",gap:5}}>Name of person signing
    <input ref={nameRef} style={input} value={name} onChange={e=>{setName(e.target.value);setError("");}} placeholder="Full name as declared by signer" autoComplete="name"/>
   </label>
   <div style={{background:"#fff",border:"1px solid #cbd5e1",borderRadius:11,padding:8,overflow:"hidden"}}>
    <canvas ref={canvasRef} aria-label="Draw signature here with touch or mouse" style={{display:"block",touchAction:"none",width:"100%",height:compact?140:172,background:"#fff",borderRadius:6,cursor:"crosshair",userSelect:"none",WebkitUserSelect:"none"}}/>
    <p style={{margin:"6px 5px 1px",fontSize:11,color:"#475569"}}>Draw inside this box using a finger, stylus or mouse.</p>
   </div>
   <div role="status" aria-live="polite" style={{fontSize:12,color:"var(--mt-muted,#475569)"}}>
    {hasInk?"Signature drawn":"Signature not drawn yet"} · {name.trim().length>=2?"Name entered":"Name required"} · {consent?"Acknowledgement accepted":"Consent checkbox required"}
   </div>
   <label style={{display:"flex",gap:12,alignItems:"center",minHeight:58,padding:"12px",borderRadius:10,border:consent?"2px solid #2563eb":"2px solid var(--mt-border,#bac9d9)",background:"var(--mt-surface,#fff)",fontSize:13,lineHeight:1.55,color:"var(--mt-ink,#344054)",cursor:"pointer"}}>
    <input ref={consentRef} type="checkbox" aria-label="Accept the electronic signature acknowledgement" checked={consent}
     onChange={e=>{setConsent(e.target.checked);setError("");}}
     style={{appearance:"auto",width:26,height:26,minWidth:26,minHeight:26,flex:"0 0 26px",accentColor:"#2459db",margin:0,cursor:"pointer"}}/>
    <span><strong>I agree and acknowledge.</strong> I am the named person and intentionally acknowledge this {intent} for: <strong>{scope}</strong>. I understand this is not a verified identity or formal work approval.</span>
   </label>
   {error?<p role="alert" style={{color:"var(--mt-danger,#b42318)",fontSize:12,fontWeight:700,margin:0}}>{error}</p>:null}
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    <button type="button" style={btn} onClick={()=>{padRef.current?.clear();setHasInk(false);setError("");}}><Trash2 size={15} style={{display:"inline"}}/> Clear pad</button>
    <button type="button" style={{...btn,background:"#1d4ed8",color:"#fff",borderColor:"#1d4ed8"}} onClick={save}><CheckCircle2 size={15} style={{display:"inline"}}/> Capture acknowledgement</button>
   </div>
  </>}
  <small style={{color:"var(--mt-warning,#7a4c24)",fontSize:11,lineHeight:1.5}}>{SIGNATURE_NOTICE}</small>
 </div>;
}
