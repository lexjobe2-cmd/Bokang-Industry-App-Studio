"use client";

import { useMemo, useState } from "react";

export function MoveTrackQuoteForm({clientName}:{clientName:string}){
  const [service,setService]=useState("Road freight");
  const [origin,setOrigin]=useState("Gaborone");
  const [destination,setDestination]=useState("");
  const [load,setLoad]=useState("");
  const [weight,setWeight]=useState("");
  const [timing,setTiming]=useState("Flexible");
  const [contact,setContact]=useState("");
  const [notes,setNotes]=useState("");
  const [prepared,setPrepared]=useState(false);

  const summary=useMemo(()=>[service,origin+" → "+(destination||"destination pending"),load||"load not specified",weight||"weight pending",timing].join(" · "),[service,origin,destination,load,weight,timing]);

  if(prepared){
    return <div style={{background:"#fff",border:"1px solid #d7dce1",padding:22}}>
      <p style={{fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.3,color:"#1d4ed8"}}>Quote request prepared</p>
      <h2>Enough information to start pricing.</h2>
      <p style={{color:"#667085",lineHeight:1.7}}>{summary}</p>
      {contact?<p style={{color:"#667085"}}>Contact: {contact}</p>:null}
      {notes?<p style={{color:"#667085"}}>Notes: {notes}</p>:null}
      <p style={{fontSize:11,color:"#98a2b3"}}>This showcase does not transmit data. A commissioned site can route the request to {clientName}&apos;s commercial team.</p>
      <button onClick={()=>setPrepared(false)} style={secondary}>Edit request</button>
    </div>;
  }

  return <div style={{display:"grid",gap:14}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}}>
      <Field label="Service"><select value={service} onChange={(e)=>setService(e.target.value)} style={input}><option>Road freight</option><option>Mining / industrial logistics</option><option>Cross-border haulage</option><option>Warehousing / distribution</option><option>Project cargo</option></select></Field>
      <Field label="Origin"><input value={origin} onChange={(e)=>setOrigin(e.target.value)} style={input}/></Field>
      <Field label="Destination"><input value={destination} onChange={(e)=>setDestination(e.target.value)} placeholder="Town / site / country" style={input}/></Field>
      <Field label="Load / commodity"><input value={load} onChange={(e)=>setLoad(e.target.value)} placeholder="Pallets, aggregate, machinery…" style={input}/></Field>
      <Field label="Approx. weight / volume"><input value={weight} onChange={(e)=>setWeight(e.target.value)} placeholder="e.g. 18 tonnes" style={input}/></Field>
      <Field label="Timing"><select value={timing} onChange={(e)=>setTiming(e.target.value)} style={input}><option>Flexible</option><option>Urgent / same week</option><option>Specific collection date</option><option>Recurring requirement</option></select></Field>
      <Field label="Your contact"><input value={contact} onChange={(e)=>setContact(e.target.value)} placeholder="Name, phone or email" style={input}/></Field>
    </div>
    <Field label="Special handling / site details"><textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Mine gate requirements, loading equipment, dimensions, dangerous goods, access restrictions…" style={{...input,minHeight:115}}/></Field>
    <button onClick={()=>setPrepared(true)} style={{border:0,background:"#101827",color:"#fff",padding:"12px 15px",fontWeight:900,width:"fit-content",borderRadius:4}}>Prepare quote request</button>
  </div>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label style={{display:"grid",gap:6,fontSize:11,fontWeight:850,color:"#475467"}}>{label}{children}</label>}
const input:React.CSSProperties={width:"100%",border:"1px solid #cfd5dd",background:"#fff",padding:12,borderRadius:4,font:"inherit"};
const secondary:React.CSSProperties={border:"1px solid #cfd5dd",background:"#fff",padding:"9px 12px",fontWeight:850,borderRadius:4};
