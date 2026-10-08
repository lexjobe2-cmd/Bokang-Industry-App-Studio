import { assuranceDb, dbUnavailable, requireFirebasePrincipal, serverError } from "../../../../../lib/assurance-server";
import { decryptTokenBundle, encryptTokenBundle } from "../../../../../lib/oauth";
export const dynamic="force-dynamic";
type Row={id:string;encrypted_token:string;folder_id:string|null;scope:string};
type Pointer={id:string;provider_file_id:string};
type FormArchive={
 id:string;templateId:string;templateVersion:number;siteId:string;submittedAt:string;
 templateSnapshot:unknown;answers:unknown;decision:string;
};
function validArchive(x:unknown):x is FormArchive{
 if(!x||typeof x!=="object")return false;
 const a=x as Record<string,unknown>;
 return typeof a.id==="string"&&/^[A-Za-z0-9_-]{5,120}$/.test(a.id)&&
  typeof a.templateId==="string"&&a.templateId.length<120&&Number.isInteger(a.templateVersion)&&
  Number(a.templateVersion)>=1&&typeof a.siteId==="string"&&a.siteId.length<200&&
  typeof a.submittedAt==="string"&&Number.isFinite(Date.parse(a.submittedAt))&&
  typeof a.templateSnapshot==="object"&&typeof a.answers==="object"&&
  ["NO_GO","COMPLETE","REVIEW"].includes(String(a.decision));
}
async function accessToken(row:Row,db:NonNullable<Awaited<ReturnType<typeof assuranceDb>>>){
 const token=decryptTokenBundle(row.encrypted_token);
 if(!token?.refreshToken)return null;
 if(token.accessToken&&token.expiresAt&&token.expiresAt>Date.now()+120000)return token.accessToken;
 const result=await fetch("https://oauth2.googleapis.com/token",{
  method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},cache:"no-store",
  body:new URLSearchParams({
   client_id:process.env.GOOGLE_CLIENT_ID??"",client_secret:process.env.GOOGLE_CLIENT_SECRET??"",
   refresh_token:token.refreshToken,grant_type:"refresh_token"
  })
 });
 if(!result.ok)return null;
 const next=await result.json() as {access_token?:string;expires_in?:number};
 if(!next.access_token)return null;
 const updated=encryptTokenBundle({...token,accessToken:next.access_token,expiresAt:Date.now()+((next.expires_in??3600)*1000)});
 await db.prepare("UPDATE assurance_drive_connections SET encrypted_token=?,updated_at=? WHERE id=?").bind(updated,new Date().toISOString(),row.id).run();
 return next.access_token;
}
async function googleFile(token:string,metadata:Record<string,unknown>,value?:string){
 if(value===undefined){
  const result=await fetch("https://www.googleapis.com/drive/v3/files?fields=id",{
    method:"POST",headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},
    body:JSON.stringify(metadata),cache:"no-store"
  });
  if(!result.ok)throw new Error("DRIVE_WRITE_FAILED");
  return await result.json() as {id?:string};
 }
 const boundary="movetrack-"+crypto.randomUUID();
 const body=[
  `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
  `--${boundary}\r\nContent-Type: application/json\r\n\r\n${value}\r\n`,
  `--${boundary}--\r\n`
 ].join("");
 const result=await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",{
  method:"POST",headers:{"Authorization":"Bearer "+token,"Content-Type":`multipart/related; boundary=${boundary}`},
  body,cache:"no-store"
 });
 if(!result.ok)throw new Error("DRIVE_WRITE_FAILED");
 return await result.json() as {id?:string};
}
export async function POST(request:Request){
 try{
  const principal=await requireFirebasePrincipal(request);
  const db=await assuranceDb();if(!db)return dbUnavailable();
  if(!request.headers.get("content-type")?.includes("application/json"))return Response.json({error:"JSON required"},{status:415});
  const raw=await request.text();
  if(raw.length>400000)return Response.json({error:"Maximum draft archive is 400KB"},{status:413});
  const body=JSON.parse(raw) as unknown;
  if(!validArchive(body))return Response.json({error:"Invalid demonstration record"},{status:400});
  const orgId="personal:"+principal.uid;
  const nodeId="person:"+principal.uid;
  const prior=await db.prepare("SELECT id,provider_file_id FROM assurance_record_pointers WHERE org_id=? AND owner_node_id=? AND record_id=? AND version=?")
    .bind(orgId,nodeId,body.id,body.templateVersion).first<Pointer>();
  if(prior)return Response.json({archived:true,existing:true,referenceId:prior.id},{headers:{"Cache-Control":"no-store"}});
  const connection=await db.prepare("SELECT id,encrypted_token,folder_id,scope FROM assurance_drive_connections WHERE owner_node_id=? AND org_id=? AND status='CONNECTED' ORDER BY updated_at DESC LIMIT 1")
    .bind(nodeId,orgId).first<Row>();
  if(!connection)return Response.json({error:"Connect Google Drive before archiving forms"},{status:409});
  if(!connection.scope.includes("https://www.googleapis.com/auth/drive.file"))return Response.json({error:"Drive file permission not granted"},{status:403});
  const token=await accessToken(connection,db);
  if(!token)return Response.json({error:"Drive session expired. Reconnect Google Drive."},{status:401});
  let folderId=connection.folder_id;
  if(!folderId){
    const folder=await googleFile(token,{name:"MoveTrack Assurance (personal drafts)",mimeType:"application/vnd.google-apps.folder",description:"User-owned demo form archives; not approved operational records."});
    if(!folder.id)throw new Error("DRIVE_WRITE_FAILED");
    folderId=folder.id;
    await db.prepare("UPDATE assurance_drive_connections SET folder_id=?,updated_at=? WHERE id=?").bind(folderId,new Date().toISOString(),connection.id).run();
  }
  const file=await googleFile(token,{
   name:body.id+".json",mimeType:"application/json",parents:[folderId],
   description:"Personal draft backup only. NOT an operational authorization."
  },JSON.stringify({record:body,archiveKind:"PERSONAL_DRAFT",archivedByUid:principal.uid,archivedAt:new Date().toISOString()}));
  if(!file.id)throw new Error("DRIVE_WRITE_FAILED");
  const id=crypto.randomUUID();
  await db.prepare(`INSERT INTO assurance_record_pointers
   (id,org_id,owner_node_id,site_id,kind,record_id,version,drive_connection_id,provider_file_id,visibility,created_at)
   VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(id,orgId,nodeId,body.siteId,"CHECKLIST",body.id,body.templateVersion,connection.id,file.id,"PRIVATE",new Date().toISOString()).run();
  return Response.json({archived:true,existing:false,referenceId:id,storage:"PERSONAL_GOOGLE_DRIVE",operationalApproval:false},{headers:{"Cache-Control":"no-store"}});
 }catch(error){
  if(error instanceof SyntaxError)return Response.json({error:"Malformed JSON"},{status:400});
  if(error instanceof Error&&error.message==="DRIVE_WRITE_FAILED")return Response.json({error:"Unable to save personal Drive archive."},{status:502});
  return serverError(error);
 }
}
