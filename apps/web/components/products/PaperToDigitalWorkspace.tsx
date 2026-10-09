"use client";
import {OperationalTextAssist} from "./OperationalTextAssist";
import {useEffect,useMemo,useState} from "react";
import {motion,useReducedMotion} from "framer-motion";
import {ScanText,FileUp,FileImage,FileText,RefreshCw,Plus,Trash2,Save,CheckCircle2,ExternalLink,AlertTriangle} from "lucide-react";
import {usePersistentState} from "@bokang/persistence";
import {ASSURANCE_STORAGE,demoOrganization,demoPeople,makeCustomTemplate,dictionary,type CustomTemplate,type OrganizationProfile,type PersonRecord} from "@bokang/domain-data/custom-assurance";
import {type FormCategory,type FormField,type FormSection,type FormTemplate} from "@bokang/domain-data/assurance-forms";
import {detectPaperCategory,parsePaperText,validatePaperSections,unreviewedPaperFields,paperPublicationIssues,type PaperExtraction} from "@bokang/domain-data/paper-forms";
import {mergePaperLayout,type DetectedElement,type LayoutProposal} from "@bokang/domain-data/paper-layout";
import {readPaperDocument,acceptedPaperFile,downloadSourcePdf,type PaperProgress} from "../../lib/paper-ocr";
import {savePaperOriginal,getPaperOriginal,deletePaperOriginal} from "../../lib/paper-source-store";
import {DocumentDownloadActions} from "./DocumentDownloadActions";
import {buildFormDocument} from "../../lib/form-exports";
import {WorkspaceSteps} from "./WorkspaceSteps";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";
import {ACTIVE_WORKFLOW_KEY,ACTIVE_FORMS_TAB_KEY} from "./OperationalGraphPanel";

