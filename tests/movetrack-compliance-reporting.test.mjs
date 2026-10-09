import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildDriverComplianceSummary} from "../apps/web/lib/driver-compliance.ts";
import {buildSupervisorRenewalActions,complianceSummaryCsv,supervisorActionsCsv,csvWithHeaders} from "../apps/web/lib/driver-compliance-report.ts";
import {starterDrivers,starterPolicies} from "../apps/web/lib/move-track.ts";

const now=new Date(2026,9,9,12);
const baseDates={licence:"2027-07-15",siteAuthorisation:"2027-07-15",openPitPermit:"2027-07-15",firstAid:"2027-07-15",defensiveDriving:"2027-07-15"};
const pdf={id:"p-1",name:"training.pdf",mimeType:"application/pdf",addedAt:"2026-10-09T09:00:00Z",dataUrl:"data:application/pdf;base64,JVBERi0="};
const links={licence:"p-1",siteAuthorisation:"p-1",openPitPermit:"p-1",firstAid:"p-1",defensiveDriving:"p-1"};
const base={...starterDrivers[0],id:"D-BASE",name:"B. Demo",competencyExpiry:baseDates,
 documents:[pdf],competencyEvidence:links,status:"Available"};
const policies=[{id:"mine",name:"Mine site",requireOpenPitPermit:true,requireFirstAid:true,requireDefensiveDriving:false,additionalCriticalChecks:[]}];
function report(drivers,site="Mine site",sitePolicies=policies){
 const summary=buildDriverComplianceSummary({drivers,assignments:[],directory:[],orgId:"org-1",site,policies:sitePolicies,now});
 return {summary,actions:buildSupervisorRenewalActions(summary,drivers,sitePolicies,now)};
}

test("supervisor list creates no actions when required training and certificate links are current",()=>{
 const {summary,actions}=report([base]);
 assert.equal(summary.counts.ready,1);
 assert.deepEqual(actions,[]);
});

test("actions distinguish critical dispatch blocks from 30-day renewals and optional qualifications",()=>{
 const critical={...base,id:"D-EXPIRED",name:"Expired",competencyExpiry:{...baseDates,firstAid:"2026-10-08"}};
 const renew={...base,id:"D-DUE",name:"Due Soon",competencyExpiry:{...baseDates,defensiveDriving:"2026-10-28"}};
 const optional={...base,id:"D-OPTIONAL",name:"Optional",competencyExpiry:{...baseDates,defensiveDriving:"2026-10-07"}};
 const {actions}=report([optional,renew,critical]);
 assert.deepEqual(actions.map(action=>action.priority),["stop","renew","review"]);
 assert.equal(actions[0].driverId,"D-EXPIRED");
 assert.equal(actions[0].credential,"firstAid");
 assert.equal(actions[0].dueDate,"2026-10-08");
 assert.equal(actions[1].dueDate,"2026-10-28");
 assert.equal(actions[2].credential,"defensiveDriving");
});

test("missing expiry, missing required authorization and absent certificate generate distinct actions",()=>{
 const without={...base,id:"D-MISSING",name:"Missing Evidence",competencyExpiry:{...baseDates,licence:""},
   siteAuthorised:false,competencyEvidence:{...links,firstAid:undefined}};
 const {actions}=report([without]);
 assert.deepEqual(actions.map(a=>a.priority),["stop","stop","evidence"]);
 assert.match(actions.find(a=>a.credential==="siteAuthorisation").issue,/not authorised/);
 assert.match(actions.find(a=>a.credential==="licence").issue,/Expiry date missing/);
 assert.match(actions.find(a=>a.credential==="firstAid").issue,/No linked supporting PDF/);
});

test("workforce identity issues are included without manufacturing a certificate expiry",()=>{
 const linked={...base,id:"D-LINKED",personId:"worker-gone"};
 const {summary,actions}=report([linked]);
 assert.equal(summary.counts.blocked,1);
 assert.equal(actions.length,1);
 assert.equal(actions[0].credential,"workforce");
 assert.equal(actions[0].priority,"stop");
 assert.match(actions[0].nextStep,/organization directory identity/);
});

