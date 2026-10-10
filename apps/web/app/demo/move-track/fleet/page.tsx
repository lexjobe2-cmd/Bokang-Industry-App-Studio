import { MoveTrackPublicShell, logisticsBody, logisticsEyebrow, logisticsTitle } from "../../../../components/products/MoveTrackPublicShell";
import { moveTrackFleet } from "../../../../lib/movetrack-site";

export default async function MoveTrackFleetPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Logistics Company").slice(0,120);
  return <MoveTrackPublicShell clientName={client} current="fleet">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 46px"}}><p style={logisticsEyebrow}>Fleet</p><h1 style={{...logisticsTitle,maxWidth:850}}>Show the equipment that gives the business its operating capacity.</h1><p style={{...logisticsBody,maxWidth:760,fontSize:16}}>A final client site should use verified vehicle counts, payloads, trailer types, maintenance standards and real fleet photography.</p></section>
    <section style={{maxWidth:1240,margin:"0 auto",padding:"0 22px 80px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
      {moveTrackFleet.map((item,index)=><article key={item.type} style={{background:index===0?"#101827":"#fff",color:index===0?"#fff":"#101827",border:"1px solid #d7dce1",padding:22,minHeight:180}}><div style={{fontSize:10,color:index===0?"#7fb1ff":"#1d4ed8",fontWeight:900}}>0{index+1}</div><h2 style={{fontSize:24}}>{item.type}</h2><p style={{fontSize:13,lineHeight:1.7,color:index===0?"#c5cfdd":"#667085"}}>{item.use}</p></article>)}
    </section>
    <section style={{background:"#dfe7f1",padding:"66px 0"}}><div style={{maxWidth:1100,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20}}>{[["Maintenance","Show how preventive servicing and defect control protect availability."],["Safety","Publish the operator's verified safety approach and site requirements."],["Tracking","Explain which fleet/shipment visibility is available to customers."],["Compliance","Surface real licences, certificates and standards only after verification."]].map(([title,text])=><article key={title}><strong>{title}</strong><p style={logisticsBody}>{text}</p></article>)}</div></section>
  </MoveTrackPublicShell>;
}
