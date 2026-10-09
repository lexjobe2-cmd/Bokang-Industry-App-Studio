"use client";

import {TaskWorkspace,useDesktopWorkspace} from "./TaskWorkspace";
import {useState} from "react";
import {motion,useReducedMotion} from "framer-motion";
import {Plus,Trash2,ChevronUp,ChevronDown,Copy,Layers,Palette,FilePlus2,BookOpen,UsersRound,Upload,Eye,Save,CheckCircle2} from "lucide-react";
import {usePersistentState} from "@bokang/persistence";
import {
 ASSURANCE_STORAGE,dictionary,demoOrganization,demoPeople,makeCustomTemplate,templateRecipes,
 type OrganizationProfile,type PersonRecord,type CustomTemplate
} from "@bokang/domain-data/custom-assurance";
import type {AnswerType,FormCategory,FormField,FormSection,FormTemplate} from "@bokang/domain-data/assurance-forms";
import {DocumentDownloadActions} from "./DocumentDownloadActions";
import {buildFormDocument} from "../../lib/form-exports";
import {additionalAssuranceRecipes} from "@bokang/domain-data/expanded-assurance";
import {unreviewedPaperFields,paperPublicationIssues} from "@bokang/domain-data/paper-forms";
import {ACTIVE_ORGANIZATION_KEY} from "./OrganizationOnboarding";

const card:React.CSSProperties={background:"#fff",border:"1px solid #d9e2ec",borderRadius:16,padding:17};
const input:React.CSSProperties={width:"100%",border:"1px solid #cbd5e1",borderRadius:10,padding:"11px 12px",minHeight:43,font:"inherit",background:"#fff",color:"#101828"};
const btn:React.CSSProperties={border:"1px solid #cbd5e1",borderRadius:10,padding:"10px 13px",minHeight:42,fontWeight:780,background:"#fff",color:"#101828",cursor:"pointer"};
const blue:React.CSSProperties={...btn,background:"#173764",borderColor:"#173764",color:"#fff"};
const label:React.CSSProperties={fontSize:12,fontWeight:800,display:"grid",gap:6};
const newField=():FormField=>({id:"field-"+crypto.randomUUID().slice(0,9),label:"New question",type:"text",required:true});
const newSection=():FormSection=>({id:"sec-"+crypto.randomUUID().slice(0,9),title:"New section",fields:[newField()]});
function swap<T>(values:readonly T[],a:number,b:number){const list=[...values];if(b>=0&&b<list.length){[list[a],list[b]]=[list[b]!,list[a]!];}return list;}

