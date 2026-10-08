"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Cloud, CloudOff, Link2, ShieldCheck, Building2, UserRound, FolderLock, RefreshCw } from "lucide-react";
import { useAssuranceIdentity } from "../../lib/firebase-assurance";

type DriveNode={id:string;kind:string;account_label?:string|null;folder_id?:string|null;created_at?:string;status?:string};
type NetworkResponse={orgId?:string;nodeId?:string;nodes?:Array<{id:string;kind:string;label:string}>;connections?:DriveNode[];records?:Array<{id:string;kind:string;record_id:string}>;error?:string};
const panel:React.CSSProperties={background:"#fff",border:"1px solid #d9e2ee",borderRadius:16,padding:18};
const button:React.CSSProperties={border:0,background:"#172b4d",color:"#fff",borderRadius:11,padding:"11px 14px",minHeight:44,fontWeight:850,cursor:"pointer"};
export function AssuranceDriveNetwork(){
 const identity=useAssuranceIdentity();
 const reducedMotion=useReducedMotion();
 const [network,setNetwork]=useState<NetworkResponse|null>(null);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState("");
 const [action,setAction]=useState("");
 const load=useCallback(async()=>{
  if(!identity.user)return;
  setLoading(true);setError("");
  try{
   const token=await identity.user.getIdToken();
   const res=await fetch("/api/assurance/network",{headers:{Authorization:"Bearer "+token},cache:"no-store"});
   const data=await res.json() as NetworkResponse;
   if(!res.ok)throw new Error(data.error??"Unable to load network");
   setNetwork(data);
  }catch(e){setError(e instanceof Error?e.message:"Could not read connection registry");}
  finally{setLoading(false);}
 },[identity.user]);
 useEffect(()=>{void load();},[load]);
 async function connect(){
  if(!identity.user)return;
  setAction("Connecting…");setError("");
  try{
   const token=await identity.user.getIdToken();
   const response=await fetch("/api/assurance/drive/start",{method:"POST",headers:{Authorization:"Bearer "+token}});
   const data=await response.json() as {authorizationUrl?:string;error?:string};
   if(!response.ok||!data.authorizationUrl)throw new Error(data.error??"OAuth unavailable");
   // Opens real Google consent — Drive file permissions are distinct from Firebase login.
   window.location.assign(data.authorizationUrl);
  }catch(e){setError(e instanceof Error?e.message:"Unable to start consent");setAction("");}
 }
 async function disconnect(){
  if(!identity.user)return;
  setAction("Disconnecting…");setError("");
  try{
   const token=await identity.user.getIdToken();
   const response=await fetch("/api/assurance/drive",{method:"DELETE",headers:{Authorization:"Bearer "+token}});
   const data=await response.json() as {error?:string};
   if(!response.ok)throw new Error(data.error??"Disconnect failed");
   setAction("Connection revoked. Existing files remain in your Google Drive.");
   await load();
  }catch(e){setError(e instanceof Error?e.message:"Unable to disconnect");setAction("");}
 }
 const connected=(network?.connections??[]).filter(c=>c.status!=="REVOKED");
 return <section aria-label="Drive connection network" style={{marginTop:20,display:"grid",gap:13}}>
   <div style={{...panel,background:"#101d33",color:"#fff",border:0}}>
     <p style={{margin:0,textTransform:"uppercase",letterSpacing:1.5,fontSize:11,fontWeight:850,color:"#93c5fd"}}>Drive Network</p>
     <h2 style={{fontSize:25,margin:"6px 0"}}>Every user is a protected node.</h2>
     <p style={{color:"#cbd5e1",fontSize:13,lineHeight:1.7,maxWidth:710,margin:"4px 0"}}>Firebase verifies identity. Users separately connect their Google Drive and keep ownership of their files. A central registry stores links and permissions, not copies of their private documents.</p>
   </div>
   {!identity.configured?<div style={panel}><CloudOff size={22} color="#b45309"/><strong style={{display:"block",marginTop:8}}>Firebase project not configured</strong><p style={{fontSize:12,color:"#667085"}}>Set NEXT_PUBLIC_FIREBASE_* values. To activate real Drive connections, configure D1, OAuth redirect and encrypted token storage.</p></div>:null}
   {identity.configured&&!identity.user?<div style={panel}><strong>Sign in to create your personal node</strong><p style={{color:"#667085",fontSize:12}}>Drive consent is requested separately after Firebase sign-in.</p><button style={button} onClick={()=>void identity.login()}>Sign in with Google</button></div>:null}
   {identity.user?<div style={{...panel,display:"grid",gap:15}}>
      <div style={{display:"flex",gap:12,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
        <div><strong>{identity.user.email??"Firebase user"}</strong><p style={{fontSize:11,margin:"4px 0",color:"#667085"}}>Authenticated identity · {network?.nodeId??"registry not initialized"}</p></div>
        <button style={{...button,background:"#e2e8f0",color:"#172b4d"}} onClick={()=>void load()}><RefreshCw size={15} style={{display:"inline"}}/> {loading?"Loading…":"Refresh network"}</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10,alignItems:"stretch"}}>
        {[
          {title:"Identity",details:"Firebase UID",icon:<UserRound size={22}/>},
          {title:"Registry",details:network?.orgId?"Personal workspace":"Not configured",icon:<ShieldCheck size={22}/>},
          {title:"Drive",details:connected.length?connected.length+" connected":"Not connected",icon:<Cloud size={22}/>},
          {title:"Organization",details:"Invitation required",icon:<Building2 size={22}/>}
        ].map(node=><motion.div key={node.title} initial={reducedMotion?false:{opacity:0,y:6}} animate={{opacity:1,y:0}} style={{padding:14,border:"1px solid #dbe3ed",borderRadius:13,display:"grid",gap:8}}>
            <div style={{color:"#1d4ed8"}}>{node.icon}</div><strong style={{fontSize:13}}>{node.title}</strong><span style={{fontSize:11,color:"#667085"}}>{node.details}</span>
          </motion.div>)}
      </div>
      <div style={{borderTop:"1px solid #e2e8f0",paddingTop:16}}>
       <strong style={{display:"flex",gap:8,alignItems:"center"}}><FolderLock size={18}/> Personal Drive nodes</strong>
       {connected.map(c=><div key={c.id} style={{display:"flex",justifyContent:"space-between",gap:10,marginTop:11,padding:12,border:"1px solid #dbe3ed",borderRadius:12,flexWrap:"wrap"}}>
          <div><strong style={{fontSize:13}}>{c.account_label??"Google account"}</strong><p style={{fontSize:11,margin:"3px 0",color:"#667085"}}>{c.kind} · {c.folder_id?"App folder provisioned":"No app folder yet"}</p></div><span style={{color:"#087f5b",fontSize:12,fontWeight:850}}>CONNECTED</span>
       </div>)}
       <div style={{display:"flex",gap:9,marginTop:12,flexWrap:"wrap"}}>
        <button style={button} onClick={()=>void connect()} disabled={Boolean(action)&&action!=="Connection revoked. Existing files remain in your Google Drive."}><Link2 size={15} style={{display:"inline"}}/> {connected.length?"Reconnect Google Drive":"Connect Google Drive"}</button>
        {connected.length?<button style={{...button,background:"#fee2e2",color:"#b42318"}} onClick={()=>void disconnect()}>Revoke most recent grant</button>:null}
       </div>
       <p style={{color:"#667085",fontSize:11,lineHeight:1.55}}>Only app-created or user-selected Drive files are accessible under the narrow drive.file grant. Company shared folders require separate, explicit authorization.</p>
      </div>
   </div>:null}
   {action?<div role="status" style={{...panel,fontSize:12,color:"#1d4ed8"}}>{action}</div>:null}
   {error?<div role="alert" style={{...panel,fontSize:12,color:"#b42318"}}>{error}</div>:null}
 </section>;
}
