import {parsePaperText,type PaperExtraction} from "@bokang/domain-data/paper-forms";
import {proposePaperControls,mergePaperLayout,filterNativeTextGlyphMarks,type PaperLine,type VisualMark,type PdfWidget} from "@bokang/domain-data/paper-layout";
import {canvasPaperShapes} from "./paper-shapes";
export type PaperProgress={phase:string;percent:number};
const MAX_BYTES=12*1024*1024,MAX_PAGES=5;
export function acceptedPaperFile(file:Pick<File,"name"|"size"|"type">){
 const pdf=file.type==="application/pdf"||/\.pdf$/i.test(file.name);
 const image=/^image\/(png|jpeg|webp)$/i.test(file.type)||/\.(png|jpe?g|webp)$/i.test(file.name);
 if(!pdf&&!image)throw Error("Upload a PDF, JPG, PNG or WebP paper document.");
 if(file.size>MAX_BYTES)throw Error("Paper scans must be smaller than 12 MB.");
 if(file.size===0)throw Error("This file is empty.");
 return pdf?"pdf" as const:"image" as const;
}
function normalizeCanvas(source:HTMLImageElement|HTMLCanvasElement|ImageBitmap){
 const w=source.width,h=source.height;
 const scale=Math.min(1,2200/Math.max(w,h));
 const canvas=document.createElement("canvas");
 canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));
 const ctx=canvas.getContext("2d",{willReadFrequently:true});
 if(!ctx)throw Error("The browser cannot open the image canvas.");
 ctx.fillStyle="#ffffff";ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.drawImage(source,0,0,canvas.width,canvas.height);
 return canvas;
}
type LineBox={text:string;bbox?:{x0:number;y0:number;x1:number;y1:number};confidence?:number};
function ocrLines(data:unknown,page:number):PaperLine[]{
 const object=data as {blocks?:Array<{paragraphs?:Array<{lines?:LineBox[]}>}>};
 return (object.blocks??[]).flatMap(b=>b.paragraphs??[]).flatMap(p=>p.lines??[])
  .filter(l=>l.bbox&&l.text.trim()).map(l=>({page,text:l.text,x:l.bbox!.x0,y:l.bbox!.y0,
    width:Math.max(1,l.bbox!.x1-l.bbox!.x0),height:Math.max(1,l.bbox!.y1-l.bbox!.y0),confidence:l.confidence}));
}
function positionedPdfLines(items:readonly unknown[],viewport:{transform:number[];scale:number;height:number},pdfjs:{Util:{transform:(a:number[],b:number[])=>number[]}},page:number):PaperLine[]{
 const rows:PaperLine[]=[];
 for(const item of items){
  const t=item as {str?:string;transform?:number[];width?:number;height?:number};
  if(!t.str?.trim()||!t.transform)continue;
  const tr=pdfjs.Util.transform(viewport.transform,t.transform);
  const tx=tr[4]??0,ty=tr[5]??0;
  const height=Math.max(8,(t.height??9)*viewport.scale),y=ty-height;
  const width=Math.max(2,(t.width??t.str.length*6)*viewport.scale);
  const match=rows.find(x=>Math.abs(x.y-y)<Math.max(4,height*.44));
  if(match){
   if(tx<match.x){match.text=t.str+" "+match.text;match.width=Math.max(match.width,match.x+match.width-tx);match.x=tx;}
   else{const gap=tx-(match.x+match.width);match.text+=(gap>2?" ":"")+t.str;match.width=Math.max(match.width,tx+width-match.x);}
   match.height=Math.max(match.height,height);
  }else rows.push({text:t.str,page,x:tx,y,width,height});
 }
 return rows.sort((a,b)=>a.y-b.y||a.x-b.x);
}
async function textFromImage(file:File,progress:(value:PaperProgress)=>void){
 const image=await createImageBitmap(file);
 try{
  const canvas=normalizeCanvas(image);
  const marks=canvasPaperShapes(canvas,1);
  const {createWorker}=await import("tesseract.js");
  progress({phase:"Loading OCR language model and reading form geometry",percent:15});
  const worker=await createWorker("eng",1,{logger:(event:{status?:string;progress?:number})=>{
   if(event.status==="recognizing text")progress({phase:"Reading paper labels and their positions",percent:25+Math.round((event.progress??0)*65)});
  }});
  try{
   const recognized=await worker.recognize(canvas,{}, {blocks:true});
   return {text:recognized.data.text,confidence:recognized.data.confidence,marks,lines:ocrLines(recognized.data,1)};
  }finally{await worker.terminate();}
 }finally{image.close();}
}
async function textFromPdf(file:File,progress:(value:PaperProgress)=>void){
 const pdfjs=await import("pdfjs-dist");
 pdfjs.GlobalWorkerOptions.workerSrc=new URL("pdfjs-dist/build/pdf.worker.min.mjs",import.meta.url).toString();
 const data=new Uint8Array(await file.arrayBuffer());
 const loading=pdfjs.getDocument({data});
 const doc=await loading.promise,limit=Math.min(MAX_PAGES,doc.numPages);
 const collected:string[]=[],allLines:PaperLine[]=[],allMarks:VisualMark[]=[],allWidgets:PdfWidget[]=[];
 let confidenceSum=0,ocrPages=0;
 let worker:Awaited<ReturnType<typeof import("tesseract.js")["createWorker"]>>|null=null;
 try{
  for(let i=1;i<=limit;i++){
   progress({phase:"Reading PDF page "+i+" of "+limit,percent:Math.round(8+70*(i-1)/limit)});
   const page=await doc.getPage(i),nativeViewport=page.getViewport({scale:1});
   // Bound allocation before rendering, including unusually large PDF page dimensions.
   if(!Number.isFinite(nativeViewport.width)||!Number.isFinite(nativeViewport.height)||nativeViewport.width<=0||nativeViewport.height<=0)throw Error("Invalid PDF page dimensions.");
   const viewport=page.getViewport({scale:Math.min(1.65,2200/Math.max(nativeViewport.width,nativeViewport.height))});
   const content=await page.getTextContent();
   const digital=positionedPdfLines(content.items,viewport,pdfjs,i);
   const text=digital.map(l=>l.text).join("\n").trim();
   const annotations=await page.getAnnotations({intent:"display"});
   for(const annotation of annotations){
    const a=annotation as typeof annotation&{fieldType?:string;fieldName?:string;alternativeText?:string;checkBox?:boolean;radioButton?:boolean;combo?:boolean;options?:Array<{displayValue?:string;exportValue?:string}>;rect?:number[]};
    if(!a.fieldType||!a.rect)continue;
    const mapped=a.fieldType==="Btn"?(a.radioButton?"radio":"checkbox"):a.fieldType==="Sig"?"signature":a.fieldType==="Ch"?"select":"text";
    const [x1=0,y1=0,x2=0,y2=0]=viewport.convertToViewportRectangle(a.rect);
    allWidgets.push({page:i,kind:mapped,label:a.alternativeText||a.fieldName||"",
      choices:a.options?.map((o:{displayValue?:string;exportValue?:string})=>o.displayValue??o.exportValue??"").filter(Boolean),
      x:Math.min(x1,x2),y:Math.min(y1,y2),width:Math.abs(x2-x1),height:Math.abs(y2-y1)});
   }
   // Render digital pages as well, because checkboxes and ruled tables are often vector drawings.
   const canvas=document.createElement("canvas");
   canvas.width=Math.max(1,Math.round(viewport.width));canvas.height=Math.max(1,Math.round(viewport.height));
   const ctx=canvas.getContext("2d",{willReadFrequently:true});
   if(!ctx)throw Error("Unable to render this PDF page.");
   await page.render({canvas,canvasContext:ctx,viewport}).promise;
   const glyphRuns=content.items.flatMap(item=>positionedPdfLines([item],viewport,pdfjs,i));
   allMarks.push(...filterNativeTextGlyphMarks(glyphRuns,canvasPaperShapes(canvas,i)));
   if(text.length>=65){
    collected.push(text);allLines.push(...digital);
   }else{
    if(!worker){
     const {createWorker}=await import("tesseract.js");
     progress({phase:"Preparing printed page OCR",percent:20});
     worker=await createWorker("eng");
    }
    const recognized=await worker.recognize(normalizeCanvas(canvas),{}, {blocks:true});
    collected.push(recognized.data.text);
    allLines.push(...ocrLines(recognized.data,i));
    confidenceSum+=recognized.data.confidence;ocrPages++;
   }
   canvas.width=0;canvas.height=0;
  }
 }finally{await worker?.terminate();await doc.destroy();}
 if(limit<doc.numPages)collected.push("\nNOTE: Only "+limit+" of "+doc.numPages+" source pages processed. Split longer documents.");
 return {text:collected.join("\n\n"),confidence:ocrPages?confidenceSum/ocrPages:null,
  pages:limit,truncated:limit<doc.numPages,lines:allLines,marks:allMarks,widgets:allWidgets};
}
export async function readPaperDocument(file:File,progress:(v:PaperProgress)=>void):Promise<PaperExtraction>{
 const kind=acceptedPaperFile(file);
 progress({phase:"Opening source document",percent:5});
 const result=kind==="pdf"?await textFromPdf(file,progress):{...await textFromImage(file,progress),pages:1,truncated:false,widgets:[] as PdfWidget[]};
 progress({phase:"Converting detected boxes, choices, lines and PDF widgets into editable form components",percent:95});
 const parsed=parsePaperText(file.name,result.text,result.confidence,result.pages);
 const elements=proposePaperControls(result.lines,result.marks,result.widgets);
 const combined=mergePaperLayout(parsed,elements);
 parsed.sections=combined.sections;parsed.warnings=combined.warnings;parsed.elements=combined.elements;parsed.summary=combined.summary;
 if(result.truncated)parsed.warnings.push("The PDF contains more than five pages. Upload each portion separately to avoid missing check items.");
 progress({phase:"Review the reconstructed form UI against the original",percent:100});
 return parsed;
}
export async function downloadSourcePdf(file:File){
 const kind=acceptedPaperFile(file);
 let blob:Blob;
 if(kind==="pdf")blob=file;
 else{
  const image=await createImageBitmap(file);
  try{
   const canvas=normalizeCanvas(image);
   const {jsPDF}=await import("jspdf");
   const pdf=new jsPDF({unit:"mm",format:"a4",orientation:canvas.width>canvas.height?"landscape":"portrait"});
   const w=pdf.internal.pageSize.getWidth(),h=pdf.internal.pageSize.getHeight();
   const ratio=Math.min(w/canvas.width,h/canvas.height);
   pdf.addImage(canvas.toDataURL("image/jpeg",0.87),"JPEG",(w-canvas.width*ratio)/2,(h-canvas.height*ratio)/2,canvas.width*ratio,canvas.height*ratio);
   blob=pdf.output("blob");
  }finally{image.close();}
 }
 const url=URL.createObjectURL(blob);
 const anchor=document.createElement("a");
 anchor.href=url;anchor.download=file.name.replace(/\.[^.]+$/,"")+"-source.pdf";
 document.body.appendChild(anchor);anchor.click();anchor.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
