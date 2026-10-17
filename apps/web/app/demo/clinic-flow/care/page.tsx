import { ClinicFlowPublicShell, clinicBody, clinicEyebrow, clinicTitle } from "../../../../components/products/ClinicFlowPublicShell";
import { clinicCareAreas } from "../../../../lib/clinicflow-site";

export default async function ClinicCarePage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Clinic").slice(0,120);
  return <ClinicFlowPublicShell clientName={client} current="care">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 48px"}}><p style={clinicEyebrow}>Care & services</p><h1 style={{...clinicTitle,maxWidth:850}}>Help patients choose a starting point without trying to diagnose them online.</h1><p style={{...clinicBody,maxWidth:760,fontSize:16}}>Care pathways explain appointment categories and continuity. They do not tell a patient what condition they have or replace clinical assessment.</p></section>
    <section style={{maxWidth:1100,margin:"0 auto",padding:"0 22px 88px",display:"grid",gap:16}}>
      {clinicCareAreas.map((area)=><article key={area.slug} style={{background:"#fff",border:"1px solid #d7e7eb",padding:24,borderRadius:16}}>
        <h2 style={{fontSize:"clamp(30px,4vw,46px)",letterSpacing:"-.035em",margin:"0 0 8px"}}>{area.title}</h2>
        <p style={{...clinicBody,maxWidth:760}}>{area.summary}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8,marginTop:18}}>{area.reasons.map((reason)=><div key={reason} style={{borderTop:"1px solid #d7e7eb",paddingTop:10,fontSize:12,fontWeight:800}}>{reason}</div>)}</div>
      </article>)}
      <div style={{background:"#fff4e8",borderLeft:"4px solid #f59e0b",padding:"14px 16px",fontSize:12,color:"#725523",lineHeight:1.65}}>For emergencies or rapidly worsening symptoms, do not wait for a routine website appointment request. Contact local emergency services or attend an appropriate emergency facility.</div>
    </section>
  </ClinicFlowPublicShell>;
}
