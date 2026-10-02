import { ExploreBWPublicShell, safariBody, safariEyebrow, safariLead, safariTitle } from "../../../../components/products/ExploreBWPublicShell";

export default async function ExploreBWAboutPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Botswana Safari Company").slice(0,120);

  return <ExploreBWPublicShell clientName={client} current="about">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,.8fr) minmax(0,1.2fr)",gap:48}}>
        <div><p style={safariEyebrow}>The operator story</p><h1 style={safariTitle}>Travelers want to know who is taking them into the bush.</h1></div>
        <div><p style={safariLead}>{client} is presented here as a Botswana-based safari operator built around local knowledge, thoughtful pacing and direct relationships with travelers.</p><p style={safariBody}>A final site should replace this concept story with the operator&apos;s verified founders, guides, memberships, vehicle/camp model, conservation approach and years of experience. Those trust details matter more than generic marketing claims.</p></div>
      </div>
    </section>
    <section style={{background:"#183126",color:"#fff",padding:"70px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:26}}>
        {[["Local knowledge","Routes should reflect seasons, road conditions, wildlife movement and realistic transfer times."],["Guiding","Introduce the people who shape the safari experience, not only the vehicles and camps."],["Responsible travel","Explain conservation, community and supplier relationships with specific evidence when available."],["Straight answers","Be clear about what is included, what is private/shared and how changes are handled."]].map(([title,text])=><article key={title}><strong style={{fontSize:20}}>{title}</strong><p style={{color:"#b9c5bf",fontSize:13,lineHeight:1.7}}>{text}</p></article>)}
      </div>
    </section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"72px 22px"}}><p style={safariBody}>HATAB maintains public listings of Botswana tourism operators and service providers, including a substantial operator community in Maun. A production website can surface the operator&apos;s verified memberships/accreditations where applicable instead of inventing trust badges.</p><p style={{fontSize:10,color:"#8a8173"}}>All company statements above are proposal copy until verified by the client.</p></section>
  </ExploreBWPublicShell>;
}
