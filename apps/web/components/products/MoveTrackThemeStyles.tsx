"use client";
/** Override legacy inline light surfaces inside MoveTrack only, without changing report styling or other App Studio products. */
export function MoveTrackThemeStyles(){
 return <style>{`
.movetrack-desktop-modal {box-sizing:border-box;color:inherit;background:#fff;border:1px solid #cbd5e1;padding:0;border-radius:18px;}
.movetrack-desktop-modal:not([open]) {display:none;}
.movetrack-desktop-modal.is-desktop[open] {display:flex;flex-direction:column;width:min(880px,calc(100vw - 64px));max-width:calc(100vw - 64px);max-height:calc(100dvh - 64px);overflow:hidden;position:fixed;margin:auto;}
.movetrack-desktop-modal::backdrop {background:rgb(8 19 35 / .62);}
.movetrack-modal-header {display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;border-bottom:1px solid #cbd5e1;flex:none;}
.movetrack-modal-header h2 {font-size:19px;margin:0;overflow-wrap:anywhere;}
.movetrack-modal-header button,.movetrack-modal-launcher > button {min-height:44px;min-width:44px;padding:10px 16px;border:1px solid #b9cce4;border-radius:10px;background:#fff;color:#173764;font:inherit;font-size:13px;font-weight:800;cursor:pointer;}
.movetrack-modal-body {min-height:0;min-width:0;padding:20px;overflow-y:auto;overscroll-behavior:contain;}
.movetrack-desktop-modal.is-inline {position:static;width:100%;max-width:100%;max-height:none;margin:12px 0;}
.movetrack-desktop-modal.is-inline .movetrack-modal-body {padding:12px;overflow:visible;}
.movetrack-root[data-theme="dark"] .movetrack-desktop-modal {background:#14253b;color:#e9f1fb;border-color:#38506b;}
.movetrack-root[data-theme="dark"] .movetrack-modal-header {border-color:#38506b;}
.movetrack-root[data-theme="dark"] :is(.movetrack-modal-header button,.movetrack-modal-launcher > button) {background:#1d324d;color:#eff6ff;border-color:#49627e;}
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
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(16, 24, 40)"],[style*="; color: rgb(16, 24, 40)"],[style*=";color: rgb(16, 24, 40)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(21, 35, 58)"],[style*="; color: rgb(21, 35, 58)"],[style*=";color: rgb(21, 35, 58)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(52, 64, 84)"],[style*="; color: rgb(52, 64, 84)"],[style*=";color: rgb(52, 64, 84)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(17, 24, 39)"],[style*="; color: rgb(17, 24, 39)"],[style*=";color: rgb(17, 24, 39)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(20, 43, 77)"],[style*="; color: rgb(20, 43, 77)"],[style*=";color: rgb(20, 43, 77)"]) {color: #eef5ff !important;}
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(21, 52, 85)"],[style*="; color: rgb(21, 52, 85)"],[style*=";color: rgb(21, 52, 85)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(23, 55, 100)"],[style*="; color: rgb(23, 55, 100)"],[style*=";color: rgb(23, 55, 100)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(24, 43, 73)"],[style*="; color: rgb(24, 43, 73)"],[style*=";color: rgb(24, 43, 73)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(52, 65, 84)"],[style*="; color: rgb(52, 65, 84)"],[style*=";color: rgb(52, 65, 84)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(24, 49, 83)"],[style*="; color: rgb(24, 49, 83)"],[style*=";color: rgb(24, 49, 83)"]) {color: #eef5ff !important;}
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(100, 116, 139)"],[style*="; color: rgb(100, 116, 139)"],[style*=";color: rgb(100, 116, 139)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(102, 112, 133)"],[style*="; color: rgb(102, 112, 133)"],[style*=";color: rgb(102, 112, 133)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(71, 85, 105)"],[style*="; color: rgb(71, 85, 105)"],[style*=";color: rgb(71, 85, 105)"]) {color: #bacbe0 !important;}
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

.movetrack-root[data-theme="dark"] :is([style^="color: rgb(29, 78, 216)"],[style*="; color: rgb(29, 78, 216)"],[style*=";color: rgb(29, 78, 216)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(37, 99, 235)"],[style*="; color: rgb(37, 99, 235)"],[style*=";color: rgb(37, 99, 235)"]) {color:#93c5fd !important;}

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
.movetrack-workspace-mobile-switch {display:grid;gap:5px;flex:0 1 220px;min-width:190px;font-size:12px;font-weight:750;}
.movetrack-workspace-mobile-switch select {width:100%;min-height:44px;padding:9px;border:1px solid var(--mt-border,#cbd5e1);border-radius:10px;background:var(--mt-surface,#fff);color:var(--mt-ink,#173764);font:inherit;}
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
 .movetrack-mobile-dock {display:grid;grid-template-columns:repeat(6,minmax(0,1fr));position:fixed;bottom:0;left:0;right:0;
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
@media(max-width:360px) {
 .movetrack-mobile-dock {padding-inline:3px;}
 .movetrack-dock-action {font-size:9px;gap:2px;padding-inline:1px;}
 .movetrack-dock-action svg {width:21px;height:21px;}
 .movetrack-appbar-brand {gap:6px;}
 .movetrack-brand-name b {font-size:13px;}
}
/* Driver app shares theme preference but retains its own compact five-action mobile dock. */
.movetrack-driver-theme[data-theme="dark"] nav[aria-label="Driver mobile primary navigation"] {
 background:rgba(12,27,46,.98) !important;border-color:#385574 !important;
}
.movetrack-driver-theme[data-theme="dark"] nav[aria-label="Driver mobile primary navigation"] button {
 color:#c4d6eb !important;background:transparent !important;
}
.movetrack-driver-theme[data-theme="dark"] nav[aria-label="Driver mobile primary navigation"] button[aria-current="page"] {
 color:#a9d2ff !important;background:#193e68 !important;
}
.movetrack-driver-theme[data-theme="dark"] #movetrack-driver-drawer button[aria-current="page"] {
 color:#f0f6ff !important;background:#254569 !important;
}
@media(prefers-reduced-motion:reduce) {
 .movetrack-nav-drawer {animation:none;}
}

/* Shared MoveTrack semantic contrast tokens: dark colors remain readable even in legacy inline components.
   Reports and print documents deliberately do not inherit this scope. */
.movetrack-root[data-theme="light"] {
 --mt-company-hero-bg:linear-gradient(110deg,#ffffff,#eaf2ff);
 --mt-company-hero-ink:#172b46;--mt-company-hero-muted:#516078;
 --mt-company-hero-border:#bfd4fa;
 --mt-ink:#172b46;--mt-muted:#516078;--mt-link:#174fa8;--mt-surface:#fff;
 --mt-surface-soft:#f3f7fc;--mt-border:#d8e3f0;
 --mt-danger:#a51d2d;--mt-warning:#905a09;--mt-success:#087454;
}
.movetrack-root[data-theme="dark"] {
 --mt-company-hero-bg:linear-gradient(110deg,#172e4b,#1a3a63);
 --mt-company-hero-ink:#f5f9ff;--mt-company-hero-muted:#c5d7ed;
 --mt-company-hero-border:#4f709b;
 --mt-ink:#f0f6ff;--mt-muted:#becee2;--mt-link:#a9d2ff;--mt-surface:#162940;
 --mt-surface-soft:#1d344f;--mt-border:#496380;
 --mt-danger:#ffabb5;--mt-warning:#fbd58b;--mt-success:#86efc0;
}
.movetrack-root[data-theme="dark"] :is(input:not([type="checkbox"]):not([type="radio"]),select,textarea) {
 background-color:var(--mt-surface-soft) !important;
 color:var(--mt-ink) !important;
 border-color:var(--mt-border) !important;
}
.movetrack-root[data-theme="dark"] :is(input,textarea)::placeholder {color:var(--mt-muted) !important;opacity:1;}
.movetrack-root[data-theme="dark"] :is(button,a,summary) {text-decoration-color:currentColor;}
.movetrack-root[data-theme="dark"] :is(button,input,select,textarea):disabled {opacity:.7;}
/* Light panels, info strips and tinted cards must remain distinct from the surrounding dark shell. */
.movetrack-root[data-theme="dark"] [style*="background: #fff"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(255, 255, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: #ffffff"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(255, 255, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: #f8fafc"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(248, 250, 252)"],
.movetrack-root[data-theme="dark"] [style*="background: #f8fbff"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(248, 251, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: #f3f7fc"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(243, 247, 252)"],
.movetrack-root[data-theme="dark"] [style*="background: #f3f5f7"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(243, 245, 247)"],
.movetrack-root[data-theme="dark"] [style*="background: #f1f5f9"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(241, 245, 249)"],
.movetrack-root[data-theme="dark"] [style*="background: #f1f5fa"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(241, 245, 250)"],
.movetrack-root[data-theme="dark"] [style*="background: #f0f6ff"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(240, 246, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: #eff6ff"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(239, 246, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: #eaf2ff"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(234, 242, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: #eef4fd"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(238, 244, 253)"],
.movetrack-root[data-theme="dark"] [style*="background: #ecfdf5"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(236, 253, 245)"],
.movetrack-root[data-theme="dark"] [style*="background: #fff1f2"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(255, 241, 242)"],
.movetrack-root[data-theme="dark"] [style*="background: #fef2f2"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(254, 242, 242)"],
.movetrack-root[data-theme="dark"] [style*="background: #fffbeb"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(255, 251, 235)"],
.movetrack-root[data-theme="dark"] [style*="background: #dbeafe"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(219, 234, 254)"],
.movetrack-root[data-theme="dark"] [style*="background: #e2e8f0"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(226, 232, 240)"] {
 background:var(--mt-surface) !important;
 background-color:var(--mt-surface) !important;
 border-color:var(--mt-border) !important;
}

/* Form review, choice, due/overdue and completion strips should not retain pale light-mode
   fills after their foreground changes to pale accessible dark-mode colors. */
.movetrack-root[data-theme="dark"] [style*="background: #ecfdf3"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(236, 253, 243)"],
.movetrack-root[data-theme="dark"] [style*="background: #fef3f2"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(254, 243, 242)"],
.movetrack-root[data-theme="dark"] [style*="background: #f2f4f7"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(242, 244, 247)"],
.movetrack-root[data-theme="dark"] [style*="background: #fff7ed"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(255, 247, 237)"],
.movetrack-root[data-theme="dark"] [style*="background: #e8f1ff"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(232, 241, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: #eaf2fc"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(234, 242, 252)"],
.movetrack-root[data-theme="dark"] [style*="background: #e6efff"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(230, 239, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: #e7eef7"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(231, 238, 247)"],
.movetrack-root[data-theme="dark"] [style*="background: #ecfdf5"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(236, 253, 245)"],
.movetrack-root[data-theme="dark"] [style*="background: #fffaf0"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(255, 250, 240)"],
.movetrack-root[data-theme="dark"] [style*="background: #fff5e8"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(255, 245, 232)"],
.movetrack-root[data-theme="dark"] [style*="background: #fff3e0"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(255, 243, 224)"],
.movetrack-root[data-theme="dark"] [style*="background: #f0fdf4"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(240, 253, 244)"],
.movetrack-root[data-theme="dark"] [style*="background: #f0f9ff"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(240, 249, 255)"],
.movetrack-root[data-theme="dark"] [style*="background: #fff8e6"],
.movetrack-root[data-theme="dark"] [style*="background: rgb(255, 248, 230)"] {
 background:var(--mt-surface-soft) !important;
 background-color:var(--mt-surface-soft) !important;
 border-color:var(--mt-border) !important;
}
/* Semantic text colors: override only legacy hard-coded ink/muted/status/link values.
   Intentionally white-on-blue actions and dark-hero headings are untouched. */
.movetrack-root[data-theme="dark"] :is([style^="color: #101827"],[style*="; color: #101827"],[style*=";color: #101827"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(16, 24, 39)"],[style*="; color: rgb(16, 24, 39)"],[style*=";color: rgb(16, 24, 39)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #101828"],[style*="; color: #101828"],[style*=";color: #101828"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(16, 24, 40)"],[style*="; color: rgb(16, 24, 40)"],[style*=";color: rgb(16, 24, 40)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #102033"],[style*="; color: #102033"],[style*=";color: #102033"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(16, 32, 51)"],[style*="; color: rgb(16, 32, 51)"],[style*=";color: rgb(16, 32, 51)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #111827"],[style*="; color: #111827"],[style*=";color: #111827"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(17, 24, 39)"],[style*="; color: rgb(17, 24, 39)"],[style*=";color: rgb(17, 24, 39)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #111c2e"],[style*="; color: #111c2e"],[style*=";color: #111c2e"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(17, 28, 46)"],[style*="; color: rgb(17, 28, 46)"],[style*=";color: rgb(17, 28, 46)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #142236"],[style*="; color: #142236"],[style*=";color: #142236"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(20, 34, 54)"],[style*="; color: rgb(20, 34, 54)"],[style*=";color: rgb(20, 34, 54)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #142946"],[style*="; color: #142946"],[style*=";color: #142946"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(20, 41, 70)"],[style*="; color: rgb(20, 41, 70)"],[style*=";color: rgb(20, 41, 70)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #15233a"],[style*="; color: #15233a"],[style*=";color: #15233a"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(21, 35, 58)"],[style*="; color: rgb(21, 35, 58)"],[style*=";color: rgb(21, 35, 58)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #152d50"],[style*="; color: #152d50"],[style*=";color: #152d50"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(21, 45, 80)"],[style*="; color: rgb(21, 45, 80)"],[style*=";color: rgb(21, 45, 80)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #153455"],[style*="; color: #153455"],[style*=";color: #153455"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(21, 52, 85)"],[style*="; color: rgb(21, 52, 85)"],[style*=";color: rgb(21, 52, 85)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #16375b"],[style*="; color: #16375b"],[style*=";color: #16375b"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(22, 55, 91)"],[style*="; color: rgb(22, 55, 91)"],[style*=";color: rgb(22, 55, 91)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #172b4d"],[style*="; color: #172b4d"],[style*=";color: #172b4d"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(23, 43, 77)"],[style*="; color: rgb(23, 43, 77)"],[style*=";color: rgb(23, 43, 77)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #173764"],[style*="; color: #173764"],[style*=";color: #173764"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(23, 55, 100)"],[style*="; color: rgb(23, 55, 100)"],[style*=";color: rgb(23, 55, 100)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #17406b"],[style*="; color: #17406b"],[style*=";color: #17406b"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(23, 64, 107)"],[style*="; color: rgb(23, 64, 107)"],[style*=";color: rgb(23, 64, 107)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #174272"],[style*="; color: #174272"],[style*=";color: #174272"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(23, 66, 114)"],[style*="; color: rgb(23, 66, 114)"],[style*=";color: rgb(23, 66, 114)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #174b87"],[style*="; color: #174b87"],[style*=";color: #174b87"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(23, 75, 135)"],[style*="; color: rgb(23, 75, 135)"],[style*=";color: rgb(23, 75, 135)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #182b49"],[style*="; color: #182b49"],[style*=";color: #182b49"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(24, 43, 73)"],[style*="; color: rgb(24, 43, 73)"],[style*=";color: rgb(24, 43, 73)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #183454"],[style*="; color: #183454"],[style*=";color: #183454"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(24, 52, 84)"],[style*="; color: rgb(24, 52, 84)"],[style*=";color: rgb(24, 52, 84)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #193756"],[style*="; color: #193756"],[style*=";color: #193756"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(25, 55, 86)"],[style*="; color: rgb(25, 55, 86)"],[style*=";color: rgb(25, 55, 86)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #1e3a5f"],[style*="; color: #1e3a5f"],[style*=";color: #1e3a5f"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(30, 58, 95)"],[style*="; color: rgb(30, 58, 95)"],[style*=";color: rgb(30, 58, 95)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #243e60"],[style*="; color: #243e60"],[style*=";color: #243e60"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(36, 62, 96)"],[style*="; color: rgb(36, 62, 96)"],[style*=";color: rgb(36, 62, 96)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #244260"],[style*="; color: #244260"],[style*=";color: #244260"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(36, 66, 96)"],[style*="; color: rgb(36, 66, 96)"],[style*=";color: rgb(36, 66, 96)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #315479"],[style*="; color: #315479"],[style*=";color: #315479"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(49, 84, 121)"],[style*="; color: rgb(49, 84, 121)"],[style*=";color: rgb(49, 84, 121)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #344054"],[style*="; color: #344054"],[style*=";color: #344054"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(52, 64, 84)"],[style*="; color: rgb(52, 64, 84)"],[style*=";color: rgb(52, 64, 84)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #364152"],[style*="; color: #364152"],[style*=";color: #364152"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(54, 65, 82)"],[style*="; color: rgb(54, 65, 82)"],[style*=";color: rgb(54, 65, 82)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #1e426a"],[style*="; color: #1e426a"],[style*=";color: #1e426a"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(30, 66, 106)"],[style*="; color: rgb(30, 66, 106)"],[style*=";color: rgb(30, 66, 106)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #425974"],[style*="; color: #425974"],[style*=";color: #425974"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(66, 89, 116)"],[style*="; color: rgb(66, 89, 116)"],[style*=";color: rgb(66, 89, 116)"]){color:var(--mt-ink) !important;}
.movetrack-root[data-theme="dark"] :is([style^="color: #475467"],[style*="; color: #475467"],[style*=";color: #475467"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(71, 84, 103)"],[style*="; color: rgb(71, 84, 103)"],[style*=";color: rgb(71, 84, 103)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #475569"],[style*="; color: #475569"],[style*=";color: #475569"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(71, 85, 105)"],[style*="; color: rgb(71, 85, 105)"],[style*=";color: rgb(71, 85, 105)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #51627b"],[style*="; color: #51627b"],[style*=";color: #51627b"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(81, 98, 123)"],[style*="; color: rgb(81, 98, 123)"],[style*=";color: rgb(81, 98, 123)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #52677f"],[style*="; color: #52677f"],[style*=";color: #52677f"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(82, 103, 127)"],[style*="; color: rgb(82, 103, 127)"],[style*=";color: rgb(82, 103, 127)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #53647e"],[style*="; color: #53647e"],[style*=";color: #53647e"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(83, 100, 126)"],[style*="; color: rgb(83, 100, 126)"],[style*=";color: rgb(83, 100, 126)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #64748b"],[style*="; color: #64748b"],[style*=";color: #64748b"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(100, 116, 139)"],[style*="; color: rgb(100, 116, 139)"],[style*=";color: rgb(100, 116, 139)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #667085"],[style*="; color: #667085"],[style*=";color: #667085"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(102, 112, 133)"],[style*="; color: rgb(102, 112, 133)"],[style*=";color: rgb(102, 112, 133)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #98a2b3"],[style*="; color: #98a2b3"],[style*=";color: #98a2b3"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(152, 162, 179)"],[style*="; color: rgb(152, 162, 179)"],[style*=";color: rgb(152, 162, 179)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #9fb2ca"],[style*="; color: #9fb2ca"],[style*=";color: #9fb2ca"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(159, 178, 202)"],[style*="; color: rgb(159, 178, 202)"],[style*=";color: rgb(159, 178, 202)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #8296ad"],[style*="; color: #8296ad"],[style*=";color: #8296ad"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(130, 150, 173)"],[style*="; color: rgb(130, 150, 173)"],[style*=";color: rgb(130, 150, 173)"]){color:var(--mt-muted) !important;}
.movetrack-root[data-theme="dark"] :is([style^="color: #1d4ed8"],[style*="; color: #1d4ed8"],[style*=";color: #1d4ed8"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(29, 78, 216)"],[style*="; color: rgb(29, 78, 216)"],[style*=";color: rgb(29, 78, 216)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #2563eb"],[style*="; color: #2563eb"],[style*=";color: #2563eb"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(37, 99, 235)"],[style*="; color: rgb(37, 99, 235)"],[style*=";color: rgb(37, 99, 235)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #1e40af"],[style*="; color: #1e40af"],[style*=";color: #1e40af"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(30, 64, 175)"],[style*="; color: rgb(30, 64, 175)"],[style*=";color: rgb(30, 64, 175)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #174fa8"],[style*="; color: #174fa8"],[style*=";color: #174fa8"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(23, 79, 168)"],[style*="; color: rgb(23, 79, 168)"],[style*=";color: rgb(23, 79, 168)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #143b66"],[style*="; color: #143b66"],[style*=";color: #143b66"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(20, 59, 102)"],[style*="; color: rgb(20, 59, 102)"],[style*=";color: rgb(20, 59, 102)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #174b87"],[style*="; color: #174b87"],[style*=";color: #174b87"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(23, 75, 135)"],[style*="; color: rgb(23, 75, 135)"],[style*=";color: rgb(23, 75, 135)"]){color:var(--mt-link) !important;}
.movetrack-root[data-theme="dark"] :is([style^="color: #b42318"],[style*="; color: #b42318"],[style*=";color: #b42318"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(180, 35, 24)"],[style*="; color: rgb(180, 35, 24)"],[style*=";color: rgb(180, 35, 24)"]){color:var(--mt-danger) !important;}
.movetrack-root[data-theme="dark"] :is([style^="color: #b45309"],[style*="; color: #b45309"],[style*=";color: #b45309"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(180, 83, 9)"],[style*="; color: rgb(180, 83, 9)"],[style*=";color: rgb(180, 83, 9)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #a16207"],[style*="; color: #a16207"],[style*=";color: #a16207"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(161, 98, 7)"],[style*="; color: rgb(161, 98, 7)"],[style*=";color: rgb(161, 98, 7)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #92400e"],[style*="; color: #92400e"],[style*=";color: #92400e"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(146, 64, 14)"],[style*="; color: rgb(146, 64, 14)"],[style*=";color: rgb(146, 64, 14)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #9a670a"],[style*="; color: #9a670a"],[style*=";color: #9a670a"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(154, 103, 10)"],[style*="; color: rgb(154, 103, 10)"],[style*=";color: rgb(154, 103, 10)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #9a670d"],[style*="; color: #9a670d"],[style*=";color: #9a670d"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(154, 103, 13)"],[style*="; color: rgb(154, 103, 13)"],[style*=";color: rgb(154, 103, 13)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #915b16"],[style*="; color: #915b16"],[style*=";color: #915b16"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(145, 91, 22)"],[style*="; color: rgb(145, 91, 22)"],[style*=";color: rgb(145, 91, 22)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #9a6310"],[style*="; color: #9a6310"],[style*=";color: #9a6310"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(154, 99, 16)"],[style*="; color: rgb(154, 99, 16)"],[style*=";color: rgb(154, 99, 16)"]){color:var(--mt-warning) !important;}
.movetrack-root[data-theme="dark"] :is([style^="color: #047857"],[style*="; color: #047857"],[style*=";color: #047857"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(4, 120, 87)"],[style*="; color: rgb(4, 120, 87)"],[style*=";color: rgb(4, 120, 87)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #087f5b"],[style*="; color: #087f5b"],[style*=";color: #087f5b"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(8, 127, 91)"],[style*="; color: rgb(8, 127, 91)"],[style*=";color: rgb(8, 127, 91)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #087e8b"],[style*="; color: #087e8b"],[style*=";color: #087e8b"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(8, 126, 139)"],[style*="; color: rgb(8, 126, 139)"],[style*=";color: rgb(8, 126, 139)"]){color:var(--mt-success) !important;}
.movetrack-root[data-theme="dark"] :is(.movetrack-step-nav button,.movetrack-step-footer button,.movetrack-task-outline button) {
 color:var(--mt-ink) !important;
}
.movetrack-root[data-theme="dark"] :is(.movetrack-step-nav button[aria-current="step"],.movetrack-step-footer button:last-child,
.movetrack-task-outline button[aria-current="step"]) {color:#fff !important;}
.movetrack-root[data-theme="dark"] .movetrack-desktop-modal {background:var(--mt-surface);color:var(--mt-ink);}
.movetrack-root[data-theme="dark"] :is(.movetrack-desktop-modal,.movetrack-modal-body,.movetrack-task-editor) {color:var(--mt-ink);}
.movetrack-root[data-theme="dark"] :is(.movetrack-compact-table th,.movetrack-compact-table td) {color:var(--mt-ink);border-color:var(--mt-border);}
.movetrack-root[data-theme="dark"] .movetrack-workspace-heading small {color:var(--mt-muted);}
.movetrack-root[data-theme="dark"] .movetrack-appbar-brand b {color:#f0f6ff;}

/* Root-level contrast contract used by every MoveTrack module. */
.movetrack-root[data-theme="dark"] {
 --mt-text-primary:#f7fbff;
 --mt-text-secondary:#cad8ea;
 --mt-text-link:#acd3ff;
 --mt-text-critical:#ffb5bf;
 --mt-text-warning:#ffde9e;
 --mt-text-positive:#91efbf;
 --mt-success-bg:#173f35;--mt-danger-bg:#40212d;--mt-warning-bg:#413623;
}
.movetrack-root[data-theme="dark"] :is(.movetrack-workspace-switcher,.movetrack-workspace-surface,.movetrack-task-workspace,
 .movetrack-task-editor,.movetrack-task-mobile-nav,.movetrack-task-mobile-summary,
 .movetrack-desktop-modal,.movetrack-nav-drawer,.movetrack-workspace-content) {
 color:var(--mt-text-primary);
}
.movetrack-root[data-theme="dark"] :is(.movetrack-workspace-switcher,.movetrack-task-outline,.movetrack-task-inspector,
 .movetrack-workspace-shortcuts button,.movetrack-step-nav button,.movetrack-step-footer button,
 .movetrack-modal-launcher > button) {
 border-color:var(--mt-border);
}
/* Text controls use their own dark surface, never dark text on a darkened light card. */
.movetrack-root[data-theme="light"] {
 --mt-success-bg:#ecfdf3;--mt-danger-bg:#fef3f2;--mt-warning-bg:#fff7ed;
}
.movetrack-root[data-theme="dark"] :is(button,summary,option) { color-scheme:dark; }
.movetrack-root[data-theme="dark"] input[type="file"]::file-selector-button {
 background:var(--mt-surface-soft);color:var(--mt-ink);border:1px solid var(--mt-border);border-radius:8px;
}
.movetrack-root[data-theme="dark"] :is(input,select,textarea):focus-visible {
 outline:3px solid #93c5fd;outline-offset:2px;
}
/* Preserve strong contrast in author-provided white-on-blue actions and icon badges. */
.movetrack-root[data-theme="dark"] button[style*="background: rgb(23, 79, 168)"],
.movetrack-root[data-theme="dark"] button[style*="background: #174fa8"],
.movetrack-root[data-theme="dark"] button[style*="background: rgb(29, 78, 216)"],
.movetrack-root[data-theme="dark"] button[style*="background: #1d4ed8"],
.movetrack-root[data-theme="dark"] button[style*="background: rgb(37, 99, 235)"],
.movetrack-root[data-theme="dark"] button[style*="background: #2563eb"] {
 color:#fff !important;
}
.movetrack-root[data-theme="dark"] .movetrack-workspace-mobile-switch,
.movetrack-root[data-theme="dark"] .movetrack-workspace-heading {color:var(--mt-text-primary);}

/* Remaining explicit text colors from SHE forms, JRA, meetings, fleet release,
   OCR, attendance, signatures, personnel pickers and driver screens. */
.movetrack-root[data-theme="dark"] :is([style^="color: #101d33"],[style*="; color: #101d33"],[style*=";color: #101d33"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(16, 29, 51)"],[style*="; color: rgb(16, 29, 51)"],[style*=";color: rgb(16, 29, 51)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #163866"],[style*="; color: #163866"],[style*=";color: #163866"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(22, 56, 102)"],[style*="; color: rgb(22, 56, 102)"],[style*=";color: rgb(22, 56, 102)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #0b1930"],[style*="; color: #0b1930"],[style*=";color: #0b1930"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(11, 25, 48)"],[style*="; color: rgb(11, 25, 48)"],[style*=";color: rgb(11, 25, 48)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #0c1d32"],[style*="; color: #0c1d32"],[style*=";color: #0c1d32"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(12, 29, 50)"],[style*="; color: rgb(12, 29, 50)"],[style*=";color: rgb(12, 29, 50)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #14305b"],[style*="; color: #14305b"],[style*=";color: #14305b"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(20, 48, 91)"],[style*="; color: rgb(20, 48, 91)"],[style*=";color: rgb(20, 48, 91)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #112b4e"],[style*="; color: #112b4e"],[style*=";color: #112b4e"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(17, 43, 78)"],[style*="; color: rgb(17, 43, 78)"],[style*=";color: rgb(17, 43, 78)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #183b63"],[style*="; color: #183b63"],[style*=";color: #183b63"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(24, 59, 99)"],[style*="; color: rgb(24, 59, 99)"],[style*=";color: rgb(24, 59, 99)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #122742"],[style*="; color: #122742"],[style*=";color: #122742"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(18, 39, 66)"],[style*="; color: rgb(18, 39, 66)"],[style*=";color: rgb(18, 39, 66)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #334155"],[style*="; color: #334155"],[style*=";color: #334155"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(51, 65, 85)"],[style*="; color: rgb(51, 65, 85)"],[style*=";color: rgb(51, 65, 85)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #153553"],[style*="; color: #153553"],[style*=";color: #153553"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(21, 53, 83)"],[style*="; color: rgb(21, 53, 83)"],[style*=";color: rgb(21, 53, 83)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #173d68"],[style*="; color: #173d68"],[style*=";color: #173d68"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(23, 61, 104)"],[style*="; color: rgb(23, 61, 104)"],[style*=";color: rgb(23, 61, 104)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #245387"],[style*="; color: #245387"],[style*=";color: #245387"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(36, 83, 135)"],[style*="; color: rgb(36, 83, 135)"],[style*=";color: rgb(36, 83, 135)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #24415e"],[style*="; color: #24415e"],[style*=";color: #24415e"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(36, 65, 94)"],[style*="; color: rgb(36, 65, 94)"],[style*=";color: rgb(36, 65, 94)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #16355a"],[style*="; color: #16355a"],[style*=";color: #16355a"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(22, 53, 90)"],[style*="; color: rgb(22, 53, 90)"],[style*=";color: rgb(22, 53, 90)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #526987"],[style*="; color: #526987"],[style*=";color: #526987"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(82, 105, 135)"],[style*="; color: rgb(82, 105, 135)"],[style*=";color: rgb(82, 105, 135)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #153a62"],[style*="; color: #153a62"],[style*=";color: #153a62"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(21, 58, 98)"],[style*="; color: rgb(21, 58, 98)"],[style*=";color: rgb(21, 58, 98)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #162b45"],[style*="; color: #162b45"],[style*=";color: #162b45"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(22, 43, 69)"],[style*="; color: rgb(22, 43, 69)"],[style*=";color: rgb(22, 43, 69)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #16385f"],[style*="; color: #16385f"],[style*=";color: #16385f"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(22, 56, 95)"],[style*="; color: rgb(22, 56, 95)"],[style*=";color: rgb(22, 56, 95)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #183153"],[style*="; color: #183153"],[style*=";color: #183153"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(24, 49, 83)"],[style*="; color: rgb(24, 49, 83)"],[style*=";color: rgb(24, 49, 83)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #123257"],[style*="; color: #123257"],[style*=";color: #123257"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(18, 50, 87)"],[style*="; color: rgb(18, 50, 87)"],[style*=";color: rgb(18, 50, 87)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #153452"],[style*="; color: #153452"],[style*=";color: #153452"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(21, 52, 82)"],[style*="; color: rgb(21, 52, 82)"],[style*=";color: rgb(21, 52, 82)"]) {color:var(--mt-ink) !important;}
.movetrack-root[data-theme="dark"] :is([style^="color: #1849a9"],[style*="; color: #1849a9"],[style*=";color: #1849a9"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(24, 73, 169)"],[style*="; color: rgb(24, 73, 169)"],[style*=";color: rgb(24, 73, 169)"]) {color:var(--mt-link) !important;}
.movetrack-root[data-theme="dark"] :is([style^="color: #9a3412"],[style*="; color: #9a3412"],[style*=";color: #9a3412"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(154, 52, 18)"],[style*="; color: rgb(154, 52, 18)"],[style*=";color: rgb(154, 52, 18)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #8a5210"],[style*="; color: #8a5210"],[style*=";color: #8a5210"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(138, 82, 16)"],[style*="; color: rgb(138, 82, 16)"],[style*=";color: rgb(138, 82, 16)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #99671b"],[style*="; color: #99671b"],[style*=";color: #99671b"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(153, 103, 27)"],[style*="; color: rgb(153, 103, 27)"],[style*=";color: rgb(153, 103, 27)"]),
.movetrack-root[data-theme="dark"] :is([style^="color: #7a4c24"],[style*="; color: #7a4c24"],[style*=";color: #7a4c24"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(122, 76, 36)"],[style*="; color: rgb(122, 76, 36)"],[style*=";color: rgb(122, 76, 36)"]) {color:var(--mt-warning) !important;}
.movetrack-root[data-theme="dark"] :is([style^="color: #98a2b3"],[style*="; color: #98a2b3"],[style*=";color: #98a2b3"]),
.movetrack-root[data-theme="dark"] :is([style^="color: rgb(152, 162, 179)"],[style*="; color: rgb(152, 162, 179)"],[style*=";color: rgb(152, 162, 179)"]) {color:var(--mt-muted) !important;}

/* Theme transitions preserve legibility during light/dark changes rather than leaving mixed styles.
   Avoid transitions for reduced-motion users. */
.movetrack-root,
.movetrack-root :where(.movetrack-desktop-modal,.movetrack-workspace-switcher,.movetrack-task-outline,
 .movetrack-task-inspector,.movetrack-task-mobile-summary,.movetrack-nav-drawer,
 article,section,button,select,input,textarea) {
 transition-property:background-color,color,border-color;
 transition-duration:180ms;
 transition-timing-function:ease-out;
}
@media(prefers-reduced-motion:reduce){
 .movetrack-root,
 .movetrack-root :where(.movetrack-desktop-modal,.movetrack-workspace-switcher,.movetrack-task-outline,
 .movetrack-task-inspector,.movetrack-task-mobile-summary,.movetrack-nav-drawer,
 article,section,button,select,input,textarea) {transition-duration:0ms;}
}


/* Chunk 1: explicit, paired surfaces and foregrounds for the exact Company
   onboarding and Fleet KPI screens. Avoid ancestor-wide color overrides. */
.movetrack-root[data-theme="light"] .movetrack-company-setup-hero {
 background:linear-gradient(110deg,#fff,#eaf2ff) !important;
 color:#172b46 !important;border-color:#bfd4fa !important;
}
.movetrack-root[data-theme="light"] .movetrack-company-hero-title {color:#172b46 !important;}
.movetrack-root[data-theme="light"] .movetrack-company-hero-description {color:#516078 !important;}
.movetrack-root[data-theme="light"] .movetrack-company-hero-eyebrow {color:#174fa8 !important;}
.movetrack-root[data-theme="dark"] .movetrack-company-setup-hero {
 background:linear-gradient(110deg,#172e4b,#1a3a63) !important;
 background-color:#172e4b !important;color:#f5f9ff !important;
 border-color:#52759e !important;
}
.movetrack-root[data-theme="dark"] .movetrack-company-hero-title {color:#f5f9ff !important;}
.movetrack-root[data-theme="dark"] .movetrack-company-hero-description {color:#c5d7ed !important;}
.movetrack-root[data-theme="dark"] .movetrack-company-hero-eyebrow {color:#add2ff !important;}
.movetrack-root[data-theme="dark"] :is(.movetrack-company-edit,.movetrack-company-start) {
 color:#f5f9ff !important;background:#253e5e !important;
 border-color:#6a88ab !important;
}
.movetrack-root[data-theme="light"] :is(.movetrack-company-edit,.movetrack-company-start) {
 color:#172b46 !important;background:#f1f6ff !important;border-color:#b3c8e7 !important;
}
.movetrack-root :is(.movetrack-company-add) {
 color:#fff !important;background:#2152b3 !important;border-color:#2152b3 !important;
}
.movetrack-root[data-theme="light"] .movetrack-company-import {
 color:#172b46 !important;background:#f1f6ff !important;border-color:#b3c8e7 !important;
}
.movetrack-root[data-theme="dark"] .movetrack-company-import {
 color:#f5f9ff !important;background:#253e5e !important;border-color:#6a88ab !important;
}
.movetrack-root[data-theme="light"] .movetrack-control-stat {
 background:#fff !important;color:#172b46 !important;border-color:#d8e3f0 !important;
}
.movetrack-root[data-theme="light"] .movetrack-control-stat-label {color:#516078 !important;}
.movetrack-root[data-theme="light"] .movetrack-control-stat-value {color:#172b46 !important;}
.movetrack-root[data-theme="dark"] .movetrack-control-stat {
 background:#162940 !important;color:#f5f9ff !important;border-color:#496380 !important;
}
.movetrack-root[data-theme="dark"] .movetrack-control-stat-label {color:#c5d7ed !important;}
.movetrack-root[data-theme="dark"] .movetrack-control-stat-value {color:#f5f9ff !important;}
.movetrack-root[data-theme="dark"] .movetrack-control-stat-value.is-danger {color:#ffabb5 !important;}
.movetrack-root[data-theme="light"] .movetrack-control-stat-value.is-danger {color:#a51d2d !important;}

/* Theme tokens also keep common secondary action labels visible on dark cards. */
.movetrack-root[data-theme="dark"] :is(.movetrack-task-mobile-nav,.movetrack-task-mobile-summary) {color:var(--mt-ink);}


/* Responsive text contract: grow to content, wrap long data, preserve semantics. */
.movetrack-root .movetrack-readable-text,.movetrack-root .movetrack-rich-content {
 min-inline-size:0;max-inline-size:100%;overflow-wrap:anywhere;word-break:normal;white-space:normal;line-height:1.55;
}
.movetrack-root .movetrack-readable-text {display:block;margin:0;}
.movetrack-root .movetrack-readable-text[data-variant="heading"] {font-weight:800;line-height:1.3;text-wrap:pretty;}
.movetrack-root .movetrack-readable-text[data-variant="meta"] {font-size:0.8rem;line-height:1.5;}
.movetrack-root .movetrack-readable-text[data-preserve-lines="true"] {white-space:pre-wrap;}
.movetrack-root :is(.movetrack-readable-text,.movetrack-rich-content)[data-tone="primary"] {color:var(--mt-ink,#172b46);}
.movetrack-root :is(.movetrack-readable-text,.movetrack-rich-content)[data-tone="muted"] {color:var(--mt-muted,#516078);}
.movetrack-root :is(.movetrack-readable-text,.movetrack-rich-content)[data-tone="link"] {color:var(--mt-link,#174fa8);}
.movetrack-root :is(.movetrack-readable-text,.movetrack-rich-content)[data-tone="danger"] {color:var(--mt-danger,#a51d2d);}
.movetrack-root :is(.movetrack-readable-text,.movetrack-rich-content)[data-tone="warning"] {color:var(--mt-warning,#905a09);}
.movetrack-root :is(.movetrack-readable-text,.movetrack-rich-content)[data-tone="success"] {color:var(--mt-success,#087454);}
.movetrack-root .movetrack-rich-content {display:grid;gap:0.65rem;font-size:0.875rem;}
.movetrack-root .movetrack-rich-content :is(p,h2,h3,ul,ol,blockquote,li) {
 min-width:0;max-width:100%;overflow-wrap:anywhere;white-space:normal;line-height:1.65;margin:0;
}
.movetrack-root .movetrack-rich-content :is(ul,ol) {padding-inline-start:1.5rem;}
.movetrack-root .movetrack-rich-content li {padding-block:0.1rem;}
.movetrack-root .movetrack-rich-content h2 {font-size:clamp(1.1rem,1.04rem + 0.5vw,1.35rem);line-height:1.35;}
.movetrack-root .movetrack-rich-content h3 {font-size:clamp(1rem,0.97rem + 0.4vw,1.2rem);line-height:1.4;}
.movetrack-root .movetrack-rich-content blockquote {border-inline-start:3px solid var(--mt-border,#d8e3f0);padding-inline-start:1rem;}
.movetrack-root .movetrack-rich-content code {
 overflow-wrap:anywhere;border-radius:0.25rem;padding:0.1rem 0.25rem;
 background:var(--mt-surface-soft,#f3f7fc);color:var(--mt-ink,#172b46);
}
.movetrack-root .movetrack-rich-content a {color:var(--mt-link,#174fa8);text-decoration:underline;text-underline-offset:2px;}

`}</style>;
}
