import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=name=>readFileSync(new URL("../apps/web/components/products/"+name+".tsx",import.meta.url),"utf8");
const org=read("OrganizationOnboarding"),staff=read("CompanyDirectoryImport"),theme=read("MoveTrackThemeStyles");
function luminance(color){
 const p=color.slice(1).match(/.{2}/g).map(n=>parseInt(n,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
 return .2126*p[0]+.7152*p[1]+.0722*p[2];
}
function contrast(a,b){
 const x=luminance(a),y=luminance(b);
 return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
test("company hero defines complete foreground/background pairs for light and dark modes",()=>{
 assert.match(theme,/--mt-company-hero-bg:linear-gradient\(110deg,#ffffff,#eaf2ff\)/);
 assert.match(theme,/--mt-company-hero-bg:linear-gradient\(110deg,#172e4b,#1a3a63\)/);
 assert.match(theme,/--mt-company-hero-ink:#f5f9ff/);
 assert.match(theme,/--mt-company-hero-muted:#c5d7ed/);
 assert.match(org,/data-testid="company-setup-hero"/);
 assert.match(org,/background:"var\(--mt-company-hero-bg/);
 assert.match(org,/color:"var\(--mt-company-hero-ink/);
 assert.match(org,/var\(--mt-company-hero-muted/);
 for(const [foreground,background] of [
   ["#172b46","#ffffff"],["#516078","#eaf2ff"],
   ["#f5f9ff","#172e4b"],["#f5f9ff","#1a3a63"],
   ["#c5d7ed","#172e4b"],["#c5d7ed","#1a3a63"]]){
  assert.ok(contrast(foreground,background)>=4.5,foreground+" on "+background+" fails at "+contrast(foreground,background).toFixed(2));
 }
});
test("company management buttons, labels and inputs always use paired surfaces and text",()=>{
 assert.match(org,/const button:React.CSSProperties=.*background:"var\(--mt-surface/);
 assert.match(org,/const button:React.CSSProperties=.*color:"var\(--mt-ink/);
 assert.match(org,/const card:React.CSSProperties=.*color:"var\(--mt-ink/);
 assert.match(org,/const label:React.CSSProperties=.*color:"var\(--mt-ink/);
 assert.match(org,/const input:React.CSSProperties=.*background:"var\(--mt-surface-soft/);
 assert.match(org,/const input:React.CSSProperties=.*color:"var\(--mt-ink/);
 assert.match(org,/background:step===i\?"#2152b3":"var\(--mt-surface-soft/);
 assert.match(org,/color:step===i\?"#fff":"var\(--mt-ink/);
});
test("company and workforce onboarding buttons still perform real, reachable actions",()=>{
 for(const phrase of [
  'onClick={resetDraft}','onClick={()=>editCompany(currentOrg)}',
  'onClick={next}','onClick={save}','setOpen(true)',
  'onClick={downloadTemplate}','onClick={()=>setOpen(v=>!v)}',
  'onClick={save}'])assert.ok((org+"\n"+staff).includes(phrase),phrase);
 assert.match(org,/New\? Start 4-step onboarding/);
 assert.match(org,/Add company/);
 assert.match(org,/Edit active/);
 assert.match(staff,/Import staff directory/);
 assert.match(staff,/Confirm import of/);
});
test("staff directory maintains contrast on surface, button and CSV review panel",()=>{
 assert.match(staff,/background:"var\(--mt-surface,#fff\)"/);
 assert.match(staff,/color:"var\(--mt-ink,#172b46\)"/);
 assert.match(staff,/const btn:React.CSSProperties=.*color:"var\(--mt-ink/);
 assert.match(staff,/background:"var\(--mt-surface-soft,#f0f6ff\)"/);
});
test("light/dark transitions cover text, backgrounds and borders, including reduced motion",()=>{
 assert.match(theme,/transition-property:background-color,color,border-color/);
 assert.match(theme,/transition-duration:180ms/);
 assert.match(theme,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(theme,/transition-duration:0ms/);
});
