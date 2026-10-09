import type {PersonRecord} from "./custom-assurance.ts";
import {hazardQuickChoices,controlSuggestions} from "./form-assist.ts";
export type TextActionSuggestion={source:string;action:string;owner_person_id:string;owner:string;due:string;needsReview:readonly string[]};
export type OperationalTextAnalysis={engine:"Local rule-based English NLP";truncated:boolean;summary:string[];hazards:{category:string;source:string;controls:readonly string[]}[];actions:TextActionSuggestion[];decisions:string[];warnings:string[]};
const patterns:Record<string,RegExp>={
 "Fall from height":/\b(height|scaffold|ladder|fall protection|unprotected edge)\b/i,
 "Vehicle interaction":/\b(vehicle|traffic|reversing|pedestrian|dump truck|brakes?)\b/i,
 "Stored energy / LOTO":/\b(loto|lockout|stored energy|hydraulic|isolation)\b/i,
 "Electrical exposure":/\b(electric|electrical|arc flash|live wire|voltage)\b/i,
 "Fire / explosion":/\b(fire|explosion|hot work|flammable|fuel leak)\b/i,
 "Confined space / oxygen":/\b(confined space|oxygen|ventilation|gas test)\b/i,
 "Dust and silica":/\b(dust|silica|respiratory)\b/i,
 "Moving machinery":/\b(machinery|unguarded|pinch|crush|conveyor)\b/i
};
const dayAfter=(today:string,days:number)=>{const d=new Date(today+"T12:00:00Z");if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==today)return "";d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);};
/** Bounded, offline extraction. Source excerpts remain authoritative; no risk, PASS or approval output. */
export function analyzeOperationalText(text:string,people:readonly PersonRecord[]=[],today=new Date().toISOString().slice(0,10)):OperationalTextAnalysis{
 const truncated=text.length>20000;
 const sentences=text.slice(0,20000).split(/\n+|(?<=[.!?])\s+/u).map(s=>s.replace(/^[-•\s]+/,"").trim()).filter(Boolean).slice(0,200);
 const hazards=Object.keys(hazardQuickChoices).flatMap(category=>{const source=sentences.find(s=>patterns[category]?.test(s));return source?[{category,source,controls:controlSuggestions(category)}]:[];});
 const actions:TextActionSuggestion[]=[];
 for(const source of sentences){
  if(!/\b(action|must|shall|will|to (inspect|repair|review|replace|check|submit|complete)|assigned|follow[- ]?up)\b/i.test(source)||/\b(no action|not required|do not|must not|will not|shall not|cancelled|canceled|completed|already repaired)\b/i.test(source))continue;
  const names=people.filter(p=>p.active&&p.displayName.trim().length>2&&source.toLowerCase().includes(p.displayName.toLowerCase()));
  // One exact directory name is a candidate, never an authenticated identity.
  const person=names.length===1?names[0]:undefined;
  const dates=[...source.matchAll(/\b\d{4}-\d{2}-\d{2}\b/g)].map(m=>m[0]);
  const unique=[...new Set(dates)];let due=unique.length===1&&dayAfter(unique[0]!,0)?unique[0]! : "";
  if(!dates.length){if(/\btomorrow\b/i.test(source))due=dayAfter(today,1);else if(/\btoday\b/i.test(source))due=dayAfter(today,0);}
  const needsReview=["Confirm this is an agreed action",...(person?[]:[names.length>1?"Multiple people mentioned — choose the owner":"Choose the accountable owner"]),...(due?[]:["Choose or confirm the due date"]),"Confirm due date and local person identity"];
  actions.push({source,action:source,owner_person_id:person?.id??"",owner:person?.displayName??"",due,needsReview});if(actions.length===20)break;
 }
 const decisions=sentences.filter(s=>/\b(agreed|resolved|decided|decision)\b/i.test(s)&&! /\b(not agreed|no decision|not decided)\b/i.test(s)).slice(0,10);
 return {engine:"Local rule-based English NLP",truncated,summary:sentences.slice(0,3),hazards,actions,decisions,warnings:["English text rules can miss context, negation and local terminology. Review every suggestion.",...(truncated?["Only the first 20,000 characters were analyzed."]:[])]};
}
