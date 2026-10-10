import { MoveTrackPublicShell, logisticsEyebrow, logisticsLead, logisticsTitle } from "../../../../components/products/MoveTrackPublicShell";
import { MoveTrackTrackingDemo } from "../../../../components/products/MoveTrackTrackingDemo";

export default async function MoveTrackTrackPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Logistics Company").slice(0,120);
  return <MoveTrackPublicShell clientName={client} current="track">
    <section style={{maxWidth:900,margin:"0 auto",padding:"86px 22px 100px"}}>
      <p style={logisticsEyebrow}>Track shipment</p><h1 style={logisticsTitle}>One reference. One clear status.</h1><p style={logisticsLead}>This showcase uses sample records, but the customer-facing experience is intentionally simple.</p><div style={{marginTop:26}}><MoveTrackTrackingDemo/></div>
    </section>
  </MoveTrackPublicShell>;
}
