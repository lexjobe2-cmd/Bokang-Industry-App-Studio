import type {FleetDriver,FleetSitePolicy} from "./move-track";
import {credentialKeys,credentialLabels,credentialEnabled,credentialDateStatus,type DriverCredentialKey} from "./driver-competency.ts";
import {siteCredentialRequirements,type DriverComplianceSummary} from "./driver-compliance.ts";

/** Plain-text browser exports. No PDF bytes, signatures, personal phone numbers or backend calls. */
export type SupervisorActionPriority="Immediate"|"Due within 30 days"|"Evidence review";
export type SupervisorRenewalAction={
 driverId:string;driverName:string;site:string;
 credential:DriverCredentialKey;priority:SupervisorActionPriority;issue:string;
 expiry:string;daysRemaining:number|null;documentName:string;
 action:string;
};
export const complianceCsvHeaders=[
 "Assessment date","Site","Driver ID","Driver name","Driver status",
 "Recorded criteria","Active assignments","Blocking reasons",
 "Qualifications due within 30 days","Expired qualifications","Missing supporting PDF links",
 ...credentialKeys.flatMap(key=>[credentialLabels[key]+" expiry",credentialLabels[key]+" supporting PDF"])
] as const;
export const actionsCsvHeaders=[
 "Assessment date","Site","Priority","Driver ID","Driver name","Qualification",
 "Issue","Expiry date","Days remaining","Supporting PDF","Supervisor next action"
] as const;

function safeCsvCell(value:unknown):string{
 const raw=String(value??"");
 // Spreadsheet readers may execute formula-looking imported cells, including leading whitespace.
 const neutralized=/^\s*[=+\-@]/.test(raw)||/^[\t\r\n]/.test(raw)?"'"+raw:raw;
 return '"'+neutralized.replace(/"/g,'""')+'"';
}
export function csvRows(headers:readonly string[],rows:readonly (readonly unknown[])[]):string{
 return "\uFEFF"+[headers,...rows].map(row=>row.map(safeCsvCell).join(",")).join("\r\n")+"\r\n";
}
function dateLabel(date:Date):string{
 const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,"0"),d=String(date.getDate()).padStart(2,"0");
 return y+"-"+m+"-"+d;
}
function joined(labels:readonly string[]):string{return labels.join("; ");}
function supportingPdf(driver:FleetDriver,key:DriverCredentialKey):string{
 const id=driver.competencyEvidence?.[key];
 return driver.documents?.find(document=>document.id===id)?.name??"";
}
/** All site records are exported, intentionally independent of the dashboard search, filters or page. */
export function driverComplianceCsv(summary:DriverComplianceSummary,drivers:readonly FleetDriver[],now=new Date()):string{
 const driverById=new Map(drivers.map(driver=>[driver.id,driver]));
 return csvRows(complianceCsvHeaders,summary.rows.map(row=>{
  const driver=driverById.get(row.id);
  return [dateLabel(now),summary.site,row.id,row.name,row.driverStatus,row.state,
   row.activeAssignmentCount,joined(row.blockingReasons),
   joined(row.dueSoon.map(alert=>alert.label+" ("+alert.date+")")),
   joined(row.expired.map(alert=>alert.label+" ("+alert.date+")")),
   joined(row.missingEvidence.map(key=>credentialLabels[key])),
   ...credentialKeys.flatMap(key=>[driver?.competencyExpiry?.[key]??"",driver?supportingPdf(driver,key):""])];
 }));
}
const priorityOrder:Record<SupervisorActionPriority,number>={"Immediate":0,"Due within 30 days":1,"Evidence review":2};
/** One non-mutating supervisor action per distinct deficiency, not a claim of certificate validation. */
export function buildSupervisorRenewalActions(input:{
 summary:DriverComplianceSummary;drivers:readonly FleetDriver[];
 policies:readonly FleetSitePolicy[];now?:Date;
}):SupervisorRenewalAction[]{
 const {summary,drivers,policies,now=new Date()}=input;
 const policy=siteCredentialRequirements(summary.site,policies);
 const required=new Set<DriverCredentialKey>(["licence","siteAuthorisation"]);
 if(policy.requireOpenPitPermit)required.add("openPitPermit");
 if(policy.requireFirstAid)required.add("firstAid");
 if(policy.requireDefensiveDriving)required.add("defensiveDriving");
 const driverById=new Map(drivers.map(driver=>[driver.id,driver]));
 const actions:SupervisorRenewalAction[]=[];
 for(const row of summary.rows){
  const driver=driverById.get(row.id);
  if(!driver)continue;
  for(const key of credentialKeys){
   const needed=required.has(key),enabled=credentialEnabled(driver,key);
   const date=driver.competencyExpiry?.[key]??"";
   const {state,daysRemaining}=credentialDateStatus(date,now);
   const evidence=supportingPdf(driver,key);
   const common={driverId:row.id,driverName:row.name,site:summary.site,
    credential:key,expiry:date,daysRemaining,documentName:evidence};
   if(needed&&!enabled){
    actions.push({...common,priority:"Immediate",issue:"Required qualification not authorised",
     action:"Confirm qualification and complete independent supervisor review before dispatch"});
   }else if(enabled&&state==="expired"){
    actions.push({...common,priority:"Immediate",issue:"Expired qualification",
     action:"Renew with issuing authority, attach PDF evidence and record reviewed expiry"});
   }else if(needed&&state==="missing"){
    actions.push({...common,priority:"Immediate",issue:"Required expiry date missing",
     action:"Obtain verified expiry date, attach supporting PDF and capture supervisor review"});
   }else if(enabled&&state==="due"){
    actions.push({...common,priority:"Due within 30 days",issue:"Renewal approaching",
     action:"Arrange renewal and replace supporting evidence before expiry"});
   }
   if(enabled&&!evidence){
    actions.push({...common,priority:"Evidence review",issue:"Supporting PDF not linked",
     action:"Upload or select an existing PDF; confirm authenticity and review the linkage"});
   }
  }
  // This is a separate organization identity condition, not a certificate issue.
  if(row.blockingReasons.some(reason=>reason.includes("workforce identity"))){
   actions.push({...driverId:row.id,driverName:row.name,site:summary.site,
    credential:"siteAuthorisation",priority:"Immediate",issue:"Inactive or missing workforce identity",
    expiry:"",daysRemaining:null,documentName:"",
    action:"Restore or update the linked company workforce record before dispatch"});
  }
 }
 return actions.sort((a,b)=>priorityOrder[a.priority]-priorityOrder[b.priority]
  ||(a.daysRemaining??99999)-(b.daysRemaining??99999)
  ||a.driverName.localeCompare(b.driverName)||a.credential.localeCompare(b.credential)||a.issue.localeCompare(b.issue));
}
export function supervisorActionsCsv(actions:readonly SupervisorRenewalAction[],now=new Date()):string{
 return csvRows(actionsCsvHeaders,actions.map(action=>[
  dateLabel(now),action.site,action.priority,action.driverId,action.driverName,
  action.issue==="Inactive or missing workforce identity"?"Workforce directory":credentialLabels[action.credential],
  action.issue,action.expiry,action.daysRemaining??"",action.documentName,action.action
 ]));
}
export function complianceExportFilename(site:string,kind:"driver-competency"|"supervisor-renewals",now=new Date()):string{
 const safeSite=site.normalize("NFKD").replace(/[^A-Za-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,42).toLowerCase()||"company";
 return "movetrack-"+kind+"-"+safeSite+"-"+dateLabel(now)+".csv";
}
