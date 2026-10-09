import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fromMoveTrackPath,moveTrackPath} from "../apps/web/components/products/movetrack-routes.ts";

const theme=readFileSync(new URL("../apps/web/components/products/MoveTrackThemeStyles.tsx",import.meta.url),"utf8");
const navigation=readFileSync(new URL("../apps/web/components/products/MoveTrackAppShellNav.tsx",import.meta.url),"utf8");
const main=readFileSync(new URL("../apps/web/components/products/MoveTrackDemoLab.tsx",import.meta.url),"utf8");
const showcase=readFileSync(new URL("../apps/web/components/products/MoveTrackShowcase.tsx",import.meta.url),"utf8");
const workflow=readFileSync(new URL("../apps/web/components/products/OperationalGraphPanel.tsx",import.meta.url),"utf8");
const routes=readFileSync(new URL("../apps/web/components/products/useMoveTrackScreen.ts",import.meta.url),"utf8");
const driverUi=readFileSync(new URL("../apps/web/components/products/MoveTrackDriverApp.tsx",import.meta.url),"utf8");

function relativeLuminance(color){
 const colors=color.match(/#[0-9a-fA-F]{6}/)?.[0]?.slice(1).match(/.{2}/g);
 assert.ok(colors,"Expected 6-digit hex: "+color);
 const components=colors.map(c=>parseInt(c,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
 return .2126*components[0]+.7152*components[1]+.0722*components[2];
}
function ratio(a,b){const x=relativeLuminance(a),y=relativeLuminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}

test("light and dark text tokens meet ordinary 4.5:1 contrast against card surfaces",()=>{
 const cases=[
  ["#172b46","#ffffff"],["#516078","#ffffff"],["#174fa8","#ffffff"],
  ["#f0f6ff","#162940"],["#becee2","#162940"],["#a9d2ff","#162940"],
  ["#ffabb5","#162940"],["#fbd58b","#162940"],["#86efc0","#162940"]
 ];
 for(const [foreground,background] of cases)assert.ok(ratio(foreground,background)>=4.5,foreground+" on "+background+" has ratio "+ratio(foreground,background).toFixed(2));
 assert.match(theme,/--mt-ink:#f0f6ff/);
 assert.match(theme,/--mt-surface:#162940/);
});

test("dark style covers the screenshot's navy chip text, subdued labels and pale card surfaces",()=>{
 assert.match(theme,/color: rgb\(25, 55, 86\)/);
 assert.match(theme,/color: rgb\(81, 98, 123\)/);
 assert.match(theme,/color: rgb\(100, 116, 139\)/);
 assert.match(theme,/background: rgb\(255, 255, 255\)/);
 assert.match(theme,/--mt-danger:#ffabb5/);
 assert.match(theme,/--mt-success:#86efc0/);
 assert.match(theme,/--mt-warning:#fbd58b/);
 assert.doesNotMatch(theme,/html\[data-theme="dark"\] body/);
});

test("connected workflows and secondary checklist buttons use shared contrast tokens",()=>{
 assert.match(workflow,/const btn:React\.CSSProperties=.*color:"var\(--mt-ink/);
 assert.match(workflow,/var\(--mt-link,#2563eb\)/);
 assert.match(workflow,/Connected workflows/);
 assert.match(workflow,/Open checklist/);
 assert.match(workflow,/Less/);
});

test("Admin is in the mobile dock and home hero, and the destination navigates to the real workspace",()=>{
 assert.match(navigation,/MOBILE_DESTINATIONS:readonly PrimaryDestination\[\]=\["home","fleet","forms","analytics","profile","admin"\]/);
 assert.match(navigation,/key:"admin" as const,label:"Admin"/);
 assert.match(navigation,/Open Admin test workspace/);
 assert.match(navigation,/navigate\("admin"\)/);
 assert.match(main,/Open Admin test workspace/);
 assert.match(main,/goWorkspace\("admin"\)/);
 assert.match(showcase,/view==="admin"/);
 assert.match(showcase,/aria-label="Admin workspace"/);
 assert.match(showcase,/Vehicle onboarding & asset media/);
 assert.match(showcase,/contentView=adminMode\?adminArea:view/);
});
test("the independent Admin route is deep-linkable in Pages and standalone app flows",()=>{
 assert.equal(moveTrackPath({kind:"workspace",view:"admin"}),"/app/admin");
 assert.deepEqual(fromMoveTrackPath("/app/admin"),{kind:"workspace",view:"admin"});
 assert.match(routes,/window\.location\.hash\.slice\(1\)/);
 assert.match(routes,/window\.history\.pushState/);
});

test("driver app follows the same local theme and offers a mobile light/dark toggle",()=>{
 assert.match(driverUi,/className="movetrack-root movetrack-driver-theme"/);
 assert.match(driverUi,/data-theme=\{theme\}/);
 assert.match(driverUi,/MOVETRACK_THEME_KEY/);
 assert.match(driverUi,/Switch driver app to light mode/);
 assert.match(driverUi,/Switch driver app to dark mode/);
 assert.match(theme,/movetrack-driver-theme\[data-theme="dark"\] nav\[aria-label="Driver mobile primary navigation"\]/);
});
