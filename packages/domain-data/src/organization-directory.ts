import type {OrganizationProfile,PersonRecord} from "./custom-assurance.ts";

export type DirectorySearchQuery={orgId:string;search?:string;department?:string;city?:string;limit?:number;cursor?:string};
export type DirectorySearchPage={items:PersonRecord[];nextCursor?:string;total:number;departments:string[];cities:string[];source:"LOCAL"|"CONNECTED"};
/** An authenticated connector can implement this interface without changing forms or the people-picker UI.
 * Each call must enforce tenant membership and server-side field filters/pagination.
 */
export interface DirectoryProvider{
 readonly mode:"LOCAL"|"CONNECTED";
 search(query:DirectorySearchQuery):Promise<DirectorySearchPage>;
}
const norm=(v?:string)=>String(v??"").normalize("NFKD").trim().toLocaleLowerCase("en").replace(/\s+/g," ");
export function personSearchTerms(p:PersonRecord):string[]{
 return [p.displayName,p.email,p.userPrincipalName,p.employeeNumber,p.department,p.jobTitle,
  p.city,p.location,p.officeLocation].filter(Boolean).map(norm);
}
export function searchOrganizationPeople(people:readonly PersonRecord[],request:DirectorySearchQuery):DirectorySearchPage{
 const all=people.filter(p=>p.orgId===request.orgId&&p.active);
 const departments=[...new Set(all.map(p=>p.department.trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 const cities=[...new Set(all.map(p=>(p.city||p.location||"").trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 const terms=norm(request.search).split(" ").filter(Boolean);
 const match=all.filter(p=>{
  if(request.department&&norm(p.department)!==norm(request.department))return false;
  if(request.city&&norm(p.city||p.location)!==norm(request.city))return false;
  const values=personSearchTerms(p);
  return terms.every(part=>values.some(v=>v.includes(part)));
 }).sort((a,b)=>{
  const q=norm(request.search);
  if(q){const score=(p:PersonRecord)=>norm(p.displayName).startsWith(q)?0:norm(p.email).startsWith(q)?1:2;
    if(score(a)!==score(b))return score(a)-score(b);}
  return a.displayName.localeCompare(b.displayName)||a.id.localeCompare(b.id);
 });
 const parsed=Number(request.cursor??0);
 const start=Number.isSafeInteger(parsed)&&parsed>=0?parsed:0;
 const limit=Math.min(100,Math.max(1,request.limit??35));
 const page=match.slice(start,start+limit);
 return {items:page,total:match.length,nextCursor:start+limit<match.length?String(start+limit):undefined,departments,cities,source:"LOCAL"};
}
export function createLocalDirectoryProvider(getPeople:()=>readonly PersonRecord[]):DirectoryProvider{
 return {mode:"LOCAL",async search(query){return searchOrganizationPeople(getPeople(),query);}};
}
export type DirectoryCsvResult={records:PersonRecord[];headers:string[];warnings:string[];duplicates:number};
function parseCsvRows(content:string):string[][]{
 if(content.length>2_000_000)throw Error("Directory CSV exceeds the 2 MB local import limit");
 const text=content.replace(/^\uFEFF/,"");
 const rows:string[][]=[];let row:string[]=[],part="",quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){
   if(quoted&&text[i+1]==='"'){part+='"';i++;}
   else quoted=!quoted;
  }else if(c===","&&!quoted){row.push(part);part="";}
  else if((c==="\n"||c==="\r")&&!quoted){if(c==="\r"&&text[i+1]==="\n")i++;row.push(part);
   if(row.some(v=>v.trim()))rows.push(row);row=[];part="";}
  else part+=c;
 }
 if(quoted)throw Error("CSV contains an unclosed quoted field");
 row.push(part);if(row.some(v=>v.trim()))rows.push(row);
 if(rows.length>10_001)throw Error("Directory import limited to 10,000 people");
 return rows;
}
const aliases:Record<string,string[]>={
 name:["displayname","fullname","name","employeename","staffname","person"],
 email:["mail","email","emailaddress","workemail","useremail"],
 upn:["userprincipalname","upn","principalname","principalemail","loginname"],
 dept:["department","dept","businessunit","division","team"],
 city:["city","town","workcity"],
 location:["officelocation","location","site","office","worksite"],
 job:["jobtitle","position","title","role","designation"],
 employee:["employeeid","employeenumber","staffid","staffnumber","personnelnumber"],
 active:["accountenabled","active","enabled","status"]
};
const canonical=(v:string)=>norm(v).replace(/[^a-z0-9]/g,"");
function stableId(seed:string){
 let h=2166136261;
 for(let i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619);}
 return (h>>>0).toString(36);
}
export function parseOrganizationDirectoryCsv(csv:string,orgId:string,existing:readonly PersonRecord[]=[]):DirectoryCsvResult{
 if(!orgId.trim())throw Error("Select an organization before importing directory records");
 const rows=parseCsvRows(csv);
 if(!rows.length)throw Error("Directory CSV is empty");
 const headers=rows[0]!.map(v=>v.trim());
 const keys=headers.map(canonical);
 const idx=(key:string)=>keys.findIndex(x=>aliases[key]?.some(alias=>canonical(alias)===x));
 const nameIndex=idx("name"),emailIndex=idx("email"),upnIndex=idx("upn");
 if(nameIndex<0&&emailIndex<0&&upnIndex<0)throw Error("CSV needs a Name, Email or UserPrincipalName column");
 const get=(row:string[],kind:string)=>{const col=idx(kind);return col>=0?(row[col]??"").trim().slice(0,300):"";};
 const previous=new Map<string,PersonRecord>();
 for(const person of existing.filter(p=>p.orgId===orgId)){
  for(const key of [person.userPrincipalName,person.email,person.employeeNumber].map(norm).filter(Boolean))previous.set(key,person);
 }
 const unique=new Map<string,PersonRecord>();
 let duplicates=0;
 const warnings:string[]=[];
 for(let i=1;i<rows.length;i++){
  const row=rows[i]!;
  const name=get(row,"name"),email=get(row,"email"),upn=get(row,"upn"),employeeNumber=get(row,"employee");
  const displayName=name||upn||email;
  if(!displayName){warnings.push("Row "+(i+1)+" skipped: no identifiable person");continue;}
  const key=norm(upn||email||employeeNumber||name);
  if(unique.has(key)){duplicates++;continue;}
  const prior=previous.get(norm(upn))||previous.get(norm(email))||previous.get(norm(employeeNumber));
  const department=get(row,"dept"),city=get(row,"city"),officeLocation=get(row,"location");
  const activeValue=norm(get(row,"active"));
  const person:PersonRecord={
   id:prior?.id??"csv-"+stableId(orgId+"|"+key),orgId,
   externalId:prior?.externalId,source:prior?.source==="MICROSOFT_365"?"MICROSOFT_365":"CSV_IMPORT",
   displayName, email, userPrincipalName:upn,
   department,jobTitle:get(row,"job"),city,location:officeLocation||city,
   officeLocation,employeeNumber:employeeNumber||undefined,
   active:!["false","0","no","disabled","inactive"].includes(activeValue)
  };
  unique.set(key,person);
 }
 if(!unique.size)throw Error("Directory CSV did not contain any usable people");
 return {records:[...unique.values()],headers,warnings,duplicates};
}
export function mergeOrganizationDirectory(existing:readonly PersonRecord[],orgId:string,updates:readonly PersonRecord[]){
 if(updates.some(p=>p.orgId!==orgId))throw Error("Directory record belongs to a different organization");
 const map=new Map(existing.map(p=>[p.id,p]));
 for(const p of updates)map.set(p.id,p);
 return [...map.values()];
}
export function deriveOrganizationFacets(org:OrganizationProfile,people:readonly PersonRecord[]){
 const scoped=people.filter(p=>p.orgId===org.id&&p.active);
 return {departments:[...new Set([...(org.departments??[]),...scoped.map(p=>p.department)].filter(Boolean))].sort(),
  cities:[...new Set([...(org.cities??[]),...scoped.map(p=>p.city||p.location)].filter(Boolean))].sort()};
}
