import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {imageInputError,MAX_LOCAL_EVIDENCE_IMAGES,MAX_LOCAL_IMAGE_FILE_BYTES} from "../apps/web/lib/image-evidence.ts";
import {buildFormDocument,documentRows} from "../apps/web/lib/form-exports.ts";
import {validateBackupShape} from "../packages/persistence/src/backup-shape.ts";
import {allWorkspaceViews,fromMoveTrackPath} from "../apps/web/components/products/movetrack-routes.ts";

test("local photo input rejects unsupported, empty and unbounded sources",()=>{
 assert.equal(imageInputError({name:"asset.jpg",type:"image/jpeg",size:1000}),undefined);
 assert.equal(imageInputError({name:"asset.webp",type:"image/webp",size:1000}),undefined);
 assert.match(imageInputError({name:"script.svg",type:"image/svg+xml",size:200})??"",/JPEG, PNG or WebP/);
 assert.match(imageInputError({name:"empty.png",type:"image/png",size:0})??"",/empty/);
 assert.match(imageInputError({name:"huge.jpg",type:"image/jpeg",size:MAX_LOCAL_IMAGE_FILE_BYTES+1})??"",/8 MB/);
 assert.equal(MAX_LOCAL_EVIDENCE_IMAGES,6);
});
test("admin workspace uses independent deep links",()=>{
 assert.ok(allWorkspaceViews.includes("admin"));
 assert.deepEqual(fromMoveTrackPath("/app/admin"),{kind:"workspace",view:"admin"});
});
test("form exports use photo counts, never embedded data URI strings",()=>{
 const template={id:"photo-check",version:1,title:"Photo check",sections:[{id:"s",title:"Evidence",fields:[{id:"photos",label:"Inspected equipment",type:"photo",required:true}]}]};
 const answers={photos:["data:image/jpeg;base64,FAKEPHOTO1","data:image/jpeg;base64,FAKEPHOTO2"]};
 const document=buildFormDocument({template,mode:"draft",answers});
 const text=documentRows(document).flat().join(" ");
 assert.match(text,/2 local photo\(s\) attached/);
 assert.ok(!text.includes("FAKEPHOTO1"));
 assert.ok(!text.includes("FAKEPHOTO2"));
});
test("management data entry is reached through admin and photo capture remains in operational reports",()=>{
 const source=readFileSync(new URL("../apps/web/components/products/MoveTrackShowcase.tsx",import.meta.url),"utf8");
 assert.match(source,/adminMode\?<DesktopModalDisclosure title="Add fleet vehicle"/);
 assert.match(source,/adminMode\?<DesktopModalDisclosure title="Add driver"/);
 assert.match(source,/adminArea==="overview"/);
 assert.match(source,/Defect \/ incident photos/);
 const driver=readFileSync(new URL("../apps/web/components/products/MoveTrackDriverApp.tsx",import.meta.url),"utf8");
 assert.match(driver,/Incident and defect photographs/);
});

test("local photo backup keeps valid legacy records and rejects unsafe image payloads",()=>{
 const key="bokang-studio.move-track.fleet.v2";
 const base={id:"VEH-1",fleetNo:"LV-1",registration:"B 1",makeModel:"Utility",type:"SUV",site:"Depot",status:"Inspection due",roadworthyExpiry:"2027-01-01",extinguisherServiceDue:"2027-01-01"};
 assert.doesNotThrow(()=>validateBackupShape(key,[base]));
 const valid={id:"pic-1",name:"front.jpg",addedAt:"2026-10-09T00:00:00.000Z",dataUrl:"data:image/jpeg;base64,AAAA"};
 assert.doesNotThrow(()=>validateBackupShape(key,[{...base,images:[valid]}]));
 assert.throws(()=>validateBackupShape(key,[{...base,images:[{...valid,dataUrl:"data:image/svg+xml;base64,AAAA"}]}]),/photo evidence/);
 assert.throws(()=>validateBackupShape(key,[{...base,images:Array(7).fill(valid)}]),/photo evidence/);
 assert.throws(()=>validateBackupShape(key,[{...base,images:[{...valid,dataUrl:"data:image/jpeg;base64,"+"A".repeat(140000)}]}]),/photo evidence/);
});
test("driver return defect can attach photo evidence",()=>{
 const source=readFileSync(new URL("../apps/web/components/products/MoveTrackDriverApp.tsx",import.meta.url),"utf8");
 assert.match(source,/Return defect and damage photos/);
 assert.match(source,/images:returnPhotos/);
});

test("admin-only form and OCR template publishing preserve worker reading and inspection access",()=>{
 const forms=readFileSync(new URL("../apps/web/components/products/AssuranceFormsWorkspace.tsx",import.meta.url),"utf8");
 const paper=readFileSync(new URL("../apps/web/components/products/PaperToDigitalWorkspace.tsx",import.meta.url),"utf8");
 const operations=readFileSync(new URL("../apps/web/components/products/MoveTrackShowcase.tsx",import.meta.url),"utf8");
 assert.match(forms,/adminMode\?<CustomFormBuilder/);
 assert.match(paper,/if\(!adminMode\).*Template saving and publishing/);
 assert.match(paper,/if\(!adminMode\).*Custom form designer/);
 assert.match(operations,/adminMode\?<button onClick=\{createAssignment\}/);
 assert.match(operations,/adminMode=\{adminMode\}/);
});
