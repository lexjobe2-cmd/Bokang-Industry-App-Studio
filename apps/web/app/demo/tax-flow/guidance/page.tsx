import { TaxFlowPublicShell, taxBody, taxEyebrow, taxTitle } from "../../../../components/products/TaxFlowPublicShell";
import { taxGuidanceCards, taxInsights } from "../../../../lib/taxflow-site";

export default async function TaxFlowGuidancePage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Tax Firm").slice(0,120);
  return <TaxFlowPublicShell clientName={client} current="guidance">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 48px"}}><p style={taxEyebrow}>Guidance hub</p><h1 style={{...taxTitle,maxWidth:860}}>Separate official tax rules from the firm's explanatory content.</h1><p style={{...taxBody,maxWidth:760,fontSize:16}}>Rates, forms, deadlines and law change. This page keeps the authoritative BURS sources visible instead of copying volatile tax rules into marketing pages.</p></section>
    <section style={{maxWidth:1100,margin:"0 auto",padding:"0 22px 46px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
      {taxGuidanceCards.map((card)=><a key={card.title} href={card.href} target="_blank" rel="noreferrer" style={{background:"#fff",border:"1px solid #dbe0ea",padding:20,textDecoration:"none",color:"#17203a"}}><strong>{card.title}</strong><p style={taxBody}>{card.text}</p><span style={{fontSize:11,fontWeight:900,color:"#4f46e5"}}>Official BURS source ↗</span></a>)}
    </section>
    <section style={{maxWidth:1050,margin:"0 auto",padding:"20px 22px 88px",borderTop:"1px solid #dbe0ea"}}>
      <p style={{...taxEyebrow,marginTop:28}}>Firm insights</p>
      {taxInsights.map((item,index)=><article key={item.title} style={{display:"grid",gridTemplateColumns:"70px minmax(0,1fr)",gap:22,padding:"24px 0",borderBottom:"1px solid #dbe0ea"}}><span style={{fontSize:10,color:"#8b94a5"}}>0{index+1}</span><div><h2 style={{fontSize:27,letterSpacing:"-.03em",margin:"0 0 7px"}}>{item.title}</h2><p style={{...taxBody,margin:0}}>{item.summary}</p></div></article>)}
      <p style={{fontSize:10,color:"#8b94a5",marginTop:18}}>Insight summaries are demonstration content and are not tax advice.</p>
    </section>
  </TaxFlowPublicShell>;
}
