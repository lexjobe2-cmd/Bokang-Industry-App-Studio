import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {applyReviewedDriverCompetency,credentialKeys,MAX_DRIVER_COMPETENCY_HISTORY} from "../apps/web/lib/driver-competency.ts";
import {starterDrivers} from "../apps/web/lib/move-track.ts";
import {validateBackupShape} from "../packages/persistence/src/backup-shape.ts";
import {writeLocalValue,makeWorkspaceBackup,parseWorkspaceBackup,restoreWorkspaceBackup} from "../packages/persistence/src/local-store.ts";

const pdf={id:"PDF-A",name:"First aid renewed.pdf",mimeType:"application/pdf",dataUrl:"data:application/pdf;base64,JVBERi0=",addedAt:"2026-10-09T12:00:00Z"};
const other={...pdf,id:"PDF-B",name:"Licence certificate.pdf"};
const original={...starterDrivers[0],documents:[pdf,other]};
const flags={siteAuthorised:original.siteAuthorised,openPitPermit:original.openPitPermit,firstAid:original.firstAid,defensiveDriving:original.defensiveDriving};
const first=(driver=original,overrides={})=>{
 let counter=0;
 return applyReviewedDriverCompetency({
  driver,authorisations:flags,expiry:{...driver.competencyExpiry,firstAid:"2028-04-11"},
  evidence:{...driver.competencyEvidence,firstAid:pdf.id},
  reviewedAt:"2026-10-09T14:00:00Z",reviewerName:"Local Supervisor",
  createId:()=>("REN-"+ ++counter),...overrides
 });
};
const storageKey="bokang-studio.move-track.drivers.v2";
class FakeStorage{
 data=new Map();
 get length(){return this.data.size;}
 key(i){return [...this.data.keys()][i]??null;}
 getItem(key){return this.data.get(key)??null;}
 setItem(key,v){this.data.set(key,String(v));}
 removeItem(key){this.data.delete(key);}
}

test("reviewed renewal links uploaded PDF by stable ID and snapshots history without duplicating bytes",()=>{
 const updated=first();
 assert.equal(updated.competencyExpiry.firstAid,"2028-04-11");
 assert.equal(updated.competencyEvidence.firstAid,pdf.id);
 assert.equal(updated.competencyHistory.length,1);
 const entry=updated.competencyHistory[0];
 assert.equal(entry.credential,"firstAid");
 assert.equal(entry.previousExpiry,original.competencyExpiry.firstAid);
 assert.equal(entry.newExpiry,"2028-04-11");
 assert.equal(entry.documentId,pdf.id);
 assert.equal(entry.documentName,pdf.name);
 assert.equal(entry.reviewerName,"Local Supervisor");
 assert.equal(entry.reviewedAt,"2026-10-09T14:00:00Z");
 assert.equal(JSON.stringify(entry).includes("JVBERi0"),false);
 assert.deepEqual(updated.documents,original.documents);
 assert.equal(updated.status,original.status);
 assert.equal(updated.siteAuthorised,original.siteAuthorised);
});

test("PDF is required for new expiry; missing, forged or unknown references cannot be linked",()=>{
 assert.throws(()=>first(original,{evidence:{}}),/link an uploaded supporting PDF/);
 assert.throws(()=>first(original,{evidence:{firstAid:"PDF-MISSING"}}),/selected supporting PDF is missing/);
 assert.throws(()=>first(original,{evidence:{firstAid:pdf.id,unknown:"PDF-A"}}),/Unknown driver competency evidence/);
 assert.throws(()=>first(original,{reviewerName:""}),/valid supervisor review/);
});

test("reviewed evidence-only linking and authorization changes keep dated snapshots",()=>{
 const linked=first(original,{expiry:original.competencyExpiry,evidence:{licence:other.id}});
 assert.equal(linked.competencyHistory.length,1);
 assert.equal(linked.competencyHistory[0].credential,"licence");
 assert.equal(linked.competencyHistory[0].newExpiry,original.competencyExpiry.licence);
 assert.equal(linked.competencyHistory[0].documentName,other.name);
 const changed=first(original,{authorisations:{...flags,firstAid:false},expiry:original.competencyExpiry,evidence:{}});
 assert.equal(changed.firstAid,false);
 assert.equal(changed.competencyHistory[0].previousAuthorised,true);
 assert.equal(changed.competencyHistory[0].newAuthorised,false);
});

