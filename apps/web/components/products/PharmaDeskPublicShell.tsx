"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { pharmaClientQuery } from "../../lib/pharmadesk-site";

export function PharmaDeskPublicShell({
  clientName,
  children,
  current,
}:{
  clientName:string;
  children:ReactNode;
  current:"home"|"prescriptions"|"services"|"branches"|"about";
}){
  const q=pharmaClientQuery(clientName);
  const nav=[
    ["prescriptions","Prescriptions","/demo/pharma-desk/prescriptions"+q],
    ["services","Health & pharmacy","/demo/pharma-desk/services"+q],
    ["branches","Branches","/demo/pharma-desk/branches"+q],
    ["about","About","/demo/pharma-desk/about"+q],
  ] as const;

  return <main style={{minHeight:"100vh",background:"#f4fbf7",color:"#12342a"}}>
    <header style={{position:"sticky",top:0,zIndex:30,background:"rgba(244,251,247,.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid #d5e7dd"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"15px 22px",display:"flex",justifyContent:"space-between",gap:18,alignItems:"center",flexWrap:"wrap"}}>
        <Link href={"/demo/pharma-desk"+q} style={{textDecoration:"none",color:"#12342a"}}>
          <strong style={{fontSize:22,letterSpacing:"-.035em"}}>{clientName}</strong>
          <div style={{fontSize:9,color:"#648076",textTransform:"uppercase",letterSpacing:1.5}}>Pharmacy · prescriptions · Botswana</div>
        </Link>
        <nav style={{display:"flex",gap:16,alignItems:"center",fontSize:12,fontWeight:850,flexWrap:"wrap"}}>
          {nav.map(([key,label,href])=><Link key={key} href={href} style={{color:current===key?"#047857":"#12342a"}}>{label}</Link>)}
          <Link href={"/demo/pharma-desk/prescriptions"+q} style={{background:"#047857",color:"#fff",padding:"10px 14px",borderRadius:999}}>Refill / prescription</Link>
        </nav>
      </div>
    </header>
    {children}
    <footer style={{background:"#12342a",color:"#fff",padding:"40px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:24,fontSize:11,color:"#b6ccc4"}}>
        <div><strong style={{fontSize:18,color:"#fff"}}>{clientName}</strong><p style={{lineHeight:1.7}}>Community-pharmacy website concept focused on prescriptions, access and pharmacist support.</p></div>
        <div><strong style={{color:"#fff"}}>Navigate</strong><div style={{display:"grid",gap:7,marginTop:9}}><Link href={"/demo/pharma-desk/prescriptions"+q}>Prescriptions</Link><Link href={"/demo/pharma-desk/services"+q}>Health & pharmacy</Link><Link href={"/demo/pharma-desk/branches"+q}>Branches</Link></div></div>
        <div><strong style={{color:"#fff"}}>Important</strong><p style={{lineHeight:1.7}}>Prescription medicines require appropriate pharmacist review and, where required, a valid prescription. This showcase does not diagnose, prescribe or dispense medicines.</p></div>
        <div><strong style={{color:"#fff"}}>Studio</strong><p style={{lineHeight:1.7}}>Designed &amp; developed by Bokang Jobe</p></div>
      </div>
    </footer>
  </main>;
}

export const pharmaEyebrow:React.CSSProperties={fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.5,color:"#047857",margin:0};
export const pharmaTitle:React.CSSProperties={fontSize:"clamp(40px,6vw,72px)",lineHeight:.98,letterSpacing:"-.05em",margin:"10px 0 0"};
export const pharmaLead:React.CSSProperties={fontSize:20,lineHeight:1.65,color:"#45685d"};
export const pharmaBody:React.CSSProperties={fontSize:14,lineHeight:1.75,color:"#688279"};
