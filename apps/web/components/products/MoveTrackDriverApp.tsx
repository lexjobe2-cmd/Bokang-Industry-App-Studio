"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@bokang/persistence";
import { miningCriticalChecks, miningPrestartChecks } from "@bokang/domain-data";
import {
  MOVE_TRACK_KEYS,
  evaluatePrestart,
  starterDrivers,
  starterFleet,
  starterPolicies,
  type ChecklistResult,
  type FleetAssignment,
  type FleetDriver,
  type FleetIncident,
  type FleetVehicle,
  type FleetSitePolicy,
  type PrestartRecord,
} from "../../lib/move-track";

export function MoveTrackDriverApp({ driverId }: { driverId: string }) {
  const [fleet,setFleet] = usePersistentState<FleetVehicle[]>(MOVE_TRACK_KEYS.fleet,starterFleet);
  const [drivers,setDrivers] = usePersistentState<FleetDriver[]>(MOVE_TRACK_KEYS.drivers,starterDrivers);
  const [assignments,setAssignments] = usePersistentState<FleetAssignment[]>(MOVE_TRACK_KEYS.assignments,[]);
  const [prestarts,setPrestarts] = usePersistentState<PrestartRecord[]>(MOVE_TRACK_KEYS.prestarts,[]);
  const [incidents,setIncidents] = usePersistentState<FleetIncident[]>(MOVE_TRACK_KEYS.incidents,[]);
  const [policies] = usePersistentState<FleetSitePolicy[]>(MOVE_TRACK_KEYS.policies,starterPolicies);
  const [tab,setTab] = useState<"home"|"assignment"|"check"|"incidents"|"profile">("home");
  const [checks,setChecks] = useState<Record<string,ChecklistResult>>(() => Object.fromEntries(miningPrestartChecks.map((item)=>[item,"unset"])));
  const [notes,setNotes] = useState("");
  const [returnOdometer,setReturnOdometer] = useState("");
  const [returnDefect,setReturnDefect] = useState(false);
  const [returnNotes,setReturnNotes] = useState("");
  const [incidentText,setIncidentText] = useState("");
  const [notice,setNotice] = useState("");

  const driver = drivers.find((item)=>item.id===driverId);
  const activeAssignment = useMemo(
    ()=>assignments.find((item)=>item.driverId===driverId && ["Assigned","Awaiting pre-start","Cleared","In use","Grounded"].includes(item.status)),
    [assignments,driverId]
  );
  const vehicle = activeAssignment ? fleet.find((item)=>item.id===activeAssignment.vehicleId) : undefined;
  const lastPrestart = activeAssignment?.prestartId ? prestarts.find((item)=>item.id===activeAssignment.prestartId) : undefined;

  function setResult(item:string,result:ChecklistResult){
    setChecks((current)=>({...current,[item]:result}));
  }

  function submitPrestart(){
    if(!driver || !activeAssignment || !vehicle){ setNotice("No active vehicle assignment."); return; }
    const policy = policies.find((item)=>item.name===activeAssignment.site);
    const criticalChecks = Array.from(new Set([
      ...miningCriticalChecks,
      ...(policy?.additionalCriticalChecks ?? [])
    ]));
    const evaluated=evaluatePrestart({
      checks,
      criticalChecks,
      vehicle,
      driver,
      requireOpenPitPermit:policy?.requireOpenPitPermit ?? activeAssignment.site.toLowerCase().includes("mine"),
      requireFirstAid:policy?.requireFirstAid ?? false,
      requireDefensiveDriving:policy?.requireDefensiveDriving ?? false
    });
    const record:PrestartRecord={
      id:"PRE-"+Date.now(),
      assignmentId:activeAssignment.id,
      vehicleId:vehicle.id,
      driverId:driver.id,
      createdAt:new Date().toISOString(),
      checks,
      result:evaluated.result,
      reasons:evaluated.reasons,
      notes:notes.trim()
    };
    setPrestarts((current)=>[record,...current]);
    setAssignments((current)=>current.map((item)=>item.id===activeAssignment.id?{
      ...item,
      status:evaluated.result==="GO"?"Cleared":"Grounded",
      prestartId:record.id
    }:item));
    setFleet((current)=>current.map((item)=>item.id===vehicle.id?{
      ...item,status:evaluated.result==="GO"?"Assigned":"No-go"
    }:item));
    setNotice(evaluated.result==="GO"
      ? vehicle.fleetNo+" is compliant with this demo site pre-start and cleared to take."
      : vehicle.fleetNo+" is GROUNDED: "+evaluated.reasons.join("; "));
    setTab("home");
  }

  function startVehicle(){
    if(!driver || !activeAssignment || !vehicle || activeAssignment.status!=="Cleared"){
      setNotice("A GO pre-start is required before taking the vehicle.");
      return;
    }
    setAssignments((current)=>current.map((item)=>item.id===activeAssignment.id?{...item,status:"In use",startedAt:new Date().toISOString()}:item));
    setFleet((current)=>current.map((item)=>item.id===vehicle.id?{...item,status:"On job"}:item));
    setDrivers((current)=>current.map((item)=>item.id===driver.id?{...item,status:"Driving"}:item));
    setNotice(vehicle.fleetNo+" checked out to "+driver.name+".");
  }

  function returnVehicle(){
    if(!driver || !activeAssignment || !vehicle || activeAssignment.status!=="In use"){
      setNotice("No vehicle currently checked out.");
      return;
    }
    const odometer=Number(returnOdometer);
    const status=returnDefect?"Inspection due":"Available";
    setAssignments((current)=>current.map((item)=>item.id===activeAssignment.id?{
      ...item,status:"Returned",returnedAt:new Date().toISOString(),
      returnOdometerKm:Number.isFinite(odometer)&&odometer>0?odometer:vehicle.odometerKm,
      returnCondition:returnDefect?"Defect reported":"No defect reported",
      returnNotes:returnNotes.trim()
    }:item));
    setFleet((current)=>current.map((item)=>item.id===vehicle.id?{
      ...item,status,odometerKm:Number.isFinite(odometer)&&odometer>0?odometer:item.odometerKm
    }:item));
    setDrivers((current)=>current.map((item)=>item.id===driver.id?{...item,status:"Available"}:item));
    if(returnDefect){
      setIncidents((current)=>[{
        id:"INC-"+Date.now(),vehicleId:vehicle.id,driverId:driver.id,assignmentId:activeAssignment.id,
        createdAt:new Date().toISOString(),severity:"Medium",category:"Defect",
        description:returnNotes.trim()||"Defect reported during vehicle return",status:"Open"
      },...current]);
    }
    setNotice(returnDefect
      ? vehicle.fleetNo+" returned with a defect and placed INSPECTION DUE."
      : vehicle.fleetNo+" returned and available.");
    setReturnOdometer(""); setReturnDefect(false); setReturnNotes(""); setTab("home");
  }

  function addIncident(){
    if(!driver || !vehicle || !incidentText.trim()) return;
    setIncidents((current)=>[{
      id:"INC-"+Date.now(),vehicleId:vehicle.id,driverId:driver.id,assignmentId:activeAssignment?.id,
      createdAt:new Date().toISOString(),severity:"Medium",category:"Safety",
      description:incidentText.trim(),status:"Open"
    },...current]);
    setIncidentText(""); setNotice("Incident/defect logged for "+vehicle.fleetNo+".");
  }

  if(!driver){
    return <main style={{maxWidth:620,margin:"0 auto",padding:24}}><h1>Driver not found</h1><p>Open this app using a valid driver link from MoveTrack fleet management.</p></main>;
  }

  const complianceColor=activeAssignment?.status==="Grounded"||vehicle?.status==="No-go"?"#b42318":activeAssignment?.status==="Cleared"?"#027a48":"#1d4ed8";

  return <main style={{maxWidth:720,margin:"0 auto",padding:"18px 18px 92px",minHeight:"100vh",background:"#f8fafc"}}>
    <header style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}>
      <div><div style={{fontSize:11,color:"#1d4ed8",fontWeight:900,textTransform:"uppercase",letterSpacing:1.2}}>MoveTrack Driver</div><h1 style={{fontSize:26,margin:"4px 0"}}>{driver.name}</h1><div style={{fontSize:12,color:"#667085"}}>{driver.status} · {driver.licenceNo}</div></div>
      <div style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:14,padding:"9px 11px",textAlign:"right"}}><div style={{fontSize:10,color:"#667085"}}>ASSIGNMENT</div><strong style={{color:complianceColor}}>{activeAssignment?.status||"None"}</strong></div>
    </header>

    {notice?<div style={{marginTop:14,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:13,padding:11,color:"#1e40af",fontSize:12,fontWeight:800}}>{notice}</div>:null}

    {tab==="home"?<section style={{display:"grid",gap:12,marginTop:18}}>
      <article style={card}>
        <div style={{fontSize:11,color:"#667085",fontWeight:850}}>CURRENT VEHICLE</div>
        {vehicle?<><h2 style={{margin:"6px 0"}}>{vehicle.fleetNo} · {vehicle.registration}</h2><div style={{fontSize:12,color:"#667085"}}>{vehicle.makeModel} · {activeAssignment?.site}</div><div style={{marginTop:12,fontSize:32,fontWeight:950,color:complianceColor}}>{vehicle.status==="No-go"?"GROUNDED":activeAssignment?.status==="Cleared"?"GO":activeAssignment?.status==="In use"?"IN USE":"CHECK REQUIRED"}</div></>:<p style={{color:"#667085"}}>No vehicle assigned.</p>}
      </article>

      {activeAssignment?.status==="Cleared"?<button onClick={startVehicle} style={primary}>Take vehicle / start shift</button>:null}
      {activeAssignment?.status==="In use"?<article style={card}><h2 style={{marginTop:0}}>Return vehicle</h2><label style={field}>Odometer<input inputMode="numeric" value={returnOdometer} onChange={(e)=>setReturnOdometer(e.target.value)} style={input}/></label><label style={{display:"flex",gap:8,marginTop:12,fontSize:13}}><input type="checkbox" checked={returnDefect} onChange={(e)=>setReturnDefect(e.target.checked)}/>Defect/damage found on return</label><textarea value={returnNotes} onChange={(e)=>setReturnNotes(e.target.value)} placeholder="Condition, defect or handover notes" style={{...input,minHeight:80,marginTop:10}}/><button onClick={returnVehicle} style={{...primary,marginTop:10}}>Check vehicle back in</button></article>:null}

      {activeAssignment && ["Assigned","Awaiting pre-start"].includes(activeAssignment.status)?<button onClick={()=>setTab("check")} style={primary}>Complete mandatory pre-start</button>:null}

      {activeAssignment?.status==="Grounded" && lastPrestart?<article style={{...card,border:"1px solid #fecaca"}}><strong style={{color:"#b42318"}}>Vehicle grounded</strong><ul style={{paddingLeft:20,color:"#667085",fontSize:12}}>{lastPrestart.reasons.map((reason)=><li key={reason}>{reason}</li>)}</ul><p style={{fontSize:11,color:"#667085"}}>Fleet/admin must correct the issue and release the vehicle for a fresh pre-start.</p></article>:null}
    </section>:null}

    {tab==="assignment"?<section style={{marginTop:18,...card}}>
      <h2 style={{marginTop:0}}>Assignment</h2>
      {activeAssignment&&vehicle?<div style={{display:"grid",gap:10}}><Info label="Vehicle" value={vehicle.fleetNo+" · "+vehicle.registration}/><Info label="Site" value={activeAssignment.site}/><Info label="Job" value={activeAssignment.jobId||"Fleet movement / no job linked"}/><Info label="Roadworthy expiry" value={vehicle.roadworthyExpiry}/><Info label="Extinguisher service due" value={vehicle.extinguisherServiceDue}/><Info label="Site policy" value={policies.find((item)=>item.name===activeAssignment.site)?.name||"Default fleet policy"}/></div>:<p>No active assignment.</p>}
    </section>:null}

    {tab==="check"?<section style={{display:"grid",gap:10,marginTop:18}}>
      <div style={card}><h2 style={{marginTop:0}}>Pre-start checklist</h2><p style={{color:"#667085",fontSize:12,lineHeight:1.6}}>Every critical control must explicitly PASS. FAIL grounds the vehicle. N/A does not satisfy a critical control.</p></div>
      {miningPrestartChecks.map((item)=>{
        const critical=miningCriticalChecks.includes(item as (typeof miningCriticalChecks)[number]);
        const value=checks[item]||"unset";
        return <article key={item} style={{...card,border:critical?"1px solid #fecaca":"1px solid #dbeafe"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:10}}><strong style={{fontSize:13}}>{item}</strong>{critical?<span style={{fontSize:10,color:"#b42318",fontWeight:900}}>MANDATORY</span>:null}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginTop:10}}>
            {(["pass","fail","na"] as ChecklistResult[]).map((result)=><button key={result} onClick={()=>setResult(item,result)} style={{border:"1px solid #d0d5dd",borderRadius:9,padding:"8px 5px",fontWeight:850,fontSize:11,background:value===result?(result==="pass"?"#ecfdf3":result==="fail"?"#fef3f2":"#f2f4f7"):"#fff",color:value===result?(result==="pass"?"#027a48":result==="fail"?"#b42318":"#475467"):"#344054"}}>{result.toUpperCase()}</button>)}
          </div>
        </article>;
      })}
      <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Defects / notes / corrective action required" style={{...input,minHeight:90}}/>
      <button onClick={submitPrestart} style={primary}>Submit pre-start</button>
    </section>:null}

    {tab==="incidents"?<section style={{marginTop:18,display:"grid",gap:12}}>
      <article style={card}><h2 style={{marginTop:0}}>Report defect / incident</h2><textarea value={incidentText} onChange={(e)=>setIncidentText(e.target.value)} placeholder="Describe what happened or what is unsafe…" style={{...input,minHeight:90}}/><button onClick={addIncident} style={{...primary,marginTop:10}}>Submit report</button></article>
      {incidents.filter((item)=>item.driverId===driver.id).map((item)=><article key={item.id} style={card}><div style={{display:"flex",justifyContent:"space-between"}}><strong>{item.category}</strong><span style={{fontSize:11,fontWeight:850}}>{item.status}</span></div><div style={{fontSize:12,color:"#667085",marginTop:5}}>{item.description}</div><div style={{fontSize:10,color:"#98a2b3",marginTop:5}}>{new Date(item.createdAt).toLocaleString()}</div></article>)}
    </section>:null}

    {tab==="profile"?<section style={{marginTop:18,...card}}><h2 style={{marginTop:0}}>Driver profile</h2><Info label="Site authorised" value={driver.siteAuthorised?"Yes":"No"}/><Info label="Open-pit permit" value={driver.openPitPermit?"Yes":"No"}/><Info label="First-aid training" value={driver.firstAid?"Yes":"No"}/><Info label="Defensive driving" value={driver.defensiveDriving?"Yes":"No"}/></section>:null}

    <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"min(720px,100%)",background:"#fff",borderTop:"1px solid #e5e7eb",display:"grid",gridTemplateColumns:"repeat(5,1fr)",padding:"8px 6px calc(8px + env(safe-area-inset-bottom))",zIndex:20}}>
      {([["home","Home"],["assignment","Vehicle"],["check","Check"],["incidents","Report"],["profile","Profile"]] as const).map(([key,label])=><button key={key} onClick={()=>setTab(key)} style={{border:0,background:"transparent",padding:8,fontSize:11,fontWeight:850,color:tab===key?"#1d4ed8":"#667085"}}>{label}</button>)}
    </nav>
  </main>;
}

function Info({label,value}:{label:string;value:string}){return <div style={{padding:"8px 0",borderBottom:"1px solid #eef2f6"}}><div style={{fontSize:10,color:"#98a2b3",fontWeight:850}}>{label.toUpperCase()}</div><strong style={{fontSize:13}}>{value}</strong></div>;}
const card:React.CSSProperties={background:"#fff",border:"1px solid #dbeafe",borderRadius:18,padding:16};
const field:React.CSSProperties={display:"grid",gap:5,fontSize:11,fontWeight:850};
const input:React.CSSProperties={border:"1px solid #d0d5dd",borderRadius:10,padding:10,font:"inherit",background:"#fff"};
const primary:React.CSSProperties={width:"100%",border:0,background:"#1d4ed8",color:"#fff",borderRadius:12,padding:"12px 14px",fontWeight:900};
