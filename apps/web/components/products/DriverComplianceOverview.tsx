"use client";
import {useMemo,useState} from "react";
import {DesktopModal} from "./DesktopModal";
import {buildSupervisorRenewalActions,complianceExportFilename,driverComplianceCsv,supervisorActionsCsv,type SupervisorActionPriority} from "../../lib/driver-compliance-export";
import type {PersonRecord} from "@bokang/domain-data/custom-assurance";
import type {FleetAssignment,FleetDriver,FleetSitePolicy} from "../../lib/move-track";
import {buildDriverComplianceSummary,missingEvidenceLabels,type DriverComplianceRow} from "../../lib/driver-compliance";
import {credentialLabels} from "../../lib/driver-competency";

type Filter="all"|"blocked"|"due"|"evidence"|"ready";
type Props={drivers:readonly FleetDriver[];assignments:readonly FleetAssignment[];
 directory:readonly PersonRecord[];orgId:string;sites:readonly string[];policies:readonly FleetSitePolicy[];
 onManageDriver:(id:string)=>void;};
const border="var(--mt-border,#dbe5ef)";
function downloadCsv(content:string,filename:string){
 const objectUrl=URL.createObjectURL(new Blob([content],{type:"text/csv;charset=utf-8"}));
 try{
  const anchor=document.createElement("a");
  anchor.href=objectUrl;anchor.download=filename;
  document.body.appendChild(anchor);anchor.click();anchor.remove();
 }finally{
  window.setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);
 }
}
const statuses={blocked:{label:"Criteria not met",text:"var(--mt-danger,#a51d2d)",background:"var(--mt-danger-bg,#fef3f2)"},
 busy:{label:"Currently allocated / off shift",text:"var(--mt-muted,#516078)",background:"var(--mt-surface-soft,#f1f5f9)"},
 ready:{label:"Recorded criteria met",text:"var(--mt-success,#087454)",background:"var(--mt-success-bg,#ecfdf3)"}} as const;

