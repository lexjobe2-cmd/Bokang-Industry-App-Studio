import type {SignatureEvidence} from "@bokang/domain-data/signature-evidence";
import type {LocalEvidenceImage} from "./image-evidence";
import type {LocalAssetDocument} from "./vehicle-documents";
import { miningPrestartChecks } from "@bokang/domain-data";

export type FleetVehicleStatus =
  | "Available"
  | "Assigned"
  | "On job"
  | "Inspection due"
  | "Maintenance"
  | "No-go"
  | "Out of service";

export type DriverStatus = "Available" | "Assigned" | "Driving" | "Off shift";

export type FleetVehicle = {
  id: string;
  fleetNo: string;
  registration: string;
  makeModel: string;
  type: string;
  site: string;
  status: FleetVehicleStatus;
  odometerKm: number;
  roadworthyExpiry: string;
  extinguisherServiceDue: string;
  nextServiceKm: number;
  images?: LocalEvidenceImage[];
  documents?: LocalAssetDocument[];
};

export type FleetDriver = {
  id: string;
  name: string;
  phone: string;
  licenceNo: string;
  siteAuthorised: boolean;
  openPitPermit: boolean;
  firstAid: boolean;
  defensiveDriving: boolean;
  status: DriverStatus;
  authorizationReview?:{signedAt:string;signature:SignatureEvidence};
};

export type AssignmentStatus =
  | "Assigned"
  | "Awaiting pre-start"
  | "Cleared"
  | "In use"
  | "Returned"
  | "Grounded"
  | "Cancelled";

export type FleetAssignment = {
  id: string;
  vehicleId: string;
  driverId: string;
  jobId?: string;
  site: string;
  createdAt: string;
  status: AssignmentStatus;
  prestartId?: string;
  startedAt?: string;
  returnedAt?: string;
  returnOdometerKm?: number;
  returnCondition?: "No defect reported" | "Defect reported";
  returnNotes?: string;
};

export type ChecklistResult = "pass" | "fail" | "na" | "unset";

export type PrestartRecord = {
  id: string;
  assignmentId: string;
  vehicleId: string;
  driverId: string;
  createdAt: string;
  checks: Record<string, ChecklistResult>;
  result: "GO" | "NO-GO";
  reasons: string[];
  notes: string;
  images?: LocalEvidenceImage[];
};

export type FleetSitePolicy = {
  id: string;
  name: string;
  requireOpenPitPermit: boolean;
  requireFirstAid: boolean;
  requireDefensiveDriving: boolean;
  additionalCriticalChecks: string[];
  policyReview?:{signedAt:string;signature:SignatureEvidence};
};

export type FleetIncident = {
  id: string;
  vehicleId: string;
  driverId?: string;
  assignmentId?: string;
  createdAt: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  category: "Defect" | "Damage" | "Breakdown" | "Safety" | "Other";
  description: string;
  status: "Open" | "Investigating" | "Resolved";
  resolutionNote?: string;
  resolvedAt?: string;
  reviewSignature?: SignatureEvidence;
  images?: LocalEvidenceImage[];
};

export const MOVE_TRACK_KEYS = {
  fleet: "bokang-studio.move-track.fleet.v2",
  drivers: "bokang-studio.move-track.drivers.v2",
  assignments: "bokang-studio.move-track.assignments.v1",
  prestarts: "bokang-studio.move-track.prestarts.v2",
  incidents: "bokang-studio.move-track.fleet-incidents.v1",
  policies: "bokang-studio.move-track.site-policies.v1",
} as const;

export const starterFleet: FleetVehicle[] = [
  {
    id:"VEH-001", fleetNo:"LV-014", registration:"B 123 ABC",
    makeModel:"Toyota Hilux 2.8 GD-6", type:"Pickup / LDV",
    site:"Jwaneng mine · demo profile", status:"Available",
    odometerKm:84210, roadworthyExpiry:"2027-02-15",
    extinguisherServiceDue:"2027-01-10", nextServiceKm:90000
  },
  {
    id:"VEH-002", fleetNo:"LV-022", registration:"B 884 XYZ",
    makeModel:"Isuzu D-Max", type:"Pickup / LDV",
    site:"Orapa mine · demo profile", status:"On job",
    odometerKm:116430, roadworthyExpiry:"2026-12-01",
    extinguisherServiceDue:"2026-11-20", nextServiceKm:120000
  },
  {
    id:"VEH-003", fleetNo:"SV-006", registration:"B 619 KLM",
    makeModel:"Ford Transit", type:"Service truck",
    site:"Gaborone workshop", status:"Inspection due",
    odometerKm:69210, roadworthyExpiry:"2026-10-18",
    extinguisherServiceDue:"2026-10-12", nextServiceKm:70000
  },
];

