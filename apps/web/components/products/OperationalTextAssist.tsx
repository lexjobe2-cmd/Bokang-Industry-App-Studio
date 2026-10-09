"use client";
import {useState} from "react";
import {analyzeOperationalText,type OperationalTextAnalysis,type TextActionSuggestion} from "@bokang/domain-data/operational-nlp";
import type {PersonRecord} from "@bokang/domain-data/custom-assurance";
const button:React.CSSProperties={minHeight:44,border:"1px solid #cbd5e1",borderRadius:9,padding:"8px 12px",background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#17406b)",fontWeight:750,cursor:"pointer"};
export function OperationalTextAssist({value,people=[],onAction}:{value:string;people?:readonly PersonRecord[];onAction?:(action:TextActionSuggestion)=>void}){
 const [analysis,setAnalysis]=useState<OperationalTextAnalysis|null>(null),[source,setSource]=useState("");
 const stale=analysis!==null&&source!==value;
 return <div style={{minWidth:0,display:"grid",gap:8,fontSize:12,fontWeight:400}}>
  <button type="button" style={{...button,justifySelf:"start"}} disabled={!value.trim()} onClick={()=>{setAnalysis(analyzeOperationalText(value,people));setSource(value);}}>Analyze text locally</button>
  {analysis?<section aria-label="Text assistance suggestions" style={{display:"grid",gap:10,border:"1px solid #bfdbfe",padding:12,borderRadius:10,background:"var(--mt-surface-soft,#eff6ff)",overflowWrap:"anywhere"}}>
   <strong>{analysis.engine} · suggestions for review</strong>
   {stale?<p role="status">Text has changed. Analyze again before using suggestions.</p>:null}
   <div><strong>Source summary excerpts</strong><ul>{analysis.summary.map((s,i)=><li key={i}>{s}</li>)}</ul></div>
   {analysis.decisions.length?<div><strong>Decision candidates</strong><ul>{analysis.decisions.map((s,i)=><li key={i}>{s}</li>)}</ul></div>:null}
   {analysis.hazards.map(h=><div key={h.category}><strong>Mentioned hazard: {h.category}</strong><p style={{margin:"5px 0"}}>Source: {h.source}</p><details><summary>Proposed controls to assess</summary><ul>{h.controls.map(c=><li key={c}>{c}</li>)}</ul></details></div>)}
   {analysis.actions.map((a,i)=><div key={i} style={{borderTop:"1px solid #cbd5e1",paddingTop:8}}><strong>Action candidate</strong><p>{a.source}</p><p>{a.owner||"Owner unresolved"} · {a.due||"Due date unresolved"}</p><small>{a.needsReview.join(" · ")}</small>{onAction?<div><button type="button" disabled={stale} style={button} onClick={()=>onAction(a)}>Add to editable action register</button></div>:null}</div>)}
   {!analysis.actions.length?<p>No action candidates detected. You can still add actions manually.</p>:null}
   <p style={{margin:0}}>No text leaves this browser. Suggestions do not establish risk, implemented controls, attendance or approval. {analysis.warnings.join(" ")}</p>
   <button type="button" style={{...button,justifySelf:"start"}} onClick={()=>setAnalysis(null)}>Close suggestions</button>
  </section>:null}
 </div>;
}
