"use client";

import Link from "next/link";
import { PharmaDeskPublicShell, pharmaBody, pharmaEyebrow, pharmaLead, pharmaTitle } from "./PharmaDeskPublicShell";
import { PharmaPrescriptionRequest } from "./PharmaPrescriptionRequest";
import { KeylessMap } from "../shared/KeylessMap";
import { pharmaClientQuery, pharmacyBranches, pharmacyHealthCategories, pharmacyPublicServices, pharmacyResources } from "../../lib/pharmadesk-site";

export function PharmaDeskClientSite({clientName}:{clientName:string}){
  const q=pharmaClientQuery(clientName);

  return <PharmaDeskPublicShell clientName={clientName} current="home">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"78px 22px 60px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:44,alignItems:"center"}}>
      <div>
        <p style={pharmaEyebrow}>Prescriptions · pharmacist support · pickup & delivery</p>
        <h1 style={pharmaTitle}>Your pharmacy should be easy to reach before you arrive.</h1>
        <p style={{...pharmaLead,maxWidth:680}}>A community-pharmacy website concept for {clientName}, focused on prescription access, clear branch information and human pharmacist support.</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:22}}>
          <Link href={"/demo/pharma-desk/prescriptions"+q} style={{background:"#047857",color:"#fff",padding:"11px 15px",borderRadius:999,fontWeight:900,textDecoration:"none"}}>Refill / prescription request</Link>
          <Link href={"/demo/pharma-desk/branches"+q} style={{border:"1px solid #b8d7c7",color:"#12342a",padding:"11px 15px",borderRadius:999,fontWeight:900,textDecoration:"none"}}>Find a branch</Link>
        </div>
      </div>
      <div>
        <a href="https://www.pexels.com/photo/woman-with-braid-hair-arranging-medicine-bottles-8657365/" target="_blank" rel="noreferrer">
          <img src="https://images.pexels.com/photos/8657365/pexels-photo-8657365.jpeg?auto=compress&dpr=1&h=1000&w=1300" alt="Pharmacy professional arranging medicine shelves" style={{width:"100%",height:"min(72vw,640px)",objectFit:"cover",display:"block",borderRadius:18}}/>
        </a>
        <div style={{fontSize:10,color:"#83978f",marginTop:6}}>Representative pharmacy image · Pexels / cottonbro studio</div>
      </div>
    </section>

    <section style={{background:"#12342a",color:"#fff",padding:"68px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(235px,1fr))",gap:28}}>
        {[
          ["Prescription access","Make refills, new prescriptions, transfer enquiries and pharmacist review easy to begin from a phone."],
          ["Pickup or delivery","Let customers understand collection and local-delivery options before calling."],
          ["Medical aid clarity","Show verified medical-aid/payment information clearly and tell customers when confirmation is still needed."],
          ["A real pharmacist","Keep medication-use questions connected to qualified pharmacy staff rather than an automated diagnosis flow."]
        ].map(([title,text])=><article key={title}><strong style={{fontSize:20}}>{title}</strong><p style={{color:"#c4d7d0",fontSize:13,lineHeight:1.7}}>{text}</p></article>)}
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <p style={pharmaEyebrow}>Pharmacy services</p>
      <h2 style={{...pharmaTitle,maxWidth:820}}>Lead with what customers actually come to a pharmacy to do.</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:14,marginTop:30}}>
        {pharmacyPublicServices.map((service)=><article key={service.slug} style={{background:"#fff",border:"1px solid #d5e7dd",padding:20,borderRadius:16}}>
          <h3 style={{fontSize:24,letterSpacing:"-.025em",margin:"0 0 8px"}}>{service.title}</h3>
          <p style={pharmaBody}>{service.summary}</p>
          <ul style={{paddingLeft:18,fontSize:12,lineHeight:1.8,color:"#55736a"}}>{service.items.map((item)=><li key={item}>{item}</li>)}</ul>
        </article>)}
      </div>
      <Link href={"/demo/pharma-desk/services"+q} style={{display:"inline-block",marginTop:18,color:"#047857",fontWeight:900}}>Explore health & pharmacy services →</Link>
    </section>

    <section style={{background:"#e4f3eb",padding:"78px 0"}}>
      <div style={{maxWidth:1120,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:34,alignItems:"start"}}>
        <div>
          <p style={pharmaEyebrow}>Prescription journey</p>
          <h2 style={pharmaTitle}>Request first. Pharmacist verifies next.</h2>
          <p style={pharmaBody}>Boots and CVS both make repeat prescriptions, refill tracking, collection/delivery and pharmacist support visible on the public site. PharmaDesk follows that access pattern while keeping dispensing decisions with the pharmacist.</p>
        </div>
        <PharmaPrescriptionRequest clientName={clientName}/>
      </div>
    </section>

    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px"}}>
      <p style={pharmaEyebrow}>Health & wellness</p>
      <h2 style={{...pharmaTitle,maxWidth:760}}>Helpful categories without turning prescription medicines into ordinary retail.</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,marginTop:28}}>
        {pharmacyHealthCategories.map((item)=><article key={item.title} style={{background:"#fff",border:"1px solid #d5e7dd",padding:17,borderRadius:14}}><strong>{item.title}</strong><p style={pharmaBody}>{item.text}</p></article>)}
      </div>
    </section>

    <section style={{background:"#fff",padding:"76px 0"}}>
      <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:38}}>
        <div>
          <p style={pharmaEyebrow}>Branches & hours</p>
          <h2 style={pharmaTitle}>Location and opening hours should be visible at a glance.</h2>
          <div style={{display:"grid",gap:10,marginTop:18}}>{pharmacyBranches.map((branch)=><article key={branch.name} style={{borderTop:"1px solid #d5e7dd",paddingTop:12}}><strong>{branch.name}</strong><div style={{fontSize:12,color:"#688279",marginTop:4}}>{branch.address}</div><div style={{fontSize:11,color:"#83978f",marginTop:3}}>{branch.hours}</div></article>)}</div>
          <Link href={"/demo/pharma-desk/branches"+q} style={{display:"inline-block",marginTop:16,color:"#047857",fontWeight:900}}>View branch details →</Link>
        </div>
        <KeylessMap points={pharmacyBranches.map((branch)=>({name:branch.name,lat:branch.lat,lng:branch.lng,detail:branch.hours}))} center={[25.9,-24.62]} zoom={10.5}/>
      </div>
    </section>

    <section style={{maxWidth:1050,margin:"0 auto",padding:"78px 22px"}}>
      <p style={pharmaEyebrow}>Regulated care</p>
      <h2 style={{...pharmaTitle,maxWidth:760}}>Use current regulatory sources, not decorative trust badges.</h2>
      <p style={{...pharmaLead,maxWidth:760}}>BoMRA is actively publishing 2026 medicine regulations under Botswana's updated regulatory framework, so a pharmacy site should point to current official sources rather than hard-code claims that may become stale.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12,marginTop:24}}>
        {pharmacyResources.map((item)=><a key={item.title} href={item.href} target="_blank" rel="noreferrer" style={{background:"#fff",border:"1px solid #d5e7dd",padding:18,textDecoration:"none",color:"#12342a",borderRadius:14}}><strong>{item.title}</strong><p style={pharmaBody}>{item.text}</p><span style={{fontSize:11,fontWeight:900,color:"#047857"}}>Open official source ↗</span></a>)}
      </div>
    </section>
  </PharmaDeskPublicShell>;
}
