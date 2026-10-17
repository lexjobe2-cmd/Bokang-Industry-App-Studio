import { BuildQuotePublicShell, buildQuoteBody, buildQuoteEyebrow, buildQuoteLead, buildQuoteTitle } from "../../../../components/products/BuildQuotePublicShell";

export default async function BuildQuoteAboutPage({searchParams}:{searchParams:Promise<{client?:string}>}) {
  const query=await searchParams;
  const client=(query.client||"Your Construction Company").slice(0,120);

  return <BuildQuotePublicShell clientName={client} current="about">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"86px 22px"}}>
      <p style={buildQuoteEyebrow}>About the company</p>
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,.8fr) minmax(0,1.2fr)",gap:50,marginTop:12}}>
        <h1 style={buildQuoteTitle}>A construction brand should tell people what it stands for.</h1>
        <div>
          <p style={buildQuoteLead}>{client} is presented here as a practical Botswana construction partner focused on dependable delivery, quality workmanship and clear communication.</p>
          <p style={buildQuoteBody}>The final site would replace this concept copy with the company's verified history, leadership, accreditations, safety record, geographic coverage and project credentials. The structure stays intentionally simple so visitors understand the business before they are asked to fill in a form.</p>
        </div>
      </div>
    </section>

    <section style={{background:"#171717",color:"#fff",padding:"72px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:28}}>
        {[
          ["Mission","Deliver practical, durable projects with disciplined planning and responsible execution."],
          ["Vision","Become a trusted Botswana construction partner known for dependable delivery and long-term client relationships."],
          ["Values","Safety, quality, accountability, respect and clear communication."],
          ["Local focus","Build for Botswana's commercial, institutional, residential and infrastructure needs."]
        ].map(([title,text])=><article key={title}><strong style={{fontSize:22}}>{title}</strong><p style={{color:"#b8b8b8",lineHeight:1.7,fontSize:13}}>{text}</p></article>)}
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"86px 22px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
        {[["Leadership","Introduce the people responsible for delivery and client relationships."],["Safety","Explain how the company plans work, manages risk and protects people on site."],["Quality","Show how workmanship, inspections and handover standards are managed."],["Community","Describe local employment, supplier participation and community commitments where relevant."]].map(([title,text])=><article key={title} style={{borderTop:"2px solid #171717",paddingTop:14}}><strong>{title}</strong><p style={buildQuoteBody}>{text}</p></article>)}
      </div>
      <p style={{fontSize:10,color:"#8a8173",marginTop:24}}>All company statements on this page are proposal copy and should be replaced with client-approved facts before launch.</p>
    </section>
  </BuildQuotePublicShell>;
}
