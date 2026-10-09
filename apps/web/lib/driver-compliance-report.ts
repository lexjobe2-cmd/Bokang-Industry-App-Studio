import type {FleetDriver,FleetSitePolicy} from "./move-track";
import {credentialDateStatus,credentialEnabled,credentialKeys,credentialLabels,type DriverCredentialKey} from "./driver-competency.ts";
import {siteCredentialRequirements,type DriverComplianceSummary} from "./driver-compliance.ts";

export type SupervisorPriority="stop"|"renew"|"evidence"|"review";
export type SupervisorRenewalAction={
 id:string;driverId:string;driverName:string;site:string;
 credential:DriverCredentialKey|"workforce";
 priority:SupervisorPriority;issue:string;dueDate:string;nextStep:string;
};
export const supervisorPriorityLabels:Record<SupervisorPriority,string>={
 stop:"Before dispatch",renew:"Renew within 30 days",evidence:"Attach evidence",review:"Review record"
};
const priorityOrder:Record<SupervisorPriority,number>={stop:0,renew:1,evidence:2,review:3};

export function buildSupervisorRenewalActions(
 summary:DriverComplianceSummary,drivers:readonly FleetDriver[],policies:readonly FleetSitePolicy[],now:Date=new Date()
):SupervisorRenewalAction[]{
 const requirements=siteCredentialRequirements(summary.site,policies);
 const required=new Set<DriverCredentialKey>(["licence","siteAuthorisation"]);
 if(requirements.requireOpenPitPermit)required.add("openPitPermit");
 if(requirements.requireFirstAid)required.add("firstAid");
 if(requirements.requireDefensiveDriving)required.add("defensiveDriving");
 const byId=new Map(drivers.map(driver=>[driver.id,driver]));
 const actions:SupervisorRenewalAction[]=[];
 for(const row of summary.rows){
  const driver=byId.get(row.id);
  if(!driver)continue;
  function add(credential:DriverCredentialKey|"workforce",priority:SupervisorPriority,issue:string,dueDate:string,nextStep:string){
   actions.push({id:driver.id+"-"+credential+"-"+priority,driverId:driver.id,driverName:driver.name,
    site:summary.site,credential,priority,issue,dueDate,nextStep});
  }
  if(row.blockingReasons.some(reason=>reason.startsWith("Linked workforce identity"))){
   add("workforce","stop","Linked employee account inactive or missing","","Confirm organization directory identity before dispatch");
  }
  for(const key of credentialKeys){
   const needed=required.has(key),enabled=credentialEnabled(driver,key);
   if(!enabled){
    if(needed)add(key,"stop","Required competency not authorised","","Review evidence and obtain site-supervisor authorization");
    continue;
   }
   const expiry=driver.competencyExpiry?.[key]??"";
   const status=credentialDateStatus(expiry,now);
   if(status.state==="expired"||status.state==="missing"){
    add(key,needed?"stop":"review",status.state==="expired"?"Qualification expired":"Expiry date missing or invalid",
     status.state==="expired"?expiry:"",
     needed?"Renew and verify this competency before dispatch":"Verify and update this recorded qualification");
   }else if(status.state==="due"){
    add(key,"renew","Qualification expires within 30 days",expiry,"Arrange renewal and update the certificate and expiry record");
   }
   if(row.missingEvidence.includes(key)){
    add(key,"evidence","No linked supporting PDF","","Upload supporting certificate and link it through supervisor review");
   }
  }
 }
 return actions.sort((a,b)=>priorityOrder[a.priority]-priorityOrder[b.priority]||
  (a.dueDate||"9999-12-31").localeCompare(b.dueDate||"9999-12-31")||
  a.driverName.localeCompare(b.driverName)||a.credential.localeCompare(b.credential));
}

/** Prevent spreadsheet formula injection, including leading whitespace and tab prefixes. */
function csvCell(value:unknown):string{
 const raw=String(value??"").replace(/\u0000/g,"");
 const sanitized=/^[\s\u0001-\u001f]*[=+\-@]/.test(raw)? "'"+raw:raw;
 return '"'+sanitized.replace(/"/g,'""')+'"';
}
export function csvWithHeaders(headers:readonly string[],rows:readonly (readonly unknown[])[]):string{
 return "\uFEFF"+[headers,...rows].map(row=>row.map(csvCell).join(",")).join("\r\n")+"\r\n";
}
export function complianceSummaryCsv(summary:DriverComplianceSummary,drivers:readonly FleetDriver[],generatedAt:string):string{
 const byId=new Map(drivers.map(driver=>[driver.id,driver]));
 return csvWithHeaders([
  "Report as of (ISO)","Operating site","Driver ID","Driver name","Recorded criteria","Driver availability",
  "Active assignments","Dispatch blockers","Expiring in 30 days","Expired qualifications","Missing supporting PDFs","Last local supervisor acknowledgement"
 ],summary.rows.map(row=>{
  const source=byId.get(row.id);
  return [generatedAt,summary.site,row.id,row.name,row.state,row.driverStatus,row.activeAssignmentCount,
   row.blockingReasons.join("; "),row.dueSoon.map(a=>a.label+" ("+a.date+")").join("; "),
   row.expired.map(a=>a.label+" ("+a.date+")").join("; "),
   row.missingEvidence.map(key=>credentialLabels[key]).join("; "),source?.authorizationReview?.signedAt??""];
 }));
}
export function supervisorActionsCsv(actions:readonly SupervisorRenewalAction[],generatedAt:string):string{
 return csvWithHeaders(["Report as of (ISO)","Operating site","Priority","Driver ID","Driver name","Competency",
  "Issue","Expiry date","Suggested supervisor action"],actions.map(action=>[
   generatedAt,action.site,supervisorPriorityLabels[action.priority],action.driverId,action.driverName,
   action.credential==="workforce"?"Workforce identity":credentialLabels[action.credential],
   action.issue,action.dueDate,action.nextStep
 ]));
}
