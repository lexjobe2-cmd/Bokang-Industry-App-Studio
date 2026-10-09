import type {VisualMark} from "@bokang/domain-data/paper-layout";

/**
 * Lightweight in-browser connected-component geometry analysis.
 * Operates on a scaled copy; leaves the original image and PDF untouched.
 * Shape candidates are always presented for human review, never silently required.
 */
export type Raster={width:number;height:number;data:Uint8ClampedArray};
const rgbaDark=(data:Uint8ClampedArray,i:number)=>data[i+3]!>40 && .2126*data[i]!+.7152*data[i+1]!+.0722*data[i+2]!<160;
function connected(raster:Raster){
 const {width:w,height:h,data}=raster;
 const binary=new Uint8Array(w*h),visited=new Uint8Array(w*h);
 for(let k=0;k<w*h;k++)binary[k]=rgbaDark(data,k*4)?1:0;
 const marks:VisualMark[]=[];
 const q=new Int32Array(24000);
 const steps=[-1,1,-w,w,-w-1,-w+1,w-1,w+1];
 for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){
  const start=y*w+x;
  if(!binary[start]||visited[start])continue;
  let first=0,last=1,minX=x,minY=y,maxX=x,maxY=y,count=0;
  visited[start]=1;q[0]=start;
  while(first<last){
   const k=q[first++]!,px=k%w,py=(k/w)|0;
   count++;if(px<minX)minX=px;if(px>maxX)maxX=px;if(py<minY)minY=py;if(py>maxY)maxY=py;
   if(count>6500)break;
   for(const d of steps){
    const n=k+d,nx=n%w,ny=(n/w)|0;
    if(nx<1||nx>w-2||ny<1||ny>h-2||Math.abs(px-nx)>1||Math.abs(py-ny)>1||visited[n]||!binary[n])continue;
    visited[n]=1;if(last<q.length)q[last++]=n;
   }
  }
  if(count>6500)continue;
  const boxW=maxX-minX+1,boxH=maxY-minY+1;
  if(boxW<9||boxW>40||boxH<9||boxH>40||Math.abs(boxW-boxH)>boxW*.3||count<boxW*1.2)continue;
  const border=(nx:number,ny:number)=>binary[(minY+ny)*w+minX+nx]===1;
  let corners=0,boundary=0,inside=0,totalInside=0;
  for(let i=0;i<boxW;i++){
   if(border(i,0))boundary++;if(border(i,boxH-1))boundary++;
  }
  for(let j=1;j<boxH-1;j++){
   if(border(0,j))boundary++;if(border(boxW-1,j))boundary++;
  }
  const perimeter=2*boxW+2*boxH-4;
  const sideRatio=boundary/perimeter;
  const cRadius=Math.max(1,Math.round(Math.min(boxW,boxH)*.18));
  for(const [cx,cy] of ([[0,0],[boxW-1,0],[0,boxH-1],[boxW-1,boxH-1]] as Array<[number,number]>)){
   for(let dx=0;dx<cRadius;dx++)for(let dy=0;dy<cRadius;dy++)if(border(Math.min(boxW-1,cx===0?dx:cx-dx),Math.min(boxH-1,cy===0?dy:cy-dy)))corners++;
  }
  for(let j=3;j<boxH-3;j++)for(let i=3;i<boxW-3;i++){inside+=border(i,j)?1:0;totalInside++;}
  const filled=totalInside?inside/totalInside:0;
  if(filled>.39)continue;
  const cornerRatio=corners/(4*cRadius*cRadius);
  let kind:VisualMark["kind"]|null=null;
  if(sideRatio>.64&&cornerRatio>.3)kind="checkbox";
  else if(sideRatio>.24&&sideRatio<.7&&cornerRatio<.42&&count>=boxW*1.5)kind="radio";
  if(kind)marks.push({x:minX,y:minY,width:boxW,height:boxH,page:1,kind,confidence:Math.min(.86,kind==="checkbox"?sideRatio:count/perimeter)});
 }
 // Find long blank writing rules; do not infer grid edges as mandatory.
 for(let y=3;y<h-3;y+=2){
  let start=-1;
  for(let x=0;x<=w;x++){
   const black=x<w&&binary[y*w+x]===1;
   if(black&&start<0)start=x;
   if((!black||x===w)&&start>=0){
    const len=x-start;
    if(len>=48&&len<=Math.min(w*.8,660)){
     const mid=Math.floor((start+x)/2);
     if(!binary[(y-3)*w+mid]&&!binary[(y+3)*w+mid])marks.push({x:start,y,width:len,height:2,page:1,kind:"underline",confidence:.63});
    }
    start=-1;
   }
  }
 }
 return marks;
}
export function findPaperShapes(image:ImageData|Raster,page=1):VisualMark[]{
 const raster:Raster={width:image.width,height:image.height,data:image.data};
 return connected(raster).map(m=>({...m,page}));
}
export function canvasPaperShapes(source:HTMLCanvasElement,page:number){
 const scale=Math.min(1,1400/Math.max(source.width,source.height));
 const canvas=document.createElement("canvas");
 canvas.width=Math.max(1,Math.round(source.width*scale));canvas.height=Math.max(1,Math.round(source.height*scale));
 const ctx=canvas.getContext("2d",{willReadFrequently:true});
 if(!ctx)return [];
 ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(source,0,0,canvas.width,canvas.height);
 const marks=findPaperShapes(ctx.getImageData(0,0,canvas.width,canvas.height),page);
 return marks.map(m=>({...m,x:m.x/scale,y:m.y/scale,width:m.width/scale,height:m.height/scale}));
}
