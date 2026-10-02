"use client";

import { useState } from "react";
import { taxReturnTypes, taxWorkflowStages } from "@bokang/domain-data";

type ReturnItem = { id:string; client:string; type:string; period:string; stage:string; days:number };

const starter: ReturnItem[] = [
  {id:"TF-301",client:"Kgetsi Holdings",type:"Company income tax",period:"2026",stage:"Preparation",days:18},
  {id:"TF-302",client:"Tshireletso Retail",type:"VAT",period:"Sep 2026",stage:"Review",days:5},
  {id:"TF-303",client:"N. Moagi",type:"Individual income tax",period:"2026",stage:"Awaiting documents",days:11},
];

export function TaxFlowShowcase(){
  const [returns,setReturns]=useState(starter);
  const [client,setClient]=useState("");
  const [type,setType]=useState<(typeof taxReturnTypes)[number]>("Company income tax");
  const [period,setPeriod]=useState("2026");
  const [view,setView]=useState<"returns"|"new"|"checklist"|"analytics">("returns");

  function addReturn(){
    if(!client.trim()) return;
    setReturns((current)=>[{id:`TF-${300+current.length+1}`,client:client.trim(),type,period,stage:"Questionnaire sent",days:30},...current]);
    setClient("");
    setView("returns");
  }

  return <section style={{marginTop:28,display:"grid",gap:18}}>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      {([["returns","Returns"],["new","Start return"],["checklist","Checklist"],["analytics","Analytics"]] as const).map(([key,label])=><button key={key} onClick={()=>setView(key)} style={{border:"1px solid #d0d5dd",background:view===key?"#101827":"#fff",color:view===key?"#fff":"#344054",borderRadius:999,padding:"9px 14px",fontWeight:800}}>{label}</button>)}
    </div>

    {view==="returns" && <div style={{display:"grid",gap:12}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>
        {[["Returns in progress",returns.length],["Ready for review",returns.filter(x=>x.stage==="Review").length],["Awaiting documents",returns.filter(x=>x.stage==="Awaiting documents").length],["Due ≤ 7 days",returns.filter(x=>x.days<=7).length]].map(([l,v])=><div key={String(l)} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:18,padding:16}}><div style={{fontSize:12,color:"#667085",fontWeight:800}}>{l}</div><div style={{fontSize:28,fontWeight:900}}>{v}</div></div>)}
      </div>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,overflow:"hidden"}}>
        {returns.map((item)=><div key={item.id} style={{padding:16,borderBottom:"1px solid #f0f2f5",display:"grid",gap:7}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
            <div><strong>{item.client}</strong><div style={{fontSize:12,color:"#667085"}}>{item.id} · {item.type} · {item.period}</div></div>
            <select value={item.stage} onChange={(e)=>setReturns((current)=>current.map((x)=>x.id===item.id?{...x,stage:e.target.value}:x))} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:"8px 10px"}}>{taxWorkflowStages.map((x)=><option key={x}>{x}</option>)}</select>
          </div>
          <div style={{fontSize:12,color:item.days<=7?"#b42318":"#667085",fontWeight:750}}>{item.days} days to target deadline</div>
        </div>)}
      </div>
    </div>}

    {view==="new" && <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,padding:20}}>
      <h2 style={{marginTop:0}}>Start a tax workflow</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
        <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Client<input value={client} onChange={(e)=>setClient(e.target.value)} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}/></label>
        <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Return type<select value={type} onChange={(e)=>setType(e.target.value as typeof type)} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}>{taxReturnTypes.map((x)=><option key={x}>{x}</option>)}</select></label>
        <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Tax period<input value={period} onChange={(e)=>setPeriod(e.target.value)} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}/></label>
      </div>
      <button onClick={addReturn} style={{marginTop:16,border:0,borderRadius:12,padding:"12px 18px",background:"#2563eb",color:"#fff",fontWeight:850}}>Create workflow</button>
    </div>}

    {view==="checklist" && <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,padding:20}}>
      <h2 style={{marginTop:0}}>Preparation checklist</h2>
      {["Questionnaire completed","Identity / company documents","Income schedules","Expense support","Bank statements","Prior filing reference","Reviewer sign-off"].map((x,i)=><label key={x} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid #f0f2f5"}}><input type="checkbox" defaultChecked={i<4}/><span>{x}</span></label>)}
    </div>}

    {view==="analytics" && <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,padding:20}}>
      <h2 style={{marginTop:0}}>Tax operations snapshot</h2>
      <p style={{color:"#667085"}}>Demo metrics for turnaround, completeness and workload visibility.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
        {[["Avg turnaround","8.4d"],["On-time","94%"],["Complete packs","72%"],["In review","6"]].map(([l,v])=><div key={l} style={{padding:16,border:"1px solid #e5e7eb",borderRadius:16}}><div style={{fontSize:12,color:"#667085"}}>{l}</div><strong style={{fontSize:24}}>{v}</strong></div>)}
      </div>
    </div>}
  </section>;
}
