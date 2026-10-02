import { LexIntakePublicShell, legalBody, legalEyebrow, legalTitle } from "../../../../components/products/LexIntakePublicShell";
import { lexInsights } from "../../../../lib/lexintake-site";

export default async function LexInsightsPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Law Firm").slice(0,120);
  return <LexIntakePublicShell clientName={client} current="insights">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 48px"}}><p style={legalEyebrow}>Insights</p><h1 style={{...legalTitle,maxWidth:840}}>Useful legal content should answer the questions clients actually bring to the firm.</h1></section>
    <section style={{maxWidth:1050,margin:"0 auto",padding:"0 22px 88px",borderTop:"1px solid #cfc5c8"}}>
      {lexInsights.map((item,index)=><article key={item.title} style={{display:"grid",gridTemplateColumns:"80px minmax(0,1fr)",gap:22,padding:"26px 0",borderBottom:"1px solid #cfc5c8"}}>
        <span style={{fontSize:10,color:"#8f8187"}}>0{index+1}</span><div><div style={{fontSize:10,color:"#7f1d3f",fontWeight:900,textTransform:"uppercase",letterSpacing:1.1}}>{item.category}</div><h2 style={{fontFamily:"Georgia,serif",fontWeight:500,fontSize:28,margin:"7px 0"}}>{item.title}</h2><p style={{...legalBody,margin:0}}>{item.summary}</p></div>
      </article>)}
      <p style={{fontSize:10,color:"#8f8187",marginTop:20}}>Insight titles and summaries are demonstration content, not legal advice.</p>
    </section>
  </LexIntakePublicShell>;
}
