import test from "node:test";
import assert from "node:assert/strict";
import {buildAssuranceAnalytics,participationItems} from "../packages/domain-data/src/participation-analytics.ts";
import {buildFormDocument,buildJraDocument,documentRows,exportCsv,exportJson} from "../apps/web/lib/form-exports.ts";
import {demoOrganization,blankJra,blankJraTask,blankHazard} from "../packages/domain-data/src/custom-assurance.ts";
import {makeSubmission} from "../packages/domain-data/src/assurance-forms.ts";

const org=demoOrganization;
const people=[{id:"p1",orgId:org.id,displayName:"Sam Dube",employeeNumber:"104",jobTitle:"Supervisor",active:true,source:"MANUAL"},
 {id:"p2",orgId:org.id,displayName:"Neo K",employeeNumber:"105",jobTitle:"Worker",active:true,source:"MANUAL"},
 {id:"p3",orgId:"org-other",displayName:"Outsider",jobTitle:"Worker",active:true,source:"MANUAL"}];
const template={id:"participation",version:1,title:"Meeting check",category:"Meetings",status:"PUBLISHED",siteIds:[],assetClasses:[],effectiveDate:"2026-10-08",
 organizationId:org.id,companyNameSnapshot:org.name,referencePrefix:"SHE",
 sections:[{id:"team",title:"Attendance",fields:[
  {id:"people",label:"Crew participants",type:"people",required:true},
  {id:"lead",label:"Responsible supervisor",type:"person",required:true},
  {id:"attend",label:"Attendance register",type:"repeat",required:false,children:[{id:"name",label:"Full name",type:"text",required:true}]},
  {id:"remarks",label:"Observations",type:"text",required:false}
 ]}]};
const answers={people:["p2"],lead:"p1",attend:[{name:"Sam Dube"}],remarks:'=dangerous, "sample"'};
const form=makeSubmission({id:"form1",template,answers,siteId:"Mine",taskId:"WO-1",actorUid:"demo",actorPersonId:"p2",now:"2026-10-08T10:00:00Z"});

