import { assuranceDb } from "../../../../lib/assurance-server";
export const dynamic="force-dynamic";
export async function GET(){
 const configured=Boolean(await assuranceDb());
 return Response.json({registryConfigured:configured,mode:configured?"D1":"unconfigured",firebaseProjectConfigured:Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)},{headers:{"Cache-Control":"no-store"}});
}
