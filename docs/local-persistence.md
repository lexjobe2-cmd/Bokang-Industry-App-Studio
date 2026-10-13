# MoveTrack AI — Local Persistence and Backup (Frontend Demo)

The existing MoveTrack web, mobile-style driver UI and standalone Vite preview operate **offline on the current device with no sign-in**, using the same browser-local workspace.

## Durable state and autosave

The shared `@bokang/persistence` hook now uses a synchronous write-through store via `useSyncExternalStore`. Existing `bokang-studio.move-track.*` localStorage keys are still supported, so prior fleet, checklist and custom form data is not silently migrated or discarded.

Saving a field:
1. Updates the shared in-memory snapshot.
2. Serializes and writes that snapshot directly to localStorage.
3. Notifies all mounted React components and listens for browser `storage` updates from other tabs.
4. Exposes warnings for browser storage restrictions, quota failures and malformed saved state.

No state is uploaded or transferred to external services.

### What persists
- Organization profiles, accents, logos, company owner IDs, local personnel records
- Custom checklist templates, published status, branded template versions
- **Unpublished designer editing session**: title, category, working sections/columns, field rules, conditions, job association, selected company
- **Unsubmitted JRA editing session**: current work order, site, participant assignments, draft job steps, hazards, initial/residual risk, remedies, control verification, active editor section
- Saved JRA documents, submitted generic checklists and reusable answer drafts
- Fleet inventory, drivers, assignments, driver pre-start submissions, incidents and grounding, repair and reinspection records

Form designer and JRA changes persist **as typed**. You can navigate away, reload the page and return to the editor.

## Local Data panel
In MoveTrack manager navigation choose **Local data**.

- See how many local entries are stored and estimated space used.
- **Export JSON backup:** downloads a dated `movetrack-local-backup-YYYY-MM-DD.json` file containing only MoveTrack-prefixed records.
- **Import backup:** checks a versioned document format, size (max 12 MB), key namespace and record count; requests confirmation before replacing saved records. Uses rollback on partial browser failures.
- **Clear workspace:** two-step confirmation removes all MoveTrack local records; cannot be undone without backup.
- Detect full or unavailable browser storage; show visible warnings rather than falsely saying an edit was saved.

`tests/local-persistence.test.mjs` covers write-through state, subscription notifications, backups, key isolation, validation, rollback and quota errors.

## Testing
1. Open the standalone frontend (Vite) or Next.js MoveTrack interactive demo.
2. **SHE forms → Create custom form:** choose a recipe, change sections and logo, then navigate to a different tab and back. Confirm unsaved editor changes remain.
3. **SHE forms → JRA job studio:** load the example assessment, add a hazard/remedy, refresh the browser. Confirm the active JRA and fields resume.
4. Publish and submit a custom checklist; reload and verify the completed record remains in Submissions.
5. In **Local data**, export and save a backup. Edit a JRA or company. Restore the backup and confirm the earlier snapshot returns.
6. With two tabs of the same origin open, modify fleet or a form; verify mounted components are notified and refresh with the current local value.
7. To clear all local records, use Local data. **Reset fleet scenario** on the home screen only resets test fleet/inspections, retaining custom company/form/JRA work.

## Important limitations
- localStorage is browser/origin/device-specific, not a server database, and is subject to browser quota, private-mode expiration and clearing site data.
- The exported JSON backup is **unencrypted** and can include simulated employee details and company logos; store it privately.
- Keep file attachments small. Browser localStorage is not suitable for production document/image archives.
- No shared team editing, permission checks, real Microsoft/Google data, authenticated signatures or verified operational safety locks. This remains a frontend-only simulation.
