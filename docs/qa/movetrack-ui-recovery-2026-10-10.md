# MoveTrack UI recovery audit — 10 October 2026

Working branch: `feature/operational-assurance-on-fleet-foundation`. PR #4 is open/draft. This work continues the existing local-first app; no records or schemas were rebuilt.

## Reproduced regression: organisation people picker

A user iPhone screenshot shows name, role and email lines crossing into the next employee row while using the full-screen `Find organization people` modal.

The shared `OrganizationPeopleComboBox.tsx` rendered directory results as auto-sized grid tracks inside a flex-scrolling panel. The four-line detail blocks could overflow neighbouring track heights, especially with mobile text sizing. The first correction ensures max-content grid rows, growing item height, explicit line-heights, and flexed text with wrapping.

A real headless Chromium run rendered 14 employees and verified zero row collisions, zero clipped detail areas, no horizontal overflow, scrollable results, and mobile footer visibility at 320×700 and 390×844 in light/dark. The same browser test detected a second defect at 844×390 landscape: anchored desktop-style popover left the footer at 1852 px below a 390 px viewport. The mobile full-screen breakpoint now covers narrow landscape, and the 844×390 test passes with the footer at 390 px.

This is **rendered Chromium evidence, not physical iOS Safari verification**.

## Application-wide entry-state audit

The browser runner visited 20 existing entry routes: Home, Company, Control, Fleet, Drivers, Sites, Assignments, Jobs, Search, Workflow library, Forms, Meetings, Paper, Release, Analytics, Workforce, Profile, Local data, Settings and Admin. It checked 320 and 390 px viewports in both light and dark: **80 rendered states**.

Findings in the initial scan:
- 0 page/control bounds overflows.
- 0 buttons detected with clipped text.
- 12 state-level flags for ~10–13 px native input widths in Drivers, Sites and Meetings; inspection indicates these are normal checkbox-sized controls. The scanner was refined to exclude checkbox/radio/hidden/color inputs so they are not classified as narrow text fields.
- Dark mobile entry-view screenshots captured for Home, Admin, Fleet, Forms, Meetings, Analytics, Workflows and Search. Open picker light/dark screenshots were added to the runner for subsequent verification.

The workspaces and UI state on entry are not proof that expanded editors, picker selection changes, document upload, long-data registers, every form question or physical Safari/Android keyboard screens all work correctly.

## Source/test changes

- `apps/web/components/products/OrganizationPeopleComboBox.tsx`: responsive row sizing and portrait/landscape fullscreen panel.
- `tests/movetrack-people-picker-layout.test.mjs`: asserts content-sized rows, responsive breakpoints, picker semantics and shared consumption across Forms, Meetings and JRA.
- `tests/ui/people-picker-geometry.mjs`: real-browser overlap and viewport checks, entry-route geometry matrix, screenshots and JSON diagnostics.
- `.github/workflows/movetrack-ui-geometry.yml`: builds the real standalone app, runs Chrome headlessly, uploads measurements/screenshots.

## Verification / deployment

Rendered-picker regression: successful at commit `dcb7fdb` in GitHub Actions run `37998541783`.
Entry matrix plus screenshots: successful at commit `53edbb0` in GitHub Actions run `37998806435`.
Studio CI: successful for `53edbb0` in run `37998806330`.

Cloudflare Pages publishing is **not updated** by these changes. The Pages workflow builds and runs tests, then returns **Cloudflare API authentication error 10000** during the deploy call. The configured `CLOUDFLARE_API_TOKEN` needs appropriate Pages project access, and the account/project scope must be verified. Do not claim the permanent site already serves the fixes.

## Next UI recovery chunks

1. Expanded meeting and JRA screens: participant registers, apologies and repeatable rows; test opened pickers and modal footers with long and selected data.
2. Admin/Fleet: vehicle editing, documents, image galleries, competency dialogs, status text and modal scroll/focus behavior.
3. Forms/OCR: guided forms, large repeating questions, evidence uploads, review/publish panes, risk status components and exports.
4. Navigation, keyboard and real-device verification: mobile dock, viewport/safe areas, landscape, software keyboard, iOS Safari and Android browsers.

For each chunk require real rendered tests with actual populated states plus source/CI coverage, before claiming a UX defect is fixed. Keep local persistence, safety gating and document revisions intact.
