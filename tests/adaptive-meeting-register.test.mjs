import test from 'node:test';
import assert from 'node:assert/strict';
import {meetingTemplate,updateMeetingAttendance,buildMeetingAnalytics} from '../packages/domain-data/src/meeting-register.ts';
import {moveRegisterRow,duplicateRegisterRow} from '../packages/domain-data/src/repeatable-register.ts';
import {demoOrganization,demoPeople} from '../packages/domain-data/src/custom-assurance.ts';
import {buildFormDocument,documentRows} from '../apps/web/lib/form-exports.ts';
import {renderProfessionalPdf} from '../apps/web/lib/document-pdf.ts';
import {renderProfessionalWord} from '../apps/web/lib/document-word.ts';
const org=demoOrganization,people=demoPeople.filter(p=>p.orgId===org.id),[one,two]=people;
const template=meetingTemplate(org);
test('attendance status survives selection changes and keeps department snapshots',()=>{
 let a=updateMeetingAttendance({},'present',[one.id,two.id],{},people);
 a.attendance_details[0].attendance_status='Late arrival';
 a={...a,...updateMeetingAttendance(a,'absent',[two.id],{},people)};
 assert.equal(a.attendance_details[0].attendance_status,'Late arrival');
 assert.equal(a.apology_details[0].department,two.department);
 assert.equal(a.apology_details[0].notification_status,'Not recorded');
 assert.deepEqual(a.participants,[one.id]);
 assert.ok(template.sections.flatMap(s=>s.fields).some(f=>f.id==='meeting_recorder_id'&&f.type==='person'));
});
const record={id:'meeting-1',templateSnapshot:template,siteId:'Jwaneng',submittedAt:'2026-10-09T09:00:00Z',answers:{meeting_date:'2026-10-09',participants:[one.id],attendance_details:[{person_id:one.id,department:'Historical department',attendance_status:'Left early'}],apology_person_ids:[two.id],apology_details:[{person_id:two.id,absence_status:'Apology received'}],actions:[{action:'Inspect',owner_person_id:one.id,due:'2026-10-08',state:'Open'},{action:'Closed',owner_person_id:one.id,due:'2026-10-01',state:'Closed'}]}};
test('meeting analytics exclude apologies from attendance, scope company and action ownership',()=>{
 const foreign={...record,templateSnapshot:{...template,organizationId:'other'}};
 const a=buildMeetingAnalytics({forms:[record,foreign],people,orgId:org.id,today:'2026-10-09'});
 assert.equal(a.meetings,1);assert.equal(a.attendanceRate,50);assert.equal(a.apologies,1);assert.equal(a.overdue,1);
 assert.deepEqual(a.departments,[{name:'Historical department',count:1}]);
 const mine=buildMeetingAnalytics({forms:[record],people,orgId:org.id,personId:two.id,today:'2026-10-09'});
 assert.equal(mine.attended,0);assert.equal(mine.apologies,1);assert.equal(mine.open,0);assert.equal(mine.attendanceRate,0);
 assert.equal(buildMeetingAnalytics({forms:[record],people,orgId:org.id,month:'2026-09'}).meetings,0);
});
test('repeatable rows reorder immutably and duplicate descriptive fields without safety evidence',()=>{
 const rows=[{task:'Inspect',sig:'drawn',ack:'Yes',brakes:'PASS',owner_person_id:one.id},{task:'Review'}];
 assert.equal(moveRegisterRow(rows,0,1)[1].task,'Inspect');assert.equal(rows[0].task,'Inspect');
 assert.deepEqual(duplicateRegisterRow(rows,0,['brakes'])[1],{task:'Inspect'});
 assert.deepEqual(moveRegisterRow(rows,0,-1),rows);
});
test('meeting snapshots retain exported names after renaming/removing directory members',()=>{
 const answers={...record.answers,meeting_people_snapshot:[{person_id:one.id,person_name:'Historical employee'}]};
 const document=buildFormDocument({template,mode:'filled',submission:{...record,answers},company:org,people:[]});
 assert.ok(documentRows(document).some(([,value])=>value==='Historical employee'));
 assert.equal(buildFormDocument({template,mode:'blank',answers,company:org,people}).status,'UNCOMPLETED TEMPLATE');
});
test('new meeting attendance and apologies render real PDF and editable Word packages',async()=>{
 const doc=buildFormDocument({template,mode:'draft',answers:{...record.answers,meeting_title:'Weekly SHE',meeting_recorder_id:one.id},company:org,people});
 const pdf=Buffer.from(await renderProfessionalPdf(doc).arrayBuffer());
 const word=Buffer.from(await (await renderProfessionalWord(doc)).arrayBuffer());
 assert.equal(pdf.subarray(0,4).toString(),'%PDF');assert.equal(word.subarray(0,2).toString(),'PK');
 assert.ok(pdf.length>3000);assert.ok(word.length>3000);
});
