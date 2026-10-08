/**
 * Local-first JSON store shared by all mounted MoveTrack components.
 * Synchronous write-through avoids racing React effects or losing edits during navigation.
 */
type StorageHealth = { status:"ready"|"unavailable"|"quota"|"corrupt"; error?:string; lastSavedAt?:string; };
type Cell = {raw:string|null;value:unknown;};
const cache=new Map<string,Cell>();
const listeners=new Map<string,Set<()=>void>>();
const defaults=new Map<string,unknown>();
const health=new Map<string,StorageHealth>();
const statusListeners=new Set<()=>void>();
let storageEventsInstalled=false;

function browserStorage():Storage|null{
 if(typeof window==="undefined")return null;
 try{return window.localStorage;}catch{return null;}
}
function notify(key:string){
 listeners.get(key)?.forEach(fn=>fn());
 statusListeners.forEach(fn=>fn());
}
function installStorageEvents(){
 if(typeof window==="undefined"||storageEventsInstalled)return;
 storageEventsInstalled=true;
 window.addEventListener("storage",event=>{
  if(!event.key){
   // A clear() in another tab invalidates all cached keys.
   for(const key of cache.keys())loadFromStorage(key,true);
   return;
  }
  if(!cache.has(event.key))return;
  loadFromStorage(event.key,true);
 });
 window.addEventListener("bokang:persistence-updated",event=>{
  const detail=(event as CustomEvent<{key?:string;raw?:string}>).detail;
  if(detail?.key&&typeof detail.raw==="string"){
   const prev=cache.get(detail.key);
   if(prev?.raw===detail.raw)return;
   try{cache.set(detail.key,{raw:detail.raw,value:JSON.parse(detail.raw)});health.set(detail.key,{status:"ready"});notify(detail.key);}catch{
    health.set(detail.key,{status:"corrupt",error:"External data could not be decoded."});notify(detail.key);
   }
  }
 });
}
function loadFromStorage(key:string,force=false){
 if(typeof window==="undefined")return;
 const storage=browserStorage();
 if(!storage){health.set(key,{status:"unavailable",error:"Browser storage is unavailable."});notify(key);return;}
 try{
  const raw=storage.getItem(key);
  if(!force&&cache.get(key)?.raw===raw)return;
  if(raw===null){cache.set(key,{raw:null,value:defaults.get(key)});health.set(key,{status:"ready"});}
  else{
   try{cache.set(key,{raw,value:JSON.parse(raw)});health.set(key,{status:"ready"});}
   catch{health.set(key,{status:"corrupt",error:"Saved local record is invalid. Export a backup before resetting."});}
  }
  notify(key);
 }catch{health.set(key,{status:"unavailable",error:"Browser storage could not be read."});notify(key);}
}
export function getLocalValue<T>(key:string,initial:T):T{
 if(typeof window==="undefined")return initial;
 installStorageEvents();
 if(!defaults.has(key))defaults.set(key,initial);
 if(!cache.has(key))loadFromStorage(key,true);
 return (cache.has(key)?cache.get(key)!.value:defaults.get(key)) as T;
}
export function subscribeLocalValue(key:string,listener:()=>void){
 installStorageEvents();
 let set=listeners.get(key);
 if(!set){set=new Set();listeners.set(key,set);}
 set.add(listener);
 return ()=>{const current=listeners.get(key);current?.delete(listener);if(current?.size===0)listeners.delete(key);};
}
export function subscribeLocalStatus(listener:()=>void){statusListeners.add(listener);return ()=>{statusListeners.delete(listener);};}
export function getLocalStatuses(){return health;}
export function getLocalHealth(key:string):StorageHealth{return health.get(key)??{status:"ready"};}
export function writeLocalValue<T>(key:string,next:T):void{
 if(typeof window==="undefined")return;
 installStorageEvents();
 let raw:string;
 try{raw=JSON.stringify(next);if(raw===undefined)throw new Error("JSON undefined");}
 catch{health.set(key,{status:"corrupt",error:"Value cannot be encoded as JSON."});notify(key);return;}
 const previous=cache.get(key);
 cache.set(key,{raw,value:next});
 const storage=browserStorage();
 if(storage){
  try{
   storage.setItem(key,raw);
   health.set(key,{status:"ready",lastSavedAt:new Date().toISOString()});
  }catch(error){
   const quota=error instanceof DOMException&&(error.name==="QuotaExceededError"||error.name==="NS_ERROR_DOM_QUOTA_REACHED");
   health.set(key,{status:quota?"quota":"unavailable",error:quota?"Device storage full. Export backup or free space; this edit may not survive a reload.":"Browser denied saving this edit."});
  }
 }else health.set(key,{status:"unavailable",error:"Device storage unavailable. This edit may not survive a reload."});
 if(previous?.raw!==raw)notify(key);
 else statusListeners.forEach(fn=>fn());
}
export function resetLocalKey(key:string,storage:Storage|null=browserStorage()){
 try{storage?.removeItem(key);health.set(key,{status:"ready"});}catch{
  health.set(key,{status:"unavailable",error:"Unable to remove saved data."});
 }
 cache.set(key,{raw:null,value:defaults.get(key)});
 notify(key);
}
export const MOVE_TRACK_STORAGE_PREFIX="bokang-studio.move-track.";
export const MAX_BACKUP_BYTES=12_000_000;
export const MAX_BACKUP_ENTRIES=250;
export type WorkspaceBackup={schema:"movetrack-local-v1";exportedAt:string;items:Record<string,unknown>};
function safeKey(key:string){return key.startsWith(MOVE_TRACK_STORAGE_PREFIX)&&key.length<220&&/^[a-zA-Z0-9._:-]+$/.test(key);}
function ownEntries(storage:Storage){
 const result:Record<string,unknown>={};
 for(let i=0;i<storage.length;i++){
  const key=storage.key(i);
  if(!key||!safeKey(key))continue;
  const raw=storage.getItem(key);
  if(raw===null)continue;
  try{result[key]=JSON.parse(raw);}catch{throw new Error("Invalid saved record at "+key);}
 }
 return result;
}
export function makeWorkspaceBackup(storage:Storage):WorkspaceBackup{
 return {schema:"movetrack-local-v1",exportedAt:new Date().toISOString(),items:ownEntries(storage)};
}
export function parseWorkspaceBackup(raw:string):WorkspaceBackup{
 if(raw.length>MAX_BACKUP_BYTES)throw new Error("Backup exceeds the maximum size (12 MB).");
 const obj=JSON.parse(raw) as unknown;
 if(!obj||typeof obj!=="object"||Array.isArray(obj))throw new Error("Invalid backup");
 const data=obj as Partial<WorkspaceBackup>;
 if(data.schema!=="movetrack-local-v1"||!data.items||typeof data.items!=="object"||Array.isArray(data.items)||!Number.isFinite(Date.parse(data.exportedAt??"")))throw new Error("Unsupported backup format");
 const items=Object.entries(data.items);
 if(items.length>MAX_BACKUP_ENTRIES)throw new Error("Too many backup records");
 for(const [key,value] of items){
  if(!safeKey(key))throw new Error("Unsupported backup key: "+key);
  if(value===undefined||typeof value==="function")throw new Error("Invalid backup value");
 }
 return data as WorkspaceBackup;
}
/** Safely write records, rolling back the affected keys if the browser refuses any update. */
export function restoreWorkspaceBackup(storage:Storage,backup:WorkspaceBackup){
 const items=Object.entries(backup.items);
 const original=new Map(items.map(([key])=>[key,storage.getItem(key)]));
 const written:string[]=[];
 try{
  for(const [key,value] of items){storage.setItem(key,JSON.stringify(value));written.push(key);}
 }catch(error){
  for(const key of written){
   const old=original.get(key);
   try{if(old==null)storage.removeItem(key);else storage.setItem(key,old);}catch{}
  }
  throw new Error("Storage refused the backup. Existing data has been preserved where possible.",{cause:error});
 }
 for(const [key,value] of items)writeLocalValue(key,value);
 return items.length;
}
export function clearWorkspaceData(storage:Storage){
 const keys=Object.keys(ownEntries(storage));
 for(const key of keys)resetLocalKey(key,storage);
 return keys.length;
}
