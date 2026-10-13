/** Browser-only original paper scan archive. Source blobs are not stored in localStorage or sent to a server. */
const DB_NAME="movetrack-paper-originals-v1",STORE="sources";
type StoredSource={id:string;orgId:string;name:string;type:string;lastModified:number;blob:Blob;updatedAt:string};
async function dbOpen():Promise<IDBDatabase>{
 if(typeof indexedDB==="undefined")throw Error("This browser cannot archive source files. Keep the original document elsewhere.");
 return new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB_NAME,1);
  req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:"id"});};
  req.onerror=()=>reject(req.error??Error("Could not open local source archive."));
  req.onsuccess=()=>resolve(req.result);
 });
}
async function transaction<T>(mode:IDBTransactionMode,action:(store:IDBObjectStore,resolve:(v:T)=>void,reject:(e:unknown)=>void)=>void):Promise<T>{
 const db=await dbOpen();
 try{
  return await new Promise<T>((resolve,reject)=>{
   const tx=db.transaction(STORE,mode);
   tx.onabort=()=>reject(tx.error??Error("Local archive transaction aborted."));
   action(tx.objectStore(STORE),resolve,reject);
  });
 }finally{db.close();}
}
export async function savePaperOriginal(id:string,orgId:string,file:File){
 if(!id||!orgId||file.size>12*1024*1024)throw Error("Invalid source file or archive ID.");
 return transaction<void>("readwrite",(store,resolve,reject)=>{
  const req=store.put({id,orgId,name:file.name,type:file.type,lastModified:file.lastModified,blob:file,updatedAt:new Date().toISOString()} as StoredSource);
  req.onsuccess=()=>resolve();req.onerror=()=>reject(req.error);
 });
}
export async function getPaperOriginal(id:string,orgId:string):Promise<File|null>{
 if(!id||!orgId)return null;
 return transaction<File|null>("readonly",(store,resolve,reject)=>{
  const req=store.get(id);
  req.onsuccess=()=>{
   const entry=req.result as StoredSource|undefined;
   resolve(entry?.orgId===orgId?new File([entry.blob],entry.name,{type:entry.type,lastModified:entry.lastModified}):null);
  };
  req.onerror=()=>reject(req.error);
 });
}
export async function deletePaperOriginal(id:string){
 return transaction<void>("readwrite",(store,resolve,reject)=>{
  const req=store.delete(id);req.onsuccess=()=>resolve();req.onerror=()=>reject(req.error);
 });
}
export async function clearPaperOriginals(){
 return transaction<void>("readwrite",(store,resolve,reject)=>{
  const req=store.clear();req.onsuccess=()=>resolve();req.onerror=()=>reject(req.error);
 });
}
