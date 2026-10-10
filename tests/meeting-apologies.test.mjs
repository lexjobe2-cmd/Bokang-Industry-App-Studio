import test from "node:test";
import assert from "node:assert/strict";
import {meetingTemplate,updateMeetingAttendance,meetingAttendanceCounts,validateMeetingInput,carryForwardMeetingActions} from "../packages/domain-data/src/meeting-register.ts";
import {demoOrganization,demoPeople} from "../packages/domain-data/src/custom-assurance.ts";
import {starterAssuranceTemplates,makeSubmission} from "../packages/domain-data/src/assurance-forms.ts";
import {buildAssuranceAnalytics} from "../packages/domain-data/src/participation-analytics.ts";
import {buildFormDocument,documentRows} from "../apps/web/lib/form-exports.ts";

const org=demoOrganization;
const persons=demoPeople.filter(p=>p.orgId===org.id);
const [first,second,third]=persons;
if(!first||!second||!third)throw new Error("Need 3 local directory people for tests");
const sig={kind:"drawn-signature-v1",verification:"LOCAL_UNVERIFIED",imageDataUrl:"data:image/png;base64,"+"a".repeat(100),
 signerName:first.displayName,signerPersonId:first.id,role:"Meeting chairperson",intent:"attendance",signedAt:"2026-10-09T10:00:00Z",
 scope:"Meeting register",consent:true};

