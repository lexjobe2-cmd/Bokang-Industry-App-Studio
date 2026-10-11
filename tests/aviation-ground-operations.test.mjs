import test from "node:test";
import assert from "node:assert/strict";
import {AVIATION_WORKFLOWS,AVIATION_AREA_LABELS,evaluateAviationObservation,makeAviationObservation} from "../apps/web/lib/aviation-operations.ts";

const airport=AVIATION_WORKFLOWS.find(w=>w.id==="airfield-self-inspection");
const gse=AVIATION_WORKFLOWS.find(w=>w.id==="gse-pre-use");
const aircraft=AVIATION_WORKFLOWS.find(w=>w.id==="aircraft-defect-report");
function a(workflow, status="OBSERVED_OK"){return workflow.checks.map(check=>({checkId:check.id,status,detail:""}));}
function input(workflow){return {id:"AV-TEST",workflowId:workflow.id,airport:"Maun",site:"demo apron",observer:"Demo inspector",
  procedureReference:"DEMO",procedureRevision:"DEMO-1",performedAt:"2026-10-11T07:00:00Z",notes:"",
  answers:a(workflow),actions:[]};}

test("aviation assurance has unique workflows across aerodrome, ramp, GSE, turnaround, aircraft and security",()=>{
 assert.equal(AVIATION_WORKFLOWS.length,7);
 assert.equal(new Set(AVIATION_WORKFLOWS.map(w=>w.id)).size,AVIATION_WORKFLOWS.length);
 assert.ok(AVIATION_WORKFLOWS.every(w=>w.operatorApprovalRequired && w.checks.length>=4 && w.standardContext.length>=1));
 assert.deepEqual(new Set(AVIATION_WORKFLOWS.map(w=>w.area)),new Set(Object.keys(AVIATION_AREA_LABELS)));
 for(const w of AVIATION_WORKFLOWS)assert.equal(new Set(w.checks.map(c=>c.id)).size,w.checks.length);
});
test("incomplete observations remain drafts and never infer aviation clearances",()=>{
 const d=evaluateAviationObservation(airport,[]);
 assert.equal(d.status,"DRAFT");
 assert.ok(d.missing.length>0);
 for(const flag of ["canReleaseAircraft","canDispatchAircraft","canReopenMovementArea","formalSecurityClearance"]){
  assert.equal(d[flag],false,flag);
 }
 assert.throws(()=>makeAviationObservation({...input(airport),answers:[]}),/All checklist items/);
});
test("observations with no issue may be saved but do not grant airworthiness or flight dispatch",()=>{
 const rec=makeAviationObservation(input(airport));
 assert.equal(rec.state,"OBSERVATIONS_RECORDED");
 assert.equal(rec.verification,"DEVICE_LOCAL_UNVERIFIED");
 assert.equal(evaluateAviationObservation(airport,rec.answers).canReopenMovementArea,false);
 assert.equal(evaluateAviationObservation(airport,rec.answers).canDispatchAircraft,false);
});
test("issues need accountable follow up, even if remaining checks have no issue",()=>{
 const data=input(airport);
 data.answers[0]={checkId:airport.checks[0].id,status:"ISSUE",detail:"Pavement issue observed"};
 assert.equal(evaluateAviationObservation(airport,data.answers).status,"FOLLOW_UP_REQUIRED");
 assert.throws(()=>makeAviationObservation({...data,answers:data.answers.map((a,i)=>i===0?{...a,detail:""}:a)}),/Describe each observed/);
 assert.throws(()=>makeAviationObservation(data),/responsible follow-up owner/);
 const saved=makeAviationObservation({...data,actions:[{id:"ACTION-1",description:"Notify accountable airport operations authority",owner:"Airport supervisor",dueDate:"2026-10-12",state:"OPEN"}]});
 assert.equal(saved.state,"FOLLOW_UP_REQUIRED");
 assert.equal(saved.actions[0].state,"OPEN");
});
test("ground support equipment inspections require equipment ID and aircraft record requires registration",()=>{
 assert.throws(()=>makeAviationObservation(input(gse)),/GSE asset identifier/);
 assert.equal(makeAviationObservation({...input(gse),equipmentId:"GSE-001"}).state,"OBSERVATIONS_RECORDED");
 assert.throws(()=>makeAviationObservation(input(aircraft)),/Aircraft registration/);
 assert.equal(makeAviationObservation({...input(aircraft),aircraftRegistration:"A2-DEMO"}).state,"OBSERVATIONS_RECORDED");
});
test("unknown workflows and missing observer or station do not produce records",()=>{
 assert.throws(()=>makeAviationObservation({...input(airport),workflowId:"missing"}),/Unknown aviation/);
 assert.throws(()=>makeAviationObservation({...input(airport),observer:" "}),/Airport and observer/);
});
