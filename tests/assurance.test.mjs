import test from "node:test";
import assert from "node:assert/strict";
import { evaluateForm, makeSubmission, starterAssuranceTemplates } from "../packages/domain-data/src/assurance-forms.ts";
import { riskScore, releaseGroundedAsset } from "../packages/domain-data/src/operational-assurance.ts";
import { chooseStorageTarget } from "../packages/integrations/src/drive-network.ts";
import { verifyFleetRelease, finalizeFleetRelease } from "../apps/web/lib/fleet-release.ts";

const template = {
 id:"unit-check", version:1, title:"Safety checks",category:"Fleet",status:"PUBLISHED",
 effectiveDate:"2026-10-08",siteIds:[],assetClasses:[],
 sections:[{id:"s",title:"Checks",fields:[
   {id:"brake",label:"Brakes",type:"pass_fail_na",critical:true,required:true},
   {id:"comment",label:"Notes",type:"text",required:true}
 ]}]
};
test("critical failure results in NO_GO",()=>{
 const result=evaluateForm(template,{brake:"FAIL",comment:"Defect present"});
 assert.equal(result.decision,"NO_GO");
 assert.deepEqual(result.criticalFailures,["brake"]);
});
test("missing answers never make a complete submission",()=>{
 assert.equal(evaluateForm(template,{brake:"PASS"}).decision,"INCOMPLETE");
 assert.throws(()=>makeSubmission({id:"a",template,answers:{brake:"PASS"},siteId:"mine",actorUid:"test",now:"2026-10-08T00:00:00Z"}),/Required/);
});
test("N/A is not acceptable for a critical question",()=>{
 assert.equal(evaluateForm(template,{brake:"NA",comment:"N/A attempted"}).decision,"NO_GO");
});
test("completed submissions snapshot template and answers",()=>{
 const answers={brake:"PASS",comment:"Working"};
 const record=makeSubmission({id:"inspection-1",template,answers,siteId:"mine",actorUid:"verified-demo",now:"2026-10-08T00:00:00Z"});
 answers.comment="Tampered draft";
 assert.equal(record.answers.comment,"Working");
 assert.equal(record.templateVersion,1);
 assert.equal(record.syncStatus,"PENDING");
});
test("risk levels and approval controls",()=>{
 assert.deepEqual(riskScore(5,5),{score:25,level:"EXTREME",requiresApproval:true});
 assert.throws(()=>riskScore(6,1));
});
test("grounded release fails closed",()=>{
 const asset={id:"a",fleetNumber:"LV-1",name:"Truck",assetClass:"light-vehicle",siteId:"mine",state:"GROUNDED"};
 const record={id:"release-1",assetId:"a",repairEvidenceId:"e1",reinspectionId:"r1",approverId:"supervisor",approvedAt:"2026-10-08T01:00:00Z"};
 assert.throws(()=>releaseGroundedAsset(asset,[],record,false),/required/);
 assert.equal(releaseGroundedAsset(asset,[],record,true).state,"AVAILABLE");
});
test("Drive target without consent is forbidden",()=>{
 assert.throws(()=>chooseStorageTarget({ownerNodeId:"u",storageNodeId:"s",location:"PERSONAL",folderId:"folder",consented:false,writable:true}),/Authorized/);
});
test("starter template library covers fleet, meetings, briefing, JSA, JRA, handover",()=>{
 assert.equal(starterAssuranceTemplates.length,6);
 assert.equal(new Set(starterAssuranceTemplates.map(t=>t.id)).size,6);
});

test("grounded vehicle cannot be released with open defect",()=>{
 const vehicle={id:"v1",fleetNo:"LV-01",registration:"B 001 ABC",makeModel:"Hilux",type:"Pickup / LDV",site:"demo",status:"No-go",odometerKm:0,roadworthyExpiry:"2027-12-31",extinguisherServiceDue:"2027-12-31",nextServiceKm:1000};
 const repair={id:"repair1",vehicleId:"v1",incidentIds:["defect1"],repairedBy:"mechanic",repairNotes:"Brakes changed",evidenceReference:"DEMO-ref",recordedAt:"2026-10-08T08:00:00Z"};
 const reinspection={id:"inspect1",vehicleId:"v1",inspectionBy:"inspector",verdict:"PASS",checkedControls:["Brakes"],performedAt:"2026-10-08T09:00:00Z"};
 const params={vehicle,incidents:[{id:"defect1",vehicleId:"v1",status:"Open",severity:"Critical",category:"Defect",description:"Brakes",createdAt:"2026-10-08T07:00:00Z"}],repair,reinspection,approver:"supervisor",baselineCertificatesValid:true,now:"2026-10-08T10:00:00Z"};
 assert.equal(verifyFleetRelease(params).allowed,false);
 assert.throws(()=>finalizeFleetRelease(params,"release1"));
 const cleared={...params,incidents:params.incidents.map(i=>({...i,status:"Resolved"}))};
 const released=finalizeFleetRelease(cleared,"release1");
 assert.equal(released.vehicle.status,"Inspection due");
 assert.equal(released.record.decision,"RELEASED_FOR_PRESTART");
});
test("maintenance/inspector/approver cannot self-approve",()=>{
 const vehicle={id:"v1",status:"No-go"};
 const repair={id:"r1",vehicleId:"v1",incidentIds:[],repairedBy:"operator",repairNotes:"done",evidenceReference:"proof",recordedAt:"2026-10-08T08:00:00Z"};
 const reinspection={id:"i1",vehicleId:"v1",inspectionBy:"operator",verdict:"PASS",checkedControls:["Brake"],performedAt:"2026-10-08T09:00:00Z"};
 const reasons=verifyFleetRelease({vehicle,incidents:[],repair,reinspection,approver:"operator",baselineCertificatesValid:true,now:"2026-10-08T10:00:00Z"}).reasons;
 assert.ok(reasons.some(reason=>reason.includes("different person")));
 assert.ok(reasons.some(reason=>reason.includes("cannot approve")));
});