test("participation maps exact person IDs plus attendance register and submission identity",()=>{
 const items=participationItems({orgId:org.id,forms:[form],jras:[],people});
 assert.deepEqual(items[0].personIds.sort(),["p1","p2"]);
 assert.equal(buildAssuranceAnalytics({orgId:org.id,forms:[form],jras:[],people,personId:"p2"}).total,1);
 assert.equal(buildAssuranceAnalytics({orgId:org.id,forms:[form],jras:[],people,personId:"p3"}).total,0);
 const sam=buildAssuranceAnalytics({orgId:org.id,forms:[form],jras:[],people,personId:"p1"});
 assert.equal(sam.roles.find(x=>x.role==="Supervisor")?.count,1);
 assert.equal(sam.roles.find(x=>x.role==="Attendee")?.count,1);
 const neo=buildAssuranceAnalytics({orgId:org.id,forms:[form],jras:[],people,personId:"p2"});
 assert.equal(neo.roles.find(x=>x.role==="Submitter")?.count,1);
});
test("company records and risk assessment roles stay organization-scoped",()=>{
 const jra=blankJra(org,"2026-10-08T12:00:00Z");
 jra.id="jra1";jra.title="Mine maintenance";jra.supervisorId="p1";jra.reviewerId="p2";
 jra.participants=[{personId:"p2",nameSnapshot:"Neo K",role:"Participant",acknowledged:false,manual:true}];
 const a=buildAssuranceAnalytics({orgId:org.id,forms:[form],jras:[jra],people});
 assert.equal(a.total,2);assert.equal(a.forms,1);assert.equal(a.jras,1);
 assert.equal(a.peopleInvolved,2);assert.equal(a.drafts,1);
 assert.equal(buildAssuranceAnalytics({orgId:org.id,forms:[form],jras:[jra],people,personId:"p2"}).total,2);
 const other=buildAssuranceAnalytics({orgId:"org-other",forms:[form],jras:[jra],people});
 assert.equal(other.total,0);
});
test("blank, filled and draft documents preserve values and historical template snapshot",()=>{
 const blank=buildFormDocument({template,mode:"blank",company:org,people});
 const draft=buildFormDocument({template,mode:"draft",answers,company:org,people,site:"Mine"});
 const filled=buildFormDocument({template,mode:"filled",submission:form,company:org,people});
 assert.ok(documentRows(blank).some(([label,value])=>label==="Observations"&&value.startsWith("_____")));
 assert.ok(documentRows(draft).some(([label,value])=>label==="Observations"&&value.includes("dangerous")));
 assert.equal(filled.status,"COMPLETE");
 assert.equal(documentRows(filled).find(([label])=>label.startsWith("Crew participants"))[1],"Neo K");
 assert.match(exportJson(filled),/movetrack-document-v1/);
 assert.match(exportCsv(filled),/'=dangerous/);
 assert.match(exportCsv(filled),/"sample"/);
 assert.equal(filled.company,org.name);
});
test("JRA document exports each job step and hazard including responsible controls",()=>{
 const jra=blankJra(org,"2026-10-08T10:00:00Z");
 const task=blankJraTask(1);
 task.description="Repair vehicle";
 const h=blankHazard();
 h.hazard="Working at height";h.consequence="Fall";h.controls=[{id:"c1",hierarchy:"Engineering",description:"Guardrail",ownerId:"p1",verified:false}];
 task.hazards=[h];jra.tasks=[task];
 const result=buildJraDocument(jra,people);
 assert.ok(result.sections.some(s=>s.rows.some(r=>r.value.includes("Guardrail"))));
 assert.ok(documentRows(result).some(row=>row[1]==="Working at height"));
 assert.match(result.disclaimer,/NOT.*AUTHORIZATION/);
});

test("professionally styled reports output valid PDF and editable DOCX document bytes",async()=>{
 const {renderProfessionalPdf}=await import("../apps/web/lib/document-pdf.ts");
 const {renderProfessionalWord}=await import("../apps/web/lib/document-word.ts");
 const form=buildFormDocument({template,mode:"filled",submission:makeSubmission({id:"a4-1",template,answers,siteId:"Site",actorUid:"demo",now:"2026-10-08T10:00:00Z"}),company:org,people});
 const pdf=renderProfessionalPdf(form);
 const bytes=Buffer.from(await pdf.arrayBuffer());
 assert.equal(bytes.subarray(0,5).toString(),"%PDF-");
 assert.ok(bytes.length>3000,"A4 PDF should have structured content");
 const docx=await renderProfessionalWord(form);
 const word=Buffer.from(await docx.arrayBuffer());
 assert.equal(word.subarray(0,2).toString(),"PK");
 assert.ok(word.length>3000,"DOCX should contain multiple OOXML parts");
});
test("long safety checklists paginate rather than losing fields, and blank reports export",async()=>{
 const {renderProfessionalPdf}=await import("../apps/web/lib/document-pdf.ts");
 const {renderProfessionalWord}=await import("../apps/web/lib/document-word.ts");
 const entries=Array.from({length:100},(_,i)=>({label:"Critical checkpoint "+String(i+1)+" fall arrest/rescue readiness",value:i%3===0?"PASS":i%3===1?"16/25 - HIGH":"Inspection evidence checked with supporting notes and a safe retrieval plan"}));
 const pageDoc={title:"Working at heights - extended operational assurance check",company:"Botswana Mining and Industrial Maintenance Services",reference:"BW-SHE-2026-001",mode:"blank",status:"UNCOMPLETED TEMPLATE",timestamp:"2026-10-08T10:00:00Z",disclaimer:"LOCAL DEMO - NOT AN APPROVAL",accent:"#155eef",sections:[{title:"Working at height controls",rows:entries}]};
 const pdf=renderProfessionalPdf(pageDoc);
 const data=Buffer.from(await pdf.arrayBuffer());
 assert.ok(data.length>9000,"Multi-page styled PDF should contain several pages");
 const result=await renderProfessionalWord(pageDoc);
 assert.ok((await result.arrayBuffer()).byteLength>3000);
});

test("local drawn signatures require consent, declared identity, timestamp and actual PNG image",async()=>{
 const {isSignatureEvidence,createSignatureEvidence}=await import("../packages/domain-data/src/signature-evidence.ts");
 const imageDataUrl="data:image/png;base64,"+"iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAAAAADhZOFX".repeat(3);
 const common={imageDataUrl,signerName:"Kagiso Dube",signerPersonId:"p1",role:"Supervisor",intent:"review",scope:"WORK-123",signedAt:"2026-10-09T09:00:00.000Z",consent:true};
 assert.equal(isSignatureEvidence("Kagiso Dube"),false);
 assert.equal(isSignatureEvidence({...common,consent:true,kind:"drawn-signature-v1",verification:"LOCAL_UNVERIFIED"}),true);
 assert.throws(()=>createSignatureEvidence({...common,consent:false}),/Draw a signature/);
 const signed=createSignatureEvidence(common);
 assert.equal(signed.verification,"LOCAL_UNVERIFIED");
 const {isAnswered}=await import("../packages/domain-data/src/assurance-forms.ts");
 assert.equal(isAnswered({id:"sign",type:"signature",label:"Sign",required:true},"typed name"),false);
 assert.equal(isAnswered({id:"sign",type:"signature",label:"Sign",required:true},signed),true);
 const {buildFormDocument}=await import("../apps/web/lib/form-exports.ts");
 const t={...template,sections:[{id:"signatures",title:"Attestation",fields:[{id:"sign",type:"signature",label:"Reviewed by",required:false}]}]};
 const doc=buildFormDocument({template:t,mode:"draft",answers:{sign:signed},people,company:org});
 assert.equal(doc.sections[1].rows[0].signature.signerName,"Kagiso Dube");
 assert.ok(!doc.sections[1].rows[0].value.includes("base64"));
});
test("safety workflow library includes drawn acknowledgement and review fields",async()=>{
 const {additionalAssuranceRecipes}=await import("../packages/domain-data/src/expanded-assurance.ts");
 assert.equal(additionalAssuranceRecipes.length,21);
 for(const w of additionalAssuranceRecipes){
  const signatures=w.sections.flatMap(s=>s.fields).filter(f=>f.type==="signature");
  assert.ok(signatures.length>=2,w.id+" missing signatures");
 }
});
