"use client";
import type {FleetDriver} from "../../lib/move-track";
import {credentialKeys,credentialLabels,credentialDateStatus,type DriverCredentialExpiry,type DriverCredentialKey} from "../../lib/driver-competency";

type Props={driver:FleetDriver;draft?:DriverCredentialExpiry;adminMode:boolean;onChange?:(key:DriverCredentialKey,value:string)=>void};
const tones={missing:"#b42318",expired:"#b42318",due:"#9a670a",current:"#047857"} as const;
export function DriverCompetencyPanel({driver,draft,adminMode,onChange}:Props){
 return <section aria-label={"Competency and expiry dates for "+driver.name} style={{display:"grid",gap:10,marginTop:12,padding:11,background:"#f8fafc",border:"1px solid #dbe4ef",borderRadius:12}}>
  <div><strong style={{fontSize:12}}>Competency and expiry reminders</strong><p style={{fontSize:11,color:"#64748b",margin:"4px 0 0"}}>Red = expired/missing · Amber = due within 30 days · Green = recorded and current. Missing evidence blocks dispatch where required.</p></div>
  {credentialKeys.map(key=>{
   const enabled=key==="licence"||Boolean(driver[key]);
   const saved=driver.competencyExpiry?.[key]??"";
   const value=draft?.[key]??saved;
   const result=credentialDateStatus(saved);
   const pending=draft!==undefined&&(draft[key]??"")!==saved;
   const text=result.state==="current"?"Current":result.state==="due"?"Due in "+result.daysRemaining+" day"+(result.daysRemaining===1?"":"s"):result.state==="expired"?"Expired":"Date missing";
   return <div key={key} style={{display:"grid",gap:6,borderBottom:"1px solid #e2e8f0",paddingBottom:9}}>
    <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
     <span style={{fontSize:12,fontWeight:800}}>{credentialLabels[key]} {!enabled&&key!=="licence"?<small style={{color:"#64748b",fontWeight:400}}>(not authorised)</small>:null}</span>
     <strong style={{color:enabled?tones[result.state]:"#64748b",fontSize:11}}>{enabled?text:"Inactive"}</strong>
    </div>
    {adminMode&&onChange?<label style={{display:"grid",gap:4,fontSize:11}}>Expiry date
      <input aria-label={credentialLabels[key]+" expiry date"} type="date" value={value} onChange={e=>onChange(key,e.target.value)} style={{width:"100%",maxWidth:240,minHeight:44,border:"1px solid #cbd5e1",borderRadius:9,padding:8,font:"inherit",background:"#fff"}}/>
     </label>:<small style={{color:"#64748b"}}>{saved||"Not recorded"}</small>}
    {pending?<small style={{color:"#9a670a",fontWeight:800}}>Pending supervisor review — current saved date remains in effect</small>:null}
   </div>;
  })}
  {adminMode?<small style={{color:"#9a670a"}}>Dates and authorisation flags are applied only after the existing local supervisor signature. Uploaded PDFs are references, not verified certificates.</small>:null}
 </section>;
}