const root:React.CSSProperties={border:"1px solid #d9e5f0",borderRadius:17,background:"#fff",padding:17};
const input:React.CSSProperties={width:"100%",minHeight:43,padding:"10px 12px",border:"1px solid #cbd5e1",borderRadius:11,font:"inherit",background:"#fff",color:"#152d50"};
const btn:React.CSSProperties={border:"1px solid #cad6e3",padding:"10px 13px",background:"#fff",borderRadius:10,color:"#1e3a5f",minHeight:43,fontWeight:850,cursor:"pointer"};
const primary:React.CSSProperties={...btn,background:"#1d4ed8",color:"#fff",borderColor:"#1d4ed8"};
const label:React.CSSProperties={fontSize:12,fontWeight:800,color:"#344054",display:"grid",gap:6};
type PaperDraft={id:string;sourceName:string;kind:string;title:string;category:FormCategory;sections:FormSection[];rawText:string;warnings:string[];confidence:number|null;pages:number;orgId:string;elements?:DetectedElement[];summary?:LayoutProposal["summary"]};
const kinds:FormCategory[]=["Fleet","Safety","Meetings","Risk","Handover","Inspections"];
const typeOptions:FormField["type"][]=["checkbox","radio","yes_no","pass_fail_na","select","multiselect","text","multiline","number","date","datetime","repeat","person","people","signature","risk"];
export function PaperToDigitalWorkspace({onOpenDesigner}:{onOpenDesigner?:()=>void}={}){
 const reduced=useReducedMotion();
 const [orgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [orgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [people]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [templates,setTemplates]=usePersistentState<CustomTemplate[]>(ASSURANCE_STORAGE.templates,[]);
 const [draft,setDraft]=usePersistentState<PaperDraft|null>("bokang-studio.move-track.paper.staging.v1",null);
 const [file,setFile]=useState<File|null>(null);
 const [url,setUrl]=useState("");
 const [progress,setProgress]=useState<PaperProgress|null>(null);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [stage,setStage]=useState(0);
 const [rawOpen,setRawOpen]=useState(false);
 const [preview,setPreview]=useState(false);
 const [previewValues,setPreviewValues]=useState<Record<string,string|boolean|string[]>>({});
 const [,designerEdit]=usePersistentState<string|null>("bokang-studio.move-track.designer.editing.v1",null);
 const [,designerTitle]=usePersistentState("bokang-studio.move-track.designer.title.v1","");
 const [,designerDescription]=usePersistentState("bokang-studio.move-track.designer.description.v1","");
 const [,designerCategory]=usePersistentState<FormCategory>("bokang-studio.move-track.designer.category.v1","Inspections");
 const [,designerSections]=usePersistentState<FormSection[]>("bokang-studio.move-track.designer.sections.v1",[]);
 const [,setActive]=usePersistentState<string|null>(ACTIVE_WORKFLOW_KEY,null);
 const [,setTab]=usePersistentState<"library"|"records"|"designer"|"jra">(ACTIVE_FORMS_TAB_KEY,"library");
 const org=orgs.find(o=>o.id===orgId)??orgs[0]??demoOrganization;
 useEffect(()=>{
  if(!file){setUrl("");return;}
  const next=URL.createObjectURL(file);setUrl(next);
  return ()=>URL.revokeObjectURL(next);
 },[file]);
 const visibleDraft=draft?.orgId===org.id?draft:null;
 useEffect(()=>{if(!visibleDraft?.id)return;let cancelled=false;getPaperOriginal(visibleDraft.id,org.id).then(saved=>{if(!cancelled&&saved)setFile(saved);}).catch(()=>{});return ()=>{cancelled=true;};},[visibleDraft?.id,org.id]);
 const template:FormTemplate|null=visibleDraft?{id:visibleDraft.id,version:1,title:visibleDraft.title,category:visibleDraft.category,
  status:"DRAFT",effectiveDate:new Date().toISOString().slice(0,10),siteIds:[],assetClasses:[],sections:visibleDraft.sections}:null;
 const fieldCount=visibleDraft?.sections.reduce((sum,s)=>sum+s.fields.length,0)??0;
 const patch=(v:Partial<PaperDraft>)=>setDraft(current=>current&&current.orgId===org.id?{...current,...v}:current);
 const editSection=(sectionId:string,fn:(s:FormSection)=>FormSection)=>patch({sections:(visibleDraft?.sections??[]).map(s=>s.id===sectionId?fn(s):s)});
 const editField=(sectionId:string,fieldId:string,fn:(f:FormField)=>FormField)=>editSection(sectionId,s=>({...s,fields:s.fields.map(f=>f.id===fieldId?fn(f):f)}));
 async function read(){
  if(!file){setMessage("Select a photo, PNG, JPEG, WebP, or PDF first.");return;}
  setBusy(true);setMessage("");
  try{
   const parsed=await readPaperDocument(file,setProgress);
   const next:PaperDraft={...parsed,id:"paper-"+crypto.randomUUID(),kind:parsed.kind,category:detectPaperCategory(parsed.kind),orgId:org.id};
   setPreviewValues({});
   setDraft(next);
   try{
    await savePaperOriginal(next.id,org.id,file);
    setStage(1);setMessage("OCR text and original scan archived in this browser. Compare every field with the source, especially safety controls and names.");
   }catch(e){
    setMessage("OCR text is saved, but the original could not be archived on this device: "+(e instanceof Error?e.message:String(e))+". Keep a copy of the original yourself.");
   }
  }catch(e){setMessage(e instanceof Error?e.message:"Could not read this paper document.");}
  finally{setBusy(false);}
 }
 function reparse(){
  if(!visibleDraft)return;
  const parsed=parsePaperText(visibleDraft.sourceName,visibleDraft.rawText,visibleDraft.confidence,visibleDraft.pages);
  if(!window.confirm("Re-detect questions from edited text? This replaces your manual question edits."))return;
  const joined=mergePaperLayout(parsed,visibleDraft.elements??[]);
  patch({sections:joined.sections,warnings:joined.warnings,kind:parsed.kind,summary:joined.summary});
 }
 function create(publish:boolean){
  if(!visibleDraft)return;
  try{
   validatePaperSections(visibleDraft.sections);
   if(publish){
    const issues=paperPublicationIssues(visibleDraft.sections);
    if(issues.length)throw Error("Resolve "+issues.length+" import review issue(s) before publishing: "+issues.slice(0,3).join("; "));
   }
   if(visibleDraft.title.trim().length<4)throw Error("Enter a descriptive form title.");
   const now=new Date().toISOString();
   const before=templates.find(t=>t.id===visibleDraft.id);
   const fresh=makeCustomTemplate({
    id:visibleDraft.id,organization:org,title:visibleDraft.title,category:visibleDraft.category,
    description:"Paper-to-digital reconstruction from "+visibleDraft.sourceName+" (OCR reviewed manually)",
    sections:visibleDraft.sections.map(s=>({...s,fields:[...s.fields]})),status:publish?"PUBLISHED":"DRAFT",
    now,version:before?before.version+1:1
   });
   setTemplates(t=>[fresh,...t.filter(t=>t.id!==fresh.id)]);
   setMessage(publish?"Published a reusable company-branded checklist. Open it in SHE Forms to fill and export.":"Saved as a draft template. Publish after confirming the OCR and layout.");
   if(publish){setActive(fresh.id);setTab("library");}
  }catch(e){setMessage(e instanceof Error?e.message:"Form validation failed.");}
 }
 function reviewAll(){
  if(!visibleDraft||!window.confirm("Have you compared EVERY detected question, its choices and its safety meaning with the original page? This only marks the draft reviewed; it does not authorize work."))return;
  patch({sections:visibleDraft.sections.map(s=>({...s,fields:s.fields.map(f=>f.source?{...f,source:{...f.source,reviewed:true}}:f)}))});
  setMessage("All detected elements marked reviewed in this local draft. Inspect high-risk questions before publishing.");
 }
 function handoff(){
  if(!visibleDraft)return;
  try{validatePaperSections(visibleDraft.sections);if(unreviewedPaperFields(visibleDraft.sections).length)throw Error("Review all OCR-detected controls against their source pages before entering the full designer.");}catch(e){setMessage(e instanceof Error?e.message:"Review the form sections first.");return;}
  if(!window.confirm("Copy the reconstructed form to the full custom designer? It will replace the current unsaved designer draft but retain this paper import."))return;
  designerEdit(null);designerTitle(visibleDraft.title);designerDescription("Imported from "+visibleDraft.sourceName);
  designerCategory(visibleDraft.category);designerSections(structuredClone(visibleDraft.sections));
  setTab("designer");onOpenDesigner?.();setMessage("Editable UI form copied into the custom form designer.");
 }
 function reset(){if(window.confirm("Discard this paper import and its locally archived original? Previously published forms stay saved.")){
   if(visibleDraft?.id)void deletePaperOriginal(visibleDraft.id).catch(()=>{});
   setDraft(null);setStage(0);setFile(null);setProgress(null);setMessage("");
  }}
 return <section aria-label="Paper to digital OCR studio" style={{display:"grid",gap:15}}>
  <div style={{...root,background:"linear-gradient(105deg,#0c213d,#15548b)",color:"#fff",border:0,padding:22}}>
   <div style={{display:"flex",gap:11,alignItems:"center"}}><ScanText size={27} color="#bfdbfe"/><div>
    <p style={{color:"#93c5fd",letterSpacing:1.5,fontSize:11,fontWeight:900,margin:"0 0 6px"}}>PAPER → DIGITAL DOCUMENT STUDIO</p>
    <h2 style={{fontSize:24,margin:0}}>Use the checklist your company already has.</h2>
   </div></div>
   <p style={{fontSize:12,lineHeight:1.7,color:"#cbd5e1",maxWidth:850,margin:"13px 0 0"}}>
    Import a photograph, PDF or scanned form. Detect printed checkbox squares, radio choices, answer lines, fillable PDF widgets, text labels and table registers; turn them into working UI elements for editing and review. Generate company-branded blank and filled PDFs or Word documents. The original file is archived in your browser for comparison; the extracted fields are saved locally.</p>
  </div>
  <WorkspaceSteps label="Paper reconstruction steps" steps={["Upload","Review & edit","Save / publish"]} step={stage} onChange={next=>{if(next===0||visibleDraft)setStage(next);else setMessage("Upload and extract a document first.");}}/>
  <div hidden={stage===2} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,290px),1fr))",gap:13}}>
   <div style={{...root,display:"grid",gap:11,alignContent:"start"}}>
    <strong style={{fontSize:17}}>1 · Upload a paper document</strong>
    <p style={{fontSize:12,color:"#64748b",margin:0}}>JPG, PNG, WebP or PDF (12 MB maximum, five pages). OCR + page geometry + fillable PDF controls; browser-only, no paid API.</p>
    <label style={label}>Scan, mobile photo, or PDF
     <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp,.pdf,.png,.jpg,.jpeg,.webp" style={input}
      onChange={e=>{const next=e.target.files?.[0]??null;if(!next)return;try{acceptedPaperFile(next);setFile(next);setProgress(null);setMessage("");}catch(err){setMessage(String(err));e.target.value="";}}}/>
    </label>
    <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
     <button style={primary} disabled={!file||busy} onClick={()=>void read()}><ScanText size={16} style={{display:"inline",verticalAlign:"middle"}}/> {busy?"Reading source…":"Extract & detect fields"}</button>
     {file?<button style={btn} onClick={()=>void downloadSourcePdf(file).catch(e=>setMessage(String(e)))}>Export unchanged source PDF</button>:null}
    </div>
    {progress?<div role="status" style={{display:"grid",gap:6}}><span style={{fontSize:11,color:"#475569"}}>{progress.phase} ({progress.percent}%)</span>
     <div style={{background:"#dbeafe",height:7,borderRadius:9,overflow:"hidden"}}><div style={{width:progress.percent+"%",height:7,background:"#2563eb"}}/></div></div>:null}
    {file&&url?<div style={{border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden",minHeight:270,background:"#f8fafc"}}>
      {file.type==="application/pdf"||/\.pdf$/i.test(file.name)?<object data={url} type="application/pdf" width="100%" height="370"><a href={url} target="_blank" rel="noreferrer">View original PDF</a></object>:
       <img src={url} alt={"Source paper "+file.name} style={{width:"100%",maxHeight:420,objectFit:"contain"}}/>}
      <p style={{fontSize:11,color:"#64748b",padding:"4px 10px"}}>Original for visual comparison · {file.name}</p>
     </div>:null}
   </div>
   <div hidden={stage===0} style={{...root,display:"grid",gap:13,alignContent:"start"}}>
    <strong style={{fontSize:17}}>2 · Review the detected structure</strong>
    {!visibleDraft?<p style={{fontSize:12,color:"#64748b"}}>No paper processed for {org.name}. Upload a source to review detected headings and questions.</p>:<>
     <p style={{fontSize:11,color:"#475569",margin:0}}>{visibleDraft.pages} page(s) · {fieldCount} editable questions · {visibleDraft.elements?.length??0} detected graphical controls · OCR confidence {visibleDraft.confidence===null?"digital text / unavailable":Math.round(visibleDraft.confidence)+"%"}.</p>
     {visibleDraft.summary?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,115px),1fr))",gap:7}}>
      {([{label:"Checkbox choices",value:visibleDraft.summary.checkbox},{label:"Radio & decisions",value:visibleDraft.summary.radio},{label:"Text inputs",value:visibleDraft.summary.text},{label:"Signatures",value:visibleDraft.summary.signature},{label:"Tables/registers",value:visibleDraft.summary.table}] as const).map(item=><div key={item.label} style={{background:"#f1f5fa",padding:10,borderRadius:9}}>
       <strong style={{fontSize:18,color:"#174fa8"}}>{item.value}</strong><div style={{fontSize:10,color:"#64748b"}}>{item.label}</div>
      </div>)}
     </div>:null}
     <label style={label}>Form name<input style={input} value={visibleDraft.title} onChange={e=>patch({title:e.target.value})}/></label>
     <label style={label}>Document type<select style={input} value={visibleDraft.category} onChange={e=>patch({category:e.target.value as FormCategory})}>{kinds.map(k=><option key={k}>{k}</option>)}</select></label>
     {visibleDraft.warnings.map((w,i)=><p key={i} style={{padding:"9px 10px",fontSize:11,color:"#915b16",background:"#fffbeb",borderRadius:9,margin:0}}><AlertTriangle size={13} style={{display:"inline",verticalAlign:"middle"}}/> {w}</p>)}
     <button style={{...btn,justifySelf:"start"}} onClick={()=>setRawOpen(!rawOpen)}>{rawOpen?"Hide":"Review / correct"} raw OCR text</button>
     {rawOpen?<div style={{display:"grid",gap:7}}>
       <OperationalTextAssist value={visibleDraft.rawText}/>
       <textarea aria-label="Recognized source text" style={{...input,minHeight:190,fontFamily:"monospace",fontSize:12}} value={visibleDraft.rawText} onChange={e=>patch({rawText:e.target.value})}/>
       <button style={btn} onClick={reparse}><RefreshCw size={13} style={{display:"inline"}}/> Re-detect questions from edited text</button>
      </div>:null}
    </>}
   </div>
  </div>
  {visibleDraft?<div hidden={stage===0} style={{...root,display:"grid",gap:12}}>
   <div hidden={stage!==1} style={{display:"grid",gap:12}}>
   <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap",alignItems:"center"}}>
    <div><h3 style={{fontSize:18,margin:"0 0 3px"}}>3 · Reconstruct and review UI components</h3><p style={{fontSize:12,color:"#64748b",margin:0}}>Drag-free editing works on mobile. Match the paper headings and add missing columns/questions manually.</p></div>
    <button style={btn} onClick={()=>patch({sections:[...visibleDraft.sections,{id:"ocr-section-"+crypto.randomUUID().slice(0,7),title:"New section",fields:[{id:"ocr-"+crypto.randomUUID().slice(0,6),label:"New question",type:"text",required:false}]}]})}><Plus size={16} style={{display:"inline"}}/> Add section</button>
   </div>
   {visibleDraft.sections.map((section,index)=><motion.div key={section.id} initial={reduced?false:{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{border:"1px solid #dbe5ef",borderRadius:12,overflow:"hidden"}}>
    <div style={{padding:11,display:"flex",gap:9,flexWrap:"wrap",alignItems:"center",background:"#edf4ff"}}>
     <strong style={{fontSize:12,color:"#1d4ed8"}}>{String(index+1).padStart(2,"0")}</strong>
     <input aria-label="Section heading" style={{...input,flex:"1 1 200px",fontWeight:850}} value={section.title} onChange={e=>editSection(section.id,s=>({...s,title:e.target.value}))}/>
     <button style={btn} aria-label="Remove section" onClick={()=>patch({sections:visibleDraft.sections.filter(s=>s.id!==section.id)})}><Trash2 size={16}/></button>
    </div>
    <div style={{padding:12,display:"grid",gap:8}}>
     {section.fields.map((f,i)=><div key={f.id} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,155px),1fr))",gap:9,alignItems:"center",padding:10,border:"1px solid #e2e8f0",borderRadius:10,background:f.source?.reviewed?"#f0fdf4":"#fff"}}>
      <input aria-label={"Question "+(i+1)} style={input} value={f.label} onChange={e=>editField(section.id,f.id,v=>({...v,label:e.target.value}))}/>
      <select aria-label={"Input type "+(i+1)} style={input} value={f.type} onChange={e=>editField(section.id,f.id,v=>({...v,type:e.target.value as FormField["type"]}))}>{typeOptions.map(t=><option key={t} value={t}>{t.replaceAll("_"," / ")}</option>)}</select>
      <button style={btn} aria-label="Remove question" onClick={()=>editSection(section.id,s=>({...s,fields:s.fields.filter(x=>x.id!==f.id)}))}><Trash2 size={15}/></button>
      {f.source?<label style={{fontSize:11,color:f.source.reviewed?"#047857":"#b45309",gridColumn:"1 / -1",display:"flex",gap:8,alignItems:"center"}}>
       <input type="checkbox" checked={!!f.source.reviewed} onChange={e=>editField(section.id,f.id,v=>({...v,source:v.source?{...v.source,reviewed:e.target.checked}:undefined}))}/>
       {f.source.reviewed?"Checked against source":"Needs source review"} · Page {f.source.page} · {Math.round(f.source.confidence*100)}% detection confidence · {f.source.kind.replaceAll("-"," ")}
      </label>:null}
      {(f.type==="radio"||f.type==="select"||f.type==="multiselect")?<label style={{...label,gridColumn:"1 / -1"}}>Choice labels (one per line)
       <textarea style={{...input,minHeight:72}} value={(f.options??[]).join("\n")} onChange={e=>editField(section.id,f.id,v=>({...v,options:e.target.value.split("\n").map(x=>x.trim()).filter(Boolean)}))}/>
      </label>:null}
      {f.type==="repeat"?<div style={{gridColumn:"1 / -1",display:"grid",gap:6}}>
        <strong style={{fontSize:11}}>Detected table columns</strong>
        {(f.children??[]).map((child,ci)=><div key={child.id} style={{display:"flex",gap:6}}>
          <input style={input} aria-label={"Register column "+(ci+1)} value={child.label} onChange={e=>editField(section.id,f.id,v=>({...v,children:v.children?.map((c,j)=>j===ci?{...c,label:e.target.value}:c)}))}/>
          <button style={btn} onClick={()=>editField(section.id,f.id,v=>({...v,children:v.children?.filter((_,j)=>j!==ci)}))}>Remove</button>
         </div>)}
        <button style={btn} onClick={()=>editField(section.id,f.id,v=>({...v,children:[...(v.children??[]),{id:"column-"+crypto.randomUUID().slice(0,6),label:"New column",type:"text",required:false}]}))}>Add table column</button>
      </div>:null}
      <label style={{fontSize:11,color:"#475569",display:"flex",gap:6,alignItems:"center",gridColumn:"1 / -1"}}><input type="checkbox" checked={!!f.required} onChange={e=>editField(section.id,f.id,v=>({...v,required:e.target.checked}))}/> Required response</label>
      {(f.type==="pass_fail_na"||f.type==="yes_no")?<label style={{fontSize:11,color:"#b42318",display:"flex",gap:6,alignItems:"center",gridColumn:"1 / -1"}}><input type="checkbox" checked={!!f.critical} onChange={e=>editField(section.id,f.id,v=>({...v,critical:e.target.checked}))}/> Critical safety check (FAIL / NO → NO-GO)</label>:null}
     </div>)}
     <button style={{...btn,justifySelf:"start"}} onClick={()=>editSection(section.id,s=>({...s,fields:[...s.fields,{id:"ocr-"+crypto.randomUUID().slice(0,7),label:"New question",type:"text",required:false}]}))}><Plus size={14} style={{display:"inline"}}/> Add missing question</button>
    </div>
   </motion.div>)}
   <div style={{...root,display:"grid",gap:10,background:"#f8fbff"}}>
    <div style={{display:"flex",gap:8,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
      <div><strong>Live form element preview</strong><p style={{fontSize:11,color:"#64748b",margin:"4px 0"}}>Test the reconstructed checkboxes, radio choices and text fields before creating a reusable template.</p></div>
      <button style={btn} onClick={()=>setPreview(v=>!v)}>{preview?"Hide preview":"Preview reconstructed UI"}</button>
    </div>
    {preview?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,230px),1fr))",gap:10}}>
      {visibleDraft.sections.flatMap(sec=>sec.fields.map(field=><div key={field.id} style={{padding:12,background:"#fff",border:"1px solid #dde7f2",borderRadius:10,display:"grid",gap:8}}>
        <strong style={{fontSize:12}}>{field.label}</strong>
        {field.type==="checkbox"?<label style={{fontSize:12}}><input type="checkbox" checked={previewValues[field.id]===true} onChange={e=>setPreviewValues(v=>({...v,[field.id]:e.target.checked}))}/> Check</label>:
        field.type==="radio"||field.type==="multiselect"?<div style={{display:"grid",gap:4}}>{(field.options??["Option 1","Option 2"]).map(choice=><label key={choice} style={{fontSize:12}}><input type={field.type==="radio"?"radio":"checkbox"} name={field.id} checked={field.type==="radio"?previewValues[field.id]===choice:Array.isArray(previewValues[field.id])&&(previewValues[field.id] as string[]).includes(choice)} onChange={()=>setPreviewValues(v=>({...v,[field.id]:field.type==="radio"?choice:(Array.isArray(v[field.id])&&(v[field.id] as string[]).includes(choice)?(v[field.id] as string[]).filter(x=>x!==choice):[...(Array.isArray(v[field.id])?v[field.id] as string[]:[]),choice])}))}/> {choice}</label>)}</div>:
        field.type==="pass_fail_na"||field.type==="yes_no"?<select style={input} value={String(previewValues[field.id]??"")} onChange={e=>setPreviewValues(v=>({...v,[field.id]:e.target.value}))}><option value="">Choose</option>{(field.type==="yes_no"?(field.options??["YES","NO"]):["PASS","FAIL","NA"]).map(x=><option key={x}>{x}</option>)}</select>:
        field.type==="repeat"?<small style={{color:"#64748b"}}>Repeating table with {(field.children??[]).length} editable columns</small>:
        <input style={input} type={field.type==="date"?"date":field.type==="number"?"number":"text"} placeholder="Type a sample answer" value={String(previewValues[field.id]??"")} onChange={e=>setPreviewValues(v=>({...v,[field.id]:e.target.value}))}/>}
      </div>))}</div>:null}
   </div>
   {paperPublicationIssues(visibleDraft.sections).length>0?<div style={{border:"1px solid #f6d6a9",borderRadius:11,background:"#fffbeb",padding:12,display:"grid",gap:5}}>
     <strong style={{fontSize:12,color:"#9a6310"}}>Complete before publishing · {paperPublicationIssues(visibleDraft.sections).length} issue(s)</strong>
     {paperPublicationIssues(visibleDraft.sections).slice(0,8).map((issue,i)=><span key={i} style={{fontSize:11,color:"#9a6310"}}>• {issue}</span>)}
     <span style={{fontSize:11,color:"#64748b"}}>You can save a draft while fixing these choices. Placeholder options, missing columns and unreconciled OCR controls cannot become published company forms.</span>
    </div>:null}
   <div style={{display:"flex",gap:9,alignItems:"center",flexWrap:"wrap"}}>
     <strong>{unreviewedPaperFields(visibleDraft.sections).length} detected controls awaiting review</strong>
     <button style={btn} onClick={reviewAll}>Mark reviewed after source check</button>
     <button style={btn} onClick={handoff}>Continue in full custom form designer →</button>
   </div>
   <button type="button" style={primary} onClick={()=>setStage(2)}>Next: Save / publish →</button>
   </div>
   <div hidden={stage!==2} style={{display:"grid",gap:12}}>
   <h3 style={{margin:0}}>Save your reviewed template</h3>
   <p style={{fontSize:13,margin:0}}>{visibleDraft.title} · {fieldCount} fields · {unreviewedPaperFields(visibleDraft.sections).length} awaiting source review</p>
   {paperPublicationIssues(visibleDraft.sections).length?<p role="alert" style={{fontSize:12,color:"#b45309"}}>Review & edit must resolve {paperPublicationIssues(visibleDraft.sections).length} issue(s) before publishing. A draft can still be saved.</p>:null}
   <button type="button" style={btn} onClick={()=>setStage(1)}>← Back to review & edit</button>
   <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",padding:"11px 0"}}>
    <strong style={{fontSize:12}}>4 · Save or publish the reconstructed form</strong>
    {template?<DocumentDownloadActions document={buildFormDocument({template,mode:"blank",company:org,people:people.filter(p=>p.orgId===org.id)})}/>:null}
    <button style={btn} onClick={()=>create(false)}><Save size={15} style={{display:"inline"}}/> Save reusable draft</button>
    <button style={primary} onClick={()=>create(true)}><CheckCircle2 size={15} style={{display:"inline"}}/> Publish to SHE Forms</button>
    <button style={btn} onClick={reset}>Start over</button>
   </div>
   <p style={{fontSize:11,color:"#64748b",margin:0}}>The generated PDF/Word reproduces the reviewed questions and sections in MoveTrack's controlled layout. An exact pixel-for-pixel copy of the original is only available through “Export unchanged source PDF” while the source file is still selected.</p>
   </div>
  </div>:null}
  {message?<p role="status" style={{padding:13,background:"#eff6ff",color:"#1e40af",borderRadius:12,fontSize:12}}>{message}</p>:null}
  <details style={{...root,background:"#f8fafc",fontSize:11,color:"#64748b"}}><summary style={{minHeight:44,cursor:"pointer",fontWeight:800}}>How local OCR works and its limits</summary>Free/open-source OCR: text-bearing PDF pages are extracted directly; scanned pages and photos use Tesseract.js. Checkbox/radio graphics and answer lines use local pixel geometry; interactive PDF controls are read from the original PDF. The first OCR run may download English recognition files. The original scan archive uses local IndexedDB and is not included in the JSON workspace backup. There is no server upload in this prototype. Never treat OCR-derived safety checks as verified until a qualified person reviews them.</details>
 </section>;
}
