import { BuildQuotePublicShell, buildQuoteBody, buildQuoteEyebrow, buildQuoteTitle } from "../../../../components/products/BuildQuotePublicShell";
import { buildQuoteServices } from "../../../../lib/buildquote-site";

export default async function BuildQuoteServicesPage({searchParams}:{searchParams:Promise<{client?:string}>}) {
  const query=await searchParams;
  const client=(query.client||"Your Construction Company").slice(0,120);

  return <BuildQuotePublicShell clientName={client} current="services">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"84px 22px 50px"}}>
      <p style={buildQuoteEyebrow}>Capabilities</p>
      <h1 style={{...buildQuoteTitle,maxWidth:800}}>Explain what the company does without turning the site into a catalogue.</h1>
    </section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"0 22px 90px",borderTop:"1px solid #cfc8bb"}}>
      {buildQuoteServices.map((service,index)=><article key={service.title} style={{display:"grid",gridTemplateColumns:"80px minmax(0,1fr)",gap:24,padding:"28px 0",borderBottom:"1px solid #cfc8bb"}}>
        <span style={{fontSize:12,color:"#8a8173"}}>{String(index+1).padStart(2,"0")}</span>
        <div><h2 style={{margin:"0 0 8px",fontSize:28}}>{service.title}</h2><p style={{...buildQuoteBody,margin:0}}>{service.text}</p></div>
      </article>)}
      <div style={{marginTop:42,padding:22,background:"#171717",color:"#fff"}}>
        <strong style={{fontSize:22}}>Need something more specialised?</strong>
        <p style={{fontSize:13,color:"#c8c8c8",lineHeight:1.7}}>The public site should show the main capabilities. Detailed BOQs, rate cards, tenders and quotation workflows belong behind the operational system—not on the homepage.</p>
      </div>
    </section>
  </BuildQuotePublicShell>;
}
