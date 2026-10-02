"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@bokang/persistence";
import {
  botswanaPlaces,
  fleetVehicleStates,
  logisticsJobStates,
  logisticsJobTypes,
  miningCriticalChecks,
  miningPrestartChecks,
  miningVehicleTypes,
} from "@bokang/domain-data";

type Job = { id:string; client:string; type:string; from:string; to:string; driver:string; state:string };

type FleetVehicle = {
  id: string;
  fleetNo: string;
  registration: string;
  makeModel: string;
  type: string;
  site: string;
  status: string;
  odometerKm: number;
  roadworthyExpiry: string;
  extinguisherServiceDue: string;
  nextServiceKm: number;
};

type Driver = {
  id: string;
  name: string;
  phone: string;
  licenceNo: string;
  siteAuthorised: boolean;
  openPitPermit: boolean;
  firstAid: boolean;
  defensiveDriving: boolean;
  status: "Available" | "Driving" | "Off shift";
};

type PrestartRecord = {
  id: string;
  vehicleId: string;
  driverId: string;
  createdAt: string;
  checks: Record<string, boolean>;
  result: "GO" | "NO-GO";
  notes: string;
};

const starterJobs: Job[] = [
  {id:"MT-601",client:"Kgetsi Furnishers",type:"Furniture move",from:"Gaborone",to:"Molepolole",driver:"K. Dube",state:"In transit"},
  {id:"MT-602",client:"Northside Pharmacy",type:"Local delivery",from:"Gaborone",to:"Tlokweng",driver:"L. Moagi",state:"Driver assigned"},
];

const starterFleet: FleetVehicle[] = [
  { id:"VEH-001", fleetNo:"LV-014", registration:"B 123 ABC", makeModel:"Toyota Hilux 2.8 GD-6", type:"Pickup / LDV", site:"Jwaneng mine", status:"Available", odometerKm:84210, roadworthyExpiry:"2027-02-15", extinguisherServiceDue:"2027-01-10", nextServiceKm:90000 },
  { id:"VEH-002", fleetNo:"LV-022", registration:"B 884 XYZ", makeModel:"Isuzu D-Max", type:"Pickup / LDV", site:"Orapa mine", status:"On job", odometerKm:116430, roadworthyExpiry:"2026-12-01", extinguisherServiceDue:"2026-11-20", nextServiceKm:120000 },
  { id:"VEH-003", fleetNo:"SV-006", registration:"B 619 KLM", makeModel:"Ford Transit", type:"Service truck", site:"Gaborone workshop", status:"Inspection due", odometerKm:69210, roadworthyExpiry:"2026-10-18", extinguisherServiceDue:"2026-10-12", nextServiceKm:70000 },
];

const starterDrivers: Driver[] = [
  { id:"DRV-001", name:"K. Dube", phone:"+267 71 100 001", licenceNo:"DL-DEMO-101", siteAuthorised:true, openPitPermit:true, firstAid:true, defensiveDriving:true, status:"Driving" },
  { id:"DRV-002", name:"L. Moagi", phone:"+267 72 100 002", licenceNo:"DL-DEMO-102", siteAuthorised:true, openPitPermit:false, firstAid:true, defensiveDriving:true, status:"Available" },
];

