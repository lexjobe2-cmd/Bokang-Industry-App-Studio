import test from 'node:test';
import assert from 'node:assert/strict';
import {nextMeetingDate,continueMeetingSeries,meetingSeriesRecords,currentMeetingActions,buildMeetingAnalytics,meetingTemplate,validateMeetingInput} from '../packages/domain-data/src/meeting-register.ts';
import {analyzeOperationalText} from '../packages/domain-data/src/operational-nlp.ts';
import {demoOrganization,demoPeople} from '../packages/domain-data/src/custom-assurance.ts';
import {buildFormDocument,documentRows} from '../apps/web/lib/form-exports.ts';
import {renderProfessionalPdf} from '../apps/web/lib/document-pdf.ts';
import {renderProfessionalWord} from '../apps/web/lib/document-word.ts';
const org=demoOrganization,people=demoPeople.filter(p=>p.orgId===org.id),person=people[0],template=meetingTemplate(org);
const prior={id:'M1',submittedAt:'2026-01-31T12:00:00Z',siteId:'Jwaneng',templateSnapshot:template,answers:{meeting_series_id:'S1',meeting_series_name:'Monthly Maintenance',meeting_department:'Maintenance',meeting_cadence:'Monthly',meeting_title:'January maintenance',meeting_date:'2026-01-31',meeting_type:'Departmental meeting',meeting_site:'Jwaneng',meeting_chair:person.id,agenda:'Review controls',minutes:'Agreed repairs.',decisions:'Earlier decision',participants:[person.id],apology_person_ids:['other'],chair_signature:{fake:true},actions:[{action:'Inspect brakes',owner:person.displayName,owner_person_id:person.id,due:'2026-02-02',state:'Open'},{action:'Closed repair',owner:'Guest',state:'Closed'}]}};
test('calendar series clamp monthly/quarterly dates and handle weekly year boundaries',()=>{
 assert.equal(nextMeetingDate('2026-01-31','Monthly'),'2026-02-28');assert.equal(nextMeetingDate('2024-01-31','Monthly'),'2024-02-29');assert.equal(nextMeetingDate('2026-01-31','Quarterly'),'2026-04-30');assert.equal(nextMeetingDate('2026-12-29','Weekly'),'2027-01-05');assert.equal(nextMeetingDate('2026-02-30','Monthly'),'');
});
test('new occurrence preserves context/lineage but resets attendance, content, due dates and signatures',()=>{
 const before=JSON.stringify(prior);const a=continueMeetingSeries(prior,org.id,people);
 assert.equal(a.meeting_date,'2026-02-28');assert.equal(a.previous_meeting_id,'M1');assert.equal(a.minutes_adoption,'Pending review');assert.deepEqual(a.invited_person_ids,[person.id]);assert.deepEqual(a.participants,[]);assert.deepEqual(a.apology_person_ids,[]);assert.equal(a.minutes,'');assert.equal(a.decisions,'');assert.equal(a.chair_signature,undefined);assert.equal(a.actions.length,1);assert.equal(a.actions[0].due,'');assert.equal(a.actions[0].previous_due,'2026-02-02');assert.equal(a.actions[0].action_id,'M1:action:0');assert.equal(JSON.stringify(prior),before);
 assert.throws(()=>continueMeetingSeries(prior,'other',people),/active company/);
});
test('series history isolates companies and series and excludes inactive invited employees',()=>{
 assert.deepEqual(meetingSeriesRecords([prior,{...prior,id:'foreign',templateSnapshot:{...template,organizationId:'foreign'}},{...prior,id:'S2',answers:{...prior.answers,meeting_series_id:'S2'}}],org.id,'S1').map(r=>r.id),['M1']);
 assert.deepEqual(continueMeetingSeries(prior,org.id,[{...person,active:false}]).invited_person_ids,[]);
});
test('latest linked action closeout does not double count historical open actions',()=>{
 const next={...prior,id:'M2',submittedAt:'2026-02-28T12:00:00Z',answers:{...continueMeetingSeries(prior,org.id,people),actions:[{...continueMeetingSeries(prior,org.id,people).actions[0],state:'Closed'}]}};
 assert.equal(currentMeetingActions([prior,next]).filter(r=>r.state!=='Closed').length,0);
 const metrics=buildMeetingAnalytics({forms:[prior,next],people,orgId:org.id});assert.equal(metrics.open,0);assert.equal(metrics.meetings,2);assert.equal(metrics.present,1);
});
test('minutes adoption requires review and amendments before finalization',()=>{
 const a={...prior.answers,previous_meeting_id:'M0',minutes_adoption:'Pending review'};
 assert.throws(()=>validateMeetingInput(a),/adoption decision/);
 assert.throws(()=>validateMeetingInput({...a,minutes_adoption:'Adopted with amendments'}),/amendments/);
});
test('local text extraction has source evidence, exact identity candidates and editable dates',()=>{
 const text=`${person.displayName} must inspect vehicle brakes by 2026-10-12. Agreed to review dust controls.`;
 const a=analyzeOperationalText(text,people,'2026-10-09');assert.equal(a.actions[0].owner_person_id,person.id);assert.equal(a.actions[0].due,'2026-10-12');assert.equal(a.actions[0].source,a.actions[0].action);assert.ok(a.hazards.some(h=>h.category==='Vehicle interaction'));assert.ok(a.hazards.some(h=>h.category==='Dust and silica'));assert.equal(a.decisions.length,1);
 assert.ok(!('risk' in a));assert.ok(!('approval' in a));assert.equal(analyzeOperationalText('Repairer must inspect tomorrow',people,'2026-10-09').actions[0].due,'2026-10-10');
});
test('NLP avoids negated/completed actions and keeps ambiguous identity/date unresolved',()=>{
 assert.equal(analyzeOperationalText('No action required. Do not restart machinery. Repair completed.').actions.length,0);
 const a=analyzeOperationalText(`${people[0].displayName} and ${people[1].displayName} must inspect on 2026-10-11 or 2026-10-12.`,people);assert.equal(a.actions[0].owner_person_id,'');assert.equal(a.actions[0].due,'');
 assert.equal(analyzeOperationalText('x'.repeat(25000)).truncated,true);
});
test('new series metadata and adoption notes export through the existing PDF/Word engine',async()=>{
 const doc=buildFormDocument({template,mode:'draft',answers:{...prior.answers,minutes_adoption:'Adopted with amendments',minutes_amendments:'Correct action owner'},company:org,people});
 assert.ok(documentRows(doc).some(([,v])=>v==='Monthly Maintenance'));assert.ok(documentRows(doc).some(([,v])=>v==='Correct action owner'));
 const pdf=Buffer.from(await renderProfessionalPdf(doc).arrayBuffer()),word=Buffer.from(await (await renderProfessionalWord(doc)).arrayBuffer());assert.equal(pdf.subarray(0,4).toString(),'%PDF');assert.equal(word.subarray(0,2).toString(),'PK');
});
