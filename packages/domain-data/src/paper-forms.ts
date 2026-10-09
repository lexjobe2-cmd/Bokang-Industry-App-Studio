import type {FormCategory,FormField,FormSection} from "./assurance-forms.ts";
import type {DetectedElement,LayoutProposal} from "./paper-layout.ts";
export type PaperDocumentKind="Checklist"|"Meeting register"|"Toolbox briefing"|"JSA / JRA"|"Inspection"|"Other";
export type PaperExtraction={sourceName:string;pages:number;rawText:string;confidence:number|null;kind:PaperDocumentKind;title:string;sections:FormSection[];warnings:string[];elements?:DetectedElement[];summary?:LayoutProposal["summary"];};
const meaningful=(s:string)=>s.replace(/[\t\r]+/g," ").replace(/\s+/g," ").trim();
const label=(s:string)=>meaningful(s.replace(/^[\s0-9]+[.):-]\s*/,"").replace(/^[\[\]☐☑□■•*✓]+\s*/g,"").replace(/[\s._:：-]+$/g,""));
function fieldType(s:string):FormField["type"]{
 if(/\b(attendees|participants|crew members|staff attending|apologies|absent staff|people present)\b/i.test(s))return "people";
 if(/\b(chairperson|facilitator|meeting chair|site supervisor|independent reviewer|responsible employee|approved by|action owner)\b/i.test(s))return "person";
 if(/\b(signature|signatory|signed by|sign.off|acknowledgement signature)\b/i.test(s))return "signature";
 if(/\b(pass\s*[/|-]\s*fail|fail\s*[/|-]\s*pass|good\s*[/|-]\s*bad|p\s*[/|]\s*f\s*[/|]\s*na)\b/i.test(s))return "pass_fail_na";
 if(/\b(yes\s*[/|-]\s*no|y\s*[/|]\s*n)\b/i.test(s))return "yes_no";
 if(/\b(risk\s*(score|rating)|likelihood\s*[×x*]\s*consequence|severity\s*[×x*]\s*likelihood)\b/i.test(s))return "risk";
 if(/\b(date|expiry|expires|valid until|inspection on)\b/i.test(s)&&!/(update|validation)/i.test(s))return "date";
 if(/\b(time|shift start|arrived at)\b/i.test(s)&&!/\b(time\s*period)/i.test(s))return "text";
 if(/\b(quantity|hours|reading|mileage|odometer|volume|number of|total people)\b/i.test(s))return "number";
 if(/\b(remarks|notes|description|summary|details|agenda|minutes|hazards|control measures|actions|observations)\b/i.test(s))return "multiline";
 return "text";
}
export function detectPaperKind(text:string):PaperDocumentKind{
 if(/\b(meeting|attendance|minutes|register of attendees|chairperson|apologies|quorum)\b/i.test(text))return "Meeting register";
 if(/\b(toolbox|pre.shift briefing|prestart briefing|safety talk)\b/i.test(text))return "Toolbox briefing";
 if(/\b(jsa|jra|job safety analysis|job risk assessment|hazard assessment)\b/i.test(text))return "JSA / JRA";
 if(/\b(pre.start|prestart|inspection|walkaround|vehicle check|equipment check)\b/i.test(text))return "Inspection";
 if(/\b(checklist|tick if|pass.fail|pass\/fail)\b/i.test(text))return "Checklist";
 return "Other";
}
export function detectPaperCategory(kind:PaperDocumentKind):FormCategory{
 return kind==="Meeting register"?"Meetings":kind==="JSA / JRA"?"Risk":kind==="Inspection"?"Inspections":"Safety";
}
export function parsePaperText(sourceName:string,rawText:string,confidence:number|null=null,pages=1):PaperExtraction{
 const text=rawText.replace(/\r/g,"").trim();
 const rawLines=text.split("\n").map(meaningful).filter(Boolean);
 const kind=detectPaperKind(rawLines.slice(0,35).join(" "));
 const warnings:string[]=[];
 if(rawLines.length<4)warnings.push("Very little text was recognized. Review the scan or enter sections and fields manually.");
 if(confidence!==null&&confidence<65)warnings.push("OCR confidence is low. Check names, dates, safety-critical controls and numeric values against the source.");
 if(rawLines.length>250)warnings.push("Long document: the first 250 lines are proposed. Split very large registers into multiple templates.");
 const titleCandidate=rawLines.find(l=>l.length>=6&&l.length<=110&&!/^page\s*\d|^date\s*[:_]/i.test(l));
 const title=label(titleCandidate??sourceName.replace(/\.[^.]+$/,""))||"Imported company checklist";
 const sections:FormSection[]=[];
 const used=new Set<string>();
 const addSection=(name:string)=>{
  if(sections.length>=14)return;
  sections.push({id:"import-section-"+sections.length,title:name.slice(0,110),fields:[]});
 };
 addSection("Document details & questions");
 let count=0;
 for(const line of rawLines.slice(1,251)){
  if(line===titleCandidate)continue;
  if(/^\s*(?:page\s+\d+(?:\s+of\s+\d+)?|copyright\b|confidential\b)\s*$/i.test(line))continue;
  const header=/^[A-Z\d /&(),-]{5,66}$/.test(line) && /[A-Z]{4}/.test(line) && !/\b(PASS|FAIL|YES|NO|N\/A)\b/.test(line);
  if(header&&line.length<60&&sections[sections.length-1]!.fields.length&&sections.length<14){addSection(label(line));continue;}
  if(line.length<4||line.length>230)continue;
  const content=label(line);
  if(content.length<4||/^[._\-=\s]+$/.test(content)||used.has(content.toLowerCase()))continue;
  const question=/[:?]|_{3,}|\\.{3,}/.test(line)||/\b(check|verify|confirm|inspect|condition|status|provided|required|name|date|time|location|shift|signature|reading|reference|registration|contact|department|action|owner|attend(?:ance|ee|ees)?|topic|chair(?:person)?|facilitator|minutes?|agenda|present|absent|safe|working|defect)\b/i.test(line)||/^[\s\[\]☐☑□■•]/.test(line)||/\b(PASS|FAIL|YES|NO|N\/A)\b/i.test(line);
  if(!question){if(header&&sections.length<14){addSection(content);}continue;}
  used.add(content.toLowerCase());
  const type=fieldType(line);
  const id="ocr-"+String(++count).padStart(3,"0");
  (sections[sections.length-1]!.fields as FormField[]).push({id,label:content.slice(0,160),type,required:false,
   helperText:"OCR-derived field. Confirm label and response type before publishing."});
  if(count>=100){warnings.push("Only the first 100 proposed fields were included; check the source for missing items.");break;}
 }
 const cleaned=sections.filter(s=>s.fields.length>0).map((s,i)=>({...s,id:"ocr-section-"+(i+1),fields:[...s.fields]}));
 if(!cleaned.length){
  warnings.push("No reliable questions were detected; the editable template starts with one placeholder.");
  cleaned.push({id:"ocr-section-1",title:"Original paper fields",fields:[{id:"ocr-001",label:"Review and replace with first question",type:"text",required:false}]});
 }
 warnings.push("OCR cannot guarantee layout fidelity or safety accuracy. Recreate the source's headings, tables and approvals in the editor before use.");
 return {sourceName,pages,rawText:text,confidence,kind,title,sections:cleaned,warnings};
}
export function validatePaperSections(sections:FormSection[]){
 if(!sections.length||sections.every(s=>!s.fields.length))throw Error("Add at least one section and question.");
 const ids=new Set<string>();
 for(const section of sections){
  if(!section.title.trim()||!section.fields.length)throw Error("Every section must have a title and at least one question.");
  for(const field of section.fields){
   if(!field.id.trim()||!field.label.trim()||ids.has(field.id))throw Error("Each question needs a unique ID and a label.");
   ids.add(field.id);
  }
 }
 return true;
}

