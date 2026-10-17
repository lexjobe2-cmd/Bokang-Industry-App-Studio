"use client";

import { useMemo, useState } from "react";

type State="ready"|"attention"|"unsure";

const checks=[
  {key:"registration",title:"Registration",question:"Are the taxpayer's registrations/profile details current for the taxes that apply?"},
  {key:"records",title:"Records",question:"Are the supporting schedules, reconciliations and source records reasonably complete?"},
  {key:"returns",title:"Returns",question:"Are required returns known and their preparation/submission status visible?"},
  {key:"payments",title:"Payments",question:"Are tax payments and outstanding balances tracked and reconciled?"},
  {key:"clearance",title:"Clearance & correspondence",question:"Are tax-clearance needs, notices, objections or BURS correspondence under control?"}
] as const;

export function TaxReadinessMap(){
  const [taxpayer,setTaxpayer]=useState("Company / business");
  const [states,setStates]=useState<Record<string,State>>({});

  const result=useMemo(()=>{
    const attention=checks.filter((item)=>states[item.key]==="attention").map((item)=>item.title);
    const unsure=checks.filter((item)=>states[item.key]==="unsure").map((item)=>item.title);
    const ready=checks.filter((item)=>states[item.key]==="ready").length;
    return {attention,unsure,ready};
  },[states]);
  const complete=Object.keys(states).length===checks.length;

  return <div style={{background:"#fff",border:"1px solid #dbe0ea",padding:20}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"end",flexWrap:"wrap"}}>
      <div><p style={{margin:0,fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.4,color:"#4f46e5"}}>Tax Readiness Map</p><h3 style={{fontSize:27,margin:"6px 0"}}>Where is the uncertainty?</h3></div>
      <select value={taxpayer} onChange={(e)=>setTaxpayer(e.target.value)} style={{border:"1px solid #d5dbea",padding:"9px 10px",background:"#fff",font:"inherit"}}><option>Company / business</option><option>Employer</option><option>Individual</option><option>Not sure</option></select>
    </div>
    <p style={{fontSize:12,color:"#697386",lineHeight:1.65}}>This maps process readiness only. It does not calculate liability, determine filing obligations or provide tax advice.</p>

    <div style={{display:"grid",gap:12,marginTop:18}}>
      {checks.map((item)=><article key={item.key} style={{borderTop:"1px solid #e3e7ef",paddingTop:12}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><strong>{item.title}</strong><div style={{fontSize:11,color:"#697386",marginTop:3,maxWidth:620}}>{item.question}</div></div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {(["ready","attention","unsure"] as const).map((value)=><button key={value} onClick={()=>setStates((current)=>({...current,[item.key]:value}))} style={{border:"1px solid #d5dbea",background:states[item.key]===value?(value==="ready"?"#ecfdf3":value==="attention"?"#fff4e5":"#eef2ff"):"#fff",color:states[item.key]===value?(value==="ready"?"#027a48":value==="attention"?"#b54708":"#4338ca"):"#59657c",padding:"7px 9px",fontWeight:850,fontSize:10}}>{value==="ready"?"READY":value==="attention"?"NEEDS ATTENTION":"NOT SURE"}</button>)}
        </div></div>
      </article>)}
    </div>

    {complete?<div style={{marginTop:18,background:"#f7f8fc",borderLeft:"4px solid #4f46e5",padding:16}}>
      <strong>{taxpayer}: {result.ready}/5 areas marked ready</strong>
      {result.attention.length?<p style={{fontSize:12,color:"#697386",lineHeight:1.65,marginBottom:5}}>Needs attention: {result.attention.join(", ")}.</p>:null}
      {result.unsure.length?<p style={{fontSize:12,color:"#697386",lineHeight:1.65,marginBottom:5}}>Clarify first: {result.unsure.join(", ")}.</p>:null}
      <p style={{fontSize:11,color:"#7d8799",marginBottom:0}}>Use this result to frame a conversation with a tax professional and verify current filing/payment rules with BURS.</p>
    </div>:<div style={{marginTop:14,fontSize:11,color:"#8b94a5"}}>{Object.keys(states).length}/5 areas mapped</div>}
  </div>;
}
