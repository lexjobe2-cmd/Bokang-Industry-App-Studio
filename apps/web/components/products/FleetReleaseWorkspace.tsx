"use client";

import { useState } from "react";
import { usePersistentState } from "@bokang/persistence";
import { ShieldAlert, Wrench, ClipboardCheck, CheckCircle2, FileCheck2 } from "lucide-react";
import {SignatureApprovalTray} from "./SignatureApprovalTray";
import {type SignatureEvidence,isSignatureEvidence} from "@bokang/domain-data/signature-evidence";
import {
  MOVE_TRACK_KEYS, starterFleet, dateIsCurrent,
  type FleetVehicle, type FleetIncident, type FleetAssignment
} from "../../lib/move-track";
import {
  finalizeFleetRelease, verifyFleetRelease,
  type RepairEvidence, type ReinspectionEvidence, type FleetReleaseRecord
} from "../../lib/fleet-release";

const card:React.CSSProperties={border:"1px solid #cbd5e1",borderRadius:15,padding:16,background:"#fff"};
const input:React.CSSProperties={width:"100%",border:"1px solid #cbd5e1",borderRadius:10,minHeight:42,padding:"10px 11px",background:"#fff",color:"#111827"};
const btn:React.CSSProperties={border:0,borderRadius:10,padding:"11px 14px",minHeight:44,color:"#fff",background:"#172b4d",fontWeight:750,cursor:"pointer"};
const controls=["Brakes","Steering","Tyres and wheel nuts","Reverse alarm","Fire extinguisher","Permits and certificates"];
export function FleetReleaseWorkspace(){
 const [fleet,setFleet]=usePersistentState<FleetVehicle[]>(MOVE_TRACK_KEYS.fleet,starterFleet);
 const [incidents]=usePersistentState<FleetIncident[]>(MOVE_TRACK_KEYS.incidents,[]);
 const [assignments,setAssignments]=usePersistentState<FleetAssignment[]>(MOVE_TRACK_KEYS.assignments,[]);
 const [repairs,setRepairs]=usePersistentState<RepairEvidence[]>("bokang-studio.move-track.repairs.v1",[]);
 const [reinspections,setReinspections]=usePersistentState<ReinspectionEvidence[]>("bokang-studio.move-track.reinspections.v1",[]);
 const [releases,setReleases]=usePersistentState<FleetReleaseRecord[]>("bokang-studio.move-track.releases.v1",[]);
 const [chosen,setChosen]=useState("");
 const [repairer,setRepairer]=useState("");
 const [notes,setNotes]=useState("");
 const [ref,setRef]=useState("");
 const [inspector,setInspector]=useState("");
 const [verified,setVerified]=useState<string[]>([]);
 const [verdict,setVerdict]=useState<"PASS"|"FAIL">("FAIL");
 const [approver,setApprover]=useState("");
 const [releaseSignature,setReleaseSignature]=useState<SignatureEvidence|null>(null);
 const [inspectorSignature,setInspectorSignature]=useState<SignatureEvidence|null>(null);
 const [notice,setNotice]=useState("");
 const grounded=fleet.filter(v=>v.status==="No-go");
 const vehicle=grounded.find(v=>v.id===chosen)??grounded[0];
 const assignment=assignments.find(a=>a.vehicleId===vehicle?.id&&a.status==="Grounded");
 const defects=incidents.filter(i=>i.vehicleId===vehicle?.id);
 const unresolved=defects.filter(i=>i.status!=="Resolved");
 const repair=repairs.find(r=>r.vehicleId===vehicle?.id);
 const reinspection=reinspections.find(r=>r.vehicleId===vehicle?.id);
 const assessment=vehicle?verifyFleetRelease({
  vehicle,assignment,incidents,repair,reinspection,approver,
  baselineCertificatesValid:dateIsCurrent(vehicle.roadworthyExpiry)&&dateIsCurrent(vehicle.extinguisherServiceDue),
  now:new Date().toISOString()
 }):undefined;
 function recordRepair(){
  if(!vehicle || !notes.trim() || !repairer.trim() || !ref.trim()){setNotice("Repairer, repair notes and an evidence reference are required.");return;}
  const record:RepairEvidence={
   id:crypto.randomUUID(),vehicleId:vehicle.id,incidentIds:defects.filter(i=>i.category==="Defect"||i.severity==="Critical").map(i=>i.id),
   repairedBy:repairer.trim(),repairNotes:notes.trim(),evidenceReference:ref.trim(),recordedAt:new Date().toISOString()
  };
  setRepairs(current=>[record,...current.filter(r=>r.vehicleId!==vehicle.id)]);
  setReinspections(current=>current.filter(r=>r.vehicleId!==vehicle.id));setInspectorSignature(null);setReleaseSignature(null);
  setNotice("Demonstration repair reference recorded. Complete incident resolution and a separate reinspection.");
 }
 function recordReinspection(){
  if(!vehicle || !repair || !inspector.trim() || inspector.trim()===repair.repairedBy || !verified.length){
    setNotice("Record maintenance first. Independent inspector and checked controls are required.");return;
  }
  const scope="Reinspection "+vehicle.id+" · "+verdict+" · "+[...verified].sort().join(", ");
  if(!isSignatureEvidence(inspectorSignature)||inspectorSignature.signerName.trim().toLowerCase()!==inspector.trim().toLowerCase()||inspectorSignature.scope!==scope){
   setNotice("Independent inspector must sign these exact reinspection controls and verdict in the review tray.");return;
  }
  setReinspections(current=>[{
   id:crypto.randomUUID(),vehicleId:vehicle.id,inspectionBy:inspector.trim(),
   verdict,checkedControls:[...verified],performedAt:new Date().toISOString(),inspectorSignature
  },...current.filter(r=>r.vehicleId!==vehicle.id)]);
  setNotice(verdict==="PASS"?"Demo reinspection recorded. Supervisor must independently review and approve.":"Failed reinspection recorded: asset remains grounded.");
 }
 function release(){
  if(!vehicle)return;
  if(!isSignatureEvidence(releaseSignature)||releaseSignature.signerName.trim().toLowerCase()!==approver.trim().toLowerCase()){setNotice("Capture the named supervisor\u0027s local drawn acknowledgement first. This does not verify identity or authorize workplace release.");return;}
  const now=new Date().toISOString();
  try{
   const result=finalizeFleetRelease({
    vehicle,assignment,incidents,repair,reinspection,approver:approver.trim(),
    baselineCertificatesValid:dateIsCurrent(vehicle.roadworthyExpiry)&&dateIsCurrent(vehicle.extinguisherServiceDue),now
   },crypto.randomUUID());
   setReleases(current=>[{...result.record,localReviewerSignature:releaseSignature},...current]);
   setFleet(current=>current.map(v=>v.id===vehicle.id?result.vehicle:v));
   if(result.assignment)setAssignments(current=>current.map(a=>a.id===result.assignment?.id?result.assignment!:a));
   setChosen("");setReleaseSignature(null);setNotice("Demo release-to-reinspection completed. Vehicle remains INSPECTION DUE until a new driver pre-start.");
  }catch(e){setNotice(e instanceof Error?e.message:"Release blocked.");}
 }
 return <section style={{display:"grid",gap:13,marginTop:20}}>
  <div style={{...card,background:"#111c2e",color:"#fff",border:0}}>
   <p style={{fontSize:11,textTransform:"uppercase",letterSpacing:1.4,color:"#93c5fd",fontWeight:900}}>Maintenance assurance</p>
   <h2 style={{margin:"6px 0"}}>Grounding → repair → reinspection → release</h2>
   <p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.6}}>Separate roles and evidence checkpoints. All controls on this screen are demonstration-only; they do not constitute an authenticated safety release.</p>
  </div>
  {notice?<div role="status" style={{...card,background:"#eff6ff",fontSize:12,color:"#1e40af"}}>{notice}</div>:null}
  {grounded.length===0?<div style={card}><CheckCircle2 color="#087f5b" style={{display:"inline",verticalAlign:"middle",marginRight:8}}/> No currently grounded assets. Previous demo release records: {releases.length}.</div>:<>
    <label style={{...card,display:"grid",gap:8,fontWeight:800}}>Grounded vehicle
      <select style={input} value={vehicle?.id??""} onChange={e=>{setChosen(e.target.value);setNotice("");setVerified([]);}}>
       {grounded.map(v=><option key={v.id} value={v.id}>{v.fleetNo} · {v.makeModel} · NO-GO</option>)}
      </select>
      <small style={{color:"#b42318"}}><ShieldAlert size={14} style={{display:"inline"}}/> {unresolved.length} outstanding report(s). Resolve them in Fleet control before release.</small>
    </label>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12}}>
      <section style={card}>
       <h3 style={{display:"flex",gap:8,alignItems:"center",fontSize:17}}><Wrench size={19}/> 1 · Maintenance evidence</h3>
       <p style={{fontSize:11,color:"#667085"}}>Records a DEMO evidence reference only, not an uploaded repair photo.</p>
       <label style={{display:"grid",gap:6,marginBottom:10,fontSize:12}}>Repairer<input style={input} value={repairer} onChange={e=>setRepairer(e.target.value)} placeholder="Maintenance technician"/></label>
       <label style={{display:"grid",gap:6,marginBottom:10,fontSize:12}}>Repair notes<textarea style={{...input,minHeight:83}} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Work performed and parts used"/></label>
       <label style={{display:"grid",gap:6,marginBottom:10,fontSize:12}}>Evidence reference<input style={input} value={ref} onChange={e=>setRef(e.target.value)} placeholder="DEMO-REPAIR-001"/></label>
       <button style={btn} onClick={recordRepair}>Record repair (demo)</button>
       {repair?<p style={{fontSize:11,color:"#087f5b"}}>Recorded by {repair.repairedBy} · {repair.evidenceReference}</p>:null}
      </section>
      <section style={card}>
       <h3 style={{display:"flex",gap:8,alignItems:"center",fontSize:17}}><ClipboardCheck size={19}/> 2 · Independent reinspection</h3>
       <label style={{display:"grid",gap:6,marginBottom:12,fontSize:12}}>Inspector<input style={input} value={inspector} onChange={e=>{setInspector(e.target.value);setInspectorSignature(null);}} placeholder="Reinspection personnel"/></label>
       <strong style={{fontSize:12}}>Verified controls</strong>
       {controls.map(control=><label key={control} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",fontSize:12}}><input type="checkbox" checked={verified.includes(control)} onChange={e=>{setVerified(current=>e.target.checked?[...current,control]:current.filter(c=>c!==control));setInspectorSignature(null);}}/>{control}</label>)}
       <label style={{display:"grid",gap:6,margin:"12px 0",fontSize:12}}>Result
        <select style={input} value={verdict} onChange={e=>{setVerdict(e.target.value as "PASS"|"FAIL");setInspectorSignature(null);}}><option value="FAIL">FAIL — remains grounded</option><option value="PASS">PASS — reviewed controls pass</option></select>
       </label>
       <SignatureApprovalTray compact label="Review inspection checks & sign" role="Independent inspector" intent="review"
          disabled={!inspector.trim()||!verified.length||!repair} defaultSignerName={inspector}
          scope={"Reinspection "+(vehicle?.id??"")+" · "+verdict+" · "+[...verified].sort().join(", ")}
          value={inspectorSignature} onChange={setInspectorSignature}/>
       <button style={{...btn,marginTop:10}} disabled={!isSignatureEvidence(inspectorSignature)} onClick={recordReinspection}>Record signed reinspection (demo)</button>
       {reinspection?<p style={{fontSize:11,color:reinspection.verdict==="PASS"?"#087f5b":"#b42318"}}>{reinspection.verdict} · {reinspection.inspectionBy}</p>:null}
      </section>
      <section style={card}>
       <h3 style={{display:"flex",gap:8,alignItems:"center",fontSize:17}}><FileCheck2 size={19}/> 3 · Supervisor review</h3>
       <label style={{display:"grid",gap:6,fontSize:12,marginBottom:12}}>Approving supervisor<input style={input} value={approver} onChange={e=>setApprover(e.target.value)} placeholder="Independent supervisor"/></label>
       <SignatureApprovalTray compact label="Review evidence & sign release" value={releaseSignature} onChange={setReleaseSignature}
        defaultSignerName={approver} scope={"Local fleet release review "+(vehicle?.fleetNo??"")} role="Supervisor" intent="review"/>
       <div style={{padding:11,borderRadius:10,background:"#f8fafc",fontSize:12}}>
        <strong>{assessment?.allowed?"Ready for simulated release":"Release blocked"}</strong>
        <ul style={{paddingLeft:18,margin:"8px 0"}}>{assessment?.reasons.map((reason,i)=><li key={i}>{reason}</li>)}</ul>
       </div>
       <button onClick={release} disabled={!assessment?.allowed||!isSignatureEvidence(releaseSignature)||releaseSignature.signerName.trim().toLowerCase()!==approver.trim().toLowerCase()} style={{...btn,marginTop:12,opacity:assessment?.allowed?1:0.55}}>Authorize release to pre-start (demo)</button>
       <p style={{color:"#667085",fontSize:11}}>Never returns equipment directly to operational GO.</p>
      </section>
    </div>
   </>}
  {releases.length>0?<div style={card}><h3>Release audit references (local demo)</h3>{releases.slice(0,8).map(r=><p key={r.id} style={{fontSize:12,borderTop:"1px solid #e2e8f0",paddingTop:10}}>{r.vehicleId} · {r.decision} · {r.approvedBy} · {new Date(r.approvedAt).toLocaleString()}</p>)}</div>:null}
 </section>;
}
