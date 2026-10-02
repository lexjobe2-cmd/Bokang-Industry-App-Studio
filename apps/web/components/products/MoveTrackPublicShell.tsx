"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { moveTrackClientQuery } from "../../lib/movetrack-site";

export function MoveTrackPublicShell({
  clientName,
  children,
  current,
}:{
  clientName:string;
  children:ReactNode;
  current:"home"|"services"|"fleet"|"about"|"track"|"quote";
}){
  const q=moveTrackClientQuery(clientName);
  const nav=[
    ["services","Services","/demo/move-track/services"+q],
    ["fleet","Fleet","/demo/move-track/fleet"+q],
    ["about","About","/demo/move-track/about"+q],
    ["track","Track","/demo/move-track/track"+q],
  ] as const;

  return <main style={{minHeight:"100vh",background:"#f3f5f7",color:"#101827"}}>
    <header style={{position:"sticky",top:0,zIndex:30,background:"rgba(243,245,247,.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid #d7dce1"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"14px 22px",display:"flex",justifyContent:"space-between",gap:18,alignItems:"center",flexWrap:"wrap"}}>
        <Link href={"/demo/move-track"+q} style={{textDecoration:"none",color:"#101827"}}>
          <strong style={{fontSize:21,letterSpacing:"-.03em"}}>{clientName}</strong>
          <div style={{fontSize:10,color:"#667085",textTransform:"uppercase",letterSpacing:1.45}}>Transport · logistics · Botswana</div>
        </Link>
        <nav style={{display:"flex",gap:16,alignItems:"center",fontSize:12,fontWeight:850,flexWrap:"wrap"}}>
          {nav.map(([key,label,href])=><Link key={key} href={href} style={{color:current===key?"#1d4ed8":"#101827"}}>{label}</Link>)}
          <Link href={"/demo/move-track/quote"+q} style={{background:"#101827",color:"#fff",padding:"10px 13px",borderRadius:4}}>Request a quote</Link>
        </nav>
      </div>
    </header>
    {children}
    <footer style={{background:"#101827",color:"#fff",padding:"40px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:24,fontSize:11,color:"#98a2b3"}}>
        <div><strong style={{fontSize:17,color:"#fff"}}>{clientName}</strong><p style={{lineHeight:1.6}}>Botswana logistics website concept focused on capacity, reliability and direct commercial enquiry.</p></div>
        <div><strong style={{color:"#fff"}}>Navigate</strong><div style={{display:"grid",gap:7,marginTop:9}}><Link href={"/demo/move-track/services"+q}>Services</Link><Link href={"/demo/move-track/fleet"+q}>Fleet</Link><Link href={"/demo/move-track/track"+q}>Track shipment</Link></div></div>
        <div><strong style={{color:"#fff"}}>Policies</strong><div style={{display:"grid",gap:7,marginTop:9}}><Link href={"/demo/move-track/legal/privacy"+q}>Privacy</Link><Link href={"/demo/move-track/legal/terms"+q}>Terms</Link><Link href={"/demo/move-track/legal/data-notice"+q}>Demo data notice</Link></div></div>
        <div><strong style={{color:"#fff"}}>Studio</strong><p style={{lineHeight:1.6}}>Designed &amp; developed by Bokang Jobe</p></div>
      </div>
    </footer>
  </main>;
}

export const logisticsEyebrow:React.CSSProperties={fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.55,color:"#1d4ed8",margin:0};
export const logisticsTitle:React.CSSProperties={fontSize:"clamp(38px,6vw,70px)",lineHeight:.98,letterSpacing:"-.045em",margin:"10px 0 0"};
export const logisticsLead:React.CSSProperties={fontSize:19,lineHeight:1.65,color:"#475467"};
export const logisticsBody:React.CSSProperties={fontSize:14,lineHeight:1.75,color:"#667085"};
