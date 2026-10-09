import type {SignatureEvidence} from "@bokang/domain-data/signature-evidence";
import type {LocalEvidenceImage} from "./image-evidence";
import type { FleetAssignment, FleetIncident, FleetVehicle, PrestartRecord } from "./move-track";

export type RepairEvidence = {
  id: string; vehicleId: string; incidentIds: readonly string[];
  repairedBy: string; repairNotes: string; evidenceReference: string;
  recordedAt: string; // Demo reference; production requires verified Drive evidence pointer.
  images?: LocalEvidenceImage[];
};
export type ReinspectionEvidence = {
  id: string; vehicleId: string; inspectionBy: string;
  verdict: "PASS" | "FAIL"; checkedControls: readonly string[];
  performedAt: string;
  inspectorSignature?: SignatureEvidence;
  images?: LocalEvidenceImage[];
};
export type FleetReleaseRecord = {
  id: string; vehicleId: string; assignmentId?: string;
  repairEvidenceId: string; reinspectionId: string; approvedBy: string;
  approvedAt: string; decision: "RELEASED_FOR_PRESTART";
  localReviewerSignature?: SignatureEvidence;
};
export type FleetReleaseAssessment = { allowed: boolean; reasons: string[] };
export function verifyFleetRelease(params: {
  vehicle: FleetVehicle; assignment?: FleetAssignment;
  incidents: readonly FleetIncident[]; repair?: RepairEvidence;
  reinspection?: ReinspectionEvidence; approver: string;
  baselineCertificatesValid: boolean; now: string;
}): FleetReleaseAssessment {
  const { vehicle, assignment, incidents, repair, reinspection, approver, baselineCertificatesValid, now } = params;
  const reasons: string[] = [];
  if (vehicle.status !== "No-go") reasons.push("Vehicle must already be grounded");
  if (!baselineCertificatesValid) reasons.push("Required certificates are expired or missing");
  if (assignment && assignment.vehicleId !== vehicle.id) reasons.push("Assignment / vehicle mismatch");
  if (assignment && assignment.status !== "Grounded") reasons.push("Assignment must be grounded");
  if (incidents.some(i=>i.vehicleId===vehicle.id && i.status!=="Resolved")) reasons.push("Open defects or incidents remain");
  if (!repair || repair.vehicleId!==vehicle.id || !repair.repairedBy.trim() || !repair.repairNotes.trim() || !repair.evidenceReference.trim()) {
    reasons.push("Maintenance evidence and repair owner are required");
  } else {
    const allRelated=incidents.filter(i=>i.vehicleId===vehicle.id && (i.category==="Defect" || i.severity==="Critical"));
    if (allRelated.some(i=>!repair.incidentIds.includes(i.id))) reasons.push("Repair evidence must reference all critical / defect incidents");
  }
  if (!reinspection || reinspection.vehicleId!==vehicle.id || reinspection.verdict!=="PASS" || !reinspection.inspectionBy.trim() || reinspection.checkedControls.length===0) {
    reasons.push("Passed, documented reinspection is required");
  }
  if (!approver.trim()) reasons.push("Supervisor approval is missing");
  if (repair && reinspection && repair.repairedBy.trim()===reinspection.inspectionBy.trim()) {
    reasons.push("Reinspection must be performed by a different person from the repairer");
  }
  if (repair && approver.trim()===repair.repairedBy.trim()) reasons.push("Repairer cannot approve own release");
  if (reinspection && approver.trim()===reinspection.inspectionBy.trim()) reasons.push("Inspector cannot approve own release");
  const nowDate=Date.parse(now), repairDate=repair?Date.parse(repair.recordedAt):NaN, inspectDate=reinspection?Date.parse(reinspection.performedAt):NaN;
  if (!Number.isFinite(nowDate) || !Number.isFinite(repairDate) || !Number.isFinite(inspectDate) || repairDate>inspectDate || inspectDate>nowDate) reasons.push("Evidence dates are invalid or out of sequence");
  return {allowed:reasons.length===0,reasons};
}
export function finalizeFleetRelease(params: Parameters<typeof verifyFleetRelease>[0], id: string) {
  const assessment=verifyFleetRelease(params);
  if (!assessment.allowed || !params.repair || !params.reinspection) throw new Error(assessment.reasons.join("; "));
  const record: FleetReleaseRecord={
    id,vehicleId:params.vehicle.id,assignmentId:params.assignment?.id,
    repairEvidenceId:params.repair.id,reinspectionId:params.reinspection.id,
    approvedBy:params.approver,approvedAt:params.now,decision:"RELEASED_FOR_PRESTART"
  };
  // Release does not mean operational GO: mandatory new pre-start remains.
  const vehicle: FleetVehicle={...params.vehicle,status:"Inspection due"};
  const assignment: FleetAssignment|undefined=params.assignment?{
    ...params.assignment,status:"Awaiting pre-start",prestartId:undefined
  }:undefined;
  return {record,vehicle,assignment};
}
export function mostRecentFailedPrestart(prestarts:readonly PrestartRecord[],vehicleId:string) {
  return prestarts.find(p=>p.vehicleId===vehicleId&&p.result==="NO-GO");
}
