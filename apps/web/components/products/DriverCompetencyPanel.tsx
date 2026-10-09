"use client";
import {useState} from "react";
import type {FleetDriver} from "../../lib/move-track";
import {DesktopModal} from "./DesktopModal";
import {credentialKeys,credentialLabels,credentialDateStatus,credentialEnabled,credentialAlerts,type DriverCredentialExpiry,type DriverCredentialKey} from "../../lib/driver-competency";

type Props={driver:FleetDriver;draft?:DriverCredentialExpiry;adminMode:boolean;onChange?:(key:DriverCredentialKey,value:string)=>void};
const tones={missing:"#b42318",expired:"#b42318",due:"#9a670a",current:"#047857"} as const;
export function DriverCompetencyPanel({driver,draft,adminMode,onChange}:Props){
 const [open,setOpen]=useState(false);
 const alerts=credentialAlerts(driver);
 const urgent=alerts.filter(alert=>alert.state==="expired"||alert.state==="missing");
 const due=alerts.filter(alert=>alert.state==="due");
 const pending=draft!==undefined&&credentialKeys.some(key=>(draft[key]??"")!==(driver.competencyExpiry?.[key]??""));
 return <section aria-label={"Competency and expiry dates for "+driver.name} style={{display:"grid",gap:8,marginTop:12,padding:11,background:"#f8fafc",border:"1px solid #dbe4ef",borderRadius:12}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
   <div><strong style={{fontSize:12}}>Competency & expiry dates</strong><div style={{fontSize:11,marginTop:4,color:urgent.length?"#b42318":due.length?"#9a670a":"#047857"}}>
    {urgent.length?urgent.length+" missing/expired":due.length?due.length+" due within 30 days":"No recorded expiry alerts"}{pending?" · Pending supervisor review":""}
   </div></div>
   <button type="button" style={{minHeight:44,padding:"8px 12px",border:"1px solid #9ab8da",borderRadius:9,background:"#fff",color:"#174272",fontSize:12,fontWeight:800}} onClick={()=>setOpen(true)}>{adminMode?"Review dates":"View dates"}</button>
  </div>
  <DesktopModal title={"Competency dates · "+driver.name} open={open} onClose={()=>setOpen(false)}>
   <div style={{display:"grid",gap:11,padding:"4px 1px"}}>
    <p style={{fontSize:12,color:"#64748b",margin:0}}>Red = expired or missing · Amber = due in 30 days · Green = recorded and current. Missing/expired required records block dispatch. {adminMode?"Stage changes here, close this panel, then capture the supervisor review on the driver card.":""}</p>
    {credentialKeys.map(key=>{
     const enabled=credentialEnabled(driver,key);
     const saved=driver.competencyExpiry?.[key]??"";
     const value=draft?.[key]??saved;
     const result=credentialDateStatus(saved);
     const changed=draft!==undefined&&(draft[key]??"")!==saved;
     const status=result.state==="current"?"Current":result.state==="due"?"Due in "+result.daysRemaining+" day"+(result.daysRemaining===1?"":"s"):result.state==="expired"?"Expired":"Date missing";
     return <div key={key} style={{display:"grid",gap:6,borderBottom:"1px solid #e2e8f0",paddingBottom:10}}>
      <div style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
       <span style={{fontSize:12,fontWeight:800}}>{credentialLabels[key]} {!enabled?<small style={{color:"#64748b",fontWeight:400}}>(not authorised)</small>:null}</span>
       <strong style={{color:enabled?tones[result.state]:"#64748b",fontSize:11}}>{enabled?status:"Inactive"}</strong>
      </div>
      {adminMode&&onChange?<label style={{display:"grid",gap:4,fontSize:11}}>Expiry date
       <input aria-label={credentialLabels[key]+" expiry date"} type="date" value={value} onChange={e=>onChange(key,e.target.value)} style={{width:"100%",maxWidth:270,minHeight:44,border:"1px solid #cbd5e1",borderRadius:9,padding:8,font:"inherit",background:"#fff"}}/>
      </label>:<small style={{color:"#64748b"}}>{saved||"Not recorded"}</small>}
      {changed?<small style={{color:"#9a670a",fontWeight:800}}>Pending supervisor review — saved expiry date remains in effect</small>:null}
     </div>;
    })}
    {adminMode?<small style={{color:"#9a670a"}}>Dates and authorisation flags take effect only after the existing local supervisor signature. Uploaded PDFs are references, not verified certificates.</small>:null}
    <button type="button" style={{justifySelf:"start",minHeight:44,padding:"8px 14px",borderRadius:9,border:"1px solid #94a3b8",background:"#fff"}} onClick={()=>setOpen(false)}>{adminMode?"Return to supervisor review":"Close"}</button>
   </div>
  </DesktopModal>
 </section>;
}
