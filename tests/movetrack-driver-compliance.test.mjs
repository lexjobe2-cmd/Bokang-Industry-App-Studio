import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildDriverComplianceSummary,missingEvidenceLabels,siteCredentialRequirements} from "../apps/web/lib/driver-compliance.ts";
import {starterDrivers,starterPolicies} from "../apps/web/lib/move-track.ts";

const now=new Date(2026,9,9,12);
const dates={licence:"2027-05-01",siteAuthorisation:"2027-05-01",openPitPermit:"2027-05-01",firstAid:"2027-05-01",defensiveDriving:"2027-05-01"};
const pdf={id:"PDF-1",name:"certificate.pdf",mimeType:"application/pdf",addedAt:"2026-10-09T07:00:00Z",dataUrl:"data:application/pdf;base64,JVBERi0="};
const base={...starterDrivers[0],id:"drv-base",name:"Available Driver",status:"Available",competencyExpiry:dates,
 documents:[pdf],competencyEvidence:{licence:"PDF-1",siteAuthorisation:"PDF-1",openPitPermit:"PDF-1",firstAid:"PDF-1",defensiveDriving:"PDF-1"}};
const mk=(drivers,overrides={})=>buildDriverComplianceSummary({drivers,assignments:[],directory:[],orgId:"demo-mining",site:"Jwaneng mine · demo profile",policies:starterPolicies,now,...overrides});

test("admin overview reflects the same site requirements as dispatch, without relaxing them",()=>{
 const requirements=siteCredentialRequirements("Jwaneng mine · demo profile",starterPolicies);
 assert.equal(requirements.requireOpenPitPermit,true);
 const full=mk([base]);
 assert.equal(full.counts.ready,1);
 assert.equal(full.counts.blocked,0);
 assert.equal(full.counts.missingEvidence,0);
 assert.equal(full.rows[0].state,"ready");
 assert.equal(full.rows[0].blockingReasons.length,0);
});

test("missing linked PDFs are tracked separately from expiry-based eligibility",()=>{
 const without={...base,id:"without",name:"No uploaded proof",documents:[],competencyEvidence:{}};
 const summary=mk([without]);
 assert.equal(summary.rows[0].state,"ready"); // supporting PDFs are references, not a new permit system
 assert.equal(summary.counts.missingEvidence,1);
 assert.equal(summary.rows[0].missingEvidence.length,5);
 assert.ok(missingEvidenceLabels(summary.rows[0]).includes("Driver licence"));
 const orphan={...base,id:"orphan",name:"Broken document link",documents:[],competencyEvidence:{...base.competencyEvidence}};
 assert.equal(mk([orphan]).rows[0].missingEvidence.length,5);
});

test("expired, missing and unauthorized required qualifications are blocked",()=>{
 const expired={...base,id:"expired",name:"Expired",competencyExpiry:{...dates,licence:"2026-10-08"}};
 const missing={...base,id:"missing",name:"Missing",competencyExpiry:{...dates,licence:undefined}};
 const unauthorized={...base,id:"unauthorized",name:"No site permit",siteAuthorised:false};
 const summary=mk([expired,missing,unauthorized]);
 assert.equal(summary.counts.blocked,3);
 assert.equal(summary.counts.ready,0);
 assert.match(summary.rows.find(row=>row.id==="expired").blockingReasons.join(" "),/Driver licence has expired/);
 assert.match(summary.rows.find(row=>row.id==="missing").blockingReasons.join(" "),/expiry is missing/);
 assert.match(summary.rows.find(row=>row.id==="unauthorized").blockingReasons.join(" "),/not authorised/);
});

test("site policies change required training without changing saved records",()=>{
 const driver={...base,id:"policy-driver",name:"Policy Driver",firstAid:false,defensiveDriving:false,openPitPermit:false};
 const policies=[
  {id:"office",name:"Gaborone workshop",requireOpenPitPermit:false,requireFirstAid:false,requireDefensiveDriving:false,additionalCriticalChecks:[]},
  {id:"mine",name:"Jwaneng mine · demo profile",requireOpenPitPermit:true,requireFirstAid:true,requireDefensiveDriving:true,additionalCriticalChecks:[]}
 ];
 const office=mk([driver],{site:"Gaborone workshop",policies});
 const mine=mk([driver],{site:"Jwaneng mine · demo profile",policies});
 assert.equal(office.rows[0].state,"ready");
 assert.equal(mine.rows[0].state,"blocked");
 assert.match(mine.rows[0].blockingReasons.join(" "),/First-aid training/);
 assert.equal(driver.firstAid,false);
});

