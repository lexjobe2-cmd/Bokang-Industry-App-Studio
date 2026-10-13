# Desktop dialogs — 9 October 2026

Oversized inline editors now use a shared native dialog at desktop widths (1024 px and above): fleet onboarding, driver onboarding, logistics-job creation, company onboarding/editing, staff CSV import, departmental meeting series and previous-meeting minutes. Smaller screens use inline panels. Existing form state, validation, submission handlers and persistence keys are reused.

`DesktopModal.tsx` keeps editor children mounted across close/reopen and breakpoint changes. Desktop dialogs have an 880 px maximum width, viewport-bounded height, independently scrolling content, a fixed header/Close control, Escape dismissal, background scroll locking and explicit forward/reverse Tab wrapping. Native modal behavior makes background controls inert and returns focus when dismissed. The backdrop does not dismiss on click, avoiding accidental closure.

Changed integrations: `MoveTrackShowcase.tsx`, `OrganizationOnboarding.tsx`, `CompanyDirectoryImport.tsx`, `MeetingRegisterWorkspace.tsx`; shared styles in `MoveTrackThemeStyles.tsx`.

## Actual browser checks

Candidate `53328e51-3111-492a-ab13-916f8dec2dbf`:

- Fleet, driver, logistics job, company edit, staff import and meeting-series dialogs opened using UI buttons; each matched native `:modal` and measured 880 px wide at a 1363 px viewport.
- Fleet dialog measured approximately 498 px high; company editing with fourteen directory people was capped at 872 px in a 936 px viewport, with 3,754 px of content scrolling inside its 793 px body.
- Escape closed Fleet, unlocked body scrolling and returned focus to its opener. A fictional, unsubmitted fleet-number draft survived reopening.
- Empty Fleet submission showed the existing required-fields message inside the modal.
- At a 320 px frame (305 px content viewport), expanded Fleet and Driver editors had no page overflow, clipped button content or sub-100 px text fields. Fleet was non-modal and statically positioned.
- Reverse Tab initially left the dialog controls. Explicit focus wrapping was added.

Final candidate `2843d814-cec5-4c2a-bf55-8acb82fbc42b`:

- Reverse Tab from Close focused Add vehicle; forward Tab from Add vehicle focused Close. Both stayed inside the native modal.
- Escape/reopen retained the fictional fleet-number draft.

110 existing tests passed; both TypeScript projects and the Vite build passed. The existing large-bundle warning remains. Previous-minutes content with a saved recurring-series history was not exercised in this pass. This is Chromium verification, not physical iOS/Android certification. No signature was fabricated and no test company, vehicle, driver or meeting was finalized.
