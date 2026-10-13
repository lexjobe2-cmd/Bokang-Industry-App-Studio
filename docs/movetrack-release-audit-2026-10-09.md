# MoveTrack release-readiness audit — 9 October 2026

Audited branch: feature/operational-assurance-on-fleet-foundation, starting at 8d81bfae25e38c56af41500f9716e315096611fb. PR #4 remains open and draft. This is a bounded audit, not certification that every possible workflow is defect-free.

## Reproduced defects and fixes

- Live Fleet allowed LV-014 / B 123 ABC to be added twice and retained the duplicate after refresh. Reject duplicate fleet numbers or registrations, normalizing case, whitespace and hyphens. Driver onboarding applies the same protection to licence/reference identifiers. Existing records are not deleted or merged.
- Vehicle/driver IDs used only the last six digits of a timestamp, which repeat every 1,000 seconds. New records now use UUIDs; old IDs and links remain intact.
- A grounding notice persisted into meetings, workforce and analytics after tab changes. Workspace changes now clear the transient notice.
- A syntactically valid backup containing fleet.v2=null passed parsing. Add structural guards for known record collections and draft maps, plus required string fields in fleet/driver records. Malformed collections are rejected before storage is changed. This is NOT complete domain validation for all nested imported fields.
- Empty designer showed question 1 / 0. It now shows 0 / 0.
- CI enumerated test files, which would omit the new regression file. CI now discovers tests/*.test.mjs.

## Verification

- Baseline: 105 tests passed. With five new regression cases: 110 tests passed.
- Both standalone and shared-web TypeScript projects passed.
- Standalone Vite build passed; main chunk remains about 686 kB minified / 212 kB gzip and produces a size warning.
- Assurance SQL schema validation passed (a future schema only; no database was connected).
- Existing report generation script produced draft PDF, blank PDF and editable Word samples. Tests also generate meeting/series PDF and Word outputs. This run did not visually inspect every generated page.
- Browser entry coverage: Home, Company, Control, Fleet, Drivers, Sites, Assignments, Jobs, Forms, Meetings, Paper, Release, Analytics, Workforce, Profile, Backups, Settings, Workflow library, Search and Driver app. Lazy forms, meetings and OCR were observed after loading.
- Live interactions: Fleet required-field rejection; duplicate reproduction; refresh persistence; missing expiry grounding and dispatch rejection; workforce search narrowing 14 people to one; meeting finalization rejection for missing agenda with return to the relevant step; separate apology/present counts; empty analytics; template search no-results state; empty designer; new JRA draft title retained after refresh.
- Existing meeting draft, apologies and suggested action were retained. No acknowledgement or approval was fabricated. No existing workspace was reset or cleared. The browser QA session contains a deliberately duplicated/grounded QA asset and a clearly labelled JRA draft from testing; these are confined to that browser profile.
- Drawer clicks issued while the animated drawer was opening did not always navigate in browser automation; retry after observing settled UI succeeded. No application navigation defect was established from that timing issue.

## Release blockers / follow-up

1. **Company isolation:** Fleet vehicles, drivers, assignments, policies and jobs use device-wide keys and lack company ownership fields. Forms/people have organization context, but fleet requires an explicit legacy-data migration and company-scoped access before real multi-company use.
2. **Authoritative identity and authorization:** local person selection and drawn acknowledgements remain unverified. Production permissions, reviewer identity and audit history must be enforced by the chosen service. No authentication or cloud storage was enabled here.
3. **Backup completeness and validation:** JSON excludes original scans in IndexedDB. Complete archive/restore needs both stores, checksums and per-record schema/migration validation. Existing guards do not validate all nested records or direct localStorage corruption.
4. **Concurrency and offline readiness:** synchronous browser writes are not multi-user conflict resolution. Test simultaneous tabs, reconnect/retry, duplicate submissions and storage exhaustion end-to-end before enabling remote sync. Standalone offline cold-start is not verified.
5. **Real-device matrix:** physical iPhone Safari and Android keyboard, camera, orientation and download behavior remain unverified. Earlier narrow iframe tests are layout evidence only.
6. **OCR/export corpus:** broader scanned and rotated photos, encrypted/malformed PDFs, low-memory cancellation and long repeated tables need browser and visual testing. No fresh scanned-document extraction or full signed release cycle was performed in this audit.
7. **Dispatch policy mapping:** assignment uses a free-text site and optional matched policy. Unknown site names need an explicit policy-selection rule before production; do not treat unmatched policy as reviewed site clearance.
8. **Performance/recovery:** reduce initial bundle and add a recoverable application error boundary before a controlled pilot.

## Additional product ideas (proposals, not implemented)

- Pre-shift readiness board: explain exactly which expired evidence, missing inspection or unresolved action blocks each job.
- Complete portable evidence packs: original scans, photos, records and template revisions together, with checksums and restore verification.
- Change-impact review: when a critical control/template changes, identify affected active jobs and require fresh acknowledgement without rewriting old records.
- Offline synchronization inbox: show pending uploads, failed attachments and conflicting edits for human resolution.
- Shared-device shift mode: explicit worker handover and local data privacy controls after real authentication is introduced.

Offline work-order inspections are a useful benchmark: https://learn.microsoft.com/en-us/dynamics365/field-service/inspections-overview . These ideas are tailored recommendations, not claims that external products provide every proposed behavior.
