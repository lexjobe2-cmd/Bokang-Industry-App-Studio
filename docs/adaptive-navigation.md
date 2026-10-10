# MoveTrack AI — adaptive navigation and mobile experience

## Navigation structure (existing app, no rebuild)
- **Top app bar**: sticky on desktop and mobile. Logo, hamburger menu, active workspace label (desktop), theme toggle and desktop shortcuts. The hamburger menu is always available, including small phones.
- **Mobile bottom dock (up to 860px width)**: five large, thumb-friendly icon buttons — Home, Search, Forms, Insights and Menu. Uses iOS safe-area insets, visible active state, semantic navigation, keyboard-focus indicators and dark mode. No overlapping with form actions or footer.
- **Full-height menu drawer**: categorized access to all current workspaces, including Fleet control, Drivers, Sites, Assignments, Jobs, SHE Forms/JRA, Meetings, Paper-to-Digital OCR, Analytics, Repair & Release, Local data, and Settings. Quick jumps to company onboarding and the 21-workflow graph.
- **Driver app**: updated its own five-tab Home / Vehicle / Check / Report / Profile dock with real icons and a hamburger drawer on both desktop and mobile; links back to the management experience.
- **Desktop workspace navigation**: a slim context/related-workspace bar replaces the large collapsible tile matrix. Every module remains one or two taps away via the hamburger menu.

## Preserve work across navigation
- Parent dashboard controls the active workspace via a local persistence key: `bokang-studio.move-track.navigation.view.v1`.
- Switching the active workspace **no longer changes the React key** of `MoveTrackShowcase`, avoiding remount of the entire manager state tree. Existing saved forms, draft JRA and company records are retained.
- The global search, safety-workflow graph, quick-start links, bottom dock and hamburger navigation all use the same active-view selection path.
- Opening a job-linked safety checklist from the homepage now changes the active workspace to SHE Forms as well as selecting the template.

## Accessibility & mobile QA
- Hamburger button uses `aria-label`, `aria-expanded`, `aria-controls`; drawer uses dialog semantics and Escape-to-close.
- The manager drawer locks document scroll, restores keyboard focus to the opening menu button, and cycles focus within the menu on Tab/Shift+Tab.
- Responsive mobile CSS avoids overflowing internal workspace headings/buttons, uses modern `env(safe-area-inset-bottom)` for dock and content padding, and honors reduced-motion preference.
- Driver menu also closes with Escape, has keyboard focus restoration, and doesn't remount the ongoing pre-start checks when changing tabs.
- Test on 320/375/390/430px mobile widths, tablet at 768px, and desktop at 1440px. Inspect the sticky header, overlay stacking, bottom dock, blank JRA template export and OCR upload view. Confirm app remains stable after repeated tab switches and reload.

## Safety and limitations
Still the existing browser-local frontend demonstration. No verified employee identity, server-side authorization or cross-device synchronization. Company onboarding and document OCR are not changed by the navigation refactor.

Developer credit: Designed and developed by Bokang Jobe. Support: jobebokang@gmail.com.
