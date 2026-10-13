"use client";
import {useEffect,useId,useRef,useState,type ReactNode} from "react";
import {useDesktopWorkspace} from "./TaskWorkspace";

/** One mounted editor: a native modal on desktop, an inline panel on phones. */
export function DesktopModal({title,open,onClose,children,mobileExpanded=false}:{title:string;open:boolean;onClose:()=>void;children:ReactNode;mobileExpanded?:boolean}){
 const desktop=useDesktopWorkspace();
 const ref=useRef<HTMLDialogElement>(null);
 const titleId=useId();
 const visible=open||(!desktop&&mobileExpanded);
 useEffect(()=>{
  const dialog=ref.current;
  if(!dialog)return;
  if(!visible){if(dialog.open)dialog.close();return;}
  // Closing before a mode change allows show()/showModal() without remounting fields.
  if(dialog.open)dialog.close();
  if(desktop)dialog.showModal();else dialog.show();
  const overflow=document.body.style.overflow;
  if(desktop)document.body.style.overflow="hidden";
  return ()=>{if(dialog.open)dialog.close();if(desktop)document.body.style.overflow=overflow;};
 },[visible,desktop]);
 return <dialog ref={ref} className={"movetrack-desktop-modal "+(desktop?"is-desktop":"is-inline")} aria-labelledby={titleId} onCancel={event=>{event.preventDefault();onClose();}} onKeyDown={event=>{
  if(!desktop||event.key!=="Tab")return;
  const controls=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]')).filter(el=>el.tabIndex>=0&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=="hidden");
  const first=controls[0],last=controls[controls.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }}>
  <header hidden={!desktop&&mobileExpanded} className="movetrack-modal-header"><h2 id={titleId}>{title}</h2><button type="button" onClick={onClose} aria-label={"Close "+title}>Close</button></header>
  <div className="movetrack-modal-body">{children}</div>
 </dialog>;
}

export function DesktopModalDisclosure({title,children,mobileExpanded=false}:{title:string;children:ReactNode;mobileExpanded?:boolean}){
 const desktop=useDesktopWorkspace();
 const [open,setOpen]=useState(false);
 // Mobile creation panels keep their existing inline presentation.
 return <div className="movetrack-modal-launcher">
  <button hidden={!desktop&&mobileExpanded} type="button" aria-haspopup={desktop?"dialog":undefined} aria-expanded={open} onClick={()=>setOpen(true)}>{title}</button>
  <DesktopModal title={title} mobileExpanded={mobileExpanded} open={open} onClose={()=>setOpen(false)}>{children}</DesktopModal>
 </div>;
}
