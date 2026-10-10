"use client";

import type {ElementType,ReactNode} from "react";

/**
 * Shared MoveTrack text contracts.
 * - Layout grows with data, never a fixed-height text box.
 * - React escapes text by default; rich content is a typed document, never HTML.
 * - Tone uses the existing --mt-* light/dark semantic tokens.
 */
export type MoveTrackTextTone="primary"|"muted"|"link"|"danger"|"warning"|"success";
export type MoveTrackTextVariant="body"|"heading"|"meta";
type TextTag="span"|"p"|"strong"|"small"|"h2"|"h3"|"div";
export function MoveTrackReadableText({
 as:Tag="span",variant="body",tone="primary",preserveLines=false,children,className=""
}:{
 as?:TextTag;variant?:MoveTrackTextVariant;tone?:MoveTrackTextTone;
 preserveLines?:boolean;children:ReactNode;className?:string;
}){
 return <Tag className={["movetrack-readable-text",className].filter(Boolean).join(" ")}
  data-variant={variant} data-tone={tone} data-preserve-lines={preserveLines?"true":undefined}>{children}</Tag>;
}

export type MoveTrackRichInline={
 text:string;
 bold?:boolean;
 italic?:boolean;
 code?:boolean;
 href?:string;
};
export type MoveTrackRichBlock=
 |{type:"paragraph";content:readonly MoveTrackRichInline[]}
 |{type:"heading";level:2|3;content:readonly MoveTrackRichInline[]}
 |{type:"list";ordered?:boolean;items:readonly (readonly MoveTrackRichInline[])[]}
 |{type:"quote";content:readonly MoveTrackRichInline[]};

/** Explicitly allow web, email and in-app links; reject javascript:, data:, and protocol-relative URLs. */
export function safeMoveTrackHref(value:string):string|undefined{
 const href=value.trim();
 if(/^\/(?!\/)[^\s]*$/.test(href))return href;
 if(/^(https?:\/\/|mailto:)/i.test(href)){
  try{
   const url=new URL(href);
   if(["http:","https:","mailto:"].includes(url.protocol))return href;
  }catch{return undefined;}
 }
 return undefined;
}

function inline(items:readonly MoveTrackRichInline[]){
 return items.map((item,i)=>{
  let result:ReactNode=item.text;
  if(item.code)result=<code>{result}</code>;
  if(item.italic)result=<em>{result}</em>;
  if(item.bold)result=<strong>{result}</strong>;
  const href=item.href?safeMoveTrackHref(item.href):undefined;
  if(href)result=<a href={href} rel={href.startsWith("/")?undefined:"noopener noreferrer"}>{result}</a>;
  return <span key={i} className="movetrack-rich-inline">{result}</span>;
 });
}

/** Safe, semantic renderer for formatted explanations and future structured form notes. */
export function MoveTrackRichContent({blocks,tone="primary",className=""}:{
 blocks:readonly MoveTrackRichBlock[];tone?:MoveTrackTextTone;className?:string;
}){
 return <div className={["movetrack-rich-content",className].filter(Boolean).join(" ")} data-tone={tone}>
  {blocks.map((block,i)=>{
   if(block.type==="paragraph")return <p key={i}>{inline(block.content)}</p>;
   if(block.type==="heading")return block.level===2?<h2 key={i}>{inline(block.content)}</h2>:<h3 key={i}>{inline(block.content)}</h3>;
   if(block.type==="quote")return <blockquote key={i}>{inline(block.content)}</blockquote>;
   const Tag:ElementType=block.ordered?"ol":"ul";
   return <Tag key={i}>{block.items.map((item,j)=><li key={j}>{inline(item)}</li>)}</Tag>;
  })}
 </div>;
}
