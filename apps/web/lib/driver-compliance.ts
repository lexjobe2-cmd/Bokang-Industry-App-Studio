import type {PersonRecord} from "@bokang/domain-data/custom-assurance";
import type {FleetAssignment,FleetDriver,FleetSitePolicy} from "./move-track";
import {credentialAlerts,credentialEnabled,credentialKeys,credentialLabels,driverEligibilityReasons,type CredentialAlert,type DriverCredentialKey,type DriverRequirements} from "./driver-competency.ts";

/** Read-only projection of the same recorded expiry and policy rules used at dispatch. */
export type DriverComplianceState="blocked"|"busy"|"ready";
export type DriverComplianceRow={
 id:string;name:string;driverStatus:FleetDriver["status"];state:DriverComplianceState;
 blockingReasons:string[];dueSoon:CredentialAlert[];expired:CredentialAlert[];
 missingEvidence:DriverCredentialKey[];activeAssignmentCount:number;
};
export type DriverComplianceSummary={
 site:string;rows:DriverComplianceRow[];
 counts:{total:number;ready:number;blocked:number;busy:number;dueSoon:number;missingEvidence:number};
};
const activeAssignment=(item:FleetAssignment)=>!["Returned","Cancelled"].includes(item.status);

export function siteCredentialRequirements(site:string,policies:readonly FleetSitePolicy[]):DriverRequirements{
 const policy=policies.find(item=>item.name===site);
 return {requireOpenPitPermit:policy?.requireOpenPitPermit??site.toLowerCase().includes("mine"),
  requireFirstAid:policy?.requireFirstAid??false,requireDefensiveDriving:policy?.requireDefensiveDriving??false};
}

export function buildDriverComplianceSummary(input:{
 drivers:readonly FleetDriver[];assignments:readonly FleetAssignment[];
 directory:readonly PersonRecord[];orgId:string;site:string;
 policies:readonly FleetSitePolicy[];now?:Date;
}):DriverComplianceSummary{
 const {drivers,assignments,directory,orgId,site,policies,now=new Date()}=input;
 const requirements=siteCredentialRequirements(site,policies);
 const rows:DriverComplianceRow[]=drivers.map(driver=>{
  const blockingReasons=driverEligibilityReasons(driver,requirements,now);
  if(driver.personId&&!directory.some(person=>person.orgId===orgId&&person.id===driver.personId&&person.active)){
   blockingReasons.push("Linked workforce identity is inactive or not found in this organization");
  }
  const currentAssignments=assignments.filter(item=>item.driverId===driver.id&&activeAssignment(item));
  const state:DriverComplianceState=blockingReasons.length?"blocked":(driver.status!=="Available"||currentAssignments.length)?"busy":"ready";
  const alerts=credentialAlerts(driver,now);
  const missingEvidence=credentialKeys.filter(key=>{
   if(!credentialEnabled(driver,key))return false;
   const id=driver.competencyEvidence?.[key];
   return !id||!driver.documents?.some(document=>document.id===id);
  });
  return {id:driver.id,name:driver.name,driverStatus:driver.status,state,blockingReasons,
   dueSoon:alerts.filter(a=>a.state==="due"),expired:alerts.filter(a=>a.state==="expired"),
   missingEvidence,activeAssignmentCount:currentAssignments.length};
 }).sort((a,b)=>{
  const weight=(row:DriverComplianceRow)=>(row.state==="blocked"?0:row.missingEvidence.length?1:row.dueSoon.length?2:row.state==="busy"?3:4);
  return weight(a)-weight(b)||a.name.localeCompare(b.name);
 });
 return {site,rows,counts:{
  total:rows.length,ready:rows.filter(row=>row.state==="ready").length,
  blocked:rows.filter(row=>row.state==="blocked").length,
  busy:rows.filter(row=>row.state==="busy").length,
  dueSoon:rows.filter(row=>row.dueSoon.length>0).length,
  missingEvidence:rows.filter(row=>row.missingEvidence.length>0).length
 }};
}
export function missingEvidenceLabels(row:DriverComplianceRow):string[]{
 return row.missingEvidence.map(key=>credentialLabels[key]);
}
