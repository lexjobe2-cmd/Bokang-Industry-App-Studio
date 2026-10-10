import { PharmaDeskPublicShell, pharmaEyebrow, pharmaLead, pharmaTitle } from "../../../../components/products/PharmaDeskPublicShell";
import { PharmaPrescriptionRequest } from "../../../../components/products/PharmaPrescriptionRequest";

export default async function PharmaPrescriptionsPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Pharmacy").slice(0,120);
  return <PharmaDeskPublicShell clientName={client} current="prescriptions">
    <section style={{maxWidth:1000,margin:"0 auto",padding:"82px 22px 46px"}}>
      <p style={pharmaEyebrow}>Prescriptions</p>
      <h1 style={{...pharmaTitle,maxWidth:820}}>Start the refill or dispensing conversation from your phone.</h1>
      <p style={{...pharmaLead,maxWidth:760}}>The website can collect the request and fulfilment preference, but prescription validity, medicine suitability, stock and dispensing remain subject to pharmacist review.</p>
    </section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"0 22px 90px"}}><PharmaPrescriptionRequest clientName={client}/></section>
  </PharmaDeskPublicShell>;
}
