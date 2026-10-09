import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

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
