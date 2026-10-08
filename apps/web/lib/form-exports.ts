import type {FormAnswer,FormAnswers,FormField,FormTemplate,FormSubmission} from "@bokang/domain-data/assurance-forms";
import type {JobRiskAssessment,OrganizationProfile,PersonRecord} from "@bokang/domain-data/custom-assurance";
import {scoreRisk,defaultRiskMatrix,type RiskAnswer} from "@bokang/domain-data/risk-matrix";

export type DocumentMode="blank"|"draft"|"filled";
export type DocumentFormat="pdf"|"docx"|"csv"|"json";
export type DocumentRow={label:string;value:string};
export type DocumentSection={title:string;rows:DocumentRow[]};
export type ExportDocument={
 title:string;company:string;reference:string;mode:DocumentMode;status:string;timestamp:string;
 disclaimer:string;sections:DocumentSection[];logoDataUrl?:string;accent?:string;
};
const placeholder="________________________________";
function textValue(value:unknown,people:readonly PersonRecord[],field?:FormField):string{
 if(value===undefined||value===null||value==="")return "";
 if(typeof value==="boolean")return value?"Yes":"No";
 if(typeof value==="number")return String(value);
 if(typeof value==="string")return field?.type==="person"?(people.find(p=>p.id===value)?.displayName??value):value;
 if(Array.isArray(value))return value.map(x=>people.find(p=>p.id===x)?.displayName??String(x)).join("; ");
 if(typeof value==="object"&&"likelihood" in value&&"consequence" in value){
  try{const v=scoreRisk(defaultRiskMatrix,value as RiskAnswer);return v.score+"/25 · "+v.level;}catch{return "Risk not assessed";}
 }
 if(typeof value==="object")return Object.entries(value).map(([key,v])=>key+": "+textValue(v,people)).join("; ");
 return String(value);
}
function fieldRows(field:FormField,answer:FormAnswer|undefined,mode:DocumentMode,people:readonly PersonRecord[]):DocumentRow[]{
 if(field.type!=="repeat"){
  return [{label:field.label+(field.required?" *":""),value:mode==="blank"?placeholder:textValue(answer,people,field)||(mode==="filled"?"—":placeholder)}];
 }
 const rows:DocumentRow[]=[];
 if(mode!=="blank"&&Array.isArray(answer)){
  answer.forEach((entry,i)=>{
   if(!entry||typeof entry!=="object"||Array.isArray(entry))return;
   const data=entry as Record<string,unknown>;
   rows.push({label:field.label+" — row "+(i+1),value:""});
   for(const child of field.children??[])rows.push({label:"   "+child.label,value:textValue(data[child.id],people,child)||placeholder});
  });
 }
 if(!rows.length){
  rows.push({label:field.label,value:mode==="blank"?"Blank register":mode==="filled"?"No rows recorded":"Draft register"});
  for(const child of field.children??[])rows.push({label:"   "+child.label,value:placeholder});
 }
 return rows;
}
export function buildFormDocument(args:{template:FormTemplate;mode:DocumentMode;answers?:FormAnswers;submission?:FormSubmission;company?:OrganizationProfile;people?:readonly PersonRecord[];jobId?:string;site?:string}):ExportDocument{
 const t=args.submission?.templateSnapshot??args.template;
 const answers=args.mode==="blank"?{}:args.submission?.answers??args.answers??{};
 const companyName=(t as FormTemplate&{companyNameSnapshot?:string}).companyNameSnapshot??args.company?.name??"MoveTrack";
 const reference=(t as FormTemplate&{referencePrefix?:string}).referencePrefix??args.company?.documentPrefix??"SHE";
 const people=args.people??[];
 return {
  title:t.title,company:companyName,reference:reference+" · "+t.id+" · v"+t.version,
  mode:args.mode,status:args.submission?.decision??(args.mode==="blank"?"UNCOMPLETED TEMPLATE":"DRAFT · NOT SUBMITTED"),
  timestamp:args.submission?.submittedAt??new Date().toISOString(),
  disclaimer:"LOCAL DEMO DOCUMENT — NOT A PERMIT, VERIFIED SIGNATURE OR AUTHORIZATION TO WORK. Blank/draft records do not prove compliance.",
  logoDataUrl:(t as FormTemplate&{logoSnapshot?:string}).logoSnapshot??args.company?.logoDataUrl,
  accent:(t as FormTemplate&{accent?:string}).accent??args.company?.accent,
  sections:[
   {title:"Document information",rows:[
    {label:"Organization",value:companyName},
    {label:"Document / template",value:t.id+" · Version "+t.version},
    {label:"Work order",value:args.submission?.taskId??args.jobId??placeholder},
    {label:"Site",value:args.submission?.siteId??args.site??placeholder},
    {label:"Status",value:args.submission?.decision??(args.mode==="blank"?"BLANK TEMPLATE":"UNSUBMITTED DRAFT")},
    {label:"Record timestamp",value:args.submission?.submittedAt??(args.mode==="blank"?"—":"Draft preview")}
   ]},
   ...t.sections.map(section=>({title:section.title,rows:section.fields.flatMap(f=>fieldRows(f,answers[f.id],args.mode,people))}))
  ]
 };
}
export function buildJraDocument(jra:JobRiskAssessment,people:readonly PersonRecord[]):ExportDocument{
 const person=(id?:string)=>id?people.find(p=>p.id===id)?.displayName??id:"—";
 const rows:DocumentSection[]=[
  {title:"Job and risk assessment",rows:[
   {label:"Assessment reference",value:jra.reference},{label:"Status",value:jra.status},
   {label:"Job / work order",value:jra.jobId},{label:"Job type",value:jra.jobType},
   {label:"Site",value:jra.siteId},{label:"Location",value:jra.location},
   {label:"Scheduled dates",value:jra.startDate+" to "+jra.endDate},
   {label:"Supervisor",value:person(jra.supervisorId)},{label:"Reviewer",value:person(jra.reviewerId)},
   {label:"Work scope",value:jra.scope},{label:"Method",value:jra.method},{label:"Emergency plan",value:jra.emergencyPlan},
   {label:"PPE",value:jra.ppe.join("; ")},{label:"Permits",value:jra.permits.join("; ")},
   {label:"Reviewer notes",value:jra.reviewerNote}
  ]},
  {title:"Team and participation",rows:jra.participants.map(p=>({label:person(p.personId),value:p.role+" · "+(p.acknowledged?"DEMO acknowledged":"Not acknowledged")}))}
 ];
 for(const [i,task] of jra.tasks.entries()){
  const stepRows:DocumentRow[]=[{label:"Job step",value:task.description},{label:"Equipment",value:task.equipment.join("; ")},{label:"Required permits",value:task.permitRequired.join("; ")}];
  for(const [hi,hazard] of task.hazards.entries()){
   stepRows.push({label:"Hazard "+(hi+1),value:hazard.hazard},{label:"Category",value:hazard.category},
    {label:"Consequence",value:hazard.consequence},{label:"Exposed people",value:hazard.exposedPersonIds.map(person).join("; ")},
    {label:"Initial risk",value:textValue(hazard.initial,people)},{label:"Residual risk",value:textValue(hazard.residual,people)});
   for(const [ci,control] of hazard.controls.entries())stepRows.push({label:"Control "+(ci+1)+" · "+control.hierarchy,value:control.description+" · owner "+person(control.ownerId)+" · "+(control.verified?"Verified in demo":"Unverified")});
  }
  rows.push({title:"Step "+(i+1)+" — Task hazards and controls",rows:stepRows});
 }
 return {title:jra.title||"Job Risk Assessment",company:jra.companyNameSnapshot,reference:jra.reference,mode:jra.status==="DRAFT"?"draft":"filled",
  status:jra.status,timestamp:jra.updatedAt,accent:"#173764",logoDataUrl:jra.logoSnapshot,
  disclaimer:"LOCAL DEMO JOB RISK ASSESSMENT — NOT AN APPROVED WORK PERMIT OR AUTHORIZATION. A demo review flag is not a verified signature.",sections:rows};
}
export function documentRows(doc:ExportDocument):string[][]{
 const rows=[["Organization",doc.company],["Title",doc.title],["Reference",doc.reference],["Mode",doc.mode],["Status",doc.status],["Notice",doc.disclaimer]];
 for(const section of doc.sections){
  rows.push(["SECTION",section.title]);
  for(const row of section.rows)rows.push([row.label,row.value]);
 }
 return rows;
}
export function exportCsv(doc:ExportDocument){
 return "\uFEFF"+documentRows(doc).map(row=>row.map(v=>'"'+v.replaceAll('"','""').replace(/^([=+@-])/,"'$1")+'"').join(",")).join("\r\n");
}
export function exportJson(doc:ExportDocument){return JSON.stringify({schema:"movetrack-document-v1",...doc},null,2);}
const safeFilename=(name:string)=>name.normalize("NFKD").replace(/[^a-zA-Z0-9-_ ]/g,"").replace(/\s+/g,"-").slice(0,65)||"form";
function downloadBlob(blob:Blob,filename:string){
 const url=URL.createObjectURL(blob);const link=document.createElement("a");
 link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();
 window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function downloadDocument(doc:ExportDocument,format:DocumentFormat){
 const filename=safeFilename(doc.title)+"-"+doc.mode+"-"+doc.timestamp.slice(0,10);
 if(format==="csv"){downloadBlob(new Blob([exportCsv(doc)],{type:"text/csv;charset=utf-8"}),filename+".csv");return;}
 if(format==="json"){downloadBlob(new Blob([exportJson(doc)],{type:"application/json"}),filename+".json");return;}
 if(format==="pdf"){
  const {jsPDF}=await import("jspdf");
  const pdf=new jsPDF({format:"a4",unit:"mm"});
  const width=210,margin=17,bottom=280;
  let y=21;
  const page=()=>{pdf.addPage();y=20;};
  const line=(str:string,fontSize=10,bold=false)=>{
   pdf.setFont("helvetica",bold?"bold":"normal");pdf.setFontSize(fontSize);
   const wrapped=pdf.splitTextToSize(str.replace(/[^\x20-\x7E\n]/g,"-"),width-2*margin) as string[];
   for(const piece of wrapped){if(y>bottom)page();pdf.text(piece,margin,y);y+=fontSize*0.47+1.9;}
  };
  pdf.setFillColor(17,47,87);pdf.rect(0,0,210,9,"F");
  line(doc.company,13,true);line(doc.title,18,true);
  line(doc.reference,10);line(doc.mode.toUpperCase()+" · "+doc.status,10,true);
  pdf.setTextColor(151,53,28);line(doc.disclaimer,9,true);pdf.setTextColor(28,43,64);
  y+=4;
  for(const section of doc.sections){
   if(y>263)page();
   pdf.setFillColor(232,240,251);pdf.rect(margin,y-5,176,9,"F");pdf.setTextColor(24,57,103);line(section.title,12,true);
   y+=2;pdf.setTextColor(28,43,64);
   for(const row of section.rows){
    line(row.label+":",9,true);line(row.value||"—",10);y+=1;
   }
   y+=3;
  }
  const pages=pdf.getNumberOfPages();
  for(let i=1;i<=pages;i++){pdf.setPage(i);pdf.setFontSize(8);pdf.setTextColor(100,116,139);pdf.text("MoveTrack · Local demo · Page "+i+" of "+pages,margin,290);}
  downloadBlob(pdf.output("blob"),filename+".pdf");
  return;
 }
 const {Document,Packer,Paragraph,TextRun,HeadingLevel}=await import("docx");
 const paragraphs=[
  new Paragraph({text:doc.company,heading:HeadingLevel.HEADING_2}),
  new Paragraph({text:doc.title,heading:HeadingLevel.TITLE}),
  new Paragraph({text:doc.reference+"  |  "+doc.mode.toUpperCase()+"  |  "+doc.status}),
  new Paragraph({children:[new TextRun({text:doc.disclaimer,bold:true,color:"A33A23"})]}),
  ...doc.sections.flatMap(section=>[
   new Paragraph({text:section.title,heading:HeadingLevel.HEADING_2}),
   ...section.rows.map(row=>new Paragraph({children:[new TextRun({text:row.label+": ",bold:true}),new TextRun({text:row.value||"—"})],spacing:{after:90}}))
  ])
 ];
 const word=new Document({creator:"MoveTrack AI · local demo",title:doc.title,description:doc.disclaimer,sections:[{children:paragraphs}]});
 const blob=await Packer.toBlob(word);
 downloadBlob(blob,filename+".docx");
}
