# MoveTrack AI — Mobile-first fast entry (2026-10-09)

The existing MoveTrack app already contains the responsive five-destination mobile bottom navigation, hamburger drawer shared with desktop, search, workspaces, and a paper-checklist-to-form review flow. This continuation preserves that architecture and makes every frequently used operational form easier to complete.

## Form completion, with minimal typing
- **Narrative suggestion chips** appear for common task scopes, remarks, weather, hazards, controls, incident descriptions and other descriptive fields. Users may pick or write their own; no text is silently inserted.
- **Employee/contractor directory selection** is already available for `person`/`people` fields; repeating attendance registers now have a member chooser that fills name, employee ID, department and job title into the correct columns. The person must still be selected for each row. Signature/verification fields are never derived from the directory.
- **Reusable previous crew** is explicit in the published form workspace and only copies active, same-organization person and crew IDs from that particular previously submitted template. It intentionally excludes risk ratings, checks, signatures and approval/reviewer selectors. Existing local signatures are invalidated if the crew changes.
- **Critical checks** (PASS/FAIL/N/A), site-specific permit conditions, risk levels and signed attestations always need fresh action. Quick suggestions do **not** mark conditions PASS or substitute for site verification.
- **JRA studio** adds task step chips, equipment chips, category-specific hazard suggestions, consequence suggestions and proposed-control suggestions. Selecting a proposed control always resets its verified state. Risk likelihood/consequence and review remain explicit.
- **Fleet onboarding** now proposes company operating sites, existing vehicle makes/models and directory workers for driver naming. Client entries can reuse existing customer names.
- **Driver app** gets pick-to-describe incident narratives and pre-start notes; reports still require user submission and all pre-start controls remain individually answered.
- **Company onboarding** offers selectable departments and Botswana cities, and the user may use a city to generate an editable site name.

## Input accessibility and mobile experience
- Controls use real buttons, selects and accessible labels, with large touch targets and visible selected states.
- The existing application shell includes the bottom navigation (Home, Search, Forms, Insights, Menu), a desktop-and-mobile drawer, and a dedicated driver bottom navigation. Do not duplicate navigation or rebuild the shell.

## Data, limitations and correctness
- All drafts and custom templates remain in existing browser-local persistence and are scoped to the selected company.
- Repeated and specialized fields remain editable. Quick suggestions are examples, not certified safe methods.
- Local signatures, no-go logic and separate supervisor review must not be bypassed by fast entry.
- No automatic pass-all, one-tap verified safeguards, or untrusted tenant claims.
- Tests in `tests/form-assist.test.mjs` enforce person roster mapping and zero reuse of critical checks, risk scores and signatures.
