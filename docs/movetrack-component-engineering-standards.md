# MoveTrack AI — Component engineering contract

These rules govern all **new or modified** shared UI components. Do not replace working components wholesale or use recurring app-wide CSS patches in lieu of root-cause fixes. Reuse the same component and token contract in Home, Fleet, Meetings, JRA, Forms, OCR, Admin and Driver experiences.

## Documentation baseline (primary sources)

- CSS Grid implicit track sizing and `grid-auto-rows`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-auto-rows
- Grid auto placement and content-driven track sizes: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Auto-placement
- `overflow-wrap: anywhere` intrinsic sizing: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap
- Tailwind responsive design and wrapping utilities: https://tailwindcss.com/docs/responsive-design and https://tailwindcss.com/docs/overflow-wrap
- Accessible combobox/listbox/dialog behavior: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ ; https://www.w3.org/WAI/ARIA/apg/patterns/listbox/ ; https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- Native dialog interaction, inert siblings and browser-managed focus: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
- React state identity, preserving and resetting intentional state: https://react.dev/learn/preserving-and-resetting-state
- Motion for React layout animations: https://motion.dev/docs/react-layout-animations
- For **future editable** formatted documents, use established open-source editor schemas rather than homegrown contenteditable parsing: https://tiptap.dev/docs/editor/getting-started/overview . **No editor has been added by this phase.**

## Source of truth

1. **Data:** use existing domain-data schemas and persistent IDs; form templates and submitted snapshots are immutable historical records when versions change. This phase changes no storage keys, entitlements or approvals.
2. **Styles:** use `--mt-ink`, `--mt-muted`, `--mt-link`, `--mt-surface`, `--mt-border` and status-specific tokens. Pair foreground, surface, border and focus colors per theme. No global selectors overriding arbitrary author colors.
3. **Typography:** `MoveTrackReadableContent.tsx` exposes `MoveTrackReadableText` for all variable-length labels, titles and metadata. `MoveTrackRichContent` renders semantic typed blocks with paragraphs, headings, lists, quotations and inline emphasis/code/links. React escapes text. Links allow only http(s), mailto and same-site paths; never use raw `innerHTML` for company content.
4. **Layout:** children choose height from actual content (`auto` / `max-content`); grids use `minmax(0,1fr)`, and flex children use `min-width:0`. Long identifiers wrap using `overflow-wrap:anywhere`. No fixed heights, ellipses or hidden overflow on safety-critical details. A fixed-height row requires a proven single-line use case, not an arbitrary design default.
5. **Modals:** desktop dialogs use native `showModal` where appropriate. Mobile fullscreen sheets must handle both portrait and landscape, focus containment, Escape and mobile keyboard/viewport/safe areas. Each layer needs a stable title and a reachable dismissal control.
6. **Accessibility:** labels, names, state announcements, correct ARIA roles, disabled controls and keyboard navigation are implemented as specified in the WAI-ARIA APG. A role string without its required interaction is not sufficient.
7. **Motion:** animate only after layout functions correctly without animation. Respect reduced motion; no transform that hides, blocks or overlays interactive elements.
8. **Rich text:** distinguish *displaying structured formatted content* (supported by current component) from *authoring/editing rich documents* (future controlled design and schema decision). Do not silently convert legacy plain-text form answers into HTML or modify PDF/Word rendering without tests.

## Acceptance tests before calling a UI task fixed

- Real browser checks at **320, 390, 768, 1280** CSS px and landscape; test both light and dark mode; 200% text enlargement where text is variable.
- Populate worst-case data: very long person names, unknown site titles, long emails/IDs and paragraphs, multiple repeated rows, large attendance lists and empty states.
- Verify zero overlapping content, no inaccessible footer/buttons, no unintended horizontal scrolling, no unreadable text, and keyboard input + focus returning correctly.
- Confirm local persistence, onChange callbacks, safety-critical FAIL / NO-GO controls, JRA historical state and exports remain functional.
- Run `pnpm typecheck`, `node --experimental-strip-types --test tests/*.test.mjs`, Vite build and the rendered Chromium UI geometry workflow. The browser test is **not** a substitute for physical Safari/Android acceptance.
- A deployment is only accepted after the **actual permanent** Cloudflare Pages project serves that exact commit. GitHub green tests alone are not evidence of deployment.

## Work scope recorded in this phase

Added reusable typography and semantic structured-content renderer. Integrated them with company overview, workspaces, help/FAQ and directory people picker without replacing the picker or changing its saved IDs. Added source and runtime rich-content checks, plus an extreme-text browser test. Existing form authoring and document-export engines remain unchanged.

Remaining: complete physical device checks and audit each expanded workflow, including OCR and form editor text, before promoting a new release.
