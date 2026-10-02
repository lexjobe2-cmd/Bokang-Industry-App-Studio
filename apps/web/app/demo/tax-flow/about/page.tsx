import { TaxFlowPublicShell, taxBody, taxEyebrow, taxLead, taxTitle } from "../../../../components/products/TaxFlowPublicShell";

export default async function TaxFlowAboutPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Tax Firm").slice(0,120);
  return <TaxFlowPublicShell clientName={client} current="about">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:48}}>
        <div><p style={taxEyebrow}>About the tax practice</p><h1 style={taxTitle}>Compliance when required. Advice before it becomes urgent.</h1></div>
        <div><p style={taxLead}>{client} is presented here as a Botswana tax practice built around accurate preparation, visible workflow and year-round advisory conversations.</p><p style={taxBody}>A final site should replace concept copy with verified tax practitioners, professional memberships, sector experience, service scope, office details and actual advisory credentials.</p></div>
      </div>
    </section>
    <section style={{background:"#17203a",color:"#fff",padding:"70px 0"}}><div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:26}}>
      {[["Accuracy","Tax work should be prepared and reviewed against authoritative information."],["Visibility","Clients should know what is missing, where the work is and what happens next."],["Timeliness","Deadlines should be visible before they become emergency work."],["Advice","Tax questions belong in business decisions throughout the year, not only at filing time."]].map(([title,text])=><article key={title}><strong style={{fontSize:20}}>{title}</strong><p style={{color:"#bec5d4",fontSize:13,lineHeight:1.7}}>{text}</p></article>)}
    </div></section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"72px 22px"}}><p style={taxBody}>The 2026 global tax benchmark shows tax practices continuing to expand advisory work as clients seek more than return preparation. The firm's actual claims, credentials and tax specialisms should still be verified before publication.</p><p style={{fontSize:10,color:"#8b94a5"}}>All company statements above are proposal copy until verified by the client.</p></section>
  </TaxFlowPublicShell>;
}
