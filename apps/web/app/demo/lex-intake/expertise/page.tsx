import { LexIntakePublicShell, legalBody, legalEyebrow, legalTitle } from "../../../../components/products/LexIntakePublicShell";
import { lexPracticeGroups } from "../../../../lib/lexintake-site";

export default async function LexExpertisePage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Law Firm").slice(0,120);
  return <LexIntakePublicShell clientName={client} current="expertise">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 48px"}}><p style={legalEyebrow}>Expertise</p><h1 style={{...legalTitle,maxWidth:850}}>Plain-language legal capability organised around the client’s need.</h1></section>
    <section style={{maxWidth:1100,margin:"0 auto",padding:"0 22px 90px",display:"grid",gap:22}}>
      {lexPracticeGroups.map((group)=><article key={group.slug} style={{background:"#fff",border:"1px solid #d9d1ca",padding:24}}>
        <h2 style={{fontFamily:"Georgia,serif",fontWeight:500,fontSize:"clamp(28px,4vw,44px)",margin:"0 0 8px"}}>{group.title}</h2>
        <p style={{...legalBody,maxWidth:760}}>{group.intro}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:8,marginTop:18}}>{group.matters.map((matter)=><div key={matter} style={{borderTop:"1px solid #d9d1ca",paddingTop:10,fontSize:12,fontWeight:800}}>{matter}</div>)}</div>
      </article>)}
      <p style={{fontSize:10,color:"#8f8187"}}>Practice areas are proposal content until replaced with the client firm’s verified scope and lawyer capability.</p>
    </section>
  </LexIntakePublicShell>;
}
