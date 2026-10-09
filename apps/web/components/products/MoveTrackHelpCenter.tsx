"use client";
import {useState} from "react";
import {usePersistentState} from "@bokang/persistence";
import {Sun,Moon,LifeBuoy,ShieldCheck,FileText,HelpCircle,Mail,ExternalLink,Database,Info} from "lucide-react";
import {MoveTrackRichContent} from "./MoveTrackReadableContent";

export const MOVETRACK_THEME_KEY="bokang-studio.move-track.ui.theme.v1";
export type MoveTrackTheme="light"|"dark";
type HelpPage="preferences"|"support"|"privacy"|"terms"|"faq";
const tile:React.CSSProperties={border:"1px solid #dce5ef",borderRadius:14,background:"var(--mt-surface,#fff)",padding:18};
const btn:React.CSSProperties={padding:"11px 14px",border:"1px solid #d0dae7",borderRadius:10,background:"var(--mt-surface,#fff)",color:"var(--mt-ink,#153455)",fontWeight:850,cursor:"pointer",minHeight:44};
const email="jobebokang@gmail.com";
const faq=[
 ["What is MoveTrack AI?","A frontend demonstration for company setup, fleet operations and Safety, Health & Environment workflows including checklists, meetings, risk assessments, OCR and document exports."],
 ["Do I need an account?","No. This edition has no login. Company and person selections are labels, not authenticated or independently verified identities."],
 ["Where do my documents and signatures live?","Operational records use this browser's local storage. Some scanned source documents use device-local browser storage. They are not synchronized to other devices or a trusted corporate server."],
 ["Can I use this to issue a work permit?","No. NO-GO, COMPLETE and reviewed (demo) labels are local test states only. Site-specific permits, engineering checks, trained supervisors and formal authorization remain required."],
 ["What does a drawn signature prove?","It captures a pen/finger mark and the declared name, role, time and purpose. It does not verify the signer or provide a cryptographic, secure or qualified electronic signature."],
 ["Can I download blank forms?","Yes. Open SHE Forms, custom forms, Meeting Registers or JRA, and choose PDF, Word, CSV or JSON. Unfilled, draft and submitted records are supported."],
 ["Why is my participation history empty?","A local company person must be selected as participant, reviewer, attendee or submitter on a saved record. The app does not guess identity from unrelated free text."],
 ["How do I back up data?","Open Workspace → Local data, export JSON, and store it securely off-device. Imports affect this browser only. Backups may include sensitive employee data and signatures."],
 ["Can I delete my data?","Yes. Workspace → Local data → clear MoveTrack workspace. This clears this origin's supported local data in the browser, not copies you already exported or shared."],
 ["Does Dark Mode affect printed forms?","No. Theme changes the application UI. PDF and Word reports keep accessible paper-oriented formatting suitable for printing."],
 ["Can Microsoft 365 / Firebase users sign in?","Not in this frontend demo. A future authenticated enterprise edition would require permission checks, tenant verification and security architecture before enabling corporate data."],
 ["Is my handwritten signature legally binding?","Do not treat this demo capture as a legally valid or site-authorized signature. Botswana's Electronic Communications and Transactions Act sets conditions; secure identity, integrity and authorization are not implemented here."]
] as const;
const docs=[
 {id:"privacy" as const,label:"Privacy notice",icon:ShieldCheck},
 {id:"terms" as const,label:"Terms of use",icon:FileText},
 {id:"faq" as const,label:"FAQ",icon:HelpCircle},
 {id:"support" as const,label:"Customer support",icon:LifeBuoy}
];
export function MoveTrackHelpCenter({initialPage="preferences",onOpenData}:{initialPage?:HelpPage;onOpenData?:()=>void}){
 const [theme,setTheme]=usePersistentState<MoveTrackTheme>(MOVETRACK_THEME_KEY,"light");
 const [page,setPage]=useState<HelpPage>(initialPage);
 const [search,setSearch]=useState("");
 const [expanded,setExpanded]=useState<number|null>(null);
 const [topic,setTopic]=useState("Product feedback");
 const [details,setDetails]=useState("");
 const [reference,setReference]=useState("");
 const bodyText=(text:string)=><MoveTrackRichContent blocks={[{type:"paragraph",content:[{text}]}]} tone="muted" className="movetrack-help-body"/>;
 function composeMail(){
  const subject="MoveTrack AI support — "+topic+(reference.trim()?" — "+reference.trim():"");
  const body="Hello MoveTrack support,\n\n"+details.trim()+"\n\nBrowser edition: local frontend preview\nPlease do not send passwords, signatures, medical records or confidential incident files.\n";
  window.location.href="mailto:"+email+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
 }
 return <section aria-label="Settings, customer support and legal information" style={{display:"grid",gap:13}}>
  <div style={{...tile,background:"linear-gradient(112deg,#0d2442,#175a91)",color:"#fff",border:0}}>
   <p style={{fontWeight:900,letterSpacing:1.2,color:"#bfdbfe",fontSize:11,margin:"0 0 7px"}}>SETTINGS · HELP · TRUST</p>
   <h2 style={{fontSize:26,margin:"0 0 9px"}}>Your workspace, your preferences.</h2>
   <p style={{maxWidth:730,color:"#dbeafe",fontSize:12,lineHeight:1.7,margin:0}}>Control appearance, get help and understand how local forms, signatures, data protection and workplace approvals are handled.</p>
  </div>
  <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
   {([{id:"preferences",label:"Appearance",icon:Sun},...docs] as const).map(item=><button type="button" key={item.id} className="movetrack-ui-button" data-mt-variant={page===item.id?"selected":"secondary"}
    onClick={()=>setPage(item.id)} aria-pressed={page===item.id}
    className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,background:page===item.id?"#173764":"#fff",color:page===item.id?"#fff":"#344054",display:"flex",gap:6,alignItems:"center"}}>
    <item.icon size={15}/>{item.label}
   </button>)}
  </div>
  {page==="preferences"?<div style={{...tile,display:"grid",gap:15}}>
   <div><h3 style={{margin:"0 0 5px",fontSize:19}}>Appearance</h3>{bodyText("Your selection is saved to this device. Reports remain optimized for white paper regardless of theme.")}</div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,180px),1fr))",gap:10}}>
    {([{id:"light",label:"Light mode",icon:Sun,desc:"Clean, bright operational workspace"},{id:"dark",label:"Dark mode",icon:Moon,desc:"Reduced glare in low-light settings"}] as const).map(opt=>
      <button type="button" key={opt.id} className="movetrack-ui-button" data-mt-variant={theme===opt.id?"selected":"secondary"} aria-pressed={theme===opt.id} onClick={()=>setTheme(opt.id)}
       style={{...tile,textAlign:"left",cursor:"pointer",borderColor:theme===opt.id?"#2563eb":"#e2e8f0",boxShadow:theme===opt.id?"inset 0 0 0 1px #2563eb":undefined}}>
       <opt.icon size={22} color="#2563eb"/><strong style={{display:"block",marginTop:8,fontSize:14}}>{opt.label}</strong>
       <small style={{fontSize:11,color:"var(--mt-muted,#64748b)"}}>{opt.desc}</small>
      </button>
     )}
   </div>
   <div style={{padding:14,borderRadius:12,background:"var(--mt-surface-soft,#f1f5f9)",display:"grid",gap:8}}>
    <strong style={{fontSize:13}}>Device data and backup</strong>{bodyText("No enterprise storage or remote account sync is connected in this edition. Clear browser data or use a private device for fictional test records.")}
    {onOpenData?<button className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,justifySelf:"start"}} onClick={onOpenData}><Database size={15} style={{display:"inline"}}/> Open local data manager</button>:null}
   </div>
  </div>:null}
  {page==="support"?<div style={{...tile,display:"grid",gap:12}}>
   <h3 style={{margin:"0 0 1px"}}>Contact customer support</h3>
   {bodyText("For assistance with company onboarding, fleet inspections, custom forms, signatures, PDF downloads or accessibility, contact the developer. This frontend does not host a ticket server; the action below opens your email app.")}
   <a href={"mailto:"+email} style={{fontSize:14,fontWeight:850,color:"var(--mt-link,#2563eb)",display:"inline-flex",gap:8,alignItems:"center"}}><Mail size={17}/>{email}</a>
   <label style={{fontSize:12,fontWeight:800,display:"grid",gap:5}}>What do you need help with?
    <select className="movetrack-ui-field" style={{...btn,textAlign:"left"}} value={topic} onChange={e=>setTopic(e.target.value)}>
      {["Product feedback","Company onboarding","Fleet and safety workflow","Digital signatures","Document export","Data and privacy request","Report a technical problem","Commercial enquiry"].map(t=><option key={t}>{t}</option>)}
    </select>
   </label>
   <label style={{fontSize:12,fontWeight:800,display:"grid",gap:5}}>Reference or affected form (optional)
     <input className="movetrack-ui-field" style={{...btn,textAlign:"left",fontWeight:400}} value={reference} onChange={e=>setReference(e.target.value)} placeholder="e.g. WORK-452 / JRA-1"/>
   </label>
   <label style={{fontSize:12,fontWeight:800,display:"grid",gap:5}}>Describe your question
     <textarea className="movetrack-ui-field" style={{...btn,textAlign:"left",fontWeight:400,minHeight:125}} value={details} onChange={e=>setDetails(e.target.value)} placeholder="What were you trying to do? What happened?"/>
   </label>
   <button className="movetrack-ui-button" data-mt-variant="primary" style={{...btn,background:"#1d4ed8",color:"#fff",justifySelf:"start"}} onClick={composeMail}><Mail size={16} style={{display:"inline",verticalAlign:"middle"}}/> Compose support email</button>
   <small style={{color:"var(--mt-warning,#a16207)"}}>Opens your device's email app. No message is sent automatically. Do not include confidential injury information, passwords, signatures or personal IDs in the message.</small>
  </div>:null}
  {page==="faq"?<div style={{...tile,display:"grid",gap:10}}>
   <h3 style={{margin:"0 0 2px"}}>Frequently asked questions</h3>
   <input aria-label="Search FAQ" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search signatures, exports, accounts, local data…" className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,textAlign:"left",fontWeight:400}}/>
   {faq.map(([question,answer],i)=>({question,answer,i})).filter(x=>(x.question+x.answer).toLowerCase().includes(search.toLowerCase())).map(({question,answer,i})=>
    <div key={question} style={{border:"1px solid #e2e8f0",borderRadius:11,overflow:"hidden"}}>
      <button aria-expanded={expanded===i} onClick={()=>setExpanded(expanded===i?null:i)} className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,border:0,textAlign:"left",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",gap:7}}>{question}<span>{expanded===i?"−":"+"}</span></button>
      {expanded===i?<div style={{padding:"3px 14px 12px",fontSize:12}}><MoveTrackRichContent blocks={[{type:"paragraph",content:[{text:answer}]}]} tone="muted"/></div>:null}
    </div>)}
   <button className="movetrack-ui-button" data-mt-variant="secondary" style={{...btn,justifySelf:"start"}} onClick={()=>setPage("support")}>Still need help? Contact support</button>
  </div>:null}
  {page==="privacy"?<article style={{...tile,display:"grid",gap:7}}>
   <h3 style={{fontSize:21,margin:"0 0 3px"}}>MoveTrack AI — Privacy Notice</h3>
   <p style={{fontSize:11,color:"var(--mt-muted,#64748b)"}}>Last revised: 9 October 2026 · Botswana frontend demonstration</p>
   <h4>1. Scope and contact</h4>{bodyText("MoveTrack AI is a local-browser proof of concept designed and developed by Bokang Jobe. Privacy queries: "+email+". The notice describes this demo, not an enterprise-grade deployed identity or storage service.")}
   <h4>2. Information you choose to enter</h4>{bodyText("Local records may contain company names, workplace details, employee names, work orders, hazard observations, meeting attendance, images, reports, draft answers, local drawn signatures, signers' declared names, roles and capture timestamps. Avoid real sensitive personnel, injury or medical data in this unsecured preview.")}
   <h4>3. Processing and storage</h4>{bodyText("The demo writes operational records primarily to this browser's storage; scanned documents may use local device storage. There is no connected Firebase database or enterprise identity provider and records do not sync to our own central business-data database. Exporting a file transfers control of that copy to your device or the recipient you choose.")}
   <h4>4. Network and platform metadata</h4>{bodyText("Loading the site requests pages and static assets through Cloudflare, whose infrastructure may process IP addresses, request metadata and security logs. Clicking customer support opens your email application, which handles any message you send. Never assume the internet connection or browser data is anonymous.")}
   <h4>5. Your choices</h4>{bodyText("Avoid entering personal data, edit or delete local records, and download backups using the Local data manager. Clearing site data on your browser can erase local records; backups and files already shared are not automatically deleted. Device owners control browser storage and export locations.")}
   <h4>6. Safeguards and limitations</h4>{bodyText("This proof of concept does not provide account-level identity verification, role-based authorization, centrally managed retention, enterprise encryption, cross-device backups or verified digital signatures. Browser-local information may be accessible to another person using the same browser profile.")}
   <h4>7. Botswana legal context</h4>{bodyText("The Data Protection Act, 2024 (commenced 14 January 2025) applies to relevant personal data processing. Organizations should assess their own controller/processor duties, security, lawful grounds, data-subject requests, retention and international transfers before using MoveTrack with live corporate information. This text is not legal advice.")}
   <a target="_blank" rel="noreferrer" style={{fontSize:12,color:"var(--mt-link,#2563eb)"}} href="https://botswanalaws.com/consolidated-statutes/principle-legislation/data-protection">Botswana Data Protection legislation <ExternalLink size={12} style={{display:"inline"}}/></a>
   <p style={{fontSize:11,color:"var(--mt-muted,#64748b)"}}>Privacy requests: {email}. For issues involving records on your own device, use the Local data manager first.</p>
  </article>:null}
  {page==="terms"?<article style={{...tile,display:"grid",gap:7}}>
    <h3 style={{fontSize:21,margin:0}}>MoveTrack AI — Terms of Use</h3>
    <p style={{fontSize:11,color:"var(--mt-muted,#64748b)"}}>Last revised: 9 October 2026 · Preview/demo terms</p>
    <h4>1. Demonstration only</h4>{bodyText("MoveTrack AI is an educational and evaluation prototype, supplied as-is to explore software workflows. It is not a production permit-to-work, plant certification, occupational safety authorization, statutory reporting or employee verification system.")}
    <h4>2. Safe operation</h4>{bodyText("Never use a displayed GO, PASS, COMPLETE, reviewed, signed or other demo status to authorize hazardous work, release equipment, certify competence or substitute legal obligations. Organizations must use authorized site procedures and competent personnel.")}
    <h4>3. Data and responsible use</h4>{bodyText("Use sample/fictional information unless you have an appropriate legal basis, organizational permission, safeguards and retention controls. Do not upload others' sensitive personal information, confidential investigations, medical records or restricted operational documents.")}
    <h4>4. Signatures and approvals</h4>{bodyText("Handwritten signature capture records a locally entered mark, claimed identity, intention and timestamp but is not an advanced or qualified electronic signature, verified identity or tamper-proof audit trail. The Botswana Electronic Communications and Transactions Act establishes circumstances in which electronic signatures may be legally recognized; those conditions are not assessed or assured by this demo.")}
    <h4>5. Local availability and exports</h4>{bodyText("Browser data can be lost due to clearing storage, private browsing, device failure or quota restrictions. Downloaded PDF, Word, CSV and JSON files are supplied for evaluation without guarantees of official acceptance or long-term authenticity.")}
    <h4>6. Intellectual property and external software</h4>{bodyText("MoveTrack AI and its user interface are presented as developed by Bokang Jobe. Open-source components are incorporated under their respective licenses. This demo does not grant a licence to third-party trademarks or data.")}
    <h4>7. Changes, warranty and contact</h4>{bodyText("Features may change without notice while this preview is developed. The demo comes without production service levels or assurance of uninterrupted availability. To enquire about enterprise use, agreements or support, contact "+email+".")}
    <a href="https://www.bocra.org.bw/sites/default/files/documents/Electronic-Communications-and-Transactions-Act-2014.pdf" target="_blank" rel="noreferrer" style={{fontSize:12,color:"var(--mt-link,#2563eb)"}}>Botswana Electronic Communications and Transactions Act <ExternalLink size={12} style={{display:"inline"}}/></a>
    <small style={{color:"var(--mt-muted,#64748b)"}}>Legal and data protection review is required before commercial deployment.</small>
   </article>:null}
  <footer style={{textAlign:"center",fontSize:11,color:"var(--mt-muted,#64748b)",padding:"8px 0"}}>Designed and developed by Bokang Jobe · Botswana · Support: <a href={"mailto:"+email} style={{color:"var(--mt-link,#2563eb)"}}>{email}</a></footer>
 </section>;
}
