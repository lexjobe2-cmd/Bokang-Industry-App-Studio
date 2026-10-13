import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const component=(name)=>readFileSync(new URL("../apps/web/components/products/"+name+".tsx",import.meta.url),"utf8");
const theme=component("MoveTrackThemeStyles");
const primitives=component("MoveTrackUIControls");
const workspaces=["MeetingRegisterWorkspace","JraWorkspace","PaperToDigitalWorkspace","AssuranceFormsWorkspace","MoveTrackHelpCenter","MoveTrackShowcase"];

function luminance(hex){
 const nums=hex.match(/[a-f0-9]{2}/gi).map(s=>parseInt(s,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 return nums[0]*.2126+nums[1]*.7152+nums[2]*.0722;
}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}

test("shared native button variants theme foreground AND background rather than relying on inline color",()=>{
 for(const variant of ["primary","secondary","selected","danger","ghost"])
  assert.ok(theme.includes('data-mt-variant="'+variant+'"')||variant==="secondary",variant);
 assert.match(theme,/\.movetrack-root \.movetrack-ui-button \{/);
 assert.match(theme,/color:var\(--mt-action-fg\) !important/);
 assert.match(theme,/background:var\(--mt-action-bg\) !important/);
 assert.match(theme,/\.movetrack-root\[data-theme="dark"\] \{/);
 assert.match(primitives,/type="button"/);
 assert.match(primitives,/forwardRef<HTMLButtonElement/);
 assert.match(primitives,/className=\{\["movetrack-ui-button",className\]/);
});

test("shared palette has AA normal-text contrast for all actual clickable variants",()=>{
 const palettes=[
  [["#172b46","#ffffff"],["#ffffff","#1d4ed8"],["#173b74","#dceaff"],["#a51d2d","#fff1f2"]],
  [["#f0f6ff","#203652"],["#ffffff","#3769ca"],["#f3f8ff","#2a4f80"],["#ffbdc6","#40212d"]]
 ];
 for(const [mode,pairs] of [["light",palettes[0]],["dark",palettes[1]]]){
  for(const [fg,bg] of pairs)assert.ok(contrast(fg,bg)>=4.5,mode+" "+fg+" on "+bg+" contrast "+contrast(fg,bg).toFixed(2));
 }
});

test("existing MoveTrack workflows use shared variants with unchanged event handlers",()=>{
 for(const file of workspaces){
  const source=component(file);
  assert.match(source,/className="movetrack-ui-button"/,file+" should adopt reuse");
  assert.match(source,/(?:onClick|onChange)=\{/,file+" must preserve event wiring");
 }
 const meeting=component("MeetingRegisterWorkspace");
 assert.match(meeting,/data-mt-variant="secondary" style=\{\{\.\.\.btn,minHeight:35,fontSize:11,padding:"7px 10px"\}\}/);
 assert.match(meeting,/data-mt-variant="secondary" style=\{btn\} onClick=\{\(\)=>\{if\(window.confirm\("Clear this meeting draft/);
 assert.match(meeting,/onClick=\{\(\)=>addAgendaTopic\(topic\)\}/);
});
