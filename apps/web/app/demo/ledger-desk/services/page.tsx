import { LedgerDeskPublicShell, ledgerBody, ledgerEyebrow, ledgerTitle } from "../../../../components/products/LedgerDeskPublicShell";
import { ledgerPathways } from "../../../../lib/ledgerdesk-site";

export default async function LedgerServicesPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Accounting Firm").slice(0,120);

  return <LedgerDeskPublicShell clientName={client} current="services">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 48px"}}><p style={ledgerEyebrow}>How we help</p><h1 style={{...ledgerTitle,maxWidth:850}}>Organise the offer around business outcomes, not a wall of service names.</h1><p style={{...ledgerBody,maxWidth:760,fontSize:16}}>The full professional scope can still exist, but prospects should immediately understand the first problem the firm is best positioned to solve.</p></section>
    <section style={{maxWidth:1100,margin:"0 auto",padding:"0 22px 88px",display:"grid",gap:18}}>
      {ledgerPathways.map((item,index)=><article key={item.slug} style={{background:index===0?"#dff4ef":"#fff",border:"1px solid #d7e0dd",padding:24}}>
        <div style={{fontSize:10,color:"#0f766e",fontWeight:900,textTransform:"uppercase",letterSpacing:1.2}}>{item.kicker}</div>
        <h2 style={{fontSize:"clamp(30px,4vw,46px)",letterSpacing:"-.035em",margin:"8px 0"}}>{item.title}</h2>
        <p style={{...ledgerBody,maxWidth:760}}>{item.summary}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8,marginTop:18}}>{item.outcomes.map((x)=><div key={x} style={{borderTop:"1px solid #cfdad7",paddingTop:10,fontSize:12,fontWeight:800}}>{x}</div>)}</div>
      </article>)}
      <p style={{fontSize:10,color:"#879792"}}>Services shown are concept content until replaced with the accounting firm's verified professional scope and engagement terms.</p>
    </section>
  </LedgerDeskPublicShell>;
}
