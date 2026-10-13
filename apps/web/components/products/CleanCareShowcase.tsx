"use client";

import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";
import { Building2, CheckCircle2, Clock3, Sparkles } from "lucide-react";

type CleaningJob = {
  id: string;
  customer: string;
  service: string;
  schedule: string;
  status: "Quote requested" | "Confirmed" | "Team assigned" | "In progress" | "Quality check" | "Completed";
};

const states: CleaningJob["status"][] = ["Quote requested","Confirmed","Team assigned","In progress","Quality check","Completed"];

export function CleanCareShowcase({ config }: { config: ProductConfig }) {
  const [jobs,setJobs]=usePersistentState<CleaningJob[]>("bokang-studio.clean-care.jobs.v1",[
    {id:"CC-401",customer:"Kgale View Offices",service:"Office cleaning",schedule:"Mon–Fri",status:"Team assigned"},
    {id:"CC-402",customer:"Naledi Residence",service:"Deep cleaning",schedule:"Sat 09:00",status:"Confirmed"},
    {id:"CC-403",customer:"Block 8 Retail",service:"Commercial cleaning",schedule:"Tue 18:00",status:"In progress"},
    {id:"CC-404",customer:"Tlokweng Property",service:"Move-out clean",schedule:"Wed 10:00",status:"Quality check"},
  ]);

  const active=jobs.filter(j=>j.status!=="Completed").length;
  const assigned=jobs.filter(j=>j.status==="Team assigned").length;
  const inProgress=jobs.filter(j=>j.status==="In progress").length;
  const quality=jobs.filter(j=>j.status==="Quality check").length;

  return (
    <section style={{marginTop:24,display:"grid",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:10}}>
        {[
          ["Active jobs",active,Sparkles],
          ["Teams assigned",assigned,Building2],
          ["In progress",inProgress,Clock3],
          ["Quality checks",quality,CheckCircle2],
        ].map(([label,value,Icon])=>{
          const MetricIcon=Icon as typeof Sparkles;
          return <article key={String(label)} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:16,padding:14}}>
            <MetricIcon size={19} color={config.experience.accent}/>
            <div style={{color:"#667085",fontSize:11,fontWeight:800,marginTop:9}}>{String(label)}</div>
            <strong style={{display:"block",fontSize:24,marginTop:3}}>{String(value)}</strong>
          </article>;
        })}
      </div>
      <article style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:20,padding:18}}>
        <p style={{margin:0,color:config.experience.accent,fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.2}}>Cleaning operations</p>
        <h2 style={{margin:"6px 0 4px"}}>Jobs and service status</h2>
        <p style={{margin:0,color:"#667085",fontSize:12}}>Demo-only workflow from quote request through team allocation, cleaning and quality check.</p>
        <div style={{display:"grid",gap:9,marginTop:16}}>
          {jobs.map(job=>(
            <div key={job.id} className="cleancare-job-row" style={{display:"grid",gridTemplateColumns:"minmax(150px,1.1fr) minmax(150px,1fr) minmax(120px,.8fr) auto",gap:10,alignItems:"center",padding:12,border:"1px solid #eef2f6",borderRadius:14}}>
              <div><strong>{job.customer}</strong><div style={{color:"#98a2b3",fontSize:10}}>{job.id}</div></div>
              <div style={{fontSize:12}}>{job.service}</div>
              <span style={{fontSize:11,fontWeight:850}}>{job.schedule}</span>
              <select value={job.status} onChange={(event)=>setJobs(current=>current.map(item=>item.id===job.id?{...item,status:event.target.value as CleaningJob["status"]}:item))} style={{border:"1px solid #d0d5dd",borderRadius:9,padding:"7px 8px",background:"#fff",fontSize:11}}>
                {states.map(state=><option key={state}>{state}</option>)}
              </select>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
