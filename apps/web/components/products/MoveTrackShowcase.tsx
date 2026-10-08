"use client";

import { useMemo, useState } from "react";
import { usePersistentState } from "@bokang/persistence";
import { AssuranceFormsWorkspace } from "./AssuranceFormsWorkspace";
import { FleetReleaseWorkspace } from "./FleetReleaseWorkspace";
import {
  botswanaPlaces,
  logisticsJobStates,
  logisticsJobTypes,
  miningVehicleTypes,
} from "@bokang/domain-data";
import {
  MOVE_TRACK_KEYS,
  starterDrivers,
  starterFleet,
  starterPolicies,
  dateIsCurrent,
  type FleetAssignment,
  type FleetDriver,
  type FleetIncident,
  type FleetVehicle,
  type FleetSitePolicy,
  type PrestartRecord,
} from "../../lib/move-track";

type Job = { id:string; client:string; type:string; from:string; to:string; driver:string; state:string };

const starterJobs:Job[]=[
  {id:"MT-601",client:"Kgetsi Furnishers",type:"Furniture move",from:"Gaborone",to:"Molepolole",driver:"Unassigned",state:"Scheduled"},
  {id:"MT-602",client:"Northside Pharmacy",type:"Local delivery",from:"Gaborone",to:"Tlokweng",driver:"Unassigned",state:"Scheduled"},
];

