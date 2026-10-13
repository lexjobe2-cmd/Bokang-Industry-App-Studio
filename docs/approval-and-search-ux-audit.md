# MoveTrack UX, supervisor approvals and search audit — 9 October 2026

## Current release scope
Maintain the company-first homepage and original fleet/SHE systems. No Firebase, Google, Microsoft, server database, verified employee identity or paid signature/search service.

## Critical interactions audited and modified
| User action | Previous interaction | Current implementation | Safety boundary |
|---|---|---|---|
| JRA crew acknowledgement | Large inline signature pads/checkbox | One compact signed-state button per participant opens touch-safe modal tray | Local evidence only |
| JRA independent review | Inline full signing form | Signed reviewer ID and exact JRA record scope; tray before demo-reviewed state | Demo status cannot authorize work |
| Working-at-height and 20 specialized SHE checklists | No required supervisor signoff | Required selected reviewer plus drawn acknowledgement of the same job/site record in a reusable tray | High risk still REVIEW |
| Core JSA/JRA/handover/briefing forms | Typed acknowledgements | Published v2 templates with local reviewer signature | Historical v1 snapshots unchanged |
| Meeting chair & minute taker | Inline signature widgets | Compact tray; chair signature required for finalized minutes, minute-taker optional | Claimed identity only |
| Critical defect corrective-action closeout | Free-text resolved status | Corrective action + matched supervisor mark for *exact* incident and remedy before demo resolution | No equipment release |
| Independent equipment reinspection | Inspector name and checked boxes | Inspector signs inspection verdict and controls in tray | Independent inspection does not release equipment |
| Repair-to-prestart release | Supervisor typed name | Supervisor captures drawn mark; repair, separate reinspection and certificates still required | Returns to inspection due, never GO |
| Driver site authorizations/training flags | Immediate checkbox update | Stage changes; sign reviewed driver-access snapshot in tray before saving | Certificates not independently verified |
| Site policy safety rules | Immediate checkbox updates | Stage policy edits; supervisor signs exact safety-rule set in tray before applying | Does not replace site policy approval |

### UX changes
- **Progressive disclosure:** show a single compact 'Review & e-sign' trigger with confirmation state, hide drawing canvas in a modal tray until needed.
- **Mobile-first:** 44px targets; backdrop and close; top/side-safe responsive sheet; touch canvas; Escape/keyboard focus trap; no inline canvases causing vertical overflow.
- **Prevent stale signatures:** changing signed form questions, meeting content or JRA risk inputs clears or invalidates prior signatures. Snapshot scope binds the form to job, site and company.
- **Safer edits:** stage driver authorization and site-policy changes; no active policy change before supervisor review. Cancel/dismiss must not save unsigned alterations.
- **Findability:** company setup first; Overview, Safety & People, Fleet Operations and Documents & Settings are grouped. Search is available from homepage and workspace.
- **Paper-quality export:** PDF and Word preserve signature image plus signer details and explicit local/unverified warning.

### Functional workspace search
A reusable **vendor-independent** core `packages/domain-data/src/workspace-search.ts` registers arbitrary providers and ranks normalized token matches. Adapters `apps/web/lib/workspace-search.ts` build a fresh index from live browser storage instead of API-key/vendor-specific data or a limited keyword allowlist:
- Safety workflow recipes (all 21), standard templates and company-published custom templates;
- Completed company forms, JRA risks and hazards, employee directory and company profile;
- Fleet assets, drivers, pre-starts, incidents, defect descriptions, repair and reinspection evidence;
- Jobs, assignments, site rules and supervisor release records.

The `GlobalWorkspaceSearch` UI supports filters, search-by-type, keyboard navigation, suggested terms, zero-data states and result navigation into the existing workspace. Company-owned SHE submissions/directory are scoped to selected organization. Shared demo fleet data are expressly not a secure tenant boundary.

New providers (e.g. OCR extraction, external company storage, public safety guidance) can return the same `SearchCollection` contract and be merged with local results **without rewriting the ranking engine**. Introducing such remote sources later requires auth, consent, relevance ranking, rate limiting and cache control.

### UI next-stage recommendations, not implemented in this demo
- Verified identity, delegated supervisor authority and role-based access prior to production use;
- Form step progress persisted across devices, explicit review history diff, signed snapshot hashes and secure timestamp authority;
- Accessible native camera/file evidence and IndexedDB for sizeable media rather than localStorage;
- Full RTL/translation support, large datasets via virtualized lists, automated WCAG audits and color contrast tuning;
- Enterprise search connectors and optional background indexing, only once organizational tenant controls exist.

This work is **not a secure e-signature/permit-to-work system**. Recorded drawn marks and demo approvals lack trusted signer identity and immutable audit controls. Follow site procedures and competent-human authorization in real operations.
