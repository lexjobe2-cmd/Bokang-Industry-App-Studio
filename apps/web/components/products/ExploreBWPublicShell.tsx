"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { exploreClientQuery } from "../../lib/explorebw-site";

export function ExploreBWPublicShell({
  clientName,
  children,
  current,
}:{
  clientName:string;
  children:ReactNode;
  current:"home"|"safaris"|"about"|"plan";
}){
  const q=exploreClientQuery(clientName);
  const nav=[
    ["safaris","Safaris","/demo/explore-bw/safaris"+q],
    ["about","About us","/demo/explore-bw/about"+q],
    ["plan","Plan your trip","/demo/explore-bw/plan"+q],
  ] as const;

  return <main style={{minHeight:"100vh",background:"#f5f1e8",color:"#183126"}}>
    <header style={{position:"sticky",top:0,zIndex:30,background:"rgba(245,241,232,.94)",backdropFilter:"blur(12px)",borderBottom:"1px solid #d9d1c1"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"14px 22px",display:"flex",justifyContent:"space-between",gap:18,alignItems:"center",flexWrap:"wrap"}}>
        <Link href={"/demo/explore-bw"+q} style={{textDecoration:"none",color:"#183126"}}>
          <strong style={{fontSize:21,letterSpacing:"-.03em"}}>{clientName}</strong>
          <div style={{fontSize:10,color:"#65766d",textTransform:"uppercase",letterSpacing:1.5}}>Botswana journeys · locally inspired</div>
        </Link>
        <nav style={{display:"flex",gap:16,alignItems:"center",fontSize:12,fontWeight:850,flexWrap:"wrap"}}>
          {nav.map(([key,label,href])=><Link key={key} href={href} style={{color:current===key?"#a45f2a":"#183126"}}>{label}</Link>)}
          <Link href={"/demo/explore-bw/plan"+q} style={{background:"#183126",color:"#fff",padding:"10px 13px",borderRadius:999}}>Plan my safari</Link>
        </nav>
      </div>
    </header>
    {children}
    <footer style={{background:"#183126",color:"#fff",padding:"38px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:24,fontSize:11,color:"#aebbb4"}}>
        <div><strong style={{fontSize:17,color:"#fff"}}>{clientName}</strong><p style={{lineHeight:1.6}}>Botswana safari website concept designed around inspiration, trust and direct enquiry.</p></div>
        <div><strong style={{color:"#fff"}}>Explore</strong><div style={{display:"grid",gap:7,marginTop:9}}><Link href={"/demo/explore-bw/safaris"+q}>Safari ideas</Link><Link href={"/demo/explore-bw/about"+q}>About the operator</Link><Link href={"/demo/explore-bw/plan"+q}>Plan a trip</Link></div></div>
        <div><strong style={{color:"#fff"}}>Demo policies</strong><div style={{display:"grid",gap:7,marginTop:9}}><Link href={"/demo/explore-bw/legal/privacy"+q}>Privacy</Link><Link href={"/demo/explore-bw/legal/terms"+q}>Terms</Link><Link href={"/demo/explore-bw/legal/data-notice"+q}>Demo data notice</Link></div></div>
        <div><strong style={{color:"#fff"}}>Studio</strong><p style={{lineHeight:1.6}}>Designed &amp; developed by Bokang Jobe</p></div>
      </div>
    </footer>
  </main>;
}

export const safariEyebrow:React.CSSProperties={fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.6,color:"#a45f2a",margin:0};
export const safariTitle:React.CSSProperties={fontSize:"clamp(38px,6vw,70px)",lineHeight:.98,letterSpacing:"-.045em",margin:"10px 0 0"};
export const safariLead:React.CSSProperties={fontSize:19,lineHeight:1.65,color:"#40594e"};
export const safariBody:React.CSSProperties={fontSize:14,lineHeight:1.75,color:"#607269"};
