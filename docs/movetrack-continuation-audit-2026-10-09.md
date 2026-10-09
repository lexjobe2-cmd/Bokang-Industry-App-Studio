# MoveTrack continuation audit — 9 October 2026

Audited head: `8fdca737e4a24b891e9e7bff69142e5480c5baf7` on `feature/operational-assurance-on-fleet-foundation`. PR #4 is an open draft against `showcase/cloudflare-client-demos`; it contains substantial accumulated work. Latest pre-continuation CI: 37922243134, success. Cloudflare's production deployment at audit time was 8618c7b9-eb43-4d6f-8b5a-b018c24d0089; newer branch work had not yet been deployed.

## Findings and changes

| Phase | Existing implementation verified in code | Continuation |
| --- | --- | --- |
| A | Shared hamburger drawer, safe-area dock, onboarding, workflow graph | Dock now Home/Fleet/Forms/Analytics/Profile. Workspaces replace the long homepage while preserving mounted form, meeting and OCR state. Dashboard quick actions added; scenarios collapsed. Drawer uses reduced-motion-aware Framer Motion; keyboard reduces dock obstruction. |
| B | OrganizationPeopleComboBox, directory IDs, quick-entry dictionary, conditional renderer, autosave, risk gates | Shared QuickChoice/SmartMultiSelect/SearchableAssetPicker and RepeatableRowActions. Repeated columns render actual choices, booleans and date/number controls. Designer configures choice columns. Duplicate excludes acknowledgement, identity and safety evidence; movements preserve immutable row data. Picker supports selecting visible results and mobile keyboard focus trapping. |
| C | Native meeting workspace, staff/guest apologies, exclusive categories, actions, carry-forward | Meeting schema v4 adds directory minute taker, attendance status/time rows, department/job snapshots, notification status. Late arrival and left early count as attendance. Historical names retained independently of later directory edits. Duplicate manual guests and invalid statuses rejected. |
| D | PDF.js positioned text/AcroForms, Tesseract, local pixel control geometry, review/preview/publish, archived originals | Preserved existing compatible schema and human-review gates. PDF page canvas allocation bounded before rendering. Existing OCR/layout/publication tests rerun. OCR remains assistive and requires correction of uncertain labels/layout. |
| E | Company/person activity, trends, NO-GO, review queues, exports | Scoped meeting analytics: held/attended, attendance rate, apologies, outstanding/overdue owner-linked actions, department/month/top attendee breakdowns; site and month filters. Denominator only includes recorded people, not an inferred whole-company invitation list. |
| F | Professional page-aware PDF/DOCX, CSV/JSON, immutable template snapshots | New v4 rows use existing renderers; snapshot names stable after directory changes. New tests exercise actual PDF and editable DOCX generation and blank status. |

## Primary changed files

- `apps/web/components/products/MoveTrackAppShellNav.tsx`, `MoveTrackDemoLab.tsx`, `MoveTrackShowcase.tsx`
- `SmartFormInputs.tsx`, `RepeatableRowActions.tsx`, `OrganizationPeopleComboBox.tsx`
- `AssuranceFormsWorkspace.tsx`, `CustomFormBuilder.tsx`, `MeetingRegisterWorkspace.tsx`, `UserParticipationAnalytics.tsx`
- `packages/domain-data/src/meeting-register.ts`, `repeatable-register.ts`, package export mapping
- `apps/web/lib/form-exports.ts`, `paper-ocr.ts`
- `tests/adaptive-meeting-register.test.mjs`, `smart-input-components.test.mjs`, meeting version assertion; `.github/workflows/ci.yml`

## Benchmark sources

Microsoft modern Combo Box: https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/modern-controls/modern-control-combobox

Applied searchable single/multiple selection, metadata, explicit defaults and editable selected entries to existing local components. Radio patterns: https://learn.microsoft.com/power-apps/maker/canvas-apps/controls/modern-controls/modern-controls-radio-group

PDF.js API: https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib-PDFPageProxy.html ; browser OCR: https://tesseract.projectnaptha.com/

These are UX/library references, not external processing services. No authentication or backend added.

## Verification

Local TypeScript checks for standalone app, web app and domain-data; assurance schema validator; 86 regression tests including new component, attendance/action/snapshot and actual document-generation tests. Standalone production Vite build passes. Existing document fixture generation passes. Runtime and deployment evidence is recorded in the PR after upload verification.

Manual runtime path: Home → New meeting → directory chair/minute taker → multi-attendees → late/early statuses → staff apologies → notification/reason/notes → actions → switch Forms/Fleet and return → refresh → draft export. Analytics separates absent people and owner-linked overdue actions. OCR review still requires correcting uncertain source controls before publishing.

## Limits

All analytics and records are browser-local, not an organization-wide cross-device dataset. Signer selection and drawn marks remain unverified acknowledgements, never real permits or proof of competence. Existing historical v3 submissions remain unchanged. Main bundle warning remains (roughly 824 KB minified); PDF/DOCX/OCR dependencies are separate lazy-loaded chunks. Accuracy testing uses deterministic PDF/widget/bitmap fixtures; production scanned handwriting and complex table fidelity still need human review.

## Runtime correction after first deployment

Live native-PDF testing found printed glyphs (O/D/0) being proposed as radio circles. Added native text-glyph exclusion before proposing geometric controls, while preserving genuine controls outside text and blank writing rules. YES/NO/N/A printed labels now keep all three choices in the reconstructed decision field and preview. Regression tests cover both cases. Required booleans and critical decisions in repeating rows now use the standard safety evaluator rather than treating any non-empty primitive as completed.
