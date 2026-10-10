"use client";

import { useMemo, useState } from "react";
import { clinicCareAreas, clinicTeam } from "../../lib/clinicflow-site";

export function ClinicAppointmentRequest({clientName}:{clientName:string}){
  const [patient,setPatient]=useState("");
  const [contact,setContact]=useState("");
  const [care,setCare]=useState(clinicCareAreas[0]!.title);
  const [reason,setReason]=useState(clinicCareAreas[0]!.reasons[0]!);
  const [clinician,setClinician]=useState("First available suitable clinician");
  const [visit,setVisit]=useState("In-person");
  const [timing,setTiming]=useState("Next available");
  const [payment,setPayment]=useState("Medical aid / insurance");
  const [newPatient,setNewPatient]=useState("New patient");
  const [prepared,setPrepared]=useState(false);

  const currentCare=clinicCareAreas.find((item)=>item.title===care) ?? clinicCareAreas[0]!;
  const summary=useMemo(()=>[care,reason,clinician,visit,timing,payment,newPatient].join(" · "),[care,reason,clinician,visit,timing,payment,newPatient]);

  function changeCare(next:string){
    const item=clinicCareAreas.find((entry)=>entry.title===next) ?? clinicCareAreas[0]!;
    setCare(item.title);
    setReason(item.reasons[0]!);
  }

  if(prepared){
    return <div style={{background:"#fff",border:"1px solid #d7e7eb",padding:22}}>
      <p style={{fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.4,color:"#0e7490"}}>Appointment request prepared</p>
      <h2>This is a request, not a diagnosis or confirmed appointment.</h2>
      <p style={{color:"#6a8289",lineHeight:1.7}}>{patient} · {summary}</p>
      <p style={{fontSize:11,color:"#80969c"}}>A commissioned site can send this request to {clientName}&apos;s scheduling workflow. Clinic staff can confirm the appropriate clinician, date/time and any pre-visit requirements.</p>
      <button onClick={()=>setPrepared(false)} style={secondary}>Edit request</button>
    </div>;
  }

  return <div style={{display:"grid",gap:14}}>
    <div style={{background:"#fff4e8",borderLeft:"4px solid #f59e0b",padding:"12px 14px",fontSize:12,lineHeight:1.65,color:"#725523"}}>Do not use this form for an emergency or to seek an online diagnosis. For urgent/emergency care, contact local emergency services or attend an appropriate emergency facility.</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
      <Field label="Patient name"><input value={patient} onChange={(e)=>setPatient(e.target.value)} style={input}/></Field>
      <Field label="Phone or email"><input value={contact} onChange={(e)=>setContact(e.target.value)} style={input}/></Field>
      <Field label="Care area"><select value={care} onChange={(e)=>changeCare(e.target.value)} style={input}>{clinicCareAreas.map((item)=><option key={item.slug}>{item.title}</option>)}</select></Field>
      <Field label="Visit reason"><select value={reason} onChange={(e)=>setReason(e.target.value)} style={input}>{currentCare.reasons.map((item)=><option key={item}>{item}</option>)}</select></Field>
      <Field label="Clinician"><select value={clinician} onChange={(e)=>setClinician(e.target.value)} style={input}><option>First available suitable clinician</option>{clinicTeam.map((person)=><option key={person.name}>{person.name}</option>)}</select></Field>
      <Field label="Visit type"><select value={visit} onChange={(e)=>setVisit(e.target.value)} style={input}><option>In-person</option><option>Ask clinic about virtual visit</option></select></Field>
      <Field label="Preferred timing"><select value={timing} onChange={(e)=>setTiming(e.target.value)} style={input}><option>Next available</option><option>This week</option><option>Next week</option><option>I have a specific date</option></select></Field>
      <Field label="Payment / cover"><select value={payment} onChange={(e)=>setPayment(e.target.value)} style={input}><option>Medical aid / insurance</option><option>Self-pay</option><option>Not sure / ask clinic</option></select></Field>
      <Field label="Patient status"><select value={newPatient} onChange={(e)=>setNewPatient(e.target.value)} style={input}><option>New patient</option><option>Existing patient</option></select></Field>
    </div>
    <button disabled={!patient.trim()||!contact.trim()} onClick={()=>setPrepared(true)} style={{border:0,background:"#0e7490",color:"#fff",padding:"12px 15px",fontWeight:900,width:"fit-content",borderRadius:999,opacity:!patient.trim()||!contact.trim()?.45:1}}>Prepare appointment request</button>
  </div>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label style={{display:"grid",gap:6,fontSize:11,fontWeight:850,color:"#58727a"}}>{label}{children}</label>}
const input:React.CSSProperties={width:"100%",border:"1px solid #cfe0e4",background:"#fff",padding:12,borderRadius:7,font:"inherit"};
const secondary:React.CSSProperties={border:"1px solid #cfe0e4",background:"#fff",padding:"9px 12px",fontWeight:850,borderRadius:999};
