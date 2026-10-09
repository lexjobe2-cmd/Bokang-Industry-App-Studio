"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {Home,Truck,ClipboardCheck,AlertTriangle,UserRound,Menu,X,ChevronRight,ArrowLeft,Sun,Moon} from "lucide-react";
import { usePersistentState } from "@bokang/persistence";
import {MultiImageEvidence} from "./MultiImageEvidence";
import {MoveTrackThemeStyles} from "./MoveTrackThemeStyles";
import {MOVETRACK_THEME_KEY,type MoveTrackTheme} from "./MoveTrackHelpCenter";
import type {LocalEvidenceImage} from "../../lib/image-evidence";
import {credentialAlerts,driverEligibilityReasons} from "../../lib/driver-competency";
import { miningCriticalChecks, miningPrestartChecks } from "@bokang/domain-data";
import {
  MOVE_TRACK_KEYS,
  evaluatePrestart,
  dateIsCurrent,
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
  const [theme,setTheme]=usePersistentState<MoveTrackTheme>(MOVETRACK_THEME_KEY,"light");
  const [fleet,setFleet] = usePersistentState<FleetVehicle[]>(MOVE_TRACK_KEYS.fleet,starterFleet);
  const [drivers,setDrivers] = usePersistentState<FleetDriver[]>(MOVE_TRACK_KEYS.drivers,starterDrivers);
  const [assignments,setAssignments] = usePersistentState<FleetAssignment[]>(MOVE_TRACK_KEYS.assignments,[]);
  const [prestarts,setPrestarts] = usePersistentState<PrestartRecord[]>(MOVE_TRACK_KEYS.prestarts,[]);
  const [incidents,setIncidents] = usePersistentState<FleetIncident[]>(MOVE_TRACK_KEYS.incidents,[]);
  const [policies] = usePersistentState<FleetSitePolicy[]>(MOVE_TRACK_KEYS.policies,starterPolicies);
  const [tab,setTab] = useState<"home"|"assignment"|"check"|"incidents"|"profile">("home");
  const [drawerOpen,setDrawerOpen]=useState(false);
  const drawerCloseRef=useRef<HTMLButtonElement>(null);
  const drawerButtonRef=useRef<HTMLButtonElement>(null);
  const driverTabs=[
   {key:"home" as const,label:"Home",icon:Home,description:"Driver overview"},
   {key:"assignment" as const,label:"Vehicle",icon:Truck,description:"Current assignment"},
   {key:"check" as const,label:"Check",icon:ClipboardCheck,description:"Mandatory pre-start"},
   {key:"incidents" as const,label:"Report",icon:AlertTriangle,description:"Report an incident"},
   {key:"profile" as const,label:"Profile",icon:UserRound,description:"Licence and permits"}
  ];
  function selectTab(key:typeof tab){setTab(key);setDrawerOpen(false);}
  useEffect(()=>{
   if(!drawerOpen)return;
   const prior=document.body.style.overflow;document.body.style.overflow="hidden";drawerCloseRef.current?.focus();
   const onKey=(e:KeyboardEvent)=>{
    if(e.key==="Escape"){e.preventDefault();setDrawerOpen(false);}
    if(e.key==="Tab"){
     const available=Array.from(document.querySelectorAll<HTMLElement>("#movetrack-driver-drawer button:not([disabled]),#movetrack-driver-drawer a[href]"));
     if(!available.length)return;
     const first=available[0]!,last=available[available.length-1]!;
     if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
     else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
   };
   document.addEventListener("keydown",onKey);
   return ()=>{document.body.style.overflow=prior;document.removeEventListener("keydown",onKey);drawerButtonRef.current?.focus();};
  },[drawerOpen]);
  const [checks,setChecks] = useState<Record<string,ChecklistResult>>(() => Object.fromEntries(miningPrestartChecks.map((item)=>[item,"unset"])));
  const [notes,setNotes] = useState("");
  const [returnOdometer,setReturnOdometer] = useState("");
  const [returnDefect,setReturnDefect] = useState(false);
  const [returnNotes,setReturnNotes] = useState("");
  const [incidentText,setIncidentText] = useState("");
  const [incidentPhotos,setIncidentPhotos]=useState<LocalEvidenceImage[]>([]);
  const [prestartPhotos,setPrestartPhotos]=useState<LocalEvidenceImage[]>([]);
  const [returnPhotos,setReturnPhotos]=useState<LocalEvidenceImage[]>([]);
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
      notes:notes.trim(),images:prestartPhotos
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
    if(evaluated.result==="NO-GO"){
      setIncidents((current)=>[{
        id:"INC-"+Date.now(),
        vehicleId:vehicle.id,
        driverId:driver.id,
        assignmentId:activeAssignment.id,
        createdAt:new Date().toISOString(),
        severity:"High",
        category:"Safety",
        description:"Pre-start NO-GO: "+evaluated.reasons.join("; "),
        status:"Open",images:prestartPhotos
      },...current]);
    }
    setPrestartPhotos([]);
    setNotice(evaluated.result==="GO"
      ? vehicle.fleetNo+" is compliant with this demo site pre-start and cleared to take."
      : vehicle.fleetNo+" is GROUNDED: "+evaluated.reasons.join("; "));
    setTab("home");
  }

  function startVehicle(){
    if(!driver || !activeAssignment || !vehicle || activeAssignment.status!=="Cleared"||lastPrestart?.result!=="GO"){
      setNotice("A GO pre-start is required before taking the vehicle.");
      return;
    }
    if(driver.authorizationReview&&Date.parse(driver.authorizationReview.signedAt)>Date.parse(lastPrestart.createdAt)){
      setNotice("Driver competency or authorisations changed after the GO pre-start. Complete a new pre-start before taking the vehicle.");
      return;
    }
    const policy=policies.find(item=>item.name===activeAssignment.site);
    const reasons=driverEligibilityReasons(driver,{
      requireOpenPitPermit:policy?.requireOpenPitPermit??activeAssignment.site.toLowerCase().includes("mine"),
      requireFirstAid:policy?.requireFirstAid??false,requireDefensiveDriving:policy?.requireDefensiveDriving??false
    });
    if(!dateIsCurrent(vehicle.roadworthyExpiry)||!dateIsCurrent(vehicle.extinguisherServiceDue)||["No-go","Maintenance","Out of service"].includes(vehicle.status)){
      reasons.push("Vehicle statutory/service evidence is missing, expired or grounded");
    }
    if(reasons.length){
      setNotice("Cannot start shift; qualifications or vehicle validity changed since pre-start: "+reasons.join("; ")+". Contact Admin → Drivers and complete a new pre-start.");
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
        description:returnNotes.trim()||"Defect reported during vehicle return",status:"Open",images:returnPhotos
      },...current]);
    }
    setNotice(returnDefect
      ? vehicle.fleetNo+" returned with a defect and placed INSPECTION DUE."
      : vehicle.fleetNo+" returned and available.");
    setReturnOdometer(""); setReturnDefect(false); setReturnNotes(""); setReturnPhotos([]); setTab("home");
  }

  function addIncident(){
    if(!driver || !vehicle || !incidentText.trim()) return;
    setIncidents((current)=>[{
      id:"INC-"+Date.now(),vehicleId:vehicle.id,driverId:driver.id,assignmentId:activeAssignment?.id,
      createdAt:new Date().toISOString(),severity:"Medium",category:"Safety",
      description:incidentText.trim(),status:"Open",images:incidentPhotos
    },...current]);
    setIncidentText(""); setIncidentPhotos([]); setNotice("Incident/defect logged for "+vehicle.fleetNo+".");
  }

  if(!driver){
    return <main style={{maxWidth:620,margin:"0 auto",padding:24}}><h1>Driver not found</h1><p>Open this app using a valid driver link from MoveTrack fleet management.</p></main>;
  }

  const complianceColor=activeAssignment?.status==="Grounded"||vehicle?.status==="No-go"?"#b42318":activeAssignment?.status==="Cleared"?"#027a48":"#1d4ed8";

  return <main className="movetrack-root movetrack-driver-theme" data-theme={theme} style={{maxWidth:720,margin:"0 auto",padding:"12px clamp(10px,3vw,20px) calc(106px + env(safe-area-inset-bottom))",minHeight:"100vh",background:theme==="dark"?"#081323":"#f8fafc",color:theme==="dark"?"#f0f6ff":"#15233a",overflowX:"clip"}}>
    <MoveTrackThemeStyles/>
    <div style={{display:"flex",gap:10,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",marginBottom:14}}>
     <button ref={drawerButtonRef} type="button" aria-label="Open driver navigation menu" aria-expanded={drawerOpen} aria-controls="movetrack-driver-drawer"
      onClick={()=>setDrawerOpen(true)} style={{display:"flex",gap:8,alignItems:"center",minHeight:45,border:"1px solid #cbd9e9",background:"#fff",borderRadius:12,color:"#173764",padding:"10px 12px",fontWeight:850,cursor:"pointer"}}>
      <Menu size={22}/> Menu
     </button>
     <strong style={{fontSize:12,color:"var(--mt-muted,#64748b)",flex:"1 1 92px",textAlign:"right"}}>Driver · {driverTabs.find(t=>t.key===tab)?.description}</strong>
     <button type="button" aria-label={theme==="dark"?"Switch driver app to light mode":"Switch driver app to dark mode"} onClick={()=>setTheme(theme==="dark"?"light":"dark")}
       style={{display:"grid",placeItems:"center",minHeight:44,minWidth:44,border:"1px solid var(--mt-border,#cbd9e9)",background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#173764)",borderRadius:12,cursor:"pointer"}}>
       {theme==="dark"?<Sun size={20}/>:<Moon size={20}/>}
     </button>
    </div>
    {drawerOpen?<div style={{position:"fixed",inset:0,zIndex:130}}>
     <button aria-label="Close driver navigation menu" onClick={()=>setDrawerOpen(false)} style={{position:"absolute",inset:0,width:"100%",height:"100%",background:"rgba(8,23,42,.58)",border:0}}/>
     <aside id="movetrack-driver-drawer" role="dialog" aria-modal="true" aria-label="Driver workspaces"
      style={{position:"absolute",inset:"0 auto 0 0",width:"min(375px,calc(100vw - 30px))",display:"flex",flexDirection:"column",background:"#f8fafc",boxShadow:"10px 0 50px rgba(0,0,0,.2)"}}>
      <div style={{padding:"calc(20px + env(safe-area-inset-top)) 18px 20px",background:"#112b4e",display:"flex",gap:12,alignItems:"start",justifyContent:"space-between",color:"#fff"}}>
       <div><small style={{color:"#9ec9ff",fontWeight:900,letterSpacing:1}}>MOVETRACK / DRIVER</small><h2 style={{margin:"7px 0 5px",fontSize:22}}>Your workspace</h2><p style={{margin:0,fontSize:12,color:"#c8dcf4"}}>Choose what you want to do</p></div>
       <button ref={drawerCloseRef} aria-label="Close menu" onClick={()=>setDrawerOpen(false)} style={{display:"grid",placeItems:"center",background:"#1b406e",color:"#fff",border:"1px solid #6889af",borderRadius:12,width:44,height:44}}><X size={23}/></button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"15px 13px"}}>
       {driverTabs.map(item=><button type="button" key={item.key} onClick={()=>selectTab(item.key)}
        aria-current={tab===item.key?"page":undefined}
        style={{display:"flex",width:"100%",gap:13,alignItems:"center",minHeight:60,background:tab===item.key?"#e8f1ff":"#fff",color:"#183b63",textAlign:"left",border:"1px solid #dae6f5",borderRadius:11,marginBottom:7,padding:"10px 12px",cursor:"pointer"}}>
        <item.icon size={22}/><span style={{flex:1}}><strong style={{display:"block",fontSize:13}}>{item.label}</strong><small style={{color:"#64748b"}}>{item.description}</small></span><ChevronRight size={17}/>
       </button>)}
       <a href="/" style={{display:"flex",gap:10,alignItems:"center",marginTop:15,padding:"14px 12px",borderRadius:11,background:"#173764",color:"#fff",fontSize:13,fontWeight:850,textDecoration:"none"}}><ArrowLeft size={18}/> Back to SHE manager</a>
      </div>
      <small style={{padding:"14px 18px calc(14px + env(safe-area-inset-bottom))",color:"#64748b",background:"#fff"}}>Frontend simulation · Not an official fleet authorization</small>
     </aside>
    </div>:null}
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
      {activeAssignment?.status==="In use"?<article style={card}><h2 style={{marginTop:0}}>Return vehicle</h2><label style={field}>Odometer<input inputMode="numeric" value={returnOdometer} onChange={(e)=>setReturnOdometer(e.target.value)} style={input}/></label><label style={{display:"flex",gap:8,marginTop:12,fontSize:13}}><input type="checkbox" checked={returnDefect} onChange={(e)=>setReturnDefect(e.target.checked)}/>Defect/damage found on return</label><textarea value={returnNotes} onChange={(e)=>setReturnNotes(e.target.value)} placeholder="Condition, defect or handover notes" style={{...input,minHeight:80,marginTop:10}}/>{returnDefect?<div style={{marginTop:10}}><MultiImageEvidence label="Return defect and damage photos" images={returnPhotos} onChange={setReturnPhotos}/></div>:null}<button onClick={returnVehicle} style={{...primary,marginTop:10}}>Check vehicle back in</button></article>:null}

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
            {(["pass","fail","na"] as ChecklistResult[]).map((result)=><button key={result} onClick={()=>setResult(item,result)} style={{border:"1px solid #d0d5dd",borderRadius:9,padding:"8px 5px",fontWeight:850,fontSize:11,background:value===result?(result==="pass"?"var(--mt-success-bg,#ecfdf3)":result==="fail"?"var(--mt-danger-bg,#fef3f2)":"var(--mt-surface-soft,#f2f4f7)"):"var(--mt-surface,#fff)",color:value===result?(result==="pass"?"var(--mt-success,#027a48)":result==="fail"?"var(--mt-danger,#b42318)":"var(--mt-muted,#475467)"):"var(--mt-ink,#344054)"}}>{result.toUpperCase()}</button>)}
          </div>
        </article>;
      })}
      <div style={{display:"flex",gap:7,flexWrap:"wrap"}} aria-label="Common pre-start remarks">
       {["Requires maintenance inspection","Defect reported to supervisor","Retest needed after repair","Additional remarks"].map(text=><button type="button" key={text} style={{border:"1px solid #cbd5e1",background:notes===text?"var(--mt-surface-soft,#dbeafe)":"var(--mt-surface,#fff)",padding:"8px 10px",borderRadius:9,fontSize:11,fontWeight:750}} onClick={()=>setNotes(text==="Additional remarks"?"":text)}>{text}</button>)}
      </div>
      <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Defects / notes / corrective action required" style={{...input,minHeight:90}}/>
      <MultiImageEvidence label="Pre-start inspection photos" images={prestartPhotos} onChange={setPrestartPhotos}/>
      <button onClick={submitPrestart} style={primary}>Submit pre-start</button>
    </section>:null}

    {tab==="incidents"?<section style={{marginTop:18,display:"grid",gap:12}}>
      <article style={card}><h2 style={{marginTop:0}}>Report defect / incident</h2>
       <p style={{fontSize:12,color:"#64748b"}}>Tap an observed condition to start the report, then add the actual facts. These suggestions do not submit anything automatically.</p>
       <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:11}}>
       {["Brake response abnormal","Fluid or fuel leak observed","Tyre or wheel damage","Unsafe access or pedestrian interaction","Unusual vibration or noise","Near miss reported"].map(text=><button type="button" key={text} style={{border:"1px solid #cbd5e1",background:incidentText===text?"var(--mt-warning-bg,#fff7ed)":"var(--mt-surface,#fff)",borderRadius:9,padding:"9px 10px",fontSize:11}} onClick={()=>setIncidentText(current=>current?current+"; "+text:text)}>{text}</button>)}
       </div>
       <textarea value={incidentText} onChange={(e)=>setIncidentText(e.target.value)} placeholder="Describe what you saw, the location and any immediate action…" style={{...input,width:"100%",minHeight:90}}/>
       <MultiImageEvidence label="Incident and defect photographs" images={incidentPhotos} onChange={setIncidentPhotos}/>
       <button onClick={addIncident} style={{...primary,marginTop:10}}>Submit observed report</button>
      </article>
      {incidents.filter((item)=>item.driverId===driver.id).map((item)=><article key={item.id} style={card}><div style={{display:"flex",justifyContent:"space-between"}}><strong>{item.category}</strong><span style={{fontSize:11,fontWeight:850}}>{item.status}</span></div><div style={{fontSize:12,color:"#667085",marginTop:5}}>{item.description}</div><div style={{fontSize:10,color:"#98a2b3",marginTop:5}}>{new Date(item.createdAt).toLocaleString()}</div><MultiImageEvidence label="Attached report photos" images={item.images??[]} readOnly/></article>)}
    </section>:null}

    {tab==="profile"?<section style={{marginTop:18,...card}}><h2 style={{marginTop:0}}>Driver profile</h2>
     <Info label="Licence / reference" value={driver.licenceNo}/>
     <Info label="Site authorised" value={driver.siteAuthorised?"Yes":"No"}/>
     <Info label="Open-pit permit" value={driver.openPitPermit?"Yes":"No"}/>
     <Info label="First-aid training" value={driver.firstAid?"Yes":"No"}/>
     <Info label="Defensive driving" value={driver.defensiveDriving?"Yes":"No"}/>
     <div aria-label="Driver credential expiry reminders" style={{display:"grid",gap:8,marginTop:13}}>
      <strong style={{fontSize:13}}>Credentials & renewal reminders</strong>
      {credentialAlerts(driver).map(alert=><div key={alert.key} style={{display:"flex",justifyContent:"space-between",gap:8,flexWrap:"wrap",fontSize:12}}>
       <span>{alert.label} · {alert.date||"Expiry missing"}</span>
       <strong style={{color:alert.state==="current"?"#047857":alert.state==="due"?"#9a670a":"#b42318"}}>{alert.state==="current"?"Current":alert.state==="due"?"Due in "+alert.daysRemaining+" days":alert.state==="expired"?"Expired":"Missing"}</strong>
      </div>)}
      <small style={{color:"#64748b"}}>Updates are managed in the Admin workspace. This is local demo evidence, not official certification.</small>
     </div></section>:null}

    <nav aria-label="Driver mobile primary navigation" style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"min(720px,100%)",background:"rgba(255,255,255,.97)",borderTop:"1px solid #dbe4ef",boxShadow:"0 -6px 18px rgba(15,36,68,.09)",display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",padding:"8px 6px calc(9px + env(safe-area-inset-bottom))",zIndex:50,backdropFilter:"blur(14px)"}}>
      {driverTabs.map(item=><button type="button" key={item.key} aria-current={tab===item.key?"page":undefined} onClick={()=>selectTab(item.key)}
       style={{border:0,borderRadius:11,background:tab===item.key?"#e8f1ff":"transparent",padding:"7px 2px",minHeight:55,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4,fontSize:10,fontWeight:850,color:tab===item.key?"#1d4ed8":"#667085",cursor:"pointer"}}>
       <item.icon size={24} strokeWidth={tab===item.key?2.5:1.9}/><span>{item.label}</span>
      </button>)}
    </nav>
  </main>;
}

function Info({label,value}:{label:string;value:string}){return <div style={{padding:"8px 0",borderBottom:"1px solid #eef2f6"}}><div style={{fontSize:10,color:"#98a2b3",fontWeight:850}}>{label.toUpperCase()}</div><strong style={{fontSize:13}}>{value}</strong></div>;}
const card:React.CSSProperties={background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#15233a)",border:"1px solid var(--mt-border,#dbeafe)",borderRadius:18,padding:16};
const field:React.CSSProperties={display:"grid",gap:5,fontSize:11,fontWeight:850};
const input:React.CSSProperties={border:"1px solid var(--mt-border,#d0d5dd)",borderRadius:10,padding:10,font:"inherit",background:"var(--mt-surface-soft,#fff)",color:"var(--mt-ink,#15233a)"};
const primary:React.CSSProperties={width:"100%",border:0,background:"#1d4ed8",color:"#fff",borderRadius:12,padding:"12px 14px",fontWeight:900};
