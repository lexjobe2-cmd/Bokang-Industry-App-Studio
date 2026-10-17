"use client";

import { useMemo, useState } from "react";
import type { ProductConfig } from "@bokang/app-config";
import { usePersistentState } from "@bokang/persistence";
import { cleanCareQuoteKey, cleanCareWorkspaceKey, type CleanCareQuote } from "../../lib/clean-care";
import { Building2, CheckCircle2, ClipboardCheck, Clock3, Plus, Sparkles, Users } from "lucide-react";

type Stage = CleanCareQuote["status"];
type LegacyStage = "Quote requested" | "Confirmed";
type CheckKey = "site" | "equipment" | "cleaning" | "supervisor" | "customer";
type CleaningJob = {
  id: string;
  customer: string;
  service: string;
  schedule: string;
  status: Stage | LegacyStage;
  site?: string;
  team?: string;
  notes?: string;
  frequency?: string;
  checklists?: Partial<Record<CheckKey, boolean>>;
  photoNames?: string[];
};
type Supply = { id: string; name: string; quantity: number };
const stages: Stage[] = ["New enquiry", "Quoted", "Accepted", "Scheduled", "Team assigned", "In progress", "Quality check", "Completed"];
const checks: Array<{ key: CheckKey; title: string }> = [
  { key: "site", title: "Site hazards and access reviewed" },
  { key: "equipment", title: "PPE, chemicals and equipment checked" },
  { key: "cleaning", title: "Service-area cleaning checklist complete" },
  { key: "supervisor", title: "Supervisor quality inspection passed" },
  { key: "customer", title: "Customer sign-off recorded" },
];
const starterJobs: CleaningJob[] = [
  { id: "CC-401", customer: "Kgale View Offices", service: "Office cleaning", schedule: "Mon–Fri", status: "Team assigned", team: "Team A", site: "Kgale View", frequency: "Daily" },
  { id: "CC-402", customer: "Naledi Residence", service: "Deep cleaning", schedule: "Sat 09:00", status: "Confirmed", site: "Naledi" },
  { id: "CC-403", customer: "Block 8 Retail", service: "Commercial cleaning", schedule: "Tue 18:00", status: "In progress", team: "Team B", site: "Block 8" },
  { id: "CC-404", customer: "Tlokweng Property", service: "Move-out clean", schedule: "Wed 10:00", status: "Quality check", team: "Team A", site: "Tlokweng" },
];
const inputStyle: React.CSSProperties = { width: "100%", minWidth: 0, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", padding: "10px 11px", font: "inherit", color: "#101827" };
const cardStyle: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 18, padding: 16, minWidth: 0 };
const buttonStyle: React.CSSProperties = { background: "#0f766e", color: "#fff", border: 0, borderRadius: 10, padding: "11px 14px", fontWeight: 800, cursor: "pointer", minHeight: 43 };
const sections = ["Dashboard", "Quote Requests", "Jobs", "Customers", "Teams", "Schedules", "Sites", "Services", "Recurring Contracts", "Inspections", "Supplies", "More"] as const;
type Section = (typeof sections)[number];