export const starterPolicies: FleetSitePolicy[] = [
  {
    id:"SITE-001",
    name:"Jwaneng mine · demo profile",
    requireOpenPitPermit:true,
    requireFirstAid:true,
    requireDefensiveDriving:true,
    additionalCriticalChecks:[
      "First aid kit present and stocked",
      "Two-way radio / site communication available",
      "Beacon / strobe functional where site requires",
      "Whip flag fitted where site requires"
    ]
  },
  {
    id:"SITE-002",
    name:"Orapa mine · demo profile",
    requireOpenPitPermit:true,
    requireFirstAid:true,
    requireDefensiveDriving:true,
    additionalCriticalChecks:[
      "First aid kit present and stocked",
      "Two-way radio / site communication available",
      "Beacon / strobe functional where site requires"
    ]
  },
  {
    id:"SITE-003",
    name:"Gaborone workshop",
    requireOpenPitPermit:false,
    requireFirstAid:false,
    requireDefensiveDriving:true,
    additionalCriticalChecks:[]
  }
];

export const starterDrivers: FleetDriver[] = [
  {
    id:"DRV-001", name:"K. Dube", phone:"+267 71 100 001",
    licenceNo:"DL-DEMO-101", siteAuthorised:true, openPitPermit:true,
    firstAid:true, defensiveDriving:true, status:"Available"
  },
  {
    id:"DRV-002", name:"L. Moagi", phone:"+267 72 100 002",
    licenceNo:"DL-DEMO-102", siteAuthorised:true, openPitPermit:false,
    firstAid:true, defensiveDriving:true, status:"Available"
  },
];

export function dateIsCurrent(date: string, today = new Date()) {
  if (!date || date === "Not set") return false;
  const expiry = new Date(date + "T23:59:59");
  return Number.isFinite(expiry.getTime()) && expiry.getTime() >= today.getTime();
}

export function evaluatePrestart(args: {
  checks: Record<string, ChecklistResult>;
  criticalChecks: readonly string[];
  vehicle: FleetVehicle;
  driver: FleetDriver;
  requireOpenPitPermit?: boolean;
  requireFirstAid?: boolean;
  requireDefensiveDriving?: boolean;
}) {
  const reasons: string[] = [];
  const { checks, criticalChecks, vehicle, driver } = args;

  const requiredChecks = new Set<string>([...miningPrestartChecks, ...criticalChecks]);
  for (const item of requiredChecks) {
    const result = checks[item];
    const critical = criticalChecks.includes(item);
    if (critical && result !== "pass") reasons.push(item + " must explicitly PASS");
    else if (!critical && (!result || result === "unset")) reasons.push(item + " is incomplete");
    else if (result === "fail") reasons.push(item + " failed");
  }

  if (!driver.siteAuthorised) reasons.push("Driver is not site-authorised");
  if (args.requireOpenPitPermit && !driver.openPitPermit) reasons.push("Required site driving permit is missing");
  if (args.requireFirstAid && !driver.firstAid) reasons.push("Required first-aid training is missing");
  if (args.requireDefensiveDriving && !driver.defensiveDriving) reasons.push("Required defensive-driving training is missing");
  if (!dateIsCurrent(vehicle.roadworthyExpiry)) reasons.push("Roadworthiness record is expired or missing");
  if (!dateIsCurrent(vehicle.extinguisherServiceDue)) reasons.push("Fire extinguisher service date is expired or missing");
  if (vehicle.status === "No-go" || vehicle.status === "Maintenance" || vehicle.status === "Out of service") {
    reasons.push("Vehicle is unavailable due to current fleet status");
  }

  return {
    result: reasons.length === 0 ? "GO" as const : "NO-GO" as const,
    reasons,
  };
}
