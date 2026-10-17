import { MoveTrackPublicShell, logisticsEyebrow, logisticsLead, logisticsTitle } from "../../../../components/products/MoveTrackPublicShell";
import { MoveTrackQuoteForm } from "../../../../components/products/MoveTrackQuoteForm";

export default async function MoveTrackQuotePage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Logistics Company").slice(0,120);
  return <MoveTrackPublicShell clientName={client} current="quote">
    <section style={{maxWidth:1050,margin:"0 auto",padding:"82px 22px 42px"}}><p style={logisticsEyebrow}>Request a quote</p><h1 style={{...logisticsTitle,maxWidth:820}}>Give the commercial team enough information to price the movement.</h1><p style={{...logisticsLead,maxWidth:760}}>Origin, destination, load, weight and timing are more valuable than a generic “contact us” message.</p></section>
    <section style={{maxWidth:1050,margin:"0 auto",padding:"0 22px 90px"}}><MoveTrackQuoteForm clientName={client}/></section>
  </MoveTrackPublicShell>;
}
