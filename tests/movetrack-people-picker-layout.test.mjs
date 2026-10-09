import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const picker=readFileSync(new URL("../apps/web/components/products/OrganizationPeopleComboBox.tsx",import.meta.url),"utf8");
const component=(name)=>readFileSync(new URL("../apps/web/components/products/"+name+".tsx",import.meta.url),"utf8");

test("mobile employee rows grow to content height instead of overlapping neighbouring people",()=>{
 assert.match(picker,/\.movetrack-people-options\{[^}]*grid-auto-rows:max-content;align-content:start;/);
 assert.match(picker,/\.movetrack-person-option\{[^}]*height:auto;min-height:108px;/);
 assert.match(picker,/\.movetrack-person-option\{[^}]*align-items:flex-start;/);
 assert.match(picker,/\.movetrack-person-option \.movetrack-person-details\{[^}]*overflow-wrap:anywhere;line-height:1\.45/);
 assert.match(picker,/gridAutoRows:"max-content",alignContent:"start"/);
 assert.match(picker,/@media\(max-width:700px\), \(max-width:900px\) and \(max-height:520px\)\{/);
 assert.match(picker,/\.movetrack-people-options\{flex:1;min-height:0;max-height:none;grid-auto-rows:max-content;align-content:start;overflow-y:auto;/);
 assert.doesNotMatch(picker,/\.movetrack-person-option\{[^}]*min-height:68px/);
});

test("people picker retains selection, filters, accessibility and separate mobile footer",()=>{
 for(const text of ['role="listbox"','role="option"','aria-selected={selected.has(p.id)}','aria-disabled={!p.active}','aria-label="Filter people by department"','aria-label="Filter people by city"','aria-label="Close people picker"','className="movetrack-people-footer"']){
  assert.ok(picker.includes(text),"Missing: "+text);
 }
 assert.match(picker,/grid-auto-rows:max-content/);
 assert.match(picker,/\.movetrack-people-footer\{padding-bottom:calc\(13px \+ env\(safe-area-inset-bottom\)\);\}/);
 for(const name of ["MeetingRegisterWorkspace","JraWorkspace","AssuranceFormsWorkspace"])
  assert.match(component(name),/OrganizationPeopleComboBox/);
});

test("mobile picker keeps filters and completion action readable in both themes",()=>{
 assert.match(picker,/<option value="">All depts<\/option>/);
 assert.match(picker,/value.length===1\?"1 person selected":value.length\+" people selected"/);
 assert.match(picker,/\.movetrack-person-option\{[^}]*border:1px solid #e2eaf5;[^}]*background:#f8fbff/);
 assert.match(picker,/\.movetrack-root\[data-theme="dark"\] \.movetrack-person-option \.movetrack-person-avatar\{background:#29486e;color:#b9ddff !important;\}/);
 assert.match(picker,/\.movetrack-root\[data-theme="dark"\] \.movetrack-person-option \.movetrack-person-check\{color:var\(--mt-success,#86efc0\) !important;\}/);
});
