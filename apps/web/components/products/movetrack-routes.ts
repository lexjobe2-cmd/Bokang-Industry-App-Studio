import type {MoveTrackView} from "./MoveTrackWorkspaceNav";

export type MoveTrackScreen=
 | {kind:"home"}
 | {kind:"company"}
 | {kind:"workflows"}
 | {kind:"search"}
 | {kind:"workspace";view:MoveTrackView};
export const allWorkspaceViews:readonly MoveTrackView[]=[
 "control","fleet","drivers","sites","assign","jobs","analytics","forms","meetings","paper","release","local-data","settings"
];
const viewSet=new Set<string>(allWorkspaceViews);
export function fromMoveTrackPath(pathname:string):MoveTrackScreen{
 const segments=pathname.replace(/\/+$/,"").split("/").filter(Boolean);
 if(segments.length===0 || (segments.length===1&&segments[0]==="home"))return {kind:"home"};
 if(segments.length===1&&segments[0]==="company")return {kind:"company"};
 if(segments.length===1&&segments[0]==="workflows")return {kind:"workflows"};
 if(segments.length===1&&segments[0]==="search")return {kind:"search"};
 if(segments.length===1&&segments[0]==="app")return {kind:"workspace",view:"control"};
 if(segments.length===2&&segments[0]==="app"&&viewSet.has(segments[1]!))return {kind:"workspace",view:segments[1] as MoveTrackView};
 return {kind:"home"};
}
export function moveTrackPath(screen:MoveTrackScreen):string{
 return screen.kind==="workspace"?"/app/"+screen.view:screen.kind==="home"?"/":"/"+screen.kind;
}
export function isMoveTrackSameScreen(a:MoveTrackScreen,b:MoveTrackScreen){
 return a.kind===b.kind&&(a.kind!=="workspace"||b.kind==="workspace"&&a.view===b.view);
}
