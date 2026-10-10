"use client";
import {forwardRef,type ButtonHTMLAttributes,type ComponentPropsWithoutRef,type ReactNode} from "react";

/**
 * Behavior-preserving native control primitives for the existing MoveTrack UI.
 * The same class/data-variant contract can also be applied to pre-existing
 * <button>, <input>, <select>, <textarea> and panel elements without replacing them.
 */
export type MoveTrackButtonVariant="secondary"|"primary"|"selected"|"danger"|"ghost";
type ButtonProps=Omit<ButtonHTMLAttributes<HTMLButtonElement>,"color"> & {variant?:MoveTrackButtonVariant};
export const MoveTrackButton=forwardRef<HTMLButtonElement,ButtonProps>(function MoveTrackButton(
 {variant="secondary",type="button",className="",...props},ref
){
 return <button {...props} type={type} ref={ref} data-mt-variant={variant}
  className={["movetrack-ui-button",className].filter(Boolean).join(" ")}/>;
});

type PanelProps=ComponentPropsWithoutRef<"section"> & {children:ReactNode;soft?:boolean};
export function MoveTrackPanel({children,className="",soft=false,...props}:PanelProps){
 return <section {...props} data-mt-surface={soft?"soft":"default"}
  className={["movetrack-ui-panel",className].filter(Boolean).join(" ")}>{children}</section>;
}

/** Style a pre-existing native control without changing its event handlers or identity. */
export function moveTrackControlClass(name:"button"|"field"|"panel"){
 return "movetrack-ui-"+name;
}
