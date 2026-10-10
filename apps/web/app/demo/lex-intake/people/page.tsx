import { LexIntakePublicShell, legalBody, legalEyebrow, legalTitle } from "../../../../components/products/LexIntakePublicShell";
import { lexPeople } from "../../../../lib/lexintake-site";

export default async function LexPeoplePage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Law Firm").slice(0,120);
  return <LexIntakePublicShell clientName={client} current="people">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 50px"}}><p style={legalEyebrow}>People</p><h1 style={{...legalTitle,maxWidth:820}}>Put the lawyers—and how they think—at the centre of trust.</h1><p style={{...legalBody,maxWidth:720,fontSize:16}}>A final page should show verified admissions, practising status, experience, sectors, languages and selected matters where disclosure is appropriate.</p></section>
    <section style={{maxWidth:1240,margin:"0 auto",padding:"0 22px 88px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:18}}>
      {lexPeople.map((person)=><article key={person.name} style={{background:"#fff",border:"1px solid #d9d1ca",overflow:"hidden"}}>
        <a href={person.source} target="_blank" rel="noreferrer"><img src={person.image} alt={"Representative portrait for "+person.name} style={{width:"100%",height:430,objectFit:"cover"}}/></a>
        <div style={{padding:20}}><h2 style={{fontFamily:"Georgia,serif",fontWeight:500,fontSize:28,margin:"0 0 4px"}}>{person.name}</h2><div style={{fontSize:10,color:"#7f1d3f",fontWeight:900,textTransform:"uppercase",letterSpacing:1.1}}>{person.role}</div><p style={{fontWeight:800,fontSize:12}}>{person.focus}</p><p style={legalBody}>{person.bio}</p><p style={{fontSize:9,color:"#9a8c92"}}>Concept profile only — not presented as an actual member of {client}.</p></div>
      </article>)}
    </section>
  </LexIntakePublicShell>;
}
