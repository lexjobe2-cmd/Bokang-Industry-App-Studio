import test from "node:test";
import assert from "node:assert/strict";
import {proposePaperControls,mergePaperLayout,inferQuestionType} from "../packages/domain-data/src/paper-layout.ts";
import {parsePaperText,unreviewedPaperFields,paperPublicationIssues} from "../packages/domain-data/src/paper-forms.ts";
import {findPaperShapes} from "../apps/web/lib/paper-shapes.ts";
import {isAnswered,evaluateForm} from "../packages/domain-data/src/assurance-forms.ts";

test("visible squares near a printed question convert to a real boolean checkbox",()=>{
 const lines=[{text:"Fire extinguisher present and inspected",page:1,x:51,y:31,width:340,height:15}];
 const marks=[{kind:"checkbox",page:1,x:25,y:30,width:16,height:16,confidence:.88}];
 const found=proposePaperControls(lines,marks,[]);
 assert.equal(found.length,1);
 assert.equal(found[0].type,"checkbox");
 const parsed=parsePaperText("Prestart.pdf","Vehicle inspection checklist\nFire extinguisher present and inspected:\nOperator name:\nNotes:\nBrake status PASS/FAIL:",90,1);
 const combined=mergePaperLayout(parsed,found);
 const field=combined.sections.flatMap(s=>s.fields).find(x=>/extinguisher/i.test(x.label));
 assert.equal(field.type,"checkbox");
 assert.equal(field.source.page,1);
 assert.equal(field.source.reviewed,false);
 assert.equal(isAnswered(field,false),false);
 assert.equal(isAnswered(field,true),true);
});
test("PDF checkboxes/radios and choice lists preserve field coordinates and options",()=>{
 const w=[{page:1,kind:"checkbox",label:"All attendees present",x:20,y:65,width:15,height:15},
  {page:1,kind:"radio",label:"Priority",x:20,y:100,width:18,height:18,choices:["Low","Medium","High"]},
  {page:2,kind:"select",label:"Site",x:30,y:75,width:100,height:20,choices:["Jwaneng","Orapa"]},
  {page:2,kind:"signature",label:"Supervisor signature",x:100,y:130,width:160,height:34}];
 const found=proposePaperControls([],[],w);
 assert.deepEqual(found.map(e=>e.type),["checkbox","radio","select","signature"]);
 assert.deepEqual(found[1].options,["Low","Medium","High"]);
 assert.equal(found[2].page,2);
 assert.equal(found[1].source,"acroform");
});
test("OCR visual symbols and tabular headers reconstruct editable multi-choice and repeat",()=>{
 const lines=[
  {page:1,x:10,y:25,width:290,height:20,text:"PPE required: [ ] Gloves [ ] Eye protection"},
  {page:1,x:10,y:75,width:350,height:18,text:"Employee name | Department | Signature | Date"}
 ];
 const found=proposePaperControls(lines,[],[]);
 assert.equal(found.length,2);
 assert.equal(found[0].type,"multiselect");
 assert.equal(found[1].type,"repeat");
 const parsed=parsePaperText("site-register.pdf","SHE meeting register\nPPE required: [ ] Gloves [ ] Eye protection\nEmployee name | Department | Signature | Date\nAttendees names and contact numbers",90);
 const merged=mergePaperLayout(parsed,found);
 const rep=merged.sections.flatMap(s=>s.fields).find(f=>f.type==="repeat");
 assert.ok(rep.children.length>=3);
 assert.ok(merged.summary.table>=1);
 assert.equal(merged.sections.flatMap(s=>s.fields).filter(f=>f.critical).length,0,"imports do not automatically authorize or mark critical controls");
});
test("raster border pixels identify printed checkbox outline without relying on OCR text",()=>{
 const w=120,h=70,data=new Uint8ClampedArray(w*h*4).fill(255);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;data[i+3]=255;}
 function ink(x,y){const i=(y*w+x)*4;data[i]=0;data[i+1]=0;data[i+2]=0;}
 for(let v=0;v<16;v++){ink(13+v,21);ink(13+v,36);ink(13,21+v);ink(28,21+v);}
 const found=findPaperShapes({width:w,height:h,data});
 assert.ok(found.some(m=>m.kind==="checkbox"&&Math.abs(m.x-13)<=1&&Math.abs(m.y-21)<=1));
});
test("false or missing single check cannot satisfy required confirmation",()=>{
 const t={id:"t",version:1,status:"PUBLISHED",title:"Permit check",category:"Safety",siteIds:[],assetClasses:[],sections:[{id:"s",title:"Entry",fields:[{id:"confirmed",label:"Guardrails fitted",required:true,type:"checkbox"}]}]};
 assert.equal(evaluateForm(t,{confirmed:false}).decision,"INCOMPLETE");
 assert.equal(evaluateForm(t,{confirmed:true}).decision,"COMPLETE");
});

