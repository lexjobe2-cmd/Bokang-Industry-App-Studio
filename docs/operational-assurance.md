# MoveTrack Operational Assurance — Architecture, benchmark and implementation

> Status (2026-10-08): experimental demo branch only. NO production safety authorization, cloud storage synchronization, or server-verified records.

## Verified source of truth
- Base branch: `showcase/cloudflare-client-demos`, not old `main`. PR #3 contains existing fleet, operators, assignments, pre-start, grounding, local persistence and separate customer-facing logistics pages.
- The new operational forms are embedded as an **SHE forms** tab inside existing MoveTrack manager navigation.
- Existing driver flow, `evaluatePrestart`, `MOVE_TRACK_KEYS` and site policies are preserved.
- `evaluatePrestart` now fails closed for absent critical answers and already-grounded vehicles.

## Product benchmark patterns
- SafetyCulture: template editor with required/conditional questions, annotations/media and actions; published template versions change new inspections only. https://help.safetyculture.com/en-US/001104/
- HammerTech: toolbox talks, employee sign-offs, pre-task plans with JHAs, permits, worker and equipment records. https://www.hammertech.com/en-us/platform/pre-task-plans and https://www.hammertech.com/en-us/platform/safety-meetings
- SiteDocs: offline signing, later synchronization, document accessibility. https://www.sitedocs.com/features/
- GoCanvas: conditional screens, configurable mobile forms, offline completion. https://help.gocanvas.com/hc/en-us/articles/33098759625623-Screen-Conditions-in-the-Builder

## Phase 2 foundation committed
- `packages/domain-data/src/assurance-forms.ts`: typed template/question schema; versioned snapshot submissions; required checks, critical pass/fail/NA, risk review, evidence guard, repeatable step groups, conditional display, progress.
- Starter forms: fleet pre-start, SHE meeting register, toolbox brief, JSA, JRA, shift handover.
- `apps/web/components/products/AssuranceFormsWorkspace.tsx`: form library, section runner, PASS/FAIL/NA, repeatable groups, risk input, per-template browser draft state, local demo submission records and pending sync indication.
- Critical NO-GO from linked demo fleet checklist also updates shared fleet/assignment state and opens an incident/defect visible in existing manager & driver modules.
- Motion transitions are reduced/disabled under OS reduced-motion preferences.
- Existing browser-local and non-cryptographically protected records are never accepted as trusted operational audit records.

## Firebase identity
- `apps/web/lib/firebase-assurance.ts` initializes Firebase web Auth only when NEXT_PUBLIC_FIREBASE_* configuration exists.
- Google sign-in through Firebase is identity only; it **does not** grant Google Drive file permission.
- Fields require Firebase sign-in before submitted **when configured**; unconfigured builds remain clearly labeled local DEMO.
- Server must verify the Firebase ID token and authorize organization, site, task and role before any write or status transition.
- Google OAuth scopes for document storage must be separately requested with informed consent; use `drive.file` by default.
- The existing shared Google OAuth workflow currently bundles extra Gmail and Sheets scopes and stores encrypted OAuth data in cookies without verified Firebase UID binding. Do **not** reuse it for production cross-user storage until replaced with UID-bound server-side token vault and least-privilege scopes.

## Centralized Drive connection graph — intended model
Firebase user -> verified Person node -> authorized Org/Site/Team membership -> selected personal or organization shared Drive node -> record/evidence pointer.

Data model: `packages/integrations/src/drive-network.ts`
- Node: PERSON / SITE / TEAM / ORGANIZATION
- Membership: central permissions approved by org, site-scoped roles
- DriveConnectionNode: Google subject, owner node, consent scopes, revocation/sync status
- DriveRecordPointer: record ID, site, owner, storage node, file ID, version, visibility and optional hash

**Central means centrally indexed, not centrally readable.** Cloudflare D1 or a customer-approved registry should store graph edges, metadata and audit events; customer documents stay on authorized Drive nodes. Access to content must check BOTH application authorization and Google Drive sharing permissions. Tokens remain encrypted at rest on a trusted backend; never browser localStorage, downloadable JSON or Drive record metadata.

### Storage routing
1. User logs in with Firebase, verified server-side.
2. User explicitly selects **Connect Google Drive**, grants narrow `drive.file` scope and chooses app-created folder / picked files.
3. Backend binds consented OAuth grant to verified Firebase uid and Drive account subject, stores encrypted refresh token with revocation controls.
4. Organization admin authorizes membership and whether a shared Drive folder is available.
5. Submitted records are written to designated Drive (personal or organization), with immutable version ID and provider file pointer registered centrally.
6. Reviewers see only data allowed by site/organization membership AND underlying provider ACL.
7. Revocation disconnects node and blocks future reads/writes; audit references survive subject to retention and privacy policy.

Drive API scope docs: https://developers.google.com/workspace/drive/api/guides/api-specific-auth
Google Drive permissions: https://developers.google.com/workspace/drive/api/guides/manage-sharing

## Production blockers, ordered
1. Stable version/build validation + tests.
2. Firebase login rollout to driver/supervisor routes; server-token verification with token/session lifecycle.
3. Real organization invitations/memberships and role policy; no frontend role trust.
4. D1 schema/migrations, transaction-based authorization, append-only audit and release workflow.
5. Server-owned OAuth 2.0 PKCE/state/UID-bound connection, least-privilege Drive grant and key-management/token vault.
6. Offline IndexedDB draft queue with idempotency keys, conflict/version handling and visible sync failures (never mark a local safety record SYNCED until server ack).
7. Evidence uploads with checksums/metadata/retention and approval signatures.
8. Replace demo-owned local release buttons with authenticated maintenance verification + separate supervisor release and full reinspection.
9. Role/site scoped template publish/version/retire workflow. No historical edits.
10. E2E mobile and desktop GO/NO-GO, replay/conflict, offline, accessibility tests, Cloudflare deployment validation.

## No accidental production authorization
The demo runner's `COMPLETE` only means form required inputs were provided. It does not authorize equipment use. A NO_GO record in the demo updates local fleet state so managers can see the workflow; only a trusted backend can make this a legitimate enforceable lock. Do not use the demo app as a live safety-control system.