test("all driver reports use site context, count every driver and omit certificate/signature image data",()=>{
 const {summary,actions}=report([base,{...base,id:"D-2",name:"Second"}]);
 const generatedAt="2026-10-09T20:00:00.000Z";
 const csv=complianceSummaryCsv(summary,[base],generatedAt);
 assert.ok(csv.startsWith("\uFEFF"));
 assert.equal(csv.match(/D-BASE/g)?.length,1);
 assert.equal(csv.match(/D-2/g)?.length,1); // Entire summary, not limited by report source details or UI page
 assert.match(csv,/Mine site/);
 assert.match(csv,/Report as of \(ISO\)/);
 assert.doesNotMatch(csv,/data:application\/pdf|JVBERi0=|imageDataUrl/);
 const renewals=supervisorActionsCsv(actions,generatedAt);
 assert.match(renewals,/Suggested supervisor action/);
 assert.doesNotMatch(renewals,/JVBERi0=/);
});

test("CSV writer quotes commas, newlines, embedded quotes and neutralizes formula payloads",()=>{
 const csv=csvWithHeaders(["name","note","formula"],[
  ['A,"B"',"two\nlines", "=HYPERLINK(\"bad\")"],
  ["  +SUM(A1)","@danger","-12"],
  ["normal","\t=CMD","ordinary"]
 ]);
 assert.ok(csv.startsWith("\uFEFF"));
 assert.match(csv,/"A,""B"""/);
 assert.match(csv,/"two\nlines"/);
 assert.match(csv,/"'=HYPERLINK\(""bad""\)"/);
 assert.match(csv,/"'  \+SUM\(A1\)"/);
 assert.match(csv,/"'@danger"/);
 assert.match(csv,/"'-12"/);
 assert.match(csv,/"'\t=CMD"/);
 assert.match(csv,/\r\n$/);
});

test("multiple action rows keep stable IDs and are correctly sorted by priority, then due date",()=>{
 const a={...base,id:"A",name:"A",competencyExpiry:{...baseDates,firstAid:"2026-10-26",openPitPermit:"2026-10-16"}};
 const b={...base,id:"B",name:"B",competencyExpiry:{...baseDates,licence:"2026-10-07"}};
 const {actions}=report([a,b]);
 assert.equal(new Set(actions.map(action=>action.id)).size,actions.length);
 assert.equal(actions[0].driverId,"B");
 assert.deepEqual(actions.slice(1).map(action=>action.dueDate),["2026-10-16","2026-10-26"]);
});

test("site-specific requirements remain authoritative in the supervisor action list",()=>{
 const driver={...base,id:"policy",openPitPermit:false,firstAid:false};
 const office=[{id:"office",name:"Office",requireOpenPitPermit:false,requireFirstAid:false,requireDefensiveDriving:false,additionalCriticalChecks:[]}];
 assert.equal(report([driver],"Office",office).actions.length,0);
 assert.ok(report([driver]).actions.some(a=>a.credential==="firstAid"&&a.priority==="stop"));
 assert.ok(report([driver]).actions.some(a=>a.credential==="openPitPermit"&&a.priority==="stop"));
});

test("Admin overview exposes actual CSV buttons, priority filter, modal and drilldown",()=>{
 const source=readFileSync(new URL("../apps/web/components/products/DriverComplianceOverview.tsx",import.meta.url),"utf8");
 assert.match(source,/Export driver compliance CSV/);
 assert.match(source,/Export supervisor actions CSV/);
 assert.match(source,/supervisorActionsCsv\(actions,new Date\(\).toISOString\(\)\)/);
 assert.match(source,/complianceSummaryCsv\(summary,drivers,new Date\(\).toISOString\(\)\)/);
 assert.match(source,/DesktopModal title=\{"Supervisor renewal actions/);
 assert.match(source,/Filter supervisor action priorities/);
 assert.match(source,/onManageDriver\(action.driverId\)/);
 assert.match(source,/No certificates, images or signature drawings are included/);
});
