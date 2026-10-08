import {parsePaperText,type PaperExtraction} from "@bokang/domain-data/paper-forms";
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
async function textFromImage(file:File,progress:(value:PaperProgress)=>void){
 const image=await createImageBitmap(file);
 try{
  const canvas=normalizeCanvas(image);
  const {createWorker}=await import("tesseract.js");
  progress({phase:"Loading English OCR language model (first use may require internet)",percent:15});
  const worker=await createWorker("eng",1,{logger:(event:{status?:string;progress?:number})=>{
   if(event.status==="recognizing text")progress({phase:"Reading characters from scanned image",percent:25+Math.round((event.progress??0)*67)});
  }});
  try{const result=await worker.recognize(canvas);return {text:result.data.text,confidence:result.data.confidence};}
  finally{await worker.terminate();}
 }finally{image.close();}
}
async function textFromPdf(file:File,progress:(value:PaperProgress)=>void){
 const pdfjs=await import("pdfjs-dist");
 pdfjs.GlobalWorkerOptions.workerSrc=new URL("pdfjs-dist/build/pdf.worker.min.mjs",import.meta.url).toString();
 const data=new Uint8Array(await file.arrayBuffer());
 const loading=pdfjs.getDocument({data});
 const doc=await loading.promise;
 const limit=Math.min(MAX_PAGES,doc.numPages);
 const collected:string[]=[];
 let confidenceSum=0,ocrPages=0;
 let worker:Awaited<ReturnType<typeof import("tesseract.js")["createWorker"]>>|null=null;
 try{
  for(let i=1;i<=limit;i++){
   progress({phase:"Reading PDF page "+i+" of "+limit,percent:Math.round(8+65*(i-1)/limit)});
   const page=await doc.getPage(i);
   const content=await page.getTextContent();
   const digital=content.items.map(item=>"str" in item?item.str:"").join(" ").trim();
   if(digital.length>=65){collected.push(digital);continue;}
   const viewport=page.getViewport({scale:1.8});
   const canvas=document.createElement("canvas");
   canvas.width=Math.round(viewport.width);canvas.height=Math.round(viewport.height);
   const ctx=canvas.getContext("2d");
   if(!ctx)throw Error("Unable to render this scanned PDF page.");
   await page.render({canvas,canvasContext:ctx,viewport}).promise;
   if(!worker){
    const {createWorker}=await import("tesseract.js");
    progress({phase:"Preparing OCR for scanned PDF pages",percent:20});
    worker=await createWorker("eng");
   }
   const res=await worker.recognize(normalizeCanvas(canvas));
   collected.push(res.data.text);
   confidenceSum+=res.data.confidence;ocrPages++;
   canvas.width=0;canvas.height=0;
  }
 }finally{await worker?.terminate();await doc.destroy();}
 if(limit<doc.numPages)collected.push("\nNOTE: Only "+limit+" of "+doc.numPages+" source pages processed. Split longer documents.");
 return {text:collected.join("\n\n"),confidence:ocrPages?confidenceSum/ocrPages:null,pages:limit,truncated:limit<doc.numPages};
}
export async function readPaperDocument(file:File,progress:(v:PaperProgress)=>void):Promise<PaperExtraction>{
 const kind=acceptedPaperFile(file);
 let result:{text:string;confidence:number|null;pages?:number;truncated?:boolean};
 progress({phase:"Opening original source document",percent:5});
 if(kind==="pdf")result=await textFromPdf(file,progress);
 else result={...await textFromImage(file,progress),pages:1};
 progress({phase:"Proposing editable questions and section headings",percent:95});
 const parsed=parsePaperText(file.name,result.text,result.confidence,result.pages??1);
 if(result.truncated)parsed.warnings.push("The PDF contains more than five pages. Upload each portion separately to avoid missing check items.");
 progress({phase:"Ready for human review",percent:100});
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
