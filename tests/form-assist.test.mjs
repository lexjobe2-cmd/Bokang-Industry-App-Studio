import test from "node:test";
import assert from "node:assert/strict";
import {fieldQuickChoices,personRegisterRow,reusableCrewAnswers,hazardSuggestions,controlSuggestions,taskQuickChoices} from "../packages/domain-data/src/form-assist.ts";
import {starterAssuranceTemplates} from "../packages/domain-data/src/assurance-forms.ts";
test("quick choices support common narrative fields without filling safety checks",()=>{
 assert.ok(fieldQuickChoices("Weather and shift conditions","text").length>0);
 assert.ok(fieldQuickChoices("Additional observations","multiline").length>0);
 assert.equal(fieldQuickChoices("Brake service condition","pass_fail_na").length,0);
 assert.equal(fieldQuickChoices("Reviewer signature","signature").length,0);
 assert.equal(fieldQuickChoices("Residual risk","risk").length,0);
 assert.ok(taskQuickChoices.length>=4);
});
test("directory can populate attendance names, employee number and roles, but never sign or verify",()=>{
 const fields=[
  {id:"full-name",label:"Full name",type:"text"},
  {id:"employee",label:"Employee number",type:"text"},
  {id:"role",label:"Job title / role",type:"text"},
  {id:"department",label:"Department",type:"text"},
  {id:"signed",label:"Signature",type:"text"},
  {id:"verified",label:"Verification",type:"text"}
 ];
 const person={id:"worker-1",orgId:"company-1",displayName:"Kagiso Dube",employeeNumber:"53721",jobTitle:"Supervisor",department:"Operations",active:true,source:"MANUAL"};
 const result=personRegisterRow(fields,person);
 assert.equal(result["full-name"],"Kagiso Dube");
 assert.equal(result.employee,"53721");
 assert.equal(result.role,"Supervisor");
 assert.equal(result.department,"Operations");
 assert.equal(result.signed,undefined);
 assert.equal(result.verified,undefined);
});
test("previous crew reuse preserves valid IDs and cannot copy PASS/NO-GO or sign-offs",()=>{
 const template={
 id:"safe-crew",version:1,title:"Working at heights",category:"Safety",status:"PUBLISHED",
 siteIds:[],assetClasses:[],effectiveDate:"2026-10-08",sections:[{id:"section",title:"Context",fields:[
  {id:"lead",label:"Job leader",type:"person"},
  {id:"crew",label:"Crew",type:"people"},
  {id:"reviewer",label:"Approval reviewer",type:"person"},
  {id:"guardrails",label:"Guardrails checked",type:"pass_fail_na",critical:true},
  {id:"residual",label:"Residual risk",type:"risk"},
  {id:"signature",label:"Review signature",type:"signature"},
  {id:"environment",label:"Weather and conditions",type:"text"}
 ]}]
 };
 const answers={lead:"p1",crew:["p1","p2","inactive","outsider"],reviewer:"p2",guardrails:"PASS",residual:{likelihood:1,consequence:1,matrixId:"standard-5x5",matrixVersion:1},signature:"suspicious",environment:"Fine"};
 const reused=reusableCrewAnswers(template,answers,new Set(["p1","p2"]));
 assert.deepEqual(reused,{lead:"p1",crew:["p1","p2"]});
 assert.equal(reused.guardrails,undefined);
 assert.equal(reused.reviewer,undefined);
 assert.equal(reused.signature,undefined);
 assert.equal(reused.residual,undefined);
});
test("hazard and proposed controls are suggestions, not verified claims",()=>{
 assert.ok(hazardSuggestions("Fall from height").some(x=>/fall|edge/i.test(x)));
 assert.ok(controlSuggestions("Fall from height").some(x=>/guardrail|rescue/i.test(x)));
 assert.ok(controlSuggestions("Unknown").length>0);
});
