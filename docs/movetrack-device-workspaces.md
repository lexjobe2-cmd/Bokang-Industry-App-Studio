# Distinct desktop and mobile workspaces

Continue the existing form engine, schemas and local persistence. No migrations of answers, submitted records, template revisions, signatures or document snapshots.

| Workspace | Desktop (1024px+) | Phone/tablet |
| --- | --- | --- |
| Form library | Paginated searchable table | Paginated cards |
| Form entry | Section outline, four-question groups, two-column editor, summary inspector | One question per page, step picker, expandable summary |
| Designer | Template/properties/questions/publish views, question outline, focused editor | Native question picker and focused editor |
| Meeting | Section outline, inspector, action table, selected attendee/apology details | Guided steps and attendee/action cards |
| JRA | Selected task/hazard workbench | Selected task/hazard editing |

The controlled editor mounts once. Stable field IDs anchor device changes; conditional removal falls back safely. Autosave and record schema keys remain unchanged. Full-form validation checks every section. Critical FAIL/NO-GO behavior, approvals, historical snapshots and exports are preserved. OCR templates use the same focused form renderer.

Changed components: TaskWorkspace, AssuranceFormsWorkspace, CustomFormBuilder, MeetingRegisterWorkspace, JraWorkspace, MoveTrackThemeStyles; workspace-layout domain helper/package export; layout and component tests; CI.

Validation: 104 domain/component/export/persistence tests; standalone and shared web TypeScript checks; schema validation and production Vite build. Live browser checks accompany deployment. Physical phone/landscape keyboard testing remains outstanding; browser control has no viewport resizing capability. Fleet, settings and analytics retain their existing layouts.
