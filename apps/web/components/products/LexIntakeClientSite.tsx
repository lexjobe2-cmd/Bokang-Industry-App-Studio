"use client";

import Link from "next/link";
import { LexIntakePublicShell, legalBody, legalEyebrow, legalLead, legalTitle } from "./LexIntakePublicShell";
import { LexIntakeEnquiryForm } from "./LexIntakeEnquiryForm";
import { KeylessMap } from "../shared/KeylessMap";
import { lexClientQuery, lexInsights, lexPeople, lexPracticeGroups } from "../../lib/lexintake-site";

export function LexIntakeClientSite({clientName}:{clientName:string}){
  const q=lexClientQuery(clientName);

  return <LexIntakePublicShell clientName={clientName} current="home">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"80px 22px 66px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:44,alignItems:"center"}}>
      <div>
        <p style={legalEyebrow}>Botswana counsel · commercial judgment · clear advice</p>
        <h1 style={legalTitle}>Legal advice should feel precise before it feels complicated.</h1>
        <p style={{...legalLead,maxWidth:650}}>A law-firm website concept for {clientName}, designed around expertise, people and a calm path from first question to formal engagement.</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:22}}>
          <Link href={"/demo/lex-intake/expertise"+q} style={{background:"#49152a",color:"#fff",padding:"11px 14px",fontWeight:900,textDecoration:"none"}}>Explore expertise</Link>
          <Link href={"/demo/lex-intake/start"+q} style={{border:"1px solid #aa9ba0",color:"#241d20",padding:"11px 14px",fontWeight:900,textDecoration:"none"}}>Start an enquiry</Link>
        </div>
      </div>
      <div>
        <a href="https://www.pexels.com/photo/a-woman-in-black-blazer-holding-a-law-book-8731032/" target="_blank" rel="noreferrer">
          <img src="https://images.pexels.com/photos/8731032/pexels-photo-8731032.jpeg?auto=compress&dpr=1&h=1000&w=1200" alt="Black legal professional holding a law book" style={{width:"100%",height:"min(72vw,650px)",objectFit:"cover",display:"block"}}/>
        </a>
        <div style={{fontSize:10,color:"#8f8187",marginTop:6}}>Representative legal-professional image · Pexels / Mikhail Nilov</div>
      </div>
    </section>

    <section style={{background:"#49152a",color:"#fff",padding:"66px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:28}}>
        {[["For businesses","Transactions, governance, regulation and disputes."],["For employers","Employment advice, investigations and workplace risk."],["For individuals","Property, estates, family and personal legal matters."]].map(([title,text])=><article key={title}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.4,opacity:.7}}>A clearer starting point</div><h2 style={{fontFamily:"Georgia,serif",fontWeight:500,fontSize:28,margin:"9px 0"}}>{title}</h2><p style={{color:"#e0cfd5",fontSize:13,lineHeight:1.7}}>{text}</p></article>)}
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"end",flexWrap:"wrap"}}>
        <div><p style={legalEyebrow}>Expertise</p><h2 style={{...legalTitle,maxWidth:740}}>Organise the law around the client’s problem.</h2></div>
        <Link href={"/demo/lex-intake/expertise"+q} style={{fontWeight:900,color:"#49152a"}}>View all expertise →</Link>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginTop:30}}>
        {lexPracticeGroups.map((group)=><article key={group.slug} style={{background:"#fff",border:"1px solid #d9d1ca",padding:20}}>
          <p style={legalEyebrow}>{group.title}</p>
          <p style={{...legalBody,color:"#5d5056"}}>{group.intro}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:12}}>{group.matters.slice(0,4).map((matter)=><span key={matter} style={{border:"1px solid #ddd4d7",padding:"6px 8px",fontSize:10}}>{matter}</span>)}</div>
        </article>)}
      </div>
    </section>

    <section style={{background:"#efe9e4",padding:"78px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:42,alignItems:"start"}}>
        <div><p style={legalEyebrow}>How engagement should work</p><h2 style={legalTitle}>First enquiry. Conflict check. Then confidential instructions.</h2><p style={legalBody}>The website should make the process understandable without encouraging people to send sensitive evidence before the firm knows it can act.</p></div>
        <div style={{display:"grid",gap:0,borderTop:"1px solid #cfc5c8"}}>
          {[["01","Initial enquiry","A short description, contact details and the other party’s name if known."],["02","Conflict screening","The firm checks whether it can act before asking for privileged detail or documents."],["03","Consultation","The right lawyer reviews the issue and discusses scope, urgency and next steps."],["04","Engagement","Only after acceptance should detailed KYC, engagement terms and matter documents follow."]].map(([no,title,text])=><article key={no} style={{display:"grid",gridTemplateColumns:"46px 1fr",gap:14,padding:"18px 0",borderBottom:"1px solid #cfc5c8"}}><span style={{fontSize:10,color:"#8f8187"}}>{no}</span><div><strong>{title}</strong><p style={{...legalBody,margin:"4px 0 0"}}>{text}</p></div></article>)}
        </div>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <p style={legalEyebrow}>People</p>
      <h2 style={{...legalTitle,maxWidth:760}}>Clients hire lawyers, not a list of practice areas.</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginTop:30}}>
        {lexPeople.map((person)=><article key={person.name} style={{background:"#fff",border:"1px solid #d9d1ca",overflow:"hidden"}}>
          <a href={person.source} target="_blank" rel="noreferrer"><img src={person.image} alt={"Representative portrait for "+person.name} style={{width:"100%",height:390,objectFit:"cover",display:"block"}}/></a>
          <div style={{padding:18}}><h3 style={{fontFamily:"Georgia,serif",fontWeight:500,fontSize:25,margin:"0 0 5px"}}>{person.name}</h3><div style={{fontSize:10,color:"#7f1d3f",fontWeight:900,textTransform:"uppercase",letterSpacing:1.1}}>{person.role}</div><p style={{fontSize:12,fontWeight:800}}>{person.focus}</p><p style={legalBody}>{person.bio}</p><div style={{fontSize:9,color:"#9a8c92"}}>Concept profile and representative image — replace with verified lawyer information.</div></div>
        </article>)}
      </div>
      <Link href={"/demo/lex-intake/people"+q} style={{display:"inline-block",marginTop:18,fontWeight:900,color:"#49152a"}}>Meet the team concept →</Link>
    </section>

    <section style={{background:"#241d20",color:"#fff",padding:"76px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px"}}>
        <p style={{...legalEyebrow,color:"#d9a9b9"}}>Insights</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:18,marginTop:20}}>
          {lexInsights.map((item)=><article key={item.title} style={{borderTop:"1px solid #755864",paddingTop:16}}><div style={{fontSize:10,color:"#d9a9b9",textTransform:"uppercase",letterSpacing:1.1}}>{item.category}</div><h3 style={{fontFamily:"Georgia,serif",fontWeight:500,fontSize:24,lineHeight:1.25}}>{item.title}</h3><p style={{fontSize:12,color:"#c9bec2",lineHeight:1.7}}>{item.summary}</p></article>)}
        </div>
        <Link href={"/demo/lex-intake/insights"+q} style={{display:"inline-block",marginTop:22,color:"#fff",fontWeight:900}}>View client resources →</Link>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:38}}>
      <div><p style={legalEyebrow}>Gaborone presence</p><h2 style={legalTitle}>Easy to verify. Easy to find.</h2><p style={legalBody}>A final firm site should publish its verified office address, telephone numbers, practising lawyers and professional credentials. It can also link prospective clients to the Law Society of Botswana’s active-member information.</p><a href="https://lawsociety.org.bw/members/" target="_blank" rel="noreferrer" style={{fontWeight:900,color:"#49152a"}}>Law Society of Botswana member information ↗</a></div>
      <KeylessMap points={[{name:clientName,lat:-24.6282,lng:25.9231,detail:"Concept office location · Gaborone"}]} center={[25.9231,-24.6282]} zoom={12}/>
    </section>

    <section style={{background:"#efe9e4",padding:"76px 0"}}>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 22px"}}><p style={legalEyebrow}>Start carefully</p><h2 style={{...legalTitle,maxWidth:760}}>A confidential first step without oversharing.</h2><p style={{...legalLead,maxWidth:760}}>Capture only what the firm needs to decide who should review the enquiry and whether a conflict check is required.</p><div style={{marginTop:22}}><LexIntakeEnquiryForm clientName={clientName}/></div></div>
    </section>
  </LexIntakePublicShell>;
}
