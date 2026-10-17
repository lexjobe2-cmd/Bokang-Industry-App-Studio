import Link from "next/link";
import { BuildQuotePublicShell, buildQuoteBody, buildQuoteEyebrow, buildQuoteTitle } from "../../../../components/products/BuildQuotePublicShell";
import { buildQuoteClientQuery, buildQuoteProjects } from "../../../../lib/buildquote-site";

export default async function BuildQuoteProjectsPage({searchParams}:{searchParams:Promise<{client?:string}>}) {
  const query=await searchParams;
  const client=(query.client||"Your Construction Company").slice(0,120);
  const q=buildQuoteClientQuery(client);

  return <BuildQuotePublicShell clientName={client} current="projects">
    <section style={{maxWidth:1240,margin:"0 auto",padding:"82px 22px 44px"}}>
      <p style={buildQuoteEyebrow}>Selected work</p>
      <h1 style={{...buildQuoteTitle,maxWidth:780}}>Projects are the strongest proof of capability.</h1>
      <p style={{...buildQuoteBody,maxWidth:700,fontSize:16}}>Each case study is intentionally short: what was built, where, what the challenge was and how the contractor approached it.</p>
    </section>
    <section style={{maxWidth:1240,margin:"0 auto",padding:"0 22px 86px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>
      {buildQuoteProjects.map((project)=><Link key={project.slug} href={"/demo/build-quote/projects/"+project.slug+q} style={{background:"#171717",color:"#fff",textDecoration:"none",overflow:"hidden"}}>
        <img src={project.image} alt={project.title} style={{width:"100%",height:320,objectFit:"cover",display:"block"}}/>
        <div style={{padding:18}}>
          <div style={{fontSize:10,color:"#d6c59b",textTransform:"uppercase",letterSpacing:1.2}}>{project.category} · {project.location}</div>
          <h2 style={{fontSize:24,margin:"8px 0"}}>{project.title}</h2>
          <p style={{fontSize:12,color:"#b8b8b8",lineHeight:1.6}}>{project.summary}</p>
          <span style={{fontSize:12,fontWeight:900}}>View case study →</span>
        </div>
      </Link>)}
    </section>
  </BuildQuotePublicShell>;
}
