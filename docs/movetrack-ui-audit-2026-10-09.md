# MoveTrack UI audit — 9 October 2026

The reported iPhone overflow came from intrinsic flex sizing in the people picker and fixed minimum grid tracks inside nested cards. Search panels, summaries and whole editors also sat above each task.

| Area audited | Correction |
| --- | --- |
| Shell/home | Independent routes with Back/Forward and refresh. Home contains active company, actions and fleet overview. Company management, search and workflows are separate screens. Seed/reset controls move to Local data. |
| Company/workforce | Reused onboarding wizard; searchable workforce screen and active company switcher. Bounded onboarding grids. |
| People pickers | Full container width, shrinking prompt, ellipsis, fixed-size icons, wrapped footer and scrollable mobile panel. |
| Meetings | Draft and saved-record pages; Details, Attendance, Minutes, Actions and Review steps with local step recovery. Validation opens the relevant step. |
| OCR | Upload, Review/edit and Save/publish steps. Source comparison and review gate preserved; technical help expandable. |
| Forms/designer/JRA | Existing library/designer/JRA steps retained. Constrained repeating fields, risk grids and nested cards. |
| Analytics/profile | Scope before metrics; Overview, Meetings and Records/exports tabs. |
| Fleet/driver/site/jobs/assignment/release | Constrained cards/grids and stacked narrow date rows. Existing safety gates retained. |
| Driver app | Bounded containers/fields and mobile input sizes; existing screens/dock retained. |
| Signature/exports | Safe-area padding and dynamic viewport height in signature tray; long scopes wrap and close button stays reachable. Export engine unchanged. |
| Settings/backups | Constrained surfaces and relocated demo scenarios; backup model unchanged. |
| Loading | Forms, meetings and OCR load on first visit and stay mounted afterward to preserve state. Main bundle falls from about 828 KB to 664 KB before gzip. |

Auto-fit tracks now use `minmax(min(100%, Npx), 1fr)` so nested cards cannot force their parent wider. Hidden sections remain hidden even with inline grid styling. Mobile text fields use 16px fonts to avoid focus zoom. The fix does not conceal horizontal overflow globally instead of correcting layout.

Validation: 90 tests pass, including existing safety/persistence/OCR/export tests plus long-picker prompts, step accessibility and all workspace deep-link round trips. Standalone and shared web TypeScript checks, schema validation and production Vite build pass. Browser runtime/deployment evidence is recorded in PR #4.

The TSX test compiler target is now ES2022 so Set/Map iteration matches Vite. No authentication/backend was added; existing stored schemas, companies, template versions and submitted snapshots were retained.

Limits: the browser tool blocked a local responsive harness and has no viewport-resize API. Physical iPhone/Android and software-keyboard tests are not claimed. The user screenshot, source checks and component regressions establish the specific overflow correction; deployed desktop checks verify navigation and recovery. Broader document/photo sampling remains useful. The main bundle still triggers Vite's size warning.
