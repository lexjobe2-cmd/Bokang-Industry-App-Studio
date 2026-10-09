"use client";
import {useEffect,useRef,useState} from "react";
import SignaturePad from "signature_pad";
import {createSignatureEvidence,isSignatureEvidence,SIGNATURE_NOTICE,type SignatureEvidence} from "@bokang/domain-data/signature-evidence";
import {PenLine,Trash2,CheckCircle2,RotateCcw} from "lucide-react";

const input:React.CSSProperties={minHeight:43,borderRadius:10,padding:"10px 12px",border:"1px solid #cbd5e1",background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#183153)",font:"inherit",width:"100%"};
const btn:React.CSSProperties={padding:"10px 13px",minHeight:43,border:"1px solid #cbd5e1",borderRadius:10,cursor:"pointer",background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#123257)",fontWeight:850};
export function SignatureCapture({value,onChange,scope,role="Participant",intent="acknowledgement",defaultSignerName="",signerPersonId,compact=false}:{
 value:SignatureEvidence|null|undefined;
 onChange:(signature:SignatureEvidence|null)=>void;
 scope:string;role?:string;intent?:"acknowledgement"|"review"|"attendance";defaultSignerName?:string;signerPersonId?:string;compact?:boolean;
}){
 const canvasRef=useRef<HTMLCanvasElement|null>(null);
 const padRef=useRef<SignaturePad|null>(null);
 const [name,setName]=useState(defaultSignerName);
 const [consent,setConsent]=useState(false);
 const [error,setError]=useState("");
 const [showPad,setShowPad]=useState(!isSignatureEvidence(value));
 useEffect(()=>{if(!name&&defaultSignerName)setName(defaultSignerName);},[defaultSignerName]);
 useEffect(()=>{
  if(!showPad||!canvasRef.current)return;
  const canvas=canvasRef.current;
  const pad=new SignaturePad(canvas,{minWidth:0.8,maxWidth:2.5,penColor:"#16385f",backgroundColor:"rgb(255,255,255)"});
  padRef.current=pad;
  let hadDrawn=false;
  const resize=()=>{
   // Keep strokes if the mobile device rotates.
   const strokes=hadDrawn?pad.toData():[];
   const rect=canvas.getBoundingClientRect(),dpr=Math.max(1,Math.min(window.devicePixelRatio||1,3));
   canvas.width=Math.round(Math.max(240,rect.width)*dpr);
   canvas.height=Math.round((compact?140:172)*dpr);
   canvas.getContext("2d")?.scale(dpr,dpr);
   pad.clear();
   if(strokes.length)pad.fromData(strokes);
  };
  resize();
  const observer=new ResizeObserver(()=>{hadDrawn=!pad.isEmpty();resize();});
  observer.observe(canvas);
  return ()=>{observer.disconnect();pad.off();padRef.current=null;};
 },[showPad,compact]);
 function save(){
  if(!padRef.current||padRef.current.isEmpty()){setError("Draw a signature using your finger, stylus or pointer.");return;}
  try{
   const imageDataUrl=padRef.current.toDataURL("image/png");
   onChange(createSignatureEvidence({imageDataUrl,signerName:name.trim(),signerPersonId,role,intent,
    signedAt:new Date().toISOString(),scope,consent}));
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
   <div style={{fontSize:12,color:"var(--mt-muted,#475569)"}}><CheckCircle2 size={15} color="#087f5b" style={{display:"inline",verticalAlign:"middle"}}/> Drawn by <strong>{value.signerName}</strong> · {value.role} · {new Date(value.signedAt).toLocaleString()} · Local device only</div>
   <button type="button" style={{...btn,justifySelf:"start"}} onClick={()=>{onChange(null);setShowPad(true);setConsent(false);}}>Replace / clear this signature</button>
  </div>:<>
   <label style={{fontSize:12,fontWeight:800,display:"grid",gap:5}}>Name of person signing
    <input style={input} value={name} onChange={e=>setName(e.target.value)} placeholder="Full name as declared by signer" autoComplete="name"/>
   </label>
   <div style={{background:"var(--mt-surface,#fff)",border:"1px solid #cbd5e1",borderRadius:11,padding:8,overflow:"hidden"}}>
    <canvas ref={canvasRef} aria-label="Draw signature here with touch or mouse" style={{display:"block",touchAction:"none",width:"100%",height:compact?140:172,background:"var(--mt-surface,#fff)",borderRadius:6,cursor:"crosshair"}}/>
    <p style={{margin:"6px 5px 1px",fontSize:11,color:"var(--mt-muted,#64748b)"}}>Draw inside this box using a finger or mouse.</p>
   </div>
   <label style={{display:"flex",gap:8,alignItems:"start",fontSize:12,lineHeight:1.55,color:"var(--mt-ink,#344054)"}}>
    <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} style={{marginTop:3}}/>
    <span>I am the named person and intentionally acknowledge this {intent} for: <strong>{scope}</strong>. I understand this is not a verified identity or formal work approval.</span>
   </label>
   {error?<p role="alert" style={{color:"var(--mt-danger,#b42318)",fontSize:12,margin:0}}>{error}</p>:null}
   <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    <button type="button" style={btn} onClick={()=>{padRef.current?.clear();setError("");}}><Trash2 size={15} style={{display:"inline"}}/> Clear pad</button>
    <button type="button" style={{...btn,background:"#1d4ed8",color:"#fff",borderColor:"#1d4ed8"}} onClick={save}><CheckCircle2 size={15} style={{display:"inline"}}/> Capture acknowledgement</button>
   </div>
  </>}
  <small style={{color:"var(--mt-warning,#7a4c24)",fontSize:11,lineHeight:1.5}}>{SIGNATURE_NOTICE}</small>
 </div>;
}
