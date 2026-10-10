# MoveTrack AI — Paper → Digital OCR and Dedicated Meeting Registers

Continuation of the existing frontend-only Fleet + SHE workspace. Source: `apps/web/components/products/PaperToDigitalWorkspace.tsx`, `MeetingRegisterWorkspace.tsx`.

## First entry point
The MoveTrack homepage shows **Bring your existing documents. Start recording meetings** immediately beneath company onboarding. There are one-tap quick launches for:
1. Scan a paper checklist (Paper → Digital OCR)
2. Meeting registers & minutes
3. All SHE forms & JRA

All three are also present as distinct tabs in the existing MoveTrack manager. Existing fleet, repairs, job assignments, worker analytics, JRA studio, saved templates, and local persistence are preserved.

## Paper → Digital (no paid OCR API)
1. Select one JPG/PNG/WebP or PDF paper checklist/register (max 12 MB, up to five PDF pages).
2. The app extracts digital PDF text directly where possible. Scanned PDFs/images use **Tesseract.js** English OCR in the browser and **pdfjs-dist** to render scanned PDF pages. Initial language assets may need to download and are not guaranteed offline on a new device.
3. The app displays the source alongside proposed headings and checklist fields, flags low-confidence OCR, and allows manual editing of raw text, headings, names, question types, required/critical checks and extra questions.
4. The corrected structure becomes a draft or published *company-branded* custom form, using the same schema, live form library and form export engine as MoveTrack. Published versions support blank/draft/filled PDF, editable Word, CSV and JSON.
5. **Export unchanged source PDF** converts a photo to a full-page PDF or downloads an original PDF without rebuilding it. This is different from the *recreated company document*: OCR does not guarantee exact original positioning, visual layout, table columns, or handwriting recognition.
6. Original files are locally archived in browser IndexedDB for later comparison and can be accessed after refresh, under the same local company. OCR text/template remains in localStorage. No scanned files are uploaded to the app server.
7. The **Local data** Clear workspace action removes IndexedDB scan originals as well as localStorage records. JSON backups include *form structure and extracted text*, but **not** binary original scans. To preserve originals outside this device, separately export source PDFs.

A human must review text and content before publishing. In particular, original approvals, signatures, permit numbers, dates, employee IDs, and legal critical controls are not verified by OCR.

## Native Meeting Registers (not buried in the form library)
The **Meeting registers** tab offers:
- SHE committee meetings, toolbox talks, pre-shift briefings, contractor coordination, incident reviews, management SHE review, JSA/JRA team briefing and emergency readiness.
- Meeting title/type, date, time, work site, reference, chairperson, minute taker and submitting facilitator.
- Company staff directory attendance with exact employee IDs feeding each person's participation analytics.
- Repeatable external contractor / guest attendees, department, role, apologies and demonstration acknowledgments.
- Agenda, minutes, decisions/resolutions, safety moments, pending issues and next meeting.
- Repeatable corrective action items: action, accountable owner, due date, status (Open/In progress/Closed).
- Autosaved local draft, saved submitted meeting registers with immutable snapshots, searchable through the existing company/user Analytics, PDF/Word/CSV/JSON exports for both blank and filled meeting registers.

Native meetings use the existing `FormSubmission` schema so they appear alongside previous meeting records and other SHE participation data. No signature claims or actual legal authorization.

## Privacy and limitations
- The prototype has no account verification, server storage, audited electronic signatures, enterprise retention or true multi-device synchronization.
- Demo company and employee records are public to anyone who can access the same browser profile. Do not use for sensitive real production documents or authentic approvals.
- Paper OCR is heuristic and only proposes candidate questions. Layout preservation requires manual review. A pixel-identical PDF is only the unchanged scanned source, not a newly editable form.
- OCR results are usually better with sharp, evenly lit, upright, high-resolution paper. Scanned PDFs with many pages should be split.
- Original IndexedDB scans are not part of the versioned JSON backup, even though the form structure is.
- Source pages truncated at 5 are explicitly flagged. No inference of missing pages or invented compliance requirements.

## Verification
CI runs `tests/paper-meeting.test.mjs` in addition to the previous operational assurance, persistence, analytics and export tests; the production frontend Vite build includes both workspaces.
