"use client";

import Link from "next/link";
import { LedgerDeskPublicShell, ledgerBody, ledgerEyebrow, ledgerLead, ledgerTitle } from "./LedgerDeskPublicShell";
import { LedgerHealthCheck } from "./LedgerHealthCheck";
import { LedgerStartForm } from "./LedgerStartForm";
import { KeylessMap } from "../shared/KeylessMap";
import { ledgerClientQuery, ledgerIndustries, ledgerInsights, ledgerPathways } from "../../lib/ledgerdesk-site";

export function LedgerDeskClientSite({clientName}:{clientName:string}){
  const q=ledgerClientQuery(clientName);

  return <LedgerDeskPublicShell clientName={clientName} current="home">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 66px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:46,alignItems:"center"}}>
      <div>
        <p style={ledgerEyebrow}>Monthly finance clarity for growing businesses</p>
        <h1 style={ledgerTitle}>Know where the business stands before the month has passed.</h1>
        <p style={{...ledgerLead,maxWidth:660}}>A modern accounting-firm website concept for {clientName}, leading with a reliable monthly finance function instead of an endless list of services.</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:22}}>
          <Link href={"/demo/ledger-desk/start"+q} style={{background:"#15302d",color:"#fff",padding:"11px 15px",borderRadius:999,fontWeight:900,textDecoration:"none"}}>Talk about your finance process</Link>
          <Link href={"/demo/ledger-desk/services"+q} style={{border:"1px solid #aebfba",color:"#15302d",padding:"11px 15px",borderRadius:999,fontWeight:900,textDecoration:"none"}}>See how we help</Link>
        </div>
      </div>
      <div>
        <a href="https://www.pexels.com/photo/a-woman-using-a-calculator-8297145/" target="_blank" rel="noreferrer">
          <img src="https://images.pexels.com/photos/8297145/pexels-photo-8297145.jpeg?auto=compress&dpr=1&h=1000&w=1300" alt="Black finance professional reviewing accounts" style={{width:"100%",height:"min(72vw,640px)",objectFit:"cover",display:"block",borderRadius:2}}/>
        </a>
        <div style={{fontSize:10,color:"#879792",marginTop:6}}>Representative finance-professional image · Pexels / Mikhail Nilov</div>
      </div>
    </section>

    <section style={{background:"#15302d",color:"#fff",padding:"68px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(235px,1fr))",gap:28}}>
        {[
          ["Close the month properly","Reconciliations, supporting records and management information should not depend on a year-end rescue."],
          ["See cash earlier","Owners need to understand the cash position and major commitments before making decisions."],
          ["Reduce chasing","A predictable document rhythm is more useful than repeated emails asking for missing information."],
          ["Use the numbers","Once the basics are reliable, reporting can move from compliance toward forecasting and decisions."]
        ].map(([title,text])=><article key={title}><strong style={{fontSize:20}}>{title}</strong><p style={{color:"#bbcbc7",fontSize:13,lineHeight:1.7}}>{text}</p></article>)}
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <p style={ledgerEyebrow}>How we help</p>
      <h2 style={{...ledgerTitle,maxWidth:800}}>One clear front door. Broader support when the relationship needs it.</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginTop:30}}>
        {ledgerPathways.map((item,index)=><article key={item.slug} style={{background:index===0?"#dff4ef":"#fff",border:"1px solid #d7e0dd",padding:20}}>
          <div style={{fontSize:10,color:"#0f766e",fontWeight:900,textTransform:"uppercase",letterSpacing:1.2}}>{item.kicker}</div>
          <h3 style={{fontSize:25,letterSpacing:"-.025em",margin:"8px 0"}}>{item.title}</h3>
          <p style={ledgerBody}>{item.summary}</p>
          <ul style={{paddingLeft:18,fontSize:12,lineHeight:1.8,color:"#526862"}}>{item.outcomes.slice(0,4).map((x)=><li key={x}>{x}</li>)}</ul>
        </article>)}
      </div>
      <Link href={"/demo/ledger-desk/services"+q} style={{display:"inline-block",marginTop:18,color:"#0f766e",fontWeight:900}}>Explore the service pathways →</Link>
    </section>

    <section style={{background:"#e7efed",padding:"78px 0"}}>
      <div style={{maxWidth:1120,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:34,alignItems:"start"}}>
        <div><p style={ledgerEyebrow}>Interactive expertise</p><h2 style={ledgerTitle}>Give prospects something useful before the first meeting.</h2><p style={ledgerBody}>In 2026, accounting-firm websites increasingly need to demonstrate expertise instead of only publishing passive service pages. A short process check helps a business owner recognise the problem in their own workflow.</p></div>
        <LedgerHealthCheck/>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <p style={ledgerEyebrow}>Who this can fit</p>
      <h2 style={{...ledgerTitle,maxWidth:760}}>Speak to business models, not just accounting categories.</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,marginTop:28}}>
        {ledgerIndustries.map((item)=><article key={item.title} style={{background:"#fff",border:"1px solid #d7e0dd",padding:17}}><strong>{item.title}</strong><p style={ledgerBody}>{item.text}</p></article>)}
      </div>
    </section>

    <section style={{background:"#fff",padding:"76px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:38}}>
        <div><p style={ledgerEyebrow}>Professional trust</p><h2 style={ledgerTitle}>Credentials should be verifiable.</h2><p style={ledgerBody}>A commissioned site should publish only the firm's actual BICA membership/practising information and responsible professionals. Botswana's professional body publishes active member firms and members in good standing, which is more useful than invented “trusted advisor” badges.</p><a href="https://www.bica.org.bw/active-member-firms" target="_blank" rel="noreferrer" style={{fontWeight:900,color:"#0f766e"}}>Check BICA active member firms ↗</a></div>
        <KeylessMap points={[{name:clientName,lat:-24.6282,lng:25.9231,detail:"Concept office location · Gaborone"}]} center={[25.9231,-24.6282]} zoom={12}/>
      </div>
    </section>

    <section style={{background:"#15302d",color:"#fff",padding:"76px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px"}}>
        <p style={{...ledgerEyebrow,color:"#7fd0c0"}}>Insights</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18,marginTop:20}}>
          {ledgerInsights.map((item)=><article key={item.title} style={{borderTop:"1px solid #49645e",paddingTop:16}}><h3 style={{fontSize:24,letterSpacing:"-.025em",margin:"0 0 8px"}}>{item.title}</h3><p style={{fontSize:12,color:"#bdd0cb",lineHeight:1.7}}>{item.summary}</p></article>)}
        </div>
        <Link href={"/demo/ledger-desk/insights"+q} style={{display:"inline-block",marginTop:22,color:"#fff",fontWeight:900}}>View finance insights →</Link>
      </div>
    </section>

    <section style={{maxWidth:1050,margin:"0 auto",padding:"80px 22px"}}>
      <p style={ledgerEyebrow}>Start with fit</p>
      <h2 style={{...ledgerTitle,maxWidth:780}}>The first enquiry should help the firm understand the finance problem—not ask for the entire ledger.</h2>
      <p style={{...ledgerLead,maxWidth:760}}>Detailed records can move into the secure LedgerDesk onboarding workflow only after the firm accepts the engagement.</p>
      <div style={{marginTop:24}}><LedgerStartForm clientName={clientName}/></div>
    </section>
  </LedgerDeskPublicShell>;
}
