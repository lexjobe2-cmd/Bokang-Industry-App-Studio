import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildDriverComplianceSummary} from "../apps/web/lib/driver-compliance.ts";
import {buildSupervisorRenewalActions,complianceExportFilename,csvRows,driverComplianceCsv,supervisorActionsCsv,complianceCsvHeaders,actionsCsvHeaders} from "../apps/web/lib/driver-compliance-export.ts";
import {starterDrivers,starterPolicies} from "../apps/web/lib/move-track.ts";

const now=new Date(2026,9,9,12,0);
const later="2027-12-31";
const dates={licence:later,siteAuthorisation:later,openPitPermit:later,firstAid:later,defensiveDriving:later};
const certificate={id:"certificate-1",name:"training.pdf",mimeType:"application/pdf",dataUrl:"data:application/pdf;base64,JVBERi0=",addedAt:"2026-10-09T12:00:00Z"};
const evidence={licence:certificate.id,siteAuthorisation:certificate.id,openPitPermit:certificate.id,firstAid:certificate.id,defensiveDriving:certificate.id};
const base={...starterDrivers[0],id:"DRV-R1",name:"Tshepo, Demo",phone:"+267 71222222",status:"Available",competencyExpiry:dates,documents:[certificate],competencyEvidence:evidence};
const site="Jwaneng mine · demo profile";
const summary=(drivers,siteName=site,policies=starterPolicies,extra={})=>buildDriverComplianceSummary({drivers,assignments:[],directory:[],orgId:"org",site:siteName,policies,now,...extra});
const actions=(drivers,siteName=site,policies=starterPolicies,extra={})=>buildSupervisorRenewalActions({summary:summary(drivers,siteName,policies,extra),drivers,policies,now});

test("full competency export is UTF-8 CSV with the chosen site and all drivers, not PDF bytes or phone numbers",()=>{
 const stale={...base,id:"DRV-R2",name:"No Licence",competencyExpiry:{...dates,licence:"2026-10-08"}};
 const drivers=[base,stale];
 const old=JSON.stringify(drivers);
 const output=driverComplianceCsv(summary(drivers),drivers,now);
 assert.ok(output.startsWith("\uFEFF"));
 assert.ok(output.endsWith("\r\n"));
 assert.match(output,/Assessment date/);
 assert.match(output,/Jwaneng mine/);
 assert.match(output,/"2026-10-09"/);
 assert.match(output,/"DRV-R1"/);
 assert.match(output,/"DRV-R2"/);
 assert.match(output,/"training.pdf"/);
 assert.match(output,/Expired qualifications/);
 assert.match(output,/Driver licence \(2026-10-08\)/);
 assert.ok(output.includes('"Tshepo, Demo"'));
 assert.ok(!output.includes("JVBERi0"));
 assert.ok(!output.includes("+267"));
 assert.equal(JSON.stringify(drivers),old);
});

test("spreadsheet formulas, quotes, multiline inputs and formula-leading spaces are neutralized",()=>{
 const output=csvRows(["Header", "=SUM(1,2)"],[
  ['=1+2','  +cmd'],['-1','@SUM(2,3)'],['\t=run','"Alice"'],["Safe, text","Line 1\r\nLine 2"]
 ]);
 assert.ok(output.includes('"\'=1+2"'));
 assert.ok(output.includes('"\'  +cmd"'));
 assert.ok(output.includes('"\'-1"'));
 assert.ok(output.includes('"\'@SUM(2,3)"'));
 assert.ok(output.includes('"\'\t=run"'));
 assert.ok(output.includes('"""Alice"""'));
 assert.ok(output.includes('"Safe, text"'));
 assert.ok(output.includes('"Line 1\r\nLine 2"'));
 assert.ok(output.includes('"\'=SUM(1,2)"'));
});

test("supervisor action priorities distinguish expired, due soon and missing PDFs",()=>{
 const driver={...base,competencyExpiry:{...dates,licence:"2026-10-08",firstAid:"2026-10-26"},competencyEvidence:{...evidence,firstAid:undefined}};
 const list=actions([driver]);
 assert.equal(list[0].priority,"Immediate");
 assert.ok(list.some(item=>item.credential==="licence"&&item.issue==="Expired qualification"));
 assert.ok(list.some(item=>item.credential==="firstAid"&&item.priority==="Due within 30 days"&&item.daysRemaining===17));
 assert.ok(list.some(item=>item.credential==="firstAid"&&item.priority==="Evidence review"));
 assert.ok(list.every(item=>item.action.length>5));
 const csv=supervisorActionsCsv(list,now);
 assert.match(csv,/Supervisor next action/);
 assert.match(csv,/Renewal approaching/);
 assert.match(csv,/Expired qualification/);
 assert.match(csv,/Supporting PDF not linked/);
 assert.ok(!csv.includes("JVBERi0"));
 assert.ok(!csv.includes("+267"));
});

