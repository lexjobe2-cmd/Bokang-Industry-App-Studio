"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { lexClientQuery } from "../../lib/lexintake-site";

export function LexIntakePublicShell({
  clientName,
  children,
  current,
}:{
  clientName:string;
  children:ReactNode;
  current:"home"|"expertise"|"people"|"insights"|"start";
}){
  const q=lexClientQuery(clientName);
  const nav=[
    ["expertise","Expertise","/demo/lex-intake/expertise"+q],
    ["people","People","/demo/lex-intake/people"+q],
    ["insights","Insights","/demo/lex-intake/insights"+q],
  ] as const;

  return <main style={{minHeight:"100vh",background:"#f5f2ed",color:"#241d20"}}>
    <header style={{position:"sticky",top:0,zIndex:30,background:"rgba(245,242,237,.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid #d9d1ca"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"16px 22px",display:"flex",justifyContent:"space-between",gap:18,alignItems:"center",flexWrap:"wrap"}}>
        <Link href={"/demo/lex-intake"+q} style={{textDecoration:"none",color:"#241d20"}}>
          <strong style={{fontFamily:"Georgia,serif",fontSize:22,letterSpacing:"-.02em"}}>{clientName}</strong>
          <div style={{fontSize:9,color:"#7b6c72",textTransform:"uppercase",letterSpacing:1.6}}>Attorneys · Botswana</div>
        </Link>
        <nav style={{display:"flex",gap:17,alignItems:"center",fontSize:12,fontWeight:800,flexWrap:"wrap"}}>
          {nav.map(([key,label,href])=><Link key={key} href={href} style={{color:current===key?"#7f1d3f":"#241d20"}}>{label}</Link>)}
          <Link href={"/demo/lex-intake/start"+q} style={{background:"#49152a",color:"#fff",padding:"10px 14px"}}>Start an enquiry</Link>
        </nav>
      </div>
    </header>
    {children}
    <footer style={{background:"#241d20",color:"#fff",padding:"42px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:26,fontSize:11,color:"#bfb3b8"}}>
        <div><strong style={{fontFamily:"Georgia,serif",fontSize:18,color:"#fff"}}>{clientName}</strong><p style={{lineHeight:1.7}}>Law-firm website concept designed around expertise, trust and a clear path to first contact.</p></div>
        <div><strong style={{color:"#fff"}}>Explore</strong><div style={{display:"grid",gap:7,marginTop:9}}><Link href={"/demo/lex-intake/expertise"+q}>Expertise</Link><Link href={"/demo/lex-intake/people"+q}>People</Link><Link href={"/demo/lex-intake/insights"+q}>Insights</Link></div></div>
        <div><strong style={{color:"#fff"}}>Important</strong><p style={{lineHeight:1.7}}>Submitting an enquiry does not create an attorney-client relationship. A firm should complete conflict checks and engagement acceptance first.</p></div>
        <div><strong style={{color:"#fff"}}>Studio</strong><p style={{lineHeight:1.7}}>Designed &amp; developed by Bokang Jobe</p></div>
      </div>
    </footer>
  </main>;
}

export const legalEyebrow:React.CSSProperties={fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.7,color:"#7f1d3f",margin:0};
export const legalTitle:React.CSSProperties={fontFamily:"Georgia,serif",fontSize:"clamp(40px,6vw,74px)",lineHeight:1,letterSpacing:"-.035em",fontWeight:500,margin:"10px 0 0"};
export const legalLead:React.CSSProperties={fontFamily:"Georgia,serif",fontSize:21,lineHeight:1.6,color:"#4f4348"};
export const legalBody:React.CSSProperties={fontSize:14,lineHeight:1.8,color:"#756970"};
