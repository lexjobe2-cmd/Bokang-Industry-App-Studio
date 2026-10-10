import test from "node:test";
import assert from "node:assert/strict";
import { evaluateForm, makeSubmission, starterAssuranceTemplates } from "../packages/domain-data/src/assurance-forms.ts";
import { riskScore, releaseGroundedAsset } from "../packages/domain-data/src/operational-assurance.ts";
import { chooseStorageTarget } from "../packages/integrations/src/drive-network.ts";
import { verifyFleetRelease, finalizeFleetRelease } from "../apps/web/lib/fleet-release.ts";
import { scoreRisk, defaultRiskMatrix } from "../packages/domain-data/src/risk-matrix.ts";

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

const localSupervisorReview={
 kind:"drawn-signature-v1",imageDataUrl:"data:image/png;base64,"+"iVBORw0KGgoAAAANSUhEUgAA".repeat(5),
 signerName:"Demo Supervisor",signerPersonId:"supervisor-demo-1",role:"Supervisor",intent:"review",
 signedAt:"2026-10-09T07:00:00.000Z",scope:"Unit test sign off",verification:"LOCAL_UNVERIFIED",consent:true
};
test("repeatable JSA step cannot be submitted with blank required fields",()=>{
 const jsa=starterAssuranceTemplates.find(t=>t.id==="jsa");
 const draft={job:"Haul waste",workarea:"Demo",supervisor:"Shift lead",steps:[{}]};
 assert.equal(evaluateForm(jsa,draft).decision,"INCOMPLETE");
 const complete={...draft,steps:[{step:"Load truck",hazard:"Interaction",control:"Exclusion zone",responsible:"Operator",risk:9}],
   supervisor_reviewer:"supervisor-demo-1",supervisor_review_signature:localSupervisorReview};
 assert.equal(evaluateForm(jsa,complete).decision,"COMPLETE");
});
test("risk calculations are derived from likelihood and consequence, not typed score",()=>{
 const risk={likelihood:4,consequence:5,matrixId:defaultRiskMatrix.id,matrixVersion:defaultRiskMatrix.version};
 assert.deepEqual(scoreRisk(defaultRiskMatrix,risk),{score:20,level:"EXTREME",requiresApproval:true});
 const jra=starterAssuranceTemplates.find(t=>t.id==="jra");
 const draft={task:"Lift",location:"Workshop",hazard:"Suspended load",exposure:["Crew"],initial:risk,controls:"Barricade and qualified rigger",residual:risk,
  supervisor_reviewer:"supervisor-demo-1",supervisor_review_signature:localSupervisorReview};
 assert.equal(evaluateForm(jra,draft).decision,"REVIEW");
 assert.equal(evaluateForm(jra,{...draft,residual:{...risk,likelihood:0}}).decision,"INCOMPLETE");
});

import {
 dictionary,makeCustomTemplate,nextPublishedVersion,mapGraphUser,mapGraphOrganization,
 demoOrganization,demoPeople,blankJra,blankJraTask,blankHazard,assessJra,canSimulateApproval
} from "../packages/domain-data/src/custom-assurance.ts";

