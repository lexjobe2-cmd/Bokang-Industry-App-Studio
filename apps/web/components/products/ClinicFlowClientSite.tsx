"use client";

import Link from "next/link";
import { ClinicFlowPublicShell, clinicBody, clinicEyebrow, clinicLead, clinicTitle } from "./ClinicFlowPublicShell";
import { ClinicAppointmentRequest } from "./ClinicAppointmentRequest";
import { KeylessMap } from "../shared/KeylessMap";
import { clinicCareAreas, clinicClientQuery, clinicTeam, patientResources } from "../../lib/clinicflow-site";

export function ClinicFlowClientSite({clientName}:{clientName:string}){
  const q=clinicClientQuery(clientName);

  return <ClinicFlowPublicShell clientName={clientName} current="home">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"78px 22px 62px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:44,alignItems:"center"}}>
      <div>
        <p style={clinicEyebrow}>Primary care · continuity · easier access</p>
        <h1 style={clinicTitle}>Get to the right care without guessing where to start.</h1>
        <p style={{...clinicLead,maxWidth:680}}>A clinic website concept for {clientName}, designed around clinician trust, clear care pathways and a simple appointment request.</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:22}}>
          <Link href={"/demo/clinic-flow/book"+q} style={{background:"#0e7490",color:"#fff",padding:"11px 15px",borderRadius:999,fontWeight:900,textDecoration:"none"}}>Request an appointment</Link>
          <Link href={"/demo/clinic-flow/care"+q} style={{border:"1px solid #b5cfd6",color:"#17343d",padding:"11px 15px",borderRadius:999,fontWeight:900,textDecoration:"none"}}>Explore care</Link>
        </div>
      </div>
      <div>
        <a href="https://www.pexels.com/photo/doctor-showing-diagnosis-to-black-patient-in-hospital-6303652/" target="_blank" rel="noreferrer">
          <img src="https://images.pexels.com/photos/6303652/pexels-photo-6303652.jpeg?auto=compress&dpr=1&h=1000&w=1300" alt="Healthcare professional speaking with a Black patient" style={{width:"100%",height:"min(72vw,640px)",objectFit:"cover",display:"block",borderRadius:18}}/>
        </a>
        <div style={{fontSize:10,color:"#7f969d",marginTop:6}}>Representative patient-care image · Pexels / Klaus Nielsen</div>
      </div>
    </section>

    <section style={{background:"#17343d",color:"#fff",padding:"68px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(235px,1fr))",gap:28}}>
        {[
          ["Find the right visit","Start with the kind of care you need instead of choosing from an unexplained list of appointments."],
          ["Know who you may see","Clinician profiles should make qualifications, care focus and availability understandable."],
          ["Prepare before arrival","Give patients clear information about documents, arrival, payment/medical aid and follow-up."],
          ["Keep the portal separate","Results, messages and detailed records belong in a secure patient account, not on the public website."]
        ].map(([title,text])=><article key={title}><strong style={{fontSize:20}}>{title}</strong><p style={{color:"#c2d2d6",fontSize:13,lineHeight:1.7}}>{text}</p></article>)}
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <p style={clinicEyebrow}>Care & services</p>
      <h2 style={{...clinicTitle,maxWidth:820}}>Organise care around what the patient is trying to do.</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14,marginTop:30}}>
        {clinicCareAreas.map((area)=><article key={area.slug} style={{background:"#fff",border:"1px solid #d7e7eb",padding:20,borderRadius:16}}>
          <h3 style={{fontSize:24,letterSpacing:"-.025em",margin:"0 0 8px"}}>{area.title}</h3>
          <p style={clinicBody}>{area.summary}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:12}}>{area.reasons.map((reason)=><span key={reason} style={{background:"#f3f8f9",border:"1px solid #d9e8eb",padding:"6px 8px",fontSize:10,borderRadius:999}}>{reason}</span>)}</div>
        </article>)}
      </div>
      <Link href={"/demo/clinic-flow/care"+q} style={{display:"inline-block",marginTop:18,color:"#0e7490",fontWeight:900}}>View patient care pathways →</Link>
    </section>

    <section style={{background:"#e8f3f5",padding:"78px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px"}}>
        <p style={clinicEyebrow}>Clinicians</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16,marginTop:24}}>
          {clinicTeam.map((person)=><article key={person.name} style={{background:"#fff",border:"1px solid #d7e7eb",overflow:"hidden",borderRadius:16}}>
            <a href={person.source} target="_blank" rel="noreferrer"><img src={person.image} alt={"Representative portrait for "+person.name} style={{width:"100%",height:390,objectFit:"cover",display:"block"}}/></a>
            <div style={{padding:18}}><h3 style={{fontSize:25,letterSpacing:"-.025em",margin:"0 0 5px"}}>{person.name}</h3><div style={{fontSize:10,color:"#0e7490",fontWeight:900,textTransform:"uppercase",letterSpacing:1.1}}>{person.role}</div><p style={{fontSize:12,fontWeight:800}}>{person.focus}</p><p style={clinicBody}>{person.bio}</p><div style={{fontSize:9,color:"#91a4aa"}}>Concept profile only — replace with verified clinician credentials.</div></div>
          </article>)}
        </div>
        <Link href={"/demo/clinic-flow/team"+q} style={{display:"inline-block",marginTop:18,color:"#0e7490",fontWeight:900}}>Meet the clinician team concept →</Link>
      </div>
    </section>

    <section style={{maxWidth:1180,margin:"0 auto",padding:"82px 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:38}}>
      <div>
        <p style={clinicEyebrow}>Patient access</p>
        <h2 style={clinicTitle}>A clinic website should help patients arrive prepared.</h2>
        <p style={clinicBody}>Cleveland Clinic's current digital front door separates public access—find care, providers, appointments—from secure patient functions such as results and messaging. ClinicFlow follows that same boundary: public scheduling first, private patient operations behind the portal.</p>
        <div style={{display:"grid",gap:10,marginTop:20}}>{patientResources.map((resource)=><article key={resource.title} style={{borderTop:"1px solid #d7e7eb",paddingTop:12}}><strong>{resource.title}</strong><p style={clinicBody}>{resource.summary}</p></article>)}</div>
      </div>
      <ClinicAppointmentRequest clientName={clientName}/>
    </section>

    <section style={{background:"#fff",padding:"76px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:38}}>
        <div><p style={clinicEyebrow}>Trust & location</p><h2 style={clinicTitle}>Patients should be able to verify the practice and find it easily.</h2><p style={clinicBody}>Botswana requires private health professionals to hold the relevant professional registration/licensing. A commissioned site should publish only verified practitioner and facility information, and should never invent accreditation badges.</p><a href="https://gov.bw/accreditation-professionals/registration-private-health-professionals" target="_blank" rel="noreferrer" style={{fontWeight:900,color:"#0e7490"}}>Botswana private-practice licensing information ↗</a></div>
        <KeylessMap points={[{name:clientName,lat:-24.6282,lng:25.9231,detail:"Concept clinic location · Gaborone"}]} center={[25.9231,-24.6282]} zoom={12}/>
      </div>
    </section>
  </ClinicFlowPublicShell>;
}
