import type {ExportDocument,DocumentRow} from "./form-exports";
import {jsPDF} from "jspdf";

/** Print-oriented A4 report. Rows, headers and badges are laid out atomically across pages. */
const PAGE_W=210,PAGE_H=297,LEFT=17,RIGHT=193,CONTENT_W=176,TOP=18,FOOT=278;
type RGB=[number,number,number];
const NAVY:RGB=[16,35,63], INK:RGB=[34,49,71], MUTED:RGB=[94,112,134],
  PALE:RGB=[244,247,251],BORDER:RGB=[222,230,240],WHITE:RGB=[255,255,255];
const asRgb=(hex?:string):RGB=>{
 const match=/^#?([\da-fA-F]{6})$/.exec(hex??"");
 return match?[1,3,5].map(i=>parseInt(match[1]!.slice(i-1,i+1),16)) as RGB:[37,99,182];
};
function pdfSafe(s:string){
 return s.replaceAll("•","/").replaceAll("·"," | ").replace(/[–—−]/g,"-")
  .replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replaceAll("✓","OK").replaceAll("×","x")
  .replace(/[^\x20-\x7e\n]/g," ").replace(/\s+\n/g,"\n");
}
const isBlank=(v:string)=>!v.trim()||v.includes("________________")||v==="-"||v==="—";
function statusStyle(v:string):{bg:RGB;fg:RGB;label:string}|null{
 const text=v.trim().toUpperCase();
 if(["PASS","YES","COMPLETE","GO"].includes(text))return {bg:[225,248,236],fg:[21,107,76],label:text};
 if(["FAIL","NO","NO_GO","NO-GO"].includes(text))return {bg:[255,235,234],fg:[178,43,39],label:text};
 if(["NA","N/A"].includes(text))return {bg:[235,240,247],fg:[80,103,130],label:"N/A"};
 const risk=/\b(LOW|MEDIUM|HIGH|EXTREME)\b/.exec(text);
 if(risk)return risk[1]==="LOW"?{bg:[225,248,236],fg:[21,107,76],label:text}:
 risk[1]==="MEDIUM"?{bg:[255,247,223],fg:[152,99,20],label:text}:
 {bg:[255,235,234],fg:[178,43,39],label:text};
 return null;
}
const renderDate=(iso:string)=>{const t=Date.parse(iso);return Number.isFinite(t)?new Date(t).toLocaleString("en-GB",{dateStyle:"medium",timeStyle:"short"}):iso||"Unspecified";};

