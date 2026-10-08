import { assuranceDb, dbUnavailable, requireFirebasePrincipal, serverError } from "../../../../lib/assurance-server";
import { decryptTokenBundle } from "../../../../lib/oauth";
export const dynamic="force-dynamic";
type DriveRow = {id:string;account_label:string|null;kind:string;folder_id:string|null;created_at:string;encrypted_token:string};
export async function GET(request:Request){
 try{
  const principal=await requireFirebasePrincipal(request);
  const db=await assuranceDb();if(!db)return dbUnavailable();
  const {results}=await db.prepare("SELECT id,account_label,kind,folder_id,created_at FROM assurance_drive_connections WHERE owner_node_id=? AND status='CONNECTED'").bind("person:"+principal.uid).all();
  return Response.json({connections:results},{headers:{"Cache-Control":"no-store"}});
 }catch(error){return serverError(error);}
}
export async function DELETE(request:Request){
 try{
  const principal=await requireFirebasePrincipal(request);
  const db=await assuranceDb();if(!db)return dbUnavailable();
  const row=await db.prepare("SELECT id,account_label,kind,folder_id,created_at,encrypted_token FROM assurance_drive_connections WHERE owner_node_id=? AND status='CONNECTED' ORDER BY updated_at DESC LIMIT 1").bind("person:"+principal.uid).first<DriveRow>();
  if(!row)return Response.json({error:"No Drive connection"},{status:404});
  const bundle=decryptTokenBundle(row.encrypted_token);
  // Revoke on Google where possible, even if Google is unavailable disable server-side grant.
  if(bundle?.refreshToken) {
   await fetch("https://oauth2.googleapis.com/revoke",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({token:bundle.refreshToken}),cache:"no-store"}).catch(()=>null);
  }
  await db.prepare("UPDATE assurance_drive_connections SET status='REVOKED',encrypted_token='REVOKED',updated_at=? WHERE id=? AND owner_node_id=?")
   .bind(new Date().toISOString(),row.id,"person:"+principal.uid).run();
  return Response.json({disconnected:true,filesRetainedInUsersDrive:true});
 }catch(error){return serverError(error);}
}
