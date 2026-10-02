"use client";

import { useState } from "react";
import Link from "next/link";
import { KeylessMap } from "../shared/KeylessMap";

type Props = {
  clientName: string;
  location: string;
  contact: string;
  email: string;
  cta: string;
};

const locationCoordinates: Record<string,{lat:number;lng:number}> = {
  "Gaborone": { lat:-24.6282, lng:25.9231 },
  "Tlokweng": { lat:-24.6687, lng:25.9715 },
  "Molepolole": { lat:-24.4066, lng:25.4951 },
  "Francistown": { lat:-21.1700, lng:27.5079 },
  "Maun": { lat:-19.9833, lng:23.4167 },
  "Palapye": { lat:-22.5461, lng:27.1256 },
};

const projects = [
  {
    title:"Commercial Office Development",
    category:"Commercial",
    location:"Gaborone",
    scope:"Structural works · interior fit-out · project coordination",
    image:"https://images.unsplash.com/photo-1591005383705-c7af6a4eedd0?auto=format&fit=crop&fm=jpg&q=82&w=1400",
    source:"https://unsplash.com/photos/aerial-view-of-city-buildings-during-daytime-hO9Z6Ey9jhI",
  },
  {
    title:"Urban Building Works",
    category:"Building",
    location:"Gaborone",
    scope:"General building · site works · finishing",
    image:"https://images.unsplash.com/photo-1664662566501-73a7e41d8c19?auto=format&fit=crop&fm=jpg&q=82&w=1400",
    source:"https://unsplash.com/photos/a-building-under-construction-Ler7ucoR7vc",
  },
  {
    title:"Refurbishment & Fit-out",
    category:"Refurbishment",
    location:"Greater Gaborone",
    scope:"Renovation · electrical · finishes · handover",
    image:"https://images.pexels.com/photos/11321790/pexels-photo-11321790.jpeg?auto=compress&dpr=1&h=900&w=1400",
    source:"https://www.pexels.com/photo/construction-man-wearing-a-safety-helmet-11321790/",
  },
];