export function DriverComplianceOverview({drivers,assignments,directory,orgId,sites,policies,onManageDriver}:Props){
 const siteOptions=[...new Set([...sites,...policies.map(policy=>policy.name)].filter(Boolean))];
 const [site,setSite]=useState(siteOptions[0]??"");
 const [filter,setFilter]=useState<Filter>("all");
 const [query,setQuery]=useState("");
 const [actionsOpen,setActionsOpen]=useState(false);
 const [exportError,setExportError]=useState("");
 const [page,setPage]=useState(1);
 const [actionFilter,setActionFilter]=useState<SupervisorActionPriority|"all">("all");
 const [actionPage,setActionPage]=useState(1);
 const selectedSite=siteOptions.includes(site)?site:siteOptions[0]??"";
 const summary=useMemo(()=>buildDriverComplianceSummary({drivers,assignments,directory,orgId,site:selectedSite,policies}),[drivers,assignments,directory,orgId,selectedSite,policies]);
 const supervisorActions=useMemo(()=>buildSupervisorRenewalActions({summary,drivers,policies}),[summary,drivers,policies]);
 function exportReport(kind:"driver-competency"|"supervisor-renewals"){
  try{
   const now=new Date();
   // Capture a current, unfiltered site snapshot at the actual time of export.
   const current=buildDriverComplianceSummary({drivers,assignments,directory,orgId,site:selectedSite,policies,now});
   const data=kind==="driver-competency"
    ?driverComplianceCsv(current,drivers,now)
    :supervisorActionsCsv(buildSupervisorRenewalActions({summary:current,drivers,policies,now}),now);
   downloadCsv(data,complianceExportFilename(selectedSite,kind,now));
   setExportError("");
  }catch{
   setExportError("The export could not be started. Check browser download permissions and try again.");
  }
 }
 const filteredActions=actionFilter==="all"?supervisorActions:supervisorActions.filter(action=>action.priority===actionFilter);
 const actionPages=Math.max(1,Math.ceil(filteredActions.length/10));
 const currentActionPage=Math.min(actionPage,actionPages);
 const visibleActions=filteredActions.slice((currentActionPage-1)*10,currentActionPage*10);
 const rows=summary.rows.filter(row=>{
  if(query.trim()&&!([row.id,row.name,row.driverStatus,...row.blockingReasons].join(" ").toLowerCase().includes(query.trim().toLowerCase())))return false;
  if(filter==="blocked")return row.state==="blocked";
  if(filter==="due")return row.dueSoon.length>0||row.expired.length>0;
  if(filter==="evidence")return row.missingEvidence.length>0;
  if(filter==="ready")return row.state==="ready";
  return true;
 });
 const perPage=12;
 const pages=Math.max(1,Math.ceil(rows.length/perPage));
 const activePage=Math.min(page,pages);
 const visibleRows=rows.slice((activePage-1)*perPage,activePage*perPage);
 const numbers=[
  {label:"All drivers",value:summary.counts.total},
  {label:"Recorded criteria met",value:summary.counts.ready},
  {label:"Already allocated / off shift",value:summary.counts.busy},
  {label:"Blocked",value:summary.counts.blocked},
  {label:"Renewal due in 30 days",value:summary.counts.dueSoon},
  {label:"Missing linked evidence",value:summary.counts.missingEvidence}
 ];
 return <section aria-label="Driver competency compliance overview" style={{display:"grid",gap:15,padding:16,border:"1px solid var(--mt-border,#bed2eb)",background:"var(--mt-surface-soft,#f8fbff)",borderRadius:18,minWidth:0}}>
  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
   <div style={{minWidth:0}}>
    <p style={{margin:0,fontSize:11,color:"var(--mt-link,#1d4ed8)",fontWeight:850,letterSpacing:1.1}}>ADMIN · DRIVER COMPLIANCE</p>
    <h3 style={{fontSize:17,margin:"5px 0"}}>Competency assurance overview</h3>
    <p style={{margin:0,fontSize:12,color:"var(--mt-muted,#475569)",lineHeight:1.6}}>Assessment against the selected site's recorded requirements. Certificate links are unverified references. Meeting recorded criteria does not constitute a dispatch release or permission to work.</p>
   </div>
   <label style={{display:"grid",gap:5,fontSize:12,fontWeight:800,minWidth:"min(100%,220px)"}}>Assess for site
    <select value={selectedSite} onChange={event=>{setSite(event.target.value);setPage(1);setActionPage(1);}} style={{width:"100%",minHeight:44,padding:9,border:"1px solid var(--mt-border,#a8bfdc)",borderRadius:10,background:"var(--mt-surface,#fff)",font:"inherit"}}>
     {siteOptions.length?siteOptions.map(option=><option value={option} key={option}>{option}</option>):<option value="">Company baseline</option>}
    </select>
   </label>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,145px),1fr))",gap:9}}>
   {numbers.map(metric=><div key={metric.label} style={{padding:12,background:"var(--mt-surface,#fff)",border:"1px solid "+border,borderRadius:12,minWidth:0}}>
    <div style={{fontSize:11,fontWeight:750,color:"var(--mt-muted,#475569)"}}>{metric.label}</div>
    <strong style={{fontSize:24,color:metric.label==="Blocked"&&metric.value?"var(--mt-danger,#b42318)":"var(--mt-ink,#13253c)"}}>{metric.value}</strong>
   </div>)}
  </div>
  <div aria-label="Admin competency reporting" style={{display:"grid",gap:10,padding:12,border:"1px solid "+border,borderRadius:12,background:"var(--mt-surface,#fff)"}}>
   <strong style={{fontSize:13}}>Reports & supervisor renewal actions</strong>
   <p style={{fontSize:12,margin:0,color:"var(--mt-muted,#475569)"}}>Download all drivers for the selected site, not just the current search, filter or page. Reports contain local employee names and competency details; store them only in authorized company systems.</p>
   <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
    <button type="button" onClick={()=>exportReport("driver-competency")} style={{minHeight:44,padding:"9px 12px",background:"#1d4ed8",color:"#fff",fontWeight:850,border:0,borderRadius:10,cursor:"pointer"}}>Download competency CSV</button>
    <button type="button" onClick={()=>exportReport("supervisor-renewals")} style={{minHeight:44,padding:"9px 12px",background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#174272)",fontWeight:850,border:"1px solid var(--mt-border,#a8bfdc)",borderRadius:10,cursor:"pointer"}}>Download renewal actions CSV</button>
    <button type="button" onClick={()=>setActionsOpen(true)} style={{minHeight:44,padding:"9px 12px",background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#174272)",fontWeight:850,border:"1px solid var(--mt-border,#a8bfdc)",borderRadius:10,cursor:"pointer"}}>View supervisor action list ({supervisorActions.length})</button>
   </div>
   {exportError?<p role="alert" style={{color:"var(--mt-danger,#b42318)",fontSize:12,margin:0}}>{exportError}</p>:null}
  </div>
  <DesktopModal title={"Supervisor renewal actions · "+(selectedSite||"Company")} open={actionsOpen} onClose={()=>setActionsOpen(false)}>
   <div aria-label="Supervisor renewal action list" style={{display:"grid",gap:12}}>
    <p style={{fontSize:12,color:"var(--mt-muted,#475569)",margin:0,lineHeight:1.6}}>Supervisor follow-ups based on the selected site's requirements, recorded credentials and PDF links. Immediate actions require resolution before dispatch. Other items are reminders, not approvals. No notifications are sent.</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:10,fontSize:12}}>
     <strong style={{color:"var(--mt-danger,#b42318)"}}>{supervisorActions.filter(a=>a.priority==="Immediate").length} immediate</strong>
     <strong style={{color:"var(--mt-warning,#9a670a)"}}>{supervisorActions.filter(a=>a.priority==="Due within 30 days").length} due soon</strong>
     <strong style={{color:"var(--mt-muted,#475569)"}}>{supervisorActions.filter(a=>a.priority==="Evidence review").length} evidence links</strong>
     <strong style={{color:"var(--mt-muted,#475569)"}}>{supervisorActions.filter(a=>a.priority==="Record review").length} record review</strong>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",flexWrap:"wrap",gap:10}}>
     <label style={{display:"grid",gap:5,fontSize:12,fontWeight:800}}>Action priority
      <select aria-label="Filter supervisor action priorities" value={actionFilter} onChange={event=>{setActionFilter(event.target.value as SupervisorActionPriority|"all");setActionPage(1);}} style={{minHeight:44,border:"1px solid var(--mt-border,#cbd5e1)",borderRadius:9,padding:9,background:"var(--mt-surface,#fff)"}}>
       <option value="all">All follow-ups</option>
       <option value="Immediate">Before dispatch</option>
       <option value="Due within 30 days">Renew within 30 days</option>
       <option value="Evidence review">Attach evidence</option>
       <option value="Record review">Review optional record</option>
      </select>
     </label>
     <span role="status" style={{fontSize:12,color:"var(--mt-muted,#475569)"}}>{filteredActions.length} of {supervisorActions.length} actions</span>
    </div>
    <div style={{display:"grid",gap:9}}>
     {visibleActions.map((action,index)=><article key={action.driverId+":"+action.credential+":"+action.issue+":"+index} style={{display:"grid",gap:7,background:"var(--mt-surface,#fff)",border:"1px solid "+border,borderRadius:11,padding:12,fontSize:12}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
       <strong>{action.driverName} · {action.issue==="Inactive or missing workforce identity"?"Workforce identity":credentialLabels[action.credential]}</strong>
       <strong style={{color:action.priority==="Immediate"?"var(--mt-danger,#b42318)":action.priority==="Due within 30 days"?"var(--mt-warning,#9a670a)":"var(--mt-muted,#475569)"}}>{action.priority}</strong>
      </div>
      <span>{action.issue}{action.expiry?" · "+action.expiry:""}</span>
      <span style={{color:"var(--mt-muted,#475569)"}}>{action.action}</span>
      <button type="button" style={{minHeight:44,justifySelf:"start",border:"1px solid var(--mt-border,#b4cde9)",borderRadius:9,background:"var(--mt-surface,#fff)",padding:"8px 11px",color:"var(--mt-link,#1d4ed8)",fontWeight:850}} onClick={()=>{setActionsOpen(false);onManageDriver(action.driverId);}}>Manage driver's record →</button>
     </article>)}
     {!filteredActions.length?<p style={{fontSize:12,color:"var(--mt-success,#047857)"}}>No action items match this priority for the selected site.</p>:null}
    </div>
    {actionPages>1?<div aria-label="Supervisor action pages" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:9}}>
     <button type="button" disabled={currentActionPage<=1} onClick={()=>setActionPage(p=>Math.max(1,p-1))} style={{minHeight:44,padding:"8px 12px",border:"1px solid var(--mt-border,#cbd5e1)",borderRadius:9,background:"var(--mt-surface,#fff)"}}>← Previous</button>
     <small>Page {currentActionPage} of {actionPages}</small>
     <button type="button" disabled={currentActionPage>=actionPages} onClick={()=>setActionPage(p=>Math.min(actionPages,p+1))} style={{minHeight:44,padding:"8px 12px",border:"1px solid var(--mt-border,#cbd5e1)",borderRadius:9,background:"var(--mt-surface,#fff)"}}>Next →</button>
    </div>:null}
    <button type="button" onClick={()=>setActionsOpen(false)} style={{minHeight:44,justifySelf:"start",padding:"8px 14px",border:"1px solid var(--mt-border,#94a3b8)",borderRadius:9,background:"var(--mt-surface,#fff)"}}>Close action list</button>
   </div>
  </DesktopModal>
  <div style={{display:"flex",gap:10,alignItems:"end",justifyContent:"space-between",flexWrap:"wrap"}}>
   <label style={{display:"grid",gap:5,fontSize:12,fontWeight:800}}>Show driver records
    <select aria-label="Filter driver compliance records" value={filter} onChange={event=>{setFilter(event.target.value as Filter);setPage(1);}} style={{minHeight:44,maxWidth:"100%",border:"1px solid var(--mt-border,#a8bfdc)",borderRadius:10,background:"var(--mt-surface,#fff)",padding:10,font:"inherit"}}>
     <option value="all">All drivers</option>
     <option value="blocked">Not meeting criteria</option>
     <option value="due">Due soon or expired</option>
     <option value="evidence">Missing supporting PDF link</option>
     <option value="ready">Recorded criteria met</option>
    </select>
   </label>
   <label style={{display:"grid",gap:5,fontSize:12,fontWeight:800}}>Search drivers
    <input type="search" value={query} aria-label="Find driver in compliance overview" placeholder="Name or driver ID" onChange={event=>{setQuery(event.target.value);setPage(1);}} style={{minHeight:44,maxWidth:"100%",padding:10,border:"1px solid var(--mt-border,#a8bfdc)",borderRadius:10,background:"var(--mt-surface,#fff)",font:"inherit"}}/>
   </label>
   <span role="status" style={{fontSize:12,color:"var(--mt-muted,#475569)"}}>{rows.length} matching of {summary.counts.total} drivers</span>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,310px),1fr))",gap:10}}>
   {visibleRows.map((row:DriverComplianceRow)=>{
    const status=statuses[row.state];
    return <article key={row.id} style={{display:"grid",gap:9,alignContent:"start",padding:13,border:"1px solid "+border,borderRadius:12,background:"var(--mt-surface,#fff)",minWidth:0}}>
     <div style={{display:"flex",gap:10,justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap"}}>
      <strong style={{fontSize:14,overflowWrap:"anywhere"}}>{row.name}</strong>
      <span style={{background:status.background,color:status.text,fontSize:11,padding:"5px 8px",borderRadius:8,fontWeight:850}}>{status.label}</span>
     </div>
     <small style={{color:"var(--mt-muted,#64748b)"}}>Driver status: {row.driverStatus}{row.activeAssignmentCount?" · "+row.activeAssignmentCount+" active assignment(s)":""}</small>
     {row.blockingReasons.length?<div style={{fontSize:12,color:"var(--mt-danger,#b42318)",display:"grid",gap:4}}><strong>Requirements to resolve</strong>
      {row.blockingReasons.map(reason=><span key={reason}>• {reason}</span>)}
     </div>:null}
     {row.dueSoon.length?<div style={{fontSize:12,color:"var(--mt-warning,#9a670a)",display:"grid",gap:3}}><strong>Renewal due</strong>
      {row.dueSoon.map(alert=><span key={alert.key}>• {alert.label} — {alert.daysRemaining} day(s)</span>)}
     </div>:null}
     {row.missingEvidence.length?<div style={{fontSize:12,color:"var(--mt-danger,#92400e)",display:"grid",gap:3}}><strong>Unlinked supporting evidence ({row.missingEvidence.length})</strong>
      {missingEvidenceLabels(row).map(label=><span key={label}>• {label}</span>)}
     </div>:<small style={{fontSize:11,color:"var(--mt-success,#047857)"}}>Each recorded active competency has a linked PDF reference (not independently verified).</small>}
     <button type="button" onClick={()=>onManageDriver(row.id)} style={{marginTop:4,minHeight:44,justifySelf:"start",padding:"8px 12px",border:"1px solid var(--mt-border,#b4cde9)",borderRadius:10,background:"var(--mt-surface,#fff)",color:"var(--mt-link,#1d4ed8)",fontWeight:850,cursor:"pointer"}}>Manage driver record →</button>
    </article>;
   })}
   {!rows.length?<p style={{fontSize:12,color:"var(--mt-muted,#64748b)"}}>{summary.counts.total?"No drivers match this filter.":"No drivers onboarded yet. Use Admin → Drivers to add them."}</p>:null}
  </div>
  {pages>1?<div aria-label="Compliance result pages" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
   <button type="button" disabled={activePage<=1} onClick={()=>setPage(current=>Math.max(1,current-1))} style={{minHeight:44,border:"1px solid var(--mt-border,#a8bfdc)",borderRadius:9,background:"var(--mt-surface,#fff)",padding:"8px 12px",fontWeight:800}}>← Previous</button>
   <span style={{fontSize:12,color:"var(--mt-muted,#475569)"}}>Page {activePage} of {pages}</span>
   <button type="button" disabled={activePage>=pages} onClick={()=>setPage(current=>Math.min(pages,current+1))} style={{minHeight:44,border:"1px solid var(--mt-border,#a8bfdc)",borderRadius:9,background:"var(--mt-surface,#fff)",padding:"8px 12px",fontWeight:800}}>Next →</button>
  </div>:null}
  <small style={{color:"var(--mt-muted,#64748b)",fontSize:11}}>Read-only calculation from browser-local driver, workforce and assignment records. Counts reflect the records currently saved on this device and are recalculated on opening this view. No external certificate verification or automated notifications are active.</small>
 </section>;
}
