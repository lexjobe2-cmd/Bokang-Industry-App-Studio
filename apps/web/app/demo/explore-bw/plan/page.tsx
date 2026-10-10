import { ExploreBWPublicShell, safariEyebrow, safariLead, safariTitle } from "../../../../components/products/ExploreBWPublicShell";
import { ExploreBWPlanForm } from "../../../../components/products/ExploreBWPlanForm";
import { KeylessMap } from "../../../../components/shared/KeylessMap";
import { exploreDestinations } from "../../../../lib/explorebw-site";

export default async function ExploreBWPlanPage({searchParams}:{searchParams:Promise<{client?:string}>}){
  const query=await searchParams;
  const client=(query.client||"Your Botswana Safari Company").slice(0,120);
  return <ExploreBWPublicShell clientName={client} current="plan">
    <section style={{maxWidth:1100,margin:"0 auto",padding:"82px 22px 44px"}}>
      <p style={safariEyebrow}>Plan by intent</p>
      <h1 style={{...safariTitle,maxWidth:820}}>Tell us the kind of Botswana trip you want—not every booking detail.</h1>
      <p style={{...safariLead,maxWidth:760}}>The operator can help turn the first idea into the right route, trip length and level of comfort.</p>
    </section>
    <section style={{maxWidth:1100,margin:"0 auto",padding:"0 22px 62px"}}><ExploreBWPlanForm clientName={client}/></section>
    <section style={{maxWidth:1100,margin:"0 auto",padding:"0 22px 84px"}}><KeylessMap points={exploreDestinations.map((item)=>({name:item.name,lat:item.lat,lng:item.lng,detail:item.detail}))} center={[24.1,-19.5]} zoom={5.2}/></section>
  </ExploreBWPublicShell>;
}
