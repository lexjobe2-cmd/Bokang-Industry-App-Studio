import { createHash, randomBytes } from "node:crypto";
import { assuranceDb, dbUnavailable, provisionPersonalNode, requireFirebasePrincipal, serverError } from "../../../../../lib/assurance-server";
export const dynamic="force-dynamic";
export async function POST(request:Request){
 try{
  const principal=await requireFirebasePrincipal(request);
  const db=await assuranceDb();if(!db)return dbUnavailable();
  const clientId=process.env.GOOGLE_CLIENT_ID;
  const base=process.env.APP_BASE_URL;
  if(!clientId||!base||!process.env.GOOGLE_CLIENT_SECRET||(process.env.APP_ENCRYPTION_SECRET??"").length<24){
   return Response.json({error:"Drive OAuth is not configured"},{status:503});
  }
  const origin=new URL(base);
  if(origin.protocol!=="https:" && origin.hostname!=="localhost")return Response.json({error:"Secure HTTPS origin required"},{status:503});
  const {nodeId}=await provisionPersonalNode(db,principal);
  const state=randomBytes(24).toString("base64url");
  const verifier=randomBytes(32).toString("base64url");
  const challenge=createHash("sha256").update(verifier).digest("base64url");
  await db.prepare("INSERT INTO assurance_oauth_states (state,firebase_uid,owner_node_id,code_verifier,expires_at) VALUES (?,?,?,?,?)")
   .bind(state,principal.uid,nodeId,verifier,Date.now()+600000).run();
  const redirectUri=new URL("/api/assurance/drive/callback",origin).toString();
  const url=new URL("https://accounts.google.com/o/oauth2/v2/auth");
  for(const [k,v] of Object.entries({
   client_id:clientId,redirect_uri:redirectUri,response_type:"code",
   scope:"openid email profile https://www.googleapis.com/auth/drive.file",
   access_type:"offline",prompt:"consent",state,code_challenge:challenge,code_challenge_method:"S256"
  }))url.searchParams.set(k,v);
  const response=Response.json({authorizationUrl:url.toString()},{headers:{"Cache-Control":"no-store"}});
  response.headers.append("Set-Cookie",`assurance_drive_state=${state}; HttpOnly; SameSite=Lax; Path=/api/assurance/drive; Max-Age=600${origin.protocol==="https:"?"; Secure":""}`);
  return response;
 }catch(error){return serverError(error);}
}
