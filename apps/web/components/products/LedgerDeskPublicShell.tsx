"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ledgerClientQuery } from "../../lib/ledgerdesk-site";

export function LedgerDeskPublicShell({
  clientName,
  children,
  current,
}:{
  clientName:string;
  children:ReactNode;
  current:"home"|"services"|"insights"|"about"|"start";
}){
  const q=ledgerClientQuery(clientName);
  const nav=[
    ["services","How we help","/demo/ledger-desk/services"+q],
    ["insights","Insights","/demo/ledger-desk/insights"+q],
    ["about","About","/demo/ledger-desk/about"+q],
  ] as const;

  return <main style={{minHeight:"100vh",background:"#f4f7f6",color:"#15302d"}}>
    <header style={{position:"sticky",top:0,zIndex:30,background:"rgba(244,247,246,.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid #d7e0dd"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"15px 22px",display:"flex",justifyContent:"space-between",gap:18,alignItems:"center",flexWrap:"wrap"}}>
        <Link href={"/demo/ledger-desk"+q} style={{textDecoration:"none",color:"#15302d"}}>
          <strong style={{fontSize:22,letterSpacing:"-.035em"}}>{clientName}</strong>
          <div style={{fontSize:9,color:"#6d827d",textTransform:"uppercase",letterSpacing:1.5}}>Accounting · finance · Botswana</div>
        </Link>
        <nav style={{display:"flex",gap:17,alignItems:"center",fontSize:12,fontWeight:850,flexWrap:"wrap"}}>
          {nav.map(([key,label,href])=><Link key={key} href={href} style={{color:current===key?"#0f766e":"#15302d"}}>{label}</Link>)}
          <Link href={"/demo/ledger-desk/start"+q} style={{background:"#15302d",color:"#fff",padding:"10px 14px",borderRadius:999}}>Talk to the firm</Link>
        </nav>
      </div>
    </header>
    {children}
    <footer style={{background:"#15302d",color:"#fff",padding:"40px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:24,fontSize:11,color:"#afc1bd"}}>
        <div><strong style={{fontSize:18,color:"#fff"}}>{clientName}</strong><p style={{lineHeight:1.7}}>Accounting-firm website concept built around financial clarity, recurring service and a simple path to engagement.</p></div>
        <div><strong style={{color:"#fff"}}>Navigate</strong><div style={{display:"grid",gap:7,marginTop:9}}><Link href={"/demo/ledger-desk/services"+q}>How we help</Link><Link href={"/demo/ledger-desk/insights"+q}>Insights</Link><Link href={"/demo/ledger-desk/about"+q}>About</Link></div></div>
        <div><strong style={{color:"#fff"}}>Professional verification</strong><p style={{lineHeight:1.7}}>A commissioned site should publish only verified BICA membership, practising status and professional credentials.</p></div>
        <div><strong style={{color:"#fff"}}>Studio</strong><p style={{lineHeight:1.7}}>Designed &amp; developed by Bokang Jobe</p></div>
      </div>
    </footer>
  </main>;
}

export const ledgerEyebrow:React.CSSProperties={fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.55,color:"#0f766e",margin:0};
export const ledgerTitle:React.CSSProperties={fontSize:"clamp(40px,6vw,72px)",lineHeight:.98,letterSpacing:"-.05em",margin:"10px 0 0"};
export const ledgerLead:React.CSSProperties={fontSize:20,lineHeight:1.65,color:"#405b56"};
export const ledgerBody:React.CSSProperties={fontSize:14,lineHeight:1.75,color:"#657a75"};
