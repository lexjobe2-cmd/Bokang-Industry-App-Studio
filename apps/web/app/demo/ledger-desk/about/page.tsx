import { LedgerDeskPublicShell, ledgerBody, ledgerEyebrow, ledgerLead, ledgerTitle } from "../../../../components/products/LedgerDeskPublicShell";

export default async function LedgerAboutPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Accounting Firm").slice(0,120);

  return <LedgerDeskPublicShell clientName={client} current="about">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:48}}>
        <div><p style={ledgerEyebrow}>About the firm</p><h1 style={ledgerTitle}>The strongest accounting relationship is recurring, understandable and useful.</h1></div>
        <div><p style={ledgerLead}>{client} is presented here as a Botswana accounting and finance partner focused on clean monthly processes, timely reporting and practical business decisions.</p><p style={ledgerBody}>A final site should replace concept copy with the firm's verified partners, BICA status, practising certificates where applicable, service licences, sectors, office details and actual experience.</p></div>
      </div>
    </section>
    <section style={{background:"#15302d",color:"#fff",padding:"70px 0"}}><div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:26}}>
      {[["Accuracy","Get the underlying records and reconciliations right before drawing conclusions."],["Timeliness","Useful numbers arrive while management can still act on them."],["Clarity","Explain finance in a way owners and managers can use, not only accountants."],["Professional standards","Publish verified credentials and maintain appropriate quality, ethics and confidentiality controls."]].map(([title,text])=><article key={title}><strong style={{fontSize:20}}>{title}</strong><p style={{color:"#bdd0cb",fontSize:13,lineHeight:1.7}}>{text}</p></article>)}
    </div></section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"72px 22px"}}><p style={ledgerBody}>BICA states that it represents the accounting profession in Botswana and publishes active member firms and members in good standing. A commissioned site should link to the firm's verifiable status where appropriate rather than relying on unverified badges.</p><a href="https://www.bica.org.bw/active-member-firms" target="_blank" rel="noreferrer" style={{fontWeight:900,color:"#0f766e"}}>BICA active member firms ↗</a><p style={{fontSize:10,color:"#879792",marginTop:18}}>All company statements above are proposal copy until verified by the client.</p></section>
  </LedgerDeskPublicShell>;
}
