# MoveTrack AI — Workforce Participation Analytics & Form Exports

## Where it lives
Open the existing MoveTrack manager and select **Analytics**. The new Participation Analytics dashboard appears above the fleet scorecards and derives figures from the currently selected company in the homepage onboarding flow. The **SHE forms** workspace adds downloads for blank templates and in-progress drafts. Saved submissions and the JRA studio expose completed-record downloads.

## Participation tracking
- **My participation:** choose a local company worker in the Analytics person selector. The dashboard shows all saved checklist submissions and JRAs in which the chosen person is explicitly included.
- **Company overview:** aggregates the active organization's records, avoiding other companies' locally stored data.
- Attribution is based on exact local directory person IDs from form `person` and `people` answers, a chosen local `submittedByPersonId` at submission time, and JRA participants, supervisors and reviewers.
- A hand-entered attendance register is associated only when an exact attendee name or employee number matches a directory record. Older forms without IDs or matching attendance names are intentionally **not** assigned to someone by guesswork.
- The local person chooser is **not authenticated**. Never use the demo to restrict confidential employee records.

## Analytics now displayed
- Overall records, submitted forms, JRAs, attributed people, completed/demo-reviewed records, NO-GO decisions, review queue and saved JRA drafts.
- User roles: submitter, crew participant, attendee, supervisor, responsible person, reviewer.
- Distribution by form category, operating site, month, and the most frequently involved local-directory workers.
- Searchable and filterable participation register with status and category filters.
- Downloadable CSV participation register, scoped by selected person/company and active filters.
- Saved-record downloads in PDF, editable Word DOCX, CSV and JSON.

## Downloading documents
1. **Unfilled / blank:** Open any built-in or company-branded template from the form library. Use the **Document download center** and select blank template.
2. **Draft:** Fill any questions without submitting, then use the adjacent draft download. Your in-progress answers appear, with empty fields left unfilled.
3. **Filled / submitted:** Navigate to **SHE forms → Submissions** or an item in the Analytics register. Export the saved immutable template snapshot and its submitted answers, evaluation status, site and work order.
4. **JRAs:** In the JRA job studio use the download controls for a blank/new assessment, active draft, or a saved assessment. The exported document includes team, job steps, hazards, controls, initial/residual risk, exposures, and demo review state.
5. Choose a format: **PDF** (real multi-page PDF), **Word (.docx)** (editable OOXML document), **CSV** (row-by-row spreadsheet content), or **JSON** (structured portable record). These are created locally in the browser using open-source jsPDF and docx packages.

Exports intentionally stamp **LOCAL DEMO — NOT AN AUTHORIZED PERMIT** even when a form is marked COMPLETE or a JRA is demo-reviewed. The local-only exporter neither issues trusted signatures nor performs official risk approval. Empty templates are not evidence that controls were inspected.

## Testing
- Onboard a company with at least two people, then choose a worker from the **Submitted by** field on an operational checklist.
- Add another person under the checklist's **Crew participants**, submit, and open **Analytics**. Verify submitter, participant and company roles separately.
- Use **JRA job studio** and record a participant, supervisor, and reviewer; save the JRA draft. Both company and personal analytics should reflect the record.
- Export a blank PDF, a draft Word document and a filled PDF/Word. Confirm the correct status, section fields and local demo disclaimer in each.
- Export the participation register CSV, and confirm only the current company/user records are included.
- Reload the page to confirm locally saved histories persist.

## Limitations
- All data and attribution are confined to a single browser origin/profile (device). They are not a cloud-wide usage report, nor is there a real employee sign-in or verified permission model.
- The records may contain personnel names and workplace hazards. Browser storage and exported files are not secured as corporate records. Avoid actual sensitive/real work records.
- PDF output uses basic built-in PDF fonts; unsupported Unicode glyphs may be rendered with simplified characters. Word retains richer text.
- CSV values are escaped and spreadsheet-leading formula characters are prefixed to reduce injection risk. The CSV and JSON are *document exports*, not back-office databases.
- Counts reflect **locally saved records**, not verified training, equipment certification, legal compliance, or formal work approval.