export function MoveTrackShowcase(){
  const [jobs,setJobs]=usePersistentState<Job[]>("bokang-studio.move-track.jobs.v1",starterJobs);
  const [fleet,setFleet]=usePersistentState<FleetVehicle[]>(MOVE_TRACK_KEYS.fleet,starterFleet);
  const [drivers,setDrivers]=usePersistentState<FleetDriver[]>(MOVE_TRACK_KEYS.drivers,starterDrivers);
  const [assignments,setAssignments]=usePersistentState<FleetAssignment[]>(MOVE_TRACK_KEYS.assignments,[]);
  const [prestarts]=usePersistentState<PrestartRecord[]>(MOVE_TRACK_KEYS.prestarts,[]);
  const [incidents,setIncidents]=usePersistentState<FleetIncident[]>(MOVE_TRACK_KEYS.incidents,[]);
  const [policies,setPolicies]=usePersistentState<FleetSitePolicy[]>(MOVE_TRACK_KEYS.policies,starterPolicies);

  const [view,setView]=useState<"control"|"fleet"|"drivers"|"sites"|"assign"|"jobs"|"analytics"|"forms"|"release">("control");
  const [notice,setNotice]=useState("");
  const [resolutionNotes,setResolutionNotes]=useState<Record<string,string>>({});
  const [client,setClient]=useState("");
  const [jobType,setJobType]=useState<(typeof logisticsJobTypes)[number]>("Local delivery");
  const [from,setFrom]=useState<(typeof botswanaPlaces)[number]>("Gaborone");
  const [to,setTo]=useState<(typeof botswanaPlaces)[number]>("Tlokweng");

  const [vehicleDraft,setVehicleDraft]=useState({
    fleetNo:"",registration:"",makeModel:"",type:"Light vehicle / SUV",
    site:"Jwaneng mine · demo profile",roadworthyExpiry:"",extinguisherServiceDue:""
  });
  const [driverDraft,setDriverDraft]=useState({name:"",phone:"",licenceNo:""});
  const [assignVehicle,setAssignVehicle]=useState("");
  const [assignDriver,setAssignDriver]=useState("");
  const [assignJob,setAssignJob]=useState("");
  const [assignSite,setAssignSite]=useState("Jwaneng mine · demo profile");

  const activeAssignments=assignments.filter((item)=>!["Returned","Cancelled"].includes(item.status));
  const control=useMemo(()=>({
    available:fleet.filter((item)=>item.status==="Available").length,
    assigned:fleet.filter((item)=>item.status==="Assigned").length,
    inUse:fleet.filter((item)=>item.status==="On job").length,
    grounded:fleet.filter((item)=>item.status==="No-go").length,
    due:fleet.filter((item)=>item.status==="Inspection due").length,
    openIncidents:incidents.filter((item)=>item.status!=="Resolved").length,
  }),[fleet,incidents]);

  function addVehicle(){
    if(!vehicleDraft.fleetNo.trim()||!vehicleDraft.registration.trim()||!vehicleDraft.makeModel.trim()){
      setNotice("Fleet number, registration and make/model are required."); return;
    }
    const next:FleetVehicle={
      id:"VEH-"+String(Date.now()).slice(-6),
      fleetNo:vehicleDraft.fleetNo.trim(),registration:vehicleDraft.registration.trim(),
      makeModel:vehicleDraft.makeModel.trim(),type:vehicleDraft.type,site:vehicleDraft.site,
      status:"Inspection due",odometerKm:0,roadworthyExpiry:vehicleDraft.roadworthyExpiry||"Not set",
      extinguisherServiceDue:vehicleDraft.extinguisherServiceDue||"Not set",nextServiceKm:10000
    };
    setFleet((current)=>[next,...current]);
    setVehicleDraft({fleetNo:"",registration:"",makeModel:"",type:"Light vehicle / SUV",site:"Jwaneng mine · demo profile",roadworthyExpiry:"",extinguisherServiceDue:""});
    setNotice(next.fleetNo+" onboarded. It remains INSPECTION DUE until a compliant driver pre-start clears it.");
  }

  function addDriver(){
    if(!driverDraft.name.trim()||!driverDraft.licenceNo.trim()){setNotice("Driver name and licence/reference are required.");return;}
    const next:FleetDriver={
      id:"DRV-"+String(Date.now()).slice(-6),name:driverDraft.name.trim(),phone:driverDraft.phone.trim(),
      licenceNo:driverDraft.licenceNo.trim(),siteAuthorised:false,openPitPermit:false,
      firstAid:false,defensiveDriving:false,status:"Available"
    };
    setDrivers((current)=>[next,...current]);
    setDriverDraft({name:"",phone:"",licenceNo:""});
    setNotice(next.name+" onboarded. Site/training authorisations must be completed before mine dispatch.");
  }

  function createAssignment(){
    const vehicle=fleet.find((item)=>item.id===assignVehicle);
    const driver=drivers.find((item)=>item.id===assignDriver);
    if(!vehicle||!driver){setNotice("Select a vehicle and driver.");return;}
    if(["No-go","Maintenance","Out of service","On job","Assigned"].includes(vehicle.status)){
      setNotice(vehicle.fleetNo+" cannot be assigned while status is "+vehicle.status+".");return;
    }
    if(!dateIsCurrent(vehicle.roadworthyExpiry) || !dateIsCurrent(vehicle.extinguisherServiceDue)){
      setFleet((current)=>current.map((item)=>item.id===vehicle.id?{...item,status:"No-go"}:item));
      setNotice(vehicle.fleetNo+" is GROUNDED because the roadworthiness or fire-extinguisher service record is expired/missing.");
      return;
    }
    const policy=policies.find((item)=>item.name===assignSite);
    if(!driver.siteAuthorised || (policy?.requireOpenPitPermit && !driver.openPitPermit) || (policy?.requireFirstAid && !driver.firstAid) || (policy?.requireDefensiveDriving && !driver.defensiveDriving)){
      setNotice(driver.name+" does not yet satisfy the selected site's driver authorisation/training policy.");
      return;
    }
    if(driver.status!=="Available"){setNotice(driver.name+" is not currently available.");return;}
    if(activeAssignments.some((item)=>item.vehicleId===vehicle.id||item.driverId===driver.id)){
      setNotice("The selected vehicle or driver already has an active assignment.");return;
    }

    const next:FleetAssignment={
      id:"ASN-"+Date.now(),vehicleId:vehicle.id,driverId:driver.id,
      jobId:assignJob||undefined,site:assignSite.trim()||vehicle.site,
      createdAt:new Date().toISOString(),status:"Awaiting pre-start"
    };
    setAssignments((current)=>[next,...current]);
    setFleet((current)=>current.map((item)=>item.id===vehicle.id?{...item,status:"Assigned"}:item));
    setDrivers((current)=>current.map((item)=>item.id===driver.id?{...item,status:"Assigned"}:item));
    if(assignJob){
      setJobs((current)=>current.map((job)=>job.id===assignJob?{...job,driver:driver.name,state:"Driver assigned"}:job));
    }
    setNotice(vehicle.fleetNo+" assigned to "+driver.name+". Driver must complete the pre-start before movement.");
    setAssignVehicle("");setAssignDriver("");setAssignJob("");
  }

  function cancelAssignment(assignment:FleetAssignment){
    if(assignment.status==="In use"){setNotice("An in-use vehicle must be checked back in by the driver before cancelling.");return;}
    setAssignments((current)=>current.map((item)=>item.id===assignment.id?{...item,status:"Cancelled"}:item));
    setFleet((current)=>current.map((item)=>item.id===assignment.vehicleId?{...item,status:item.status==="No-go"?"No-go":"Inspection due"}:item));
    setDrivers((current)=>current.map((item)=>item.id===assignment.driverId?{...item,status:"Available"}:item));
    setNotice("Assignment cancelled. Vehicle requires inspection/pre-start before reuse.");
  }

  function resolveIncident(id:string){
    const note=(resolutionNotes[id]||"").trim();
    if(!note){setNotice("Document corrective action before resolving the safety/defect record.");return;}
    setIncidents((current)=>current.map((item)=>item.id===id?{
      ...item,status:"Resolved",resolutionNote:note,resolvedAt:new Date().toISOString()
    }:item));
    setResolutionNotes((current)=>({...current,[id]:""}));
    setNotice("Corrective action recorded and incident resolved.");
  }

  function addJob(){
    if(!client.trim())return;
    setJobs((current)=>[{id:"MT-"+(600+current.length+1),client:client.trim(),type:jobType,from,to,driver:"Unassigned",state:"Quote requested"},...current]);
    setClient("");setView("jobs");
  }

  return <section style={{marginTop:28,display:"grid",gap:18}}>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      {([
        ["control","Fleet control"],["fleet","Fleet"],["drivers","Drivers"],["sites","Site policies"],["assign","Assign vehicle"],["jobs","Jobs"],["analytics","Analytics"],["forms","SHE forms"],["release","Repair & release"]
      ] as const).map(([key,label])=><button key={key} onClick={()=>setView(key)} style={{border:"1px solid #bfdbfe",background:view===key?"#1d4ed8":"#fff",color:view===key?"#fff":"#344054",borderRadius:999,padding:"9px 14px",fontWeight:800}}>{label}</button>)}
    </div>

    {notice?<div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:13,padding:11,color:"#1e40af",fontSize:12,fontWeight:800}}>{notice}</div>:null}

    {view==="control"?<div style={{display:"grid",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
        {[
          ["Available",control.available],["Assigned",control.assigned],["In use",control.inUse],
          ["Inspection due",control.due],["Grounded",control.grounded],["Open defects",control.openIncidents]
        ].map(([label,value])=><article key={String(label)} style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:17,padding:14}}><div style={{fontSize:11,color:"#667085",fontWeight:850}}>{label}</div><strong style={{fontSize:26,color:label==="Grounded"&&Number(value)>0?"#b42318":"#101827"}}>{value}</strong></article>)}
      </div>

      <section style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:22,overflow:"hidden"}}>
        <div style={{padding:16,borderBottom:"1px solid #dbeafe"}}><h2 style={{margin:0}}>Active vehicle assignments</h2><p style={{margin:"5px 0 0",fontSize:12,color:"#667085"}}>Manager view mirrors what the driver sees on the mobile app.</p></div>
        {activeAssignments.length===0?<div style={{padding:22,color:"#667085"}}>No active assignments.</div>:activeAssignments.map((assignment)=>{
          const vehicle=fleet.find((item)=>item.id===assignment.vehicleId);
          const driver=drivers.find((item)=>item.id===assignment.driverId);
          const last=assignment.prestartId?prestarts.find((item)=>item.id===assignment.prestartId):undefined;
          return <div key={assignment.id} style={{padding:16,borderBottom:"1px solid #eff6ff",display:"grid",gap:9}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
              <div><strong>{vehicle?.fleetNo||assignment.vehicleId} → {driver?.name||assignment.driverId}</strong><div style={{fontSize:11,color:"#667085"}}>{assignment.site} · {assignment.jobId||"No job linked"}</div></div>
              <span style={{fontWeight:900,color:assignment.status==="Grounded"?"#b42318":assignment.status==="Cleared"?"#027a48":"#1d4ed8"}}>{assignment.status.toUpperCase()}</span>
            </div>
            {last?.result==="NO-GO"?<div style={{fontSize:11,color:"#b42318"}}>{last.reasons.join(" · ")}</div>:null}
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {driver?<a href={"/driver/move-track?driver="+encodeURIComponent(driver.id)} target="_blank" rel="noreferrer" style={primaryLink}>Open driver app</a>:null}
              {assignment.status==="Grounded"?<button onClick={()=>setView("release")} style={secondaryButton}>Open repair and reinspection workflow</button>:null}
              {assignment.status!=="In use"?<button onClick={()=>cancelAssignment(assignment)} style={{...secondaryButton,color:"#b42318"}}>Cancel assignment</button>:null}
            </div>
          </div>;
        })}
      </section>

      <section style={{background:"#fff",border:"1px solid #fecaca",borderRadius:22,padding:16}}>
        <h2 style={{marginTop:0}}>Open safety / defect reports</h2>
        {incidents.filter((item)=>item.status!=="Resolved").length===0?<p style={{color:"#667085"}}>No open reports.</p>:incidents.filter((item)=>item.status!=="Resolved").map((item)=>{
          const vehicle=fleet.find((x)=>x.id===item.vehicleId);
          return <div key={item.id} style={{padding:"10px 0",borderBottom:"1px solid #fee2e2",display:"grid",gap:8}}>
            <div><strong>{vehicle?.fleetNo||item.vehicleId} · {item.category}</strong><div style={{fontSize:11,color:"#667085"}}>{item.description}</div></div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <input value={resolutionNotes[item.id]||""} onChange={(e)=>setResolutionNotes((current)=>({...current,[item.id]:e.target.value}))} placeholder="Corrective action / repair completed…" style={{...input,flex:"1 1 280px"}}/>
              <button onClick={()=>resolveIncident(item.id)} style={secondaryButton}>Resolve with corrective note (demo)</button>
            </div>
          </div>;
        })}
      </section>
    </div>:null}

    {view==="fleet"?<div style={{display:"grid",gap:14}}>
      <section style={panel}><h2 style={{marginTop:0}}>Onboard fleet vehicle</h2><div style={formGrid}>
        <Field label="Fleet number"><input value={vehicleDraft.fleetNo} onChange={(e)=>setVehicleDraft((c)=>({...c,fleetNo:e.target.value}))} style={input} placeholder="LV-031"/></Field>
        <Field label="Registration"><input value={vehicleDraft.registration} onChange={(e)=>setVehicleDraft((c)=>({...c,registration:e.target.value}))} style={input} placeholder="B 000 ABC"/></Field>
        <Field label="Make / model"><input value={vehicleDraft.makeModel} onChange={(e)=>setVehicleDraft((c)=>({...c,makeModel:e.target.value}))} style={input} placeholder="Toyota Hilux"/></Field>
        <Field label="Type"><select value={vehicleDraft.type} onChange={(e)=>setVehicleDraft((c)=>({...c,type:e.target.value}))} style={input}>{miningVehicleTypes.map((item)=><option key={item}>{item}</option>)}</select></Field>
        <Field label="Operating site"><input value={vehicleDraft.site} onChange={(e)=>setVehicleDraft((c)=>({...c,site:e.target.value}))} style={input}/></Field>
        <Field label="Roadworthy expiry"><input type="date" value={vehicleDraft.roadworthyExpiry} onChange={(e)=>setVehicleDraft((c)=>({...c,roadworthyExpiry:e.target.value}))} style={input}/></Field>
        <Field label="Extinguisher service due"><input type="date" value={vehicleDraft.extinguisherServiceDue} onChange={(e)=>setVehicleDraft((c)=>({...c,extinguisherServiceDue:e.target.value}))} style={input}/></Field>
      </div><button onClick={addVehicle} style={primaryButton}>Add vehicle</button></section>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(285px,1fr))",gap:12}}>
        {fleet.map((vehicle)=><article key={vehicle.id} style={{...panel,border:vehicle.status==="No-go"?"1px solid #fecaca":"1px solid #dbeafe"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:10}}><strong>{vehicle.fleetNo} · {vehicle.registration}</strong><span style={{fontSize:11,fontWeight:900,color:vehicle.status==="No-go"?"#b42318":"#1d4ed8"}}>{vehicle.status}</span></div>
          <div style={{fontSize:12,color:"#667085",marginTop:5}}>{vehicle.makeModel} · {vehicle.type}</div>
          <div style={{fontSize:11,color:"#667085",marginTop:3}}>{vehicle.site}</div>
          <div style={{display:"grid",gap:8,marginTop:12,fontSize:11}}>
            <label style={fieldInline}>Roadworthy expiry<input type="date" value={vehicle.roadworthyExpiry==="Not set"?"":vehicle.roadworthyExpiry} onChange={(e)=>setFleet((current)=>current.map((item)=>item.id===vehicle.id?{...item,roadworthyExpiry:e.target.value||"Not set"}:item))} style={input}/></label>
            <label style={fieldInline}>Extinguisher service due<input type="date" value={vehicle.extinguisherServiceDue==="Not set"?"":vehicle.extinguisherServiceDue} onChange={(e)=>setFleet((current)=>current.map((item)=>item.id===vehicle.id?{...item,extinguisherServiceDue:e.target.value||"Not set"}:item))} style={input}/></label>
            <span>Odometer: <strong>{vehicle.odometerKm.toLocaleString()} km</strong></span>
          </div>
          {vehicle.status==="No-go"?<button onClick={()=>setView("release")} style={{...secondaryButton,marginTop:12}}>Recheck baseline after corrective action</button>:null}
        </article>)}
      </div>
    </div>:null}

    {view==="drivers"?<div style={{display:"grid",gap:14}}>
      <section style={panel}><h2 style={{marginTop:0}}>Onboard driver</h2><div style={formGrid}>
        <Field label="Driver name"><input value={driverDraft.name} onChange={(e)=>setDriverDraft((c)=>({...c,name:e.target.value}))} style={input}/></Field>
        <Field label="Phone"><input value={driverDraft.phone} onChange={(e)=>setDriverDraft((c)=>({...c,phone:e.target.value}))} style={input}/></Field>
        <Field label="Licence / reference"><input value={driverDraft.licenceNo} onChange={(e)=>setDriverDraft((c)=>({...c,licenceNo:e.target.value}))} style={input}/></Field>
      </div><button onClick={addDriver} style={primaryButton}>Add driver</button></section>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:12}}>
        {drivers.map((driver)=><article key={driver.id} style={panel}>
          <div style={{display:"flex",justifyContent:"space-between",gap:10}}><strong>{driver.name}</strong><span style={{fontSize:11,fontWeight:900,color:driver.status==="Available"?"#027a48":"#1d4ed8"}}>{driver.status}</span></div>
          <div style={{fontSize:11,color:"#667085",marginTop:4}}>{driver.licenceNo} · {driver.phone||"No phone"}</div>
          <div style={{display:"grid",gap:7,marginTop:12}}>
            {([
              ["siteAuthorised","Site driving authorisation"],["openPitPermit","Site/open-pit permit"],
              ["firstAid","First-aid training"],["defensiveDriving","Defensive driving"]
            ] as const).map(([key,label])=><label key={key} style={{display:"flex",justifyContent:"space-between",gap:10,fontSize:12}}><span>{label}</span><input type="checkbox" checked={driver[key]} onChange={(e)=>setDrivers((current)=>current.map((item)=>item.id===driver.id?{...item,[key]:e.target.checked}:item))}/></label>)}
          </div>
          <a href={"/driver/move-track?driver="+encodeURIComponent(driver.id)} target="_blank" rel="noreferrer" style={{...primaryLink,marginTop:12}}>Open driver app</a>
        </article>)}
      </div>
    </div>:null}

    
    {view==="sites"?<div style={{display:"grid",gap:12}}>
      <section style={panel}>
        <p style={{margin:0,color:"#1d4ed8",fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.2}}>Site policy profiles</p>
        <h2 style={{marginBottom:6}}>Configure what a driver must satisfy before GO.</h2>
        <p style={{fontSize:12,color:"#667085",lineHeight:1.6}}>These are operator/site rules for the app's compliance engine, not a substitute for statutory inspection or the mine's formal procedures.</p>
      </section>
      {policies.map((policy)=><article key={policy.id} style={panel}>
        <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <strong>{policy.name}</strong>
          <span style={{fontSize:11,color:"#667085"}}>{policy.additionalCriticalChecks.length} extra critical controls</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8,marginTop:12}}>
          <label style={checkRow}><span>Require site/open-pit permit</span><input type="checkbox" checked={policy.requireOpenPitPermit} onChange={(e)=>setPolicies((current)=>current.map((item)=>item.id===policy.id?{...item,requireOpenPitPermit:e.target.checked}:item))}/></label>
          <label style={checkRow}><span>Require first-aid training</span><input type="checkbox" checked={policy.requireFirstAid} onChange={(e)=>setPolicies((current)=>current.map((item)=>item.id===policy.id?{...item,requireFirstAid:e.target.checked}:item))}/></label>
          <label style={checkRow}><span>Require defensive driving</span><input type="checkbox" checked={policy.requireDefensiveDriving} onChange={(e)=>setPolicies((current)=>current.map((item)=>item.id===policy.id?{...item,requireDefensiveDriving:e.target.checked}:item))}/></label>
        </div>
        <div style={{marginTop:12}}>
          <div style={{fontSize:11,fontWeight:850,color:"#667085",marginBottom:7}}>Additional critical vehicle controls</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:7}}>
            {[
              "First aid kit present and stocked",
              "Two-way radio / site communication available",
              "Beacon / strobe functional where site requires",
              "Whip flag fitted where site requires",
              "Emergency triangles / beacons present",
              "Reflective strips / vehicle identification visible",
              "No critical fluid leaks",
              "Cargo secured"
            ].map((label)=><label key={label} style={checkRow}><span>{label}</span><input type="checkbox" checked={policy.additionalCriticalChecks.includes(label)} onChange={(e)=>setPolicies((current)=>current.map((item)=>item.id===policy.id?{...item,additionalCriticalChecks:e.target.checked?[...item.additionalCriticalChecks,label]:item.additionalCriticalChecks.filter((x)=>x!==label)}:item))}/></label>)}
          </div>
        </div>
      </article>)}
    </div>:null}

    {view==="assign"?<section style={panel}>
      <p style={{margin:0,color:"#1d4ed8",fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.2}}>Dispatch</p>
      <h2 style={{marginBottom:6}}>Assign driver + vehicle</h2>
      <p style={{fontSize:12,color:"#667085",lineHeight:1.6}}>Assignment does not clear the vehicle. The driver's pre-start must return GO before they can take it.</p>
      <div style={formGrid}>
        <Field label="Vehicle"><select value={assignVehicle} onChange={(e)=>{setAssignVehicle(e.target.value);const v=fleet.find((x)=>x.id===e.target.value);if(v)setAssignSite(v.site);}} style={input}><option value="">Select vehicle</option>{fleet.filter((item)=>!["No-go","Maintenance","Out of service","On job","Assigned"].includes(item.status)).map((item)=><option key={item.id} value={item.id}>{item.fleetNo} · {item.registration} · {item.status}</option>)}</select></Field>
        <Field label="Driver"><select value={assignDriver} onChange={(e)=>setAssignDriver(e.target.value)} style={input}><option value="">Select driver</option>{drivers.filter((item)=>item.status==="Available").map((item)=><option key={item.id} value={item.id}>{item.name}{!item.siteAuthorised?" · authorisation pending":""}</option>)}</select></Field>
        <Field label="Job (optional)"><select value={assignJob} onChange={(e)=>setAssignJob(e.target.value)} style={input}><option value="">No job linked</option>{jobs.filter((job)=>!["Delivered","Closed"].includes(job.state)).map((job)=><option key={job.id} value={job.id}>{job.id} · {job.client}</option>)}</select></Field>
        <Field label="Site / destination"><input value={assignSite} onChange={(e)=>setAssignSite(e.target.value)} style={input}/></Field>
      </div>
      <button onClick={createAssignment} style={primaryButton}>Assign and require driver pre-start</button>
    </section>:null}

    {view==="jobs"?<div style={{display:"grid",gap:12}}>
      <section style={panel}><h2 style={{marginTop:0}}>New logistics job</h2><div style={formGrid}>
        <Field label="Client"><input value={client} onChange={(e)=>setClient(e.target.value)} style={input}/></Field>
        <Field label="Job type"><select value={jobType} onChange={(e)=>setJobType(e.target.value as typeof jobType)} style={input}>{logisticsJobTypes.map((item)=><option key={item}>{item}</option>)}</select></Field>
        <Field label="From"><select value={from} onChange={(e)=>setFrom(e.target.value as typeof from)} style={input}>{botswanaPlaces.map((item)=><option key={item}>{item}</option>)}</select></Field>
        <Field label="To"><select value={to} onChange={(e)=>setTo(e.target.value as typeof to)} style={input}>{botswanaPlaces.map((item)=><option key={item}>{item}</option>)}</select></Field>
      </div><button onClick={addJob} style={primaryButton}>Create job</button></section>
      <div style={{background:"#fff",border:"1px solid #dbeafe",borderRadius:22,overflow:"hidden"}}>{jobs.map((job)=><div key={job.id} style={{padding:15,borderBottom:"1px solid #eff6ff",display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><div><strong>{job.id} · {job.client}</strong><div style={{fontSize:11,color:"#667085"}}>{job.type} · {job.from} → {job.to} · {job.driver}</div></div><select value={job.state} onChange={(e)=>setJobs((current)=>current.map((item)=>item.id===job.id?{...item,state:e.target.value}:item))} style={input}>{logisticsJobStates.map((state)=><option key={state}>{state}</option>)}</select></div>)}</div>
    </div>:null}

    {view==="forms"?<AssuranceFormsWorkspace />:null}
    {view==="release"?<FleetReleaseWorkspace />:null}

    {view==="analytics"?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
      {[
        ["Fleet compliance",fleet.length?Math.round(((fleet.length-control.grounded-control.due)/fleet.length)*100)+"%":"—"],
        ["GO pre-starts",prestarts.filter((item)=>item.result==="GO").length],
        ["Grounded vehicles",control.grounded],
        ["Open defects",control.openIncidents],
        ["Vehicles in use",control.inUse],
        ["Active assignments",activeAssignments.length]
      ].map(([label,value])=><article key={String(label)} style={panel}><div style={{fontSize:11,color:"#667085",fontWeight:850}}>{label}</div><strong style={{fontSize:28}}>{value}</strong></article>)}
    </div>:null}
  </section>;
}

function Field({label,children}:{label:string;children:React.ReactNode}){return <label style={{display:"grid",gap:5,fontSize:11,fontWeight:850}}>{label}{children}</label>;}
const panel:React.CSSProperties={background:"#fff",border:"1px solid #dbeafe",borderRadius:20,padding:17};
const formGrid:React.CSSProperties={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10};
const input:React.CSSProperties={border:"1px solid #d0d5dd",borderRadius:10,padding:10,font:"inherit",background:"#fff"};
const primaryButton:React.CSSProperties={marginTop:14,border:0,background:"#1d4ed8",color:"#fff",borderRadius:11,padding:"10px 14px",fontWeight:900};
const secondaryButton:React.CSSProperties={border:"1px solid #d0d5dd",background:"#fff",borderRadius:10,padding:"8px 10px",fontWeight:800,fontSize:11};
const checkRow:React.CSSProperties={display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",background:"#f8fafc",border:"1px solid #e5e7eb",borderRadius:10,padding:"9px 10px",fontSize:11,fontWeight:750};
const fieldInline:React.CSSProperties={display:"grid",gridTemplateColumns:"1fr minmax(140px,180px)",gap:10,alignItems:"center",fontSize:11,fontWeight:750};
const primaryLink:React.CSSProperties={display:"inline-flex",alignItems:"center",justifyContent:"center",background:"#1d4ed8",color:"#fff",borderRadius:10,padding:"8px 11px",fontWeight:850,fontSize:11,textDecoration:"none"};
