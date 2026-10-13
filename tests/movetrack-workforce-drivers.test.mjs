import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createLocalWorker,editableWorkerDetails,updateWorkerDetails} from "../apps/web/lib/workforce-profiles.ts";
import {editableDriverDetails,updateDriverDetails} from "../apps/web/lib/driver-admin.ts";
import {validateBackupShape} from "../packages/persistence/src/backup-shape.ts";
import {writeLocalValue,makeWorkspaceBackup,parseWorkspaceBackup,restoreWorkspaceBackup} from "../packages/persistence/src/local-store.ts";

const org="demo-mining";
const employee={id:"worker1",orgId:org,source:"MICROSOFT_365",externalId:"AAD-1",userPrincipalName:"ann@sample.invalid",
 displayName:"Ann Demo",email:"ann@sample.invalid",department:"Logistics",jobTitle:"Driver",location:"Gaborone",employeeNumber:"EMP-001",active:true,managerId:"boss1"};
const peer={...employee,id:"worker2",externalId:"AAD-2",email:"bob@sample.invalid",displayName:"Bob Demo",employeeNumber:"EMP-002"};
const pdf={id:"pdf1",name:"training.pdf",mimeType:"application/pdf",addedAt:"2026-10-09T12:00:00Z",dataUrl:"data:application/pdf;base64,JVBERi0="};
const driver={id:"DRV-1",name:"Ann Demo",phone:"+267 7000 0000",licenceNo:"BW-DL-123",siteAuthorised:true,openPitPermit:false,
 firstAid:true,defensiveDriving:true,status:"Assigned",personId:"worker1",authorizationReview:{signedAt:"2026-10-09T12:00:00Z",signature:{some:"existing"}},documents:[pdf]};
const driverTwo={...driver,id:"DRV-2",name:"Bob Demo",licenceNo:"BW-DL-999",documents:[],personId:"worker2"};
const assignment={id:"ASN-2",driverId:"DRV-1",vehicleId:"VEH-1",site:"Jwaneng",status:"In use",createdAt:"2026-10-09T12:00:00Z"};
class FakeStorage{
 data=new Map();
 get length(){return this.data.size}
 key(i){return [...this.data.keys()][i]??null}
 getItem(k){return this.data.has(k)?this.data.get(k):null}
 setItem(k,v){this.data.set(k,String(v))}
 removeItem(k){this.data.delete(k)}
}

