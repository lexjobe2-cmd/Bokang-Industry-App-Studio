"use client";
import {useEffect,useState,type ReactNode} from "react";
export function useDesktopWorkspace(){
 const [desktop,setDesktop]=useState(false);
 useEffect(()=>{const media=window.matchMedia("(min-width:1024px)");const update=()=>setDesktop(media.matches);update();media.addEventListener("change",update);return ()=>media.removeEventListener("change",update);},[]);
 return desktop;
}
/** Distinct navigation architecture with one mounted editor and a shared draft. */
type TaskWorkspaceProps={title:string;steps:readonly string[];current:number;onChange:(index:number)=>void;children:ReactNode;summary?:ReactNode;tools?:ReactNode};
export function TaskWorkspace(props:TaskWorkspaceProps){
 const desktop=useDesktopWorkspace();
 return <TaskWorkspaceView {...props} desktop={desktop}/>;
}
export function TaskWorkspaceView({title,steps,current,onChange,children,summary,tools,desktop}:TaskWorkspaceProps&{desktop:boolean}){
 return <section className={"movetrack-task-workspace "+(desktop?"is-desktop":"is-mobile")} aria-label={title+" workspace"}>
  {desktop?<aside className="movetrack-task-outline"><strong>{title}</strong><p>Jump directly to your work area</p><nav aria-label={title+" desktop sections"}>{steps.map((name,i)=><button type="button" key={name+ i} aria-current={current===i?"step":undefined} onClick={()=>onChange(i)}><span>{i+1}</span>{name}</button>)}</nav>{tools}</aside>:<div className="movetrack-task-mobile-nav"><strong>{title} · {current+1} / {steps.length}</strong><label>Go to step<select aria-label={title+" mobile step"} value={current} onChange={e=>onChange(Number(e.target.value))}>{steps.map((name,i)=><option value={i} key={name+i}>{i+1}. {name}</option>)}</select></label></div>}
  <div className="movetrack-task-editor">{children}</div>
  {summary?(desktop?<aside className="movetrack-task-inspector" aria-label={title+" desktop summary"}>{summary}</aside>:<details className="movetrack-task-mobile-summary"><summary>Draft summary & tools</summary>{summary}{tools}</details>):null}
 </section>;
}
