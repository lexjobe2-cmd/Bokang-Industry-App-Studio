import type {PersonRecord} from "@bokang/domain-data/custom-assurance";
import {fleetIdentity} from "./fleet-identity.ts";
export type WorkerDetails=Pick<PersonRecord,"displayName"|"email"|"department"|"jobTitle"|"location"|"employeeNumber"|"active">;
export function editableWorkerDetails(worker:PersonRecord):WorkerDetails{
 return {displayName:worker.displayName,email:worker.email,department:worker.department,jobTitle:worker.jobTitle,location:worker.location,employeeNumber:worker.employeeNumber??"",active:worker.active};
}
function normalEmail(value:string){return value.trim().toLowerCase();}
function validate(people:readonly PersonRecord[],orgId:string,details:WorkerDetails,excludeId?:string):WorkerDetails{
 const cleaned={displayName:details.displayName.trim(),email:normalEmail(details.email),department:details.department.trim(),jobTitle:details.jobTitle.trim(),location:details.location.trim(),employeeNumber:(details.employeeNumber??"").trim(),active:details.active};
 if(!cleaned.displayName||!cleaned.jobTitle||!cleaned.department)throw Error("Worker name, job title and department are required.");
 if([cleaned.displayName,cleaned.email,cleaned.department,cleaned.jobTitle,cleaned.location,cleaned.employeeNumber].some(v=>v.length>150))throw Error("Worker profile field is too long.");
 if(cleaned.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email))throw Error("Enter a valid work email, or leave it blank.");
 const peers=people.filter(p=>p.orgId===orgId&&p.id!==excludeId);
 if(cleaned.employeeNumber&&peers.some(p=>fleetIdentity(p.employeeNumber??"")===fleetIdentity(cleaned.employeeNumber)))throw Error("This employee number already exists in the organization.");
 if(cleaned.email&&peers.some(p=>p.email&&normalEmail(p.email)===cleaned.email))throw Error("This employee email already exists in the organization.");
 return cleaned;
}
export function updateWorkerDetails(people:readonly PersonRecord[],orgId:string,id:string,details:WorkerDetails):PersonRecord[]{
 const worker=people.find(p=>p.id===id&&p.orgId===orgId);
 if(!worker)throw Error("Worker not found in the selected organization.");
 const cleaned=validate(people,orgId,details,id);
 // Imported tenant fields, stable IDs, provenance and manager links are untouched.
 return people.map(p=>p.id===id?{...p,...cleaned}:p);
}
export function createLocalWorker(people:readonly PersonRecord[],orgId:string,id:string,details:WorkerDetails):PersonRecord[]{
 if(!orgId||!id||people.some(p=>p.id===id))throw Error("Worker identity already exists or organization is missing.");
 const cleaned=validate(people,orgId,details);
 return [{id,orgId,source:"MANUAL",userPrincipalName:"",...cleaned},...people];
}
