"use client";

import { useState } from "react";

type Result={
  reference:string;
  status:string;
  route:string;
  lastUpdate:string;
  next:string;
};

const demo:Record<string,Result>={
  "MT-601":{reference:"MT-601",status:"In transit",route:"Gaborone → Molepolole",lastUpdate:"Departed Gaborone hub · 14:10",next:"Estimated delivery today"},
  "MT-602":{reference:"MT-602",status:"Delivered",route:"Gaborone → Tlokweng",lastUpdate:"Proof of delivery captured · 11:42",next:"Delivery complete"},
  "MT-MINE-07":{reference:"MT-MINE-07",status:"On site",route:"Gaborone → Jwaneng",lastUpdate:"Vehicle checked in at site gate · 09:18",next:"Awaiting offload confirmation"},
};

export function MoveTrackTrackingDemo(){
  const [reference,setReference]=useState("MT-601");
  const [result,setResult]=useState<Result|null>(null);
  return <div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <input value={reference} onChange={(e)=>setReference(e.target.value.toUpperCase())} placeholder="Shipment / job reference" style={{flex:"1 1 260px",border:"1px solid #cfd5dd",padding:12,borderRadius:4,font:"inherit"}}/>
      <button onClick={()=>setResult(demo[reference.trim()]??{reference:reference.trim()||"—",status:"Reference not found",route:"Demo references: MT-601, MT-602, MT-MINE-07",lastUpdate:"No live shipment data is connected",next:"Contact the operator for assistance"})} style={{border:0,background:"#1d4ed8",color:"#fff",padding:"11px 15px",fontWeight:900,borderRadius:4}}>Track</button>
    </div>
    {result?<article style={{marginTop:16,background:"#fff",border:"1px solid #d7dce1",padding:18}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><div style={{fontSize:10,color:"#667085",fontWeight:900}}>REFERENCE</div><strong style={{fontSize:20}}>{result.reference}</strong></div><span style={{fontWeight:900,color:result.status==="Delivered"?"#027a48":"#1d4ed8"}}>{result.status}</span></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10,marginTop:16}}>
        {([["Route",result.route],["Last update",result.lastUpdate],["Next",result.next]] as Array<[string,string]>).map(([label,value])=><div key={label}><div style={{fontSize:10,color:"#98a2b3",fontWeight:900}}>{label.toUpperCase()}</div><div style={{fontSize:12,fontWeight:800,marginTop:3}}>{value}</div></div>)}
      </div>
      <p style={{fontSize:10,color:"#98a2b3",marginBottom:0}}>Demo tracking data only. A commissioned version can bind this surface to the operator&apos;s actual shipment/job system.</p>
    </article>:null}
  </div>;
}
