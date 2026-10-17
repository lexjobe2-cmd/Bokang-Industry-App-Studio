"use client";

import { useState } from "react";

export function BuildQuoteContactForm(){
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [email,setEmail]=useState("");
  const [brief,setBrief]=useState("");
  const [sent,setSent]=useState(false);

  if(sent){
    return <div><strong>Demo enquiry prepared.</strong><p style={body}>No data was sent. A commissioned version can route enquiries to the client&apos;s chosen email or workspace.</p></div>;
  }

  return <div style={{display:"grid",gap:12}}>
    <label style={field}>Name<input value={name} onChange={(e)=>setName(e.target.value)} style={input}/></label>
    <label style={field}>Phone<input value={phone} onChange={(e)=>setPhone(e.target.value)} style={input}/></label>
    <label style={field}>Email<input value={email} onChange={(e)=>setEmail(e.target.value)} style={input}/></label>
    <label style={field}>Project brief<textarea value={brief} onChange={(e)=>setBrief(e.target.value)} style={{...input,minHeight:120}} placeholder="Tell us what you are planning."/></label>
    <button onClick={()=>{if(name.trim())setSent(true)}} style={{border:0,background:"#171717",color:"#fff",padding:"12px 15px",fontWeight:900,width:"fit-content"}}>Send enquiry</button>
  </div>;
}

const field:React.CSSProperties={display:"grid",gap:6,fontSize:11,fontWeight:850};
const input:React.CSSProperties={width:"100%",border:"1px solid #cfc8bb",background:"#fff",padding:12,font:"inherit"};
const body:React.CSSProperties={fontSize:14,lineHeight:1.75,color:"#6a6358"};
