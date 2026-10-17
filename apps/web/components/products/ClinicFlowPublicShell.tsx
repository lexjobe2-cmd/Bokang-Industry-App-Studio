"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { clinicClientQuery } from "../../lib/clinicflow-site";

export function ClinicFlowPublicShell({
  clientName,
  children,
  current,
}:{
  clientName:string;
  children:ReactNode;
  current:"home"|"care"|"team"|"patient-info"|"book";
}){
  const q=clinicClientQuery(clientName);
  const nav=[
    ["care","Care & services","/demo/clinic-flow/care"+q],
    ["team","Our clinicians","/demo/clinic-flow/team"+q],
    ["patient-info","Patient info","/demo/clinic-flow/patient-info"+q],
  ] as const;

  return <main style={{minHeight:"100vh",background:"#f5fafb",color:"#17343d"}}>
    <header style={{position:"sticky",top:0,zIndex:30,background:"rgba(245,250,251,.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid #d7e7eb"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"15px 22px",display:"flex",justifyContent:"space-between",gap:18,alignItems:"center",flexWrap:"wrap"}}>
        <Link href={"/demo/clinic-flow"+q} style={{textDecoration:"none",color:"#17343d"}}>
          <strong style={{fontSize:22,letterSpacing:"-.035em"}}>{clientName}</strong>
          <div style={{fontSize:9,color:"#66818a",textTransform:"uppercase",letterSpacing:1.5}}>Clinic · patient care · Botswana</div>
        </Link>
        <nav style={{display:"flex",gap:16,alignItems:"center",fontSize:12,fontWeight:850,flexWrap:"wrap"}}>
          {nav.map(([key,label,href])=><Link key={key} href={href} style={{color:current===key?"#0e7490":"#17343d"}}>{label}</Link>)}
          <Link href={"/demo/clinic-flow/book"+q} style={{background:"#0e7490",color:"#fff",padding:"10px 14px",borderRadius:999}}>Request appointment</Link>
        </nav>
      </div>
    </header>
    {children}
    <footer style={{background:"#17343d",color:"#fff",padding:"40px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:24,fontSize:11,color:"#b5c7cc"}}>
        <div><strong style={{fontSize:18,color:"#fff"}}>{clientName}</strong><p style={{lineHeight:1.7}}>Clinic website concept focused on access, verified professionals and simple patient preparation.</p></div>
        <div><strong style={{color:"#fff"}}>Navigate</strong><div style={{display:"grid",gap:7,marginTop:9}}><Link href={"/demo/clinic-flow/care"+q}>Care & services</Link><Link href={"/demo/clinic-flow/team"+q}>Clinicians</Link><Link href={"/demo/clinic-flow/book"+q}>Appointments</Link></div></div>
        <div><strong style={{color:"#fff"}}>Important</strong><p style={{lineHeight:1.7}}>This showcase does not provide diagnosis or emergency care. For an emergency, contact local emergency services or attend an appropriate emergency facility.</p></div>
        <div><strong style={{color:"#fff"}}>Studio</strong><p style={{lineHeight:1.7}}>Designed &amp; developed by Bokang Jobe</p></div>
      </div>
    </footer>
  </main>;
}

export const clinicEyebrow:React.CSSProperties={fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.5,color:"#0e7490",margin:0};
export const clinicTitle:React.CSSProperties={fontSize:"clamp(40px,6vw,72px)",lineHeight:.98,letterSpacing:"-.05em",margin:"10px 0 0"};
export const clinicLead:React.CSSProperties={fontSize:20,lineHeight:1.65,color:"#44636c"};
export const clinicBody:React.CSSProperties={fontSize:14,lineHeight:1.75,color:"#6a8289"};
