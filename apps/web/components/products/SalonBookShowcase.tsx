"use client";

import { useMemo, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";
import { salonBookingKey, salonTeamKey, type SalonAppointment } from "../../lib/salon-book";
import { CalendarDays, CheckCircle2, Clock3, Users } from "lucide-react";

const states:SalonAppointment["status"][]=["Requested","Contacted","Confirmed","In service","Completed","Cancelled"];
const field:React.CSSProperties={width:"100%",minWidth:0,border:"1px solid #d2c5cb",background:"#fff",color:"#241b22",borderRadius:10,padding:"10px",font:"inherit"};
export function SalonBookShowcase({ config, clientName = "Your Business" }: { config:ProductConfig; clientName?:string }) {
 const [appointments,setAppointments]=usePersistentState<SalonAppointment[]>(salonBookingKey(clientName),[]);
 const [stylists,setStylists]=usePersistentState<string[]>(salonTeamKey(clientName),[]);
 const [stylistDraft,setStylistDraft]=useState("");
 const [tab,setTab]=useState<"Appointments"|"Calendar"|"Team"|"Clients">("Appointments");
 const [stateFilter,setStateFilter]=useState<"all"|SalonAppointment["status"]>("all");
 const visible=useMemo(()=>appointments.filter((a)=>stateFilter==="all"||a.status===stateFilter).sort((a,b)=>a.date.localeCompare(b.date)),[appointments,stateFilter]);
 const uniqueClients=useMemo(()=>new Set(appointments.map((a)=>a.phone)).size,[appointments]);
 const update=(id:string,status:SalonAppointment["status"])=>setAppointments((current)=>current.map((a)=>a.id===id?{...a,status}:a));
 return <section style={{marginTop:22,display:"grid",gap:14,color:"#241b22"}}>
  <div style={{background:"#fff5f7",border:"1px solid #f1d8e1",borderRadius:19,padding:19}}>
   <span style={{fontSize:11,color:config.experience.accent,fontWeight:900,letterSpacing:1.1}}>SALONBOOK OPERATIONS · LOCAL DEMO</span>
   <h2 style={{margin:"9px 0",fontSize:25}}>Appointments and studio planning</h2>
   <p style={{fontSize:13,color:"#695d66",margin:0,lineHeight:1.65}}>Requests for <strong>{clientName}</strong> are stored in this browser only and are not confirmed customer bookings. Open its public website on the same device to test an enquiry.</p>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,175px),1fr))",gap:10}}>
   {[[ "Requests",appointments.length,CalendarDays ],["To contact",appointments.filter((a)=>a.status==="Requested").length,Clock3],["Confirmed",appointments.filter((a)=>a.status==="Confirmed").length,CheckCircle2],["Clients",uniqueClients,Users]].map(([label,value,Icon])=>{const I=Icon as typeof CalendarDays;return <div key={String(label)} style={{padding:18,border:"1px solid #eee1e7",background:"#fff",borderRadius:16}}><I color={config.experience.accent} size={20}/><div style={{fontSize:12,color:"#73616a",marginTop:7}}>{String(label)}</div><strong style={{fontSize:26}}>{String(value)}</strong></div>})}
  </div>
  <nav style={{display:"flex",flexWrap:"wrap",gap:8}} aria-label="Salon operations">{(["Appointments","Calendar","Team","Clients"] as const).map((name)=><button type="button" key={name} onClick={()=>setTab(name)} aria-pressed={tab===name} style={{border:"1px solid #e5d5dd",borderRadius:22,padding:"10px 14px",background:tab===name?"#9e335f":"#fff",color:tab===name?"#fff":"#241b22",fontWeight:800,cursor:"pointer"}}>{name}</button>)}</nav>
  {tab==="Appointments"||tab==="Calendar"?<div style={{display:"grid",gap:10}}>
   <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}><h3 style={{margin:0}}>{tab==="Calendar"?"Requests by preferred date":"Appointment requests"}</h3><select value={stateFilter} onChange={(e)=>setStateFilter(e.target.value as typeof stateFilter)} style={{...field,width:"auto"}}><option value="all">All statuses</option>{states.map((s)=><option key={s}>{s}</option>)}</select></div>
   {visible.length===0?<p style={{background:"#fff",padding:20,borderRadius:14}}>No local appointment requests yet. The public website does not sync across devices.</p>:null}
   {visible.map((a)=><article key={a.id} style={{background:"#fff",border:"1px solid #e9dce2",borderRadius:16,padding:16,minWidth:0}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}><div><strong>{a.clientName}</strong><div style={{fontSize:12,color:"#675b64"}}>{a.id} · {a.service}</div></div><span style={{fontSize:12,fontWeight:800,color:"#9e335f"}}>{a.date} {a.time}</span></div>
    <p style={{fontSize:12,color:"#675b64",overflowWrap:"anywhere"}}>Phone: {a.phone}{a.email?" · "+a.email:""} · {a.stylist||"Any stylist"}{a.notes?" · "+a.notes:""}</p>
    <label style={{fontSize:12,display:"grid",gap:6,maxWidth:240}}>Progress / approval<select style={field} value={a.status} onChange={(e)=>update(a.id,e.target.value as SalonAppointment["status"])}>{states.map((s)=><option key={s}>{s}</option>)}</select></label>
   </article>)}
  </div>:null}
  {tab==="Team"?<div style={{border:"1px solid #eee1e7",padding:18,borderRadius:17,background:"#fff"}}><h3>Team roster</h3><form style={{display:"flex",gap:9,flexWrap:"wrap"}} onSubmit={(e)=>{e.preventDefault();const v=stylistDraft.trim();if(v&&!stylists.includes(v))setStylists((xs)=>[...xs,v]);setStylistDraft("");}}><input style={{...field,flex:"1 1 160px"}} placeholder="Stylist or barber name" value={stylistDraft} onChange={(e)=>setStylistDraft(e.target.value)}/><button style={{border:0,borderRadius:10,padding:"10px 16px",background:"#9e335f",color:"#fff",fontWeight:800}}>Add team member</button></form>{stylists.map((x)=><p key={x}>{x}</p>)}</div>:null}
  {tab==="Clients"?<div style={{border:"1px solid #eee1e7",padding:18,borderRadius:17,background:"#fff"}}><h3>Client overview</h3>{Array.from(new Map(appointments.map((a)=>[a.phone,a])).values()).map((a)=><p key={a.phone} style={{overflowWrap:"anywhere"}}>{a.clientName} · {a.phone}</p>)}{appointments.length===0?<p>No client requests yet.</p>:null}</div>:null}
  <p style={{fontSize:12,color:"#786b73",lineHeight:1.7,margin:0}}>Demonstration only. This local workspace has no staff authentication, live availability, backend, notifications or payments. Do not use it to manage real customer records.</p>
 </section>;
}
