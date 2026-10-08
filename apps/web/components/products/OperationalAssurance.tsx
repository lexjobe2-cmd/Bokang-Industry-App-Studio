"use client";

import { useMemo, useState } from "react";
import { demoAssets, demoOperator, evaluatePrestart, prestartTemplate, releaseGroundedAsset, submitPrestart, type Asset, type Defect, type InspectionAnswer } from "@bokang/domain-data/operational-assurance";

const panel:React.CSSProperties={background:"#fff",border:"1px solid #e0e5eb",borderRadius:18,padding:18};
const button:React.CSSProperties={border:"1px solid #ccd5df",borderRadius:12,padding:"10px 14px",background:"#fff",cursor:"pointer",fontWeight:700};
export function OperationalAssurance(){
  const [assets,setAssets]=useState<Asset[]>(demoAssets);
  const [selected,setSelected]=useState(demoAssets[0].id);
  const [answers,setAnswers]=useState<Record<string,InspectionAnswer>>({});
  const [defects,setDefects]=useState<Defect[]>([]);
  const [history,setHistory]=useState<string[]>([]);
  const [submitted,setSubmitted]=useState(false);
  const asset=assets.find(a=>a.id===selected)!;
  const inspection={id:`demo-${selected}-prestart`,assetId:selected,operatorId:demoOperator.id,templateId:prestartTemplate.id,templateVersion:prestartTemplate.version,answers};
  const result=useMemo(()=>evaluatePrestart(prestartTemplate,inspection,asset,demoOperator,defects),[answers,asset,defects,selected]);
  const outstanding=defects.filter(d=>d.assetId===selected && d.status!=="CLOSED");
  function changeAsset(id:string){setSelected(id);setAnswers({});setSubmitted(false);}
  function submit(){
    try{
      const res=submitPrestart(prestartTemplate,inspection,asset,demoOperator,defects,new Date().toISOString());
      setAssets(prev=>prev.map(a=>a.id===selected?res.asset:a));
      setDefects(prev=>[...prev,...res.createdDefects]);
      setSubmitted(true);
      setHistory(prev=>[`${new Date().toLocaleString()} — ${asset.fleetNumber}: pre-start submitted, ${res.decision.decision}`,...prev]);
    }catch(e){setHistory(prev=>[String(e instanceof Error?e.message:e),...prev]);}
  }
  function demoRelease(){
    try{
      const now=new Date().toISOString();
      const closed=defects.map(d=>d.assetId===selected?{...d,status:"CLOSED" as const}:d);
      const released=releaseGroundedAsset(asset,closed,{id:`release-${Date.now()}`,assetId:selected,repairEvidenceId:"DEMO-evidence",reinspectionId:"DEMO-reinspection",approverId:"DEMO-supervisor",approvedAt:now},true);
      setDefects(closed);setAssets(prev=>prev.map(a=>a.id===selected?released:a));
      setAnswers({});setSubmitted(false);
      setHistory(prev=>[`${new Date().toLocaleString()} — DEMO release recorded for ${asset.fleetNumber}`,...prev]);
    }catch(e){setHistory(prev=>[String(e instanceof Error?e.message:e),...prev]);}
  }
  return <section style={{display:"grid",gap:16,marginTop:22}}>
    <div style={{...panel,background:"#111c2e",color:"white",border:0}}>
      <p style={{fontSize:12,letterSpacing:2,textTransform:"uppercase",opacity:.75}}>MoveTrack / Operational Assurance</p>
      <h2 style={{margin:"6px 0"}}>Vehicle pre-start and GO / NO-GO</h2>
      <p style={{opacity:.85,lineHeight:1.6}}>Interactive demonstration only — no real equipment authorization, authenticated approvals or persistent safety record.</p>
    </div>
    <div style={panel}>
      <label style={{display:"grid",gap:8,fontWeight:700}}>Choose demo asset
        <select style={{padding:12,border:"1px solid #ccd5df",borderRadius:12}} value={selected} onChange={e=>changeAsset(e.target.value)}>{assets.map(a=><option key={a.id} value={a.id}>{a.fleetNumber} · {a.name} · {a.state}</option>)}</select>
      </label>
      <p>Operator: {demoOperator.name} · Equipment authorization: {demoOperator.authorizations.includes(asset.assetClass)?"Recorded (demo)":"Missing"}</p>
      <strong style={{color:asset.state==="GROUNDED"?"#b42318":"#344054"}}>Asset status: {asset.state}</strong>
    </div>
    <div style={panel}>
      <h3 style={{marginTop:0}}>{prestartTemplate.title} · v{prestartTemplate.version}</h3>
      {prestartTemplate.sections.map(section=><div key={section.id} style={{marginTop:18}}>
        <h4 style={{margin:"0 0 10px"}}>{section.title}</h4>
        {section.questions.map(q=><div key={q.id} style={{borderTop:"1px solid #edf0f3",padding:"12px 0",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div><strong>{q.label}</strong>{q.critical&&<span style={{color:"#b42318",marginLeft:8,fontSize:12}}>Critical</span>}</div>
          <div style={{display:"flex",gap:6}}>{(["PASS","FAIL","NA"] as const).map(value=><button key={value} disabled={submitted} onClick={()=>setAnswers(prev=>({...prev,[q.id]:value}))} style={{...button,background:answers[q.id]===value?(value==="FAIL"?"#fee4e2":"#dbeafe"):"#fff",minWidth:52}} aria-pressed={answers[q.id]===value}>{value}</button>)}</div>
        </div>)}
      </div>)}
      <div aria-live="polite" style={{borderRadius:12,padding:14,marginTop:20,background:result.decision==="NO_GO"?"#fee4e2":result.decision==="GO"?"#dcfae6":"#f2f4f7",color:"#111827"}}>
        <strong>Evaluation: {result.decision.replace("_","-")}</strong>
        {result.reasons.length>0&&<p style={{margin:"6px 0 0"}}>{result.reasons.join("; ")}</p>}
      </div>
      <button style={{...button,marginTop:15,background:"#172b4d",color:"white"}} disabled={submitted||result.decision==="INCOMPLETE"} onClick={submit}>{submitted?"Inspection submitted (demo)":"Submit pre-start"}</button>
    </div>
    {asset.state==="GROUNDED"&&<div style={panel}>
      <h3>Grounding and defects</h3>
      <p>NO-GO is retained when a critical failure exists. In production, maintenance evidence, independently verified reinspection and an authenticated supervisor are mandatory.</p>
      {outstanding.map(d=><p key={d.id}>{d.questionId} · {d.status} · critical</p>)}
      <button style={button} onClick={demoRelease}>Simulate repair, reinspection and supervisor release</button>
      <p style={{fontSize:12,color:"#b42318"}}>Demo shortcut only. Must not be offered in a live operational tenant.</p>
    </div>}
    <div style={panel}><h3>Demo audit events</h3>{history.length?history.map((h,i)=><p key={i} style={{borderTop:"1px solid #eee",paddingTop:8}}>{h}</p>):<p>No inspection events in this session.</p>}</div>
  </section>;
}
