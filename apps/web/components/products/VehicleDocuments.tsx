"use client";
import {useState} from "react";
import type {LocalAssetDocument} from "../../lib/vehicle-documents";
import {MAX_VEHICLE_DOCUMENTS,MAX_VEHICLE_DOCUMENT_DATA_URL_LENGTH,vehicleDocumentError,isPdfHeader} from "../../lib/vehicle-documents";

function documentDownload(document:LocalAssetDocument){
 const binary=atob(document.dataUrl.split(",")[1]??"");
 const bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 const url=URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));
 const anchor=window.document.createElement("a");
 anchor.href=url;anchor.download=document.name;window.document.body.appendChild(anchor);anchor.click();anchor.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function VehicleDocuments({documents,onChange,readOnly=false}:{documents:readonly LocalAssetDocument[];onChange?:(documents:LocalAssetDocument[])=>void;readOnly?:boolean}){
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 async function add(files:FileList|null){
  if(!files?.length||readOnly||!onChange||busy)return;
  setBusy(true);setError("");
  const next=[...documents],errors:string[]=[];
  try{
   for(const file of Array.from(files)){
    if(next.length>=MAX_VEHICLE_DOCUMENTS){errors.push("Only four documents per vehicle are supported.");break;}
    const problem=vehicleDocumentError(file);
    if(problem){errors.push(file.name+": "+problem);continue;}
    try{
     const bytes=new Uint8Array(await file.arrayBuffer());
     if(!isPdfHeader(bytes)){errors.push(file.name+": this file is not a valid PDF header.");continue;}
     const dataUrl=await new Promise<string>((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>typeof reader.result==="string"?resolve(reader.result):reject(new Error("PDF could not be read"));
      reader.onerror=()=>reject(new Error("PDF could not be read"));
      reader.readAsDataURL(file);
     });
     if(!dataUrl.startsWith("data:application/pdf;base64,")||dataUrl.length>MAX_VEHICLE_DOCUMENT_DATA_URL_LENGTH){errors.push(file.name+": PDF is too large for offline storage.");continue;}
     next.push({id:crypto.randomUUID(),name:file.name.slice(0,120),mimeType:"application/pdf",dataUrl,addedAt:new Date().toISOString()});
    }catch{errors.push(file.name+": could not read this PDF.");}
   }
   if(next.length!==documents.length)onChange(next);
   setError(errors.join(" "));
  }finally{setBusy(false);}
 }
 return <section aria-label="Vehicle documents" style={{display:"grid",gap:9,minWidth:0,marginTop:12}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
   <strong style={{fontSize:12}}>Vehicle documents ({documents.length}/{MAX_VEHICLE_DOCUMENTS})</strong>
   {!readOnly&&onChange?<label style={{minHeight:44,display:"inline-flex",alignItems:"center",padding:"9px 12px",border:"1px solid #94a3b8",borderRadius:10,fontSize:12,fontWeight:750,cursor:"pointer"}}>
    {busy?"Reading PDFs…":"Attach PDFs"}
    <input type="file" aria-label="Choose vehicle PDF documents" accept="application/pdf,.pdf" multiple disabled={busy||documents.length>=MAX_VEHICLE_DOCUMENTS} style={{position:"absolute",width:1,height:1,opacity:0}} onChange={event=>{void add(event.currentTarget.files);event.currentTarget.value="";}}/>
   </label>:null}
  </div>
  {documents.length?documents.map(doc=><div key={doc.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,flexWrap:"wrap",border:"1px solid #e2e8f0",padding:8,borderRadius:9}}>
   <span title={doc.name} style={{fontSize:12,overflowWrap:"anywhere",flex:"1 1 160px"}}>{doc.name}</span>
   <button type="button" style={{minHeight:44,padding:"7px 10px",borderRadius:8,border:"1px solid #94a3b8",background:"#fff",fontSize:12}} onClick={()=>documentDownload(doc)}>Download</button>
   {!readOnly&&onChange?<button type="button" aria-label={"Remove document "+doc.name} style={{minHeight:44,padding:"7px 10px",borderRadius:8,border:"1px solid #fda4af",background:"#fff",color:"#b42318",fontSize:12}} onClick={()=>onChange(documents.filter(item=>item.id!==doc.id))}>Remove</button>:null}
  </div>):<small style={{fontSize:11,color:"#64748b"}}>No documents attached.</small>}
  {!readOnly?<small style={{fontSize:11,color:"#64748b"}}>Up to four PDFs, 250 KB each. Browser-local only; files are not verified certificates.</small>:null}
  {error?<p role="alert" style={{fontSize:12,color:"#b42318",margin:0}}>{error}</p>:null}
 </section>;
}
