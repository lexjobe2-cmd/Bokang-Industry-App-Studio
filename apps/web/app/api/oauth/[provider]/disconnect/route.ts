import { NextRequest, NextResponse } from "next/server";
import { oauthCookieName, type OAuthProvider } from "../../../../../lib/oauth";

function providerFrom(value: string): OAuthProvider | null {
  return value === "google" || value === "microsoft" ? value : null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params;
  const provider = providerFrom(rawProvider);
  if (!provider) return NextResponse.json({ error: "Unsupported OAuth provider." }, { status: 404 });

  const response = NextResponse.json({ disconnected: true });
  response.cookies.delete(oauthCookieName(provider));
  return response;
}
