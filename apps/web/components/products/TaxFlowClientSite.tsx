"use client";

import Link from "next/link";
import { TaxFlowPublicShell, taxBody, taxEyebrow, taxLead, taxTitle } from "./TaxFlowPublicShell";
import { TaxReadinessMap } from "./TaxReadinessMap";
import { TaxFlowStartForm } from "./TaxFlowStartForm";
import { taxClientPaths, taxClientQuery, taxGuidanceCards, taxInsights } from "../../lib/taxflow-site";

export function TaxFlowClientSite({clientName}:{clientName:string}){
  const q=taxClientQuery(clientName);

  return <TaxFlowPublicShell clientName={clientName} current="home">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 66px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:46,alignItems:"center"}}>
      <div>
        <p style={taxEyebrow}>Tax readiness · filing · advisory · Botswana</p>
        <h1 style={taxTitle}>Know what needs attention before the deadline does.</h1>
        <p style={{...taxLead,maxWidth:680}}>A tax-firm website concept for {clientName}, built around readiness, official guidance and year-round advice rather than a once-a-year filing form.</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:22}}>
          <Link href={"/demo/tax-flow/readiness"+q} style={{background:"#4f46e5",color:"#fff",padding:"11px 15px",borderRadius:4,fontWeight:900,textDecoration:"none"}}>Check tax readiness</Link>
          <Link href={"/demo/tax-flow/start"+q} style={{background:"#f3c948",color:"#17203a",padding:"11px 15px",borderRadius:4,fontWeight:900,textDecoration:"none"}}>Ask a tax question</Link>
        </div>
      </div>
      <div>
        <a href="https://www.pexels.com/photo/confident-female-accountant-carrying-documents-5668875/" target="_blank" rel="noreferrer">
          <img src="https://images.pexels.com/photos/5668875/pexels-photo-5668875.jpeg?auto=compress&dpr=1&h=1000&w=1300" alt="Black tax and finance professional carrying documents" style={{width:"100%",height:"min(72vw,640px)",objectFit:"cover",display:"block"}}/>
        </a>
        <div style={{fontSize:10,color:"#8b94a5",marginTop:6}}>Representative tax-professional image · Pexels / Sora Shimazaki</div>
      </div>
    </section>

    <section style={{background:"#17203a",color:"#fff",padding:"68px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(235px,1fr))",gap:28}}>
        {[
          ["Registration","Is the taxpayer registered correctly for the taxes and profile details that apply?"],
          ["Records","Are schedules, reconciliations and supporting records ready enough to prepare accurately?"],
          ["Returns","Which returns are required, and where is each one in the preparation/review/submission cycle?"],
          ["Payments & clearance","Are balances, payments, clearance needs and BURS correspondence visible instead of scattered?"]
        ].map(([title,text])=><article key={title}><strong style={{fontSize:20}}>{title}</strong><p style={{color:"#bec5d4",fontSize:13,lineHeight:1.7}}>{text}</p></article>)}
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <p style={taxEyebrow}>Choose the tax conversation</p>
      <h2 style={{...taxTitle,maxWidth:820}}>Different taxpayers need different starting points.</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14,marginTop:30}}>
        {taxClientPaths.map((path)=><article key={path.slug} style={{background:"#fff",border:"1px solid #dbe0ea",padding:20}}>
          <div style={{fontSize:10,color:"#4f46e5",fontWeight:900,textTransform:"uppercase",letterSpacing:1.15}}>{path.kicker}</div>
          <h3 style={{fontSize:24,letterSpacing:"-.025em",margin:"8px 0"}}>{path.title}</h3>
          <p style={taxBody}>{path.summary}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:12}}>{path.topics.slice(0,4).map((topic)=><span key={topic} style={{background:"#f6f7fb",border:"1px solid #e1e5ed",padding:"6px 8px",fontSize:10}}>{topic}</span>)}</div>
        </article>)}
      </div>
      <Link href={"/demo/tax-flow/services"+q} style={{display:"inline-block",marginTop:18,color:"#4f46e5",fontWeight:900}}>See tax service pathways →</Link>
    </section>

    <section style={{background:"#eef0ff",padding:"78px 0"}}>
      <div style={{maxWidth:1120,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:34,alignItems:"start"}}>
        <div><p style={taxEyebrow}>Readiness, not guesswork</p><h2 style={taxTitle}>Make the first tax conversation about what is known, missing or uncertain.</h2><p style={taxBody}>The readiness map does not calculate tax. It simply makes the workflow visible enough for a taxpayer and adviser to know where to begin.</p></div>
        <TaxReadinessMap/>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"end",flexWrap:"wrap"}}>
        <div><p style={taxEyebrow}>Official Botswana guidance</p><h2 style={{...taxTitle,maxWidth:760}}>Keep changing tax rules close to the source.</h2></div>
        <Link href={"/demo/tax-flow/guidance"+q} style={{fontWeight:900,color:"#4f46e5"}}>View guidance hub →</Link>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12,marginTop:28}}>
        {taxGuidanceCards.map((card)=><a key={card.title} href={card.href} target="_blank" rel="noreferrer" style={{background:"#fff",border:"1px solid #dbe0ea",padding:18,textDecoration:"none",color:"#17203a"}}><strong>{card.title}</strong><p style={taxBody}>{card.text}</p><span style={{fontSize:11,fontWeight:900,color:"#4f46e5"}}>Open official source ↗</span></a>)}
      </div>
    </section>

    <section style={{background:"#fff",padding:"76px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18}}>
        <div><p style={taxEyebrow}>Year-round tax</p><h2 style={taxTitle}>Advice is most useful before the event is finished.</h2><p style={taxBody}>The 2026 global tax benchmark is moving beyond return preparation toward advisory conversations throughout the year. The public site should make that relationship visible without pretending every visitor needs a complex engagement.</p></div>
        <div style={{display:"grid",gap:10}}>
          {taxInsights.map((item)=><article key={item.title} style={{borderTop:"1px solid #dbe0ea",paddingTop:13}}><strong>{item.title}</strong><p style={taxBody}>{item.summary}</p></article>)}
        </div>
      </div>
    </section>

    <section style={{maxWidth:1050,margin:"0 auto",padding:"80px 22px"}}>
      <p style={taxEyebrow}>Start with the issue</p>
      <h2 style={{...taxTitle,maxWidth:800}}>Tell the adviser what is happening before sending the whole tax file.</h2>
      <p style={{...taxLead,maxWidth:760}}>The first enquiry captures taxpayer context, the issue, period, urgency and whether BURS correspondence is involved. Detailed records can follow in TaxFlow once the engagement is accepted.</p>
      <div style={{marginTop:24}}><TaxFlowStartForm clientName={clientName}/></div>
    </section>
  </TaxFlowPublicShell>;
}