export function BuildQuoteClientSite({clientName,location,contact,email,cta}:Props){
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [projectType,setProjectType]=useState("General construction");
  const [message,setMessage]=useState("");
  const [sent,setSent]=useState(false);

  const matchedPlace=Object.keys(locationCoordinates).find((place)=>location.toLowerCase().includes(place.toLowerCase())) || "Gaborone";
  const coords=locationCoordinates[matchedPlace] ?? locationCoordinates["Gaborone"]!;

  function submit(){
    if(!name.trim()) return;
    setSent(true);
  }

  return (
    <main style={{minHeight:"100vh",background:"#f7f5f0",color:"#171717"}}>
      <header style={{position:"sticky",top:0,zIndex:20,background:"rgba(247,245,240,.94)",backdropFilter:"blur(12px)",borderBottom:"1px solid #ded8cc"}}>
        <div style={{maxWidth:1240,margin:"0 auto",padding:"14px 22px",display:"flex",justifyContent:"space-between",gap:16,alignItems:"center"}}>
          <div>
            <strong style={{fontSize:20,letterSpacing:"-.02em"}}>{clientName}</strong>
            <div style={{fontSize:10,color:"#737373",textTransform:"uppercase",letterSpacing:1.4}}>Construction · Botswana</div>
          </div>
          <nav style={{display:"flex",gap:18,alignItems:"center",fontSize:12,fontWeight:800}}>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#services">Services</a>
            <a href="#contact" style={{background:"#171717",color:"#fff",padding:"9px 12px",borderRadius:999}}>Contact</a>
          </nav>
        </div>
      </header>

      <section style={{position:"relative",minHeight:"76vh",display:"grid",alignItems:"end",overflow:"hidden"}}>
        <img
          src="https://images.unsplash.com/photo-1664662566501-73a7e41d8c19?auto=format&fit=crop&fm=jpg&q=86&w=2000"
          alt="Construction activity in Gaborone, Botswana"
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}
        />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.78))"}}/>
        <div style={{position:"relative",maxWidth:1240,width:"100%",margin:"0 auto",padding:"90px 22px 54px",color:"#fff"}}>
          <div style={{maxWidth:860}}>
            <p style={{margin:0,fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.8}}>Building with purpose</p>
            <h1 style={{fontSize:"clamp(46px,8vw,96px)",lineHeight:.95,letterSpacing:"-.055em",margin:"14px 0 18px"}}>
              Built for Botswana.<br/>Built to last.
            </h1>
            <p style={{fontSize:"clamp(16px,2vw,21px)",lineHeight:1.65,maxWidth:700,opacity:.9}}>
              A proposed digital presence for {clientName}: focused on the company, the work, the people behind it and the places it serves.
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:24}}>
              <a href="#projects" style={{background:"#fff",color:"#171717",padding:"12px 16px",borderRadius:999,fontWeight:900,fontSize:13}}>View projects</a>
              <a href="#contact" style={{border:"1px solid rgba(255,255,255,.65)",color:"#fff",padding:"12px 16px",borderRadius:999,fontWeight:900,fontSize:13}}>Start a conversation</a>
            </div>
          </div>
          <div style={{marginTop:28,fontSize:10,opacity:.72}}>
            Gaborone construction image · <a href="https://unsplash.com/photos/a-building-under-construction-Ler7ucoR7vc" target="_blank" rel="noreferrer" style={{textDecoration:"underline"}}>Unsplash / Thatselby</a>
          </div>
        </div>
      </section>

      <section id="about" style={{maxWidth:1240,margin:"0 auto",padding:"86px 22px",display:"grid",gridTemplateColumns:"minmax(0,.8fr) minmax(0,1.2fr)",gap:50}}>
        <div>
          <p style={eyebrow}>Who we are</p>
          <h2 style={sectionTitle}>Construction is more than the finished structure.</h2>
        </div>
        <div>
          <p style={lead}>
            {clientName} is presented here as a Botswana construction partner built around dependable delivery, clear communication and respect for the places where projects are built.
          </p>
          <p style={bodyCopy}>
            This concept intentionally keeps the message simple. Instead of making the website about software or quotation forms, it gives prospective clients the information they normally look for first: what the company stands for, what it builds, the type of work it has delivered and how to reach the team.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:30}}>
            {[["Mission","Deliver practical, durable work with disciplined project execution."],["Approach","Plan clearly. Build safely. Communicate throughout."],["Commitment","Quality, accountability and respect for client requirements."]].map(([title,text])=>(
              <article key={title} style={{borderTop:"2px solid #171717",paddingTop:12}}>
                <strong>{title}</strong>
                <p style={{...bodyCopy,fontSize:12}}>{text}</p>
              </article>
            ))}
          </div>
          <p style={{fontSize:10,color:"#8a8173",marginTop:18}}>Concept copy for demonstration — final company mission, history and credentials would be replaced with verified client content.</p>
        </div>
      </section>

      <section id="projects" style={{background:"#171717",color:"#fff",padding:"82px 0"}}>
        <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:20,alignItems:"end",flexWrap:"wrap"}}>
            <div><p style={{...eyebrow,color:"#d6c59b"}}>Selected work</p><h2 style={{...sectionTitle,maxWidth:620}}>Projects should do the talking.</h2></div>
            <p style={{maxWidth:420,color:"#b8b8b8",fontSize:13,lineHeight:1.7}}>2026 construction sites increasingly treat project case studies—not capability lists—as the strongest proof of competence.</p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginTop:34}}>
            {projects.map((project)=>(
              <article key={project.title} style={{background:"#242424",borderRadius:4,overflow:"hidden"}}>
                <a href={project.source} target="_blank" rel="noreferrer">
                  <img src={project.image} alt={project.title} style={{width:"100%",height:280,objectFit:"cover",display:"block"}}/>
                </a>
                <div style={{padding:18}}>
                  <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.2,color:"#d6c59b"}}>{project.category} · {project.location}</div>
                  <h3 style={{fontSize:22,margin:"8px 0"}}>{project.title}</h3>
                  <p style={{fontSize:12,color:"#b8b8b8",lineHeight:1.6}}>{project.scope}</p>
                  <div style={{fontSize:10,color:"#7f7f7f"}}>Sample project content for concept presentation</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services" style={{maxWidth:1240,margin:"0 auto",padding:"86px 22px"}}>
        <div style={{display:"grid",gridTemplateColumns:"minmax(0,.8fr) minmax(0,1.2fr)",gap:50}}>
          <div><p style={eyebrow}>What we build</p><h2 style={sectionTitle}>Clear capabilities. No oversized service catalogue.</h2></div>
          <div style={{display:"grid",gap:0,borderTop:"1px solid #cfc8bb"}}>
            {[
              ["01","General building","Commercial, institutional and residential building works."],
              ["02","Civil & site works","Site preparation, concrete, access and supporting infrastructure."],
              ["03","Refurbishment","Renovation, upgrades, repairs and occupied-space improvements."],
              ["04","Project coordination","Planning, site coordination, subcontractor management and handover."]
            ].map(([no,title,text])=>(
              <article key={no} style={{display:"grid",gridTemplateColumns:"50px minmax(0,1fr)",gap:16,padding:"20px 0",borderBottom:"1px solid #cfc8bb"}}>
                <span style={{fontSize:11,color:"#8a8173"}}>{no}</span>
                <div><strong style={{fontSize:18}}>{title}</strong><p style={{...bodyCopy,marginBottom:0}}>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{background:"#d8c59b",padding:"72px 0"}}>
        <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:26}}>
          {[["Safety","Plan the work, understand the risks and build responsibly."],["Quality","Make workmanship visible in the finished project and the handover."],["Communication","Keep clients informed without making them chase progress."],["Local presence","Show where the company is based and the areas it can realistically serve."]].map(([title,text])=>(
            <article key={title}><strong style={{fontSize:20}}>{title}</strong><p style={{fontSize:13,lineHeight:1.65,color:"#4d4435"}}>{text}</p></article>
          ))}
        </div>
      </section>

      <section style={{maxWidth:1240,margin:"0 auto",padding:"86px 22px",display:"grid",gridTemplateColumns:"minmax(0,.8fr) minmax(0,1.2fr)",gap:42}}>
        <div>
          <p style={eyebrow}>Find us</p>
          <h2 style={sectionTitle}>{location || matchedPlace}</h2>
          <p style={bodyCopy}>A simple map gives prospective clients confidence that the business is local and reachable. The exact office pin would be replaced with the company’s verified address before launch.</p>
          {contact?<p style={{fontWeight:850,marginTop:20}}>Attention: {contact}</p>:null}
          <a href={"mailto:"+email} style={{display:"inline-block",marginTop:10,textDecoration:"underline",fontWeight:850}}>{email}</a>
        </div>
        <KeylessMap points={[{name:clientName,lat:coords.lat,lng:coords.lng,detail:(location||matchedPlace)+" · concept office location"}]} center={[coords.lng,coords.lat]} zoom={12}/>
      </section>

      <section id="contact" style={{background:"#f0ece3",padding:"82px 0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 22px"}}>
          <div style={{maxWidth:720}}>
            <p style={eyebrow}>Start a conversation</p>
            <h2 style={sectionTitle}>Have a project in mind?</h2>
            <p style={lead}>Keep the first contact simple. Tell us what you are planning and the team can follow up for drawings, site details or a formal quotation later.</p>
          </div>

          {sent?(
            <div style={{marginTop:26,background:"#fff",border:"1px solid #d6d0c5",padding:22,borderRadius:4}}>
              <strong>Demo enquiry prepared.</strong>
              <p style={bodyCopy}>This concept does not send data. In a commissioned site this can route to the company’s chosen email/workspace.</p>
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12,marginTop:26}}>
              <label style={field}>Name<input value={name} onChange={(e)=>setName(e.target.value)} style={input}/></label>
              <label style={field}>Phone<input value={phone} onChange={(e)=>setPhone(e.target.value)} style={input}/></label>
              <label style={field}>Project type<select value={projectType} onChange={(e)=>setProjectType(e.target.value)} style={input}><option>General construction</option><option>Commercial building</option><option>Residential</option><option>Refurbishment</option><option>Civil/site works</option></select></label>
              <label style={{...field,gridColumn:"1 / -1"}}>Brief<textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="A short description is enough for the first conversation." style={{...input,minHeight:110}}/></label>
              <button onClick={submit} style={{border:0,background:"#171717",color:"#fff",padding:"13px 16px",fontWeight:900,borderRadius:2,width:"fit-content"}}>{cta || "Request a consultation"}</button>
            </div>
          )}
        </div>
      </section>

      <footer style={{background:"#171717",color:"#fff",padding:"34px 0"}}>
        <div style={{maxWidth:1240,margin:"0 auto",padding:"0 22px",display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap",fontSize:11,color:"#aaa"}}>
          <div><strong style={{color:"#fff"}}>{clientName}</strong><div style={{marginTop:5}}>Construction website concept · Botswana</div></div>
          <div style={{display:"flex",gap:14}}>
            <Link href={"/demo/build-quote/legal/privacy?client="+encodeURIComponent(clientName)}>Privacy</Link>
            <Link href={"/demo/build-quote/legal/terms?client="+encodeURIComponent(clientName)}>Terms</Link>
            <Link href={"/demo/build-quote/legal/data-notice?client="+encodeURIComponent(clientName)}>Demo data notice</Link>
          </div>
          <div>Designed &amp; developed by Bokang Jobe</div>
        </div>
      </footer>
    </main>
  );
}

const eyebrow:React.CSSProperties={fontSize:11,fontWeight:900,textTransform:"uppercase",letterSpacing:1.5,color:"#8a6d32",margin:0};
const sectionTitle:React.CSSProperties={fontSize:"clamp(34px,5vw,58px)",lineHeight:1.02,letterSpacing:"-.04em",margin:"9px 0 0"};
const lead:React.CSSProperties={fontSize:20,lineHeight:1.65,color:"#2f2b25",marginTop:0};
const bodyCopy:React.CSSProperties={fontSize:14,lineHeight:1.75,color:"#6a6358"};
const field:React.CSSProperties={display:"grid",gap:6,fontSize:11,fontWeight:850};
const input:React.CSSProperties={width:"100%",border:"1px solid #cfc8bb",background:"#fff",borderRadius:2,padding:12,font:"inherit"};
