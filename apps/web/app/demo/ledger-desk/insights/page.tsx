import { LedgerDeskPublicShell, ledgerBody, ledgerEyebrow, ledgerTitle } from "../../../../components/products/LedgerDeskPublicShell";
import { LedgerHealthCheck } from "../../../../components/products/LedgerHealthCheck";
import { ledgerInsights } from "../../../../lib/ledgerdesk-site";

export default async function LedgerInsightsPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Accounting Firm").slice(0,120);

  return <LedgerDeskPublicShell clientName={client} current="insights">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 48px"}}><p style={ledgerEyebrow}>Insights</p><h1 style={{...ledgerTitle,maxWidth:850}}>Useful finance content should help a business owner do or decide something.</h1></section>
    <section style={{maxWidth:1050,margin:"0 auto",padding:"0 22px 48px",borderTop:"1px solid #cfdad7"}}>
      {ledgerInsights.map((item,index)=><article key={item.title} style={{display:"grid",gridTemplateColumns:"70px minmax(0,1fr)",gap:22,padding:"26px 0",borderBottom:"1px solid #cfdad7"}}><span style={{fontSize:10,color:"#879792"}}>0{index+1}</span><div><h2 style={{fontSize:28,letterSpacing:"-.03em",margin:"0 0 7px"}}>{item.title}</h2><p style={{...ledgerBody,margin:0}}>{item.summary}</p></div></article>)}
    </section>
    <section style={{maxWidth:900,margin:"0 auto",padding:"24px 22px 90px"}}><LedgerHealthCheck/><p style={{fontSize:10,color:"#879792",marginTop:14}}>Interactive result is a demonstration aid and not accounting, audit or financial advice.</p></section>
  </LedgerDeskPublicShell>;
}
