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
@media (max-width: 640px) {
 .movetrack-root [aria-label="MoveTrack workspace navigation"] {padding:11px !important;}
 .movetrack-root [aria-label="MoveTrack workspace navigation"] > div:nth-child(2) {grid-template-columns: repeat(2,minmax(0,1fr)) !important;}
 .movetrack-root [aria-label="MoveTrack workspace navigation"] > div:nth-child(3) {grid-template-columns: repeat(2,minmax(0,1fr)) !important;}
}
`}</style>;
}
