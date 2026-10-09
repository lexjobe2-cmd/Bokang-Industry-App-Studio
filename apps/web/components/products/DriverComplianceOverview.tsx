"use client";
import {useMemo,useState} from "react";
import type {PersonRecord} from "@bokang/domain-data/custom-assurance";
import type {FleetAssignment,FleetDriver,FleetSitePolicy} from "../../lib/move-track";
import {buildDriverComplianceSummary,missingEvidenceLabels,type DriverComplianceRow} from "../../lib/driver-compliance";

type Filter="all"|"blocked"|"due"|"evidence"|"ready";
type Props={drivers:readonly FleetDriver[];assignments:readonly FleetAssignment[];
 directory:readonly PersonRecord[];orgId:string;sites:readonly string[];policies:readonly FleetSitePolicy[];
 onManageDriver:(id:string)=>void;};
const border="#dbe5ef";
const statuses={blocked:{label:"Criteria not met",text:"#b42318",background:"#fff1f2"},
 busy:{label:"Currently allocated / off shift",text:"#475569",background:"#f1f5f9"},
 ready:{label:"Recorded criteria met",text:"#047857",background:"#ecfdf5"}} as const;

export function DriverComplianceOverview({drivers,assignments,directory,orgId,sites,policies,onManageDriver}:Props){
 const siteOptions=[...new Set([...sites,...policies.map(policy=>policy.name)].filter(Boolean))];
 const [site,setSite]=useState(siteOptions[0]??"");
 const [filter,setFilter]=useState<Filter>("all");
 const selectedSite=siteOptions.includes(site)?site:siteOptions[0]??"";
 const summary=useMemo(()=>buildDriverComplianceSummary({drivers,assignments,directory,orgId,site:selectedSite,policies}),[drivers,assignments,directory,orgId,selectedSite,policies]);
 const rows=summary.rows.filter(row=>{
  if(filter==="blocked")return row.state==="blocked";
  if(filter==="due")return row.dueSoon.length>0||row.expired.length>0;
  if(filter==="evidence")return row.missingEvidence.length>0;
  if(filter==="ready")return row.state==="ready";
  return true;
 });
 const numbers=[
  {label:"All drivers",value:summary.counts.total},
  {label:"Recorded criteria met",value:summary.counts.ready},
  {label:"Blocked",value:summary.counts.blocked},
  {label:"Renewal due in 30 days",value:summary.counts.dueSoon},
  {label:"Missing linked evidence",value:summary.counts.missingEvidence}
 ];
 return <section aria-label="Driver competency compliance overview" style={{display:"grid",gap:15,padding:16,border:"1px solid #bed2eb",background:"#f8fbff",borderRadius:18,minWidth:0}}>
  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
   <div style={{minWidth:0}}>
    <p style={{margin:0,fontSize:11,color:"#1d4ed8",fontWeight:850,letterSpacing:1.1}}>ADMIN · DRIVER COMPLIANCE</p>
    <h3 style={{fontSize:17,margin:"5px 0"}}>Competency assurance overview</h3>
    <p style={{margin:0,fontSize:12,color:"#475569",lineHeight:1.6}}>Assessment against the selected site's recorded requirements. Certificate links are unverified references. Meeting recorded criteria does not constitute a dispatch release or permission to work.</p>
   </div>
   <label style={{display:"grid",gap:5,fontSize:12,fontWeight:800,minWidth:"min(100%,220px)"}}>Assess for site
    <select value={selectedSite} onChange={event=>setSite(event.target.value)} style={{width:"100%",minHeight:44,padding:9,border:"1px solid #a8bfdc",borderRadius:10,background:"#fff",font:"inherit"}}>
     {siteOptions.length?siteOptions.map(option=><option value={option} key={option}>{option}</option>):<option value="">Company baseline</option>}
    </select>
   </label>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,145px),1fr))",gap:9}}>
   {numbers.map(metric=><div key={metric.label} style={{padding:12,background:"#fff",border:"1px solid "+border,borderRadius:12,minWidth:0}}>
    <div style={{fontSize:11,fontWeight:750,color:"#475569"}}>{metric.label}</div>
    <strong style={{fontSize:24,color:metric.label==="Blocked"&&metric.value?"#b42318":"#13253c"}}>{metric.value}</strong>
   </div>)}
  </div>
  <div style={{display:"flex",gap:10,alignItems:"end",justifyContent:"space-between",flexWrap:"wrap"}}>
   <label style={{display:"grid",gap:5,fontSize:12,fontWeight:800}}>Show driver records
    <select aria-label="Filter driver compliance records" value={filter} onChange={event=>setFilter(event.target.value as Filter)} style={{minHeight:44,maxWidth:"100%",border:"1px solid #a8bfdc",borderRadius:10,background:"#fff",padding:10,font:"inherit"}}>
     <option value="all">All drivers</option>
     <option value="blocked">Not meeting criteria</option>
     <option value="due">Due soon or expired</option>
     <option value="evidence">Missing supporting PDF link</option>
     <option value="ready">Recorded criteria met</option>
    </select>
   </label>
   <span role="status" style={{fontSize:12,color:"#475569"}}>{rows.length} of {summary.counts.total} drivers shown</span>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,310px),1fr))",gap:10}}>
   {rows.map((row:DriverComplianceRow)=>{
    const status=statuses[row.state];
    return <article key={row.id} style={{display:"grid",gap:9,alignContent:"start",padding:13,border:"1px solid "+border,borderRadius:12,background:"#fff",minWidth:0}}>
     <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap"}}>
      <strong style={{fontSize:14,overflowWrap:"anywhere"}}>{row.name}</strong>
      <span style={{background:status.background,color:status.text,fontSize:11,padding:"5px 8px",borderRadius:8,fontWeight:850}}>{status.label}</span>
     </div>
     <small style={{color:"#64748b"}}>Driver status: {row.driverStatus}{row.activeAssignmentCount?" · "+row.activeAssignmentCount+" active assignment(s)":""}</small>
     {row.blockingReasons.length?<div style={{fontSize:12,color:"#b42318",display:"grid",gap:4}}><strong>Requirements to resolve</strong>
      {row.blockingReasons.map(reason=><span key={reason}>• {reason}</span>)}
     </div>:null}
     {row.dueSoon.length?<div style={{fontSize:12,color:"#9a670a",display:"grid",gap:3}}><strong>Renewal due</strong>
      {row.dueSoon.map(alert=><span key={alert.key}>• {alert.label} — {alert.daysRemaining} day(s)</span>)}
     </div>:null}
     {row.missingEvidence.length?<div style={{fontSize:12,color:"#92400e",display:"grid",gap:3}}><strong>Unlinked supporting evidence ({row.missingEvidence.length})</strong>
      {missingEvidenceLabels(row).map(label=><span key={label}>• {label}</span>)}
     </div>:<small style={{fontSize:11,color:"#047857"}}>Each recorded active competency has a linked PDF reference (not independently verified).</small>}
     <button type="button" onClick={()=>onManageDriver(row.id)} style={{marginTop:4,minHeight:44,justifySelf:"start",padding:"8px 12px",border:"1px solid #b4cde9",borderRadius:10,background:"#fff",color:"#1d4ed8",fontWeight:850,cursor:"pointer"}}>Manage driver record →</button>
    </article>;
   })}
   {!rows.length?<p style={{fontSize:12,color:"#64748b"}}>{summary.counts.total?"No drivers match this filter.":"No drivers onboarded yet. Use Admin → Drivers to add them."}</p>:null}
  </div>
  <small style={{color:"#64748b",fontSize:11}}>Read-only calculation from browser-local driver, workforce and assignment records. Counts reflect the records currently saved on this device and are recalculated on opening this view. No external certificate verification or automated notifications are active.</small>
 </section>;
}
