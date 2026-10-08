import test from "node:test";
import assert from "node:assert/strict";
import {
 getLocalValue,subscribeLocalValue,writeLocalValue,resetLocalKey,getLocalHealth,
 makeWorkspaceBackup,parseWorkspaceBackup,restoreWorkspaceBackup,clearWorkspaceData
} from "../packages/persistence/src/local-store.ts";

class FakeStorage{
 #data=new Map();
 get length(){return this.#data.size;}
 key(index){return [...this.#data.keys()][index]??null;}
 getItem(key){return this.#data.has(key)?this.#data.get(key):null;}
 setItem(key,value){this.#data.set(key,String(value));}
 removeItem(key){this.#data.delete(key);}
 clear(){this.#data.clear();}
}
test("writes synchronously and notifies all mounted subscribers",()=>{
 const storage=new FakeStorage();
 const previous=globalThis.window;
 globalThis.window={localStorage:storage,addEventListener(){},dispatchEvent(){}};
 try{
  const key="bokang-studio.move-track.test-counter.v1";
  let notifications=0;
  const detach=subscribeLocalValue(key,()=>notifications++);
  assert.equal(getLocalValue(key,0),0);
  writeLocalValue(key,3);
  assert.equal(getLocalValue(key,0),3);
  assert.equal(storage.getItem(key),"3");
  assert.equal(notifications,1);
  assert.equal(getLocalHealth(key).status,"ready");
  resetLocalKey(key);
  assert.equal(getLocalValue(key,0),0);
  assert.equal(storage.getItem(key),null);
  detach();
 }finally{globalThis.window=previous;}
});
test("backup exports only MoveTrack keys and restores multiple record types",()=>{
 const storage=new FakeStorage();
 storage.setItem("bokang-studio.move-track.custom-templates.v1",JSON.stringify([{id:"company-checklist"}]));
 storage.setItem("bokang-studio.move-track.custom-jras.v1",JSON.stringify([{id:"job-77"}]));
 storage.setItem("unrelated.app.session","secret");
 const backup=makeWorkspaceBackup(storage);
 assert.equal(Object.keys(backup.items).length,2);
 assert.equal(backup.items["unrelated.app.session"],undefined);
 const parsed=parseWorkspaceBackup(JSON.stringify(backup));
 const destination=new FakeStorage();
 const restored=restoreWorkspaceBackup(destination,parsed);
 assert.equal(restored,2);
 assert.equal(JSON.parse(destination.getItem("bokang-studio.move-track.custom-jras.v1"))[0].id,"job-77");
 assert.equal(clearWorkspaceData(destination),2);
 assert.equal(destination.length,0);
});
test("malicious/malformed archives are rejected before touching storage",()=>{
 const valid={schema:"movetrack-local-v1",exportedAt:"2026-10-08T12:00:00Z",items:{"bokang-studio.move-track.fleet.v2":[]}};
 assert.equal(parseWorkspaceBackup(JSON.stringify(valid)).schema,"movetrack-local-v1");
 assert.throws(()=>parseWorkspaceBackup(JSON.stringify({...valid,items:{"other-app.auth.v1":"token"}})),/Unsupported backup key/);
 assert.throws(()=>parseWorkspaceBackup(JSON.stringify({...valid,schema:"v999"})),/Unsupported backup format/);
 assert.throws(()=>parseWorkspaceBackup(JSON.stringify({...valid,items:{"bokang-studio.move-track.bad key":3}})),/Unsupported backup key/);
});
test("failed writes are rolled back when restoring a backup",()=>{
 class LimitedStorage extends FakeStorage{
  setItem(key,value){if(key.includes("blocked"))throw new Error("No space");super.setItem(key,value);}
 }
 const storage=new LimitedStorage();
 const first="bokang-studio.move-track.organizations.v1";
 const blocked="bokang-studio.move-track.blocked.v1";
 storage.setItem(first,JSON.stringify([{name:"Original"}]));
 const backup=parseWorkspaceBackup(JSON.stringify({schema:"movetrack-local-v1",exportedAt:"2026-10-08T12:00:00Z",items:{[first]:[{name:"Changed"}],[blocked]:[]}}));
 assert.throws(()=>restoreWorkspaceBackup(storage,backup),/Storage refused/);
 assert.deepEqual(JSON.parse(storage.getItem(first)),[{name:"Original"}]);
});
test("localStorage write failure is reported instead of claiming persisted success",()=>{
 const previous=globalThis.window;
 const storage=new FakeStorage();
 storage.setItem=()=>{throw new DOMException("quota","QuotaExceededError");};
 globalThis.window={localStorage:storage,addEventListener(){},dispatchEvent(){}};
 try{
  const key="bokang-studio.move-track.quota.v1";
  getLocalValue(key,{note:"initial"});
  writeLocalValue(key,{note:"edited"});
  assert.equal(getLocalHealth(key).status,"quota");
  assert.equal(getLocalValue(key,{note:"initial"}).note,"edited");
  assert.equal(storage.getItem(key),null);
 }finally{globalThis.window=previous;}
});
