import { NextRequest, NextResponse } from "next/server";
import { decryptTokenBundle, oauthCookieName } from "../../../../lib/oauth";

export async function GET(request: NextRequest) {
  const google = decryptTokenBundle(request.cookies.get(oauthCookieName("google"))?.value);
  const microsoft = decryptTokenBundle(request.cookies.get(oauthCookieName("microsoft"))?.value);

  return NextResponse.json({
    google: google ? { connected: true, accountLabel: google.accountLabel || "Google Workspace" } : { connected: false },
    microsoft: microsoft ? { connected: true, accountLabel: microsoft.accountLabel || "Microsoft 365" } : { connected: false },
  });
}
