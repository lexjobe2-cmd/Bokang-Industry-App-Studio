"use client";

import Link from "next/link";
import { MoveTrackPublicShell, logisticsBody, logisticsEyebrow, logisticsLead, logisticsTitle } from "./MoveTrackPublicShell";
import { MoveTrackTrackingDemo } from "./MoveTrackTrackingDemo";
import { MoveTrackQuoteForm } from "./MoveTrackQuoteForm";
import { KeylessMap } from "../shared/KeylessMap";
import { moveTrackClientQuery, moveTrackCoverage, moveTrackFleet, moveTrackIndustries, moveTrackServices } from "../../lib/movetrack-site";

export function MoveTrackClientSite({clientName}:{clientName:string}){
  const q=moveTrackClientQuery(clientName);
  return <MoveTrackPublicShell clientName={clientName} current="home">
    <section style={{position:"relative",minHeight:"74vh",display:"grid",alignItems:"end",overflow:"hidden"}}>
      <img src="https://images.pexels.com/photos/36298868/pexels-photo-36298868.jpeg?auto=compress&dpr=1&h=1200&w=2000" alt="Heavy freight truck on an African highway" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(16,24,39,.05),rgba(16,24,39,.82))"}}/>
      <div style={{position:"relative",maxWidth:1240,width:"100%",margin:"0 auto",padding:"92px 22px 52px",color:"#fff"}}>
        <div style={{maxWidth:850}}>
          <p style={{margin:0,fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.8}}>Botswana logistics · road · mining · distribution</p>
          <h1 style={{fontSize:"clamp(46px,8vw,94px)",lineHeight:.94,letterSpacing:"-.055em",margin:"14px 0 18px"}}>Move what matters.<br/>Know where it is.</h1>
          <p style={{fontSize:"clamp(16px,2vw,21px)",lineHeight:1.65,maxWidth:700,opacity:.92}}>A public logistics website concept for {clientName}: designed to show capability quickly, prove where the business operates, and turn vague enquiries into useful shipment information.</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:24}}>
            <Link href={"/demo/move-track/quote"+q} style={{background:"#fff",color:"#101827",padding:"12px 16px",borderRadius:4,fontWeight:900,fontSize:13}}>Request a quote</Link>
            <Link href={"/demo/move-track/track"+q} style={{border:"1px solid rgba(255,255,255,.7)",color:"#fff",padding:"12px 16px",borderRadius:4,fontWeight:900,fontSize:13}}>Track shipment</Link>
          </div>
        </div>
        <div style={{marginTop:28,fontSize:10,opacity:.72}}>Representative African freight image · <a href="https://www.pexels.com/photo/wide-load-truck-on-open-highway-in-africa-36298868/" target="_blank" rel="noreferrer" style={{textDecoration:"underline"}}>Pexels / Amos Getanda</a></div>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"80px 22px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:46}}>
        <div><p style={logisticsEyebrow}>What buyers need to know</p><h2 style={logisticsTitle}>Can you handle our cargo, route and operating environment?</h2></div>
        <div><p style={logisticsLead}>That is the real first question in B2B logistics. The homepage should answer it before asking anyone to call.</p><p style={logisticsBody}>The public site therefore focuses on services, industries, geographic reach, fleet capability and a structured quote path. Driver checklists, maintenance, dispatch and compliance stay inside the operating system.</p></div>
      </div>
    </section>

    <section style={{background:"#101827",color:"#fff",padding:"78px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:18,alignItems:"end",flexWrap:"wrap"}}>
          <div><p style={{...logisticsEyebrow,color:"#7fb1ff"}}>Core services</p><h2 style={{...logisticsTitle,maxWidth:650}}>Explain capability in the language of the shipment.</h2></div>
          <Link href={"/demo/move-track/services"+q} style={{color:"#fff",fontWeight:900,fontSize:12}}>View all services →</Link>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14,marginTop:32}}>
          {moveTrackServices.slice(0,3).map((service)=><Link key={service.slug} href={"/demo/move-track/services"+q+"#"+service.slug} style={{background:"#172033",color:"#fff",textDecoration:"none",overflow:"hidden"}}>
            <img src={service.image} alt={service.title} style={{width:"100%",height:230,objectFit:"cover"}}/>
            <div style={{padding:18}}><h3 style={{fontSize:22,margin:"0 0 7px"}}>{service.title}</h3><p style={{fontSize:12,color:"#b7c0cf",lineHeight:1.65}}>{service.summary}</p><span style={{fontSize:11,fontWeight:900}}>Explore capability →</span></div>
          </Link>)}
        </div>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <p style={logisticsEyebrow}>Industries served</p>
      <h2 style={{...logisticsTitle,maxWidth:760}}>Show buyers that you understand their operating context.</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12,marginTop:30}}>
        {moveTrackIndustries.map((item)=><article key={item.title} style={{background:"#fff",border:"1px solid #d7dce1",padding:17}}><strong>{item.title}</strong><p style={logisticsBody}>{item.text}</p></article>)}
      </div>
    </section>

    <section style={{background:"#dfe7f1",padding:"72px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:38}}>
        <div><p style={logisticsEyebrow}>Fleet capability</p><h2 style={logisticsTitle}>Capacity should be visible, not implied.</h2><p style={logisticsBody}>A prospective mine, manufacturer or distributor should quickly understand what kinds of vehicles the operator can deploy.</p><Link href={"/demo/move-track/fleet"+q} style={{display:"inline-block",marginTop:10,fontWeight:900,color:"#101827"}}>See fleet capability →</Link></div>
        <div style={{display:"grid",gap:10}}>{moveTrackFleet.map((item)=><article key={item.type} style={{background:"#fff",border:"1px solid #c9d2de",padding:14}}><strong>{item.type}</strong><div style={{fontSize:12,color:"#667085",marginTop:4}}>{item.use}</div></article>)}</div>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:34}}>
      <div><p style={logisticsEyebrow}>Coverage</p><h2 style={logisticsTitle}>Botswana first. Regional where the route demands it.</h2><p style={logisticsBody}>A coverage map helps a buyer understand whether the operator's physical footprint matches the lane they need.</p></div>
      <KeylessMap points={moveTrackCoverage} center={[25.5,-21.5]} zoom={4.9}/>
    </section>

    <section style={{background:"#fff",padding:"76px 0"}}>
      <div style={{maxWidth:1050,margin:"0 auto",padding:"0 22px"}}>
        <p style={logisticsEyebrow}>Shipment visibility</p><h2 style={{...logisticsTitle,maxWidth:760}}>Existing customers should not have to call for every status update.</h2><p style={{...logisticsLead,maxWidth:720}}>A lightweight tracking surface belongs on the public site even when the full operations platform is private.</p>
        <div style={{marginTop:22}}><MoveTrackTrackingDemo/></div>
      </div>
    </section>

    <section style={{maxWidth:1050,margin:"0 auto",padding:"78px 22px"}}>
      <p style={logisticsEyebrow}>Price the right job</p><h2 style={{...logisticsTitle,maxWidth:760}}>Capture route, load and timing before the first callback.</h2><p style={{...logisticsLead,maxWidth:760}}>A quote request is useful when it reduces the round trip of “where from, where to, what is it, how heavy, and when?”.</p>
      <div style={{marginTop:24}}><MoveTrackQuoteForm clientName={clientName}/></div>
    </section>
  </MoveTrackPublicShell>;
}
