"use client";

import { useMemo, useState } from "react";

export function LexIntakeEnquiryForm({clientName}:{clientName:string}){
  const [name,setName]=useState("");
  const [contact,setContact]=useState("");
  const [matter,setMatter]=useState("Business / commercial");
  const [otherParty,setOtherParty]=useState("");
  const [urgency,setUrgency]=useState("Not urgent");
  const [summary,setSummary]=useState("");
  const [consent,setConsent]=useState(false);
  const [prepared,setPrepared]=useState(false);

  const packet=useMemo(()=>[matter,urgency,otherParty?"Other party: "+otherParty:"Other party not supplied"].join(" · "),[matter,urgency,otherParty]);

  if(prepared){
    return <div style={{background:"#fff",border:"1px solid #d9d1ca",padding:22}}>
      <p style={{fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.5,color:"#7f1d3f"}}>Initial enquiry prepared</p>
      <h2 style={{fontFamily:"Georgia,serif",fontWeight:500}}>The next step is a conflict check—not a document upload.</h2>
      <p style={{color:"#756970",lineHeight:1.75}}>{packet}</p>
      <p style={{fontSize:12,color:"#756970"}}>A commissioned version can route this minimal intake to {clientName}&apos;s internal LexIntake queue. The firm can then complete conflict screening before inviting confidential documents or detailed instructions.</p>
      <button onClick={()=>setPrepared(false)} style={secondary}>Edit enquiry</button>
    </div>;
  }

  return <div style={{display:"grid",gap:14}}>
    <div style={{background:"#f9f6f2",borderLeft:"3px solid #7f1d3f",padding:"12px 14px",fontSize:12,lineHeight:1.65,color:"#5f5158"}}>
      Keep the first contact brief. Do not send privileged documents, passwords, full ID numbers or highly sensitive evidence until the firm confirms it can act.
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
      <Field label="Your name / organisation"><input value={name} onChange={(e)=>setName(e.target.value)} style={input}/></Field>
      <Field label="Phone or email"><input value={contact} onChange={(e)=>setContact(e.target.value)} style={input}/></Field>
      <Field label="What do you need help with?"><select value={matter} onChange={(e)=>setMatter(e.target.value)} style={input}><option>Business / commercial</option><option>Dispute / litigation</option><option>Employment</option><option>Property / conveyancing</option><option>Estate / succession</option><option>Family / personal matter</option><option>Regulatory / compliance</option><option>Other</option></select></Field>
      <Field label="Urgency"><select value={urgency} onChange={(e)=>setUrgency(e.target.value)} style={input}><option>Not urgent</option><option>Within a week</option><option>Time-sensitive / deadline approaching</option><option>Urgent court / transaction issue</option></select></Field>
      <Field label="Other party / organisation (for conflict screening)"><input value={otherParty} onChange={(e)=>setOtherParty(e.target.value)} placeholder="Name only if known" style={input}/></Field>
    </div>
    <Field label="Short summary"><textarea value={summary} onChange={(e)=>setSummary(e.target.value)} placeholder="A few sentences about the issue. Avoid attaching evidence at this stage." style={{...input,minHeight:120}}/></Field>
    <label style={{display:"flex",gap:9,alignItems:"start",fontSize:12,color:"#5f5158"}}><input type="checkbox" checked={consent} onChange={(e)=>setConsent(e.target.checked)}/><span>I understand this is an initial enquiry and does not create an attorney-client relationship.</span></label>
    <button disabled={!name.trim()||!contact.trim()||!consent} onClick={()=>setPrepared(true)} style={{border:0,background:"#49152a",color:"#fff",padding:"12px 15px",fontWeight:900,width:"fit-content",opacity:!name.trim()||!contact.trim()||!consent?.45:1}}>Prepare confidential enquiry</button>
  </div>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label style={{display:"grid",gap:6,fontSize:11,fontWeight:850,color:"#5f5158"}}>{label}{children}</label>}
const input:React.CSSProperties={width:"100%",border:"1px solid #cfc5c8",background:"#fff",padding:12,font:"inherit"};
const secondary:React.CSSProperties={border:"1px solid #cfc5c8",background:"#fff",padding:"9px 12px",fontWeight:850};
