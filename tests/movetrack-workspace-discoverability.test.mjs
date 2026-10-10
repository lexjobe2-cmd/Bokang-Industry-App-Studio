import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {allWorkspaceViews,fromMoveTrackPath,moveTrackPath} from "../apps/web/components/products/movetrack-routes.ts";
const open=(filename)=>readFileSync(new URL("../apps/web/components/products/"+filename,import.meta.url),"utf8");
const directory=open("MoveTrackWorkspaceDirectory.tsx");
const nav=open("MoveTrackWorkspaceNav.tsx");
const showcase=open("MoveTrackShowcase.tsx");
const main=open("MoveTrackDemoLab.tsx");
const header=open("MoveTrackAppShellNav.tsx");

test("all 16 production demo workspaces have valid direct URL destinations",()=>{
 assert.equal(allWorkspaceViews.length,16);
 assert.equal(new Set(allWorkspaceViews).size,allWorkspaceViews.length);
 for(const view of allWorkspaceViews){
  const url=moveTrackPath({kind:"workspace",view});
  assert.deepEqual(fromMoveTrackPath(url),{kind:"workspace",view});
 }
 assert.ok(allWorkspaceViews.includes("admin"));
 assert.ok(allWorkspaceViews.includes("workforce"));
 assert.ok(allWorkspaceViews.includes("paper"));
 assert.ok(allWorkspaceViews.includes("local-data"));
});

test("the Home and Admin landing pages expose the complete uncollapsed workspace directory",()=>{
 assert.match(main,/<MoveTrackWorkspaceDirectory onNavigate=\{goWorkspace\}/);
 assert.match(showcase,/<MoveTrackWorkspaceDirectory onNavigate=\{next=>/);
 assert.match(directory,/navigationGroups\.map\(group=>/);
 assert.match(directory,/group\.items\.map\(item=>/);
 assert.match(directory,/Every built-in workspace is listed/);
 assert.doesNotMatch(directory,/<details\b|display:"none"|\.slice\(/);
 assert.match(directory,/Open Admin/);
 assert.match(directory,/Global search/);
 assert.match(directory,/21 connected safety workflows/);
});

test("mobile workspace selector has every group and is not limited to the current category",()=>{
 assert.match(nav,/All workspaces<select aria-label="Switch to any MoveTrack workspace"/);
 assert.match(nav,/navigationGroups\.map\(section=><optgroup/);
 assert.match(nav,/section\.items\.map\(item=><option/);
 assert.match(nav,/value=\{view\}/);
 assert.match(nav,/onChange=\{e=>onChange\(e\.target\.value as MoveTrackView\)\}/);
 assert.match(header,/MOBILE_DESTINATIONS:readonly PrimaryDestination\[\]=\["home","fleet","forms","analytics","profile","admin"\]/);
 assert.match(header,/Admin · company and asset setup/);
});

test("Admin retains its managers when selecting another admin area and offers clear read-only-to-admin routes",()=>{
 assert.match(showcase,/contentView=adminMode\?adminArea:view/);
 assert.match(showcase,/onChange=\{setView\}/);
 assert.match(showcase,/adminMode&&adminArea!=="overview"&&adminArea!=="company"\?adminArea:view/);
 assert.match(showcase,/function openAdminArea\(next:MoveTrackView\|"company"\)/);
 assert.match(showcase,/onClick=\{\(\)=>openAdminArea\("fleet"\)\}/);
 assert.match(showcase,/onClick=\{\(\)=>openAdminArea\("drivers"\)\}/);
 assert.match(showcase,/onClick=\{\(\)=>openAdminArea\("assign"\)\}/);
 assert.match(showcase,/setAdminArea\("overview"\)/);
 assert.match(main,/Open Admin test workspace/);
});