test("custom form library accepts dynamically branded and repeatable field sets",()=>{
 const org={...demoOrganization,logoDataUrl:"data:image/png;base64,ZmFrZQ==",name:"Demo Contractor"};
 const sections=[{id:"crew",title:"Crew",fields:[
   {id:"attendees",label:"Register",type:"repeat",required:true,children:[
    {id:"name",label:"Name",type:"text",required:true},
    {id:"role",label:"Job role",type:"text",required:true}
   ]},
   {id:"inspection",label:"Critical permit",type:"pass_fail_na",critical:true,required:true}
 ]}];
 const t=makeCustomTemplate({id:"custom-1",organization:org,title:"Site JSA briefing",category:"Safety",description:"Field checks",sections,now:"2026-10-08T12:00:00Z",status:"PUBLISHED"});
 assert.equal(t.companyNameSnapshot,"Demo Contractor");
 assert.equal(t.logoSnapshot,org.logoDataUrl);
 assert.equal(evaluateForm(t,{attendees:[{name:"Person A",role:"Operator"}],inspection:"PASS"}).decision,"COMPLETE");
 assert.equal(evaluateForm(t,{attendees:[{name:"",role:"Operator"}],inspection:"PASS"}).decision,"INCOMPLETE");
 const submitted=makeSubmission({id:"form1",template:t,answers:{attendees:[{name:"Person A",role:"Operator"}],inspection:"PASS"},siteId:"mine",actorUid:"demo",now:"2026-10-08T12:00:00Z"});
 assert.equal(submitted.templateSnapshot.companyNameSnapshot,"Demo Contractor");
 org.name="Changed branding";
 assert.equal(submitted.templateSnapshot.companyNameSnapshot,"Demo Contractor");
 const next=nextPublishedVersion(t,"2026-10-09T08:00:00Z");
 assert.equal(next.version,2);
 assert.equal(t.version,1);
});
test("template builder rejects duplicate field keys and choice questions with no values",()=>{
 const args={id:"custom1",organization:demoOrganization,title:"Routine inspection",category:"Inspections",description:"",now:"2026-10-08T12:00:00Z",sections:[{id:"1",title:"Part A",fields:[{id:"duplicate",label:"A",type:"text"},{id:"duplicate",label:"B",type:"text"}]}]};
 assert.throws(()=>makeCustomTemplate(args),/unique identifiers/);
 assert.throws(()=>makeCustomTemplate({...args,sections:[{id:"1",title:"Part A",fields:[{id:"choice",label:"Select",type:"select",options:[]}]}]}),/requires options/);
});
test("Microsoft Graph user and organization metadata map into company dictionary without API call",()=>{
 const user=mapGraphUser({id:"abc123",displayName:"Demo User",mail:"demo@company.invalid",department:"Mining",jobTitle:"Operator"},demoOrganization.id);
 assert.equal(user.source,"MICROSOFT_365");
 assert.equal(user.jobTitle,"Operator");
 const org=mapGraphOrganization({id:"tenant1",displayName:"Example Owner",verifiedDomains:[{name:"example.invalid",isDefault:true}]},"2026-10-08T00:00:00Z");
 assert.equal(org.domain,"example.invalid");
 assert.equal(org.name,"Example Owner");
 assert.equal(dictionary.hierarchyOfControls.length,5);
});
test("rich JRA demands people, hazard controls and valid initial/residual risk",()=>{
 const now="2026-10-08T13:00:00Z";
 const jra=blankJra(demoOrganization,now);
 jra.title="Brake maintenance";jra.jobId="WO-81";jra.scope="Replace worn brakes";
 jra.location="Workshop bay 4";jra.supervisorId=demoPeople[1].id;
 jra.emergencyPlan="Call site emergency and isolate workshop";
 jra.participants=[{personId:demoPeople[2].id,nameSnapshot:demoPeople[2].displayName,role:"Operator",acknowledged:true,manual:false}];
 const task=blankJraTask(1);task.description="Isolate vehicle";
 const hazard=blankHazard();hazard.hazard="Unexpected movement";hazard.consequence="Crush injury";
 hazard.exposedPersonIds=[demoPeople[2].id];
 hazard.controls=[{id:"c1",hierarchy:"Engineering",description:"Lockout and wheel chocks",ownerId:demoPeople[2].id,verified:true}];
 hazard.initial={likelihood:4,consequence:5,matrixId:"standard-5x5",matrixVersion:1};
 hazard.residual={likelihood:1,consequence:3,matrixId:"standard-5x5",matrixVersion:1};
 task.hazards=[hazard];jra.tasks=[task];
 assert.deepEqual(assessJra(jra).missing,[]);
 assert.equal(assessJra(jra).decision,"READY_FOR_DEMO_REVIEW");
 jra.reviewerId=demoPeople[0].id;
 // A checked box by itself is not a drawn acknowledgement.
 assert.equal(canSimulateApproval(jra),false);
 jra.participants[0].signature={...localSupervisorReview,signerPersonId:jra.participants[0].personId,
  signerName:jra.participants[0].nameSnapshot,intent:"acknowledgement",
  scope:jra.reference||jra.title||"JRA task review"};
 assert.equal(canSimulateApproval(jra),true);
 jra.reviewerId=jra.supervisorId;
 assert.equal(canSimulateApproval(jra),false);
 jra.reviewerId=demoPeople[0].id;
 jra.participants[0].acknowledged=false;
 assert.equal(canSimulateApproval(jra),false);
 hazard.residual.likelihood=5;
 assert.equal(assessJra(jra).decision,"REVIEW_REQUIRED");
 assert.equal(canSimulateApproval(jra),false);
 hazard.controls=[];
 assert.ok(assessJra(jra).missing.some(v=>v.includes("mitigation")));
});

import {templateRecipes, sampleBrakeMaintenanceJra, mapDirectoryAdminCandidates, MICROSOFT_GLOBAL_ADMIN_ROLE} from "../packages/domain-data/src/custom-assurance.ts";

