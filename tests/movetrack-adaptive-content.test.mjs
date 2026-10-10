import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import * as requireModule from "node:module";
import * as vmModule from "node:vm";

const product=(name)=>readFileSync(new URL("../apps/web/components/products/"+name+".tsx",import.meta.url),"utf8");
const content=product("MoveTrackReadableContent");
const theme=product("MoveTrackThemeStyles");
const picker=product("OrganizationPeopleComboBox");
const directory=product("MoveTrackWorkspaceDirectory");
const help=product("MoveTrackHelpCenter");
const company=product("MoveTrackCompanySummary");

test("shared typography never forces fixed heights or truncates safety-critical dynamic content",()=>{
 assert.match(theme,/\.movetrack-root \.movetrack-readable-text/);
 assert.match(theme,/overflow-wrap:anywhere;word-break:normal;white-space:normal;line-height:1\.55/);
 assert.match(theme,/\.movetrack-readable-text\[data-variant="heading"\]/);
 assert.match(theme,/\.movetrack-rich-content :is\(p,h2,h3,ul,ol,blockquote,li\)/);
 assert.match(theme,/\[data-preserve-lines="true"\] \{white-space:pre-wrap;\}/);
 assert.doesNotMatch(theme,/\.movetrack-readable-text[^\n]*text-overflow:ellipsis/);
 for(const tone of ["primary","muted","link","danger","warning","success"])
  assert.ok(theme.includes('data-tone="'+tone+'"'),"Missing paired theme tone "+tone);
});

test("long company, workspace and employee fields reuse exactly one rendering contract",()=>{
 assert.match(company,/MoveTrackReadableText as="h2" variant="heading"/);
 assert.match(directory,/MoveTrackReadableText as="strong" variant="heading"/);
 assert.match(directory,/MoveTrackReadableText as="small" variant="meta" tone="muted"/);
 assert.match(picker,/MoveTrackReadableText as="strong" variant="heading"/);
 assert.match(picker,/MoveTrackReadableText as="span" variant="meta" tone="muted"/);
 assert.match(picker,/grid-auto-rows:max-content;align-content:start/);
});

test("rich text uses semantic React nodes, not unsafe HTML, and refuses dangerous links",()=>{
 assert.match(content,/export type MoveTrackRichBlock/);
 for(const tag of ["h2","h3","p","blockquote","li","strong","em","code","a"])
  assert.ok(content.includes("<"+tag)||content.includes('"'+tag+'"'),"Missing semantics for "+tag);
 assert.match(content,/safeMoveTrackHref\(item.href\)/);
 assert.match(content,/\["http:","https:","mailto:"\]/);
 assert.doesNotMatch(content,/dangerouslySetInnerHTML|innerHTML|DOMParser/);
 assert.match(help,/MoveTrackRichContent blocks=/);
});

test("React-controlled workforce inputs and saved values are not replaced by static markup",()=>{
 assert.match(picker,/value=\{query\} onChange=\{e=>setQuery\(e.target.value\)\}/);
 assert.match(picker,/onChange\(next\)/);
 assert.match(picker,/onChange\(\[\]\)/);
});

test("rich renderer is safe at runtime and preserves actual semantic document blocks",()=>{
 const {createRequire}=requireModule;
 const localRequire=createRequire(new URL("../apps/assurance-demo/package.json",import.meta.url));
 const ts=createRequire(new URL("../package.json",import.meta.url))("typescript");
 const vm=vmModule;
 const source=product("MoveTrackReadableContent");
 const js=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};
 vm.runInNewContext(js,{require:localRequire,exports:module.exports,module,URL});
 const {safeMoveTrackHref,MoveTrackRichContent}=module.exports;
 const React=localRequire("react"),{renderToStaticMarkup}=localRequire("react-dom/server");
 assert.equal(safeMoveTrackHref("javascript:alert(1)"),undefined);
 assert.equal(safeMoveTrackHref("//attacker.invalid"),undefined);
 assert.equal(safeMoveTrackHref("data:text/html,hello"),undefined);
 assert.equal(safeMoveTrackHref("/app/fleet"),"/app/fleet");
 assert.equal(safeMoveTrackHref("https://example.com/guide"),"https://example.com/guide");
 const html=renderToStaticMarkup(React.createElement(MoveTrackRichContent,{blocks:[
  {type:"heading",level:2,content:[{text:"Safety review"}]},
  {type:"paragraph",content:[{text:"Hazard "},{text:"critical",bold:true},{text:" <script>alert(1)</script>"}]},
  {type:"list",ordered:false,items:[[{text:"Use required PPE"}],[{text:"View policy",href:"/app/forms"}]]},
  {type:"paragraph",content:[{text:"Do not open",href:"javascript:alert(1)"}]}
 ]}));
 assert.match(html,/<h2[^>]*>/);assert.match(html,/<strong>critical<\/strong>/);
 assert.match(html,/<ul>/);assert.match(html,/href="\/app\/forms"/);
 assert.ok(!html.includes('href="javascript:'));
 assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
});
