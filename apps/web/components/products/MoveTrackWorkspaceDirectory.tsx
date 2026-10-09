"use client";
import {Search,Network,ArrowRight,ShieldCheck} from "lucide-react";
import {navigationGroups,type MoveTrackView} from "./MoveTrackWorkspaceNav";

type Props={
 onNavigate:(view:MoveTrackView)=>void;
 onSearch?:()=>void;
 onWorkflows?:()=>void;
};
const card:React.CSSProperties={
 display:"flex",alignItems:"flex-start",gap:10,textAlign:"left",
 minHeight:85,width:"100%",padding:13,cursor:"pointer",
 background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#172b46)",
 border:"1px solid var(--mt-border,#d8e3f0)",borderRadius:12,
 font:"inherit"
};

/** Every built-in workspace is listed. Views are navigated to, not removed from the demo. */
export function MoveTrackWorkspaceDirectory({onNavigate,onSearch,onWorkflows}:Props){
 return <section aria-label="All MoveTrack workspaces" style={{display:"grid",gap:15,minWidth:0}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}>
   <div>
    <h2 style={{margin:"0 0 5px",fontSize:19}}>Explore every workspace</h2>
    <p style={{margin:0,fontSize:12,color:"var(--mt-muted,#516078)",lineHeight:1.5}}>
     All {navigationGroups.reduce((count,group)=>count+group.items.length,0)} workspace destinations are available in this demo.
     Management and approval tools live inside Admin.
    </p>
   </div>
   <button type="button" onClick={()=>onNavigate("admin")} style={{...card,width:"auto",minHeight:48,alignItems:"center",background:"#174fa8",color:"#fff",borderColor:"#174fa8",fontWeight:850}}>
    <ShieldCheck size={18}/> Open Admin <ArrowRight size={17}/>
   </button>
  </div>
  {navigationGroups.map(group=><section key={group.id} aria-label={group.label+" workspaces"} style={{display:"grid",gap:8}}>
   <h3 style={{fontSize:11,letterSpacing:1.1,textTransform:"uppercase",color:"var(--mt-muted,#516078)",margin:0}}>{group.label}</h3>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,220px),1fr))",gap:9}}>
    {group.items.map(item=><button type="button" key={item.view} onClick={()=>onNavigate(item.view)} style={card}>
     <span style={{display:"grid",placeItems:"center",background:"var(--mt-surface-soft,#f3f7fc)",color:"var(--mt-link,#174fa8)",borderRadius:10,width:38,height:38,flex:"none"}}><item.icon size={19}/></span>
     <span style={{display:"grid",gap:4,minWidth:0}}><strong style={{fontSize:13}}>{item.label}</strong>
      <small style={{fontSize:11,color:"var(--mt-muted,#516078)",lineHeight:1.5}}>{item.description}</small></span>
    </button>)}
   </div>
  </section>)}
  {onSearch||onWorkflows?<section aria-label="More app features" style={{display:"grid",gap:8}}>
   <h3 style={{fontSize:11,letterSpacing:1.1,textTransform:"uppercase",color:"var(--mt-muted,#516078)",margin:0}}>More app features</h3>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,220px),1fr))",gap:9}}>
    {onSearch?<button type="button" style={card} onClick={onSearch}><Search size={21} color="var(--mt-link,#174fa8)"/><span style={{display:"grid",gap:4}}><strong style={{fontSize:13}}>Global search</strong><small style={{fontSize:11,color:"var(--mt-muted,#516078)"}}>Find fleet, people, jobs and forms</small></span></button>:null}
    {onWorkflows?<button type="button" style={card} onClick={onWorkflows}><Network size={21} color="var(--mt-link,#174fa8)"/><span style={{display:"grid",gap:4}}><strong style={{fontSize:13}}>21 connected safety workflows</strong><small style={{fontSize:11,color:"var(--mt-muted,#516078)"}}>Open the working-at-height and operational checklist library</small></span></button>:null}
   </div>
  </section>:null}
 </section>;
}
