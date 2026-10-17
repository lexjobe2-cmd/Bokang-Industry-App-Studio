import { TaxFlowPublicShell, taxEyebrow, taxLead, taxTitle } from "../../../../components/products/TaxFlowPublicShell";
import { TaxReadinessMap } from "../../../../components/products/TaxReadinessMap";

export default async function TaxFlowReadinessPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Tax Firm").slice(0,120);
  return <TaxFlowPublicShell clientName={client} current="readiness">
    <section style={{maxWidth:1000,margin:"0 auto",padding:"82px 22px 46px"}}><p style={taxEyebrow}>Tax readiness</p><h1 style={{...taxTitle,maxWidth:820}}>Map the uncertainty before preparing the return.</h1><p style={{...taxLead,maxWidth:760}}>This does not determine legal obligations or calculate tax. It helps a taxpayer identify which part of the process needs clarification first.</p></section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"0 22px 90px"}}><TaxReadinessMap/></section>
  </TaxFlowPublicShell>;
}
