"use client";
import {useState} from "react";
import type {FleetDriver} from "../../lib/move-track";
import {DesktopModal} from "./DesktopModal";
import {credentialKeys,credentialLabels,credentialDateStatus,credentialEnabled,credentialAlerts,type DriverCredentialExpiry,type DriverCredentialEvidenceLinks,type DriverCredentialKey} from "../../lib/driver-competency";

type Props={
 driver:FleetDriver;
 draft?:DriverCredentialExpiry;
 evidenceDraft?:DriverCredentialEvidenceLinks;
 adminMode:boolean;
 onChange?:(key:DriverCredentialKey,value:string)=>void;
 onEvidenceChange?:(key:DriverCredentialKey,documentId:string)=>void;
};
const tones={missing:"#b42318",expired:"#b42318",due:"#9a670a",current:"#047857"} as const;

export function DriverCompetencyPanel({driver,draft,evidenceDraft,adminMode,onChange,onEvidenceChange}:Props){
 const [open,setOpen]=useState(false);
 const alerts=credentialAlerts(driver);
 const urgent=alerts.filter(alert=>alert.state==="expired"||alert.state==="missing");
 const due=alerts.filter(alert=>alert.state==="due");
 const pending=credentialKeys.some(key=>(draft?.[key]??driver.competencyExpiry?.[key]??"")!==(driver.competencyExpiry?.[key]??"")
  ||(evidenceDraft?.[key]??driver.competencyEvidence?.[key]??"")!==(driver.competencyEvidence?.[key]??""));
 const history=driver.competencyHistory??[];
 return <section aria-label={"Competency and expiry dates for "+driver.name} style={{display:"grid",gap:8,marginTop:12,padding:11,background:"var(--mt-surface-soft,#f8fafc)",border:"1px solid #dbe4ef",borderRadius:12}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
   <div><strong style={{fontSize:12}}>Competency & certificate evidence</strong>
    <div style={{fontSize:11,marginTop:4,color:urgent.length?"#b42318":due.length?"#9a670a":"#047857"}}>
     {urgent.length?urgent.length+" missing/expired":due.length?due.length+" due within 30 days":"No recorded expiry alerts"}{pending?" · Pending review":""}
    </div>
    <small style={{display:"block",marginTop:3,color:"var(--mt-muted,#64748b)"}}>{history.length} recorded renewal/change {history.length===1?"event":"events"}</small>
   </div>
   <button type="button" style={{minHeight:44,padding:"8px 12px",border:"1px solid #9ab8da",borderRadius:9,background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#174272)",fontSize:12,fontWeight:800}} onClick={()=>setOpen(true)}>{adminMode?"Review certificates":"View records"}</button>
  </div>
  <DesktopModal title={"Competency evidence · "+driver.name} open={open} onClose={()=>setOpen(false)}>
   <div style={{display:"grid",gap:11,padding:"4px 1px"}}>
    <p style={{fontSize:12,color:"var(--mt-muted,#64748b)",margin:0}}>Red = missing or expired · Amber = due within 30 days. Select a PDF already uploaded in Admin → Driver documents. A changed expiry date requires a supporting PDF and the existing supervisor review before saving. Evidence links do not verify the issuing authority.</p>
    {credentialKeys.map(key=>{
     const enabled=credentialEnabled(driver,key);
     const saved=driver.competencyExpiry?.[key]??"";
     const value=draft?.[key]??saved;
     const savedDocumentId=driver.competencyEvidence?.[key]??"";
     const documentId=evidenceDraft?.[key]??savedDocumentId;
     const source=driver.documents?.find(doc=>doc.id===savedDocumentId);
     const currentPdf=driver.documents?.find(doc=>doc.id===documentId);
     const result=credentialDateStatus(saved);
     const changed=value!==saved||documentId!==savedDocumentId;
     const status=result.state==="current"?"Current":result.state==="due"?"Due in "+result.daysRemaining+" day"+(result.daysRemaining===1?"":"s"):result.state==="expired"?"Expired":"Date missing";
     return <div key={key} style={{display:"grid",gap:7,borderBottom:"1px solid #e2e8f0",paddingBottom:11}}>
      <div style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
       <strong style={{fontSize:12}}>{credentialLabels[key]} {!enabled?<small style={{fontWeight:400,color:"var(--mt-muted,#64748b)"}}>(not authorised)</small>:null}</strong>
       <strong style={{color:enabled?tones[result.state]:"#64748b",fontSize:11}}>{enabled?status:"Inactive"}</strong>
      </div>
      {adminMode&&onChange?<label style={{display:"grid",gap:4,fontSize:11}}>Expiry date
       <input aria-label={credentialLabels[key]+" expiry date"} type="date" value={value} onChange={e=>onChange(key,e.target.value)} style={{width:"100%",maxWidth:270,minHeight:44,border:"1px solid #cbd5e1",borderRadius:9,padding:8,font:"inherit",background:"var(--mt-surface,#fff)"}}/>
      </label>:<small style={{color:"var(--mt-muted,#64748b)"}}>Expiry: {saved||"Not recorded"}</small>}
      {adminMode&&onEvidenceChange?<label style={{display:"grid",gap:4,fontSize:11}}>Supporting certificate (PDF)
       <select aria-label={credentialLabels[key]+" supporting PDF"} value={documentId} onChange={e=>onEvidenceChange(key,e.target.value)} style={{width:"100%",maxWidth:360,minHeight:44,border:"1px solid #cbd5e1",borderRadius:9,padding:8,font:"inherit",background:"var(--mt-surface,#fff)"}}>
        <option value="">No document linked</option>
        {(driver.documents??[]).map(doc=><option key={doc.id} value={doc.id}>{doc.name}</option>)}
       </select>
      </label>:null}
      <small style={{color:source?"#047857":"#64748b"}}>Saved certificate: {source?.name??(savedDocumentId?"File no longer attached":"None linked")}</small>
      {changed?<small style={{color:"var(--mt-warning,#9a670a)",fontWeight:800}}>Pending supervisor review — saved record remains in effect{value!==saved&&value&&!documentId?". Upload and link a PDF first.":""}</small>:null}
      {!adminMode&&currentPdf&&!source?<small style={{color:"var(--mt-muted,#64748b)"}}>Current file: {currentPdf.name}</small>:null}
     </div>;
    })}
    <details style={{padding:12,border:"1px solid #dbe4ef",borderRadius:11}}>
     <summary style={{cursor:"pointer",fontSize:12,fontWeight:850,minHeight:32}}>Renewal & change history ({history.length})</summary>
     <div style={{display:"grid",gap:9,marginTop:10}}>
      {history.length?history.map(event=><article key={event.id} style={{padding:9,border:"1px solid #e2e8f0",borderRadius:8,display:"grid",gap:5,fontSize:11}}>
       <strong>{credentialLabels[event.credential]} · {new Date(event.reviewedAt).toLocaleDateString()}</strong>
       <span>Expiry: {event.previousExpiry||"Not recorded"} → {event.newExpiry||"Cleared"}</span>
       {event.previousAuthorised!==undefined?<span>Authorised: {event.previousAuthorised?"Yes":"No"} → {event.newAuthorised?"Yes":"No"}</span>:null}
       <span>Certificate: {event.documentName??(event.documentId?"Previously attached PDF":"Not linked")}</span>
       <span>Local review: {event.reviewerName}</span>
       {event.documentId&&!driver.documents?.some(doc=>doc.id===event.documentId)?<span style={{color:"var(--mt-warning,#b45309)"}}>Historical PDF reference only; attachment no longer available</span>:null}
      </article>):<small style={{color:"var(--mt-muted,#64748b)"}}>No competency renewal or authorisation changes recorded yet. Legacy dates remain available above.</small>}
     </div>
    </details>
    <small style={{color:"var(--mt-warning,#9a670a)"}}>History retains reviewed dates, document IDs and filenames but does not duplicate certificate bytes. Review signatures are local and unverified.</small>
    <button type="button" style={{justifySelf:"start",minHeight:44,padding:"8px 14px",borderRadius:9,border:"1px solid #94a3b8",background:"var(--mt-surface,#fff)"}} onClick={()=>setOpen(false)}>{adminMode?"Return to supervisor review":"Close"}</button>
   </div>
  </DesktopModal>
 </section>;
}