test("source review gate blocks publishing guessed graphical fields until reviewed",()=>{
 const box={id:"f1",label:"Confirm fall prevention",type:"checkbox",required:false,
  source:{page:2,bounds:{x:20,y:30,width:14,height:14},confidence:.67,kind:"visual",reviewed:false}};
 const sections=[{id:"work",title:"Work at heights",fields:[box]}];
 assert.equal(unreviewedPaperFields(sections).length,1);
 assert.equal(unreviewedPaperFields([{...sections[0],fields:[{...box,source:{...box.source,reviewed:true}}]}]).length,0);
 assert.equal(unreviewedPaperFields([{...sections[0],fields:[{...box,source:undefined}]}]).length,0);
});

test("OCR proposes real directory pickers and signatures for familiar printed form labels",()=>{
 const extraction=parsePaperText("Weekly SHE form.pdf",
  ["SHE Meeting and attendance register","Chairperson: __________","Staff attending: __________","Apologies: __________","Supervisor signature: __________","Meeting date: _______"].join(String.fromCharCode(10)),90,1);
 const fields=extraction.sections.flatMap(x=>x.fields);
 assert.equal(fields.find(x=>/Chairperson/i.test(x.label))?.type,"person");
 assert.equal(fields.find(x=>/Staff attending/i.test(x.label))?.type,"people");
 assert.equal(fields.find(x=>/Apologies/i.test(x.label))?.type,"people");
 assert.equal(fields.find(x=>/signature/i.test(x.label))?.type,"signature");
});
test("OCR publication requires meaningful choices, columns and source review",()=>{
 const section={id:"section1",title:"W@H",fields:[
  {id:"f1",label:"PPE types",type:"multiselect",required:false,options:["Option 1","Option 2"],
   source:{page:1,confidence:0.65,bounds:{x:10,y:10,width:80,height:22},kind:"visual",reviewed:true}},
  {id:"f2",label:"Line item",type:"repeat",children:[{id:"c1",label:"New column",type:"text"}]},
  {id:"f3",label:"Unlabeled PDF input",type:"text"}
 ]};
 const issues=paperPublicationIssues([section]);
 assert.ok(issues.some(x=>x.includes("placeholder choices")));
 assert.ok(issues.some(x=>x.includes("name all table columns")));
 assert.ok(issues.some(x=>x.includes("source question label")));
 const fixed={...section,fields:[
  {...section.fields[0],options:["Gloves","Harness"]},
  {...section.fields[1],children:[{id:"c1",label:"Inspection item",type:"text"}]},
  {...section.fields[2],label:"Employee name"}
 ]};
 assert.deepEqual(paperPublicationIssues([fixed]),[]);
 assert.ok(paperPublicationIssues([{...section,fields:[{...fixed.fields[0],source:{...fixed.fields[0].source,reviewed:false}}]}]).some(x=>x.includes("compare")));
});
