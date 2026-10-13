# MoveTrack IA, open-source signatures, privacy and settings (2026-10-09)

## Audit of the existing application (do not rebuild)
Inspected the existing standalone Vite demo backed by reusable App Studio React modules:
- `MoveTrackDemoLab.tsx`: current company-first homepage, OCR/meeting quick start, 21 linked safety workflows, fleet scenarios and aggregate tiles.
- `MoveTrackShowcase.tsx`: existing fleet, drivers, sites, jobs, assignments, repair and release, SHE forms, meetings, paper OCR, participation analytics and local backups.
- `AssuranceFormsWorkspace.tsx`: in-browser forms, versioned templates, custom designer, saved checklists and JRA.
- `MeetingRegisterWorkspace.tsx`: meeting registers, participant lists, minutes and action tracking.
- `JraWorkspace.tsx`: team selection, hazard controls, initial and residual 5x5 risks and independent reviewer.
- `form-exports.ts`, `document-pdf.ts`, `document-word.ts`: offline PDF/DOCX/CSV/JSON exports.
- `@bokang/persistence`: local synchronous write-through and device-level JSON backup.

**Problem:** The previous workspace used one flat tab row mixing operations, safety, analytics, file ingestion and backup settings. Users could not reliably distinguish company setup, daily operations, assurance evidence and device settings. Dark mode and support/legal materials were absent. Form signature fields were typed-name placeholders; JRA team acknowledgements were checkbox-only.

## Updated information architecture

```
MoveTrack AI homepage (company-first)
 ├─ Company setup / active company
 ├─ What would you like to do? (direct launcher)
 ├─ Quick-start document/meeting intake
 ├─ Searchable 21-workflow safety graph
 └─ Workspace:
    ├─ Overview
    │  ├─ Control center
    │  └─ Analytics (personal and company)
    ├─ Safety & People
    │  ├─ SHE forms / JRA / signatures
    │  ├─ Meeting registers, minutes, attendance
    │  └─ Paper-to-digital OCR
    ├─ Fleet operations
    │  ├─ Assets and vehicle inspections
    │  ├─ Drivers
    │  ├─ Site policies
    │  ├─ Assignments
    │  ├─ Jobs and work orders
    │  └─ Repairs and release
    └─ Documents & settings
       ├─ Local data / backup and restore
       └─ Settings
          ├─ Light / dark appearance
          ├─ Help / customer support
          ├─ Searchable FAQ
          ├─ Privacy notice
          └─ Terms of use
```

The navigation does not delete/migrate local business records. Settings live on the original demo site and are reachable from the homepage.

## Free signing library assessment

| Resource | Capability | Decision |
|---|---|---|
| [szimek/signature_pad](https://github.com/szimek/signature_pad) | HTML canvas strokes, mobile touch/mouse, PNG and SVG, MIT licence | **Adopted** in reusable `SignatureCapture` |
| [drvillo/react-browser-e-signing](https://github.com/drvillo/react-browser-e-signing) | React PDF form overlay, placing fields in uploaded PDFs, pdf-lib | Future module if interactive signing of existing imported PDF files is requested. Avoid adding a whole PDF editor to everyday form entry. |
| [pdf-lib](https://github.com/Hopding/pdf-lib) | Browser PDF modification and inserting text/images | Future paper source signature overlay; current generated reports use existing jsPDF and docx exports |
| Existing `jsPDF` / `docx` | Embed captured PNGs in generated reports | **Reused** to preserve existing export system |

Version used: `signature_pad ^5.1.4`. Runs entirely in the user's browser without an external paid signature service.

## Signing sequence in the local demo

1. Select the right company/person and open a form, JRA team record or meeting.
2. Draw with a finger/stylus/mouse in a touch-safe canvas. Enter a signer name, confirm an explicit scope/intent statement and capture.
3. Record `kind`, PNG image, signer name, local directory person ID when supplied, role, stated intent, current device timestamp, work scope and `LOCAL_UNVERIFIED`.
4. Existing form and JRA/meeting drafts autosave locally; submitted snapshots retain their record state.
5. The PDF and DOCX exports embed the image and declared signer details, with visible local/unverified warnings.

**Verification boundary:** This is a visual e-signature capture, not an advanced/qualified/secure electronic signature, verified identity, independently trustworthy time, immutable server log or validated certificate. Do not trust the device timestamp, user-entered name or local person selector as proof of signatory identity. Do not use it to authorize work at heights, confined spaces, blasting, isolation, release of grounded fleet, or occupational/plant compliance.

Botswana's [Electronic Communications and Transactions Act](https://www.bocra.org.bw/sites/default/files/documents/Electronic-Communications-and-Transactions-Act-2014.pdf) addresses electronic signature recognition and secure electronic signatures, but no live-work legal compliance claim is made. A future production version requires identity and role verification, document hashing, independent evidence and audit/retention controls, legal review and industry-specific workflows before implementing safety authorization.

## Privacy and legal screens
Privacy notices and Terms are demo-specific and accurately describe local browser data, Cloudflare delivery metadata, manually emailed support messages, unencrypted backups, shared-device risk, and lack of corporate accounts or central validation. Botswana's [Data Protection Act, 2024](https://botswanalaws.com/consolidated-statutes/principle-legislation/data-protection) commenced on **14 January 2025** (Statutory Instrument 4/2025). The policy does not purport to be a fully certified legal document. The links are public reference laws, not a substitute for legal counsel.

Customer support email: `jobebokang@gmail.com`, via native `mailto:`. Compose action does not send email silently. Developer credit: *Designed and developed by Bokang Jobe.*

## Remaining enterprise work before production use
- Sign-in and signer identity verification (unavailable and intentionally excluded from the demo).
- Authorization/roles per company and record (401/403, no shared-account leakage).
- Versioned hash/audit log, server trusted timestamps, tamper-evident chain, immutable signed record and encrypted secure storage.
- Staff/contractor consent and retention processes, data-protection impact assessment, accountable data controller/processor agreements.
- Site-specific safety permit and supervisor delegation checks, records lifecycle, push/status notifications.
- True secure multi-tenant analytics and independent offline/mobile synchronization.

The current demo is **frontend-only, offline-capable and local**. None of the UI implementation should be represented as legally binding verified e-signatures or work permits.
