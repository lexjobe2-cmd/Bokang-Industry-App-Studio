import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { safeReturnTo, type OAuthProvider } from "../../../../../lib/oauth";

function providerFrom(value: string): OAuthProvider | null {
  return value === "google" || value === "microsoft" ? value : null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params;
  const provider = providerFrom(rawProvider);
  if (!provider) return NextResponse.json({ error: "Unsupported OAuth provider." }, { status: 404 });

  const state = randomUUID();
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"));
  const baseUrl = process.env.APP_BASE_URL || request.nextUrl.origin;

  let authorizationUrl: URL;

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/oauth/google/callback`;
    if (!clientId) return NextResponse.json({ error: "Google OAuth is not configured." }, { status: 503 });

    authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("access_type", "offline");
    authorizationUrl.searchParams.set("prompt", "consent");
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set(
      "scope",
      [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/spreadsheets",
      ].join(" ")
    );
  } else {
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const tenant = process.env.MICROSOFT_TENANT_ID || "common";
    const redirectUri = process.env.MICROSOFT_REDIRECT_URI || `${baseUrl}/api/oauth/microsoft/callback`;
    if (!clientId) return NextResponse.json({ error: "Microsoft OAuth is not configured." }, { status: 503 });

    authorizationUrl = new URL(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`);
    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("response_mode", "query");
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set(
      "scope",
      ["openid", "profile", "email", "offline_access", "User.Read", "Files.ReadWrite", "Mail.Send"].join(" ")
    );
  }

  const response = NextResponse.redirect(authorizationUrl);
  const secure = request.nextUrl.protocol === "https:";
  response.cookies.set("studio_oauth_state", state, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 600 });
  response.cookies.set("studio_oauth_return", returnTo, { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 600 });
  return response;
}
