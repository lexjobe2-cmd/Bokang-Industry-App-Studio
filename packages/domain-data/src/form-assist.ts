import type {FormAnswers,FormField,FormTemplate,PrimitiveAnswer} from "./assurance-forms.ts";
import type {PersonRecord} from "./custom-assurance.ts";

export type FastEntryChoice={label:string;value:string};
const shortcuts:readonly {matches:RegExp;choices:readonly string[]}[]=[
 {matches:/\b(shift)\b/i,choices:["Day shift","Night shift","Morning shift","Afternoon shift"]},
 {matches:/\b(weather|conditions)\b/i,choices:["Clear","Cloudy","Rain","Windy","Hot","Dusty"]},
 {matches:/\b(meeting type|briefing type)\b/i,choices:["Toolbox talk","Pre-shift briefing","SHE meeting","Safety stand-down","Shift handover"]},
 {matches:/\b(work scope|scope of work|planned tasks|job description|task activity)\b/i,choices:["Routine inspection","Planned maintenance","Corrective maintenance","Site housekeeping","Equipment isolation","Pre-shift briefing"]},
 {matches:/\b(incident type|category of incident)\b/i,choices:["Near miss","Unsafe condition","Equipment defect","Environmental spill","First aid","Property damage"]},
 {matches:/\b(hazard|exposure|risk description)\b/i,choices:["Moving vehicles","Work at height","Dropped objects","Stored energy","Electrical exposure","Dust / silica","Slips, trips and falls"]},
 {matches:/\b(equipment|tools|plant)\b/i,choices:["Hand tools","LOTO kit","Lifting equipment","Safety barriers","Access platform","PPE and first aid"]},
 {matches:/\b(ppe)\b/i,choices:["Hard hat","Eye protection","Safety footwear","Gloves","Hearing protection","Hi-vis vest"]},
 {matches:/\b(actions? required|corrective action|remedial action)\b/i,choices:["Report to supervisor","Isolate the affected equipment","Barricade the area","Raise corrective work order","Escalate for competent inspection"]},
 {matches:/\b(comments|observations|remarks|notes)\b/i,choices:["No additional observations","Follow-up required","See attached report","To be confirmed by supervisor"]},
 {matches:/\b(controls?|mitigation)\b/i,choices:["Establish an exclusion zone","Inspect access and equipment","Follow approved site procedure","Confirm competent supervision","Stop work and escalate"]},
 {matches:/\b(action owner|responsible role)\b/i,choices:["Supervisor","Team leader","SHE officer","Maintenance technician","Contractor supervisor"]}
];
const normalize=(value:string)=>value.trim().toLowerCase().replace(/\s+/g," ");
export function fieldQuickChoices(label:string,type:string):FastEntryChoice[]{
 if(!["text","multiline","select"].includes(type))return [];
 const matched=shortcuts.find(row=>row.matches.test(label));
 return matched?[...matched.choices].map(value=>({label:value,value})):[];
}
function isTeamField(field:FormField){
 return (field.type==="person"||field.type==="people")&&!field.critical&&!/review|approv|witness|sign|authorize|isolat|permit/i.test(field.label);
}
/** Explicitly reuse crew identity selections. Never copy a check, risk, signature or approval. */
export function reusableCrewAnswers(template:FormTemplate,old:FormAnswers,personIds:ReadonlySet<string>):FormAnswers{
 const answers:FormAnswers={};
 for(const field of template.sections.flatMap(section=>section.fields)){
  if(!isTeamField(field))continue;
  const value=old[field.id];
  if(field.type==="person"&&typeof value==="string"&&personIds.has(value))answers[field.id]=value;
  if(field.type==="people"&&Array.isArray(value)){
   const ids=value.filter((v):v is string=>typeof v==="string"&&personIds.has(v));
   if(ids.length)answers[field.id]=ids;
  }
 }
 return answers;
}
/** Populate identity columns of a repeating register from a directory selection, never attendance consent or sign-off. */
export function personRegisterRow(fields:readonly FormField[],person:PersonRecord):Record<string,PrimitiveAnswer>{
 const result:Record<string,PrimitiveAnswer>={};
 for(const f of fields){
  if(!["text","select","number"].includes(f.type))continue;
  const name=normalize(f.label+" "+f.id);
  if(/sign|acknowledg|approv|verif|confirm|review|risk|status/i.test(name))continue;
  let value="";
  if(/email|e-mail/i.test(name))value=person.email??"";
  else if(/employee|staff|personnel|badge|worker id|id number|emp no/i.test(name))value=person.employeeNumber??"";
  else if(/department|section|business unit/i.test(name))value=person.department??"";
  else if(/job title|designation|role|position/i.test(name))value=person.jobTitle??"";
  else if(/attendee|participant|full name|worker name|employee name|person name|name/i.test(name))value=person.displayName;
  else if(/work area|site|location/i.test(name))value=person.location??"";
  if(!value)continue;
  if(f.type==="select"&&f.options?.length&&!f.options.includes(value))continue;
  if(f.type==="number"){if(/^\d+$/.test(value))result[f.id]=Number(value);}
  else result[f.id]=value;
 }
 return result;
}
export const taskQuickChoices=[
 "Inspect and prepare work area","Isolate sources of energy","Verify access and exclusion zones",
 "Remove and replace component","Test equipment after maintenance","Inspect and hand back work area"
] as const;
export const hazardQuickChoices:Record<string,readonly string[]>={
 "Fall from height":["Fall from elevated platform","Unprotected edge or opening","Unstable access surface","Dropped tools or materials"],
 "Vehicle interaction":["Vehicle/pedestrian interaction","Unexpected vehicle movement","Reversing blind spot","Load instability"],
 "Stored energy / LOTO":["Unexpected energization","Hydraulic pressure release","Uncontrolled stored mechanical energy"],
 "Electrical exposure":["Contact with live parts","Arc flash exposure","Damaged electrical insulation"],
 "Fire / explosion":["Hot work igniting combustibles","Flammable vapour","Uncontrolled fuel/chemical source"],
 "Confined space / oxygen":["Oxygen-deficient atmosphere","Entrapment","Inadequate ventilation"],
 "Dust and silica":["Airborne silica dust","Insufficient dust suppression"],
 "Moving machinery":["Pinch and crush points","Unguarded moving parts"]
};
export const consequenceQuickChoices=[
 "Serious injury or fatality","Crush or impact injury","Fall-related injury","Fire or burns",
 "Respiratory exposure","Environmental harm","Equipment/property damage"
] as const;
export const controlQuickChoices:Record<string,readonly string[]>={
 "Fall from height":["Provide compliant guardrails and safe access","Inspect anchors and fall protection equipment","Establish drop-zone exclusion barriers","Confirm site-specific rescue readiness"],
 "Vehicle interaction":["Separate pedestrians and moving equipment","Establish approved traffic routes","Use designated spotter and radio communication","Inspect reversing aids"],
 "Stored energy / LOTO":["Apply approved lockout/tagout procedure","Verify zero energy before access","Secure stored pressure and moving parts"],
 "Electrical exposure":["Isolate and test for absence of voltage","Use competent authorized electricians","Establish electrical exclusion boundaries"],
 "Fire / explosion":["Remove or shield combustibles","Provide fire watch and emergency equipment","Check ventilation and ignition-source controls"],
 "Confined space / oxygen":["Arrange competent atmospheric testing","Provide attendant and rescue plan","Verify ventilation and isolation"]
};
export function hazardSuggestions(category:string):readonly string[]{
 return hazardQuickChoices[category]??["Identify task-specific exposure","Describe contact or failure mechanism","Describe unsafe condition"];
}
export function controlSuggestions(category:string):readonly string[]{
 return controlQuickChoices[category]??["Apply suitable engineering safeguards","Define access restrictions and exclusion zones","Arrange competent inspection and supervision","Follow a site-approved safe work procedure"];
}
