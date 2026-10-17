import { ClinicFlowPublicShell, clinicBody, clinicEyebrow, clinicTitle } from "../../../../components/products/ClinicFlowPublicShell";
import { clinicTeam } from "../../../../lib/clinicflow-site";

export default async function ClinicTeamPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Clinic").slice(0,120);
  return <ClinicFlowPublicShell clientName={client} current="team">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 48px"}}><p style={clinicEyebrow}>Our clinicians</p><h1 style={{...clinicTitle,maxWidth:840}}>Clinician profiles are part of patient access—not decoration.</h1><p style={{...clinicBody,maxWidth:760,fontSize:16}}>A production profile should publish verified registration, qualifications, practice scope, languages and availability where appropriate.</p></section>
    <section style={{maxWidth:1100,margin:"0 auto",padding:"0 22px 88px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:18}}>
      {clinicTeam.map((person)=><article key={person.name} style={{background:"#fff",border:"1px solid #d7e7eb",overflow:"hidden",borderRadius:16}}>
        <a href={person.source} target="_blank" rel="noreferrer"><img src={person.image} alt={"Representative portrait for "+person.name} style={{width:"100%",height:430,objectFit:"cover",display:"block"}}/></a>
        <div style={{padding:20}}><h2 style={{fontSize:28,letterSpacing:"-.03em",margin:"0 0 5px"}}>{person.name}</h2><div style={{fontSize:10,color:"#0e7490",fontWeight:900,textTransform:"uppercase",letterSpacing:1.1}}>{person.role}</div><p style={{fontWeight:800,fontSize:12}}>{person.focus}</p><p style={clinicBody}>{person.bio}</p><p style={{fontSize:9,color:"#91a4aa"}}>Concept clinician only — not presented as an actual practitioner at {client}.</p></div>
      </article>)}
    </section>
  </ClinicFlowPublicShell>;
}
