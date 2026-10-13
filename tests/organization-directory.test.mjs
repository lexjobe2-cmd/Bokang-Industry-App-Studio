import test from "node:test";
import assert from "node:assert/strict";
import {searchOrganizationPeople,parseOrganizationDirectoryCsv,mergeOrganizationDirectory,deriveOrganizationFacets} from "../packages/domain-data/src/organization-directory.ts";
import {demoOrganization,demoPeople,mapGraphUser} from "../packages/domain-data/src/custom-assurance.ts";

test("people finder matches each tenant on name, department, city, UPN, email and employee number",()=>{
 const people=[...demoPeople,{...demoPeople[0],id:"foreign",orgId:"org-other",displayName:"Remote Person",email:"remote@test.invalid"}];
 const byName=searchOrganizationPeople(people,{orgId:demoOrganization.id,search:"Naledi"});
 assert.equal(byName.items[0].displayName,"Naledi Molefe");
 assert.equal(searchOrganizationPeople(people,{orgId:demoOrganization.id,search:"remote"}).total,0);
 assert.equal(searchOrganizationPeople(people,{orgId:demoOrganization.id,search:"003"}).items[0].employeeNumber,"003");
 assert.ok(searchOrganizationPeople(people,{orgId:demoOrganization.id,search:"engineering",city:"Gaborone"}).items.some(p=>p.department==="Engineering"));
 assert.ok(searchOrganizationPeople(people,{orgId:demoOrganization.id,department:"SHE"}).items.every(p=>p.department==="SHE"));
 assert.ok(searchOrganizationPeople(people,{orgId:demoOrganization.id,search:"naledi.molefe@demo.invalid"}).total>0);
 const first=searchOrganizationPeople(people,{orgId:demoOrganization.id,limit:2});
 const second=searchOrganizationPeople(people,{orgId:demoOrganization.id,limit:2,cursor:first.nextCursor});
 assert.equal(first.items.length,2);assert.equal(second.items.length,2);
 assert.ok(first.items.every(p=>!second.items.includes(p)));
});
test("CSV import recognizes Microsoft fields and preserves existing stable person identities",()=>{
 const csv='DisplayName,Mail,UserPrincipalName,Department,JobTitle,City,OfficeLocation,EmployeeId,AccountEnabled\r\n'
 +'"Amantle P, Junior",am@example.invalid,amantle@tenant.invalid,Engineering,Electrician,Gaborone,Plant,ID-003,true\r\n'
 +'Pule M,pule@example.invalid,pule@tenant.invalid,Operations,Driver,Maun,Yard,ID-004,false\r\n'
 +'Pule M,pule@example.invalid,pule@tenant.invalid,Operations,Driver,Maun,Yard,ID-004,false\r\n';
 const result=parseOrganizationDirectoryCsv(csv,"org1",[]);
 assert.equal(result.records.length,2);assert.equal(result.duplicates,1);
 assert.equal(result.records[0].displayName,"Amantle P, Junior");
 assert.equal(result.records[0].userPrincipalName,"amantle@tenant.invalid");
 assert.equal(result.records[0].city,"Gaborone");
 assert.equal(result.records[1].active,false);
 const second=parseOrganizationDirectoryCsv(csv,"org1",result.records);
 assert.equal(second.records[0].id,result.records[0].id);
 const merged=mergeOrganizationDirectory([...result.records,{...result.records[0],id:"else",orgId:"org2"}],"org1",second.records);
 assert.equal(merged.filter(p=>p.orgId==="org2").length,1);
 assert.throws(()=>mergeOrganizationDirectory([],"org1",[{...result.records[0],orgId:"org2"}]));
});
test("Graph mapper keeps email, principal UPN, office location, department and city separate",()=>{
 const p=mapGraphUser({id:"g1",displayName:"Mpho Scientist",mail:"mp@example.invalid",userPrincipalName:"mp@tenant.invalid",
  city:"Francistown",officeLocation:"Area 5",department:"Safety",jobTitle:"Officer",accountEnabled:true},"org1");
 assert.equal(p.id,"m365:g1");
 assert.equal(p.email,"mp@example.invalid");
 assert.equal(p.userPrincipalName,"mp@tenant.invalid");
 assert.equal(p.city,"Francistown");assert.equal(p.officeLocation,"Area 5");
 assert.equal(searchOrganizationPeople([p],{orgId:"org1",search:"Francistown"}).total,1);
 const facets=deriveOrganizationFacets({...demoOrganization,id:"org1",departments:["Engineering"],cities:["Gaborone"]},[p]);
 assert.ok(facets.departments.includes("Safety"));assert.ok(facets.cities.includes("Francistown"));
});
test("CSV rejects oversized, malformed and missing-identity inputs without modifying storage",()=>{
 assert.throws(()=>parseOrganizationDirectoryCsv("Department,Location\nSHE,Jwaneng","org1"));
 assert.throws(()=>parseOrganizationDirectoryCsv('DisplayName,Email\n"Unclosed','org1'));
 assert.throws(()=>parseOrganizationDirectoryCsv("DisplayName,Email\nA,b\n",""));
 assert.throws(()=>parseOrganizationDirectoryCsv("x".repeat(2_000_001),"org1"));
});
