import { TaxFlowPublicShell, taxEyebrow, taxLead, taxTitle } from "../../../../components/products/TaxFlowPublicShell";
import { TaxFlowStartForm } from "../../../../components/products/TaxFlowStartForm";

export default async function TaxFlowStartPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Tax Firm").slice(0,120);
  return <TaxFlowPublicShell clientName={client} current="start">
    <section style={{maxWidth:1000,margin:"0 auto",padding:"82px 22px 46px"}}><p style={taxEyebrow}>Ask a tax question</p><h1 style={{...taxTitle,maxWidth:820}}>Describe the tax issue before sending the tax file.</h1><p style={{...taxLead,maxWidth:760}}>The first step establishes context, urgency and whether BURS correspondence is involved. Detailed returns, schedules and evidence move into the secure TaxFlow workflow after the engagement is accepted.</p></section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"0 22px 90px"}}><TaxFlowStartForm clientName={client}/></section>
  </TaxFlowPublicShell>;
}
