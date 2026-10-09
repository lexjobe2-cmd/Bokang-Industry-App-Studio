"use client";
import {useState} from "react";
import {Download,FileText,LoaderCircle} from "lucide-react";
import {downloadDocument,type ExportDocument,type DocumentFormat} from "../../lib/form-exports";

const btn:React.CSSProperties={border:"1px solid #cbd5e1",borderRadius:9,background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#173764)",padding:"8px 11px",minHeight:38,fontSize:12,fontWeight:800,cursor:"pointer"};
export function DocumentDownloadActions({document:doc,compact=false}:{document:ExportDocument;compact?:boolean}){
 const [format,setFormat]=useState<DocumentFormat>("pdf");
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const download=async()=>{
  setBusy(true);setError("");
  try{await downloadDocument(doc,format);}catch(e){setError(e instanceof Error?e.message:"Unable to export document.");}
  finally{setBusy(false);}
 };
 return <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
  <label style={{display:"flex",gap:5,alignItems:"center",fontSize:11,color:"var(--mt-muted,#64748b)",fontWeight:800}}>
   {!compact?"Download "+doc.mode:""}
   <select value={format} onChange={e=>setFormat(e.target.value as DocumentFormat)} aria-label={"Export "+doc.title+" format"}
    style={{...btn,background:"var(--mt-surface,#fff)",minWidth:77}}>
    <option value="pdf">PDF</option><option value="docx">Word (.docx)</option>
    <option value="csv">CSV</option><option value="json">JSON</option>
   </select>
  </label>
  <button type="button" disabled={busy} style={{...btn,background:"#173764",color:"#fff",borderColor:"#173764",display:"inline-flex",alignItems:"center",gap:5,opacity:busy?0.65:1}} onClick={()=>void download()}>
   {busy?<LoaderCircle size={15}/>:<Download size={15}/>} {busy?"Generating…":compact?"Download":doc.mode==="blank"?"Blank template":doc.mode==="draft"?"Draft copy":"Filled record"}
  </button>
  {error?<span role="alert" style={{fontSize:11,color:"var(--mt-danger,#b42318)"}}>{error}</span>:null}
 </div>;
}
