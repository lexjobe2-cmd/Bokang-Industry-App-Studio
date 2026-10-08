"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ClipboardCheck, RotateCcw, Truck, ShieldCheck, ArrowUpRight } from "lucide-react";
import { usePersistentState } from "@bokang/persistence";
import {
 MOVE_TRACK_KEYS, starterFleet, starterDrivers, starterPolicies,
 type FleetVehicle, type FleetDriver, type FleetAssignment, type PrestartRecord,
 type FleetIncident, type FleetSitePolicy
} from "../../lib/move-track";
import { type FormSubmission, type FormAnswers } from "@bokang/domain-data/assurance-forms";
import { type RepairEvidence, type ReinspectionEvidence, type FleetReleaseRecord } from "../../lib/fleet-release";
import { MoveTrackShowcase } from "./MoveTrackShowcase";
import { OrganizationOnboarding } from "./OrganizationOnboarding";
import { OperationalGraphPanel } from "./OperationalGraphPanel";

type Scenario="assignment"|"grounded"|"reset";
const style:React.CSSProperties={border:"1px solid #dce4ef",borderRadius:17,padding:17,background:"#fff"};
const scenarios=[
 {key:"assignment" as const,title:"Driver pre-start",desc:"A vehicle is assigned to K. Dube. Complete PASS/FAIL inspections in the driver app.",icon:Truck,color:"#2563eb"},
 {key:"grounded" as const,title:"Grounded equipment",desc:"A critical brake defect blocks release. Record corrective action, repair, reinspection and approval.",icon:AlertTriangle,color:"#b42318"},
 {key:"reset" as const,title:"Reset fleet scenario",desc:"Restore sample fleet and clear test inspections. Preserve custom companies, templates and JRA drafts.",icon:RotateCcw,color:"#64748b"},
];
export function MoveTrackDemoLab(){
 const reducedMotion=useReducedMotion();
 const [fleet,setFleet,fleetReady]=usePersistentState<FleetVehicle[]>(MOVE_TRACK_KEYS.fleet,starterFleet);
 const [,setDrivers,driversReady]=usePersistentState<FleetDriver[]>(MOVE_TRACK_KEYS.drivers,starterDrivers);
 const [assignments,setAssignments,assignReady]=usePersistentState<FleetAssignment[]>(MOVE_TRACK_KEYS.assignments,[]);
 const [,setPrestarts,prestartsReady]=usePersistentState<PrestartRecord[]>(MOVE_TRACK_KEYS.prestarts,[]);
 const [incidents,setIncidents,incidentsReady]=usePersistentState<FleetIncident[]>(MOVE_TRACK_KEYS.incidents,[]);
 const [,setPolicies,policiesReady]=usePersistentState<FleetSitePolicy[]>(MOVE_TRACK_KEYS.policies,starterPolicies);
 const [,setSubmissions,submissionReady]=usePersistentState<FormSubmission[]>("bokang-studio.move-track.assurance-submissions.v1",[]);
 const [,setDrafts,draftsReady]=usePersistentState<Record<string,FormAnswers>>("bokang-studio.move-track.assurance-drafts.v1",{});
 const [,setRepairs,repairReady]=usePersistentState<RepairEvidence[]>("bokang-studio.move-track.repairs.v1",[]);
 const [,setReinspections,reinspectReady]=usePersistentState<ReinspectionEvidence[]>("bokang-studio.move-track.reinspections.v1",[]);
 const [,setReleases,releasesReady]=usePersistentState<FleetReleaseRecord[]>("bokang-studio.move-track.releases.v1",[]);
 const [active,setActive]=useState<Scenario|null>(null);
 const [notice,setNotice]=useState("");
 const hydrated=[fleetReady,driversReady,assignReady,prestartsReady,incidentsReady,policiesReady,submissionReady,draftsReady,repairReady,reinspectReady,releasesReady].every(Boolean);
 function applyScenario(scenario:Scenario){
  if(!hydrated)return;
  if(scenario==="reset"&&!window.confirm("Reset demo fleet, assignments, checklists, repairs and incidents? Your custom companies, form designer and JRA drafts will be preserved."))return;
  const now=new Date().toISOString();
  const seededFleet=starterFleet.map(v=>({...v}));
  const seededAssignments:FleetAssignment[]=[];
  const seededIncidents:FleetIncident[]=[];
  const seededPrestarts:PrestartRecord[]=[];
  if(scenario==="assignment"){
    seededFleet[0]={...seededFleet[0]!,status:"Assigned"};
    seededAssignments.push({
      id:"ASSIGN-DEMO-001",vehicleId:"VEH-001",driverId:"DRV-001",
      jobId:"DEMO-HAUL-01",site:starterPolicies[0]!.name,createdAt:now,status:"Awaiting pre-start"
    });
  }
  if(scenario==="grounded"){
    seededFleet[0]={...seededFleet[0]!,status:"No-go"};
    seededAssignments.push({
      id:"ASSIGN-DEMO-001",vehicleId:"VEH-001",driverId:"DRV-001",
      site:starterPolicies[0]!.name,createdAt:now,status:"Grounded",prestartId:"PRE-DEMO-001"
    });
    seededPrestarts.push({
      id:"PRE-DEMO-001",assignmentId:"ASSIGN-DEMO-001",vehicleId:"VEH-001",driverId:"DRV-001",
      createdAt:now,checks:{"Service and park brake condition":"fail"},result:"NO-GO",
      reasons:["Critical brake failure — asset grounded"],notes:"Pedal travel outside acceptable range."
    });
    seededIncidents.push({
      id:"DEF-DEMO-001",vehicleId:"VEH-001",driverId:"DRV-001",assignmentId:"ASSIGN-DEMO-001",
      createdAt:now,severity:"Critical",category:"Defect",status:"Open",
      description:"Brake system failure detected during pre-start. Repair and reinspection required."
    });
  }
  setFleet(seededFleet);
  setDrivers(starterDrivers.map(d=>({...d,status:scenario==="reset"?d.status:d.id==="DRV-001"?"Assigned":d.status})));
  setPolicies(starterPolicies.map(p=>({...p})));
  setAssignments(seededAssignments);
  setPrestarts(seededPrestarts);
  setIncidents(seededIncidents);
  setRepairs([]);setReinspections([]);setReleases([]);
  setSubmissions([]);setDrafts({});
  setActive(scenario);
  setNotice(scenario==="grounded"?"Grounded fleet scenario loaded. Open Fleet control, resolve the defect with a note, then use Repair & release.":scenario==="assignment"?"Driver scenario loaded. Open the driver app, complete a pre-start and return to Fleet control to see the result.":"Fleet test data reset. Your custom companies, branded templates, JRA drafts and saved JRA records are preserved.");
 }
 return <main style={{background:"#f3f7fc",minHeight:"100vh",color:"#15233a",paddingBottom:100}}>
  <div style={{background:"linear-gradient(125deg,#0a162b 0%,#112746 65%,#1b4b79 100%)",color:"#fff",padding:"34px 20px 46px"}}>
   <div style={{maxWidth:1250,margin:"0 auto"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
      <a href="/products/move-track" style={{color:"#a9d3ff",fontWeight:800,fontSize:12,textDecoration:"none"}}>← MoveTrack AI / App Studio</a>
      <span style={{padding:"8px 11px",border:"1px solid #647d9b",borderRadius:999,fontSize:11,fontWeight:900,letterSpacing:1}}>FRONTEND DEMO · NO SIGN-IN</span>
    </div>
    <p style={{color:"#93c5fd",letterSpacing:1.8,fontSize:11,fontWeight:900,textTransform:"uppercase",margin:"28px 0 8px"}}>Bokang Industry App Studio / MoveTrack AI</p>
    <h1 style={{fontSize:"clamp(30px,5vw,49px)",maxWidth:850,lineHeight:1.08,margin:"0 0 12px"}}>Fleet + SHE Operational Assurance</h1>
    <p style={{maxWidth:780,color:"#cbd5e1",fontSize:14,lineHeight:1.75,margin:0}}>Start by onboarding a company, then run 21 new linked SHE workflows, branded JRA and JSA, fleet inspections, incident controls, and repair/release processes. Everything runs locally in your browser—no Firebase, Google account, Drive or backend setup.</p>
    <div style={{display:"flex",gap:9,flexWrap:"wrap",marginTop:22}}>
     <a href="/driver/move-track?driver=DRV-001" style={{...style,display:"flex",gap:7,alignItems:"center",padding:"11px 14px",color:"#fff",background:"#2563eb",fontSize:13,fontWeight:850,textDecoration:"none",border:0}}>Open driver mobile app <ArrowUpRight size={17}/></a>
     <span style={{...style,padding:"11px 14px",color:"#cbd5e1",background:"#203550",border:"1px solid #58708f",fontSize:12}}>Demo site: Jwaneng mine profile</span>
    </div>
   </div>
  </div>
  <div style={{maxWidth:1250,margin:"-24px auto 0",padding:"0 20px",position:"relative",display:"grid",gap:19}}>
   <OrganizationOnboarding/>
   <OperationalGraphPanel/>
   <section aria-label="Demo scenarios" style={style}>
    <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10,alignItems:"center",marginBottom:14}}>
      <div><p style={{fontSize:11,fontWeight:900,letterSpacing:1.3,color:"#2563eb",textTransform:"uppercase",margin:0}}>Quick start</p><h2 style={{fontSize:21,margin:"4px 0"}}>Choose a test scenario</h2><p style={{fontSize:12,color:"#64748b",margin:0}}>Each scenario loads connected demo records into the same fleet and driver app.</p></div>
      <span style={{fontWeight:850,fontSize:12,color:hydrated?"#087f5b":"#64748b"}}>{hydrated?"● Browser workspace ready":"Loading local demo…"}</span>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
     {scenarios.map(item=><motion.button key={item.key} type="button" whileHover={reducedMotion?undefined:{y:-2}} disabled={!hydrated} onClick={()=>applyScenario(item.key)}
      style={{...style,cursor:hydrated?"pointer":"wait",textAlign:"left",borderColor:active===item.key?item.color:"#dce4ef",background:active===item.key?"#f1f5f9":"#fff",minHeight:147}}>
       <item.icon size={21} color={item.color}/>
       <strong style={{display:"block",fontSize:15,margin:"10px 0 6px"}}>{item.title}</strong>
       <span style={{fontSize:12,color:"#667085",lineHeight:1.55}}>{item.desc}</span>
      </motion.button>)}
    </div>
    {notice?<div role="status" style={{padding:"12px 14px",border:"1px solid #bfdbfe",borderRadius:12,background:"#eff6ff",marginTop:14,fontSize:12,fontWeight:750,color:"#1d4ed8"}}>{notice}</div>:null}
   </section>
   <section aria-label="Live test overview" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10}}>
    {[
      {label:"Fleet registered",value:fleet.length,icon:Truck},
      {label:"Active assignments",value:assignments.filter(a=>!["Returned","Cancelled"].includes(a.status)).length,icon:ClipboardCheck},
      {label:"Grounded vehicles",value:fleet.filter(v=>v.status==="No-go").length,icon:AlertTriangle},
      {label:"Open defect reports",value:incidents.filter(i=>i.status!=="Resolved").length,icon:ShieldCheck}
    ].map(item=><div key={item.label} style={style}><item.icon size={17} color="#2563eb"/><strong style={{display:"block",fontSize:26,margin:"7px 0 1px"}}>{hydrated?item.value:"—"}</strong><span style={{fontSize:11,color:"#667085",fontWeight:800}}>{item.label}</span></div>)}
   </section>
   <section style={{...style,padding:"10px 17px 19px"}}>
     <MoveTrackShowcase initialView="forms"/>
   </section>
   <p style={{fontSize:11,color:"#64748b",textAlign:"center",margin:"12px 0"}}>Preview / simulation only. Locally submitted records cannot authorize real work or equipment movement. Designed and developed by Bokang Jobe.</p>
  </div>
 </main>;
}
