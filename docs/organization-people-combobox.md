# MoveTrack AI — Company directory, Power Apps Combo box and people selection

## Benchmark (Microsoft Learn)
- Canvas Apps Combo box: `Items`, `DefaultSelectedItems`, `IsSearchable`, `SearchFields`, `SelectMultiple` and `SelectedItems`. Power Apps supports people layouts showing a name plus secondary identity data, with delegated server-side searches when the source supports them: https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/control-combo-box
- Modern Combo box: built-in searchable multiselect, change events and responsive mobile behavior: https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/controls/modern-controls/modern-control-combobox
- Microsoft 365 Users connector: `Office365Users.SearchUserV2`, fields such as `DisplayName`, `JobTitle`, `Department`, `City`, `Mail`, `UserPrincipalName`, `OfficeLocation`: https://learn.microsoft.com/en-us/power-apps/maker/canvas-apps/connections/connection-office365-users
- Microsoft Graph user list: `GET /users?$select=id,displayName,mail,userPrincipalName,department,jobTitle,city,officeLocation,employeeId,accountEnabled&$top=100` with `@odata.nextLink`, least-privilege permissions and server-side filtering: https://learn.microsoft.com/en-us/graph/api/user-list
- Large tenant sync: `GET /users/delta` supports change tracking by `@odata.nextLink`/`@odata.deltaLink` when organization access is authorized: https://learn.microsoft.com/en-us/graph/delta-query-users

## Delivered in the existing frontend
- **Organization profile** now stores departments, cities and a nominated principal contact email, independently of work sites, company domain and organization owners.
- **Directory person** fields: stable ID, orgId, source, displayName, employee number, email address, `userPrincipalName`, department, jobTitle, `city`, `officeLocation`, location and active state. UPN, login, email and employee ID are not interchangeable and can differ.
- **Reusable OrganizationPeopleComboBox**: single- and multiselect with name/role/department/email/UPN/location, selected-person chips, results search, department/city filters, small-batch paging, mobile full-screen people picker, and accessible search labels.
- Replaces flat choice lists in **Meeting registers** (chairperson, submitter, multi-person attendance), SHE form **person** and **people** fields, and **JRA studio** (supervisor, participant team, reviewer). Selected records still store existing person IDs, preserving participation analytics and document export references.
- **Organization onboarding** now supports editing department and city lists, principal email, employee city, UPN and employee numbers.
- **Import CSV** under company onboarding: download a sample, upload a company-authorized CSV, preview records, then explicitly confirm import. Recognizes common Power Apps/Microsoft export headers. Duplicate rows ignored; existing people matched by email/UPN/employee ID; records stay scoped to the selected organization and are saved only in local browser state. Supports up to 10,000 rows (2 MB).
- **Backend-neutral search contract** `DirectoryProvider.search({orgId,search,department,city,cursor,limit})`. Local provider works today; `CONNECTED` provider is for a future authenticated Microsoft/enterprise adapter. No Graph token, tenant directory, email or Entra ID is fetched from a company's live system in this demo.

## Future actual Microsoft 365 directory connection
1. Organization registers/validates its Microsoft Entra tenant and authorizes a secure application connection, with explicit consent and least-privilege Graph scopes.
2. Backend verifies identity, tenant permissions and org/workspace membership; never treat a user-entered email domain or principal email as tenant authorization.
3. Query Microsoft Graph users using a minimal `$select` of permitted fields, handle `@odata.nextLink` and remote filters. Do not bulk-download whole directories to phones.
4. Normalize to the existing `PersonRecord` and return paged results from a server endpoint implementing `DirectoryProvider`. Use Graph `/users/delta` later for incremental synchronization and handle departures/disabled accounts.
5. Enforce organization scoping and individual record access on the backend. Browser-only person selection and current demonstration role labels are not authentication or approval.

**Privacy:** Do not upload confidential real staff information to this public browser demo. Import remains on the device and is exportable via local data backups. No live Microsoft 365 connector, admin consent, or verified sign-in has been enabled.
