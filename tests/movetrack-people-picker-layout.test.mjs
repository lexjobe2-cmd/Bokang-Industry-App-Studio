import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const picker=readFileSync(new URL("../apps/web/components/products/OrganizationPeopleComboBox.tsx",import.meta.url),"utf8");
const component=(name)=>readFileSync(new URL("../apps/web/components/products/"+name+".tsx",import.meta.url),"utf8");

test("mobile employee rows grow to content height instead of overlapping neighbouring people",()=>{
 assert.match(picker,/\\.movetrack-people-options\\{[^}]*grid-auto-rows:max-content;align-content:start;/);
 assert.match(picker,/\\.movetrack-person-option\\{[^}]*height:auto;min-height:108px;/);
 assert.match(picker,/\\.movetrack-person-option\\{[^}]*align-items:flex-start;/);
 assert.match(picker,/\\.movetrack-person-option \\.movetrack-person-details\\{[^}]*overflow-wrap:anywhere;line-height:1\\.45/);
 assert.match(picker,/gridAutoRows:"max-content",alignContent:"start"/);
 assert.match(picker,/@media\\(max-width:700px\\)\\{/);
 assert.match(picker,/\\.movetrack-people-options\\{flex:1;min-height:0;max-height:none;grid-auto-rows:max-content;align-content:start;overflow-y:auto;/);
 assert.doesNotMatch(picker,/\\.movetrack-person-option\\{[^}]*min-height:68px/);
});

test("people picker retains selection, filters, accessibility and separate mobile footer",()=>{
 for(const text of ['role="listbox"','role="option"','aria-selected={selected.has(p.id)}','aria-disabled={!p.active}','aria-label="Filter people by department"','aria-label="Filter people by city"','aria-label="Close people picker"','className="movetrack-people-footer"']){
  assert.ok(picker.includes(text),"Missing: "+text);
 }
 assert.match(picker,/grid-auto-rows:max-content/);
 assert.match(picker,/\\.movetrack-people-footer\\{padding-bottom:calc\\(13px \\+ env\\(safe-area-inset-bottom\\)\\);\\}/);
 for(const name of ["MeetingRegisterWorkspace","JraWorkspace","AssuranceFormsWorkspace"])
  assert.match(component(name),/OrganizationPeopleComboBox/);
});
