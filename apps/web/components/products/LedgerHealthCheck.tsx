"use client";

import { useMemo, useState } from "react";

const questions=[
  "We know our current bank position and major cash commitments.",
  "Our books are kept up to date during the month.",
  "Bank / balance-sheet reconciliations are completed regularly.",
  "Management receives useful monthly financial information.",
  "Payroll and recurring compliance dates are visible and controlled.",
  "Missing client/supplier documents do not regularly delay month-end."
];

export function LedgerHealthCheck(){
  const [answers,setAnswers]=useState<Record<number,"yes"|"sometimes"|"no">>({});
  const score=useMemo(()=>questions.reduce((sum,_q,index)=>sum+(answers[index]==="yes"?2:answers[index]==="sometimes"?1:0),0),[answers]);
  const complete=Object.keys(answers).length===questions.length;
  const max=questions.length*2;
  const pct=Math.round((score/max)*100);

  const result=pct>=80
    ? "Your finance rhythm looks relatively controlled. The next conversation may be about better insight and forecasting."
    : pct>=50
      ? "The basics are partly working, but month-end discipline and reporting may still depend too much on manual follow-up."
      : "There may be a strong case for first fixing the monthly finance process before adding more reporting or advisory.";

  return <div style={{background:"#fff",border:"1px solid #d7e0dd",padding:20}}>
    <p style={{fontSize:10,fontWeight:900,textTransform:"uppercase",letterSpacing:1.4,color:"#0f766e"}}>Two-minute finance health check</p>
    <h3 style={{fontSize:26,margin:"6px 0 8px"}}>How predictable is your month-end?</h3>
    <p style={{fontSize:12,color:"#657a75",lineHeight:1.65}}>This is a conversation starter, not an audit or professional conclusion.</p>
    <div style={{display:"grid",gap:12,marginTop:18}}>
      {questions.map((q,index)=><article key={q} style={{borderTop:"1px solid #dfe6e4",paddingTop:12}}>
        <strong style={{fontSize:12}}>{q}</strong>
        <div style={{display:"flex",gap:7,marginTop:9,flexWrap:"wrap"}}>
          {(["yes","sometimes","no"] as const).map((value)=><button key={value} onClick={()=>setAnswers((current)=>({...current,[index]:value}))} style={{border:"1px solid #cfdad7",background:answers[index]===value?"#dff4ef":"#fff",color:answers[index]===value?"#0f766e":"#526862",padding:"7px 10px",fontWeight:850,fontSize:11,borderRadius:999}}>{value==="yes"?"Yes":value==="sometimes"?"Sometimes":"No"}</button>)}
        </div>
      </article>)}
    </div>
    {complete?<div style={{marginTop:18,background:"#eef8f5",padding:16,borderLeft:"3px solid #0f766e"}}><strong>{pct}% process-readiness signal</strong><p style={{fontSize:12,color:"#526862",lineHeight:1.65,marginBottom:0}}>{result}</p></div>:<div style={{marginTop:14,fontSize:11,color:"#83928e"}}>{Object.keys(answers).length}/{questions.length} answered</div>}
  </div>;
}