test("missing expiry and missing required authorization create immediate actions only for required site qualifications",()=>{
 const driver={...base,openPitPermit:false,firstAid:false,defensiveDriving:false,competencyExpiry:{...dates,siteAuthorisation:""}};
 const minePolicies=[
  {id:"mine",name:site,requireOpenPitPermit:true,requireFirstAid:true,requireDefensiveDriving:true,additionalCriticalChecks:[]},
  {id:"office",name:"Office",requireOpenPitPermit:false,requireFirstAid:false,requireDefensiveDriving:false,additionalCriticalChecks:[]}
 ];
 const mine=actions([driver],site,minePolicies);
 assert.ok(mine.some(a=>a.credential==="siteAuthorisation"&&a.issue==="Required expiry date missing"));
 assert.ok(mine.some(a=>a.credential==="openPitPermit"&&a.issue==="Required qualification not authorised"));
 assert.ok(mine.some(a=>a.credential==="firstAid"&&a.issue==="Required qualification not authorised"));
 const office=actions([driver],"Office",minePolicies);
 assert.ok(office.some(a=>a.credential==="siteAuthorisation"&&a.issue==="Required expiry date missing"));
 assert.ok(!office.some(a=>a.credential==="openPitPermit"&&a.issue==="Required qualification not authorised"));
 assert.ok(!office.some(a=>a.credential==="firstAid"&&a.issue==="Required qualification not authorised"));
});

test("unavailable workforce identity generates a distinct supervisor follow-up",()=>{
 const d={...base,personId:"missing-id"};
 const list=actions([d]);
 assert.ok(list.some(a=>a.issue==="Inactive or missing workforce identity"&&a.priority==="Immediate"));
 const csv=supervisorActionsCsv(list,now);
 assert.match(csv,/Workforce directory/);
});

test("empty roster produces CSV headers but no phantom renewal actions",()=>{
 const data=summary([]);
 const csv=driverComplianceCsv(data,[],now);
 assert.equal(csv.split("\r\n").filter(Boolean).length,1);
 assert.equal(complianceCsvHeaders.length,21);
 assert.deepEqual(actions([]),[]);
 const output=supervisorActionsCsv([],now);
 assert.equal(output.split("\r\n").filter(Boolean).length,1);
 assert.equal(actionsCsvHeaders.length,11);
});

test("CSV filename uses safe site fragment and local report date",()=>{
 assert.equal(complianceExportFilename("Jwaneng mine / *? \"Corporate\"","driver-competency",now),
 "movetrack-driver-competency-jwaneng-mine-corporate-2026-10-09.csv");
 assert.equal(complianceExportFilename("","supervisor-renewals",now),
 "movetrack-supervisor-renewals-company-2026-10-09.csv");
 assert.ok(!complianceExportFilename("../../etc/passwd","driver-competency",now).includes("/"));
});

test("Admin controls export full unfiltered current site snapshots and a read-only action modal",()=>{
 const ui=readFileSync(new URL("../apps/web/components/products/DriverComplianceOverview.tsx",import.meta.url),"utf8");
 const main=readFileSync(new URL("../apps/web/components/products/MoveTrackShowcase.tsx",import.meta.url),"utf8");
 assert.match(ui,/Download competency CSV/);
 assert.match(ui,/Download renewal actions CSV/);
 assert.match(ui,/View supervisor action list/);
 assert.match(ui,/const current=buildDriverComplianceSummary/);
 assert.match(ui,/supervisorActionsCsv\(buildSupervisorRenewalActions/);
 assert.match(ui,/not just the current search, filter or page/);
 assert.match(ui,/DesktopModal title=\{/);
 assert.match(main,/view==="admin"&&adminArea==="overview"\?<DriverComplianceOverview/);
});

test("optional expired or missing training is a record-review follow-up, not a dispatch blocker",()=>{
 const driver={...base,id:"DRV-OPTIONAL",competencyExpiry:{...dates,defensiveDriving:"2026-10-08"}};
 const office=[{id:"office",name:"Office",requireOpenPitPermit:false,requireFirstAid:false,
  requireDefensiveDriving:false,additionalCriticalChecks:[]}];
 const summaryOffice=summary([driver],"Office",office);
 assert.equal(summaryOffice.counts.ready,1);
 const actionList=buildSupervisorRenewalActions({summary:summaryOffice,drivers:[driver],policies:office,now});
 const option=actionList.find(a=>a.credential==="defensiveDriving"&&a.issue==="Expired qualification");
 assert.equal(option?.priority,"Record review");
 assert.ok(!actionList.some(a=>a.credential==="defensiveDriving"&&a.priority==="Immediate"));
 const missing={...driver,competencyExpiry:{...driver.competencyExpiry,defensiveDriving:""}};
 const missingActions=actions([missing],"Office",office);
 assert.ok(missingActions.some(a=>a.credential==="defensiveDriving"&&a.priority==="Record review"&&a.issue==="Optional recorded expiry date missing"));
});

test("Admin reporting consolidates to one modal, one export panel and paginates supervisor actions",()=>{
 const ui=readFileSync(new URL("../apps/web/components/products/DriverComplianceOverview.tsx",import.meta.url),"utf8");
 assert.equal((ui.match(/const \[actionsOpen,setActionsOpen\]/g)||[]).length,1);
 assert.equal((ui.match(/<DesktopModal title=\{"Supervisor renewal actions/g)||[]).length,1);
 assert.equal((ui.match(/aria-label="Admin competency reporting"/g)||[]).length,1);
 assert.match(ui,/Filter supervisor action priorities/);
 assert.match(ui,/const visibleActions=filteredActions.slice/);
 assert.match(ui,/const current=buildDriverComplianceSummary/);
 assert.match(ui,/Download competency CSV/);
 assert.match(ui,/Download renewal actions CSV/);
 assert.match(ui,/No notifications are sent/);
});
