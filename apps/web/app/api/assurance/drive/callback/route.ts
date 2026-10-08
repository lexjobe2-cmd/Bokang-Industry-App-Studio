import { NextResponse } from "next/server";
import { assuranceDb, dbUnavailable, serverError } from "../../../../../lib/assurance-server";
import { encryptTokenBundle } from "../../../../../lib/oauth";
export const dynamic="force-dynamic";
type StateRow = {state:string;firebase_uid:string;owner_node_id:string;code_verifier:string;expires_at:number};
type TokenBody = {access_token?:string;refresh_token?:string;expires_in?:number;scope?:string};
export async function GET(request:Request){
 const origin=process.env.APP_BASE_URL;
 if(!origin)return Response.json({error:"APP_BASE_URL not configured"},{status:503});
 const cookies=request.headers.get("cookie")??"";
 const cookieState=cookies.split(";").map(c=>c.trim()).find(c=>c.startsWith("assurance_drive_state="))?.slice("assurance_drive_state=".length);
 const url=new URL(request.url);
 const state=url.searchParams.get("state");
 const code=url.searchParams.get("code");
 if(!cookieState||!state||cookieState!==state||!code)return Response.json({error:"Invalid OAuth state"},{status:400});
 const db=await assuranceDb();if(!db)return dbUnavailable();
 try{
  const saved=await db.prepare("SELECT state,firebase_uid,owner_node_id,code_verifier,expires_at FROM assurance_oauth_states WHERE state=?").bind(state).first<StateRow>();
  if(!saved||saved.expires_at<Date.now())return Response.json({error:"Expired OAuth state"},{status:400});
  // Prevent replay: single-use state removed before token exchange.
  await db.prepare("DELETE FROM assurance_oauth_states WHERE state=?").bind(state).run();
  const tokenResponse=await fetch("https://oauth2.googleapis.com/token",{
   method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},cache:"no-store",
   body:new URLSearchParams({
    code,client_id:process.env.GOOGLE_CLIENT_ID??"",client_secret:process.env.GOOGLE_CLIENT_SECRET??"",
    redirect_uri:new URL("/api/assurance/drive/callback",origin).toString(),
    grant_type:"authorization_code",code_verifier:saved.code_verifier
   })
  });
  if(!tokenResponse.ok)return Response.json({error:"Drive consent exchange failed"},{status:502});
  const tokens=await tokenResponse.json() as TokenBody;
  if(!tokens.access_token||!tokens.refresh_token)return Response.json({error:"A persistent Drive grant was not returned; reconnect and grant consent"},{status:409});
  if(!tokens.scope?.split(" ").includes("https://www.googleapis.com/auth/drive.file"))return Response.json({error:"Required narrow Drive file scope was not granted"},{status:403});
  const info=await fetch("https://openidconnect.googleapis.com/v1/userinfo",{headers:{Authorization:"Bearer "+tokens.access_token},cache:"no-store"});
  if(!info.ok)return Response.json({error:"Drive account identity lookup failed"},{status:502});
  const profile=await info.json() as {sub?:string;email?:string};
  if(!profile.sub)return Response.json({error:"Drive account identity missing"},{status:502});
  const encrypted=encryptTokenBundle({
   provider:"google",accessToken:tokens.access_token,refreshToken:tokens.refresh_token,
   expiresAt:tokens.expires_in?Date.now()+tokens.expires_in*1000:undefined,
   accountLabel:profile.email,scope:tokens.scope
  });
  const orgId="personal:"+saved.firebase_uid;
  const now=new Date().toISOString();
  await db.prepare(`INSERT INTO assurance_drive_connections
    (id,owner_node_id,org_id,google_subject,account_label,kind,scope,encrypted_token,status,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(owner_node_id,google_subject,kind)
    DO UPDATE SET account_label=excluded.account_label, scope=excluded.scope,
      encrypted_token=excluded.encrypted_token,status='CONNECTED',updated_at=excluded.updated_at`)
   .bind(crypto.randomUUID(),saved.owner_node_id,orgId,profile.sub,profile.email??null,
    "PERSONAL_GOOGLE_DRIVE",tokens.scope??"https://www.googleapis.com/auth/drive.file",encrypted,"CONNECTED",now,now).run();
  const response=NextResponse.redirect(new URL("/products/move-track?drive=connected",origin),303);
  response.cookies.set("assurance_drive_state","",{httpOnly:true,sameSite:"lax",path:"/api/assurance/drive",maxAge:0,secure:new URL(origin).protocol==="https:"});
  return response;
 }catch(error){return serverError(error);}
}
