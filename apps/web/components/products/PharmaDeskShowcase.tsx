"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@bokang/persistence";
import { pharmacyDispenseStatuses, pharmacyMedicineForms, pharmacyPurchaseStatuses, pharmacyStockStates } from "@bokang/domain-data";

type Medicine={id:string;name:string;form:string;batch:string;qty:number;reorder:number;expiry:string;supplier:string;state:string};
const starter:Medicine[]=[
{id:"MED-001",name:"Paracetamol 500mg",form:"Tablet",batch:"P500-A24",qty:420,reorder:120,expiry:"2027-08",supplier:"Delta Medical Supplies",state:"In stock"},
{id:"MED-002",name:"Amoxicillin 500mg",form:"Capsule",batch:"AMX-771",qty:48,reorder:80,expiry:"2027-01",supplier:"HealthLink Botswana",state:"Low stock"},
{id:"MED-003",name:"Salbutamol Inhaler",form:"Inhaler",batch:"SAL-2026",qty:22,reorder:20,expiry:"2026-12",supplier:"Delta Medical Supplies",state:"Near expiry"},
];
type Dispense={id:string;patient:string;medicine:string;qty:number;status:string};
const dispensing:Dispense[]=[
{id:"RX-810",patient:"K. Tiro",medicine:"Paracetamol 500mg",qty:20,status:"Prepared"},
{id:"RX-811",patient:"N. Motsamai",medicine:"Amoxicillin 500mg",qty:21,status:"Pending prescription review"},
];

export function PharmaDeskShowcase(){
 const [medicines,setMedicines]=usePersistentState("bokang-studio.pharma-desk.medicines.v1", starter);
 const [dispenses,setDispenses]=usePersistentState("bokang-studio.pharma-desk.dispensing.v1", dispensing);
 const [view,setView]=useState<"inventory"|"add"|"dispense"|"orders">("inventory");
 const [name,setName]=useState(""); const [form,setForm]=useState<(typeof pharmacyMedicineForms)[number]>("Tablet"); const [qty,setQty]=useState("0"); const [batch,setBatch]=useState("");
 const stats=useMemo(()=>({low:medicines.filter(x=>x.qty<=x.reorder).length,expiring:medicines.filter(x=>x.state==="Near expiry").length,total:medicines.reduce((n,x)=>n+x.qty,0)}),[medicines]);
 function addMedicine(){if(!name.trim())return;setMedicines(c=>[{id:`MED-${String(c.length+1).padStart(3,"0")}`,name:name.trim(),form,batch:batch||"Pending",qty:Number(qty)||0,reorder:20,expiry:"Not set",supplier:"Unassigned",state:"In stock"},...c]);setName("");setBatch("");setQty("0");setView("inventory");}
 return <section style={{marginTop:28,display:"grid",gap:18}}>
  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{([["inventory","Medicines"],["add","Add medicine"],["dispense","Dispensing"],["orders","Purchase orders"]] as const).map(([k,l])=><button key={k} onClick={()=>setView(k)} style={{border:"1px solid #d0d5dd",background:view===k?"#101827":"#fff",color:view===k?"#fff":"#344054",borderRadius:999,padding:"9px 14px",fontWeight:800}}>{l}</button>)}</div>
  {view==="inventory"&&<div style={{display:"grid",gap:12}}>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>{[["Stock units",stats.total],["Low stock",stats.low],["Near expiry",stats.expiring],["Dispensing queue",dispenses.length]].map(([l,v])=><div key={String(l)} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:18,padding:16}}><div style={{fontSize:12,color:"#667085",fontWeight:800}}>{l}</div><strong style={{fontSize:28}}>{v}</strong></div>)}</div>
   <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,overflow:"hidden"}}>{medicines.map(m=><div key={m.id} style={{padding:16,borderBottom:"1px solid #f0f2f5",display:"grid",gap:7}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><strong>{m.name}</strong><div style={{fontSize:12,color:"#667085"}}>{m.form} · batch {m.batch} · expires {m.expiry}</div></div><select value={m.state} onChange={e=>setMedicines(c=>c.map(x=>x.id===m.id?{...x,state:e.target.value}:x))} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:"8px 10px"}}>{pharmacyStockStates.map(x=><option key={x}>{x}</option>)}</select></div>
    <div style={{display:"flex",gap:16,flexWrap:"wrap",fontSize:12,color:m.qty<=m.reorder?"#b42318":"#667085"}}><span>{m.qty} units</span><span>Reorder at {m.reorder}</span><span>{m.supplier}</span></div>
   </div>)}</div>
  </div>}
  {view==="add"&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,padding:20}}><h2 style={{marginTop:0}}>Add medicine / batch</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:14}}>
   <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Medicine<input value={name} onChange={e=>setName(e.target.value)} placeholder="Generic or brand name" style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}/></label>
   <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Form<select value={form} onChange={e=>setForm(e.target.value as typeof form)} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}>{pharmacyMedicineForms.map(x=><option key={x}>{x}</option>)}</select></label>
   <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Batch<input value={batch} onChange={e=>setBatch(e.target.value)} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}/></label>
   <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800}}>Quantity<input inputMode="numeric" value={qty} onChange={e=>setQty(e.target.value)} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:11}}/></label>
  </div><button onClick={addMedicine} style={{marginTop:16,border:0,borderRadius:12,padding:"12px 18px",background:"#2563eb",color:"#fff",fontWeight:850}}>Add to inventory</button></div>}
  {view==="dispense"&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,overflow:"hidden"}}>{dispenses.map(d=><div key={d.id} style={{padding:16,borderBottom:"1px solid #f0f2f5",display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><strong>{d.patient}</strong><div style={{fontSize:12,color:"#667085"}}>{d.id} · {d.medicine} · Qty {d.qty}</div></div><select value={d.status} onChange={e=>setDispenses(c=>c.map(x=>x.id===d.id?{...x,status:e.target.value}:x))} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:"8px 10px"}}>{pharmacyDispenseStatuses.map(x=><option key={x}>{x}</option>)}</select></div>)}</div>}
  {view==="orders"&&<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:22,padding:20}}><h2 style={{marginTop:0}}>Supplier purchase orders</h2>{[["PO-118","HealthLink Botswana","Amoxicillin 500mg","Ordered"],["PO-119","Delta Medical Supplies","Salbutamol Inhaler","Approved"]].map(([id,supplier,item,status])=><div key={id} style={{padding:"12px 0",borderBottom:"1px solid #f0f2f5",display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><strong>{id} · {supplier}</strong><div style={{fontSize:12,color:"#667085"}}>{item}</div></div><select defaultValue={status} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:"8px 10px"}}>{pharmacyPurchaseStatuses.map(x=><option key={x}>{x}</option>)}</select></div>)}</div>}
 </section>;
}
