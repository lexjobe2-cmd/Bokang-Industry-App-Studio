import { ClinicFlowPublicShell, clinicBody, clinicEyebrow, clinicTitle } from "../../../../components/products/ClinicFlowPublicShell";
import { patientResources } from "../../../../lib/clinicflow-site";

export default async function ClinicPatientInfoPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Clinic").slice(0,120);
  return <ClinicFlowPublicShell clientName={client} current="patient-info">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 48px"}}><p style={clinicEyebrow}>Patient information</p><h1 style={{...clinicTitle,maxWidth:850}}>Reduce uncertainty before the patient reaches reception.</h1></section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"0 22px 88px"}}>
      {patientResources.map((item,index)=><article key={item.title} style={{display:"grid",gridTemplateColumns:"70px minmax(0,1fr)",gap:22,padding:"24px 0",borderTop:index===0?"1px solid #d7e7eb":undefined,borderBottom:"1px solid #d7e7eb"}}><span style={{fontSize:10,color:"#91a4aa"}}>0{index+1}</span><div><h2 style={{fontSize:27,letterSpacing:"-.03em",margin:"0 0 7px"}}>{item.title}</h2><p style={{...clinicBody,margin:0}}>{item.summary}</p></div></article>)}
      <div style={{marginTop:28,background:"#f3f8f9",border:"1px solid #d7e7eb",padding:18}}><strong>Medical aid / payment</strong><p style={clinicBody}>A production site should clearly state which medical-aid networks the clinic participates in, what patients should bring, and how self-pay or uncovered services are handled. Those claims should be verified with the clinic and relevant fund/network information.</p></div>
      <div style={{marginTop:12,background:"#fff4e8",borderLeft:"4px solid #f59e0b",padding:"14px 16px",fontSize:12,color:"#725523",lineHeight:1.65}}>This public information is not medical advice. Clinical questions should be discussed with a qualified healthcare professional.</div>
    </section>
  </ClinicFlowPublicShell>;
}
