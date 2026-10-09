"use client";

export function WorkspaceSteps({label,steps,step,onChange}:{label:string;steps:readonly string[];step:number;onChange:(step:number)=>void}){
 return <nav className="movetrack-step-nav" aria-label={label}>{steps.map((name,index)=><button key={name} type="button" aria-current={step===index?"step":undefined} onClick={()=>onChange(index)}>{index+1}. {name}</button>)}</nav>;
}
