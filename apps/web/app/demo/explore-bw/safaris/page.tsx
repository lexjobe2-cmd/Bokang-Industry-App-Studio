import Link from "next/link";
import { ExploreBWPublicShell, safariBody, safariEyebrow, safariTitle } from "../../../../components/products/ExploreBWPublicShell";
import { exploreClientQuery, explorePackages } from "../../../../lib/explorebw-site";

export default async function ExploreBWSafarisPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Botswana Safari Company").slice(0,120);
  const q=exploreClientQuery(client);
  return <ExploreBWPublicShell clientName={client} current="safaris">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 44px"}}>
      <p style={safariEyebrow}>Safari ideas</p>
      <h1 style={{...safariTitle,maxWidth:820}}>A few strong journeys are better than an overwhelming catalogue.</h1>
      <p style={{...safariBody,maxWidth:760,fontSize:16}}>Each trip clearly shows duration, start/end point, style, route and indicative pricing before asking the traveler to enquire.</p>
    </section>
    <section style={{maxWidth:1240,margin:"0 auto",padding:"0 22px 90px",display:"grid",gap:18}}>
      {explorePackages.map((item)=><Link key={item.slug} href={"/demo/explore-bw/safaris/"+item.slug+q} style={{display:"grid",gridTemplateColumns:"minmax(280px,.9fr) minmax(0,1.1fr)",background:"#fff",border:"1px solid #d9d1c1",textDecoration:"none",color:"#183126"}}>
        <img src={item.image} alt={item.title} style={{width:"100%",height:"100%",minHeight:300,objectFit:"cover"}}/>
        <div style={{padding:26}}>
          <p style={safariEyebrow}>{item.kicker}</p>
          <h2 style={{fontSize:"clamp(28px,4vw,46px)",letterSpacing:"-.035em",margin:"8px 0"}}>{item.title}</h2>
          <p style={safariBody}>{item.summary}</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10,marginTop:18,fontSize:12}}>
            <div><span style={{color:"#7d8b83"}}>Duration</span><br/><strong>{item.duration}</strong></div>
            <div><span style={{color:"#7d8b83"}}>Start / end</span><br/><strong>{item.start} → {item.end}</strong></div>
            <div><span style={{color:"#7d8b83"}}>Style</span><br/><strong>{item.travelStyle}</strong></div>
            <div><span style={{color:"#7d8b83"}}>Guide price</span><br/><strong>{item.priceGuide}</strong></div>
          </div>
          <div style={{marginTop:20,fontWeight:900,fontSize:12}}>See day-by-day itinerary →</div>
        </div>
      </Link>)}
    </section>
  </ExploreBWPublicShell>;
}
