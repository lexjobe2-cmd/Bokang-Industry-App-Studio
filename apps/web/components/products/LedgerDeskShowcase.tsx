"use client";

import { useMemo, useState } from "react";
import { accountingDocumentTypes, accountingEngagementTypes, botswanaPlaces } from "@bokang/domain-data";

type Engagement = {
  id: string;
  client: string;
  type: string;
  location: string;
  status: string;
  missingDocs: number;
};

const starter: Engagement[] = [
  { id: "LD-101", client: "Kgetsi Holdings", type: "Monthly bookkeeping", location: "Gaborone", status: "Active", missingDocs: 2 },
  { id: "LD-102", client: "Metsi Foods", type: "Payroll", location: "Mogoditshane", status: "Awaiting documents", missingDocs: 4 },
  { id: "LD-103", client: "North Gate Traders", type: "Annual financial statements", location: "Francistown", status: "Review", missingDocs: 0 },
];

const statuses = ["Onboarding", "Active", "Awaiting documents", "Review", "Ready", "Completed"] as const;

export function LedgerDeskShowcase() {
  const [items, setItems] = useState(starter);
  const [client, setClient] = useState("");
  const [type, setType] = useState<(typeof accountingEngagementTypes)[number]>("Monthly bookkeeping");
  const [location, setLocation] = useState<(typeof botswanaPlaces)[number]>("Gaborone");
  const [view, setView] = useState<"work"|"new"|"documents"|"analytics">("work");
  const stats = useMemo(() => ({
    active: items.filter((x) => x.status === "Active").length,
    missing: items.reduce((n, x) => n + x.missingDocs, 0),
  }), [items]);

  function addClient() {
    if (!client.trim()) return;
    setItems((current) => [{
      id: `LD-${100 + current.length + 1}`,
      client: client.trim(),
      type,
      location,
      status: "Onboarding",
      missingDocs: 3,
    }, ...current]);
    setClient("");
    setView("work");
  }

  return <section style={{marginTop:28,display:"grid",gap:18}}>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      {([["work","Engagements"],["new","New client"],["documents","Documents"],["analytics","Analytics"]] as const).map(([key,label]) =>
        <button key={key} onClick={()=>setView(key)} style={{border:"1px solid #d0d5dd",background:view===key?"#101827":"#fff",color:view===key?"#fff":"#344054",borderRadius:999,padding:"9px 14px",fontWeight:800}}>{label}</button>
      )}
    </div>

    {view==="work" && <>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
        {[["Clients",items.length],["Active engagements",stats.active],["Missing documents",stats.missing],["Deadlines this week",5]].map(([label,value]) =>
          <div key={String(label)} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:18,padding:16}}><div style={{fontSize:12,color:"#667085",fontWeight:800}}>{label}</div><div style={{fontSize:28,fontWeight:900,marginTop:6}}>{value}</div></div>
        )}
      </div>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,overflow:"hidden"}}>
        {items.map((item)=><div key={item.id} style={{padding:16,borderBottom:"1px solid #f0f2f5",display:"grid",gap:7}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
            <div><strong>{item.client}</strong><div style={{fontSize:12,color:"#667085"}}>{item.id} · {item.type} · {item.location}</div></div>
            <select value={item.status} onChange={(e)=>setItems((current)=>current.map((x)=>x.id===item.id?{...x,status:e.target.value}:x))} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:"8px 10px"}}>
              {statuses.map((status)=><option key={status}>{status}</option>)}
            </select>
          </div>
          <div style={{fontSize:13,color:item.missingDocs?"#b54708":"#027a48",fontWeight:750}}>{item.missingDocs ? `${item.missingDocs} documents still required` : "Document pack complete"}</div>
        </div>)}
      </div>
    </>}

    {view==="new" && <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,padding:20}}>
      <h2 style={{marginTop:0}}>Onboard accounting client</h2>
      <p style={{color:"#667085"}}>Use structured engagement and Botswana-location selectors to reduce repetitive typing.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
        <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Client name<input value={client} onChange={(e)=>setClient(e.target.value)} placeholder="Business or individual" style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}/></label>
        <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Engagement<select value={type} onChange={(e)=>setType(e.target.value as typeof type)} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}>{accountingEngagementTypes.map((x)=><option key={x}>{x}</option>)}</select></label>
        <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Location<select value={location} onChange={(e)=>setLocation(e.target.value as typeof location)} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}>{botswanaPlaces.map((x)=><option key={x}>{x}</option>)}</select></label>
      </div>
      <button onClick={addClient} style={{marginTop:16,border:0,borderRadius:12,padding:"12px 18px",background:"#2563eb",color:"#fff",fontWeight:850}}>Create client workspace</button>
    </div>}

    {view==="documents" && <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,padding:20}}>
      <h2 style={{marginTop:0}}>Document collection</h2>
      <p style={{color:"#667085"}}>Designed for client-owned Drive, OneDrive or SharePoint storage.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{accountingDocumentTypes.map((x)=><span key={x} style={{padding:"8px 11px",borderRadius:999,background:"#f2f4f7",fontSize:12,fontWeight:750}}>{x}</span>)}</div>
    </div>}

    {view==="analytics" && <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,padding:20}}>
      <h2 style={{marginTop:0}}>Practice performance</h2>
      {[["Monthly work completed",78],["Document collection",64],["On-time deadlines",92],["Client response rate",71]].map(([label,value])=><div key={String(label)} style={{marginTop:14}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:800}}><span>{label}</span><span>{value}%</span></div>
        <div style={{height:9,background:"#eef2f6",borderRadius:999,marginTop:6}}><div style={{height:"100%",width:`${value}%`,background:"#2563eb",borderRadius:999}}/></div>
      </div>)}
    </div>}
  </section>;
}
