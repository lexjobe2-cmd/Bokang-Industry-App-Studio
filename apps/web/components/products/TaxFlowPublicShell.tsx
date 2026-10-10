"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { taxClientQuery } from "../../lib/taxflow-site";

export function TaxFlowPublicShell({
  clientName,
  children,
  current,
}:{
  clientName:string;
  children:ReactNode;
  current:"home"|"services"|"readiness"|"guidance"|"about"|"start";
}){
  const q=taxClientQuery(clientName);
  const nav=[
    ["services","Tax services","/demo/tax-flow/services"+q],
    ["readiness","Readiness","/demo/tax-flow/readiness"+q],
    ["guidance","Guidance","/demo/tax-flow/guidance"+q],
    ["about","About","/demo/tax-flow/about"+q],
  ] as const;

  return <main style={{minHeight:"100vh",background:"#f6f7fb",color:"#17203a"}}>
    <header style={{position:"sticky",top:0,zIndex:30,background:"rgba(246,247,251,.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid #dbe0ea"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"15px 22px",display:"flex",justifyContent:"space-between",gap:18,alignItems:"center",flexWrap:"wrap"}}>
        <Link href={"/demo/tax-flow"+q} style={{textDecoration:"none",color:"#17203a"}}>
          <strong style={{fontSize:22,letterSpacing:"-.035em"}}>{clientName}</strong>
          <div style={{fontSize:9,color:"#697386",textTransform:"uppercase",letterSpacing:1.55}}>Tax · compliance · advisory · Botswana</div>
        </Link>
        <nav style={{display:"flex",gap:16,alignItems:"center",fontSize:12,fontWeight:850,flexWrap:"wrap"}}>
          {nav.map(([key,label,href])=><Link key={key} href={href} style={{color:current===key?"#4f46e5":"#17203a"}}>{label}</Link>)}
          <Link href={"/demo/tax-flow/start"+q} style={{background:"#f3c948",color:"#17203a",padding:"10px 14px",borderRadius:4}}>Ask a tax question</Link>
        </nav>
      </div>
    </header>
    {children}
    <footer style={{background:"#17203a",color:"#fff",padding:"40px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:24,fontSize:11,color:"#aeb6ca"}}>
        <div><strong style={{fontSize:18,color:"#fff"}}>{clientName}</strong><p style={{lineHeight:1.7}}>Tax-advisory website concept focused on readiness, clarity and year-round engagement.</p></div>
        <div><strong style={{color:"#fff"}}>Navigate</strong><div style={{display:"grid",gap:7,marginTop:9}}><Link href={"/demo/tax-flow/services"+q}>Tax services</Link><Link href={"/demo/tax-flow/readiness"+q}>Readiness map</Link><Link href={"/demo/tax-flow/guidance"+q}>Guidance</Link></div></div>
        <div><strong style={{color:"#fff"}}>Official tax information</strong><p style={{lineHeight:1.7}}>Filing, payment and legal requirements should always be checked against current BURS guidance and legislation.</p></div>
        <div><strong style={{color:"#fff"}}>Studio</strong><p style={{lineHeight:1.7}}>Designed &amp; developed by Bokang Jobe</p></div>
      </div>
    </footer>
  </main>;
}

export const taxEyebrow:React.CSSProperties={fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.55,color:"#4f46e5",margin:0};
export const taxTitle:React.CSSProperties={fontSize:"clamp(40px,6vw,72px)",lineHeight:.98,letterSpacing:"-.05em",margin:"10px 0 0"};
export const taxLead:React.CSSProperties={fontSize:20,lineHeight:1.65,color:"#4c5670"};
export const taxBody:React.CSSProperties={fontSize:14,lineHeight:1.75,color:"#697386"};
