# MoveTrack OCR — Paper and PDF to real UI components

This continues the existing **Paper → Digital Document Studio**, company onboarding and no-code form builder. The application remains browser-only with no Firebase or paid OCR service.

## Extraction flow

1. Open **Paper → Digital** from the MoveTrack workspace. Select PNG, JPEG, WebP, or PDF (up to 12 MB / five PDF pages).
2. Image or scanned PDF pages load through Tesseract.js English OCR, requesting word/line bounding boxes. Printable PDF text is read from PDF.js text items with source coordinates. PDF pages are also rendered as images.
3. A lightweight connected-component scan examines the page pixels for outlined **checkbox squares**, circular radio shapes and **answer rules**. It does not upload source images. PDF.js also reads native **AcroForm annotations** (checkbox/radio/text/select/signature widgets).
4. A paper-layout classifier joins source boxes to nearby printed labels, groups options, proposes date/number/text/long-answer/yes-no/PASS-FAIL/signature inputs and identifies repeatable table headers. The source page, approximate location and detection confidence are captured on the generated FormField.
5. The existing OCR text parser remains a fallback when geometry is not reliable. Findings merge into the original editable sections; no checked source content is mistaken for a verified workplace response.
6. The reviewer compares the source image/PDF with each editable proposed field, changes input types, option labels and table columns, and **marks detected fields reviewed**. The UI has a live sample of checkboxes, radio choices, typed fields and answer selectors.
7. On saving as a draft, company-scoped templates persist locally; on publishing, all detected source fields must first have review flags. The custom builder can be opened with the reconstructed sections prefilled.
8. Published templates use the **actual** MoveTrack form controls and evaluators (boolean checkbox; exclusive radio; multiselect checkboxes; repeatable registers). Empty/draft/completed PDF/Word exports are unchanged. Original source files remain archived separately in local IndexedDB and are not included in JSON backups.

## Supported control families

- Independent printed tick squares → true boolean checkbox, required checkbox must be checked.
- Print/raster circles and native PDF radio widgets → exclusive-choice radio group with reviewable options.
- Printed `Yes / No` and `Pass / Fail / N/A` → existing decision controls.
- Inline printed box options → editable multi-checkbox choice group.
- Text and ruled/underlined blank fields → text (or inferred number/date/multiline).
- Columns separated in OCR/PDF text layer → repeatable register with named columns.
- Signature field annotations and printed signature labels → local unverified signature input.
- Digital AcroForm combo boxes → native select options.
- Source evidence: page number, bounding rectangle, detection confidence, detection mechanism, review state.

## Accuracy, security and limits

- **OCR and shape recognition are assistive**, not guaranteed; faint boxes, handwriting, complex merged cells, circles that look like the letter O, rotated or skewed photographs, and unusual forms may be missed or misclassified. Every imported form must be reviewed.
- The shape scanner is a lightweight geometric heuristic, not a trained visual-layout model. It does **not** guarantee conversion of every table layout, handwritten mark, diagram or complex conditional form.
- PDF widgets may not expose meaningful labels/options; the review editor lets users rename and fix each field.
- Low-confidence control suggestions and unlabeled option groups are flagged. Critical / required / authorizing fields are not assigned automatically from OCR. A saved imported form is **not** a genuine permit.
- For sensitive enterprise work, the local browser is not an authenticated shared system. Do not import real confidential records without appropriate controls.
- First-run Tesseract language/worker data can require internet; all subsequent recognition work is performed in the browser. PDF.js is loaded locally in the web bundle.

## Tests

`tests/paper-layout.test.mjs` verifies drawn squares, PDF form annotation mapping, text-symbol checkbox groups, table-to-repeat conversion and correct required-checkbox evaluation. The existing `paper-meeting.test.mjs`, assurance, document export and persistence suites continue to run in GitHub Actions.
