import {isSignatureEvidence,type SignatureEvidence} from "./signature-evidence.ts";
import { defaultRiskMatrix, scoreRisk, type RiskAnswer } from "./risk-matrix.ts";

/**
 * Versioned, configuration-driven operational forms.
 * All browser submissions are demonstrations; trusted authorization is server-side.
 */
export type AnswerType = "pass_fail_na" | "yes_no" | "text" | "multiline" | "number" | "date" | "datetime" | "select" | "multiselect" | "signature" | "photo" | "document" | "risk" | "repeat" | "person" | "people";
export type PrimitiveAnswer = string | number | boolean | null;
export type FormAnswer = PrimitiveAnswer | string[] | Record<string, PrimitiveAnswer>[] | RiskAnswer | SignatureEvidence;
export type FormAnswers = Record<string, FormAnswer>;
export type FormCategory = "Fleet" | "Safety" | "Meetings" | "Risk" | "Handover" | "Inspections";
export type ConditionalVisibility = { fieldId: string; equals: string | boolean | number };
export type FormField = {
  id: string; label: string; type: AnswerType; required?: boolean; critical?: boolean;
  options?: readonly string[]; visibleWhen?: ConditionalVisibility;
  evidenceOnFail?: boolean; helperText?: string; children?: readonly FormField[];
  signerFieldId?:string; // Supervisor/reviewer person field matched to drawn local evidence.
};
export type FormSection = { id: string; title: string; description?: string; fields: readonly FormField[] };
export type FormTemplate = {
  id: string; version: number; title: string; category: FormCategory;
  status: "PUBLISHED" | "DRAFT" | "RETIRED"; effectiveDate: string;
  siteIds: readonly string[]; assetClasses: readonly string[]; sections: readonly FormSection[];
};
export type EvidencePointer = { id: string; fieldId: string; kind: "photo" | "video" | "document" | "signature"; storageNodeId?: string; providerFileId?: string; localOnly: boolean };
export type FormEvaluation = {
  completed: number; total: number; progress: number; missing: string[];
  criticalFailures: string[]; decision: "INCOMPLETE" | "NO_GO" | "REVIEW" | "COMPLETE";
};
export type FormSubmission = {
  id: string; templateId: string; templateVersion: number; templateSnapshot: FormTemplate;
  siteId: string; assetId?: string; workerId?: string; taskId?: string;
  submittedByUid: string; submittedByPersonId?: string; createdAt: string; submittedAt: string;
  answers: FormAnswers; evidence: readonly EvidencePointer[];
  decision: Exclude<FormEvaluation["decision"], "INCOMPLETE">;
  syncStatus: "PENDING" | "SYNCED" | "FAILED";
};

