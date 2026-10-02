import { notFound } from "next/navigation";
import Link from "next/link";
import { ExploreBWPublicShell, safariBody, safariEyebrow, safariLead, safariTitle } from "../../../../../components/products/ExploreBWPublicShell";
import { exploreClientQuery, explorePackages } from "../../../../../lib/explorebw-site";

export function generateStaticParams(){return explorePackages.map((item)=>({safari:item.slug}));}

export default async function ExploreBWSafariPage({params,searchParams}:{params:Promise<{safari:string}>;searchParams:Promise<{client?:string}>}){
  const {safari}=await params;
  const query=await searchParams;
  const client=(query.client||"Your Botswana Safari Company").slice(0,120);
  const item=explorePackages.find((entry)=>entry.slug===safari);
  if(!item) notFound();
  const q=exploreClientQuery(client);

  return <ExploreBWPublicShell clientName={client} current="safaris">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"64px 22px 28px"}}>
      <p style={safariEyebrow}>{item.kicker}</p>
      <h1 style={{...safariTitle,maxWidth:920}}>{item.title}</h1>
      <p style={{...safariLead,maxWidth:760}}>{item.summary}</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:18}}>{[item.duration,item.start+" → "+item.end,item.travelStyle,item.priceGuide].map((tag)=><span key={tag} style={{background:"#fff",border:"1px solid #d9d1c1",borderRadius:999,padding:"8px 10px",fontSize:11,fontWeight:850}}>{tag}</span>)}</div>
    </section>
    <section style={{maxWidth:1240,margin:"0 auto",padding:"0 22px"}}><a href={item.source} target="_blank" rel="noreferrer"><img src={item.image} alt={item.title} style={{width:"100%",height:"min(68vw,680px)",objectFit:"cover",display:"block"}}/></a><div style={{fontSize:10,color:"#8a8173",marginTop:6}}>Representative Botswana safari image · source linked above</div></section>
    <section style={{maxWidth:1050,margin:"0 auto",padding:"70px 22px"}}>
      <p style={safariEyebrow}>Day by day</p>
      <h2 style={{...safariTitle,fontSize:"clamp(32px,5vw,56px)"}}>Know how the journey flows before you enquire.</h2>
      <div style={{marginTop:26,borderTop:"1px solid #cbc1b0"}}>
        {item.itinerary.map((day)=><article key={day.day} style={{display:"grid",gridTemplateColumns:"120px minmax(0,1fr)",gap:22,padding:"22px 0",borderBottom:"1px solid #cbc1b0"}}><strong>{day.day}</strong><div><h3 style={{margin:"0 0 6px",fontSize:20}}>{day.title}</h3><p style={{...safariBody,margin:0}}>{day.detail}</p></div></article>)}
      </div>
    </section>
    <section style={{background:"#183126",color:"#fff",padding:"66px 0"}}>
      <div style={{maxWidth:1050,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:34}}>
        <div><p style={{...safariEyebrow,color:"#d8a77a"}}>Highlights</p><ul style={{lineHeight:1.9,color:"#c7d0cb",paddingLeft:18}}>{item.highlights.map((x)=><li key={x}>{x}</li>)}</ul></div>
        <div><p style={{...safariEyebrow,color:"#d8a77a"}}>Concept inclusions</p><ul style={{lineHeight:1.9,color:"#c7d0cb",paddingLeft:18}}>{item.inclusions.map((x)=><li key={x}>{x}</li>)}</ul></div>
      </div>
    </section>
    <section style={{maxWidth:1050,margin:"0 auto",padding:"70px 22px"}}>
      <p style={{...safariBody,fontSize:12}}>Pricing, availability, accommodation and exact inclusions on this concept page are illustrative until replaced with the operator&apos;s verified product data.</p>
      <Link href={"/demo/explore-bw/plan"+q} style={{display:"inline-block",marginTop:14,background:"#183126",color:"#fff",padding:"12px 15px",borderRadius:999,fontWeight:900}}>Ask about this safari</Link>
    </section>
  </ExploreBWPublicShell>;
}
