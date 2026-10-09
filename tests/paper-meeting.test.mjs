import test from "node:test";
import assert from "node:assert/strict";
import {detectPaperKind,detectPaperCategory,parsePaperText,validatePaperSections} from "../packages/domain-data/src/paper-forms.ts";
import {meetingTemplate,meetingTypes,validateMeetingInput} from "../packages/domain-data/src/meeting-register.ts";
import {demoOrganization} from "../packages/domain-data/src/custom-assurance.ts";
import {evaluateForm,makeSubmission} from "../packages/domain-data/src/assurance-forms.ts";
const example=`SHE MEETING REGISTER
Date: _____________________
Chairperson: _____________________
Meeting title: _____________________
ATTENDANCE REGISTER
Full name: _____________________
Department: _____________________
Role: _____________________
MEETING MINUTES
Agenda: _____________________
Minutes and decisions: _____________________
Corrective actions / owner / due date: _____________________`;
test("paper OCR parser identifies meeting register and retains editable questions",()=>{
 const parsed=parsePaperText("original-she-register.pdf",example,84,2);
 assert.equal(parsed.kind,"Meeting register");
 assert.equal(detectPaperCategory(parsed.kind),"Meetings");
 assert.ok(parsed.sections.length>=1);
 const fields=parsed.sections.flatMap(s=>s.fields);
 assert.ok(fields.some(f=>/date/i.test(f.label)));
 assert.ok(fields.some(f=>/chair/i.test(f.label)));
 assert.ok(fields.some(f=>/minutes/i.test(f.label)));
 assert.ok(validatePaperSections(parsed.sections));
 assert.equal(parsed.pages,2);
});
test("OCR low confidence is a warning and all fields still require manual review",()=>{
 const p=parsePaperText("vehicle.JPG",`VEHICLE INSPECTION CHECKLIST
Operator name: __
Brakes PASS/FAIL:
Tyres PASS/FAIL:
Service date:
Repair notes:`,42);
 assert.equal(p.kind,"Inspection");
 assert.ok(p.warnings.some(w=>/confidence/i.test(w)));
 const fields=p.sections.flatMap(s=>s.fields);
 assert.equal(fields.find(f=>/Brakes/i.test(f.label))?.type,"pass_fail_na");
 assert.ok(fields.every(f=>f.required===false),"OCR cannot force safety-critical requirements without a human reviewer");
});
test("a faint document yields a safe editable placeholder, never an auto-approved template",()=>{
 const parsed=parsePaperText("poor.png","xx");
 assert.equal(parsed.sections.length,1);
 assert.equal(parsed.sections[0].fields.length,1);
 assert.ok(parsed.warnings.length>=2);
 assert.throws(()=>validatePaperSections([{id:"a",title:"",fields:[]}]),/title|question/);
});
test("native company meeting register has attendance, discussions, agenda and corrective actions",()=>{
 const t=meetingTemplate(demoOrganization);
 assert.equal(t.category,"Meetings");assert.equal(t.status,"PUBLISHED");
 const fields=t.sections.flatMap(s=>s.fields);
 assert.ok(fields.some(f=>f.id==="participants"&&f.type==="people"));
 assert.ok(fields.some(f=>f.id==="attendees"&&f.type==="repeat"));
 assert.ok(fields.some(f=>f.id==="actions"&&f.type==="repeat"));
 assert.ok(fields.some(f=>f.id==="minutes"&&f.required));
 assert.ok(meetingTypes.length>=6);
});
test("meetings validate essential fields and produce actual persistent form snapshots",()=>{
 const t=meetingTemplate(demoOrganization);
 const signature={kind:"drawn-signature-v1",imageDataUrl:"data:image/png;base64,"+"iVBORw0KGgoAAAANSUhEUgAA".repeat(5),
  signerName:"Demo Chairperson",role:"Meeting chairperson",intent:"attendance",signedAt:"2026-10-08T09:10:00Z",
  scope:"Monthly SHE committee",verification:"LOCAL_UNVERIFIED",consent:true};
 const answers={meeting_title:"Monthly SHE committee",meeting_type:"SHE committee meeting",meeting_date:"2026-10-08",
  meeting_site:"Jwaneng",meeting_chair_manual:"Demo Chairperson",chair_signature:signature,
  agenda:"Emergency readiness and working at height",minutes:"Rescue team available",participants:["demo-p01"],
  actions:[{action:"Check rescue plan",owner:"Safety officer",due:"2026-10-10",state:"Open"}]};
 assert.ok(validateMeetingInput(answers));
 assert.throws(()=>validateMeetingInput({...answers,chair_signature:undefined}),/chairperson/i);
 assert.throws(()=>validateMeetingInput({...answers,meeting_chair_manual:"Another person"}),/match/i);
 const assessment=evaluateForm(t,answers);
 assert.equal(assessment.decision,"COMPLETE");
 const saved=makeSubmission({id:"meeting-test",template:t,answers,siteId:"Jwaneng",actorUid:"LOCAL-DEMO-OPERATOR",actorPersonId:"demo-p01",now:"2026-10-08T10:00:00Z"});
 assert.equal(saved.templateSnapshot.category,"Meetings");
 assert.equal(saved.submittedByPersonId,"demo-p01");
 assert.equal(saved.answers.actions[0].owner,"Safety officer");
 assert.throws(()=>validateMeetingInput({...answers,minutes:""}),/minutes/);
});
