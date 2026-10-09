# Mobile overflow cleanup — 9 October 2026

The user's screenshot showed the Fleet workspace navigation, onboarding form and asset cards extending beyond the mobile app background. Earlier desktop checks did not establish mobile correctness.

## Changes
- Include navigation, main/aside, details/summary and lists in shrinkable grid/flex children. Give the workspace navigation and shortcuts explicit width bounds.
- Replace mobile horizontal workspace shortcut rows with a labelled native selector. Keep desktop buttons and the hamburger menu.
- Use one column for fleet onboarding and asset cards below 860px. Wrap asset headings/statuses.
- Keep vehicle onboarding in an expandable Add fleet vehicle panel. Existing controlled draft values and add/save behavior remain unchanged.
- Bound native date/time controls, including their minimum inline width; keep native pickers.
- Remove the redundant forms demo banner, hide the library introduction in other tabs and shorten the designer heading so editing controls start earlier.
- Improve dark-mode blue status text and workforce picker job-title contrast; increase directory row text on mobile.

## Actual verification
A preview-only HTML audit page renders the real application in an iframe with a selected width. Native UI controls change the iframe viewport; the measurement button reads rendered document/control bounds. It does not simulate iOS Safari or a software keyboard. It is stored at tests/ui/mobile-audit.html and is excluded from production assets.

At a 320px frame (305px content viewport with desktop scrollbars), the entry views for Home, Company, Control, Fleet, Drivers, Sites, Assignments, Jobs, Forms, Meetings, Paper, Release, Analytics, Workforce, Profile, Backups, Settings, Workflows, Search and the driver app returned document width equal to viewport width and no measured out-of-bounds controls. Loaded lazy forms/OCR/analytics were checked separately. These checks cover initial/draft screens, not every populated/modal state.

Fleet also passed expanded/collapsed onboarding at a 390px frame, dark mode at 320px, and expanded onboarding at 667px/844px/1024px frames. The hamburger opened and closed at 390px. Mobile single-question form navigation and the opened full-screen people picker were exercised without horizontal overflow.

Automated component coverage verifies the new selector includes current Fleet and related destinations without changing identity. Existing persistence, meetings, safety controls and export tests remain unchanged.

## Limits
No physical iPhone Safari, Android browser, keyboard or safe-area measurements were performed. An iframe viewport is browser layout evidence only. Grounded-release/signature dialogs, populated OCR review and every possible long/custom field are not exhaustively verified. The uploaded screenshot is the evidence of the original phone problem; the fix should not be described as universally mobile-certified.
