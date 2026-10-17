"use client";

import { useMemo, useState } from "react";

export function ExploreBWPlanForm({clientName}:{clientName:string}){
  const [intent,setIntent]=useState("Wildlife & safari");
  const [start,setStart]=useState("Maun");
  const [length,setLength]=useState("4–6 days");
  const [travellers,setTravellers]=useState(2);
  const [dates,setDates]=useState("Flexible");
  const [comfort,setComfort]=useState("Comfortable / mid-range");
  const [notes,setNotes]=useState("");
  const [prepared,setPrepared]=useState(false);

  const summary=useMemo(()=>[
    intent,
    start+" start",
    length,
    travellers+" traveller"+(travellers===1?"":"s"),
    dates,
    comfort
  ].join(" · "),[intent,start,length,travellers,dates,comfort]);

  if(prepared){
    return <div style={{background:"#fff",border:"1px solid #d9d1c1",padding:22}}>
      <p style={{fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.3,color:"#a45f2a"}}>Enquiry prepared</p>
      <h2>That is enough to start a real conversation.</h2>
      <p style={{color:"#607269",lineHeight:1.7}}>{summary}</p>
      {notes?<p style={{color:"#607269",lineHeight:1.7}}>Notes: {notes}</p>:null}
      <p style={{fontSize:12,color:"#7d8b83"}}>This showcase does not transmit the enquiry. A commissioned site can send it to {clientName}&apos;s chosen email/workspace.</p>
      <button onClick={()=>setPrepared(false)} style={secondary}>Edit plan</button>
    </div>;
  }

  return <div style={{display:"grid",gap:15}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12}}>
      <Field label="What kind of trip do you want?"><select value={intent} onChange={(e)=>setIntent(e.target.value)} style={input}><option>Wildlife & safari</option><option>Okavango water experience</option><option>Family safari</option><option>Photography</option><option>Short Botswana extension</option><option>Culture & nature</option></select></Field>
      <Field label="Preferred starting point"><select value={start} onChange={(e)=>setStart(e.target.value)} style={input}><option>Maun</option><option>Kasane</option><option>Gaborone / advise me</option><option>Flexible</option></select></Field>
      <Field label="Trip length"><select value={length} onChange={(e)=>setLength(e.target.value)} style={input}><option>1–3 days</option><option>4–6 days</option><option>7–10 days</option><option>10+ days</option></select></Field>
      <Field label="Travellers"><input type="number" min={1} max={20} value={travellers} onChange={(e)=>setTravellers(Math.max(1,Number(e.target.value)))} style={input}/></Field>
      <Field label="Dates"><select value={dates} onChange={(e)=>setDates(e.target.value)} style={input}><option>Flexible</option><option>I know my dates</option><option>Within 1–3 months</option><option>Within 4–6 months</option><option>Planning further ahead</option></select></Field>
      <Field label="Comfort"><select value={comfort} onChange={(e)=>setComfort(e.target.value)} style={input}><option>Comfortable / mid-range</option><option>Budget / camping</option><option>Luxury</option><option>Mix it for me</option></select></Field>
    </div>
    <Field label="Anything important to know?"><textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Children's ages, accessibility, interests, dietary needs, preferred pace…" style={{...input,minHeight:120}}/></Field>
    <button onClick={()=>setPrepared(true)} style={{border:0,background:"#183126",color:"#fff",padding:"13px 16px",fontWeight:900,width:"fit-content",borderRadius:999}}>Prepare my safari enquiry</button>
  </div>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label style={{display:"grid",gap:6,fontSize:11,fontWeight:850,color:"#40594e"}}>{label}{children}</label>}
const input:React.CSSProperties={width:"100%",border:"1px solid #cbc1b0",background:"#fff",padding:12,borderRadius:3,font:"inherit"};
const secondary:React.CSSProperties={border:"1px solid #b8ae9c",background:"#fff",padding:"9px 12px",fontWeight:850,borderRadius:999};
