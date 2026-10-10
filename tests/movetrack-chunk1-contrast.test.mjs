import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=name=>readFileSync(new URL("../apps/web/components/products/"+name+".tsx",import.meta.url),"utf8");
const css=read("MoveTrackThemeStyles"),fleet=read("MoveTrackShowcase");
const company=read("OrganizationOnboarding"),directory=read("CompanyDirectoryImport");
const colors=[
 ["#f5f9ff","#162940"],["#c5d7ed","#162940"],
 ["#f5f9ff","#172e4b"],["#f5f9ff","#1a3a63"],
 ["#c5d7ed","#172e4b"],["#c5d7ed","#1a3a63"],
 ["#f5f9ff","#253e5e"],["#172b46","#f1f6ff"],
 ["#172b46","#ffffff"],["#516078","#ffffff"]
];
function light(hex){
 const linear=hex.slice(1).match(/../g).map(t=>parseInt(t,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
 return linear[0]*0.2126+linear[1]*0.7152+linear[2]*0.0722;
}
function contrast(a,b){const x=light(a),y=light(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}
test("Chunk 1: company hero and fleet number pairs meet WCAG AA text contrast",()=>{
 for(const [fg,bg] of colors)assert.ok(contrast(fg,bg)>=4.5,fg+" against "+bg+" = "+contrast(fg,bg).toFixed(2));
});
test("Chunk 1: each Fleet KPI has a dedicated dark/light class and visible number",()=>{
 assert.match(fleet,/className="movetrack-control-stat"/);
 assert.match(fleet,/className="movetrack-control-stat-label"/);
 assert.match(fleet,/className=\{label==="Grounded"/);
 assert.match(css,/data-theme="dark"\] \.movetrack-control-stat-value \{color:#f5f9ff !important/);
 assert.match(css,/data-theme="light"\] \.movetrack-control-stat-value \{color:#172b46 !important/);
 assert.match(css,/\.movetrack-control-stat-value\.is-danger \{color:#ffabb5 !important/);
 for(const label of ["Available","Assigned","In use","Inspection due","Grounded","Open defects"]){
  assert.ok(fleet.includes('"'+label+'"'),"Missing visible KPI: "+label);
 }
});
test("Chunk 1: company hero switches both its light/dark background and text together",()=>{
 assert.match(company,/className="movetrack-company-setup-hero"/);
 for(const selector of ["movetrack-company-hero-title","movetrack-company-hero-description","movetrack-company-hero-eyebrow"])
  assert.match(company,new RegExp('className="'+selector+'"'));
 assert.match(css,/\.movetrack-company-setup-hero \{\s*background:linear-gradient\(110deg,#172e4b,#1a3a63\) !important/);
 assert.match(css,/\.movetrack-company-setup-hero \{\s*background:linear-gradient\(110deg,#fff,#eaf2ff\) !important/);
 assert.match(css,/\.movetrack-company-hero-title \{color:#f5f9ff !important/);
 assert.match(css,/\.movetrack-company-hero-title \{color:#172b46 !important/);
});
test("Chunk 1: buttons preserve their working callbacks and readable colors",()=>{
 assert.match(company,/className="movetrack-company-add" style=\{primary\} onClick=\{resetDraft\}/);
 assert.match(company,/className="movetrack-company-edit"[^\n]*onClick=\{\(\)=>editCompany\(currentOrg\)\}/);
 assert.match(company,/className="movetrack-company-start"[^\n]*onClick=\{resetDraft\}/);
 assert.match(directory,/className="movetrack-company-import"[^\n]*onClick=\{\(\)=>setOpen\(v=>!v\)\}/);
 for(const button of ["movetrack-company-add","movetrack-company-edit","movetrack-company-start","movetrack-company-import"]){
  assert.match(css,new RegExp("\\."+button));
 }
 assert.match(css,/data-theme="dark"\] \.movetrack-company-import \{\s*color:#f5f9ff !important;background:#253e5e !important/);
});
