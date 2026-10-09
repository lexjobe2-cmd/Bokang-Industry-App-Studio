import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {editableDetails,updateVehicleDetails} from "../apps/web/lib/fleet-vehicle-admin.ts";
import {vehicleDocumentError,isPdfHeader,MAX_VEHICLE_DOCUMENT_BYTES} from "../apps/web/lib/vehicle-documents.ts";
import {validateBackupShape} from "../packages/persistence/src/backup-shape.ts";
import {writeLocalValue,makeWorkspaceBackup,parseWorkspaceBackup,restoreWorkspaceBackup} from "../packages/persistence/src/local-store.ts";

const photo={id:"p1",name:"front.jpg",addedAt:"2026-10-09T10:00:00Z",dataUrl:"data:image/jpeg;base64,AAAA"};
const pdf={id:"doc1",name:"roadworthy.pdf",mimeType:"application/pdf",addedAt:"2026-10-09T10:00:00Z",dataUrl:"data:application/pdf;base64,JVBERi0="};
const vehicle={
 id:"VEH-1",fleetNo:"LV-007",registration:"B 123 ABC",makeModel:"Hilux",
 type:"Pickup",site:"Jwaneng",status:"Available",odometerKm:5000,
 roadworthyExpiry:"2027-01-01",extinguisherServiceDue:"2027-02-02",nextServiceKm:7000,
 images:[photo],documents:[pdf]
};
const second={...vehicle,id:"VEH-2",fleetNo:"LV-008",registration:"B 200 ABC",images:[],documents:[]};
class FakeStorage{
 items=new Map();
 get length(){return this.items.size;}
 key(i){return [...this.items.keys()][i]??null;}
 getItem(k){return this.items.has(k)?this.items.get(k):null;}
 setItem(k,v){this.items.set(k,String(v));}
 removeItem(k){this.items.delete(k);}
}
test("admin edits retain IDs, odometer, images, documents and other fleet records",()=>{
 const draft={...editableDetails(vehicle),makeModel:"Hilux 2.8"};
 const result=updateVehicleDetails([vehicle,second],vehicle.id,draft,[]);
 assert.equal(result[0].makeModel,"Hilux 2.8");
 assert.equal(result[0].status,"Available");
 assert.equal(result[0].odometerKm,5000);
 assert.deepEqual(result[0].images,[photo]);
 assert.deepEqual(result[0].documents,[pdf]);
 assert.deepEqual(result[1],second);
});
test("changing site or certificate expires any existing uninspected available clearance",()=>{
 const edited=updateVehicleDetails([vehicle],vehicle.id,{...editableDetails(vehicle),site:"Orapa"},[]);
 assert.equal(edited[0].status,"Inspection due");
 const grounded={...vehicle,status:"No-go"};
 assert.equal(updateVehicleDetails([grounded],"VEH-1",{...editableDetails(grounded),roadworthyExpiry:"2028-01-01"},[])[0].status,"No-go");
});
test("duplicate, invalid dates and active assignment identity changes are blocked",()=>{
 const fleet=[vehicle,second];
 assert.throws(()=>updateVehicleDetails(fleet,vehicle.id,{...editableDetails(vehicle),registration:"B-200abc"},[]),/registration already exists/);
 assert.throws(()=>updateVehicleDetails(fleet,vehicle.id,{...editableDetails(vehicle),roadworthyExpiry:"2027-02-30"},[]),/valid expiry/);
 const assignment={id:"ASN-1",vehicleId:"VEH-1",driverId:"DRV-1",site:"Jwaneng",status:"In use",createdAt:"2026-10-09T00:00:00Z"};
 assert.throws(()=>updateVehicleDetails(fleet,vehicle.id,{...editableDetails(vehicle),fleetNo:"LV-900"},[assignment]),/active assignment/);
 assert.throws(()=>updateVehicleDetails(fleet,vehicle.id,{...editableDetails(vehicle),roadworthyExpiry:"2028-02-01"},[assignment]),/active assignment/);
 assert.equal(updateVehicleDetails(fleet,vehicle.id,{...editableDetails(vehicle),makeModel:"New name"},[assignment])[0].status,"Available");
});
test("local PDFs have explicit content, format and upload size limits",()=>{
 assert.equal(vehicleDocumentError({name:"licence.pdf",type:"application/pdf",size:2000}),undefined);
 assert.match(vehicleDocumentError({name:"photo.png",type:"image/png",size:123})??"",/PDF/);
 assert.match(vehicleDocumentError({name:"huge.pdf",type:"application/pdf",size:MAX_VEHICLE_DOCUMENT_BYTES+1})??"",/250 KB/);
 assert.equal(isPdfHeader(new TextEncoder().encode("%PDF-1.7")),true);
 assert.equal(isPdfHeader(new TextEncoder().encode("<html>")),false);
});
test("PDF documents validate during backup import, keeping old fleets compatible",()=>{
 const key="bokang-studio.move-track.fleet.v2";
 assert.doesNotThrow(()=>validateBackupShape(key,[vehicle]));
 assert.doesNotThrow(()=>validateBackupShape(key,[{...vehicle,documents:undefined}]));
 assert.throws(()=>validateBackupShape(key,[{...vehicle,documents:[{...pdf,mimeType:"text/html"}]}]),/PDF documents/);
 assert.throws(()=>validateBackupShape(key,[{...vehicle,documents:Array(5).fill(pdf)}]),/PDF documents/);
 assert.throws(()=>validateBackupShape(key,[{...vehicle,documents:[{...pdf,dataUrl:"data:text/html;base64,AAAA"}]}]),/PDF documents/);
});
test("fleet details, images and PDFs are recovered from persisted storage in a fresh session",async()=>{
 const previous=globalThis.window;
 const storage=new FakeStorage();
 globalThis.window={localStorage:storage,addEventListener(){}};
 try{
  const key="bokang-studio.move-track.fleet.v2";
  const saved=updateVehicleDetails([vehicle],vehicle.id,{...editableDetails(vehicle),makeModel:"Saved after edit"},[]);
  writeLocalValue(key,saved);
  assert.ok(storage.getItem(key).includes("Saved after edit"));
  // A separate module instance simulates refresh and reload from the same browser storage.
  const reloaded=await import("../packages/persistence/src/local-store.ts?vehicle-management-refresh");
  const restored=reloaded.getLocalValue(key,[]);
  assert.equal(restored[0].makeModel,"Saved after edit");
  assert.equal(restored[0].id,vehicle.id);
  assert.equal(restored[0].images[0].id,photo.id);
  assert.equal(restored[0].documents[0].id,pdf.id);
  const backup=parseWorkspaceBackup(JSON.stringify(makeWorkspaceBackup(storage)));
  const secondStore=new FakeStorage();
  restoreWorkspaceBackup(secondStore,backup);
  assert.deepEqual(JSON.parse(secondStore.getItem(key)),saved);
 }finally{globalThis.window=previous;}
});
test("fleet admin controls edit metadata in a contained modal rather than direct date writes",()=>{
 const source=readFileSync(new URL("../apps/web/components/products/MoveTrackShowcase.tsx",import.meta.url),"utf8");
 assert.match(source,/Edit vehicle details/);
 assert.match(source,/updateVehicleDetails\(fleet,editingVehicleId,editDetails,assignments\)/);
 assert.match(source,/VehicleDocuments readOnly=\{!adminMode\}/);
 assert.ok(!source.includes('disabled={!adminMode} value={vehicle.roadworthyExpiry'));
});