export function renderProfessionalPdf(doc:ExportDocument):Blob {
 const pdf=new jsPDF({format:"a4",unit:"mm",orientation:"portrait",compress:true});
 const accent=asRgb(doc.accent);
 let y=TOP,pageIndex=1,rowIndex=0;
 const setFill=(c:RGB)=>pdf.setFillColor(...c);
 const setText=(c:RGB)=>pdf.setTextColor(...c);
 const setStroke=(c:RGB)=>pdf.setDrawColor(...c);
 const words=(s:string,width:number,size=9,bold=false):string[]=>{
  pdf.setFont("helvetica",bold?"bold":"normal");pdf.setFontSize(size);
  return pdf.splitTextToSize(pdfSafe(s||" "),width) as string[];
 };
 const lines=(list:string[],x:number,yy:number,size:number,step:number,bold=false,color:RGB=INK)=>{
  setText(color);pdf.setFont("helvetica",bold?"bold":"normal");pdf.setFontSize(size);
  list.forEach((str,i)=>pdf.text(str,x,yy+i*step));
 };
 const header=(first:boolean)=>{
  setFill(NAVY);
  if(first){
   pdf.rect(0,0,PAGE_W,36,"F");
   setFill(accent);pdf.rect(0,0,5,36,"F");
   setText([175,201,238]);pdf.setFontSize(8);pdf.setFont("helvetica","bold");
   pdf.text("MOVETRACK  /  OPERATIONAL ASSURANCE",LEFT,10);
   setText(WHITE);pdf.setFontSize(12);
   pdf.text(words(doc.company.toUpperCase(),119,12,true)[0]??"ORGANIZATION",LEFT,20);
   setText([180,201,226]);pdf.setFontSize(8);
   pdf.text("CONTROLLED DOCUMENT  |  LOCAL DEMO",LEFT,28);
   if(doc.logoDataUrl&&/^data:image\/(png|jpeg|jpg);base64,/.test(doc.logoDataUrl)){
    try{
     setFill(WHITE);pdf.roundedRect(160,5,34,25,2,2,"F");
     pdf.addImage(doc.logoDataUrl,doc.logoDataUrl.startsWith("data:image/png")?"PNG":"JPEG",163,7,28,21,undefined,"FAST");
    }catch{/* Unreadable company logo must not block the report */}
   }
   y=44;
  }else{
   pdf.rect(0,0,PAGE_W,17,"F");
   setFill(accent);pdf.rect(0,0,4,17,"F");
   setText(WHITE);pdf.setFont("helvetica","bold");pdf.setFontSize(8.5);
   pdf.text(words(doc.company,120,8.5,true)[0]??"MoveTrack",LEFT,10);
   setText([192,211,235]);pdf.setFont("helvetica","normal");pdf.setFontSize(7);
   pdf.text("SHE REPORT  /  CONTINUED",RIGHT,10,{align:"right"});
   y=25;
  }
 };
 const page=()=>{pdf.addPage();pageIndex++;rowIndex=0;header(false);};
 const reserve=(height:number)=>{if(y+height>FOOT)page();};
 const badge=(v:string,x:number,bY:number,maxW:number)=>{
  const styled=statusStyle(v);if(!styled)return false;
  const text=pdfSafe(styled.label);
  pdf.setFont("helvetica","bold");pdf.setFontSize(8);
  if(pdf.getTextWidth(text)+8>maxW)return false;
  setFill(styled.bg);pdf.roundedRect(x,bY-5.5,pdf.getTextWidth(text)+9,8,2,2,"F");
  setText(styled.fg);pdf.text(text,x+4.5,bY);
  return true;
 };
 const coloredDivider=(title:string,number:number,subtitle?:string)=>{
  reserve(25);
  const titleLines=words(title.toUpperCase(),149,10,true).slice(0,3);
  const barH=Math.max(14,6+titleLines.length*5);
  setFill([233,241,251]);pdf.roundedRect(LEFT,y,CONTENT_W,barH,1.8,1.8,"F");
  setFill(accent);pdf.rect(LEFT,y,3.3,barH,"F");
  setText(accent);pdf.setFont("helvetica","bold");pdf.setFontSize(9.5);
  pdf.text(String(number).padStart(2,"0"),LEFT+7,y+8);
  lines(titleLines,LEFT+22,y+7.5,10,5,true,NAVY);
  y+=barH+5;
  if(subtitle){lines(words(subtitle,CONTENT_W,8),LEFT,y,8,3.8,false,MUTED);y+=6;}
 };
 const row=(r:DocumentRow)=>{
  const label=pdfSafe(r.label.replace(/\s+\*$/,""));
  const value=isBlank(r.value)?(doc.mode==="blank"?"":r.value):pdfSafe(r.value);
  const isNested=/^\s{2,}/.test(r.label);
  const group=/\s[-–—]\srow\s\d+$/.test(r.label)||r.value===""&&/\brow\s\d+\b/i.test(r.label);
  if(group){
   reserve(13);
   setFill([236,242,250]);pdf.roundedRect(LEFT,y,CONTENT_W,9,1,1,"F");
   lines(words(label,160,8,true).slice(0,1),LEFT+5,y+5.7,8,3.6,true,NAVY);
   y+=11;return;
  }
  const longValue=value.length>120||value.includes("\n");
  const smallLabel=isNested?65:61;
  const lLines=words(label,smallLabel-5,8.4,true);
  const vLines=words(value||" ",longValue?CONTENT_W-12:CONTENT_W-smallLabel-10,9.1);
  const isSmallBadge=!!statusStyle(value)&&!longValue&&vLines.length===1;
  const top=longValue?8:Math.max(8,lLines.length*4.15,vLines.length*4.5)+6;
  const tall=longValue?Math.max(17,lLines.length*4.15+vLines.length*4.5+9):top;
  reserve(tall+1.5);
  if(rowIndex%2===0){setFill(PALE);pdf.roundedRect(LEFT,y,CONTENT_W,tall,1.2,1.2,"F");}
  // Gutter creates a clear alignment between question and answer.
  if(longValue){
   lines(lLines,LEFT+5,y+5.8,8.4,4.2,true,MUTED);
   lines(vLines,LEFT+5,y+5.8+lLines.length*4.3+2,9.1,4.6,false,INK);
  }else{
   lines(lLines,LEFT+5,y+5.7,8.4,4.2,true,MUTED);
   if(isSmallBadge){
    if(!badge(value,LEFT+smallLabel,y+6.1,CONTENT_W-smallLabel-7))lines(vLines,LEFT+smallLabel,y+5.7,9.1,4.5,false,INK);
   }else if(!value&&doc.mode==="blank"){
    setStroke([173,188,207]);pdf.setLineWidth(.24);
    pdf.line(LEFT+smallLabel,y+7.2,RIGHT-7,y+7.2);
   }else{
    lines(vLines,LEFT+smallLabel,y+5.7,9.1,4.5,false,INK);
   }
  }
  y+=tall+1.3;rowIndex++;
 };
 header(true);
 // Report title and snapshot metadata
 const titleLines=words(doc.title,CONTENT_W-7,19,true);
 reserve(titleLines.length*8.5+31);
 lines(titleLines,LEFT,y,19,8.7,true,NAVY);
 y+=titleLines.length*8.7+6;
 const modeTitle=doc.mode==="blank"?"BLANK / UNFILLED":doc.mode==="draft"?"WORKING DRAFT":"RECORDED COPY";
 const statusTitle=doc.status.replaceAll("_"," ").replaceAll("·","/");
 const st=statusStyle(statusTitle);
 setFill(st?.bg??[234,242,253]);pdf.roundedRect(LEFT,y,Math.min(107,doc.mode==="blank"?44:doc.mode==="draft"?43:53),10,2,2,"F");
 setText(st?.fg??NAVY);pdf.setFontSize(8);pdf.setFont("helvetica","bold");pdf.text(modeTitle,LEFT+4,y+6.6);
 if(doc.mode==="filled"){badge(statusTitle,LEFT+63,y+7,100);}
 y+=18;
 const details=doc.sections.find(section=>section.title.toLowerCase()==="document information");
 const detail=(name:string)=>details?.rows.find(row=>row.label.toLowerCase()===name)?.value??"Not specified";
 const metaLines:Array<[string,string]>=[["REFERENCE",doc.reference],["JOB / WORK ORDER",detail("work order")],
   ["WORK SITE",detail("site")],["DOCUMENT DATE",renderDate(doc.timestamp)]];
 for(const [label,value] of metaLines){
  setText(MUTED);pdf.setFont("helvetica","bold");pdf.setFontSize(7.1);pdf.text(label,LEFT,y);
  lines(words(value,130,8.4),LEFT+38,y,8.4,4.5,false,INK);
  y+=9;
 }
 y+=3;
 // Prominent but compact legal notice; not a false approval stamp.
 const notice=words("LOCAL DEMONSTRATION  -  NOT A WORK PERMIT OR VERIFIED SAFETY APPROVAL.  "+doc.disclaimer.replace(/LOCAL DEMO DOCUMENT|LOCAL DEMO JOB RISK ASSESSMENT/gi,""),CONTENT_W-14,8.2);
 const noteH=Math.max(14,notice.length*4.1+6);
 reserve(noteH+8);setFill([255,249,235]);pdf.roundedRect(LEFT,y,CONTENT_W,noteH,2,2,"F");
 setFill([187,127,29]);pdf.rect(LEFT,y,2.5,noteH,"F");lines(notice,LEFT+7,y+6.2,8.2,4.1,true,[129,87,28]);
 y+=noteH+9;
 const reportSections=doc.sections.filter(section=>section.title.toLowerCase()!=="document information");
 for(const [sectionIndex,section] of reportSections.entries()){
  coloredDivider(section.title,sectionIndex+1,section.rows.length===0?"No records supplied":undefined);
  if(section.rows.length===0){row({label:"Records",value:"No entries recorded"});}
  else for(const r of section.rows)row(r);
  y+=7;
 }
 // A clearly separate closing section avoids implied review/signature.
 reserve(25);
 setStroke(BORDER);pdf.setLineWidth(.3);pdf.line(LEFT,y,RIGHT,y);y+=7;
 lines(words("END OF DOCUMENT  /  UNVERIFIED DIGITAL DEMO COPY",CONTENT_W,8,true),LEFT,y,8,4,true,NAVY);
 const pages=pdf.getNumberOfPages();
 for(let i=1;i<=pages;i++){
  pdf.setPage(i);setStroke(BORDER);pdf.setLineWidth(.3);pdf.line(LEFT,284,RIGHT,284);
  setText(MUTED);pdf.setFont("helvetica","normal");pdf.setFontSize(7.4);
  pdf.text("MOVETRACK  |  LOCAL DEMONSTRATION  |  NOT A WORK PERMIT",LEFT,289.8);
  pdf.text("PAGE "+i+" / "+pages,RIGHT,289.8,{align:"right"});
 }
 pdf.setProperties({title:doc.title,subject:"Operational assurance / local demo",author:"MoveTrack AI",creator:"MoveTrack AI"});
 return pdf.output("blob");
}
