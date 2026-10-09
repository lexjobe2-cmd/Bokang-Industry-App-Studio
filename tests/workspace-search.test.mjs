import test from "node:test";
import assert from "node:assert/strict";
import {workspaceIndex,makeSearchProvider,searchDocuments,normalizeSearch} from "../packages/domain-data/src/workspace-search.ts";

const provider=(id,items,category="dynamic")=>makeSearchProvider({
 id,category,target:"forms",items,
 toDocument:x=>({id:x.uuid,title:x.title,description:x.description??"",fields:[x.site??"",x.jobId??"",x.industry??""],status:x.status??""})
});
test("vendor-free index registers arbitrary providers and de-duplicates within each source",()=>{
 const a=workspaceIndex([provider("forms",[{uuid:"one",title:"Working at heights",site:"Jwaneng"},{uuid:"one",title:"Updated height form"}]),provider("companies",[{uuid:"one",title:"Company with same identifier"}])]);
 assert.equal(a.length,2);
 assert.ok(a.some(x=>x.title==="Updated height form"));
 assert.ok(a.some(x=>x.source==="companies"));
});
test("search dynamically indexes new sites, sectors, jobs and titles without fixed allowed words",()=>{
 const before=workspaceIndex([provider("jobs",[{uuid:"j1",title:"Tyre inflation verification",jobId:"DUMP-992"}],"Jobs")]);
 assert.deepEqual(searchDocuments(before,"turquoise"),[]);
 const after=workspaceIndex([provider("jobs",[{uuid:"j1",title:"Tyre inflation verification",jobId:"DUMP-992"},
 {uuid:"j2",title:"Hydrogen drone logistics",site:"Mahalapye",industry:"Renewable energy"}],"Jobs")]);
 assert.equal(searchDocuments(after,"hydrogen mahalapye")[0].id,"j2");
 assert.equal(searchDocuments(after,"DUMP-992")[0].id,"j1");
 assert.equal(searchDocuments(after,"renewable")[0].id,"j2");
 assert.deepEqual(searchDocuments(after,"synthesizer"),[]);
});
test("search matches punctuation, case and accents; ranks title over background fields",()=>{
 const data=workspaceIndex([provider("x",[{uuid:"1",title:"Kagisó Dube"},{uuid:"2",title:"Team",description:"Kagiso Dube"}])]);
 assert.equal(normalizeSearch("MöVE-Track  PRe-START"),"move track pre start");
 assert.deepEqual(searchDocuments(data,"kagiso dube").map(x=>x.id),["1","2"]);
 assert.equal(searchDocuments(data,"KAGISÓ DUBE")[0].id,"1");
});
test("facets and sources limit cross-scope results, no accidental substring from image/base64",()=>{
 const docs=workspaceIndex([provider("forms",[{uuid:"f1",title:"Fall protection" }],"Safety"),
 provider("incidents",[{uuid:"d1",title:"Fall critical incident"}],"Defects")]);
 assert.equal(searchDocuments(docs,"fall",{category:"Safety"}).length,1);
 assert.equal(searchDocuments(docs,"fall",{source:"incidents"}).length,1);
 assert.equal(searchDocuments(docs,"fall",{limit:1}).length,1);
 assert.equal(searchDocuments(docs,"ZZZZZ").length,0);
});

test("MoveTrack adapter indexes new live records and routes results without provider lock-in",async()=>{
 const {buildWorkspaceIndex,searchWorkspace}=await import("../apps/web/lib/workspace-search.ts");
 const data={
  orgId:"org-1",organizations:[],people:[],templates:[],jras:[],
  forms:[{
   id:"FORM-10",templateId:"custom-1",templateSnapshot:{title:"Tyre cage inspection",category:"Safety",organizationId:"org-1",sections:[{id:"s",fields:[{id:"note",label:"Defect observation"}]}]},
   answers:{note:"Valve leak on haul unit DUMP-77"},siteId:"South yard",taskId:"WO-100",decision:"NO_GO",submittedAt:"2026-10-09T08:00:00Z"
  },{
   id:"FORM-PRIVATE",templateId:"private",templateSnapshot:{title:"Other company private incident",category:"Safety",organizationId:"org-2",sections:[]},
   answers:{},siteId:"Elsewhere",decision:"REVIEW",submittedAt:"2026-10-09T08:00:00Z"
  }],
  fleet:[{id:"V-9",fleetNo:"DT-900",makeModel:"CAT haul truck",registration:"DEMO-V9",type:"Dump truck",site:"South yard",status:"No-go"}],
  drivers:[],incidents:[{id:"INC-19",vehicleId:"V-9",category:"Defect",severity:"High",status:"Open",description:"Hydraulic pressure sensor fault",createdAt:"2026-10-09T08:00:00Z"}],
  assignments:[],prestarts:[],sites:[],
  jobs:[{id:"WO-100",client:"Mine service",type:"Maintenance",from:"Yard",to:"Pit",driver:"Unassigned",state:"Open"}]
 };
 const index=buildWorkspaceIndex(data);
 assert.equal(index.filter(x=>x.kind==="Safety workflow").length,21);
 assert.ok(searchWorkspace(index,"haul unit dump 77").some(x=>x.key==="submission:FORM-10"));
 assert.ok(searchWorkspace(index,"DT-900").some(x=>x.key==="asset:V-9"));
 assert.ok(searchWorkspace(index,"Hydraulic sensor").some(x=>x.key==="incident:INC-19"));
 assert.ok(searchWorkspace(index,"mine service").some(x=>x.key==="job:WO-100"));
 assert.equal(searchWorkspace(index,"private incident").some(x=>x.key==="submission:FORM-PRIVATE"),false);
 assert.equal(searchWorkspace(index,"").length,0);
});

test("search pagination and tolerant spelling work for any new provider without fixed search dependencies",()=>{
 const data=workspaceIndex([provider("dynamic-evs",Array.from({length:67},(_,i)=>({
  uuid:"ev-"+i,title:"Scaffolding inspection "+i,description:"Document / bay "+i,site:"Botswana-Zone-"+i})))]);
 assert.equal(searchDocuments(data,"scaffolding",{limit:15}).length,15);
 assert.equal(searchDocuments(data,"scaffolding",{limit:15,offset:15})[0].id,"ev-15");
 assert.equal(searchDocuments(data,"scafolding",{limit:15}).length,15);
 assert.equal(searchDocuments(data,"botswana zone 33")[0].id,"ev-33");
 assert.equal(searchDocuments(data,"scaffolding",{source:"unknown"}).length,0);
 const added=workspaceIndex([provider("new-connector",[{uuid:"x1",title:"Future industrial catalyst risk control",industry:"Green hydrogen"}],"Innovation")]);
 assert.equal(searchDocuments(added,"hydrogen catalyst",{category:"Innovation"})[0].id,"x1");
});
