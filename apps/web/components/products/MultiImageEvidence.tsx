"use client";
import {useState} from "react";
import {DesktopModal} from "./DesktopModal";
import type {LocalEvidenceImage} from "../../lib/image-evidence";
import {MAX_LOCAL_EVIDENCE_IMAGES,MAX_LOCAL_IMAGE_DATA_URL_LENGTH,imageInputError} from "../../lib/image-evidence";

async function compress(file:File):Promise<string>{
 const url=URL.createObjectURL(file);
 try{
  const image=new Image();
  await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error("Cannot decode "+file.name));image.src=url;});
  if(!image.naturalWidth||!image.naturalHeight)throw new Error("Invalid image dimensions.");
  const canvas=document.createElement("canvas");
  const ctx=canvas.getContext("2d");
  if(!ctx)throw new Error("Image processing is not available on this device.");
  for(const edge of [1280,960,720,520]){
   const scale=Math.min(1,edge/Math.max(image.naturalWidth,image.naturalHeight));
   canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
   canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
   ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);
   ctx.drawImage(image,0,0,canvas.width,canvas.height);
   for(const quality of [.76,.6,.46,.34]){
    const data=canvas.toDataURL("image/jpeg",quality);
    if(data.length<=MAX_LOCAL_IMAGE_DATA_URL_LENGTH)return data;
   }
  }
  throw new Error(file.name+" is too detailed for offline storage. Try a smaller photo.");
 }finally{URL.revokeObjectURL(url);}
}
export function MultiImageEvidence({images,onChange,label="Photo evidence",readOnly=false,max=MAX_LOCAL_EVIDENCE_IMAGES}:{
 images:readonly LocalEvidenceImage[];
 onChange?:(images:LocalEvidenceImage[])=>void;
 label?:string;readOnly?:boolean;max?:number;
}){
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [preview,setPreview]=useState<LocalEvidenceImage|null>(null);
 const limit=Math.min(Math.max(1,max),MAX_LOCAL_EVIDENCE_IMAGES);
 async function upload(files:FileList|null){
  if(!files?.length||!onChange||readOnly)return;
  setBusy(true);setMessage("");
  const next=[...images];
  const errors:string[]=[];
  try{
   for(const file of Array.from(files)){
    if(next.length>=limit){errors.push("Limit reached: "+limit+" photos per record.");break;}
    const error=imageInputError(file);
    if(error){errors.push(error);continue;}
    try{
     const dataUrl=await compress(file);
     next.push({id:crypto.randomUUID(),name:file.name.slice(0,120),addedAt:new Date().toISOString(),dataUrl});
    }catch(e){errors.push(e instanceof Error?e.message:"Could not process "+file.name);}
   }
   if(next.length>images.length)onChange(next);
   setMessage(errors.join(" "));
  }finally{setBusy(false);}
 }
 return <div aria-label={label} style={{display:"grid",gap:9,minWidth:0}}>
  <div style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
   <strong style={{fontSize:12}}>{label} ({images.length}/{limit})</strong>
   {!readOnly&&onChange?<label style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minHeight:44,padding:"8px 12px",border:"1px solid #9ab8da",borderRadius:10,cursor:busy?"wait":"pointer",fontSize:12,fontWeight:800}}>
    {busy?"Preparing photos…":"Add photos"}
    <input aria-label={"Choose "+label.toLowerCase()} type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy||images.length>=limit} style={{position:"absolute",width:1,height:1,opacity:0}} onChange={e=>{void upload(e.currentTarget.files);e.currentTarget.value="";}}/>
   </label>:null}
  </div>
  {images.length?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,110px),1fr))",gap:8}}>
   {images.map((photo)=><figure key={photo.id} style={{margin:0,minWidth:0,background:"var(--mt-surface-soft,#f8fafc)",border:"1px solid #cbd5e1",borderRadius:11,padding:5}}>
    <button type="button" aria-label={"View photo "+photo.name} onClick={()=>setPreview(photo)} style={{padding:0,border:0,width:"100%",background:"transparent",cursor:"zoom-in"}}><img src={photo.dataUrl} alt={photo.name} loading="lazy" style={{width:"100%",height:93,objectFit:"cover",borderRadius:7}}/></button>
    <figcaption title={photo.name} style={{fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{photo.name}</figcaption>
    {!readOnly&&onChange?<button type="button" style={{marginTop:4,minHeight:44,width:"100%",background:"var(--mt-surface,#fff)",border:"1px solid #fecaca",borderRadius:7,color:"var(--mt-danger,#b42318)",fontSize:11}} onClick={()=>onChange(images.filter(item=>item.id!==photo.id))} aria-label={"Remove "+photo.name}>Remove</button>:null}
   </figure>)}
  </div>:<small style={{color:"var(--mt-muted,#64748b)"}}>No photographs attached yet.</small>}
  {!readOnly?<small style={{color:"var(--mt-muted,#64748b)"}}>JPEG, PNG or WebP; up to 8 MB each. Photos are compressed and stored on this browser only. They are not verified safety approvals.</small>:null}
  {message?<p role="alert" style={{fontSize:12,color:"var(--mt-danger,#b42318)",margin:0}}>{message}</p>:null}
  <DesktopModal title={preview?.name??"Photo preview"} open={Boolean(preview)} onClose={()=>setPreview(null)}>
   {preview?<div style={{display:"grid",gap:10,justifyItems:"center"}}><img src={preview.dataUrl} alt={preview.name} style={{maxWidth:"100%",width:"auto",height:"auto",maxHeight:"min(68dvh,650px)",objectFit:"contain"}}/><button type="button" style={{minHeight:44,padding:"10px 16px",borderRadius:9,border:"1px solid #94a3b8",background:"var(--mt-surface,#fff)"}} onClick={()=>setPreview(null)}>Close preview</button></div>:null}
  </DesktopModal>
 </div>;
}