test("employee profile edits keep stable directory/tenant identity and organization data",()=>{
 const updated=updateWorkerDetails([employee,peer],org,employee.id,{...editableWorkerDetails(employee),jobTitle:"Senior Driver",location:"Jwaneng"});
 assert.equal(updated[0].jobTitle,"Senior Driver");
 assert.equal(updated[0].location,"Jwaneng");
 for(const field of ["id","orgId","source","externalId","userPrincipalName","managerId"]){
  assert.equal(updated[0][field],employee[field]);
 }
 assert.deepEqual(updated[1],peer);
});
test("manual employee creation keeps the organization boundary and checks identities",()=>{
 const newcomer={displayName:"New Worker",email:"new@sample.invalid",department:"Maintenance",jobTitle:"Technician",location:"Orapa",employeeNumber:"EMP-003",active:true};
 const created=createLocalWorker([employee,peer],org,"manual-1",newcomer);
 assert.equal(created[0].id,"manual-1");
 assert.equal(created[0].source,"MANUAL");
 assert.equal(created[0].orgId,org);
 assert.throws(()=>createLocalWorker([employee],org,"new", {...newcomer,employeeNumber:"EMP-001"}),/employee number/);
 assert.throws(()=>createLocalWorker([employee],org,"new", {...newcomer,email:"ANN@SAMPLE.INVALID"}),/employee email/);
 assert.throws(()=>createLocalWorker([employee],org,"new", {...newcomer,email:"not an email"}),/valid work email/);
 assert.throws(()=>updateWorkerDetails([employee], "other-org","worker1",newcomer),/not found/);
});
test("driver edits leave safety permissions, signatures, assignment status and PDFs untouched",()=>{
 const next=updateDriverDetails([driver,driverTwo],"DRV-1",{...editableDriverDetails(driver),phone:"+267 7111 1111"},[assignment]);
 assert.equal(next[0].phone,"+267 7111 1111");
 assert.equal(next[0].status,"Assigned");
 assert.equal(next[0].siteAuthorised,true);
 assert.deepEqual(next[0].authorizationReview,driver.authorizationReview);
 assert.deepEqual(next[0].documents,[pdf]);
 assert.equal(next[0].personId,"worker1");
 assert.deepEqual(next[1],driverTwo);
});
test("duplicate driver licences and active-assignment changes are blocked",()=>{
 const fleet=[driver,driverTwo];
 assert.throws(()=>updateDriverDetails(fleet,"DRV-1",{...editableDriverDetails(driver),licenceNo:"BW DL 999"},[]),/already exists/);
 assert.throws(()=>updateDriverDetails(fleet,"DRV-1",{...editableDriverDetails(driver),licenceNo:"NEW LICENCE"},[assignment]),/active assignment/);
 assert.equal(updateDriverDetails(fleet,"DRV-1",{...editableDriverDetails(driver),licenceNo:"NEW LICENCE"},[])[0].licenceNo,"NEW LICENCE");
});
test("backup rejects invalid driver PDFs/references but accepts older driver records",()=>{
 const key="bokang-studio.move-track.drivers.v2";
 assert.doesNotThrow(()=>validateBackupShape(key,[driver]));
 assert.doesNotThrow(()=>validateBackupShape(key,[{...driver,documents:undefined,personId:undefined}]));
 assert.throws(()=>validateBackupShape(key,[{...driver,documents:[{...pdf,dataUrl:"data:text/html;base64,AAAA"}]}]),/PDF documents/);
 assert.throws(()=>validateBackupShape(key,[{...driver,documents:Array(5).fill(pdf)}]),/PDF documents/);
 assert.throws(()=>validateBackupShape(key,[{...driver,personId:7}]),/directory reference/);
});
test("workforce and driver edits plus attachments roundtrip a complete browser backup",async()=>{
 const prev=globalThis.window;
 const storage=new FakeStorage();
 globalThis.window={localStorage:storage,addEventListener(){}};
 try{
  const directoryKey="bokang-studio.move-track.directory.v1",driverKey="bokang-studio.move-track.drivers.v2";
  const staff=updateWorkerDetails([employee],org,"worker1",{...editableWorkerDetails(employee),jobTitle:"Fleet Supervisor"});
  const fleet=updateDriverDetails([driver],"DRV-1",{...editableDriverDetails(driver),name:"Ann Supervisor"},[assignment]);
  writeLocalValue(directoryKey,staff);
  writeLocalValue(driverKey,fleet);
  const backup=parseWorkspaceBackup(JSON.stringify(makeWorkspaceBackup(storage)));
  const other=new FakeStorage();
  assert.equal(restoreWorkspaceBackup(other,backup),2);
  assert.equal(JSON.parse(other.getItem(directoryKey))[0].jobTitle,"Fleet Supervisor");
  assert.equal(JSON.parse(other.getItem(driverKey))[0].name,"Ann Supervisor");
  assert.equal(JSON.parse(other.getItem(driverKey))[0].documents[0].name,"training.pdf");
  const fresh=await import("../packages/persistence/src/local-store.ts?workforce-drivers-refresh");
  assert.equal(fresh.getLocalValue(driverKey,[])[0].personId,"worker1");
 }finally{globalThis.window=prev}
});
test("admin forms and driver assignment cards reuse existing workspaces",()=>{
 const driverUI=readFileSync(new URL("../apps/web/components/products/MoveTrackShowcase.tsx",import.meta.url),"utf8");
 const workforceUI=readFileSync(new URL("../apps/web/components/products/WorkforceDirectoryWorkspace.tsx",import.meta.url),"utf8");
 assert.match(driverUI,/updateDriverDetails\(drivers,editingDriverId,editDriverDetails,assignments\)/);
 assert.match(driverUI,/adminMode\?<VehicleDocuments label="Driver documents"/);
 assert.match(driverUI,/linked to an inactive or missing company workforce identity/);
 assert.match(driverUI,/Assignments · \{current.length\} active/);
 assert.match(driverUI,/status:"Available"/);
 assert.match(workforceUI,/CompanyDirectoryImport org=\{org\} people=\{people\} setPeople=\{setPeople\}/);
 assert.match(workforceUI,/updateWorkerDetails\(people,org.id,editingId,draft\)/);
 assert.match(workforceUI,/adminMode\?<button type="button"/);
});
