# MoveTrack AI — Approval and Search UI Audit (October 2026)

## Implementation audit
Reviewed the existing `MoveTrackDemoLab`, `MoveTrackShowcase`, `MoveTrackWorkspaceNav`, `AssuranceFormsWorkspace`, `JraWorkspace`, `FleetReleaseWorkspace`, `MeetingRegisterWorkspace`, reusable signature capture, search index/provider adapters, and mobile theme styles. Changes extend the existing frontend; no Firebase, Microsoft sign-in, paid search SDK or server database is introduced.

### Approval & verification pathways
| Workflow | Approval/verification | Now |
| --- | --- | --- |
| Twenty-one specialist SHE workflows, including Work at Heights | Named reviewing supervisor | Mandatory drawn review-signature field tied to reviewer ID, record site and job scope |
| Five supervised core forms: meeting register, toolbox brief, JSA, JRA checklist, shift handover | Supervisor acknowledgement | Published v2 form includes a supervisor-person field and mandatory signature tray |
| Seven optional custom-form recipes (permit to work, lifting, LOTO, meetings, fatigue, incident, handover) | Responsible reviewer | Form designer recipes now provide independent reviewer sign-off fields |
| JRA job studio | Crew acknowledgements; independent reviewer | Each person signs their own local acknowledgement; reviewer sign-off must match named reviewer, exact JRA scope and review intent |
| Grounded fleet repair / reinspection / release | Inspector and independent approving supervisor | Existing dedicated signature trays retained with evidence/context gating |
| Fleet control incident closeout | Supervisor verifies corrective action | Existing tray retained with context-specific acknowledgement |
| Driver authorizations and site-policy modifications | Independent supervisor review | Existing tray retained, invalidated when draft changes |
| Meeting minutes / attendance | Chairperson, minute-taker acknowledgements | Existing signature trays retained, with recorded local evidence |

**Safety limitation:** These are *local drawn electronic signature marks*, **NOT verified identities or legally authenticated digital signatures**. The app cannot issue a real permit or movement authorization. Future production requires verified enterprise identity, role permissions, server-side authorization, tamper-resistant audit logs, independent reviews and jurisdiction-specific legal checks. Do not represent demo labels as formal safety approvals.

### Search audit & changes
**Before:** Multiple search widgets were visible in one manager workspace and used independent ranking/index implementations. One was capped to an early 25/30 results, leading to a false impression that later records were unavailable.

**Now:** Search runs through a shared, dependency-free provider/document interface (`SearchProvider<T>`, `SearchDocument`, `workspaceIndex`, `searchDocuments`). Home search adapts its existing source-specific index to the same generic engine. A single full search box remains per manager workspace. Added:
- Live categories and source facets based on whatever is registered, rather than a frozen fixed keyword or category list;
- Paging / “Show more” for matches; selected category and source filters;
- Case-, punctuation- and accent-insensitive token search with lightweight one-character typo tolerance on longer words;
- Provider registrations for inspection decisions, repair evidence and supervisor fleet releases in addition to people, form templates, completed forms, assets, incidents, sites, pre-starts, jobs, assignments and JRA;
- Semantic navigation from results to relevant workspaces/forms, preserving browser-local record scope.
- Unit tests demonstrating dynamic indexing without vendor dependencies or hard-coded site/job terminology.

**Boundaries:** All results are from the current browser's data plus local template catalogues. This is not internet-wide or company server search. Real tenant separation and permissions require authenticated accounts/backend; locally selected company scoping is a demonstration only.

### Visual / UX audit improvements applied
1. Reuse bottom-sheet signature trays instead of showing signature canvases inline throughout forms; the capture view has an explicit review purpose, accessible dialog, Escape key close, focus trap and touch-friendly pad.
2. Added safe-area-aware mobile navigation to Home, Search, SHE forms and Analytics with minimum 44px targets. Desktop navigation remains unchanged.
3. Removed a duplicate manager search panel and duplicate scroll landmark; preserved the homepage search and separate manager search.
4. Kept forms navigable by work order/site; changing any reviewer-associated content or site/job scope makes prior signatures inapplicable.
5. Preserved immutable submitted form versions and local export of visual signature evidence, with clear unauthenticated status labels.
6. Retained responsive card grids and reduced-motion behavior.

### Next production hardening (not implemented)
- Authenticated workforce and tenant administrators; verified supervisor entitlements and separation of duties.
- Server-authoritative e-signature workflow using document hashes, nonce/challenge, verified clock, signature revocation/history and audit trails.
- A proper organization search backend + delegated provider connectors with per-user access controls and incremental indexing, when company APIs/storage are connected.
- Screen-reader, mobile landscape and low-connectivity acceptance tests with real users; WCAG accessibility audit.
- Remove remaining legacy inline styling in favor of consistent reusable design tokens.

### Final risk-revision safeguard
- When the JRA job scope, site, method, risk controls, permits or tasks change after local signing, earlier crew and independent reviewer marks are revoked from the active working revision. Each participant must acknowledge the amended work before demo review can proceed. This is tested against an immutable pre-change object.
- Approval/status gates reject missing signatures, mismatched reviewer IDs, wrong signing intent and stale job/site scope. Signatures cannot be used as a substitute for actual safety verification or enterprise authentication.