test("every catalog recipe is structurally valid and publishable",()=>{
 assert.equal(templateRecipes.length,8);
 for(const recipe of templateRecipes){
  const custom=makeCustomTemplate({id:recipe.id,organization:demoOrganization,title:recipe.title,category:recipe.category,description:recipe.description,sections:recipe.sections,now:"2026-10-08T12:00:00Z",status:"PUBLISHED"});
  assert.ok(custom.sections.length>=1);
  assert.equal(custom.status,"PUBLISHED");
  assert.ok(custom.sections.every(section=>section.fields.length>0));
 }
});
test("sample field JRA generates three complete hazard narratives but no false approvals",()=>{
 const jra=sampleBrakeMaintenanceJra(demoOrganization,demoPeople,"2026-10-08T12:00:00Z");
 assert.equal(jra.tasks.length,3);
 assert.ok(jra.tasks.every(task=>task.hazards.every(h=>h.hazard&&h.consequence&&h.controls.length)));
 assert.ok(jra.participants.length>0);
 assert.equal(canSimulateApproval(jra),false);
});
test("Microsoft tenant admin candidates must not become organization owners automatically",()=>{
 const person=mapGraphUser({id:"azure-user",displayName:"Demo Admin",jobTitle:"Manager"},demoOrganization.id);
 const admins=mapDirectoryAdminCandidates([{principalId:"azure-user",roleDefinitionId:MICROSOFT_GLOBAL_ADMIN_ROLE,directoryScopeId:"/"}],[person]);
 assert.deepEqual(admins,[person.id]);
 assert.deepEqual(mapDirectoryAdminCandidates([{principalId:"azure-user",roleDefinitionId:"not-admin"}],[person]),[]);
 assert.equal(demoOrganization.ownerIds.includes(person.id),false);
});

test("conditional form questions are only required when a matching answer is selected",()=>{
 const sections=[{id:"c1",title:"Permit check",fields:[
  {id:"permit",label:"Is a permit required?",type:"yes_no",required:true},
  {id:"permit_no",label:"Permit number",type:"text",required:true,visibleWhen:{fieldId:"permit",equals:"YES"}}
 ]}];
 const template=makeCustomTemplate({id:"cond",organization:demoOrganization,title:"Permit verification",category:"Safety",description:"",sections,now:"2026-10-08T00:00:00Z",status:"PUBLISHED"});
 assert.equal(evaluateForm(template,{permit:"NO"}).decision,"COMPLETE");
 assert.equal(evaluateForm(template,{permit:"YES"}).decision,"INCOMPLETE");
 assert.equal(evaluateForm(template,{permit:"YES",permit_no:"PTW-001"}).decision,"COMPLETE");
 assert.throws(()=>makeCustomTemplate({...template,id:"bad",organization:demoOrganization,now:"2026-10-08T00:00:00Z",
  sections:[{id:"1",title:"Broken",fields:[{id:"f1",label:"Required",type:"text",visibleWhen:{fieldId:"not_found",equals:"YES"}}]}]}),/missing or self-dependent/);
});
test("unverified hazard control prohibits simulation approval",()=>{
 const jra=sampleBrakeMaintenanceJra(demoOrganization,demoPeople,"2026-10-08T00:00:00Z");
 assert.equal(assessJra(jra).decision,"REVIEW_REQUIRED");
 assert.ok(assessJra(jra).unverifiedControls>0);
 for(const step of jra.tasks)for(const hazard of step.hazards)for(const control of hazard.controls)control.verified=true;
 assert.equal(assessJra(jra).unverifiedControls,0);
 assert.equal(assessJra(jra).decision,"READY_FOR_DEMO_REVIEW");
});

import {additionalAssuranceRecipes,validateWorkflowGraph,workflowLinks} from "../packages/domain-data/src/expanded-assurance.ts";
test("21 new workflows have connected graphs and unique enforceable critical checks",()=>{
 assert.equal(additionalAssuranceRecipes.length,21);
 assert.equal(validateWorkflowGraph(),true);
 const ids=new Set(additionalAssuranceRecipes.map(r=>r.id));
 assert.equal(ids.has("working-at-height"),true);
 for(const recipe of additionalAssuranceRecipes){
  assert.ok(recipe.sections.length>=3);
  const fields=recipe.sections.flatMap(s=>s.fields);
  assert.ok(fields.filter(f=>f.critical).length>=4);
  assert.ok(fields.some(f=>f.type==="people"));
  assert.ok(fields.some(f=>f.type==="person"));
  assert.ok(fields.some(f=>f.type==="risk"));
  for(const id of workflowLinks(recipe.id))assert.ok(ids.has(id));
  const branded=makeCustomTemplate({
   id:"op-demo-mining-"+recipe.id,organization:demoOrganization,title:recipe.title,category:recipe.category,
   description:recipe.description,sections:recipe.sections,now:"2026-10-08T13:00:00Z",status:"PUBLISHED"
  });
  const incomplete=evaluateForm(branded,{});
  assert.equal(incomplete.decision,"INCOMPLETE");
  const critical=fields.find(f=>f.critical);
  assert.ok(critical);
  assert.equal(evaluateForm(branded,{[critical.id]:"FAIL"}).decision,"NO_GO");
 }
});
test("working at height captures collective fall protection, dropped objects and rescue",()=>{
 const wf=additionalAssuranceRecipes.find(x=>x.id==="working-at-height");
 assert.ok(wf);
 const labels=wf.sections.flatMap(s=>s.fields.map(f=>f.label)).join(" ").toLowerCase();
 for(const phrase of ["ground level","guardrails","anchor","falling-object","rescue","weather","working height"])
   assert.ok(labels.includes(phrase),"Missing height control: "+phrase);
});

