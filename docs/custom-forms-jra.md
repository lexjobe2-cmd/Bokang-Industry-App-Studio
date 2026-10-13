# Operational Assurance — Branded Custom Forms, JRA Studio and Organization Directory

**Implementation mode:** working frontend demo, no Firebase, Google account, Microsoft sign-in or backend. All additions are in the existing Bokang Industry App Studio repository. Browser localStorage is the current persistence layer. No real operational record/approval is created.

## Implemented experience

### Form designer
From the MoveTrack interactive frontend: **SHE forms → Create custom form**.

1. Choose/locally onboard an organization and upload a lightweight PNG, JPEG or WebP logo (250 KB maximum). Set company name, domain, document prefix, site, accent and controlled-document footer. The logo and company name are snapshotted on the form.
2. Choose one of eight recipes: Permit to Work, Lifting Plan, LOTO Verification, Safety Meeting, Mobile Equipment Pre-Start, Fatigue Declaration, Incident Investigation or Shift Handover. Alternatively create a blank form.
3. Set document name, category, description, form kind, and optional work-order/job reference.
4. Add/delete/reorder sections and questions. Supported fields include text, paragraph, number, date/time, select, multiselect, pass/fail/NA, yes/no, 5×5 risk, repeatable table with typed columns, directory person picker, and directory multiple participants. Signature/photo are explicitly placeholders.
5. Mark questions mandatory or critical; build conditional questions based on yes/no, pass/fail or select answers. The engine validates unique field IDs, missing triggers and dependency cycles.
6. Save a local draft or publish the form as an active custom template. Published versions appear immediately in the **Template library** alongside built-in forms. Submissions include a complete copy of the published version, answers, and branding so later edits cannot alter an old record.
7. Edit/publish a new version. Repeating rows enforce required child values. Critical FAIL or NA produces NO-GO in the existing demo evaluator.
8. Branding remains local to the browser, and all assets are illustrative, not legal/verified certificates.

### JRA studio
From **SHE forms → JRA job studio**:
- Create blank assessment or load a fully fictional brake-maintenance example with three tasks, hazard narratives and control plans.
- Capture organization and site, work order, job type, location, date/time, supervisor, scope, method, permits, emergency response and PPE.
- Choose job participants from the organization's employee directory, optionally add new employees via the form designer → **Organization people**; assign job roles and indicate demo acknowledgement.
- Add/edit/remove any number of job steps, with equipment/permits and multiple hazards per step.
- Every hazard records type, scenario, consequences, the actual people exposed, hierarchy-of-controls remedies, control owner and verification state.
- Independently assess **initial** and **residual** risk using the versioned 5×5 matrix. High/exreme residual risks must be reviewed; an unverified control prevents demo approval readiness. The engine blocks missing steps, hazards, controls, exposed people, supervisor or emergency plan, and flags residual risk higher than initial.
- Save a JRA as draft, submit for simulated review or flag as **DEMO APPROVED** only with an independent reviewer, valid risks, verified controls and participant acknowledgement. This status is **not** permission to perform work.
- Every JRA retains captured people IDs and name snapshots, branding and work-order information.

### Rich domain dictionary
`packages/domain-data/src/custom-assurance.ts` has typed:
- `OrganizationProfile` — tenant label/domain, site and business unit, logo data, accent, document prefix, footer, owner person IDs.
- `PersonRecord` — employee/external ID, source, department, role, job title, site, email, active state.
- `ParticipantAssignment` — role, person ID and name snapshot, acknowledgement.
- `JobRiskAssessment`, `JraTask`, `HazardEntry` — steps, dynamic hazards, consequences, exposed workers, initial/residual risk, controls by hierarchy, accountable owner, verification status.
- `CustomTemplate` — branded published form with version, job context, sections and fields.
- `dictionary` — reusable field types, risk categories, hazard catalog, PPE, work types, controls and job roles.
- `templateRecipes` — eight editable field forms.

## Future Microsoft 365 / Office 365 integration — prepared, not connected

The frontend deliberately uses `LOCAL_DEMO` and `MANUAL` sources. No Microsoft tenant or real user list is queried; data should not claim to be a connected directory.

An eventual organization-authorized Graph connector will:

1. Authorize the employer/tenant administrator to link an organization under explicit consent and company policy.
2. Fetch `GET /v1.0/organization?$select=id,displayName,verifiedDomains` and map it through `mapGraphOrganization`.
3. Fetch **paginated** `GET /v1.0/users?$select=id,displayName,mail,userPrincipalName,jobTitle,department,officeLocation,employeeId,accountEnabled&$top=100`; follow `@odata.nextLink` on the trusted server and map each returned person through `mapGraphUser`. The precise scope granted must suffice for the requested fields; users without visibility must be omitted, and changes/deletions reconciled.
4. For candidate tenant administrators (not yet product organization owners), use `GET /v1.0/roleManagement/directory/roleAssignments` and roleDefinition IDs with separately authorized RoleManagement permissions. `mapDirectoryAdminCandidates` can identify matching employees. **These roles must not automatically grant MoveTrack application ownership**; owners must be explicitly approved in MoveTrack.
5. Optionally retrieve authorized organization branding from `GET /v1.0/organization/{id}/branding` and logo stream endpoint. Branding falls back to user-provided company logo when Graph branding is unavailable.
6. Store tenant/subscription state and consent server-side; enforce org isolation, privacy, least privilege, sync expiry/revocation, rate limits and pagination. Do not put Graph bearer tokens in the browser localStorage or template JSON.
7. Use explicit workflow authorization for signatures, JRA approvals, attendance, and safety certificate/evidence before releasing a system for industrial use.

References:
- https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0
- https://learn.microsoft.com/en-us/graph/api/organization-get?view=graph-rest-1.0
- https://learn.microsoft.com/en-us/graph/api/rbacapplication-list-roleassignments?view=graph-rest-1.0
- https://learn.microsoft.com/en-us/graph/api/organizationalbranding-get?view=graph-rest-1.0

## Test locally
```sh
pnpm install --no-frozen-lockfile
pnpm --filter @bokang/assurance-demo dev
```
Open the URL printed by Vite and navigate **SHE forms**. No service credentials needed. Use **JRA job studio → Load example job** to inspect the complex interface. Use **Create custom form → Company branding → Organization people** for local onboarding, then use an editable recipe and publish it.

CI type-checks/builds the existing monorepo, executes form and risk tests, and archives the static demo frontend for optional Cloudflare direct upload.

**Reminder:** offline local data does not provide organizational authenticity, real worker consent, independent verification or enforceable GO/NO-GO. It is only for UI product testing.
