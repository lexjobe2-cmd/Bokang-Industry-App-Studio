import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {credentialDateStatus,credentialAlerts,driverEligibilityReasons,validCredentialDate,validateCompetencyExpiry} from "../apps/web/lib/driver-competency.ts";
import {evaluatePrestart,starterDrivers,starterFleet} from "../apps/web/lib/move-track.ts";
import {miningPrestartChecks} from "../packages/domain-data/src/index.ts";
import {validateBackupShape} from "../packages/persistence/src/backup-shape.ts";
import {writeLocalValue,makeWorkspaceBackup,parseWorkspaceBackup,restoreWorkspaceBackup} from "../packages/persistence/src/local-store.ts";

const now=new Date(2026,9,9,12,0,0);
const dates={licence:"2026-12-01",siteAuthorisation:"2026-12-01",openPitPermit:"2026-12-01",firstAid:"2026-12-01",defensiveDriving:"2026-12-01"};
const driver={id:"DRV-TEST",name:"Safety Test",phone:"",licenceNo:"BW-L-001",status:"Available",
 siteAuthorised:true,openPitPermit:true,firstAid:true,defensiveDriving:true,competencyExpiry:dates};
const key="bokang-studio.move-track.drivers.v2";
class FakeStorage{data=new Map();get length(){return this.data.size}key(i){return [...this.data.keys()][i]??null}getItem(k){return this.data.get(k)??null}setItem(k,v){this.data.set(k,String(v))}removeItem(k){this.data.delete(k)}}

test("dates classify at calendar-day boundaries and not by clock hours",()=>{
 assert.equal(credentialDateStatus("2026-10-08",now).state,"expired");
 assert.equal(credentialDateStatus("2026-10-09",now).state,"due");
 assert.deepEqual(credentialDateStatus("2026-10-10",now),{state:"due",daysRemaining:1});
 assert.equal(credentialDateStatus("2026-11-08",now).daysRemaining,30);
 assert.equal(credentialDateStatus("2026-11-09",now).state,"current");
 assert.equal(credentialDateStatus("",now).state,"missing");
 assert.equal(credentialDateStatus("2026-02-30",now).state,"missing");
 assert.equal(validCredentialDate("2028-02-29"),true);
 assert.equal(validCredentialDate("2027-02-29"),false);
});
test("expired required qualification or missing expiry blocks dispatch, valid due-soon date does not",()=>{
 assert.deepEqual(driverEligibilityReasons(driver,{requireOpenPitPermit:true,requireFirstAid:true,requireDefensiveDriving:true},now),[]);
 const expired={...driver,competencyExpiry:{...dates,openPitPermit:"2026-10-01"}};
 assert.match(driverEligibilityReasons(expired,{requireOpenPitPermit:true},now).join(" / "),/Site\/open-pit permit has expired/);
 const missing={...driver,competencyExpiry:{licence:"2026-12-01"}};
 assert.match(driverEligibilityReasons(missing,{requireFirstAid:true},now).join(" / "),/First-aid training expiry is missing/);
 assert.match(driverEligibilityReasons({...driver,competencyExpiry:undefined},{},now).join(" / "),/Driver licence expiry is missing/);
 const due={...driver,competencyExpiry:{...dates,firstAid:"2026-10-26"}};
 assert.equal(driverEligibilityReasons(due,{requireFirstAid:true},now).length,0);
 assert.equal(credentialAlerts(due,now).find(row=>row.key==="firstAid")?.state,"due");
});
test("requirements are site-specific while licence/site authorization must always be current",()=>{
 const inactive={...driver,openPitPermit:false,competencyExpiry:{...dates,firstAid:"2026-10-01"}};
 assert.deepEqual(driverEligibilityReasons(inactive,{},now),[]);
 assert.match(driverEligibilityReasons(inactive,{requireOpenPitPermit:true},now).join(" / "),/not authorised/);
 assert.match(driverEligibilityReasons(inactive,{requireFirstAid:true},now).join(" / "),/expired/);
 assert.match(driverEligibilityReasons({...driver,siteAuthorised:false},{},now).join(" / "),/not authorised/);
});
test("prestart fail-closed for stale competency even with all checkboxes passed",()=>{
 const checks=Object.fromEntries(miningPrestartChecks.map(key=>[key,"pass"]));
 const vehicle={...starterFleet[0],status:"Available",roadworthyExpiry:"2027-09-30",extinguisherServiceDue:"2027-09-30"};
 const evaluated=evaluatePrestart({checks,criticalChecks:[],vehicle,driver:{...driver,competencyExpiry:{...dates,licence:"2024-01-01"}}});
 assert.equal(evaluated.result,"NO-GO");
 assert.match(evaluated.reasons.join(" / "),/Driver licence has expired/);
});
test("only supported valid expiry fields enter persisted driver records and backups",()=>{
 assert.deepEqual(validateCompetencyExpiry({...dates,firstAid:""}),{licence:dates.licence,siteAuthorisation:dates.siteAuthorisation,openPitPermit:dates.openPitPermit,defensiveDriving:dates.defensiveDriving});
 assert.throws(()=>validateCompetencyExpiry({...dates,licence:"2026-02-30"}),/valid expiry date/);
 assert.doesNotThrow(()=>validateBackupShape(key,[driver]));
 assert.doesNotThrow(()=>validateBackupShape(key,[{...driver,competencyExpiry:undefined}]));
 assert.throws(()=>validateBackupShape(key,[{...driver,competencyExpiry:{licence:"2026-02-30"}}]),/competency expiry/);
 assert.throws(()=>validateBackupShape(key,[{...driver,competencyExpiry:{unknown:"2027-12-31"}}]),/competency expiry/);
 assert.throws(()=>validateBackupShape(key,[{...driver,competencyExpiry:{firstAid:42}}]),/competency expiry/);
});
test("credential dates persist through local backup and simulated reload",async()=>{
 const previous=globalThis.window,storage=new FakeStorage();
 globalThis.window={localStorage:storage,addEventListener(){}};
 try{
  writeLocalValue(key,[driver]);
  const backup=parseWorkspaceBackup(JSON.stringify(makeWorkspaceBackup(storage)));
  const restored=new FakeStorage();
  assert.equal(restoreWorkspaceBackup(restored,backup),1);
  assert.equal(JSON.parse(restored.getItem(key))[0].competencyExpiry.firstAid,"2026-12-01");
  const fresh=await import("../packages/persistence/src/local-store.ts?driver-competency-reload");
  assert.equal(fresh.getLocalValue(key,[])[0].competencyExpiry.licence,"2026-12-01");
 }finally{globalThis.window=previous;}
});
test("UI binds expiry review signature and guards both dispatch and checkout",()=>{
 const admin=readFileSync(new URL("../apps/web/components/products/MoveTrackShowcase.tsx",import.meta.url),"utf8");
 const driverApp=readFileSync(new URL("../apps/web/components/products/MoveTrackDriverApp.tsx",import.meta.url),"utf8");
 const panel=readFileSync(new URL("../apps/web/components/products/DriverCompetencyPanel.tsx",import.meta.url),"utf8");
 assert.match(admin,/driverEligibilityReasons\(driver,/);
 assert.match(admin,/driverScope\(driver,authorizationDrafts\[driver.id\]!\)/);
 assert.match(admin,/competencyExpiry,authorizationReview:/);
 assert.match(admin,/credentialKeys.map\(key=>key\+":"\+/);
 assert.match(driverApp,/driverEligibilityReasons\(driver,/);
 assert.match(driverApp,/Cannot start shift; qualifications or vehicle validity changed/);
 assert.match(panel,/DesktopModal title=\{/);
});