test("Power Apps-style multi-person selections keep present and absent mutually exclusive",()=>{
 let a={participants:[first.id,second.id],apology_person_ids:[]};
 a={...a,...updateMeetingAttendance(a,"absent",[second.id,third.id],{[second.id]:second.displayName,[third.id]:third.displayName})};
 assert.deepEqual(a.participants,[first.id]);
 assert.deepEqual(a.apology_person_ids,[second.id,third.id]);
 assert.deepEqual(a.apology_details.map(x=>x.person_name),[second.displayName,third.displayName]);
 assert.equal(meetingAttendanceCounts(a).present,1);
 assert.equal(meetingAttendanceCounts(a).absent,2);
 assert.equal(meetingAttendanceCounts(a).apologyReceived,2);
 const updated={...a,apology_details:a.apology_details.map(x=>x.person_id===second.id?{...x,absence_reason:"Training"}:x)};
 const back={...updated,...updateMeetingAttendance(updated,"present",[first.id,second.id])};
 assert.deepEqual(back.apology_person_ids,[third.id]);
 assert.deepEqual(back.apology_details.map(x=>x.person_id),[third.id]);
 assert.deepEqual(back.participants,[first.id,second.id]);
});
test("meeting register v3 has structured apologies, people selection and manual entries",()=>{
 const t=meetingTemplate(org),fields=t.sections.flatMap(s=>s.fields);
 assert.equal(t.version,5);
 assert.equal(fields.find(f=>f.id==="apology_person_ids")?.type,"people");
 assert.equal(fields.find(f=>f.id==="apology_entries")?.type,"repeat");
 assert.ok(fields.find(f=>f.id==="apology_details")?.children?.some(c=>c.id==="absence_status"));
 const legacy=starterAssuranceTemplates.find(t=>t.id==="meeting-register");
 assert.equal(legacy.version,3);
 assert.ok(legacy.sections.flatMap(s=>s.fields).find(f=>f.id==="apology_person_ids"));
});
test("meeting reports preserve staff apologies and manual external absences in Word/PDF model",()=>{
 const form=meetingTemplate(org);
 const answers={meeting_title:"Weekly SHE committee",meeting_type:"SHE committee meeting",meeting_date:"2026-10-09",meeting_site:"Gaborone",
  meeting_chair:first.id,chair_signature:sig,agenda:"Safety",minutes:"Discussed risks",
  participants:[first.id],apology_person_ids:[second.id],apology_details:[{
   person_id:second.id,person_name:second.displayName,absence_status:"Apology received",absence_reason:"Training",absence_note:"Off site"
  }],apology_entries:[{apology_name:"External contractor",apology_company:"XYZ",apology_status:"Absent (no apology)",apology_reason:"Not specified"}]};
 assert.equal(validateMeetingInput(answers),true);
 const submitted=makeSubmission({id:"meeting-5",template:form,answers,siteId:"Gaborone",actorUid:"demo",now:"2026-10-09T10:01:00Z"});
 const rows=documentRows(buildFormDocument({template:form,mode:"filled",submission:submitted,company:org,people:persons}));
 assert.ok(rows.some(([label,value])=>label.includes("Staff who sent apologies")&&value.includes(second.displayName)),"Export should show names, not IDs");
 assert.ok(rows.some(([,value])=>value==="Training"));
 assert.ok(rows.some(([,value])=>value==="External contractor"));
 const report=buildAssuranceAnalytics({orgId:org.id,people:persons,forms:[submitted],jras:[],personId:second.id});
 assert.equal(report.total,0,"An absent person must NOT count as participant");
 const attended=buildAssuranceAnalytics({orgId:org.id,people:persons,forms:[submitted],jras:[],personId:first.id});
 assert.equal(attended.total,1);
 assert.equal(meetingAttendanceCounts(answers).absent,2);
});
test("meeting blocks contradictory or incomplete apology submissions",()=>{
 const base={meeting_title:"Safety review",meeting_type:"SHE committee meeting",meeting_date:"2026-10-09",meeting_site:"Gaborone",
 meeting_chair:first.id,chair_signature:sig,agenda:"Review",minutes:"Minute text"};
 assert.throws(()=>validateMeetingInput({...base,participants:[first.id],apology_person_ids:[first.id]}),/both present and absent/);
 assert.throws(()=>validateMeetingInput({...base,apology_person_ids:[second.id]}),/attendance status/);
 assert.throws(()=>validateMeetingInput({...base,apology_entries:[{apology_name:""}]}),/person's name/);
});

test("unresolved meeting actions carry forward without stale due dates or false ownership",()=>{
 const current={actions:[{action:"Inspect harness anchor points",owner:"Sam",due:"2026-10-13",state:"Open"}],
   participants:[first.id],apology_person_ids:[second.id],chair_signature:sig,minutes:"Current minutes"};
 const previous={actions:[
  {action:"Inspect harness anchor points",owner:first.displayName,state:"Open"},
  {action:"Close out fire extinguishers",owner:second.displayName,owner_person_id:second.id,due:"2026-10-08",state:"In progress"},
  {action:"Completed housekeeping",owner:third.displayName,due:"2026-10-07",state:"Closed"},
  {action:"Update permit register",owner:"External contractor",state:"Open",due:"2026-10-08"}
 ],participants:[second.id],chair_signature:{...sig,signerName:"Previous chair"},minutes:"Old notes"};
 const {rows,added}=carryForwardMeetingActions(current,previous,[first,second,third]);
 assert.equal(added,2);
 assert.equal(rows.length,3);
 assert.equal(rows[1].owner_person_id,second.id);
 assert.equal(rows[1].owner,second.displayName);
 assert.equal(rows[1].due,"");
 assert.equal(rows[1].state,"Open");
 assert.equal(rows[2].owner_person_id,"");
 assert.equal(rows[2].owner,"External contractor");
 assert.deepEqual(current.participants,[first.id],"Current attendance is unchanged");
 assert.deepEqual(current.apology_person_ids,[second.id],"Current apologies are unchanged");
 assert.equal(current.minutes,"Current minutes");
 assert.equal(current.actions.length,1,"Carry-forward never mutates original records");
 const again=carryForwardMeetingActions({actions:rows},previous,[first,second]);
 assert.equal(again.added,0,"Repeated import does not create duplicate actions");
});
test("ambiguous legacy owner names remain manual, not silently linked to employees",()=>{
 const prior={actions:[{action:"Verify scaffolds",owner:"Sam Dube",state:"Open"}]};
 const result=carryForwardMeetingActions({},prior,[{id:"one",displayName:"Sam Dube"},{id:"two",displayName:"Sam Dube"}]);
 assert.equal(result.rows[0].owner_person_id,"");
});

test("meeting submissions require a newly reviewed date on carried-forward actions",()=>{
 const base={meeting_title:"Safety follow-up",meeting_type:"SHE committee meeting",meeting_date:"2026-10-09",meeting_site:"Gaborone",
  meeting_chair:first.id,chair_signature:sig,agenda:"Close-out review",minutes:"Discussed outstanding actions",actions:[]};
 const open={action:"Inspect scaffolds",owner:first.displayName,owner_person_id:first.id,due:"",state:"Open",carried_from:"Previous meeting - verify"};
 assert.throws(()=>validateMeetingInput({...base,actions:[open]}),/new due date/);
 assert.equal(validateMeetingInput({...base,actions:[{...open,due:"2026-10-12"}]}),true);
});
