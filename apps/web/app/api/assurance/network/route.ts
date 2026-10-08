import { assuranceDb, dbUnavailable, provisionPersonalNode, requireFirebasePrincipal, serverError } from "../../../../lib/assurance-server";

export const dynamic="force-dynamic";
export async function GET(request:Request){
 try{
  const principal=await requireFirebasePrincipal(request);
  const db=await assuranceDb();
  if(!db)return dbUnavailable();
  const {orgId,nodeId}=await provisionPersonalNode(db,principal);
  const {results:nodes}=await db.prepare("SELECT id,org_id,kind,parent_id,label FROM assurance_nodes WHERE org_id=?").bind(orgId).all();
  const {results:connections}=await db.prepare("SELECT id,kind,account_label,status,folder_id,created_at,updated_at FROM assurance_drive_connections WHERE owner_node_id=? AND status<>'REVOKED'").bind(nodeId).all();
  const {results:records}=await db.prepare("SELECT id,kind,record_id,version,visibility,created_at FROM assurance_record_pointers WHERE owner_node_id=? ORDER BY created_at DESC LIMIT 100").bind(nodeId).all();
  return Response.json({orgId,nodeId,nodes,connections,records},{headers:{"Cache-Control":"no-store"}});
 }catch(error){return serverError(error);}
}
