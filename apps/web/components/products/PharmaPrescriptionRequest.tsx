"use client";

import { useMemo, useState } from "react";

export function PharmaPrescriptionRequest({clientName}:{clientName:string}){
  const [name,setName]=useState("");
  const [contact,setContact]=useState("");
  const [request,setRequest]=useState("Repeat prescription / refill");
  const [prescription,setPrescription]=useState("I have a valid prescription");
  const [fulfilment,setFulfilment]=useState("Collect in store");
  const [branch,setBranch]=useState("Gaborone Central");
  const [medicalAid,setMedicalAid]=useState("Medical aid / insurance");
  const [notes,setNotes]=useState("");
  const [prepared,setPrepared]=useState(false);

  const summary=useMemo(()=>[request,prescription,fulfilment,branch,medicalAid].join(" · "),[request,prescription,fulfilment,branch,medicalAid]);

  if(prepared){
    return <div style={{background:"#fff",border:"1px solid #d5e7dd",padding:22}}>
      <p style={{fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.4,color:"#047857"}}>Prescription request prepared</p>
      <h2>Pharmacist review comes before dispensing.</h2>
      <p style={{color:"#688279",lineHeight:1.7}}>{name} · {summary}</p>
      {notes?<p style={{color:"#688279",lineHeight:1.7}}>Notes: {notes}</p>:null}
      <p style={{fontSize:11,color:"#82988f"}}>This showcase does not transmit, approve or dispense anything. A commissioned site can route the request to {clientName}&apos;s pharmacy team for pharmacist verification, stock confirmation and pickup/delivery confirmation.</p>
      <button onClick={()=>setPrepared(false)} style={secondary}>Edit request</button>
    </div>;
  }

  return <div style={{display:"grid",gap:14}}>
    <div style={{background:"#fff7ed",borderLeft:"4px solid #f59e0b",padding:"12px 14px",fontSize:12,lineHeight:1.65,color:"#765324"}}>
      Do not use this form for emergencies or to request a diagnosis. Prescription-only medicines are subject to valid prescription and pharmacist review.
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
      <Field label="Your name"><input value={name} onChange={(e)=>setName(e.target.value)} style={input}/></Field>
      <Field label="Phone or email"><input value={contact} onChange={(e)=>setContact(e.target.value)} style={input}/></Field>
      <Field label="What do you need?"><select value={request} onChange={(e)=>setRequest(e.target.value)} style={input}><option>Repeat prescription / refill</option><option>New prescription dispensing</option><option>Transfer prescription enquiry</option><option>Ask pharmacist about current medication</option><option>Stock availability enquiry</option></select></Field>
      <Field label="Prescription status"><select value={prescription} onChange={(e)=>setPrescription(e.target.value)} style={input}><option>I have a valid prescription</option><option>Repeat prescription already on file</option><option>I need to ask the pharmacy what is required</option><option>Not applicable to my request</option></select></Field>
      <Field label="Pickup / delivery"><select value={fulfilment} onChange={(e)=>setFulfilment(e.target.value)} style={input}><option>Collect in store</option><option>Ask about local delivery</option><option>Not sure yet</option></select></Field>
      <Field label="Preferred branch"><select value={branch} onChange={(e)=>setBranch(e.target.value)} style={input}><option>Gaborone Central</option><option>Mogoditshane</option><option>Nearest available branch</option></select></Field>
      <Field label="Payment / cover"><select value={medicalAid} onChange={(e)=>setMedicalAid(e.target.value)} style={input}><option>Medical aid / insurance</option><option>Self-pay</option><option>Not sure / ask pharmacy</option></select></Field>
    </div>
    <Field label="Short note (optional)"><textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Medicine name, refill question or collection/delivery note. Avoid pasting passwords, full ID numbers or unnecessary sensitive medical details." style={{...input,minHeight:110}}/></Field>
    <button disabled={!name.trim()||!contact.trim()} onClick={()=>setPrepared(true)} style={{border:0,background:"#047857",color:"#fff",padding:"12px 15px",fontWeight:900,width:"fit-content",borderRadius:999,opacity:!name.trim()||!contact.trim()?.45:1}}>Prepare prescription request</button>
  </div>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label style={{display:"grid",gap:6,fontSize:11,fontWeight:850,color:"#55736a"}}>{label}{children}</label>}
const input:React.CSSProperties={width:"100%",border:"1px solid #cfe2d8",background:"#fff",padding:12,borderRadius:8,font:"inherit"};
const secondary:React.CSSProperties={border:"1px solid #cfe2d8",background:"#fff",padding:"9px 12px",fontWeight:850,borderRadius:999};