test("renewal events prepend to history while maintaining older snapshots and legacy dates",()=>{
 const firstSave=first();
 const next=first(firstSave,{
  expiry:{...firstSave.competencyExpiry,firstAid:"2029-04-11"},
  evidence:{...firstSave.competencyEvidence,firstAid:other.id},
  reviewedAt:"2027-10-09T12:00:00Z",
  createId:()=> "REN-SECOND"
 });
 assert.equal(next.competencyHistory.length,2);
 assert.equal(next.competencyHistory[0].id,"REN-SECOND");
 assert.equal(next.competencyHistory[0].previousDocumentId,pdf.id);
 assert.equal(next.competencyHistory[1].documentName,pdf.name);
 assert.equal(next.competencyHistory[1].newExpiry,"2028-04-11");
 assert.throws(()=>first(original,{expiry:original.competencyExpiry,evidence:{}}),/No changes to save/);
});

test("bounded history refuses writes rather than silently discarding past reviewed events",()=>{
 const event=first().competencyHistory[0];
 const full={...original,competencyHistory:Array.from({length:MAX_DRIVER_COMPETENCY_HISTORY},(_,i)=>({...event,id:"old-"+i}))};
 assert.throws(()=>first(full),/Renewal history limit reached/);
});

test("backup import validates certificate ownership, expiry structure and history limits",()=>{
 const current=first();
 assert.doesNotThrow(()=>validateBackupShape(storageKey,[current]));
 assert.doesNotThrow(()=>validateBackupShape(storageKey,[original]));
 assert.throws(()=>validateBackupShape(storageKey,[{...current,competencyEvidence:{firstAid:"forged"}}]),/linked driver competency PDFs/);
 assert.throws(()=>validateBackupShape(storageKey,[{...current,competencyEvidence:{unknown:pdf.id}}]),/linked driver competency PDFs/);
 assert.throws(()=>validateBackupShape(storageKey,[{...current,competencyHistory:Array(81).fill(current.competencyHistory[0])}]),/competency renewal history/);
 assert.throws(()=>validateBackupShape(storageKey,[{...current,competencyHistory:[{...current.competencyHistory[0],newExpiry:"2026-02-30"}]}]),/competency renewal history/);
 assert.throws(()=>validateBackupShape(storageKey,[{...current,competencyHistory:[{...current.competencyHistory[0],reviewerName:""}]}]),/competency renewal history/);
});

test("PDF reference and renewal audit survive a full export, import and page-reload simulation",async()=>{
 const prior=globalThis.window;
 const store=new FakeStorage();
 globalThis.window={localStorage:store,addEventListener(){}};
 try{
  const edited=first();
  writeLocalValue(storageKey,[edited]);
  const pack=parseWorkspaceBackup(JSON.stringify(makeWorkspaceBackup(store)));
  const restored=new FakeStorage();
  assert.equal(restoreWorkspaceBackup(restored,pack),1);
  const copy=JSON.parse(restored.getItem(storageKey));
  assert.equal(copy[0].competencyEvidence.firstAid,pdf.id);
  assert.equal(copy[0].competencyHistory[0].newExpiry,"2028-04-11");
  assert.equal(copy[0].documents[0].id,pdf.id);
  const fresh=await import("../packages/persistence/src/local-store.ts?credential-document-refresh");
  assert.equal(fresh.getLocalValue(storageKey,[])[0].competencyHistory[0].documentName,pdf.name);
 }finally{globalThis.window=prior;}
});

test("UI binds active certificate selection to signed scope, and blocks deletion of linked PDFs",()=>{
 const source=readFileSync(new URL("../apps/web/components/products/MoveTrackShowcase.tsx",import.meta.url),"utf8");
 const panel=readFileSync(new URL("../apps/web/components/products/DriverCompetencyPanel.tsx",import.meta.url),"utf8");
 assert.equal(credentialKeys.length,5);
 assert.match(source,/applyReviewedDriverCompetency\(\{/);
 assert.match(source,/credentialKeys.map\(key=>key\+":"\+\(competencyEvidenceDrafts/);
 assert.match(source,/linked to a current or pending competency/);
 assert.match(panel,/Supporting certificate \(PDF\)/);
 assert.match(panel,/Renewal & change history/);
 assert.match(panel,/event.documentName/);
});
