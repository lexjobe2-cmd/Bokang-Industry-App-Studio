"use client";

import { useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { usePersistentState } from "@bokang/persistence";
import { pharmacyDispenseStatuses, pharmacyMedicineForms, pharmacyPurchaseStatuses, pharmacyStockStates } from "@bokang/domain-data";
import { BarcodeScanner } from "../shared/BarcodeScanner";

type Medicine = {
  id: string;
  code: string;
  name: string;
  form: string;
  batch: string;
  qty: number;
  reorder: number;
  expiry: string;
  supplier: string;
  state: string;
};

const starter: Medicine[] = [
  {id:"MED-001",code:"6001000000011",name:"Paracetamol 500mg",form:"Tablet",batch:"P500-A24",qty:420,reorder:120,expiry:"2027-08",supplier:"Delta Medical Supplies",state:"In stock"},
  {id:"MED-002",code:"6001000000028",name:"Amoxicillin 500mg",form:"Capsule",batch:"AMX-771",qty:48,reorder:80,expiry:"2027-01",supplier:"HealthLink Botswana",state:"Low stock"},
  {id:"MED-003",code:"6001000000035",name:"Salbutamol Inhaler",form:"Inhaler",batch:"SAL-2026",qty:22,reorder:20,expiry:"2026-12",supplier:"Delta Medical Supplies",state:"Near expiry"},
];

type Dispense = {id:string;patient:string;medicine:string;qty:number;status:string};
const dispensing: Dispense[] = [
  {id:"RX-810",patient:"K. Tiro",medicine:"Paracetamol 500mg",qty:20,status:"Prepared"},
  {id:"RX-811",patient:"N. Motsamai",medicine:"Amoxicillin 500mg",qty:21,status:"Pending prescription review"},
];

export function PharmaDeskShowcase() {
  const [medicines,setMedicines] = usePersistentState<Medicine[]>("bokang-studio.pharma-desk.medicines.v2", starter);
  const [dispenses,setDispenses] = usePersistentState("bokang-studio.pharma-desk.dispensing.v1", dispensing);
  const [view,setView] = useState<"inventory"|"scan"|"add"|"dispense"|"orders">("inventory");
  const [query,setQuery] = useState("");
  const [selected,setSelected] = useState<string[]>([]);
  const [scanResult,setScanResult] = useState("");
  const [name,setName] = useState("");
  const [form,setForm] = useState<(typeof pharmacyMedicineForms)[number]>("Tablet");
  const [qty,setQty] = useState("0");
  const [batch,setBatch] = useState("");
  const [code,setCode] = useState("");
  const parentRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => ({
    low: medicines.filter((x) => x.qty <= x.reorder).length,
    expiring: medicines.filter((x) => x.state === "Near expiry").length,
    total: medicines.reduce((n,x) => n + x.qty,0)
  }), [medicines]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return medicines;
    return medicines.filter((medicine) =>
      [medicine.name, medicine.code, medicine.batch, medicine.supplier, medicine.state]
        .some((value) => value.toLowerCase().includes(needle))
    );
  }, [medicines, query]);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 76,
    overscan: 8,
  });

  function addMedicine() {
    if (!name.trim()) return;
    setMedicines((current) => [{
      id: `MED-${String(current.length + 1).padStart(3,"0")}`,
      code: code.trim() || `LOCAL-${Date.now()}`,
      name: name.trim(),
      form,
      batch: batch || "Pending",
      qty: Number(qty) || 0,
      reorder: 20,
      expiry: "Not set",
      supplier: "Unassigned",
      state: "In stock",
    }, ...current]);
    setName(""); setBatch(""); setQty("0"); setCode(""); setView("inventory");
  }

  function handleScan(value: string) {
    setScanResult(value);
    setQuery(value);
    const existing = medicines.find((medicine) => medicine.code === value);
    if (!existing) {
      setCode(value);
      setView("add");
    }
  }

  return (
    <section style={{marginTop:28,display:"grid",gap:18}}>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {([
          ["inventory","Medicines"],
          ["scan","Scan"],
          ["add","Add medicine"],
          ["dispense","Dispensing"],
          ["orders","Purchase orders"],
        ] as const).map(([key,label]) => (
          <button key={key} onClick={() => setView(key)} style={{
            border:"1px solid #d0d5dd",
            background:view===key?"#064e3b":"#fff",
            color:view===key?"#fff":"#344054",
            borderRadius:999,padding:"9px 14px",fontWeight:800
          }}>{label}</button>
        ))}
      </div>

      {view==="inventory" ? (
        <div style={{display:"grid",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>
            {[["Stock units",stats.total],["Low stock",stats.low],["Near expiry",stats.expiring],["Dispensing queue",dispenses.length]].map(([label,value]) => (
              <div key={String(label)} style={{background:"#fff",border:"1px solid #d1fae5",borderRadius:18,padding:16}}>
                <div style={{fontSize:12,color:"#667085",fontWeight:800}}>{label}</div>
                <strong style={{fontSize:28}}>{value}</strong>
              </div>
            ))}
          </div>

          <div style={{background:"#fff",border:"1px solid #d1fae5",borderRadius:22,padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <div>
                <strong>Large inventory workspace</strong>
                <div style={{fontSize:12,color:"#667085",marginTop:3}}>Virtualized rows keep the UI responsive as medicine/batch counts grow.</div>
              </div>
              <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search name, barcode, batch, supplier…" style={{minWidth:260,border:"1px solid #d0d5dd",borderRadius:11,padding:10}}/>
            </div>
            {selected.length ? (
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginTop:12,padding:10,borderRadius:12,background:"#ecfdf5"}}>
                <strong style={{fontSize:12}}>{selected.length} selected</strong>
                {["In stock","Low stock","Quarantined","Recalled"].map((state)=>(
                  <button key={state} onClick={()=>{
                    setMedicines((current)=>current.map((item)=>selected.includes(item.id)?{...item,state}:item));
                    setSelected([]);
                  }} style={{border:"1px solid #a7f3d0",background:"#fff",borderRadius:9,padding:"7px 9px",fontSize:11,fontWeight:800}}>
                    Mark {state}
                  </button>
                ))}
                <button onClick={()=>setSelected([])} style={{border:0,background:"transparent",fontSize:11,fontWeight:800}}>Clear</button>
              </div>
            ) : null}

            <div ref={parentRef} style={{height:360,overflow:"auto",marginTop:12,border:"1px solid #eef2f6",borderRadius:14}}>
              <div style={{height:virtualizer.getTotalSize(),width:"100%",position:"relative"}}>
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const medicine = filtered[virtualRow.index];
                  if (!medicine) return null;
                  return (
                    <div key={medicine.id} style={{
                      position:"absolute",
                      top:0,left:0,width:"100%",
                      transform:`translateY(${virtualRow.start}px)`,
                      minHeight:72,padding:"12px 14px",
                      borderBottom:"1px solid #f0f2f5",
                      display:"grid",gap:6,background:selected.includes(medicine.id)?"#f0fdf4":"#fff"
                    }}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
                        <div style={{display:"flex",gap:9,alignItems:"start"}}>
                          <input
                            type="checkbox"
                            checked={selected.includes(medicine.id)}
                            onChange={(e)=>setSelected((current)=>e.target.checked?[...current,medicine.id]:current.filter((id)=>id!==medicine.id))}
                            aria-label={`Select ${medicine.name}`}
                          />
                          <div>
                          <strong>{medicine.name}</strong>
                          <div style={{fontSize:12,color:"#667085"}}>{medicine.code} · {medicine.form} · batch {medicine.batch} · expires {medicine.expiry}</div>
                          </div>
                        </div>
                        <select value={medicine.state} onChange={(e)=>setMedicines((current)=>current.map((item)=>item.id===medicine.id?{...item,state:e.target.value}:item))} style={{border:"1px solid #d0d5dd",borderRadius:10,padding:"7px 9px"}}>
                          {pharmacyStockStates.map((state)=><option key={state}>{state}</option>)}
                        </select>
                      </div>
                      <div style={{display:"flex",gap:14,flexWrap:"wrap",fontSize:11,color:medicine.qty<=medicine.reorder?"#b42318":"#667085"}}>
                        <span>{medicine.qty} units</span><span>Reorder at {medicine.reorder}</span><span>{medicine.supplier}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {view==="scan" ? (
        <div style={{display:"grid",gap:12}}>
          <BarcodeScanner onDetected={handleScan} label="Scan medicine, batch or shelf QR" />
          {scanResult ? <div style={{background:"#fff",border:"1px solid #d1fae5",borderRadius:14,padding:14}}><strong>Last code:</strong> {scanResult}</div> : null}
        </div>
      ) : null}

      {view==="add" ? (
        <div style={{background:"#fff",border:"1px solid #d1fae5",borderRadius:22,padding:20}}>
          <h2 style={{marginTop:0}}>Add medicine / batch</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:14}}>
            <label style={fieldStyle}>Barcode / QR<input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Scan or enter code" style={inputStyle}/></label>
            <label style={fieldStyle}>Medicine<input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Generic or brand name" style={inputStyle}/></label>
            <label style={fieldStyle}>Form<select value={form} onChange={(e)=>setForm(e.target.value as typeof form)} style={inputStyle}>{pharmacyMedicineForms.map((item)=><option key={item}>{item}</option>)}</select></label>
            <label style={fieldStyle}>Batch<input value={batch} onChange={(e)=>setBatch(e.target.value)} style={inputStyle}/></label>
            <label style={fieldStyle}>Quantity<input inputMode="numeric" value={qty} onChange={(e)=>setQty(e.target.value)} style={inputStyle}/></label>
          </div>
          <button onClick={addMedicine} style={{marginTop:16,border:0,borderRadius:12,padding:"12px 18px",background:"#047857",color:"#fff",fontWeight:850}}>Add to inventory</button>
        </div>
      ) : null}

      {view==="dispense" ? (
        <div style={{background:"#fff",border:"1px solid #d1fae5",borderRadius:22,overflow:"hidden"}}>
          {dispenses.map((item)=><div key={item.id} style={{padding:16,borderBottom:"1px solid #f0f2f5",display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
            <div><strong>{item.patient}</strong><div style={{fontSize:12,color:"#667085"}}>{item.id} · {item.medicine} · Qty {item.qty}</div></div>
            <select value={item.status} onChange={(e)=>setDispenses((current)=>current.map((x)=>x.id===item.id?{...x,status:e.target.value}:x))} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:"8px 10px"}}>
              {pharmacyDispenseStatuses.map((status)=><option key={status}>{status}</option>)}
            </select>
          </div>)}
        </div>
      ) : null}

      {view==="orders" ? (
        <div style={{background:"#fff",border:"1px solid #d1fae5",borderRadius:22,padding:20}}>
          <h2 style={{marginTop:0}}>Supplier purchase orders</h2>
          {[["PO-118","HealthLink Botswana","Amoxicillin 500mg","Ordered"],["PO-119","Delta Medical Supplies","Salbutamol Inhaler","Approved"]].map(([id,supplier,item,status])=>(
            <div key={id} style={{padding:"12px 0",borderBottom:"1px solid #f0f2f5",display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
              <div><strong>{id} · {supplier}</strong><div style={{fontSize:12,color:"#667085"}}>{item}</div></div>
              <select defaultValue={status} style={{border:"1px solid #d0d5dd",borderRadius:12,padding:"8px 10px"}}>{pharmacyPurchaseStatuses.map((state)=><option key={state}>{state}</option>)}</select>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

const fieldStyle: React.CSSProperties={display:"grid",gap:6,fontSize:12,fontWeight:800};
const inputStyle: React.CSSProperties={border:"1px solid #d0d5dd",borderRadius:12,padding:11,font:"inherit"};