export function CustomFormBuilder({onPublish}:{onPublish?:(id:string)=>void}){
 const reduced=useReducedMotion();
 const desktop=useDesktopWorkspace();
 const [builderPage,setBuilderPage]=useState<"library"|"properties"|"fields"|"publish">("fields");
 const [fieldFocus,setFieldFocus]=usePersistentState("bokang-studio.move-track.designer.field-focus.v1","");
 const [recipePage,setRecipePage]=useState(0);
 const [templates,setTemplates]=usePersistentState<CustomTemplate[]>(ASSURANCE_STORAGE.templates,[]);
 const [orgs,setOrgs]=usePersistentState<OrganizationProfile[]>(ASSURANCE_STORAGE.organizations,[demoOrganization]);
 const [people,setPeople]=usePersistentState<PersonRecord[]>(ASSURANCE_STORAGE.directory,demoPeople);
 const [panel,setPanel]=useState<"create"|"branding"|"dictionary"|"people">("create");
 const [editing,setEditing]=usePersistentState<string|null>("bokang-studio.move-track.designer.editing.v1",null);
 const [title,setTitle]=usePersistentState("bokang-studio.move-track.designer.title.v1","Custom field inspection");
 const [description,setDescription]=usePersistentState("bokang-studio.move-track.designer.description.v1","");
 const [category,setCategory]=usePersistentState<FormCategory>("bokang-studio.move-track.designer.category.v1","Inspections");
 const [documentType,setDocumentType]=usePersistentState<"GENERAL"|"JRA">("bokang-studio.move-track.designer.documentType.v1","GENERAL");
 const [jobId,setJobId]=usePersistentState("bokang-studio.move-track.designer.jobId.v1","");
 const [sections,setSections]=usePersistentState<FormSection[]>("bokang-studio.move-track.designer.sections.v1",[{id:"sec-initial",title:"New section",fields:[{id:"field-initial",label:"New question",type:"text",required:true}]}]);
 const [notice,setNotice]=useState("");
 const [name,setName]=useState("");
 const [jobTitle,setJobTitle]=useState("");
 const [dept,setDept]=useState("");
 const [email,setEmail]=useState("");
 const [orgId,setOrgId]=usePersistentState(ACTIVE_ORGANIZATION_KEY,demoOrganization.id);
 const [recipeFilter,setRecipeFilter]=useState("");
 const org=orgs.find(o=>o.id===orgId)??orgs[0]??demoOrganization;
 const fieldIndex=sections.flatMap((section,si)=>section.fields.map((f,fi)=>({section,si,fi,field:f})));
 const selectedField=fieldIndex.find(item=>item.field.id===fieldFocus)??fieldIndex[0];
 const focusedIndex=Math.max(0,fieldIndex.findIndex(item=>item.field.id===selectedField?.field.id));
 const recipes=[...templateRecipes,...additionalAssuranceRecipes].filter(r=>(r.title+" "+r.description).toLowerCase().includes(recipeFilter.toLowerCase()));
 const recipeSize=desktop?8:5,recipePages=Math.max(1,Math.ceil(recipes.length/recipeSize)),safeRecipePage=Math.min(recipePage,recipePages-1);
 const current=templates.find(t=>t.id===editing);
 const previewTemplate:FormTemplate={id:editing??"unpublished-form",version:current?.version??1,title:title||"Untitled form",category,status:"DRAFT",effectiveDate:new Date().toISOString().slice(0,10),siteIds:[],assetClasses:[],sections};
 function addOrganization(){const id="org-"+crypto.randomUUID();const created={...structuredClone(demoOrganization),id,name:"New organization",domain:"",businessUnit:"",logoDataUrl:undefined,logoName:undefined,ownerIds:[],source:"MANUAL" as const,updatedAt:new Date().toISOString()};setOrgs(xs=>[...xs,created]);setOrgId(id);setPanel("branding");setNotice("Organization workspace created locally. Add branding and people before publishing.");}
 function patchOrg(patch:Partial<OrganizationProfile>){setOrgs(xs=>xs.map(o=>o.id===org.id?{...o,...patch,updatedAt:new Date().toISOString()}:o));}
 function patchSection(index:number,patch:Partial<FormSection>){setSections(xs=>xs.map((s,i)=>i===index?{...s,...patch}:s));}
 function patchField(si:number,fi:number,patch:Partial<FormField>){setSections(xs=>xs.map((s,i)=>i!==si?s:{...s,fields:s.fields.map((f,j)=>j===fi?{...f,...patch}:f)}));}
 function removeField(si:number,fi:number){setSections(xs=>xs.map((s,i)=>i!==si?s:{...s,fields:s.fields.filter((_,j)=>j!==fi)}));}
 function startRecipe(recipeId:string){const recipe=[...templateRecipes,...additionalAssuranceRecipes].find(r=>r.id===recipeId);if(!recipe)return;setEditing(null);setTitle(recipe.title);setCategory(recipe.category);setDocumentType("GENERAL");setJobId("");setDescription(recipe.description);setSections(structuredClone(recipe.sections));setPanel("create");setBuilderPage("fields");setFieldFocus("");setNotice(recipe.title+" loaded into the designer. Customize fields, add your logo and publish.");}
 function load(template:CustomTemplate){
  setEditing(template.id);setTitle(template.title);setDescription(template.description);setCategory(template.category);
  setDocumentType(template.documentType);setJobId(template.jobId??"");setOrgId(template.organizationId);
  setSections(structuredClone(template.sections) as FormSection[]);setPanel("create");setBuilderPage("fields");setFieldFocus("");setNotice("Template loaded. Edit and publish a new version without changing its past submissions.");
 }
 function reset(){setEditing(null);setTitle("");setDescription("");setCategory("Inspections");setDocumentType("GENERAL");setJobId("");setSections([newSection()]);setNotice("");setPanel("create");setBuilderPage("properties");setFieldFocus("");}
 function save(publish:boolean){
  try{
    if(publish&&unreviewedPaperFields(sections).length)throw Error("Review imported source controls in Paper → Digital before publishing.");
    if(publish&&sections.some(section=>section.fields.some(field=>!!field.source))){
      const issues=paperPublicationIssues(sections);
      if(issues.length)throw Error("Resolve imported field choices and source labels: "+issues.slice(0,3).join("; "));
    }
    const now=new Date().toISOString();
    const v=makeCustomTemplate({id:current?.id??"custom-"+crypto.randomUUID(),organization:org,
     title,category,description,sections,documentType,jobId:jobId||undefined,now,status:publish?"PUBLISHED":"DRAFT",
     version:current?(publish?current.version+1:current.version):1});
    const saved={...v,createdAt:current?.createdAt??v.createdAt};
    setTemplates(xs=>[saved,...xs.filter(t=>t.id!==saved.id)]);
    setEditing(saved.id);
    setNotice(publish?"Published live custom form version "+saved.version+". Available in the form library.":"Form draft saved locally.");
    if(publish)onPublish?.(saved.id);
  }catch(error){setNotice(error instanceof Error?error.message:"Invalid form setup");}
 }
 async function addLogo(file:File|undefined){
  if(!file)return;
  if(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>250000){setNotice("Use PNG/JPEG/WebP logo under 250 KB for safe local preview storage.");return;}
  const reader=new FileReader();
  reader.onload=()=>{if(typeof reader.result==="string")patchOrg({logoDataUrl:reader.result,logoName:file.name});};
  reader.onerror=()=>setNotice("Could not read logo");
  reader.readAsDataURL(file);
 }
 function addPerson(){
  if(!name.trim()||!jobTitle.trim()){setNotice("Name and job title are required");return;}
  setPeople(xs=>[...xs,{id:"local-"+crypto.randomUUID(),source:"MANUAL",orgId:org.id,displayName:name.trim(),jobTitle:jobTitle.trim(),department:dept.trim(),location:"",email:email.trim(),active:true}]);
  setName("");setDept("");setEmail("");setJobTitle("");setNotice("Demo employee added to local organization directory.");
 }
 return <section aria-label="Custom forms designer" style={{display:"grid",gap:13}}>
  <div style={{...card,background:"#101d33",color:"#fff",border:0}}>
   <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
    <div><p style={{color:"#9ac4ff",fontSize:11,fontWeight:900,letterSpacing:1.2,margin:0}}>FORM DESIGN STUDIO</p><h2 style={{fontSize:20,margin:"6px 0"}}>Company form designer</h2></div>
    <span style={{alignSelf:"start",padding:"7px 11px",borderRadius:999,border:"1px solid #536985",fontSize:11,color:"#dbeafe"}}>FRONTEND ONLY</span>
   </div>
  </div>
  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
   {([{key:"create",text:"Form builder",icon:FilePlus2},{key:"branding",text:"Company branding",icon:Palette},{key:"people",text:"Organization people",icon:UsersRound},{key:"dictionary",text:"Data dictionary",icon:BookOpen}] as const).map(item=><button key={item.key} style={{...btn,background:panel===item.key?"#173764":"#fff",color:panel===item.key?"white":"#344054",display:"inline-flex",alignItems:"center",gap:7}} onClick={()=>setPanel(item.key)}><item.icon size={15}/>{item.text}</button>)}
  </div>
  {notice?<div role="status" style={{...card,background:"#eff6ff",fontSize:12,color:"#1e40af"}}>{notice}</div>:null}
  {panel==="branding"?<div style={{...card,display:"grid",gap:14}}>
   <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap"}}><h3 style={{margin:0}}>Organization onboarding / branding</h3><button style={blue} onClick={addOrganization}><Plus size={15} style={{display:"inline"}}/> Add another company</button></div>
   <label style={label}>Current company<select style={input} value={org.id} onChange={e=>setOrgId(e.target.value)}>{orgs.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,200px),1fr))",gap:12}}>
    <label style={label}>Company name<input style={input} value={org.name} onChange={e=>patchOrg({name:e.target.value})}/></label>
    <label style={label}>Organization domain<input style={input} value={org.domain} onChange={e=>patchOrg({domain:e.target.value})} placeholder="company.co.bw"/></label>
    <label style={label}>Business unit<input style={input} value={org.businessUnit} onChange={e=>patchOrg({businessUnit:e.target.value})}/></label>
    <label style={label}>Document prefix<input style={input} value={org.documentPrefix} onChange={e=>patchOrg({documentPrefix:e.target.value})}/></label>
    <label style={label}>Theme / accent<input aria-label="Accent color" type="color" value={org.accent} onChange={e=>patchOrg({accent:e.target.value})} style={{...input,padding:5,height:43}}/></label>
    <label style={label}>Company logo (PNG/JPEG/WebP)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>void addLogo(e.target.files?.[0])}/></label>
   </div>
   <label style={label}>Document footer / disclaimer<input style={input} value={org.footer} onChange={e=>patchOrg({footer:e.target.value})}/></label>
   <div style={{border:"1px solid #e2e8f0",borderTop:"5px solid "+org.accent,borderRadius:12,padding:18,display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
    {org.logoDataUrl?<img src={org.logoDataUrl} alt={org.name+" logo preview"} style={{maxWidth:100,maxHeight:66,objectFit:"contain"}}/>:<div style={{width:68,height:58,background:"#e2e8f0",display:"grid",placeItems:"center",borderRadius:9,fontWeight:900,color:"#475569"}}>LOGO</div>}
    <div><strong style={{display:"block",fontSize:17}}>{org.name}</strong><span style={{color:"#64748b",fontSize:12}}>{org.documentPrefix} · {org.businessUnit} · Demo controlled form</span></div>
    {org.logoDataUrl?<button style={{...btn,marginLeft:"auto"}} onClick={()=>patchOrg({logoDataUrl:undefined,logoName:undefined})}>Remove logo</button>:null}
   </div>
   <p style={{fontSize:11,color:"#667085",margin:0}}>Company branding is snapshotted at publication; updating a logo later does not silently rewrite older published forms. Logos stored locally as small image data.</p>
  </div>:null}
  {panel==="people"?<div style={{display:"grid",gap:12}}>
    <div style={card}><h3 style={{marginTop:0}}>Company directory — demo data</h3><p style={{fontSize:12,color:"#667085",lineHeight:1.6}}>Directory is ready to map Microsoft Graph users and organization-owner records later. No Microsoft login or directory API is called in this frontend demonstration.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,145px),1fr))",gap:9}}>
       <label style={label}>Employee name<input style={input} value={name} onChange={e=>setName(e.target.value)} placeholder="Employee full name"/></label>
       <label style={label}>Job title<input style={input} value={jobTitle} onChange={e=>setJobTitle(e.target.value)} placeholder="Rigger"/></label>
       <label style={label}>Department<input style={input} value={dept} onChange={e=>setDept(e.target.value)}/></label>
       <label style={label}>Email<input style={input} value={email} onChange={e=>setEmail(e.target.value)}/></label>
      </div><button style={{...blue,marginTop:12}} onClick={addPerson}><Plus size={15} style={{display:"inline"}}/> Add company person</button>
    </div>
    <div style={card}><strong>{people.filter(p=>p.orgId===org.id).length} members in {org.name}</strong>
      <p style={{fontSize:12,color:"#667085"}}>Set organization owners separately from job supervisors. Future Microsoft 365 organization administrators can be mapped to these profiles after tenant authorization; none are fetched now.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,240px),1fr))",gap:9,marginTop:14}}>
       {people.filter(p=>p.orgId===org.id).map(p=><div key={p.id} style={{padding:12,borderRadius:11,background:"#f8fafc",display:"flex",gap:9,justifyContent:"space-between"}}>
         <div><strong style={{fontSize:12}}>{p.displayName}</strong><p style={{fontSize:11,color:"#667085",margin:"4px 0"}}>{p.jobTitle} · {p.department}</p><span style={{fontSize:10,color:"#2563eb"}}>{p.source.replaceAll("_"," ")}</span></div>
         <label style={{fontSize:11,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:4}}><input type="checkbox" checked={org.ownerIds.includes(p.id)} onChange={e=>patchOrg({ownerIds:e.target.checked?[...new Set([...org.ownerIds,p.id])]:org.ownerIds.filter(id=>id!==p.id)})}/> Org owner</label>
         <button style={{...btn,padding:7,minHeight:31}} aria-label={"Remove "+p.displayName} onClick={()=>setPeople(xs=>xs.filter(item=>item.id!==p.id))}><Trash2 size={14}/></button>
       </div>)}
      </div>
    </div>
  </div>:null}
  {panel==="dictionary"?<div style={{...card,display:"grid",gap:16}}>
   <div><h3 style={{margin:"0 0 6px"}}>Reusable data dictionary</h3><p style={{fontSize:12,color:"#64748b",margin:0}}>Standard options help staff build consistent inspections without manually typing every answer.</p></div>
   {[
    {name:"Question types",items:dictionary.inputTypes.map(t=>t.label+" — "+t.purpose)},
    {name:"Job types",items:[...dictionary.jobTypes]},
    {name:"Hazards",items:[...dictionary.hazardCategories]},
    {name:"Hierarchy of controls",items:[...dictionary.hierarchyOfControls]},
    {name:"PPE and equipment",items:[...dictionary.ppe]},
    {name:"Participant job roles",items:[...dictionary.jobRoles]},
    {name:"Organization source",items:["Local sample directory","Manual additions","Future Microsoft Graph /users","Future Microsoft Graph /organization"]}
   ].map(group=><div key={group.name}><strong style={{fontSize:13}}>{group.name}</strong><div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>{group.items.map(item=><span key={item} style={{fontSize:11,border:"1px solid #d9e2ec",padding:"7px 10px",borderRadius:9,background:"#f8fafc"}}>{item}</span>)}</div></div>)}
  </div>:null}
  {panel==="create"?<div style={{display:"grid",gap:12}}>
   <nav className="movetrack-step-nav" aria-label="Designer views">{([['library','Templates'],['properties','Properties'],['fields','Questions'],['publish','Preview & publish']] as const).map(([key,name])=><button type="button" key={key} aria-current={builderPage===key?"step":undefined} onClick={()=>setBuilderPage(key)}>{name}</button>)}</nav>
   <div hidden={builderPage!=="library"} style={card}>
    <div><h3 style={{margin:"0 0 4px"}}>Start from a real operations workflow</h3><p style={{fontSize:12,color:"#64748b",margin:0}}>Select a professionally structured form recipe. You can customize every field to match a job or industry.</p></div>
    <label style={{display:"grid",gap:6,fontSize:12,fontWeight:800,marginTop:12}}>Search 29 editable workflow recipes
       <input style={input} placeholder="Working at heights, scaffold, emergency..." value={recipeFilter} onChange={e=>{setRecipeFilter(e.target.value);setRecipePage(0);}}/>
    </label>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,170px),1fr))",gap:9,marginTop:12}}>
     {recipes.slice(safeRecipePage*recipeSize,(safeRecipePage+1)*recipeSize).map(r=><button key={r.id} style={{...btn,textAlign:"left",display:"grid",gap:6,minHeight:90}} onClick={()=>startRecipe(r.id)}>
      <span style={{fontSize:10,color:"#2563eb",fontWeight:900}}>{r.category.toUpperCase()}</span>
      <strong style={{fontSize:12}}>{r.title}</strong><span style={{fontSize:10,color:"#64748b"}}>{r.sections.reduce((n,s)=>n+s.fields.length,0)} initial questions</span>
     </button>)}
    </div>
   </div>
   <div hidden={builderPage!=="library"} className="movetrack-step-footer"><button disabled={safeRecipePage===0} onClick={()=>setRecipePage(safeRecipePage-1)}>Previous recipes</button><span>{safeRecipePage+1} / {recipePages}</span><button disabled={safeRecipePage>=recipePages-1} onClick={()=>setRecipePage(safeRecipePage+1)}>Next recipes</button></div>
   <div hidden={builderPage!=="properties"} style={card}>
    <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap"}}><h3 style={{margin:0}}>Template properties</h3><button onClick={reset} style={btn}>New blank form</button></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,190px),1fr))",gap:10,marginTop:13}}>
     <label style={label}>Form name<input style={input} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Confined space permit"/></label>
     <label style={label}>Category<select style={input} value={category} onChange={e=>setCategory(e.target.value as FormCategory)}>{dictionary.categories.map(c=><option key={c}>{c}</option>)}</select></label>
     <label style={label}>Template kind<select style={input} value={documentType} onChange={e=>setDocumentType(e.target.value as "GENERAL"|"JRA")}><option value="GENERAL">General checklist / form</option><option value="JRA">JRA supporting form</option></select></label>
     <label style={label}>Job reference (optional)<input style={input} value={jobId} onChange={e=>setJobId(e.target.value)} placeholder="WO-2026-001"/></label>
     <label style={label}>Organization<select style={input} value={org.id} onChange={e=>setOrgId(e.target.value)}>{orgs.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></label>
     <label style={label}>Details<input style={input} value={description} onChange={e=>setDescription(e.target.value)} placeholder="When and who uses this form"/></label>
    </div>
   </div>
   {builderPage==="fields"?<TaskWorkspace title="Form designer" steps={fieldIndex.map(item=>item.section.title+" · "+item.field.label)} current={focusedIndex} onChange={index=>setFieldFocus(fieldIndex[index]?.field.id??"")}
    summary={<><strong>{title||"Untitled form"}</strong><p>{sections.length} sections · {fieldIndex.length} questions</p><p>Editing one question at a time. Changes autosave locally.</p><button style={btn} onClick={()=>setBuilderPage("properties")}>Template properties</button><button style={btn} onClick={()=>setBuilderPage("publish")}>Review & publish</button></>}>
   {sections.map((section,si)=>selectedField?.si===si?<motion.section initial={reduced?false:{opacity:0,y:5}} animate={{opacity:1,y:0}} key={section.id} style={card}>
     <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
      <span style={{fontSize:11,color:"#2563eb",fontWeight:900}}>SECTION {si+1}</span>
      <input aria-label={"Section "+(si+1)+" title"} style={{...input,flex:"1 1 250px"}} value={section.title} onChange={e=>patchSection(si,{title:e.target.value})}/>
      <button aria-label="Move section up" disabled={si===0} onClick={()=>setSections(xs=>swap(xs,si,si-1))} style={{...btn,padding:7}}><ChevronUp size={16}/></button>
      <button aria-label="Move section down" disabled={si===sections.length-1} onClick={()=>setSections(xs=>swap(xs,si,si+1))} style={{...btn,padding:7}}><ChevronDown size={16}/></button>
      <button aria-label="Remove section" disabled={sections.length===1} onClick={()=>setSections(xs=>xs.filter((_,i)=>i!==si))} style={{...btn,padding:7,color:"#b42318"}}><Trash2 size={16}/></button>
     </div>
     <div style={{display:"grid",gap:9,marginTop:12}}>
      {section.fields.map((f,fi)=>selectedField?.field.id===f.id?<div key={f.id} style={{padding:13,border:"1px solid #e2e8f0",borderRadius:12,background:"#f8fafc",display:"grid",gap:10}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap"}}>
         <strong style={{fontSize:11,color:"#475569"}}>QUESTION {fi+1}</strong>
         <div style={{display:"flex",gap:5}}>
          <button style={{...btn,padding:6,minHeight:33}} onClick={()=>patchSection(si,{fields:swap(section.fields,fi,fi-1)})} disabled={fi===0} aria-label="Move question up"><ChevronUp size={15}/></button>
          <button style={{...btn,padding:6,minHeight:33}} onClick={()=>patchSection(si,{fields:swap(section.fields,fi,fi+1)})} disabled={fi===section.fields.length-1} aria-label="Move question down"><ChevronDown size={15}/></button>
          <button style={{...btn,padding:6,minHeight:33}} onClick={()=>patchSection(si,{fields:[...section.fields.slice(0,fi+1),{...f,id:"field-"+crypto.randomUUID().slice(0,8)},...section.fields.slice(fi+1)]})} aria-label="Duplicate question"><Copy size={15}/></button>
          <button style={{...btn,padding:6,minHeight:33,color:"#b42318"}} onClick={()=>removeField(si,fi)} aria-label="Remove question"><Trash2 size={15}/></button>
         </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,165px),1fr))",gap:10}}>
         <label style={label}>Question label<input style={input} value={f.label} onChange={e=>patchField(si,fi,{label:e.target.value})}/></label>
         <label style={label}>Answer type<select style={input} value={f.type} onChange={e=>{
           const type=e.target.value as AnswerType;
           patchField(si,fi,{type,options:type==="select"||type==="multiselect"||type==="radio"?["Yes","No","Not sure"]:undefined,children:type==="repeat"?[{id:"name",label:"Name",type:"text",required:true}]:undefined});
         }}>{dictionary.inputTypes.map(type=><option key={type.id} value={type.id}>{type.label}</option>)}</select></label>
        </div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap",fontSize:12}}>
         <label><input type="checkbox" checked={!!f.required} onChange={e=>patchField(si,fi,{required:e.target.checked})}/> Required</label>
         <label><input type="checkbox" checked={!!f.critical} onChange={e=>patchField(si,fi,{critical:e.target.checked})}/> Critical / NO-GO</label>
         <label title="Reserved for future evidence upload integration"><input type="checkbox" disabled checked={false}/> Evidence on fail (cloud phase)</label>
        </div>
        {(f.type==="select"||f.type==="multiselect"||f.type==="radio")?<label style={label}>Options (one per line)<textarea style={{...input,minHeight:83}} value={(f.options??[]).join("\n")} onChange={e=>patchField(si,fi,{options:e.target.value.split("\n").map(s=>s.trim()).filter(Boolean)})}/></label>:null}
        {f.type==="repeat"?<div style={{display:"grid",gap:7}}>
          <strong style={{fontSize:12}}>Repeatable row columns</strong>
          {(f.children??[]).map((child,ci)=><div key={child.id} style={{display:"flex",gap:7}}>
           <input style={{...input,flex:1}} value={child.label} onChange={e=>patchField(si,fi,{children:f.children?.map((c,i)=>i===ci?{...c,label:e.target.value}:c)})}/>
           <select aria-label={"Column type for "+child.label} style={{...input,width:110}} value={child.type} onChange={e=>patchField(si,fi,{children:f.children?.map((c,i)=>i===ci?{...c,type:e.target.value as AnswerType,options:e.target.value==="select"?["Choice A","Choice B"]:undefined}:c)})}><option value="text">Text</option><option value="number">Number</option><option value="date">Date</option><option value="select">Choice</option><option value="yes_no">Yes / No</option><option value="pass_fail_na">PASS / FAIL / N/A</option><option value="checkbox">Checkbox</option></select>
           {child.type==="select"?<input aria-label={"Choices for "+child.label} style={{...input,flex:1}} value={(child.options??[]).join(" | ")} onChange={e=>patchField(si,fi,{children:f.children?.map((c,i)=>i===ci?{...c,options:e.target.value.split("|").map(v=>v.trim()).filter(Boolean)}:c)})}/>:null}
           <label style={{fontSize:10,display:"flex",alignItems:"center",gap:4}}><input type="checkbox" checked={!!child.required} onChange={e=>patchField(si,fi,{children:f.children?.map((c,i)=>i===ci?{...c,required:e.target.checked}:c)})}/> Required</label>
           <button style={{...btn,padding:7}} aria-label="Remove column" onClick={()=>patchField(si,fi,{children:f.children?.filter((_,i)=>i!==ci)})}><Trash2 size={15}/></button>
          </div>)}
          <button style={{...btn,justifySelf:"start"}} onClick={()=>patchField(si,fi,{children:[...(f.children??[]),{id:"c-"+crypto.randomUUID().slice(0,5),label:"New column",type:"text",required:true}]})}>Add repeating column</button>
        </div>:null}
        <label style={label}>Help text<input style={input} placeholder="Instructions to the person completing this form" value={f.helperText??""} onChange={e=>patchField(si,fi,{helperText:e.target.value})}/></label>
       </div>:null)}
      <button onClick={()=>{const f=newField();patchSection(si,{fields:[...section.fields,f]});setFieldFocus(f.id);}} style={{...btn,justifySelf:"start",display:"inline-flex",alignItems:"center",gap:7}}><Plus size={15}/> Add question</button>
     </div>
   </motion.section>:null)}
   <button style={{...btn,justifySelf:"start",display:"inline-flex",gap:8,alignItems:"center"}} onClick={()=>{const sec=newSection();setSections(xs=>[...xs,sec]);setFieldFocus(sec.fields[0]?.id??"");}}><Layers size={16}/> Add section</button>
   <div className="movetrack-step-footer"><button disabled={focusedIndex===0} onClick={()=>setFieldFocus(fieldIndex[focusedIndex-1]?.field.id??"")}>Previous question</button><span>{focusedIndex+1} / {fieldIndex.length}</span><button disabled={focusedIndex>=fieldIndex.length-1} onClick={()=>setFieldFocus(fieldIndex[focusedIndex+1]?.field.id??"")}>Next question</button></div>
   {!selectedField?<button style={btn} onClick={()=>{const sec=newSection();setSections(xs=>[...xs,sec]);setFieldFocus(sec.fields[0]?.id??"");}}>Add first question section</button>:null}
   </TaskWorkspace>:null}
   <div hidden={builderPage!=="publish"} style={card}><h3>Template preview</h3><p>{title} · {category} · {org.name}</p><table className="movetrack-compact-table"><thead><tr><th>Section</th><th>Questions</th></tr></thead><tbody>{sections.map(sec=><tr key={sec.id}><td>{sec.title}</td><td>{sec.fields.length}</td></tr>)}</tbody></table><p>Download the blank design to review every question before publishing.</p></div>
   <div hidden={builderPage!=="publish"} style={{...card,display:"flex",gap:9,flexWrap:"wrap",justifyContent:"space-between",alignItems:"center"}}>
    <div><strong>{sections.reduce((n,s)=>n+s.fields.length,0)} questions · {sections.length} sections</strong><p style={{fontSize:11,color:"#64748b",margin:"3px 0"}}>Changes to this designer autosave locally as you type. Publishing updates the active custom version; completed submissions preserve historical snapshots.</p></div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
     <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{fontSize:11,color:"#64748b",fontWeight:800}}>Download this unpublished design (blank)</span>
      <DocumentDownloadActions document={buildFormDocument({template:previewTemplate,mode:"blank",company:org,people})} compact/>
     </div>
     <button style={btn} onClick={()=>save(false)}><Save size={15} style={{display:"inline"}}/> Save draft</button>
     <button style={blue} onClick={()=>save(true)}><CheckCircle2 size={15} style={{display:"inline"}}/> Publish live form</button>
    </div>
   </div>
   {templates.length?<div hidden={builderPage!=="library"} style={card}><h3 style={{marginTop:0}}>Custom template library</h3>
    <div style={{display:"grid",gap:8}}>{templates.map(t=><div key={t.id} style={{display:"flex",gap:12,justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",padding:10,border:"1px solid #e2e8f0",borderRadius:10}}>
      <div><strong style={{fontSize:13}}>{t.title}</strong><p style={{fontSize:11,color:"#64748b",margin:"4px 0"}}>{t.companyNameSnapshot} · {t.category} · v{t.version} · {t.status}</p></div>
      <div style={{display:"flex",gap:6}}><button style={btn} onClick={()=>load(t)}>Edit</button><button style={btn} onClick={()=>{if(window.confirm("Remove this custom template? Historical submissions remain saved."))setTemplates(xs=>xs.filter(x=>x.id!==t.id));}}>Delete</button></div>
    </div>)}</div>
   </div>:null}
  </div>:null}
 </section>;
}
