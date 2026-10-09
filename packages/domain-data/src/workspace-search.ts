/**
 * Dependency-free browser search across independent workspace data sources.
 * No hardcoded dataset names, business types, API keys or optional vendor SDKs.
 */
export type SearchDocument={
 id:string;source:string;category:string;title:string;description?:string;fields?:readonly string[];
 status?:string;target:string;recordId?:string;priority?:number;
};
export type SearchProvider<T>={id:string;category:string;target:string;items:readonly T[];
 toDocument:(item:T)=>Omit<SearchDocument,"source"|"category"|"target"> & Partial<Pick<SearchDocument,"category"|"target">>};
export type SearchHit=SearchDocument & {score:number;matched:string[]};
export function normalizeSearch(value:unknown):string{
 return String(value??"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("en").replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ");
}
/** A tiny zero-dependency approximate matcher, tolerant of one character omission or substitution.
 * Applied only to meaningful terms, never to IDs or very short prefixes. */
function nearWord(candidate:string,term:string):boolean{
 if(term.length<5||Math.abs(candidate.length-term.length)>1)return false;
 let a=0,b=0,edits=0;
 while(a<candidate.length&&b<term.length){
  if(candidate[a]===term[b]){a++;b++;continue;}
  if(++edits>1)return false;
  if(candidate.length>term.length)a++;
  else if(candidate.length<term.length)b++;
  else{a++;b++;}
 }
 return edits+Math.max(candidate.length-a,term.length-b)<=1;
}
export type SearchCollection={id:string;documents:SearchDocument[]};
export function makeSearchProvider<T>(provider:SearchProvider<T>):SearchCollection{
 const documents:SearchDocument[]=provider.items.map(item=>{
  const d=provider.toDocument(item);
  return {...d,source:provider.id,category:d.category??provider.category,target:d.target??provider.target};
 }).filter(d=>Boolean(d.id&&d.title?.trim()));
 return {id:provider.id,documents};
}
export function workspaceIndex(providers:readonly SearchCollection[]):SearchDocument[]{
 const map=new Map<string,SearchDocument>();
 for(const provider of providers)for(const item of provider.documents)map.set(provider.id+":"+item.id,item);
 return [...map.values()];
}
export function searchDocuments(documents:readonly SearchDocument[],query:string,opts?:{
 category?:string;limit?:number;offset?:number;source?:string
}):SearchHit[]{
 const terms=[...new Set(normalizeSearch(query).split(" ").filter(Boolean))].slice(0,12);
 const category=opts?.category,source=opts?.source,limit=Math.max(1,Math.min(opts?.limit??40,300)),offset=Math.max(0,Math.floor(opts?.offset??0));
 const results:SearchHit[]=[];
 for(const doc of documents){
  if(category&&category!=="All"&&doc.category!==category)continue;
  if(source&&doc.source!==source)continue;
  const title=normalizeSearch(doc.title), description=normalizeSearch(doc.description),
   secondary=normalizeSearch((doc.fields??[]).join(" ")), status=normalizeSearch(doc.status);
  const words=[title,description,secondary,status].join(" ");
  let score=doc.priority??0;
  const matched:string[]=[];
  for(const term of terms){
   const exact=title===term?28:title.split(" ").includes(term)?20:title.includes(term)?12:0;
   const next=description.includes(term)?5:0, detail=secondary.includes(term)?3:0, state=status.includes(term)?2:0;
   const fuzzy=!exact&&!next&&!detail&&!state&&words.split(" ").some(w=>nearWord(w,term))?1:0;
   if(!exact&&!next&&!detail&&!state&&!fuzzy){score=0;break;}
   score+=exact+next+detail+state+fuzzy;
   matched.push(term);
  }
  if(terms.length&&matched.length!==terms.length)continue;
  if(!terms.length)score+=(doc.priority??0)+1;
  results.push({...doc,score,matched});
 }
 return results.sort((a,b)=>b.score-a.score||a.category.localeCompare(b.category)||a.title.localeCompare(b.title)).slice(offset,offset+limit);
}
/** Backends or future indexes can expose the same SearchCollection shape, without replacing this renderer. */