test("active assignments and off-shift status never appear as available to allocate",()=>{
 const busy={...base,id:"busy",name:"Off shift",status:"Off shift"};
 const allocated={...base,id:"allocated",name:"Has assignment"};
 const assignment={id:"A-1",driverId:"allocated",vehicleId:"V-1",status:"Awaiting pre-start",site:"Jwaneng",createdAt:"2026-10-09T10:00:00Z"};
 const summary=mk([busy,allocated],{assignments:[assignment]});
 assert.equal(summary.counts.busy,2);
 assert.equal(summary.counts.ready,0);
 assert.equal(summary.rows.find(row=>row.id==="allocated").activeAssignmentCount,1);
 assert.equal(mk([allocated],{assignments:[{...assignment,status:"Returned"}]}).counts.ready,1);
});

test("inactive or missing linked staff records block the overview under the selected organization",()=>{
 const linked={...base,id:"linked",name:"Staff link",personId:"p-1"};
 const person={id:"p-1",orgId:"demo-mining",active:true};
 assert.equal(mk([linked],{directory:[person]}).counts.ready,1);
 assert.equal(mk([linked],{directory:[{...person,active:false}]}).counts.blocked,1);
 assert.equal(mk([linked],{directory:[{...person,orgId:"another-company"}]}).counts.blocked,1);
 assert.match(mk([linked],{directory:[]}).rows[0].blockingReasons.join(" "),/workforce identity/);
});

test("renewal due counts drivers once and does not classify near-expiry dates as expired",()=>{
 const due={...base,id:"due",name:"Due",competencyExpiry:{...dates,licence:"2026-10-26",firstAid:"2026-10-25"}};
 const expired={...base,id:"expired",name:"Expired",competencyExpiry:{...dates,openPitPermit:"2026-10-08"}};
 const rows=mk([due,expired]);
 assert.equal(rows.counts.dueSoon,1);
 assert.equal(rows.counts.blocked,1);
 assert.equal(rows.rows.find(row=>row.id==="due").dueSoon.length,2);
 assert.equal(rows.rows.find(row=>row.id==="due").state,"ready");
 assert.equal(rows.rows.find(row=>row.id==="expired").expired.length,1);
});

test("empty overview returns zero counts and does not mutate source records",()=>{
 const input=[base];
 const before=JSON.stringify(input);
 const empty=mk([]);
 assert.deepEqual(empty.counts,{total:0,ready:0,blocked:0,busy:0,dueSoon:0,missingEvidence:0});
 mk(input);
 assert.equal(JSON.stringify(input),before);
});

test("Admin home binds the overview and driver management drilldown; regular driver workspace stays separate",()=>{
 const ui=readFileSync(new URL("../apps/web/components/products/MoveTrackShowcase.tsx",import.meta.url),"utf8");
 const panel=readFileSync(new URL("../apps/web/components/products/DriverComplianceOverview.tsx",import.meta.url),"utf8");
 assert.match(ui,/view==="admin"&&adminArea==="overview"\?<DriverComplianceOverview/);
 assert.match(ui,/onManageDriver=\{id=>\{setFocusedDriverId\(id\);setAdminArea\("drivers"\);\}\}/);
 assert.match(ui,/adminMode&&focusedDriverId\?drivers.filter/);
 assert.match(ui,/Show all drivers/);
 assert.match(panel,/Filter driver compliance records/);
 assert.match(panel,/Missing supporting PDF link/);
 assert.match(panel,/Find driver in compliance overview/);
 assert.match(panel,/const perPage=12/);
 assert.match(panel,/visibleRows.map/);
 assert.match(panel,/Page \{activePage\} of \{pages\}/);
 assert.match(panel,/Meeting recorded criteria does not constitute a dispatch release/);
});
