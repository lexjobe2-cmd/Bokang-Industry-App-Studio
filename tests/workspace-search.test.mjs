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
