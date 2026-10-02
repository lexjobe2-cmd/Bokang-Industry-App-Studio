"use client";

import Link from "next/link";
import { ExploreBWPublicShell, safariBody, safariEyebrow, safariLead, safariTitle } from "./ExploreBWPublicShell";
import { ExploreBWPlanForm } from "./ExploreBWPlanForm";
import { KeylessMap } from "../shared/KeylessMap";
import { exploreClientQuery, exploreDestinations, explorePackages } from "../../lib/explorebw-site";

export function ExploreBWClientSite({clientName}:{clientName:string}){
  const q=exploreClientQuery(clientName);
  const mapPoints=exploreDestinations.map((item)=>({name:item.name,lat:item.lat,lng:item.lng,detail:item.detail}));

  return <ExploreBWPublicShell clientName={clientName} current="home">
    <section style={{position:"relative",minHeight:"78vh",display:"grid",alignItems:"end",overflow:"hidden"}}>
      <img src="https://images.unsplash.com/photo-1759252973843-957dc1b5e0e5?auto=format&fit=crop&fm=jpg&q=86&w=2000" alt="Mokoro travel in Botswana's Okavango Delta" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(10,35,25,.08),rgba(13,36,27,.78))"}}/>
      <div style={{position:"relative",maxWidth:1240,width:"100%",margin:"0 auto",padding:"92px 22px 52px",color:"#fff"}}>
        <div style={{maxWidth:820}}>
          <p style={{margin:0,fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.8}}>Botswana, slowly and properly</p>
          <h1 style={{fontSize:"clamp(48px,8vw,98px)",lineHeight:.92,letterSpacing:"-.055em",margin:"14px 0 18px"}}>Come for the wildlife.<br/>Leave with a story.</h1>
          <p style={{fontSize:"clamp(16px,2vw,21px)",lineHeight:1.65,maxWidth:690,opacity:.92}}>A safari website concept for {clientName}, built around real traveler questions: where do we go, how long do we need, what does it cost, what will each day feel like, and who will look after us?</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:24}}>
            <Link href={"/demo/explore-bw/safaris"+q} style={{background:"#fff",color:"#183126",padding:"12px 16px",borderRadius:999,fontWeight:900,fontSize:13}}>Explore safari ideas</Link>
            <Link href={"/demo/explore-bw/plan"+q} style={{border:"1px solid rgba(255,255,255,.7)",color:"#fff",padding:"12px 16px",borderRadius:999,fontWeight:900,fontSize:13}}>Plan my trip</Link>
          </div>
        </div>
        <div style={{marginTop:30,fontSize:10,opacity:.72}}>Okavango Delta · <a href="https://unsplash.com/photos/people-poling-boats-through-a-grassy-wetland-xG-gaNxYjFE" target="_blank" rel="noreferrer" style={{textDecoration:"underline"}}>Unsplash / Ed Wingate</a></div>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,.8fr) minmax(0,1.2fr)",gap:48}}>
        <div><p style={safariEyebrow}>Start with the feeling</p><h2 style={safariTitle}>Not everyone knows which safari they want yet.</h2></div>
        <div><p style={safariLead}>Some travelers know “Okavango.” Others only know they want water, elephants, quiet camps, photography, or a first safari that does not feel rushed.</p><p style={safariBody}>ExploreBW is designed to let an operator lead with inspiration, then progressively reveal the practical details travelers need to make a confident enquiry.</p></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14,marginTop:34}}>
        {[["Water & wilderness","Mokoro channels, islands and slower exploration in the Okavango Delta."],["Big game","Khwai, Moremi, Savuti and Chobe for classic northern Botswana wildlife viewing."],["Short extensions","Compact Maun- or Kasane-based trips for travelers connecting through the region."],["Longer journeys","Multi-area safaris that combine different landscapes instead of repeating the same experience."]].map(([title,text])=><article key={title} style={{background:"#fff",border:"1px solid #d9d1c1",padding:18}}><strong style={{fontSize:18}}>{title}</strong><p style={safariBody}>{text}</p></article>)}
      </div>
    </section>

    <section style={{background:"#183126",color:"#fff",padding:"82px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"end",flexWrap:"wrap"}}>
          <div><p style={{...safariEyebrow,color:"#d8a77a"}}>Safari ideas</p><h2 style={{...safariTitle,maxWidth:650}}>Show enough detail to earn the enquiry.</h2></div>
          <p style={{maxWidth:420,color:"#b9c5bf",fontSize:13,lineHeight:1.7}}>Duration, starting point, route and a realistic price guide help travelers decide whether a trip is worth discussing before they fill in a form.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:14,marginTop:34}}>
          {explorePackages.map((item)=><Link key={item.slug} href={"/demo/explore-bw/safaris/"+item.slug+q} style={{background:"#24483a",color:"#fff",textDecoration:"none",overflow:"hidden"}}>
            <img src={item.image} alt={item.title} style={{width:"100%",height:280,objectFit:"cover",display:"block"}}/>
            <div style={{padding:18}}>
              <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.2,color:"#d8a77a"}}>{item.duration} · starts {item.start}</div>
              <h3 style={{fontSize:23,margin:"8px 0"}}>{item.title}</h3>
              <p style={{fontSize:12,color:"#c7d0cb",lineHeight:1.65}}>{item.summary}</p>
              <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",marginTop:14}}><strong style={{fontSize:12}}>{item.priceGuide}</strong><span style={{fontSize:12,fontWeight:900}}>View trip →</span></div>
            </div>
          </Link>)}
        </div>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px",display:"grid",gridTemplateColumns:"minmax(0,.8fr) minmax(0,1.2fr)",gap:42}}>
      <div><p style={safariEyebrow}>Where the journeys happen</p><h2 style={safariTitle}>A map makes the route real.</h2><p style={safariBody}>Botswana safari planning is geographic. Maun and Kasane are important gateways, but the traveler needs to understand how the Delta, Khwai, Chobe and the pans relate to one another.</p></div>
      <KeylessMap points={mapPoints} center={[24.1,-19.5]} zoom={5.2}/>
    </section>

    <section style={{background:"#d9c6a3",padding:"72px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:26}}>
        {[["Local knowledge","Give travelers confidence that the operator understands the routes, seasons and practical reality on the ground."],["Clear trip design","Explain what is private/shared, where the trip begins and ends, and what kind of pace to expect."],["Human planning","Keep direct enquiry visible. Complex safaris often need a conversation before confirmation."],["Trust before payment","Use clear policies, inclusions and verified operator information before asking for commitment."]].map(([title,text])=><article key={title}><strong style={{fontSize:19}}>{title}</strong><p style={{fontSize:13,lineHeight:1.65,color:"#554a36"}}>{text}</p></article>)}
      </div>
    </section>

    <section style={{maxWidth:1100,margin:"0 auto",padding:"82px 22px"}}>
      <p style={safariEyebrow}>Tell us what you want to feel</p>
      <h2 style={{...safariTitle,maxWidth:760}}>Plan by intent first. Dates and logistics can follow.</h2>
      <p style={{...safariLead,maxWidth:760}}>The first enquiry should feel easier than building a booking from scratch.</p>
      <div style={{marginTop:24}}><ExploreBWPlanForm clientName={clientName}/></div>
    </section>
  </ExploreBWPublicShell>;
}
