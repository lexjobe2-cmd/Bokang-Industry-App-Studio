# Workspace responsiveness audit — 9 October 2026

## Scope and evidence

Base commit: `82552d745970d2af74d4075770c8da1e0f59f2e7`.
Candidate preview: `0665290d-4bb2-404c-88cb-ea87c11aeeed`.
Raw browser measurements: [responsive-results-2026-10-09.json](responsive-results-2026-10-09.json).

The reported Search defect was reproduced before editing: category text was wider than its flex-shrunk button (Organizations text about 87 px, button content about 26 px at the narrowest test width). Page width alone did not detect this. The custom designer's repeat-column name input also collapsed to about 26 px.

The improved `tests/ui/mobile-audit.html` now measures page/control bounds, button content wider than its container, and text/date inputs narrower than 100 px. These are diagnostic checks, not a complete accessibility or visual test. The harness is preview-only and is excluded from the permanent deployment.

## Fixes

- Search categories wrap as whole, non-shrinking buttons with readable labels.
- Custom designer repeat-column settings use a wrapping grid, labelled name/type fields and a usable remove target. The name input measured 191 px after the change at the narrowest width.
- Paper reconstruction repeat-column name and remove controls stack on small screens.
- Fleet date labels sit above their inputs instead of being squeezed beside them.
- Shared mobile buttons have a 44 px minimum width as well as height.

Changed product files: `GlobalWorkspaceSearch.tsx`, `CustomFormBuilder.tsx`, `PaperToDigitalWorkspace.tsx`, `MoveTrackShowcase.tsx`, `MoveTrackThemeStyles.tsx` under `apps/web/components/products/`. No storage schema, record, template revision, signature or safety decision logic changed.

## Entry-screen matrix

Each row was loaded through the UI and measured at frame widths 320, 390, 768 and 1280 px. Destination-specific visible landmarks were awaited before measuring. The actual content viewport can be 15 px narrower due to the desktop browser scrollbar; the raw results record this.

| Workspace | 320 | 390 | 768 | 1280 |
|---|---|---|---|---|
| Home | Pass | Pass | Pass | Pass |
| Company | Pass | Pass | Pass | Pass |
| Control center | Pass | Pass | Pass | Pass |
| Fleet | Pass | Pass | Pass | Pass |
| Drivers | Pass | Pass | Pass | Pass |
| Sites and policies | Pass | Pass | Pass | Pass |
| Assignments | Pass | Pass | Pass | Pass |
| Jobs | Pass | Pass | Pass | Pass |
| Search | Pass | Pass | Pass | Pass |
| Workflow library | Pass | Pass | Pass | Pass |
| Forms | Pass | Pass | Pass | Pass |
| Meetings | Pass | Pass | Pass | Pass |
| Paper to digital | Pass | Pass | Pass | Pass |
| Repair and release | Pass | Pass | Pass | Pass |
| Analytics | Pass | Pass | Pass | Pass |
| Workforce | Pass | Pass | Pass | Pass |
| Profile | Pass | Pass | Pass | Pass |
| Backups | Pass | Pass | Pass | Pass |
| Settings | Pass | Pass | Pass | Pass |
| Driver app | Pass | Pass | Pass | Pass |

Pass means no findings from the three geometry probes in that state. It does not mean all interactions or arbitrary data in that workspace have been tested.

## Expanded states

27 additional measurements passed (mostly 320 px; Search category confirmation at 390):

- Designer repeat-column choices, properties, preview/publish and templates.
- Heights form first scope question and critical PASS/FAIL/N/A question.
- Meeting apology picker open, fourteen selected apologies, minutes, added action row, review and signature dialog. Review showed 0 present and 14 absent/apologies. No acknowledgement was drawn or meeting finalized.
- Settings privacy, terms, FAQ and support; navigation drawer.
- Company details, branding, fourteen-person directory and review steps, without saving changes.
- Analytics meeting attendance and records/export views with an empty recorded dataset.
- Search wrapped category controls.
- Paper reconstruction of the existing fictional inspection PDF, a manually remapped repeat column, generated UI preview and save/publish view. Publishing was not attempted; unresolved source-review issues remained visible.

## Build and test verification

- `node --experimental-strip-types --test tests/*.test.mjs`: 110 passed, 0 failed.
- TypeScript checks for standalone assurance demo and web app passed.
- Standalone Vite build passed. Existing large-chunk warning remains (main bundle approximately 686 kB before gzip).
- `git diff --check` passed.

## Limits and remaining coverage

These are Chromium iframe measurements of the actual built app, not physical iOS Safari/Android tests. Safe-area hardware, browser zoom, virtual keyboard occlusion, orientation changes, large user datasets and every form/template state were not exhaustively verified. Existing unit/domain/export tests ran, but this pass did not visually re-render every PDF/Word export. Cropped screenshot capture timed out in the cloud browser; numerical DOM measurements must not be presented as screenshot proof. The permanent release should not be described as universally responsive or production certified on this evidence alone.
