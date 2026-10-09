"use client";
import {DesktopModal} from "./DesktopModal";
import {useState} from "react";
import {FileSpreadsheet,UsersRound,Download,Upload,ChevronDown,CheckCircle2,AlertTriangle} from "lucide-react";
import type {OrganizationProfile,PersonRecord} from "@bokang/domain-data/custom-assurance";
import {parseOrganizationDirectoryCsv,mergeOrganizationDirectory,type DirectoryCsvResult} from "@bokang/domain-data/organization-directory";

const btn:React.CSSProperties={background:"#fff",border:"1px solid #bfd1e8",borderRadius:10,minHeight:43,padding:"9px 13px",fontSize:12,fontWeight:800,color:"#174272",cursor:"pointer"};
const sample=[
 ["DisplayName","Mail","UserPrincipalName","Department","JobTitle","City","OfficeLocation","EmployeeId","AccountEnabled"],
 ["Boitumelo Demo","boitumelo@sample.invalid","boitumelo@sample.invalid","Engineering","Shift Supervisor","Gaborone","Workshop","STAFF-001","true"],
 ["Naledi Example","naledi@sample.invalid","naledi@sample.invalid","SHE","Safety Officer","Jwaneng","Mine","STAFF-002","true"]
];
export function CompanyDirectoryImport({org,people,setPeople}:{
 org:OrganizationProfile;people:readonly PersonRecord[];setPeople:React.Dispatch<React.SetStateAction<PersonRecord[]>>;
}){
 const [open,setOpen]=useState(false);
 const [result,setResult]=useState<DirectoryCsvResult|null>(null);
 const [error,setError]=useState("");
 const [sourceName,setSourceName]=useState("");
 const [notice,setNotice]=useState("");
 const count=people.filter(p=>p.orgId===org.id&&p.active).length;
 async function read(file:File|undefined){
  setResult(null);setError("");setNotice("");
  if(!file)return;
  if(file.size>2_000_000){setError("CSV must be under 2 MB.");return;}
  try{
   const parsed=parseOrganizationDirectoryCsv(await file.text(),org.id,people);
   setResult(parsed);setSourceName(file.name);
  }catch(e){setError(e instanceof Error?e.message:"Could not parse organization CSV");}
 }
 function save(){
  if(!result?.records.length)return;
  if(!window.confirm("Import "+result.records.length+" people into "+org.name+" on this browser? This is local data, not a Microsoft tenant connection."))return;
  setPeople(prev=>mergeOrganizationDirectory(prev,org.id,result.records));
  setNotice(result.records.length+" directory records imported/updated. Search for them in meeting, form and JRA pickers.");
  setResult(null);
 }
 function downloadTemplate(){
  const content="\uFEFF"+sample.map(row=>row.map(v=>'"'+v.replaceAll('"','""')+'"').join(",")).join("\r\n");
  const blob=new Blob([content],{type:"text/csv;charset=utf-8"});
  const href=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=href;a.download="movetrack-directory-template.csv";document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(href),1000);
 }
 return <section aria-label="Company directory import" style={{border:"1px solid #d4e2ef",borderRadius:15,background:"#fff",padding:13,display:"grid",gap:9}}>
  <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
   <div style={{display:"flex",gap:10,alignItems:"center"}}>
    <span style={{background:"#eaf3ff",color:"#1d4ed8",padding:9,borderRadius:12}}><UsersRound size={22}/></span>
    <div><strong style={{fontSize:14}}>Organization people directory</strong><div style={{color:"#64748b",fontSize:11,marginTop:3}}>{count} active local people · departments, cities, email and UPN</div></div>
   </div>
   <button type="button" aria-expanded={open} onClick={()=>setOpen(v=>!v)} style={{...btn,display:"flex",gap:6,alignItems:"center"}}>Import staff directory <ChevronDown size={16}/></button>
  </div>
  <DesktopModal title="Import staff directory" open={open} onClose={()=>setOpen(false)}><div style={{borderTop:"1px solid #e2e8f0",paddingTop:12,display:"grid",gap:11}}>
   <p style={{fontSize:12,color:"#475569",margin:0,lineHeight:1.6}}>Bring a company-authorized employee CSV and immediately make staff searchable in all participant, chairperson, supervisor and responsible-person pickers. Column names such as <strong>DisplayName, Mail, UserPrincipalName, Department, JobTitle, City, OfficeLocation and EmployeeId</strong> are recognized.</p>
   <p style={{fontSize:11,color:"#a16207",margin:0}}>No Microsoft 365 sign-in or synchronization is active. Do not import confidential employee information into this public demo; browser storage is not enterprise-secured.</p>
   <div style={{display:"flex",gap:9,flexWrap:"wrap",alignItems:"center"}}>
    <button type="button" onClick={downloadTemplate} style={{...btn,display:"flex",alignItems:"center",gap:6}}><Download size={16}/> Download CSV template</button>
    <label style={{...btn,display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}><Upload size={16}/> Choose CSV file<input type="file" accept=".csv,text/csv" style={{display:"none"}} onChange={e=>void read(e.target.files?.[0])}/></label>
   </div>
   {error?<div role="alert" style={{fontSize:12,color:"#b42318"}}><AlertTriangle size={16} style={{display:"inline"}}/> {error}</div>:null}
   {result?<div style={{padding:12,borderRadius:12,background:"#f0f6ff",display:"grid",gap:8}}>
    <strong style={{fontSize:13}}>Preview — {sourceName}</strong>
    <p style={{fontSize:12,margin:0}}>{result.records.length} people ready · {result.duplicates} duplicate rows ignored · {result.warnings.length} warnings</p>
    {result.records.slice(0,5).map(p=><div key={p.id} style={{fontSize:11,color:"#475569"}}>{p.displayName} · {p.department||"No department"} · {p.city||p.location||"No city"} · {p.email||p.userPrincipalName||"No email"}</div>)}
    {result.warnings.slice(0,4).map((w,i)=><small key={i} style={{color:"#9a670a"}}>{w}</small>)}
    <button type="button" style={{...btn,background:"#174fa8",color:"#fff",justifySelf:"start",borderColor:"#174fa8"}} onClick={save}>Confirm import of {result.records.length} people</button>
   </div>:null}
   {notice?<div role="status" style={{display:"flex",gap:7,color:"#047857",fontSize:12,alignItems:"center"}}><CheckCircle2 size={16}/>{notice}</div>:null}
  </div></DesktopModal>
 </section>;
}