export function CleanCareShowcase({ config, clientName = "Your Business" }: { config: ProductConfig; clientName?: string }) {
  const [tab, setTab] = useState<Section>("Dashboard");
  const [jobs, setJobs] = usePersistentState<CleaningJob[]>(cleanCareWorkspaceKey(clientName, "jobs"), starterJobs);
  const [quotes, setQuotes] = usePersistentState<CleanCareQuote[]>(cleanCareQuoteKey(clientName), []);
  const [teams, setTeams] = usePersistentState<string[]>(cleanCareWorkspaceKey(clientName, "teams"), ["Team A", "Team B"]);
  const [supplies, setSupplies] = usePersistentState<Supply[]>(cleanCareWorkspaceKey(clientName, "supplies"), [
    { id: "SUP-01", name: "Gloves", quantity: 40 },
    { id: "SUP-02", name: "Mop heads", quantity: 8 },
    { id: "SUP-03", name: "Cleaning solution (L)", quantity: 18 },
  ]);
  const [teamDraft, setTeamDraft] = useState("");
  const [supplyDraft, setSupplyDraft] = useState("");
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [error, setError] = useState("");
  const activeJobs = jobs.filter((job) => job.status !== "Completed").length;
  const pendingQuotes = quotes.filter((quote) => ["New enquiry", "Quoted"].includes(quote.status)).length;
  const customers = useMemo(() => Array.from(new Set([...jobs.map((job) => job.customer), ...quotes.map((quote) => quote.name)])), [jobs, quotes]);
  const sites = useMemo(() => Array.from(new Set([...jobs.map((job) => job.site ?? "").filter(Boolean), ...quotes.map((quote) => quote.location).filter(Boolean)])), [jobs, quotes]);
  const updateJob = (id: string, patch: Partial<CleaningJob>) => setJobs((current) => current.map((job) => job.id === id ? { ...job, ...patch } : job));
  const updateQuote = (id: string, status: Stage) => setQuotes((current) => current.map((quote) => quote.id === id ? { ...quote, status } : quote));
  function createJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const customer = String(data.get("customer") ?? "").trim();
    const service = String(data.get("service") ?? "").trim();
    if (!customer || !service) return;
    setJobs((current) => [{
      id: "CC-" + Date.now().toString(36),
      customer,
      service,
      site: String(data.get("site") ?? ""),
      schedule: String(data.get("schedule") ?? ""),
      frequency: String(data.get("frequency") ?? ""),
      team: String(data.get("team") ?? ""),
      notes: String(data.get("notes") ?? ""),
      status: "Scheduled",
      checklists: {},
    }, ...current]);
    form.reset();
    setShowCreateJob(false);
  }
  function createFromQuote(quote: CleanCareQuote) {
    if (!jobs.some((job) => job.id === "JOB-" + quote.id)) {
      setJobs((current) => [{
        id: "JOB-" + quote.id,
        customer: quote.name,
        service: quote.service,
        site: quote.location,
        schedule: quote.preferredDate,
        frequency: quote.frequency,
        notes: quote.instructions,
        photoNames: quote.photoNames,
        status: "Scheduled",
        checklists: {},
      }, ...current]);
    }
    updateQuote(quote.id, "Scheduled");
    setTab("Jobs");
  }
  function changeJobStatus(job: CleaningJob, next: Stage) {
    setError("");
    if (next === "Completed" && !checks.every((check) => job.checklists?.[check.key])) {
      setError("Complete all five pre-start, quality and customer sign-off checks before marking a job completed.");
      return;
    }
    updateJob(job.id, { status: next });
  }
  function renderJob(job: CleaningJob) {
    const current = job.status === "Quote requested" ? "New enquiry" : job.status === "Confirmed" ? "Accepted" : job.status;
    const complete = checks.every((check) => job.checklists?.[check.key]);
    return (
      <article key={job.id} style={cardStyle}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div><strong style={{fontSize:16}}>{job.customer}</strong><div style={{color:"#64748b",fontSize:12}}>{job.id} · {job.service}</div></div>
          <span style={{fontSize:12,color:"#0f766e",fontWeight:800}}>{current}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,180px),1fr))",gap:10,marginTop:12}}>
          <label style={{fontSize:12}}>Scheduled date / time<input aria-label={"Schedule " + job.customer} style={inputStyle} value={job.schedule} onChange={(event)=>updateJob(job.id,{schedule:event.target.value})} /></label>
          <label style={{fontSize:12}}>Assigned team<select style={inputStyle} value={job.team ?? ""} onChange={(event)=>updateJob(job.id,{team:event.target.value})}><option value="">Unassigned</option>{teams.map((team)=><option key={team}>{team}</option>)}</select></label>
          <label style={{fontSize:12}}>Workflow status<select style={inputStyle} value={current} onChange={(event)=>changeJobStatus(job,event.target.value as Stage)}>{stages.map((stage)=><option key={stage} value={stage} disabled={stage==="Completed"&&!complete}>{stage}</option>)}</select></label>
        </div>
        <p style={{fontSize:12,color:"#475569",margin:"10px 0"}}>Site: {job.site || "Not set"} · Frequency: {job.frequency || "Once-off"}{job.notes ? " · " + job.notes : ""}</p>
        {job.photoNames?.length ? <p style={{fontSize:12,color:"#64748b"}}>Referenced photo filenames (not uploaded): {job.photoNames.join(", ")}</p> : null}
        <details style={{marginTop:10}}>
          <summary style={{cursor:"pointer",fontWeight:800,fontSize:13}}>Pre-start & completion checklist · {checks.filter((check)=>job.checklists?.[check.key]).length}/{checks.length}</summary>
          <div style={{display:"grid",gap:9,marginTop:10}}>
            {checks.map((check)=><label key={check.key} style={{display:"flex",alignItems:"center",gap:10,fontSize:13}}><input type="checkbox" checked={Boolean(job.checklists?.[check.key])} onChange={(event)=>updateJob(job.id,{checklists:{...job.checklists,[check.key]:event.target.checked}})} />{check.title}</label>)}
          </div>
        </details>
      </article>
    );
  }
  return (
    <section style={{marginTop:24,display:"grid",gap:14,color:"#0f172a"}}>
      <div style={{...cardStyle,background:"#f0fdfa"}}>
        <p style={{color:config.experience.accent,fontSize:11,fontWeight:900,textTransform:"uppercase",margin:0}}>CleanCare · cleaning operations</p>
        <h2 style={{margin:"7px 0"}}>Cleaning service control centre</h2>
        <p style={{color:"#475569",fontSize:13,margin:0}}>Interactive demonstration. Records are stored in this browser, not in a live business account. Quote requests submitted on the same browser for <strong>{clientName}</strong> appear here.</p>
      </div>
      <nav aria-label="Cleaning operations sections" style={{display:"flex",flexWrap:"wrap",gap:7}}>
        {sections.map((section)=><button type="button" key={section} onClick={()=>setTab(section)} aria-pressed={tab===section} style={{border:"1px solid #d1d5db",background:tab===section?"#0f766e":"#fff",color:tab===section?"#fff":"#0f172a",borderRadius:12,padding:"10px 12px",fontWeight:800,cursor:"pointer",minHeight:42,fontSize:12}}>{section}</button>)}
      </nav>
      {error ? <p role="alert" style={{color:"#b91c1c",margin:0}}>{error}</p> : null}
      {tab==="Dashboard" ? (
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,180px),1fr))",gap:10}}>
            {[
              ["Active jobs",activeJobs,Sparkles],
              ["New / quoted enquiries",pendingQuotes,ClipboardCheck],
              ["Teams",teams.length,Users],
              ["Quality checks",jobs.filter((job)=>job.status==="Quality check").length,CheckCircle2],
            ].map(([label,value,Icon])=>{const MetricIcon=Icon as typeof Sparkles;return <article key={String(label)} style={cardStyle}><MetricIcon size={19} color={config.experience.accent}/><div style={{fontSize:12,color:"#64748b",marginTop:8}}>{String(label)}</div><strong style={{fontSize:26}}>{String(value)}</strong></article>;})}
          </div>
          <div style={cardStyle}><strong>Recent cleaning jobs</strong><div style={{display:"grid",gap:10,marginTop:12}}>{jobs.slice(0,3).map(renderJob)}</div></div>
          <button type="button" style={buttonStyle} onClick={()=>setTab("Quote Requests")}>Review demo quote enquiries →</button>
        </>
      ) : null}
      {tab==="Quote Requests" ? (
        <div style={{display:"grid",gap:12}}>
          <h3 style={{margin:0}}>Local demo enquiries · {quotes.length}</h3>
          {quotes.length===0 ? <p>No quote requests saved in this browser for {clientName}. Open the customer website with the same client name and submit a demonstration request to test the flow.</p> : null}
          {quotes.map((q)=><article style={cardStyle} key={q.id}>
            <div style={{display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}><strong>{q.name} · {q.service}</strong><small>{new Date(q.createdAt).toLocaleString()}</small></div>
            <p style={{color:"#475569",fontSize:13,overflowWrap:"anywhere"}}>{q.phone} {q.email? " · "+q.email : ""} · {q.facilityType} · {q.location} · {q.frequency} · {q.rooms?"Rooms: "+q.rooms:""} {q.area?" · "+q.area+" m²":""}</p>
            <p style={{fontSize:12,color:"#64748b"}}>Preferred: {q.preferredDate||"Unspecified"}. {q.instructions||"No additional instructions"}{q.photoNames.length?" · Photo filenames: "+q.photoNames.join(", "):""}</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"end"}}>
              <label style={{fontSize:12}}>Request stage<select style={inputStyle} value={q.status} onChange={(event)=>updateQuote(q.id,event.target.value as Stage)}>{stages.map((stage)=><option key={stage}>{stage}</option>)}</select></label>
              <button type="button" style={buttonStyle} onClick={()=>createFromQuote(q)}>Convert to scheduled job</button>
            </div>
          </article>)}
        </div>
      ) : null}
      {tab==="Jobs" || tab==="Schedules" || tab==="Inspections" ? (
        <div style={{display:"grid",gap:12}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}><h3 style={{margin:0}}>{tab==="Jobs"?"Jobs and team assignments":tab==="Schedules"?"Service schedules":"Supervisor quality checks"}</h3><button type="button" onClick={()=>setShowCreateJob((x)=>!x)} style={buttonStyle}><Plus size={14} style={{verticalAlign:"middle"}}/> New job</button></div>
          {showCreateJob ? <form onSubmit={createJob} style={{...cardStyle,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,210px),1fr))",gap:10}}>
            <label>Customer<input style={inputStyle} name="customer" required /></label>
            <label>Service<input style={inputStyle} name="service" required /></label>
            <label>Site / area<input style={inputStyle} name="site" /></label>
            <label>Schedule<input style={inputStyle} name="schedule" type="datetime-local" /></label>
            <label>Frequency<select style={inputStyle} name="frequency"><option>Once-off</option><option>Weekly</option><option>Daily</option><option>Custom recurring</option></select></label>
            <label>Team<select style={inputStyle} name="team"><option value="">Unassigned</option>{teams.map((t)=><option key={t}>{t}</option>)}</select></label>
            <label>Instructions<input style={inputStyle} name="notes" /></label>
            <button type="submit" style={buttonStyle}>Save job locally</button>
          </form> : null}
          {(tab==="Inspections"?jobs.filter((j)=>j.status==="Quality check"||j.status==="Completed"):jobs).map(renderJob)}
        </div>
      ) : null}
      {tab==="Teams" ? <div style={cardStyle}><h3>Cleaning teams</h3><form onSubmit={(event)=>{event.preventDefault();const v=teamDraft.trim();if(v&&!teams.includes(v))setTeams((x)=>[...x,v]);setTeamDraft("");}} style={{display:"flex",gap:8,flexWrap:"wrap"}}><input style={{...inputStyle,flex:"1 1 180px"}} value={teamDraft} onChange={(e)=>setTeamDraft(e.target.value)} placeholder="New team name" /><button style={buttonStyle}>Add team</button></form>{teams.map((team)=><p key={team} style={{fontSize:13}}><Users size={14} style={{verticalAlign:"middle"}}/> {team} · {jobs.filter((j)=>j.team===team).length} assigned jobs</p>)}</div> : null}
      {tab==="Sites" ? <div style={cardStyle}><h3>Known service sites</h3>{sites.map((site)=><p key={site}><Building2 size={15} style={{verticalAlign:"middle"}}/> {site}</p>)}{sites.length===0?"No site locations recorded yet.":null}</div> : null}
      {tab==="Customers" ? <div style={cardStyle}><h3>Customers</h3>{customers.map((name)=><p key={name}>{name} · {jobs.filter((job)=>job.customer===name).length} jobs</p>)}</div> : null}
      {tab==="Recurring Contracts" ? <div style={cardStyle}><h3>Recurring cleaning</h3>{jobs.filter((job)=>/daily|weekly|month|recurring/i.test(job.frequency??job.schedule)).map(renderJob)}{!jobs.some((job)=>/daily|weekly|month|recurring/i.test(job.frequency??job.schedule))?<p>No recurring jobs configured yet.</p>:null}</div> : null}
      {tab==="Services" ? <div style={cardStyle}><h3>Service menu</h3><p style={{color:"#64748b",fontSize:13}}>Illustrative categories only; configure services for a client-specific public demo using its services query parameter.</p>{config.modules.filter((name)=>/clean|schedule|site|inspection|commercial/i.test(name)).map((name)=><p key={name}>{name}</p>)}</div> : null}
      {tab==="Supplies" ? <div style={cardStyle}><h3>Supplies / consumables</h3><form style={{display:"flex",gap:8,flexWrap:"wrap"}} onSubmit={(event)=>{event.preventDefault();const v=supplyDraft.trim();if(v)setSupplies((xs)=>[...xs,{id:"SUP-"+Date.now(),name:v,quantity:0}]);setSupplyDraft("");}}><input style={{...inputStyle,flex:"1 1 180px"}} value={supplyDraft} onChange={(e)=>setSupplyDraft(e.target.value)} placeholder="Supply name" /><button style={buttonStyle}>Add supply</button></form>{supplies.map((s)=><label key={s.id} style={{display:"flex",alignItems:"center",gap:12,marginTop:12,flexWrap:"wrap"}}>{s.name}<input aria-label={"Quantity: "+s.name} style={{...inputStyle,width:100,marginLeft:"auto"}} type="number" min="0" value={s.quantity} onChange={(e)=>setSupplies((xs)=>xs.map((x)=>x.id===s.id?{...x,quantity:Math.max(0,Number(e.target.value))}:x))} /></label>)}</div> : null}
      {tab==="More" ? <div style={cardStyle}><h3>About this cleaning workspace</h3><p>This is an interactive demonstration, not a live service. Team access, secure documents and customer notifications are available only after a commissioned rollout. Please use sample information here.</p><p>Designed &amp; developed by Bokang Jobe.</p></div> : null}
      <p style={{fontSize:11,color:"#64748b",margin:0}}>Demo records are illustrative or entered on this browser; no external notification, payment or booking is performed.</p>
    </section>
  );
}
