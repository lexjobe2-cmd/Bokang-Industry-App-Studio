import { TaxFlowPublicShell, taxBody, taxEyebrow, taxTitle } from "../../../../components/products/TaxFlowPublicShell";
import { taxClientPaths } from "../../../../lib/taxflow-site";

export default async function TaxFlowServicesPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Tax Firm").slice(0,120);
  return <TaxFlowPublicShell clientName={client} current="services">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 48px"}}><p style={taxEyebrow}>Tax services</p><h1 style={{...taxTitle,maxWidth:850}}>Organise the tax practice by taxpayer context and decision—not by internal department names.</h1></section>
    <section style={{maxWidth:1100,margin:"0 auto",padding:"0 22px 88px",display:"grid",gap:18}}>
      {taxClientPaths.map((path)=><article key={path.slug} style={{background:"#fff",border:"1px solid #dbe0ea",padding:24}}>
        <div style={{fontSize:10,color:"#4f46e5",fontWeight:900,textTransform:"uppercase",letterSpacing:1.15}}>{path.kicker}</div>
        <h2 style={{fontSize:"clamp(30px,4vw,46px)",letterSpacing:"-.035em",margin:"8px 0"}}>{path.title}</h2>
        <p style={{...taxBody,maxWidth:760}}>{path.summary}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8,marginTop:18}}>{path.topics.map((topic)=><div key={topic} style={{borderTop:"1px solid #dbe0ea",paddingTop:10,fontSize:12,fontWeight:800}}>{topic}</div>)}</div>
      </article>)}
      <p style={{fontSize:10,color:"#8b94a5"}}>Services shown are proposal content until replaced with the firm's verified tax capability and engagement terms.</p>
    </section>
  </TaxFlowPublicShell>;
}