/** A graphical suggestion is not an authorized form question until explicitly source-reviewed. */
export function unreviewedPaperFields(sections:readonly FormSection[]){
 return sections.flatMap(s=>s.fields).filter(f=>f.source && f.source.reviewed!==true);
}

/** A scanned source can suggest a form, but ambiguous answer choices must be
 * resolved before publishing. A single confirmation cannot make generic
 * "Option 1" OCR choices meaningful for operational use.
 */
export function paperPublicationIssues(sections:readonly FormSection[]):string[]{
 const issues:string[]=[];
 for(const section of sections){
  for(const field of section.fields){
   if(field.source&&field.source.reviewed!==true)issues.push(field.label+": compare detected UI with the original source");
   if(["radio","multiselect","select"].includes(field.type)){
    const values=(field.options??[]).map(v=>v.trim()).filter(Boolean);
    if(values.length<2)issues.push(field.label+": add at least two real choices");
    if(values.some(v=>/^option\s*\d+$/i.test(v)))issues.push(field.label+": replace placeholder choices with the words printed on the source");
    if(new Set(values.map(v=>v.toLowerCase())).size!==values.length)issues.push(field.label+": remove duplicate choices");
   }
   if(field.type==="repeat"){
    if(!(field.children?.length))issues.push(field.label+": review the columns in the detected register");
    if(field.children?.some(c=>!c.label.trim()||/^new column$/i.test(c.label)))issues.push(field.label+": name all table columns");
   }
   if(/^(review and replace|new question|unlabeled pdf input)/i.test(field.label.trim()))issues.push(field.label+": enter the source question label");
  }
 }
 return [...new Set(issues)];
}
