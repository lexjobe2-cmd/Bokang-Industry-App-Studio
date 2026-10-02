"use client";

import { useState } from "react";
import { botswanaPlaces, clinicAppointmentStates, clinicAppointmentTypes } from "@bokang/domain-data";

type Appointment={id:string;patient:string;type:string;practitioner:string;time:string;state:string;location:string};
const starter:Appointment[]=[
{id:"CF-201",patient:"Neo K.",type:"General consultation",practitioner:"Dr. M. Dube",time:"09:00",state:"Confirmed",location:"Gaborone"},
{id:"CF-202",patient:"Boitumelo R.",type:"Follow-up",practitioner:"Dr. K. Molefe",time:"10:30",state:"Checked in",location:"Gaborone"},
{id:"CF-203",patient:"Tebogo P.",type:"Chronic care",practitioner:"Dr. M. Dube",time:"14:00",state:"Requested",location:"Mogoditshane"},
];

export function ClinicFlowShowcase(){
 const [items,setItems]=useState(starter);
 const [patient,setPatient]=useState("");
 const [type,setType]=useState<(typeof clinicAppointmentTypes)[number]>("General consultation");
 const [location,setLocation]=useState<(typeof botswanaPlaces)[number]>("Gaborone");
 const [view,setView]=useState<"appointments"|"new"|"patients"|"analytics">("appointments");
 function add(){if(!patient.trim())return;setItems(c=>[{id:`CF-${200+c.length+1}`,patient:patient.trim(),type,practitioner:"Unassigned",time:"TBD",state:"Requested",location},...c]);setPatient("");setView("appointments");}
 return <section style={{marginTop:28,display:"grid",gap:18}}>
  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{([["appointments","Appointments"],["new","Book appointment"],["patients","Patients"],["analytics","Clinic analytics"]] as const).map(([k,l])=><button key={k} onClick={()=>setView(k)} style={{border:"1px solid #d0d5dd",background:view===k?"#101827":"#fff",color:view===k?"#fff":"#344054",borderRadius:999,padding:"9px 14px",fontWeight:800}}>{l}</button>)}</div>
  {view==="appointments"&&<div style={{display:"grid",gap:12}}>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>{[["Today",items.length],["Checked in",items.filter(x=>x.state==="Checked in").length],["Confirmed",items.filter(x=>x.state==="Confirmed").length],["Follow-ups due",4]].map(([l,v])=><div key={String(l)} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:18,padding:16}}><div style={{fontSize:12,color:"#667085",fontWeight:800}}>{l}</div><strong style={{fontSize:28}}>{v}</strong></div>)}</div>
   <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,overflow:"hidden"}}>{items.map(x=><div key={x.id} style={{padding:16,borderBottom:"1px solid #f0f2f5",display:"grid",gap:6}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><strong>{x.time} · {x.patient}</strong><div style={{fontSize:12,color:"#667085"}}>{x.type} · {x.practitioner} · {x.location}</div></div>
    <select value={x.state} onChange={e=>setItems(c=>c.map(y=>y.id===x.id?{...y,state:e.target.value}:y))} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:"8px 10px"}}>{clinicAppointmentStates.map(s=><option key={s}>{s}</option>)}</select></div>
   </div>)}</div>
  </div>}
  {view==="new"&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,padding:20}}><h2 style={{marginTop:0}}>Book appointment</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
   <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Patient<input value={patient} onChange={e=>setPatient(e.target.value)} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}/></label>
   <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Visit type<select value={type} onChange={e=>setType(e.target.value as typeof type)} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}>{clinicAppointmentTypes.map(x=><option key={x}>{x}</option>)}</select></label>
   <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Location<select value={location} onChange={e=>setLocation(e.target.value as typeof location)} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}>{botswanaPlaces.map(x=><option key={x}>{x}</option>)}</select></label>
  </div><button onClick={add} style={{marginTop:16,border:0,borderRadius:12,padding:"12px 18px",background:"#2563eb",color:"#fff",fontWeight:850}}>Request appointment</button></div>}
  {view==="patients"&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,padding:20}}><h2 style={{marginTop:0}}>Patient workspace</h2><p style={{color:"#667085"}}>Showcase registry with intake, appointment history, follow-up reminders and connected-document references.</p>{["Neo K.","Boitumelo R.","Tebogo P."].map((x,i)=><div key={x} style={{padding:"12px 0",borderBottom:"1px solid #f0f2f5"}}><strong>{x}</strong><div style={{fontSize:12,color:"#667085"}}>{i+1} upcoming/follow-up items · documents stored in connected workspace</div></div>)}</div>}
  {view==="analytics"&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,padding:20}}><h2 style={{marginTop:0}}>Clinic operations</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>{[["Attendance","91%"],["Avg wait","14m"],["Follow-up","76%"],["Utilisation","68%"]].map(([l,v])=><div key={l} style={{border:"1px solid #e5e7eb",borderRadius:16,padding:16}}><div style={{fontSize:12,color:"#667085"}}>{l}</div><strong style={{fontSize:24}}>{v}</strong></div>)}</div></div>}
 </section>;
}
