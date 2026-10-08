import { createRemoteJWKSet, jwtVerify } from "jose";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type AssurancePrincipal = {uid:string; email?:string; authTime:number};
const keySet=createRemoteJWKSet(new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"));

/** Firebase ID tokens must be verified on server; never take uid or roles from JSON body. */
export async function requireFirebasePrincipal(request: Request):Promise<AssurancePrincipal>{
 const projectId=process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
 if(!projectId) throw new Error("FIREBASE_UNCONFIGURED");
 const auth=request.headers.get("authorization")??"";
 const token=auth.startsWith("Bearer ")?auth.slice(7):"";
 if(!token||token.length>8192)throw new Error("UNAUTHENTICATED");
 try{
  const {payload}=await jwtVerify(token,keySet,{
   audience:projectId,issuer:"https://securetoken.google.com/"+projectId,algorithms:["RS256"],
   clockTolerance:5
  });
  const uid=payload.sub??"",authTime=Number(payload.auth_time??0);
  if(!uid||uid.length>256||!Number.isFinite(authTime)||authTime<=0||authTime>Math.floor(Date.now()/1000)) throw new Error("Invalid identity");
  return {uid,email:typeof payload.email==="string"?payload.email:undefined,authTime};
 }catch{throw new Error("UNAUTHENTICATED");}
}
export type DbResult<T>={results:T[];success:boolean};
export interface AssurancePrepared {
 bind(...values:(string|number|null)[]):AssurancePrepared;
 run():Promise<unknown>;
 first<T extends Record<string,unknown>>():Promise<T|null>;
 all<T extends Record<string,unknown>>():Promise<DbResult<T>>;
}
export interface AssuranceDb{
 prepare(sql:string):AssurancePrepared;
 batch(stmts:AssurancePrepared[]):Promise<unknown>;
}
export async function assuranceDb():Promise<AssuranceDb|null>{
 try {
   const {env}=await getCloudflareContext({async:true});
   const db=(env as Record<string,unknown>).ASSURANCE_DB as AssuranceDb|undefined;
   if(!db||typeof db.prepare!=="function")return null;
   return db;
 }catch{return null;}
}
export function dbUnavailable(){return Response.json({error:"Assurance registry not configured (D1 binding missing)."}, {status:503});}
export function serverError(error:unknown){
 const message=error instanceof Error?error.message:"";
 if(message==="UNAUTHENTICATED")return Response.json({error:"Firebase authentication required."},{status:401});
 if(message==="FIREBASE_UNCONFIGURED")return Response.json({error:"Firebase project not configured."},{status:503});
 return Response.json({error:"Request could not be completed."},{status:500});
}
export async function provisionPersonalNode(db:AssuranceDb, principal:AssurancePrincipal){
 const id="personal:"+principal.uid;
 const nodeId="person:"+principal.uid;
 const now=new Date().toISOString();
 // Personal namespaces are isolated; joining a company requires an explicit invitation.
 await db.batch([
  db.prepare("INSERT OR IGNORE INTO assurance_organizations (id,name,kind,created_at) VALUES (?,?,?,?)").bind(id,"Personal workspace","PERSONAL",now),
  db.prepare("INSERT OR IGNORE INTO assurance_nodes (id,org_id,kind,firebase_uid,label,created_at) VALUES (?,?,?,?,?,?)").bind(nodeId,id,"PERSON",principal.uid,principal.email??"Verified user",now),
  db.prepare("INSERT OR IGNORE INTO assurance_memberships (id,org_id,node_id,site_id,role,active,approved_by_uid,approved_at) VALUES (?,?,?,?,?,?,?,?)").bind("personal-member:"+principal.uid,id,nodeId,null,"ADMIN",1,principal.uid,now)
 ]);
 return {orgId:id,nodeId};
}
