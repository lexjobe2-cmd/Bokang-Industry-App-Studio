# MoveTrack meeting apologies: Power Apps-inspired people registration

## What changed
- **Present staff** and **Apologies / absent** are independent, multi-select searchable pickers from the **active company's local people directory**, reusing the existing `OrganizationPeopleComboBox` component.
- The pickers follow Microsoft Power Apps Combo Box patterns: search, multiple selection, person name plus department/job, selected chips, and a full-screen mobile choice panel. See [Microsoft Learn: Combo box](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/control-combo-box) and [Modern Combo box](https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/modern-controls/modern-control-combobox).
- For a staff apology, select the person once, then choose the **attendance status** (`Apology received`, `Absent (no apology)`, `Attendance unconfirmed`) and optional **reason category** (`Leave`, `Different work site`, `Training`, `Operational duty`, `Travel`, `Unavailable`, `Other`). Free text is only needed for extra notes.
- **External/contractor apologies** can be added as repeating name/company/status/reason entries.
- Choosing an employee as present removes them from absent and vice versa. The dedicated meeting validation rejects contradictions and incomplete external apology names.
- The previously free-text `apologies` field remains as an **optional legacy notes** field; existing saved drafts and submitted snapshots are not overwritten. Company meeting template increments to **v3**; general meeting template increments to **v3**.
- Absences are stored in the submitted document's versioned template snapshot, appear in PDF / Word / CSV / JSON, and are summarized separately from attendance on the meeting list and counters.
- A person listed as absent or apologizing must **not** be credited with meeting participation in employee-level analytics.
- **Quick input enhancements** include picking meeting sites from the company's sites list, selecting an owner from the directory with a native suggestion list, and explicitly reusing a previous crew without auto-approving attendance.

## Data fields
- `participants: string[]`: directory person IDs recorded present.
- `apology_person_ids: string[]`: directory person IDs recorded absent.
- `apology_details: Row[]`: keyed `person_id`, display-name snapshot, status, reason and notes for selected staff.
- `apology_entries: Row[]`: manual external/contractor apology rows, name/company/status/reason.
- `apologies: string`: legacy free-text notes.

## Safety/privacy
These records are local-only demonstrations with no verified workforce login. Attendance status and apology do not imply employee identity verification, manager acknowledgement or site authorization. Do not use this browser-local preview for confidential HR absence records. No Firebase, Microsoft 365 or commercial Power Apps connection was added.

## Quality checks
`tests/meeting-apologies.test.mjs` checks exclusive staff presence, automatic name snapshots, structured external apologies, attendance counts, PDF/Word document data and correct analytics attribution. This suite runs with the other MoveTrack tests in GitHub Actions.
