import { notFound } from "next/navigation";
import { BuildQuotePublicShell, buildQuoteBody, buildQuoteEyebrow, buildQuoteLead, buildQuoteTitle } from "../../../../../components/products/BuildQuotePublicShell";
import { buildQuoteProjects } from "../../../../../lib/buildquote-site";

export function generateStaticParams(){
  return buildQuoteProjects.map((project)=>({project:project.slug}));
}

export default async function BuildQuoteProjectPage({
  params,
  searchParams,
}:{
  params:Promise<{project:string}>;
  searchParams:Promise<{client?:string}>;
}) {
  const {project}=await params;
  const query=await searchParams;
  const client=(query.client||"Your Construction Company").slice(0,120);
  const item=buildQuoteProjects.find((entry)=>entry.slug===project);
  if(!item) notFound();

  return <BuildQuotePublicShell clientName={client} current="projects">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"64px 22px 30px"}}>
      <p style={buildQuoteEyebrow}>{item.category} · {item.location}</p>
      <h1 style={{...buildQuoteTitle,maxWidth:900}}>{item.title}</h1>
      <p style={{...buildQuoteLead,maxWidth:760,marginTop:18}}>{item.summary}</p>
    </section>
    <section style={{maxWidth:1240,margin:"0 auto",padding:"0 22px"}}>
      <a href={item.source} target="_blank" rel="noreferrer"><img src={item.image} alt={item.title} style={{width:"100%",height:"min(68vw,680px)",objectFit:"cover",display:"block"}}/></a>
      <div style={{fontSize:10,color:"#8a8173",marginTop:6}}>Representative concept image · source linked above</div>
    </section>
    <section style={{maxWidth:1000,margin:"0 auto",padding:"70px 22px 90px",display:"grid",gap:34}}>
      <div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:24,borderTop:"1px solid #cfc8bb",paddingTop:18}}><strong>Scope</strong><p style={{...buildQuoteBody,margin:0}}>{item.scope}</p></div>
      <div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:24,borderTop:"1px solid #cfc8bb",paddingTop:18}}><strong>Challenge</strong><p style={{...buildQuoteBody,margin:0}}>{item.challenge}</p></div>
      <div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:24,borderTop:"1px solid #cfc8bb",paddingTop:18}}><strong>Approach</strong><p style={{...buildQuoteBody,margin:0}}>{item.response}</p></div>
      <div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:24,borderTop:"1px solid #cfc8bb",paddingTop:18}}><strong>Outcome</strong><p style={{...buildQuoteBody,margin:0}}>{item.outcome}</p></div>
      <p style={{fontSize:10,color:"#8a8173"}}>Case study content is illustrative proposal copy until replaced with verified client project details, photographs and completion information.</p>
    </section>
  </BuildQuotePublicShell>;
}
