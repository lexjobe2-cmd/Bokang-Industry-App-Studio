import { PharmaDeskPublicShell, pharmaBody, pharmaEyebrow, pharmaTitle } from "../../../../components/products/PharmaDeskPublicShell";
import { KeylessMap } from "../../../../components/shared/KeylessMap";
import { pharmacyBranches } from "../../../../lib/pharmadesk-site";

export default async function PharmaBranchesPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Pharmacy").slice(0,120);
  return <PharmaDeskPublicShell clientName={client} current="branches">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 48px"}}>
      <p style={pharmaEyebrow}>Branches</p>
      <h1 style={{...pharmaTitle,maxWidth:820}}>Find the nearest branch, hours and fulfilment options quickly.</h1>
    </section>
    <section style={{maxWidth:1240,margin:"0 auto",padding:"0 22px 88px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:28}}>
      <div style={{display:"grid",gap:12}}>
        {pharmacyBranches.map((branch)=><article key={branch.name} style={{background:"#fff",border:"1px solid #d5e7dd",padding:18,borderRadius:14}}>
          <h2 style={{fontSize:23,margin:"0 0 6px"}}>{branch.name}</h2>
          <p style={{...pharmaBody,margin:"0 0 6px"}}>{branch.address}</p>
          <strong style={{fontSize:12}}>{branch.hours}</strong>
          <p style={{fontSize:10,color:"#83978f",marginBottom:0}}>Concept location/hours — replace with verified client branch information before launch.</p>
        </article>)}
      </div>
      <KeylessMap points={pharmacyBranches.map((branch)=>({name:branch.name,lat:branch.lat,lng:branch.lng,detail:branch.hours}))} center={[25.9,-24.62]} zoom={10.5}/>
    </section>
  </PharmaDeskPublicShell>;
}
