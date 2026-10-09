import type {ExportDocument,DocumentRow} from "./form-exports";
import {Document,Packer,Paragraph,TextRun,HeadingLevel,Table,TableRow,TableCell,WidthType,BorderStyle,
 Header,Footer,AlignmentType,PageNumber,ImageRun} from "docx";

const navy="10233F",ink="223147",slate="53667F",blue="2563B6",border="DFE7F0",light="F4F7FB";
function rgb(hex?:string){return /^#?[0-9a-f]{6}$/i.test(hex??"")?(hex??"").replace("#","").toUpperCase():blue;}
function valueTint(value:string){
 const s=value.trim().toUpperCase();
 if(["PASS","YES","COMPLETE","GO"].includes(s)||/\bLOW\b/.test(s))return "177453";
 if(["FAIL","NO","NO_GO","NO-GO"].includes(s)||/\b(HIGH|EXTREME)\b/.test(s))return "B42318";
 if(/\b(MEDIUM|REVIEW|PENDING)\b/.test(s))return "9D6516";
 return ink;
}
const bold=(text:string,color=ink,size=19)=>new TextRun({text,bold:true,color,size,font:"Aptos"});
const normal=(text:string,color=ink,size=19)=>new TextRun({text,color,size,font:"Aptos"});
function tableParagraph(label:string,text:string,row:number){
 return new Paragraph({spacing:{before:75,after:75},children:[new TextRun({text,color:row<0?navy:ink,size:19,font:"Aptos",bold:row<0})]});
}
function signatureBytes(dataUrl:string):Uint8Array{
 const base64=dataUrl.split(",")[1]??"";
 const binary=atob(base64),bytes=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
 return bytes;
}
function pairRow(row:DocumentRow,index:number){
 if(row.signature){
  let signatureRun:ImageRun|TextRun;
  try{signatureRun=new ImageRun({data:signatureBytes(row.signature.imageDataUrl),type:"png",transformation:{width:190,height:76}});}
  catch{signatureRun=normal("Signature image unavailable",slate,17);}
  return new TableRow({cantSplit:true,children:[
   new TableCell({width:{size:38,type:WidthType.PERCENTAGE},shading:{fill:light},margins:{top:160,bottom:140,left:140,right:110},
     children:[new Paragraph({children:[bold(row.label,ink,18)]})]}),
   new TableCell({width:{size:62,type:WidthType.PERCENTAGE},margins:{top:130,bottom:140,left:140,right:100},
     children:[new Paragraph({children:[signatureRun]}),new Paragraph({children:[bold(row.signature.signerName,navy,18),
       normal("  |  "+row.signature.role,slate,16)]}),new Paragraph({children:[normal("LOCAL DRAWN MARK  /  IDENTITY NOT VERIFIED", "996326",15)]})]})
  ]});
 }
 const title=row.label.replace(/\s+\*$/,"");
 const nested=/^\s{2,}/.test(row.label);
 const group=/\brow\s+\d+\b/i.test(row.label)&&!row.value.trim();
 const shade=index%2===0?light:"FFFFFF";
 if(group)return new TableRow({cantSplit:true,children:[new TableCell({columnSpan:2,shading:{fill:"EBF2FB"},margins:{top:125,bottom:125,left:160,right:120},
   children:[new Paragraph({children:[bold(title,navy,19)],spacing:{after:0}})]})]});
 const required=/\s\*$/.test(row.label);
 return new TableRow({cantSplit:true,children:[
  new TableCell({width:{size:38,type:WidthType.PERCENTAGE},shading:{fill:shade},margins:{top:130,bottom:120,left:135,right:110},
   children:[new Paragraph({children:[bold(title,nested?slate:ink,18),...(required?[bold("  *","A03731",17)]:[])],spacing:{after:0}})]}),
  new TableCell({width:{size:62,type:WidthType.PERCENTAGE},shading:{fill:shade},margins:{top:130,bottom:120,left:135,right:110},
   children:[new Paragraph({children:[new TextRun({text:row.value||"____________________________",color:valueTint(row.value),size:19,font:"Aptos",bold:valueTint(row.value)!==ink})],spacing:{after:0}})]})
 ]});
}
export async function renderProfessionalWord(doc:ExportDocument):Promise<Blob>{
 const accent=rgb(doc.accent);
 const masthead=new Table({width:{size:100,type:WidthType.PERCENTAGE},borders:{top:{style:BorderStyle.NONE},bottom:{style:BorderStyle.NONE},left:{style:BorderStyle.NONE},right:{style:BorderStyle.NONE},insideHorizontal:{style:BorderStyle.NONE},insideVertical:{style:BorderStyle.NONE}},
  rows:[new TableRow({cantSplit:true,children:[
   new TableCell({shading:{fill:navy},margins:{top:180,bottom:180,left:210,right:170},children:[
     new Paragraph({children:[bold("MOVETRACK  /  OPERATIONAL ASSURANCE","BBD4F5",17)],spacing:{after:80}}),
     new Paragraph({children:[bold(doc.company.toUpperCase(),"FFFFFF",24)],spacing:{after:60}}),
     new Paragraph({children:[normal("CONTROLLED DOCUMENT  |  LOCAL DEMO","D5E5FB",16)],spacing:{after:0}})
   ]})
  ]})]});
 const details=doc.sections.find(s=>s.title.toLowerCase()==="document information");
 const detail=(name:string)=>details?.rows.find(row=>row.label.toLowerCase()===name)?.value??"Not specified";
 const meta=new Table({width:{size:100,type:WidthType.PERCENTAGE},borders:{top:{style:BorderStyle.SINGLE,size:5,color:border},bottom:{style:BorderStyle.SINGLE,size:5,color:border},left:{style:BorderStyle.SINGLE,size:5,color:border},right:{style:BorderStyle.SINGLE,size:5,color:border},insideHorizontal:{style:BorderStyle.SINGLE,size:3,color:border},insideVertical:{style:BorderStyle.SINGLE,size:3,color:border}},
   rows:[
    pairRow({label:"Document reference",value:doc.reference},0),
    pairRow({label:"Document type",value:doc.mode==="blank"?"BLANK / UNFILLED":doc.mode==="draft"?"WORKING DRAFT":"RECORDED COPY"},1),
    pairRow({label:"Current state",value:doc.status.replaceAll("_"," ")},2),
    pairRow({label:"Job / work order",value:detail("work order")},3),
    pairRow({label:"Work site",value:detail("site")},4),
    pairRow({label:"Document date",value:!Number.isNaN(Date.parse(doc.timestamp))?new Date(doc.timestamp).toLocaleDateString("en-GB"):doc.timestamp},5)
   ]});
 const body:(Paragraph|Table)[]=[
  masthead,
  new Paragraph({text:" ",spacing:{after:65}}),
  new Paragraph({children:[bold(doc.title,navy,37)],spacing:{before:110,after:180},keepNext:true}),
  meta,
  new Paragraph({text:" ",spacing:{after:120}}),
  new Table({width:{size:100,type:WidthType.PERCENTAGE},rows:[new TableRow({cantSplit:true,children:[
   new TableCell({shading:{fill:"FFF7E7"},margins:{top:140,bottom:140,left:190,right:190},children:[
     new Paragraph({children:[bold("LOCAL DEMONSTRATION  -  NOT AN AUTHORIZED PERMIT","946018",17)],spacing:{after:75}}),
     new Paragraph({children:[normal(doc.disclaimer,"775321",16)],spacing:{after:0}})
   ]})
  ]})]}),
  new Paragraph({text:" ",spacing:{after:110}})
 ];
 const reportSections=doc.sections.filter(section=>section.title.toLowerCase()!=="document information");
 for(let i=0;i<reportSections.length;i++){
  const section=reportSections[i]!;
  body.push(new Paragraph({children:[
    bold(String(i+1).padStart(2,"0")+"    ",accent,19),bold(section.title.toUpperCase(),navy,22)
   ],heading:HeadingLevel.HEADING_2,spacing:{before:240,after:145},keepNext:true}));
  const rows=section.rows.length?section.rows.map((r,n)=>pairRow(r,n)):[pairRow({label:"Records",value:"No entries recorded"},0)];
  body.push(new Table({width:{size:100,type:WidthType.PERCENTAGE},
   borders:{top:{style:BorderStyle.SINGLE,size:3,color:border},bottom:{style:BorderStyle.SINGLE,size:3,color:border},left:{style:BorderStyle.SINGLE,size:3,color:border},right:{style:BorderStyle.SINGLE,size:3,color:border},insideHorizontal:{style:BorderStyle.SINGLE,size:3,color:border},insideVertical:{style:BorderStyle.SINGLE,size:3,color:border}},
   rows}));
 }
 body.push(new Paragraph({children:[bold("END OF DOCUMENT  /  UNVERIFIED DIGITAL DEMO COPY",slate,16)],
  border:{top:{color:border,style:BorderStyle.SINGLE,size:6}},spacing:{before:260,after:120}}));
 const heading=new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[normal("MOVETRACK  /  SAFETY & OPERATIONS",slate,15)]})]});
 const footer=new Footer({children:[new Paragraph({border:{top:{color:border,style:BorderStyle.SINGLE,size:5}},
  spacing:{before:140},children:[normal("LOCAL DEMO  /  NOT A WORK PERMIT",slate,15),
   normal("                                                PAGE ",slate,15),new TextRun({children:[PageNumber.CURRENT],size:15,color:slate})]})]});
 const file=new Document({creator:"MoveTrack AI",title:doc.title,subject:"Local operational assurance report",
  styles:{default:{document:{run:{font:"Aptos",size:19,color:ink},paragraph:{spacing:{after:80}}}}},
  sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:790,bottom:800,left:920,right:920}}},
   headers:{default:heading},footers:{default:footer},children:body}]});
 return Packer.toBlob(file);
}
