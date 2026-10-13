import test from "node:test";
import assert from "node:assert/strict";
import {
 AVIATION_WORKFLOWS,evaluateAviationObservation,makeAviationObservation,updateAviationFollowUp
} from "../apps/web/lib/aviation-operations.ts";
import {AVIATION_SECTORS,HELICOPTER_CHECKLIST_BOUNDARIES,AVIATION_SAFETY_REFERENCES}
 from "../apps/web/lib/aviation-sector-profiles.ts";

const workflow=id=>{
 const value=AVIATION_WORKFLOWS.find(w=>w.id===id);
 assert.ok(value,"Missing workflow: "+id);
 return value;
};
const answersFor=(id,issueId)=>{
 const w=workflow(id);
 return w.checks.map(c=>({checkId:c.id,status:c.id===issueId?"ISSUE":"OBSERVED_OK",detail:c.id===issueId?"Visible discrepancy reported to supervisor":""}));
};
const sample=(id,overrides={})=>({
 id:"AV-1",workflowId:id,airport:"TEST FACILITY",site:"Non-sensitive demo area",
 aircraftRegistration:"CIVIL-DEMO-01",equipmentId:"GSE-EXAMPLE",
 sectorId:"MINING",airframeKind:id==="helicopter-ground-safety"||id==="helicopter-mission-support"?"HELICOPTER":"NOT_APPLICABLE",
 observer:"Demo Inspector",procedureReference:"DEMO-NOT-APPROVED",procedureRevision:"DEMO",
 performedAt:"2026-10-12T08:00:00Z",notes:"Simulation only",
 answers:answersFor(id),actions:[],...overrides
});
test("aviation supports civil, government, mining, defence logistics, HEMS and infrastructure sectors",()=>{
 assert.deepEqual(new Set(AVIATION_SECTORS.map(s=>s.id)),
  new Set(["COMMERCIAL","GOVERNMENT","DEFENCE_SUPPORT","MINING","HEMS_RESCUE","UTILITY"]));
 const ids=new Set(AVIATION_WORKFLOWS.map(w=>w.id));
 for(const sector of AVIATION_SECTORS){
  assert.ok(sector.priorityWorkflowIds.every(id=>ids.has(id)),sector.id);
  assert.ok(sector.handlingNotice.length>=30);
 }
 assert.match(AVIATION_SECTORS.find(s=>s.id==="DEFENCE_SUPPORT").handlingNotice,/classified|sensitive/i);
});
test("helicopter, heliport and rotorcraft discrepancy workflows have distinct check headings",()=>{
 const heliIds=HELICOPTER_CHECKLIST_BOUNDARIES.map(t=>t.id);
 for(const id of heliIds){
  const w=workflow(id);
  assert.ok(w.checks.length>=5,id);
  assert.ok(w.operatorApprovalRequired,id);
  assert.ok(w.standardContext.length>0);
  assert.ok(w.checks.every(c=>c.label&&c.prompt),id);
 }
 assert.notDeepEqual(workflow("helicopter-ground-safety").checks.map(c=>c.id),
  workflow("gse-pre-use").checks.map(c=>c.id));
 assert.notDeepEqual(workflow("heliport-ground-observation").checks.map(c=>c.id),
  workflow("airfield-self-inspection").checks.map(c=>c.id));
 assert.ok(AVIATION_SAFETY_REFERENCES.some(x=>x.url.includes("faa.gov")));
 assert.ok(AVIATION_SAFETY_REFERENCES.some(x=>x.url.includes("icao")));
});
test("recording observation NEVER releases an aircraft or reopens airport operations",()=>{
 for(const w of AVIATION_WORKFLOWS){
  const e=evaluateAviationObservation(w,answersFor(w.id));
  assert.equal(e.status,"OBSERVATIONS_RECORDED",w.id);
  assert.equal(e.canReleaseAircraft,false);
  assert.equal(e.canDispatchAircraft,false);
  assert.equal(e.canReopenMovementArea,false);
  assert.equal(e.formalSecurityClearance,false);
 }
});
test("helicopter ground observations require an airframe and non-sensitive aircraft ID",()=>{
 const id="helicopter-ground-safety";
 assert.throws(()=>makeAviationObservation(sample(id,{airframeKind:"FIXED_WING"})),/helicopter/i);
 assert.throws(()=>makeAviationObservation(sample(id,{aircraftRegistration:""})),/Aircraft or non-sensitive asset/);
 const actual=makeAviationObservation(sample(id));
 assert.equal(actual.airframeKind,"HELICOPTER");
 assert.equal(actual.verification,"DEVICE_LOCAL_UNVERIFIED");
 assert.equal(actual.jurisdiction,"DEMO_UNSPECIFIED");
 assert.equal(actual.state,"OBSERVATIONS_RECORDED");
});
test("record cannot be submitted with unchecked items or unowned findings",()=>{
 const id="heliport-ground-observation";
 assert.throws(()=>makeAviationObservation(sample(id,{answers:[]})),/All checklist items/);
 const issueId=workflow(id).checks[0].id;
 assert.throws(()=>makeAviationObservation(sample(id,{answers:answersFor(id,issueId)})),/responsible follow-up/);
 assert.throws(()=>makeAviationObservation(sample(id,{answers:answersFor(id,issueId).map(a=>({...a,detail:""})),actions:[{id:"A1",description:"Report hazard",owner:"Site supervisor",dueDate:"",state:"OPEN"}]})),/Describe each observed safety issue/);
 const recorded=makeAviationObservation(sample(id,{answers:answersFor(id,issueId),actions:[{id:"A1",description:"Report hazard",owner:"Site supervisor",dueDate:"2026-10-15",state:"OPEN"}]}));
 assert.equal(recorded.state,"FOLLOW_UP_REQUIRED");
});
test("security oversight metadata has no sensitive operational screening playbook",()=>{
 const security=workflow("aviation-security-oversight");
 assert.equal(security.area,"SECURITY_OVERSIGHT");
 assert.ok(security.checks.every(x=>!/(search passenger|screening settings|explosive device procedure)/i.test(x.prompt)));
});
test("aviation follow-up closure requires external evidence and cannot erase safety findings",()=>{
 const id="helicopter-ground-safety";
 const issueId=workflow(id).checks[0].id;
 const a={id:"AC-1",description:"Escalate to licensed maintainer",owner:"Approved ground manager",dueDate:"2026-10-15",state:"OPEN"};
 const record=makeAviationObservation(sample(id,{answers:answersFor(id,issueId),actions:[a]}));
 assert.throws(()=>updateAviationFollowUp(record,"AC-1","CLOSED",""),/evidence reference/);
 const closed=updateAviationFollowUp(record,"AC-1","CLOSED","external controlled case ABC-1");
 assert.equal(closed.actions[0].state,"CLOSED");
 assert.equal(closed.actions[0].completionReference,"external controlled case ABC-1");
 assert.equal(closed.state,"FOLLOW_UP_REQUIRED","Finding remains historically recorded");
 assert.equal(record.actions[0].state,"OPEN","Immutable original evidence");
 assert.deepEqual(closed.answers,record.answers);
 assert.throws(()=>updateAviationFollowUp(record,"unknown","CLOSED","X"),/Unknown/);
});
