/**
 * MoveTrack Operational Assurance — shared, pure domain rules.
 * Demo-only until enforced by a trusted server with authenticated roles and durable audit storage.
 */
export type InspectionAnswer = "PASS" | "FAIL" | "NA";
export type AssetState = "AVAILABLE" | "ASSIGNED" | "IN_OPERATION" | "MAINTENANCE" | "GROUNDED" | "OUT_OF_SERVICE";
export type Decision = "GO" | "NO_GO" | "INCOMPLETE";
export type ChecklistQuestion = { id: string; label: string; critical: boolean; required: boolean; evidenceOnFail?: boolean };
export type ChecklistSection = { id: string; title: string; questions: readonly ChecklistQuestion[] };
export type ChecklistTemplate = { id: string; title: string; version: number; assetClasses: readonly string[]; sections: readonly ChecklistSection[] };
export type Asset = { id: string; fleetNumber: string; name: string; assetClass: string; siteId: string; state: AssetState; operatorId?: string; groundedBy?: string; releaseId?: string };
export type Operator = { id: string; name: string; authorizations: readonly string[]; licenceValid: boolean };
export type Inspection = { id: string; assetId: string; operatorId: string; templateId: string; templateVersion: number; answers: Readonly<Record<string,InspectionAnswer>>; submittedAt?: string };
export type SafetyDecision = { decision: Decision; reasons: string[]; criticalFailures: string[] };
export type Defect = { id: string; assetId: string; inspectionId: string; questionId: string; critical: boolean; status: "OPEN" | "ACKNOWLEDGED" | "ASSIGNED" | "IN_REPAIR" | "AWAITING_VERIFICATION" | "CLOSED" };
export type ReleaseRecord = { id: string; assetId: string; repairEvidenceId: string; reinspectionId: string; approverId: string; approvedAt: string };
const question = (id: string, label: string, critical = false): ChecklistQuestion => ({ id, label, critical, required: true, evidenceOnFail: critical });
export const prestartTemplate: ChecklistTemplate = {
  id: "vehicle-prestart", title: "Vehicle / equipment pre-start", version: 1,
  assetClasses: ["light-vehicle","heavy-truck","haul-truck","earthmoving","forklift"],
  sections: [
    { id:"operator", title:"Driver and authorization", questions:[question("seatbelt","Seatbelt functional",true),question("ppe","Required PPE available")] },
    { id:"exterior", title:"Exterior and tyres", questions:[question("tyres","Tyres and wheel nuts safe",true),question("lights","Lights and beacons functional"),question("windscreen","Windscreen and mirrors clear")] },
    { id:"mechanical", title:"Mechanical systems", questions:[question("brakes","Service and parking brakes functional",true),question("steering","Steering functional",true),question("leaks","No unsafe fluid leaks",true)] },
    { id:"emergency", title:"Emergency equipment", questions:[question("extinguisher","Fire extinguisher available and in date",true),question("reverse-alarm","Reverse alarm operational where required",true),question("first-aid","First aid and emergency equipment")] }
  ]
};
export const equipmentClasses = [
  {id:"light-vehicle",label:"Light vehicle"},{id:"heavy-truck",label:"Heavy truck"},
  {id:"haul-truck",label:"Haul / dump truck"},{id:"earthmoving",label:"Earthmoving equipment"},
  {id:"forklift",label:"Forklift"},{id:"crane",label:"Crane"},
  {id:"trailer",label:"Trailer"},{id:"plant",label:"Mobile plant"}
] as const;
export const demoAssets: Asset[] = [
  {id:"asset-dt024",fleetNumber:"DT-024",name:"CAT 777 haul truck",assetClass:"haul-truck",siteId:"mine",state:"AVAILABLE",operatorId:"operator-1"},
  {id:"asset-lv012",fleetNumber:"LV-012",name:"Toyota Hilux",assetClass:"light-vehicle",siteId:"depot",state:"ASSIGNED",operatorId:"operator-1"},
  {id:"asset-fl003",fleetNumber:"FL-003",name:"Forklift",assetClass:"forklift",siteId:"construction",state:"AVAILABLE",operatorId:"operator-1"}
];
export const demoOperator: Operator = {id:"operator-1",name:"Demo operator",authorizations:["haul-truck","light-vehicle","forklift"],licenceValid:true};
export function evaluatePrestart(template:ChecklistTemplate, inspection:Inspection, asset:Asset, operator:Operator, openDefects:readonly Defect[] = []):SafetyDecision {
  const reasons:string[] = [];
  const criticalFailures:string[] = [];
  const questions = template.sections.flatMap(s=>s.questions);
  for(const q of questions) if(inspection.answers[q.id] === "FAIL" && q.critical) criticalFailures.push(q.id);
  if(asset.state === "GROUNDED" || asset.state === "MAINTENANCE" || asset.state === "OUT_OF_SERVICE") reasons.push("Asset is not released for operation");
  if(!operator.licenceValid) reasons.push("Operator licence invalid");
  if(!operator.authorizations.includes(asset.assetClass)) reasons.push("Operator not authorized for this equipment class");
  if(openDefects.some(d=>d.assetId===asset.id && d.critical && d.status!=="CLOSED")) reasons.push("Open critical defect");
  if(criticalFailures.length) reasons.push("Critical pre-start failure");
  if(reasons.length) return {decision:"NO_GO",reasons,criticalFailures};
  if(questions.some(q=>q.required && !inspection.answers[q.id])) return {decision:"INCOMPLETE",reasons:["Required inspection answers missing"],criticalFailures};
  return {decision:"GO",reasons:[],criticalFailures};
}
export function submitPrestart(template:ChecklistTemplate, inspection:Inspection, asset:Asset, operator:Operator, defects:readonly Defect[], submittedAt:string) {
  const evaluated=evaluatePrestart(template,inspection,asset,operator,defects);
  if(evaluated.decision==="INCOMPLETE") throw new Error("Complete all required inspection answers before submission");
  const createdDefects:Defect[]=evaluated.criticalFailures.map((questionId,i)=>({
    id:`${inspection.id}-defect-${i+1}`,assetId:asset.id,inspectionId:inspection.id,questionId,critical:true,status:"OPEN"
  }));
  const updatedAsset:Asset=evaluated.decision==="NO_GO"?{...asset,state:"GROUNDED",groundedBy:inspection.id,releaseId:undefined}:asset;
  return {inspection:{...inspection,submittedAt},decision:evaluated,asset:updatedAsset,createdDefects};
}
export function releaseGroundedAsset(asset:Asset, defects:readonly Defect[], record:ReleaseRecord, passedReinspection:boolean):Asset {
  if(asset.state!=="GROUNDED") throw new Error("Asset is not grounded");
  if(record.assetId!==asset.id || !record.approverId || !record.repairEvidenceId || !record.reinspectionId || !record.approvedAt || !passedReinspection)
    throw new Error("Repair evidence, passed reinspection and supervisor approval are required");
  if(defects.some(d=>d.assetId===asset.id && d.critical && d.status!=="CLOSED")) throw new Error("Critical defects remain open");
  return {...asset,state:"AVAILABLE",groundedBy:undefined,releaseId:record.id};
}
export function riskScore(likelihood:number,severity:number) {
  if(!Number.isInteger(likelihood)||!Number.isInteger(severity)||likelihood<1||severity<1||likelihood>5||severity>5) throw new Error("Risk dimensions must be 1–5");
  const score=likelihood*severity;
  return {score,level:score<=4?"LOW":score<=9?"MEDIUM":score<=16?"HIGH":"EXTREME",requiresApproval:score>=10};
}
