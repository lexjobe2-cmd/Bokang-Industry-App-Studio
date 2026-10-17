"use client";

import { useMemo, useState } from "react";

export function TaxFlowStartForm({clientName}:{clientName:string}){
  const [name,setName]=useState("");
  const [contact,setContact]=useState("");
  const [taxpayer,setTaxpayer]=useState("Company / business");
  const [issue,setIssue]=useState("Return preparation / filing");
  const [period,setPeriod]=useState("Current period");
  const [urgency,setUrgency]=useState("Planning / not urgent");
  const [burs,setBurs]=useState("No current BURS correspondence");
  const [summary,setSummary]=useState("");
  const [prepared,setPrepared]=useState(false);

  const brief=useMemo(()=>[taxpayer,issue,period,urgency,burs].join(" · "),[taxpayer,issue,period,urgency,burs]);

  if(prepared){
    return <div style={{background:"#fff",border:"1px solid #dbe0ea",padding:22}}>
      <p style={{fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.4,color:"#4f46e5"}}>Tax enquiry prepared</p>
      <h2>Enough context for a tax professional to route the issue.</h2>
      <p style={{color:"#697386",lineHeight:1.7}}>{name} · {brief}</p>
      {summary?<p style={{color:"#697386",lineHeight:1.7}}>Summary: {summary}</p>:null}
      <p style={{fontSize:11,color:"#8b94a5"}}>This showcase does not send or file anything. A commissioned version can route the enquiry to {clientName}, then move documents into the secure TaxFlow workflow after engagement acceptance.</p>
      <button onClick={()=>setPrepared(false)} style={secondary}>Edit enquiry</button>
    </div>;
  }

  return <div style={{display:"grid",gap:14}}>
    <div style={{background:"#fff9db",borderLeft:"4px solid #f3c948",padding:"12px 14px",fontSize:12,lineHeight:1.65,color:"#5c5130"}}>Do not paste passwords, full tax credentials or highly sensitive documents into the first enquiry. Current filing/payment requirements should be confirmed against official BURS guidance.</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
      <Field label="Name / organisation"><input value={name} onChange={(e)=>setName(e.target.value)} style={input}/></Field>
      <Field label="Phone or email"><input value={contact} onChange={(e)=>setContact(e.target.value)} style={input}/></Field>
      <Field label="Taxpayer context"><select value={taxpayer} onChange={(e)=>setTaxpayer(e.target.value)} style={input}><option>Company / business</option><option>Employer</option><option>Individual</option><option>Non-resident / cross-border</option><option>Not sure</option></select></Field>
      <Field label="Main issue"><select value={issue} onChange={(e)=>setIssue(e.target.value)} style={input}><option>Return preparation / filing</option><option>VAT</option><option>PAYE / employer tax</option><option>Withholding tax</option><option>Tax clearance</option><option>BURS notice / correspondence</option><option>Tax planning / transaction</option><option>Registration / profile issue</option><option>Other</option></select></Field>
      <Field label="Period"><select value={period} onChange={(e)=>setPeriod(e.target.value)} style={input}><option>Current period</option><option>Prior period</option><option>Multiple periods</option><option>Not sure</option></select></Field>
      <Field label="Urgency"><select value={urgency} onChange={(e)=>setUrgency(e.target.value)} style={input}><option>Planning / not urgent</option><option>Deadline approaching</option><option>Payment / clearance issue</option><option>Urgent BURS correspondence</option></select></Field>
      <Field label="BURS correspondence"><select value={burs} onChange={(e)=>setBurs(e.target.value)} style={input}><option>No current BURS correspondence</option><option>Notice / letter received</option><option>Objection / dispute issue</option><option>Tax clearance issue</option><option>Not sure</option></select></Field>
    </div>
    <Field label="Short summary"><textarea value={summary} onChange={(e)=>setSummary(e.target.value)} placeholder="Describe the tax issue briefly. Detailed schedules and supporting files can follow in the secure workflow." style={{...input,minHeight:115}}/></Field>
    <button disabled={!name.trim()||!contact.trim()} onClick={()=>setPrepared(true)} style={{border:0,background:"#4f46e5",color:"#fff",padding:"12px 15px",fontWeight:900,width:"fit-content",borderRadius:4,opacity:!name.trim()||!contact.trim()?.45:1}}>Prepare tax enquiry</button>
  </div>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label style={{display:"grid",gap:6,fontSize:11,fontWeight:850,color:"#59657c"}}>{label}{children}</label>}
const input:React.CSSProperties={width:"100%",border:"1px solid #d5dbea",background:"#fff",padding:12,borderRadius:4,font:"inherit"};
const secondary:React.CSSProperties={border:"1px solid #d5dbea",background:"#fff",padding:"9px 12px",fontWeight:850,borderRadius:4};
