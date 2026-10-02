"use client";

import { useState } from "react";
import { BuildQuotePublicShell, buildQuoteBody, buildQuoteEyebrow, buildQuoteLead, buildQuoteTitle } from "../../../../components/products/BuildQuotePublicShell";
import { KeylessMap } from "../../../../components/shared/KeylessMap";

export default function BuildQuoteContactPage(){
  const params=new URLSearchParams(typeof window==="undefined"?"":window.location.search);
  const client=(params.get("client")||"Your Construction Company").slice(0,120);
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [email,setEmail]=useState("");
  const [brief,setBrief]=useState("");
  const [sent,setSent]=useState(false);

  return <BuildQuotePublicShell clientName={client} current="contact">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 54px",display:"grid",gridTemplateColumns:"minmax(0,.8fr) minmax(0,1.2fr)",gap:48}}>
      <div><p style={buildQuoteEyebrow}>Contact</p><h1 style={buildQuoteTitle}>Start with a conversation.</h1></div>
      <div><p style={buildQuoteLead}>A construction website does not need to force a detailed quote form on the first visit.</p><p style={buildQuoteBody}>A name, phone number and short brief are enough to start. Drawings, measurements, BOQs and site information can follow once the contractor responds.</p></div>
    </section>
    <section style={{maxWidth:1240,margin:"0 auto",padding:"0 22px 84px",display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:22}}>
      <div style={{background:"#fff",padding:22,border:"1px solid #d7d0c4"}}>
        {sent?<div><strong>Demo enquiry prepared.</strong><p style={buildQuoteBody}>No data was sent. A commissioned version can route enquiries to the client's chosen email or workspace.</p></div>:<div style={{display:"grid",gap:12}}>
          <label style={field}>Name<input value={name} onChange={(e)=>setName(e.target.value)} style={input}/></label>
          <label style={field}>Phone<input value={phone} onChange={(e)=>setPhone(e.target.value)} style={input}/></label>
          <label style={field}>Email<input value={email} onChange={(e)=>setEmail(e.target.value)} style={input}/></label>
          <label style={field}>Project brief<textarea value={brief} onChange={(e)=>setBrief(e.target.value)} style={{...input,minHeight:120}} placeholder="Tell us what you are planning."/></label>
          <button onClick={()=>{if(name.trim())setSent(true)}} style={{border:0,background:"#171717",color:"#fff",padding:"12px 15px",fontWeight:900,width:"fit-content"}}>Send enquiry</button>
        </div>}
      </div>
      <div><KeylessMap points={[{name:client,lat:-24.6282,lng:25.9231,detail:"Concept office location · Gaborone"}]} center={[25.9231,-24.6282]} zoom={12}/><p style={{fontSize:10,color:"#8a8173"}}>Concept map centred on Gaborone until the client's verified office address is supplied.</p></div>
    </section>
  </BuildQuotePublicShell>;
}

const field:React.CSSProperties={display:"grid",gap:6,fontSize:11,fontWeight:850};
const input:React.CSSProperties={width:"100%",border:"1px solid #cfc8bb",background:"#fff",padding:12,font:"inherit"};
