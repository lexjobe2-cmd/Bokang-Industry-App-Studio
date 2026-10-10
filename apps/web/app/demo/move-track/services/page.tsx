import { MoveTrackPublicShell, logisticsBody, logisticsEyebrow, logisticsTitle } from "../../../../components/products/MoveTrackPublicShell";
import { moveTrackServices } from "../../../../lib/movetrack-site";

export default async function MoveTrackServicesPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Logistics Company").slice(0,120);
  return <MoveTrackPublicShell clientName={client} current="services">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 46px"}}><p style={logisticsEyebrow}>Services</p><h1 style={{...logisticsTitle,maxWidth:860}}>Make it easy for a shipper to decide whether the company fits the job.</h1><p style={{...logisticsBody,maxWidth:760,fontSize:16}}>Each service explains what it is useful for rather than hiding everything behind generic “logistics solutions” language.</p></section>
    <section style={{maxWidth:1240,margin:"0 auto",padding:"0 22px 88px",display:"grid",gap:18}}>
      {moveTrackServices.map((service)=><article id={service.slug} key={service.slug} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",background:"#fff",border:"1px solid #d7dce1",overflow:"hidden"}}>
        <img src={service.image} alt={service.title} style={{width:"100%",height:"100%",minHeight:320,objectFit:"cover"}}/>
        <div style={{padding:26}}><p style={logisticsEyebrow}>{service.title}</p><h2 style={{fontSize:"clamp(28px,4vw,44px)",margin:"8px 0"}}>{service.title}</h2><p style={logisticsBody}>{service.summary}</p><ul style={{paddingLeft:18,lineHeight:1.9,color:"#475467",fontSize:13}}>{service.details.map((x)=><li key={x}>{x}</li>)}</ul><a href={service.source} target="_blank" rel="noreferrer" style={{fontSize:10,color:"#98a2b3"}}>Representative image source</a></div>
      </article>)}
    </section>
  </MoveTrackPublicShell>;
}
