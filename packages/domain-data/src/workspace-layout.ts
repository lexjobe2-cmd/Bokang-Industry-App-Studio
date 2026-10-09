/** Stable field anchors, rather than page numbers, keep the same answer visible across device modes. */
export function focusedFieldPage<T extends {id:string}>(fields:readonly T[],anchor:string,desktop:boolean){
 const size=desktop?4:1,index=Math.max(0,fields.findIndex(f=>f.id===anchor)),start=Math.floor(index/size)*size;
 return {items:fields.slice(start,start+size),start,size,index,total:fields.length,page:Math.floor(start/size)+1,pages:Math.max(1,Math.ceil(fields.length/size)),previous:start>0?(fields[start-size]?.id??""):"",next:fields[start+size]?.id??""};
}
