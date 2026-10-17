import { NextRequest, NextResponse } from "next/server";
import {
  encryptTokenBundle,
  oauthCookieName,
  safeReturnTo,
  type OAuthProvider,
} from "../../../../../lib/oauth";

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

  const expectedState = request.cookies.get("studio_oauth_state")?.value;
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  if (!expectedState || !state || state !== expectedState || !code) {
    return NextResponse.json({ error: "OAuth state validation failed." }, { status: 400 });
  }

  const baseUrl = process.env.APP_BASE_URL || request.nextUrl.origin;
  const returnTo = safeReturnTo(request.cookies.get("studio_oauth_return")?.value || "/");
  let tokenResponse: Response;

  if (provider === "google") {
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/oauth/google/callback`;
    tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
    });
  } else {
    const tenant = process.env.MICROSOFT_TENANT_ID || "common";
    const redirectUri = process.env.MICROSOFT_REDIRECT_URI || `${baseUrl}/api/oauth/microsoft/callback`;
    tokenResponse = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID || "",
        client_secret: process.env.MICROSOFT_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
    });
  }

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: "OAuth token exchange failed." }, { status: 502 });
  }

  const tokens = await tokenResponse.json() as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  };

  let accountLabel: string | undefined;
  try {
    const profileUrl = provider === "google"
      ? "https://openidconnect.googleapis.com/v1/userinfo"
      : "https://graph.microsoft.com/v1.0/me?$select=displayName,mail,userPrincipalName";
    const profile = await fetch(profileUrl, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
      cache: "no-store",
    });
    if (profile.ok) {
      const body = await profile.json() as { email?: string; mail?: string; userPrincipalName?: string; displayName?: string };
      accountLabel = body.email || body.mail || body.userPrincipalName || body.displayName;
    }
  } catch {
    // Connection remains valid even if profile label lookup is unavailable.
  }

  const encrypted = encryptTokenBundle({
    provider,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : undefined,
    accountLabel,
    scope: tokens.scope,
  });

  const response = NextResponse.redirect(new URL(returnTo, baseUrl));
  const secure = request.nextUrl.protocol === "https:";
  response.cookies.set(oauthCookieName(provider), encrypted, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.delete("studio_oauth_state");
  response.cookies.delete("studio_oauth_return");
  return response;
}
