import type {FormAnswer,FormAnswers,FormCategory,FormField,FormSubmission,FormTemplate} from "./assurance-forms.ts";
import type {JobRiskAssessment,PersonRecord} from "./custom-assurance.ts";

export type ParticipationRole="Submitter"|"Participant"|"Responsible person"|"Reviewer"|"Supervisor"|"Attendee";
export type ParticipationItem={
 id:string;kind:"Form"|"JRA";title:string;date:string;site:string;jobId:string;
 status:string;category:string;roles:ParticipationRole[];personIds:string[];
};
export type AnalyticsData={
 total:number;forms:number;jras:number;peopleInvolved:number;withParticipants:number;
 noGo:number;reviewNeeded:number;completed:number;drafts:number;participated:number;
 categories:{name:string;count:number}[];sites:{name:string;count:number}[];
 months:{name:string;count:number}[];roles:{role:string;count:number}[];
 topPeople:{id:string;name:string;count:number}[];items:ParticipationItem[];
};

const normalize=(s:string)=>s.trim().toLowerCase().replace(/\s+/g," ");
function linkedPeople(fields:readonly FormField[],answers:FormAnswers,people:readonly PersonRecord[]):Map<string,Set<ParticipationRole>>{
 const result=new Map<string,Set<ParticipationRole>>();
 const add=(id:string,role:ParticipationRole)=>{
  if(!people.some(p=>p.id===id))return;
  if(!result.has(id))result.set(id,new Set());
  result.get(id)!.add(role);
 };
 for(const f of fields){
  const v:FormAnswer|undefined=answers[f.id];
  if(f.type==="person"&&typeof v==="string")add(v,/review|approv/i.test(f.label)?"Reviewer":/supervis/i.test(f.label)?"Supervisor":"Responsible person");
  // Being absent/apologizing is not the same as participating in the meeting.
  // Preserve the absent people in the meeting snapshot for reporting, but exclude them here.
  if(f.type==="people"&&Array.isArray(v)&&!/apolog|absen/i.test(f.id+" "+f.label))
   for(const id of v)if(typeof id==="string")add(id,"Participant");
  if(f.type!=="repeat"||!Array.isArray(v)||!/attend|register|participant|crew|sign.in/i.test(f.label))continue;
  for(const entry of v){
   if(!entry||Array.isArray(entry)||typeof entry!=="object")continue;
   const row=entry as Record<string,unknown>;
   const names=f.children?.filter(x=>/name|employee|participant|attendee|worker/i.test(x.label+" "+x.id)).map(x=>row[x.id]).filter(v=>typeof v==="string") as string[]||[];
   for(const p of people)if(names.some(v=>normalize(v)===normalize(p.displayName)||!!p.employeeNumber&&normalize(v)===normalize(p.employeeNumber)))add(p.id,"Attendee");
  }
 }
 return result;
}
function organizationOf(record:FormSubmission){
 return (record.templateSnapshot as FormTemplate&{organizationId?:string}).organizationId;
}
function getFormLinks(record:FormSubmission,people:readonly PersonRecord[]){
 const fields=record.templateSnapshot.sections.flatMap(s=>s.fields);
 const links=linkedPeople(fields,record.answers,people);
 if(record.submittedByPersonId&&people.some(p=>p.id===record.submittedByPersonId)){
  if(!links.has(record.submittedByPersonId))links.set(record.submittedByPersonId,new Set());
  links.get(record.submittedByPersonId)!.add("Submitter");
 }
 return links;
}
function jraLinks(jra:JobRiskAssessment,people:readonly PersonRecord[]){
 const links=new Map<string,Set<ParticipationRole>>();
 const add=(id:string,role:ParticipationRole)=>{
  if(!people.some(p=>p.id===id))return;
  if(!links.has(id))links.set(id,new Set());
  links.get(id)!.add(role);
 };
 for(const p of jra.participants)add(p.personId,"Participant");
 if(jra.supervisorId)add(jra.supervisorId,"Supervisor");
 if(jra.reviewerId)add(jra.reviewerId,"Reviewer");
 return links;
}
export function participationItems(args:{
 orgId:string;people:readonly PersonRecord[];forms:readonly FormSubmission[];jras:readonly JobRiskAssessment[];
}):ParticipationItem[]{
 const {orgId,forms,jras}=args;
 const people=args.people.filter(p=>p.orgId===orgId);
 const formItems=forms.filter(f=>{
  const owner=organizationOf(f);
  return owner===orgId||(!owner&&orgId==="demo-mining");
 }).map(f=>{
  const links=getFormLinks(f,people);
  return {id:f.id,kind:"Form" as const,title:f.templateSnapshot.title,date:f.submittedAt,site:f.siteId,
   jobId:f.taskId??"",status:f.decision,category:f.templateSnapshot.category,
   personIds:[...links.keys()],roles:[] as ParticipationRole[],_links:links};
 });
 const jraItems=jras.filter(j=>j.orgId===orgId).map(j=>{
  const links=jraLinks(j,people);
  return {id:j.id,kind:"JRA" as const,title:j.title||j.reference||"Untitled assessment",date:j.updatedAt,
   site:j.siteId,jobId:j.jobId||j.reference,status:j.status,category:"Risk",
   personIds:[...links.keys()],roles:[] as ParticipationRole[],_links:links};
 });
 return [...formItems,...jraItems].sort((a,b)=>b.date.localeCompare(a.date)).map(({_links,...item})=>item);
}
export function buildAssuranceAnalytics(args:{
 orgId:string;people:readonly PersonRecord[];forms:readonly FormSubmission[];jras:readonly JobRiskAssessment[];
 personId?:string;
}):AnalyticsData{
 const all=participationItems(args);
 const items=args.personId?all.filter(r=>r.personIds.includes(args.personId!)):all;
 const relevantPeople=args.people.filter(p=>p.orgId===args.orgId);
 const forms=args.forms.filter(r=>(organizationOf(r)===args.orgId||(!organizationOf(r)&&args.orgId==="demo-mining"))&&(!args.personId||getFormLinks(r,relevantPeople).has(args.personId)));
 const jras=args.jras.filter(r=>r.orgId===args.orgId&&(!args.personId||jraLinks(r,relevantPeople).has(args.personId)));
 const personCounts=new Map<string,number>(),categoryCounts=new Map<string,number>(),siteCounts=new Map<string,number>(),monthCounts=new Map<string,number>(),roleCounts=new Map<string,number>();
 for(const item of items){
  categoryCounts.set(item.category,(categoryCounts.get(item.category)??0)+1);
  if(item.site)siteCounts.set(item.site,(siteCounts.get(item.site)??0)+1);
  if(/^\d{4}-\d\d/.test(item.date)){const month=item.date.slice(0,7);monthCounts.set(month,(monthCounts.get(month)??0)+1);}
  for(const id of item.personIds)personCounts.set(id,(personCounts.get(id)??0)+1);
 }
 for(const form of forms){
  const links=getFormLinks(form,relevantPeople);
  if(args.personId)for(const role of links.get(args.personId)??[])roleCounts.set(role,(roleCounts.get(role)??0)+1);
  else for(const rs of links.values())for(const role of rs)roleCounts.set(role,(roleCounts.get(role)??0)+1);
 }
 for(const jra of jras){
  const links=jraLinks(jra,relevantPeople);
  if(args.personId)for(const role of links.get(args.personId)??[])roleCounts.set(role,(roleCounts.get(role)??0)+1);
  else for(const rs of links.values())for(const role of rs)roleCounts.set(role,(roleCounts.get(role)??0)+1);
 }
 const ranked=(map:Map<string,number>)=>[...map].sort((a,b)=>b[1]-a[1]).map(([name,count])=>({name,count}));
 return {
  total:items.length,forms:forms.length,jras:jras.length,peopleInvolved:new Set(items.flatMap(x=>x.personIds)).size,
  withParticipants:items.filter(x=>x.personIds.length>0).length,
  noGo:forms.filter(f=>f.decision==="NO_GO").length,
  reviewNeeded:forms.filter(f=>f.decision==="REVIEW").length+jras.filter(j=>j.status==="REVIEW_REQUIRED"||j.status==="IN_REVIEW").length,
  completed:forms.filter(f=>f.decision==="COMPLETE").length+jras.filter(j=>j.status==="CLOSED"||j.status==="APPROVED_DEMO").length,
  drafts:jras.filter(j=>j.status==="DRAFT").length,
  participated:items.length,
  categories:ranked(categoryCounts),sites:ranked(siteCounts),
  months:ranked(monthCounts).sort((a,b)=>a.name.localeCompare(b.name)),
  roles:ranked(roleCounts).map(({name,count})=>({role:name,count})),
  topPeople:[...personCounts].sort((a,b)=>b[1]-a[1]).map(([id,count])=>({id,name:relevantPeople.find(p=>p.id===id)?.displayName??id,count})),
  items
 };
}