export function isVisible(field: FormField, answers: FormAnswers) {
  if (!field.visibleWhen) return true;
  return answers[field.visibleWhen.fieldId] === field.visibleWhen.equals;
}
export function isAnswered(field: FormField, value: FormAnswer | undefined) {
  if (value === undefined || value === null || value === "") return false;
  if (field.type === "signature") return isSignatureEvidence(value);
  if (field.type === "risk") {
    if (typeof value!=="object" || Array.isArray(value) || !("likelihood" in value) || !("consequence" in value)) return false;
    try {scoreRisk(defaultRiskMatrix,value as RiskAnswer);return true;}catch{return false;}
  }
  if (field.type === "repeat") {
    if (!Array.isArray(value) || value.length===0) return false;
    const children=field.children??[];
    return value.every(row=>{
      if(!row || typeof row!=="object" || Array.isArray(row))return false;
      const r=row as Record<string,PrimitiveAnswer>;
      return children.every(child=>!child.required || (r[child.id]!==null && r[child.id]!==undefined && r[child.id]!==""));
    });
  }
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value==="string")return value.trim().length>0;
  return true;
}
export function evaluateForm(template: FormTemplate, answers: FormAnswers, evidence: readonly EvidencePointer[] = [], signatureScopePrefix?:string): FormEvaluation {
  const active = template.sections.flatMap(s => s.fields).filter(f => isVisible(f, answers));
  const missing: string[] = [];
  const criticalFailures: string[] = [];
  let completed = 0;
  for (const f of active) {
    const value = answers[f.id];
    const signed=isSignatureEvidence(value);
    const selectedReviewer=f.signerFieldId?answers[f.signerFieldId]:undefined;
    const answered = isAnswered(f,value) && (!f.signerFieldId ||
      (signed&&typeof selectedReviewer==="string"&&selectedReviewer.length>0&&value.signerPersonId===selectedReviewer&&value.intent==="review")) &&
      (f.type!=="signature"||!signatureScopePrefix||(signed&&value.scope===signatureScopePrefix+" / "+f.label));
    if (answered) completed++;
    if (f.required && !answered) missing.push(f.id);
    const failed = f.type === "pass_fail_na" ? value === "FAIL" : f.type === "yes_no" ? value === "NO" : false;
    if (f.critical && (failed || (answered && value === "NA"))) criticalFailures.push(f.id);
    if (f.type==="risk" && answered && typeof value==="object" && value!==null && !Array.isArray(value)) {
      const assessment=scoreRisk(defaultRiskMatrix,value as RiskAnswer);
      if(assessment.requiresApproval){
        // REVIEW is required even if other questions are all complete.
        // No approval/authorization is issued by this local-only evaluator.
      }
    }
    if (failed && f.evidenceOnFail && !evidence.some(e => e.fieldId === f.id && !e.localOnly)) {
      if (!missing.includes(f.id + ":evidence")) missing.push(f.id + ":evidence");
    }
  }
  const total = active.length;
  const highRisk = active.some(f=>{
    if(f.type!=="risk")return false;
    const value=answers[f.id];
    if(!isAnswered(f,value)||!value||typeof value!=="object"||Array.isArray(value))return false;
    return scoreRisk(defaultRiskMatrix,value as RiskAnswer).requiresApproval;
  });
  const decision = criticalFailures.length ? "NO_GO" : missing.length ? "INCOMPLETE" :
    active.some(f => (f.type === "pass_fail_na" && answers[f.id] === "FAIL")) || highRisk ? "REVIEW" : "COMPLETE";
  return {completed,total,progress:total ? Math.round(completed / total * 100) : 100,missing,criticalFailures,decision};
}
export function makeSubmission(args: {
  id: string; template: FormTemplate; answers: FormAnswers; evidence?: readonly EvidencePointer[];
  siteId: string; assetId?: string; workerId?: string; taskId?: string; actorUid: string; actorPersonId?: string; now: string; signatureScopePrefix?:string;
}): FormSubmission {
  if (args.template.status !== "PUBLISHED") throw new Error("Only published template versions can be submitted.");
  if (!args.actorUid.trim()) throw new Error("A verified operator identity is required.");
  if (args.template.siteIds.length && !args.template.siteIds.includes(args.siteId)) throw new Error("Template not applicable to site.");
  const evaluation = evaluateForm(args.template,args.answers,args.evidence,args.signatureScopePrefix);
  if (evaluation.missing.length) throw new Error("Required answers or evidence missing: " + evaluation.missing.join(", "));
  // Snapshot prevents later template revisions from changing historical records.
  return {
    id:args.id,templateId:args.template.id,templateVersion:args.template.version,
    templateSnapshot:JSON.parse(JSON.stringify(args.template)) as FormTemplate,
    siteId:args.siteId,assetId:args.assetId,workerId:args.workerId,taskId:args.taskId,
    submittedByUid:args.actorUid,submittedByPersonId:args.actorPersonId,createdAt:args.now,submittedAt:args.now,
    answers:JSON.parse(JSON.stringify(args.answers)) as FormAnswers,
    evidence:JSON.parse(JSON.stringify(args.evidence ?? [])) as EvidencePointer[],
    decision:evaluation.decision as FormSubmission["decision"],syncStatus:"PENDING"
  };
}
const check=(id:string,label:string,critical=false):FormField=>({id,label,type:"pass_fail_na",required:true,critical,evidenceOnFail:false});
const field=(id:string,label:string,type:AnswerType,required=true):FormField=>({id,label,type,required});
export const starterAssuranceTemplates:readonly FormTemplate[]=[
  {id:"vehicle-prestart",version:1,title:"Vehicle pre-start",category:"Fleet",status:"PUBLISHED",effectiveDate:"2026-10-08",siteIds:[],assetClasses:["light-vehicle","heavy-truck"],sections:[
    {id:"operator",title:"Operator",fields:[check("driver-authorization","Operator licence and site permit verified",true),check("fatigue","Fit for duty / fatigue declaration",true)]},
    {id:"vehicle",title:"Vehicle systems",fields:[check("brakes","Service and park brake function",true),check("steering","Steering condition",true),check("tyres","Tyres, pressure and wheel nuts",true),check("lights","Lights, beacon and visibility"),check("reverse-alarm","Reverse alarm where required",true)]},
    {id:"emergency",title:"Emergency equipment",fields:[check("extinguisher","Fire extinguisher service current",true),check("first-aid","First aid and emergency kit")]},
    {id:"final",title:"Final record",fields:[field("odometer","Odometer / engine hours","number"),field("remarks","Driver remarks","multiline",false)]}
  ]},
  {id:"meeting-register",version:1,title:"SHE meeting register",category:"Meetings",status:"PUBLISHED",effectiveDate:"2026-10-08",siteIds:[],assetClasses:[],sections:[
    {id:"meeting",title:"Meeting details",fields:[field("title","Meeting title","text"),field("date","Meeting date","date"),{...field("type","Meeting type","select"),options:["SHE meeting","Daily production","Contractor meeting","Shift handover","Emergency meeting"]},field("supervisor","Chairperson / supervisor","text"),field("notes","Minutes / outcomes","multiline",false)]},
    {id:"attendance",title:"Attendees and actions",fields:[{...field("attendees","Attendance register","repeat"),children:[field("name","Name","text"),field("employee","Employee number","text"),field("role","Role","text")]},field("actions","Actions / owner / due date","multiline",false)]}
  ]},
  {id:"toolbox-brief",version:1,title:"Pre-shift / toolbox briefing",category:"Safety",status:"PUBLISHED",effectiveDate:"2026-10-08",siteIds:[],assetClasses:[],sections:[
    {id:"context",title:"Shift and crew",fields:[field("shift","Shift","select"),field("area","Work area","text"),field("crew","Crew / team","text"),field("weather","Weather and conditions","text")]},
    {id:"controls",title:"Hazards and critical controls",fields:[field("tasks","Planned tasks","multiline"),field("hazards","Major hazards","multiline"),field("controls","Critical controls","multiline"),check("ack","Brief acknowledged by crew",true)]}
  ]},
  {id:"jsa",version:1,title:"Job Safety Analysis (JSA)",category:"Risk",status:"PUBLISHED",effectiveDate:"2026-10-08",siteIds:[],assetClasses:[],sections:[
    {id:"job",title:"Job details",fields:[field("job","Job description","text"),field("workarea","Work area","text"),field("supervisor","Supervisor","text")]},
    {id:"steps",title:"Job steps and controls",fields:[{...field("steps","JSA steps","repeat"),children:[field("step","Task step","text"),field("hazard","Hazard","text"),field("control","Control","text"),field("responsible","Responsible person","text"),field("risk","Residual risk score","number")]}]}
  ]},
  {id:"jra",version:1,title:"Job Risk Assessment (JRA)",category:"Risk",status:"PUBLISHED",effectiveDate:"2026-10-08",siteIds:[],assetClasses:[],sections:[
    {id:"context",title:"Task and exposure",fields:[field("task","Task","text"),field("location","Location","text"),field("hazard","Hazard / energy source","multiline"),{...field("exposure","People exposed","multiselect"),options:["Crew","Contractors","Pedestrians","Operators","Public"]}]},
    {id:"risk",title:"Risk and controls",fields:[{...field("initial","Initial risk (likelihood × severity)","risk"),helperText:"Score 1–25"},field("controls","Additional controls","multiline"),{...field("residual","Residual risk (likelihood × severity)","risk"),helperText:"High / extreme requires supervisor approval"}]}
  ]},
  {id:"shift-handover",version:1,title:"Shift handover",category:"Handover",status:"PUBLISHED",effectiveDate:"2026-10-08",siteIds:[],assetClasses:[],sections:[
    {id:"outgoing",title:"Outgoing shift",fields:[field("supervisor","Outgoing supervisor","text"),field("grounded","Grounded assets and critical defects","multiline"),field("hazards","Current hazards / weather","multiline"),field("actions","Incomplete work and open actions","multiline")]},
    {id:"incoming",title:"Incoming acceptance",fields:[field("incoming","Incoming supervisor","text"),check("accepted","Handover reviewed and acknowledged",true)]}
  ]}
];
export function templateForLegacyPrestart(checks:readonly string[],criticalChecks:readonly string[],siteIds:readonly string[]=[]):FormTemplate {
  const critical=new Set(criticalChecks);
  return {id:"legacy-movetrack-prestart",version:1,title:"MoveTrack pre-start",category:"Fleet",status:"PUBLISHED",effectiveDate:"2026-10-08",siteIds,assetClasses:[],sections:[{id:"vehicle",title:"Mandatory vehicle controls",fields:checks.map(label=>({id:label,label,type:"pass_fail_na" as const,critical:critical.has(label),required:true}))}]};
}
