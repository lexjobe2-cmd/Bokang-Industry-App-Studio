"use client";
/** Override legacy inline light surfaces inside MoveTrack only, without changing report styling or other App Studio products. */
export function MoveTrackThemeStyles(){
 return <style>{`
.movetrack-root { color-scheme: light; transition: background-color .2s ease; }
.movetrack-root[data-theme="dark"] { color-scheme: dark; background: #081323 !important; color: #e9f1fb !important; }
.movetrack-root[data-theme="dark"] [style*="background: rgb(255, 255, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: #fff"],
.movetrack-root[data-theme="dark"] [style*="background: white"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(248, 250, 252)"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(243, 247, 252)"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(240, 249, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(239, 246, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(241, 245, 249)"] {
 background: #14253b !important; background-color: #14253b !important; border-color: #38506b !important;
}
.movetrack-root[data-theme="dark"] [style*="background-color: rgb(255, 255, 255)"]{
 background-color: #14253b !important; border-color: #38506b !important;
}
.movetrack-root[data-theme="dark"] [style*="color: rgb(16, 24, 40)"],
.movetrack-root[data-theme="dark"] [style*="color: rgb(21, 35, 58)"],
.movetrack-root[data-theme="dark"] [style*="color: rgb(52, 64, 84)"],
.movetrack-root[data-theme="dark"] [style*="color: rgb(17, 24, 39)"],
.movetrack-root[data-theme="dark"] [style*="color: rgb(20, 43, 77)"] {color: #eef5ff !important;}
.movetrack-root[data-theme="dark"] [style*="color: rgb(21, 52, 85)"],
.movetrack-root[data-theme="dark"] [style*="color: rgb(23, 55, 100)"],
.movetrack-root[data-theme="dark"] [style*="color: rgb(24, 43, 73)"],
.movetrack-root[data-theme="dark"] [style*="color: rgb(52, 65, 84)"],
.movetrack-root[data-theme="dark"] [style*="color: rgb(24, 49, 83)"] {color: #eef5ff !important;}
.movetrack-root[data-theme="dark"] [style*="color: rgb(100, 116, 139)"],
.movetrack-root[data-theme="dark"] [style*="color: rgb(102, 112, 133)"],
.movetrack-root[data-theme="dark"] [style*="color: rgb(71, 85, 105)"] {color: #bacbe0 !important;}
.movetrack-root[data-theme="dark"] :is(input:not([type="checkbox"]):not([type="radio"]):not([type="color"]),select,textarea) {
 color: #eff6ff !important; background-color: #1d324d !important;
 border-color: #49627e !important;
}
.movetrack-root[data-theme="dark"] input::placeholder,
.movetrack-root[data-theme="dark"] textarea::placeholder {color: #9fb2ca !important;}
.movetrack-root[data-theme="dark"] button[aria-current="page"],
.movetrack-root[data-theme="dark"] button[aria-pressed="true"]{outline-offset:2px;}
.movetrack-root[data-theme="dark"] :is(button, a, input, select, textarea):focus-visible {outline: 2px solid #93c5fd;outline-offset:2px;}
.movetrack-root[data-theme="dark"] [aria-label="Electronic signature capture"] canvas {background:#fff !important;}
.movetrack-root[data-theme="dark"] [aria-label="Electronic signature capture"] canvas + p {color:#334155 !important;}
.movetrack-root[data-theme="dark"] a:not([style*="color:"]) {color:#a4caff;}

.movetrack-root[data-theme="dark"] [style*="color: rgb(29, 78, 216)"],
.movetrack-root[data-theme="dark"] [style*="color: rgb(37, 99, 235)"] {color:#93c5fd !important;}

/* Desktop workbench and mobile guided views share data, not screen structure. */
.movetrack-task-workspace {display:grid;gap:16px;align-items:start;min-width:0;}
.movetrack-task-workspace.is-desktop {grid-template-columns:180px minmax(0,1fr) 220px;}
.movetrack-task-workspace.is-desktop:not(:has(.movetrack-task-inspector)) {grid-template-columns:200px minmax(0,1fr);}
.movetrack-task-outline,.movetrack-task-inspector {position:sticky;top:84px;background:#fff;border:1px solid #dbe5ef;border-radius:13px;padding:13px;min-width:0;}
.movetrack-task-outline p {font-size:11px;color:#64748b;}
.movetrack-task-outline nav {display:grid;gap:6px;max-height:65dvh;overflow-y:auto;}
.movetrack-task-outline button {display:flex;align-items:center;gap:8px;text-align:left;border:0;border-radius:8px;background:#f8fafc;color:#315479;min-height:44px;padding:9px;width:100%;font:inherit;font-size:12px;cursor:pointer;}
.movetrack-task-outline button[aria-current=step] {background:#1d4ed8;color:#fff;}
.movetrack-task-outline button span {font-size:10px;opacity:.75;}
.movetrack-task-editor {min-width:0;display:grid;gap:12px;}
.movetrack-task-inspector {font-size:12px;display:grid;gap:12px;max-height:calc(100dvh - 105px);overflow-y:auto;}
.movetrack-task-mobile-nav {display:grid;gap:10px;padding:12px;border:1px solid #dbe5ef;background:#fff;border-radius:12px;}
.movetrack-task-mobile-nav label {display:grid;gap:5px;font-size:12px;}
.movetrack-task-mobile-nav select {width:100%;min-height:44px;padding:10px;border:1px solid #cbd5e1;border-radius:9px;}
.movetrack-task-mobile-summary {padding:12px;background:#fff;border:1px solid #dbe5ef;border-radius:12px;}
.movetrack-task-mobile-summary summary {min-height:44px;cursor:pointer;font-weight:750;}
.movetrack-desktop-fields {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;}
.movetrack-mobile-fields {display:grid;gap:15px;}
.movetrack-field-wide {grid-column:1 / -1;}
.movetrack-compact-table {width:100%;border-collapse:collapse;background:#fff;font-size:12px;}
.movetrack-compact-table :is(th,td) {padding:11px 12px;border-bottom:1px solid #e2e8f0;text-align:left;}
.movetrack-compact-table th {background:#f0f6ff;font-size:11px;}
.movetrack-root[data-theme=dark] :is(.movetrack-task-outline,.movetrack-task-inspector,.movetrack-task-mobile-nav,.movetrack-task-mobile-summary,.movetrack-compact-table) {background:#14253b;border-color:#38506b;}
.movetrack-root[data-theme=dark] .movetrack-task-outline button {background:#203652;color:#ebf4ff;}
.movetrack-root[data-theme=dark] .movetrack-task-outline button[aria-current=step] {background:#285ab0;}
.movetrack-root[data-theme=dark] .movetrack-compact-table th {background:#203652;}

/* Responsive app shell: a real mobile dock, compact workspace header and one menu on every screen. */
.movetrack-root { width:100%;min-width:0; }
.movetrack-root [hidden] {display:none !important;}
.movetrack-root :where(div,section,article,main,nav,aside,header,footer,form,fieldset,label,details,summary,ul,ol,li) { min-width:0; }
.movetrack-root :where(h1,h2,h3,p,strong,small,label,a) { overflow-wrap:anywhere; }
.movetrack-root :where(img,canvas,video,svg) { max-width:100%; }
.movetrack-root :where(button,input,textarea,select) { min-width:0; }
.movetrack-root :where(button) { white-space:normal; }
.movetrack-search-categories {display:flex;flex-wrap:wrap;gap:8px;align-items:start;}
.movetrack-search-categories button {flex:0 0 auto;min-height:44px;white-space:normal;overflow-wrap:anywhere;max-width:100%;}
.movetrack-register-column-editor {display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),1fr));gap:10px;padding:12px;border:1px solid #cbd5e1;border-radius:10px;align-items:end;}
.movetrack-register-column-editor > button {justify-self:start;min-width:44px;}
.movetrack-paper-column-editor {display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;}
@media(max-width:520px){.movetrack-paper-column-editor {grid-template-columns:minmax(0,1fr);}.movetrack-paper-column-editor button {justify-self:start;}}
.movetrack-root :where(input,select,textarea) { box-sizing:border-box; }
.movetrack-step-nav {display:flex;flex-wrap:wrap;gap:7px;margin:0 0 14px;}
.movetrack-step-nav button {min-height:44px;padding:9px 12px;border:1px solid #cbd5e1;border-radius:11px;background:#fff;color:#315479;font:inherit;font-size:12px;font-weight:800;cursor:pointer;}
.movetrack-step-nav button[aria-current="step"] {background:#1d4ed8;color:#fff;border-color:#1d4ed8;}
.movetrack-step-footer {display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;border-top:1px solid #dbe5ef;padding-top:14px;margin-top:14px;}
.movetrack-step-footer button {min-height:44px;padding:10px 14px;border-radius:11px;border:1px solid #cbd5e1;background:#fff;color:#17406b;font:inherit;font-weight:800;cursor:pointer;}
.movetrack-step-footer button:last-child {background:#1d4ed8;color:#fff;}
.movetrack-workspace-surface {border:0 !important;background:transparent !important;padding:0 !important;}
.movetrack-workspace-content {max-width:1250px;margin:18px auto 0;padding:0 20px;}
.movetrack-root[data-theme="dark"] :is(.movetrack-step-nav button,.movetrack-step-footer button) {background:#203652;color:#ebf4ff;border-color:#496582;}
.movetrack-root[data-theme="dark"] .movetrack-step-nav button[aria-current="step"] {background:#285ab0;color:#fff;}
@media(max-width:520px){
 .movetrack-workspace-content {padding:0 12px;}
 .movetrack-root :where(input:not([type="checkbox"]):not([type="radio"]),select,textarea) {font-size:16px !important;}
 .movetrack-root [style*="grid-template-columns: 1fr minmax"] {grid-template-columns:minmax(0,1fr) !important;}
 .movetrack-root [style*="min-width: 250px"],.movetrack-root [style*="min-width: 220px"] {min-width:0 !important;}
 .movetrack-step-nav {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));}
 .movetrack-step-nav button {font-size:11px;padding:8px 5px;}
 .movetrack-personpicker > button {font-size:13px;}
}

.movetrack-root :where(button,input,textarea,select) { max-width:100%; }
.movetrack-root :where(section,article) { min-width:0; }
.movetrack-appbar {
 position:sticky; top:0; z-index:80; width:100%;
 background:rgba(255,255,255,.96); border-bottom:1px solid #dbe5ef;
 backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
 color:#142946;
}
.movetrack-appbar-content {max-width:1290px;margin:0 auto;min-height:67px;display:flex;align-items:center;gap:13px;padding:7px 22px;}
.movetrack-appbar button,.movetrack-nav-drawer button {font:inherit;cursor:pointer;}
.movetrack-appbar-hamburger {
 display:inline-flex;align-items:center;gap:9px;min-height:45px;min-width:45px;
 padding:9px 12px;border:1px solid #c9d6e6;border-radius:13px;
 background:#f5f8fc;color:#243e60;font-size:12px;font-weight:850;
}
.movetrack-appbar-brand {display:flex;align-items:center;gap:9px;border:0;background:transparent;min-height:44px;color:inherit;padding:0 3px;text-align:left;}
.movetrack-brand-mark {display:grid;place-items:center;background:#1d4ed8;border-radius:11px;color:#fff;width:36px;height:36px;}
.movetrack-brand-name {display:grid;line-height:1.13;white-space:nowrap;}
.movetrack-brand-name b {font-size:15px;letter-spacing:-.3px;}
.movetrack-brand-name small {font-size:9px;font-weight:800;letter-spacing:.2px;color:#64748b;margin-top:5px;}
.movetrack-appbar-divider {width:1px;height:28px;background:#dbe5ef;}
.movetrack-appbar-current {font-size:12px;font-weight:780;color:#52677f;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.movetrack-appbar-spacer {flex:1;}
.movetrack-desktop-links {display:flex;gap:3px;align-items:center;}
.movetrack-desktop-links button {background:transparent;border:0;border-radius:11px;padding:10px 13px;min-height:44px;font-size:12px;font-weight:850;color:#425974;}
.movetrack-desktop-links button:hover {background:#eef4fd;color:#1d4ed8;}
.movetrack-appbar-mode {display:flex;gap:7px;align-items:center;min-height:44px;padding:9px 12px;border-radius:11px;border:1px solid #d8e3f0;background:#fff;color:#1e426a;font-size:12px;font-weight:800;}
.movetrack-workspace-switcher {min-width:0;max-width:100%;display:flex;gap:17px;align-items:center;flex-wrap:wrap;padding:14px 16px;border:1px solid #dce7f2;background:#f8fafc;border-radius:15px;}
.movetrack-workspace-heading {display:grid;gap:3px;min-width:160px;}
.movetrack-workspace-eyebrow {font-size:10px;color:#2563eb;font-weight:900;letter-spacing:1px;}
.movetrack-workspace-heading strong {font-size:17px;}
.movetrack-workspace-heading small {color:#64748b;font-size:11px;}
.movetrack-workspace-shortcuts {min-width:0;max-width:100%;display:flex;gap:7px;align-items:center;flex-wrap:wrap;flex:1;}
.movetrack-workspace-shortcuts button {display:flex;gap:7px;align-items:center;min-height:40px;background:#fff;border:1px solid #d4e2f0;border-radius:12px;padding:8px 11px;color:#315479;font-size:11px;font-weight:830;cursor:pointer;}
.movetrack-workspace-mobile-switch {display:none;}
.movetrack-workspace-hint {font-size:10px;color:#64748b;}
.movetrack-mobile-dock {display:none;}
.movetrack-drawer-layer {position:fixed;inset:0;z-index:120;}
.movetrack-drawer-scrim {position:absolute;inset:0;display:block;width:100%;height:100%;background:rgba(4,15,31,.55);border:0;cursor:pointer;backdrop-filter:blur(3px);}
.movetrack-nav-drawer {position:absolute;top:0;bottom:0;left:0;width:min(426px,calc(100vw - 28px));background:#f8fafc;
 color:#152d4b;display:flex;flex-direction:column;box-shadow:20px 0 65px rgba(5,22,45,.26);animation:moveDrawerIn .18s ease both;}
@keyframes moveDrawerIn {from {transform:translateX(-100%);opacity:.85}to {transform:translateX(0);opacity:1}}
.movetrack-drawer-head {padding:calc(19px + env(safe-area-inset-top)) 19px 19px;display:flex;align-items:flex-start;justify-content:space-between;gap:10px;background:#0e2747;color:#fff;}
.movetrack-drawer-head strong {font-size:20px;display:block;margin:6px 0;}
.movetrack-drawer-head small {font-size:12px;color:#b9cbe4;}
.movetrack-drawer-eyebrow {font-size:10px;letter-spacing:1.4px;font-weight:900;color:#9bc6ff;margin:0;}
.movetrack-drawer-close {background:#1b3a60;color:#fff;border:1px solid #6481a6;border-radius:13px;display:grid;place-items:center;width:44px;height:44px;flex:none;}
.movetrack-drawer-scroll {overflow:auto;overscroll-behavior:contain;flex:1;min-height:0;padding:15px 15px 28px;}
.movetrack-drawer-primary {display:grid;gap:5px;}
.movetrack-drawer-primary button {display:flex;align-items:center;gap:13px;text-align:left;min-height:51px;padding:10px 11px;border:1px solid #deebf6;border-radius:12px;background:#fff;color:#16375b;font-size:13px;font-weight:840;}
.movetrack-drawer-primary button svg:last-child {margin-left:auto;color:#8296ad;}
.movetrack-drawer-group {margin-top:22px;}
.movetrack-drawer-group h3 {margin:0 0 8px;padding:0 9px;font-size:10px;font-weight:900;letter-spacing:1.3px;text-transform:uppercase;color:#64748b;}
.movetrack-drawer-list {display:grid;gap:4px;}
.movetrack-drawer-list button {width:100%;display:flex;align-items:center;text-align:left;gap:12px;min-height:57px;padding:9px 11px;
 background:transparent;border:1px solid transparent;border-radius:12px;color:#244260;}
.movetrack-drawer-list button[aria-current="page"] {background:#e6efff;border-color:#bdd4fc;color:#1d4ed8;}
.movetrack-drawer-list button:hover {background:#eaf2fc;}
.movetrack-drawer-icon {width:34px;height:34px;flex:none;display:grid;place-items:center;background:#e7eef7;border-radius:10px;}
.movetrack-drawer-item-text {display:grid;gap:3px;min-width:0;flex:1;}
.movetrack-drawer-item-text strong {font-size:13px;}
.movetrack-drawer-item-text small {color:#64748b;font-size:10.5px;}
.movetrack-chevron {color:#8294ad;flex:none;}
.movetrack-drawer-driver {margin-top:18px;display:flex;justify-content:space-between;gap:8px;background:#173764;color:#fff;text-decoration:none;border-radius:12px;padding:14px;font-weight:800;font-size:12px;}
.movetrack-drawer-footer {padding:13px 20px calc(15px + env(safe-area-inset-bottom));border-top:1px solid #e4ebf4;font-size:10px;font-weight:800;color:#64748b;background:#fff;}
.movetrack-root[data-theme="dark"] .movetrack-appbar {background:rgba(11,26,45,.97);border-color:#34506d;color:#eaf3ff;}
.movetrack-root[data-theme="dark"] :is(.movetrack-appbar-hamburger,.movetrack-appbar-mode) {background:#172d49;color:#e5f1ff;border-color:#426185;}
.movetrack-root[data-theme="dark"] .movetrack-brand-name small,.movetrack-root[data-theme="dark"] .movetrack-appbar-current {color:#b3c8e3;}
.movetrack-root[data-theme="dark"] .movetrack-desktop-links button {color:#d7e7fa;}
.movetrack-root[data-theme="dark"] .movetrack-workspace-switcher {background:#14253b;border-color:#38506b;}
.movetrack-root[data-theme="dark"] .movetrack-workspace-shortcuts button {background:#203652;color:#ebf4ff;border-color:#496582;}
.movetrack-root[data-theme="dark"] .movetrack-nav-drawer {background:#0d2036;color:#edf5ff;}
.movetrack-root[data-theme="dark"] .movetrack-drawer-scroll,.movetrack-root[data-theme="dark"] .movetrack-drawer-footer {background:#0d2036;color:#bdcee3;border-color:#35516e;}
.movetrack-root[data-theme="dark"] .movetrack-drawer-primary button {background:#1c3552;border-color:#385677;color:#edf5ff;}
.movetrack-root[data-theme="dark"] .movetrack-drawer-list button {color:#e4f0ff;}
.movetrack-root[data-theme="dark"] .movetrack-drawer-list button[aria-current="page"] {background:#1b416a;border-color:#5680a7;}
.movetrack-root[data-theme="dark"] .movetrack-drawer-list button:hover {background:#1b3553;}
.movetrack-root[data-theme="dark"] .movetrack-drawer-icon {background:#25415f;}
.movetrack-root[data-theme="dark"] .movetrack-drawer-group h3,.movetrack-root[data-theme="dark"] .movetrack-drawer-item-text small {color:#b3c6db;}
.movetrack-root :is(.movetrack-appbar button,.movetrack-nav-drawer button,.movetrack-mobile-dock button):focus-visible {outline:3px solid #60a5fa;outline-offset:2px;}
@media(max-width:860px) {
 .movetrack-root button,#movetrack-signing-tray button {min-height:44px !important;min-width:44px;}

 .movetrack-appbar-content {padding:8px 12px;min-height:60px;gap:9px;}
 .movetrack-appbar-divider,.movetrack-appbar-current,.movetrack-desktop-links,.movetrack-hamburger-label {display:none;}
 .movetrack-appbar-hamburger {padding:9px;min-width:44px;justify-content:center;}
 .movetrack-appbar-mode {min-width:43px;justify-content:center;padding:9px;}
 .movetrack-brand-mark {width:34px;height:34px;}
 .movetrack-mobile-dock {display:grid;grid-template-columns:repeat(5,minmax(0,1fr));position:fixed;bottom:0;left:0;right:0;
  z-index:85;width:100%;height:calc(70px + env(safe-area-inset-bottom));padding:7px 7px calc(8px + env(safe-area-inset-bottom));
  background:rgba(255,255,255,.97);border-top:1px solid #d9e4f0;box-shadow:0 -7px 22px rgba(13,36,68,.08);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}
 .movetrack-dock-action {display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:0;background:transparent;
  color:#62748d;font-size:10px;font-weight:800;min-width:0;min-height:52px;border-radius:11px;padding:4px 2px;cursor:pointer;}
 .movetrack-dock-action.is-active {color:#1d4ed8;background:#eaf2ff;}
 .movetrack-dock-action span {white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
 .movetrack-root[data-theme="dark"] .movetrack-mobile-dock {background:rgba(12,27,46,.98);border-color:#395574;}
 .movetrack-root[data-theme="dark"] .movetrack-dock-action {color:#c4d4ea;}
 .movetrack-root[data-theme="dark"] .movetrack-dock-action.is-active {color:#9ec7ff;background:#183d69;}
 .movetrack-root {padding-bottom:calc(98px + env(safe-area-inset-bottom)) !important;}
 #movetrack-global-search,#movetrack-workspaces,#movetrack-onboarding,#movetrack-workflow-graph {scroll-margin-top:83px !important;}
 .movetrack-workspace-switcher {display:grid;grid-template-columns:minmax(0,1fr);gap:11px;}
 .movetrack-workspace-heading {min-width:0;}
 .movetrack-workspace-shortcuts {display:none;}
 .movetrack-workspace-mobile-switch {display:grid;gap:5px;font-size:12px;font-weight:750;}
 .movetrack-workspace-mobile-switch select {width:100%;min-width:0;min-height:44px;padding:10px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;color:#173764;font:inherit;}
 .movetrack-root input[type=date],.movetrack-root input[type=time],.movetrack-root input[type=datetime-local] {display:block;width:100%;min-width:0;min-inline-size:0;max-width:100%;}
 .movetrack-root input::-webkit-date-and-time-value {text-align:left;}
 .movetrack-fleet-cards,.movetrack-fleet-entry {grid-template-columns:minmax(0,1fr) !important;}
 .movetrack-root .movetrack-fleet-card-heading {flex-wrap:wrap;}
 .movetrack-root .movetrack-fleet-card-heading strong {flex:1 1 170px;}
 .movetrack-workspace-hint {display:none;}
}
@media(max-width:520px) {
 .movetrack-brand-name b {font-size:14px;}
 .movetrack-root .movetrack-hero {padding:22px 15px 34px !important;}
 .movetrack-root .movetrack-content {padding:0 12px !important;gap:12px !important;margin-top:-19px !important;}
 .movetrack-root .movetrack-workspace-surface {padding:0 !important;}

 .movetrack-root .movetrack-workspace-switcher {padding:12px !important;}
 .movetrack-root [style*="grid-template-columns"] {min-width:0;}
}
@media(prefers-reduced-motion:reduce) {
 .movetrack-nav-drawer {animation:none;}
}
`}</style>;
}
