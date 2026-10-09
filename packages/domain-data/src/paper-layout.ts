import type {FormField,FormSection} from "./assurance-forms.ts";
import type {PaperExtraction} from "./paper-forms.ts";

/** Page-space coordinates refer to rendered source pixels, not the browser viewport. */
export type SourceRect={x:number;y:number;width:number;height:number};
export type PaperLine=SourceRect&{text:string;page:number;confidence?:number};
export type VisualMark=SourceRect&{kind:"checkbox"|"radio"|"underline";page:number;confidence:number};
export type PdfWidget=SourceRect&{page:number;kind:"checkbox"|"radio"|"text"|"select"|"signature";label:string;choices?:string[]};
export type DetectedElement={
 id:string;page:number;bounds:SourceRect;source:"visual"|"acroform"|"ocr-layout";
 label:string;type:FormField["type"];options?:string[];confidence:number;
};
export type LayoutProposal={elements:DetectedElement[];sections:FormSection[];summary:{checkbox:number;radio:number;text:number;signature:number;table:number;fields:number};warnings:string[]};

const clean=(text:string)=>text.replace(/[☐☑□✓◯○●•]/g," ").replace(/\[\s*[xX]?\s*\]/g," ").replace(/\b(?:PASS\s*\/\s*FAIL\s*\/\s*N\/?A|YES\s*\/\s*NO)\b/gi," ").replace(/[_\.]{3,}/g," ").replace(/\s+/g," ").replace(/^[\s:;|\-]+|[\s:;|\-]+$/g,"").trim();
const norm=(s:string)=>clean(s).toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const center=(r:SourceRect)=>r.y+r.height/2;
const overlap=(a:SourceRect,b:SourceRect)=>Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
const types=new Set<FormField["type"]>(["checkbox","radio","yes_no","pass_fail_na","multiselect","select","text","multiline","datetime","date","number","signature","repeat"]);
export function inferQuestionType(text:string,markKinds:readonly VisualMark["kind"][]=[]):{type:FormField["type"];options?:string[]} {
 const s=text.trim();
 if(/\b(pass\s*[/|\-]\s*fail|pass\s+fail|p\s*\/\s*f\s*\/\s*n\/?a)\b/i.test(s))return {type:"pass_fail_na"};
 if(/\b(yes\s*[/|\-]\s*no|yes\s+no|y\s*\/\s*n)\b/i.test(s))return {type:"yes_no"};
 if(/\b(signature|signed by|authorised signature|sign off|initials of approver)\b/i.test(s))return {type:"signature"};
 if(/\b(date|expires|expiry)\b/i.test(s)&&!/updated/i.test(s))return {type:"date"};
 if(/\b(quantity|volume|amount|odometer|measurement|reading|height\s*\(m\)|weight\s*\(kg\)|total count)\b/i.test(s))return {type:"number"};
 if(/\b(remarks|comments|description|notes|discussion|details|observations|findings|narrative)\b/i.test(s))return {type:"multiline"};
 if(markKinds.length>=2){
  const opts=[...s.matchAll(/(?:\[\s*\]|☐|□|○|◯|\(\s*\))\s*([^\[\]☐□○◯()]{2,34})(?=\s*(?:\[\s*\]|☐|□|○|◯|\(|$))/g)].map(x=>clean(x[1]??"")).filter(Boolean);
  if(opts.length>=2)return {type:markKinds.includes("radio")?"radio":"multiselect",options:[...new Set(opts)]};
  return {type:markKinds.includes("radio")?"radio":"multiselect",options:Array.from({length:markKinds.length},(_,i)=>"Option "+(i+1))};
 }
 if(markKinds.length===1)return {type:"checkbox"};
 if(/\bselect one|choose one/i.test(s))return {type:"radio",options:["Option 1","Option 2"]};
 return {type:"text"};
}
function nearest(lines:readonly PaperLine[],mark:SourceRect,page:number){
 const viable=lines.filter(l=>l.page===page).map(l=>{
  const y=Math.abs(center(l)-center(mark));
  const after=l.x>mark.x-5 ? Math.max(0,l.x-(mark.x+mark.width)):Math.max(0,mark.x-(l.x+l.width));
  return {line:l,dist:y*2.5+after*.32};
 }).filter(x=>x.dist<65);
 viable.sort((a,b)=>a.dist-b.dist);
 return viable[0]?.line;
}
function idHash(s:string){let n=0;for(let i=0;i<s.length;i++)n=(Math.imul(n,31)+s.charCodeAt(i))>>>0;return n.toString(36);}
export function proposePaperControls(lines:readonly PaperLine[],marks:readonly VisualMark[],widgets:readonly PdfWidget[]):DetectedElement[]{
 const output:DetectedElement[]=[];
 const sorted=[...lines].sort((a,b)=>a.page-b.page||a.y-b.y||a.x-b.x);
 const groups=new Map<string,{line:PaperLine;marks:VisualMark[]}>();
 for(const m of marks.filter(m=>m.kind!=="underline")){
  const line=nearest(sorted,m,m.page);
  if(!line)continue;
  const key=line.page+"|"+line.y.toFixed(0)+"|"+line.text;
  if(!groups.has(key))groups.set(key,{line,marks:[]});
  groups.get(key)!.marks.push(m);
 }
 for(const {line,marks:group} of groups.values()){
  const kinds=group.map(x=>x.kind);
  const inference=inferQuestionType(line.text,kinds);
  const label=clean(line.text);
  if(label.length<2)continue;
  const first=group.reduce((a,b)=>a.x<b.x?a:b);
  output.push({id:"det-"+idHash(line.page+"|"+line.y+"|"+label),page:line.page,
   bounds:{x:Math.min(first.x,line.x),y:Math.min(first.y,line.y),width:Math.max(line.x+line.width,first.x+first.width)-Math.min(line.x,first.x),
    height:Math.max(line.y+line.height,first.y+first.height)-Math.min(line.y,first.y)},
   source:"visual",label,type:inference.type,options:inference.options,confidence:Math.min(.86,group.reduce((a,b)=>a+b.confidence,0)/group.length)});
 }
 // OCR sometimes recognizes printed box symbols even when the geometric outline is faint.
 for(const l of sorted){
  if(!/☐|☑|□|◯|○|\[\s*[xX]?\s*\]|\(\s*\)/.test(l.text))continue;
  const label=clean(l.text);if(label.length<3)continue;
  if(output.some(o=>o.page===l.page&&norm(o.label)===norm(label)))continue;
  const symbols=l.text.match(/☐|☑|□|◯|○|\[\s*[xX]?\s*\]|\(\s*\)/g)??[];
  const kind=/(◯|○|\(\s*\))/.test(l.text)?"radio" as const:"checkbox" as const;
  const inferred=inferQuestionType(l.text,Array.from({length:symbols.length},()=>kind));
  output.push({id:"text-control-"+idHash(l.page+"|"+l.y+"|"+label),page:l.page,bounds:{x:l.x,y:l.y,width:l.width,height:l.height},
   source:"ocr-layout",label,type:inferred.type,options:inferred.options,confidence:.67});
 }
 // Ruled or OCR-recognized table headers become a repeatable register, not a text field.
 for(const l of sorted){
  const columns=l.text.split(/\s*\|\s*|\t+/).map(clean).filter(c=>c.length>=2&&c.length<=45);
  if(columns.length<3||columns.length>12||l.text.length>180||!columns.some(c=>/name|date|time|description|item|employee|action|status|signature|quantity/i.test(c)))continue;
  const label="Register: "+columns.slice(0,3).join(" / ");
  output.push({id:"table-"+idHash(l.page+"|"+l.y+"|"+label),page:l.page,bounds:{x:l.x,y:l.y,width:l.width,height:l.height},
   source:"ocr-layout",label,type:"repeat",options:columns,confidence:.72});
 }
 for(const w of widgets){
  const label=clean(w.label)||clean(nearest(sorted,w,w.page)?.text??"")||"Unlabeled PDF input";
  const mapped:FormField["type"]=w.kind==="checkbox"?"checkbox":w.kind==="radio"?"radio":w.kind==="signature"?"signature":
   w.kind==="select"?"select":"text";
  const existing=output.find(o=>o.page===w.page&&norm(o.label)===norm(label));
  const options=w.choices?.filter(Boolean).slice(0,25);
  if(existing){existing.source="acroform";existing.confidence=.98;existing.type=mapped;existing.options=options;continue;}
  output.push({id:"pdf-"+idHash(w.page+"|"+w.x+"|"+label),page:w.page,bounds:{x:w.x,y:w.y,width:w.width,height:w.height},
   source:"acroform",label,type:mapped,options,confidence:.98});
 }
 // Underlined blank answers and other text lines get type cues but do not replace OCR's structured fallback.
 for(const mark of marks.filter(x=>x.kind==="underline")){
  const candidate=[...sorted].filter(l=>l.page===mark.page&&l.x<=mark.x+15&&l.x+l.width<mark.x+mark.width+25&&l.y<=mark.y).sort((a,b)=>Math.abs((a.y+a.height)-mark.y)-Math.abs((b.y+b.height)-mark.y))[0];
  if(!candidate||mark.y-(candidate.y+candidate.height)>22)continue;
  const label=clean(candidate.text);
  if(label.length<3||output.some(o=>norm(o.label)===norm(label)))continue;
  output.push({id:"line-"+idHash(mark.page+"|"+mark.y+"|"+label),page:mark.page,bounds:{...mark},source:"visual",label,type:inferQuestionType(label).type,confidence:.66});
 }
 return output.sort((a,b)=>a.page-b.page||a.bounds.y-b.bounds.y||a.bounds.x-b.bounds.x);
}
const validLabel=(s:string)=>norm(s).length>=3&&!/^page\s*\d+|^copyright|^confidential/i.test(s);
function matchedField(s:string,element:DetectedElement){
 const a=norm(s),b=norm(element.label);
 return Boolean(a&&b&&(a===b||a.includes(b)&&b.length>5||b.includes(a)&&a.length>5));
}
export function mergePaperLayout(parsed:PaperExtraction,elements:readonly DetectedElement[]):LayoutProposal{
 const sections=parsed.sections.map(s=>({...s,fields:[...s.fields].map(f=>({...f}))}));
 const warnings=[...parsed.warnings],seen=new Set<string>();
 for(const e of elements){
  if(!types.has(e.type)||!validLabel(e.label))continue;
  const key=norm(e.label);
  if(seen.has(e.page+"|"+key))continue;
  seen.add(e.page+"|"+key);
  const found=sections.flatMap(s=>s.fields).find(f=>matchedField(f.label,e));
  const inferred:Partial<FormField>={type:e.type,options:e.options?.length?e.options:undefined,
   source:{page:e.page,bounds:e.bounds,confidence:e.confidence,kind:e.source,reviewed:false}};
  if(found){
   if(e.type==="repeat")inferred.children=(e.options??[]).map((option,i)=>({id:"col-"+i,label:option,type:"text" as const,required:false}));
   // Real PDF widget types or printed shape clusters trump plain text inference.
   Object.assign(found,inferred,{label:clean(e.label).slice(0,160)});
  }else{
   const last=sections[sections.length-1]??{id:"ocr-section-1",title:"Source form fields",fields:[]};
   if(!sections.length)sections.push(last);
   last.fields.push({id:"scan-"+e.id,label:clean(e.label).slice(0,160),type:e.type,required:false,
     ...(e.type==="repeat"?{children:(e.options??[]).map((option,i)=>({id:"col-"+i,label:option,type:"text" as const,required:false}))}:{}),...inferred,
     options:e.type==="repeat"?undefined:inferred.options});
  }
 }
 if(elements.some(e=>e.options?.some(x=>x.startsWith("Option "))))warnings.push("Some checkbox groups have unrecognized option labels. Review and rename those options before publishing.");
 if(elements.some(e=>e.source==="visual"))warnings.push("Detected drawn boxes and lines are proposed UI controls, not verified source answers. Check each source page.");
 if(elements.length===0)warnings.push("No distinct graphical input controls detected. Text-based OCR fields remain available for review.");
 const fields=sections.reduce((sum,s)=>sum+s.fields.length,0);
 return {elements:[...elements],sections,summary:{
  checkbox:elements.filter(e=>e.type==="checkbox"||e.type==="multiselect").length,
  radio:elements.filter(e=>e.type==="radio"||e.type==="yes_no"||e.type==="pass_fail_na").length,
  text:elements.filter(e=>e.type==="text"||e.type==="date"||e.type==="number"||e.type==="multiline").length,
  signature:elements.filter(e=>e.type==="signature").length,
  table:elements.filter(e=>e.type==="repeat").length,
  fields
 },warnings};
}
