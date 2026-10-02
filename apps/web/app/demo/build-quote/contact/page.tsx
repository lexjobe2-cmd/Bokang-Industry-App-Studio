import { BuildQuotePublicShell, buildQuoteBody, buildQuoteEyebrow, buildQuoteLead, buildQuoteTitle } from "../../../../components/products/BuildQuotePublicShell";
import { BuildQuoteContactForm } from "../../../../components/products/BuildQuoteContactForm";
import { KeylessMap } from "../../../../components/shared/KeylessMap";

export default async function BuildQuoteContactPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Construction Company").slice(0,120);

  return <BuildQuotePublicShell clientName={client} current="contact">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 54px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:48}}>
      <div><p style={buildQuoteEyebrow}>Contact</p><h1 style={buildQuoteTitle}>Start with a conversation.</h1></div>
      <div><p style={buildQuoteLead}>A construction website does not need to force a detailed quote form on the first visit.</p><p style={buildQuoteBody}>A name, phone number and short brief are enough to start. Drawings, measurements, BOQs and site information can follow once the contractor responds.</p></div>
    </section>
    <section style={{maxWidth:1240,margin:"0 auto",padding:"0 22px 84px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:22}}>
      <div style={{background:"#fff",padding:22,border:"1px solid #d7d0c4"}}>
        <BuildQuoteContactForm />
      </div>
      <div><KeylessMap points={[{name:client,lat:-24.6282,lng:25.9231,detail:"Concept office location · Gaborone"}]} center={[25.9231,-24.6282]} zoom={12}/><p style={{fontSize:10,color:"#8a8173"}}>Concept map centred on Gaborone until the client&apos;s verified office address is supplied.</p></div>
    </section>
  </BuildQuotePublicShell>;
}
