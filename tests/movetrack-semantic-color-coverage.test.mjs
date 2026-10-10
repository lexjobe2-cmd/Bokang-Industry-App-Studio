import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const files=[
 "MoveTrackShowcase","MoveTrackDemoLab","MoveTrackDriverApp","OrganizationOnboarding",
 "CompanyDirectoryImport","MoveTrackCompanySummary","MoveTrackLocalProfile",
 "AssuranceFormsWorkspace","CustomFormBuilder","JraWorkspace","MeetingRegisterWorkspace",
 "FleetReleaseWorkspace","PaperToDigitalWorkspace","DriverComplianceOverview",
 "DriverCompetencyPanel","WorkforceDirectoryWorkspace","UserParticipationAnalytics",
 "MoveTrackHelpCenter","MoveTrackGlobalSearch","GlobalWorkspaceSearch","LocalWorkspacePanel",
 "MoveTrackWorkspaceDirectory","MultiImageEvidence","OperationalGraphPanel","OperationalTextAssist",
 "OrganizationPeopleComboBox","SignatureApprovalTray","SignatureCapture",
 "VehicleDocuments","SmartFormInputs","RepeatableRowActions","DocumentDownloadActions"
];
const read=name=>readFileSync(new URL("../apps/web/components/products/"+name+".tsx",import.meta.url),"utf8");
const css=read("MoveTrackThemeStyles");
test("every operational workspace and shared utility has theme-aware color tokens",()=>{
 for(const name of files)assert.match(read(name),/var\(--mt-(?:ink|muted|link|danger|success|warning|surface|company-hero)/,name+" has no theme tokens");
 assert.match(css,/--mt-ink:#f0f6ff/);
 assert.match(css,/--mt-muted:#becee2/);
 assert.match(css,/--mt-surface:#162940/);
 assert.match(css,/--mt-surface-soft:#1d344f/);
 assert.match(css,/--mt-ink:#172b46/);
 assert.match(css,/--mt-surface:#fff/);
});
test("the explicitly failing screenshot elements have paired colors",()=>{
 const hero=read("OrganizationOnboarding");
 assert.match(hero,/background:"var\(--mt-company-hero-bg/);
 assert.match(hero,/color:"var\(--mt-company-hero-ink/);
 assert.match(hero,/var\(--mt-company-hero-muted/);
 assert.match(hero,/const button:React.CSSProperties=.*color:"var\(--mt-ink/);
 const fleet=read("MoveTrackShowcase");
 assert.match(fleet,/const panel:React.CSSProperties=.*color:"var\(--mt-ink/);
 assert.match(fleet,/const secondaryButton:React.CSSProperties=.*color:"var\(--mt-ink/);
 assert.match(fleet,/var\(--mt-ink,#101827\)/);
 const workflow=read("OperationalGraphPanel");
 assert.match(workflow,/const btn:React.CSSProperties=.*color:"var\(--mt-ink/);
 assert.match(workflow,/var\(--mt-link,#2563eb\)/);
});
test("status roles have legible paired light and dark text colors",()=>{
 for(const role of ["ink","muted","link","success","warning","danger"]){
  assert.ok(css.includes("--mt-"+role+":"),role+" must be defined");
  assert.match(css,new RegExp("--mt-"+role+":#[0-9a-f]{6}"));
 }
 assert.match(css,/--mt-success-bg:#173f35/);
 assert.match(css,/--mt-danger-bg:#40212d/);
 assert.match(css,/--mt-warning-bg:#413623/);
});
