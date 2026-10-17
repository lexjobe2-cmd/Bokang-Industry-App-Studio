import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export type OAuthProvider = "google" | "microsoft";

export type OAuthTokenBundle = {
  provider: OAuthProvider;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  accountLabel?: string;
  scope?: string;
};

function encryptionKey() {
  const secret = process.env.APP_ENCRYPTION_SECRET;
  if (!secret || secret.length < 24) {
    throw new Error("APP_ENCRYPTION_SECRET must be configured and at least 24 characters.");
  }
  return createHash("sha256").update(secret).digest();
}

export function encryptTokenBundle(bundle: OAuthTokenBundle) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(bundle), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptTokenBundle(value?: string): OAuthTokenBundle | null {
  if (!value) return null;
  try {
    const buffer = Buffer.from(value, "base64url");
    const iv = buffer.subarray(0, 12);
    const tag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
    decipher.setAuthTag(tag);
    return JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8")) as OAuthTokenBundle;
  } catch {
    return null;
  }
}

export function safeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export function oauthCookieName(provider: OAuthProvider) {
  return `studio_oauth_${provider}`;
}
