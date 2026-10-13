# Firebase Authentication + personal Google Drive node setup

**Implementation status:** code prepared; live infrastructure, Firebase sign-in, OAuth callback, Drive upload and Cloudflare Worker runtime are **not yet configured or exercised**. The operational interfaces remain labeled demo.

## 1. Configure Firebase
Create/select a Firebase project for MoveTrack Operational Assurance and enable **Authentication → Google**.
Configure the authorized sign-in domain for the actual Cloudflare hostname.
Set these NEXT_PUBLIC_* variables in the **Next.js build environment**:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Firebase web API keys identify the project but are not authorization secrets. Backend ID-token signature validation uses Google's Firebase SecureToken public keys, checks RS256 signature, audience, issuer, expiry and UID; bearer tokens are verified per request. Do not trust any `uid` or `role` supplied in a browser payload.

Reference: https://firebase.google.com/docs/auth/admin/verify-id-tokens

## 2. Configure a Google OAuth web client
Enable Google Drive API and configure the OAuth consent screen. App-specific Google Drive scopes for personal archival are:
`openid email profile https://www.googleapis.com/auth/drive.file`

Authorize the origin and exact callback of the actual deployed site:
```text
https://<YOUR-WORKER-DOMAIN>/api/assurance/drive/callback
```

Server secrets (not NEXT_PUBLIC):
```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APP_BASE_URL=https://<YOUR-WORKER-DOMAIN>
APP_ENCRYPTION_SECRET=<random-strong-secret-at-least-24-characters>
```
Use the Cloudflare Workers secret store for private values. Keep the encryption key backed up securely; rotation requires token migration or reconnect. Do not commit credentials.

The dedicated `/api/assurance/drive/start` route verifies Firebase ID token, creates a one-time state + PKCE challenge, and redirects through Google's consent flow. Callback validates the state cookie and database one-time state before exchanging the code. The narrow Drive grant is encrypted before storage in D1. Revoking marks it disabled and removes saved tokens.

The older shared Studio OAuth flow requests additional Gmail and Sheets scopes. It is **not** the Operational Assurance Drive connection endpoint.

Reference: https://developers.google.com/workspace/drive/api/guides/api-specific-auth

## 3. Provision D1 (do not copy unknown IDs)
From `apps/web`, configure an actual database in Cloudflare:

```bash
pnpm exec wrangler d1 create movetrack-assurance
```

Add the returned database ID to `apps/web/wrangler.jsonc` under `d1_databases` with `binding: "ASSURANCE_DB"`. Never invent a database ID.

After backing up/reviewing, apply:
```bash
pnpm exec wrangler d1 execute movetrack-assurance --remote --file=./migrations/0001_assurance_network.sql
```

Use Wrangler migrations/checkpoints and a production deployment plan before future schema changes. The initial schema defines independent person nodes, personal/organization namespaces, memberships, Drive grants, record references, and audit events.

## 4. Verify configuration and user workflows
1. `GET /api/assurance/health` should report the D1 binding and Firebase project configured.
2. Sign into **Drive network** from the MoveTrack manager route via Firebase/Google.
3. Confirm `GET /api/assurance/network` returns only the current user's personal namespace.
4. Click **Connect Google Drive**. Google consent must request only the dedicated narrow scope.
5. After callback, verify a connected node appears in the registry; backend stores encrypted token, never exposes it in API output.
6. In **SHE forms**, submit a demo form then click **Save to my Drive** under submissions. This creates an app folder and a private JSON copy in the user's Drive and registers a pointer centrally.
7. Confirm a different Firebase UID cannot list or archive to the first user's personal node.
8. Revoke via the **Drive network** screen and ensure the backend denies further writes.

**WARNING:** the archived JSON is merely a user's own draft backup. It is not a verified safety record and cannot itself issue a GO, release an asset, sign a JRA or approve a worker.

## 5. Before live industrial use
- Implement server-side authorization and approval for manager/driver/operator routes, not just demo form identity.
- Organizations must explicitly invite employees and authorize site roles; organization shared Drives need provider ACL checks.
- Real safety records need append-only canonical submissions, immutable template versions, evidence hashes, authenticated signatures, independent approvals and server-owned GO/NO-GO transactions.
- D1 connection graph and Google file IDs are **not** a replacement for actual Google ACL permissions.
- For poor connectivity add IndexedDB outbox with idempotency and server acknowledgements, not just localStorage.
- Enforce upload quotas, tenant separation, retention/deletion rules, revocation and monitoring.
- Verify Google OAuth and Cloudflare behavior in production, including token renewal/revocation, scope errors, CSRF, credentials expiry, worker restarts, and denied permissions.
