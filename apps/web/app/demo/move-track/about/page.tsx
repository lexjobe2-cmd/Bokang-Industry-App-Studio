import { MoveTrackPublicShell, logisticsBody, logisticsEyebrow, logisticsLead, logisticsTitle } from "../../../../components/products/MoveTrackPublicShell";

export default async function MoveTrackAboutPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Logistics Company").slice(0,120);
  return <MoveTrackPublicShell clientName={client} current="about">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:48}}>
        <div><p style={logisticsEyebrow}>About the operator</p><h1 style={logisticsTitle}>Reliability should be explained with evidence, not slogans.</h1></div>
        <div><p style={logisticsLead}>{client} is presented here as a Botswana logistics operator serving transport, industrial and mine-support requirements with a safety-first operating model.</p><p style={logisticsBody}>A commissioned site should replace proposal copy with the company's verified ownership, operating history, bases, fleet size, certifications, customers/references and actual route capability.</p></div>
      </div>
    </section>
    <section style={{background:"#101827",color:"#fff",padding:"70px 0"}}><div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:26}}>{[["Safety","Explain fleet maintenance, driver controls and site-specific operating standards."],["On-time execution","Show how dispatch, communication and exception management support reliable delivery."],["Local footprint","Make Botswana bases, yards and service corridors visible."],["Commercial clarity","Give buyers a direct path to a qualified logistics manager and structured quote."]].map(([title,text])=><article key={title}><strong style={{fontSize:20}}>{title}</strong><p style={{color:"#b8c2d1",fontSize:13,lineHeight:1.7}}>{text}</p></article>)}</div></section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"72px 22px"}}><p style={logisticsBody}>Botswana operators commonly compete on mining/industrial capability, nationwide coverage, cross-border movement, warehousing and customs support. The public site should state only capabilities the client can verify and deliver.</p><p style={{fontSize:10,color:"#98a2b3"}}>All company statements above are proposal copy until verified by the client.</p></section>
  </MoveTrackPublicShell>;
}
