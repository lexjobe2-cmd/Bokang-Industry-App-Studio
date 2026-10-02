"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { buildQuoteClientQuery } from "../../lib/buildquote-site";

export function BuildQuotePublicShell({
  clientName,
  children,
  current,
}: {
  clientName:string;
  children:ReactNode;
  current:"home"|"about"|"projects"|"services"|"contact";
}) {
  const q=buildQuoteClientQuery(clientName);
  const nav=[
    ["about","About","/demo/build-quote/about"+q],
    ["projects","Projects","/demo/build-quote/projects"+q],
    ["services","Services","/demo/build-quote/services"+q],
    ["contact","Contact","/demo/build-quote/contact"+q]
  ] as const;

  return <main style={{minHeight:"100vh",background:"#f7f5f0",color:"#171717"}}>
    <header style={{position:"sticky",top:0,zIndex:30,background:"rgba(247,245,240,.94)",backdropFilter:"blur(12px)",borderBottom:"1px solid #ded8cc"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"14px 22px",display:"flex",justifyContent:"space-between",gap:18,alignItems:"center",flexWrap:"wrap"}}>
        <Link href={"/demo/build-quote"+q} style={{textDecoration:"none"}}>
          <strong style={{fontSize:20,letterSpacing:"-.02em"}}>{clientName}</strong>
          <div style={{fontSize:10,color:"#737373",textTransform:"uppercase",letterSpacing:1.4}}>Construction · Botswana</div>
        </Link>
        <nav style={{display:"flex",gap:16,alignItems:"center",fontSize:12,fontWeight:800,flexWrap:"wrap"}}>
          {nav.map(([key,label,href])=><Link key={key} href={href} style={{color:current===key?"#8a6d32":"#171717"}}>{label}</Link>)}
          <Link href={"/demo/build-quote/contact"+q} style={{background:"#171717",color:"#fff",padding:"9px 12px",borderRadius:999}}>Start a project</Link>
        </nav>
      </div>
    </header>
    {children}
    <footer style={{background:"#171717",color:"#fff",padding:"34px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap",fontSize:11,color:"#aaa"}}>
        <div><strong style={{color:"#fff"}}>{clientName}</strong><div style={{marginTop:5}}>Construction website concept · Botswana</div></div>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          <Link href={"/demo/build-quote/legal/privacy"+q}>Privacy</Link>
          <Link href={"/demo/build-quote/legal/terms"+q}>Terms</Link>
          <Link href={"/demo/build-quote/legal/data-notice"+q}>Demo data notice</Link>
        </div>
        <div>Designed &amp; developed by Bokang Jobe</div>
      </div>
    </footer>
  </main>;
}

export const buildQuoteEyebrow:React.CSSProperties={fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.5,color:"#8a6d32",margin:0};
export const buildQuoteTitle:React.CSSProperties={fontSize:"clamp(34px,5vw,58px)",lineHeight:1.02,letterSpacing:"-.04em",margin:"9px 0 0"};
export const buildQuoteLead:React.CSSProperties={fontSize:20,lineHeight:1.65,color:"#2f2b25",marginTop:0};
export const buildQuoteBody:React.CSSProperties={fontSize:14,lineHeight:1.75,color:"#6a6358"};
