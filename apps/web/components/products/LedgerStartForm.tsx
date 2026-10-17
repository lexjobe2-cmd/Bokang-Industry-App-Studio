"use client";

import { useMemo, useState } from "react";

export function LedgerStartForm({clientName}:{clientName:string}){
  const [business,setBusiness]=useState("");
  const [contact,setContact]=useState("");
  const [need,setNeed]=useState("Monthly accounting / management accounts");
  const [size,setSize]=useState("1–10 employees");
  const [current,setCurrent]=useState("Spreadsheets / manual process");
  const [timing,setTiming]=useState("Exploring options");
  const [prepared,setPrepared]=useState(false);

  const summary=useMemo(()=>[need,size,current,timing].join(" · "),[need,size,current,timing]);

  if(prepared){
    return <div style={{background:"#fff",border:"1px solid #d7e0dd",padding:22}}>
      <p style={{fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.4,color:"#0f766e"}}>Conversation brief prepared</p>
      <h2>Enough information for the firm to route the enquiry.</h2>
      <p style={{color:"#657a75",lineHeight:1.7}}>{business} · {summary}</p>
      <p style={{fontSize:11,color:"#83928e"}}>This showcase does not send data. A commissioned site can route the enquiry to {clientName}&apos;s chosen email/workspace and then invite the client into the secure LedgerDesk onboarding flow.</p>
      <button onClick={()=>setPrepared(false)} style={secondary}>Edit enquiry</button>
    </div>;
  }

  return <div style={{display:"grid",gap:14}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
      <Field label="Business / organisation"><input value={business} onChange={(e)=>setBusiness(e.target.value)} style={input}/></Field>
      <Field label="Your contact"><input value={contact} onChange={(e)=>setContact(e.target.value)} placeholder="Name, email or phone" style={input}/></Field>
      <Field label="What would help most?"><select value={need} onChange={(e)=>setNeed(e.target.value)} style={input}><option>Monthly accounting / management accounts</option><option>Bookkeeping cleanup</option><option>Payroll / recurring compliance</option><option>Cash-flow / forecasting</option><option>Finance-process improvement</option><option>Advisory / business review</option><option>Not sure yet</option></select></Field>
      <Field label="Business size"><select value={size} onChange={(e)=>setSize(e.target.value)} style={input}><option>Solo / owner only</option><option>1–10 employees</option><option>11–50 employees</option><option>51+ employees</option></select></Field>
      <Field label="Current finance process"><select value={current} onChange={(e)=>setCurrent(e.target.value)} style={input}><option>Spreadsheets / manual process</option><option>Accounting software but inconsistent process</option><option>Internal bookkeeper / finance person</option><option>Existing external accountant</option><option>Not sure</option></select></Field>
      <Field label="Timing"><select value={timing} onChange={(e)=>setTiming(e.target.value)} style={input}><option>Exploring options</option><option>Need help this month</option><option>Before next month-end</option><option>Urgent cleanup / deadline</option></select></Field>
    </div>
    <button disabled={!business.trim()||!contact.trim()} onClick={()=>setPrepared(true)} style={{border:0,background:"#15302d",color:"#fff",padding:"12px 15px",fontWeight:900,width:"fit-content",borderRadius:999,opacity:!business.trim()||!contact.trim()?.45:1}}>Prepare enquiry</button>
  </div>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label style={{display:"grid",gap:6,fontSize:11,fontWeight:850,color:"#526862"}}>{label}{children}</label>}
const input:React.CSSProperties={width:"100%",border:"1px solid #cfdad7",background:"#fff",padding:12,borderRadius:4,font:"inherit"};
const secondary:React.CSSProperties={border:"1px solid #cfdad7",background:"#fff",padding:"9px 12px",fontWeight:850,borderRadius:999};
