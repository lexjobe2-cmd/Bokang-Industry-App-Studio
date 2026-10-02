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
};

export const MOVE_TRACK_KEYS = {
  fleet: "bokang-studio.move-track.fleet.v2",
  drivers: "bokang-studio.move-track.drivers.v2",
  assignments: "bokang-studio.move-track.assignments.v1",
  prestarts: "bokang-studio.move-track.prestarts.v2",
  incidents: "bokang-studio.move-track.fleet-incidents.v1",
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
}) {
  const reasons: string[] = [];
  const { checks, criticalChecks, vehicle, driver } = args;

  for (const [item, result] of Object.entries(checks)) {
    const critical = criticalChecks.includes(item);
    if (critical && result !== "pass") {
      reasons.push(item + " must explicitly PASS");
      continue;
    }
    if (!critical && result === "unset") {
      reasons.push(item + " is incomplete");
      continue;
    }
    if (result === "fail") {
      reasons.push(item + " failed");
    }
  }

  if (!driver.siteAuthorised) reasons.push("Driver is not site-authorised");
  if (args.requireOpenPitPermit && !driver.openPitPermit) reasons.push("Required site driving permit is missing");
  if (!dateIsCurrent(vehicle.roadworthyExpiry)) reasons.push("Roadworthiness record is expired or missing");
  if (!dateIsCurrent(vehicle.extinguisherServiceDue)) reasons.push("Fire extinguisher service date is expired or missing");
  if (vehicle.status === "Maintenance" || vehicle.status === "Out of service") {
    reasons.push("Vehicle is unavailable due to current fleet status");
  }

  return {
    result: reasons.length === 0 ? "GO" as const : "NO-GO" as const,
    reasons,
  };
}