test("supervisor signing tray is mandatory for all reviewed core and 21 specialist forms",()=>{
 for(const template of starterAssuranceTemplates.filter(t=>["meeting-register","toolbox-brief","jsa","jra","shift-handover"].includes(t.id))){
  const fields=template.sections.flatMap(s=>s.fields);
  assert.ok(fields.some(f=>f.id==="supervisor_review_signature"&&f.required&&f.signerFieldId==="supervisor_reviewer"),template.id);
  assert.equal(template.version,template.id==="meeting-register"?3:2);
 }
 for(const recipe of additionalAssuranceRecipes){
  const fields=recipe.sections.flatMap(s=>s.fields);
  assert.ok(fields.some(f=>f.id==="review_signature"&&f.required&&f.signerFieldId==="reviewer"),recipe.id);
 }
});
test("reviewer identity, signed intent and exact site/job scope must agree before a checklist can be submitted",()=>{
 const template={id:"signed-check",version:1,title:"Height safety",category:"Safety",status:"PUBLISHED",effectiveDate:"2026-10-09",siteIds:[],assetClasses:[],
  sections:[{id:"review",title:"Review",fields:[
   {id:"supervisor_reviewer",label:"Supervisor",type:"person",required:true},
   {id:"supervisor_review_signature",label:"Supervisor review",type:"signature",required:true,signerFieldId:"supervisor_reviewer"}]}]};
 const scope="Height safety / WORK-129 / Jwaneng / demo-mining";
 const sig={...localSupervisorReview,scope:scope+" / Supervisor review"};
 const base={supervisor_reviewer:"supervisor-demo-1",supervisor_review_signature:sig};
 assert.equal(evaluateForm(template,base,[],scope).decision,"COMPLETE");
 assert.equal(evaluateForm(template,{...base,supervisor_reviewer:"someone-else"},[],scope).decision,"INCOMPLETE");
 assert.equal(evaluateForm(template,{...base,supervisor_review_signature:{...sig,intent:"attendance"}},[],scope).decision,"INCOMPLETE");
 assert.equal(evaluateForm(template,base,[],scope+" / different-site").decision,"INCOMPLETE");
 assert.throws(()=>makeSubmission({id:"s1",template,answers:base,siteId:"Other site",actorUid:"demo",signatureScopePrefix:scope+" / different-site",now:"2026-10-09T09:00:00Z"}),/Required/);
});

test("material JRA changes revoke earlier crew marks and reviewer approval",async()=>{
 const {invalidateJraAcknowledgements}=await import("../packages/domain-data/src/custom-assurance.ts");
 const jra=blankJra(demoOrganization,"2026-10-09T08:30:00Z");
 jra.status="APPROVED_DEMO";
 jra.reviewSignature={...localSupervisorReview,scope:jra.reference,role:"Independent reviewer"};
 jra.reviewedAt="2026-10-09T08:30:00Z";
 jra.participants=[{personId:"demo-person",nameSnapshot:"Worker",role:"Operator",
   acknowledged:true,acknowledgedAt:"2026-10-09T08:30:00Z",
   signature:{...localSupervisorReview,signerPersonId:"demo-person",intent:"acknowledgement",scope:jra.reference},manual:true}];
 const reset=invalidateJraAcknowledgements(jra);
 assert.equal(reset.status,"IN_REVIEW");
 assert.equal(reset.reviewSignature,undefined);
 assert.equal(reset.reviewedAt,undefined);
 assert.equal(reset.participants[0].acknowledged,false);
 assert.equal(reset.participants[0].signature,undefined);
 assert.equal(reset.participants[0].acknowledgedAt,undefined);
 assert.equal(jra.participants[0].acknowledged,true,"previous snapshot must remain unchanged");
});