export function MoveTrackShowcase(){
  const [jobs,setJobs] = usePersistentState<Job[]>("bokang-studio.move-track.jobs.v1", starterJobs);
  const [fleet,setFleet] = usePersistentState<FleetVehicle[]>("bokang-studio.move-track.fleet.v1", starterFleet);
  const [drivers,setDrivers] = usePersistentState<Driver[]>("bokang-studio.move-track.drivers.v1", starterDrivers);
  const [prestarts,setPrestarts] = usePersistentState<PrestartRecord[]>("bokang-studio.move-track.prestarts.v1", []);
  const [client,setClient] = useState("");
  const [type,setType] = useState<(typeof logisticsJobTypes)[number]>("Local delivery");
  const [from,setFrom] = useState<(typeof botswanaPlaces)[number]>("Gaborone");
  const [to,setTo] = useState<(typeof botswanaPlaces)[number]>("Tlokweng");
  const [view,setView] = useState<"jobs"|"new"|"fleet"|"drivers"|"prestart"|"analytics">("fleet");

  const [vehicleDraft,setVehicleDraft] = useState({
    registration:"",
    fleetNo:"",
    makeModel:"",
    type:"Light vehicle / SUV",
    site:"Jwaneng mine",
    roadworthyExpiry:"",
    extinguisherServiceDue:"",
  });

  const [driverDraft,setDriverDraft] = useState({ name:"", phone:"", licenceNo:"" });
  const [selectedVehicle,setSelectedVehicle] = useState(starterFleet[0]?.id ?? "");
  const [selectedDriver,setSelectedDriver] = useState(starterDrivers[0]?.id ?? "");
  const [checks,setChecks] = useState<Record<string, boolean>>(() => Object.fromEntries(miningPrestartChecks.map((item) => [item, false])));
  const [notes,setNotes] = useState("");
  const [notice,setNotice] = useState("");

  const compliance = useMemo(() => {
    const noGo = fleet.filter((vehicle) => vehicle.status === "No-go").length;
    const inspections = fleet.filter((vehicle) => vehicle.status === "Inspection due").length;
    const available = fleet.filter((vehicle) => vehicle.status === "Available").length;
    const recentGo = prestarts.filter((record) => record.result === "GO").length;
    return { noGo, inspections, available, recentGo };
  }, [fleet, prestarts]);

  function addJob(){
    if(!client.trim()) return;
    setJobs((current)=>[{id:`MT-${600+current.length+1}`,client:client.trim(),type,from,to,driver:"Unassigned",state:"Quote requested"},...current]);
    setClient("");
    setView("jobs");
  }

  function addVehicle() {
    if (!vehicleDraft.registration.trim() || !vehicleDraft.fleetNo.trim() || !vehicleDraft.makeModel.trim()) {
      setNotice("Fleet number, registration and make/model are required.");
      return;
    }
    const next: FleetVehicle = {
      id: `VEH-${String(fleet.length + 1).padStart(3,"0")}`,
      fleetNo: vehicleDraft.fleetNo.trim(),
      registration: vehicleDraft.registration.trim(),
      makeModel: vehicleDraft.makeModel.trim(),
      type: vehicleDraft.type,
      site: vehicleDraft.site,
      status: "Inspection due",
      odometerKm: 0,
      roadworthyExpiry: vehicleDraft.roadworthyExpiry || "Not set",
      extinguisherServiceDue: vehicleDraft.extinguisherServiceDue || "Not set",
      nextServiceKm: 10000,
    };
    setFleet((current) => [next, ...current]);
    setSelectedVehicle(next.id);
    setVehicleDraft({ registration:"", fleetNo:"", makeModel:"", type:"Light vehicle / SUV", site:"Jwaneng mine", roadworthyExpiry:"", extinguisherServiceDue:"" });
    setNotice(next.fleetNo + " added. Complete a pre-start before site movement.");
  }

  function addDriver() {
    if (!driverDraft.name.trim() || !driverDraft.licenceNo.trim()) {
      setNotice("Driver name and licence/reference are required.");
      return;
    }
    const next: Driver = {
      id: `DRV-${String(drivers.length + 1).padStart(3,"0")}`,
      name: driverDraft.name.trim(),
      phone: driverDraft.phone.trim(),
      licenceNo: driverDraft.licenceNo.trim(),
      siteAuthorised: false,
      openPitPermit: false,
      firstAid: false,
      defensiveDriving: false,
      status: "Available",
    };
    setDrivers((current) => [next, ...current]);
    setSelectedDriver(next.id);
    setDriverDraft({ name:"", phone:"", licenceNo:"" });
    setNotice(next.name + " added. Complete site/training authorisations before dispatch.");
  }

  function completePrestart() {
    const vehicle = fleet.find((item) => item.id === selectedVehicle);
    const driver = drivers.find((item) => item.id === selectedDriver);
    if (!vehicle || !driver) {
      setNotice("Select a vehicle and driver.");
      return;
    }

    const failedCritical = miningCriticalChecks.filter((item) => !checks[item]);
    const driverGate = driver.siteAuthorised;
    const result: PrestartRecord["result"] = failedCritical.length === 0 && driverGate ? "GO" : "NO-GO";
    const record: PrestartRecord = {
      id: `PRE-${Date.now()}`,
      vehicleId: vehicle.id,
      driverId: driver.id,
      createdAt: new Date().toISOString(),
      checks,
      result,
      notes: notes.trim(),
    };

    setPrestarts((current) => [record, ...current]);
    setFleet((current) => current.map((item) => item.id === vehicle.id ? { ...item, status: result === "GO" ? "Available" : "No-go" } : item));
    setNotice(result === "GO"
      ? `${vehicle.fleetNo} cleared for movement in this demo pre-start.`
      : `${vehicle.fleetNo} is NO-GO. Critical failures: ${[...failedCritical, ...(!driverGate ? ["Driver site authorisation"] : [])].join(", ")}.`);
    setChecks(Object.fromEntries(miningPrestartChecks.map((item) => [item, false])));
    setNotes("");
  }

  return <section style={{marginTop:28,display:"grid",gap:18}}>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      {([
        ["fleet","Fleet"],
        ["drivers","Drivers"],
        ["prestart","Pre-start"],
        ["jobs","Jobs"],
        ["new","New job"],
        ["analytics","Analytics"]
      ] as const).map(([key,label])=><button key={key} onClick={()=>setView(key)} style={{border:"1px solid #bfdbfe",background:view===key?"#1d4ed8":"#fff",color:view===key?"#fff":"#344054",borderRadius:999,padding:"9px 14px",fontWeight:800}}>{label}</button>)}
    </div>

    {notice ? <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:13,padding:11,color:"#1e40af",fontSize:12,fontWeight:800}}>{notice}</div> : null}

    {view==="fleet" ? <div style={{display:"grid",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
        {[["Fleet",fleet.length],["Available",compliance.available],["Inspection due",compliance.inspections],["NO-GO",compliance.noGo]].map(([label,value])=>(
          <div key={String(label)} style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:18,padding:16}}><div style={{fontSize:12,color:"#667085",fontWeight:800}}>{label}</div><strong style={{fontSize:28}}>{value}</strong></div>
        ))}
      </div>

      <section style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:22,padding:18}}>
        <h2 style={{marginTop:0}}>Add fleet vehicle</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:10}}>
          <Field label="Fleet number"><input value={vehicleDraft.fleetNo} onChange={(e)=>setVehicleDraft((c)=>({...c,fleetNo:e.target.value}))} style={inputStyle} placeholder="LV-031"/></Field>
          <Field label="Registration"><input value={vehicleDraft.registration} onChange={(e)=>setVehicleDraft((c)=>({...c,registration:e.target.value}))} style={inputStyle} placeholder="B 000 ABC"/></Field>
          <Field label="Make / model"><input value={vehicleDraft.makeModel} onChange={(e)=>setVehicleDraft((c)=>({...c,makeModel:e.target.value}))} style={inputStyle} placeholder="Toyota Hilux"/></Field>
          <Field label="Vehicle type"><select value={vehicleDraft.type} onChange={(e)=>setVehicleDraft((c)=>({...c,type:e.target.value}))} style={inputStyle}>{miningVehicleTypes.map((item)=><option key={item}>{item}</option>)}</select></Field>
          <Field label="Site"><input value={vehicleDraft.site} onChange={(e)=>setVehicleDraft((c)=>({...c,site:e.target.value}))} style={inputStyle}/></Field>
          <Field label="Roadworthy expiry"><input type="date" value={vehicleDraft.roadworthyExpiry} onChange={(e)=>setVehicleDraft((c)=>({...c,roadworthyExpiry:e.target.value}))} style={inputStyle}/></Field>
          <Field label="Extinguisher service due"><input type="date" value={vehicleDraft.extinguisherServiceDue} onChange={(e)=>setVehicleDraft((c)=>({...c,extinguisherServiceDue:e.target.value}))} style={inputStyle}/></Field>
        </div>
        <button onClick={addVehicle} style={primaryButton}>Add vehicle</button>
      </section>

      <div style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:22,overflow:"hidden"}}>
        {fleet.map((vehicle)=><div key={vehicle.id} style={{padding:16,borderBottom:"1px solid #eff6ff",display:"grid",gap:7}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
            <div><strong>{vehicle.fleetNo} · {vehicle.registration}</strong><div style={{fontSize:12,color:"#667085"}}>{vehicle.makeModel} · {vehicle.type} · {vehicle.site}</div></div>
            <select value={vehicle.status} onChange={(e)=>setFleet((current)=>current.map((item)=>item.id===vehicle.id?{...item,status:e.target.value}:item))} style={inputStyle}>
              {fleetVehicleStates.map((state)=><option key={state}>{state}</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap",fontSize:11,color:"#667085"}}>
            <span>{vehicle.odometerKm.toLocaleString()} km</span>
            <span>Roadworthy: {vehicle.roadworthyExpiry}</span>
            <span>Extinguisher service: {vehicle.extinguisherServiceDue}</span>
            <span>Next service: {vehicle.nextServiceKm.toLocaleString()} km</span>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={()=>{setSelectedVehicle(vehicle.id);setView("prestart");}} style={secondaryButton}>Start pre-check</button>
            <button onClick={()=>setFleet((current)=>current.filter((item)=>item.id!==vehicle.id))} style={{...secondaryButton,color:"#b42318"}}>Remove</button>
          </div>
        </div>)}
      </div>
    </div> : null}

    {view==="drivers" ? <div style={{display:"grid",gap:14}}>
      <section style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:22,padding:18}}>
        <h2 style={{marginTop:0}}>Add driver</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:10}}>
          <Field label="Driver name"><input value={driverDraft.name} onChange={(e)=>setDriverDraft((c)=>({...c,name:e.target.value}))} style={inputStyle}/></Field>
          <Field label="Phone"><input value={driverDraft.phone} onChange={(e)=>setDriverDraft((c)=>({...c,phone:e.target.value}))} style={inputStyle}/></Field>
          <Field label="Licence / reference"><input value={driverDraft.licenceNo} onChange={(e)=>setDriverDraft((c)=>({...c,licenceNo:e.target.value}))} style={inputStyle}/></Field>
        </div>
        <button onClick={addDriver} style={primaryButton}>Add driver</button>
      </section>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
        {drivers.map((driver)=><article key={driver.id} style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:18,padding:15}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:10}}><strong>{driver.name}</strong><span style={{fontSize:11,fontWeight:850,color:driver.siteAuthorised?"#027a48":"#b42318"}}>{driver.siteAuthorised?"SITE AUTHORISED":"NOT AUTHORISED"}</span></div>
          <div style={{fontSize:12,color:"#667085",marginTop:4}}>{driver.licenceNo} · {driver.phone || "No phone"}</div>
          <div style={{display:"grid",gap:7,marginTop:12}}>
            {([
              ["siteAuthorised","Site driving authorisation"],
              ["openPitPermit","Open-pit driving permit"],
              ["firstAid","First-aid training"],
              ["defensiveDriving","Defensive driving"],
            ] as const).map(([key,label])=><label key={key} style={{display:"flex",justifyContent:"space-between",gap:10,fontSize:12}}><span>{label}</span><input type="checkbox" checked={driver[key]} onChange={(e)=>setDrivers((current)=>current.map((item)=>item.id===driver.id?{...item,[key]:e.target.checked}:item))}/></label>)}
          </div>
          <button onClick={()=>setDrivers((current)=>current.filter((item)=>item.id!==driver.id))} style={{...secondaryButton,marginTop:12,color:"#b42318"}}>Remove driver</button>
        </article>)}
      </div>
    </div> : null}

    {view==="prestart" ? <div style={{display:"grid",gap:14}}>
      <section style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:22,padding:18}}>
        <p style={{margin:0,color:"#1d4ed8",fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.2}}>Mining / industrial pre-start</p>
        <h2 style={{marginBottom:6}}>Driver clears the vehicle before movement.</h2>
        <p style={{color:"#667085",lineHeight:1.6,marginTop:0}}>Critical failures produce NO-GO in the demo. Site-specific standards can add further controls.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
          <Field label="Vehicle"><select value={selectedVehicle} onChange={(e)=>setSelectedVehicle(e.target.value)} style={inputStyle}>{fleet.map((vehicle)=><option key={vehicle.id} value={vehicle.id}>{vehicle.fleetNo} · {vehicle.registration}</option>)}</select></Field>
          <Field label="Driver"><select value={selectedDriver} onChange={(e)=>setSelectedDriver(e.target.value)} style={inputStyle}>{drivers.map((driver)=><option key={driver.id} value={driver.id}>{driver.name}</option>)}</select></Field>
        </div>
      </section>

      <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:8}}>
        {miningPrestartChecks.map((label)=>{
          const critical=miningCriticalChecks.includes(label as (typeof miningCriticalChecks)[number]);
          return <label key={label} style={{background:"#fff",border:critical?"1px solid #fecaca":"1px solid #dbeafe",borderRadius:13,padding:11,display:"flex",gap:10,alignItems:"start"}}>
            <input type="checkbox" checked={Boolean(checks[label])} onChange={(e)=>setChecks((current)=>({...current,[label]:e.target.checked}))}/>
            <span><strong style={{fontSize:12}}>{label}</strong>{critical?<div style={{color:"#b42318",fontSize:10,marginTop:2}}>Critical no-go control</div>:null}</span>
          </label>;
        })}
      </section>

      <Field label="Defects / notes"><textarea value={notes} onChange={(e)=>setNotes(e.target.value)} style={{...inputStyle,minHeight:90,resize:"vertical"}} placeholder="Record damage, defects, isolation or corrective action…"/></Field>
      <button onClick={completePrestart} style={primaryButton}>Complete pre-start and decide GO / NO-GO</button>

      {prestarts.slice(0,5).map((record)=>{
        const vehicle=fleet.find((item)=>item.id===record.vehicleId);
        const driver=drivers.find((item)=>item.id===record.driverId);
        return <div key={record.id} style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:14,padding:12,display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div><strong>{vehicle?.fleetNo || record.vehicleId} · {driver?.name || record.driverId}</strong><div style={{fontSize:11,color:"#667085"}}>{new Date(record.createdAt).toLocaleString()} · {record.notes || "No notes"}</div></div>
          <span style={{fontWeight:900,color:record.result==="GO"?"#027a48":"#b42318"}}>{record.result}</span>
        </div>;
      })}
    </div> : null}

    {view==="jobs" ? <div style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:22,overflow:"hidden"}}>{jobs.map((job)=><div key={job.id} style={{padding:16,borderBottom:"1px solid #eff6ff",display:"grid",gap:6}}><div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><strong>{job.client}</strong><div style={{fontSize:12,color:"#667085"}}>{job.id} · {job.type} · {job.from} → {job.to} · {job.driver}</div></div><select value={job.state} onChange={(e)=>setJobs((current)=>current.map((item)=>item.id===job.id?{...item,state:e.target.value}:item))} style={inputStyle}>{logisticsJobStates.map((state)=><option key={state}>{state}</option>)}</select></div></div>)}</div> : null}

    {view==="new" ? <div style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:22,padding:20}}><h2 style={{marginTop:0}}>Create delivery / move</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}><Field label="Client"><input value={client} onChange={(e)=>setClient(e.target.value)} style={inputStyle}/></Field><Field label="Job type"><select value={type} onChange={(e)=>setType(e.target.value as typeof type)} style={inputStyle}>{logisticsJobTypes.map((item)=><option key={item}>{item}</option>)}</select></Field><Field label="From"><select value={from} onChange={(e)=>setFrom(e.target.value as typeof from)} style={inputStyle}>{botswanaPlaces.map((item)=><option key={item}>{item}</option>)}</select></Field><Field label="To"><select value={to} onChange={(e)=>setTo(e.target.value as typeof to)} style={inputStyle}>{botswanaPlaces.map((item)=><option key={item}>{item}</option>)}</select></Field></div><button onClick={addJob} style={primaryButton}>Create job</button></div> : null}

    {view==="analytics" ? <div style={{display:"grid",gap:14}}>
      <div style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:22,padding:20}}><h2 style={{marginTop:0}}>Fleet safety snapshot</h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>{[["Active jobs",String(jobs.length)],["Fleet size",String(fleet.length)],["GO pre-starts",String(compliance.recentGo)],["NO-GO vehicles",String(compliance.noGo)]].map(([label,value])=><div key={label} style={{border:"1px solid #dbeafe",borderRadius:16,padding:16}}><div style={{fontSize:12,color:"#667085"}}>{label}</div><strong style={{fontSize:24}}>{value}</strong></div>)}</div></div>
      <div style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:18,padding:16,fontSize:12,color:"#475467",lineHeight:1.65}}>
        <strong>Safety reference used for the showcase:</strong> Botswana mine regulations on vehicle brakes/warning devices/fire extinguishers and Debswana 2025 contractor light-vehicle site rules. This demo is a workflow aid, not a statutory inspection certificate.
      </div>
    </div> : null}
  </section>;
}

function Field({label,children}:{label:string;children:React.ReactNode}) {
  return <label style={{display:"grid",gap:6,fontSize:11,fontWeight:850,color:"#475467"}}>{label}{children}</label>;
}

const inputStyle:React.CSSProperties={border:"1px solid #d0d5dd",borderRadius:11,padding:"9px 10px",background:"#fff",font:"inherit"};
const primaryButton:React.CSSProperties={marginTop:14,border:0,borderRadius:11,padding:"10px 14px",background:"#1d4ed8",color:"#fff",fontWeight:900};
const secondaryButton:React.CSSProperties={border:"1px solid #d0d5dd",background:"#fff",borderRadius:10,padding:"8px 10px",fontWeight:800,fontSize:12};
