import { PharmaDeskPublicShell, pharmaBody, pharmaEyebrow, pharmaTitle } from "../../../../components/products/PharmaDeskPublicShell";
import { pharmacyHealthCategories, pharmacyPublicServices } from "../../../../lib/pharmadesk-site";

export default async function PharmaServicesPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Pharmacy").slice(0,120);
  return <PharmaDeskPublicShell clientName={client} current="services">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 48px"}}>
      <p style={pharmaEyebrow}>Health & pharmacy</p>
      <h1 style={{...pharmaTitle,maxWidth:860}}>A community pharmacy is more than a product shelf.</h1>
      <p style={{...pharmaBody,maxWidth:760,fontSize:16}}>Show prescription access, pharmacist support and verified health services clearly without implying that every health need can be solved online.</p>
    </section>
    <section style={{maxWidth:1100,margin:"0 auto",padding:"0 22px 50px",display:"grid",gap:16}}>
      {pharmacyPublicServices.map((service)=><article key={service.slug} style={{background:"#fff",border:"1px solid #d5e7dd",padding:24,borderRadius:16}}>
        <h2 style={{fontSize:"clamp(30px,4vw,46px)",letterSpacing:"-.035em",margin:"0 0 8px"}}>{service.title}</h2>
        <p style={{...pharmaBody,maxWidth:760}}>{service.summary}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8,marginTop:18}}>{service.items.map((item)=><div key={item} style={{borderTop:"1px solid #d5e7dd",paddingTop:10,fontSize:12,fontWeight:800}}>{item}</div>)}</div>
      </article>)}
    </section>
    <section style={{maxWidth:1100,margin:"0 auto",padding:"20px 22px 88px"}}>
      <p style={pharmaEyebrow}>Wellness categories</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,marginTop:18}}>{pharmacyHealthCategories.map((item)=><article key={item.title} style={{background:"#eaf5ef",padding:17,borderRadius:14}}><strong>{item.title}</strong><p style={pharmaBody}>{item.text}</p></article>)}</div>
      <div style={{marginTop:18,background:"#fff7ed",borderLeft:"4px solid #f59e0b",padding:"14px 16px",fontSize:12,color:"#765324",lineHeight:1.65}}>Services such as vaccinations, testing or other pharmacy-led care should appear only when the client confirms that the branch is licensed, staffed and equipped to provide them.</div>
    </section>
  </PharmaDeskPublicShell>;
}
