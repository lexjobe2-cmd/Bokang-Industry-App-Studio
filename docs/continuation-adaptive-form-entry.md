# MoveTrack continuation: quick-entry meetings, OCR review, adaptive navigation

This update continues the existing MoveTrack Fleet + SHE app, without rebuilding it or adding accounts, Firebase, Microsoft login or a paid OCR service.

## Already implemented and retained
- Adaptive, mobile-first application header, Instagram-inspired 5-item bottom dock (Home / Search / Forms / Insights / Menu), hamburger drawer on mobile and desktop, theme toggle and accessible focus/escape behavior.
- Company onboarding and local people directory.
- Company-scoped searchable multiselect people pickers for present staff and separate apologies/absentees. Staff cannot be counted present and absent simultaneously.
- Paper -> digital OCR reading Tesseract.js photos/scanned PDF, extracting digital PDF text and widgets, geometric checkbox/radio/underline layout and tabular registers. Imported controls are reviewed before publication.
- One-tap form suggestions, reusable crew selection, risk/JRA quick entry and exportable PDF/Word reports.

## Changes in this continuation
### Meeting action register
- Assign an internal action owner from the **searchable organization people picker** (stable person ID plus human-readable name snapshot). An alternate manual external owner remains supported.
- Copy **only unresolved actions** from the most recent company meeting with an explicit action. Closed actions and duplicates are excluded.
- Previous action due dates are **never blindly carried forward**; the new meeting requires a refreshed due date before saving a carried action. Status is reset to Open for fresh review.
- A unique employee can be recovered from a prior legacy name; ambiguous names remain manual rather than inferring the wrong person.
- Reuse previous agenda **topics** on request; never copy prior minutes, attendance, apologies or signatures.
- The existing attendees/apologies picker maintains exclusive present and absent sets and retains selected people while editing.

### OCR-driven dynamic forms
- Recognize printed "chairperson/supervisor/reviewer/action owner" as single-person directory fields; "attendees/staff attending/apologies" as multiselect people fields; and signatures as a signature component.
- Detect and flag ambiguous OCR fields (e.g. "Option 1 / Option 2", empty or duplicated choices, missing register column headings, unlabeled widgets) before allowing publication.
- Show actionable reasons inside Paper -> Digital. Drafts can still be saved while correcting the detected form.
- Keep source-review protections in the full custom designer when a reconstructed form is transferred for further editing.
- Geometric recognition remains heuristic; text, visual controls and risk meaning must be checked against the source before publication.

## Power Apps benchmark
Microsoft's modern Power Apps Combo box uses searchable items, optional multi-select, retained chosen items and immediate selection changes. This supports selecting company workers once rather than retyping their names in repeating lists, while keeping attendance and approvals explicit.
- https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/modern-controls/modern-control-combobox
- https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/control-combo-box

## QA test path
1. Company onboarding: add three local employees, open **Meetings & registers** from the hamburger or mobile dock.
2. Choose two attendees, then move one to the **Apologies** picker. Verify they do not appear simultaneously as present and absent.
3. Create an unresolved corrective action, choose an internal owner, and save meeting with the required demo chair acknowledgement.
4. Start a new meeting; choose **Carry forward open actions** and verify no closed action returns. Provide a new due date; choose **Reuse previous agenda topics** without copying prior minutes/signatures.
5. Open **Paper to digital** and process a paper meeting or inspection form. Verify that checkbox/radio symbols become editable UI. Placeholder choices must be replaced, and source fields reviewed, before publishing.
6. Open **SHE forms & JRA** and download a fresh blank/draft/filled report as PDF or Word.
7. On a mobile viewport, use the bottom dock and global hamburger drawer to switch between Forms, Analytics and Meetings.

This remains an offline demonstration: a person picker is not authentication; written acknowledgement is not a verified work permit, and OCR-generated forms are not automatically approved for safety-critical work.
