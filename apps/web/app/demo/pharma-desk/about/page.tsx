import { PharmaDeskPublicShell, pharmaBody, pharmaEyebrow, pharmaLead, pharmaTitle } from "../../../../components/products/PharmaDeskPublicShell";
import { pharmacyResources } from "../../../../lib/pharmadesk-site";

export default async function PharmaAboutPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Pharmacy").slice(0,120);
  return <PharmaDeskPublicShell clientName={client} current="about">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:48}}>
        <div><p style={pharmaEyebrow}>About the pharmacy</p><h1 style={pharmaTitle}>Convenience only works when professional pharmacy controls stay intact.</h1></div>
        <div><p style={pharmaLead}>{client} is presented here as a Botswana community pharmacy focused on prescription access, pharmacist support and reliable local fulfilment.</p><p style={pharmaBody}>A final site should replace concept copy with verified pharmacy licences, responsible pharmacists, branch information, opening hours, medical-aid participation, delivery zones and actual health services.</p></div>
      </div>
    </section>
    <section style={{background:"#12342a",color:"#fff",padding:"70px 0"}}><div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:26}}>
      {[["Professional review","Prescription and medicine decisions remain with qualified pharmacy professionals."],["Access","Make refills, branch information and fulfilment options simple to start."],["Traceability","Behind the scenes, stock, batch, expiry and dispensing records need strong controls."],["Current regulation","Use BoMRA's current regulatory information rather than copying changing medicine rules into marketing copy."]].map(([title,text])=><article key={title}><strong style={{fontSize:20}}>{title}</strong><p style={{color:"#c4d7d0",fontSize:13,lineHeight:1.7}}>{text}</p></article>)}
    </div></section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"72px 22px"}}>
      <p style={pharmaBody}>Botswana's medicine-regulatory framework is actively evolving under the Medicines and Related Substances Act, 2025 and related 2026 regulations. A production website should publish only current, verifiable licensing and service claims.</p>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:18}}>{pharmacyResources.map((item)=><a key={item.title} href={item.href} target="_blank" rel="noreferrer" style={{fontWeight:900,color:"#047857"}}>{item.title} ↗</a>)}</div>
      <p style={{fontSize:10,color:"#83978f",marginTop:20}}>All company statements above are proposal copy until verified by the client.</p>
    </section>
  </PharmaDeskPublicShell>;
}
