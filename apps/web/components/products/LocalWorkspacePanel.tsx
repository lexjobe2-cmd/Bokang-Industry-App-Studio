"use client";

import {useRef,useState} from "react";
import {Archive,Download,HardDrive,Upload,Trash2,AlertTriangle,ShieldCheck} from "lucide-react";
import {clearPaperOriginals} from "../../lib/paper-source-store";
import {
 makeWorkspaceBackup,parseWorkspaceBackup,restoreWorkspaceBackup,clearWorkspaceData,
 MOVE_TRACK_STORAGE_PREFIX,useLocalStorageErrors
} from "@bokang/persistence";

const panel:React.CSSProperties={border:"1px solid #dce4ee",background:"#fff",borderRadius:16,padding:18};
const button:React.CSSProperties={background:"#173764",color:"#fff",padding:"11px 15px",border:0,borderRadius:10,fontWeight:800,cursor:"pointer",minHeight:44};
function countSaved(){
 if(typeof window==="undefined")return {count:0,bytes:0,available:false};
 try{
  let count=0,bytes=0;
  for(let i=0;i<window.localStorage.length;i++){
   const key=window.localStorage.key(i);
   if(!key?.startsWith(MOVE_TRACK_STORAGE_PREFIX))continue;
   const value=window.localStorage.getItem(key);
   if(value!==null){count++;bytes+=(key.length+value.length)*2;}
  }
  return {count,bytes,available:true};
 }catch{return {count:0,bytes:0,available:false};}
}
export function LocalWorkspacePanel(){
 const inputRef=useRef<HTMLInputElement>(null);
 const storageErrors=useLocalStorageErrors();
 const [updated,setUpdated]=useState(0);
 const [message,setMessage]=useState("");
 const info=countSaved();
 function downloadBackup(){
  try{
   const backup=makeWorkspaceBackup(window.localStorage);
   const payload=JSON.stringify(backup,null,2);
   const url=URL.createObjectURL(new Blob([payload],{type:"application/json"}));
   const link=document.createElement("a");
   link.href=url;link.download="movetrack-local-backup-"+new Date().toISOString().slice(0,10)+".json";
   document.body.appendChild(link);link.click();link.remove();
   URL.revokeObjectURL(url);
   setMessage("Backup generated. Store the file securely; it may contain workplace and demo employee details.");
   setUpdated(v=>v+1);
  }catch(error){setMessage(error instanceof Error?error.message:"Could not export data.");}
 }
 async function importBackup(file:File|undefined){
  if(!file)return;
  if(file.size>12_000_000){setMessage("Backup too large (limit 12 MB).");return;}
  try{
   const raw=await file.text();
   const backup=parseWorkspaceBackup(raw);
   if(!window.confirm("Restore "+Object.keys(backup.items).length+" saved records? Matching keys will be replaced. Export your current data first."))return;
   const count=restoreWorkspaceBackup(window.localStorage,backup);
   setMessage("Restored "+count+" records. Forms, JRA drafts and fleet screens will refresh from local storage.");
   setUpdated(v=>v+1);
  }catch(error){setMessage(error instanceof Error?error.message:"Cannot restore the selected backup.");}
  finally{if(inputRef.current)inputRef.current.value="";}
 }
 async function erase(){
  if(!window.confirm("Delete all MoveTrack local data in this browser, including custom companies, templates, records, and JRA drafts? This cannot be undone without an exported backup."))return;
  if(!window.confirm("Confirm: permanently clear this browser's MoveTrack workspace?"))return;
  try{
   const count=clearWorkspaceData(window.localStorage);
   try{
     await clearPaperOriginals();
     setMessage("Cleared "+count+" workspace records and the locally archived paper scans. Starter demo examples will reappear.");
   }catch(error){
     setMessage("Cleared "+count+" workspace records, but the original paper scan archive could not be cleared: "+String(error));
   }
   setUpdated(v=>v+1);
  }catch(error){setMessage(error instanceof Error?error.message:"Could not clear local data.");}
 }
 return <section aria-label="Local data and backups" style={{display:"grid",gap:12,marginTop:15}}>
  <div style={{...panel,background:"#101d33",color:"#fff",border:0}}>
   <div style={{display:"flex",gap:10,alignItems:"center"}}><HardDrive size={22}/><div><h2 style={{margin:0,fontSize:23}}>Offline workspace & backups</h2><p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.65}}>No sign-in required. MoveTrack saves your edits to this device and browser profile.</p></div></div>
  </div>
  <div style={{...panel,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
   <div style={{display:"flex",alignItems:"center",gap:9}}>
    {info.available&&!storageErrors?<ShieldCheck color="#07865a"/>:<AlertTriangle color="#b45309"/>}
    <div><strong>{info.available&&!storageErrors?"Local storage available":"Check browser storage"}</strong><p style={{margin:"4px 0",color:"#667085",fontSize:12}}>{info.count} saved workspace entries · about {(info.bytes/1024).toFixed(1)} KiB of browser storage{updated?" · refreshed":""}</p></div>
   </div>
   <button onClick={()=>setUpdated(n=>n+1)} style={{...button,background:"#e2e8f0",color:"#172b4d"}}>Refresh status</button>
  </div>
  {storageErrors?<div role="alert" style={{...panel,background:"#fff7ed",borderColor:"#fed7aa",color:"#9a3412",fontSize:12,whiteSpace:"pre-wrap"}}>
   <strong>Some edits may not be saved</strong><p style={{margin:"8px 0"}}>{storageErrors}</p>Export a backup where possible and free browser storage or enable local site data.
  </div>:null}
  <div style={{...panel,display:"grid",gap:10}}>
   <h3 style={{margin:0,fontSize:17}}>Protect and move your work</h3>
   <p style={{fontSize:12,color:"#667085",lineHeight:1.6,margin:0}}>Export a versioned JSON backup of your organizations, logos, personnel, scanned-form structures, work-in-progress forms, meeting registers, JRA assessments and fleet records. Restore it in another browser running this demo. Original photo/PDF source blobs reside separately in this browser's IndexedDB and are NOT included in JSON backups; download original PDFs separately.</p>
   <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
    <button style={{...button,display:"inline-flex",gap:8,alignItems:"center"}} onClick={downloadBackup}><Download size={17}/> Export JSON backup</button>
    <button style={{...button,display:"inline-flex",gap:8,alignItems:"center",background:"#eaf2ff",color:"#173764"}} onClick={()=>inputRef.current?.click()}><Upload size={17}/> Import backup</button>
    <input type="file" ref={inputRef} accept=".json,application/json" style={{display:"none"}} onChange={event=>void importBackup(event.target.files?.[0])}/>
   </div>
  </div>
  <div style={{...panel,display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap"}}>
   <div><strong style={{color:"#b42318"}}>Clear this browser's demo data</strong><p style={{fontSize:12,color:"#667085",margin:"5px 0"}}>Removes all locally stored MoveTrack work, not only test scenarios. Export first.</p></div>
   <button style={{...button,background:"#fee4e2",color:"#b42318",display:"inline-flex",alignItems:"center",gap:7}} onClick={()=>void erase()}><Trash2 size={16}/> Clear workspace</button>
  </div>
  {message?<div role="status" style={{...panel,background:"#eff6ff",color:"#1d4ed8",fontSize:12}}>{message}</div>:null}
  <div style={{...panel,background:"#fffaf0"}}>
   <p style={{fontSize:12,color:"#8a5210",lineHeight:1.65,margin:0}}><Archive size={16} style={{display:"inline",verticalAlign:"middle",marginRight:5}}/> Browser data is device-specific and may disappear if site data is cleared or private-browsing ends. Do not store actual employee or safety-sensitive production records in this unauthenticated demo. Backups are unencrypted JSON files.</p>
  </div>
 </section>;
}
