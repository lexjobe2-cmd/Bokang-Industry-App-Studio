"use client";

import {useEffect,useRef,useState} from "react";
import {
 Menu, X, Home, Search, ClipboardCheck, BarChart3, ScanLine,
 ChevronRight, Building2, Sun, Moon, ArrowUpRight, ShieldCheck
} from "lucide-react";
import {navigationGroups,type MoveTrackView} from "./MoveTrackWorkspaceNav";

export type PrimaryDestination="home"|"search"|"forms"|"analytics"|"menu";
export const MOBILE_DESTINATIONS:readonly PrimaryDestination[]=["home","search","forms","analytics","menu"];
const destinations=[
 {key:"home" as const,label:"Home",icon:Home},
 {key:"search" as const,label:"Search",icon:Search},
 {key:"forms" as const,label:"Forms",icon:ClipboardCheck},
 {key:"analytics" as const,label:"Insights",icon:BarChart3},
 {key:"menu" as const,label:"Menu",icon:Menu}
] as const;
const labelFor=(view:MoveTrackView)=>navigationGroups.flatMap(group=>group.items.map(item=>({view:item.view,label:item.label,description:item.description}))).find(x=>x.view===view)?.label??"Workspaces";

export function MoveTrackAppShellNav({
 activeView,atHome,onHome,onSearch,onNavigate,onCompany,onWorkflow,theme,onToggleTheme
}:{
 activeView:MoveTrackView;atHome:boolean;onHome:()=>void;onSearch:()=>void;
 onNavigate:(view:MoveTrackView)=>void;onCompany:()=>void;onWorkflow:()=>void;
 theme:"light"|"dark";onToggleTheme:()=>void
}){
 const [menuOpen,setMenuOpen]=useState(false);
 const closeRef=useRef<HTMLButtonElement>(null);
 const menuButton=useRef<HTMLButtonElement>(null);
 const current=atHome?"Home":labelFor(activeView);
 function close(){setMenuOpen(false);}
 function navigate(view:MoveTrackView){close();onNavigate(view);}
 function home(){close();onHome();}
 function openMenu(){setMenuOpen(true);}
 function press(destination:PrimaryDestination){
  if(destination==="menu"){menuOpen?close():openMenu();return;}
  if(destination==="home"){home();return;}
  if(destination==="search"){close();onSearch();return;}
  navigate(destination);
 }
 useEffect(()=>{
  if(!menuOpen)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  closeRef.current?.focus();
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==="Escape"){event.preventDefault();setMenuOpen(false);}
   if(event.key==="Tab"){
    const nodes=Array.from(document.querySelectorAll<HTMLElement>(".movetrack-nav-drawer button:not([disabled]),.movetrack-nav-drawer a[href]"));
    if(!nodes.length)return;
    const first=nodes[0]!,last=nodes[nodes.length-1]!;
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   }
  };
  document.addEventListener("keydown",onKey);
  return ()=>{document.body.style.overflow=previous;document.removeEventListener("keydown",onKey);menuButton.current?.focus();};
 },[menuOpen]);
 return <>
  <header className="movetrack-appbar" aria-label="MoveTrack application header">
   <div className="movetrack-appbar-content">
    <button ref={menuButton} type="button" className="movetrack-appbar-hamburger" aria-label="Open navigation menu" aria-expanded={menuOpen} aria-controls="movetrack-navigation-drawer" onClick={openMenu}><Menu size={23} strokeWidth={2.1}/><span className="movetrack-hamburger-label">Menu</span></button>
    <button className="movetrack-appbar-brand" type="button" onClick={home} aria-label="MoveTrack AI home">
     <span className="movetrack-brand-mark"><ShieldCheck size={20}/></span>
     <span className="movetrack-brand-name"><b>MoveTrack</b><small>AI / SHE & Fleet</small></span>
    </button>
    <span className="movetrack-appbar-divider" aria-hidden="true"/>
    <span className="movetrack-appbar-current">{current}</span>
    <span className="movetrack-appbar-spacer"/>
    <div className="movetrack-desktop-links" aria-label="Frequent destinations">
     <button type="button" onClick={home}>Home</button>
     <button type="button" onClick={()=>navigate("forms")}>Forms</button>
     <button type="button" onClick={()=>navigate("analytics")}>Insights</button>
    </div>
    <button type="button" className="movetrack-appbar-mode" onClick={onToggleTheme} aria-label={theme==="dark"?"Switch to light mode":"Switch to dark mode"}>{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}<span className="movetrack-hamburger-label">{theme==="dark"?"Light":"Dark"}</span></button>
   </div>
  </header>

  <nav className="movetrack-mobile-dock" aria-label="MoveTrack mobile primary navigation">
   {destinations.map(item=>{
    const active=item.key==="home"?atHome:item.key==="menu"?menuOpen:item.key==="search"?false:!atHome&&activeView===item.key;
    return <button type="button" key={item.key} className={active?"movetrack-dock-action is-active":"movetrack-dock-action"} aria-current={active&&item.key!=="menu"?"page":undefined} aria-expanded={item.key==="menu"?menuOpen:undefined} onClick={()=>press(item.key)}>
     <item.icon size={24} strokeWidth={active?2.6:1.95}/>
     <span>{item.label}</span>
    </button>;
   })}
  </nav>

  {menuOpen?<div className="movetrack-drawer-layer">
   <button type="button" className="movetrack-drawer-scrim" onClick={close} aria-label="Close navigation menu"/>
   <aside id="movetrack-navigation-drawer" className="movetrack-nav-drawer" role="dialog" aria-modal="true" aria-label="All MoveTrack workspaces">
    <div className="movetrack-drawer-head">
     <div><p className="movetrack-drawer-eyebrow">MOVETRACK AI</p><strong>Explore your workspace</strong><small>Fleet, workforce and SHE intelligence</small></div>
     <button ref={closeRef} type="button" onClick={close} aria-label="Close navigation menu" className="movetrack-drawer-close"><X size={23}/></button>
    </div>
    <div className="movetrack-drawer-scroll">
     <div className="movetrack-drawer-primary">
      <button type="button" onClick={home}><Home size={20}/> Home <ChevronRight size={16}/></button>
      <button type="button" onClick={()=>{close();onSearch();}}><Search size={20}/> Global search <ChevronRight size={16}/></button>
      <button type="button" onClick={()=>{close();onCompany();}}><Building2 size={20}/> Company onboarding <ChevronRight size={16}/></button>
      <button type="button" onClick={()=>{close();onWorkflow();}}><ScanLine size={20}/> Safety workflow library <ChevronRight size={16}/></button>
     </div>
     {navigationGroups.map(group=><section key={group.id} aria-label={group.label} className="movetrack-drawer-group">
      <h3>{group.label}</h3>
      <div className="movetrack-drawer-list">
       {group.items.map(item=><button type="button" key={item.view} aria-current={!atHome&&activeView===item.view?"page":undefined} onClick={()=>navigate(item.view)}>
        <span className="movetrack-drawer-icon"><item.icon size={19}/></span>
        <span className="movetrack-drawer-item-text"><strong>{item.label}</strong><small>{item.description}</small></span>
        <ChevronRight size={16} className="movetrack-chevron"/>
       </button>)}
      </div>
     </section>)}
     <a className="movetrack-drawer-driver" href="/driver/move-track?driver=DRV-001"><span>Open driver mobile workspace</span><ArrowUpRight size={16}/></a>
    </div>
    <div className="movetrack-drawer-footer">Local frontend demonstration · No sign-in required</div>
   </aside>
  </div>:null}
 </>;
}
