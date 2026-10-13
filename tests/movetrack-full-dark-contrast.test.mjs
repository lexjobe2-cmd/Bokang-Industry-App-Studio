import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const component=(name)=>readFileSync(new URL("../apps/web/components/products/"+name+".tsx",import.meta.url),"utf8");
const theme=component("MoveTrackThemeStyles");
const fleet=component("MoveTrackShowcase");
const driver=component("MoveTrackDriverApp");
const workflow=component("OperationalGraphPanel");
const app=component("MoveTrackDemoLab");
const nav=component("MoveTrackAppShellNav");

function luminance(hex){
 const channels=hex.slice(1).match(/.{2}/g).map(v=>parseInt(v,16)/255);
 const [r,g,b]=channels.map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
 return .2126*r+.7152*g+.0722*b;
}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}

test("primary, muted, link and caution text retain at least 4.5:1 contrast on light and dark cards",()=>{
 const pairs=[
  ["#172b46","#ffffff"],["#516078","#ffffff"],["#174fa8","#ffffff"],
  ["#f0f6ff","#162940"],["#becee2","#162940"],["#a9d2ff","#162940"],
  ["#ffabb5","#162940"],["#fbd58b","#162940"],["#86efc0","#162940"],
  ["#f0f6ff","#1d344f"],["#becee2","#1d344f"]
 ];
 for(const [a,b] of pairs)assert.ok(contrast(a,b)>=4.5,a+" on "+b+" = "+contrast(a,b).toFixed(2));
});

test("dark fallbacks target the text color CSS property, not background-color by accident",()=>{
 assert.ok(!theme.includes('[style*="color: #101827"]'));
 assert.ok(!theme.includes('[style*="color: rgb(25, 55, 86)"]'));
 assert.ok(theme.includes('[style^="color: #101827"]'));
 assert.ok(theme.includes('[style*="; color: #101827"]'));
 assert.ok(theme.includes('[style*=";color: #101827"]'));
 assert.ok(theme.includes('[style^="color: rgb(25, 55, 86)"]'));
 assert.match(theme,/--mt-ink:#f0f6ff/);
 assert.match(theme,/--mt-muted:#becee2/);
});

test("dark text palette includes previously missed form, signature, personnel and analytics labels",()=>{
 for(const color of ["#101d33","#163866","#0c1d32","#14305b","#122742","#334155","#153553","#173d68","#245387",
  "#24415e","#16355a","#153a62","#162b45","#16385f","#183153","#123257","#153452"]){
  assert.ok(theme.includes('[style^="color: '+color+'"]'),"Missing theme override for "+color);
 }
 for(const color of ["#9a3412","#8a5210","#99671b","#7a4c24"]){
  assert.ok(theme.includes('[style^="color: '+color+'"]'),"Missing accessible warning override for "+color);
 }
 for(const pale of ["#ecfdf3","#fef3f2","#f2f4f7","#fff7ed","#e8f1ff"]){
  assert.ok(theme.includes('[style*="background: '+pale+'"]'),"Pale form status should become dark surface: "+pale);
 }
});

test("fleet KPI numbers and checklist action buttons use theme tokens, not black-on-navy styling",()=>{
 assert.match(fleet,/var\(--mt-ink,#101827\)/);
 assert.match(fleet,/var\(--mt-danger,#b42318\)/);
 assert.match(workflow,/const btn:React.CSSProperties=.*color:"var\(--mt-ink/);
 assert.match(workflow,/var\(--mt-link,#2563eb\)/);
 assert.match(workflow,/Open checklist/);
 assert.match(workflow,/Connected workflows/);
});

test("driver cards, mandatory pass-fail choices and incident prompts remain readable in dark mode",()=>{
 assert.match(driver,/const card:React.CSSProperties=\{background:"var\(--mt-surface/);
 assert.match(driver,/const input:React.CSSProperties=\{border:"1px solid var\(--mt-border/);
 assert.match(driver,/var\(--mt-success-bg,#ecfdf3\)/);
 assert.match(driver,/var\(--mt-danger-bg,#fef3f2\)/);
 assert.match(driver,/var\(--mt-warning-bg,#fff7ed\)/);
 assert.match(theme,/--mt-success-bg:#173f35/);
 assert.match(theme,/--mt-danger-bg:#40212d/);
 assert.match(theme,/--mt-warning-bg:#413623/);
 assert.match(theme,/--mt-success:#86efc0/);
});

test("both desktop and mobile retain dark mode toggle and independent Admin shortcut",()=>{
 assert.match(app,/onToggleTheme=\{\(\)=>setTheme\(theme==="dark"\?"light":"dark"\)\}/);
 assert.match(nav,/label:"Admin",icon:ShieldCheck/);
 assert.match(driver,/Switch driver app to light mode/);
 assert.match(theme,/data-theme="light"/);
 assert.match(theme,/data-theme="dark"/);
 assert.match(theme,/Electronic signature capture/);
});

test("Admin Fleet and driver compliance use paired semantic colors in both themes",()=>{
 const compliance=component("DriverComplianceOverview");
 const competency=component("DriverCompetencyPanel");
 const fleet=component("MoveTrackShowcase");
 const expectedBadges=[
  'text:"var(--mt-danger,#a51d2d)",background:"var(--mt-danger-bg,#fef3f2)"',
  'text:"var(--mt-muted,#516078)",background:"var(--mt-surface-soft,#f1f5f9)"',
  'text:"var(--mt-success,#087454)",background:"var(--mt-success-bg,#ecfdf3)"'
 ];
 for(const badge of expectedBadges)assert.ok(compliance.includes(badge),"Theme-aware compliance badge missing: "+badge);
 assert.ok(competency.includes('missing:"var(--mt-danger,#a51d2d)"'));
 assert.ok(competency.includes('due:"var(--mt-warning,#905a09)"'));
 assert.ok(competency.includes('current:"var(--mt-success,#087454)"'));
 assert.ok(compliance.includes('const border="var(--mt-border,#dbe5ef)"'));
 assert.ok(fleet.includes('borderColor:"var(--mt-border,#c6d9f3)"'));
 assert.ok(fleet.includes('borderColor:"var(--mt-warning,#fde68a)"'));
 assert.ok(fleet.includes('vehicle.status==="No-go"?"1px solid var(--mt-danger,#fecaca)"'));
 // Actual dark surfaces used by the matching CSS tokens; no white-on-white or navy-on-navy.
 const pairs=[
  ["#ffabb5","#40212d"],["#becee2","#1d344f"],["#86efc0","#173f35"],
  ["#a51d2d","#fef3f2"],["#516078","#f1f5f9"],["#087454","#ecfdf3"]
 ];
 for(const [fg,bg] of pairs)assert.ok(contrast(fg,bg)>=4.5,fg+" on "+bg+" = "+contrast(fg,bg).toFixed(2));
});
