import type {FormSubmission} from "@bokang/domain-data/assurance-forms";
import type {CustomTemplate,JobRiskAssessment,OrganizationProfile,PersonRecord} from "@bokang/domain-data/custom-assurance";
import type {FleetVehicle,FleetDriver,FleetIncident,FleetAssignment,PrestartRecord,FleetSitePolicy} from "./move-track";
import type {FleetReleaseRecord,RepairEvidence,ReinspectionEvidence} from "./fleet-release";

export type SearchView="control"|"fleet"|"drivers"|"sites"|"assign"|"jobs"|"analytics"|"forms"|"meetings"|"paper"|"release"|"local-data"|"settings";
export type SearchGroup="Forms"|"Risk"|"Meetings"|"Fleet"|"People"|"Incidents"|"Jobs"|"Locations"|"Organizations";
export type SearchHit={
 key:string;id:string;kind:string;group:SearchGroup;title:string;subtitle:string;
 view:SearchView;searchText:string;updatedAt?:string;templateId?:string;tag?:string;
};
type Job={id:string;client:string;type:string;from:string;to:string;driver:string;state:string};
export type WorkspaceSearchSources={
 orgId:string;
 organizations:readonly OrganizationProfile[];people:readonly PersonRecord[];
 forms:readonly FormSubmission[];templates:readonly CustomTemplate[];
 jras:readonly JobRiskAssessment[];fleet:readonly FleetVehicle[];
 drivers:readonly FleetDriver[];incidents:readonly FleetIncident[];
 assignments:readonly FleetAssignment[];prestarts:readonly PrestartRecord[];
 sites:readonly FleetSitePolicy[];jobs:readonly Job[];
 releases?:readonly FleetReleaseRecord[];repairs?:readonly RepairEvidence[];
 reinspections?:readonly ReinspectionEvidence[];
};
const norm=(s:unknown)=>String(s??"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").replace(/\s+/g," ").trim();
const values=(object:Record<string,unknown>):string[]=>Object.values(object).flatMap(v=>{
 if(typeof v==="string"||typeof v==="number")return [String(v)];
 if(Array.isArray(v))return v.flatMap(x=>typeof x==="string"||typeof x==="number"?[String(x)]:[]);
 return [];
});
const summary=(text:unknown,max=110)=>String(text??"").replace(/\s+/g," ").slice(0,max);
export function buildWorkspaceIndex(data:WorkspaceSearchSources):SearchHit[]{
 const result:SearchHit[]=[];
 const push=(r:Omit<SearchHit,"searchText">,details:string[])=>result.push({...r,searchText:norm([r.title,r.subtitle,r.kind,r.tag??"",...details].join(" "))});
 const person=id=>data.people.find(p=>p.id===id)?.displayName??id;
 for(const company of data.organizations)push({key:"organization:"+company.id,id:company.id,kind:"Company",group:"Organizations",title:company.name,subtitle:company.businessUnit||company.domain,view:"analytics"},[company.domain,company.industry??"",...company.siteIds]);
 for(const worker of data.people.filter(p=>p.orgId===data.orgId))push({key:"person:"+worker.id,id:worker.id,kind:"Worker",group:"People",title:worker.displayName,subtitle:worker.jobTitle+" · "+worker.department,view:"analytics"},[worker.employeeNumber??"",worker.email,worker.location]);
 for(const form of data.forms){
  const org=(form.templateSnapshot as typeof form.templateSnapshot&{organizationId?:string}).organizationId;
  if(org!==data.orgId&&!(data.orgId==="demo-mining"&&!org))continue;
  const details=form.templateSnapshot.sections.flatMap(section=>section.fields.flatMap(field=>{
   const value=form.answers[field.id];
   if(typeof value==="string"&&value.length<220)return [field.label,value];
   if(typeof value==="number")return [field.label,String(value)];
   if(Array.isArray(value))return [field.label,...value.filter((a):a is string=>typeof a==="string").slice(0,12)];
   return [field.label];
  }));
  push({key:"submission:"+form.id,id:form.id,kind:"Submitted form",group:form.templateSnapshot.category==="Meetings"?"Meetings":"Forms",
   title:form.templateSnapshot.title,subtitle:[form.taskId,form.siteId,form.decision].filter(Boolean).join(" · "),tag:form.decision,view:form.templateSnapshot.category==="Meetings"?"meetings":"forms",updatedAt:form.submittedAt,templateId:form.templateId},
   [form.id,form.submittedByPersonId?person(form.submittedByPersonId):"",...details]);
 }
 for(const template of data.templates.filter(t=>t.organizationId===data.orgId&&t.status==="PUBLISHED"))push({
  key:"template:"+template.id,id:template.id,templateId:template.id,kind:"Company template",group:"Forms",
  title:template.title,subtitle:template.description,view:"forms",updatedAt:template.updatedAt
 },[template.category,template.referencePrefix,...template.sections.flatMap(s=>[s.title,...s.fields.map(f=>f.label)])]);
 for(const jra of data.jras.filter(r=>r.orgId===data.orgId))push({
  key:"jra:"+jra.id,id:jra.id,kind:"Risk assessment",group:"Risk",
  title:jra.title||jra.reference,subtitle:[jra.reference,jra.jobId,jra.siteId,jra.status].join(" · "),
  view:"forms",tag:jra.status,updatedAt:jra.updatedAt
 },[jra.scope,jra.method,jra.location,jra.jobType,jra.permits.join(" "),...jra.tasks.flatMap(t=>[t.description,...t.hazards.flatMap(h=>[h.hazard,h.consequence,...h.controls.map(c=>c.description)])])]);
 for(const vehicle of data.fleet)push({key:"asset:"+vehicle.id,id:vehicle.id,kind:"Fleet asset",group:"Fleet",title:vehicle.fleetNo+" · "+vehicle.makeModel,
  subtitle:vehicle.registration+" · "+vehicle.status+" · "+vehicle.site,view:"fleet",tag:vehicle.status},[vehicle.id,vehicle.type,vehicle.site]);
 for(const driver of data.drivers)push({key:"driver:"+driver.id,id:driver.id,kind:"Driver",group:"People",title:driver.name,subtitle:driver.licenceNo+" · "+driver.status,view:"drivers"},[driver.id,driver.licenceNo]);
 for(const incident of data.incidents)push({key:"incident:"+incident.id,id:incident.id,kind:"Incident / defect",group:"Incidents",
  title:summary(incident.description,85)||incident.category,subtitle:[incident.category,incident.severity,incident.status,incident.vehicleId].join(" · "),
  view:"control",updatedAt:incident.createdAt,tag:incident.status},[incident.id,incident.resolutionNote??"",incident.vehicleId]);
 for(const assignment of data.assignments)push({key:"assignment:"+assignment.id,id:assignment.id,kind:"Fleet assignment",group:"Jobs",
  title:assignment.id+" · "+(data.fleet.find(f=>f.id===assignment.vehicleId)?.fleetNo??assignment.vehicleId),
  subtitle:[person(assignment.driverId),assignment.site,assignment.status,assignment.jobId].filter(Boolean).join(" · "),
  view:"assign",updatedAt:assignment.createdAt,tag:assignment.status},[assignment.driverId,assignment.vehicleId]);
 for(const prestart of data.prestarts)push({key:"prestart:"+prestart.id,id:prestart.id,kind:"Pre-start inspection",group:"Fleet",
  title:"Pre-start · "+(data.fleet.find(f=>f.id===prestart.vehicleId)?.fleetNo??prestart.vehicleId),
  subtitle:prestart.result+" · "+prestart.assignmentId,view:"fleet",updatedAt:prestart.createdAt,tag:prestart.result},
  [prestart.id,prestart.notes,...prestart.reasons]);
 for(const site of data.sites)push({key:"site:"+site.id,id:site.id,kind:"Site policy",group:"Locations",title:site.name,
  subtitle:site.additionalCriticalChecks.length+" critical controls",view:"sites"},[site.id,...site.additionalCriticalChecks]);
 for(const job of data.jobs)push({key:"job:"+job.id,id:job.id,kind:"Job / work order",group:"Jobs",title:job.id+" · "+job.client,
  subtitle:[job.type,job.from+" → "+job.to,job.state].join(" · "),view:"jobs",tag:job.state},[job.driver,job.from,job.to]);
 for(const release of data.releases??[])push({key:"release:"+release.id,id:release.id,kind:"Fleet release review",group:"Fleet",
  title:"Release review · "+release.vehicleId,subtitle:release.approvedBy+" · "+release.decision,view:"release",
  tag:release.decision,updatedAt:release.approvedAt},[release.repairEvidenceId,release.reinspectionId]);
 for(const repair of data.repairs??[])push({key:"repair:"+repair.id,id:repair.id,kind:"Repair evidence",group:"Fleet",
  title:"Repair · "+repair.vehicleId,subtitle:summary(repair.repairNotes),view:"release",
  updatedAt:repair.recordedAt},[repair.evidenceReference,repair.repairedBy,...repair.incidentIds]);
 for(const reinspection of data.reinspections??[])push({key:"reinspection:"+reinspection.id,id:reinspection.id,kind:"Independent reinspection",group:"Fleet",
  title:"Reinspection · "+reinspection.vehicleId,subtitle:reinspection.inspectionBy+" · "+reinspection.verdict,view:"release",
  updatedAt:reinspection.inspectedAt,tag:reinspection.verdict},[reinspection.id]);
 return result;
}
export function searchWorkspace(index:readonly SearchHit[],query:string,group:"All"|SearchGroup="All",limit=30){
 const search=norm(query),tokens=[...new Set(search.split(" ").filter(Boolean))];
 if(!tokens.length)return [];
 const out=index.filter(i=>(group==="All"||i.group===group)&&tokens.every(token=>i.searchText.includes(token))).map(i=>{
  const title=norm(i.title),subtitle=norm(i.subtitle);
  const score=tokens.reduce((sum,token)=>sum+(title===token?25:title.startsWith(token)?12:title.includes(token)?7:subtitle.includes(token)?4:1),0)
    +(i.searchText.includes(search)?9:0)+(i.kind==="Submitted form"?1:0);
  return {...i,score};
 }).sort((a,b)=>b.score-a.score||(b.updatedAt??"").localeCompare(a.updatedAt??"")||a.title.localeCompare(b.title));
 return out.slice(0,Math.max(0,limit));
}
